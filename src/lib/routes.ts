import type {Catalogue} from './catalogue';
import {productURL,publicProducts} from './catalogue';
export type PageKind='home'|'catalogue'|'product'|'about'|'visit'|'explore'|'allergens'|'privacy'|'selection';
export type PageInfo={kind:PageKind;title:string;description:string;category?:string;productId?:string;path:string};
export function resolvePage(path:string,catalogue:Catalogue):PageInfo|null{
 const p=path==='/'?'/':path.replace(/\/$/,'');
 const routes:Record<string,Omit<PageInfo,'path'>>={
 '/':{kind:'home',title:'Ice Cream, Coffee & Gifts in Waterhead, Ambleside',description:'Lakes Ice Cream, coffee and Lake District gifts from our small independent shop by the water in Waterhead, Ambleside.'},
 '/index.html':{kind:'home',title:'Ice Cream, Coffee & Gifts in Waterhead, Ambleside',description:'A little lakeside joy at Lakeside Picnic, Waterhead.'},
 '/icecream.html':{kind:'catalogue',category:'ice-cream',title:'Lakes Ice Cream in Ambleside',description:'Explore the Lakes Ice Cream flavours served at Lakeside Picnic. Single, double or triple, in a cone or a tub.'},
 '/hotdrinks.html':{kind:'catalogue',category:'coffee',title:'Coffee, Tea & Hot Chocolate',description:'Explore the coffee and tea menu at Lakeside Picnic in Waterhead, Ambleside.'},
 '/romneys.html':{kind:'catalogue',category:'romneys',title:'Romney’s Kendal Mint Cake & Sweet Treats',description:'Discover Romney’s Kendal Mint Cake, fudge, biscuits and sweet gifts at Lakeside Picnic.'},
 '/Mintcake/mintcake.html':{kind:'catalogue',category:'romneys',title:'Romney’s Kendal Mint Cake',description:'Romney’s Kendal Mint Cake, stocked by Lakeside Picnic in Waterhead.'},
 '/souvenirs.html':{kind:'catalogue',category:'gifts',title:'Lake District Gifts & Souvenirs',description:'Browse Peter Rabbit, Lake District souvenirs, maps, books and little keepsakes at Lakeside Picnic.'},
 '/drinks.html':{kind:'catalogue',category:'drinks',title:'Cold Drinks & Sandwiches in Ambleside',description:'Coca-Cola, chilled soft drinks and water for your day by the lake, with snacks for the journey. Sandwiches are temporarily unavailable due to supply issues.'},
 '/coca-cola.html':{kind:'catalogue',category:'drinks',title:'Cold Drinks & Sandwiches in Ambleside',description:'Coca-Cola, chilled soft drinks and water for your day by the lake, with snacks for the journey. Sandwiches are temporarily unavailable due to supply issues.'},
 '/menu.html':{kind:'catalogue',category:'all',title:'The Shop — Our Full Range',description:'Explore the full Lakeside Picnic range and make a list to show us at the counter.'},
 '/services.html':{kind:'catalogue',category:'all',title:'Browse the Shop',description:'Ice cream, drinks, gifts and treats at Lakeside Picnic, Waterhead.'},
 '/about.html':{kind:'about',title:'Our Story — Independent Since 2015',description:'Meet Lakeside Picnic: an independent shop in Waterhead, Ambleside since 2015, serving ice cream, coffee and a warm welcome.'},
 '/contact.html':{kind:'visit',title:'Find Lakeside Picnic in Waterhead',description:'Visit Lakeside Picnic on Borrans Road, Waterhead, Ambleside LA22 0ES.'},
 '/to-do.html':{kind:'explore',title:'Explore Ambleside & Waterhead',description:'A few favourite places near Lakeside Picnic, from the lakeshore to Ambleside and the surrounding fells.'},
 '/ambleside_guide.html':{kind:'explore',title:'An Ambleside Guide',description:'Ideas for a day around Waterhead and Ambleside.'},
 '/blog.html':{kind:'explore',title:'Around the Lakes',description:'Places to explore around Lakeside Picnic, Waterhead and Ambleside.'},
 '/allergens.html':{kind:'allergens',title:'Allergies & Dietary Information',description:'Please tell us about allergies before ordering. We can check the current ingredients with you at the counter.'},
 '/privacy.html':{kind:'privacy',title:'Privacy & Your Choices',description:'How this website uses essential storage for your personal selection list.'},
 '/my-list.html':{kind:'selection',title:'Your Lakeside List',description:'Your personal selection to show at the counter. This is not an online order or reservation.'}
 };
 const canonical:Record<string,string>={'/coca-cola.html':'/drinks.html','/index.html':'/','/services.html':'/menu.html','/Mintcake/mintcake.html':'/romneys.html','/ambleside_guide.html':'/to-do.html','/blog.html':'/to-do.html'};
 if(routes[p])return {...routes[p],path:canonical[p]||p};
 const product=publicProducts(catalogue).find(x=>productURL(x)===p);
 if(product)return {kind:'product',productId:product.id,title:product.name,description:product.description||product.name+' at Lakeside Picnic, Waterhead, Ambleside.',path:p};
 return null;
}
export function allRoutes(c:Catalogue){return ['/', '/icecream.html','/hotdrinks.html','/romneys.html','/souvenirs.html','/drinks.html','/coca-cola.html','/menu.html','/services.html','/about.html','/contact.html','/to-do.html','/ambleside_guide.html','/blog.html','/allergens.html','/privacy.html','/my-list.html','/Mintcake/mintcake.html',...publicProducts(c).map(productURL)];}
