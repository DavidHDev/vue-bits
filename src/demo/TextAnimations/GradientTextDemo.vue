<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
  >
    <TabsLayout>
      <template #preview>
        <div class="demo-container relative" style="min-height: 400px">
          <div style="font-size: 3rem; font-weight: 600; text-align: center; padding: 0 1rem">
            <GradientText v-bind="props">Gradient Magic</GradientText>
          </div>
        </div>

        <Customize>
          <PreviewColorList
            title="Colors"
            :model-value="props.colors"
            @update:model-value="value => updateProp('colors', value)"
          />

          <PreviewSelect
            title="Variant"
            :options="VARIANT_OPTIONS"
            :model-value="props.variant"
            @update:model-value="value => updateProp('variant', value as Variant)"
          />

          <PreviewSlider
            title="Animation Speed"
            :min="1"
            :max="20"
            :step="0.5"
            value-unit="s"
            :model-value="props.animationSpeed"
            @update:model-value="value => updateProp('animationSpeed', value)"
          />

          <PreviewSlider
            title="Angle"
            :min="0"
            :max="360"
            :step="5"
            value-unit="°"
            :model-value="props.angle"
            @update:model-value="value => updateProp('angle', value)"
          />

          <PreviewSlider
            title="Scale"
            :min="1"
            :max="6"
            :step="0.25"
            :model-value="props.scale"
            @update:model-value="value => updateProp('scale', value)"
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
            title="Border Width"
            :min="0.5"
            :max="4"
            :step="0.5"
            value-unit="px"
            :model-value="props.borderWidth"
            @update:model-value="value => updateProp('borderWidth', value)"
          />

          <PreviewSwitch
            title="Yoyo"
            :model-value="props.yoyo"
            @update:model-value="value => updateProp('yoyo', value)"
          />

          <PreviewSwitch
            title="Show Border"
            :model-value="props.showBorder"
            @update:model-value="value => updateProp('showBorder', value)"
          />

          <PreviewSwitch
            title="Pause on Hover"
            :model-value="props.pauseOnHover"
            @update:model-value="value => updateProp('pauseOnHover', value)"
          />

          <PreviewSwitch
            title="Follow Pointer"
            :model-value="props.followPointer"
            @update:model-value="value => updateProp('followPointer', value)"
          />
        </Customize>

        <PropTable :data="propData" />
      </template>

      <template #code>
        <CodeExample :code-object="gradientText" component-name="GradientText" />
      </template>
    </TabsLayout>
  </ComponentPropsProvider>
</template>

<script setup lang="ts">
import CodeExample from '@/components/common/CodeExample.vue';
import Customize from '@/components/common/Customize.vue';
import PreviewColorList from '@/components/common/PreviewColorList.vue';
import PreviewSelect from '@/components/common/PreviewSelect.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import ComponentPropsProvider from '@/components/context/ComponentPropsProvider.vue';
import { useComponentProps } from '@/composables/useComponentProps';
import { gradientText } from '@/constants/code/TextAnimations/gradientTextCode';
import GradientText from '@/content/TextAnimations/GradientText/GradientText.vue';

type Variant = 'linear' | 'flow' | 'conic';

const DEFAULT_PROPS = {
  colors: ['#42b883', '#7cff67', '#a0ffbc'],
  animationSpeed: 8,
  variant: 'linear' as Variant,
  angle: 90,
  scale: 3,
  yoyo: true,
  glow: 0,
  showBorder: false,
  borderWidth: 1.5,
  pauseOnHover: false,
  followPointer: false
};

const VARIANT_OPTIONS = [
  { value: 'linear', label: 'Linear' },
  { value: 'flow', label: 'Flow' },
  { value: 'conic', label: 'Conic' }
];

const { props, updateProp, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);

const propData: PropRow[] = [
  { name: 'slot', type: 'string', default: '-', description: 'The text to fill with the gradient.' },
  {
    name: 'colors',
    type: 'string[]',
    default: `["#42b883", "#7cff67", "#a0ffbc"]`,
    description: 'Colors of the gradient, in order. The first color is repeated at the end so loops stay seamless.'
  },
  {
    name: 'animationSpeed',
    type: 'number',
    default: '8',
    description: 'Seconds for one full cycle of the animation.'
  },
  {
    name: 'variant',
    type: "'linear' | 'flow' | 'conic'",
    default: "'linear'",
    description:
      'How the colors move. Linear slides a gradient through the text, flow drifts soft blobs of color around like a living mesh gradient and conic swings colors around the center.'
  },
  {
    name: 'angle',
    type: 'number',
    default: '90',
    description: 'Direction of the gradient in degrees. 90 runs left to right, 180 top to bottom.'
  },
  {
    name: 'scale',
    type: 'number',
    default: '3',
    description: 'How broad the colors are. Higher values show fewer colors at once in longer, calmer bands.'
  },
  {
    name: 'yoyo',
    type: 'boolean',
    default: 'true',
    description: 'Eases back and forth instead of scrolling the gradient in one direction forever.'
  },
  {
    name: 'glow',
    type: 'number',
    default: '0',
    description: 'A soft bloom of the gradient colors around the letters, from 0 to 1.'
  },
  {
    name: 'showBorder',
    type: 'boolean',
    default: 'false',
    description: 'Wraps the text in a pill with an animated gradient outline that works on any background.'
  },
  { name: 'borderWidth', type: 'number', default: '1.5', description: 'Thickness of the outline in px.' },
  {
    name: 'pauseOnHover',
    type: 'boolean',
    default: 'false',
    description: 'Holds the colors still while the pointer is over the text.'
  },
  {
    name: 'followPointer',
    type: 'boolean',
    default: 'false',
    description: 'While hovered, the colors are drawn toward the pointer.'
  },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the root element.' },
  { name: 'style', type: 'CSSProperties', default: '-', description: 'Inline styles for the root element.' }
];
</script>
