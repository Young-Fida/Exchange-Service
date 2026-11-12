import React,{useState} from 'react';
import {CandlestickChart} from 'ztd-charts';
import {dailyBodies,weeklyCandles} from '../lib/candle-model.cjs';
const words={
 daily:['일별 변동봉','Daily change bars','日別変動バー','每日变动柱','每日變動柱'],weekly:['주간 캔들','Weekly candles','週次ローソク足','周蜡烛图','週蠟燭圖'],
 date:['날짜 선택','Select date','日付を選択','选择日期','選擇日期'],previous:['직전 고시 대비','Since previous fixing','前回公表値比','较上次公布值','較上次公布值'],none:['직전 고시값 없음','No previous observation','前回の公表値なし','无上次公布值','無上次公布值'],
 rise:['상승','Rise','上昇','上涨','上漲'],fall:['하락','Fall','下落','下跌','下跌'],
 dailyNote:['봉의 양 끝은 직전·당일 고시값입니다. 장중 시가·고가·저가·종가 캔들이 아닙니다.','Each body connects the previous and current fixing, not intraday OHLC.','バーの両端は前回と当日の公表値です。日中OHLCではありません。','柱体两端为上次与当日公布值，并非日内OHLC。','柱體兩端為上次與當日公布值，並非日內OHLC。'],
 weeklyNote:['한 주의 첫·마지막·최고·최저 일별 고시값으로 묶었습니다. 주가 덜 끝났거나 조회 범위에 걸리면 일부 날짜만 포함됩니다.','Grouped from each week’s first, last, highest and lowest daily fixing. Boundary weeks may be incomplete.','週の最初・最後・最高・最低の日次公表値を集計。端の週は一部の日付のみ含みます。','按每周首个、末个、最高及最低日公布值聚合，边界周可能不完整。','依每週首筆、末筆、最高及最低日公布值彙整，邊界週可能不完整。'],
 first:['첫 고시','First fixing','最初の公表値','首个公布值','首筆公布值'],last:['마지막 고시','Last fixing','最後の公表値','末个公布值','末筆公布值'],high:['최고 고시','Highest fixing','最高公表値','最高公布值','最高公布值'],low:['최저 고시','Lowest fixing','最低公表値','最低公布值','最低公布值']
};
export function MiniRateCandles({points}){
 const rows=dailyBodies(points),values=rows.map(p=>p.rate);if(!rows.length)return null;
 const lo=Math.min(...values),hi=Math.max(...values),span=Math.max(hi-lo,hi*.001),y=value=>3+(hi-value)/span*27,step=98/rows.length;
 return <svg viewBox="0 0 102 34" width="102" height="34" aria-hidden="true">{rows.map((p,i)=>{const start=p.previous??p.rate,up=p.delta!==null&&p.delta>=0;return <rect key={p.date} x={2+step*(i+.22)} y={y(Math.max(p.rate,start))} width={Math.min(11,step*.56)} height={Math.max(2,Math.abs(y(p.rate)-y(start)))} rx="1" fill={p.delta===null?'#93a9bf':up?'#FDED80':'#0575e6'}/>;})}</svg>;
}
export function RateCandleView({points,language,width}){
 const ix=Math.max(0,['ko','en','ja','zh-CN','zh-TW'].indexOf(language)),t=k=>words[k][ix];
 const daily=dailyBodies(points),weeks=weeklyCandles(points);const [mode,setMode]=useState('daily'),[selected,setSelected]=useState(null),[week,setWeek]=useState(null);
 const pos=Math.max(0,Math.min(daily.length-1,selected??daily.length-1)),picked=daily[pos],pickedWeek=weeks[week??weeks.length-1];
 const fmt=n=>new Intl.NumberFormat(language,{minimumFractionDigits:2,maximumFractionDigits:2}).format(n);
 if(!picked)return null;
 const W=Math.max(240,width),H=254,L=53,R=12,T=15,B=36,step=(W-L-R)/daily.length;
 const values=daily.flatMap(p=>p.previous===null?[p.rate]:[p.rate,p.previous]);const low=Math.min(...values),high=Math.max(...values),pad=Math.max((high-low)*.18,high*.001),min=low-pad,max=high+pad;
 const y=n=>T+(max-n)/(max-min)*(H-T-B),x=i=>L+step*(i+.5),short=date=>new Intl.DateTimeFormat(language,{month:'numeric',day:'numeric',timeZone:'UTC'}).format(new Date(date+'T00:00:00Z'));
 const selectPointer=event=>{const rect=event.currentTarget.getBoundingClientRect();const px=(event.clientX-rect.left)*W/rect.width;setSelected(Math.max(0,Math.min(daily.length-1,Math.floor((px-L)/step))));};
 return <section className="rate-candle-view"><div className="candle-modes">{['daily','weekly'].map(value=><button key={value} type="button" aria-pressed={mode===value} onClick={()=>setMode(value)}>{t(value)}</button>)}</div>
 {mode==='daily'?<><div className="candle-readout" aria-live="polite"><time>{picked.date}</time><strong>{fmt(picked.rate)} <small>KRW</small></strong><span>{picked.delta===null?t('none'):(picked.delta>0?'+':'')+fmt(picked.delta)+' ('+(picked.delta>0?'+':'')+(picked.delta/picked.previous*100).toFixed(2)+'%) · '+t('previous')}</span>{picked.previousDate&&<small>{picked.previousDate} → {picked.date}</small>}</div>
 <div className="candle-legend"><span><i className="rise"/>{t('rise')}</span><span><i className="fall"/>{t('fall')}</span><small>KRW</small></div>
 <svg className="rate-day-svg" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={t('daily')+' · '+picked.date+' · '+fmt(picked.rate)+' KRW'} onPointerMove={selectPointer} onPointerDown={event=>{selectPointer(event);event.currentTarget.setPointerCapture(event.pointerId);}} style={{touchAction:'pan-y'}}>
 {[0,.25,.5,.75,1].map(f=>{const value=min+(max-min)*f;return <g key={f}><line x1={L} x2={W-R} y1={y(value)} y2={y(value)} stroke="#e5edf7"/><text x={L-8} y={y(value)+3} textAnchor="end" fill="#7188a0" fontSize="9">{fmt(value)}</text></g>;})}
 <rect x={L+step*pos} y={T} width={step} height={H-T-B} fill="#edf5ff"/>
 {daily.map((p,i)=>{const up=p.delta!==null&&p.delta>=0,color=up?'#FDED80':'#0575e6',stroke=up?'#b89a32':'#0575e6',top=y(Math.max(p.rate,p.previous??p.rate)),height=Math.max(2,Math.abs(y(p.rate)-y(p.previous??p.rate))),bar=Math.min(17,step*.58);return <g key={p.date}><rect x={x(i)-bar/2} y={top} width={bar} height={height} rx="1.5" fill={p.delta===null?'#94aac0':color} stroke={p.delta===null?'#94aac0':stroke} strokeWidth={i===pos?1.8:.7}/><circle cx={x(i)} cy={y(p.rate)} r={i===pos?3:1.3} fill="#173653"/>{(i===0||i===daily.length-1||i%Math.max(1,Math.ceil(daily.length/4))===0)&&<text x={x(i)} y={H-12} textAnchor="middle" fill="#7188a0" fontSize="9">{short(p.date)}</text>}</g>;})}
 <line x1={L} x2={W-R} y1={y(picked.rate)} y2={y(picked.rate)} stroke="#597fa4" strokeDasharray="3 3" opacity=".65"/>
 </svg><label className="candle-date-slider"><span>{t('date')}</span><input type="range" min="0" max={daily.length-1} step="1" value={pos} aria-label={t('date')} aria-valuetext={picked.date+' '+fmt(picked.rate)+' KRW'} onChange={event=>setSelected(Number(event.target.value))}/></label><p className="candle-method">{t('dailyNote')}</p></>:<><div className="weekly-fixing-summary"><time>{pickedWeek.date} — {pickedWeek.endDate}</time><div>{['first','high','low','last'].map((key,i)=><span key={key}>{t(key)}<b>{fmt(pickedWeek[['open','high','low','close'][i]])}</b></span>)}</div></div>
 <CandlestickChart ariaLabel={t('weekly')} description={t('weeklyNote')} data={weeks} width={W} height={254} x="date" open="open" high="high" low="low" close="close" upColor="#FDED80" downColor="#0575e6" locale={language==='ko'?'ko-KR':'en-US'} format={{minimumFractionDigits:2,maximumFractionDigits:2}} onHover={event=>{if(event)setWeek(event.index);}} tooltip={false} theme={{accent:'#0575e6',ink:'#173653'}}/>
 <label className="candle-date-slider"><span>{t('date')}</span><input type="range" min="0" max={weeks.length-1} step="1" value={week??weeks.length-1} aria-label={t('date')} onChange={event=>setWeek(Number(event.target.value))}/></label><p className="candle-method">{t('weeklyNote')}</p></>}
 </section>;
}
