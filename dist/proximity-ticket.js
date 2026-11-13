window.PickupTicket=(()=>{
 const words={
  distance:['선택 ATM까지 직선거리','Straight-line distance to selected ATM','選択ATMまでの直線距離','到所选ATM的直线距离','到所選ATM的直線距離'],
  uncertain:['GPS 오차로 실제 거리와 차이가 날 수 있어요.','GPS uncertainty can differ from the actual distance.','GPS誤差により実際の距離と異なる場合があります。','GPS误差可能导致距离与实际不符。','GPS誤差可能導致距離與實際不符。'],
  updated:['위치 확인','Location updated','位置確認','位置更新','位置更新'],
  accuracy:['위치 오차','GPS accuracy','位置精度','定位误差','定位誤差'],
  refresh:['위치 다시 확인','Refresh location','位置を再確認','重新定位','重新定位'],
  renew:['코드 다시 받기','Request a new code','コード再発行','重新获取取款码','重新取得提款碼'],
  timeout:['위치 확인 시간이 초과됐어요. 다시 확인해주세요.','Location timed out. Please retry.','位置確認がタイムアウトしました。再確認してください。','定位超时，请重试。','定位逾時，請重試。'],
  unavailable:['GPS 위치를 확인하지 못했어요. 다시 확인해주세요.','GPS is unavailable. Please retry.','GPSを取得できません。再確認してください。','无法获取GPS，请重试。','無法取得GPS，請重試。'],
  locked:['ATM 근처에서 코드를 확인하세요','Your code unlocks near the ATM','ATMの近くでコードを確認','到达ATM附近后查看取款码','抵達ATM附近後查看提款碼'],
  target:['이용할 ATM을 선택해주세요','Choose your pickup ATM','利用するATMを選択してください','请选择取款ATM','請選擇提款ATM'],
  gps:['위치 확인이 필요해요','Location is required','位置情報が必要です','需要确认位置','需要確認位置'],
  inaccurate:['위치 정확도를 확인하지 못했어요. 위치를 다시 확인해주세요.','GPS accuracy is unavailable. Please refresh your location.','位置精度を取得できません。位置を再確認してください。','无法确认定位精度，请重新定位。','無法確認定位精度，請重新定位。'],
  outside:['30m 이내 도착 시 QR·인출 코드가 표시돼요','QR and code appear within 30 m','30m以内でQR・出金コードを表示','进入30米内后显示二维码和取款码','進入30公尺內後顯示QR碼與提款碼'],
  enable:['위치 확인 켜기','Enable location','位置情報を有効にする','开启定位','開啟定位'],
  denied:['위치 권한을 허용해주세요','Please allow location access','位置情報を許可してください','请允许定位权限','請允許定位權限'],
  waiting:['ATM 출금 확인 대기','Awaiting ATM withdrawal confirmation','ATM出金確認待ち','等待ATM取款确认','等待ATM提款確認'],
  arrived:['선택한 ATM 30m 이내','Within 30 m of selected ATM','選択したATMの30m以内','已进入所选ATM的30米范围','已進入所選ATM的30公尺範圍']
 };
 function gate(target,fix,now,distance,visible=true){
  if(!target)return {unlocked:false,reason:'target',metres:null};
  if(!visible||!fix||!Number.isFinite(fix.lat)||!Number.isFinite(fix.lng)||!Number.isFinite(fix.timestamp)||now-fix.timestamp>60000||now<fix.timestamp)return {unlocked:false,reason:'gps',metres:null};
  const metres=distance(target,fix);if(!Number.isFinite(metres))return {unlocked:false,reason:'gps',metres:null};
  if(!Number.isFinite(fix.accuracy)||fix.accuracy<0)return {unlocked:false,reason:'inaccurate',metres};
 return {unlocked:metres<=30,reason:metres<=30?'arrived':'outside',metres};
 }
 function attach({root,request,language,t,distance,onCopy,onState,onReissue,onPosition}){
  const index=['ko','en','ja','zh-CN','zh-TW'].indexOf(language),w=k=>words[k][index<0?1:index];
  let target=request.atmTarget||null,fix=null,denied=false,locationError=null,watch,dialog,key='',disposed=false,polling=false,lastPoll=0,fallbackPending=false,lastFallback=0;
  const el=(tag,cls,text)=>{const n=document.createElement(tag);n.className=cls||'';if(text)n.textContent=text;return n;};
  const ticket=el('section','withdrawal-ticket proximity-ticket');ticket.setAttribute('aria-live','polite');root.classList.add('has-withdrawal');root.append(ticket);
  const allowed=()=>gate(target,fix,Date.now(),distance,!document.hidden).unlocked&&request.expires>Date.now();
  const fixAge=()=>w('updated')+' · '+new Intl.RelativeTimeFormat(language,{numeric:'always'}).format(-Math.max(0,Math.floor((Date.now()-fix.timestamp)/1000)),'second');
  function render(){
   const age=ticket.querySelector?.('.proximity-age');if(age&&fix)age.textContent=fixAge();
   const state=gate(target,fix,Date.now(),distance,!document.hidden),expired=request.expires<=Date.now();
   const next=state.unlocked&&!expired?'arrived|'+target.id:[expired?'expired':state.reason,target?.id||'',state.metres===null?'':Math.ceil(state.metres),denied,locationError,Math.round(fix?.accuracy||0)].join('|');
   if(next===key)return;key=next;onState?.({unlocked:state.unlocked&&!expired,reason:expired?'expired':state.reason});dialog?.close();dialog?.remove();dialog=null;ticket.replaceChildren();
   ticket.classList.toggle('is-unlocked',state.unlocked&&!expired);
   if(!state.unlocked||expired){
    ticket.append(el('span','proximity-lock','⌖'));const body=el('div','proximity-copy');
    body.append(el('strong','',expired?t('expired'):w('locked')));
    if(target)body.append(el('span','proximity-target',target.name));
    if(!expired){body.append(el('small','',w(denied&&target?'denied':state.reason==='gps'&&locationError?locationError:state.reason)));if(state.metres!==null)body.append(el('small','proximity-distance',w('distance')+' '+Math.ceil(state.metres)+' m'));
     if(fix&&Number.isFinite(fix.accuracy))body.append(el('small','proximity-accuracy',w('accuracy')+' ±'+Math.ceil(fix.accuracy)+' m'),el('small','proximity-age',fixAge()));if(fix?.accuracy>30)body.append(el('small','proximity-uncertain',w('uncertain')));
     if(target){const button=el('button','proximity-enable',w('refresh'));button.onclick=start;body.append(button);}
    }else if(onReissue){const renew=el('button','proximity-enable',w('renew'));renew.onclick=onReissue;body.append(renew);}ticket.append(body);return;
   }
   const qr=window.qrcode(0,'M');qr.addData(request.code,'Numeric');qr.make();
   const qrButton=el('button','ticket-qr');qrButton.type='button';qrButton.setAttribute('aria-label',t('scan'));qrButton.innerHTML=qr.createSvgTag({cellSize:4,margin:16,scalable:true});
   const body=el('div','ticket-body'),top=el('div','ticket-label');top.append(el('span','',w('arrived')),el('span','ticket-demo',t('demo')));
   const digits=el('button','ticket-digits',request.code.slice(0,3)+' '+request.code.slice(3));digits.setAttribute('aria-label',t('copy'));digits.onclick=()=>{if(allowed())onCopy();};
   body.append(top,digits,el('small','proximity-target',target.name),el('small','ticket-waiting',w('waiting')));ticket.append(qrButton,body);
   dialog=el('dialog','withdrawal-qr-dialog');dialog.setAttribute('aria-label',t('scan'));const close=el('button','qr-dialog-close','×');close.setAttribute('aria-label',t('close'));close.onclick=()=>dialog.close();const large=el('div','qr-large');large.innerHTML=qr.createSvgTag({cellSize:10,margin:40,scalable:true});dialog.append(close,el('h2','',t('withdrawal')),large,el('strong','qr-dialog-digits',request.code.slice(0,3)+' '+request.code.slice(3)),el('p','',t('demoQr')));root.append(dialog);qrButton.onclick=()=>{if(allowed())dialog.showModal();};
  }
  function accept(pos){if(disposed||denied||!Number.isFinite(pos?.timestamp)||fix&&pos.timestamp<fix.timestamp)return;denied=false;locationError=null;fix={lat:pos.coords.latitude,lng:pos.coords.longitude,accuracy:pos.coords.accuracy,timestamp:pos.timestamp};onPosition?.(pos);render();}
  function reject(error,tryFallback=true){
   if(disposed)return;denied=error?.code===1;locationError=denied?null:error?.code===3?'timeout':'unavailable';if(denied){fix=null;onPosition?.(null);}render();
   if(!denied&&!document.hidden&&tryFallback&&!fallbackPending&&navigator.geolocation?.getCurrentPosition&&Date.now()-lastFallback>10000){fallbackPending=true;lastFallback=Date.now();navigator.geolocation.getCurrentPosition(pos=>{fallbackPending=false;accept(pos);},err=>{fallbackPending=false;reject(err,false);},{enableHighAccuracy:false,maximumAge:10000,timeout:15000});}
  }
  function start(){
   if(disposed)return;denied=false;if(watch!==undefined)navigator.geolocation?.clearWatch(watch);
   if(!navigator.geolocation){denied=true;fix=null;render();return;}
   const fail=error=>reject(error);
   navigator.geolocation.getCurrentPosition?.(accept,fail,{enableHighAccuracy:true,maximumAge:0,timeout:15000});
   watch=navigator.geolocation.watchPosition(accept,fail,{enableHighAccuracy:true,maximumAge:0,timeout:15000});
  }
  function visibility(){key='';render();if(!document.hidden&&target)start();}
  document.addEventListener('visibilitychange',visibility);const timer=setInterval(()=>{render();if(!disposed&&!denied&&target&&!document.hidden&&navigator.geolocation?.getCurrentPosition&&!polling&&(!fix||Date.now()-fix.timestamp>10000)&&Date.now()-lastPoll>10000){polling=true;lastPoll=Date.now();navigator.geolocation.getCurrentPosition(pos=>{polling=false;accept(pos);},error=>{polling=false;reject(error);},{enableHighAccuracy:true,maximumAge:0,timeout:15000});}},1000);render();if(target)start();
  return {element:ticket,accept,start,clear(){target=null;request.atmTarget=null;key='';render();},select(item){target={id:item.id,name:item.name,lat:item.lat,lng:item.lng};request.atmTarget=target;key='';render();start();},dispose(){disposed=true;clearInterval(timer);if(watch!==undefined)navigator.geolocation?.clearWatch(watch);document.removeEventListener('visibilitychange',visibility);dialog?.close();dialog?.remove();ticket.remove();}};
 }
 return {attach,gate,words};
})();
