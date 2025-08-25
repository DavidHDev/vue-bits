<script setup lang="ts">
import { Camera, Geometry, Mesh, Program, Renderer, Transform } from 'ogl';
import { onBeforeUnmount, onMounted, onUnmounted, ref, watch } from 'vue';

const vertex = /* glsl */ `
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragment = /* glsl */ `
precision mediump float;
uniform float iTime;
uniform vec2  iResolution;
uniform vec2  uOffset;
uniform float uRotation;
uniform float focalLength;
uniform float speed1;
uniform float speed2;
uniform float dir2;
uniform float bend1;
uniform float bend2;
uniform float bendAdj1;
uniform float bendAdj2;
uniform float uOpacity;

const float lt   = 0.3;
const float pi   = 3.141592653589793;
const float pi2  = pi * 2.0;
const float pi_2 = pi * 0.5;
#define MAX_STEPS 15

void mainImage(out vec4 C, in vec2 U) {
  float t = iTime * pi;
  float s = 1.0;
  float d = 0.0;
  vec2  R = iResolution;
  vec2  m = vec2(0.0);

  vec3 o = vec3(0.0, 0.0, -7.0);
  vec3 u = normalize(vec3((U - 0.5 * R) / R.y, focalLength));
  vec3 k = vec3(0.0);
  vec3 p;

  float t1 = t * 0.7;
  float t2 = t * 0.9;
  float tSpeed1 = t * speed1;
  float tSpeed2 = t * speed2 * dir2;

  for (int step = 0; step < MAX_STEPS; ++step) {
    p = o + u * d;
    p.x  -= 15.0;

    float px = p.x;
    float wob1 = bend1 + bendAdj1 + sin(t1 + px * 0.8) * 0.1;
    float wob2 = bend2 + bendAdj2 + cos(t2 + px * 1.1) * 0.1;

    float px2 = px + pi_2;
    vec2 baseOffset = vec2(px, px2);
    vec2 sinOffset  = sin(baseOffset + tSpeed1) * wob1;
    vec2 cosOffset  = cos(baseOffset + tSpeed2) * wob2;

    vec2 yz = p.yz;
    float wSin = length(yz - sinOffset) - lt;
    float wCos = length(yz - cosOffset) - lt;

    k.x = max(px + lt, wSin);
    k.y = max(px + lt, wCos);

    float current = min(k.x, k.y);
    s = min(s, current);
    if (s < 0.001 || d > 400.0) break;
    d += s * 0.7;
  }

  vec3 c = max(cos(d * pi2) - s * sqrt(d) - k, 0.0);
  c.gb += 0.1;

  vec3 vueGreen = vec3(0.259, 0.722, 0.514);  // #42B883
  vec3 vueDark = vec3(0.208, 0.286, 0.369);   // #35495e
  
  vec3 finalColor = vec3(0.0);
  if (k.x < k.y) {
    finalColor = vueGreen * c.x;
  } else {
    finalColor = vueDark * c.y;
  }
  
  float intensity = max(finalColor.r, max(finalColor.g, finalColor.b));
  if (intensity < 0.15) discard;
  finalColor = finalColor * 0.4 + finalColor.brg * 0.6 + finalColor * finalColor;
  C = vec4(clamp(finalColor, 0.0, 1.0), uOpacity);
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

interface AnimationConfig {
  xOffset: number;
  yOffset: number;
  rotationDeg: number;
  focalLength: number;
  speed1: number;
  speed2: number;
  dir2: number;
  bend1: number;
  bend2: number;
  fadeInDuration: number;
}

const props = withDefaults(defineProps<Partial<AnimationConfig>>(), {
  xOffset: 0,
  yOffset: 0,
  rotationDeg: 0,
  focalLength: 1,
  speed1: 0.1,
  speed2: 0.1,
  dir2: 1.0,
  bend1: 0.9,
  bend2: 0.6,
  fadeInDuration: 2000
});

const isMobile = ref(false);
const isVisible = ref(true);
const containerRef = ref<HTMLElement | null>(null);
const uniformOffset = ref(new Float32Array([props.xOffset, props.yOffset]));
const uniformResolution = ref(new Float32Array([1, 1]));
const rendererRef = ref<Renderer | null>(null);
const fadeStartTime = ref<number | null>(null);
const lastTimeRef = ref(0);
const pausedTimeRef = ref(0);

const propsRef = ref({
  xOffset: props.xOffset,
  yOffset: props.yOffset,
  rotationDeg: props.rotationDeg,
  focalLength: props.focalLength,
  speed1: props.speed1,
  speed2: props.speed2,
  dir2: props.dir2,
  bend1: props.bend1,
  bend2: props.bend2,
  fadeInDuration: props.fadeInDuration
});
propsRef.value = {
  xOffset: props.xOffset,
  yOffset: props.yOffset,
  rotationDeg: props.rotationDeg,
  focalLength: props.focalLength,
  speed1: props.speed1,
  speed2: props.speed2,
  dir2: props.dir2,
  bend1: props.bend1,
  bend2: props.bend2,
  fadeInDuration: props.fadeInDuration
};

let removeResizeListener: (() => void) | null = null;
let removeObserver: (() => void) | null = null;

const handleResize = () => {
  const checkIsMobile = () => {
    isMobile.value = window.innerWidth <= 768;
  };

  checkIsMobile();
  window.addEventListener('resize', checkIsMobile);

  removeResizeListener = () => {
    window.removeEventListener('resize', checkIsMobile);
  };
};

const handleObserver = () => {
  if (!containerRef.value || isMobile) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      isVisible.value = entry.isIntersecting;
    },
    {
      rootMargin: '50px',
      threshold: 0.1
    }
  );

  observer.observe(containerRef.value);

  removeObserver = () => observer.disconnect();
};

onMounted(() => {
  handleResize();
  handleObserver();
});

onUnmounted(() => {
  removeResizeListener?.();
  removeObserver?.();
});

watch(
  isMobile,
  () => {
    handleObserver();
  },
  {
    deep: true
  }
);

let cleanup: (() => void) | null = null;

const setup = () => {
  if (isMobile.value) {
    return;
  }

  const renderer = new Renderer({
    alpha: true,
    dpr: Math.min(window.devicePixelRatio, 1),
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: 'high-performance'
  });
  rendererRef.value = renderer;

  const gl = renderer.gl;
  gl.clearColor(0, 0, 0, 0);
  if (containerRef.value) {
    containerRef.value.appendChild(gl.canvas);
  }

  const camera = new Camera(gl);
  const scene = new Transform();

  const geometry = new Geometry(gl, {
    position: { size: 2, data: new Float32Array([-1, -1, 3, -1, -1, 3]) }
  });

  const program = new Program(gl, {
    vertex,
    fragment,
    uniforms: {
      iTime: { value: 0 },
      iResolution: { value: uniformResolution.value },
      uOffset: { value: uniformOffset.value },
      uRotation: { value: 0 },
      focalLength: { value: props.focalLength },
      speed1: { value: props.speed1 },
      speed2: { value: props.speed2 },
      dir2: { value: props.dir2 },
      bend1: { value: props.bend1 },
      bend2: { value: props.bend2 },
      bendAdj1: { value: 0 },
      bendAdj2: { value: 0 },
      uOpacity: { value: 0 }
    }
  });
  new Mesh(gl, { geometry, program }).setParent(scene);

  const resize = () => {
    const { width, height } = containerRef.value?.getBoundingClientRect() || { width: 0, height: 0 };
    renderer.setSize(width, height);
    uniformResolution.value[0] = width * renderer.dpr;
    uniformResolution.value[1] = height * renderer.dpr;
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.clear(gl.COLOR_BUFFER_BIT);
  };
  resize();
  const ro = new ResizeObserver(resize);
  if (containerRef.value) {
    ro.observe(containerRef.value);
  }

  let rafId: number;

  const loop = (now: number) => {
    const {
      xOffset: xOff,
      yOffset: yOff,
      rotationDeg: rot,
      focalLength: fLen,
      fadeInDuration: fadeDur
    } = propsRef.value;

    if (isVisible.value) {
      if (lastTimeRef.value === 0) {
        lastTimeRef.value = now - pausedTimeRef.value;
      }

      const t = (now - lastTimeRef.value) * 0.001;

      if (fadeStartTime.value === null && t > 0.1) {
        fadeStartTime.value = now;
      }

      let opacity = 0;
      if (fadeStartTime.value !== null) {
        const fadeElapsed = now - fadeStartTime.value;
        opacity = Math.min(fadeElapsed / fadeDur, 1);
        opacity = 1 - Math.pow(1 - opacity, 3);
      }

      uniformOffset.value[0] = xOff;
      uniformOffset.value[1] = yOff;

      program.uniforms.iTime.value = t;
      program.uniforms.uRotation.value = (rot * Math.PI) / 180;
      program.uniforms.focalLength.value = fLen;
      program.uniforms.uOpacity.value = opacity;

      renderer.render({ scene, camera });
    } else {
      if (lastTimeRef.value !== 0) {
        pausedTimeRef.value = now - lastTimeRef.value;
        lastTimeRef.value = 0;
      }
    }

    rafId = requestAnimationFrame(loop);
  };
  rafId = requestAnimationFrame(loop);

  cleanup = () => {
    cancelAnimationFrame(rafId);
    ro.disconnect();
    renderer.gl.canvas.remove();
  };
};

onMounted(() => {
  setup();
});

onBeforeUnmount(() => {
  cleanup?.();
});

watch(
  () => [isMobile, isVisible],
  () => {
    cleanup?.();
    setup();
  },
  {
    deep: true
  }
);
</script>

<template>
  <div
    v-if="!isMobile"
    ref="containerRef"
    :style="{
      position: 'absolute',
      inset: 0,
      overflow: 'hidden',
      width: '100vw',
      height: '100vh'
    }"
  >
    <div
      :style="{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '200px',
        background: 'linear-gradient(to top, #0b0b0b 20%, transparent)',
        pointerEvents: 'none',
        zIndex: 1
      }"
    />
  </div>
</template>
