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
 assert.equal(url.searchParams.get('travelmode'),'walking');
});
test('walking order uses actual routes rather than direct-line distances',()=>{
 const items=[{id:'a',distance:10},{id:'b',distance:90},{id:'c',distance:5}];
 const ranked=scope.window.AtmMap.rankWalking(items,[{condition:'ROUTE_EXISTS',distanceMeters:500,durationMillis:360000},{condition:'ROUTE_EXISTS',distanceMeters:200,durationMillis:180000},{condition:'ROUTE_NOT_FOUND'}]);
 assert.equal(ranked[0].id,'b');assert.equal(ranked[0].walkRank,1);
 assert.equal(ranked[1].id,'a');assert.equal(ranked[2].walkRank,null);
 assert.equal(ranked[2].walk,null);
});
test('missing or invalid routes never acquire a walking rank',()=>{
 const ranked=scope.window.AtmMap.rankWalking([{id:'a'},{id:'b'}],[{condition:'ROUTE_EXISTS',distanceMeters:NaN,durationMillis:5000},undefined]);
 assert.ok(ranked.every(p=>p.walk===null&&p.walkRank===null));
});
test('expanded Busan areas and all map interface messages cover five languages',()=>{
 assert.ok(Object.keys(scope.window.AtmMap.areas).length>=20);
 for(const area of Object.values(scope.window.AtmMap.areas)){
  assert.ok(area.lat>34.8&&area.lat<35.6&&area.lng>128.7&&area.lng<129.5);
  assert.equal(area.names.length,5);
 }
 for(const [key,values] of Object.entries(scope.window.AtmMap.text)){
  assert.equal(values.length,5,key);
  for(const value of values)assert.ok(value.length>0,key);
  for(const value of values.slice(1))assert.equal(/[가-힣]/.test(value),false,key);
 }
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
test('TMAP IDs are not passed to Google as Google Place IDs',()=>{const url=new URL(scope.window.AtmMap.mapsUrl({lat:35.1,lng:129.1,id:'tmap:123'}));assert.equal(url.searchParams.has('destination_place_id'),false);assert.equal(url.searchParams.get('destination'),'35.1,129.1');});
