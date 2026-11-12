const {normalize,koreaDate}=require('./exim-rates.cjs');
function createHistoryService({fetchImpl=fetch,now=()=>new Date(),getKey=()=>process.env.EXIM_API_KEY}={}){
 const cache=new Map(),pending=new Map();
 async function day(date){
  const hit=cache.get(date);if(hit&&hit.until>now().getTime())return hit.rows;
  if(pending.has(date))return pending.get(date);
  const job=(async()=>{
   const url=new URL('https://oapi.koreaexim.go.kr/site/program/financial/exchangeJSON');url.search=new URLSearchParams({authkey:getKey(),searchdate:date.replaceAll('-',''),data:'AP01'});
   const r=await fetchImpl(url,{signal:AbortSignal.timeout(7000),redirect:'error'});if(!r.ok)throw Error('UPSTREAM_ERROR');
   const rows=normalize(await r.json());cache.set(date,{rows,until:now().getTime()+(date===koreaDate(now())?600000:21600000)});
   if(cache.size>100)cache.delete(cache.keys().next().value);return rows;
  })().finally(()=>pending.delete(date));pending.set(date,job);return job;
 }
 return async(currency,days)=>{
  if(!getKey()?.trim())throw Error('KEY_NOT_CONFIGURED');
  if(!/^[A-Z]{3}$/.test(currency)||![7,30].includes(days))throw Error('INVALID_REQUEST');
  const dates=Array.from({length:days},(_,i)=>koreaDate(now(),days-1-i));const points=[];let failed=0;
  for(let offset=0;offset<dates.length;offset+=6){await Promise.all(dates.slice(offset,offset+6).map(async date=>{try{const row=(await day(date)).find(r=>r.currency===currency);if(row)points.push({date,rate:row.rate,unit:row.unit});}catch{failed++;}}));}
  points.sort((a,b)=>a.date.localeCompare(b.date));
  if(!points.length)throw Error(failed?'HISTORY_UNAVAILABLE':'NO_DATA');
  return {source:'한국수출입은행',basis:'deal_bas_r',currency,unit:points[0].unit,from:dates[0],to:dates.at(-1),points,partial:failed>0,failedDates:failed,fetchedAt:now().toISOString()};
 };
}
module.exports={createHistoryService};
