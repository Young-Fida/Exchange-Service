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
test('30 m gate requires an explicit target and recent valid coordinates; accuracy is advisory',()=>{
 const {api}=setup();const target={lat:35,lng:129};const fix={lat:35,lng:129,accuracy:5,timestamp:100000};
 assert.equal(api.gate(null,fix,100000,()=>0).unlocked,false);
 assert.equal(api.gate(target,fix,100000,()=>30).unlocked,true);
 assert.equal(api.gate(target,fix,100000,()=>30.01).unlocked,false);
 assert.equal(api.gate(target,{...fix,accuracy:35},100000,()=>20).unlocked,true);
 assert.equal(api.gate(target,fix,160001,()=>0).unlocked,false);
 assert.equal(api.gate(target,fix,100000,()=>0,false).unlocked,false);
});
test('QR is not generated before arrival and is removed again after leaving or changing ATM',()=>{
 const env=setup(),root=new env.Element('main');let metres=100;
 const request={code:'482917',expires:Date.now()+600000};
 const states=[];const ticket=env.api.attach({root,request,language:'ko',t:k=>k,distance:()=>metres,onCopy(){},onState:state=>states.push(state.unlocked)});
 assert.equal(env.encoded(),0);
 ticket.select({id:'a',name:'ATM A',lat:35,lng:129});
 const pos=()=>({coords:{latitude:35,longitude:129,accuracy:5},timestamp:Date.now()});
 env.fix(pos());assert.equal(env.encoded(),0);
 metres=20;env.fix(pos());assert.equal(env.encoded(),1);
 const text=n=>[n.textContent,...n.children.map(text)].join(' ');
 assert.match(text(root.children[0]),/482 917/);
 metres=31;env.fix(pos());assert.doesNotMatch(text(root.children[0]),/482 917/);
 ticket.select({id:'b',name:'ATM B',lat:36,lng:130});assert.doesNotMatch(text(root.children[0]),/482 917/);
 assert.ok(states.includes(true));assert.equal(states.at(-1),false);ticket.dispose();
});
test('20 m proximity is unlocked even when reported GPS accuracy exceeds 20 m',()=>{const {api}=setup();const result=api.gate({lat:35,lng:129},{lat:35,lng:129,accuracy:35,timestamp:100000},100000,()=>20);assert.equal(result.unlocked,true);assert.equal(result.reason,'arrived');assert.equal(result.metres,20);});
test('restored ATM targets restart GPS monitoring and expired requests offer reissue',()=>{const env=setup(),root=new env.Element('main');let renewed=0;const request={code:'482917',expires:Date.now()-1,atmTarget:{id:'a',name:'ATM A',lat:35,lng:129}};const ticket=env.api.attach({root,request,language:'ko',t:k=>k,distance:()=>20,onCopy(){},onReissue(){renewed++;}});env.fix({coords:{latitude:35,longitude:129,accuracy:5},timestamp:Date.now()});assert.equal(env.encoded(),0);const find=n=>n.textContent==='코드 다시 받기'?n:n.children.map(find).find(Boolean);const button=find(root);assert.ok(button);button.onclick();assert.equal(renewed,1);ticket.dispose();});
test('stale GPS is refreshed automatically and visibility return requests a fresh fix',()=>{const env=setup(),root=new env.Element('main'),request={code:'482917',expires:Date.now()+600000};const ticket=env.api.attach({root,request,language:'ko',t:k=>k,distance:()=>20,onCopy(){}});ticket.select({id:'a',name:'ATM A',lat:35,lng:129});env.fix({coords:{latitude:35,longitude:129,accuracy:5},timestamp:Date.now()-61000});assert.equal(env.encoded(),0);env.tick();env.fresh({coords:{latitude:35,longitude:129,accuracy:5},timestamp:Date.now()});assert.ok(env.encoded()>0);const before=env.encoded();env.visibility();env.fresh({coords:{latitude:35,longitude:129,accuracy:5},timestamp:Date.now()});assert.ok(env.encoded()>before);ticket.dispose();});
test('small GPS changes inside the arrival radius do not rebuild the QR dialog',()=>{const env=setup(),root=new env.Element('main');let metres=20;const ticket=env.api.attach({root,request:{code:'482917',expires:Date.now()+600000},language:'ko',t:k=>k,distance:()=>metres,onCopy(){}});ticket.select({id:'a',name:'ATM A',lat:35,lng:129});env.fix({coords:{latitude:35,longitude:129,accuracy:5},timestamp:Date.now()});const count=env.encoded();metres=21;env.fix({coords:{latitude:35,longitude:129,accuracy:6},timestamp:Date.now()});assert.equal(env.encoded(),count);ticket.dispose();});
test('arrival QR can be enlarged and closes again outside the 30 m radius',()=>{const env=setup(),root=new env.Element('main');let metres=20;const stages=[];const ticket=env.api.attach({root,request:{code:'482917',expires:Date.now()+600000},language:'ko',t:k=>k,distance:()=>metres,onCopy(){},onState:state=>stages.push(state.unlocked)});ticket.select({id:'a',name:'ATM A',lat:35,lng:129});env.fix({coords:{latitude:35,longitude:129,accuracy:40},timestamp:Date.now()});const button=ticket.element.children.find(n=>n.className==='ticket-qr');const dialog=root.children.find(n=>n.tag==='dialog');assert.ok(button);button.onclick();assert.equal(dialog.open,true);assert.equal(stages.at(-1),true);metres=31;env.fix({coords:{latitude:35,longitude:129,accuracy:40},timestamp:Date.now()});assert.equal(dialog.open,false);assert.equal(stages.at(-1),false);ticket.dispose();});
test('transient GPS failures preserve a recent valid location and do not close the QR',()=>{const env=setup(),root=new env.Element('main');const states=[];const ticket=env.api.attach({root,request:{code:'482917',expires:Date.now()+600000},language:'ko',t:k=>k,distance:()=>22,onCopy(){},onState:s=>states.push(s.unlocked)});ticket.select({id:'a',name:'ATM A',lat:35,lng:129});env.fix({coords:{latitude:35,longitude:129,accuracy:99},timestamp:Date.now()});const encoded=env.encoded();env.error({code:3});assert.equal(env.encoded(),encoded);assert.equal(states.at(-1),true);env.error({code:1});assert.equal(states.at(-1),false);ticket.dispose();});
test('a late older GPS response cannot replace the newest position',()=>{const env=setup(),root=new env.Element('main');const ticket=env.api.attach({root,request:{code:'482917',expires:Date.now()+600000},language:'ko',t:k=>k,distance:()=>22,onCopy(){}});ticket.select({id:'a',name:'ATM A',lat:35,lng:129});const now=Date.now();env.fix({coords:{latitude:35,longitude:129,accuracy:10},timestamp:now});const count=env.encoded();env.fresh({coords:{latitude:34,longitude:128,accuracy:100},timestamp:now-120000});assert.equal(env.encoded(),count);ticket.dispose();});
test('late location success after permission denial stays locked until explicit retry',()=>{const env=setup(),root=new env.Element('main');const states=[];const ticket=env.api.attach({root,request:{code:'482917',expires:Date.now()+600000},language:'ko',t:k=>k,distance:()=>22,onCopy(){},onState:s=>states.push(s.unlocked)});ticket.select({id:'a',name:'ATM A',lat:35,lng:129});env.error({code:1});const pos={coords:{latitude:35,longitude:129,accuracy:10},timestamp:Date.now()};env.fresh(pos);assert.equal(states.at(-1),false);ticket.start();env.fresh({...pos,timestamp:Date.now()});assert.equal(states.at(-1),true);ticket.dispose();});
