<template>
  <div
    v-if="webGLSupported"
    ref="containerRef"
    :class="`w-full h-full absolute top-0 left-0 ${props.className ?? ''}`"
    :style="{ mixBlendMode: props.mixBlendMode }"
  />
  <div
    v-else
    :class="`w-full h-full absolute top-0 left-0 flex items-center justify-center bg-black/10 text-gray-500 text-sm ${props.className ?? ''}`"
    :style="{ mixBlendMode: props.mixBlendMode }"
  >
    WebGL not supported
  </div>
</template>

<script setup lang="ts">
import * as THREE from 'three';
import { onMounted, ref, watch, type CSSProperties } from 'vue';

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
  quality?: 'low' | 'medium' | 'high';
}

const props = withDefaults(defineProps<LightPillarProps>(), {
  topColor: '#5227FF',
  bottomColor: '#FF9FFC',
  intensity: 1.0,
  rotationSpeed: 0.3,
  interactive: false,
  className: '',
  glowAmount: 0.005,
  pillarWidth: 3.0,
  pillarHeight: 0.4,
  noiseIntensity: 0.5,
  mixBlendMode: 'screen',
  pillarRotation: 0,
  quality: 'high'
});

const containerRef = ref<HTMLDivElement | null>(null);
const webGLSupported = ref(true);

let rafId: number | null = null;
let renderer: THREE.WebGLRenderer | null = null;
let material: THREE.ShaderMaterial | null = null;
let scene: THREE.Scene | null = null;
let camera: THREE.OrthographicCamera | null = null;
let geometry: THREE.PlaneGeometry | null = null;
let currentMouseHandler: ((e: MouseEvent) => void) | null = null;
let cleanupResize: (() => void) | null = null;

const mouse = new THREE.Vector2(0, 0);
let timeVal = 0;
let rotationSpeedVal = props.rotationSpeed;

function parseColor(hex: string): THREE.Vector3 {
  const color = new THREE.Color(hex);
  return new THREE.Vector3(color.r, color.g, color.b);
}

function teardown() {
  if (rafId) cancelAnimationFrame(rafId);
  cleanupResize?.();
  const container = containerRef.value;
  if (container && currentMouseHandler) {
    container.removeEventListener('mousemove', currentMouseHandler);
  }
  if (renderer) {
    renderer.dispose();
    renderer.forceContextLoss();
    if (container && renderer.domElement && container.contains(renderer.domElement)) {
      container.removeChild(renderer.domElement);
    }
  }
  material?.dispose();
  geometry?.dispose();
  renderer = null;
  material = null;
  scene = null;
  camera = null;
  geometry = null;
  rafId = null;
  currentMouseHandler = null;
  cleanupResize = null;
}

function initScene() {
  const container = containerRef.value;
  if (!container) return;

  const width = container.clientWidth;
  const height = container.clientHeight;

  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isLowEndDevice = isMobile || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);

  let effectiveQuality = props.quality;
  if (isLowEndDevice && props.quality === 'high') effectiveQuality = 'medium';
  if (isMobile && props.quality !== 'low') effectiveQuality = 'low';

  const qualitySettings = {
    low: { iterations: 24, waveIterations: 1, pixelRatio: 0.5, precision: 'mediump', stepMultiplier: 1.5 },
    medium: { iterations: 40, waveIterations: 2, pixelRatio: 0.65, precision: 'mediump', stepMultiplier: 1.2 },
    high: {
      iterations: 80,
      waveIterations: 4,
      pixelRatio: Math.min(window.devicePixelRatio, 2),
      precision: 'highp',
      stepMultiplier: 1.0
    }
  };

  const settings = qualitySettings[effectiveQuality] || qualitySettings.medium;

  scene = new THREE.Scene();
  camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  try {
    renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
      powerPreference: effectiveQuality === 'low' ? 'low-power' : 'high-performance',
      precision: settings.precision as WebGLPowerPreference,
      stencil: false,
      depth: false
    });
  } catch (e) {
    console.error('Failed to create WebGL renderer:', e);
    webGLSupported.value = false;
    return;
  }

  renderer.setSize(width, height);
  renderer.setPixelRatio(settings.pixelRatio);
  container.appendChild(renderer.domElement);

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
    uniform float uRotCos;
    uniform float uRotSin;
    uniform float uPillarRotCos;
    uniform float uPillarRotSin;
    uniform float uWaveSin[4];
    uniform float uWaveCos[4];
    varying vec2 vUv;

    const float PI = 3.141592653589793;
    const float EPSILON = 0.001;
    const float E = 2.71828182845904523536;

    float noise(vec2 coord) {
      vec2 r = (E * sin(E * coord));
      return fract(r.x * r.y * (1.0 + coord.x));
    }

    void main() {
      vec2 fragCoord = vUv * uResolution;
      vec2 uv = (fragCoord * 2.0 - uResolution) / uResolution.y;

      uv = vec2(
        uv.x * uPillarRotCos - uv.y * uPillarRotSin,
        uv.x * uPillarRotSin + uv.y * uPillarRotCos
      );

      vec3 origin = vec3(0.0, 0.0, -10.0);
      vec3 direction = normalize(vec3(uv, 1.0));

      float maxDepth = 50.0;
      float depth = 0.1;

      float rotCos = uRotCos;
      float rotSin = uRotSin;
      if(uInteractive && length(uMouse) > 0.0) {
        float mouseAngle = uMouse.x * PI * 2.0;
        rotCos = cos(mouseAngle);
        rotSin = sin(mouseAngle);
      }

      vec3 color = vec3(0.0);

      const int ITERATIONS = ${settings.iterations};
      const int WAVE_ITERATIONS = ${settings.waveIterations};
      const float STEP_MULT = ${settings.stepMultiplier.toFixed(1)};

      for(int i = 0; i < ITERATIONS; i++) {
        vec3 pos = origin + direction * depth;

        float newX = pos.x * rotCos - pos.z * rotSin;
        float newZ = pos.x * rotSin + pos.z * rotCos;
        pos.x = newX;
        pos.z = newZ;

        vec3 deformed = pos;
        deformed.y *= uPillarHeight;
        deformed = deformed + vec3(0.0, uTime, 0.0);

        float frequency = 1.0;
        float amplitude = 1.0;
        for(int j = 0; j < WAVE_ITERATIONS; j++) {
          float wx = deformed.x * uWaveCos[j] - deformed.z * uWaveSin[j];
          float wz = deformed.x * uWaveSin[j] + deformed.z * uWaveCos[j];
          deformed.x = wx;
          deformed.z = wz;

          float phase = uTime * float(j) * 2.0;
          vec3 oscillation = cos(deformed.zxy * frequency - phase);
          deformed += oscillation * amplitude;
          frequency *= 2.0;
          amplitude *= 0.5;
        }

        vec2 cosinePair = cos(deformed.xz);
        float fieldDistance = length(cosinePair) - 0.2;

        float radialBound = length(pos.xz) - uPillarWidth;
        float k = 4.0;
        float h = max(k - abs(-radialBound - (-fieldDistance)), 0.0);
        fieldDistance = -(min(-radialBound, -fieldDistance) - h * h * 0.25 / k);

        fieldDistance = abs(fieldDistance) * 0.15 + 0.01;

        vec3 gradient = mix(uBottomColor, uTopColor, smoothstep(15.0, -15.0, pos.y));
        color += gradient / fieldDistance;

        if(fieldDistance < EPSILON || depth > maxDepth) break;
        depth += fieldDistance * STEP_MULT;
      }

      float widthNormalization = uPillarWidth / 3.0;
      color = tanh(color * uGlowAmount / widthNormalization);

      float rnd = noise(gl_FragCoord.xy);
      color -= rnd / 15.0 * uNoiseIntensity;

      gl_FragColor = vec4(color * uIntensity, 1.0);
    }
  `;

  const waveAngle = 0.4;
  const waveSinValues = new Float32Array(4);
  const waveCosValues = new Float32Array(4);
  for (let i = 0; i < 4; i++) {
    waveSinValues[i] = Math.sin(waveAngle);
    waveCosValues[i] = Math.cos(waveAngle);
  }

  const pillarRotRad = (props.pillarRotation * Math.PI) / 180.0;

  material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(width, height) },
      uMouse: { value: mouse },
      uTopColor: { value: parseColor(props.topColor) },
      uBottomColor: { value: parseColor(props.bottomColor) },
      uIntensity: { value: props.intensity },
      uInteractive: { value: props.interactive },
      uGlowAmount: { value: props.glowAmount },
      uPillarWidth: { value: props.pillarWidth },
      uPillarHeight: { value: props.pillarHeight },
      uNoiseIntensity: { value: props.noiseIntensity },
      uPillarRotation: { value: props.pillarRotation },
      uRotCos: { value: 1.0 },
      uRotSin: { value: 0.0 },
      uPillarRotCos: { value: Math.cos(pillarRotRad) },
      uPillarRotSin: { value: Math.sin(pillarRotRad) },
      uWaveSin: { value: waveSinValues },
      uWaveCos: { value: waveCosValues }
    },
    transparent: true,
    depthWrite: false,
    depthTest: false
  });

  geometry = new THREE.PlaneGeometry(2, 2);
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  const handleMouseMove = (e: MouseEvent) => {
    if (!props.interactive) return;
    const rect = container.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    mouse.set(x, y);
  };

  currentMouseHandler = handleMouseMove;
  if (props.interactive) {
    container.addEventListener('mousemove', handleMouseMove, { passive: true });
  }

  let lastTime = performance.now();
  const targetFPS = effectiveQuality === 'low' ? 30 : 60;
  const frameTime = 1000 / targetFPS;

  const animate = (currentTime: number) => {
    if (!material || !renderer || !scene || !camera) return;
    const deltaTime = currentTime - lastTime;

    if (deltaTime >= frameTime) {
      timeVal += 0.016 * rotationSpeedVal;
      material.uniforms.uTime.value = timeVal;

      const rotAngle = timeVal * 0.3;
      material.uniforms.uRotCos.value = Math.cos(rotAngle);
      material.uniforms.uRotSin.value = Math.sin(rotAngle);

      renderer.render(scene, camera);
      lastTime = currentTime - (deltaTime % frameTime);
    }

    rafId = requestAnimationFrame(animate);
  };

  rafId = requestAnimationFrame(animate);

  let resizeTimeout: number | null = null;
  const handleResize = () => {
    if (resizeTimeout) clearTimeout(resizeTimeout);
    resizeTimeout = window.setTimeout(() => {
      if (!renderer || !material || !container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      (material.uniforms.uResolution.value as THREE.Vector2).set(w, h);
    }, 150);
  };

  window.addEventListener('resize', handleResize, { passive: true });

  cleanupResize = () => {
    window.removeEventListener('resize', handleResize);
    if (resizeTimeout) clearTimeout(resizeTimeout);
  };
}

onMounted(() => {
  const testCanvas = document.createElement('canvas');
  const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
  if (!gl) {
    webGLSupported.value = false;
    return;
  }
  initScene();
});

watch(
  () => props.quality,
  () => {
    teardown();
    initScene();
  }
);

watch(
  () => [
    props.rotationSpeed,
    props.topColor,
    props.bottomColor,
    props.intensity,
    props.interactive,
    props.glowAmount,
    props.pillarWidth,
    props.pillarHeight,
    props.noiseIntensity,
    props.pillarRotation
  ],
  ([speed, top, bottom, intensity, interactive, glow, pWidth, pHeight, noise, rotation]) => {
    rotationSpeedVal = speed as number;

    const container = containerRef.value;
    if (container && currentMouseHandler) {
      container.removeEventListener('mousemove', currentMouseHandler);
      if (interactive) {
        container.addEventListener('mousemove', currentMouseHandler, { passive: true });
      }
    }

    if (!material) return;
    material.uniforms.uTopColor.value = parseColor(top as string);
    material.uniforms.uBottomColor.value = parseColor(bottom as string);
    material.uniforms.uIntensity.value = intensity;
    material.uniforms.uInteractive.value = interactive;
    material.uniforms.uGlowAmount.value = glow;
    material.uniforms.uPillarWidth.value = pWidth;
    material.uniforms.uPillarHeight.value = pHeight;
    material.uniforms.uNoiseIntensity.value = noise;
    const rad = ((rotation as number) * Math.PI) / 180;
    material.uniforms.uPillarRotCos.value = Math.cos(rad);
    material.uniforms.uPillarRotSin.value = Math.sin(rad);
  }
);
</script>
