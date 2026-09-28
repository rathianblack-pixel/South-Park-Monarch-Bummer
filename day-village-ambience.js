/* Quiet daytime village motion. All coordinates are relative to the village art. */
(()=>{
  'use strict';
  const village=document.getElementById('village');
  if(!village||village.querySelector('#villageDayAmbience'))return;
  const canvas=document.createElement('canvas');
  canvas.id='villageDayAmbience';
  canvas.setAttribute('aria-hidden','true');
  canvas.style.cssText='position:absolute;inset:0;width:100%;height:100%;z-index:2;pointer-events:none;';
  village.appendChild(canvas);
  const ctx=canvas.getContext('2d');
  if(!ctx){canvas.remove();return}
  const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches||false;
  const TWO_PI=Math.PI*2;
  let width=0,height=0,lastDraw=0;
  const resize=()=>{
    const r=village.getBoundingClientRect(),w=Math.max(1,r.width),h=Math.max(1,r.height);
    if(w===width&&h===height)return;
    width=w;height=h;
    const dpr=Math.min(2,window.devicePixelRatio||1);
    canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
  };
  const light=(x,y,rx,ry,opacity)=>{
    ctx.save();ctx.translate(x*width,y*height);ctx.scale(rx*width,ry*height);
    const glow=ctx.createRadialGradient(0,0,0,0,0,1);
    glow.addColorStop(0,`rgba(255,246,199,${opacity})`);
    glow.addColorStop(.52,`rgba(255,240,177,${opacity*.6})`);
    glow.addColorStop(1,'rgba(255,239,173,0)');
    ctx.fillStyle=glow;ctx.beginPath();ctx.arc(0,0,1,0,TWO_PI);ctx.fill();ctx.restore();
  };
  const smoke=(baseX,baseY,time,phase)=>{
    for(let i=0;i<7;i++){
      const age=(time/4.2+i/7+phase)%1;
      const x=(baseX+.011*age+.006*Math.sin(age*7+phase))*width;
      const y=(baseY-.103*age)*height;
      const radius=(.006+.010*age)*width;
      const alpha=.17*Math.sin(Math.PI*age);
      if(alpha<=0)continue;
      const cloud=ctx.createRadialGradient(x,y,0,x,y,radius);
      cloud.addColorStop(0,`rgba(250,250,240,${alpha})`);
      cloud.addColorStop(1,'rgba(250,250,240,0)');
      ctx.fillStyle=cloud;ctx.beginPath();ctx.arc(x,y,radius,0,TWO_PI);ctx.fill();
    }
  };
  const butterfly=(baseX,baseY,spanX,spanY,size,time,phase,color)=>{
    const orbit=time*.7+phase,x=(baseX+spanX*Math.cos(orbit))*width;
    const y=(baseY+spanY*Math.sin(orbit)+.003*Math.sin(orbit*3))*height;
    const scale=Math.min(width/1672,height/941),s=size*scale;
    const flap=.35+.65*Math.abs(Math.sin(time*12+phase));
    const wing=s*(.35+.55*flap);
    ctx.save();ctx.translate(x,y);
    ctx.strokeStyle='rgba(28,35,27,.92)';ctx.lineWidth=Math.max(.9,1.25*scale);
    ctx.fillStyle=color;
    for(const side of [-1,1]){
      ctx.beginPath();ctx.moveTo(0,0);
      ctx.quadraticCurveTo(side*wing*.9,-s*.85,side*wing,-s*.2);
      ctx.quadraticCurveTo(side*wing*.7,s*.17,0,s*.15);
      ctx.closePath();ctx.fill();ctx.stroke();
    }
    ctx.beginPath();ctx.moveTo(0,-s*.2);ctx.lineTo(0,s*.33);ctx.stroke();
    ctx.restore();
  };
  const draw=now=>{
    requestAnimationFrame(draw);
    if(now-lastDraw<33)return;lastDraw=now;
    if(!village.classList.contains('active')||document.hidden)return;
    resize();ctx.clearRect(0,0,width,height);
    const day=1-Math.max(0,Math.min(1,window.gameClock?.getState?.()?.nightBlend??0));
    if(day<=.001)return;
    ctx.save();ctx.globalAlpha=day;
    const time=reduced?0:now/1000;
    const sway=reduced?0:Math.sin(time*.38);
    light(.32+.009*sway,.666,.075,.038,.13);
    light(.395+.007*sway,.522,.052,.028,.11);
    light(.615+.010*sway,.594,.076,.033,.12);
    light(.865+.007*sway,.726,.064,.028,.10);
    smoke(.169,.299,time,.1);smoke(.844,.295,time,.49);
    if(!reduced){
      butterfly(.522,.785,.018,.013,13,time,.15,'rgba(236,178,51,.9)');
      butterfly(.914,.573,.015,.012,14,time,1.7,'rgba(240,192,70,.9)');
      butterfly(.945,.548,.011,.009,12,time,2.5,'rgba(177,211,135,.9)');
      butterfly(.105,.675,.014,.010,13,time,3.8,'rgba(237,185,53,.9)');
    }
    ctx.restore();
  };
  window.addEventListener('resize',resize);
  requestAnimationFrame(draw);
})();
