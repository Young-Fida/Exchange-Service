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
 cameraPrivacy:["이용 목적\n여권은 본인확인, 카드는 결제수단 확인과 환전 대금 결제에 이용하는 구조로 설계하고 있어요.\n\n누가 정보를 처리하나요?\n제휴 은행이 고객확인·환전을, 적격 결제사가 카드 결제를 담당하는 방식이에요. 영 파이다는 인증 결과 참조값, 신청번호, 견적, 거래 상태 등 연결에 필요한 최소 정보만 처리하고, 여권 원본·카드번호·CVC는 직접 보관하지 않는 것을 목표로 해요.\n\n언제 삭제하나요?\n확인에만 필요한 임시 자료는 목적이 끝나면 삭제하고, 수령용 QR·코드는 사용 후 무효화하는 방식이에요. 거래 증빙·환불·분쟁 대응에 필요한 기록은 별도 보관 대상이며, 실제 연동 전 항목별 보관 기간과 전달 기관을 안내할 예정이에요.","Purpose\nPassports support identity checks; cards support payment-method verification and exchange payment in the planned service.\n\nWho handles the information?\nPartner banks would handle identity checks and exchange; qualified payment providers would process cards. Young Fida would handle only references to verification results, request IDs, quotes and transaction status. We aim not to retain passport originals, card numbers or CVC.\n\nDeletion and retention\nTemporary verification materials would be deleted when no longer needed, and pickup QR codes invalidated after use. Transaction evidence and refund or dispute records may require separate retention. Recipients and retention periods will be disclosed before integration.","利用目的\n旅券は本人確認、カードは支払手段の確認と両替代金の決済に使う設計です。\n\n処理する機関\n提携銀行が本人確認・両替を、適格な決済会社がカード決済を担当する想定です。当サービスは認証結果の参照値、申込番号、見積り、取引状態など必要最小限を扱い、旅券原本・カード番号・CVCを直接保管しない構造を目指します。\n\n削除と保管\n一時資料は目的達成後に削除し、受取QR・コードは使用後に無効化する想定です。取引証拠・返金・紛争対応記録は別途保管対象となり得ます。連携前に提供先と項目別の保管期間を案内します。","使用目的\n规划中，护照用于身份核验，卡片用于支付方式核验及换汇付款。\n\n处理机构\n拟由合作银行负责身份核验与换汇，合格支付机构负责卡片付款。服务仅处理核验结果引用值、申请编号、报价及交易状态等最少信息，目标是不直接保管护照原件、卡号或CVC。\n\n删除与保留\n临时核验资料拟在目的完成后删除，提款二维码和代码使用后失效。交易凭证、退款及争议记录可能需单独保留。正式对接前将说明接收机构及各项保留期限。","使用目的\n規劃中，護照用於身分核驗，卡片用於付款方式核驗及換匯付款。\n\n處理機構\n擬由合作銀行負責身分核驗與換匯，合格支付機構負責卡片付款。服務僅處理核驗結果參照值、申請編號、報價及交易狀態等最少資訊，目標是不直接保管護照正本、卡號或CVC。\n\n刪除與保留\n暫時核驗資料擬在目的完成後刪除，提款QR碼和代碼使用後失效。交易憑證、退款及爭議紀錄可能需另行保留。正式串接前將說明接收機構及各項保留期限。"],
 keyPrivacy:["이용 목적\n생체키는 기기의 지문·얼굴 인식 또는 PIN으로 환전 신청자를 인증하는 데 활용할 계획이에요. 은행의 본인확인이 추가로 필요할 수 있어요.\n\n어떤 정보를 확인하나요?\n생체정보와 개인키는 영 파이다에 전달하지 않고, 인증 결과와 거래 연결에 필요한 참조값만 확인하는 구조를 지향해요.\n\n삭제와 보관\n불필요한 임시 인증 자료는 목적 달성 후 삭제하고, 거래·동의 기록은 별도 보관 기준을 정해 안내할 예정이에요. 기기나 동기화 계정의 패스키는 자동 삭제되지 않으며 기기 설정에서 직접 삭제할 수 있어요.","Purpose\nWe plan to use device biometrics or PIN to authenticate exchange requests. A bank may require additional identity checks.\n\nInformation handled\nThe service is designed to receive authentication results and transaction references, rather than biometrics or private keys.\n\nDeletion and retention\nUnneeded temporary authentication data would be deleted after its purpose is fulfilled. Transaction and consent records would have separately disclosed retention rules. Device or synced passkeys are not automatically deleted; remove them in device settings.","利用目的\n端末の指紋・顔認証やPINで申込者を認証する計画です。銀行の追加本人確認が必要な場合があります。\n\n取り扱う情報\n生体情報・秘密鍵を受け取らず、認証結果と取引参照値のみを確認する設計を目指します。\n\n削除と保管\n不要な一時認証資料は目的達成後に削除し、取引・同意記録には別途保管基準を設けて案内する予定です。端末や同期アカウントのパスキーは自動削除されず、端末設定から削除できます。","使用目的\n计划用设备指纹、人脸或PIN验证换汇申请人。银行可能要求额外身份核验。\n\n处理信息\n目标是不接收生物信息或私钥，仅核验认证结果及交易引用值。\n\n删除与保留\n不再需要的临时认证资料拟在目的完成后删除，交易和同意记录另行制定并说明保留规则。设备或同步账户的通行密钥不会自动删除，可在设备设置中删除。","使用目的\n計畫用裝置指紋、臉部或PIN驗證換匯申請人。銀行可能要求額外身分核驗。\n\n處理資訊\n目標是不接收生物資訊或私鑰，僅核驗認證結果及交易參照值。\n\n刪除與保留\n不再需要的暫時認證資料擬在目的完成後刪除，交易和同意紀錄另行制定並說明保留規則。裝置或同步帳戶的通行密鑰不會自動刪除，可在裝置設定中刪除。"],
 privacyPlan:["서비스 설계 기준 · 은행 연동 예정","Service design · Bank integration planned","サービス設計・銀行連携予定","服务设计 · 计划对接银行","服務設計 · 規劃串接銀行"],
 privacySubtitle:["환전에 필요한 정보만 확인하고, 불필요한 원본 보관을 줄이는 구조를 지향해요.","Our service is designed to verify only what an exchange needs and minimize retention of original documents.","両替に必要な情報を確認し、原本の保管を最小限にする設計です。","服务旨在仅核验换汇所需信息，尽量减少原始资料的保留。","服務旨在僅核驗換匯所需資訊，盡量減少原始資料的保留。"],
 privacyCurrent:["현재 구현: 은행·결제사 연동 전이에요. 촬영 이미지는 서버에 보내지 않고 촬영 직후 지우며, 패스키는 기기에 생성해요. 위 내용은 실제 연동 시 적용할 서비스 설계 방향이에요.","Current implementation: banks and payment providers are not connected. Captured images are cleared without upload; passkeys are created on the device. The service handling described above is planned for integration.","現在は銀行・決済会社と未連携です。撮影画像は送信せず直ちに消去し、パスキーは端末で生成します。上記は連携時の設計方針です。","当前尚未对接银行及支付机构。拍摄图像不上传并立即清除，通行密钥在设备生成。以上为未来对接的服务设计方向。","目前尚未串接銀行及支付機構。拍攝影像不上傳並立即清除，通行密鑰在裝置產生。以上為未來串接的服務設計方向。"],
 privacyShort:["입력한 정보는 본인확인, 여권·카드 확인 및 환전 대금 결제에 사용하며, 안내된 목적 외에는 이용하지 않아요.","Your information is used for identity and passport or card checks and exchange payments, and not for other purposes.","入力情報は本人・旅券・カードの確認と両替代金の決済に利用し、案内した目的以外には使用しません。","输入的信息用于身份、护照及卡片核验和换汇付款，不用于所告知目的以外的用途。","輸入的資訊用於身分、護照及卡片核驗和換匯付款，不用於所告知目的以外的用途。"],
 keyShort:["생체키는 본인확인에 사용하며, 생체정보는 기기 밖으로 전달되지 않아요.","Your passkey is used for identity verification; biometric data stays on your device.","パスキーは本人確認に使い、生体情報は端末の外へ送信されません。","通行密钥用于身份验证，生物信息不会传出设备。","通行密鑰用於身分驗證，生物資訊不會傳出裝置。"],
 detailsLabel:["자세히 보기","View details","詳しく見る","查看详情","查看詳情"],
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
  dialog.innerHTML='<div class="verification-header"><button class="verification-icon-button" data-auth-back aria-label="'+t(mode?'back':'close')+'">'+svg(mode?'back':'close')+'</button><span>'+t('title')+'</span><span class="verification-header-dot" aria-hidden="true"></span></div><div class="verification-scroll"><span class="verification-demo">'+t(stage==='notice'?'privacyPlan':'demo')+'</span><h2 id="verification-title" tabindex="-1">'+t(stage==='choose'?'intro':stage==='notice'?'noticeTitle':mode)+'</h2><p class="verification-subtitle">'+t(stage==='choose'?'subtitle':stage==='notice'?'privacySubtitle':mode+'Hint')+'</p>'+(stage==='choose'?'<div class="verification-methods">'+['card','passport','biometric'].map(k=>'<button class="verification-method" data-auth-method="'+k+'"><span class="verification-method-icon">'+svg(k)+'</span><span><strong>'+t(k)+'</strong><small>'+t(k+'Hint')+'</small></span><b aria-hidden="true">›</b></button>').join('')+'</div>':stage==='notice'?'<p class="biometric-demo-note">'+t(mode==='biometric'?'keyShort':'privacyShort')+'</p><details><summary>'+t('detailsLabel')+'</summary><p class="biometric-demo-note privacy-explanation">'+t(mode==='biometric'?'keyPrivacy':'cameraPrivacy')+'</p></details><p class="verification-current-note">'+t('privacyCurrent')+'</p>':'<div class="verification-art '+mode+' '+(stage==='busy'?'is-scanning':'')+'">'+art()+'</div><p class="biometric-demo-note">'+t(mode==='biometric'?'biometricNote':'cameraNote')+'</p>'+(stage==='busy'?'<p class="verification-status" role="status">'+t(mode==='biometric'?'keyWait':'cameraWait')+'</p>':''))+(error?'<p class="verification-error" role="alert">'+error+'</p>':'')+'<p class="verification-privacy">'+svg('check')+'<span>'+t('privacy')+'</span></p></div><div class="verification-actions">'+(stage==='choose'?'':stage==='camera'?'<button class="button gold" data-auth-capture disabled>'+t('capture')+'</button><button class="verification-change" data-auth-change>'+t('change')+'</button>':'<button class="button gold" data-auth-start '+(stage==='busy'?'disabled aria-busy="true"':'')+'>'+t(stage==='notice'?'noticeContinue':stage==='busy'?'waiting':error?'retry':mode==='biometric'?'biometricAction':'cameraAction')+'</button><button class="verification-change" data-auth-change>'+t('change')+'</button>')+'</div>';
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
