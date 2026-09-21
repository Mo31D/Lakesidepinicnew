import React from 'react';
import {hydrateRoot} from 'react-dom/client';
import Storefront from '../components/storefront';
const node=document.getElementById('lp-catalogue');
const data=node?JSON.parse(node.textContent||'{}'):null;
const root=document.getElementById('root');
const base=document.documentElement.dataset.base||'';
if(data&&root)hydrateRoot(root,<Storefront data={data} pathname={document.documentElement.dataset.route||'/'} basePath={base} staticMode/>);
