export type Category = { id: string; name: string; description: string; image: string; visible: boolean };
export type Product = { id: string; name: string; category: string; description: string; image: string; path: string; price: number | null; unit: string; available: boolean; visible: boolean; featured: boolean; supplier: string; ingredients: string; nutrition: string; sourceNote: string };
export type Settings = { heroTitle: string; heroAccent: string; heroText: string; heroImage: string; aboutTitle: string; aboutText: string; announcement: string; phone: string; email: string; address: string; postcode: string; primaryColor: string; accentColor: string; logo: string; motion: boolean; vegan: 'ask' | 'available' | 'unavailable'; singlePrice: number | null; doublePrice: number | null; triplePrice: number | null; sections: { id: string; enabled: boolean }[]; };
export type Catalogue = { schemaVersion: 1; revision: number; updatedAt: string; categories: Category[]; products: Product[]; settings: Settings; };
// Owner-confirmed on 7 September 2026; supersedes the date on the reference logo board.
export const establishedYear = 2015;
export function siteURL(url: string | undefined, basePath = '') {
 return url?.startsWith('/') && !url.startsWith('//') ? basePath + (url === '/' ? '/index.html' : url.startsWith('/products/') && !url.endsWith('.html') ? url.replace(/\/$/, '') + '/index.html' : url) : url;
}
export const currency = (price: number | null) => price === null ? 'Ask in store' : new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(price);
export const directionsURL = 'https://www.google.com/maps/search/?api=1&query=Lakeside+Picnic+Waterhead+Ambleside+LA22+0ES';
export const publicProducts = (c: Catalogue) => c.products.filter(p => p.visible && c.categories.some(x=>x.id===p.category && x.visible));
export function productURL(p: Product) { return p.path || '/products/' + p.id; }
export function optimizedImage(src: string) { return /^\/(Icecream|Mintcake|hotdrinks|images|to-do)\//.test(src) && /\.(png|jpeg|jpg)$/i.test(src) ? '/optimized' + src.replace(/\.[^.]+$/, '.webp') : src; }
