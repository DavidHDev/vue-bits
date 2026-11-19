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
        <div class="demo-container relative h-[380px] overflow-hidden md:h-[500px]" style="padding: 0">
          <p class="demo-instruction ribbons-demo-instruction">Hover Me.</p>
          <Ribbons v-bind="settings" />
        </div>

        <Customize>
          <PreviewColorList
            title="Colors"
            :min="1"
            :max="8"
            :model-value="settings.colors"
            @update:model-value="(value: string[]) => updateProp('colors', value)"
          />
          <PreviewSelect
            title="Preset"
            :options="PRESET_OPTIONS"
            :model-value="props.preset"
            @update:model-value="value => applyPreset(String(value))"
          />
          <PreviewSelect
            title="Shape"
            :options="SHAPE_OPTIONS"
            :model-value="settings.shape"
            @update:model-value="value => updateProp('shape', value as RibbonsLook['shape'])"
          />
          <PreviewSlider
            title="Thickness"
            :min="4"
            :max="80"
            :step="1"
            value-unit="px"
            :model-value="settings.thickness"
            @update:model-value="value => updateProp('thickness', value)"
          />
          <PreviewSlider
            title="Length"
            :min="0.3"
            :max="3"
            :step="0.05"
            :model-value="settings.length"
            @update:model-value="value => updateProp('length', value)"
          />
          <PreviewSlider
            title="Spread"
            :min="0"
            :max="60"
            :step="1"
            value-unit="px"
            :is-disabled="settings.colors.length < 2"
            :model-value="settings.spread"
            @update:model-value="value => updateProp('spread', value)"
          />
          <PreviewSlider
            title="Stiffness"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.stiffness"
            @update:model-value="value => updateProp('stiffness', value)"
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
            title="Wave"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.wave"
            @update:model-value="value => updateProp('wave', value)"
          />
          <PreviewSlider
            title="Softness"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.softness"
            @update:model-value="value => updateProp('softness', value)"
          />
          <PreviewSlider
            title="Opacity"
            :min="0.1"
            :max="1"
            :step="0.05"
            :model-value="settings.opacity"
            @update:model-value="value => updateProp('opacity', value)"
          />
          <PreviewSwitch
            title="Fade"
            :model-value="settings.fade"
            @update:model-value="value => updateProp('fade', value)"
          />
        </Customize>

        <PropTable :data="propData" />
      </template>

      <template #code>
        <CodeExample :code-object="ribbons" component-name="Ribbons" />
      </template>
    </TabsLayout>
  </ComponentPropsProvider>
</template>

<script setup lang="ts">
import { computed } from 'vue';
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
import { ribbons } from '@/constants/code/Animations/ribbonsCode';
import Ribbons from '@/content/Animations/Ribbons/Ribbons.vue';
import { LOOK, PRESET_OPTIONS, presetProps, type RibbonsLook } from './presets/Ribbons';

const DEFAULT_PROPS = { preset: 'layers', ...LOOK };

const SHAPE_OPTIONS = [
  { value: 'lens', label: 'Lens' },
  { value: 'comet', label: 'Comet' },
  { value: 'even', label: 'Even' }
];

const propData: PropRow[] = [
  {
    name: 'colors',
    type: 'string[]',
    default: "['#42b883', '#7cff67', '#a0ffbc']",
    description: 'One ribbon is drawn for each color, in order from back to front.'
  },
  {
    name: 'shape',
    type: "'lens' | 'comet' | 'even'",
    default: "'lens'",
    description: 'Width along each ribbon. Lens swells in the middle, comet is widest at the cursor, even stays level.'
  },
  { name: 'thickness', type: 'number', default: '30', description: 'Width of each ribbon at its widest, in pixels.' },
  {
    name: 'length',
    type: 'number',
    default: '1.4',
    description: 'How far the ribbons trail behind the cursor. Higher values leave longer, lazier trails.'
  },
  { name: 'spread', type: 'number', default: '18', description: 'Space between the ribbons, in pixels.' },
  {
    name: 'stiffness',
    type: 'number',
    default: '0.5',
    description: 'How tightly the ribbons chase the cursor, from 0 to 1.'
  },
  {
    name: 'bounce',
    type: 'number',
    default: '0.5',
    description: 'How far the ribbons overshoot and swing back when the cursor stops or turns, from 0 to 1.'
  },
  { name: 'wave', type: 'number', default: '0', description: 'A wave that rolls along each ribbon, from 0 to 1.' },
  {
    name: 'softness',
    type: 'number',
    default: '0',
    description: 'Blurs the ribbon edges into soft light trails, from 0 to 1.'
  },
  { name: 'opacity', type: 'number', default: '1', description: 'Opacity of the ribbons.' },
  { name: 'fade', type: 'boolean', default: 'false', description: 'Fades each ribbon out toward its tail.' },
  {
    name: 'backgroundColor',
    type: 'string',
    default: "'transparent'",
    description: 'Color behind the ribbons. By default the canvas is transparent.'
  },
  { name: 'dpr', type: 'number', default: 'auto', description: 'Maximum device pixel ratio, capped at 2.' },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the container.' },
  { name: 'style', type: 'CSSProperties', default: '-', description: 'Inline styles for the container.' }
];

const { props, defaultProps, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);

const settings = computed(() => {
  const { preset: _preset, ...rest } = props.value;
  return rest;
});

const applyPreset = (value: string) => {
  updateProps({ ...presetProps(value, { defaults: defaultProps.value }), preset: value });
};
</script>

<style scoped>
.ribbons-demo-instruction {
  position: absolute;
  margin: 0;
  font-size: clamp(2rem, 6vw, 6rem);
  font-weight: 600;
}
</style>
