/*
 * World Reactivity Update
 * Builds on the Alive Update without replacing its combat/progression/save systems.
 * Adds: hidden world memory, recurring NPCs, delayed consequences, enemy personalities,
 * boss phase presentation/behavior, damaged enemy/NPC art, rare encounters, area evolution,
 * combat interruption/stagger interactions, screen transitions, and ending callbacks.
 */
(()=>{
  'use strict';
  if(window.__worldReactivityReady)return;
  window.__worldReactivityReady=true;

  const qs=s=>document.querySelector(s);
  const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
  const travelNow=()=>Number(state.meta?.travel||0);
  const reduceMotion=()=>window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;

  function ensureReactivity(){
    state.meta=state.meta||{};
    const r=state.meta.worldReactivity=state.meta.worldReactivity||{};
    r.version=2;
    r.reputation=r.reputation||{generosity:0,greed:0,mercy:0,violence:0,nerve:0};
    for(const k of ['generosity','greed','mercy','violence','nerve'])r.reputation[k]=Number(r.reputation[k]||0);
    r.npcRelations=r.npcRelations||{};
    r.npcSeen=r.npcSeen||{};
    r.discoveredNpcs=Array.isArray(r.discoveredNpcs)?r.discoveredNpcs:[];
    r.flags=r.flags||{};
    r.flagTravel=r.flagTravel||{};
    r.consequences=Array.isArray(r.consequences)?r.consequences:[];
    r.processedAliveChoices=Array.isArray(r.processedAliveChoices)?r.processedAliveChoices:[];
    r.areaStates=r.areaStates||{};
    r.bossPhases=r.bossPhases||{};
    r.battleHistory=Array.isArray(r.battleHistory)?r.battleHistory:[];
    r.lastNpcTravel=Number(r.lastNpcTravel??-99);
    r.lastConsequenceTravel=Number(r.lastConsequenceTravel??-99);
    return r;
  }
  const R=()=>ensureReactivity();
  ensureReactivity();

  function markFlag(flag,value=true){
    const r=R();
    r.flags[flag]=value;
    if(value)r.flagTravel[flag]=travelNow();
  }
  function hasFlag(flag){return !!R().flags[flag]}
  function relation(id,delta=0){
    const r=R();
    r.npcRelations[id]=Number(r.npcRelations[id]||0)+Number(delta||0);
    return r.npcRelations[id];
  }
  function addRep(delta={}){
    const rep=R().reputation;
    Object.entries(delta).forEach(([k,v])=>{if(k in rep)rep[k]=clamp(Number(rep[k]||0)+Number(v||0),-20,20)});
  }
  function recordConsequence(id){const r=R();if(!r.consequences.includes(id))r.consequences.push(id)}
  function discovered(id){const r=R();if(!r.discoveredNpcs.includes(id))r.discoveredNpcs.push(id);r.npcSeen[id]=Number(r.npcSeen[id]||0)+1}

  function dominantTemperament(){
    const p=R().reputation;
    const pairs=[['generous',p.generosity-p.greed],['greedy',p.greed-p.generosity],['merciful',p.mercy-p.violence],['violent',p.violence-p.mercy],['bold',p.nerve],['cautious',-p.nerve]];
    pairs.sort((a,b)=>b[1]-a[1]);
    return pairs[0][1]>=2?pairs[0][0]:'unreadable';
  }
  function reputationRumor(){
    const t=dominantTemperament();
    return t==='generous'?'People on the road have started calling you suspiciously decent.':
      t==='greedy'?'Merchants have learned to count their coins twice when you arrive.':
      t==='merciful'?'Enemies who survived you have apparently been talking.':
      t==='violent'?'Your reputation tends to reach a room a few seconds before you do.':
      t==='bold'?'You have developed a reputation for walking toward problems that are clearly labeled.':
      t==='cautious'?'People have noticed your remarkable commitment to surviving other people’s problems.':
      'Nobody can agree what kind of person you are, which may be the most accurate reputation possible.';
  }

  /* Learn from the choices already stored by the Alive Update. */
  const ALIVE_REPUTATION={
    'wounded-traveler-choice':[{generosity:2,mercy:1},{},{greed:2,violence:1}],
    'traveler-package':[{}, {generosity:2}],
    'merchant-cousin':[{mercy:1,greed:-1},{greed:1},{}],
    'escaped-bandit':[{mercy:2},{nerve:1},{greed:1}],
    'bandit-repayment':[{}, {nerve:1}],
    'lost-merchant':[{generosity:1},{greed:1},{nerve:-1}],
    'merchant-thanks':[{}, {generosity:1}],
    'broken-shrine':[{generosity:1},{greed:2},{}],
    'shrine-rumor':[{mercy:1,greed:-1},{nerve:1}],
    'screaming-forest':[{generosity:1,nerve:1},{},{nerve:-1}],
    'bridge-paperwork':[{}, {nerve:1},{greed:1}],
    'abandoned-camp':[{nerve:1},{greed:1},{}],
    'fortress-deserter':[{mercy:2},{greed:1},{violence:1}],
    'deserter-warning':[{nerve:1},{mercy:1}]
  };
  function processAliveChoices(){
    const history=state.meta?.choiceMemory?.history||[],r=R();
    history.forEach((h,index)=>{
      const key=`${h.event}:${h.travel}:${h.choice}:${index}`;
      if(r.processedAliveChoices.includes(key))return;
      r.processedAliveChoices.push(key);
      const delta=ALIVE_REPUTATION[h.event]?.[Number(h.choice)||0];
      if(delta)addRep(delta);
    });
    if(r.processedAliveChoices.length>160)r.processedAliveChoices=r.processedAliveChoices.slice(-160);
  }

  const NPC_ROOT='Textures/NPCs/Reactivity';
  const npcAsset=(id,damaged=false)=>`${NPC_ROOT}/${damaged?'Damaged':'Normal'}/${id}${damaged?'-damaged':''}.png`;
  const NPCS=[
    {id:'corvin-wounded-traveler',name:'Corvin',role:'Wounded Traveler',hubs:[0,1,2],type:'aid',damagedFirst:true,rare:false,intro:'Corvin is sitting beside the road again, insisting the blood is “mostly decorative.”',quirk:'He remembers faces much better than directions.'},
    {id:'merrick-shady-merchant',name:'Merrick',role:'Shady Merchant',hubs:[0,1,2,3,4],type:'merchant',intro:'Merrick opens his coat to reveal several products that definitely did not come with receipts.',quirk:'Every item is “almost legal” in a different jurisdiction.'},
    {id:'mabel-village-gossip',name:'Mabel',role:'Village Gossip',hubs:[0,1],type:'social',intro:'Mabel appears to have learned three rumors since you last blinked.',quirk:'She can turn a minor event into regional mythology before lunch.'},
    {id:'brom-ex-guard',name:'Brom',role:'Ex-Guard',hubs:[0,3,4],type:'authority',damagedFirst:true,intro:'Brom studies the road the way someone studies a former employer from across a courtroom.',quirk:'He has opinions about every fortress door and most hinges.'},
    {id:'lyra-forest-herbalist',name:'Lyra',role:'Forest Herbalist',hubs:[1,2],type:'healer',intro:'Lyra is kneeling over a patch of herbs that look medicinal and mildly offended.',quirk:'She names every plant and insults anyone who calls them weeds.'},
    {id:'pipwick-bard',name:'Pipwick',role:'Traveling Bard',hubs:[0,1,2,3,4],type:'performer',rare:true,intro:'Pipwick is composing a song about your adventures despite knowing only twelve percent of the facts.',quirk:'The remaining eighty-eight percent rhymes.'},
    {id:'oddo-gravekeeper',name:'Oddo',role:'Gravekeeper',hubs:[2],type:'social',intro:'Oddo leans on his shovel and watches the cemetery with professional disappointment.',quirk:'He can identify a ghost by the kind of complaint it makes.'},
    {id:'cassian-relic-hunter',name:'Cassian',role:'Relic Hunter',hubs:[2,3,4],type:'scholar',rare:true,intro:'Cassian unrolls a map covered in circles, arrows, and one drawing labeled “probably cursed.”',quirk:'He treats mortal danger as a cartography problem.'},
    {id:'greta-angry-cousin',name:'Greta',role:'Angry Cousin',hubs:[0,1,2,3],type:'authority',intro:'Greta looks at you like she already has a version of this conversation prepared.',quirk:'She has relatives everywhere and evidence for most of them.'},
    {id:'sister-mara-apothecary',name:'Sister Mara',role:'Nun Apothecary',hubs:[0,2,4],type:'healer',intro:'Sister Mara carries enough bottles to heal a battalion or poison an extremely large soup.',quirk:'She labels medicine clearly, which makes her suspiciously competent.'},
    {id:'tobin-runaway-squire',name:'Tobin',role:'Runaway Squire',hubs:[0,1,4],type:'aid',damagedFirst:true,intro:'Tobin is hiding behind a helmet that is approximately twice as brave as he is.',quirk:'He has quit three knights and none of them have noticed yet.'},
    {id:'bernard-town-crier',name:'Bernard',role:'Town Crier',hubs:[0,3,4],type:'social',intro:'Bernard clears his throat with the force of an approaching weather system.',quirk:'He can make “lost chicken” sound like a royal emergency.'},
    {id:'aldrin-magistrate',name:'Aldrin',role:'Suspicious Magistrate',hubs:[0,3,4],type:'authority',rare:true,intro:'Aldrin is holding a ledger open to a page that somehow already contains your name.',quirk:'He believes coincidence is just paperwork that has not confessed yet.'},
    {id:'bruna-innkeeper',name:'Bruna',role:'Rough Innkeeper',hubs:[0,1,3],type:'merchant',intro:'Bruna has supplies, a travel mug, and the expression of someone who has already cleaned up one heroic mess today.',quirk:'Her definition of hospitality includes strict furniture survival rules.'},
    {id:'fenn-courier',name:'Fenn',role:'Nervous Courier',hubs:[0,1,2,3,4],type:'aid',damagedFirst:true,intro:'Fenn arrives out of breath carrying letters addressed to people who are, statistically, somewhere else.',quirk:'He has never delivered a message without accidentally learning a secret.'},
    {id:'agatha-hedge-witch',name:'Agatha',role:'Hedge Witch',hubs:[1,2,3],type:'healer',rare:true,intro:'Agatha is brewing something purple beside the road and refuses to explain why the spoon is screaming.',quirk:'Her remedies work, which is more concerning than if they did not.'},
    {id:'perrin-tax-collector',name:'Perrin',role:'Tax Collector',hubs:[0,3,4],type:'authority',rare:true,intro:'Perrin produces a tiny stamp and a very large sense of authority.',quirk:'He can calculate a travel levy before you finish saying “what levy?”'},
    {id:'osric-retired-knight',name:'Osric',role:'Retired Knight',hubs:[0,1,4],type:'authority',intro:'Osric examines your stance and sighs the sigh of a man who has corrected too many squires.',quirk:'His retirement still contains an unreasonable amount of armor.'},
    {id:'garrick-swamp-fisherman',name:'Garrick',role:'Swamp Fisherman',hubs:[1,3],type:'wanderer',intro:'Garrick is carrying three fish and one story that is clearly larger than all of them.',quirk:'Every monster he has seen was “about this big” with his arms fully extended.'},
    {id:'jangles-puppeteer',name:'Jangles',role:'Traveling Puppeteer',hubs:[0,2,3],type:'performer',rare:true,intro:'Jangles bows while two puppets behind him appear to be arguing about who gets top billing.',quirk:'The puppets know personal information he swears he never told them.'},
    {id:'elsie-tailor',name:'Elsie',role:'Village Tailor',hubs:[0,1,4],type:'merchant',intro:'Elsie inspects the state of your clothes and visibly loses respect for combat as a profession.',quirk:'She can repair a cape and insult its owner in the same stitch.'},
    {id:'cedric-cartographer',name:'Cedric',role:'Scholar Cartographer',hubs:[1,2,3,4],type:'scholar',intro:'Cedric is redrawing the road because the road “refuses to remain academically consistent.”',quirk:'He distrusts maps that have not personally disappointed him.'},
    {id:'mira-stablehand',name:'Mira',role:'Stablehand Squire',hubs:[0,1,3],type:'aid',intro:'Mira is untangling reins from a situation that does not currently contain a horse.',quirk:'She is saving up to become a knight and possibly buy a horse first.'},
    {id:'rook-highway-bandit',name:'Rook',role:'Masked Highway Bandit',hubs:[1,2,3,4],type:'rogue',damagedFirst:true,rare:true,intro:'Rook steps onto the road, thinks about the situation for two seconds, and lowers the knife slightly.',quirk:'He is trying to transition from robbery into “independent toll consulting.”'}
  ];
  const NPC_BY_ID=Object.fromEntries(NPCS.map(n=>[n.id,n]));

  function npcMemoryLine(npc){
    const seen=Number(R().npcSeen[npc.id]||0),rel=Number(R().npcRelations[npc.id]||0);
    if(!seen)return npc.quirk;
    if(rel>=3)return `${npc.name} recognizes you immediately. Apparently you are now part of the story they tell about this road.`;
    if(rel<=-2)return `${npc.name} recognizes you and makes the exact face people make when a previous decision has returned.`;
    return `${npc.name} remembers you. Whether that is useful has not yet been established.`;
  }
  function npcShouldLookDamaged(npc){
    const seen=Number(R().npcSeen[npc.id]||0),rel=Number(R().npcRelations[npc.id]||0);
    if(npc.damagedFirst&&seen===0)return true;
    const danger=(Number(state.progress?.[4]||0)>=2&&!state.won);
    return rel<=-3||(danger&&npc.hubs.includes(4)&&((npc.id.length+travelNow())%3===0));
  }

  function genericOptions(npc){
    const type=npc.type;
    if(type==='healer')return [
      {label:'Help gather supplies',outcome:`You spend a few minutes helping ${npc.name}. The work is boring, useful, and therefore suspiciously rare.`,rep:{generosity:1},rel:2,rewards:{hp:4},flag:`helped_${npc.id}`},
      {label:'Ask for a remedy',outcome:`${npc.name} hands you a tiny restorative dose and tells you not to ask what the green part is.`,rep:{},rel:1,rewards:{hp:6}},
      {label:'Leave the bubbling things alone',outcome:`You decide not to become part of an ingredient list. ${npc.name} respects the instinct.`,rep:{nerve:-1},rel:0,rewards:{}}
    ];
    if(type==='merchant')return [
      {label:'Make a fair trade · 4 coins',outcome:`${npc.name} looks genuinely surprised by the concept of a fair transaction.`,rep:{generosity:1},rel:2,rewards:{coins:-4,leather:1}},
      {label:'Haggle shamelessly',outcome:`You and ${npc.name} spend several minutes weaponizing arithmetic. You leave with a few coins and mutual distrust.`,rep:{greed:1,nerve:1},rel:-1,rewards:{coins:3}},
      {label:'Trade rumors instead',outcome:`${npc.name} accepts one rumor and gives you another, which is how economies collapse.`,rep:{},rel:1,rewards:{hp:2}}
    ];
    if(type==='authority')return [
      {label:'Cooperate',outcome:`You answer ${npc.name}'s questions without creating a jurisdictional incident.`,rep:{mercy:1},rel:1,rewards:{hp:2}},
      {label:'Lie with confidence',outcome:`The lie is not good, but the confidence is exhausting. ${npc.name} lets you go.`,rep:{greed:1,nerve:1},rel:-1,rewards:{coins:2}},
      {label:'Challenge the authority of this conversation',outcome:`You ask for the exact statute. ${npc.name} spends so long looking for it that you quietly win.`,rep:{nerve:1},rel:-1,rewards:{}}
    ];
    if(type==='scholar')return [
      {label:'Compare notes',outcome:`You help ${npc.name} correct a detail. The corrected version is somehow more alarming.`,rep:{generosity:1},rel:2,rewards:{hp:3}},
      {label:'Ask where the valuables are',outcome:`${npc.name} marks a suspicious location and immediately regrets trusting you.`,rep:{greed:1},rel:-1,rewards:{coins:4}},
      {label:'Take the safer route',outcome:`The notes reveal a less terrible path forward. Your body appreciates scholarship for once.`,rep:{nerve:1},rel:1,rewards:{hp:5}}
    ];
    if(type==='performer')return [
      {label:'Applaud sincerely',outcome:`${npc.name} performs the dangerous second verse as a reward. It contains your name and several legal inaccuracies.`,rep:{generosity:1},rel:2,rewards:{hp:3}},
      {label:'Request a meaner song',outcome:`The resulting ballad insults three nobles, a goose, and somehow you.`,rep:{nerve:1},rel:1,rewards:{coins:2}},
      {label:'Walk away during the dramatic pause',outcome:`${npc.name} will absolutely remember this when writing the ending.`,rep:{},rel:-2,rewards:{}}
    ];
    if(type==='rogue')return [
      {label:'Let them keep their dignity',outcome:`You let ${npc.name} leave without turning the road into a crime scene. The surprise is almost touching.`,rep:{mercy:2},rel:2,rewards:{},flag:'react_rook_spared'},
      {label:'Demand a road toll from the bandit',outcome:`You reverse the business model. ${npc.name} pays because the irony is too strong to fight.`,rep:{greed:1,nerve:1},rel:-1,rewards:{coins:5}},
      {label:'Threaten them into retirement',outcome:`${npc.name} promises to reconsider crime, mostly from farther away.`,rep:{violence:1,nerve:1},rel:-2,rewards:{coins:2}}
    ];
    if(type==='social')return [
      {label:'Listen',outcome:`You let ${npc.name} finish the entire story. This is a larger act of mercy than combat usually requires.`,rep:{mercy:1},rel:2,rewards:{hp:2}},
      {label:'Add your own version',outcome:`The story becomes much better and significantly less true.`,rep:{nerve:1},rel:1,rewards:{coins:2}},
      {label:'Pretend you are late',outcome:`${npc.name} knows you are lying, but respects the commitment to escape.`,rep:{},rel:-1,rewards:{}}
    ];
    if(type==='wanderer')return [
      {label:'Share the road',outcome:`You walk with ${npc.name} for a while. The route feels shorter and the story gets longer.`,rep:{generosity:1},rel:2,rewards:{hp:4}},
      {label:'Trade travel stories',outcome:`Your story wins on danger. ${npc.name}'s wins on fish.`,rep:{nerve:1},rel:1,rewards:{coins:2}},
      {label:'Keep moving',outcome:`You part ways without incident, which is statistically remarkable.`,rep:{},rel:0,rewards:{}}
    ];
    return [
      {label:'Help',outcome:`You help ${npc.name} with the immediate problem.`,rep:{generosity:1},rel:2,rewards:{hp:3}},
      {label:'Ask for payment',outcome:`${npc.name} pays a little and judges you a lot.`,rep:{greed:1},rel:-1,rewards:{coins:3}},
      {label:'Move on',outcome:'The road continues.',rep:{},rel:0,rewards:{}}
    ];
  }

  function specificOptions(npc){
    if(npc.id==='corvin-wounded-traveler'&&!hasFlag('react_corvin_resolved'))return [
      {label:'Buy him medicine · 8 coins',outcome:'You patch Corvin up and point him toward town. He promises to repay you when walking stops being theoretical.',rep:{generosity:2,mercy:1},rel:3,rewards:{coins:-8,hp:2},flag:'react_corvin_helped',also:'react_corvin_resolved'},
      {label:'Take the unattended purse',outcome:'Corvin watches you take the purse. “That feels narratively important,” he says.',rep:{greed:2,violence:1},rel:-4,rewards:{coins:10},flag:'react_corvin_robbed',also:'react_corvin_resolved'},
      {label:'Leave him to recover',outcome:'You keep moving. Corvin eventually manages to stand, mostly out of irritation.',rep:{},rel:-1,rewards:{},flag:'react_corvin_ignored',also:'react_corvin_resolved'}
    ];
    if(npc.id==='agatha-hedge-witch'&&!hasFlag('react_agatha_brew'))return [
      {label:'Gather the screaming mushrooms',outcome:'The mushrooms stop screaming once picked, which somehow makes the task worse. Agatha promises a proper potion later.',rep:{generosity:1,nerve:1},rel:3,rewards:{hp:4},flag:'react_agatha_helped',also:'react_agatha_brew'},
      {label:'Taste the unfinished potion',outcome:'For six seconds you can hear the color blue. Agatha writes something down.',rep:{nerve:2},rel:1,rewards:{hp:7},flag:'react_agatha_tested',also:'react_agatha_brew'},
      {label:'Respect basic survival instinct',outcome:'Agatha calls you boring but medically sound.',rep:{},rel:0,rewards:{},also:'react_agatha_brew'}
    ];
    if(npc.id==='perrin-tax-collector'&&!hasFlag('react_perrin_resolved'))return [
      {label:'Pay the road levy · 5 coins',outcome:'Perrin stamps your hand, your map, and accidentally a nearby leaf.',rep:{},rel:1,rewards:{coins:-5},flag:'react_perrin_paid',also:'react_perrin_resolved'},
      {label:'Claim diplomatic immunity',outcome:'You are not a diplomat. Perrin knows this. Somehow the conversation still ends before the form does.',rep:{greed:1,nerve:2},rel:-2,rewards:{coins:2},flag:'react_perrin_lied',also:'react_perrin_resolved'},
      {label:'Ask for the legal definition of “road”',outcome:'Perrin opens a second ledger. You both lose forty emotional years.',rep:{nerve:1},rel:0,rewards:{},also:'react_perrin_resolved'}
    ];
    if(npc.id==='pipwick-bard'&&!hasFlag('react_pipwick_song'))return [
      {label:'Commission a heroic song · 3 coins',outcome:'Pipwick promises to make you sound taller and your enemies less legally sympathetic.',rep:{generosity:1},rel:3,rewards:{coins:-3},flag:'react_pipwick_song'},
      {label:'Demand a free song',outcome:'He agrees, but changes the title to “The Hero Who Would Not Pay Three Coins.”',rep:{greed:1},rel:-1,rewards:{},flag:'react_pipwick_song'},
      {label:'Teach him the goose incident',outcome:'Pipwick goes silent, then whispers: “This is the chorus.”',rep:{nerve:1},rel:2,rewards:{coins:2},flag:'react_pipwick_song'}
    ];
    if(npc.id==='lyra-forest-herbalist'&&!hasFlag('react_lyra_helped'))return [
      {label:'Clear the cursed brambles',outcome:'Lyra gets her herbs and quietly packs an extra bundle for you.',rep:{generosity:1,nerve:1},rel:3,rewards:{hp:5},flag:'react_lyra_helped'},
      {label:'Sell her your directions · 2 coins',outcome:'You charge for pointing at the only visible path. Lyra pays, but memorizes your face.',rep:{greed:1},rel:-1,rewards:{coins:2},flag:'react_lyra_met'},
      {label:'Warn her about Gloomfang',outcome:'Lyra nods. “Good. I was worried the giant cursed wolf might be friendly.”',rep:{mercy:1},rel:1,rewards:{},flag:'react_lyra_met'}
    ];
    return genericOptions(npc);
  }

  function applyRewards(rewards={}){
    ensureCombatResources?.();
    const lines=[];
    if(rewards.coins){const before=state.coins;state.coins=Math.max(0,Number(state.coins||0)+Number(rewards.coins));const d=state.coins-before;lines.push(`${d>=0?'+':''}${d} coins`)}
    if(rewards.hp){const before=state.hp;state.hp=Math.min(state.maxHp,Math.max(1,Number(state.hp||1)+Number(rewards.hp)));lines.push(`+${state.hp-before} HP`)}
    for(const key of ['leather','bones','steel'])if(rewards[key]){state.materials=state.materials||{};state.materials[key]=Math.max(0,Number(state.materials[key]||0)+Number(rewards[key]));lines.push(`+${rewards[key]} ${key==='steel'?'demon steel':key}`)}
    if(rewards.item){state.meta.items=state.meta.items||{};state.meta.items[rewards.item]=Number(state.meta.items[rewards.item]||0)+1;lines.push(`+1 ${rewards.item}`)}
    return lines;
  }

  function encounterCard(npc,body,options,{damaged=npcShouldLookDamaged(npc),kicker='Road encounter'}={}){
    if(qs('#reactivityNpcEvent'))return true;
    const wrap=document.createElement('div');
    wrap.id='reactivityNpcEvent';wrap.className='road-event';
    const src=npcAsset(npc.id,damaged);
    wrap.innerHTML=`<div class="road-event-card reactivity-npc-card"><div class="reactivity-npc-layout"><div class="reactivity-npc-portrait"><img src="${src}" alt="${esc(npc.name)}"></div><div class="reactivity-npc-copy"><div class="npc-role">${esc(kicker)} · ${esc(npc.role)}</div><h2>${esc(npc.name)}</h2><p>${esc(body)}</p><div class="reactivity-npc-memory">${esc(npcMemoryLine(npc))}</div><div class="event-options">${options.map((o,i)=>`<button data-reactivity-choice="${i}">${esc(o.label)}</button>`).join('')}</div></div></div></div>`;
    (qs('#map')||qs('.game'))?.appendChild(wrap);
    const img=wrap.querySelector('img');
    if(img)img.onerror=()=>{if(damaged){img.onerror=null;img.src=npcAsset(npc.id,false)}};
    wrap.querySelectorAll('[data-reactivity-choice]').forEach(btn=>btn.onclick=()=>{
      const choice=options[Number(btn.dataset.reactivityChoice)]||options[0];
      discovered(npc.id);relation(npc.id,choice.rel||0);addRep(choice.rep||{});
      if(choice.flag)markFlag(choice.flag);if(choice.also)markFlag(choice.also);
      const rewards=applyRewards(choice.rewards||{});
      const memory=choice.memory||reputationRumor();
      save();
      wrap.querySelector('.road-event-card').innerHTML=`<div class="reactivity-npc-layout"><div class="reactivity-npc-portrait"><img src="${npcAsset(npc.id,false)}" alt="${esc(npc.name)}"></div><div class="reactivity-npc-copy"><div class="npc-role">The world remembers</div><h2>${esc(npc.name)}</h2><p>${esc(choice.outcome)}</p><div class="reactivity-result">${rewards.length?rewards.map(x=>`<span>${esc(x)}</span>`).join(''):'<span>No immediate reward.</span>'}<span class="memory-note">${esc(memory)}</span></div><button class="event-choice" data-reactivity-continue>Continue</button></div></div>`;
      wrap.querySelector('[data-reactivity-continue]').onclick=()=>{wrap.remove();setTimeout(()=>openLevelSelect(state.hub),230)};
    });
    return true;
  }

  function consequenceEligible(id,flag,delay=2){
    const r=R();if(r.consequences.includes(id)||!hasFlag(flag))return false;
    return travelNow()-Number(r.flagTravel[flag]??travelNow())>=delay;
  }
  function tryDelayedConsequence(hub){
    const r=R();
    if(travelNow()-r.lastConsequenceTravel<2)return false;
    if(consequenceEligible('corvin-repay','react_corvin_helped',3)&&hub>=1){
      const npc=NPC_BY_ID['fenn-courier'];
      const ok=encounterCard(npc,'Fenn catches up holding a parcel. “Corvin said you helped him when you did not have to. He also said not to mention how long it took him to find this address.”',[
        {label:'Accept Corvin’s repayment',outcome:'Inside are coins, a ration, and a note promising to learn how maps work.',rep:{},rel:2,rewards:{coins:12,hp:5},flag:'react_corvin_repaid',memory:'A choice from several roads ago has finally caught up with you.'},
        {label:'Tell Fenn to pass it forward',outcome:'Fenn takes the coins to the next injured traveler and keeps the ration for you.',rep:{generosity:2},rel:3,rewards:{hp:6},flag:'react_corvin_paid_forward',memory:'Corvin’s favor turns into somebody else’s good day.'}
      ],{damaged:false,kicker:'Delayed consequence'});
      if(ok){recordConsequence('corvin-repay');r.lastConsequenceTravel=travelNow();return true}
    }
    if(consequenceEligible('greta-confrontation','react_corvin_robbed',2)&&hub<=3){
      const npc=NPC_BY_ID['greta-angry-cousin'];
      const ok=encounterCard(npc,'Greta blocks the road. “My cousin Corvin described the person who robbed him. The description included your face and, annoyingly, your exact posture.”',[
        {label:'Repay the stolen money · 10 coins',outcome:'Greta counts the coins twice, calls you “medium terrible,” and agrees to stop telling the story to every merchant she meets.',rep:{mercy:1,greed:-2},rel:1,rewards:{coins:-10},flag:'react_corvin_amends',memory:'The robbery is remembered, but so is the attempt to repair it.'},
        {label:'Double down',outcome:'Greta adds three new details to the story, two of which are not true but will absolutely spread faster.',rep:{greed:2,violence:1},rel:-3,rewards:{coins:2},flag:'react_greta_feud',memory:'You have accidentally created a recurring enemy whose primary weapon is relatives.'}
      ],{damaged:false,kicker:'Delayed consequence'});
      if(ok){recordConsequence('greta-confrontation');r.lastConsequenceTravel=travelNow();return true}
    }
    if(consequenceEligible('rook-repayment','react_rook_spared',3)&&hub>=2){
      const npc=NPC_BY_ID['rook-highway-bandit'];
      const ok=encounterCard(npc,'Rook emerges from behind a signpost and throws a wrapped bundle at your feet. “Debt paid. We never had an emotional moment.”',[
        {label:'Take the supplies',outcome:'The bundle contains demon steel and a few coins. Rook disappears before gratitude becomes possible.',rep:{},rel:2,rewards:{steel:1,coins:5},flag:'react_rook_debt_paid',memory:'Mercy did not reform Rook, but it did make him strangely punctual about debts.'},
        {label:'Ask for information instead',outcome:'Rook marks a safer route and warns you which enemies have started recognizing your fighting style.',rep:{nerve:1},rel:2,rewards:{hp:6},flag:'react_rook_intel',memory:'The bandit you spared becomes a source instead of a corpse.'}
      ],{damaged:false,kicker:'Delayed consequence'});
      if(ok){recordConsequence('rook-repayment');r.lastConsequenceTravel=travelNow();return true}
    }
    if(consequenceEligible('agatha-potion','react_agatha_helped',3)&&hub>=2){
      const npc=NPC_BY_ID['agatha-hedge-witch'];
      const ok=encounterCard(npc,'Agatha waves a corked bottle. “Your mushroom labor matured into medicine. Or soup. I labeled it medicine, so statistically we are fine.”',[
        {label:'Drink the labeled medicine',outcome:'It tastes like lightning remembered incorrectly. Your wounds close anyway.',rep:{nerve:1},rel:2,rewards:{hp:10},flag:'react_agatha_repaid',memory:'The screaming mushrooms have become useful, which somehow does not make them less upsetting.'},
        {label:'Give it to Sister Mara',outcome:'Agatha looks offended by the responsible decision, then quietly approves.',rep:{generosity:2},rel:2,rewards:{hp:5},flag:'react_agatha_donated',memory:'A small act of help becomes a useful connection between two recurring characters.'}
      ],{damaged:false,kicker:'Delayed consequence'});
      if(ok){recordConsequence('agatha-potion');r.lastConsequenceTravel=travelNow();return true}
    }
    if(consequenceEligible('perrin-audit','react_perrin_lied',2)&&hub>=3){
      const npc=NPC_BY_ID['aldrin-magistrate'];
      const ok=encounterCard(npc,'Aldrin opens a ledger. “Perrin recorded you as a diplomat from a nation called ‘None of Your Business.’ I admire the creativity. I dislike the accounting.”',[
        {label:'Pay the corrected fee · 6 coins',outcome:'Aldrin stamps the ledger and removes a note reading “professionally irritating.” Most of it, anyway.',rep:{greed:-1},rel:1,rewards:{coins:-6},flag:'react_audit_paid',memory:'The lie came back later as paperwork, which is arguably the most realistic consequence in the kingdom.'},
        {label:'Insist the nation is real',outcome:'Aldrin writes “persistent” beside your name and schedules another audit for a century from now.',rep:{greed:1,nerve:2},rel:-2,rewards:{coins:2},flag:'react_audit_doubled_down',memory:'The world remembers the lie and has now institutionalized it.'}
      ],{damaged:false,kicker:'Delayed consequence'});
      if(ok){recordConsequence('perrin-audit');r.lastConsequenceTravel=travelNow();return true}
    }
    return false;
  }

  function pickNpc(hub){
    const r=R(),pool=NPCS.filter(n=>n.hubs.includes(hub)&&!(n.id==='greta-angry-cousin'&&hasFlag('react_corvin_robbed')&&!r.consequences.includes('greta-confrontation')));
    if(!pool.length)return null;
    let total=0;const weighted=pool.map(n=>{const seen=Number(r.npcSeen[n.id]||0);let w=seen?1.1:3.2;if(n.rare)w*=.38;if(relation(n.id)>=3)w*=1.15;total+=w;return[n,w]});
    let roll=Math.random()*total;for(const [n,w] of weighted){roll-=w;if(roll<=0)return n}return weighted[weighted.length-1][0];
  }
  function tryNpcEncounter(hub){
    const r=R();
    if(travelNow()-r.lastNpcTravel<3)return false;
    const chance=hub===4?.11:.13;
    if(Math.random()>=chance)return false;
    const npc=pickNpc(hub);if(!npc)return false;
    r.lastNpcTravel=travelNow();
    return encounterCard(npc,npc.intro,specificOptions(npc));
  }

  /* Insert recurring NPCs before the existing road-event system, but keep it as fallback. */
  const baseOverworldEvent=window.triggerOverworldEvent;
  if(baseOverworldEvent){
    window.triggerOverworldEvent=function(hub){
      processAliveChoices();
      if(tryDelayedConsequence(Number(hub)||0))return true;
      if(tryNpcEncounter(Number(hub)||0))return true;
      return !!baseOverworldEvent(hub);
    };
  }

  /* ---------- combat environments ---------- */
  const ENVIRONMENTS=[
    {name:'Muddy Road',hint:'Heavy charges can lose footing in the creek-side mud.'},
    {name:'Bramble Edge',hint:'Aggressive movement can snag on cursed undergrowth.'},
    {name:'Grave Mist',hint:'The cemetery air encourages status-heavy attacks.'},
    {name:'Shifting Floor',hint:'The maze changes footing and makes enemy movement less predictable.'},
    {name:'Fortress Pressure',hint:'Late-phase enemies become more direct as the throne room closes in.'}
  ];
  function renderEnvironmentBadge(){
    const stage=qs('#combatStage');if(!stage)return;let b=qs('#reactivityEnvironmentBadge');if(!b){b=document.createElement('span');b.id='reactivityEnvironmentBadge';b.className='reactivity-environment-badge';stage.after(b)}const env=ENVIRONMENTS[Number(state.hub)||0];b.textContent=env?.name||'Battlefield';b.title=env?.hint||'';
  }
  function applyEnvironmentIntentEffect(){
    if(!combat)return '';const hub=Number(state.hub)||0,cycle=Number(combat._reactivityIntentCycle||0);
    if(hub===0&&combat.intentType==='charge'&&cycle%4===0){combat.intentType='fast';return 'The muddy road breaks the charge into an awkward scramble.'}
    if(hub===1&&['charge','heavy'].includes(combat.intentType)&&cycle%3===0){combat.intentType='fast';return 'Bramble catches the approach and shortens the attack.'}
    if(hub===2&&cycle%3===0){combat.intentType='status';return 'Grave mist thickens around the next attack.'}
    if(hub===3){combat.intentType=cycle%2===0?'dodge':'fast';return 'The shifting floor changes the angle of the exchange.'}
    if(hub===4&&combat.boss&&Number(combat.reactivityPhase||1)>=3){combat.intentType='charge';return 'Fortress pressure turns the final phase into a direct assault.'}
    return '';
  }
  function applyEnvironmentCounterEffect(){
    if(!combat)return;const note=applyEnvironmentIntentEffect();if(note){const d=qs('#battleDetail');if(d&&qs('#combat')?.classList.contains('active'))d.textContent+=` ${note}`}
  }

  /* ---------- enemy personalities / damaged sprites ---------- */
  const PERSONALITIES={
    'Slime Rat':'Trickster','Angry Goose':'Aggressive','Drunk Peasant':'Aggressive','Rabid Raccoon':'Trickster','Rabid racoon':'Trickster','Sir Barnaby':'Defensive',
    'Goblin Poacher':'Cowardly','Zombie Wolf':'Berserk','Bullying Sprite':'Cowardly','Cursed Timberwolf':'Aggressive','Gloomfang':'Trickster','Gloomfang the Cursed Timberwolf':'Berserk',
    'Skeleton Archer':'Defensive','Moldy Mummy':'Protector','Necromancer Apprentice':'Trickster','Grave Wraith':'Trickster','Lich King Timmy':'Protector',
    'Minotaur with Anxiety':'Cowardly','Daedric Knight':'Protector','Gargoyle':'Defensive','Dark Sorcerer':'Trickster','Throne Warden':'Protector','Monarch Lucien':'Aggressive',
    'Crown Cutpurse':'Trickster','Bluecrest Militiaman':'Defensive','Royal Road Ambush':'Trickster','Crownmarch Sentinel':'Protector','Lord Macewarden':'Aggressive',
    'Kingswood Ranger':'Trickster','Briarfang Hound':'Berserk','Crownwood Hunting Pack':'Aggressive','Antlerguard Warden':'Defensive','Mosscrown Treant':'Protector',
    'Veiled Rose Wraith':'Trickster','Lanternbone Watcher':'Defensive','Crowncrypt Procession':'Protector','Crowncrypt Bishop':'Trickster','Ossuary King':'Protector',
    'Topiary Page':'Cowardly','Briarhood Sneak':'Trickster','Maze Court Conspirators':'Trickster','Fleurshield Sentinel':'Defensive','Rosemaze Sovereign':'Protector',
    'Crownshield Halberdier':'Defensive','Bannerblade Knight':'Aggressive','Royal Vanguard Pair':'Protector','Royal Hex Chancellor':'Trickster','Thronewraith King':'Berserk'
  };

  const BOSS_LINES={
    'Sir Barnaby':['“A proper knight announces Phase One!”','“You scratched the armor. The armor has feelings.”','“Very well. We are skipping directly to the heroic overreaction.”'],
    'Gloomfang':['The shadows tighten around Gloomfang.','Gloomfang abandons patience and starts hunting the gaps in your stance.','The curse flares. Subtlety has left the forest.'],
    'Lich King Timmy':['Timmy raises the crown like the room owes him applause.','“Royal Reanimation!” The dead king becomes considerably less ceremonial.','The crown rattles. Timmy has reached the shouting part of monarchy.'],
    'Minotaur with Anxiety':['The Minotaur checks the battle plan twice.','“Okay. New plan. Panic, but tactically.”','The breathing exercise has officially failed.'],
    'Monarch Lucien':['Lucien grips the throne-side of the battlefield.','The monarch drops the performance and starts fighting like the kingdom can hear him losing.','Lucien’s last phase is all desperation, fury, and very expensive armor.'],
    'Lord Macewarden':['Macewarden plants his weapon and refuses to yield the road.','The frontier lord abandons ceremony and starts swinging for authority.','The mace comes down like a royal decree with no appeal.'],
    'Mosscrown Treant':['The old wood creaks awake beneath the royal moss.','Roots split the ground as the crown-marked guardian grows furious.','The Treant stops guarding the forest and starts becoming the forest.'],
    'Ossuary King':['The bone-crown tilts toward you from the dark.','Royal remains knit tighter around the ancient regalia.','Every grave in sight seems to answer the Ossuary King at once.'],
    'Rosemaze Sovereign':['The Sovereign raises its thorned court around the path.','The maze tightens as the garden ruler abandons restraint.','Every rose and hedge leans inward for the final trial.'],
    'Thronewraith King':['The old crown glows beneath the restored capital.','The wraith king tears free of courtly ritual and attacks the new reign directly.','The throne room fills with blue fire as the dead king demands one last coronation.']
  };
  function personalityFor(name){return PERSONALITIES[name]||'Aggressive'}
  function damagedMonsterPath(name){
    const src=typeof asset==='function'?asset(name):'';if(!src)return '';
    const file=src.split('/').pop();if(!file)return '';
    if(src.includes('/NGPlus/Crownhold/'))return `Textures/Monsters/NGPlus/Crownhold/Damaged/${file.replace(/\.png$/i,'-damaged.png')}`;
    return `Textures/Monsters/Damaged/${file.replace(/\.png$/i,'-damaged.png')}`;
  }
  function renderPersonalityBadge(){
    if(!qs('#combat')?.classList.contains('active')||!combat)return;
    let badge=qs('.reactivity-personality-badge');
    if(!badge){badge=document.createElement('div');badge.className='reactivity-personality-badge';const card=qs('#combat .battle-foe-card');(card||qs('#enemyName')?.parentElement)?.appendChild(badge)}
    if(!badge)return;const kind=combat.reactivityPersonality||personalityFor(combat.enemy);badge.dataset.kind=kind;badge.textContent=kind;
  }
  function syncEnemySprite(){
    if(!qs('#combat')?.classList.contains('active')||!combat)return;
    // Crownhold's paired/single art and low-HP variants are managed by game.js.
    if(state.ng&&(state.meta?.ngPlusRouteKey||state.endgame?.routeKey)==='male-king')return;
    const img=qs('#enemyArt img.monster-sprite');if(!img)return;
    if(!img.dataset.reactivityNormal)img.dataset.reactivityNormal=img.getAttribute('src')||'';
    if(!img.dataset.reactivityDamaged)img.dataset.reactivityDamaged=damagedMonsterPath(combat.enemy);
    const damaged=combat.enemyHp/Math.max(1,combat.enemyMax)<=.48||Number(combat.reactivityPhase||1)>=2;
    const wanted=damaged&&img.dataset.reactivityDamaged&&!img.dataset.reactivityDamageFailed?img.dataset.reactivityDamaged:img.dataset.reactivityNormal;
    if(wanted&&img.getAttribute('src')!==wanted){img.onerror=()=>{img.dataset.reactivityDamageFailed='1';img.onerror=null;img.src=img.dataset.reactivityNormal};img.src=wanted}
  }
  function phaseFromHp(){const ratio=combat.enemyHp/Math.max(1,combat.enemyMax);return ratio<=.33?3:ratio<=.66?2:1}
  function phaseBanner(phase){
    if(!combat?.boss)return;
    qs('.reactivity-phase-banner')?.remove();
    const field=qs('#combat .battle-field');if(!field)return;
    const lines=BOSS_LINES[combat.enemy]||['The boss settles into the fight.','The boss changes tactics.','The boss stops pretending this is under control.'];
    const b=document.createElement('div');b.className='reactivity-phase-banner';b.innerHTML=`<b>${esc(combat.enemy)} · Phase ${phase}</b><span>${esc(lines[phase-1]||lines.at(-1))}</span>`;field.appendChild(b);
    if(phase===2)window.aliveCameraEffect?.('crit',460);if(phase===3)window.aliveCameraEffect?.('boss-final',650);
    setTimeout(()=>b.remove(),1700);
  }
  function applyBossPhaseBehavior(phase){
    if(!combat?.boss)return;
    if(phase===2){
      if(combat.enemy==='Sir Barnaby'||combat.enemy==='Gloomfang')combat.enemyDodgeBonus=Math.max(Number(combat.enemyDodgeBonus||0),.10);
      if(combat.enemy==='Minotaur with Anxiety')combat.intentType='dodge';
      if(combat.enemy==='Monarch Lucien')combat.intentType='status';
    }
    if(phase===3){
      qs('#enemyArt')?.classList.add('reactivity-phase-three');
      if(['Sir Barnaby','Gloomfang','Minotaur with Anxiety','Monarch Lucien'].includes(combat.enemy))combat.intentType='charge';
      if(combat.enemy==='Lich King Timmy')combat.intentType='status';
    }
  }
  function monitorBossPhase(){
    if(!qs('#combat')?.classList.contains('active')||!combat?.boss||combat.enemyHp<=0)return;
    const p=phaseFromHp();if(!combat.reactivityPhase)combat.reactivityPhase=1;
    if(p>combat.reactivityPhase){combat.reactivityPhase=p;R().bossPhases[combat.enemy]=Math.max(Number(R().bossPhases[combat.enemy]||1),p);phaseBanner(p);if(p===3)qs('#enemyArt')?.classList.add('reactivity-phase-three');save()}
  }
  function adaptIntent(){
    if(!qs('#combat')?.classList.contains('active')||!combat||combat.enemyHp<=0)return;
    const seed=combat.intentSerial||0;
    if(!combat.intentText||combat.reactivityInterrupted||combat._reactivityIntentSeed===seed)return;
    combat._reactivityIntentSeed=seed;
    const kind=combat.reactivityPersonality||personalityFor(combat.enemy),ratio=combat.enemyHp/Math.max(1,combat.enemyMax),burning=combat.targetStatuses?.includes('Burning');
    combat._reactivityIntentCycle=Number(combat._reactivityIntentCycle||0)+1;
    if(kind==='Aggressive')combat.intentType=ratio<.48?'charge':'heavy';
    else if(kind==='Defensive'){combat.intentType=burning?'heavy':'dodge';combat.enemyDodgeBonus=burning?0:Math.max(Number(combat.enemyDodgeBonus||0),.16)}
    else if(kind==='Cowardly'){combat.intentType=ratio<.55?'dodge':'fast';combat.enemyDodgeBonus=burning?0:Math.max(Number(combat.enemyDodgeBonus||0),ratio<.55?.19:.09)}
    else if(kind==='Berserk')combat.intentType=ratio<.62?'charge':'heavy';
    else if(kind==='Trickster'){const cycle=combat._reactivityIntentCycle%3;combat.intentType=cycle===0?'status':cycle===1?'dodge':'fast';combat.enemyDodgeBonus=combat.intentType==='dodge'&&!burning?Math.max(Number(combat.enemyDodgeBonus||0),.16):0}
    else if(kind==='Protector'){combat.intentType=ratio<.4?'heavy':(combat._reactivityIntentCycle%3===0?'status':'heavy');combat.enemyDodgeBonus=Math.max(Number(combat.enemyDodgeBonus||0),.05)}
    applyEnvironmentIntentEffect();
    if(combat.boss)applyBossPhaseBehavior(Number(combat.reactivityPhase||phaseFromHp()));
    const lines=ENEMY_WARNING_LINES[combat.enemy]||['The enemy shifts its weight.','The enemy moves through the edge of your vision.','The enemy studies your stance in silence.','The enemy settles into a guarded posture.','The enemy prepares something difficult to identify.'];
    const intentIndex=WARNING_TYPES.indexOf(combat.intentType);
    combat.intentText=lines[intentIndex]||lines[0];
    combat.lastIntentType=combat.intentType;
    const prompt=qs('#battlePrompt'),detail=qs('#battleDetail');
    if(prompt?.textContent==='Enemy movement'&&detail)detail.textContent=combat.intentText;
  }

  function initReactivityCombat(){
    if(!combat)return;
    combat.reactivityPersonality=personalityFor(combat.enemy);
    combat.reactivityPhase=1;combat._reactivityIntentSeed='';combat._reactivityIntentCycle=0;combat._reactivityFleeAttempt=false;combat.reactivityInterrupted=false;
    const r=R();r.battleHistory.push({enemy:combat.enemy,boss:!!combat.boss,hub:state.hub,travel:travelNow(),personality:combat.reactivityPersonality});if(r.battleHistory.length>60)r.battleHistory.shift();
    renderPersonalityBadge();syncEnemySprite();adaptIntent();
    qs('#enemyArt')?.classList.remove('reactivity-phase-three','reactivity-flee','reactivity-stagger-flash');
    renderEnvironmentBadge();
    if(combat.boss)setTimeout(()=>{if(qs('#combat')?.classList.contains('active')&&combat?.boss&&Number(combat.reactivityPhase||1)===1)phaseBanner(1)},420);
  }
  const baseStartCombat=window.startCombat;
  if(baseStartCombat){window.startCombat=function(...args){const out=baseStartCombat(...args);initReactivityCombat();return out}}

  const baseFloatDamage=window.floatDamageNumber;
  if(baseFloatDamage){
    window.floatDamageNumber=function(target,amount,options={}){
      const out=baseFloatDamage(target,amount,options);
      if(target?.id==='enemyArt'&&combat&&combat.enemyHp>0&&!options.status){
        syncEnemySprite();monitorBossPhase();
        const heavyThreshold=Math.max(14,Math.round(combat.enemyMax*(combat.boss?.22:.18)));
        const telegraphed=['heavy','charge'].includes(combat.intentType);
        if(telegraphed&&(options.critical||Number(amount)>=heavyThreshold)){
          combat.reactivityInterrupted=true;combat.enemyDodgeBonus=0;
          target.classList.remove('reactivity-stagger-flash');void target.offsetWidth;target.classList.add('reactivity-stagger-flash');setTimeout(()=>target.classList.remove('reactivity-stagger-flash'),450);
          window.floatCombatText?.(target,'STAGGER!',{word:true});
          setTimeout(()=>{const d=qs('#battleDetail');if(d&&qs('#combat')?.classList.contains('active')&&combat?.enemyHp>0)d.textContent+=' The telegraphed attack is broken; the enemy will miss its turn.'},0);
        }
      }
      return out;
    };
  }

  const baseEnemyCounter=window.__battleEnemyCounter;
  if(baseEnemyCounter){
    window.__battleEnemyCounter=function(...args){
      if(!combat||combat.enemyHp<=0)return baseEnemyCounter(...args);
      const kind=combat.reactivityPersonality||personalityFor(combat.enemy),ratio=combat.enemyHp/Math.max(1,combat.enemyMax);
      if(kind==='Cowardly'&&!combat.boss&&ratio<=.16&&!combat._reactivityFleeAttempt){
        combat._reactivityFleeAttempt=true;
        if(Math.random()<.38){
          combat.enemyHp=0;combat._aliveDeathComplete=true;updateBars?.();qs('#enemyArt')?.classList.add('reactivity-flee');window.floatCombatText?.(qs('#enemyArt'),'FLED!',{word:true});
          const finish=()=>{window.__combatEnemyTurn=false;victory()};
          return window.battleNotice?window.battleNotice(`${combat.enemy} fled!`,'The enemy decides survival is a more promising progression system than this fight.').then(finish):finish();
        }
      }
      if(combat.reactivityInterrupted){combat.reactivityInterrupted=false;combat.enemyDodgeBonus=0;return window.__battleSkipEnemyTurn?.()}
      // The environment was already applied when the warning line was finalized.
      return baseEnemyCounter(...args);
    };
  }

  window.finalizeEnemyIntent=adaptIntent;

  /* ---------- evolving areas / village damage states ---------- */
  const AREA_STATES=[
    ['Placenta Creek','Food carts are moving again and villagers have stopped blaming every missing turnip on organized crime.'],
    ['Mild Inconvenience','The forest paths are reopening; traps are disappearing faster than the goblins will admit.'],
    ['Grave Mistake','The cemetery bells ring forward again and most of the dead have resumed normal dead-person hours.'],
    ['Questionable Decisions','The maze has stopped rearranging itself. The contradictory signs remain for cultural reasons.'],
    ['Dread Fortress','The fortress gates are open and the roads below it are finally carrying people instead of tribute.']
  ];
  function completedBosses(){return (state.progress||[]).map(Number).filter(x=>x>=5).length}
  function currentAreaEvolution(){
    const hub=Number(state.hub||0),cleared=Number(state.progress?.[hub]||0)>=5;
    const ngStory=state.ng?window.getNgPlusEncounterStory?.(hub,cleared?5:Math.min(5,Number(state.progress?.[hub]||0)+1)):null;
    if(ngStory)return cleared?ngStory.resolution:ngStory.body;
    if(cleared)return AREA_STATES[hub]?.[1]||'This area remembers what happened here.';
    if(hub===4&&Number(state.progress?.[4]||0)>=2&&!state.won)return 'Fortress pressure is spilling back into the kingdom. Guards and townsfolk are starting to show the cost.';
    const progress=Number(state.progress?.[hub]||0);
    return progress>=3?'People here have begun reacting to the trail you are leaving through the area.':progress>=1?'The first fights have changed the mood of the area; rumors are moving ahead of you.':'The area has not decided what to make of you yet.';
  }
  function updateWorldPulse(){
    if(!qs('#map')?.classList.contains('active'))return;
    processAliveChoices();
    let pulse=qs('#reactivityWorldPulse');if(!pulse){pulse=document.createElement('div');pulse.id='reactivityWorldPulse';pulse.className='reactivity-world-pulse';const status=qs('#mapStatus');(status?.parentElement||qs('#map'))?.appendChild(pulse)}
    if(!pulse)return;
    const bossCount=completedBosses(),discoveries=R().discoveredNpcs.length;
    const tags=[];if(bossCount)tags.push(`${bossCount}/5 regions changed`);if(discoveries)tags.push(`${discoveries} recurring people met`);if(R().consequences.length)tags.push(`${R().consequences.length} delayed consequences returned`);if(!state.ng&&Number(state.progress?.[4]||0)>=2&&!state.won)tags.push('Placenta Creek under pressure');
    const signature=[state.meta?.ngPlusRouteKey||'',state.hub,(state.progress||[]).join(','),state.won,discoveries,R().consequences.length,tags.join('|')].join('::');
    if(pulse.dataset.signature===signature)return;pulse.dataset.signature=signature;
    pulse.innerHTML=`<b>World state · ${esc(state.ng?(state.meta?.ngPlusWorldName||'New Game+'):(AREA_STATES[Number(state.hub||0)]?.[0]||'The road'))}</b><br>${esc(currentAreaEvolution())}<div class="world-pulse-tags">${tags.map(t=>`<span>${esc(t)}</span>`).join('')}</div>`;
  }
  function updateLevelState(){
    const modal=qs('#levelModal');if(!modal?.classList.contains('open'))return;
    let el=qs('#reactivityLevelState');if(!el){el=document.createElement('div');el.id='reactivityLevelState';el.className='reactivity-level-state';qs('#levelHint')?.after(el)}
    if(el){const text=currentAreaEvolution();if(el.textContent!==text)el.textContent=text}
  }
  function syncExistingNpcDamage(){
    const underSiege=Number(state.progress?.[4]||0)>=2&&!state.won;
    const actorPaths={
      'guard-1':['Textures/NPCs/guard-1.png','Textures/NPCs/Damaged/guard-1-damaged.png'],
      'guard-2':['Textures/NPCs/guard-2.png','Textures/NPCs/Damaged/guard-2-damaged.png'],
      'villager-1':['Textures/NPCs/Villager-1.png','Textures/NPCs/Damaged/villager-1-damaged.png'],
      'villager-2':['Textures/NPCs/Villager-2.png','Textures/NPCs/Damaged/villager-2-damaged.png'],
      'villager-3':['Textures/NPCs/Villager-3.png','Textures/NPCs/Damaged/villager-3-damaged.png'],
      'villager-4':['Textures/NPCs/Villager-4.png','Textures/NPCs/Damaged/villager-4-damaged.png']
    };
    window.placentaCreekNPCs?.actors?.forEach(a=>{const p=actorPaths[a.id];if(p&&a.image&&a.image.getAttribute('src')!==(underSiege?p[1]:p[0]))a.image.src=underSiege?p[1]:p[0]});
    if(qs('#interior')?.classList.contains('active')){
      const map={cathedral:'priest',blacksmith:'blacksmith',merchant:'merchant'},key=map[state._building];const img=qs('#interiorCharacter');if(key&&img&&!img.hidden){const normal=`Textures/NPCs/${key}.png`,damaged=`Textures/NPCs/Damaged/${key}-damaged.png`,wanted=underSiege?damaged:normal;if(!img.src.endsWith(wanted))img.src=wanted}
    }
  }

  function visitorDialogue(npc){
    const rel=relation(npc.id),t=dominantTemperament();
    const base=rel>=3?`${npc.name} greets you like an old road acquaintance.`:rel<=-2?`${npc.name} gives you exactly enough room to make another bad decision somewhere else.`:`${npc.name} has stopped in Placenta Creek between journeys.`;
    const memory=t==='generous'?'“People say you help strangers when nobody is watching.”':t==='greedy'?'“People say I should count the spoons after you leave.”':t==='merciful'?'“I heard some of your enemies lived long enough to complain about you.”':t==='violent'?'“I heard your version of negotiation has impact frames.”':t==='bold'?'“You really do walk directly into every terrible idea, huh?”':t==='cautious'?'“You have an impressive instinct for leaving before the screaming starts.”':'“Nobody agrees what your deal is. I respect the consistency.”';
    return `${base} ${memory}`;
  }
  function showVisitor(npc){
    if(qs('#reactivityVisitorDialog'))return;
    const d=document.createElement('div');d.id='reactivityVisitorDialog';d.className='road-event';d.innerHTML=`<div class="road-event-card reactivity-npc-card"><div class="reactivity-npc-layout"><div class="reactivity-npc-portrait"><img src="${npcAsset(npc.id,false)}" alt="${esc(npc.name)}"></div><div class="reactivity-npc-copy"><div class="npc-role">Recurring visitor · ${esc(npc.role)}</div><h2>${esc(npc.name)}</h2><p>${esc(visitorDialogue(npc))}</p><div class="reactivity-npc-memory">${esc(npc.quirk)}</div><button data-close-reactivity-visitor>Back to the village</button></div></div></div>`;(qs('#village')||qs('.game'))?.appendChild(d);d.querySelector('[data-close-reactivity-visitor]').onclick=()=>d.remove();
  }
  const VISITOR_SPOTS=[
    {x:.282,y:.623,path:[.028,.034]},
    {x:.305,y:.743,path:[.050,.008]},
    {x:.508,y:.446,path:[.032,.059]},
    {x:.671,y:.603,path:[.044,.034]},
    {x:.943,y:.699,path:[-.015,.070]},
    {x:.521,y:.945,path:null}
  ];
  let visitorVillageActive=false,visitorVisit=0,visitorActors=[],visitorLastFrame=performance.now();
  function moveVisitors(now){
    const dt=Math.min(80,now-visitorLastFrame);visitorLastFrame=now;
    if(qs('#village')?.classList.contains('active')&&!reduceMotion())for(const actor of visitorActors){
      if((actor.phase==='idle'||actor.phase==='end'||!actor.path)&&now>=actor.nextLookAt){
        actor.face*=-1;
        actor.image.style.transform=`translateX(-50%) scaleX(${actor.face})`;
        actor.nextLookAt=now+1800+Math.random()*2600;
      }
      if(!actor.path||now<actor.actionAt)continue;
      if(actor.phase==='idle'){actor.phase='out';actor.progress=0;actor.face=actor.path[0]<0?-1:1;actor.image.style.transform=`translateX(-50%) scaleX(${actor.face})`}
      else if(actor.phase==='end'){actor.phase='back';actor.progress=0;actor.face=actor.path[0]<0?1:-1;actor.image.style.transform=`translateX(-50%) scaleX(${actor.face})`}
      else{
        actor.progress=Math.min(1,actor.progress+dt/(actor.phase==='out'?2400:2800));
        const amount=actor.phase==='out'?actor.progress:1-actor.progress;
        actor.button.style.left=((actor.x+actor.path[0]*amount)*100)+'%';
        actor.button.style.top=((actor.y+actor.path[1]*amount)*100)+'%';
        if(actor.progress>=1){actor.phase=actor.phase==='out'?'end':'idle';actor.actionAt=now+(actor.phase==='end'?500+Math.random()*450:1800+Math.random()*1800)}
      }
    }
    requestAnimationFrame(moveVisitors);
  }
  requestAnimationFrame(moveVisitors);
  function renderVisitors(){
    if(!qs('#village')?.classList.contains('active')){visitorVillageActive=false;visitorActors=[];return}
    if(!visitorVillageActive){visitorVillageActive=true;visitorVisit++}
    const ids=R().discoveredNpcs.filter(id=>NPC_BY_ID[id]);
    let box=qs('#reactivityVisitors');
    if(!ids.length){box?.remove();qs('#reactivityVisitorDock')?.remove();visitorActors=[];return}
    if(!box){box=document.createElement('div');box.id='reactivityVisitors';box.className='reactivity-visitors';box.setAttribute('aria-label','Road visitors');qs('#village')?.appendChild(box)}
    const start=ids.length?travelNow()%ids.length:0,chosen=[];for(let i=0;i<Math.min(3,ids.length);i++)chosen.push(ids[(start+i)%ids.length]);
    let dock=qs('#reactivityVisitorDock');if(!dock){dock=document.createElement('div');dock.id='reactivityVisitorDock';dock.className='reactivity-visitor-dock';dock.setAttribute('aria-label','Road visitors');qs('#village')?.appendChild(dock)}
    const signature=visitorVisit+'|'+chosen.join('|');if(box.dataset.signature===signature&&dock.dataset.signature===signature)return;box.dataset.signature=signature;dock.dataset.signature=signature;
    const spots=[...VISITOR_SPOTS];for(let i=spots.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[spots[i],spots[j]]=[spots[j],spots[i]]}
    box.innerHTML=chosen.map((id,i)=>{const spot=spots[i];return `<span class="reactivity-visitor" aria-hidden="true" style="left:${spot.x*100}%;top:${spot.y*100}%"><span class="reactivity-visitor-shadow"></span><img src="Textures/NPCs/RoadVisitors/${id}.png" alt="" draggable="false"></span>`}).join('');
    dock.innerHTML=`<span class="reactivity-visitors-label">Road visitors</span>${chosen.map(id=>{const n=NPC_BY_ID[id];return `<button type="button" class="reactivity-visitor-choice" data-visitor="${id}" title="${esc(n.name)} · ${esc(n.role)}" aria-label="Talk to ${esc(n.name)}, ${esc(n.role)}"><img src="Textures/NPCs/RoadVisitors/${id}.png" alt="" draggable="false"></button>`}).join('')}`;
    visitorActors=chosen.map((id,i)=>({id,button:box.children[i],image:box.children[i].querySelector('img'),x:spots[i].x,y:spots[i].y,path:spots[i].path,phase:'idle',progress:0,face:1,nextLookAt:performance.now()+1400+Math.random()*1800,actionAt:performance.now()+1800+Math.random()*1800}));
    dock.querySelectorAll('[data-visitor]').forEach(b=>b.onclick=()=>showVisitor(NPC_BY_ID[b.dataset.visitor]));
  }

  /* ---------- ending callbacks ---------- */
  function epilogueLines(){
    const lines=[],r=R(),t=dominantTemperament();
    lines.push(`<b>Your reputation:</b> ${reputationRumor()}`);
    if(hasFlag('react_corvin_repaid')||hasFlag('react_corvin_paid_forward'))lines.push('<b>Corvin:</b> The wounded traveler eventually became one of the people telling strangers that you might actually be decent.');
    else if(hasFlag('react_greta_feud'))lines.push('<b>Greta:</b> One family still tells the story of what you did to Corvin, with new details every time.');
    else if(hasFlag('react_corvin_robbed'))lines.push('<b>Corvin:</b> Somewhere on the road, one traveler still checks his purse when somebody matches your description.');
    if(hasFlag('react_rook_debt_paid')||hasFlag('react_rook_intel'))lines.push('<b>Rook:</b> A bandit you spared insists the debt was “strictly professional,” which nobody believes.');
    if(hasFlag('react_pipwick_song'))lines.push('<b>Pipwick:</b> A deeply inaccurate song about you is now being performed in at least three villages.');
    if(hasFlag('react_agatha_repaid')||hasFlag('react_agatha_donated'))lines.push('<b>Agatha:</b> The hedge witch has named a potion after the incident. The label does not explain the incident.');
    if(t==='generous'&&lines.length<5)lines.push('<b>The road:</b> Small favors have started returning from people whose names you barely remember.');
    if(t==='greedy'&&lines.length<5)lines.push('<b>The road:</b> Traders have developed a habit of closing cash boxes when they hear your footsteps.');
    lines.push(`<b>The kingdom:</b> ${completedBosses()} regions changed while you were passing through, and ${r.discoveredNpcs.length} recurring travelers now know your name.`);
    return lines.slice(0,6);
  }
  function renderEpilogue(){
    const ending=qs('#endgameEnding'),content=qs('#endgameEndingContent');if(!ending||!content||ending.style.display==='none')return;
    let box=qs('#reactivityEpilogue');if(box)return;box=document.createElement('div');box.id='reactivityEpilogue';box.className='reactivity-epilogue';box.innerHTML=`<h3>The World Remembers</h3><div class="reactivity-epilogue-grid">${epilogueLines().map(x=>`<div class="reactivity-epilogue-line">${x}</div>`).join('')}</div>`;content.appendChild(box);
  }

  /* ---------- polished screen transitions ---------- */
  let lastActiveScreenId=document.querySelector('.screen.active')?.id||'';
  function markActiveScreen(){
    const active=document.querySelector('.screen.active');
    if(!active||active.id===lastActiveScreenId)return;
    lastActiveScreenId=active.id;
    if(reduceMotion())return;
    active.classList.remove('reactivity-enter');void active.offsetWidth;active.classList.add('reactivity-enter');
    setTimeout(()=>active.classList.remove('reactivity-enter'),360);
  }
  const screenObserver=new MutationObserver(m=>{if(m.some(x=>x.type==='attributes'&&x.attributeName==='class'))markActiveScreen()});
  document.querySelectorAll('.screen').forEach(s=>screenObserver.observe(s,{attributes:true}));

  /* Low-cost synchronizer; no expensive frame loop. */
  let lastSaveStamp=0;
  setInterval(()=>{
    processAliveChoices();
    if(qs('#combat')?.classList.contains('active')&&combat){renderPersonalityBadge();adaptIntent();monitorBossPhase();syncEnemySprite()}
    updateWorldPulse();updateLevelState();renderVisitors();syncExistingNpcDamage();renderEpilogue();
    const now=Date.now();if(now-lastSaveStamp>7000){lastSaveStamp=now;save()}
  },240);

  const newGameButton=qs('#newGameChoice');
  if(newGameButton)newGameButton.addEventListener('click',()=>setTimeout(()=>{
    state.meta=state.meta||{};delete state.meta.worldReactivity;ensureReactivity();save();
  },0));

  /* Developer-facing smoke-test hooks; no gameplay UI is exposed. */
  window.WorldReactivity={
    state:R,
    npcs:NPCS,
    personalityFor,
    showNpc:id=>{const n=NPC_BY_ID[id];return n?encounterCard(n,n.intro,specificOptions(n)):false},
    forceConsequence:()=>tryDelayedConsequence(Number(state.hub)||0),
    refreshEnemySprite:syncEnemySprite,
    syncCombat:()=>{initReactivityCombat();adaptIntent();monitorBossPhase();syncEnemySprite()},
    reputationRumor
  };
})();
