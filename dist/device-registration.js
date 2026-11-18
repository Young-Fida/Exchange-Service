(function(){
'use strict';
function stopCamera(stream){stream?.getTracks().forEach(track=>track.stop());}
async function requestCamera({signal}={}){
 if(!window.isSecureContext||!navigator.mediaDevices?.getUserMedia)throw Object.assign(new Error('Camera unavailable'),{name:'NotSupportedError'});
 signal?.throwIfAborted();
 const stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'environment'},width:{ideal:1280},height:{ideal:720}},audio:false});
 if(signal?.aborted){stopCamera(stream);throw new DOMException('Cancelled','AbortError');}
 signal?.addEventListener('abort',()=>stopCamera(stream),{once:true});return stream;
}
async function createPasskey({signal}={}){
 if(!window.isSecureContext||!window.PublicKeyCredential||!navigator.credentials?.create)throw Object.assign(new Error('Passkeys unavailable'),{name:'NotSupportedError'});
 signal?.throwIfAborted();
 const challenge=crypto.getRandomValues(new Uint8Array(32));const userId=crypto.getRandomValues(new Uint8Array(32));
 const suffix=Array.from(userId.slice(0,4),b=>b.toString(16).padStart(2,'0')).join('');
 const credential=await navigator.credentials.create({signal,publicKey:{challenge,rp:{name:'QR Exchange · Device registration'},user:{id:userId,name:'traveler-'+suffix,displayName:'QR Exchange Traveler'},pubKeyCredParams:[{type:'public-key',alg:-7},{type:'public-key',alg:-257}],authenticatorSelection:{authenticatorAttachment:'platform',residentKey:'required',requireResidentKey:true,userVerification:'required'},attestation:'none',timeout:60000}});
 signal?.throwIfAborted();
 if(!credential||credential.type!=='public-key'||!credential.rawId?.byteLength||!credential.response?.attestationObject?.byteLength)throw Object.assign(new Error('No credential returned'),{name:'OperationError'});
 // Device creation only: no claim of server-side identity verification or account enrollment.
 return {method:'biometric',deviceKeyCreated:true};
}
window.DeviceRegistration={requestCamera,stopCamera,createPasskey};
})();
