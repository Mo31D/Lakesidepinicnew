import {type Catalogue, type Product, type Settings, publicProducts} from './catalogue';

export const scoopSizes = ['single', 'double', 'triple'] as const;
export type ScoopSize = typeof scoopSizes[number];
export type Vessel = 'cone' | 'tub';
export type ListItem = {key: string; id: string; quantity: number; size: ScoopSize; vessel: Vessel; second: string; third: string};
export const scoopCount = (size: ScoopSize) => ({single: 1, double: 2, triple: 3})[size];
export const flavourLabels = ['First flavour', 'Second flavour', 'Third flavour'] as const;
export const flavourFields = (size: ScoopSize) => flavourLabels.slice(0, scoopCount(size));
export const availableFlavours = (data: Catalogue) => publicProducts(data).filter(p => p.category === 'ice-cream' && p.available);

export function scoopPrice(settings: Settings, size: ScoopSize, singleFallback: number | null = null) {
 return size === 'single' ? (settings.singlePrice ?? singleFallback) : size === 'double' ? settings.doublePrice : settings.triplePrice;
}

export function makeSelection(id: string, size: ScoopSize = 'single', vessel: Vessel = 'cone', second = '', third = '', quantity = 1): ListItem {
 const s2 = size === 'single' ? '' : second || id;
 const s3 = size === 'triple' ? third || id : '';
 return {key: [id, size, vessel, s2, s3].join(':'), id, quantity, size, vessel, second: s2, third: s3};
}

export function selectionFlavours(item: ListItem) {
 return [item.id, item.second || item.id, item.third || item.id].slice(0, scoopCount(item.size));
}

export function addSelection(items: ListItem[], item: ListItem) {
 const found = items.some(i => i.key === item.key);
 return found ? items.map(i => i.key === item.key ? {...i, quantity: Math.min(99, i.quantity + item.quantity)} : i) : [...items, item];
}

// Keep valid old single/double selections and rebuild their keys for the new format.
export function normaliseList(raw: unknown): ListItem[] {
 if (!Array.isArray(raw)) return [];
 let result: ListItem[] = [];
 for (const row of raw.slice(0, 100)) {
  if (!row || typeof row !== 'object') continue;
  const i = row as Record<string, unknown>;
  if (typeof i.id !== 'string' || !/^[a-z0-9-]+$/.test(i.id) || !Number.isInteger(i.quantity) || Number(i.quantity) < 1 || Number(i.quantity) > 99 || !scoopSizes.includes(i.size as ScoopSize) || !['cone', 'tub'].includes(String(i.vessel))) continue;
  const second = typeof i.second === 'string' && /^[a-z0-9-]*$/.test(i.second) ? i.second : '';
  const third = typeof i.third === 'string' && /^[a-z0-9-]*$/.test(i.third) ? i.third : '';
  result = addSelection(result, makeSelection(i.id, i.size as ScoopSize, i.vessel as Vessel, second, third, Number(i.quantity)));
 }
 return result;
}

export function validScoopSelection(data: Catalogue, size: ScoopSize, ids: string[]) {
 const allowed = new Set(availableFlavours(data).map(p => p.id));
 return ids.length === scoopCount(size) && ids.every(id => allowed.has(id));
}

export function selectionPrice(item: ListItem, data: Catalogue) {
 const p = data.products.find(p => p.id === item.id);
 return !p ? null : p.category === 'ice-cream' ? scoopPrice(data.settings, item.size, p.price) : p.price;
}

export function selectionWords(item: ListItem, products: Product[]) {
 const find = (id: string) => products.find(p => p.id === id);
 const p = find(item.id);
 const label = p?.category === 'ice-cream' ? selectionFlavours(item).map(id => find(id)?.name || 'Flavour no longer in the range').join(' + ') + ' — ' + item.size + ', ' + item.vessel : p?.name || 'Item no longer in the range';
 return item.quantity + ' × ' + label;
}
