<template>
  <div ref="containerRef" :class="className" :style="containerStyle" />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, computed, useTemplateRef, watch, type CSSProperties } from 'vue';
import { Renderer, Program, Mesh, Triangle } from 'ogl';

interface GradientBlindsProps {
  className?: string;
  dpr?: number;
  paused?: boolean;
  gradientColors?: string[];
  angle?: number;
  noise?: number;
  blindCount?: number;
  blindMinWidth?: number;
  mouseDampening?: number;
  mirrorGradient?: boolean;
  spotlightRadius?: number;
  spotlightSoftness?: number;
  spotlightOpacity?: number;
  distortAmount?: number;
  shineDirection?: 'left' | 'right';
  mixBlendMode?: string;
  style?: CSSProperties;
}

const props = withDefaults(defineProps<GradientBlindsProps>(), {
  className: '',
  dpr: undefined,
  paused: false,
  gradientColors: () => ['#FF9FFC', '#5227FF'],
  angle: 0,
  noise: 0.3,
  blindCount: 16,
  blindMinWidth: 60,
  mouseDampening: 0.15,
  mirrorGradient: false,
  spotlightRadius: 0.5,
  spotlightSoftness: 1,
  spotlightOpacity: 1,
  distortAmount: 0,
  shineDirection: 'left',
  mixBlendMode: 'lighten',
  style: () => ({})
});

// Template ref
const containerRef = useTemplateRef<HTMLDivElement>('containerRef');

// Reactive refs for WebGL state
let renderer: Renderer | null = null;
let program: Program | null = null;
let mesh: Mesh | null = null;
let geometry: Triangle | null = null;
let rafRef = 0;
let mouseTarget = [0, 0];
let lastTime = 0;
let firstResize = true;

// Computed style with mix-blend-mode
const containerStyle = computed(() => {
  const style: Record<string, string | number> = { ...props.style };
  if (props.mixBlendMode) {
    style.mixBlendMode = props.mixBlendMode;
  }
  return style;
});

// Constants
const MAX_COLORS = 8;

// Helper functions
const hexToRGB = (hex: string): [number, number, number] => {
  const c = hex.replace('#', '').padEnd(6, '0');
  const r = parseInt(c.slice(0, 2), 16) / 255;
  const g = parseInt(c.slice(2, 4), 16) / 255;
  const b = parseInt(c.slice(4, 6), 16) / 255;
  return [r, g, b];
};

const prepStops = (stops?: string[]) => {
  const base = (stops && stops.length ? stops : ['#FF9FFC', '#5227FF']).slice(0, MAX_COLORS);
  if (base.length === 1) base.push(base[0]);
  while (base.length < MAX_COLORS) base.push(base[base.length - 1]);
  const arr: [number, number, number][] = [];
  for (let i = 0; i < MAX_COLORS; i++) arr.push(hexToRGB(base[i]));
  const count = Math.max(2, Math.min(MAX_COLORS, stops?.length ?? 2));
  return { arr, count };
};

// Shaders
const vertex = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragment = `
#ifdef GL_ES
precision mediump float;
#endif

uniform vec3  iResolution;
uniform vec2  iMouse;
uniform float iTime;

uniform float uAngle;
uniform float uNoise;
uniform float uBlindCount;
uniform float uSpotlightRadius;
uniform float uSpotlightSoftness;
uniform float uSpotlightOpacity;
uniform float uMirror;
uniform float uDistort;
uniform float uShineFlip;
uniform vec3  uColor0;
uniform vec3  uColor1;
uniform vec3  uColor2;
uniform vec3  uColor3;
uniform vec3  uColor4;
uniform vec3  uColor5;
uniform vec3  uColor6;
uniform vec3  uColor7;
uniform int   uColorCount;

varying vec2 vUv;

float rand(vec2 co){
  return fract(sin(dot(co, vec2(12.9898,78.233))) * 43758.5453);
}

vec2 rotate2D(vec2 p, float a){
  float c = cos(a);
  float s = sin(a);
  return mat2(c, -s, s, c) * p;
}

vec3 getGradientColor(float t){
  float tt = clamp(t, 0.0, 1.0);
  int count = uColorCount;
  if (count < 2) count = 2;
  float scaled = tt * float(count - 1);
  float seg = floor(scaled);
  float f = fract(scaled);

  if (seg < 1.0) return mix(uColor0, uColor1, f);
  if (seg < 2.0 && count > 2) return mix(uColor1, uColor2, f);
  if (seg < 3.0 && count > 3) return mix(uColor2, uColor3, f);
  if (seg < 4.0 && count > 4) return mix(uColor3, uColor4, f);
  if (seg < 5.0 && count > 5) return mix(uColor4, uColor5, f);
  if (seg < 6.0 && count > 6) return mix(uColor5, uColor6, f);
  if (seg < 7.0 && count > 7) return mix(uColor6, uColor7, f);
  if (count > 7) return uColor7;
  if (count > 6) return uColor6;
  if (count > 5) return uColor5;
  if (count > 4) return uColor4;
  if (count > 3) return uColor3;
  if (count > 2) return uColor2;
  return uColor1;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv0 = fragCoord.xy / iResolution.xy;

    float aspect = iResolution.x / iResolution.y;
    vec2 p = uv0 * 2.0 - 1.0;
    p.x *= aspect;
    vec2 pr = rotate2D(p, uAngle);
    pr.x /= aspect;
    vec2 uv = pr * 0.5 + 0.5;

    vec2 uvMod = uv;
    if (uDistort > 0.0) {
      float a = uvMod.y * 6.0;
      float b = uvMod.x * 6.0;
      float w = 0.01 * uDistort;
      uvMod.x += sin(a) * w;
      uvMod.y += cos(b) * w;
    }
    float t = uvMod.x;
    if (uMirror > 0.5) {
      t = 1.0 - abs(1.0 - 2.0 * fract(t));
    }
    vec3 base = getGradientColor(t);

    vec2 offset = vec2(iMouse.x/iResolution.x, iMouse.y/iResolution.y);
  float d = length(uv0 - offset);
  float r = max(uSpotlightRadius, 1e-4);
  float dn = d / r;
  float spot = (1.0 - 2.0 * pow(dn, uSpotlightSoftness)) * uSpotlightOpacity;
  vec3 cir = vec3(spot);
  float stripe = fract(uvMod.x * max(uBlindCount, 1.0));
  if (uShineFlip > 0.5) stripe = 1.0 - stripe;
    vec3 ran = vec3(stripe);

    vec3 col = cir + base - ran;
    col += (rand(gl_FragCoord.xy + iTime) - 0.5) * uNoise;

    fragColor = vec4(col, 1.0);
}

void main() {
    vec4 color;
    mainImage(color, vUv * iResolution.xy);
    gl_FragColor = color;
}
`;

// WebGL cleanup function
const cleanup = () => {
  if (rafRef) {
    cancelAnimationFrame(rafRef);
    rafRef = 0;
  }

  if (renderer && containerRef.value) {
    const canvas = renderer.gl.canvas;
    if (canvas.parentElement === containerRef.value) {
      containerRef.value.removeChild(canvas);
    }
  }

  // Clean up WebGL resources
  const callIfFn = (obj: unknown, key: string) => {
    if (obj && typeof obj === 'object' && key in obj) {
      const method = (obj as Record<string, unknown>)[key];
      if (typeof method === 'function') {
        method.call(obj);
      }
    }
  };

  callIfFn(program, 'remove');
  callIfFn(geometry, 'remove');
  callIfFn(mesh, 'remove');
  callIfFn(renderer, 'destroy');

  program = null;
  geometry = null;
  mesh = null;
  renderer = null;
};

// WebGL initialization
const initWebGL = () => {
  const container = containerRef.value;
  if (!container) return;

  // Initialize OGL Renderer
  renderer = new Renderer({
    dpr: props.dpr ?? (typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1),
    alpha: true,
    antialias: true
  });

  const gl = renderer.gl;
  const canvas = gl.canvas;

  // Configure canvas
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.display = 'block';
  container.appendChild(canvas);

  // Create geometry
  geometry = new Triangle(gl);

  // Prepare gradient colors
  const { arr: colorArr, count: colorCount } = prepStops(props.gradientColors);

  // Set up uniforms
  const uniforms = {
    iResolution: {
      value: [gl.drawingBufferWidth, gl.drawingBufferHeight, 1]
    },
    iMouse: { value: [0, 0] },
    iTime: { value: 0 },
    uAngle: { value: (props.angle * Math.PI) / 180 },
    uNoise: { value: props.noise },
    uBlindCount: { value: Math.max(1, props.blindCount) },
    uSpotlightRadius: { value: props.spotlightRadius },
    uSpotlightSoftness: { value: props.spotlightSoftness },
    uSpotlightOpacity: { value: props.spotlightOpacity },
    uMirror: { value: props.mirrorGradient ? 1 : 0 },
    uDistort: { value: props.distortAmount },
    uShineFlip: { value: props.shineDirection === 'right' ? 1 : 0 },
    uColor0: { value: colorArr[0] },
    uColor1: { value: colorArr[1] },
    uColor2: { value: colorArr[2] },
    uColor3: { value: colorArr[3] },
    uColor4: { value: colorArr[4] },
    uColor5: { value: colorArr[5] },
    uColor6: { value: colorArr[6] },
    uColor7: { value: colorArr[7] },
    uColorCount: { value: colorCount }
  };

  // Create program with shaders
  program = new Program(gl, {
    vertex,
    fragment,
    uniforms
  });

  // Create mesh
  mesh = new Mesh(gl, { geometry, program });

  // Resize handler
  const resize = () => {
    const rect = container.getBoundingClientRect();
    renderer!.setSize(rect.width, rect.height);
    uniforms.iResolution.value = [gl.drawingBufferWidth, gl.drawingBufferHeight, 1];

    if (props.blindMinWidth && props.blindMinWidth > 0) {
      const maxByMinWidth = Math.max(1, Math.floor(rect.width / props.blindMinWidth));
      const effective = props.blindCount ? Math.min(props.blindCount, maxByMinWidth) : maxByMinWidth;
      uniforms.uBlindCount.value = Math.max(1, effective);
    } else {
      uniforms.uBlindCount.value = Math.max(1, props.blindCount);
    }

    if (firstResize) {
      firstResize = false;
      const cx = gl.drawingBufferWidth / 2;
      const cy = gl.drawingBufferHeight / 2;
      uniforms.iMouse.value = [cx, cy];
      mouseTarget = [cx, cy];
    }
  };

  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(container);

  // Mouse interaction
  const onPointerMove = (e: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    const scale = renderer!.dpr || 1;
    const x = (e.clientX - rect.left) * scale;
    const y = (rect.height - (e.clientY - rect.top)) * scale;
    mouseTarget = [x, y];
    if (props.mouseDampening <= 0) {
      uniforms.iMouse.value = [x, y];
    }
  };
  canvas.addEventListener('pointermove', onPointerMove);

  // Animation loop
  const loop = (t: number) => {
    rafRef = requestAnimationFrame(loop);
    uniforms.iTime.value = t * 0.001;

    if (props.mouseDampening > 0) {
      if (!lastTime) lastTime = t;
      const dt = (t - lastTime) / 1000;
      lastTime = t;
      const tau = Math.max(1e-4, props.mouseDampening);
      let factor = 1 - Math.exp(-dt / tau);
      if (factor > 1) factor = 1;
      const target = mouseTarget;
      const cur = uniforms.iMouse.value;
      cur[0] += (target[0] - cur[0]) * factor;
      cur[1] += (target[1] - cur[1]) * factor;
    } else {
      lastTime = t;
    }

    if (!props.paused && program && mesh) {
      try {
        renderer!.render({ scene: mesh });
      } catch (e) {
        console.error(e);
      }
    }
  };
  rafRef = requestAnimationFrame(loop);

  // Return cleanup function
  return () => {
    if (rafRef) cancelAnimationFrame(rafRef);
    canvas.removeEventListener('pointermove', onPointerMove as EventListener);
    ro.disconnect();
    if (canvas.parentElement === container) {
      container.removeChild(canvas);
    }
  };
};

onMounted(() => {
  initWebGL();
});

onUnmounted(() => {
  cleanup();
});

// Watch for prop changes that require re-initialization
watch(
  () => [
    props.dpr,
    props.paused,
    props.gradientColors,
    props.angle,
    props.noise,
    props.blindCount,
    props.blindMinWidth,
    props.mouseDampening,
    props.mirrorGradient,
    props.spotlightRadius,
    props.spotlightSoftness,
    props.spotlightOpacity,
    props.distortAmount,
    props.shineDirection
  ],
  () => {
    cleanup();
    initWebGL();
  },
  { deep: true }
);
</script>

<style scoped>
div {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>