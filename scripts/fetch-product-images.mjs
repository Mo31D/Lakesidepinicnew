import fs from 'node:fs/promises';
import path from 'node:path';

const products = {
  "robinsons-fruit-shoot-apple-blackcurrant-275ml": {url:"https://kasabeeston.com/cdn/shop/files/Fruitshootappleblackcurrant275ml_1200x1200.jpg?v=1690871460"},
  "robinsons-fruit-shoot-orange-juice-275ml": {page:"https://continentalfoodstore.co.uk/products/robinsons-fruit-shoot-orange-275ml"},
  "harrogate-spring-bottled-water-500ml": {url:"https://www.bestwaywholesale.co.uk/img/products/1000/2/5060042350032.jpg"},
  "harrogate-spring-sparkling-water-500ml": {url:"https://assets.tops.co.th/HARROGATE-HarrogateSpringWaterSparkling500ml-5060042350049-1"},
  "coca-cola-original-taste-500ml": {url:"https://www.lgcruisecontrol.co.uk/image/cache/catalog/product/coca-cola-original-taste-500ml-500x500.jpg"},
  "coca-cola-zero-500ml": {url:"https://lollypoplane.co.uk/cdn/shop/files/Coca-ColaZeroSugarBottle500ml.jpg"},
  "diet-coke-500ml": {url:"https://www.niyazis.co.uk/cdn/shop/files/24_56c3f8b7-3868-4f80-aa6c-2e71eba7d828.png?v=1767138635"},
  "coca-cola-cherry-500ml": {page:"https://continentalfoodstore.co.uk/products/coca-cola-cherry-bottle-500ml"},
  "fanta-icy-lemon-500ml": {url:"https://www.matthewclark.co.uk/ProductImages/00029520.jpg"},
  "fanta-orange-500ml": {url:"https://www.asiamarket.ie/media/catalog/product/cache/2156dde8ce8b3859bf2fcf683e7af2c8/f/a/fanta_orange_500ml_pet_optimised_ean__40822938_40822938_1.jpg"},
  "fanta-zero-orange-500ml": {url:"https://wave-grocery.s3.eu-central-1.amazonaws.com/thanopoulos/products/54491397_1_1_B30E732844AC0A9EECA9B11C0970ED15.jpg"},
  "irn-bru-500ml": {url:"https://assets.iceland.co.uk/i/iceland/irn-bru_soft_drink_bottle_500ml_3067_T596.jpg"},
  "dr-pepper-500ml": {page:"https://www.coop.co.uk/products/dr-pepper-500ml"},
  "lucozade-sport-raspberry-500ml": {page:"https://www.coop.co.uk/products/lucozade-sport-raspberry-500ml"},
  "lucozade-sport-orange-500ml": {url:"https://www.ctcwholesalers.co.uk/app/uploads/2025/02/LUSPO5.jpeg"},
  "oasis-summer-fruits-500ml": {url:"https://foodbazaar.co.uk/cdn/shop/files/Untitleddesign-2025-09-06T144614.517.png?v=1757166380"},
  "oasis-citrus-punch-500ml": {url:"https://www.wilko.com/assets/bWFzdGVyfGltYWdlc3w0NzQzMnxpbWFnZS9qcGVnfGFEbG1MMmd5Tmk4NU1EYzRPRFF3T0RBeU5qUXlMbXB3Wnd8NDZkODkxMTZkMWY5MTc0ZjI4MzUyNzIwNjg4ZDU5ZDIxMDc0N2E5ZTA5YTU1YjA5YjM0OGU3ZTI2MjdlYjJhYQ/8083210-1.jpg"},
  "red-bull-energy-drink-250ml": {url:"https://www.bestwaywholesale.co.uk/img/products/1000/9/90457999.jpg"},
  "sprite-original-500ml": {url:"https://shop.colbeck.co.uk/images/thumbs/0000867_12x500ml-sprite-bottles-eng.jpeg", page:"https://shop.colbeck.co.uk/products/021065_12x500ml-Sprite-Bottles-ENG"},
  "ribena-blackcurrant-500ml": {url:"https://wholesale.herbsnbeans.co.uk/cdn/shop/products/Ribena-Blackcurrant-Bottle-500Ml-12.png?v=1649864323"},
  "tango-orange-500ml": {url:"https://www.sparscotland.co.uk/images/products/brandbank/b2cee4eb-3e84-4653-b031-f6df45857bb0.png"},
  "vimto-fizzy-500ml": {page:"https://www.tesco.com/shop/en-GB/products/250698827"},
  "dr-pepper-can-330ml": {url:"https://www.ukbusinesssupplies.co.uk/cdn/shop/files/12657933-2144837049707584_1024x.webp?v=1691750303"},
  "diet-coke-can-330ml": {page:"https://www.coop.co.uk/products/diet-coke-330ml"},
  "fanta-lemon-can-gb": {url:"https://failtefoods.com/cdn/shop/files/BC_Upload_49a17f34-e8bd-4944-a9e2-f00a13851fca.png?v=1738799560"},
  "coca-cola-original-can-330ml": {page:"https://www.onestop.co.uk/product/coca-cola-original-taste-330ml-can/"},
  "coca-cola-cherry-can-330ml": {page:"https://www.tesco.com/shop/en-GB/search?query=coca-cola%20cherry%20330ml"},
  "fanta-orange-can-330ml": {page:"https://www.coop.co.uk/products/fanta-orange-330ml"},
  "r-whites-lemonade-cans": {page:"https://www.tesco.com/shop/en-GB/search?query=R%20Whites%20Lemonade%20330ml"},
  "snickers-duo-bar-83-4g": {page:"https://www.tesco.com/shop/en-GB/products/281026626"},
  "mars-duo-chocolate-bar-78-8g": {url:"https://foodbazaar.co.uk/cdn/shop/files/135_1.jpg?v=1715436006"},
  "cadbury-double-decker-duo-chocolate-bar-80g": {page:"https://www.tesco.com/shop/en-GB/search?query=Double%20Decker%20Duo%2080g"},
  "cadbury-boost-chocolate-bar-duo-68g": {url:"https://www.planetcandy.eu/cdn/shop/files/cadbury-boost-duo-32x68g-1100x1100.jpg?v=1744984206"},
  "squares-cheese-onion-crisps-72g": {url:"https://www.sparscotland.co.uk/images/products/brandbank/349d103e-dc31-47f0-b28b-f119a4d7ecd8.png"},
  "walkers-ready-salted-32-5g": {url:"https://ik.imagekit.io/pimberly/595e406f0f15f30010780448/tr:w-1000,h-1000,cm-pad_resize/1adeb602/5d5c02235ba98a48100001e7/80ebe2ac/AU34779_01.jpg?product_name=Walkers-Ready-Salted-Crisps-32.5g-(32-pack)-121797.jpg"},
  "walkers-cheese-onion-32-5g": {page:"https://www.gopuff.com/gb/p/walkers-cheese-onion-32-5g/p47582"},
  "walkers-salt-vinegar-32-5g": {page:"https://british-choice.com/products/walkers-25g-35g-salt-vinegar"},
  "walkers-tomato-ketchup-32-5g": {url:"https://omalleyseuropeanfoods.com/cdn/shop/products/WalkersTomatoKetchup.jpg?v=1682718897"},
  "walkers-roast-chicken-32-5g": {url:"https://britishcravings.com/cdn/shop/files/5000328329833_d88b805f-d1e3-498d-9024-a864ef2c1aaf.jpg?v=1753103600"}
};

const ua={'user-agent':'Mozilla/5.0 LakesidePicnicAssetBot/1.0'};
async function resolveImage(spec){
 if(spec.url){
  const r=await fetch(spec.url,{headers:ua,redirect:'follow'});
  if(r.ok && (r.headers.get('content-type')||'').startsWith('image/')) return r;
 }
 if(!spec.page) throw new Error('No usable image source');
 const h=await fetch(spec.page,{headers:ua,redirect:'follow'}); if(!h.ok) throw new Error('page '+h.status);
 const html=await h.text();
 const m=html.match(/<meta[^>]+(?:property|name)=["']og:image["'][^>]+content=["']([^"']+)/i)||html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']og:image["']/i);
 if(!m) throw new Error('No og:image');
 const r=await fetch(m[1].replaceAll('&amp;','&'),{headers:ua,redirect:'follow'});
 if(!r.ok) throw new Error('image '+r.status);
 return r;
}
await fs.mkdir('product-images/drinks-snacks',{recursive:true});
const catalogue=JSON.parse(await fs.readFile('src/catalogue.json','utf8'));
const failures=[];
for(const [id,spec] of Object.entries(products)){
 try{
  const r=await resolveImage(spec); const type=(r.headers.get('content-type')||'image/jpeg').split(';')[0];
  const ext=type.includes('png')?'png':type.includes('webp')?'webp':'jpg';
  const file='product-images/drinks-snacks/'+id+'.'+ext;
  await fs.writeFile(file,Buffer.from(await r.arrayBuffer()));
  const p=catalogue.products.find(x=>x.id===id); if(p)p.image='/'+file;
  console.log('saved',id,file);
 }catch(e){failures.push(id+': '+e.message); console.error('FAILED',id,e.message);}
}
if(failures.length){console.error('Sources needing fallback:\n'+failures.join('\n'));}
console.log(`Imported ${Object.keys(products).length-failures.length}/${Object.keys(products).length}; preserving unresolved catalogue images for fallback pass.`);
catalogue.updatedAt=new Date().toISOString().slice(0,10);
await fs.writeFile('src/catalogue.json',JSON.stringify(catalogue,null,2)+'\n');
