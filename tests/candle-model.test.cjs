const {test}=require('node:test');const assert=require('node:assert/strict');
const {dailyBodies,weeklyCandles}=require('../lib/candle-model.cjs');
test('daily bodies compare actual consecutive published observations, without invented OHLC',()=>{
 const rows=dailyBodies([{date:'2026-11-09',rate:1357.9},{date:'2026-11-06',rate:1342},{date:'2026-11-10',rate:1355.7}]);
 assert.equal(rows[0].previous,null);assert.equal(rows[1].previousDate,'2026-11-06');assert.equal(rows[1].previous,1342);assert.ok(Math.abs(rows[1].delta-15.9)<1e-9);assert.equal(rows[1].high,undefined);assert.equal(rows.length,3);
});
test('weekly candles use first, last and extrema of observed daily fixings only',()=>{
 const rows=weeklyCandles([{date:'2026-11-06',rate:1342},{date:'2026-11-09',rate:1357.9},{date:'2026-11-10',rate:1355.7},{date:'2026-11-11',rate:1343.3},{date:'2026-11-12',rate:1336.7}]);
 assert.equal(rows.length,2);assert.deepEqual(rows[0],{date:'2026-11-06',endDate:'2026-11-06',open:1342,close:1342,high:1342,low:1342,count:1});assert.deepEqual(rows[1],{date:'2026-11-09',endDate:'2026-11-12',open:1357.9,close:1336.7,high:1357.9,low:1336.7,count:4});
});
