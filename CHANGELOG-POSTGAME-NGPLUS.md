# Post-Game + New Game+ Expansion — Complete Change Log

This update turns the original ending into the beginning of a larger persistent world. The postgame now branches from the player's gender-specific finale choice, and New Game+ inherits that route instead of simply replaying the same five areas with reset progression.

## 1. Six persistent ending worlds

The finale now creates one of six remembered world states.

### Male routes

1. **Crownhold Ascendant** — Become King
   - The player accepts the crown and rebuilds the kingdom as ruler.
   - Legacy Perk: **Monarch's Authority**
   - NG+ bonus: +25 coins, +1 weapon level.
   - Postgame themes: petitions, law, rebuilding, authority, royal responsibility.

2. **Ashen Republic** — Destroy the Throne
   - The monarchy is dismantled and the regions rebuild themselves.
   - Legacy Perk: **Breaker of Crowns**
   - NG+ bonus: +4 max HP, +1 armor level, +2 demon steel.
   - Postgame themes: citizen councils, salvage, memorials, public rebuilding.

3. **Wanderer's Wake** — Leave the Throne Empty
   - The player refuses rule and becomes a legendary traveler.
   - Legacy Perk: **The Wanderer**
   - NG+ bonus: +18 coins, +2 leather, +1 bones.
   - Postgame themes: roads, camps, caravans, travelers, storytelling.

### Female routes

4. **Roseglass Reign** — Stay With Lucien
   - The player and Lucien rebuild the fortress into a gentler court.
   - Legacy Perk: **Rose Oath**
   - NG+ bonus: +1 magic level, Heal + Purify unlocked.
   - Postgame themes: restoration, court reform, memorials, trust, rebuilding together.

5. **Road of Two Crowns** — Travel Together
   - Lucien leaves the fortress and travels with the player.
   - Legacy Perk: **Companion's Resolve**
   - NG+ bonus: +20 coins, +1 weapon level, travel consumables.
   - Postgame themes: caravans, campfire stories, road quests, escorts, shared adventure.

6. **Quiet Accord** — Remain Friends
   - The old fortress becomes a refuge/academy built around learning and second chances.
   - Legacy Perk: **Accord Keeper**
   - NG+ bonus: +1 armor level, +1 magic level, legacy insight.
   - Postgame themes: sanctuary, scholarship, memory, diplomacy, healing old wounds.

---

## 2. Completely new route-map artwork

Six new large postgame/NG+ world maps were added, plus six night variants:

- `route-male-king.png`
- `route-male-destroy.png`
- `route-male-empty.png`
- `route-female-stay.png`
- `route-female-travel.png`
- `route-female-friends.png`
- matching `-night.png` versions for all six

When New Game+ begins, the overworld now actually changes to the remembered ending world.

The accelerated game clock was updated so NG+ route maps participate in the existing smooth day/night crossfade instead of being overwritten by the original overworld every frame.

---

## 3. New NG+ combat environments

NG+ now uses dedicated full combat backgrounds instead of always recycling the normal campaign areas.

New environments:

- Royal Placenta Creek — day/night
- Free/Broken Placenta Creek — day/night
- Mild Inconvenience NG+ — day/night
- Grave Mistake NG+ — day/night
- Questionable Decisions NG+ — day/night
- Restored/Royal Dread Fortress — day/night
- Ruined Dread Fortress — day/night
- The Shattered Realm — day/night

Royal/restoration routes and free/ruin routes automatically select different Placenta Creek and Dread Fortress states.

NG+ backgrounds are pre-decoded and retained so changing areas does not fall back to stale normal-campaign artwork while the next texture loads.

Normal campaign parallax remains untouched. NG+ full-screen environments intentionally suppress the normal-area parallax layers so old textures cannot appear on top of the new worlds.

---

## 4. Postgame quest campaigns

Every ending route now has a four-quest postgame mini-campaign.

There are **24 route quests** in total.

Each route includes:

- two choice-driven story quests
- two route-specific battle quests
- persistent postgame Renown / Peace / Insight progression
- route-specific rewards
- changed world descriptions for all five existing regions
- a route-specific Placenta Creek state

Examples include:

- The Crown Charter
- The Petition Circuit
- The Royal Audit
- The Revenant Throne
- The Ruin Council
- Bridgework
- Embers Below
- Marshal of the Free Roads
- The Camp Charter
- Stories for Supper
- The Rose Court
- The West Wing Restoration
- Lucien's Vow
- Sentinel of Peace
- The Caravan Oath
- Letters Home
- The Accord Charter
- The Memory Garden

---

## 5. New NG+ enemy roster

Eight completely new sprite assets were added:

- Crown Revenant
- Petition Beast
- Ashen Throne Warden
- Rogue Goose Marshal
- Lucien Redeemed
- Roadshade Mimic
- Peacemaker Sentinel
- Timeline Devourer

The new enemies are integrated into:

- postgame quest battles
- NG+ Level 4 elite encounters
- NG+ Dread Fortress finales
- Codex discovery
- weakness/resistance rules
- status/debuff behavior
- boss phase naming
- enemy warning/telegraph dialogue

They are not simple stat renames of old monsters; they have their own sprites and combat presentation.

---

## 6. NG+ encounter structure

New Game+ now resets each region's level progression while keeping all five regions available.

That means the player can choose where to go, but each region has its own NG+ level climb again.

### Level structure

- Levels 1–3: familiar enemies return under NG+ scaling.
- Level 4: the remembered ending injects a route-specific elite enemy.
- Level 5: original regional bosses return in stronger NG+ form, while the final Dread Fortress encounter becomes route-specific.

This avoids replacing every boss with the same new enemy and preserves the identity of the original five areas.

---

## 7. Real NG+ difficulty scaling

NG+ now scales combat with the number of completed NG+ cycles.

Scaling affects:

- enemy maximum HP
- boss HP bonus
- enemy counterattack damage
- displayed NG+ enemy level
- elite encounter level presentation

Every new NG+ cycle becomes incrementally harder instead of replaying the same numerical campaign forever.

---

## 8. Legacy character snapshot

Finishing an ending now stores a snapshot of the hero who created that world:

- player name
- gender
- weapon type
- magic affinity
- equipped armor set
- weapon level
- armor level
- ending route
- completion time

A short history of previous hero snapshots is retained.

This is used by the secret postgame content.

---

## 9. The Legacy Echo

The Shattered Realm can reconstruct the previous completed hero as an enemy called **Legacy Echo**.

The enemy is assembled from the stored previous-character armor and weapon instead of using a generic monster image.

Its battle text and boss phases deliberately mirror the idea that the player is fighting a hostile memory of an earlier run.

---

## 10. The Legacy Board

A new **Legacy** button appears in the utility dock once postgame/NG+ history exists.

The Legacy Board displays:

- all six ending routes
- locked/unlocked state
- current NG+ world
- unlocked Legacy Perks
- number of discovered routes
- number of NG+ cycles
- status of the hidden final content
- route artwork thumbnails

It functions as the player's persistent ending gallery and NG+ record.

---

## 11. Route-specific NG+ overworld events

Added **12 new route-aware random road events** — two for every ending world.

Examples:

- The Royal Goose Audit
- A Petition About Petitions
- Republic Salvage Crew
- Roadside Constitutional Crisis
- The Campfire That Knows You
- Mapmaker in Distress
- Lucien's Extremely Serious Rose Delivery
- Court Etiquette Emergency
- Caravan of Copycats
- Lucien Found a Shortcut
- Runaway Academy Student
- The Missing Archive Page

These events only appear in the appropriate NG+ route. The normal campaign event pool remains available and unchanged.

---

## 12. Secret postgame area — The Shattered Realm

After discovering at least **three different ending routes**, the Legacy system destabilizes enough to reveal a hidden postgame gauntlet.

The old single-boss secret encounter has been expanded into a three-stage area:

### Stage 1 — The Shattered Gate
Boss: **Crown Revenant**

### Stage 2 — The Hero Who Was
Boss: **Legacy Echo**

### Stage 3 — The True Bummer
Boss: **Timeline Devourer**

The Shattered Realm has its own newly created combat environment and night variant.

Completing it grants a large legacy reward and permanently records the Timeline Devourer as defeated.

---

## 13. New enemy combat behavior details

New enemies now have custom warning lines, status tendencies and boss phase names.

Examples:

- Crown Revenant: `Dead King's Decree` → `Crownfall`
- Petition Beast: `Red Tape Barrage` → `Final Notice`
- Ashen Throne Warden: `Molten Advance` → `Cinder Lock`
- Rogue Goose Marshal: `Martial Honk` → `Winged Tribunal`
- Lucien Redeemed: `Honest Duel` → `Second Chance`
- Roadshade Mimic: `False Bargain` → `Devouring Market`
- Peacemaker Sentinel: `Measured Judgment` → `Last Accord`
- Timeline Devourer: `Timeline Collapse` → `Erase the Save`
- Legacy Echo: `Mirror Stance` → `Old Habit`

---

## 14. Existing systems preserved

This expansion was added without intentionally removing the existing systems already in the current build, including:

- normal campaign progression
- original five areas
- existing day/night clock
- smooth village day/night texture transition
- village front/back sway system
- normal combat parallax layers
- deterministic combat prepare/reveal texture loading
- spell behavior separation
- combat movement/death animations
- damage/status feedback
- existing random overworld events
- Codex
- save slots
- facilities
- equipment and armor systems

---

# Files modified

- `game.js`
- `alive-systems.css`

# Files added

## Route maps
12 files under:

`Textures/UI/Postgame/Maps/`

## NG+ combat maps
16 files under:

`Textures/Maps/NGPlus/`

## NG+ monster sprites
8 files under:

`Textures/Monsters/NGPlus/`

Total new visual assets in this package: **36**.

---

# Technical validation performed

- `game.js` passes `node --check` JavaScript syntax validation.
- All 36 new texture files were verified to exist before packaging.
- NG+ combat backgrounds are 1536×864.
- The new route/night assets are preloaded or decoded through the new NG+ cache path.
- NG+ map/day-night selection was connected directly to the existing global clock so the normal map does not overwrite the new route art.
