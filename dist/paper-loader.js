/* Fast thumb-riffle: lower-quarter grip, overlapping releases, flexible free edges. */
window.startPaperLoader=function(canvas,{duration=1900,reducedMotion=false}={}){
 const ctx=canvas.getContext('2d');if(!ctx)return ()=>{};
 const W=380,H=260,N=12,S=12,dpr=Math.min(devicePixelRatio||1,2);
 canvas.width=W*dpr;canvas.height=H*dpr;ctx.scale(dpr,dpr);
 let frame=0,stopped=false,start=performance.now();
 const textures=[makeNote(false,false),makeNote(true,false),makeNote(false,true),makeNote(true,true)];
 function makeNote(gold,back){const c=document.createElement('canvas');c.width=680;c.height=400;const g=c.getContext('2d');const base=g.createLinearGradient(0,0,680,400);base.addColorStop(0,gold?'#fffbdc':'#fbfdff');base.addColorStop(.55,gold?'#f8edac':'#e5f0ff');base.addColorStop(1,gold?'#fff8ca':'#f6faff');g.fillStyle=base;g.fillRect(0,0,680,400);
 g.strokeStyle=gold?'#a7924530':'#5c8ec133';g.lineWidth=.65;for(let y=30;y<380;y+=6){g.beginPath();for(let x=12;x<668;x+=3){const py=y+Math.sin(x*.032+y*.12)*4+Math.cos(x*.014)*3;x===12?g.moveTo(x,py):g.lineTo(x,py);}g.stroke();}
 g.strokeStyle=gold?'#af9a5060':'#729bc35c';g.lineWidth=1.8;g.strokeRect(17,17,646,366);g.lineWidth=.7;g.strokeRect(25,25,630,350);
 for(let i=0;i<220;i++){let x=(i*173.41)%680,y=(i*91.13)%400;g.strokeStyle='#6e7c7d0b';g.lineWidth=.6;g.beginPath();g.moveTo(x,y);g.lineTo(x+5,y-2);g.stroke();}
 g.save();g.translate(340,200);for(let i=0;i<11;i++){g.beginPath();g.ellipse(0,0,100+i*2,120-i*2,i*.16,0,Math.PI*2);g.strokeStyle=gold?'#ad934934':'#5c91bf38';g.lineWidth=.8;g.stroke();}g.restore();
 g.fillStyle=gold?'#89783d':'#467ba9';g.textAlign='center';g.textBaseline='middle';g.font='500 101px sans-serif';g.fillText(back?'₩':'₩',340,205);g.font='500 18px sans-serif';g.textAlign='left';g.fillText('KRW',43,51);g.font='12px sans-serif';g.fillText('QR  ·  SAMPLE',43,354);g.textAlign='right';g.fillText('DEMO',635,52);g.fillText('KOREAN WON',635,352);
 const light=g.createLinearGradient(0,0,680,0);light.addColorStop(0,'#ffffff65');light.addColorStop(.2,'#ffffff00');light.addColorStop(.7,'#ffffff18');light.addColorStop(1,'#ffffff60');g.fillStyle=light;g.fillRect(0,0,680,400);return c;}
 function triangle(image,s,d){const [s0,s1,s2]=s,[d0,d1,d2]=d;const det=(s1.x-s0.x)*(s2.y-s0.y)-(s2.x-s0.x)*(s1.y-s0.y);if(Math.abs(det)<.001)return;const a=((d1.x-d0.x)*(s2.y-s0.y)-(d2.x-d0.x)*(s1.y-s0.y))/det,b=((d1.y-d0.y)*(s2.y-s0.y)-(d2.y-d0.y)*(s1.y-s0.y))/det,c=((d2.x-d0.x)*(s1.x-s0.x)-(d1.x-d0.x)*(s2.x-s0.x))/det,e=((d2.y-d0.y)*(s1.x-s0.x)-(d1.y-d0.y)*(s2.x-s0.x))/det;ctx.save();ctx.beginPath();ctx.moveTo(d0.x,d0.y);ctx.lineTo(d1.x,d1.y);ctx.lineTo(d2.x,d2.y);ctx.closePath();ctx.clip();ctx.transform(a,b,c,e,d0.x-a*s0.x-c*s0.y,d0.y-b*s0.x-e*s0.y);ctx.drawImage(image,0,0);ctx.restore();}

 // A point grip at (24% of width, 75% of height), not a bound vertical spine.
 const grip={x:194,y:204},noteW=211,noteH=116,rows=4;
 function pose(p,i){const e=1-Math.pow(1-p,2.4),release=Math.sin(Math.PI*p),settle=Math.sin(p*Math.PI*3)*Math.pow(p,2)*(1-p);return {angle:(7-61*e-7*release+4*settle+i*.14)*Math.PI/180,bend:release};}
 function sheet(p,i){const {angle,bend}=pose(p,i),texture=textures[i%3===1?1:0],offset=i*.42;
 if(p<=0||p>=1){ctx.save();ctx.translate(grip.x,grip.y-offset);ctx.rotate(angle);ctx.shadowColor='#22466d14';ctx.shadowBlur=5;ctx.shadowOffsetY=1.2;ctx.drawImage(texture,-noteW*.24,-noteH*.75,noteW,noteH);ctx.restore();return;}
 const mesh=[];for(let y=0;y<=rows;y++){const v=y/rows,row=[];for(let x=0;x<=S;x++){const u=x/S,dx=(u-.24)*noteW,dy=(v-.75)*noteH,free=Math.min(1,Math.abs(v-.75)/.75),top=Math.max(0,(.75-v)/.75),lag=Math.sin(Math.PI*u)*top;
 // The thumb restrains the lower quarter while the free top edge bows and snaps.
 const curl=-24*bend*lag,flutter=3.3*bend*free*Math.sin(u*5+p*9+i*.33),z=31*bend*lag+6*bend*free*Math.sin(u*3.14),perspective=720/(720-z),localX=dx+curl,localY=dy+flutter;
 row.push({x:grip.x+(localX*Math.cos(angle)-localY*Math.sin(angle))*perspective,y:grip.y-offset+(localX*Math.sin(angle)+localY*Math.cos(angle))*perspective});}mesh.push(row);}
 ctx.save();ctx.beginPath();mesh[0].forEach((a,j)=>j?ctx.lineTo(a.x,a.y):ctx.moveTo(a.x,a.y));for(let y=1;y<=rows;y++)ctx.lineTo(mesh[y][S].x,mesh[y][S].y);for(let x=S-1;x>=0;x--)ctx.lineTo(mesh[rows][x].x,mesh[rows][x].y);ctx.closePath();ctx.shadowColor='#284a7520';ctx.shadowBlur=4+6*bend;ctx.shadowOffsetX=-3*bend;ctx.shadowOffsetY=2;ctx.fillStyle='#f5f8fc';ctx.fill();ctx.restore();
 for(let y=0;y<rows;y++)for(let x=0;x<S;x++){const a=mesh[y][x],b=mesh[y][x+1],c=mesh[y+1][x+1],d=mesh[y+1][x],sx=x/S*680,ex=(x+1)/S*680,sy=y/rows*400,ey=(y+1)/rows*400;triangle(texture,[{x:sx,y:sy},{x:ex,y:sy},{x:ex,y:ey}],[a,b,c]);triangle(texture,[{x:sx,y:sy},{x:ex,y:ey},{x:sx,y:ey}],[a,c,d]);ctx.fillStyle='rgba(43,69,99,'+(.065*bend*Math.sin(x/S*Math.PI))+')';ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.lineTo(c.x,c.y);ctx.lineTo(d.x,d.y);ctx.closePath();ctx.fill();}}
 function draw(now){if(stopped)return;const elapsed=now-start,active=Math.max(100,duration-230),sheetSpan=active*.22,stagger=active*.78/(N-1),offset=35;ctx.clearRect(0,0,W,H);const glow=ctx.createRadialGradient(190,150,10,190,150,185);glow.addColorStop(0,'#e1edff65');glow.addColorStop(1,'#ffffff00');ctx.fillStyle=glow;ctx.fillRect(0,0,W,H);
 const progress=Array.from({length:N},(_,i)=>reducedMotion?1:Math.max(0,Math.min(1,(elapsed-offset-i*stagger)/sheetSpan)));const completed=progress.filter(p=>p>=1).length;canvas.dataset.phase=completed===N?'complete':progress.some(p=>p>0)?'riffling':'start';canvas.dataset.completed=String(completed);canvas.dataset.grip='lower-quarter';
 // Remaining stack first, the settled fan second, and the released notes on top.
 for(let i=N-1;i>=0;i--)if(progress[i]===0)sheet(0,i);for(let i=0;i<N;i++)if(progress[i]===1)sheet(1,i);for(let i=N-1;i>=0;i--)if(progress[i]>0&&progress[i]<1)sheet(progress[i],i);
 // Soft pressure shadow identifies the thumb grip without drawing a hand or clip.
 ctx.save();ctx.translate(grip.x-2,grip.y-2);ctx.rotate(-.25);ctx.fillStyle='#36567b0d';ctx.beginPath();ctx.ellipse(0,0,13,4,0,0,Math.PI*2);ctx.fill();ctx.restore();
 if(completed===N)canvas.dataset.finished='true';if(elapsed<duration&&!reducedMotion)frame=requestAnimationFrame(draw);}
 draw(start);return ()=>{stopped=true;cancelAnimationFrame(frame);};
};
