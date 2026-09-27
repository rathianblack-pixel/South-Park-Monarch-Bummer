/* Village raids are independent encounters; they never advance area progression. */
(()=>{
  const root='Textures/Maps/VillageRaids/';
  const scenes=['central-crossroad','outer-village-bridge','right-road'];
  const assets=scenes.flatMap(name=>[`${root}${name}.png`,`${root}${name}-night.png`]);
  assets.forEach(src=>window.ensureSceneImage?.(src));
  const thanks=[
    name=>`The mayor thanks ${name} for saving the square. She asks the crowd to wait until morning before arguing about who pays for repairs.`,
    name=>`The blacksmith shakes ${name}'s hand, then asks for the damaged armor. Apparently gratitude and inspection share a schedule.`,
    name=>`The priest thanks ${name}. The choir starts a hymn; he quietly asks them to let the wounded sit down first.`,
    name=>`The merchant reopens the stall for ${name}. The prices stay the same. The free water is his idea of a grand gesture.`,
    name=>`A villager thanks ${name} for driving off the raider. The goose tries to take credit until someone mentions the actual fight.`,
    name=>`The guard salutes ${name}, then admits the village drill never covered a monster coming in through the vegetable cart.`,
    name=>`The children chant ${name}'s name. Their parents ask them to stop only because the injured are trying to sleep.`,
    name=>`An exhausted carpenter thanks ${name} for saving his house. He immediately measures the broken gate and says he can manage that part.`,
    name=>`The council offers ${name} a title. Nobody agrees on its spelling, so the village settles on another round of supper.`,
    name=>`The village thanks ${name} at the reopened bridge. For one evening, nobody tries to collect a toll on the way home.`
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
