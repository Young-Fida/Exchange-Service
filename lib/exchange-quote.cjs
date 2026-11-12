function publishedUnitRates(rows=[]){return Object.fromEntries(rows.filter(r=>/^[A-Z]{3}$/.test(r.currency)&&Number.isFinite(r.rate)&&r.rate>0&&Number.isFinite(r.unit)&&r.unit>0).map(r=>[r.currency,r.rate/r.unit]));}
module.exports={publishedUnitRates};
