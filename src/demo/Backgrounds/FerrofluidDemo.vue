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
          <Ferrofluid :key="rerenderKey" v-bind="settings" />
          <BackgroundContent headline="Bend the magnetic fluid" />
          <RefreshButton @click="forceRerender" />
        </div>

        <Customize>
          <PreviewSelect
            title="Preset"
            :options="PRESET_OPTIONS"
            :model-value="props.preset"
            @update:model-value="applyPreset"
          />
          <PreviewColorPickerCustom
            v-for="light in LIGHTS"
            :key="light.title"
            :title="light.title"
            :color="colorAt(light.index)"
            @change="(value: string) => setLight(light.index, value)"
          />
          <PreviewSlider
            title="Brightness"
            :min="0.2"
            :max="2"
            :step="0.05"
            :model-value="settings.brightness"
            @update:model-value="value => updateProp('brightness', value)"
          />
          <PreviewSlider
            title="Scale"
            :min="0.8"
            :max="3"
            :step="0.05"
            :model-value="settings.scale"
            @update:model-value="value => updateProp('scale', value)"
          />
          <PreviewSlider
            title="Spike Height"
            :min="0.2"
            :max="2"
            :step="0.05"
            :model-value="settings.spikeHeight"
            @update:model-value="value => updateProp('spikeHeight', value)"
          />
          <PreviewSlider
            title="Sharpness"
            :min="1"
            :max="5"
            :step="0.1"
            :model-value="settings.sharpness"
            @update:model-value="value => updateProp('sharpness', value)"
          />
          <PreviewSlider
            title="Tilt"
            :min="25"
            :max="65"
            :step="1"
            value-unit="°"
            :model-value="settings.tilt"
            @update:model-value="value => updateProp('tilt', value)"
          />
          <PreviewSlider
            title="Turbulence"
            :min="0"
            :max="3"
            :step="0.05"
            :model-value="settings.turbulence"
            @update:model-value="value => updateProp('turbulence', value)"
          />
          <PreviewSlider
            title="Fluidity"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.fluidity"
            @update:model-value="value => updateProp('fluidity', value)"
          />
          <PreviewSlider
            title="Speed"
            :min="0"
            :max="2"
            :step="0.05"
            :model-value="settings.speed"
            @update:model-value="value => updateProp('speed', value)"
          />
          <PreviewSlider
            title="Magnetism"
            :min="0"
            :max="2"
            :step="0.05"
            :model-value="settings.magnetism"
            @update:model-value="value => updateProp('magnetism', value)"
          />
          <PreviewSlider
            title="Variation"
            :min="0"
            :max="10"
            :step="1"
            :model-value="settings.variation"
            @update:model-value="value => updateProp('variation', value)"
          />
          <PreviewSelect
            title="Flow Direction"
            :options="FLOW_OPTIONS"
            :model-value="settings.flowDirection"
            @update:model-value="value => updateProp('flowDirection', value as FerrofluidFlow)"
          />
          <PreviewSlider
            title="Cursor Strength"
            :min="0"
            :max="2"
            :step="0.05"
            :is-disabled="!settings.mouseInteraction"
            :model-value="settings.mouseStrength"
            @update:model-value="value => updateProp('mouseStrength', value)"
          />
          <PreviewSlider
            title="Cursor Radius"
            :min="0.08"
            :max="0.45"
            :step="0.01"
            :is-disabled="!settings.mouseInteraction"
            :model-value="settings.mouseRadius"
            @update:model-value="value => updateProp('mouseRadius', value)"
          />
          <PreviewSwitch
            title="Cursor Magnet"
            :model-value="settings.mouseInteraction"
            @update:model-value="value => updateProp('mouseInteraction', value)"
          />
          <PreviewSwitch
            title="Click Pulse"
            :model-value="settings.clickPulse"
            @update:model-value="value => updateProp('clickPulse', value)"
          />
          <PreviewSwitch
            title="Intro"
            :model-value="settings.intro"
            @update:model-value="value => updateProp('intro', value)"
          />
          <PreviewSwitch
            title="Light Mode"
            :model-value="settings.lightMode"
            @update:model-value="value => updateProp('lightMode', value)"
          />
        </Customize>

        <PropTable :data="propData" />
      </template>

      <template #code>
        <CodeExample :code-object="ferrofluid" component-name="Ferrofluid" />
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
import { ferrofluid } from '@/constants/code/Backgrounds/ferrofluidCode';
import Ferrofluid from '@/content/Backgrounds/Ferrofluid/Ferrofluid.vue';
import { DEFAULT_PROPS, PRESET_OPTIONS, presetProps, type FerrofluidFlow } from './presets/Ferrofluid';

const FLOW_OPTIONS = [
  { value: 'down', label: 'Down' },
  { value: 'up', label: 'Up' },
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' },
  { value: 'none', label: 'None' }
];

const LIGHTS = [
  { title: 'Key Light', index: 0 },
  { title: 'Side Lights', index: 1 },
  { title: 'Fill Light', index: 2 }
];

const { rerenderKey, forceRerender } = useForceRerender();
const { props, defaultProps, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);

const settings = computed(() => {
  const { preset: _preset, ...rest } = props.value;
  void _preset;
  return { ...rest, flowDirection: rest.flowDirection as FerrofluidFlow };
});

const colorAt = (index: number) => settings.value.colors?.[index] ?? settings.value.colors?.[0] ?? '#ffffff';

const applyPreset = (value: string | number) => {
  const name = String(value);
  updateProps({ ...presetProps(name, { defaults: defaultProps.value }), preset: name });
};

const setLight = (index: number, value: string) => {
  const next = [0, 1, 2].map(i => colorAt(i));
  next[index] = value;
  updateProp('colors', next);
};

const propData: PropRow[] = [
  {
    name: 'colors',
    type: 'string[]',
    default: "['#ffffff', '#ffffff', '#ffffff']",
    description: 'Colors of the studio lights reflected in the fluid: key light, side lights and fill light.'
  },
  { name: 'brightness', type: 'number', default: '1', description: 'Strength of the reflections.' },
  {
    name: 'scale',
    type: 'number',
    default: '1.6',
    description: 'Zoom of the fluid. Higher values show bigger, fewer spikes.'
  },
  { name: 'spikeHeight', type: 'number', default: '1', description: 'How tall the spikes grow in a strong field.' },
  {
    name: 'sharpness',
    type: 'number',
    default: '2.5',
    description:
      'How peaked the spikes are. Low values give soft mounds, high values taller cones. Tips always stay rounded.'
  },
  {
    name: 'tilt',
    type: 'number',
    default: '48',
    description: 'Viewing angle in degrees. Low values look down from above, high values look across the fluid.'
  },
  {
    name: 'turbulence',
    type: 'number',
    default: '1',
    description: 'How much the spike pattern sways and drifts out of its regular grid.'
  },
  {
    name: 'fluidity',
    type: 'number',
    default: '0.5',
    description: 'How loosely the spikes respond, from 0 (thick and slow) to 1 (bouncy).'
  },
  { name: 'speed', type: 'number', default: '0.5', description: 'How fast the swells roll across the surface.' },
  {
    name: 'magnetism',
    type: 'number',
    default: '1',
    description: 'Strength of the magnetic field that raises swells of spikes across the surface.'
  },
  {
    name: 'variation',
    type: 'number',
    default: '0',
    description: 'Picks a different arrangement of swells.'
  },
  {
    name: 'flowDirection',
    type: "'down' | 'up' | 'left' | 'right' | 'none'",
    default: "'down'",
    description: 'Direction the swells roll. None keeps them morphing in place.'
  },
  {
    name: 'mouseInteraction',
    type: 'boolean',
    default: 'true',
    description: 'Turns the cursor into a magnet that raises a crown of spikes.'
  },
  { name: 'mouseStrength', type: 'number', default: '1', description: 'Strength of the cursor magnet.' },
  {
    name: 'mouseRadius',
    type: 'number',
    default: '0.22',
    description: 'Reach of the cursor magnet, as a fraction of the height.'
  },
  {
    name: 'mouseDampening',
    type: 'number',
    default: '0.15',
    description: 'Time in seconds the crown takes to catch up with the cursor. 0 follows instantly.'
  },
  {
    name: 'clickPulse',
    type: 'boolean',
    default: 'true',
    description: 'Clicking sends a magnetic pulse through the fluid.'
  },
  { name: 'intro', type: 'boolean', default: 'true', description: 'Raises the spikes when the field switches on.' },
  {
    name: 'lightMode',
    type: 'boolean',
    default: 'false',
    description: 'Renders the fluid as glossy white liquid for light backgrounds.'
  },
  {
    name: 'transparent',
    type: 'boolean',
    default: 'true',
    description: 'Lets the page show through. When off, the fluid sits on the color below.'
  },
  {
    name: 'color',
    type: 'string',
    default: "'#111111'",
    description: 'Background color when transparent is off. Defaults to white in light mode.'
  },
  { name: 'opacity', type: 'number', default: '1', description: 'Opacity of the whole effect.' },
  { name: 'paused', type: 'boolean', default: 'false', description: 'Freezes the fluid.' },
  { name: 'mixBlendMode', type: 'string', default: '-', description: 'CSS mix-blend-mode applied to the container.' },
  { name: 'dpr', type: 'number', default: 'auto', description: 'Maximum device pixel ratio, capped at 2.' },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the container.' },
  { name: 'style', type: 'CSSProperties', default: '-', description: 'Inline styles for the container.' }
];
</script>
