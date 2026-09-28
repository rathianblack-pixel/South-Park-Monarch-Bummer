/* One small daytime swallow; visual only, with no save or interaction state. */
(()=>{
  'use strict';
  const village=document.getElementById('village');
  if(!village||village.querySelector('#villageRooftopBird'))return;
  const bird=document.createElement('div');
  bird.id='villageRooftopBird';
  bird.setAttribute('aria-hidden','true');
  bird.style.cssText='position:absolute;left:0;top:0;width:clamp(25px,2.2vw,34px);aspect-ratio:673.5/583.5;background:url("Textures/Ambient/village-swallow-sprites.png") 0% 0%/200% 200% no-repeat;z-index:3;pointer-events:none;transform-origin:50% 90%;will-change:left,top,transform,opacity;';
  village.appendChild(bird);
  // Feet on the marked blacksmith, merchant canopy, and house stops.
  const roofs=[{x:.236,y:.295},{x:.628,y:.695},{x:.773,y:.315}];
  const frames={perched:'0% 0%',up:'100% 0%',down:'0% 100%',glide:'100% 100%'};
  const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches||false;
  let perch=0,target=1,step=1,phase='idle',phaseStart=0,idleMs=11000,flightMs=2300,last=0,facing=1;
  const setFrame=name=>{const pos=frames[name];if(bird.style.backgroundPosition!==pos)bird.style.backgroundPosition=pos};
  const place=(x,y,facing=1,tilt=0,hop=0)=>{
    bird.style.left=(x*100).toFixed(3)+'%';bird.style.top=(y*100).toFixed(3)+'%';
    bird.style.transform=`translate(-50%,-100%) translateY(${hop.toFixed(1)}px) scaleX(${facing}) rotate(${tilt.toFixed(1)}deg)`;
  };
  const beginFlight=now=>{
    if(perch===0)step=1;
    if(perch===roofs.length-1)step=-1;
    target=perch+step;
    facing=roofs[target].x>roofs[perch].x?1:-1;
    flightMs=Math.round(1800+Math.abs(roofs[target].x-roofs[perch].x)*1400);
    phase='takeoff';phaseStart=now;
  };
  const tick=now=>{
    requestAnimationFrame(tick);
    if(now-last<32)return;last=now;
    const daylight=1-Math.max(0,Math.min(1,window.gameClock?.getState?.()?.nightBlend??0));
    if(!village.classList.contains('active')||document.hidden||daylight<=.005){bird.style.visibility='hidden';phaseStart=now;return}
    bird.style.visibility='visible';bird.style.opacity=daylight.toFixed(3);
    if(!phaseStart)phaseStart=now;
    const elapsed=now-phaseStart,from=roofs[perch],to=roofs[target];
    if(reduced){setFrame('perched');place(from.x,from.y,facing);return}
    if(phase==='idle'){
      if(elapsed>=idleMs){beginFlight(now);return}
      setFrame('perched');
      const hopWindow=elapsed%5200,hop=hopWindow>1850&&hopWindow<2090?-Math.sin(Math.PI*(hopWindow-1850)/240)*3:0;
      const tilt=elapsed%3700>1100&&elapsed%3700<1750?-3:0;
      place(from.x,from.y,facing,tilt,hop);
      return;
    }
    const dir=to.x>from.x?1:-1;
    if(phase==='takeoff'){
      const t=Math.min(1,elapsed/260);
      setFrame('up');place(from.x,from.y-.014*t,dir,-5*t);
      if(t>=1){phase='flight';phaseStart=now}
      return;
    }
    if(phase==='flight'){
      const t=Math.min(1,elapsed/flightMs),ease=t*t*(3-2*t);
      const x=from.x+(to.x-from.x)*ease;
      const y=from.y+(to.y-from.y)*ease-.10*Math.sin(Math.PI*t);
      // Flap in short bursts, then hold a glide; no constant mechanical cycle.
      const burst=(elapsed%1050);
      const frame=burst>700?'glide':Math.floor(burst/115)%2?'down':'up';
      setFrame(frame);place(x,y,dir,0);
      if(t>=1){phase='landing';phaseStart=now}
      return;
    }
    const t=Math.min(1,elapsed/240);
    setFrame(t<.65?'up':'perched');place(to.x,to.y-.012*(1-t),dir,2*(1-t));
    if(t>=1){perch=target;phase='idle';phaseStart=now;idleMs=9000+Math.random()*5000}
  };
  setFrame('perched');place(roofs[0].x,roofs[0].y);
  requestAnimationFrame(tick);
})();
