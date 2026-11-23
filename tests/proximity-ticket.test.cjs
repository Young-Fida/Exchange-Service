const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
function setup(){
 class Element{
  constructor(tag){this.tag=tag;this.children=[];this.classList={add(){},toggle(){}};this.textContent='';}
  append(...nodes){this.children.push(...nodes);}
  replaceChildren(){this.children=[];}
  setAttribute(){}
  close(){this.open=false;}
  remove(){}
  showModal(){this.open=true;}
 }
 let callback,freshCallback,watchError,freshError,tick,visibility,encoded=0;
 const scope={window:{qrcode:()=>({addData(){encoded++;},make(){},createSvgTag(){return '<svg/>';}})},document:{hidden:false,createElement:tag=>new Element(tag),addEventListener(name,fn){if(name==='visibilitychange')visibility=fn;},removeEventListener(){}},navigator:{geolocation:{getCurrentPosition(fn,fail){freshCallback=fn;freshError=fail;},watchPosition(fn,fail){callback=fn;watchError=fail;return 1;},clearWatch(){}}},Date,setInterval:fn=>{tick=fn;return 1;},clearInterval(){}};
 vm.createContext(scope);vm.runInContext(fs.readFileSync(require.resolve('../dist/proximity-ticket.js'),'utf8'),scope);
 return {api:scope.window.PickupTicket,scope,Element,fix:p=>callback(p),fresh:p=>freshCallback(p),error:e=>watchError(e),freshError:e=>freshError(e),tick:()=>tick(),visibility:()=>visibility(),encoded:()=>encoded};
}
test('50 m gate requires an explicit target and recent valid coordinates; accuracy is advisory',()=>{
 const {api}=setup();const target={lat:35,lng:129};const fix={lat:35,lng:129,accuracy:5,timestamp:100000};
 assert.equal(api.gate(null,fix,100000,()=>0).unlocked,false);
 assert.equal(api.gate(target,fix,100000,()=>50).unlocked,true);
 assert.equal(api.gate(target,fix,100000,()=>50.01).unlocked,false);
 assert.equal(api.gate(target,{...fix,accuracy:35},100000,()=>20).unlocked,true);
 assert.equal(api.gate(target,fix,160001,()=>0).unlocked,false);
 assert.equal(api.gate(target,fix,100000,()=>0,false).unlocked,false);
});

test('QR unlocks on the first fix within 50m and stays visible after leaving',()=>{
 const env=setup(),root=new env.Element('main');let metres=20;const states=[];const ticket=env.api.attach({root,request:{code:'482917',expires:Date.now()+600000},language:'ko',t:k=>k,distance:()=>metres,onCopy(){},onState:s=>states.push(s.unlocked)});ticket.select({id:'a',name:'ATM',lat:35,lng:129});const now=Date.now();const pos=timestamp=>({coords:{latitude:35,longitude:129,accuracy:99},timestamp});env.fix(pos(now));assert.equal(env.encoded(),1);assert.equal(states.at(-1),true);metres=51;env.fix(pos(Date.now()));assert.equal(states.at(-1),true);ticket.dispose();
});
test('location jitter after arrival does not hide an issued code',()=>{
 const env=setup(),root=new env.Element('main'),ticket=env.api.attach({root,request:{code:'482917',expires:Date.now()+600000},language:'ko',t:k=>k,distance:()=>20,onCopy(){}});ticket.select({id:'a',name:'ATM',lat:35,lng:129});const now=Date.now();env.fix({coords:{latitude:35,longitude:129,accuracy:5},timestamp:now-5000});env.fix({coords:{latitude:35.0003,longitude:129,accuracy:5},timestamp:now});assert.equal(env.encoded(),1);ticket.dispose();
});
test('an already revealed code remains visible after GPS permission loss',()=>{const env=setup(),root=new env.Element('main'),states=[],ticket=env.api.attach({root,request:{code:'482917',expires:Date.now()+600000},language:'ko',t:k=>k,distance:()=>20,onCopy(){},onState:s=>states.push(s.unlocked)});ticket.select({id:'a',name:'ATM',lat:35,lng:129});const now=Date.now();for(const timestamp of [now-5000,now])env.fix({coords:{latitude:35,longitude:129,accuracy:5},timestamp});assert.equal(states.at(-1),true);env.error({code:1});assert.equal(states.at(-1),true);ticket.dispose();});

test('expired requests cannot reveal a code after stable arrival',()=>{const env=setup(),root=new env.Element('main');let renewed=0;const ticket=env.api.attach({root,request:{code:'482917',expires:Date.now()-1},language:'ko',t:k=>k,distance:()=>20,onCopy(){},onReissue(){renewed++;}});ticket.select({id:'a',name:'ATM',lat:35,lng:129});const now=Date.now();for(const timestamp of [now-5000,now])env.fix({coords:{latitude:35,longitude:129,accuracy:5},timestamp});assert.equal(env.encoded(),0);const find=n=>n.textContent==='코드 다시 받기'?n:n.children.map(find).find(Boolean);find(root).onclick();assert.equal(renewed,1);ticket.dispose();});
test('arrival code expands and remains open after leaving the radius',()=>{let qrOpened=0;const env=setup(),root=new env.Element('main');let metres=20;const ticket=env.api.attach({root,request:{code:'482917',expires:Date.now()+600000},language:'ko',t:k=>k,distance:()=>metres,onCopy(){},onQrOpen(){qrOpened++;}});ticket.select({id:'a',name:'ATM',lat:35,lng:129});const now=Date.now();for(const timestamp of [now-5000,now])env.fix({coords:{latitude:35,longitude:129,accuracy:40},timestamp});const button=ticket.element.children.find(n=>n.className==='ticket-qr');const dialog=root.children.find(n=>n.tag==='dialog');button.onclick();assert.equal(qrOpened,1);assert.equal(dialog.open,true);metres=51;env.fix({coords:{latitude:35,longitude:129,accuracy:40},timestamp:Date.now()});assert.equal(dialog.open,true);ticket.dispose();});
test('out-of-order samples cannot remove a code revealed by a recent fix',()=>{const env=setup(),root=new env.Element('main');const ticket=env.api.attach({root,request:{code:'482917',expires:Date.now()+600000},language:'ko',t:k=>k,distance:()=>20,onCopy(){}});ticket.select({id:'a',name:'ATM',lat:35,lng:129});const now=Date.now();env.fix({coords:{latitude:35,longitude:129,accuracy:10},timestamp:now});env.fresh({coords:{latitude:35,longitude:129,accuracy:10},timestamp:now-120000});assert.equal(env.encoded(),1);ticket.dispose();});

test('a valid GPS fix recovers after permission error and unlocks inside 50m',()=>{const env=setup(),root=new env.Element('main');const ticket=env.api.attach({root,request:{code:'482917',expires:Date.now()+600000},language:'ko',t:k=>k,distance:()=>24,onCopy(){}});ticket.select({id:'a',name:'ATM',lat:35,lng:129});env.error({code:1});assert.equal(env.encoded(),0);env.fresh({coords:{latitude:35,longitude:129,accuracy:20},timestamp:Date.now()});assert.equal(env.encoded(),1);ticket.dispose();});
