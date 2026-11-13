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
test('90-day history produces at least twelve real weekly candles and shares cached dates',async()=>{
 const {weeklyCandles}=require('../lib/candle-model.cjs');let calls=0;
 const history=createHistoryService({now:()=>new Date('2026-11-12T05:00:00Z'),getKey:()=> 'test',fetchImpl:async url=>{calls++;const raw=url.searchParams.get('searchdate'),date=new Date(raw.slice(0,4)+'-'+raw.slice(4,6)+'-'+raw.slice(6,8)+'T00:00:00Z');return {ok:true,json:async()=>[0,6].includes(date.getUTCDay())?[]:[{result:1,cur_unit:'USD',deal_bas_r:String(1300+date.getUTCDate())}]};}});
 const result=await history('USD',90);assert.equal(calls,90);assert.ok(weeklyCandles(result.points).length>=12);await history('USD',30);assert.equal(calls,90);assert.equal(result.partial,false);
});
test('180-day history produces at least 25 weekly candles without inventing intraday values',async()=>{const {weeklyCandles}=require('../lib/candle-model.cjs');const history=createHistoryService({now:()=>new Date('2026-11-13T05:00:00Z'),getKey:()=> 'test',fetchImpl:async()=>({ok:true,json:async()=>[{result:1,cur_unit:'USD',deal_bas_r:'1332.4'}]})});const result=await history('USD',180);assert.equal(result.points.length,180);assert.ok(weeklyCandles(result.points).length>=25);assert.equal(result.partial,false);});
