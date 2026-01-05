<template>
  <div class="relative w-full h-[500px] overflow-hidden">
    <div class="top-0 left-0 z-10 absolute bg-gradient-to-l from-transparent to-[#0b0b0b] w-12 h-full" />
    <div class="top-0 right-0 z-10 absolute bg-gradient-to-r from-transparent to-[#0b0b0b] w-12 h-full" />

    <div class="flex justify-center items-center h-full transform-3d perspective-[1000px]">
      <Motion
        tag="div"
        class="flex justify-center items-center w-full min-h-[200px] transform-3d cursor-grab active:cursor-grabbing select-none will-change-transform"
        :style="trackStyle"
        :animate="animateProps"
        :transition="springTransition"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
        @mousedown="handleMouseDown"
      >
        <div
          v-for="(url, i) in displayImages"
          :key="`gallery-${i}`"
          :style="getItemStyle(i)"
          class="absolute flex justify-center items-center px-[8%] backface-hidden pointer-events-none will-change-transform"
        >
          <img
            :src="url"
            alt="gallery"
            loading="lazy"
            decoding="async"
            class="border-[3px] border-white rounded-[15px] w-[300px] h-[120px] object-cover hover:scale-105 transition-transform duration-300 ease-in-out pointer-events-auto will-change-transform"
          />
        </div>
      </Motion>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Motion } from 'motion-v';
import { computed, onMounted, onUnmounted, ref, shallowRef, watch } from 'vue';

interface RollingGalleryProps {
  autoplay?: boolean;
  pauseOnHover?: boolean;
  images?: string[];
}

const props = withDefaults(defineProps<RollingGalleryProps>(), {
  autoplay: false,
  pauseOnHover: false,
  images: () => []
});

const DEFAULT_IMAGES = shallowRef([
  'https://images.unsplash.com/photo-1528181304800-259b08848526?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=3456&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1495103033382-fe343886b671?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1506781961370-37a89d6b3095?q=80&w=3264&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1599576838688-8a6c11263108?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1494094892896-7f14a4433b7a?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://plus.unsplash.com/premium_photo-1664910706524-e783eed89e71?q=80&w=3869&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1503788311183-fa3bf9c4bc32?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1585970480901-90d6bb2a48b5?q=80&w=3774&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
]);

const isScreenSizeSm = ref(false);
const rotateYValue = ref(0);
const autoplayInterval = ref<ReturnType<typeof setInterval> | null>(null);
const autoplayTimeout = ref<ReturnType<typeof setInterval> | null>(null);
const isDragging = ref(false);
const isHovered = ref(false);
const dragStartX = ref(0);
const dragStartRotation = ref(0);

const displayImages = computed(() => {
  const sourceImages = props.images.length > 0 ? props.images : DEFAULT_IMAGES.value;
  const maxImages = REFERENCE_FACE_COUNT_SPACING;

  if (sourceImages.length >= maxImages) {
    return sourceImages;
  }

  const repeatedImages = [];
  const repetitions = Math.ceil(maxImages / sourceImages.length);

  for (let i = 0; i < repetitions; i++) {
    repeatedImages.push(...sourceImages);
  }

  return repeatedImages.slice(0, maxImages);
});

const cylinderWidth = computed(() => (isScreenSizeSm.value ? 1100 : 1800));
const faceWidth = computed(() => {
  return (cylinderWidth.value / REFERENCE_FACE_COUNT_SIZING) * 1.5;
});
const radius = computed(() => cylinderWidth.value / (2 * Math.PI));

const DRAG_FACTOR = Object.freeze(0.15);
const MOMENTUM_FACTOR = Object.freeze(0.05);
const AUTOPLAY_INTERVAL = Object.freeze(2000);
const DRAG_RESTART_DELAY = Object.freeze(1500);
const HOVER_RESTART_DELAY = Object.freeze(100);
const HOVER_DEBOUNCE_DELAY = Object.freeze(50);
const REFERENCE_FACE_COUNT_SPACING = Object.freeze(10);
const REFERENCE_FACE_COUNT_SIZING = Object.freeze(10);

const trackStyle = computed(() => ({
  width: `${cylinderWidth.value}px`,
  transformStyle: 'preserve-3d' as const
}));

const animateProps = computed(() => ({
  rotateY: rotateYValue.value
}));

const springTransition = computed(() => {
  if (isDragging.value) {
    return { duration: 0 };
  } else {
    return {
      duration: 0.8,
      ease: 'easeOut' as const
    };
  }
});

const styleCache = new Map<string, { width: string; transform: string }>();

const getItemStyle = (index: number) => {
  const cacheKey = `${index}-${faceWidth.value}-${radius.value}`;

  if (styleCache.has(cacheKey)) {
    return styleCache.get(cacheKey)!;
  }

  const style = {
    width: `${faceWidth.value}px`,
    transform: `rotateY(${index * (360 / REFERENCE_FACE_COUNT_SPACING)}deg) translateZ(${radius.value}px)`
  };

  if (styleCache.size > 50) {
    styleCache.clear();
  }

  styleCache.set(cacheKey, style);
  return style;
};

let resizeTimeout: ReturnType<typeof setTimeout> | null = null;
let hoverTimeout: ReturnType<typeof setTimeout> | null = null;

function checkScreenSize() {
  isScreenSizeSm.value = window.innerWidth <= 640;
}

function throttledResize() {
  if (resizeTimeout) return;
  resizeTimeout = setTimeout(() => {
    checkScreenSize();
    resizeTimeout = null;
  }, 100);
}

function handleMouseDown(event: MouseEvent) {
  isDragging.value = true;
  dragStartX.value = event.clientX;
  dragStartRotation.value = rotateYValue.value;

  stopAutoplay();

  document.addEventListener('mousemove', handleMouseMove, { passive: true });
  document.addEventListener('mouseup', handleMouseUp, { passive: true });
  event.preventDefault();
}

function handleMouseMove(event: MouseEvent) {
  if (!isDragging.value) return;

  const deltaX = event.clientX - dragStartX.value;
  const rotationDelta = deltaX * DRAG_FACTOR;
  rotateYValue.value = dragStartRotation.value + rotationDelta;
}

function handleMouseUp(event: MouseEvent) {
  if (!isDragging.value) return;

  isDragging.value = false;

  const deltaX = event.clientX - dragStartX.value;
  const velocity = deltaX * MOMENTUM_FACTOR;
  rotateYValue.value += velocity;

  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseup', handleMouseUp);

  stopAutoplay();

  if (props.autoplay) {
    if (props.pauseOnHover && isHovered.value) {
      return;
    } else {
      autoplayTimeout.value = setTimeout(() => {
        if (!isDragging.value && (!props.pauseOnHover || !isHovered.value)) {
          startAutoplay();
        }
      }, DRAG_RESTART_DELAY);
    }
  }
}

function startAutoplay() {
  if (!props.autoplay || isDragging.value || (props.pauseOnHover && isHovered.value)) return;

  stopAutoplay();

  autoplayInterval.value = setInterval(() => {
    if (!isDragging.value && (!props.pauseOnHover || !isHovered.value)) {
      rotateYValue.value -= 360 / REFERENCE_FACE_COUNT_SPACING;
    }
  }, AUTOPLAY_INTERVAL);
}

function stopAutoplay() {
  if (autoplayInterval.value) {
    clearInterval(autoplayInterval.value);
    autoplayInterval.value = null;
  }
  if (autoplayTimeout.value) {
    clearTimeout(autoplayTimeout.value);
    autoplayTimeout.value = null;
  }
}

function handleMouseEnter() {
  if (hoverTimeout) {
    clearTimeout(hoverTimeout);
    hoverTimeout = null;
  }

  hoverTimeout = setTimeout(() => {
    isHovered.value = true;

    if (props.autoplay && props.pauseOnHover && !isDragging.value) {
      stopAutoplay();
    }
  }, HOVER_DEBOUNCE_DELAY);
}

function handleMouseLeave() {
  if (hoverTimeout) {
    clearTimeout(hoverTimeout);
    hoverTimeout = null;
  }

  hoverTimeout = setTimeout(() => {
    isHovered.value = false;

    if (props.autoplay && props.pauseOnHover && !isDragging.value) {
      stopAutoplay();
      autoplayTimeout.value = setTimeout(() => {
        if (props.autoplay && !isDragging.value && !isHovered.value) {
          startAutoplay();
        }
      }, HOVER_RESTART_DELAY);
    }
  }, HOVER_DEBOUNCE_DELAY);
}

onMounted(() => {
  checkScreenSize();
  window.addEventListener('resize', throttledResize, { passive: true });

  if (props.autoplay) {
    startAutoplay();
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', throttledResize);
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseup', handleMouseUp);
  stopAutoplay();
  if (resizeTimeout) {
    clearTimeout(resizeTimeout);
  }
  if (hoverTimeout) {
    clearTimeout(hoverTimeout);
    hoverTimeout = null;
  }
});

watch(
  () => props.autoplay,
  newVal => {
    stopAutoplay();
    if (newVal && !isDragging.value && (!props.pauseOnHover || !isHovered.value)) {
      autoplayTimeout.value = setTimeout(() => {
        if (!isDragging.value && (!props.pauseOnHover || !isHovered.value)) {
          startAutoplay();
        }
      }, HOVER_RESTART_DELAY);
    }
  }
);

watch(
  () => props.pauseOnHover,
  () => {
    if (props.autoplay) {
      stopAutoplay();
      if (!isDragging.value && (!props.pauseOnHover || !isHovered.value)) {
        startAutoplay();
      }
    }
  }
);
</script>
