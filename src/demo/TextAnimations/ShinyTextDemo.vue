<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
  >
    <TabsLayout>
      <template #preview>
        <div class="demo-container relative" style="min-height: 400px; font-size: 44px; font-weight: 600">
          <ShinyText v-bind="props" text="Shiny Text Effect" :color="renderedColor" :shine-color="renderedShineColor" />
        </div>

        <Customize>
          <PreviewColorPickerCustom
            title="Text Color"
            :color="renderedColor"
            @change="value => updateProp('color', value)"
          />
          <PreviewColorPickerCustom
            title="Shine Color"
            :color="renderedShineColor"
            @change="value => updateProp('shineColor', value)"
          />
          <PreviewSlider
            title="Shine Width"
            :min="5"
            :max="100"
            :step="1"
            value-unit="%"
            :model-value="props.shineWidth"
            @update:model-value="value => updateProp('shineWidth', value)"
          />
          <PreviewSlider
            title="Softness"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.softness"
            @update:model-value="value => updateProp('softness', value)"
          />
          <PreviewSlider
            title="Angle"
            :min="60"
            :max="150"
            :step="1"
            value-unit="°"
            :model-value="props.angle"
            @update:model-value="value => updateProp('angle', value)"
          />
          <PreviewSlider
            title="Bands"
            :min="1"
            :max="3"
            :step="1"
            :model-value="props.bands"
            @update:model-value="value => updateProp('bands', value)"
          />
          <PreviewSlider
            title="Glow"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.glow"
            @update:model-value="value => updateProp('glow', value)"
          />
          <PreviewSlider
            title="Speed"
            :min="0.5"
            :max="5"
            :step="0.1"
            value-unit="s"
            :model-value="props.speed"
            @update:model-value="value => updateProp('speed', value)"
          />
          <PreviewSlider
            title="Delay"
            :min="0"
            :max="3"
            :step="0.1"
            value-unit="s"
            :model-value="props.delay"
            @update:model-value="value => updateProp('delay', value)"
          />
          <PreviewSelect
            title="Direction"
            :options="DIRECTION_OPTIONS"
            :model-value="props.direction"
            @update:model-value="value => updateProp('direction', value as Direction)"
          />
          <PreviewSelect
            title="Easing"
            :options="EASING_OPTIONS"
            :model-value="props.easing"
            @update:model-value="value => updateProp('easing', value as Easing)"
          />
          <PreviewSelect
            title="Trigger"
            :options="TRIGGER_OPTIONS"
            :model-value="props.trigger"
            @update:model-value="value => updateProp('trigger', value as Trigger)"
          />
          <PreviewSwitch
            title="Yoyo"
            :model-value="props.yoyo"
            @update:model-value="value => updateProp('yoyo', value)"
          />
          <PreviewSwitch
            title="Follow Pointer"
            :model-value="props.followPointer"
            @update:model-value="value => updateProp('followPointer', value)"
          />
          <PreviewSwitch
            title="Pause on Hover"
            :model-value="props.pauseOnHover"
            @update:model-value="value => updateProp('pauseOnHover', value)"
          />
          <PreviewSwitch
            title="Disabled"
            :model-value="props.disabled"
            @update:model-value="value => updateProp('disabled', value)"
          />
        </Customize>

        <PropTable :data="propData" />
      </template>

      <template #code>
        <CodeExample :code-object="shinyText" component-name="ShinyText" />
      </template>
    </TabsLayout>
  </ComponentPropsProvider>
</template>

<script setup lang="ts">
import CodeExample from '@/components/common/CodeExample.vue';
import Customize from '@/components/common/Customize.vue';
import PreviewColorPickerCustom from '@/components/common/PreviewColorPickerCustom.vue';
import PreviewSelect from '@/components/common/PreviewSelect.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import ComponentPropsProvider from '@/components/context/ComponentPropsProvider.vue';
import { useComponentProps } from '@/composables/useComponentProps';
import { useColorModeValue } from '@/composables/useTheme';
import { shinyText } from '@/constants/code/TextAnimations/shinyTextCode';
import ShinyText from '@/content/TextAnimations/ShinyText/ShinyText.vue';

type Direction = 'left' | 'right';
type Easing = 'smooth' | 'linear' | 'snappy';
type Trigger = 'loop' | 'hover' | 'view';

const DEFAULT_PROPS = {
  color: '#b5b5b5',
  shineColor: '#ffffff',
  speed: 2,
  delay: 0,
  angle: 120,
  shineWidth: 40,
  softness: 0.8,
  bands: 1,
  glow: 0,
  direction: 'left' as Direction,
  easing: 'smooth' as Easing,
  trigger: 'loop' as Trigger,
  yoyo: false,
  followPointer: false,
  pauseOnHover: false,
  disabled: false
};

const DIRECTION_OPTIONS = [
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' }
];

const EASING_OPTIONS = [
  { value: 'smooth', label: 'Smooth' },
  { value: 'linear', label: 'Linear' },
  { value: 'snappy', label: 'Snappy' }
];

const TRIGGER_OPTIONS = [
  { value: 'loop', label: 'Loop' },
  { value: 'hover', label: 'Hover' },
  { value: 'view', label: 'In View' }
];

const { props, updateProp, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);

const renderedColor = useColorModeValue(
  () => (props.value.color === DEFAULT_PROPS.color ? '#6c736d' : props.value.color),
  () => props.value.color
);
const renderedShineColor = useColorModeValue(
  () => (props.value.shineColor === DEFAULT_PROPS.shineColor ? '#252825' : props.value.shineColor),
  () => props.value.shineColor
);

const propData: PropRow[] = [
  { name: 'text', type: 'string', default: '-', description: 'The text to shine. Slot content works too.' },
  { name: 'color', type: 'string', default: '"#b5b5b5"', description: 'Base color of the text.' },
  { name: 'shineColor', type: 'string', default: '"#ffffff"', description: 'Color of the light passing over it.' },
  { name: 'speed', type: 'number', default: '2', description: 'Seconds for one sweep across the text.' },
  { name: 'delay', type: 'number', default: '0', description: 'Seconds of rest between sweeps.' },
  {
    name: 'angle',
    type: 'number',
    default: '120',
    description: 'Tilt of the band of light in degrees. 90 is upright, higher leans it forward.'
  },
  {
    name: 'shineWidth',
    type: 'number',
    default: '40',
    description: 'How wide the band of light is, as a percentage of the text.'
  },
  {
    name: 'softness',
    type: 'number',
    default: '0.8',
    description: 'How gently the band fades at its edges, from 0 for a crisp glint to 1 for a soft sheen.'
  },
  {
    name: 'bands',
    type: 'number',
    default: '1',
    description: 'How many bands of light follow each other, like reflections sliding across chrome.'
  },
  {
    name: 'glow',
    type: 'number',
    default: '0',
    description: 'A soft bloom of light that travels with the band, from 0 to 1.'
  },
  {
    name: 'direction',
    type: "'left' | 'right'",
    default: '"left"',
    description: 'Which way the light travels.'
  },
  {
    name: 'easing',
    type: "'smooth' | 'linear' | 'snappy'",
    default: '"smooth"',
    description:
      'Feel of each sweep. Smooth glides in and out, linear keeps an even pace and snappy flashes across with a pause between.'
  },
  {
    name: 'trigger',
    type: "'loop' | 'hover' | 'view'",
    default: '"loop"',
    description: 'When it shines: on a loop, once each time the pointer enters, or once when scrolled into view.'
  },
  {
    name: 'yoyo',
    type: 'boolean',
    default: 'false',
    description: 'Sweeps back and forth instead of always starting from the same side.'
  },
  {
    name: 'followPointer',
    type: 'boolean',
    default: 'false',
    description: 'While hovered, the light glides after the pointer, then slides off when it leaves.'
  },
  {
    name: 'pauseOnHover',
    type: 'boolean',
    default: 'false',
    description: 'Freezes the sweep while the pointer is over the text.'
  },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Shows plain text with no shine.' },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the root element.' },
  { name: 'style', type: 'CSSProperties', default: '-', description: 'Inline styles for the root element.' }
];
</script>
