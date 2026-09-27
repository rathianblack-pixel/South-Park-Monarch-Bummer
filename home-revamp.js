/* House armor doll and boss trophy wall. Uses the existing armor and victory save state. */
(()=>{
  const room=document.querySelector('#interior'),backdrop=room?.querySelector('.interior-backdrop'),game=document.querySelector('.game');
  if(!room||!backdrop||!game)return;
  const trophies=[
    {id:'barnaby',name:'Sir Barnaby’s Shield',enemy:/sir barnaby/i,area:0,src:'Textures/UI/House/Trophies/barnaby-shield.png'},
    {id:'gloomfang',name:'Gloomfang’s Head',enemy:/gloomfang/i,area:1,src:'Textures/UI/House/Trophies/gloomfang-head.png'},
    {id:'timmy',name:'Lich King Timmy’s Crown',enemy:/lich king timmy/i,area:2,src:'Textures/UI/House/Trophies/timmy-crown.png'},
    {id:'minotaur',name:'Minotaur’s Axe',enemy:/minotaur/i,area:3,src:'Textures/UI/House/Trophies/minotaur-axe.png'},
    {id:'lucien',name:'Lucien’s Robe',enemy:/monarch lucien/i,area:4,src:'Textures/UI/House/Trophies/lucien-robe.png'}
  ];
  const effects=[
    'Guarded critical hits are more likely with Royal Armor.',
    'Bow attacks deal 20% more damage.',
    'A chance to soften an incoming hit by 2 damage.',
    'Incoming damage is reduced by 20%.',
    'A 12% chance for a burst of double damage.',
    'Healing items and spells restore 2 extra HP.',
    'Guard reduces incoming damage by another 10%.',
    'Combat coin rewards increase by 20%, rounded up.',
    'Enemy signature ailments and Bleeding are less likely to take hold.',
    'Village raid attacks deal 10% less damage to you.',
    'Burning and Bleeding deal 1 less damage per turn, minimum 1.',
    'Attacks gain 5 percentage points of accuracy.',
    'Damaging hits and Sword counters deal 2 extra damage to bosses.'
  ];
  const femaleNames=['Placenta Creek Wayfarer','Moonleaf Huntress','Graveveil Warden','Runebloom Battlemage','Monarch’s Eclipse'];
  const name=i=>i<5&&state.gender==='female'?femaleNames[i]:ARMOR_NAMES[i]||`Armor Set ${i+1}`;
  const sprite=i=>asset(ARMOR_SETS[state.gender==='female'?'female':'male']?.[i]);
  const owned=()=>[...new Set(state.unlockedArmor?.[state.gender]||[0])].filter(i=>Number.isInteger(i)&&i>=0&&i<ARMOR_NAMES.length).sort((a,b)=>a-b);
  const equipped=()=>Number(state.armorSets?.[state.gender]||0);
  const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const trophySet=()=>{state.meta=state.meta||{};if(!Array.isArray(state.meta.houseTrophies))state.meta.houseTrophies=[];return state.meta.houseTrophies};
  function reconcileTrophies(){
    const set=trophySet(),observed=Array.isArray(state.meta?.codexUnlocked)?state.meta.codexUnlocked:[];
    let changed=false;
    for(const t of trophies){
      const beaten=observed.some(n=>t.enemy.test(String(n)))||(!state.ng&&!!state.meta?.armorRewardsClaimed?.[t.area])||(t.id==='lucien'&&!!state.won);
      if(beaten&&!set.includes(t.id)){set.push(t.id);changed=true}
    }
    if(changed)save();
  }
  function recordBoss(){
    if(!combat?.boss||state.ng)return;
    const t=trophies.find(x=>x.enemy.test(String(combat.enemy)));
    if(t&&!trophySet().includes(t.id)){trophySet().push(t.id);save()}
  }
  const oldRecord=window.sideArmor?.recordVictory;
  if(window.sideArmor)window.sideArmor.recordVictory=function(...args){oldRecord?.apply(this,args);recordBoss()};
  reconcileTrophies();
  const doll=document.createElement('button');doll.type='button';doll.className='house-doll-hotspot';doll.setAttribute('aria-label','Inspect armor doll');doll.dataset.label='Armor Doll';doll.innerHTML='<span class="house-interact-dot" aria-hidden="true"></span>';
  const wall=document.createElement('button');wall.type='button';wall.className='house-wall-hotspot';wall.setAttribute('aria-label','View trophy wall');wall.dataset.label='Trophy Wall';wall.innerHTML='<span class="house-interact-dot" aria-hidden="true"></span>';
  backdrop.append(doll,wall);
  doll.onclick=()=>openArmor();wall.onclick=()=>openTrophies();
  const curtain=document.createElement('div');curtain.className='home-scene-curtain';curtain.setAttribute('aria-hidden','true');game.appendChild(curtain);
  let viewer=null,transitioning=false,preview=0;
  function switchView(build){
    if(transitioning||!room.classList.contains('active')||state._building!=='home')return;
    transitioning=true;curtain.classList.add('cover');
    setTimeout(()=>{
      viewer?.remove();viewer=build();game.appendChild(viewer);
      requestAnimationFrame(()=>curtain.classList.remove('cover'));
      setTimeout(()=>{transitioning=false;viewer?.querySelector('[data-home-close]')?.focus()},260);
    },260);
  }
  function close(){
    if(!viewer||transitioning)return;
    transitioning=true;curtain.classList.add('cover');
    setTimeout(()=>{viewer?.remove();viewer=null;requestAnimationFrame(()=>curtain.classList.remove('cover'));setTimeout(()=>{transitioning=false;doll.focus()},260)},260);
  }
  function shell(kind,heading){
    const el=document.createElement('section');el.className=`home-viewer home-${kind}`;el.setAttribute('role','dialog');el.setAttribute('aria-modal','true');el.setAttribute('aria-label',heading);
    const night=window.gameClock?.getState?.()?.nightBlend||0;
    el.style.setProperty('--home-night',Math.max(0,Math.min(1,night)));
    el.innerHTML=`<div class="home-viewer-bg"></div><header><span>YOUR HOUSE</span><h2>${escape(heading)}</h2>${kind==='armor'?`<span class="home-hp-chip">HP ${Math.max(0,Number(state.hp)||0)} / ${state.maxHp}</span>`:''}<button type="button" data-home-close aria-label="Close ${escape(heading)}">×</button></header><div class="home-viewer-body"></div>`;
    el.querySelector('[data-home-close]').onclick=close;
    return el;
  }
  function armorPanel(el){
    const index=preview,current=equipped(),data=activeClassStats(),baseAttack=data.damage+combatUpgradeLevel()*2;
    const benefit=()=>{
      if(index===0)return ['GUARDED CRITICAL','50% → 65%','When a guarded critical is primed.'];
      if(index===1)return state.gear==='bow'?['BOW HIT',`${baseAttack} → ${Math.round(baseAttack*1.2)}`,'Against a neutral target before critical hits.']:['BOW DAMAGE','+20%','Applies when you use a Bow.'];
      if(index===2)return ['DAMAGE SOFTENED','25% CHANCE','An incoming hit loses 2 damage when this triggers.'];
      if(index===3)return ['INCOMING DAMAGE','−20%','Before your class defense is applied.'];
      if(index===4)return ['LUCKY BURST','12% CHANCE','A hit can deal double damage.'];
      if(index===5)return ['HEALING','+2 HP','Healing items and spells restore more.'];
      if(index===6)return ['GUARD DAMAGE','−10% MORE','Applied after your normal Guard reduction.'];
      if(index===7)return ['COMBAT COINS','+20%','Rounded up on coin rewards.'];
      if(index===8)return ['INCIDENTAL BLEED','50% → 40%','Enemy signature ailment chances also fall by 20%.'];
      if(index===9)return ['RAID DAMAGE','−10%','Only during village raids.'];
      if(index===10)return ['BURN / BLEED','−1 EACH TURN','Damage over time still deals at least 1.'];
      if(index===11){const before=Math.min(100,Math.round(data.accuracy*100));return ['CLASS ACCURACY',`${before}% → ${Math.min(100,before+5)}%`,'Enemy dodge and other effects still apply.']}
      return ['BOSS HIT',`${baseAttack} → ${baseAttack+2}`,'Sword counters also gain 2 damage.'];
    };
    const [label,value,note]=benefit();
    const body=el.querySelector('.home-viewer-body');
    body.innerHTML=`<div class="home-armor-focus"><div class="home-armor-art"><img src="${escape(sprite(index))}" alt="${escape(name(index))}"></div><div class="home-armor-info"><small>${index===current?'EQUIPPED':'ARMOR PREVIEW'}</small><h3>${escape(name(index))}</h3><p class="home-armor-effect">${escape(effects[index]||'No special effect.')}</p><div class="home-benefit"><span>${escape(label)}</span><strong>${escape(value)}</strong><small>${escape(note)}</small></div>${index===current?'':`<p class="home-comparison">Currently wearing ${escape(name(current))}: ${escape(effects[current]||'No special effect.')}</p>`}<button type="button" data-home-equip="${index}" ${index===current?'disabled':''}>${index===current?'Equipped':'Equip this set'}</button></div></div><div class="home-armor-list" aria-label="Unlocked armor sets">${owned().map(i=>`<button type="button" data-home-preview="${i}" class="${i===index?'selected':''}" aria-label="Preview ${escape(name(i))}" title="${escape(name(i))}"><img src="${escape(sprite(i))}" alt=""></button>`).join('')}</div>`;
    body.querySelectorAll('[data-home-preview]').forEach(b=>b.onclick=()=>{preview=Number(b.dataset.homePreview);armorPanel(el)});
    body.querySelector('[data-home-equip]').onclick=()=>{
      if(!owned().includes(index))return;
      state.armorSets[state.gender]=index;save();refreshHouseCharacter();armorPanel(el);
    };
  }
  function openArmor(){
    preview=owned().includes(equipped())?equipped():owned()[0]||0;
    switchView(()=>{const el=shell('armor','Armor Doll');armorPanel(el);return el});
  }
  function openTrophies(){
    reconcileTrophies();
    switchView(()=>{
      const el=shell('trophies','Trophy Wall'),set=trophySet();
      el.querySelector('.home-viewer-body').innerHTML=`<div class="home-trophy-grid">${trophies.map((t,i)=>{
        const unlocked=set.includes(t.id);
        return `<article class="home-trophy ${unlocked?'earned':'locked'}"><span class="home-trophy-number">0${i+1}</span><div class="home-trophy-frame">${unlocked?`<img src="${t.src}" alt="${escape(t.name)}">`:'<span class="home-trophy-placeholder" aria-hidden="true">?</span>'}</div><h3>${unlocked?escape(t.name):'Undiscovered'}</h3><small>${unlocked?'BOSS DEFEATED':'LOCKED'}</small></article>`
      }).join('')}</div>`;
      return el;
    });
  }
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&viewer){e.preventDefault();close()}});
  let houseAssetsWarm=false;
  setInterval(()=>{
    const active=room.classList.contains('active')&&state._building==='home';
    room.classList.toggle('house-revamp',active);
    if(active&&!houseAssetsWarm){houseAssetsWarm=true;['Textures/Buildings/house-night.png','Textures/UI/House/armor-doll.png',...trophies.map(t=>t.src)].forEach(src=>window.ensureSceneImage?.(src))}
    if(!active&&viewer){viewer.remove();viewer=null;curtain.classList.remove('cover');transitioning=false}
  },150);
  window.homeRevamp={openArmor,openTrophies,reconcileTrophies};
})();
