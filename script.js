
'use strict';
// FLIP v0.13 — independent game engine. Persistent saves stay on version 1.
// Each new ability is part of the same deterministic round resolution as v0.12.
const RULES = [
  {id:'duplication', name:'Duplication', base:6, growth:1.15, unlock:0, max:50, group:'spawn', desc:'Chance, bei einer Krone der Hauptmünze eine Bonusmünze zu erzeugen.'},
  {id:'twin', name:'Twin Spawn', base:100, growth:1.23, unlock:750, max:20, group:'spawn', requires:['duplication',10], desc:'Bei einer Duplikation können zwei statt einer Bonusmünze erscheinen.'},
  {id:'chain', name:'Chain Reaction', base:250, growth:1.28, unlock:3500, max:15, group:'spawn', requires:['twin',10], desc:'Erfolgreiche Bonusmünzen können selbst neue Bonusmünzen erzeugen.'},
  {id:'triple', name:'Triple Spawn', base:500, growth:1.32, unlock:5500, max:10, group:'spawn', requires:['twin',10], desc:'Wenn Twin Spawn auslöst, kann eine dritte Bonusmünze erscheinen.'},
  {id:'golden', name:'Golden Coin', base:80, growth:1.20, unlock:250, max:10, group:'spawn', requires:['duplication',5], desc:'Chance, dass neu erzeugte Bonusmünzen golden sind und Basiswert 5 haben.'},
  {id:'goldenTouch', name:'Golden Touch', base:300, growth:1.40, unlock:4000, max:5, group:'spawn', requires:['golden',3], desc:'Erfolgreiche Silbermünzen können sich für künftige Würfe dauerhaft in Gold verwandeln.'},
  {id:'survival', name:'Survival', base:20, growth:1.18, unlock:50, max:30, group:'survival', desc:'Eine Bonusmünze kann ihren Totenkopf überleben.'},
  {id:'second', name:'Second Chance', base:150, growth:1.25, unlock:1000, max:20, group:'survival', requires:['survival',5], desc:'Bei einem Totenkopf der Hauptmünze wird ein zusätzlicher Münzwurf ausgelöst.'},
  {id:'revival', name:'Revival', base:150, growth:1.24, unlock:2000, max:5, group:'survival', requires:['survival',5], desc:'Nach gescheitertem Survival kann eine Bonusmünze sofort wiederauferstehen (Serie 0).'},
  {id:'memory', name:'Memory', base:200, growth:1.26, unlock:3000, max:25, group:'survival', requires:['survival',10], desc:'Wenn Survival eine Bonusmünze rettet, behält sie manchmal ihre bisherige Serie.'},
  {id:'protection', name:'Streak Protection', base:35, growth:1.20, unlock:100, max:20, group:'streak', desc:'Ein Totenkopf kann deine positive Hauptmünzenserie bewahren.'},
  {id:'skip', name:'Streak Skip', base:250, growth:1.30, unlock:2500, max:5, group:'streak', requires:['protection',5], desc:'Bei einer Krone steigt die Hauptserie manchmal um zwei statt um eins.'},
  {id:'hotBoost', name:'Hot Boost', base:100, growth:1.25, unlock:1000, max:10, group:'streak', requires:['protection',3], desc:'Ab einer 2er-Kronenserie geben alle Münzen pro Level 5 % mehr Ertrag.'},
  {id:'lastFlame', name:'Last Flame', base:250, growth:1.30, unlock:3000, max:30, group:'streak', requires:['protection',10], desc:'Wenn Protection fehlschlägt, kann eine Kronenserie zur Hälfte erhalten bleiben.'},
  {id:'coldSpawn', name:'Cold Spawn', base:40, growth:1.25, unlock:450, max:20, group:'streak', requires:['protection',2], desc:'Bei 3 und 4 Totenköpfen besteht eine zusätzliche Spawnchance von 2 % pro Level.'},
  {id:'comebackBoost', name:'Comeback Boost', base:100, growth:1.28, unlock:800, max:10, group:'streak', requires:['coldSpawn',5], desc:'Erhöht den einmaligen Comeback-Multiplikator nach einer 5er-Totenkopfserie.'},
  {id:'fast', name:'Fast Flip', base:35, growth:1.30, unlock:150, max:16, group:'special', desc:'Reduziert die Flugzeit aller Münzen um 5 Prozentpunkte je Level (bis −80 %). Basisdauer: 2,5 Sekunden, bei MAX nur 0,5 Sekunden.'},
  {id:'coinValue', name:'Coin Value', base:500, growth:2, unlock:3500, max:5, group:'special', requires:['fast',5], desc:'Jedes Level gibt der Hauptmünze einen zusätzlichen Basis-Coin bei Krone.'},
  {id:'critical', name:'Critical Flip', base:180, growth:1.45, unlock:500, max:5, group:'special', requires:['golden',2], desc:'Chance auf einen kritischen Wurf mit zehnfachem Ertrag.'},
  {id:'criticalPower', name:'Critical Power', base:750, growth:1.45, unlock:5500, max:10, group:'special', requires:['critical',2], desc:'Verbessert den Critical-Multiplikator um ×1 je Level, maximal ×20.'}
];
const RULE_BY_ID = Object.fromEntries(RULES.map(r=>[r.id,r]));
const STAT_KEYS = ['rounds','mainHeads','mainTails','bonusHeads','bonusTails','spawned','lost','saved','protected','bestStreak','bestRound','bestBonus','earned','criticals','milestones','twins','secondChances','skips','bestCold','coldSpawns','comebacks','bestComeback','chains','triples','goldenTouches','revivals','memories','lastFlames','coldExtras'];
const TIERS = [{n:3,name:'Hot Streak',color:'#ffad62',boost:2},{n:5,name:'On Fire',color:'#ff654f',boost:3},{n:7,name:'Royal Streak',color:'#ffe16d',boost:3},{n:10,name:'Legendary Streak',color:'#c79aff',boost:3},{n:15,name:'Impossible Streak',color:'#72f4ea',boost:3}];
const tier = n=>[...TIERS].reverse().find(t=>n>=t.n);
const COLD_TIERS = [{n:2,color:'#9fc9ed',name:'Cold'},{n:3,color:'#7fcfff',name:'Cold Streak'},{n:4,color:'#50b9ff',name:'Deep Freeze'},{n:5,color:'#94e9ff',name:'Ice Cold'},{n:7,color:'#a5adff',name:'Frozen'},{n:10,color:'#d5acff',name:'Cursed'},{n:15,color:'#d8ffff',name:'Absolute Zero'}];
const coldTier = n=>[...COLD_TIERS].reverse().find(t=>n>=t.n);
const MAX_BONUSES = 500; // Practical safeguard against runaway combinations.
const maxLevel = r=>r.max??100;
const DEFAULT_COSMETICS={frame:'plain',material:'copper',heads:'crown',tails:'skull',aura:'none'};
const COSMETIC_IDS={frame:['plain','frost','fire','lightning','royal'],material:['copper','silver','gold','obsidian','ice'],heads:['crown','skull','bolt','flame','snowflake','star','moon','sun'],tails:['crown','skull','bolt','flame','snowflake','star','moon','sun'],aura:['none','frost','embers','electric','royal']};
function cleanCosmetics(raw){const out={...DEFAULT_COSMETICS};if(raw&&typeof raw==='object'){for(const key of Object.keys(out))if(typeof raw[key]==='string'&&COSMETIC_IDS[key].includes(raw[key]))out[key]=raw[key];}return out;}

function fresh(){return {version:1,coins:0,streak:0,cold:0,bonus:0,bonusCoins:[],incomeFraction:0,levels:Object.fromEntries(RULES.map(r=>[r.id,0])),stats:Object.fromEntries(STAT_KEYS.map(k=>[k,0])),last:null,mainHeadsLast:true,sound:true,cosmetics:{...DEFAULT_COSMETICS}};}
function cost(id,level){const r=RULE_BY_ID[id];return r?Math.round(r.base*(r.growth??1.2)**level):Infinity;}
const unlocked=(s,r)=>!!s.testMode||s.levels[r.id]>0||(s.stats.earned>=r.unlock&&(!r.requires||s.levels[r.requires[0]]>=r.requires[1]));
const fastFactor=s=>Math.max(.20,1-.05*s.levels.fast);
const criticalFactor=s=>10+s.levels.criticalPower;
function secondRoll(s,h,rng=Math.random){return !h&&s.levels.second>0&&rng()<s.levels.second/100;}
function buyUpgrade(s,id){const r=RULE_BY_ID[id];if(!r||!unlocked(s,r)||s.levels[id]>=maxLevel(r)||(!s.testMode&&s.coins<cost(id,s.levels[id])))return false;if(!s.testMode)s.coins-=cost(id,s.levels[id]);s.levels[id]++;return true;}
function spawnBonus(s,golden=false){if(s.bonusCoins.length>=MAX_BONUSES)return false;s.bonusCoins.push({golden:!!golden,streak:0,heads:false});s.stats.spawned++;return true;}
function spawnRandomBonus(s,rng=Math.random){const g=s.levels.golden>0&&rng()<s.levels.golden/100;return spawnBonus(s,g);}
function addIncome(s,amount){if(amount<=0)return 0;const combined=amount+(s.incomeFraction||0);const payout=Math.floor(combined+1e-8);s.incomeFraction=Math.max(0,Math.min(.99999999,combined-payout));const safe=Math.max(0,Math.min(Number.MAX_SAFE_INTEGER-s.coins,payout));s.coins+=safe;s.stats.earned=Math.min(Number.MAX_SAFE_INTEGER,s.stats.earned+safe);return safe;}
function resolve(s,index=-1,rng=Math.random,forcedHeads){
  const h=forcedHeads??(rng()<.5),t=s.stats,isMain=index===-1;
  let spawned=false,golden=false,lost=0,saved=0,protectedStreak=false,bonusPay=0,gain=0;
  let survive=true,milestone=0,critical=false,spawnCount=0,skipped=false,coldMilestone=0,coldSpawn=0,comeback=1;
  let chain=false,triple=false,revived=false,memory=false,goldenTouched=false,lastFlame=false,coldExtra=false;
  if(isMain){
    const previous=s.streak,oldCold=s.cold;
    s.cold=h?0:oldCold+1;t.bestCold=Math.max(t.bestCold,s.cold);
    if(!h&&(s.cold===3||s.cold===4)){
      coldMilestone=s.cold;const base=s.cold-2;
      coldExtra=s.levels.coldSpawn>0&&rng()<Math.min(1,s.levels.coldSpawn*.02);
      for(let i=0;i<base+Number(coldExtra);i++)if(spawnBonus(s,false)){coldSpawn++;spawnCount++;}
      t.coldSpawns+=coldSpawn;if(coldExtra)t.coldExtras++;
    }
    if(h&&oldCold>=5){comeback=oldCold+s.levels.comebackBoost;t.comebacks++;t.bestComeback=Math.max(t.bestComeback,comeback);}
    protectedStreak=!h&&previous>0&&s.levels.protection>0&&rng()<s.levels.protection/100;
    lastFlame=!h&&!protectedStreak&&previous>=2&&s.levels.lastFlame>0&&rng()<s.levels.lastFlame/100;
    skipped=h&&s.levels.skip>0&&rng()<s.levels.skip/100;
    s.streak=h?previous+(skipped?2:1):protectedStreak?previous:lastFlame?Math.floor(previous/2):0;
    if(skipped)t.skips++;if(lastFlame)t.lastFlames++;
    const reached=h?TIERS.filter(x=>x.n>previous&&x.n<=s.streak):[];
    milestone=reached.length?reached[reached.length-1].n:0;
    const boost=tier(s.streak)?.boost??1;
    const dupChance=Math.min(.95,s.levels.duplication*boost/100);
    const duplicate=h&&s.levels.duplication>0&&rng()<dupChance;
    const guaranteed=reached.some(x=>x.n===7||x.n===10||x.n===15);
    if(duplicate||guaranteed){
      // One spawn event per landed main flip, even if milestone and chance coincide.
      const twins=s.levels.twin>0&&rng()<s.levels.twin/100;
      triple=twins&&s.levels.triple>0&&rng()<s.levels.triple/100;
      const n=1+Number(twins)+Number(triple);
      for(let i=0;i<n;i++){
        const g=i===0&&reached.some(x=>x.n===10||x.n===15)?true:(s.levels.golden>0&&rng()<s.levels.golden/100);
        if(spawnBonus(s,g)){spawnCount++;golden ||= g;}
      }
      if(twins)t.twins++;if(triple)t.triples++;
    }
    gain=h?(1+s.levels.coinValue)*Math.max(1,s.streak)*(reached.some(x=>x.n===15)?5:1)*comeback:0;
    t.rounds++;t.mainHeads+=Number(h);t.mainTails+=Number(!h);
    t.protected+=Number(protectedStreak);t.bestStreak=Math.max(t.bestStreak,s.streak);
    s.mainHeadsLast=h;
  } else {
    const c=s.bonusCoins[index];if(!c)throw Error('Bonusmünze fehlt');
    const survivalSaved=h&&s.levels.survival>0&&rng()<s.levels.survival/100;
    revived=h&&!survivalSaved&&s.levels.revival>0&&rng()<s.levels.revival/100;
    survive=!h||survivalSaved||revived;
    if(h){
      t.bonusHeads++;
      if(survivalSaved){saved=1;memory=s.levels.memory>0&&rng()<s.levels.memory/100;c.streak=memory?c.streak:0;c.heads=true;if(memory)t.memories++;}
      else if(revived){c.streak=0;c.heads=true;t.revivals++;}
      else{lost=1;s.bonusCoins.splice(index,1);}
    } else {
      t.bonusTails++;c.streak++;c.heads=false;
      bonusPay=(c.golden?5:1)*c.streak;
      gain=bonusPay*Math.max(1,s.streak);
      // Golden Touch applies to the NEXT throw, preserving this successful streak.
      goldenTouched=!c.golden&&s.levels.goldenTouch>0&&rng()<s.levels.goldenTouch/100;
      if(goldenTouched){c.golden=true;t.goldenTouches++;}
      chain=s.levels.chain>0&&rng()<s.levels.chain/100;
      if(chain&&spawnRandomBonus(s,rng)){spawnCount++;t.chains++;}else chain=false;
    }
    t.lost+=lost;t.saved+=saved;
  }
  spawned=spawnCount>0;
  if(gain>0&&s.streak>=2&&s.levels.hotBoost>0)gain*=1+.05*s.levels.hotBoost;
  critical=gain>0&&s.levels.critical>0&&rng()<s.levels.critical/100;
  if(critical){gain*=criticalFactor(s);t.criticals++;}
  gain=addIncome(s,gain);
  if(milestone)t.milestones++;
  s.bonus=s.bonusCoins.length;t.bestRound=Math.max(t.bestRound,gain);t.bestBonus=Math.max(t.bestBonus,s.bonus);
  s.last={heads:h,gain,spawned,golden,lost,saved,protectedStreak,bonusPay,critical,milestone,spawnCount,skipped,coldMilestone,coldSpawn,comeback,chain,triple,revived,memory,goldenTouched,lastFlame,coldExtra};
  return {...s.last,survive};
}
function resolveRound(s,heads,rng=Math.random){
  const count=s.bonusCoins.length;
  if(heads.length!==count+1)throw Error('Ungültige Wurfrunde');
  const main=resolve(s,-1,rng,heads[0]),bonuses=new Array(count);
  let gain=main.gain,criticalCount=Number(main.critical),lost=0,saved=0;
  for(let i=count-1;i>=0;i--){const out=resolve(s,i,rng,heads[i+1]);bonuses[i]=out;gain+=out.gain;criticalCount+=Number(out.critical);lost+=out.lost;saved+=out.saved;}
  const summary={...main,gain,critical:criticalCount>0,criticalCount,lost,saved,chainCount:bonuses.filter(x=>x.chain).length,goldenTouchCount:bonuses.filter(x=>x.goldenTouched).length,revivalCount:bonuses.filter(x=>x.revived).length,memoryCount:bonuses.filter(x=>x.memory).length};
  s.stats.bestRound=Math.max(s.stats.bestRound,gain);s.last=summary;
  return {main,bonuses,summary};
}
function validate(raw){
  if(!raw||raw.version!==1||!raw.levels||!raw.stats)throw Error('Unbekannter Spielstand');
  const s=fresh();
  const int=(x,max=Number.MAX_SAFE_INTEGER)=>{if(!Number.isSafeInteger(x)||x<0||x>max)throw Error('Ungültiger Zahlenwert');return x;};
  s.coins=int(raw.coins);s.streak=int(raw.streak);s.cold=int(raw.cold??0);s.incomeFraction=Number.isFinite(raw.incomeFraction)&&raw.incomeFraction>=0&&raw.incomeFraction<1?raw.incomeFraction:0;
  s.bonus=int(raw.bonus,100000);
  s.bonusCoins=Array.isArray(raw.bonusCoins)&&raw.bonusCoins.length===s.bonus?
    raw.bonusCoins.map(c=>({golden:!!c.golden,streak:int(c.streak),heads:!!c.heads})):
    Array.from({length:s.bonus},()=>({golden:false,streak:0,heads:false}));
  let refunded=0;
  for(const r of RULES){
    // v0.13 allowed up to level 100. Cap rather than reject existing save data.
    const original=int(raw.levels[r.id]??0,100);
    const limit=maxLevel(r);
    s.levels[r.id]=Math.min(original,limit);
    if(original>limit){
      for(let l=limit;l<original;l++)refunded+=cost(r.id,l);
    }
  }
  if(refunded>0){
    s.coins=Math.min(Number.MAX_SAFE_INTEGER,s.coins+refunded);
    s.migrationRefund=refunded;
  }
  for(const k of STAT_KEYS)s.stats[k]=int(raw.stats[k]??0);
  s.sound=raw.sound!==false;s.mainHeadsLast=raw.mainHeadsLast??(raw.last?.heads??true);s.cosmetics=cleanCosmetics(raw.cosmetics);
  if(raw.last){const l=raw.last;s.last={heads:!!l.heads,gain:int(l.gain),spawned:!!l.spawned,golden:!!l.golden,lost:int(l.lost??0),saved:int(l.saved??0),protectedStreak:!!l.protectedStreak,bonusPay:int(l.bonusPay??0),critical:!!l.critical,milestone:int(l.milestone??0,15),spawnCount:int(l.spawnCount??Number(!!l.spawned),500),skipped:!!l.skipped,secondChance:!!l.secondChance,coldMilestone:int(l.coldMilestone??0,4),coldSpawn:int(l.coldSpawn??0,500),comeback:int(l.comeback??1),chain:!!l.chain,triple:!!l.triple,revived:!!l.revived,memory:!!l.memory,goldenTouched:!!l.goldenTouched,lastFlame:!!l.lastFlame,coldExtra:!!l.coldExtra,chainCount:int(l.chainCount??0,500),goldenTouchCount:int(l.goldenTouchCount??0,500),revivalCount:int(l.revivalCount??0,500),memoryCount:int(l.memoryCount??0,500)};}
  return s;
}
