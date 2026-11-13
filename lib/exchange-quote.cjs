function publishedUnitRates(rows=[]){return Object.fromEntries(rows.filter(r=>/^[A-Z]{3}$/.test(r.currency)&&Number.isFinite(r.rate)&&r.rate>0&&Number.isFinite(r.unit)&&r.unit>0).map(r=>[r.currency,r.rate/r.unit]));}
function quoteForWon(won,currency,rates){const rate=rates[currency];if(!Number.isFinite(won)||won<=0||!Number.isFinite(rate)||rate<=0)return null;const decimals=new Intl.NumberFormat('en',{style:'currency',currency}).resolvedOptions().maximumFractionDigits;const scale=10**decimals;return Math.ceil((won/rate)*scale-1e-9)/scale;}
module.exports={publishedUnitRates,quoteForWon};
