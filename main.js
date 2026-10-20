import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { Reflector } from 'three/addons/objects/Reflector.js';

/* ───────────────────────── DOM ───────────────────────── */
const canvas = document.querySelector('#scene-canvas');
const wrap = document.querySelector('#scene-wrap');
const statusEl = document.querySelector('#renderer-status');
const panel = document.querySelector('#info-panel');
const panelTitle = document.querySelector('#panel-title');
const panelKicker = document.querySelector('#panel-kicker');
const panelIndex = document.querySelector('#panel-index');
const panelContent = document.querySelector('#panel-content');
const closeButton = document.querySelector('#close-panel');
const motionToggle = document.querySelector('#motion-toggle');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ───────────────────────── Contenido ───────────────────────── */
const sections = [
  { id: 'profile', index: '01', label: 'PROFILE', kicker: 'MODULE 01', 
    title: 'Lorem ipsum dolor sit epum.', 
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse.', 
    bullets: ['Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'Sed do eiusmod tempor incididunt ut labore et dolore magna.', 'Aliqua ut enim ad minim veniam, quis nostrud exercitation.', 'Ullamco laboris nisi ut aliquip ex ea commodo consequat.'], 
    tags: ['TAG A', 'TAG B'],  
    image: 'images/logo_profile.png' },

  { id: 'projects', index: '02', label: 'PROJECTS', kicker: 'MODULE 02', 
    title: 'Sed do eiusmod tempor incididunt.', 
    description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.', 
    bullets: ['Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 'Duis aute irure dolor in reprehenderit in voluptate.', 'Voluptate velit esse cillum dolore eu fugiat nulla pariatur.'], 
    tags: ['TAG A', 'TAG B'], links: [{ label: 'LINK', url: 'https://example.com' }, { label: 'LINK', url: 'https://example.com' }, { label: 'LINK', url: 'https://example.com' }] ,
    image: 'images/projects.png' },

  { id: 'architecture', index: '03', label: 'STACK', kicker: 'MODULE 03', 
    title: 'Magna aliqua enim ad minim.', description: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur.', 
    entries: [{ heading: 'PLACEHOLDER GROUP', items: ['Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 'Incididunt ut labore et dolore magna aliqua.'] }, { heading: 'PLACEHOLDER GROUP', items: ['Duis aute irure dolor in reprehenderit in voluptate.', 'Voluptate velit esse cillum dolore eu fugiat nulla pariatur.', 'Excepteur sint occaecat cupidatat non proident.'] }, 
    { heading: 'PLACEHOLDER GROUP', items: ['Sunt in culpa qui officia deserunt mollit.', 'Anim id est laborum. Lorem ipsum dolor sit amet.', 'Consectetur adipiscing elit, sed do eiusmod tempor.'] }], 
    tags: ['TAG A', 'TAG B'] ,
    image: 'images/stack.png' },

  { id: 'experience', index: '04', label: 'EXPERIENCE', kicker: 'MODULE 04', 
    title: 'Duis aute irure dolor in.', description: 'Voluptate velit esse cillum dolor eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa.', 
    entries: [{ heading: 'JOB TITLE · PLACEHOLDER', items: ['Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 'Incididunt ut labore et dolore magna aliqua.'] }, { heading: 'JOB TITLE · PLACEHOLDER', items: ['Duis aute irure dolor in reprehenderit in voluptate velit esse.', 'Adipiscing elit, sed do eiusmod tempor incididunt ut labore.', 'Ut enim ad minim veniam, quis nostrud exercitation.'] },
    { heading: 'JOB TITLE · PLACEHOLDER', items: ['Ullamco laboris nisi ut aliquip ex ea commodo consequat.', 'Duis aute irure dolor in reprehenderit in voluptate.', 'Voluptate velit esse cillum dolore eu fugiat nulla pariatur.'] }, { heading: 'JOB TITLE · PLACEHOLDER', items: ['Excepteur sint occaecat cupidatat non proident, sunt in.', 'Culpa qui officia deserunt mollit anim id est laborum.'] }, { heading: 'JOB TITLE · PLACEHOLDER', items: ['Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'Sed do eiusmod tempor incididunt ut labore et dolore magna.'] }],
     tags: ['TAG A', 'TAG B'] ,
     image: 'images/stack.png' },


  { id: 'contact', index: '05', label: 'CONTACT', kicker: 'MODULE 05',
     title: 'In reprehenderit voluptate.', description: 'Fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.', 
     bullets: ['info@example.com'], tags: ['OPEN', 'AVAIL'], links: [{ label: 'EMAIL', url: 'mailto:info@example.com' }, 
      { label: 'LINK', url: 'https://example.com' }, { label: 'LINK', url: 'https://example.com' }], image: 'images/contact.png' }
];

/* ───────────────────────── Constantes de escena ───────────────────────── */
const CARD_W = 5.2;
const CARD_H = CARD_W * 9 / 16;
const CARD_D = 0.14;
const FLOOR_Y = -2.45;
const FOCUS_SPREAD = 1.3;
const OPEN_PANEL_DELAY = 1150;
const INTRO_DURATION = 3.6;

const FONT_SANS = '"Space Grotesk", system-ui, sans-serif';
const FONT_MONO = '"JetBrains Mono", ui-monospace, Menlo, monospace';

const carousel = {
  radiusX: 6.3,
  radiusZ: 2.5,
  centerZ: -3.2,
  angleStep: (Math.PI * 2) / sections.length,
  offset: 0,
  targetOffset: 0,
  spread: 1,
  spreadTarget: 1,
  spin: 0.05
};
const FOCUS_Z = carousel.centerZ + carousel.radiusZ * FOCUS_SPREAD + 1.2;

/* ───────────────────────── Estado ───────────────────────── */
let scene, camera, renderer, composer, bloomPass, fxPass, clock, raycaster, pointerNdc;
let moduleObjects = [];
let faceMeshes = [];
let rain, dust, core, shock, grid;
let initialized = false;
let isMoving = !reduceMotion;
let mode = 'home';            // 'home' | 'focus'
let focusId = null;
let hoveredId = null;
let pendingPanel = null;
let lastFocusEl = null;
let idleUntil = 0;
let introT = reduceMotion ? 1 : 0;
let slowmo = 1;
let camReady = false;

const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
const fx = { pulse: 0, focus: 0 };
const camPos = new THREE.Vector3();
const camLook = new THREE.Vector3();
const camTarget = { pos: new THREE.Vector3(), look: new THREE.Vector3(), fov: 46, roll: 0 };
let camFov = 46;
let camRoll = 0;
const drag = { down: false, x: 0, moved: 0 };

/* ───────────────────────── Utilidades ───────────────────────── */
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const damp = (k, dt) => 1 - Math.exp(-dt * k);
const easeOutExpo = x => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x));
const easeOutCubic = x => 1 - Math.pow(1 - x, 3);
const easeOutBack = x => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
const wrapAngle = a => Math.atan2(Math.sin(a), Math.cos(a));
const isNarrow = () => window.innerWidth <= 900;
const pixelRatio = () => Math.min(window.devicePixelRatio || 1, isNarrow() ? 1.5 : 1.75);

async function loadFonts() {
  if (!document.fonts) return;
  try {
    await Promise.race([
      Promise.all([
        document.fonts.load(`700 80px ${FONT_SANS}`),
        document.fonts.load(`400 30px ${FONT_SANS}`),
        document.fonts.load(`700 30px ${FONT_MONO}`),
        document.fonts.load(`400 30px ${FONT_MONO}`)
      ]),
      new Promise(resolve => setTimeout(resolve, 1800))
    ]);
  } catch { /* se usan las fuentes de respaldo */ }
}

/* ───────────────────────── Texturas de las cards ───────────────────────── */
function wrapText(ctx, text, x, y, maxW, lh) {
  const words = text.split(' ');
  let line = '';
  let yy = y;
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxW && line) {
      ctx.fillText(line, x, yy);
      line = word;
      yy += lh;
    } else line = test;
  }
  ctx.fillText(line, x, yy);
  return yy;
}

function drawBrackets(ctx, W, H, inset, len, color) {
  ctx.strokeStyle = color; ctx.lineWidth = 4;
  const p = [[inset, inset, 1, 1], [W - inset, inset, -1, 1], [inset, H - inset, 1, -1], [W - inset, H - inset, -1, -1]];
  p.forEach(([x, y, sx, sy]) => {
    ctx.beginPath(); ctx.moveTo(x, y + len * sy); ctx.lineTo(x, y); ctx.lineTo(x + len * sx, y); ctx.stroke();
  });
}

function makeCardTexture(section, maxAniso) {
  const W = 1280, H = 720;
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const ctx = c.getContext('2d');

  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#03100a'); bg.addColorStop(1, '#0b2e17');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

  const glow = ctx.createRadialGradient(W * 0.8, H * 0.18, 20, W * 0.8, H * 0.18, 560);
  glow.addColorStop(0, 'rgba(67,255,120,.26)'); glow.addColorStop(1, 'rgba(67,255,120,0)');
  ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = 'rgba(120,255,160,.06)'; ctx.lineWidth = 1;
  for (let x = 0; x <= W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for (let y = 0; y <= H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

  ctx.textAlign = 'right'; ctx.textBaseline = 'alphabetic';
  ctx.font = `700 470px ${FONT_MONO}`;
  ctx.fillStyle = 'rgba(90,255,140,.075)';
  ctx.fillText(section.index, W - 30, H - 36);
  ctx.textAlign = 'left';

  drawBrackets(ctx, W, H, 34, 56, '#55ff83');

  ctx.font = `500 26px ${FONT_MONO}`;
  ctx.fillStyle = '#55ff83';
  ctx.fillText(`MODULE / ${section.index}`, 76, 98);
  ctx.textAlign = 'right';
  ctx.fillStyle = '#4f8a62';
  ctx.fillText('NODE ACTIVE', W - 76, 98);
  ctx.textAlign = 'left';

  ctx.strokeStyle = 'rgba(115,255,150,.35)'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(76, 124); ctx.lineTo(W - 76, 124); ctx.stroke();

  let size = 150;
  ctx.font = `700 ${size}px ${FONT_SANS}`;
  while (ctx.measureText(section.label).width > W - 150 && size > 60) { size -= 4; ctx.font = `700 ${size}px ${FONT_SANS}`; }
  ctx.fillStyle = '#eafff0';
  ctx.fillText(section.label, 70, 300);

  ctx.font = `400 40px ${FONT_SANS}`;
  ctx.fillStyle = '#8fc7a0';
  wrapText(ctx, section.title, 76, 376, 820, 52);

  ctx.font = `500 22px ${FONT_MONO}`;
  let x = 76;
  const ty = H - 128;
  (section.tags || []).forEach(tag => {
    const w = ctx.measureText(tag).width + 38;
    ctx.strokeStyle = 'rgba(115,255,150,.5)'; ctx.lineWidth = 2;
    ctx.strokeRect(x, ty, w, 46);
    ctx.fillStyle = '#b8e9c2';
    ctx.fillText(tag, x + 19, ty + 31);
    x += w + 14;
  });

  ctx.textAlign = 'right';
  ctx.font = `500 24px ${FONT_MONO}`;
  ctx.fillStyle = '#55ff83';
  ctx.fillText('OPEN MODULE  ↗', W - 76, H - 94);

  const texture = new THREE.CanvasTexture(c);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = maxAniso;
  return texture;
}

function makeBackTexture(maxAniso) {
  const W = 640, H = 360;
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#030c07'; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = 'rgba(120,255,160,.08)'; ctx.lineWidth = 1;
  for (let x = 0; x <= W; x += 32) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for (let y = 0; y <= H; y += 32) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  ctx.strokeStyle = '#55ff83'; ctx.lineWidth = 3; ctx.strokeRect(W / 2 - 40, H / 2 - 40, 80, 80);
  ctx.fillStyle = '#55ff83'; ctx.font = `700 34px ${FONT_MONO}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('OR', W / 2, H / 2 + 2);
  const texture = new THREE.CanvasTexture(c);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = maxAniso;
  return texture;
}

/* ───────────────────────── Materiales / shaders ───────────────────────── */
const faceVertex = /* glsl */`
  varying vec2 vUv;
  void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;
const faceFragment = /* glsl */`
  uniform sampler2D uMap;
  uniform sampler2D uImage;
  uniform vec4 uImgRect;
  uniform float uTime, uHover, uDim, uFocus, uSeed, uReveal, uImgAspect;
  varying vec2 vUv;
  float hash(float n){ return fract(sin(n) * 43758.5453); }
  void main(){
    vec2 uv = vUv;
    float band = floor(uv.y * 26.0);
    float g = step(0.955, hash(band + floor(uTime * 14.0) + uSeed)) * uHover;
    uv.x += g * (hash(band + uSeed) - 0.5) * 0.08;
    float s = 0.0015 + uHover * 0.004 + uFocus * 0.0015;
    vec3 col;
    col.r = texture2D(uMap, uv + vec2(s, 0.0)).r;
    col.g = texture2D(uMap, uv).g;
    col.b = texture2D(uMap, uv - vec2(s, 0.0)).b;
    col *= 0.93 + 0.07 * sin(uv.y * 720.0 * 3.14159);
    float pos = fract(uTime * 0.16 + uSeed);
    float d = abs((uv.x + uv.y * 0.3) - pos * 1.6 + 0.15);
    float sweep = smoothstep(0.07, 0.0, d);
    col += vec3(0.12, 0.55, 0.22) * sweep * (0.3 + uHover * 0.9 + uFocus * 0.2);
    col *= (0.8 + uHover * 0.5 + uFocus * 0.1) * uDim;

    if (uImgRect.z > uImgRect.x) {
      vec2 rectSize = uImgRect.zw - uImgRect.xy;
      vec2 rUv = (uv - uImgRect.xy) / rectSize;
      float inImg = step(0.0, rUv.x) * step(rUv.x, 1.0) * step(0.0, rUv.y) * step(rUv.y, 1.0);

      float rectAspect = (rectSize.x * 1280.0) / (rectSize.y * 720.0);
      float imgAspect = uImgAspect;

      // COVER
      vec2 iuv = rUv;
      if (imgAspect > rectAspect) {
        iuv.x = 0.5 + (rUv.x - 0.5) * (rectAspect / imgAspect);
      } else {
        iuv.y = 0.5 + (rUv.y - 0.5) * (imgAspect / rectAspect);
      }

      vec3 icol = texture2D(uImage, clamp(iuv, 0.0, 1.0)).rgb;
      float scan = 0.88 + 0.12 * step(0.55, fract(rUv.y * 48.0));
      float tint = 1.0 - smoothstep(0.55, 1.0, uReveal);
      icol = mix(icol, vec3(0.33, 1.0, 0.5) * dot(icol, vec3(0.35, 0.5, 0.15)), tint * 0.85);
      icol *= scan;

      // Degradado: se disuelve a la izquierda y suaviza arriba, abajo y derecha
      float fade = smoothstep(0.0, 0.6, rUv.x)
                 * smoothstep(0.0, 0.10, rUv.y) * smoothstep(1.0, 0.90, rUv.y)
                 * smoothstep(1.0, 0.94, rUv.x);

      // Protege el texto: donde hay píxeles brillantes de la card, la imagen no se mezcla
      float lum = dot(col, vec3(0.3, 0.6, 0.1));
      float textMask = smoothstep(0.2, 0.5, lum);

      // Revelado de abajo hacia arriba (igual que antes)
      float h = 1.0 - rUv.y;
      float ry = uReveal * 1.18;
      float shown = step(h + 0.001, ry);
      float edgeGlow = smoothstep(0.09, 0.0, abs(h - ry)) * smoothstep(0.02, 0.08, uReveal) * (1.0 - smoothstep(0.9, 1.0, uReveal));

      float IMG_OPACITY = 0.5;   // sube o baja para más/menos presencia
      float alpha = IMG_OPACITY * fade * shown * inImg * (1.0 - textMask);

      col = mix(col, icol * uDim, alpha);
      col += vec3(0.2, 0.9, 0.4) * edgeGlow * inImg * fade * 0.6;
    }

    gl_FragColor = vec4(col, 1.0);
  }
`;
// x0, y0, x1, y1 en píxeles del canvas de 1280x720 (y medido desde arriba)
// x0, y0, x1, y1. Coordenadas normalizadas del canvas 1280 × 720.
const CARD_IMG_RECT = new THREE.Vector4(
  600 / 1280,
  1 - 690 / 720,
  1240 / 1280,
  1 - 30 / 720
);



const blankTexture = () => { const t = new THREE.DataTexture(new Uint8Array([0, 0, 0, 255]), 1, 1); t.needsUpdate = true; return t; };

function makeFaceMaterial(map, seed, imageMap, aspect = 1.0) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uMap: { value: map }, uTime: { value: 0 }, uHover: { value: 0 },
      uDim: { value: 1 }, uFocus: { value: 0 }, uSeed: { value: seed },
      uImage: { value: imageMap || blankTexture() },
      uImgRect: { value: imageMap ? CARD_IMG_RECT.clone() : new THREE.Vector4(0, 0, 0, 0) },
      uImgAspect: { value: aspect },
      uReveal: { value: 0 }
    },
    vertexShader: faceVertex,
    fragmentShader: faceFragment
  });
}

const haloMaterialFactory = strength => new THREE.ShaderMaterial({
  uniforms: { uStrength: { value: strength } },
  vertexShader: faceVertex,
  fragmentShader: /* glsl */`
    uniform float uStrength; varying vec2 vUv;
    void main(){
      vec2 p = (vUv - 0.5) * 2.0;
      float d = length(p * vec2(1.0, 1.1));
      float a = pow(smoothstep(1.0, 0.3, d), 2.0) * uStrength;
      gl_FragColor = vec4(0.15, 1.0, 0.45, a);
    }
  `,
  transparent: true,
  blending: THREE.AdditiveBlending,
  depthWrite: false
});

const frameGeo = {
  h: new THREE.BoxGeometry(CARD_W + 0.08, 0.04, 0.16),
  v: new THREE.BoxGeometry(0.04, CARD_H, 0.16)
};
const bodyGeo = new THREE.BoxGeometry(CARD_W, CARD_H, CARD_D);
const planeGeo = new THREE.PlaneGeometry(CARD_W - 0.02, CARD_H - 0.02);
const haloGeo = new THREE.PlaneGeometry(CARD_W * 1.7, CARD_H * 2.2);
const FRAME_BASE = new THREE.Color(0.25, 1.35, 0.5);

/* ───────────────────────── Módulos (cards) ───────────────────────── */
function createModule(section, index, textures) {
  const group = new THREE.Group();
  group.userData.sectionId = section.id;

  const body = new THREE.Mesh(bodyGeo, new THREE.MeshBasicMaterial({ color: 0x020a05 }));
  group.add(body);

  const faceMat = makeFaceMaterial(textures.front[index], index * 3.1, textures.images[index], textures.images[index]?.userData.aspect ?? 1);
  const face = new THREE.Mesh(planeGeo, faceMat);
  face.position.z = CARD_D / 2 + 0.004;
  face.userData.sectionId = section.id;
  group.add(face);
  faceMeshes.push(face);

  const backMat = makeFaceMaterial(textures.back, index * 1.7);
  const back = new THREE.Mesh(planeGeo, backMat);
  back.position.z = -CARD_D / 2 - 0.004;
  back.rotation.y = Math.PI;
  group.add(back);

  const frameMat = new THREE.MeshBasicMaterial({ color: FRAME_BASE.clone(), toneMapped: false });
  const top = new THREE.Mesh(frameGeo.h, frameMat); top.position.y = CARD_H / 2 + 0.02;
  const bottom = new THREE.Mesh(frameGeo.h, frameMat); bottom.position.y = -CARD_H / 2 - 0.02;
  const left = new THREE.Mesh(frameGeo.v, frameMat); left.position.x = -CARD_W / 2 - 0.02;
  const right = new THREE.Mesh(frameGeo.v, frameMat); right.position.x = CARD_W / 2 + 0.02;
  group.add(top, bottom, left, right);

  const haloMat = haloMaterialFactory(0.11);
  const halo = new THREE.Mesh(haloGeo, haloMat);
  halo.position.z = -0.35;
  group.add(halo);

  const slot = index * carousel.angleStep;
  Object.assign(group.userData, {
    slotAngle: slot, phase: index * 0.9, index,
    faceMat, backMat, frameMat, haloMat,
    hover: 0, focus: 0, dim: 1
  });
  return group;
}

/* ───────────────────────── Ambiente ───────────────────────── */
function createRain(count) {
  const positions = new Float32Array(count * 6);
  const colors = new Float32Array(count * 6);
  const speeds = new Float32Array(count);
  const lens = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const x = (Math.random() - 0.5) * 40;
    const z = -26 + Math.random() * 31;
    const head = FLOOR_Y + Math.random() * 15;
    speeds[i] = 1.6 + Math.random() * 4.2;
    lens[i] = 0.35 + speeds[i] * 0.22;
    positions.set([x, head + lens[i], z, x, head, z], i * 6);
    const b = 0.35 + Math.random() * 0.65;
    colors.set([0, 0.04 * b, 0.015 * b, 0.25 * b, 1.1 * b, 0.45 * b], i * 6);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const material = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false });
  rain = new THREE.LineSegments(geometry, material);
  rain.frustumCulled = false;
  rain.userData = { speeds, lens };
  scene.add(rain);
}

function createDust(count) {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = 3.4 + Math.pow(Math.random(), 0.65) * 6.5;
    const th = Math.random() * Math.PI * 2;
    positions[i * 3] = Math.cos(th) * r;
    positions[i * 3 + 1] = (Math.random() - 0.5) * (0.6 + r * 0.22);
    positions[i * 3 + 2] = Math.sin(th) * r;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({ color: new THREE.Color(0.3, 1.3, 0.55), size: 0.05, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false });
  dust = new THREE.Points(geometry, material);
  dust.position.set(0, 0.1, carousel.centerZ);
  scene.add(dust);
}

function createCore() {
  core = new THREE.Group();
  core.position.set(0, 0.1, carousel.centerZ);
  const wire = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.3, 1),
    new THREE.MeshBasicMaterial({ color: new THREE.Color(0.2, 1.2, 0.45), wireframe: true, transparent: true, opacity: 0.75, toneMapped: false })
  );
  const inner = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.72, 2),
    new THREE.MeshBasicMaterial({ color: new THREE.Color(0.25, 1.6, 0.6), transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false })
  );
  core.add(wire, inner);
  [1.95, 2.4, 2.9].forEach((r, i) => {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(r, 0.012, 8, 160),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(0.2, 1.1, 0.45), transparent: true, opacity: 0.7 - i * 0.15, toneMapped: false })
    );
    ring.rotation.set(Math.PI / 2 + i * 0.5, i * 0.8, 0);
    ring.userData.speed = 0.25 + i * 0.12;
    core.add(ring);
  });
  core.userData = { wire, inner };
  scene.add(core);
}

function createFloor() {
  const w = wrap.clientWidth, h = wrap.clientHeight, pr = pixelRatio();
  if (!isNarrow()) {
    const reflector = new Reflector(new THREE.PlaneGeometry(120, 80), {
      color: 0x6f9a7b,
      textureWidth: Math.floor(w * pr * 0.5),
      textureHeight: Math.floor(h * pr * 0.5),
      clipBias: 0.003,
      multisample: 2
    });
    reflector.rotation.x = -Math.PI / 2;
    reflector.position.set(0, FLOOR_Y, -10);
    scene.add(reflector);

    const fade = new THREE.Mesh(
      new THREE.PlaneGeometry(120, 80),
      new THREE.ShaderMaterial({
        vertexShader: faceVertex,
        fragmentShader: /* glsl */`
          varying vec2 vUv;
          void main(){
            vec2 p = (vUv - 0.5) * vec2(120.0, 80.0);
            float d = length(vec2(p.x, p.y + 6.8));
            float a = mix(0.5, 1.0, smoothstep(6.0, 26.0, d));
            gl_FragColor = vec4(0.0009, 0.0018, 0.0018, a);
          }
        `,
        transparent: true, depthWrite: false
      })
    );
    fade.rotation.x = -Math.PI / 2;
    fade.position.set(0, FLOOR_Y + 0.01, -10);
    scene.add(fade);
  }

  grid = new THREE.GridHelper(60, 90, 0x1a7a38, 0x0d3a1c);
  grid.position.set(0, FLOOR_Y + 0.02, -5);
  grid.material.transparent = true;
  grid.material.opacity = isNarrow() ? 0.4 : 0.3;
  scene.add(grid);

  const footprint = new THREE.Mesh(
    new THREE.TorusGeometry(carousel.radiusX, 0.012, 6, 200),
    new THREE.MeshBasicMaterial({ color: new THREE.Color(0.2, 1.1, 0.45), transparent: true, opacity: 0.7, toneMapped: false })
  );
  footprint.rotation.x = Math.PI / 2;
  footprint.scale.y = carousel.radiusZ / carousel.radiusX;
  footprint.position.set(0, FLOOR_Y + 0.03, carousel.centerZ);
  scene.add(footprint);
}

function createBackdropGlow() {
  const glow = new THREE.Mesh(new THREE.PlaneGeometry(90, 46), haloMaterialFactory(0.22));
  glow.position.set(0, 2, -30);
  scene.add(glow);
}

function createShock() {
  shock = new THREE.Mesh(
    new THREE.RingGeometry(1.45, 1.5, 96),
    new THREE.MeshBasicMaterial({ color: new THREE.Color(0.3, 1.6, 0.6), transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, toneMapped: false })
  );
  shock.visible = false;
  shock.userData.t = 1;
  scene.add(shock);
}

/* ───────────────────────── Post-procesado ───────────────────────── */
const FXShader = {
  uniforms: { tDiffuse: { value: null }, uTime: { value: 0 }, uAberr: { value: 0.0012 }, uVig: { value: 0.55 }, uGrain: { value: 0.05 } },
  vertexShader: faceVertex,
  fragmentShader: /* glsl */`
    uniform sampler2D tDiffuse;
    uniform float uTime, uAberr, uVig, uGrain;
    varying vec2 vUv;
    float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
    void main(){
      vec2 c = vUv - 0.5;
      float r = dot(c, c);
      vec2 off = c * r * uAberr * 14.0;
      vec3 col = vec3(
        texture2D(tDiffuse, vUv + off).r,
        texture2D(tDiffuse, vUv).g,
        texture2D(tDiffuse, vUv - off).b
      );
      col *= 1.0 - smoothstep(0.08, 0.5, r) * uVig;
      col += (hash(vUv * vec2(1920.0, 1080.0) + fract(uTime) * 100.0) - 0.5) * uGrain;
      gl_FragColor = vec4(col, 1.0);
    }
  `
};

function createComposer() {
  const w = wrap.clientWidth, h = wrap.clientHeight;
  const target = new THREE.WebGLRenderTarget(w, h, { type: THREE.HalfFloatType, samples: isNarrow() ? 2 : 4 });
  composer = new EffectComposer(renderer, target);
  composer.setPixelRatio(pixelRatio());
  composer.setSize(w, h);
  composer.addPass(new RenderPass(scene, camera));
  bloomPass = new UnrealBloomPass(new THREE.Vector2(w, h), 0.55, 0.65, 0.32);
  composer.addPass(bloomPass);
  composer.addPass(new OutputPass());
  fxPass = new ShaderPass(FXShader);
  composer.addPass(fxPass);
}

/* ───────────────────────── Panel ───────────────────────── */
function openPanel(id) {
  const section = sections.find(item => item.id === id);
  if (!section) return;
  panelIndex.textContent = `MODULE / ${section.index}`;
  panelKicker.textContent = section.kicker;
  panelTitle.textContent = section.title;
  panelContent.replaceChildren();
  const description = document.createElement('p');
  description.textContent = section.description;
  panelContent.append(description);
  if (section.bullets?.length) {
    const heading = document.createElement('h3'); heading.textContent = 'CAPABILITIES / NOTES'; panelContent.append(heading);
    const list = document.createElement('ul');
    section.bullets.forEach(item => { const li = document.createElement('li'); li.textContent = item; list.append(li); });
    panelContent.append(list);
  }
  if (section.entries?.length) {
    section.entries.forEach(entry => {
      const heading = document.createElement('h3'); heading.textContent = entry.heading; panelContent.append(heading);
      const list = document.createElement('ul');
      entry.items.forEach(item => { const li = document.createElement('li'); li.textContent = item; list.append(li); });
      panelContent.append(list);
    });
  }
  if (section.tags?.length) {
    const tags = document.createElement('div'); tags.className = 'tag-list';
    section.tags.forEach(item => { const tag = document.createElement('span'); tag.className = 'tag'; tag.textContent = item; tags.append(tag); });
    panelContent.append(tags);
  }
  if (section.links?.length) {
    const links = document.createElement('p');
    section.links.forEach((item, i) => {
      if (i) links.append(document.createTextNode('  /  '));
      const a = document.createElement('a'); a.href = item.url; a.target = '_blank'; a.rel = 'noreferrer'; a.textContent = item.label; links.append(a);
    });
    panelContent.append(links);
  }
  Array.from(panelContent.children).forEach((el, i) => el.style.setProperty('--i', i));
  panel.classList.add('is-open');
  panel.setAttribute('aria-hidden', 'false');
  panel.inert = false;
  closeButton.focus({ preventScroll: true });
}

function exitFocus() {
  if (pendingPanel) { clearTimeout(pendingPanel); pendingPanel = null; }
  mode = 'home';
  focusId = null;
  carousel.spreadTarget = 1;
  idleUntil = (clock ? clock.elapsedTime : 0) + 1.5;
  document.body.classList.remove('is-focus');
}

function hidePanel() {
  panel.classList.remove('is-open');
  panel.setAttribute('aria-hidden', 'true');
  panel.inert = true;
  exitFocus();
  if (lastFocusEl && document.contains(lastFocusEl)) lastFocusEl.focus({ preventScroll: true });
  lastFocusEl = null;
}

/* ───────────────────────── Interacción ───────────────────────── */
function selectModule(id) {
  if (mode === 'focus') return;
  const index = moduleObjects.findIndex(g => g.userData.sectionId === id);
  if (index < 0) return;
  mode = 'focus';
  focusId = id;
  hoveredId = null;
  lastFocusEl = document.activeElement;
  document.body.classList.add('is-focus');
  carousel.spreadTarget = FOCUS_SPREAD;
  fx.pulse = 1;
  shock.userData.t = -0.35;

  let delta = (-moduleObjects[index].userData.slotAngle - carousel.targetOffset) % (Math.PI * 2);
  if (delta > Math.PI) delta -= Math.PI * 2;
  if (delta < -Math.PI) delta += Math.PI * 2;
  carousel.targetOffset += delta;

  pendingPanel = setTimeout(() => {
    pendingPanel = null;
    if (mode === 'focus' && focusId === id) openPanel(id);
  }, OPEN_PANEL_DELAY);
}

function frontModuleId() {
  let best = null, bestAngle = Infinity;
  moduleObjects.forEach(g => {
    const a = Math.abs(wrapAngle(g.userData.slotAngle + carousel.targetOffset));
    if (a < bestAngle) { bestAngle = a; best = g.userData.sectionId; }
  });
  return best;
}

function pickAt(event) {
  const rect = canvas.getBoundingClientRect();
  pointerNdc.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointerNdc.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointerNdc, camera);
  const hits = raycaster.intersectObjects(faceMeshes, false);
  return hits.length ? hits[0].object.userData.sectionId : null;
}

function bindInteraction() {
  canvas.addEventListener('pointerdown', event => {
    if (mode !== 'home') return;
    drag.down = true; drag.x = event.clientX; drag.moved = 0;
    canvas.setPointerCapture(event.pointerId);
    canvas.style.cursor = 'grabbing';
  });
  canvas.addEventListener('pointermove', event => {
    if (drag.down) {
      const dx = event.clientX - drag.x;
      drag.x = event.clientX;
      drag.moved += Math.abs(dx);
      carousel.targetOffset += dx * 0.0065;
      idleUntil = clock.elapsedTime + 3;
    } else if (event.pointerType === 'mouse' && mode === 'home') {
      hoveredId = pickAt(event);
      canvas.style.cursor = hoveredId ? 'pointer' : 'grab';
    }
  });
  canvas.addEventListener('pointerup', event => {
    if (!drag.down) return;
    drag.down = false;
    try { canvas.releasePointerCapture(event.pointerId); } catch { /* noop */ }
    canvas.style.cursor = hoveredId ? 'pointer' : 'grab';
    if (drag.moved < 6) {
      const id = pickAt(event);
      if (id) selectModule(id);
    }
  });
  canvas.addEventListener('pointercancel', () => { drag.down = false; });
  canvas.addEventListener('pointerleave', () => { hoveredId = null; });

  window.addEventListener('pointermove', event => {
    if (event.pointerType !== 'mouse') return;
    const rect = wrap.getBoundingClientRect();
    mouse.tx = clamp(((event.clientX - rect.left) / rect.width) * 2 - 1, -1, 1);
    mouse.ty = clamp(-(((event.clientY - rect.top) / rect.height) * 2 - 1), -1, 1);
  });

  closeButton.addEventListener('click', hidePanel);
  panel.addEventListener('click', event => { if (event.target?.dataset?.close) hidePanel(); });
  document.querySelectorAll('[data-section]').forEach(button => button.addEventListener('click', () => selectModule(button.dataset.section)));

  motionToggle.addEventListener('click', () => {
    isMoving = !isMoving;
    motionToggle.textContent = `MOTION: ${isMoving ? 'ON' : 'OFF'}`;
    motionToggle.setAttribute('aria-pressed', String(!isMoving));
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      if (panel.classList.contains('is-open')) hidePanel();
      else if (mode === 'focus') exitFocus();
      return;
    }
    if (mode !== 'home') return;
    const tag = document.activeElement?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;
    if (event.key === 'ArrowRight') { carousel.targetOffset -= carousel.angleStep; idleUntil = clock.elapsedTime + 3; }
    if (event.key === 'ArrowLeft') { carousel.targetOffset += carousel.angleStep; idleUntil = clock.elapsedTime + 3; }
    if (event.key === 'Enter' && document.activeElement === canvas) selectModule(frontModuleId());
  });

  new ResizeObserver(resize).observe(wrap);
}

/* ───────────────────────── Actualización por frame ───────────────────────── */
function updateCarousel(dt, t) {
  const spinning = mode === 'home' && isMoving && !hoveredId && !drag.down && introT >= 1 && t > idleUntil;
  if (spinning) carousel.targetOffset += carousel.spin * dt;
  carousel.offset += (carousel.targetOffset - carousel.offset) * damp(mode === 'focus' ? 5 : 2.6, dt);
  carousel.spread += (carousel.spreadTarget - carousel.spread) * damp(2.8, dt);

  const introSpin = (1 - easeOutExpo(introT)) * Math.PI * 1.2;

  moduleObjects.forEach((g, i) => {
    const u = g.userData;
    const isFocus = mode === 'focus' && focusId === u.sectionId;
    const isHover = mode === 'home' && hoveredId === u.sectionId;
    u.focus += ((isFocus ? 1 : 0) - u.focus) * damp(4, dt);
    u.hover += ((isHover ? 1 : 0) - u.hover) * damp(8, dt);
    u.dim += (((mode === 'focus' && !isFocus) ? 0.22 : 1) - u.dim) * damp(3, dt);

    const a = wrapAngle(u.slotAngle + carousel.offset + introSpin);
    const bob = isMoving ? Math.sin(t * 0.8 + u.phase) * 0.08 : 0;
    g.position.set(
      Math.sin(a) * carousel.radiusX * carousel.spread,
      bob * (1 - u.focus) + u.focus * 0.05 + u.hover * 0.12,
      carousel.centerZ + Math.cos(a) * carousel.radiusZ * carousel.spread + u.focus * 1.2 + u.hover * 0.35
    );
    const live = u.hover + u.focus;
    g.rotation.set(-mouse.y * 0.06 * live, a * 0.6 + mouse.x * 0.08 * live, 0);

    const k = clamp((introT * 1.7 - i * 0.12) / 0.7);
    const s = Math.max(0.001, easeOutBack(k)) * (1 + u.hover * 0.04);
    g.scale.setScalar(s);

    u.faceMat.uniforms.uTime.value = t;
    u.faceMat.uniforms.uHover.value = u.hover;
    u.faceMat.uniforms.uDim.value = u.dim;
    u.faceMat.uniforms.uFocus.value = u.focus;
    u.faceMat.uniforms.uReveal.value = u.focus;
    u.backMat.uniforms.uTime.value = t;
    u.backMat.uniforms.uDim.value = u.dim * 0.55;
    u.frameMat.color.copy(FRAME_BASE).multiplyScalar((0.72 + u.hover * 0.7 + u.focus * 0.2) * (0.3 + 0.7 * u.dim));
    u.haloMat.uniforms.uStrength.value = (0.11 + u.hover * 0.18 + u.focus * 0.07 + fx.pulse * 0.14 * u.focus) * u.dim;
  });
}

function updateCamera(dt, t) {
  const mobile = wrap.clientWidth < 760;
  const narrow = isNarrow();
  const tgt = camTarget;

  if (mode === 'focus') {
    const fov = narrow ? 36 : 32;
    const halfT = Math.tan(THREE.MathUtils.degToRad(fov / 2));
    const fraction = narrow ? 0.88 : 0.42;
    const dW = CARD_W / (fraction * 2 * halfT * camera.aspect);
    const dH = CARD_H / ((narrow ? 0.3 : 0.62) * 2 * halfT);
    const d = Math.max(dW, dH);
    const nx = narrow ? 0 : -0.34;
    const ny = narrow ? 0.45 : 0;
    const halfW = d * halfT * camera.aspect;
    const halfH = d * halfT;
    tgt.pos.set(-nx * halfW + mouse.x * 0.15, 0.05 - ny * halfH + mouse.y * 0.08, FOCUS_Z + d);
    tgt.look.set(tgt.pos.x + mouse.x * 0.25, tgt.pos.y, FOCUS_Z);
    tgt.fov = fov;
    tgt.roll = narrow ? 0 : 0.025;
  } else {
    const introOff = 1 - easeOutExpo(introT);
    const driftX = isMoving ? Math.sin(t * 0.23) * 0.35 : 0;
    const driftY = isMoving ? Math.sin(t * 0.31) * 0.12 : 0;
    tgt.pos.set(mouse.x * 0.9 + driftX, 0.95 + mouse.y * 0.45 + driftY + introOff * 3.2, (mobile ? 10.8 : 8.8) + introOff * 16);
    tgt.look.set(mouse.x * 0.6, mobile ? 0.9 : 0.4, carousel.centerZ);
    tgt.fov = (mobile ? 60 : 46) + introOff * 14;
    tgt.roll = isMoving ? Math.sin(t * 0.17) * 0.004 : 0;
  }

  if (!camReady) {
    camPos.copy(tgt.pos); camLook.copy(tgt.look); camFov = tgt.fov; camRoll = tgt.roll;
    camReady = true;
  } else {
    const k = damp(mode === 'focus' ? 2.6 : (introT < 1 ? 4 : 1.8), dt);
    camPos.lerp(tgt.pos, k);
    camLook.lerp(tgt.look, k);
    camFov += (tgt.fov - camFov) * k;
    camRoll += (tgt.roll - camRoll) * k;
  }

  camera.position.copy(camPos);
  camera.up.set(Math.sin(camRoll), Math.cos(camRoll), 0);
  camera.lookAt(camLook);
  if (Math.abs(camera.fov - camFov) > 0.001) { camera.fov = camFov; camera.updateProjectionMatrix(); }
}

function updateAmbient(dt, t) {
  slowmo += ((mode === 'focus' ? 0.3 : 1) - slowmo) * damp(2.5, dt);
  const mdt = dt * slowmo;

  if (isMoving) {
    const arr = rain.geometry.attributes.position.array;
    const { speeds, lens } = rain.userData;
    for (let i = 0; i < speeds.length; i++) {
      let head = arr[i * 6 + 4] - speeds[i] * mdt;
      if (head < FLOOR_Y) head = 11 + Math.random() * 4;
      arr[i * 6 + 1] = head + lens[i];
      arr[i * 6 + 4] = head;
    }
    rain.geometry.attributes.position.needsUpdate = true;
    dust.rotation.y += mdt * 0.06;
    core.userData.wire.rotation.y += mdt * 0.35;
    core.userData.wire.rotation.x += mdt * 0.15;
    core.userData.inner.rotation.y -= mdt * 0.5;
    core.children.forEach(child => { if (child.userData.speed) child.rotation.z += mdt * child.userData.speed; });
    grid.position.z = -5 + ((t * 0.6) % (60 / 90));
  }

  const coreScale = 1 + fx.pulse * 0.4 + fx.focus * 0.15;
  core.scale.setScalar(coreScale);

  if (shock.userData.t < 1) {
    shock.userData.t += dt / 1.2;
    const p = shock.userData.t;
    if (p > 0) {
      shock.visible = true;
      const s = 1 + easeOutCubic(p) * 7;
      shock.scale.set(s, s, 1);
      shock.position.set(0, 0.05, FOCUS_Z - 0.2);
      shock.material.opacity = Math.pow(1 - p, 2) * 0.9;
    }
    if (p >= 1) shock.visible = false;
  }
}

function updateFX(dt, t) {
  fx.pulse = Math.max(0, fx.pulse - dt * 1.6);
  fx.focus += ((mode === 'focus' ? 1 : 0) - fx.focus) * damp(2.5, dt);
  const hoverBoost = hoveredId ? 0.0007 : 0;
  bloomPass.strength = 0.5 + fx.focus * 0.05 + fx.pulse * 0.55;
  fxPass.uniforms.uAberr.value = 0.0012 + fx.focus * 0.0003 + fx.pulse * 0.0045 + hoverBoost;
  fxPass.uniforms.uVig.value = 0.55 + fx.focus * 0.08;
  fxPass.uniforms.uTime.value = t;
}

function animate() {
  if (!initialized) return;
  const dt = Math.min(clock.getDelta(), 0.05);
  const t = clock.elapsedTime;

  introT = Math.min(1, introT + dt / INTRO_DURATION);
  mouse.x += (mouse.tx - mouse.x) * damp(3, dt);
  mouse.y += (mouse.ty - mouse.y) * damp(3, dt);

  updateCarousel(dt, t);
  updateCamera(dt, t);
  updateAmbient(dt, t);
  updateFX(dt, t);
  composer.render(dt);
}

function resize() {
  if (!renderer || !camera || !composer) return;
  const w = wrap.clientWidth, h = wrap.clientHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(pixelRatio());
  renderer.setSize(w, h, false);
  composer.setPixelRatio(pixelRatio());
  composer.setSize(w, h);
}

/* ───────────────────────── Init ───────────────────────── */
async function init() {
  await loadFonts();

  renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' });
  renderer.setPixelRatio(pixelRatio());
  renderer.setSize(wrap.clientWidth, wrap.clientHeight, false);
  renderer.setClearColor(0x030806, 1);
  const maxAniso = Math.min(8, renderer.capabilities.getMaxAnisotropy());

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x030806);
  scene.fog = new THREE.FogExp2(0x030806, 0.03);
  camera = new THREE.PerspectiveCamera(46, wrap.clientWidth / wrap.clientHeight, 0.2, 100);
  clock = new THREE.Clock();
  raycaster = new THREE.Raycaster();
  pointerNdc = new THREE.Vector2();

  createBackdropGlow();
  createFloor();
  createRain(isNarrow() ? 450 : 900);
  createDust(isNarrow() ? 350 : 750);
  createCore();
  createShock();

  const imageLoader = new THREE.TextureLoader();
  const imageLoads = sections.map(s => {
    if (!s.image) return null;
    return new Promise(resolve => {
      const tex = imageLoader.load(s.image, () => {
        tex.userData.aspect = tex.image.width / tex.image.height;
        resolve(tex);
      }, undefined, () => {
        resolve(null);
      });
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = maxAniso;
    });
  });
  const images = await Promise.all(imageLoads.map(p => p ?? Promise.resolve(null)));
  const textures = { front: sections.map(s => makeCardTexture(s, maxAniso)), back: makeBackTexture(maxAniso), images };
  moduleObjects = sections.map((s, i) => createModule(s, i, textures));
  moduleObjects.forEach(g => scene.add(g));

  createComposer();
  bindInteraction();
  canvas.style.cursor = 'grab';
  statusEl.textContent = 'RENDERER: WEBGL 2 / BLOOM + POST FX';
  initialized = true;
  document.body.classList.add('is-ready');
  renderer.setAnimationLoop(animate);
  resize();
}

motionToggle.textContent = `MOTION: ${isMoving ? 'ON' : 'OFF'}`;
motionToggle.setAttribute('aria-pressed', String(!isMoving));

init().catch(error => {
  console.error('Could not initialize the 3D scene:', error);
  statusEl.textContent = '3D UNAVAILABLE / USE MODULE MENU';
  canvas.hidden = true;
  document.body.classList.add('is-ready');
  document.querySelector('.scene-vignette').style.display = 'none';
  document.querySelectorAll('[data-section]').forEach(button => button.addEventListener('click', () => {
    lastFocusEl = document.activeElement;
    openPanel(button.dataset.section);
  }));
  closeButton.addEventListener('click', hidePanel);
  panel.addEventListener('click', event => { if (event.target?.dataset?.close) hidePanel(); });
});
