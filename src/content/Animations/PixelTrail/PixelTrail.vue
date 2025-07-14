<template>
  <div class="pixel-container">
    <svg v-if="gooeyFilter" class="goo-filter-container">
      <defs>
        <filter :id="gooeyFilter.id">
          <feGaussianBlur in="SourceGraphic" :stdDeviation="gooeyFilter.strength" result="blur" />
          <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </defs>
    </svg>
    <canvas
      ref="canvasRef"
      class="pixel-canvas"
      :style="gooeyFilter ? { filter: `url(#${gooeyFilter.id})` } : undefined"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';
import * as THREE from 'three';

interface PixelTrailProps {
  gridSize?: number;
  trailSize?: number;
  maxAge?: number;
  interpolate?: number;
  easingFunction?: (x: number) => number;
  gooeyFilter?: { id: string; strength: number };
  color?: string;
  className?: string;
  canvasProps?: Record<string, unknown>;
  glProps?: WebGLContextAttributes & { powerPreference?: string };
}

const props = withDefaults(defineProps<PixelTrailProps>(), {
  gridSize: 40,
  trailSize: 0.1,
  maxAge: 250,
  interpolate: 5,
  easingFunction: (x: number) => x,
  color: '#ffffff',
  className: '',
  canvasProps: () => ({}),
  glProps: () => ({
    antialias: false,
    powerPreference: 'high-performance',
    alpha: true
  })
});

const canvasRef = ref<HTMLCanvasElement>();

// Three.js variables
let renderer: THREE.WebGLRenderer;
let scene: THREE.Scene;
let camera: THREE.OrthographicCamera;
let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;
let trailRenderTargetA: THREE.WebGLRenderTarget;
let trailRenderTargetB: THREE.WebGLRenderTarget;
let currentTarget: THREE.WebGLRenderTarget;
let previousTarget: THREE.WebGLRenderTarget;
let trailScene: THREE.Scene;
let trailCamera: THREE.OrthographicCamera;
let trailMesh: THREE.Mesh;
let trailMaterial: THREE.ShaderMaterial;
let animationFrameId: number;

// Mouse tracking
const mouse = ref(new THREE.Vector2(-1, -1));
const prevMouse = ref(new THREE.Vector2(-1, -1));

// Create dot material for main scene
const createDotMaterial = () => {
  return new THREE.ShaderMaterial({
    uniforms: {
      resolution: { value: new THREE.Vector2() },
      mouseTrail: { value: null },
      gridSize: { value: props.gridSize },
      pixelColor: { value: new THREE.Color(props.color) }
    },
    vertexShader: `
      void main() {
        gl_Position = vec4(position.xy, 0.0, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec2 resolution;
      uniform sampler2D mouseTrail;
      uniform float gridSize;
      uniform vec3 pixelColor;

      vec2 coverUv(vec2 uv) {
        vec2 s = resolution.xy / max(resolution.x, resolution.y);
        vec2 newUv = (uv - 0.5) * s + 0.5;
        return clamp(newUv, 0.0, 1.0);
      }

      void main() {
        vec2 screenUv = gl_FragCoord.xy / resolution;
        vec2 uv = coverUv(screenUv);

        // Grid calculations for pixel effect
        vec2 gridUv = uv * gridSize;
        vec2 gridId = floor(gridUv);

        // Sample trail at exact grid center
        vec2 gridCenter = (gridId + 0.5) / gridSize;
        float trail = texture2D(mouseTrail, gridCenter).r;

        // Create square pixels that fill almost the entire grid cell
        vec2 gridUvFract = fract(gridUv);

        // Create a square pixel with very thin border (99% fill)
        vec2 pixelBounds = smoothstep(0.005, 0.01, gridUvFract) *
                          smoothstep(0.005, 0.01, 1.0 - gridUvFract);
        float pixelMask = pixelBounds.x * pixelBounds.y;

        // Combine pixel shape with trail intensity
        float alpha = trail * pixelMask;

        gl_FragColor = vec4(pixelColor * alpha, alpha);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending
  });
};

// Create trail material for texture generation - FIXED VERSION
const createTrailMaterial = () => {
  return new THREE.ShaderMaterial({
    uniforms: {
      previousFrame: { value: null },
      mousePos: { value: new THREE.Vector2(-1, -1) },
      prevMousePos: { value: new THREE.Vector2(-1, -1) },
      radius: { value: props.trailSize },
      decay: { value: Math.pow(0.95, 60 / props.maxAge) },
      gridSize: { value: props.gridSize },
      resolution: { value: new THREE.Vector2() }
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D previousFrame;
      uniform vec2 mousePos;
      uniform vec2 prevMousePos;
      uniform float radius;
      uniform float decay;
      uniform float gridSize;
      uniform vec2 resolution;
      varying vec2 vUv;

      vec2 coverUv(vec2 uv) {
        vec2 s = resolution.xy / max(resolution.x, resolution.y);
        vec2 newUv = (uv - 0.5) * s + 0.5;
        return clamp(newUv, 0.0, 1.0);
      }

      void main() {
        // Decay previous frame
        vec4 prev = texture2D(previousFrame, vUv) * decay;

        // Use EXACT same coordinate system as main shader
        vec2 fragCoord = vUv * resolution;
        vec2 screenUv = fragCoord / resolution;
        vec2 transformedUv = coverUv(screenUv);

        // Mouse coordinates are already in screen space, apply same transform
        vec2 transformedMousePos = coverUv(mousePos);

        // Convert to grid coordinates - identical to main shader
        vec2 gridUv = transformedUv * gridSize;
        vec2 currentGridId = floor(gridUv);

        // Mouse grid coordinates
        vec2 mouseGridUv = transformedMousePos * gridSize;
        vec2 mouseGridId = floor(mouseGridUv);

        float influence = 0.0;

        // Only highlight the EXACT grid cell the mouse is currently over
        if (currentGridId == mouseGridId && mousePos.x >= 0.0 && mousePos.y >= 0.0) {
          influence = 1.0;
        }

        // Combine with previous frame
        float newTrail = max(prev.r, influence);

        gl_FragColor = vec4(newTrail, newTrail, newTrail, 1.0);
      }
    `
  });
};

const initThreeJS = () => {
  if (!canvasRef.value) return;

  const canvas = canvasRef.value;

  // Renderer setup
  renderer = new THREE.WebGLRenderer({
    canvas,
    ...props.glProps
  });

  const updateSize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const resolution = new THREE.Vector2(width * renderer.getPixelRatio(), height * renderer.getPixelRatio());

    if (material) {
      material.uniforms.resolution.value.copy(resolution);
    }

    if (trailMaterial) {
      trailMaterial.uniforms.resolution.value.copy(resolution);
    }
  };

  updateSize();

  // Create TWO trail render targets for ping-pong
  const renderTargetOptions = {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    wrapS: THREE.ClampToEdgeWrapping,
    wrapT: THREE.ClampToEdgeWrapping,
    format: THREE.RGBAFormat,
    type: THREE.UnsignedByteType,
    generateMipmaps: false,
    depthBuffer: false,
    stencilBuffer: false
  };

  const trailRes = 512;
  trailRenderTargetA = new THREE.WebGLRenderTarget(trailRes, trailRes, renderTargetOptions);
  trailRenderTargetB = new THREE.WebGLRenderTarget(trailRes, trailRes, renderTargetOptions);

  // Initialize ping-pong targets
  currentTarget = trailRenderTargetA;
  previousTarget = trailRenderTargetB;

  // Clear both targets initially
  renderer.setRenderTarget(trailRenderTargetA);
  renderer.clear();
  renderer.setRenderTarget(trailRenderTargetB);
  renderer.clear();
  renderer.setRenderTarget(null);

  // Trail scene setup
  trailScene = new THREE.Scene();
  trailCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  const trailGeometry = new THREE.PlaneGeometry(2, 2);
  trailMaterial = createTrailMaterial();
  trailMaterial.uniforms.previousFrame.value = previousTarget.texture;
  trailMaterial.uniforms.gridSize.value = props.gridSize;
  trailMaterial.uniforms.resolution.value.set(
    window.innerWidth * renderer.getPixelRatio(),
    window.innerHeight * renderer.getPixelRatio()
  );
  trailMesh = new THREE.Mesh(trailGeometry, trailMaterial);
  trailScene.add(trailMesh);

  // Main scene setup
  scene = new THREE.Scene();
  camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  const geometry = new THREE.PlaneGeometry(2, 2);
  material = createDotMaterial();
  material.uniforms.mouseTrail.value = currentTarget.texture;

  const scale = Math.max(window.innerWidth, window.innerHeight) / 2;

  mesh = new THREE.Mesh(geometry, material);
  mesh.scale.set(scale, scale, 1);
  scene.add(mesh);

  updateSize(); // Set initial resolution

  // Event listeners
  canvas.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('pointerenter', onPointerEnter);
  canvas.addEventListener('pointerleave', onPointerLeave);
  window.addEventListener('resize', updateSize);

  // Start animation loop
  animate();
};

const onPointerMove = (event: PointerEvent) => {
  const rect = canvasRef.value?.getBoundingClientRect();
  if (!rect) return;

  // Store previous mouse position before updating
  prevMouse.value.copy(mouse.value);

  // Calculate normalized coordinates (0 to 1)
  const x = (event.clientX - rect.left) / rect.width;
  const y = 1.0 - (event.clientY - rect.top) / rect.height; // Flip Y

  mouse.value.set(x, y);

  // Update trail material uniforms immediately for smooth tracking
  if (trailMaterial) {
    trailMaterial.uniforms.mousePos.value.copy(mouse.value);
    trailMaterial.uniforms.prevMousePos.value.copy(prevMouse.value);
  }
};

const onPointerEnter = (event: PointerEvent) => {
  const rect = canvasRef.value?.getBoundingClientRect();
  if (!rect) return;

  const x = (event.clientX - rect.left) / rect.width;
  const y = 1.0 - (event.clientY - rect.top) / rect.height;

  // Initialize both current and previous to same position to avoid jumps
  mouse.value.set(x, y);
  prevMouse.value.set(x, y);

  if (trailMaterial) {
    trailMaterial.uniforms.mousePos.value.copy(mouse.value);
    trailMaterial.uniforms.prevMousePos.value.copy(prevMouse.value);
  }
};

const onPointerLeave = () => {
  // Reset mouse positions to avoid trails when re-entering
  mouse.value.set(-1, -1);
  prevMouse.value.set(-1, -1);
};

const animate = () => {
  if (!renderer || !trailScene || !trailCamera || !scene || !camera) return;

  // Update trail material to read from previous frame
  trailMaterial.uniforms.previousFrame.value = previousTarget.texture;

  // Render trail to current target (ping-pong)
  renderer.setRenderTarget(currentTarget);
  renderer.render(trailScene, trailCamera);

  // Update main material to use the newly rendered trail
  material.uniforms.mouseTrail.value = currentTarget.texture;

  // Render main scene to screen
  renderer.setRenderTarget(null);
  renderer.render(scene, camera);

  // Swap targets for next frame (ping-pong)
  const temp = currentTarget;
  currentTarget = previousTarget;
  previousTarget = temp;

  animationFrameId = requestAnimationFrame(animate);
};

const cleanup = () => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }

  if (canvasRef.value) {
    canvasRef.value.removeEventListener('pointermove', onPointerMove);
    canvasRef.value.removeEventListener('pointerenter', onPointerEnter);
    canvasRef.value.removeEventListener('pointerleave', onPointerLeave);
  }

  window.removeEventListener('resize', () => {});

  if (renderer) {
    renderer.dispose();
  }

  if (material) {
    material.dispose();
  }

  if (trailMaterial) {
    trailMaterial.dispose();
  }

  if (trailRenderTargetA) {
    trailRenderTargetA.dispose();
  }

  if (trailRenderTargetB) {
    trailRenderTargetB.dispose();
  }
};

// Watch for prop changes
watch(
  () => props.color,
  newColor => {
    if (material) {
      material.uniforms.pixelColor.value.set(newColor);
    }
  }
);

watch(
  () => props.gridSize,
  newGridSize => {
    if (material) {
      material.uniforms.gridSize.value = newGridSize;
    }
    if (trailMaterial) {
      trailMaterial.uniforms.gridSize.value = newGridSize;
    }

    // Update render target resolution to match new grid size
    if (trailRenderTargetA && trailRenderTargetB) {
      const newTrailRes = newGridSize * 4;
      trailRenderTargetA.setSize(newTrailRes, newTrailRes);
      trailRenderTargetB.setSize(newTrailRes, newTrailRes);
    }
  }
);

watch(
  () => props.trailSize,
  newTrailSize => {
    if (trailMaterial) {
      trailMaterial.uniforms.radius.value = newTrailSize;
    }
  }
);

watch(
  () => props.maxAge,
  newMaxAge => {
    if (trailMaterial) {
      trailMaterial.uniforms.decay.value = Math.pow(0.95, 60 / newMaxAge);
    }
  }
);

onMounted(() => {
  initThreeJS();
});

onUnmounted(() => {
  cleanup();
});
</script>
