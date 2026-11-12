import {RateCandleView,MiniRateCandles} from './rate-candles.jsx';
import './exchange-ui.jsx';
import React,{useEffect,useState,useRef} from 'react';
import {createRoot} from 'react-dom/client';
import {Button} from '@astryxdesign/core/Button';
import {Theme} from '@astryxdesign/core/theme';
import {neutralTheme} from '@astryxdesign/theme-neutral/built';
import '@astryxdesign/core/reset.css';
import '@astryxdesign/core/astryx.css';
import '@astryxdesign/theme-neutral/theme.css';
const messages={
 title:['환율 변동','Exchange-rate trend','為替レートの推移','汇率走势','匯率走勢'],
 note:['한국수출입은행 · 일별 매매기준율','Korea Eximbank · Daily base rate','韓国輸出入銀行・日次基準レート','韩国进出口银行 · 每日基准汇率','韓國進出口銀行 · 每日基準匯率'],
 loading:['기간별 환율을 불러오는 중…','Loading historical rates…','過去のレートを取得中…','正在加载历史汇率…','正在載入歷史匯率…'],
 error:['차트 데이터를 불러오지 못했어요.','Could not load chart data.','データを取得できませんでした。','无法加载图表数据。','無法載入圖表資料。'],
 empty:['이 기간에 표시할 데이터가 없어요.','No data for this period.','この期間のデータがありません。','此期间暂无数据。','此期間暫無資料。'],
 retry:['다시 시도','Retry','再試行','重试','重試'],
 high:['최고','High','最高','最高','最高'],low:['최저','Low','最低','最低','最低'],
 change:['기간 첫 고시 대비','Since first observation','期間の最初の公表値比','较期间首个公布值','較期間首個公布值'],
 baseline:['기간 첫 고시','First observation','最初の公表値','首个公布值','首個公布值'],
 foot:['일별 고시 데이터이며 초·분 단위 시세가 아닙니다. 휴일은 관측값이 없으며, 실제 거래 환율과 다를 수 있어요.','Daily published data, not live tick prices. Holidays have no observations. Transaction rates may differ.','日次公表値であり分・秒単位の相場ではありません。休日は観測値がなく、取引レートとは異なる場合があります。','每日公布数据，并非逐秒行情；节假日无观测值，实际交易汇率可能不同。','每日公布資料，並非逐秒行情；假日無觀測值，實際交易匯率可能不同。'],
 partial:['일부 날짜 조회에 실패했어요.','Some dates could not be retrieved.','一部の日付を取得できませんでした。','部分日期查询失败。','部分日期查詢失敗。'],
 axis:['선의 높이는 선택 기간의 값에 맞춰 표시돼요.','The line height is scaled to the selected period.','線の高さは選択期間の値に合わせています。','线条高度按所选期间的数据缩放。','線條高度依所選期間的資料縮放。'],
 one:['데이터가 1건이라 변동을 계산할 수 없어요.','One observation; change cannot be calculated.','1件のため変動を算出できません。','仅一条数据，无法计算变动。','僅一筆資料，無法計算變動。']
};
function Content({currency,language}){
 const index=['ko','en','ja','zh-CN','zh-TW'].indexOf(language),t=k=>messages[k][index<0?1:index];
 const [mode,setMode]=useState('daily');const [days,setDays]=useState(30),[attempt,setAttempt]=useState(0),[state,setState]=useState({loading:true});const chartRef=useRef(null);const [width,setWidth]=useState(320);
 useEffect(()=>{const observer=new ResizeObserver(entries=>setWidth(Math.floor(entries[0].contentRect.width)));observer.observe(chartRef.current);return()=>observer.disconnect();},[]);
 useEffect(()=>{const controller=new AbortController();setState({loading:true});fetch('/api/rate-history?'+new URLSearchParams({currency,days}),{signal:controller.signal}).then(async response=>{const data=await response.json();if(!response.ok)throw Error(data.error);if(!controller.signal.aborted)setState({data});}).catch(error=>{if(error.name!=='AbortError')setState({error:error.message});});return()=>controller.abort();},[currency,days,attempt]);
 const data=state.data,points=data?.points||[],first=points[0],last=points.at(-1),change=last?last.rate-first.rate:0,percent=first?change/first.rate*100:0;
 const fmt=n=>new Intl.NumberFormat(language,{minimumFractionDigits:2,maximumFractionDigits:2}).format(n);
 const values=points.map(p=>p.rate),lo=Math.min(...values),hi=Math.max(...values),pad=points.length?Math.max((hi-lo)*.15,hi*.001):1;
 return <><header className="fx-sheet-head"><div><span>{currency} / KRW</span><h2 id="fx-title">{t('title')}</h2></div><button className="fx-close" aria-label="Close" onClick={()=>document.querySelector('#fx-chart-dialog').close()}>×</button></header>
 <div className="fx-sheet-scroll"><p className="fx-source">{t('note')}</p><div className="fx-periods">{(mode==='weekly'?[30,90]:[7,30]).map(n=><Button key={n} className="fx-period-button" variant={days===n?"primary":"ghost"} aria-pressed={days===n} onClick={()=>setDays(n)} label={n===90?['3개월','3M','3か月','3个月','3個月'][index]:n===7?['1주','1W','1週間','1周','1週'][index]:['1개월','1M','1か月','1个月','1個月'][index]}/>)}</div>
 {state.loading?<p className="fx-feedback" role="status">{t('loading')}</p>:state.error?<div className="fx-feedback" role="alert"><p>{t(state.error==='NO_DATA'?'empty':'error')}</p><button onClick={()=>setAttempt(attempt+1)}>{t('retry')}</button></div>:last?<><div className="fx-quote"><span>{data.unit} {currency} → KRW</span><strong>{fmt(last.rate)}<small> KRW</small></strong><time>{last.date}</time></div><div className="fx-change">{points.length>1?<><b>{change>0?'↗':change<0?'↘':'→'} {change>0?'+':''}{fmt(change)} ({percent>0?'+':''}{percent.toFixed(2)}%)</b><span>{t('change')}</span></>:t('one')}</div></>:null}
 <div className="fx-chart-mount" ref={chartRef}>{points.length>0&&<RateCandleView key={currency+days} points={points} language={language} width={width} mode={mode} onModeChange={value=>{setMode(value);setDays(value==='weekly'?90:30);}}/>}</div>
 {last&&<><div className="fx-extremes"><div><span>{t('low')}</span><strong>{fmt(lo)}</strong></div><div><span>{t('high')}</span><strong>{fmt(hi)}</strong></div></div><p className="fx-date-range">{first.date} — {last.date}</p></>}{data?.partial&&<p className="fx-partial">{t('partial')}</p>}<p className="fx-footnote">{t('foot')}</p></div></>;
}
let mounted;
window.openRateChart=({currency,language})=>{
 let dialog=document.querySelector('#fx-chart-dialog');if(!dialog){dialog=document.createElement('dialog');dialog.id='fx-chart-dialog';dialog.className='fx-chart-sheet';dialog.setAttribute('aria-labelledby','fx-title');document.body.append(dialog);dialog.addEventListener('close',()=>{mounted?.unmount();mounted=null;dialog.replaceChildren();});}
 mounted?.unmount();dialog.replaceChildren();const root=document.createElement('div');root.className='fx-sheet-root';dialog.append(root);mounted=createRoot(root);mounted.render(<Theme theme={neutralTheme} mode="light"><Content currency={currency} language={language}/></Theme>);dialog.showModal();
};

function MiniTrend({currency,language}){
 const [points,setPoints]=useState(null);
 useEffect(()=>{const controller=new AbortController();fetch('/api/rate-history?'+new URLSearchParams({currency,days:7}),{signal:controller.signal}).then(r=>{if(!r.ok)throw Error('history');return r.json();}).then(d=>{if(!controller.signal.aborted)setPoints(d.points);}).catch(()=>{if(!controller.signal.aborted)setPoints([]);});return()=>controller.abort();},[currency]);
 return points===null?<span className="mini-trend-placeholder">···</span>:points.length?<><MiniRateCandles points={points}/><span className="mini-trend-open">›</span></>:<span className="mini-trend-placeholder">—</span>;
}
let miniObserver,miniRoots=[];
window.mountRateSparklines=(container,language)=>{
 miniObserver?.disconnect();miniRoots.forEach(root=>root.unmount());miniRoots=[];
 miniObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(!entry.isIntersecting)return;const button=entry.target;miniObserver.unobserve(button);const root=createRoot(button);miniRoots.push(root);root.render(<MiniTrend currency={button.dataset.rateChart} language={language}/>);});},{root:container,rootMargin:'40px'});
 container.querySelectorAll('[data-rate-chart]').forEach(button=>miniObserver.observe(button));
};
