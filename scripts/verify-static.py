"""Validate the generated public package, content, links and structured data."""
import hashlib,json,re,collections
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
ROOT=Path(__file__).resolve().parent.parent
errors=[];checks=0
manifest=json.loads((ROOT/'PACKAGE-CONTENTS.json').read_text())
data=json.loads((ROOT/'src/catalogue.json').read_text())
categories={c['id'] for c in data['categories'] if c['visible']}
products=[p for p in data['products'] if p['visible'] and p['category'] in categories]
gifts={'souvenirs','traditional','peter-rabbit','toys','sunny-days','maps-books'}
product_by_path={(p['path'] or '/products/'+p['id']):p for p in products}

def check(ok,message):
 global checks
 checks+=1
 if not ok:errors.append(message)

class Page(HTMLParser):
 def __init__(self):
  super().__init__();self.refs=[];self.ids=[];self.images=[];self.meta={};self.links={};self.h1=0;self.lang=None;self.main=False;self.article_names=[];self.scripts=[];self.script=None
 def handle_starttag(self,tag,attrs):
  d=dict(attrs)
  if 'id' in d:self.ids.append(d['id'])
  if tag=='html':self.lang=d.get('lang')
  if tag=='main':self.main=True
  if tag=='h1':self.h1+=1
  if tag=='img':self.images.append(d)
  if tag=='meta':self.meta[d.get('name') or d.get('property')]=d.get('content')
  if tag=='link':self.links[d.get('rel')]=d.get('href')
  if tag=='script':self.script={'attrs':d,'text':''}
  self.refs.extend(d[k] for k in ('src','href') if k in d)
 def handle_data(self,text):
  if self.script is not None:self.script['text']+=text
 def handle_endtag(self,tag):
  if tag=='script' and self.script is not None:self.scripts.append(self.script);self.script=None

for record in manifest['files']:
 p=ROOT/record['path'];check(p.is_file(),f'Missing package file {record["path"]}')
 if p.is_file():check(hashlib.sha256(p.read_bytes()).hexdigest()==record['sha256'],f'Manifest mismatch {record["path"]}')

page_paths=[ROOT/f['path'] for f in manifest['files'] if f['path'].endswith('.html')]
for path in page_paths:
 text=path.read_text();p=Page();p.feed(text);label=path.relative_to(ROOT).as_posix()
 check(p.lang=='en',f'{label}: lang');check(p.main,f'{label}: main landmark');check(p.h1==1,f'{label}: expected one h1');check(len(p.ids)==len(set(p.ids)),f'{label}: duplicate IDs')
 for ref in p.refs:
  u=urlsplit(ref)
  if u.scheme or u.netloc:continue
  if u.path:
   target=(path.parent/unquote(u.path)).resolve()
   if target.is_dir():target/='index.html'
   check(not u.path.startswith('/') and target.is_relative_to(ROOT) and target.is_file(),f'{label}: missing local reference {ref}')
  elif u.fragment:check(unquote(u.fragment) in p.ids,f'{label}: missing anchor {ref}')
 for im in p.images:check('alt' in im,f'{label}: missing image alt')
 if label=='404.html':check(p.meta.get('robots')=='noindex,follow','404 must remain noindex');continue
 check(bool(re.search(r'<title>[^<]+</title>',text)),f'{label}: title')
 for key in ['description','og:title','og:description','og:url','twitter:card','twitter:title','twitter:description']:check(bool(p.meta.get(key)),f'{label}: {key}')
 canonical=p.links.get('canonical','');check(canonical.startswith('https://www.lakesidepicnic.co.uk/'),f'{label}: canonical origin');check(p.meta.get('og:url')==canonical,f'{label}: social canonical')
 for im in p.images:check(bool(im.get('width')) and bool(im.get('height')),f'{label}: missing intrinsic image size {im.get("src")}')
 payload=next((s['text'] for s in p.scripts if s['attrs'].get('id')=='lp-catalogue'),None)
 check(payload is not None,f'{label}: catalogue payload')
 if payload:check(json.loads(payload)==data,f'{label}: source/catalogue mismatch')
 schema=next((s['text'] for s in p.scripts if s['attrs'].get('type')=='application/ld+json'),None)
 check(bool(schema),f'{label}: structured data')
 if not schema:continue
 graph=json.loads(schema)['@graph'];types=[n['@type'] for n in graph]
 check('WebSite' in types and 'WebPage' in types,f'{label}: missing website graph')
 cp=urlsplit(canonical).path
 product=product_by_path.get(cp)
 if product:
  node=next((n for n in graph if n['@type']=='Product'),{})
  check(node.get('sku')==product['id'],f'{label}: product identity')
  price=data['settings']['singlePrice'] if product['category']=='ice-cream' else product['price']
  if price is not None:check(float(node.get('offers',{}).get('price',-1))==price,f'{label}: offer price')
  check(bool(p.meta.get('og:image'))==bool(product['image']),f'{label}: unrelated social image')
 category={'/icecream.html':'ice-cream','/hotdrinks.html':'coffee','/romneys.html':'romneys','/souvenirs.html':'gifts','/drinks.html':'drinks','/menu.html':'all'}.get(cp)
 if category:
  expected=[x for x in products if category=='all' or (x['category'] in gifts if category=='gifts' else x['category'] in {'drinks','snacks'} if category=='drinks' else x['category']==category)]
  node=next((n for n in graph if n['@type']=='ItemList'),{})
  check(len(node.get('itemListElement',[]))==len(expected),f'{label}: ItemList differs from visible catalogue')
  check(text.split('<script type="application/json"')[0].count('<article class="product-card')==len(expected),f'{label}: rendered card count')
 if label=='my-list.html':check(p.meta.get('robots')=='noindex,follow','List utility must remain noindex')

sitemap=(ROOT/'sitemap.xml').read_text()
check('/my-list.html' not in sitemap and '/404.html' not in sitemap,'Utility pages in sitemap')
check(len(products)==len(set(p['id'] for p in products)),'Duplicate product IDs')
for p in data['products']:
 if p['category']=='sandwiches':check(not p['visible'] and not p['available'],'Unavailable sandwiches exposed')
 for field in ['image']:
  if p[field]:check((ROOT/p[field].lstrip('/')).is_file(),f'{p["id"]}: missing original image')
 for gallery_image in p.get('gallery',[]):
  src=gallery_image.get('src','')
  if src:check((ROOT/src.lstrip('/')).is_file(),f'{p["id"]}: missing gallery image {src}')
visible_drinks=(ROOT/'drinks.html').read_text().split('<script type="application/json"')[0]
check('Sandwiches temporarily unavailable' in visible_drinks and 'supply issues' in visible_drinks,'Missing sandwich information')
print(json.dumps({'pages':len(page_paths),'records':len(data['products']),'publicProducts':len(products),'drinksSnackImages':sum(bool(p['image']) for p in products if p['category'] in {'drinks','snacks'}),'checks':checks,'errors':errors},indent=2))
raise SystemExit(bool(errors))
