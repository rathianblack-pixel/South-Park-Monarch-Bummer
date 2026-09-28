/* Interior conversations sit over the existing service and quest handlers. */
(()=>{
'use strict';
const $=s=>document.querySelector(s),room=$('#interior'),game=$('.game');if(!room||!game||!window.openFacility)return;
const LINES={
 cathedral:{
  greet:["Oh. You're alive. I owe the bell-ringer three coins.","Welcome in. Wipe your boots. The floor is older than both of us.","Please tell me that noise is your armor.","The candle went out when you came in. It does that now.","I prayed for a quiet day. You heard me, didn't you?","You can sit down. It isn't a test.","A guard left a curse here. If it's yours, take it home.","We have water, bandages, and a broom you keep avoiding."],
  talk:["The reliquary is missing again. Bring back the box, not a theory.","I asked the guards to stop saluting the bell. They said it outranks them.","Someone left a goose at confession. I have no idea what it confessed.","The gravekeeper wants quieter funerals. I told him to talk to the mourners.","I feed travelers on Thursdays. Apparently today is now Thursday.","A villager asked if prayer fixes a roof. I said no. He asked me twice more.","Barnaby asked me to bless his toll ledger. I blessed the bridge instead.","Timmy's cemetery has a guest list. Nobody remembers signing it."],
  service:["Sit. You're bleeding on the hymn book.","Healing first. Tell me the heroic version afterward.","The prayer is free. The stronger stuff uses supplies.","Hold still. The light isn't chasing you.","I can remove the curse. I can't remove your bad decisions.","If you're healthy, please don't invent an injury.","You brought half the road in on your boots. And one ailment.","Pick what you need. I have other patients and one clean towel."],
  quest:["The board has jobs. Yes, the goose petition counts.","Read the request before you grab the reward.","The kitchen needs help. It used the word 'urgent' twice.","Someone needs a grave fixed. Please ask which one.","A few names are missing on purpose. Respect that.","The villagers wrote these. I only corrected the spelling.","Finish a job and tell me. I'm not psychic.","The bell needs repair again. It knows why."]},
 blacksmith:{
  greet:["You're back. Put the weapon down before you explain.","That rattle better be your armor.","I can fix the dent. I can't explain it to the metal.","Don't lean on the anvil. It's winning an argument with fire.","You kept all your fingers. Good. My forms have no spare column.","Come in. The forge is hot and the apprentice is hiding.","Who hit your shield with a door? Never mind. I know.","I smelled burnt steel. Then I saw you."],
  talk:["The guards keep holding shields backward. I charge them for both sides.","I made Barnaby's shield. He asked if it could collect tolls.","The fortress ordered ceremonial hinges. Doors still need to open.","Your dents tell a story. It isn't flattering, but it ends with you alive.","The apprentice wants a legendary blade. He hasn't made a decent nail.","I repair tools too. Farmers are less likely to name them.","Timmy asked for a coffin with a lock on the inside. I declined.","I made the gate. Nobody notices it until it sticks."],
  upgrade:["Put it here. If it bites, I charge extra.","More damage, same handle. Try keeping hold of it.","I can improve the focus. Keep the sparks off my beard.","The materials are ready. Your coins look nervous.","You want a sharper edge? Stop using it to open crates.","This upgrade won't teach aim. That's still your problem.","Give me a minute. Those sparks have somewhere to be.","It's stronger now. Please don't test it on my door."],
  armor:["Turn around. Your back plate gave up three miles ago.","This seam is being held together by optimism.","Stand still. I'm measuring the armor, not your ego.","A bone and some coins. Yes, the bone is necessary.","This will stop more damage. It won't make you clever.","Your straps survived? I owe the apprentice a coin.","I can add a plate without turning you into a cupboard.","Wait for the rivet to cool. That wasn't a dare."],
  quest:["These jobs need materials. A dramatic story isn't a material.","Somebody broke the gate again. Take a guess.","I wrote the rewards down. Don't haggle with the chalk.","The forge needs supplies. The village needs everything else.","Bring the broken thing here. Describing the noise won't help.","Yes, this one pays. No, not in swords.","The guards submitted a repair request in triplicate.","Finish a job and I'll inspect it. Briefly."]},
 merchant:{
  greet:["Welcome. Please don't drink anything before paying.","A returning customer. I'll act normal about it.","The shop is open. That crate isn't.","Prices are on the tags. My handwriting is negotiable.","You look like you made a shopping list mid-fight.","Come in. I moved the breakables away from you.","Coins or no coins, you can look. Hands behind your back.","I restocked at dawn. The boxes filed a complaint."],
  talk:["A goose tried to pay with a royal decree. I kept the decree.","The blacksmith calls my prices theater. I sell his nails.","I sold a map to the maze. The map came back alone.","A customer asked for a potion of good judgment. Sold him water.","The fortress keeps ordering candles. That's a worrying quantity.","I mark dangerous items clearly. They still sell first.","A safe road means repeat customers. I prefer repeat customers.","The ledger says trade is up. The roads disagree."],
  shop:["Buy medicine before the dramatic injury, please.","Spellbooks on the left. Things you can chew on the right.","No, heroic promises aren't legal currency.","That shelf has supplies. The other shelf has regrets.","The antidotes are labeled. I've learned why that matters.","Everything survived shipping. Barely.","I can recommend an item. I can't make you use it.","Please pay before testing the magic."],
  quest:["The board has deliveries. None go to the maze without a map.","A missing crate is bad for business. Find it.","The reward is written down. I learned my lesson.","Some customers need help more than they need my sales pitch.","These jobs came in with the caravans.","Bring proof. I have been paid in rumors before.","One request says 'urgent.' It was written yesterday.","Complete a job and tell me before the gossip does."]},
 home:{thought:["Home. The chair survived without me.","I should rest before the armor starts complaining aloud.","Quiet. That's suspicious. Nice, but suspicious.","I own a lot of gear and one good chair.","The trophies look tidier than the fights did.","I could sort my supplies. I could also sit down.","The armor doll stands straighter than I do.","I left as a hero. I came back needing a nap."]}
};
const names={cathedral:'Priest',blacksmith:'Blacksmith',merchant:'Merchant',home:'Your thoughts'};
const labels={cathedral:[['Talk','talk'],['Services','service'],['Quests','quest'],['Leave','leave']],blacksmith:[['Talk','talk'],['Upgrade '+(state.gear==='magic'?'Magic':'Weapon'),'upgrade'],['Upgrade Armor','armor'],['Quests','quest'],['Leave','leave']],merchant:[['Talk','talk'],['Shop','shop'],['Quests','quest'],['Leave','leave']],home:[['Rest','rest'],['Codex','codex'],['Settings','settings'],['Leave','leave']]};
const spoken={talk:'Have you got a minute? I promise this is shorter than the last royal decree.',service:'I need your help. The practical kind, with a price if necessary.',quest:'What is on the board today, and how much of it is on fire?',shop:'Show me what you have. Start with the things that will not bite.',upgrade:'Can you make this hit harder without making it harder to hold?',armor:'Can you reinforce this before the next enemy finds that loose seam?',rest:'I am going to sleep until the armor stops rattling in my head.',doll:'Let me see which armor looks ready for another bad decision.',trophies:'I want to look at the trophies. From a safe distance.',codex:'I should read the notes before I forget what nearly killed me.',settings:'I want to adjust the way battles feel.'};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const reduceMotion=()=>window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
function pick(type,topic){
 const lines=LINES[type]?.[topic]||[];if(!lines.length)return '';
 state.meta=state.meta||{};const recent=state.meta.interiorDialogueRecent=state.meta.interiorDialogueRecent||{},key=`${type}:${topic}`,used=Array.isArray(recent[key])?recent[key]:[];
 const available=lines.map((_,i)=>i).filter(i=>!used.includes(i));const pool=available.length?available:lines.map((_,i)=>i);const index=pool[Math.floor(Math.random()*pool.length)];recent[key]=available.length?[...used,index]:[index];save();return lines[index];
}
function sourceAction(action,index){const panel=$('#interiorContent');let target=[...panel?.querySelectorAll('[data-fixed-action]')||[]].find(b=>b.dataset.fixedAction===action&&(index===undefined||Number(b.dataset.fixedIndex)===index));if(target)target.click();return !!target}
let scene=null,inside=false,seenThisEntry=false,timer=null,full='',typed=true,next=null,view='main',suspendedUntil=0,questPage=0,departing=false,leaveTimer=null;
function cleanup(){if(timer)clearInterval(timer);timer=null;clearTimeout(leaveTimer);leaveTimer=null;window.homeRevamp?.restoreHotspots?.();scene?.remove();scene=null;questPage=0;departing=false;inside=false;seenThisEntry=false;game.classList.remove('interior-dialogue-active')}
function actor(type){
 const wrap=document.createElement('div');wrap.id='interiorDialogueScene';wrap.className=`interior-dialogue-scene ${type==='home'?'home-thought':''}`;wrap.setAttribute('role','dialog');wrap.setAttribute('aria-modal','true');wrap.setAttribute('aria-label',`${names[type]} conversation`);
 const back=$('#interior .interior-backdrop'),npcSrc=type==='home'?'':$('#interiorCharacter')?.getAttribute('src')||'';
 const player=typeof combatArmorSources==='function'?combatArmorSources():{normal:''},playerSrc=Number(state.hp)<=Number(state.maxHp||1)*.25?player.damaged:player.normal;
 wrap.innerHTML=`<div class="interior-dialogue-backdrop"></div><div class="interior-dialogue-night"></div><div class="interior-dialogue-shade"></div><div class="interior-dialogue-actor interior-dialogue-player"><img src="${esc(playerSrc)}" alt="${esc(state.playerName||'Player')}"></div>${type==='home'?'':`<div class="interior-dialogue-actor interior-dialogue-npc"><img src="${esc(npcSrc)}" alt="${esc(names[type])}"></div>`}<div class="interior-dialogue-panel"><div class="interior-dialogue-speaker"></div><p class="interior-dialogue-text"></p><div class="interior-dialogue-controls"></div><div class="interior-dialogue-menu" hidden></div></div>`;
 wrap.querySelector('.interior-dialogue-backdrop').style.backgroundImage=getComputedStyle(back).backgroundImage;
 const night=$('#interiorNightLayer'),layer=wrap.querySelector('.interior-dialogue-night');layer.style.backgroundImage=night?.style.backgroundImage||'none';layer.style.opacity=night?.style.opacity||'0';
 const img=wrap.querySelector('.interior-dialogue-player img');img.onerror=()=>{img.onerror=null;img.src=player.normal};
 return wrap;
}
function controls(){return scene?.querySelector('.interior-dialogue-controls')}
function add(label,fn){const b=document.createElement('button');b.type='button';b.textContent=label;b.onclick=fn;controls()?.appendChild(b)}
function finishLine(){if(timer)clearInterval(timer);timer=null;scene.querySelector('.interior-dialogue-text').textContent=full;typed=true;renderControls()}
function focus(who,type){scene.classList.toggle('player-speaking',who==='player');scene.querySelector('.interior-dialogue-speaker').textContent=type==='home'?'Your thoughts':who==='player'?(state.playerName||'You'):names[type]}
function say(who,line,fn,type){if(timer)clearInterval(timer);scene.querySelector('.interior-dialogue-menu').hidden=true;view='dialogue';scene.classList.remove('showing-menu','idle-menu','quest-view');focus(who,type);full=line;next=fn||null;typed=false;scene.querySelector('.interior-dialogue-text').textContent='';controls().replaceChildren();
 if(reduceMotion()){finishLine();return}
 let i=0;timer=setInterval(()=>{scene.querySelector('.interior-dialogue-text').textContent=full.slice(0,++i);if(i>=full.length){clearInterval(timer);timer=null;typed=true;renderControls()}},21);
}
function renderControls(){if(!scene)return;controls().replaceChildren();if(next){add('Continue',next);return}mainMenu()}
function mainMenu(){
 const type=state._building||'home';view='main';scene.classList.remove('showing-menu','quest-view');scene.classList.add('idle-menu');scene.querySelector('.interior-dialogue-menu').hidden=true;
 controls().replaceChildren();scene.querySelector(':scope > .interior-home-resources')?.remove();if(type==='home'){const stats=document.createElement('div');stats.className='interior-home-resources';stats.innerHTML=`<span><small>COINS</small><b>◈ ${state.coins}</b></span><span><small>HEALTH</small><b>❤ ${state.hp}/${state.maxHp}</b></span>`;scene.append(stats)}const choices=type==='blacksmith'?labels.blacksmith.map(([title,action])=>[action==='upgrade'?'Upgrade '+(state.gear==='magic'?'Magic':'Weapon'):title,action]):labels[type]||labels.home;
 choices.forEach(([title,action])=>add(title,()=>choose(type,action)));
}
function showPanel(){
 if(!scene)return;
 view='panel';scene.classList.remove('idle-menu');scene.classList.add('showing-menu');
 const source=$('#interiorContent'),dest=scene.querySelector('.interior-dialogue-menu');
 const sourceView=source?.dataset.fixedView||'';
 if(sourceView==='quest')window.sideArmor?.render?.();
 if(dest.dataset.view!==sourceView)questPage=0;
 dest.dataset.view=sourceView;scene.querySelector('.dialogue-quest-detail')?.remove();dest.innerHTML=source?.innerHTML||'';dest.hidden=false;scene.classList.toggle('quest-view',sourceView==='quest');
 scene.querySelector('.interior-dialogue-text').textContent='';controls().replaceChildren();
 // Clone only the display: the global handler must not see these buttons.
 dest.querySelectorAll('[data-fixed-action],[data-fixed-equip]').forEach(button=>{
   if(button.dataset.fixedAction!==undefined){button.dataset.dialogueAction=button.dataset.fixedAction;delete button.dataset.fixedAction}
   if(button.dataset.fixedEquip!==undefined){button.dataset.dialogueEquip=button.dataset.fixedEquip;delete button.dataset.fixedEquip}
 });
 const board=dest.querySelector('.fixed-quest-board');
 if(board){
   const milestone=dest.querySelector('.side-armor-section');
   if(milestone){dest.querySelector('h2')?.after(milestone);milestone.querySelectorAll('button').forEach(button=>button.addEventListener('click',event=>{
     event.preventDefault();event.stopPropagation();
     const original=source.querySelector('.side-armor-section button:not([disabled])');
     if(original){original.click();showPanel()}
   }))}
 }
 if(board)board.querySelectorAll('.fixed-quest-row').forEach(row=>{
   row.hidden=false;row.title='Tap for full quest details';row.tabIndex=0;row.setAttribute('role','button');
   const detail=()=>{
     const panel=scene.querySelector('.interior-dialogue-panel');panel.querySelector('.dialogue-quest-detail')?.remove();
     const full=document.createElement('div');full.className='dialogue-quest-detail';full.setAttribute('role','dialog');full.setAttribute('aria-label','Quest details');
     full.innerHTML='<button type=\"button\" class=\"dialogue-quest-close\" aria-label=\"Close quest details\">×</button>'+row.innerHTML;
     full.querySelector('.dialogue-quest-close').onclick=()=>full.remove();
     full.querySelectorAll('[data-dialogue-action]').forEach(button=>button.onclick=event=>{
       event.preventDefault();event.stopPropagation();const index=Number(button.dataset.fixedIndex);
       if(sourceAction(button.dataset.dialogueAction,index))showPanel();else full.remove();
     });
     panel.appendChild(full);full.querySelector('.dialogue-quest-close').focus();
   };
   row.addEventListener('click',event=>{if(!event.target.closest('button'))detail()});
   row.addEventListener('keydown',event=>{if(event.target===row&&(event.key==='Enter'||event.key===' ')){event.preventDefault();detail()}});
 });
 dest.querySelectorAll('button[data-dialogue-action],button[data-dialogue-equip]').forEach(button=>button.addEventListener('click',event=>{
   event.preventDefault();event.stopPropagation();const action=button.dataset.dialogueAction;
   if(action==='back'){sourceAction('back');mainMenu();return}
   if(action==='leave'){sourceAction('leave');return}
   if(button.dataset.dialogueEquip!==undefined){[...source.querySelectorAll('[data-fixed-equip]')].find(x=>x.dataset.fixedEquip===button.dataset.dialogueEquip)?.click();showPanel();return}
   if(sourceAction(action,button.dataset.fixedIndex===undefined?undefined:Number(button.dataset.fixedIndex)))showPanel();
 }));
}
function openCategory(type,action){
 if(action==='doll'||action==='trophies'){
   // Discard the dialogue's Continue callback before suspending it.
   next=null;typed=true;mainMenu();const open=action==='doll'?window.homeRevamp?.openArmor:window.homeRevamp?.openTrophies;open?.();return;
 }
 if(action==='codex'){next=null;typed=true;mainMenu();sourceAction('codex');return}
 if(!sourceAction(action)){mainMenu();return}showPanel();
}
function choose(type,action){
 if(action==='leave'){sourceAction('leave');return}
 const playerLine=spoken[action]||'I would like to take a look.';
 if(type==='home'){
   say('player',playerLine,()=>{if(action==='rest')say('player','A little sleep might make the next terrible decision feel better.',()=>openCategory(type,action),type);
     else if(action==='doll'||action==='trophies'||action==='codex')openCategory(type,action);
     else say('player','I can change this before the next fight.',()=>openCategory(type,action),type)},type);return;
 }
 say('player',playerLine,()=>{
   const line=pick(type,action);
   say('npc',line,()=>{
     if(action==='talk')say('player',type==='cathedral'?'That sounds like a long week.':type==='blacksmith'?'I think that was advice.':'I am not buying that story.',()=>mainMenu(),type);
     else openCategory(type,action);
   },type);
 },type);
}
function refreshPlayer(){
 if(!scene)return;
 const img=scene.querySelector('.interior-dialogue-player img');if(!img)return;
 const armor=typeof combatArmorSources==='function'?combatArmorSources():null;if(!armor)return;
 const src=Number(state.hp)<=Number(state.maxHp||1)*.25?armor.damaged:armor.normal;
 if(!src||img.dataset.requestedSrc===src)return;
 img.dataset.requestedSrc=src;
 const image=new Image();image.onload=()=>{if(scene?.contains(img)&&img.dataset.requestedSrc===src)img.src=src};
 image.onerror=()=>{if(scene?.contains(img)&&img.dataset.requestedSrc===src)img.src=armor.normal};image.src=src;
}
function begin(type){
 if(scene)return;sourceAction('continue'); // Advance the existing interior panel to its functional main menu.
 scene=actor(type);if($('#fadeTransition')?.classList.contains('active')){scene.classList.add('entering');setTimeout(()=>scene?.classList.remove('entering'),500)}game.appendChild(scene);if(type==='home')window.homeRevamp?.mountHotspots?.(scene);game.classList.add('interior-dialogue-active');requestAnimationFrame(()=>scene?.classList.add('open'));
 const greeting=type==='home'?pick('home','thought'):pick(type,'greet');
 say(type==='home'?'player':'npc',greeting,()=>mainMenu(),type);
 scene.querySelector('.interior-dialogue-panel').addEventListener('click',e=>{if(!e.target.closest('button')&&!typed)finishLine()});
 // Facility actions refresh the visible panel explicitly; observing every hidden
 // panel mutation replaced hovered buttons and swallowed clicks.
}
setInterval(()=>{
 const active=room.classList.contains('active'),intro=$('#interiorContent')?.dataset.fixedView==='intro';
 if(!active){if(inside&&!departing)cleanup();return}
 inside=true;
 if(!seenThisEntry&&intro){seenThisEntry=true;begin(state._building||'home')}
 if(scene&&state._building==='home')refreshPlayer();
 if(scene&&view==='main'&&state._building==='home'){const stats=scene.querySelector('.interior-home-resources');if(stats){stats.querySelectorAll('b')[0].textContent=`◈ ${state.coins}`;stats.querySelectorAll('b')[1].textContent=`❤ ${state.hp}/${state.maxHp}`}}
 if(scene){const layer=scene.querySelector('.interior-dialogue-night');if(layer)layer.style.opacity=String(Math.max(0,Math.min(1,Number(window.gameClock?.getState?.()?.nightBlend)||0)))}
},90);
window.InteriorDialogue={lines:LINES,refreshPlayer,onEnter(){if(scene||!room.classList.contains('active'))return;if($('#interiorContent')?.dataset.fixedView==='intro'){inside=true;seenThisEntry=true;begin(state._building||'home')}},onLeave(){if(!scene||departing)return;departing=true;clearTimeout(leaveTimer);leaveTimer=setTimeout(cleanup,350)}};
})();
