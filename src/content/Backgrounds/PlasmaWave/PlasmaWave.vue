<template>
  <div ref="containerRef" class="w-full h-full" />
</template>

<script setup lang="ts">
import { Camera, Geometry, Mesh, Program, Renderer, Transform } from 'ogl';
import { onBeforeUnmount, onMounted, useTemplateRef } from 'vue';

interface PlasmaWaveProps {
  xOffset?: number;
  yOffset?: number;
  rotationDeg?: number;
  focalLength?: number;
  speed1?: number;
  speed2?: number;
  dir2?: number;
  bend1?: number;
  bend2?: number;
  colors?: [string, string];
}

const props = withDefaults(defineProps<PlasmaWaveProps>(), {
  xOffset: 0,
  yOffset: 0,
  rotationDeg: 0,
  focalLength: 0.8,
  speed1: 0.05,
  speed2: 0.05,
  dir2: 1.0,
  bend1: 1,
  bend2: 0.5,
  colors: () => ['#A855F7', '#06B6D4']
});

const hexToRgb = (hex: string): [number, number, number] => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return [r, g, b];
};

const VERT = /* glsl */ `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = /* glsl */ `
precision mediump float;
uniform float iTime;
uniform vec2  iResolution;
uniform vec2  uOffset;
uniform float uRotation;
uniform float uFocalLength;
uniform float uSpeed1;
uniform float uSpeed2;
uniform float uDir2;
uniform float uBend1;
uniform float uBend2;
uniform vec3  uColor1;
uniform vec3  uColor2;

const float lt   = 0.3;
const float pi   = 3.14159;
const float pi2  = 6.28318;
const float pi_2 = 1.5708;
#define MAX_STEPS 14

void mainImage(out vec4 C, in vec2 U) {
  float t = iTime * pi;
  float s = 1.0;
  float d = 0.0;
  vec2  R = iResolution;

  vec3 o = vec3(0.0, 0.0, -7.0);
  vec3 u = normalize(vec3((U - 0.5 * R) / R.y, uFocalLength));
  vec2 k = vec2(0.0);
  vec3 p;

  float t1 = t * 0.7;
  float t2 = t * 0.9;
  float tSpeed1 = t * uSpeed1;
  float tSpeed2 = t * uSpeed2 * uDir2;

  for (int i = 0; i < MAX_STEPS; ++i) {
    p = o + u * d;
    p.x -= 15.0;

    float px = p.x;
    float wob1 = uBend1 + sin(t1 + px * 0.8) * 0.1;
    float wob2 = uBend2 + cos(t2 + px * 1.1) * 0.1;

    float px2 = px + pi_2;
    vec2 sinOffset = sin(vec2(px, px2) + tSpeed1) * wob1;
    vec2 cosOffset = cos(vec2(px, px2) + tSpeed2) * wob2;

    vec2 yz = p.yz;
    float pxLt = px + lt;
    k.x = max(pxLt, length(yz - sinOffset) - lt);
    k.y = max(pxLt, length(yz - cosOffset) - lt);

    float current = min(k.x, k.y);
    s = min(s, current);
    if (s < 0.001 || d > 300.0) break;
    d += s * 0.7;
  }

  float sqrtD = sqrt(d);
  vec3 raw = max(cos(d * pi2) - s * sqrtD - vec3(k, 0.0), 0.0);
  raw.gb += 0.1;
  float maxC = max(raw.r, max(raw.g, raw.b));
  if (maxC < 0.15) discard;
  raw = raw * 0.4 + raw.brg * 0.6 + raw * raw;
  float lum = dot(raw, vec3(0.299, 0.587, 0.114));
  float w1 = max(0.0, 1.0 - k.x * 2.0);
  float w2 = max(0.0, 1.0 - k.y * 2.0);
  float wt = w1 + w2 + 0.001;
  vec3 c = (uColor1 * w1 + uColor2 * w2) / wt * lum * 3.5;
  C = vec4(c, 1.0);
}

void main() {
  vec2 coord = gl_FragCoord.xy + uOffset;
  coord -= 0.5 * iResolution;
  float c = cos(uRotation), s = sin(uRotation);
  coord = mat2(c, -s, s, c) * coord;
  coord += 0.5 * iResolution;

  vec4 color;
  mainImage(color, coord);
  gl_FragColor = color;
}
`;

const containerRef = useTemplateRef<HTMLDivElement>('containerRef');

let cleanup: (() => void) | null = null;

const setup = () => {
  const ctn = containerRef.value;
  if (!ctn) return;

  const renderer = new Renderer({
    alpha: true,
    dpr: Math.min(window.devicePixelRatio, 1.5),
    antialias: false,
    depth: false,
    stencil: false,
    premultipliedAlpha: false,
    preserveDrawingBuffer: false,
    powerPreference: 'high-performance'
  });

  const gl = renderer.gl;
  gl.clearColor(0, 0, 0, 0);
  ctn.appendChild(gl.canvas);

  const camera = new Camera(gl);
  const scene = new Transform();

  const geometry = new Geometry(gl, {
    position: { size: 2, data: new Float32Array([-1, -1, 3, -1, -1, 3]) }
  });

  const uniformOffset = new Float32Array([props.xOffset, props.yOffset]);
  const uniformResolution = new Float32Array([1, 1]);
  const c1 = hexToRgb(props.colors[0]);
  const c2 = hexToRgb(props.colors[1]);

  const program = new Program(gl, {
    vertex: VERT,
    fragment: FRAG,
    uniforms: {
      iTime: { value: 0 },
      iResolution: { value: uniformResolution },
      uOffset: { value: uniformOffset },
      uRotation: { value: (props.rotationDeg * Math.PI) / 180 },
      uFocalLength: { value: props.focalLength },
      uSpeed1: { value: props.speed1 },
      uSpeed2: { value: props.speed2 },
      uDir2: { value: props.dir2 },
      uBend1: { value: props.bend1 },
      uBend2: { value: props.bend2 },
      uColor1: { value: new Float32Array(c1) },
      uColor2: { value: new Float32Array(c2) }
    }
  });

  new Mesh(gl, { geometry, program }).setParent(scene);

  const resize = () => {
    if (!ctn) return;
    const { width, height } = ctn.getBoundingClientRect();
    renderer.setSize(width, height);
    uniformResolution[0] = width * renderer.dpr;
    uniformResolution[1] = height * renderer.dpr;
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
  };

  const ro = new ResizeObserver(resize);
  ro.observe(ctn);
  resize();

  const startTime = performance.now();
  let animateId = 0;

  const update = (now: number) => {
    uniformOffset[0] = props.xOffset;
    uniformOffset[1] = props.yOffset;
    (program.uniforms.iTime as { value: number }).value = (now - startTime) * 0.001;
    (program.uniforms.uRotation as { value: number }).value = (props.rotationDeg * Math.PI) / 180;
    (program.uniforms.uFocalLength as { value: number }).value = props.focalLength;
    (program.uniforms.uSpeed1 as { value: number }).value = props.speed1;
    (program.uniforms.uSpeed2 as { value: number }).value = props.speed2;
    (program.uniforms.uDir2 as { value: number }).value = props.dir2;
    (program.uniforms.uBend1 as { value: number }).value = props.bend1;
    (program.uniforms.uBend2 as { value: number }).value = props.bend2;

    const color1 = program.uniforms.uColor1.value as Float32Array;
    const color2 = program.uniforms.uColor2.value as Float32Array;
    const newC1 = hexToRgb(props.colors[0]);
    const newC2 = hexToRgb(props.colors[1]);
    color1[0] = newC1[0];
    color1[1] = newC1[1];
    color1[2] = newC1[2];
    color2[0] = newC2[0];
    color2[1] = newC2[1];
    color2[2] = newC2[2];

    renderer.render({ scene, camera });
    animateId = requestAnimationFrame(update);
  };

  animateId = requestAnimationFrame(update);

  cleanup = () => {
    cancelAnimationFrame(animateId);
    ro.disconnect();
    if (gl.canvas.parentNode === ctn) {
      ctn.removeChild(gl.canvas);
    }
    gl.getExtension('WEBGL_lose_context')?.loseContext();
  };
};

onMounted(() => {
  setup();
});

onBeforeUnmount(() => {
  cleanup?.();
});
</script>
