<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { DOT, gridLayout } from './heroUtils';

const props = defineProps<{ color: string; live: boolean }>();

const node = ref<HTMLElement | null>(null);
let observer: ResizeObserver | null = null;
let detach: (() => void) | null = null;

const clear = () => {
  node.value?.style.removeProperty('--hole-x');
  node.value?.style.removeProperty('--hole-y');
};

const move = (event: PointerEvent) => {
  const el = node.value;
  if (!el) return;
  const bounds = el.getBoundingClientRect();
  el.style.setProperty('--hole-x', `${(event.clientX - bounds.left).toFixed(1)}px`);
  el.style.setProperty('--hole-y', `${(event.clientY - bounds.top).toFixed(1)}px`);
};

const sync = (live: boolean) => {
  detach?.();
  detach = null;
  if (!live) {
    clear();
    return;
  }
  window.addEventListener('pointermove', move, { passive: true });
  detach = () => {
    window.removeEventListener('pointermove', move);
    clear();
  };
};

onMounted(() => {
  const el = node.value;
  const host = el?.parentElement;
  if (!el || !host) return;
  const layout = () => {
    const { cell, startX, startY } = gridLayout(host);
    el.style.backgroundSize = `${cell}px ${cell}px`;
    el.style.backgroundPosition = `${startX - cell / 2}px ${startY - cell / 2}px`;
  };
  observer = new ResizeObserver(layout);
  observer.observe(host);
  layout();
  sync(props.live);
});

watch(
  () => props.live,
  live => sync(live)
);

onBeforeUnmount(() => {
  observer?.disconnect();
  detach?.();
});
</script>

<template>
  <div
    ref="node"
    class="lh-dotframe"
    aria-hidden="true"
    :style="{ '--frame-color': color, '--frame-dot': `${DOT.size / 2 + 0.15}px` }"
  />
</template>
