<script setup lang="ts">
import { Mesh, Program, Renderer, Triangle } from 'ogl';
import { onMounted, onUnmounted, ref, watch } from 'vue';

const hexToRgb = (hex: string): [number, number, number] => {
  const value = hex.trim().replace(/^#/, '');
  const normalized = value.length === 3 ? value.replace(/./g, channel => channel + channel) : value;
  const match = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(normalized);
  if (!match) return [1, 1, 1];
  return [parseInt(match[1], 16) / 255, parseInt(match[2], 16) / 255, parseInt(match[3], 16) / 255];
};

interface ColorUniform {
  value: Float32Array;
}

const setColor = (uniform: ColorUniform, hex: string) => {
  const color = hexToRgb(hex);
  uniform.value[0] = color[0];
  uniform.value[1] = color[1];
  uniform.value[2] = color[2];
};

const vertex = `#version 300 es
in vec2 position;

void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragment = `#version 300 es
precision highp float;

uniform vec2 uResolution;
uniform float uTime;
uniform float uSpeed;
uniform float uScale;
uniform float uRotation;
uniform float uLayers;
uniform float uWaveAmplitude;
uniform float uWaveFrequency;
uniform float uWaveSpeed;
uniform float uLayerSpeed;
uniform float uTwist;
uniform float uTwistFrequency;
uniform float uTwistSpeed;
uniform float uLineFrequency;
uniform float uLineSpacing;
uniform float uLineSharpness;
uniform float uGlowFalloff;
uniform float uGlowIntensity;
uniform float uBrightness;
uniform float uBlueBoost;
uniform float uVignette;
uniform float uGrain;
uniform float uRotationSpeed;
uniform float uLightMode;
uniform vec3 uLineColor;
uniform vec3 uGlowColor;

out vec4 fragColor;

#define MAX_LAYERS 10

mat2 rotate2d(float angle) {
  float sine = sin(angle);
  float cosine = cos(angle);
  return mat2(cosine, -sine, sine, cosine);
}

float grainHash(vec2 point) {
  point = floor(point);
  float hash = 52.9829189 * fract(dot(point, vec2(0.065, 0.005)));
  return fract(hash);
}

float layeredGrain(vec2 fragmentPixel) {
  vec2 point = mod(fragmentPixel + vec2(uTime * 30.0, -uTime * 21.0), 1024.0);
  vec2 rotated = mat2(0.8, -0.5, 0.5, 0.8) * point;
  float grain = 0.0;
  grain += 0.40 * grainHash(rotated);
  grain += 0.25 * grainHash(rotated * 2.0 + 17.0);
  grain += 0.20 * grainHash(rotated * 4.0 + 47.0);
  grain += 0.10 * grainHash(rotated * 8.0 + 113.0);
  grain += 0.05 * grainHash(rotated * 16.0 + 191.0);
  return grain;
}

void main() {
  vec2 resolution = max(uResolution, vec2(1.0));
  vec2 uv = (2.0 * gl_FragCoord.xy - resolution) / resolution.y;
  float time = uTime * uSpeed;
  vec3 backdrop = mix(vec3(0.070588, 0.058824, 0.090196), vec3(1.0), step(0.5, uLightMode));
  vec3 centerTone = max(uLineColor * 0.85567 - uGlowColor * 0.06186, vec3(0.0));
  vec3 cloudTone = uLineColor * 0.19588 + uGlowColor * 0.2268;
  vec2 p = uv;
  p /= max(uScale, 0.05);
  p = rotate2d(radians(uRotation) + time * uRotationSpeed) * p;
  vec3 color = vec3(0.0);
  float fiberField = 0.0;

  for (int index = 0; index < MAX_LAYERS; index++) {
    float fi = float(index) + 1.0;
    if (fi > uLayers) break;

    p += uWaveAmplitude * sin(p.yx * fi * uWaveFrequency + time * (uWaveSpeed + fi * uLayerSpeed));

    float radius = length(p);
    float polarAngle = atan(p.y, p.x);
    polarAngle += sin(radius * uTwistFrequency - time * uTwistSpeed + fi) * uTwist;
    p = vec2(cos(polarAngle), sin(polarAngle)) * radius;

    float lines = abs(sin(p.x * (uLineFrequency + fi * uLineSpacing) + sin(p.y * 3.0 + time)));
    lines = pow(max(0.0, 1.0 - lines), uLineSharpness);
    fiberField += lines / fi;
    color += uLineColor * lines / fi;

    float glow = exp(-uGlowFalloff * abs(sin(p.x * 3.0 + time + fi)));
    color += uGlowColor * glow * uGlowIntensity / (fi * 2.0);
  }

  float center = exp(-2.2 * dot(uv, uv));
  color += centerTone * center;

  float cloud = exp(-1.5 * length(uv + vec2(sin(time * 0.3) * 0.25, cos(time * 0.25) * 0.18)));
  color += cloudTone * cloud;

  float vignette = 1.0 - smoothstep(0.35, 1.45, length(uv));
  color *= mix(1.0 - uVignette, 1.0, vignette);
  color = 1.0 - exp(-color * uBrightness);
  color.b *= uBlueBoost;

  vec3 outputColor;
  if (uLightMode > 0.5) {
    float edgeFade = mix(1.0 - uVignette, 1.0, vignette);
    float fibers = pow(smoothstep(0.12, 1.05, fiberField) * edgeFade, 1.5);
    float atmosphere = (center * 0.025 + cloud * 0.015) * edgeFade;
    vec3 fiberInk = mix(backdrop, uLineColor, 0.52);
    vec3 airColor = mix(backdrop, uGlowColor, 0.16);

    outputColor = mix(backdrop, airColor, atmosphere);
    outputColor = mix(outputColor, fiberInk, fibers * 0.3);
  } else {
    outputColor = backdrop + color;
  }

  float noise = (layeredGrain(gl_FragCoord.xy) - 0.5) * uGrain;
  outputColor = clamp(outputColor + noise, 0.0, 1.0);
  fragColor = vec4(outputColor, 1.0);
}
`;

interface ScalarUniform {
  value: number;
}
interface Vec2Uniform {
  value: Float32Array;
}
interface Vec3Uniform {
  value: Float32Array;
}

interface MainUniforms {
  uResolution: Vec2Uniform;
  uTime: ScalarUniform;
  uSpeed: ScalarUniform;
  uScale: ScalarUniform;
  uRotation: ScalarUniform;
  uRotationSpeed: ScalarUniform;
  uLayers: ScalarUniform;
  uWaveAmplitude: ScalarUniform;
  uWaveFrequency: ScalarUniform;
  uWaveSpeed: ScalarUniform;
  uLayerSpeed: ScalarUniform;
  uTwist: ScalarUniform;
  uTwistFrequency: ScalarUniform;
  uTwistSpeed: ScalarUniform;
  uLineFrequency: ScalarUniform;
  uLineSpacing: ScalarUniform;
  uLineSharpness: ScalarUniform;
  uGlowFalloff: ScalarUniform;
  uGlowIntensity: ScalarUniform;
  uBrightness: ScalarUniform;
  uBlueBoost: ScalarUniform;
  uVignette: ScalarUniform;
  uGrain: ScalarUniform;
  uLightMode: ScalarUniform;
  uLineColor: Vec3Uniform;
  uGlowColor: Vec3Uniform;
}

interface GhostFibersProps {
  lineColor?: string;
  glowColor?: string;
  speed?: number;
  scale?: number;
  rotation?: number;
  rotationSpeed?: number;
  layers?: number;
  waveAmplitude?: number;
  waveFrequency?: number;
  waveSpeed?: number;
  layerSpeed?: number;
  twist?: number;
  twistFrequency?: number;
  twistSpeed?: number;
  lineFrequency?: number;
  lineSpacing?: number;
  lineSharpness?: number;
  glowFalloff?: number;
  glowIntensity?: number;
  brightness?: number;
  blueBoost?: number;
  vignette?: number;
  grain?: number;
  lightMode?: boolean;
  dpr?: number;
  fps?: number;
  paused?: boolean;
  className?: string;
}

interface RenderContext {
  uniforms: MainUniforms;
  render: () => void;
  setPaused: (value: boolean) => void;
  setFps: (value: number) => void;
}

const props = withDefaults(defineProps<GhostFibersProps>(), {
  lineColor: '#140E35',
  glowColor: '#3437A0',
  speed: 0.2,
  scale: 2,
  rotation: 0,
  rotationSpeed: 0.25,
  layers: 4,
  waveAmplitude: 0.015,
  waveFrequency: 3,
  waveSpeed: 0.15,
  layerSpeed: 0.08,
  twist: 0.1,
  twistFrequency: 5,
  twistSpeed: 1.2,
  lineFrequency: 5,
  lineSpacing: 2,
  lineSharpness: 16,
  glowFalloff: 10,
  glowIntensity: 1.6,
  brightness: 2,
  blueBoost: 1.25,
  vignette: 0.8,
  grain: 0.05,
  lightMode: false,
  dpr: 1,
  fps: 60,
  paused: false,
  className: ''
});

const containerRef = ref<HTMLDivElement | null>(null);

let context: RenderContext | null = null;
let teardown: (() => void) | null = null;

const setup = () => {
  const container = containerRef.value;
  if (!container) return;

  const renderer = new Renderer({
    webgl: 2,
    alpha: false,
    antialias: false,
    dpr: Math.min(Math.max(props.dpr, 0.5), 2)
  });
  const gl = renderer.gl;
  const canvas = gl.canvas as HTMLCanvasElement;
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.display = 'block';
  canvas.setAttribute('aria-hidden', 'true');
  container.appendChild(canvas);

  const geometry = new Triangle(gl);
  const localProgram = new Program(gl, {
    vertex,
    fragment,
    uniforms: {
      uResolution: { value: new Float32Array([1, 1]) },
      uTime: { value: 0 },
      uSpeed: { value: 0.2 },
      uScale: { value: 2 },
      uRotation: { value: 0 },
      uRotationSpeed: { value: 0.25 },
      uLayers: { value: 4 },
      uWaveAmplitude: { value: 0.015 },
      uWaveFrequency: { value: 3 },
      uWaveSpeed: { value: 0.15 },
      uLayerSpeed: { value: 0.08 },
      uTwist: { value: 0.1 },
      uTwistFrequency: { value: 5 },
      uTwistSpeed: { value: 1.2 },
      uLineFrequency: { value: 5 },
      uLineSpacing: { value: 2 },
      uLineSharpness: { value: 16 },
      uGlowFalloff: { value: 10 },
      uGlowIntensity: { value: 1.6 },
      uBrightness: { value: 2 },
      uBlueBoost: { value: 1.25 },
      uVignette: { value: 0.8 },
      uGrain: { value: 0.05 },
      uLightMode: { value: 0 },
      uLineColor: { value: new Float32Array(hexToRgb('#140E35')) },
      uGlowColor: { value: new Float32Array(hexToRgb('#3437A0')) }
    }
  });
  const mu = localProgram.uniforms as unknown as MainUniforms;
  const mesh = new Mesh(gl, { geometry, program: localProgram });

  let frameId = 0;
  let elapsed = 0;
  let previousTime = performance.now();
  let lastRenderTime = 0;
  let frameRate = 60;
  let isPaused = false;
  let isVisible = true;
  let isPageVisible = !document.hidden;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const render = () => renderer.render({ scene: mesh });
  const stop = () => {
    if (frameId !== 0) cancelAnimationFrame(frameId);
    frameId = 0;
  };
  const canAnimate = () => isVisible && isPageVisible && !isPaused && !reducedMotion.matches;

  const loop = (now: number) => {
    frameId = 0;
    if (!canAnimate()) return;

    const delta = Math.min((now - previousTime) / 1000, 0.1);
    previousTime = now;
    elapsed += delta;

    if (now - lastRenderTime >= 1000 / frameRate - 0.5) {
      mu.uTime.value = elapsed;
      render();
      lastRenderTime = now;
    }

    frameId = requestAnimationFrame(loop);
  };

  const start = () => {
    if (!canAnimate() || frameId !== 0) return;
    previousTime = performance.now();
    frameId = requestAnimationFrame(loop);
  };

  const setSize = () => {
    const rect = container.getBoundingClientRect();
    renderer.setSize(Math.max(1, Math.floor(rect.width)), Math.max(1, Math.floor(rect.height)));
    mu.uResolution.value[0] = gl.drawingBufferWidth;
    mu.uResolution.value[1] = gl.drawingBufferHeight;
    render();
  };

  const handleVisibility = () => {
    isPageVisible = !document.hidden;
    if (canAnimate()) start();
    else stop();
  };
  const handleReducedMotion = () => {
    if (canAnimate()) start();
    else {
      stop();
      render();
    }
  };

  const resizeObserver = new ResizeObserver(setSize);
  resizeObserver.observe(container);
  const intersectionObserver = new IntersectionObserver(
    ([entry]) => {
      isVisible = entry.isIntersecting;
      if (canAnimate()) start();
      else stop();
    },
    { threshold: 0 }
  );
  intersectionObserver.observe(container);
  document.addEventListener('visibilitychange', handleVisibility);
  reducedMotion.addEventListener('change', handleReducedMotion);

  context = {
    uniforms: mu,
    render,
    setPaused(value) {
      isPaused = value;
      if (canAnimate()) start();
      else {
        stop();
        render();
      }
    },
    setFps(value) {
      frameRate = Math.min(Math.max(value, 1), 120);
    }
  };

  setSize();
  start();

  teardown = () => {
    stop();
    resizeObserver.disconnect();
    intersectionObserver.disconnect();
    document.removeEventListener('visibilitychange', handleVisibility);
    reducedMotion.removeEventListener('change', handleReducedMotion);
    context = null;
    if (canvas.parentNode === container) container.removeChild(canvas);
    gl.getExtension('WEBGL_lose_context')?.loseContext();
  };
};

const syncSettings = () => {
  if (!context) return;
  const u = context.uniforms;
  setColor(u.uLineColor, props.lineColor);
  setColor(u.uGlowColor, props.glowColor);
  u.uSpeed.value = props.speed;
  u.uScale.value = props.scale;
  u.uRotation.value = props.rotation;
  u.uRotationSpeed.value = props.rotationSpeed;
  u.uLayers.value = Math.min(Math.max(Math.round(props.layers), 1), 10);
  u.uWaveAmplitude.value = props.waveAmplitude;
  u.uWaveFrequency.value = props.waveFrequency;
  u.uWaveSpeed.value = props.waveSpeed;
  u.uLayerSpeed.value = props.layerSpeed;
  u.uTwist.value = props.twist;
  u.uTwistFrequency.value = props.twistFrequency;
  u.uTwistSpeed.value = props.twistSpeed;
  u.uLineFrequency.value = props.lineFrequency;
  u.uLineSpacing.value = props.lineSpacing;
  u.uLineSharpness.value = props.lineSharpness;
  u.uGlowFalloff.value = props.glowFalloff;
  u.uGlowIntensity.value = props.glowIntensity;
  u.uBrightness.value = props.brightness;
  u.uBlueBoost.value = props.blueBoost;
  u.uVignette.value = props.vignette;
  u.uGrain.value = props.grain;
  u.uLightMode.value = props.lightMode ? 1 : 0;
  context.setFps(props.fps);
  context.setPaused(props.paused);
  context.render();
};

onMounted(() => {
  setup();
  syncSettings();
});

onUnmounted(() => {
  teardown?.();
  teardown = null;
});

watch(
  () => props.dpr,
  () => {
    teardown?.();
    teardown = null;
    setup();
    syncSettings();
  }
);

watch(
  () => [
    props.lineColor,
    props.glowColor,
    props.speed,
    props.scale,
    props.rotation,
    props.rotationSpeed,
    props.layers,
    props.waveAmplitude,
    props.waveFrequency,
    props.waveSpeed,
    props.layerSpeed,
    props.twist,
    props.twistFrequency,
    props.twistSpeed,
    props.lineFrequency,
    props.lineSpacing,
    props.lineSharpness,
    props.glowFalloff,
    props.glowIntensity,
    props.brightness,
    props.blueBoost,
    props.vignette,
    props.grain,
    props.lightMode,
    props.fps,
    props.paused,
    props.dpr
  ],
  () => syncSettings()
);
</script>

<template>
  <div ref="containerRef" class="relative w-full h-full overflow-hidden" :class="className" />
</template>
