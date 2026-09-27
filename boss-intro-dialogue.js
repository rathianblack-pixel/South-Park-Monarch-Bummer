/* First-entry Level 5 conversations. The existing combat instance waits untouched behind the scene. */
(()=>{
  'use strict';
  const q=s=>document.querySelector(s),game=q('.game');if(!game||!window.startLevel)return;
  const STORIES={
    'Sir Barnaby':{opening:["Stop. This bridge has a toll.","You charged a farmer for crossing to his own field.","He crossed twice. I gave him the return discount.","That's not a thing.","It is now. I've already printed the sign."],
      kind:["Let people cross. You can still protect them.","Without a toll, how will they know I'm working?","They'll see you guarding the bridge.","That sounds suspiciously like unpaid work.","It sounds like being a knight.","Fine. But first you have to get past the knight."],
      taunt:["I've crossed scarier bridges made of wet planks.","This bridge has a trained defender.","Where? Behind the man with the coin cup?","I am the trained defender.","Then your training needs a refund.","My shield cost more than your entire outfit. Let's test it."],
      roast:["Does that shield protect you from criticism too?","It has survived twelve campaigns.","And still couldn't stop you becoming a tollbooth.","I am a sworn knight.","You are a parking fine with legs.","Right. I'm charging you extra for that."]},
    'Gloomfang':{opening:["You're in my woods.","Your traps pushed the animals onto the village road.","The road belongs to people. They'll cope.","The wolves didn't.","The wolves should've learned to read signs."],
      kind:["Let me clear the traps. Your pack can come home.","People said that before the iron jaws arrived.","Watch me do it, then.","If you touch the wrong snare, you lose a hand.","I have another.","That is not reassuring. Show me anyway."],
      taunt:["Your pack led me straight here.","They led you where I wanted you.","Into the clearing with the broken traps?","They worked yesterday.","I was busy yesterday.","Then let's see how busy you are now."],
      roast:["You call this a forest? It's a trap shop with trees.","The traps keep hunters out.","They also keep your pack out, genius.","They can go around.","They've been sleeping in the village bins.","...I didn't approve that. Get out of my woods."]},
    'Lich King Timmy':{opening:["Welcome to my eternal court. Sit wherever you like.","They're all graves.","Yes. Reserved seats were unpopular.","You've been waking people to hear your speeches.","The living kept leaving halfway through."],
      kind:["Let them rest. You don't need an audience to matter.","Easy for you to say. People came to see you.","They came because you rang the cemetery bell all night.","I needed a decent turnout.","You needed to ask them.","Ask the dead? That's going to be awkward. Fight first."],
      taunt:["I'll beat you before you finish the opening speech.","This is only the introduction.","The audience already left.","They're buried here. They can't leave.","That's somehow worse than I thought.","You asked for a shorter speech. Here's the short part."],
      roast:["You made dead people attend your speech?","My court is loyal.","Your court is legally unable to walk out.","They can crawl.","And they still chose to stay underground.","Fine. I'll give you something else to talk about."]},
    'Minotaur with Anxiety':{opening:["You're at the center. I think. The hedges moved again.","Your signs say the traps are 'probably safe.'","I couldn't prove they weren't.","People got hurt following them.","I know. I've been rewriting the signs."],
      kind:["Open a path. I'll help everyone out.","What if it's the wrong path?","We'll turn around.","You say that like it doesn't take three hours.","Then we start now.","All right. But I need to know you can survive the maze first."],
      taunt:["Your maze took me ten minutes.","That's impossible. It takes me forty.","You keep stopping to apologize to the hedges.","One of them is very sensitive.","I'll race you to the exit.","There are four exits. Wait. Three. Damn it."],
      roast:["The only thing lost in this maze is your confidence.","My confidence has a designated location.","Is it behind the sign that says 'maybe'?","That sign took me an hour.","Your traps are better at hurting your feelings.","Could we fight? I know where to stand for that."]},
    'Monarch Lucien':{opening:["You made it through the fortress.","Your guards gave me very detailed directions.","I told them not to talk.","They mostly screamed. The ledgers did the talking.","Then you know why I can't let you leave."],
      kind:["The villages need their supplies back. Stop the tribute.","And tell the court I was wrong?","Tell them you changed your mind.","They'd ask why.","Because people were hungry.","You make surrender sound simple. It won't be."],
      taunt:["Five regions, one throne, and I still found you.","My guards slowed you down.","They were excellent at standing in doorways.","You joke because you haven't seen me fight.","I'm saving the serious face for a challenge.","Then you won't have to wait."],
      roast:["You emptied five villages to decorate one chair?","It is the royal throne.","So you spent all that money on a bad seat.","The throne represents order.","The villagers call it a tax bill with cushions.","That's enough. You can insult me with a weapon."]},
    'Goosecourt Marshal':{opening:["Road's closed. HONK.","Those petitions under your wing belong to the villagers.","They are awaiting review.","You're sitting on them.","That is how I prevent unauthorized review."],
      kind:["Give the petitions back. They need supplies.","A marshal can't just hand over documents.","Their names are on them.","That does complicate custody.","You could actually help them.","I could. But first I need to win this argument."],
      taunt:["Nice sash. Did the crown issue that to every bird?","Only officers with distinguished service.","How many forms did you peck to earn it?","Seventeen. Perfectly legible.","I'll be past your desk before number eighteen.","HONK. The desk has a defender."],
      roast:["You're a goose guarding paperwork you can't read.","I can read the important parts.","Like the big stamp that says 'goose'?","That is my official seal.","Your entire government fits under one wing.","It also has a disciplinary wing. This one."]},
    'Thornstag Sovereign':{opening:["The grove is closed.","Your ranger chased people here. The hound chased them back.","They were meant to keep hunters out.","They can't tell a hunter from a lost kid.","Neither could the last hunters."],
      kind:["Let them through. I'll keep the hunters away.","Promises don't stop axes.","Then watch me take the traps down.","The trees have heard that before.","They haven't heard it from me.","They will be listening when we fight."],
      taunt:["Your border has holes. I found all of them.","You found the path I left open.","Very generous. Want it back?","I want to see whether you deserved it.","I already passed your whole staff.","Then it's time to meet their employer."],
      roast:["Your kingdom is an angry hedge.","This grove is older than your crown.","And yet it still can't manage a front gate.","Visitors brought axes last time.","Now they bring directions. You should ask for some.","I know exactly where you stand. Lower your guard."]},
    'Crown Revenant':{opening:["Who wears a crown above my grave?","Someone trying to let the mourners sleep.","They once answered to me.","They've been dead a long time.","Then they have had time to remember their manners."],
      kind:["Let them rest. I'll remember their names.","A promise from the living fades quickly.","Then I'll write them down.","On a monument?","In the village records. Where people actually look.","Prove you're willing to carry that burden."],
      taunt:["Centuries underground, and this is your comeback?","My cryptguard stopped most intruders.","Most isn't everyone. I'm here.","The bishop still stands.","I passed him too. Update your ledger.","I'll put your name in the final entry."],
      roast:["You're the only corpse here who won't let anyone sleep.","I am their first sovereign.","You are a loud neighbor in an expensive coffin.","The crown commands respect.","The crown needs a 'quiet hours' sign.","I'll show you how quiet this crypt can become."]},
    'Thornmaze Warden':{opening:["The court has judged your route.","Your spearman pointed me into a wall.","A test of discernment.","The prowler pointed at the same wall.","A second test. We need new staff."],
      kind:["Open the paths. People are trapped.","The trials are the court's purpose.","Then the court needs a better purpose.","Hedges don't change orders easily.","Start with one gate.","First prove you can reach it."],
      taunt:["I made it through your maze.","You arrived at the center. Different achievement.","It's where the boss is, right?","That title is informal.","Good. We can skip the paperwork.","Unfortunately, I brought all of it."],
      roast:["Your maze is a hedge with a law degree.","Every turn serves royal procedure.","Even the one that goes into a shed?","Especially that one.","The shed should be running this place.","It declined the position. I didn't."]},
    'Throne Ascendant':{opening:["The regent is gone. The throne speaks now.","The guards were defending a chair?","They were defending order.","The villages call it an overdue bill.","Villages are very poor at understanding eternity."],
      kind:["Let the people decide what comes next.","People change their minds.","That's how they fix mistakes.","The crown was built to endure them.","It was built by people too.","Then let people defend their argument."],
      taunt:["Five regions of guards, and I'm still here.","I contain every claim they served.","That's a lot of paperwork in one chair.","I contain their strength as well.","Finally. Something worth testing.","Come closer and find out."],
      roast:["The final ruler is furniture with an ego.","I am the living will of the crown.","So the chair learned to talk and still can't listen.","It has heard every royal decree.","That explains the personality.","You will learn what silence sounds like."]},
    'Ashen Throne Warden':{opening:['The throne is gone. My last order is still active. I have checked for an expiration date.','The people tore down the fortress so they could build something better.','They stole the stone, the banners, and the name. My orders did not end.','Your orders are ash. The council needs these roads open.','Then the council must pass through what remains of the old guard.'],
      kind:['You were made to protect a place. Let the people make it safe again.','I remember only the order to stand when all others fell.','You can stand with them instead of against them.','Nobody ever asked what the guard does after the gate is torn down.','Then listen to what is rising outside these walls.','I will listen after I know you can carry its weight.'],
      taunt:['The fortress is rubble and its guard still expects a performance review.','The throne may be gone. I still know how to fight.','Good. I did not walk through rubble for a quiet debate.','Every blow I take heats the old armor further.','Then I will finish before you become a furnace.','Try. The ashes remember every defender before me.'],
      roast:['Your king is gone, your castle is rubble, and you are guarding a pile of warm bricks.','I guard the throne’s final command.','A command from a chair that no longer exists. Impressive career planning.','The fire beneath this armor is not a joke.','Neither is leaving people homeless for a dead landlord.','Then meet the fire and see which story survives.']},
    'Roadshade Mimic':{opening:['Welcome. Directions are free with purchase. The exit costs extra because people keep using it.','You are wearing a merchant’s smile on a bag full of teeth.','A flexible inventory is the heart of honest commerce.','People on this road have been disappearing after your bargains.','They agreed to the terms. Admittedly, I printed them inside my mouth.'],
      kind:['Let the travelers go. There is enough on the road without feeding on them.','Kindness is a currency I have never learned to keep.','You can learn. Start by opening the path behind you.','Close this shop? Do you know what I paid for roadside signage?','A safe road is worth more than any bargain you made here.','Then let us see what your generosity costs you.'],
      taunt:['I have seen better disguises in a school play.','And yet you walked close enough to admire mine.','I walked close enough to end your little shop.','Bold customers are always the most profitable.','Try charging me. See how the transaction goes.','With pleasure. No refunds once the teeth come out.'],
      roast:['You are a backpack with a mouth pretending to understand economics.','My margins are excellent. Some of the margins have teeth.','Yes, mostly where your disguise is splitting at the seams.','You are being very rude to a local business.','A local business that eats its customers deserves a terrible review.','You may post it from inside the inventory.']},
    'Lucien Redeemed':{opening:['The court is open. The garden is open. The duel is voluntary. I have written all three down.','You did not lock anybody in this time. That is progress.','The invitation specifically says you may leave. Several people asked me to underline it.','People are watching to see whether the new court can defend them.','Then we should give them a fight that does not frighten them away.'],
      kind:['We can show them strength without cruelty. I trust you to remember why we rebuilt.','People trust me again. I have spent the week wondering if they read the right invitation.','You have practiced. I have seen you listen when it was difficult.','Then I will fight well and stop when the duel is done.','That is all I ask. Let them see who you chose to become.','Very well. For once, I would like to be remembered accurately.'],
      taunt:['The old Lucien would have made a speech twice this long.','The new Lucien trained while you were talking.','Good. I was hoping for a challenge instead of a ceremony.','Then perhaps I shall surprise you. With restraint, naturally.','You can surprise me by landing a hit first.','Ah. There is the opponent I was hoping to meet.'],
      roast:['The royal apology tour ends with you challenging me in your own garden?','There are witnesses, a healer, and an agreed stop signal. I am learning restraint in public.','So even your dramatic comeback needed a permission slip.','I had it signed by people whose opinions matter to me.','That is annoyingly wholesome. Your sword stance still needs work.','You can give that criticism while trying to get through it.']},
    'Peacemaker Sentinel':{opening:['This refuge accepts rivals, refugees, and former enemies. It does not accept untested promises.','We built an academy so people could learn without being judged by their past.','My charge is to protect that hope from the next person who speaks well and acts badly.','Then test what I do, not merely what I say.','That is precisely why I stand at the final door.'],
      kind:['I want this place safe for the people who have nowhere else to go.','Compassion can be a shelter. It can also hide a failure to act.','Then I will act when it matters and listen when someone needs room.','A difficult balance for any ruler or teacher.','That is why we practice it together.','Then show me the accord can survive a real challenge.'],
      taunt:['For a peacekeeper, you picked a fairly aggressive entrance exam.','Mercy without strength is an invitation to the cruel.','Then let us find out how strong your principles really are.','I am designed to endure more than clever words.','Good. I brought more than words.','The examination begins. I hope your confidence studied.'],
      roast:['Did someone give the academy a walking lecture with shoulder armor?','My instructions are concise and necessary.','You have blocked one door for five minutes. Even Timmy would call this a long speech.','I am not programmed to appreciate that comparison.','Then you can learn. This is an academy, after all.','Lesson one: do not mistake patience for hesitation.']}
  };
  const baseStartLevel=window.startLevel;
  const reduceMotion=()=>window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let active=false;
  function introKey(hub,enemy){
    const route=state.ng?(state.meta?.ngPlusRouteKey||state.endgame?.routeKey||'ngplus'):'normal';
    return `${route}:${hub}:${enemy}`;
  }
  function sceneFor(enemy){return STORIES[enemy]}
  function createScene(enemy,key){
    const story=sceneFor(enemy),combatScreen=q('#combat');if(!story||!combatScreen){finish();return}
    const overlay=document.createElement('div');overlay.id='bossIntroScene';overlay.className='boss-intro-scene';overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-label',`Conversation with ${enemy}`);
    const playerSrc=(Number(state.hp)<=Number(state.maxHp||1)*.25?combatArmorSources().damaged:combatArmorSources().normal);
    const bossSrc=q('#enemyArt img.monster-sprite')?.getAttribute('src')||q('#enemyArt img')?.getAttribute('src')||'';
    overlay.innerHTML=`<div class="boss-intro-backdrop"></div><div class="boss-intro-night"></div><div class="boss-intro-dim"></div><div class="boss-intro-actor boss-intro-player"><img src="${esc(playerSrc)}" alt="${esc(state.playerName||'Player')}"></div><div class="boss-intro-actor boss-intro-enemy"><img src="${esc(bossSrc)}" alt="${esc(enemy)}"></div><div class="boss-intro-panel"><div class="boss-intro-label"></div><p class="boss-intro-text"></p><div class="boss-intro-choices"></div></div>`;
    overlay.querySelector('.boss-intro-backdrop').style.backgroundImage=getComputedStyle(combatScreen).backgroundImage;
    const night=q('#combatNightLayer'),nightEl=overlay.querySelector('.boss-intro-night');nightEl.style.backgroundImage=night?.style.backgroundImage||'none';nightEl.style.opacity=night?.style.opacity||'0';
    const playerImg=overlay.querySelector('.boss-intro-player img');playerImg.onerror=()=>{playerImg.onerror=null;playerImg.src=combatArmorSources().normal};
    const bossImg=overlay.querySelector('.boss-intro-enemy img');bossImg.onerror=()=>{bossImg.onerror=null;bossImg.style.display='none';const art=q('#enemyArt');if(art)overlay.querySelector('.boss-intro-enemy').appendChild(art.cloneNode(true))};
    const label=overlay.querySelector('.boss-intro-label'),text=overlay.querySelector('.boss-intro-text'),choices=overlay.querySelector('.boss-intro-choices');
    let timer=null,full='',typed=true,next=null,closing=false;
    function completeText(){if(timer){clearInterval(timer);timer=null}text.textContent=full;typed=true;renderButtons()}
    function focus(who){overlay.classList.toggle('boss-intro-player-speaking',who==='player');label.textContent=who==='player'?(state.playerName||'You'):enemy}
    function say(who,line,advance){if(timer)clearInterval(timer);focus(who);full=line;text.textContent='';choices.replaceChildren();typed=false;next=advance||null;
      if(reduceMotion()){completeText();return}
      let i=0;timer=setInterval(()=>{text.textContent=full.slice(0,++i);if(i>=full.length){clearInterval(timer);timer=null;typed=true;renderButtons()}},22);
    }
    function addButton(title,action){const b=document.createElement('button');b.type='button';b.textContent=title;b.onclick=action;choices.appendChild(b)}
    function renderButtons(){choices.replaceChildren();if(next){addButton('Continue',next);return}
      addButton('Kind reply',()=>branch('kind'));addButton('Taunt reply',()=>branch('taunt'));addButton('Roast reply',()=>branch('roast'))}
    function lines(sequence,done,start='enemy'){let i=0;const advance=()=>{if(i<sequence.length)say((i%2===0?start:(start==='enemy'?'player':'enemy')),sequence[i++],advance);else done?.()};advance()}
    function branch(tone){overlay.dataset.tone=tone;lines(story[tone],()=>{choices.replaceChildren();addButton('Begin battle',leave)},'player')}
    function leave(){if(closing)return;closing=true;if(timer)clearInterval(timer);overlay.classList.remove('open');overlay.classList.add('closing');
      const delay=reduceMotion()?0:850;setTimeout(()=>{overlay.remove();state.meta=state.meta||{};state.meta.bossIntroSeen=state.meta.bossIntroSeen||{};state.meta.bossIntroSeen[key]=true;save();finish()},delay)}
    overlay.querySelector('.boss-intro-panel').addEventListener('click',e=>{if(!e.target.closest('button')&&!typed)completeText()});
    game.appendChild(overlay);requestAnimationFrame(()=>overlay.classList.add('open'));
    lines(story.opening,()=>{next=null;renderButtons()});
  }
  function finish(){game.classList.remove('boss-intro-pending');active=false}
  window.startLevel=function(hub,level){
    if(Number(level)!==5||active)return baseStartLevel(hub,level);
    state.meta=state.meta||{};state.meta.bossIntroSeen=state.meta.bossIntroSeen||{};
    const ngStory=state.ng?window.getNgPlusEncounterStory?.(hub,5):null;
    const crownhold=!!(state.ng&&(state.meta.ngPlusRouteKey||state.endgame?.routeKey)==='male-king');
    const expected=crownhold?['Goosecourt Marshal','Thornstag Sovereign','Crown Revenant','Thornmaze Warden','Throne Ascendant'][hub]:state.ng?ngStory?.enemy:['Sir Barnaby','Gloomfang','Lich King Timmy','Minotaur with Anxiety','Monarch Lucien'][hub];
    if(!expected||!STORIES[expected])return baseStartLevel(hub,level);
    const key=introKey(hub,expected);
    if(state.meta.bossIntroSeen[key])return baseStartLevel(hub,level);
    active=true;game.classList.add('boss-intro-pending');
    // Replace the old purple Level 5 story card with the conversation. Preserve all other story beats.
    state.meta.storyArcSeen=state.meta.storyArcSeen||{};
    const storyKey=ngStory?`ng:${ngStory.routeKey}:${hub}:5`:`${hub}:5`;
    state.meta.storyArcSeen[storyKey]=true;save();
    try{baseStartLevel(hub,level)}catch(error){finish();throw error}
    let attempts=0;
    const awaitCombat=()=>{
      if(q('#combat')?.classList.contains('active')&&combat?.boss){
        const actual=introKey(hub,combat.enemy);
        setTimeout(()=>{if(active&&q('#combat')?.classList.contains('active'))createScene(combat.enemy,actual);else finish()},reduceMotion()?0:1000);
      }else if(++attempts<240)requestAnimationFrame(awaitCombat);else finish();
    };
    requestAnimationFrame(awaitCombat);
  };
  // Inputs are ignored throughout the preview and conversation; combat begins after the fade back.
  document.addEventListener('keydown',e=>{if(active&&['1','2','3'].includes(e.key)){e.preventDefault();e.stopImmediatePropagation()}},true);
  game.addEventListener('click',e=>{if(active&&e.target.closest('#combat .card,#retreatBtn')){e.preventDefault();e.stopImmediatePropagation()}},true);
  const oldPlay=window.playCard;if(oldPlay)window.playCard=function(...args){if(active)return;return oldPlay.apply(this,args)};
  window.BossIntroDialogue={seen:()=>state.meta?.bossIntroSeen||{},stories:STORIES};
})();
