/* Village raids are independent encounters; they never advance area progression. */
(()=>{
  const root='Textures/Maps/VillageRaids/';
  const scenes=['central-crossroad','outer-village-bridge','right-road'];
  const assets=scenes.flatMap(name=>[`${root}${name}.png`,`${root}${name}-night.png`]);
  assets.forEach(src=>window.ensureSceneImage?.(src));
  const thanks=[
    name=>`“${name}, you saved the square,” says a villager. “Is it safe?” asks another. “The attacker left.” “That is not what I asked.”`,
    name=>`The blacksmith claps for ${name}. “You were on beat,” he says. “With the sword?” “No, with my clapping. Your sword needs work.”`,
    name=>`The priest checks ${name} for wounds. “Can you please do that after we cheer?” asks a guard. “You cheer,” says the priest. “I'll keep the hero standing.”`,
    name=>`“You saved my stall,” the merchant tells ${name}. “I owe you.” “A discount?” “I owe you a sincere thank-you. Do not negotiate the sincerity.”`,
    name=>`The villagers thank ${name}. A goose honks over them. “You did nothing,” says the baker. The goose stamps the ground twice and leaves offended.`,
    name=>`A guard salutes ${name}. “The village is secure.” Someone points at the broken gate. “The village is temporarily shaped like a secure village,” he corrects.`,
    name=>`The children chant ${name}'s name. An adult joins in, realizes he is alone on the next verse, and pretends to be calling everyone to dinner.`,
    name=>`“${name} stood between us and that thing,” says a villager. “I was behind a barrel,” says another. “You held it?” “I supported it emotionally.”`,
    name=>`The crowd offers ${name} a heroic title. Three people argue over spelling. “Can we save the coronation for after the repairs?” asks the priest.`,
    name=>`“Quiet road tonight,” a guard tells ${name}. The whole village turns toward him. “What?” “You said it out loud,” says the blacksmith. “Go fix that.”`
  ];
  const raid={active:false,backdrop:null,previousHub:0,previousStage:0,visits:Number(state.meta?.villageRaidVisits||0),lastRaidVisit:Number(state.meta?.villageRaidLastVisit??-100),announcing:false};
  window.villageRaid=raid;
  const eligible=()=>{
    const out=[];
    for(let hub=0;hub<5;hub++){
      const cleared=Math.min(4,Math.max(0,Number(state.progress?.[hub])||0));
      for(let level=1;level<=cleared;level++){
        const named=state.ng?window.getNgPlusEncounterStory?.(hub,level)?.enemy:null;
        const enemy=named||hubs[hub]?.[4]?.[level-1];
        if(enemy&&enemy!=='Random')out.push({hub,level,enemy});
      }
    }
    return out;
  };
  const restore=()=>{state.hub=raid.previousHub;state.stage=raid.previousStage;raid.active=false;raid.backdrop=null;document.querySelector('#combat')?.classList.remove('village-raid');document.querySelector('#combat .village-raid-scene')?.remove()};
  const blocked=()=>raid.active||raid.announcing||document.querySelector('#rewardOverlay.open,#levelModal.open,#utilityModal.open,#noticeOverlay,.road-event,.facility-modal.open,.death-modal,#endgameOverlay.open');
  raid.trigger=async debug=>{
    if(blocked())return false;
    const pool=eligible();
    if(!pool.length){if(!debug)return false;pool.push({hub:0,level:1,enemy:hubs[0][4][0]})}
    if(!document.querySelector('#village.active')){
      if(!debug)return false;
      window.renderVillage?.();show('village');
    }
    raid.announcing=true;
    const chosen=pool[Math.floor(Math.random()*pool.length)];
    const place=scenes[Math.floor(Math.random()*scenes.length)];
    const night=!!window.gameClock?.getState?.()?.isNight;
    raid.backdrop=`${root}${place}${night?'-night':''}.png`;
    raid.previousHub=state.hub;raid.previousStage=state.stage;
    raid.active=true;raid.enemy=chosen.enemy;
    const combatScreen=document.querySelector('#combat');
    combatScreen?.querySelector('.village-raid-scene')?.remove();
    const scene=document.createElement('div');scene.className='village-raid-scene';scene.setAttribute('aria-hidden','true');
    scene.style.backgroundImage=`linear-gradient(rgba(12,15,20,.16),rgba(12,15,20,.22)),url("${raid.backdrop}")`;
    combatScreen?.prepend(scene);
    const banner=document.createElement('div');banner.className='village-raid-announcement';banner.innerHTML='<strong>VILLAGE RAIDED</strong>';document.querySelector('.game')?.appendChild(banner);
    await (window.ensureSceneImage?.(raid.backdrop)||Promise.resolve()).catch(()=>{});
    setTimeout(()=>{
      banner.classList.add('departing');
      state.hub=chosen.hub;state.stage=chosen.level-1;
      document.querySelector('#combat')?.classList.add('village-raid');
      startCombat(chosen.enemy,false,chosen.level);
      document.querySelector('#combatStage').textContent=`Village Raid · ${chosen.enemy}`;
      setTimeout(()=>banner.remove(),750);
      raid.announcing=false;
    },1400);
    return true;
  };
  raid.onVictory=()=>{
    state.hp=Math.max(1,combat.playerHp);
    state.meta.villageRaidWins=(Number(state.meta.villageRaidWins)||0)+1;
    state.meta.battleWonPending=false;
    save();
    document.querySelector('#battlePrompt').textContent='Village defended!';
    document.querySelector('#battleDetail').textContent='Choose your doubled raid reward.';
    window.openBattleReward('Village defended!',false);
  };
  raid.onReward=()=>{
    restore();
    window.renderVillage?.();show('village');
    const message=thanks[Math.floor(Math.random()*thanks.length)](state.playerName||'the hero');
    const overlay=document.createElement('div');overlay.className='village-raid-thanks';overlay.innerHTML=`<div class="village-raid-thanks-card"><span>Village saved</span><p></p><button type="button">Continue</button></div>`;
    overlay.querySelector('p').textContent=message;
    document.querySelector('.game')?.appendChild(overlay);
    overlay.querySelector('button').onclick=()=>overlay.remove();
  };
  const originalDeath=window.deathScreen;
  if(originalDeath)window.deathScreen=function(reason){if(raid.active){restore();save()}return originalDeath(reason)};
  document.querySelector('#villageBtn')?.addEventListener('click',()=>{
    if(!document.querySelector('#village.active')||blocked())return;
    raid.visits++;state.meta=state.meta||{};state.meta.villageRaidVisits=raid.visits;save();
    if(raid.visits-raid.lastRaidVisit<=2)return;
    if(eligible().length&&Math.random()<.10){raid.lastRaidVisit=raid.visits;state.meta.villageRaidLastVisit=raid.visits;save();raid.trigger(false)}
  });
})();
