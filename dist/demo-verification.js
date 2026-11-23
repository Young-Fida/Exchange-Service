(function(){
'use strict';
const locales=['ko','en','ja','zh-CN','zh-TW'];
const messages={
 title:['인증하기','Verification','認証する','进行验证','進行驗證'],
 intro:['인증 방식을 선택해주세요','Choose a verification method','認証方法を選んでください','请选择验证方式','請選擇驗證方式'],
 subtitle:["등록을 마치면 환전 화면으로 자동 이동해요.","After registration, the exchange screen opens automatically.","登録後、自動で両替画面に進みます。","完成后自动进入换汇页面。","完成後自動進入換匯頁面。"],
 demo:["기기 등록 · 결제 연동 전","Device registration · Payments not connected","端末登録・決済未接続","设备登记 · 尚未对接支付","裝置登錄 · 尚未串接付款"],
 noticeTitle:["개인정보 처리 안내","How your information is handled","個人情報の取り扱い","个人信息处理说明","個人資料處理說明"],
 noticeContinue:["확인하고 진행","Continue","確認して進む","确认并继续","確認並繼續"],
 cameraPrivacy:["카드·여권 이미지는 기기에서만 처리하고 서버에 저장·전송하지 않아요. 촬영 직후 메모리에서 지우고 화면을 닫으면 카메라를 종료해요. 현재 은행 등록·여권 진위 확인은 연결되지 않았어요.","Card and passport images stay on this device and are never saved or uploaded to a server. Captured pixels are cleared immediately; closing this screen stops the camera. Bank registration and passport validation are not connected.","カード・旅券画像は端末内でのみ処理し、サーバーに保存・送信しません。撮影後すぐにメモリから消去し、画面を閉じるとカメラを停止します。銀行登録・旅券確認は未接続です。","卡片和护照影像仅在设备内处理，不保存或上传至服务器。拍摄后立即清除像素，关闭页面将停止相机。银行登记及护照验证尚未连接。","卡片與護照影像僅在裝置內處理，不儲存或上傳至伺服器。拍攝後立即清除像素，關閉畫面會停止相機。銀行登錄及護照驗證尚未串接。"],
 keyPrivacy:["지문·얼굴 정보는 기기 밖으로 전송되지 않고 이 웹은 생체정보·개인키를 저장하지 않아요. 생성한 패스키는 기기나 동기화 계정에 남을 수 있으며 자동 삭제되지 않아요. 기기의 패스키 설정에서 삭제할 수 있어요. 현재 서버 본인확인은 연결되지 않았어요.","Biometrics stay with your device. This site does not store biometrics or private keys. The created passkey may remain on your device or synced account and is not automatically deleted. Remove it in your device passkey settings. Server identity verification is not connected.","生体情報は端末外に送信せず、このサイトは生体情報や秘密鍵を保存しません。パスキーは端末や同期アカウントに残り、自動削除されません。端末の設定から削除できます。サーバー本人確認は未接続です。","生物信息不传出设备，网站不保存生物信息或私钥。通行密钥可能留在设备或同步账户中，不会自动删除，可在设备的通行密钥设置中删除。服务器身份验证尚未连接。","生物資訊不傳出裝置，網站不保存生物資訊或私鑰。通行密鑰可能留在裝置或同步帳戶中，不會自動刪除，可在裝置的通行密鑰設定中刪除。伺服器身分驗證尚未串接。"],
 privacy:["촬영 이미지는 이 화면에서만 사용하고 저장·전송하지 않아요. 생체정보는 기기 밖으로 전달되지 않아요.","Camera images are used only on this screen, never saved or uploaded. Biometric data stays with your device.","撮影画像はこの画面でのみ使い、保存・送信しません。生体情報は端末の外へ送りません。","拍摄图像仅在本页面使用，不保存或上传；生物识别信息留在设备端。","拍攝影像僅在本頁使用，不儲存或上傳；生物辨識資訊留在裝置端。"],
 card:['신용카드 등록','Register credit card','クレジットカード登録','登记信用卡','登錄信用卡'],
 passport:['여권 등록','Register passport','パスポート登録','登记护照','登錄護照'],
 biometric:['생체키 등록','Register biometric key','生体キー登録','登记生物识别密钥','登錄生物辨識金鑰'],
 cardHint:["카메라를 허용하고 카드를 촬영해요","Allow the camera and capture your card","カメラを許可してカードを撮影","允许相机访问并拍摄卡片","允許相機存取並拍攝卡片"],
 passportHint:["카메라를 허용하고 여권을 촬영해요","Allow the camera and capture your passport","カメラを許可して旅券を撮影","允许相机访问并拍摄护照","允許相機存取並拍攝護照"],
 biometricHint:["기기의 지문·얼굴 인식 또는 PIN으로 패스키 생성","Create a passkey with device biometrics or PIN","端末の指紋・顔認証やPINでパスキーを作成","使用设备指纹、人脸或PIN创建通行密钥","使用裝置指紋、臉部或PIN建立通行密鑰"],
 cardAction:['샘플 카드 등록하기','Register sample card','サンプルカードを登録','登记示例卡','登錄範例卡'],
 passportAction:['샘플 여권 스캔하기','Scan sample passport','サンプル旅券をスキャン','扫描示例护照','掃描範例護照'],
 biometricAction:["기기에 패스키 등록하기","Register a device passkey","端末にパスキーを登録","在设备上登记通行密钥","在裝置上登錄通行密鑰"],
 cardBusy:['샘플 카드 정보를 확인하고 있어요','Checking sample card details','サンプルカードを確認中','正在确认示例卡信息','正在確認範例卡資訊'],
 passportBusy:['샘플 여권을 읽고 있어요','Reading the sample passport','サンプル旅券を読み取り中','正在读取示例护照','正在讀取範例護照'],
 biometricBusy:['생체키 등록 과정을 시연하고 있어요','Simulating biometric key registration','生体キー登録をシミュレーション中','正在模拟生物识别密钥登记','正在模擬生物辨識金鑰登錄'],
 sample:['시연용 샘플','DEMO SAMPLE','デモ用サンプル','演示示例','展示範例'],
 biometricNote:["실제 기기 인증 창이 열려요. 지문·얼굴·PIN은 기기에서 처리하며, 현재는 서버 계정 연결 없이 기기에 키를 생성해요.","A real device prompt will open. Biometrics or PIN are handled by your device. This creates a device key without linking a server account.","実際の端末認証画面が開きます。指紋・顔・PINは端末で処理し、現在はサーバーアカウントと連携せずキーを作成します。","将打开真实设备验证窗口。指纹、人脸或PIN由设备处理，目前仅在设备创建密钥，不关联服务器账户。","將開啟真實裝置驗證視窗。指紋、臉部或PIN由裝置處理，目前僅在裝置建立金鑰，不關聯伺服器帳戶。"],
 success:['모의 인증 완료','Demo verification complete','デモ認証完了','模拟验证完成','模擬驗證完成'],
 successHint:['선택한 방식의 체험을 마쳤어요. 이제 환전 금액을 입력해주세요.','Your selected demo is complete. You can now enter your exchange amount.','選択した体験が完了しました。両替金額を入力してください。','所选体验已完成，现在可以输入换汇金额。','所選體驗已完成，現在可以輸入換匯金額。'],
 next:['환전 금액 입력하기','Enter exchange amount','両替金額を入力','输入换汇金额','輸入換匯金額'],
 change:['다른 인증 방식 선택','Choose another method','別の認証方法を選ぶ','选择其他验证方式','選擇其他驗證方式'],
 back:['이전','Back','戻る','返回','返回'],
 close:['닫기','Close','閉じる','关闭','關閉'],
 waiting:['확인 중','Checking','確認中','确认中','確認中'],
 cameraAction:["카메라 허용하고 촬영","Enable camera","カメラを起動","开启相机","開啟相機"],
 capture:["촬영 완료","Capture & continue","撮影して進む","拍摄并继续","拍攝並繼續"],
 cameraWait:["카메라 권한을 허용해주세요","Please allow camera access","カメラを許可してください","请允许相机访问","請允許相機存取"],
 cameraFrame:["테두리 안에 맞춰주세요","Align within the frame","枠の中に合わせてください","请对齐边框","請對齊邊框"],
 cameraNote:["카드사 등록·여권 진위 확인은 아직 연결되지 않았어요. 사진은 촬영 직후 폐기하고 환전 입력 화면으로 이동해요.","Card-issuer registration and passport validation are not connected. The captured image is discarded immediately, then the exchange form opens.","カード会社への登録・旅券の真偽確認は未接続です。撮影画像は直ちに破棄し、両替入力に進みます。","尚未对接发卡机构登记或护照真伪验证。拍摄后立即丢弃图像，并进入换汇输入页面。","尚未串接發卡機構登錄或護照真偽驗證。拍攝後立即丟棄影像，並進入換匯輸入頁面。"],
 keyWait:["기기의 인증 창에서 등록을 완료해주세요","Complete registration in your device prompt","端末の認証画面で登録を完了してください","请在设备验证窗口完成登记","請在裝置驗證視窗完成登錄"],
 cancelled:["등록을 취소했어요. 다시 시도하거나 다른 방식을 선택해주세요.","Registration was cancelled. Retry or choose another method.","登録がキャンセルされました。再試行するか別の方法を選んでください。","登记已取消。请重试或选择其他方式。","登錄已取消。請重試或選擇其他方式。"],
 cameraError:["카메라를 열지 못했어요. 브라우저의 카메라 권한과 다른 앱 사용 여부를 확인해주세요.","Camera could not open. Check browser permissions and whether another app is using it.","カメラを開けません。ブラウザーの許可と他アプリの使用状況を確認してください。","无法打开相机，请检查浏览器权限及其他应用是否占用相机。","無法開啟相機，請檢查瀏覽器權限及其他應用程式是否佔用相機。"],
 unsupported:["이 브라우저·기기에서는 지원되지 않아요. 휴대폰의 Safari 또는 Chrome에서 HTTPS 주소로 열어주세요.","Not supported on this browser or device. Open the HTTPS site in Safari or Chrome on your phone.","このブラウザー・端末では利用できません。スマートフォンのSafariまたはChromeでHTTPSサイトを開いてください。","此浏览器或设备不支持。请在手机Safari或Chrome中打开HTTPS网站。","此瀏覽器或裝置不支援。請在手機Safari或Chrome中開啟HTTPS網站。"],
 keyError:["패스키 등록에 실패했어요. 기기의 화면 잠금·패스키 설정을 확인한 뒤 다시 시도해주세요.","Passkey registration failed. Check device screen-lock and passkey settings, then retry.","パスキー登録に失敗しました。端末の画面ロック・パスキー設定を確認して再試行してください。","通行密钥登记失败，请检查设备锁屏和通行密钥设置后重试。","通行密鑰登錄失敗，請檢查裝置鎖定畫面與通行密鑰設定後重試。"],
 retry:["다시 시도","Try again","再試行","重试","重試"],
};
const drawings={
 card:'<rect x="3" y="6" width="26" height="20" rx="4"/><path d="M3 12h26M8 21h5m5 0h3"/>',
 passport:'<rect x="6" y="3" width="20" height="26" rx="3"/><circle cx="16" cy="14" r="6"/><path d="M10 14h12m-6-6c-4 4-4 8 0 12 4-4 4-8 0-12M12 25h8"/>',
 biometric:'<path d="M7 13a9 9 0 0 1 18 0v5m-22-1v-4a13 13 0 0 1 26 0v7M11 17v-4a5 5 0 0 1 10 0v6c0 5-2 8-5 11M7 19c0 4-1 6-3 8m11-14v6c0 4-1 7-4 10m14-7c-1 4-2 6-4 8"/>',
 check:'<path d="m7 16 6 6 13-14"/>',
 back:'<path d="m20 6-10 10 10 10"/>',
 close:'<path d="m8 8 16 16M24 8 8 24"/>'
};
const svg=(name)=>'<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+drawings[name]+'</svg>';
function open({language='en',onComplete,onCancel}){
 const idx=Math.max(0,locales.indexOf(language));const t=k=>messages[k][idx];
 const dialog=document.createElement('dialog');dialog.className='verification-sheet';dialog.setAttribute('aria-labelledby','verification-title');
 let mode=null,stage='choose',stream=null,controller=null,generation=0,disposed=false,error='';
 function cleanup(){generation++;controller?.abort();controller=null;window.DeviceRegistration.stopCamera(stream);stream=null;}
 function dispose(){if(disposed)return;disposed=true;document.removeEventListener('visibilitychange',hidden);cleanup();if(dialog.open)dialog.close();dialog.remove();}
 function cancel(){dispose();onCancel?.();}
 function complete(){const method=mode;dispose();onComplete?.(method);}
 function choose(){cleanup();mode=null;stage='choose';error='';draw();focusTitle();}
 async function start(){
  if(stage==='busy'||stage==='camera')return;cleanup();const active=generation;controller=new AbortController();const signal=controller.signal;stage='busy';error='';draw();
  try{
   if(mode==='biometric'){
    await window.DeviceRegistration.createPasskey({signal});
    if(!disposed&&active===generation)complete();
   }else{
    const camera=await window.DeviceRegistration.requestCamera({signal});
    if(disposed||active!==generation){window.DeviceRegistration.stopCamera(camera);return;}
    stream=camera;stage='camera';draw();const video=dialog.querySelector('video');video.srcObject=stream;
    await video.play();if(disposed||active!==generation)return;
    const capture=dialog.querySelector('[data-auth-capture]');if(capture)capture.disabled=video.readyState<2;
    video.addEventListener('loadeddata',()=>{if(!disposed&&active===generation){const b=dialog.querySelector('[data-auth-capture]');if(b)b.disabled=false;}},{once:true});
    stream.getVideoTracks()[0]?.addEventListener('ended',()=>{if(!disposed&&active===generation){cleanup();stage='ready';error=t('cameraError');draw();}},{once:true});
   }
  }catch(e){
   if(disposed||active!==generation)return;cleanup();stage='ready';
   error=t(e.name==='NotSupportedError'?'unsupported':mode==='biometric'?(e.name==='NotAllowedError'||e.name==='AbortError'?'cancelled':'keyError'):'cameraError');draw();focusTitle();
  }
 }
 function capture(){
  const video=dialog.querySelector('video');if(!video||video.readyState<2||!video.videoWidth)return;
  const image=document.createElement('canvas');image.width=Math.min(video.videoWidth,1280);image.height=Math.round(image.width*video.videoHeight/video.videoWidth);
  const context=image.getContext('2d');if(!context){error=t('cameraError');cleanup();stage='ready';draw();return;}
  context.drawImage(video,0,0,image.width,image.height);
  // No OCR, image storage, bank enrollment or upload. Discard the captured pixels immediately.
  context.clearRect(0,0,image.width,image.height);image.width=image.height=0;complete();
 }
 function art(){
  if(mode==='biometric')return '<div class="biometric-orbit"><div class="biometric-sensor">'+svg('biometric')+'</div><span></span><span></span></div>';
  return '<div class="capture-view '+(mode==='passport'?'passport-capture':'')+'">'+(stage==='camera'?'<video autoplay muted playsinline aria-label="'+t(mode)+'"></video><div class="capture-outline" aria-hidden="true"></div><span class="capture-guide">'+t('cameraFrame')+'</span>':'<span class="capture-placeholder">'+svg(mode)+'<small>'+t(stage==='busy'?'cameraWait':'cameraAction')+'</small></span>')+'</div>';
 }
 function draw(){
  dialog.innerHTML='<div class="verification-header"><button class="verification-icon-button" data-auth-back aria-label="'+t(mode?'back':'close')+'">'+svg(mode?'back':'close')+'</button><span>'+t('title')+'</span><span class="verification-header-dot" aria-hidden="true"></span></div><div class="verification-scroll"><span class="verification-demo">'+t('demo')+'</span><h2 id="verification-title" tabindex="-1">'+t(stage==='choose'?'intro':stage==='notice'?'noticeTitle':mode)+'</h2><p class="verification-subtitle">'+t(stage==='choose'?'subtitle':mode+'Hint')+'</p>'+(stage==='choose'?'<div class="verification-methods">'+['card','passport','biometric'].map(k=>'<button class="verification-method" data-auth-method="'+k+'"><span class="verification-method-icon">'+svg(k)+'</span><span><strong>'+t(k)+'</strong><small>'+t(k+'Hint')+'</small></span><b aria-hidden="true">›</b></button>').join('')+'</div>':stage==='notice'?'<p class="biometric-demo-note privacy-explanation">'+t(mode==='biometric'?'keyPrivacy':'cameraPrivacy')+'</p>':'<div class="verification-art '+mode+' '+(stage==='busy'?'is-scanning':'')+'">'+art()+'</div><p class="biometric-demo-note">'+t(mode==='biometric'?'biometricNote':'cameraNote')+'</p>'+(stage==='busy'?'<p class="verification-status" role="status">'+t(mode==='biometric'?'keyWait':'cameraWait')+'</p>':''))+(error?'<p class="verification-error" role="alert">'+error+'</p>':'')+'<p class="verification-privacy">'+svg('check')+'<span>'+t('privacy')+'</span></p></div><div class="verification-actions">'+(stage==='choose'?'':stage==='camera'?'<button class="button gold" data-auth-capture disabled>'+t('capture')+'</button><button class="verification-change" data-auth-change>'+t('change')+'</button>':'<button class="button gold" data-auth-start '+(stage==='busy'?'disabled aria-busy="true"':'')+'>'+t(stage==='notice'?'noticeContinue':stage==='busy'?'waiting':error?'retry':mode==='biometric'?'biometricAction':'cameraAction')+'</button><button class="verification-change" data-auth-change>'+t('change')+'</button>')+'</div>';
  dialog.querySelector('[data-auth-back]').addEventListener('click',()=>mode?choose():cancel());
  dialog.querySelectorAll('[data-auth-method]').forEach(b=>b.addEventListener('click',()=>{cleanup();mode=b.dataset.authMethod;stage='notice';error='';draw();focusTitle();}));
  dialog.querySelector('[data-auth-change]')?.addEventListener('click',choose);
  dialog.querySelector('[data-auth-start]')?.addEventListener('click',start);
  dialog.querySelector('[data-auth-capture]')?.addEventListener('click',capture);
 }
 function focusTitle(){dialog.querySelector('h2')?.focus({preventScroll:true});}
 dialog.addEventListener('cancel',e=>{e.preventDefault();cancel();});
 function hidden(){if(document.hidden&&stream){cleanup();stage='ready';error='';draw();}}
 document.addEventListener('visibilitychange',hidden);
 // Always release hardware and listeners when the surrounding route is disposed.
 document.body.appendChild(dialog);draw();dialog.showModal();focusTitle();
 return dispose;
}
window.DemoVerification={open};
})();
