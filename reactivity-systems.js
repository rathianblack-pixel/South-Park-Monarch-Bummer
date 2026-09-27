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

  // The village and road scenes share the actual visitor cutouts.
  const npcAsset=id=>`Textures/NPCs/RoadVisitors/${id}.png`;
  const NPCS=[
    {id:'corvin-wounded-traveler',name:'Corvin',role:'Wounded Traveler',hubs:[0,1,2],type:'aid',damagedFirst:true,rare:false,intro:'Corvin sits beside the road with a bandage made from a delivery receipt. He says the delivery went better than he did.',quirk:'He remembers faces much better than directions.'},
    {id:'merrick-shady-merchant',name:'Merrick',role:'Shady Merchant',hubs:[0,1,2,3,4],type:'merchant',intro:'Merrick opens his coat before you ask to shop. He closes it when he spots a magistrate in the distance.',quirk:'Every item is “almost legal” in a different jurisdiction.'},
    {id:'mabel-village-gossip',name:'Mabel',role:'Village Gossip',hubs:[0,1],type:'social',intro:'Mabel waves you over. She has three accounts of the same incident and intends to investigate the one involving a goose.',quirk:'She can turn a minor event into regional mythology before lunch.'},
    {id:'brom-ex-guard',name:'Brom',role:'Ex-Guard',hubs:[0,3,4],type:'authority',damagedFirst:true,intro:'Brom watches an old patrol marker. He used to guard it; now he is checking who gets stopped there.',quirk:'He has opinions about every fortress door and most hinges.'},
    {id:'lyra-forest-herbalist',name:'Lyra',role:'Forest Herbalist',hubs:[1,2],type:'healer',intro:'Lyra kneels beside the trail and asks you to lift your boot. The plant beneath it is either medicine or an elaborate rash.',quirk:'She names every plant and insults anyone who calls them weeds.'},
    {id:'pipwick-bard',name:'Pipwick',role:'Traveling Bard',hubs:[0,1,2,3,4],type:'performer',rare:true,intro:'Pipwick announces a verse about your latest victory. You have not told him about it, and he has already added a dragon.',quirk:'The remaining eighty-eight percent rhymes.'},
    {id:'oddo-gravekeeper',name:'Oddo',role:'Gravekeeper',hubs:[2],type:'social',intro:'Oddo is repairing a grave marker after its occupant walked into it on the way out.',quirk:'He can identify a ghost by the kind of complaint it makes.'},
    {id:'cassian-relic-hunter',name:'Cassian',role:'Relic Hunter',hubs:[2,3,4],type:'scholar',rare:true,intro:'Cassian lays out a map with a skull beside the shortcut. He explains the skull was added after he took it.',quirk:'He treats mortal danger as a cartography problem.'},
    {id:'greta-angry-cousin',name:'Greta',role:'Angry Cousin',hubs:[0,1,2,3],type:'authority',intro:'Greta asks whether you have seen her cousin. She has a list of witnesses and a longer list of people who should have helped.',quirk:'She has relatives everywhere and evidence for most of them.'},
    {id:'sister-mara-apothecary',name:'Sister Mara',role:'Nun Apothecary',hubs:[0,2,4],type:'healer',intro:'Sister Mara stops you to inspect a stain on your sleeve. She says it is either blood or a very irresponsible meal.',quirk:'She labels medicine clearly, which makes her suspiciously competent.'},
    {id:'tobin-runaway-squire',name:'Tobin',role:'Runaway Squire',hubs:[0,1,4],type:'aid',damagedFirst:true,intro:'Tobin hides beside a marker with a knight’s oversized helmet in his lap. He asks you not to identify the helmet.',quirk:'He has quit three knights and none of them have noticed yet.'},
    {id:'bernard-town-crier',name:'Bernard',role:'Town Crier',hubs:[0,3,4],type:'social',intro:'Bernard clears his throat. Someone in the next field closes a window before he has said a word.',quirk:'He can make “lost chicken” sound like a royal emergency.'},
    {id:'aldrin-magistrate',name:'Aldrin',role:'Suspicious Magistrate',hubs:[0,3,4],type:'authority',rare:true,intro:'Aldrin has your name in the visitor ledger. He keeps one finger over the adjacent incident column.',quirk:'He believes coincidence is just paperwork that has not confessed yet.'},
    {id:'bruna-innkeeper',name:'Bruna',role:'Rough Innkeeper',hubs:[0,1,3],type:'merchant',intro:'Bruna brings food to stranded travelers and complains that none of them wiped their boots first.',quirk:'Her definition of hospitality includes strict furniture survival rules.'},
    {id:'fenn-courier',name:'Fenn',role:'Nervous Courier',hubs:[0,1,2,3,4],type:'aid',damagedFirst:true,intro:'Fenn arrives with a sealed letter addressed to the other bridge. There are three bridges; Fenn has visited two.',quirk:'He has never delivered a message without accidentally learning a secret.'},
    {id:'agatha-hedge-witch',name:'Agatha',role:'Hedge Witch',hubs:[1,2,3],type:'healer',rare:true,intro:'Agatha’s pot is making a noise no pot should make. She says it is nearly medicine and asks you to stand farther back.',quirk:'Her remedies work, which is more concerning than if they did not.'},
    {id:'perrin-tax-collector',name:'Perrin',role:'Tax Collector',hubs:[0,3,4],type:'authority',rare:true,intro:'Perrin unfolds a toll form longer than the stretch of road he claims to administer.',quirk:'He can calculate a travel levy before you finish saying “what levy?”'},
    {id:'osric-retired-knight',name:'Osric',role:'Retired Knight',hubs:[0,1,4],type:'authority',intro:'Osric watches your feet before your face. Retirement has given him time to critique both.',quirk:'His retirement still contains an unreasonable amount of armor.'},
    {id:'garrick-swamp-fisherman',name:'Garrick',role:'Swamp Fisherman',hubs:[1,3],type:'wanderer',intro:'Garrick carries three fish. The one he describes is still in the swamp and growing with each sentence.',quirk:'Every monster he has seen was “about this big” with his arms fully extended.'},
    {id:'jangles-puppeteer',name:'Jangles',role:'Traveling Puppeteer',hubs:[0,2,3],type:'performer',rare:true,intro:'Jangles introduces two puppets. One bows. The other appears to object to being introduced second.',quirk:'The puppets know personal information he swears he never told them.'},
    {id:'elsie-tailor',name:'Elsie',role:'Village Tailor',hubs:[0,1,4],type:'merchant',intro:'Elsie spots a torn seam before she sees your face. She asks whether you fought a monster or a wardrobe.',quirk:'She can repair a cape and insult its owner in the same stitch.'},
    {id:'cedric-cartographer',name:'Cedric',role:'Scholar Cartographer',hubs:[1,2,3,4],type:'scholar',intro:'Cedric has drawn the creek crossing twice. Both drawings were correct before the last rain.',quirk:'He distrusts maps that have not personally disappointed him.'},
    {id:'mira-stablehand',name:'Mira',role:'Stablehand Squire',hubs:[0,1,3],type:'aid',intro:'Mira is holding reins with no horse attached. She says the horse is not missing, merely ahead of schedule.',quirk:'She is saving up to become a knight and possibly buy a horse first.'},
    {id:'rook-highway-bandit',name:'Rook',role:'Masked Highway Bandit',hubs:[1,2,3,4],type:'rogue',damagedFirst:true,rare:true,intro:'Rook steps out with a knife, sees your equipment, and asks whether this road has a less ambitious toll.',quirk:'He is trying to transition from robbery into “independent toll consulting.”'}
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
      {label:'Help gather supplies',outcome:`You carry supplies with ${npc.name}. Nobody writes a ballad about it. Somebody gets medicine on time.`,rep:{generosity:1},rel:2,rewards:{hp:4},flag:`helped_${npc.id}`},
      {label:'Ask for a remedy',outcome:`${npc.name} measures a small dose, watches you drink it, and asks whether your hands have stopped shaking.`,rep:{},rel:1,rewards:{hp:6}},
      {label:'Leave the bubbling things alone',outcome:`You step away from the bottles. ${npc.name} admits that was the correct response to an unlabeled pot.`,rep:{nerve:-1},rel:0,rewards:{}}
    ];
    if(type==='merchant')return [
      {label:'Make a fair trade · 4 coins',outcome:`${npc.name} counts the four coins twice, then hands over leather without adding a surprise handling fee.`,rep:{generosity:1},rel:2,rewards:{coins:-4,leather:1}},
      {label:'Haggle shamelessly',outcome:`You and ${npc.name} argue over change. The ledger says you won three coins; neither of you accepts the verdict.`,rep:{greed:1,nerve:1},rel:-1,rewards:{coins:3}},
      {label:'Trade rumors instead',outcome:`${npc.name} trades a road rumor for yours. Neither story is verified, but one may keep you out of trouble.`,rep:{},rel:1,rewards:{hp:2}}
    ];
    if(type==='authority')return [
      {label:'Cooperate',outcome:`You answer ${npc.name}'s questions. For once, the form has enough room for the truth.`,rep:{mercy:1},rel:1,rewards:{hp:2}},
      {label:'Lie with confidence',outcome:`${npc.name} spots the lie immediately, then decides the paperwork required to challenge it is not worth two coins.`,rep:{greed:1,nerve:1},rel:-1,rewards:{coins:2}},
      {label:'Challenge the authority of this conversation',outcome:`You ask which rule gives ${npc.name} authority here. The search ends with a page marked provisional.`,rep:{nerve:1},rel:-1,rewards:{}}
    ];
    if(type==='scholar')return [
      {label:'Compare notes',outcome:`Your notes expose a dangerous shortcut. ${npc.name} corrects the map before anyone follows it.`,rep:{generosity:1},rel:2,rewards:{hp:3}},
      {label:'Ask where the valuables are',outcome:`${npc.name} marks an old cache and asks you to promise the map will not become a treasure advertisement.`,rep:{greed:1},rel:-1,rewards:{coins:4}},
      {label:'Take the safer route',outcome:`You follow the safer route from ${npc.name}'s notes. It costs time, but keeps your boots attached.`,rep:{nerve:1},rel:1,rewards:{hp:5}}
    ];
    if(type==='performer')return [
      {label:'Applaud sincerely',outcome:`${npc.name} sings a second verse featuring your name. You ask for one correction; the rhyme refuses to cooperate.`,rep:{generosity:1},rel:2,rewards:{hp:3}},
      {label:'Request a meaner song',outcome:`${npc.name} performs the meaner verse. Three nobles object, and the goose has a stronger case.`,rep:{nerve:1},rel:1,rewards:{coins:2}},
      {label:'Walk away during the dramatic pause',outcome:`You leave during ${npc.name}'s dramatic pause. The performer calls your exit a hostile review.`,rep:{},rel:-2,rewards:{}}
    ];
    if(type==='rogue')return [
      {label:'Let them keep their dignity',outcome:`You lower your weapon. ${npc.name} keeps their dignity and appears unsure what to do with it.`,rep:{mercy:2},rel:2,rewards:{},flag:'react_rook_spared'},
      {label:'Demand a road toll from the bandit',outcome:`You demand a toll from the bandit. ${npc.name} pays five coins while objecting to your licensing.`,rep:{greed:1,nerve:1},rel:-1,rewards:{coins:5}},
      {label:'Threaten them into retirement',outcome:`${npc.name} promises to reconsider this career from a location beyond your reach.`,rep:{violence:1,nerve:1},rel:-2,rewards:{coins:2}}
    ];
    if(type==='social')return [
      {label:'Listen',outcome:`You hear ${npc.name} out. The story reaches its actual point, which was worth waiting for.`,rep:{mercy:1},rel:2,rewards:{hp:2}},
      {label:'Add your own version',outcome:`You add a detail. ${npc.name} likes it enough to repeat it, with a warning that neither of you was there.`,rep:{nerve:1},rel:1,rewards:{coins:2}},
      {label:'Pretend you are late',outcome:`${npc.name} sees through your excuse and lets you go. The unfinished story will find you later.`,rep:{},rel:-1,rewards:{}}
    ];
    if(type==='wanderer')return [
      {label:'Share the road',outcome:`You share the road with ${npc.name}. The miles pass while you compare which signs have lied to you.`,rep:{generosity:1},rel:2,rewards:{hp:4}},
      {label:'Trade travel stories',outcome:`You trade road stories. ${npc.name}'s fish wins on size, your monster wins on witnesses.`,rep:{nerve:1},rel:1,rewards:{coins:2}},
      {label:'Keep moving',outcome:`You part at the next marker. Nobody charges a toll; both of you call that progress.`,rep:{},rel:0,rewards:{}}
    ];
    return [
      {label:'Help',outcome:`You help ${npc.name} handle the immediate problem before it becomes someone else’s emergency.`,rep:{generosity:1},rel:2,rewards:{hp:3}},
      {label:'Ask for payment',outcome:`${npc.name} pays for the help and remembers that you asked first.`,rep:{greed:1},rel:-1,rewards:{coins:3}},
      {label:'Move on',outcome:'You continue down the road. The problem remains behind you.',rep:{},rel:0,rewards:{}}
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
    const changes=[];
    if(rewards.coins){const before=Number(state.coins||0);state.coins=Math.max(0,before+Number(rewards.coins));const amount=state.coins-before;if(amount)changes.push({kind:'coins',amount})}
    if(rewards.hp){const before=Number(state.hp||1);state.hp=Math.min(state.maxHp,Math.max(1,before+Number(rewards.hp)));const amount=state.hp-before;if(amount)changes.push({kind:'hp',amount})}
    for(const key of ['leather','bones','steel'])if(rewards[key]){state.materials=state.materials||{};const before=Number(state.materials[key]||0);state.materials[key]=Math.max(0,before+Number(rewards[key]));const amount=state.materials[key]-before;if(amount)changes.push({kind:key,amount})}
    if(rewards.item){state.meta.items=state.meta.items||{};state.meta.items[rewards.item]=Number(state.meta.items[rewards.item]||0)+1;changes.push({kind:'item',name:rewards.item,amount:1})}
    return changes;
  }

  const ROAD_FAREWELLS={
    'corvin-wounded-traveler':['Corvin practices standing with the conviction of a man challenging a staircase.','A small favor becomes a much larger story in Corvin’s retelling.','Corvin waves, then remembers that waving requires balance.'],
    'merrick-shady-merchant':['Merrick closes his coat before you can check which pockets were yours.','The deal ends with a handshake and a suspicious shortage of receipts.','Merrick calls it honest business with a perfectly straight face.'],
    'mabel-village-gossip':['Mabel has already decided which parts of this conversation need dramatic pauses.','By supper, Mabel will know who heard this story and who pretended not to.','A rumor sprouts legs before you reach the next street.'],
    'brom-ex-guard':['Brom watches the road after you leave, counting footsteps out of habit.','Brom gives a short nod; from him, that is practically a speech.','An old guard lets you go without one more lesson on footwork. Almost.'],
    'lyra-forest-herbalist':['Lyra returns to her herbs, muttering affectionate insults at the weeds.','The leaves in Lyra’s basket smell better than the trouble ahead.','Lyra checks the path once more before letting you take it.'],
    'pipwick-bard':['Pipwick tests your name against a rhyme and immediately regrets it.','A new verse begins before you are safely out of earshot.','Pipwick bows to an audience of one and demands absolutely no applause.'],
    'oddo-gravekeeper':['Oddo sets a tilted marker straight after you leave.','The graveyard grows quiet again, though Oddo listens a moment longer.','Oddo resumes his work with the dignity of a man who owns six shovels.'],
    'cassian-relic-hunter':['Cassian adds a small mark to the map and a large warning beside it.','A fresh annotation appears where Cassian once wrote probably safe.','Cassian rolls up the map with slightly more questions than before.'],
    'greta-angry-cousin':['Greta walks away already deciding which relative gets the first account.','Greta remembers the choice, even if she pretends she has moved on.','One conversation has entered the family record. Greta is its archivist.'],
    'sister-mara-apothecary':['Sister Mara recaps every bottle before giving you another stern look.','Mara sees you off with the expression of someone expecting a return patient.','The last instruction is to rest. Mara knows you heard it.'],
    'tobin-runaway-squire':['Tobin adjusts his helmet until he can see where he is going.','Tobin practices a brave exit and nearly walks into a fence.','For a moment, the squire looks ready to make his own decision.'],
    'bernard-town-crier':['Bernard inhales for an announcement; several windows close in anticipation.','The next bulletin may feature you, at a volume you cannot prevent.','Bernard bows as though the road itself has been listening.'],
    'aldrin-magistrate':['Aldrin adds one line to a ledger that seems to contain everyone.','The magistrate closes the book, which is as close as you get to acquittal.','Aldrin files the encounter under unresolved but interesting.'],
    'bruna-innkeeper':['Bruna goes back to work, still watching your boots.','Somewhere inside, Bruna saves a place at the table without mentioning it.','Bruna’s goodbye contains one more reminder about the furniture.'],
    'fenn-courier':['Fenn runs off before remembering to ask for directions.','The courier checks the address twice and chooses a third road.','Fenn disappears around the bend, carrying more news than luggage.'],
    'agatha-hedge-witch':['Agatha’s cauldron bubbles once, like it has an opinion.','The witch pockets her spoon before it can start another argument.','Purple smoke follows Agatha; even the wind seems reluctant to touch it.'],
    'perrin-tax-collector':['Perrin stamps a page with unnecessary but satisfying force.','The ledger gains another line; the road remains stubbornly where it was.','Perrin checks the arithmetic twice and the rule behind it once.'],
    'osric-retired-knight':['Osric watches your stance until you remember to straighten it.','The retired knight offers approval so subtle it could be mistaken for a cough.','You take three steps before realizing Osric is still judging the fourth.'],
    'garrick-swamp-fisherman':['Garrick retells the encounter with a fish somehow involved.','The fisherman heads for the marsh with bait and a fresh exaggeration.','Garrick waves with the arm normally reserved for describing enormous fish.'],
    'jangles-puppeteer':['One puppet applauds; the other appears to object.','Jangles takes a bow while his puppets conduct a private argument.','The tiny wooden audience gives your exit mixed reviews.'],
    'elsie-tailor':['Elsie notices another loose thread before you can escape.','A repaired seam outlasts the lecture that accompanied it.','Elsie watches you walk away, assessing every stitch under strain.'],
    'cedric-cartographer':['Cedric pencils your route in, then draws a question mark beside it.','The map becomes more accurate and less reassuring.','Cedric thanks you by correcting a road you thought you knew.'],
    'mira-stablehand':['Mira wins another round against the rope. Barely.','A knot comes loose as Mira celebrates like a tournament champion.','Mira gives the stable a victorious nod. The stable does not respond.'],
    'rook-highway-bandit':['Rook practices a friendly goodbye and almost makes it convincing.','The bandit backs away as though kindness might be a trap.','Rook vanishes behind the signpost, leaving the toll sign behind.']
  };
  function rewardNarration(npc,choice,changes){
    const seen=Number(R().npcSeen[npc.id]||0),index=(seen+travelNow())%3;
    const phrasing={
      coins:n=>n>0?[`Your purse gains ${n} coin${n===1?'':'s'}; its optimism returns.`,`You leave with ${n} more coin${n===1?'':'s'} and a better story.`,`The road contributes ${n} coin${n===1?'':'s'} to your future bad decisions.`][index]:[`You spend ${-n} coin${n===-1?'':'s'} and keep the receipt in your conscience.`,`Your purse loses ${-n} coin${n===-1?'':'s'}; the exchange feels strangely worthwhile.`,`A payment of ${-n} coin${n===-1?'':'s'} settles this part of the matter.`][index],
      hp:n=>[`A breather restores ${n} HP. Your joints file a brief thank-you.`,`You recover ${n} HP and feel ready to argue with the road again.`,`A little care restores ${n} HP; no miracle required.`][index],
      leather:n=>`${n} leather ${n===1?'piece joins':'pieces join'} your pack.`,
      bones:n=>`${n} bone${n===1?'':'s'} ${n===1?'finds':'find'} a place in your supplies.`,
      steel:n=>`${n} demon steel ${n===1?'piece is':'pieces are'} tucked safely away.`,
      item:n=>`A ${n.name} joins your supplies for a less pleasant day.`
    };
    const gain=changes.map(c=>c.kind==='item'?phrasing.item(c):phrasing[c.kind]?.(c.amount)).filter(Boolean).join(' ');
    const endings=ROAD_FAREWELLS[npc.id]||[`${npc.name} returns to the road.`];
    const ending=endings[(Number(choice.rel||0)+seen+travelNow()+endings.length*20)%endings.length];
    return [gain,choice.memory||ending].filter(Boolean).join(' ');
  }

  const ROAD_CONVERSATIONS={
    'corvin-wounded-traveler':{lead:[['npc','Before you ask, the bandage is mine, the blood is mine, and the branch I fell off belongs to nobody.'],['player','That is a suspiciously rehearsed explanation.'],['npc','It became rehearsed after the third person asked whether I was dying. I am only dramatically inconvenienced.'],['player','Do you actually have somewhere safe to go?'],['npc','I know where the village is. My legs are still negotiating the distance.']],road:['The bridge is passable if you stay off the loose plank. I learned this with my entire spine.','If you see someone limping behind you, please do not assume it is a monster. It might be me again.'],self:['I used to carry goods between villages. Now I seem to be carrying a cautionary tale.','I will get back to work once the road stops moving whenever I stand up.'],part:['You do not have to stay until I can walk. A little help was already more than I expected.','Next time we meet, I intend to be upright. Please pretend not to remember this position.']},
    'merrick-shady-merchant':{lead:[['npc','Welcome to a shop with no walls, no receipts, and surprisingly few complaints that reached a magistrate.'],['player','That last part does not reassure me.'],['npc','Then let me reassure you with inventory. A clasp, a compass, and a bottle that may once have been a compass.'],['player','Where did you get all of this?'],['npc','From people who asked fewer questions. You would like them; they were excellent customers.']],road:['The eastern road is watched. The western road is watched by people who think they are being clever.','I sell directions, but I give that warning away because a dead customer never comes back.'],self:['Business has been good enough to worry me. Honest roads are bad for merchants with my particular talents.','I am considering a permanent stall, provided nobody asks me to explain the word permanent.'],part:['Keep your purse where I can see it. I mean, where you can see it. An understandable slip.','If anyone asks, we had a perfectly ordinary conversation about weather and lawful trade.']},
    'mabel-village-gossip':{lead:[['npc','There you are. I have heard three stories about you, and I only believe two and a half.'],['player','How can you believe half a story?'],['npc','The first half was witnessed. The second involved a goose becoming mayor, so I am investigating.'],['player','Please tell me you are not spreading that.'],['npc','I am gathering testimony. Spreading comes after lunch.']],road:['A courier passed through with an empty bag and a full expression of panic. That means news.','I will know what happened by supper, assuming nobody tells the truth and ruins the mystery.'],self:['I listen because people need someone to remember them. The funny parts are a professional bonus.','Half the village calls me nosy. The other half finds me the moment something goes missing.'],part:['I will tell the kinder version of this meeting if you give me one worth telling.','Do not make a face. I would have recognized you from across the bridge anyway.']},
    'brom-ex-guard':{lead:[['npc','Your boots announce you before your face does. Old guard habit: I hear every step.'],['player','Is that why you are staring at the road?'],['npc','I used to defend it. Now I watch who claims to own it. Those are different jobs.'],['player','And what do you see?'],['npc','People carrying orders they have not thought about, and travelers paying for those orders.']],road:['The old watchtower has a blind approach behind the broken marker. Useful if patrols return.','Do not mistake an empty road for a safe one. Someone chose where the guards would stand.'],self:['I left my post when I could no longer tell protection from intimidation.','The armor still fits. The orders never did.'],part:['Keep your guard up, but leave room to listen. Most fights start before anyone draws steel.','If you see a patrol abusing the road, remember their faces. I will.']},
    'lyra-forest-herbalist':{lead:[['npc','Careful where you put your boot. That little green thing is medicine, not lawn.'],['player','They look exactly alike.'],['npc','One eases fever. The other gives you a rash shaped like regret. I understand the confusion.'],['player','Are you gathering all of this alone?'],['npc','The plants are better company, but their hands are absolutely useless.']],road:['The briars grew across the northern trail overnight. Something in the woods is pushing them.','If a flower glows blue after sundown, admire it from a respectful distance.'],self:['I learned plants from my grandmother. She believed every weed was an answer to a question.','I still have not found the question for the screaming mushrooms.'],part:['Take a leaf for your kit, not an entire root. The forest needs to recover too.','And wash your hands before eating. That advice has saved more heroes than swords have.']},
    'pipwick-bard':{lead:[['npc','Excellent, the hero arrives just as I reach the verse where the bridge catches fire.'],['player','The bridge never caught fire.'],['npc','Then my draft contains a minor historical improvement. Would you prefer lightning?'],['player','I would prefer accuracy.'],['npc','A daring artistic choice. It will make the chorus difficult.']],road:['A crowded road means fresh stories. A quiet road means the stories are waiting in the bushes.','I have played both kinds, and the bushes have never tipped.'],self:['I came here to write a great ballad. Somehow I became the person who carries everybody’s bad news.','I sing the silly version first. People listen longer when they know a laugh is coming.'],part:['If you survive the next chapter, I promise to rhyme your name with something flattering.','No guarantees about the meter. Your adventures keep changing it.']},
    'oddo-gravekeeper':{lead:[['npc','Step around that stone. It marks a grave, not a shortcut.'],['player','It looks like every other stone here.'],['npc','To you. I know who is beneath each one, and most of them were less troublesome alive.'],['player','Most?'],['npc','There is always one family that insists on complicated arrangements. Death did not simplify them.']],road:['People hurry through the cemetery road after sunset. I prefer it when they at least read the names.','The dead are quiet until someone decides to borrow something they buried.'],self:['I keep this place because memory needs maintenance. Stones fall, names fade, people move away.','It is not glamorous. That is how I know the work matters.'],part:['If the gate is open, close it behind you. The wind has enough bad habits already.','And if you hear a voice from below, tell me before you answer it.']},
    'cassian-relic-hunter':{lead:[['npc','Do not step on that map. It contains six days of work and one very expensive mistake.'],['player','Why is there a skull drawn beside the road?'],['npc','That is the expensive mistake. The skull is a surprisingly accurate portrait of my reaction.'],['player','Are you still going back?'],['npc','Of course. I have since acquired a longer stick and modest self-awareness.']],road:['The ruins west of here were built over older ruins. Someone in history was very committed to poor foundations.','Watch the stones with fresh chalk marks. Those are mine, and they mean I survived the first visit.'],self:['I collect relics because objects remember things people prefer to forget.','The money helps pay for ropes. The truth is why I keep buying more.'],part:['If you find a sealed door, record the symbol before you open it.','I am asking as a scholar and as someone who has opened the wrong door before.']},
    'greta-angry-cousin':{lead:[['npc','I know that face. Either we have met or one of my cousins has complained about you.'],['player','How many cousins do you have?'],['npc','Enough to make that question a strategic error.'],['player','What did they say?'],['npc','That depends. Are you here to improve the story or give me a better one?']],road:['Someone is charging travelers to cross a public bridge. I intend to learn their name.','The road belongs to people who use it, no matter how fancy the toll sign looks.'],self:['Being angry is easy. Keeping track of whom the anger ought to protect is the hard part.','I check on my family because somebody has to, and they keep pretending they are fine.'],part:['If you help someone out there, tell them who sent you. If you hurt them, do not.','That was a joke. Mostly.']},
    'sister-mara-apothecary':{lead:[['npc','Hold still. You smell like smoke, old leather, and a very bad healing decision.'],['player','You can diagnose me by smell?'],['npc','No. I can judge your choices by smell. Diagnosis takes a clean cloth and patience.'],['player','Are all those bottles medicine?'],['npc','They are labeled. Do not drink anything whose label is facing inward.']],road:['Travelers are arriving with the same cuts from different directions. Something has changed on the road.','If you meet someone injured, give them water and bring them here. Do not improvise surgery.'],self:['I took the habit of carrying supplies from a convent that never had enough.','People call me stern. The people still breathing usually call me by name.'],part:['Rest before you collapse. I charge more when I have to drag you inside.','And do not confuse the blue bottle with the violet one. They have very different opinions of your stomach.']},
    'tobin-runaway-squire':{lead:[['npc','If anyone asks, you have not seen a squire with an oversized helmet.'],['player','I am looking directly at one.'],['npc','Then you are an unreliable witness. I have been practicing that argument all morning.'],['player','Who are you hiding from?'],['npc','A knight who calls every errand a test of valor. I failed the one involving laundry.']],road:['There is a patrol ahead, but they stop for tea longer than they patrol.','I know because I carried the tea. It was apparently a test of vigilance.'],self:['I wanted to become a knight because the stories end with people being helped.','Nobody mentioned the years of polishing things that do not need polishing.'],part:['If I go back, it will be because I chose to, not because someone found my helmet.','Could you avoid mentioning how frightened I sounded? I am building a reputation.']},
    'bernard-town-crier':{lead:[['npc','Hear ye! Important news approaches, currently wearing your boots!'],['player','Must every conversation start at that volume?'],['npc','No. Some start louder, but I am showing restraint because the windows are open.'],['player','What is the actual news?'],['npc','That depends on whether you want the official notice or the version people believe.']],road:['A supply cart missed its scheduled arrival. That is news; the excuse will be a separate announcement.','Listen for bells near the crossroads. A messenger uses two rings for trouble and three for panic.'],self:['I announce things so nobody can say they were left in the dark.','The difficulty is that half the town hears only what fits its favorite argument.'],part:['If you discover something important, bring me the facts before Mabel brings me the song.','I will use my indoor voice. That is a legally flexible promise.']},
    'aldrin-magistrate':{lead:[['npc','Your name is in my ledger. Before you object, it is in the visitor column.'],['player','Why do you have a visitor column?'],['npc','Because the incident column became too thick to carry.'],['player','Am I in that one too?'],['npc','That is an excellent reason to keep this conversation civil.']],road:['The toll notices along the western route disagree with the signed ordinance. Someone changed one.','I am collecting copies before the people responsible discover ink can be evidence.'],self:['I used to believe every problem could be solved by a form.','Now I believe the correct form sometimes gives people enough time to solve the problem themselves.'],part:['Keep any stamped paper you find. Even foolish orders have signatures.','Should this become a hearing, I would prefer you on the side with fewer surprises.']},
    'bruna-innkeeper':{lead:[['npc','You look like someone who would put muddy boots on a clean table.'],['player','I have not even asked for a room.'],['npc','Exactly. I am getting the rules in before the negotiation starts.'],['player','Do you have anything useful for the road?'],['npc','Food, water, and advice. The advice is free if you listen the first time.']],road:['The bridge gets crowded before dusk. Leave early or enjoy a long conversation with a wagon axle.','Travelers who rush past supper usually come back needing twice as much food.'],self:['An inn is a place people pass through. I still learn who they are when they think nobody is watching.','It takes work to keep a door open in a kingdom that likes locking gates.'],part:['If you find yourself stuck after dark, come in before you become a rescue story.','And wipe your boots. That part of the invitation is not negotiable.']},
    'fenn-courier':{lead:[['npc','Finally! Someone who might know where the old bridge is. There are three old bridges.'],['player','Which one is on the letter?'],['npc','That would have been useful information to include. It only says, urgently, to the other side.'],['player','You have been running with that?'],['npc','I run first, ask questions second. It keeps me employed and occasionally lost.']],road:['Messages are moving faster than carts, which means somebody is worried enough to pay for speed.','If I appear twice in one day, assume the second letter is the important one.'],self:['People trust couriers with secrets because they think we are too busy to listen.','I listen. I just do not repeat the parts that would hurt anyone.'],part:['If you find the recipient before I do, tell them I am trying.','Actually, tell them I am nearly there. It sounds much more professional.']},
    'agatha-hedge-witch':{lead:[['npc','Stand back from the pot. It has reached the stage where it may learn your name.'],['player','Is that supposed to happen?'],['npc','Not today. I was aiming for a remedy, not a pen pal.'],['player','Then why are you still stirring it?'],['npc','Because stopping now would let it think it won.']],road:['The hedge has been whispering different directions to travelers. Ignore it when it uses your voice.','And do not pick the purple mushrooms. I need them, and they hold grudges.'],self:['I make remedies for people who cannot afford to be ill on the road.','The rumors about curses discourage thieves, so I only correct the dangerous ones.'],part:['Take care of your hands. Heroes always remember armor and forget the fingers inside it.','If the spoon starts screaming, bring it back. It means my experiment followed you.']},
    'perrin-tax-collector':{lead:[['npc','A moment. By crossing this marker, you have entered the provisional assessment stretch.'],['player','That sounds invented.'],['npc','All stretches are invented until someone draws a line and charges for crossing it.'],['player','Does anyone actually pay?'],['npc','Enough people do that my supervisor calls the system a success. I have other words.']],road:['The east checkpoint charges twice for carts and once for people. The arithmetic is intentional.','Keep your receipts. A second collector cannot legally charge you again, however creatively they may try.'],self:['I thought this job would involve orderly ledgers. It mostly involves people asking why a bridge needs a tax.','I have started asking the same question. Quietly.'],part:['If you challenge a fee, challenge the rule, not the clerk standing in the rain.','Though if the clerk is me, a little sympathy will not damage the appeal.']},
    'osric-retired-knight':{lead:[['npc','Your stance is open on the left. Before you protest, you turned to protest on the left.'],['player','Do retired knights always critique strangers?'],['npc','Only the ones who might survive if they listen.'],['player','That almost sounded kind.'],['npc','Retirement has softened me into a menace to poor footwork.']],road:['The road near the fortress narrows between two walls. Never chase an enemy into it.','If you must cross, watch the high ground first and your pride second.'],self:['I served long enough to see victories people could not enjoy afterward.','These days I teach small corrections. A small correction can bring someone home.'],part:['Practice the step before the swing. There is no glory in striking hard and falling over.','You can thank me after you prove the lesson useful.']},
    'garrick-swamp-fisherman':{lead:[['npc','You should have seen the fish I almost caught. The water rose around it like a throne.'],['player','How big was it really?'],['npc','Big enough to take my bait and my favorite story. The story has since recovered.'],['player','And the fish?'],['npc','If you find it, tell it I would like the hook back.']],road:['The wet crossing is safer at dawn. After rain, the mud likes keeping boots.','A traveler lost one yesterday. He went home wearing one shoe and a very firm opinion.'],self:['Fishing gives me a reason to sit still long enough to notice what the world is doing.','The tales get taller, but the warnings underneath are usually true.'],part:['If the marsh goes quiet all at once, turn around. Even the frogs know something then.','Come back with a story. I will pretend yours is the larger one.']},
    'jangles-puppeteer':{lead:[['npc','My puppets insist they recognize you. I told them that is impossible and extremely rude.'],['player','Do they talk when you are not holding them?'],['npc','Only when they have criticism. So, fairly often.'],['player','That is not reassuring.'],['npc','Try touring with them. They demand applause and refuse to carry the stage.']],road:['Children on the road asked whether monsters have strings. I told them some kings do.','The adults laughed less. That usually means a line worked.'],self:['A puppet can say what a person is afraid to say aloud.','I did not expect the puppets to become bolder than I am.'],part:['If you hear a wooden voice telling you to duck, consider taking its advice.','But if it asks for money, that is one of mine. Ignore it.']},
    'elsie-tailor':{lead:[['npc','Stop moving. That seam is holding together through sheer embarrassment.'],['player','It has survived every fight so far.'],['npc','Survived is the word people use when they cannot say maintained.'],['player','Can you fix it?'],['npc','Yes, after I finish judging the person who let it get this bad.']],road:['A coat that sheds water saves more strength than an impressive buckle.','The weather past the creek changes faster than the merchants admit.'],self:['I mend clothes because people deserve something dependable when the rest of the road is not.','I remember every tear. I also remember who came back wearing the repair.'],part:['Come by before the next seam gives up. Repairs are cheaper than heroic explanations.','And keep your elbows out of thorn hedges. Your sleeves are tired of meeting them.']},
    'cedric-cartographer':{lead:[['npc','Please tell me which side of the creek you came from. My map insists this road is on both.'],['player','Maybe you drew it twice.'],['npc','I did. The problem is that both drawings were correct on different days.'],['player','That sounds impossible.'],['npc','That is why I am here with a pencil instead of publishing it.']],road:['The safest route is not always the shortest line. The old stones show where carts actually survived.','If a sign points straight into a hedge, distrust the sign before you distrust the hedge.'],self:['I draw maps so a stranger can make it home without knowing my name.','The world does keep changing the answers, which feels personal at this point.'],part:['Mark where you walked, not where you intended to walk. Those are rarely the same road.','If you find a path my map missed, I would rather correct it than be right.']},
    'mira-stablehand':{lead:[['npc','Do you know how to untie a knot that a horse made while the horse was not here?'],['player','How could a horse make it if it was not here?'],['npc','That is exactly what I have been asking this rope for twenty minutes.'],['player','Need a hand?'],['npc','Yes. I want to become a knight, but first I must defeat this length of string.']],road:['The stable trail avoids the worst stones. It is longer but easier on tired legs.','If a cart driver offers a ride, ask whether their horse agreed to the schedule.'],self:['I train whenever the stables are quiet. It is not often, but I have learned to work quickly.','One day I will have my own horse. I should probably meet it before choosing a name.'],part:['If you see a stray horse, approach slowly. If you see a stray squire, the same advice works.','Thank you for helping. I will call this a tactical victory over rope.']},
    'rook-highway-bandit':{lead:[['npc','Hold there. This stretch of road has recently become a toll route.'],['player','You drew that sign on the back of a menu.'],['npc','A resourceful business keeps its costs low. Also, the menu was abandoned.'],['player','How much is this imaginary toll?'],['npc','I was hoping you would suggest a number before I embarrassed myself.']],road:['There is another bandit crew north of here. They lack my professional restraint.','If you see two lanterns on one pole, take the longer path and keep your money.'],self:['I started with robbery because nobody was hiring. I stayed because admitting a mistake is hard.','I am exploring alternative careers with fewer knives and better hours.'],part:['You did not hear any of that. My reputation could be ruined by personal growth.','If we meet again, I will try opening with a greeting instead of a demand. No promises.']}
  };

  const UNFLIPPED_VISITORS=new Set(['brom-ex-guard','rook-highway-bandit','perrin-tax-collector','merrick-shady-merchant']);
  const ROAD_BACKDROPS=['placenta','mild','grave','question','monarch'];
  function roadBackdrop(){
    const index=Math.max(0,Math.min(4,Number(state.hub)||0));
    const day=(state.ng?window.getNgPlusVisuals?.()?.combat?.[index]:null)||`Textures/Maps/Areas/${ROAD_BACKDROPS[index]}.jpg`;
    return {day,night:day.replace(/(\.[^.]+)$/,'-night$1'),blend:Math.max(0,Math.min(1,Number(window.gameClock?.getState?.()?.nightBlend)||0))};
  }
  // Three authored reactions per visitor. The selected choice determines the exchange.
  const ROAD_CHOICE_DIALOGUE={
    'corvin-wounded-traveler':[
      ['That medicine smells like a stable, but my leg has stopped arguing with the rest of me.','Keep the bandage clean; I would like to recognize you while standing next time.'],
      ['I can see my purse from here. I cannot chase it, which is an awful lesson about trust.','When I reach town, I shall describe both your face and your excellent timing.'],
      ['I understand. The road does not stop because I did.','Leave the walking stick near the marker, at least. I can crawl toward an achievable goal.']],
    'merrick-shady-merchant':[
      ['A fair price? You have taken the most exciting part of commerce away from me.','Here is the leather. I even know whose cow it came from, approximately.'],
      ['You are haggling with a man who has already sold the same compass twice.','Fine, take these coins. I will call the loss an educational expense.'],
      ['I heard the watch captain has been buying empty bottles. That is either a scheme or very thirsty policing.','Your rumor buys you mine. Neither of us is allowed to call it evidence.']],
    'mabel-village-gossip':[
      ['The baker claims the missing flour walked away. I suspect the apprentice and an ambitious goose.','Thank you for listening to the entire version; most people flee before the flour.'],
      ['You fought three guards with a soup spoon? That is better than what I heard.','I will repeat your version, but you must accept responsibility for the spoon.'],
      ['You are late? Then I had better tell you the ending first.','Nobody escaped the wedding, including the goose. There; you may go.']],
    'brom-ex-guard':[
      ['Tell me which patrol you saw. I am recording where they harass travelers.','Thank you for cooperating without making me sound like my old captain.'],
      ['Your story is too tidy. Your boots have been where you say you never went.','Keep the coin, but do not mistake my silence for belief.'],
      ['You challenge my authority? Good. I no longer wear a badge.','Ask the next armed man for the rule before he orders you around.']],
    'lyra-forest-herbalist':[
      ['Pull the bramble from its roots, gently. The cure grows beside the curse.','That bundle is yours. Do not boil it with your socks again.'],
      ['You are charging me for directions to a path we can both see?','Take the coins; I am paying to end this conversation before the nettles arrive.'],
      ['Gloomfang is near? The birds went quiet before you told me.','I will warn the gatherers. You keep your boots out of the blue flowers.']],
    'pipwick-bard':[
      ['Three coins buys a heroic chorus and the right to correct one rhyme.','I have made you taller in the second verse. The truth was damaging the meter.'],
      ['A free song deserves a free review. Mine will be devastating.','Listen: the hero fought bravely, then fled the collection plate. Catchy, no?'],
      ['A goose did what? Wait, let me tune this string.','This is no longer your song. This is a national anthem for bad decisions.']],
    'oddo-gravekeeper':[
      ['Help me set this nameplate straight. Someone deserves to be remembered level.','That is better. The dead cannot thank you, so I will.'],
      ['You want wages for tending a grave? I can spare a little.','Please keep the name in mind longer than the money lasts.'],
      ['Go, then. The gate is on your left.','Close it behind you; even the dead prefer a little privacy.']],
    'cassian-relic-hunter':[
      ['The chalk mark means the floor below is hollow. Your note had it three paces east.','We have corrected the map before a stranger fell through it. That counts as scholarship.'],
      ['The valuable chamber is marked with a skull, which should answer both questions.','If you insist on going, take this coin and buy a longer rope.'],
      ['Take the outer wall and step where the grass has grown.','The shortcut has no grass because the stones keep eating visitors.']],
    'greta-angry-cousin':[
      ['Tell me which tollkeeper took my cousin’s coin.','I am angry at the theft, not at the person giving me a name.'],
      ['That lie is enthusiastic. My cousins taught me every version.','Keep the coin and use it to practice an honest apology.'],
      ['I have no official authority, only a large family with questions.','Let us challenge the toll sign together instead.']],
    'sister-mara-apothecary':[
      ['Sort the clean bandages from those touched by the road. Yes, there is a difference.','Good hands. You may be useful without requiring stitches yourself.'],
      ['A remedy is not a sweet. Take this and drink water afterward.','If your tongue turns green, return the bottle, not a complaint.'],
      ['Leaving the bottles alone is unusually good judgment for an adventurer.','Wash your hands anyway. The labels are not the dangerous part.']],
    'tobin-runaway-squire':[
      ['Carry my helmet? No, I can do that. Help me decide whether to go back.','You listened without issuing an order. That is more knightly than my training.'],
      ['The knight pays for errands; I can give you the coins meant for polishing.','Please do not tell him I spent them on the first honest advice I received.'],
      ['I know you have somewhere to be. So do I, eventually.','If a knight asks, I went looking for a better one.']],
    'bernard-town-crier':[
      ['Hear ye—quietly. The supply cart is missing, and nobody has confirmed why.','Thank you for asking for facts. It makes my job almost reputable.'],
      ['You saw a cart guarded by twelve geese? That is splendidly unverified.','I will announce it as a rumor until the geese submit testimony.'],
      ['Your urgent business is noted and shall not be announced.','Go before I discover an official reason to shout your departure.']],
    'aldrin-magistrate':[
      ['Your account matches the witness report. A rare pleasure for this ledger.','I will record the cooperation without adding you to the incident column.'],
      ['That is a confident lie. The dates disagree with your own boots.','I am letting you leave because prosecuting boots would be embarrassing.'],
      ['You want the exact ordinance? Here are three contradictory copies.','Help me determine which one authorized a toll on public soil.']],
    'bruna-innkeeper':[
      ['Four coins for supplies? Fair enough. I can feed a traveler with those.','Here is the leather. Wipe your boots before you carry it out.'],
      ['Haggling for change? My chairs have survived worse negotiations.','Take the coins, but leave the furniture out of it.'],
      ['A rumor about the bridge? I heard a wagon stopped there with no driver.','Trade me a better detail and I might serve warm bread.']],
    'fenn-courier':[
      ['Walk with me to the fork and read this address aloud. I keep finding a different bridge.','There. The ink did not change; I just needed another pair of eyes.'],
      ['Your journey sounds dangerous. Mine involves a letter addressed to “the other side.”','I would trade adventures, but then you would inherit this envelope.'],
      ['Keep moving, yes. I will run ahead and be lost first.','If you see a blue seal near the bridge, shout. That is probably my destination.']],
    'agatha-hedge-witch':[
      ['The mushrooms scream when you pick them. That means they are fresh.','Stop looking at me like that; the quiet ones are poisonous.'],
      ['One sip. If you begin hearing colors, describe them precisely.','Excellent. Blue sounds offended today. I shall adjust the recipe.'],
      ['Survival instinct is respectable, though terrible for experimental data.','Stand back while I convince this pot to become medicine.']],
    'perrin-tax-collector':[
      ['Five coins, one receipt. Watch me stamp the correct paper for once.','Keep it. The next collector cannot charge you twice, whatever he claims.'],
      ['Diplomatic immunity requires a country. Which one sent you?','Never mind. I cannot find the form for that answer, and you know it.'],
      ['The legal definition of road spans seventeen pages. You asked.','Page nine accidentally includes rivers. That is where my objections begin.']],
    'osric-retired-knight':[
      ['Answer plainly: which side of the pass is guarded?','Good. You listen before you swing; that might keep you alive.'],
      ['Your confident story has a hole wide enough for cavalry.','I will let it pass if your footwork improves faster than your lies.'],
      ['I retired from giving orders. Question my stance advice too.','Then test it against the training post instead of trusting my title.']],
    'garrick-swamp-fisherman':[
      ['Walk the dry bank with me. The mud swallowed a boot there yesterday.','You spotted the firm stones faster than my brother did. Do not tell him.'],
      ['Your fish was as big as a horse? Mine would have eaten the horse.','We both know one of us is lying, and neither will say who.'],
      ['Go on, but turn back if the frogs suddenly stop.','Even my largest fish has never frightened every frog at once.']],
    'jangles-puppeteer':[
      ['The puppet bows to you. That is rare; he dislikes critics.','Your applause has gone directly to his wooden head.'],
      ['A meaner show? Fine. The king is a marionette with no visible strings.','The children will laugh. Their parents will recognize the voice.'],
      ['Walking away at the pause is a bold review.','My smallest puppet has named you the villain of tomorrow’s matinee.']],
    'elsie-tailor':[
      ['A fair trade for leather? I can finally make a seam that survives your elbows.','Keep it dry; I will not mend rain out of it for free.'],
      ['Haggling over a stitch is why that sleeve looks exhausted.','Take the change, and stop testing my work against thorns.'],
      ['The tailor by the bridge says capes are back in fashion? That is a rumor, not a request.','I will tell you which trail shreds them quickest.']],
    'cedric-cartographer':[
      ['Your route proves the creek moved, not my compass. That is strangely comforting.','I will redraw the crossing before anyone trusts the old ink.'],
      ['Valuables? The map marks an abandoned vault, and a very active sinkhole.','Take the coin instead. It weighs less than regret.'],
      ['The longer trail follows the stone markers. Count all seven.','If you find an eighth, the maze has started making suggestions.']],
    'mira-stablehand':[
      ['Hold the lead rope while I check her hoof. She dislikes sudden heroes.','There. She trusts you enough to stop trying to eat your glove.'],
      ['You once outran a horse? Then it was a very patient horse.','Mine wins on stamina and loses on dramatic narration.'],
      ['Keep going, but give the mare room near the gate.','She judges everyone by whether they remember she is bigger than them.']],
    'rook-highway-bandit':[
      ['You are really letting me go? I had a speech ready for being arrested.','I will try a different road. Perhaps one with honest work and fewer swords.'],
      ['You are charging a toll to the toll collector? That is criminally elegant.','Take the coins. I can admire a reversal while resenting it.'],
      ['Retirement sounds appealing when you say it with a weapon drawn.','I am leaving the profession today, at least until I find a better one.']]
  };

  const ROAD_PLAYER_REPLIES={
    'corvin-wounded-traveler':['I will make sure the bandage holds.','I heard you. That does not make me proud.','I can at least leave the stick within reach.'],
    'merrick-shady-merchant':['I prefer a receipt, even from you.','I counted the coins twice.','Let us both pretend those rumors have sources.'],
    'mabel-village-gossip':['What happened to the flour?','Please keep the dragon out of my version.','You really do know the ending already.'],
    'brom-ex-guard':['I saw them at the western marker.','My boots have betrayed me.','Then I will ask them to name the rule.'],
    'lyra-forest-herbalist':['These roots are tougher than they look.','I admit the fee was shameless.','I hoped the birds were wrong.'],
    'pipwick-bard':['Make the chorus accurate enough to survive me.','That title will follow me forever, will it not?','I regret giving you the goose incident.'],
    'oddo-gravekeeper':['The name is straight now.','I will remember whose grave it is.','I will close the gate.'],
    'cassian-relic-hunter':['So the chalk is a warning.','I will bring a rope, then.','The grass knows something the map does not.'],
    'greta-angry-cousin':['I can name the tollkeeper.','I owe your cousin a better account.','Show me the sign.'],
    'sister-mara-apothecary':['The clean cloth goes here.','I will drink water first.','I shall not touch the labels either.'],
    'tobin-runaway-squire':['You can choose which knight deserves you.','I will not mention the polishing money.','I hope you find your way back on your terms.'],
    'bernard-town-crier':['Then announce only what you know.','Please make that a rumor, not a headline.','I appreciate the quiet version.'],
    'aldrin-magistrate':['Write down the witness report.','I should have chosen a better date.','The river ordinance is absurd.'],
    'bruna-innkeeper':['The supplies will be useful.','The chairs were never in danger.','I will check the bridge before supper.'],
    'fenn-courier':['Read the seal before you run.','I will keep this letter to myself.','I will watch for the blue seal.'],
    'agatha-hedge-witch':['They stopped screaming. Is that good?','Blue sounds very judgmental.','I will watch from a safer distance.'],
    'perrin-tax-collector':['I will keep the receipt.','This is not my finest disguise.','Page nine taxes a river?'],
    'osric-retired-knight':['The eastern side has the patrol.','My footwork is better than that lie.','Show me the training post.'],
    'garrick-swamp-fisherman':['Those stones are solid.','Your fish gets bigger every sentence.','I will listen for the frogs.'],
    'jangles-puppeteer':['I was applauding the puppet, mostly.','The adults may understand that one.','Tell the little puppet I apologize.'],
    'elsie-tailor':['The seam already looks stronger.','I will stop haggling over thread.','No capes near the creek, then.'],
    'cedric-cartographer':['Mark the crossing in pencil.','I prefer the coin to the sinkhole.','I will count seven markers.'],
    'mira-stablehand':['She has stopped pulling away.','The horse deserves a version too.','I will give her room.'],
    'rook-highway-bandit':['Try the honest road for a while.','That reversal suits me rather well.','Find work that does not require a knife.']
  };
  const ROAD_REPEAT_CHOICE_DIALOGUE={
    'corvin-wounded-traveler':[
      ['The supplies are lighter than the last parcel I carried. Thank you for taking half.','I might make it to the next village without rehearsing another injury explanation.'],
      ['Payment? I can spare a few coins. The bandage still holds thanks to you.','Please do not turn my gratitude into a recurring delivery fee.'],
      ['I am walking again. Go ahead; I can find the bridge this time.','If I cannot, I know which side of the road has the helpful people.']],
    'agatha-hedge-witch':[
      ['Sort the leaves by color, not by whether they hiss. The hiss is unreliable.','Good. Those will help the next traveler without involving the screaming mushrooms.'],
      ['This dose has finished brewing. It no longer knows anybody’s name.','Take it before the pot develops another opinion.'],
      ['You have learned quickly. Stand back when the spoon starts arguing.','I would rather you leave healthy than become a case study.']],
    'perrin-tax-collector':[
      ['I only need your name and route this time. The provisional assessment was withdrawn.','Thank you. A completed form can be merciful when it is the correct form.'],
      ['Your explanation contradicts the first one, but my supervisor wrote a worse one.','Take your change. I have no appetite for a hearing about this.'],
      ['You are right to ask who authorized this checkpoint. I have asked as well.','Until I get an answer, nobody is paying a fee here.']],
    'pipwick-bard':[
      ['You applauded the accurate verse. That is an unfamiliar critical opinion.','I may keep it, even though the goose does not rhyme with the truth.'],
      ['A meaner song needs a target. I shall aim at the tollkeeper rather than the audience.','If he complains, I will offer him a verse in his own defense.'],
      ['You left before the ending again. I have shortened the pause this time.','No, wait. You are already walking. That is the ending now.']],
    'lyra-forest-herbalist':[
      ['Hold the basket steady. The blue leaves bruise if you grab them.','Good. That is enough medicine for the gatherers on the north trail.'],
      ['This remedy comes from the plants you helped save. Do not drink the whole bottle at once.','I know that sounds obvious. It was not obvious to the last ranger.'],
      ['Keeping away from the pot is sensible. The brambles are quiet today.','Take the open trail. The hound has stopped guarding the wrong one.']]
  };
  const ROAD_DELAYED_CHOICE_DIALOGUE={
    'Accept Corvin’s repayment':['Corvin asked me to count the coins twice. He was worried the note would make you refuse them.','He is walking again, by the way. Slower, but in the right direction.'],
    'Tell Fenn to pass it forward':['I know a wounded traveler near the next bridge. I can get these coins to them.','Corvin will grumble that you made his repayment into an errand. He will understand.'],
    'Repay the stolen money':['I will take the coins to Corvin. He may still avoid you. That is his choice.','I will tell my cousins you tried to repair this, not that it never happened.'],
    'Double down':['You stole from a man who could barely stand, and this is your defense?','I will correct every merchant who calls you merely unreliable.'],
    'Take the supplies':['I salvaged the steel myself. Do not ask whose cart I bought it from.','The debt is paid. I want that written nowhere.'],
    'Ask for information instead':['The next patrol watches your sword hand. Come around the west marker.','We are even after this. If I see another danger, I may tell you anyway.'],
    'Drink the labeled medicine':['The label is accurate. I tested it on a fever before I handed it to you.','Your expression is normal. The blue taste is not permanent.'],
    'Give it to Sister Mara':['Mara will test it again. She does not trust my handwriting.','Give her the formula too. Someone besides me should know how to make it.'],
    'Pay the corrected fee':['That closes Perrin’s case. The ledger will record the correction, not erase the lie.','Next time you invent a country, at least give it a plausible tax office.'],
    'Insist the nation is real':['Then I shall open a file on its borders. This could take years.','You have won this conversation and lost the right to complain about forms.']
  };
  function roadScene(npc,{body,options=[],kicker='Road encounter',onChoice,onExit,village=false}={}){
    if(qs('#reactivityRoadScene'))return false;
    const bg=roadBackdrop(),normal=combatArmorSources(),injured=Number(state.hp)<=Number(state.maxHp||1)*.25;
    const scene=document.createElement('div');scene.id='reactivityRoadScene';scene.className='reactivity-road-scene';scene.setAttribute('role','dialog');scene.setAttribute('aria-modal','true');scene.setAttribute('aria-label',`Conversation with ${npc.name}`);
    scene.innerHTML=`<div class="road-scene-day"></div><div class="road-scene-night"></div><div class="road-scene-shade"></div><div class="road-scene-actor road-scene-player"><img src="${esc(injured?normal.damaged:normal.normal)}" alt="${esc(state.playerName||'Player')}"></div><div class="road-scene-actor road-scene-npc ${UNFLIPPED_VISITORS.has(npc.id)?'':'road-scene-flip'}"><img src="${npcAsset(npc.id)}" alt="${esc(npc.name)}"></div><div class="road-scene-panel"><div class="road-scene-heading"><span class="road-scene-speaker"></span><small>${esc(kicker)} · ${esc(npc.role)}</small></div><p class="road-scene-text" aria-live="off"></p><div class="road-scene-controls"></div></div>`;
    scene.querySelector('.road-scene-day').style.backgroundImage=`url("${bg.day}")`;
    scene.querySelector('.road-scene-night').style.backgroundImage=`url("${bg.night}")`;
    scene.querySelector('.road-scene-night').style.opacity=bg.blend;
    const playerImage=scene.querySelector('.road-scene-player img');
    playerImage.onerror=()=>{playerImage.onerror=null;playerImage.src=normal.normal};
    const nightImage=new Image();nightImage.onerror=()=>{scene.querySelector('.road-scene-night').style.opacity='0'};nightImage.src=bg.night;
    const text=scene.querySelector('.road-scene-text'),speaker=scene.querySelector('.road-scene-speaker'),controls=scene.querySelector('.road-scene-controls');
    let timer=null,full='',done=true,advance=null,closed=false;
    const stopTyping=()=>{if(timer){clearInterval(timer);timer=null}text.textContent=full;done=true};
    function close(){if(closed)return;closed=true;clearInterval(timer);scene.remove();onExit?.()}
    function focus(who){scene.classList.toggle('road-scene-player-speaking',who==='player');speaker.textContent=who==='player'?(state.playerName||'You'):who==='scene'?'On the road':npc.name}
    function say(who,line,next){stopTyping();focus(who);full=String(line||'');text.textContent='';controls.replaceChildren();done=false;advance=next||null;
      if(reduceMotion()){stopTyping();showControls();return}
      let i=0;timer=setInterval(()=>{text.textContent=full.slice(0,++i);if(i>=full.length){clearInterval(timer);timer=null;done=true;showControls()}},22);
    }
    function button(label,action){const b=document.createElement('button');b.type='button';b.textContent=label;b.onclick=action;controls.appendChild(b)}
    function showControls(){controls.replaceChildren();if(advance){button('Continue',advance);return}options.forEach((o,i)=>button(o.label,()=>choose(o,i)));if(!options.length)button('Back',close)}
    function playLines(lines,finish){
      const queue=lines.filter(item=>item&&item[1]);let i=0;
      const step=()=>{if(i<queue.length){const [who,line]=queue[i++];say(who,line,step)}else finish?.()};step();
    }
    function choose(choice,index){
      const clean=choice.label.replace(/\s*[·—]\s*\d+\s*coins?$/i,'').replace(/\s*[·—]\s*\d+\s*coins?/i,'').trim();
      const expanded=choice.playerLine||({
        'Cooperate':'All right. Ask what you need. Please keep the form shorter than the road.',
        'Listen':'Finish the story. I will interrupt if the goose becomes mayor.',
        'Keep moving':'I have to keep going. Watch the road behind me.',
        'Move on':'I cannot stay. I hope this turns out better than it looks.',
        'Lie with confidence':'I can explain. Give me a moment to choose the version.',
        'Pay the road levy':'Fine. Five coins. I want a receipt I can use against the next collector.',
        'Help gather supplies':'Point me at the bottles that will not explode. I can carry those.',
        'Ask for a remedy':'Have you got something for this? A medicine, preferably.',
        'Leave the bubbling things alone':'I trust you, but I am standing farther from that pot.',
        'Make a fair trade':'Four coins for the leather. Let us both write that number down.',
        'Haggle shamelessly':'Three coins less, and I promise to stop explaining why.',
        'Trade rumors instead':'Keep your goods. I have a story about the road if you have one worth hearing.',
        'Challenge the authority of this conversation':'Show me the rule you are enforcing. I have time for one page.',
        'Compare notes':'My route disagrees with your map. Let us find out which of us should apologize.',
        'Ask where the valuables are':'Before we discuss history, does any of it have a resale value?',
        'Take the safer route':'I would like the route that ends with the same number of limbs.',
        'Applaud sincerely':'That was good. Even the part where the history became questionable.',
        'Request a meaner song':'Can you make the next verse less polite? The nobles are still smiling.',
        'Walk away during the dramatic pause':'That looks like your dramatic pause. I am going to use it as an exit.',
        'Let them keep their dignity':'Put down the knife. You can leave with your pride if you stop now.',
        'Demand a road toll from the bandit':'Funny. I charge a toll to anyone charging a toll on this road.',
        'Threaten them into retirement':'Try another profession. I can make the recommendation more urgent.',
        'Add your own version':'I was there for part of this. The rest may improve when I tell it.',
        'Pretend you are late':'I am suddenly late for a meeting nobody here can verify.',
        'Share the road':'We are heading the same way. I can walk beside you for a while.',
        'Trade travel stories':'I have a story from the last region. How large was your fish?',
        'Help':'Show me the problem. I will help if I can.',
        'Ask for payment':'I can help, but I need enough coin to get home afterward.',
        'Buy him medicine':'I can pay for medicine. You still have to let someone treat that leg.',
        'Take the unattended purse':'I see the purse. I also see that you cannot get up.',
        'Leave him to recover':'I cannot stay. There is a stick by the marker you can reach.',
        'Gather the screaming mushrooms':'I will pick them. Tell me whether silence afterward is a good sign.',
        'Taste the unfinished potion':'One sip. If I start hearing colors, you write it down.',
        'Respect basic survival instinct':'I am choosing the option where neither of us drinks that yet.',
        'Claim diplomatic immunity':'You will have to accept that I represent a very small country.',
        'Ask for the legal definition of “road”':'Before I pay, point me to the page defining a road.',
        'Commission a heroic song':'Three coins for a song. Leave out the part where I got lost.',
        'Demand a free song':'Play one for free. You may choose how unflattering it is.',
        'Teach him the goose incident':'You want a story? The goose still has witnesses.',
        'Clear the cursed brambles':'I will clear the brambles. Show me which plants need to stay.',
        'Sell her your directions':'I know the path. I could tell you, for two coins.',
        'Warn her about Gloomfang':'Gloomfang is near the grove. Please tell the gatherers before they go in.'
      }[clean]||`${clean.charAt(0).toUpperCase()+clean.slice(1)}. Tell me what that would mean for us.`);
      const story=ROAD_CONVERSATIONS[npc.id];
      say('player',expanded,()=>{
        const result=onChoice?.(choice,index)||{};
        const repeat=!!ROAD_REPEAT_CHOICE_DIALOGUE[npc.id]&&['Help gather supplies','Ask for a remedy','Leave the bubbling things alone','Cooperate','Lie with confidence','Challenge the authority of this conversation','Applaud sincerely','Request a meaner song','Walk away during the dramatic pause','Help','Ask for payment','Move on'].includes(clean);
        const branch=village?(index===0?story?.road:index===1?story?.self:story?.part):(ROAD_DELAYED_CHOICE_DIALOGUE[clean]|| (repeat?ROAD_REPEAT_CHOICE_DIALOGUE[npc.id]?.[index]:ROAD_CHOICE_DIALOGUE[npc.id]?.[index]));
        const bridge=village?(index===0?'That sounds like a rough road. Anything else I should know?':index===1?'And what happened after that?':'I will remember that.'):repeat?'Then let us finish this without repeating the first disaster.':ROAD_PLAYER_REPLIES[npc.id]?.[index]||'I hear you. What happens next?';
        const after=village?[['npc',result.line||choice.outcome||npc.quirk]]:[];
        if(branch?.length){after.push(['npc',branch[0]],['player',bridge]);if(branch[1])after.push(['npc',branch[1]])}
        // Choice effects are applied once. The reward summary remains separate from spoken dialogue.
        if(!village&&result.line)after.push(['scene',result.line]);
        if(result.after)after.push(['scene',result.after]);
        playLines(after,()=>{controls.replaceChildren();button(village?'Back to village':'Continue',close)});
      });
    }
    scene.querySelector('.road-scene-panel').addEventListener('click',e=>{if(e.target.closest('button')||done)return;stopTyping();showControls()});
    scene.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();e.stopPropagation();if(!done){stopTyping();showControls()}}});
    (qs('.game')||document.body).appendChild(scene);
    requestAnimationFrame(()=>scene.classList.add('open'));
    const story=ROAD_CONVERSATIONS[npc.id];
    const opening=village?[]:[['scene',body]];
    playLines([...opening,...(story?.lead||[['npc',body]])],()=>{advance=null;showControls()});return true;
  }
  function encounterCard(npc,body,options,{kicker='Road encounter'}={}){
    return roadScene(npc,{body,options,kicker,onChoice(choice){
      discovered(npc.id);relation(npc.id,choice.rel||0);addRep(choice.rep||{});
      if(choice.flag)markFlag(choice.flag);if(choice.also)markFlag(choice.also);
      const changes=applyRewards(choice.rewards||{});const after=rewardNarration(npc,choice,changes);save();
      return {line:choice.outcome,after};
    },onExit:()=>setTimeout(()=>openLevelSelect(state.hub),230)});
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
    if(hub===4&&combat.boss&&Number(combat.reactivityPhase||1)>=3&&cycle%3===0){combat.intentType='charge';return 'Fortress pressure turns the final phase into a direct assault.'}
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
    'Sir Barnaby':['“The opening phase is meant to favor me!”','“That scratch is coming out of the bridge maintenance budget.”','“Fine. The final phase has no approved script.”'],
    'Gloomfang':['Gloomfang stops watching the traps and starts watching you.','The wolf changes its route. Even the old snares no longer matter.','The curse burns through the bramble. The forest falls silent.'],
    'Lich King Timmy':['Timmy raises the crown. One skeleton offers a delayed clap.','“Royal Reanimation!” Timmy checks whether the court heard him.','The crown slips. Timmy keeps fighting and stops asking for applause.'],
    'Minotaur with Anxiety':['The Minotaur checks his notes, then checks that you noticed.','“New plan. The old plan was mostly breathing.”','He drops the notes. The axe is suddenly steadier.'],
    'Monarch Lucien':['Lucien looks toward the throne, then steps away from it.','The ledgers scatter as he fights without waiting for a guard.','The last royal order is a blade raised by its author.'],
    'Lord Macewarden':['Macewarden braces the mace across the whole road.','The formal challenge has ended. The toll remains his argument.','The mace falls where a royal seal would have gone.'],
    'Mosscrown Treant':['Old roots shift under the crown-marked bark.','The guardian tears itself free of a warding circle.','The grove shakes as the Treant spends its last strength.'],
    'Ossuary King':['The bone crown tilts toward the disturbed graves.','Ancient armor closes around the remains.','The king calls for subjects. The cemetery answers only with stone.'],
    'Rosemaze Sovereign':['The Sovereign closes a thorn arch behind you.','The hedges tighten around the supposed fair trial.','Roses fall as the court runs out of ways to delay judgment.'],
    'Thronewraith King':['The crown lights a grave beneath the capital.','The wraith drops the courtly ritual and reaches for the living.','Blue fire fills the room. Nobody offers it a coronation.']
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
      if(combat.enemy==='Minotaur with Anxiety'&&combat._reactivityIntentCycle%3===0)combat.intentType='dodge';
      if(combat.enemy==='Monarch Lucien'&&combat._reactivityIntentCycle%3===0)combat.intentType='status';
    }
    if(phase===3){
      qs('#enemyArt')?.classList.add('reactivity-phase-three');
      if(['Sir Barnaby','Gloomfang','Minotaur with Anxiety','Monarch Lucien'].includes(combat.enemy)&&combat._reactivityIntentCycle%3===0)combat.intentType='charge';
      if(combat.enemy==='Lich King Timmy'&&combat._reactivityIntentCycle%3===0)combat.intentType='status';
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
    const cycle=combat._reactivityIntentCycle;
    const pools={
      Aggressive:ratio<.48?['charge','heavy','status']:['heavy','fast','charge'],
      Defensive:burning?['heavy','fast','status']:['dodge','heavy','status'],
      Cowardly:ratio<.55?['dodge','fast','status']:['fast','dodge','status'],
      Berserk:ratio<.62?['charge','heavy','fast']:['heavy','charge','fast'],
      Trickster:['dodge','fast','status'],
      Protector:ratio<.4?['heavy','status','charge']:['heavy','status','dodge']
    };
    const pool=pools[kind]||['heavy','fast','status'];
    combat.intentType=pool[(cycle-1)%pool.length];
    combat.enemyDodgeBonus=0;
    applyEnvironmentIntentEffect();
    if(combat.boss)applyBossPhaseBehavior(Number(combat.reactivityPhase||phaseFromHp()));
    // Phase and area effects can override the personality. Keep the final
    // telegraph from repeating when another appropriate move is available.
    if(combat.intentType===combat._reactivityPreviousIntent){
      combat.intentType=pool.find(move=>move!==combat._reactivityPreviousIntent)||combat.intentType;
    }
    if(combat.intentType==='dodge'&&!burning)combat.enemyDodgeBonus=Math.max(combat.enemyDodgeBonus,kind==='Cowardly'&&ratio<.55?.19:combat.boss?.17:.16);
    if(kind==='Protector')combat.enemyDodgeBonus=Math.max(combat.enemyDodgeBonus,.05);
    const lines=ENEMY_WARNING_LINES[combat.enemy]||['The enemy shifts its weight.','The enemy moves through the edge of your vision.','The enemy studies your stance in silence.','The enemy settles into a guarded posture.','The enemy prepares something difficult to identify.'];
    const intentIndex=WARNING_TYPES.indexOf(combat.intentType);
    combat.intentText=lines[intentIndex]||lines[0];
    combat.lastIntentType=combat.intentType;
    combat._reactivityPreviousIntent=combat.intentType;
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
    // Phase-one popup removed; the boss entry conversation owns the opening beat.
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
  function visitorSpoken(npc){
    const rel=relation(npc.id),temperament=dominantTemperament();
    const greeting=rel>=3?'I am glad to see you again. A familiar face makes the road feel shorter.':rel<=-2?'I remember our last conversation. I hope this one goes a little better.':'I have been stopping here between journeys. It is nice to talk without having to watch my footing.';
    const rumor={generous:'People say you help strangers when nobody is watching.',greedy:'People say I should count the spoons after you leave.',merciful:'I heard some of your enemies lived long enough to complain about you.',violent:'I heard your version of negotiation has impact frames.',bold:'You really do walk directly into every terrible idea, huh?',cautious:'You have an impressive instinct for leaving before the screaming starts.',unreadable:'Nobody agrees what your deal is. I respect the consistency.'};
    return `${greeting} ${rumor[temperament]||rumor.unreadable}`;
  }
  function showVisitor(npc){
    const options=[
      {label:'Ask about the road',playerLine:'What have you seen out on the road?',outcome:npc.quirk},
      {label:'Ask about them',playerLine:`So, ${npc.name}, how have you been?`,outcome:visitorSpoken(npc)},
      {label:'Say farewell',playerLine:'Safe travels. I should get going.',outcome:`${npc.name} nods and returns to the road.`}
    ];
    return roadScene(npc,{body:visitorDialogue(npc),options,kicker:'Recurring visitor',village:true,onChoice:choice=>({line:choice.outcome}),onExit:null});
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
