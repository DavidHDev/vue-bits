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
          class="demo-container relative flex items-center justify-center overflow-hidden p-6 md:p-12"
          style="min-height: 360px; container-type: inline-size"
        >
          <SplitFlapText :key="rerenderKey" v-bind="settings" :text-color="textColor" :font-size="fittedFontSize" />
        </div>

        <Customize>
          <PreviewSelect
            title="Preset"
            :options="PRESET_OPTIONS"
            :model-value="props.preset"
            @update:model-value="value => applyPreset(String(value))"
          />
          <PreviewColorPickerCustom
            title="Tile Color"
            :color="settings.tileColor"
            @change="value => updateProp('tileColor', value)"
          />
          <PreviewColorPickerCustom
            title="Text Color"
            :color="textColor"
            @change="value => updateProp('textColor', value)"
          />
          <PreviewSelect
            title="Phrase Set"
            :options="PHRASE_OPTIONS"
            :model-value="phraseSet"
            @update:model-value="value => updateProp('words', PHRASE_SETS[value as PhraseSet])"
          />
          <PreviewSelect
            title="Charset"
            :options="CHARSET_OPTIONS"
            :model-value="settings.charset"
            @update:model-value="value => updateProp('charset', String(value))"
          />
          <PreviewSelect
            title="Order"
            :options="ORDER_OPTIONS"
            :model-value="settings.order"
            @update:model-value="value => updateProp('order', value as SplitFlapOrder)"
          />
          <PreviewSlider
            title="Flip Duration"
            :min="0.06"
            :max="0.3"
            :step="0.01"
            value-unit="s"
            :model-value="settings.flipDuration"
            @update:model-value="value => updateProp('flipDuration', value)"
          />
          <PreviewSlider
            title="Stagger"
            :min="0"
            :max="0.14"
            :step="0.005"
            value-unit="s"
            :model-value="settings.stagger"
            @update:model-value="value => updateProp('stagger', value)"
          />
          <PreviewSlider
            title="Cycle Delay"
            :min="900"
            :max="5000"
            :step="100"
            value-unit="ms"
            :model-value="settings.cycleDelay"
            @update:model-value="value => updateProp('cycleDelay', value)"
          />
          <PreviewSlider
            title="Flips"
            :min="1"
            :max="14"
            :step="1"
            :model-value="settings.flipsPerChar"
            @update:model-value="value => updateProp('flipsPerChar', value)"
          />
          <PreviewSwitch
            title="Loop"
            :model-value="settings.loop"
            @update:model-value="value => updateProp('loop', value)"
          />
          <PreviewSwitch title="Intro" :model-value="settings.intro" @update:model-value="setIntro" />
          <PreviewSelect
            title="Tile Style"
            :options="STYLE_OPTIONS"
            :model-value="settings.tileStyle"
            @update:model-value="value => updateProp('tileStyle', value as SplitFlapTileStyle)"
          />
          <PreviewSelect
            title="Align"
            :options="ALIGN_OPTIONS"
            :model-value="settings.align"
            @update:model-value="value => updateProp('align', value as SplitFlapAlign)"
          />
          <PreviewSlider
            title="Glare"
            :min="0"
            :max="1"
            :step="0.05"
            :is-disabled="minimal"
            :model-value="settings.glare"
            @update:model-value="value => updateProp('glare', value)"
          />
          <PreviewSlider
            title="Depth"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.depth"
            @update:model-value="value => updateProp('depth', value)"
          />
          <PreviewSlider
            title="Pad To"
            :min="4"
            :max="18"
            :step="1"
            :model-value="settings.padTo"
            @update:model-value="value => updateProp('padTo', value)"
          />
          <PreviewSlider
            title="Font Size"
            :min="32"
            :max="96"
            :step="1"
            value-unit="px"
            :model-value="settings.fontSize"
            @update:model-value="value => updateProp('fontSize', value)"
          />
          <PreviewSlider
            title="Tile Radius"
            :min="0"
            :max="18"
            :step="1"
            value-unit="px"
            :is-disabled="minimal"
            :model-value="settings.tileRadius"
            @update:model-value="value => updateProp('tileRadius', value)"
          />
          <PreviewSlider
            title="Gap"
            :min="0"
            :max="14"
            :step="1"
            value-unit="px"
            :model-value="settings.gap"
            @update:model-value="value => updateProp('gap', value)"
          />
        </Customize>

        <PropTable :data="propData" />
        <Dependencies :dependency-list="[]" />
      </template>

      <template #code>
        <CodeExample :code-object="splitFlapText" component-name="SplitFlapText" />
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
import TabsLayout from '@/components/common/TabsLayout.vue';
import ComponentPropsProvider from '@/components/context/ComponentPropsProvider.vue';
import { useComponentProps } from '@/composables/useComponentProps';
import { useForceRerender } from '@/composables/useForceRerender';
import { useColorModeValue } from '@/composables/useTheme';
import { splitFlapText } from '@/constants/code/TextAnimations/splitFlapTextCode';
import SplitFlapText, {
  type SplitFlapAlign,
  type SplitFlapOrder,
  type SplitFlapTileStyle
} from '@/content/TextAnimations/SplitFlapText/SplitFlapText.vue';

const PHRASE_SETS = {
  launch: ['LAUNCH READY', 'SYNC ONLINE', 'SIGNAL LIVE'],
  travel: ['BOARDING NOW', 'FINAL CALL', 'GATE OPEN'],
  product: ['BUILD FASTER', 'SHIP CLEANER', 'DELIGHT USERS'],
  numeric: ['FLIGHT 204', 'GATE 18', 'SEAT 07A'],
  time: ['09:41', '12:30', '18:05']
};

type PhraseSet = keyof typeof PHRASE_SETS;

type Look = {
  words: string[];
  charset: string;
  align: SplitFlapAlign;
  tileColor: string;
  textColor: string;
  flipDuration: number;
  stagger: number;
  cycleDelay: number;
  flipsPerChar: number;
  padTo: number;
  fontSize: number;
  tileRadius: number;
  gap: number;
  order: SplitFlapOrder;
  tileStyle: SplitFlapTileStyle;
  glare: number;
  depth: number;
};

const LOOK: Look = {
  words: PHRASE_SETS.launch,
  charset: 'alphanumeric',
  align: 'left',
  tileColor: '#111827',
  textColor: '#f8fafc',
  flipDuration: 0.12,
  stagger: 0.06,
  cycleDelay: 2400,
  flipsPerChar: 8,
  padTo: 12,
  fontSize: 52,
  tileRadius: 8,
  gap: 6,
  order: 'left',
  tileStyle: 'board',
  glare: 0,
  depth: 0.5
};

const PRESETS: Record<string, Look> = {
  board: { ...LOOK },
  airport: {
    ...LOOK,
    words: PHRASE_SETS.travel,
    charset: 'alpha',
    tileColor: '#0a0a0a',
    textColor: '#facc15',
    flipDuration: 0.09,
    stagger: 0.035,
    flipsPerChar: 12,
    fontSize: 48,
    tileRadius: 3,
    gap: 3,
    order: 'random',
    glare: 0.75,
    depth: 0.85
  },
  minimal: {
    ...LOOK,
    words: PHRASE_SETS.product,
    align: 'center',
    flipDuration: 0.2,
    stagger: 0.045,
    flipsPerChar: 4,
    padTo: 13,
    fontSize: 64,
    gap: 1,
    order: 'center',
    tileStyle: 'minimal',
    depth: 0.6
  },
  clock: {
    ...LOOK,
    words: PHRASE_SETS.time,
    charset: 'numeric',
    align: 'center',
    tileColor: '#18181b',
    textColor: '#fafafa',
    flipDuration: 0.17,
    stagger: 0.08,
    cycleDelay: 2000,
    flipsPerChar: 6,
    padTo: 5,
    fontSize: 92,
    tileRadius: 14,
    gap: 10,
    order: 'right',
    glare: 0.45,
    depth: 1
  }
};

const DEFAULT_PROPS = {
  preset: 'board',
  ...LOOK,
  loop: true,
  intro: true
};

const PRESET_OPTIONS = [
  { value: 'board', label: 'Board' },
  { value: 'airport', label: 'Airport' },
  { value: 'minimal', label: 'Minimal' },
  { value: 'clock', label: 'Clock' }
];

const PHRASE_OPTIONS = [
  { value: 'launch', label: 'Launch' },
  { value: 'travel', label: 'Travel' },
  { value: 'product', label: 'Product' },
  { value: 'numeric', label: 'Numeric' },
  { value: 'time', label: 'Time' }
];

const CHARSET_OPTIONS = [
  { value: 'alphanumeric', label: 'A-Z + 0-9' },
  { value: 'alpha', label: 'A-Z' },
  { value: 'numeric', label: '0-9' },
  { value: 'ABCDEF0123456789•', label: 'Hex + dot' }
];

const ORDER_OPTIONS = [
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' },
  { value: 'center', label: 'Center' },
  { value: 'random', label: 'Random' }
];

const STYLE_OPTIONS = [
  { value: 'board', label: 'Board' },
  { value: 'minimal', label: 'Minimal' }
];

const ALIGN_OPTIONS = [
  { value: 'left', label: 'Left' },
  { value: 'center', label: 'Center' },
  { value: 'right', label: 'Right' }
];

const propData: PropRow[] = [
  {
    name: 'words',
    type: 'string[]',
    default: "['LAUNCH READY', 'SYNC ONLINE', 'SIGNAL LIVE']",
    description: 'Phrases to cycle through like a departure board.'
  },
  {
    name: 'text',
    type: 'string',
    default: 'undefined',
    description: 'Optional single phrase. When set, it takes precedence over words, and changing it flips the board.'
  },
  {
    name: 'flipDuration',
    type: 'number',
    default: '0.12',
    description: 'Duration, in seconds, of each individual flap turn.'
  },
  {
    name: 'stagger',
    type: 'number',
    default: '0.06',
    description: 'Delay, in seconds, between each tile starting its cascade.'
  },
  {
    name: 'cycleDelay',
    type: 'number',
    default: '2400',
    description: 'Hold time, in milliseconds, before cycling to the next phrase.'
  },
  {
    name: 'charset',
    type: '"alpha" | "alphanumeric" | "numeric" | string',
    default: '"alphanumeric"',
    description: 'Characters used for the intermediate flip glyphs.'
  },
  {
    name: 'flipsPerChar',
    type: 'number',
    default: '8',
    description: 'Number of intermediate glyphs each changed tile flips through.'
  },
  {
    name: 'align',
    type: '"left" | "center" | "right"',
    default: '"left"',
    description: 'Where phrases shorter than the board sit on it.'
  },
  {
    name: 'tileColor',
    type: 'string',
    default: '"#111827"',
    description: 'Base color of each mechanical tile.'
  },
  {
    name: 'textColor',
    type: 'string',
    default: '"#f8fafc"',
    description:
      'Color of the glyphs on every flap. "currentColor" follows the surrounding text, handy for the minimal style.'
  },
  {
    name: 'tileRadius',
    type: 'number | string',
    default: '8',
    description: 'Corner radius for each tile.'
  },
  {
    name: 'gap',
    type: 'number | string',
    default: '6',
    description: 'Space between adjacent flap tiles.'
  },
  {
    name: 'fontSize',
    type: 'number | string',
    default: '52',
    description: 'Tile type size. Numeric values are treated as pixels.'
  },
  {
    name: 'loop',
    type: 'boolean',
    default: 'true',
    description: 'Whether the phrase array repeats after the final phrase.'
  },
  {
    name: 'padTo',
    type: 'number',
    default: '12',
    description: 'Fixed tile count used to keep the board width stable.'
  },
  {
    name: 'intro',
    type: 'boolean',
    default: 'true',
    description: 'Starts the board blank and flips it to the first phrase on mount.'
  },
  {
    name: 'order',
    type: '"left" | "right" | "center" | "random"',
    default: '"left"',
    description: 'Where the cascade starts: from the left, from the right, out from the middle, or in a random order.'
  },
  {
    name: 'tileStyle',
    type: '"board" | "minimal"',
    default: '"board"',
    description: 'Mechanical tiles, or bare characters that flip on their own, split by a hinge line.'
  },
  {
    name: 'glare',
    type: 'number',
    default: '0',
    description: 'Strength, from 0 to 1, of the soft light sheen that sweeps down each tile as its flap falls.'
  },
  {
    name: 'depth',
    type: 'number',
    default: '0.5',
    description:
      'How physical the board feels, from 0 (flat) to 1: hinge shadow, flap shading as it turns, the shadow a falling flap casts and the thickness of its edge.'
  },
  {
    name: 'className',
    type: 'string',
    default: '""',
    description: 'Optional class name for custom styling.'
  },
  {
    name: 'style',
    type: 'CSSProperties',
    default: '{}',
    description: 'Optional inline styles for the root element.'
  }
];

const { rerenderKey, forceRerender } = useForceRerender();
const { props, defaultProps, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);
const settings = computed(() => {
  const { preset: _preset, ...rest } = props.value;
  return rest;
});
const ink = useColorModeValue('#161816', '#ffffff');
const minimal = computed(() => settings.value.tileStyle === 'minimal');
const inkText = computed(() => minimal.value && settings.value.textColor === DEFAULT_PROPS.textColor);
const textColor = computed(() => (inkText.value ? ink.value : settings.value.textColor));
const computedProps = computed(() => (inkText.value ? { textColor: 'currentColor' } : {}));

const applyPreset = (value: string) => {
  const defaults = defaultProps.value as Record<string, unknown>;
  const base = Object.fromEntries(Object.keys(LOOK).map(name => [name, defaults[name]]));
  updateProps({ ...base, ...PRESETS[value], preset: value });
  forceRerender();
};

const setIntro = (checked: boolean) => {
  updateProp('intro', checked);
  forceRerender();
};

const phraseSet = computed(
  () =>
    (Object.entries(PHRASE_SETS) as [PhraseSet, string[]][]).find(
      ([, phrases]) => phrases.join('\u001f') === settings.value.words.join('\u001f')
    )?.[0] || 'launch'
);

const fittedFontSize = computed(() => {
  const { words, padTo, gap, fontSize } = settings.value;
  const boardWidth = Math.max(Math.ceil(padTo), ...words.map(word => String(word).length), 1);
  return `min(${fontSize}px, calc((100cqi - ${(boardWidth - 1) * gap}px) / ${(boardWidth * 0.78).toFixed(2)}))`;
});
</script>
