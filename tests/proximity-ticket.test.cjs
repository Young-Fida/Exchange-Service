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
 let callback,encoded=0;
 const scope={window:{qrcode:()=>({addData(){encoded++;},make(){},createSvgTag(){return '<svg/>';}})},document:{hidden:false,createElement:tag=>new Element(tag),addEventListener(){},removeEventListener(){}},navigator:{geolocation:{watchPosition(fn){callback=fn;return 1;},clearWatch(){}}},Date,setInterval:()=>1,clearInterval(){}};
 vm.createContext(scope);vm.runInContext(fs.readFileSync(require.resolve('../dist/proximity-ticket.js'),'utf8'),scope);
 return {api:scope.window.PickupTicket,scope,Element,fix:p=>callback(p),encoded:()=>encoded};
}
test('30 m gate requires an explicit target, recent fix and useful GPS accuracy',()=>{
 const {api}=setup();const target={lat:35,lng:129};const fix={lat:35,lng:129,accuracy:5,timestamp:100000};
 assert.equal(api.gate(null,fix,100000,()=>0).unlocked,false);
 assert.equal(api.gate(target,fix,100000,()=>30).unlocked,true);
 assert.equal(api.gate(target,fix,100000,()=>30.01).unlocked,false);
 assert.equal(api.gate(target,{...fix,accuracy:21},100000,()=>0).unlocked,false);
 assert.equal(api.gate(target,fix,115001,()=>0).unlocked,false);
 assert.equal(api.gate(target,fix,100000,()=>0,false).unlocked,false);
});
test('QR is not generated before arrival and is removed again after leaving or changing ATM',()=>{
 const env=setup(),root=new env.Element('main');let metres=100;
 const request={code:'482917',expires:Date.now()+600000};
 const ticket=env.api.attach({root,request,language:'ko',t:k=>k,distance:()=>metres,onCopy(){}});
 assert.equal(env.encoded(),0);
 ticket.select({id:'a',name:'ATM A',lat:35,lng:129});
 const pos=()=>({coords:{latitude:35,longitude:129,accuracy:5},timestamp:Date.now()});
 env.fix(pos());assert.equal(env.encoded(),0);
 metres=20;env.fix(pos());assert.equal(env.encoded(),1);
 const text=n=>[n.textContent,...n.children.map(text)].join(' ');
 assert.match(text(root.children[0]),/482 917/);
 metres=31;env.fix(pos());assert.doesNotMatch(text(root.children[0]),/482 917/);
 ticket.select({id:'b',name:'ATM B',lat:36,lng:130});assert.doesNotMatch(text(root.children[0]),/482 917/);
 ticket.dispose();
});
