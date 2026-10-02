# Fonts for generated images

`schibsted-grotesk-latin-400.woff` and `schibsted-grotesk-latin-700.woff` are static instances of
**Schibsted Grotesk** (latin subset), licensed under the
[SIL Open Font License 1.1](https://openfontlicense.org).

They are only used by `src/app/opengraph-image.tsx`, because the image renderer (Satori) cannot
read WOFF2 or variable fonts. Web pages load the font through `next/font/google`.
