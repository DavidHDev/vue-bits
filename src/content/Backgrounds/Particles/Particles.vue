<template>
  <div ref="containerRef" :class="className" class="relative"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, useTemplateRef, nextTick } from 'vue';
import { Renderer, Camera, Geometry, Program, Mesh } from 'ogl';

interface ParticlesProps {
  particleCount?: number;
  particleSpread?: number;
  speed?: number;
  particleColors?: string[];
  moveParticlesOnHover?: boolean;
  particleHoverFactor?: number;
  alphaParticles?: boolean;
  particleBaseSize?: number;
  sizeRandomness?: number;
  cameraDistance?: number;
  disableRotation?: boolean;
  className?: string;
}

const props = withDefaults(defineProps<ParticlesProps>(), {
  particleCount: 200,
  particleSpread: 10,
  speed: 0.1,
  particleColors: () => ['#ffffff'],
  moveParticlesOnHover: false,
  particleHoverFactor: 1,
  alphaParticles: false,
  particleBaseSize: 100,
  sizeRandomness: 1,
  cameraDistance: 20,
  disableRotation: false,
  className: ''
});

const containerRef = useTemplateRef<HTMLDivElement>('containerRef');
const mouseRef = ref({ x: 0, y: 0 });

let renderer: Renderer | null = null;
let camera: Camera | null = null;
let particles: Mesh | null = null;
let program: Program | null = null;
let animationFrameId: number | null = null;
let lastTime = 0;
let elapsed = 0;

const defaultColors = ['#ffffff', '#ffffff', '#ffffff'];

const hexToRgb = (hex: string): [number, number, number] => {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) {
    hex = hex
      .split('')
      .map(c => c + c)
      .join('');
  }
  const int = parseInt(hex, 16);
  const r = ((int >> 16) & 255) / 255;
  const g = ((int >> 8) & 255) / 255;
  const b = (int & 255) / 255;
  return [r, g, b];
};

const vertex = /* glsl */ `
  attribute vec3 position;
  attribute vec4 random;
  attribute vec3 color;
  
  uniform mat4 modelMatrix;
  uniform mat4 viewMatrix;
  uniform mat4 projectionMatrix;
  uniform float uTime;
  uniform float uSpread;
  uniform float uBaseSize;
  uniform float uSizeRandomness;
  
  varying vec4 vRandom;
  varying vec3 vColor;
  
  void main() {
    vRandom = random;
    vColor = color;
    
    vec3 pos = position * uSpread;
    pos.z *= 10.0;
    
    vec4 mPos = modelMatrix * vec4(pos, 1.0);
    float t = uTime;
    mPos.x += sin(t * random.z + 6.28 * random.w) * mix(0.1, 1.5, random.x);
    mPos.y += sin(t * random.y + 6.28 * random.x) * mix(0.1, 1.5, random.w);
    mPos.z += sin(t * random.w + 6.28 * random.y) * mix(0.1, 1.5, random.z);
    
    vec4 mvPos = viewMatrix * mPos;
    gl_PointSize = (uBaseSize * (1.0 + uSizeRandomness * (random.x - 0.5))) / length(mvPos.xyz);
    gl_Position = projectionMatrix * mvPos;
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  
  uniform float uTime;
  uniform float uAlphaParticles;
  varying vec4 vRandom;
  varying vec3 vColor;
  
  void main() {
    vec2 uv = gl_PointCoord.xy;
    float d = length(uv - vec2(0.5));
    
    if(uAlphaParticles < 0.5) {
      if(d > 0.5) {
        discard;
      }
      gl_FragColor = vec4(vColor + 0.2 * sin(uv.yxx + uTime + vRandom.y * 6.28), 1.0);
    } else {
      float circle = smoothstep(0.5, 0.4, d) * 0.8;
      gl_FragColor = vec4(vColor + 0.2 * sin(uv.yxx + uTime + vRandom.y * 6.28), circle);
    }
  }
`;

const handleMouseMove = (e: MouseEvent) => {
  const container = containerRef.value;
  if (!container) return;

  const rect = container.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
  mouseRef.value = { x, y };
};

const initParticles = () => {
  const container = containerRef.value;
  if (!container) return;

  renderer = new Renderer({ depth: false, alpha: true });
  const gl = renderer.gl;
  container.appendChild(gl.canvas);
  gl.clearColor(0, 0, 0, 0);

  gl.canvas.style.width = '100%';
  gl.canvas.style.height = '100%';
  gl.canvas.style.display = 'block';
  gl.canvas.style.position = 'absolute';
  gl.canvas.style.top = '0';
  gl.canvas.style.left = '0';

  camera = new Camera(gl, { fov: 15 });
  camera.position.set(0, 0, props.cameraDistance);

  const resize = () => {
    if (!container) return;

    const parentWidth = container.parentElement?.offsetWidth || container.offsetWidth || window.innerWidth;
    const parentHeight = container.parentElement?.offsetHeight || container.offsetHeight || window.innerHeight;

    const width = Math.max(parentWidth, 300);
    const height = Math.max(parentHeight, 300);

    renderer!.setSize(width, height);
    camera!.perspective({ aspect: width / height });

    gl.canvas.style.width = '100%';
    gl.canvas.style.height = '100%';
    gl.canvas.style.display = 'block';
    gl.canvas.style.position = 'absolute';
    gl.canvas.style.top = '0';
    gl.canvas.style.left = '0';
  };
  window.addEventListener('resize', resize, false);
  resize();

  if (props.moveParticlesOnHover) {
    container.addEventListener('mousemove', handleMouseMove);
  }

  const count = props.particleCount;
  const positions = new Float32Array(count * 3);
  const randoms = new Float32Array(count * 4);
  const colors = new Float32Array(count * 3);
  const palette = props.particleColors && props.particleColors.length > 0 ? props.particleColors : defaultColors;

  for (let i = 0; i < count; i++) {
    let x: number, y: number, z: number, len: number;
    do {
      x = Math.random() * 2 - 1;
      y = Math.random() * 2 - 1;
      z = Math.random() * 2 - 1;
      len = x * x + y * y + z * z;
    } while (len > 1 || len === 0);
    const r = Math.cbrt(Math.random());
    positions.set([x * r, y * r, z * r], i * 3);
    randoms.set([Math.random(), Math.random(), Math.random(), Math.random()], i * 4);
    const col = hexToRgb(palette[Math.floor(Math.random() * palette.length)]);
    colors.set(col, i * 3);
  }

  const geometry = new Geometry(gl, {
    position: { size: 3, data: positions },
    random: { size: 4, data: randoms },
    color: { size: 3, data: colors }
  });

  program = new Program(gl, {
    vertex,
    fragment,
    uniforms: {
      uTime: { value: 0 },
      uSpread: { value: props.particleSpread },
      uBaseSize: { value: props.particleBaseSize },
      uSizeRandomness: { value: props.sizeRandomness },
      uAlphaParticles: { value: props.alphaParticles ? 1 : 0 }
    },
    transparent: true,
    depthTest: false
  });

  particles = new Mesh(gl, { mode: gl.POINTS, geometry, program });

  lastTime = performance.now();
  elapsed = 0;

  const update = (t: number) => {
    if (!animationFrameId) return;
    animationFrameId = requestAnimationFrame(update);
    const delta = t - lastTime;
    lastTime = t;
    elapsed += delta * props.speed;

    if (program) {
      program.uniforms.uTime.value = elapsed * 0.001;
      program.uniforms.uSpread.value = props.particleSpread;
      program.uniforms.uBaseSize.value = props.particleBaseSize;
      program.uniforms.uSizeRandomness.value = props.sizeRandomness;
      program.uniforms.uAlphaParticles.value = props.alphaParticles ? 1 : 0;
    }

    if (particles) {
      if (props.moveParticlesOnHover) {
        particles.position.x = -mouseRef.value.x * props.particleHoverFactor;
        particles.position.y = -mouseRef.value.y * props.particleHoverFactor;
      } else {
        particles.position.x = 0;
        particles.position.y = 0;
      }

      if (!props.disableRotation) {
        particles.rotation.x = Math.sin(elapsed * 0.0002) * 0.1;
        particles.rotation.y = Math.cos(elapsed * 0.0005) * 0.15;
        particles.rotation.z += 0.01 * props.speed;
      }
    }

    if (renderer && camera && particles) {
      renderer.render({ scene: particles, camera });
    }
  };

  animationFrameId = requestAnimationFrame(update);

  return () => {
    window.removeEventListener('resize', resize);
    if (props.moveParticlesOnHover) {
      container.removeEventListener('mousemove', handleMouseMove);
    }
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    if (container.contains(gl.canvas)) {
      container.removeChild(gl.canvas);
    }
  };
};

const cleanup = () => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
  if (renderer) {
    const container = containerRef.value;
    const gl = renderer.gl;
    if (container && gl.canvas.parentNode === container) {
      container.removeChild(gl.canvas);
    }
    gl.getExtension('WEBGL_lose_context')?.loseContext();
  }
  renderer = null;
  camera = null;
  particles = null;
  program = null;
};

// CHANGED onMounted
onMounted(async () => {
  await nextTick(); // wait for Vue to flush its DOM updates first
  initParticles(); 
});

onUnmounted(() => {
  cleanup();
});

watch(
  () => [props.particleCount, props.particleColors],
  () => {
    cleanup();
    initParticles();
  },
  { deep: true }
);

watch(
  () => [
    props.particleSpread,
    props.speed,
    props.particleBaseSize,
    props.sizeRandomness,
    props.alphaParticles,
    props.moveParticlesOnHover,
    props.particleHoverFactor,
    props.disableRotation
  ],
  () => {}
);
</script>

<style scoped>
div {
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
}

:deep(canvas) {
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
}
</style>
