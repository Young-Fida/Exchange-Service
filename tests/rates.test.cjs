const {test} = require('node:test');
const assert = require('node:assert/strict');
const {normalize, koreaDate, createRateService} = require('../lib/exim-rates.cjs');
test('JPY and IDR preserve the published 100-unit basis', () => {
  const result = normalize([{result:1,cur_unit:'JPY(100)',deal_bas_r:'856.72'}, {result:1,cur_unit:'IDR(100)',deal_bas_r:'7.51'}]);
  assert.equal(result[0].krwPerUnit, 8.5672);
  assert.equal(result[1].unit, 100);
  assert.equal(result[1].rate, 7.51);
});
test('invalid results never become quoted rates', () => {
  assert.throws(() => normalize([{result:4}]));
  assert.throws(() => normalize({error:'invalid'}));
  assert.deepEqual(normalize([{result:1,cur_unit:'USD',deal_bas_r:'bad'}]), []);
});
test('date uses Korea time across the UTC day boundary', () => {
  assert.equal(koreaDate(new Date('2026-11-08T16:00:00Z')), '2026-11-09');
});
test('empty dates fall back; concurrent requests and repeats share the result', async () => {
  const dates = [];
  const service = createRateService({getKey:()=> 'test-only',now:()=>new Date('2026-11-09T04:00:00Z'),fetchImpl:async url=> {
    dates.push(url.searchParams.get('searchdate'));
    return {ok:true,json:async()=>dates.length===1?[]:[{result:1,cur_unit:'USD',deal_bas_r:'1,357.9'}]};
  }});
  const [a,b] = await Promise.all([service(), service()]);
  assert.equal(a,b);
  assert.equal(a.rateDate,'2026-11-08');
  assert.equal(a.rates[0].rate,1357.9);
  await service();
  assert.deepEqual(dates,['20261109','20261108']);
});
test('missing keys and upstream failures do not produce demo rates', async () => {
  await assert.rejects(createRateService({getKey:()=>''})(), /KEY_NOT_CONFIGURED/);
  await assert.rejects(createRateService({getKey:()=> 'test',fetchImpl:async()=>({ok:false})})(), /UPSTREAM_ERROR/);
  await assert.rejects(createRateService({getKey:()=> 'test',fetchImpl:async()=>({ok:true,json:async()=>[]})})(), /NO_DATA/);
});
