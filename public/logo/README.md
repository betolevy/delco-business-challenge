# Brand assets

`delco-white.svg`, `delco-black.svg`, and `icon-source.svg` here are the **real** delco
wordmark — vector paths extracted directly from the official brand files
(`LOGO-PANTONES-TODOS copy.pdf`, Pantone 287 C = `#002F87`), with the
"delvalle, escalona, levy & corró" subtitle removed per the brand brief (mark only, no
subtitle). `src/components/Logo.tsx` inlines the same path data so it can be recolored
via the `variant` prop without an extra network request.

If the underlying brand mark ever changes, regenerate these by exporting a clean
single-color version from the source Illustrator file and re-running
`scripts/generate-icons.mjs` for the PWA icon PNGs.
