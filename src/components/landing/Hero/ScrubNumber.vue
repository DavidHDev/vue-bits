<script setup lang="ts">
import { ref } from 'vue';
import { clamp, roundTo } from './heroUtils';

export type ScrubField = { name: string; label: string; min: number; max: number; step: number };

const props = defineProps<{ value: number; field: ScrubField }>();
const emit = defineEmits<{ change: [value: number] }>();

const active = ref(false);
let drag: { x: number; value: number } | null = null;

const down = (event: PointerEvent) => {
  event.preventDefault();
  (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
  drag = { x: event.clientX, value: props.value };
  active.value = true;
};

const move = (event: PointerEvent) => {
  if (!drag) return;
  const range = props.field.max - props.field.min;
  const delta = ((event.clientX - drag.x) / 260) * range;
  emit('change', roundTo(clamp(drag.value + delta, props.field.min, props.field.max), props.field.step));
};

const up = () => {
  drag = null;
  active.value = false;
};

const key = (event: KeyboardEvent) => {
  const direction = ({ ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 } as Record<string, number>)[event.key];
  if (!direction) return;
  event.preventDefault();
  const amount = props.field.step * (event.shiftKey ? 10 : 1) * direction;
  emit('change', roundTo(clamp(props.value + amount, props.field.min, props.field.max), props.field.step));
};
</script>

<template>
  <span
    class="lh-scrub lh-value"
    role="slider"
    tabindex="0"
    :aria-label="field.label"
    :aria-valuemin="field.min"
    :aria-valuemax="field.max"
    :aria-valuenow="value"
    :data-active="active ? '' : undefined"
    @pointerdown="down"
    @pointermove="move"
    @pointerup="up"
    @pointercancel="up"
    @keydown="key"
  >
    {{ roundTo(value, field.step) }}
  </span>
</template>
