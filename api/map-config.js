module.exports = function handler(req,res) {
  res.setHeader('Content-Type','application/json; charset=utf-8');
  res.setHeader('Cache-Control','no-store');
  // This is a browser key, intentionally sent to the Google Maps SDK.
  // Restrict it to approved website referrers and Maps JavaScript API in Google Cloud.
  if(req.method!=='GET'){res.statusCode=405;return res.end(JSON.stringify({error:'METHOD_NOT_ALLOWED'}));}
  const key=process.env.GOOGLE_MAPS_BROWSER_KEY;
  res.statusCode=key?200:503;
  res.end(JSON.stringify(key?{key}:{error:'MAP_KEY_NOT_CONFIGURED'}));
};
