const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const source=fs.readFileSync(require.resolve('../dist/app.js'),'utf8');
test('all application and live-rate messages have five non-empty translations',()=>{
 const initial=source.slice(source.indexOf('const words='),source.indexOf('\n};')+3);
 const additions=[...source.matchAll(/Object\.assign\(words,\{[\s\S]*?\}\);/g)].map(m=>m[0]);
 const overrides=[...source.matchAll(/words\.\w+=\[[^;]+\];/g)].map(m=>m[0]);
 const context={};vm.createContext(context);
 vm.runInContext(initial+'\n'+additions.join('\n')+'\n'+overrides.join('\n')+'\nthis.catalog=words;',context);
 for(const [key,values] of Object.entries(context.catalog)){
  assert.equal(values.length,5,key);
  for(const value of values)assert.equal(typeof value==='string'&&value.length>0,true,key);
  for(const value of values.slice(1))assert.equal(/[가-힣]/.test(value),false,key);
 }
 for(const required of ['liveRates','rateDate','rateSource','rateUnsupported','rateNotice','leaveDescription','language','applyTitle','faqTitle','faqBadge','faqIntro','faqPlan',...Array.from({length:7},(_,i)=>'faqQ'+(i+1)),...Array.from({length:7},(_,i)=>'faqA'+(i+1))])assert.ok(context.catalog[required],required);
});
