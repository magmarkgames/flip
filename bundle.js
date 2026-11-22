
'use strict';
const $=id=>document.getElementById(id), fmt=n=>n.toLocaleString('de-DE'), KEY='flip-v0.1-save', MAX_VISIBLE=Math.min(window.innerWidth,window.innerHeight)<520?8:12;let state=fresh(),busy=false,toastTimer,audio;
try{const raw=localStorage.getItem(KEY);if(raw)state=validate(JSON.parse(raw));}catch(e){$('saveError').hidden=false;}
function save(){if(state.testMode)return;try{localStorage.setItem(KEY,JSON.stringify(state));$('saveError').hidden=true;}catch(e){$('saveError').hidden=false;}}
const ICONS={critical:'<path d="m13 2-9 12h7l-1 8 10-12h-7z"/>',golden:'<circle cx="12" cy="12" r="8"/><path d="M12 7v10m-3-7h6m-6 4h6"/>',duplication:'<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',survival:'<path d="M12 20 4.8 13A4.6 4.6 0 0 1 12 7a4.6 4.6 0 0 1 7.2 6Z"/>',protection:'<path d="m12 3 8 3v6c0 4-4 7-8 9-4-2-8-5-8-9V6z"/><path d="m9 12 2 2 4-4"/>',lock:'<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',sound:'<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16 9a4 4 0 0 1 0 6m2-8a7 7 0 0 1 0 10"/>',mute:'<path d="M4 9v6h4l5 4V5L8 9z"/><path d="m16 9 5 6m0-6-5 6"/>'};
Object.assign(ICONS,{fast:'<circle cx="12" cy="13" r="8"/><path d="M12 9v5l3 2M9 2h6m-3 0v3"/>',twin:'<rect x="7" y="7" width="13" height="13" rx="2"/><path d="M16 7V4H4v12h3m7-5v6m-3-3h6"/>',second:'<path d="M4 12a8 8 0 1 0 2-5L3 10m0-6v6h6"/>',skip:'<path d="m4 12 8-8 8 8M4 20l8-8 8 8"/>'});
Object.assign(ICONS,{
 chain:'<path d="M4 7h8m-3-3 3 3-3 3M12 17h8m-3-3 3 3-3 3M4 17h4l3-10h9"/>',
 triple:'<rect x="2" y="3" width="13" height="13" rx="2"/><rect x="6" y="6" width="13" height="13" rx="2"/><rect x="10" y="9" width="12" height="12" rx="2"/>',
 goldenTouch:'<path d="m12 3 2.6 6.4L21 12l-6.4 2.6L12 21l-2.6-6.4L3 12l6.4-2.6L12 3Z"/>',
 revival:'<path d="M12 3a9 9 0 1 1-8.5 12M3 3v6h6M12 8v8M8 12h8"/>',
 memory:'<path d="M4 6a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v14l-8-4-8 4V6Z"/>',
 hotBoost:'<path d="M12 22c-5 0-8-3-8-8 0-4 4-7 4-10 1 2 2 3 3 4 2-3 3-5 3-7 5 5 7 9 7 13 0 5-4 8-9 8Z"/>',
 lastFlame:'<path d="M12 22c-4 0-7-3-7-7 0-4 3-7 5-10 0 4 2 5 3 6 2-2 2-6 2-9 4 5 5 9 5 13 0 4-3 7-8 7Z"/><path d="m9 16 2 2 4-4"/>',
 coldSpawn:'<path d="M12 2v20M3 7l18 10M3 17 21 7"/><path d="M6 19v-4m-2 2h4M18 4v4m-2-2h4"/>',
 comebackBoost:'<path d="M4 15a8 8 0 1 0 0-6L2 12h7"/><path d="m8 11 4 5 5-8"/>',
 coinValue:'<circle cx="12" cy="12" r="9"/><path d="M12 7v10m-3-7 3-3 3 3"/>',
 criticalPower:'<path d="m13 2-9 12h7l-1 8 10-12h-7z"/><path d="M18 2v3M22 4h-3"/>'
});
const icon=n=>`<svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[n]}</svg>`;
const COIN_SKINS={classic:{crown:'<path d="M12 22 28 35 42 13 56 35 72 22 65 55H19L12 22ZM20 61H64V68H20Z"/><circle cx="12" cy="19" r="3"/><circle cx="42" cy="10" r="3"/><circle cx="72" cy="19" r="3"/>',skull:'<path fill-rule="evenodd" d="M42 10C24 10 12 22 12 39c0 12 7 20 17 24v10h7V62h4v11h5V62h4v11h7V63c10-4 16-12 16-24C72 22 60 10 42 10ZM23 38c0-6 4-10 10-10s10 4 10 10-4 10-10 10-10-4-10-10Zm22 0c0-6 4-10 10-10s10 4 10 10-4 10-10 10-10-4-10-10Zm-3 11-5 10h10Z"/>'}};
const COSMETIC_SYMBOLS={
 crown:COIN_SKINS.classic.crown,skull:COIN_SKINS.classic.skull,
 bolt:'<path d="M46 4 20 46h24L37 80 67 34H44Z"/>',
 flame:'<path d="M47 5C48 25 32 28 36 41 26 36 28 28 28 21 14 37 11 49 16 62c7 20 36 24 49 6 13-19 1-38-18-63ZM42 48c8 7 11 13 9 20-3 8-16 7-19-1-2-7 5-12 10-19Z" fill-rule="evenodd"/>',
 snowflake:'<path d="M39 7h6v70h-6zM8 39h68v6H8z"/><path d="m15 18 4-4 50 50-4 4zm50-4 4 4-50 50-4-4z"/><path d="M26 8 42 20 58 8l3 5-19 15-19-15zm0 68 16-12 16 12 3-5-19-15-19 15Z"/>',
 star:'<path d="M42 3 53 30 82 32 60 50 67 79 42 63 17 79 24 50 2 32 31 30Z"/>',
 sun:'<circle cx="42" cy="42" r="20"/><path d="M37 2h10v13H37zM37 69h10v13H37zM2 37h13v10H2zM69 37h13v10H69z"/><path d="m15 8 9 9-7 7-9-9zm52 0 7 7-9 9-7-7zM8 69l9-9 7 7-9 9zm57-9 9 9-7 7-9-9z"/>',
 moon:'<path d="M58 4A35 35 0 1 0 79 62 34 34 0 0 1 58 4Z"/>'
};
function coinSymbol(name){return `<svg class="coin-emblem" viewBox="0 0 84 84" aria-hidden="true" focusable="false">${COSMETIC_SYMBOLS[name]||COSMETIC_SYMBOLS.crown}</svg>`;}
function paintCoin(coin,options){if(!coin)return;const c=cleanCosmetics(options);coin.dataset.frame=c.frame;coin.dataset.material=c.material;coin.querySelector('.heads .coin-emblem')?.replaceWith(svgFromSymbol(c.heads));coin.querySelector('.tails .coin-emblem')?.replaceWith(svgFromSymbol(c.tails));}
function svgFromSymbol(n){const template=document.createElement('template');template.innerHTML=coinSymbol(n);return template.content.firstElementChild;}

function makeCoin(mini=false,heads=true,golden=false){const el=document.createElement('div');el.className='coin'+(mini?' mini':'')+(golden?' golden':'')+(heads?'':' is-tails');el.setAttribute('aria-hidden','true');const edges=mini?28:56;el.innerHTML=Array.from({length:edges},(_,i)=>`<i class="edge-segment" style="--segment-angle:${i*360/edges}deg"></i>`).join('')+`<div class="face heads">${coinSymbol(mini?'skull':'crown')}</div><div class="face tails">${coinSymbol(mini?'crown':'skull')}</div>`;if(!mini)paintCoin(el,state.cosmetics);return el;}
$('coinButton').append(makeCoin(false,state.mainHeadsLast));
const tabletop=$('tabletop'), mainSlot=$('coinButton').parentElement;const auraLayer=document.createElement('div');auraLayer.className='cosmetic-aura-layer';auraLayer.setAttribute('aria-hidden','true');mainSlot.prepend(auraLayer);
let board={w:0,h:0,main:120,bonus:48};
function measure(){const w=tabletop.clientWidth,h=tabletop.clientHeight;if(!w||!h)return false;const main=Math.min(190,w*.48,h*.53),bonus=Math.min(80,Math.max(36,main*.44),h*.32);board={w,h,main,bonus};tabletop.style.setProperty('--main-size',main+'px');tabletop.style.setProperty('--bonus-size',bonus+'px');return true;}
const rand=(a,b)=>a+Math.random()*(b-a);
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
function radius(slot){return slot===mainSlot?board.main/2:board.bonus/2;}
function position(slot){return {x:Number(slot.dataset.x)||board.w/2,y:Number(slot.dataset.y)||board.h/2,r:radius(slot)};}
function place(slot,p){slot.dataset.x=p.x;slot.dataset.y=p.y;slot.style.left=p.x+'px';slot.style.top=p.y+'px';}
function angle(slot){return Number(slot.dataset.angle)||0;}
function setAngle(slot,a){slot.dataset.angle=a;slot.style.setProperty('--angle',a+'deg');}
function pick(r,occupied,old=null,main=false){
  const pad=r+Math.min(12,r*.32),minX=pad,maxX=board.w-pad,minY=pad,maxY=board.h-pad-8;
  if(maxX<minX||maxY<minY)return null;
  let best=null,score=-Infinity;
  const target=Math.min(board.w,board.h)*(main?.20:.16);
  // Random trials plus a short deterministic grid search: no per-trial array allocations.
  for(let i=0;i<300;i++){
    const x=i<160?rand(minX,maxX):minX+(maxX-minX)*((i-160)%14)/13;
    const y=i<160?rand(minY,maxY):minY+(maxY-minY)*Math.floor((i-160)/14)/9;
    let clear=100;
    for(let j=0;j<occupied.length;j++){
      const p=occupied[j];const dist=Math.hypot(x-p.x,y-p.y)-r-p.r-9;
      if(dist<clear)clear=dist;
      if(clear<0)break;
    }
    if(clear<0)continue;
    const distance=old?Math.hypot(x-old.x,y-old.y):0;
    const center=main?Math.hypot(x-board.w/2,y-board.h/2):0;
    const weight=old?-Math.abs(distance-target)-center*.16:Math.min(clear,25)-center*.35;
    if(weight>score){best={x,y,r};score=weight;}
  }
  return best;
}
function makeSlot(c,i,heads=c.heads??false){const slot=document.createElement('button');slot.type='button';slot.className='bonus-slot';slot.dataset.index=i;slot.setAttribute('aria-label',c.golden?'Goldene Bonusmünze':'Bonusmünze');slot.tabIndex=-1;slot.append(makeCoin(true,heads,c.golden));updateBadge(slot,c);$('bonuses').append(slot);return slot;}
function updateCoinType(slot,c){const coin=slot.querySelector('.coin');if(!coin)return;coin.classList.toggle('golden',!!c.golden);slot.setAttribute('aria-label',c.golden?'Goldene Bonusmünze':'Bonusmünze');}
function updateBadge(slot,c){updateCoinType(slot,c);slot.querySelector('.bonus-mult')?.remove();if(c.streak>=2){const badge=document.createElement('span');badge.className='bonus-mult';badge.textContent='×'+fmt(c.streak);slot.append(badge);}}
function updateBonusLabel(){const shown=[...$('bonuses').children].filter(s=>!s.classList.contains('lost')).length,hidden=Math.max(0,state.bonus-shown),el=$('bonusLabel');el.hidden=!state.bonus;el.textContent='◉ '+fmt(state.bonus)+(hidden>0?'  ·  +'+fmt(hidden):'');el.disabled=true;el.classList.remove('more-coins');el.setAttribute('aria-label',fmt(state.bonus)+' aktive Bonusmünzen; alle werden mitgeworfen');}
function renderBonuses(){const box=$('bonuses');box.replaceChildren();if(!measure())return;const center={x:board.w/2,y:board.h/2,r:board.main/2};place(mainSlot,center);setAngle(mainSlot,0);const occupied=[center];for(let i=0;i<Math.min(state.bonus,MAX_VISIBLE);i++){const p=pick(board.bonus/2,occupied);if(!p)break;const slot=makeSlot(state.bonusCoins[i],i);place(slot,p);setAngle(slot,rand(-55,55));occupied.push(p);}updateBonusLabel();}
function relayout(){if(busy||!measure())return;const main=pick(board.main/2,[],position(mainSlot),true)||{x:board.w/2,y:board.h/2,r:board.main/2};place(mainSlot,main);const occupied=[main];for(const slot of [...$('bonuses').children]){const p=pick(board.bonus/2,occupied);if(!p){slot.remove();continue;}place(slot,p);occupied.push(p);}const visible=new Set([...$('bonuses').children].map(s=>Number(s.dataset.index)));for(let i=0;i<state.bonus&&visible.size<MAX_VISIBLE;i++){if(visible.has(i))continue;const p=pick(board.bonus/2,occupied);if(!p)break;const slot=makeSlot(state.bonusCoins[i],i);place(slot,p);setAngle(slot,rand(-55,55));occupied.push(p);visible.add(i);}updateBonusLabel();}
const STREAK_FLAME='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22c-4.4 0-7-3-7-7 0-3 1.7-5.7 4-7-.3 2.5 1 3.5 2 4 2-3 2.2-6.5 1-10 5 4 7 8 7 13 0 4-2.6 7-7 7Z"/><path d="M12 22c-2 0-3-1.6-3-3.2 0-1.5 1-3 3-4.8 2 1.8 3 3.3 3 4.8 0 1.6-1 3.2-3 3.2Z"/></svg>';
const STREAK_ICE='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2v20M3.34 7l17.32 10M3.34 17 20.66 7M9 4l3 3 3-3M9 20l3-3 3 3M4 10l4-1-1-4M17 19l-1-4 4-1M4 14l4 1-1 4M17 5l-1 4 4 1"/></svg>';
function renderNumbers(){
 $('balance').textContent=fmt(state.coins);const cold=state.cold>0,n=cold?state.cold:state.streak,t=cold?coldTier(n):tier(n),color=t?.color??(cold?'#a4cfe9':'#ffbf75');const metric=$('streak').parentElement;
 $('streak').textContent=fmt(n);$('streak').classList.toggle('hot',n>=2);metric.querySelector('svg').outerHTML=cold?STREAK_ICE:STREAK_FLAME; $('streak').setAttribute('aria-label',cold?'Aktuelle Totenkopfserie':'Aktuelle Kronenserie');metric.title=cold?(n>=5?'Nächste Krone ×'+fmt(n):'Totenkopfserie'):(t?`${t.name} · Duplication ×${t.boost}`:'Aktuelle Kronenserie');
 const badge=$('mult');badge.hidden=n<2;badge.classList.toggle('cold',cold);badge.classList.toggle('charged',cold&&n>=5);badge.innerHTML=(cold?STREAK_ICE:STREAK_FLAME)+'<span class="streak-value">'+(cold&&n<5?fmt(n):'×'+fmt(n))+'</span>'+(cold&&n>=5?'<small>NEXT</small>':'');badge.setAttribute('aria-label',cold?(n>=5?'Comeback: nächster erfolgreicher Hauptwurf ×'+fmt(n):fmt(n)+' Totenköpfe in Folge'):'Multiplikator ×'+fmt(n));
 $('best').textContent=fmt(state.stats.bestStreak);$('coinButton').classList.toggle('streak',!cold&&n>=2);for(const e of [mainSlot,metric]){e.dataset.tier=n>=2?(t?.n??2):0;e.dataset.cold=String(cold);e.style.setProperty('--streak-color',color);}
}

const BRANCHES=[
 {id:'spawn',name:'Vermehrung',color:'#8ccaff',nodes:[{id:'duplication',x:140,y:12},{id:'twin',x:66,y:132,parent:'duplication'},{id:'golden',x:214,y:132,parent:'duplication'},{id:'chain',x:47,y:265,parent:'twin'},{id:'triple',x:142,y:265,parent:'twin'},{id:'goldenTouch',x:233,y:265,parent:'golden'}]},
 {id:'survival',name:'Überleben',color:'#a4e0a6',nodes:[{id:'survival',x:140,y:12},{id:'second',x:64,y:132,parent:'survival'},{id:'revival',x:215,y:132,parent:'survival'},{id:'memory',x:215,y:265,parent:'survival'}]},
 {id:'streak',name:'Streaks',color:'#ffc078',nodes:[{id:'protection',x:140,y:12},{id:'skip',x:54,y:132,parent:'protection'},{id:'hotBoost',x:220,y:132,parent:'protection'},{id:'lastFlame',x:54,y:265,parent:'protection'},{id:'coldSpawn',x:220,y:265,parent:'protection'},{id:'comebackBoost',x:220,y:398,parent:'coldSpawn'}]},
 {id:'special',name:'Spezial',color:'#d4a2ef',nodes:[{id:'fast',x:140,y:12},{id:'coinValue',x:67,y:132,parent:'fast'},{id:'critical',x:215,y:132,parent:'fast'},{id:'criticalPower',x:215,y:265,parent:'critical'}]}
];
// v0.18: A radial, explorable upgrade tree with four independent directions.
const TREE_WIDTH=1530,TREE_HEIGHT=1510,TREE_CENTER={x:760,y:740};
const RADIAL_POINTS={
  duplication:[760,480],twin:[615,350],golden:[905,350],chain:[480,195],triple:[700,170],goldenTouch:[1035,205],
  survival:[1040,710],second:[1220,565],revival:[1220,785],memory:[1400,900],
  protection:[760,965],skip:[610,1100],hotBoost:[905,1105],lastFlame:[485,1260],coldSpawn:[1000,1255],comebackBoost:[1120,1380],
  fast:[485,710],coinValue:[315,575],critical:[315,830],criticalPower:[135,965]
};
const RADIAL_LABELS={spawn:[760,420],survival:[1180,675],streak:[760,1045],special:[355,665]};
const treePoint=id=>{const [x,y]=RADIAL_POINTS[id];return {x,y};};
let selectedUpgrade=null,treeZoom=Math.max(.48,Math.min(.85,(window.innerWidth-44)/575)),treeOpened=false,storedState=null;
const effect=(id,l)=>id==='fast'?'−'+(l*5)+' %':id==='coinValue'?'+'+l+' Coin':id==='criticalPower'?'×'+(10+l):id==='hotBoost'?'+'+(l*5)+' %':id==='coldSpawn'?'+'+(l*2)+' %':id==='comebackBoost'?'+'+l+'×':l+' %';
function requirements(r){let a=[];if(state.stats.earned<r.unlock&&!state.testMode)a.push(fmt(state.stats.earned)+' / '+fmt(r.unlock)+' insgesamt verdiente Coins');if(r.requires&&state.levels[r.requires[0]]<r.requires[1]&&!state.testMode){const p=RULE_BY_ID[r.requires[0]];a.push(p.name+': '+effect(p.id,state.levels[p.id])+' / '+effect(p.id,r.requires[1]));}return a;}
function treeConnections(){
 const lines=[];
 const draw=(x1,y1,x2,y2,color,opacity)=>{
   const dx=x2-x1,dy=y2-y1;
   return `<path d="M${x1} ${y1} C${x1+dx*.38} ${y1+dy*.12} ${x2-dx*.38} ${y2-dy*.12} ${x2} ${y2}" stroke="${color}" stroke-opacity="${opacity}"/>`;
 };
 for(const branch of BRANCHES){
   const first=treePoint(branch.nodes[0].id);
   lines.push(draw(TREE_CENTER.x,TREE_CENTER.y,first.x,first.y+28,branch.color,.77));
   for(const n of branch.nodes){
     if(!n.parent)continue;
     const a=treePoint(n.parent),b=treePoint(n.id);
     lines.push(draw(a.x,a.y+28,b.x,b.y+28,branch.color,.6));
   }
 }
 return `<svg class="tree-wires" width="${TREE_WIDTH}" height="${TREE_HEIGHT}" viewBox="0 0 ${TREE_WIDTH} ${TREE_HEIGHT}" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">${lines.join('')}</svg>`;
}
function renderShop(){
 const el=$('upgrades');const viewport=$('treeViewport'),left=viewport.scrollLeft,top=viewport.scrollTop;
 $('treeBalance').textContent='◉ '+fmt(state.coins);
 $('testToggle').textContent=state.testMode?'Testmodus beenden':'Testmodus';$('testToggle').classList.toggle('is-testing',!!state.testMode);
 el.innerHTML=`<div class="tree-canvas">${treeConnections()}<div class="tree-root" style="left:${TREE_CENTER.x-27}px;top:${TREE_CENTER.y-27}px">♛</div>`+
 BRANCHES.map(branch=>`<div class="tree-branch" style="--branch:${branch.color}"><div class="branch-name" style="left:${RADIAL_LABELS[branch.id][0]}px;top:${RADIAL_LABELS[branch.id][1]}px">${branch.name}</div>`+
 branch.nodes.map(n=>{const r=RULE_BY_ID[n.id],l=state.levels[n.id],open=unlocked(state,r),max=l>=maxLevel(r),afford=open&&!busy&&!max&&(state.testMode||state.coins>=cost(n.id,l)),progress=Math.round(l/maxLevel(r)*100);
 return `<button class="tree-node ${open?'available':'locked-node'} ${afford?'afford':''} ${max?'maxed':''}" style="left:${treePoint(n.id).x}px;top:${treePoint(n.id).y}px;--progress:${progress}%" data-node="${n.id}" aria-label="${r.name}: ${effect(n.id,l)}${open?'':', gesperrt'}"><span class="node-circle">${icon(open||l>0?n.id:'lock')}<b>${max?'MAX':open?effect(n.id,l):'🔒'}</b></span><span class="node-name">${r.name}</span></button>`;}).join('')+'</div>').join('')+'</div>';
 applyZoom();viewport.scrollLeft=left;viewport.scrollTop=top;renderDetail();
}
function renderDetail(){
 const box=$('treeDetail');if(!selectedUpgrade){box.hidden=true;return;}
 const r=RULE_BY_ID[selectedUpgrade],l=state.levels[r.id],open=unlocked(state,r),max=l>=maxLevel(r),p=cost(r.id,l),branch=BRANCHES.find(b=>b.id===r.group);
 box.hidden=false;box.style.setProperty('--branch',branch.color);
 box.innerHTML=`<div class="detail-panel"><button class="detail-close" data-detail-close aria-label="Schließen">×</button><div class="detail-icon">${icon(r.id)}</div><h3>${r.name}</h3><p>${r.desc}</p><div class="detail-effect">${effect(r.id,l)} ${max?'':`<span>→ ${effect(r.id,l+1)}</span>`}</div><small>Level ${l} / ${maxLevel(r)}</small><div class="tree-progress"><i style="width:${l/maxLevel(r)*100}%"></i></div>${r.id==='fast'?`<p>Beispiel bei 2,5 s Basis: ${(2.5*fastFactor(state)).toFixed(2).replace('.',',')} s ${max?'':`→ ${(2.5*(1-(l+1)*.05)).toFixed(2).replace('.',',')} s`}</p>`:''}${!open?`<div class="tree-requirements"><b>Freischaltung</b>${requirements(r).map(t=>`<div>${t}</div>`).join('')}</div>`:''}<button class="detail-buy" data-tree-buy="${r.id}" ${!open||max||busy||(!state.testMode&&state.coins<p)?'disabled':''}>${max?'MAX LEVEL':!open?'Gesperrt':state.testMode?'Test: +1 Level':`Verbessern · ${fmt(p)} ◉`}</button>${state.testMode&&!max?`<button class="detail-testmax" data-tree-max="${r.id}">Im Test auf MAX setzen</button>`:''}${state.testMode?'<div class="test-hint">Nur zum Ausprobieren · Änderungen werden nicht gespeichert</div>':''}</div>`;
}
function applyZoom(){const el=$('upgrades');el.style.width=(TREE_WIDTH*treeZoom)+'px';el.style.height=(TREE_HEIGHT*treeZoom)+'px';el.style.setProperty('--tree-scale',treeZoom);$('zoomReset').textContent=Math.round(treeZoom*100)+'%';}
function changeZoom(z){
 const v=$('treeViewport'),cx=(v.scrollLeft+v.clientWidth/2)/treeZoom,cy=(v.scrollTop+v.clientHeight/2)/treeZoom;
 treeZoom=Math.max(.48,Math.min(1.8,z));applyZoom();
 v.scrollLeft=cx*treeZoom-v.clientWidth/2;v.scrollTop=cy*treeZoom-v.clientHeight/2;
}
function centerTree(animated=false){
 const v=$('treeViewport');v.scrollTo({left:Math.max(0,TREE_CENTER.x*treeZoom-v.clientWidth/2),top:Math.max(0,TREE_CENTER.y*treeZoom-v.clientHeight/2),behavior:animated?'smooth':'instant'});
}
function jumpBranch(id){
 const b=BRANCHES.find(b=>b.id===id);if(!b)return;
 const n=treePoint(b.nodes[0].id),v=$('treeViewport');
 v.scrollTo({left:Math.max(0,n.x*treeZoom-v.clientWidth/2),top:Math.max(0,(n.y+28)*treeZoom-v.clientHeight/2),behavior:'smooth'});
}
function toggleTestMode(){
 if(busy)return;
 if(!state.testMode){storedState=state;state=JSON.parse(JSON.stringify(state));state.testMode=true;state.coins=1000000000000;state.stats.earned=Math.max(state.stats.earned,1000000000000);}
 else{state=storedState;storedState=null;}
 save();selectedUpgrade=null;renderAll();$('testIndicator').hidden=!state.testMode;
 toast(state.testMode?'Testmodus aktiv · kein Speichern':'Zurück zu deinem echten Spielstand');
}

function renderResult(last=state.last){const el=$('result');el.classList.remove('flash');if(!last){el.textContent='Wische über den Bildschirm';el.className='neutral';$('resultDetail').textContent='';return;}el.textContent=(last.critical?'ϟ ':'')+'+'+fmt(last.gain);el.className=last.gain?'':'neutral';let parts=[];const t=TIERS.find(x=>x.n===last.milestone);const detail=$('resultDetail');const iceEvent=last.coldMilestone||last.comeback>1;const eventColor=iceEvent?'#a5eaff':t?.color??'#ffe3a1';detail.classList.toggle('event',!!t||!!last.critical||!!iceEvent);detail.style.setProperty('--event-color',last.critical?'#ffd0f0':eventColor);el.style.setProperty('--event-color',eventColor);if(last.comeback>1){el.classList.add('milestone');parts.push('COMEBACK ×'+fmt(last.comeback));}if(last.coldSpawn)parts.push('Cold Streak · +'+last.coldSpawn+' Bonus');if(t){el.classList.add('milestone');parts.push(t.name+(t.n===15?' · ×5 Bonus':'') );}if(last.critical){el.classList.add('critical');parts.unshift('CRITICAL ×'+criticalFactor(state)+(last.criticalCount>1?' · '+last.criticalCount+' Treffer':''));}if(last.triple)parts.push('Triple Spawn · +3');else if(last.spawned&&!last.coldSpawn&&!last.chainCount)parts.push(last.spawnCount>=2?'Bonus +'+last.spawnCount:last.golden?'Goldbonus!':'Bonus +1');if(last.chainCount)parts.push('Kettenreaktion +'+last.chainCount);if(last.goldenTouchCount)parts.push('Golden Touch '+last.goldenTouchCount);if(last.revivalCount)parts.push('Revival '+last.revivalCount);if(last.memoryCount)parts.push('Memory '+last.memoryCount);if(last.lastFlame)parts.push('Last Flame');if(last.coldExtra)parts.push('Cold Spawn +1');if(last.secondChance)parts.push('Second Chance');if(last.skipped)parts.push('Streak +2');if(last.lost)parts.push('−'+last.lost+' Bonus');if(last.saved)parts.push(last.saved+' gerettet');if(last.protectedStreak)parts.push('Serie geschützt');$('resultDetail').textContent=parts.join(' · ');if(busy){void el.offsetWidth;el.classList.add('flash');$('resultDetail').classList.remove('flash');void $('resultDetail').offsetWidth;$('resultDetail').classList.add('flash');}else{el.textContent='Wische über den Bildschirm';el.className='neutral';$('resultDetail').textContent='';}}
function renderStats(){if($('stats').hidden)return;const t=state.stats;const total=t.mainHeads+t.mainTails+t.bonusHeads+t.bonusTails;const group=items=>`<div class="stat-group">${items.map(([n,v])=>`<div class="stat"><span>${n}</span><strong>${typeof v==='number'?fmt(v):v}</strong></div>`).join('')}</div>`;$('statContent').innerHTML=group([['Coins insgesamt verdient',t.earned],['Größter Gewinnrekord',t.bestRound],['Beste Kopfserie',t.bestStreak],['Meiste aktive Bonusmünzen',t.bestBonus]])+group([['Hauptmünzenwürfe (inkl. Wiederholungen)',t.rounds+t.secondChances],['Münzwürfe insgesamt',total+t.secondChances],['Kopf insgesamt',t.mainHeads+t.bonusHeads],['Zahl insgesamt',t.mainTails+t.bonusTails+t.secondChances],['Kopfquote Hauptmünze',t.rounds?`${(100*t.mainHeads/(t.rounds+t.secondChances)).toLocaleString('de-DE',{maximumFractionDigits:1})} %`:'–'],['Hauptmünze: Kopf',t.mainHeads],['Hauptmünze: Zahl',t.mainTails+t.secondChances],['Bonusmünzen: Kopf',t.bonusHeads],['Bonusmünzen: Zahl',t.bonusTails]])+group([['Bonusmünzen erzeugt',t.spawned],['Bonusmünzen verloren',t.lost],['Bonusmünzen gerettet',t.saved],['Kopfserien geschützt',t.protected],['Twin Spawns',t.twins],['Second Chances',t.secondChances],['Streak Skips',t.skips],['Critical Flips',t.criticals],['Streak-Meilensteine',t.milestones]])+group([['Längste Totenkopfserie',t.bestCold],['Bonusmünzen durch Kälteserien',t.coldSpawns],['Comebacks',t.comebacks],['Höchster Comeback-Multiplikator',t.bestComeback?'×'+fmt(t.bestComeback):'–']])+group([['Kettenreaktionen',t.chains],['Triple Spawns',t.triples],['Silber zu Gold verwandelt',t.goldenTouches],['Wiederbelebungen',t.revivals],['Memory aktiviert',t.memories],['Last Flame aktiviert',t.lastFlames],['Extra Cold-Spawns',t.coldExtras]]);}
const MINT_CHOICES={
 frame:[['plain','Standard','Schlichter Prägerand','◯'],['frost','Eisrahmen','Eiskristalle · Cold Streak','❄'],['fire','Feuerrand','Glühende Kante · Hot Streak','♨'],['lightning','Blitzrand','Elektrischer Ring · Critical','ϟ'],['royal','Königsrand','Vergoldete Verzierung','♛']],
 material:[['copper','Kupfer','Klassischer warmer Ton','●'],['silver','Silber','Kühler metallischer Glanz','●'],['gold','Gold','Edles Goldfinish','●'],['obsidian','Obsidian','Dunkles, mattes Metall','●'],['ice','Froststahl','Helles eisblaues Metall','●']],
 heads:[['crown','Krone','Klassisches Gewinnsymbol','♛'],['skull','Totenkopf','Düstere Prägung','☠'],['bolt','Blitz','Elektrische Prägung','ϟ'],['flame','Flamme','Heißer Streak','♨'],['snowflake','Schneeflocke','Eiskalte Prägung','❄'],['star','Stern','Seltener Glücksstern','✦'],['moon','Mond','Nachtmotiv','☾'],['sun','Sonne','Strahlendes Motiv','☀']],
 tails:[['skull','Totenkopf','Klassisches Nietsymbol','☠'],['crown','Krone','Königliche Prägung','♛'],['bolt','Blitz','Elektrische Prägung','ϟ'],['flame','Flamme','Heiße Prägung','♨'],['snowflake','Schneeflocke','Eiskalte Prägung','❄'],['star','Stern','Seltener Glücksstern','✦'],['moon','Mond','Nachtmotiv','☾'],['sun','Sonne','Strahlendes Motiv','☀']],
 aura:[['none','Ohne Aura','Schlichter Look','◯'],['frost','Frostnebel','Kühles Glimmen','❄'],['embers','Glut','Warmes Leuchten','♨'],['electric','Elektrisch','Blaue Energie','ϟ'],['royal','Königlich','Goldener Schimmer','✦']]
};
const MINT_HELP={frame:'Rahmen verändern den äußeren Ring deiner Münze.',material:'Material bestimmt die Farbe und Reflexion des Metalls.',heads:'Diese Prägung erscheint bei einem Gewinn (50 %).',tails:'Diese Prägung erscheint bei einer Niete (50 %).',aura:'Eine dezente Aura rund um die Hauptmünze.'};
let mintTab='frame';
function updateCoinCosmetics(){paintCoin($('coinButton').querySelector('.coin'),state.cosmetics);auraLayer.dataset.aura=state.cosmetics.aura;}
function renderMint(){
 const preview=$('mintPreview');if(!preview.firstElementChild){const coin=makeCoin(false,true);coin.classList.add('mint-coin');const aura=document.createElement('div');aura.className='mint-preview-aura';preview.append(aura,coin);}
 const coin=preview.querySelector('.mint-coin');paintCoin(coin,state.cosmetics);coin.classList.toggle('is-tails',mintTab==='tails');preview.querySelector('.mint-preview-aura').dataset.aura=state.cosmetics.aura;
 const label=key=>MINT_CHOICES[key].find(item=>item[0]===state.cosmetics[key])?.[1]||'Symbol';$('mintFaceLabels').textContent=label('heads')+' = Gewinn · '+label('tails')+' = Niete';
 $('mintHelp').textContent=MINT_HELP[mintTab];
 for(const btn of $('mintTabs').querySelectorAll('button')){const active=btn.dataset.mintTab===mintTab;btn.setAttribute('aria-selected',active?'true':'false');btn.classList.toggle('active',active);}
 $('mintOptions').innerHTML=MINT_CHOICES[mintTab].map(([id,name,desc,glyph])=>{const active=state.cosmetics[mintTab]===id;return `<button type="button" class="mint-option ${active?'is-selected':''}" data-mint-value="${id}" aria-pressed="${active}"><span class="mint-glyph ${mintTab==='material'?'mat-'+id:mintTab==='frame'?'fr-'+id:''}">${glyph}</span><span class="mint-option-label"><b>${name}</b><small>${desc}</small></span><span class="mint-check">${active?'✓':''}</span></button>`;}).join('');
}
$('mintTabs').addEventListener('click',e=>{const btn=e.target.closest('[data-mint-tab]');if(!btn)return;mintTab=btn.dataset.mintTab;renderMint();});
$('mintOptions').addEventListener('click',e=>{const btn=e.target.closest('[data-mint-value]');if(!btn)return;state.cosmetics[mintTab]=btn.dataset.mintValue;updateCoinCosmetics();renderMint();save();initAudio();ding(660,.08,.025);});
$('mintReset').addEventListener('click',()=>{state.cosmetics={...DEFAULT_COSMETICS};updateCoinCosmetics();renderMint();save();toast('Standarddesign ausgewählt');});
function renderSound(){$('sound').innerHTML=icon(state.sound?'sound':'mute');$('sound').setAttribute('aria-pressed',String(state.sound));$('toggleSound').textContent='Sound: '+(state.sound?'An':'Aus');}
function renderAll(){updateCoinCosmetics();renderNumbers();renderBonuses();renderShop();renderResult();renderStats();renderSound();$('coinButton').firstElementChild.classList.toggle('is-tails',state.mainHeadsLast===false);if(!$('mint').hidden)renderMint();}
function toast(msg){clearTimeout(toastTimer);$('toast').textContent=msg;$('toast').hidden=false;toastTimer=setTimeout(()=>$('toast').hidden=true,2200);}
let criticalTimer;
function playCriticalSound(){if(!state.sound||!audio||audio.state!=='running')return;try{const t=audio.currentTime;for(const [i,f] of [1080,620,1320].entries()){const osc=audio.createOscillator(),gain=audio.createGain();osc.type=i===1?'sawtooth':'triangle';osc.frequency.setValueAtTime(f,t+i*.065);osc.frequency.exponentialRampToValueAtTime(f*.4,t+i*.065+.15);gain.gain.setValueAtTime(.001,t+i*.065);gain.gain.exponentialRampToValueAtTime(i===1?.045:.075,t+i*.065+.008);gain.gain.exponentialRampToValueAtTime(.001,t+i*.065+.18);osc.connect(gain).connect(audio.destination);osc.start(t+i*.065);osc.stop(t+i*.065+.2);}}catch{}}
function criticalImpact(out,slots){
 if(!out.summary.critical)return;
 const fx=$('critFX');fx.replaceChildren();let locations=[];
 if(out.main.critical)locations.push(position(mainSlot));
 for(const slot of slots){const i=Number(slot.dataset.index);if(out.bonuses[i]?.critical)locations.push(position(slot));}
 if(!locations.length)locations=[position(mainSlot)];
 for(const p of locations.slice(0,4)){const burst=document.createElement('div');burst.className='critical-burst';burst.style.left=p.x+'px';burst.style.top=p.y+'px';burst.innerHTML='<span class="cr-ring"></span><svg viewBox="0 0 60 70" aria-hidden="true"><path d="m36 3-26 37h22l-6 27 28-43H33Z"/></svg><span class="cr-spark s1"></span><span class="cr-spark s2"></span><span class="cr-spark s3"></span><span class="cr-spark s4"></span>';fx.appendChild(burst);}
 $('critFlash').classList.remove('active');void $('critFlash').offsetWidth;$('critFlash').classList.add('active');
 const banner=$('critBanner');banner.hidden=false;banner.innerHTML='<span>ϟ</span> CRITICAL <b>×'+criticalFactor(state)+'</b>'+(out.summary.criticalCount>1?'<small> · '+out.summary.criticalCount+' Treffer</small>':'');banner.classList.remove('active');void banner.offsetWidth;banner.classList.add('active');
 clearTimeout(criticalTimer);criticalTimer=setTimeout(()=>{fx.replaceChildren();banner.hidden=true;$('critFlash').classList.remove('active');},980);playCriticalSound();
}
function initAudio(){if(!state.sound)return;try{audio??=new (window.AudioContext||window.webkitAudioContext)();if(audio.state==='suspended')audio.resume().catch(()=>{});}catch{}}
function ding(freq=550,duration=.1,volume=.045,offset=0){if(!state.sound||!audio||audio.state!=='running')return;try{const o=audio.createOscillator(),g=audio.createGain(),t=audio.currentTime+offset;o.type='sine';o.frequency.setValueAtTime(freq,t);o.frequency.exponentialRampToValueAtTime(freq*.8,t+duration);g.gain.setValueAtTime(.001,t);g.gain.exponentialRampToValueAtTime(volume,t+.012);g.gain.exponentialRampToValueAtTime(.001,t+duration);o.connect(g).connect(audio.destination);o.start(t);o.stop(t+duration+.02);}catch{}}
const reduced=()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function spinTurns(power,spawn=false){
  // Wipe strength affects rotations, never flight height, duration or win probability.
  // Keep counts integral so the top/bottom face still lands exactly on the chosen result.
  return spawn?2:Math.round(2+clamp(power,0,1)*7);
}
function animateCoin(el,heads,ms,newAngle,spawn=false,power=.5){
 const slot=el.closest('.coin-stage,.bonus-slot'),old=angle(slot);
 const a=el.classList.contains('is-tails')?180:0;
 const turns=spinTurns(power,spawn);
 const b=(heads?0:180)+360*turns;
 const mini=el.classList.contains('mini');
 // Fixed trajectory: all swipe strengths use the same arc; only the flips vary.
 const height=mini?Math.max(14,Math.min(168,board.h*.225)):Math.min(280,board.h*.315);
 const tr=(x,y,z,scale=1)=>`translateY(${y}px) scale(${scale}) rotateX(33deg) rotateZ(${z}deg) rotateX(${x}deg)`;
 el.classList.toggle('is-tails',!heads);setAngle(slot,newAngle);
 if(!ms||!el.animate)return Promise.resolve();
 const z=t=>old+(newAngle-old)*t;
 const anim=el.animate([
  {transform:tr(a,0,old,spawn?.45:1),offset:0},
  {transform:tr(a+(b-a)*.18,-height*.76,z(.2)+20,1.07),offset:.16},
  {transform:tr(a+(b-a)*.49,-height,z(.43)-27,1.15),offset:.38},
  {transform:tr(a+(b-a)*.80,-height*.54,z(.69)+16,1.07),offset:.60},
  {transform:tr(b-65,0,newAngle+12),offset:.76},
  {transform:tr(b+30,-height*.16,newAngle-8),offset:.83},
  {transform:tr(b-14,0,newAngle+3),offset:.90},
  {transform:tr(b+7,-height*.035,newAngle-1),offset:.95},
  {transform:tr(b,0,newAngle),offset:1}
 ],{duration:ms,easing:'linear'});
 return anim.finished.catch(()=>{});
}
function moveSlot(slot,to,ms,from=position(slot)){
  place(slot,to);
  if(!ms||!slot.animate)return Promise.resolve();
  // Animate only transform: moving left/top on every frame forced layout on all coin elements.
  const dx=from.x-to.x,dy=from.y-to.y;
  const transform=(x,y)=>`translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
  return slot.animate([
    {transform:transform(dx,dy),offset:0},
    {transform:transform(dx*.24,dy*.24),offset:.77},
    {transform:transform(0,0),offset:1}
  ],{duration:ms,easing:'ease-out'}).finished.catch(()=>{});
}
function tableTap(ms){if(!ms)return;ding(180,.055,.05,ms*.76/1000);ding(340,.045,.026,ms*.90/1000);}
function fillBonuses(){const visible=new Set([...$('bonuses').children].filter(s=>!s.classList.contains('lost')).map(s=>Number(s.dataset.index)));const fixed=[position(mainSlot),...[...$('bonuses').children].filter(s=>!s.classList.contains('lost')).map(position)];for(let i=0;i<state.bonus&&visible.size<MAX_VISIBLE;i++){if(visible.has(i))continue;const p=pick(board.bonus/2,fixed);if(!p)break;const slot=makeSlot(state.bonusCoins[i],i);place(slot,p);setAngle(slot,rand(-80,80));visible.add(i);fixed.push(p);}}
async function toss(slot,heads,ms,target,spawn=false,origin=position(slot),power=.5){let a=angle(slot)+rand(-95,95);if(Math.abs(a-angle(slot))<25)a+=40;slot.style.setProperty('--toss-ms',ms+'ms');slot.classList.add('tossing');try{await Promise.all([animateCoin(slot.querySelector('.coin'),heads,ms,a,spawn,power),moveSlot(slot,target,ms,origin)]);}finally{slot.classList.remove('tossing');}}
async function flipRound(power=.5){
 if(busy||$('play').hidden||$('shopDrawer').classList.contains('open'))return;
 busy=true;const play=$('play'),button=$('coinButton');play.classList.add('round-busy');button.disabled=true;
 const slots=[...$('bonuses').children].filter(s=>!s.classList.contains('lost'));
 for(const slot of slots)slot.disabled=true;
 initAudio();updateBonusLabel();
 const count=state.bonusCoins.length,heads=Array.from({length:count+1},()=>Math.random()<.5),ms=reduced()?0:Math.round(2500*fastFactor(state));
 try{
   // Plan destinations with each old/new position reserved before starting all animations.
   const all=[mainSlot,...slots],reserved=new Map(all.map(slot=>[slot,position(slot)]));
   const jobs=all.map(slot=>{const origin=position(slot),occupied=[...reserved].filter(([other])=>other!==slot).map(([,p])=>p);const target=pick(radius(slot),occupied,origin,slot===mainSlot)||origin;reserved.set(slot,target);return {slot,origin,target,h:heads[slot===mainSlot?0:Number(slot.dataset.index)+1],duration:ms};});
   ding(370,.07,.025);tableTap(ms);
   await Promise.all(jobs.map(j=>toss(j.slot,j.h,j.duration,j.target,false,j.origin,power)));
   // Resolve once, after every visible coin has finished. The main coin sets this round's multiplier.
   let retried=false;
   if(secondRoll(state,heads[0])){retried=true;state.stats.secondChances++;heads[0]=Math.random()<.5;toast('Second Chance!');ding(950,.12,.035);const origin=position(mainSlot);await toss(mainSlot,heads[0],ms,origin,false,origin,power);}
   const out=resolveRound(state,heads);out.summary.secondChance=retried;save();renderNumbers();renderResult(out.summary);criticalImpact(out,slots);
   if(!out.summary.critical&&(out.summary.milestone||out.summary.coldMilestone||out.summary.comeback>1))[660,880,1100].forEach((f,i)=>ding(f,.17,.045,i*.09));else if(out.summary.critical){}else if(out.summary.gain)ding(700,.13,.05);else ding(230,.09,.025);
   const survivorIndices=new Map();let next=0;for(let i=0;i<count;i++)if(out.bonuses[i].survive)survivorIndices.set(i,next++);
   const lost=[];
   for(const slot of slots){const i=Number(slot.dataset.index),result=out.bonuses[i];if(!result.survive){slot.classList.add('lost');lost.push(slot);}else{slot.dataset.index=survivorIndices.get(i);updateBadge(slot,state.bonusCoins[Number(slot.dataset.index)]);if(result.saved)slot.classList.add('saved');}}
   // Newly spawned coins land only after the round. Chain Reaction has its own parent source.
   const extra=[];
   const sources=[...Array(out.main.spawnCount).fill(-1)];
   for(let i=count-1;i>=0;i--)for(let n=0;n<out.bonuses[i].spawnCount;n++)sources.push(i);
   const survivorCount=survivorIndices.size;
   const occupied=[mainSlot,...slots.filter(s=>!s.classList.contains('lost'))].map(position);
   for(let i=survivorCount;i<state.bonus;i++){
      const p=occupied.length<=MAX_VISIBLE?pick(board.bonus/2,occupied):null;
      if(!p)continue;
      occupied.push(p);
      const child=makeSlot(state.bonusCoins[i],i),source=sources[i-survivorCount]??-1;
      const originSlot=source<0?mainSlot:slots.find(s=>Number(s.dataset.index)===(survivorIndices.get(source)??source))??mainSlot;
      const origin=position(originSlot);
      place(child,origin);setAngle(child,angle(originSlot));child.disabled=true;
      extra.push(toss(child,false,ms?Math.round(850*fastFactor(state)):0,p,true,origin,power));
   }
   if(sources.length)ding(950,.16,.045);
   if(lost.length&&ms)extra.push(new Promise(r=>setTimeout(r,360)));
   await Promise.all(extra);for(const slot of lost)slot.remove();for(const slot of slots)slot.classList.remove('saved');fillBonuses();
 }finally{busy=false;play.classList.remove('round-busy');button.disabled=false;for(const slot of $('bonuses').children)slot.disabled=false;updateBonusLabel();if(board.w!==tabletop.clientWidth||board.h!==tabletop.clientHeight)relayout();}
}
function setShop(open){if(!open){selectedUpgrade=null;renderDetail();}else{renderShop();} $('shopDrawer').classList.toggle('open',open);$('shopDrawer').inert=!open;$('drawerShade').classList.toggle('open',open);$('shopToggle').setAttribute('aria-expanded',String(open));if(open){requestAnimationFrame(()=>{applyZoom();if(!treeOpened){centerTree();treeOpened=true;}});}else if($('shopDrawer').contains(document.activeElement))$('shopToggle').focus();}
$('shopToggle').onclick=()=>setShop(!$('shopDrawer').classList.contains('open'));$('drawerShade').onclick=$('drawerClose').onclick=$('drawerGrip').onclick=$('treeBottomClose').onclick=()=>setShop(false);
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(selectedUpgrade){selectedUpgrade=null;renderDetail();}else setShop(false);}});let touchY=0;$('drawerGrip').addEventListener('touchstart',e=>touchY=e.touches[0].clientY,{passive:true});$('drawerGrip').addEventListener('touchend',e=>{if(e.changedTouches[0].clientY-touchY>20)setShop(false)},{passive:true});
// Capture a swipe from any non-control area of the game screen, including the coins.
const mainButton=$('coinButton');let swipe=null;
function gesturePower(distance,velocity){
  // Der Spieler entscheidet gefuehlt die Drehgeschwindigkeit, nicht Wurfzeit oder Ergebnis.
  // Langsame Gesten haben absichtlich eine breite Toleranzzone. Nur ein bewusst
  // schneller Wisch (> etwa 1.65 px/ms) erreicht das Maximum.
  // Distanz entscheidet nur, ob eine Geste als Wisch erkannt wird.
  const fraction=clamp((velocity-.40)/1.25,0,1);
  return Math.pow(fraction,1.8);
}
function canSwipe(){return !busy&&!$('play').hidden&&!$('shopDrawer').classList.contains('open');}
function clearSwipe(){swipe=null;mainButton.classList.remove('grabbing');}
document.addEventListener('pointerdown',e=>{if(!canSwipe()||swipe||!e.isPrimary||e.button!==0)return;const target=e.target;const control=target.closest('button,a,input,select,textarea,summary,#shopDrawer,#drawerShade');if(control&&!control.matches('#coinButton,.bonus-slot,#bonusLabel'))return;const t=performance.now();swipe={id:e.pointerId,x:e.clientX,y:e.clientY,t,samples:[{x:e.clientX,y:e.clientY,t}]};document.body.setPointerCapture(e.pointerId);mainButton.classList.add('grabbing');e.preventDefault();});
document.addEventListener('pointermove',e=>{if(!swipe||swipe.id!==e.pointerId)return;const t=performance.now();swipe.samples.push({x:e.clientX,y:e.clientY,t});swipe.samples=swipe.samples.filter(p=>p.t>=t-115).slice(-12);});
document.addEventListener('pointerup',e=>{if(!swipe||swipe.id!==e.pointerId)return;const g=swipe;clearSwipe();if(!canSwipe())return;const t=performance.now(),d=Math.hypot(e.clientX-g.x,e.clientY-g.y);if(d<18)return;const elapsed=Math.max(80,t-g.t);const velocity=d/elapsed;flipRound(gesturePower(d,velocity));});
document.addEventListener('pointercancel',e=>{if(swipe?.id===e.pointerId)clearSwipe();});document.addEventListener('lostpointercapture',e=>{if(swipe?.id===e.pointerId)clearSwipe();});
mainButton.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&!e.repeat){e.preventDefault();flipRound(.5);}});mainButton.addEventListener('click',e=>{if(e.detail===0&&!e.pointerType)flipRound(.5);});

$('upgrades').addEventListener('click',e=>{const node=e.target.closest('[data-node]');if(node){selectedUpgrade=node.dataset.node;renderDetail();}});
$('treeDetail').addEventListener('click',e=>{if(e.target===$('treeDetail')||e.target.closest('[data-detail-close]')){selectedUpgrade=null;renderDetail();return;}const maxBtn=e.target.closest('[data-tree-max]');if(maxBtn&&state.testMode&&!busy){state.levels[maxBtn.dataset.treeMax]=maxLevel(RULE_BY_ID[maxBtn.dataset.treeMax]);renderShop();return;}const b=e.target.closest('[data-tree-buy]');if(!b||busy)return;if(buyUpgrade(state,b.dataset.treeBuy)){initAudio();ding(900,.11);save();renderNumbers();renderShop();}return;});
$('testToggle').onclick=toggleTestMode;document.querySelectorAll('[data-jump]').forEach(b=>b.onclick=()=>jumpBranch(b.dataset.jump));$('zoomIn').onclick=()=>changeZoom(treeZoom+.15);$('zoomOut').onclick=()=>changeZoom(treeZoom-.15);$('zoomReset').onclick=()=>changeZoom(1);
const tv=$('treeViewport');let drag=null, suppressClick=false;
tv.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&e.button===0){drag={x:e.clientX,y:e.clientY,left:tv.scrollLeft,top:tv.scrollTop,moved:false};suppressClick=false;}});
window.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.hypot(dx,dy)>6)drag.moved=true;if(drag.moved){tv.scrollLeft=drag.left-dx;tv.scrollTop=drag.top-dy;}});
window.addEventListener('pointerup',()=>{if(drag){suppressClick=drag.moved;drag=null;}});tv.addEventListener('click',e=>{if(suppressClick){e.stopPropagation();suppressClick=false;}},true);
let pinch=null;tv.addEventListener('touchstart',e=>{if(e.touches.length===2){pinch={d:Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY),z:treeZoom};}},{passive:true});tv.addEventListener('touchmove',e=>{if(pinch&&e.touches.length===2){e.preventDefault();changeZoom(pinch.z*Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY)/Math.max(1,pinch.d));}},{passive:false});tv.addEventListener('touchend',()=>pinch=null);tv.addEventListener('touchcancel',()=>pinch=null);
function toggleSound(){state.sound=!state.sound;save();renderSound();if(state.sound){initAudio();ding();}}$('sound').onclick=toggleSound;$('toggleSound').onclick=toggleSound;
function showPage(id){if(busy)return;setShop(false);document.querySelectorAll('.page').forEach(p=>p.hidden=p.id!==id);document.querySelectorAll('.nav').forEach(b=>{b.classList.toggle('active',b.dataset.page===id);if(b.dataset.page===id)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});$('back').hidden=id==='play';document.body.classList.toggle('subpage',id!=='play');if(id==='stats')renderStats();if(id==='mint')renderMint();window.scrollTo(0,0);}document.querySelectorAll('.nav').forEach(n=>n.addEventListener('click',()=>showPage(n.dataset.page)));$('back').onclick=()=>showPage('play');
$('export').onclick=()=>{if(state.testMode){toast('Testmodus erst beenden');return;}const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='flip-save.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};$('import').onclick=()=>{if(!busy&&!state.testMode)$('importFile').click();else if(state.testMode)toast('Testmodus erst beenden');};$('importFile').onchange=async e=>{const f=e.target.files[0];e.target.value='';if(!f||busy||state.testMode)return;try{const loaded=validate(JSON.parse(await f.text()));if(busy)return;if(confirm('Aktuellen Spielstand durch den importierten ersetzen?')){state=loaded;save();renderAll();toast('Spielstand importiert');}}catch{toast('Ungültige Spielstand-Datei');}};$('reset').onclick=()=>{if(!busy&&!state.testMode&&confirm('Wirklich den gesamten Fortschritt löschen?')){state=fresh();save();renderAll();toast('Spielstand zurückgesetzt');}};
renderAll();
if(state.migrationRefund){
  const refund=state.migrationRefund;
  delete state.migrationRefund;
  save();
  toast('Upgrade-Limits angepasst · '+fmt(refund)+' Coins erstattet');
}
$('testIndicator').hidden=true;
let lastBoardSize=tabletop.clientWidth+'x'+tabletop.clientHeight;new ResizeObserver(()=>{const size=tabletop.clientWidth+'x'+tabletop.clientHeight;if(!tabletop.clientWidth||!tabletop.clientHeight||size===lastBoardSize)return;lastBoardSize=size;relayout();}).observe(tabletop);
