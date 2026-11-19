<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
    :demo-only-props="['preset', 'meta', ...Object.keys(COLORS)]"
    :computed-props="colors"
  >
    <TabsLayout>
      <template #preview>
        <div class="demo-container relative overflow-hidden" style="height: 600px; padding: 0">
          <div class="absolute inset-0">
            <FlowingMenu
              :key="rerenderKey"
              :items="props.meta ? ITEMS : PLAIN_ITEMS"
              v-bind="{ ...settings, ...colors }"
            />
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
            title="Direction"
            :options="DIRECTION_OPTIONS"
            :model-value="props.direction"
            @update:model-value="value => updateProp('direction', value as Direction)"
          />
          <PreviewSelect
            title="Align"
            :options="ALIGN_OPTIONS"
            :model-value="props.align"
            @update:model-value="value => updateProp('align', value as Align)"
          />
          <PreviewSelect
            title="Image Shape"
            :options="SHAPE_OPTIONS"
            :model-value="props.imageShape"
            @update:model-value="value => updateProp('imageShape', value as Shape)"
          />
          <PreviewSlider
            title="Speed"
            :min="0"
            :max="200"
            :step="5"
            value-unit="px/s"
            :model-value="props.speed"
            @update:model-value="value => updateProp('speed', value)"
          />
          <PreviewSlider
            title="Follow Cursor"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="props.followCursor"
            @update:model-value="value => updateProp('followCursor', value)"
          />
          <PreviewSlider
            title="Duration"
            :min="0.2"
            :max="1.2"
            :step="0.05"
            value-unit="s"
            :model-value="props.duration"
            @update:model-value="value => updateProp('duration', value)"
          />
          <PreviewSlider
            title="Stretch"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="props.stretch"
            @update:model-value="value => updateProp('stretch', value)"
          />
          <PreviewSlider
            title="Magnet"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="props.magnet"
            @update:model-value="value => updateProp('magnet', value)"
          />
          <PreviewSlider
            title="Band Inset"
            :min="0"
            :max="40"
            :step="1"
            value-unit="px"
            :model-value="props.bandInset"
            @update:model-value="value => updateProp('bandInset', value)"
          />
          <PreviewSlider
            title="Band Radius"
            :min="0"
            :max="80"
            :step="1"
            value-unit="px"
            :model-value="Math.min(props.bandRadius, 80)"
            @update:model-value="value => updateProp('bandRadius', value)"
          />
          <PreviewColorPickerCustom
            title="Text"
            :color="colors.textColor"
            @change="value => updateProp('textColor', value)"
          />
          <PreviewColorPickerCustom
            title="Background"
            :color="colors.bgColor"
            @change="value => updateProp('bgColor', value)"
          />
          <PreviewColorPickerCustom
            title="Band"
            :color="colors.marqueeBgColor"
            @change="value => updateProp('marqueeBgColor', value)"
          />
          <PreviewColorPickerCustom
            title="Band Text"
            :color="colors.marqueeTextColor"
            @change="value => updateProp('marqueeTextColor', value)"
          />
          <PreviewSwitch
            title="Dividers"
            :model-value="props.dividers"
            @update:model-value="value => updateProp('dividers', value)"
          />
          <PreviewSwitch
            title="Carry Content"
            :model-value="props.carryContent"
            @update:model-value="value => updateProp('carryContent', value)"
          />
          <PreviewSwitch
            title="Dim Inactive"
            :model-value="props.dimInactive"
            @update:model-value="value => updateProp('dimInactive', value)"
          />
          <PreviewSwitch
            title="Show Index"
            :model-value="props.showIndex"
            @update:model-value="value => updateProp('showIndex', value)"
          />
          <PreviewSwitch
            title="Show Arrow"
            :model-value="props.showArrow"
            @update:model-value="value => updateProp('showArrow', value)"
          />
          <PreviewSwitch
            title="Meta"
            :model-value="props.meta"
            @update:model-value="value => updateProp('meta', value)"
          />
          <PreviewSwitch title="Intro" :model-value="props.intro" @update:model-value="setIntro" />
        </Customize>

        <PropTable :data="propData" />
        <Dependencies :dependency-list="['@hugeicons/vue', '@hugeicons/core-free-icons']" />
      </template>

      <template #code>
        <CodeExample :code-object="flowingMenu" component-name="FlowingMenu" />
      </template>
    </TabsLayout>
  </ComponentPropsProvider>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import CodeExample from '@/components/common/CodeExample.vue';
import Customize from '@/components/common/Customize.vue';
import Dependencies from '@/components/common/Dependencies.vue';
import PreviewColorPickerCustom from '@/components/common/PreviewColorPickerCustom.vue';
import PreviewSelect from '@/components/common/PreviewSelect.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import RefreshButton from '@/components/common/RefreshButton.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import ComponentPropsProvider from '@/components/context/ComponentPropsProvider.vue';
import { useComponentProps } from '@/composables/useComponentProps';
import { useForceRerender } from '@/composables/useForceRerender';
import { useColorModeValue } from '@/composables/useTheme';
import { flowingMenu } from '@/constants/code/Components/flowingMenuCode';
import FlowingMenu, { type FlowingMenuItem } from '@/content/Components/FlowingMenu/FlowingMenu.vue';

type Direction = 'left' | 'right' | 'alternate';
type Align = 'center' | 'left';
type Shape = 'pill' | 'rounded' | 'circle';
type Preset = 'liquid' | 'capsule' | 'editorial' | 'slab';
type Palette = {
  textColor: string;
  bgColor: string;
  marqueeBgColor: string;
  marqueeTextColor: string;
  borderColor: string;
};

const ITEMS: FlowingMenuItem[] = [
  {
    link: '#',
    text: 'Mojave',
    meta: '2018',
    image: 'https://images.unsplash.com/photo-1782977389500-dd7adad33ebe?q=80&w=600&h=400&fit=crop&sat=-100&auto=format'
  },
  {
    link: '#',
    text: 'Sonoma',
    meta: '2023',
    image: 'https://images.unsplash.com/photo-1781499455083-6ccc3beb20cd?q=80&w=600&h=400&fit=crop&sat=-100&auto=format'
  },
  {
    link: '#',
    text: 'Monterey',
    meta: '2021',
    image: 'https://images.unsplash.com/photo-1776394254711-4a0d7345269a?q=80&w=600&h=400&fit=crop&sat=-100&auto=format'
  },
  {
    link: '#',
    text: 'Sequoia',
    meta: '2024',
    image: 'https://images.unsplash.com/photo-1781242629922-6f39cc3671cd?q=80&w=600&h=400&fit=crop&sat=-100&auto=format'
  }
];

const PLAIN_ITEMS: FlowingMenuItem[] = ITEMS.map(item => ({ ...item, meta: undefined }));

const LOOK = {
  speed: 60,
  direction: 'left' as Direction,
  followCursor: 0.4,
  duration: 0.5,
  stretch: 0.6,
  magnet: 0.25,
  bandInset: 0,
  bandRadius: 0,
  carryContent: false,
  dividers: true,
  dimInactive: false,
  align: 'center' as Align,
  showIndex: false,
  showArrow: false,
  imageShape: 'pill' as Shape,
  meta: false
};

const COLORS = {
  textColor: '',
  bgColor: '',
  marqueeBgColor: '',
  marqueeTextColor: '',
  borderColor: ''
};

const DEFAULT_PROPS = {
  preset: 'liquid' as Preset,
  ...LOOK,
  ...COLORS,
  intro: true
};

const PALETTES: Record<Preset, { dark: Palette; light: Palette }> = {
  liquid: {
    dark: {
      textColor: '#ffffff',
      bgColor: '#111111',
      marqueeBgColor: '#ffffff',
      marqueeTextColor: '#111111',
      borderColor: 'rgba(255, 255, 255, 0.14)'
    },
    light: {
      textColor: '#161816',
      bgColor: '#ffffff',
      marqueeBgColor: '#161816',
      marqueeTextColor: '#ffffff',
      borderColor: 'rgba(22, 24, 22, 0.1)'
    }
  },
  capsule: {
    dark: {
      textColor: '#ffffff',
      bgColor: '#111111',
      marqueeBgColor: '#ff6a3d',
      marqueeTextColor: '#111111',
      borderColor: 'rgba(255, 255, 255, 0.1)'
    },
    light: {
      textColor: '#161816',
      bgColor: '#ffffff',
      marqueeBgColor: '#ff6a3d',
      marqueeTextColor: '#111111',
      borderColor: 'rgba(22, 24, 22, 0.08)'
    }
  },
  editorial: {
    dark: {
      textColor: '#efeae0',
      bgColor: '#141210',
      marqueeBgColor: '#efeae0',
      marqueeTextColor: '#141210',
      borderColor: 'rgba(239, 234, 224, 0.16)'
    },
    light: {
      textColor: '#1a1714',
      bgColor: '#f4f1ea',
      marqueeBgColor: '#1a1714',
      marqueeTextColor: '#f4f1ea',
      borderColor: 'rgba(26, 23, 20, 0.14)'
    }
  },
  slab: {
    dark: {
      textColor: '#ffffff',
      bgColor: '#111111',
      marqueeBgColor: '#2a2d2a',
      marqueeTextColor: '#ffffff',
      borderColor: 'rgba(255, 255, 255, 0.1)'
    },
    light: {
      textColor: '#161816',
      bgColor: '#ffffff',
      marqueeBgColor: '#f0f2f0',
      marqueeTextColor: '#161816',
      borderColor: 'rgba(22, 24, 22, 0.08)'
    }
  }
};

const PRESETS: Record<Preset, Partial<typeof LOOK>> = {
  liquid: {},
  capsule: {
    bandInset: 12,
    bandRadius: 999,
    carryContent: true,
    imageShape: 'circle',
    stretch: 0.85,
    magnet: 0.35,
    speed: 80,
    followCursor: 0.6,
    dividers: false,
    dimInactive: true
  },
  editorial: {
    align: 'left',
    showIndex: true,
    showArrow: true,
    imageShape: 'rounded',
    direction: 'alternate',
    duration: 0.45,
    stretch: 0.3,
    magnet: 0.15,
    speed: 40,
    dimInactive: true,
    meta: true
  },
  slab: {
    bandInset: 18,
    bandRadius: 22,
    carryContent: true,
    imageShape: 'rounded',
    stretch: 1,
    magnet: 0.4,
    duration: 0.65,
    speed: 55,
    dividers: false,
    dimInactive: true
  }
};

const PRESET_OPTIONS = [
  { value: 'liquid', label: 'Liquid' },
  { value: 'capsule', label: 'Capsule' },
  { value: 'editorial', label: 'Editorial' },
  { value: 'slab', label: 'Slab' }
];

const DIRECTION_OPTIONS = [
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' },
  { value: 'alternate', label: 'Alternate' }
];

const ALIGN_OPTIONS = [
  { value: 'center', label: 'Center' },
  { value: 'left', label: 'Left' }
];

const SHAPE_OPTIONS = [
  { value: 'pill', label: 'Pill' },
  { value: 'rounded', label: 'Rounded' },
  { value: 'circle', label: 'Circle' }
];

const propData: PropRow[] = [
  {
    name: 'items',
    type: 'Array<{ text, link?, image?, marquee?, meta? }>',
    default: '[]',
    description:
      'Menu rows. marquee changes the text that scrolls in the band and meta adds a note at the end of the row.'
  },
  { name: 'speed', type: 'number', default: '60', description: 'Marquee speed in px per second.' },
  {
    name: 'direction',
    type: "'left' | 'right' | 'alternate'",
    default: "'left'",
    description: 'Which way the marquee runs. Alternate flips every other row.'
  },
  {
    name: 'followCursor',
    type: 'number',
    default: '0.4',
    description: 'How much moving the cursor sideways speeds up or reverses the marquee, from 0 to 1.'
  },
  {
    name: 'duration',
    type: 'number',
    default: '0.5',
    description: 'Time in seconds the band takes to glide to a row.'
  },
  {
    name: 'stretch',
    type: 'number',
    default: '0.6',
    description: 'How much the band stretches like liquid while it moves, from 0 for rigid to 1.'
  },
  {
    name: 'magnet',
    type: 'number',
    default: '0.25',
    description: 'How much the band leans toward the cursor inside a row, from 0 to 1.'
  },
  { name: 'bandInset', type: 'number', default: '0', description: 'Gap in px between the band and the row edges.' },
  {
    name: 'carryContent',
    type: 'boolean',
    default: 'false',
    description: 'Moves the marquee with the band instead of keeping it fixed in each row.'
  },
  {
    name: 'bandRadius',
    type: 'number',
    default: '0',
    description: 'Corner radius of the band in px. Use a large value for a pill.'
  },
  { name: 'textColor', type: 'string', default: "'#ffffff'", description: 'Color of the menu text.' },
  { name: 'bgColor', type: 'string', default: "'#111111'", description: 'Background color of the menu.' },
  { name: 'marqueeBgColor', type: 'string', default: "'#ffffff'", description: 'Background color of the band.' },
  { name: 'marqueeTextColor', type: 'string', default: "'#111111'", description: 'Text color inside the band.' },
  {
    name: 'borderColor',
    type: 'string',
    default: "'rgba(255, 255, 255, 0.14)'",
    description: 'Color of the lines between rows.'
  },
  { name: 'dividers', type: 'boolean', default: 'true', description: 'Draws lines between rows.' },
  {
    name: 'dimInactive',
    type: 'boolean',
    default: 'false',
    description: 'Fades the other rows while the band is on one.'
  },
  { name: 'align', type: "'center' | 'left'", default: "'center'", description: 'Alignment of the row labels.' },
  { name: 'showIndex', type: 'boolean', default: 'false', description: 'Numbers each row.' },
  { name: 'showArrow', type: 'boolean', default: 'false', description: 'Adds an arrow to the end of each row.' },
  {
    name: 'imageShape',
    type: "'pill' | 'rounded' | 'circle'",
    default: "'pill'",
    description: 'Shape of the images in the band.'
  },
  {
    name: 'intro',
    type: 'boolean',
    default: 'true',
    description: 'Rows rise in, the lines draw and the band sweeps once down the menu on mount.'
  },
  { name: 'activeIndex', type: 'number', default: '-', description: 'Marks the current page row.' },
  {
    name: 'onItemClick',
    type: '(item, index, event) => void',
    default: '-',
    description: 'Called when a row is clicked.'
  },
  { name: 'ariaLabel', type: 'string', default: "'Menu'", description: 'Accessible name of the navigation.' },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the menu.' },
  { name: 'style', type: 'CSSProperties', default: '-', description: 'Inline styles for the menu.' }
];

const { rerenderKey, forceRerender } = useForceRerender();
const { props, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);
const theme = useColorModeValue<'light' | 'dark'>('light', 'dark');

const settings = computed(() => {
  const {
    preset: _preset,
    meta: _meta,
    textColor: _textColor,
    bgColor: _bgColor,
    marqueeBgColor: _marqueeBgColor,
    marqueeTextColor: _marqueeTextColor,
    borderColor: _borderColor,
    ...rest
  } = props.value;
  return rest;
});

const colors = computed<Palette>(() => {
  const palette = (PALETTES[props.value.preset] ?? PALETTES.liquid)[theme.value];
  return {
    textColor: props.value.textColor || palette.textColor,
    bgColor: props.value.bgColor || palette.bgColor,
    marqueeBgColor: props.value.marqueeBgColor || palette.marqueeBgColor,
    marqueeTextColor: props.value.marqueeTextColor || palette.marqueeTextColor,
    borderColor: props.value.borderColor || palette.borderColor
  };
});

const applyPreset = (value: unknown) => {
  const preset = value as Preset;
  updateProps({ ...LOOK, ...COLORS, ...PRESETS[preset], preset });
  forceRerender();
};

const setIntro = (value: boolean) => {
  updateProp('intro', value);
  forceRerender();
};
</script>
