<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
    :demo-only-props="['preset', 'color']"
    :computed-props="computedProps"
  >
    <TabsLayout>
      <template #preview>
        <div class="demo-container relative overflow-hidden" style="height: 400px">
          <div class="relative flex w-full items-center justify-center">
            <ScrollVelocity
              :texts="['Vue Bits', 'Scroll Down']"
              v-bind="settings"
              :color="props.color || undefined"
              class-name="custom-scroll-text"
            />
          </div>
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
            :color="props.color || ink"
            @change="value => updateProp('color', value)"
          />
          <PreviewSlider
            title="Velocity"
            :min="10"
            :max="500"
            :step="5"
            :model-value="settings.velocity"
            @update:model-value="value => updateProp('velocity', value)"
          />
          <PreviewSlider
            title="Skew"
            :min="0"
            :max="30"
            :step="1"
            value-unit="°"
            :model-value="settings.skewWithVelocity"
            @update:model-value="value => updateProp('skewWithVelocity', value)"
          />
          <PreviewSlider
            title="Stretch"
            :min="-0.3"
            :max="0.3"
            :step="0.02"
            :model-value="settings.scaleWithVelocity"
            @update:model-value="value => updateProp('scaleWithVelocity', value)"
          />
          <PreviewSlider
            title="Damping"
            :min="10"
            :max="100"
            :step="5"
            :model-value="settings.damping"
            @update:model-value="value => updateProp('damping', value)"
          />
          <PreviewSlider
            title="Stiffness"
            :min="100"
            :max="800"
            :step="50"
            :model-value="settings.stiffness"
            @update:model-value="value => updateProp('stiffness', value)"
          />
          <PreviewSwitch
            title="Draggable"
            :model-value="settings.draggable"
            @update:model-value="value => updateProp('draggable', value)"
          />
          <PreviewSwitch
            title="Pause On Hover"
            :model-value="settings.pauseOnHover"
            @update:model-value="value => updateProp('pauseOnHover', value)"
          />
          <PreviewSlider
            title="Font Size"
            :min="24"
            :max="160"
            :step="2"
            value-unit="px"
            :model-value="settings.fontSize"
            @update:model-value="value => updateProp('fontSize', value)"
          />
          <PreviewSelect
            title="Font Weight"
            :options="WEIGHT_OPTIONS"
            :model-value="settings.fontWeight"
            @update:model-value="value => updateProp('fontWeight', Number(value))"
          />
          <PreviewSlider
            title="Gap"
            :min="0"
            :max="120"
            :step="4"
            value-unit="px"
            :model-value="settings.gap"
            @update:model-value="value => updateProp('gap', value)"
          />
          <PreviewSlider
            title="Num Copies"
            :min="2"
            :max="12"
            :step="1"
            :model-value="settings.numCopies"
            @update:model-value="value => updateProp('numCopies', value)"
          />
          <PreviewSelect
            title="Separator"
            :options="SEPARATOR_OPTIONS"
            :model-value="settings.separator"
            @update:model-value="value => updateProp('separator', String(value))"
          />
          <PreviewSwitch
            title="Outline Alternate"
            :model-value="settings.outlineAlternate"
            @update:model-value="value => updateProp('outlineAlternate', value)"
          />
          <PreviewSwitch
            title="Fade Edges"
            :model-value="settings.fadeEdges"
            @update:model-value="value => updateProp('fadeEdges', value)"
          />
        </Customize>

        <PropTable :data="propData" />
        <Dependencies :dependency-list="['motion-v']" />
        <div style="margin-bottom: 50vh" />
      </template>

      <template #code>
        <CodeExample :code-object="scrollVelocity" component-name="ScrollVelocity" />
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
import { useColorModeValue } from '@/composables/useTheme';
import { scrollVelocity } from '@/constants/code/TextAnimations/scrollVelocityCode';
import ScrollVelocity from '@/content/TextAnimations/ScrollVelocity/ScrollVelocity.vue';

const ACCENT = '#ff5a1f';

const LOOK = {
  velocity: 100,
  numCopies: 6,
  damping: 50,
  stiffness: 400,
  separator: '',
  fadeEdges: false,
  skewWithVelocity: 0,
  scaleWithVelocity: 0,
  outlineAlternate: false,
  gap: 0,
  fontSize: 80,
  fontWeight: 700,
  color: ''
};

type Look = typeof LOOK;

const PRESETS: Record<string, Look> = {
  classic: { ...LOOK },
  skew: {
    ...LOOK,
    velocity: 70,
    skewWithVelocity: 16,
    scaleWithVelocity: 0.18,
    fontSize: 104,
    fontWeight: 900,
    fadeEdges: true
  },
  outline: {
    ...LOOK,
    velocity: 50,
    outlineAlternate: true,
    skewWithVelocity: 6,
    separator: '/',
    gap: 24,
    fontSize: 120,
    fontWeight: 800,
    fadeEdges: true
  },
  ticker: {
    ...LOOK,
    velocity: 40,
    numCopies: 12,
    damping: 90,
    stiffness: 150,
    separator: '•',
    gap: 28,
    fontSize: 44,
    fontWeight: 500,
    color: ACCENT,
    fadeEdges: true
  }
};

const PRESET_OPTIONS = [
  { value: 'classic', label: 'Classic' },
  { value: 'skew', label: 'Skew' },
  { value: 'outline', label: 'Outline' },
  { value: 'ticker', label: 'Ticker' }
];

const SEPARATOR_OPTIONS = [
  { value: '', label: 'None' },
  { value: '•', label: 'Dot' },
  { value: '/', label: 'Slash' },
  { value: '—', label: 'Dash' }
];

const WEIGHT_OPTIONS = [
  { value: 400, label: '400' },
  { value: 500, label: '500' },
  { value: 700, label: '700' },
  { value: 800, label: '800' },
  { value: 900, label: '900' }
];

const DEFAULT_PROPS = {
  preset: 'classic',
  ...LOOK,
  draggable: true,
  pauseOnHover: false
};

const propData: PropRow[] = [
  {
    name: 'scrollContainerRef',
    type: 'HTMLElement | null',
    default: 'null',
    description: 'Optional custom scroll container to track scroll position.'
  },
  {
    name: 'texts',
    type: 'string[]',
    default: '[]',
    description: 'Array of strings to display as scrolling rows.'
  },
  {
    name: 'velocity',
    type: 'number',
    default: '100',
    description: 'Base velocity for scrolling; sign is flipped for odd indexed texts.'
  },
  {
    name: 'color',
    type: 'string',
    default: 'undefined',
    description: 'Text color of the rows. Follows the surrounding text color when left out.'
  },
  {
    name: 'fontSize',
    type: 'number | string',
    default: 'undefined',
    description: 'Size of the row text. Numbers are pixels. Leave it out to use the stylesheet size.'
  },
  {
    name: 'fontWeight',
    type: 'number | string',
    default: 'undefined',
    description: 'Weight of the row text. Leave it out to use the stylesheet weight.'
  },
  {
    name: 'skewWithVelocity',
    type: 'number',
    default: '0',
    description:
      'How far the rows lean into their motion while you scroll or fling them, in degrees at full speed. Eases back to upright when they slow down.'
  },
  {
    name: 'scaleWithVelocity',
    type: 'number',
    default: '0',
    description:
      'How much the rows stretch taller at full speed, as a fraction of their height. Negative values squash them instead.'
  },
  {
    name: 'draggable',
    type: 'boolean',
    default: 'false',
    description: 'Lets you grab a row to scrub it, then throw it to glide on with inertia.'
  },
  {
    name: 'outlineAlternate',
    type: 'boolean',
    default: 'false',
    description: 'Draws every other row as outlined text.'
  },
  {
    name: 'gap',
    type: 'number',
    default: '0',
    description: 'Extra space between the repeated copies in pixels, split evenly around the separator.'
  },
  {
    name: 'className',
    type: 'string',
    default: '""',
    description: 'CSS class applied to each text copy (span).'
  },
  {
    name: 'damping',
    type: 'number',
    default: '50',
    description: 'Damping value for the spring animation.'
  },
  {
    name: 'stiffness',
    type: 'number',
    default: '400',
    description: 'Stiffness value for the spring animation.'
  },
  {
    name: 'numCopies',
    type: 'number',
    default: '6',
    description: 'Number of copies of the text rendered for a continuous scrolling effect.'
  },
  {
    name: 'separator',
    type: 'string',
    default: "''",
    description: 'Shown between the repeated copies, like a dot or a slash. Empty leaves just a space.'
  },
  {
    name: 'fadeEdges',
    type: 'boolean',
    default: 'false',
    description: 'Softly fades the rows out at the left and right edges.'
  },
  {
    name: 'pauseOnHover',
    type: 'boolean',
    default: 'false',
    description: 'Glides the rows to a stop while the pointer is over them.'
  },
  {
    name: 'velocityMapping',
    type: '{ input: number[]; output: number[] }',
    default: '{ input: [0, 1000], output: [0, 5] }',
    description: 'Mapping from scroll velocity to a movement multiplier for dynamic scrolling.'
  },
  {
    name: 'parallaxClassName',
    type: 'string',
    default: '"parallax"',
    description: 'CSS class for the parallax container.'
  },
  {
    name: 'scrollerClassName',
    type: 'string',
    default: '"scroller"',
    description: 'CSS class for the scroller container.'
  },
  {
    name: 'parallaxStyle',
    type: 'CSSProperties',
    default: 'undefined',
    description: 'Inline styles for the parallax container.'
  },
  {
    name: 'scrollerStyle',
    type: 'CSSProperties',
    default: 'undefined',
    description: 'Inline styles for the scroller container.'
  }
];

const { props, defaultProps, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);

const settings = computed(() => {
  const { preset: _preset, color: _color, ...rest } = props.value;
  return rest;
});

const ink = useColorModeValue('#161816', '#ffffff');

const applyPreset = (value: string) => {
  const base = Object.fromEntries(
    (Object.keys(LOOK) as (keyof Look)[]).map(name => [name, defaultProps.value[name]])
  ) as Partial<typeof DEFAULT_PROPS>;
  updateProps({ ...base, ...PRESETS[value], preset: value });
};

const computedProps = computed(() => (props.value.color ? { color: props.value.color } : {}));
</script>
