(function(){
'use strict';
const locales=['ko','en','ja','zh-CN','zh-TW'];
const messages={
 title:['인증하기','Verification','認証する','进行验证','進行驗證'],
 intro:['인증 방식을 선택해주세요','Choose a verification method','認証方法を選んでください','请选择验证方式','請選擇驗證方式'],
 subtitle:['한 가지 방식을 체험하면 금액 입력으로 이동해요.','Try one method, then enter your exchange amount.','いずれか一つを体験すると金額入力へ進みます。','体验一种方式后，即可输入换汇金额。','體驗一種方式後，即可輸入換匯金額。'],
 demo:['모의 인증 · 실제 등록 아님','Demo verification · No real registration','デモ認証・実際の登録ではありません','模拟验证 · 非真实注册','模擬驗證 · 非真實註冊'],
 privacy:['실제 카드·여권·생체정보를 수집하거나 전송하지 않아요.','No real card, passport or biometric data is collected or sent.','実際のカード・旅券・生体情報は収集・送信しません。','不收集或传输真实卡片、护照或生物识别信息。','不蒐集或傳輸真實卡片、護照或生物辨識資訊。'],
 card:['신용카드 등록','Register credit card','クレジットカード登録','登记信用卡','登錄信用卡'],
 passport:['여권 등록','Register passport','パスポート登録','登记护照','登錄護照'],
 biometric:['생체키 등록','Register biometric key','生体キー登録','登记生物识别密钥','登錄生物辨識金鑰'],
 cardHint:['샘플 카드로 등록 과정을 체험해요','Try registration with a sample card','サンプルカードで登録を体験','使用示例卡体验登记流程','使用範例卡體驗登錄流程'],
 passportHint:['샘플 여권을 스캔하고 확인해요','Scan and review a sample passport','サンプル旅券をスキャンして確認','扫描并确认示例护照','掃描並確認範例護照'],
 biometricHint:['터치로 생체키 등록을 체험해요','Try a touch-based registration demo','タッチで生体キー登録を体験','触控体验生物识别密钥登记','觸控體驗生物辨識金鑰登錄'],
 cardAction:['샘플 카드 등록하기','Register sample card','サンプルカードを登録','登记示例卡','登錄範例卡'],
 passportAction:['샘플 여권 스캔하기','Scan sample passport','サンプル旅券をスキャン','扫描示例护照','掃描範例護照'],
 biometricAction:['터치하여 모의 인증','Touch to try verification','タッチしてデモ認証','点击进行模拟验证','點擊進行模擬驗證'],
 cardBusy:['샘플 카드 정보를 확인하고 있어요','Checking sample card details','サンプルカードを確認中','正在确认示例卡信息','正在確認範例卡資訊'],
 passportBusy:['샘플 여권을 읽고 있어요','Reading the sample passport','サンプル旅券を読み取り中','正在读取示例护照','正在讀取範例護照'],
 biometricBusy:['생체키 등록 과정을 시연하고 있어요','Simulating biometric key registration','生体キー登録をシミュレーション中','正在模拟生物识别密钥登记','正在模擬生物辨識金鑰登錄'],
 sample:['시연용 샘플','DEMO SAMPLE','デモ用サンプル','演示示例','展示範例'],
 biometricNote:['기기의 지문·얼굴 인식이나 실제 패스키를 사용하지 않아요.','This does not use device fingerprints, face recognition or a real passkey.','端末の指紋・顔認証や実際のパスキーは使いません。','不使用设备指纹、人脸识别或真实通行密钥。','不使用裝置指紋、臉部辨識或真實通行密鑰。'],
 success:['모의 인증 완료','Demo verification complete','デモ認証完了','模拟验证完成','模擬驗證完成'],
 successHint:['선택한 방식의 체험을 마쳤어요. 이제 환전 금액을 입력해주세요.','Your selected demo is complete. You can now enter your exchange amount.','選択した体験が完了しました。両替金額を入力してください。','所选体验已完成，现在可以输入换汇金额。','所選體驗已完成，現在可以輸入換匯金額。'],
 next:['환전 금액 입력하기','Enter exchange amount','両替金額を入力','输入换汇金额','輸入換匯金額'],
 change:['다른 인증 방식 선택','Choose another method','別の認証方法を選ぶ','选择其他验证方式','選擇其他驗證方式'],
 back:['이전','Back','戻る','返回','返回'],
 close:['닫기','Close','閉じる','关闭','關閉'],
 waiting:['확인 중','Checking','確認中','确认中','確認中']
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
 let mode=null,stage='choose',timer=null,disposed=false;
 function dispose(){if(disposed)return;disposed=true;clearTimeout(timer);if(dialog.open)dialog.close();dialog.remove();}
 function cancel(){dispose();onCancel?.();}
 function art(){
 if(mode==='card')return '<div class="sample-card"><span class="sample-card-brand">QR EXCHANGE</span><span class="sample-card-chip"></span><strong>•••• &nbsp; •••• &nbsp; •••• &nbsp; 4242</strong><span class="sample-card-bottom"><span>DEMO TRAVELER</span><b>'+t('sample')+'</b></span></div>';
 if(mode==='passport')return '<div class="sample-passport"><div class="passport-book-title">PASSPORT <small>'+t('sample')+'</small></div><div class="passport-body"><div class="passport-portrait"><svg viewBox="0 0 60 72" fill="currentColor" aria-hidden="true"><circle cx="30" cy="24" r="13"/><path d="M7 70v-8a23 23 0 0 1 46 0v8Z"/></svg></div><div class="passport-lines"><strong>DEMO TRAVELER</strong><span></span><span></span><span></span><b>••••••••</b></div></div><div class="passport-mrz" aria-hidden="true">DEMO&lt;&lt;TRAVELER&lt;&lt;&lt;&lt;&lt;<br>SAMPLE&lt;&lt;NOT&lt;VALID&lt;&lt;&lt;</div><span class="passport-scan"></span></div>';
 return '<div class="biometric-orbit"><div class="biometric-sensor">'+svg('biometric')+'</div><span></span><span></span></div>';
 }
 function draw(){
 const title=stage==='choose'?t('intro'):stage==='done'?t('success'):t(mode);
 dialog.innerHTML='<div class="verification-header"><button class="verification-icon-button" data-auth-back aria-label="'+t(mode&&stage!=='done'?'back':'close')+'">'+svg(mode&&stage!=='done'?'back':'close')+'</button><span>'+t('title')+'</span><span class="verification-header-dot" aria-hidden="true"></span></div><div class="verification-scroll"><span class="verification-demo">'+t('demo')+'</span><h2 id="verification-title" tabindex="-1">'+title+'</h2><p class="verification-subtitle">'+(stage==='choose'?t('subtitle'):stage==='done'?t('successHint'):t(mode+'Hint'))+'</p>'+(stage==='choose'?'<div class="verification-methods">'+['card','passport','biometric'].map(k=>'<button class="verification-method" data-auth-method="'+k+'"><span class="verification-method-icon">'+svg(k)+'</span><span><strong>'+t(k)+'</strong><small>'+t(k+'Hint')+'</small></span><b aria-hidden="true">›</b></button>').join('')+'</div>':stage==='done'?'<div class="verification-success">'+svg('check')+'</div><div class="verification-result">'+svg(mode)+'<strong>'+t(mode)+'</strong><span>'+t('success')+'</span></div>':'<div class="verification-art '+mode+' '+(stage==='busy'?'is-scanning':'')+'">'+art()+'</div>'+(mode==='biometric'?'<p class="biometric-demo-note">'+t('biometricNote')+'</p>':'')+(stage==='busy'?'<div class="verification-progress" role="progressbar" aria-label="'+t('waiting')+'"><span></span></div><p class="verification-status" role="status">'+t(mode+'Busy')+'</p>':''))+'<p class="verification-privacy">'+svg('check')+'<span>'+t('privacy')+'</span></p></div><div class="verification-actions">'+(stage==='choose'?'':stage==='done'?'<button class="button gold" data-auth-continue>'+t('next')+'<span aria-hidden="true">→</span></button>':'<button class="button gold" data-auth-start '+(stage==='busy'?'disabled aria-busy="true"':'')+'>'+t(stage==='busy'?'waiting':mode+'Action')+'</button><button class="verification-change" data-auth-change>'+t('change')+'</button>')+'</div>';
 dialog.querySelector('[data-auth-back]').addEventListener('click',()=>{if(mode&&stage!=='done'){clearTimeout(timer);mode=null;stage='choose';draw();focusTitle();}else cancel();});
 dialog.querySelectorAll('[data-auth-method]').forEach(b=>b.addEventListener('click',()=>{mode=b.dataset.authMethod;stage='ready';draw();focusTitle();}));
 dialog.querySelector('[data-auth-change]')?.addEventListener('click',()=>{clearTimeout(timer);mode=null;stage='choose';draw();focusTitle();});
 dialog.querySelector('[data-auth-start]')?.addEventListener('click',()=>{if(stage!=='ready')return;stage='busy';draw();dialog.querySelector('[role="status"]')?.setAttribute('aria-live','polite');timer=setTimeout(()=>{if(disposed)return;stage='done';draw();focusTitle();},1800);});
 dialog.querySelector('[data-auth-continue]')?.addEventListener('click',()=>{const method=mode;dispose();onComplete?.(method);});
 }
 function focusTitle(){dialog.querySelector('h2')?.focus({preventScroll:true});}
 dialog.addEventListener('cancel',e=>{e.preventDefault();cancel();});document.body.appendChild(dialog);draw();dialog.showModal();focusTitle();return dispose;
}
window.DemoVerification={open};
})();
