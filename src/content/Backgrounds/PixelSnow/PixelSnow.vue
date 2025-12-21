<script setup lang="ts">
import {
  Color,
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Vector2,
  Vector3,
  WebGLRenderer
} from 'three';
import { onBeforeUnmount, onMounted, ref, useTemplateRef, watch, type CSSProperties } from 'vue';

const vertexShader = `
void main() {
  gl_Position = vec4(position, 1.0);
}
`;

const fragmentShader = `
precision highp float;

uniform float uTime;
uniform vec2 uResolution;
uniform float uFlakeSize;
uniform float uMinFlakeSize;
uniform float uPixelResolution;
uniform float uSpeed;
uniform float uDepthFade;
uniform float uFarPlane;
uniform vec3 uColor;
uniform float uBrightness;
uniform float uGamma;
uniform float uDensity;
uniform float uVariant;
uniform float uDirection;

#define M1 1597334677U
#define M2 3812015801U
#define M3 3299493293U
#define F0 (1.0/float(0xffffffffU))
#define hash(n) n*(n^(n>>15))
#define coord3(p) (uvec3(p).x*M1^uvec3(p).y*M2^uvec3(p).z*M3)

vec3 hash3(uint n) {
  return vec3(hash(n) * uvec3(0x1U, 0x1ffU, 0x3ffffU)) * F0;
}

float snowflakeDist(vec2 p) {
  float r = length(p);
  float a = atan(p.y, p.x);
  float PI = 3.14159265;
  a = abs(mod(a + PI / 6.0, PI / 3.0) - PI / 6.0);
  vec2 q = r * vec2(cos(a), sin(a));
  float dMain = abs(q.y);
  dMain = max(dMain, max(-q.x, q.x - 1.0));
  vec2 b1s = vec2(0.4, 0.0);
  vec2 b1d = vec2(0.574, 0.819);
  float b1t = clamp(dot(q - b1s, b1d), 0.0, 0.4);
  float dB1 = length(q - b1s - b1t * b1d);
  vec2 b2s = vec2(0.7, 0.0);
  float b2t = clamp(dot(q - b2s, b1d), 0.0, 0.25);
  float dB2 = length(q - b2s - b2t * b1d);
  return min(dMain, min(dB1, dB2)) * 10.0;
}

void main() {
  float pixelSize = max(1.0, floor(0.5 + uResolution.x / uPixelResolution));
  vec2 fragCoord = floor(gl_FragCoord.xy / pixelSize);
  vec2 res = uResolution / pixelSize;

  vec3 ray = normalize(vec3((fragCoord - res * 0.5) / res.x, 1.0));

  vec3 camK = normalize(vec3(1.0, 1.0, 1.0));
  vec3 camI = normalize(vec3(1.0, 0.0, -1.0));
  vec3 camJ = cross(camK, camI);
  ray = ray.x * camI + ray.y * camJ + ray.z * camK;

  float windX = cos(uDirection) * 0.4;
  float windY = sin(uDirection) * 0.4;
  vec3 camPos = (windX * camI + windY * camJ + 0.1 * camK) * uTime * uSpeed;
  vec3 pos = camPos;

  vec3 strides = 1.0 / max(abs(ray), vec3(0.001));
  vec3 phase = fract(pos) * strides;
  phase = mix(strides - phase, phase, step(ray, vec3(0.0)));

  float t = 0.0;
  for (int i = 0; i < 256; i++) {
    if (t >= uFarPlane) break;
    vec3 fpos = floor(pos);
    float cellHash = hash3(coord3(fpos)).x;

    if (cellHash < uDensity) {
      vec3 h = hash3(coord3(fpos));
      vec3 flakePos = 0.5 - 0.5 * cos(
        4.0 * sin(fpos.yzx * 0.073) +
        4.0 * sin(fpos.zxy * 0.27) +
        2.0 * h +
        uTime * uSpeed * 0.1 * vec3(7.0, 8.0, 5.0)
      );
      flakePos = flakePos * 0.8 + 0.1 + fpos;

      float toIntersection = dot(flakePos - pos, camK) / dot(ray, camK);
      if (toIntersection > 0.0) {
        vec3 testPos = pos + ray * toIntersection - flakePos;
        vec2 testUV = abs(vec2(dot(testPos, camI), dot(testPos, camJ)));
        float depth = dot(flakePos - camPos, camK);
        float flakeSize = max(uFlakeSize, uMinFlakeSize * depth * 0.5 / res.x);
        float dist;
        if (uVariant < 0.5) dist = max(testUV.x, testUV.y);
        else if (uVariant < 1.5) dist = length(testUV);
        else dist = snowflakeDist(vec2(dot(testPos, camI), dot(testPos, camJ)) / flakeSize) * flakeSize;

        if (dist < flakeSize) {
          float intensity = exp2(-(t + toIntersection) / uDepthFade) *
                           min(1.0, pow(uFlakeSize / flakeSize, 2.0)) * uBrightness;
          gl_FragColor = vec4(uColor * pow(vec3(intensity), vec3(uGamma)), 1.0);
          return;
        }
      }
    }

    float nextStep = min(min(phase.x, phase.y), phase.z);
    vec3 sel = step(phase, vec3(nextStep));
    phase = phase - nextStep + strides * sel;
    t += nextStep;
    pos = mix(pos + ray * nextStep, floor(pos + ray * nextStep + 0.5), sel);
  }

  gl_FragColor = vec4(0.0);
}
`;

interface PixelSnowProps {
  color?: string;
  flakeSize?: number;
  minFlakeSize?: number;
  pixelResolution?: number;
  speed?: number;
  depthFade?: number;
  farPlane?: number;
  brightness?: number;
  gamma?: number;
  density?: number;
  variant?: 'square' | 'round' | 'snowflake';
  direction?: number;
  className?: string;
  style?: CSSProperties;
}

const props = withDefaults(defineProps<PixelSnowProps>(), {
  color: '#ffffff',
  flakeSize: 0.01,
  minFlakeSize: 1.25,
  pixelResolution: 200,
  speed: 1.25,
  depthFade: 8,
  farPlane: 20,
  brightness: 1,
  gamma: 0.4545,
  density: 0.3,
  variant: 'square',
  direction: 125,
  className: '',
  style: () => ({})
});

const containerRef = useTemplateRef<HTMLDivElement>('containerRef');
const animationRef = ref<number>(0);

let cleanupFn: (() => void) | null = null;
const setupFn = () => {
  const container = containerRef.value;
  if (!container) return;

  const scene = new Scene();
  const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const renderer = new WebGLRenderer({
    antialias: false,
    alpha: true,
    premultipliedAlpha: false,
    powerPreference: 'high-performance'
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.offsetWidth, container.offsetHeight);
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  const threeColor = new Color(props.color);
  const material = new ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uResolution: { value: new Vector2(container.offsetWidth, container.offsetHeight) },
      uFlakeSize: { value: props.flakeSize },
      uMinFlakeSize: { value: props.minFlakeSize },
      uPixelResolution: { value: props.pixelResolution },
      uSpeed: { value: props.speed },
      uDepthFade: { value: props.depthFade },
      uFarPlane: { value: props.farPlane },
      uColor: { value: new Vector3(threeColor.r, threeColor.g, threeColor.b) },
      uBrightness: { value: props.brightness },
      uGamma: { value: props.gamma },
      uDensity: { value: props.density },
      uVariant: { value: props.variant === 'round' ? 1.0 : props.variant === 'snowflake' ? 2.0 : 0.0 },
      uDirection: { value: (props.direction * Math.PI) / 180 }
    },
    transparent: true
  });

  const geometry = new PlaneGeometry(2, 2);
  scene.add(new Mesh(geometry, material));

  const handleResize = () => {
    const w = container.offsetWidth,
      h = container.offsetHeight;
    renderer.setSize(w, h);
    material.uniforms.uResolution.value.set(w, h);
  };
  window.addEventListener('resize', handleResize);

  const startTime = performance.now();
  const animate = () => {
    animationRef.value = requestAnimationFrame(animate);
    material.uniforms.uTime.value = (performance.now() - startTime) * 0.001;
    renderer.render(scene, camera);
  };
  animate();

  cleanupFn = () => {
    cancelAnimationFrame(animationRef.value);
    window.removeEventListener('resize', handleResize);
    container.removeChild(renderer.domElement);
    renderer.dispose();
    geometry.dispose();
    material.dispose();
  };
};

onMounted(() => {
  setupFn();
});

onBeforeUnmount(() => {
  cleanupFn?.();
});

watch(
  () => [
    props.color,
    props.flakeSize,
    props.minFlakeSize,
    props.pixelResolution,
    props.speed,
    props.depthFade,
    props.farPlane,
    props.brightness,
    props.gamma,
    props.density,
    props.variant,
    props.direction
  ],
  () => {
    cleanupFn?.();
    setupFn();
  },
  { deep: true }
);
</script>

<template>
  <div ref="containerRef" :class="['absolute inset-0 w-full h-full', className]" :style="style"></div>
</template>
