/*
 * The Demon's Lord Bummer — game logic
 * Extracted from the latest standalone build.
 * Keep this file beside index.html.
 */

const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)]; window.updateUtilityDock=window.updateUtilityDock||(()=>{});
const ASSETS={"Fire Focus":"Textures/Player/Equipment/fire-focus.png","Iron Sword":"Textures/Player/Equipment/iron-sword.png","Light Focus":"Textures/Player/Equipment/light-focus.png","Water Focus":"Textures/Player/Equipment/water-focus.png","Wooden Bow":"Textures/Player/Equipment/wooden-bow.png","Cursed Timberwolf":"Textures/Monsters/cursed-timberwolf.png","Daedric Knight":"Textures/Monsters/daedric-knight.png","Dark Sorcerer":"Textures/Monsters/dark-sorcerer.png","Gargoyle":"Textures/Monsters/gargoyle.png","Gloomfang the Cursed Timberwolf":"Textures/Monsters/gloomfang-the-cursed-timberwolf.png","Grave Wraith":"Textures/Monsters/grave-wraith.png","Lich King Timmy":"Textures/Monsters/lich-king-timmy.png","Minotaur with Anxiety":"Textures/Monsters/minotaur-with-anxiety.png","Moldy Mummy":"Textures/Monsters/moldy-mummy.png","Monarch Lucien":"Textures/Monsters/monarch-lucien.png","Necromancer Apprentice":"Textures/Monsters/necromancer-apprentice.png","Rabid racoon":"Textures/Monsters/rabid-racoon.png","Skeleton Archer":"Textures/Monsters/skeleton-archer.png","Throne Warden":"Textures/Monsters/throne-warden.png","angry goose":"Textures/Monsters/angry-goose.png","bullying sprite":"Textures/Monsters/bullying-sprite.png","drunk peasant":"Textures/Monsters/drunk-peasant.png","goblin poacher":"Textures/Monsters/goblin-poacher.png","sir barnaby":"Textures/Monsters/sir-barnaby.png","slime rat":"Textures/Monsters/slime-rat.png","zombie wolf":"Textures/Monsters/zombie-wolf.png","MALE_01_Placenta_Creek_Scrapper":"Textures/Player/Armor/male-01-placenta-creek-scrapper.png","MALE_02_Goblinhide_Raider":"Textures/Player/Armor/male-02-goblinhide-raider.png","MALE_03_Gravebone_Sentinel":"Textures/Player/Armor/male-03-gravebone-sentinel.png","MALE_05_Daedric_Bummerlord":"Textures/Player/Armor/male-05-daedric-bummerlord.png","MALE_04_Runeplate_Delver":"Textures/Player/Armor/male-04-runeplate-delver.png","FEMALE_03_Graveveil_Warden":"Textures/Player/Armor/female-03-graveveil-warden.png","FEMALE_05_Monarchs_Eclipse":"Textures/Player/Armor/female-05-monarchs-eclipse.png","FEMALE_01_Placenta_Creek_Wayfarer":"Textures/Player/Armor/female-01-placenta-creek-wayfarer.png","FEMALE_04_Runebloom_Battlemage":"Textures/Player/Armor/female-04-runebloom-battlemage.png","FEMALE_02_Moonleaf_Huntress":"Textures/Player/Armor/female-02-moonleaf-huntress.png"};
const ASSET_META={"Fire Focus":[141,63,322,421],"Iron Sword":[203,73,272,401],"Light Focus":[136,120,340,372],"Water Focus":[131,123,348,376],"Wooden Bow":[214,71,301,404],"angry goose":[149,103,338,391],"bullying sprite":[175,130,325,346],"Cursed Timberwolf":[109,62,366,422],"Daedric Knight":[105,45,367,429],"Dark Sorcerer":[122,102,372,413],"drunk peasant":[139,58,342,420],"Gargoyle":[116,102,367,392],"Gloomfang the Cursed Timberwolf":[105,42,369,451],"goblin poacher":[103,60,362,394],"Grave Wraith":[126,63,361,426],"Lich King Timmy":[118,66,368,430],"Minotaur with Anxiety":[108,34,384,438],"Moldy Mummy":[118,76,355,437],"Monarch Lucien":[129,70,355,432],"Necromancer Apprentice":[122,91,365,409],"Rabid racoon":[102,101,376,397],"sir barnaby":[91,39,392,445],"Skeleton Archer":[147,71,340,440],"slime rat":[110,131,381,378],"Throne Warden":[106,19,382,441],"zombie wolf":[128,63,340,406]};

const ARMOR_SETS={male:['MALE_01_Placenta_Creek_Scrapper','MALE_02_Goblinhide_Raider','MALE_03_Gravebone_Sentinel','MALE_04_Runeplate_Delver','MALE_05_Daedric_Bummerlord'],female:['FEMALE_01_Placenta_Creek_Wayfarer','FEMALE_02_Moonleaf_Huntress','FEMALE_03_Graveveil_Warden','FEMALE_04_Runebloom_Battlemage','FEMALE_05_Monarchs_Eclipse']};
const ARMOR_NAMES=['Placenta Creek starter set','Goblinhide Raider','Gravebone Sentinel','Runeplate Delver','Daedric Bummerlord'];
const SIDE_ARMOR_NAMES=['Choirguard Vestments', 'Forgeheart Plate', 'Gilded Bargainer', 'Roadkeeper’s Cloak', 'Village Defender', 'Grave Lantern Keeper', 'Maze Cartographer', 'Thronebreaker Regalia'];
ARMOR_NAMES.push(...SIDE_ARMOR_NAMES);
const BUILDING_BACKGROUNDS={"cathedral":"Textures/Buildings/cathedral.png","blacksmith":"Textures/Buildings/blacksmith.png","merchant":"Textures/Buildings/merchant.png","home":"Textures/Buildings/house.png"};
const LEGACY_INTERIORS={"cathedral":"Textures/Maps/Interiors/cathedral.jpg","blacksmith":"Textures/Maps/Interiors/blacksmith.jpg","merchant":"Textures/Maps/Interiors/merchant.jpg","home":"Textures/Maps/interior-backdrop.jpg"};
const screens=$$('.screen'); let sceneFadeToken=0;
const show=id=>{
 const previous=screens.find(x=>x.classList.contains('active')),next=$('#'+id),fade=$('#fadeTransition');
 const changing=previous&&next&&previous!==next;
 screens.forEach(x=>{x.classList.remove('transition-old');x.style.zIndex=''});
 screens.forEach(x=>x.classList.toggle('active',x.id===id));
 if(changing&&fade&&!fade.classList.contains('active')){
  const token=++sceneFadeToken;
  previous.classList.add('transition-old');previous.style.zIndex='39';
  fade.classList.add('scene-fade');
  requestAnimationFrame(()=>fade.classList.add('scene-fade-cover'));
  setTimeout(()=>{if(token!==sceneFadeToken)return;previous.classList.remove('transition-old');previous.style.zIndex='';fade.classList.remove('scene-fade-cover');setTimeout(()=>{if(token===sceneFadeToken)fade.classList.remove('scene-fade')},380)},340);
 }
 state.screen=id; save();setTimeout(()=>{syncMusic?.();updateUtilityDock?.()},0)
};
const state=JSON.parse(localStorage.getItem('demonBummerState')||'null')||{screen:'start',playerName:'Kuro',gender:'male',gear:'sword',affinity:'water',hp:30,maxHp:30,coins:24,hub:0,stage:0,ng:false,won:false,materials:{leather:2,bones:0,steel:0},furniture:[],weaponLevel:0,armorLevel:0,progress:[0,0,0,0,0],maxHub:0,combatSpeed:'normal',armorSets:{male:0,female:0},unlockedArmor:{male:[0],female:[0]}};
state.combatSpeed=['slow','normal','fast'].includes(state.combatSpeed)?state.combatSpeed:'normal';
state.meta=state.meta||{};state.meta.dialogSeen=state.meta.dialogSeen||{};state.meta.questProgress=state.meta.questProgress||{};state.meta.questProgress.wins=state.meta.questProgress.wins||0;state.meta.relationships=state.meta.relationships||{};state.meta.questsDone=Array.isArray(state.meta.questsDone)?state.meta.questsDone:[];state.meta.quests=state.meta.quests||{};state.meta.visited=Array.isArray(state.meta.visited)?state.meta.visited:[];state.meta.statuses=Array.isArray(state.meta.statuses)?state.meta.statuses:[];state.meta.cardUpgrades=state.meta.cardUpgrades||{};state.meta.armorRewardsClaimed=state.meta.armorRewardsClaimed||{};state.meta.buildingQuestState=state.meta.buildingQuestState||{};
function ensureCombatResources(){state.meta=state.meta||{};state.meta.items=state.meta.items||{};const legacyPotion=Number(state.meta.items.potion||0);state.meta.items.drumstick=Number(state.meta.items.drumstick??legacyPotion);state.meta.items.midPotion=Number(state.meta.items.midPotion||0);state.meta.items.highPotion=Number(state.meta.items.highPotion||0);state.meta.items.antidote=Number(state.meta.items.antidote||0);state.meta.items.cursebreaker=Number(state.meta.items.cursebreaker||0);delete state.meta.items.potion;state.meta.spells=state.meta.spells||{};state.meta.spells.heal=!!state.meta.spells.heal;state.meta.spells.purify=!!state.meta.spells.purify}
ensureCombatResources();
const DEBUG_RUNTIME={godMode:false,maxResources:false,resourceSnapshot:null};window.__debugFlags=DEBUG_RUNTIME;
function save(){const d=window.__debugFlags,max=d?.maxResources&&d.resourceSnapshot;if(max){state.coins=max.coins;state.materials={...max.materials}}localStorage.setItem('demonBummerState',JSON.stringify(state));if(max){state.coins=Number.MAX_SAFE_INTEGER;state.materials={leather:Number.MAX_SAFE_INTEGER,bones:Number.MAX_SAFE_INTEGER,steel:Number.MAX_SAFE_INTEGER}}}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function normAsset(s){return String(s||'').toLowerCase().replace(/[^a-z0-9]/g,'')}
const ASSET_ALIASES={'rabidraccoon':'Rabid racoon','gloomfang':'Gloomfang'};
function asset(key){let n=normAsset(key),alias=ASSET_ALIASES[n];if(alias)return ASSETS[alias]||'';let k=Object.keys(ASSETS).find(x=>normAsset(x)===n);return k?ASSETS[k]:''}
function equippedArmorName(){ensureProgress();let idx=Math.max(0,Math.min(ARMOR_SETS[state.gender].length-1,Number(state.armorSets[state.gender]||0)));return ARMOR_SETS[state.gender][idx]}
const EMBEDDED_DAMAGED_ARMOR={"MALE_01_Placenta_Creek_Scrapper":"Textures/Player/Armor/male-01-placenta-creek-scrapper-damaged.png","MALE_02_Goblinhide_Raider":"Textures/Player/Armor/male-02-goblinhide-raider-damaged.png","MALE_03_Gravebone_Sentinel":"Textures/Player/Armor/male-03-gravebone-sentinel-damaged.png","MALE_04_Runeplate_Delver":"Textures/Player/Armor/male-04-runeplate-delver-damaged.png","MALE_05_Daedric_Bummerlord":"Textures/Player/Armor/male-05-daedric-bummerlord-damaged.png","FEMALE_01_Placenta_Creek_Wayfarer":"Textures/Player/Armor/female-01-placenta-creek-wayfarer-damaged.png","FEMALE_02_Moonleaf_Huntress":"Textures/Player/Armor/female-02-moonleaf-huntress-damaged.png","FEMALE_03_Graveveil_Warden":"Textures/Player/Armor/female-03-graveveil-warden-damaged.png","FEMALE_04_Runebloom_Battlemage":"Textures/Player/Armor/female-04-runebloom-battlemage-damaged.png","FEMALE_05_Monarchs_Eclipse":"Textures/Player/Armor/female-05-monarchs-eclipse-variant-damaged.png"};
const EMBEDDED_SIDE_ARMOR={};
for(const gender of ["male","female"]){const slugs={"male": ["choirguard", "forgeheart", "bargainer", "roadkeeper", "village", "grave", "cartographer", "thronebreaker"], "female": ["choirguard", "forgeheart", "bargainer", "roadkeeper", "village", "grave", "maze", "thronebreaker"]}[gender];slugs.forEach((slug,i)=>{const key=`${gender.toUpperCase()}_SIDE_${i+5}`,src=`Textures/Player/Armor/Side/${gender}-${slug}.png`;ARMOR_SETS[gender].push(key);ASSETS[key]=src;EMBEDDED_SIDE_ARMOR[key]=src.replace(/\.png$/i,"-damaged.png")})}
Object.assign(EMBEDDED_DAMAGED_ARMOR,EMBEDDED_SIDE_ARMOR);
function combatArmorSources(){let key=equippedArmorName(),normal=asset(key),damaged=EMBEDDED_DAMAGED_ARMOR[key]||normal.replace(/\.png$/i,'-damaged.png');return {normal,damaged}}
function refreshHouseCharacter(){
  const interior=$('#interior'),img=$('#interiorCharacter');
  if(!interior?.classList.contains('active')||state._building!=='home'||!img)return;
  const armor=combatArmorSources();
  const injured=Number(state.hp)<=Math.max(1,Number(state.maxHp||1)*.25);
  const key=`${armor.normal}|${armor.damaged}|${injured}`;
  if(img.dataset.houseArmorKey===key)return;
  img.dataset.houseArmorKey=key;
  img.onerror=injured?()=>{img.onerror=null;img.src=armor.normal}:null;
  img.src=injured?armor.damaged:armor.normal;
  img.hidden=false;
}
function combatArmorSrc(){let sources=combatArmorSources();let max=Number(state.maxHp)||1;return combat&&Number(combat.playerHp)<=max*.25?sources.damaged:sources.normal}
function refreshCombatPlayerSprite(){if(!$('#combat')?.classList.contains('active')||!$('#playerArt'))return;let img=$('#playerArt .base-layer');if(!img)return;let sources=combatArmorSources(),wanted=combatArmorSrc();if(wanted===sources.damaged&&img.dataset.damagedFailed==='1'){if(img.dataset.requestedSrc!==sources.normal){img.dataset.requestedSrc=sources.normal;img.src=sources.normal}return}if(img.dataset.requestedSrc===wanted)return;img.dataset.requestedSrc=wanted;img.dataset.normalSrc=sources.normal;img.dataset.damagedSrc=sources.damaged;img.onerror=()=>{if(img.dataset.requestedSrc===img.dataset.damagedSrc)img.dataset.damagedFailed='1';img.onerror=null;img.dataset.requestedSrc=img.dataset.normalSrc;img.src=img.dataset.normalSrc};img.src=wanted}
function selectedGearAsset(){return state.gear==='sword'?'Iron Sword':state.gear==='bow'?'Wooden Bow':`${state.affinity[0].toUpperCase()+state.affinity.slice(1)} Focus`}
function layerStyle(key,slot){let b=ASSET_META[key]||[0,0,480,480];let t=slot==='gear'?[255,218,150,170]:[0,0,480,480];let sx=t[2]/b[2],sy=t[3]/b[3],tx=t[0]-b[0]*sx,ty=t[1]-b[1]*sy;return `transform:translate(${tx/4.8}%,${ty/4.8}%) scale(${sx},${sy});transform-origin:0 0`}
function layeredImg(key,slot,cls='wear'){return `<img class="${cls}" style="${layerStyle(key,slot)}" src="${asset(key)}" alt="">`}
function svgDoll(combatMode=false){ensureProgress();let normal=asset(equippedArmorName()),armor=combatMode?combatArmorSrc():normal;let fallback=combatMode?` data-requested-src="${esc(armor)}" data-normal-src="${esc(normal)}" data-damaged-src="${esc(combatArmorSources().damaged)}" onerror="if(this.dataset.requestedSrc===this.dataset.damagedSrc)this.dataset.damagedFailed='1';this.onerror=null;this.dataset.requestedSrc=this.dataset.normalSrc;this.src=this.dataset.normalSrc"`:'';return `<div class="layered-doll" role="img" aria-label="${esc(state.gender)} full armor set"><img class="base-layer" src="${esc(armor)}"${fallback} alt="">${layeredImg(selectedGearAsset(),'gear','gear-layer')}</div>`}

const CLASS_COMBAT_STATS={
 sword:{hp:36,damage:11,accuracy:.95,defense:.08,ratings:[5,4,3,4,0]},
 bow:{hp:26,damage:8,accuracy:.99,defense:.02,ratings:[2,3,5,3,0]},
 fire:{hp:28,damage:12,accuracy:.94,defense:0,ratings:[3,5,3,1,5]},
 water:{hp:30,damage:9,accuracy:.97,defense:.06,ratings:[3,3,4,4,5]},
 light:{hp:30,damage:10,accuracy:.98,defense:.1,ratings:[3,3,4,5,5]}
};
function activeClassStats(){return CLASS_COMBAT_STATS[state.gear==='magic'?state.affinity:state.gear]||CLASS_COMBAT_STATS.sword}
const CREATION_CLASSES={
 sword:{label:'Sword',scene:'sword-class.png',icon:'card-sword.png',accent:'#e6bd78',advantage:'Sword attacks can cause Bleeding and Stagger. Bleeding hurts over time; Stagger makes an enemy miss its next turn. Guarding may counterattack.'},
 bow:{label:'Bow',scene:'bow-class.png',icon:'class-bow.png',accent:'#a9c078',advantage:'Bow attacks can cause Bleeding. Evade gives a high chance to avoid the next attack; otherwise Guard reduces damage.'},
 fire:{label:'Fire',scene:'fire-class.png',icon:'class-fire.png',accent:'#ef9859',advantage:'Fire spells can apply Burning. The target keeps taking damage when its turn begins.'},
 water:{label:'Water',scene:'water-class.png',icon:'class-water.png',accent:'#78cedc',advantage:'Water spells can Soak a target, weakening its attacks and strengthening your next two hits.'},
 light:{label:'Light',scene:'light-class.png',icon:'class-light.png',accent:'#e6d18c',advantage:'Light spells can restore your HP after a successful hit and grant Blessed.'}
};
function currentCreationClass(){return state.gear==='magic'&&CREATION_CLASSES[state.affinity]?state.affinity:state.gear==='bow'?'bow':'sword'}
function setupCreate(){
 const root=$('#create'),cards=$('#creationCards'),name=$('#playerName');name.value=state.playerName;
 cards.innerHTML=Object.entries(CREATION_CLASSES).map(([id,c])=>`<button type="button" class="creation-class-card" data-class="${id}" aria-label="Choose ${c.label}" title="${c.label}"><img src="Textures/UI/CharacterCreation/${c.icon}" alt="" loading="eager"></button>`).join('');
 let chosen=currentCreationClass();
 let visibleScene='Textures/UI/CharacterCreation/sword-class.png',sceneVersion=0;
 function setScene(id){
  const path=`Textures/UI/CharacterCreation/${state.gender==='female'?`female-${id}.png`:CREATION_CLASSES[id].scene}`;
  if(path===visibleScene)return;
  visibleScene=path;
  const layer=document.createElement('div');layer.className='creation-art creation-art-incoming';layer.style.backgroundImage=`url("${path}")`;
  root.insertBefore(layer,root.querySelector('.creation-shade'));
  const version=++sceneVersion;
  void layer.offsetWidth;
  requestAnimationFrame(()=>{layer.style.opacity='1'});
  setTimeout(()=>{if(version!==sceneVersion)return;const base=$('#creationArt');base.style.backgroundImage=`url("${path}")`;root.querySelectorAll('.creation-art-incoming').forEach(node=>node.remove())},480);
 }
 function preview(id){const c=CREATION_CLASSES[id];if(!c)return;root.style.setProperty('--class-accent',c.accent);setScene(id);$('#creationKicker').textContent=`${Object.keys(CREATION_CLASSES).indexOf(id)+1}/5`;$('#creationClassName').textContent=c.label;$('#creationAdvantage').textContent=c.advantage;$('#creationRatings').innerHTML=['HEALTH','DAMAGE','ACCURACY','DEFENSE','MANA'].map((label,i)=>`<div class="creation-rating"><span>${label}</span><span class="creation-rating-bars" aria-label="${i===4&&CLASS_COMBAT_STATS[id].ratings[i]===0?'No mana':CLASS_COMBAT_STATS[id].ratings[i]+' of 5'}">${i===4&&CLASS_COMBAT_STATS[id].ratings[i]===0?'<em class="creation-no-mana">—</em>':Array.from({length:5},(_,n)=>`<i class="${n<CLASS_COMBAT_STATS[id].ratings[i]?'on':''}"></i>`).join('')}</span></div>`).join('')}
 function select(id){chosen=id;state.gear=id==='sword'||id==='bow'?id:'magic';if(state.gear==='magic')state.affinity=id;cards.querySelectorAll('[data-class]').forEach(b=>{let selected=b.dataset.class===id;b.classList.toggle('selected',selected);b.setAttribute('aria-pressed',String(selected))});preview(id);save()}
 cards.querySelectorAll('[data-class]').forEach(b=>{b.addEventListener('mouseenter',()=>preview(b.dataset.class));b.addEventListener('focus',()=>preview(b.dataset.class));b.addEventListener('click',()=>select(b.dataset.class))});cards.addEventListener('mouseleave',()=>preview(chosen));cards.addEventListener('focusout',e=>{if(!cards.contains(e.relatedTarget))preview(chosen)});
 $$('#genderChoices [data-v]').forEach(b=>{b.classList.toggle('selected',b.dataset.v===state.gender);b.addEventListener('click',()=>{$$('#genderChoices [data-v]').forEach(x=>x.classList.toggle('selected',x===b));state.gender=b.dataset.v;preview(chosen);save()})});
 window.refreshCreationScreen=()=>{name.value=state.playerName;$$('#genderChoices [data-v]').forEach(b=>b.classList.toggle('selected',b.dataset.v===state.gender));select(currentCreationClass())};
 select(chosen);$('#enterMap').onclick=()=>{state.playerName=name.value.trim()||'Kuro';if(!state.meta?.classHpAssigned){state.maxHp=activeClassStats().hp;state.hp=state.maxHp;state.meta=state.meta||{};state.meta.classHpAssigned=true}state.screen='village';show('village');renderVillage();sound('confirm');startMusic()};
}


const hubs=[['Placenta Creek','Gloomy rural town','Angry Goose','Sir Barnaby',['Slime Rat','Angry Goose','Drunk Peasant','Rabid Raccoon','Sir Barnaby']],['Mild Inconvenience','Creepy-ass forest','Zombie Wolf','Gloomfang',['Goblin Poacher','Zombie Wolf','Bullying Sprite','Cursed Timberwolf','Gloomfang']],['Grave Mistake','Cemetery of poor choices','Skeleton Archer','Lich King Timmy',['Skeleton Archer','Moldy Mummy','Necromancer Apprentice','Grave Wraith','Lich King Timmy']],['Questionable Decisions','Puzzle maze','Minotaur with Anxiety','Minotaur with Anxiety',['Rune Mimic','Pressure Plate Gremlin','Misdirection Sprite','Doom Gauntlet','Minotaur with Anxiety']],['Dread Fortress','Total bummer castle','Daedric Knight','Monarch Lucien',['Daedric Knight','Gargoyle','Dark Sorcerer','Throne Warden','Monarch Lucien']]];
/* Combat telegraphs and enemy signatures. The five internal slots are deliberately
   hidden from the player; only the flavor line is shown. */
const ENEMY_WARNING_LINES={
  'Slime Rat':['Slime Rat scrapes its teeth along the stone.','Slime Rat suddenly darts between the shadows.','Slime Rat lowers its body and watches your hands.','Slime Rat coils like a spring beside the puddle.','Slime Rat bubbles with something unpleasant.'],
  'Angry Goose':['Angry Goose ruffles every feather on its neck.','Angry Goose starts waddling in very determined circles.','Angry Goose fixes you with one judgmental eye.','Angry Goose stretches its wings and leans forward.','Angry Goose gurgles a warning from deep in its throat.'],
  'Drunk Peasant':['Drunk Peasant grips the bottle with both hands.','Drunk Peasant staggers sideways, somehow gaining speed.','Drunk Peasant squints at you through one closed eye.','Drunk Peasant plants his boots and sways into position.','Drunk Peasant uncorks something that smells like regret.'],
  'Rabid Raccoon':['Rabid Raccoon bares a row of tiny, furious teeth.','Rabid Raccoon scampers around your feet in a blur.','Rabid Raccoon freezes, studying every place you could run.','Rabid Raccoon hunches over the torn sack.','Rabid Raccoon paws at a suspiciously green scrap.'],
  'Sir Barnaby':['Sir Barnaby raises his visor with solemn ceremony.','Sir Barnaby takes three brisk steps across the road.','Sir Barnaby turns his shield toward every possible opening.','Sir Barnaby sets one armored heel into the dirt.','Sir Barnaby reaches for a dusty vial on his belt.'],
  'Goblin Poacher':['Goblin Poacher checks the tension on a crooked snare.','Goblin Poacher slips behind a tree and reappears elsewhere.','Goblin Poacher narrows his eyes at your footing.','Goblin Poacher draws the cord back until it creaks.','Goblin Poacher rummages through a pouch of barbed trinkets.'],
  'Zombie Wolf':['Zombie Wolf lifts its ruined muzzle toward the wind.','Zombie Wolf circles the clearing with dead-eyed purpose.','Zombie Wolf stops moving and tracks your breathing.','Zombie Wolf digs its claws into the moss.','Zombie Wolf coughs up a cloud of grave-cold dust.'],
  'Bullying Sprite':['Bullying Sprite puffs up until its little fists shake.','Bullying Sprite zips from branch to branch above you.','Bullying Sprite tilts its head, looking for weakness.','Bullying Sprite draws a glowing line in the air.','Bullying Sprite shakes a fistful of spiteful glitter.'],
  'Cursed Timberwolf':['Cursed Timberwolf drags one claw through the black soil.','Cursed Timberwolf flashes between the trees too quickly to follow.','Cursed Timberwolf listens without blinking.','Cursed Timberwolf bows low beneath the crooked branches.','Cursed Timberwolf exhales a breath full of violet sparks.'],
  'Gloomfang':['Gloomfang closes its jaws with a quiet wooden crack.','Gloomfang glides from one patch of darkness to another.','Gloomfang watches your shadow instead of your face.','Gloomfang presses its paws into the leaf litter.','Gloomfang’s throat glows with a sickly green ember.'],
  'Skeleton Archer':['Skeleton Archer rolls one arrow between its finger bones.','Skeleton Archer slides soundlessly along the ridge.','Skeleton Archer angles its skull to measure the distance.','Skeleton Archer raises its bow until the string hums.','Skeleton Archer selects an arrow with a black-feathered head.'],
  'Moldy Mummy':['Moldy Mummy tightens the fraying cloth around its hands.','Moldy Mummy shuffles sideways with alarming purpose.','Moldy Mummy turns its covered face toward your weakest side.','Moldy Mummy braces its wrapped feet among the tombstones.','Moldy Mummy shakes loose a puff of ancient spores.'],
  'Necromancer Apprentice':['Necromancer Apprentice flips nervously through a cracked grimoire.','Necromancer Apprentice rushes through a half-remembered ritual.','Necromancer Apprentice studies your heartbeat with one bright eye.','Necromancer Apprentice stamps a crooked circle into the dust.','Necromancer Apprentice uncaps a jar full of whispering ash.'],
  'Grave Wraith':['Grave Wraith thins until only two pale eyes remain.','Grave Wraith slips beneath the fog and rises behind a stone.','Grave Wraith leans close to listen for your living pulse.','Grave Wraith gathers the mist around its outstretched arms.','Grave Wraith trails a ribbon of cold darkness across the ground.'],
  'Lich King Timmy':['Lich King Timmy taps the arm of his tiny throne.','Lich King Timmy glides forward without moving his feet.','Lich King Timmy’s crown swivels toward your exposed side.','Lich King Timmy rises as the tomb lights flare.','Lich King Timmy whispers a name that is not yours.'],
  'Rune Mimic':['Rune Mimic rearranges the symbols across its wooden lid.','Rune Mimic skitters in a tight circle like a dropped coin.','Rune Mimic pauses, matching the rhythm of your movement.','Rune Mimic snaps its lid open and shut with growing force.','Rune Mimic leaks a thin line of blue smoke from its hinges.'],
  'Pressure Plate Gremlin':['Pressure Plate Gremlin taps a toe against the nearest tile.','Pressure Plate Gremlin scurries through the maze of markings.','Pressure Plate Gremlin peers at your boots with delight.','Pressure Plate Gremlin crouches beside a plate and grins.','Pressure Plate Gremlin produces a bundle of very sharp pins.'],
  'Misdirection Sprite':['Misdirection Sprite folds itself into a flickering afterimage.','Misdirection Sprite skips around you in three different places.','Misdirection Sprite watches which way your eyes keep drifting.','Misdirection Sprite draws a doorway where no wall exists.','Misdirection Sprite scatters bright motes that refuse to settle.'],
  'Doom Gauntlet':['Doom Gauntlet tightens its fingers until the runes flare.','Doom Gauntlet drags itself forward with terrible speed.','Doom Gauntlet turns palm-up, waiting for you to commit.','Doom Gauntlet locks every joint with a grinding click.','Doom Gauntlet vents a breath of iron-colored smoke.'],
  'Minotaur with Anxiety':['Minotaur with Anxiety grips the axe and counts under its breath.','Minotaur with Anxiety charges three steps, then changes direction.','Minotaur with Anxiety keeps checking every exit behind you.','Minotaur with Anxiety lowers its horns toward the maze floor.','Minotaur with Anxiety unwraps a charm covered in nervous notes.'],
  'Daedric Knight':['Daedric Knight drags its blade across the flagstones.','Daedric Knight advances with measured, ringing steps.','Daedric Knight angles its helm to hide its intentions.','Daedric Knight lowers its shoulders beneath the black armor.','Daedric Knight opens a gauntlet filled with red sparks.'],
  'Gargoyle':['Gargoyle flexes stone wings and sheds a little dust.','Gargoyle drops from its perch with startling speed.','Gargoyle turns its carved face to follow every twitch.','Gargoyle folds its wings around a hunched silhouette.','Gargoyle’s mouth glows with a coal-red vapor.'],
  'Dark Sorcerer':['Dark Sorcerer closes the book without marking the page.','Dark Sorcerer glides forward beneath a veil of black sparks.','Dark Sorcerer measures you with a single unblinking eye.','Dark Sorcerer raises one hand and the candles bow away.','Dark Sorcerer pours a silver-black powder into the air.'],
  'Throne Warden':['Throne Warden knocks its spear once against the throne room floor.','Throne Warden marches forward as the banners tremble.','Throne Warden turns its visor toward your smallest opening.','Throne Warden locks its shield into a heavy stance.','Throne Warden releases a hiss from the seals in its armor.'],
  'Monarch Lucien':['Monarch Lucien brushes dust from one immaculate sleeve.','Monarch Lucien descends the steps with sudden grace.','Monarch Lucien smiles as though he already knows your choice.','Monarch Lucien lifts the royal blade from its resting place.','Monarch Lucien lets a dark crown of smoke gather overhead.']
};
const ENEMY_SIGNATURE_DEBUFF={
  'Slime Rat':'Weakened','Angry Goose':'Confused','Drunk Peasant':'Confused','Rabid Raccoon':'Poisoned','Sir Barnaby':'Armor Break',
  'Goblin Poacher':'Weakened','Zombie Wolf':'Poisoned','Bullying Sprite':'Cursed','Cursed Timberwolf':'Cursed','Gloomfang':'Poisoned',
  'Skeleton Archer':'Armor Break','Moldy Mummy':'Poisoned','Necromancer Apprentice':'Cursed','Grave Wraith':'Weakened','Lich King Timmy':'Cursed',
  'Rune Mimic':'Confused','Pressure Plate Gremlin':'Armor Break','Misdirection Sprite':'Confused','Doom Gauntlet':'Weakened','Minotaur with Anxiety':'Armor Break',
  'Daedric Knight':'Armor Break','Gargoyle':'Weakened','Dark Sorcerer':'Cursed','Throne Warden':'Armor Break','Monarch Lucien':'Cursed'
};
const WARNING_TYPES=['heavy','fast','dodge','charge','status'];
const statusSlug=x=>String(x||'').toLowerCase().replace(/\s+/g,'-');
function combatHasStatus(name){return !!combat?.playerStatuses?.includes(name)}
function advancePlayerDebuffs(){if(!combat?.playerStatusTurns)return;for(const name of Object.keys(combat.playerStatusTurns)){combat.playerStatusTurns[name]--;if(combat.playerStatusTurns[name]<=0){delete combat.playerStatusTurns[name];combat.playerStatuses=(combat.playerStatuses||[]).filter(x=>x!==name)}}window.refreshCombatStatusUI?.()}
function clearCombatDebuffs(names){if(!combat)return;const all=['Poisoned','Cursed','Weakened','Confused','Armor Break'],clear=Array.isArray(names)?new Set(names):new Set(all);combat.playerStatuses=(combat.playerStatuses||[]).filter(x=>!clear.has(x));combat.playerStatusTurns=combat.playerStatusTurns||{};for(const name of clear)delete combat.playerStatusTurns[name];window.refreshCombatStatusUI?.()}
function applyEnemySignatureDebuff(chance){if(!combat||combat.enemyHp<=0||Math.random()>=(chance??(combat.boss?.25:.15))*(Number(state.armorSets?.[state.gender])===8?.8:1))return '';const name=ENEMY_SIGNATURE_DEBUFF[combat.enemy];if(!name)return '';combat.playerStatuses=combat.playerStatuses||[];combat.playerStatusTurns=combat.playerStatusTurns||{};if(!combat.playerStatuses.includes(name))combat.playerStatuses.push(name);combat.playerStatusTurns[name]=2;window.refreshCombatStatusUI?.();return `${name} applied for 2 turns.`}
function tickCombatPlayerStatus(){
 if(!combat||combat.playerHp<=0)return '';
 const notes=[];
 const deal=(amount,label,fx)=>{
  const reduced=Number(state.armorSets?.[state.gender])===10&&['Burning','Bleeding'].includes(label)?Math.max(1,amount-1):amount;
  const damage=Math.min(reduced,Math.max(0,combat.playerHp-1));
  if(!damage)return;
  combat.playerHp-=damage;notes.push(`${label} deals ${damage} damage.`);
  window.floatDamageNumber?.($('#playerArt'),damage,{status:label});fx?.();
 };
 if(combatHasStatus('Poisoned'))deal(2,'Poison');
 if(combatHasStatus('Burning')&&Number(combat.playerBurningTurns||0)>0){
  deal(2,'Burning');
  combat.playerBurningTurns=Math.max(0,Number(combat.playerBurningTurns)-1);
  if(combat.playerBurningTurns<=0)combat.playerStatuses=(combat.playerStatuses||[]).filter(x=>x!=='Burning');
 }
 if(combatHasStatus('Bleeding')&&Number(combat.playerBleedingTurns||0)>0&&combat.playerHp>0){
  deal(2,'Bleeding');
  combat.playerBleedingTurns=Math.max(0,Number(combat.playerBleedingTurns)-1);
  if(combat.playerBleedingTurns<=0)combat.playerStatuses=(combat.playerStatuses||[]).filter(x=>x!=='Bleeding');
 }
 if(!notes.length)return '';
 state.hp=Math.max(1,combat.playerHp);updateBars();window.refreshCombatStatusUI?.();return notes.join(' ')
}

function tickCombatEnemyStatus(){
 if(!combat||combat.enemyHp<=0)return {notes:[],defeated:false};
 combat.targetStatusTurns=combat.targetStatusTurns||{};
 const notes=[];
 const deal=(amount,label,fx)=>{
  const damage=Math.min(amount,Math.max(0,combat.enemyHp));
  if(!damage)return;
  combat.enemyHp-=damage;notes.push(`${label} deals ${damage} damage.`);
  window.floatDamageNumber?.($('#enemyArt'),damage,{status:label});fx?.();
 };
 if(combat.targetStatuses?.includes('Burning')){
  const magicPower=activeClassStats().damage+(state.weaponLevel||0)*2;
  deal(Number(combat.burningDamage)||Math.max(2,Math.round(magicPower*.25)),'Burning');
  combat.targetStatusTurns.Burning=Math.max(0,Number(combat.targetStatusTurns.Burning||combat.burningTurns||3)-1);
  combat.burningTurns=combat.targetStatusTurns.Burning;
  if(combat.burningTurns<=0)combat.targetStatuses=combat.targetStatuses.filter(x=>x!=='Burning');
 }
 if(combat.targetStatuses?.includes('Poisoned')&&combat.enemyHp>0){
  deal(2,'Poison');
  combat.targetStatusTurns.Poisoned=Math.max(0,Number(combat.targetStatusTurns.Poisoned||2)-1);
  if(combat.targetStatusTurns.Poisoned<=0)combat.targetStatuses=combat.targetStatuses.filter(x=>x!=='Poisoned');
 }
 if(combat.targetStatuses?.includes('Bleeding')&&Number(combat.bleedingTurns||0)>0&&combat.enemyHp>0){
  deal(Number(combat.bleedingDamage)||Math.max(2,Math.round((activeClassStats().damage+(state.weaponLevel||0)*2)*.2)),'Bleeding');
  combat.bleedingTurns=Math.max(0,Number(combat.bleedingTurns)-1);
  if(combat.bleedingTurns<=0)combat.targetStatuses=combat.targetStatuses.filter(x=>x!=='Bleeding');
 }
 if(!notes.length)return {notes:[],defeated:false};
 updateBars();window.refreshCombatStatusUI?.();
 return {notes,defeated:combat.enemyHp<=0};
}

window.tickCombatEnemyStatus=tickCombatEnemyStatus;

function renderMap(){ensureProgress();$('#mapName').textContent=state.playerName;let mapThemes=['overworld','forest','cemetery','maze','fortress'];drawScene($('#mapCanvas'),mapThemes[state.hub]||'overworld');$('#mapHp').textContent=state.hp;$('#mapCoins').textContent=state.coins;$('#mapGear').textContent=state.gear==='sword'?`Iron Sword · +5 slash · Lv ${state.weaponLevel+1} · ${ARMOR_NAMES[state.armorSets[state.gender]||0]}`:state.gear==='bow'?`Wooden Bow · +4 snipe · Lv ${state.weaponLevel+1} · ${ARMOR_NAMES[state.armorSets[state.gender]||0]}`:`${state.affinity[0].toUpperCase()+state.affinity.slice(1)} focus · spell · Lv ${state.weaponLevel+1} · ${ARMOR_NAMES[state.armorSets[state.gender]||0]}`;$('#hubRow').innerHTML=hubs.map((h,i)=>{let locked=i>state.maxHub,cleared=state.progress[i]||0;return `<article class="hub ${locked?'locked':''}"><div class="scene"></div><div><h3>${i+1}. ${h[0]}</h3><p>${h[1]}<br><b>Boss: ${h[3]}</b><br><small>Levels cleared: ${cleared}/5</small></p></div><button ${locked?'disabled':''} data-hub="${i}">${locked?'Locked':cleared>=5?'Farm levels':'Choose level'} →</button></article>`}).join('');$$('[data-hub]').forEach(b=>b.onclick=()=>openLevelSelect(+b.dataset.hub));}
function openLevelSelect(i){ensureProgress();state.hub=i;let cleared=state.progress[i]||0;$('#levelTitle').textContent=`${hubs[i][0]} · choose a level`;$('#levelHint').textContent=`Clear Level ${Math.min(cleared+1,5)} to unlock the next. Cleared levels can be farmed for coins and materials.`;$('#levelGrid').innerHTML=[1,2,3,4,5].map(level=>{let locked=level>cleared+1;let boss=level===5;let monster=i===3&&!boss?'Random':boss?'Boss: '+hubs[i][3]:'Monster: '+hubs[i][4][level-1];return `<button class="${locked?'locked ':''}${level===cleared+1?'current':''}" ${locked?'disabled':''} data-level="${level}"><b>${locked?'🔒':'Level '+level}</b><small>${monster}</small></button>`}).join('');$('#levelModal').classList.add('open');$('#levelModal').setAttribute('aria-hidden','false');$$('[data-level]').forEach(b=>b.onclick=()=>startLevel(i,+b.dataset.level))}
function closeLevelSelect(){$('#levelModal').classList.remove('open');$('#levelModal').setAttribute('aria-hidden','true')}
function startLevel(i,level){ensureProgress();closeLevelSelect();state.hub=i;state.stage=level-1;if(i===3){if(level<=4){const pool=hubs.slice(0,3).flatMap(h=>h[4].slice(0,-1));const enemy=pool[Math.floor(Math.random()*pool.length)];startCombat(enemy,false,level);combat.area4QuizLevel=level;$('#battleDetail').textContent='Defeat the monster to face the labyrinth question.';return}startCombat('Minotaur with Anxiety',true,level);return}let enemy=hubs[i][4][level-1],boss=level===5;startCombat(enemy,boss,level)}
let combat={enemy:'',enemyMax:30,enemyHp:30,playerHp:30,guard:false,boss:false,level:1};
function startCombat(enemy,boss,level=state.stage+1){let max=boss?96+state.hub*34+level*14:34+state.hub*18+level*11+state.hub*level*3;ensureCombatResources();combat={enemy,enemyMax:max,enemyHp:max,playerHp:state.hp,guard:false,boss,level,ambush:state.hub===1&&Math.random()<.2,targetStatuses:[],targetStatusTurns:{},playerStatuses:[],playerStatusTurns:{},soakedTurns:0,lastIntentType:'',intentType:'heavy',enemyDodgeBonus:0,manaMax:10,playerMana:state.gear==='magic'?10:0};$('#enemyName').textContent=enemy;$('#enemyLevel').textContent=level+state.hub;$('#playerCombatName').textContent=state.playerName;$('#playerLevel').textContent=state.armorLevel+1;$('#combatStage').textContent=`${hubs[state.hub][0]} · Level ${level}`;$('#battlePrompt').textContent=`What will ${state.playerName} do?`;$('#battleDetail').textContent=boss?'A boss blocks the path. It looks extremely confident.':'Choose a move. The encounter can be farmed after it is cleared.';$('#magicDesc').textContent=state.gear==='magic'?`${state.affinity} spell · Mana 10/10`:'No focus equipped';const manaBar=$('#playerManaBar');if(manaBar){manaBar.hidden=state.gear!=='magic';manaBar.setAttribute('aria-hidden',String(state.gear!=='magic'))}$('#enemyArt').innerHTML=enemySVG(enemy,boss);$('#playerArt').innerHTML=playerSVG();updateBars();const revealCombat=()=>{show('combat');window.refreshCombatStatusUI?.();window.battleSetIntent?.();sound('thunder')};const prep=window.prepareCombatScene?.(Number(state.hub)||0);if(prep&&typeof prep.then==='function')prep.then(revealCombat).catch(revealCombat);else revealCombat()}
function enemySVG(name,boss){if(state.ng&&(state.meta?.ngPlusRouteKey||state.endgame?.routeKey)==='male-king'&&['Royal Road Ambush','Crownwood Hunting Pack','Crowncrypt Procession','Maze Court Conspirators','Royal Vanguard Pair'].includes(name))return '<div class="crownhold-pair-sprites"></div>';let src=(name==='Crown Revenant'&&state.ng&&(state.meta?.ngPlusRouteKey||state.endgame?.routeKey)==='male-king')?'Textures/Monsters/NGPlus/Crownhold/crown-revenant.png':asset(name);return src?`<img class="monster-sprite" src="${src}" alt="${esc(name)}">`:`<div class="paper" style="padding:18px;font-weight:900">${esc(name)}</div>`}
function playerSVG(){return svgDoll(true).replace('class="doll"','class="doll"')}
function tinyNpc(color='#d56a70',hat='#49a83c'){return `<svg viewBox="0 0 100 120" aria-hidden="true"><g stroke="#111" stroke-width="4" stroke-linejoin="round"><circle cx="50" cy="44" r="27" fill="#f1c7a4"/><path d="M23 37Q27 8 50 8t27 29l-6 10-10-9-11 8-10-8-10 8z" fill="${hat}"/><path d="M23 36q27 9 54 0v10q-27 9-54 0z" fill="#efdfbc"/><circle cx="42" cy="45" r="3"/><circle cx="58" cy="45" r="3"/><path d="M41 61q9 5 18 0" fill="none"/><path d="M25 73q25-15 50 0l8 36H17z" fill="${color}"/><path d="M19 108h62" fill="none"/></g></svg>`}
function ensureProgress(){state.materials=state.materials||{leather:2,bones:0,steel:0};state.furniture=state.furniture||[];state.weaponLevel=state.weaponLevel||0;state.armorLevel=state.armorLevel||0;state.progress=Array.isArray(state.progress)?state.progress:[0,0,0,0,0];while(state.progress.length<5)state.progress.push(0);state.maxHub=Number.isInteger(state.maxHub)?state.maxHub:(state.hub||0);state.armorSets=state.armorSets||{male:0,female:0};state.unlockedArmor=state.unlockedArmor||{male:[0],female:[0]};state.unlockedArmor.male=Array.isArray(state.unlockedArmor.male)?state.unlockedArmor.male:[0];state.unlockedArmor.female=Array.isArray(state.unlockedArmor.female)?state.unlockedArmor.female:[0];if(!state.unlockedArmor.male.includes(0))state.unlockedArmor.male.unshift(0);if(!state.unlockedArmor.female.includes(0))state.unlockedArmor.female.unshift(0)}

function drawScene(canvas,theme){if(!canvas)return;let r=canvas.getBoundingClientRect(),d=devicePixelRatio||1,w=r.width,h=r.height;if(!w||!h){let g=document.querySelector('.game').getBoundingClientRect();w=g.width;h=g.height}canvas.width=w*d;canvas.height=h*d;let c=canvas.getContext('2d');c.setTransform(d,0,0,d,0,0);c.clearRect(0,0,w,h);let palettes={village:['#8bc6d0','#769a60'],forest:['#324b47','#263a2d'],cemetery:['#44375d','#242438'],maze:['#77716a','#3e3a3a'],fortress:['#49243d','#1f1826'],overworld:['#93bac3','#739c63']};let [sky,ground]=palettes[theme]||palettes.overworld;c.fillStyle=sky;c.fillRect(0,0,w,h);c.fillStyle=ground;c.fillRect(0,h*.52,w,h*.48);c.globalAlpha=.25;for(let i=0;i<7;i++){c.fillStyle=i%2?'#fff':'#1c2735';c.beginPath();c.arc(w*(.08+i*.16),h*(.2+(i%2)*.08),h*(.09+(i%3)*.02),0,7);c.fill()}c.globalAlpha=1;if(theme==='village'||theme==='overworld'){c.fillStyle='#5c7c62';for(let i=0;i<12;i++){let x=w*(i/11),y=h*.6;c.beginPath();c.moveTo(x,y);c.lineTo(x+35,h*.35-(i%3)*15);c.lineTo(x+70,y);c.fill()}for(let i=0;i<4;i++){let x=w*(.12+i*.23),y=h*.53;c.fillStyle=i%2?'#c65d54':'#b06d45';c.fillRect(x,y-70,95,75);c.fillStyle='#4b3040';c.beginPath();c.moveTo(x-8,y-70);c.lineTo(x+47,y-116);c.lineTo(x+104,y-70);c.fill();c.strokeStyle='#111';c.lineWidth=4;c.stroke()}}if(theme==='forest'){c.fillStyle='#172a24';for(let i=0;i<18;i++){let x=(i*83)%w;c.fillRect(x,h*.25,16,h*.42);c.beginPath();c.moveTo(x-50,h*.5);c.lineTo(x+8,h*.17);c.lineTo(x+66,h*.5);c.fill()}}if(theme==='cemetery'){c.fillStyle='#b7a4e5';c.beginPath();c.arc(w*.78,h*.2,48,0,7);c.fill();c.fillStyle='#302842';for(let i=0;i<9;i++){let x=40+i*w/9;c.fillRect(x,h*.58-(i%2)*20,40,32);c.beginPath();c.arc(x+20,h*.58-(i%2)*20,20,Math.PI,0);c.fill()}}if(theme==='maze'){c.strokeStyle='#211e1d';c.lineWidth=12;for(let i=0;i<8;i++){c.beginPath();c.moveTo(0,h*(.2+i*.09));c.lineTo(w,h*(.15+i*.1));c.stroke()}}if(theme==='fortress'){c.fillStyle='#17101c';c.fillRect(w*.12,h*.2,w*.76,h*.55);c.fillStyle='#b6404b';for(let i=0;i<7;i++){c.fillRect(w*(.12+i*.13),h*.15,34,80)}}}
let villageAnimationRunning=false;
function drawVillageAlive(t){let c=$('#villageCanvas');if(!c)return;let r=c.getBoundingClientRect(),d=devicePixelRatio||1,w=r.width,h=r.height;if(!w||!h){let g=document.querySelector('.game').getBoundingClientRect();w=g.width;h=g.height}c.width=w*d;c.height=h*d;let x=c.getContext('2d');x.setTransform(d,0,0,d,0,0);x.clearRect(0,0,w,h);let vignette=x.createRadialGradient(w*.5,h*.43,Math.min(w,h)*.16,w*.5,h*.5,Math.max(w,h)*.8);vignette.addColorStop(0,'rgba(6,12,14,0)');vignette.addColorStop(.7,'rgba(6,12,14,.08)');vignette.addColorStop(1,'rgba(3,7,9,.42)');x.fillStyle=vignette;x.fillRect(0,0,w,h);for(let i=0;i<4;i++){let px=((t*.012+i*w*.38)%(w*1.45))-w*.22,py=h*(.27+(i%3)*.15)+Math.sin(t*.00045+i)*10;x.fillStyle=`rgba(224,235,225,${.055+(i%2)*.018})`;x.beginPath();x.ellipse(px,py,Math.max(90,w*.13),Math.max(14,h*.035),-.08,0,Math.PI*2);x.fill()}x.fillStyle='rgba(5,10,10,.14)';x.fillRect(0,h*.86,w,h*.14)}
function startVillageAnimation(){if(villageAnimationRunning)return;villageAnimationRunning=true;let tick=t=>{if(!villageAnimationRunning)return;drawVillageAlive(t);requestAnimationFrame(tick)};requestAnimationFrame(tick)}
function stopVillageAnimation(){villageAnimationRunning=false}
function renderVillage(){ensureProgress();$('#villageName').textContent='Placenta Creek';$('#villageHp').textContent=state.hp;$('#villageCoins').textContent=state.coins;$('#villageStatus').textContent=`Armor: ${ARMOR_NAMES[state.armorSets[state.gender]||0]}. Materials: ${state.materials.leather} leather · ${state.materials.bones} bones · ${state.materials.steel} demon steel.`;$('#npc1').innerHTML=tinyNpc('#db6e37','#48a934');$('#npc2').innerHTML=tinyNpc('#6a8db4','#4861a8');$('#npc3').innerHTML=tinyNpc('#d4a84f','#7450a0');startVillageAnimation()}
function goVillage(){show('village');renderVillage();sound('confirm');startMusic()}
function openFacility(type){ensureProgress();let title='',body='';if(type==='cathedral'){title='Cathedral of Light';body=`<h2>${title}</h2><p>A beam of holy light falls on you. It feels suspiciously like a warm lamp.</p><div class="facility-options"><button id="healBtn"><b>Restore full HP · 8 coins</b><small>Clean every status ailment and refill your health.</small></button><button id="prayBtn"><b>Pray for a small blessing · free</b><small>Restore 4 HP. The cathedral appreciates your effort.</small></button></div>`}if(type==='blacksmith'){let cost=12+state.weaponLevel*8;title='Blacksmith';body=`<h2>${title}</h2><p>Crafted gear is ugly, useful, and legally distinct from anything heroic.</p><div class="material-row"><span>Leather ${state.materials.leather}</span><span>Bones ${state.materials.bones}</span><span>Demon steel ${state.materials.steel}</span></div><div class="facility-options"><button id="craftWeapon"><b>Upgrade ${state.gear} · ${cost} coins + 1 leather</b><small>Weapon level ${state.weaponLevel} → ${state.weaponLevel+1}; increases card damage.</small></button><button id="craftArmor"><b>Patch heavy armor · 8 coins + 1 bone</b><small>Armor level ${state.armorLevel} → ${state.armorLevel+1}; raises max HP by 3.</small></button></div>`}if(type==='merchant'){title='Merchant Shop';body=`<h2>${title}</h2><p>Everything is procedurally priced and emotionally unavailable.</p><div class="facility-options"><button data-buy="chair"><b>Wooden chair · 6 coins</b><small>Add a chair to your house.</small></button><button data-buy="rug"><b>Questionable rug · 8 coins</b><small>Add a rug to your house.</small></button><button data-buy="outfit"><b>Fancy paper outfit · 12 coins</b><small>Cosmetic unlock. It has pockets.</small></button></div>`}if(type==='home'){let cells=Array.from({length:15},(_,i)=>`<div class="${state.furniture[i]?'filled':''}">${state.furniture[i]||''}</div>`).join('');title='Player House';body=`<h2>${title}</h2><p>Tap a furniture button to place it in the next open grid tile.</p><div class="house-grid">${cells}</div><h3>Armor collection</h3><div class="armor-collection">${state.unlockedArmor[state.gender].sort((a,b)=>a-b).map(i=>`<button data-armor="${i}" class="${(state.armorSets[state.gender]||0)===i?'equipped':''}"><b>${ARMOR_NAMES[i]}</b><small>${(state.armorSets[state.gender]||0)===i?'Equipped':'Wear set'}</small></button>`).join('')}</div><div class="facility-options"><button data-place="chair"><b>Place chair</b><small>Next open tile becomes a chair.</small></button><button data-place="rug"><b>Place rug</b><small>Next open tile becomes a rug.</small></button><button data-place="plant"><b>Place plant</b><small>Next open tile becomes a plant.</small></button></div>`}
$('#interiorContent').innerHTML=body;$('#interiorImage').src=BUILDING_BACKGROUNDS[type];$('#interiorTitle').textContent=title;let fade=$('#fadeTransition');fade.classList.add('active');setTimeout(()=>{show('interior');fade.classList.remove('active')},340);$('#healBtn')?.addEventListener('click',()=>{if(state.coins>=8){state.coins-=8;state.hp=state.maxHp;$('#villageStatus').textContent='The cathedral restored you. The light was very smug.'}else $('#villageStatus').textContent='The cathedral requests 8 coins. Even holiness has overhead.';renderVillage();openFacility('cathedral')});$('#prayBtn')?.addEventListener('click',()=>{state.hp=Math.min(state.maxHp,state.hp+4);renderVillage();openFacility('cathedral')});$('#craftWeapon')?.addEventListener('click',()=>{let cost=12+state.weaponLevel*8;if(state.coins>=cost&&state.materials.leather>=1){state.coins-=cost;state.materials.leather--;state.weaponLevel++;$('#villageStatus').textContent='The blacksmith hands you an upgraded weapon and a receipt made of bark.'}renderVillage();openFacility('blacksmith')});$('#craftArmor')?.addEventListener('click',()=>{if(state.coins>=8&&state.materials.bones>=1){state.coins-=8;state.materials.bones--;state.armorLevel++;state.maxHp+=3;state.hp=state.maxHp}renderVillage();openFacility('blacksmith')});$$('[data-buy]').forEach(b=>b.addEventListener('click',()=>{let prices={chair:6,rug:8,outfit:12},icons={chair:'🪑',rug:'▦',outfit:'✦'};if(state.coins>=prices[b.dataset.buy]){state.coins-=prices[b.dataset.buy];state.furniture.push(icons[b.dataset.buy]);$('#villageStatus').textContent='Purchased. The merchant refuses to wrap it.'}renderVillage();openFacility('merchant')}));$$('[data-armor]').forEach(b=>b.addEventListener('click',()=>{state.armorSets[state.gender]=+b.dataset.armor;renderVillage();openFacility('home')}));$$('[data-place]').forEach(b=>b.addEventListener('click',()=>{let icons={chair:'🪑',rug:'▦',plant:'🌿'};if(state.furniture.length<15){state.furniture.push(icons[b.dataset.place]);renderVillage();openFacility('home')}}))}
function closeFacility(){stopVillageAnimation();show('village');renderVillage()}
function updateBars(){if(!combat)return;$('#enemyHp').style.width=Math.max(0,combat.enemyHp/combat.enemyMax*100)+'%';$('#playerHp').style.width=Math.max(0,combat.playerHp/state.maxHp*100)+'%';const enemyNumber=$('#enemyHpNumber');if(enemyNumber)enemyNumber.textContent=`${Math.max(0,Math.ceil(combat.enemyHp||0))} / ${combat.enemyMax}`;const hpNumber=$('#playerHpNumber');if(hpNumber)hpNumber.textContent=`${Math.max(0,Math.ceil(combat.playerHp||0))} / ${state.maxHp}`;const manaNumber=$('#playerManaNumber');if(manaNumber)manaNumber.textContent=`${Math.max(0,Math.ceil(combat.playerMana||0))} / ${combat.manaMax||10}`;const manaBar=$('#playerManaBar'),mana=$('#playerMana');if(manaBar&&mana){manaBar.hidden=state.gear!=='magic';mana.style.width=Math.max(0,Math.min(1,(combat.playerMana||0)/Math.max(1,combat.manaMax||10))*100)+'%';mana.setAttribute('aria-valuenow',String(Math.max(0,combat.playerMana||0)));mana.setAttribute('aria-valuemax',String(combat.manaMax||10));const desc=$('#magicDesc');if(desc&&state.gear==='magic')desc.textContent=`${state.affinity} spell · Mana ${Math.max(0,combat.playerMana||0)}/${combat.manaMax||10}`}refreshCombatPlayerSprite()}
setInterval(refreshCombatPlayerSprite,120)
function playCard(card){if(window.__debugFlags?.godMode){combat.playerHp=state.maxHp;state.hp=state.maxHp}if(!screens.find(x=>x.id==='combat').classList.contains('active'))return;let dmg=0,msg='';if(card==='attack'){dmg=(state.gear==='sword'?9:state.gear==='bow'?8:5)+(state.weaponLevel||0)*2;msg=`${state.playerName} attacks with the ${state.gear}. WHAM!`}if(card==='guard'){combat.guard=true;msg='A paper shield unfolds. Probably held together by glue.'}if(card==='magic'){dmg=state.gear==='magic'?activeClassStats().damage+(state.weaponLevel||0)*2:3+(state.weaponLevel||0);msg=state.gear==='magic'?`${state.affinity} magic bursts out. ZAP!`:'You wave your weapon mystically. It is not convincing.'}combat.enemyHp-=dmg;burst(card);if(combat.enemyHp<=0){combat.enemyHp=0;updateBars();$('#battleDetail').textContent='The enemy becomes a pile of emotionally complicated confetti.';sound('win');setTimeout(victory,700);return}let incoming=window.__debugFlags?.godMode?0:Math.max(2,Math.floor((combat.boss?14+state.hub*4:5+state.hub*3+combat.level*2)*(combat.guard?.5:1)));combat.playerHp-=incoming;combat.guard=false;$('#battleDetail').textContent=`${msg} Enemy counters for ${incoming}.`;updateBars();sound(card);if(combat.playerHp<=0){combat.playerHp=state.maxHp;state.hp=state.maxHp;$('#battleDetail').textContent='You died heroically. The paper is recyclable.';setTimeout(()=>{renderMap();show('map')},900)}}
function victory(){if(combat?._victoryShown)return;window.sideArmor?.recordVictory?.();combat._victoryShown=true;ensureProgress();state.meta=state.meta||{};state.meta.codexUnlocked=Array.isArray(state.meta.codexUnlocked)?state.meta.codexUnlocked:[];if(combat?.enemy&&!state.meta.codexUnlocked.includes(combat.enemy))state.meta.codexUnlocked.push(combat.enemy);if(window.villageRaid?.active){window.villageRaid.onVictory();return}if(state.endgame&&state.endgame.challengeActive){state.endgame.challengeActive=false;state.endgame.challengeWins=(state.endgame.challengeWins||0)+1;state.coins+=20;state.materials.steel=(state.materials.steel||0)+2;state.hp=Math.max(1,combat.playerHp);save();openEndgameHub('Challenge cleared! +20 coins and +2 demon steel.');return;}state.hp=Math.max(1,combat.playerHp);state.meta.battleWonPending=false;if(combat?.area4QuizLevel&&state.hub===3&&combat.level<=4){$('#battlePrompt').textContent='Monster defeated!';$('#battleDetail').textContent='The labyrinth question is ready.';save();setTimeout(()=>window.startArea4Quiz(combat.area4QuizLevel),420);return}state.progress[state.hub]=Math.max(state.progress[state.hub]||0,combat.level);if(combat.level===5){let newSet=Math.min(4,state.hub+1);if(!state.unlockedArmor.male.includes(newSet))state.meta.pendingArmorReveal=newSet;['male','female'].forEach(g=>{if(!state.unlockedArmor[g].includes(newSet))state.unlockedArmor[g].push(newSet)});state.maxHub=Math.max(state.maxHub,Math.min(4,state.hub+1));state.meta.armorRewardsClaimed=state.meta.armorRewardsClaimed||{};if(!state.meta.armorRewardsClaimed[state.hub]){state.meta.armorRewardsClaimed[state.hub]=true;state.meta.armorPending=true}}if(combat.boss&&state.hub===4)state.meta.pendingFinale=true;$('#battlePrompt').textContent=combat.level===5?'Boss defeated!':'Enemy defeated!';$('#battleDetail').textContent='Choose a reward to finish this battle.';window.openBattleReward(combat.level===5?'Boss cleared!':'Victory!',combat.level===5)}
function showEnd(){openEndgameEnding()}
function endgameEnsure(){state.endgame=state.endgame||{unlocked:false,route:null,throneChoice:null,relationshipChoice:null,reputation:0,lucienRelationship:0,castleRestoration:0,completedQuests:[],challengeWins:0};state.endgame.completedQuests=Array.isArray(state.endgame.completedQuests)?state.endgame.completedQuests:[];return state.endgame}
function endgameOpen(id){$('#endgameOverlay').classList.add('open');['endgameEnding','endgameHub','endgameChallenge'].forEach(x=>$('#'+x).style.display=x===id?'block':'none')}
function endgameClose(){ $('#endgameOverlay').classList.remove('open') }
function endgameReward(q){ensureProgress();if(q==='throne'){state.coins+=30;state.materials.steel=(state.materials.steel||0)+3}if(q==='petitions'){state.coins+=20;state.reputation=(state.reputation||0)+2}if(q==='repairs'){state.coins+=15;state.endgame.castleRestoration=(state.endgame.castleRestoration||0)+1}if(q==='apology'){state.coins+=15;state.endgame.lucienRelationship=(state.endgame.lucienRelationship||0)+2}if(q==='friendship'){state.coins+=25;state.endgame.lucienRelationship=(state.endgame.lucienRelationship||0)+3}save()}
function endgameCompleteQuest(q,notice){let e=endgameEnsure();if(e.completedQuests.includes(q))return; e.completedQuests.push(q);endgameReward(q);openEndgameHub(notice)}
function endgameChooseMale(choice){let e=endgameEnsure();e.route='male';e.throneChoice=choice;e.unlocked=true;state.won=true;if(!e.completedQuests.includes('throne')){e.completedQuests.push('throne');endgameReward('throne')}save();openEndgameHub('The Epic Conquest is complete. The aftermath begins.')} 
function endgameChooseFemale(choice){let e=endgameEnsure();e.route='female';e.relationshipChoice=choice;e.unlocked=true;e.lucienRelationship=choice==='stay'?3:choice==='travel'?2:1;state.coins+=20;save();openEndgameHub('Lucien’s redemption journey begins.')} 
function openEndgameEnding(){let e=endgameEnsure();e.route=state.gender==='female'?'female':'male';e.unlocked=false;endgameOpen('endgameEnding');$('#endgameEnding').style.backgroundImage=`url(\"${e.route==='male'?'Textures/UI/Endgame/Throne-Destroy.png':'Textures/UI/Endgame/Throne-Leave-Empty.png'}\")`;let c=$('#endgameEndingContent');if(e.route==='male'){c.innerHTML=`<div class="endgame-kicker">Branch A · Male Savior</div><h1 class="endgame-title">The Epic Conquest</h1><img class="endgame-art" src="Textures/UI/Endgame/Male-Ending-Epic-Conquest.png" alt="The Epic Conquest"><p class="endgame-copy">Lucien is defeated. The castle falls silent, the kingdom celebrates, and the empty throne waits for an answer. What becomes of the symbol of tyranny?</p><div class="endgame-choice-grid"><button class="endgame-choice" data-end-choice="king"><img src="Textures/UI/Endgame/Throne-Become-King.png"><b>Become King</b><small>Take responsibility for the kingdom.</small></button><button class="endgame-choice" data-end-choice="destroy"><img src="Textures/UI/Endgame/Throne-Destroy.png"><b>Destroy the Throne</b><small>End the symbol of tyranny forever.</small></button><button class="endgame-choice" data-end-choice="empty"><img src="Textures/UI/Endgame/Throne-Leave-Empty.png"><b>Leave It Empty</b><small>Walk away from power and keep adventuring.</small></button></div>`}else{c.innerHTML=`<div class="endgame-kicker">Branch B · Female Savior</div><h1 class="endgame-title">The Unlikely Romance</h1><img class="endgame-art" src="Textures/UI/Endgame/Female-Ending-Joined-Hands.png" alt="The Unlikely Romance"><p class="endgame-copy">Lucien’s armor is gone. Beneath the monarch’s cruelty is a lonely paper soul who has never been offered a hand instead of a sword. What kind of future will you offer him?</p><div class="endgame-choice-grid"><button class="endgame-choice" data-end-choice="stay"><img src="Textures/UI/Endgame/Lucien-Emotional.png"><b>Stay With Lucien</b><small>Help him rebuild the castle and his life.</small></button><button class="endgame-choice" data-end-choice="travel"><img src="Textures/UI/Endgame/Lucien-Companion.png"><b>Travel Together</b><small>Take the former monarch on the road.</small></button><button class="endgame-choice" data-end-choice="friends"><img src="Textures/UI/Endgame/Lucien-Vulnerable.png"><b>Remain Friends</b><small>Give him a chance without forcing romance.</small></button></div>`}c.querySelectorAll('[data-end-choice]').forEach(b=>b.onclick=()=>e.route==='male'?endgameChooseMale(b.dataset.endChoice):endgameChooseFemale(b.dataset.endChoice))}
function endgameNewGamePlus(){let e=endgameEnsure();let route=e.route||state.gender==='female'?'female':'male';Object.assign(state,{screen:'map',ng:true,ngPlusRoute:route,stage:0,hub:0,maxHub:4,progress:[5,5,5,5,5],armorSets:{male:0,female:0},unlockedArmor:{male:[0,1,2,3,4,...(state.unlockedArmor?.male||[]).filter(i=>i>=5)],female:[0,1,2,3,4,...(state.unlockedArmor?.female||[]).filter(i=>i>=5)]},hp:state.maxHp,maxHp:state.maxHp,coins:40,won:false});state.endgame={unlocked:false,route:route,newGamePlus:true,throneChoice:null,relationshipChoice:null,reputation:0,lucienRelationship:0,castleRestoration:0,completedQuests:[],challengeWins:0};state.meta=state.meta||{};state.meta.ngPlusBonus=route==='male'?'Royal Aftermath':'Lucien Redemption';save();endgameClose();renderMap();show('map');$('#mapStatus').textContent=route==='male'?'New Game+ · Royal Aftermath: all areas unlocked. The kingdom remembers your conquest.':'New Game+ · Lucien Redemption: all areas unlocked. Your unlikely alliance begins again.';sound('confirm');startMusic()}
function openEndgameHub(notice=''){let e=endgameEnsure();endgameOpen('endgameHub');let c=$('#endgameHubContent');let male=e.route==='male';let qs=male?[['throne','The Throne’s Fate','Decide what the old throne means for the new kingdom.','Resolve the throne decision.'],['petitions','Royal Petitions','Fame has consequences. Help the kingdom with its very ordinary emergencies.','Complete the first wave of petitions.'],['challenge','The Aftermath Arena','Remixed enemies are waiting in the castle ruins.','Win a post-game challenge battle.']]:[['repairs','Repair the Castle','Replace banners, clear rubble, and make the fortress less alarming.','Restore the first section of the castle.'],['apology','The Apology Tour','Visit the people Lucien frightened and let him make amends.','Complete the first apology visit.'],['friendship','Lucien Learns Friendship','Teach a former tyrant how to have one normal conversation.','Complete a friendship lesson.'],['challenge','Redemption Arena','Lucien insists he can help. The arena disagrees.','Win a post-game challenge battle.']];let routeTitle=male?'The Aftermath':'The Redemption Tour';c.innerHTML=`<div class="endgame-kicker">Postgame · ${male?'Epic Conquest':'Unlikely Romance'}</div><h1 class="endgame-title">${routeTitle}</h1><div class="endgame-hub-card"><p class="endgame-copy">${male?'The kingdom is free, but victory created new problems. Decide what to do with fame, power, and the empty throne.':'The castle is still standing, somehow. Help Lucien repair what he broke and learn how to exist around people.'}</p><div class="endgame-stats"><span>Coins: ${state.coins}</span><span>Completed: ${e.completedQuests.length}</span><span>${male?'Reputation: '+(e.reputation||0):'Lucien bond: '+(e.lucienRelationship||0)}</span><span>Challenge wins: ${e.challengeWins||0}</span></div><div class="endgame-quest-grid">${qs.map(q=>{let done=e.completedQuests.includes(q[0]);return `<div class="endgame-quest ${done?'done':''}"><h3>${done?'✓ ':''}${q[1]}</h3><p>${q[2]}<br><small>${q[3]}</small></p>${done?'<button disabled>Completed</button>':`<button data-quest="${q[0]}">${q[0]==='challenge'?'Enter Arena':'Begin Quest'}</button>`}</div>`}).join('')}</div><div class="endgame-notice">${notice}</div><div class="endgame-actions"><button id="endgameReturnMap">Return to Overworld</button><button id="endgameNewGame">New Game+</button></div></div>`;c.querySelectorAll('[data-quest]').forEach(b=>b.onclick=()=>{let q=b.dataset.quest;if(q==='challenge'){e.challengeActive=true;save();endgameClose();startCombat(male?'Gloomfang':'Lich King Timmy',true,5)}else endgameCompleteQuest(q,q==='throne'?'The throne’s future is decided.':q==='petitions'?'The kingdom is grateful.':q==='repairs'?'The castle looks slightly less haunted.':q==='apology'?'Lucien survived his first apology.':'Lucien successfully had a normal conversation.')});$('#endgameReturnMap').onclick=()=>{endgameClose();renderMap();show('map')};$('#endgameNewGame').onclick=()=>endgameNewGamePlus()}
$('#endgameOverlay').addEventListener('click',e=>{if(e.target===e.currentTarget){}},true)
$$('.card').forEach(b=>b.onclick=()=>playCard(b.dataset.card));document.addEventListener('keydown',e=>{if(e.key==='1')window.playCard?.('attack');if(e.key==='2')window.playCard?.('guard');if(e.key==='3')window.playCard?.('magic');if(window.mazeMove){let k=e.key.toLowerCase();if(k==='arrowup'||k==='w')mazeMove(0,-1);if(k==='arrowdown'||k==='s')mazeMove(0,1);if(k==='arrowleft'||k==='a')mazeMove(-1,0);if(k==='arrowright'||k==='d')mazeMove(1,0)}});$('#musicToggle').onclick=()=>toggleMusic();$('#beginBtn').onclick=()=>{state.screen='create';show('create');sound('confirm');startMusic()};$('#continueBtn').onclick=()=>{if(state.screen==='map'||state.screen==='combat'||state.screen==='end'){if(state.screen==='map'){renderMap();show('map')}else if(state.screen==='village'){show('village');renderVillage()}else if(state.screen==='interior'){show('village');renderVillage()}else show('create')}};$('#retreatBtn').onclick=()=>{renderMap();show('map')};$('#endMapBtn').onclick=()=>{state.hub=4;renderMap();show('map')};$('#ngBtn').onclick=()=>{Object.assign(state,{screen:'map',ng:true,stage:0,hub:0,maxHub:4,progress:[5,5,5,5,5],armorSets:{male:0,female:0},unlockedArmor:{male:[0,1,2,3,4],female:[0,1,2,3,4]},hp:state.maxHp,coins:40,won:false});renderMap();show('map')};$('#villageBtn').onclick=()=>goVillage();$('#leaveVillage').onclick=()=>{renderMap();show('map')};$('#villageSave').onclick=()=>{save();$('#villageStatus').textContent='Village saved. The cardboard remembers your furniture.'};$('#closeFacility').onclick=closeFacility;$('#backToVillage').onclick=closeFacility;$('#closeLevel').onclick=closeLevelSelect;$$('[data-facility]').forEach(b=>b.onclick=()=>openFacility(b.dataset.facility));$('#saveBtn').onclick=()=>{$('#mapStatus').textContent='Saved to localStorage. The cardboard remembers.';save()};
let musicTimer=null, musicStep=0, musicBus=null;
function audioContext(){let A=window.AudioContext||window.webkitAudioContext;if(!A)return null;let a=window._a||(window._a=new A());if(a.state==='suspended')a.resume();return a}
function sound(type){try{let a=audioContext();if(!a)return;let o=a.createOscillator(),g=a.createGain();o.type=type==='thunder'?'sawtooth':'triangle';o.frequency.value=type==='win'?660:type==='magic'?520:type==='thunder'?90:260;o.frequency.exponentialRampToValueAtTime(type==='attack'?90:330,a.currentTime+.18);g.gain.setValueAtTime(.06,a.currentTime);g.gain.exponentialRampToValueAtTime(.001,a.currentTime+.22);o.connect(g).connect(a.destination);o.start();o.stop(a.currentTime+.23)}catch(e){}}
function musicNote(freq,duration=.32,volume=.065,type='triangle'){let a=audioContext();if(!a)return;let o=a.createOscillator(),g=a.createGain(),f=a.createBiquadFilter();o.type=type;o.frequency.setValueAtTime(freq,a.currentTime);f.type='lowpass';f.frequency.value=2200;g.gain.setValueAtTime(0,a.currentTime);g.gain.linearRampToValueAtTime(volume,a.currentTime+.025);g.gain.exponentialRampToValueAtTime(.001,a.currentTime+duration);o.connect(f).connect(g).connect(musicBus||a.destination);o.start();o.stop(a.currentTime+duration)}
const MUSIC_FILES={
 'start':'Audio/start-screen.ogg','create':'Audio/character-creation.ogg','village':'Audio/Village.ogg','map':'Audio/overworld-map.ogg',
 'cathedral':'Audio/cathedral.ogg','blacksmith':'Audio/blacksmith.ogg','merchant':'Audio/merchant.ogg','house':'Audio/house.ogg',
 'combat-0':'Audio/combat-placenta-creek.ogg','combat-1':'Audio/combat-mild-inconvenience.ogg','combat-2':'Audio/combat-grave-mistake.ogg','combat-3':'Audio/combat-questionable-decisions.ogg','combat-4':'Audio/combat-dread-fortress.ogg','boss':'Audio/boss-dread-fortress.ogg'};
let musicOn=false,musicAudio=null,currentMusicKey='',musicFadeTimer=null;
function musicKey(){if($('#introExperience')?.classList.contains('open')||$('#endgameOverlay')?.classList.contains('open'))return null;if(state.screen==='start')return'start';if(state.screen==='create')return'create';if(state.screen==='village')return'village';if(state.screen==='interior')return state._building||'village';if(state.screen==='map')return'map';if(state.screen==='combat'){if(typeof combat!=='undefined'&&combat.boss&&state.hub===4)return'boss';return'combat-'+(state.hub||0)}return null}
function musicPath(key){return MUSIC_FILES[key]||MUSIC_FILES.village}
function musicFallbackPath(key){return musicPath(key).replace(/^Audio\//,'MP3/').replace(/\.ogg(?:\?.*)?$/i,'.mp3')}
function fadeAudio(audio,target,duration=450){if(!audio)return;let from=audio.volume,started=performance.now();clearInterval(audio._fade);audio._fade=setInterval(()=>{let t=Math.min(1,(performance.now()-started)/duration);audio.volume=from+(target-from)*t;if(t>=1){clearInterval(audio._fade);audio._fade=null}},30)}
function syncMusic(){if(!musicOn){return}let key=musicKey();if(key===currentMusicKey&&((musicAudio&&!musicAudio.paused)||musicFadeTimer))return;if(!key){if(musicAudio&&!musicAudio.paused){fadeAudio(musicAudio,0);setTimeout(()=>musicAudio?.pause(),480)}currentMusicKey='';return}let old=musicAudio;if(old&&!old.paused){fadeAudio(old,0);setTimeout(()=>{old.pause();old.remove?.()},480)}clearTimeout(musicFadeTimer);currentMusicKey=key;let a=new Audio(musicPath(key));a.loop=true;a.volume=0;a.preload='auto';musicAudio=a;a.style.display='none';a.setAttribute('aria-hidden','true');let fallbackTried=false;a.addEventListener('error',()=>{if(!fallbackTried){fallbackTried=true;a.src=musicFallbackPath(key);a.load();a.play().then(()=>fadeAudio(a,.68,700)).catch(()=>{currentMusicKey='';})}else{currentMusicKey='';}});document.body.appendChild(a);a.play().then(()=>fadeAudio(a,.68,700)).catch(()=>{});}
function updateMusicButton(on){const button=$('#musicToggle');if(!button)return;button.setAttribute('aria-pressed',String(on));button.setAttribute('aria-label',on?'Mute soundtrack':'Play soundtrack');button.title=on?'Mute soundtrack':'Play soundtrack';button.classList.toggle('is-playing',on)}
function startMusic(){musicOn=true;updateMusicButton(true);syncMusic()}
function stopMusic(){musicOn=false;clearTimeout(musicFadeTimer);if(musicAudio){fadeAudio(musicAudio,0);let a=musicAudio;setTimeout(()=>a.pause(),480)}musicAudio=null;currentMusicKey='';updateMusicButton(false)}
function toggleMusic(){musicOn?stopMusic():startMusic()}
setInterval(syncMusic,300);
const fx=$('#fx'),ctx=fx.getContext('2d');function resize(){let r=fx.getBoundingClientRect(),d=devicePixelRatio||1;fx.width=r.width*d;fx.height=r.height*d;ctx.setTransform(d,0,0,d,0,0)}addEventListener('resize',resize);resize();function burst(type){let r=fx.getBoundingClientRect(),p=[];for(let i=0;i<24;i++)p.push({x:r.width*.55,y:r.height*.45,vx:(Math.random()-.5)*8,vy:(Math.random()-.8)*8,l:1,c:type==='magic'?'#e6bc5a':'#f2e4bd'});let t=0;function f(){ctx.clearRect(0,0,r.width,r.height);p.forEach(q=>{q.x+=q.vx;q.y+=q.vy;q.vy+=.18;q.l-=.025;ctx.globalAlpha=Math.max(0,q.l);ctx.fillStyle=q.c;ctx.fillRect(q.x,q.y,6,6)});ctx.globalAlpha=1;if(t++<42)requestAnimationFrame(f)}f()}
function intro(){let c=$('#introCanvas'),x=c.getContext('2d');function fit(){let r=c.getBoundingClientRect(),d=devicePixelRatio||1;c.width=r.width*d;c.height=r.height*d;x.setTransform(d,0,0,d,0,0)}function draw(t=0){let r=c.getBoundingClientRect(),w=r.width,h=r.height;x.clearRect(0,0,w,h);x.fillStyle='#2e213b';x.fillRect(0,0,w,h);for(let i=0;i<9;i++){x.fillStyle=i%2?'#4c3157':'#604062';x.beginPath();x.moveTo(i*w/9,h);x.lineTo((i+.5)*w/9, h*.12+(i%3)*30);x.lineTo((i+1)*w/9,h);x.fill()}x.fillStyle='#17121f';x.beginPath();x.moveTo(w*.63,h*.78);x.lineTo(w*.65,h*.32);x.lineTo(w*.73,h*.16);x.lineTo(w*.82,h*.3);x.lineTo(w*.88,h*.78);x.fill();x.strokeStyle='#0a0810';x.lineWidth=8;x.stroke();x.fillStyle='#d7b460';x.beginPath();x.arc(w*.75,h*.3,10+Math.sin(t/200)*2,0,7);x.fill();if(Math.random()<.02){x.strokeStyle='#e4f3ee';x.lineWidth=3;x.beginPath();x.moveTo(w*.12,0);x.lineTo(w*.19,h*.24);x.lineTo(w*.15,h*.35);x.stroke()}requestAnimationFrame(draw)}addEventListener('resize',fit);fit();draw()}setupCreate();intro();ensureProgress();if(state.screen==='map'){renderMap();show('map')}else if(state.screen==='village'){show('village');renderVillage()}else if(state.screen==='interior'){show('village');renderVillage()}else if(state.screen==='end'&&state.won){showEnd()}else if(state.screen==='create'){show('create')}

/* Enhanced title flow, illustrated maps, weather, and character-led interiors. */
(()=>{const DATA={'START_BG': 'Textures/Maps/start-background.jpg', 'VILLAGE_BG': 'Textures/Maps/village.jpg', 'OVERWORLD_BG': 'Textures/Maps/overworld-background.jpg', 'PRIEST': 'Textures/NPCs/priest-variant-2.png', 'BLACKSMITH': 'Textures/NPCs/blacksmith-variant-2.png', 'MERCHANT': 'Textures/NPCs/merchant-variant-2.png'};
 const OVERWORLD_CORRECT='Textures/Maps/overworld-background.jpg'; const NPC={'Priest': 'Textures/NPCs/priest-variant-3.png', 'Merchant': 'Textures/NPCs/merchant-variant-3.png', 'Blacksmith': 'Textures/NPCs/blacksmith-variant-3.png'}; const AREA_BGS={'PLACENTA': 'Textures/Maps/Areas/placenta.jpg', 'MILD': 'Textures/Maps/Areas/mild.jpg', 'GRAVE': 'Textures/Maps/Areas/grave.jpg', 'QUESTION': 'Textures/Maps/Areas/question.jpg', 'MONARCH': 'Textures/Maps/Areas/monarch.jpg'}; const oldRenderMap=window.renderMap, oldRenderVillage=window.renderVillage; window.drawScene=(canvas)=>{if(canvas){const x=canvas.getContext("2d");x.clearRect(0,0,canvas.width,canvas.height)}};
 const savedPlayable=state.screen==='start'?'create':state.screen; state.resumeScreen=savedPlayable;
 function setWeather(root,label){const won=!!state.won;const clock=window.gameClock?.getState?.();const hour=clock?.hour24??new Date().getHours();const night=clock?clock.isNight:(hour<6||hour>=19);const pre=['Haze','Fog','Gloom'];const post=['Haze','Fog','Rainbow'];const weather=(won?post:pre)[Math.floor((Date.now()/3600000)%3)];const el=$(root);if(!el)return;el.className='weather-'+weather.toLowerCase().replace(' ','-');el.querySelector('.weather-label').textContent=(night?'Night · ':'')+weather;}
 function refreshAtmosphere(){document.querySelector('.map')?.classList.toggle('won',!!state.won);document.querySelector('.village')?.classList.toggle('won',!!state.won);setWeather('#mapWeather','mapWeatherLabel');setWeather('#villageWeather','villageWeatherLabel');}
 function spots(){const wrap=$('#mapHotspots');if(!wrap)return;const pts=[[8,86],[40,78],[59,63],[78,78],[87,27]];wrap.innerHTML=hubs.map((h,i)=>{const locked=i>state.maxHub;return `<button type="button" class="map-spot ${locked?'locked':''}" style="left:${pts[i][0]}%;top:${pts[i][1]}%" data-map-hub="${i}" aria-label="${h[0]}${locked?' · Locked':''}" aria-disabled="${locked}"><span class="map-spot-symbol" aria-hidden="true">${locked?'⌑':'◆'}</span><span class="map-spot-label">${h[0]}${locked?' · Locked':''}</span></button>`}).join('');$$('[data-map-hub]').forEach(b=>b.onclick=()=>{if(b.getAttribute('aria-disabled')==='true'){b.classList.add('map-spot-revealed');setTimeout(()=>b.classList.remove('map-spot-revealed'),2400);return}openLevelSelect(+b.dataset.mapHub)});}
 window.renderMap=()=>{oldRenderMap();const c=$('#mapCanvas');c.getContext('2d').clearRect(0,0,c.width,c.height);const ng=state.ng?window.getNgPlusVisuals?.():null,mapArt=ng?.overworldDay||OVERWORLD_CORRECT;c.style.setProperty("background-image",`url("${mapArt}")`,"important");c.style.backgroundSize='cover';c.style.backgroundPosition='center';spots();refreshAtmosphere();};
 window.renderVillage=()=>{ensureProgress();$('#villageName').textContent='Placenta Creek';$('#villageHp').textContent=state.hp;$('#villageCoins').textContent=state.coins;$('#villageStatus').textContent=`${state.won?'The monarch is defeated. ':'The village waits beneath the gloom. '}Armor: ${ARMOR_NAMES[state.armorSets[state.gender]||0]}.`;stopVillageAnimation();const c=$('#villageCanvas');const x=c.getContext('2d');x.clearRect(0,0,c.width,c.height);c.style.backgroundImage=`url("${DATA.VILLAGE_BG}")`;c.style.backgroundSize='cover';c.style.backgroundPosition='center';refreshAtmosphere();};
 const characters={cathedral:['Priest','Textures/NPCs/priest.png',['The light welcomes you, child. Try not to track mud over the sanctum.','A blessing? Certainly. A sensible question in an unreasonable kingdom.','You look like someone who has met a boss and regretted it.']],blacksmith:['Blacksmith','Textures/NPCs/blacksmith.png',['Need a sharper edge? I have one. It is probably haunted.','The forge is hot, the steel is stubborn, and your purse looks light.','If it breaks, bring it back. If it explodes, pretend we never met.']],merchant:['Merchant','Textures/NPCs/merchant.png',['Fresh wares! Mostly fresh, anyway. The labels are optimistic.','You have the look of someone who needs a bargain and a miracle.','Welcome, traveler. Please admire something before asking its price.']],home:['Your House','', ['Home sweet home. It smells faintly of victory.','Your furniture is judging your combat technique.','A quiet corner of Placenta Creek, for once.']]};
 const partings=['Safe travels, brave little disaster.','Come back soon. Preferably with coins.','May your next decision be only moderately questionable.'];
 function interior(type){const c=characters[type]||characters.home;state._building=type;$('#interiorTitle').textContent=c[0];$('#interiorImage').src=BUILDING_BACKGROUNDS[type]||BUILDING_BACKGROUNDS.home;if(type==='home'){$('#interiorCharacter').removeAttribute('src');$('#interiorCharacter').hidden=true}else{$('#interiorCharacter').src=c[1];$('#interiorCharacter').hidden=false}const backdrop=document.querySelector('.interior-backdrop');if(backdrop)backdrop.style.backgroundImage=`linear-gradient(rgba(18,13,24,.12),rgba(18,13,24,.28)),url("${BUILDING_BACKGROUNDS[type]||BUILDING_BACKGROUNDS.home}")`;let greet=c[2][Math.floor(Math.random()*3)];$('#interiorContent').innerHTML=`<div class="dialog-character"><div><h2>${c[0]}</h2><p>${greet}</p></div></div><div class="dialog-buttons"><button data-dialog-action="continue">Continue</button></div>`;show('interior');$$('[data-dialog-action]').forEach(b=>b.onclick=()=>{if(b.dataset.dialogAction==='continue')showOptions(type)});}
 function inventoryMarkup(){ensureProgress();return `<div class="inventory-line">Coins: ◈ ${state.coins} · HP: ❤ ${state.hp}/${state.maxHp}</div><div class="shop-grid"><span>Leather: ${state.materials.leather}</span><span>Bones: ${state.materials.bones}</span><span>Demon steel: ${state.materials.steel}</span><span>Weapon Lv: ${state.weaponLevel}</span><span>Armor Lv: ${state.armorLevel}</span><span>Magic: ${state.gear==='magic'?state.affinity:'none'}</span></div>`;}
 function showOptions(type){const c=characters[type]||characters.home;let body='';if(type==='cathedral')body=`<div class="dialog-character"><div><h2>${c[0]}</h2>${inventoryMarkup()}<p>What can I help you with?</p></div></div><div class="dialog-buttons"><button data-dialog-action="heal">Heal to full · 8 coins</button><button data-dialog-action="pray">Pray · restore 4 HP</button><button data-dialog-action="leave">Leave building</button></div>`;if(type==='blacksmith')body=`<div class="dialog-character"><div><h2>${c[0]}</h2>${inventoryMarkup()}<p>Steel, leather, and a little bad judgment. Choose your work.</p></div></div><div class="dialog-buttons"><button data-dialog-action="craftWeapon">Upgrade weapon · ${12+(state.weaponLevel||0)*8} coins + leather</button><button data-dialog-action="craftArmor">Upgrade armor · 8 coins + bone</button><button data-dialog-action="leave">Leave building</button></div>`;if(type==='merchant')body=`<div class="dialog-character"><div><h2>${c[0]}</h2>${inventoryMarkup()}<p>Browse, buy, or sell. I promise the prices are only slightly criminal.</p></div></div><div class="dialog-buttons"><button data-dialog-action="magic">Buy magic · 18 coins</button><button data-dialog-action="leather">Buy leather · 5 coins</button><button data-dialog-action="bones">Buy bones · 7 coins</button><button data-dialog-action="sellLeather">Sell leather · +3 coins</button><button data-dialog-action="sellBones">Sell bones · +5 coins</button><button data-dialog-action="sellSteel">Sell demon steel · +12 coins</button><button data-dialog-action="leave">Leave building</button></div>`;if(type==='home')body=`<div class="dialog-character"><div><h2>${c[0]}</h2>${inventoryMarkup()}<p>Nothing to buy here. The walls are free.</p></div></div><div class="dialog-buttons"><button data-dialog-action="leave">Leave building</button></div>`;$('#interiorContent').innerHTML=body;$$('[data-dialog-action]').forEach(b=>b.onclick=()=>{const a=b.dataset.dialogAction;if(a==='heal'&&state.coins>=8){state.coins-=8;state.hp=state.maxHp;dialogNotice('Your wounds close. The priest looks smug.')}else if(a==='pray'){state.hp=Math.min(state.maxHp,state.hp+4);dialogNotice('A small blessing settles over you.')}else if(a==='craftWeapon'){if(state.coins>=12+(state.weaponLevel||0)*8&&state.materials.leather>=1){state.coins-=12+(state.weaponLevel||0)*8;state.materials.leather--;state.weaponLevel++;dialogNotice('The blacksmith upgrades your weapon.')}else dialogNotice('Not enough coins or leather.')}else if(a==='craftArmor'){if(state.coins>=8&&state.materials.bones>=1){state.coins-=8;state.materials.bones--;state.armorLevel++;state.maxHp+=3;state.hp=state.maxHp;dialogNotice('The blacksmith reinforces your armor.')}else dialogNotice('Not enough coins or bones.')}else if(a==='magic'){if(state.coins>=18){state.coins-=18;state.gear='magic';state.affinity=state.affinity||'fire';dialogNotice('The merchant sells you a suspiciously sparkly magic focus.')}else dialogNotice('The merchant checks your purse.')}else if(['leather','bones'].includes(a)){const price=a==='leather'?5:7;if(state.coins>=price){state.coins-=price;state.materials[a]++;dialogNotice(`You bought ${a}.`)}else dialogNotice('Not enough coins.')}else if(a.startsWith('sell')){const item=a.slice(4).toLowerCase();if(state.materials[item]>0){state.materials[item]--;state.coins+=item==='leather'?3:item==='bones'?5:12;dialogNotice(`Sold ${item} for coins.`)}else dialogNotice(`You have no ${item} to sell.`)}else if(a==='leave')leaveInterior();});}
 function leaveInterior(){const c=characters[state._building||'home']||characters.home;const goodbye=partings[Math.floor(Math.random()*3)];$('#interiorContent').innerHTML=`<div class="parting"><h2>${c[0]}</h2><p>${goodbye}</p><div class="dialog-buttons"><button data-dialog-action="return">Return to village</button></div></div>`;$('#interiorContent [data-dialog-action="return"]').onclick=()=>{show('village');renderVillage()};}

 function dialogNotice(msg){const old=$('#noticeOverlay');old?.remove();const d=document.createElement('div');d.id='noticeOverlay';d.className='road-event compact-notice';d.innerHTML=`<div class="road-event-card"><h2>Notice</h2><p>${esc(msg)}</p><button data-dismiss-notice>Continue</button></div>`;document.querySelector('.game').appendChild(d);d.querySelector('[data-dismiss-notice]').onclick=()=>d.remove();window.dialogNotice=dialogNotice}
 window.dialogNotice=dialogNotice;
 window.openFacility=type=>{const fade=$('#fadeTransition');fade.classList.add('active');setTimeout(()=>{fade.classList.remove('active');interior(type)},340)};
 window.closeFacility=()=>leaveInterior();
 $$('[data-facility]').forEach(b=>b.onclick=()=>{state._building=b.dataset.facility;openFacility(b.dataset.facility)});$('#backToVillage').onclick=()=>{show('village');renderVillage()};
 $('#startPrompt').onclick=()=>{const prompt=$('#startPrompt'),choices=$('#saveChoice'),isOpen=choices.classList.toggle('open');prompt.classList.toggle('start-prompt-dismissed',isOpen);prompt.setAttribute('aria-expanded',String(isOpen));};$('#newGameChoice').onclick=()=>{localStorage.removeItem('demonBummerState');Object.assign(state,{screen:'create',playerName:'Kuro',gender:'male',combatSpeed:'normal',gear:'sword',affinity:'water',hp:30,maxHp:30,coins:24,hub:0,stage:0,ng:false,won:false,materials:{leather:2,bones:0,steel:0},furniture:[],weaponLevel:0,armorLevel:0,progress:[0,0,0,0,0],maxHub:0,armorSets:{male:0,female:0},unlockedArmor:{male:[0],female:[0]}});$('#saveChoice').classList.remove('open');window.refreshCreationScreen?.();show('create');sound('confirm');startMusic()};$('#continueChoice').onclick=()=>{const s=state.resumeScreen||'create';$('#saveChoice').classList.remove('open');if(s==='map'){renderMap();show('map')}else if(s==='village'){show('village');renderVillage()}else if(s==='interior'){show('village');renderVillage()}else {window.refreshCreationScreen?.();show('create')}startMusic()};
 let actionBusy=false;function comicPop(text,kind=''){const f=$('#combat').querySelector('.battle-field');if(kind==='crit')f.querySelectorAll('.comic-pop').forEach(x=>x.remove());const e=document.createElement('div');e.className='comic-pop '+kind;e.textContent=text;f.appendChild(e);setTimeout(()=>e.remove(),720)}
 function battleBossPhaseText(name,phase){const moves={"Gloomfang":['Shadow Pounce','Moonless Ambush'],"Lich King Timmy":['Crown Decree','Royal Reanimation'],"Minotaur with Anxiety":['Long Corridor Charge','Maze Panic'],"Monarch Lucien":['Throne Guard','Desperate Decree'],"Sir Barnaby":['Shield Salute','Last-Stand Lunge'],"Crown Revenant":['Dead King’s Decree','Crownfall'],"Petition Beast":['Red Tape Barrage','Final Notice'],"Ashen Throne Warden":['Molten Advance','Cinder Lock'],"Rogue Goose Marshal":['Martial Honk','Winged Tribunal'],"Lucien Redeemed":['Honest Duel','Second Chance'],"Roadshade Mimic":['False Bargain','Devouring Market'],"Peacemaker Sentinel":['Measured Judgment','Last Accord'],"Timeline Devourer":['Timeline Collapse','Erase the Save'],"Legacy Echo":['Mirror Stance','Old Habit']};const list=moves[name]||['Enraged Counter','Desperation Strike'];return list[Math.max(0,phase-2)]||list[list.length-1]}
function battleUpdateBossPhase(){if(!combat?.boss)return '';const ratio=combat.enemyHp/Math.max(1,combat.enemyMax),phase=ratio<=.33?3:ratio<=.66?2:1,previous=combat.bossPhase||1;if(phase>previous){combat.bossPhase=phase;return `${combat.enemy} enters Phase ${phase}: ${battleBossPhaseText(combat.enemy,phase)}.`}combat.bossPhase=phase;return ''}
function battleSetIntent(){if(!combat)return;const lines=ENEMY_WARNING_LINES[combat.enemy]||['The enemy shifts its weight.','The enemy moves through the edge of your vision.','The enemy studies your stance in silence.','The enemy settles into a guarded posture.','The enemy prepares something difficult to identify.'];let index=Math.floor(Math.random()*lines.length);if(lines.length>1&&index===WARNING_TYPES.indexOf(combat.lastIntentType))index=(index+1)%lines.length;combat.lastIntentType=WARNING_TYPES[index]||'heavy';combat.intentType=combat.lastIntentType;combat.intentSerial=(combat.intentSerial||0)+1;combat.intentText=lines[index];combat.enemyDodgeBonus=combat.intentType==='dodge'?(combat.boss?.17:.15):0;const prompt=$('#battlePrompt'),detail=$('#battleDetail');if(prompt)prompt.textContent='Enemy movement';if(detail){detail.classList.remove('combat-resisted','combat-weak','combat-blocked');detail.textContent=combat.intentText}window.finalizeEnemyIntent?.()}
window.battleSetIntent=battleSetIntent;
function battleEnemyCounter(){
  if(window.__debugFlags?.godMode){if(combat){combat.playerHp=state.maxHp;state.hp=state.maxHp;combat.guard=false;combat.turnActionUsed=false;updateBars();battleSetIntent?.()}actionBusy=false;window.__combatEnemyTurn=false;return}
  if(!combat||combat.enemyHp<=0){actionBusy=false;return}
  window.__combatEnemyTurn=true;
  if(combat.staggerQueued){combat.staggerQueued=false;window.__battleSkipEnemyTurn();return}
  const statusTick=window.tickCombatEnemyStatus?.()||{notes:[],defeated:false};
  if(statusTick.defeated){const done=()=>{actionBusy=false;window.__combatEnemyTurn=false;victory()};const body=statusTick.notes.join(' ');window.battleNotice?window.battleNotice('Status effect damage',body).then(done):done();return}
  const moveType=combat.intentType||'heavy';
  advancePlayerDebuffs();
  if(combat.guard&&state.gear==='bow'&&Math.random()<(['heavy','charge'].includes(moveType)?.75:.5)){
    combat.guard=false;combat.turnActionUsed=false;combat.enemyDodgeBonus=0;
    window.classImpact?.('player','evade');
    const body=`${statusTick.notes.length?statusTick.notes.join(' ')+' ':''}${state.playerName} slips clear of ${combat.enemy}'s attack. Hit me if you can.`;
    $('#battleDetail').textContent=body;
    const finish=()=>{const note=tickCombatPlayerStatus(),ready=()=>{if(combat.playerHp<=0){actionBusy=false;window.__combatEnemyTurn=false;window.deathScreen('Your health bar has filed for bankruptcy.');return}window.__combatEnemyTurn=false;actionBusy=false;battleSetIntent();$('#battlePrompt').textContent=`What will ${state.playerName} do?`};if(note&&window.battleNotice)window.battleNotice('Status effect damage',note).then(ready);else ready()};
    window.battleNotice?window.battleNotice('DODGE!',body).then(finish):finish();return;
  }
  let guarded=!!combat.guard,
      incoming=Math.max(2,Math.floor((combat.boss?12:7+state.hub*2)*(guarded?.5:1))),
      phase=combat.boss?Math.max(1,combat.bossPhase||1):1;
  if(combat.boss)incoming+=phase===2?2:phase===3?4:0;
  if(combat.ngDamageMult)incoming=Math.max(1,Math.ceil(incoming*combat.ngDamageMult));
  if(moveType==='heavy')incoming=Math.ceil(incoming*1.5);
  if(moveType==='fast')incoming=Math.max(1,Math.floor(incoming*.7));
  if(moveType==='charge')incoming=Math.ceil(incoming*1.8);
  if(moveType==='dodge')incoming=Math.max(1,Math.floor(incoming*.75));
  if(moveType==='status')incoming=Math.max(1,Math.floor(incoming*.9));
  if(combat.soakedTurns>0)incoming=Math.max(1,Math.floor(incoming*.7));
  if(combatHasStatus('Armor Break'))incoming=Math.max(1,Math.ceil(incoming*1.25));
  let armor=Number(state.armorSets?.[state.gender]||0),passive=armor===0?'royal':armor===1?'forest':armor===2?'grave':armor===3?'fortress':armor===4?'fool':'side';
  if(passive==='fortress')incoming=Math.max(1,Math.floor(incoming*.8));
  if(passive==='grave'&&Math.random()<.25)incoming=Math.max(1,incoming-2);
  if(state.hub===1&&combat.ambush)incoming+=3;
  incoming=Math.max(1,Math.ceil(incoming*(1-activeClassStats().defense)));
  if(Number(state.armorSets?.[state.gender])===6&&guarded)incoming=Math.max(1,Math.ceil(incoming*.9));
  if(Number(state.armorSets?.[state.gender])===9&&window.villageRaid?.active)incoming=Math.max(1,Math.ceil(incoming*.9));
  combat.playerHp-=incoming;combat.guard=false;state.hp=Math.max(1,combat.playerHp);updateBars();
  if(combat.playerHp>0&&Math.random()<(Number(state.armorSets?.[state.gender])===8?.4:.5)&&!combatHasStatus('Bleeding')){combat.playerStatuses=combat.playerStatuses||[];combat.playerStatuses.push('Bleeding');combat.playerBleedingTurns=2;window.refreshCombatStatusUI?.();window.bloodDropEffect?.($('#playerArt'));}
  if(incoming>0){window.classImpact?.('player',guarded?'block':'enemy',combat.boss);window.triggerCombatShake?.('enemy-hit')}
  window.floatDamageNumber?.($('#playerArt'),incoming,{guarded});$('#playerArt')?.classList.add('hit-shake');setTimeout(()=>$('#playerArt')?.classList.remove('hit-shake'),360);
  const debuff=applyEnemySignatureDebuff(moveType==='status'?(combat.boss?.45:.35):undefined);
  let body=`${statusTick.notes.length?statusTick.notes.join(' ')+' ':''}${combat.enemy} hits for ${incoming} damage${guarded?' after Guard reduction':''}.${debuff?' '+debuff:''}`;
  if(combat.boss&&phase===3&&combat.enemy==='Lich King Timmy'&&!guarded){state.meta.statuses=state.meta.statuses||[];if(!state.meta.statuses.includes('Cursed'))state.meta.statuses.push('Cursed');body+=' Cursed applied.'}
  let counterDmg=0;
  if(guarded&&combat.playerHp>0&&state.gear==='sword'&&combat.enemyHp>0&&Math.random()<(['heavy','charge'].includes(moveType)?.75:.5)){counterDmg=Math.max(1,8+(state.weaponLevel||0)*2+(Number(state.armorSets?.[state.gender])===12&&combat.boss?2:0));combat.enemyHp=Math.max(0,combat.enemyHp-counterDmg);updateBars();window.floatDamageNumber?.($('#enemyArt'),counterDmg);comicPop('COUNTER!','counter');body+=` Guard counterattack deals ${counterDmg} damage.`;
    if(combat.enemyHp>0&&!['Zombie Wolf','Monarch Lucien'].includes(combat.enemy)&&Math.random()<.35){window.applyBleeding?.(counterDmg);body+=' Counterattack causes Bleeding.';window.classImpact?.('enemy','bleed')}
    if(combat.enemyHp>0&&!combat.staggerQueued&&Math.random()<(combat.boss?.12:.24)){combat.staggerQueued=true;body+=' Counterattack staggers the enemy for its next action.';window.classImpact?.('enemy','stagger')}
  }
  $('#battleDetail').textContent=body;comicPop(moveType==='heavy'?'CRUSH!':moveType==='charge'?'IMPACT!':moveType==='fast'?'RAPID!':'SMACK!');sound('thunder');
  const finish=()=>{const statusNote=tickCombatPlayerStatus(),done=()=>{if(combat.playerHp<=0){actionBusy=false;window.__combatEnemyTurn=false;window.deathScreen('Your health bar has filed for bankruptcy.');return}window.__combatEnemyTurn=false;combat.turnActionUsed=false;actionBusy=false;battleSetIntent();$('#battlePrompt').textContent=`What will ${state.playerName} do?`};if(statusNote&&window.battleNotice)window.battleNotice('Status effect damage',statusNote).then(done);else done()};
  if(combat.enemyHp<=0){const done=()=>{actionBusy=false;window.__combatEnemyTurn=false;victory()};window.battleNotice?window.battleNotice(`${state.playerName}'s guard counterattack!`,body).then(done):done();return}
  const enemyResult=combat.playerHp<=0?`${state.playerName} was defeated!`:incoming>0?`${state.playerName} took ${incoming} damage!`:`${state.playerName} was unharmed!`;window.battleNotice?window.battleNotice(enemyResult,body).then(finish):finish()
}
function sequencePlayCard(card){if(actionBusy||!screens.find(x=>x.id==='combat').classList.contains('active')||window.__battleNoticeOpen)return;if(state.gear==='magic'&&card==='attack')card='magic';if(card==='magic'&&state.gear==='magic'&&(combat.playerMana||0)<3){const body='Not enough mana. Guard to recover 2 mana.';const reset=()=>{actionBusy=false;combat.turnActionUsed=false;updateBars()};window.battleNotice?window.battleNotice('Not enough mana',body).then(reset):reset();return}actionBusy=true;combat.turnActionUsed=true;window.__combatEnemyTurn=false;const statusNote='';const btn=document.querySelector(`#combat .card[data-card="${card}"]`);btn?.classList.add('is-acting');setTimeout(()=>btn?.classList.remove('is-acting'),520);const rules={'Slime Rat':{weak:['bow'],resist:['magic'],statusResist:[]},'Zombie Wolf':{weak:['magic'],resist:['bow'],statusResist:['Bleeding']},'Skeleton Archer':{weak:['sword'],resist:['bow'],statusResist:[]},'Lich King Timmy':{weak:['light'],resist:['dark'],statusResist:['Cursed']},'Monarch Lucien':{weak:['sword','light'],resist:['all'],statusResist:['Bleeding']},'Crown Revenant':{weak:['light','magic'],resist:['bow'],statusResist:['Bleeding']},'Petition Beast':{weak:['sword','fire'],resist:['bow'],statusResist:[]},'Ashen Throne Warden':{weak:['water','magic'],resist:['sword'],statusResist:['Burning']},'Rogue Goose Marshal':{weak:['bow'],resist:['magic'],statusResist:['Confused']},'Lucien Redeemed':{weak:['bow'],resist:['dark'],statusResist:['Cursed']},'Roadshade Mimic':{weak:['fire','sword'],resist:['bow'],statusResist:['Confused']},'Peacemaker Sentinel':{weak:['dark','sword'],resist:['light'],statusResist:['Weakened']},'Timeline Devourer':{weak:['light'],resist:['bow'],statusResist:['Cursed','Bleeding']},'Legacy Echo':{weak:[],resist:[],statusResist:['Confused']}};let rule=rules[combat.enemy]||(/Gloomfang|Timberwolf/.test(combat.enemy)?{weak:['magic'],resist:['bow'],statusResist:[]}:{weak:[],resist:[],statusResist:[]}),armor=Number(state.armorSets?.[state.gender]||0),passive=armor===0?'royal':armor===1?'forest':armor===2?'grave':armor===3?'fortress':armor===4?'fool':'side',guardedCrit=card==='attack'&&!!state.meta.guardNext;if(card==='attack'&&state.meta.guardNext)state.meta.guardNext=false;let crit=card==='attack'&&(guardedCrit?Math.random()<.5:Math.random()<.1),weapon=state.gear==='sword'?'sword':state.gear==='bow'?'bow':'magic',base=card==='attack'?activeClassStats().damage+(state.weaponLevel||0)*2:card==='magic'?(weapon==='magic'?activeClassStats().damage+(state.weaponLevel||0)*2:3):0;if(combat.soakedTurns>0&&(card==='attack'||card==='magic'))base+=3;let type=weapon==='magic'?(state.affinity==='light'?'light':state.affinity==='dark'?'dark':'magic'):weapon,mult=1,detail='';if(statusNote)detail+=` ${statusNote}`;if(combatHasStatus('Weakened')){base=Math.max(0,Math.floor(base*.75));detail+=' Weakened reduces your damage.'}if(combatHasStatus('Confused')&&(card==='attack'||card==='magic')&&Math.random()<.2){base=0;detail+=' Confusion causes the attack to miss.'}if(card==='attack'||card==='magic'){if(rule.weak.includes(type)||rule.weak.includes(weapon)){mult*=1.5;detail=' Weakness hit!'}if(rule.resist.includes(type)||rule.resist.includes(weapon)||rule.resist.includes('all')){mult*=.65;detail+=' Resisted.'}}if(passive==='forest'&&weapon==='bow')mult*=1.2;if(passive==='royal'&&guardedCrit)crit=Math.random()<.65;if(passive==='fool'&&Math.random()<.12){mult*=2;detail+=' Fool’s luck!'}let dodged=false,currentDodgeBonus=Number(combat.enemyDodgeBonus||0),dmg=0;if((card==='attack'||card==='magic')&&Math.random()<(combat.boss?.08:.05)+currentDodgeBonus+(1-Math.min(1,activeClassStats().accuracy+(Number(state.armorSets?.[state.gender])===11?.05:0)))){dodged=true;crit=false;dmg=0;detail+=' The enemy dodges the attack.'}else{dmg=Math.max(0,Math.round((crit?base*2:base)*mult))}if(dmg>0&&combat.boss&&Number(state.armorSets?.[state.gender])===12)dmg+=2;combat.enemyDodgeBonus=0;combat.guard=card==='guard';if(card==='magic'&&state.gear==='magic'){combat.playerMana=Math.max(0,(combat.playerMana||0)-3)}if(card==='guard'&&state.gear==='magic'){combat.playerMana=Math.min(combat.manaMax||10,(combat.playerMana||0)+2)}combat.enemyHp=Math.max(0,combat.enemyHp-dmg);updateBars();if(dmg>0&&combat.enemyHp>0&&weapon==='magic'&&card==='magic'&&state.affinity==='fire'&&!rule.statusResist.includes('Burning')){combat.targetStatuses=combat.targetStatuses||[];if(!combat.targetStatuses.includes('Burning'))combat.targetStatuses.push('Burning');combat.targetStatusTurns.Burning=3;combat.burningTurns=3;combat.burningDamage=Math.max(2,Math.round(dmg*.25));combat.lastMagicHitDamage=dmg;detail+=' Burning applied.'}if(dmg>0&&combat.enemyHp>0&&card==='attack'&&(weapon==='sword'||weapon==='bow')&&!['Zombie Wolf','Monarch Lucien'].includes(combat.enemy)&&Math.random()<.35){window.applyBleeding?.(dmg);detail+=' Bleeding applied.'}if(dmg>0&&combat.enemyHp>0&&weapon==='sword'&&card==='attack'&&!combat.staggerQueued&&Math.random()<(combat.boss?.12:.24)){combat.staggerQueued=true;detail+=' Staggered: enemy skips its next action.';window.classImpact?.('enemy','stagger')}if(dmg>0){window.classImpact?.('enemy',card==='magic'?'magic':weapon,crit);window.floatDamageNumber?.($('#enemyArt'),dmg,{critical:crit});$('#enemyArt')?.classList.add('hit-flash');setTimeout(()=>$('#enemyArt')?.classList.remove('hit-flash'),360);window.triggerCombatShake?.(card==='magic'?'player-magic':'player-attack')}if(crit){comicPop('CRIT!','crit');window.triggerCritSlowMo?.()}let actionName=card==='guard'?(state.gear==='bow'?'Evade':'Guard'):card==='magic'?'Magic':'Attack',msg=card==='guard'?`${state.gear==='bow'?'Evade ready: high chance to dodge; otherwise Guard reduces damage.':'Guard ready. Incoming damage will be reduced.'}${state.gear==='magic'?' Mana +2.':''}`:dodged?'The enemy dodged your attack.':dmg===0?'No damage dealt.':crit?`Critical hit for ${dmg} damage!`:`${actionName} dealt ${dmg} damage.`;let phaseMessage=battleUpdateBossPhase();if(phaseMessage)detail+=` ${phaseMessage}`;$('#battleDetail').textContent=msg+detail;$('#battleDetail').className=detail.includes('Resisted')?'combat-resisted':detail.includes('Weakness')?'combat-weak':'';if(!crit)comicPop(card==='attack'?(weapon==='sword'?'SHING!':weapon==='bow'?'PEW!':'BAM!'):card==='magic'?'ZAP!':'BLOCK! ',card==='magic'?'magic':card==='guard'?'block':'');window.weaponSfx?window.weaponSfx(state.gear,card):sound(card==='attack'?'attack':card);const playerBody=msg+detail,actionTitle=card==='guard'?`${state.playerName} used ${state.gear==='bow'?'EVADE':'GUARD'}!`:card==='magic'?`${state.playerName} cast a spell!`:`${state.playerName} used FIGHT!`,resultTitle=combat.enemyHp<=0?`${combat.enemy} was defeated!`:card==='guard'?(state.gear==='bow'?'Evade is ready!':'Guard is ready!'):dodged?'The attack missed!':dmg>0?`It dealt ${dmg} damage!`:'No damage was dealt.',showPlayerNotice=(title,body)=>window.battleNotice?new Promise(resolve=>setTimeout(()=>window.battleNotice(title,$('#battleDetail')?.textContent||body).then(resolve),90)):Promise.resolve();if(combat.enemyHp<=0){const done=()=>{actionBusy=false;victory()};showPlayerNotice(`${combat.enemy} was defeated!`,playerBody).then(done);return}const afterPlayer=()=>{if(combat.enemyHp<=0){actionBusy=false;return}if(crit){setTimeout(()=>window.__battleEnemyCounter?.(),500)}else window.__battleEnemyCounter?.()};showPlayerNotice(resultTitle,playerBody).then(afterPlayer)}
window.__battleSkipEnemyTurn=function(){
  if(!combat||combat.enemyHp<=0)return;
  const encounter=combat;
  window.__combatEnemyTurn=true;
  combat.guard=false;
  combat.enemyDodgeBonus=0;
  const enemyStatus=window.tickCombatEnemyStatus?.()||{notes:[],defeated:false};
  if(enemyStatus.defeated){
    const done=()=>{if(combat!==encounter)return;actionBusy=false;window.__combatEnemyTurn=false;victory()};
    return window.battleNotice?window.battleNotice('Status effect damage',enemyStatus.notes.join(' ')).then(done):done();
  }
  const finish=()=>{
    if(combat!==encounter)return;
    const statusNote=tickCombatPlayerStatus();
    const ready=()=>{
      if(combat!==encounter)return;
      if(combat.playerHp<=0){actionBusy=false;window.__combatEnemyTurn=false;window.deathScreen('Your health bar has filed for bankruptcy.');return}
      window.__combatEnemyTurn=false;
      combat.turnActionUsed=false;
      actionBusy=false;
      battleSetIntent();
      $('#battlePrompt').textContent=`What will ${state.playerName} do?`;
    };
    if(statusNote&&window.battleNotice)window.battleNotice('Status effect damage',statusNote).then(ready);else ready();
  };
  $('#battleDetail').textContent=`${enemyStatus.notes.length?enemyStatus.notes.join(' ')+' ':''}${combat.enemy} loses its footing and misses this turn.`;
  window.battleNotice?window.battleNotice(`${combat.enemy} staggered!`,$('#battleDetail').textContent).then(finish):finish();
};
window.__battleEnemyCounter=battleEnemyCounter;window.playCard=sequencePlayCard;$$('.card').forEach(b=>b.onclick=()=>window.playCard(b.dataset.card));
window.playCard=sequencePlayCard;$$('.card').forEach(b=>b.onclick=()=>window.playCard(b.dataset.card));
 $('#leaveVillage').onclick=()=>{window.renderMap();show('map')};$('#villageBtn').onclick=()=>{show('village');window.renderVillage();startMusic()};$('#retreatBtn').onclick=()=>{window.renderMap();show('map')}; /* Combat presentation repair: restore the area art and bring both fighters above the scene layers. */
 const combatScreen=$('#combat');
 function refreshCombatBackdrop(){if(combatScreen.classList.contains('active')){const ng=state.ng?window.getNgPlusVisuals?.():null;const bg=window.villageRaid?.active&&window.villageRaid.backdrop||state.endgame?.specialCombatBackdrop||ng?.combat?.[Number(state.hub)||0]||[AREA_BGS.PLACENTA,AREA_BGS.MILD,AREA_BGS.GRAVE,AREA_BGS.QUESTION,AREA_BGS.MONARCH][state.hub]||DATA.OVERWORLD_BG;combatScreen.style.backgroundImage=`linear-gradient(rgba(12,15,20,.16),rgba(12,15,20,.22)),url("${bg}")`;combatScreen.style.backgroundSize='cover';combatScreen.style.backgroundPosition='center';}}
 setInterval(refreshCombatBackdrop,120);refreshCombatBackdrop();
 // always launch at the title screen; preserve the last playable save for Continue.
 screens.forEach(x=>x.classList.toggle('active',x.id==='start'));state.screen='start';refreshAtmosphere();
const BATTLE_DROPS={"Slime Rat":"Leather","Angry Goose":"Leather","Drunk Peasant":"Coins","Rabid Raccoon":"Leather","Sir Barnaby":"Coins","Goblin Poacher":"Coins","Zombie Wolf":"Bones","Bullying Sprite":"Demon steel","Cursed Timberwolf":"Leather","Gloomfang":"Leather","Skeleton Archer":"Bones","Moldy Mummy":"Bones","Necromancer Apprentice":"Coins","Grave Wraith":"Demon steel","Lich King Timmy":"Demon steel","Minotaur with Anxiety":"Coins","Daedric Knight":"Coins","Gargoyle":"Bones","Dark Sorcerer":"Coins","Throne Warden":"Coins","Monarch Lucien":"Coins"};
function battleDropInfo(enemy,boss){let drop=BATTLE_DROPS[enemy]||((state.hub||0)>=4?'Demon steel':(state.hub||0)>=2?'Bones':'Leather');let key=drop==='Demon steel'?'steel':drop.toLowerCase(),amount=drop==='Coins'?4+(state.hub||0):(boss?3:2);return{drop,key,amount}}
window.battleDropInfo=battleDropInfo;
window.openBattleReward=function openBattleReward(title,boss){let e=state.meta=state.meta||{};e.battleWonPending=false;let coins=8+(state.hub||0)*3+(boss?10:0),d=battleDropInfo(combat?.enemy,boss),magic=state.gear==='magic',damageLabel=magic?'magic damage':'weapon damage',dropLabel=d.drop==='Coins'?`Scrounge: +${d.amount} coins`:`Scrounge: +${d.amount} ${d.drop.toLowerCase()}`,claimed=false;$('#rewardCard').innerHTML=`<h2>${title}</h2><p>Choose one reward from the battle chest.</p><div class="reward-choice-grid"><button class="reward-choice" data-reward="damage">⚔ <b>Increase ${damageLabel}</b><small>Raise your current attack power.</small></button><button class="reward-choice" data-reward="armor">🛡 <b>Increase armor durability</b><small>+3 maximum HP and repair your current HP.</small></button><button class="reward-choice" data-reward="scrounge">🧰 <b>${dropLabel}</b><small>Search for more of the defeated enemy's drop.</small></button><button class="reward-choice" data-reward="coins">◈ <b>Loot the coins</b><small>Take +${coins} coins.</small></button></div><div class="reward-drop-note">Last defeated enemy: <b>${combat?.enemy||'Unknown'}</b> · Drop: <b>${d.drop}</b></div>`;$('#rewardOverlay').classList.add('open');$('#rewardCard').querySelectorAll('[data-reward]').forEach(b=>b.onclick=()=>{if(claimed)return;claimed=true;let choice=b.dataset.reward,msg='';if(choice==='damage'){state.weaponLevel=(state.weaponLevel||0)+1;msg=`${magic?'Magic':'Weapon'} damage increased to level ${state.weaponLevel}.`}else if(choice==='armor'){state.armorLevel=(state.armorLevel||0)+1;state.maxHp=(state.maxHp||30)+3;state.hp=Math.min(state.maxHp,(state.hp||0)+3);if(combat)combat.playerHp=Math.min(state.maxHp,(combat.playerHp||0)+3);msg='Armor durability increased by 3 HP.'}else if(choice==='scrounge'){if(d.key==='coins'){state.coins+=d.amount;msg=`You scrounged ${d.amount} extra coins.`}else{state.materials[d.key]=(state.materials[d.key]||0)+d.amount;msg=`You scrounged ${d.amount} ${d.drop.toLowerCase()}.`}}else{state.coins+=coins;msg=`You looted ${coins} coins.`}e.battleWonPending=false;e.lastBattleReward={choice,enemy:combat?.enemy,drop:d.drop};save();$('#rewardOverlay').classList.remove('open');if(e.pendingFinale){e.pendingFinale=false;state.won=true;save();showEnd()}else{renderMap();show('map');$('#mapStatus').textContent=`Reward claimed: ${msg}`;}})}
const CODEX={Enemies:[['Slime Rat','Weak to bows; resists magic.'],['Zombie Wolf','Weak to magic; shrugs off bleeding.'],['Skeleton Archer','Weak to swords.'],['Lich King Timmy','Light magic is effective.'],['Monarch Lucien','The final monarch resists most damage.']],Weapons:[['Sword','Heavy direct damage and stronger guarded criticals.'],['Bow','Ranged damage with a chance to cause Bleeding.'],['Magic','Affinity-based damage and elemental effects.']],Armor:[['Royal Armor','Guarded critical chance improved.'],['Forest Armor','Bow damage improved.'],['Grave Armor','Reduced ailment and incoming damage.'],['Fortress Armor','Incoming damage reduced.'],['Fool’s Armor','Occasional random bonus damage.']],Areas:[['Placenta Creek','Village reputation and ordinary emergencies.'],['Mild Inconvenience','Forest ambushes and tracking.'],['Grave Mistake','Curses, ailments, and resurrection rumors.'],['Questionable Decisions','Maze puzzles and trick paths.'],['Dread Fortress','Elite enemies and the final monarch.']],NPCs:[['Priest','Purifies ailments and sells suspicious blessings.'],['Blacksmith','Upgrades weapons and armor.'],['Merchant','Sells furniture and questionable goods.']],Endings:[['Epic Conquest','The male savior decides the throne’s fate.'],['Unlikely Romance','The female savior offers Lucien a future.']]};
function openCodex(tab='Monsters',index=0){let entries=CODEX[tab]||CODEX.Enemies;let unlocked=state.meta?.codexUnlocked||[];if(tab==='Monsters'||tab==='Enemies'){entries=(CODEX.Enemies||[]).map(x=>{let found=unlocked.includes(x[0]);return [x[0],x[1],found]})}let renderCover=()=>{$('#codexCard').className='codex-card book-shell codex-cover-view';$('#codexCard').innerHTML='<img src="Textures/UI/Codex/Codex-Cover.png" alt="Monster Codex"><button class="codex-open-button">Open Codex</button><button class="codex-close">Close</button>';$('#codexCard .codex-open-button').onclick=()=>renderBook('Monsters',0);$('#codexCard .codex-close').onclick=()=>$('#codexOverlay').classList.remove('open')};let renderBook=(cat,idx)=>{let list=cat==='Monsters'?(CODEX.Enemies||[]).map(x=>[x[0],x[1],(state.meta?.codexUnlocked||[]).includes(x[0])]):CODEX[cat]||[];idx=Math.max(0,Math.min(list.length-1,idx));let item=list[idx]||['No entries','Defeat enemies to fill this page.',false];let found=item[2]!==false;let name=found?item[0]:'Unknown Creature';let desc=found?item[1]:'This page is blank. Defeat this creature to discover its secrets.';let src=found&&typeof asset==='function'?asset(item[0]):'';let weakness=found?((item[0]==='Slime Rat'?'Bow':item[0]==='Zombie Wolf'?'Magic':item[0]==='Skeleton Archer'?'Sword':item[0]==='Lich King Timmy'?'Light Magic':item[0]==='Monarch Lucien'?'Sword and Light':'Unknown')):'???';let resist=found?((item[0]==='Slime Rat'?'Magic':item[0]==='Zombie Wolf'?'Bow':item[0]==='Lich King Timmy'?'Dark Magic':'None')):'???';$('#codexCard').className='codex-card book-shell';$('#codexCard').innerHTML=`<div class="codex-book"><button class="codex-close">×</button><div class="codex-tabs">${['Monsters','Weapons','Armor','Areas','NPCs','Endings'].map(x=>`<button data-codex-cat="${x}">${x}</button>`).join('')}</div><div class="codex-page left"><div class="codex-monster-window ${found?'':'locked'}">${src?`<img src="${src}" alt="${name}">`:''}</div><h3>${name}</h3><div class="codex-discovery">${found?'DISCOVERED':'LOCKED ENTRY'}</div></div><div class="codex-page right"><div class="codex-notes"><div class="field">Weaknesses: <span class="value">${weakness}</span></div><div class="field">Resistances: <span class="value">${resist}</span></div><div class="obs">${desc}</div></div>${found?'<img class="codex-stamp" src="Textures/UI/Codex/Codex-Ink-Stamp.png" alt="Discovered">':''}</div></div><div class="codex-nav"><button data-codex-prev>◀ Previous</button><span style="color:#f8eed7;font-weight:900">${idx+1} / ${list.length}</span><button data-codex-next>Next ▶</button></div>`;$('#codexCard .codex-close').onclick=()=>$('#codexOverlay').classList.remove('open');$('#codexCard').querySelectorAll('[data-codex-cat]').forEach(b=>b.onclick=()=>renderBook(b.dataset.codexCat,0));$('#codexCard [data-codex-prev]').onclick=()=>renderBook(cat,(idx-1+list.length)%list.length);$('#codexCard [data-codex-next]').onclick=()=>renderBook(cat,(idx+1)%list.length)};$('#codexOverlay').classList.add('open');renderCover()}

const OVERWORLD_EVENT_CHANCE=[.28,.24,.20,.16,.12];
const OVERWORLD_EVENTS=[
 {id:'stuck-cart',title:'A Merchant’s Stuck Cart',minHub:0,weight:18,once:false,dialog:'A merchant’s cart is wedged in a ditch, and the wheels are making a noise that sounds financially serious.',options:[
  {label:'Help push the cart',outcome:'The cart lurches free. The merchant immediately calls it a miracle.',reward:[{type:'coins',amount:6}]},
  {label:'Check the spilled cargo',outcome:'You find a useful scrap beneath the crates.',reward:[{type:'leather',amount:1}]},
  {label:'Keep walking',outcome:'The merchant continues arguing with the wheel.',reward:[]}]},
 {id:'suspicious-tree',title:'The Suspicious Tree',minHub:0,weight:10,once:true,dialog:'A tree bends toward the road and asks a question it clearly invented five seconds ago.',options:[
  {label:'Answer its riddle',outcome:'The tree accepts your answer and drops a sealed bottle from its branches.',reward:[{type:'potion',amount:1}]},
  {label:'Take a branch',outcome:'The tree groans, but the branch is sturdy enough to be useful.',reward:[{type:'leather',amount:1},{type:'coins',amount:3}]},
  {label:'Apologize and leave',outcome:'The tree resumes pretending to be scenery.',reward:[]}]},
 {id:'lost-skeleton',title:'Lost Skeleton',minHub:0,weight:13,once:false,dialog:'A skeleton has misplaced its own arm and is pointing at the problem with the wrong hand.',options:[
  {label:'Return the arm',outcome:'The skeleton gives you an enthusiastic thumbs-up with its newly recovered hand.',reward:[{type:'bones',amount:2}]},
  {label:'Search the nearby grave',outcome:'You find a few coins beside a very offended-looking tombstone.',reward:[{type:'coins',amount:5}]},
  {label:'Leave it to keep looking',outcome:'The skeleton begins checking its ribs.',reward:[]}]},
 {id:'cursed-picnic',title:'Cursed Picnic',minHub:1,weight:8,once:true,dialog:'A picnic blanket sits in the road. The sandwiches are whispering your name.',options:[
  {label:'Eat the least suspicious sandwich',outcome:'It tastes like victory and only a little bit of grave dirt.',reward:[{type:'coins',amount:8}]},
  {label:'Burn the picnic',outcome:'The curse retreats into the smoke, leaving behind a useful cleansing charm.',reward:[{type:'cursebreaker',amount:1}]},
  {label:'Walk around it',outcome:'The sandwiches whisper insults as you pass.',reward:[]}]},
 {id:'hero-tax',title:'Hero Tax',minHub:0,weight:15,once:false,dialog:'A villager steps into the road and demands payment for the privilege of being called heroic.',options:[
  {label:'Pay the tax',outcome:'The villager stamps your imaginary hero permit.',reward:[{type:'coins',amount:-3},{type:'quest',text:'The villagers now recognize your questionable heroism.'}]},
  {label:'Negotiate loudly',outcome:'The villager backs down and hands you a small apology fee.',reward:[{type:'coins',amount:4}]},
  {label:'Refuse and leave',outcome:'The tax collector writes down your name incorrectly.',reward:[]}]},
 {id:'fake-boss',title:'Fake Boss',minHub:1,weight:9,once:false,dialog:'A tiny monster blocks the road, points at a paper crown, and announces that it is absolutely a boss.',options:[
  {label:'Challenge the “boss”',outcome:'The tiny monarch flees and drops something valuable while escaping.',reward:[{type:'steel',amount:1}]},
  {label:'Expose the costume',outcome:'The fake boss sighs and pays you to forget this happened.',reward:[{type:'coins',amount:9}]},
  {label:'Respect the title',outcome:'The tiny boss grants you passage and a suspicious bow.',reward:[]}]},
 {id:'emotional-chest',title:'Emotional Chest',minHub:2,weight:7,once:true,dialog:'A treasure chest is trembling beside the road. It says it is afraid of being opened.',options:[
  {label:'Comfort the chest',outcome:'The chest opens when it feels emotionally ready.',reward:[{type:'coins',amount:7},{type:'potion',amount:1}]},
  {label:'Force it open',outcome:'The lock breaks loudly, revealing a rare cleansing item.',reward:[{type:'cursebreaker',amount:1}]},
  {label:'Leave it alone',outcome:'The chest thanks you for respecting its boundaries.',reward:[]}]},
 {id:'goblin-market',title:'Traveling Goblin Market',minHub:0,weight:17,once:false,dialog:'A traveling goblin has arranged a tiny roadside market on a blanket that is definitely larger on the inside.',options:[
  {label:'Buy the cheap potion',outcome:'The potion is cloudy, but the label is encouraging.',reward:[{type:'coins',amount:-4},{type:'potion',amount:1}]},
  {label:'Trade a story for supplies',outcome:'Your story is judged “acceptable” and earns a useful material.',reward:[{type:'leather',amount:1}]},
  {label:'Decline the suspicious bargains',outcome:'The goblin salutes with a spoon.',reward:[]}]},
 {id:'wounded-adventurer',title:'Wounded Adventurer',minHub:1,weight:12,once:false,dialog:'A wounded adventurer asks for one extremely specific favor: help them reach the next signpost.',options:[
  {label:'Help them stand',outcome:'They press a small medicine kit into your hands before limping away.',reward:[{type:'antidote',amount:1}]},
  {label:'Search their abandoned pack',outcome:'The pack contains a handful of coins and one usable scrap.',reward:[{type:'coins',amount:4},{type:'leather',amount:1}]},
  {label:'Keep moving',outcome:'The adventurer calls after you, but only to complain about the weather.',reward:[]}]},
 {id:'shortcut-sign',title:'Shortcut Sign',minHub:3,weight:5,once:true,dialog:'A crooked sign points toward a shortcut. The arrow is pointing at another sign that says “Do not trust the first sign.”',options:[
  {label:'Take the shortcut',outcome:'The shortcut is real enough and leads to a hidden supply cache.',reward:[{type:'steel',amount:1},{type:'coins',amount:5}]},
  {label:'Follow the long road',outcome:'The long road is boring, reliable, and free of suspicious arrows.',reward:[{type:'hp',amount:3}]},
  {label:'Turn both signs around',outcome:'The road is now equally confusing in both directions.',reward:[]}]}
];
window.OVERWORLD_EVENTS=OVERWORLD_EVENTS;
function ensureOverworldEvents(){state.meta=state.meta||{};state.meta.overworldEventsSeen=Array.isArray(state.meta.overworldEventsSeen)?state.meta.overworldEventsSeen:[];state.meta.overworldEventCooldown=state.meta.overworldEventCooldown||{};}
function rewardOverworldEvent(rewards){ensureCombatResources();const lines=[];for(const r of rewards||[]){let amount=Number(r.amount||0);if(r.type==='quest'){if(r.text)state.meta.quest=r.text;lines.push(r.text||'A new objective was recorded.');continue}if(r.type==='coins'){state.coins=Math.max(0,state.coins+amount);lines.push(`${amount>=0?'+':''}${amount} coins`)}else if(r.type==='leather'||r.type==='bones'||r.type==='steel'){state.materials[r.type]=(state.materials[r.type]||0)+amount;lines.push(`+${amount} ${r.type==='steel'?'demon steel':r.type}`)}else if(r.type==='potion'||r.type==='drumstick'||r.type==='antidote'||r.type==='cursebreaker'){const key=r.type==='potion'?'drumstick':r.type;state.meta.items[key]=(state.meta.items[key]||0)+amount;const label=key==='drumstick'?'Drumstick':key==='cursebreaker'?'Cursebreaker':key[0].toUpperCase()+key.slice(1);lines.push(`+${amount} ${label}`)}else if(r.type==='hp'){state.hp=Math.min(state.maxHp,state.hp+amount);lines.push(`+${amount} HP`)} }return lines.length?lines:['No reward received.']}
function chooseOverworldEvent(hub){ensureOverworldEvents();const travel=Number(state.meta.travel||0),seen=new Set(state.meta.overworldEventsSeen),cool=state.meta.overworldEventCooldown,eligible=OVERWORLD_EVENTS.filter(e=>(e.minHub||0)<=hub&&(!e.ngOnly||state.ng)&&(!e.routeKeys||e.routeKeys.includes(state.meta?.ngPlusRouteKey))&&(!e.once||!seen.has(e.id))&&!(cool[e.id]>travel));if(!eligible.length)return null;const total=eligible.reduce((sum,e)=>sum+e.weight,0);let roll=Math.random()*total;return eligible.find(e=>(roll-=e.weight)<=0)||eligible[eligible.length-1]}
function triggerOverworldEvent(hub){ensureOverworldEvents();if($('#overworldEventCard')||!OVERWORLD_EVENT_CHANCE[hub]||Math.random()>=OVERWORLD_EVENT_CHANCE[hub])return false;const ev=chooseOverworldEvent(hub);if(!ev)return false;const d=document.createElement('div');d.id='overworldEventCard';d.className='road-event';d.innerHTML=`<div class="road-event-card"><h2>${ev.title}</h2><p>${ev.dialog}</p><div class="event-options">${ev.options.map((o,i)=>`<button data-overworld-choice="${i}">${o.label}</button>`).join('')}</div></div>`;$('#map').appendChild(d);d.querySelectorAll('[data-overworld-choice]').forEach(b=>b.onclick=()=>{const option=ev.options[Number(b.dataset.overworldChoice)]||ev.options[0],rewardLines=rewardOverworldEvent(option.reward);if(ev.once&&!state.meta.overworldEventsSeen.includes(ev.id))state.meta.overworldEventsSeen.push(ev.id);if(!ev.once)state.meta.overworldEventCooldown[ev.id]=Number(state.meta.travel||0)+2;save();d.querySelector('.road-event-card').innerHTML=`<h2>${ev.title}</h2><p>${option.outcome}</p><div class="event-reward-result"><b>Rewards</b>${rewardLines.map(x=>`<span>${x}</span>`).join('')}</div><button class="event-choice" data-overworld-continue>Continue</button>`;d.querySelector('[data-overworld-continue]').onclick=()=>{d.remove();setTimeout(()=>openLevelSelect(hub),250)}});return true}
window.triggerOverworldEvent=triggerOverworldEvent;

function openUtility(kind){if(kind==='settings'){$('#utilityCard').innerHTML=`<h2>Settings</h2><p>Music: ${$('#musicToggle')?.getAttribute('aria-pressed')==='true'?'On':'Off'}</p><div class="utility-actions"><button id="utilityMusic">Toggle Music</button><button id="utilityClose">Close</button></div>`;$('#utilityModal').classList.add('open');$('#utilityMusic').onclick=()=>{toggleMusic();openUtility('settings')};$('#utilityClose').onclick=()=>$('#utilityModal').classList.remove('open')}}
function openDebug(){
  const c=$('#utilityCard'),modal=$('#utilityModal'),d=window.__debugFlags;
  if(!document.querySelector('#debug-minimal-style')){const style=document.createElement('style');style.id='debug-minimal-style';style.textContent=`#utilityModal.debug-minimal-modal{background:rgba(5,9,16,.48);backdrop-filter:blur(5px);-webkit-backdrop-filter:blur(5px)}#utilityModal.debug-minimal-modal .utility-card{width:min(390px,88%);max-height:none;overflow:visible;padding:15px 16px;background:rgba(17,24,39,.74);border:0!important;border-radius:12px;box-shadow:0 16px 48px #0009;color:#f8eed7;backdrop-filter:blur(16px) saturate(1.08);-webkit-backdrop-filter:blur(16px) saturate(1.08)}.debug-minimal-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}.debug-minimal-head h2{margin:0;color:#f8eed7!important;font-size:20px;letter-spacing:.04em}.debug-minimal-close{width:30px!important;min-height:30px!important;padding:0!important;border:1px solid rgba(255,255,255,.2)!important;background:rgba(255,255,255,.08)!important;color:#fff!important;box-shadow:none!important;font-size:18px;line-height:1}.debug-minimal-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px}.debug-minimal-grid button,.debug-time-grid button{min-height:36px;padding:7px 8px;border:1px solid rgba(255,255,255,.16);border-radius:7px;background:rgba(255,255,255,.09);color:#f8eed7;box-shadow:none;font-size:11px;font-weight:900}.debug-minimal-grid button:hover,.debug-time-grid button:hover{background:rgba(255,255,255,.17);filter:none;transform:none}.debug-minimal-grid button.on{background:rgba(104,190,137,.24);border-color:rgba(158,235,180,.48);color:#d9ffe5}.debug-subhead{margin:0 0 9px;color:#f8eed7;font-size:14px}.debug-back{margin-top:10px;width:100%;min-height:32px!important;padding:5px 8px!important;background:rgba(255,255,255,.07)!important;border:1px solid rgba(255,255,255,.15)!important;color:#f8eed7!important;box-shadow:none!important}.debug-time-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:5px}.debug-time-grid button{min-height:31px;padding:5px 3px;font-size:10px}@media(max-width:520px){#utilityModal.debug-minimal-modal .utility-card{width:min(360px,92%)}.debug-time-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}`;document.head.appendChild(style)}
  modal.classList.add('open','debug-minimal-modal');
  const close=()=>modal.classList.remove('open','debug-minimal-modal');
  const hourLabel=h=>{const ap=h>=12?'PM':'AM',n=h%12||12;return `${n} ${ap}`};
  const header=title=>`<div class="debug-minimal-head"><h2>${title}</h2><button class="debug-minimal-close" id="debugClose" aria-label="Close">×</button></div>`;
  const bindClose=()=>$('#debugClose').onclick=close;
  const renderTime=()=>{c.innerHTML=header('Time Change')+`<p class="debug-subhead">Set in-game hour</p><div class="debug-time-grid">${Array.from({length:24},(_,h)=>`<button data-debug-hour="${h}">${hourLabel(h)}</button>`).join('')}</div><button class="debug-back" id="debugBack">Back</button>`;bindClose();$('#debugBack').onclick=renderMain;c.querySelectorAll('[data-debug-hour]').forEach(b=>b.onclick=()=>{window.gameClock?.setMinutes(Number(b.dataset.debugHour)*60);renderMain()})};
  const renderEnding=()=>{c.innerHTML=header('Ending')+`<p class="debug-subhead">Choose route</p><div class="debug-minimal-grid"><button data-debug-ending="male">Male</button><button data-debug-ending="female">Female</button></div><button class="debug-back" id="debugBack">Back</button>`;bindClose();$('#debugBack').onclick=renderMain;c.querySelector('[data-debug-ending="male"]').onclick=()=>{state.gender='male';close();openEndgameEnding()};c.querySelector('[data-debug-ending="female"]').onclick=()=>{state.gender='female';close();openEndgameEnding()}};
  const renderMain=()=>{c.innerHTML=header('Debug')+`<div class="debug-minimal-grid"><button data-debug-action="god" class="${d.godMode?'on':''}">God Mode · ${d.godMode?'ON':'OFF'}</button><button data-debug-action="resources" class="${d.maxResources?'on':''}">Max Resources · ${d.maxResources?'∞':'OFF'}</button><button data-debug-action="areas">Unlock All Areas</button><button data-debug-action="armor">Unlock All Armor</button><button data-debug-action="time">Time Change</button><button data-debug-action="ending">Ending</button><button data-debug-action="creation">Character Creation</button><button data-debug-action="village-attack">Village Attack</button></div>`;bindClose();c.querySelector('[data-debug-action="god"]').onclick=()=>{d.godMode=!d.godMode;renderMain()};c.querySelector('[data-debug-action="resources"]').onclick=()=>{window.__debugToggleMaxResources?.();renderMain()};c.querySelector('[data-debug-action="areas"]').onclick=()=>{state.maxHub=4;state.progress=[5,5,5,5,5];save();renderMain()};c.querySelector('[data-debug-action="armor"]').onclick=()=>{state.unlockedArmor={male:Array.from({length:ARMOR_NAMES.length},(_,i)=>i),female:Array.from({length:ARMOR_NAMES.length},(_,i)=>i)};save();renderMain()};c.querySelector('[data-debug-action="time"]').onclick=renderTime;c.querySelector('[data-debug-action="ending"]').onclick=renderEnding;c.querySelector('[data-debug-action="creation"]').onclick=()=>{close();window.refreshCreationScreen?.();show('create')};c.querySelector('[data-debug-action="village-attack"]').onclick=()=>{close();window.villageRaid?.trigger(true)};}
  renderMain();
}
function updateUtilityDock(){const visible=state.screen==='map'||state.screen==='village';const dock=document.querySelector('.utility-dock');if(dock)dock.style.display=visible?'flex':'none'}
$('#codexBtn')?.addEventListener('click',()=>openCodex());$('#settingsBtn')?.addEventListener('click',()=>openUtility('settings'));updateUtilityDock();setInterval(updateUtilityDock,250);let debugMode=false;document.addEventListener('keydown',e=>{if(e.ctrlKey&&e.shiftKey&&e.key.toLowerCase()==='d'){debugMode=!debugMode;$('#debugBtn').style.display=debugMode?'block':'none'}if(e.key==='F2')openDebug()});$('#debugBtn')?.addEventListener('click',openDebug);setTimeout(()=>$('#bootSplash')?.classList.remove('open'),850);const titleHero=document.querySelector('.start .hero');if(titleHero&&!document.querySelector('#titleMeta')){const m=document.createElement('div');m.id='titleMeta';m.style.cssText='margin-top:14px;font-size:11px;color:#eadbe5;display:flex;gap:10px;align-items:center';m.innerHTML='<span>v0.9 · Postgame Expansion</span><button id="creditsBtn" style="min-height:28px;padding:4px 8px;font-size:10px">Credits</button>';titleHero.appendChild(m);document.querySelector('#creditsBtn').onclick=()=>{document.querySelector('#utilityCard').innerHTML='<h2>Credits</h2><p>Created as a cardboard fantasy tragedy with questionable decisions, dramatic monsters, and one extremely lonely monarch.</p><div class="utility-actions"><button id="creditsClose">Close</button></div>';document.querySelector('#utilityModal').classList.add('open');document.querySelector('#creditsClose').onclick=()=>document.querySelector('#utilityModal').classList.remove('open')}}


})();

/* v15: make the world, progression and combat feel like one game. */
(()=>{
 const oldMap=window.renderMap, oldVillage=window.renderVillage, oldPlay=window.playCard;
 state.meta=state.meta||{quest:'Reach Placenta Creek and ask the villagers what went wrong.',questsDone:[],visited:[],relationships:{priest:0,blacksmith:0,merchant:0},travel:0};
 const pts=[[8,86],[40,78],[59,63],[78,78],[87,27]];
 const questText=()=>state.meta.quest;
 function addMapUI(){let map=$('#map');if(!map)return;if(!$('#questBar')){map.insertAdjacentHTML('beforeend','<button type="button" id="questBar" aria-expanded="false" aria-label="Current objective"><b aria-hidden="true">✦</b><span></span><i aria-hidden="true">⌄</i></button><div id="travelMarker"></div>');$('#questBar').addEventListener('click',e=>{const bar=e.currentTarget;const expanded=bar.getAttribute('aria-expanded')!=='true';bar.setAttribute('aria-expanded',String(expanded));bar.title=expanded?'Collapse objective':'Expand objective'})}$('#questBar span').textContent=questText();const m=$('#travelMarker');m.style.left=pts[state.hub]?.[0]+'%';m.style.top=pts[state.hub]?.[1]+'%';}
 function mapEnhance(){addMapUI();$$('[data-map-hub]').forEach(b=>{b.onclick=()=>{if(b.getAttribute('aria-disabled')==='true'){b.classList.add('map-spot-revealed');setTimeout(()=>b.classList.remove('map-spot-revealed'),2400);return}travelTo(+b.dataset.mapHub)}});}
 function travelTo(i){if(i>state.maxHub)return;const m=$('#travelMarker');if(m){m.style.left=pts[i][0]+'%';m.style.top=pts[i][1]+'%'}state.meta.travel++;if(!state.meta.visited.includes(i))state.meta.visited.push(i);if(i===0&&state.meta.quest.startsWith('Reach')){state.meta.quest='Investigate the Cathedral, Blacksmith, and Merchant.'}if(window.triggerOverworldEvent?.(i))return;setTimeout(()=>openLevelSelect(i),420);}

 window.renderMap=()=>{oldMap();mapEnhance();};
 // Re-run enhancement after the existing renderer rebuilds hotspots.
 setInterval(()=>{if($('#map')?.classList.contains('active'))mapEnhance();},350);
 // Building relationships and a lightweight objective tracker.
 document.addEventListener('click',e=>{const b=e.target.closest('[data-facility]');if(!b)return;const key=b.dataset.facility;if(key!=='home'){state.meta.relationships[key]=(state.meta.relationships[key]||0)+1;if(state.meta.relationships[key]>=3)state.meta.quest=`${key[0].toUpperCase()+key.slice(1)} trust you. Ask about their problem.`}},true);
 // Combat HUD and intent. Existing sequence combat remains authoritative for damage timing.
 function combatUI(){if(!$('#combat')?.classList.contains('active'))return;const field=$('.battle-field'),hud=$('#combat .hud');if(!field||!hud)return;let strip=hud.querySelector('.turn-strip');if(!strip){strip=document.createElement('div');strip.className='turn-strip';hud.insertBefore(strip,hud.lastElementChild)}field.querySelector('.intent-chip')?.remove();strip.textContent=window.__combatEnemyTurn?'ENEMY TURN':'YOUR TURN';}
 setInterval(combatUI,100);
 document.addEventListener('click',e=>{const card=e.target.closest('.card');if(!card||!$('#combat')?.classList.contains('active'))return;window.__combatEnemyTurn=false;combatUI();$('#combat').classList.add('shake');setTimeout(()=>{$('#combat').classList.remove('shake')},220);},true);
 // Improve save button into a visible save confirmation and autosave at safe moments.
 $('#saveBtn')?.addEventListener('click',()=>{state.meta.lastSaved=new Date().toISOString();save();$('#mapStatus').textContent='Saved. The cardboard remembers every questionable decision.'},true);
 $('#villageSave')?.addEventListener('click',()=>{state.meta.lastSaved=new Date().toISOString();save()},true);
 setInterval(()=>{if(state.screen!=='start'){state.meta.lastSaved=new Date().toISOString();save()}},30000);
})();

/* Pass 2: status effects, save slots, richer endings, and clearer combat feedback. */
(()=>{
 const oldSave=window.save;
 state.meta=state.meta||{};state.meta.statuses=state.meta.statuses||[];state.meta.saveSlot=state.meta.saveSlot||1;
 function statusUI(){if(!$('#combat')?.classList.contains('active'))return;const f=$('.battle-field');if(!f)return;let s=f.querySelector('.status-strip');if(!s){s=document.createElement('div');s.className='status-strip';f.appendChild(s)}s.innerHTML=(state.meta.statuses||[]).map(x=>`<span class="status-tag">${x}</span>`).join('');}
 setInterval(statusUI,120);
 // Keep effects out of the faces and make them useful as a lightweight combat layer.
 document.addEventListener('click',e=>{const card=e.target.closest('.card');if(!card||!$('#combat')?.classList.contains('active'))return;const type=card.dataset.card;state.meta.statuses=state.meta.statuses||[];if(type==='guard'&&!state.meta.statuses.includes('Guarded'))state.meta.statuses.push('Guarded');setTimeout(()=>{if(type!=='guard')state.meta.statuses=state.meta.statuses.filter(x=>x!=='Guarded');statusUI()},800)},true);
 // Three manual save slots without changing the existing automatic save behavior.
 function slotKey(i){return 'demonBummerSlot'+i}function slotSummary(i){const v=JSON.parse(localStorage.getItem(slotKey(i))||'null');return v?`${v.playerName||'Savior'} · ${v.won?'Monarch defeated':'Area '+((v.hub||0)+1)} · ${v.meta?.lastSaved?new Date(v.meta.lastSaved).toLocaleString():''}`:'Empty slot'}
 function saveSlots(){const d=document.createElement('div');d.className='save-slots-modal';d.innerHTML=`<div class="save-slots-card"><h2>Save slots</h2><p>Keep a snapshot before making your next questionable decision.</p><div class="save-slots">${[1,2,3].map(i=>`<div class="save-slot"><div><b>Slot ${i}</b><small>${slotSummary(i)}</small></div><button data-save-slot="${i}">Save</button><button data-load-slot="${i}" ${localStorage.getItem(slotKey(i))?'':'disabled'}>Load</button></div>`).join('')}</div><button data-close-slots>Close</button></div>`;document.querySelector('.game').appendChild(d);d.querySelector('[data-close-slots]').onclick=()=>d.remove();d.querySelectorAll('[data-save-slot]').forEach(b=>b.onclick=()=>{state.meta.lastSaved=new Date().toISOString();localStorage.setItem(slotKey(+b.dataset.saveSlot),JSON.stringify(state));d.remove();$('#mapStatus')&&($('#mapStatus').textContent=`Saved to Slot ${b.dataset.saveSlot}.`);oldSave()});d.querySelectorAll('[data-load-slot]').forEach(b=>b.onclick=()=>{const v=JSON.parse(localStorage.getItem(slotKey(+b.dataset.loadSlot)));if(!v)return;Object.assign(state,v);d.remove();if(state.screen==='map'){window.renderMap();show('map')}else if(state.screen==='village'){window.renderVillage();show('village')}else{show('create')}})}
 $('#saveBtn')?.addEventListener('click',e=>{e.stopImmediatePropagation();saveSlots()},true);$('#villageSave')?.addEventListener('click',e=>{e.stopImmediatePropagation();saveSlots()},true);
 // Enemy identity gives each area a recognizable combat rule in the log.
 const enemyHints={
  'Slime Rat':'It leaves a corrosive puddle after a counterattack.', 'Angry Goose':'It attacks twice if you look confident.', 'Zombie Wolf':'It grows stronger when you Guard.', 'Skeleton Archer':'It marks the next hit before firing.', 'Minotaur with Anxiety':'It becomes dangerous when below half health.', 'Monarch Lucien':'The final boss refuses to fight fair.'};
 setInterval(()=>{if($('#combat')?.classList.contains('active')&&combat?.enemy&&$('#battleDetail')?.textContent.startsWith('Choose'))$('#battleDetail').textContent=enemyHints[combat.enemy]||'The enemy is preparing something unpleasant.'},500);
 // Alternate ending flavor based on the player’s relationships and choices.
 setInterval(()=>{if(!$('#end')?.classList.contains('active'))return;const r=state.meta.relationships||{};const best=Object.entries(r).sort((a,b)=>b[1]-a[1])[0]?.[0]||'none';let title='The Epic Conquest',copy='Lucien dissolves into paper confetti. The kingdom is free, although nobody has a plan.';if(best==='priest'){title='The Mercy Ending';copy='The cathedral rings its bells. The priest calls it a miracle and immediately asks for a donation.'}if(best==='blacksmith'){title='The Forged Ending';copy='The blacksmith turns the ruined throne into a legendary workbench. It is ugly, useful, and somehow warm.'}if(best==='merchant'){title='The Profitable Ending';copy='The merchant declares the defeated castle a franchise opportunity. The kingdom is saved, technically.'}$('#endTitle').textContent=title;$('#endCopy').textContent=copy;let b=$('#endTitle').nextElementSibling?.previousElementSibling;if($('#endCopy')&&!$('#endCopy').previousElementSibling?.classList.contains('ending-badge'))$('#endCopy').insertAdjacentHTML('beforebegin','<span class="ending-badge">Ending unlocked</span>')},400);
})();

/* Pass 3 gameplay systems */
(()=>{
 state.meta=state.meta||{};state.meta.statuses=state.meta.statuses||[];state.meta.cardUpgrades=state.meta.cardUpgrades||{attack:0,guard:0,magic:0};state.meta.quests=state.meta.quests||[];state.meta.ngPlus=state.meta.ngPlus||0;state.meta.rewardSeen=state.meta.rewardSeen||0;
 const neg=['Bleeding','Burning','Soaked','Poisoned','Cursed','Wild magic'], pos=['Guarded','Blessed','Focused','Enraged'];
 function statuses(){return state.meta.statuses||[]}
 function effectHTML(){const a=statuses();return `<div class="effect-panel"><b>Active effects</b><br>${a.length?a.map(x=>`<span class="status-tag">${x}</span>`).join(' '):'<span style="opacity:.65">None</span>'}</div>`}
 function removeNegative(which='all'){if(which==='all')state.meta.statuses=statuses().filter(x=>!neg.includes(x));else state.meta.statuses=statuses().filter(x=>x!==which)}
 function addBuildingTools(){const type=state._building;if(!$('#interiorContent')||!$('#interior').classList.contains('active'))return;const wrap=$('#interiorContent');if(wrap.querySelector('[data-pass3]'))return;let extra='';if(type==='cathedral')extra=`<div data-pass3 class="dialog-buttons"><button data-pass3-action="purify">Purify ailments · 6 coins</button><button data-pass3-action="bless">Receive blessing · 10 coins</button></div>${effectHTML()}`;if(type==='home')extra=`<div data-pass3 class="dialog-buttons"><button data-pass3-action="rest">Rest and clear ailments · free</button><button data-pass3-action="questlog">Open quest log</button></div>${effectHTML()}`;if(type==='blacksmith')extra=`<div data-pass3 class="dialog-buttons"><button data-pass3-action="reforge">Reforge weapon · 10 coins</button><button data-pass3-action="resistance">Temper armor · 1 bone</button></div>`;if(type==='merchant')extra=`<div data-pass3 class="dialog-buttons"><button data-pass3-action="holywater">Holy Water · 8 coins</button><button data-pass3-action="bandage">Bandage · 5 coins</button><button data-pass3-action="salt">Drying Salt · 5 coins</button></div>`;if(extra)wrap.insertAdjacentHTML('beforeend',extra);wrap.querySelectorAll('[data-pass3-action]').forEach(b=>b.onclick=()=>{const a=b.dataset.pass3Action;if(a==='purify'){if(state.coins>=6){state.coins-=6;removeNegative();dialogNotice('The priest purifies every negative ailment. The invoice is less holy.')}else dialogNotice('Purification costs 6 coins.')}if(a==='bless'){if(state.coins>=10){state.coins-=10;if(!statuses().includes('Blessed'))state.meta.statuses.push('Blessed');dialogNotice('A warm blessing settles over you.')}else dialogNotice('The cathedral requests 10 coins.')}if(a==='rest'){removeNegative();state.hp=state.maxHp;dialogNotice('You rest at home. Your ailments leave through the window.')}if(a==='questlog'){showQuestLog()}if(a==='reforge'){if(state.coins>=10){state.coins-=10;state.meta.cardUpgrades.attack++;dialogNotice('Your attack card gains a permanent +1 damage upgrade.')}else dialogNotice('Reforging costs 10 coins.')}if(a==='resistance'){if(state.materials.bones>0){state.materials.bones--;state.meta.resistance=true;dialogNotice('Your armor is tempered against the next ailment.')}else dialogNotice('You need one bone.')}if(a==='holywater'){if(state.coins>=8){state.coins-=8;removeNegative();dialogNotice('Holy Water clears every negative ailment.')}else dialogNotice('Holy Water costs 8 coins.')}if(a==='bandage'){if(state.coins>=5){state.coins-=5;removeNegative('Bleeding');dialogNotice('The bandage removes Bleeding.')}else dialogNotice('A bandage costs 5 coins.')}if(a==='salt'){if(state.coins>=5){state.coins-=5;removeNegative('Soaked');dialogNotice('Drying Salt removes Soaked.')}else dialogNotice('Drying Salt costs 5 coins.')}if(a==='questlog')return;})}
 /* Compact interior menu replaces the legacy injected building tools. */
 function showQuestLog(){const d=document.createElement('div');d.className='reward-modal';d.innerHTML=`<div class="reward-card"><h2>Quest log</h2><div class="quest-log"><ul>${(state.meta.quests.length?state.meta.quests:['Main quest: investigate the village and prepare for the Monarch.']).map(q=>`<li>${q}</li>`).join('')}</ul></div><button>Close</button></div>`;document.querySelector('.game').appendChild(d);d.querySelector('button').onclick=()=>d.remove()}
 // Enhanced card values use the player’s permanent card upgrades without breaking the existing combat renderer.
 let lastCombat=false;function enhanceCards(){if(!$('#combat')?.classList.contains('active')){lastCombat=false;return}if(lastCombat)return;lastCombat=true;$$('.card').forEach(b=>{if(b.dataset.pass3)return;b.dataset.pass3='1';b.onclick=e=>{e.preventDefault();const c=b.dataset.card;const bonus=state.meta.cardUpgrades[c]||0;const old=state.weaponLevel;state.weaponLevel=old+bonus;window.playCard(c);state.weaponLevel=old;state.meta.statuses=state.meta.statuses||[];};});}
 setInterval(enhanceCards,100);
 // Offer a meaningful post-battle reward once per cleared encounter.
 // Legacy battle rewards are intentionally disabled; victory() owns the single current reward flow.
function rewardCheck(){if(state.meta)state.meta.battleWonPending=false}
 // Add a New Game+ indicator and tougher run multiplier while preserving the existing reset flow.
 $('#ngBtn')?.addEventListener('click',()=>{state.meta.ngPlus=(state.meta.ngPlus||0)+1;state.meta.cardUpgrades={attack:0,guard:0,magic:0};state.meta.statuses=[]},true);setInterval(()=>{if($('#create')?.classList.contains('active')&&state.meta.ngPlus)$('#create .kicker').innerHTML=`Act II · The Dressing Room <span class="newgameplus">· NEW GAME+ ${state.meta.ngPlus}</span>`},300);
 // Keep status effects short-lived after a completed fight, while preserving blessings.
 let previousCombat=false;setInterval(()=>{const active=$('#combat')?.classList.contains('active');if(previousCombat&&!active)state.meta.statuses=statuses().filter(x=>pos.includes(x));previousCombat=active},150);
})();

/* Pass 4: real character quests and no automatic dialog dismissal. */
(()=>{
 state.meta=state.meta||{};state.meta.questContracts=state.meta.questContracts||{};state.meta.questProgress=state.meta.questProgress||{heals:0,trades:0,wins:0};
 const Q={
  cathedral:{id:'reliquary',title:'The Missing Reliquary',intro:'A small reliquary vanished from the cathedral. The priest suspects someone with very questionable morals.',goal:'Purify one ailment or restore health once, then return to the priest.',reward:'Blessed Charm · permanent protection from the first negative ailment each battle',start:'The priest presses a cold key into your hand. “Bring back the reliquary, or at least bring back a good excuse.”'},
  blacksmith:{id:'edge',title:'Test the Edge',intro:'The blacksmith needs field data for a dangerous new weapon.',goal:'Win your next combat encounter, then return with the weapon intact.',reward:'Forged Edge · +2 attack-card damage',start:'The blacksmith hands you a weapon that hums ominously. “Try not to break it before it proves anything.”'},
  merchant:{id:'raretrade',title:'A Rare Trade',intro:'The merchant wants one rare material moved before the tax collectors notice.',goal:'Buy or sell something through the merchant, then return for payment.',reward:'Merchant’s Ledger · shop purchases cost 2 fewer coins',start:'The merchant produces a sealed ledger. “One discreet transaction. No questions, especially from you.”'}
 };
 const neg=['Bleeding','Burning','Soaked','Poisoned','Cursed','Wild magic'];
 function contractUI(){if(!$('#interior')?.classList.contains('active'))return;const type=state._building;if(!Q[type]||$('#interiorContent [data-contract]'))return;const q=Q[type],c=state.meta.questContracts[type];let html='';if(c==='complete'){wrap.querySelector('[data-contract]')?.remove();return}else if(c==='active')html=`<div class="quest-contract" data-contract><h3>${q.title}</h3><p><b>Objective:</b> ${q.goal}</p><p>Return here when it is done.</p></div>`;else html=`<div class="quest-contract" data-contract><h3>Quest: ${q.title}</h3><p>${q.intro}</p><p><b>Reward:</b> ${q.reward}</p><button data-start-contract>Accept quest</button></div>`;$('#interiorContent').insertAdjacentHTML('afterbegin',html);$('#interiorContent [data-start-contract]')?.addEventListener('click',()=>{state.meta.questContracts[type]='active';state.meta.quest=q.goal;$('#interiorContent [data-contract]')?.remove();window.dialogNotice(`Quest accepted: ${q.title}. ${q.start}`);});}
 function complete(type){const q=Q[type];if(!q||state.meta.questContracts[type]!=='active')return;state.meta.questRewardsClaimed=state.meta.questRewardsClaimed||{};const key=type+'.0';state.meta.questContracts[type]='complete';if(!state.meta.questRewardsClaimed[key]){if(type==='cathedral'){state.meta.blessedCharm=true;if(!state.meta.statuses.includes('Blessed'))state.meta.statuses.push('Blessed')}if(type==='blacksmith'){state.meta.cardUpgrades.attack=(state.meta.cardUpgrades.attack||0)+2}if(type==='merchant'){state.meta.merchantDiscount=true}state.meta.questRewardsClaimed[key]=true}state.meta.quest=`${q.title} completed. Reward received: ${q.reward}`;try{save()}catch(e){}window.dialogNotice(`Quest complete! ${q.reward}`);}
 function check(){const p=state.meta.questProgress;if(state.meta.questContracts.cathedral==='active'&&p.heals>0)complete('cathedral');if(state.meta.questContracts.blacksmith==='active'&&p.wins>0)complete('blacksmith');if(state.meta.questContracts.merchant==='active'&&p.trades>0)complete('merchant');}
 setInterval(check,250);
 // Count interactions and enforce full-health healing rules before legacy handlers run.
 document.addEventListener('click',e=>{const b=e.target.closest('[data-dialog-action]');if(!b)return;const a=b.dataset.dialogAction;const type=state._building;if(type==='merchant'&&['magic','leather','bones','sellLeather','sellBones','sellSteel'].includes(a))state.meta.questProgress.trades++;if(type==='cathedral'&&['heal','pray'].includes(a))state.meta.questProgress.heals++;if(a==='heal'){e.preventDefault();e.stopImmediatePropagation();if(state.hp>=state.maxHp){window.dialogNotice('Your health is already full. Unless you want to donate those coins to me.');return}if(state.coins<8){window.dialogNotice('Healing costs 8 coins. Even miracles have overhead.');return}state.coins-=8;state.hp=state.maxHp;window.dialogNotice('The priest restores your health. Press Continue when you are ready.')}},true);
 // Count victories without changing the existing combat resolution.
 let wasCombat=false;setInterval(()=>{const now=$('#combat')?.classList.contains('active');if(wasCombat&&!now&&combat?.enemyHp===0){state.meta.questProgress.wins++}wasCombat=now},120);
})();

/* Pass 5: keep building stats live and hand rewards off only after real victories. */
(()=>{
 state.meta=state.meta||{};state.meta.battleWonPending=state.meta.battleWonPending||false;
 let wasCombat=false;
 setInterval(()=>{const active=$('#combat')?.classList.contains('active');if(wasCombat&&!active&&combat&&combat.enemyHp===0){state.meta.battleWonPending=true}wasCombat=active},80);
 // Existing rewardCheck now consumes battleWonPending, so revisiting an area cannot create a stale reward.
 function liveStats(){if(!$('#interior')?.classList.contains('active'))return;const root=$('#interiorContent');const line=root?.querySelector('.inventory-line');if(line){line.textContent=`Coins: ◈ ${state.coins} · HP: ❤ ${state.hp}/${state.maxHp}`;}const cells=root?.querySelectorAll('.shop-grid span');if(cells&&cells.length>=6){cells[0].textContent=`Leather: ${state.materials.leather}`;cells[1].textContent=`Bones: ${state.materials.bones}`;cells[2].textContent=`Demon steel: ${state.materials.steel}`;cells[3].textContent=`Weapon Lv: ${state.weaponLevel}`;cells[4].textContent=`Armor Lv: ${state.armorLevel}`;cells[5].textContent=`Magic: ${state.gear==='magic'?state.affinity:'none'}`}}
 setInterval(liveStats,120);
})();

/* Pass 6: loadouts, combat effects, armor identity, and quest cleanup. */
(()=>{
 state.meta=state.meta||{};ensureCombatResources();state.meta.armorStats=state.meta.armorStats||{0:{name:'Placenta Starter',def:0,resist:'None'},1:{name:'Mild Inconvenience Mail',def:2,resist:'Soaked'},2:{name:'Grave Warden Coat',def:3,resist:'Cursed'},3:{name:'Questionable Plate',def:4,resist:'Bleeding'},4:{name:'Monarch’s Ruin',def:6,resist:'Burning'}};state.meta.armorRewardsClaimed=state.meta.armorRewardsClaimed||{};state.meta.guardNext=!!state.meta.guardNext;state.meta.armorPending=!!state.meta.armorPending;
 const armorFor=()=>state.meta.armorStats[state.armorSets?.[state.gender]||0]||state.meta.armorStats[0];
 // Completed contracts disappear rather than remaining as dead cards.
 setInterval(()=>{$$('.quest-contract.quest-complete').forEach(x=>x.remove())},250);
 // Add consumables and one-time spellbooks to the Merchant panel.
 function merchantStock(){if(!$('#interior')?.classList.contains('active')||state._building!=='merchant')return;ensureCombatResources();const wrap=$('#interiorContent');if(wrap.querySelector('[data-loadout-stock]'))return;const magic=state.gear==='magic';const goods=magic?`<button data-stock="healSpell" ${state.meta.spells.heal?'disabled':''}>Healing Spellbook · 14 coins ${state.meta.spells.heal?'<span class="obtained">OBTAINED</span>':''}</button><button data-stock="purifySpell" ${state.meta.spells.purify?'disabled':''}>Purify Spellbook · 18 coins ${state.meta.spells.purify?'<span class="obtained">OBTAINED</span>':''}</button>`:`<button data-stock="drumstick">Drumstick · 8 coins <span class="obtained">(${state.meta.items.drumstick})</span></button><button data-stock="midPotion">Mid Potion · 16 coins <span class="obtained">(${state.meta.items.midPotion})</span></button><button data-stock="highPotion">High Potion · 25 coins <span class="obtained">(${state.meta.items.highPotion})</span></button><button data-stock="antidote">Antidote · 8 coins <span class="obtained">(${state.meta.items.antidote})</span></button><button data-stock="cursebreaker">Cursebreaker · 10 coins <span class="obtained">(${state.meta.items.cursebreaker})</span></button>`;wrap.insertAdjacentHTML('beforeend',`<div data-loadout-stock class="quest-contract"><h3>Merchant stock</h3><p>${magic?'Spellbooks for magic users only.':'Consumables for weapon users only.'}</p><div class="dialog-buttons">${goods}</div></div>`);wrap.querySelectorAll('[data-stock]').forEach(b=>b.onclick=()=>buyStock(b.dataset.stock));}
 function buyStock(a){ensureCombatResources();const magic=state.gear==='magic',price={drumstick:8,midPotion:16,highPotion:25,antidote:8,cursebreaker:10,healSpell:14,purifySpell:18}[a];if(!price){window.dialogNotice('That stock is unavailable.');return}if((['healSpell','purifySpell'].includes(a)&&!magic)||(['drumstick','midPotion','highPotion','antidote','cursebreaker'].includes(a)&&magic)){window.dialogNotice('That stock is only available to the other class.');return}if((a==='healSpell'&&state.meta.spells.heal)||(a==='purifySpell'&&state.meta.spells.purify)){window.dialogNotice('You already obtained that spellbook.');return}if(state.coins<price){window.dialogNotice('Not enough coins. The merchant smiles without sympathy.');return}state.coins-=price;if(a==='healSpell')state.meta.spells.heal=true;if(a==='purifySpell')state.meta.spells.purify=true;if(['drumstick','midPotion','highPotion','antidote','cursebreaker'].includes(a))state.meta.items[a]++;window.dialogNotice('Purchase complete. Press Continue when you are ready.');$('#interiorContent [data-loadout-stock]')?.remove();setTimeout(merchantStock,150);}
 function loadoutCards(){if(!$('#combat')?.classList.contains('active'))return;const attack=$('.card.attack b'),attackSmall=$('.card.attack small'),third=$('.card.magic'),thirdB=third?.querySelector('b'),thirdSmall=third?.querySelector('small');if(state.gear==='magic'){if(attack)attack.textContent='✦ MAGIC ATTACK';if(attackSmall)attackSmall.textContent=`${state.affinity[0].toUpperCase()+state.affinity.slice(1)} damage`;if(third){third.classList.remove('items');third.classList.add('magic');if(thirdB)thirdB.textContent='✦ SPELLS';if(thirdSmall)thirdSmall.textContent=state.meta.spells.heal||state.meta.spells.purify?'Browse spellbooks':'No spellbooks · visit Merchant'}}else{if(attack)attack.textContent='⚔ FIGHT';if(attackSmall)attackSmall.textContent=state.gear==='bow'?'Weapon attack · ranged':'Weapon attack';if(third){third.classList.remove('magic');third.classList.add('items');if(thirdB)thirdB.textContent='✚ ITEMS';if(thirdSmall)thirdSmall.textContent=`Drumstick ${state.meta.items.drumstick} · Mid ${state.meta.items.midPotion} · High ${state.meta.items.highPotion}`}}}
 /* single card renderer below */
 // Item/spell usage and Guard's next-turn crit chance. This capture handler runs before legacy card handlers.
 window.weaponSfx=(weapon,card)=>{try{const A=window.AudioContext||window.webkitAudioContext,a=window._weaponAudio||(window._weaponAudio=new A()),o=a.createOscillator(),g=a.createGain();const f=weapon==='sword'?620:weapon==='bow'?880:weapon==='magic'?420:300;o.type=weapon==='bow'?'square':weapon==='magic'?'sine':'sawtooth';o.frequency.setValueAtTime(f,a.currentTime);o.frequency.exponentialRampToValueAtTime(f/2,a.currentTime+.16);g.gain.setValueAtTime(.07,a.currentTime);g.gain.exponentialRampToValueAtTime(.001,a.currentTime+.2);o.connect(g).connect(a.destination);o.start();o.stop(a.currentTime+.21)}catch(e){}}
 function openCombatItemPicker(){if(!$('#combat')?.classList.contains('active')||window.__battleNoticeOpen||window.__combatEnemyTurn||combat?.turnActionUsed)return;ensureCombatResources();const items=state.meta.items,available=[['drumstick','Drumstick','Restore 6 HP'],['midPotion','Mid Potion','Restore 12 HP'],['highPotion','High Potion','Restore 20 HP'],['antidote','Antidote','Clear Poisoned, Weakened, or Confused'],['cursebreaker','Cursebreaker','Clear Cursed or Armor Break']].filter(([key])=>(items[key]||0)>0);if(!available.length){window.battleNotice?.('Empty item pouch','Oh shit, I forgot to buy any items.');return}document.querySelector('#combatItemPicker')?.remove();const d=document.createElement('div');d.id='combatItemPicker';d.className='road-event';d.innerHTML=`<div class="road-event-card"><h2>Choose an item</h2><p>Select an item to use.</p><div class="event-options">${available.map(([key,label,effect])=>`<button data-combat-item="${key}">${label} · ${items[key]}<small>${effect}</small></button>`).join('')}<button data-combat-item-cancel>Cancel</button></div></div>`;document.querySelector('.game').appendChild(d);d.querySelectorAll('[data-combat-item]').forEach(b=>b.onclick=()=>{const key=b.dataset.combatItem;d.remove();window.battleUseConsumable?.(key)});d.querySelector('[data-combat-item-cancel]').onclick=()=>d.remove()}
 function openCombatSpellPicker(){if(!$('#combat')?.classList.contains('active')||window.__battleNoticeOpen||window.__combatEnemyTurn||combat?.turnActionUsed)return;const spells=state.meta.spells||{},available=[['heal','Healing Spell','Restore 12 HP · 3 mana'],['purify','Purify Spell','Clear all combat debuffs · 3 mana']].filter(([key])=>spells[key]);if(!available.length){window.battleNotice?.('Spellbook empty','Fuck, I knew those spellbooks were useful.');return}if(available.length===1){window.battleUseSpell?.(available[0][0]);return}document.querySelector('#spellPicker')?.remove();const d=document.createElement('div');d.id='spellPicker';d.className='road-event';d.innerHTML=`<div class="road-event-card"><h2>Choose a spell</h2><p>Select a spell to cast.</p><div class="event-options">${available.map(([key,label,effect])=>`<button data-cast="${key}">${label}<small>${effect}</small></button>`).join('')}<button data-cast-cancel>Cancel</button></div></div>`;document.querySelector('.game').appendChild(d);d.querySelectorAll('[data-cast]').forEach(b=>b.onclick=()=>{const key=b.dataset.cast;d.remove();window.battleUseSpell?.(key)});d.querySelector('[data-cast-cancel]').onclick=()=>d.remove()}
 let critWindow=false;document.addEventListener('click',e=>{const b=e.target.closest('#combat .card');if(!b||!$('#combat')?.classList.contains('active')||window.__battleNoticeOpen)return;const c=b.dataset.card;if(c==='guard'){state.meta.guardNext=true;return}if(c==='magic'){e.preventDefault();e.stopImmediatePropagation();if(state.gear==='magic')openCombatSpellPicker();else openCombatItemPicker();return}},true);
 // Magic spellbook use: add a simple spell selector inside the magic card when acquired.

 // Boss armor unlock notification, once per boss victory.
 let prevCombat=false;setInterval(()=>{const active=$('#combat')?.classList.contains('active');if(prevCombat&&!active&&combat?.enemyHp===0&&combat.level===5&&!state.meta.armorRewardsClaimed[state.hub]){state.meta.armorRewardsClaimed[state.hub]=true;state.meta.armorPending=true}prevCombat=active;if($('#map')?.classList.contains('active')&&state.meta.armorPending&&!$('.reward-modal')){const a=armorFor();const d=document.createElement('div');d.className='reward-modal';d.innerHTML=`<div class="reward-card armor-unlock"><h2>Armor set unlocked</h2><p><b>${a.name}</b> is now available in the Player House.</p><div class="armor-stats"><span>Defense +${a.def}</span><span>Resists ${a.resist}</span></div><button>Continue</button></div>`;document.querySelector('.game').appendChild(d);d.querySelector('button').onclick=()=>{state.meta.armorPending=false;d.remove()}}},120);
})();

(()=>{
 state.meta=state.meta||{};state.meta.armorStats=state.meta.armorStats||{};
 function houseLocker(){if(!$('#interior')?.classList.contains('active')||state._building!=='home')return;const wrap=$('#interiorContent');if(wrap.querySelector('[data-house-locker]'))return;const unlocked=state.unlockedArmor?.[state.gender]||[0];const current=state.armorSets?.[state.gender]||0;const stats=state.meta.armorStats||{};const cards=unlocked.slice().sort((a,b)=>a-b).map(i=>{const s=stats[i]||{name:(window.ARMOR_NAMES?.[i]||`Armor Set ${i+1}`),def:i,resist:'None'};return `<button data-equip-armor="${i}" class="${current===i?'equipped':''}"><b>${s.name}${current===i?' · EQUIPPED':''}</b><small>Defense +${s.def||0} · Resists ${s.resist||'None'}</small></button>`}).join('');wrap.insertAdjacentHTML('beforeend',`<div class="house-locker" data-house-locker><h3>Equipment locker</h3><p>Change your armor and review its bonuses.</p><div class="armor-list">${cards}</div></div>`);wrap.querySelectorAll('[data-equip-armor]').forEach(b=>b.onclick=()=>{state.armorSets[state.gender]=+b.dataset.equipArmor;window.dialogNotice(`Equipped ${stats[b.dataset.equipArmor]?.name||'armor set'}. Press Continue when ready.`);wrap.querySelector('[data-house-locker]')?.remove();setTimeout(houseLocker,150)})}
 /* Armor Set is rendered inside the compact House submenu. */
})();

(()=>{
 function syncCombatVitals(){if(!$('#combat')?.classList.contains('active'))return;if(typeof combat!=='undefined'){$('#playerHp')?.style.setProperty('width',Math.max(0,Math.min(100,(combat.playerHp/state.maxHp)*100))+'%');$('#enemyHp')?.style.setProperty('width',Math.max(0,Math.min(100,(combat.enemyHp/combat.enemyMax)*100))+'%')}const strip=$('.status-strip');if(strip)strip.innerHTML=(state.meta.statuses||[]).map(x=>`<span class="status-tag">${x}</span>`).join('')||'';$('#mapHp')&&(($('#mapHp').textContent=state.hp));$('#villageHp')&&(($('#villageHp').textContent=state.hp))}
 setInterval(syncCombatVitals,80);
})();

try{ASSETS['Gloomfang']='Textures/Monsters/gloomfang.png'}catch(e){console.warn('Gloomfang asset unavailable',e)}

(()=>{
 function refreshCombatTheme(){const c=$('#combat');if(!c)return;c.classList.toggle('modern-ui',c.classList.contains('active'));c.classList.toggle('boss-encounter',!!(typeof combat!=='undefined'&&combat.boss));}
 setInterval(refreshCombatTheme,100);
})();

/* Pass 11: objective rewrite + Questionable Decisions puzzle route. */
(()=>{
 state.meta=state.meta||{};state.meta.questContracts=state.meta.questContracts||{};state.meta.labyrinthQuiz=state.meta.labyrinthQuiz||{};
 const areaNames=['Placenta Creek','Mild Inconvenience','Grave Mistake','Questionable Decisions','Dread Fortress'];
 function objective(){const p=state.progress||[0,0,0,0,0];if(state.ng&&state.meta?.ngPlusRouteKey){const hub=p.findIndex(x=>Number(x||0)<5);if(hub<0)return `${state.meta.ngPlusWorldName||'New Game+'}: all five areas cleared.`;const level=Math.min(5,Number(p[hub]||0)+1),story=window.getNgPlusEncounterStory?.(hub,level);return story?`${story.world} · ${story.area} Level ${level}: ${story.enemy}.`:`Clear Level ${level} in ${hubs[hub][0]}.`}const c=state.meta.questContracts||{};const active=Object.entries(c).find(([k,v])=>v==='active');if(active){const q={cathedral:'Find the missing reliquary and return it to the priest.',blacksmith:'Win a combat test for the blacksmith and bring back the results.',merchant:'Complete a suspiciously legal transaction for the merchant.'};return q[active[0]]}if(state.won)return 'The Monarch is defeated. Try not to become the new problem.';if(!p.some(Boolean))return 'Clear out the monsters in Placenta Creek. The local goose union has filed a complaint.';for(let i=0;i<5;i++){if((p[i]||0)<5){if(i===3)return 'Survive the Labyrinth of Questionable Decisions. Four puzzles. One anxious Minotaur.';return `Clear the monsters in ${areaNames[i]}. Five fights and absolutely no emotional support.`}}return 'Every area is cleared. The Monarch is probably hiding somewhere dramatically.'}
 setInterval(()=>{if($('#questBar span')){$('#questBar span').textContent=objective();state.meta.quest=objective()}},180);
 const quizzes={1:{title:'The Runes of Regret',question:'The wall flashes a 9-symbol sequence: skull → candle → eye → raven → skull → candle → eye → raven → ? Which rune completes the cycle?',answers:['Raven','Crown','Goose','Your student loans'],correct:0,success:'The runes applaud politely. The wall opens.'},2:{title:'The Weight of Stupidity',question:'A counterweight puzzle has four stones: 3, 5, 7, and 11. The left pan weighs 14. Which two stones balance it exactly?',answers:['3 + 11','5 + 7','3 + 5 + 7','The one labeled “free snacks”'],correct:1,success:'The scale balances. Somewhere, a mathematician feels uneasy.'},3:{title:'The Beam of Misdirection',question:'Three prisms rotate together. Red turns 90° clockwise, blue turns 180°, and violet turns 270°. Which prism ends upside-down relative to its starting orientation?',answers:['Red','Blue','Violet','Beige'],correct:1,success:'The prism rotates into place. It was mostly decorative, honestly.'},4:{title:'The Gauntlet of Impending Doom',question:'The guillotine cycles 2 seconds down, 1 second up, then pauses 3 seconds. When is the safest crossing window?',answers:['During the 1-second rise','During the 2-second drop','During the first pause','Whenever you feel destiny calling'],correct:0,success:'You move at exactly the right moment. The traps look personally offended.'}};
 function quiz(level){const q=quizzes[level];const d=document.createElement('div');d.className='quiz-modal';d.innerHTML=`<div class="quiz-card"><div class="quiz-progress">Questionable Decisions · Level ${level} / 4</div><h2>${q.title}</h2><p class="riddle">${q.question}</p><div class="quiz-options">${q.answers.map((a,i)=>`<button data-answer="${i}">${a}</button>`).join('')}</div></div>`;document.querySelector('.game').appendChild(d);d.querySelectorAll('[data-answer]').forEach(b=>b.onclick=()=>{if(+b.dataset.answer===q.correct){const inArea4Combat=state.hub===3&&combat?.area4QuizLevel===level&&$('#combat')?.classList.contains('active');state.progress[3]=Math.max(state.progress[3]||0,level);state.coins+=(state.hub+1)*level*3;d.remove();if(inArea4Combat){$('#battlePrompt').textContent='Labyrinth cleared!';$('#battleDetail').textContent=q.success;save();window.openBattleReward?.('Labyrinth cleared!',false);return}window.dialogNotice(`${q.success} Level ${level} cleared. Press Continue when ready.`);window.renderMap();show('map')}else{d.remove();deathScreen(`The labyrinth rejects your answer. The trap mechanism says: “No.”`)}})}
 window.startArea4Quiz=quiz;
 const PRIEST_REVIVAL_ROASTS=[
  'Oh, good. You’re awake. I was about to loot your pockets.',
  'You’re alive? Cool. Can you pay me for the funeral?',
  'You’re breathing again. Great. This is gonna ruin my paperwork.',
  'Oh crap. I already told everyone you were dead.',
  'You’re alive? Fuck. Guess I owe the merchant twenty coins.',
  'Ugh.. Try not to make this a recurring thing.',
  'You were dead ten minutes ago.',
  'Oh, you’re awake? Just great. Now I have to explain this.',
  'You just came back from the dead. Still look terrible tho.',
  'Please stop dying. I’m running out of excuses.'
 ];
 function deathScreen(reason){
  const d=document.createElement('div');
  d.className='death-modal';
  d.innerHTML=`<div class="death-text">YOU DIED</div><div class="death-sub">${reason||'The paper has been dramatically rearranged.'}</div>`;
  document.querySelector('.game').appendChild(d);
  state.hp=state.maxHp;
  state.meta.statuses=[];
  setTimeout(()=>{
   window.__cathedralRespawnLine=PRIEST_REVIVAL_ROASTS[Math.floor(Math.random()*PRIEST_REVIVAL_ROASTS.length)];
   d.style.transition='opacity .45s ease';
   d.style.opacity='0';
   setTimeout(()=>{d.remove();window.openFacility('cathedral')},470);
  },1900);
 }
 window.deathScreen=deathScreen;
 // Intercept only the first four labyrinth levels. Level 5 remains a normal Minotaur battle.
 // Replace the old death return-to-map behavior for ordinary combat failures.
 let priorHp=state.hp;setInterval(()=>{if($('#combat')?.classList.contains('active')&&typeof combat!=='undefined'&&combat.playerHp<=0&&combat.playerHp!==priorHp){deathScreen('Your health bar has filed for bankruptcy.');}if(typeof combat!=='undefined')priorHp=combat.playerHp},120);
})();

document.addEventListener('click',e=>{if(!e.target.closest('#newGameChoice'))return;state.meta={quest:'Clear out the monsters in Placenta Creek. The local goose union has filed a complaint.',questsDone:[],visited:[],relationships:{priest:0,blacksmith:0,merchant:0},statuses:[],cardUpgrades:{attack:0,guard:0,magic:0},questContracts:{},questProgress:{heals:0,trades:0,wins:0},items:{potion:0,antidote:0,cursebreaker:0},spells:{heal:false,purify:false},armorStats:state.meta?.armorStats||{},armorRewardsClaimed:{},armorPending:false,ngPlus:0,guardNext:false,battleWonPending:false};state.hp=30;state.maxHp=30;state.coins=24;state.weaponLevel=0;state.armorLevel=0;state.progress=[0,0,0,0,0];state.maxHub=0;state.hub=0;state.won=false;state.materials={leather:2,bones:0,steel:0};state.furniture=[];state.unlockedArmor={male:[0],female:[0]};state.armorSets={male:0,female:0}},true);

try{ASSETS['FEMALE_05_Monarchs_Eclipse']='Textures/Player/Armor/female-05-monarchs-eclipse.png'}catch(e){}

const COMBAT_CARD_ART={"sword":"Textures/UI/Combat/sword.png","bow":"Textures/UI/Combat/bow.png","guard":"Textures/UI/Combat/guard.png","evade":"Textures/UI/Combat/evade.png","items":"Textures/UI/Combat/items.png","spells":"Textures/UI/Combat/spells.png","magic":"Textures/UI/Combat/magic.png"};
(function(){
  function syncCombatCardArt(){
    const combatScreen=document.querySelector("#combat"); if(!combatScreen) return;
    document.querySelectorAll("#combat .card").forEach(card=>{
      let key=card.dataset.card;
      /* The third button keeps data-card="magic" for combat logic, but its
         class changes to items for sword/bow loadouts. Use the class first. */
      if(key==="guard"&&state.gear==="bow") key="evade";
      if(card.classList.contains("items")) key="items";
      else if(key==="attack") key=(card.querySelector("small")?.textContent||"").includes("ranged")?"bow":"sword";
      else if(key==="magic") key=(card.querySelector("b")?.textContent||"").includes("SPELLS")?"spells":"magic";
      card.style.backgroundImage=`url("${COMBAT_CARD_ART[key]||COMBAT_CARD_ART.sword}")`;
      card.setAttribute("aria-label",(card.querySelector("b")?.textContent||key).replace(/^[^A-Za-z]+/,""));
    });
  }
  syncCombatCardArt();
  /* single card renderer below */
})();

(function(){
  window.floatDamageNumber=function(target,amount){
    if(!target||!amount)return;
    const field=document.querySelector("#combat .battle-field"); if(!field)return;
    const number=document.createElement("div"); number.className="damage-number"; number.textContent="-"+amount;
    const tr=target.getBoundingClientRect(), fr=field.getBoundingClientRect();
    number.style.left=(tr.left-fr.left+tr.width*.5)+"px";
    number.style.top=(tr.top-fr.top+tr.height*.28)+"px";
    field.appendChild(number); setTimeout(()=>number.remove(),900);
  };
})();

(function(){
 const overlay=document.querySelector('#introExperience'),video=document.querySelector('#introVideo'),dialogue=document.querySelector('#introDialogue'),text=document.querySelector('#introDialogueText'),next=document.querySelector('#introContinue'),skip=document.querySelector('#introSkip');
 const lines=['Behold… a world choked in the sweet, suffocating gloom of my absolute authority.','I am Lucien, the Sovereign of Scorn… Master of the Midnight Flame.','For a century, mortal fools dared to whisper defiance.','Every single one was crushed beneath my armored boot.','Yet the stars tremble…','A foolish bug dares to crawl forth from the mud.','A so-called Savior rises.','Tell me, little worm…','Will you shatter this eternal darkness?','Or will your pathetic skull decorate my throne room mantle like all the rest?'];
 let index=0,typing=false,timer=0,resumeMusic=false;
 function soundtrackIsOn(){return document.querySelector('#musicToggle')?.getAttribute('aria-pressed')==='true'}
 function setSoundtrack(on){const b=document.querySelector('#musicToggle');if(b&&soundtrackIsOn()!==on)b.click()}
 function openIntro(){setSoundtrack(false);overlay.classList.add('open');dialogue.classList.remove('active');skip.style.display='block';video.currentTime=0;video.play().catch(()=>{});}
 function showDialogue(){video.pause();skip.style.display='none';dialogue.classList.add('active');index=0;renderLine()}
 function renderLine(){clearInterval(timer);typing=true;next.textContent='Continue';text.textContent='';dialogue.querySelector('#introDialogueBox').classList.add('typing');let i=0;timer=setInterval(()=>{text.textContent=lines[index].slice(0,++i);if(i>=lines[index].length){clearInterval(timer);typing=false;dialogue.querySelector('#introDialogueBox').classList.remove('typing')}},22)}
 function advance(){if(typing){clearInterval(timer);text.textContent=lines[index];typing=false;dialogue.querySelector('#introDialogueBox').classList.remove('typing');return}if(index<lines.length-1){index++;renderLine()}else{overlay.classList.remove('open');dialogue.classList.remove('active');document.querySelector('#create')?.classList.add('active');setSoundtrack(resumeMusic)}}
 video.addEventListener('ended',showDialogue);skip.addEventListener('click',showDialogue);next.addEventListener('click',advance);
 function wrapNewGameButton(id){const b=document.querySelector(id);if(!b)return;const old=b.onclick;b.onclick=function(){resumeMusic=soundtrackIsOn();if(old)old.call(this);setSoundtrack(false);openIntro()}}
 wrapNewGameButton('#beginBtn');wrapNewGameButton('#newGameChoice');
})();

(()=>{
 const characters={cathedral:['Priest','Textures/NPCs/priest.png'],blacksmith:['Blacksmith','Textures/NPCs/blacksmith.png'],merchant:['Merchant','Textures/NPCs/merchant.png'],home:['Your House','']};
 const neg=['Bleeding','Burning','Soaked','Poisoned','Cursed','Wild magic'];
 const questCopy={cathedral:['The Missing Reliquary','Find the missing reliquary and return it to the priest.','Blessed Charm'],blacksmith:['Test the Edge','Win a combat encounter and return with the results.','Forged Edge'],merchant:['A Rare Trade','Complete a suspiciously legal transaction.','Merchant’s Ledger']};
 function stats(type){let html=`<div class="compact-stats">Coins: ◈ ${state.coins} &nbsp;·&nbsp; HP: ❤ ${state.hp}/${state.maxHp}</div>`;if(type==='blacksmith')html+=`<div class="compact-materials"><span>Leather: ${state.materials?.leather||0}</span><span>Bones: ${state.materials?.bones||0}</span><span>Demon steel: ${state.materials?.steel||0}</span><span>${state.gear==='magic'?'Magic':'Weapon'} Lv: ${state.gear==='magic'?state.magicLevel||0:state.weaponLevel||0}</span><span>Armor Lv: ${state.armorLevel||0}</span></div>`;return html}
 function panel(){return $('#interiorContent')}
 function button(action,label,extra=''){return `<button data-compact-action="${action}" ${extra}>${label}</button>`}
 function main(type){if(!panel())return;let title=characters[type]?.[0]||'Building';let menu='';if(type==='merchant')menu=[button('talk','Talk'),button('shop','Shop'),button('quest','Quest'),button('leave','Leave')].join('');if(type==='cathedral')menu=[button('talk','Talk'),button('service','Service'),button('quest','Quest'),button('leave','Leave')].join('');if(type==='blacksmith')menu=[button('talk','Talk'),button('upgrade',state.gear==='magic'?'Upgrade Magic':'Upgrade Weapon'),button('armor','Upgrade Armor'),button('leave','Leave')].join('');if(type==='home')menu=[button('rest','Rest'),button('armor','Armor Set'),button('codex','Check Codex'),button('leave','Leave')].join('');panel().dataset.compact='main';panel().innerHTML=`<h2>${title}</h2>${stats(type)}<div class="compact-menu">${menu}</div>`}
 function sub(type,view){if(!panel())return;let body='';if(view==='talk'){const c=characters[type]||characters.home;const lines={cathedral:'The light welcomes you, child. Try not to track mud over the sanctum.',blacksmith:'Need a sharper edge? I have one. It is probably haunted.',merchant:'Fresh wares! Mostly fresh, anyway. The labels are optimistic.',home:'Home sweet home. It smells faintly of victory.'};body=`<h2>${c[0]}</h2><p class="compact-copy">${lines[type]||''}</p>${button('back','Back')}`}
 if(view==='service')body=`<h2>Cathedral Service</h2>${stats(type)}<div class="compact-options">${button('heal','Restore full HP · 8 coins')}${button('pray','Pray · restore 4 HP')}${button('purify','Purify ailments · 6 coins')}${button('bless','Receive blessing · 10 coins')}${button('back','Back')}</div>`;
 if(view==='shop'){let magic=state.gear==='magic';body=`<h2>Shop</h2>${stats(type)}<p class="compact-copy">${magic?'Spellbooks and materials for magic users.':'Items and materials for weapon users.'}</p><div class="compact-options">${magic?button('buy-heal','Healing Spellbook · 14 coins')+button('buy-purify','Purify Spellbook · 18 coins'):button('buy-potion','Healing Potion · 6 coins')+button('buy-antidote','Antidote · 7 coins')}${button('buy-leather','Leather · 5 coins')}${button('buy-bones','Bones · 7 coins')}${button('buy-steel','Demon steel · 12 coins')}${button('back','Back')}</div>`}
 if(view==='upgrade')body=`<h2>${state.gear==='magic'?'Upgrade Magic':'Upgrade Weapon'}</h2>${stats(type)}<p class="compact-copy">${state.gear==='magic'?`Magic level ${state.magicLevel||0} → ${(state.magicLevel||0)+1}. Cost: ${12+(state.magicLevel||0)*8} coins + 1 demon steel.`:`Weapon level ${state.weaponLevel||0} → ${(state.weaponLevel||0)+1}. Cost: ${12+(state.weaponLevel||0)*8} coins + 1 leather.`}</p><div class="compact-options">${button('do-upgrade',state.gear==='magic'?'Upgrade Magic':'Upgrade Weapon')}${button('back','Back')}</div>`;
 if(view==='armor')body=`<h2>Upgrade Armor</h2>${stats(type)}<p class="compact-copy">Armor level ${state.armorLevel||0} → ${(state.armorLevel||0)+1}. Cost: 8 coins + 1 bone. Max HP +3.</p><div class="compact-options">${button('do-armor','Upgrade Armor')}${button('back','Back')}</div>`;
 if(view==='quest'){let q=questCopy[type]||['Quest','No active quest here.',''];body=`<h2>${q[0]}</h2><p class="compact-copy">${q[1]}<br><b>Reward:</b> ${q[2]}</p><div class="compact-options">${button('accept-quest','Accept Quest')}${button('back','Back')}</div>`}
 if(view==='house-armor'){let unlocked=(state.unlockedArmor?.[state.gender]||[0]).slice().sort((a,b)=>a-b);let names=ARMOR_NAMES;body=`<h2>Armor Set</h2><div class="compact-armor-grid">${unlocked.map(i=>`<button data-compact-equip="${i}" class="${(state.armorSets?.[state.gender]||0)===i?'equipped':''}"><b>${names[i]||`Armor Set ${i+1}`}</b><small>${(state.armorSets?.[state.gender]||0)===i?'EQUIPPED':'Wear set'}</small></button>`).join('')}</div>${button('back','Back')}`}
 if(view==='rest')body=`<h2>Rest</h2><p class="compact-copy">Restore HP and clear negative ailments.</p><div class="compact-options">${button('do-rest','Rest and recover')}${button('back','Back')}</div>`;
 panel().dataset.compact=view;panel().innerHTML=body}
 function notice(msg){window.dialogNotice?.(msg)}
 let MONSTER_CODEX=[];
 function codex(){const list=MONSTER_CODEX;const render=i=>{const x=list[i],found=(state.meta?.codexUnlocked||[]).includes(x[0]),name=found?x[0]:'Unknown Creature',desc=found?x[1]:'Defeat this monster to reveal its page.',src=found&&typeof asset==='function'?asset(x[0]):'';$('#codexCard').className='codex-card book-shell';$('#codexCard').innerHTML=`<div class="codex-book"><button class="codex-close">×</button><div class="codex-page left"><div class="codex-monster-window ${found?'':'locked'}">${src?`<img src="${src}" alt="${name}">`:''}</div><h3>${name}</h3><div class="codex-discovery">${found?'DISCOVERED':'LOCKED ENTRY'}</div></div><div class="codex-page right"><div class="codex-notes"><div class="field">Page ${i+1} of ${list.length}</div><div class="obs">${desc}</div></div></div></div><div class="codex-nav"><button data-codex-prev>◀ Previous</button><span style="color:#f8eed7;font-weight:900">${i+1} / ${list.length}</span><button data-codex-next>Next ▶</button></div>`;$('#codexCard .codex-close').onclick=()=>$('#codexOverlay').classList.remove('open');$('#codexCard [data-codex-prev]').onclick=()=>render((i-1+list.length)%list.length);$('#codexCard [data-codex-next]').onclick=()=>render((i+1)%list.length)};$('#codexOverlay').classList.add('open');render(0)}
 window.openHouseCodex=codex;
 document.addEventListener('click',e=>{const b=e.target.closest('[data-compact-action]');if(!b||!$('#interior')?.classList.contains('active'))return;e.preventDefault();const a=b.dataset.compactAction,type=state._building;if(a==='back'){main(type);return}if(a==='talk'){sub(type,'talk');return}if(a==='shop'||a==='service'||a==='upgrade'||a==='armor'||a==='quest'||a==='rest'){sub(type,a==='armor'&&type==='home'?'house-armor':a==='rest'&&type==='home'?'rest':a);return}if(a==='leave'){show('village');renderVillage();return}if(a==='codex'){codex();return}if(a==='do-rest'){state.hp=state.maxHp;state.meta.statuses=(state.meta.statuses||[]).filter(x=>!neg.includes(x));notice('You rest and recover.');main(type);return}if(a==='heal'){if(state.coins>=8){state.coins-=8;state.hp=state.maxHp;notice('Your health is restored.')}else notice('Not enough coins.');return}if(a==='pray'){state.hp=Math.min(state.maxHp,state.hp+4);notice('A small blessing settles over you.');return}if(a==='purify'){if(state.coins>=6){state.coins-=6;state.meta.statuses=(state.meta.statuses||[]).filter(x=>!neg.includes(x));notice('Ailments purified.')}else notice('Purification costs 6 coins.');return}if(a==='bless'){if(state.coins>=10){state.coins-=10;if(!state.meta.statuses.includes('Blessed'))state.meta.statuses.push('Blessed');notice('You receive a blessing.')}else notice('The cathedral requests 10 coins.');return}if(a==='do-upgrade'){if(state.gear==='magic'){let c=12+(state.magicLevel||0)*8;if(state.coins>=c&&(state.materials?.steel||0)>=1){state.coins-=c;state.materials.steel--;state.magicLevel=(state.magicLevel||0)+1;notice('Your magic focus is upgraded.')}else notice('Not enough coins or demon steel.')}else{let c=12+(state.weaponLevel||0)*8;if(state.coins>=c&&(state.materials?.leather||0)>=1){state.coins-=c;state.materials.leather--;state.weaponLevel++;notice('Your weapon is upgraded.')}else notice('Not enough coins or leather.')}sub(type,'upgrade');return}if(a==='do-armor'){if(state.coins>=8&&(state.materials?.bones||0)>=1){state.coins-=8;state.materials.bones--;state.armorLevel++;state.maxHp+=3;state.hp=state.maxHp;notice('Your armor is reinforced.')}else notice('Not enough coins or bones.');sub(type,'armor');return}if(a.startsWith('buy-')){const prices={ 'buy-potion':6,'buy-antidote':7,'buy-cursebreaker':9,'buy-heal':14,'buy-purify':18,'buy-leather':5,'buy-bones':7,'buy-steel':12};const key=a.replace('buy-','');if(state.coins>=prices[a]){state.coins-=prices[a];if(key==='potion')state.meta.items.potion++;if(key==='antidote')state.meta.items.antidote++;if(key==='cursebreaker')state.meta.items.cursebreaker++;if(key==='heal')state.meta.spells.heal=true;if(key==='purify')state.meta.spells.purify=true;if(key==='leather'||key==='bones'||key==='steel')state.materials[key]++;notice('Purchase complete.');}else notice('Not enough coins.');sub(type,'shop');return}if(a==='accept-quest'){state.meta.questContracts=state.meta.questContracts||{};state.meta.questContracts[type]='active';state.meta.quest=questCopy[type]?.[1]||state.meta.quest;notice('Quest accepted.');sub(type,'quest');return}});
 document.addEventListener('click',e=>{const b=e.target.closest('[data-compact-equip]');if(!b)return;state.armorSets[state.gender]=+b.dataset.compactEquip;sub('home','house-armor')});
 // All 25 area monsters are always present; defeated entries are unlocked by exact name.
 const all=['Slime Rat','Angry Goose','Drunk Peasant','Rabid Raccoon','Sir Barnaby','Goblin Poacher','Zombie Wolf','Bullying Sprite','Cursed Timberwolf','Gloomfang','Skeleton Archer','Moldy Mummy','Necromancer Apprentice','Grave Wraith','Lich King Timmy','Minotaur with Anxiety','Daedric Knight','Gargoyle','Dark Sorcerer','Throne Warden','Monarch Lucien'];MONSTER_CODEX=all.map(name=>[name,`Field notes for ${name}.`]);
 setInterval(()=>{if(!$('#interior')?.classList.contains('active'))return;const type=state._building||'home';const c=panel();if(!c)return;if(c.dataset.compact!=='main'&&c.dataset.compact!=='talk'&&c.dataset.compact!=='shop'&&c.dataset.compact!=='service'&&c.dataset.compact!=='upgrade'&&c.dataset.compact!=='armor'&&c.dataset.compact!=='quest'&&c.dataset.compact!=='rest'&&c.dataset.compact!=='house-armor'&&c.dataset.compact!=='settings')main(type)},120);
 document.addEventListener('click',e=>{if(e.target.closest('[data-facility]'))setTimeout(()=>main(state._building||'home'),260)},true);
})();

(()=>{
 function cards(){if(!$('#combat')?.classList.contains('active'))return;const p=$('#combat .card[data-card="attack"]'),g=$('#combat .card[data-card="guard"]'),m=$('#combat .card[data-card="magic"]');if(!p||!g||!m)return;const magic=state.gear==='magic',a=state.affinity||'water';p.classList.toggle('magic-primary',magic);p.classList.toggle('attack',!magic);p.querySelector('b').textContent=magic?'✦ MAGIC':'⚔ '+(state.gear==='bow'?'SHOOT':'ATTACK');p.querySelector('small').textContent=magic?`${a[0].toUpperCase()+a.slice(1)} spell strike`:state.gear==='bow'?'Weapon attack · ranged':'Weapon attack';p.style.backgroundImage=`url("${magic?COMBAT_CARD_ART.magic:(state.gear==='bow'?COMBAT_CARD_ART.bow:COMBAT_CARD_ART.sword)}")`;g.classList.toggle('bow-evade',state.gear==='bow');g.querySelector('b').textContent=state.gear==='bow'?'EVADE':'GUARD';g.querySelector('small').textContent=state.gear==='bow'?'Hit me if you can':'Reduce incoming damage';g.style.backgroundImage=`url("${state.gear==='bow'?COMBAT_CARD_ART.evade:COMBAT_CARD_ART.guard}")`;m.classList.toggle('items',!magic);m.classList.toggle('magic',magic);m.querySelector('b').textContent=magic?'✦ SPELLS':'✚ ITEMS';m.querySelector('small').textContent=magic?(state.meta.spells.heal||state.meta.spells.purify?'Browse spellbooks':'No spellbooks · visit Merchant'):(state.meta.items?.drumstick||0)+(state.meta.items?.midPotion||0)+(state.meta.items?.highPotion||0)+(state.meta.items?.antidote||0)+(state.meta.items?.cursebreaker||0)?`Drumstick ${state.meta.items?.drumstick||0} · Mid ${state.meta.items?.midPotion||0} · High ${state.meta.items?.highPotion||0}`:'No items · visit Merchant';m.style.backgroundImage=`url("${magic?COMBAT_CARD_ART.spells:COMBAT_CARD_ART.items}")`}
 document.addEventListener('click',e=>{const b=e.target.closest('#combat .card[data-card="attack"]');if(!b||!$('#combat')?.classList.contains('active')||state.gear!=='magic')return;e.preventDefault();e.stopImmediatePropagation();const old=state.weaponLevel,bonus=state.meta.cardUpgrades?.magic||0;state.weaponLevel=old+bonus;window.playCard('magic');state.weaponLevel=old},true);
 setInterval(cards,120);
})();

(()=>{
 const LONG_DIALOGUES={"cathedral": ["The light welcomes you. It has terrible taste in furniture.", "I prayed for a miracle and received a tax notice.", "Please wipe your boots. The floor is holier than most people.", "The candles are watching you. One of them has already filed a complaint.", "Our choir sings beautifully, especially when nobody asks them to stop.", "The cathedral is peaceful today, which means the ghosts are planning something.", "I can bless you, but I cannot bless your spending habits.", "The stained glass depicts a saint defeating a goose. History is complicated.", "Confession is free. The emotional damage is extra.", "The reliquary vanished, and somehow everyone suspects the person holding a sword.", "I keep the holy water next to the regular water. The labels are not helpful.", "The altar has seen more bad decisions than a royal courtroom.", "If you hear whispering from the crypt, whisper back politely.", "We accept coins, apologies, and proof that you did not steal the relic.", "The old bell rings whenever someone lies. It has been ringing for three days.", "I wanted a quiet life. Then adventurers discovered doors.", "A blessing lasts longer if you stop immediately walking into traps.", "The cathedral roof leaks only during important sermons.", "Our patron saint is technically still wanted by the monastery.", "Try not to summon anything in the chapel. We just repaired the summoning circle."], "blacksmith": ["The forge is hot, the steel is stubborn, and your purse looks light.", "Need a sharper edge? I have one. It is probably haunted.", "A good sword is ninety percent metal and ten percent dramatic posing.", "Your armor is making a noise that suggests it has opinions.", "I can fix the blade. I cannot fix the decision that broke it.", "The anvil has a name. We do not say it after sunset.", "Bring leather, coins, and a willingness to ignore safety instructions.", "Every dent tells a story. Yours says you stood still a lot.", "Magic weapons are just regular weapons with better marketing.", "I forged a helmet that protects against curses and unsolicited advice.", "The furnace is hungry. Please do not feed it your quest log again.", "A bowstring is cheaper than therapy and usually more effective.", "Your shield is held together by rivets, spite, and one suspicious prayer.", "I once made a royal crown. It was mostly decorative and emotionally fragile.", "If the hammer starts whispering, hammer it harder.", "Armor should fit snugly enough to protect you and loosely enough to regret.", "I can temper steel. Tempering heroes takes much longer.", "The last adventurer asked for a legendary sword and paid in turnips.", "A clean blade is a sign of discipline. Or that you have not used it yet.", "Do not touch the glowing metal. That advice has saved exactly nobody."], "merchant": ["Fresh wares! Mostly fresh, anyway. The labels are optimistic.", "I sell miracles by the bottle and regrets by the crate.", "Everything is a bargain if you ignore what it cost me.", "The skull is decorative. The tax receipt is not.", "I have potions for healing, courage, and pretending you understood the quest.", "Spellbooks are non-refundable once the letters start rearranging themselves.", "Materials are up this week. The bones market is surprisingly volatile.", "I accept coins, favors, and secrets that are not legally actionable.", "My shop has a return policy. The policy is that returns are unfortunate.", "This rug is cursed, but only in a charming, conversational way.", "You look like someone who needs a discount and will receive a lecture instead.", "The merchant guild says these prices are fair. The merchant guild is me.", "I stock antidotes for poison, curses, and suspicious soup.", "The rare goods are behind the curtain. The curtain is also for sale.", "If a potion glows, it is either magical or extremely spoiled.", "I can identify that relic. For a fee. I can also misidentify it for less.", "The spellbook says do not read aloud. Naturally, everyone reads it aloud.", "My inventory is organized alphabetically by how dangerous it is.", "I once sold a hero a map. The map led to me. Very profitable.", "Come back after your next disaster. Disasters are excellent for repeat business."]};
 const LONG_QUESTS={"cathedral": [["The Missing Reliquary", "Purify one ailment or restore your health, then return.", "Blessed Charm · removes the first negative ailment each battle", 8, 12], ["Candle Tax", "Clear two negative ailments.", "8 coins + 1 potion", 2, 8], ["Choir Practice", "Win one combat encounter without Guard.", "Blessed Thread · +1 max HP", 1, 15], ["Crypt Errand", "Defeat three monsters.", "12 coins + 1 bone", 3, 12], ["Bell of Bad Omens", "Survive a boss encounter.", "20 coins + 1 demon steel", 1, 20], ["Saints and Sinners", "Use three cathedral services.", "Blessing · +2 max HP", 3, 10], ["The Polite Exorcism", "Clear Burning, Soaked, or Cursed.", "Holy Seal · resistance bonus", 1, 14], ["Pilgrim Mileage", "Clear five encounters.", "25 coins + 2 bones", 5, 25], ["A Very Long Sermon", "Reach the next area.", "30 coins + 1 steel", 1, 30], ["The Last Benediction", "Defeat ten monsters.", "Cathedral Favor · permanent blessing", 10, 40]], "blacksmith": [["Test the Edge", "Win one combat encounter.", "Forged Edge · +2 attack damage", 1, 12], ["Leather Weather", "Collect five leather.", "10 coins + 1 armor level", 5, 10], ["Hammer Time", "Upgrade weapon or magic once.", "12 coins + 1 steel", 1, 12], ["Armor of Regret", "Upgrade armor once.", "15 coins + 1 bone", 1, 15], ["Field Testing", "Win three encounters.", "20 coins + 1 leather", 3, 20], ["Boss Material", "Defeat a boss.", "25 coins + 2 steel", 1, 25], ["Temper Temper", "Collect three bones.", "18 coins + armor resistance", 3, 18], ["The Perfect Focus", "Reach Magic Lv 2 or Weapon Lv 2.", "30 coins + 1 steel", 2, 30], ["Anvil Marathon", "Win seven encounters.", "35 coins + 2 leather", 7, 35], ["Masterwork", "Win ten encounters and reach Armor Lv 2.", "Masterwork upgrade · +5 max HP", 10, 50]], "merchant": [["A Rare Trade", "Complete one purchase or sale.", "Merchant Ledger · shop discount", 1, 10], ["Stock Rotation", "Buy two materials.", "8 coins + 1 leather", 2, 8], ["Suspiciously Legal", "Sell one material.", "10 coins + 1 potion", 1, 10], ["Potion Commotion", "Buy two potions or antidotes.", "15 coins + 1 antidote", 2, 15], ["Spellbook Club", "Buy one spellbook as a magic player.", "20 coins + 1 magic level", 1, 20], ["Bone Market", "Collect five bones.", "18 coins + 1 steel", 5, 18], ["The Big Sale", "Make five trades.", "25 coins + 2 leather", 5, 25], ["Inventory Problems", "Collect three demon steel.", "30 coins + 1 spellbook", 3, 30], ["Repeat Customer", "Make ten trades.", "40 coins + merchant favor", 10, 40], ["Final Clearance", "Make fifteen trades and defeat five monsters.", "60 coins + 2 steel", 15, 60]]};

 window.CROWNHOLD_CODEX_ENTRIES=[["Crown Cutpurse", "Unrecorded", "Varies", "Keeps one hand near the stolen seal and retreats toward patrol territory when cornered.", "The repaired crown road gave this thief a richer stream of travelers to prey on. A stolen blue seal hints that the robber is more than a lone opportunist."], ["Bluecrest Militiaman", "Unrecorded", "Varies", "Checks a traveler’s papers twice while letting marked supply carts pass without inspection.", "A village militiaman bearing the restored crown’s colors. His roadblocks protect the cutpurse’s route rather than the people behind the gate."], ["Royal Road Ambush", "Unrecorded", "Varies", "The militiaman holds the lane while the cutpurse approaches from its unguarded edge.", "A coordinated road trap set by the Crown Cutpurse and Bluecrest Militiaman. Their shared blue seal exposes a scheme to control passage into Placenta Creek."], ["Crownshield Sentinel", "Unrecorded", "Varies", "Never leaves the ledger chest; its shield turns first toward anyone reaching for the lock.", "This armored keeper guards the gate ledgers that identify who sanctioned the road ambush. It follows the seal’s authority even when the orders harm villagers."], ["Goosecourt Marshal", "Unrecorded", "Varies", "A sharp honk precedes each charge; stamped papers scatter whenever its formation breaks.", "The goose marshal has seized the frontier’s petitions and supply carts under a grand claim of royal authority. Its decrees keep the road closed for everyone else."], ["Kingswood Ranger", "Unrecorded", "Varies", "Places fresh trail marks just before the hound arrives to drive trespassers onward.", "A royal ranger steers travelers away from protected Kingswood paths. The marked detours lead toward the grove claimed by the Thornstag Sovereign."], ["Briarfang Hound", "Unrecorded", "Varies", "Follows the marked path even after losing sight of its quarry; briars snag on narrow turns.", "A thorn-furred hunting hound trained to follow the ranger’s marks through royal woodland. It treats the crown’s boundary as a scent line."], ["Crownwood Hunting Pack", "Unrecorded", "Varies", "The ranger marks a route before the hound rushes it; changing direction breaks their rhythm.", "The Kingswood Ranger and Briarfang Hound hunt as a pair, driving trespassers toward the guarded heart of the wood."], ["Mosscrown Guardian", "Unrecorded", "Varies", "Moss shifts before its stone limbs move; it stays rooted close to the warded threshold.", "Stone and roots bound to a royal ward have grown into a watchman at the old grove. Its orders outlived the forest it was built to protect."], ["Thornstag Sovereign", "Unrecorded", "Varies", "The crownlike antlers catch on branches before it lowers its head to charge.", "The sovereign stag rules the grove beneath a crown banner, turning living thorns into a border patrol. The woodland cannot settle while its command endures."], ["Royal Mourner", "Unrecorded", "Varies", "Pauses at each royal headstone, then turns toward the oldest crypt when the summons sounds.", "A grave tender who answers the restored crown’s summons instead of tending the dead in peace. Its procession begins at the cemetery gate."], ["Crown Cryptguard", "Unrecorded", "Varies", "Guards the vault door even when drawn away; it returns to the threshold between attacks.", "The armored cryptguard bars entry to a burial vault whose tombs have recently been disturbed. Duty has become a lock on the truth below."], ["Crowncrypt Procession", "Unrecorded", "Varies", "The mourner sets the pace while the guard shields the path to the crypt.", "The Royal Mourner and Crown Cryptguard march together carrying a command from under the cemetery. Their procession leads toward the bishop’s rite."], ["Sepulcher Bishop", "Unrecorded", "Varies", "Its chant begins beside the oldest marker; the grave lights pulse in time with the rite.", "This bishop conducts the burial rite that binds the cemetery’s dead to the throne. Each chant strengthens the claim rising from the oldest tomb."], ["Crown Revenant", "Unrecorded", "Varies", "Reaches toward the crown before each advance; the burial lights dim when its claim weakens.", "The oldest royal claimant has risen from its tomb to judge every crown that followed. Its summons threatens to turn the cemetery into a second court."], ["Hedgebound Spearman", "Unrecorded", "Varies", "Holds the straight passage and leaves side turns to the prowler hidden in the hedges.", "A sworn guard at the hedge court’s entrance tests anyone who approaches the maze. Its oath serves the court’s living walls."], ["Thorncourt Prowler", "Unrecorded", "Varies", "Waits beside a false turn; rustling leaves give away its flanking approach.", "This agile hunter watches the maze turns and punishes anyone who trusts the obvious path. It works with the spearman to stage the court’s trial."], ["Maze Court Conspirators", "Unrecorded", "Varies", "The spearman fixes attention forward as the prowler crosses behind the hedge.", "The Hedgebound Spearman holds the passage while the Thorncourt Prowler strikes from its side. Together they enforce the maze court’s planned trial."], ["Bluebriar Construct", "Unrecorded", "Varies", "Blue light travels through its branches just before the stone core lurches forward.", "Briars, stone, and blue-gold magic form a guardian of the hedge court’s inner chamber. It keeps the maze bound to the old judgment."], ["Thornmaze Warden", "Unrecorded", "Varies", "The hedges answer its gestures; their movement slows when the warden loses its footing.", "The warden commands the maze’s living walls and maintains the court’s hold over its visitors. Its fall ends the garden’s hostile trials."], ["Crownblade Knight", "Unrecorded", "Varies", "Sets its feet on the castle steps before drawing the crown-marked sword.", "A knight at the restored fortress challenges those who would enter the capital. The blade tests the ruler the city claims to serve."], ["Banneret Executioner", "Unrecorded", "Varies", "Plants the banner to mark its ground, then brings the heavy blade down along that line.", "An officer carrying the capital’s banner has turned a ceremonial executioner’s post into a threat at the gate."], ["Royal Vanguard Pair", "Unrecorded", "Varies", "The knight closes the gap while the executioner controls the space behind the banner.", "The Crownblade Knight and Banneret Executioner stand together as the capital’s last coordinated guard. Their defense protects the regent’s claim."], ["Aurell Crown Regent", "Unrecorded", "Varies", "Touches the crown insignia before issuing a command; the guards respond to that signal.", "The regent invokes the old court’s authority to deny the new ruler the throne hall. Its claim holds the fortress between two reigns."], ["Throne Ascendant", "Unrecorded", "Varies", "The throne’s blue-gold light surges before each advance; cracks spread outward as its hold fails.", "Royal will and the throne itself have fused into the final claimant of Crownhold Ascendant. Defeating it decides whether the rebuilt kingdom answers to the living."]];
 window.CROWNHOLD_CODEX_PAIRS={"Royal Road Ambush":["Crown Cutpurse","Bluecrest Militiaman"],"Crownwood Hunting Pack":["Kingswood Ranger","Briarfang Hound"],"Crowncrypt Procession":["Royal Mourner","Crown Cryptguard"],"Maze Court Conspirators":["Hedgebound Spearman","Thorncourt Prowler"],"Royal Vanguard Pair":["Crownblade Knight","Banneret Executioner"]};
 window.crownholdCodexImage=function(name,src){const pair=window.CROWNHOLD_CODEX_PAIRS[name];return pair?'<span class="codex-pair-art">'+pair.map(member=>'<img src="'+window.CROWNHOLD_CODEX_ART[member]+'" alt="'+member+'">').join('')+'</span>':src?'<img src="'+src+'" alt="'+name+'">':'<b style="font-size:60px">???</b>'};
 window.CROWNHOLD_CODEX_ART={"Crown Cutpurse": "Textures/Monsters/NGPlus/Crownhold/crown-cutpurse.png", "Bluecrest Militiaman": "Textures/Monsters/NGPlus/Crownhold/bluecrest-militiaman.png", "Crownshield Sentinel": "Textures/Monsters/NGPlus/Crownhold/crownshield-sentinel.png", "Goosecourt Marshal": "Textures/Monsters/NGPlus/Crownhold/goosecourt-marshal.png", "Kingswood Ranger": "Textures/Monsters/NGPlus/Crownhold/kingswood-ranger.png", "Briarfang Hound": "Textures/Monsters/NGPlus/Crownhold/briarfang-hound.png", "Mosscrown Guardian": "Textures/Monsters/NGPlus/Crownhold/mosscrown-guardian.png", "Thornstag Sovereign": "Textures/Monsters/NGPlus/Crownhold/thornstag-sovereign.png", "Royal Mourner": "Textures/Monsters/NGPlus/Crownhold/royal-mourner.png", "Crown Cryptguard": "Textures/Monsters/NGPlus/Crownhold/crown-cryptguard.png", "Sepulcher Bishop": "Textures/Monsters/NGPlus/Crownhold/sepulcher-bishop.png", "Crown Revenant": "Textures/Monsters/NGPlus/Crownhold/crownhold-revenant.png", "Hedgebound Spearman": "Textures/Monsters/NGPlus/Crownhold/hedgebound-spearman.png", "Thorncourt Prowler": "Textures/Monsters/NGPlus/Crownhold/thorncourt-prowler.png", "Bluebriar Construct": "Textures/Monsters/NGPlus/Crownhold/bluebriar-construct.png", "Thornmaze Warden": "Textures/Monsters/NGPlus/Crownhold/thornmaze-warden.png", "Crownblade Knight": "Textures/Monsters/NGPlus/Crownhold/crownblade-knight.png", "Banneret Executioner": "Textures/Monsters/NGPlus/Crownhold/banneret-executioner.png", "Aurell Crown Regent": "Textures/Monsters/NGPlus/Crownhold/aurell-crown-regent.png", "Throne Ascendant": "Textures/Monsters/NGPlus/Crownhold/throne-ascendant.png"};
 const REVAMPED_MONSTERS=[["Slime Rat","Bow","Leather","Leaves a wet trail that points away from the nearest light; arrows tend to stick in its gelatinous hide.","A damp little nuisance born wherever abandoned cellars outlive their owners. It has survived three extermination attempts and one emotional village meeting."],["Angry Goose","Sword","Leather","Its feathers lift before it charges; the honk arrives half a second before the bite.","A feathered tyrant with the confidence of a warlord and the legal status of a bird. It considers every path its personal runway."],["Drunk Peasant","Magic","Coins","Reaches for the pitchfork only after swaying twice; sidestepping the first lunge creates a long opening.","Once a local man, now mostly a cautionary tale wearing boots. Nobody knows what is in the mug, including him."],["Rabid Raccoon","Bow","Leather","Checks every belt pouch before attacking; loose coins can turn its head.","It learned lockpicking from a trash barrel and now believes it is destined for nobility. The trash disagrees."],["Sir Barnaby","Sword and Light","Coins","Polishes its shield between exchanges; striking while it admires the reflection interrupts its guard.","A knight remembered by history for his armor, his mustache, and losing the same helmet four times in one afternoon."],["Goblin Poacher","Bow","Coins","Watches the tree line instead of the target; open ground makes him panic and waste arrows.","He calls it hunting. The forest calls it paperwork. His trophy collection is mostly things that still want to escape."],["Zombie Wolf","Magic","Bones","Tracks by scent long after losing sight; it favors the wounded and ignores anything already fallen.","It died once, became inconvenient, and decided the correct response was to keep walking. Its bite remains aggressively postmortem."],["Bullying Sprite","Magic","Demon steel","Circles smaller opponents clockwise; it retreats instantly when directly challenged.","Tiny wings, enormous confidence, and no adult supervision. It has never won a fair fight and considers that a technicality."],["Cursed Timberwolf","Fire","Leather","Bark plates flex before a howl; fire makes it abandon its preferred pounce.","The curse is mostly bark, teeth, and unresolved family history. It howls whenever someone mentions therapy."],["Gloomfang","Light","Leather","Waits for dramatic shadows before entering range; sudden bright light ruins its timing.","A wolf so dramatic that even the moon gives it stage lighting. It has never entered a room without making an entrance."],["Skeleton Archer","Blunt magic","Bones","Counts its shots on bony fingers between volleys; the fourth arrow is always loosed too high.","It has no muscles and still manages better posture than everyone in the tavern. Its arrows are filed alphabetically."],["Moldy Mummy","Fire","Bones","Its bandages tighten when it hears footsteps; damp air makes the wrappings drag.","The tomb was sealed for a reason, and the reason smells damp. It has been waiting centuries to complain about the humidity."],["Necromancer Apprentice","Bow","Coins","Reads spell labels aloud before casting; interrupting the recital leaves the incantation unfinished.","He has read three forbidden books and is already unbearable about it. His robes are doing most of the intimidating."],["Grave Wraith","Light","Demon steel","Passes through walls but not iron; it circles metal weapons before committing.","A ghost with unfinished business and a very finished wardrobe. It haunts the living mostly because they have better snacks."],["Lich King Timmy","Light","Demon steel","Raises his crown hand to summon guards; knocking it aside delays the command.","He demands tribute because nobody taught him indoor voices. His crown is ancient; his tantrums are remarkably current."],["Minotaur with Anxiety","Light","Coins","Pauses at every junction to count breaths; footsteps from behind make it choose the longest corridor.","It has a maze, a schedule, and absolutely no coping skills. It apologizes before charging and after missing."],["Daedric Knight","Bow","Coins","Armor plates lock before heavy swings; the exposed knee joint remains unenchanted.","A heavily armored problem wearing the confidence of a final boss. The helmet is intimidating; the paperwork underneath is worse."],["Gargoyle","Magic","Bones","Its stone wings fold when it is truly alert; staring at its face misses the tail sweep.","It guards the fortress and judges every architectural choice. It has been perched there so long that criticism became its hobby."],["Dark Sorcerer","Light","Coins","Keeps the strongest spell in the left sleeve; smoke color changes just before a cast.","He studied forbidden magic because regular magic lacked drama. His cloak has more plot than most villagers."],["Throne Warden","Sword","Coins","Never turns its head while guarding the throne; attacks from the dais side draw a delayed response.","The throne hired security and forgot to include a personality. It has stood guard so long that sitting feels rebellious."],["Monarch Lucien","Light","Coins","Reaches for the throne before defending himself; threaten the crown and the tyrant forgets the room.","A tyrant with a cape, a castle, and several unmet emotional needs. His portrait collection is mostly pictures of himself looking disappointed."]];
 REVAMPED_MONSTERS.push(...window.CROWNHOLD_CODEX_ENTRIES);
 const neg=['Bleeding','Burning','Soaked','Poisoned','Cursed','Wild magic'];
 function chooseDialog(type){state.meta=state.meta||{};state.meta.dialogSeen=state.meta.dialogSeen||{};let seen=state.meta.dialogSeen[type]||[];if(seen.length>=LONG_DIALOGUES[type].length){seen=[]}let pool=LONG_DIALOGUES[type].map((_,i)=>i).filter(i=>!seen.includes(i));let i=pool[Math.floor(Math.random()*pool.length)];seen.push(i);state.meta.dialogSeen[type]=seen;return LONG_DIALOGUES[type][i]} window.chooseInteriorDialogue=chooseDialog;
 function panel(){return $('#interiorContent')}
 function back(){panel().dataset.compact='main';panel().innerHTML='<h2>'+({'cathedral':'Priest','blacksmith':'Blacksmith','merchant':'Merchant','home':'Your House'}[state._building]||'Building')+'</h2><div class="compact-stats">Coins: ◈ '+state.coins+' &nbsp;·&nbsp; HP: ❤ '+state.hp+'/'+state.maxHp+'</div><div class="compact-menu"><button data-compact-action="talk">Talk</button><button data-compact-action="shop">Shop</button><button data-compact-action="quest">Quest</button><button data-compact-action="leave">Leave</button></div>'}
 function showTalk(type){panel().dataset.compact='talk';panel().innerHTML='<h2>'+({cathedral:'Priest',blacksmith:'Blacksmith',merchant:'Merchant',home:'Your House'}[type]||'Building')+'</h2><p class="compact-copy">'+chooseDialog(type)+'</p><button data-long-back>Back</button>'}
 function ensureQ(type){state.meta=state.meta||{};state.meta.buildingQuestState=state.meta.buildingQuestState||{};state.meta.buildingQuestState[type]=state.meta.buildingQuestState[type]||Array(10).fill('available');return state.meta.buildingQuestState[type]}
 function progress(type,i){let p=state.meta.questProgress||{heals:0,trades:0,wins:0};if(type==='cathedral')return [p.heals>=1,p.heals>=2,p.wins>=1,p.wins>=3,p.wins>=5,p.heals>=3,!((state.meta.statuses||[]).some(x=>neg.includes(x))),p.wins>=5,state.maxHub>=1,p.wins>=10][i];if(type==='blacksmith')return [p.wins>=1,(state.materials?.leather||0)>=5,(state.weaponLevel||0)>=1,(state.armorLevel||0)>=1,p.wins>=3,p.wins>=5,(state.materials?.bones||0)>=3,((state.gear==='magic'?state.magicLevel||0:state.weaponLevel||0)>=2),p.wins>=7,p.wins>=10&&(state.armorLevel||0)>=2][i];return [p.trades>=1,p.trades>=2,p.trades>=1,(state.meta.items?.drumstick||0)+(state.meta.items?.midPotion||0)+(state.meta.items?.highPotion||0)+(state.meta.items?.antidote||0)>=2,state.meta.spells?.heal||state.meta.spells?.purify,(state.materials?.bones||0)>=5,p.trades>=5,(state.materials?.steel||0)>=3,p.trades>=10,p.trades>=15&&p.wins>=5][i]}
 function allDone(type){return ensureQ(type).every(x=>x==='complete')}
 function questView(type,index=0){let qlist=LONG_QUESTS[type],st=ensureQ(type);if(allDone(type)){back();return};let i=Math.max(0,Math.min(9,index)),q=qlist[i],status=st[i],ready=progress(type,i);panel().dataset.compact='quest';panel().innerHTML='<h2>Quest '+(i+1)+' / 10</h2><h3>'+q[0]+'</h3><p class="compact-copy">'+q[1]+'<br><b>Reward:</b> '+q[2]+'<br><b>Difficulty:</b> '+q[3]+'/10</p><div class="compact-options">'+(status==='complete'?'<span>COMPLETED</span>':status==='active'?(ready?'<button data-long-complete data-qtype="'+type+'" data-qindex="'+i+'">Complete Quest</button>':'<span>ACTIVE · Objective in progress</span>'):'<button data-long-accept data-qtype="'+type+'" data-qindex="'+i+'">Accept Quest</button>')+'<button data-long-next data-qtype="'+type+'" data-qindex="'+((i+1)%10)+'">Next Quest</button><button data-long-back>Back</button></div>'}
 function codex(){const render=i=>{let m=REVAMPED_MONSTERS[i],found=(state.meta?.codexUnlocked||[]).includes(m[0]),src=found?(window.CROWNHOLD_CODEX_ART?.[m[0]]||(typeof asset==='function'?asset(m[0]):'')):'';$('#codexCard').className='codex-card book-shell revamped-codex';$('#codexCard').innerHTML='<button class="rev-close">×</button><div class="codex-spread"><section class="rev-page rev-left"><h2>'+ (found?m[0]:'Unknown Creature') +'</h2><div class="rev-monster-window">'+(found?window.crownholdCodexImage(m[0],src):'<b style="font-size:60px">???</b>')+'</div><div class="rev-notes">'+(found?m[4]:'Defeat this monster to reveal its lore.')+'</div></section><section class="rev-page rev-right"><div class="rev-field">Weakness<span>'+ (found?m[1]:'???') +'</span></div><div class="rev-field">Material Drop<span>'+ (found?m[2]:'???') +'</span></div><div class="rev-notes">'+(found?('Field observation: '+m[3]):'This page remains suspiciously blank.')+'</div></section></div><div class="rev-nav"><button data-rev-prev>◀ Previous</button><span style="color:#f8eed7;font-weight:900">'+(i+1)+' / '+REVAMPED_MONSTERS.length+'</span><button data-rev-next>Next ▶</button></div>';$('#codexCard .rev-close').onclick=()=>$('#codexOverlay').classList.remove('open');$('#codexCard [data-rev-prev]').onclick=()=>render((i-1+REVAMPED_MONSTERS.length)%REVAMPED_MONSTERS.length);$('#codexCard [data-rev-next]').onclick=()=>render((i+1)%REVAMPED_MONSTERS.length)};$('#codexOverlay').classList.add('open');render(0)}
 document.addEventListener('click',e=>{let b=e.target.closest('[data-compact-action]');if(b&&$('#interior')?.classList.contains('active')){let a=b.dataset.compactAction,t=state._building;if(a==='talk'){e.preventDefault();e.stopImmediatePropagation();showTalk(t)}else if(a==='quest'){e.preventDefault();e.stopImmediatePropagation();questView(t,0)}else if(a==='codex'){e.preventDefault();e.stopImmediatePropagation();codex()}}if(e.target.closest('[data-long-back]')){e.preventDefault();e.stopImmediatePropagation();back()}let ac=e.target.closest('[data-long-accept]');if(ac){e.preventDefault();e.stopImmediatePropagation();ensureQ(ac.dataset.qtype)[+ac.dataset.qindex]='active';questView(ac.dataset.qtype,+ac.dataset.qindex)}let co=e.target.closest('[data-long-complete]');if(co){e.preventDefault();e.stopImmediatePropagation();ensureQ(co.dataset.qtype)[+co.dataset.qindex]='complete';questView(co.dataset.qtype,+co.dataset.qindex)}let nx=e.target.closest('[data-long-next]');if(nx){e.preventDefault();e.stopImmediatePropagation();questView(nx.dataset.qtype,+nx.dataset.qindex)}},true);
 document.addEventListener('click',e=>{if(e.target.closest('[data-facility]'))setTimeout(()=>{let p=panel();if(p&&state._building==='home')p.querySelector('[data-compact-action="quest"]')?.remove()},300)},true);
 window.openHouseCodex=codex;
})();

(()=>{
 const LONG_DIALOGUES={"cathedral": ["The light welcomes you. It has terrible taste in furniture.", "I prayed for a miracle and received a tax notice.", "Please wipe your boots. The floor is holier than most people.", "The candles are watching you. One of them has already filed a complaint.", "Our choir sings beautifully, especially when nobody asks them to stop.", "The cathedral is peaceful today, which means the ghosts are planning something.", "I can bless you, but I cannot bless your spending habits.", "The stained glass depicts a saint defeating a goose. History is complicated.", "Confession is free. The emotional damage is extra.", "The reliquary vanished, and somehow everyone suspects the person holding a sword.", "I keep the holy water next to the regular water. The labels are not helpful.", "The altar has seen more bad decisions than a royal courtroom.", "If you hear whispering from the crypt, whisper back politely.", "We accept coins, apologies, and proof that you did not steal the relic.", "The old bell rings whenever someone lies. It has been ringing for three days.", "I wanted a quiet life. Then adventurers discovered doors.", "A blessing lasts longer if you stop immediately walking into traps.", "The cathedral roof leaks only during important sermons.", "Our patron saint is technically still wanted by the monastery.", "Try not to summon anything in the chapel. We just repaired the summoning circle."], "blacksmith": ["The forge is hot, the steel is stubborn, and your purse looks light.", "Need a sharper edge? I have one. It is probably haunted.", "A good sword is ninety percent metal and ten percent dramatic posing.", "Your armor is making a noise that suggests it has opinions.", "I can fix the blade. I cannot fix the decision that broke it.", "The anvil has a name. We do not say it after sunset.", "Bring leather, coins, and a willingness to ignore safety instructions.", "Every dent tells a story. Yours says you stood still a lot.", "Magic weapons are just regular weapons with better marketing.", "I forged a helmet that protects against curses and unsolicited advice.", "The furnace is hungry. Please do not feed it your quest log again.", "A bowstring is cheaper than therapy and usually more effective.", "Your shield is held together by rivets, spite, and one suspicious prayer.", "I once made a royal crown. It was mostly decorative and emotionally fragile.", "If the hammer starts whispering, hammer it harder.", "Armor should fit snugly enough to protect you and loosely enough to regret.", "I can temper steel. Tempering heroes takes much longer.", "The last adventurer asked for a legendary sword and paid in turnips.", "A clean blade is a sign of discipline. Or that you have not used it yet.", "Do not touch the glowing metal. That advice has saved exactly nobody."], "merchant": ["Fresh wares! Mostly fresh, anyway. The labels are optimistic.", "I sell miracles by the bottle and regrets by the crate.", "Everything is a bargain if you ignore what it cost me.", "The skull is decorative. The tax receipt is not.", "I have potions for healing, courage, and pretending you understood the quest.", "Spellbooks are non-refundable once the letters start rearranging themselves.", "Materials are up this week. The bones market is surprisingly volatile.", "I accept coins, favors, and secrets that are not legally actionable.", "My shop has a return policy. The policy is that returns are unfortunate.", "This rug is cursed, but only in a charming, conversational way.", "You look like someone who needs a discount and will receive a lecture instead.", "The merchant guild says these prices are fair. The merchant guild is me.", "I stock antidotes for poison, curses, and suspicious soup.", "The rare goods are behind the curtain. The curtain is also for sale.", "If a potion glows, it is either magical or extremely spoiled.", "I can identify that relic. For a fee. I can also misidentify it for less.", "The spellbook says do not read aloud. Naturally, everyone reads it aloud.", "My inventory is organized alphabetically by how dangerous it is.", "I once sold a hero a map. The map led to me. Very profitable.", "Come back after your next disaster. Disasters are excellent for repeat business."]};
 const LONG_QUESTS={"cathedral": [["The Missing Reliquary", "Purify one ailment or restore your health, then return.", "Blessed Charm · removes the first negative ailment each battle", 8, 12], ["Candle Tax", "Clear two negative ailments.", "8 coins + 1 potion", 2, 8], ["Choir Practice", "Win one combat encounter without Guard.", "Blessed Thread · +1 max HP", 1, 15], ["Crypt Errand", "Defeat three monsters.", "12 coins + 1 bone", 3, 12], ["Bell of Bad Omens", "Survive a boss encounter.", "20 coins + 1 demon steel", 1, 20], ["Saints and Sinners", "Use three cathedral services.", "Blessing · +2 max HP", 3, 10], ["The Polite Exorcism", "Clear Burning, Soaked, or Cursed.", "Holy Seal · resistance bonus", 1, 14], ["Pilgrim Mileage", "Clear five encounters.", "25 coins + 2 bones", 5, 25], ["A Very Long Sermon", "Reach the next area.", "30 coins + 1 steel", 1, 30], ["The Last Benediction", "Defeat ten monsters.", "Cathedral Favor · permanent blessing", 10, 40]], "blacksmith": [["Test the Edge", "Win one combat encounter.", "Forged Edge · +2 attack damage", 1, 12], ["Leather Weather", "Collect five leather.", "10 coins + 1 armor level", 5, 10], ["Hammer Time", "Upgrade weapon or magic once.", "12 coins + 1 steel", 1, 12], ["Armor of Regret", "Upgrade armor once.", "15 coins + 1 bone", 1, 15], ["Field Testing", "Win three encounters.", "20 coins + 1 leather", 3, 20], ["Boss Material", "Defeat a boss.", "25 coins + 2 steel", 1, 25], ["Temper Temper", "Collect three bones.", "18 coins + armor resistance", 3, 18], ["The Perfect Focus", "Reach Magic Lv 2 or Weapon Lv 2.", "30 coins + 1 steel", 2, 30], ["Anvil Marathon", "Win seven encounters.", "35 coins + 2 leather", 7, 35], ["Masterwork", "Win ten encounters and reach Armor Lv 2.", "Masterwork upgrade · +5 max HP", 10, 50]], "merchant": [["A Rare Trade", "Complete one purchase or sale.", "Merchant Ledger · shop discount", 1, 10], ["Stock Rotation", "Buy two materials.", "8 coins + 1 leather", 2, 8], ["Suspiciously Legal", "Sell one material.", "10 coins + 1 potion", 1, 10], ["Potion Commotion", "Buy two potions or antidotes.", "15 coins + 1 antidote", 2, 15], ["Spellbook Club", "Buy one spellbook as a magic player.", "20 coins + 1 magic level", 1, 20], ["Bone Market", "Collect five bones.", "18 coins + 1 steel", 5, 18], ["The Big Sale", "Make five trades.", "25 coins + 2 leather", 5, 25], ["Inventory Problems", "Collect three demon steel.", "30 coins + 1 spellbook", 3, 30], ["Repeat Customer", "Make ten trades.", "40 coins + merchant favor", 10, 40], ["Final Clearance", "Make fifteen trades and defeat five monsters.", "60 coins + 2 steel", 15, 60]]};
 const REVAMPED_MONSTERS=[["Slime Rat","Bow","Leather","Leaves a wet trail that points away from the nearest light; arrows tend to stick in its gelatinous hide.","A damp little nuisance born wherever abandoned cellars outlive their owners. It has survived three extermination attempts and one emotional village meeting."],["Angry Goose","Sword","Leather","Its feathers lift before it charges; the honk arrives half a second before the bite.","A feathered tyrant with the confidence of a warlord and the legal status of a bird. It considers every path its personal runway."],["Drunk Peasant","Magic","Coins","Reaches for the pitchfork only after swaying twice; sidestepping the first lunge creates a long opening.","Once a local man, now mostly a cautionary tale wearing boots. Nobody knows what is in the mug, including him."],["Rabid Raccoon","Bow","Leather","Checks every belt pouch before attacking; loose coins can turn its head.","It learned lockpicking from a trash barrel and now believes it is destined for nobility. The trash disagrees."],["Sir Barnaby","Sword and Light","Coins","Polishes its shield between exchanges; striking while it admires the reflection interrupts its guard.","A knight remembered by history for his armor, his mustache, and losing the same helmet four times in one afternoon."],["Goblin Poacher","Bow","Coins","Watches the tree line instead of the target; open ground makes him panic and waste arrows.","He calls it hunting. The forest calls it paperwork. His trophy collection is mostly things that still want to escape."],["Zombie Wolf","Magic","Bones","Tracks by scent long after losing sight; it favors the wounded and ignores anything already fallen.","It died once, became inconvenient, and decided the correct response was to keep walking. Its bite remains aggressively postmortem."],["Bullying Sprite","Magic","Demon steel","Circles smaller opponents clockwise; it retreats instantly when directly challenged.","Tiny wings, enormous confidence, and no adult supervision. It has never won a fair fight and considers that a technicality."],["Cursed Timberwolf","Fire","Leather","Bark plates flex before a howl; fire makes it abandon its preferred pounce.","The curse is mostly bark, teeth, and unresolved family history. It howls whenever someone mentions therapy."],["Gloomfang","Light","Leather","Waits for dramatic shadows before entering range; sudden bright light ruins its timing.","A wolf so dramatic that even the moon gives it stage lighting. It has never entered a room without making an entrance."],["Skeleton Archer","Blunt magic","Bones","Counts its shots on bony fingers between volleys; the fourth arrow is always loosed too high.","It has no muscles and still manages better posture than everyone in the tavern. Its arrows are filed alphabetically."],["Moldy Mummy","Fire","Bones","Its bandages tighten when it hears footsteps; damp air makes the wrappings drag.","The tomb was sealed for a reason, and the reason smells damp. It has been waiting centuries to complain about the humidity."],["Necromancer Apprentice","Bow","Coins","Reads spell labels aloud before casting; interrupting the recital leaves the incantation unfinished.","He has read three forbidden books and is already unbearable about it. His robes are doing most of the intimidating."],["Grave Wraith","Light","Demon steel","Passes through walls but not iron; it circles metal weapons before committing.","A ghost with unfinished business and a very finished wardrobe. It haunts the living mostly because they have better snacks."],["Lich King Timmy","Light","Demon steel","Raises his crown hand to summon guards; knocking it aside delays the command.","He demands tribute because nobody taught him indoor voices. His crown is ancient; his tantrums are remarkably current."],["Minotaur with Anxiety","Light","Coins","Pauses at every junction to count breaths; footsteps from behind make it choose the longest corridor.","It has a maze, a schedule, and absolutely no coping skills. It apologizes before charging and after missing."],["Daedric Knight","Bow","Coins","Armor plates lock before heavy swings; the exposed knee joint remains unenchanted.","A heavily armored problem wearing the confidence of a final boss. The helmet is intimidating; the paperwork underneath is worse."],["Gargoyle","Magic","Bones","Its stone wings fold when it is truly alert; staring at its face misses the tail sweep.","It guards the fortress and judges every architectural choice. It has been perched there so long that criticism became its hobby."],["Dark Sorcerer","Light","Coins","Keeps the strongest spell in the left sleeve; smoke color changes just before a cast.","He studied forbidden magic because regular magic lacked drama. His cloak has more plot than most villagers."],["Throne Warden","Sword","Coins","Never turns its head while guarding the throne; attacks from the dais side draw a delayed response.","The throne hired security and forgot to include a personality. It has stood guard so long that sitting feels rebellious."],["Monarch Lucien","Light","Coins","Reaches for the throne before defending himself; threaten the crown and the tyrant forgets the room.","A tyrant with a cape, a castle, and several unmet emotional needs. His portrait collection is mostly pictures of himself looking disappointed."]];
 REVAMPED_MONSTERS.push(...window.CROWNHOLD_CODEX_ENTRIES);
 const neg=['Bleeding','Burning','Soaked','Poisoned','Cursed','Wild magic'];
 function chooseDialog(type){state.meta=state.meta||{};state.meta.dialogSeen=state.meta.dialogSeen||{};let seen=state.meta.dialogSeen[type]||[];if(seen.length>=LONG_DIALOGUES[type].length){seen=[]}let pool=LONG_DIALOGUES[type].map((_,i)=>i).filter(i=>!seen.includes(i));let i=pool[Math.floor(Math.random()*pool.length)];seen.push(i);state.meta.dialogSeen[type]=seen;return LONG_DIALOGUES[type][i]} window.chooseInteriorDialogue=chooseDialog;
 function panel(){return $('#interiorContent')}
 function back(){panel().dataset.compact='main';panel().innerHTML='<h2>'+({'cathedral':'Priest','blacksmith':'Blacksmith','merchant':'Merchant','home':'Your House'}[state._building]||'Building')+'</h2><div class="compact-stats">Coins: ◈ '+state.coins+' &nbsp;·&nbsp; HP: ❤ '+state.hp+'/'+state.maxHp+'</div><div class="compact-menu"><button data-compact-action="talk">Talk</button><button data-compact-action="shop">Shop</button><button data-compact-action="quest">Quest</button><button data-compact-action="leave">Leave</button></div>'}
 function showTalk(type){panel().dataset.compact='talk';panel().innerHTML='<h2>'+({cathedral:'Priest',blacksmith:'Blacksmith',merchant:'Merchant',home:'Your House'}[type]||'Building')+'</h2><p class="compact-copy">'+chooseDialog(type)+'</p><button data-long-back>Back</button>'}
 function ensureQ(type){state.meta=state.meta||{};state.meta.buildingQuestState=state.meta.buildingQuestState||{};state.meta.buildingQuestState[type]=state.meta.buildingQuestState[type]||Array(10).fill('available');return state.meta.buildingQuestState[type]}
 function progress(type,i){let p=state.meta.questProgress||{heals:0,trades:0,wins:0};if(type==='cathedral')return [p.heals>=1,p.heals>=2,p.wins>=1,p.wins>=3,p.wins>=5,p.heals>=3,!((state.meta.statuses||[]).some(x=>neg.includes(x))),p.wins>=5,state.maxHub>=1,p.wins>=10][i];if(type==='blacksmith')return [p.wins>=1,(state.materials?.leather||0)>=5,(state.weaponLevel||0)>=1,(state.armorLevel||0)>=1,p.wins>=3,p.wins>=5,(state.materials?.bones||0)>=3,((state.gear==='magic'?state.magicLevel||0:state.weaponLevel||0)>=2),p.wins>=7,p.wins>=10&&(state.armorLevel||0)>=2][i];return [p.trades>=1,p.trades>=2,p.trades>=1,(state.meta.items?.drumstick||0)+(state.meta.items?.midPotion||0)+(state.meta.items?.highPotion||0)+(state.meta.items?.antidote||0)>=2,state.meta.spells?.heal||state.meta.spells?.purify,(state.materials?.bones||0)>=5,p.trades>=5,(state.materials?.steel||0)>=3,p.trades>=10,p.trades>=15&&p.wins>=5][i]}
 function allDone(type){return ensureQ(type).every(x=>x==='complete')}
 function questView(type,index=0){let qlist=LONG_QUESTS[type],st=ensureQ(type);if(allDone(type)){back();return};let i=Math.max(0,Math.min(9,index)),q=qlist[i],status=st[i],ready=progress(type,i);panel().dataset.compact='quest';panel().innerHTML='<h2>Quest '+(i+1)+' / 10</h2><h3>'+q[0]+'</h3><p class="compact-copy">'+q[1]+'<br><b>Reward:</b> '+q[2]+'<br><b>Difficulty:</b> '+q[3]+'/10</p><div class="compact-options">'+(status==='complete'?'<span>COMPLETED</span>':status==='active'?(ready?'<button data-long-complete data-qtype="'+type+'" data-qindex="'+i+'">Complete Quest</button>':'<span>ACTIVE · Objective in progress</span>'):'<button data-long-accept data-qtype="'+type+'" data-qindex="'+i+'">Accept Quest</button>')+'<button data-long-next data-qtype="'+type+'" data-qindex="'+((i+1)%10)+'">Next Quest</button><button data-long-back>Back</button></div>'}
 function codex(){const render=i=>{let m=REVAMPED_MONSTERS[i],found=(state.meta?.codexUnlocked||[]).includes(m[0]),src=found?(window.CROWNHOLD_CODEX_ART?.[m[0]]||(typeof asset==='function'?asset(m[0]):'')):'';$('#codexCard').className='codex-card book-shell revamped-codex';$('#codexCard').innerHTML='<button class="rev-close">×</button><div class="codex-spread"><section class="rev-page rev-left"><h2>'+ (found?m[0]:'Unknown Creature') +'</h2><div class="rev-monster-window">'+(found?window.crownholdCodexImage(m[0],src):'<b style="font-size:60px">???</b>')+'</div><div class="rev-notes">'+(found?m[4]:'Defeat this monster to reveal its lore.')+'</div></section><section class="rev-page rev-right"><div class="rev-field">Weakness<span>'+ (found?m[1]:'???') +'</span></div><div class="rev-field">Material Drop<span>'+ (found?m[2]:'???') +'</span></div><div class="rev-notes">'+(found?('Field observation: '+m[3]):'This page remains suspiciously blank.')+'</div></section></div><div class="rev-nav"><button data-rev-prev>◀ Previous</button><span style="color:#f8eed7;font-weight:900">'+(i+1)+' / '+REVAMPED_MONSTERS.length+'</span><button data-rev-next>Next ▶</button></div>';$('#codexCard .rev-close').onclick=()=>$('#codexOverlay').classList.remove('open');$('#codexCard [data-rev-prev]').onclick=()=>render((i-1+REVAMPED_MONSTERS.length)%REVAMPED_MONSTERS.length);$('#codexCard [data-rev-next]').onclick=()=>render((i+1)%REVAMPED_MONSTERS.length)};$('#codexOverlay').classList.add('open');render(0)}
 document.addEventListener('click',e=>{let b=e.target.closest('[data-compact-action]');if(b&&$('#interior')?.classList.contains('active')){let a=b.dataset.compactAction,t=state._building;if(a==='talk'){e.preventDefault();e.stopImmediatePropagation();showTalk(t)}else if(a==='quest'){e.preventDefault();e.stopImmediatePropagation();questView(t,0)}else if(a==='codex'){e.preventDefault();e.stopImmediatePropagation();codex()}}if(e.target.closest('[data-long-back]')){e.preventDefault();e.stopImmediatePropagation();back()}let ac=e.target.closest('[data-long-accept]');if(ac){e.preventDefault();e.stopImmediatePropagation();ensureQ(ac.dataset.qtype)[+ac.dataset.qindex]='active';questView(ac.dataset.qtype,+ac.dataset.qindex)}let co=e.target.closest('[data-long-complete]');if(co){e.preventDefault();e.stopImmediatePropagation();ensureQ(co.dataset.qtype)[+co.dataset.qindex]='complete';questView(co.dataset.qtype,+co.dataset.qindex)}let nx=e.target.closest('[data-long-next]');if(nx){e.preventDefault();e.stopImmediatePropagation();questView(nx.dataset.qtype,+nx.dataset.qindex)}},true);
 document.addEventListener('click',e=>{if(e.target.closest('[data-facility]'))setTimeout(()=>{let p=panel();if(p&&state._building==='home')p.querySelector('[data-compact-action="quest"]')?.remove()},300)},true);
 window.openHouseCodex=codex;
})();

(()=>{
 const LONG_DIALOGUES={"cathedral": ["The light welcomes you. It has terrible taste in furniture.", "I prayed for a miracle and received a tax notice.", "Please wipe your boots. The floor is holier than most people.", "The candles are watching you. One of them has already filed a complaint.", "Our choir sings beautifully, especially when nobody asks them to stop.", "The cathedral is peaceful today, which means the ghosts are planning something.", "I can bless you, but I cannot bless your spending habits.", "The stained glass depicts a saint defeating a goose. History is complicated.", "Confession is free. The emotional damage is extra.", "The reliquary vanished, and somehow everyone suspects the person holding a sword.", "I keep the holy water next to the regular water. The labels are not helpful.", "The altar has seen more bad decisions than a royal courtroom.", "If you hear whispering from the crypt, whisper back politely.", "We accept coins, apologies, and proof that you did not steal the relic.", "The old bell rings whenever someone lies. It has been ringing for three days.", "I wanted a quiet life. Then adventurers discovered doors.", "A blessing lasts longer if you stop immediately walking into traps.", "The cathedral roof leaks only during important sermons.", "Our patron saint is technically still wanted by the monastery.", "Try not to summon anything in the chapel. We just repaired the summoning circle."], "blacksmith": ["The forge is hot, the steel is stubborn, and your purse looks light.", "Need a sharper edge? I have one. It is probably haunted.", "A good sword is ninety percent metal and ten percent dramatic posing.", "Your armor is making a noise that suggests it has opinions.", "I can fix the blade. I cannot fix the decision that broke it.", "The anvil has a name. We do not say it after sunset.", "Bring leather, coins, and a willingness to ignore safety instructions.", "Every dent tells a story. Yours says you stood still a lot.", "Magic weapons are just regular weapons with better marketing.", "I forged a helmet that protects against curses and unsolicited advice.", "The furnace is hungry. Please do not feed it your quest log again.", "A bowstring is cheaper than therapy and usually more effective.", "Your shield is held together by rivets, spite, and one suspicious prayer.", "I once made a royal crown. It was mostly decorative and emotionally fragile.", "If the hammer starts whispering, hammer it harder.", "Armor should fit snugly enough to protect you and loosely enough to regret.", "I can temper steel. Tempering heroes takes much longer.", "The last adventurer asked for a legendary sword and paid in turnips.", "A clean blade is a sign of discipline. Or that you have not used it yet.", "Do not touch the glowing metal. That advice has saved exactly nobody."], "merchant": ["Fresh wares! Mostly fresh, anyway. The labels are optimistic.", "I sell miracles by the bottle and regrets by the crate.", "Everything is a bargain if you ignore what it cost me.", "The skull is decorative. The tax receipt is not.", "I have potions for healing, courage, and pretending you understood the quest.", "Spellbooks are non-refundable once the letters start rearranging themselves.", "Materials are up this week. The bones market is surprisingly volatile.", "I accept coins, favors, and secrets that are not legally actionable.", "My shop has a return policy. The policy is that returns are unfortunate.", "This rug is cursed, but only in a charming, conversational way.", "You look like someone who needs a discount and will receive a lecture instead.", "The merchant guild says these prices are fair. The merchant guild is me.", "I stock antidotes for poison, curses, and suspicious soup.", "The rare goods are behind the curtain. The curtain is also for sale.", "If a potion glows, it is either magical or extremely spoiled.", "I can identify that relic. For a fee. I can also misidentify it for less.", "The spellbook says do not read aloud. Naturally, everyone reads it aloud.", "My inventory is organized alphabetically by how dangerous it is.", "I once sold a hero a map. The map led to me. Very profitable.", "Come back after your next disaster. Disasters are excellent for repeat business."]};
 const LONG_QUESTS={"cathedral": [["The Missing Reliquary", "Purify one ailment or restore your health, then return.", "Blessed Charm · removes the first negative ailment each battle", 8, 12], ["Candle Tax", "Clear two negative ailments.", "8 coins + 1 potion", 2, 8], ["Choir Practice", "Win one combat encounter without Guard.", "Blessed Thread · +1 max HP", 1, 15], ["Crypt Errand", "Defeat three monsters.", "12 coins + 1 bone", 3, 12], ["Bell of Bad Omens", "Survive a boss encounter.", "20 coins + 1 demon steel", 1, 20], ["Saints and Sinners", "Use three cathedral services.", "Blessing · +2 max HP", 3, 10], ["The Polite Exorcism", "Clear Burning, Soaked, or Cursed.", "Holy Seal · resistance bonus", 1, 14], ["Pilgrim Mileage", "Clear five encounters.", "25 coins + 2 bones", 5, 25], ["A Very Long Sermon", "Reach the next area.", "30 coins + 1 steel", 1, 30], ["The Last Benediction", "Defeat ten monsters.", "Cathedral Favor · permanent blessing", 10, 40]], "blacksmith": [["Test the Edge", "Win one combat encounter.", "Forged Edge · +2 attack damage", 1, 12], ["Leather Weather", "Collect five leather.", "10 coins + 1 armor level", 5, 10], ["Hammer Time", "Upgrade weapon or magic once.", "12 coins + 1 steel", 1, 12], ["Armor of Regret", "Upgrade armor once.", "15 coins + 1 bone", 1, 15], ["Field Testing", "Win three encounters.", "20 coins + 1 leather", 3, 20], ["Boss Material", "Defeat a boss.", "25 coins + 2 steel", 1, 25], ["Temper Temper", "Collect three bones.", "18 coins + armor resistance", 3, 18], ["The Perfect Focus", "Reach Magic Lv 2 or Weapon Lv 2.", "30 coins + 1 steel", 2, 30], ["Anvil Marathon", "Win seven encounters.", "35 coins + 2 leather", 7, 35], ["Masterwork", "Win ten encounters and reach Armor Lv 2.", "Masterwork upgrade · +5 max HP", 10, 50]], "merchant": [["A Rare Trade", "Complete one purchase or sale.", "Merchant Ledger · shop discount", 1, 10], ["Stock Rotation", "Buy two materials.", "8 coins + 1 leather", 2, 8], ["Suspiciously Legal", "Sell one material.", "10 coins + 1 potion", 1, 10], ["Potion Commotion", "Buy two potions or antidotes.", "15 coins + 1 antidote", 2, 15], ["Spellbook Club", "Buy one spellbook as a magic player.", "20 coins + 1 magic level", 1, 20], ["Bone Market", "Collect five bones.", "18 coins + 1 steel", 5, 18], ["The Big Sale", "Make five trades.", "25 coins + 2 leather", 5, 25], ["Inventory Problems", "Collect three demon steel.", "30 coins + 1 spellbook", 3, 30], ["Repeat Customer", "Make ten trades.", "40 coins + merchant favor", 10, 40], ["Final Clearance", "Make fifteen trades and defeat five monsters.", "60 coins + 2 steel", 15, 60]]};
 const REVAMPED_MONSTERS=[["Slime Rat","Bow","Leather","Leaves a wet trail that points away from the nearest light; arrows tend to stick in its gelatinous hide.","A damp little nuisance born wherever abandoned cellars outlive their owners. It has survived three extermination attempts and one emotional village meeting."],["Angry Goose","Sword","Leather","Its feathers lift before it charges; the honk arrives half a second before the bite.","A feathered tyrant with the confidence of a warlord and the legal status of a bird. It considers every path its personal runway."],["Drunk Peasant","Magic","Coins","Reaches for the pitchfork only after swaying twice; sidestepping the first lunge creates a long opening.","Once a local man, now mostly a cautionary tale wearing boots. Nobody knows what is in the mug, including him."],["Rabid Raccoon","Bow","Leather","Checks every belt pouch before attacking; loose coins can turn its head.","It learned lockpicking from a trash barrel and now believes it is destined for nobility. The trash disagrees."],["Sir Barnaby","Sword and Light","Coins","Polishes its shield between exchanges; striking while it admires the reflection interrupts its guard.","A knight remembered by history for his armor, his mustache, and losing the same helmet four times in one afternoon."],["Goblin Poacher","Bow","Coins","Watches the tree line instead of the target; open ground makes him panic and waste arrows.","He calls it hunting. The forest calls it paperwork. His trophy collection is mostly things that still want to escape."],["Zombie Wolf","Magic","Bones","Tracks by scent long after losing sight; it favors the wounded and ignores anything already fallen.","It died once, became inconvenient, and decided the correct response was to keep walking. Its bite remains aggressively postmortem."],["Bullying Sprite","Magic","Demon steel","Circles smaller opponents clockwise; it retreats instantly when directly challenged.","Tiny wings, enormous confidence, and no adult supervision. It has never won a fair fight and considers that a technicality."],["Cursed Timberwolf","Fire","Leather","Bark plates flex before a howl; fire makes it abandon its preferred pounce.","The curse is mostly bark, teeth, and unresolved family history. It howls whenever someone mentions therapy."],["Gloomfang","Light","Leather","Waits for dramatic shadows before entering range; sudden bright light ruins its timing.","A wolf so dramatic that even the moon gives it stage lighting. It has never entered a room without making an entrance."],["Skeleton Archer","Blunt magic","Bones","Counts its shots on bony fingers between volleys; the fourth arrow is always loosed too high.","It has no muscles and still manages better posture than everyone in the tavern. Its arrows are filed alphabetically."],["Moldy Mummy","Fire","Bones","Its bandages tighten when it hears footsteps; damp air makes the wrappings drag.","The tomb was sealed for a reason, and the reason smells damp. It has been waiting centuries to complain about the humidity."],["Necromancer Apprentice","Bow","Coins","Reads spell labels aloud before casting; interrupting the recital leaves the incantation unfinished.","He has read three forbidden books and is already unbearable about it. His robes are doing most of the intimidating."],["Grave Wraith","Light","Demon steel","Passes through walls but not iron; it circles metal weapons before committing.","A ghost with unfinished business and a very finished wardrobe. It haunts the living mostly because they have better snacks."],["Lich King Timmy","Light","Demon steel","Raises his crown hand to summon guards; knocking it aside delays the command.","He demands tribute because nobody taught him indoor voices. His crown is ancient; his tantrums are remarkably current."],["Minotaur with Anxiety","Light","Coins","Pauses at every junction to count breaths; footsteps from behind make it choose the longest corridor.","It has a maze, a schedule, and absolutely no coping skills. It apologizes before charging and after missing."],["Daedric Knight","Bow","Coins","Armor plates lock before heavy swings; the exposed knee joint remains unenchanted.","A heavily armored problem wearing the confidence of a final boss. The helmet is intimidating; the paperwork underneath is worse."],["Gargoyle","Magic","Bones","Its stone wings fold when it is truly alert; staring at its face misses the tail sweep.","It guards the fortress and judges every architectural choice. It has been perched there so long that criticism became its hobby."],["Dark Sorcerer","Light","Coins","Keeps the strongest spell in the left sleeve; smoke color changes just before a cast.","He studied forbidden magic because regular magic lacked drama. His cloak has more plot than most villagers."],["Throne Warden","Sword","Coins","Never turns its head while guarding the throne; attacks from the dais side draw a delayed response.","The throne hired security and forgot to include a personality. It has stood guard so long that sitting feels rebellious."],["Monarch Lucien","Light","Coins","Reaches for the throne before defending himself; threaten the crown and the tyrant forgets the room.","A tyrant with a cape, a castle, and several unmet emotional needs. His portrait collection is mostly pictures of himself looking disappointed."]];
 REVAMPED_MONSTERS.push(...window.CROWNHOLD_CODEX_ENTRIES);
 const neg=['Bleeding','Burning','Soaked','Poisoned','Cursed','Wild magic'];
 function chooseDialog(type){state.meta=state.meta||{};state.meta.dialogSeen=state.meta.dialogSeen||{};let seen=state.meta.dialogSeen[type]||[];if(seen.length>=LONG_DIALOGUES[type].length){seen=[]}let pool=LONG_DIALOGUES[type].map((_,i)=>i).filter(i=>!seen.includes(i));let i=pool[Math.floor(Math.random()*pool.length)];seen.push(i);state.meta.dialogSeen[type]=seen;return LONG_DIALOGUES[type][i]} window.chooseInteriorDialogue=chooseDialog;
 function panel(){return $('#interiorContent')}
 function back(){panel().dataset.compact='main';panel().innerHTML='<h2>'+({'cathedral':'Priest','blacksmith':'Blacksmith','merchant':'Merchant','home':'Your House'}[state._building]||'Building')+'</h2><div class="compact-stats">Coins: ◈ '+state.coins+' &nbsp;·&nbsp; HP: ❤ '+state.hp+'/'+state.maxHp+'</div><div class="compact-menu"><button data-compact-action="talk">Talk</button><button data-compact-action="shop">Shop</button><button data-compact-action="quest">Quest</button><button data-compact-action="leave">Leave</button></div>'}
 function showTalk(type){panel().dataset.compact='talk';panel().innerHTML='<h2>'+({cathedral:'Priest',blacksmith:'Blacksmith',merchant:'Merchant',home:'Your House'}[type]||'Building')+'</h2><p class="compact-copy">'+chooseDialog(type)+'</p><button data-long-back>Back</button>'}
 function ensureQ(type){state.meta=state.meta||{};state.meta.buildingQuestState=state.meta.buildingQuestState||{};state.meta.buildingQuestState[type]=state.meta.buildingQuestState[type]||Array(10).fill('available');return state.meta.buildingQuestState[type]}
 function progress(type,i){let p=state.meta.questProgress||{heals:0,trades:0,wins:0};if(type==='cathedral')return [p.heals>=1,p.heals>=2,p.wins>=1,p.wins>=3,p.wins>=5,p.heals>=3,!((state.meta.statuses||[]).some(x=>neg.includes(x))),p.wins>=5,state.maxHub>=1,p.wins>=10][i];if(type==='blacksmith')return [p.wins>=1,(state.materials?.leather||0)>=5,(state.weaponLevel||0)>=1,(state.armorLevel||0)>=1,p.wins>=3,p.wins>=5,(state.materials?.bones||0)>=3,((state.gear==='magic'?state.magicLevel||0:state.weaponLevel||0)>=2),p.wins>=7,p.wins>=10&&(state.armorLevel||0)>=2][i];return [p.trades>=1,p.trades>=2,p.trades>=1,(state.meta.items?.drumstick||0)+(state.meta.items?.midPotion||0)+(state.meta.items?.highPotion||0)+(state.meta.items?.antidote||0)>=2,state.meta.spells?.heal||state.meta.spells?.purify,(state.materials?.bones||0)>=5,p.trades>=5,(state.materials?.steel||0)>=3,p.trades>=10,p.trades>=15&&p.wins>=5][i]}
 function allDone(type){return ensureQ(type).every(x=>x==='complete')}
 function questView(type,index=0){let qlist=LONG_QUESTS[type],st=ensureQ(type);if(allDone(type)){back();return};let i=Math.max(0,Math.min(9,index)),q=qlist[i],status=st[i],ready=progress(type,i);panel().dataset.compact='quest';panel().innerHTML='<h2>Quest '+(i+1)+' / 10</h2><h3>'+q[0]+'</h3><p class="compact-copy">'+q[1]+'<br><b>Reward:</b> '+q[2]+'<br><b>Difficulty:</b> '+q[3]+'/10</p><div class="compact-options">'+(status==='complete'?'<span>COMPLETED</span>':status==='active'?(ready?'<button data-long-complete data-qtype="'+type+'" data-qindex="'+i+'">Complete Quest</button>':'<span>ACTIVE · Objective in progress</span>'):'<button data-long-accept data-qtype="'+type+'" data-qindex="'+i+'">Accept Quest</button>')+'<button data-long-next data-qtype="'+type+'" data-qindex="'+((i+1)%10)+'">Next Quest</button><button data-long-back>Back</button></div>'}
 function codex(){const render=i=>{let m=REVAMPED_MONSTERS[i],found=(state.meta?.codexUnlocked||[]).includes(m[0]),src=found?(window.CROWNHOLD_CODEX_ART?.[m[0]]||(typeof asset==='function'?asset(m[0]):'')):'';$('#codexCard').className='codex-card book-shell revamped-codex';$('#codexCard').innerHTML='<button class="rev-close">×</button><div class="codex-spread"><section class="rev-page rev-left"><h2>'+ (found?m[0]:'Unknown Creature') +'</h2><div class="rev-monster-window">'+(found?window.crownholdCodexImage(m[0],src):'<b style="font-size:60px">???</b>')+'</div><div class="rev-notes">'+(found?m[4]:'Defeat this monster to reveal its lore.')+'</div></section><section class="rev-page rev-right"><div class="rev-field">Weakness<span>'+ (found?m[1]:'???') +'</span></div><div class="rev-field">Material Drop<span>'+ (found?m[2]:'???') +'</span></div><div class="rev-notes">'+(found?('Field observation: '+m[3]):'This page remains suspiciously blank.')+'</div></section></div><div class="rev-nav"><button data-rev-prev>◀ Previous</button><span style="color:#f8eed7;font-weight:900">'+(i+1)+' / '+REVAMPED_MONSTERS.length+'</span><button data-rev-next>Next ▶</button></div>';$('#codexCard .rev-close').onclick=()=>$('#codexOverlay').classList.remove('open');$('#codexCard [data-rev-prev]').onclick=()=>render((i-1+REVAMPED_MONSTERS.length)%REVAMPED_MONSTERS.length);$('#codexCard [data-rev-next]').onclick=()=>render((i+1)%REVAMPED_MONSTERS.length)};$('#codexOverlay').classList.add('open');render(0)}
 document.addEventListener('click',e=>{let b=e.target.closest('[data-compact-action]');if(b&&$('#interior')?.classList.contains('active')){let a=b.dataset.compactAction,t=state._building;if(a==='talk'){e.preventDefault();e.stopImmediatePropagation();showTalk(t)}else if(a==='quest'){e.preventDefault();e.stopImmediatePropagation();questView(t,0)}else if(a==='codex'){e.preventDefault();e.stopImmediatePropagation();codex()}}if(e.target.closest('[data-long-back]')){e.preventDefault();e.stopImmediatePropagation();back()}let ac=e.target.closest('[data-long-accept]');if(ac){e.preventDefault();e.stopImmediatePropagation();ensureQ(ac.dataset.qtype)[+ac.dataset.qindex]='active';questView(ac.dataset.qtype,+ac.dataset.qindex)}let co=e.target.closest('[data-long-complete]');if(co){e.preventDefault();e.stopImmediatePropagation();ensureQ(co.dataset.qtype)[+co.dataset.qindex]='complete';questView(co.dataset.qtype,+co.dataset.qindex)}let nx=e.target.closest('[data-long-next]');if(nx){e.preventDefault();e.stopImmediatePropagation();questView(nx.dataset.qtype,+nx.dataset.qindex)}},true);
 document.addEventListener('click',e=>{if(e.target.closest('[data-facility]'))setTimeout(()=>{let p=panel();if(p&&state._building==='home')p.querySelector('[data-compact-action="quest"]')?.remove()},300)},true);
 window.openHouseCodex=codex;
})();

(()=>{
 const LONG_DIALOGUES={"cathedral": ["The light welcomes you. It has terrible taste in furniture.", "I prayed for a miracle and received a tax notice.", "Please wipe your boots. The floor is holier than most people.", "The candles are watching you. One of them has already filed a complaint.", "Our choir sings beautifully, especially when nobody asks them to stop.", "The cathedral is peaceful today, which means the ghosts are planning something.", "I can bless you, but I cannot bless your spending habits.", "The stained glass depicts a saint defeating a goose. History is complicated.", "Confession is free. The emotional damage is extra.", "The reliquary vanished, and somehow everyone suspects the person holding a sword.", "I keep the holy water next to the regular water. The labels are not helpful.", "The altar has seen more bad decisions than a royal courtroom.", "If you hear whispering from the crypt, whisper back politely.", "We accept coins, apologies, and proof that you did not steal the relic.", "The old bell rings whenever someone lies. It has been ringing for three days.", "I wanted a quiet life. Then adventurers discovered doors.", "A blessing lasts longer if you stop immediately walking into traps.", "The cathedral roof leaks only during important sermons.", "Our patron saint is technically still wanted by the monastery.", "Try not to summon anything in the chapel. We just repaired the summoning circle."], "blacksmith": ["The forge is hot, the steel is stubborn, and your purse looks light.", "Need a sharper edge? I have one. It is probably haunted.", "A good sword is ninety percent metal and ten percent dramatic posing.", "Your armor is making a noise that suggests it has opinions.", "I can fix the blade. I cannot fix the decision that broke it.", "The anvil has a name. We do not say it after sunset.", "Bring leather, coins, and a willingness to ignore safety instructions.", "Every dent tells a story. Yours says you stood still a lot.", "Magic weapons are just regular weapons with better marketing.", "I forged a helmet that protects against curses and unsolicited advice.", "The furnace is hungry. Please do not feed it your quest log again.", "A bowstring is cheaper than therapy and usually more effective.", "Your shield is held together by rivets, spite, and one suspicious prayer.", "I once made a royal crown. It was mostly decorative and emotionally fragile.", "If the hammer starts whispering, hammer it harder.", "Armor should fit snugly enough to protect you and loosely enough to regret.", "I can temper steel. Tempering heroes takes much longer.", "The last adventurer asked for a legendary sword and paid in turnips.", "A clean blade is a sign of discipline. Or that you have not used it yet.", "Do not touch the glowing metal. That advice has saved exactly nobody."], "merchant": ["Fresh wares! Mostly fresh, anyway. The labels are optimistic.", "I sell miracles by the bottle and regrets by the crate.", "Everything is a bargain if you ignore what it cost me.", "The skull is decorative. The tax receipt is not.", "I have potions for healing, courage, and pretending you understood the quest.", "Spellbooks are non-refundable once the letters start rearranging themselves.", "Materials are up this week. The bones market is surprisingly volatile.", "I accept coins, favors, and secrets that are not legally actionable.", "My shop has a return policy. The policy is that returns are unfortunate.", "This rug is cursed, but only in a charming, conversational way.", "You look like someone who needs a discount and will receive a lecture instead.", "The merchant guild says these prices are fair. The merchant guild is me.", "I stock antidotes for poison, curses, and suspicious soup.", "The rare goods are behind the curtain. The curtain is also for sale.", "If a potion glows, it is either magical or extremely spoiled.", "I can identify that relic. For a fee. I can also misidentify it for less.", "The spellbook says do not read aloud. Naturally, everyone reads it aloud.", "My inventory is organized alphabetically by how dangerous it is.", "I once sold a hero a map. The map led to me. Very profitable.", "Come back after your next disaster. Disasters are excellent for repeat business."]};
 const LONG_QUESTS={"cathedral": [["The Missing Reliquary", "Purify one ailment or restore your health, then return.", "Blessed Charm · removes the first negative ailment each battle", 8, 12], ["Candle Tax", "Clear two negative ailments.", "8 coins + 1 potion", 2, 8], ["Choir Practice", "Win one combat encounter without Guard.", "Blessed Thread · +1 max HP", 1, 15], ["Crypt Errand", "Defeat three monsters.", "12 coins + 1 bone", 3, 12], ["Bell of Bad Omens", "Survive a boss encounter.", "20 coins + 1 demon steel", 1, 20], ["Saints and Sinners", "Use three cathedral services.", "Blessing · +2 max HP", 3, 10], ["The Polite Exorcism", "Clear Burning, Soaked, or Cursed.", "Holy Seal · resistance bonus", 1, 14], ["Pilgrim Mileage", "Clear five encounters.", "25 coins + 2 bones", 5, 25], ["A Very Long Sermon", "Reach the next area.", "30 coins + 1 steel", 1, 30], ["The Last Benediction", "Defeat ten monsters.", "Cathedral Favor · permanent blessing", 10, 40]], "blacksmith": [["Test the Edge", "Win one combat encounter.", "Forged Edge · +2 attack damage", 1, 12], ["Leather Weather", "Collect five leather.", "10 coins + 1 armor level", 5, 10], ["Hammer Time", "Upgrade weapon or magic once.", "12 coins + 1 steel", 1, 12], ["Armor of Regret", "Upgrade armor once.", "15 coins + 1 bone", 1, 15], ["Field Testing", "Win three encounters.", "20 coins + 1 leather", 3, 20], ["Boss Material", "Defeat a boss.", "25 coins + 2 steel", 1, 25], ["Temper Temper", "Collect three bones.", "18 coins + armor resistance", 3, 18], ["The Perfect Focus", "Reach Magic Lv 2 or Weapon Lv 2.", "30 coins + 1 steel", 2, 30], ["Anvil Marathon", "Win seven encounters.", "35 coins + 2 leather", 7, 35], ["Masterwork", "Win ten encounters and reach Armor Lv 2.", "Masterwork upgrade · +5 max HP", 10, 50]], "merchant": [["A Rare Trade", "Complete one purchase or sale.", "Merchant Ledger · shop discount", 1, 10], ["Stock Rotation", "Buy two materials.", "8 coins + 1 leather", 2, 8], ["Suspiciously Legal", "Sell one material.", "10 coins + 1 potion", 1, 10], ["Potion Commotion", "Buy two potions or antidotes.", "15 coins + 1 antidote", 2, 15], ["Spellbook Club", "Buy one spellbook as a magic player.", "20 coins + 1 magic level", 1, 20], ["Bone Market", "Collect five bones.", "18 coins + 1 steel", 5, 18], ["The Big Sale", "Make five trades.", "25 coins + 2 leather", 5, 25], ["Inventory Problems", "Collect three demon steel.", "30 coins + 1 spellbook", 3, 30], ["Repeat Customer", "Make ten trades.", "40 coins + merchant favor", 10, 40], ["Final Clearance", "Make fifteen trades and defeat five monsters.", "60 coins + 2 steel", 15, 60]]};
 const REVAMPED_MONSTERS=[["Slime Rat","Bow","Leather","Leaves a wet trail that points away from the nearest light; arrows tend to stick in its gelatinous hide.","A damp little nuisance born wherever abandoned cellars outlive their owners. It has survived three extermination attempts and one emotional village meeting."],["Angry Goose","Sword","Leather","Its feathers lift before it charges; the honk arrives half a second before the bite.","A feathered tyrant with the confidence of a warlord and the legal status of a bird. It considers every path its personal runway."],["Drunk Peasant","Magic","Coins","Reaches for the pitchfork only after swaying twice; sidestepping the first lunge creates a long opening.","Once a local man, now mostly a cautionary tale wearing boots. Nobody knows what is in the mug, including him."],["Rabid Raccoon","Bow","Leather","Checks every belt pouch before attacking; loose coins can turn its head.","It learned lockpicking from a trash barrel and now believes it is destined for nobility. The trash disagrees."],["Sir Barnaby","Sword and Light","Coins","Polishes its shield between exchanges; striking while it admires the reflection interrupts its guard.","A knight remembered by history for his armor, his mustache, and losing the same helmet four times in one afternoon."],["Goblin Poacher","Bow","Coins","Watches the tree line instead of the target; open ground makes him panic and waste arrows.","He calls it hunting. The forest calls it paperwork. His trophy collection is mostly things that still want to escape."],["Zombie Wolf","Magic","Bones","Tracks by scent long after losing sight; it favors the wounded and ignores anything already fallen.","It died once, became inconvenient, and decided the correct response was to keep walking. Its bite remains aggressively postmortem."],["Bullying Sprite","Magic","Demon steel","Circles smaller opponents clockwise; it retreats instantly when directly challenged.","Tiny wings, enormous confidence, and no adult supervision. It has never won a fair fight and considers that a technicality."],["Cursed Timberwolf","Fire","Leather","Bark plates flex before a howl; fire makes it abandon its preferred pounce.","The curse is mostly bark, teeth, and unresolved family history. It howls whenever someone mentions therapy."],["Gloomfang","Light","Leather","Waits for dramatic shadows before entering range; sudden bright light ruins its timing.","A wolf so dramatic that even the moon gives it stage lighting. It has never entered a room without making an entrance."],["Skeleton Archer","Blunt magic","Bones","Counts its shots on bony fingers between volleys; the fourth arrow is always loosed too high.","It has no muscles and still manages better posture than everyone in the tavern. Its arrows are filed alphabetically."],["Moldy Mummy","Fire","Bones","Its bandages tighten when it hears footsteps; damp air makes the wrappings drag.","The tomb was sealed for a reason, and the reason smells damp. It has been waiting centuries to complain about the humidity."],["Necromancer Apprentice","Bow","Coins","Reads spell labels aloud before casting; interrupting the recital leaves the incantation unfinished.","He has read three forbidden books and is already unbearable about it. His robes are doing most of the intimidating."],["Grave Wraith","Light","Demon steel","Passes through walls but not iron; it circles metal weapons before committing.","A ghost with unfinished business and a very finished wardrobe. It haunts the living mostly because they have better snacks."],["Lich King Timmy","Light","Demon steel","Raises his crown hand to summon guards; knocking it aside delays the command.","He demands tribute because nobody taught him indoor voices. His crown is ancient; his tantrums are remarkably current."],["Minotaur with Anxiety","Light","Coins","Pauses at every junction to count breaths; footsteps from behind make it choose the longest corridor.","It has a maze, a schedule, and absolutely no coping skills. It apologizes before charging and after missing."],["Daedric Knight","Bow","Coins","Armor plates lock before heavy swings; the exposed knee joint remains unenchanted.","A heavily armored problem wearing the confidence of a final boss. The helmet is intimidating; the paperwork underneath is worse."],["Gargoyle","Magic","Bones","Its stone wings fold when it is truly alert; staring at its face misses the tail sweep.","It guards the fortress and judges every architectural choice. It has been perched there so long that criticism became its hobby."],["Dark Sorcerer","Light","Coins","Keeps the strongest spell in the left sleeve; smoke color changes just before a cast.","He studied forbidden magic because regular magic lacked drama. His cloak has more plot than most villagers."],["Throne Warden","Sword","Coins","Never turns its head while guarding the throne; attacks from the dais side draw a delayed response.","The throne hired security and forgot to include a personality. It has stood guard so long that sitting feels rebellious."],["Monarch Lucien","Light","Coins","Reaches for the throne before defending himself; threaten the crown and the tyrant forgets the room.","A tyrant with a cape, a castle, and several unmet emotional needs. His portrait collection is mostly pictures of himself looking disappointed."]];
 REVAMPED_MONSTERS.push(...window.CROWNHOLD_CODEX_ENTRIES);
 const neg=['Bleeding','Burning','Soaked','Poisoned','Cursed','Wild magic'];
 function chooseDialog(type){state.meta=state.meta||{};state.meta.dialogSeen=state.meta.dialogSeen||{};let seen=state.meta.dialogSeen[type]||[];if(seen.length>=LONG_DIALOGUES[type].length){seen=[]}let pool=LONG_DIALOGUES[type].map((_,i)=>i).filter(i=>!seen.includes(i));let i=pool[Math.floor(Math.random()*pool.length)];seen.push(i);state.meta.dialogSeen[type]=seen;return LONG_DIALOGUES[type][i]} window.chooseInteriorDialogue=chooseDialog;
 function panel(){return $('#interiorContent')}
 function back(){panel().dataset.compact='main';panel().innerHTML='<h2>'+({'cathedral':'Priest','blacksmith':'Blacksmith','merchant':'Merchant','home':'Your House'}[state._building]||'Building')+'</h2><div class="compact-stats">Coins: ◈ '+state.coins+' &nbsp;·&nbsp; HP: ❤ '+state.hp+'/'+state.maxHp+'</div><div class="compact-menu"><button data-compact-action="talk">Talk</button><button data-compact-action="shop">Shop</button><button data-compact-action="quest">Quest</button><button data-compact-action="leave">Leave</button></div>'}
 function showTalk(type){panel().dataset.compact='talk';panel().innerHTML='<h2>'+({cathedral:'Priest',blacksmith:'Blacksmith',merchant:'Merchant',home:'Your House'}[type]||'Building')+'</h2><p class="compact-copy">'+chooseDialog(type)+'</p><button data-long-back>Back</button>'}
 function ensureQ(type){state.meta=state.meta||{};state.meta.buildingQuestState=state.meta.buildingQuestState||{};state.meta.buildingQuestState[type]=state.meta.buildingQuestState[type]||Array(10).fill('available');return state.meta.buildingQuestState[type]}
 function progress(type,i){let p=state.meta.questProgress||{heals:0,trades:0,wins:0};if(type==='cathedral')return [p.heals>=1,p.heals>=2,p.wins>=1,p.wins>=3,p.wins>=5,p.heals>=3,!((state.meta.statuses||[]).some(x=>neg.includes(x))),p.wins>=5,state.maxHub>=1,p.wins>=10][i];if(type==='blacksmith')return [p.wins>=1,(state.materials?.leather||0)>=5,(state.weaponLevel||0)>=1,(state.armorLevel||0)>=1,p.wins>=3,p.wins>=5,(state.materials?.bones||0)>=3,((state.gear==='magic'?state.magicLevel||0:state.weaponLevel||0)>=2),p.wins>=7,p.wins>=10&&(state.armorLevel||0)>=2][i];return [p.trades>=1,p.trades>=2,p.trades>=1,(state.meta.items?.drumstick||0)+(state.meta.items?.midPotion||0)+(state.meta.items?.highPotion||0)+(state.meta.items?.antidote||0)>=2,state.meta.spells?.heal||state.meta.spells?.purify,(state.materials?.bones||0)>=5,p.trades>=5,(state.materials?.steel||0)>=3,p.trades>=10,p.trades>=15&&p.wins>=5][i]}
 function allDone(type){return ensureQ(type).every(x=>x==='complete')}
 function questView(type,index=0){let qlist=LONG_QUESTS[type],st=ensureQ(type);if(allDone(type)){back();return};let i=Math.max(0,Math.min(9,index)),q=qlist[i],status=st[i],ready=progress(type,i);panel().dataset.compact='quest';panel().innerHTML='<h2>Quest '+(i+1)+' / 10</h2><h3>'+q[0]+'</h3><p class="compact-copy">'+q[1]+'<br><b>Reward:</b> '+q[2]+'<br><b>Difficulty:</b> '+q[3]+'/10</p><div class="compact-options">'+(status==='complete'?'<span>COMPLETED</span>':status==='active'?(ready?'<button data-long-complete data-qtype="'+type+'" data-qindex="'+i+'">Complete Quest</button>':'<span>ACTIVE · Objective in progress</span>'):'<button data-long-accept data-qtype="'+type+'" data-qindex="'+i+'">Accept Quest</button>')+'<button data-long-next data-qtype="'+type+'" data-qindex="'+((i+1)%10)+'">Next Quest</button><button data-long-back>Back</button></div>'}
 function codex(){const render=i=>{let m=REVAMPED_MONSTERS[i],found=(state.meta?.codexUnlocked||[]).includes(m[0]),src=found?(window.CROWNHOLD_CODEX_ART?.[m[0]]||(typeof asset==='function'?asset(m[0]):'')):'';$('#codexCard').className='codex-card book-shell revamped-codex';$('#codexCard').innerHTML='<button class="rev-close">×</button><div class="codex-spread"><section class="rev-page rev-left"><h2>'+ (found?m[0]:'Unknown Creature') +'</h2><div class="rev-monster-window">'+(found?window.crownholdCodexImage(m[0],src):'<b style="font-size:60px">???</b>')+'</div><div class="rev-notes">'+(found?m[4]:'Defeat this monster to reveal its lore.')+'</div></section><section class="rev-page rev-right"><div class="rev-field">Weakness<span>'+ (found?m[1]:'???') +'</span></div><div class="rev-field">Material Drop<span>'+ (found?m[2]:'???') +'</span></div><div class="rev-notes">'+(found?('Field observation: '+m[3]):'This page remains suspiciously blank.')+'</div></section></div><div class="rev-nav"><button data-rev-prev>◀ Previous</button><span style="color:#f8eed7;font-weight:900">'+(i+1)+' / '+REVAMPED_MONSTERS.length+'</span><button data-rev-next>Next ▶</button></div>';$('#codexCard .rev-close').onclick=()=>$('#codexOverlay').classList.remove('open');$('#codexCard [data-rev-prev]').onclick=()=>render((i-1+REVAMPED_MONSTERS.length)%REVAMPED_MONSTERS.length);$('#codexCard [data-rev-next]').onclick=()=>render((i+1)%REVAMPED_MONSTERS.length)};$('#codexOverlay').classList.add('open');render(0)}
 document.addEventListener('click',e=>{let b=e.target.closest('[data-compact-action]');if(b&&$('#interior')?.classList.contains('active')){let a=b.dataset.compactAction,t=state._building;if(a==='talk'){e.preventDefault();e.stopImmediatePropagation();showTalk(t)}else if(a==='quest'){e.preventDefault();e.stopImmediatePropagation();questView(t,0)}else if(a==='codex'){e.preventDefault();e.stopImmediatePropagation();codex()}}if(e.target.closest('[data-long-back]')){e.preventDefault();e.stopImmediatePropagation();back()}let ac=e.target.closest('[data-long-accept]');if(ac){e.preventDefault();e.stopImmediatePropagation();ensureQ(ac.dataset.qtype)[+ac.dataset.qindex]='active';questView(ac.dataset.qtype,+ac.dataset.qindex)}let co=e.target.closest('[data-long-complete]');if(co){e.preventDefault();e.stopImmediatePropagation();ensureQ(co.dataset.qtype)[+co.dataset.qindex]='complete';questView(co.dataset.qtype,+co.dataset.qindex)}let nx=e.target.closest('[data-long-next]');if(nx){e.preventDefault();e.stopImmediatePropagation();questView(nx.dataset.qtype,+nx.dataset.qindex)}},true);
 document.addEventListener('click',e=>{if(e.target.closest('[data-facility]'))setTimeout(()=>{let p=panel();if(p&&state._building==='home')p.querySelector('[data-compact-action="quest"]')?.remove()},300)},true);
 window.openHouseCodex=codex;
})();

(()=>{
 const LONG_DIALOGUES={"cathedral": ["The light welcomes you. It has terrible taste in furniture.", "I prayed for a miracle and received a tax notice.", "Please wipe your boots. The floor is holier than most people.", "The candles are watching you. One of them has already filed a complaint.", "Our choir sings beautifully, especially when nobody asks them to stop.", "The cathedral is peaceful today, which means the ghosts are planning something.", "I can bless you, but I cannot bless your spending habits.", "The stained glass depicts a saint defeating a goose. History is complicated.", "Confession is free. The emotional damage is extra.", "The reliquary vanished, and somehow everyone suspects the person holding a sword.", "I keep the holy water next to the regular water. The labels are not helpful.", "The altar has seen more bad decisions than a royal courtroom.", "If you hear whispering from the crypt, whisper back politely.", "We accept coins, apologies, and proof that you did not steal the relic.", "The old bell rings whenever someone lies. It has been ringing for three days.", "I wanted a quiet life. Then adventurers discovered doors.", "A blessing lasts longer if you stop immediately walking into traps.", "The cathedral roof leaks only during important sermons.", "Our patron saint is technically still wanted by the monastery.", "Try not to summon anything in the chapel. We just repaired the summoning circle."], "blacksmith": ["The forge is hot, the steel is stubborn, and your purse looks light.", "Need a sharper edge? I have one. It is probably haunted.", "A good sword is ninety percent metal and ten percent dramatic posing.", "Your armor is making a noise that suggests it has opinions.", "I can fix the blade. I cannot fix the decision that broke it.", "The anvil has a name. We do not say it after sunset.", "Bring leather, coins, and a willingness to ignore safety instructions.", "Every dent tells a story. Yours says you stood still a lot.", "Magic weapons are just regular weapons with better marketing.", "I forged a helmet that protects against curses and unsolicited advice.", "The furnace is hungry. Please do not feed it your quest log again.", "A bowstring is cheaper than therapy and usually more effective.", "Your shield is held together by rivets, spite, and one suspicious prayer.", "I once made a royal crown. It was mostly decorative and emotionally fragile.", "If the hammer starts whispering, hammer it harder.", "Armor should fit snugly enough to protect you and loosely enough to regret.", "I can temper steel. Tempering heroes takes much longer.", "The last adventurer asked for a legendary sword and paid in turnips.", "A clean blade is a sign of discipline. Or that you have not used it yet.", "Do not touch the glowing metal. That advice has saved exactly nobody."], "merchant": ["Fresh wares! Mostly fresh, anyway. The labels are optimistic.", "I sell miracles by the bottle and regrets by the crate.", "Everything is a bargain if you ignore what it cost me.", "The skull is decorative. The tax receipt is not.", "I have potions for healing, courage, and pretending you understood the quest.", "Spellbooks are non-refundable once the letters start rearranging themselves.", "Materials are up this week. The bones market is surprisingly volatile.", "I accept coins, favors, and secrets that are not legally actionable.", "My shop has a return policy. The policy is that returns are unfortunate.", "This rug is cursed, but only in a charming, conversational way.", "You look like someone who needs a discount and will receive a lecture instead.", "The merchant guild says these prices are fair. The merchant guild is me.", "I stock antidotes for poison, curses, and suspicious soup.", "The rare goods are behind the curtain. The curtain is also for sale.", "If a potion glows, it is either magical or extremely spoiled.", "I can identify that relic. For a fee. I can also misidentify it for less.", "The spellbook says do not read aloud. Naturally, everyone reads it aloud.", "My inventory is organized alphabetically by how dangerous it is.", "I once sold a hero a map. The map led to me. Very profitable.", "Come back after your next disaster. Disasters are excellent for repeat business."]};
 const LONG_QUESTS={"cathedral": [["The Missing Reliquary", "Purify one ailment or restore your health, then return.", "Blessed Charm · removes the first negative ailment each battle", 8, 12], ["Candle Tax", "Clear two negative ailments.", "8 coins + 1 potion", 2, 8], ["Choir Practice", "Win one combat encounter without Guard.", "Blessed Thread · +1 max HP", 1, 15], ["Crypt Errand", "Defeat three monsters.", "12 coins + 1 bone", 3, 12], ["Bell of Bad Omens", "Survive a boss encounter.", "20 coins + 1 demon steel", 1, 20], ["Saints and Sinners", "Use three cathedral services.", "Blessing · +2 max HP", 3, 10], ["The Polite Exorcism", "Clear Burning, Soaked, or Cursed.", "Holy Seal · resistance bonus", 1, 14], ["Pilgrim Mileage", "Clear five encounters.", "25 coins + 2 bones", 5, 25], ["A Very Long Sermon", "Reach the next area.", "30 coins + 1 steel", 1, 30], ["The Last Benediction", "Defeat ten monsters.", "Cathedral Favor · permanent blessing", 10, 40]], "blacksmith": [["Test the Edge", "Win one combat encounter.", "Forged Edge · +2 attack damage", 1, 12], ["Leather Weather", "Collect five leather.", "10 coins + 1 armor level", 5, 10], ["Hammer Time", "Upgrade weapon or magic once.", "12 coins + 1 steel", 1, 12], ["Armor of Regret", "Upgrade armor once.", "15 coins + 1 bone", 1, 15], ["Field Testing", "Win three encounters.", "20 coins + 1 leather", 3, 20], ["Boss Material", "Defeat a boss.", "25 coins + 2 steel", 1, 25], ["Temper Temper", "Collect three bones.", "18 coins + armor resistance", 3, 18], ["The Perfect Focus", "Reach Magic Lv 2 or Weapon Lv 2.", "30 coins + 1 steel", 2, 30], ["Anvil Marathon", "Win seven encounters.", "35 coins + 2 leather", 7, 35], ["Masterwork", "Win ten encounters and reach Armor Lv 2.", "Masterwork upgrade · +5 max HP", 10, 50]], "merchant": [["A Rare Trade", "Complete one purchase or sale.", "Merchant Ledger · shop discount", 1, 10], ["Stock Rotation", "Buy two materials.", "8 coins + 1 leather", 2, 8], ["Suspiciously Legal", "Sell one material.", "10 coins + 1 potion", 1, 10], ["Potion Commotion", "Buy two potions or antidotes.", "15 coins + 1 antidote", 2, 15], ["Spellbook Club", "Buy one spellbook as a magic player.", "20 coins + 1 magic level", 1, 20], ["Bone Market", "Collect five bones.", "18 coins + 1 steel", 5, 18], ["The Big Sale", "Make five trades.", "25 coins + 2 leather", 5, 25], ["Inventory Problems", "Collect three demon steel.", "30 coins + 1 spellbook", 3, 30], ["Repeat Customer", "Make ten trades.", "40 coins + merchant favor", 10, 40], ["Final Clearance", "Make fifteen trades and defeat five monsters.", "60 coins + 2 steel", 15, 60]]};
 const REVAMPED_MONSTERS=[["Slime Rat","Bow","Leather","Leaves a wet trail that points away from the nearest light; arrows tend to stick in its gelatinous hide.","A damp little nuisance born wherever abandoned cellars outlive their owners. It has survived three extermination attempts and one emotional village meeting."],["Angry Goose","Sword","Leather","Its feathers lift before it charges; the honk arrives half a second before the bite.","A feathered tyrant with the confidence of a warlord and the legal status of a bird. It considers every path its personal runway."],["Drunk Peasant","Magic","Coins","Reaches for the pitchfork only after swaying twice; sidestepping the first lunge creates a long opening.","Once a local man, now mostly a cautionary tale wearing boots. Nobody knows what is in the mug, including him."],["Rabid Raccoon","Bow","Leather","Checks every belt pouch before attacking; loose coins can turn its head.","It learned lockpicking from a trash barrel and now believes it is destined for nobility. The trash disagrees."],["Sir Barnaby","Sword and Light","Coins","Polishes its shield between exchanges; striking while it admires the reflection interrupts its guard.","A knight remembered by history for his armor, his mustache, and losing the same helmet four times in one afternoon."],["Goblin Poacher","Bow","Coins","Watches the tree line instead of the target; open ground makes him panic and waste arrows.","He calls it hunting. The forest calls it paperwork. His trophy collection is mostly things that still want to escape."],["Zombie Wolf","Magic","Bones","Tracks by scent long after losing sight; it favors the wounded and ignores anything already fallen.","It died once, became inconvenient, and decided the correct response was to keep walking. Its bite remains aggressively postmortem."],["Bullying Sprite","Magic","Demon steel","Circles smaller opponents clockwise; it retreats instantly when directly challenged.","Tiny wings, enormous confidence, and no adult supervision. It has never won a fair fight and considers that a technicality."],["Cursed Timberwolf","Fire","Leather","Bark plates flex before a howl; fire makes it abandon its preferred pounce.","The curse is mostly bark, teeth, and unresolved family history. It howls whenever someone mentions therapy."],["Gloomfang","Light","Leather","Waits for dramatic shadows before entering range; sudden bright light ruins its timing.","A wolf so dramatic that even the moon gives it stage lighting. It has never entered a room without making an entrance."],["Skeleton Archer","Blunt magic","Bones","Counts its shots on bony fingers between volleys; the fourth arrow is always loosed too high.","It has no muscles and still manages better posture than everyone in the tavern. Its arrows are filed alphabetically."],["Moldy Mummy","Fire","Bones","Its bandages tighten when it hears footsteps; damp air makes the wrappings drag.","The tomb was sealed for a reason, and the reason smells damp. It has been waiting centuries to complain about the humidity."],["Necromancer Apprentice","Bow","Coins","Reads spell labels aloud before casting; interrupting the recital leaves the incantation unfinished.","He has read three forbidden books and is already unbearable about it. His robes are doing most of the intimidating."],["Grave Wraith","Light","Demon steel","Passes through walls but not iron; it circles metal weapons before committing.","A ghost with unfinished business and a very finished wardrobe. It haunts the living mostly because they have better snacks."],["Lich King Timmy","Light","Demon steel","Raises his crown hand to summon guards; knocking it aside delays the command.","He demands tribute because nobody taught him indoor voices. His crown is ancient; his tantrums are remarkably current."],["Minotaur with Anxiety","Light","Coins","Pauses at every junction to count breaths; footsteps from behind make it choose the longest corridor.","It has a maze, a schedule, and absolutely no coping skills. It apologizes before charging and after missing."],["Daedric Knight","Bow","Coins","Armor plates lock before heavy swings; the exposed knee joint remains unenchanted.","A heavily armored problem wearing the confidence of a final boss. The helmet is intimidating; the paperwork underneath is worse."],["Gargoyle","Magic","Bones","Its stone wings fold when it is truly alert; staring at its face misses the tail sweep.","It guards the fortress and judges every architectural choice. It has been perched there so long that criticism became its hobby."],["Dark Sorcerer","Light","Coins","Keeps the strongest spell in the left sleeve; smoke color changes just before a cast.","He studied forbidden magic because regular magic lacked drama. His cloak has more plot than most villagers."],["Throne Warden","Sword","Coins","Never turns its head while guarding the throne; attacks from the dais side draw a delayed response.","The throne hired security and forgot to include a personality. It has stood guard so long that sitting feels rebellious."],["Monarch Lucien","Light","Coins","Reaches for the throne before defending himself; threaten the crown and the tyrant forgets the room.","A tyrant with a cape, a castle, and several unmet emotional needs. His portrait collection is mostly pictures of himself looking disappointed."]];
 REVAMPED_MONSTERS.push(...window.CROWNHOLD_CODEX_ENTRIES);
 const neg=['Bleeding','Burning','Soaked','Poisoned','Cursed','Wild magic'];
 function chooseDialog(type){state.meta=state.meta||{};state.meta.dialogSeen=state.meta.dialogSeen||{};let seen=state.meta.dialogSeen[type]||[];if(seen.length>=LONG_DIALOGUES[type].length){seen=[]}let pool=LONG_DIALOGUES[type].map((_,i)=>i).filter(i=>!seen.includes(i));let i=pool[Math.floor(Math.random()*pool.length)];seen.push(i);state.meta.dialogSeen[type]=seen;return LONG_DIALOGUES[type][i]} window.chooseInteriorDialogue=chooseDialog;
 function panel(){return $('#interiorContent')}
 function back(){panel().dataset.compact='main';panel().innerHTML='<h2>'+({'cathedral':'Priest','blacksmith':'Blacksmith','merchant':'Merchant','home':'Your House'}[state._building]||'Building')+'</h2><div class="compact-stats">Coins: ◈ '+state.coins+' &nbsp;·&nbsp; HP: ❤ '+state.hp+'/'+state.maxHp+'</div><div class="compact-menu"><button data-compact-action="talk">Talk</button><button data-compact-action="shop">Shop</button><button data-compact-action="quest">Quest</button><button data-compact-action="leave">Leave</button></div>'}
 function showTalk(type){panel().dataset.compact='talk';panel().innerHTML='<h2>'+({cathedral:'Priest',blacksmith:'Blacksmith',merchant:'Merchant',home:'Your House'}[type]||'Building')+'</h2><p class="compact-copy">'+chooseDialog(type)+'</p><button data-long-back>Back</button>'}
 function ensureQ(type){state.meta=state.meta||{};state.meta.buildingQuestState=state.meta.buildingQuestState||{};state.meta.buildingQuestState[type]=state.meta.buildingQuestState[type]||Array(10).fill('available');return state.meta.buildingQuestState[type]}
 function progress(type,i){let p=state.meta.questProgress||{heals:0,trades:0,wins:0};if(type==='cathedral')return [p.heals>=1,p.heals>=2,p.wins>=1,p.wins>=3,p.wins>=5,p.heals>=3,!((state.meta.statuses||[]).some(x=>neg.includes(x))),p.wins>=5,state.maxHub>=1,p.wins>=10][i];if(type==='blacksmith')return [p.wins>=1,(state.materials?.leather||0)>=5,(state.weaponLevel||0)>=1,(state.armorLevel||0)>=1,p.wins>=3,p.wins>=5,(state.materials?.bones||0)>=3,((state.gear==='magic'?state.magicLevel||0:state.weaponLevel||0)>=2),p.wins>=7,p.wins>=10&&(state.armorLevel||0)>=2][i];return [p.trades>=1,p.trades>=2,p.trades>=1,(state.meta.items?.drumstick||0)+(state.meta.items?.midPotion||0)+(state.meta.items?.highPotion||0)+(state.meta.items?.antidote||0)>=2,state.meta.spells?.heal||state.meta.spells?.purify,(state.materials?.bones||0)>=5,p.trades>=5,(state.materials?.steel||0)>=3,p.trades>=10,p.trades>=15&&p.wins>=5][i]}
 function allDone(type){return ensureQ(type).every(x=>x==='complete')}
 function questView(type,index=0){let qlist=LONG_QUESTS[type],st=ensureQ(type);if(allDone(type)){back();return};let i=Math.max(0,Math.min(9,index)),q=qlist[i],status=st[i],ready=progress(type,i);panel().dataset.compact='quest';panel().innerHTML='<h2>Quest '+(i+1)+' / 10</h2><h3>'+q[0]+'</h3><p class="compact-copy">'+q[1]+'<br><b>Reward:</b> '+q[2]+'<br><b>Difficulty:</b> '+q[3]+'/10</p><div class="compact-options">'+(status==='complete'?'<span>COMPLETED</span>':status==='active'?(ready?'<button data-long-complete data-qtype="'+type+'" data-qindex="'+i+'">Complete Quest</button>':'<span>ACTIVE · Objective in progress</span>'):'<button data-long-accept data-qtype="'+type+'" data-qindex="'+i+'">Accept Quest</button>')+'<button data-long-next data-qtype="'+type+'" data-qindex="'+((i+1)%10)+'">Next Quest</button><button data-long-back>Back</button></div>'}
 function codex(){const render=i=>{let m=REVAMPED_MONSTERS[i],found=(state.meta?.codexUnlocked||[]).includes(m[0]),src=found?(window.CROWNHOLD_CODEX_ART?.[m[0]]||(typeof asset==='function'?asset(m[0]):'')):'';$('#codexCard').className='codex-card book-shell revamped-codex';$('#codexCard').innerHTML='<button class="rev-close">×</button><div class="codex-spread"><section class="rev-page rev-left"><h2>'+ (found?m[0]:'Unknown Creature') +'</h2><div class="rev-monster-window">'+(found?window.crownholdCodexImage(m[0],src):'<b style="font-size:60px">???</b>')+'</div><div class="rev-notes">'+(found?m[4]:'Defeat this monster to reveal its lore.')+'</div></section><section class="rev-page rev-right"><div class="rev-field">Weakness<span>'+ (found?m[1]:'???') +'</span></div><div class="rev-field">Material Drop<span>'+ (found?m[2]:'???') +'</span></div><div class="rev-notes">'+(found?('Field observation: '+m[3]):'This page remains suspiciously blank.')+'</div></section></div><div class="rev-nav"><button data-rev-prev>◀ Previous</button><span style="color:#f8eed7;font-weight:900">'+(i+1)+' / '+REVAMPED_MONSTERS.length+'</span><button data-rev-next>Next ▶</button></div>';$('#codexCard .rev-close').onclick=()=>$('#codexOverlay').classList.remove('open');$('#codexCard [data-rev-prev]').onclick=()=>render((i-1+REVAMPED_MONSTERS.length)%REVAMPED_MONSTERS.length);$('#codexCard [data-rev-next]').onclick=()=>render((i+1)%REVAMPED_MONSTERS.length)};$('#codexOverlay').classList.add('open');render(0)}
 document.addEventListener('click',e=>{let b=e.target.closest('[data-compact-action]');if(b&&$('#interior')?.classList.contains('active')){let a=b.dataset.compactAction,t=state._building;if(a==='talk'){e.preventDefault();e.stopImmediatePropagation();showTalk(t)}else if(a==='quest'){e.preventDefault();e.stopImmediatePropagation();questView(t,0)}else if(a==='codex'){e.preventDefault();e.stopImmediatePropagation();codex()}}if(e.target.closest('[data-long-back]')){e.preventDefault();e.stopImmediatePropagation();back()}let ac=e.target.closest('[data-long-accept]');if(ac){e.preventDefault();e.stopImmediatePropagation();ensureQ(ac.dataset.qtype)[+ac.dataset.qindex]='active';questView(ac.dataset.qtype,+ac.dataset.qindex)}let co=e.target.closest('[data-long-complete]');if(co){e.preventDefault();e.stopImmediatePropagation();ensureQ(co.dataset.qtype)[+co.dataset.qindex]='complete';questView(co.dataset.qtype,+co.dataset.qindex)}let nx=e.target.closest('[data-long-next]');if(nx){e.preventDefault();e.stopImmediatePropagation();questView(nx.dataset.qtype,+nx.dataset.qindex)}},true);
 document.addEventListener('click',e=>{if(e.target.closest('[data-facility]'))setTimeout(()=>{let p=panel();if(p&&state._building==='home')p.querySelector('[data-compact-action="quest"]')?.remove()},300)},true);
 window.openHouseCodex=codex;
})();

(()=>{
 const LONG_DIALOGUES={"cathedral": ["The light welcomes you. It has terrible taste in furniture.", "I prayed for a miracle and received a tax notice.", "Please wipe your boots. The floor is holier than most people.", "The candles are watching you. One of them has already filed a complaint.", "Our choir sings beautifully, especially when nobody asks them to stop.", "The cathedral is peaceful today, which means the ghosts are planning something.", "I can bless you, but I cannot bless your spending habits.", "The stained glass depicts a saint defeating a goose. History is complicated.", "Confession is free. The emotional damage is extra.", "The reliquary vanished, and somehow everyone suspects the person holding a sword.", "I keep the holy water next to the regular water. The labels are not helpful.", "The altar has seen more bad decisions than a royal courtroom.", "If you hear whispering from the crypt, whisper back politely.", "We accept coins, apologies, and proof that you did not steal the relic.", "The old bell rings whenever someone lies. It has been ringing for three days.", "I wanted a quiet life. Then adventurers discovered doors.", "A blessing lasts longer if you stop immediately walking into traps.", "The cathedral roof leaks only during important sermons.", "Our patron saint is technically still wanted by the monastery.", "Try not to summon anything in the chapel. We just repaired the summoning circle."], "blacksmith": ["The forge is hot, the steel is stubborn, and your purse looks light.", "Need a sharper edge? I have one. It is probably haunted.", "A good sword is ninety percent metal and ten percent dramatic posing.", "Your armor is making a noise that suggests it has opinions.", "I can fix the blade. I cannot fix the decision that broke it.", "The anvil has a name. We do not say it after sunset.", "Bring leather, coins, and a willingness to ignore safety instructions.", "Every dent tells a story. Yours says you stood still a lot.", "Magic weapons are just regular weapons with better marketing.", "I forged a helmet that protects against curses and unsolicited advice.", "The furnace is hungry. Please do not feed it your quest log again.", "A bowstring is cheaper than therapy and usually more effective.", "Your shield is held together by rivets, spite, and one suspicious prayer.", "I once made a royal crown. It was mostly decorative and emotionally fragile.", "If the hammer starts whispering, hammer it harder.", "Armor should fit snugly enough to protect you and loosely enough to regret.", "I can temper steel. Tempering heroes takes much longer.", "The last adventurer asked for a legendary sword and paid in turnips.", "A clean blade is a sign of discipline. Or that you have not used it yet.", "Do not touch the glowing metal. That advice has saved exactly nobody."], "merchant": ["Fresh wares! Mostly fresh, anyway. The labels are optimistic.", "I sell miracles by the bottle and regrets by the crate.", "Everything is a bargain if you ignore what it cost me.", "The skull is decorative. The tax receipt is not.", "I have potions for healing, courage, and pretending you understood the quest.", "Spellbooks are non-refundable once the letters start rearranging themselves.", "Materials are up this week. The bones market is surprisingly volatile.", "I accept coins, favors, and secrets that are not legally actionable.", "My shop has a return policy. The policy is that returns are unfortunate.", "This rug is cursed, but only in a charming, conversational way.", "You look like someone who needs a discount and will receive a lecture instead.", "The merchant guild says these prices are fair. The merchant guild is me.", "I stock antidotes for poison, curses, and suspicious soup.", "The rare goods are behind the curtain. The curtain is also for sale.", "If a potion glows, it is either magical or extremely spoiled.", "I can identify that relic. For a fee. I can also misidentify it for less.", "The spellbook says do not read aloud. Naturally, everyone reads it aloud.", "My inventory is organized alphabetically by how dangerous it is.", "I once sold a hero a map. The map led to me. Very profitable.", "Come back after your next disaster. Disasters are excellent for repeat business."]};
 const LONG_QUESTS={"cathedral": [["The Missing Reliquary", "Purify one ailment or restore your health, then return.", "Blessed Charm · removes the first negative ailment each battle", 8, 12], ["Candle Tax", "Clear two negative ailments.", "8 coins + 1 potion", 2, 8], ["Choir Practice", "Win one combat encounter without Guard.", "Blessed Thread · +1 max HP", 1, 15], ["Crypt Errand", "Defeat three monsters.", "12 coins + 1 bone", 3, 12], ["Bell of Bad Omens", "Survive a boss encounter.", "20 coins + 1 demon steel", 1, 20], ["Saints and Sinners", "Use three cathedral services.", "Blessing · +2 max HP", 3, 10], ["The Polite Exorcism", "Clear Burning, Soaked, or Cursed.", "Holy Seal · resistance bonus", 1, 14], ["Pilgrim Mileage", "Clear five encounters.", "25 coins + 2 bones", 5, 25], ["A Very Long Sermon", "Reach the next area.", "30 coins + 1 steel", 1, 30], ["The Last Benediction", "Defeat ten monsters.", "Cathedral Favor · permanent blessing", 10, 40]], "blacksmith": [["Test the Edge", "Win one combat encounter.", "Forged Edge · +2 attack damage", 1, 12], ["Leather Weather", "Collect five leather.", "10 coins + 1 armor level", 5, 10], ["Hammer Time", "Upgrade weapon or magic once.", "12 coins + 1 steel", 1, 12], ["Armor of Regret", "Upgrade armor once.", "15 coins + 1 bone", 1, 15], ["Field Testing", "Win three encounters.", "20 coins + 1 leather", 3, 20], ["Boss Material", "Defeat a boss.", "25 coins + 2 steel", 1, 25], ["Temper Temper", "Collect three bones.", "18 coins + armor resistance", 3, 18], ["The Perfect Focus", "Reach Magic Lv 2 or Weapon Lv 2.", "30 coins + 1 steel", 2, 30], ["Anvil Marathon", "Win seven encounters.", "35 coins + 2 leather", 7, 35], ["Masterwork", "Win ten encounters and reach Armor Lv 2.", "Masterwork upgrade · +5 max HP", 10, 50]], "merchant": [["A Rare Trade", "Complete one purchase or sale.", "Merchant Ledger · shop discount", 1, 10], ["Stock Rotation", "Buy two materials.", "8 coins + 1 leather", 2, 8], ["Suspiciously Legal", "Sell one material.", "10 coins + 1 potion", 1, 10], ["Potion Commotion", "Buy two potions or antidotes.", "15 coins + 1 antidote", 2, 15], ["Spellbook Club", "Buy one spellbook as a magic player.", "20 coins + 1 magic level", 1, 20], ["Bone Market", "Collect five bones.", "18 coins + 1 steel", 5, 18], ["The Big Sale", "Make five trades.", "25 coins + 2 leather", 5, 25], ["Inventory Problems", "Collect three demon steel.", "30 coins + 1 spellbook", 3, 30], ["Repeat Customer", "Make ten trades.", "40 coins + merchant favor", 10, 40], ["Final Clearance", "Make fifteen trades and defeat five monsters.", "60 coins + 2 steel", 15, 60]]};
 const REVAMPED_MONSTERS=[["Slime Rat","Bow","Leather","Leaves a wet trail that points away from the nearest light; arrows tend to stick in its gelatinous hide.","A damp little nuisance born wherever abandoned cellars outlive their owners. It has survived three extermination attempts and one emotional village meeting."],["Angry Goose","Sword","Leather","Its feathers lift before it charges; the honk arrives half a second before the bite.","A feathered tyrant with the confidence of a warlord and the legal status of a bird. It considers every path its personal runway."],["Drunk Peasant","Magic","Coins","Reaches for the pitchfork only after swaying twice; sidestepping the first lunge creates a long opening.","Once a local man, now mostly a cautionary tale wearing boots. Nobody knows what is in the mug, including him."],["Rabid Raccoon","Bow","Leather","Checks every belt pouch before attacking; loose coins can turn its head.","It learned lockpicking from a trash barrel and now believes it is destined for nobility. The trash disagrees."],["Sir Barnaby","Sword and Light","Coins","Polishes its shield between exchanges; striking while it admires the reflection interrupts its guard.","A knight remembered by history for his armor, his mustache, and losing the same helmet four times in one afternoon."],["Goblin Poacher","Bow","Coins","Watches the tree line instead of the target; open ground makes him panic and waste arrows.","He calls it hunting. The forest calls it paperwork. His trophy collection is mostly things that still want to escape."],["Zombie Wolf","Magic","Bones","Tracks by scent long after losing sight; it favors the wounded and ignores anything already fallen.","It died once, became inconvenient, and decided the correct response was to keep walking. Its bite remains aggressively postmortem."],["Bullying Sprite","Magic","Demon steel","Circles smaller opponents clockwise; it retreats instantly when directly challenged.","Tiny wings, enormous confidence, and no adult supervision. It has never won a fair fight and considers that a technicality."],["Cursed Timberwolf","Fire","Leather","Bark plates flex before a howl; fire makes it abandon its preferred pounce.","The curse is mostly bark, teeth, and unresolved family history. It howls whenever someone mentions therapy."],["Gloomfang","Light","Leather","Waits for dramatic shadows before entering range; sudden bright light ruins its timing.","A wolf so dramatic that even the moon gives it stage lighting. It has never entered a room without making an entrance."],["Skeleton Archer","Blunt magic","Bones","Counts its shots on bony fingers between volleys; the fourth arrow is always loosed too high.","It has no muscles and still manages better posture than everyone in the tavern. Its arrows are filed alphabetically."],["Moldy Mummy","Fire","Bones","Its bandages tighten when it hears footsteps; damp air makes the wrappings drag.","The tomb was sealed for a reason, and the reason smells damp. It has been waiting centuries to complain about the humidity."],["Necromancer Apprentice","Bow","Coins","Reads spell labels aloud before casting; interrupting the recital leaves the incantation unfinished.","He has read three forbidden books and is already unbearable about it. His robes are doing most of the intimidating."],["Grave Wraith","Light","Demon steel","Passes through walls but not iron; it circles metal weapons before committing.","A ghost with unfinished business and a very finished wardrobe. It haunts the living mostly because they have better snacks."],["Lich King Timmy","Light","Demon steel","Raises his crown hand to summon guards; knocking it aside delays the command.","He demands tribute because nobody taught him indoor voices. His crown is ancient; his tantrums are remarkably current."],["Minotaur with Anxiety","Light","Coins","Pauses at every junction to count breaths; footsteps from behind make it choose the longest corridor.","It has a maze, a schedule, and absolutely no coping skills. It apologizes before charging and after missing."],["Daedric Knight","Bow","Coins","Armor plates lock before heavy swings; the exposed knee joint remains unenchanted.","A heavily armored problem wearing the confidence of a final boss. The helmet is intimidating; the paperwork underneath is worse."],["Gargoyle","Magic","Bones","Its stone wings fold when it is truly alert; staring at its face misses the tail sweep.","It guards the fortress and judges every architectural choice. It has been perched there so long that criticism became its hobby."],["Dark Sorcerer","Light","Coins","Keeps the strongest spell in the left sleeve; smoke color changes just before a cast.","He studied forbidden magic because regular magic lacked drama. His cloak has more plot than most villagers."],["Throne Warden","Sword","Coins","Never turns its head while guarding the throne; attacks from the dais side draw a delayed response.","The throne hired security and forgot to include a personality. It has stood guard so long that sitting feels rebellious."],["Monarch Lucien","Light","Coins","Reaches for the throne before defending himself; threaten the crown and the tyrant forgets the room.","A tyrant with a cape, a castle, and several unmet emotional needs. His portrait collection is mostly pictures of himself looking disappointed."]];
 REVAMPED_MONSTERS.push(...window.CROWNHOLD_CODEX_ENTRIES);
 const neg=['Bleeding','Burning','Soaked','Poisoned','Cursed','Wild magic'];
 function chooseDialog(type){state.meta=state.meta||{};state.meta.dialogSeen=state.meta.dialogSeen||{};let seen=state.meta.dialogSeen[type]||[];if(seen.length>=LONG_DIALOGUES[type].length){seen=[]}let pool=LONG_DIALOGUES[type].map((_,i)=>i).filter(i=>!seen.includes(i));let i=pool[Math.floor(Math.random()*pool.length)];seen.push(i);state.meta.dialogSeen[type]=seen;return LONG_DIALOGUES[type][i]} window.chooseInteriorDialogue=chooseDialog;
 function panel(){return $('#interiorContent')}
 function back(){panel().dataset.compact='main';panel().innerHTML='<h2>'+({'cathedral':'Priest','blacksmith':'Blacksmith','merchant':'Merchant','home':'Your House'}[state._building]||'Building')+'</h2><div class="compact-stats">Coins: ◈ '+state.coins+' &nbsp;·&nbsp; HP: ❤ '+state.hp+'/'+state.maxHp+'</div><div class="compact-menu"><button data-compact-action="talk">Talk</button><button data-compact-action="shop">Shop</button><button data-compact-action="quest">Quest</button><button data-compact-action="leave">Leave</button></div>'}
 function showTalk(type){panel().dataset.compact='talk';panel().innerHTML='<h2>'+({cathedral:'Priest',blacksmith:'Blacksmith',merchant:'Merchant',home:'Your House'}[type]||'Building')+'</h2><p class="compact-copy">'+chooseDialog(type)+'</p><button data-long-back>Back</button>'}
 function ensureQ(type){state.meta=state.meta||{};state.meta.buildingQuestState=state.meta.buildingQuestState||{};state.meta.buildingQuestState[type]=state.meta.buildingQuestState[type]||Array(10).fill('available');return state.meta.buildingQuestState[type]}
 function progress(type,i){let p=state.meta.questProgress||{heals:0,trades:0,wins:0};if(type==='cathedral')return [p.heals>=1,p.heals>=2,p.wins>=1,p.wins>=3,p.wins>=5,p.heals>=3,!((state.meta.statuses||[]).some(x=>neg.includes(x))),p.wins>=5,state.maxHub>=1,p.wins>=10][i];if(type==='blacksmith')return [p.wins>=1,(state.materials?.leather||0)>=5,(state.weaponLevel||0)>=1,(state.armorLevel||0)>=1,p.wins>=3,p.wins>=5,(state.materials?.bones||0)>=3,((state.gear==='magic'?state.magicLevel||0:state.weaponLevel||0)>=2),p.wins>=7,p.wins>=10&&(state.armorLevel||0)>=2][i];return [p.trades>=1,p.trades>=2,p.trades>=1,(state.meta.items?.drumstick||0)+(state.meta.items?.midPotion||0)+(state.meta.items?.highPotion||0)+(state.meta.items?.antidote||0)>=2,state.meta.spells?.heal||state.meta.spells?.purify,(state.materials?.bones||0)>=5,p.trades>=5,(state.materials?.steel||0)>=3,p.trades>=10,p.trades>=15&&p.wins>=5][i]}
 function allDone(type){return ensureQ(type).every(x=>x==='complete')}
 function questView(type,index=0){let qlist=LONG_QUESTS[type],st=ensureQ(type);if(allDone(type)){back();return};let i=Math.max(0,Math.min(9,index)),q=qlist[i],status=st[i],ready=progress(type,i);panel().dataset.compact='quest';panel().innerHTML='<h2>Quest '+(i+1)+' / 10</h2><h3>'+q[0]+'</h3><p class="compact-copy">'+q[1]+'<br><b>Reward:</b> '+q[2]+'<br><b>Difficulty:</b> '+q[3]+'/10</p><div class="compact-options">'+(status==='complete'?'<span>COMPLETED</span>':status==='active'?(ready?'<button data-long-complete data-qtype="'+type+'" data-qindex="'+i+'">Complete Quest</button>':'<span>ACTIVE · Objective in progress</span>'):'<button data-long-accept data-qtype="'+type+'" data-qindex="'+i+'">Accept Quest</button>')+'<button data-long-next data-qtype="'+type+'" data-qindex="'+((i+1)%10)+'">Next Quest</button><button data-long-back>Back</button></div>'}
 function codex(){const render=i=>{let m=REVAMPED_MONSTERS[i],found=(state.meta?.codexUnlocked||[]).includes(m[0]),src=found?(window.CROWNHOLD_CODEX_ART?.[m[0]]||(typeof asset==='function'?asset(m[0]):'')):'';$('#codexCard').className='codex-card book-shell revamped-codex';$('#codexCard').innerHTML='<button class="rev-close">×</button><div class="codex-spread"><section class="rev-page rev-left"><h2>'+ (found?m[0]:'Unknown Creature') +'</h2><div class="rev-monster-window">'+(found?window.crownholdCodexImage(m[0],src):'<b style="font-size:60px">???</b>')+'</div><div class="rev-notes">'+(found?m[4]:'Defeat this monster to reveal its lore.')+'</div></section><section class="rev-page rev-right"><div class="rev-field">Weakness<span>'+ (found?m[1]:'???') +'</span></div><div class="rev-field">Material Drop<span>'+ (found?m[2]:'???') +'</span></div><div class="rev-notes">'+(found?('Field observation: '+m[3]):'This page remains suspiciously blank.')+'</div></section></div><div class="rev-nav"><button data-rev-prev>◀ Previous</button><span style="color:#f8eed7;font-weight:900">'+(i+1)+' / '+REVAMPED_MONSTERS.length+'</span><button data-rev-next>Next ▶</button></div>';$('#codexCard .rev-close').onclick=()=>$('#codexOverlay').classList.remove('open');$('#codexCard [data-rev-prev]').onclick=()=>render((i-1+REVAMPED_MONSTERS.length)%REVAMPED_MONSTERS.length);$('#codexCard [data-rev-next]').onclick=()=>render((i+1)%REVAMPED_MONSTERS.length)};$('#codexOverlay').classList.add('open');render(0)}
 document.addEventListener('click',e=>{let b=e.target.closest('[data-compact-action]');if(b&&$('#interior')?.classList.contains('active')){let a=b.dataset.compactAction,t=state._building;if(a==='talk'){e.preventDefault();e.stopImmediatePropagation();showTalk(t)}else if(a==='quest'){e.preventDefault();e.stopImmediatePropagation();questView(t,0)}else if(a==='codex'){e.preventDefault();e.stopImmediatePropagation();codex()}}if(e.target.closest('[data-long-back]')){e.preventDefault();e.stopImmediatePropagation();back()}let ac=e.target.closest('[data-long-accept]');if(ac){e.preventDefault();e.stopImmediatePropagation();ensureQ(ac.dataset.qtype)[+ac.dataset.qindex]='active';questView(ac.dataset.qtype,+ac.dataset.qindex)}let co=e.target.closest('[data-long-complete]');if(co){e.preventDefault();e.stopImmediatePropagation();ensureQ(co.dataset.qtype)[+co.dataset.qindex]='complete';questView(co.dataset.qtype,+co.dataset.qindex)}let nx=e.target.closest('[data-long-next]');if(nx){e.preventDefault();e.stopImmediatePropagation();questView(nx.dataset.qtype,+nx.dataset.qindex)}},true);
 document.addEventListener('click',e=>{if(e.target.closest('[data-facility]'))setTimeout(()=>{let p=panel();if(p&&state._building==='home')p.querySelector('[data-compact-action="quest"]')?.remove()},300)},true);
 window.openHouseCodex=codex;
})();

(()=>{
 const negative=['Burning','Soaked'];let lastEnemy='';
 window.floatHealNumber=function(target,amount){if(!target||!amount)return;const field=document.querySelector('#combat .battle-field');if(!field)return;const n=document.createElement('div');n.className='damage-number heal-number';n.textContent='+'+amount;const tr=target.getBoundingClientRect(),fr=field.getBoundingClientRect();n.style.left=(tr.left-fr.left+tr.width*.5)+'px';n.style.top=(tr.top-fr.top+tr.height*.18)+'px';field.appendChild(n);setTimeout(()=>n.remove(),900)};
 function setup(){const foe=$('#combat .battle-foe-card'),player=$('#combat .battle-player-card');if(!foe||!player||!combat)return;const mount=(card,isPlayer)=>{let n=card.querySelector('.target-status');if(!n){n=document.createElement('div');n.className='target-status';card.appendChild(n)}const mana=isPlayer?card.querySelector('.mana-bar:not([hidden])'):null,anchor=mana||card.querySelector('.hp');if(anchor&&n.previousElementSibling!==anchor)anchor.after(n)};mount(foe,false);mount(player,true);if(lastEnemy!==combat.enemy){lastEnemy=combat.enemy}}
 function render(){if(!$('#combat')?.classList.contains('active')||!combat)return;setup();const tag=a=>a.map(x=>`<span class="status-tag ${statusSlug(x)}">${x}</span>`).join('');$('#combat .battle-foe-card .target-status').innerHTML=tag(combat.targetStatuses||[]);$('#combat .battle-player-card .target-status').innerHTML=tag(combat.playerStatuses||[])}
 function effect(){if(!combat||combat.enemyHp<=0||combat._magicEffectLock)return;combat._magicEffectLock=true;state.meta.statuses=(state.meta.statuses||[]).filter(x=>x!=='Burning'&&x!=='Soaked');const a=state.affinity||'water';combat.targetStatuses=combat.targetStatuses||[];combat.playerStatuses=combat.playerStatuses||[];if(a==='fire'){if(!combat.targetStatuses.includes('Burning'))combat.targetStatuses.push('Burning');combat.targetStatusTurns=combat.targetStatusTurns||{};combat.targetStatusTurns.Burning=3;combat.burningTurns=3;combat.burningDamage=Math.max(2,Math.round((combat.lastMagicHitDamage||activeClassStats().damage+(state.weaponLevel||0)*2)*.25));$('#battleDetail').textContent+=' Burning applied; it will tick at the start of the enemy turn.'}else if(a==='water'){combat.targetStatuses=['Soaked'];combat.soakedTurns=2;combat._soakJustApplied=true;$('#battleDetail').textContent+=' Soaked applied: enemy attacks are weakened and your next two attacks are buffed.'}else if(a==='light'){const magicPower=activeClassStats().damage+(state.weaponLevel||0)*2;let h=Math.max(1,Math.round(magicPower*.5));if(combatHasStatus('Cursed'))h=Math.max(1,Math.floor(h*.5));if(Number(state.armorSets?.[state.gender])===5)h+=2;combat.playerHp=Math.min(state.maxHp,combat.playerHp+h);state.hp=combat.playerHp;if(!combat.playerStatuses.includes('Blessed'))combat.playerStatuses.push('Blessed');$('#battleDetail').textContent+=` Light restores ${h} HP.`;window.floatHealNumber?.($('#playerArt'),h);updateBars()}render();setTimeout(()=>{combat._magicEffectLock=false},140)}
 function afterMagic(before){setTimeout(()=>{if(combat&&typeof before==='number'&&combat.enemyHp<before)effect()},45)}
 const oldPlay=window.playCard; if(oldPlay&&!oldPlay.__magicRestored){const wrapped=function(card){let before=combat?.enemyHp;oldPlay(card);if(card==='magic')afterMagic(before)};wrapped.__magicRestored=true;window.playCard=wrapped}
 document.addEventListener('click',e=>{const b=e.target.closest('#combat .card[data-card="magic"]');if(!b||!$('#combat')?.classList.contains('active')||state.gear!=='magic')return;let before=combat?.enemyHp;afterMagic(before)},true);
 // Consume Soaked only on the next two damaging turns, not on the application turn.
 document.addEventListener('click',e=>{const b=e.target.closest('#combat .card');if(!b||!$('#combat')?.classList.contains('active'))return;let before=combat?.enemyHp;setTimeout(()=>{if(!combat||typeof before!=='number'||combat.enemyHp>=before||!combat.soakedTurns)return;if(combat._soakJustApplied){combat._soakJustApplied=false;return}combat.soakedTurns--;if(combat.soakedTurns<=0)combat.targetStatuses=(combat.targetStatuses||[]).filter(x=>x!=='Soaked');render()},80)},true);
 setInterval(render,120);
})();

(()=>{
 const bleedImmune=new Set(['Zombie Wolf','Monarch Lucien']);
 function refreshStatus(){if(!$('#combat')?.classList.contains('active')||!combat)return;const foe=$('#combat .battle-foe-card'),player=$('#combat .battle-player-card');if(!foe||!player)return;const mount=(card,isPlayer)=>{let n=card.querySelector('.target-status');if(!n){n=document.createElement('div');n.className='target-status';card.appendChild(n)}const mana=isPlayer?card.querySelector('.mana-bar:not([hidden])'):null,anchor=mana||card.querySelector('.hp');if(anchor&&n.previousElementSibling!==anchor)anchor.after(n);return n};const foeStatus=mount(foe,false),playerStatus=mount(player,true);const tags=a=>(a||[]).map(x=>`<span class="status-tag ${statusSlug(x)}">${x}</span>`).join('');foeStatus.innerHTML=tags(combat.targetStatuses);playerStatus.innerHTML=tags(combat.playerStatuses)}
 window.refreshCombatStatusUI=refreshStatus;
 window.bloodDropEffect=function(target){const field=$('#combat .battle-field');if(!field||!target)return;const tr=target.getBoundingClientRect(),fr=field.getBoundingClientRect();for(let i=0;i<4;i++){const n=document.createElement('span');n.className='blood-drop-effect';n.textContent='●';n.style.left=(tr.left-fr.left+tr.width*(.35+Math.random()*.3))+'px';n.style.top=(tr.top-fr.top+tr.height*(.38+Math.random()*.2))+'px';n.style.setProperty('--dx',(Math.random()*54-27)+'px');n.style.setProperty('--dy',(18+Math.random()*48)+'px');n.style.animationDelay=(i*.04)+'s';field.appendChild(n);setTimeout(()=>n.remove(),950)}};
 window.applyBleeding=function(hitDamage){if(!combat||combat.enemyHp<=0)return;combat.bleedingDamage=Math.max(2,Math.round((Number(hitDamage)||activeClassStats().damage+(state.weaponLevel||0)*2)*.2));combat.targetStatuses=combat.targetStatuses||[];combat.targetStatuses= combat.targetStatuses.filter(x=>x!=='Bleeding');combat.targetStatuses.push('Bleeding');combat.bleedingTurns=2;combat.bleedingSource=state.gear;refreshStatus();$('#battleDetail').textContent+=' Bleeding applied for 2 enemy turns.';window.bloodDropEffect?.($('#enemyArt'))};
 window.applyBleedingTurn=function(){if(!combat||combat.enemyHp<=0||!combat.targetStatuses?.includes('Bleeding')||Number(combat.bleedingTurns||0)<=0)return false;const d=Math.min(Number(combat.bleedingDamage)||Math.max(2,Math.round((activeClassStats().damage+(state.weaponLevel||0)*2)*.2)),Math.max(0,combat.enemyHp));combat.enemyHp=Math.max(0,combat.enemyHp-d);combat.bleedingTurns=Math.max(0,Number(combat.bleedingTurns)-1);if(combat.bleedingTurns<=0)combat.targetStatuses=combat.targetStatuses.filter(x=>x!=='Bleeding');updateBars();window.floatDamageNumber?.($('#enemyArt'),d,{status:'Bleeding'});$('#battleDetail').textContent=`Bleeding deals ${d} damage.`;refreshStatus();if(combat.enemyHp<=0){actionBusy=false;combat._defeatQueued=true;const done=()=>victory();window.battleNotice?window.battleNotice('Enemy defeated','Bleeding finishes the enemy.').then(done):done();return true}return false};
 setInterval(refreshStatus,120);
})();

/* Final facility router: each building owns one fixed menu and one fixed action set. */
(()=>{
  const TYPES=new Set(['cathedral','blacksmith','merchant','home']);
  const PEOPLE={
    cathedral:['Priest','Textures/NPCs/priest.png','The light welcomes you, child. Try not to track mud over the sanctum.'],
    blacksmith:['Blacksmith','Textures/NPCs/blacksmith.png','Need a sharper edge? I have one. It is probably haunted.'],
    merchant:['Merchant','Textures/NPCs/merchant.png','Fresh wares! Mostly fresh, anyway. The labels are optimistic.'],
    home:['Your House','','Home sweet home. It smells faintly of victory.']
  };
  const quests={
    cathedral:['The Missing Reliquary','Purify one ailment or restore your health, then return to the priest.','Blessed Charm'],
    blacksmith:['Test the Edge','Win one combat encounter, then return with the results.','Forged Edge · +2 attack-card damage'],
    merchant:['A Rare Trade','Complete one purchase or sale through the merchant.','Merchant’s Ledger · shop discount']
  };
  /* One shared quest book for every interior. The older build had two separate
     quest stores, so completed quests could disappear from the visible panel. */
  const questBook={
    cathedral:[
      ['The Missing Reliquary','Purify one ailment or restore your health, then return.','Blessed Charm'],
      ['Candle Tax','Clear two negative ailments.','8 coins + 1 potion'],
      ['Choir Practice','Win one combat encounter without Guard.','Blessed Thread · +1 max HP'],
      ['Crypt Errand','Defeat three monsters.','12 coins + 1 bone'],
      ['Bell of Bad Omens','Survive a boss encounter.','20 coins + 1 demon steel'],
      ['Saints and Sinners','Use three cathedral services.','Blessing · +2 max HP'],
      ['The Polite Exorcism','Clear Burning, Soaked, or Cursed.','Holy Seal · resistance bonus'],
      ['Pilgrim Mileage','Clear five encounters.','25 coins + 2 bones'],
      ['A Very Long Sermon','Reach the next area.','30 coins + 1 steel'],
      ['The Last Benediction','Defeat ten monsters.','Cathedral Favor · permanent blessing']
    ],
    blacksmith:[
      ['Test the Edge','Win one combat encounter.','Forged Edge · +2 attack damage'],
      ['Leather Weather','Collect five leather.','10 coins + 1 armor level'],
      ['Hammer Time','Upgrade weapon or magic once.','12 coins + 1 steel'],
      ['Armor of Regret','Upgrade armor once.','15 coins + 1 bone'],
      ['Field Testing','Win three encounters.','20 coins + 1 leather'],
      ['Boss Material','Defeat a boss.','25 coins + 2 steel'],
      ['Temper Temper','Collect three bones.','18 coins + armor resistance'],
      ['The Perfect Focus','Reach Magic Lv 2 or Weapon Lv 2.','30 coins + 1 steel'],
      ['Anvil Marathon','Win seven encounters.','35 coins + 2 leather'],
      ['Masterwork','Win ten encounters and reach Armor Lv 2.','Masterwork upgrade · +5 max HP']
    ],
    merchant:[
      ['A Rare Trade','Complete one purchase or sale.','Merchant Ledger · shop discount'],
      ['Stock Rotation','Buy two materials.','8 coins + 1 leather'],
      ['Suspiciously Legal','Sell one material.','10 coins + 1 potion'],
      ['Potion Commotion','Buy two potions or antidotes.','15 coins + 1 antidote'],
      ['Spellbook Club','Buy one spellbook as a magic player.','20 coins + 1 magic level'],
      ['Bone Market','Collect five bones.','18 coins + 1 steel'],
      ['The Big Sale','Make five trades.','25 coins + 2 leather'],
      ['Inventory Problems','Collect three demon steel.','30 coins + 1 spellbook'],
      ['Repeat Customer','Make ten trades.','40 coins + merchant favor'],
      ['Final Clearance','Make fifteen trades and defeat five monsters.','60 coins + 2 steel']
    ]
  };
  const negative=new Set(['Bleeding','Burning','Soaked','Poisoned','Cursed','Wild magic']);
  state.meta=state.meta||{}; state.meta.statuses=(state.meta.statuses||[]).filter(x=>x!=='Burning'&&x!=='Soaked');
  function ensureQuestState(type){
    state.meta=state.meta||{}; state.meta.buildingQuestState=state.meta.buildingQuestState||{};
    const current=state.meta.buildingQuestState[type];
    if(!Array.isArray(current)) state.meta.buildingQuestState[type]=Array(10).fill('available');
    while(state.meta.buildingQuestState[type].length<10) state.meta.buildingQuestState[type].push('available');
    return state.meta.buildingQuestState[type];
  }
  function questReady(type,i){
    const p=state.meta?.questProgress||{heals:0,trades:0,wins:0};
    if(type==='cathedral') return [p.heals>=1,p.heals>=2,p.wins>=1,p.wins>=3,p.wins>=5,p.heals>=3,!((state.meta.statuses||[]).some(x=>negative.has(x))),p.wins>=5,state.maxHub>=1,p.wins>=10][i];
    if(type==='blacksmith') return [p.wins>=1,(state.materials?.leather||0)>=5,(state.weaponLevel||0)>=1,(state.armorLevel||0)>=1,p.wins>=3,p.wins>=5,(state.materials?.bones||0)>=3,((state.gear==='magic'?state.magicLevel||0:state.weaponLevel||0)>=2),p.wins>=7,p.wins>=10&&(state.armorLevel||0)>=2][i];
    return [p.trades>=1,p.trades>=2,p.trades>=1,(state.meta.items?.drumstick||0)+(state.meta.items?.midPotion||0)+(state.meta.items?.highPotion||0)+(state.meta.items?.antidote||0)>=2,state.meta.spells?.heal||state.meta.spells?.purify,(state.materials?.bones||0)>=5,p.trades>=5,(state.materials?.steel||0)>=3,p.trades>=10,p.trades>=15&&p.wins>=5][i];
  }
  function bumpQuestProgress(key){
    state.meta=state.meta||{}; state.meta.questProgress=state.meta.questProgress||{heals:0,trades:0,wins:0};
    state.meta.questProgress[key]=(state.meta.questProgress[key]||0)+1;
  }
  function grantQuestReward(type,index){
    state.meta=state.meta||{}; state.meta.questRewardsClaimed=state.meta.questRewardsClaimed||{};
    const key=type+'.'+index;
    if(state.meta.questRewardsClaimed[key])return false;
    /* Preserve rewards already granted by the older contract system. */
    if(index===0 && ((type==='cathedral'&&state.meta.blessedCharm)||(type==='blacksmith'&&(state.meta.cardUpgrades?.attack||0)>=2)||(type==='merchant'&&state.meta.merchantDiscount))){state.meta.questRewardsClaimed[key]=true;return false;}
    const add=(name,n=1)=>{state[name]=(state[name]||0)+n};
    if(type==='cathedral'){
      if(index===0){state.meta.blessedCharm=true;state.meta.statuses=state.meta.statuses||[];if(!state.meta.statuses.includes('Blessed'))state.meta.statuses.push('Blessed');}
      if(index===1){add('coins',8);state.meta.items=state.meta.items||{};state.meta.items.drumstick=(state.meta.items.drumstick||0)+1;}
      if(index===2){state.maxHp+=1;state.hp=state.maxHp;}
      if(index===3){add('coins',12);state.materials.bones=(state.materials.bones||0)+1;}
      if(index===4){add('coins',20);state.materials.steel=(state.materials.steel||0)+1;}
      if(index===5){state.maxHp+=2;state.hp=state.maxHp;}
      if(index===6)state.meta.holySeal=true;
      if(index===7){add('coins',25);state.materials.bones=(state.materials.bones||0)+2;}
      if(index===8){add('coins',30);state.materials.steel=(state.materials.steel||0)+1;}
      if(index===9){add('coins',40);state.meta.cathedralFavor=true;}
    }else if(type==='blacksmith'){
      if(index===0){state.meta.cardUpgrades=state.meta.cardUpgrades||{};state.meta.cardUpgrades.attack=(state.meta.cardUpgrades.attack||0)+2;}
      if(index===1){add('coins',10);state.armorLevel=(state.armorLevel||0)+1;state.maxHp+=3;state.hp=state.maxHp;}
      if(index===2){add('coins',12);state.materials.steel=(state.materials.steel||0)+1;}
      if(index===3){add('coins',15);state.materials.bones=(state.materials.bones||0)+1;}
      if(index===4){add('coins',20);state.materials.leather=(state.materials.leather||0)+1;}
      if(index===5){add('coins',25);state.materials.steel=(state.materials.steel||0)+2;}
      if(index===6){add('coins',18);state.meta.resistance=true;}
      if(index===7){add('coins',30);state.materials.steel=(state.materials.steel||0)+1;}
      if(index===8){add('coins',35);state.materials.leather=(state.materials.leather||0)+2;}
      if(index===9){state.maxHp+=5;state.hp=state.maxHp;state.meta.masterwork=true;}
    }else if(type==='merchant'){
      state.meta.items=state.meta.items||{};state.meta.spells=state.meta.spells||{};
      if(index===0)state.meta.merchantDiscount=true;
      if(index===1){add('coins',8);state.materials.leather=(state.materials.leather||0)+1;}
      if(index===2){add('coins',10);state.meta.items.drumstick=(state.meta.items.drumstick||0)+1;}
      if(index===3){add('coins',15);state.meta.items.antidote=(state.meta.items.antidote||0)+1;}
      if(index===4){add('coins',20);state.magicLevel=(state.magicLevel||0)+1;}
      if(index===5){add('coins',18);state.materials.steel=(state.materials.steel||0)+1;}
      if(index===6){add('coins',25);state.materials.leather=(state.materials.leather||0)+2;}
      if(index===7){add('coins',30);state.meta.spells.purify=true;}
      if(index===8){add('coins',40);state.meta.merchantFavor=true;}
      if(index===9){add('coins',60);state.materials.steel=(state.materials.steel||0)+2;}
    }
    state.meta.questRewardsClaimed[key]=true;return true;
  }
  function syncQuestState(){
    state.meta=state.meta||{}; state.meta.questContracts=state.meta.questContracts||{};
    let stateChanged=false;
    ['cathedral','blacksmith','merchant'].forEach(type=>{
      const list=ensureQuestState(type), legacy=state.meta.questContracts[type];
      /* Reconcile the legacy one-quest contract with Quest 1, without
         overwriting any completed state. */
      if(legacy==='complete') list[0]='complete';
      else if(list[0]==='complete') state.meta.questContracts[type]='complete';
      else if(legacy==='active' && list[0]==='available') list[0]='active';
      else if(list[0]==='active' && !legacy) state.meta.questContracts[type]='active';
      list.forEach((status,index)=>{
        if(status==='available'){list[index]='active';stateChanged=true;}
        if(list[index]==='complete'&&grantQuestReward(type,index))stateChanged=true;
      });
      if(list[0]==='active'&&!state.meta.questContracts[type]){state.meta.questContracts[type]='active';stateChanged=true;}
    });
    if(stateChanged)saveState();
  }
  let questRenderSignature='';
  function questSignature(type){return JSON.stringify({state:ensureQuestState(type),legacy:state.meta?.questContracts?.[type],progress:state.meta?.questProgress,coins:state.coins,materials:state.materials,gear:state.gear,weaponLevel:state.weaponLevel,armorLevel:state.armorLevel,maxHub:state.maxHub,statuses:state.meta?.statuses,spells:state.meta?.spells,items:state.meta?.items});}
  function questBoard(type){
    type=valid(type); if(!questBook[type])return main(type); syncQuestState();
    const list=questBook[type], statuses=ensureQuestState(type);
    const rows=list.map((q,i)=>{
      const status=statuses[i]||'active', ready=questReady(type,i);
      const badge=status==='complete'?'<span class="quest-status quest-status-complete">COMPLETED</span>':ready?'<span class="quest-status quest-status-ready">READY TO TURN IN</span>':'<span class="quest-status quest-status-active">ACTIVE</span>';
      const action=status==='active'&&ready?button('quest-complete','Complete Quest',`data-fixed-index="${i}"`):'';
      return `<article class="fixed-quest-row ${status}"><div><h3>${i+1}. ${safe(q[0])}</h3><p>${safe(q[1])}<br><b>Reward:</b> ${safe(q[2])}</p></div><div class="fixed-quest-meta">${badge}${action}</div></article>`;
    }).join('');
    setPanel(type,'quest',`<h2>${PEOPLE[type][0]} · Quest Board</h2><p class="compact-copy">Quest status is synced across this interior and your save in real time.</p><div class="fixed-quest-board">${rows}</div><div class="compact-options">${button('back','Back')}</div>`);
    questRenderSignature=questSignature(type);
  }
  let openToken=0;
  const valid=t=>TYPES.has(t)?t:'home';
  const panel=()=>document.querySelector('#interiorContent');
  const safe=(v)=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const button=(action,label,extra='')=>`<button type="button" data-fixed-action="${action}" ${extra}>${label}</button>`;
  function stats(type){
    let html=`<div class="compact-stats">Coins: ◈ ${state.coins} &nbsp;·&nbsp; HP: ❤ ${state.hp}/${state.maxHp}</div>`;
    if(type==='blacksmith') html+=`<div class="compact-materials"><span>Leather: ${state.materials?.leather||0}</span><span>Bones: ${state.materials?.bones||0}</span><span>Demon steel: ${state.materials?.steel||0}</span><span>${state.gear==='magic'?'Magic':'Weapon'} Lv: ${state.gear==='magic'?state.magicLevel||0:state.weaponLevel||0}</span><span>Armor Lv: ${state.armorLevel||0}</span></div>`;
    return html;
  }
  function setPanel(type,view,html){
    const p=panel(); if(!p)return;
    p.dataset.fixedFacility=type;
    p.dataset.fixedView=view;
    p.dataset.compact=view==='intro'?'talk':view;
    p.innerHTML=html;
  }
  function main(type){
    type=valid(type); state._building=type;
    const title=PEOPLE[type][0];
    let menu='';
    if(type==='cathedral') menu=[button('talk','Talk'),button('service','Service'),button('quest','Quest'),button('leave','Leave')].join('');
    if(type==='merchant') menu=[button('talk','Talk'),button('shop','Shop'),button('quest','Quest'),button('leave','Leave')].join('');
    if(type==='blacksmith') menu=[button('talk','Talk'),button('upgrade',state.gear==='magic'?'Upgrade Magic':'Upgrade Weapon'),button('armor','Upgrade Armor'),button('quest','Quest'),button('leave','Leave')].join('');
    if(type==='home') menu=[button('rest','Rest'),button('armor','Armor Set'),button('codex','Check Codex'),button('settings','Settings'),button('leave','Leave')].join('');
    setPanel(type,'main',`<h2>${title}</h2>${stats(type)}<div class="compact-menu">${menu}</div>`);
  }
  function sub(type,view){
    type=valid(type); state._building=type;
    const title=PEOPLE[type][0]; let body='';
    if(view==='talk') { const line=type==='home'?PEOPLE[type][2]:(window.chooseInteriorDialogue?.(type)||PEOPLE[type][2]); body=`<h2>${title}</h2><p class="compact-copy">${safe(line)}</p><div class="compact-options">${button('back','Back')}</div>`; }
    if(view==='service' && type==='cathedral') body=`<h2>Cathedral Service</h2>${stats(type)}<div class="compact-options">${button('heal','Restore full HP · 8 coins')}${button('pray','Pray · restore 4 HP')}${button('purify','Purify ailments · 6 coins')}${button('bless','Receive blessing · 10 coins')}${button('back','Back')}</div>`;
    if(view==='shop' && type==='merchant') { ensureCombatResources(); const spells=state.meta?.spells||{},magic=state.gear==='magic',goods=magic?button('buy-heal',spells.heal?'Healing Spellbook · OBTAINED':'Healing Spellbook · 14 coins',spells.heal?'disabled aria-disabled="true"':'')+button('buy-purify',spells.purify?'Purify Spellbook · OBTAINED':'Purify Spellbook · 18 coins',spells.purify?'disabled aria-disabled="true"':''):button('buy-drumstick','Drumstick · 8 coins')+button('buy-mid-potion','Mid Potion · 16 coins')+button('buy-high-potion','High Potion · 25 coins')+button('buy-antidote','Antidote · 8 coins')+button('buy-cursebreaker','Cursebreaker · 10 coins'); body=`<h2>Merchant Shop</h2>${stats(type)}<p class="compact-copy">${magic?'Spellbooks are for magic users only.':'Consumables are for weapon users only and can be purchased repeatedly.'}</p><div class="compact-options">${goods}${button('buy-leather','Leather · 5 coins')}${button('buy-bones','Bones · 7 coins')}${button('buy-steel','Demon steel · 12 coins')}${button('back','Back')}</div>`; }
    if(view==='upgrade' && type==='blacksmith') { const magic=state.gear==='magic', level=magic?(state.magicLevel||0):(state.weaponLevel||0), material=magic?'demon steel':'leather'; body=`<h2>${magic?'Upgrade Magic':'Upgrade Weapon'}</h2>${stats(type)}<p class="compact-copy">${magic?'Magic':'Weapon'} level ${level} → ${level+1}. Cost: ${12+level*8} coins + 1 ${material}.</p><div class="compact-options">${button('do-upgrade',magic?'Upgrade Magic':'Upgrade Weapon')}${button('back','Back')}</div>`; }
    if(view==='armor' && type==='blacksmith') body=`<h2>Upgrade Armor</h2>${stats(type)}<p class="compact-copy">Armor level ${state.armorLevel||0} → ${(state.armorLevel||0)+1}. Cost: 8 coins + 1 bone. Max HP +3.</p><div class="compact-options">${button('do-armor','Upgrade Armor')}${button('back','Back')}</div>`;
    if(view==='rest' && type==='home') body=`<h2>Rest</h2><p class="compact-copy">Restore HP and clear negative ailments.</p><div class="compact-options">${button('do-rest','Rest and recover')}${button('back','Back')}</div>`;
    if(view==='settings' && type==='home') { const speed=state.combatSpeed||'normal'; body=`<h2>Settings</h2><p class="compact-copy">Combat text speed</p><div class="compact-options combat-speed-options">${['slow','normal','fast'].map(v=>button('set-speed',v[0].toUpperCase()+v.slice(1),`data-combat-speed="${v}" ${speed===v?'class=\"selected\"':''}`)).join('')}${button('back','Back')}</div>`; }
    if(view==='armor' && type==='home') { const unlocked=(state.unlockedArmor?.[state.gender]||[0]).slice().sort((a,b)=>a-b),names=ARMOR_NAMES; body=`<h2>Armor Set</h2><div class="compact-armor-grid">${unlocked.map(i=>`<button type="button" data-fixed-equip="${i}" class="${(state.armorSets?.[state.gender]||0)===i?'equipped':''}"><b>${safe(names[i]||`Armor Set ${i+1}`)}</b><small>${(state.armorSets?.[state.gender]||0)===i?'EQUIPPED':'Wear set'}</small></button>`).join('')}</div><div class="compact-options">${button('back','Back')}</div>`; }
    if(view==='quest' && quests[type]) { questBoard(type); return; }
    if(!body) return main(type);
    setPanel(type,view,body);
  }
  function notice(msg){ if(window.dialogNotice) window.dialogNotice(msg); else alert(msg); }
  function saveState(){ try{ if(typeof save==='function') save(); }catch(e){} }
  function leave(){ show('village'); renderVillage?.(); }
  function open(type){
    type=valid(type); state._building=type; ++openToken;
    const token=openToken, screen=document.querySelector('#interior'), person=PEOPLE[type];
    if(screen) screen.dataset.facilityType=type;
    const character=document.querySelector('#interiorCharacter');
    if(character){character.hidden=true;character.removeAttribute('src');character.dataset.houseArmorKey='';}
    const fade=document.querySelector('#fadeTransition'); fade?.classList.add('active');
    setTimeout(()=>{
      if(token!==openToken)return;
      const dayBackground=BUILDING_BACKGROUNDS[type]||BUILDING_BACKGROUNDS.home;
      const nightVisible=(window.gameClock?.getState?.()?.nightBlend||0)>0;
      const personArt=type==='home'?(Number(state.hp)<=Math.max(1,Number(state.maxHp||1)*.25)?combatArmorSources().damaged:combatArmorSources().normal):person[1];
      const ready=Promise.all([nightVisible?window.prepareDayNightScene?.(dayBackground):window.ensureSceneImage?.(dayBackground),window.ensureSceneImage?.(personArt)]);
      ready.then(async()=>{
        if(token!==openToken)return;
        document.querySelector('#interiorTitle').textContent=person[0];
        const image=document.querySelector('#interiorImage'); if(image) image.src=dayBackground;
        if(character){character.onerror=null;character.src=personArt;try{await character.decode()}catch(_){}if(token!==openToken)return;character.hidden=false;}
        const backdrop=document.querySelector('.interior-backdrop'); if(backdrop) backdrop.style.backgroundImage=`linear-gradient(rgba(18,13,24,.12),rgba(18,13,24,.28)),url("${dayBackground}")`;
        const revivalLine=type==='cathedral'?window.__cathedralRespawnLine:null;
        const introLine=revivalLine||person[2];
        window.__cathedralRespawnLine=null;
        setPanel(type,'intro',`<div class="dialog-character"><div><h2>${person[0]}</h2><p>${safe(introLine)}</p></div></div><div class="dialog-buttons">${button('continue','Continue')}</div>`);
        window.applyDayNightNow?.();
        show('interior');
        refreshHouseCharacter();
        window.applyDayNightNow?.();
        requestAnimationFrame(()=>requestAnimationFrame(()=>fade?.classList.remove('active')));
      }).catch(()=>{if(token===openToken){fade?.classList.remove('active');show('village')}});
    },340);
  }
  setInterval(refreshHouseCharacter,150);
  window.openFacility=open;
  window.closeFacility=leave;
  document.querySelector('#backToVillage')?.addEventListener('click',e=>{e.stopImmediatePropagation();leave();},true);
  function installBuildingButtons(){
    document.querySelectorAll('.building[data-facility]').forEach(old=>{
      if(old.dataset.fixedFacilityButton)return;
      const b=old.cloneNode(true),type=valid(old.dataset.facility);
      b.dataset.fixedFacilityButton='1'; b.dataset.fixedFacility=type; b.removeAttribute('data-facility');
      b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();open(type);},false);
      old.replaceWith(b);
    });
  }
  installBuildingButtons();
  document.addEventListener('click',e=>{
    const b=e.target.closest('[data-fixed-action]');
    if(b && document.querySelector('#interior')?.classList.contains('active')){
      e.preventDefault(); e.stopImmediatePropagation();
      const type=valid(state._building), action=b.dataset.fixedAction;
      if(action==='continue'){main(type);return;}
      if(action==='back'){main(type);return;}
      if(action==='leave'){leave();return;}
      if(action==='talk'){sub(type,'talk');return;}
      if(action==='service'&&type==='cathedral'){sub(type,'service');return;}
      if(action==='shop'&&type==='merchant'){sub(type,'shop');return;}
      if(action==='upgrade'&&type==='blacksmith'){sub(type,'upgrade');return;}
      if(action==='armor'){sub(type,type==='home'?'armor':'armor');return;}
      if(action==='rest'&&type==='home'){sub(type,'rest');return;}
      if(action==='settings'&&type==='home'){sub(type,'settings');return;}
      if(action==='set-speed'&&type==='home'){const speed=b.dataset.combatSpeed;if(['slow','normal','fast'].includes(speed)){state.combatSpeed=speed;saveState();}sub(type,'settings');return;}
      if(action==='codex'&&type==='home'){(window.openCodex||window.openHouseCodex)?.('Monsters',0);return;}
      if(action==='quest'&&quests[type]){questBoard(type);return;}
      if(action==='do-rest'&&type==='home'){state.hp=state.maxHp;state.meta.statuses=(state.meta.statuses||[]).filter(x=>!negative.has(x));saveState();notice('You rest and recover.');sub(type,'rest');return;}
      if(action==='heal'&&type==='cathedral'){if(state.coins>=8){state.coins-=8;state.hp=state.maxHp;bumpQuestProgress('heals');saveState();notice('Your health is restored.')}else notice('Not enough coins.');sub(type,'service');return;}
      if(action==='pray'&&type==='cathedral'){state.hp=Math.min(state.maxHp,state.hp+4);bumpQuestProgress('heals');saveState();notice('A small blessing settles over you.');sub(type,'service');return;}
      if(action==='purify'&&type==='cathedral'){if(state.coins>=6){state.coins-=6;state.meta.statuses=(state.meta.statuses||[]).filter(x=>!negative.has(x));bumpQuestProgress('heals');saveState();notice('Ailments purified.')}else notice('Purification costs 6 coins.');sub(type,'service');return;}
      if(action==='bless'&&type==='cathedral'){if(state.coins>=10){state.coins-=10;state.meta.statuses=state.meta.statuses||[];if(!state.meta.statuses.includes('Blessed'))state.meta.statuses.push('Blessed');saveState();notice('You receive a blessing.')}else notice('The cathedral requests 10 coins.');sub(type,'service');return;}
      if(action==='do-upgrade'&&type==='blacksmith'){const magic=state.gear==='magic',level=magic?(state.magicLevel||0):(state.weaponLevel||0),cost=12+level*8,material=magic?'steel':'leather';if(state.coins>=cost&&(state.materials?.[material]||0)>=1){state.coins-=cost;state.materials[material]--;if(magic)state.magicLevel=level+1;else state.weaponLevel=level+1;saveState();notice(`${magic?'Magic focus':'Weapon'} upgraded.`)}else notice(`Not enough coins or ${magic?'demon steel':'leather'}.`);sub(type,'upgrade');return;}
      if(action==='do-armor'&&type==='blacksmith'){if(state.coins>=8&&(state.materials?.bones||0)>=1){state.coins-=8;state.materials.bones--;state.armorLevel++;state.maxHp+=3;state.hp=state.maxHp;saveState();notice('Your armor is reinforced.')}else notice('Not enough coins or bones.');sub(type,'armor');return;}
      if(action.startsWith('buy-')&&type==='merchant'){ensureCombatResources();const prices={'buy-drumstick':8,'buy-mid-potion':16,'buy-high-potion':25,'buy-antidote':8,'buy-cursebreaker':10,'buy-heal':14,'buy-purify':18,'buy-leather':5,'buy-bones':7,'buy-steel':12},key=action.slice(4),magic=state.gear==='magic',itemKey={'drumstick':'drumstick','mid-potion':'midPotion','high-potion':'highPotion','antidote':'antidote','cursebreaker':'cursebreaker'}[key];if((['heal','purify'].includes(key)&&!magic)||(['drumstick','mid-potion','high-potion','antidote','cursebreaker'].includes(key)&&magic)){notice('That stock is only available to the other class.');sub(type,'shop');return;}if((key==='heal'&&state.meta.spells.heal)||(key==='purify'&&state.meta.spells.purify)){notice('That spellbook is already obtained.');sub(type,'shop');return;}if(state.coins>=prices[action]){state.coins-=prices[action];if(itemKey)state.meta.items[itemKey]++;if(key==='heal')state.meta.spells.heal=true;if(key==='purify')state.meta.spells.purify=true;if(['leather','bones','steel'].includes(key))state.materials[key]=(state.materials[key]||0)+1;bumpQuestProgress('trades');saveState();notice('Purchase complete.')}else notice('Not enough coins.');sub(type,'shop');return;}
      if(action==='quest-complete'&&quests[type]){
        const index=Number(b.dataset.fixedIndex),list=ensureQuestState(type),q=questBook[type]?.[index];
        if(!q||!Number.isInteger(index))return;
        if(action==='quest-complete' && list[index]==='active' && questReady(type,index)){
          list[index]='complete'; const rewarded=grantQuestReward(type,index); state.meta.quest=`${q[0]} completed. Reward received: ${q[2]}`;
          if(index===0){state.meta.questContracts=state.meta.questContracts||{};state.meta.questContracts[type]='complete';}
          saveState(); notice(`Quest complete: ${q[0]}.${rewarded?' Reward granted.':''}`); questBoard(type); return;
        }
        questBoard(type); return;
      }
    }
    const equip=e.target.closest('[data-fixed-equip]');
    if(equip && document.querySelector('#interior')?.classList.contains('active') && state._building==='home'){e.preventDefault();e.stopImmediatePropagation();state.armorSets[state.gender]=+equip.dataset.fixedEquip;saveState();sub('home','armor');}
  },true);
  // Repair only the main menu if an older patch writes a generic Shop/Quest menu.
  setInterval(()=>{
    installBuildingButtons();
    /* Reconcile even after combat returns the player to the map. */
    syncQuestState();
    const screen=document.querySelector('#interior'),p=panel();
    if(!screen?.classList.contains('active')||!p)return;
    const type=valid(state._building);
    /* Reconcile quest progress even while the player is on Service, Shop, or
       another interior panel, not only while the quest board is visible. */
    if(screen.dataset.facilityType!==type){screen.dataset.facilityType=type;main(type);return;}
    if(p.dataset.fixedView==='main' && p.dataset.fixedFacility!==type)main(type);
    if(p.dataset.compact==='main' && p.dataset.fixedView!=='main')main(type);
    if(p.dataset.fixedView==='quest'){
      syncQuestState();
      const next=questSignature(type);
      if(next!==questRenderSignature)questBoard(type);
    }
  },120);
})();

(()=>{
  document.querySelector('#battleNotice')?.remove();
  let noticeQueue=Promise.resolve();
  const combatSpeedScale=()=>state.combatSpeed==='slow'?1.3:state.combatSpeed==='fast'?.7:1;
  const combatNoticeDuration=(title,body)=>{const text=`${title||''} ${body||''}`.toLowerCase();const base=/(defeated|finishes|critical hit|you died)/.test(text)?1300:850;return Math.round(base*combatSpeedScale())};
  window.battleNotice=(title,body)=>{
    const show=()=>new Promise(resolve=>{
      if(!$('#combat')?.classList.contains('active')){resolve();return}
      const prompt=$('#battlePrompt'),detail=$('#battleDetail');
      if(prompt)prompt.textContent=title;
      if(detail){detail.classList.remove('combat-resisted','combat-weak','combat-blocked');detail.textContent=body}
      window.__battleNoticeOpen=true;
      let done=false,timer;
      const finish=()=>{if(done)return;done=true;clearTimeout(timer);window.__battleNoticeOpen=false;resolve()};
      timer=setTimeout(finish,combatNoticeDuration(title,body));
    });
    const next=noticeQueue.then(show);noticeQueue=next.catch(()=>{});return next;
  };
  const negative=['Bleeding','Burning','Soaked','Poisoned','Cursed','Weakened','Confused','Armor Break','Wild magic'];
  function canAct(){return $('#combat')?.classList.contains('active')&&!window.__battleNoticeOpen&&!window.__combatEnemyTurn&&typeof combat!=='undefined'&&!combat.turnActionUsed}
  function finishConsumableNotice(body,title){window.battleNotice(title||`${state.playerName} used an item!`,body).then(()=>window.__battleEnemyCounter?.())}
  const SPELL_FX_TEXTURES={heal:'Textures/UI/Combat/heal-spell-effect.png',purify:'Textures/UI/Combat/purify-spell-effect.png'};
  Object.values(SPELL_FX_TEXTURES).forEach(src=>{const img=new Image();img.src=src});
  window.showCombatSpellEffect=function(spell){
    const field=document.querySelector('#combat .battle-field');
    const anchor=document.querySelector('#playerArt');
    const src=SPELL_FX_TEXTURES[spell];
    if(!field||!anchor||!src)return Promise.resolve();
    if(!document.querySelector('#spell-effect-style')){
      const style=document.createElement('style');
      style.id='spell-effect-style';
      style.textContent=`.spell-cast-overlay{position:absolute;left:0;top:0;width:0;height:0;pointer-events:none;z-index:9}.spell-cast-overlay .spell-cast-image{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) scale(.42);transform-origin:center center;opacity:0;filter:drop-shadow(0 0 14px rgba(255,255,255,.22)) drop-shadow(0 0 28px rgba(120,220,255,.15));animation:spellCastBloom .82s ease-out forwards;will-change:transform,opacity}.spell-cast-overlay.spell-heal .spell-cast-image{width:min(220px,32vw);filter:drop-shadow(0 0 14px rgba(255,247,181,.42)) drop-shadow(0 0 36px rgba(118,255,126,.28))}.spell-cast-overlay.spell-purify .spell-cast-image{width:min(236px,34vw);filter:drop-shadow(0 0 14px rgba(221,236,255,.55)) drop-shadow(0 0 36px rgba(154,192,255,.35))}.spell-cast-overlay .spell-cast-ripple{position:absolute;left:50%;top:50%;width:42px;height:42px;border-radius:50%;transform:translate(-50%,-50%) scale(.4);opacity:0;border:3px solid rgba(255,255,255,.88);animation:spellCastRipple .72s ease-out forwards}.spell-cast-overlay.spell-heal .spell-cast-ripple{border-color:rgba(189,255,178,.96);box-shadow:0 0 0 4px rgba(255,230,120,.12)}.spell-cast-overlay.spell-purify .spell-cast-ripple{border-color:rgba(195,225,255,.98);box-shadow:0 0 0 4px rgba(179,171,255,.14)}@keyframes spellCastBloom{0%{transform:translate(-50%,-50%) scale(.28);opacity:0}20%{opacity:1}55%{transform:translate(-50%,-50%) scale(.98);opacity:1}100%{transform:translate(-50%,-50%) scale(1.12);opacity:0}}@keyframes spellCastRipple{0%{transform:translate(-50%,-50%) scale(.35);opacity:.95}100%{transform:translate(-50%,-50%) scale(5.3);opacity:0}}`;
      document.head.appendChild(style);
    }
    const fr=field.getBoundingClientRect(),ar=anchor.getBoundingClientRect();
    const fx=document.createElement('div');
    fx.className=`spell-cast-overlay spell-${spell}`;
    fx.style.left=(ar.left-fr.left+ar.width*.5)+'px';
    fx.style.top=(ar.top-fr.top+ar.height*.44)+'px';
    const ripple=document.createElement('span');
    ripple.className='spell-cast-ripple';
    const img=document.createElement('img');
    img.className='spell-cast-image';
    img.src=src;
    img.alt='';
    fx.appendChild(ripple);
    fx.appendChild(img);
    field.appendChild(fx);
    setTimeout(()=>fx.remove(),860);
    return new Promise(resolve=>setTimeout(resolve,520));
  }
  window.battleUseConsumable=(kind)=>{if(!canAct())return;ensureCombatResources();const items=state.meta.items;let body='',heal=0;if(['drumstick','midPotion','highPotion'].includes(kind)){const defs={drumstick:[6,'Drumstick'],midPotion:[12,'Mid Potion'],highPotion:[20,'High Potion']},def=defs[kind];if(!def||items[kind]<=0){window.battleNotice('Empty item pouch','The weapon kit has no supplies of that type.');return}items[kind]--;combat.healingItemUsed=true;heal=(combatHasStatus('Cursed')?Math.max(1,Math.floor(def[0]/2)):def[0])+(Number(state.armorSets?.[state.gender])===5?2:0);state.hp=Math.min(state.maxHp,state.hp+heal);combat.playerHp=state.hp;body=`${def[1]} restored ${heal} HP${combatHasStatus('Cursed')?' through the curse':''}.`}else if(kind==='antidote'){if(items.antidote<=0){window.battleNotice('No Antidote','The pouch has no Antidote left.');return}items.antidote--;clearCombatDebuffs(['Poisoned','Weakened','Confused']);state.meta.statuses=(state.meta.statuses||[]).filter(x=>!negative.includes(x));body='Antidote cleared Poisoned, Weakened, and Confused.'}else if(kind==='cursebreaker'){if(items.cursebreaker<=0){window.battleNotice('No Cursebreaker','The pouch has no Cursebreaker left.');return}items.cursebreaker--;clearCombatDebuffs(['Cursed','Armor Break']);body='Cursebreaker cleared Cursed and Armor Break.'}else{return}combat.turnActionUsed=true;actionBusy=true;updateBars();save();finishConsumableNotice(body,`${state.playerName} used an item!`)};
  window.battleUseSpell=(spell)=>{if(!canAct())return;state.meta.spells=state.meta.spells||{};if(!state.meta.spells[spell])return;const cost=3;if((combat.playerMana||0)<cost){window.battleNotice?.('Not enough mana','Guard to recover 2 mana before casting this spell.');return}combat.playerMana=Math.max(0,(combat.playerMana||0)-cost);window.showCombatSpellEffect?.(spell);let body='';if(spell==='heal'){const heal=(combatHasStatus('Cursed')?6:12)+(Number(state.armorSets?.[state.gender])===5?2:0);state.hp=Math.min(state.maxHp,state.hp+heal);combat.playerHp=state.hp;body=`Healing Spell restored ${heal} HP${combatHasStatus('Cursed')?' through the curse':''}. Mana -${cost}.`;window.floatHealNumber?.($('#playerArt'),heal);window.floatCombatText?.($('#playerArt'),'HEAL',{status:true})}else if(spell==='purify'){const hadNegative=(state.meta.statuses||[]).some(x=>negative.includes(x))||['Poisoned','Weakened','Confused','Cursed','Armor Break'].some(x=>(combat.playerStatuses||[]).includes(x));state.meta.statuses=(state.meta.statuses||[]).filter(x=>!negative.includes(x));clearCombatDebuffs();body=`Purify Spell cleared negative ailments. Mana -${cost}.`;window.floatCombatText?.($('#playerArt'),hadNegative?'PURIFY':'CLEAR',{status:true})}else return;combat.turnActionUsed=true;actionBusy=true;updateBars();save();finishConsumableNotice(body,`${state.playerName} cast a spell!`)};
  window.battleRefreshIntent=()=>{};
})();

(()=>{
  window.openBattleReward=function(title,boss){
    const e=state.meta=state.meta||{};e.battleWonPending=false;
    const multiplier=window.villageRaid?.active?2:1,coins=Math.ceil((8+(state.hub||0)*3+(boss?10:0))*multiplier*(Number(state.armorSets?.[state.gender])===7?1.2:1)),drop=window.battleDropInfo(combat?.enemy,boss),dropAmount=Math.ceil(drop.amount*multiplier*(drop.key==='coins'&&Number(state.armorSets?.[state.gender])===7?1.2:1));
    let claimed=false;const damageCount=e.damageRewardCount||0,damageCap=8,damageReady=damageCount<damageCap,damageGain=Math.min(multiplier,damageCap-damageCount),armorGain=3*multiplier;
    const dropLabel=drop.drop==='Coins'?`Scrounge +${dropAmount} coins`:`Scrounge +${dropAmount} ${drop.drop.toLowerCase()}`;
    const card=$('#rewardCard');
    card.innerHTML=`<div class="reward-heading"><div><span class="reward-eyebrow">Choose one reward</span><h2>${title} <span>· ${esc(combat?.enemy||'Enemy')}</span></h2></div></div><div class="reward-choice-grid"><button class="reward-choice" data-reward="damage"><span class="reward-icon" aria-hidden="true">⚔</span><span class="reward-copy"><b>${damageReady?`Increase attack power +${damageGain}`:`Take ${12*multiplier} coins`}</b><small>${damageReady?`${damageCount}/${damageCap} damage upgrades used this run.`:'Damage upgrade limit reached.'}</small></span><span class="reward-arrow" aria-hidden="true">›</span></button><button class="reward-choice" data-reward="armor"><span class="reward-icon" aria-hidden="true">◇</span><span class="reward-copy"><b>Increase armor durability</b><small>+${armorGain} maximum HP and repair your current HP.</small></span><span class="reward-arrow" aria-hidden="true">›</span></button><button class="reward-choice" data-reward="scrounge"><span class="reward-icon" aria-hidden="true">▣</span><span class="reward-copy"><b>${dropLabel}</b><small>Search the defeated enemy for supplies.</small></span><span class="reward-arrow" aria-hidden="true">›</span></button><button class="reward-choice" data-reward="coins"><span class="reward-icon" aria-hidden="true">◈</span><span class="reward-copy"><b>Loot ${coins} coins</b><small>Take the coins now.</small></span><span class="reward-arrow" aria-hidden="true">›</span></button></div><div class="reward-drop-note">Drop: <b>${esc(drop.drop)}</b></div>`;
    $('#rewardOverlay').classList.add('open');
    card.querySelectorAll('[data-reward]').forEach(button=>button.onclick=()=>{
      if(claimed)return;claimed=true;
      const choice=button.dataset.reward;let msg='';
      if(choice==='damage'&&damageReady){state.weaponLevel=(state.weaponLevel||0)+damageGain;e.damageRewardCount=damageCount+damageGain;msg=`Attack power increased by ${damageGain} to level ${state.weaponLevel}.`}
      else if(choice==='damage'){state.coins+=12*multiplier;msg=`You gained ${12*multiplier} coins.`}
      else if(choice==='armor'){state.armorLevel=(state.armorLevel||0)+1;state.maxHp=(state.maxHp||30)+armorGain;state.hp=Math.min(state.maxHp,(state.hp||0)+armorGain);if(combat)combat.playerHp=Math.min(state.maxHp,(combat.playerHp||0)+armorGain);msg=`Maximum HP increased by ${armorGain} and your wounds were repaired.`}
      else if(choice==='scrounge'){if(drop.key==='coins'){state.coins+=dropAmount;msg=`You gained ${dropAmount} coins.`}else{state.materials[drop.key]=(state.materials[drop.key]||0)+dropAmount;msg=`You gained ${dropAmount} ${drop.drop.toLowerCase()}.`}}
      else{state.coins+=coins;msg=`You gained ${coins} coins.`}
      e.lastBattleReward={choice,enemy:combat?.enemy,drop:drop.drop};save();
      card.innerHTML=`<div class="reward-confirmation" role="status" aria-live="polite"><span aria-hidden="true">✦</span><h2>Reward claimed</h2><p>${msg}</p></div>`;
      setTimeout(()=>{
        $('#rewardOverlay').classList.remove('open');
        if(window.villageRaid?.active){window.villageRaid.onReward(msg)}else if(e.pendingFinale){e.pendingFinale=false;state.won=true;save();showEnd();setTimeout(()=>window.sideArmor?.showPending?.(),420)}
        else{renderMap();show('map');$('#mapStatus').textContent=`Reward claimed: ${msg}`;setTimeout(()=>window.sideArmor?.showPending?.(),420)}
      },3000);
    });
  };
})();

(()=>{
  const loader=document.querySelector('#assetLoader'),bar=document.querySelector('#assetLoaderBar'),status=document.querySelector('#assetLoaderStatus'),count=document.querySelector('#assetLoaderCount'),flavor=document.querySelector('#assetLoaderFlavor');
  if(!loader)return;
  const setStatus=(text,done,total)=>{const percent=total?Math.round(done/total*100):0;if(status)status.textContent=text;if(bar)bar.style.width=percent+'%';if(count)count.textContent=percent+'%';if(flavor)flavor.textContent=percent<25?'Raising the scenery…':percent<55?'Waking the troublemakers…':percent<85?'Checking the castle gates…':'Almost time for a bummer…'};
  const collect=()=>{
    const found=new Set(),add=value=>{if(typeof value!=='string'||!value||value.startsWith('Video/'))return;found.add(value)};
    try{if(typeof ASSETS!=='undefined')Object.values(ASSETS).forEach(add)}catch(e){}
    add('Textures/UI/Combat/evade.png');
    Object.entries(CREATION_CLASSES).forEach(([id,c])=>{add('Textures/UI/CharacterCreation/'+c.scene);add('Textures/UI/CharacterCreation/'+c.icon);add('Textures/UI/CharacterCreation/female-'+id+'.png')});
    document.querySelectorAll('img[src],audio[src],source[src]').forEach(node=>add(node.getAttribute('src')));
    const dataRx=/data:(?:image|audio)\/[a-z0-9.+-]+;base64,[A-Za-z0-9+/=]+/gi,pathRx=/(?:Textures|Audio)\/[A-Za-z0-9_./-]+/g;
    document.querySelectorAll('style,script').forEach(node=>{const text=node.textContent||'';for(const match of text.matchAll(dataRx))add(match[0]);for(const match of text.matchAll(pathRx))add(match[0])});
    return [...found].filter(src=>!src.startsWith('Video/'));
  };
  const preloadImage=src=>new Promise(resolve=>{let settled=false;const finish=()=>{if(settled)return;settled=true;clearTimeout(timer);resolve()};const img=new Image();const timer=setTimeout(finish,9000);img.decoding='async';img.onload=()=>{if(typeof img.decode==='function')img.decode().catch(()=>{}).then(finish);else finish()};img.onerror=finish;img.src=src});
  const preloadAudio=src=>new Promise(resolve=>{let settled=false;const finish=()=>{if(settled)return;settled=true;clearTimeout(timer);audio.removeEventListener('canplaythrough',finish);audio.removeEventListener('loadeddata',finish);audio.removeEventListener('error',finish);resolve()};const audio=new Audio();const timer=setTimeout(finish,12000);audio.preload='auto';audio.addEventListener('canplaythrough',finish,{once:true});audio.addEventListener('loadeddata',finish,{once:true});audio.addEventListener('error',finish,{once:true});audio.src=src;audio.load()});
  const runPool=async(items,limit,worker,onDone)=>{let cursor=0;const next=async()=>{while(true){const index=cursor++;if(index>=items.length)return;await worker(items[index]);onDone(index)}};await Promise.all(Array.from({length:Math.min(limit,items.length||1)},next))};
  const boot=async()=>{
    const urls=collect(),images=urls.filter(src=>src.startsWith('data:image/')||/\.(?:png|jpe?g|gif|webp)(?:$|[?#])/i.test(src)),audio=urls.filter(src=>src.startsWith('data:audio/')||/\.(?:ogg|mp3|wav|m4a)(?:$|[?#])/i.test(src));
    const total=images.length+audio.length;let done=0;setStatus('Decoding textures…',0,total);
    await runPool(images,6,preloadImage,()=>{done++;setStatus('Decoding textures…',done,total)});
    await runPool(audio,3,preloadAudio,()=>{done++;setStatus('Warming audio…',done,total)});
    document.body.classList.add('assets-ready');loader.classList.add('ready');loader.setAttribute('aria-hidden','true');
    document.querySelectorAll('#beginBtn,#continueBtn,#startPrompt,#newGameChoice,#continueChoice').forEach(button=>{button.disabled=false;button.removeAttribute('aria-disabled')});
    setStatus('Ready. The bummer is warmed up.',total,total);
    setTimeout(()=>loader.remove(),450);
  };
  document.body.classList.remove('assets-ready');boot().catch(error=>{console.warn('Asset preloader failed; continuing with fallback loading.',error);loader.dataset.error='true';setStatus('Some assets loaded slowly. Starting safely…',0,0);document.body.classList.add('assets-ready');loader.classList.add('ready');setTimeout(()=>loader.remove(),700)});
})();


/* NG+ visual resolver is defined before the clock starts so loading an NG+ save never paints the original world first. */
window.getNgPlusVisuals=window.getNgPlusVisuals||function(){
  const key=state.meta?.ngPlusRouteKey||state.endgame?.routeKey||null;if(!state.ng||!key)return null;
  const royal=['male-king','female-stay','female-friends'].includes(key),root='Textures/Maps/NGPlus/';
  return {routeKey:key,overworldDay:`Textures/UI/Postgame/Maps/route-${key}.png`,overworldNight:`Textures/UI/Postgame/Maps/route-${key}-night.png`,combat:[`${root}${royal?'placenta-royal':'placenta-free'}.jpg`,`${root}mild.jpg`,`${root}grave.jpg`,`${root}question.jpg`,`${root}${royal?'fortress-royal':'fortress-ruin'}.jpg`]};
};

/* Accelerated global day/night clock. Keep this state independent from screen changes. */
(()=>{
  const STORAGE_KEY='demonBummerGameClock';
  const CONFIG={gameMinutesPerRealSecond:2, transitionMinutes:6, initialMinutes:8*60};
  const DAY_START=6*60, NIGHT_START=19*60, DAY_LENGTH=24*60;
  let saved=null;
  try{saved=JSON.parse(localStorage.getItem(STORAGE_KEY)||'null')}catch(e){saved=null}
  const legacy=state.meta?.gameClock;
  const source=saved&&Number.isFinite(Number(saved.minutes))?saved:legacy&&Number.isFinite(Number(legacy.minutes))?legacy:null;
  const now=Date.now();
  let minutes=source?Number(source.minutes):CONFIG.initialMinutes;
  if(source){const savedAt=Number(source.savedAt||source.lastWallMs||0);if(savedAt)minutes+=Math.max(0,now-savedAt)/1000*CONFIG.gameMinutesPerRealSecond}
  minutes=((minutes%DAY_LENGTH)+DAY_LENGTH)%DAY_LENGTH;
  let lastWallMs=now,lastPersistMs=0,lastClockText='',lastBlend=-1;
  const nightPath=src=>{if(!src)return null;const m=src.match(/^(.*?)(-night)?(\.(?:png|jpe?g))$/i);return m?`${m[1]}-night${m[3]}`:null};
  const decodedImages=new Map();
  const decodeImage=src=>{
    if(!src)return Promise.resolve(null);
    if(decodedImages.has(src))return decodedImages.get(src);
    const promise=new Promise(resolve=>{
      const img=new Image();let settled=false;
      const finish=value=>{if(settled)return;settled=true;resolve(value)};
      const ready=()=>{const decoded=typeof img.decode==='function'?img.decode().catch(()=>{}):Promise.resolve();decoded.then(()=>finish(img))};
      img.onload=ready;img.onerror=()=>finish(null);img.decoding='async';img.src=src;if(img.complete)ready();
    });
    decodedImages.set(src,promise);return promise;
  };
  window.prepareDayNightScene=daySrc=>Promise.all([decodeImage(daySrc),decodeImage(nightPath(daySrc))]);
  const snapshot=()=>{
    const value=((minutes%DAY_LENGTH)+DAY_LENGTH)%DAY_LENGTH,hour24=Math.floor(value/60),minute=Math.floor(value%60),second=Math.floor((value%1)*60);
    let nightBlend=0;
    if(value>=NIGHT_START)nightBlend=Math.min(1,(value-NIGHT_START)/CONFIG.transitionMinutes);
    else if(value<DAY_START)nightBlend=1;
    else if(value<DAY_START+CONFIG.transitionMinutes)nightBlend=Math.max(0,1-(value-DAY_START)/CONFIG.transitionMinutes);
    return {minutes:value,hour24,minute,second,isNight:value>=NIGHT_START||value<DAY_START,nightBlend,transitioning:nightBlend>0&&nightBlend<1};
  };
  const persist=(force=false)=>{const stamp=Date.now();if(!force&&stamp-lastPersistMs<5000)return;const payload={minutes,savedAt:stamp};try{localStorage.setItem(STORAGE_KEY,JSON.stringify(payload))}catch(e){}state.meta=state.meta||{};state.meta.gameClock=payload;lastPersistMs=stamp};
  const format=s=>{const h=s.hour24%12||12;return {time:String(h),period:s.hour24>=12?'PM':'AM'};};
  const updateClockUi=s=>{const f=format(s),key=`${f.time} ${f.period}`;if(key===lastClockText)return;lastClockText=key;document.querySelectorAll('.game-clock').forEach(el=>{const time=el.querySelector('.clock-time'),period=el.querySelector('.clock-period');if(time)time.textContent=f.time;if(period)period.textContent=f.period})};
  const updateWeather=s=>{const won=!!state.won,pre=['Haze','Fog','Gloom'],post=['Haze','Fog','Rainbow'],weather=(won?post:pre)[Math.floor((Date.now()/3600000)%3)];[['#mapWeather','#mapWeatherLabel'],['#villageWeather','#villageWeatherLabel']].forEach(([root,label])=>{const el=$(root);if(!el)return;el.className='weather-'+weather.toLowerCase().replace(' ','-');const text=$(label);if(text)text.textContent=(s.isNight?'Night · ':'')+weather})};
  const setLayer=(id,daySrc,s)=>{const layer=$('#'+id);if(!layer)return;const night=nightPath(daySrc);if(!night){layer.style.opacity='0';return}if(layer.dataset.daySrc!==daySrc){layer.dataset.daySrc=daySrc;layer.dataset.nightSrc=night;layer.style.backgroundImage=`url("${night}")`}layer.style.opacity=s.nightBlend.toFixed(4)};
  const updateLayers=s=>{
    const ngVisuals=state.ng?window.getNgPlusVisuals?.():null;
    const mapDay=ngVisuals?.overworldDay||'Textures/Maps/overworld-background.jpg',villageDay='Textures/Maps/village.jpg';
    $('#mapCanvas')?.style.setProperty('background-image',`url("${mapDay}")`,'important');
    $('#villageCanvas')?.style.setProperty('background-image',`url("${villageDay}")`,'important');
    const mapNightLayer=$('#mapNightLayer');
    if(ngVisuals?.overworldNight&&mapNightLayer){
      if(mapNightLayer.dataset.daySrc!==mapDay){mapNightLayer.dataset.daySrc=mapDay;mapNightLayer.dataset.nightSrc=ngVisuals.overworldNight;mapNightLayer.style.backgroundImage=`url("${ngVisuals.overworldNight}")`}
      mapNightLayer.style.opacity=s.nightBlend.toFixed(4);
    }else setLayer('mapNightLayer',mapDay,s);
    setLayer('villageNightLayer',villageDay,s);
    const building=BUILDING_BACKGROUNDS[state._building]||BUILDING_BACKGROUNDS.home;setLayer('interiorNightLayer',building,s);
    const combatDay=window.villageRaid?.backdrop||state.endgame?.specialCombatBackdrop||ngVisuals?.combat?.[Number(state.hub)||0]||['Textures/Maps/Areas/placenta.jpg','Textures/Maps/Areas/mild.jpg','Textures/Maps/Areas/grave.jpg','Textures/Maps/Areas/question.jpg','Textures/Maps/Areas/monarch.jpg'][Number(state.hub)||0]||mapDay;if(window.villageRaid?.active){const layer=$('#combatNightLayer');if(layer){layer.style.backgroundImage='none';layer.style.opacity='0'}}else setLayer('combatNightLayer',combatDay,s);
    if(Math.abs(s.nightBlend-lastBlend)>.0005){lastBlend=s.nightBlend;document.querySelectorAll('.screen.map,.screen.village,.screen.interior,.screen.combat').forEach(el=>el.classList.toggle('night-transition',s.transitioning));}
  };
  const render=()=>{const s=snapshot();updateClockUi(s);updateLayers(s);updateWeather(s);return s};
  window.applyDayNightNow=()=>render();
  const tick=()=>{const current=Date.now(),delta=Math.max(0,current-lastWallMs);if(delta){minutes=(minutes+delta/1000*CONFIG.gameMinutesPerRealSecond)%DAY_LENGTH;lastWallMs=current}persist();render();requestAnimationFrame(tick)};
  window.gameClock={config:CONFIG,getState:snapshot,getMinutes:()=>snapshot().minutes,setMinutes:value=>{minutes=((Number(value)||0)%DAY_LENGTH+DAY_LENGTH)%DAY_LENGTH;lastWallMs=Date.now();persist(true);render()},reset:()=>{minutes=CONFIG.initialMinutes;lastWallMs=Date.now();persist(true);render()}};
  // Warm every automatically discovered -night texture so the first cross-fade is smooth.
  fetch('Textures/asset-manifest.json').then(r=>r.ok?r.json():[]).then(rows=>rows.filter(row=>/-night\.(?:png|jpe?g)$/i.test(row.path||'')).forEach(row=>decodeImage(row.path))).catch(()=>{});
  document.addEventListener('click',e=>{if(e.target.closest('#newGameChoice'))window.gameClock.reset()},true);
  addEventListener('beforeunload',()=>persist(true));persist(true);render();requestAnimationFrame(tick);
})();


/* Village-only night fireflies. No daytime particles are drawn. */
(()=>{
  const village=$('#village');
  if(!village)return;
  const canvas=document.createElement('canvas');
  canvas.id='fireflies-village-layer';canvas.className='fireflies-village-layer';canvas.setAttribute('aria-hidden','true');
  canvas.style.cssText='position:absolute;inset:0;width:100%;height:100%;z-index:2;pointer-events:none;mix-blend-mode:screen;';
  village.appendChild(canvas);
  const ctx=canvas.getContext('2d');
  const region={cx:.575,cy:.675,rx:.408,ry:.328};
  const particles=Array.from({length:18},()=>{
    const a=Math.random()*Math.PI*2,r=Math.sqrt(Math.random());
    return {x:region.cx+Math.cos(a)*region.rx*r,y:region.cy+Math.sin(a)*region.ry*r,vx:(Math.random()-.5)*.0012,vy:(Math.random()-.5)*.0008,phase:Math.random()*Math.PI*2,rate:.45+Math.random()*.75,size:.7+Math.random()*1.1};
  });
  let width=0,height=0,last=performance.now();
  const resize=()=>{const rect=village.getBoundingClientRect(),d=window.devicePixelRatio||1,w=Math.max(1,rect.width),h=Math.max(1,rect.height);if(w===width&&h===height)return;width=w;height=h;canvas.width=Math.round(w*d);canvas.height=Math.round(h*d);ctx.setTransform(d,0,0,d,0,0)};
  const inside=(p)=>{const dx=(p.x-region.cx)/region.rx,dy=(p.y-region.cy)/region.ry;return dx*dx+dy*dy<=1};
  const draw=now=>{
    const dt=Math.min(.05,Math.max(0,(now-last)/1000));last=now;resize();ctx.clearRect(0,0,width,height);
    const clock=window.gameClock?.getState?.(),nightAlpha=clock?.nightBlend||0;
    if(!village.classList.contains('active')){requestAnimationFrame(draw);return}
    if(nightAlpha<=.001){requestAnimationFrame(draw);return}
    for(const p of particles){p.x+=p.vx*dt*60;p.y+=p.vy*dt*60;if(!inside(p)){p.x-=p.vx*dt*60;p.y-=p.vy*dt*60;p.vx*=-1;p.vy*=-1}const pulse=.5+.5*Math.sin(now*.001*p.rate+p.phase),alpha=nightAlpha*(.16+.45*pulse),x=p.x*width,y=p.y*height,r=p.size*(.8+.45*pulse),glow=r*5;const g=ctx.createRadialGradient(x,y,0,x,y,glow);g.addColorStop(0,`rgba(255,247,170,${alpha})`);g.addColorStop(.18,`rgba(255,224,102,${alpha*.8})`);g.addColorStop(1,'rgba(255,207,72,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,glow,0,Math.PI*2);ctx.fill();ctx.fillStyle=`rgba(255,251,194,${Math.min(1,alpha+.12)})`;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill()}
    requestAnimationFrame(draw);
  };
  addEventListener('resize',resize);requestAnimationFrame(draw);
})();


/* Session-only debug toggles. These flags intentionally never enter localStorage. */
(()=>{
  const d=window.__debugFlags,MAX=Number.MAX_SAFE_INTEGER;
  const applyMax=()=>{if(!d.maxResources)return;state.coins=MAX;state.materials=state.materials||{};state.materials.leather=MAX;state.materials.bones=MAX;state.materials.steel=MAX};
  const restoreMax=()=>{if(!d.resourceSnapshot)return;state.coins=d.resourceSnapshot.coins;state.materials={...d.resourceSnapshot.materials};d.resourceSnapshot=null};
  window.__debugToggleMaxResources=()=>{if(!d.maxResources){d.resourceSnapshot={coins:state.coins,materials:{leather:state.materials?.leather||0,bones:state.materials?.bones||0,steel:state.materials?.steel||0}};d.maxResources=true;applyMax()}else{d.maxResources=false;restoreMax();save()}};
  window.__debugResetSession=()=>{d.godMode=false;if(d.maxResources){d.maxResources=false;restoreMax()}d.resourceSnapshot=null};
  const displayResources=()=>{const infinite=!!d.maxResources;$('#mapCoins')&&(($('#mapCoins').textContent=infinite?'∞':state.coins));$('#villageCoins')&&(($('#villageCoins').textContent=infinite?'∞':state.coins));document.querySelectorAll('.inventory-line').forEach(el=>{el.textContent=`Coins: ◈ ${infinite?'∞':state.coins} · HP: ❤ ${state.hp}/${state.maxHp}`});document.querySelectorAll('.shop-grid span,.material-row span,.compact-materials span').forEach(el=>{const text=el.textContent||'';if(/leather/i.test(text))el.textContent=`Leather: ${infinite?'∞':state.materials.leather}`;else if(/bones?/i.test(text))el.textContent=`Bones: ${infinite?'∞':state.materials.bones}`;else if(/demon steel|steel/i.test(text))el.textContent=`Demon steel: ${infinite?'∞':state.materials.steel}`})};
  setInterval(()=>{applyMax();if(d.godMode&&$('#combat')?.classList.contains('active')&&typeof combat!=='undefined'){combat.playerHp=state.maxHp;state.hp=state.maxHp;updateBars?.()}displayResources()},80);
  document.addEventListener('click',e=>{if(e.target.closest('#newGameChoice'))window.__debugResetSession?.()},true);
})();


/* Critical-hit impact slow motion. */
(()=>{
  window.triggerCritSlowMo=()=>{
    const combatScreen=$('#combat');if(!combatScreen)return;
    if(!document.querySelector('#crit-slowmo-style')){const style=document.createElement('style');style.id='crit-slowmo-style';style.textContent=`@keyframes critImpactFlash{0%{filter:brightness(1) saturate(1)}28%{filter:brightness(2.1) saturate(1.45)}100%{filter:brightness(1) saturate(1)}}.combat.crit-slowmo .battle-field{filter:contrast(1.08) saturate(1.2) brightness(1.08);transition:filter .12s ease}.combat.crit-slowmo #enemyArt{animation:critImpactFlash .5s ease-out both}.combat.crit-slowmo .fighter{animation-duration:2.4s!important}`;document.head.appendChild(style)}
    combatScreen.classList.remove('crit-slowmo');void combatScreen.offsetWidth;combatScreen.classList.add('crit-slowmo');clearTimeout(combatScreen.__critSlowMoTimer);combatScreen.__critSlowMoTimer=setTimeout(()=>combatScreen.classList.remove('crit-slowmo'),500);
  };
})();


/* Final combat behavior pass: card locking, hit-only shake, and status timing. */
(()=>{
  window.triggerCombatShake=function(){
    const screen=document.querySelector('#combat');
    if(!screen||!screen.classList.contains('active'))return;
    screen.classList.remove('shake');void screen.offsetWidth;screen.classList.add('shake');
    clearTimeout(screen.__shakeTimer);screen.__shakeTimer=setTimeout(()=>screen.classList.remove('shake'),260);
  };
  const cardsLocked=()=>{
    const active=$('#combat')?.classList.contains('active');
    return !active||!combat||window.__battleNoticeOpen||window.__combatPreAction||window.__combatEnemyTurn||!!combat.turnActionUsed||combat.playerHp<=0||combat.enemyHp<=0||!!document.querySelector('.death-modal');
  };
  const syncCardState=()=>document.querySelectorAll('#combat .card').forEach(card=>{
    const locked=cardsLocked();card.classList.toggle('is-locked',locked);card.setAttribute('aria-disabled',String(locked));card.tabIndex=locked?-1:0;
  });
  setInterval(syncCardState,40);
  document.addEventListener('keydown',e=>{if(!['1','2','3'].includes(e.key)||!cardsLocked())return;e.preventDefault()},true);
})();


/* Pokémon-style action announcements: announce first, then resolve the action. */
(()=>{
  if(window.__pokemonCombatAnnouncements)return;
  window.__pokemonCombatAnnouncements=true;
  window.__combatPreAction=false;
  const isLocked=()=>!$('#combat')?.classList.contains('active')||!combat||window.__battleNoticeOpen||window.__combatPreAction||window.__combatEnemyTurn||!!combat.turnActionUsed||combat.playerHp<=0||combat.enemyHp<=0||!!document.querySelector('.death-modal');
  const enemyBlocked=()=>!$('#combat')?.classList.contains('active')||!combat||window.__battleNoticeOpen||window.__combatPreAction||window.__combatEnemyTurn||combat.enemyHp<=0||combat.playerHp<=0||!!document.querySelector('.death-modal');
  const announce=(title,body)=>{
    window.__combatPreAction=true;
    const p=window.battleNotice?window.battleNotice(title,body):Promise.resolve();
    return Promise.resolve(p).then(()=>{window.__combatPreAction=false});
  };
  const oldPlay=window.playCard;
  if(oldPlay){
    window.playCard=function(card){
      if(isLocked())return;
      // Offensive Magic card must stay distinct from support spells (Heal/Purify).
      // Heal/Purify use battleUseSpell below and announce "casting a spell".
      // The Magic attack card announces "casting magic" so alive-systems.js
      // knows to launch the offensive projectile toward the enemy.
      const magicAttack=card==='magic'||(state.gear==='magic'&&card==='attack');
      const title=card==='guard'?`${state.playerName} is guarding!`:magicAttack?`${state.playerName} is casting magic!`:`${state.playerName} is attacking!`;
      announce(title,`${state.playerName} is preparing the action.`).then(()=>{
        if(!isLocked())oldPlay(card);
        else window.__combatPreAction=false;
      });
    };
  }
  const oldItem=window.battleUseConsumable;
  if(oldItem){
    window.battleUseConsumable=function(kind){
      const count=Number(state.meta?.items?.[kind]||0);
      if(isLocked()||count<=0){oldItem(kind);return}
      announce(`${state.playerName} is using an item!`,`${state.playerName} reaches for an item.`).then(()=>{if(!isLocked())oldItem(kind)});
    };
  }
  const oldSpell=window.battleUseSpell;
  if(oldSpell){
    window.battleUseSpell=function(spell){
      const available=!!state.meta?.spells?.[spell],mana=Number(combat?.playerMana||0);
      if(isLocked()||!available||mana<3){oldSpell(spell);return}
      announce(`${state.playerName} is casting a spell!`,`${state.playerName} gathers magical power.`).then(()=>{if(!isLocked())oldSpell(spell)});
    };
  }
  const oldEnemy=window.__battleEnemyCounter;
  if(oldEnemy){
    window.__battleEnemyCounter=function(){
      if(enemyBlocked()||!combat?.enemyHp)return;
      announce(`${combat.enemy} is attacking!`,`${combat.enemy} prepares to strike.`).then(()=>{if(!enemyBlocked()&&combat?.enemyHp>0)oldEnemy()});
    };
  }
  const oldShake=window.triggerCombatShake;
  window.triggerCombatShake=function(source){
    if(!['player-attack','player-magic','enemy-hit'].includes(source))return;
    oldShake?.();
  };
})();


/* Status visual pass: readable badges, turn pips, auras, and status particles. */
(()=>{
  const icons={Bleeding:'🩸',Burning:'🔥',Soaked:'💧',Poisoned:'☠',Cursed:'✦',Weakened:'↓',Confused:'✧','Armor Break':'◇',Blessed:'✧','Wild magic':'✹'};
  const chars={Bleeding:'●',Burning:'✦',Soaked:'•',Poisoned:'•',Cursed:'✧',Weakened:'↓',Confused:'✦','Armor Break':'◇',Blessed:'✧','Wild magic':'✹'};
  const previous={enemy:'',player:''};
  const turnsFor=(side,name)=>{
    if(side==='enemy'){
      if(name==='Bleeding')return Number(combat.bleedingTurns||0);
      if(name==='Soaked')return Number(combat.soakedTurns||0);
      return 0;
    }
    if(name==='Bleeding')return Number(combat.playerBleedingTurns||0);
    return Number(combat.playerStatusTurns?.[name]||0);
  };
  const badge=(side,name)=>{
    const slug=statusSlug(name),turns=turnsFor(side,name),dots=turns?`<span class="status-pips" aria-label="${turns} turns remaining">${'●'.repeat(Math.min(3,turns))}</span>`:'';
    return `<span class="status-tag status-${slug}" title="${esc(name)}${turns?` · ${turns} turn${turns===1?'':'s'} remaining`:''}"><span class="status-icon" aria-hidden="true">${icons[name]||'✦'}</span><b>${esc(name)}</b>${dots}</span>`;
  };
  const renderSide=(side,statuses)=>{
    const art=$(side==='enemy'?'#enemyArt':'#playerArt'),card=$(side==='enemy'?'.battle-foe-card':'.battle-player-card');
    if(!art||!card)return;
    const list=(statuses||[]).filter(Boolean),slugs=list.map(statusSlug),sig=list.map(x=>`${x}:${turnsFor(side,x)}`).join('|');
    const mount=card.querySelector('.target-status');
    if(mount&&mount.dataset.visualSignature!==sig){mount.dataset.visualSignature=sig;mount.innerHTML=list.map(x=>badge(side,x)).join('')}
    if(art.dataset.statusSignature===sig)return;
    art.dataset.statusSignature=sig;art.dataset.statuses=slugs.join(' ');
    let vfx=art.querySelector('.status-vfx');
    if(!vfx){vfx=document.createElement('div');vfx.className='status-vfx';vfx.setAttribute('aria-hidden','true');art.appendChild(vfx)}
    vfx.innerHTML=list.map((name,statusIndex)=>{
      const slug=statusSlug(name),char=chars[name]||'✦';
      return `<span class="status-aura aura-${slug}"></span>${[0,1].map(i=>`<span class="status-particle particle-${slug}" style="--x:${(i?1:-1)*(18+statusIndex*7)}px;--y:${-18-statusIndex*5-i*9}px;--delay:${(statusIndex*.12+i*.18).toFixed(2)}s">${char}</span>`).join('')}`;
    }).join('');
    if(previous[side]!==sig&&sig){art.classList.remove('status-burst');void art.offsetWidth;art.classList.add('status-burst');clearTimeout(art.__statusBurstTimer);art.__statusBurstTimer=setTimeout(()=>art.classList.remove('status-burst'),520)}
    previous[side]=sig;
  };
  const render=()=>{
    if(!$('#combat')?.classList.contains('active')||!combat)return;
    renderSide('enemy',combat.targetStatuses||[]);renderSide('player',combat.playerStatuses||[]);
  };
  setInterval(render,80);render();
})();

/* Critical environment texture preloader: fetch, decode, and retain map art before area changes. */
(()=>{
  const textures=[
    'Textures/Maps/village.jpg','Textures/Maps/village-night.jpg',
    'Textures/Maps/VillageLayers/back-village.png','Textures/Maps/VillageLayers/back-village-night.png',
    'Textures/Maps/VillageLayers/middle-village.png','Textures/Maps/VillageLayers/middle-village-night.png',
    'Textures/Maps/VillageLayers/front-village.png','Textures/Maps/VillageLayers/front-village-night.png',
    'Textures/Maps/Areas/placenta.jpg','Textures/Maps/Areas/placenta-night.jpg',
    'Textures/Maps/Areas/mild.jpg','Textures/Maps/Areas/mild-night.jpg',
    'Textures/Maps/Areas/grave.jpg','Textures/Maps/Areas/grave-night.jpg',
    'Textures/Maps/Areas/question.jpg','Textures/Maps/Areas/question-night.jpg',
    'Textures/Maps/Areas/monarch.jpg','Textures/Maps/Areas/monarch-night.jpg',
    'Textures/Maps/Areas/CombatLayers/back-placenta.png','Textures/Maps/Areas/CombatLayers/back-placenta-night.png',
    'Textures/Maps/Areas/CombatLayers/middle-placenta.png','Textures/Maps/Areas/CombatLayers/middle-placenta-night.png',
    'Textures/Maps/Areas/CombatLayers/front-placenta.png','Textures/Maps/Areas/CombatLayers/front-placenta-night.png',
    'Textures/Maps/Areas/CombatLayers/back-mild.png','Textures/Maps/Areas/CombatLayers/back-mild-night.png',
    'Textures/Maps/Areas/CombatLayers/middle-mild.png','Textures/Maps/Areas/CombatLayers/middle-mild-night.png',
    'Textures/Maps/Areas/CombatLayers/front-mild.png','Textures/Maps/Areas/CombatLayers/front-mild-night.png',
    'Textures/Maps/Areas/CombatLayers/back-grave.png','Textures/Maps/Areas/CombatLayers/back-grave-night.png',
    'Textures/Maps/Areas/CombatLayers/middle-grave.png','Textures/Maps/Areas/CombatLayers/middle-grave-night.png',
    'Textures/Maps/Areas/CombatLayers/front-grave.png','Textures/Maps/Areas/CombatLayers/front-grave-night.png',
    'Textures/Maps/Areas/CombatLayers/middle-question.png','Textures/Maps/Areas/CombatLayers/middle-question-night.png',
    'Textures/Maps/Areas/CombatLayers/front-question.png','Textures/Maps/Areas/CombatLayers/front-question-night.png'
  ];
  const cache=window.__environmentTextureCache=window.__environmentTextureCache||new Map();
  window.environmentTexturesReady=Promise.allSettled(textures.map(src=>{
    if(cache.has(src))return cache.get(src).ready;
    const img=new Image();
    img.decoding='async';
    const loaded=new Promise(resolve=>{
      img.onload=resolve;
      img.onerror=resolve;
    });
    img.src=src;
    const ready=loaded.then(()=>typeof img.decode==='function'?img.decode().catch(()=>{}):undefined);
    cache.set(src,{img,ready});
    return ready;
  }));
  /* Nearby scenes warm after village entry, leaving the initial load focused. */
  const dynamicCache=new Map();
  window.ensureSceneImage=src=>{
    if(!src)return Promise.resolve(null);
    if(cache.has(src))return cache.get(src).ready;
    if(dynamicCache.has(src))return dynamicCache.get(src);
    const ready=new Promise(resolve=>{
      const img=new Image();img.decoding='async';
      img.onload=()=>Promise.resolve(typeof img.decode==='function'?img.decode().catch(()=>{}):null).then(()=>resolve(img));
      img.onerror=()=>resolve(null);
      img.src=src;
    });
    dynamicCache.set(src,ready);return ready;
  };
  let interiorsWarm=false;
  const warmInteriors=()=>{
    if(interiorsWarm||!document.querySelector('#village')?.classList.contains('active'))return;
    interiorsWarm=true;
    const backgrounds=Object.values(BUILDING_BACKGROUNDS),people=['Textures/NPCs/priest.png','Textures/NPCs/blacksmith.png','Textures/NPCs/merchant.png'];
    const armor=combatArmorSources();
    Promise.allSettled([...backgrounds,...people,armor.normal,armor.damaged].map(window.ensureSceneImage)).then(()=>{
      backgrounds.forEach(src=>window.ensureSceneImage(src.replace(/(\.[^.]+)$/,'-night$1')));
      const ng=state.ng?window.getNgPlusVisuals?.():null;
      window.ensureSceneImage(ng?.overworldDay||'Textures/Maps/overworld-background.jpg');
      window.ensureSceneImage(ng?.overworldNight||'Textures/Maps/overworld-background-night.jpg');
    });
  };
  setInterval(warmInteriors,500);warmInteriors();
})();

/* Village texture-layer test: front/back sway slowly, middle stays still. */
(()=>{
  const ROOT='Textures/Maps/VillageLayers/';
  const defs=[
    ['back','back-village.png','back-village-night.png'],
    ['middle','middle-village.png','middle-village-night.png'],
    ['front','front-village.png','front-village-night.png']
  ];
  function ensureVillageTextureStage(){
    const village=document.getElementById('village');
    if(!village||village.querySelector('.village-texture-stage'))return;
    const stage=document.createElement('div');stage.className='village-texture-stage';stage.setAttribute('aria-hidden','true');
    defs.forEach(([layer,day,night])=>{
      const d=document.createElement('img');d.className=`village-texture-layer ${layer} day`;d.src=ROOT+day;d.alt='';stage.appendChild(d);
      const n=document.createElement('img');n.className=`village-texture-layer ${layer} night`;n.src=ROOT+night;n.alt='';stage.appendChild(n);
    });
    const canvas=document.getElementById('villageCanvas');
    if(canvas)canvas.insertAdjacentElement('afterend',stage);else village.prepend(stage);
    village.classList.add('village-layered');
  }
  function syncVillageTextureNight(){
    ensureVillageTextureStage();
    const s=window.gameClock?.getState?.();
    const blend=Math.max(0,Math.min(1,s?.nightBlend??0));
    document.querySelectorAll('#village .village-texture-layer.day').forEach(el=>el.style.opacity=(1-blend).toFixed(4));
    document.querySelectorAll('#village .village-texture-layer.night').forEach(el=>el.style.opacity=blend.toFixed(4));
  }
  ensureVillageTextureStage();syncVillageTextureNight();setInterval(syncVillageTextureNight,250);
})();


/* Combat texture parallax: area-correct day/night overlays. Area 5 intentionally has no parallax. */
(()=>{
  const ROOT='Textures/Maps/Areas/CombatLayers/';
  const AREAS=[
    {key:'placenta',layers:['back','middle','front']},
    {key:'mild',layers:['back','middle','front']},
    {key:'grave',layers:['back','middle','front']},
    {key:'question',layers:['middle','front']},
    {key:'monarch',layers:[]}
  ];
  function currentDef(){return AREAS[Number(state.hub)||0]||AREAS[0]}
  function makeImg(layer,period,key){
    const img=document.createElement('img');
    img.className=`combat-texture-layer ${layer} ${period}`;
    img.src=`${ROOT}${layer}-${key}${period==='night'?'-night':''}.png`;
    img.alt=''; return img;
  }
  function rebuildCombatTextureStage(){
    const field=document.querySelector('#combat .battle-field');
    if(!field)return;
    const def=currentDef(),key=def.key;
    let back=field.querySelector('.combat-texture-behind');
    let front=field.querySelector('.combat-texture-front');
    if(!def.layers.length){
      back?.remove();front?.remove();field.dataset.combatTextureArea=key;return;
    }
    if(field.dataset.combatTextureArea===key&&back&&front)return;
    back?.remove();front?.remove();
    back=document.createElement('div');back.className='combat-texture-stage combat-texture-behind';back.setAttribute('aria-hidden','true');
    front=document.createElement('div');front.className='combat-texture-stage combat-texture-front';front.setAttribute('aria-hidden','true');
    def.layers.forEach(layer=>{
      const mount=layer==='front'?front:back;
      mount.appendChild(makeImg(layer,'day',key));
      mount.appendChild(makeImg(layer,'night',key));
    });
    field.prepend(back);field.appendChild(front);field.dataset.combatTextureArea=key;
  }
  let prepareToken=0;
  const AREA_BACKGROUNDS=[
    'Textures/Maps/Areas/placenta.jpg','Textures/Maps/Areas/mild.jpg','Textures/Maps/Areas/grave.jpg','Textures/Maps/Areas/question.jpg','Textures/Maps/Areas/monarch.jpg'
  ];
  const readyImage=src=>window.ensureSceneImage?.(src)||Promise.resolve();
  const nextPaint=()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
  window.warmLevelArea=function(areaIndex){
    const index=Math.max(0,Math.min(4,Number(areaIndex)||0)),def=AREAS[index],ng=state.ng?window.getNgPlusVisuals?.():null;
    const day=ng?.combat?.[index]||AREA_BACKGROUNDS[index],night=day.replace(/(\.[^.]+)$/,'-night$1');
    const urls=[day,night];
    if(!ng)for(const layer of def.layers)urls.push(`${ROOT}${layer}-${def.key}.png`,`${ROOT}${layer}-${def.key}-night.png`);
    urls.forEach(src=>window.ensureSceneImage?.(src));
  };
  window.prepareCombatScene=async function(areaIndex=Number(state.hub)||0){
    const token=++prepareToken,index=Math.max(0,Math.min(4,Number(areaIndex)||0)),def=AREAS[index],key=def.key;
    const combatScreen=document.getElementById('combat'),field=document.querySelector('#combat .battle-field');
    if(!combatScreen||!field)return;
    /* Never expose the previous area's pixels while this area's art is being committed. */
    combatScreen.classList.remove('active');
    field.querySelector('.combat-texture-behind')?.remove();field.querySelector('.combat-texture-front')?.remove();delete field.dataset.combatTextureArea;
    const ngVisuals=state.ng?window.getNgPlusVisuals?.():null;
    const raidBackdrop=window.villageRaid?.backdrop,day=raidBackdrop||state.endgame?.specialCombatBackdrop||ngVisuals?.combat?.[index]||AREA_BACKGROUNDS[index],night=raidBackdrop||day.replace(/(\.[^.]+)$/,'-night$1');
    const required=[day,night];
    if(!ngVisuals&&!raidBackdrop)for(const layer of def.layers){required.push(`${ROOT}${layer}-${key}.png`,`${ROOT}${layer}-${key}-night.png`)}
    await Promise.all(required.map(readyImage));
    if(token!==prepareToken)return;
    const spriteSources=[...document.querySelectorAll('#enemyArt img[src],#playerArt img[src]')].map(img=>img.getAttribute('src')).filter(Boolean);
    await Promise.all(spriteSources.map(src=>window.ensureSceneImage?.(src)));
    if(token!==prepareToken)return;
    combatScreen.classList.toggle('ngplus-scene',!!ngVisuals);
    combatScreen.style.backgroundImage=`linear-gradient(rgba(12,15,20,.16),rgba(12,15,20,.22)),url("${day}")`;
    combatScreen.style.backgroundSize='cover';combatScreen.style.backgroundPosition='center';
    const nightLayer=document.getElementById('combatNightLayer');
    if(nightLayer){nightLayer.dataset.daySrc=day;nightLayer.dataset.nightSrc=night;nightLayer.style.backgroundImage=`url("${night}")`;nightLayer.style.opacity=raidBackdrop?'0':Math.max(0,Math.min(1,window.gameClock?.getState?.()?.nightBlend??0)).toFixed(4)}
    if(!ngVisuals&&!raidBackdrop)rebuildCombatTextureStage();
    const blend=Math.max(0,Math.min(1,window.gameClock?.getState?.()?.nightBlend??0));
    field.querySelectorAll('.combat-texture-layer.day').forEach(el=>el.style.opacity=(1-blend).toFixed(4));
    field.querySelectorAll('.combat-texture-layer.night').forEach(el=>el.style.opacity=blend.toFixed(4));
    await nextPaint();
  };
  function syncCombatTextureStage(){
    const combatScreen=document.getElementById('combat');
    if(!combatScreen?.classList.contains('active'))return;
    if(window.villageRaid?.active){const field=document.querySelector('#combat .battle-field');field?.querySelector('.combat-texture-behind')?.remove();field?.querySelector('.combat-texture-front')?.remove();return}
    if(state.ng&&window.getNgPlusVisuals?.()){
      combatScreen.classList.add('ngplus-scene');
      const field=document.querySelector('#combat .battle-field');
      field?.querySelector('.combat-texture-behind')?.remove();field?.querySelector('.combat-texture-front')?.remove();
      return;
    }
    combatScreen.classList.remove('ngplus-scene');
    rebuildCombatTextureStage();
    const blend=Math.max(0,Math.min(1,window.gameClock?.getState?.()?.nightBlend??0));
    document.querySelectorAll('#combat .combat-texture-layer.day').forEach(el=>el.style.opacity=(1-blend).toFixed(4));
    document.querySelectorAll('#combat .combat-texture-layer.night').forEach(el=>el.style.opacity=blend.toFixed(4));
  }
  syncCombatTextureStage();setInterval(syncCombatTextureStage,180);
})();

/* ===== Expanded Postgame + New Game Plus ===== */
(()=>{
  const POSTGAME_MAP_ROOT='Textures/UI/Postgame/Maps/';
  const NG_MONSTER_ROOT='Textures/Monsters/NGPlus/';
  const ROUTE_BY_CHOICE={
    male:{king:'male-king',destroy:'male-destroy',empty:'male-empty'},
    female:{stay:'female-stay',travel:'female-travel',friends:'female-friends'}
  };
  const POSTGAME_ROUTES={
    'male-king':{
      id:'male-king',gender:'male',choice:'king',
      label:'CROWNHOLD ASCENDANT',
      title:'Crownhold Ascendant',
      short:'You took the throne and turned victory into rule.',
      map:`${POSTGAME_MAP_ROOT}route-male-king.png`,
      perk:'Monarch’s Authority',
      perkDesc:'Start NG+ with +25 coins and +1 weapon level.',
      worldIntro:'The kingdom now flies your banner. Roads are safer, officials are louder, and every village thinks it deserves a royal answer.',
      village:'Placenta Creek has become a bustling royal frontier with tax ledgers, goose patrols, and too many petitions.',
      areaNotes:[
        'Placenta Creek now hosts tax collectors, royal patrols, and opportunistic petitioners.',
        'Mild Inconvenience has become a protected crown wood where poachers test your rule.',
        'Grave Mistake now hides the restless remains of nobles who resent your coronation.',
        'Questionable Decisions has been repurposed into a trial maze for ambitious officials.',
        'Dread Fortress is no longer abandoned — it is your capital, and not all of its ghosts approve.'
      ],
      eliteByHub:['Petition Beast','Rogue Goose Marshal','Crown Revenant','Petition Beast','Crown Revenant'],
      finalBoss:'Crown Revenant',
      quests:[
        {id:'crown-charter',type:'choice',title:'The Crown Charter',desc:'Choose the tone of your reign and define how the rebuilt kingdom will serve its people.',choices:[
          {label:'Establish fair law courts',notice:'You establish traveling courts and the people quietly begin to trust the crown again.',reward:{coins:15,reputation:2,peace:1}},
          {label:'Invest in defenses first',notice:'Watchtowers and patrols rise across the kingdom. Safety improves — so does your authority.',reward:{coins:10,materials:{steel:1},renown:2}},
          {label:'Fund markets and roads',notice:'Merchants cheer. The treasury groans. Trade surges across the realm.',reward:{coins:25,reputation:1,insight:1}}
        ]},
        {id:'petition-circuit',type:'choice',title:'The Petition Circuit',desc:'Every hamlet has a complaint, a request, or a cousin who insists they deserve a title.',choices:[
          {label:'Hear every complaint personally',notice:'Exhausting, but effective. Your reputation improves with the common folk.',reward:{coins:8,reputation:2,peace:1}},
          {label:'Delegate to village councils',notice:'Local leaders finally get authority, and the kingdom grows more stable.',reward:{coins:12,insight:2}},
          {label:'Create a goose-led courier network',notice:'It is ridiculous. It also works.',reward:{coins:18,reputation:1,materials:{leather:1}}}
        ]},
        {id:'royal-audit',type:'battle',title:'The Royal Audit',desc:'An entire mountain of unanswered paperwork has awakened into a bureaucratic horror.',enemy:'Petition Beast',level:5,notice:'The Petition Beast is defeated. The backlog has been dramatically reduced.',reward:{coins:30,materials:{steel:2},renown:2}},
        {id:'revenant-throne',type:'battle',title:'The Revenant Throne',desc:'The first king buried beneath the fortress has risen to test whether you are worthy of the crown.',enemy:'Crown Revenant',level:5,notice:'The Crown Revenant falls, and the throne room finally accepts its new ruler.',reward:{coins:35,materials:{steel:2,bones:2},renown:3}}
      ]
    },
    'male-destroy':{
      id:'male-destroy',gender:'male',choice:'destroy',
      label:'ASHEN REPUBLIC',title:'Ashen Republic',short:'You shattered the throne and forced the world to rebuild without it.',
      map:`${POSTGAME_MAP_ROOT}route-male-destroy.png`,
      perk:'Breaker of Crowns',perkDesc:'Start NG+ with +4 max HP, +2 demon steel, and +1 armor level.',
      worldIntro:'Without a throne, every region now decides what freedom means. Some build. Some burn. Some miss having someone else to blame.',
      village:'Placenta Creek has become a council town full of scaffolds, loud debates, and people discovering self-government in real time.',
      areaNotes:[
        'Placenta Creek is rebuilding itself with a citizen council and a suspicious amount of scaffolding.',
        'Mild Inconvenience now shelters free camps, salvage crews, and monsters displaced by the old regime.',
        'Grave Mistake has become a memorial field where unresolved history still crawls out of the dirt.',
        'Questionable Decisions houses citizen trials, republic puzzles, and badly drawn maps.',
        'Dread Fortress lies in ruins, but the embers of the old crown continue to animate its armor.'
      ],
      eliteByHub:['Ashen Throne Warden','Rogue Goose Marshal','Ashen Throne Warden','Roadshade Mimic','Ashen Throne Warden'],
      finalBoss:'Ashen Throne Warden',
      quests:[
        {id:'ruin-council',type:'choice',title:'The Ruin Council',desc:'The first free council cannot agree on whether to preserve the old fortress or pick it clean.',choices:[
          {label:'Preserve the ruins as a warning',notice:'The ruins become a monument to what the kingdom survived.',reward:{coins:12,peace:2}},
          {label:'Strip the fortress for materials',notice:'Stone and metal pour into rebuilding efforts across the realm.',reward:{coins:18,materials:{steel:2},renown:1}},
          {label:'Turn the courtyard into a public forum',notice:'People argue there constantly. It is oddly healthy.',reward:{coins:10,reputation:2,insight:1}}
        ]},
        {id:'bridgework',type:'choice',title:'Bridgework',desc:'Trade cannot recover until the old roads and bridges are rebuilt.',choices:[
          {label:'Repair the great stone bridges',notice:'Major routes open again and isolated towns can finally trade.',reward:{coins:20,materials:{bones:1},peace:1}},
          {label:'Build smaller local crossings everywhere',notice:'Less impressive, much more practical.',reward:{coins:14,reputation:2}},
          {label:'Hire monster-proof engineers',notice:'The bridges survive. The engineers charge accordingly.',reward:{coins:22,materials:{steel:1},insight:1}}
        ]},
        {id:'embers-below',type:'battle',title:'Embers Below',desc:'A charred guardian now marches through the broken keep with molten rage in its armor.',enemy:'Ashen Throne Warden',level:5,notice:'The Ashen Throne Warden crumbles, and the hottest remnants of the old monarchy finally cool.',reward:{coins:32,materials:{steel:2,bones:1},renown:2}},
        {id:'goose-marshals',type:'battle',title:'Marshal of the Free Roads',desc:'A royal goose refused to accept the monarchy’s end and declared itself protector of the republic.',enemy:'Rogue Goose Marshal',level:5,notice:'The Rogue Goose Marshal is routed. The roads are ridiculous but free.',reward:{coins:28,materials:{leather:2},reputation:2}}
      ]
    },
    'male-empty':{
      id:'male-empty',gender:'male',choice:'empty',
      label:'WANDERER’S WAKE',title:'Wanderer’s Wake',short:'You walked away from power, and the world became a road instead of a throne room.',
      map:`${POSTGAME_MAP_ROOT}route-male-empty.png`,
      perk:'The Wanderer',perkDesc:'Start NG+ with extra travel stock: +18 coins, +2 leather, +1 bones.',
      worldIntro:'The realm never forgot that you refused the crown. Inns, camps, shrines, and caravans now trace the roads you chose instead.',
      village:'Placenta Creek has become the best stop on the kingdom’s road network — part market, part adventurer camp, part rumor mill.',
      areaNotes:[
        'Placenta Creek is now a caravan town full of merchants, tents, and returning adventurers.',
        'Mild Inconvenience shelters ranger camps and roadwardens who guard the wild trails.',
        'Grave Mistake has become a pilgrimage route for people seeking closure and better loot.',
        'Questionable Decisions is now charted by traveling guides who still get lost anyway.',
        'Dread Fortress is a distant landmark — not a capital, but a warning on the horizon.'
      ],
      eliteByHub:['Roadshade Mimic','Roadshade Mimic','Rogue Goose Marshal','Roadshade Mimic','Roadshade Mimic'],
      finalBoss:'Roadshade Mimic',
      quests:[
        {id:'camp-charter',type:'choice',title:'The Camp Charter',desc:'Travelers ask you to help define the great free camps that now tie the kingdom together.',choices:[
          {label:'Protect camps with watchfires and scouts',notice:'Every camp gains a reliable beacon. The roads feel safer overnight.',reward:{coins:14,peace:2}},
          {label:'Encourage trade hubs and night markets',notice:'Business booms and the roads start glowing after sunset.',reward:{coins:22,reputation:1}},
          {label:'Bless the roads with shrines and markers',notice:'Pilgrims, merchants, and monsters all appreciate better directions.',reward:{coins:16,insight:2}}
        ]},
        {id:'story-exchange',type:'choice',title:'Stories for Supper',desc:'The camps begin preserving heroic stories, and everyone wants yours first.',choices:[
          {label:'Share the truth, even the ugly parts',notice:'The roads begin remembering you honestly, not just heroically.',reward:{coins:10,reputation:2,insight:1}},
          {label:'Tell the funniest version',notice:'You become a legend in taverns and roadside stages.',reward:{coins:18,renown:2}},
          {label:'Teach younger travelers instead',notice:'A whole generation of wanderers leaves better prepared.',reward:{coins:14,peace:1,reputation:1}}
        ]},
        {id:'market-in-the-dark',type:'battle',title:'Market in the Dark',desc:'A smiling merchant on the road has been swallowing wagons, mules, and bargaining tables whole.',enemy:'Roadshade Mimic',level:5,notice:'The Roadshade Mimic is exposed and defeated. The caravans cheer nervously.',reward:{coins:30,materials:{leather:2,steel:1},renown:2}},
        {id:'marshals-test',type:'battle',title:'Marshal’s Test',desc:'One very judgmental goose has decided the roads need a champion.',enemy:'Rogue Goose Marshal',level:5,notice:'The Marshal yields. The roads now belong to everyone again.',reward:{coins:24,materials:{leather:2},reputation:2}}
      ]
    },
    'female-stay':{
      id:'female-stay',gender:'female',choice:'stay',
      label:'ROSEGLASS REIGN',title:'Roseglass Reign',short:'You stayed with Lucien and rebuilt both the castle and the person who once hid inside it.',
      map:`${POSTGAME_MAP_ROOT}route-female-stay.png`,
      perk:'Rose Oath',perkDesc:'Start NG+ with Heal and Purify unlocked, +1 magic level, and a small bond bonus.',
      worldIntro:'The fortress is no longer a place of fear. Together, you and Lucien have turned it into a living court of repair, grace, and second chances.',
      village:'Placenta Creek now trades with the restored castle and jokes endlessly about the kingdom’s surprisingly wholesome royal couple.',
      areaNotes:[
        'Placenta Creek is thriving under a softer court, with artisans, visitors, and fewer terrified rumors.',
        'Mild Inconvenience has gained guarded gardens and sanctuaries around once-cursed paths.',
        'Grave Mistake now hosts memorial rites that help the dead rest and the living heal.',
        'Questionable Decisions has become a wing of castle trials, diplomacy puzzles, and emotional honesty.',
        'Dread Fortress has been transformed into a rebuilt court with gardens, fountains, and rooms that finally have sunlight.'
      ],
      eliteByHub:['Lucien Redeemed','Peacemaker Sentinel','Lucien Redeemed','Peacemaker Sentinel','Lucien Redeemed'],
      finalBoss:'Lucien Redeemed',
      quests:[
        {id:'rose-court',type:'choice',title:'The Rose Court',desc:'People begin arriving at the rebuilt court looking for justice, refuge, and a less alarming Lucien.',choices:[
          {label:'Open the halls to petitions and mercy',notice:'The court becomes famous for fairness and comfort instead of fear.',reward:{coins:12,reputation:2,peace:1}},
          {label:'Train the castle guard in compassion',notice:'It is difficult, but the fortress becomes gentler without becoming weak.',reward:{coins:14,renown:1,peace:2}},
          {label:'Fund public feasts and celebrations',notice:'Morale soars. The kitchens, somehow, survive.',reward:{coins:20,reputation:1}}
        ]},
        {id:'west-wing',type:'choice',title:'The West Wing Restoration',desc:'A whole side of the castle still feels haunted by old habits and broken stone.',choices:[
          {label:'Restore it as living quarters',notice:'The castle fills with life, warmth, and actual curtains.',reward:{coins:18,peace:1}},
          {label:'Turn it into a healing hall',notice:'Travelers now make pilgrimages for aid instead of hiding from the keep.',reward:{coins:10,reputation:2,insight:1}},
          {label:'Create a gallery of truth and memory',notice:'The court chooses remembrance over revision.',reward:{coins:12,insight:2}}
        ]},
        {id:'vow-of-lucien',type:'battle',title:'Lucien’s Vow',desc:'Lucien asks for one honest duel — not out of cruelty, but to prove the man he has chosen to become.',enemy:'Lucien Redeemed',level:5,notice:'The duel ends in trust. Lucien’s vow to protect this new future is complete.',reward:{coins:28,materials:{steel:1},reputation:2,peace:1}},
        {id:'sentinel-peace',type:'battle',title:'Sentinel of Peace',desc:'A ceremonial guardian manifests to judge whether the rebuilt castle truly deserves the peace it claims.',enemy:'Peacemaker Sentinel',level:5,notice:'The Sentinel bows. The rebuilt court is recognized as a place of peace.',reward:{coins:32,materials:{steel:2},insight:2}}
      ]
    },
    'female-travel':{
      id:'female-travel',gender:'female',choice:'travel',
      label:'ROAD OF TWO CROWNS',title:'Road of Two Crowns',short:'You took Lucien on the road, and the kingdom’s future started moving instead of sitting still.',
      map:`${POSTGAME_MAP_ROOT}route-female-travel.png`,
      perk:'Companion’s Resolve',perkDesc:'Start NG+ with +20 coins, a potion bundle, and +1 weapon level.',
      worldIntro:'You and Lucien become living legends of the road: a queenly wanderer and a reformed monarch collecting promises, problems, and surprisingly tender campfire stories.',
      village:'Placenta Creek is the first and favorite stop on your route — a place where travelers now trade gossip about your latest absurd journey.',
      areaNotes:[
        'Placenta Creek has embraced its place as the great crossroads of your shared journey.',
        'Mild Inconvenience is now crossed by escort routes, ranger fires, and temporary royal camps.',
        'Grave Mistake has become a haunted road where old regrets still ask to travel beside you.',
        'Questionable Decisions is charted by stories, landmarks, and jokes only repeat travelers understand.',
        'Dread Fortress stands in the distance while its former ruler chooses the road with you instead.'
      ],
      eliteByHub:['Roadshade Mimic','Lucien Redeemed','Roadshade Mimic','Rogue Goose Marshal','Lucien Redeemed'],
      finalBoss:'Roadshade Mimic',
      quests:[
        {id:'caravan-oath',type:'choice',title:'The Caravan Oath',desc:'A growing caravan of followers wants a code to travel under your protection.',choices:[
          {label:'Protect the weak first',notice:'Your caravan becomes known for escorting those who cannot protect themselves.',reward:{coins:14,peace:2}},
          {label:'Prioritize supplies and readiness',notice:'The caravan grows tougher, quicker, and better fed.',reward:{coins:20,materials:{leather:2}}},
          {label:'Make every camp a festival',notice:'Morale and recruitment both soar. So do camp cleanup problems.',reward:{coins:18,reputation:2}}
        ]},
        {id:'letters-home',type:'choice',title:'Letters Home',desc:'The people you help along the road begin sending letters back to the places you once saved.',choices:[
          {label:'Deliver every letter yourself',notice:'The kingdom starts to feel connected in a way it never has before.',reward:{coins:12,reputation:2,insight:1}},
          {label:'Build a rider network',notice:'Messages fly between settlements with surprising speed.',reward:{coins:16,renown:1,peace:1}},
          {label:'Turn them into a travel journal',notice:'Your story becomes a map others can follow.',reward:{coins:10,insight:2}}
        ]},
        {id:'campfire-duel',type:'battle',title:'Campfire Duel',desc:'Lucien spars beside the caravan fire to sharpen both of you for the road ahead.',enemy:'Lucien Redeemed',level:5,notice:'The duel leaves both of you stronger, and the caravan a little more inspired.',reward:{coins:26,materials:{steel:1},renown:2}},
        {id:'hungry-crossroads',type:'battle',title:'Hungry Crossroads',desc:'A mimic merchant has disguised itself as the most convenient roadside shop in the realm.',enemy:'Roadshade Mimic',level:5,notice:'The Roadshade Mimic is defeated and the crossroads breathe easier.',reward:{coins:30,materials:{leather:2,bones:1},reputation:1}}
      ]
    },
    'female-friends':{
      id:'female-friends',gender:'female',choice:'friends',
      label:'QUIET ACCORD',title:'Quiet Accord',short:'You gave Lucien a second chance without demanding a fairytale, and the world changed because of that restraint.',
      map:`${POSTGAME_MAP_ROOT}route-female-friends.png`,
      perk:'Accord Keeper',perkDesc:'Start NG+ with +1 armor level, +1 magic level, and bonus codex/legacy progress.',
      worldIntro:'The former tyrant is now learning how to live among people, and you have helped turn the old stronghold into a school, refuge, and place of uneasy but honest peace.',
      village:'Placenta Creek exchanges scholars, supplies, and terrible jokes with the new refuge-fortress built on friendship instead of fear.',
      areaNotes:[
        'Placenta Creek now hosts visiting students, diplomats, and people who thought they were done with history.',
        'Mild Inconvenience contains field camps and lessons in survival, scouting, and restraint.',
        'Grave Mistake studies the past directly, helping lay old curses to rest through knowledge.',
        'Questionable Decisions has become a training maze for mediators, tacticians, and truth-tellers.',
        'Dread Fortress is now a refuge-academy where rivals, refugees, and reformed monsters share the same walls.'
      ],
      eliteByHub:['Peacemaker Sentinel','Lucien Redeemed','Peacemaker Sentinel','Peacemaker Sentinel','Peacemaker Sentinel'],
      finalBoss:'Peacemaker Sentinel',
      quests:[
        {id:'accord-charter',type:'choice',title:'The Accord Charter',desc:'The new refuge needs a clear purpose before the old fears return.',choices:[
          {label:'Make it a sanctuary first',notice:'The fortress opens its gates to the displaced and the afraid.',reward:{coins:12,peace:2,reputation:1}},
          {label:'Make it an academy first',notice:'Learning, training, and better decisions begin to define the place.',reward:{coins:10,insight:2}},
          {label:'Balance sanctuary and study',notice:'The accord grows more slowly, but on steadier foundations.',reward:{coins:14,peace:1,insight:1}}
        ]},
        {id:'memory-garden',type:'choice',title:'The Memory Garden',desc:'A space is needed where the kingdom can remember the past without living inside it.',choices:[
          {label:'Honor the fallen with names and light',notice:'Families and travelers finally have a place to grieve together.',reward:{coins:10,reputation:2,peace:1}},
          {label:'Fill it with lessons and records',notice:'The garden becomes both memorial and living archive.',reward:{coins:12,insight:2}},
          {label:'Invite the villages to shape it',notice:'The garden becomes a shared promise instead of a private monument.',reward:{coins:16,reputation:1,peace:1}}
        ]},
        {id:'sentinel-trial',type:'battle',title:'The Sentinel Trial',desc:'A guardian of measured peace manifests to test the refuge’s purpose.',enemy:'Peacemaker Sentinel',level:5,notice:'The Peacemaker Sentinel accepts the accord and the refuge is sanctified.',reward:{coins:30,materials:{steel:2},peace:2}},
        {id:'reckoning-friend',type:'battle',title:'Friendly Reckoning',desc:'Lucien asks for one hard conversation and one honest spar to prove your new accord is real.',enemy:'Lucien Redeemed',level:5,notice:'The spar ends with understanding instead of resentment. The accord holds.',reward:{coins:26,materials:{bones:1},insight:2,reputation:1}}
      ]
    }
  };

  const ELITE_SPRITES={
    'Crown Revenant':`${NG_MONSTER_ROOT}crown-revenant.png`,
    'Petition Beast':`${NG_MONSTER_ROOT}petition-beast.png`,
    'Ashen Throne Warden':`${NG_MONSTER_ROOT}ashen-throne-warden.png`,
    'Rogue Goose Marshal':`${NG_MONSTER_ROOT}rogue-goose-marshal.png`,
    'Lucien Redeemed':`${NG_MONSTER_ROOT}lucien-redeemed.png`,
    'Roadshade Mimic':`${NG_MONSTER_ROOT}roadshade-mimic.png`,
    'Peacemaker Sentinel':`${NG_MONSTER_ROOT}peacemaker-sentinel.png`,
    'Timeline Devourer':`${NG_MONSTER_ROOT}timeline-devourer.png`
  };
  Object.entries(ELITE_SPRITES).forEach(([k,v])=>ASSETS[k]=v);
  /* The base codex lives inside an older private module, so keep NG+ entries in a
     public registry instead of touching that inaccessible lexical constant. */
  window.NGPLUS_CODEX_ENTRIES=[['Crown Revenant','The throne room’s oldest monarch, resurrected to judge every crown that follows.'],['Petition Beast','A mountain of royal paperwork so neglected that it learned to bite.'],['Ashen Throne Warden','A molten remnant of the old regime, still guarding a throne that no longer exists.'],['Rogue Goose Marshal','An aggressively decorated goose who believes it, and only it, understands law and order.'],['Lucien Redeemed','The former monarch after choosing honesty, restraint, and a better future.'],['Roadshade Mimic','A smiling roadside merchant that is, unfortunately, made of teeth.'],['Peacemaker Sentinel','A ceremonial guardian that tests whether peace is truly deserved.'],['Timeline Devourer','A void-born predator feeding on every route the player has already lived.']];

  function ensureLegacyState(){
    state.meta=state.meta||{};
    state.meta.endingHistory=Array.isArray(state.meta.endingHistory)?state.meta.endingHistory:[];
    state.meta.legacyPerks=Array.isArray(state.meta.legacyPerks)?state.meta.legacyPerks:[];
    state.meta.routeVictories=state.meta.routeVictories&&typeof state.meta.routeVictories==='object'?state.meta.routeVictories:{};
    state.meta.ngPlusCompletions=Number(state.meta.ngPlusCompletions||0);
    state.meta.secretBossDefeated=!!state.meta.secretBossDefeated;
    return state.meta;
  }
  function ensureExpandedEndgame(){
    const e=endgameEnsure();
    e.routeKey=e.routeKey||null;
    e.completedQuests=Array.isArray(e.completedQuests)?e.completedQuests:[];
    e.challengeWins=Number(e.challengeWins||0);
    e.postgameStats=e.postgameStats&&typeof e.postgameStats==='object'?e.postgameStats:{renown:0,peace:0,insight:0};
    return e;
  }
  function escText(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
  function routeKeyFromState(){
    const e=ensureExpandedEndgame();
    if(e.routeKey&&POSTGAME_ROUTES[e.routeKey])return e.routeKey;
    if(e.route==='male'&&e.throneChoice)return ROUTE_BY_CHOICE.male[e.throneChoice]||'male-king';
    if(e.route==='female'&&e.relationshipChoice)return ROUTE_BY_CHOICE.female[e.relationshipChoice]||'female-stay';
    if(state.meta?.ngPlusRouteKey&&POSTGAME_ROUTES[state.meta.ngPlusRouteKey])return state.meta.ngPlusRouteKey;
    return state.gender==='female'?'female-stay':'male-king';
  }
  function currentRoute(){return POSTGAME_ROUTES[routeKeyFromState()]||POSTGAME_ROUTES['male-king'];}
  function trackEnding(route){
    const meta=ensureLegacyState();
    if(!meta.endingHistory.includes(route.id))meta.endingHistory.push(route.id);
    meta.routeVictories[route.id]=(meta.routeVictories[route.id]||0)+1;
    if(!meta.legacyPerks.includes(route.perk))meta.legacyPerks.push(route.perk);
  }
  function applyBundle(bundle={}){
    const e=ensureExpandedEndgame();
    state.coins=Math.max(0,(state.coins||0)+(bundle.coins||0));
    if(bundle.hp)state.hp=Math.min(state.maxHp,(state.hp||0)+bundle.hp);
    if(bundle.maxHp){state.maxHp=(state.maxHp||30)+bundle.maxHp;state.hp=Math.min(state.maxHp,(state.hp||0)+(bundle.maxHp||0));}
    if(bundle.weaponLevel)state.weaponLevel=(state.weaponLevel||0)+bundle.weaponLevel;
    if(bundle.armorLevel)state.armorLevel=(state.armorLevel||0)+bundle.armorLevel;
    if(bundle.magicLevel)state.magicLevel=(state.magicLevel||0)+bundle.magicLevel;
    if(bundle.materials){Object.entries(bundle.materials).forEach(([k,v])=>state.materials[k]=(state.materials[k]||0)+v)}
    if(bundle.items){state.meta.items=state.meta.items||{};Object.entries(bundle.items).forEach(([k,v])=>state.meta.items[k]=(state.meta.items[k]||0)+v)}
    if(bundle.unlockSpells){state.meta.spells=state.meta.spells||{};bundle.unlockSpells.forEach(k=>state.meta.spells[k]=true)}
    if(bundle.reputation)e.reputation=(e.reputation||0)+bundle.reputation;
    if(bundle.lucienRelationship)e.lucienRelationship=(e.lucienRelationship||0)+bundle.lucienRelationship;
    if(bundle.renown)e.postgameStats.renown=(e.postgameStats.renown||0)+bundle.renown;
    if(bundle.peace)e.postgameStats.peace=(e.postgameStats.peace||0)+bundle.peace;
    if(bundle.insight)e.postgameStats.insight=(e.postgameStats.insight||0)+bundle.insight;
  }
  function legacySummary(){
    const meta=ensureLegacyState();
    return `${meta.endingHistory.length} route${meta.endingHistory.length===1?'':'s'} remembered · ${meta.legacyPerks.length} legacy perk${meta.legacyPerks.length===1?'':'s'} unlocked`;
  }
  function findQuest(routeKey,questId){
    const r=POSTGAME_ROUTES[routeKey];
    return r?.quests.find(q=>q.id===questId)||null;
  }
  function completeQuestChoice(routeKey,questId,index){
    const route=POSTGAME_ROUTES[routeKey],quest=findQuest(routeKey,questId),e=ensureExpandedEndgame();
    if(!route||!quest||quest.type!=='choice')return;
    const choice=quest.choices[index]||quest.choices[0];
    if(!e.completedQuests.includes(questId))e.completedQuests.push(questId);
    applyBundle(choice.reward||{});
    save();
    openEndgameHub(choice.notice);
  }
  function startQuestBattle(routeKey,questId){
    const route=POSTGAME_ROUTES[routeKey],quest=findQuest(routeKey,questId),e=ensureExpandedEndgame();
    if(!route||!quest||quest.type!=='battle')return;
    e.challengeActive=true;
    e.challengeQuest=questId;
    e.challengeRouteKey=routeKey;
    endgameClose();
    startCombat(quest.enemy,true,quest.level||5);
    $('#battlePrompt').textContent=quest.title;
    $('#battleDetail').textContent=quest.desc;
    save();
  }
  function secretBossAvailable(){return ensureLegacyState().endingHistory.length>=3;}
  function startSecretTimelineBoss(){
    const e=ensureExpandedEndgame(),stage=Math.max(0,Math.min(2,Number(e.shatteredStage||0)));
    const steps=[
      {enemy:'Crown Revenant',title:'The Shattered Gate',detail:'The first broken timeline is guarded by a king who refuses to remain history.'},
      {enemy:'Legacy Echo',title:'The Hero Who Was',detail:'The realm reconstructs a hostile echo of the hero who created this world.'},
      {enemy:'Timeline Devourer',title:'The True Bummer',detail:'A creature between timelines has noticed how often this world is restarted.'}
    ];
    const step=steps[stage];
    e.challengeActive=true;e.challengeQuest=`shattered-${stage}`;e.challengeRouteKey=routeKeyFromState();e.specialCombatBackdrop='Textures/Maps/NGPlus/shattered-realm.jpg';
    endgameClose();
    startCombat(step.enemy,true,5);
    $('#battlePrompt').textContent=step.title;
    $('#battleDetail').textContent=step.detail;
    save();
  }
  const oldVictory=victory;
  victory=function(){
    if(combat?._victoryShown)return;
    const e=state.endgame;
    if(e?.challengeActive){
      combat._victoryShown=true;
      state.meta=state.meta||{};
      state.meta.codexUnlocked=Array.isArray(state.meta.codexUnlocked)?state.meta.codexUnlocked:[];
      if(combat?.enemy&&!state.meta.codexUnlocked.includes(combat.enemy))state.meta.codexUnlocked.push(combat.enemy);
      state.hp=Math.max(1,combat.playerHp);
      e.challengeActive=false;
      e.challengeWins=(e.challengeWins||0)+1;
      let notice='Challenge cleared!';
      if(/^shattered-/.test(e.challengeQuest||'')){
        const stage=Number(String(e.challengeQuest).split('-')[1]||0);
        e.specialCombatBackdrop=null;
        if(stage===0){
          e.shatteredStage=1;applyBundle({coins:25,materials:{bones:1},renown:1});
          notice='The Shattered Gate breaks open. Something wearing your old silhouette waits deeper inside.';
        }else if(stage===1){
          e.shatteredStage=2;applyBundle({coins:35,materials:{steel:1},insight:2});
          notice='Your Legacy Echo falls. The final path opens toward the thing consuming every timeline.';
        }else{
          e.shatteredStage=3;if(!e.completedQuests.includes('timeline-devourer'))e.completedQuests.push('timeline-devourer');
          ensureLegacyState().secretBossDefeated=true;
          applyBundle({coins:75,materials:{steel:4,bones:2,leather:2},renown:3,insight:3,peace:2});
          notice='The Timeline Devourer is defeated. The Shattered Realm seals, and the world remembers every route you lived.';
        }
      }else if(e.challengeQuest==='timeline-devourer'){
        e.specialCombatBackdrop=null;
        if(!e.completedQuests.includes('timeline-devourer'))e.completedQuests.push('timeline-devourer');
        ensureLegacyState().secretBossDefeated=true;
        applyBundle({coins:60,materials:{steel:3,bones:2,leather:2},renown:3,insight:3});
        notice='The Timeline Devourer is defeated. The world remembers every route you lived.';
      }else{
        e.specialCombatBackdrop=null;
        const quest=findQuest(e.challengeRouteKey||routeKeyFromState(),e.challengeQuest);
        if(quest){
          if(!e.completedQuests.includes(quest.id))e.completedQuests.push(quest.id);
          applyBundle(quest.reward||{coins:20,materials:{steel:2}});
          notice=quest.notice||'Challenge cleared!';
        }else{
          applyBundle({coins:20,materials:{steel:2}});
        }
      }
      save();
      openEndgameHub(notice);
      return;
    }
    return oldVictory();
  };

  openEndgameEnding=function(){
    const e=ensureExpandedEndgame();
    e.route=state.gender==='female'?'female':'male';
    e.unlocked=false;
    endgameOpen('endgameEnding');
    const c=$('#endgameEndingContent');
    if(e.route==='male'){
      $('#endgameEnding').style.backgroundImage='url("Textures/UI/Endgame/Throne-Destroy.png")';
      c.innerHTML=`<div class="endgame-kicker">Finale · Male Savior</div><h1 class="endgame-title">Choose the Kingdom You Leave Behind</h1><p class="endgame-copy">Lucien is gone, but the world ahead is not simple. Your last choice decides the tone of the postgame and the world that New Game+ will inherit.</p><div class="endgame-choice-grid">${[
        ['king','Become King','Sit on the throne and rebuild as ruler. Unlock <b>Crownhold Ascendant</b>.','Textures/UI/Endgame/Throne-Become-King.png'],
        ['destroy','Destroy the Throne','Break the old symbol and force the kingdom to rebuild free. Unlock <b>Ashen Republic</b>.','Textures/UI/Endgame/Throne-Destroy.png'],
        ['empty','Leave It Empty','Refuse power and let the roads become your legacy. Unlock <b>Wanderer’s Wake</b>.','Textures/UI/Endgame/Throne-Leave-Empty.png']
      ].map(x=>`<button class="endgame-choice" data-end-choice="${x[0]}"><img src="${x[3]}" alt=""><b>${x[1]}</b><small>${x[2]}</small></button>`).join('')}</div>`;
      c.querySelectorAll('[data-end-choice]').forEach(b=>b.onclick=()=>endgameChooseMale(b.dataset.endChoice));
    }else{
      $('#endgameEnding').style.backgroundImage='url("Textures/UI/Endgame/Throne-Leave-Empty.png")';
      c.innerHTML=`<div class="endgame-kicker">Finale · Female Savior</div><h1 class="endgame-title">Choose the Future You Build with Lucien</h1><p class="endgame-copy">Your decision now shapes the postgame route, Lucien’s role in the world, and the emotional flavor of New Game+.</p><div class="endgame-choice-grid">${[
        ['stay','Stay With Lucien','Rebuild the castle together and create a gentler court. Unlock <b>Roseglass Reign</b>.','Textures/UI/Endgame/Lucien-Emotional.png'],
        ['travel','Travel Together','Take the former monarch on the road and change the realm one campfire at a time. Unlock <b>Road of Two Crowns</b>.','Textures/UI/Endgame/Lucien-Companion.png'],
        ['friends','Remain Friends','Build a future based on honesty, peace, and a deliberate second chance. Unlock <b>Quiet Accord</b>.','Textures/UI/Endgame/Lucien-Vulnerable.png']
      ].map(x=>`<button class="endgame-choice" data-end-choice="${x[0]}"><img src="${x[3]}" alt=""><b>${x[1]}</b><small>${x[2]}</small></button>`).join('')}</div>`;
      c.querySelectorAll('[data-end-choice]').forEach(b=>b.onclick=()=>endgameChooseFemale(b.dataset.endChoice));
    }
  };

  endgameChooseMale=function(choice){
    const e=ensureExpandedEndgame();
    const route=POSTGAME_ROUTES[ROUTE_BY_CHOICE.male[choice]||'male-king'];
    e.route='male';e.throneChoice=choice;e.routeKey=route.id;e.unlocked=true;state.won=true;trackEnding(route);save();openEndgameHub(`${route.title} unlocked. ${route.short}`);
  };
  endgameChooseFemale=function(choice){
    const e=ensureExpandedEndgame();
    const route=POSTGAME_ROUTES[ROUTE_BY_CHOICE.female[choice]||'female-stay'];
    e.route='female';e.relationshipChoice=choice;e.routeKey=route.id;e.unlocked=true;state.won=true;trackEnding(route);save();openEndgameHub(`${route.title} unlocked. ${route.short}`);
  };

  openEndgameHub=function(notice='',focusQuest=null){
    const e=ensureExpandedEndgame(),route=currentRoute();
    endgameOpen('endgameHub');
    const c=$('#endgameHubContent');
    const stats=e.postgameStats||{renown:0,peace:0,insight:0};
    const quests=route.quests.map(q=>{
      const done=e.completedQuests.includes(q.id);
      return `<div class="endgame-quest ${done?'done':''}"><h3>${done?'✓ ':''}${escText(q.title)}</h3><p>${escText(q.desc)}</p>${done?'<button disabled>Completed</button>':`<button data-route-quest="${escText(q.id)}">${q.type==='battle'?'Begin Battle':'Resolve Quest'}</button>`}</div>`;
    }).join('');
    const shatteredStage=Math.max(0,Number(e.shatteredStage||0)),shatteredDone=e.completedQuests.includes('timeline-devourer');
    const shatteredNames=['The Shattered Gate','The Hero Who Was','The True Bummer'];
    const secretBlock=secretBossAvailable()?`<div class="endgame-quest shattered-realm-card ${shatteredDone?'done':''}"><img src="Textures/Maps/NGPlus/shattered-realm.jpg" alt="The Shattered Realm"><h3>${shatteredDone?'✓ ':''}The Shattered Realm</h3><p>${shatteredDone?'The broken timelines have been sealed.':`Secret gauntlet · Stage ${Math.min(shatteredStage+1,3)}/3 · ${shatteredNames[Math.min(shatteredStage,2)]}`}</p>${shatteredDone?'<button disabled>Completed</button>':'<button id="timelineBossBtn">Enter the Shattered Realm</button>'}</div>`:'';
    const questView=focusQuest&&findQuest(route.id,focusQuest);
    const detail=questView&&questView.type==='choice'?`<div class="endgame-detail-card"><h2>${escText(questView.title)}</h2><p>${escText(questView.desc)}</p><div class="endgame-choice-grid small">${questView.choices.map((choice,i)=>`<button class="endgame-choice compact" data-route-choice="${questView.id}" data-route-choice-index="${i}"><b>${escText(choice.label)}</b><small>${escText(choice.notice)}</small></button>`).join('')}</div><div class="endgame-actions"><button id="backToHubView">Back</button></div></div>`:'';
    c.innerHTML=`<div class="postgame-route-shell">
      <div class="postgame-route-hero">
        <img class="postgame-route-art" src="${route.map}" alt="${escText(route.title)}">
        <div class="postgame-route-copy">
          <div class="endgame-kicker">Postgame Route · ${escText(route.label)}</div>
          <h1 class="endgame-title">${escText(route.title)}</h1>
          <p class="endgame-copy">${escText(route.worldIntro)}</p>
          <div class="endgame-stats">
            <span>Coins: ${state.coins}</span>
            <span>Renown: ${stats.renown||0}</span>
            <span>Peace: ${stats.peace||0}</span>
            <span>Insight: ${stats.insight||0}</span>
            <span>Challenge wins: ${e.challengeWins||0}</span>
          </div>
          <div class="route-perk"><b>Legacy Perk:</b> ${escText(route.perk)} · ${escText(route.perkDesc)}</div>
          <div class="route-village-note"><b>Placenta Creek:</b> ${escText(route.village)}</div>
          <div class="route-legacy-note"><b>Legacy:</b> ${escText(legacySummary())}</div>
          ${notice?`<div class="endgame-notice">${escText(notice)}</div>`:''}
        </div>
      </div>
      <div class="route-world-grid">${route.areaNotes.map((text,i)=>`<div class="route-world-card"><h4>${escText(hubs[i][0])}</h4><p>${escText(text)}</p></div>`).join('')}</div>
      ${detail||`<div class="endgame-hub-card"><h2>Postgame Quests</h2><div class="endgame-quest-grid">${quests}${secretBlock}</div></div>`}
      <div class="endgame-actions"><button id="endgameReturnMap">Return to Overworld</button><button id="endgameNewGame">Start New Game+</button></div>
    </div>`;
    c.querySelectorAll('[data-route-quest]').forEach(b=>b.onclick=()=>{const quest=findQuest(route.id,b.dataset.routeQuest);if(!quest)return;if(quest.type==='battle')startQuestBattle(route.id,quest.id);else openEndgameHub('',quest.id)});
    c.querySelectorAll('[data-route-choice]').forEach(b=>b.onclick=()=>completeQuestChoice(route.id,b.dataset.routeChoice,Number(b.dataset.routeChoiceIndex)||0));
    $('#backToHubView')&&($('#backToHubView').onclick=()=>openEndgameHub(''));
    $('#timelineBossBtn')&&($('#timelineBossBtn').onclick=()=>startSecretTimelineBoss());
    $('#endgameReturnMap').onclick=()=>{endgameClose();renderMap();show('map')};
    $('#endgameNewGame').onclick=()=>endgameNewGamePlus();
  };

  endgameNewGamePlus=function(){
    const e=ensureExpandedEndgame(),route=currentRoute(),meta=ensureLegacyState();
    Object.assign(state,{screen:'map',ng:true,stage:0,hub:0,maxHub:4,progress:[0,0,0,0,0],hp:state.maxHp,maxHp:state.maxHp,coins:30,won:false});
    state.meta=state.meta||{};
    state.meta.ngPlusRouteKey=route.id;
    state.meta.ngPlusWorldName=route.title;
    state.meta.ngPlusCompletions=(state.meta.ngPlusCompletions||0)+1;
    state.meta.codexUnlocked=Array.isArray(state.meta.codexUnlocked)?state.meta.codexUnlocked:[];
    state.meta.ngPlusBonus=route.perk;
    state.meta.ngPlusIntro=route.worldIntro;
    state.endgame={unlocked:false,route:route.gender,routeKey:route.id,newGamePlus:true,throneChoice:null,relationshipChoice:null,reputation:0,lucienRelationship:0,castleRestoration:0,completedQuests:[],challengeWins:0,postgameStats:{renown:0,peace:0,insight:0}};
    applyBundle({
      'male-king':{coins:25,weaponLevel:1},
      'male-destroy':{maxHp:4,armorLevel:1,materials:{steel:2}},
      'male-empty':{coins:18,materials:{leather:2,bones:1}},
      'female-stay':{magicLevel:1,unlockSpells:['heal','purify'],lucienRelationship:1},
      'female-travel':{coins:20,weaponLevel:1,items:{drumstick:2,antidote:1}},
      'female-friends':{armorLevel:1,magicLevel:1,insight:1}
    }[route.id]||{});
    if(meta.endingHistory.length>=2)applyBundle({coins:10,materials:{steel:1}});
    if(meta.endingHistory.length>=4)applyBundle({maxHp:3,weaponLevel:1});
    save();
    endgameClose();
    renderMap();show('map');
    $('#mapStatus').textContent=`New Game+ · ${route.title}: ${route.short} Legacy perk active: ${route.perk}.`;
    sound('confirm');startMusic();
  };

  const oldRenderMap=renderMap;
  renderMap=function(){
    oldRenderMap();
    const route=state.ng&&state.meta?.ngPlusRouteKey?POSTGAME_ROUTES[state.meta.ngPlusRouteKey]:null;
    if(route){
      const canvas=$('#mapCanvas');
      if(canvas){
        canvas.style.backgroundImage=`url("${route.map}")`;
        canvas.style.backgroundSize='cover';
        canvas.style.backgroundPosition='center';
      }
      $$('#hubRow .hub').forEach((hubEl,i)=>{
        const note=document.createElement('small');note.className='ngplus-hub-note';note.textContent=route.areaNotes[i]||'';
        hubEl.querySelector('p')?.appendChild(document.createElement('br'));
        hubEl.querySelector('p')?.appendChild(note);
      });
      $('#mapStatus')&&($('#mapStatus').textContent=`World Remembers · ${route.title}. ${route.areaNotes[state.hub]||route.short}`);
    }
  };

  const oldRenderVillage=renderVillage;
  renderVillage=function(){
    oldRenderVillage();
    const route=state.ng&&state.meta?.ngPlusRouteKey?POSTGAME_ROUTES[state.meta.ngPlusRouteKey]:null;
    if(route&&$('#villageStatus'))$('#villageStatus').textContent=`${route.title} · ${route.village}`;
  };

  window.getNgPlusRouteStory=function(hub,level){
    const route=state.ng&&state.meta?.ngPlusRouteKey?POSTGAME_ROUTES[state.meta.ngPlusRouteKey]:null;
    if(!route)return null;
    const enemy=level>=4?(level===5?(hub===4?(route.finalBoss||route.eliteByHub[hub]||hubs[hub][3]):hubs[hub][3]):(route.eliteByHub[hub]||hubs[hub][4][level-1])):(hub===3?'Maze challenger':hubs[hub][4][level-1]);
    return {routeKey:route.id,world:route.title,area:hubs[hub]?.[0]||'',areaNote:route.areaNotes[hub]||route.short,enemy};
  };
  const oldStartLevel=startLevel;
  startLevel=function(i,level){
    const route=state.ng&&state.meta?.ngPlusRouteKey?POSTGAME_ROUTES[state.meta.ngPlusRouteKey]:null;
    if(route&&level>=4){
      ensureProgress();closeLevelSelect();state.hub=i;state.stage=level-1;
      const enemy=level===5?(i===4?(route.finalBoss||route.eliteByHub[i]||hubs[i][3]):hubs[i][3]):(route.eliteByHub[i]||hubs[i][4][Math.max(0,level-1)]);
      startCombat(enemy,true,level);
      $('#battlePrompt').textContent=`${route.title} · ${hubs[i][0]}`;
      $('#battleDetail').textContent=level===5?`A route-specific elite blocks the final stretch: ${enemy}.`:`An elite memory of ${route.title} has altered this encounter: ${enemy}.`;
      return;
    }
    return oldStartLevel(i,level);
  };
})();

/* ===== NG+ Production Pass 2: world visuals, scaling, legacy board ===== */
(()=>{
  const ROUTE_MAP_ROOT='Textures/UI/Postgame/Maps/';
  const COMBAT_ROOT='Textures/Maps/NGPlus/';
  const routeKey=()=>state.meta?.ngPlusRouteKey||state.endgame?.routeKey||null;
  const isRoyalWorld=key=>['male-king','female-stay','female-friends'].includes(key);
  window.getNgPlusVisuals=function(){
    const key=routeKey();
    if(!state.ng||!key)return null;
    const royal=isRoyalWorld(key);
    return {
      routeKey:key,
      overworldDay:`${ROUTE_MAP_ROOT}route-${key}.png`,
      overworldNight:`${ROUTE_MAP_ROOT}route-${key}-night.png`,
      combat:[
        `${COMBAT_ROOT}${royal?'placenta-royal':'placenta-free'}.jpg`,
        `${COMBAT_ROOT}mild.jpg`,
        `${COMBAT_ROOT}grave.jpg`,
        `${COMBAT_ROOT}question.jpg`,
        `${COMBAT_ROOT}${royal?'fortress-royal':'fortress-ruin'}.jpg`
      ]
    };
  };

  const oldStartCombat=startCombat;
  startCombat=function(enemy,boss,level=state.stage+1){
    oldStartCombat(enemy,boss,level);
    if(!state.ng||!combat)return;
    const cycle=Math.max(1,Number(state.meta?.ngPlusCompletions||1));
    const hpMult=1.32+(cycle-1)*.12+(Math.max(1,Number(level)||1)-1)*.035+(boss?.12:0);
    const damageMult=1.10+(cycle-1)*.075+(boss?.08:0);
    combat.enemyMax=Math.max(1,Math.round(combat.enemyMax*hpMult));
    combat.enemyHp=combat.enemyMax;
    combat.ngDamageMult=damageMult;
    combat.ngTier=cycle;
    combat.ngElite=/Crown Revenant|Petition Beast|Ashen Throne Warden|Rogue Goose Marshal|Lucien Redeemed|Roadshade Mimic|Peacemaker Sentinel|Timeline Devourer/.test(enemy);
    updateBars();
    const levelEl=$('#enemyLevel');if(levelEl)levelEl.textContent=`NG+${cycle} · Lv ${level+state.hub+(combat.ngElite?3:1)}`;
    const stage=$('#combatStage');if(stage)stage.textContent=`${hubs[state.hub][0]} · NG+${cycle} · Level ${level}`;
  };

  function ensureLegacyButton(){
    const controls=document.querySelector(state.screen==='village'?'#village .hud .controls':'#map .hud .controls');
    if(!controls)return;
    let btn=document.getElementById('legacyBtn');
    if(!btn){btn=document.createElement('button');btn.id='legacyBtn';btn.type='button';btn.textContent='Legacy';btn.title='Legacy Board';btn.onclick=openLegacyBoard;}
    if(btn.parentElement!==controls)controls.prepend(btn);
    const history=state.meta?.endingHistory||[];
    btn.style.display=(state.ng||state.won||history.length)?'':'none';
  }
  const ROUTE_CARDS=[
    ['male-king','Crownhold Ascendant','Monarch’s Authority'],
    ['male-destroy','Ashen Republic','Breaker of Crowns'],
    ['male-empty','Wanderer’s Wake','The Wanderer'],
    ['female-stay','Roseglass Reign','Rose Oath'],
    ['female-travel','Road of Two Crowns','Companion’s Resolve'],
    ['female-friends','Quiet Accord','Accord Keeper']
  ];
  function openLegacyBoard(){
    const modal=$('#utilityModal'),card=$('#utilityCard');if(!modal||!card)return;
    const meta=state.meta||{},history=Array.isArray(meta.endingHistory)?meta.endingHistory:[],perks=Array.isArray(meta.legacyPerks)?meta.legacyPerks:[];
    const cycles=Number(meta.ngPlusCompletions||0),secret=!!meta.secretBossDefeated,current=meta.ngPlusRouteKey||state.endgame?.routeKey||'';
    card.innerHTML=`<div class="legacy-board">
      <div class="legacy-board-head"><div><div class="endgame-kicker">THE WORLD REMEMBERS</div><h2>Legacy Board</h2><p>Every completed ending permanently expands the timeline.</p></div><button id="legacyClose">×</button></div>
      <div class="legacy-summary"><span>Routes ${history.length}/6</span><span>NG+ cycles ${cycles}</span><span>Perks ${perks.length}/6</span><span>True Bummer ${secret?'Defeated':'Hidden'}</span></div>
      <div class="legacy-route-grid">${ROUTE_CARDS.map(([id,title,perk])=>{const unlocked=history.includes(id),active=id===current;return `<article class="legacy-route-card ${unlocked?'unlocked':'locked'} ${active?'active':''}"><img src="Textures/UI/Postgame/Maps/route-${id}.png" alt=""><div><b>${unlocked?title:'???'}</b><small>${unlocked?perk:'Complete this ending to reveal its legacy.'}</small>${active?'<em>Current world</em>':''}</div></article>`}).join('')}</div>
      <div class="legacy-perk-list"><h3>Unlocked Legacy Perks</h3><p>${perks.length?perks.map(x=>`<span>${x}</span>`).join(''):'No legacy perks yet.'}</p></div>
      <div class="legacy-secret ${history.length>=3?'available':'locked'}"><h3>${history.length>=3?'The True Bummer is awake':'Secret Timeline Locked'}</h3><p>${history.length>=3?(secret?'The Timeline Devourer has already been defeated.':'Three distinct endings have destabilized the timeline. The hidden postgame battle is now available from the postgame hub.'):`Discover ${Math.max(0,3-history.length)} more distinct ending${3-history.length===1?'':'s'} to reveal the hidden timeline encounter.`}</p></div>
      <div class="utility-actions">${state.won&&state.endgame?.routeKey?'<button id="legacyPostgame">Open Postgame</button>':''}<button id="legacyCloseBottom">Close</button></div>
    </div>`;
    modal.classList.add('open');
    const close=()=>modal.classList.remove('open');
    $('#legacyClose').onclick=close;$('#legacyCloseBottom').onclick=close;
    if($('#legacyPostgame'))$('#legacyPostgame').onclick=()=>{close();openEndgameHub('The Legacy Board returns you to the world you created.')};
  }
  window.openLegacyBoard=openLegacyBoard;
  ensureLegacyButton();setInterval(ensureLegacyButton,600);

  /* Route memories seed extra flavor into NG+ map visits without replacing the normal systems. */
  const oldOpenLevelSelect=openLevelSelect;
  openLevelSelect=function(i){
    oldOpenLevelSelect(i);
    if(!state.ng)return;
    const key=routeKey(),cycle=Math.max(1,Number(state.meta?.ngPlusCompletions||1));
    const hint=$('#levelHint');
    if(hint)hint.textContent=`NG+${cycle} · The world remembers ${key||'your previous ending'}. Levels 4–5 contain route-specific elite encounters.`;
  };

  /* Pre-decode all new NG+ backgrounds so route switching does not flash stale art. */
  const warm=[
    'placenta-royal.jpg','placenta-royal-night.jpg','placenta-free.jpg','placenta-free-night.jpg',
    'mild.jpg','mild-night.jpg','grave.jpg','grave-night.jpg','question.jpg','question-night.jpg',
    'fortress-royal.jpg','fortress-royal-night.jpg','fortress-ruin.jpg','fortress-ruin-night.jpg'
  ].map(x=>COMBAT_ROOT+x).concat(ROUTE_CARDS.flatMap(([id])=>[`${ROUTE_MAP_ROOT}route-${id}.png`,`${ROUTE_MAP_ROOT}route-${id}-night.png`]));
  window.__ngPlusTextureCache=window.__ngPlusTextureCache||new Map();
  warm.forEach(src=>{if(window.__ngPlusTextureCache.has(src))return;const img=new Image();img.decoding='async';img.src=src;const ready=(typeof img.decode==='function'?img.decode().catch(()=>{}):Promise.resolve());window.__ngPlusTextureCache.set(src,{img,ready})});
})();

/* ===== NG+ Production Pass 3: legacy hero + route events ===== */
(()=>{
  function routeFromChoice(gender,choice){
    if(gender==='male')return {king:'male-king',destroy:'male-destroy',empty:'male-empty'}[choice]||'male-king';
    return {stay:'female-stay',travel:'female-travel',friends:'female-friends'}[choice]||'female-stay';
  }
  function captureLegacyHero(routeKey){
    state.meta=state.meta||{};
    const hero={
      name:state.playerName||'Kuro',gender:state.gender||'male',gear:state.gear||'sword',affinity:state.affinity||'water',
      armorSet:Number(state.armorSets?.[state.gender]||0),weaponLevel:Number(state.weaponLevel||0),armorLevel:Number(state.armorLevel||0),
      routeKey,completedAt:Date.now()
    };
    state.meta.legacyHero=hero;
    state.meta.legacyHeroes=Array.isArray(state.meta.legacyHeroes)?state.meta.legacyHeroes:[];
    state.meta.legacyHeroes.push(hero);
    if(state.meta.legacyHeroes.length>8)state.meta.legacyHeroes.splice(0,state.meta.legacyHeroes.length-8);
  }
  const chooseMale=endgameChooseMale,chooseFemale=endgameChooseFemale;
  endgameChooseMale=function(choice){captureLegacyHero(routeFromChoice('male',choice));chooseMale(choice);save()};
  endgameChooseFemale=function(choice){captureLegacyHero(routeFromChoice('female',choice));chooseFemale(choice);save()};

  function legacyHeroMarkup(){
    const h=state.meta?.legacyHero;
    if(!h)return '<div class="paper legacy-echo-placeholder">A previous hero should be here. The timeline misplaced them.</div>';
    const g=h.gender==='female'?'female':'male',set=Math.max(0,Math.min(ARMOR_SETS[g].length-1,Number(h.armorSet||0))),armorKey=ARMOR_SETS[g]?.[set]||ARMOR_SETS[g]?.[0];
    const gearKey=h.gear==='sword'?'Iron Sword':h.gear==='bow'?'Wooden Bow':`${String(h.affinity||'water')[0].toUpperCase()+String(h.affinity||'water').slice(1)} Focus`;
    const armorSrc=asset(armorKey),gearSrc=asset(gearKey);
    return `<div class="layered-doll legacy-echo-doll" role="img" aria-label="Legacy Echo of ${esc(h.name)}"><img class="base-layer" src="${armorSrc}" alt="">${gearSrc?`<img class="gear-layer" style="${layerStyle(gearKey,'gear')}" src="${gearSrc}" alt="">`:''}</div>`;
  }
  const oldEnemySVG=enemySVG;
  enemySVG=function(name,boss){if(name==='Legacy Echo')return legacyHeroMarkup();return oldEnemySVG(name,boss)};
  ENEMY_WARNING_LINES['Legacy Echo']=['Your old stance returns with unsettling precision.','The echo mirrors the way you used to move.','Your previous armor creaks before the strike.','The echo raises your old weapon without hesitation.','A familiar choice flashes behind the echo’s eyes.'];
  ENEMY_SIGNATURE_DEBUFF['Legacy Echo']='Confused';
  window.NGPLUS_CODEX_ENTRIES=window.NGPLUS_CODEX_ENTRIES||[];if(!window.NGPLUS_CODEX_ENTRIES.find(x=>x[0]==='Legacy Echo'))window.NGPLUS_CODEX_ENTRIES.push(['Legacy Echo','A hostile reconstruction of the hero who created the current timeline. It inherits the appearance of the previous completed run.']);

  const ngEvents=[
    {id:'ng-king-tax-goose',title:'The Royal Goose Audit',minHub:0,weight:14,once:false,ngOnly:true,routeKeys:['male-king'],dialog:'A goose in a tiny crown blocks the road with a tax ledger and absolutely no legal authority.',options:[
      {label:'Recognize the office',outcome:'The goose stamps the page and looks extremely satisfied.',reward:[{type:'coins',amount:7}]},
      {label:'Confiscate the fake ledger',outcome:'The paper is surprisingly valuable as crafting stock.',reward:[{type:'leather',amount:1}]},
      {label:'Order the goose home',outcome:'It honks something that sounds like an appeal.',reward:[]}]},
    {id:'ng-king-petition',title:'A Petition About Petitions',minHub:2,weight:10,once:true,ngOnly:true,routeKeys:['male-king'],dialog:'Three villagers request a formal limit on how many formal requests may formally be requested.',options:[
      {label:'Approve the limit',outcome:'The kingdom celebrates by filing significantly fewer forms.',reward:[{type:'coins',amount:12}]},
      {label:'Create a new form for complaints',outcome:'This was probably the wrong lesson.',reward:[{type:'steel',amount:1}]},
      {label:'Walk away slowly',outcome:'The petition follows you by courier.',reward:[]}]},
    {id:'ng-destroy-salvage',title:'Republic Salvage Crew',minHub:0,weight:14,once:false,ngOnly:true,routeKeys:['male-destroy'],dialog:'A citizen crew is dismantling an old royal checkpoint and arguing about who gets the decorative spikes.',options:[
      {label:'Help strip the metal',outcome:'The crew shares the best salvage with you.',reward:[{type:'steel',amount:1}]},
      {label:'Save the old sign for history',outcome:'A collector pays you for the relic.',reward:[{type:'coins',amount:9}]},
      {label:'Let democracy decide',outcome:'The argument becomes a committee.',reward:[]}]},
    {id:'ng-destroy-debate',title:'Roadside Constitutional Crisis',minHub:3,weight:9,once:true,ngOnly:true,routeKeys:['male-destroy'],dialog:'Two councils have produced contradictory road signs and both insist theirs is legally binding.',options:[
      {label:'Merge the rules',outcome:'Nobody is fully happy, which apparently means compromise worked.',reward:[{type:'coins',amount:11}]},
      {label:'Replace both signs',outcome:'The new sign simply says “Use common sense.”',reward:[{type:'leather',amount:1}]},
      {label:'Take the unsigned path',outcome:'It is shorter and somehow less political.',reward:[{type:'hp',amount:3}]}]},
    {id:'ng-empty-campfire',title:'The Campfire That Knows You',minHub:0,weight:14,once:false,ngOnly:true,routeKeys:['male-empty'],dialog:'Travelers recognize you from six mutually contradictory versions of the same story.',options:[
      {label:'Tell the embarrassing version',outcome:'The camp likes you considerably more afterward.',reward:[{type:'coins',amount:8}]},
      {label:'Trade road tips',outcome:'A hunter gives you useful supplies.',reward:[{type:'leather',amount:1}]},
      {label:'Remain mysterious',outcome:'Your legend becomes less accurate and much more impressive.',reward:[]}]},
    {id:'ng-empty-mapmaker',title:'Mapmaker in Distress',minHub:3,weight:10,once:true,ngOnly:true,routeKeys:['male-empty'],dialog:'A mapmaker claims Questionable Decisions physically rearranged itself just to insult him.',options:[
      {label:'Help chart the route',outcome:'You find a valuable cache while marking the correct path.',reward:[{type:'coins',amount:13},{type:'steel',amount:1}]},
      {label:'Add a warning doodle',outcome:'Future travelers may not understand it, but they will remember it.',reward:[{type:'coins',amount:7}]},
      {label:'Tell him to follow the sun',outcome:'He looks at the underground maze entrance and sighs.',reward:[]}]},
    {id:'ng-stay-roses',title:'Lucien’s Extremely Serious Rose Delivery',minHub:0,weight:14,once:false,ngOnly:true,routeKeys:['female-stay'],dialog:'A nervous courier is carrying roses from Lucien and insists the arrangement is “politically neutral.”',options:[
      {label:'Accept the roses',outcome:'The courier visibly relaxes. The flowers smell suspiciously expensive.',reward:[{type:'hp',amount:4}]},
      {label:'Send a teasing reply',outcome:'The courier laughs and gives you the unused delivery fee.',reward:[{type:'coins',amount:8}]},
      {label:'Redirect them to the memorial garden',outcome:'The gesture quietly means more than expected.',reward:[{type:'bones',amount:1}]}]},
    {id:'ng-stay-court',title:'Court Etiquette Emergency',minHub:4,weight:10,once:true,ngOnly:true,routeKeys:['female-stay'],dialog:'A visiting noble has challenged Lucien to a duel over the correct fork for soup.',options:[
      {label:'Cancel the duel',outcome:'The court survives another evening of civilization.',reward:[{type:'coins',amount:12}]},
      {label:'Replace all forks with spoons',outcome:'A surprisingly elegant compromise.',reward:[{type:'steel',amount:1}]},
      {label:'Let Lucien explain etiquette',outcome:'This takes three hours.',reward:[]}]},
    {id:'ng-travel-caravan',title:'Caravan of Copycats',minHub:1,weight:14,once:false,ngOnly:true,routeKeys:['female-travel'],dialog:'A group of adventurers has copied your traveling style, including several decisions you regret.',options:[
      {label:'Teach them the safer version',outcome:'They trade supplies for the lesson.',reward:[{type:'leather',amount:1},{type:'coins',amount:5}]},
      {label:'Lean into the legend',outcome:'They pay for a dramatic retelling around the fire.',reward:[{type:'coins',amount:12}]},
      {label:'Pretend not to be you',outcome:'Lucien ruins the disguise immediately.',reward:[]}]},
    {id:'ng-travel-lucien',title:'Lucien Found a Shortcut',minHub:3,weight:10,once:true,ngOnly:true,routeKeys:['female-travel'],dialog:'Lucien is extremely confident that a narrow glowing tunnel is a shortcut. It is never good when he is this confident.',options:[
      {label:'Take the shortcut',outcome:'Against all reason, it works and leads to a hidden supply chest.',reward:[{type:'steel',amount:1},{type:'coins',amount:8}]},
      {label:'Take the normal road',outcome:'You arrive safely and gain the satisfaction of being correct.',reward:[{type:'hp',amount:4}]},
      {label:'Make Lucien test it first',outcome:'He returns covered in glitter and refuses to discuss it.',reward:[]}]},
    {id:'ng-friends-student',title:'Runaway Academy Student',minHub:0,weight:14,once:false,ngOnly:true,routeKeys:['female-friends'],dialog:'A refuge student skipped diplomacy class to test a homemade monster whistle.',options:[
      {label:'Walk them back to class',outcome:'The instructors reward your patience.',reward:[{type:'coins',amount:8}]},
      {label:'Inspect the whistle',outcome:'It is terrible, but the materials are useful.',reward:[{type:'bones',amount:1}]},
      {label:'Ask what it summons',outcome:'Something answers from the forest. The student runs.',reward:[]}]},
    {id:'ng-friends-archive',title:'The Missing Archive Page',minHub:2,weight:10,once:true,ngOnly:true,routeKeys:['female-friends'],dialog:'A page describing one of your old choices has vanished from the refuge archive.',options:[
      {label:'Restore the honest version',outcome:'The archive keeps the messy truth instead of the flattering legend.',reward:[{type:'coins',amount:10}]},
      {label:'Leave a note for future readers',outcome:'A scholar gives you a rare supply for the annotation.',reward:[{type:'steel',amount:1}]},
      {label:'Let the mystery remain',outcome:'The missing page becomes a very popular research topic.',reward:[]}]}
  ];
  ngEvents.forEach(ev=>{const list=window.OVERWORLD_EVENTS;if(Array.isArray(list)&&!list.find(x=>x.id===ev.id))list.push(ev)});
})();

/* NG+ enemy personalities / telegraphs. */
Object.assign(ENEMY_WARNING_LINES,{
 'Crown Revenant':['The dead crown tilts toward you without moving.','The Revenant drags its blade through the dust of old kings.','A royal decree whispers backward through the chamber.','The crown flares with cold gold light.','The Revenant points toward the empty throne.'],
 'Petition Beast':['The paperwork rustles like a thousand angry leaves.','Three wax seals snap open at once.','A stack of forms leans toward you threateningly.','The Beast stamps something marked FINAL NOTICE.','Ink begins crawling across the floor.'],
 'Ashen Throne Warden':['Molten cracks brighten beneath the Warden’s armor.','The ruined guard plants one burning fist into the ground.','Cinders spiral from the empty visor.','The Warden locks its stance around an imaginary throne.','A red glow gathers behind the cracked breastplate.'],
 'Rogue Goose Marshal':['The Marshal polishes its spear with one wing.','A military honk echoes across the road.','The goose circles you with disturbing discipline.','The Marshal raises its tiny crown and points the spear.','Its feathers bristle in perfect formation.'],
 'Lucien Redeemed':['Lucien settles into a disciplined dueling stance.','He watches your weapon instead of your face.','Lucien exhales and lowers his center of gravity.','The former monarch raises his guard without arrogance.','A quiet spark gathers around his blade.'],
 'Roadshade Mimic':['The smiling merchant’s teeth rearrange themselves.','The backpack unfolds one joint too many.','A lantern swings although there is no wind.','The Roadshade offers a discount that sounds like a threat.','Several potion bottles blink at you.'],
 'Peacemaker Sentinel':['The Sentinel’s halo rotates with a low chime.','Its staff touches the ground and the air goes still.','The white armor turns toward your weakest side.','A symbol of judgment opens above its head.','The Sentinel raises one hand for silence.'],
 'Timeline Devourer':['Several versions of the room overlap for a second.','The Devourer opens an eye that was not there before.','Your last three choices echo from inside the void.','The edges of the battlefield begin disappearing.','The creature reaches toward something behind the screen.']
});
Object.assign(ENEMY_SIGNATURE_DEBUFF,{'Crown Revenant':'Cursed','Petition Beast':'Confused','Ashen Throne Warden':'Armor Break','Rogue Goose Marshal':'Weakened','Lucien Redeemed':'Weakened','Roadshade Mimic':'Confused','Peacemaker Sentinel':'Armor Break','Timeline Devourer':'Cursed'});

/* CROWHOLD_CUSTOM_ROUTE_INTEGRATION */
(()=>{
  const ROUTE_ASSET_SLUGS={
    'male-king':'male-king',
    'male-destroy':'male-destroy',
    'male-empty':'male-empty',
    'female-stay':'female-stay',
    'female-travel':'female-travel',
    'female-friends':'female-friends'
  };
  function currentRouteKey(){return state.meta?.ngPlusRouteKey||state.endgame?.routeKey||null;}
  window.getNgPlusVisuals=function(){
    const key=currentRouteKey();
    if(!state.ng||!key)return null;
    const root=`Textures/Maps/NGPlus/Routes/${ROUTE_ASSET_SLUGS[key]||key}/`;
    return {
      routeKey:key,
      overworldDay:`Textures/UI/Postgame/Maps/route-${key}.png`,
      overworldNight:`Textures/UI/Postgame/Maps/route-${key}-night.png`,
      combat:[`${root}placenta.png`,`${root}mild.png`,`${root}grave.png`,`${root}question.png`,`${root}monarch.png`]
    };
  };
  const routeIds=['male-king','male-destroy','male-empty','female-stay','female-travel','female-friends'];
  const preload=[];
  routeIds.forEach(id=>{
    preload.push(`Textures/UI/Postgame/Maps/route-${id}.png`,`Textures/UI/Postgame/Maps/route-${id}-night.png`);
    ['placenta','mild','grave','question','monarch'].forEach(area=>{
      preload.push(`Textures/Maps/NGPlus/Routes/${id}/${area}.png`,`Textures/Maps/NGPlus/Routes/${id}/${area}-night.png`);
    });
  });
  window.__ngPlusTextureCache=window.__ngPlusTextureCache||new Map();
  preload.forEach(src=>{if(window.__ngPlusTextureCache.has(src))return;const img=new Image();img.decoding='async';img.src=src;const ready=(typeof img.decode==='function'?img.decode().catch(()=>{}):Promise.resolve());window.__ngPlusTextureCache.set(src,{img,ready})});
})();

(()=>{
  const MONSTER_ART={
    'Crown Cutpurse':'Textures/Monsters/NGPlus/Crownhold/crown-cutpurse.png',
    'Bluecrest Militiaman':'Textures/Monsters/NGPlus/Crownhold/bluecrest-militiaman.png',
    'Crownshield Sentinel':'Textures/Monsters/NGPlus/Crownhold/crownshield-sentinel.png',
    'Goosecourt Marshal':'Textures/Monsters/NGPlus/Crownhold/goosecourt-marshal.png',
    'Kingswood Ranger':'Textures/Monsters/NGPlus/Crownhold/kingswood-ranger.png',
    'Briarfang Hound':'Textures/Monsters/NGPlus/Crownhold/briarfang-hound.png',
    'Mosscrown Guardian':'Textures/Monsters/NGPlus/Crownhold/mosscrown-guardian.png',
    'Thornstag Sovereign':'Textures/Monsters/NGPlus/Crownhold/thornstag-sovereign.png',
    'Royal Mourner':'Textures/Monsters/NGPlus/Crownhold/royal-mourner.png',
    'Crown Cryptguard':'Textures/Monsters/NGPlus/Crownhold/crown-cryptguard.png',
    'Sepulcher Bishop':'Textures/Monsters/NGPlus/Crownhold/sepulcher-bishop.png',
    'Crown Revenant':'Textures/Monsters/NGPlus/Crownhold/crown-revenant.png',
    'Hedgebound Spearman':'Textures/Monsters/NGPlus/Crownhold/hedgebound-spearman.png',
    'Thorncourt Prowler':'Textures/Monsters/NGPlus/Crownhold/thorncourt-prowler.png',
    'Bluebriar Construct':'Textures/Monsters/NGPlus/Crownhold/bluebriar-construct.png',
    'Thornmaze Warden':'Textures/Monsters/NGPlus/Crownhold/thornmaze-warden.png',
    'Crownblade Knight':'Textures/Monsters/NGPlus/Crownhold/crownblade-knight.png',
    'Banneret Executioner':'Textures/Monsters/NGPlus/Crownhold/banneret-executioner.png',
    'Aurell Crown Regent':'Textures/Monsters/NGPlus/Crownhold/aurell-crown-regent.png',
    'Throne Ascendant':'Textures/Monsters/NGPlus/Crownhold/throne-ascendant.png'
  };
  const MONSTER_DAMAGED={
    'Crown Cutpurse':'Textures/Monsters/NGPlus/Crownhold/crown-cutpurse-damaged.png',
    'Bluecrest Militiaman':'Textures/Monsters/NGPlus/Crownhold/bluecrest-militiaman-damaged.png',
    'Crownshield Sentinel':'Textures/Monsters/NGPlus/Crownhold/crownshield-sentinel-damaged.png',
    'Goosecourt Marshal':'Textures/Monsters/NGPlus/Crownhold/goosecourt-marshal-damaged.png',
    'Kingswood Ranger':'Textures/Monsters/NGPlus/Crownhold/kingswood-ranger-damaged.png',
    'Briarfang Hound':'Textures/Monsters/NGPlus/Crownhold/briarfang-hound-damaged.png',
    'Mosscrown Guardian':'Textures/Monsters/NGPlus/Crownhold/mosscrown-guardian-damaged.png',
    'Thornstag Sovereign':'Textures/Monsters/NGPlus/Crownhold/thornstag-sovereign-damaged.png',
    'Royal Mourner':'Textures/Monsters/NGPlus/Crownhold/royal-mourner-damaged.png',
    'Crown Cryptguard':'Textures/Monsters/NGPlus/Crownhold/crown-cryptguard-damaged.png',
    'Sepulcher Bishop':'Textures/Monsters/NGPlus/Crownhold/sepulcher-bishop-damaged.png',
    'Crown Revenant':'Textures/Monsters/NGPlus/Crownhold/crown-revenant-damaged.png',
    'Hedgebound Spearman':'Textures/Monsters/NGPlus/Crownhold/hedgebound-spearman-damaged.png',
    'Thorncourt Prowler':'Textures/Monsters/NGPlus/Crownhold/thorncourt-prowler-damaged.png',
    'Bluebriar Construct':'Textures/Monsters/NGPlus/Crownhold/bluebriar-construct-damaged.png',
    'Thornmaze Warden':'Textures/Monsters/NGPlus/Crownhold/thornmaze-warden-damaged.png',
    'Crownblade Knight':'Textures/Monsters/NGPlus/Crownhold/crownblade-knight-damaged.png',
    'Banneret Executioner':'Textures/Monsters/NGPlus/Crownhold/banneret-executioner-damaged.png',
    'Aurell Crown Regent':'Textures/Monsters/NGPlus/Crownhold/aurell-crown-regent-damaged.png',
    'Throne Ascendant':'Textures/Monsters/NGPlus/Crownhold/throne-ascendant-damaged.png'
  };
  Object.assign(ASSETS,Object.fromEntries(Object.entries(MONSTER_ART).filter(([name])=>name!=='Crown Revenant')));
  Object.assign(ASSET_ALIASES,{
    crowncutpurse:'Crown Cutpurse',
    bluecrestmilitiaman:'Bluecrest Militiaman',
    crownshieldsentinel:'Crownshield Sentinel',
    goosecourtmarshal:'Goosecourt Marshal',
    kingswoodranger:'Kingswood Ranger',
    briarfanghound:'Briarfang Hound',
    mosscrownguardian:'Mosscrown Guardian',
    thornstagsovereign:'Thornstag Sovereign',
    royalmourner:'Royal Mourner',
    crowncryptguard:'Crown Cryptguard',
    sepulcherbishop:'Sepulcher Bishop',
    crownrevenant:'Crown Revenant',
    hedgeboundspearman:'Hedgebound Spearman',
    thorncourtprowler:'Thorncourt Prowler',
    bluebriarconstruct:'Bluebriar Construct',
    thornmazewarden:'Thornmaze Warden',
    crownbladeknight:'Crownblade Knight',
    banneretexecutioner:'Banneret Executioner',
    aurellcrownregent:'Aurell Crown Regent',
    throneascendant:'Throne Ascendant'
  });
  Object.assign(ENEMY_WARNING_LINES,{
    'Goosecourt Marshal':ENEMY_WARNING_LINES['Rogue Goose Marshal']||['The goose marshal circles with perfect discipline.'],
    'Throne Ascendant':ENEMY_WARNING_LINES['Crown Revenant']||['A cold royal light gathers around the throne.']
  });
  Object.assign(ENEMY_SIGNATURE_DEBUFF,{
    'Goosecourt Marshal':'Weakened',
    'Throne Ascendant':'Cursed'
  });
  const CROWNHOLD_PAIRS={
    'Royal Road Ambush':['Crown Cutpurse','Bluecrest Militiaman'],
    'Crownwood Hunting Pack':['Kingswood Ranger','Briarfang Hound'],
    'Crowncrypt Procession':['Royal Mourner','Crown Cryptguard'],
    'Maze Court Conspirators':['Hedgebound Spearman','Thorncourt Prowler'],
    'Royal Vanguard Pair':['Crownblade Knight','Banneret Executioner']
  };
  function crownholdCombat(){return !!(state.ng&&(state.meta?.ngPlusRouteKey||state.endgame?.routeKey)==='male-king');}
  window.warmEncounterArt=name=>{
    const pair=crownholdCombat()?CROWNHOLD_PAIRS[name]:null;
    for(const actor of pair||[name]){
      const normal=(crownholdCombat()?MONSTER_ART[actor]:null)||asset(actor);
      const damaged=(crownholdCombat()?MONSTER_DAMAGED[actor]:null)||normal;
      if(normal)window.ensureSceneImage?.(normal);
      if(damaged&&damaged!==normal)window.ensureSceneImage?.(damaged);
    }
  };
  function refreshCombatEnemySprite(force=false){
    if(!combat||(!force&&!$('#combat')?.classList.contains('active')))return;
    const art=$('#enemyArt');
    const pair=crownholdCombat()?CROWNHOLD_PAIRS[combat.enemy]:null;
    art.classList.toggle('crownhold-pair',!!pair);
    art.classList.toggle('crownhold-solo',!!crownholdCombat()&&!pair);
    if(pair&&art.querySelectorAll('.crownhold-pair-sprites .monster-sprite').length!==2){
      // Keep both sprites inside the motion shell; remove the old white fallback card.
      const shell=art.querySelector(':scope > .alive-motion-shell')||art;
      shell.querySelector(':scope > .paper')?.remove();
      shell.querySelector(':scope > .monster-sprite')?.remove();
      let group=shell.querySelector(':scope > .crownhold-pair-sprites');
      if(!group){group=document.createElement('div');group.className='crownhold-pair-sprites';shell.prepend(group)}
      group.replaceChildren();
      pair.forEach(name=>{const img=document.createElement('img');img.className='monster-sprite';img.alt=name;img.decoding='async';img.dataset.crownholdName=name;group.appendChild(img)});
    }
    const injured=Number(combat.enemyHp)<=Math.max(1,Number(combat.enemyMax||1)*0.3);
    const imgs=pair?[...art.querySelectorAll('.crownhold-pair-sprites .monster-sprite')]:[art.querySelector('.monster-sprite')].filter(Boolean);
    imgs.forEach((img,index)=>{
      const name=pair?pair[index]:combat.enemy;
      const normal=(crownholdCombat()?MONSTER_ART[name]:null)||asset(name);
      const damaged=(crownholdCombat()?MONSTER_DAMAGED[name]:null)||normal;
      const wanted=injured?damaged:normal;
      if(!normal||img.dataset.requestedSrc===wanted)return;
      img.dataset.requestedSrc=wanted;img.dataset.normalSrc=normal;img.dataset.damagedSrc=damaged;
      img.onerror=()=>{img.onerror=null;img.dataset.requestedSrc=normal;img.src=normal};
      img.src=wanted;
    });
  }
  const _startCombat=startCombat;
  startCombat=function(enemy,boss,level=state.stage+1){const result=_startCombat(enemy,boss,level);refreshCombatEnemySprite(true);const encounter=combat;let attempts=0;const reveal=setInterval(()=>{if(combat!==encounter||++attempts>150){clearInterval(reveal);return}if($('#combat')?.classList.contains('active')){clearInterval(reveal);refreshCombatEnemySprite()}},100);return result;};
  const _updateBars=updateBars;
  updateBars=function(){const result=_updateBars();refreshCombatEnemySprite();return result;};
})();

(()=>{
  const CROWNHOLD_LEVELS=[
    ['Crown Cutpurse','Bluecrest Militiaman','Royal Road Ambush','Crownshield Sentinel','Goosecourt Marshal'],
    ['Kingswood Ranger','Briarfang Hound','Crownwood Hunting Pack','Mosscrown Guardian','Thornstag Sovereign'],
    ['Royal Mourner','Crown Cryptguard','Crowncrypt Procession','Sepulcher Bishop','Crown Revenant'],
    ['Hedgebound Spearman','Thorncourt Prowler','Maze Court Conspirators','Bluebriar Construct','Thornmaze Warden'],
    ['Crownblade Knight','Banneret Executioner','Royal Vanguard Pair','Aurell Crown Regent','Throne Ascendant']
  ];
  const CROWNHOLD_STORY=[
    [
      ['A Cut in the Crown Road', 'A Crown Cutpurse steals provisions from the repaired road. Frontier families suspect a patrol is letting the robber through.'],
      ['The Crest on the Patrol', 'A Bluecrest Militiaman turns travelers back from the village gate. The cutpurse carried the same blue seal.'],
      ['Royal Road Ambush', 'The Crown Cutpurse and Bluecrest Militiaman strike together. The thefts and roadblocks are one coordinated scheme.'],
      ['The Shield at the Gate', 'Crownshield Sentinel guards the ledgers that name who ordered the ambush. Its loyalty is to the seal, not the villagers.'],
      ['The Marshal’s Decree', 'Goosecourt Marshal claims authority over every petition and supply cart. Defeat the marshal to reopen the frontier road.']
    ],
    [
      ['Tracks in the Kingswood', 'Kingswood Ranger diverts travelers away from protected paths. The ranger is guarding something deeper than a hunting trail.'],
      ['The Hound’s Scent', 'Briarfang Hound follows the ranger’s marks and hunts anyone crossing the royal boundary.'],
      ['Crownwood Hunting Pack', 'Kingswood Ranger and Briarfang Hound attack together, driving trespassers toward the heart of the wood.'],
      ['Rootbound Watch', 'Mosscrown Guardian bars the old grove, its stone and roots bound to a royal ward.'],
      ['Sovereign of Thorns', 'Thornstag Sovereign has claimed the grove beneath the crown’s banner. The forest cannot recover while its command holds.']
    ],
    [
      ['A Mourner at the Gate', 'Royal Mourner tends noble graves that have begun answering the restored crown’s summons.'],
      ['The Crypt Is Guarded', 'Crown Cryptguard seals the burial vault and refuses to let the living examine its disturbed tombs.'],
      ['Crowncrypt Procession', 'Royal Mourner and Crown Cryptguard advance together. Their procession carries an order from beneath the cemetery.'],
      ['The Bishop’s Rite', 'Sepulcher Bishop conducts the rite that keeps the dead loyal to the throne.'],
      ['The Buried Crown', 'Crown Revenant rises from the oldest royal tomb. Break its claim before the cemetery becomes a second court.']
    ],
    [
      ['The Maze Takes Oaths', 'Hedgebound Spearman blocks the entrance to a hedge court that now tests royal authority.'],
      ['The Hunter in the Hedges', 'Thorncourt Prowler watches each turn and strikes at anyone who follows the obvious path.'],
      ['Maze Court Conspirators', 'Hedgebound Spearman holds the passage while Thorncourt Prowler attacks from the side. The court planned this trial together.'],
      ['Bluebriar Judgment', 'Bluebriar Construct binds the maze with stone, briars, and blue-gold magic. It protects the court’s inner chamber.'],
      ['Warden of the Thornmaze', 'Thornmaze Warden commands the living walls. Defeat it to end the court’s hold over the garden.']
    ],
    [
      ['The Capital’s Blade', 'Crownblade Knight challenges entry to the restored fortress. The capital is testing the ruler it is meant to serve.'],
      ['The Executioner’s Banner', 'Banneret Executioner turns a ceremonial office into a threat at the castle gate.'],
      ['Royal Vanguard Pair', 'Crownblade Knight and Banneret Executioner fight side by side as the capital’s last coordinated guard.'],
      ['The Regent’s Claim', 'Aurell Crown Regent invokes the old court’s authority and refuses to yield the throne hall.'],
      ['The Throne Ascends', 'Throne Ascendant fuses royal will with the seat of power. The final battle decides who rules the rebuilt kingdom.']
    ]
  ];
  const CROWNHOLD_RESOLUTIONS=[
    'The frontier road opens again. Supply carts and petitions reach Placenta Creek without the marshal taking a cut.',
    'The Kingswood paths settle. Rangers and hounds no longer drive travelers into the sovereign’s grove.',
    'The bishop’s rite breaks, and the Crown Revenant’s summons fades from the cemetery.',
    'The hedge court releases its hold. The maze remains, but its trials no longer hunt visitors.',
    'The Throne Ascendant falls. The capital can answer to its living ruler instead of an old royal curse.'
  ];
  window.getNgPlusEncounterStory=function(hub,level){
    const route=window.getNgPlusRouteStory?.(hub,level);
    if(!route)return null;
    if(route.routeKey==='male-king'){
      const beat=CROWNHOLD_STORY[hub]?.[level-1];
      if(beat)return {...route,enemy:CROWNHOLD_LEVELS[hub][level-1],title:beat[0],body:beat[1],resolution:CROWNHOLD_RESOLUTIONS[hub]};
    }
    return {...route,title:route.enemy,body:`${route.areaNote} The Level ${level} encounter is ${route.enemy}.`,resolution:`${route.area} is secure for now. ${route.areaNote}`};
  };
  function crownholdRouteActive(){return !!(state.ng&&(state.meta?.ngPlusRouteKey||state.endgame?.routeKey)==='male-king');}
  const _renderMap=window.renderMap;
  window.renderMap=function(){
    _renderMap();
    if(!crownholdRouteActive())return;
    document.querySelectorAll('#hubRow .hub').forEach((hubEl,i)=>{
      const p=hubEl.querySelector('p');
      if(!p)return;
      const boss=CROWNHOLD_LEVELS[i]?.[4]||hubs[i]?.[3]||'';
      const cleared=(state.progress?.[i])||0;
      const areaNote=window.getNgPlusEncounterStory?.(i,Math.min(5,cleared+1))?.areaNote||'';
      p.innerHTML=`${areaNote}<br><b>Boss: ${boss}</b><br><small>Levels cleared: ${cleared}/5</small>`;
    });
  };
  const _openLevelSelect=openLevelSelect;
  openLevelSelect=function(i){
    if(!crownholdRouteActive())return _openLevelSelect(i);
    ensureProgress();
    state.hub=i;
    const cleared=state.progress[i]||0;
    const levels=CROWNHOLD_LEVELS[i]||hubs[i][4];
    $('#levelTitle').textContent=`${hubs[i][0]} · choose a level`;
    $('#levelHint').textContent=window.getNgPlusEncounterStory?.(i,Math.min(cleared+1,5))?.body||`Clear Level ${Math.min(cleared+1,5)} to unlock the next.`;
    $('#levelGrid').innerHTML=[1,2,3,4,5].map(level=>{
      const locked=level>cleared+1;
      const monster=`Monster: ${levels[level-1]||hubs[i][4][Math.max(0,level-1)]}`;
      return `<button class="${locked?'locked ':''}${level===cleared+1?'current':''}" ${locked?'disabled':''} data-level="${level}"><b>${locked?'🔒':'Level '+level}</b><small>${monster}</small></button>`;
    }).join('');
    $('#levelModal').classList.add('open');
    $('#levelModal').setAttribute('aria-hidden','false');
    $$('[data-level]').forEach(b=>b.onclick=()=>startLevel(i,+b.dataset.level));
  };
  const _startLevel=startLevel;
  startLevel=function(i,level){
    if(!crownholdRouteActive())return _startLevel(i,level);
    ensureProgress();closeLevelSelect();state.hub=i;state.stage=level-1;
    const levels=CROWNHOLD_LEVELS[i]||hubs[i][4];
    const enemy=levels[level-1]||hubs[i][4][Math.max(0,level-1)];
    const boss=level===5;
    startCombat(enemy,boss,level);
    $('#battlePrompt').textContent=`Crownhold Ascendant · ${hubs[i][0]}`;
    $('#battleDetail').textContent=window.getNgPlusEncounterStory?.(i,level)?.body||`${enemy} blocks the road.`;
  };
})();

/* Warm the selected area and its available encounters while the level menu is open. */
(()=>{
  const previousOpen=openLevelSelect;
  openLevelSelect=function(i){
    window.warmLevelArea?.(i);
    const result=previousOpen(i);
    document.querySelectorAll('#levelGrid button:not([disabled]) small').forEach(label=>{
      const name=label.textContent.replace(/^(?:Monster|Boss):\s*/i,'').trim();
      if(name&&name!=='Random')window.warmEncounterArt?.(name);
    });
    return result;
  };
})();

/* Embedded first-time hints fallback; runs even when the optional external hint script is missing. */
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
    help.hidden=screen!=='village';
    if(help.hidden&&guideOpen){guide.hidden=true;guideOpen=false}
    const building=state._building,level=document.querySelector('#levelModal'),codex=document.querySelector('#codexOverlay');
    if(level?.classList.contains('open'))levelVisited=true;
    if(codex?.classList.contains('open'))codexVisited=true;
    const visible=element=>!!element&&getComputedStyle(element).display!=='none'&&getComputedStyle(element).visibility!=='hidden'&&element.getClientRects().length>0;
    const overlays=document.querySelectorAll('#introExperience.open,#noticeOverlay,#rewardOverlay.open,#roadEventOverlay.open,#utilityModal.open,#codexOverlay.open,.quiz-modal,.death-modal,.road-event:not(#noticeOverlay)');
    const otherPopup=!!([...overlays].some(visible)||(level?.classList.contains('open')&&visible(level))||window.__battleNoticeOpen);
    if(otherPopup&&current)closeTip();
    if(current||guideOpen||otherPopup||Date.now()-lastClosedAt<2500)return;
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


/* Short visual impact at the instant damage, block, stagger, or Evade resolves. */
(()=>{
 window.classImpact=function(side,kind,strong=false){
  const screen=document.querySelector('#combat'),field=screen?.querySelector('.battle-field'),target=screen?.querySelector(side==='enemy'?'#enemyArt':'#playerArt');
  if(!screen?.classList.contains('active')||!field||!target||matchMedia('(prefers-reduced-motion:reduce)').matches)return;
  const tr=target.getBoundingClientRect(),fr=field.getBoundingClientRect();
  const element=kind==='magic'?(state.affinity||'water'):kind;
  const mark=document.createElement('span');mark.className='class-impact-mark '+element;
  mark.style.left=(tr.left-fr.left+tr.width*.52)+'px';mark.style.top=(tr.top-fr.top+tr.height*.46)+'px';field.appendChild(mark);setTimeout(()=>mark.remove(),640);
  if(side==='enemy'&&['sword','bow','magic'].includes(kind)){
   const count=element==='sword'?1:element==='bow'?5:14;
   for(let i=0;i<count;i++){
    const spark=document.createElement('span');spark.className='impact-particle '+element+(element==='bow'?(i===0?' bow-main':' bow-shard'):'');
    spark.style.left=mark.style.left;spark.style.top=mark.style.top;
    const angle=(i/count)*Math.PI*2+(element==='water'?.2:0),spread=element==='sword'?0:element==='bow'?20+(i%3)*12:34+(i%4)*12;
    spark.style.setProperty('--dx',Math.cos(angle)*spread+'px');spark.style.setProperty('--dy',(element==='fire'?-20-Math.abs(Math.sin(angle)*spread):element==='water'?12+Math.abs(Math.sin(angle)*spread):Math.sin(angle)*spread)+'px');
    spark.style.setProperty('--delay',(i%4)*18+'ms');
    field.appendChild(spark);setTimeout(()=>spark.remove(),700);
   }
  }
  if(kind==='evade'){
   const ghost=target.cloneNode(true);
   ghost.removeAttribute('id');ghost.querySelectorAll('[id]').forEach(node=>node.removeAttribute('id'));
   ghost.classList.add('evade-ghost');
   ghost.style.setProperty('--ghost-left',(tr.left-fr.left)+'px');ghost.style.setProperty('--ghost-top',(tr.top-fr.top)+'px');
   ghost.style.setProperty('--ghost-width',tr.width+'px');ghost.style.setProperty('--ghost-height',tr.height+'px');
   field.appendChild(ghost);setTimeout(()=>ghost.remove(),460);
   const trail=document.createElement('span');trail.className='evade-trail';
   trail.style.left=(tr.left-fr.left+tr.width*.47)+'px';trail.style.top=(tr.top-fr.top+tr.height*.65)+'px';
   field.appendChild(trail);setTimeout(()=>trail.remove(),460);
   target.animate([
    {offset:0,translate:'0 0',rotate:'0deg',scale:'1 1'},
    {offset:.2,translate:'8px 8px',rotate:'4deg',scale:'1.04 .92'},
    {offset:.53,translate:'-35px 43px',rotate:'-9deg',scale:'1.08 .67'},
    {offset:.72,translate:'-39px 46px',rotate:'-9deg',scale:'1.08 .67'},
    {offset:1,translate:'0 0',rotate:'0deg',scale:'1 1'}
   ],{duration:440,easing:'cubic-bezier(.25,.75,.3,1)'});
   return;
  }
  if(kind==='stagger')target.animate([{rotate:'0deg',translate:'0 0'},{rotate:'-5deg',translate:'-5px 3px'},{rotate:'3deg',translate:'4px 4px'},{rotate:'0deg',translate:'0 0'}],{duration:340,easing:'ease-out'});
  else target.animate([{translate:'0 0',filter:'brightness(1)'},{translate:(side==='enemy'?'8px':'-8px')+' 0',filter:'brightness(1.6)'},{translate:'0 0',filter:'brightness(1)'}],{duration:strong?290:220,easing:'ease-out'});
  if(kind==='bleed'||kind==='block')return;
  screen.classList.add('impact-pause');clearTimeout(screen.__impactPause);screen.__impactPause=setTimeout(()=>screen.classList.remove('impact-pause'),strong?100:70);
  if(strong){field.animate([{translate:'0 0'},{translate:side==='enemy'?'3px 0':'-3px 0'},{translate:'0 0'}],{duration:180,easing:'ease-out'})}
 };
})();

/* Keep area progress in sync after every route-specific level menu renderer. */
(()=>{
  const previousOpen=openLevelSelect;
  openLevelSelect=function(i){
    const result=previousOpen(i);
    const title=document.querySelector('#levelTitle'),progress=document.querySelector('#levelProgress'),story=document.querySelector('#levelModal .level-story');
    if(title)title.textContent=hubs[i]?.[0]||'Choose a level';
    if(progress)progress.textContent=`${Math.min(5,Number(state.progress?.[i])||0)}/5 cleared`;
    if(story)story.open=false;
    document.querySelectorAll('#levelGrid [data-level]').forEach(button=>{
      const level=Number(button.dataset.level);
      button.classList.toggle('cleared',level<=(Number(state.progress?.[i])||0));
      button.classList.toggle('boss-level',level===5);
      const label=button.querySelector('b');if(label)label.textContent=String(level).padStart(2,'0');
      const name=button.querySelector('small');if(name)name.textContent=name.textContent.replace(/^(?:Monster|Boss):\s*/i,'');
      button.setAttribute('aria-label',`Level ${level}: ${name?.textContent||'Unknown'}${button.disabled?' · Locked':button.classList.contains('cleared')?' · Cleared':''}`);
    });
    return result;
  };
})();
