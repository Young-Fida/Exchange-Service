const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
for(const method of ['card','passport','biometric'])test(method+' waits for privacy confirmation before opening hardware',()=>{
 let dialog,camera=0,key=0;
 class Node{
 constructor(){this.listeners={};this.dataset={};this.html='';}
 setAttribute(){} addEventListener(n,f){this.listeners[n]=f;} focus(){} remove(){} close(){} showModal(){}
 set innerHTML(v){this.html=v;this.nodes={};} get innerHTML(){return this.html;}
 querySelector(s){if(!this.nodes[s])this.nodes[s]=new Node();return this.nodes[s];}
 querySelectorAll(){return this.html.includes('data-auth-method=')?['card','passport','biometric'].map(m=>{const n=new Node();n.dataset.authMethod=m;return n;}):[];}
 }
 const scope={window:{DeviceRegistration:{stopCamera(){},requestCamera(){camera++;return new Promise(()=>{});},createPasskey(){key++;return new Promise(()=>{});}}},document:{createElement(){dialog=new Node();return dialog;},body:{appendChild(){}},addEventListener(){},removeEventListener(){}},AbortController};
 vm.createContext(scope);vm.runInContext(fs.readFileSync(require.resolve('../dist/demo-verification.js'),'utf8'),scope);
 // Save event listeners on the rendered method nodes.
 const original=Node.prototype.querySelectorAll;let methods;
 Node.prototype.querySelectorAll=function(){const nodes=original.call(this);if(nodes.length)methods=nodes;return nodes;};
 scope.window.DemoVerification.open({language:'en'});
 methods.find(n=>n.dataset.authMethod===method).listeners.click();
 assert.match(dialog.innerHTML,/How your information is handled/);
 assert.equal(camera+key,0);
 if(method==='biometric')assert.match(dialog.innerHTML,/not automatically deleted/);
 else assert.match(dialog.innerHTML,/Partner banks would handle/);
 dialog.querySelector('[data-auth-start]').listeners.click();
 assert.equal(method==='biometric'?key:camera,1);
});
