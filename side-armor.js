/* Optional armor milestones; indices 0–4 remain the original area rewards. */
(()=>{
  const milestones=[
    {index:5,name:'Choirguard Vestments',place:'cathedral',goal:'Complete all 10 Cathedral quests.'},
    {index:6,name:'Forgeheart Plate',place:'blacksmith',goal:'Complete all 10 Blacksmith quests.'},
    {index:7,name:'Gilded Bargainer',place:'merchant',goal:'Complete all 10 Merchant quests.'},
    {index:8,name:'Roadkeeper’s Cloak',place:'home',goal:'Meet 5 different road visitors.'},
    {index:9,name:'Village Defender',place:'home',goal:'Win 5 village raids.'},
    {index:10,name:'Grave Lantern Keeper',place:'home',goal:'Clear Graveyard and win a Graveyard fight without a healing item.'},
    {index:11,name:'Maze Cartographer',place:'home',goal:'Clear all five Question levels and their maze questions.'},
    {index:12,name:'Thronebreaker Regalia',place:'home',goal:'Defeat the final boss and win a postgame challenge.'}
  ];
  const bonuses={
    5:'Healing items and spells restore 2 extra HP.',
    6:'Guard reduces a further 10% of incoming damage.',
    7:'Coin rewards from combat increase by 20%.',
    8:'Enemy Bleeding and signature ailments are less likely to take hold.',
    9:'Village raid attacks deal 10% less damage to you.',
    10:'Burning and Bleeding deal 1 less damage to you per turn.',
    11:'Your attacks gain 5% accuracy.',
    12:'Deal 2 extra damage to bosses, including Sword counters.'
  };
  const femaleBase=['Placenta Creek Wayfarer','Moonleaf Huntress','Graveveil Warden','Runebloom Battlemage','Monarch’s Eclipse'];
  function showReveal(index){
    if(document.querySelector('.side-armor-unlock'))return;
    const gender=state.gender==='female'?'female':'male';
    const name=index<5&&gender==='female'?femaleBase[index]:ARMOR_NAMES[index];
    const src=asset(ARMOR_SETS[gender]?.[index]);if(!src)return;
    const overlay=document.createElement('div');overlay.className='side-armor-unlock';overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-label',`${name} unlocked`);
    const glow=document.createElement('div');glow.className='side-armor-unlock-glow';
    const title=document.createElement('div');title.className='side-armor-unlock-title';
    const kicker=document.createElement('span');kicker.textContent='ARMOR UNLOCKED';
    const heading=document.createElement('h2');heading.textContent=name;title.append(kicker,heading);
    const art=document.createElement('img');art.src=src;art.alt=name;art.className='side-armor-unlock-art';
    const description=document.createElement('p');description.textContent=bonuses[index]||'A new armor set is ready to equip at the House.';
    const button=document.createElement('button');button.type='button';button.textContent='Continue';button.onclick=()=>overlay.remove();
    overlay.append(glow,title,art,description,button);
    document.querySelector('.game')?.appendChild(overlay);button.focus();
  }
  function showPending(){const index=Number(meta().pendingArmorReveal);if(!Number.isInteger(index)||index<0||index>4)return;
    delete meta().pendingArmorReveal;save();showReveal(index)}
  const meta=()=>{state.meta=state.meta||{};return state.meta};
  const obtained=m=>Array.isArray(meta().sideArmorObtained)&&meta().sideArmorObtained.includes(m.index)
    ||['male','female'].every(g=>state.unlockedArmor?.[g]?.includes(m.index));
  const questCount=type=>(meta().buildingQuestState?.[type]||[]).filter(x=>x==='complete').length;
  const progress=m=>{
    if(m.place!=='home'){const n=questCount(m.place);return {ready:n>=10,label:`${Math.min(n,10)}/10 quests`}}
    if(m.index===8){const n=(meta().sideArmorVisitors||[]).length;return {ready:n>=5,label:`${Math.min(n,5)}/5 visitors`}}
    if(m.index===9){const n=Number(meta().villageRaidWins)||0;return {ready:n>=5,label:`${Math.min(n,5)}/5 raids`}}
    if(m.index===10)return {ready:!!meta().sideArmorGraveCleanWin,label:meta().sideArmorGraveCleanWin?'Challenge cleared':`${Math.min(5,Number(state.progress?.[2])||0)}/5 Graveyard levels`};
    if(m.index===11){const n=Number(state.progress?.[3])||0;return {ready:n>=5,label:`${Math.min(n,5)}/5 Question levels`}}
    return {ready:!!state.endgame?.unlocked&&(Number(state.endgame?.challengeWins)||0)>0,label:`${Math.min(1,Number(state.endgame?.challengeWins)||0)}/1 postgame challenge`};
  };
  function claim(m){
    if(obtained(m)||!progress(m).ready)return;
    const data=meta();data.sideArmorObtained=Array.isArray(data.sideArmorObtained)?data.sideArmorObtained:[];
    data.sideArmorObtained.push(m.index);
    ensureProgress();
    for(const g of ['male','female'])if(!state.unlockedArmor[g].includes(m.index))state.unlockedArmor[g].push(m.index);
    save();render();showReveal(m.index);
  }
  function reconcile(){
    ensureProgress();let changed=false;
    for(const i of meta().sideArmorObtained||[])if(Number.isInteger(i)&&i>=5&&i<=12)for(const g of ['male','female'])if(!state.unlockedArmor[g].includes(i)){state.unlockedArmor[g].push(i);changed=true}
    if(changed)save();
  }
  function render(){
    const interior=document.querySelector('#interior.active'),panel=interior?.querySelector('#interiorContent');
    if(!panel)return;
    const place=state._building,questBoard=place!=='home'&&panel.querySelector('.fixed-quest-board');
    const houseArmor=place==='home'&&panel.querySelector('.compact-armor-grid');
    if(!questBoard&&!houseArmor){panel.querySelector('[data-side-armor-section]')?.remove();return}
    const entries=milestones.filter(m=>place==='home'||m.place===place);
    const signature=JSON.stringify(entries.map(m=>[m.index,obtained(m),progress(m)]));
    let section=panel.querySelector('[data-side-armor-section]');
    if(section?.dataset.signature!==signature){
      section?.remove();section=document.createElement('section');section.className='side-armor-section';section.dataset.sideArmorSection='';section.dataset.signature=signature;
      const title=document.createElement('h3');title.textContent=place==='home'?'Armor Milestones':'Armor Milestone';section.appendChild(title);
      for(const m of entries){const status=progress(m),owned=obtained(m),row=document.createElement('article');row.className='side-armor-row '+(owned?'obtained':status.ready?'ready':'locked');
        const copy=document.createElement('div'),name=document.createElement('strong'),goal=document.createElement('small'),bonus=document.createElement('small');name.textContent=m.name;goal.textContent=`${m.goal} · ${status.label}`;bonus.textContent=bonuses[m.index];bonus.className='side-armor-bonus';copy.append(name,goal,bonus);
        const button=document.createElement('button');button.type='button';button.textContent=owned?'OBTAINED':m.place!==place?'Claim at '+m.place:status.ready?'Claim armor':'LOCKED';button.disabled=owned||!status.ready||m.place!==place;
        if(!button.disabled)button.onclick=()=>claim(m);row.append(copy,button);section.appendChild(row)}
      (questBoard||houseArmor).after(section);
    }
    if(houseArmor)for(const m of milestones){if(!obtained(m)||houseArmor.querySelector(`[data-fixed-equip="${m.index}"],[data-compact-equip="${m.index}"]`))continue;
      const b=document.createElement('button');b.type='button';b.dataset.fixedEquip=String(m.index);b.innerHTML=`<b>${m.name}</b><small>${Number(state.armorSets?.[state.gender])===m.index?'EQUIPPED':'Wear set'}</small>`;if(Number(state.armorSets?.[state.gender])===m.index)b.classList.add('equipped');houseArmor.appendChild(b)}
  }
  document.addEventListener('click',event=>{
    const visitor=event.target.closest?.('#reactivityVisitorDock [data-visitor]');if(!visitor)return;
    const id=visitor.dataset.visitor,data=meta();data.sideArmorVisitors=Array.isArray(data.sideArmorVisitors)?data.sideArmorVisitors:[];
    if(id&&!data.sideArmorVisitors.includes(id)){data.sideArmorVisitors.push(id);save()}
  },true);
  window.sideArmor={recordVictory(){if(window.villageRaid?.active||state.hub!==2||!combat||combat.healingItemUsed)return;
    if(Number(state.progress?.[2])>=5||Number(combat.level)===5){meta().sideArmorGraveCleanWin=true;save()}},render,showPending,showReveal};
  reconcile();setInterval(()=>{reconcile();render()},400);
})();
