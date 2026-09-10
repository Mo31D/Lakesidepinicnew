import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {createRequire} from 'node:module';
import {build} from 'esbuild';

const work=path.resolve('.sites-runtime/static');
fs.mkdirSync(work,{recursive:true});
await build({entryPoints:['src/scripts/static-render.tsx'],bundle:true,platform:'node',format:'cjs',jsx:'automatic',outfile:path.join(work,'render.cjs'),logLevel:'warning'});
const require=createRequire(import.meta.url);
const {render,allRoutes,resolvePage,origin,structuredData}=require(path.join(work,'render.cjs'));
const data=JSON.parse(fs.readFileSync('src/catalogue.json','utf8'));
const escape=v=>String(v).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const serialised=JSON.stringify(data).replaceAll('<','\\u003c');
const routes=[...new Set([...allRoutes(data),'/index.html'])];
await build({entryPoints:['src/scripts/static-client.tsx'],bundle:true,minify:true,platform:'browser',format:'iife',jsx:'automatic',outfile:'site.js',define:{'process.env.NODE_ENV':'"production"'},logLevel:'warning'});
const marker='/* LP_MENU_UPDATE_2026_09 */';
fs.writeFileSync('site.css',fs.readFileSync('site.css','utf8').split(marker)[0].trimEnd()+'\n\n'+marker+'\n'+fs.readFileSync('src/menu-updates.css','utf8'));
const filename=route=>route==='/'?'index.html':route.endsWith('.html')?route.slice(1):route.slice(1)+'/index.html';
for(const route of routes){
 const page=resolvePage(route,data);if(!page)throw Error('No page for '+route);
 const dest=filename(route),base=path.posix.relative(path.posix.dirname(dest),'.')||'.';
 const html='<!doctype html><html lang="en" data-route="'+escape(route)+'" data-base="'+base+'"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+escape(page.title)+' | Lakeside Picnic</title><meta name="description" content="'+escape(page.description)+'"><link rel="canonical" href="'+origin+page.path+'"><link rel="icon" href="'+base+'/favicon.svg"><link rel="stylesheet" href="'+base+'/site.css"><script type="application/ld+json">'+structuredData(data)+'</script></head><body><div id="root">'+render(data,route,base)+'</div><script type="application/json" id="lp-catalogue">'+serialised+'</script><script defer src="'+base+'/site.js"></script></body></html>';
 fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,html);
}
fs.writeFileSync('sitemap.xml','<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+[...new Set(routes.map(r=>resolvePage(r,data).path))].filter(r=>r!=='/my-list.html').map(r=>'<url><loc>'+origin+escape(r)+'</loc></url>').join('')+'</urlset>');
fs.writeFileSync('404.html','<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page not found | Lakeside Picnic</title><style>body{font:18px/1.6 system-ui,sans-serif;margin:10vh auto;padding:24px;max-width:640px;color:#1b3c34}a{color:inherit}</style></head><body><main><h1>This page has wandered off.</h1><p>Let’s get you back to the good things.</p><a href="https://mo31d.github.io/Lakesidepinicnew/">Back to the shop</a></main></body></html>');
const manifest=JSON.parse(fs.readFileSync('PACKAGE-CONTENTS.json','utf8'));
const files=new Set([...manifest.files.map(f=>f.path),...routes.map(filename)]);
for(const p of data.products)if(p.image.startsWith('/gifts/'))files.add(p.image.slice(1));
manifest.files=[...files].sort().map(f=>({path:f,sha256:crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex')}));
Object.assign(manifest,{version:5,variant:'github-pages-relative-paths',sourceDirectory:'src',catalogueRevision:data.revision});
fs.writeFileSync('PACKAGE-CONTENTS.json',JSON.stringify(manifest,null,2)+'\n');
console.log('Rendered '+routes.length+' complete pages with portable links. Existing images and base stylesheet preserved.');
