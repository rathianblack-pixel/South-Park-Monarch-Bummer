/* Small first-time hints. The combat effect changes visual animation speed only. */
(()=>{
  if(window.__helpHintsInstalled)return;
  const game=document.querySelector('.game');
  if(!game)return;
  window.__helpHintsInstalled=true;
  const hints=[
    ['create','Getting started','Choose your character and weapon, then enter the village.'],
    ['village','Village','Visit buildings to heal, shop, upgrade gear, and manage your house.'],
    ['map','Overworld','Choose an unlocked area, then pick a level. Clearing levels opens the next.'],
    ['clock','Day & night','Day: 6 AM–7 PM. Night: 7 PM–6 AM. The world changes with the in-game clock.'],
    ['level','Levels','You can replay cleared levels for more rewards.'],
    ['combat','Battle cards','Hover to raise a card, then click to act. Keys 1–3 work too.'],
    ['enemyTurn','Enemy turn','After your action, the enemy takes its turn. Watch your HP.'],
    ['guard','Guard','Guard reduces the next hit. Magic users also recover mana.'],
    ['items','Items & spells','Open this card to use supplies or support spells.'],
    ['lowHp','Low health','Low health changes your armor sprite. Heal at the church or rest at home.'],
    ['church','Church','Restore HP here, or pray for a smaller free heal.'],
    ['merchant','Merchant','Buy supplies here. Magic users can unlock spellbooks.'],
    ['blacksmith','Blacksmith','Upgrade your weapon, magic, or armor when you have enough materials.'],
    ['house','House','Rest for free, change unlocked armor, and check your Codex.'],
    ['codex','Codex','Defeat monsters to reveal their lore and field observations.'],
    ['status','Status effects','Status effects can linger. Check your status icons and seek a cure.'],
    ['boss','Area boss','Level 5 is the area boss. Defeating it opens the way forward.'],
    ['ngplus','New Game+','NG+ follows your chosen route, with its own areas, encounters, and story.']
  ];
  const seen=()=>{state.meta=state.meta||{};return state.meta.helpHints=state.meta.helpHints||{}};
  const tip=document.createElement('aside');tip.className='help-hint';tip.setAttribute('role','status');tip.setAttribute('aria-live','polite');tip.hidden=true;
  const help=document.createElement('button');help.type='button';help.className='help-hints-button';help.textContent='?';help.title='View game hints';help.setAttribute('aria-label','View game hints');
  const guide=document.createElement('section');guide.className='help-hints-guide';guide.hidden=true;
  game.append(tip,help,guide);
  let current=null,timeout=null,guideOpen=false,lastClosedAt=0;
  const slowed=new Map();let slowdownTimer=null;
  function syncSlowMotion(){
    const combat=document.querySelector('#combat');
    if(!combat?.classList.contains('active'))return;
    for(const animation of combat.getAnimations?.({subtree:true})||[]){
      const target=animation.effect?.target;
      if(!(target instanceof Element)||!target.closest('.battle-field,.battle-bottom'))continue;
      if(!slowed.has(animation)){slowed.set(animation,animation.playbackRate);animation.updatePlaybackRate(animation.playbackRate*.25)}
    }
  }
  function restoreMotion(){clearInterval(slowdownTimer);slowdownTimer=null;for(const [animation,rate] of slowed){try{animation.updatePlaybackRate(rate)}catch(_){}}slowed.clear()}
  function beginMotion(){if(!document.querySelector('#combat')?.classList.contains('active'))return;syncSlowMotion();slowdownTimer=setInterval(syncSlowMotion,120)}
  function closeTip(){clearTimeout(timeout);timeout=null;if(current)lastClosedAt=Date.now();tip.hidden=true;current=null;restoreMotion()}
  function showTip(key,manual=false){
    const item=hints.find(h=>h[0]===key);if(!item)return;
    closeTip();if(guideOpen){guide.hidden=true;guideOpen=false}
    current=key;tip.innerHTML=`<div><strong>${item[1]}</strong><p>${item[2]}</p></div>`;
    tip.hidden=false;
    if(!manual){seen()[key]=true;try{save()}catch(_){}}
    beginMotion();timeout=setTimeout(closeTip,3000);
  }
  help.onclick=()=>{
    closeTip();guideOpen=!guideOpen;guide.hidden=!guideOpen;
    if(guideOpen){guide.innerHTML='<div class="help-hints-heading"><strong>Game hints</strong><button type="button" aria-label="Close hints">×</button></div>'+hints.map(h=>`<button type="button" data-help-key="${h[0]}"><b>${h[1]}</b><span>${h[2]}</span></button>`).join('');guide.querySelector('.help-hints-heading button').onclick=()=>{guideOpen=false;guide.hidden=true};guide.querySelectorAll('[data-help-key]').forEach(b=>b.onclick=()=>showTip(b.dataset.helpKey,true))}
  };
  let previousScreen='',lastCombat=null,itemsTouched=false,levelVisited=false,codexVisited=false;
  document.addEventListener('click',event=>{if(!event.target.closest?.('#newGameChoice,#beginBtn'))return;state.meta=state.meta||{};state.meta.helpHints={};closeTip();lastClosedAt=0},true);
  document.addEventListener('click',event=>{if(event.target.closest?.('#combat .card[data-card="magic"]'))itemsTouched=true},true);
  function check(){
    const screen=document.querySelector('.screen.active')?.id||'';
    if(screen!==previousScreen){if(current)closeTip();previousScreen=screen}
    if(screen==='combat'&&lastCombat!==combat){if(current)closeTip();lastCombat=combat;itemsTouched=false}
    if(screen!=='combat')lastCombat=null;
    help.hidden=!['create','village','map','combat','interior'].includes(screen);
    if(help.hidden&&guideOpen){guide.hidden=true;guideOpen=false}
    const building=state._building,level=document.querySelector('#levelModal'),codex=document.querySelector('#codexOverlay');
    if(level?.classList.contains('open'))levelVisited=true;
    if(codex?.classList.contains('open'))codexVisited=true;
    const visible=element=>!!element&&getComputedStyle(element).display!=='none'&&getComputedStyle(element).visibility!=='hidden'&&element.getClientRects().length>0;
    const overlays=document.querySelectorAll('#introExperience.open,#noticeOverlay,#rewardOverlay.open,#roadEventOverlay.open,#utilityModal.open,#codexOverlay.open,.quiz-modal,.death-modal,.road-event:not(#noticeOverlay)');
    const otherPopup=!!([...overlays].some(visible)||(level?.classList.contains('open')&&visible(level))||window.__battleNoticeOpen);
    if(otherPopup&&current)closeTip();
    if(current||guideOpen||help.hidden||otherPopup||Date.now()-lastClosedAt<2500)return;
    const hasStatus=!!document.querySelector('#combat .status-tag:not(:empty)');
    const eligible={
      create:screen==='create',village:screen==='village',map:screen==='map'&&!level?.classList.contains('open'),clock:screen==='map'&&!level?.classList.contains('open'),
      level:screen==='map'&&levelVisited&&!level?.classList.contains('open'),combat:screen==='combat',
      enemyTurn:screen==='combat'&&!!window.__combatEnemyTurn,
      guard:screen==='combat'&&!!combat?.guard,
      items:screen==='combat'&&itemsTouched,
      lowHp:screen==='combat'&&!!combat&&combat.playerHp<=state.maxHp*.25,
      church:screen==='interior'&&building==='cathedral',merchant:screen==='interior'&&building==='merchant',
      blacksmith:screen==='interior'&&building==='blacksmith',house:screen==='interior'&&building==='home',
      codex:screen==='interior'&&codexVisited&&!codex?.classList.contains('open'),status:screen==='combat'&&hasStatus,
      boss:screen==='combat'&&combat?.level===5,ngplus:screen==='map'&&state.ng
    };
    for(const [key] of hints){if(eligible[key]&&!seen()[key]){showTip(key);break}}
  }
  setInterval(check,350);check();
})();
