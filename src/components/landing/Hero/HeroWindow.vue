<script setup lang="ts">
import { ref } from 'vue';

defineProps<{ title: string }>();

const offset = ref({ x: 0, y: 0 });
let drag: { x: number; y: number; start: { x: number; y: number } } | null = null;

const down = (event: PointerEvent) => {
  if (event.button !== 0 || (event.target as Element).closest('button')) return;
  if (window.matchMedia('(max-width: 768px)').matches) return;
  drag = { x: event.clientX, y: event.clientY, start: offset.value };
  (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
};

const move = (event: PointerEvent) => {
  if (!drag) return;
  offset.value = {
    x: drag.start.x + event.clientX - drag.x,
    y: drag.start.y + event.clientY - drag.y
  };
};

const up = () => {
  drag = null;
};
</script>

<template>
  <div class="lh-window" :style="{ '--wx': `${offset.x}px`, '--wy': `${offset.y}px` }">
    <div class="lh-window-bar" @pointerdown="down" @pointermove="move" @pointerup="up" @pointercancel="up">
      {{ title }}
      <slot name="action" />
    </div>
    <div class="lh-well"><slot /></div>
    <div v-if="$slots.status" class="lh-window-status"><slot name="status" /></div>
  </div>
</template>
