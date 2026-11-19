<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
    :demo-only-props="['preset']"
    :computed-props="computedProps"
  >
    <TabsLayout>
      <template #preview>
        <div
          class="demo-container relative overflow-hidden px-3 py-6 md:px-6 md:py-8"
          style="height: auto; min-height: 500px"
        >
          <div class="mx-auto w-full max-w-[960px]">
            <ChromaGrid :items="ITEMS" v-bind="settings" :theme="theme" />
          </div>
        </div>

        <Customize>
          <PreviewSelect
            title="Preset"
            :options="PRESET_OPTIONS"
            :model-value="props.preset"
            @update:model-value="value => applyPreset(String(value))"
          />
          <PreviewSelect
            title="Reveal"
            :options="REVEAL_OPTIONS"
            :model-value="settings.reveal"
            @update:model-value="value => updateProp('reveal', value as Reveal)"
          />
          <PreviewSelect
            title="Aspect Ratio"
            :options="RATIO_OPTIONS"
            :model-value="settings.aspectRatio"
            @update:model-value="value => updateProp('aspectRatio', String(value))"
          />
          <PreviewSlider
            title="Columns"
            :min="1"
            :max="6"
            :step="1"
            :model-value="settings.columns"
            @update:model-value="value => updateProp('columns', value)"
          />
          <PreviewSlider
            title="Min Card Width"
            :min="120"
            :max="360"
            :step="10"
            value-unit="px"
            :model-value="settings.minCardWidth"
            @update:model-value="value => updateProp('minCardWidth', value)"
          />
          <PreviewSlider
            title="Gap"
            :min="0"
            :max="32"
            :step="1"
            value-unit="px"
            :model-value="settings.gap"
            @update:model-value="value => updateProp('gap', value)"
          />
          <PreviewSlider
            title="Card Radius"
            :min="0"
            :max="40"
            :step="1"
            value-unit="px"
            :model-value="settings.cardRadius"
            @update:model-value="value => updateProp('cardRadius', value)"
          />
          <PreviewSlider
            title="Radius"
            :min="80"
            :max="600"
            :step="10"
            value-unit="px"
            :model-value="settings.radius"
            @update:model-value="value => updateProp('radius', value)"
          />
          <PreviewSlider
            title="Softness"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.softness"
            @update:model-value="value => updateProp('softness', value)"
          />
          <PreviewSlider
            title="Damping"
            :min="0"
            :max="1.5"
            :step="0.05"
            :model-value="settings.damping"
            @update:model-value="value => updateProp('damping', value)"
          />
          <PreviewSlider
            title="Fade Out"
            :min="0"
            :max="2"
            :step="0.05"
            value-unit="s"
            :model-value="settings.fadeOut"
            @update:model-value="value => updateProp('fadeOut', value)"
          />
          <PreviewSlider
            title="Grayscale"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.grayscale"
            @update:model-value="value => updateProp('grayscale', value)"
          />
          <PreviewSlider
            title="Dim"
            :min="0"
            :max="0.6"
            :step="0.01"
            :model-value="settings.dim"
            @update:model-value="value => updateProp('dim', value)"
          />
          <PreviewSlider
            title="Glow"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.glow"
            @update:model-value="value => updateProp('glow', value)"
          />
          <PreviewSlider
            title="Border Glow"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.borderGlow"
            @update:model-value="value => updateProp('borderGlow', value)"
          />
          <PreviewSwitch
            title="Show Info"
            :model-value="settings.showInfo"
            @update:model-value="value => updateProp('showInfo', value)"
          />
          <PreviewSwitch
            title="Frame"
            :model-value="settings.frame"
            @update:model-value="value => updateProp('frame', value)"
          />
        </Customize>

        <PropTable :data="propData" />
      </template>

      <template #code>
        <CodeExample :code-object="chromaGrid" component-name="ChromaGrid" />
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
import TabsLayout from '@/components/common/TabsLayout.vue';
import ComponentPropsProvider from '@/components/context/ComponentPropsProvider.vue';
import { useComponentProps } from '@/composables/useComponentProps';
import { useColorModeValue } from '@/composables/useTheme';
import { chromaGrid } from '@/constants/code/Components/chromaGridCode';
import ChromaGrid, { type ChromaItem } from '@/content/Components/ChromaGrid/ChromaGrid.vue';

type Reveal = 'spotlight' | 'card';

const ITEMS: ChromaItem[] = [
  {
    image: '/assets/demo/day-landscape.webp',
    title: 'Canola Field',
    subtitle: 'Midday',
    accent: '#ffd23f'
  },
  { image: '/assets/demo/day-portrait.webp', title: 'The Pier', subtitle: 'Clear sky', accent: '#3fb8ff' },
  { image: '/assets/demo/day-sky.webp', title: 'Open Sky', subtitle: 'Golden hour', accent: '#ff9a4c' },
  {
    image: '/assets/demo/night-landscape.webp',
    title: 'Canola Field',
    subtitle: 'Moonrise',
    accent: '#5b7cff'
  },
  { image: '/assets/demo/night-portrait.webp', title: 'The Pier', subtitle: 'Dusk', accent: '#ff7eb6' },
  { image: '/assets/demo/night-sky.webp', title: 'Open Sky', subtitle: 'Blue hour', accent: '#4c6fff' }
];

const LOOK = {
  reveal: 'spotlight' as Reveal,
  columns: 3,
  minCardWidth: 180,
  gap: 12,
  radius: 260,
  aspectRatio: '3 / 2',
  cardRadius: 22,
  showInfo: true,
  frame: false
};

const DEFAULT_PROPS = {
  preset: 'gallery',
  ...LOOK,
  softness: 0.6,
  damping: 0.45,
  fadeOut: 0.6,
  grayscale: 1,
  dim: 0.12,
  glow: 0.5,
  borderGlow: 1
};

const PRESETS: Record<string, Partial<typeof DEFAULT_PROPS>> = {
  gallery: LOOK,
  framed: { ...LOOK, frame: true },
  mosaic: { ...LOOK, showInfo: false, aspectRatio: '1 / 1', gap: 8, cardRadius: 18, radius: 220 },
  hover: { ...LOOK, reveal: 'card' },
  wide: { ...LOOK, columns: 2, aspectRatio: '16 / 10', radius: 340, minCardWidth: 220 }
};

const PRESET_OPTIONS = [
  { value: 'gallery', label: 'Gallery' },
  { value: 'framed', label: 'Framed' },
  { value: 'mosaic', label: 'Mosaic' },
  { value: 'hover', label: 'Hover' },
  { value: 'wide', label: 'Wide' }
];

const REVEAL_OPTIONS = [
  { value: 'spotlight', label: 'Spotlight' },
  { value: 'card', label: 'Card' }
];

const RATIO_OPTIONS = [
  { value: '3 / 2', label: '3 / 2' },
  { value: '4 / 3', label: '4 / 3' },
  { value: '16 / 10', label: '16 / 10' },
  { value: '1 / 1', label: '1 / 1' },
  { value: '4 / 5', label: '4 / 5' }
];

const propData: PropRow[] = [
  {
    name: 'items',
    type: 'ChromaItem[]',
    default: 'Sample photos',
    description:
      'The cards to show. Each item takes image, title, subtitle, accent and url. With a url the whole card becomes a link.'
  },
  {
    name: 'reveal',
    type: "'spotlight' | 'card'",
    default: "'spotlight'",
    description: 'Reveal color in a soft spotlight that follows the cursor, or one whole card at a time on hover.'
  },
  { name: 'columns', type: 'number', default: '3', description: 'The most columns the grid shows.' },
  {
    name: 'minCardWidth',
    type: 'number',
    default: '180',
    description: 'Narrowest a card can get, in px. The grid drops columns to keep cards at least this wide.'
  },
  { name: 'gap', type: 'number', default: '12', description: 'Space between cards, in px.' },
  { name: 'radius', type: 'number', default: '260', description: 'Size of the color spotlight, in px.' },
  {
    name: 'softness',
    type: 'number',
    default: '0.6',
    description: 'How gradually the spotlight fades at its edge, from 0 for a crisp circle to 1 for a soft glow.'
  },
  {
    name: 'damping',
    type: 'number',
    default: '0.45',
    description: 'How smoothly the spotlight trails the cursor. 0 follows it exactly.'
  },
  {
    name: 'fadeOut',
    type: 'number',
    default: '0.6',
    description: 'How long the colors take to fade back to gray after the cursor leaves, in seconds.'
  },
  {
    name: 'grayscale',
    type: 'number',
    default: '1',
    description: 'How much color is drained outside the spotlight, from 0 to 1.'
  },
  { name: 'dim', type: 'number', default: '0.12', description: 'How much images darken outside the spotlight.' },
  {
    name: 'glow',
    type: 'number',
    default: '0.5',
    description: "Strength of each card's accent color glowing up from the bottom as it is revealed."
  },
  {
    name: 'borderGlow',
    type: 'number',
    default: '1',
    description: "Strength of each card's border lighting up in its accent color near the cursor."
  },
  {
    name: 'aspectRatio',
    type: 'string',
    default: "'3 / 2'",
    description: 'Aspect ratio of the images, as a CSS aspect-ratio value.'
  },
  { name: 'cardRadius', type: 'number', default: '22', description: 'Corner radius of the cards, in px.' },
  {
    name: 'showInfo',
    type: 'boolean',
    default: 'true',
    description: 'Shows the title and subtitle under each image.'
  },
  { name: 'frame', type: 'boolean', default: 'false', description: 'Wraps the grid in a frosted glass panel.' },
  { name: 'theme', type: "'dark' | 'light'", default: "'dark'", description: 'Color theme of the cards.' },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the grid.' }
];

const { props, defaultProps, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);
const settings = computed(() => {
  const { preset: _preset, ...rest } = props.value;
  return rest;
});
const theme = useColorModeValue<'light' | 'dark'>('light', 'dark');
const computedProps = computed(() => (theme.value === 'light' ? { theme: 'light' } : {}));

const applyPreset = (value: string) => {
  const defaults = defaultProps.value as Record<string, unknown>;
  const base = Object.fromEntries(Object.keys(DEFAULT_PROPS).map(name => [name, defaults[name]]));
  updateProps({ ...base, ...PRESETS[value], preset: value } as Partial<typeof DEFAULT_PROPS>);
};
</script>
