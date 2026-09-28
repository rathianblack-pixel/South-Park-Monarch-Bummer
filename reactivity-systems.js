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
 "corvin-wounded-traveler": {
  "lead": [
   [
    "npc",
    "Before you ask, the bandage is mine, the blood is mine, and the branch I fell off belongs to nobody."
   ],
   [
    "player",
    "That is a suspiciously rehearsed explanation."
   ],
   [
    "npc",
    "It became rehearsed after the third person asked whether I was dying. I am only dramatically inconvenienced."
   ],
   [
    "player",
    "Do you actually have somewhere safe to go?"
   ],
   [
    "npc",
    "I know where the village is. My legs are still negotiating the distance."
   ],
   [
    "player",
    "If I help you up, are you going to fall again?"
   ],
   [
    "npc",
    "Not immediately. I have a schedule and it says falling is tomorrow."
   ]
  ],
  "road": [
   "The bridge is passable if you stay off the loose plank. I learned this with my entire spine.",
   "If you see someone limping behind you, please do not assume it is a monster. It might be me again."
  ],
  "self": [
   "I used to carry goods between villages. Now I seem to be carrying a cautionary tale.",
   "I will get back to work once the road stops moving whenever I stand up."
  ],
  "part": [
   "You do not have to stay until I can walk. A little help was already more than I expected.",
   "Next time we meet, I intend to be upright. Please pretend not to remember this position."
  ]
 },
 "merrick-shady-merchant": {
  "lead": [
   [
    "npc",
    "Welcome to a shop with no walls, no receipts, and surprisingly few complaints that reached a magistrate."
   ],
   [
    "player",
    "That last part does not reassure me."
   ],
   [
    "npc",
    "Then let me reassure you with inventory. A clasp, a compass, and a bottle that may once have been a compass."
   ],
   [
    "player",
    "Where did you get all of this?"
   ],
   [
    "npc",
    "From people who asked fewer questions. You would like them; they were excellent customers."
   ],
   [
    "player",
    "Is any of that actually yours?"
   ],
   [
    "npc",
    "Legally? That is a much longer question than you think."
   ]
  ],
  "road": [
   "The eastern road is watched. The western road is watched by people who think they are being clever.",
   "I sell directions, but I give that warning away because a dead customer never comes back."
  ],
  "self": [
   "Business has been good enough to worry me. Honest roads are bad for merchants with my particular talents.",
   "I am considering a permanent stall, provided nobody asks me to explain the word permanent."
  ],
  "part": [
   "Keep your purse where I can see it. I mean, where you can see it. An understandable slip.",
   "If anyone asks, we had a perfectly ordinary conversation about weather and lawful trade."
  ]
 },
 "mabel-village-gossip": {
  "lead": [
   [
    "npc",
    "There you are. I have heard three stories about you, and I only believe two and a half."
   ],
   [
    "player",
    "How can you believe half a story?"
   ],
   [
    "npc",
    "The first half was witnessed. The second involved a goose becoming mayor, so I am investigating."
   ],
   [
    "player",
    "Please tell me you are not spreading that."
   ],
   [
    "npc",
    "I am gathering testimony. Spreading comes after lunch."
   ],
   [
    "player",
    "Who told you about the goose?"
   ],
   [
    "npc",
    "The goose. It talks with its beak and very aggressive pointing."
   ]
  ],
  "road": [
   "A courier passed through with an empty bag and a full expression of panic. That means news.",
   "I will know what happened by supper, assuming nobody tells the truth and ruins the mystery."
  ],
  "self": [
   "I listen because people need someone to remember them. The funny parts are a professional bonus.",
   "Half the village calls me nosy. The other half finds me the moment something goes missing."
  ],
  "part": [
   "I will tell the kinder version of this meeting if you give me one worth telling.",
   "Do not make a face. I would have recognized you from across the bridge anyway."
  ]
 },
 "brom-ex-guard": {
  "lead": [
   [
    "npc",
    "Your boots announce you before your face does. Old guard habit: I hear every step."
   ],
   [
    "player",
    "Is that why you are staring at the road?"
   ],
   [
    "npc",
    "I used to defend it. Now I watch who claims to own it. Those are different jobs."
   ],
   [
    "player",
    "And what do you see?"
   ],
   [
    "npc",
    "People carrying orders they have not thought about, and travelers paying for those orders."
   ],
   [
    "player",
    "Why did you quit?"
   ],
   [
    "npc",
    "I was told to stop protecting travelers and start counting what they owned."
   ]
  ],
  "road": [
   "The old watchtower has a blind approach behind the broken marker. Useful if patrols return.",
   "Do not mistake an empty road for a safe one. Someone chose where the guards would stand."
  ],
  "self": [
   "I left my post when I could no longer tell protection from intimidation.",
   "The armor still fits. The orders never did."
  ],
  "part": [
   "Keep your guard up, but leave room to listen. Most fights start before anyone draws steel.",
   "If you see a patrol abusing the road, remember their faces. I will."
  ]
 },
 "lyra-forest-herbalist": {
  "lead": [
   [
    "npc",
    "Careful where you put your boot. That little green thing is medicine, not lawn."
   ],
   [
    "player",
    "They look exactly alike."
   ],
   [
    "npc",
    "One eases fever. The other gives you a rash shaped like regret. I understand the confusion."
   ],
   [
    "player",
    "Are you gathering all of this alone?"
   ],
   [
    "npc",
    "The plants are better company, but their hands are absolutely useless."
   ],
   [
    "player",
    "Can I touch this one?"
   ],
   [
    "npc",
    "You can. You will itch for three days, but I cannot physically stop you."
   ]
  ],
  "road": [
   "The briars grew across the northern trail overnight. Something in the woods is pushing them.",
   "If a flower glows blue after sundown, admire it from a respectful distance."
  ],
  "self": [
   "I learned plants from my grandmother. She believed every weed was an answer to a question.",
   "I still have not found the question for the screaming mushrooms."
  ],
  "part": [
   "Take a leaf for your kit, not an entire root. The forest needs to recover too.",
   "And wash your hands before eating. That advice has saved more heroes than swords have."
  ]
 },
 "pipwick-bard": {
  "lead": [
   [
    "npc",
    "Excellent, the hero arrives just as I reach the verse where the bridge catches fire."
   ],
   [
    "player",
    "The bridge never caught fire."
   ],
   [
    "npc",
    "Then my draft contains a minor historical improvement. Would you prefer lightning?"
   ],
   [
    "player",
    "I would prefer accuracy."
   ],
   [
    "npc",
    "A daring artistic choice. It will make the chorus difficult."
   ],
   [
    "player",
    "What rhymes with bridge?"
   ],
   [
    "npc",
    "At the moment? Litigation. I am working on a second draft."
   ]
  ],
  "road": [
   "A crowded road means fresh stories. A quiet road means the stories are waiting in the bushes.",
   "I have played both kinds, and the bushes have never tipped."
  ],
  "self": [
   "I came here to write a great ballad. Somehow I became the person who carries everybody’s bad news.",
   "I sing the silly version first. People listen longer when they know a laugh is coming."
  ],
  "part": [
   "If you survive the next chapter, I promise to rhyme your name with something flattering.",
   "No guarantees about the meter. Your adventures keep changing it."
  ]
 },
 "oddo-gravekeeper": {
  "lead": [
   [
    "npc",
    "Step around that stone. It marks a grave, not a shortcut."
   ],
   [
    "player",
    "It looks like every other stone here."
   ],
   [
    "npc",
    "To you. I know who is beneath each one, and most of them were less troublesome alive."
   ],
   [
    "player",
    "Most?"
   ],
   [
    "npc",
    "There is always one family that insists on complicated arrangements. Death did not simplify them."
   ],
   [
    "player",
    "How do you know which one is troublesome?"
   ],
   [
    "npc",
    "The quiet graves stay quiet. The troublesome ones knock before sunrise."
   ]
  ],
  "road": [
   "People hurry through the cemetery road after sunset. I prefer it when they at least read the names.",
   "The dead are quiet until someone decides to borrow something they buried."
  ],
  "self": [
   "I keep this place because memory needs maintenance. Stones fall, names fade, people move away.",
   "It is not glamorous. That is how I know the work matters."
  ],
  "part": [
   "If the gate is open, close it behind you. The wind has enough bad habits already.",
   "And if you hear a voice from below, tell me before you answer it."
  ]
 },
 "cassian-relic-hunter": {
  "lead": [
   [
    "npc",
    "Do not step on that map. It contains six days of work and one very expensive mistake."
   ],
   [
    "player",
    "Why is there a skull drawn beside the road?"
   ],
   [
    "npc",
    "That is the expensive mistake. The skull is a surprisingly accurate portrait of my reaction."
   ],
   [
    "player",
    "Are you still going back?"
   ],
   [
    "npc",
    "Of course. I have since acquired a longer stick and modest self-awareness."
   ],
   [
    "player",
    "What is that circle marked cursed?"
   ],
   [
    "npc",
    "A guess. The last man who disagreed is now a circle marked missing."
   ]
  ],
  "road": [
   "The ruins west of here were built over older ruins. Someone in history was very committed to poor foundations.",
   "Watch the stones with fresh chalk marks. Those are mine, and they mean I survived the first visit."
  ],
  "self": [
   "I collect relics because objects remember things people prefer to forget.",
   "The money helps pay for ropes. The truth is why I keep buying more."
  ],
  "part": [
   "If you find a sealed door, record the symbol before you open it.",
   "I am asking as a scholar and as someone who has opened the wrong door before."
  ]
 },
 "greta-angry-cousin": {
  "lead": [
   [
    "npc",
    "I know that face. Either we have met or one of my cousins has complained about you."
   ],
   [
    "player",
    "How many cousins do you have?"
   ],
   [
    "npc",
    "Enough to make that question a strategic error."
   ],
   [
    "player",
    "What did they say?"
   ],
   [
    "npc",
    "That depends. Are you here to improve the story or give me a better one?"
   ],
   [
    "player",
    "Why are you glaring at that cart?"
   ],
   [
    "npc",
    "Because it keeps bringing me customers who insist I look like someone else."
   ]
  ],
  "road": [
   "Someone is charging travelers to cross a public bridge. I intend to learn their name.",
   "The road belongs to people who use it, no matter how fancy the toll sign looks."
  ],
  "self": [
   "Being angry is easy. Keeping track of whom the anger ought to protect is the hard part.",
   "I check on my family because somebody has to, and they keep pretending they are fine."
  ],
  "part": [
   "If you help someone out there, tell them who sent you. If you hurt them, do not.",
   "That was a joke. Mostly."
  ]
 },
 "sister-mara-apothecary": {
  "lead": [
   [
    "npc",
    "Hold still. You smell like smoke, old leather, and a very bad healing decision."
   ],
   [
    "player",
    "You can diagnose me by smell?"
   ],
   [
    "npc",
    "No. I can judge your choices by smell. Diagnosis takes a clean cloth and patience."
   ],
   [
    "player",
    "Are all those bottles medicine?"
   ],
   [
    "npc",
    "They are labeled. Do not drink anything whose label is facing inward."
   ],
   [
    "player",
    "Is that medicine or soup?"
   ],
   [
    "npc",
    "Medicine. Soup has to taste better than this to be called soup."
   ]
  ],
  "road": [
   "Travelers are arriving with the same cuts from different directions. Something has changed on the road.",
   "If you meet someone injured, give them water and bring them here. Do not improvise surgery."
  ],
  "self": [
   "I took the habit of carrying supplies from a convent that never had enough.",
   "People call me stern. The people still breathing usually call me by name."
  ],
  "part": [
   "Rest before you collapse. I charge more when I have to drag you inside.",
   "And do not confuse the blue bottle with the violet one. They have very different opinions of your stomach."
  ]
 },
 "tobin-runaway-squire": {
  "lead": [
   [
    "npc",
    "If anyone asks, you have not seen a squire with an oversized helmet."
   ],
   [
    "player",
    "I am looking directly at one."
   ],
   [
    "npc",
    "Then you are an unreliable witness. I have been practicing that argument all morning."
   ],
   [
    "player",
    "Who are you hiding from?"
   ],
   [
    "npc",
    "A knight who calls every errand a test of valor. I failed the one involving laundry."
   ],
   [
    "player",
    "Does your knight know you left?"
   ],
   [
    "npc",
    "He knows his spare helmet left. I was under it."
   ]
  ],
  "road": [
   "There is a patrol ahead, but they stop for tea longer than they patrol.",
   "I know because I carried the tea. It was apparently a test of vigilance."
  ],
  "self": [
   "I wanted to become a knight because the stories end with people being helped.",
   "Nobody mentioned the years of polishing things that do not need polishing."
  ],
  "part": [
   "If I go back, it will be because I chose to, not because someone found my helmet.",
   "Could you avoid mentioning how frightened I sounded? I am building a reputation."
  ]
 },
 "bernard-town-crier": {
  "lead": [
   [
    "npc",
    "Hear ye! Important news approaches, currently wearing your boots!"
   ],
   [
    "player",
    "Must every conversation start at that volume?"
   ],
   [
    "npc",
    "No. Some start louder, but I am showing restraint because the windows are open."
   ],
   [
    "player",
    "What is the actual news?"
   ],
   [
    "npc",
    "That depends on whether you want the official notice or the version people believe."
   ],
   [
    "player",
    "Do you have to shout every announcement?"
   ],
   [
    "npc",
    "Only the ones nobody wants to hear. So yes, every announcement."
   ]
  ],
  "road": [
   "A supply cart missed its scheduled arrival. That is news; the excuse will be a separate announcement.",
   "Listen for bells near the crossroads. A messenger uses two rings for trouble and three for panic."
  ],
  "self": [
   "I announce things so nobody can say they were left in the dark.",
   "The difficulty is that half the town hears only what fits its favorite argument."
  ],
  "part": [
   "If you discover something important, bring me the facts before Mabel brings me the song.",
   "I will use my indoor voice. That is a legally flexible promise."
  ]
 },
 "aldrin-magistrate": {
  "lead": [
   [
    "npc",
    "Your name is in my ledger. Before you object, it is in the visitor column."
   ],
   [
    "player",
    "Why do you have a visitor column?"
   ],
   [
    "npc",
    "Because the incident column became too thick to carry."
   ],
   [
    "player",
    "Am I in that one too?"
   ],
   [
    "npc",
    "That is an excellent reason to keep this conversation civil."
   ],
   [
    "player",
    "Can you settle a dispute without a form?"
   ],
   [
    "npc",
    "Certainly. We file the form afterward."
   ]
  ],
  "road": [
   "The toll notices along the western route disagree with the signed ordinance. Someone changed one.",
   "I am collecting copies before the people responsible discover ink can be evidence."
  ],
  "self": [
   "I used to believe every problem could be solved by a form.",
   "Now I believe the correct form sometimes gives people enough time to solve the problem themselves."
  ],
  "part": [
   "Keep any stamped paper you find. Even foolish orders have signatures.",
   "Should this become a hearing, I would prefer you on the side with fewer surprises."
  ]
 },
 "bruna-innkeeper": {
  "lead": [
   [
    "npc",
    "You look like someone who would put muddy boots on a clean table."
   ],
   [
    "player",
    "I have not even asked for a room."
   ],
   [
    "npc",
    "Exactly. I am getting the rules in before the negotiation starts."
   ],
   [
    "player",
    "Do you have anything useful for the road?"
   ],
   [
    "npc",
    "Food, water, and advice. The advice is free if you listen the first time."
   ],
   [
    "player",
    "Do you have a room?"
   ],
   [
    "npc",
    "Yes. Before you ask, the noise next door is a snorer, not a haunting."
   ]
  ],
  "road": [
   "The bridge gets crowded before dusk. Leave early or enjoy a long conversation with a wagon axle.",
   "Travelers who rush past supper usually come back needing twice as much food."
  ],
  "self": [
   "An inn is a place people pass through. I still learn who they are when they think nobody is watching.",
   "It takes work to keep a door open in a kingdom that likes locking gates."
  ],
  "part": [
   "If you find yourself stuck after dark, come in before you become a rescue story.",
   "And wipe your boots. That part of the invitation is not negotiable."
  ]
 },
 "fenn-courier": {
  "lead": [
   [
    "npc",
    "Finally! Someone who might know where the old bridge is. There are three old bridges."
   ],
   [
    "player",
    "Which one is on the letter?"
   ],
   [
    "npc",
    "That would have been useful information to include. It only says, urgently, to the other side."
   ],
   [
    "player",
    "You have been running with that?"
   ],
   [
    "npc",
    "I run first, ask questions second. It keeps me employed and occasionally lost."
   ],
   [
    "player",
    "Is that letter for me?"
   ],
   [
    "npc",
    "Not unless you changed your name to Urgent and live at the blacksmith's."
   ]
  ],
  "road": [
   "Messages are moving faster than carts, which means somebody is worried enough to pay for speed.",
   "If I appear twice in one day, assume the second letter is the important one."
  ],
  "self": [
   "People trust couriers with secrets because they think we are too busy to listen.",
   "I listen. I just do not repeat the parts that would hurt anyone."
  ],
  "part": [
   "If you find the recipient before I do, tell them I am trying.",
   "Actually, tell them I am nearly there. It sounds much more professional."
  ]
 },
 "agatha-hedge-witch": {
  "lead": [
   [
    "npc",
    "Stand back from the pot. It has reached the stage where it may learn your name."
   ],
   [
    "player",
    "Is that supposed to happen?"
   ],
   [
    "npc",
    "Not today. I was aiming for a remedy, not a pen pal."
   ],
   [
    "player",
    "Then why are you still stirring it?"
   ],
   [
    "npc",
    "Because stopping now would let it think it won."
   ],
   [
    "player",
    "Are the mushrooms supposed to scream?"
   ],
   [
    "npc",
    "Only the ripe ones. I know how that sounds."
   ]
  ],
  "road": [
   "The hedge has been whispering different directions to travelers. Ignore it when it uses your voice.",
   "And do not pick the purple mushrooms. I need them, and they hold grudges."
  ],
  "self": [
   "I make remedies for people who cannot afford to be ill on the road.",
   "The rumors about curses discourage thieves, so I only correct the dangerous ones."
  ],
  "part": [
   "Take care of your hands. Heroes always remember armor and forget the fingers inside it.",
   "If the spoon starts screaming, bring it back. It means my experiment followed you."
  ]
 },
 "perrin-tax-collector": {
  "lead": [
   [
    "npc",
    "A moment. By crossing this marker, you have entered the provisional assessment stretch."
   ],
   [
    "player",
    "That sounds invented."
   ],
   [
    "npc",
    "All stretches are invented until someone draws a line and charges for crossing it."
   ],
   [
    "player",
    "Does anyone actually pay?"
   ],
   [
    "npc",
    "Enough people do that my supervisor calls the system a success. I have other words."
   ],
   [
    "player",
    "Do you tax people who only walk past?"
   ],
   [
    "npc",
    "That question is why the road has a sign now."
   ]
  ],
  "road": [
   "The east checkpoint charges twice for carts and once for people. The arithmetic is intentional.",
   "Keep your receipts. A second collector cannot legally charge you again, however creatively they may try."
  ],
  "self": [
   "I thought this job would involve orderly ledgers. It mostly involves people asking why a bridge needs a tax.",
   "I have started asking the same question. Quietly."
  ],
  "part": [
   "If you challenge a fee, challenge the rule, not the clerk standing in the rain.",
   "Though if the clerk is me, a little sympathy will not damage the appeal."
  ]
 },
 "osric-retired-knight": {
  "lead": [
   [
    "npc",
    "Your stance is open on the left. Before you protest, you turned to protest on the left."
   ],
   [
    "player",
    "Do retired knights always critique strangers?"
   ],
   [
    "npc",
    "Only the ones who might survive if they listen."
   ],
   [
    "player",
    "That almost sounded kind."
   ],
   [
    "npc",
    "Retirement has softened me into a menace to poor footwork."
   ],
   [
    "player",
    "Were you going to correct my stance even if I said no?"
   ],
   [
    "npc",
    "I was going to correct the road after you fell on it."
   ]
  ],
  "road": [
   "The road near the fortress narrows between two walls. Never chase an enemy into it.",
   "If you must cross, watch the high ground first and your pride second."
  ],
  "self": [
   "I served long enough to see victories people could not enjoy afterward.",
   "These days I teach small corrections. A small correction can bring someone home."
  ],
  "part": [
   "Practice the step before the swing. There is no glory in striking hard and falling over.",
   "You can thank me after you prove the lesson useful."
  ]
 },
 "garrick-swamp-fisherman": {
  "lead": [
   [
    "npc",
    "You should have seen the fish I almost caught. The water rose around it like a throne."
   ],
   [
    "player",
    "How big was it really?"
   ],
   [
    "npc",
    "Big enough to take my bait and my favorite story. The story has since recovered."
   ],
   [
    "player",
    "And the fish?"
   ],
   [
    "npc",
    "If you find it, tell it I would like the hook back."
   ],
   [
    "player",
    "Did the fish take your hook or your pride?"
   ],
   [
    "npc",
    "The hook. I dropped the pride myself, trying to get it back."
   ]
  ],
  "road": [
   "The wet crossing is safer at dawn. After rain, the mud likes keeping boots.",
   "A traveler lost one yesterday. He went home wearing one shoe and a very firm opinion."
  ],
  "self": [
   "Fishing gives me a reason to sit still long enough to notice what the world is doing.",
   "The tales get taller, but the warnings underneath are usually true."
  ],
  "part": [
   "If the marsh goes quiet all at once, turn around. Even the frogs know something then.",
   "Come back with a story. I will pretend yours is the larger one."
  ]
 },
 "jangles-puppeteer": {
  "lead": [
   [
    "npc",
    "My puppets insist they recognize you. I told them that is impossible and extremely rude."
   ],
   [
    "player",
    "Do they talk when you are not holding them?"
   ],
   [
    "npc",
    "Only when they have criticism. So, fairly often."
   ],
   [
    "player",
    "That is not reassuring."
   ],
   [
    "npc",
    "Try touring with them. They demand applause and refuse to carry the stage."
   ],
   [
    "player",
    "Why is that puppet staring at me?"
   ],
   [
    "npc",
    "Because he thinks your hair is a plot point. Ignore him. I do."
   ]
  ],
  "road": [
   "Children on the road asked whether monsters have strings. I told them some kings do.",
   "The adults laughed less. That usually means a line worked."
  ],
  "self": [
   "A puppet can say what a person is afraid to say aloud.",
   "I did not expect the puppets to become bolder than I am."
  ],
  "part": [
   "If you hear a wooden voice telling you to duck, consider taking its advice.",
   "But if it asks for money, that is one of mine. Ignore it."
  ]
 },
 "elsie-tailor": {
  "lead": [
   [
    "npc",
    "Stop moving. That seam is holding together through sheer embarrassment."
   ],
   [
    "player",
    "It has survived every fight so far."
   ],
   [
    "npc",
    "Survived is the word people use when they cannot say maintained."
   ],
   [
    "player",
    "Can you fix it?"
   ],
   [
    "npc",
    "Yes, after I finish judging the person who let it get this bad."
   ],
   [
    "player",
    "How many stitches does it need?"
   ],
   [
    "npc",
    "I stopped counting after the tear developed a second tear."
   ]
  ],
  "road": [
   "A coat that sheds water saves more strength than an impressive buckle.",
   "The weather past the creek changes faster than the merchants admit."
  ],
  "self": [
   "I mend clothes because people deserve something dependable when the rest of the road is not.",
   "I remember every tear. I also remember who came back wearing the repair."
  ],
  "part": [
   "Come by before the next seam gives up. Repairs are cheaper than heroic explanations.",
   "And keep your elbows out of thorn hedges. Your sleeves are tired of meeting them."
  ]
 },
 "cedric-cartographer": {
  "lead": [
   [
    "npc",
    "Please tell me which side of the creek you came from. My map insists this road is on both."
   ],
   [
    "player",
    "Maybe you drew it twice."
   ],
   [
    "npc",
    "I did. The problem is that both drawings were correct on different days."
   ],
   [
    "player",
    "That sounds impossible."
   ],
   [
    "npc",
    "That is why I am here with a pencil instead of publishing it."
   ],
   [
    "player",
    "Could I just follow the creek?"
   ],
   [
    "npc",
    "You could. Yesterday it followed me instead."
   ]
  ],
  "road": [
   "The safest route is not always the shortest line. The old stones show where carts actually survived.",
   "If a sign points straight into a hedge, distrust the sign before you distrust the hedge."
  ],
  "self": [
   "I draw maps so a stranger can make it home without knowing my name.",
   "The world does keep changing the answers, which feels personal at this point."
  ],
  "part": [
   "Mark where you walked, not where you intended to walk. Those are rarely the same road.",
   "If you find a path my map missed, I would rather correct it than be right."
  ]
 },
 "mira-stablehand": {
  "lead": [
   [
    "npc",
    "Do you know how to untie a knot that a horse made while the horse was not here?"
   ],
   [
    "player",
    "How could a horse make it if it was not here?"
   ],
   [
    "npc",
    "That is exactly what I have been asking this rope for twenty minutes."
   ],
   [
    "player",
    "Need a hand?"
   ],
   [
    "npc",
    "Yes. I want to become a knight, but first I must defeat this length of string."
   ],
   [
    "player",
    "Is the rope winning?"
   ],
   [
    "npc",
    "It has me cornered, but I know its tricks now."
   ]
  ],
  "road": [
   "The stable trail avoids the worst stones. It is longer but easier on tired legs.",
   "If a cart driver offers a ride, ask whether their horse agreed to the schedule."
  ],
  "self": [
   "I train whenever the stables are quiet. It is not often, but I have learned to work quickly.",
   "One day I will have my own horse. I should probably meet it before choosing a name."
  ],
  "part": [
   "If you see a stray horse, approach slowly. If you see a stray squire, the same advice works.",
   "Thank you for helping. I will call this a tactical victory over rope."
  ]
 },
 "rook-highway-bandit": {
  "lead": [
   [
    "npc",
    "Hold there. This stretch of road has recently become a toll route."
   ],
   [
    "player",
    "You drew that sign on the back of a menu."
   ],
   [
    "npc",
    "A resourceful business keeps its costs low. Also, the menu was abandoned."
   ],
   [
    "player",
    "How much is this imaginary toll?"
   ],
   [
    "npc",
    "I was hoping you would suggest a number before I embarrassed myself."
   ],
   [
    "player",
    "Are you robbing me or applying for a job?"
   ],
   [
    "npc",
    "I'm deciding which sounds less humiliating when you tell the guards."
   ]
  ],
  "road": [
   "There is another bandit crew north of here. They lack my professional restraint.",
   "If you see two lanterns on one pole, take the longer path and keep your money."
  ],
  "self": [
   "I started with robbery because nobody was hiring. I stayed because admitting a mistake is hard.",
   "I am exploring alternative careers with fewer knives and better hours."
  ],
  "part": [
   "You did not hear any of that. My reputation could be ruined by personal growth.",
   "If we meet again, I will try opening with a greeting instead of a demand. No promises."
  ]
 }
};
  

  const UNFLIPPED_VISITORS=new Set(['brom-ex-guard','rook-highway-bandit','perrin-tax-collector','merrick-shady-merchant']);
  const ROAD_BACKDROPS=['placenta','mild','grave','question','monarch'];
  function roadBackdrop(){
    const index=Math.max(0,Math.min(4,Number(state.hub)||0));
    const day=(state.ng?window.getNgPlusVisuals?.()?.combat?.[index]:null)||`Textures/Maps/Areas/${ROAD_BACKDROPS[index]}.jpg`;
    return {day,night:day.replace(/(\.[^.]+)$/,'-night$1'),blend:Math.max(0,Math.min(1,Number(window.gameClock?.getState?.()?.nightBlend)||0))};
  }
  // Three authored reactions per visitor. The selected choice determines the exchange.
  // Player choices and their responses are specific to each visitor and option.
  const VISITOR_ROAD_LINES={"corvin-wounded-traveler":[["That arm needs medicine. I'm buying it.","You don't have to spend eight coins on a stranger.","You're wrapping a receipt around a wound.","It was clean until I started bleeding on it. Fine. Help me stand."],["Your purse is right there. I'm taking it.","I can see you. My leg is hurt, not my eyes.","Then you know I could use the money.","Yes. I'll remember your face when walking becomes an option."],["You can make it to town without me, right?","I can make it to that marker. Town is an optimistic second draft.","I'll leave the stick within reach.","How generous. Don't trip over your own conscience on the way out."]],"merrick-shady-merchant":[["Four coins for leather. A fair trade.","Fair? That takes all the theater out of this.","You can still make a speech while you hand it over.","This leather came from a perfectly identifiable animal. I just can't identify it here."],["Your prices are ridiculous. Let's haggle.","Good. I was afraid you'd found the real price tag.","There is a real one?","Not anymore. You talked it down. Take the coins and stop counting my pockets."],["I'll trade you a rumor instead of coins.","Does your rumor have witnesses?","Does yours?","Excellent. We both know the rules. Tell me yours first and I'll lie second."]],"mabel-village-gossip":[["I'll listen. Start with what actually happened.","The baker lost flour. His apprentice blamed the wind. The goose was nearby.","That isn't evidence against the goose.","It was holding the sack. I'm saving that detail for dramatic effect."],["I've got a better version of that story.","Go on. I promise not to believe all of it.","Three guards, one soup spoon, and a heroic escape.","The spoon stays. I'm not telling anybody you called it heroic."],["I'm late. I really have to go.","Then you only have time for the ending: nobody escaped the wedding.","What wedding?","Exactly. That's how the guests found out. Go on, I'll tell you later."]],"brom-ex-guard":[["I'll tell you what I saw at the checkpoint.","Which patrol? Be specific. I used to know them.","Two at the western marker. One searched a medicine cart.","I know the one. Thank you. This time I can bring a witness, not just an old uniform."],["I wasn't near the patrol. That's the truth.","Your boots still have their red road dust on them.","Could have come from somewhere else.","It could. You chose a very confident lie instead of that answer."],["What authority do you have to question me?","None. I left my badge with the man who issued bad orders.","Then why are we arguing?","Because somebody still has to ask where the guards take people. You can walk away."]],"lyra-forest-herbalist":[["I'll clear those cursed brambles for you.","Pull from the roots. The blue flowers beside them are medicine.","They look exactly the same.","One cures fever. The other will make you itch long enough to remember the difference."],["I know the route. Two coins for directions.","The trail is right behind you.","Good directions are still directions.","Take the coins. I want this conversation finished before the nettles reach us."],["Gloomfang is close. I came to warn you.","The birds stopped singing an hour ago.","Then you already knew?","I knew something large was coming. Now I know its name. Go warn the gatherers."]],"pipwick-bard":[["Three coins. Write me a heroic song.","How heroic? Facts are expensive in this profession.","Enough that I recognize myself.","Fine. You're two inches taller in the chorus. That's a compromise."],["Sing it for free. I'll advertise you.","You want me to work for exposure?","You'll get an audience.","Yes. They'll hear The Hero Who Wouldn't Pay Three Coins. Catchy title."],["I have a story about a goose.","I have seven. Does yours involve a collection plate?","And a confession booth.","Stop. Let me tune the lute. The chorus just wrote itself."]],"oddo-gravekeeper":[["Tell me about the name on that crooked stone.","His family still brings flowers. They get the date wrong, but they come.","You could tell them.","I did. They brought me the old letter proving I was wrong. I straightened the marker instead."],["I heard he was a royal assassin.","He was a baker. Please stop improving his obituary.","It makes a better story.","His daughter likes the true one. That's the audience I answer to."],["I'm late. I have to leave.","The gate is on your left.","You think I'm lying?","I think the cemetery is making you nervous. Close it behind you and we'll both be happier."]],"cassian-relic-hunter":[["Let's compare our maps before someone falls through a floor.","I marked a chamber here. You've drawn a hole.","I stood on the edge of it.","Then your map wins. I dislike that mine required field testing with your legs."],["Forget the map. Where are the valuables?","Behind the skull symbol.","That seems straightforward.","The skull refers to the floor, not the treasure. Buy a longer rope before you go."],["Show me the route that won't kill us.","Follow the grass along the outer wall.","Why is there no grass on the shortcut?","The stones eat anything that stays. I was hoping you would notice first."]],"greta-angry-cousin":[["I saw the tollkeeper who took your cousin's coins.","Which one? Don't say 'the one with a hat.'","Blue sash. Broken buckle. He stood by the southern post.","That's a name I can find. Thank you for giving me something besides a reason to yell."],["I have no idea what happened to your cousin.","Your story changed while you were telling it.","I didn't give you a story.","Exactly. That's the part I didn't believe."],["Let's question that toll sign together.","It's nailed up by people who won't show their own orders.","Then I'll pull it down.","Wait until I write down what it said. I'm angry, not careless."]],"sister-mara-apothecary":[["I can sort the supplies. Which cloth is clean?","The folded stack. Not the one you dropped on the road.","I didn't drop that one.","You did while explaining that you didn't. Wash your hands."],["Can I have something for this injury?","Medicine, yes. A miracle, no.","Could I get both if I ask nicely?","Drink water, take the dose, and stop testing your luck with unknown bottles."],["I'm leaving the bottles alone.","At last, a patient with a plan.","I was only going to smell one.","That's how the last patient ended up smelling colors. Leave it alone."]],"tobin-runaway-squire":[["I'll help you get back safely.","Back to which knight? The one I left or someone who teaches instead of shouting?","You can choose. I can just walk with you.","Nobody's offered that without an order attached. All right. Let's walk."],["What can you pay me for the help?","I have the coins he gave me to polish his helmet.","Won't he want them back?","He'll have to admit I did something besides polish. Take them."],["I can't stay. Make your own way.","I was doing that before you stopped me.","Didn't mean it like that.","I know. Tell the knight you didn't see me. He's looking for the helmet more than me."]],"bernard-town-crier":[["Tell me the facts and I'll help spread them.","Supply cart missing. Last seen near the bridge. That's everything confirmed.","No goose army?","Not confirmed. Please don't make me announce your suggestion."],["I have a better story for your next announcement.","A real story?","Twelve geese guarding a stolen cart.","I'll call it a rumor. They can complain in person if they want a correction."],["Please don't announce that I'm leaving.","I wouldn't. Unless the council calls it news.","Does the council know me?","They know everyone who has ever asked me to be quiet. Run along."]],"aldrin-magistrate":[["I'll give you my account of the patrol.","Start with what you saw, not what you heard at the tavern.","A guard stopped a cart and demanded a second toll.","Good. That's a witness statement. I'll keep your name off the public notice."],["I have an explanation for those dates.","It must be excellent. Your boots and the ledger disagree.","I was there, but not for the reason you think.","That would have been a better opening. Now I have to cross out your first answer."],["Show me the ordinance that allows this tax.","There are three versions. They contradict each other.","Then which one do we follow?","That's why I'm asking the public. The river apparently owes a toll in version two."]],"bruna-innkeeper":[["Four coins for supplies. Is that fair?","Yes. The kitchen can feed a traveler tonight.","And I get the leather?","After you wipe your boots. I have one clean floor and a stubborn reputation."],["Can you give me a better price?","I can, if you stop leaning on that chair.","Is it fragile?","No. I'm tired of negotiating with people who threaten the furniture."],["Any news from the bridge?","A wagon stopped there with no driver.","Was it abandoned?","The horses stayed. They looked offended. Nobody could tell me who had been holding the reins."]],"fenn-courier":[["I'll help find the right address.","The letter says 'the other side of the bridge.' Which bridge?","Check the blue seal against the sign.","Oh. I've been running past that one all morning. Don't tell the recipient."],["If I find the address, will you pay me?","I have two coins and a letter I can't deliver.","The coins sound easier to carry.","Take them. If you meet the recipient, at least point them toward me."],["I have to get back on my own road.","Fair. I'll be lost slightly ahead of you.","Read the seal before sprinting again.","I will. I had begun treating every fork like a personal insult."]],"agatha-hedge-witch":[["I'll gather the screaming mushrooms.","Pick the loud ones. The silent ones make your tongue swell.","That's a terrible system.","It's an excellent system if you listen. Keep your fingers away from the caps."],["I'll taste the unfinished potion.","One sip. Tell me if blue makes a noise.","That isn't how colors work.","I know. That's why I need somebody else to confirm what happened to me."],["I'm not going near the pot.","Reasonable. Bad for my notes, good for your organs.","Is it supposed to know my name?","Only if I have made a very specific mistake. Stand farther back."]],"perrin-tax-collector":[["Here's five coins. Can I have a receipt?","Of course. Hold out your hand.","Why did you stamp my skin?","The paper blew away. Your hand stayed. I'll stamp the map too."],["I claim diplomatic immunity.","From which country?","The one that doesn't pay this levy.","I'll need its name and seal. You can see why I don't believe you."],["Define 'road' under this law.","Seventeen pages. Page nine accidentally includes rivers.","Do fish pay the levy?","Please don't give the council an idea they'll consider workable."]],"osric-retired-knight":[["Tell me where the patrol is. I'll listen.","East side of the pass. High ground first.","So I don't charge straight at them?","That's a start. I taught squires for thirty years and you are already ahead of six."],["I'll tell you how that battle went.","You fell on your left side.","I hadn't reached that part.","Your armor has. Take this advice instead of polishing the lie."],["Prove your stance is better than mine.","The training post is right there.","We're doing this now?","You challenged a retired knight beside a training post. Yes, now."]],"garrick-swamp-fisherman":[["I'll walk with you to the dry bank.","Step on those stones. The mud keeps boots as souvenirs.","Did it take yours?","My brother's. He went home with one shoe and an opinion about geology."],["My last catch was bigger than yours.","Did it eat a boat? Mine almost did.","Almost is doing a lot of work there.","That's the beauty of the fish getting away. Nobody can measure it."],["I'm going on alone.","Then listen for the frogs. If they all stop, turn back.","What scares every frog?","I have a story. I'd rather you didn't become the second half of it."]],"jangles-puppeteer":[["That performance was good. I mean it.","The tall puppet heard you. He'll be insufferable all week.","You move him.","He writes his own reviews. I just keep his hands from stealing the tips."],["Can you make the next song meaner?","About the king? The children will laugh.","And the adults?","They'll recognize themselves in the puppet who keeps approving his orders."],["I'm leaving during the dramatic pause.","The little puppet says that makes you tomorrow's villain.","He can say it to my face.","He will. He's much braver when I hold him up."]],"elsie-tailor":[["I'll pay for the leather. Please fix this seam.","Put your arm down. You're stretching it again.","I need my arm for fighting.","Then let me make the sleeve survive the fight. Hold still."],["A few coins off for the torn edge?","You made the torn edge by touching that hedge.","The hedge was in my way.","The hedge has not come in here asking for a discount. You have."],["Any rumors about cloaks on the bridge?","Somebody says capes are back in fashion.","Are they?","Not on that road. Thorns don't care what the merchant called the fabric."]],"cedric-cartographer":[["Let's compare where the creek crosses the road.","Your drawing puts it beside the old stones.","I walked through it this morning.","Then the creek moved, not my compass. I'm both relieved and upset."],["Point me toward a cache worth finding.","The abandoned vault is marked there.","What's the other mark beside it?","A sinkhole. The vault isn't worth much if you arrive underneath it."],["Which route is safest?","Follow seven stone markers around the outer hedge.","What if I count eight?","Stop counting and leave. The maze is drawing its own directions again."]],"mira-stablehand":[["I'll help with those reins.","Hold the loose end. The horse isn't even here and this knot is winning.","I think it's coming apart.","There. Tell everyone I defeated it myself. No, don't. You helped."],["Can you spare anything for the help?","I have two coins saved for a saddle strap.","Keep one. You need the strap.","Take the other. At least the rope can't charge me again."],["I should get moving.","So should I. The horse comes back before dusk.","Try not to fight the rope again.","If it starts something, I'll remember what you did to the knot."]],"rook-highway-bandit":[["Keep the knife. I'll let you leave.","You were supposed to arrest me. I rehearsed a speech.","You can still say it on your way out.","It starts with 'You won't take me alive.' That feels inappropriate now."],["You're collecting tolls? Then you owe me one.","That's not how tolls work.","That's how yours work. Five coins.","Fine. I hate how much I respect the reversal."],["Put down the knife and find another job.","You make retirement sound like a threat.","It becomes one if you stay on this road.","Message received. Next time I open with hello, not a price."]]};
  const VISITOR_REVISIT_LINES={"corvin-wounded-traveler":[["Let me help you with the pack.","I can carry it. The hill is negotiating with my leg.","Then I'll take the heavy side.","Fine. If I fall, tell everyone the pack started it."],["Could you spare something for the road?","I have coins, a limp, and advice. Pick one.","The coins, please.","I knew you would. The advice was to ask before taking a purse."],["I've got to keep moving.","So do I. I'll be slightly slower about it.","Watch the loose plank.","That plank and I are no longer speaking."]],"agatha-hedge-witch":[["I'll gather herbs if you tell me which ones.","The loud mushrooms. Not the purple ones.","The loud ones sound upset.","They're ripe. Upset is a separate ingredient."],["Can you give me something to patch me up?","Yes, after you drink water. You look like you ate road dust.","What is in the vial?","Mostly what I intended. That's an excellent result for today."],["I'm leaving the experiment alone.","A medically sound choice.","You sound disappointed.","My notes do. I personally enjoy patients with intact organs."]],"perrin-tax-collector":[["All right. I'll answer your questions.","Who issued the toll receipt at the western post?","A guard with a blue sash.","Good. I can compare his stamp with the official ledger."],["I wasn't at that post.","You have its red ink on your sleeve.","Maybe I borrowed the coat.","Now I need the form for borrowed coats. Thank you for expanding my day."],["Show me the law giving you this authority.","I can. Page nine is the problem.","The part about rivers?","Yes. I'm arguing against it too. Give me a moment before you call me a crook."]],"pipwick-bard":[["That was good. I'll applaud.","Wait until the final verse. It still has a rhyme I can defend.","If I clap now, will it ruin the meter?","Only my ego. Go ahead."],["Sing something meaner about the crown.","Children will laugh. Adults will check who is listening.","Can the king recognize himself?","He'll blame a minister first. That buys me time to leave town."],["I'm walking out during the pause.","That is a review with very little ambiguity.","Will you put me in the song?","The little puppet already has. He wrote you as the exit."]],"lyra-forest-herbalist":[["I'll help gather the right plants.","Blue flowers. Keep the roots in the ground.","Why not take the whole thing?","Because I plan to have medicine here next week as well."],["Can you make something for this wound?","Yes. Sit down before you drip on the leaves.","I thought these were for medicine.","They are. I still prefer to know whose blood is on them."],["I'm leaving the glowing plants alone.","That's a good instinct.","You sound surprised.","You came into the forest wearing armor and optimism. I've learned to manage expectations."]]};
  const VISITOR_VILLAGE_LINES={"corvin-wounded-traveler":[["How's the road treating that leg?","You learned that from the loose plank, didn't you?","With my entire spine. The bridge and I have a history now."],["What did you do before the road did this to you?","You still want to carry goods after all that?","Yes. I like the people. I'd prefer less contact with the ground."],["I'll let you sit. Need anything before I go?","Can you make it to the next marker?","Yes. That's an achievable promise. Town can wait until tomorrow."]],"merrick-shady-merchant":[["Which road would you take if these were your own goods?","How much is that advice costing me?","Nothing. The people watching the western road already paid for it."],["What are you doing when you aren't selling mystery bottles?","A permanent stall sounds unlike you.","I can leave it whenever I like. That's my definition of permanent."],["I should go. Have we concluded our business?","You checked my pockets before I did.","And found nothing. Our relationship grows more trusting by the minute."]],"mabel-village-gossip":[["Tell me what's happening on the road. Facts first.","You can tell a story without knowing the ending?","Of course. That's why I call it a rumor and keep looking."],["Do you ever get tired of knowing everyone's business?","That sounded almost kind.","I am kind. I also remember who borrowed the church ladder."],["I have to leave before this becomes a whole story.","What's the kinder version?","The one where you leave before I repeat the goose part."]],"brom-ex-guard":[["Have you seen the fortress patrol today?","That blind approach is useful. Why tell me?","Because I remember what it felt like to be ordered through the front."],["Do you miss being a guard?","You still sound like one.","A good guard, I hope. That distinction took me too long to learn."],["I'll keep moving. Any last orders?","You really can't stop giving advice.","No. But I can stop pretending advice is an order."]],"lyra-forest-herbalist":[["Which trail is safe for gathering?","Glowing blue means I should turn around?","Admire it from here. The last admirer needed an antidote."],["How did you learn all these plants?","What about the screaming mushrooms?","Grandmother would have called those an answer to a question nobody should ask."],["I'll leave you to the herbs.","Just one leaf, right?","One leaf. If you take the root, next week's traveler gets nothing."]],"pipwick-bard":[["Any news from the next road?","The bushes don't tip, I assume?","Never. But they provide material and occasionally chase me."],["Is the song still about me?","The silly verse gets people listening.","Then I can sing the part that actually hurt. They might stay for it."],["I need to go before you find another rhyme.","Please use a flattering one.","Survive the next chapter and I'll have better material."]],"oddo-gravekeeper":[["Is the cemetery road safe?","That sounds like a complaint with a name.","It has a grave with a name too. I'll show you if it keeps knocking."],["Do you remember everyone buried here?","That's a lot to carry alone.","Someone ought to remember them when their families are gone."],["I'll close the gate behind me.","You've reminded me three times.","And the last traveler still left it open. Make me wrong this time."]],"cassian-relic-hunter":[["What does the new mark on your map mean?","Probably cursed isn't a measurement.","It's the most accurate one I have until someone volunteers to open it."],["What are you actually looking for?","And if the answer is dangerous?","I redraw the map. I don't need to be the treasure's final owner."],["I'm taking the safe route. Mark it for me.","You're writing in pencil?‌","When the road changes, I would rather erase a mistake than defend it."]],"greta-angry-cousin":[["Any news about your cousin's toll?","You still have the name of the guard?","Every name. I want the right person to answer, not the nearest uniform."],["How is your cousin now?","You sound angry because you care.","I'm angry because he shouldn't have needed a cousin to get his coins back."],["I'll go. Do you need help with the sign?","You'll wait before pulling it down?","Long enough to copy it. Then you can make a satisfying noise."]],"sister-mara-apothecary":[["Is there an illness spreading on the road?","Clean water first. That simple?","It is simple. That's why people keep trying complicated things instead."],["Do you ever get a patient who listens?","You've already judged me.","I checked your pulse. The judgment was a separate service."],["I'll stay away from the unlabeled bottles.","You turned one to face the wall.","Because someone called it a tonic and I could hear it hissing."]],"tobin-runaway-squire":[["Are the patrols still looking for you?","They're stopping for tea during a search?","My old knight calls that strategy. I call it an opportunity."],["What would you do without that knight?","You can learn from somebody else.","That's the first plan that doesn't include running forever."],["I'll head out. Keep the helmet hidden.","What about your own things?","He never asked for those. I think that tells us enough."]],"bernard-town-crier":[["What's actually happened today?","You don't need to shout it at me.","Sorry. After twelve years the volume has become part of the job."],["How do you decide what counts as news?","So the song about the goose is optional?","The council thinks otherwise. I asked for evidence. They sent feathers."],["I have to go. Quietly, please.","Thank you for using your indoor voice.","I have one. I just don't get paid to use it."]],"aldrin-magistrate":[["What should travelers keep after a toll?","A signed receipt, even from a guard?","Especially from a guard. The uniform doesn't correct the figures."],["Do you enjoy being a magistrate?","Those forms don't sound enjoyable.","They aren't. But a written complaint survives the person who refuses to listen."],["I should leave before you find a form for this.","There isn't one, is there?","There is. I'm choosing not to tell you. Enjoy the exception."]],"bruna-innkeeper":[["Is the bridge open tonight?","Was that driverless wagon real?","The horses arrived. I can show you what they did to my front step."],["How do you keep the inn running?","You remembered their names?","I remember who needed a meal. The ledger only remembers what they owe."],["I'll be back before supper.","Do you really check both boots?","I started after you came in with one clean foot and one small swamp."]],"fenn-courier":[["What happened to the eastern deliveries?","Did you read the address this time?","Twice. The seal says east; the writer's drawing says north. I trust the seal."],["Do you ever read what you carry?","That sounds lonely.","Sometimes. But the parts people trust me with arrive where they meant to."],["I'll let you deliver that letter.","Is it going to the other bridge?","Probably. Now that you've asked, I'll check before running."]],"agatha-hedge-witch":[["Is the hedge still giving bad directions?","It used my voice last time.","Then it's learning. Don't answer it when it sounds like someone you miss."],["How is your remedy coming along?","Did the pot learn your name?","No. It learned a rude nickname. That's progress, medically speaking."],["I should leave before the spoon screams.","The spoon is supposed to scream?","Only when the brew is ready. So yes, unfortunately, soon."]],"perrin-tax-collector":[["Is the checkpoint charging travelers twice?","You agree that's wrong?","Of course. I keep records. I dislike dishonest arithmetic."],["Do you believe all these rules?","So why keep stamping forms?","If I stop, the next man might charge three times and lose the receipts."],["I'm leaving before you stamp me again.","You won't tax the bridge itself?","I objected in writing. The bridge has not replied."]],"osric-retired-knight":[["Where would you cross the fortress road?","High ground first, pride second. I heard you.","Good. That lesson took my last squire two broken shields."],["Why teach strangers now?","That's almost gentle.","Don't spread it around. The next stranger will expect me to smile."],["I'm off to practice the step.","Before the swing.","Exactly. You may survive long enough to annoy me again."]],"garrick-swamp-fisherman":[["When does the marsh crossing flood?","How did someone lose just one boot?","The mud wanted one. He fought to keep the other."],["Did you ever catch the giant fish?","It shrinks when you describe it like that.","Only while I'm sober. The important warning about the water is still true."],["I'll listen for the frogs.","If they go silent, I turn back.","Good. You can call me a liar after you get home."]],"jangles-puppeteer":[["Did you perform on the road today?","Kings with strings is a risky joke.","The children laughed. The adults looked toward the castle. That's how I know it worked."],["Do the puppets really speak on their own?","I think that one just blinked.","It's made of wood. If it blinks again, I want you to tell me outside."],["I'm leaving before they review my outfit.","They already did, didn't they?","The little one said 'ambitious.' I think he means the cape."]],"elsie-tailor":[["How do I keep this coat dry on the road?","So the buckle is decorative?","The buckle is fine. The seam underneath it is crying for help."],["Why remember every tear you repaired?","You remember who came back, too.","Yes. That's why I don't complain as much as I pretend to."],["I'll bring the sleeve before it gets worse.","You always say that.","And you always bring the whole coat after. Surprise me once."]],"cedric-cartographer":[["Which sign points into the hedge?","How do you know the sign is wrong?","The hedge doesn't lead where the arrow says. Also, there's paint on a branch."],["Why keep making maps of a moving maze?","That sounds impossible.","So did the creek changing course. I would rather correct a map than strand someone."],["I'll mark where I actually walked.","Not where I meant to go.","Exactly. Intentions make beautiful maps and terrible directions."]],"mira-stablehand":[["Is the stable trail safe for a tired horse?","The driver should ask the horse first.","Some days she's the only one here who knows when to rest."],["How is your training going?","The rope beat you again?","Only until I learned its trick. I can handle a horse; I can handle string."],["I should go. Mind the stray squires.","You mean me.","I do. Approach us slowly. We startle when offered real help."]],"rook-highway-bandit":[["Are there other bandits north of here?","Two lanterns on one pole. Why warn me?","Because they don't stop to hear whether you can pay. I still do."],["Have you looked for honest work?","You could just say you made a mistake.","I know. That's the hard part. The knife was easier to carry."],["I'll leave without asking for a toll.","Try greeting the next traveler first.","I might. Don't tell anyone I took career advice from a customer."]]};
  const VISITOR_RELATION_LINES={"corvin-wounded-traveler":["Oh, good, it's you. I can ask for a hand without pretending the leg is fine.","I recognize you. Stay where I can see my pack."],"merrick-shady-merchant":["My favorite repeat customer. You actually checked the price before paying.","You again. I'll count the stock before I open the coat."],"mabel-village-gossip":["There you are. I saved you the version with witnesses.","I know your face. I also know what you said last time. Be careful with the next part."],"brom-ex-guard":["Good to see you. I trust you with the patrol's route.","You again. I'll answer, but I'm keeping my hand on the map."],"lyra-forest-herbalist":["You kept the roots in the ground. Good. I have more to show you.","Keep your boots off my herbs. Last time was expensive."],"pipwick-bard":["My best audience is back. I fixed the rhyme you hated.","Ah. My most vocal critic. I have a verse with your name in it now."],"oddo-gravekeeper":["You remembered to close the gate. Come in, carefully.","I've seen you before. Mind the stones this time."],"cassian-relic-hunter":["You came back with the map intact. I can trust you with the new marks.","Keep your hands off the chalk until I finish explaining it."],"greta-angry-cousin":["You helped my cousin. I still sound angry; that part isn't about you.","I remember what you told me. I wrote it down so I wouldn't soften it later."],"sister-mara-apothecary":["You took the whole dose, didn't you? Excellent. Tell me what changed.","You again. Before touching anything, wash your hands."],"tobin-runaway-squire":["You gave me room to choose. I'm trying to use it.","I remember your advice. I haven't decided whether it was advice."],"bernard-town-crier":["For you, I'll use the quiet announcement first.","You're back. Today I'm only announcing facts I can defend."],"aldrin-magistrate":["Your last statement helped. I kept a copy for you.","Your previous statement is still in the ledger. Let's be precise this time."],"bruna-innkeeper":["You're welcome inside. Your boots are on probation.","I remember the last mess. Stand on the mat while we talk."],"fenn-courier":["You found the right bridge last time. I brought a clearer address.","I remember your directions. I should have listened before running."],"agatha-hedge-witch":["You survived the last brew. I have slightly improved the recipe.","Stand on that side of the pot. I remember what happened last time."],"perrin-tax-collector":["You kept the receipt. I wish everyone did that.","I recognize you. I also recognize the missing payment line."],"osric-retired-knight":["Your stance is better. Don't look pleased; I said better.","You again. We can argue after you move your left foot."],"garrick-swamp-fisherman":["My favorite skeptic. I brought a hook to prove the fish was real.","You called my fish imaginary. I have been preparing a rebuttal."],"jangles-puppeteer":["The puppets approved of you. One of them is usually difficult.","The small puppet remembers your review. I advised him to let it go."],"elsie-tailor":["That seam held. I can tell because you came back wearing it.","You tore the repair, didn't you? Show me before you blame the hedge."],"cedric-cartographer":["You marked the actual trail. My next map will be less wrong.","You moved my marker last time. Show me where you walked before we argue."],"mira-stablehand":["The rope hasn't beaten me since you helped. Come see.","I remember your last visit. The horse does too. Approach slowly."],"rook-highway-bandit":["You kept your word. I'm trying to find work that doesn't involve a knife.","You again. Put your purse away; I won't ask for it. Probably."]};
  const VISITOR_FIRST_CHOICES={"corvin-wounded-traveler":"Buy him medicine · 8 coins","agatha-hedge-witch":"Gather the screaming mushrooms","perrin-tax-collector":"Pay the road levy · 5 coins","pipwick-bard":"Commission a heroic song · 3 coins","lyra-forest-herbalist":"Clear the cursed brambles"};

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
      const firstChoice=VISITOR_FIRST_CHOICES[npc.id];
      const repeat=firstChoice&&options[0]?.label!==firstChoice;
      const script=village?VISITOR_VILLAGE_LINES[npc.id]?.[index]:(repeat?VISITOR_REVISIT_LINES[npc.id]?.[index]:VISITOR_ROAD_LINES[npc.id]?.[index]);
      const opener=script?.[0]||choice.playerLine||choice.label;
      say('player',opener,()=>{
        const result=onChoice?.(choice,index)||{};
        const after=[];
        if(village){
          after.push(['npc',result.line||choice.outcome||npc.quirk]);
          if(script?.[1])after.push(['player',script[1]]);
          if(script?.[2])after.push(['npc',script[2]]);
        }else if(script){
          after.push(['npc',script[1]],['player',script[2]],['npc',script[3]]);
        }
        // Choice effects are applied once. The reward summary remains separate from spoken dialogue.
        if(!village&&!script&&result.line)after.push(['scene',result.line]);
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
    const rel=relation(npc.id),personal=ROAD_CONVERSATIONS[npc.id]?.self||[];
    const detail=personal[(R().npcSeen[npc.id]||0)%personal.length]||npc.quirk;
    const moods=VISITOR_RELATION_LINES[npc.id];
    const preface=rel>=3?moods?.[0]:rel<=-2?moods?.[1]:'';
    return [preface,detail].filter(Boolean).join(' ');
  }
  function showVisitor(npc){
    const writing=ROAD_CONVERSATIONS[npc.id],visit=Number(R().npcSeen[npc.id]||0);
    const options=[
      {label:'Ask about the road',playerLine:'What happened out there? Start with the part I can survive.',outcome:writing?.road?.[visit%writing.road.length]||npc.quirk},
      {label:'Ask about them',playerLine:`What have you been up to, ${npc.name}?`,outcome:visitorSpoken(npc)},
      {label:'Say farewell',playerLine:'I should go before this becomes an errand.',outcome:writing?.part?.[visit%writing.part.length]||`${npc.name} wishes you a safe road.`}
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
