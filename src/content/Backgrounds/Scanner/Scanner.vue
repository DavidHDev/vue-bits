<template>
  <div ref="containerRef" class="scanner-container" />
</template>

<script setup lang="ts">
import { Mesh, Program, Renderer, Triangle } from 'ogl';
import { onMounted, onUnmounted, ref, watch } from 'vue';

const VERT = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform float uSpeed;
uniform float uSweepSpeed;
uniform float uSweepWidth;
uniform float uSweepFalloff;
uniform float uScale;
uniform float uFrequency;
uniform float uRipple;
uniform float uBandDensity;
uniform float uLineSharpness;
uniform float uGlow;
uniform float uColorSpread;
uniform float uBrightness;
uniform float uContrast;
uniform float uSoftness;
uniform float uVignette;
uniform float uOpacity;
uniform float uScanline;
uniform float uGrain;
uniform float uGrainIntensity;
uniform float uDirection;
uniform vec2 uMouse;
uniform float uMouseEnabled;
uniform float uMouseRadius;
uniform float uMouseStrength;
uniform float uMouseActive;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
out vec4 fragColor;

const float TAU = 6.2831853;

float signalField(vec2 p, float t) {
  float w = sin(p.x * 1.3 + t * 0.7);
  w += sin(p.y * 1.7 - t * 0.52) * 0.8;
  w += sin((p.x + p.y) * 0.9 + t * 0.91) * 0.6;
  w += sin((p.x - p.y) * 1.53 - t * 0.63) * 0.42;
  return w * 0.35;
}

vec3 palette(float f) {
  f = clamp(f, 0.0, 1.0);
  f = pow(f, uContrast);
  vec3 c = mix(uColor1, uColor2, smoothstep(0.08, 0.6, f));
  return mix(c, uColor3, smoothstep(0.68, 1.0, f));
}

float scanBand(float x, float aa, float sharp) {
  float v = mix(0.5, 0.5 + 0.5 * cos(x * TAU), aa);
  return pow(v, sharp);
}

void main() {
  float aspect = iResolution.x / iResolution.y;
  vec2 uv0 = (gl_FragCoord.xy * 2.0 - iResolution.xy) / iResolution.y;
  vec2 p = uv0 / max(uScale, 0.001);

  float t = iTime * uSpeed;

  float mouseBoost = 0.0;
  if (uMouseEnabled > 0.5) {
    vec2 mUv = vec2((uMouse.x * 2.0 - 1.0) * aspect, uMouse.y * 2.0 - 1.0);
    vec2 md = uv0 - mUv;
    float r = max(uMouseRadius, 0.001);
    mouseBoost = exp(-dot(md, md) / (r * r)) * uMouseStrength * uMouseActive;
  }

  float axis;
  if (uDirection < 0.5) axis = p.y;
  else if (uDirection < 1.5) axis = p.x;
  else axis = (p.x + p.y) * 0.70710678;

  float sig = signalField(p * uFrequency, t);
  float coord = axis + sig * uRipple;

  float phase = coord / max(uSweepWidth, 0.05) - t * uSweepSpeed;
  float sweep = pow(0.5 + 0.5 * cos(phase * TAU), max(uSweepFalloff, 0.1));

  float lc = coord * uBandDensity;
  float aa = 1.0 / (1.0 + uSoftness * fwidth(lc) * 3.0);
  aa = clamp(aa * (1.0 + mouseBoost * 0.6), 0.0, 1.0);

  float bodyBase = clamp(0.5 + 0.5 * sig, 0.0, 1.0);
  float body = bodyBase * bodyBase * uGlow * sweep;

  float sharp = max(uLineSharpness, 0.1);
  float split = uColorSpread * 0.16;
  float fr = clamp(scanBand(lc + split, aa, sharp) * sweep + body, 0.0, 1.0);
  float fg = clamp(scanBand(lc, aa, sharp) * sweep + body, 0.0, 1.0);
  float fb = clamp(scanBand(lc - split, aa, sharp) * sweep + body, 0.0, 1.0);

  vec3 col = vec3(palette(fr).r, palette(fg).g, palette(fb).b);

  float inten = (fr + fg + fb) * 0.3333333 * uBrightness;
  inten *= 1.0 + mouseBoost * 0.9;

  if (uScanline > 0.5) {
    inten *= 1.0 - 0.18 * (0.5 + 0.5 * cos(gl_FragCoord.y * 1.7));
  }

  if (uGrain > 0.5) {
    float g = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233)) + iTime) * 43758.5453);
    inten += (g - 0.5) * uGrainIntensity;
  }

  inten *= clamp(1.0 - uVignette * smoothstep(0.55, 1.65, length(uv0)), 0.0, 1.0);
  inten = clamp(inten, 0.0, 1.0);

  float a = clamp(inten * uOpacity, 0.0, 1.0);
  fragColor = vec4(clamp(col, 0.0, 1.0) * a, a);
}
`;

interface ScannerProps {
  color1?: string;
  color2?: string;
  color3?: string;
  speed?: number;
  sweepSpeed?: number;
  sweepWidth?: number;
  sweepFalloff?: number;
  scale?: number;
  frequency?: number;
  ripple?: number;
  bandDensity?: number;
  lineSharpness?: number;
  glow?: number;
  scanDirection?: 'vertical' | 'horizontal' | 'diagonal';
  colorSpread?: number;
  brightness?: number;
  contrast?: number;
  softness?: number;
  vignette?: number;
  scanline?: boolean;
  grain?: boolean;
  grainIntensity?: number;
  opacity?: number;
  mouseInteraction?: boolean;
  mouseRadius?: number;
  mouseStrength?: number;
}

const props = withDefaults(defineProps<ScannerProps>(), {
  color1: '#5227FF',
  color2: '#FF9FFC',
  color3: '#FFFFFF',
  speed: 0.5,
  sweepSpeed: 0.25,
  sweepWidth: 1.6,
  sweepFalloff: 6,
  scale: 1.5,
  frequency: 2,
  ripple: 0.22,
  bandDensity: 11,
  lineSharpness: 5.5,
  glow: 0.22,
  scanDirection: 'vertical',
  colorSpread: 0.7,
  brightness: 1.0,
  contrast: 1.15,
  softness: 1.4,
  vignette: 0.45,
  scanline: true,
  grain: true,
  grainIntensity: 0.05,
  opacity: 1.0,
  mouseInteraction: true,
  mouseRadius: 0.5,
  mouseStrength: 0.5
});

function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [1, 1, 1];
  return [parseInt(result[1], 16) / 255, parseInt(result[2], 16) / 255, parseInt(result[3], 16) / 255];
}

function directionToFloat(dir: string): number {
  return dir === 'horizontal' ? 1.0 : dir === 'diagonal' ? 2.0 : 0.0;
}

const containerRef = ref<HTMLDivElement | null>(null);

let rafId = 0;
let renderer: InstanceType<typeof Renderer> | null = null;
let program: InstanceType<typeof Program> | null = null;
let resizeObserver: ResizeObserver | null = null;
let intersectionObserver: IntersectionObserver | null = null;
let isVisible = true;
let isPageVisible = !document.hidden;
// eslint-disable-next-line prefer-const
let currentMouse = [0.5, 0.5];
let targetMouse = [0.5, 0.5];
let mouseActive = 0;
let targetMouseActive = 0;
let mouseEnabled = true;
let canvasEl: HTMLCanvasElement | null = null;

function onMouseMove(e: MouseEvent) {
  if (!canvasEl) return;
  const rect = canvasEl.getBoundingClientRect();
  targetMouse = [(e.clientX - rect.left) / rect.width, 1.0 - (e.clientY - rect.top) / rect.height];
  targetMouseActive = 1;
}

function onMouseLeave() {
  targetMouseActive = 0;
}

function onVisibilityChange() {
  isPageVisible = !document.hidden;
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  isPageVisible ? tryStart() : tryStop();
}

function tryStart() {
  if (isVisible && isPageVisible && rafId === 0) {
    rafId = requestAnimationFrame(loop);
  }
}

function tryStop() {
  if (rafId !== 0) {
    cancelAnimationFrame(rafId);
    rafId = 0;
  }
}

function updateUniforms() {
  if (!program) return;
  const u = program.uniforms;

  u.uSpeed.value = props.speed;
  u.uSweepSpeed.value = props.sweepSpeed;
  u.uSweepWidth.value = props.sweepWidth;
  u.uSweepFalloff.value = props.sweepFalloff;
  u.uScale.value = props.scale;
  u.uFrequency.value = props.frequency;
  u.uRipple.value = props.ripple;
  u.uBandDensity.value = props.bandDensity;
  u.uLineSharpness.value = props.lineSharpness;
  u.uGlow.value = props.glow;
  u.uColorSpread.value = props.colorSpread;
  u.uBrightness.value = props.brightness;
  u.uContrast.value = props.contrast;
  u.uSoftness.value = props.softness;
  u.uVignette.value = props.vignette;
  u.uOpacity.value = props.opacity;
  u.uScanline.value = props.scanline ? 1.0 : 0.0;
  u.uGrain.value = props.grain ? 1.0 : 0.0;
  u.uGrainIntensity.value = props.grainIntensity;
  u.uDirection.value = directionToFloat(props.scanDirection);
  u.uMouseEnabled.value = props.mouseInteraction ? 1.0 : 0.0;
  u.uMouseRadius.value = props.mouseRadius;
  u.uMouseStrength.value = props.mouseStrength;

  const c1 = hexToRgb(props.color1);
  const c2 = hexToRgb(props.color2);
  const c3 = hexToRgb(props.color3);
  u.uColor1.value[0] = c1[0];
  u.uColor1.value[1] = c1[1];
  u.uColor1.value[2] = c1[2];
  u.uColor2.value[0] = c2[0];
  u.uColor2.value[1] = c2[1];
  u.uColor2.value[2] = c2[2];
  u.uColor3.value[0] = c3[0];
  u.uColor3.value[1] = c3[1];
  u.uColor3.value[2] = c3[2];

  mouseEnabled = props.mouseInteraction;
}

let meshRef: InstanceType<typeof Mesh> | null = null;

function loop(t: number) {
  if (!program || !renderer || !meshRef) return;
  program.uniforms.iTime.value = t * 0.001;

  if (!mouseEnabled) {
    targetMouseActive = 0;
  }
  currentMouse[0] += 0.05 * (targetMouse[0] - currentMouse[0]);
  currentMouse[1] += 0.05 * (targetMouse[1] - currentMouse[1]);
  program.uniforms.uMouse.value[0] = currentMouse[0];
  program.uniforms.uMouse.value[1] = currentMouse[1];
  mouseActive += 0.05 * (targetMouseActive - mouseActive);
  program.uniforms.uMouseActive.value = mouseActive;

  renderer.render({ scene: meshRef! });
  rafId = requestAnimationFrame(loop);
}

onMounted(() => {
  const container = containerRef.value;
  if (!container) return;

  renderer = new Renderer({
    webgl: 2,
    alpha: true,
    premultipliedAlpha: true,
    antialias: false,
    dpr: Math.min(window.devicePixelRatio || 1, 2)
  });

  const gl = renderer.gl;
  gl.clearColor(0, 0, 0, 0);
  canvasEl = gl.canvas as HTMLCanvasElement;
  canvasEl.style.width = '100%';
  canvasEl.style.height = '100%';
  canvasEl.style.display = 'block';
  container.appendChild(canvasEl);

  const geometry = new Triangle(gl);
  program = new Program(gl, {
    vertex: VERT,
    fragment: FRAG,
    uniforms: {
      iTime: { value: 0 },
      iResolution: { value: new Float32Array([1, 1]) },
      uSpeed: { value: props.speed },
      uSweepSpeed: { value: props.sweepSpeed },
      uSweepWidth: { value: props.sweepWidth },
      uSweepFalloff: { value: props.sweepFalloff },
      uScale: { value: props.scale },
      uFrequency: { value: props.frequency },
      uRipple: { value: props.ripple },
      uBandDensity: { value: props.bandDensity },
      uLineSharpness: { value: props.lineSharpness },
      uGlow: { value: props.glow },
      uColorSpread: { value: props.colorSpread },
      uBrightness: { value: props.brightness },
      uContrast: { value: props.contrast },
      uSoftness: { value: props.softness },
      uVignette: { value: props.vignette },
      uOpacity: { value: props.opacity },
      uScanline: { value: props.scanline ? 1.0 : 0.0 },
      uGrain: { value: props.grain ? 1.0 : 0.0 },
      uGrainIntensity: { value: props.grainIntensity },
      uDirection: { value: directionToFloat(props.scanDirection) },
      uMouse: { value: new Float32Array([0.5, 0.5]) },
      uMouseEnabled: { value: props.mouseInteraction ? 1.0 : 0.0 },
      uMouseRadius: { value: props.mouseRadius },
      uMouseStrength: { value: props.mouseStrength },
      uMouseActive: { value: 0.0 },
      uColor1: { value: new Float32Array(hexToRgb(props.color1)) },
      uColor2: { value: new Float32Array(hexToRgb(props.color2)) },
      uColor3: { value: new Float32Array(hexToRgb(props.color3)) }
    }
  });

  meshRef = new Mesh(gl, { geometry, program });

  const setSize = () => {
    if (!container || !renderer || !program) return;
    const rect = container.getBoundingClientRect();
    const w = Math.max(1, Math.floor(rect.width));
    const h = Math.max(1, Math.floor(rect.height));
    renderer.setSize(w, h);
    const res = program.uniforms.iResolution.value;
    res[0] = gl.drawingBufferWidth;
    res[1] = gl.drawingBufferHeight;
    renderer.render({ scene: meshRef! });
  };

  resizeObserver = new ResizeObserver(setSize);
  resizeObserver.observe(container);
  setSize();

  canvasEl.addEventListener('mousemove', onMouseMove);
  canvasEl.addEventListener('mouseleave', onMouseLeave);

  intersectionObserver = new IntersectionObserver(
    ([entry]) => {
      isVisible = entry.isIntersecting;
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      isVisible ? tryStart() : tryStop();
    },
    { threshold: 0 }
  );
  intersectionObserver.observe(container);

  document.addEventListener('visibilitychange', onVisibilityChange);

  tryStart();
});

onUnmounted(() => {
  tryStop();
  resizeObserver?.disconnect();
  intersectionObserver?.disconnect();
  document.removeEventListener('visibilitychange', onVisibilityChange);
  canvasEl?.removeEventListener('mousemove', onMouseMove);
  canvasEl?.removeEventListener('mouseleave', onMouseLeave);
  if (renderer) {
    const canvas = renderer.gl.canvas;
    if (canvas.parentNode) {
      canvas.parentNode.removeChild(canvas);
    }
    renderer.gl.getExtension('WEBGL_lose_context')?.loseContext();
  }
});

watch(
  () => [
    props.color1,
    props.color2,
    props.color3,
    props.speed,
    props.sweepSpeed,
    props.sweepWidth,
    props.sweepFalloff,
    props.scale,
    props.frequency,
    props.ripple,
    props.bandDensity,
    props.lineSharpness,
    props.glow,
    props.scanDirection,
    props.colorSpread,
    props.brightness,
    props.contrast,
    props.softness,
    props.vignette,
    props.opacity,
    props.scanline,
    props.grain,
    props.grainIntensity,
    props.mouseInteraction,
    props.mouseRadius,
    props.mouseStrength
  ],
  () => updateUniforms()
);
</script>

<style scoped>
.scanner-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
