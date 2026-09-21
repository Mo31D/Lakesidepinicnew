import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {createRequire} from 'node:module';
import fs from 'node:fs';
await build({entryPoints:['src/lib/selection.ts'],bundle:true,platform:'node',format:'cjs',outfile:'.sites-runtime/selection.cjs',logLevel:'silent'});
const s=createRequire(import.meta.url)('../.sites-runtime/selection.cjs');
const data=JSON.parse(fs.readFileSync('src/catalogue.json','utf8'));
const flavours=s.availableFlavours(data);
assert.equal(flavours.length,12);
for(const size of s.scoopSizes){
  for(const vessel of ['cone','tub']){
    const item=s.makeSelection(flavours[0].id,size,vessel,flavours[1].id,flavours[2].id);
    assert.equal(s.selectionFlavours(item).length,s.scoopCount(size));
    assert.ok(s.validScoopSelection(data,size,s.selectionFlavours(item)));
    assert.equal(s.selectionPrice(item,data),{single:3.5,double:6.5,triple:8}[size]);
    assert.equal(s.normaliseList([item])[0].key,item.key);
    assert.equal(s.addSelection([item],item)[0].quantity,2);
  }
}
assert.equal(s.validScoopSelection(data,'double',[flavours[0].id]),false);
assert.equal(s.validScoopSelection(data,'single',['seasonal-sandwiches-currently-unavailable']),false);
const item=s.makeSelection(flavours[0].id,'triple','tub',flavours[1].id,flavours[2].id,99);
assert.equal(s.addSelection([item],item)[0].quantity,99);
assert.deepEqual(s.normaliseList(null),[]);
assert.deepEqual(s.normaliseList([{...item,quantity:-1}]),[]);
const same=s.makeSelection(flavours[0].id,'triple','tub');
assert.ok(s.validScoopSelection(data,'triple',s.selectionFlavours(same)));
assert.notEqual(same.key,item.key);
console.log('Selection rules passed: prices, scoop counts, vessels, repeated flavours, persistence, invalid choices and quantities.');
