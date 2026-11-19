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
          <DotGrid :key="rerenderKey" v-bind="settings" />
          <BackgroundContent pill-text="New Background" headline="Flick the dots and watch them wobble home" />
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
            title="Base Color"
            :color="settings.baseColor"
            @change="(value: string) => updateProp('baseColor', value)"
          />
          <PreviewColorPickerCustom
            title="Active Color"
            :color="settings.activeColor"
            @change="(value: string) => updateProp('activeColor', value)"
          />
          <PreviewSelect
            title="Shape"
            :options="SHAPE_OPTIONS"
            :model-value="settings.shape"
            @update:model-value="value => updateProp('shape', String(value))"
          />
          <PreviewSlider
            title="Dot Size"
            :min="2"
            :max="16"
            :step="1"
            value-unit="px"
            :model-value="settings.dotSize"
            @update:model-value="value => updateProp('dotSize', value)"
          />
          <PreviewSlider
            title="Gap"
            :min="4"
            :max="48"
            :step="1"
            value-unit="px"
            :model-value="settings.gap"
            @update:model-value="value => updateProp('gap', value)"
          />
          <PreviewSlider
            title="Proximity"
            :min="40"
            :max="320"
            :step="5"
            value-unit="px"
            :model-value="settings.proximity"
            @update:model-value="value => updateProp('proximity', value)"
          />
          <PreviewSlider
            title="Strength"
            :min="0"
            :max="2.5"
            :step="0.05"
            :model-value="settings.strength"
            @update:model-value="value => updateProp('strength', value)"
          />
          <PreviewSlider
            title="Bounce"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.bounce"
            @update:model-value="value => updateProp('bounce', value)"
          />
          <PreviewSlider
            title="Tension"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.tension"
            @update:model-value="value => updateProp('tension', value)"
          />
          <PreviewSlider
            title="Return Duration"
            :min="0.2"
            :max="3"
            :step="0.05"
            value-unit="s"
            :model-value="settings.returnDuration"
            @update:model-value="value => updateProp('returnDuration', value)"
          />
          <PreviewSlider
            title="Shock Radius"
            :min="80"
            :max="800"
            :step="10"
            value-unit="px"
            :model-value="settings.shockRadius"
            @update:model-value="value => updateProp('shockRadius', value)"
          />
          <PreviewSlider
            title="Shock Strength"
            :min="0"
            :max="12"
            :step="0.5"
            :model-value="settings.shockStrength"
            @update:model-value="value => updateProp('shockStrength', value)"
          />
          <PreviewSlider
            title="Swell"
            :min="0"
            :max="2"
            :step="0.05"
            :model-value="settings.swell"
            @update:model-value="value => updateProp('swell', value)"
          />
          <PreviewSlider
            title="Stretch"
            :min="0"
            :max="2"
            :step="0.05"
            :model-value="settings.stretch"
            @update:model-value="value => updateProp('stretch', value)"
          />
          <PreviewSlider
            title="Glow"
            :min="0"
            :max="1.5"
            :step="0.05"
            :model-value="settings.glow"
            @update:model-value="value => updateProp('glow', value)"
          />
          <PreviewSlider
            title="Fade"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.fade"
            @update:model-value="value => updateProp('fade', value)"
          />
          <PreviewSwitch
            title="Mouse Interaction"
            :model-value="settings.mouseInteraction"
            @update:model-value="value => updateProp('mouseInteraction', value)"
          />
          <PreviewSwitch
            title="Click Shock"
            :model-value="settings.clickShock"
            @update:model-value="value => updateProp('clickShock', value)"
          />
          <PreviewSwitch title="Intro" :model-value="settings.intro" @update:model-value="setIntro" />
        </Customize>

        <PropTable :data="propData" />
      </template>

      <template #code>
        <CodeExample :code-object="dotGrid" component-name="DotGrid" />
      </template>
    </TabsLayout>
  </ComponentPropsProvider>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import BackgroundContent from '@/components/common/BackgroundContent.vue';
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
import { dotGrid } from '@/constants/code/Backgrounds/dotGridCode';
import DotGrid from '@/content/Backgrounds/DotGrid/DotGrid.vue';
import { DEFAULT_PROPS, PRESET_OPTIONS, presetProps } from './presets/DotGrid';

type Shape = 'circle' | 'square';

const SHAPE_OPTIONS = [
  { value: 'circle', label: 'Circle' },
  { value: 'square', label: 'Square' }
];

const propData: PropRow[] = [
  { name: 'baseColor', type: 'string', default: "'#343b36'", description: 'Color of the dots at rest.' },
  {
    name: 'activeColor',
    type: 'string',
    default: "'#ffffff'",
    description: 'Color the dots light up to while they move or sit near the cursor.'
  },
  { name: 'shape', type: "'circle' | 'square'", default: "'circle'", description: 'Shape of each dot.' },
  { name: 'dotSize', type: 'number', default: '5', description: 'Size of each dot, in px.' },
  { name: 'gap', type: 'number', default: '18', description: 'Space between dots, in px.' },
  {
    name: 'proximity',
    type: 'number',
    default: '140',
    description: 'Radius around the cursor that pushes the dots and lights them up, in px.'
  },
  { name: 'strength', type: 'number', default: '1', description: 'How hard a moving cursor pushes the dots.' },
  {
    name: 'bounce',
    type: 'number',
    default: '0.6',
    description: 'How much the dots overshoot and wobble as they settle, from 0 to 1.'
  },
  {
    name: 'tension',
    type: 'number',
    default: '0.4',
    description:
      'How strongly each dot pulls on its neighbours, so a push travels through the grid like jelly. 0 keeps every dot independent.'
  },
  {
    name: 'returnDuration',
    type: 'number',
    default: '0.8',
    description: 'Roughly how long the dots take to settle back into place, in seconds.'
  },
  { name: 'shockRadius', type: 'number', default: '320', description: 'How far a click shockwave travels, in px.' },
  { name: 'shockStrength', type: 'number', default: '5', description: 'How hard a click shockwave pushes the dots.' },
  { name: 'swell', type: 'number', default: '0.8', description: 'How much the dots grow while they are lit.' },
  {
    name: 'stretch',
    type: 'number',
    default: '0.5',
    description: 'How much moving dots stretch into short streaks along their motion.'
  },
  { name: 'glow', type: 'number', default: '0.5', description: 'Soft halo around lit dots.' },
  {
    name: 'fade',
    type: 'number',
    default: '0',
    description: 'Fades the grid out toward the edges, from 0 to 1.'
  },
  { name: 'opacity', type: 'number', default: '1', description: 'Overall opacity of the grid.' },
  {
    name: 'intro',
    type: 'boolean',
    default: 'true',
    description: 'Pops the dots in from the center when the grid first appears.'
  },
  {
    name: 'mouseInteraction',
    type: 'boolean',
    default: 'true',
    description: 'Lets the cursor push the dots and light them up.'
  },
  { name: 'clickShock', type: 'boolean', default: 'true', description: 'Sends a shockwave out from each click.' },
  { name: 'paused', type: 'boolean', default: 'false', description: 'Freezes the animation.' },
  { name: 'dpr', type: 'number', default: 'auto', description: 'Maximum device pixel ratio, capped at 2.' },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the container.' },
  { name: 'style', type: 'CSSProperties', default: '-', description: 'Inline styles for the container.' }
];

const { rerenderKey, forceRerender } = useForceRerender();
const { props, defaultProps, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);

const settings = computed(() => {
  const { preset: _preset, ...rest } = props.value;
  void _preset;
  return { ...rest, shape: rest.shape as Shape };
});

const applyPreset = (value: string) => {
  updateProps({ ...presetProps(value, { defaults: defaultProps.value }), preset: value });
};

const setIntro = (value: boolean) => {
  updateProp('intro', value);
  forceRerender();
};
</script>
