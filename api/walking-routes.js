// Server-only TMAP adapter. Never return upstream bodies or credentials.
function valid(p) {
  return p && Number.isFinite(p.lat) && Number.isFinite(p.lng) &&
    p.lat >= 34.8 && p.lat <= 35.6 && p.lng >= 128.7 && p.lng <= 129.5;
}
function normalize(data) {
  const p = data?.features?.[0]?.properties;
  if (!Number.isFinite(p?.totalDistance) || p.totalDistance < 0 ||
      !Number.isFinite(p?.totalTime) || p.totalTime < 0) return {condition:'ROUTE_NOT_FOUND'};
  return {condition:'ROUTE_EXISTS',distanceMeters:p.totalDistance,durationMillis:p.totalTime*1000,path:(data.features||[]).filter(f=>f.geometry?.type==='LineString').flatMap(f=>f.geometry.coordinates).filter(c=>Array.isArray(c)&&c.length>=2&&Number.isFinite(c[0])&&Number.isFinite(c[1])).map(c=>({lat:c[1],lng:c[0]}))};
}
module.exports = async function handler(req,res) {
  res.setHeader('Content-Type','application/json; charset=utf-8');
  res.setHeader('Cache-Control','no-store');
  res.setHeader('X-Content-Type-Options','nosniff');
  const send=(code,data)=>{res.statusCode=code;res.end(JSON.stringify(data));};
  if(req.method!=='POST'){res.setHeader('Allow','POST');return send(405,{error:'METHOD_NOT_ALLOWED'});}
  let body=req.body;
  try {
    if(body===undefined){let raw='';for await(const chunk of req){raw+=chunk;if(Buffer.byteLength(raw)>8192)return send(413,{error:'BODY_TOO_LARGE'});}body=JSON.parse(raw);}
    if(typeof body==='string')body=JSON.parse(body);
  } catch {return send(400,{error:'INVALID_REQUEST'});}
  if(!valid(body?.origin)||!Array.isArray(body.destinations)||!body.destinations.length||body.destinations.length>8||!body.destinations.every(valid))return send(400,{error:'INVALID_REQUEST'});
  if(!process.env.TMAP_API_KEY)return send(503,{error:'TMAP_KEY_NOT_CONFIGURED'});
  // Cap the fan-out at eight candidates; no persistent location or route cache.
  const rows=[];
  for(let offset=0;offset<body.destinations.length;offset+=4){
    rows.push(...await Promise.all(body.destinations.slice(offset,offset+4).map(async dest=>{
      try{
        const response=await fetch('https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1',{
          method:'POST',headers:{'Content-Type':'application/json',appKey:process.env.TMAP_API_KEY},
          body:JSON.stringify({startX:body.origin.lng,startY:body.origin.lat,endX:dest.lng,endY:dest.lat,startName:encodeURIComponent('Start'),endName:encodeURIComponent('ATM'),reqCoordType:'WGS84GEO',resCoordType:'WGS84GEO',searchOption:'0'}),signal:AbortSignal.timeout(8000)
        });
        return response.ok?normalize(await response.json()):{condition:'ROUTE_NOT_FOUND'};
      }catch{return {condition:'ROUTE_NOT_FOUND'};}
    })));
  }
  send(200,{provider:'TMAP',rows});
};
module.exports.normalize=normalize;
