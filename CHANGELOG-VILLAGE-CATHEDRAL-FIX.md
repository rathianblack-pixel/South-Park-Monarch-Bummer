# Village and Cathedral Texture Fix

- Removed the village's layered `VillageLayers` stage and its front/back sway animations.
- Removed village-layer texture preloading. The village now uses only the default day and night textures:
  - `Textures/Maps/village.jpg`
  - `Textures/Maps/village-night.jpg`
- Made the building-texture directory the single source for all daytime interiors.
- Cathedral day interiors now explicitly use `Textures/Buildings/cathedral.png`.
- Removed the obsolete legacy interior-map definitions so the old cathedral texture cannot be selected by that path.
- Left combat texture layering, day/night blending, gameplay, saves, UI, and other area visuals unchanged.