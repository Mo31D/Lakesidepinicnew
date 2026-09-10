import React from 'react';
import {hydrateRoot} from 'react-dom/client';
import Storefront from '../components/storefront';
const node=document.getElementById('lp-catalogue');
const data=node?JSON.parse(node.textContent||'{}'):null;
// Unchanged pages in a replacement-file package may still embed the older catalogue.
// Their visible single prices are unchanged; upgrade the shared chooser data before hydration.
if(data?.settings && data.settings.triplePrice===undefined){
 data.settings={...data.settings,doublePrice:6.5,triplePrice:8};
}
const root=document.getElementById('root');
const base=document.documentElement.dataset.base||'';
if(data&&root)hydrateRoot(root,<Storefront data={data} pathname={document.documentElement.dataset.route||'/'} basePath={base} staticMode/>);
