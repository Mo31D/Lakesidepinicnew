import React from 'react';
import {renderToString} from 'react-dom/server';
import Storefront from '../components/storefront';
export function render(catalogue:any,pathname:string,basePath=''){return renderToString(<Storefront data={catalogue} pathname={pathname} basePath={basePath} staticMode/>);}

export {allRoutes,resolvePage} from '../lib/routes';
export {origin,structuredData} from '../lib/seo';
