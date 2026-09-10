"""Check the generated storefront and all portable local references."""
import hashlib, json, re
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
ROOT=Path(__file__).resolve().parent.parent
errors=[]; checks=0; payloads=set(); pages=0
class Page(HTMLParser):
    def __init__(self):super().__init__();self.refs=[];self.ids=[]
    def handle_starttag(self,tag,attrs):
        d=dict(attrs)
        if 'id' in d:self.ids.append(d['id'])
        self.refs.extend(d[k] for k in ('src','href') if k in d)
for p in ROOT.rglob('*.html'):
    if any(x.startswith('.') or x in ('src','node_modules') for x in p.relative_to(ROOT).parts):continue
    pages+=1;s=p.read_text();html=Page();html.feed(s)
    for ref in html.refs:
        u=urlsplit(ref)
        if u.scheme or u.netloc:continue
        if u.path:
            target=(p.parent/unquote(u.path)).resolve()
            if target.is_dir():target/='index.html'
            checks+=1
            if u.path.startswith('/') or not target.is_relative_to(ROOT) or not target.is_file():errors.append(f'{p.relative_to(ROOT)}: {ref}')
        elif u.fragment and unquote(u.fragment) not in html.ids:errors.append(f'Missing anchor {ref} in {p}')
    m=re.search(r'<script type="application/json" id="lp-catalogue">(.*?)</script>',s,re.S)
    if m:
        payloads.add(m[1])
        if '<main id="main">' not in s:errors.append(f'Missing prerendered content: {p}')
if len(payloads)!=1:errors.append('Inconsistent page catalogues')
d=json.loads(next(iter(payloads)))
if d!=json.loads((ROOT/'src/catalogue.json').read_text()):errors.append('Source and built catalogue differ')
for p in d['products']:
    image=p['image']
    if not image.startswith('/'):continue
    if re.match(r'^/(Icecream|Mintcake|hotdrinks|images|to-do)/',image) and re.search(r'\.(png|jpe?g)$',image,re.I):image='/optimized'+re.sub(r'\.[^.]+$','.webp',image)
    checks+=1
    if not (ROOT/image[1:]).is_file():errors.append('Missing product image '+image)
gifts=(ROOT/'souvenirs.html').read_text().split('<script type="application/json"')[0]
if any('category-'+c in gifts for c in ('romneys','drinks','snacks')):errors.append('Food is shown in Gifts')
drinks=(ROOT/'drinks.html').read_text().split('<script type="application/json"')[0]
if 'Sandwiches temporarily unavailable' not in drinks or 'supply issues' not in drinks:errors.append('Missing sandwich notice')
if len(re.findall(r'<article class="product-card [^"]*category-drinks"',drinks))!=29:errors.append('Expected 29 drinks')
for f in json.loads((ROOT/'PACKAGE-CONTENTS.json').read_text())['files']:
    p=ROOT/f['path'];checks+=1
    if not p.is_file() or hashlib.sha256(p.read_bytes()).hexdigest()!=f['sha256']:errors.append('Manifest mismatch '+f['path'])
print(json.dumps({'pages':pages,'checks':checks,'errors':errors},indent=2))
raise SystemExit(bool(errors))
