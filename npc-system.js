/* Placenta Creek NPC idle-and-tiny-movement system.
 * The red marks are short villager movement paths. Guards remain anchored.
 */
(() => {
  'use strict';

  const village = document.querySelector('#village');
  if (!village) return;

  const random = (min, max) => min + Math.random() * (max - min);

  // Normalized coordinates against the village scene. Each path is a small
  // offset from the actor's anchor, so the NPC always returns to its marker.
  const placements = [
    // Arrowed blue replacements from the latest placement image.
    { id: 'guard-1', kind: 'guard', src: 'Textures/NPCs/guard-1.png', x: 0.290, y: 0.870, face: 1, paths: [] },
    { id: 'guard-2', kind: 'guard', src: 'Textures/NPCs/guard-2.png', x: 0.892, y: 0.777, face: -1, paths: [] },
    {
      id: 'villager-1', kind: 'villager', src: 'Textures/NPCs/Villager-1.png',
      x: 0.349, y: 0.634, face: 1,
      paths: [[-0.040, 0.060], [0.000, 0.080]],
    },
    {
      id: 'villager-2', kind: 'villager', src: 'Textures/NPCs/Villager-2.png',
      x: 0.580, y: 0.548, face: -1,
      paths: [[-0.024, 0.036], [0.000, 0.070]],
    },
    {
      id: 'villager-3', kind: 'villager', src: 'Textures/NPCs/Villager-3.png',
      x: 0.484, y: 0.776, face: 1,
      paths: [[0.036, -0.060]],
    },
    {
      id: 'villager-4', kind: 'villager', src: 'Textures/NPCs/Villager-4.png',
      x: 0.432, y: 0.931, face: -1,
      paths: [[0.032, 0.040]],
    },
  ];

  const style = document.createElement('style');
  style.id = 'placenta-creek-idle-npc-style';
  style.textContent = `
    #villageNpcLayer {
      position:absolute; inset:0; z-index:3; pointer-events:none;
      overflow:hidden;
    }
    .village-idle-npc {
      position:absolute; width:48px; height:48px;
      transform:translate(-50%,-100%);
      transform-origin:50% 100%;
      pointer-events:none;
    }
    .village-idle-npc .npc-shadow {
      position:absolute; left:50%; bottom:-1px;
      width:24px; height:6px; transform:translateX(-50%);
      border-radius:50%; background:rgba(5,8,10,.42);
      filter:blur(1px);
    }
    .village-idle-npc .npc-image {
      position:absolute; left:50%; bottom:0;
      width:auto; max-width:none; object-fit:contain;
      transform-origin:50% 100%;
      transition:transform .18s ease;
      filter:drop-shadow(2px 3px 1px rgba(0,0,0,.45));
    }
    .village-idle-npc.guard .npc-image { height:38px; }
    .village-idle-npc.villager .npc-image { height:36px; }
    .village-idle-npc.is-night .npc-shadow { background:rgba(0,0,0,.58); }
    @media (max-width:700px) {
      .village-idle-npc { width:38px; height:40px; }
      .village-idle-npc.guard .npc-image { height:32px; }
      .village-idle-npc.villager .npc-image { height:31px; }
      .village-idle-npc .npc-shadow { width:20px; height:5px; }
    }
  `;
  document.head.appendChild(style);

  const layer = document.createElement('div');
  layer.id = 'villageNpcLayer';
  layer.setAttribute('aria-hidden', 'true');
  village.appendChild(layer);

  const actors = placements.map(data => {
    const actor = document.createElement('div');
    actor.className = `village-idle-npc ${data.kind}`;
    actor.dataset.id = data.id;
    actor.dataset.kind = data.kind;
    actor.style.left = `${data.x * 100}%`;
    actor.style.top = `${data.y * 100}%`;
    actor.style.zIndex = String(20 + Math.round(data.y * 10));

    const shadow = document.createElement('div');
    shadow.className = 'npc-shadow';
    const image = document.createElement('img');
    image.className = 'npc-image';
    image.src = data.src;
    image.alt = '';
    image.draggable = false;
    actor.append(shadow, image);
    layer.appendChild(actor);

    return {
      ...data,
      el: actor,
      image,
      nextLookAt: performance.now() + random(1400, 3200),
      pathIndex: 0,
      pathProgress: 0,
      movementState: data.paths?.length ? 'idle' : 'stationary',
      movementPath: null,
      actionAt: performance.now() + random(1800, 3600),
    };
  });

  const setFacing = actor => {
    actor.image.style.transform = `translateX(-50%) scaleX(${actor.face < 0 ? -1 : 1})`;
  };

  const setPosition = actor => {
    actor.el.style.left = `${actor.x * 100}%`;
    actor.el.style.top = `${actor.y * 100}%`;
    actor.el.style.zIndex = String(20 + Math.round(actor.y * 10));
  };

  const startNextPath = (actor, now) => {
    const path = actor.paths[actor.pathIndex % actor.paths.length];
    actor.pathIndex += 1;
    actor.movementPath = path;
    actor.pathProgress = 0;
    actor.movementState = 'outbound';
    actor.actionAt = now;
    if (Math.abs(path[0]) > 0.002) actor.face = path[0] < 0 ? -1 : 1;
    setFacing(actor);
  };

  const updateMovement = (actor, now, dt) => {
    if (!actor.paths?.length || actor.movementState === 'stationary') return;
    if (now < actor.actionAt) return;

    if (actor.movementState === 'idle') {
      startNextPath(actor, now);
      return;
    }
    if (actor.movementState === 'endpoint-idle') {
      actor.movementState = 'returning';
      actor.pathProgress = 0;
      actor.actionAt = now;
      return;
    }

    const path = actor.movementPath;
    // Keep the movement deliberately gentle: these are tiny idle gestures,
    // not patrol routes.
    const duration = actor.movementState === 'outbound' ? 2400 : 2800;
    actor.pathProgress = Math.min(1, actor.pathProgress + dt / duration);
    const amount = actor.movementState === 'returning'
      ? 1 - actor.pathProgress
      : actor.pathProgress;
    actor.x = actor.xAnchor + path[0] * amount;
    actor.y = actor.yAnchor + path[1] * amount;
    setPosition(actor);

    if (actor.pathProgress >= 1) {
      if (actor.movementState === 'outbound') {
        actor.movementState = 'endpoint-idle';
        actor.actionAt = now + random(500, 950);
      } else {
        actor.x = actor.xAnchor;
        actor.y = actor.yAnchor;
        actor.movementState = 'idle';
        actor.actionAt = now + random(1800, 3600);
        setPosition(actor);
      }
    }
  };

  const update = now => {
    const dt = Math.min(80, now - (update.lastFrame || now));
    update.lastFrame = now;
    const visible = village.classList.contains('active');
    layer.style.display = visible ? 'block' : 'none';
    if (visible) {
      const clock = window.gameClock?.getState?.();
      const night = !!clock?.isNight;
      actors.forEach(actor => {
        actor.el.classList.toggle('is-night', night);
        updateMovement(actor, now, dt);
        const canLook = actor.movementState === 'stationary'
          || actor.movementState === 'idle'
          || actor.movementState === 'endpoint-idle';
        if (canLook && now >= actor.nextLookAt) {
          actor.face *= -1;
          setFacing(actor);
          actor.nextLookAt = now + random(1800, 4400);
        }
      });
    }
    requestAnimationFrame(update);
  };

  actors.forEach(actor => {
    actor.xAnchor = actor.x;
    actor.yAnchor = actor.y;
    setPosition(actor);
    setFacing(actor);
  });
  window.placentaCreekNPCs = {
    actors,
    refresh: () => actors.forEach(setFacing),
  };
  requestAnimationFrame(update);
})();