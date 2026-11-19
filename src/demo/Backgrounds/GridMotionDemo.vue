<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
    :demo-only-props="['preset', 'content']"
  >
    <TabsLayout>
      <template #preview>
        <div class="demo-container relative overflow-hidden" style="height: 500px; padding: 0">
          <GridMotion v-bind="settings" :items="items" :theme="theme" />
          <BackgroundContent pill-text="New Background" headline="A wall of work that moves with you" />
        </div>

        <Customize>
          <PreviewSelect
            title="Preset"
            :options="PRESET_OPTIONS"
            :model-value="props.preset"
            @update:model-value="(value: string | number) => applyPreset(String(value))"
          />
          <PreviewSlider
            title="Rows"
            :min="1"
            :max="8"
            :step="1"
            :model-value="props.rows"
            @update:model-value="(value: number) => updateProp('rows', value)"
          />
          <PreviewSlider
            title="Tile Ratio"
            :min="0.5"
            :max="2.5"
            :step="0.05"
            :model-value="props.aspectRatio"
            @update:model-value="(value: number) => updateProp('aspectRatio', value)"
          />
          <PreviewSlider
            title="Gap"
            :min="0"
            :max="40"
            :step="1"
            value-unit="px"
            :model-value="props.gap"
            @update:model-value="(value: number) => updateProp('gap', value)"
          />
          <PreviewSlider
            title="Radius"
            :min="0"
            :max="40"
            :step="1"
            value-unit="px"
            :model-value="Math.min(props.radius, 40)"
            @update:model-value="(value: number) => updateProp('radius', value)"
          />
          <PreviewSlider
            title="Angle"
            :min="-45"
            :max="45"
            :step="1"
            value-unit="°"
            :model-value="props.angle"
            @update:model-value="(value: number) => updateProp('angle', value)"
          />
          <PreviewSlider
            title="Tilt"
            :min="0"
            :max="65"
            :step="1"
            value-unit="°"
            :model-value="props.tilt"
            @update:model-value="(value: number) => updateProp('tilt', value)"
          />
          <PreviewSlider
            title="Speed"
            :min="0"
            :max="160"
            :step="2"
            :model-value="props.speed"
            @update:model-value="(value: number) => updateProp('speed', value)"
          />
          <PreviewSelect
            title="Direction"
            :options="DIRECTION_OPTIONS"
            :model-value="props.direction"
            @update:model-value="(value: string | number) => updateProp('direction', value as GridMotionDirection)"
          />
          <PreviewSlider
            title="Parallax"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.parallax"
            @update:model-value="(value: number) => updateProp('parallax', value)"
          />
          <PreviewSlider
            title="Spotlight"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.spotlight"
            @update:model-value="(value: number) => updateProp('spotlight', value)"
          />
          <PreviewSlider
            title="Dim"
            :min="0"
            :max="0.9"
            :step="0.05"
            :model-value="props.dim"
            @update:model-value="(value: number) => updateProp('dim', value)"
          />
          <PreviewSlider
            title="Fade"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.fade"
            @update:model-value="(value: number) => updateProp('fade', value)"
          />
          <PreviewSwitch
            title="Grayscale"
            :model-value="props.grayscale"
            @update:model-value="(value: boolean) => updateProp('grayscale', value)"
          />
        </Customize>

        <PropTable :data="propData" />
      </template>

      <template #code>
        <CodeExample :code-object="gridMotion" component-name="GridMotion" />
      </template>
    </TabsLayout>
  </ComponentPropsProvider>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import BackgroundContent from '@/components/common/BackgroundContent.vue';
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
import { gridMotion } from '@/constants/code/Backgrounds/gridMotionCode';
import GridMotion, { type GridMotionDirection } from '@/content/Backgrounds/GridMotion/GridMotion.vue';
import { DEFAULT_PROPS, PRESET_OPTIONS, presetProps } from './presets/GridMotion';

const PHOTOS = [
  '1705032033999-efa3082e1a4e',
  '1721407964262-f9864b562453',
  '1781155451576-ae65c8816d31',
  '1762846818262-33c197852fa8',
  '1709699714159-29bc3ac99486',
  '1776394254711-4a0d7345269a',
  '1763440519433-5467759054fc',
  '1724152312974-d4d48b8b36fd',
  '1781242629922-6f39cc3671cd',
  '1774009485852-13a515d32e36',
  '1781499455083-6ccc3beb20cd',
  '1772440337285-8b5674e1ee8a',
  '1656651356997-71fcb0f04d3b',
  '1781764177519-9c9c88733c3e',
  '1636269603887-702d9a201bb4',
  '1782977389500-dd7adad33ebe',
  '1632231484562-3d2bed7e808d'
].map(id => `https://images.unsplash.com/photo-${id}?w=640&q=75&auto=format&fit=crop`);

const WORDS = [
  'Motion',
  'Type',
  'Color',
  'Light',
  'Grid',
  'Depth',
  'Form',
  'Rhythm',
  'Space',
  'Texture',
  'Contrast',
  'Balance',
  'Flow',
  'Scale',
  'Detail',
  'Craft'
];

const DIRECTION_OPTIONS = [
  { value: 'alternate', label: 'Alternate' },
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' }
];

const propData: PropRow[] = [
  {
    name: 'items',
    type: 'Array<string | VNode | { src: string; alt?: string }>',
    default: '[]',
    description:
      'Tile content. Image URLs and paths render as photos, other strings as text, and VNodes as is. Items repeat to fill the wall.'
  },
  { name: 'rows', type: 'number', default: '4', description: 'Rows of tiles. More rows means smaller tiles.' },
  {
    name: 'aspectRatio',
    type: 'number',
    default: '1.33',
    description: 'Width of each tile divided by its height. Below 1 gives portrait tiles.'
  },
  { name: 'gap', type: 'number', default: '16', description: 'Space between tiles in pixels.' },
  {
    name: 'radius',
    type: 'number',
    default: '14',
    description: 'Corner radius of the tiles in pixels. Large values give pills.'
  },
  { name: 'angle', type: 'number', default: '-12', description: 'Rotation of the whole wall in degrees.' },
  {
    name: 'tilt',
    type: 'number',
    default: '0',
    description: 'Leans the wall back in 3D, in degrees. 0 keeps it flat.'
  },
  {
    name: 'speed',
    type: 'number',
    default: '24',
    description: 'Drift speed of the rows in pixels per second. 0 keeps them still.'
  },
  {
    name: 'direction',
    type: "'alternate' | 'left' | 'right'",
    default: "'alternate'",
    description: 'Which way the rows drift. Alternate sends neighbouring rows in opposite directions.'
  },
  {
    name: 'parallax',
    type: 'number',
    default: '0.5',
    description: 'How far the rows slide against each other as the pointer moves across the page, from 0 to 1.'
  },
  {
    name: 'spotlight',
    type: 'number',
    default: '0.6',
    description:
      'Size of the area around the pointer where dimmed or grayscale tiles come back to full color, from 0 to 1. 0 turns it off.'
  },
  {
    name: 'dim',
    type: 'number',
    default: '0.35',
    description: 'Fades the tiles outside the spotlight, which keeps text on top readable. From 0 to 1.'
  },
  {
    name: 'grayscale',
    type: 'boolean',
    default: 'false',
    description: 'Shows the tiles in grayscale until the spotlight brings their color back.'
  },
  {
    name: 'fade',
    type: 'number',
    default: '0.5',
    description: 'Fades the edges of the wall into the page, from 0 to 1.'
  },
  {
    name: 'tileColor',
    type: 'string',
    default: '-',
    description: 'Background of text and empty tiles. Follows the theme when not set.'
  },
  {
    name: 'textColor',
    type: 'string',
    default: '-',
    description: 'Color of text tiles. Follows the theme when not set.'
  },
  {
    name: 'theme',
    type: "'dark' | 'light'",
    default: "'dark'",
    description: 'Picks the default tile and text colors.'
  },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the root.' },
  { name: 'style', type: 'CSSProperties', default: '-', description: 'Inline styles for the root.' }
];

const { props, defaultProps, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);

const theme = useColorModeValue<'light' | 'dark'>('light', 'dark');

const settings = computed(() => {
  const {
    preset: _preset,
    content: _content,
    ...rest
  } = props.value as typeof DEFAULT_PROPS & {
    theme?: 'dark' | 'light';
  };
  void _preset;
  void _content;
  const { theme: _theme, ...look } = rest;
  void _theme;
  return look;
});

const items = computed(() => (props.value.content === 'words' ? WORDS : PHOTOS));

const applyPreset = (value: string) => {
  updateProps({ ...presetProps(value, { defaults: defaultProps.value }), preset: value });
};
</script>
