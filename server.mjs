import http from 'node:http';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import ratesHandler from './api/rates.js';
import mapConfigHandler from './api/map-config.js';
import walkingHandler from './api/walking-routes.js';
// Only the local server reads this file. It is outside the public dist directory.
try {
  const env = await readFile(new URL('./.env.local', import.meta.url), 'utf8');
  for(const name of ['EXIM_API_KEY','GOOGLE_MAPS_BROWSER_KEY','TMAP_API_KEY']){
    const key = env.match(new RegExp('^\\s*'+name+'\\s*=\\s*(.*?)\\s*$','m'))?.[1];
    if (!process.env[name] && key) process.env[name] = key.replace(/^(['"])(.*)\1$/, '$2');
  }
} catch (error) { if (error.code !== 'ENOENT') throw error; }
const root=path.resolve('dist');
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.jpg':'image/jpeg','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp'};
http.createServer(async(req,res)=>{try{const url=new URL(req.url,'http://localhost');if(url.pathname==='/api/walking-routes')return await walkingHandler(req,res);if(url.pathname==='/api/rates')return await ratesHandler(req,res);if(url.pathname==='/api/map-config')return mapConfigHandler(req,res);let filename=decodeURIComponent(url.pathname);if(filename.endsWith('/'))filename+='index.html';const target=path.resolve(root,'.'+filename);if(!target.startsWith(root+path.sep)){res.writeHead(403);return res.end();}const data=await readFile(target);res.writeHead(200,{'Content-Type':types[path.extname(target)]||'application/octet-stream'});res.end(data);}catch{res.writeHead(404);res.end('Not found');}}).listen(Number(process.env.PORT||4173),'127.0.0.1',()=>console.log('Local: http://127.0.0.1:'+(process.env.PORT||4173)));
