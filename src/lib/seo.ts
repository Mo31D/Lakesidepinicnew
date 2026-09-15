import type {Catalogue} from './catalogue';
import {establishedYear} from './catalogue';
export const origin='https://www.lakesidepicnic.co.uk';
export function structuredData(c:Catalogue){return JSON.stringify({'@context':'https://schema.org','@type':'Store',name:'Lakeside Picnic',url:origin,foundingDate:String(establishedYear),description:'An independent shop in Waterhead serving Lakes Ice Cream and coffee, and stocking Lake District gifts and local treats.',telephone:c.settings.phone,address:{'@type':'PostalAddress',streetAddress:'Borrans Road, Waterhead',addressLocality:'Ambleside',postalCode:c.settings.postcode,addressCountry:'GB'},hasMap:'https://www.google.com/maps/search/?api=1&query=Lakeside+Picnic+Waterhead+Ambleside+LA22+0ES'}).replace(/</g,'\\u003c');}
