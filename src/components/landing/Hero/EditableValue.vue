<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

import ColorValue from './ColorValue.vue';

import { playSound } from '@/utils/audio';

type Type = 'color' | 'boolean' | 'number';

interface Props {
  type: Type;
  value: string | number | boolean;
  onChange: (v: string | number | boolean) => void;
  min?: number;
  max?: number;
  step?: number;
}

const props = withDefaults(defineProps<Props>(), {
  min: 0,
  max: 1,
  step: 0.01
});

const numEl = ref<HTMLSpanElement | null>(null);

function formatValue(val: number, s: number): string {
  if (s >= 1) {
    return String(Math.round(val));
  }

  const d = Math.max(0, Math.ceil(-Math.log10(s)));

  return val.toFixed(d);
}

function handlePointerDown(e: PointerEvent) {
  e.preventDefault();

  const startX = e.clientX;
  const startVal = props.value as number;

  let moved = false;
  let lastVal = startVal;

  document.body.style.cursor = 'ew-resize';
  document.body.style.userSelect = 'none';

  const onMove = (ev: PointerEvent) => {
    const dx = ev.clientX - startX;

    if (!moved && Math.abs(dx) > 2) {
      moved = true;
    }

    if (!moved) return;

    const sens = ev.shiftKey ? 0.02 : 0.15;

    let next = startVal + dx * props.step * sens;

    next = Math.round(next / props.step) * props.step;

    const clamped = Math.max(props.min, Math.min(props.max, next));

    if (clamped !== lastVal) {
      playSound('tick', 0.25, 60);
    }

    lastVal = clamped;

    props.onChange(clamped);
  };

  const onUp = () => {
    document.removeEventListener('pointermove', onMove);

    document.removeEventListener('pointerup', onUp);

    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  };

  document.addEventListener('pointermove', onMove);

  document.addEventListener('pointerup', onUp);
}

let wheelHandler: ((e: WheelEvent) => void) | null = null;

onMounted(() => {
  if (!numEl.value || props.type !== 'number') {
    return;
  }

  wheelHandler = (e: WheelEvent) => {
    e.preventDefault();

    const v = props.value as number;

    const dir = e.deltaY < 0 ? 1 : -1;

    let next = v + dir * props.step;

    next = Math.round(next / props.step) * props.step;

    const clamped = Math.max(props.min, Math.min(props.max, next));

    if (clamped !== v) {
      playSound('tick', 0.25, 60);
    }

    props.onChange(clamped);
  };

  numEl.value.addEventListener('wheel', wheelHandler, { passive: false });
});

onUnmounted(() => {
  if (numEl.value && wheelHandler) {
    numEl.value.removeEventListener('wheel', wheelHandler);
  }
});
</script>

<template>
  <ColorValue v-if="props.type === 'color'" :value="props.value as string" :onChange="v => props.onChange(v)" />

  <button
    v-else-if="props.type === 'boolean'"
    class="ln-hero-code-value ln-hero-code-value--bool"
    @click="
      () => {
        playSound('toggle');
        props.onChange(!(props.value as boolean));
      }
    "
  >
    {{ String(props.value) }}
  </button>

  <span
    v-else
    ref="numEl"
    class="ln-hero-code-value ln-hero-code-value--number"
    role="slider"
    tabindex="-1"
    :aria-valuenow="props.value as number"
    :aria-valuemin="props.min"
    :aria-valuemax="props.max"
    @pointerdown="handlePointerDown"
  >
    {{ formatValue(props.value as number, props.step) }}
  </span>
</template>
