/**
 * Re-encodes the background videos for the web without ffmpeg (SPEC-002 v2, media pipeline).
 *
 *   node scripts/encode-videos.mjs
 *
 * Reads the originals in assets/media-source/ and writes public/media/video/<name>.mp4 plus a
 * first-frame poster. Chrome does the work through WebCodecs (Playwright is already a dev
 * dependency); this file only muxes the H.264 chunks into a fast-start MP4:
 *
 * - no audio track (the videos are always muted);
 * - `moov` before `mdat`, so playback can start before the whole file arrives;
 * - a keyframe every `gop` frames: the scroll-scrubbed hero uses a short interval so every
 *   seek decodes at most a few frames; the looping band uses a normal one;
 * - a constant frame rate and a bitrate tuned for footage that always sits under a dark overlay.
 *
 * With ffmpeg available, equivalent commands are documented in MEMORY.md (Media pipeline).
 */
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

import { chromium } from "@playwright/test";

const SOURCE_DIR = "assets/media-source";
const OUTPUT_DIR = "public/media/video";

const VIDEOS = [
  // Scrubbed by scroll: short keyframe interval for cheap seeks in both directions.
  { name: "hero-connections", gop: 4, bitrate: 2_200_000 },
  // Plays normally in a loop: a regular 2 s keyframe interval keeps the file small.
  { name: "process-neural", gop: 48, bitrate: 1_200_000 },
];
const FPS = 24;
const CODEC = "avc1.640028"; // H.264 High 4.0: plays everywhere, hardware-decoded

/* ---------- Source parsing: frame presentation times from the MP4 sample table ---------- */

function readBoxes(buf, start, end, visit) {
  let p = start;
  while (p + 8 <= end) {
    let size = buf.readUInt32BE(p);
    const type = buf.toString("latin1", p + 4, p + 8);
    let header = 8;
    if (size === 1) {
      size = Number(buf.readBigUInt64BE(p + 8));
      header = 16;
    }
    if (size === 0) size = end - p;
    visit(type, p + header, p + size);
    p += size;
  }
}

function videoFrameTimes(buf) {
  const containers = new Set(["moov", "trak", "mdia", "minf", "stbl"]);
  const tracks = [];
  let track;
  const visit = (type, body, end) => {
    if (type === "trak") tracks.push((track = {}));
    if (type === "hdlr") track.handler = buf.toString("latin1", body + 8, body + 12);
    if (type === "mdhd") track.timescale = buf.readUInt32BE(body + (buf[body] === 1 ? 20 : 12));
    if (type === "stts") {
      track.stts = [];
      const count = buf.readUInt32BE(body + 4);
      for (let i = 0; i < count; i++) {
        track.stts.push([buf.readUInt32BE(body + 8 + i * 8), buf.readUInt32BE(body + 12 + i * 8)]);
      }
    }
    if (containers.has(type)) readBoxes(buf, body, end, visit);
  };
  readBoxes(buf, 0, buf.length, visit);
  const video = tracks.find((t) => t.handler === "vide");
  if (!video?.stts) throw new Error("No video track found");
  // Seek to the middle of each frame so rounding never lands on its neighbour.
  const times = [];
  let t = 0;
  for (const [count, delta] of video.stts) {
    for (let i = 0; i < count; i++) {
      times.push((t + delta / 2) / video.timescale);
      t += delta;
    }
  }
  return times;
}

/* ---------- MP4 muxing (ISO BMFF, single H.264 track, fast start) ---------- */

const u16 = (v) => {
  const b = Buffer.alloc(2);
  b.writeUInt16BE(v);
  return b;
};
const u32 = (v) => {
  const b = Buffer.alloc(4);
  b.writeUInt32BE(v);
  return b;
};
const zeros = (n) => Buffer.alloc(n);
const MATRIX = Buffer.concat([0x00010000, 0, 0, 0, 0x00010000, 0, 0, 0, 0x40000000].map(u32));

function box(type, ...payload) {
  const body = Buffer.concat(payload);
  return Buffer.concat([u32(8 + body.length), Buffer.from(type, "latin1"), body]);
}
const fullBox = (type, version, flags, ...payload) =>
  box(type, u32((version << 24) | flags), ...payload);

function muxMp4({ width, height, description, samples }) {
  const timescale = FPS * 1000;
  const delta = 1000;
  const duration = samples.length * delta;
  const durationMs = Math.round((samples.length / FPS) * 1000);
  const keyframes = samples.flatMap((s, i) => (s.key ? [i + 1] : []));

  const moov = (chunkOffset) =>
    box(
      "moov",
      fullBox(
        "mvhd",
        0,
        0,
        u32(0),
        u32(0),
        u32(1000),
        u32(durationMs),
        u32(0x00010000),
        u16(0x0100),
        zeros(10),
        MATRIX,
        zeros(24),
        u32(2),
      ),
      box(
        "trak",
        fullBox(
          "tkhd",
          0,
          3,
          u32(0),
          u32(0),
          u32(1),
          zeros(4),
          u32(durationMs),
          zeros(8),
          u16(0),
          u16(0),
          u16(0),
          zeros(2),
          MATRIX,
          u32(width << 16),
          u32(height << 16),
        ),
        box(
          "mdia",
          fullBox("mdhd", 0, 0, u32(0), u32(0), u32(timescale), u32(duration), u16(0x55c4), u16(0)),
          fullBox(
            "hdlr",
            0,
            0,
            u32(0),
            Buffer.from("vide"),
            zeros(12),
            Buffer.from("VideoHandler\0"),
          ),
          box(
            "minf",
            fullBox("vmhd", 0, 1, zeros(8)),
            box("dinf", fullBox("dref", 0, 0, u32(1), fullBox("url ", 0, 1))),
            box(
              "stbl",
              fullBox(
                "stsd",
                0,
                0,
                u32(1),
                box(
                  "avc1",
                  zeros(6),
                  u16(1),
                  zeros(16),
                  u16(width),
                  u16(height),
                  u32(0x00480000),
                  u32(0x00480000),
                  zeros(4),
                  u16(1),
                  zeros(32),
                  u16(0x0018),
                  u16(0xffff),
                  box("avcC", description),
                ),
              ),
              fullBox("stts", 0, 0, u32(1), u32(samples.length), u32(delta)),
              fullBox("stss", 0, 0, u32(keyframes.length), ...keyframes.map(u32)),
              fullBox("stsc", 0, 0, u32(1), u32(1), u32(samples.length), u32(1)),
              fullBox(
                "stsz",
                0,
                0,
                u32(0),
                u32(samples.length),
                ...samples.map((s) => u32(s.data.length)),
              ),
              fullBox("stco", 0, 0, u32(1), u32(chunkOffset)),
            ),
          ),
        ),
      ),
    );

  const ftyp = box("ftyp", Buffer.from("isom"), u32(512), Buffer.from("isomiso2avc1mp41"));
  const mdatBody = Buffer.concat(samples.map((s) => s.data));
  // moov's size does not depend on the offset value, so measure once and rebuild.
  const offset = ftyp.length + moov(0).length + 8;
  return Buffer.concat([
    ftyp,
    moov(offset),
    u32(8 + mdatBody.length),
    Buffer.from("mdat"),
    mdatBody,
  ]);
}

/* ---------- Encoding in Chrome (WebCodecs) ---------- */

async function encodeInBrowser(page, { source, frameTimes, gop, bitrate }) {
  return page.evaluate(
    async ({ sourceBase64, frameTimes, gop, bitrate, fps, codec }) => {
      const toBase64 = (bytes) => {
        let s = "";
        for (let i = 0; i < bytes.length; i += 0x8000) {
          s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
        }
        return btoa(s);
      };
      const bytes = Uint8Array.from(atob(sourceBase64), (c) => c.charCodeAt(0));
      const video = document.createElement("video");
      video.muted = true;
      video.preload = "auto";
      video.src = URL.createObjectURL(new Blob([bytes], { type: "video/mp4" }));
      document.body.append(video);
      await new Promise((resolve, reject) => {
        video.onloadeddata = resolve;
        video.onerror = () => reject(new Error("Cannot decode the source video"));
      });
      const { videoWidth: width, videoHeight: height } = video;

      const chunks = [];
      let description;
      let failure;
      const encoder = new VideoEncoder({
        output: (chunk, meta) => {
          if (meta?.decoderConfig?.description) {
            description = new Uint8Array(meta.decoderConfig.description);
          }
          const data = new Uint8Array(chunk.byteLength);
          chunk.copyTo(data);
          chunks.push({ key: chunk.type === "key", timestamp: chunk.timestamp, data });
        },
        error: (error) => {
          failure = error;
        },
      });
      encoder.configure({
        codec,
        width,
        height,
        bitrate,
        bitrateMode: "variable",
        framerate: fps,
        latencyMode: "quality",
        avc: { format: "avc" },
      });

      let poster;
      for (let i = 0; i < frameTimes.length; i++) {
        video.currentTime = frameTimes[i];
        await new Promise((resolve) => video.addEventListener("seeked", resolve, { once: true }));
        if (i === 0) {
          const canvas = new OffscreenCanvas(width, height);
          canvas.getContext("2d").drawImage(video, 0, 0);
          const blob = await canvas.convertToBlob({ type: "image/jpeg", quality: 0.82 });
          poster = toBase64(new Uint8Array(await blob.arrayBuffer()));
        }
        const frame = new VideoFrame(video, {
          timestamp: Math.round((i * 1e6) / fps),
          duration: Math.round(1e6 / fps),
        });
        encoder.encode(frame, { keyFrame: i % gop === 0 });
        frame.close();
        while (encoder.encodeQueueSize > 8) await new Promise((r) => setTimeout(r, 5));
      }
      await encoder.flush();
      encoder.close();
      if (failure) throw failure;
      if (!description) throw new Error("The encoder returned no avcC description");
      for (let i = 1; i < chunks.length; i++) {
        if (chunks[i].timestamp <= chunks[i - 1].timestamp) throw new Error("Out-of-order frames");
      }
      return {
        width,
        height,
        poster,
        description: toBase64(description),
        samples: chunks.map((c) => ({ key: c.key, data: toBase64(c.data) })),
      };
    },
    { sourceBase64: source.toString("base64"), frameTimes, gop, bitrate, fps: FPS, codec: CODEC },
  );
}

const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || "chrome" });
const page = await browser.newPage();
// WebCodecs needs a secure context: serve an empty page from a fake HTTPS origin.
await page.route("https://encoder.local/", (route) =>
  route.fulfill({ contentType: "text/html", body: "<!doctype html><title>encoder</title>" }),
);
await page.goto("https://encoder.local/");

for (const { name, gop, bitrate } of VIDEOS) {
  const source = await readFile(join(SOURCE_DIR, `${name}.mp4`));
  const frameTimes = videoFrameTimes(source);
  const result = await encodeInBrowser(page, { source, frameTimes, gop, bitrate });
  const samples = result.samples.map((s) => ({ key: s.key, data: Buffer.from(s.data, "base64") }));
  const mp4 = muxMp4({
    width: result.width,
    height: result.height,
    description: Buffer.from(result.description, "base64"),
    samples,
  });
  await writeFile(join(OUTPUT_DIR, `${name}.mp4`), mp4);
  await writeFile(join(OUTPUT_DIR, `${name}-poster.jpg`), Buffer.from(result.poster, "base64"));
  const keyframes = samples.filter((s) => s.key).length;
  console.log(
    `${name}: ${samples.length} frames, ${keyframes} keyframes, ` +
      `${(source.length / 1e6).toFixed(2)} MB → ${(mp4.length / 1e6).toFixed(2)} MB`,
  );
}

await browser.close();
