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
          class="demo-container relative overflow-hidden"
          :style="{ height: '500px', padding: '0', ...(backdrop ? { background: backdrop } : {}) }"
        >
          <GlassIcons
            :key="`${preset}-${rerenderKey}`"
            v-bind="settings"
            :icon-color="ink"
            :items="items"
            :theme="theme"
          />
          <RefreshButton @click="forceRerender" />
        </div>

        <Customize>
          <PreviewSelect
            title="Preset"
            :options="PRESET_OPTIONS"
            :model-value="preset"
            @update:model-value="value => applyPreset(value as PresetKey)"
          />

          <PreviewSelect
            title="Plate"
            :options="PLATE_OPTIONS"
            :model-value="props.plate"
            @update:model-value="value => updateProp('plate', value as Plate)"
          />

          <PreviewSelect
            title="Hover"
            :options="HOVER_OPTIONS"
            :model-value="props.hover"
            @update:model-value="value => updateProp('hover', value as Hover)"
          />

          <PreviewSelect
            title="Labels"
            :options="LABEL_OPTIONS"
            :model-value="props.labels"
            @update:model-value="value => updateProp('labels', value as Labels)"
          />

          <PreviewColorPickerCustom title="Tint" :color="props.tint" @change="value => updateProp('tint', value)" />

          <PreviewColorPickerCustom title="Icon Color" :color="ink" @change="value => updateProp('iconColor', value)" />

          <PreviewSlider
            title="Size"
            :min="40"
            :max="120"
            :step="2"
            value-unit="px"
            :model-value="props.size"
            @update:model-value="value => updateProp('size', value)"
          />

          <PreviewSlider
            title="Gap"
            :min="8"
            :max="96"
            :step="2"
            value-unit="px"
            :model-value="props.gap"
            @update:model-value="value => updateProp('gap', value)"
          />

          <PreviewSlider
            title="Columns"
            :min="1"
            :max="6"
            :step="1"
            :model-value="props.columns"
            @update:model-value="value => updateProp('columns', value)"
          />

          <PreviewSlider
            title="Roundness"
            :min="0"
            :max="1"
            :step="0.02"
            :model-value="props.roundness"
            @update:model-value="value => updateProp('roundness', value)"
          />

          <PreviewSlider
            title="Refraction"
            :min="0"
            :max="1.5"
            :step="0.05"
            :model-value="props.refraction"
            @update:model-value="value => updateProp('refraction', value)"
          />

          <PreviewSlider
            title="Bevel"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.bevel"
            @update:model-value="value => updateProp('bevel', value)"
          />

          <PreviewSlider
            title="Dispersion"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.dispersion"
            @update:model-value="value => updateProp('dispersion', value)"
          />

          <PreviewSlider
            title="Frost"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.frost"
            @update:model-value="value => updateProp('frost', value)"
          />

          <PreviewSlider
            title="Shine"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.shine"
            @update:model-value="value => updateProp('shine', value)"
          />

          <PreviewSlider
            title="Tint Opacity"
            :min="0"
            :max="0.6"
            :step="0.02"
            :model-value="props.tintOpacity"
            @update:model-value="value => updateProp('tintOpacity', value)"
          />

          <PreviewSlider
            v-if="props.plate === 'tilt'"
            title="Tilt"
            :min="-45"
            :max="45"
            :step="1"
            value-unit="°"
            :model-value="props.tilt"
            @update:model-value="value => updateProp('tilt', value)"
          />

          <PreviewSlider
            v-if="props.plate === 'offset' || props.plate === 'circle'"
            title="Spread"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.spread"
            @update:model-value="value => updateProp('spread', value)"
          />

          <PreviewSwitch
            title="Intro"
            :model-value="props.intro"
            @update:model-value="value => updateProp('intro', value)"
          />

          <PreviewSlider
            title="Parallax"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.parallax"
            @update:model-value="value => updateProp('parallax', value)"
          />
        </Customize>

        <PropTable :data="propData" />
      </template>

      <template #code>
        <CodeExample :code-object="glassIcons" component-name="GlassIcons" />
      </template>
    </TabsLayout>
  </ComponentPropsProvider>
</template>

<script setup lang="ts">
import { computed, h } from 'vue';
import { HugeiconsIcon, type IconArray } from '@hugeicons/vue';
import {
  Book02Icon,
  ChartHistogramIcon,
  CloudIcon,
  DribbbleIcon,
  FavouriteIcon,
  Folder01Icon,
  GithubIcon,
  InstagramIcon,
  Linkedin01Icon,
  NewTwitterIcon,
  Note01Icon,
  YoutubeIcon
} from '@hugeicons/core-free-icons';
import CodeExample from '@/components/common/CodeExample.vue';
import Customize from '@/components/common/Customize.vue';
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
import { glassIcons } from '@/constants/code/Components/glassIconsCode';
import GlassIcons, { type GlassIconsItem } from '@/content/Components/GlassIcons/GlassIcons.vue';

type Plate = 'tilt' | 'offset' | 'circle' | 'none';
type Hover = 'lift' | 'float' | 'press' | 'none';
type Labels = 'hover' | 'always' | 'none';
type PresetKey = 'apps' | 'mono' | 'social' | 'dock' | 'clear';

const glyph = (icon: unknown) => h(HugeiconsIcon, { icon: icon as IconArray, size: 24, strokeWidth: 1.8 });

const APPS: GlassIconsItem[] = [
  { icon: glyph(Folder01Icon), color: 'blue', label: 'Files' },
  { icon: glyph(Book02Icon), color: 'teal', label: 'Books' },
  { icon: glyph(FavouriteIcon), color: 'red', label: 'Health' },
  { icon: glyph(CloudIcon), color: 'indigo', label: 'Weather' },
  { icon: glyph(Note01Icon), color: 'orange', label: 'Notes' },
  { icon: glyph(ChartHistogramIcon), color: 'green', label: 'Stats' }
];

const MONO: GlassIconsItem[] = APPS.map(item => ({ ...item, color: 'graphite' }));

const SOCIAL: GlassIconsItem[] = [
  { icon: glyph(GithubIcon), color: 'linear-gradient(135deg, #474c48, #1b1e1c)', label: 'GitHub' },
  { icon: glyph(NewTwitterIcon), color: 'linear-gradient(135deg, #3b3f3c, #111312)', label: 'X' },
  { icon: glyph(Linkedin01Icon), color: 'linear-gradient(135deg, #2f8ae0, #0a5bb8)', label: 'LinkedIn' },
  {
    icon: glyph(InstagramIcon),
    color: 'linear-gradient(135deg, #feda75, #fa7e1e 30%, #d62976 60%, #962fbf 85%)',
    label: 'Instagram'
  },
  { icon: glyph(YoutubeIcon), color: 'linear-gradient(135deg, #ff4e45, #c4120a)', label: 'YouTube' },
  { icon: glyph(DribbbleIcon), color: 'linear-gradient(135deg, #f58bb8, #d6427f)', label: 'Dribbble' }
];

const DEFAULT_PROPS = {
  preset: 'apps' as PresetKey,
  size: 82,
  gap: 66,
  columns: 3,
  roundness: 0.6,
  refraction: 0.8,
  bevel: 0.6,
  dispersion: 0,
  frost: 0.2,
  shine: 0.85,
  tint: '#dfdfdf',
  tintOpacity: 0.2,
  iconColor: '',
  plate: 'tilt' as Plate,
  tilt: 30,
  spread: 0.5,
  hover: 'press' as Hover,
  parallax: 1,
  labels: 'hover' as Labels,
  intro: true
};

const PRESETS: Record<PresetKey, Partial<typeof DEFAULT_PROPS>> = {
  apps: {},
  mono: {},
  social: { size: 56, gap: 22, columns: 6, roundness: 1, plate: 'circle', spread: 0.12 },
  dock: { size: 60, gap: 16, columns: 6, roundness: 0.42, plate: 'offset', spread: 0.35, hover: 'float' },
  clear: { plate: 'none', refraction: 0.9, dispersion: 0.6, frost: 0.15, tintOpacity: 0.06 }
};

const PRESET_OPTIONS = [
  { value: 'apps', label: 'Apps' },
  { value: 'mono', label: 'Mono' },
  { value: 'social', label: 'Social' },
  { value: 'dock', label: 'Dock' },
  { value: 'clear', label: 'Clear' }
];

const PLATE_OPTIONS = [
  { value: 'tilt', label: 'Tilt' },
  { value: 'offset', label: 'Offset' },
  { value: 'circle', label: 'Circle' },
  { value: 'none', label: 'None' }
];

const HOVER_OPTIONS = [
  { value: 'lift', label: 'Lift' },
  { value: 'float', label: 'Float' },
  { value: 'press', label: 'Press' },
  { value: 'none', label: 'None' }
];

const LABEL_OPTIONS = [
  { value: 'hover', label: 'On Hover' },
  { value: 'always', label: 'Always' },
  { value: 'none', label: 'Hidden' }
];

const { rerenderKey, forceRerender } = useForceRerender();
const { props, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);
const theme = useColorModeValue<'light' | 'dark'>('light', 'dark');

const preset = computed(() => props.value.preset);
const settings = computed(() => {
  const { preset: _preset, iconColor: _iconColor, ...rest } = props.value;
  return rest;
});
const ink = computed(
  () => props.value.iconColor || (theme.value === 'light' && props.value.plate === 'none' ? '#252825' : '#ffffff')
);
const items = computed(() => (preset.value === 'mono' ? MONO : preset.value === 'social' ? SOCIAL : APPS));
const backdrop = computed(() =>
  preset.value === 'clear'
    ? `url(/assets/demo/${theme.value === 'light' ? 'day' : 'night'}-landscape.webp) center / cover`
    : undefined
);

const computedProps = computed(() => ({
  iconColor: ink.value,
  ...(theme.value === 'light' ? { theme: 'light' } : {})
}));

const applyPreset = (value: PresetKey) => {
  updateProps({ ...DEFAULT_PROPS, ...PRESETS[value], preset: value });
};

const propData: PropRow[] = [
  {
    name: 'items',
    type: 'GlassIconsItem[]',
    default: '[]',
    description:
      'Icons to show. Each item takes an icon, a label and a color, plus an optional href, target, onClick, id and className. Color is a preset name (blue, purple, red, indigo, orange, green, teal, pink, graphite, silver) or any CSS color or gradient.'
  },
  { name: 'size', type: 'number', default: '82', description: 'Width and height of each icon in px.' },
  { name: 'gap', type: 'number', default: '66', description: 'Space between the icons in px.' },
  {
    name: 'columns',
    type: 'number',
    default: '3',
    description: 'Icons per row. They wrap to fewer columns when there is not enough room.'
  },
  {
    name: 'roundness',
    type: 'number',
    default: '0.6',
    description: 'Corner rounding, from 0 for square to 1 for a circle.'
  },
  {
    name: 'refraction',
    type: 'number',
    default: '0.8',
    description: 'How strongly the glass bends what is behind it around its edge. Works in Chromium browsers.'
  },
  { name: 'bevel', type: 'number', default: '0.6', description: 'Width of the curved glass edge, from 0 to 1.' },
  {
    name: 'dispersion',
    type: 'number',
    default: '0',
    description: 'Rainbow fringing where the edge bends the light, from 0 to 1.'
  },
  {
    name: 'frost',
    type: 'number',
    default: '0.2',
    description: 'How much the glass blurs what is behind it, from 0 to 1.'
  },
  {
    name: 'shine',
    type: 'number',
    default: '0.85',
    description: 'Strength of the light catching the glass edge, from 0 to 1.'
  },
  { name: 'tint', type: 'string', default: "'#dfdfdf'", description: 'Color of the glass.' },
  {
    name: 'tintOpacity',
    type: 'number',
    default: '0.2',
    description: 'How strongly the tint colors the glass, from 0 to 1.'
  },
  {
    name: 'iconColor',
    type: 'string',
    default: '-',
    description: 'Color of the icons on the glass. Defaults to white, or near black on clear glass in the light theme.'
  },
  {
    name: 'plate',
    type: "'tilt' | 'offset' | 'circle' | 'none'",
    default: "'tilt'",
    description: 'Colored shape behind the glass: a tilted card, a shifted card, a disc or nothing for clear glass.'
  },
  { name: 'tilt', type: 'number', default: '30', description: 'Angle of the tilted card in degrees.' },
  {
    name: 'spread',
    type: 'number',
    default: '0.5',
    description: 'How far the shifted card or disc peeks out from behind the glass, from 0 to 1.'
  },
  {
    name: 'hover',
    type: "'lift' | 'float' | 'press' | 'none'",
    default: "'press'",
    description:
      'Hover animation. Lift raises the glass and swings the card, float raises the glass and press pushes it in.'
  },
  {
    name: 'parallax',
    type: 'number',
    default: '1',
    description: 'How far the card behind the glass drifts with the pointer, from 0 to 1.'
  },
  {
    name: 'labels',
    type: "'hover' | 'always' | 'none'",
    default: "'hover'",
    description: 'When the labels under the icons are shown.'
  },
  {
    name: 'intro',
    type: 'boolean',
    default: 'true',
    description:
      'Plays an entrance the first time the icons scroll into view: the glass settles and the cards swing out.'
  },
  {
    name: 'theme',
    type: "'dark' | 'light'",
    default: "'dark'",
    description: 'Color scheme of the labels and glass edges.'
  },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the container.' },
  { name: 'style', type: 'CSSProperties', default: '-', description: 'Inline styles for the container.' }
];
</script>
