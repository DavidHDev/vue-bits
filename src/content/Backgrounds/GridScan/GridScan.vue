<template>
  <div
    ref="containerRef"
    :class="['relative w-full h-full overflow-hidden', className]"
    :style="style"
  >
    <div
      v-if="showPreview"
      class="absolute right-3 bottom-3 w-[220px] h-[132px] rounded-lg overflow-hidden border border-white/25 shadow-[0_4px_16px_rgba(0,0,0,0.4)] bg-black text-white text-[12px] leading-[1.2] font-sans pointer-events-none"
    >
      <video
        ref="videoRef"
        muted
        playsinline
        autoplay
        class="w-full h-full object-cover -scale-x-100"
      />
      <div class="absolute left-2 top-2 px-[6px] py-[2px] bg-black/50 rounded-[6px] backdrop-blur-[4px]">
        {{
          enableWebcam
            ? modelsReady
              ? uiFaceActive
                ? 'Face: tracking'
                : 'Face: searching'
              : 'Loading models'
            : 'Webcam disabled'
        }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, useTemplateRef, type CSSProperties } from 'vue';
import { EffectComposer, RenderPass, EffectPass, BloomEffect, ChromaticAberrationEffect } from 'postprocessing';
import * as THREE from 'three';
import * as faceapi from 'face-api.js';

export type LineStyle = 'solid' | 'dashed' | 'dotted';
export type ScanDirection = 'forward' | 'backward' | 'pingpong';

interface GridScanProps {
  enableWebcam?: boolean;
  showPreview?: boolean;
  modelsPath?: string;
  sensitivity?: number;
  lineThickness?: number;
  linesColor?: string;
  gridScale?: number;
  lineStyle?: LineStyle;
  lineJitter?: number;
  enablePost?: boolean;
  bloomIntensity?: number;
  bloomThreshold?: number;
  bloomSmoothing?: number;
  chromaticAberration?: number;
  noiseIntensity?: number;
  scanColor?: string;
  scanOpacity?: number;
  scanDirection?: ScanDirection;
  scanSoftness?: number;
  scanGlow?: number;
  scanPhaseTaper?: number;
  scanDuration?: number;
  scanDelay?: number;
  enableGyro?: boolean;
  scanOnClick?: boolean;
  snapBackDelay?: number;
  className?: string;
  style?: CSSProperties;
}

const props = withDefaults(defineProps<GridScanProps>(), {
  enableWebcam: false,
  showPreview: false,
  modelsPath: 'https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@0.22.2/weights',
  sensitivity: 0.55,
  lineThickness: 1,
  linesColor: '#392e4e',
  scanColor: '#FF9FFC',
  scanOpacity: 0.4,
  gridScale: 0.1,
  lineStyle: 'solid',
  lineJitter: 0.1,
  scanDirection: 'pingpong',
  enablePost: true,
  bloomIntensity: 0,
  bloomThreshold: 0,
  bloomSmoothing: 0,
  chromaticAberration: 0.002,
  noiseIntensity: 0.01,
  scanGlow: 0.5,
  scanSoftness: 2,
  scanPhaseTaper: 0.9,
  scanDuration: 2.0,
  scanDelay: 2.0,
  enableGyro: false,
  scanOnClick: false,
  snapBackDelay: 250,
  className: ''
});

const vert = `
varying vec2 vUv;
void main(){
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const frag = `
precision highp float;
uniform vec3 iResolution;
uniform float iTime;
uniform vec2 uSkew;
uniform float uTilt;
uniform float uYaw;
uniform float uLineThickness;
uniform vec3 uLinesColor;
uniform vec3 uScanColor;
uniform float uGridScale;
uniform float uLineStyle;
uniform float uLineJitter;
uniform float uScanOpacity;
uniform float uScanDirection;
uniform float uNoise;
uniform float uBloomOpacity;
uniform float uScanGlow;
uniform float uScanSoftness;
uniform float uPhaseTaper;
uniform float uScanDuration;
uniform float uScanDelay;
varying vec2 vUv;

uniform float uScanStarts[8];
uniform float uScanCount;

const int MAX_SCANS = 8;

float smoother01(float a, float b, float x){
  float t = clamp((x - a) / max(1e-5, (b - a)), 0.0, 1.0);
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    vec2 p = (2.0 * fragCoord - iResolution.xy) / iResolution.y;

    vec3 ro = vec3(0.0);
    vec3 rd = normalize(vec3(p, 2.0));

    float cR = cos(uTilt), sR = sin(uTilt);
    rd.xy = mat2(cR, -sR, sR, cR) * rd.xy;

    float cY = cos(uYaw), sY = sin(uYaw);
    rd.xz = mat2(cY, -sY, sY, cY) * rd.xz;

    vec2 skew = clamp(uSkew, vec2(-0.7), vec2(0.7));
    rd.xy += skew * rd.z;

    vec3 color = vec3(0.0);
  float minT = 1e20;
  float gridScale = max(1e-5, uGridScale);
    float fadeStrength = 2.0;
    vec2 gridUV = vec2(0.0);

  float hitIsY = 1.0;
    for (int i = 0; i < 4; i++)
    {
        float isY = float(i < 2);
        float pos = mix(-0.2, 0.2, float(i)) * isY + mix(-0.5, 0.5, float(i - 2)) * (1.0 - isY);
        float num = pos - (isY * ro.y + (1.0 - isY) * ro.x);
        float den = isY * rd.y + (1.0 - isY) * rd.x;
        float t = num / den;
        vec3 h = ro + rd * t;

        float depthBoost = smoothstep(0.0, 3.0, h.z);
        h.xy += skew * 0.15 * depthBoost;

    bool use = t > 0.0 && t < minT;
    gridUV = use ? mix(h.zy, h.xz, isY) / gridScale : gridUV;
    minT = use ? t : minT;
    hitIsY = use ? isY : hitIsY;
    }

    vec3 hit = ro + rd * minT;
    float dist = length(hit - ro);

  float jitterAmt = clamp(uLineJitter, 0.0, 1.0);
  if (jitterAmt > 0.0) {
    vec2 j = vec2(
      sin(gridUV.y * 2.7 + iTime * 1.8),
      cos(gridUV.x * 2.3 - iTime * 1.6)
    ) * (0.15 * jitterAmt);
    gridUV += j;
  }
  float fx = fract(gridUV.x);
  float fy = fract(gridUV.y);
  float ax = min(fx, 1.0 - fx);
  float ay = min(fy, 1.0 - fy);
  float wx = fwidth(gridUV.x);
  float wy = fwidth(gridUV.y);
  float halfPx = max(0.0, uLineThickness) * 0.5;

  float tx = halfPx * wx;
  float ty = halfPx * wy;

  float aax = wx;
  float aay = wy;

  float lineX = 1.0 - smoothstep(tx, tx + aax, ax);
  float lineY = 1.0 - smoothstep(ty, ty + aay, ay);
  if (uLineStyle > 0.5) {
    float dashRepeat = 4.0;
    float dashDuty = 0.5;
    float vy = fract(gridUV.y * dashRepeat);
    float vx = fract(gridUV.x * dashRepeat);
    float dashMaskY = step(vy, dashDuty);
    float dashMaskX = step(vx, dashDuty);
    if (uLineStyle < 1.5) {
      lineX *= dashMaskY;
      lineY *= dashMaskX;
    } else {
      float dotRepeat = 6.0;
      float dotWidth = 0.18;
      float cy = abs(fract(gridUV.y * dotRepeat) - 0.5);
      float cx = abs(fract(gridUV.x * dotRepeat) - 0.5);
      float dotMaskY = 1.0 - smoothstep(dotWidth, dotWidth + fwidth(gridUV.y * dotRepeat), cy);
      float dotMaskX = 1.0 - smoothstep(dotWidth, dotWidth + fwidth(gridUV.x * dotRepeat), cx);
      lineX *= dotMaskY;
      lineY *= dotMaskX;
    }
  }
  float primaryMask = max(lineX, lineY);

  vec2 gridUV2 = (hitIsY > 0.5 ? hit.xz : hit.zy) / gridScale;
  if (jitterAmt > 0.0) {
    vec2 j2 = vec2(
      cos(gridUV2.y * 2.1 - iTime * 1.4),
      sin(gridUV2.x * 2.5 + iTime * 1.7)
    ) * (0.15 * jitterAmt);
    gridUV2 += j2;
  }
  float fx2 = fract(gridUV2.x);
  float fy2 = fract(gridUV2.y);
  float ax2 = min(fx2, 1.0 - fx2);
  float ay2 = min(fy2, 1.0 - fy2);
  float wx2 = fwidth(gridUV2.x);
  float wy2 = fwidth(gridUV2.y);
  float tx2 = halfPx * wx2;
  float ty2 = halfPx * wy2;
  float aax2 = wx2;
  float aay2 = wy2;
  float lineX2 = 1.0 - smoothstep(tx2, tx2 + aax2, ax2);
  float lineY2 = 1.0 - smoothstep(ty2, ty2 + aay2, ay2);
  if (uLineStyle > 0.5) {
    float dashRepeat2 = 4.0;
    float dashDuty2 = 0.5;
    float vy2m = fract(gridUV2.y * dashRepeat2);
    float vx2m = fract(gridUV2.x * dashRepeat2);
    float dashMaskY2 = step(vy2m, dashDuty2);
    float dashMaskX2 = step(vx2m, dashDuty2);
    if (uLineStyle < 1.5) {
      lineX2 *= dashMaskY2;
      lineY2 *= dashMaskX2;
    } else {
      float dotRepeat2 = 6.0;
      float dotWidth2 = 0.18;
      float cy2 = abs(fract(gridUV2.y * dotRepeat2) - 0.5);
      float cx2 = abs(fract(gridUV2.x * dotRepeat2) - 0.5);
      float dotMaskY2 = 1.0 - smoothstep(dotWidth2, dotWidth2 + fwidth(gridUV2.y * dotRepeat2), cy2);
      float dotMaskX2 = 1.0 - smoothstep(dotWidth2, dotWidth2 + fwidth(gridUV2.x * dotRepeat2), cx2);
      lineX2 *= dotMaskY2;
      lineY2 *= dotMaskX2;
    }
  }
    float altMask = max(lineX2, lineY2);

    float edgeDistX = min(abs(hit.x - (-0.5)), abs(hit.x - 0.5));
    float edgeDistY = min(abs(hit.y - (-0.2)), abs(hit.y - 0.2));
    float edgeDist = mix(edgeDistY, edgeDistX, hitIsY);
    float edgeGate = 1.0 - smoothstep(gridScale * 0.5, gridScale * 2.0, edgeDist);
    altMask *= edgeGate;

  float lineMask = max(primaryMask, altMask);

    float fade = exp(-dist * fadeStrength);

    float dur = max(0.05, uScanDuration);
    float del = max(0.0, uScanDelay);
    float scanZMax = 2.0;
    float widthScale = max(0.1, uScanGlow);
    float sigma = max(0.001, 0.18 * widthScale * uScanSoftness);
    float sigmaA = sigma * 2.0;

    float combinedPulse = 0.0;
    float combinedAura = 0.0;

    float cycle = dur + del;
    float tCycle = mod(iTime, cycle);
    float scanPhase = clamp((tCycle - del) / dur, 0.0, 1.0);
    float phase = scanPhase;
    if (uScanDirection > 0.5 && uScanDirection < 1.5) {
      phase = 1.0 - phase;
    } else if (uScanDirection > 1.5) {
      float t2 = mod(max(0.0, iTime - del), 2.0 * dur);
      phase = (t2 < dur) ? (t2 / dur) : (1.0 - (t2 - dur) / dur);
    }
    float scanZ = phase * scanZMax;
    float dz = abs(hit.z - scanZ);
    float lineBand = exp(-0.5 * (dz * dz) / (sigma * sigma));
    float taper = clamp(uPhaseTaper, 0.0, 0.49);
    float headW = taper;
    float tailW = taper;
    float headFade = smoother01(0.0, headW, phase);
    float tailFade = 1.0 - smoother01(1.0 - tailW, 1.0, phase);
    float phaseWindow = headFade * tailFade;
    float pulseBase = lineBand * phaseWindow;
    combinedPulse += pulseBase * clamp(uScanOpacity, 0.0, 1.0);
    float auraBand = exp(-0.5 * (dz * dz) / (sigmaA * sigmaA));
    combinedAura += (auraBand * 0.25) * phaseWindow * clamp(uScanOpacity, 0.0, 1.0);

    for (int i = 0; i < MAX_SCANS; i++) {
      if (float(i) >= uScanCount) break;
      float tActiveI = iTime - uScanStarts[i];
      float phaseI = clamp(tActiveI / dur, 0.0, 1.0);
      if (uScanDirection > 0.5 && uScanDirection < 1.5) {
        phaseI = 1.0 - phaseI;
      } else if (uScanDirection > 1.5) {
        phaseI = (phaseI < 0.5) ? (phaseI * 2.0) : (1.0 - (phaseI - 0.5) * 2.0);
      }
      float scanZI = phaseI * scanZMax;
      float dzI = abs(hit.z - scanZI);
      float lineBandI = exp(-0.5 * (dzI * dzI) / (sigma * sigma));
      float headFadeI = smoother01(0.0, headW, phaseI);
      float tailFadeI = 1.0 - smoother01(1.0 - tailW, 1.0, phaseI);
      float phaseWindowI = headFadeI * tailFadeI;
      combinedPulse += lineBandI * phaseWindowI * clamp(uScanOpacity, 0.0, 1.0);
      float auraBandI = exp(-0.5 * (dzI * dzI) / (sigmaA * sigmaA));
      combinedAura += (auraBandI * 0.25) * phaseWindowI * clamp(uScanOpacity, 0.0, 1.0);
    }

  float lineVis = lineMask;
  vec3 gridCol = uLinesColor * lineVis * fade;
  vec3 scanCol = uScanColor * combinedPulse;
  vec3 scanAura = uScanColor * combinedAura;

    color = gridCol + scanCol + scanAura;

  float n = fract(sin(dot(gl_FragCoord.xy + vec2(iTime * 123.4), vec2(12.9898,78.233))) * 43758.5453123);
  color += (n - 0.5) * uNoise;
  color = clamp(color, 0.0, 1.0);
  float alpha = clamp(max(lineVis, combinedPulse), 0.0, 1.0);
  float gx = 1.0 - smoothstep(tx * 2.0, tx * 2.0 + aax * 2.0, ax);
  float gy = 1.0 - smoothstep(ty * 2.0, ty * 2.0 + aay * 2.0, ay);
  float halo = max(gx, gy) * fade;
  alpha = max(alpha, halo * clamp(uBloomOpacity, 0.0, 1.0));
  fragColor = vec4(color, alpha);
}

void main(){
  vec4 c;
  mainImage(c, vUv * iResolution.xy);
  gl_FragColor = c;
}
`;

const containerRef = useTemplateRef<HTMLDivElement>('containerRef');
const videoRef = useTemplateRef<HTMLVideoElement>('videoRef');

const modelsReady = ref(false);
const uiFaceActive = ref(false);

const MAX_SCANS = 8;

let cleanupAnimation: () => void = () => {};

const srgbColor = (hex: string): THREE.Color => {
  const c = new THREE.Color(hex);
  return c.convertSRGBToLinear();
};

const smoothDampVec2 = (
  current: THREE.Vector2,
  target: THREE.Vector2,
  currentVelocity: THREE.Vector2,
  smoothTimeVal: number,
  maxSpeedVal: number,
  deltaTime: number
): THREE.Vector2 => {
  const out = current.clone();
  smoothTimeVal = Math.max(0.0001, smoothTimeVal);
  const omega = 2 / smoothTimeVal;
  const x = omega * deltaTime;
  const exp = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);

  let change = current.clone().sub(target);
  const originalTo = target.clone();

  const maxChange = maxSpeedVal * smoothTimeVal;
  if (change.length() > maxChange) change.setLength(maxChange);

  target = current.clone().sub(change);
  const temp = currentVelocity.clone().addScaledVector(change, omega).multiplyScalar(deltaTime);
  currentVelocity.sub(temp.clone().multiplyScalar(omega));
  currentVelocity.multiplyScalar(exp);

  out.copy(target.clone().add(change.add(temp).multiplyScalar(exp)));

  const origMinusCurrent = originalTo.clone().sub(current);
  const outMinusOrig = out.clone().sub(originalTo);
  if (origMinusCurrent.dot(outMinusOrig) > 0) {
    out.copy(originalTo);
    currentVelocity.set(0, 0);
  }
  return out;
};

const smoothDampFloat = (
  current: number,
  target: number,
  velRef: { v: number },
  smoothTimeVal: number,
  maxSpeedVal: number,
  deltaTime: number
): { value: number; v: number } => {
  smoothTimeVal = Math.max(0.0001, smoothTimeVal);
  const omega = 2 / smoothTimeVal;
  const x = omega * deltaTime;
  const exp = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);

  let change = current - target;
  const originalTo = target;

  const maxChange = maxSpeedVal * smoothTimeVal;
  change = Math.sign(change) * Math.min(Math.abs(change), maxChange);

  target = current - change;
  const temp = (velRef.v + omega * change) * deltaTime;
  velRef.v = (velRef.v - omega * temp) * exp;

  let out = target + (change + temp) * exp;

  const origMinusCurrent = originalTo - current;
  const outMinusOrig = out - originalTo;
  if (origMinusCurrent * outMinusOrig > 0) {
    out = originalTo;
    velRef.v = 0;
  }
  return { value: out, v: velRef.v };
};

const medianPush = (buf: number[], v: number, maxLen: number): void => {
  buf.push(v);
  if (buf.length > maxLen) buf.shift();
};

const median = (buf: number[]): number => {
  if (buf.length === 0) return 0;
  const a = [...buf].sort((x, y) => x - y);
  const mid = Math.floor(a.length / 2);
  return a.length % 2 ? a[mid] : (a[mid - 1] + a[mid]) * 0.5;
};

const centroid = (points: { x: number; y: number }[]): { x: number; y: number } => {
  let x = 0,
    y = 0;
  const n = points.length || 1;
  for (const p of points) {
    x += p.x;
    y += p.y;
  }
  return { x: x / n, y: y / n };
};

const dist2 = (a: { x: number; y: number }, b: { x: number; y: number }): number => {
  return Math.hypot(a.x - b.x, a.y - b.y);
};

const setupAnimation = () => {
  const container = containerRef.value;
  if (!container) return;

  // Non-reactive Three.js objects - stored as plain variables
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NoToneMapping;
  renderer.autoClear = false;
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  // Animation state - plain objects, not reactive
  const lookTarget = new THREE.Vector2(0, 0);
  const lookCurrent = new THREE.Vector2(0, 0);
  const lookVel = new THREE.Vector2(0, 0);
  let tiltTarget = 0;
  let tiltCurrent = 0;
  let tiltVel = 0;
  let yawTarget = 0;
  let yawCurrent = 0;
  let yawVel = 0;
  const scanStarts: number[] = [];
  const bufX: number[] = [];
  const bufY: number[] = [];
  const bufT: number[] = [];
  const bufYaw: number[] = [];
  let leaveTimer: number | null = null;

  const uniforms = {
    iResolution: {
      value: new THREE.Vector3(container.clientWidth, container.clientHeight, renderer.getPixelRatio())
    },
    iTime: { value: 0 },
    uSkew: { value: new THREE.Vector2(0, 0) },
    uTilt: { value: 0 },
    uYaw: { value: 0 },
    uLineThickness: { value: props.lineThickness },
    uLinesColor: { value: srgbColor(props.linesColor) },
    uScanColor: { value: srgbColor(props.scanColor) },
    uGridScale: { value: props.gridScale },
    uLineStyle: { value: props.lineStyle === 'dashed' ? 1 : props.lineStyle === 'dotted' ? 2 : 0 },
    uLineJitter: { value: Math.max(0, Math.min(1, props.lineJitter || 0)) },
    uScanOpacity: { value: props.scanOpacity },
    uNoise: { value: props.noiseIntensity },
    uBloomOpacity: { value: props.bloomIntensity },
    uScanGlow: { value: props.scanGlow },
    uScanSoftness: { value: props.scanSoftness },
    uPhaseTaper: { value: props.scanPhaseTaper },
    uScanDuration: { value: props.scanDuration },
    uScanDelay: { value: props.scanDelay },
    uScanDirection: { value: props.scanDirection === 'backward' ? 1 : props.scanDirection === 'pingpong' ? 2 : 0 },
    uScanStarts: { value: new Array(MAX_SCANS).fill(0) },
    uScanCount: { value: 0 }
  };

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: vert,
    fragmentShader: frag,
    transparent: true,
    depthWrite: false,
    depthTest: false
  });

  const geometry = new THREE.PlaneGeometry(2, 2);
  const quad = new THREE.Mesh(geometry, material);
  scene.add(quad);

  let composer: EffectComposer | null = null;
  let bloom: BloomEffect | null = null;
  let chroma: ChromaticAberrationEffect | null = null;

  if (props.enablePost) {
    composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    bloom = new BloomEffect({
      intensity: 1.0,
      luminanceThreshold: props.bloomThreshold,
      luminanceSmoothing: props.bloomSmoothing
    });
    bloom.blendMode.opacity.value = Math.max(0, props.bloomIntensity);

    chroma = new ChromaticAberrationEffect({
      offset: new THREE.Vector2(props.chromaticAberration, props.chromaticAberration),
      radialModulation: true,
      modulationOffset: 0.0
    });

    const effectPass = new EffectPass(camera, bloom, chroma);
    effectPass.renderToScreen = true;
    composer.addPass(effectPass);
  }

  const pushScan = (t: number): void => {
    if (scanStarts.length >= MAX_SCANS) scanStarts.shift();
    scanStarts.push(t);
    const buf = new Array(MAX_SCANS).fill(0);
    for (let i = 0; i < scanStarts.length && i < MAX_SCANS; i++) buf[i] = scanStarts[i];
    uniforms.uScanStarts.value = buf;
    uniforms.uScanCount.value = scanStarts.length;
  };

  const onMouseMove = (e: MouseEvent): void => {
    if (uiFaceActive.value) return;
    if (leaveTimer) {
      clearTimeout(leaveTimer);
      leaveTimer = null;
    }
    const rect = container.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    lookTarget.set(nx, ny);
  };

  const onClick = async (): Promise<void> => {
    const nowSec = performance.now() / 1000;
    if (props.scanOnClick) pushScan(nowSec);
    if (
      props.enableGyro &&
      typeof window !== 'undefined' &&
      (window as any).DeviceOrientationEvent &&
      (DeviceOrientationEvent as any).requestPermission
    ) {
      try {
        await (DeviceOrientationEvent as any).requestPermission();
      } catch {}
    }
  };

  const onMouseEnter = (): void => {
    if (leaveTimer) {
      clearTimeout(leaveTimer);
      leaveTimer = null;
    }
  };

  const onMouseLeave = (): void => {
    if (uiFaceActive.value) return;
    if (leaveTimer) clearTimeout(leaveTimer);
    leaveTimer = window.setTimeout(
      () => {
        lookTarget.set(0, 0);
        tiltTarget = 0;
        yawTarget = 0;
      },
      Math.max(0, props.snapBackDelay || 0)
    );
  };

  const onDeviceOrientation = (e: DeviceOrientationEvent): void => {
    if (uiFaceActive.value) return;
    const gamma = e.gamma ?? 0;
    const beta = e.beta ?? 0;
    const nx = THREE.MathUtils.clamp(gamma / 45, -1, 1);
    const ny = THREE.MathUtils.clamp(-beta / 30, -1, 1);
    lookTarget.set(nx, ny);
    tiltTarget = THREE.MathUtils.degToRad(gamma) * 0.4;
  };

  const onResize = (): void => {
    renderer.setSize(container.clientWidth, container.clientHeight);
    uniforms.iResolution.value.set(container.clientWidth, container.clientHeight, renderer.getPixelRatio());
    if (composer) composer.setSize(container.clientWidth, container.clientHeight);
  };

  container.addEventListener('mousemove', onMouseMove);
  container.addEventListener('mouseenter', onMouseEnter);
  container.addEventListener('mouseleave', onMouseLeave);
  if (props.scanOnClick) container.addEventListener('click', onClick);
  if (props.enableGyro) window.addEventListener('deviceorientation', onDeviceOrientation);
  window.addEventListener('resize', onResize);

  // Face detection
  let stopFaceDetection = false;
  let lastDetect = 0;

  const startFaceDetection = async (): Promise<void> => {
    if (!props.enableWebcam || !modelsReady.value) return;
    const video = videoRef.value;
    if (!video) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      });
      video.srcObject = stream;
      await video.play();
    } catch {
      return;
    }

    const opts = new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.5 });

    const s = THREE.MathUtils.clamp(props.sensitivity, 0, 1);
    const depthResponse = THREE.MathUtils.lerp(0.25, 0.45, s);

    const detect = async (ts: number): Promise<void> => {
      if (stopFaceDetection) return;

      if (ts - lastDetect >= 33) {
        lastDetect = ts;
        try {
          const res = await faceapi.detectSingleFace(video, opts).withFaceLandmarks(true);
          if (res && res.detection) {
            const det = res.detection;
            const box = det.box;
            const vw = video.videoWidth || 1;
            const vh = video.videoHeight || 1;

            const cx = box.x + box.width * 0.5;
            const cy = box.y + box.height * 0.5;
            const nx = (cx / vw) * 2 - 1;
            const ny = (cy / vh) * 2 - 1;
            medianPush(bufX, nx, 5);
            medianPush(bufY, ny, 5);
            const nxm = median(bufX);
            const nym = median(bufY);

            const look = new THREE.Vector2(Math.tanh(nxm), Math.tanh(nym));

            const faceSize = Math.min(1, Math.hypot(box.width / vw, box.height / vh));
            const depthScaleVal = 1 + depthResponse * (faceSize - 0.25);
            lookTarget.copy(look.multiplyScalar(depthScaleVal));

            const leftEye = res.landmarks.getLeftEye();
            const rightEye = res.landmarks.getRightEye();
            const lc = centroid(leftEye);
            const rc = centroid(rightEye);
            const tilt = Math.atan2(rc.y - lc.y, rc.x - lc.x);
            medianPush(bufT, tilt, 5);
            tiltTarget = median(bufT);

            const nose = res.landmarks.getNose();
            const tip = nose[nose.length - 1] || nose[Math.floor(nose.length / 2)];
            const jaw = res.landmarks.getJawOutline();
            const leftCheek = jaw[3] || jaw[2];
            const rightCheek = jaw[13] || jaw[14];
            const dL = dist2(tip, leftCheek);
            const dR = dist2(tip, rightCheek);
            const eyeDist = Math.hypot(rc.x - lc.x, rc.y - lc.y) + 1e-6;
            let yawSignal = THREE.MathUtils.clamp((dR - dL) / (eyeDist * 1.6), -1, 1);
            yawSignal = Math.tanh(yawSignal);
            medianPush(bufYaw, yawSignal, 5);
            yawTarget = median(bufYaw);

            uiFaceActive.value = true;
          } else {
            uiFaceActive.value = false;
          }
        } catch {
          uiFaceActive.value = false;
        }
      }

      if ('requestVideoFrameCallback' in HTMLVideoElement.prototype) {
        (video as any).requestVideoFrameCallback(() => detect(performance.now()));
      } else {
        requestAnimationFrame(detect);
      }
    };

    requestAnimationFrame(detect);
  };

  const stopWebcam = (): void => {
    stopFaceDetection = true;
    const video = videoRef.value;
    if (video) {
      const stream = video.srcObject as MediaStream | null;
      if (stream) stream.getTracks().forEach(t => t.stop());
      video.pause();
      video.srcObject = null;
    }
  };

  // Watch for webcam changes
  const unwatchWebcam = watch(
    () => props.enableWebcam,
    (newVal) => {
      if (newVal && modelsReady.value) {
        stopFaceDetection = false;
        startFaceDetection();
      } else {
        stopWebcam();
      }
    }
  );

  const unwatchModels = watch(modelsReady, (ready) => {
    if (ready && props.enableWebcam) {
      stopFaceDetection = false;
      startFaceDetection();
    }
  });

  // Watch for prop changes
  const unwatchProps = watch(
    [
      () => props.lineThickness,
      () => props.linesColor,
      () => props.scanColor,
      () => props.gridScale,
      () => props.lineStyle,
      () => props.lineJitter,
      () => props.bloomIntensity,
      () => props.bloomThreshold,
      () => props.bloomSmoothing,
      () => props.chromaticAberration,
      () => props.noiseIntensity,
      () => props.scanGlow,
      () => props.scanOpacity,
      () => props.scanDirection,
      () => props.scanSoftness,
      () => props.scanPhaseTaper,
      () => props.scanDuration,
      () => props.scanDelay
    ],
    () => {
      uniforms.uLineThickness.value = props.lineThickness;
      (uniforms.uLinesColor.value as THREE.Color).copy(srgbColor(props.linesColor));
      (uniforms.uScanColor.value as THREE.Color).copy(srgbColor(props.scanColor));
      uniforms.uGridScale.value = props.gridScale;
      uniforms.uLineStyle.value = props.lineStyle === 'dashed' ? 1 : props.lineStyle === 'dotted' ? 2 : 0;
      uniforms.uLineJitter.value = Math.max(0, Math.min(1, props.lineJitter || 0));
      uniforms.uBloomOpacity.value = Math.max(0, props.bloomIntensity);
      uniforms.uNoise.value = Math.max(0, props.noiseIntensity);
      uniforms.uScanGlow.value = props.scanGlow;
      uniforms.uScanOpacity.value = Math.max(0, Math.min(1, props.scanOpacity));
      uniforms.uScanDirection.value = props.scanDirection === 'backward' ? 1 : props.scanDirection === 'pingpong' ? 2 : 0;
      uniforms.uScanSoftness.value = props.scanSoftness;
      uniforms.uPhaseTaper.value = props.scanPhaseTaper;
      uniforms.uScanDuration.value = Math.max(0.05, props.scanDuration);
      uniforms.uScanDelay.value = Math.max(0.0, props.scanDelay);

      if (bloom) {
        bloom.blendMode.opacity.value = Math.max(0, props.bloomIntensity);
        (bloom as any).luminanceMaterial.threshold = props.bloomThreshold;
        (bloom as any).luminanceMaterial.smoothing = props.bloomSmoothing;
      }
      if (chroma) {
        chroma.offset.set(props.chromaticAberration, props.chromaticAberration);
      }
    }
  );

  // Animation loop
  let rafId: number | null = null;
  let last = performance.now();

  const tick = (): void => {
    const now = performance.now();
    const dt = Math.max(0, Math.min(0.1, (now - last) / 1000));
    last = now;

    const s = THREE.MathUtils.clamp(props.sensitivity, 0, 1);
    const skewScale = THREE.MathUtils.lerp(0.06, 0.2, s);
    const tiltScale = THREE.MathUtils.lerp(0.12, 0.3, s);
    const yawScale = THREE.MathUtils.lerp(0.1, 0.28, s);
    const smoothTime = THREE.MathUtils.lerp(0.45, 0.12, s);
    const yBoost = THREE.MathUtils.lerp(1.2, 1.6, s);
    const maxSpeed = Infinity;

    lookCurrent.copy(smoothDampVec2(lookCurrent, lookTarget, lookVel, smoothTime, maxSpeed, dt));

    const tiltSm = smoothDampFloat(tiltCurrent, tiltTarget, { v: tiltVel }, smoothTime, maxSpeed, dt);
    tiltCurrent = tiltSm.value;
    tiltVel = tiltSm.v;

    const yawSm = smoothDampFloat(yawCurrent, yawTarget, { v: yawVel }, smoothTime, maxSpeed, dt);
    yawCurrent = yawSm.value;
    yawVel = yawSm.v;

    uniforms.uSkew.value.set(lookCurrent.x * skewScale, -lookCurrent.y * yBoost * skewScale);
    uniforms.uTilt.value = tiltCurrent * tiltScale;
    uniforms.uYaw.value = THREE.MathUtils.clamp(yawCurrent * yawScale, -0.6, 0.6);

    uniforms.iTime.value = now / 1000;
    renderer.clear(true, true, true);
    if (composer) {
      composer.render(dt);
    } else {
      renderer.render(scene, camera);
    }
    rafId = requestAnimationFrame(tick);
  };
  rafId = requestAnimationFrame(tick);

  cleanupAnimation = () => {
    if (rafId) cancelAnimationFrame(rafId);
    if (leaveTimer) clearTimeout(leaveTimer);

    container.removeEventListener('mousemove', onMouseMove);
    container.removeEventListener('mouseenter', onMouseEnter);
    container.removeEventListener('mouseleave', onMouseLeave);
    container.removeEventListener('click', onClick);
    window.removeEventListener('deviceorientation', onDeviceOrientation);
    window.removeEventListener('resize', onResize);

    unwatchWebcam();
    unwatchModels();
    unwatchProps();

    stopWebcam();

    material.dispose();
    geometry.dispose();
    if (composer) composer.dispose();
    renderer.dispose();
    if (container.contains(renderer.domElement)) {
      container.removeChild(renderer.domElement);
    }
  };
};

const loadFaceModels = async (): Promise<void> => {
  try {
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(props.modelsPath),
      faceapi.nets.faceLandmark68TinyNet.loadFromUri(props.modelsPath)
    ]);
    modelsReady.value = true;
  } catch {
    modelsReady.value = false;
  }
};

onMounted(() => {
  setupAnimation();
  loadFaceModels();
});

onUnmounted(() => {
  cleanupAnimation();
});
</script>
