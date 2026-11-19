<template>
  <div ref="wrapRef" :class="chip ? 'scrubber-chip-wrap' : 'scrubber'">
    <button
      v-if="chip"
      ref="triggerRef"
      type="button"
      class="scrubber-color-chip cp-chip"
      :data-checker="checker || undefined"
      :style="swatchStyle"
      :aria-label="`${title}: ${output}`"
      aria-haspopup="dialog"
      :aria-expanded="open"
      @click="open = !open"
    />
    <div v-else class="scrubber-track scrubber-track--color cp-row">
      <button
        ref="triggerRef"
        type="button"
        class="cp-row-trigger"
        aria-haspopup="dialog"
        :aria-expanded="open"
        :aria-label="`${title}: ${output}`"
        @click="open = !open"
      >
        <span class="scrubber-label">{{ title }}</span>
      </button>
      <div class="scrubber-color-controls">
        <button
          type="button"
          class="scrubber-color-swatch-preview cp-preview"
          :data-checker="checker || undefined"
          :style="swatchStyle"
          tabindex="-1"
          aria-hidden="true"
          @click="open = !open"
        />
        <input
          class="scrubber-color-text cp-row-input"
          type="text"
          :value="rowText ?? output"
          spellcheck="false"
          autocomplete="off"
          :aria-label="`${title} value`"
          @focus="onRowFocus"
          @input="rowText = ($event.target as HTMLInputElement).value"
          @blur="applyText(rowText ?? output, () => (rowText = null))"
          @keydown="onRowKey"
        />
      </div>
    </div>

    <Teleport to="body">
      <div
        v-if="open && anchor"
        ref="popoverRef"
        class="cp-popover"
        role="dialog"
        :aria-label="`${title} color`"
        :data-placement="placement"
        :style="{
          left: `${popLeft}px`,
          width: `${popWidth}px`,
          top: `${popTop}px`,
          '--cp-hue': hueColor,
          '--cp-opaque': opaque
        }"
      >
        <div
          ref="areaRef"
          class="cp-area"
          role="slider"
          tabindex="0"
          aria-label="Saturation and brightness"
          :aria-valuetext="`Saturation ${Math.round(hsva.s * 100)}%, brightness ${Math.round(hsva.v * 100)}%`"
          @keydown="onAreaKey"
          v-on="areaDrag"
        >
          <span
            class="cp-area-thumb"
            :style="{ left: `${hsva.s * 100}%`, top: `${(1 - hsva.v) * 100}%`, background: opaque }"
          />
        </div>

        <div class="cp-sliders">
          <button
            v-if="hasDropper"
            type="button"
            class="cp-icon-button"
            aria-label="Pick a color from the screen"
            @click="pick"
          >
            <HugeiconsIcon :icon="ColorPickerIcon" :size="16" :stroke-width="1.6" aria-hidden="true" />
          </button>
          <div class="cp-slider-stack">
            <div
              ref="hueRef"
              class="cp-slider cp-slider--hue"
              role="slider"
              tabindex="0"
              aria-label="Hue"
              :aria-valuemin="0"
              :aria-valuemax="360"
              :aria-valuenow="Math.round(hsva.h)"
              @keydown="onSliderKey($event, 'h', 360)"
              v-on="hueDrag"
            >
              <span class="cp-slider-thumb" :style="{ left: `${(hsva.h / 360) * 100}%`, background: hueColor }" />
            </div>
            <div
              v-if="alpha"
              ref="alphaRef"
              class="cp-slider cp-slider--alpha"
              role="slider"
              tabindex="0"
              aria-label="Opacity"
              :aria-valuemin="0"
              :aria-valuemax="100"
              :aria-valuenow="Math.round(hsva.a * 100)"
              @keydown="onSliderKey($event, 'a', 1)"
              v-on="alphaDrag"
            >
              <span class="cp-slider-fill" />
              <span class="cp-slider-thumb" :style="{ left: `${hsva.a * 100}%`, '--cp-thumb': output }" />
            </div>
          </div>
        </div>

        <div class="cp-fields">
          <button
            type="button"
            class="cp-format"
            :aria-label="`Color format: ${FORMAT_LABELS[format]}. Change format`"
            @click="cycleFormat"
          >
            {{ FORMAT_LABELS[format] }}
          </button>
          <label v-if="format === 'hex'" class="cp-channel cp-channel--wide">
            <input
              class="cp-input"
              :value="hexText ?? toHex(rgba, false)"
              spellcheck="false"
              autocomplete="off"
              aria-label="Hex"
              @focus="onHexFocus"
              @input="hexText = ($event.target as HTMLInputElement).value"
              @blur="applyText(hexText ?? '', () => (hexText = null))"
              @keydown="onHexKey"
            />
            <span class="cp-channel-label">Hex</span>
          </label>
          <template v-if="format === 'rgb'">
            <ColorChannelInput
              v-for="key in RGB_KEYS"
              :key="key"
              :label="key.toUpperCase()"
              :value="Math.round(rgba[key] * 255)"
              :min="0"
              :max="255"
              @commit="next => commitColor({ ...rgba, [key]: next / 255 })"
            />
          </template>
          <template v-if="format === 'hsl'">
            <ColorChannelInput
              label="H"
              :value="hsl.h"
              :min="0"
              :max="360"
              @commit="next => commit({ ...hsvaState, h: next })"
            />
            <ColorChannelInput label="S" :value="hsl.s" :min="0" :max="100" @commit="commitSaturation" />
            <ColorChannelInput label="L" :value="hsl.l" :min="0" :max="100" @commit="commitLightness" />
          </template>
          <ColorChannelInput
            v-if="alpha"
            label="A"
            suffix=" %"
            :value="Math.round(hsva.a * 100)"
            :min="0"
            :max="100"
            @commit="next => commit({ ...hsvaState, a: round(next / 100) })"
          />
          <button type="button" class="cp-icon-button" :aria-label="copied ? 'Copied' : 'Copy color'" @click="copy">
            <HugeiconsIcon :icon="copied ? Tick02Icon : Copy01Icon" :size="15" :stroke-width="1.6" aria-hidden="true" />
          </button>
        </div>

        <div class="cp-swatches" role="group" aria-label="Swatches">
          <button
            v-for="swatch in SWATCHES"
            :key="swatch"
            type="button"
            class="cp-swatch"
            :style="{ '--cp-color': swatch }"
            :aria-label="swatch"
            :aria-pressed="toHex(rgba, false) === swatch"
            @click="commitColor({ ...(parseColor(swatch) as Rgba), a: hsvaState.a })"
          />
        </div>

        <div v-if="recent.length > 0" class="cp-recent">
          <span class="cp-recent-label">Recent</span>
          <div class="cp-swatches" role="group" aria-label="Recent colors">
            <button
              v-for="item in recent"
              :key="item"
              type="button"
              class="cp-swatch"
              :data-checker="item.length > 7 || undefined"
              :style="{ '--cp-color': item }"
              :aria-label="item"
              :aria-pressed="output === item"
              @click="pickRecent(item)"
            />
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';
import { HugeiconsIcon } from '@hugeicons/vue';
import { ColorPickerIcon, Copy01Icon, Tick02Icon } from '@hugeicons/core-free-icons';
import ColorChannelInput from './ColorChannelInput.vue';
import {
  formatColor,
  hsvaToRgba,
  parseColor,
  rgbaToHsva,
  toHex,
  type ColorFormat,
  type Hsva,
  type Rgba
} from './colorMath';

const SWATCHES = [
  '#7cff67',
  '#42b883',
  '#6366f1',
  '#3b82f6',
  '#06b6d4',
  '#10b981',
  '#84cc16',
  '#eab308',
  '#f97316',
  '#ef4444',
  '#ec4899',
  '#f43f5e',
  '#ffffff',
  '#94a3b8',
  '#000000'
];

const FORMATS: ColorFormat[] = ['hex', 'rgb', 'hsl'];
const FORMAT_LABELS: Record<ColorFormat, string> = { hex: 'Hex', rgb: 'RGB', hsl: 'HSL' };
const RGB_KEYS = ['r', 'g', 'b'] as const;
const RECENT_KEY = 'vb-color-recent';
const RECENT_MAX = 10;
const FALLBACK: Hsva = { h: 112, s: 0.6, v: 1, a: 1 };
const GAP = 6;
const MARGIN = 8;

const props = withDefaults(
  defineProps<{
    title?: string;
    color?: string;
    variant?: 'row' | 'swatch';
    alpha?: boolean;
  }>(),
  { title: '', color: undefined, variant: 'row', alpha: false }
);

const emit = defineEmits<{ change: [value: string] }>();

const modelValue = defineModel<string>({ default: undefined });

const incomingColor = computed(() => (props.color !== undefined ? props.color : modelValue.value));

const readRecent = (): string[] => {
  try {
    const list = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
    return Array.isArray(list) ? list.filter(item => typeof item === 'string').slice(0, RECENT_MAX) : [];
  } catch {
    return [];
  }
};

const writeRecent = (value: string) => {
  try {
    const next = [value, ...readRecent().filter(item => item !== value)].slice(0, RECENT_MAX);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {
    return;
  }
};

const clamp = (value: number, min = 0, max = 1) => Math.min(Math.max(value, min), max);
const round = (value: number) => Math.round(value * 1000) / 1000;

const toState = (color: unknown, previous: Hsva | null) => {
  const rgba = parseColor(color);
  return rgba ? rgbaToHsva(rgba, previous) : previous || FALLBACK;
};

const outputOf = (state: Hsva, withAlpha: boolean) => toHex(hsvaToRgba(state), withAlpha);

const hsva = ref<Hsva>(toState(incomingColor.value, null));
let hsvaState: Hsva = hsva.value;
const open = ref(false);
const format = ref<ColorFormat>(sharedFormat.value);
const anchor = ref<DOMRect | null>(null);
const placement = ref<'below' | 'above'>('below');
const rowText = ref<string | null>(null);
const hexText = ref<string | null>(null);
const copied = ref(false);
const recent = ref<string[]>(readRecent());
let emitted: string | null = null;
let openedWith: string | null = null;

const wrapRef = ref<HTMLElement | null>(null);
const triggerRef = ref<HTMLElement | null>(null);
const popoverRef = ref<HTMLElement | null>(null);
const areaRef = ref<HTMLElement | null>(null);
const hueRef = ref<HTMLElement | null>(null);
const alphaRef = ref<HTMLElement | null>(null);

const hasDropper = typeof window !== 'undefined' && 'EyeDropper' in window;
const output = computed(() => outputOf(hsva.value, props.alpha));
const rgba = computed(() => hsvaToRgba(hsva.value));
const opaque = computed(() => toHex({ ...rgba.value, a: 1 }));
const hueColor = computed(() => toHex(hsvaToRgba({ h: hsva.value.h, s: 1, v: 1, a: 1 })));
const chip = computed(() => props.variant === 'swatch');
const checker = computed(() => props.alpha && hsva.value.a < 1);
const swatchStyle = computed(() => ({ '--cp-color': output.value }));

const hsl = computed(() => {
  const { r, g, b } = rgba.value;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  return { h: Math.round(hsva.value.h), s: Math.round(clamp(s) * 100), l: Math.round(l * 100) };
});

const popWidth = computed(() => (chip.value ? 260 : clamp(anchor.value?.width ?? 260, 260, 320)));
const popLeft = computed(() => {
  const a = anchor.value;
  if (!a) return 0;
  const width = popWidth.value;
  return clamp(chip.value ? a.left + a.width / 2 - width / 2 : a.left, MARGIN, window.innerWidth - width - MARGIN);
});
const popTop = computed(() => {
  const a = anchor.value;
  if (!a) return 0;
  return placement.value === 'below' ? a.bottom + GAP : a.top - GAP;
});

watch([incomingColor, () => props.alpha], ([color]) => {
  if (color === undefined || color === null) return;
  const incoming = parseColor(color);
  if (!incoming) return;
  if (emitted && toHex(incoming, props.alpha) === emitted) return;
  emitted = null;
  const next = rgbaToHsva(incoming, hsvaState);
  hsvaState = next;
  hsva.value = next;
});

function commit(next: Hsva) {
  const value: Hsva = {
    h: clamp(next.h, 0, 360),
    s: clamp(next.s),
    v: clamp(next.v),
    a: props.alpha ? clamp(next.a) : 1
  };
  hsvaState = value;
  hsva.value = value;
  const hex = outputOf(value, props.alpha);
  if (hex === emitted) return;
  emitted = hex;
  modelValue.value = hex;
  emit('change', hex);
}

function commitColor(color: Rgba) {
  commit(rgbaToHsva({ ...color, a: props.alpha ? color.a : 1 }, hsvaState));
}

function commitSaturation(next: number) {
  commitColor({
    ...(parseColor(`hsl(${hsl.value.h}, ${next}%, ${hsl.value.l}%)`) || rgba.value),
    a: hsvaState.a
  });
}

function commitLightness(next: number) {
  commitColor({
    ...(parseColor(`hsl(${hsl.value.h}, ${hsl.value.s}%, ${next}%)`) || rgba.value),
    a: hsvaState.a
  });
}

function cycleFormat() {
  const next = FORMATS[(FORMATS.indexOf(format.value) + 1) % FORMATS.length];
  sharedFormat.value = next;
  format.value = next;
}

function close(focusTrigger = false) {
  open.value = false;
  if (focusTrigger) triggerRef.value?.focus({ preventScroll: true });
}

const onDocPointer = (event: PointerEvent) => {
  const target = event.target as Node;
  if (wrapRef.value?.contains(target) || popoverRef.value?.contains(target)) return;
  close();
};

const onDocKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    event.stopPropagation();
    close(true);
  }
};

const updateAnchor = () => {
  if (wrapRef.value) anchor.value = wrapRef.value.getBoundingClientRect();
};

const detach = () => {
  document.removeEventListener('pointerdown', onDocPointer, true);
  document.removeEventListener('keydown', onDocKey, true);
  window.removeEventListener('scroll', updateAnchor, true);
  window.removeEventListener('resize', updateAnchor);
};

watch(open, value => {
  if (value) {
    openedWith = outputOf(hsvaState, props.alpha);
    recent.value = readRecent();
    updateAnchor();
    document.addEventListener('pointerdown', onDocPointer, true);
    document.addEventListener('keydown', onDocKey, true);
    window.addEventListener('scroll', updateAnchor, true);
    window.addEventListener('resize', updateAnchor);
    return;
  }
  detach();
  if (openedWith && openedWith !== outputOf(hsvaState, props.alpha)) writeRecent(outputOf(hsvaState, props.alpha));
  openedWith = null;
});

watch(
  [open, anchor, format, () => props.alpha, () => recent.value.length],
  async () => {
    if (!open.value || !anchor.value) return;
    await nextTick();
    if (!popoverRef.value || !anchor.value) return;
    const height = popoverRef.value.offsetHeight;
    const below = window.innerHeight - anchor.value.bottom - GAP - MARGIN;
    const above = anchor.value.top - GAP - MARGIN;
    placement.value = height > below && above > below ? 'above' : 'below';
  },
  { flush: 'post' }
);

onBeforeUnmount(detach);

const useDrag = (target: typeof areaRef, onValue: (point: { x: number; y: number }) => void) => {
  let active = false;
  const read = (event: PointerEvent) => {
    const rect = (target.value as HTMLElement).getBoundingClientRect();
    return {
      x: clamp((event.clientX - rect.left) / Math.max(rect.width, 1)),
      y: clamp((event.clientY - rect.top) / Math.max(rect.height, 1))
    };
  };
  return {
    pointerdown: (event: PointerEvent) => {
      if (event.button !== 0) return;
      event.preventDefault();
      active = true;
      const el = event.currentTarget as HTMLElement;
      try {
        el.setPointerCapture(event.pointerId);
      } catch {
        active = true;
      }
      el.focus({ preventScroll: true });
      onValue(read(event));
    },
    pointermove: (event: PointerEvent) => {
      if (active) onValue(read(event));
    },
    pointerup: () => {
      active = false;
    },
    pointercancel: () => {
      active = false;
    },
    lostpointercapture: () => {
      active = false;
    }
  };
};

const areaDrag = useDrag(areaRef, ({ x, y }) => commit({ ...hsvaState, s: x, v: 1 - y }));
const hueDrag = useDrag(hueRef, ({ x }) => commit({ ...hsvaState, h: x * 360 }));
const alphaDrag = useDrag(alphaRef, ({ x }) => commit({ ...hsvaState, a: x }));

const stepFor = (event: KeyboardEvent) => (event.shiftKey ? 10 : 1);

function onAreaKey(event: KeyboardEvent) {
  const step = stepFor(event) / 100;
  const moves: Record<string, [number, number]> = {
    ArrowLeft: [-step, 0],
    ArrowRight: [step, 0],
    ArrowUp: [0, step],
    ArrowDown: [0, -step]
  };
  const move = moves[event.key];
  if (!move) return;
  event.preventDefault();
  commit({ ...hsvaState, s: hsvaState.s + move[0], v: hsvaState.v + move[1] });
}

function onSliderKey(event: KeyboardEvent, key: 'h' | 'a', scale: number) {
  const delta = ({ ArrowLeft: -1, ArrowDown: -1, ArrowRight: 1, ArrowUp: 1 } as Record<string, number>)[event.key];
  if (delta === undefined && event.key !== 'Home' && event.key !== 'End') return;
  event.preventDefault();
  const current = hsvaState[key];
  const next =
    event.key === 'Home' ? 0 : event.key === 'End' ? scale : current + (delta * stepFor(event) * scale) / 100;
  commit({ ...hsvaState, [key]: key === 'h' ? clamp(next, 0, 360) : clamp(next) });
}

async function pick() {
  try {
    const EyeDropperCtor = (window as unknown as { EyeDropper: new () => { open: () => Promise<{ sRGBHex: string }> } })
      .EyeDropper;
    const result = await new EyeDropperCtor().open();
    const picked = parseColor(result.sRGBHex);
    if (picked) commitColor({ ...picked, a: hsvaState.a });
  } catch {
    return;
  }
}

async function copy() {
  try {
    await navigator.clipboard.writeText(formatColor(hsvaState, format.value, props.alpha));
    copied.value = true;
    setTimeout(() => (copied.value = false), 1200);
  } catch {
    copied.value = false;
  }
}

function applyText(text: string, revert: () => void) {
  const parsed = parseColor(text);
  if (parsed) commitColor(parsed);
  revert();
}

function onRowFocus(event: FocusEvent) {
  rowText.value = output.value;
  (event.target as HTMLInputElement).select();
}

function onRowKey(event: KeyboardEvent) {
  const input = event.currentTarget as HTMLInputElement;
  if (event.key === 'Enter') {
    applyText(rowText.value ?? output.value, () => (rowText.value = outputOf(hsvaState, props.alpha)));
    input.select();
  } else if (event.key === 'Escape') {
    rowText.value = null;
    input.blur();
  }
}

function onHexFocus(event: FocusEvent) {
  hexText.value = toHex(rgba.value, false);
  (event.target as HTMLInputElement).select();
}

function onHexKey(event: KeyboardEvent) {
  if (event.key !== 'Enter') return;
  applyText(hexText.value ?? '', () => (hexText.value = toHex(hsvaToRgba(hsvaState), false)));
  (event.currentTarget as HTMLInputElement).select();
}

function pickRecent(item: string) {
  const parsed = parseColor(item);
  if (parsed) commitColor(parsed);
}
</script>

<script lang="ts">
import { ref as sharedRef } from 'vue';
import type { ColorFormat as SharedColorFormat } from './colorMath';

const sharedFormat = sharedRef<SharedColorFormat>('hex');
</script>
