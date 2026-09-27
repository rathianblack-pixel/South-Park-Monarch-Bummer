/*
 * Physical / Reactive / Story update
 * Scope: combat motion, death sequences, damage numbers, subtle camera motion,
 * mini story arcs, random overworld events, and persistent delayed choices.
 * Existing combat/progression/save systems remain authoritative.
 */
(()=>{
  'use strict';
  if(window.__aliveSystemsReady)return;
  window.__aliveSystemsReady=true;

  /* ---------- safe save-state extension ---------- */
  function ensureAliveState(){
    state.meta=state.meta||{};
    state.meta.storyArcSeen=state.meta.storyArcSeen||{};
    state.meta.storyBossResolved=state.meta.storyBossResolved||{};
    state.meta.choiceMemory=state.meta.choiceMemory||{};
    const mem=state.meta.choiceMemory;
    mem.flags=mem.flags||{};
    mem.flagTravel=mem.flagTravel||{};
    mem.history=Array.isArray(mem.history)?mem.history:[];
    mem.eventsSeen=Array.isArray(mem.eventsSeen)?mem.eventsSeen:[];
    mem.consequencesSeen=Array.isArray(mem.consequencesSeen)?mem.consequencesSeen:[];
    mem.cooldownUntil=mem.cooldownUntil||{};
    state.meta.travel=Number(state.meta.travel||0);
    return mem;
  }
  ensureAliveState();

  /* ---------- combat-animation / camera-effects ---------- */
  const reduceMotion=()=>window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
  const speedScale=()=>state.combatSpeed==='slow' ? 1.3 : state.combatSpeed==='fast' ? .7 : 1;
  const actionNoticeMs=(title,body)=>{
    const text=`${title||''} ${body||''}`.toLowerCase();
    const base=/(defeated|finishes|critical hit|you died)/.test(text)?1300:850;
    return Math.round(base*speedScale());
  };
  const sleep=ms=>new Promise(r=>setTimeout(r,ms));

  function ensureCameraLayer(){
    const field=document.querySelector('#combat .battle-field');
    if(!field)return null;
    let layer=field.querySelector('.alive-camera-layer');
    if(!layer){
      layer=document.createElement('div');
      layer.className='alive-camera-layer';
      const move=[...field.querySelectorAll(':scope > .battle-platform, :scope > .fighter')];
      field.insertBefore(layer,field.firstChild);
      move.forEach(node=>layer.appendChild(node));
    }
    return layer;
  }

  function ensureActorShell(actor){
    if(!actor)return null;
    let shell=actor.querySelector(':scope > .alive-motion-shell');
    if(shell)return shell;
    const nodes=[...actor.childNodes].filter(n=>!(n.nodeType===1&&n.classList?.contains('status-vfx')));
    if(!nodes.length)return null;
    shell=document.createElement('div');
    shell.className='alive-motion-shell';
    nodes.forEach(n=>shell.appendChild(n));
    actor.insertBefore(shell,actor.firstChild);
    return shell;
  }

  function ensureCombatMotion(){
    ensureCameraLayer();
    ensureActorShell(document.querySelector('#playerArt'));
    ensureActorShell(document.querySelector('#enemyArt'));
  }

  function clearActorMotion(shell){
    if(!shell)return;
    [...shell.classList].forEach(c=>{if(c.startsWith('alive-player-')||c.startsWith('alive-enemy-')||c.startsWith('alive-death-')||c.startsWith('alive-heavy-')||c==='alive-guard-hold')shell.classList.remove(c)});
    shell.style.removeProperty('--alive-lunge');
    shell.style.removeProperty('--alive-action-ms');
  }

  function camera(kind,duration){
    if(reduceMotion())return;
    const layer=ensureCameraLayer();
    if(!layer)return;
    const cls=`alive-cam-${kind}`;
    [...layer.classList].filter(c=>c.startsWith('alive-cam-')).forEach(c=>layer.classList.remove(c));
    void layer.offsetWidth;
    layer.classList.add(cls);
    clearTimeout(layer.__aliveCamTimer);
    layer.__aliveCamTimer=setTimeout(()=>layer.classList.remove(cls),duration||700);
  }
  window.aliveCameraEffect=camera;

  function actorDistance(){
    const p=document.querySelector('#playerArt')?.getBoundingClientRect();
    const e=document.querySelector('#enemyArt')?.getBoundingClientRect();
    if(!p||!e)return 260;
    return Math.max(120,Math.abs((e.left+e.width/2)-(p.left+p.width/2)));
  }

  function spawnProjectile(kind){
    if(reduceMotion())return;
    const field=document.querySelector('#combat .battle-field'),p=document.querySelector('#playerArt'),e=document.querySelector('#enemyArt');
    if(!field||!p||!e)return;
    const fr=field.getBoundingClientRect(),pr=p.getBoundingClientRect(),er=e.getBoundingClientRect();
    const fromX=pr.left-fr.left+pr.width*.72,fromY=pr.top-fr.top+pr.height*.43;
    const toX=er.left-fr.left+er.width*.36,toY=er.top-fr.top+er.height*.44;
    const el=document.createElement('span');
    const affinity=kind==='magic'&&['fire','water','light'].includes(state.affinity)?state.affinity:'';
    el.className='alive-projectile'+(kind==='magic'?' magic'+(affinity?' '+affinity:''):'');
    el.style.setProperty('--from-x',fromX+'px');
    el.style.setProperty('--from-y',fromY+'px');
    el.style.setProperty('--to-x',(toX-fromX)+'px');
    el.style.setProperty('--to-y',(toY-fromY)+'px');
    el.style.setProperty('--projectile-ms',Math.round(210*speedScale())+'ms');
    field.appendChild(el);
    setTimeout(()=>el.remove(),Math.round(330*speedScale()));
  }

  function animatePlayerAction(kind,noticeMs){
    ensureCombatMotion();
    const shell=ensureActorShell(document.querySelector('#playerArt'));
    if(!shell||reduceMotion())return;
    clearActorMotion(shell);
    const total=Math.max(350,Math.round(noticeMs*1.11));
    shell.style.setProperty('--alive-action-ms',total+'ms');
    if(kind==='sword')shell.style.setProperty('--alive-lunge',(-Math.min(190,actorDistance()*.48))+'px');
    if(kind==='magic')shell.style.setProperty('--alive-lunge','-34px');
    if(kind==='spell')shell.style.setProperty('--alive-lunge','-12px');
    const cls=kind==='sword'?'alive-player-sword':kind==='bow'?'alive-player-bow':(kind==='magic'||kind==='spell')?'alive-player-magic':'alive-player-guard';
    shell.classList.add(cls);
    camera('player',340);
    // Only offensive bow/magic attacks fire a projectile. Heal/Purify use kind='spell',
    // so their dedicated textures can play on the player without anything flying at the enemy.
    if(kind==='bow'||kind==='magic')setTimeout(()=>spawnProjectile(kind),Math.round(noticeMs*.72));
    if(kind==='guard'){
      setTimeout(()=>{shell.classList.remove(cls);shell.classList.add('alive-guard-hold')},Math.min(total,460));
    }else{
      clearTimeout(shell.__aliveActionTimer);
      shell.__aliveActionTimer=setTimeout(()=>shell.classList.remove(cls),total+40);
    }
  }

  function animateEnemyAction(noticeMs){
    ensureCombatMotion();
    const shell=ensureActorShell(document.querySelector('#enemyArt'));
    if(!shell||reduceMotion())return;
    clearActorMotion(shell);
    const intent=combat?.intentType||'heavy';
    const factor={charge:.52,heavy:.43,fast:.29,dodge:.22,status:.18}[intent]||.35;
    const total=Math.max(350,Math.round(noticeMs*1.11));
    shell.style.setProperty('--alive-action-ms',total+'ms');
    shell.style.setProperty('--alive-lunge',(-Math.min(205,actorDistance()*factor))+'px');
    shell.classList.add('alive-enemy-attack');
    camera('enemy',340);
    clearTimeout(shell.__aliveActionTimer);
    shell.__aliveActionTimer=setTimeout(()=>shell.classList.remove('alive-enemy-attack'),total+40);
  }

  function recoilActor(target,options={}){
    if(reduceMotion())return;
    ensureCombatMotion();
    const shell=ensureActorShell(target);
    if(!shell||shell.classList.contains('alive-death-normal')||shell.classList.contains('alive-death-boss'))return;
    const enemy=target?.id==='enemyArt';
    const cls=enemy?'alive-enemy-recoil':(options.guarded?'alive-player-guard-recoil':'alive-player-recoil');
    shell.classList.remove('alive-enemy-recoil','alive-player-recoil','alive-player-guard-recoil','alive-heavy-recoil');void shell.offsetWidth;
    shell.classList.add(cls);
    if(options.heavy&&!options.guarded)shell.classList.add('alive-heavy-recoil');
    clearTimeout(shell.__aliveRecoilTimer);
    shell.__aliveRecoilTimer=setTimeout(()=>shell.classList.remove(cls,'alive-heavy-recoil'),options.heavy&&!options.guarded?500:380);
    if(!enemy)shell.classList.remove('alive-guard-hold');
  }

  let deathPromise=null;
  function playEnemyDeath(){
    if(!combat||combat.enemyHp>0)return Promise.resolve();
    if(combat._aliveDeathComplete)return Promise.resolve();
    if(deathPromise)return deathPromise;
    window.WorldReactivity?.refreshEnemySprite?.();
    ensureCombatMotion();
    const shell=ensureActorShell(document.querySelector('#enemyArt'));
    if(!shell){combat._aliveDeathComplete=true;return Promise.resolve()}
    const boss=!!combat.boss,duration=reduceMotion()?30:(boss?1480:880);
    clearActorMotion(shell);
    shell.classList.add(boss?'alive-death-boss':'alive-death-normal');
    camera(boss?'boss-final':'heavy',boss?650:280);
    deathPromise=new Promise(resolve=>setTimeout(()=>{
      combat._aliveDeathComplete=true;
      deathPromise=null;
      resolve();
    },duration));
    return deathPromise;
  }

  /* Apply real damage number/recoil at the exact point the existing combat code changes HP. */
  window.floatCombatText=function(target,text,options={}){
    if(!target||!text)return null;
    const field=document.querySelector('#combat .battle-field');if(!field)return null;
    const n=document.createElement('div');
    const cls=['damage-number','alive-number'];
    if(options.critical)cls.push('critical');
    if(options.heal)cls.push('heal-number');
    if(options.status)cls.push('status-number');
    if(options.word)cls.push('combat-word');
    n.className=cls.join(' ');
    n.textContent=String(text);
    const tr=target.getBoundingClientRect(),fr=field.getBoundingClientRect();
    const jitter=(Math.random()-.5)*Math.min(64,tr.width*.35);
    n.style.left=(tr.left-fr.left+tr.width*.5+jitter)+'px';
    n.style.top=(tr.top-fr.top+tr.height*(options.heal?.18:.27))+'px';
    field.appendChild(n);
    setTimeout(()=>n.remove(),1050);
    return n;
  };

  window.floatDamageNumber=function(target,amount,options={}){
    if(!target||!amount)return;
    const isEnemy=target.id==='enemyArt';
    const heavy=!isEnemy&&['heavy','charge'].includes(combat?.intentType);
    recoilActor(target,{heavy,guarded:!!options.guarded});
    if(heavy&&!options.guarded)camera('heavy',280);
    if(isEnemy&&combat?.boss&&combat.enemyHp<=0)camera('boss-final',650);
    const dot=options.status==='Burning'?'burning':options.status==='Bleeding'?'bleeding':'';
    const text=dot?`-${amount}`:options.status?`${String(options.status).toUpperCase()} ${amount}`:(options.critical?`${amount}!`:`-${amount}`);
    const number=window.floatCombatText(target,text,{status:!!options.status,critical:!!options.critical});
    if(dot)number?.classList.add('status-'+dot);
  };

  window.floatHealNumber=function(target,amount){
    if(!target||!amount)return;
    window.floatCombatText(target,'+'+amount,{heal:true});
  };

  /* Hook the existing notice cadence so anticipation/telegraph motion finishes at real damage timing. */
  const baseBattleNotice=window.battleNotice;
  if(baseBattleNotice){
    window.battleNotice=function(title,body){
      const t=String(title||''),b=String(body||''),ms=actionNoticeMs(t,b);
      if($('#combat')?.classList.contains('active')){
        const lower=t.toLowerCase();
        if(lower.includes(`${String(state.playerName||'').toLowerCase()} is attacking`)||lower.includes(`${String(state.playerName||'').toLowerCase()} is casting magic`)){
          animatePlayerAction(state.gear==='sword'?'sword':state.gear==='bow'?'bow':'magic',ms);
        }else if(lower.includes(`${String(state.playerName||'').toLowerCase()} is casting a spell`)){
          // Support spells (Heal / Purify) keep the casting stance but never launch the
          // generic magic projectile toward the enemy.
          animatePlayerAction('spell',ms);
        }else if(lower.includes(`${String(state.playerName||'').toLowerCase()} is guarding`)){
          animatePlayerAction('guard',ms);
        }else if(combat?.enemy&&lower.includes(String(combat.enemy).toLowerCase())&&lower.includes('is attacking')){
          animateEnemyAction(ms);
        }
        if(/attack missed|dodged your attack/i.test(`${t} ${b}`))window.floatCombatText(document.querySelector('#enemyArt'),'MISS',{word:true});
        if(/no damage was dealt/i.test(`${t} ${b}`))window.floatCombatText(document.querySelector('#enemyArt'),'BLOCKED',{word:true});
        const healMatch=b.match(/restored\s+(\d+)\s+HP/i);
        if(healMatch)window.floatHealNumber(document.querySelector('#playerArt'),Number(healMatch[1]));
        if(combat?.enemyHp<=0&&!combat?._aliveDeathComplete)playEnemyDeath();
      }
      return baseBattleNotice(title,body);
    };
  }

  const baseCrit=window.triggerCritSlowMo;
  window.triggerCritSlowMo=function(){camera('crit',460);return baseCrit?.()};

  const baseVictory=window.victory;
  if(baseVictory){
    window.victory=function(){
      if(!combat||combat.enemyHp>0)return baseVictory();
      if(combat._aliveVictoryWaiting)return;
      combat._aliveVictoryWaiting=true;
      Promise.resolve(playEnemyDeath()).then(()=>{
        combat._aliveVictoryWaiting=false;
        baseVictory();
      });
    };
  }

  const baseStartCombat=window.startCombat;
  if(baseStartCombat){
    window.startCombat=function(enemy,boss,level){
      deathPromise=null;
      const result=baseStartCombat(enemy,boss,level);
      if(combat){combat._aliveDeathComplete=false;combat._aliveVictoryWaiting=false}
      ensureCombatMotion();
      const ps=ensureActorShell(document.querySelector('#playerArt')),es=ensureActorShell(document.querySelector('#enemyArt'));
      clearActorMotion(ps);clearActorMotion(es);
      camera(boss?'boss-entry':'entry',boss?900:600);
      return result;
    };
  }

  /* ---------- story-arcs ---------- */
  const STORY_ARCS=[
    {area:'Placenta Creek',resolution:'Barnaby’s ledgers return the food to Placenta Creek. The villagers celebrate with supper, then argue over who must repair the bridge toll sign.',beats:[
      ['Missing Supper','Placenta Creek is missing its supper. A slime trail leads from the empty storehouse; the mayor calls it a tax issue because that sounds less embarrassing.'],
      ['The Road Has Feathers','The Angry Goose blocks the road beside the missing carts. A guard says the bird has no authority, then asks it for permission to pass.'],
      ['A Very Loose Tongue','A drunk peasant says Barnaby paid him in turnips to keep travelers away. He then asks you to forget the statement until he remembers where he put the turnips.'],
      ['Crest in the Trash','The rabid raccoon guards stolen provisions stamped with Barnaby’s crest. His claim that he is merely protecting the road now has a supply chain.'],
      ['Sir Barnaby’s Brilliant Plan','Barnaby hired trouble, then charged the hungry village for protection from it. He calls the arrangement civic service. The ledgers call it theft.']
    ]},
    {area:'Mild Inconvenience',resolution:'The snares come down, and the creatures return to the forest. A goblin requests a permit to be helpful; the ranger has no form for that.',beats:[
      ['Illegal Hunting Season','A goblin poacher has placed snares along the forest edge. He calls them wildlife management; the wildlife has filed its objection by leaving.'],
      ['The Dead Keep Hunting','A Zombie Wolf bears the same black bramble as the traps. Whatever cursed the grove is spreading beyond the boundary the ranger marked.'],
      ['Fear Tax','A Bullying Sprite collects a fear tax on Gloomfang’s behalf. It has no receipts and becomes very defensive when asked what the tax funds.'],
      ['Marked by the Same Curse','The Cursed Timberwolf carries the bramble scar deeper into the woods. Its tracks lead to Gloomfang’s den, past traps meant to keep everybody out.'],
      ['Gloomfang’s Den','Gloomfang drove both hunters and animals toward the road to keep the grove empty. The forest is safe only in the narrowest, loneliest sense.']
    ]},
    {area:'Grave Mistake',resolution:'Timmy’s summons ends. The dead return to rest, and Oddo updates the cemetery hours without asking any monarch to approve them.',beats:[
      ['The Graves Are Clocking Out','The cemetery bell keeps summoning skeletons out of their graves. The gravekeeper has posted quiet hours. The bell appears not to read.'],
      ['Crypt Ventilation Failure','A Moldy Mummy leaves a crypt opened from the inside. The keeper insists the lock was inspected yesterday, then asks you to inspect it from a distance.'],
      ['Necromancy Internship','A Necromancer Apprentice says Timmy promised a court position and practical training. The position is unpaid; the practice is raising unpaid subjects.'],
      ['Royal Burial Orders','A Grave Wraith carries Timmy’s burial writ. The summons is deliberate. Its small print describes involuntary court attendance as a privilege.'],
      ['Timmy’s Eternal Fan Club','Timmy has turned the cemetery into a court whose subjects cannot walk out of his speeches. The dead deserve rest, whether or not the king finishes his address.']
    ]},
    {area:'Questionable Decisions',resolution:'The Minotaur opens the exits. The signs still disagree, but travelers can now leave long enough to complain about them.',beats:[
      ['The Entrance Regrets You','The maze entrance has a rune puzzle and a sign saying WELCOME, SORRY. The sign gives no directions, just the signature of whoever felt responsible.'],
      ['Corridors With Opinions','The walls change when nobody looks. A note on the floor says the exit is left, then corrects itself twice in the same handwriting.'],
      ['The Builder Is Panicking','The Minotaur’s route plan shows five exits and six apologies. Half the routes have been crossed out as too confrontational.'],
      ['Apologetic Traps','The last traps have safety notices written by the person who set them. They still hurt. The Minotaur has prioritized the notices over removing the traps.'],
      ['Scheduled Confrontation','At the center, the Minotaur has prepared a battle plan and a breathing exercise. He misplaced the plan while rehearsing the exercise.']
    ]},
    {area:'Dread Fortress',resolution:'Lucien’s guards lower their weapons. The servants unlock the halls, and the kingdom waits to see whether the next decision includes the people who paid for this place.',beats:[
      ['The Gate Is Still Employed','A Daedric Knight bars the gate under Lucien’s order. He cannot produce the order because the gate is locked from the other side.'],
      ['Stone Witness','The Gargoyle has watched servants locked inside and petitioners locked out. It remembers every face, which is more than the royal ledger does.'],
      ['Burned Ledgers','The Dark Sorcerer burns tribute ledgers. The surviving pages show food and steel taken from every region while Lucien called the shortages loyalty.'],
      ['Last Door Before the Throne','The Throne Warden still holds the last door. Its orders are clear; its exhausted stance suggests it has begun questioning who they protect.'],
      ['Monarch Lucien','Lucien waits beside a throne paid for by five hungry regions. The ledgers have reached his hall before you. He cannot pretend they were lost in transit.']
    ]}
  ];

  function storyModal(title,body,kicker,onContinue,resolution=false){
    document.querySelector('#aliveStoryModal')?.remove();
    const d=document.createElement('div');
    d.id='aliveStoryModal';d.className='road-event';
    d.innerHTML=`<div class="road-event-card alive-story-card"><div class="story-kicker">${esc(kicker||'Story beat')}</div><h2>${esc(title)}</h2><p class="${resolution?'story-resolution':''}">${esc(body)}</p><button data-alive-story-continue>Continue</button></div>`;
    document.querySelector('.game')?.appendChild(d);
    d.querySelector('[data-alive-story-continue]').onclick=()=>{d.remove();onContinue?.()};
  }

  const baseStartLevel=window.startLevel;
  if(baseStartLevel){
    window.startLevel=function(hub,level){
      ensureAliveState();
      const ngStory=state.ng?window.getNgPlusEncounterStory?.(hub,level):null;
      const arc=STORY_ARCS[hub],beat=ngStory?[ngStory.title,ngStory.body]:arc?.beats?.[level-1];
      const key=ngStory?`ng:${ngStory.routeKey}:${hub}:${level}`:`${hub}:${level}`;
      const firstClear=(state.progress?.[hub]||0)<level;
      if(firstClear&&beat&&!state.meta.storyArcSeen[key]){
        state.meta.storyArcSeen[key]=true;save();
        storyModal(beat[0],beat[1],`${ngStory?.area||arc.area} · Level ${level}`,()=>baseStartLevel(hub,level));
        return;
      }
      return baseStartLevel(hub,level);
    };
  }

  function maybeShowBossResolution(){
    if(!$('#map')?.classList.contains('active')||$('#rewardOverlay')?.classList.contains('open')||document.querySelector('#aliveStoryModal'))return;
    ensureAliveState();
    const pending=state.meta.pendingStoryResolution;
    if(pending===undefined||pending===null)return;
    state.meta.pendingStoryResolution=null;
    const hub=Number(typeof pending==='object'?pending.hub:pending);
    const ngStory=typeof pending==='object'&&state.ng&&pending.routeKey===(state.meta?.ngPlusRouteKey||state.endgame?.routeKey)?window.getNgPlusEncounterStory?.(hub,5):null;
    if(ngStory){
      state.meta.ngStoryBossResolved=state.meta.ngStoryBossResolved||{};
      state.meta.ngStoryBossResolved[`${pending.routeKey}:${hub}`]=true;save();
      storyModal(`${ngStory.area} secured`,ngStory.resolution,`${ngStory.world} · After the boss`,()=>{
        const status=document.querySelector('#mapStatus');if(status)status.textContent=ngStory.resolution;
      },true);
      return;
    }
    if(typeof pending==='object'||state.ng){save();return}
    const arc=STORY_ARCS[hub];state.meta.storyBossResolved[hub]=true;save();
    if(!arc)return;
    storyModal(`${arc.area} settles down`,arc.resolution,'After the boss',()=>{
      const status=document.querySelector('#mapStatus');if(status)status.textContent=arc.resolution;
    },true);
  }

  const baseOpenBattleReward=window.openBattleReward;
  if(baseOpenBattleReward){
    window.openBattleReward=function(title,boss){
      if(boss){
        ensureAliveState();
        const routeKey=state.ng&&(state.meta?.ngPlusRouteKey||state.endgame?.routeKey);
        state.meta.pendingStoryResolution=routeKey?{routeKey,hub:state.hub}:state.hub;
        save();
      }
      return baseOpenBattleReward(title,boss);
    };
  }
  setInterval(maybeShowBossResolution,240);

  const baseRenderVillage=window.renderVillage;
  if(baseRenderVillage){
    window.renderVillage=function(){
      const r=baseRenderVillage();
      if(!state.ng&&state.meta?.storyBossResolved?.[0]){
        const el=document.querySelector('#villageStatus');
        if(el)el.textContent='Placenta Creek has its food back. The villagers are celebrating carefully; the goose still lives here.';
      }
      return r;
    };
  }

  /* ---------- world-events / choice-memory ---------- */
  const EXTRA_EVENTS=[
    {id:'wounded-traveler-choice',title:'A Wounded Traveler',minHub:0,weight:15,once:true,dialog:'A wounded traveler has wrapped a receipt around an injured arm. The ink has transferred but the bandage has not helped.',options:[
      {label:'Help them · 10 coins',outcome:'You pay for medicine and get them back on their feet. They promise they will remember this.',reward:[{type:'coins',amount:-10}],setFlags:['helpedTraveler']},
      {label:'Ignore them',outcome:'You keep walking. The traveler watches you leave and says nothing.',reward:[],setFlags:['ignoredTraveler']},
      {label:'Rob them',outcome:'You take a purse that contains twelve coins and one deeply disappointed look.',reward:[{type:'coins',amount:12}],setFlags:['robbedTraveler']}
    ]},
    {id:'traveler-package',title:'A Package With Your Name On It',minHub:1,weight:30,once:true,requiresFlags:['helpedTraveler'],delayFromFlag:['helpedTraveler',2],dialog:'A courier catches up holding a parcel from the traveler you helped. He asks you to sign for it because the last recipient refused to believe him.',options:[
      {label:'Open the package',outcome:'Inside are coins, medicine, and a note that simply says: “You did not have to do that.”',reward:[{type:'coins',amount:14},{type:'drumstick',amount:1}],setFlags:['travelerRepaid']},
      {label:'Donate it forward',outcome:'You keep the medicine and send the coins to the next village. The courier looks annoyingly inspired.',reward:[{type:'drumstick',amount:1}],setFlags:['paidKindnessForward']}
    ]},
    {id:'merchant-cousin',title:'The Merchant’s Cousin',minHub:1,weight:32,once:true,requiresFlags:['robbedTraveler'],delayFromFlag:['robbedTraveler',2],dialog:'A merchant recognizes the description his cousin gave of the robber. He tries to sound calm while checking whether his own purse is still there.',options:[
      {label:'Pay them back · 10 coins',outcome:'The merchant takes the money, decides you are “medium terrible,” and lets the matter go.',reward:[{type:'coins',amount:-10}],setFlags:['madeTravelerAmends']},
      {label:'Deny everything',outcome:'The merchant writes down your face with impressive accuracy.',reward:[],setFlags:['deniedTravelerRobbery']},
      {label:'Leave before this becomes paperwork',outcome:'You leave. The merchant adds “runs from paperwork” to the description.',reward:[]}
    ]},
    {id:'escaped-bandit',title:'A Bandit Who Has Reconsidered Banditry',minHub:1,weight:12,once:true,dialog:'A former bandit puts both hands up before you draw a weapon. He says he has quit, then asks whether quitting requires paperwork.',options:[
      {label:'Let them go',outcome:'The bandit disappears into the trees, promising to owe you one favor and zero crimes.',reward:[],setFlags:['sparedRoadBandit']},
      {label:'Turn them in',outcome:'A patrol pays a small bounty and complains that the paperwork is heavier than the bandit.',reward:[{type:'coins',amount:10}],setFlags:['capturedRoadBandit']},
      {label:'Take their map',outcome:'You confiscate a marked route showing a hidden supply stash.',reward:[{type:'leather',amount:1},{type:'coins',amount:4}],setFlags:['tookBanditMap']}
    ]},
    {id:'bandit-repayment',title:'An Extremely Awkward Rescue',minHub:2,weight:28,once:true,requiresFlags:['sparedRoadBandit'],delayFromFlag:['sparedRoadBandit',2],dialog:'The former bandit appears just as a broken cart blocks the road. “I said I owed you one. This counts. Do not make it emotional.”',options:[
      {label:'Accept the hidden supplies',outcome:'They hand over a bundle of demon steel and vanish before you can say thanks.',reward:[{type:'steel',amount:1},{type:'coins',amount:5}],setFlags:['banditDebtPaid']},
      {label:'Ask for information instead',outcome:'They point out a safer route and mention that the next area is being watched.',reward:[{type:'hp',amount:4}],setFlags:['banditIntel']}
    ]},
    {id:'lost-merchant',title:'A Merchant Holding the Map Upside Down',minHub:0,weight:13,once:true,dialog:'A merchant has held the map upside down long enough to accuse the kingdom of moving north.',options:[
      {label:'Guide them to the road',outcome:'You point them in the correct direction. They promise to mention your name to other traders.',reward:[{type:'coins',amount:3}],setFlags:['helpedMerchantRoad']},
      {label:'Charge a navigation fee',outcome:'They pay five coins, then rotate the map and realize what happened.',reward:[{type:'coins',amount:5}],setFlags:['chargedMerchantToll']},
      {label:'Point dramatically in a random direction',outcome:'The merchant thanks you and walks directly toward a swamp.',reward:[],setFlags:['misdirectedMerchant']}
    ]},
    {id:'merchant-thanks',title:'Roadside Trade Credit',minHub:1,weight:25,once:true,requiresFlags:['helpedMerchantRoad'],delayFromFlag:['helpedMerchantRoad',2],dialog:'A trader recognizes your name from the lost merchant. “Apparently you are good at maps. Here, take the useful part of that reputation.”',options:[
      {label:'Accept the thank-you',outcome:'The trader hands you coins and a strip of leather.',reward:[{type:'coins',amount:8},{type:'leather',amount:1}],setFlags:['merchantRoadRepaid']},
      {label:'Ask them to help someone else',outcome:'They keep the coins but hand you a small medical ration for the road.',reward:[{type:'drumstick',amount:1}],setFlags:['merchantPaidForward']}
    ]},
    {id:'broken-shrine',title:'A Broken Roadside Shrine',minHub:1,weight:10,once:true,dialog:'A roadside shrine has fallen. Three coins sit beside a note asking anyone who finds them to fix the shrine first.',options:[
      {label:'Repair the shrine',outcome:'You prop the shrine upright. Nothing supernatural happens, which is honestly reassuring.',reward:[{type:'hp',amount:4}],setFlags:['repairedShrine']},
      {label:'Take the coins',outcome:'You take the coins. A nearby crow watches you with the authority of a judge.',reward:[{type:'coins',amount:3}],setFlags:['robbedShrine']},
      {label:'Leave it alone',outcome:'You respect the extremely clear note.',reward:[]}
    ]},
    {id:'shrine-rumor',title:'The Crow Has Witnesses',minHub:2,weight:27,once:true,requiresFlags:['robbedShrine'],delayFromFlag:['robbedShrine',2],dialog:'A pilgrim points at you. “A crow described someone exactly like you stealing shrine coins.” The crow is standing beside them.',options:[
      {label:'Return five coins',outcome:'The pilgrim accepts the repayment. The crow continues judging you, but with less paperwork.',reward:[{type:'coins',amount:-5}],setFlags:['repaidShrine']},
      {label:'Question the reliability of bird testimony',outcome:'The pilgrim admits this is a fair legal point. The crow does not.',reward:[],setFlags:['arguedWithCrowLaw']}
    ]},
    {id:'screaming-forest',title:'Screaming From the Trees',minHub:1,weight:11,once:false,dialog:'Someone shouts from the forest that they are not in danger. They then ask which direction danger usually comes from.',options:[
      {label:'Investigate',outcome:'You find a lost hunter and guide them back to the road. They share a few supplies.',reward:[{type:'leather',amount:1},{type:'coins',amount:3}],setFlags:['helpedLostHunter']},
      {label:'Call out directions from here',outcome:'The screaming stops, then resumes from a slightly better direction.',reward:[]},
      {label:'Pretend you heard nothing',outcome:'The forest accepts your decision without comment. The screaming does not.',reward:[]}
    ]},
    {id:'bridge-paperwork',title:'Bridge Troll, Administrative Division',minHub:2,weight:10,once:true,dialog:'A troll blocks a bridge barely longer than its desk. It requests a crossing permit and refuses to accept the form it handed you yesterday.',options:[
      {label:'Pay the filing fee · 4 coins',outcome:'The troll stamps a leaf, calls it official, and waves you through.',reward:[{type:'coins',amount:-4}],setFlags:['paidBridgePermit']},
      {label:'Tell a terrible joke',outcome:'The troll laughs so hard it forgets the paperwork and gives you a bone it was using as a pen.',reward:[{type:'bones',amount:1}],setFlags:['madeTrollLaugh']},
      {label:'Forge Form B-12',outcome:'You invent a form. The troll respects the confidence more than the handwriting.',reward:[{type:'coins',amount:2}],setFlags:['forgedBridgePermit']}
    ]},
    {id:'abandoned-camp',title:'The Abandoned Camp',minHub:2,weight:9,once:true,dialog:'A deserted camp has a warm fire and a journal from Timmy’s former apprentice. The last page is a resignation letter written in a hurry.',options:[
      {label:'Read the journal',outcome:'The notes confirm the cemetery trouble is organized from deeper inside Grave Mistake.',reward:[{type:'coins',amount:2}],setFlags:['learnedTimmyRumor']},
      {label:'Take the supplies',outcome:'You salvage medicine and leave the journal where it is.',reward:[{type:'drumstick',amount:1}],setFlags:['tookCampSupplies']},
      {label:'Put out the fire and leave',outcome:'At least nobody will burn down the cemetery. Again.',reward:[]}
    ]},
    {id:'fortress-deserter',title:'A Fortress Deserter',minHub:4,weight:18,once:true,dialog:'A fortress soldier has removed every piece of identifying armor except the extremely identifiable fortress boots.',options:[
      {label:'Let them escape',outcome:'They whisper a warning about the throne room and disappear down the road.',reward:[{type:'coins',amount:4}],setFlags:['sparedFortressDeserter']},
      {label:'Ask for supplies',outcome:'They hand over demon steel in exchange for pretending this conversation never happened.',reward:[{type:'steel',amount:1}],setFlags:['tradedWithDeserter']},
      {label:'Send them back',outcome:'They stare at you for a long time, then walk back toward the fortress very, very slowly.',reward:[],setFlags:['returnedDeserter']}
    ]},
    {id:'deserter-warning',title:'A Message Scratched Into the Road',minHub:4,weight:35,once:true,requiresFlags:['sparedFortressDeserter'],delayFromFlag:['sparedFortressDeserter',1],dialog:'A chalk mark uses the same symbol the deserter showed you. Under it: “WARDEN WATCHES THE DAIS. LUCIEN WATCHES THE THRONE.”',options:[
      {label:'Memorize the warning',outcome:'The message will not change your damage numbers, but it makes the final approach feel considerably less blind.',reward:[{type:'hp',amount:5}],setFlags:['deserterWarningReceived']},
      {label:'Erase the message',outcome:'You wipe it away so the fortress cannot learn who left it.',reward:[{type:'coins',amount:3}],setFlags:['protectedDeserterIdentity']}
    ]}
  ];

  if(Array.isArray(window.OVERWORLD_EVENTS)){
    const known=new Set(window.OVERWORLD_EVENTS.map(e=>e.id));
    EXTRA_EVENTS.forEach(e=>{if(!known.has(e.id))window.OVERWORLD_EVENTS.push(e)});
  }

  function eventEligible(ev,hub,mem){
    const travel=Number(state.meta.travel||0);
    if((ev.minHub||0)>hub)return false;
    if(ev.maxHub!==undefined&&hub>ev.maxHub)return false;
    if(ev.once&&mem.eventsSeen.includes(ev.id))return false;
    if((mem.cooldownUntil[ev.id]||0)>travel)return false;
    if(ev.requiresFlags&&!ev.requiresFlags.every(f=>!!mem.flags[f]))return false;
    if(ev.excludesFlags&&ev.excludesFlags.some(f=>!!mem.flags[f]))return false;
    if(ev.delayFromFlag){const [flag,delay]=ev.delayFromFlag,at=Number(mem.flagTravel[flag]??travel);if(!mem.flags[flag]||travel-at<Number(delay||0))return false}
    return true;
  }

  function pickEvent(hub){
    const mem=ensureAliveState(),pool=(Array.isArray(window.OVERWORLD_EVENTS)?window.OVERWORLD_EVENTS:[]).filter(e=>eventEligible(e,hub,mem));
    if(!pool.length)return null;
    const total=pool.reduce((s,e)=>s+Number(e.weight||10),0);let roll=Math.random()*total;
    return pool.find(e=>(roll-=Number(e.weight||10))<=0)||pool[pool.length-1];
  }

  function applyRewards(rewards){
    ensureCombatResources();
    const lines=[];
    for(const r of rewards||[]){
      let amount=Number(r.amount||0);
      if(r.type==='quest'){
        if(r.text)state.meta.quest=r.text;
        lines.push(r.text||'A new objective was recorded.');
      }else if(r.type==='coins'){
        const before=state.coins;state.coins=Math.max(0,state.coins+amount);amount=state.coins-before;lines.push(`${amount>=0?'+':''}${amount} coins`);
      }else if(['leather','bones','steel'].includes(r.type)){
        state.materials[r.type]=Math.max(0,Number(state.materials[r.type]||0)+amount);lines.push(`${amount>=0?'+':''}${amount} ${r.type==='steel'?'demon steel':r.type}`);
      }else if(['potion','drumstick','midPotion','highPotion','antidote','cursebreaker'].includes(r.type)){
        const key=r.type==='potion'?'drumstick':r.type;
        state.meta.items[key]=Math.max(0,Number(state.meta.items[key]||0)+amount);
        const label=key==='drumstick'?'Drumstick':key==='midPotion'?'Mid Potion':key==='highPotion'?'High Potion':key[0].toUpperCase()+key.slice(1);
        lines.push(`${amount>=0?'+':''}${amount} ${label}`);
      }else if(r.type==='hp'){
        const before=state.hp;state.hp=Math.min(state.maxHp,Math.max(1,state.hp+amount));lines.push(`+${state.hp-before} HP`);
      }
    }
    return lines.length?lines:['No immediate reward.'];
  }

  function rememberChoice(ev,opt,index){
    const mem=ensureAliveState(),travel=Number(state.meta.travel||0);
    for(const flag of opt.setFlags||[]){mem.flags[flag]=true;mem.flagTravel[flag]=travel}
    for(const flag of opt.clearFlags||[]){mem.flags[flag]=false}
    if(ev.once&&!mem.eventsSeen.includes(ev.id))mem.eventsSeen.push(ev.id);
    if(!ev.once)mem.cooldownUntil[ev.id]=travel+2;
    mem.history.push({event:ev.id,choice:index,travel,hub:state.hub});
    if(mem.history.length>80)mem.history.splice(0,mem.history.length-80);
  }

  function enhancedOverworldEvent(hub){
    ensureAliveState();
    if(document.querySelector('#overworldEventCard'))return true;
    const travel=Number(state.meta.travel||0),last=Number(state.meta.aliveLastEventTravel??-99);
    if(travel-last<2)return false;
    const chance=[.27,.24,.21,.18,.16][hub]??.18;
    if(Math.random()>=chance)return false;
    const ev=pickEvent(hub);if(!ev)return false;
    state.meta.aliveLastEventTravel=travel;
    const d=document.createElement('div');d.id='overworldEventCard';d.className='road-event';
    d.innerHTML=`<div class="road-event-card"><h2>${esc(ev.title)}</h2><p>${esc(ev.dialog)}</p><div class="event-options">${ev.options.map((o,i)=>`<button data-overworld-choice="${i}">${esc(o.label)}</button>`).join('')}</div></div>`;
    document.querySelector('#map')?.appendChild(d);
    d.querySelectorAll('[data-overworld-choice]').forEach(btn=>btn.onclick=()=>{
      const idx=Number(btn.dataset.overworldChoice),opt=ev.options[idx]||ev.options[0];
      rememberChoice(ev,opt,idx);
      const rewards=applyRewards(opt.reward);
      save();
      d.querySelector('.road-event-card').innerHTML=`<h2>${esc(ev.title)}</h2><p>${esc(opt.outcome)}</p><div class="event-reward-result"><b>Result</b>${rewards.map(x=>`<span>${esc(x)}</span>`).join('')}</div><button class="event-choice" data-overworld-continue>Continue</button>`;
      d.querySelector('[data-overworld-continue]').onclick=()=>{d.remove();setTimeout(()=>openLevelSelect(hub),250)};
    });
    return true;
  }
  window.triggerOverworldEvent=enhancedOverworldEvent;

  /* Let existing NPC talk reflect selected delayed choices without redesigning the dialogue system. */
  const baseChooseDialogue=window.chooseInteriorDialogue;
  if(baseChooseDialogue){
    window.chooseInteriorDialogue=function(type){
      const base=baseChooseDialogue(type),f=ensureAliveState().flags;
      if(type==='merchant'&&f.robbedTraveler&&!f.madeTravelerAmends)return `The merchant narrows their eyes. “My cousin described someone with your exact terrible posture.” ${base}`;
      if(type==='merchant'&&f.helpedMerchantRoad)return `“Word is you helped one of ours find the road instead of the swamp. Decent of you.” ${base}`;
      if(type==='cathedral'&&f.repairedShrine)return `“Someone repaired the roadside shrine. Small mercies count, even when nobody sees them.” ${base}`;
      if(type==='blacksmith'&&f.sparedRoadBandit&&f.banditDebtPaid)return `“A former bandit left supplies here and said they were settling a debt. I decided not to ask.” ${base}`;
      return base;
    };
  }

  /* Keep delayed consequences discoverable in ordinary map text after reloads. */
  function memoryStatus(){
    if(!$('#map')?.classList.contains('active'))return;
    const f=ensureAliveState().flags,status=document.querySelector('#mapStatus');
    if(!status||document.querySelector('#overworldEventCard')||document.querySelector('#aliveStoryModal'))return;
    if(f.travelerRepaid&&!state.meta.choiceMemory.consequencesSeen.includes('travelerRepaid')){
      state.meta.choiceMemory.consequencesSeen.push('travelerRepaid');save();status.textContent='The road remembers: the traveler you helped eventually repaid the favor.';
    }else if(f.madeTravelerAmends&&!state.meta.choiceMemory.consequencesSeen.includes('madeTravelerAmends')){
      state.meta.choiceMemory.consequencesSeen.push('madeTravelerAmends');save();status.textContent='The road remembers: you paid back the traveler’s family and ended the complaint.';
    }
  }
  setInterval(memoryStatus,500);

  /* Initial layer setup for debug-started combat or restored screens. */
  if($('#combat')?.classList.contains('active'))ensureCombatMotion();
})();

/* Combat cards lift on hover or keyboard focus and activate on one click or tap. */
(()=>{
  const screen=document.querySelector('#combat');
  const deck=screen?.querySelector('.battle-bottom .cards');
  if(!screen||!deck)return;
  function busy(){return !screen.classList.contains('active')||!combat||window.__battleNoticeOpen||window.__combatPreAction||window.__combatEnemyTurn||combat.turnActionUsed||combat.playerHp<=0||combat.enemyHp<=0||!!document.querySelector('.death-modal')}
  window.addEventListener('click',event=>{
    const card=event.target.closest?.('#combat .battle-bottom .card[data-card]');
    if(!card)return;
    if(busy()||card.classList.contains('is-locked')||card.getAttribute('aria-disabled')==='true'){
      event.preventDefault();event.stopPropagation();return;
    }
    // Let the existing card handler run on the first click for every pointer type.
  },true);
  setInterval(()=>{
    deck.classList.toggle('card-deck-enemy-turn',!!(screen.classList.contains('active')&&(window.__combatEnemyTurn||window.__battleNoticeOpen)));
  },80);
})();;
