const {test}=require('node:test');
const assert=require('node:assert/strict');
const handler=require('../api/walking-routes.js');
test('TMAP adapter converts seconds to milliseconds and rejects missing totals',()=>{
 assert.deepEqual(handler.normalize({features:[{properties:{totalDistance:220,totalTime:180}}]}),{condition:'ROUTE_EXISTS',distanceMeters:220,durationMillis:180000,path:[]});
 assert.deepEqual(handler.normalize({features:[]}),{condition:'ROUTE_NOT_FOUND'});
});
test('walking endpoint rejects out-of-area coordinates and more than eight candidates before fetching',async()=>{
 for(const body of [{origin:{lat:0,lng:0},destinations:[{lat:35.1,lng:129}]},{origin:{lat:35.1,lng:129},destinations:Array(9).fill({lat:35.2,lng:129})}]){
  let result;const res={setHeader(){},end(s){result=JSON.parse(s);}};
  await handler({method:'POST',body},res);assert.equal(res.statusCode,400);assert.equal(result.error,'INVALID_REQUEST');
 }
});

test('TMAP route geometry preserves longitude/latitude ordering for the map',()=>{const row=handler.normalize({features:[{properties:{totalDistance:20,totalTime:15}},{geometry:{type:'LineString',coordinates:[[129.1,35.1],[129.2,35.2]]}}]});assert.deepEqual(row.path,[{lat:35.1,lng:129.1},{lat:35.2,lng:129.2}]);});
