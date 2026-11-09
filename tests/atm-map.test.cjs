const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const scope={window:{},URL,URLSearchParams};
vm.createContext(scope);
vm.runInContext(fs.readFileSync(require.resolve('../dist/atm-map.js'),'utf8'),scope);
test('distance uses metres, including identical and nearby locations',()=>{
 const distance=scope.window.AtmMap.distance;
 assert.equal(distance({lat:35,lng:129},{lat:35,lng:129}),0);
 assert.ok(Math.abs(distance({lat:0,lng:0},{lat:0,lng:1})-111195)<2);
});
test('Google directions retain exact coordinates and selected place identity',()=>{
 const url=new URL(scope.window.AtmMap.mapsUrl({lat:35.1624373,lng:129.1612486,id:'test-place'}));
 assert.equal(url.origin,'https://www.google.com');
 assert.equal(url.searchParams.get('destination'),'35.1624373,129.1612486');
 assert.equal(url.searchParams.get('destination_place_id'),'test-place');
 assert.equal(url.searchParams.get('api'),'1');
});
test('map configuration does not expose the exchange-rate server secret',()=>{
 const handler=require('../api/map-config.js');
 const previous=process.env.GOOGLE_MAPS_BROWSER_KEY;
 try{
  process.env.GOOGLE_MAPS_BROWSER_KEY='browser-test-key';
  const res={setHeader(){},end(body){assert.deepEqual(JSON.parse(body),{key:'browser-test-key'});}};
  handler({method:'GET'},res);
  delete process.env.GOOGLE_MAPS_BROWSER_KEY;
  handler({method:'GET'},{setHeader(){},end(body){assert.equal(this.statusCode,503);assert.equal(JSON.parse(body).error,'MAP_KEY_NOT_CONFIGURED');}});
 }finally{if(previous===undefined)delete process.env.GOOGLE_MAPS_BROWSER_KEY;else process.env.GOOGLE_MAPS_BROWSER_KEY=previous;}
});
