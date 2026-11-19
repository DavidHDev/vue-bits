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
        <div class="demo-container relative overflow-hidden" style="height: 480px; padding: 0">
          <TechText :key="rerenderKey" v-bind="settings" />
          <RefreshButton @click="forceRerender" />
        </div>

        <Customize>
          <PreviewSelect
            title="Preset"
            :options="PRESET_OPTIONS"
            :model-value="props.preset"
            @update:model-value="value => applyPreset(String(value))"
          />
          <PreviewColorPickerCustom
            title="Color"
            :color="shown(settings.color)"
            @change="value => updateProp('color', value)"
          />
          <PreviewColorPickerCustom
            title="Accent"
            :color="shown(settings.accentColor)"
            @change="value => updateProp('accentColor', value)"
          />

          <PreviewSelect
            title="Intro"
            :options="INTRO_OPTIONS"
            :model-value="settings.intro"
            @update:model-value="value => updateProp('intro', value as Intro)"
          />
          <PreviewSlider
            title="Intro Duration"
            :min="0.6"
            :max="4"
            :step="0.1"
            :is-disabled="settings.intro === 'none'"
            value-unit="s"
            :model-value="settings.introDuration"
            @update:model-value="value => updateProp('introDuration', value)"
          />
          <PreviewSelect
            title="Reveal"
            :options="REVEAL_OPTIONS"
            :model-value="settings.reveal"
            @update:model-value="value => updateProp('reveal', value as Reveal)"
          />
          <PreviewSlider
            title="Reach"
            :is-disabled="settings.reveal !== 'area'"
            :min="80"
            :max="400"
            :step="10"
            value-unit="px"
            :model-value="settings.reach"
            @update:model-value="value => updateProp('reach', value)"
          />
          <PreviewSlider
            title="Softness"
            :is-disabled="settings.reveal !== 'area'"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.softness"
            @update:model-value="value => updateProp('softness', value)"
          />
          <PreviewSlider
            title="Speed"
            :min="0.2"
            :max="3"
            :step="0.1"
            :is-disabled="!settings.sweep"
            :model-value="settings.speed"
            @update:model-value="value => updateProp('speed', value)"
          />
          <PreviewSlider
            title="Bounce"
            :min="0"
            :max="0.9"
            :step="0.05"
            :is-disabled="!settings.draggable && !settings.clickKick"
            :model-value="settings.bounce"
            @update:model-value="value => updateProp('bounce', value)"
          />

          <PreviewInput
            title="Text"
            :max-length="24"
            :model-value="settings.text"
            @update:model-value="value => updateProp('text', value)"
          />
          <PreviewSelect
            title="Font"
            :options="FONT_OPTIONS"
            :model-value="settings.fontFamily"
            @update:model-value="value => updateProp('fontFamily', value as string)"
          />
          <PreviewSelect
            title="Align"
            :options="ALIGN_OPTIONS"
            :model-value="settings.align"
            @update:model-value="value => updateProp('align', value as Align)"
          />
          <PreviewSlider
            title="Font Weight"
            :min="300"
            :max="900"
            :step="100"
            :model-value="settings.fontWeight"
            @update:model-value="value => updateProp('fontWeight', value)"
          />
          <PreviewSlider
            title="Font Size"
            :min="60"
            :max="320"
            :step="5"
            value-unit="px"
            :model-value="settings.fontSize"
            @update:model-value="value => updateProp('fontSize', value)"
          />
          <PreviewSlider
            title="Letter Spacing"
            :min="-0.1"
            :max="0.2"
            :step="0.01"
            value-unit="em"
            :model-value="settings.letterSpacing"
            @update:model-value="value => updateProp('letterSpacing', value)"
          />
          <PreviewSelect
            title="Line Style"
            :options="LINE_OPTIONS"
            :model-value="settings.lineStyle"
            @update:model-value="value => updateProp('lineStyle', value as LineStyle)"
          />
          <PreviewSlider
            title="Dash Length"
            :min="2"
            :max="16"
            :step="1"
            :is-disabled="settings.lineStyle === 'solid'"
            value-unit="px"
            :model-value="settings.dashLength"
            @update:model-value="value => updateProp('dashLength', value)"
          />
          <PreviewSlider
            title="Dash Gap"
            :min="2"
            :max="12"
            :step="1"
            :is-disabled="settings.lineStyle === 'solid'"
            value-unit="px"
            :model-value="settings.dashGap"
            @update:model-value="value => updateProp('dashGap', value)"
          />
          <PreviewSlider
            title="Stroke Width"
            :min="0.5"
            :max="4"
            :step="0.25"
            value-unit="px"
            :model-value="settings.strokeWidth"
            @update:model-value="value => updateProp('strokeWidth', value)"
          />
          <PreviewSlider
            title="Specks"
            :min="0"
            :max="48"
            :step="1"
            :model-value="settings.specks"
            @update:model-value="value => updateProp('specks', value)"
          />

          <PreviewSwitch
            title="Click Kick"
            :model-value="settings.clickKick"
            @update:model-value="value => updateProp('clickKick', value)"
          />
          <PreviewSwitch
            title="Draggable"
            :model-value="settings.draggable"
            @update:model-value="value => updateProp('draggable', value)"
          />
          <PreviewSwitch
            title="Sweep"
            :model-value="settings.sweep"
            @update:model-value="value => updateProp('sweep', value)"
          />
          <PreviewSwitch
            title="Selection"
            :model-value="settings.selection"
            @update:model-value="value => updateProp('selection', value)"
          />
          <PreviewSwitch
            title="Labels"
            :model-value="settings.labels"
            @update:model-value="value => updateProp('labels', value)"
          />
          <PreviewSwitch
            title="Guides"
            :model-value="settings.guides"
            @update:model-value="value => updateProp('guides', value)"
          />
        </Customize>

        <PropTable :data="propData" />
        <Dependencies :dependency-list="[]" />
      </template>

      <template #code>
        <CodeExample :code-object="techText" component-name="TechText" />
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
import PreviewInput from '@/components/common/PreviewInput.vue';
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
import { techText } from '@/constants/code/TextAnimations/techTextCode';
import TechText from '@/content/TextAnimations/TechText/TechText.vue';

type Align = 'left' | 'center' | 'right';
type LineStyle = 'dashed' | 'solid';
type Reveal = 'area' | 'letter' | 'off';
type Intro = 'none' | 'type' | 'assemble' | 'metrics';

type Look = {
  fontFamily: string;
  fontWeight: number;
  letterSpacing: number;
  accentColor: string;
  reveal: Reveal;
  reach: number;
  softness: number;
  lineStyle: LineStyle;
  dashLength: number;
  dashGap: number;
  strokeWidth: number;
  specks: number;
  speed: number;
  bounce: number;
  selection: boolean;
  labels: boolean;
  intro: Intro;
  introDuration: number;
  guides: boolean;
};

const LOOK: Look = {
  fontFamily: '',
  fontWeight: 600,
  letterSpacing: -0.05,
  accentColor: 'currentColor',
  reveal: 'letter',
  reach: 200,
  softness: 0.7,
  lineStyle: 'dashed',
  dashLength: 4,
  dashGap: 2,
  strokeWidth: 1.5,
  specks: 15,
  speed: 1,
  bounce: 0.4,
  selection: true,
  labels: true,
  intro: 'none',
  introDuration: 2,
  guides: false
};

const PRESETS: Record<string, Look> = {
  vector: { ...LOOK },
  lens: {
    ...LOOK,
    reveal: 'area',
    reach: 240,
    softness: 0.85,
    lineStyle: 'solid',
    strokeWidth: 1,
    specks: 0,
    labels: false,
    intro: 'type',
    introDuration: 1.4
  },
  mono: {
    ...LOOK,
    fontFamily: '"Geist Mono", monospace',
    fontWeight: 500,
    letterSpacing: -0.02,
    accentColor: '#ff5a36',
    dashLength: 2,
    dashGap: 2,
    strokeWidth: 1,
    specks: 32,
    intro: 'assemble',
    introDuration: 2.2
  },
  serif: {
    ...LOOK,
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontWeight: 400,
    letterSpacing: -0.03,
    lineStyle: 'solid',
    strokeWidth: 1.25,
    specks: 6,
    bounce: 0.75,
    intro: 'metrics',
    introDuration: 2.8,
    guides: true
  }
};

const PRESET_OPTIONS = [
  { value: 'vector', label: 'Vector' },
  { value: 'lens', label: 'Lens' },
  { value: 'mono', label: 'Mono' },
  { value: 'serif', label: 'Serif' }
];

const DEFAULT_PROPS = {
  preset: 'vector',
  text: 'Vue Bits',
  ...LOOK,
  color: 'currentColor',
  fontSize: 150,
  align: 'center' as Align,
  draggable: true,
  clickKick: true,
  sweep: true
};

const REVEAL_OPTIONS = [
  { label: 'Area', value: 'area' },
  { label: 'Letter', value: 'letter' },
  { label: 'Off', value: 'off' }
];

const INTRO_OPTIONS = [
  { label: 'None', value: 'none' },
  { label: 'Type', value: 'type' },
  { label: 'Assemble', value: 'assemble' },
  { label: 'Metrics', value: 'metrics' }
];

const LINE_OPTIONS = [
  { label: 'Dashed', value: 'dashed' },
  { label: 'Solid', value: 'solid' }
];

const ALIGN_OPTIONS = [
  { label: 'Left', value: 'left' },
  { label: 'Center', value: 'center' },
  { label: 'Right', value: 'right' }
];

const FONT_OPTIONS = [
  { label: 'Inherit', value: '' },
  { label: 'Geist Mono', value: '"Geist Mono", monospace' },
  { label: 'Serif', value: 'Georgia, "Times New Roman", serif' },
  { label: 'System', value: 'system-ui, sans-serif' }
];

const propData: PropRow[] = [
  { name: 'text', type: 'string', default: "'Vue Bits'", description: 'The wordmark to render.' },
  {
    name: 'fontFamily',
    type: 'string',
    default: "''",
    description: 'Any font family loaded on the page. Leave empty to inherit the font of the container.'
  },
  { name: 'fontWeight', type: 'number', default: '600', description: 'Weight of the wordmark.' },
  {
    name: 'fontSize',
    type: 'number',
    default: '150',
    description: 'Largest font size in px. The wordmark shrinks to fit narrower containers.'
  },
  { name: 'letterSpacing', type: 'number', default: '-0.05', description: 'Extra space between letters, in em.' },
  {
    name: 'align',
    type: "'left' | 'center' | 'right'",
    default: "'center'",
    description: 'Where the wordmark sits across the container.'
  },
  {
    name: 'color',
    type: 'string',
    default: "'currentColor'",
    description: 'Colour of the letters and their outlines. Follows the surrounding text colour by default.'
  },
  {
    name: 'accentColor',
    type: 'string',
    default: "'currentColor'",
    description: 'Colour of the selection frame, connector, specks and labels.'
  },
  {
    name: 'reveal',
    type: "'area' | 'letter' | 'off'",
    default: "'letter'",
    description:
      'Area fades the letters into outlines inside a circle around the pointer. Letter turns only the active letter into its outline. Off keeps every letter solid.'
  },
  {
    name: 'reach',
    type: 'number',
    default: '200',
    description: 'Radius around the pointer where the letters turn into vector outlines, in px.'
  },
  {
    name: 'softness',
    type: 'number',
    default: '0.7',
    description: 'How gradually the fill hands over to the outlines. 0 is a hard edge.'
  },
  { name: 'dashLength', type: 'number', default: '4', description: 'Length of each outline dash, in px.' },
  { name: 'dashGap', type: 'number', default: '2', description: 'Space between outline dashes, in px.' },
  {
    name: 'lineStyle',
    type: "'dashed' | 'solid'",
    default: "'dashed'",
    description: 'How the outlines under the pointer are drawn. Only the outer silhouette is traced either way.'
  },
  { name: 'strokeWidth', type: 'number', default: '1.5', description: 'Thickness of the outline, in px.' },
  {
    name: 'specks',
    type: 'number',
    default: '15',
    description: 'Tiny squares that blink and respawn around the active letter, seeded per letter. 0 turns them off.'
  },
  {
    name: 'selection',
    type: 'boolean',
    default: 'true',
    description: 'Frame the letter under the pointer. The frame glides from letter to letter.'
  },
  {
    name: 'labels',
    type: 'boolean',
    default: 'true',
    description: 'Label the frame with the letter and its size, or with its offset while dragged.'
  },
  {
    name: 'draggable',
    type: 'boolean',
    default: 'true',
    description: 'Let letters be dragged off the baseline. They spring back home on release.'
  },
  {
    name: 'bounce',
    type: 'number',
    default: '0.4',
    description: 'How much a released letter overshoots on its way home, from 0 (none) to 1 (very springy).'
  },
  {
    name: 'clickKick',
    type: 'boolean',
    default: 'true',
    description:
      'Clicking a letter kicks it upward on its spring and sends a ripple through its neighbours, each leaving its outline behind while it moves.'
  },
  {
    name: 'intro',
    type: "'none' | 'type' | 'assemble' | 'metrics'",
    default: "'none'",
    description:
      'Entrance played once the wordmark is in view. Type places each letter as an outline under the selection frame, assemble flies pixel specks into the letters, metrics rules the font lines first and fills the letters zone by zone between them.'
  },
  {
    name: 'introDuration',
    type: 'number',
    default: '2',
    description: 'Length of the intro, in seconds.'
  },
  {
    name: 'guides',
    type: 'boolean',
    default: 'false',
    description: 'Rule the baseline, x-height, cap height and descender across the wordmark while a letter is active.'
  },
  {
    name: 'sweep',
    type: 'boolean',
    default: 'true',
    description: 'Sweep the reveal across the wordmark on its own while the pointer is away.'
  },
  { name: 'speed', type: 'number', default: '1', description: 'Speed of the idle sweep.' },
  { name: 'className', type: 'string', default: "''", description: 'Extra classes on the container.' },
  { name: 'style', type: 'CSSProperties', default: '-', description: 'Inline styles on the container.' }
];

const { rerenderKey, forceRerender } = useForceRerender();
const { props, defaultProps, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);
const settings = computed(() => {
  const { preset: _preset, ...rest } = props.value;
  return rest;
});
const ink = useColorModeValue('#161816', '#ffffff');
const shown = (value: string) => (value === 'currentColor' ? ink.value : value);

const applyPreset = (value: string) => {
  const base = Object.fromEntries(
    (Object.keys(LOOK) as (keyof Look)[]).map(name => [name, defaultProps.value[name]])
  ) as Partial<typeof DEFAULT_PROPS>;
  updateProps({ ...base, ...PRESETS[value], preset: value });
  forceRerender();
};
</script>
