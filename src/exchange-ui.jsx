import React,{useState} from 'react';
import {createRoot} from 'react-dom/client';
import {flushSync} from 'react-dom';
import {Theme} from '@astryxdesign/core/theme';
import {neutralTheme} from '@astryxdesign/theme-neutral/built';
import {Card} from '@astryxdesign/core/Card';
import {Button} from '@astryxdesign/core/Button';
import {NumberInput} from '@astryxdesign/core/NumberInput';
import {Selector} from '@astryxdesign/core/Selector';
import {Stepper,Step} from '@astryxdesign/core/Stepper';
const labels=[['금액 입력','ATM 이동','코드 확인'],['Amount','Find ATM','View code'],['金額入力','ATMへ移動','コード確認'],['输入金额','前往ATM','查看代码'],['輸入金額','前往ATM','查看代碼']];
const index=language=>Math.max(0,['ko','en','ja','zh-CN','zh-TW'].indexOf(language));
function Flow({step,language}){return <Theme theme={neutralTheme} mode="light"><Stepper activeStep={Math.max(0,Math.min(2,step-1))} label={labels[index(language)].join(' → ')} density="compact" indicatorPosition="on-track" horizontalOptions={{minimumStepWidth:72,collapsedVariant:'withLabel'}}>{labels[index(language)].map((label,i)=><Step key={i} step={i} label={label}/>)}</Stepper></Theme>;}
window.createFlowProgress=(element,{step,language})=>{const root=createRoot(element);const draw=value=>root.render(<Flow step={value} language={language}/>);draw(step);return {setStep:draw,dispose:()=>root.unmount()};};
function Application({config:c}){
 const [draft,setDraft]=useState(c.draft),[custom,setCustom]=useState(c.custom),[error,setError]=useState('');const t=c.t;
 const base=currency=>currency==='KRW'?1:(custom[currency]||c.rates[currency]);
 const pair=draft.currency===draft.toCurrency?1:base(draft.currency)&&base(draft.toCurrency)?base(draft.currency)/base(draft.toCurrency):null;
 const amount=Number(draft.amount),valid=Number.isFinite(amount)&&amount>0&&amount<=1e12;
 const update=patch=>{const next={...draft,...patch};setDraft(next);c.onDraft(next);setError('');};
 const missing=draft.currency===draft.toCurrency?[]:[...new Set([draft.currency,draft.toCurrency])].filter(cur=>cur!=='KRW'&&!c.rates[cur]);
 return <Theme theme={neutralTheme} mode="light"><form id="apply-form" className="astryx-exchange-form" onSubmit={event=>{event.preventDefault();if(!valid||!pair){setError(t(!pair?'rateMissing':'amountError'));return;}c.onSubmit(draft,pair);}}>
 <div className="exchange-form-heading"><span className="exchange-form-kicker">{t('qrExchange')}</span><h1 dangerouslySetInnerHTML={{__html:t('applyTitle')}}/><p>{t('applyDesc')}</p></div>
 <div className="exchange-pair-stack"><Card className="exchange-money-card" padding={5}><div className="money-card-top"><span>{t('give')}</span><span className="prototype-pill">{t('demo')}</span></div><Selector label={t('fromCurrency')} isLabelHidden options={c.options} value={draft.currency} onChange={value=>update({currency:value})} width="100%" className="exchange-currency-field"/>
 <div className="exchange-amount-field" onInput={event=>{if(event.target.tagName==='INPUT'){const value=event.target.value;update({amount:value});}}}><NumberInput controlClassName="exchange-number-control" controlStyle={{minHeight:56,height:"auto"}} id="give-amount" aria-label={t('give')} label={t('give')} isLabelHidden value={draft.amount===''?null:amount} hasClear onChange={value=>update({amount:value===null?'':String(value)})} isWheelEnabled={false} formatValue={value=>String(value)} placeholder="0" width="100%" units={draft.currency}/></div></Card>
 <Button label={t('swap')} isIconOnly className="exchange-swap-action" icon={<svg viewBox="0 0 24 24"><path d="M5 8h14m-4-4 4 4-4 4M19 16H5m4 4-4-4 4-4"/></svg>} onClick={()=>{const next=pair&&valid?String(Number((amount*pair).toPrecision(12))):draft.amount;update({currency:draft.toCurrency,toCurrency:draft.currency,amount:next});}}/>
 <Card className="exchange-money-card receive-money-card" padding={5}><div className="money-card-top"><span>{t('receiveCurrency')}</span><span className="estimate-pill">{t('sampleRate')}</span></div><Selector label={t('toCurrency')} isLabelHidden options={c.options} value={draft.toCurrency} onChange={value=>update({toCurrency:value})} width="100%" className="exchange-currency-field"/><div className="exchange-receive-amount"><output aria-live="polite">{valid&&pair?c.format(amount*pair,draft.toCurrency):'—'}</output><span>{draft.toCurrency}</span></div><p className="exchange-rate-caption">{pair?'1 '+draft.currency+' = '+Number(pair.toPrecision(6)).toLocaleString(c.language,{maximumFractionDigits:6})+' '+draft.toCurrency:t('rateMissing')}</p></Card></div>
 {missing.length>0&&<Card padding={4} className="exchange-custom-rates"><p>{t('rateHelp')}</p>{missing.map(currency=><NumberInput key={currency} label={'1 '+currency+' → KRW'} value={custom[currency]||null} hasClear onChange={value=>{const next={...custom,[currency]:value};setCustom(next);c.onCustom(currency,value);}} isWheelEnabled={false}/>)}</Card>}
 {error&&<p className="form-error" role="alert">{error}</p>}
 <div className="exchange-next-preview"><span className="next-preview-icon">↗</span><div><strong>{t('nextAtmTitle')}</strong><p>{t('nextAtmHint')}</p></div></div>
 <details className="exchange-disclosure"><summary>{t('demoInfo')}</summary><p>{t('quoteNote')} {t('demoSupport')}</p></details>
 <div className="apply-fixed-actions astryx-apply-actions"><div className="action-estimate"><span>{t('receiveCurrency')}</span><strong>{valid&&pair?c.format(amount*pair,draft.toCurrency):'—'} <small>{draft.toCurrency}</small></strong></div><Button label={t('liveRates')} className="fixed-rates-button" variant="secondary" onClick={c.onRates}/><Button label={t('continueAtm')} type="submit" className="button gold" variant="primary"/></div>
 </form></Theme>;
}
window.mountExchangeApplication=(element,config)=>{const root=createRoot(element);flushSync(()=>root.render(<Application config={config}/>));return ()=>root.unmount();};
