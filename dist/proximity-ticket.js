window.PickupTicket=(()=>{
 const words={
  locked:['ATM 근처에서 코드를 확인하세요','Your code unlocks near the ATM','ATMの近くでコードを確認','到达ATM附近后查看取款码','抵達ATM附近後查看提款碼'],
  target:['이용할 ATM을 선택해주세요','Choose your pickup ATM','利用するATMを選択してください','请选择取款ATM','請選擇提款ATM'],
  gps:['위치 확인이 필요해요','Location is required','位置情報が必要です','需要确认位置','需要確認位置'],
  inaccurate:['위치 오차가 커요. 탁 트인 곳에서 다시 확인해주세요.','Location is imprecise. Try an open area.','位置誤差が大きいため、開けた場所で再確認してください。','定位误差较大，请到开阔处重试。','定位誤差較大，請到開闊處重試。'],
  outside:['30m 이내 도착 시 QR·인출 코드가 표시돼요','QR and code appear within 30 m','30m以内でQR・出金コードを表示','进入30米内后显示二维码和取款码','進入30公尺內後顯示QR碼與提款碼'],
  enable:['위치 확인 켜기','Enable location','位置情報を有効にする','开启定位','開啟定位'],
  denied:['위치 권한을 허용해주세요','Please allow location access','位置情報を許可してください','请允许定位权限','請允許定位權限'],
  arrived:['선택한 ATM 30m 이내','Within 30 m of selected ATM','選択したATMの30m以内','已进入所选ATM的30米范围','已進入所選ATM的30公尺範圍']
 };
 function gate(target,fix,now,distance,visible=true){
  if(!target)return {unlocked:false,reason:'target',metres:null};
  if(!visible||!fix||!Number.isFinite(fix.lat)||!Number.isFinite(fix.lng)||!Number.isFinite(fix.timestamp)||now-fix.timestamp>15000||now<fix.timestamp)return {unlocked:false,reason:'gps',metres:null};
  if(!Number.isFinite(fix.accuracy)||fix.accuracy<0||fix.accuracy>20)return {unlocked:false,reason:'inaccurate',metres:null};
  const metres=distance(target,fix);return {unlocked:metres<=30,reason:metres<=30?'arrived':'outside',metres};
 }
 function attach({root,request,language,t,distance,onCopy}){
  const index=['ko','en','ja','zh-CN','zh-TW'].indexOf(language),w=k=>words[k][index<0?1:index];
  let target=request.atmTarget||null,fix=null,denied=false,watch,dialog,key='',disposed=false;
  const el=(tag,cls,text)=>{const n=document.createElement(tag);n.className=cls||'';if(text)n.textContent=text;return n;};
  const ticket=el('section','withdrawal-ticket proximity-ticket');ticket.setAttribute('aria-live','polite');root.classList.add('has-withdrawal');root.append(ticket);
  const allowed=()=>gate(target,fix,Date.now(),distance,!document.hidden).unlocked&&request.expires>Date.now();
  function render(){
   const state=gate(target,fix,Date.now(),distance,!document.hidden),expired=request.expires<=Date.now();
   const next=[expired?'expired':state.reason,target?.id||'',state.metres===null?'':Math.ceil(state.metres),denied].join('|');
   if(next===key)return;key=next;dialog?.close();dialog?.remove();dialog=null;ticket.replaceChildren();
   ticket.classList.toggle('is-unlocked',state.unlocked&&!expired);
   if(!state.unlocked||expired){
    ticket.append(el('span','proximity-lock','⌖'));const body=el('div','proximity-copy');
    body.append(el('strong','',expired?t('expired'):w('locked')));
    if(target)body.append(el('span','proximity-target',target.name));
    if(!expired){body.append(el('small','',w(denied&&target?'denied':state.reason)));if(state.metres!==null)body.append(el('small','proximity-distance',Math.ceil(state.metres)+' m'));
     if(target&&(state.reason==='gps'||denied)){const button=el('button','proximity-enable',w('enable'));button.onclick=start;body.append(button);}
    }ticket.append(body);return;
   }
   const qr=window.qrcode(0,'M');qr.addData(request.code,'Numeric');qr.make();
   const qrButton=el('button','ticket-qr');qrButton.type='button';qrButton.setAttribute('aria-label',t('scan'));qrButton.innerHTML=qr.createSvgTag({cellSize:4,margin:16,scalable:true});
   const body=el('div','ticket-body'),top=el('div','ticket-label');top.append(el('span','',w('arrived')),el('span','ticket-demo',t('demo')));
   const digits=el('button','ticket-digits',request.code.slice(0,3)+' '+request.code.slice(3));digits.setAttribute('aria-label',t('copy'));digits.onclick=()=>{if(allowed())onCopy();};
   body.append(top,digits,el('small','proximity-target',target.name));ticket.append(qrButton,body);
   dialog=el('dialog','withdrawal-qr-dialog');dialog.setAttribute('aria-label',t('scan'));const close=el('button','qr-dialog-close','×');close.setAttribute('aria-label',t('close'));close.onclick=()=>dialog.close();const large=el('div','qr-large');large.innerHTML=qr.createSvgTag({cellSize:10,margin:40,scalable:true});dialog.append(close,el('h2','',t('withdrawal')),large,el('strong','qr-dialog-digits',request.code.slice(0,3)+' '+request.code.slice(3)),el('p','',t('demoQr')));root.append(dialog);qrButton.onclick=()=>{if(allowed())dialog.showModal();};
  }
  function accept(pos){if(disposed)return;denied=false;fix={lat:pos.coords.latitude,lng:pos.coords.longitude,accuracy:pos.coords.accuracy,timestamp:pos.timestamp};render();}
  function start(){
   if(disposed)return;if(watch!==undefined)navigator.geolocation?.clearWatch(watch);
   if(!navigator.geolocation){denied=true;fix=null;render();return;}
   watch=navigator.geolocation.watchPosition(accept,()=>{if(!disposed){denied=true;fix=null;render();}},{enableHighAccuracy:true,maximumAge:0,timeout:15000});
  }
  function visibility(){fix=null;key='';render();}
  document.addEventListener('visibilitychange',visibility);const timer=setInterval(render,1000);render();
  return {element:ticket,accept,start,clear(){target=null;request.atmTarget=null;key='';render();},select(item){target={id:item.id,name:item.name,lat:item.lat,lng:item.lng};request.atmTarget=target;key='';render();start();},dispose(){disposed=true;clearInterval(timer);if(watch!==undefined)navigator.geolocation?.clearWatch(watch);document.removeEventListener('visibilitychange',visibility);dialog?.close();dialog?.remove();ticket.remove();}};
 }
 return {attach,gate,words};
})();
