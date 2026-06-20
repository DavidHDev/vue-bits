<script lang="ts">
import { defineComponent } from 'vue';

export interface CarouselItem {
  title: string;
  description: string;
  id: number;
  icon: string;
}

export const DEFAULT_ITEMS: CarouselItem[] = [
  { title: 'Text Animations', description: 'Cool text animations for your projects.', id: 1, icon: 'pi pi-file' },
  { title: 'Animations', description: 'Smooth animations for your projects.', id: 2, icon: 'pi pi-circle' },
  { title: 'Components', description: 'Reusable components for your projects.', id: 3, icon: 'pi pi-objects-column' },
  {
    title: 'Backgrounds',
    description: 'Beautiful backgrounds and patterns for your projects.',
    id: 4,
    icon: 'pi pi-table'
  },
  { title: 'Common UI', description: 'Common UI components are coming soon!', id: 5, icon: 'pi pi-code' }
];

export default defineComponent({ name: 'Carousel' });
</script>

<script setup lang="ts">
import { Motion, useMotionValue, useTransform } from 'motion-v';
import { computed, onMounted, onUnmounted, ref, useTemplateRef, watch } from 'vue';

export interface CarouselProps {
  items?: CarouselItem[];
  baseWidth?: number;
  autoplay?: boolean;
  autoplayDelay?: number;
  pauseOnHover?: boolean;
  loop?: boolean;
  round?: boolean;
}

const DRAG_BUFFER = 0;
const VELOCITY_THRESHOLD = 500;
const GAP = 16;
const SPRING_OPTIONS = { type: 'spring' as const, stiffness: 300, damping: 30 };

const props = withDefaults(defineProps<CarouselProps>(), {
  items: () => DEFAULT_ITEMS,
  baseWidth: 300,
  autoplay: false,
  autoplayDelay: 3000,
  pauseOnHover: false,
  loop: false,
  round: false
});

const containerPadding = 16;
const itemWidth = computed(() => props.baseWidth - containerPadding * 2);
const trackItemOffset = computed(() => itemWidth.value + GAP);

const carouselItems = computed(() => (props.loop ? [...props.items, props.items[0]] : props.items));
const currentIndex = ref<number>(0);
const motionX = useMotionValue(0);
const isHovered = ref<boolean>(false);
const isResetting = ref<boolean>(false);

const containerRef = useTemplateRef<HTMLDivElement>('containerRef');
let autoplayTimer: number | null = null;

const dragConstraints = computed(() =>
  props.loop
    ? {}
    : {
        left: -trackItemOffset.value * (carouselItems.value.length - 1),
        right: 0
      }
);

const effectiveTransition = computed(() => (isResetting.value ? { duration: 0 } : SPRING_OPTIONS));

const MAX_ITEMS = 12;
const rotateYTransforms = Array.from({ length: MAX_ITEMS }, (_, index) =>
  useTransform(motionX, (xVal: number) => {
    const offset = trackItemOffset.value;
    const r0 = -(index + 1) * offset;
    const r1 = -index * offset;
    const r2 = -(index - 1) * offset;
    if (xVal <= r0) return 90;
    if (xVal >= r2) return -90;
    if (xVal <= r1) return 90 + ((xVal - r0) / (r1 - r0)) * (0 - 90);
    return 0 + ((xVal - r1) / (r2 - r1)) * (-90 - 0);
  })
);

const getRotateY = (index: number) => rotateYTransforms[index] ?? rotateYTransforms[0];

const handleAnimationComplete = () => {
  if (props.loop && currentIndex.value === carouselItems.value.length - 1) {
    isResetting.value = true;
    motionX.set(0);
    currentIndex.value = 0;
    setTimeout(() => {
      isResetting.value = false;
    }, 50);
  }
};

interface DragInfo {
  offset: { x: number; y: number };
  velocity: { x: number; y: number };
}

const handleDragEnd = (_: Event, info: DragInfo) => {
  const offset = info.offset.x;
  const velocity = info.velocity.x;

  if (offset < -DRAG_BUFFER || velocity < -VELOCITY_THRESHOLD) {
    if (props.loop && currentIndex.value === props.items.length - 1) {
      currentIndex.value = currentIndex.value + 1;
    } else {
      currentIndex.value = Math.min(currentIndex.value + 1, carouselItems.value.length - 1);
    }
  } else if (offset > DRAG_BUFFER || velocity > VELOCITY_THRESHOLD) {
    if (props.loop && currentIndex.value === 0) {
      currentIndex.value = props.items.length - 1;
    } else {
      currentIndex.value = Math.max(currentIndex.value - 1, 0);
    }
  }
};

const setCurrentIndex = (index: number) => {
  currentIndex.value = index;
};

const stopAutoplay = () => {
  if (autoplayTimer !== null) {
    clearInterval(autoplayTimer);
    autoplayTimer = null;
  }
};

const startAutoplay = () => {
  if (!props.autoplay) return;
  if (props.pauseOnHover && isHovered.value) return;
  autoplayTimer = window.setInterval(() => {
    currentIndex.value = (() => {
      const prev = currentIndex.value;
      if (prev === props.items.length - 1 && props.loop) return prev + 1;
      if (prev === carouselItems.value.length - 1) return props.loop ? 0 : prev;
      return prev + 1;
    })();
  }, props.autoplayDelay);
};

const handleMouseEnter = () => {
  isHovered.value = true;
  if (props.pauseOnHover) stopAutoplay();
};

const handleMouseLeave = () => {
  isHovered.value = false;
  if (props.pauseOnHover) startAutoplay();
};

watch(
  [
    () => props.autoplay,
    () => props.autoplayDelay,
    isHovered,
    () => props.loop,
    () => props.items.length,
    () => carouselItems.value.length,
    () => props.pauseOnHover
  ],
  () => {
    stopAutoplay();
    startAutoplay();
  }
);

onMounted(() => {
  if (props.pauseOnHover && containerRef.value) {
    containerRef.value.addEventListener('mouseenter', handleMouseEnter);
    containerRef.value.addEventListener('mouseleave', handleMouseLeave);
  }
  startAutoplay();
});

onUnmounted(() => {
  if (containerRef.value) {
    containerRef.value.removeEventListener('mouseenter', handleMouseEnter);
    containerRef.value.removeEventListener('mouseleave', handleMouseLeave);
  }
  stopAutoplay();
});
</script>

<template>
  <div
    ref="containerRef"
    :class="[
      'relative overflow-hidden p-4',
      round ? 'rounded-full border border-[#333]' : 'rounded-[24px] border border-[#333]'
    ]"
    :style="{
      width: `${baseWidth}px`,
      ...(round && { height: `${baseWidth}px` })
    }"
  >
    <Motion
      tag="div"
      class="flex"
      drag="x"
      :dragConstraints="dragConstraints"
      :style="{
        width: itemWidth + 'px',
        gap: `${GAP}px`,
        perspective: 1000,
        perspectiveOrigin: `${currentIndex * trackItemOffset + itemWidth / 2}px 50%`,
        x: motionX
      }"
      @dragEnd="handleDragEnd"
      :animate="{ x: -(currentIndex * trackItemOffset) }"
      :transition="effectiveTransition"
      @animationComplete="handleAnimationComplete"
    >
      <Motion
        v-for="(item, index) in carouselItems"
        :key="index"
        tag="div"
        :class="[
          'relative shrink-0 flex flex-col overflow-hidden cursor-grab active:cursor-grabbing',
          round
            ? 'items-center justify-center text-center bg-[#111] border border-[#333] rounded-full'
            : 'items-start justify-between bg-[#111] border border-[#333] rounded-[12px]'
        ]"
        :style="{
          width: itemWidth + 'px',
          height: round ? itemWidth + 'px' : '100%',
          rotateY: getRotateY(index),
          ...(round && { borderRadius: '50%' })
        }"
        :transition="effectiveTransition"
      >
        <div :class="round ? 'p-0 m-0' : 'mb-4 p-5'">
          <span class="flex justify-center items-center bg-[#0b0b0b] rounded-full w-[28px] h-[28px]">
            <i :class="item.icon" class="text-white text-base" />
          </span>
        </div>
        <div class="p-5">
          <div class="mb-1 font-black text-white text-lg">{{ item.title }}</div>
          <p class="text-white text-sm">{{ item.description }}</p>
        </div>
      </Motion>
    </Motion>

    <div :class="['flex w-full justify-center', round ? 'absolute z-20 bottom-12 left-1/2 -translate-x-1/2' : '']">
      <div class="flex justify-between mt-4 px-8 w-[150px]">
        <Motion
          v-for="(_, index) in items"
          :key="index"
          tag="div"
          :class="[
            'h-2 w-2 rounded-full cursor-pointer transition-colors duration-150',
            currentIndex % items.length === index
              ? round
                ? 'bg-white'
                : 'bg-[#333333]'
              : round
                ? 'bg-[#555]'
                : 'bg-[rgba(51,51,51,0.4)]'
          ]"
          :animate="{ scale: currentIndex % items.length === index ? 1.2 : 1 }"
          :transition="{ duration: 0.15 }"
          @click="setCurrentIndex(index)"
        />
      </div>
    </div>
  </div>
</template>
