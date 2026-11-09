import http from 'node:http';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import ratesHandler from './api/rates.js';
// Only the local server reads this file. It is outside the public dist directory.
try {
  const env = await readFile(new URL('./.env.local', import.meta.url), 'utf8');
  const key = env.match(/^\s*EXIM_API_KEY\s*=\s*(.*?)\s*$/m)?.[1];
  if (!process.env.EXIM_API_KEY && key) process.env.EXIM_API_KEY = key.replace(/^(['"])(.*)\1$/, '$2');
} catch (error) { if (error.code !== 'ENOENT') throw error; }
const root=path.resolve('dist');
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.jpg':'image/jpeg','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp'};
http.createServer(async(req,res)=>{try{const url=new URL(req.url,'http://localhost');if(url.pathname==='/api/rates')return await ratesHandler(req,res);let filename=decodeURIComponent(url.pathname);if(filename.endsWith('/'))filename+='index.html';const target=path.resolve(root,'.'+filename);if(!target.startsWith(root+path.sep)){res.writeHead(403);return res.end();}const data=await readFile(target);res.writeHead(200,{'Content-Type':types[path.extname(target)]||'application/octet-stream'});res.end(data);}catch{res.writeHead(404);res.end('Not found');}}).listen(Number(process.env.PORT||4173),'127.0.0.1',()=>console.log('Local: http://127.0.0.1:'+(process.env.PORT||4173)));
