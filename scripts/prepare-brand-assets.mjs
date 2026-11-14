#!/usr/bin/env node
/**
 * Regenerates the web-ready brand assets in public/brand from the originals in
 * assets/brand-source (JPEG files on a white background, as delivered).
 *
 *   node scripts/prepare-brand-assets.mjs
 *
 * - "dark" variants keep the original colours and remove the white background
 *   (for light surfaces such as the nav and the footer).
 * - "light" variants turn the navy wordmark and tagline white while keeping the
 *   cyan-to-blue brand colours (for dark bands and the dark nav).
 * - The mark is exported as a transparent square for icons and watermarks.
 */
import sharp from "sharp";

const SRC = "assets/brand-source";
const OUT = "public/brand";

const smoothstep = (edge0, edge1, x) => {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
};

/**
 * White → transparent. Alpha comes from how far the pixel is from white; the colour is
 * un-mixed from white so anti-aliased edges do not keep a white fringe.
 * With `lightText`, low-chroma dark pixels (the navy wordmark and tagline) become white,
 * with alpha taken from their darkness so letter edges stay smooth.
 */
function removeWhite(data, { lightText = false } = {}) {
  const out = Buffer.alloc((data.length / 3) * 4);
  for (let i = 0, j = 0; i < data.length; i += 3, j += 4) {
    const r = data[i],
      g = data[i + 1],
      b = data[i + 2];
    const distance = 255 - Math.min(r, g, b);
    let alpha = smoothstep(10, 46, distance);

    // Brand colours are blue-dominant; the navy text and its anti-aliased edges are not.
    const isText = b - r < 80;
    if (lightText && isText) {
      const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      alpha = Math.min(1, Math.max(0, (250 - luminance) / (250 - 45)));
      out[j] = out[j + 1] = out[j + 2] = 255;
      out[j + 3] = Math.round(alpha * 255);
      continue;
    }

    const unmix = (c) => (alpha > 0 ? Math.round((c - (1 - alpha) * 255) / alpha) : 0);
    out[j] = Math.min(255, Math.max(0, unmix(r)));
    out[j + 1] = Math.min(255, Math.max(0, unmix(g)));
    out[j + 2] = Math.min(255, Math.max(0, unmix(b)));
    out[j + 3] = Math.round(alpha * 255);
  }
  return out;
}

async function exportVariant(source, target, { width, lightText = false, square = false }) {
  const { data, info } = await sharp(`${SRC}/${source}`)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const rgba = removeWhite(data, { lightText });
  let image = sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } }).trim({
    threshold: 1,
  });
  image = square
    ? image.resize({
        width,
        height: width,
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
    : image.resize({ width });
  const result = await image
    .png({ compressionLevel: 9, palette: false })
    .toFile(`${OUT}/${target}`);
  console.log(
    `${target.padEnd(32)} ${result.width}x${result.height}  ${(result.size / 1024).toFixed(1)} KB`,
  );
}

await exportVariant("logo-horizontal.jpg", "lguia-logo-dark.png", { width: 480 });
await exportVariant("logo-horizontal.jpg", "lguia-logo-light.png", { width: 480, lightText: true });
await exportVariant("logo-tagline.jpg", "lguia-logo-tagline-dark.png", { width: 560 });
await exportVariant("logo-tagline.jpg", "lguia-logo-tagline-light.png", {
  width: 560,
  lightText: true,
});
await exportVariant("mark.jpg", "lguia-mark.png", { width: 512, square: true });

// App icons (Next.js file conventions). iOS fills transparency with black, so the Apple
// touch icon gets an opaque white tile with breathing room around the mark.
const mark = sharp(`${OUT}/lguia-mark.png`);
await mark.clone().resize(64, 64).png({ compressionLevel: 9 }).toFile("src/app/icon.png");
await sharp({ create: { width: 180, height: 180, channels: 4, background: "#ffffff" } })
  .composite([{ input: await mark.clone().resize(136, 136).toBuffer(), gravity: "center" }])
  .png({ compressionLevel: 9 })
  .toFile("src/app/apple-icon.png");
console.log("src/app/icon.png, src/app/apple-icon.png");
