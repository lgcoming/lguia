import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

/*
 * Every page is prerendered and nothing revalidates (no ISR, no "use cache"), so the prerendered
 * HTML is served from Workers static assets: read-only, no R2 bucket or KV namespace to manage.
 */
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
  enableCacheInterception: true,
});
