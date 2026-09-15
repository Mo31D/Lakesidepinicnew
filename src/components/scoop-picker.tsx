'use client';
import {useState} from 'react';
import {Plus} from 'lucide-react';
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription} from '@/components/ui/dialog';
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group';
import {Select, SelectTrigger, SelectValue, SelectContent, SelectItem} from '@/components/ui/select';
import {currency, optimizedImage, siteURL, type Catalogue, type Product} from '@/lib/catalogue';
import {availableFlavours, flavourFields, scoopCount, scoopPrice, scoopSizes, validScoopSelection, type ScoopSize, type Vessel} from '@/lib/selection';

type Props = {data: Catalogue; product: Product | null; basePath?: string; onClose: () => void; onAdd: (p: Product, size: ScoopSize, vessel: Vessel, second: string, third: string) => void};
export default function ScoopPicker({data, product, basePath = '', onClose, onAdd}: Props) {
 return <Dialog open={!!product} onOpenChange={open => !open && onClose()}>
  <DialogContent className="scoop-dialog">
   <DialogHeader><DialogTitle>Make it your scoop.</DialogTitle><DialogDescription>Choose your size and a flavour for every scoop. Made by Lakes Ice Cream.</DialogDescription></DialogHeader>
   {product && <ScoopOptions key={product.id} data={data} product={product} basePath={basePath} onAdd={onAdd}/>}
  </DialogContent>
 </Dialog>;
}

export function ScoopOptions({data, product, basePath, onAdd}: Omit<Props, 'onClose' | 'product'> & {product: Product}) {
 const [size, setSize] = useState<ScoopSize>('single');
 const [vessel, setVessel] = useState<Vessel>('cone');
 const [flavours, setFlavours] = useState([product.id, product.id, product.id]);
 const options = availableFlavours(data);
 const first = options.find(p => p.id === flavours[0]);
 const selected = flavours.slice(0, scoopCount(size));
 const valid = validScoopSelection(data, size, selected);
 const picture = size === 'single' ? (vessel === 'tub' ? '/brand/single-tub.png' : '/brand/single-scoop.png') : first?.image || '/brand/single-scoop.png';
 const title = size[0].toUpperCase() + size.slice(1) + ' scoop';
 return <>
  <div className="scoop-top">
   <img src={siteURL(optimizedImage(picture), basePath)} alt={size === 'single' ? 'Illustrative single scoop in a ' + vessel : (first?.name || 'Ice cream') + ' flavour image'} decoding="async"/>
   <div>
    <p className="field-label">How many scoops?</p>
    <RadioGroup className="segmented scoop-size-options" aria-label="Scoop size" value={size} onValueChange={v => setSize(v as ScoopSize)}>
     {scoopSizes.map(s => <div className="segment-option" key={s}><RadioGroupItem id={'scoop-' + s} value={s} className="segment-radio" aria-label={s}/><label htmlFor={'scoop-' + s}>{s[0].toUpperCase() + s.slice(1)}<span className="scoop-option-price">{currency(scoopPrice(data.settings, s, first?.price ?? null))}</span></label></div>)}
    </RadioGroup>
    <p className="field-label">Cone or tub?</p>
    <RadioGroup className="segmented" aria-label="Serving choice" value={vessel} onValueChange={v => setVessel(v as Vessel)}>
     {(['cone', 'tub'] as const).map(v => <div className="segment-option" key={v}><RadioGroupItem id={'vessel-' + v} value={v} className="segment-radio" aria-label={v}/><label htmlFor={'vessel-' + v}>{v === 'cone' ? 'Cone' : 'Tub'}</label></div>)}
    </RadioGroup>
   </div>
  </div>
  <p className="small-note scoop-picture-note">Serving illustration. Your flavours and presentation may vary.</p>
  {flavourFields(size).map((label, index) => <label className="field" key={label}>{label}
   <Select value={flavours[index]} onValueChange={id => setFlavours(current => current.map((v, n) => n === index ? id : v))}>
    <SelectTrigger className="form-control" aria-label={label}><SelectValue/></SelectTrigger>
    <SelectContent>{options.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
   </Select>
  </label>)}
  {size !== 'single' && <p className="small-note">Pick different flavours, or enjoy the same one more than once.</p>}
  <div className="scoop-price" aria-live="polite"><span>{title}</span><strong>{currency(scoopPrice(data.settings, size, first?.price ?? null))}</strong></div>
  <p className="small-note">Flavours are subject to availability. Please mention allergies before ordering.</p>
  <button className="button wide" disabled={!valid || !first} onClick={() => {if (valid && first) onAdd(first, size, vessel, size === 'single' ? '' : flavours[1], size === 'triple' ? flavours[2] : '');}}>Add to my list <Plus size={18}/></button>
  <p className="tiny-centred">A personal list, not an order or reservation.</p>
 </>;
}
