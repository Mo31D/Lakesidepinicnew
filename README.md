# Lakeside Picnic

Static public website for GitHub Pages and local HTML viewers. Publish the
repository root and retain all image folders alongside the HTML, CSS and JS.

Edit `src/catalogue.json` for products, `src/components/storefront.tsx` for
pages/navigation and `src/menu-updates.css` for the additional styles.

```sh
npm ci
npm run build
npm run check
python3 scripts/verify-static.py
```

Commit the generated pages, site.js, site.css, sitemap and package manifest
with the source changes. `npm run dev` starts a development preview. There is
no hosted administration backend in this static website. Customer lists stay
in the browser. See CHANGE-NOTES.md for current validation and pending work.
