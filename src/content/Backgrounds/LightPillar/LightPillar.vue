<script setup lang="ts">
import * as THREE from 'three';
import {
  onBeforeMount,
  onBeforeUnmount,
  onMounted,
  ref,
  shallowRef,
  useTemplateRef,
  watch,
  type CSSProperties
} from 'vue';

interface LightPillarProps {
  topColor?: string;
  bottomColor?: string;
  intensity?: number;
  rotationSpeed?: number;
  interactive?: boolean;
  className?: string;
  glowAmount?: number;
  pillarWidth?: number;
  pillarHeight?: number;
  noiseIntensity?: number;
  mixBlendMode?: CSSProperties['mixBlendMode'];
  pillarRotation?: number;
}

const props = withDefaults(defineProps<LightPillarProps>(), {
  topColor: '#48FF28',
  bottomColor: '#9EF19E',
  intensity: 1.0,
  rotationSpeed: 0.3,
  interactive: false,
  className: '',
  glowAmount: 0.005,
  pillarWidth: 3.0,
  pillarHeight: 0.4,
  noiseIntensity: 0.5,
  mixBlendMode: 'screen',
  pillarRotation: 0
});

const containerRef = useTemplateRef('containerRef');
const rafRef = ref<number | null>(null);
const rendererRef = shallowRef<THREE.WebGLRenderer | null>(null);
const materialRef = shallowRef<THREE.ShaderMaterial | null>(null);
const sceneRef = shallowRef<THREE.Scene | null>(null);
const cameraRef = shallowRef<THREE.OrthographicCamera | null>(null);
const geometryRef = shallowRef<THREE.PlaneGeometry | null>(null);
const mouseRef = ref<THREE.Vector2>(new THREE.Vector2(0, 0));
const timeRef = ref<number>(0);
const webGLSupported = ref<boolean>(true);

onBeforeMount(() => {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

  if (!gl) {
    webGLSupported.value = false;
    console.warn('WebGL is not supported in this browser');
  }

  canvas.remove();
});

let cleanup: (() => void) | null = null;
const setup = () => {
  if (!containerRef.value || !webGLSupported.value) return;

  const container = containerRef.value;
  const width = container.clientWidth;
  const height = container.clientHeight;

  // Scene setup
  const scene = new THREE.Scene();
  sceneRef.value = scene;
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  cameraRef.value = camera;

  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
      powerPreference: 'high-performance',
      precision: 'lowp',
      stencil: false,
      depth: false
    });
  } catch (error) {
    console.error('Failed to create WebGL renderer:', error);
    webGLSupported.value = false;
    return;
  }

  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);
  rendererRef.value = renderer;

  // Convert hex colors to RGB
  const parseColor = (hex: string): THREE.Vector3 => {
    const color = new THREE.Color(hex);
    return new THREE.Vector3(color.r, color.g, color.b);
  };

  // Shader material
  const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

  const fragmentShader = `
      uniform float uTime;
      uniform vec2 uResolution;
      uniform vec2 uMouse;
      uniform vec3 uTopColor;
      uniform vec3 uBottomColor;
      uniform float uIntensity;
      uniform bool uInteractive;
      uniform float uGlowAmount;
      uniform float uPillarWidth;
      uniform float uPillarHeight;
      uniform float uNoiseIntensity;
      uniform float uPillarRotation;
      varying vec2 vUv;

      const float PI = 3.141592653589793;
      const float EPSILON = 0.001;
      const float E = 2.71828182845904523536;
      const float HALF = 0.5;

      mat2 rot(float angle) {
        float s = sin(angle);
        float c = cos(angle);
        return mat2(c, -s, s, c);
      }

      // Procedural noise function
      float noise(vec2 coord) {
        float G = E;
        vec2 r = (G * sin(G * coord));
        return fract(r.x * r.y * (1.0 + coord.x));
      }

      // Apply layered wave deformation to position
      vec3 applyWaveDeformation(vec3 pos, float timeOffset) {
        float frequency = 1.0;
        float amplitude = 1.0;
        vec3 deformed = pos;

        for(float i = 0.0; i < 4.0; i++) {
          deformed.xz *= rot(0.4);
          float phase = timeOffset * i * 2.0;
          vec3 oscillation = cos(deformed.zxy * frequency - phase);
          deformed += oscillation * amplitude;
          frequency *= 2.0;
          amplitude *= HALF;
        }
        return deformed;
      }

      // Polynomial smooth blending between two values
      float blendMin(float a, float b, float k) {
        float scaledK = k * 4.0;
        float h = max(scaledK - abs(a - b), 0.0);
        return min(a, b) - h * h * 0.25 / scaledK;
      }

      float blendMax(float a, float b, float k) {
        return -blendMin(-a, -b, k);
      }

      void main() {
        vec2 fragCoord = vUv * uResolution;
        vec2 uv = (fragCoord * 2.0 - uResolution) / uResolution.y;

        // Apply 2D rotation to UV coordinates
        float rotAngle = uPillarRotation * PI / 180.0;
        uv *= rot(rotAngle);

        vec3 origin = vec3(0.0, 0.0, -10.0);
        vec3 direction = normalize(vec3(uv, 1.0));

        float maxDepth = 50.0;
        float depth = 0.1;

        mat2 rotX = rot(uTime * 0.3);
        if(uInteractive && length(uMouse) > 0.0) {
          rotX = rot(uMouse.x * PI * 2.0);
        }

        vec3 color = vec3(0.0);

        for(float i = 0.0; i < 100.0; i++) {
          vec3 pos = origin + direction * depth;
          pos.xz *= rotX;

          // Apply vertical scaling and wave deformation
          vec3 deformed = pos;
          deformed.y *= uPillarHeight;
          deformed = applyWaveDeformation(deformed + vec3(0.0, uTime, 0.0), uTime);

          // Calculate distance field using cosine pattern
          vec2 cosinePair = cos(deformed.xz);
          float fieldDistance = length(cosinePair) - 0.2;

          // Radial boundary constraint
          float radialBound = length(pos.xz) - uPillarWidth;
          fieldDistance = blendMax(radialBound, fieldDistance, 1.0);
          fieldDistance = abs(fieldDistance) * 0.15 + 0.01;

          vec3 gradient = mix(uBottomColor, uTopColor, smoothstep(15.0, -15.0, pos.y));
          color += gradient * pow(1.0 / fieldDistance, 1.0);

          if(fieldDistance < EPSILON || depth > maxDepth) break;
          depth += fieldDistance;
        }

        // Normalize by pillar width to maintain consistent glow regardless of size
        float widthNormalization = uPillarWidth / 3.0;
        color = tanh(color * uGlowAmount / widthNormalization);

        // Add noise postprocessing
        float rnd = noise(gl_FragCoord.xy);
        color -= rnd / 15.0 * uNoiseIntensity;

        gl_FragColor = vec4(color * uIntensity, 1.0);
      }
    `;

  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(width, height) },
      uMouse: { value: mouseRef.value },
      uTopColor: { value: parseColor(props.topColor) },
      uBottomColor: { value: parseColor(props.bottomColor) },
      uIntensity: { value: props.intensity },
      uInteractive: { value: props.interactive },
      uGlowAmount: { value: props.glowAmount },
      uPillarWidth: { value: props.pillarWidth },
      uPillarHeight: { value: props.pillarHeight },
      uNoiseIntensity: { value: props.noiseIntensity },
      uPillarRotation: { value: props.pillarRotation }
    },
    transparent: true,
    depthWrite: false,
    depthTest: false
  });
  materialRef.value = material;

  const geometry = new THREE.PlaneGeometry(2, 2);
  geometryRef.value = geometry;
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // Mouse interaction - throttled for performance
  let mouseMoveTimeout: number | null = null;
  const handleMouseMove = (event: MouseEvent) => {
    if (!props.interactive) return;

    if (mouseMoveTimeout) return;

    mouseMoveTimeout = window.setTimeout(() => {
      mouseMoveTimeout = null;
    }, 16); // ~60fps throttle

    const rect = container.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    mouseRef.value.set(x, y);
  };

  if (props.interactive) {
    container.addEventListener('mousemove', handleMouseMove, { passive: true });
  }

  // Animation loop with fixed timestep
  let lastTime = performance.now();
  const targetFPS = 60;
  const frameTime = 1000 / targetFPS;

  const animate = (currentTime: number) => {
    if (!materialRef.value || !rendererRef.value || !sceneRef.value || !cameraRef.value) return;

    const deltaTime = currentTime - lastTime;

    if (deltaTime >= frameTime) {
      timeRef.value += 0.016 * props.rotationSpeed;
      materialRef.value.uniforms.uTime.value = timeRef.value;
      rendererRef.value.render(sceneRef.value, cameraRef.value);
      lastTime = currentTime - (deltaTime % frameTime);
    }

    rafRef.value = requestAnimationFrame(animate);
  };
  rafRef.value = requestAnimationFrame(animate);

  // Handle resize with debouncing
  let resizeTimeout: number | null = null;
  const handleResize = () => {
    if (resizeTimeout) {
      clearTimeout(resizeTimeout);
    }

    resizeTimeout = window.setTimeout(() => {
      if (!rendererRef.value || !materialRef.value || !containerRef.value) return;
      const newWidth = containerRef.value.clientWidth;
      const newHeight = containerRef.value.clientHeight;
      rendererRef.value.setSize(newWidth, newHeight);
      materialRef.value.uniforms.uResolution.value.set(newWidth, newHeight);
    }, 150);
  };

  window.addEventListener('resize', handleResize, { passive: true });

  // Cleanup
  cleanup = () => {
    window.removeEventListener('resize', handleResize);
    if (props.interactive) {
      container.removeEventListener('mousemove', handleMouseMove);
    }
    if (rafRef.value) {
      cancelAnimationFrame(rafRef.value);
    }
    if (rendererRef.value) {
      rendererRef.value.dispose();
      rendererRef.value.forceContextLoss();
      if (container.contains(rendererRef.value.domElement)) {
        container.removeChild(rendererRef.value.domElement);
      }
    }
    if (materialRef.value) {
      materialRef.value.dispose();
    }
    if (geometryRef.value) {
      geometryRef.value.dispose();
    }

    rendererRef.value = null;
    materialRef.value = null;
    sceneRef.value = null;
    cameraRef.value = null;
    geometryRef.value = null;
    rafRef.value = null;
  };
};

onMounted(() => {
  setup();
});

onBeforeUnmount(() => {
  cleanup?.();
});

watch(
  () => [
    props.topColor,
    props.bottomColor,
    props.intensity,
    props.rotationSpeed,
    props.interactive,
    props.glowAmount,
    props.pillarWidth,
    props.pillarHeight,
    props.noiseIntensity,
    props.pillarRotation,
    webGLSupported.value
  ],
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
    v-if="!webGLSupported"
    :class="`w-full h-full absolute top-0 left-0 flex items-center justify-center bg-black/10 text-gray-500 text-sm ${className}`"
    :style="{ mixBlendMode }"
  >
    WebGL not supported
  </div>
  <div
    v-else
    ref="containerRef"
    :class="`w-full h-full absolute top-0 left-0 ${className}`"
    :style="{ mixBlendMode }"
  />
</template>
