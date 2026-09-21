import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { createRequire } from "node:module";
import { execFileSync } from "node:child_process";
import { build } from "esbuild";

// Source is authoritative. Never read generated HTML, JS or CSS as build input.
const work = path.resolve(".sites-runtime/static");
fs.mkdirSync(work, { recursive: true });
await build({
  entryPoints: ["src/scripts/static-render.tsx"],
  bundle: true,
  platform: "node",
  format: "cjs",
  jsx: "automatic",
  outfile: path.join(work, "render.cjs"),
  logLevel: "warning",
});
const require = createRequire(import.meta.url);
const { render, allRoutes, resolvePage, origin, structuredData } = require(
  path.join(work, "render.cjs"),
);
const data = JSON.parse(fs.readFileSync("src/catalogue.json", "utf8"));
const escape = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
const serialised = JSON.stringify(data).replaceAll("<", "\\u003c");
const routes = [...new Set(allRoutes(data))];
const filename = (route) =>
  route === "/"
    ? "index.html"
    : route.endsWith(".html")
      ? route.slice(1)
      : route.replace(/^\//, "").replace(/\/$/, "") + "/index.html";
await build({
  entryPoints: ["src/scripts/static-client.tsx"],
  bundle: true,
  minify: true,
  platform: "browser",
  format: "iife",
  jsx: "automatic",
  outfile: "site.js",
  define: { "process.env.NODE_ENV": '"production"' },
  logLevel: "warning",
});
await build({
  stdin: {
    contents:
      '@import "./src/styles/primitives.css";\n@import "./src/styles/storefront.css";',
    resolveDir: process.cwd(),
    loader: "css",
  },
  bundle: true,
  minify: true,
  outfile: "site.css",
  logLevel: "warning",
});
const digest = (file) =>
  crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const cssHash = digest("site.css").slice(0, 12),
  jsHash = digest("site.js").slice(0, 12);
for (const route of routes) {
  const page = resolvePage(route, data);
  if (!page) throw Error("No page for " + route);
  const dest = filename(route),
    base = path.posix.relative(path.posix.dirname(dest), ".") || ".";
  const product =
    page.kind === "product"
      ? data.products.find((p) => p.id === page.productId)
      : null;
  const socialImage = product
    ? product.image
      ? origin + product.image
      : null
    : origin + "/brand/identity-board.jpeg";
  const title = page.title + " | Lakeside Picnic";
  const robots =
    page.kind === "selection"
      ? '<meta name="robots" content="noindex,follow">'
      : "";
  const social = socialImage
    ? '<meta property="og:image" content="' +
      escape(socialImage) +
      '"><meta property="og:image:alt" content="' +
      escape(product?.name || "Lakeside Picnic") +
      '"><meta name="twitter:image" content="' +
      escape(socialImage) +
      '">'
    : "";
  const html =
    '<!doctype html><html lang="en" data-route="' +
    escape(route) +
    '" data-base="' +
    base +
    '"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' +
    escape(title) +
    "</title>" +
    robots +
    '<meta name="description" content="' +
    escape(page.description) +
    '"><link rel="canonical" href="' +
    origin +
    page.path +
    '"><meta property="og:type" content="' +
    (product ? "product" : "website") +
    '"><meta property="og:site_name" content="Lakeside Picnic"><meta property="og:locale" content="en_GB"><meta property="og:title" content="' +
    escape(title) +
    '"><meta property="og:description" content="' +
    escape(page.description) +
    '"><meta property="og:url" content="' +
    origin +
    page.path +
    '"><meta name="twitter:card" content="' +
    (socialImage ? "summary_large_image" : "summary") +
    '"><meta name="twitter:title" content="' +
    escape(title) +
    '"><meta name="twitter:description" content="' +
    escape(page.description) +
    '">' +
    social +
    '<link rel="icon" href="' +
    base +
    '/favicon.svg"><link rel="stylesheet" href="' +
    base +
    "/site.css?v=" +
    cssHash +
    '"><script type="application/ld+json">' +
    structuredData(data, page) +
    '</script></head><body><div id="root">' +
    render(data, route, base) +
    '</div><script type="application/json" id="lp-catalogue">' +
    serialised +
    '</script><script defer src="' +
    base +
    "/site.js?v=" +
    jsHash +
    '"></script></body></html>';
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, html);
}
const canonicalRoutes = [
  ...new Set(routes.map((r) => resolvePage(r, data).path)),
].filter((r) => r !== "/my-list.html");
fs.writeFileSync(
  "sitemap.xml",
  '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
    canonicalRoutes
      .map((r) => "<url><loc>" + origin + escape(r) + "</loc></url>")
      .join("") +
    "</urlset>",
);
fs.writeFileSync(
  "404.html",
  '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page not found | Lakeside Picnic</title><meta name="robots" content="noindex,follow"><style>body{font:18px/1.6 system-ui,sans-serif;margin:10vh auto;padding:24px;max-width:640px;color:#1b3c34}a{color:inherit}</style></head><body><main><h1>This page has wandered off.</h1><p>Let’s get you back to the good things.</p><a href="https://www.lakesidepicnic.co.uk/">Back to the shop</a></main></body></html>',
);
// Public files only. Source, tooling and temporary QA files never enter the deployment.
const publicDirs = [
  "brand",
  "optimized",
  "product-images",
  "gifts",
  "images",
  "Icecream",
  "Mintcake",
  "hotdrinks",
  "to-do",
];
const files = new Set([
  ...routes.map(filename),
  "404.html",
  "site.js",
  "site.css",
  "sitemap.xml",
  "robots.txt",
  "favicon.svg",
  "CNAME",
  ".nojekyll",
]);
function collect(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.posix.join(dir, entry.name);
    if (entry.isDirectory()) collect(file);
    else if (/\.(webp|png|jpe?g|svg|ico)$/i.test(file)) files.add(file);
  }
}
publicDirs.forEach(collect);
let sourceCommit;
try {
  sourceCommit = execFileSync("git", ["rev-parse", "HEAD"], {
    encoding: "utf8",
  }).trim();
} catch {}
const manifest = {
  version: 6,
  variant: "source-driven-static",
  sourceCommit,
  sourceDirectory: "src",
  catalogueRevision: data.revision,
  files: [...files]
    .sort()
    .map((file) => ({ path: file, sha256: digest(file) })),
};
fs.writeFileSync(
  "PACKAGE-CONTENTS.json",
  JSON.stringify(manifest, null, 2) + "\n",
);
console.log(
  `Rendered ${new Set(routes.map(filename)).size + 1} pages; ${data.products.length} catalogue records; ${manifest.files.length} public files.`,
);
