<template>
  <div
    ref="containerRef"
    :class="[
      className,
      'bg-[#222] text-white rounded-[15px] border-2 border-white w-[300px] max-w-full relative overflow-hidden'
    ]"
    :style="style"
    :tabindex="0"
    @mouseenter="!isTouchDevice ? handleEnter() : undefined"
    @mouseleave="!isTouchDevice ? handleLeave() : undefined"
    @click="isTouchDevice ? handleClick() : undefined"
    @focus="!isTouchDevice ? handleEnter() : undefined"
    @blur="!isTouchDevice ? handleLeave() : undefined"
  >
    <div :style="{ paddingTop: aspectRatio }" />

    <div class="absolute inset-0 w-full h-full" :aria-hidden="isActive">
      <slot name="first" />
    </div>

    <div
      ref="activeRef"
      class="z-[2] absolute inset-0 w-full h-full"
      :style="{ display: 'none' }"
      :aria-hidden="!isActive"
    >
      <slot name="second" />
    </div>

    <div ref="pixelGridRef" class="z-[3] absolute inset-0 w-full h-full pointer-events-none" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, type CSSProperties } from 'vue';
import { gsap } from 'gsap';

interface PixelTransitionProps {
  gridSize?: number;
  pixelColor?: string;
  animationStepDuration?: number;
  once?: boolean;
  className?: string;
  style?: CSSProperties;
  aspectRatio?: string;
}

const props = withDefaults(defineProps<PixelTransitionProps>(), {
  gridSize: 7,
  pixelColor: 'currentColor',
  animationStepDuration: 0.3,
  once: false,
  aspectRatio: '100%',
  className: '',
  style: () => ({})
});

const containerRef = ref<HTMLDivElement | null>(null);
const pixelGridRef = ref<HTMLDivElement | null>(null);
const activeRef = ref<HTMLDivElement | null>(null);
const delayedCallRef = ref<gsap.core.Tween | null>(null);

const isActive = ref<boolean>(false);

const isTouchDevice =
  'ontouchstart' in window || navigator.maxTouchPoints > 0 || window.matchMedia('(pointer: coarse)').matches;

const buildGrid = () => {
  const pixelGridEl = pixelGridRef.value;
  if (!pixelGridEl) return;

  pixelGridEl.innerHTML = '';

  for (let row = 0; row < props.gridSize; row++) {
    for (let col = 0; col < props.gridSize; col++) {
      const pixel = document.createElement('div');
      pixel.classList.add('pixelated-image-card__pixel', 'absolute', 'hidden');
      pixel.style.backgroundColor = props.pixelColor;

      const size = 100 / props.gridSize;
      pixel.style.width = `${size}%`;
      pixel.style.height = `${size}%`;
      pixel.style.left = `${col * size}%`;
      pixel.style.top = `${row * size}%`;

      pixelGridEl.appendChild(pixel);
    }
  }
};

const animatePixels = (activate: boolean): void => {
  isActive.value = activate;

  const pixelGridEl = pixelGridRef.value;
  const activeEl = activeRef.value;
  if (!pixelGridEl || !activeEl) return;

  const pixels = pixelGridEl.querySelectorAll<HTMLDivElement>('.pixelated-image-card__pixel');
  if (!pixels.length) return;

  gsap.killTweensOf(pixels);
  if (delayedCallRef.value) {
    delayedCallRef.value.kill();
  }

  gsap.set(pixels, { display: 'none' });

  const totalPixels = pixels.length;
  const staggerDuration = props.animationStepDuration / totalPixels;

  gsap.to(pixels, {
    display: 'block',
    duration: 0,
    stagger: {
      each: staggerDuration,
      from: 'random'
    }
  });

  delayedCallRef.value = gsap.delayedCall(props.animationStepDuration, () => {
    activeEl.style.display = activate ? 'block' : 'none';
    activeEl.style.pointerEvents = activate ? 'none' : '';
  });

  gsap.to(pixels, {
    display: 'none',
    duration: 0,
    delay: props.animationStepDuration,
    stagger: {
      each: staggerDuration,
      from: 'random'
    }
  });
};

const handleEnter = (): void => {
  if (!isActive.value) animatePixels(true);
};

const handleLeave = (): void => {
  if (isActive.value && !props.once) animatePixels(false);
};

const handleClick = (): void => {
  if (!isActive.value) animatePixels(true);
  else if (isActive.value && !props.once) animatePixels(false);
};

onMounted(() => {
  buildGrid();
});

onUnmounted(() => {
  if (delayedCallRef.value) {
    delayedCallRef.value.kill();
  }
});

watch(
  () => [props.gridSize, props.pixelColor],
  () => {
    buildGrid();
  }
);
</script>
