<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
    :demo-only-props="['preset', 'accentColor']"
    :computed-props="computedProps"
  >
    <TabsLayout>
      <template #preview>
        <div class="demo-container relative overflow-hidden" style="height: 500px; padding: 0">
          <Threads v-bind="threadsProps" />
          <BackgroundContent pill-text="New Background" headline="Not to be confused with the Threads app by Meta!" />
        </div>

        <Customize>
          <PreviewSelect
            title="Preset"
            :options="PRESET_OPTIONS"
            :model-value="props.preset"
            @update:model-value="(value: string | number) => applyPreset(String(value))"
          />
          <PreviewColorPickerCustom
            title="Color"
            :color="props.color"
            @change="(value: string) => updateProp('color', value)"
          />
          <PreviewColorPickerCustom
            title="Accent"
            :color="props.accentColor || props.color"
            @change="(value: string) => updateProp('accentColor', value)"
          />
          <PreviewSlider
            title="Line Count"
            :min="4"
            :max="120"
            :step="1"
            :model-value="props.lineCount"
            @update:model-value="(value: number) => updateProp('lineCount', value)"
          />
          <PreviewSlider
            title="Thickness"
            :min="0.2"
            :max="4"
            :step="0.1"
            :model-value="props.thickness"
            @update:model-value="(value: number) => updateProp('thickness', value)"
          />
          <PreviewSlider
            title="Softness"
            :min="0"
            :max="3"
            :step="0.1"
            :model-value="props.softness"
            @update:model-value="(value: number) => updateProp('softness', value)"
          />
          <PreviewSlider
            title="Amplitude"
            :min="0"
            :max="4"
            :step="0.1"
            :model-value="props.amplitude"
            @update:model-value="(value: number) => updateProp('amplitude', value)"
          />
          <PreviewSlider
            title="Distance"
            :min="0"
            :max="2"
            :step="0.05"
            :model-value="props.distance"
            @update:model-value="(value: number) => updateProp('distance', value)"
          />
          <PreviewSlider
            title="Waves"
            :min="0.2"
            :max="3"
            :step="0.05"
            :model-value="props.waves"
            @update:model-value="(value: number) => updateProp('waves', value)"
          />
          <PreviewSlider
            title="Speed"
            :min="0"
            :max="3"
            :step="0.05"
            :model-value="props.speed"
            @update:model-value="(value: number) => updateProp('speed', value)"
          />
          <PreviewSlider
            title="Split"
            :min="0"
            :max="0.6"
            :step="0.01"
            :model-value="props.split"
            @update:model-value="(value: number) => updateProp('split', value)"
          />
          <PreviewSlider
            title="Fray"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.fray"
            @update:model-value="(value: number) => updateProp('fray', value)"
          />
          <PreviewSlider
            title="Angle"
            :min="-90"
            :max="90"
            :step="1"
            value-unit="°"
            :model-value="props.angle"
            @update:model-value="(value: number) => updateProp('angle', value)"
          />
          <PreviewSlider
            title="Taper"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.taper"
            @update:model-value="(value: number) => updateProp('taper', value)"
          />
          <PreviewSlider
            title="Brightness"
            :min="0.25"
            :max="2"
            :step="0.05"
            :model-value="props.brightness"
            @update:model-value="(value: number) => updateProp('brightness', value)"
          />
          <PreviewSlider
            title="Parting"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.parting"
            @update:model-value="(value: number) => updateProp('parting', value)"
          />
          <PreviewSlider
            title="Fade"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.fade"
            @update:model-value="(value: number) => updateProp('fade', value)"
          />
          <PreviewSlider
            title="Opacity"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.opacity"
            @update:model-value="(value: number) => updateProp('opacity', value)"
          />
          <PreviewSlider
            title="Seed"
            :min="0"
            :max="20"
            :step="1"
            :model-value="props.seed"
            @update:model-value="(value: number) => updateProp('seed', value)"
          />
          <PreviewSwitch
            title="Mouse Interaction"
            :model-value="props.enableMouseInteraction"
            @update:model-value="(value: boolean) => updateProp('enableMouseInteraction', value)"
          />
        </Customize>

        <PropTable :data="propData" />
      </template>

      <template #code>
        <CodeExample :code-object="threads" component-name="Threads" />
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
import TabsLayout from '@/components/common/TabsLayout.vue';
import ComponentPropsProvider from '@/components/context/ComponentPropsProvider.vue';
import { useComponentProps } from '@/composables/useComponentProps';
import { threads } from '@/constants/code/Backgrounds/threadsCode';
import Threads from '@/content/Backgrounds/Threads/Threads.vue';
import { DEFAULT_PROPS, PRESET_OPTIONS, presetProps } from './presets/Threads';

const propData: PropRow[] = [
  {
    name: 'color',
    type: 'string | number[]',
    default: '[1, 1, 1]',
    description: 'Color of the threads. Any CSS color, or an RGB array from 0 to 1.'
  },
  {
    name: 'accentColor',
    type: 'string | number[]',
    default: '-',
    description: 'Color the outer threads blend toward. Leave it out for a single color.'
  },
  { name: 'lineCount', type: 'number', default: '90', description: 'Number of threads.' },
  { name: 'thickness', type: 'number', default: '0.6', description: 'Width of the threads.' },
  {
    name: 'softness',
    type: 'number',
    default: '1.3',
    description: 'How much the threads soften as they separate. 0 keeps every thread crisp.'
  },
  { name: 'amplitude', type: 'number', default: '1.7', description: 'Height of the waves.' },
  {
    name: 'distance',
    type: 'number',
    default: '0.4',
    description: 'Spacing between the threads. 0 starts them all from a single line.'
  },
  { name: 'waves', type: 'number', default: '1.05', description: 'How many waves run along each thread.' },
  { name: 'speed', type: 'number', default: '0.6', description: 'Animation speed. 0 holds the threads still.' },
  {
    name: 'split',
    type: 'number',
    default: '0.04',
    description: 'Where the first thread leaves the bundle, from 0 at the start to 1 at the end.'
  },
  {
    name: 'fray',
    type: 'number',
    default: '0.5',
    description: 'How gradually the other threads peel away after the first one.'
  },
  { name: 'angle', type: 'number', default: '25', description: 'Direction of the threads in degrees.' },
  {
    name: 'taper',
    type: 'number',
    default: '0.85',
    description: 'How much the outer threads fade away, from 0 for all equally bright to 1.'
  },
  { name: 'brightness', type: 'number', default: '1.4', description: 'Brightness of the threads, from 0.25 to 2.' },
  {
    name: 'parting',
    type: 'number',
    default: '0',
    description: 'How far the threads move aside around the cursor, from 0 to 1.'
  },
  {
    name: 'enableMouseInteraction',
    type: 'boolean',
    default: 'false',
    description:
      'Lets the cursor steer the waves: moving sideways shifts them and moving up and down changes their height.'
  },
  {
    name: 'fade',
    type: 'number',
    default: '0',
    description: 'Fades the edges into the page, from 0 to 1.'
  },
  { name: 'opacity', type: 'number', default: '1', description: 'Opacity of the whole effect.' },
  { name: 'seed', type: 'number', default: '0', description: 'Changes the wave pattern.' },
  { name: 'paused', type: 'boolean', default: 'false', description: 'Freezes the animation.' },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the container.' }
];

const { props, defaultProps, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);

const accent = computed(() => props.value.accentColor || undefined);

const computedProps = computed(() => (accent.value ? { accentColor: accent.value } : {}));

const threadsProps = computed(() => {
  const { preset: _preset, accentColor: _accentColor, ...rest } = props.value;
  void _preset;
  void _accentColor;
  return accent.value ? { ...rest, accentColor: accent.value } : rest;
});

const applyPreset = (value: string) => {
  updateProps({ ...presetProps(value, { defaults: defaultProps.value }), preset: value });
};
</script>
