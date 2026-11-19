<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
    :demo-only-props="['preset']"
  >
    <TabsLayout>
      <template #preview>
        <div class="demo-container relative flex items-center justify-center" style="height: 460px; padding: 24px">
          <div style="width: 100%; max-width: 560px">
            <PixelSwap
              :key="rerenderKey"
              v-bind="settings"
              :style="{ borderRadius: '18px', cursor: settings.trigger === 'click' ? 'pointer' : 'default' }"
            >
              <template #firstContent>
                <img
                  src="/assets/demo/day-sky.webp"
                  alt=""
                  draggable="false"
                  style="display: block; width: 100%; height: 100%; object-fit: cover"
                />
              </template>
              <template #secondContent>
                <img
                  src="/assets/demo/night-sky.webp"
                  alt=""
                  draggable="false"
                  style="display: block; width: 100%; height: 100%; object-fit: cover"
                />
              </template>
            </PixelSwap>
          </div>
          <RefreshButton @click="forceRerender" />
        </div>

        <Customize>
          <PreviewSelect
            title="Preset"
            :options="PRESET_OPTIONS"
            :model-value="props.preset"
            @update:model-value="applyPreset"
          />
          <PreviewSelect
            title="Pattern"
            :options="PATTERN_OPTIONS"
            :model-value="settings.pattern"
            @update:model-value="value => updateProp('pattern', value as PixelSwapPattern)"
          />
          <PreviewSelect
            title="Trigger"
            :options="TRIGGER_OPTIONS"
            :model-value="settings.trigger"
            @update:model-value="value => updateProp('trigger', value as PixelSwapTrigger)"
          />
          <PreviewSlider
            title="Pixel Size"
            :min="16"
            :max="128"
            :step="2"
            value-unit="px"
            :model-value="settings.pixelSize"
            @update:model-value="value => updateProp('pixelSize', value)"
          />
          <PreviewSlider
            title="Gap"
            :min="0"
            :max="16"
            :step="1"
            value-unit="px"
            :model-value="settings.gap"
            @update:model-value="value => updateProp('gap', value)"
          />
          <PreviewSlider
            title="Pixel Radius"
            :min="0"
            :max="50"
            :step="1"
            value-unit="%"
            :model-value="settings.pixelRadius"
            @update:model-value="value => updateProp('pixelRadius', value)"
          />
          <PreviewSlider
            title="Pixel Scale"
            :min="0"
            :max="0.9"
            :step="0.01"
            :model-value="settings.pixelScale"
            @update:model-value="value => updateProp('pixelScale', value)"
          />
          <PreviewSlider
            title="Pixel Spin"
            :min="-180"
            :max="180"
            :step="5"
            value-unit="°"
            :model-value="settings.pixelSpin"
            @update:model-value="value => updateProp('pixelSpin', value)"
          />
          <PreviewSlider
            title="Duration"
            :min="0"
            :max="1500"
            :step="10"
            value-unit="ms"
            :model-value="settings.duration"
            @update:model-value="value => updateProp('duration', value)"
          />
          <PreviewSlider
            title="Pixel Duration"
            :min="120"
            :max="1200"
            :step="10"
            value-unit="ms"
            :model-value="settings.pixelDuration"
            @update:model-value="value => updateProp('pixelDuration', value)"
          />
          <PreviewSlider
            title="Randomness"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.randomness"
            @update:model-value="value => updateProp('randomness', value)"
          />
          <PreviewSlider
            title="Bounce"
            :min="0"
            :max="0.8"
            :step="0.01"
            :model-value="settings.bounce"
            @update:model-value="value => updateProp('bounce', value)"
          />
          <PreviewSwitch
            title="Intro"
            :model-value="settings.intro"
            @update:model-value="
              value => {
                updateProp('intro', value);
                forceRerender();
              }
            "
          />
        </Customize>

        <PropTable :data="propData" />
      </template>

      <template #code>
        <CodeExample :code-object="pixelSwap" component-name="PixelSwap" />
      </template>
    </TabsLayout>
  </ComponentPropsProvider>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import CodeExample from '@/components/common/CodeExample.vue';
import Customize from '@/components/common/Customize.vue';
import PreviewSelect from '@/components/common/PreviewSelect.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import RefreshButton from '@/components/common/RefreshButton.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import ComponentPropsProvider from '@/components/context/ComponentPropsProvider.vue';
import { useComponentProps } from '@/composables/useComponentProps';
import { useForceRerender } from '@/composables/useForceRerender';
import { pixelSwap } from '@/constants/code/Animations/pixelSwapCode';
import PixelSwap, { type PixelSwapPattern, type PixelSwapTrigger } from '@/content/Animations/PixelSwap/PixelSwap.vue';

const LOOK = {
  pattern: 'pointer' as PixelSwapPattern,
  pixelSize: 48,
  gap: 0,
  pixelRadius: 0,
  pixelScale: 0,
  pixelSpin: 0,
  duration: 400,
  pixelDuration: 350,
  randomness: 0.2,
  bounce: 0.3
};

const DEFAULT_PROPS = {
  preset: 'pixels',
  ...LOOK,
  trigger: 'hover' as PixelSwapTrigger,
  intro: true
};

type DemoProps = typeof DEFAULT_PROPS;

const PRESETS: Record<string, Partial<DemoProps>> = {
  pixels: {},
  dots: { pixelSize: 32, gap: 4, pixelRadius: 50, randomness: 0.3 },
  spin: { pixelSize: 64, pixelSpin: 90 },
  scatter: { pattern: 'random', pixelSize: 40, pixelScale: 0.35, duration: 600, randomness: 0 },
  blocks: { pixelSize: 96, gap: 8, pixelRadius: 20, bounce: 0.5 }
};

const PRESET_OPTIONS = [
  { value: 'pixels', label: 'Pixels' },
  { value: 'dots', label: 'Dots' },
  { value: 'spin', label: 'Spin' },
  { value: 'scatter', label: 'Scatter' },
  { value: 'blocks', label: 'Blocks' }
];

const PATTERN_OPTIONS = [
  { value: 'pointer', label: 'Pointer' },
  { value: 'random', label: 'Random' },
  { value: 'center', label: 'Center' },
  { value: 'edges', label: 'Edges' },
  { value: 'left-to-right', label: 'Left to Right' },
  { value: 'right-to-left', label: 'Right to Left' },
  { value: 'top-to-bottom', label: 'Top to Bottom' },
  { value: 'bottom-to-top', label: 'Bottom to Top' },
  { value: 'diagonal', label: 'Diagonal' },
  { value: 'spiral', label: 'Spiral' }
];

const TRIGGER_OPTIONS = [
  { value: 'hover', label: 'Hover' },
  { value: 'click', label: 'Click' }
];

const { rerenderKey, forceRerender } = useForceRerender();
const { props, defaultProps, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);
const settings = computed(() => {
  const { preset: _preset, ...rest } = props.value;
  return rest;
});

const applyPreset = (option: string | number) => {
  const value = String(option);
  const base = Object.fromEntries(
    Object.keys(LOOK).map(name => [name, defaultProps.value[name as keyof DemoProps]])
  ) as Partial<DemoProps>;
  updateProps({ ...base, ...PRESETS[value], preset: value });
  forceRerender();
};

const propData: PropRow[] = [
  { name: 'firstContent', type: 'slot', default: '-', description: 'Content shown at rest.' },
  { name: 'secondContent', type: 'slot', default: '-', description: 'Content that builds in pixel by pixel.' },
  {
    name: 'pattern',
    type: "'pointer' | 'random' | 'center' | 'edges' | 'left-to-right' | 'right-to-left' | 'top-to-bottom' | 'bottom-to-top' | 'diagonal' | 'spiral'",
    default: "'pointer'",
    description: 'Order the pixels arrive in. Pointer starts the wave where the cursor enters, leaves or clicks.'
  },
  {
    name: 'pixelSize',
    type: 'number',
    default: '48',
    description: 'Edge length of each pixel in px. Grows automatically when the grid would pass 600 pixels.'
  },
  { name: 'gap', type: 'number', default: '0', description: 'Space between pixels in px while they grow.' },
  {
    name: 'pixelRadius',
    type: 'number',
    default: '0',
    description: 'Corner rounding of the pixels while they grow, as a percentage. 50 starts them as dots.'
  },
  {
    name: 'pixelScale',
    type: 'number',
    default: '0',
    description: 'Size each pixel pops in at, from 0 to grow out of nothing to 0.9 for a hard pop.'
  },
  { name: 'pixelSpin', type: 'number', default: '0', description: 'Degrees each pixel turns as it grows in.' },
  { name: 'duration', type: 'number', default: '400', description: 'Time in ms the wave takes to cross the content.' },
  { name: 'pixelDuration', type: 'number', default: '350', description: 'Time in ms a single pixel takes to grow.' },
  {
    name: 'randomness',
    type: 'number',
    default: '0.2',
    description: 'Noise mixed into the pattern, from 0 for a clean wave to 1 for a scatter.'
  },
  {
    name: 'bounce',
    type: 'number',
    default: '0.3',
    description: 'How far each pixel overshoots before it settles, from 0 to 1.'
  },
  {
    name: 'trigger',
    type: "'hover' | 'click' | 'none'",
    default: "'hover'",
    description: 'What starts the swap. With none, drive it with active.'
  },
  { name: 'intro', type: 'boolean', default: 'true', description: 'Builds the first content in from pixels on mount.' },
  { name: 'initialActive', type: 'boolean', default: 'false', description: 'Starts on the second content.' },
  {
    name: 'active',
    type: 'boolean',
    default: '-',
    description: 'Controls which content shows. Pair it with the activeChange event.'
  },
  {
    name: 'activeChange',
    type: '(active: boolean) => void',
    default: '-',
    description: 'Event emitted when the trigger asks to swap.'
  },
  {
    name: 'complete',
    type: '(active: boolean) => void',
    default: '-',
    description: 'Event emitted when a swap finishes.'
  },
  { name: 'aspectRatio', type: 'string', default: "'16 / 10'", description: 'Aspect ratio of the root.' },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the root.' },
  { name: 'style', type: 'CSSProperties', default: '-', description: 'Inline styles for the root.' }
];
</script>
