/* First-entry Level 5 conversations. The existing combat instance waits untouched behind the scene. */
(()=>{
  'use strict';
  const q=s=>document.querySelector(s),game=q('.game');if(!game||!window.startLevel)return;
  const STORIES={
 "Sir Barnaby": {
  "opening": [
   "Stop at the bridge. Sir Barnaby, official protector, unofficially tired of explaining the toll.",
   "You took food from the villagers and charged them to cross their own bridge.",
   "That sounds awful when you put the two charges in one sentence.",
   "They are hungry. Your shield gets polished twice a day.",
   "Once. The second polishing is an inspection. That distinction matters to nobody here, apparently.",
   "I came here to stop you, not audit your grooming.",
   "And yet everyone begins with the shield. Nobody notices I polished the helmet."
  ],
  "kind": [
   "You can step aside. You do not have to be the reason they go without.",
   "A knight stepping aside looks rather like a knight failing his duty.",
   "Duty should protect people. Let me help them, and you can choose a better one.",
   "You make chivalry sound like work. Nobody warned me about that part.",
   "It usually is. They will remember the choice you make here.",
   "Fine. Let them watch me make one decent choice. After the duel.",
   "If you can still hear the villagers, why make them fight you for food?",
   "Because admitting I was wrong in front of them will be worse than losing this duel."
  ],
  "taunt": [
   "Is that shield for protection, or do you need somewhere to hide your face?",
   "It is an heirloom! And it has survived more battles than your trousers.",
   "Then it has carried you farther than your courage has.",
   "I have announced every duel by the book. You are ruining the page order.",
   "Try keeping up. I am already at the part where you lose.",
   "Very well. Let the record show that you asked for the dramatic version.",
   "You practice that speech in the mirror?",
   "Of course. The shield is an heirloom; the mirror is rented."
  ],
  "roast": [
   "Did you make the bridge pay a toll for carrying you and that enormous ego?",
   "A bridge cannot own coins. That is basic accounting.",
   "Neither can the villagers once you are finished with them, you walking receipt.",
   "I am a knight of proper standing!",
   "Your stance says knight. Your business model says goose with a clipboard.",
   "I will defeat you and then write a strongly worded correction.",
   "Will you write the correction before or after you remove the toll sign?",
   "After. I refuse to let you choose the wording on my own defeat."
  ]
 },
 "Gloomfang": {
  "opening": [
   "Turn back. The traps made this forest quiet for the first time in months.",
   "Quiet? Every animal ran onto the road to escape you.",
   "The hunters followed them. The trees stayed standing.",
   "You cursed the things you claim to protect.",
   "I noticed. I also noticed nobody else stopped the axes.",
   "So you made the whole forest into one giant trap.",
   "I thought the hunters would leave. They brought more traps. I hate that you can see the problem."
  ],
  "kind": [
   "You are hurting the creatures you meant to shelter. Let me help break the curse.",
   "Help? The last hunter who offered help brought iron jaws.",
   "I will clear the traps, even if you never trust me afterward.",
   "Promises do not leave tracks. Actions do.",
   "Then watch what I do, and let the forest decide.",
   "The forest is listening. It has been less forgiving than I am.",
   "Then we clear the iron jaws together.",
   "You said together like I have already agreed. I have not. Keep talking."
  ],
  "taunt": [
   "For the ruler of these woods, you spend an impressive amount of time hiding behind brambles.",
   "A hunter who cannot see the trap calls it hiding.",
   "I saw every trap. I just followed them straight to you.",
   "Confidence makes a delicious trail.",
   "Good. You will have no excuse when I catch you.",
   "Then come closer and learn why the trail ends here.",
   "Then stop making threats and come out from behind the tree.",
   "I am a wolf. The trees are where I live. This is a terrible insult."
  ],
  "roast": [
   "Your fear tax is terrible. Even the goblins think your accounting is embarrassing.",
   "The goblins are guests, not accountants.",
   "Guests? You have driven out everyone with enough sense to leave.",
   "You speak loudly for something standing in my den.",
   "And you are a cursed wolf running a very unpopular campsite.",
   "I was going to offer a warning. I withdraw it.",
   "Do the deer get a vote or do you just speak for anything with fur?",
   "They stopped coming close enough to ask me. I know what that means."
  ]
 },
 "Lich King Timmy": {
  "opening": [
   "Welcome to my court. Attendance is mandatory. Applause is strongly encouraged.",
   "You rang the dead out of their graves to hear a speech?",
   "Several speeches. The living kept leaving after the first one.",
   "The dead would leave too if you let them.",
   "Then it is fortunate for the court that I do not.",
   "How many graves did you open for this audience?",
   "All the good seats were taken. Stop calling them graves while I am addressing the court."
  ],
  "kind": [
   "They deserve peace, Timmy. You can let them go and still be remembered.",
   "A king without a court is only a boy wearing old metal.",
   "You would be a person who finally listened to his people.",
   "That sounds less impressive on a monument.",
   "It would matter more to those beneath it.",
   "You make mercy sound harder than necromancy. Annoyingly, you may be right.",
   "You could let them rest. You would still have a kingdom.",
   "A kingdom of empty chairs is not a kingdom. It is my old birthday party."
  ],
  "taunt": [
   "An eternal court? You could not keep an audience alive for one speech.",
   "My speeches are magnificent. The audience was insufficiently durable.",
   "Then try one without making everyone attend by force.",
   "You have the confidence of a fool at his own coronation.",
   "And you have the crown of a fool who missed the funeral.",
   "I get the last word. I rehearsed it for three centuries.",
   "Your guards look like they would rather be buried.",
   "They have been buried. That is why your threat lacks imagination."
  ],
  "roast": [
   "You raised an army of dead people because nobody liked your public speaking?",
   "That is a crude summary of a sophisticated royal program.",
   "Your program is a haunted lecture with a dress code.",
   "My robes are ceremonial!",
   "So is the silence every time you finish a sentence.",
   "Guards! Oh, right. I shall handle this personally.",
   "The crown looks like it came from a cereal box.",
   "It did not. The cereal box had better jewels. I had the royal smith arrested."
  ]
 },
 "Minotaur with Anxiety": {
  "opening": [
   "Welcome to the middle of the maze. I had a speech. The wall moved my notes.",
   "Your traps have apology signs. People still got hurt.",
   "I wrote the signs before the walls changed. I know that sounds bad.",
   "It is bad. Can you open the exits?",
   "Yes. Probably. I need everyone to stop watching me first.",
   "Do you know which door leads out?",
   "I had labels. Then the hedge grew over them. Please stop staring while I remember."
  ],
  "kind": [
   "You do not have to manage this alone. Let us get everyone out safely.",
   "What if I open the wrong corridor and make it worse?",
   "We can correct a wrong turn. We cannot help anyone while the maze stays closed.",
   "My battle plan did not account for you being reasonable. That is upsetting.",
   "Then put the plan down and take the first step with me.",
   "I might. If we both survive how frightening that sounds.",
   "Take your time. Nobody needs another trap.",
   "Nobody says that after stepping on the fourth plate. I appreciate it."
  ],
  "taunt": [
   "I solved your maze. Did you put all the difficult turns in the other one?",
   "There is no other one! I checked the plans repeatedly.",
   "Then we have only the part where you try to stop me.",
   "I penciled that part in. The pencil broke.",
   "Find another pencil. You will want to record this loss.",
   "I wrote down seventeen replies and none of them work against that.",
   "Did you rehearse that threat or the apology afterward?",
   "Both. The apology was longer and had diagrams."
  ],
  "roast": [
   "Your maze is a collection of wrong turns written by a nervous cow.",
   "I am a minotaur. And some of those turns are intentionally wrong.",
   "The apology signs are the only directions that make sense.",
   "Those took the longest to word politely.",
   "I can tell. The traps are terrible, but the grammar is flawless.",
   "Thank you. Wait. That was an insult.",
   "You built a maze with an exit you cannot find.",
   "I found it yesterday. Then somebody moved the hedge. I know how that sounds."
  ]
 },
 "Monarch Lucien": {
  "opening": [
   "You got past the gates. I'd compliment you, but I paid a great deal for those gates.",
   "The tribute ledgers show what everyone else paid for this room.",
   "A kingdom needs order. Order costs something.",
   "It cost people their homes while you chose curtains.",
   "I chose the banners. The curtains were the steward's mistake. Your point stands.",
   "People outside are counting lost homes while you count banners.",
   "I know. The count reached the throne room. I had the steward remove the ledger."
  ],
  "kind": [
   "I came for the people outside these walls. You can end this without making more of them suffer.",
   "You believe the person on the throne simply walks away?",
   "I believe you can decide who you are when you leave it.",
   "Nobody has offered me an exit before. Usually they offer a blade.",
   "Then listen now. I will stop you, but you can still choose what follows.",
   "Perhaps. First I need to know whether your mercy survives a fight.",
   "Then you knew. You can still make a different choice.",
   "I knew the numbers. I did not know the names. That is not a defense."
  ],
  "taunt": [
   "I walked through your entire fortress. You should ask for a refund on the guards.",
   "They held longer than most armies.",
   "I was saving my best work for the one who signed their orders.",
   "Bravado has ended many challengers in this hall.",
   "Then add a new line to your records: this one came prepared.",
   "Come on, then. Give the historian a reason to sharpen a pencil.",
   "I came through your expensive gates without an invitation.",
   "Yes. The captain has already been informed that his invoice is declined."
  ],
  "roast": [
   "You drained five regions to furnish one chair. Was the cushion at least comfortable?",
   "That is the royal throne, not a chair.",
   "So the cushion was uncomfortable. That explains the mood.",
   "You mock the symbol of the entire kingdom.",
   "I mock the man hiding behind it and sending everyone else the bill.",
   "That is quite enough. Draw your weapon.",
   "Does your portrait collection include the one where you fix a roof?",
   "No. The painters insisted they had never seen me do it. Insolent and accurate."
  ]
 },
 "Goosecourt Marshal": {
  "opening": [
   "HONK. Road closed. Petitions seized. Please respect the sash.",
   "Those petitions belong to the villagers.",
   "They are under review. I have a stamp and an ink pad.",
   "You stole their food carts too.",
   "That part is called impoundment. The stamp makes it different.",
   "That sash is crooked.",
   "The sash is authorized. Its angle is under review. HONK."
  ],
  "kind": [
   "Give the petitions back. People need supplies more than they need another order.",
   "A marshal cannot surrender documents to every polite traveler.",
   "Then surrender them to the people whose names are on them.",
   "That would be good administration. I hate how easy you made it sound.",
   "It would be a start. You can still do the right thing.",
   "My beak says no. My conscience has asked to speak privately.",
   "Return the carts. We can still feed the people today.",
   "The carts have been stamped. I would have to stamp them again. This is a serious request."
  ],
  "taunt": [
   "Nice stamp. Is the entire kingdom scared of a goose with stationery?",
   "This stationery has sealed more gates than your sword has opened.",
   "Then this will be an educational day for both of us.",
   "You underestimate the discipline of the Goosecourt.",
   "I reached your desk. Your discipline needs a new map.",
   "HONK! Then face the marshal directly.",
   "I have defeated a goose before.",
   "A civilian goose! My training includes forms and aggressive wings."
  ],
  "roast": [
   "Did the crown run out of officers and promote its loudest bird?",
   "I earned this sash in distinguished service.",
   "Distinguished from what? Other geese with pens?",
   "My decrees carry royal authority!",
   "So does a seal on a jar. At least the jar keeps food fresh.",
   "That insult shall be entered into the record after I flatten you.",
   "That stamp is the only thing here with a job.",
   "Insult the sash if you must. Leave the stamp out of this."
  ]
 },
 "Thornstag Sovereign": {
  "opening": [
   "The grove is closed. I have announced it to everyone who reached the grove.",
   "Your ranger and hound are driving people into it.",
   "They were supposed to drive hunters away.",
   "The thorns are choking the trees as well.",
   "I know. Every time I loosen them, the axes come back.",
   "The paths out are full of people you meant to protect.",
   "I saw them. The thorns do not distinguish a hunter from a child anymore."
  ],
  "kind": [
   "Let the forest breathe. I will keep hunters away without trapping everyone inside.",
   "Words vanish when winter comes and axes return.",
   "Then judge me by what I do after today, not by the people before me.",
   "The grove has waited too long for a promise it can trust.",
   "Give it a chance to hear one that is kept.",
   "If you pass, carry the forest’s warning beyond these roots.",
   "Let me clear a path before anyone else gets hurt.",
   "Clear one. If the hunters use it, I will close it myself."
  ],
  "taunt": [
   "I got past your ranger, your hound, and your stone guardian. Your border has holes.",
   "Each one tested you. None was meant to replace me.",
   "Then stop testing and show me what the sovereign can do.",
   "I could carve that confidence into a warning sign. The trees would hate it.",
   "Try catching me before you start carving.",
   "Very well. The grove itself will witness the answer.",
   "You call this ruling? Even the brambles ignore you.",
   "I planted them. That is the part I have to answer for."
  ],
  "roast": [
   "A king of thorns? Congratulations on ruling a very aggressive hedge.",
   "This grove predates every crown you have known.",
   "And yet it has the same problem: someone in charge who hates visitors.",
   "My antlers are older than your jokes.",
   "Then they have had plenty of time to learn how to duck.",
   "The grove will not laugh when I lower my head.",
   "Your crown is a hedge that grew around your head.",
   "I know. It was supposed to be temporary. Nothing here stays temporary."
  ]
 },
 "Crown Revenant": {
  "opening": [
   "The crown above has forgotten who lies beneath it. I am here to correct that.",
   "You woke an entire cemetery to make a point.",
   "The dead answered their first sovereign.",
   "The mourner said they didn't get a choice.",
   "The mourner used to complain at court too. Some habits survived death.",
   "How long have you been waiting under that crown?",
   "Long enough to hear each new ruler promise he would remember the dead."
  ],
  "kind": [
   "I will remember what happened here. I will also let these people rest.",
   "Memory without obedience is an unfamiliar gift from a kingdom.",
   "The dead deserve names, not another war fought in their name.",
   "You speak as though forgetting is not inevitable.",
   "It is not, if the living choose to listen.",
   "Then show me that choice can hold against an ancient claim.",
   "I can tell their names. Let the mourners go home.",
   "Names would be a beginning. I will not confuse it with justice."
  ],
  "taunt": [
   "You had centuries to prepare this comeback, and you opened with a summons?",
   "Time has not weakened the authority buried with me.",
   "Authority is doing a poor job of keeping your court together.",
   "The cryptguard still stands. The bishop still chants.",
   "And I made it through both. Your next argument had better be stronger.",
   "I shall make it impossible to ignore.",
   "Your procession needs a better route; half the guards got lost.",
   "The dead are very bad at following signs. This will not delay them."
  ],
  "roast": [
   "Your crown spent so long underground it thinks a graveyard is a capital.",
   "This cemetery holds the kingdom’s first royal blood.",
   "And a lot of people asking you to stop waking them up.",
   "You insult the dead in their own hall.",
   "No, I am insulting the one dead monarch who will not let anyone sleep.",
   "Then you will learn why the crypt remembers my name.",
   "That crown has spent more time in a crypt than on a head.",
   "It was buried with me. The living dug it up to sell. They started this argument."
  ]
 },
 "Thornmaze Warden": {
  "opening": [
   "You have reached the court. The maze recorded every wrong turn.",
   "It moved the walls while I was walking.",
   "The walls are permitted to assist the trial.",
   "The spearman and prowler attacked me together.",
   "The court calls that a practical examination. I did not write the rules.",
   "Who wrote rules that let walls move during a trial?",
   "A judge who never walked the maze. I inherited the rulebook and its complaints."
  ],
  "kind": [
   "Open the paths. People deserve a choice before they are judged.",
   "Without the trials, the old court loses its purpose.",
   "A purpose that hurts everyone passing through deserves to change.",
   "The hedges have followed these orders longer than I have.",
   "Then start with one order they can follow toward freedom.",
   "Beat me, then tell the gardeners they can finally change the rules.",
   "Call off the court. People are trapped in there.",
   "If I open the gates now, the other judges will seal them from outside."
  ],
  "taunt": [
   "Your maze sent a spearman and a prowler. I was expecting a better welcome.",
   "They held the outer court. I command what waits inside.",
   "Good. I was worried the best part had already ended.",
   "Confidence turns quickly to confusion among these walls.",
   "I brought a map and enough patience to correct it.",
   "Let us see which one lasts longer.",
   "I'll win your exam and grade the examiners afterward.",
   "The examiners will complain. That may be the first useful grade they receive."
  ],
  "roast": [
   "Your court is a hedge that learned legal jargon and got carried away.",
   "The labyrinth has guarded royal law for generations.",
   "It also misplaced its own exit. Impressive work, counselor.",
   "Every path has a purpose.",
   "Yes: making travelers wish they had packed pruning shears.",
   "Then bring your wit into the heart of the maze.",
   "Your court is a hedge with a desk and delusions.",
   "The desk is oak. It is the only part of this institution that does its job."
  ]
 },
 "Throne Ascendant": {
  "opening": [
   "The regent fell. The throne has decided to handle this personally.",
   "You're a chair. That's going to be difficult.",
   "I am every royal command this kingdom obeyed.",
   "And none of the people who had to obey it.",
   "People change their minds. The throne remembers who was in charge.",
   "Who gets to sit on you now?",
   "No one. That is precisely why I am standing up."
  ],
  "kind": [
   "The people can decide their own future. Let the throne be a memory.",
   "Memory breaks. A living hand can change its mind.",
   "That is why it can learn. A crown that cannot listen cannot lead.",
   "You would trust a fragile kingdom to imperfect voices?",
   "I would trust them with their own lives.",
   "Then defend that faith. I have inherited a great many bad arguments.",
   "The kingdom can make choices without a throne.",
   "It can. That is the part the throne was built to prevent."
  ],
  "taunt": [
   "You needed five regions of guards to avoid one conversation?",
   "They were the kingdom’s strength, gathered to my will.",
   "They are gone. Now it is just you and the person who got here.",
   "I contain every royal claim that came before me.",
   "Then you contain a remarkable number of bad decisions.",
   "Come closer. I will show you how history answers.",
   "A chair challenging me to a duel is a new low for this court.",
   "The court has known lower. You are standing on its carpet."
  ],
  "roast": [
   "The final ruler is furniture with an attitude. That tracks.",
   "I am the living will of the crown.",
   "So a chair developed an ego before it developed legs.",
   "My authority reaches every corner of Crownhold.",
   "Wonderful. Then everyone can hear how badly this is going for you.",
   "I will silence that mouth and make it part of the court record.",
   "Even your upholstery looks like it wants a different ruler.",
   "The upholstery remembers the last one. It has survived worse insults."
  ]
 },
 "Ashen Throne Warden": {
  "opening": [
   "The throne is broken. Its last order is still burning inside my armor.",
   "People took the fortress apart to build homes.",
   "They took the stone. Nobody canceled my watch.",
   "There isn't a throne left to guard.",
   "I am aware. I stand in the rain where it used to be.",
   "Then why are you still holding that sword?",
   "Nobody gave the order to put it down. I have been hoping someone would."
  ],
  "kind": [
   "You were made to protect a place. Let the people make it safe again.",
   "I remember only the order to stand when all others fell.",
   "You can stand with them instead of against them.",
   "No one has ever offered a ruin a new purpose.",
   "Then listen to what is rising outside these walls.",
   "I will listen after I know you can carry its weight.",
   "Your watch can end. Those homes need a guard.",
   "An order to protect something living. I almost remember how that feels."
  ],
  "taunt": [
   "A fortress fell, and somehow its security system still thinks it is employed.",
   "The throne may be gone. I still know how to fight.",
   "Good. I did not walk through rubble for a quiet debate.",
   "Every blow I take heats the old armor further.",
   "Then I will finish before you become a furnace.",
   "Try. The ashes remember every defender before me.",
   "The rain will rust you before I do.",
   "It has been trying. I am faster at standing still."
  ],
  "roast": [
   "Your king is gone, your castle is rubble, and you are guarding a pile of warm bricks.",
   "I guard the throne’s final command.",
   "A command from a chair that no longer exists. Impressive career planning.",
   "The fire beneath this armor is not a joke.",
   "Neither is leaving people homeless for a dead landlord.",
   "Then meet the fire and see which story survives.",
   "You guard a puddle where a chair used to be.",
   "I know exactly where it stood. That is the problem."
  ]
 },
 "Roadshade Mimic": {
  "opening": [
   "Welcome! Directions, supplies, and absolutely no questions about the bag.",
   "The bag has teeth.",
   "It is a very secure bag.",
   "Travelers went missing after your bargains.",
   "Only the ones who didn't read the terms. The terms are inside the bag.",
   "Does the bag bite everybody?",
   "Only people who ask about the bag. Unfortunately, that is everybody."
  ],
  "kind": [
   "Let the travelers go. There is enough on the road without feeding on them.",
   "Kindness is a currency I have never learned to keep.",
   "You can learn. Start by opening the path behind you.",
   "And lose the finest business location in the kingdom?",
   "A safe road is worth more than any bargain you made here.",
   "Fine. Let us see whether kindness survives a bill with teeth.",
   "Let the travelers out and I will put away the weapon.",
   "That is a difficult inventory request. I will consider the weapon first."
  ],
  "taunt": [
   "I have seen better disguises in a school play.",
   "And yet you walked close enough to admire mine.",
   "I walked close enough to end your little shop.",
   "Bold customers are always the most profitable.",
   "Try charging me. See how the transaction goes.",
   "With pleasure. No refunds once the teeth come out.",
   "Your scam needs a better sign.",
   "The sign works. You read it and walked right over."
  ],
  "roast": [
   "You are a backpack with a mouth pretending to understand economics.",
   "I have excellent margins.",
   "Yes, mostly where your disguise is splitting at the seams.",
   "You are being very rude to a local business.",
   "A local business that eats its customers deserves a terrible review.",
   "You may post it from inside the inventory.",
   "Your bag has more teeth than your sales pitch has terms.",
   "The terms are inside. Stop making me explain the joke."
  ]
 },
 "Lucien Redeemed": {
  "opening": [
   "Welcome to the court. The garden is open and the duel has witnesses.",
   "You put 'nobody gets locked in' on the invitation.",
   "People asked. More than one person, actually.",
   "Good. They should see you keep your word.",
   "They will. I would also like them to see me land one clean hit.",
   "Are the witnesses here to keep you honest?",
   "Mostly. One is here because he heard there would be biscuits."
  ],
  "kind": [
   "We can show them strength without cruelty. I trust you to remember why we rebuilt.",
   "You make trust sound far less terrifying than I find it.",
   "You have practiced. I have seen you listen when it was difficult.",
   "Then I will fight well and stop when the duel is done.",
   "That is all I ask. Let them see who you chose to become.",
   "Very well. For once, I would like to be remembered accurately.",
   "We can settle this without hurting each other.",
   "We can. But a careful spar tells me more than another promise."
  ],
  "taunt": [
   "The old Lucien would have made a speech twice this long.",
   "The new Lucien trained while you were talking.",
   "Good. I was hoping for a challenge instead of a ceremony.",
   "Then perhaps I shall surprise you. With restraint, naturally.",
   "You can surprise me by landing a hit first.",
   "Ah. There is the opponent I was hoping to meet.",
   "Ready to lose in front of your whole garden?",
   "I have lost worse things in front of more people. Begin."
  ],
  "roast": [
   "The royal apology tour ends with you challenging me in your own garden?",
   "It is a supervised duel. There are witnesses and a medical kit.",
   "So even your dramatic comeback needed a permission slip.",
   "I had it signed by people whose opinions matter to me.",
   "That is annoyingly wholesome. Your sword stance still needs work.",
   "You can give that criticism while trying to get through it.",
   "That invitation sounded like a king asking permission to show off.",
   "It was. I am trying to ask permission before doing things now."
  ]
 },
 "Peacemaker Sentinel": {
  "opening": [
   "This refuge is open to everyone. This door still has an entrance exam.",
   "We built an academy so people could learn without being judged first.",
   "And I am here to stop the next polite tyrant from taking it.",
   "Then judge what I do, not what I say.",
   "That's the exam. The lecture was optional. I see you skipped it.",
   "Who takes the exam if they only want shelter?",
   "No one. That rule was mine. I think I have enforced it badly."
  ],
  "kind": [
   "I want this place safe for the people who have nowhere else to go.",
   "Compassion can be a shelter. It can also hide a failure to act.",
   "Then I will act when it matters and listen when someone needs room.",
   "A difficult balance for any ruler or teacher.",
   "That is why we practice it together.",
   "Then show me the accord can survive a real challenge.",
   "Let them through while you test me.",
   "Agreed. You have already answered the first question."
  ],
  "taunt": [
   "For a peacekeeper, you picked a fairly aggressive entrance exam.",
   "Mercy without strength is an invitation to the cruel.",
   "Then let us find out how strong your principles really are.",
   "I was built to outlast speeches. Yours is not an exception.",
   "Good. I brought more than words.",
   "The examination begins. I hope your confidence studied.",
   "I will pass before you finish the instructions.",
   "You interrupted the instructions. That is not the same thing."
  ],
  "roast": [
   "Did someone give the academy a walking lecture with shoulder armor?",
   "My instructions are concise and necessary.",
   "You have blocked one door for five minutes. Even Timmy would call this a long speech.",
   "I am not programmed to appreciate that comparison.",
   "Then you can learn. This is an academy, after all.",
   "Lesson one: do not mistake patience for hesitation.",
   "Your entrance exam has one question and a giant sword.",
   "The sword was issued. I wrote the question myself."
  ]
 }
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
