import { useState, useEffect, useRef, useCallback } from "react";

// ── CONSTANTES BASE ────────────────────────────────────────────────────────────
const GAME_W = 800;
const GAME_H = 400;
const GROUND_Y = 310;
const GRAVITY = 0.55;
const JUMP_FORCE = -13.5;
const BASE_SPEED = 4;
const PIXEL_SCALE = 3;
const T = "transparent";

// ── PIXEL ART ─────────────────────────────────────────────────────────────────
const MARTINS_PIXEL = [
  [T,T,T,T,"#3a1a5e","#3a1a5e","#3a1a5e","#3a1a5e","#3a1a5e",T],
  [T,T,T,"#3a1a5e","#1a0a2e","#1a0a2e","#1a0a2e","#1a0a2e","#1a0a2e","#3a1a5e"],
  [T,T,"#3a1a5e","#f5c5a3","#f5c5a3","#f5c5a3","#f5c5a3","#f5c5a3","#f5c5a3","#3a1a5e"],
  [T,T,"#3a1a5e","#f5c5a3","#000","#f5c5a3","#f5c5a3","#f5c5a3","#f5c5a3","#3a1a5e"],
  [T,T,"#3a1a5e","#f5c5a3","#C77DFF","#C77DFF","#f5c5a3","#C77DFF","#C77DFF","#3a1a5e"],
  [T,T,T,"#3a1a5e","#f5c5a3","#f5c5a3","#ff9999","#f5c5a3","#f5c5a3","#3a1a5e"],
  [T,T,T,T,"#f5c5a3","#f5c5a3","#f5c5a3","#f5c5a3","#f5c5a3",T],
  [T,T,"#2d1b4e","#2d1b4e","#2d1b4e","#2d1b4e","#2d1b4e","#2d1b4e","#2d1b4e","#2d1b4e"],
  [T,"#1a0832","#1a0832","#C77DFF","#C77DFF","#C77DFF","#C77DFF","#C77DFF","#1a0832","#1a0832"],
  [T,"#1a0832","#f5c5a3","#C77DFF","#C77DFF","#C77DFF","#C77DFF","#C77DFF","#f5c5a3","#1a0832"],
  [T,"#1a0832","#f5c5a3","#1a0832","#1a0832","#1a0832","#1a0832","#1a0832","#f5c5a3","#1a0832"],
  [T,T,"#1a0832","#1a0832","#1a0832","#1a0832","#1a0832","#1a0832","#1a0832",T],
  [T,T,T,"#1a0832","#1a0832",T,T,"#1a0832","#1a0832",T],
  [T,T,T,"#f5c5a3","#1a0832",T,T,"#1a0832","#f5c5a3",T],
  [T,T,T,"#f5c5a3","#1a0832",T,T,"#1a0832","#f5c5a3",T],
  [T,T,"#333","#333",T,T,T,T,"#333","#333"],
];

const LEONZI_PIXEL = [
  [T,T,T,"#111","#111","#111","#111","#111","#111",T],
  [T,T,"#111","#00FF9C","#00FF9C","#00FF9C","#00FF9C","#00FF9C","#00FF9C","#111"],
  [T,T,"#111","#f5c5a3","#f5c5a3","#f5c5a3","#f5c5a3","#f5c5a3","#f5c5a3","#111"],
  [T,T,"#111","#f5c5a3","#333","#f5c5a3","#f5c5a3","#f5c5a3","#f5c5a3","#111"],
  [T,T,"#111","#f5c5a3","#f5c5a3","#f5c5a3","#f5c5a3","#f5c5a3","#f5c5a3","#111"],
  [T,T,T,"#111","#f5c5a3","#f5c5a3","#f5c5a3","#f5c5a3","#f5c5a3","#111"],
  [T,T,T,T,"#f5c5a3","#f5c5a3","#f5c5a3","#f5c5a3","#f5c5a3",T],
  [T,T,"#1a1a1a","#1a1a1a","#1a1a1a","#1a1a1a","#1a1a1a","#1a1a1a","#1a1a1a","#1a1a1a"],
  [T,"#111","#111","#00FF9C","#111","#111","#111","#111","#111","#111"],
  [T,"#111","#f5c5a3","#111","#111","#111","#111","#111","#f5c5a3","#111"],
  [T,"#111","#f5c5a3","#111","#111","#111","#111","#111","#f5c5a3","#111"],
  [T,T,"#111","#111","#111","#111","#111","#111","#111",T],
  [T,T,T,"#111","#111",T,T,"#111","#111",T],
  [T,T,T,"#f5c5a3","#111",T,T,"#111","#f5c5a3",T],
  [T,T,T,"#f5c5a3","#111",T,T,"#111","#f5c5a3",T],
  [T,T,"#222","#222",T,T,T,T,"#222","#222"],
];

const JONATHAN_PIXEL = [
  [T,T,T,T,"#8B4513","#8B4513","#8B4513","#8B4513","#8B4513",T],
  [T,T,T,"#8B4513","#f5c5a3","#f5c5a3","#f5c5a3","#f5c5a3","#f5c5a3","#8B4513"],
  [T,T,"#FFD700","#f5c5a3","#f5c5a3","#f5c5a3","#f5c5a3","#f5c5a3","#f5c5a3","#FFD700"],
  [T,T,"#FFD700","#f5c5a3","#333","#f5c5a3","#f5c5a3","#333","#f5c5a3","#FFD700"],
  [T,T,"#FFD700","#f5c5a3","#f5c5a3","#f5c5a3","#f5c5a3","#f5c5a3","#f5c5a3","#FFD700"],
  [T,T,T,"#8B4513","#f5c5a3","#f5c5a3","#ff9999","#f5c5a3","#f5c5a3","#8B4513"],
  [T,T,T,T,"#f5c5a3","#f5c5a3","#f5c5a3","#f5c5a3","#f5c5a3",T],
  [T,T,"#eee","#eee","#eee","#eee","#eee","#eee","#eee","#eee"],
  [T,"#eee","#eee","#FF6B35","#FF6B35","#FF6B35","#FF6B35","#FF6B35","#eee","#eee"],
  [T,"#eee","#f5c5a3","#eee","#eee","#eee","#eee","#eee","#f5c5a3","#eee"],
  [T,"#eee","#f5c5a3","#eee","#eee","#eee","#eee","#eee","#f5c5a3","#eee"],
  [T,T,"#3a6bc7","#3a6bc7","#3a6bc7","#3a6bc7","#3a6bc7","#3a6bc7","#3a6bc7",T],
  [T,T,T,"#3a6bc7","#3a6bc7",T,T,"#3a6bc7","#3a6bc7",T],
  [T,T,T,"#f5c5a3","#3a6bc7",T,T,"#3a6bc7","#f5c5a3",T],
  [T,T,T,"#f5c5a3","#3a6bc7",T,T,"#3a6bc7","#f5c5a3",T],
  [T,T,"#555","#555",T,T,T,T,"#555","#555"],
];

const AVATARS = [
  { id:"martins", nombre:"La Martins", rol:"Caos Organizacional", color:"#C77DFF", pixel:MARTINS_PIXEL, bonus:"✍️ Copy vale 2x", stat:{footage:1,copy:2,approval:1,budget:1,brief:1}, emoji:"💜" },
  { id:"leonzi",  nombre:"Leonzi",     rol:"Easy Going",          color:"#00FF9C", pixel:LEONZI_PIXEL,  bonus:"💰 Budget vale 2x", stat:{footage:1,copy:1,approval:1,budget:2,brief:1}, emoji:"💚" },
  { id:"jonathan",nombre:"Jonathan",   rol:"El Profe",            color:"#FFD700", pixel:JONATHAN_PIXEL,bonus:"🎬 Footage vale 2x", stat:{footage:2,copy:1,approval:1,budget:1,brief:1}, emoji:"💛" },
];

// ── COLECCIONABLES ─────────────────────────────────────────────────────────────
const COLLECTIBLES = [
  { type:"footage",  emoji:"🎬", label:"Footage",    points:10, color:"#FFD700", trap:false },
  { type:"copy",     emoji:"✍️", label:"Copy",       points:15, color:"#C77DFF", trap:false },
  { type:"approval", emoji:"✅", label:"Aprobación", points:25, color:"#00BFFF", trap:false },
  { type:"budget",   emoji:"💰", label:"Budget",     points:30, color:"#FF6B35", trap:false },
  { type:"brief",    emoji:"📋", label:"Brief",      points:20, color:"#00FF9C", trap:false },
  { type:"trap",     emoji:"📋", label:"¿Rapidito, verdad?", points:-50, color:"#FF4444", trap:true },
];

// ── OBSTÁCULOS VENEZOLANOS ─────────────────────────────────────────────────────
const OBSTACLES = [
  { type:"revision",  emoji:"🤦", label:"Espera que le consulto a mi esposa",   color:"#FF4444", deadlineDmg:20, pointsDmg:50,  comboReset:true,  floats:false },
  { type:"scope",     emoji:"😩", label:"Y también métele esto que no es nada", color:"#FF8C00", deadlineDmg:25, pointsDmg:80,  comboReset:true,  floats:false },
  { type:"algorithm", emoji:"🕯️", label:"Se fue la luz",                         color:"#FF4444", deadlineDmg:18, pointsDmg:40,  comboReset:false, floats:false },
  { type:"burnout",   emoji:"🤯", label:"Estoy es arrecho",                      color:"#FF6B35", deadlineDmg:22, pointsDmg:60,  comboReset:true,  floats:false },
  { type:"ghost",     emoji:"👻", label:"Ahorita te escribo",                    color:"#9B59B6", deadlineDmg:15, pointsDmg:35,  comboReset:false, floats:true  },
  { type:"cheapo",    emoji:"🗑️", label:"Eso lo haces rapidito ¿verdad?",        color:"#E74C3C", deadlineDmg:30, pointsDmg:90,  comboReset:true,  floats:false },
];

const LANE_Y = [GROUND_Y - 60, GROUND_Y, GROUND_Y - 130];

// ── HELPERS ────────────────────────────────────────────────────────────────────
function drawPixelArt(ctx, grid, x, y, scale) {
  const cols = grid[0].length;
  grid.forEach((row, ri) => {
    row.forEach((color, ci) => {
      if (!color || color === T || color === "transparent") return;
      ctx.fillStyle = color;
      ctx.fillRect(x + ci * scale, y + ri * scale, scale, scale);
    });
  });
}

function useGameLoop(callback, running) {
  const rafRef = useRef();
  const lastRef = useRef();
  useEffect(() => {
    if (!running) { cancelAnimationFrame(rafRef.current); return; }
    const loop = (ts) => {
      const dt = lastRef.current ? Math.min((ts - lastRef.current) / 16.67, 3) : 1;
      lastRef.current = ts;
      callback(dt);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(rafRef.current); lastRef.current = null; };
  }, [running, callback]);
}

// ── PIXEL PREVIEW ──────────────────────────────────────────────────────────────
function PixelPreview({ grid, color, size = 4, selected }) {
  const ref = useRef();
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);
    const cols = grid[0].length, rows = grid.length;
    const ox = (c.width - cols * size) / 2, oy = (c.height - rows * size) / 2;
    if (selected) { ctx.shadowBlur = 22; ctx.shadowColor = color; }
    drawPixelArt(ctx, grid, ox, oy, size);
    ctx.shadowBlur = 0;
  }, [grid, color, size, selected]);
  return <canvas ref={ref} width={grid[0].length * size + 24} height={grid.length * size + 24} style={{ imageRendering:"pixelated" }} />;
}

// ── MAIN ───────────────────────────────────────────────────────────────────────
export default function ProductorEjecutivo() {
  const [phase, setPhase] = useState("start");
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => parseInt(localStorage.getItem("pe_best") || "0"));
  const [deadline, setDeadline] = useState(100);
  const [combo, setCombo] = useState(0);
  const [collected, setCollected] = useState([]);
  const [scale, setScale] = useState(1);
  const [isPortraitMobile, setIsPortraitMobile] = useState(false);

  const canvasRef = useRef();
  const stateRef = useRef({});
  const containerRef = useRef();

  // ── RESPONSIVE SCALE ──────────────────────────────────────────────────────
  useEffect(() => {
    const calc = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      // On mobile keep some padding, on desktop cap at 1
      const sx = (vw - 8) / GAME_W;
      const sy = (vh - 120) / GAME_H; // leave room for HUD
      setScale(Math.min(sx, sy, 1));
      const isTouch = window.matchMedia("(pointer: coarse)").matches;
      setIsPortraitMobile(isTouch && vh > vw);
    };
    // orientationchange fires before the browser updates dimensions, so delay
    const onOrient = () => { setTimeout(calc, 50); setTimeout(calc, 250); };
    calc();
    window.addEventListener("resize", calc);
    window.addEventListener("orientationchange", onOrient);
    return () => {
      window.removeEventListener("resize", calc);
      window.removeEventListener("orientationchange", onOrient);
    };
  }, []);

  // ── INIT STATE ────────────────────────────────────────────────────────────
  const initState = useCallback((avatar) => {
    stateRef.current = {
      player: { x:110, y:GROUND_Y, vy:0, grounded:true, frame:0, frameTimer:0 },
      objects:[], bg:[{x:0},{x:GAME_W}], bgMid:[{x:0},{x:GAME_W}],
      speed:BASE_SPEED, spawnTimer:50, deadlineTimer:0,
      distanceTick:0, combo:0, score:0, deadline:100,
      popups:[], collected:[], popupId:0, avatar, flashTimer:0,
    };
  }, []);

  // ── INPUT ─────────────────────────────────────────────────────────────────
  const jump = useCallback(() => {
    if (phase !== "playing") return;
    const p = stateRef.current.player;
    if (p && p.grounded) { p.vy = JUMP_FORCE; p.grounded = false; }
  }, [phase]);

  useEffect(() => {
    const onKey = (e) => { if (e.code === "Space" || e.code === "ArrowUp") { e.preventDefault(); jump(); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [jump]);

  // ── START ─────────────────────────────────────────────────────────────────
  const startGame = useCallback(() => {
    if (!selectedAvatar) return;
    initState(selectedAvatar);
    setScore(0); setDeadline(100); setCombo(0); setCollected([]);
    setPhase("playing");
  }, [selectedAvatar, initState]);

  // ── GAME LOOP ─────────────────────────────────────────────────────────────
  const gameLoop = useCallback((dt) => {
    const s = stateRef.current;
    if (!s.player) return;
    const p = s.player;
    const av = s.avatar;

    // Physics
    p.vy += GRAVITY * dt;
    p.y += p.vy * dt;
    if (p.y >= GROUND_Y) { p.y = GROUND_Y; p.vy = 0; p.grounded = true; }
    p.frameTimer += dt;
    if (p.frameTimer > 7) { p.frame = (p.frame + 1) % 4; p.frameTimer = 0; }
    s.speed = BASE_SPEED + s.score / 400;
    if (s.flashTimer > 0) s.flashTimer -= dt;

    // Parallax
    s.bg.forEach(b => { b.x -= s.speed * 0.25 * dt; if (b.x <= -GAME_W) b.x += GAME_W * 2; });
    s.bgMid.forEach(b => { b.x -= s.speed * 0.55 * dt; if (b.x <= -GAME_W) b.x += GAME_W * 2; });

    // Spawn
    s.spawnTimer -= dt;
    if (s.spawnTimer <= 0) {
      const roll = Math.random();
      if (roll < 0.32) {
        const obs = OBSTACLES[Math.floor(Math.random() * OBSTACLES.length)];
        const fy = obs.floats ? GROUND_Y - 80 - Math.random() * 60 : GROUND_Y + 6;
        s.objects.push({ ...obs, x:GAME_W+40, y:fy, kind:"obstacle", id:s.popupId++ });
      } else if (roll < 0.40) {
        const trap = COLLECTIBLES.find(c => c.type === "trap");
        s.objects.push({ ...trap, x:GAME_W+40, y:LANE_Y[Math.floor(Math.random()*LANE_Y.length)], kind:"collectible", id:s.popupId++ });
      } else {
        const normals = COLLECTIBLES.filter(c => !c.trap);
        const col = normals[Math.floor(Math.random() * normals.length)];
        s.objects.push({ ...col, x:GAME_W+40, y:LANE_Y[Math.floor(Math.random()*LANE_Y.length)], kind:"collectible", id:s.popupId++ });
      }
      if (Math.random() < 0.08) {
        const ghost = OBSTACLES.find(o => o.type === "ghost");
        s.objects.push({ ...ghost, x:GAME_W+40, y:GROUND_Y-100-Math.random()*60, kind:"obstacle", id:s.popupId++ });
      }
      s.spawnTimer = 50 + Math.random() * 40;
    }

    s.objects.forEach(o => { o.x -= s.speed * dt; });
    s.objects = s.objects.filter(o => o.x > -90);

    // Collisions
    const endGame = () => {
      const ns = Math.round(s.score);
      const newBest = Math.max(parseInt(localStorage.getItem("pe_best")||"0"), ns);
      localStorage.setItem("pe_best", newBest);
      setScore(ns); setBest(newBest); setPhase("dead");
    };

    s.objects = s.objects.filter(o => {
      const hit = Math.abs(p.x - o.x) < 28 && Math.abs(p.y - o.y) < 34;
      if (!hit) return true;
      if (o.kind === "collectible") {
        if (o.trap) {
          s.score = Math.max(0, s.score + o.points);
          s.deadline = Math.max(0, s.deadline - 10);
          s.combo = 0; s.flashTimer = 12;
          s.popups.push({ id:o.id, x:o.x, y:o.y-24, text:`💀 ${o.label}`, color:"#FF4444", life:80 });
          if (s.deadline <= 0) endGame();
        } else {
          s.combo++;
          const mult = av.stat[o.type] || 1;
          const pts = Math.round(o.points * mult * Math.max(1, Math.floor(s.combo/3)));
          s.score += pts;
          s.deadline = Math.min(100, s.deadline + 2.5);
          s.popups.push({ id:o.id, x:o.x, y:o.y-20, text:`+${pts}`, color:o.color, life:55 });
          s.collected = [o.type, ...s.collected].slice(0, 10);
        }
        return false;
      }
      if (o.kind === "obstacle") {
        if (o.comboReset) s.combo = 0;
        s.score = Math.max(0, s.score - (o.pointsDmg||0));
        s.deadline = Math.max(0, s.deadline - (o.deadlineDmg||20));
        s.flashTimer = 18;
        const short = o.label.length > 24 ? o.label.slice(0,22)+"…" : o.label;
        s.popups.push({ id:o.id, x:o.x, y:o.y-28, text:`💥 ${short}`, color:o.color, life:90 });
        if (s.deadline <= 0) endGame();
        return false;
      }
      return true;
    });

    // Drain
    s.deadlineTimer += dt;
    if (s.deadlineTimer > 88) {
      s.deadline -= 0.5; s.deadlineTimer = 0;
      if (s.deadline <= 0) {
        const ns = Math.round(s.score);
        const nb = Math.max(parseInt(localStorage.getItem("pe_best")||"0"), ns);
        localStorage.setItem("pe_best", nb);
        setScore(ns); setBest(nb); setPhase("dead");
      }
    }

    s.popups.forEach(pop => { pop.y -= 0.65*dt; pop.life -= dt; });
    s.popups = s.popups.filter(x => x.life > 0);

    s.distanceTick += dt;
    if (s.distanceTick > 10) {
      setScore(Math.round(s.score));
      setDeadline(Math.max(0, s.deadline));
      setCombo(s.combo);
      setCollected([...s.collected]);
      s.distanceTick = 0;
    }

    // ── DRAW ──────────────────────────────────────────────────────────────
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, GAME_W, GAME_H);

    // Sky
    const sky = ctx.createLinearGradient(0,0,0,GAME_H);
    sky.addColorStop(0,"#04040f"); sky.addColorStop(1,"#120520");
    ctx.fillStyle = sky; ctx.fillRect(0,0,GAME_W,GAME_H);

    if (s.flashTimer > 0) {
      ctx.fillStyle = `rgba(255,50,50,${(s.flashTimer/18)*0.18})`;
      ctx.fillRect(0,0,GAME_W,GAME_H);
    }

    // Stars
    ctx.fillStyle="rgba(255,255,255,0.45)";
    for(let i=0;i<60;i++){
      const sx=((i*137+s.bg[0].x*0.05)%GAME_W+GAME_W)%GAME_W;
      const sy=(i*73)%(GROUND_Y-60);
      ctx.fillRect(sx,sy,1,1);
    }

    const ac = av ? av.color : "#00FF9C";

    // Far buildings
    s.bg.forEach(b=>{
      [[b.x+30,170,55,140],[b.x+120,130,75,180],[b.x+230,195,48,115],
       [b.x+310,110,65,200],[b.x+420,155,85,155],[b.x+540,95,52,215],
       [b.x+630,175,60,135],[b.x+730,125,70,185]].forEach(([bx,by,bw,bh])=>{
        ctx.fillStyle="#0d0520"; ctx.fillRect(bx,by,bw,bh);
        for(let wy=by+8;wy<by+bh-8;wy+=12)
          for(let wx=bx+6;wx<bx+bw-6;wx+=10)
            if((Math.floor(wy/12)*13+Math.floor(wx/10))%3!==0){
              ctx.fillStyle=`${ac}33`; ctx.fillRect(wx,wy,5,7);
            }
      });
    });

    // Mid buildings
    s.bgMid.forEach(b=>{
      [[b.x,230,65,80],[b.x+160,200,85,110],[b.x+360,220,55,90],[b.x+510,190,75,120],[b.x+700,210,60,100]].forEach(([bx,by,bw,bh])=>{
        ctx.fillStyle="#0a0318"; ctx.fillRect(bx,by,bw,bh);
        ctx.strokeStyle=ac+"44"; ctx.lineWidth=0.5; ctx.strokeRect(bx,by,bw,bh);
      });
    });

    // Ground
    ctx.fillStyle="#0c0820"; ctx.fillRect(0,GROUND_Y+48,GAME_W,GAME_H-GROUND_Y-48);
    ctx.fillStyle=ac; ctx.shadowBlur=10; ctx.shadowColor=ac;
    ctx.fillRect(0,GROUND_Y+48,GAME_W,2); ctx.shadowBlur=0;
    ctx.fillStyle="rgba(255,255,255,0.06)";
    const dashOff=(s.speed*2*performance.now()/1000)%80;
    for(let rx=-dashOff;rx<GAME_W;rx+=80) ctx.fillRect(rx,GROUND_Y+70,40,2);
    ctx.strokeStyle=`${ac}12`; ctx.lineWidth=1;
    for(let gx=0;gx<GAME_W;gx+=40){ctx.beginPath();ctx.moveTo(gx,GROUND_Y+48);ctx.lineTo(gx+30,GAME_H);ctx.stroke();}

    // Objects
    ctx.textAlign="center";
    s.objects.forEach(o=>{
      if(o.kind==="collectible"){
        const isTrap=o.trap;
        if(isTrap){ ctx.globalAlpha=0.7+Math.sin(performance.now()/120)*0.3; ctx.shadowBlur=8; ctx.shadowColor="#FF4444"; }
        else { ctx.shadowBlur=10; ctx.shadowColor=o.color; }
        ctx.font="28px serif"; ctx.fillText(o.emoji,o.x,o.y+6);
        ctx.shadowBlur=0; ctx.globalAlpha=1;
        ctx.font="bold 9px monospace"; ctx.fillStyle=isTrap?"#FF4444":o.color;
        ctx.fillText(isTrap?"📋 Brief...":o.label,o.x,o.y+22);
      } else {
        ctx.shadowBlur=14; ctx.shadowColor=o.color;
        ctx.font="24px serif"; ctx.fillText(o.emoji,o.x,o.y+6);
        ctx.shadowBlur=0;
        const sl=o.label.length>20?o.label.slice(0,18)+"…":o.label;
        ctx.font="bold 8px monospace"; ctx.fillStyle=o.color;
        ctx.fillText(sl,o.x,o.y+22);
      }
    });

    // Player
    if(av){
      const pixW=av.pixel[0].length*PIXEL_SCALE;
      const pixH=av.pixel.length*PIXEL_SCALE;
      const bobY=p.grounded?Math.sin(p.frame*Math.PI/2)*1.5:0;
      const drawX=p.x-pixW/2, drawY=p.y-pixH+12+bobY;
      ctx.fillStyle=`${av.color}20`;
      ctx.beginPath(); ctx.ellipse(p.x,GROUND_Y+52,18,5,0,0,Math.PI*2); ctx.fill();
      ctx.shadowBlur=18; ctx.shadowColor=av.color;
      drawPixelArt(ctx,av.pixel,Math.round(drawX),Math.round(drawY),PIXEL_SCALE);
      ctx.shadowBlur=0;
    }

    // Popups
    s.popups.forEach(pop=>{
      ctx.globalAlpha=Math.min(1,pop.life/18);
      ctx.font="bold 11px monospace"; ctx.fillStyle=pop.color;
      ctx.textAlign="center"; ctx.shadowBlur=6; ctx.shadowColor=pop.color;
      ctx.fillText(pop.text,Math.min(Math.max(pop.x,80),GAME_W-80),pop.y);
      ctx.shadowBlur=0; ctx.globalAlpha=1;
    });
    ctx.textAlign="left";
  }, []);

  useGameLoop(gameLoop, phase === "playing");

  const dlColor = deadline > 60 ? "#00FF9C" : deadline > 30 ? "#FFD700" : "#FF4444";
  const av = selectedAvatar;

  // ── MOBILE TAP AREA STYLES ────────────────────────────────────────────────
  const canvasStyle = {
    display:"block",
    imageRendering:"pixelated",
    cursor:"pointer",
    transformOrigin:"top left",
    transform:`scale(${scale})`,
    width: GAME_W,
    height: GAME_H,
  };

  const canvasWrap = {
    width: GAME_W * scale,
    height: GAME_H * scale,
    position:"relative",
    border:`1px solid ${av ? av.color+"44" : "#00FF9C33"}`,
    boxShadow: av ? `0 0 30px ${av.color}18` : "none",
    flexShrink:0,
  };

  const S = {
    root: {
      minHeight:"100dvh", background:"#04040f",
      display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center",
      fontFamily:"'Courier New', monospace",
      userSelect:"none", WebkitUserSelect:"none",
      padding:"8px", overflow:"hidden",
    },
    title: { fontSize:"clamp(24px,6vw,44px)", fontWeight:900, letterSpacing:"clamp(4px,2vw,8px)", color:"#00FF9C", textShadow:"0 0 30px #00FF9C,0 0 60px #00FF9C44", lineHeight:1, marginBottom:4 },
    sub: { fontSize:"clamp(9px,2.5vw,12px)", color:"#ffffff", letterSpacing:3, marginBottom:6 },
    btn: (color="#00FF9C") => ({
      background:color, color:color==="#00FF9C"?"#000":color==="#fff"?"#000":"#000",
      border:"none", padding:"clamp(10px,3vw,16px) clamp(20px,6vw,56px)",
      fontSize:"clamp(11px,3vw,14px)", fontWeight:900, letterSpacing:"clamp(2px,1vw,4px)",
      cursor:"pointer", fontFamily:"monospace", boxShadow:`0 0 24px ${color}55`,
    }),
    btnGhost: {
      background:"transparent", color:"#444", border:"1px solid #222",
      padding:"clamp(8px,2vw,12px) clamp(16px,4vw,28px)",
      fontSize:"clamp(9px,2.5vw,11px)", letterSpacing:3, cursor:"pointer", fontFamily:"monospace",
    },
  };

  return (
    <div style={S.root}>

      {/* ── INICIO ──────────────────────────────────────────────── */}
      {phase === "start" && (
        <div style={{ textAlign:"center", maxWidth:560, width:"100%", padding:"0 12px" }}>
          <div style={{ fontSize:"clamp(8px,2vw,11px)", letterSpacing:6, color:"#ffffff", marginBottom:8 }}>WAGMI MEDIA AGENCY PRESENTA</div>
          <div style={S.title}>PRODUCTOR<br/>EJECUTIVO</div>
          <div style={S.sub}>RECOGE RECURSOS · ESQUIVA EL CAOS · ENTREGA LA CAMPAÑA</div>
          <div style={{ fontSize:"clamp(9px,2.5vw,11px)", color:"#ffffff", marginBottom:32, letterSpacing:1 }}>
            ⚠️ Cuidado con los Brief falsos — son trampa
          </div>
          <button onClick={() => setPhase("select")} style={S.btn()}>INICIAR</button>
          {best > 0 && <div style={{ color:"#FFD700", fontSize:"clamp(9px,2.5vw,11px)", marginTop:18, letterSpacing:2 }}>RÉCORD: {best.toLocaleString()}</div>}
        </div>
      )}

      {/* ── SELECCIÓN ───────────────────────────────────────────── */}
      {phase === "select" && (
        <div style={{ textAlign:"center", width:"100%", maxWidth:680, padding:"0 8px" }}>
          <div style={{ fontSize:"clamp(8px,2vw,11px)", letterSpacing:6, color:"#444", marginBottom:4 }}>ELIGE TU JUGADOR</div>
          <div style={{ fontSize:"clamp(16px,5vw,24px)", fontWeight:900, letterSpacing:5, color:"#fff", marginBottom:20 }}>¿QUIÉN ERES HOY?</div>

          <div style={{ display:"flex", gap:"clamp(8px,2vw,20px)", justifyContent:"center", flexWrap:"wrap", marginBottom:20 }}>
            {AVATARS.map(a => {
              const isSel = av?.id === a.id;
              return (
                <div key={a.id} onClick={() => setSelectedAvatar(a)} style={{
                  cursor:"pointer",
                  border: isSel ? `2px solid ${a.color}` : "2px solid #1a1a2e",
                  borderRadius:8, padding:"clamp(12px,3vw,20px) clamp(14px,3vw,24px)",
                  background: isSel ? `${a.color}11` : "#0a0818",
                  boxShadow: isSel ? `0 0 24px ${a.color}44` : "none",
                  transition:"all 0.2s", minWidth:"clamp(130px,35vw,165px)",
                  position:"relative", flex:"1 1 130px", maxWidth:200,
                }}>
                  {isSel && (
                    <div style={{ position:"absolute", top:-12, left:"50%", transform:"translateX(-50%)", background:a.color, color:"#000", fontSize:9, fontWeight:900, letterSpacing:2, padding:"2px 10px", borderRadius:2 }}>SELECCIONADO</div>
                  )}
                  <div style={{ display:"flex", justifyContent:"center", marginBottom:10, minHeight:56 }}>
                    <PixelPreview grid={a.pixel} color={a.color} size={3} selected={isSel} />
                  </div>
                  <div style={{ color:a.color, fontWeight:900, fontSize:"clamp(11px,3vw,14px)", letterSpacing:2, marginBottom:2 }}>{a.nombre}</div>
                  <div style={{ color:"#555", fontSize:"clamp(8px,2vw,10px)", letterSpacing:1, marginBottom:10 }}>{a.rol}</div>
                  <div style={{ background:`${a.color}22`, border:`1px solid ${a.color}44`, borderRadius:4, padding:"5px 8px", fontSize:"clamp(8px,2vw,10px)", color:a.color, letterSpacing:1 }}>
                    ⚡ {a.bonus}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Leyenda obstáculos */}
          <div style={{ marginBottom:20, padding:"12px 16px", background:"#080614", border:"1px solid #1a1a2e", borderRadius:6, maxWidth:520, margin:"0 auto 20px" }}>
            <div style={{ color:"#ffffff", fontSize:"clamp(7px,2vw,9px)", letterSpacing:3, marginBottom:8 }}>OBSTÁCULOS — DRENAN DEADLINE Y RESTAN PUNTOS</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"5px 12px", textAlign:"left" }}>
              {OBSTACLES.map(o=>(
                <div key={o.type} style={{ fontSize:"clamp(7px,2vw,9px)", color:"#ffffff" }}>
                  <span style={{ marginRight:4 }}>{o.emoji}</span>
                  <span style={{ color:o.color }}>{o.label.length>22?o.label.slice(0,20)+"…":o.label}</span>
                  <span style={{ color:"#aaaaaa", marginLeft:4 }}>-{o.pointsDmg}pts</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
            <button onClick={() => setPhase("start")} style={S.btnGhost}>← VOLVER</button>
            <button onClick={startGame} disabled={!av} style={{
              ...S.btn(av?.color||"#333"),
              color:"#000", opacity: av ? 1 : 0.4, cursor: av ? "pointer" : "not-allowed",
            }}>
              {av ? `▶ ${av.nombre.toUpperCase()}` : "ELIGE UN PERSONAJE"}
            </button>
          </div>
        </div>
      )}

      {/* ── JUEGO ───────────────────────────────────────────────── */}
      {(phase === "playing" || phase === "dead") && (
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", width:"100%" }}>

          {/* HUD */}
          {phase === "playing" && (
            <div style={{ width: GAME_W * scale, display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6, padding:"0 4px" }}>
              <div style={{ color:av?.color, fontSize:"clamp(9px,2.5vw,11px)", fontWeight:900, letterSpacing:2, textShadow:`0 0 8px ${av?.color}` }}>
                {av?.emoji} {av?.nombre.toUpperCase()}
              </div>
              <div style={{ flex:1, margin:"0 clamp(8px,2vw,20px)" }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                  <span style={{ color:"#333", fontSize:"clamp(7px,2vw,9px)", letterSpacing:2 }}>DEADLINE</span>
                  <span style={{ color:dlColor, fontSize:"clamp(7px,2vw,9px)", fontWeight:700 }}>{Math.round(deadline)}%</span>
                </div>
                <div style={{ background:"#0d0820", borderRadius:3, height:6, border:`1px solid ${dlColor}33` }}>
                  <div style={{ width:`${Math.max(0,deadline)}%`, height:"100%", background:dlColor, borderRadius:3, transition:"width 0.15s", boxShadow:`0 0 6px ${dlColor}` }} />
                </div>
              </div>
              <div style={{ textAlign:"right", minWidth:60 }}>
                <div style={{ color:"#333", fontSize:"clamp(7px,2vw,9px)", letterSpacing:2 }}>PUNTOS</div>
                <div style={{ color:"#fff", fontSize:"clamp(14px,4vw,20px)", fontWeight:700 }}>{score.toLocaleString()}</div>
              </div>
              {combo >= 3 && (
                <div style={{ marginLeft:8, background:"#FFD70018", border:"1px solid #FFD700", borderRadius:4, padding:"2px 6px", fontSize:"clamp(9px,2.5vw,11px)", color:"#FFD700", fontWeight:900 }}>
                  x{combo}
                </div>
              )}
            </div>
          )}

          {/* Canvas wrapper */}
          <div style={canvasWrap}>
            <canvas ref={canvasRef} width={GAME_W} height={GAME_H}
              style={canvasStyle}
              onClick={jump}
              onTouchStart={(e) => { e.preventDefault(); jump(); }}
            />
          </div>

          {/* Game over overlay — fixed so it covers the full screen on any orientation */}
          {phase === "dead" && (
            <div style={{
              position:"fixed", inset:0,
              display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
              background:"rgba(4,4,15,0.96)", backdropFilter:"blur(3px)",
              zIndex:100, overflowY:"auto", padding:"16px",
            }}>
              <div style={{ fontSize:"clamp(28px,8vw,40px)", marginBottom:6 }}>💀</div>
              <div style={{ color:"#FF4444", fontSize:"clamp(14px,4vw,18px)", fontWeight:900, letterSpacing:5, marginBottom:4, textShadow:"0 0 16px #FF4444" }}>
                CAMPAÑA FALLIDA
              </div>
              <div style={{ color:"#aaa", fontSize:"clamp(8px,2vw,10px)", letterSpacing:2, marginBottom:20, textAlign:"center", padding:"0 16px" }}>
                DEADLINE INCUMPLIDO — EL CLIENTE NO ESTÁ CONTENTO
              </div>
              <div style={{ display:"flex", gap:"clamp(20px,6vw,40px)", marginBottom:20 }}>
                <div style={{ textAlign:"center" }}>
                  <div style={{ color:"#aaa", fontSize:"clamp(7px,2vw,9px)", letterSpacing:2 }}>PUNTUACIÓN</div>
                  <div style={{ color:"#fff", fontSize:"clamp(20px,6vw,28px)", fontWeight:900 }}>{score.toLocaleString()}</div>
                </div>
                <div style={{ textAlign:"center" }}>
                  <div style={{ color:"#aaa", fontSize:"clamp(7px,2vw,9px)", letterSpacing:2 }}>RÉCORD</div>
                  <div style={{ color:"#FFD700", fontSize:"clamp(20px,6vw,28px)", fontWeight:900 }}>{best.toLocaleString()}</div>
                </div>
              </div>
              {collected.length > 0 && (
                <div style={{ marginBottom:16, textAlign:"center" }}>
                  <div style={{ color:"#aaa", fontSize:"clamp(7px,2vw,9px)", letterSpacing:2, marginBottom:6 }}>ASSETS RECOLECTADOS</div>
                  <div style={{ display:"flex", gap:6, flexWrap:"wrap", justifyContent:"center", maxWidth:280, padding:"0 16px" }}>
                    {collected.map((c,i)=>{
                      const item=COLLECTIBLES.find(x=>x.type===c&&!x.trap);
                      return item?<span key={i} style={{fontSize:"clamp(14px,4vw,18px)"}}>{item.emoji}</span>:null;
                    })}
                  </div>
                </div>
              )}
              <div style={{ display:"flex", gap:10, flexWrap:"wrap", justifyContent:"center", padding:"0 16px" }}>
                <button onClick={() => setPhase("select")} style={S.btnGhost}>CAMBIAR PERSONAJE</button>
                <button onClick={startGame} style={S.btn(av?.color||"#00FF9C")}>REINTENTAR</button>
              </div>
            </div>
          )}

          {phase === "playing" && (
            <div style={{ marginTop:8, display:"flex", flexDirection:"column", alignItems:"center", gap:10, width:"100%" }}>
              {/* SALTAR button — shown on touch devices */}
              <button
                onTouchStart={(e) => { e.preventDefault(); jump(); }}
                onClick={jump}
                style={{
                  display: "none",
                  background: av?.color || "#00FF9C",
                  color: "#000",
                  border: "none",
                  borderRadius: 8,
                  padding: "18px 56px",
                  fontSize: 18,
                  fontWeight: 900,
                  letterSpacing: 4,
                  fontFamily: "monospace",
                  cursor: "pointer",
                  boxShadow: `0 0 24px ${av?.color || "#00FF9C"}66`,
                  WebkitTapHighlightColor: "transparent",
                  touchAction: "manipulation",
                }}
                className="saltar-btn"
              >
                ▲ SALTAR
              </button>
              <div style={{ color:"#333", fontSize:"clamp(7px,2vw,9px)", letterSpacing:3, textAlign:"center" }}>
                ESPACIO / TAP PARA SALTAR · ⚠️ BRIEF PARPADEANTE = TRAMPA
              </div>
            </div>
          )}
        </div>
      )}

      {/* Portrait orientation hint */}
      {isPortraitMobile && (phase === "playing" || phase === "dead") && (
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0,
          background: "#0d0820ee",
          borderTop: "1px solid #C77DFF44",
          padding: "10px 16px",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
          zIndex: 999,
          backdropFilter: "blur(4px)",
        }}>
          <span style={{ fontSize: 22, display: "inline-block", animation: "rotateHint 2s ease-in-out infinite" }}>📱</span>
          <span style={{ color: "#C77DFF", fontSize: "clamp(9px,3vw,12px)", letterSpacing: 2, fontFamily: "monospace" }}>
            ROTÁ EL TELÉFONO PARA MEJOR EXPERIENCIA
          </span>
        </div>
      )}

      <style>{`
        @media (pointer: coarse) { .saltar-btn { display: block !important; } }
        @keyframes rotateHint {
          0%   { transform: rotate(0deg); }
          30%  { transform: rotate(90deg); }
          60%  { transform: rotate(90deg); }
          100% { transform: rotate(0deg); }
        }
      `}</style>
    </div>
  );
}
