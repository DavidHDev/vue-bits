<script setup lang="ts">
import { gsap } from 'gsap';
import { Draggable } from 'gsap/all';
import { computed, onBeforeUnmount, onMounted, ref, useTemplateRef, watch } from 'vue';

gsap.registerPlugin(Draggable);

interface StickerPeelProps {
  imageSrc: string;
  rotate?: number;
  peelBackHoverPct?: number;
  peelBackActivePct?: number;
  peelEasing?: string;
  peelHoverEasing?: string;
  width?: number;
  shadowIntensity?: number;
  lightingIntensity?: number;
  initialPosition?: 'center' | 'random' | { x: number; y: number };
  peelDirection?: number;
  className?: string;
}

const props = withDefaults(defineProps<StickerPeelProps>(), {
  rotate: 30,
  peelBackHoverPct: 30,
  peelBackActivePct: 40,
  peelEasing: 'power3.out',
  peelHoverEasing: 'power2.out',
  width: 200,
  shadowIntensity: 0.6,
  lightingIntensity: 0.1,
  initialPosition: 'center',
  peelDirection: 0,
  className: ''
});

const containerRef = useTemplateRef('containerRef');
const dragTargetRef = useTemplateRef('dragTargetRef');
const pointLightRef = useTemplateRef('pointLightRef');
const pointLightFlippedRef = useTemplateRef('pointLightFlippedRef');
const draggableInstanceRef = ref<Draggable | null>(null);

const defaultPadding = 12;

let cleanup: (() => void) | null = null;

const setup = () => {
  const target = dragTargetRef.value;
  if (!target) return;

  const boundsEl = target.parentNode as HTMLElement;

  const draggable = Draggable.create(target, {
    type: 'x,y',
    bounds: boundsEl,
    inertia: true,
    onDrag(this: Draggable) {
      const rot = gsap.utils.clamp(-24, 24, this.deltaX * 0.4);
      gsap.to(target, { rotation: rot, duration: 0.15, ease: 'power1.out' });
    },
    onDragEnd() {
      const rotationEase = 'power2.out';
      const duration = 0.8;
      gsap.to(target, { rotation: 0, duration, ease: rotationEase });
    }
  });

  draggableInstanceRef.value = draggable[0];

  const handleResize = () => {
    if (draggableInstanceRef.value) {
      draggableInstanceRef.value.update();

      const currentX = gsap.getProperty(target, 'x') as number;
      const currentY = gsap.getProperty(target, 'y') as number;

      const boundsRect = boundsEl.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();

      const maxX = boundsRect.width - targetRect.width;
      const maxY = boundsRect.height - targetRect.height;

      const newX = Math.max(0, Math.min(currentX, maxX));
      const newY = Math.max(0, Math.min(currentY, maxY));

      if (newX !== currentX || newY !== currentY) {
        gsap.to(target, {
          x: newX,
          y: newY,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    }
  };

  window.addEventListener('resize', handleResize);
  window.addEventListener('orientationchange', handleResize);

  const container = containerRef.value;
  if (!container) return;

  const handleTouchStart = () => {
    container.classList.add('touch-active');
  };

  const handleTouchEnd = () => {
    container.classList.remove('touch-active');
  };

  container.addEventListener('touchstart', handleTouchStart);
  container.addEventListener('touchend', handleTouchEnd);
  container.addEventListener('touchcancel', handleTouchEnd);

  cleanup = () => {
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('orientationchange', handleResize);
    if (draggableInstanceRef.value) {
      draggableInstanceRef.value.kill();
    }

    container.removeEventListener('touchstart', handleTouchStart);
    container.removeEventListener('touchend', handleTouchEnd);
    container.removeEventListener('touchcancel', handleTouchEnd);
  };
};

onMounted(() => {
  setup();
});

watch(
  () => props.initialPosition,
  () => {
    const target = dragTargetRef.value;
    if (!target) return;

    let startX = 0,
      startY = 0;

    if (props.initialPosition === 'center') {
      return;
    }

    if (
      typeof props.initialPosition === 'object' &&
      props.initialPosition.x !== undefined &&
      props.initialPosition.y !== undefined
    ) {
      startX = props.initialPosition.x;
      startY = props.initialPosition.y;
    }

    gsap.set(target, { x: startX, y: startY });
  },
  { immediate: true }
);

let lightHandler: (() => void) | null = null;

watch(
  () => props.peelDirection,
  () => {
    const updateLight = (e: Event) => {
      const mouseEvent = e as MouseEvent;
      const rect = containerRef.value?.getBoundingClientRect();
      if (!rect) return;

      const x = mouseEvent.clientX - rect.left;
      const y = mouseEvent.clientY - rect.top;

      if (pointLightRef.value) {
        gsap.set(pointLightRef.value, { attr: { x, y } });
      }

      const normalizedAngle = Math.abs(props.peelDirection % 360);
      if (pointLightFlippedRef.value) {
        if (normalizedAngle !== 180) {
          gsap.set(pointLightFlippedRef.value, {
            attr: { x, y: rect.height - y }
          });
        } else {
          gsap.set(pointLightFlippedRef.value, {
            attr: { x: -1000, y: -1000 }
          });
        }
      }
    };

    const container = containerRef.value;
    const eventType = 'mousemove';

    if (container) {
      container.addEventListener(eventType, updateLight);
      lightHandler = () => container.removeEventListener(eventType, updateLight);
    }
  },
  { immediate: true }
);

onBeforeUnmount(() => {
  const container = containerRef.value;
  if (container && lightHandler) {
    lightHandler();
    lightHandler = null;
  }

  if (cleanup) {
    cleanup();
    cleanup = null;
  }
});

const cssVars = computed(() => ({
  '--sticker-rotate': `${props.rotate}deg`,
  '--sticker-p': `${defaultPadding}px`,
  '--sticker-peelback-hover': `${props.peelBackHoverPct}%`,
  '--sticker-peelback-active': `${props.peelBackActivePct}%`,
  '--sticker-peel-easing': props.peelEasing,
  '--sticker-peel-hover-easing': props.peelHoverEasing,
  '--sticker-width': `${props.width}px`,
  '--sticker-shadow-opacity': props.shadowIntensity,
  '--sticker-lighting-constant': props.lightingIntensity,
  '--peel-direction': `${props.peelDirection}deg`,
  '--sticker-start': `calc(-1 * ${defaultPadding}px)`,
  '--sticker-end': `calc(100% + ${defaultPadding}px)`
}));

const stickerMainStyle = computed(() => ({
  clipPath: `polygon(var(--sticker-start) var(--sticker-start), var(--sticker-end) var(--sticker-start), var(--sticker-end) var(--sticker-end), var(--sticker-start) var(--sticker-end))`,
  transition: 'clip-path 0.6s ease-out',
  filter: 'url(#dropShadow)',
  willChange: 'clip-path, transform'
}));

const flapStyle = computed(() => ({
  clipPath: `polygon(var(--sticker-start) var(--sticker-start), var(--sticker-end) var(--sticker-start), var(--sticker-end) var(--sticker-start), var(--sticker-start) var(--sticker-start))`,
  top: `calc(-100% - var(--sticker-p) - var(--sticker-p))`,
  transform: 'scaleY(-1)',
  transition: 'all 0.6s ease-out',
  willChange: 'clip-path, transform'
}));

const imageStyle = computed(() => ({
  transform: `rotate(calc(${props.rotate}deg - ${props.peelDirection}deg))`,
  width: `${props.width}px`
}));

const shadowImageStyle = computed(() => ({
  ...imageStyle.value,
  filter: 'url(#expandAndFill)'
}));

const dropShadowStdDeviation = computed(() => 3 * props.shadowIntensity);
const flippedLightingConstant = computed(() => props.lightingIntensity * 7);
</script>

<template>
  <div
    ref="dragTargetRef"
    :class="[`absolute cursor-grab active:cursor-grabbing transform-gpu ${className}`]"
    :style="cssVars"
  >
    <svg width="0" height="0">
      <defs>
        <filter id="pointLight">
          <feGaussianBlur stdDeviation="1" result="blur" />
          <feSpecularLighting
            result="spec"
            in="blur"
            :specularExponent="100"
            :specularConstant="props.lightingIntensity"
            lighting-color="white"
          >
            <fePointLight ref="pointLightRef" :x="100" :y="100" :z="300" />
          </feSpecularLighting>
          <feComposite in="spec" in2="SourceGraphic" result="lit" />
          <feComposite in="lit" in2="SourceAlpha" operator="in" />
        </filter>

        <filter id="pointLightFlipped">
          <feGaussianBlur stdDeviation="10" result="blur" />
          <feSpecularLighting
            result="spec"
            in="blur"
            :specularExponent="100"
            :specularConstant="flippedLightingConstant"
            lighting-color="white"
          >
            <fePointLight ref="pointLightFlippedRef" :x="100" :y="100" :z="300" />
          </feSpecularLighting>
          <feComposite in="spec" in2="SourceGraphic" result="lit" />
          <feComposite in="lit" in2="SourceAlpha" operator="in" />
        </filter>

        <filter id="dropShadow">
          <feDropShadow
            dx="2"
            dy="4"
            :stdDeviation="dropShadowStdDeviation"
            flood-color="black"
            :flood-opacity="props.shadowIntensity"
          />
        </filter>

        <filter id="expandAndFill">
          <feOffset dx="0" dy="0" in="SourceAlpha" result="shape" />
          <feFlood flood-color="rgb(179,179,179)" result="flood" />
          <feComposite operator="in" in="flood" in2="shape" />
        </filter>
      </defs>
    </svg>

    <div
      class="relative touch-none sm:touch-auto select-none sticker-container"
      ref="containerRef"
      :style="{
        WebkitUserSelect: 'none',
        userSelect: 'none',
        WebkitTouchCallout: 'none',
        WebkitTapHighlightColor: 'transparent',
        transform: `rotate(${peelDirection}deg)`,
        transformOrigin: 'center'
      }"
    >
      <div class="sticker-main" :style="stickerMainStyle">
        <div :style="{ filter: 'url(#pointLight)' }">
          <img :src="props.imageSrc" alt="" class="block" :style="imageStyle" draggable="false" @contextmenu.prevent />
        </div>

        <div class="top-4 left-2 absolute opacity-40 w-full h-full" :style="{ filter: 'brightness(0) blur(8px)' }">
          <div class="sticker-flap" :style="flapStyle">
            <img
              :src="props.imageSrc"
              alt=""
              class="block"
              :style="shadowImageStyle"
              draggable="false"
              @contextmenu.prevent
            />
          </div>
        </div>

        <div class="left-0 absolute w-full h-full sticker-flap" :style="flapStyle">
          <div :style="{ filter: 'url(#pointLightFlipped)' }">
            <img
              :src="props.imageSrc"
              alt=""
              class="block"
              :style="shadowImageStyle"
              draggable="false"
              @contextmenu.prevent
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sticker-container:hover .sticker-main,
.sticker-container.touch-active .sticker-main {
  clip-path: polygon(
    var(--sticker-start) var(--sticker-peelback-hover),
    var(--sticker-end) var(--sticker-peelback-hover),
    var(--sticker-end) var(--sticker-end),
    var(--sticker-start) var(--sticker-end)
  ) !important;
}

.sticker-container:hover .sticker-flap,
.sticker-container.touch-active .sticker-flap {
  clip-path: polygon(
    var(--sticker-start) var(--sticker-start),
    var(--sticker-end) var(--sticker-start),
    var(--sticker-end) var(--sticker-peelback-hover),
    var(--sticker-start) var(--sticker-peelback-hover)
  ) !important;
  top: calc(-100% + 2 * var(--sticker-peelback-hover) - 1px) !important;
}

.sticker-container:active .sticker-main {
  clip-path: polygon(
    var(--sticker-start) var(--sticker-peelback-active),
    var(--sticker-end) var(--sticker-peelback-active),
    var(--sticker-end) var(--sticker-end),
    var(--sticker-start) var(--sticker-end)
  ) !important;
}

.sticker-container:active .sticker-flap {
  clip-path: polygon(
    var(--sticker-start) var(--sticker-start),
    var(--sticker-end) var(--sticker-start),
    var(--sticker-end) var(--sticker-peelback-active),
    var(--sticker-start) var(--sticker-peelback-active)
  ) !important;
  top: calc(-100% + 2 * var(--sticker-peelback-active) - 1px) !important;
}
</style>
