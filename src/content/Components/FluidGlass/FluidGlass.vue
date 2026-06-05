<template>
  <div
    ref="containerRef"
    :class="['fluid-glass', props.className]"
    @pointermove="handlePointerMove"
    @pointerleave="handlePointerLeave"
  >
    <div ref="stageRef" class="fluid-glass-stage"></div>
    <div class="fluid-glass-scroll-spacer" aria-hidden="true"></div>

    <div v-if="isBarMode" class="fluid-glass-nav">
      <button
        v-for="item in navItems"
        :key="item.label"
        type="button"
        class="fluid-glass-nav-item"
        @click="handleNavClick(item.link)"
      >
        {{ item.label }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, useTemplateRef, watch } from 'vue';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

type Mode = 'lens' | 'bar' | 'cube';

interface NavItem {
  label: string;
  link: string;
}

interface SharedModeProps {
  scale?: number;
  ior?: number;
  thickness?: number;
  transmission?: number;
  roughness?: number;
  anisotropy?: number;
  chromaticAberration?: number;
  color?: string;
  attenuationColor?: string;
  attenuationDistance?: number;
}

type LensProps = SharedModeProps;
type CubeProps = SharedModeProps;

interface BarProps extends SharedModeProps {
  navItems?: NavItem[];
}

interface FluidGlassProps {
  mode?: Mode;
  images?: string[];
  title?: string;
  lensProps?: LensProps;
  barProps?: BarProps;
  cubeProps?: CubeProps;
  className?: string;
  text?: string;
}

const props = withDefaults(defineProps<FluidGlassProps>(), {
  mode: 'lens',
  images: () => [
    '/assets/demo/cs1.webp',
    '/assets/demo/cs2.webp',
    '/assets/demo/cs3.webp',
    '/assets/demo/cs1.webp',
    '/assets/demo/cs2.webp'
  ],
  title: 'Vue Bits',
  lensProps: () => ({}),
  barProps: () => ({}),
  cubeProps: () => ({}),
  className: ''
});

const DEFAULT_NAV_ITEMS: NavItem[] = [
  { label: 'Home', link: '' },
  { label: 'About', link: '' },
  { label: 'Contact', link: '' }
];

const BAR_DEFAULTS: Required<Pick<SharedModeProps, 'transmission' | 'roughness' | 'thickness' | 'ior'>> & {
  color: string;
  attenuationColor: string;
  attenuationDistance: number;
} = {
  transmission: 1,
  roughness: 0,
  thickness: 10,
  ior: 1.15,
  color: '#ffffff',
  attenuationColor: '#ffffff',
  attenuationDistance: 0.25
};

const isBarMode = computed(() => props.mode === 'bar');
const navItems = computed(() => props.barProps?.navItems ?? DEFAULT_NAV_ITEMS);

const containerRef = useTemplateRef<HTMLDivElement>('containerRef');
const stageRef = useTemplateRef<HTMLDivElement>('stageRef');

let renderer: THREE.WebGLRenderer | null = null;
let scene: THREE.Scene | null = null;
let camera: THREE.PerspectiveCamera | null = null;
let resizeObserver: ResizeObserver | null = null;
let animationFrameId = 0;
let imagePlanes: THREE.Mesh[] = [];
let titleMesh: THREE.Mesh | null = null;
let glassMesh: THREE.Mesh | null = null;
let ambientLight: THREE.AmbientLight | null = null;
let keyLight: THREE.DirectionalLight | null = null;
let rimLight: THREE.PointLight | null = null;
let currentTitleTexture: THREE.CanvasTexture | null = null;

const pointer = { x: 0, y: 0 };
const objectPosition = { x: 0, y: 0 };
let scrollTarget = 0;
let scrollCurrent = 0;

const textureLoader = new THREE.TextureLoader();
const DEFAULT_IMAGE_COUNT = 5;

const resolveModeProps = (): SharedModeProps | BarProps => {
  if (props.mode === 'bar') {
    return { ...BAR_DEFAULTS, ...props.barProps };
  }
  if (props.mode === 'cube') {
    return props.cubeProps;
  }
  return props.lensProps;
};

const getVisibleSizeAtZ = (zWorld: number) => {
  if (!camera) {
    return { width: 1, height: 1 };
  }

  const distance = Math.abs(camera.position.z - zWorld);
  const vFov = THREE.MathUtils.degToRad(camera.fov);
  const height = 2 * Math.tan(vFov / 2) * distance;

  return {
    width: height * camera.aspect,
    height
  };
};

const createTitleTexture = (text: string) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) return null;

  canvas.width = 2048;
  canvas.height = 512;

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.font = '700 260px Inter, Arial, sans-serif';
  context.textAlign = 'center';
  context.textBaseline = 'middle';

  context.shadowColor = 'rgba(0, 0, 0, 0.35)';
  context.shadowBlur = 48;
  context.fillStyle = '#ffffff';
  context.fillText(text, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;

  return texture;
};

const createImagePlane = (asset: string) => {
  const texture = textureLoader.load(asset);
  texture.colorSpace = THREE.SRGBColorSpace;

  const geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
  const material = new THREE.MeshBasicMaterial({
    map: texture
  });

  return new THREE.Mesh(geometry, material);
};

const rebuildTitle = () => {
  if (!scene) return;

  if (titleMesh) {
    scene.remove(titleMesh);
    titleMesh.geometry.dispose();
    (titleMesh.material as THREE.MeshBasicMaterial).dispose();
    titleMesh = null;
  }

  if (currentTitleTexture) {
    currentTitleTexture.dispose();
    currentTitleTexture = null;
  }

  currentTitleTexture = createTitleTexture(props.title ?? 'Vue Bits');
  if (!currentTitleTexture) return;

  titleMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 0.25),
    new THREE.MeshBasicMaterial({
      map: currentTitleTexture,
      transparent: true
    })
  );

  titleMesh.renderOrder = 5;
  scene.add(titleMesh);
};

const rebuildGlassMesh = () => {
  if (!scene) return;

  if (glassMesh) {
    scene.remove(glassMesh);
    glassMesh.geometry.dispose();
    (glassMesh.material as THREE.MeshPhysicalMaterial).dispose();
    glassMesh = null;
  }

  let geometry: THREE.BufferGeometry;
  if (props.mode === 'lens') {
    geometry = new THREE.CylinderGeometry(0.62, 0.62, 0.28, 96, 1, false);
  } else if (props.mode === 'bar') {
    geometry = new RoundedBoxGeometry(1.12, 0.24, 0.64, 8, 0.12);
  } else {
    geometry = new RoundedBoxGeometry(0.82, 0.82, 0.82, 6, 0.16);
  }

  glassMesh = new THREE.Mesh(
    geometry,
    new THREE.MeshPhysicalMaterial({
      color: '#ffffff',
      roughness: 0,
      transmission: 1,
      thickness: props.mode === 'bar' ? 10 : 2,
      ior: 1.15,
      attenuationColor: '#ffffff',
      attenuationDistance: props.mode === 'bar' ? 0.25 : 0.8,
      transparent: true,
      metalness: 0,
      reflectivity: 0.45,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
      iridescence: 0.3,
      envMapIntensity: 1.2
    })
  );

  glassMesh.rotation.x = Math.PI / 2;
  glassMesh.position.z = 15;
  scene.add(glassMesh);
};

const updateLayout = () => {
  if (!camera || !titleMesh) return;

  const backgroundViewport = getVisibleSizeAtZ(0);
  const titleViewport = getVisibleSizeAtZ(12);

  const layout = [
    {
      x: -backgroundViewport.width * 0.28,
      y: backgroundViewport.height * 0.12,
      z: 0,
      width: backgroundViewport.width * 0.38,
      height: backgroundViewport.height * 0.9
    },
    {
      x: backgroundViewport.width * 0.28,
      y: backgroundViewport.height * 0.08,
      z: 3,
      width: backgroundViewport.width * 0.24,
      height: backgroundViewport.width * 0.24
    },
    {
      x: -backgroundViewport.width * 0.29,
      y: -backgroundViewport.height * 0.92,
      z: 6,
      width: backgroundViewport.width * 0.13,
      height: backgroundViewport.height * 0.42
    },
    {
      x: -backgroundViewport.width * 0.1,
      y: -backgroundViewport.height * 0.92,
      z: 9,
      width: backgroundViewport.width * 0.13,
      height: backgroundViewport.height * 0.3
    },
    {
      x: backgroundViewport.width * 0.14,
      y: -backgroundViewport.height * 0.92,
      z: 10.5,
      width: backgroundViewport.width * 0.19,
      height: backgroundViewport.width * 0.19
    }
  ];

  imagePlanes.forEach((plane, index) => {
    const item = layout[index];
    plane.position.set(item.x, item.y, item.z);
    plane.scale.set(item.width, item.height, 1);
    plane.userData.baseScale = { width: item.width, height: item.height };
  });

  titleMesh.position.set(0, backgroundViewport.height * 0.16, 12);
  titleMesh.scale.set(titleViewport.width * 0.62, titleViewport.width * 0.155, 1);
};

const applyRendererSize = () => {
  if (!renderer || !camera || !containerRef.value) return;

  const width = containerRef.value.clientWidth;
  const height = containerRef.value.clientHeight;
  if (width === 0 || height === 0) return;

  renderer.setSize(width, height, false);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  rebuildTitle();
  updateLayout();
};

const applyMaterialProps = () => {
  if (!glassMesh) return;

  const modeProps = resolveModeProps();
  const material = glassMesh.material as THREE.MeshPhysicalMaterial;
  const isBar = props.mode === 'bar';
  const normalizedScale = (modeProps.scale ?? 0.25) * 4;
  const chromaticAberration = modeProps.chromaticAberration ?? (isBar ? 0 : 0.05);

  material.ior = modeProps.ior ?? 1.15;
  material.thickness = modeProps.thickness ?? (isBar ? 10 : 2);
  material.transmission = modeProps.transmission ?? 1;
  material.roughness = modeProps.roughness ?? 0;
  material.color.set(modeProps.color ?? '#ffffff');
  material.attenuationColor = new THREE.Color(modeProps.attenuationColor ?? '#ffffff');
  material.attenuationDistance = modeProps.attenuationDistance ?? (isBar ? 0.25 : 0.8);
  material.iridescence = THREE.MathUtils.clamp(chromaticAberration * 5, 0, 1);
  material.iridescenceIOR = THREE.MathUtils.clamp((modeProps.anisotropy ?? 0.01) * 40 + 1, 1, 2.333);
  material.clearcoatRoughness = THREE.MathUtils.clamp((modeProps.anisotropy ?? 0.01) * 4, 0, 1);
  if (isBar) {
    glassMesh.scale.set(1, 1, 1);
  } else {
    glassMesh.scale.setScalar(normalizedScale);
  }
};

const updateScene = () => {
  if (!glassMesh || !camera || !titleMesh) return;

  const objectViewport = getVisibleSizeAtZ(15);
  const backgroundViewport = getVisibleSizeAtZ(0);

  scrollCurrent += (scrollTarget - scrollCurrent) * 0.08;
  objectPosition.x += (pointer.x - objectPosition.x) * 0.12;
  objectPosition.y += (pointer.y - objectPosition.y) * 0.12;

  imagePlanes.forEach((plane, index) => {
    const baseScale = plane.userData.baseScale as { width: number; height: number };
    const zoom =
      index <= 1
        ? 1 + Math.min(scrollCurrent / (1 / 3), 1) / 3
        : 1 + Math.min(Math.max((scrollCurrent - 1.15 / 3) / (1 / 3), 0), 1) / 2;

    plane.scale.set(baseScale.width * zoom, baseScale.height * zoom, 1);
    plane.rotation.z = index === 1 || index === 4 ? -0.06 : 0;
  });

  const scrollTravel = backgroundViewport.height * 1.22;

  if (titleMesh) {
    titleMesh.position.y = backgroundViewport.height * 0.16 - scrollCurrent * scrollTravel;
  }

  imagePlanes.forEach((plane, index) => {
    if (index === 0) plane.position.y = backgroundViewport.height * 0.12 - scrollCurrent * scrollTravel;
    if (index === 1) plane.position.y = backgroundViewport.height * 0.08 - scrollCurrent * scrollTravel;
    if (index === 2) plane.position.y = -backgroundViewport.height * 0.92 - scrollCurrent * scrollTravel;
    if (index === 3) plane.position.y = -backgroundViewport.height * 0.92 - scrollCurrent * scrollTravel;
    if (index === 4) plane.position.y = -backgroundViewport.height * 0.92 - scrollCurrent * scrollTravel;
  });

  if (props.mode === 'bar') {
    glassMesh.position.x = 0;
    glassMesh.position.y = -objectViewport.height / 2 + 0.2;
  } else {
    glassMesh.position.x = (objectPosition.x * objectViewport.width) / 2;
    glassMesh.position.y = (objectPosition.y * objectViewport.height) / 2;
  }

  glassMesh.rotation.y += props.mode === 'cube' ? 0.01 : 0.004;
  glassMesh.rotation.z = props.mode === 'cube' ? Math.sin(performance.now() * 0.0012) * 0.12 : 0;
};

const animate = () => {
  animationFrameId = requestAnimationFrame(animate);

  if (!renderer || !scene || !camera) return;

  updateScene();
  renderer.render(scene, camera);
};

const handlePointerMove = (event: PointerEvent) => {
  if (!containerRef.value || props.mode === 'bar') return;

  const rect = containerRef.value.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
};

const handlePointerLeave = () => {
  pointer.x = 0;
  pointer.y = 0;
};

const handleNavClick = (link: string) => {
  if (!link) return;

  if (link.startsWith('#')) {
    window.location.hash = link;
    return;
  }

  window.location.href = link;
};

const onScroll = () => {
  if (!containerRef.value) return;

  const maxScroll = containerRef.value.scrollHeight - containerRef.value.clientHeight;
  scrollTarget = maxScroll > 0 ? containerRef.value.scrollTop / maxScroll : 0;
};

const initializeScene = () => {
  if (!stageRef.value || !containerRef.value) return;

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  renderer.setClearColor(0x5227ff, 1);
  stageRef.value.appendChild(renderer.domElement);

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(15, 1, 0.1, 100);
  camera.position.set(0, 0, 20);

  ambientLight = new THREE.AmbientLight('#ffffff', 2);
  scene.add(ambientLight);

  keyLight = new THREE.DirectionalLight('#ffffff', 3.5);
  keyLight.position.set(2, 3, 8);
  scene.add(keyLight);

  rimLight = new THREE.PointLight('#9cc3ff', 14, 30);
  rimLight.position.set(-3, 1.5, 12);
  scene.add(rimLight);

  imagePlanes = props.images.slice(0, DEFAULT_IMAGE_COUNT).map(createImagePlane);
  imagePlanes.forEach(plane => scene?.add(plane));

  rebuildTitle();
  rebuildGlassMesh();
  applyMaterialProps();
  applyRendererSize();
  onScroll();
  animate();

  resizeObserver = new ResizeObserver(() => {
    applyRendererSize();
  });
  resizeObserver.observe(containerRef.value);
  containerRef.value.addEventListener('scroll', onScroll, { passive: true });
};

const destroyScene = () => {
  if (containerRef.value) {
    containerRef.value.removeEventListener('scroll', onScroll);
  }

  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }

  cancelAnimationFrame(animationFrameId);

  imagePlanes.forEach(plane => {
    scene?.remove(plane);
    plane.geometry.dispose();
    const material = plane.material as THREE.MeshBasicMaterial;
    material.map?.dispose();
    material.dispose();
  });
  imagePlanes = [];

  if (titleMesh) {
    scene?.remove(titleMesh);
    titleMesh.geometry.dispose();
    (titleMesh.material as THREE.MeshBasicMaterial).dispose();
    titleMesh = null;
  }

  currentTitleTexture?.dispose();
  currentTitleTexture = null;

  if (glassMesh) {
    scene?.remove(glassMesh);
    glassMesh.geometry.dispose();
    (glassMesh.material as THREE.MeshPhysicalMaterial).dispose();
    glassMesh = null;
  }

  renderer?.dispose();
  if (renderer?.domElement.parentNode) {
    renderer.domElement.parentNode.removeChild(renderer.domElement);
  }

  renderer = null;
  scene = null;
  camera = null;
  ambientLight = null;
  keyLight = null;
  rimLight = null;
};

watch(
  () => [props.mode, props.lensProps, props.barProps, props.cubeProps],
  () => {
    rebuildGlassMesh();
    applyMaterialProps();
    applyRendererSize();
  },
  { deep: true }
);

watch(
  () => props.title,
  () => {
    rebuildTitle();
    applyRendererSize();
  }
);

watch(
  () => props.images,
  () => {
    if (!scene) return;

    imagePlanes.forEach(plane => {
      scene?.remove(plane);
      plane.geometry.dispose();
      const material = plane.material as THREE.MeshBasicMaterial;
      material.map?.dispose();
      material.dispose();
    });

    imagePlanes = props.images.slice(0, DEFAULT_IMAGE_COUNT).map(createImagePlane);
    imagePlanes.forEach(plane => scene?.add(plane));
    updateLayout();
  },
  { deep: true }
);

onMounted(() => {
  initializeScene();
});

onBeforeUnmount(() => {
  destroyScene();
});
</script>

<style scoped>
.fluid-glass {
  position: relative;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  border-radius: 24px;
  /*background:
    radial-gradient(circle at top, rgba(140, 121, 255, 0.45), transparent 45%),
    linear-gradient(180deg, #6d51ff 0%, #5227ff 50%, #3512c7 100%);*/
  scrollbar-width: none;
}

.fluid-glass::-webkit-scrollbar {
  display: none;
}

.fluid-glass-stage {
  position: sticky;
  top: 0;
  width: 100%;
  height: 100%;
}

.fluid-glass-stage :deep(canvas) {
  display: block;
  width: 100%;
  height: 100%;
}

.fluid-glass-scroll-spacer {
  height: 260%;
  pointer-events: none;
}

.fluid-glass-nav {
  position: absolute;
  left: 50%;
  bottom: 18px;
  z-index: 2;
  display: flex;
  gap: 0.85rem;
  transform: translateX(-50%);
  padding: 0.45rem 0.8rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.22),
    inset 0 1px 0 rgba(255, 255, 255, 0.24);
}

.fluid-glass-nav-item {
  padding: 0.2rem 0.45rem;
  border: 0;
  background: transparent;
  color: #fff;
  font-size: 0.86rem;
  line-height: 1;
  cursor: pointer;
  transition: opacity 180ms ease;
}

.fluid-glass-nav-item:hover {
  opacity: 0.75;
}
</style>
