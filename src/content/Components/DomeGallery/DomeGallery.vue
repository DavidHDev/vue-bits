<template>
  <div
    ref="rootRef"
    class="relative w-full h-full box-border"
    :style="{
      '--segments-x': segments,
      '--segments-y': segments,
      '--overlay-blur-color': overlayBlurColor,
      '--tile-radius': imageBorderRadius,
      '--enlarge-radius': openedImageBorderRadius,
      '--image-filter': grayscale ? 'grayscale(1)' : 'none',
      '--radius': '520px',
      '--viewer-pad': '72px',
      '--circ': 'calc(var(--radius) * 3.14)',
      '--rot-y': 'calc((360deg / var(--segments-x)) / 2)',
      '--rot-x': 'calc((360deg / var(--segments-y)) / 2)',
      '--item-width': 'calc(var(--circ) / var(--segments-x))',
      '--item-height': 'calc(var(--circ) / var(--segments-y))'
    }"
  >
    <main
      ref="mainRef"
      class="absolute inset-0 grid place-items-center overflow-hidden touch-none select-none bg-transparent"
    >
      <div
        class="w-full h-full grid place-items-center contain-layout contain-paint contain-size"
        :style="{
          perspective: 'calc(var(--radius) * 2)',
          perspectiveOrigin: '50% 50%'
        }"
      >
        <div
          ref="sphereRef"
          class="will-change-transform"
          style="transform-style: preserve-3d; transform: translateZ(calc(var(--radius) * -1))"
        >
          <div
            v-for="(item, i) in items"
            :key="`${item.x},${item.y},${i}`"
            class="absolute -top-[999px] -bottom-[999px] -left-[999px] -right-[999px] m-auto transition-transform duration-300"
            :data-src="item.src"
            :data-offset-x="item.x"
            :data-offset-y="item.y"
            :data-size-x="item.sizeX"
            :data-size-y="item.sizeY"
            :style="{
              '--offset-x': item.x,
              '--offset-y': item.y,
              '--item-size-x': item.sizeX,
              '--item-size-y': item.sizeY,
              width: 'calc(var(--item-width) * var(--item-size-x))',
              height: 'calc(var(--item-height) * var(--item-size-y))',
              transformStyle: 'preserve-3d',
              transformOrigin: '50% 50%',
              backfaceVisibility: 'hidden',
              transform: `rotateY(calc(var(--rot-y) * (var(--offset-x) + ((var(--item-size-x) - 1) / 2)) + var(--rot-y-delta, 0deg))) rotateX(calc(var(--rot-x) * (var(--offset-y) - ((var(--item-size-y) - 1) / 2)) + var(--rot-x-delta, 0deg))) translateZ(var(--radius))`
            }"
          >
            <div
              class="absolute block inset-[10px] bg-transparent overflow-hidden transition-transform duration-300 cursor-pointer pointer-events-auto transform translate-z-0 focus:outline-none"
              role="button"
              tabindex="0"
              :aria-label="item.alt || 'Open image'"
              @click="onTileClick"
              @pointerup="onTilePointerUp"
              @touchend="onTileTouchEnd"
              :style="{
                borderRadius: 'var(--tile-radius, 12px)',
                transformStyle: 'preserve-3d',
                backfaceVisibility: 'hidden',
                touchAction: 'manipulation',
                WebkitTapHighlightColor: 'transparent',
                WebkitTransform: 'translateZ(0)'
              }"
            >
              <img
                :src="item.src"
                draggable="false"
                :alt="item.alt"
                class="w-full h-full object-cover pointer-events-none"
                :style="{
                  backfaceVisibility: 'hidden',
                  filter: 'var(--image-filter, none)'
                }"
              />
            </div>
          </div>
        </div>
      </div>

      <div
        class="absolute inset-0 m-auto z-[3] pointer-events-none"
        :style="{
          backgroundImage: 'radial-gradient(rgba(235, 235, 235, 0) 65%, var(--overlay-blur-color, #060010) 100%)'
        }"
      />
      <div
        class="absolute inset-0 m-auto z-[3] pointer-events-none"
        :style="{
          WebkitMaskImage: 'radial-gradient(rgba(235, 235, 235, 0) 70%, var(--overlay-blur-color, #060010) 90%)',
          maskImage: 'radial-gradient(rgba(235, 235, 235, 0) 70%, var(--overlay-blur-color, #060010) 90%)',
          backdropFilter: 'blur(3px)'
        }"
      />
      <div
        class="absolute left-0 right-0 h-[120px] z-[5] pointer-events-none top-0 rotate-180"
        :style="{
          background: 'linear-gradient(to bottom, transparent, var(--overlay-blur-color, #060010))'
        }"
      />
      <div
        class="absolute left-0 right-0 h-[120px] z-[5] pointer-events-none bottom-0"
        :style="{
          background: 'linear-gradient(to bottom, transparent, var(--overlay-blur-color, #060010))'
        }"
      />

      <div
        ref="viewerRef"
        class="absolute inset-0 z-20 pointer-events-none flex items-center justify-center"
        :style="{ padding: 'var(--viewer-pad)' }"
      >
        <div
          ref="scrimRef"
          class="absolute inset-0 z-10 bg-black/40 pointer-events-none opacity-0 transition-opacity duration-500 ease-linear"
          :style="{ backdropFilter: 'blur(3px)' }"
        />
        <div
          ref="frameRef"
          class="h-full aspect-square flex max-[1/1]:h-auto max-[1/1]:w-full"
          :style="{ borderRadius: 'var(--enlarge-radius, 32px)' }"
        />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, computed, ref, useTemplateRef, watch } from 'vue';

interface ImageItem {
  src: string;
  alt?: string;
}

interface DomeGalleryProps {
  images?: (string | ImageItem)[];
  fit?: number;
  fitBasis?: 'auto' | 'min' | 'max' | 'width' | 'height';
  minRadius?: number;
  maxRadius?: number;
  padFactor?: number;
  overlayBlurColor?: string;
  maxVerticalRotationDeg?: number;
  dragSensitivity?: number;
  enlargeTransitionMs?: number;
  segments?: number;
  dragDampening?: number;
  openedImageWidth?: string;
  openedImageHeight?: string;
  imageBorderRadius?: string;
  openedImageBorderRadius?: string;
  grayscale?: boolean;
}

const DEFAULT_IMAGES: ImageItem[] = [
  {
    src: 'https://images.unsplash.com/photo-1755331039789-7e5680e26e8f?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    alt: 'Abstract art'
  },
  {
    src: 'https://images.unsplash.com/photo-1755569309049-98410b94f66d?q=80&w=772&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    alt: 'Modern sculpture'
  },
  {
    src: 'https://images.unsplash.com/photo-1755497595318-7e5e3523854f?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    alt: 'Digital artwork'
  },
  {
    src: 'https://images.unsplash.com/photo-1755353985163-c2a0fe5ac3d8?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    alt: 'Contemporary art'
  },
  {
    src: 'https://images.unsplash.com/photo-1745965976680-d00be7dc0377?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    alt: 'Geometric pattern'
  },
  {
    src: 'https://images.unsplash.com/photo-1752588975228-21f44630bb3c?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    alt: 'Textured surface'
  },
  { src: 'https://pbs.twimg.com/media/Gyla7NnXMAAXSo_?format=jpg&name=large', alt: 'Social media image' }
];

const AUTO_ROTATE_SPEED_DEG_PER_MS = 0.008;

const props = withDefaults(defineProps<DomeGalleryProps>(), {
  fit: 0.5,
  fitBasis: 'auto',
  minRadius: 600,
  maxRadius: Infinity,
  padFactor: 0.25,
  overlayBlurColor: '#060010',
  maxVerticalRotationDeg: 5,
  dragSensitivity: 20,
  enlargeTransitionMs: 300,
  segments: 35,
  dragDampening: 2,
  openedImageWidth: '400px',
  openedImageHeight: '400px',
  imageBorderRadius: '30px',
  openedImageBorderRadius: '30px',
  grayscale: true
});

// Use computed to provide default images if none provided
const imagesSource = computed(() => props.images || DEFAULT_IMAGES);

// Template refs
const rootRef = useTemplateRef<HTMLDivElement>('rootRef');
const mainRef = useTemplateRef<HTMLElement>('mainRef');
const sphereRef = useTemplateRef<HTMLDivElement>('sphereRef');
const viewerRef = useTemplateRef<HTMLDivElement>('viewerRef');
const scrimRef = useTemplateRef<HTMLDivElement>('scrimRef');
const frameRef = useTemplateRef<HTMLDivElement>('frameRef');

// State refs
const rotation = ref({ x: 0, y: 0 });
const startRotation = ref({ x: 0, y: 0 });
const startPosition = ref<{ x: number; y: number } | null>(null);
const isDragging = ref(false);
const hasMoved = ref(false);
const isOpening = ref(false);
const focusedElement = ref<HTMLElement | null>(null);
const originalTilePosition = ref<DOMRect | null>(null);
const scrollLocked = ref(false);
const openStartedAt = ref(0);
const lastDragEndAt = ref(0);

let inertiaAnimationFrame: number | null = null;
let resizeObserver: ResizeObserver | null = null;
let keydownHandler: ((e: KeyboardEvent) => void) | null = null;
let autoRotateAnimationFrame: number | null = null;
let lastAutoRotateTime = 0;

// Utility functions
const clamp = (v: number, min: number, max: number): number => Math.min(Math.max(v, min), max);
const normalizeAngle = (d: number): number => ((d % 360) + 360) % 360;
const wrapAngleSigned = (deg: number): number => {
  const a = (((deg + 180) % 360) + 360) % 360;
  return a - 180;
};

const getDataNumber = (el: HTMLElement, name: string, fallback: number): number => {
  const attr = el.dataset[name] ?? el.getAttribute(`data-${name}`);
  const n = attr == null ? NaN : parseFloat(attr);
  return Number.isFinite(n) ? n : fallback;
};

// Build items function
function buildItems(pool: (string | ImageItem)[], seg: number) {
  const xCols = Array.from({ length: seg }, (_, i) => -37 + i * 2);
  const evenYs = [-4, -2, 0, 2, 4];
  const oddYs = [-3, -1, 1, 3, 5];

  const coords = xCols.flatMap((x, c) => {
    const ys = c % 2 === 0 ? evenYs : oddYs;
    return ys.map(y => ({ x, y, sizeX: 2, sizeY: 2 }));
  });

  const totalSlots = coords.length;
  if (pool.length === 0) {
    return coords.map(c => ({ ...c, src: '', alt: '' }));
  }
  if (pool.length > totalSlots) {
    console.warn(
      `[DomeGallery] Provided image count (${pool.length}) exceeds available tiles (${totalSlots}). Some images will not be shown.`
    );
  }

  const normalizedImages = pool.map(image => {
    if (typeof image === 'string') {
      return { src: image, alt: '' };
    }
    return { src: image.src || '', alt: image.alt || '' };
  });

  const usedImages = Array.from({ length: totalSlots }, (_, i) => normalizedImages[i % normalizedImages.length]);

  for (let i = 1; i < usedImages.length; i++) {
    if (usedImages[i].src === usedImages[i - 1].src) {
      for (let j = i + 1; j < usedImages.length; j++) {
        if (usedImages[j].src !== usedImages[i].src) {
          const tmp = usedImages[i];
          usedImages[i] = usedImages[j];
          usedImages[j] = tmp;
          break;
        }
      }
    }
  }

  return coords.map((c, i) => ({
    ...c,
    src: usedImages[i].src,
    alt: usedImages[i].alt
  }));
}

// Compute items
const items = computed(() => buildItems(imagesSource.value, props.segments));

// Compute item base rotation
function computeItemBaseRotation(offsetX: number, offsetY: number, sizeX: number, sizeY: number, segments: number) {
  const unit = 360 / segments / 2;
  const rotateY = unit * (offsetX + (sizeX - 1) / 2);
  const rotateX = unit * (offsetY - (sizeY - 1) / 2);
  return { rotateX, rotateY };
}

// Apply transform
const applyTransform = (xDeg: number, yDeg: number) => {
  const el = sphereRef.value;
  if (el) {
    el.style.transform = `translateZ(calc(var(--radius) * -1)) rotateX(${xDeg}deg) rotateY(${yDeg}deg)`;
  }
};

// Scroll lock functions
const lockScroll = () => {
  if (scrollLocked.value) return;
  scrollLocked.value = true;
  document.body.classList.add('overflow-hidden');
};

const unlockScroll = () => {
  if (!scrollLocked.value) return;
  if (rootRef.value?.getAttribute('data-enlarging') === 'true') return;
  scrollLocked.value = false;
  document.body.classList.remove('overflow-hidden');
};

// Inertia functions
const stopInertia = () => {
  if (inertiaAnimationFrame) {
    cancelAnimationFrame(inertiaAnimationFrame);
    inertiaAnimationFrame = null;
  }
};

const startInertia = (vx: number, vy: number) => {
  const MAX_V = 1.4;
  let vX = clamp(vx, -MAX_V, MAX_V) * 80;
  let vY = clamp(vy, -MAX_V, MAX_V) * 80;
  let frames = 0;
  const d = clamp(props.dragDampening ?? 0.6, 0, 1);
  const frictionMul = 0.94 + 0.055 * d;
  const stopThreshold = 0.015 - 0.01 * d;
  const maxFrames = Math.round(90 + 270 * d);

  const step = () => {
    vX *= frictionMul;
    vY *= frictionMul;
    if (Math.abs(vX) < stopThreshold && Math.abs(vY) < stopThreshold) {
      inertiaAnimationFrame = null;
      return;
    }
    if (++frames > maxFrames) {
      inertiaAnimationFrame = null;
      return;
    }
    const nextX = clamp(rotation.value.x - vY / 200, -props.maxVerticalRotationDeg, props.maxVerticalRotationDeg);
    const nextY = wrapAngleSigned(rotation.value.y + vX / 200);
    rotation.value = { x: nextX, y: nextY };
    applyTransform(nextX, nextY);
    inertiaAnimationFrame = requestAnimationFrame(step);
  };

  stopInertia();
  inertiaAnimationFrame = requestAnimationFrame(step);
};

const stopAutoRotate = () => {
  if (autoRotateAnimationFrame) {
    cancelAnimationFrame(autoRotateAnimationFrame);
    autoRotateAnimationFrame = null;
  }
  lastAutoRotateTime = 0;
};

const autoRotateStep = (now: number) => {
  if (!lastAutoRotateTime) {
    lastAutoRotateTime = now;
  }
  const deltaMs = now - lastAutoRotateTime;
  lastAutoRotateTime = now;

  const canSpin = !isDragging.value && !isOpening.value && !focusedElement.value && inertiaAnimationFrame === null;

  if (canSpin && deltaMs > 0) {
    const nextY = wrapAngleSigned(rotation.value.y + deltaMs * AUTO_ROTATE_SPEED_DEG_PER_MS);
    if (nextY !== rotation.value.y) {
      rotation.value = { x: rotation.value.x, y: nextY };
    }
  }

  autoRotateAnimationFrame = requestAnimationFrame(autoRotateStep);
};

const startAutoRotate = () => {
  if (autoRotateAnimationFrame !== null) return;
  lastAutoRotateTime = 0;
  autoRotateAnimationFrame = requestAnimationFrame(autoRotateStep);
};

// Gesture handling
const onDragStart = (e: MouseEvent | TouchEvent) => {
  if (focusedElement.value) return;
  stopInertia();

  isDragging.value = true;
  hasMoved.value = false;
  startRotation.value = { ...rotation.value };

  const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
  const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
  startPosition.value = { x: clientX, y: clientY };
};

const onDragMove = (e: MouseEvent | TouchEvent) => {
  if (focusedElement.value || !isDragging.value || !startPosition.value) return;

  const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
  const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

  const dxTotal = clientX - startPosition.value.x;
  const dyTotal = clientY - startPosition.value.y;

  if (!hasMoved.value) {
    const dist2 = dxTotal * dxTotal + dyTotal * dyTotal;
    if (dist2 > 16) hasMoved.value = true;
  }

  const nextX = clamp(
    startRotation.value.x - dyTotal / props.dragSensitivity,
    -props.maxVerticalRotationDeg,
    props.maxVerticalRotationDeg
  );
  const nextY = wrapAngleSigned(startRotation.value.y + dxTotal / props.dragSensitivity);

  if (rotation.value.x !== nextX || rotation.value.y !== nextY) {
    rotation.value = { x: nextX, y: nextY };
    applyTransform(nextX, nextY);
  }
};

const onDragEnd = (e: MouseEvent | TouchEvent) => {
  if (!isDragging.value) return;

  isDragging.value = false;

  // Calculate velocity for inertia (simplified version)
  if (hasMoved.value && startPosition.value) {
    const clientX = 'touches' in e ? (e.changedTouches?.[0]?.clientX ?? 0) : e.clientX;
    const clientY = 'touches' in e ? (e.changedTouches?.[0]?.clientY ?? 0) : e.clientY;

    const dxTotal = clientX - startPosition.value.x;
    const dyTotal = clientY - startPosition.value.y;

    // Simple velocity calculation based on total movement
    const vx = clamp((dxTotal / props.dragSensitivity) * 0.02, -1.2, 1.2);
    const vy = clamp((dyTotal / props.dragSensitivity) * 0.02, -1.2, 1.2);

    if (Math.abs(vx) > 0.005 || Math.abs(vy) > 0.005) {
      startInertia(vx, vy);
    }

    lastDragEndAt.value = performance.now();
  }

  hasMoved.value = false;
};

// Image enlargement functionality
const openItemFromElement = (el: HTMLElement) => {
  if (isOpening.value) return;
  isOpening.value = true;
  openStartedAt.value = performance.now();
  lockScroll();

  const parent = el.parentElement;
  if (!parent) return;

  focusedElement.value = el;
  el.setAttribute('data-focused', 'true');

  const offsetX = getDataNumber(parent, 'offsetX', 0);
  const offsetY = getDataNumber(parent, 'offsetY', 0);
  const sizeX = getDataNumber(parent, 'sizeX', 2);
  const sizeY = getDataNumber(parent, 'sizeY', 2);

  const parentRot = computeItemBaseRotation(offsetX, offsetY, sizeX, sizeY, props.segments);
  const parentY = normalizeAngle(parentRot.rotateY);
  const globalY = normalizeAngle(rotation.value.y);
  let rotY = -(parentY + globalY) % 360;
  if (rotY < -180) rotY += 360;
  const rotX = -parentRot.rotateX - rotation.value.x;

  parent.style.setProperty('--rot-y-delta', `${rotY}deg`);
  parent.style.setProperty('--rot-x-delta', `${rotX}deg`);

  const refDiv = document.createElement('div');
  refDiv.className = 'item__image item__image--reference';
  refDiv.style.opacity = '0';
  refDiv.style.transform = `rotateX(${-parentRot.rotateX}deg) rotateY(${-parentRot.rotateY}deg)`;
  parent.appendChild(refDiv);

  const tileR = refDiv.getBoundingClientRect();
  const mainR = mainRef.value?.getBoundingClientRect();
  const frameR = frameRef.value?.getBoundingClientRect();

  if (!mainR || !frameR) return;

  originalTilePosition.value = {
    left: tileR.left,
    top: tileR.top,
    width: tileR.width,
    height: tileR.height
  } as DOMRect;

  el.style.visibility = 'hidden';
  el.style.zIndex = '0';

  const overlay = document.createElement('div');
  overlay.className = 'enlarge';
  overlay.style.position = 'absolute';
  overlay.style.left = `${frameR.left - mainR.left}px`;
  overlay.style.top = `${frameR.top - mainR.top}px`;
  overlay.style.width = `${frameR.width}px`;
  overlay.style.height = `${frameR.height}px`;
  overlay.style.opacity = '0';
  overlay.style.zIndex = '30';
  overlay.style.willChange = 'transform, opacity';
  overlay.style.transformOrigin = 'top left';
  overlay.style.transition = `transform ${props.enlargeTransitionMs}ms ease, opacity ${props.enlargeTransitionMs}ms ease`;

  const rawSrc = parent.dataset.src || el.querySelector('img')?.src || '';
  const img = document.createElement('img');
  img.src = rawSrc;
  overlay.appendChild(img);
  viewerRef.value?.appendChild(overlay);

  const tx0 = tileR.left - frameR.left;
  const ty0 = tileR.top - frameR.top;
  const sx0 = tileR.width / frameR.width;
  const sy0 = tileR.height / frameR.height;
  overlay.style.transform = `translate(${tx0}px, ${ty0}px) scale(${sx0}, ${sy0})`;

  requestAnimationFrame(() => {
    overlay.style.opacity = '1';
    overlay.style.transform = 'translate(0px, 0px) scale(1,1)';
    rootRef.value?.setAttribute('data-enlarging', 'true');
    scrimRef.value?.classList.add('opacity-100', 'pointer-events-auto');
    scrimRef.value?.classList.remove('opacity-0', 'pointer-events-none');
  });

  const wantsResize = props.openedImageWidth || props.openedImageHeight;
  if (wantsResize) {
    const onFirstEnd = (ev: TransitionEvent) => {
      if (ev.propertyName !== 'transform') return;
      overlay.removeEventListener('transitionend', onFirstEnd);
      const prevTransition = overlay.style.transition;
      overlay.style.transition = 'none';
      const tempWidth = props.openedImageWidth || `${frameR.width}px`;
      const tempHeight = props.openedImageHeight || `${frameR.height}px`;
      overlay.style.width = tempWidth;
      overlay.style.height = tempHeight;
      const newRect = overlay.getBoundingClientRect();
      overlay.style.width = `${frameR.width}px`;
      overlay.style.height = `${frameR.height}px`;
      void overlay.offsetWidth;
      overlay.style.transition = `left ${props.enlargeTransitionMs}ms ease, top ${props.enlargeTransitionMs}ms ease, width ${props.enlargeTransitionMs}ms ease, height ${props.enlargeTransitionMs}ms ease`;
      const centeredLeft = frameR.left - mainR.left + (frameR.width - newRect.width) / 2;
      const centeredTop = frameR.top - mainR.top + (frameR.height - newRect.height) / 2;
      requestAnimationFrame(() => {
        overlay.style.left = `${centeredLeft}px`;
        overlay.style.top = `${centeredTop}px`;
        overlay.style.width = tempWidth;
        overlay.style.height = tempHeight;
      });
      const cleanupSecond = () => {
        overlay.removeEventListener('transitionend', cleanupSecond);
        overlay.style.transition = prevTransition;
      };
      overlay.addEventListener('transitionend', cleanupSecond, { once: true });
    };
    overlay.addEventListener('transitionend', onFirstEnd);
  }
};

const closeEnlargedImage = () => {
  if (performance.now() - openStartedAt.value < 250) return;
  const el = focusedElement.value;
  if (!el) return;
  const parent = el.parentElement;
  const overlay = viewerRef.value?.querySelector('.enlarge') as HTMLElement;
  if (!overlay || !parent) return;
  const refDiv = parent.querySelector('.item__image--reference');
  const originalPos = originalTilePosition.value;

  if (!originalPos) {
    overlay.remove();
    if (refDiv) refDiv.remove();
    parent.style.setProperty('--rot-y-delta', '0deg');
    parent.style.setProperty('--rot-x-delta', '0deg');
    el.style.visibility = '';
    el.style.zIndex = '0';
    focusedElement.value = null;
    rootRef.value?.removeAttribute('data-enlarging');
    scrimRef.value?.classList.add('opacity-0', 'pointer-events-none');
    scrimRef.value?.classList.remove('opacity-100', 'pointer-events-auto');
    isOpening.value = false;
    unlockScroll();
    return;
  }

  const currentRect = overlay.getBoundingClientRect();
  const rootRect = rootRef.value?.getBoundingClientRect();
  if (!rootRect) return;

  const originalPosRelativeToRoot = {
    left: originalPos.left - rootRect.left,
    top: originalPos.top - rootRect.top,
    width: originalPos.width,
    height: originalPos.height
  };

  const overlayRelativeToRoot = {
    left: currentRect.left - rootRect.left,
    top: currentRect.top - rootRect.top,
    width: currentRect.width,
    height: currentRect.height
  };

  const animatingOverlay = document.createElement('div');
  animatingOverlay.className = 'enlarge-closing';
  animatingOverlay.style.cssText = `position:absolute;left:${overlayRelativeToRoot.left}px;top:${overlayRelativeToRoot.top}px;width:${overlayRelativeToRoot.width}px;height:${overlayRelativeToRoot.height}px;z-index:9999;border-radius: var(--enlarge-radius, 32px);overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,.35);transition:all ${props.enlargeTransitionMs}ms ease-out;pointer-events:none;margin:0;transform:none;`;

  const originalImg = overlay.querySelector('img');
  if (originalImg) {
    const img = originalImg.cloneNode() as HTMLImageElement;
    img.style.cssText = 'width:100%;height:100%;object-fit:cover;';
    animatingOverlay.appendChild(img);
  }

  overlay.remove();
  rootRef.value?.appendChild(animatingOverlay);
  void animatingOverlay.getBoundingClientRect();

  requestAnimationFrame(() => {
    animatingOverlay.style.left = `${originalPosRelativeToRoot.left}px`;
    animatingOverlay.style.top = `${originalPosRelativeToRoot.top}px`;
    animatingOverlay.style.width = `${originalPosRelativeToRoot.width}px`;
    animatingOverlay.style.height = `${originalPosRelativeToRoot.height}px`;
    animatingOverlay.style.opacity = '0';
  });

  const cleanup = () => {
    animatingOverlay.remove();
    originalTilePosition.value = null;
    if (refDiv) refDiv.remove();
    parent.style.transition = 'none';
    el.style.transition = 'none';
    parent.style.setProperty('--rot-y-delta', '0deg');
    parent.style.setProperty('--rot-x-delta', '0deg');
    requestAnimationFrame(() => {
      el.style.visibility = '';
      el.style.opacity = '0';
      el.style.zIndex = '0';
      focusedElement.value = null;
      rootRef.value?.removeAttribute('data-enlarging');
      scrimRef.value?.classList.add('opacity-0', 'pointer-events-none');
      scrimRef.value?.classList.remove('opacity-100', 'pointer-events-auto');
      requestAnimationFrame(() => {
        parent.style.transition = '';
        el.style.transition = 'opacity 300ms ease-out';
        requestAnimationFrame(() => {
          el.style.opacity = '1';
          setTimeout(() => {
            el.style.transition = '';
            el.style.opacity = '';
            isOpening.value = false;
            unlockScroll();
          }, 300);
        });
      });
    });
  };

  animatingOverlay.addEventListener('transitionend', cleanup, { once: true });
};

// Event handlers for tile interaction
const onTileClick = (e: Event) => {
  if (isDragging.value) return;
  if (performance.now() - lastDragEndAt.value < 80) return;
  if (isOpening.value) return;
  openItemFromElement(e.currentTarget as HTMLElement);
};

const onTilePointerUp = (e: PointerEvent) => {
  if (e.pointerType !== 'touch') return;
  if (isDragging.value) return;
  if (performance.now() - lastDragEndAt.value < 80) return;
  if (isOpening.value) return;
  openItemFromElement(e.currentTarget as HTMLElement);
};

const onTileTouchEnd = (e: TouchEvent) => {
  if (isDragging.value) return;
  if (performance.now() - lastDragEndAt.value < 80) return;
  if (isOpening.value) return;
  openItemFromElement(e.currentTarget as HTMLElement);
};

// Setup ResizeObserver and event listeners
onMounted(() => {
  // Initialize transform
  applyTransform(rotation.value.x, rotation.value.y);
  startAutoRotate();

  // Setup ResizeObserver
  const root = rootRef.value;
  const main = mainRef.value;
  if (!root || !main) return;

  resizeObserver = new ResizeObserver(entries => {
    const cr = entries[0].contentRect;
    const w = Math.max(1, cr.width);
    const h = Math.max(1, cr.height);
    const minDim = Math.min(w, h);
    const maxDim = Math.max(w, h);
    const aspect = w / h;

    let basis: number;
    switch (props.fitBasis) {
      case 'min':
        basis = minDim;
        break;
      case 'max':
        basis = maxDim;
        break;
      case 'width':
        basis = w;
        break;
      case 'height':
        basis = h;
        break;
      default:
        basis = aspect >= 1.3 ? w : minDim;
    }

    let radius = basis * props.fit;
    const heightGuard = h * 1.35;
    radius = Math.min(radius, heightGuard);
    radius = clamp(radius, props.minRadius, props.maxRadius);

    const viewerPad = Math.max(8, Math.round(minDim * props.padFactor));
    const roundedRadius = Math.round(radius);

    root.style.setProperty('--radius', `${roundedRadius}px`);
    root.style.setProperty('--viewer-pad', `${viewerPad}px`);

    const overlay = viewerRef.value?.querySelector('.enlarge') as HTMLElement | null;
    if (overlay && frameRef.value && mainRef.value) {
      const frameR = frameRef.value.getBoundingClientRect();
      const mainR = mainRef.value.getBoundingClientRect();

      if (props.openedImageWidth && props.openedImageHeight) {
        const tempDiv = document.createElement('div');
        tempDiv.style.cssText = `position:absolute;visibility:hidden;width:${props.openedImageWidth};height:${props.openedImageHeight};pointer-events:none;`;
        document.body.appendChild(tempDiv);
        const tempRect = tempDiv.getBoundingClientRect();
        document.body.removeChild(tempDiv);

        const centeredLeft = frameR.left - mainR.left + (frameR.width - tempRect.width) / 2;
        const centeredTop = frameR.top - mainR.top + (frameR.height - tempRect.height) / 2;
        overlay.style.left = `${centeredLeft}px`;
        overlay.style.top = `${centeredTop}px`;
        overlay.style.width = props.openedImageWidth;
        overlay.style.height = props.openedImageHeight;
      } else {
        overlay.style.left = `${frameR.left - mainR.left}px`;
        overlay.style.top = `${frameR.top - mainR.top}px`;
        overlay.style.width = `${frameR.width}px`;
        overlay.style.height = `${frameR.height}px`;
      }
    }
  });

  resizeObserver.observe(root);

  // Add gesture event listeners
  main.addEventListener('mousedown', onDragStart, { passive: true });
  main.addEventListener('touchstart', onDragStart, { passive: true });

  window.addEventListener('mousemove', onDragMove, { passive: true });
  window.addEventListener('touchmove', onDragMove, { passive: true });

  window.addEventListener('mouseup', onDragEnd);
  window.addEventListener('touchend', onDragEnd);

  // Add enlargement event listeners
  const scrim = scrimRef.value;
  if (scrim) {
    scrim.addEventListener('click', closeEnlargedImage);
  }

  keydownHandler = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeEnlargedImage();
    }
  };
  window.addEventListener('keydown', keydownHandler);
});

// Cleanup on unmount
onUnmounted(() => {
  stopInertia();
  stopAutoRotate();
  if (resizeObserver) {
    resizeObserver.disconnect();
  }

  // Remove event listeners
  const main = mainRef.value;
  const scrim = scrimRef.value;

  if (main) {
    main.removeEventListener('mousedown', onDragStart);
    main.removeEventListener('touchstart', onDragStart);
  }

  if (scrim) {
    scrim.removeEventListener('click', closeEnlargedImage);
  }

  window.removeEventListener('mousemove', onDragMove);
  window.removeEventListener('touchmove', onDragMove);
  window.removeEventListener('mouseup', onDragEnd);
  window.removeEventListener('touchend', onDragEnd);

  if (keydownHandler) {
    window.removeEventListener('keydown', keydownHandler);
  }

  document.body.classList.remove('overflow-hidden');
});

// Watch for rotation changes
watch(rotation, newRotation => {
  applyTransform(newRotation.x, newRotation.y);
});
</script>
