<template>
  <h1 class="sub-category">Pixel Swap</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="pixelSwap.usage"
    :source="pixelSwapSource"
    component-name="PixelSwap"
    :props-table="props"
  >
    <template #preview>
      <div class="relative p-0 h-125 overflow-hidden demo-container">
        <PixelSwap :key="trigger" v-bind="pixelSwapProps" class-name="pixel-swap-demo">
          <template #first>
            <div class="pixel-swap-demo__panel pixel-swap-demo__panel--first">
              <span class="pixel-swap-demo__eyebrow">{{ hint }}</span>
              <h3 class="pixel-swap-demo__title">Use Vue Bits</h3>
            </div>
          </template>

          <template #second>
            <div class="pixel-swap-demo__panel pixel-swap-demo__panel--second">
              <span class="pixel-swap-demo__eyebrow">Now go and</span>
              <h3 class="pixel-swap-demo__title">Build anything</h3>
            </div>
          </template>
        </PixelSwap>
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSelect
          title="Pattern"
          :options="[
            { label: 'Random', value: 'random' },
            { label: 'Center Out', value: 'center' },
            { label: 'Edges In', value: 'edges' },
            { label: 'Left to Right', value: 'left-to-right' },
            { label: 'Right to Left', value: 'right-to-left' },
            { label: 'Top to Bottom', value: 'top-to-bottom' },
            { label: 'Bottom to Top', value: 'bottom-to-top' },
            { label: 'Diagonal', value: 'diagonal' },
            { label: 'Spiral', value: 'spiral' }
          ]"
          v-model="pattern"
        />
        <PreviewSelect
          title="Trigger"
          :options="[
            { label: 'Hover', value: 'hover' },
            { label: 'Click', value: 'click' }
          ]"
          v-model="trigger"
        />
        <PreviewSlider title="Pixel Size" :min="24" :max="120" :step="4" valueUnit="px" v-model="pixelSize" />
        <PreviewSlider title="Gap" :min="0" :max="16" :step="1" valueUnit="px" v-model="gap" />
        <PreviewSlider title="Pixel Radius" :min="0" :max="50" :step="1" valueUnit="%" v-model="pixelRadius" />
        <PreviewSlider
          title="Pixel Scale"
          :min="0.05"
          :max="1"
          :step="0.05"
          :displayValue="value => value.toFixed(2)"
          v-model="pixelScale"
        />
        <PreviewSlider
          title="Pixel Spin"
          :min="0"
          :max="180"
          :step="5"
          :displayValue="value => `${value}°`"
          v-model="pixelSpin"
        />
        <PreviewSlider title="Duration" :min="400" :max="4000" :step="100" valueUnit="ms" v-model="duration" />
        <PreviewSlider
          title="Pixel Duration"
          :min="100"
          :max="1200"
          :step="50"
          valueUnit="ms"
          v-model="pixelDuration"
        />
        <PreviewSlider
          title="Randomness"
          :min="0"
          :max="1"
          :step="0.05"
          :displayValue="value => value.toFixed(2)"
          :isDisabled="pattern === 'random'"
          v-model="randomness"
        />
        <PreviewSwitch title="Fade" v-model="fade" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="pixel-swap" :usage="pixelSwap.usage!" :source="pixelSwapSource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewSelect from '@/components/common/PreviewSelect.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { pixelSwap } from '@/constants/code/Animations/pixelSwapCode';
import PixelSwap, { type PixelSwapPattern, type PixelSwapTrigger } from '@/content/Animations/PixelSwap/PixelSwap.vue';
import pixelSwapSource from '@/content/Animations/PixelSwap/PixelSwap.vue?raw';
import { computed, ref } from 'vue';

const { forceRerender } = useForceRerender();

const DEFAULTS = {
  pattern: 'random' as PixelSwapPattern,
  trigger: 'hover' as PixelSwapTrigger,
  pixelSize: 64,
  gap: 0,
  pixelRadius: 0,
  pixelSpin: 0,
  pixelScale: 0.35,
  duration: 1400,
  pixelDuration: 450,
  randomness: 0,
  fade: true
};

const pattern = ref(DEFAULTS.pattern);
const trigger = ref(DEFAULTS.trigger);
const pixelSize = ref(DEFAULTS.pixelSize);
const gap = ref(DEFAULTS.gap);
const pixelRadius = ref(DEFAULTS.pixelRadius);
const pixelSpin = ref(DEFAULTS.pixelSpin);
const pixelScale = ref(DEFAULTS.pixelScale);
const duration = ref(DEFAULTS.duration);
const pixelDuration = ref(DEFAULTS.pixelDuration);
const randomness = ref(DEFAULTS.randomness);
const fade = ref(DEFAULTS.fade);

const hint = computed(() => (trigger.value === 'click' ? 'Click the card' : 'Hover the card'));

const pixelSwapProps = computed(() => ({
  pattern: pattern.value,
  trigger: trigger.value,
  pixelSize: pixelSize.value,
  gap: gap.value,
  pixelRadius: pixelRadius.value,
  pixelSpin: pixelSpin.value,
  pixelScale: pixelScale.value,
  duration: duration.value,
  pixelDuration: pixelDuration.value,
  randomness: randomness.value,
  fade: fade.value
}));

const hasChanges = computed(
  () =>
    pattern.value !== DEFAULTS.pattern ||
    trigger.value !== DEFAULTS.trigger ||
    pixelSize.value !== DEFAULTS.pixelSize ||
    gap.value !== DEFAULTS.gap ||
    pixelRadius.value !== DEFAULTS.pixelRadius ||
    pixelSpin.value !== DEFAULTS.pixelSpin ||
    pixelScale.value !== DEFAULTS.pixelScale ||
    duration.value !== DEFAULTS.duration ||
    pixelDuration.value !== DEFAULTS.pixelDuration ||
    randomness.value !== DEFAULTS.randomness ||
    fade.value !== DEFAULTS.fade
);

function reset() {
  pattern.value = DEFAULTS.pattern;
  trigger.value = DEFAULTS.trigger;
  pixelSize.value = DEFAULTS.pixelSize;
  gap.value = DEFAULTS.gap;
  pixelRadius.value = DEFAULTS.pixelRadius;
  pixelSpin.value = DEFAULTS.pixelSpin;
  pixelScale.value = DEFAULTS.pixelScale;
  duration.value = DEFAULTS.duration;
  pixelDuration.value = DEFAULTS.pixelDuration;
  randomness.value = DEFAULTS.randomness;
  fade.value = DEFAULTS.fade;
  forceRerender();
}

const props: PropRow[] = [
  { name: 'firstContent', type: 'slot', default: '—', description: 'Content shown in the initial state.' },
  { name: 'secondContent', type: 'slot', default: '—', description: 'Content revealed after the pixel cover.' },
  {
    name: 'pixelSize',
    type: 'number',
    default: '64',
    description: 'Square pixel edge length in pixels. Grown automatically when the grid would exceed 320 pixels.'
  },
  { name: 'gap', type: 'number', default: '0', description: 'Space between pixels in pixels.' },
  {
    name: 'pixelRadius',
    type: 'number',
    default: '0',
    description: 'Corner rounding of each pixel as a percentage (0 = square, 50 = circle).'
  },
  {
    name: 'pixelScale',
    type: 'number',
    default: '0.35',
    description: 'Size each pixel starts at, relative to its final size.'
  },
  {
    name: 'fade',
    type: 'boolean',
    default: 'true',
    description: 'Fade each pixel in as it opens. Disable for a hard pixel pop.'
  },
  { name: 'duration', type: 'number', default: '1400', description: 'Total transition duration in milliseconds.' },
  {
    name: 'pixelDuration',
    type: 'number',
    default: '450',
    description: 'Time a single pixel takes to open, in milliseconds.'
  },
  {
    name: 'pattern',
    type: '"random" | "center" | "edges" | "left-to-right" | "right-to-left" | "top-to-bottom" | "bottom-to-top" | "diagonal" | "spiral"',
    default: 'random',
    description: 'Order in which pixels animate.'
  },
  {
    name: 'randomness',
    type: 'number',
    default: '0',
    description: 'Noise mixed into the pattern order, from 0 (strict) to 1 (fully scattered).'
  },
  {
    name: 'pixelSpin',
    type: 'number',
    default: '0',
    description: 'Degrees each pixel rotates as it opens.'
  },
  {
    name: 'easing',
    type: 'string',
    default: 'cubic-bezier(0.22, 1, 0.36, 1)',
    description: 'Easing applied to each pixel as it opens.'
  },
  {
    name: 'trigger',
    type: '"hover" | "click" | "manual"',
    default: 'hover',
    description: 'Interaction that requests a content swap.'
  },
  {
    name: 'initialActive',
    type: 'boolean',
    default: 'false',
    description: 'Whether the second content is initially visible.'
  },
  {
    name: 'active',
    type: 'boolean',
    default: '—',
    description: 'Controlled active state. Use with trigger="manual" for external control.'
  },
  {
    name: 'onActiveChange',
    type: '(active: boolean) => void',
    default: '—',
    description: 'Called whenever an interaction requests a state change.'
  },
  {
    name: 'onComplete',
    type: '(active: boolean) => void',
    default: '—',
    description: 'Called once the incoming content is fully revealed.'
  },
  { name: 'aspectRatio', type: 'string', default: '16 / 10', description: 'CSS aspect-ratio value for the wrapper.' },
  { name: 'className', type: 'string', default: '—', description: 'Additional class names for the wrapper.' },
  { name: 'style', type: 'CSSProperties', default: '—', description: 'Inline styles for the wrapper.' }
];
</script>

<style scoped lang="css">
.pixel-swap-demo {
  max-width: 780px;
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-xl);
  background: var(--bg-body);
  box-shadow: 0 28px 80px rgba(0, 0, 0, 0.32);
  cursor: pointer;
  user-select: none;
}

.pixel-swap-demo:focus-visible {
  box-shadow:
    0 0 0 2px var(--color-primary),
    0 28px 80px rgba(0, 0, 0, 0.32);
}

.pixel-swap-demo__panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  height: 100%;
  padding: 24px;
  text-align: center;
}

.pixel-swap-demo__eyebrow {
  font-size: clamp(0.65rem, 1.4vw, 0.75rem);
  font-weight: 500;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.pixel-swap-demo__title {
  font-size: clamp(1.4rem, 4vw, 2.6rem);
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1.1;
  margin: 0;
}

.pixel-swap-demo__panel--first {
  background: var(--bg-body);
  color: var(--text-primary);
}

.pixel-swap-demo__panel--first .pixel-swap-demo__eyebrow {
  color: var(--text-muted);
}

.pixel-swap-demo__panel--second {
  background: linear-gradient(135deg, #ffffff 0%, #e4d9f7 100%);
  color: #120f17;
}

.pixel-swap-demo__panel--second .pixel-swap-demo__eyebrow {
  color: rgba(18, 15, 23, 0.55);
}
</style>
