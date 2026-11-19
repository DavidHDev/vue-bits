<template>
  <div class="scrubber">
    <div
      ref="trackRef"
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
      @pointercancel="onPointerCancel"
      @mouseenter="isHovering = true"
      @mouseleave="isHovering = false"
      @keydown="onKeyDown"
    >
      <div class="scrubber-fill" :style="{ width: `${percentage}%` }" />

      <div class="scrubber-ticks">
        <div v-for="(pos, i) in TICK_POSITIONS" :key="i" class="scrubber-tick" :style="{ left: `${pos}%` }" />
      </div>

      <div class="scrubber-thumb-wrapper" :style="{ left: `${percentage}%` }">
        <div class="scrubber-thumb" />
      </div>

      <div class="scrubber-label">{{ title }}</div>
      <div class="scrubber-value">{{ formattedValue }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useScrubGesture } from '@/composables/useScrubGesture';

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

const TICKS = 9;
const TICK_POSITIONS = Array.from({ length: TICKS }, (_, i) => ((i + 1) / (TICKS + 1)) * 100);

const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);
const stepDecimals = (step: number) => {
  const s = step.toString();
  const dot = s.indexOf('.');
  return dot === -1 ? 0 : s.length - dot - 1;
};
const roundToStep = (val: number, step: number, min: number) => {
  const raw = Math.round((val - min) / step) * step + min;
  const decimals = Math.max(stepDecimals(step), stepDecimals(min));
  return Number(raw.toFixed(decimals));
};

const trackRef = ref<HTMLElement | null>(null);
const isHovering = ref(false);
const isHoverDevice = ref(false);

const percentage = computed(() => {
  const range = props.max - props.min;
  return range > 0 ? ((modelValue.value - props.min) / range) * 100 : 0;
});

const computeValue = (clientX: number) => {
  const track = trackRef.value;
  if (!track) return modelValue.value;
  const rect = track.getBoundingClientRect();
  const ratio = clamp((clientX - rect.left) / rect.width, 0, 1);
  const raw = props.min + ratio * (props.max - props.min);
  return clamp(roundToStep(raw, props.step, props.min), props.min, props.max);
};

const setValue = (value: number) => {
  modelValue.value = value;
};

const { isDragging, onPointerDown, onPointerMove, onPointerUp, onPointerCancel } = useScrubGesture({
  trackRef,
  computeValue,
  onChange: setValue,
  isDisabled: () => props.isDisabled
});

const isActive = computed(() => isDragging.value || (isHoverDevice.value && isHovering.value));

const formattedValue = computed(() =>
  props.displayValue
    ? props.displayValue(modelValue.value)
    : `${Number(modelValue.value.toFixed(stepDecimals(props.step)))}${props.valueUnit}`
);

function onKeyDown(e: KeyboardEvent) {
  if (props.isDisabled) return;
  let next: number;
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
  setValue(clamp(roundToStep(next, props.step, props.min), props.min, props.max));
}

let mq: MediaQueryList | null = null;
const onMediaChange = (e: MediaQueryListEvent) => {
  isHoverDevice.value = e.matches;
};

onMounted(() => {
  mq = window.matchMedia('(hover: hover) and (pointer: fine)');
  isHoverDevice.value = mq.matches;
  mq.addEventListener('change', onMediaChange);
});

onBeforeUnmount(() => {
  mq?.removeEventListener('change', onMediaChange);
});
</script>
