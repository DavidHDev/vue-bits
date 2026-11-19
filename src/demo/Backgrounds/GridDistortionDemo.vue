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
        <div class="demo-container relative overflow-hidden" style="height: 500px; padding: 0">
          <GridDistortion v-bind="settings" />
          <BackgroundContent pill-text="New Background" headline="Don't just sit there, move your cursor!" />
        </div>

        <Customize>
          <PreviewSelect
            title="Preset"
            :options="PRESET_OPTIONS"
            :model-value="props.preset"
            @update:model-value="value => applyPreset(String(value))"
          />
          <PreviewSlider
            title="Grid"
            :min="4"
            :max="60"
            :step="1"
            :model-value="props.grid"
            @update:model-value="value => updateProp('grid', value)"
          />
          <PreviewSlider
            title="Radius"
            :min="0.05"
            :max="0.5"
            :step="0.01"
            :model-value="props.radius"
            @update:model-value="value => updateProp('radius', value)"
          />
          <PreviewSlider
            title="Strength"
            :min="0"
            :max="0.6"
            :step="0.01"
            :model-value="props.strength"
            @update:model-value="value => updateProp('strength', value)"
          />
          <PreviewSlider
            title="Relaxation"
            :min="0.8"
            :max="0.99"
            :step="0.01"
            :model-value="props.relaxation"
            @update:model-value="value => updateProp('relaxation', value)"
          />
          <PreviewSelect
            title="Mode"
            :options="MODE_OPTIONS"
            :model-value="props.mode"
            @update:model-value="value => updateProp('mode', value as 'drag' | 'push' | 'swirl')"
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
            title="Chroma"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.chroma"
            @update:model-value="value => updateProp('chroma', value)"
          />
          <PreviewSlider
            title="Idle"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.idle"
            @update:model-value="value => updateProp('idle', value)"
          />
          <PreviewSwitch
            title="Click Ripple"
            :model-value="props.clickRipple"
            @update:model-value="value => updateProp('clickRipple', value)"
          />
          <PreviewSwitch
            title="Intro"
            :model-value="props.intro"
            @update:model-value="value => updateProp('intro', value)"
          />
        </Customize>

        <PropTable :data="propData" />
      </template>

      <template #code>
        <CodeExample :code-object="gridDistortion" component-name="GridDistortion" />
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
import { gridDistortion } from '@/constants/code/Backgrounds/gridDistortionCode';
import GridDistortion from '@/content/Backgrounds/GridDistortion/GridDistortion.vue';
import { DEFAULT_PROPS, PRESET_OPTIONS, presetProps } from './presets/GridDistortion';

const MODE_OPTIONS = [
  { value: 'drag', label: 'Drag' },
  { value: 'push', label: 'Push' },
  { value: 'swirl', label: 'Swirl' }
];

const propData: PropRow[] = [
  { name: 'imageSrc', type: 'string', default: '-', description: 'Image to distort. It covers the container.' },
  {
    name: 'grid',
    type: 'number',
    default: '15',
    description: 'Number of cells across. Rows follow the container so cells stay square.'
  },
  {
    name: 'radius',
    type: 'number',
    default: '0.18',
    description: 'Reach of the pointer as a fraction of the container width.'
  },
  {
    name: 'strength',
    type: 'number',
    default: '0.15',
    description: 'How far the pointer throws the cells. 0 turns the pointer off.'
  },
  {
    name: 'relaxation',
    type: 'number',
    default: '0.96',
    description: 'How much displacement each cell keeps per frame. Higher values settle more slowly.'
  },
  {
    name: 'mode',
    type: "'drag' | 'push' | 'swirl'",
    default: "'drag'",
    description: 'Drag pulls cells along with the pointer, push throws them outward and swirl spins them around it.'
  },
  {
    name: 'softness',
    type: 'number',
    default: '0',
    description: 'Blends the crisp blocks into a smooth liquid warp, from 0 to 1.'
  },
  {
    name: 'chroma',
    type: 'number',
    default: '0',
    description: 'Splits the color channels on displaced cells, from 0 to 1.'
  },
  {
    name: 'idle',
    type: 'number',
    default: '0.3',
    description: 'A slow wandering distortion that keeps the image alive while the pointer rests. 0 turns it off.'
  },
  {
    name: 'clickRipple',
    type: 'boolean',
    default: 'true',
    description: 'Sends a ring of displaced cells out from every click.'
  },
  {
    name: 'intro',
    type: 'boolean',
    default: 'true',
    description: 'Scrambles the cells when the image loads and lets them settle into place.'
  },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the container.' },
  { name: 'style', type: 'CSSProperties', default: '-', description: 'Inline styles for the container.' }
];

const { props, defaultProps, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);

const settings = computed(() => {
  const { preset: _preset, ...rest } = props.value;
  return rest;
});

const applyPreset = (value: string) => {
  updateProps({ ...presetProps(value, { defaults: defaultProps.value, props: props.value }), preset: value });
};
</script>
