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
          <RefreshButton v-if="settings.intro" @click="forceRerender" />
          <div :key="rerenderKey" class="flex flex-col items-center">
            <FuzzyText v-bind="settings" :color="textColor" :font-size="140">404</FuzzyText>
            <div style="margin: 4px 0" />
            <FuzzyText v-bind="settings" :color="textColor" :font-size="70" font-family="Gochi Hand">
              not found
            </FuzzyText>
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
            title="Color Split"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.colorSplit"
            @update:model-value="value => updateProp('colorSplit', value)"
          />
          <PreviewSelect
            title="Trigger"
            :options="TRIGGER_OPTIONS"
            :model-value="settings.trigger"
            @update:model-value="value => updateProp('trigger', value as Trigger)"
          />
          <PreviewSelect
            title="Direction"
            :options="DIRECTION_OPTIONS"
            :model-value="settings.direction"
            @update:model-value="value => updateProp('direction', value as Direction)"
          />
          <PreviewSlider
            title="Base Intensity"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.baseIntensity"
            @update:model-value="value => updateProp('baseIntensity', value)"
          />
          <PreviewSlider
            title="Hover Intensity"
            :min="0"
            :max="2"
            :step="0.01"
            :is-disabled="settings.trigger === 'hover' && !settings.enableHover"
            :model-value="settings.hoverIntensity"
            @update:model-value="value => updateProp('hoverIntensity', value)"
          />
          <PreviewSlider
            title="Fuzz Range"
            :min="5"
            :max="100"
            :step="1"
            value-unit="px"
            :model-value="settings.fuzzRange"
            @update:model-value="value => updateProp('fuzzRange', value)"
          />
          <PreviewSlider
            title="Slice Size"
            :min="1"
            :max="12"
            :step="1"
            value-unit="px"
            :model-value="settings.sliceSize"
            @update:model-value="value => updateProp('sliceSize', value)"
          />
          <PreviewSlider
            title="FPS"
            :min="10"
            :max="120"
            :step="5"
            :model-value="settings.fps"
            @update:model-value="value => updateProp('fps', value)"
          />
          <PreviewSlider
            title="Transition Duration"
            :min="0"
            :max="60"
            :step="1"
            :model-value="settings.transitionDuration"
            @update:model-value="value => updateProp('transitionDuration', value)"
          />
          <PreviewSwitch
            title="Intro"
            :model-value="settings.intro"
            @update:model-value="value => updateAndReplay('intro', value)"
          />
          <PreviewSlider
            title="Intro Duration"
            :min="400"
            :max="4000"
            :step="100"
            value-unit="ms"
            :is-disabled="!settings.intro"
            :model-value="settings.introDuration"
            @update:model-value="value => updateAndReplay('introDuration', value)"
          />
          <PreviewSwitch
            title="Enable Hover"
            :is-disabled="settings.trigger !== 'hover'"
            :model-value="settings.enableHover"
            @update:model-value="value => updateProp('enableHover', value)"
          />
          <PreviewSwitch
            title="Click Effect"
            :is-disabled="settings.trigger === 'click'"
            :model-value="settings.clickEffect"
            @update:model-value="value => updateProp('clickEffect', value)"
          />
          <PreviewSwitch
            title="Glitch Mode"
            :model-value="settings.glitchMode"
            @update:model-value="value => updateProp('glitchMode', value)"
          />
          <PreviewSlider
            title="Glitch Interval"
            :min="500"
            :max="5000"
            :step="100"
            value-unit="ms"
            :is-disabled="!settings.glitchMode"
            :model-value="settings.glitchInterval"
            @update:model-value="value => updateProp('glitchInterval', value)"
          />
          <PreviewSlider
            title="Glitch Duration"
            :min="50"
            :max="1000"
            :step="50"
            value-unit="ms"
            :is-disabled="!settings.glitchMode"
            :model-value="settings.glitchDuration"
            @update:model-value="value => updateProp('glitchDuration', value)"
          />
          <PreviewSlider
            title="Letter Spacing"
            :min="-10"
            :max="50"
            :step="1"
            value-unit="px"
            :model-value="settings.letterSpacing"
            @update:model-value="value => updateProp('letterSpacing', value)"
          />
        </Customize>

        <PropTable :data="propData" />
      </template>

      <template #code>
        <CodeExample :code-object="fuzzyText" component-name="FuzzyText" />
      </template>
    </TabsLayout>
  </ComponentPropsProvider>
</template>

<script setup lang="ts">
import { computed } from 'vue';
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
import { fuzzyText } from '@/constants/code/TextAnimations/fuzzyTextCode';
import FuzzyText from '@/content/TextAnimations/FuzzyText/FuzzyText.vue';

type Trigger = 'hover' | 'always' | 'click';
type Direction = 'horizontal' | 'vertical' | 'both';

type Look = {
  colorSplit: number;
  trigger: Trigger;
  direction: Direction;
  baseIntensity: number;
  hoverIntensity: number;
  fuzzRange: number;
  sliceSize: number;
  fps: number;
  transitionDuration: number;
  intro: boolean;
  introDuration: number;
  clickEffect: boolean;
  glitchMode: boolean;
  glitchInterval: number;
  glitchDuration: number;
  letterSpacing: number;
};

const LOOK: Look = {
  colorSplit: 0,
  trigger: 'hover',
  direction: 'horizontal',
  baseIntensity: 0.2,
  hoverIntensity: 0.5,
  fuzzRange: 30,
  sliceSize: 1,
  fps: 60,
  transitionDuration: 0,
  intro: true,
  introDuration: 1400,
  clickEffect: false,
  glitchMode: false,
  glitchInterval: 2000,
  glitchDuration: 200,
  letterSpacing: 0
};

const PRESETS: Record<string, Look> = {
  static: { ...LOOK },
  glitch: {
    ...LOOK,
    colorSplit: 0.6,
    trigger: 'click',
    baseIntensity: 0.04,
    hoverIntensity: 0.7,
    fuzzRange: 50,
    sliceSize: 5,
    transitionDuration: 4,
    introDuration: 1100,
    glitchMode: true,
    glitchInterval: 1600,
    glitchDuration: 240
  },
  shiver: {
    ...LOOK,
    trigger: 'always',
    direction: 'both',
    baseIntensity: 0.12,
    hoverIntensity: 0.4,
    fuzzRange: 14,
    sliceSize: 2,
    fps: 24,
    transitionDuration: 8,
    intro: false
  },
  melt: {
    ...LOOK,
    direction: 'vertical',
    baseIntensity: 0.25,
    hoverIntensity: 0.9,
    fuzzRange: 26,
    sliceSize: 2,
    transitionDuration: 20,
    introDuration: 2600
  }
};

const DEFAULT_PROPS = {
  preset: 'static',
  color: '',
  ...LOOK,
  enableHover: true
};

const PRESET_OPTIONS = [
  { value: 'static', label: 'Static' },
  { value: 'glitch', label: 'Glitch' },
  { value: 'shiver', label: 'Shiver' },
  { value: 'melt', label: 'Melt' }
];

const TRIGGER_OPTIONS = [
  { value: 'hover', label: 'Hover' },
  { value: 'always', label: 'Always' },
  { value: 'click', label: 'Click' }
];

const DIRECTION_OPTIONS = [
  { value: 'horizontal', label: 'Horizontal' },
  { value: 'vertical', label: 'Vertical' },
  { value: 'both', label: 'Both' }
];

const propData: PropRow[] = [
  {
    name: 'default slot',
    type: 'string',
    default: '-',
    description: 'The text to draw.'
  },
  {
    name: 'fontSize',
    type: 'number | string',
    default: "'clamp(2rem, 8vw, 8rem)'",
    description: 'Font size as any CSS size or a number in px. Responsive sizes are redrawn when the window resizes.'
  },
  {
    name: 'fontWeight',
    type: 'string | number',
    default: '900',
    description: 'Font weight of the text.'
  },
  {
    name: 'fontFamily',
    type: 'string',
    default: "'inherit'",
    description: "Font family of the text. 'inherit' uses the font of the surrounding text."
  },
  {
    name: 'color',
    type: 'string',
    default: "'currentColor'",
    description: 'Color of the text. Follows the surrounding text color by default, including theme switches.'
  },
  {
    name: 'colorSplit',
    type: 'number',
    default: '0',
    description:
      'Splits the text into offset red, green and blue copies that tear apart with the fuzz, from 0 to 1. Dark text splits into print-style cyan, magenta and yellow instead.'
  },
  {
    name: 'trigger',
    type: "'hover' | 'always' | 'click'",
    default: "'hover'",
    description:
      "What raises the fuzz. 'hover' reacts to the pointer, 'always' holds the hover intensity, 'click' fires a burst that eases back."
  },
  {
    name: 'enableHover',
    type: 'boolean',
    default: 'true',
    description: "Raises the fuzz to the hover intensity while the pointer is over the text, when trigger is 'hover'."
  },
  {
    name: 'baseIntensity',
    type: 'number',
    default: '0.18',
    description: 'How strong the fuzz is at rest.'
  },
  {
    name: 'hoverIntensity',
    type: 'number',
    default: '0.5',
    description:
      "How strong the fuzz is while hovered. With trigger 'always' it is the constant level, with 'click' it sets how hard each burst hits."
  },
  {
    name: 'fuzzRange',
    type: 'number',
    default: '30',
    description: 'Furthest the strips can shift, in px.'
  },
  {
    name: 'sliceSize',
    type: 'number',
    default: '1',
    description: 'Thickness of each shifted strip, in px. 1 gives a fine fuzz, larger values tear the text into bands.'
  },
  {
    name: 'fps',
    type: 'number',
    default: '60',
    description: 'Frame rate cap. Lower values look choppier and use less CPU.'
  },
  {
    name: 'direction',
    type: "'horizontal' | 'vertical' | 'both'",
    default: "'horizontal'",
    description: 'Which way the strips shift.'
  },
  {
    name: 'transitionDuration',
    type: 'number',
    default: '0',
    description: 'How many frames the fuzz takes to ease between intensities. 0 switches instantly.'
  },
  {
    name: 'intro',
    type: 'boolean',
    default: 'false',
    description: 'Fades the text in as heavy, coarse static that resolves into clean letters the first time it is seen.'
  },
  {
    name: 'introDuration',
    type: 'number',
    default: '1400',
    description: 'How long the intro takes to resolve, in ms.'
  },
  {
    name: 'clickEffect',
    type: 'boolean',
    default: 'false',
    description: "Gives a short burst of full intensity on click when trigger is 'hover' or 'always'."
  },
  {
    name: 'glitchMode',
    type: 'boolean',
    default: 'false',
    description: 'Adds bursts of full intensity at a regular interval.'
  },
  {
    name: 'glitchInterval',
    type: 'number',
    default: '2000',
    description: 'Time between glitch bursts, in ms.'
  },
  {
    name: 'glitchDuration',
    type: 'number',
    default: '200',
    description: 'Length of each glitch burst, in ms.'
  },
  {
    name: 'gradient',
    type: 'string[] | null',
    default: 'null',
    description: 'Two or more colors to fill the text with a left to right gradient instead of a single color.'
  },
  {
    name: 'letterSpacing',
    type: 'number',
    default: '0',
    description: 'Extra space between letters, in px.'
  },
  {
    name: 'className',
    type: 'string',
    default: "''",
    description: 'Extra class names for the canvas.'
  }
];

const { rerenderKey, forceRerender } = useForceRerender();
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
  forceRerender();
};

const updateAndReplay = <K extends keyof typeof DEFAULT_PROPS>(name: K, value: (typeof DEFAULT_PROPS)[K]) => {
  updateProp(name, value);
  forceRerender();
};

const computedProps = computed(() => (props.value.color ? { color: props.value.color } : {}));
const textColor = computed(() => props.value.color || undefined);
</script>
