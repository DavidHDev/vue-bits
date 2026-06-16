<template>
  <div class="scrubber">
    <div
      ref="trackEl"
      class="scrubber-track"
      role="slider"
      :aria-label="title"
      :aria-valuemin="min"
      :aria-valuemax="max"
      :aria-valuenow="modelValue"
      :aria-disabled="isDisabled"
      :tabindex="isDisabled ? -1 : 0"
      :data-dragging="isDragging"
      :data-disabled="isDisabled"
      :data-active="isActive"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerUp"
      @lostpointercapture="onPointerUp"
      @mouseenter="isHovering = true"
      @mouseleave="isHovering = false"
      @keydown="onKeyDown"
    >
      <div class="scrubber-fill" :style="{ width: `${percentage}%` }" />

      <div class="scrubber-ticks">
        <div v-for="(pos, i) in tickPositions" :key="i" class="scrubber-tick" :style="{ left: `${pos}%` }" />
      </div>

      <div class="scrubber-thumb-wrapper" :style="{ left: `${percentage}%` }">
        <div class="scrubber-thumb" />
      </div>

      <div class="scrubber-label">
        {{ title }}
      </div>

      <div class="scrubber-value">
        {{ formattedValue }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';

const props = withDefaults(
  defineProps<{
    title?: string;
    min?: number;
    max?: number;
    step?: number;
    valueUnit?: string;
    isDisabled?: boolean;
    displayValue?: (value: number) => string;
  }>(),
  {
    title: '',
    min: 0,
    max: 100,
    step: 1,
    valueUnit: '',
    isDisabled: false
  }
);

const modelValue = defineModel<number>({ default: 0 });

const trackEl = ref<HTMLDivElement | null>(null);

const isDragging = ref(false);
const isHovering = ref(false);
const isHoverDevice = ref(false);

const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);

function stepDecimals(step: number): number {
  const s = step.toString();
  const dot = s.indexOf('.');
  return dot === -1 ? 0 : s.length - dot - 1;
}

function roundToStep(val: number, step: number, min: number): number {
  const raw = Math.round((val - min) / step) * step + min;

  const decimals = Math.max(stepDecimals(step), stepDecimals(min));

  return Number(raw.toFixed(decimals));
}

const range = computed(() => props.max - props.min);

const percentage = computed(() => (range.value > 0 ? ((modelValue.value - props.min) / range.value) * 100 : 0));

const isActive = computed(() => isDragging.value || (isHoverDevice.value && isHovering.value));

const ticks = 9;

const tickPositions = computed(() => Array.from({ length: ticks }, (_, i) => ((i + 1) / (ticks + 1)) * 100));

const formattedValue = computed(() => {
  if (props.displayValue) {
    return props.displayValue(modelValue.value);
  }

  const decimals = stepDecimals(props.step);

  return `${Number(modelValue.value.toFixed(decimals))}${props.valueUnit}`;
});

let mediaQuery: MediaQueryList | null = null;

function handleMediaChange(e: MediaQueryListEvent) {
  isHoverDevice.value = e.matches;
}

onMounted(() => {
  mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)');

  isHoverDevice.value = mediaQuery.matches;

  mediaQuery.addEventListener('change', handleMediaChange);
});

onUnmounted(() => {
  mediaQuery?.removeEventListener('change', handleMediaChange);
});

function computeValue(clientX: number): number {
  const track = trackEl.value;

  if (!track) {
    return modelValue.value;
  }

  const rect = track.getBoundingClientRect();

  const ratio = clamp((clientX - rect.left) / rect.width, 0, 1);

  const raw = props.min + ratio * range.value;

  return clamp(roundToStep(raw, props.step, props.min), props.min, props.max);
}

function onPointerDown(e: PointerEvent) {
  if (props.isDisabled) {
    return;
  }

  e.preventDefault();

  trackEl.value?.setPointerCapture(e.pointerId);

  isDragging.value = true;

  modelValue.value = computeValue(e.clientX);
}

function onPointerMove(e: PointerEvent) {
  if (!isDragging.value) {
    return;
  }

  modelValue.value = computeValue(e.clientX);
}

function onPointerUp(e: PointerEvent) {
  if (trackEl.value?.hasPointerCapture?.(e.pointerId)) {
    trackEl.value.releasePointerCapture(e.pointerId);
  }

  isDragging.value = false;
}

function onKeyDown(e: KeyboardEvent) {
  if (props.isDisabled) {
    return;
  }

  let next: number | undefined;

  switch (e.key) {
    case 'ArrowRight':
    case 'ArrowUp':
      next = modelValue.value + props.step;
      break;

    case 'ArrowLeft':
    case 'ArrowDown':
      next = modelValue.value - props.step;
      break;

    case 'Home':
      next = props.min;
      break;

    case 'End':
      next = props.max;
      break;

    default:
      return;
  }

  e.preventDefault();

  modelValue.value = clamp(roundToStep(next, props.step, props.min), props.min, props.max);
}
</script>
