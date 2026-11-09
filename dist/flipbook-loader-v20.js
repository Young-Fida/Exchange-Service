/* V20: four Korean banknote garment colours. V19: frontal portraits and stronger mixed-colour garments. V18: multi-identity collage and native 10,000-won background. Motion preserved from V17: one proportion-locked Sejong sprite sequence printed on the actual bending page. */
(()=>{
const W=360,H=460,PW=318,PH=420,ROWS=28,COLS=2;
const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
const smooth=n=>n*n*(3-2*n);
let texturePromise;
function loadImage(src){return new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=reject;i.src=src;});}
function textures(){return texturePromise||(texturePromise=(async()=>{
 const sprite=await loadImage('assets/sejong-flipbook-v20/krw-palette-six-poses.png');
 const [paper,front]=await Promise.all([loadImage('assets/krw-collage-v11/10000-scan-back.jpg'),loadImage('assets/krw-collage-v11/10000-scan-front.jpg')]);
 // A native-aspect clockwise crop of the real scan; no generated background or faded wash.
 const banknote=(g,image)=>{g.save();g.translate(512,0);g.rotate(Math.PI/2);const scale=512/image.naturalHeight;g.drawImage(image,0,0,image.naturalWidth*scale,512);g.restore();};
 const cards=Array.from({length:6},(_,frame)=>{
  const c=document.createElement('canvas');c.width=512;c.height=672;const g=c.getContext('2d');
  banknote(g,front);
  // One common crop, one uniform scale for every pose. Entire head/body/arm remain attached.
  g.save();g.translate(512,0);g.scale(-1,1);
  g.drawImage(sprite,(frame%3)*512+40,Math.floor(frame/3)*512,432,512,16,9,480,512*480/432);
  g.restore();g.strokeStyle='#ddd8c4';g.lineWidth=1;g.strokeRect(.5,.5,511,671);
  return c;
 });
 const back=document.createElement('canvas');back.width=512;back.height=672;const g=back.getContext('2d');
 banknote(g,paper);
 return{cards,back};
})());}
function create(canvas,{duration=7200,reducedMotion=false,view='front'}={}){
 const ctx=canvas.getContext('2d'),dpr=Math.min(devicePixelRatio||1,2);
 canvas.width=W*dpr;canvas.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);
 let images=null,elapsed=0,raf=0,running=false,disposed=false,origin=0,forced=null,stats={};
 const ready=textures().then(t=>{if(disposed)return;images=t;render(elapsed);});
 function vertex(u,v,bend,offset=0){
  const length=PH*(1-v),held=PH*.19,arc=PH*.54;let y,z,angle=0;
  if(length<=held||Math.abs(bend)<.0001){y=-length;z=0;}
  else{const r=arc/bend,d=Math.min(arc,length-held);angle=d/arc*bend;y=-held-r*Math.sin(angle);z=r*(1-Math.cos(angle));
   if(length>held+arc){const free=length-held-arc;y-=free*Math.cos(bend);z+=free*Math.sin(bend);}}
  const x=(u-.5)*PW,yaw=view==='side'?1.3:.045;
  const xx=x*Math.cos(yaw)+z*Math.sin(yaw),zz=z*Math.cos(yaw)-x*Math.sin(yaw),perspective=1500/(1500-zz);
  return{x:W/2+xx*perspective+offset,y:440+y*perspective+offset*.35,z:zz,u,v,normal:Math.cos(angle)};
 }
 function triangle(image,a,b,c){
  const sa={x:a.u*image.width,y:a.v*image.height},sb={x:b.u*image.width,y:b.v*image.height},sc={x:c.u*image.width,y:c.v*image.height};
  const det=(sb.x-sa.x)*(sc.y-sa.y)-(sc.x-sa.x)*(sb.y-sa.y);if(Math.abs(det)<1e-5)return;
  const A=((b.x-a.x)*(sc.y-sa.y)-(c.x-a.x)*(sb.y-sa.y))/det,B=((b.y-a.y)*(sc.y-sa.y)-(c.y-a.y)*(sb.y-sa.y))/det;
  const C=((c.x-a.x)*(sb.x-sa.x)-(b.x-a.x)*(sc.x-sa.x))/det,D=((c.y-a.y)*(sb.x-sa.x)-(b.y-a.y)*(sc.x-sa.x))/det;
  const mx=(a.x+b.x+c.x)/3,my=(a.y+b.y+c.y)/3;
  const expanded=p=>{const l=Math.hypot(p.x-mx,p.y-my)||1;return{x:p.x+(p.x-mx)/l*.65,y:p.y+(p.y-my)/l*.65};};
  const aa=expanded(a),bb=expanded(b),cc=expanded(c);
  ctx.save();ctx.beginPath();ctx.moveTo(aa.x,aa.y);ctx.lineTo(bb.x,bb.y);ctx.lineTo(cc.x,cc.y);ctx.closePath();ctx.clip();
  ctx.transform(A,B,C,D,a.x-A*sa.x-C*sa.y,a.y-B*sa.x-D*sa.y);ctx.drawImage(image,0,0);ctx.restore();
 }
 function sheet(frame,bend,{offset=0,shadow=false,alpha=1}={}){
  if(!images)return;ctx.save();ctx.globalAlpha=alpha;
  if(Math.abs(bend)<.003&&view!=='side'){
   const x=(W-PW)/2+offset,y=440-PH+offset*.35;
   if(shadow){ctx.shadowColor='#20372835';ctx.shadowBlur=8;ctx.shadowOffsetY=3;}
   ctx.drawImage(images.cards[frame],x,y,PW,PH);ctx.shadowColor='transparent';ctx.strokeStyle='#d6d0bb88';ctx.lineWidth=.65;ctx.strokeRect(x,y,PW,PH);ctx.restore();return;
  }
  const rows=Array.from({length:ROWS+1},(_,y)=>Array.from({length:COLS+1},(_,x)=>vertex(x/COLS,y/ROWS,bend,offset)));
  const outline=()=>{ctx.beginPath();ctx.moveTo(rows[0][0].x,rows[0][0].y);for(let x=1;x<=COLS;x++)ctx.lineTo(rows[0][x].x,rows[0][x].y);for(let y=1;y<=ROWS;y++)ctx.lineTo(rows[y][COLS].x,rows[y][COLS].y);for(let x=COLS-1;x>=0;x--)ctx.lineTo(rows[ROWS][x].x,rows[ROWS][x].y);for(let y=ROWS-1;y>=0;y--)ctx.lineTo(rows[y][0].x,rows[y][0].y);ctx.closePath();};
  outline();if(shadow){ctx.shadowColor='#20372835';ctx.shadowBlur=8;ctx.shadowOffsetY=3;}ctx.fillStyle='#f1eddf';ctx.fill();ctx.shadowColor='transparent';
  const cells=[];for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){const a=rows[y][x],b=rows[y][x+1],c=rows[y+1][x+1],d=rows[y+1][x];cells.push({a,b,c,d,z:(a.z+b.z+c.z+d.z)/4,normal:(a.normal+d.normal)/2});}
  cells.sort((a,b)=>a.z-b.z);
  for(const cell of cells){const{a,b,c,d,normal}=cell,image=normal<0?images.back:images.cards[frame];triangle(image,a,b,c);triangle(image,a,c,d);
   const shade=Math.min(.16,(1-Math.abs(normal))*.16);if(shade>.01){ctx.fillStyle='rgba(35,42,26,'+shade+')';ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.lineTo(c.x,c.y);ctx.lineTo(d.x,d.y);ctx.closePath();ctx.fill();}}
  outline();ctx.strokeStyle='#d6d0bb88';ctx.lineWidth=.65;ctx.stroke();ctx.restore();
 }
 function poseAt(ms){if(reducedMotion)return 5;return Math.min(5,Math.floor(Math.max(0,ms-350)/950));}
 function render(ms){
  if(disposed)return;elapsed=clamp(ms,0,duration);
  const intro=300,period=96,releaseEnd=duration-950;
  const pose=forced!==null?forced:poseAt(elapsed),last=forced!==null?forced:poseAt(elapsed-period);
  const hasMotion=!reducedMotion&&forced===null&&elapsed<releaseEnd;
  let bend=0,cycle=0,flip=0;
  if(hasMotion){if(elapsed<intro){flip=clamp(elapsed/intro);bend=Math.PI*Math.pow(1-flip,2);}
   else{cycle=Math.floor((elapsed-intro)/period);flip=((elapsed-intro)%period)/period;bend=Math.PI*Math.pow(1-clamp(flip/.86),3);}}
  ctx.clearRect(0,0,W,H);
  // Just three backing leaves; no forest of edge lines across the portrait.
  sheet(last,0,{offset:-4,shadow:true,alpha:.70});sheet(last,0,{offset:-2,alpha:.85});
  if(hasMotion){sheet(last,0,{shadow:true});sheet(pose,bend,{shadow:bend>.05});}
  else sheet(pose,0,{shadow:true});
  const phase=elapsed>=duration||reducedMotion?'complete':elapsed<intro?'curled':'riffling';
  stats={elapsed:Math.round(elapsed),phase,portraitPose:'sejong-'+pose,completed:hasMotion?cycle:Math.ceil(releaseEnd/period),layers:3,bendDegrees:+(bend*180/Math.PI).toFixed(2),pageInterval:period,action:['rest','elbow-bending','fist-at-chest','forearm-rising','thumb-extending','thumb-up'][pose]};
  Object.assign(canvas.dataset,{phase,finished:String(phase==='complete'),portraitPose:stats.portraitPose,identity:['세종대왕','퇴계 이황','율곡 이이','세종대왕','퇴계 이황','세종대왕'][pose],banknoteBackground:'actual-10000-won-scan',action:stats.action,proportionRig:'one-Sejong-full-body-sprite',torso:'one-attached-complete-torso',stretch:'none-uniform-scale',collage:'six-coherent-cut-paper-poses',occlusion:'three-paper-leaves-only',imagePlane:'bending-sheet-no-front-overlay',pageInterval:String(period),poseHold:'950',bend:String(stats.bendDegrees),handSide:'screen-right',frameCount:'6',view});
  canvas.dispatchEvent(new CustomEvent('riffleframe',{detail:stats}));
 }
 function pause(){running=false;cancelAnimationFrame(raf);}
 function tick(now){if(!running||disposed)return;render(now-origin);if(elapsed<duration)raf=requestAnimationFrame(tick);else running=false;}
 function play(){pause();forced=null;elapsed=0;origin=performance.now();running=true;render(reducedMotion?duration:0);if(!reducedMotion)raf=requestAnimationFrame(tick);}
 function seek(ms){pause();forced=null;render(ms);}
 function showFrame(index){pause();forced=Math.round(clamp(index/12)*5);render(duration);}
 function setView(mode){view=mode;render(elapsed);}
 function destroy(){pause();disposed=true;}
 render(0);return{play,pause,seek,showFrame,setView,destroy,ready,getStats:()=>stats,get duration(){return duration;}};
}
window.PaperRiffleLoader={create};
window.startPaperLoader=(canvas,options)=>{const c=create(canvas,options);c.play();return()=>c.destroy();};
if('requestIdleCallback' in window)requestIdleCallback(()=>textures());else setTimeout(()=>textures(),0);
})();
