function ordered(points){return [...points].filter(p=>/^\d{4}-\d{2}-\d{2}$/.test(p.date)&&Number.isFinite(p.rate)&&p.rate>0).sort((a,b)=>a.date.localeCompare(b.date));}
function dailyBodies(points){return ordered(points).map((p,i,rows)=>({...p,previous:i?rows[i-1].rate:null,previousDate:i?rows[i-1].date:null,delta:i?p.rate-rows[i-1].rate:null}));}
function weeklyCandles(points){
 const groups=new Map();for(const p of ordered(points)){const day=new Date(p.date+'T00:00:00Z');day.setUTCDate(day.getUTCDate()-((day.getUTCDay()+6)%7));const key=day.toISOString().slice(0,10);if(!groups.has(key))groups.set(key,[]);groups.get(key).push(p);}
 return [...groups.values()].map(rows=>({date:rows[0].date,endDate:rows.at(-1).date,open:rows[0].rate,close:rows.at(-1).rate,high:Math.max(...rows.map(p=>p.rate)),low:Math.min(...rows.map(p=>p.rate)),count:rows.length}));
}
module.exports={dailyBodies,weeklyCandles};
