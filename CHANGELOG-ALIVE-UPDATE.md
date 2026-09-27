# The Demon Lord's Bummer — Physical / Reactive / Story Update

This update is intentionally limited to the requested combat movement, death feedback, damage numbers, area mini-arcs, camera movement, overworld events, and persistent delayed choices. Existing combat formulas, progression, quests, save format, art assets, and core game structure remain authoritative.

### Combat

- Player and enemy art now moves during combat instead of remaining static.
- Sword attacks use anticipation, a quick forward lunge, contact, a small recoil, and a smooth return to the exact neutral position.
- Bow attacks use a short backward lean/shift and a fast paper-cut projectile streak rather than moving the player all the way across the battlefield.
- Magic attacks use a lowered/buildup pose, a small forward release, a magic projectile streak, impact, and return.
- Guard moves the player slightly back/down into a held defensive stance.
- Guarded enemy hits use a visibly smaller recoil than unguarded hits.
- Enemy attacks use telegraph -> move toward player -> impact -> player recoil -> return timing. Travel distance varies with the existing intent type (charge/heavy/fast/dodge/status).
- Existing action locks remain authoritative, so repeated button presses cannot stack combat actions while the current action/notice is unresolved.
- Actor movement is applied to inner motion shells so the original fighter positions are never permanently changed.
- Normal enemy death: final hit -> strong recoil/flash -> short stagger -> sideways paper-cut fall -> downward collapse -> fade.
- Boss death: larger final recoil -> multiple stagger movements -> longer dramatic collapse -> fade.
- Victory/reward handling is held until the visible death sequence finishes.
- Existing hit flashes, comic impact words, status effects, weapon SFX, and combat calculations remain in use.

### Damage Numbers

- Damage numbers now use the real amount passed by the existing combat calculation at the exact HP-change point.
- Normal damage: `-amount` near the damaged actor with horizontal jitter, scale-pop, upward movement, and fade.
- Critical damage: larger `amount!` treatment using the existing real critical flag.
- Healing: `+amount` using the real healed amount.
- Status ticks: the status name plus the real tick value, e.g. `BLEEDING 2`, `BURNING 4`, `POISON 2` when those existing effects tick.
- Missed/dodged attacks display `MISS`.
- Zero-damage result messaging displays `BLOCKED`.
- Temporary combat-number elements remove themselves after their animation.

### Camera

Camera motion is simulated only on the battlefield/platform/character layer; HUD, cards, and nameplates remain outside the camera transform.

- Combat entry: small controlled zoom-in.
- Player attack: tiny push toward the enemy.
- Enemy attack: tiny push toward the player.
- Heavy impact: very short controlled camera kick.
- Critical hit: brief impact zoom and return.
- Boss entrance: slower subtle boss-focused zoom.
- Boss final hit: stronger but controlled impact movement.
- Every camera animation returns to the exact neutral transform and does not accumulate transforms.
- `prefers-reduced-motion` is respected by suppressing or drastically shortening the new movement effects.

### Story Arcs

**Placenta Creek** — Food disappears from the village; slime and road trouble reveal organized theft; enemies increasingly point toward Sir Barnaby; his boss fight exposes a ridiculous protection scheme; after victory, the food returns and villagers react to the restored town.

- Level 1: Missing Supper.
- Level 2: The Road Has Feathers.
- Level 3: A Name Between Hiccups.
- Level 4: Barnaby's Crest.
- Level 5: Sir Barnaby's Protection Plan.

**Mild Inconvenience** — Illegal hunting and corrupted wildlife escalate through the forest; frightened creatures and clues point to Gloomfang's territorial curse; defeating Gloomfang settles the forest and its roads.

- Level 1: Illegal Hunting Season.
- Level 2: The Wolf That Would Not Stay Dead.
- Level 3: Fear Tax.
- Level 4: The Bramble Trail.
- Level 5: Gloomfang's Territory.

**Grave Mistake** — Graves are opening for a reason; the player finds increasingly deliberate necromancy, an apprentice's connection to Timmy, and royal burial orders; Lich King Timmy is revealed as the source of the organized resurrection problem.

- Level 1: The Graves Are Leaving.
- Level 2: Someone Opened the Crypt.
- Level 3: Necromancy Internship.
- Level 4: Royal Burial Orders.
- Level 5: Timmy's Eternal Fan Club.

**Questionable Decisions** — The maze behaves like it regrets existing; shifting routes, apologetic traps, and discarded plans reveal that the Minotaur is anxiously redesigning the dungeon around the player; the center becomes the final scheduled confrontation.

- Level 1: The Entrance Regrets You.
- Level 2: Corridors With Opinions.
- Level 3: The Builder Is Panicking.
- Level 4: Apologetic Traps.
- Level 5: Scheduled Confrontation.

**Dread Fortress** — The fortress gate, gargoyles, destroyed tribute ledgers, and exhausted guards progressively reveal Lucien retreating toward the throne while the kingdom pays for his rule; Monarch Lucien becomes the direct conclusion of the area's story.

- Level 1: The Gate Is Still Employed.
- Level 2: Stone Witness.
- Level 3: Burned Ledgers.
- Level 4: Last Door Before the Throne.
- Level 5: Monarch Lucien.

Story beats appear as short encounter cards only on a level's first uncleared attempt. Boss completion creates a short post-boss world reaction after the existing reward flow. Placenta Creek's village status also changes after its boss is resolved.

### Random Events

The original 10 road events are preserved. The event pool now contains 24 total events. The 14 newly added events are:

1. **A Wounded Traveler** — Help them for 10 coins / Ignore them / Rob them.
2. **A Package With Your Name On It** — Open the package / Donate it forward. This is a delayed follow-up to helping the wounded traveler.
3. **The Merchant's Cousin** — Pay them back for 10 coins / Deny everything / Leave before this becomes paperwork. This is a delayed response to robbing the traveler.
4. **A Bandit Who Has Reconsidered Banditry** — Let them go / Turn them in / Take their map.
5. **An Extremely Awkward Rescue** — Accept the hidden supplies / Ask for information instead. This can occur later if the bandit was spared.
6. **A Merchant Holding the Map Upside Down** — Guide them to the road / Charge a navigation fee / Point dramatically in a random direction.
7. **Roadside Trade Credit** — Accept the thank-you / Ask them to help someone else. This can occur later after helping the lost merchant.
8. **A Broken Roadside Shrine** — Repair the shrine / Take the coins / Leave it alone.
9. **The Crow Has Witnesses** — Return five coins / Question the reliability of bird testimony. This can occur later after stealing from the shrine.
10. **Screaming From the Trees** — Investigate / Call out directions from here / Pretend you heard nothing.
11. **Bridge Troll, Administrative Division** — Pay the 4-coin filing fee / Tell a terrible joke / Forge Form B-12.
12. **The Abandoned Camp** — Read the journal / Take the supplies / Put out the fire and leave.
13. **A Fortress Deserter** — Let them escape / Ask for supplies / Send them back.
14. **A Message Scratched Into the Road** — Memorize the warning / Erase the message. This can occur later if the fortress deserter was allowed to escape.

Event checks happen only during existing travel/map transitions, not every frame. The enhanced event cadence requires travel spacing between events and retains area-based probability so the player is not interrupted constantly. Existing event rewards, including legacy potion and quest rewards, continue to work through the upgraded event handler.

### Persistent Choices

Persistent choice memory is stored inside the existing save `state.meta` object and safely defaults missing fields for older saves.

- **Help wounded traveler** -> stores `helpedTraveler`; after later travel, **A Package With Your Name On It** can appear. Opening it can set `travelerRepaid`; donating forward stores a separate kindness flag.
- **Rob wounded traveler** -> stores `robbedTraveler`; after later travel, **The Merchant's Cousin** can confront the player. Repaying sets `madeTravelerAmends`; denying it is also remembered. Merchant dialogue reacts while the issue is unresolved.
- **Spare the road bandit** -> stores `sparedRoadBandit`; later **An Extremely Awkward Rescue** can repay the favor with supplies or information. A repayment flag can also affect later blacksmith/world-memory dialogue.
- **Help the lost merchant** -> stores `helpedMerchantRoad`; later **Roadside Trade Credit** can appear, and merchant dialogue acknowledges the earlier help.
- **Repair the roadside shrine** -> stores `repairedShrine`; Cathedral dialogue can acknowledge it later.
- **Steal from the roadside shrine** -> stores `robbedShrine`; later **The Crow Has Witnesses** can confront the player, with repayment or argument outcomes remembered.
- **Spare the fortress deserter** -> stores `sparedFortressDeserter`; later **A Message Scratched Into the Road** can provide a delayed warning before the final fortress stretch.
- Other event choices are recorded in bounded history with their event ID, selected option, travel count, and area so future additions can reuse the same memory structure without introducing a second save system.
- Delayed follow-ups use travel-count conditions rather than revealing every consequence immediately.
- Consequences are intentionally modest: dialogue, small rewards, information, or light resource effects rather than save-breaking progression penalties.

### Technical Changes

**Edited: `index.html`**
- Loads the new scope-limited stylesheet and behavior module after the existing game scripts.
- No HUD redesign, progression redesign, or asset replacement was added.

**Edited: `game.js`**
- Passes existing status labels into real damage-number callbacks.
- Passes the existing Guard result into player hit feedback so guarded recoil can be smaller.
- Passes the existing critical flag into the real damage-number callback.
- Passes Bleeding tick identity into the real status-number callback.
- Exposes the existing overworld event array to the extension module so the new events extend the original system instead of creating a parallel event database.

**Added: `alive-systems.js`**
- Safe old-save defaults for story and choice-memory state.
- Combat motion timing hooks built around the existing battle notice/action cadence.
- Real damage/heal/status/miss/blocked feedback.
- Normal and boss death sequencing with victory-delay synchronization.
- Battlefield-only camera effects.
- Five area mini-arcs and post-boss reactions.
- Fourteen additional road events, persistent flags, delayed follow-up conditions, and NPC/world reactions.
- Cleanup for temporary elements/timers and no per-frame event polling.

**Added: `alive-systems.css`**
- Cutout-style actor motion, recoil, death, projectile, floating-number, camera, and story-card animations.
- Reduced-motion fallback.

**Validation performed**
- JavaScript syntax checks passed for `game.js` and `alive-systems.js`.
- Normal sword combat tested through anticipation -> real impact -> enemy recoil -> enemy counter -> unlocked next action.
- Bow attack tested with lean/motion and projectile streak.
- Magic attack tested with buildup, projectile, real damage number, mana use, and real Light healing number.
- Guard tested with held stance, reduced incoming damage, and smaller guarded recoil.
- Critical feedback tested with the real critical calculation flag and `amount!` display.
- Miss and zero-damage result feedback tested as `MISS` and `BLOCKED`.
- Status damage tested using the existing Bleeding tick and its real HP change.
- Normal enemy death tested to keep combat/rewards locked until the fall is complete.
- Boss death tested to keep combat/rewards locked through the longer multi-stagger collapse.
- Player death flow tested after an enemy hit.
- Multiple combats were run in the same page without refresh while checking motion-shell reset and action unlock behavior.
- First-clear story card -> actual existing combat start was tested.
- Persistent event choice -> save serialization -> delayed follow-up event was tested.
- An original pre-existing road event was tested through the upgraded handler to confirm its legacy potion reward still maps to the existing Drumstick item.
- A simulated older save with no new story/event fields loaded with its original player name, HP, max HP, coins, progress, max hub, and travel count preserved while the new fields safely defaulted empty.
