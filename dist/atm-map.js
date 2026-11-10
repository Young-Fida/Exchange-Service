/* Google Maps renderer; ATM points come from Google Places; service support is unverified. */
window.AtmMap=(()=>{
 const areas={"haeundae":{"lat":35.1631,"lng":129.1635,"names":["해운대","Haeundae","海雲台","海云台","海雲臺"]},"gwangalli":{"lat":35.1532,"lng":129.1186,"names":["광안리","Gwangalli","広安里","广安里","廣安里"]},"nampo":{"lat":35.0977,"lng":129.0325,"names":["남포·중구","Nampo · Jung-gu","南浦・中区","南浦·中区","南浦·中區"]},"seomyeon":{"lat":35.1579,"lng":129.0592,"names":["서면·부산진구","Seomyeon · Busanjin-gu","西面・釜山鎮区","西面·釜山镇区","西面·釜山鎮區"]},"busanStation":{"lat":35.1151,"lng":129.0415,"names":["부산역·동구","Busan Station · Dong-gu","釜山駅・東区","釜山站·东区","釜山站·東區"]},"airport":{"lat":35.1796,"lng":128.938,"names":["김해공항","Gimhae Airport","金海空港","金海机场","金海機場"]},"gijang":{"lat":35.2448,"lng":129.2222,"names":["기장","Gijang","機張","机张","機張"]},"osiria":{"lat":35.1962,"lng":129.2083,"names":["오시리아","Osiria","オシリア","奥西利亚","奧西利亞"]},"songjeong":{"lat":35.1808,"lng":129.1994,"names":["송정","Songjeong","松亭","松亭","松亭"]},"centum":{"lat":35.1691,"lng":129.1328,"names":["센텀시티","Centum City","センタムシティ","Centum City","Centum City"]},"yeongdo":{"lat":35.0905,"lng":129.0678,"names":["영도","Yeongdo","影島","影岛","影島"]},"songdo":{"lat":35.0754,"lng":129.0166,"names":["송도·서구","Songdo · Seo-gu","松島・西区","松岛·西区","松島·西區"]},"dongnae":{"lat":35.2056,"lng":129.0785,"names":["동래","Dongnae","東萊","东莱","東萊"]},"geumjeong":{"lat":35.2431,"lng":129.0922,"names":["부산대·금정구","Pusan National University · Geumjeong-gu","釜山大学・金井区","釜山大学·金井区","釜山大學·金井區"]},"sasang":{"lat":35.1629,"lng":128.9847,"names":["사상","Sasang","沙上","沙上","沙上"]},"hadan":{"lat":35.1062,"lng":128.9668,"names":["하단·사하구","Hadan · Saha-gu","下端・沙下区","下端·沙下区","下端·沙下區"]},"dadaepo":{"lat":35.0485,"lng":128.9669,"names":["다대포","Dadaepo","多大浦","多大浦","多大浦"]},"deokcheon":{"lat":35.2101,"lng":129.0053,"names":["덕천·북구","Deokcheon · Buk-gu","徳川・北区","德川·北区","德川·北區"]},"suyeong":{"lat":35.1679,"lng":129.1145,"names":["수영","Suyeong","水営","水营","水營"]},"yeonje":{"lat":35.1861,"lng":129.0812,"names":["연산·연제구","Yeonsan · Yeonje-gu","蓮山・蓮堤区","莲山·莲堤区","蓮山·蓮堤區"]},"daeyeon":{"lat":35.1354,"lng":129.1006,"names":["대연·남구","Daeyeon · Nam-gu","大淵・南区","大渊·南区","大淵·南區"]},"myeongji":{"lat":35.0975,"lng":128.9181,"names":["명지·강서구","Myeongji · Gangseo-gu","鳴旨・江西区","鸣旨·江西区","鳴旨·江西區"]},"busanGangseo":{"lat":35.2121,"lng":128.9805,"names":["대저·강서구청","Daejeo · Gangseo District Office","大渚・江西区庁","大渚·江西区厅","大渚·江西區廳"]}};
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
  area:['선택 지역 중심','Selected area centre','選択地域の中心','所选地区中心','所選地區中心'],
  nearby:['내 위치 기준','Your current location','現在地から','我的位置','我的位置'],
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
  demo:['시연','Demo','デモ','演示','展示'],
  walking:['도보 경로 확인 중…','Checking walking routes…','徒歩ルートを確認中…','正在查询步行路线…','正在查詢步行路線…'],
  walkSort:['도보 거리순','Walking distance','徒歩距離順','按步行距离','按步行距離'],
  walkUnavailable:['도보 경로를 확인할 수 없어 순위를 표시하지 않아요. 구글지도에서 경로를 확인해주세요.','Walking routes are unavailable; no walking rank is shown. Check directions in Google Maps.','徒歩ルートを確認できないため順位は表示しません。Google Mapsでご確認ください。','无法确认步行路线，暂不显示排名。请在Google地图中查看路线。','無法確認步行路線，暫不顯示排名。請在Google地圖中查看路線。'],
  walkUnknown:['도보 경로 미확인','Walking route unverified','徒歩ルート未確認','步行路线未确认','步行路線未確認'],
  partial:['도보 경로가 확인된 ATM부터 표시해요.','ATMs with verified walking routes appear first.','徒歩ルートを確認できたATMから表示します。','优先显示已查到步行路线的ATM。','優先顯示已查到步行路線的ATM。'],
  walkWarning:['도보 경로에는 보도·횡단보도 정보가 누락될 수 있어요. 현장 표지와 통행 가능 여부를 확인하세요.','Walking routes may omit sidewalks or crossings. Check signs and access on site.','徒歩ルートには歩道や横断歩道の情報が欠ける場合があります。現地の標識と通行可否を確認してください。','步行路线可能缺少人行道或过街信息，请留意现场标志及通行条件。','步行路線可能缺少人行道或過街資訊，請留意現場標誌及通行條件。'],
  minute:['분','min','分','分钟','分鐘'],
  source:['ATM 위치: Google Maps','ATM locations: Google Maps','ATM情報: Google Maps','ATM位置：Google Maps','ATM位置：Google Maps'],
  zoomIn:['지도 확대','Zoom in','地図を拡大','放大地图','放大地圖'],
  zoomOut:['지도 축소','Zoom out','地図を縮小','缩小地图','縮小地圖'],
  info:['ATM 정보','ATM details','ATM情報','ATM信息','ATM資訊']
 };
 function withDeadline(promise,ms){let timer;return Promise.race([promise,new Promise((_,reject)=>timer=setTimeout(()=>reject(Error('TIMEOUT')),ms))]).finally(()=>clearTimeout(timer));}
 function rankWalking(items,rows){
  const ranked=items.map((p,i)=>{const r=rows[i];const ok=r?.condition==='ROUTE_EXISTS'&&Number.isFinite(r.distanceMeters)&&r.distanceMeters>=0&&Number.isFinite(r.durationMillis)&&r.durationMillis>=0;return {...p,walk:ok?{distanceMeters:r.distanceMeters,durationMillis:r.durationMillis}:null};});
  ranked.sort((a,b)=>a.walk&&b.walk?a.walk.distanceMeters-b.walk.distanceMeters||a.walk.durationMillis-b.walk.durationMillis:a.walk?-1:b.walk?1:0);
  let rank=0;return ranked.map(p=>({...p,walkRank:p.walk?++rank:null}));
 }
 let sdkPromise;
 function distance(a,b){const r=Math.PI/180;const p=(b.lat-a.lat)*r,q=(b.lng-a.lng)*r;return 6371000*2*Math.atan2(Math.sqrt(Math.sin(p/2)**2+Math.cos(a.lat*r)*Math.cos(b.lat*r)*Math.sin(q/2)**2),Math.sqrt(1-(Math.sin(p/2)**2+Math.cos(a.lat*r)*Math.cos(b.lat*r)*Math.sin(q/2)**2)));}
 function mapsUrl(p,origin,language){const u=new URL('https://www.google.com/maps/dir/');u.search=new URLSearchParams({api:'1',travelmode:'walking',...(origin?{origin:origin.lat+','+origin.lng}:{}),...(language?{hl:language}:{}),destination:p.lat+','+p.lng,...(p.id?{destination_place_id:p.id}:{})});return u.href;}
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
 function attach({root,language,area,labels,request,onCopy,context,onContextChange}){
  let disposed=false,map,markers=[],userMarker,items=[],selected,queryId=0,controller,live=false,walkState='pending';
  area=context?.area||area;let centre=context?.centre||areas[area]||areas.haeundae;live=Boolean(context?.live);
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
   const body=el('div','ticket-body'),top=el('div','ticket-label'),tag=el('span','ticket-demo',t('demo'));top.append(el('span','',t('withdrawal')),tag);
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
  select.setAttribute('aria-label',t('title'));Object.keys(areas).forEach(key=>{const o=el('option','',areas[key].names[i<0?1:i]);o.value=key;select.append(o);});select.value=area||'haeundae';
  toolbar.append(select,locate);root.append(toolbar);
  const canvas=el('div','google-atm-canvas'),status=el('p','real-map-status',t('loading')),notice=el('p','real-map-notice',t('notice')),consent=el('p','real-map-consent',t('consent'));
  canvas.setAttribute('aria-label','Google Maps');
  const zoom=el('div','real-map-zoom');for(const [symbol,delta,key] of [['+',1,'zoomIn'],['−',-1,'zoomOut']]){const b=el('button','',symbol);b.setAttribute('aria-label',t(key));b.onclick=()=>map&&map.setZoom(map.getZoom()+delta);zoom.append(b);}status.setAttribute('role','status');
  const routingNote=el('p','real-routing-note');routingNote.setAttribute('role','status');
  const dock=el('section','real-map-dock'),heading=el('h1','',t('title')),basis=el('p','real-map-basis',t('area')),details=el('div','real-atm-details'),list=el('div','real-atm-list'),retry=el('button','real-retry',t('retry'));
  const frame=el('div','real-map-frame');frame.append(canvas,status,zoom);root.append(frame,dock);dock.append(heading,basis,routingNote,notice,details,list,retry,consent);
  const credit=el('a','google-places-credit',t('source'));credit.href='https://maps.google.com/';credit.target='_blank';credit.rel='noopener noreferrer';dock.append(credit);
  
  function choose(item){
   selected=item;details.replaceChildren();const title=el('h2','',item.name),meta=el('p','',item.hours||t('hours')),coords=el('p','real-coordinates',item.lat.toFixed(6)+', '+item.lng.toFixed(6));
   const link=el('a','button gold',t('directions'));link.href=mapsUrl(item,centre,language);link.target='_blank';link.rel='noopener noreferrer';
   details.append(title,meta,el('p','real-walk-summary',walkLabel(item)),coords,link);const warning=el('p','real-walk-warning',t('walkWarning'));if(item.walk)details.append(warning);if(item.address)meta.textContent=item.address+' · '+meta.textContent;item.attributions?.forEach(a=>{const credit=el('a','google-places-credit',a.provider||'Google Maps');if(a.providerURI&&/^https:\/\//.test(a.providerURI)){credit.href=a.providerURI;credit.target='_blank';credit.rel='noopener noreferrer';}details.append(credit);});
   list.querySelectorAll('button').forEach((b,n)=>{b.classList.toggle('active',items[n].id===item.id);b.setAttribute('aria-pressed',String(items[n].id===item.id));});
   if(map)map.panTo({lat:item.lat,lng:item.lng});
  }
  function walkLabel(item){return item.walk?new Intl.NumberFormat(language,{maximumFractionDigits:1}).format(item.walk.distanceMeters<1000?item.walk.distanceMeters:item.walk.distanceMeters/1000)+(item.walk.distanceMeters<1000?' m':' km')+' · '+Math.max(1,Math.ceil(item.walk.durationMillis/60000))+' '+t('minute'):t('walkUnknown');}
  async function search(){
   onContextChange?.({area:select.value,centre:{lat:centre.lat,lng:centre.lng},live});const id=++queryId;controller?.abort();controller=new AbortController();status.textContent=t('loading');routingNote.textContent='';retry.disabled=true;details.replaceChildren();list.replaceChildren();markers.forEach(m=>m.map=null);markers=[];
   basis.textContent=live?t('nearby'):t('area');
   try{
    const {Place,SearchNearbyRankPreference}=await google.maps.importLibrary('places');
    if(disposed||id!==queryId)return;
    const {places}=await Place.searchNearby({fields:['id','displayName','location','formattedAddress','googleMapsURI'],locationRestriction:{center:centre,radius:3000},includedTypes:['atm'],maxResultCount:20,rankPreference:SearchNearbyRankPreference.DISTANCE,language,region:'KR'});
    if(disposed||id!==queryId)return;
    items=(places||[]).filter(p=>p.location).map(p=>({id:p.id,name:p.displayName||'ATM',lat:p.location.lat(),lng:p.location.lng(),address:p.formattedAddress||'',hours:null,verified:false,attributions:p.attributions||[]})).map(p=>({...p,distance:distance(centre,p)})).sort((a,b)=>a.distance-b.distance);
    if(items.length){
     status.textContent=t('walking');
     try{
      const {RouteMatrix}=await google.maps.importLibrary('routes');if(disposed||id!==queryId)return;
      const result=await withDeadline(RouteMatrix.computeRouteMatrix({origins:[{lat:centre.lat,lng:centre.lng}],destinations:items.map(p=>({lat:p.lat,lng:p.lng})),travelMode:'WALKING',language,region:'kr',fields:['condition','distanceMeters','durationMillis']}),14000);
      if(disposed||id!==queryId)return;
      items=rankWalking(items,result.matrix?.rows?.[0]?.items||[]);
      }catch(error){console.warn('Walking route lookup:',String(error?.message||error?.name||'unavailable').replace(/AIza[A-Za-z0-9_-]+/g,'[hidden]').slice(0,350));if(disposed||id!==queryId)return;items=rankWalking(items,[]);}
     const count=items.filter(p=>p.walk).length;walkState=count===items.length?'walking':count?'partial':'unavailable';
     basis.textContent=(live?t('nearby'):t('area'))+(count?' · '+t('walkSort'):'');
     status.textContent='';routingNote.textContent=walkState==='walking'?'':t(walkState==='partial'?'partial':'walkUnavailable');
    }else{walkState='empty';status.textContent=t('empty');}
    const {AdvancedMarkerElement}=await google.maps.importLibrary('marker');if(disposed||id!==queryId)return;
    items.forEach((p,n)=>{
     const pin=el('span','real-atm-pin',p.walk?String(p.walkRank):'ATM');
     const marker=new AdvancedMarkerElement({map,position:{lat:p.lat,lng:p.lng},title:p.name,content:pin});marker.addListener('click',()=>choose(p));markers.push(marker);
     const button=el('button','real-atm-option',(p.walk?p.walkRank+'. ':'')+p.name+' · '+walkLabel(p));button.onclick=()=>choose(p);list.append(button);
    });
    if(items[0])choose(items[0]);
   }catch(error){if(!disposed&&id===queryId&&error.name!=='AbortError')status.textContent=t('failed');}
   finally{if(!disposed&&id===queryId)retry.disabled=false;}
  }
  async function boot(){
   retry.disabled=true;status.textContent=t('loading');
   try{await loadSdk(language);if(disposed)return;const {Map}=await google.maps.importLibrary('maps');if(disposed)return;
    map=new Map(canvas,{center:centre,zoom:15,mapId:'DEMO_MAP_ID',mapTypeControl:false,streetViewControl:false,fullscreenControl:false,gestureHandling:'greedy',zoomControl:false,cameraControl:false,keyboardShortcuts:false});await search();
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
 return {attach,distance,mapsUrl,rankWalking,areas,text};
})();
