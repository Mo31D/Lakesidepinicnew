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
  description:'Independent shop in Waterhead, Ambleside by Windermere, serving Lakes Ice Cream, coffee, cold drinks and snacks, with Romney’s Kendal Mint Cake and Lake District gifts.',
  telephone:c.settings.phone,
  priceRange:'£',
  image:origin+'/brand/identity-board.jpeg',
  address:{'@type':'PostalAddress',streetAddress:'Borrans Road, Waterhead',addressLocality:'Ambleside',addressRegion:'Cumbria',postalCode:c.settings.postcode,addressCountry:'GB'},
  geo:{'@type':'GeoCoordinates',latitude:54.4329,longitude:-2.9614},
  areaServed:[{'@type':'Place',name:'Waterhead, Ambleside'},{'@type':'Place',name:'Lake District'}],
  hasMap:'https://www.google.com/maps/search/?api=1&query=Lakeside+Picnic+Waterhead+Ambleside+LA22+0ES'
 };
 const graph:any[]=[store,{ '@type':'WebSite','@id':origin+'/#website',url:origin,name:'Lakeside Picnic',publisher:{'@id':origin+'/#store'},inLanguage:'en-GB'}];
 if(page?.kind==='product'&&page.productId){
  const p=c.products.find((x:any)=>x.id===page.productId);
  if(p)graph.push({'@type':'Product','@id':origin+page.path+'#product',name:p.name,description:p.description||p.name,image:p.image?origin+p.image:undefined,brand:p.supplier?{'@type':'Brand',name:p.supplier}:undefined,offers:p.price!=null?{'@type':'Offer',price:String(p.price),priceCurrency:'GBP',availability:p.available?'https://schema.org/InStock':'https://schema.org/OutOfStock',url:origin+page.path}:undefined});
 }
 return JSON.stringify({'@context':'https://schema.org','@graph':graph}).replace(/</g,'\\u003c');
}
