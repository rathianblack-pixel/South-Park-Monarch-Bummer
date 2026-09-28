/* Interior conversations sit over the existing service and quest handlers. */
(()=>{
'use strict';
const $=s=>document.querySelector(s),room=$('#interior'),game=$('.game');if(!room||!game||!window.openFacility)return;
const LINES={
 "cathedral": {
  "greet": [
   "Oh. You're alive. The bell-ringer owes me three coins.",
   "Wipe your boots. That floor survived two kings and one extremely wet goose.",
   "Please tell me the rattling is your armor and not another cursed jar.",
   "A candle went out when you walked in. I'm charging the candle for being dramatic.",
   "I prayed for a quiet morning. You arrived before the amen.",
   "Sit if you need to. The bench won't ask where you've been.",
   "A guard left a curse here. If you recognize it, please collect it.",
   "We've got water, bandages, and one broom everyone pretends not to see."
  ],
  "talk": [
   "No. And before you ask, the box full of teeth was not the reliquary.",
   "They say it outranks them. I said a bell can't give orders.",
   "I did not hear a goose's confession.",
   "He asked me to make the funerals quieter.",
   "Yes. Someone told them it was Thursday. It's Tuesday.",
   "No.",
   "He says the toll figures need divine protection.",
   "He claims everyone signed in before entering."
  ],
  "service": [
   "Sit down. You're bleeding on the hymn book.",
   "Healing first. Lie about how it happened afterward.",
   "Prayer is free. Supplies aren't. The bandages keep sending invoices.",
   "Hold still. The light isn't trying to catch you.",
   "I can lift the curse. The decision that earned it is beyond my training.",
   "You're healthy. Please don't invent a symptom to avoid the village.",
   "You brought mud, two thorns, and an ailment. Which one hurts?",
   "Pick what you need. I have one clean towel and three people asking for it."
  ],
  "quest": [
   "The board has work. Yes, somebody filed a complaint against the goose.",
   "Read the request. Last week someone delivered five mushrooms to a funeral.",
   "The kitchen says urgent. It also says that when the soup is cold.",
   "A grave needs fixing. Please check the name before you start digging.",
   "Some requests have no names. The people still need help.",
   "I corrected the spelling. I left the accusations exactly as written.",
   "Finish a job and tell me. I cannot hear a completed quest through a wall.",
   "The bell needs repair again. It knows what it did."
  ]
 },
 "blacksmith": {
  "greet": [
   "You're back. Put the weapon down before you tell me it did that itself.",
   "That rattle had better be armor. I don't sell replacement knees.",
   "I can fix the dent. You can explain how a door won the fight.",
   "Don't lean on the anvil. It's already holding up the apprentice's career.",
   "All your fingers are here. Good. The forms only have ten boxes.",
   "Come in. The forge is hot, and the apprentice is pretending to be busy.",
   "Who hit your shield with a door? Actually, let me guess who lost.",
   "I smelled burnt steel. Then you walked in. That answered one question."
  ],
  "talk": [
   "I carved HOLD HERE beside the handle.",
   "He wanted a coin slot cut through the center.",
   "There's a royal crest on the side nobody sees.",
   "Left shoulder says stairs. Right hip says more stairs.",
   "He's named it. Hasn't forged it.",
   "Every day. Their tools actually get used.",
   "He says visitors keep opening it.",
   "Guards hang packs off the latch."
  ],
  "upgrade": [
   "Put it here. If it bites me, the price goes up.",
   "More damage, same handle. Please keep hold of the handle.",
   "I can improve the focus. Keep those sparks away from my beard.",
   "Materials are ready. Your coin purse sounds less confident.",
   "A sharper edge won't make a crate a worthy opponent.",
   "This upgrade improves damage. Your aim is still your own problem.",
   "Give me a minute. The metal has to stop arguing with the heat.",
   "It's stronger. Test it outside. The door did nothing to you."
  ],
  "armor": [
   "Turn around. The back plate quit before you did.",
   "That seam is held together by fear of disappointing me.",
   "Stand still. I'm measuring the armor. Your ego won't fit the calipers.",
   "One bone and some coins. No, I won't tell you whose bone.",
   "This stops more damage. It won't stop you walking into traps.",
   "Your straps survived? I owe the apprentice an apology and a coin.",
   "I can add a plate. You can still fit through the door.",
   "The rivet is hot. You heard the word hot, yes?"
  ],
  "quest": [
   "The board wants materials. A dramatic injury is not a material.",
   "The gate broke again. The guard says it attacked first.",
   "Rewards are written in chalk. Stop haggling with the chalk.",
   "The forge needs supplies. The village needs the forge. It's a stupid circle.",
   "Bring the broken thing here. A sound impression doesn't help me.",
   "Yes, the job pays. No, I can't pay you in swords.",
   "The guards filed three repair requests for the same dent.",
   "Finish a job, then bring proof I can actually hold."
  ]
 },
 "merchant": {
  "greet": [
   "Welcome. Pay before you test whether the bottle is drinkable.",
   "You're back. I practiced looking surprised. How was that?",
   "The shop is open. That crate is not. We're both happier this way.",
   "Prices are on the tags. My handwriting is bad, not negotiable.",
   "You look like you wrote your shopping list during a fight.",
   "Come in. I moved the breakables behind the things you can afford.",
   "You can look without coins. You cannot juggle without coins.",
   "I restocked at dawn. The boxes filed a complaint about the road."
  ],
  "talk": [
   "It put a stamped decree on the counter and took my lunch.",
   "Only while buying nails from me.",
   "A ranger returned one tied to an arrow.",
   "A man asked for good judgment. I gave him water and told him to go home.",
   "Enough to light the whole road.",
   "Yes. DO NOT OPEN is our most popular label.",
   "No. And yes, I care about the drivers too.",
   "My ledger says excellent."
  ],
  "shop": [
   "Buy medicine before the heroic injury for once.",
   "Spellbooks left. Edible things right. Do not confuse them.",
   "Your promise to pay me later has been declined by the ledger.",
   "Useful supplies here. Unexplained noises on the other shelf.",
   "I labeled the antidotes after a customer drank the demonstration sample.",
   "Everything survived shipping. The driver wants that claim in writing.",
   "I can recommend an item. I cannot make you remember to use it.",
   "Pay before trying the magic. Last time the shelf tried you back."
  ],
  "quest": [
   "Deliveries are on the board. The maze order includes a map and an apology.",
   "One crate is missing. The driver returned with only the excuse.",
   "The reward is written down. We are done arguing about the decimal point.",
   "Some customers need help more than another sales pitch. I know, shocking.",
   "These jobs came with the caravans. The wagons were less demanding.",
   "Bring proof. I once paid a man for a rumor he invented outside.",
   "It says urgent. The ink is dry, so it can wait for you to read it.",
   "Finish a job and tell me before gossip tries to claim the commission."
  ]
 },
 "home": {
  "thought": [
   "Home. Nobody stole the chair. Low standards, good news.",
   "I should rest before the armor files a complaint.",
   "Quiet. If the floor starts talking, I'm leaving.",
   "I own twelve weapons and one chair that doesn't wobble.",
   "Those trophies can dust themselves. I earned that much.",
   "I could sort my supplies. I could also sit here and not die.",
   "The armor doll stands straighter than I do. Show-off.",
   "I left looking heroic. I returned needing soup."
  ]
 }
};
/* Each topic matches the same index in LINES[type].talk. The opening and five
   follow-ups keep the player's response tied to what that NPC actually said. */
const TALK_EXCHANGES={
 "cathedral": [
  [
   "Father, did anybody find that reliquary thing?",
   [
    "player",
    "You said it was holy stuff."
   ],
   [
    "npc",
    "I said it contained holy relics."
   ],
   [
    "player",
    "Teeth can be holy."
   ],
   [
    "npc",
    "Not those teeth."
   ],
   [
    "player",
    "How do you know?"
   ],
   [
    "npc",
    "Because one of them still had a gold filling."
   ],
   [
    "player",
    "Maybe he was a rich saint."
   ],
   [
    "npc",
    "There are no rich saints."
   ],
   [
    "player",
    "That doesn't sound right."
   ],
   [
    "npc",
    "It isn't. But I'm tired and the reliquary is still missing."
   ],
   [
    "player",
    "Okay, so what am I looking for?"
   ],
   [
    "npc",
    "Small wooden box. Silver cross. Very old. Extremely sacred. Ideally containing zero unidentified human teeth."
   ],
   [
    "player",
    "That's gonna narrow it down a lot."
   ],
   [
    "npc",
    "God willing."
   ]
  ],
  [
   "Why are the guards saluting the bell?",
   [
    "player",
    "Can it?"
   ],
   [
    "npc",
    "No. It can make noise. There's a difference."
   ],
   [
    "player",
    "Their captain makes noise."
   ],
   [
    "npc",
    "I realize that. I did not say it to his face."
   ],
   [
    "player",
    "Maybe the bell should be captain."
   ],
   [
    "npc",
    "It has attended every watch and never asked for a raise."
   ],
   [
    "player",
    "You've thought about this."
   ],
   [
    "npc",
    "I live beneath it. I have a lot of time between rings."
   ]
  ],
  [
   "Father, somebody said you heard a goose's confession.",
   [
    "player",
    "So there wasn't a goose?"
   ],
   [
    "npc",
    "Oh, there was absolutely a goose."
   ],
   [
    "player",
    "In the confession booth?"
   ],
   [
    "npc",
    "For twenty minutes."
   ],
   [
    "player",
    "What did it confess?"
   ],
   [
    "npc",
    "Honking."
   ],
   [
    "player",
    "That's it?"
   ],
   [
    "npc",
    "Honking, biting, more honking. Then it became aggressive when I prescribed three Hail Marys."
   ],
   [
    "player",
    "Maybe it's Protestant."
   ],
   [
    "npc",
    "Don't start."
   ],
   [
    "player",
    "Did you forgive it?"
   ],
   [
    "npc",
    "It stole the collection plate."
   ],
   [
    "player",
    "So no?"
   ],
   [
    "npc",
    "Forgiveness is between the goose and God now."
   ],
   [
    "player",
    "Because of the stealing?"
   ],
   [
    "npc",
    "Because I'm not chasing that bastard again."
   ]
  ],
  [
   "How is Oddo doing?",
   [
    "player",
    "Aren't funerals usually quiet?"
   ],
   [
    "npc",
    "One nephew brought a trumpet. He said his uncle loved music."
   ],
   [
    "player",
    "Did his uncle?"
   ],
   [
    "npc",
    "His uncle left a written request for silence."
   ],
   [
    "player",
    "Did you tell the nephew?"
   ],
   [
    "npc",
    "Yes. Oddo wanted the trumpet buried next to him."
   ],
   [
    "player",
    "Did you do it?"
   ],
   [
    "npc",
    "No. The cemetery has enough things coming back."
   ]
  ],
  [
   "Still feeding travelers?",
   [
    "player",
    "Just tell them."
   ],
   [
    "npc",
    "I did. They asked whether the soup was already made."
   ],
   [
    "player",
    "Was it?"
   ],
   [
    "npc",
    "Yes. I wasn't going to throw it away to prove a calendar right."
   ],
   [
    "player",
    "Fair enough."
   ],
   [
    "npc",
    "Good. You can wash the bowls."
   ],
   [
    "player",
    "I didn't volunteer."
   ],
   [
    "npc",
    "Neither did Tuesday."
   ]
  ],
  [
   "Father, can prayer actually fix the church roof?",
   [
    "player",
    "Wow. That was fast."
   ],
   [
    "npc",
    "I've had this conversation three times today."
   ],
   [
    "player",
    "But you're a priest."
   ],
   [
    "npc",
    "Yes."
   ],
   [
    "player",
    "And prayer is your whole thing."
   ],
   [
    "npc",
    "Prayer is not roofing."
   ],
   [
    "player",
    "Have you tried?"
   ],
   [
    "npc",
    "Of course I've tried! I stood right there, prayed for ten minutes, and then a piece of ceiling hit me."
   ],
   [
    "player",
    "Maybe that was God's answer."
   ],
   [
    "npc",
    "Then God wants us to buy shingles."
   ],
   [
    "player",
    "What about the guy with the ladder?"
   ],
   [
    "npc",
    "He refuses to climb up because he says God will protect the church."
   ],
   [
    "player",
    "Didn't God just throw the ceiling at you?"
   ],
   [
    "npc",
    "That's what I fucking told him."
   ],
   [
    "player",
    "So... ladder?"
   ],
   [
    "npc",
    "Ladder."
   ]
  ],
  [
   "Why did Barnaby want his ledger blessed?",
   [
    "player",
    "From thieves?"
   ],
   [
    "npc",
    "From anyone who can add."
   ],
   [
    "player",
    "Could you bless it?"
   ],
   [
    "npc",
    "I could bless a brick. That wouldn't make it honest."
   ],
   [
    "player",
    "What did you bless?"
   ],
   [
    "npc",
    "The bridge. People actually need that."
   ],
   [
    "player",
    "Did Barnaby mind?"
   ],
   [
    "npc",
    "He asked me to pay a toll on the way back."
   ]
  ],
  [
   "What's Timmy's cemetery guest list?",
   [
    "player",
    "Even the dead?"
   ],
   [
    "npc",
    "He copied their names off the stones."
   ],
   [
    "player",
    "How can you tell?"
   ],
   [
    "npc",
    "One form says 'Mr. Skeleton.'"
   ],
   [
    "player",
    "Subtle."
   ],
   [
    "npc",
    "Don't sign anything near that crypt."
   ],
   [
    "player",
    "Why?"
   ],
   [
    "npc",
    "He has a blank line reserved for the living."
   ]
  ]
 ],
 "blacksmith": [
  [
   "Still teaching guards how to hold shields?",
   [
    "player",
    "Did it work?"
   ],
   [
    "npc",
    "One of them tried reading it from the front."
   ],
   [
    "player",
    "Through the shield?"
   ],
   [
    "npc",
    "Yes. While holding it backward."
   ],
   [
    "player",
    "How are they alive?"
   ],
   [
    "npc",
    "The armor is thick. I made that too."
   ],
   [
    "player",
    "That sounds exhausting."
   ],
   [
    "npc",
    "I have considered putting handles on both sides."
   ]
  ],
  [
   "Did Barnaby order his shield here?",
   [
    "player",
    "Where a sword would go?"
   ],
   [
    "npc",
    "I mentioned that. He asked for a smaller slot."
   ],
   [
    "player",
    "Small enough for coins?"
   ],
   [
    "npc",
    "Small enough for nothing. He called it secure."
   ],
   [
    "player",
    "Did you build it?"
   ],
   [
    "npc",
    "No. I make shields, not invitations to get stabbed."
   ]
  ],
  [
   "What's ceremonial about a fortress hinge?",
   [
    "player",
    "Does it work better?"
   ],
   [
    "npc",
    "It squeaks like a regular hinge."
   ],
   [
    "player",
    "Then why buy it?"
   ],
   [
    "npc",
    "The quartermaster says the door deserves dignity."
   ],
   [
    "player",
    "The door?"
   ],
   [
    "npc",
    "The crown. The door's apparently just renting it."
   ]
  ],
  [
   "Can you tell where these dents came from?",
   [
    "player",
    "Tactical roll."
   ],
   [
    "npc",
    "Down eleven steps?"
   ],
   [
    "player",
    "I landed on the twelfth."
   ],
   [
    "npc",
    "The helmet says you fought a door."
   ],
   [
    "player",
    "It was locked."
   ],
   [
    "npc",
    "Doors do that. I can repair the armor, not your story."
   ]
  ],
  [
   "How's the apprentice's legendary sword?",
   [
    "player",
    "What's it called?"
   ],
   [
    "npc",
    "The Final Judgment of a Thousand Suns."
   ],
   [
    "player",
    "How's his metalwork?"
   ],
   [
    "npc",
    "He bent three nails making a fourth."
   ],
   [
    "player",
    "Start with a legendary nail."
   ],
   [
    "npc",
    "Don't. He'll spend another week naming it."
   ]
  ],
  [
   "Do farmers bring you much work?",
   [
    "player",
    "Nobody names the tools?"
   ],
   [
    "npc",
    "One did. The Earth-Sundering Spade of Turnips."
   ],
   [
    "player",
    "Did it earth-sunder?"
   ],
   [
    "npc",
    "It broke on a carrot."
   ],
   [
    "player",
    "Tough carrot."
   ],
   [
    "npc",
    "He asked me to forge armor for it. The carrot."
   ]
  ],
  [
   "Did Timmy order an inside lock for his coffin?",
   [
    "player",
    "Couldn't he use a sign?"
   ],
   [
    "npc",
    "His sign says ENTER AT YOUR PERIL."
   ],
   [
    "player",
    "That's an invitation."
   ],
   [
    "npc",
    "I told him. He requested a scarier font."
   ],
   [
    "player",
    "Did you make the lock?"
   ],
   [
    "npc",
    "No. I have enough trouble with customers who breathe."
   ]
  ],
  [
   "Why does the village gate keep sticking?",
   [
    "player",
    "Tell them to stop."
   ],
   [
    "npc",
    "I put up a sign. They hung a pack on it."
   ],
   [
    "player",
    "Make a hook."
   ],
   [
    "npc",
    "I made three. They said the hooks looked too official."
   ],
   [
    "player",
    "What's next?"
   ],
   [
    "npc",
    "A hook shaped like a guard captain. Maybe they'll salute it."
   ]
  ]
 ],
 "merchant": [
  [
   "Did the goose try to pay with a royal decree?",
   [
    "player",
    "That's theft."
   ],
   [
    "npc",
    "It had a stamp. Apparently that's taxation."
   ],
   [
    "player",
    "Why keep the decree?"
   ],
   [
    "npc",
    "If it returns, I want evidence it owes me a sandwich."
   ],
   [
    "player",
    "You'd invoice a goose?"
   ],
   [
    "npc",
    "I'd invoice anybody. Collection is the hard part."
   ]
  ],
  [
   "Does the blacksmith complain about your prices?",
   [
    "player",
    "He called the prices theater."
   ],
   [
    "npc",
    "Then he should stop attending the matinee."
   ],
   [
    "player",
    "Do you charge him more?"
   ],
   [
    "npc",
    "Only when he demands a better seat."
   ],
   [
    "player",
    "This is a shop."
   ],
   [
    "npc",
    "Tell him. He keeps asking for an intermission."
   ]
  ],
  [
   "How's your maze map selling?",
   [
    "player",
    "Where was the ranger?"
   ],
   [
    "npc",
    "That was the problem. The note said YOUR NORTH IS LYING."
   ],
   [
    "player",
    "Was it?"
   ],
   [
    "npc",
    "Rain made the ink run. North moved into a pond."
   ],
   [
    "player",
    "Refund him."
   ],
   [
    "npc",
    "I offered. Another arrow came back saying FIX THE MAP."
   ]
  ],
  [
   "Do you sell anything for bad decisions?",
   [
    "player",
    "Did he?"
   ],
   [
    "npc",
    "He bought another bottle for his horse."
   ],
   [
    "player",
    "Why the horse?"
   ],
   [
    "npc",
    "Apparently it wanted to enter the maze."
   ],
   [
    "player",
    "The horse needs the water more."
   ],
   [
    "npc",
    "That's what I told him. He asked for a barrel."
   ]
  ],
  [
   "Why so many fortress candles?",
   [
    "player",
    "Maybe a ceremony?"
   ],
   [
    "npc",
    "Then why did they order fireproof curtains?"
   ],
   [
    "player",
    "That sounds sensible."
   ],
   [
    "npc",
    "They canceled the bucket order to afford them."
   ],
   [
    "player",
    "I take it back."
   ],
   [
    "npc",
    "I'm keeping my own bucket."
   ]
  ],
  [
   "Is the dangerous shelf marked?",
   [
    "player",
    "What happens if I open one?"
   ],
   [
    "npc",
    "Last customer hasn't come back to explain."
   ],
   [
    "player",
    "Maybe he moved away."
   ],
   [
    "npc",
    "His boots are still here."
   ],
   [
    "player",
    "Why don't you check?"
   ],
   [
    "npc",
    "I can read labels. That's why I still have boots."
   ]
  ],
  [
   "Are the caravan roads safe?",
   [
    "player",
    "I was going to ask about sales."
   ],
   [
    "npc",
    "Dead customers don't return. Neither do frightened ones."
   ],
   [
    "player",
    "Still a business answer."
   ],
   [
    "npc",
    "It can be two things. I know their names."
   ],
   [
    "player",
    "Then help protect them."
   ],
   [
    "npc",
    "I paid the guards. Now I'd like them to meet a cart."
   ]
  ],
  [
   "How's business?",
   [
    "player",
    "Your shelves say otherwise."
   ],
   [
    "npc",
    "Only one crate arrived. It contained another ledger."
   ],
   [
    "player",
    "Why order that?"
   ],
   [
    "npc",
    "To track the missing crates. Don't say it."
   ],
   [
    "player",
    "Order supplies instead."
   ],
   [
    "npc",
    "I knew you'd say it. The first ledger says so."
   ]
  ]
 ]
};

const names={cathedral:'Priest',blacksmith:'Blacksmith',merchant:'Merchant',home:'Your thoughts'};
const labels={cathedral:[['Talk','talk'],['Services','service'],['Quests','quest'],['Leave','leave']],blacksmith:[['Talk','talk'],['Upgrade '+(state.gear==='magic'?'Magic':'Weapon'),'upgrade'],['Upgrade Armor','armor'],['Quests','quest'],['Leave','leave']],merchant:[['Talk','talk'],['Shop','shop'],['Quests','quest'],['Leave','leave']],home:[['Rest','rest'],['Codex','codex'],['Settings','settings'],['Leave','leave']]};
const spoken={service:"I need help. Yes, the kind that costs money. Let's hear the damage.",quest:"What's on the board? Please say the goose isn't hiring again.",shop:"What have you got that won't bite me after I pay for it?",upgrade:"Can this hit harder? I promise to use the handle this time.",armor:"Can you fix this seam before the next monster notices it?",rest:"I'm going to sleep until my armor and I stop making the same noise.",codex:"I should read my notes before I meet that thing again and call it a goose.",settings:"I should change the battle settings before blaming the buttons again."};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const reduceMotion=()=>window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
function pick(type,topic,withIndex=false){
 const lines=LINES[type]?.[topic]||[];if(!lines.length)return '';
 state.meta=state.meta||{};const recent=state.meta.interiorDialogueRecent=state.meta.interiorDialogueRecent||{},key=`${type}:${topic}`,used=Array.isArray(recent[key])?recent[key]:[];
 const available=lines.map((_,i)=>i).filter(i=>!used.includes(i));const pool=available.length?available:lines.map((_,i)=>i);const index=pool[Math.floor(Math.random()*pool.length)];recent[key]=available.length?[...used,index]:[index];save();return withIndex?{line:lines[index],index}:lines[index];
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
function playTalkFollowups(type,lines,index=0){
 if(index>=lines.length){mainMenu();return}
 const [speaker,line]=lines[index];say(speaker,line,()=>playTalkFollowups(type,lines,index+1),type);
}
function choose(type,action){
 if(action==='leave'){sourceAction('leave');return}
 if(action==='talk'&&type!=='home'){
   const selected=pick(type,'talk',true),[opener,...followups]=TALK_EXCHANGES[type]?.[selected.index]||[];
   if(!opener){mainMenu();return}
   say('player',opener,()=>say('npc',selected.line,()=>playTalkFollowups(type,followups),type),type);
   return;
 }
 const playerLine=spoken[action]||'I would like to take a look.';
 if(type==='home'){
   say('player',playerLine,()=>{if(action==='rest')say('player','A little sleep might make the next terrible decision feel better.',()=>openCategory(type,action),type);
     else if(action==='doll'||action==='trophies'||action==='codex')openCategory(type,action);
     else say('player','I can change this before the next fight.',()=>openCategory(type,action),type)},type);return;
 }
 say('player',playerLine,()=>{
   const line=pick(type,action);
   say('npc',line,()=>{
     openCategory(type,action);
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
