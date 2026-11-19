<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
  >
    <TabsLayout>
      <template #preview>
        <div class="demo-container relative overflow-hidden" style="height: 500px; padding: 0">
          <div class="relative w-full h-full">
            <RippleDistortion :key="`${rerenderKey}-${props.quality}`" v-bind="props" />
          </div>
          <RefreshButton @click="forceRerender" />
        </div>

        <Customize>
          <PreviewSlider
            title="Brush Size"
            :min="40"
            :max="260"
            :step="5"
            value-unit="px"
            :model-value="props.brushSize"
            @update:model-value="v => updateProp('brushSize', v)"
          />
          <PreviewSlider
            title="Strength"
            :min="0.01"
            :max="0.3"
            :step="0.005"
            :model-value="props.strength"
            @update:model-value="v => updateProp('strength', v)"
          />
          <PreviewSlider
            title="Swirl"
            :min="0"
            :max="3"
            :step="0.05"
            :model-value="props.swirl"
            @update:model-value="v => updateProp('swirl', v)"
          />
          <PreviewSlider
            title="Rings"
            :min="0"
            :max="5"
            :step="0.25"
            :model-value="props.rings"
            @update:model-value="v => updateProp('rings', v)"
          />
          <PreviewSlider
            title="Spread"
            :min="1"
            :max="10"
            :step="0.25"
            :model-value="props.spread"
            @update:model-value="v => updateProp('spread', v)"
          />
          <PreviewSlider
            title="Fade"
            :min="0.5"
            :max="5"
            :step="0.1"
            value-unit="s"
            :model-value="props.fade"
            @update:model-value="v => updateProp('fade', v)"
          />
          <PreviewSlider
            title="Spacing"
            :min="1"
            :max="40"
            :step="1"
            value-unit="px"
            :model-value="props.spacing"
            @update:model-value="v => updateProp('spacing', v)"
          />
          <PreviewSlider
            title="Click Strength"
            :min="1"
            :max="4"
            :step="0.1"
            :model-value="props.clickStrength"
            @update:model-value="v => updateProp('clickStrength', v)"
          />

          <PreviewSlider
            title="Dispersion"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.dispersion"
            @update:model-value="v => updateProp('dispersion', v)"
          />
          <PreviewSlider
            title="Glint"
            :min="0"
            :max="1.5"
            :step="0.05"
            :model-value="props.glint"
            @update:model-value="v => updateProp('glint', v)"
          />
          <PreviewSlider
            title="Tint Amount"
            :min="0"
            :max="0.6"
            :step="0.02"
            :model-value="props.tintAmount"
            @update:model-value="v => updateProp('tintAmount', v)"
          />
          <PreviewColorPickerCustom
            title="Tint"
            :color="props.tint"
            @change="(value: string) => updateProp('tint', value)"
          />
          <PreviewColorPickerCustom
            title="Highlight"
            :color="props.highlightColor"
            @change="(value: string) => updateProp('highlightColor', value)"
          />

          <PreviewSelect
            title="Trigger"
            :options="triggerOptions"
            :width="110"
            :model-value="props.trigger"
            @update:model-value="v => updateProp('trigger', v as RippleTrigger)"
          />
          <PreviewSelect
            title="Quality"
            :options="qualityOptions"
            :width="110"
            :model-value="props.quality"
            @update:model-value="v => updateProp('quality', v as RippleQuality)"
          />
          <PreviewSwitch
            title="Grayscale"
            :model-value="props.grayscale"
            @update:model-value="v => updateProp('grayscale', v)"
          />
          <PreviewSwitch
            title="Enabled"
            :model-value="props.enabled"
            @update:model-value="v => updateProp('enabled', v)"
          />
        </Customize>

        <PropTable :data="propData" />
        <Dependencies :dependency-list="['ogl']" />
      </template>

      <template #code>
        <CodeExample :code-object="rippleDistortion" component-name="RippleDistortion" />
      </template>
    </TabsLayout>
  </ComponentPropsProvider>
</template>

<script setup lang="ts">
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
import { rippleDistortion } from '@/constants/code/Animations/rippleDistortionCode';
import RippleDistortion from '@/content/Animations/RippleDistortion/RippleDistortion.vue';

type RippleTrigger = 'hover' | 'click' | 'both';
type RippleQuality = 'low' | 'medium' | 'high';

const DEFAULT_PROPS = {
  brushSize: 150,
  strength: 0.2,
  swirl: 1,
  rings: 4,
  spread: 5,
  fade: 3,
  spacing: 15,
  dispersion: 0,
  glint: 0,
  tint: '#7cff67',
  tintAmount: 0.1,
  grayscale: true,
  highlightColor: '#ffffff',
  trigger: 'hover' as RippleTrigger,
  clickStrength: 2,
  quality: 'low' as RippleQuality,
  enabled: true
};

const { rerenderKey, forceRerender } = useForceRerender();
const { props, updateProp, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);

const triggerOptions = [
  { label: 'Hover', value: 'hover' },
  { label: 'Click', value: 'click' },
  { label: 'Both', value: 'both' }
];

const qualityOptions = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' }
];

const propData: PropRow[] = [
  {
    name: 'src',
    type: 'string',
    default: "'https://images.unsplash.com/...'",
    description: 'Image URL the ripples distort. Cover fitted to the container.'
  },
  {
    name: 'brushSize',
    type: 'number',
    default: '150',
    description: 'Diameter of each ripple the pointer lays down, in px.'
  },
  {
    name: 'strength',
    type: 'number',
    default: '0.2',
    description: 'How far the image is pushed, as a fraction of its size.'
  },
  {
    name: 'swirl',
    type: 'number',
    default: '1',
    description:
      'Full turns the push direction sweeps through as a ripple builds. 0 gives a flat push, higher folds the image into caustics.'
  },
  {
    name: 'rings',
    type: 'number',
    default: '4',
    description: 'Concentric swells inside each ripple. 0 is a single plain blob.'
  },
  {
    name: 'spread',
    type: 'number',
    default: '5',
    description: 'How many times its own size a ripple grows to before it dies.'
  },
  { name: 'fade', type: 'number', default: '3', description: 'How long a ripple survives, in seconds.' },
  {
    name: 'spacing',
    type: 'number',
    default: '15',
    description: 'Pointer travel between ripples, in px. Higher leaves a sparser trail.'
  },
  {
    name: 'dispersion',
    type: 'number',
    default: '0',
    description: 'Chromatic split between the red and blue channels as they refract.'
  },
  { name: 'glint', type: 'number', default: '0', description: 'Sheen riding the shoulders of each ripple.' },
  { name: 'tint', type: 'string', default: '#7cff67', description: 'Colour the disturbed water takes on.' },
  {
    name: 'tintAmount',
    type: 'number',
    default: '0.1',
    description: 'How strongly the tint colours the disturbed water.'
  },
  { name: 'highlightColor', type: 'string', default: '#ffffff', description: 'Colour of the sheen.' },
  {
    name: 'grayscale',
    type: 'boolean',
    default: 'true',
    description: 'Drain the colour out of the image so the folds read on tone alone.'
  },
  {
    name: 'trigger',
    type: "'hover' | 'click' | 'both'",
    default: "'hover'",
    description: 'What disturbs the surface: motion, clicks, or both.'
  },
  {
    name: 'clickStrength',
    type: 'number',
    default: '2',
    description: 'How much larger a click ripple starts than a hover one.'
  },
  {
    name: 'quality',
    type: "'low' | 'medium' | 'high'",
    default: "'low'",
    description: 'Resolution of the displacement buffer. Lower trades crispness for fill rate.'
  },
  { name: 'enabled', type: 'boolean', default: 'true', description: 'Toggle the effect on or off.' },
  { name: 'className', type: 'string', default: "''", description: 'Extra classes on the container.' }
];
</script>
