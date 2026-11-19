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
          <LiquidEther :key="rerenderKey" v-bind="settings" />
          <BackgroundContent headline="The web, made fluid at your fingertips." />
          <RefreshButton @click="forceRerender" />
        </div>

        <Customize>
          <PreviewColorList
            title="Colors"
            :min="1"
            :max="6"
            :model-value="settings.colors"
            @update:model-value="value => updateProp('colors', value)"
          />
          <PreviewSelect
            title="Preset"
            :options="PRESET_OPTIONS"
            :model-value="props.preset"
            @update:model-value="value => applyPreset(String(value))"
          />
          <PreviewSlider
            title="Intensity"
            :min="0.3"
            :max="2"
            :step="0.05"
            :model-value="settings.intensity"
            @update:model-value="value => updateProp('intensity', value)"
          />
          <PreviewSlider
            title="Mouse Force"
            :min="0"
            :max="60"
            :step="1"
            :model-value="settings.mouseForce"
            @update:model-value="value => updateProp('mouseForce', value)"
          />
          <PreviewSlider
            title="Cursor Size"
            :min="20"
            :max="300"
            :step="5"
            value-unit="px"
            :model-value="settings.cursorSize"
            @update:model-value="value => updateProp('cursorSize', value)"
          />
          <PreviewSlider
            title="Persistence"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.persistence"
            @update:model-value="value => updateProp('persistence', value)"
          />
          <PreviewSlider
            title="Viscosity"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.viscosity"
            @update:model-value="value => updateProp('viscosity', value)"
          />
          <PreviewSlider
            title="Resolution"
            :min="0.1"
            :max="1"
            :step="0.05"
            :model-value="settings.resolution"
            @update:model-value="value => updateProp('resolution', value)"
          />
          <PreviewSlider
            title="Auto Speed"
            :min="0"
            :max="1.5"
            :step="0.05"
            :model-value="settings.autoSpeed"
            @update:model-value="value => updateProp('autoSpeed', value)"
          />
          <PreviewSlider
            title="Auto Intensity"
            :min="0"
            :max="4"
            :step="0.1"
            :model-value="settings.autoIntensity"
            @update:model-value="value => updateProp('autoIntensity', value)"
          />
          <PreviewSwitch
            title="Auto Demo"
            :model-value="settings.autoDemo"
            @update:model-value="value => updateProp('autoDemo', value)"
          />
          <PreviewSwitch
            title="Click Burst"
            :model-value="settings.clickBurst"
            @update:model-value="value => updateProp('clickBurst', value)"
          />
          <PreviewSwitch
            title="Bounce Edges"
            :model-value="settings.bounceEdges"
            @update:model-value="value => updateProp('bounceEdges', value)"
          />
          <PreviewSwitch title="Intro" :model-value="settings.intro" @update:model-value="setIntro" />
          <PreviewSwitch
            title="Light Mode"
            :model-value="settings.lightMode"
            @update:model-value="value => updateProp('lightMode', value)"
          />
        </Customize>

        <PropTable :data="propData" />
      </template>

      <template #code>
        <CodeExample :code-object="liquidEther" component-name="LiquidEther" />
      </template>
    </TabsLayout>
  </ComponentPropsProvider>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import BackgroundContent from '@/components/common/BackgroundContent.vue';
import CodeExample from '@/components/common/CodeExample.vue';
import Customize from '@/components/common/Customize.vue';
import PreviewColorList from '@/components/common/PreviewColorList.vue';
import PreviewSelect from '@/components/common/PreviewSelect.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import RefreshButton from '@/components/common/RefreshButton.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import ComponentPropsProvider from '@/components/context/ComponentPropsProvider.vue';
import { useComponentProps } from '@/composables/useComponentProps';
import { useForceRerender } from '@/composables/useForceRerender';
import { liquidEther } from '@/constants/code/Backgrounds/liquidEtherCode';
import LiquidEther from '@/content/Backgrounds/LiquidEther/LiquidEther.vue';
import { DEFAULT_PROPS, PRESET_OPTIONS, presetProps } from './presets/LiquidEther';

const { rerenderKey, forceRerender } = useForceRerender();
const { props, defaultProps, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);

const settings = computed(() => {
  const { preset: _preset, ...rest } = props.value;
  void _preset;
  return rest;
});

const applyPreset = (value: string) => {
  updateProps({ ...presetProps(value, { defaults: defaultProps.value }), preset: value });
};

const setIntro = (value: boolean) => {
  updateProp('intro', value);
  forceRerender();
};

const propData: PropRow[] = [
  {
    name: 'colors',
    type: 'string[]',
    default: "['#42b883', '#7cff67', '#a0ffbc']",
    description: 'Colors from slow to fast flow. Calm areas take the first color, the fastest currents the last.'
  },
  { name: 'intensity', type: 'number', default: '1', description: 'Brightness of the flow.' },
  {
    name: 'mouseForce',
    type: 'number',
    default: '20',
    description: 'How strongly the cursor pushes the liquid.'
  },
  { name: 'cursorSize', type: 'number', default: '100', description: 'Size of the area the cursor stirs, in px.' },
  {
    name: 'persistence',
    type: 'number',
    default: '0.75',
    description: 'How long the motion lingers before it settles, from 0 to 1.'
  },
  {
    name: 'viscosity',
    type: 'number',
    default: '0',
    description: 'How thick the liquid is, from 0 to 1. Thicker liquid moves in broad, slow swirls.'
  },
  {
    name: 'resolution',
    type: 'number',
    default: '0.5',
    description: 'Detail of the simulation, from 0.1 to 1. Lower values are faster and softer.'
  },
  {
    name: 'autoDemo',
    type: 'boolean',
    default: 'true',
    description: 'Stirs the liquid on its own while the cursor is away.'
  },
  { name: 'autoSpeed', type: 'number', default: '0.5', description: 'Speed of the automatic stirring.' },
  {
    name: 'autoIntensity',
    type: 'number',
    default: '2.2',
    description: 'Strength of the automatic stirring compared with the cursor.'
  },
  {
    name: 'autoResumeDelay',
    type: 'number',
    default: '1000',
    description: 'Milliseconds without input before the automatic stirring resumes.'
  },
  {
    name: 'clickBurst',
    type: 'boolean',
    default: 'true',
    description: 'Clicking shoots a puff of liquid in the direction the cursor was moving.'
  },
  {
    name: 'bounceEdges',
    type: 'boolean',
    default: 'false',
    description: 'The liquid bounces off the edges instead of flowing out of view.'
  },
  { name: 'intro', type: 'boolean', default: 'true', description: 'A swirl sweeps out from the center on mount.' },
  {
    name: 'lightMode',
    type: 'boolean',
    default: 'false',
    description: 'Renders the flow as soft ink for light backgrounds.'
  },
  {
    name: 'backgroundColor',
    type: 'string',
    default: "'transparent'",
    description: 'Solid color behind the flow. Leave transparent to show the page through.'
  },
  {
    name: 'maxDevicePixelRatio',
    type: 'number',
    default: '2',
    description: 'Highest pixel ratio the canvas renders at.'
  },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the container.' },
  { name: 'style', type: 'CSSProperties', default: '-', description: 'Inline styles for the container.' }
];
</script>
