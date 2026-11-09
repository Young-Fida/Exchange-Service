/* Google Maps renderer; ATM points come from Google Places; service support is unverified. */
window.AtmMap=(()=>{
 const areas={haeundae:{lat:35.1631,lng:129.1635},gwangalli:{lat:35.1532,lng:129.1186},nampo:{lat:35.0977,lng:129.0325}};
 const text={
  title:['주변 ATM 찾기','Find nearby ATMs','近くのATMを探す','查找附近ATM','尋找附近ATM'],
  locate:['내 주변 찾기','Use my location','現在地から探す','使用我的位置','使用我的位置'],
  consent:['위치 권한 허용 시 내 주변 ATM 검색에 사용하며, 검색 좌표는 Google에 전달돼요.','Your location is sent to Google to search for nearby ATMs.','現在地を周辺ATM検索に使用し、検索座標をGoogleに送信します。','允许定位后，搜索坐标将发送至Google以查找附近ATM。','允許定位後，搜尋座標將傳送至Google以尋找附近ATM。'],
  notice:['일반 ATM 위치 정보 · 환전 및 우리 코드 출금 지원은 미확인','General ATM locations · Exchange and our code withdrawal support unverified','一般ATM情報・両替と本サービスのコード出金は未確認','普通ATM位置 · 换汇及本服务代码取款能力未确认','一般ATM位置 · 換匯及本服務代碼提款功能未確認'],
  loading:['주변 ATM을 찾는 중…','Finding nearby ATMs…','ATMを検索中…','正在查找附近ATM…','正在尋找附近ATM…'],
  key:['구글지도 키 등록 후 다시 시도해주세요.','Register a Google Maps browser key and retry.','Google Mapsキーを登録して再試行してください。','请注册Google地图密钥后重试。','請註冊Google地圖金鑰後重試。'],
  mapError:['지도를 불러오지 못했어요. 키의 사용 주소·API 활성화·데모키 조건을 확인해주세요.','Map could not load. Check key restrictions, enabled API and demo-key conditions.','地図を読み込めません。キー・API・デモキーの条件を確認してください。','地图加载失败，请检查密钥限制、API启用和演示密钥条件。','地圖載入失敗，請檢查金鑰限制、API啟用及展示金鑰條件。'],
  retry:['다시 시도','Retry','再試行','重试','重試'],
  empty:['반경 3km에 등록된 ATM이 없어요. 다른 지역을 선택해보세요.','No mapped ATMs within 3 km. Try another area.','半径3kmに登録ATMがありません。別の地域を選択してください。','3公里内无已登记ATM，请选择其他地区。','3公里內無已登記ATM，請選擇其他地區。'],
  failed:['구글 ATM 검색에 실패했어요. Places API (New) 활성화·키 권한·사용 한도를 확인해주세요.','Google ATM search failed. Check Places API (New), key permissions and quota.','ATM検索に失敗しました。Places API (New)・キー権限・上限を確認してください。','Google ATM搜索失败，请检查Places API (New)、密钥权限和配额。','Google ATM搜尋失敗，請檢查Places API (New)、金鑰權限及配額。'],
  denied:['위치를 확인하지 못했어요. 지역 선택으로 계속 이용할 수 있어요.','Location unavailable. You can still select an area.','現在地を確認できません。地域選択をご利用ください。','无法获取位置，可继续选择地区。','無法取得位置，可繼續選擇地區。'],
  area:['선택 지역 중심 · 직선거리순','Area centre · Straight-line distance','地域中心・直線距離順','地区中心 · 直线距离排序','地區中心 · 直線距離排序'],
  nearby:['내 위치 기준 · 직선거리순','Your location · Straight-line distance','現在地・直線距離順','我的位置 · 直线距离排序','我的位置 · 直線距離排序'],
  hours:['운영시간 미확인','Hours unverified','営業時間未確認','营业时间未确认','營業時間未確認'],
  directions:['구글지도에서 길찾기','Directions in Google Maps','Google Mapsで経路検索','在Google地图中导航','在Google地圖中導航'],
  code:['인출 코드 보기 · 시연','View demo withdrawal code','出金コード・デモ','查看演示取款码','查看展示提款碼'],
  scan:['QR 크게 보기','Enlarge QR','QRを拡大','放大二维码','放大QR碼'],
  withdrawal:['인출 코드','Withdrawal code','出金コード','取款码','提款碼'],
  expires:['남은 시간','Time left','残り時間','剩余时间','剩餘時間'],
  expired:['기간 만료 · 다시 신청해주세요','Expired · Apply again','期限切れ・再申込してください','已过期，请重新申请','已過期，請重新申請'],
  demoQr:['시연용 QR입니다. 실제 ATM 출금에는 사용할 수 없어요.','Demo QR. Not valid for real ATM withdrawals.','デモQRです。実際の出金には使用できません。','演示二维码，不能用于实际ATM取款。','展示QR碼，不能用於實際ATM提款。'],
  close:['닫기','Close','閉じる','关闭','關閉'],
  copy:['코드 복사','Copy code','コードをコピー','复制代码','複製代碼'],
  info:['ATM 정보','ATM details','ATM情報','ATM信息','ATM資訊']
 };
 let sdkPromise;
 function distance(a,b){const r=Math.PI/180;const p=(b.lat-a.lat)*r,q=(b.lng-a.lng)*r;return 6371000*2*Math.atan2(Math.sqrt(Math.sin(p/2)**2+Math.cos(a.lat*r)*Math.cos(b.lat*r)*Math.sin(q/2)**2),Math.sqrt(1-(Math.sin(p/2)**2+Math.cos(a.lat*r)*Math.cos(b.lat*r)*Math.sin(q/2)**2)));}
 function mapsUrl(p){const u=new URL('https://www.google.com/maps/dir/');u.search=new URLSearchParams({api:'1',destination:p.lat+','+p.lng,...(p.id?{destination_place_id:p.id}:{})});return u.href;}
 async function loadSdk(language){
  if(window.google?.maps?.importLibrary)return;
  if(sdkPromise)return sdkPromise;
  sdkPromise=(async()=>{
   const response=await fetch('/api/map-config');const config=await response.json();
   if(!response.ok||!config.key)throw Error('KEY');
   await new Promise((resolve,reject)=>{
    const tag=document.createElement('script');let settled=false;
    const finish=error=>{if(settled)return;settled=true;clearTimeout(timer);delete window.__qrMapReady;if(error){tag.remove();reject(error);}else resolve();};
    const timer=setTimeout(()=>finish(Error('MAP')),15000);
    window.__qrMapReady=()=>finish();
    window.gm_authFailure=()=>{window.dispatchEvent(new Event('qr-map-auth-error'));finish(Error('MAP'));};
    tag.src='https://maps.googleapis.com/maps/api/js?'+new URLSearchParams({key:config.key,loading:'async',callback:'__qrMapReady',language,v:'weekly'});
    tag.async=true;tag.onerror=()=>finish(Error('MAP'));document.head.append(tag);
   });
  })().catch(error=>{sdkPromise=null;throw error;});
  return sdkPromise;
 }
 function attach({root,language,area,labels,request,onCopy}){
  let disposed=false,map,markers=[],userMarker,items=[],selected,queryId=0,controller,live=false;
  let centre=areas[area]||areas.haeundae;
  const i=['ko','en','ja','zh-CN','zh-TW'].indexOf(language),t=k=>text[k][i<0?1:i];
  const el=(name,cls,content)=>{const x=document.createElement(name);if(cls)x.className=cls;if(content)x.textContent=content;return x;};
  root.innerHTML='';
  let ticketTimer,qrDialog;
  if(request){
   root.classList.add('has-withdrawal');
   const ticket=el('section','withdrawal-ticket');ticket.setAttribute('aria-label',t('withdrawal'));
   const qrButton=el('button','ticket-qr');qrButton.type='button';qrButton.setAttribute('aria-label',t('scan'));
   const qr=window.qrcode(0,'M');qr.addData(request.code,'Numeric');qr.make();
   qrButton.innerHTML=qr.createSvgTag({cellSize:4,margin:16,scalable:true});
   const body=el('div','ticket-body'),top=el('div','ticket-label'),tag=el('span','ticket-demo','DEMO');top.append(el('span','',t('withdrawal')),tag);
   const digits=el('button','ticket-digits',request.code.slice(0,3)+' '+request.code.slice(3));digits.setAttribute('aria-label',t('copy'));digits.onclick=onCopy;
   const bottom=el('div','ticket-footer'),remaining=el('span','ticket-time'),hint=el('span','ticket-hint',t('scan'));bottom.append(remaining,hint);body.append(top,digits,bottom);ticket.append(qrButton,body);root.append(ticket);
   qrDialog=el('dialog','withdrawal-qr-dialog');qrDialog.setAttribute('aria-label',t('scan'));const close=el('button','qr-dialog-close','×');close.setAttribute('aria-label',t('close'));close.onclick=()=>qrDialog.close();
   const large=el('div','qr-large');large.innerHTML=qr.createSvgTag({cellSize:10,margin:40,scalable:true});
   qrDialog.append(close,el('h2','',t('withdrawal')),large,el('strong','qr-dialog-digits',request.code.slice(0,3)+' '+request.code.slice(3)),el('p','',t('demoQr')));root.append(qrDialog);
   qrButton.onclick=()=>{if(request.expires>Date.now())qrDialog.showModal();};qrDialog.addEventListener('click',event=>{if(event.target===qrDialog){const b=qrDialog.getBoundingClientRect();if(event.clientX<b.left||event.clientX>b.right||event.clientY<b.top||event.clientY>b.bottom)qrDialog.close();}});
   function tick(){const left=Math.max(0,Math.ceil((request.expires-Date.now())/1000));remaining.textContent=left?t('expires')+' '+String(Math.floor(left/60)).padStart(2,'0')+':'+String(left%60).padStart(2,'0'):t('expired');if(!left){qrButton.disabled=true;qrButton.innerHTML='—';digits.textContent='—';digits.disabled=true;qrDialog.close();}}
   tick();ticketTimer=setInterval(tick,1000);
  }
  const toolbar=el('div','real-map-toolbar'),select=el('select'),locate=el('button','real-location',t('locate'));
  select.setAttribute('aria-label',t('title'));Object.keys(areas).forEach(key=>{const o=el('option','',labels[key]);o.value=key;select.append(o);});select.value=area||'haeundae';
  toolbar.append(select,locate);root.append(toolbar);
  const canvas=el('div','google-atm-canvas'),status=el('p','real-map-status',t('loading')),notice=el('p','real-map-notice',t('notice')),consent=el('p','real-map-consent',t('consent'));
  canvas.setAttribute('aria-label','Google Maps');status.setAttribute('role','status');
  const dock=el('section','real-map-dock'),heading=el('h1','',t('title')),basis=el('p','real-map-basis',t('area')),details=el('div','real-atm-details'),list=el('div','real-atm-list'),retry=el('button','real-retry',t('retry'));
  const frame=el('div','real-map-frame');frame.append(canvas,status);root.append(frame,dock);dock.append(heading,basis,notice,details,list,retry,consent);
  const credit=el('a','google-places-credit','ATM locations: Google Maps');credit.href='https://maps.google.com/';credit.target='_blank';credit.rel='noopener noreferrer';dock.append(credit);
  
  function choose(item){
   selected=item;details.replaceChildren();const title=el('h2','',item.name),meta=el('p','',item.hours||t('hours')),coords=el('p','real-coordinates',item.lat.toFixed(6)+', '+item.lng.toFixed(6));
   const link=el('a','button gold',t('directions'));link.href=mapsUrl(item);link.target='_blank';link.rel='noopener noreferrer';
   details.append(title,meta,coords,link);if(item.address)meta.textContent=item.address+' · '+meta.textContent;item.attributions?.forEach(a=>{const credit=el('a','google-places-credit',a.provider||'Google Maps');if(a.providerURI&&/^https:\/\//.test(a.providerURI)){credit.href=a.providerURI;credit.target='_blank';credit.rel='noopener noreferrer';}details.append(credit);});
   list.querySelectorAll('button').forEach((b,n)=>{b.classList.toggle('active',items[n].id===item.id);b.setAttribute('aria-pressed',String(items[n].id===item.id));});
   if(map)map.panTo({lat:item.lat,lng:item.lng});
  }
  async function search(){
   const id=++queryId;controller?.abort();controller=new AbortController();status.textContent=t('loading');retry.disabled=true;details.replaceChildren();list.replaceChildren();markers.forEach(m=>m.map=null);markers=[];
   basis.textContent=live?t('nearby'):t('area');
   try{
    const {Place,SearchNearbyRankPreference}=await google.maps.importLibrary('places');
    if(disposed||id!==queryId)return;
    const {places}=await Place.searchNearby({fields:['id','displayName','location','formattedAddress','googleMapsURI'],locationRestriction:{center:centre,radius:3000},includedTypes:['atm'],maxResultCount:20,rankPreference:SearchNearbyRankPreference.DISTANCE});
    if(disposed||id!==queryId)return;
    items=(places||[]).filter(p=>p.location).map(p=>({id:p.id,name:p.displayName||'ATM',lat:p.location.lat(),lng:p.location.lng(),address:p.formattedAddress||'',hours:null,verified:false,attributions:p.attributions||[]})).map(p=>({...p,distance:distance(centre,p)})).sort((a,b)=>a.distance-b.distance);
    status.textContent=items.length?'':t('empty');
    const {AdvancedMarkerElement}=await google.maps.importLibrary('marker');if(disposed||id!==queryId)return;
    items.forEach((p,n)=>{
     const pin=el('span','real-atm-pin',String(n+1));
     const marker=new AdvancedMarkerElement({map,position:{lat:p.lat,lng:p.lng},title:p.name,content:pin});marker.addListener('click',()=>choose(p));markers.push(marker);
     const button=el('button','real-atm-option',(n+1)+'. '+p.name+' · '+(p.distance<1000?Math.round(p.distance)+' m':(p.distance/1000).toFixed(1)+' km'));button.onclick=()=>choose(p);list.append(button);
    });
    if(items[0])choose(items[0]);
   }catch(error){if(!disposed&&id===queryId&&error.name!=='AbortError')status.textContent=t('failed');}
   finally{if(!disposed&&id===queryId)retry.disabled=false;}
  }
  async function boot(){
   retry.disabled=true;status.textContent=t('loading');
   try{await loadSdk(language);if(disposed)return;const {Map}=await google.maps.importLibrary('maps');if(disposed)return;
    map=new Map(canvas,{center:centre,zoom:15,mapId:'DEMO_MAP_ID',mapTypeControl:false,streetViewControl:false,fullscreenControl:false,gestureHandling:'greedy',zoomControl:true});await search();
   }catch(error){if(!disposed){status.textContent=t(error.message==='KEY'?'key':'mapError');retry.disabled=false;}}
  }
  select.onchange=()=>{centre=areas[select.value];live=false;if(map){userMarker&&(userMarker.map=null);map.setCenter(centre);search();}};
  locate.onclick=()=>{
   if(!map||!navigator.geolocation){status.textContent=t(map?'denied':'key');return;}
   locate.disabled=true;navigator.geolocation.getCurrentPosition(async p=>{
    if(disposed)return;locate.disabled=false;live=true;centre={lat:p.coords.latitude,lng:p.coords.longitude};map.setCenter(centre);
    const {AdvancedMarkerElement}=await google.maps.importLibrary('marker');if(disposed)return;userMarker&&(userMarker.map=null);
    userMarker=new AdvancedMarkerElement({map,position:centre,content:el('span','real-user-pin'),title:t('nearby')});search();
   },()=>{if(!disposed){locate.disabled=false;status.textContent=t('denied');}},{enableHighAccuracy:true,timeout:10000,maximumAge:60000});
  };
  const authError=()=>{if(!disposed)status.textContent=t('mapError');};window.addEventListener('qr-map-auth-error',authError);
  retry.onclick=()=>map?search():boot();boot();
  return ()=>{disposed=true;clearInterval(ticketTimer);qrDialog?.close();controller?.abort();window.removeEventListener('qr-map-auth-error',authError);markers.forEach(m=>m.map=null);userMarker&&(userMarker.map=null);};
 }
 return {attach,distance,mapsUrl};
})();
