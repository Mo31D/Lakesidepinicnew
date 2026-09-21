# Lakeside Picnic

The public site is built from `src/` and deployed to GitHub Pages at
https://www.lakesidepicnic.co.uk. The original Work/Sites design is retained.

## Edit and validate

- Product facts and existing image paths: `src/catalogue.json`.
- Shared page components: `src/components/storefront.tsx`.
- Design and responsive styling: `src/styles/storefront.css`.
- Retained primitive/UI styles: `src/styles/primitives.css`.
- Routes and search metadata: `src/lib/routes.ts` and `src/lib/seo.ts`.
- Intrinsic sizes of current images: `src/lib/image-dimensions.ts`.

```sh
npm ci
npm run check
npm run build
python3 scripts/verify-static.py
node scripts/test-selection.mjs
node scripts/package-static.mjs
```

The build regenerates every HTML page, `site.css`, `site.js`, the sitemap and
`PACKAGE-CONTENTS.json`. Never edit generated pages or use them as build inputs.
`npm run dev` serves the current static build; rebuild after source edits.

On a main-branch source change, the build workflow validates TypeScript, builds,
checks all public pages and the catalogue, tests selection rules, safely commits
generated output and deploys the verified `dist/` artifact to GitHub Pages.
Pull requests run the same validation without committing or publishing. A source
revision superseded on remote main is not published. No force-push is used.

The package manifest includes only public files. Source files, dependencies,
QA harnesses and internal Work state are excluded from the deployment artifact.
The catalogue remains 178 records, with 177 visible and the seasonal sandwich
record retained but hidden/unavailable. Customer lists stay in their browser.
