import type {Catalogue} from './catalogue';
import {establishedYear} from './catalogue';
export const origin='https://www.lakesidepicnic.co.uk';

export function structuredData(c:Catalogue,page?:any){
 const store:any={
  '@type':['Store','LocalBusiness'],
  '@id':origin+'/#store',
  name:'Lakeside Picnic',
  url:origin,
  foundingDate:String(establishedYear),
  description:'Independent shop in Waterhead, Ambleside by Lake Windermere, serving Lakes Ice Cream, coffee, cold drinks and snacks, with Romney’s Kendal Mint Cake and Lake District gifts.',
  telephone:c.settings.phone,
  priceRange:'£',
  image:origin+'/brand/identity-board.jpeg',
  address:{'@type':'PostalAddress',streetAddress:'Borrans Road, Waterhead',addressLocality:'Ambleside',addressRegion:'Cumbria',postalCode:c.settings.postcode,addressCountry:'GB'},
  geo:{'@type':'GeoCoordinates',latitude:54.4329,longitude:-2.9614},
  areaServed:[{'@type':'Place',name:'Waterhead, Ambleside'},{'@type':'Place',name:'Ambleside'},{'@type':'Place',name:'Lake Windermere'},{'@type':'Place',name:'Lake District'}],
  hasMap:'https://www.google.com/maps/search/?api=1&query=Lakeside+Picnic+Waterhead+Ambleside+LA22+0ES'
 };
 const website:any={ '@type':'WebSite','@id':origin+'/#website',url:origin,name:'Lakeside Picnic',publisher:{'@id':origin+'/#store'},inLanguage:'en-GB'};
 const webpage:any={'@type':'WebPage','@id':origin+(page?.path||'/')+'#webpage',url:origin+(page?.path||'/'),name:page?.title||'Lakeside Picnic',description:page?.description||store.description,isPartOf:{'@id':origin+'/#website'},about:{'@id':origin+'/#store'},inLanguage:'en-GB'};
 const graph:any[]=[store,website,webpage];
 if(page?.path&&page.path!=='/')graph.push({'@type':'BreadcrumbList','@id':origin+page.path+'#breadcrumb',itemListElement:[{'@type':'ListItem',position:1,name:'Home',item:origin+'/'},{'@type':'ListItem',position:2,name:page.title,item:origin+page.path}]});
 if(page?.kind==='product'&&page.productId){
  const p=c.products.find((x:any)=>x.id===page.productId);
  if(p)graph.push({'@type':'Product','@id':origin+page.path+'#product',name:p.name,description:p.description||p.name,image:p.image?origin+p.image:undefined,brand:p.supplier?{'@type':'Brand',name:p.supplier}:undefined,offers:p.price!=null?{'@type':'Offer',price:String(p.price),priceCurrency:'GBP',availability:p.available?'https://schema.org/InStock':'https://schema.org/OutOfStock',url:origin+page.path,seller:{'@id':origin+'/#store'}}:undefined});
 }
 return JSON.stringify({'@context':'https://schema.org','@graph':graph}).replace(/</g,'\\u003c');
}
