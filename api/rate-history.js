const {createHistoryService}=require('../lib/rate-history.cjs');
const history=createHistoryService();
module.exports=async(req,res)=>{
 res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');
 if(req.method!=='GET'){res.statusCode=405;return res.end(JSON.stringify({error:'METHOD_NOT_ALLOWED'}));}
 const url=new URL(req.url,'http://localhost');
 try{const data=await history(url.searchParams.get('currency')||'USD',Number(url.searchParams.get('days')||7));res.statusCode=200;res.end(JSON.stringify(data));}
 catch(e){const error=['KEY_NOT_CONFIGURED','INVALID_REQUEST','NO_DATA'].includes(e.message)?e.message:'HISTORY_UNAVAILABLE';res.statusCode=error==='INVALID_REQUEST'?400:503;res.end(JSON.stringify({error}));}
};
