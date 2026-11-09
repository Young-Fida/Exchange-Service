/* Intentionally wonky, code-native atlas. Real banknotes are accents, not land textures. */
(()=>{
const cash='assets/currency-atlas/';
const continents=[
 ['north-america','#b7ca9a',[[77,177],[119,153],[169,159],[195,148],[224,165],[255,165],[279,190],[323,192],[316,211],[287,222],[280,252],[251,273],[253,293],[275,318],[297,334],[291,347],[271,336],[249,321],[236,299],[212,289],[193,267],[167,268],[158,244],[135,232],[123,209],[92,211],[69,198]]],
 ['south-america','#c6d5a6',[[298,346],[327,350],[347,366],[382,376],[399,407],[384,437],[371,463],[348,486],[337,517],[318,549],[312,578],[301,563],[299,533],[285,507],[278,472],[262,444],[265,413],[277,392],[275,369]]],
 ['greenland','#e9f2e9',[[390,123],[421,119],[441,139],[431,160],[430,184],[413,207],[399,191],[388,160],[378,142]]],
 ['europe','#b5c99c',[[477,257],[496,244],[501,224],[518,227],[528,211],[538,214],[548,186],[564,169],[573,180],[565,210],[576,230],[594,225],[615,242],[610,261],[593,278],[569,273],[556,294],[546,279],[536,288],[521,270],[500,280],[482,274]]],
 ['asia','#d2d7a7',[[595,238],[596,217],[622,204],[655,182],[689,184],[713,170],[751,183],[780,175],[808,190],[840,186],[866,203],[898,207],[913,225],[897,244],[879,250],[872,271],[850,281],[843,269],[834,292],[831,317],[818,327],[811,308],[791,321],[780,337],[792,357],[809,374],[800,390],[782,382],[766,358],[755,345],[730,338],[718,356],[698,373],[685,351],[681,329],[664,318],[650,296],[628,294],[622,274],[602,268],[608,250]]],
 ['africa','#ead99e',[[492,312],[522,301],[550,311],[581,309],[601,327],[609,350],[628,361],[641,359],[631,384],[610,399],[608,429],[594,448],[588,478],[567,507],[548,519],[531,489],[520,465],[505,451],[499,417],[482,397],[468,369],[473,339]]],
 ['japan','#c8d5a9',[[876,267],[887,258],[890,272],[882,281],[883,291],[873,301],[867,317],[859,324],[852,317],[866,300],[868,284]]],
 ['taiwan','#c8d5a9',[[846,335],[850,329],[852,338],[848,349],[843,350]]],
 ['indonesia','#c8d5a9',[[771,411],[787,417],[805,416],[819,425],[832,428],[841,435],[823,434],[809,430],[792,428],[778,425]]],
 ['madagascar','#d7d6a7',[[629,447],[635,444],[636,461],[629,482],[621,479],[624,462]]],
 ['australia','#cfcb91',[[815,478],[833,468],[846,476],[856,461],[871,462],[878,479],[899,488],[914,507],[909,530],[892,538],[873,532],[856,540],[843,528],[823,530],[810,512]]],
 ['new-zealand','#c8d5a9',[[939,532],[946,525],[948,536],[938,545],[938,553],[928,562],[924,556],[933,544]]],
 ['antarctica','#f9f6e8',[[170,639],[218,626],[263,631],[300,622],[347,629],[393,614],[447,625],[492,615],[540,628],[589,620],[627,629],[672,620],[720,634],[760,630],[813,642],[853,651],[804,667],[748,658],[689,669],[628,659],[575,670],[521,662],[465,673],[412,663],[359,674],[301,665],[249,670],[199,658]]],
 ['arctic','#f6f8ed',[[469,113],[496,100],[516,109],[543,100],[569,112],[601,109],[619,125],[593,138],[560,130],[536,140],[511,130],[487,135]]]
];
const labels=[['N. AMERICA',187,215,-7],['S. AMERICA',333,441,8],['GREENLAND',414,148,11],['EUROPE',548,252,-5],['AFRICA',551,365,5],['ASIA',729,229,-4],['AUSTRALIA',862,514,-5],['ANTARCTICA',513,648,-2],['ARCTIC',543,122,-3]];
// Reverse sides or portrait-free source details, keeping previous portrait guidance.
const accents=[
 ['USD-collage-reverse.jpg',170,239,100,49,-10,[140,20,440,250],[750,320]],
 ['EUR-collage-photo.jpg',504,269,69,38,7,[0,0,750,400],[750,400]],
 ['MGA-photo.jpg',516,403,81,43,-8,[0,0,700,320],[700,320]],
 ['CNY-collage-reverse.jpg',717,275,89,45,8,[0,0,686,346],[686,346]],
 ['JPY-collage-reverse.jpg',868,297,65,34,-9,[450,0,188,130],[638,350]],
 ['TWD-photo.jpg',827,348,63,34,9,[0,0,210,140],[633,279]],
 ['AUD.jpg',851,487,54,39,-7,[325,5,105,88],[431,204]]
];
const KOREA=[839,288];
const clamp=x=>Math.max(0,Math.min(1,x));
const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
const mix=(a,b,t)=>a+(b-a)*t;
function globe([x,y]){const u=(x-500)/480,v=(y-385)/285;return[500+u*315*Math.sqrt(Math.max(.55,1-.3*v*v)),440+v*300*Math.sqrt(Math.max(.55,1-.24*u*u))];}
const point=(p,t)=>{const a=globe(p);return[mix(a[0],p[0],t),mix(a[1],p[1],t)];};
function outline(points,t){return points.map((p,i)=>{const q=point(p,t);return(i?'L':'M')+q.map(n=>n.toFixed(2)).join(',');}).join(' ')+' Z';}
// A single perimeter stretches from wobbly round globe to a not-quite-straight map.
function ocean(t){const coords=[];for(let i=0;i<80;i++){const a=i/80*Math.PI*2,dx=Math.cos(a),dy=Math.sin(a),factor=1/Math.max(Math.abs(dx),Math.abs(dy));const rough=1+Math.sin(i*2.7)*.004;coords.push([mix(500+dx*315*rough,500+dx*factor*476,t),mix(440+dy*310*rough,383+dy*factor*291,t)]);}return coords.map((p,i)=>(i?'L':'M')+p.map(n=>n.toFixed(2)).join(',')).join(' ')+' Z';}
function markup(){return `<svg class="toy-svg" viewBox="120 30 760 780" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><defs><filter id="toy-paper-shadow" x="-30%" y="-40%" width="170%" height="190%"><feDropShadow dx="0" dy="4" stdDeviation="2" flood-color="#0d3545" flood-opacity=".22"/></filter><clipPath id="toy-sea-clip"><path data-ocean-clip/></clipPath></defs><ellipse class="toy-ground-shadow" cx="500" cy="768" rx="220" ry="13" fill="#174060" opacity=".09"/><path data-ocean-fill fill="#b8dbe1" stroke="#203c48" stroke-width="5.2" stroke-linejoin="round"/><path data-ocean-sketch fill="none" stroke="#203c48" stroke-width="1.4" opacity=".4"/><g clip-path="url(#toy-sea-clip)">${continents.map(([id,color])=>`<path data-land="${id}" fill="${color}" stroke="#2b443f" stroke-width="3.2" stroke-linejoin="round" stroke-linecap="round"/>`).join('')}<g class="toy-waves">${[[385,300],[426,520],[720,502],[140,407]].map(([x,y],i)=>`<path data-wave="${i}" data-x="${x}" data-y="${y}" fill="none" stroke="#7ca7af" stroke-width="2.7" stroke-linecap="round" d="M0 0q9 8 18 0t18 0t18 0"/>`).join('')}</g>${labels.map(([text],i)=>`<text data-map-label="${i}" text-anchor="middle" class="toy-map-label">${text}</text>`).join('')}${accents.map(([file,x,y,w,h,angle,view,size],i)=>`<g data-cash-accent="${i}" filter="url(#toy-paper-shadow)"><rect x="${-w/2-1}" y="${-h/2-1}" width="${w+2}" height="${h+2}" fill="#fffdf4"/><svg x="${-w/2}" y="${-h/2}" width="${w}" height="${h}" viewBox="${view.join(' ')}" preserveAspectRatio="xMidYMid slice" overflow="hidden"><image href="${cash+file}" width="${size[0]}" height="${size[1]}"/></svg><path d="M${-w/2+8} ${-h/2-3}l19 2-1 6-19-2z" fill="#fffaf1" opacity=".65"/></g>`).join('')}<g data-korea-pin><path d="m0-14 9 7-4 11-9 8-7-8 1-13z" fill="#FDED80" stroke="#2b443f" stroke-width="2.5"/><circle cx="11" cy="8" r="2.8" fill="#FDED80"/><circle cx="17" cy="10" r="2" fill="#FDED80"/><text x="0" y="39" text-anchor="middle" class="toy-korea-label">KOREA</text></g></g><g data-hero-note filter="url(#toy-paper-shadow)"><rect x="-361" y="-166" width="362" height="167" fill="#fffdf4" stroke="#fff" stroke-width="2"/><image href="${cash}KRW.jpg" x="-360" y="-165" width="360" height="165" preserveAspectRatio="none"/><path d="M-360-165H0V0" fill="none" stroke="#ffffff" stroke-width="2" opacity=".7"/></g><g data-ink-spark stroke="#ba9d47" stroke-width="4" stroke-linecap="round" opacity="0"><path d="M-21-22l-9-9M5-30l2-14M29-15l14-5M31 13l13 8"/></g></svg>`;}
function attach({root,expanded,onExpand,onStart,strings}){
 const button=root.querySelector('[data-earth-button]');button.innerHTML=markup();const svg=button.querySelector('svg'),hint=root.querySelector('[data-earth-hint]'),replay=root.querySelector('[data-earth-replay]');
 const landNodes=[...svg.querySelectorAll('[data-land]')],labelNodes=[...svg.querySelectorAll('[data-map-label]')],note=svg.querySelector('[data-hero-note]'),pin=svg.querySelector('[data-korea-pin]'),spark=svg.querySelector('[data-ink-spark]');
 let raf=0,disposed=false,phase=expanded?'map':'globe';
 function draw(t,noteScale=1){
  const sea=ocean(t);svg.querySelector('[data-ocean-fill]').setAttribute('d',sea);svg.querySelector('[data-ocean-clip]').setAttribute('d',sea);svg.querySelector('[data-ocean-sketch]').setAttribute('d',sea);svg.querySelector('[data-ocean-sketch]').setAttribute('transform',`translate(${mix(3,1,t)} ${mix(2,3,t)})`);
  landNodes.forEach((node,i)=>node.setAttribute('d',outline(continents[i][2],t)));
  labelNodes.forEach((node,i)=>{const [,x,y,angle]=labels[i],[px,py]=point([x,y],t);node.setAttribute('transform',`translate(${px} ${py}) rotate(${angle})`);});
  svg.querySelectorAll('[data-wave]').forEach(n=>{const p=point([+n.dataset.x,+n.dataset.y],t);n.setAttribute('transform',`translate(${p.join(' ')})`);});
  svg.querySelectorAll('[data-cash-accent]').forEach((node,i)=>{const [,x,y,,,angle]=accents[i],p=point([x,y],t);node.setAttribute('transform',`translate(${p.join(' ')}) rotate(${angle}) scale(${mix(.83,1,t)})`);});
  const [kx,ky]=point(KOREA,t);pin.setAttribute('transform',`translate(${kx} ${ky})`);note.setAttribute('transform',`translate(${kx} ${ky}) rotate(${mix(20,-5,1-noteScale)}) scale(${noteScale})`);note.setAttribute('opacity',noteScale<.06?'0':'1');spark.setAttribute('transform',`translate(${kx} ${ky})`);
  const box=[mix(120,0,t),mix(30,75,t),mix(760,1000,t),mix(780,625,t)];svg.setAttribute('viewBox',box.join(' '));
 }
 function setPhase(p){phase=p;root.dataset.phase=p;button.setAttribute('aria-expanded',p==='map'?'true':'false');button.setAttribute('aria-label',p==='map'?strings.ready:strings.open);button.setAttribute('aria-busy',p==='opening'?'true':'false');hint.textContent=p==='map'?strings.ready:p==='opening'?strings.opening:strings.open;replay.hidden=p!=='map';}
 function open(){if(phase==='opening')return;if(phase==='map'){onStart();return;}onExpand();setPhase('opening');
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){draw(1,0);setPhase('map');return;}
  const start=performance.now();const tick=now=>{if(disposed)return;const elapsed=now-start,progress=ease(clamp((elapsed-230)/1030)),shrink=1-Math.pow(clamp(elapsed/410),1.6);draw(progress,Math.max(.001,shrink));spark.setAttribute('opacity',elapsed>310&&elapsed<650?String(Math.sin((elapsed-310)/340*Math.PI)): '0');if(elapsed<1290)raf=requestAnimationFrame(tick);else{draw(1,0);setPhase('map');}};raf=requestAnimationFrame(tick);
 }
 button.addEventListener('click',open);
 replay.addEventListener('click',()=>{cancelAnimationFrame(raf);draw(0,1);setPhase('globe');raf=requestAnimationFrame(open);});
 draw(expanded?1:0,expanded?0:1);setPhase(phase);
 return ()=>{disposed=true;cancelAnimationFrame(raf);};
}
window.PlayfulEarth={attach};
})();
