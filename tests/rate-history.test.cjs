const {test}=require('node:test');const assert=require('node:assert/strict');
const {createHistoryService}=require('../lib/rate-history.cjs');
test('history preserves the 100 JPY basis, skips missing dates, and reuses all-currency day responses',async()=>{
 let calls=0;const history=createHistoryService({now:()=>new Date('2026-11-12T05:00:00Z'),getKey:()=> 'test',fetchImpl:async url=>{calls++;const date=url.searchParams.get('searchdate');return {ok:true,json:async()=>date==='20261108'?[]:[{result:1,cur_unit:'JPY(100)',deal_bas_r:'837.45'},{result:1,cur_unit:'USD',deal_bas_r:'1,336.70'}]};}});
 const jpy=await history('JPY',7);assert.equal(jpy.points.length,6);assert.equal(jpy.unit,100);assert.equal(jpy.points[0].rate,837.45);assert.ok(jpy.points.every(p=>p.rate>0));assert.equal(jpy.partial,false);
 await history('USD',7);assert.equal(calls,7);
});
test('failed dates are reported as partial history rather than fabricated points',async()=>{
 const history=createHistoryService({now:()=>new Date('2026-11-12T05:00:00Z'),getKey:()=> 'test',fetchImpl:async url=>{if(url.searchParams.get('searchdate')==='20261110')throw Error('network');return {ok:true,json:async()=>[{result:1,cur_unit:'USD',deal_bas_r:'1400'}]};}});
 const result=await history('USD',7);assert.equal(result.partial,true);assert.equal(result.failedDates,1);assert.equal(result.points.length,6);
 await assert.rejects(history('USD',365),/INVALID_REQUEST/);
});
