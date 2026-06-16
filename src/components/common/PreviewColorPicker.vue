<template>
  <div class="scrubber" ref="wrapRef" style="position: relative">
    <div class="scrubber-track scrubber-track--color" @click="open = !open" style="cursor: pointer">
      <span class="scrubber-label">{{ title }}</span>
      <div class="scrubber-color-controls">
        <span class="scrubber-color-swatch-preview" :style="{ background: currentHex }" />
        <input
          class="scrubber-color-text"
          type="text"
          :value="textVal"
          @input="handleTextInput"
          @click.stop
          maxlength="7"
          :aria-label="`${title} hex value`"
        />
      </div>
    </div>

    <Transition name="picker">
      <div v-if="open" class="picker-dropdown">
        <!-- SV Area -->
        <div
          ref="areaRef"
          class="picker-sv-area"
          :style="{
            background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, ${hueColor})`
          }"
          @pointerdown="onAreaDown"
        >
          <div class="picker-thumb" :style="{ left: `${hsv.s * 100}%`, top: `${(1 - hsv.v) * 100}%` }" />
        </div>

        <!-- Hue bar -->
        <div ref="hueRef" class="picker-hue-bar" @pointerdown="onHueDown">
          <div class="picker-thumb picker-thumb--hue" :style="{ left: `${(hsv.h / 360) * 100}%` }" />
        </div>

        <!-- Preset swatches -->
        <div class="picker-swatches">
          <button
            v-for="c in SWATCH_PRESETS"
            :key="c"
            class="picker-swatch"
            :style="{
              background: c,
              border:
                currentHex.toLowerCase() === c.toLowerCase() ? '2px solid #fff' : '1px solid var(--border-primary)'
            }"
            @click="selectSwatch(c)"
          />
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue';

type HSV = { h: number; s: number; v: number };

const { title = '' } = defineProps<{ title?: string }>();

const modelValue = defineModel<string>({ default: '#ffffff' });

// ── colour math ───────────────────────────────────────────────────────────────
function hsvToHex(h: number, s: number, v: number): string {
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  let r: number, g: number, b: number;
  if (h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (h < 300) {
    r = x;
    g = 0;
    b = c;
  } else {
    r = c;
    g = 0;
    b = x;
  }
  const toHex = (n: number) =>
    Math.round((n + m) * 255)
      .toString(16)
      .padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function hexToHsv(hex: string): HSV {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b),
    d = max - min;
  let hue = 0;
  if (d > 0) {
    if (max === r) hue = 60 * (((g - b) / d) % 6);
    else if (max === g) hue = 60 * ((b - r) / d + 2);
    else hue = 60 * ((r - g) / d + 4);
  }
  if (hue < 0) hue += 360;
  return { h: hue, s: max === 0 ? 0 : d / max, v: max };
}

const SWATCH_PRESETS = [
  '#A855F7',
  '#7C3AED',
  '#6366F1',
  '#3B82F6',
  '#06B6D4',
  '#10B981',
  '#84CC16',
  '#EAB308',
  '#F97316',
  '#EF4444',
  '#EC4899',
  '#F43F5E',
  '#ffffff',
  '#94a3b8',
  '#000000'
];

// ── state ─────────────────────────────────────────────────────────────────────
const hsv = ref<HSV>(modelValue.value?.length >= 7 ? hexToHsv(modelValue.value) : { h: 270, s: 0.65, v: 0.97 });
const textVal = ref(modelValue.value ?? '');
const open = ref(false);

const wrapRef = ref<HTMLDivElement | null>(null);
const areaRef = ref<HTMLDivElement | null>(null);
const hueRef = ref<HTMLDivElement | null>(null);

// ── derived ───────────────────────────────────────────────────────────────────
const currentHex = computed(() => hsvToHex(hsv.value.h, hsv.value.s, hsv.value.v));
const hueColor = computed(() => hsvToHex(hsv.value.h, 1, 1));

// ── sync external model → internal ───────────────────────────────────────────
watch(modelValue, v => {
  if (v && v.length >= 7) {
    hsv.value = hexToHsv(v);
    textVal.value = v;
  }
});

// ── emit helper ───────────────────────────────────────────────────────────────
function emitColor(h: number, s: number, v: number) {
  const hex = hsvToHex(h, s, v);
  textVal.value = hex;
  modelValue.value = hex;
}

// ── outside-click close ───────────────────────────────────────────────────────
function onOutsideClick(e: PointerEvent) {
  if (wrapRef.value && !wrapRef.value.contains(e.target as Node)) open.value = false;
}
watch(open, v => {
  if (v) document.addEventListener('pointerdown', onOutsideClick);
  else document.removeEventListener('pointerdown', onOutsideClick);
});
onUnmounted(() => document.removeEventListener('pointerdown', onOutsideClick));

// ── SV area drag ──────────────────────────────────────────────────────────────
function dragArea(e: PointerEvent) {
  const rect = areaRef.value!.getBoundingClientRect();
  const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
  const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
  hsv.value = { ...hsv.value, s: x, v: 1 - y };
  emitColor(hsv.value.h, hsv.value.s, hsv.value.v);
}
function onAreaDown(e: PointerEvent) {
  e.preventDefault();
  dragArea(e);
  const onMove = (ev: PointerEvent) => dragArea(ev);
  const onUp = () => {
    document.removeEventListener('pointermove', onMove);
    document.removeEventListener('pointerup', onUp);
  };
  document.addEventListener('pointermove', onMove);
  document.addEventListener('pointerup', onUp);
}

// ── hue bar drag ──────────────────────────────────────────────────────────────
function dragHue(e: PointerEvent) {
  const rect = hueRef.value!.getBoundingClientRect();
  const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
  hsv.value = { ...hsv.value, h: x * 360 };
  emitColor(hsv.value.h, hsv.value.s, hsv.value.v);
}
function onHueDown(e: PointerEvent) {
  e.preventDefault();
  dragHue(e);
  const onMove = (ev: PointerEvent) => dragHue(ev);
  const onUp = () => {
    document.removeEventListener('pointermove', onMove);
    document.removeEventListener('pointerup', onUp);
  };
  document.addEventListener('pointermove', onMove);
  document.addEventListener('pointerup', onUp);
}

// ── text input ────────────────────────────────────────────────────────────────
function handleTextInput(e: Event) {
  const val = (e.target as HTMLInputElement).value;
  textVal.value = val;
  if (/^#[0-9a-fA-F]{6}$/.test(val)) {
    hsv.value = hexToHsv(val);
    modelValue.value = val;
  }
}

// ── swatch ────────────────────────────────────────────────────────────────────
function selectSwatch(c: string) {
  hsv.value = hexToHsv(c);
  textVal.value = c;
  modelValue.value = c;
}
</script>

<style scoped>
.picker-dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  z-index: 50;
  background: var(--bg-elevated);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-sm);
  padding: 12px;
  box-shadow: var(--shadow-dropdown);
}

.picker-sv-area {
  position: relative;
  width: 100%;
  height: 150px;
  border-radius: 8px;
  cursor: crosshair;
  margin-bottom: 10px;
}

.picker-hue-bar {
  position: relative;
  width: 100%;
  height: 14px;
  border-radius: 7px;
  cursor: pointer;
  background: linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00);
  margin-bottom: 10px;
}

.picker-thumb {
  position: absolute;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid #fff;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.6);
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.picker-thumb--hue {
  top: 50%;
}

.picker-swatches {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.picker-swatch {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  cursor: pointer;
  padding: 0;
}

.picker-enter-active,
.picker-leave-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}
.picker-enter-from,
.picker-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
