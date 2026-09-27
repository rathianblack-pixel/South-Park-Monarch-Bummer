# The Demon's Lord Bummer — World Reactivity Update

This update builds directly on the Alive Update. It does not replace the existing combat, progression, quest, save, event, or reward systems; it adds behavior and presentation around them so the same game state produces more visible consequences.

## World Memory / Reputation

A hidden world-memory layer now tracks five behavioral tendencies without showing a morality meter: generosity, greed, mercy, violence, and nerve. Existing Alive Update road-event choices are read from their saved choice history and translated into these tendencies, while new recurring-NPC choices update the same memory.

NPCs use this memory in later dialogue. The ending also adds a **The World Remembers** epilogue that summarizes notable relationships and consequences rather than displaying raw reputation points.

Normal New Game starts reset the new world-reactivity state. Existing older saves safely receive zero/default values and keep their existing HP, coins, equipment, progression, and unlocks.

## Recurring NPC System

24 new NPCs are active in the encounter pool. New NPC encounters are occasional and use the existing overworld travel flow rather than checking every frame. Unseen NPCs are weighted more heavily, while rare NPCs appear less frequently.

Every recurring character remembers whether the player has met them and whether the relationship is positive or negative. Previously met characters can also appear as rotating visitors in Placenta Creek; selecting a visitor opens a short relationship-aware conversation.

### New recurring characters

- Corvin — Wounded Traveler
- Merrick — Shady Merchant
- Mabel — Village Gossip
- Brom — Ex-Guard
- Lyra — Forest Herbalist
- Pipwick — Traveling Bard
- Oddo — Gravekeeper
- Cassian — Relic Hunter
- Greta — Angry Cousin
- Sister Mara — Nun Apothecary
- Tobin — Runaway Squire
- Bernard — Town Crier
- Aldrin — Suspicious Magistrate
- Bruna — Rough Innkeeper
- Fenn — Nervous Courier
- Agatha — Hedge Witch
- Perrin — Tax Collector
- Osric — Retired Knight
- Garrick — Swamp Fisherman
- Jangles — Traveling Puppeteer
- Elsie — Village Tailor
- Cedric — Scholar Cartographer
- Mira — Stablehand Squire
- Rook — Masked Highway Bandit

Their encounter choices affect relationship state, hidden reputation, resources, or future flags. Characters alter their return dialogue according to prior treatment and the player's broader reputation.

## Delayed Consequence Chains

Several choices now return as explicit character-driven consequences instead of merely changing a flag:

- Helping Corvin can cause Fenn to deliver Corvin's repayment several travels later.
- Robbing Corvin can bring Greta, his angry cousin, into a later confrontation where the player can make amends or escalate the feud.
- Sparing Rook can result in Rook returning later to repay the debt with supplies or information.
- Helping Agatha gather ingredients can produce a later potion encounter.
- Lying to Perrin about diplomatic immunity can trigger a later audit from Magistrate Aldrin.

The Alive Update's existing delayed choices remain intact and now also influence the hidden reputation layer.

## Enemy Personalities

Existing enemies now receive consistent combat personalities. Personalities modify the intent the existing combat engine already uses, so the system does not create parallel damage calculations.

- **Aggressive** enemies prefer Heavy attacks and Charges, especially when hurt.
- **Defensive** enemies favor Dodge behavior and protect openings until pressure forces them forward.
- **Cowardly** enemies favor Fast/Dodge behavior and low-health non-boss enemies have a small chance to flee rather than take another turn.
- **Berserk** enemies become increasingly Charge-focused as HP falls.
- **Trickster** enemies cycle between Status, Dodge, and Fast pressure.
- **Protector** enemies favor steady Heavy attacks with occasional status pressure and modest defensive positioning.

Examples include Defensive Sir Barnaby, Cowardly Goblin Poachers, Berserk Zombie Wolves, Trickster Gloomfang, Protector Lich King Timmy, and Aggressive Monarch Lucien.

Enemy personality is shown as a compact battlefield tag so players can learn behavior rather than guessing from invisible stat changes.

## Combat Interaction / Stagger

The existing three-card combat system was kept intact. Instead of adding more cards, the update makes current attacks interact with enemy telegraphs.

A critical hit, or a sufficiently heavy hit against a telegraphed Heavy/Charge attack, can **STAGGER** the enemy. The pending counterattack is converted to the existing Fast attack behavior, reducing its damage. This means timing a strong hit against an obvious wind-up now has a mechanical payoff.

Burning prevents defensive/cowardly enemies from receiving their normal extra dodge behavior. Existing Soaked, Bleeding, Guard, armor passives, weaknesses, resistances, and status logic remain authoritative.

## Combat Environments

Each area now supplies a lightweight battlefield behavior modifier using the existing intent system:

- **Muddy Road — Placenta Creek:** occasional Charge attacks lose footing and become Fast attacks.
- **Bramble Edge — Mild Inconvenience:** some Heavy/Charge approaches snag on undergrowth and become shorter attacks.
- **Grave Mist — Grave Mistake:** the cemetery periodically pushes enemies toward status attacks.
- **Shifting Floor — Questionable Decisions:** enemy movement alternates between evasive and quick exchanges.
- **Fortress Pressure — Dread Fortress:** final boss phases become more direct and Charge-oriented.

A small battlefield tag names the current environmental condition. These effects reuse existing attack types rather than creating a second damage engine.

## Boss Phases

The five area bosses now have stronger three-stage presentation and behavior layered over the existing boss-phase calculations.

- Phase 1 presents a boss-specific entrance line.
- Phase 2 triggers a new phase banner, camera emphasis, changed tactics, and the boss's damaged texture.
- Phase 3 adds a stronger visual state and desperation behavior tailored to the boss.

Sir Barnaby becomes harder to read defensively before turning direct; Gloomfang leans further into evasive/trick behavior; Lich King Timmy becomes status-focused; the Minotaur's panic changes its movement pattern; and Monarch Lucien becomes increasingly direct near defeat.

The existing Alive Update death sequencing still controls the final collapse and reward timing.

## Damaged Enemy Textures

All existing monster textures now have low-health damaged counterparts. The enemy sprite automatically changes when HP drops below roughly half, or when a boss enters Phase 2.

22 damaged monster variants are included, covering the full current monster asset set, including all five bosses. If a damaged texture ever fails to load, the original enemy texture remains as the fallback.

## Evolving Areas

The overworld now includes a compact **World state** summary based on real area progression. Cleared bosses change the area's description rather than leaving every region narratively frozen after Level 5.

The level-select modal also reflects the current area's changed condition. This gives revisits a small acknowledgement that the boss encounter happened without redesigning the level structure.

### Dread Fortress pressure reaching Placenta Creek

Once the player has progressed far enough into Dread Fortress but has not defeated Lucien, Placenta Creek visibly enters a pressure state. Existing guards and villagers switch to their damaged variants, and the Priest, Blacksmith, and Merchant use damaged variants while the threat is active. After the final victory, those town characters return to their normal art.

This is a visual example of one area affecting another instead of every location existing independently.

## Rare Encounters

Several recurring NPCs use reduced spawn weight and function as rarer road encounters, including Pipwick, Cassian, Aldrin, Agatha, Perrin, Jangles, and Rook. They use the same persistent relationship system and can participate in delayed consequences.

## Better Transitions and Pacing

Screen changes receive a short, reduced-motion-aware presentation pass. Boss phases use short non-blocking banners and controlled camera emphasis. The existing Alive Update combat animation and camera systems remain responsible for attack lunges, recoil, damage feedback, and death sequences.

## Ending Payoff

The existing ending choices are preserved. When the ending scene appears, a new **The World Remembers** section summarizes a small selection of consequences from the current run, such as Corvin/Greta, Rook, Agatha, Pipwick, overall reputation, changed regions, and how many recurring travelers learned the player's name.

This does not create a new ending branch; it personalizes the existing ending with the history of the run.

## New Textures Integrated

The build contains:

- 24 new recurring-NPC normal textures.
- 24 damaged variants for those new NPCs.
- 10 damaged variants for the original non-player town/NPC sprites.
- 22 damaged variants for the existing monster set.

Player armor damage textures were left unchanged because the game already had its own player-damage texture system.

## Technical Changes

### Added

- `reactivity-systems.js` — world memory, NPC encounters, delayed consequences, personalities, boss phase behavior, damaged-sprite switching, evolving areas, environment behavior, visitors, transitions, and ending callbacks.
- `reactivity-systems.css` — personality/environment tags, NPC encounter layout, phase banners, visitor display, world-state panel, flee/stagger effects, and epilogue styling.
- `Textures/NPCs/Reactivity/Normal/` — 24 new NPCs.
- `Textures/NPCs/Reactivity/Damaged/` — 24 damaged new NPCs.
- `Textures/NPCs/Damaged/` — damaged original NPC variants.
- `Textures/Monsters/Damaged/` — damaged monster variants.
- `Textures/asset-manifest-world-reactivity.json` — manifest for the new art set.

### Edited

- `index.html` — loads the World Reactivity CSS and JavaScript after the Alive Update so the previous systems remain authoritative.

The original `game.js`, `alive-systems.js`, and `npc-system.js` are retained in the package rather than being rewritten into a separate game engine.

## Validation Performed

The combined build was checked for JavaScript syntax errors and exercised in a headless browser harness with a mocked local save origin. Tests covered:

- World Reactivity initialization with no runtime errors.
- All 24 recurring NPCs rendering a usable encounter with multiple choices.
- Sir Barnaby receiving the Defensive personality.
- Boss transition from Phase 1 to Phase 2.
- Intended damaged-monster asset path creation.
- Critical/large-hit Stagger converting a pending Charge into Fast behavior.
- Corvin choice persistence and reputation update.
- Fenn's delayed Corvin repayment appearing after later travel.
- Evolving overworld state rendering.
- Dread Fortress pressure switching a village guard to damaged art.
- Recurring visitors appearing in Placenta Creek after discovery.
- Ending epilogue generation.
- Loading a legacy save with no World Reactivity fields while preserving name, HP, max HP, coins, progression, and equipment state.
- Normal New Game clearing the new reactivity memory.
- Asset verification: all 48 new-NPC images are 512×512 RGBA with transparency; all 22 damaged monsters and all 10 damaged existing NPCs are present and readable.

