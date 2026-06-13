<script setup lang="ts">
import { playSound } from '@/utils/audio';
import { hexToHsv, hsvToHex } from '@/utils/color';
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

interface Props {
  value: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'change', value: string): void;
}>();

const COLOR_PRESETS = [
  '#FF3E00',
  '#FF8A4C',
  '#F97316',
  '#EAB308',
  '#10B981',
  '#06B6D4',
  '#3B82F6',
  '#6366F1',
  '#EC4899',
  '#EF4444'
];

const open = ref(false);

const hsv = ref(hexToHsv(props.value));

const wrapEl = ref<HTMLSpanElement | null>(null);
const areaEl = ref<HTMLDivElement | null>(null);
const hueEl = ref<HTMLDivElement | null>(null);

watch(
  () => props.value,
  val => {
    if (open.value) return;
    hsv.value = hexToHsv(val);
  }
);

const onClickOutside = (e: PointerEvent) => {
  if (!open.value) return;

  if (wrapEl.value && !wrapEl.value.contains(e.target as Node)) {
    open.value = false;
  }
};

onMounted(() => {
  document.addEventListener('pointerdown', onClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onClickOutside);
});

function applyHsv(next: { h: number; s: number; v: number }) {
  hsv.value = next;
  emit('change', hsvToHex(next.h, next.s, next.v));
}

function startDrag(onMove: (e: PointerEvent) => void, onEnd?: () => void) {
  document.addEventListener('pointermove', onMove);

  const onUp = () => {
    document.removeEventListener('pointermove', onMove);
    document.removeEventListener('pointerup', onUp);
    onEnd?.();
  };

  document.addEventListener('pointerup', onUp);
}

function onAreaDown(e: PointerEvent) {
  e.preventDefault();
  e.stopPropagation();

  const update = (ev: PointerEvent) => {
    if (!areaEl.value) return;

    const rect = areaEl.value.getBoundingClientRect();

    const x = Math.max(0, Math.min(1, (ev.clientX - rect.left) / rect.width));

    const y = Math.max(0, Math.min(1, (ev.clientY - rect.top) / rect.height));

    applyHsv({
      h: hsv.value.h,
      s: x,
      v: 1 - y
    });
  };

  update(e);
  startDrag(update);
}

function onHueDown(e: PointerEvent) {
  e.preventDefault();
  e.stopPropagation();

  const update = (ev: PointerEvent) => {
    if (!hueEl.value) return;

    const rect = hueEl.value.getBoundingClientRect();

    const x = Math.max(0, Math.min(1, (ev.clientX - rect.left) / rect.width));

    applyHsv({
      h: x * 360,
      s: hsv.value.s,
      v: hsv.value.v
    });
  };

  update(e);
  startDrag(update);
}

const hueColor = computed(() => hsvToHex(hsv.value.h, 1, 1));

function toggleOpen() {
  open.value = !open.value;
}

function onToggleKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    toggleOpen();
  }
}

function selectPreset(color: string) {
  playSound('color');

  hsv.value = hexToHsv(color);

  emit('change', color);
}
</script>

<template>
  <span ref="wrapEl" class="ln-hero-code-value ln-hero-code-value--color" style="position: relative">
    <span
      class="ln-hero-code-swatch"
      :style="{
        background: props.value,
        cursor: 'pointer'
      }"
      role="button"
      tabindex="0"
      aria-label="Open color picker"
      @click="toggleOpen"
      @keydown="onToggleKeydown"
    />

    <span style="cursor: pointer" role="button" tabindex="0" @click="toggleOpen" @keydown="onToggleKeydown">
      "{{ props.value }}"
    </span>

    <div v-if="open" class="ln-hero-color-picker">
      <div
        ref="areaEl"
        class="ln-hero-color-picker-area"
        role="slider"
        tabindex="-1"
        aria-label="Saturation and value"
        :aria-valuenow="hsv.s"
        :style="{
          background: `
            linear-gradient(to top, #000, transparent),
            linear-gradient(to right, #fff, ${hueColor})
          `
        }"
        @pointerdown="onAreaDown"
      >
        <div
          class="ln-hero-color-picker-thumb"
          :style="{
            left: `${hsv.s * 100}%`,
            top: `${(1 - hsv.v) * 100}%`
          }"
        />
      </div>

      <div
        ref="hueEl"
        class="ln-hero-color-picker-hue"
        role="slider"
        tabindex="-1"
        aria-label="Hue"
        :aria-valuenow="hsv.h"
        @pointerdown="onHueDown"
      >
        <div
          class="ln-hero-color-picker-thumb"
          :style="{
            left: `${(hsv.h / 360) * 100}%`,
            top: '50%'
          }"
        />
      </div>

      <div class="ln-hero-color-picker-presets">
        <button
          v-for="c in COLOR_PRESETS"
          :key="c"
          class="ln-hero-color-picker-preset"
          :style="{
            background: c,
            borderColor: props.value.toLowerCase() === c.toLowerCase() ? '#fff' : 'rgba(255,255,255,0.12)'
          }"
          :aria-label="`Preset ${c}`"
          @click="selectPreset(c)"
        />
      </div>
    </div>
  </span>
</template>
