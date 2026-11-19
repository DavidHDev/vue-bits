<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
    :demo-only-props="['preset', 'secondaryColor']"
    :computed-props="computedProps"
  >
    <TabsLayout>
      <template #preview>
        <div class="demo-container relative overflow-hidden" style="height: 500px; padding: 0">
          <p class="glow-cursor-demo-hint">Move and click</p>
          <GlowCursor v-bind="{ ...settings, ...computedProps }" :theme="theme" />
        </div>

        <Customize>
          <PreviewSelect
            title="Preset"
            :options="PRESET_OPTIONS"
            :model-value="props.preset"
            @update:model-value="applyPreset"
          />
          <PreviewColorPickerCustom
            title="Color"
            :color="props.color"
            @change="(value: string) => updateProp('color', value)"
          />
          <PreviewColorPickerCustom
            title="Cooling Color"
            :color="props.secondaryColor || props.color"
            @change="(value: string) => updateProp('secondaryColor', value)"
          />
          <PreviewSlider
            title="Intensity"
            :min="0.3"
            :max="3"
            :step="0.05"
            :model-value="props.intensity"
            @update:model-value="value => updateProp('intensity', value)"
          />
          <PreviewSlider
            title="Trail Width"
            :min="1"
            :max="64"
            :step="0.5"
            value-unit="px"
            :model-value="props.trailWidth"
            @update:model-value="value => updateProp('trailWidth', value)"
          />
          <PreviewSlider
            title="Linger"
            :min="0.3"
            :max="5"
            :step="0.1"
            value-unit="s"
            :model-value="props.linger"
            @update:model-value="value => updateProp('linger', value)"
          />
          <PreviewSlider
            title="Glow"
            :min="0"
            :max="3"
            :step="0.05"
            :model-value="props.glow"
            @update:model-value="value => updateProp('glow', value)"
          />
          <PreviewSlider
            title="Hotspot"
            :min="0"
            :max="2"
            :step="0.05"
            :model-value="props.hotspot"
            @update:model-value="value => updateProp('hotspot', value)"
          />
          <PreviewSlider
            title="Follow Speed"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.followSpeed"
            @update:model-value="value => updateProp('followSpeed', value)"
          />
          <PreviewSlider
            title="Grain"
            :min="0"
            :max="0.3"
            :step="0.01"
            :model-value="props.grain"
            @update:model-value="value => updateProp('grain', value)"
          />
          <PreviewSelect
            title="Quality"
            :options="QUALITY_OPTIONS"
            :model-value="props.quality"
            @update:model-value="value => updateProp('quality', value as Quality)"
          />
          <PreviewSwitch
            title="Click Burst"
            :model-value="props.clickBurst"
            @update:model-value="value => updateProp('clickBurst', value)"
          />
          <PreviewSwitch
            title="Enabled"
            :model-value="props.enabled"
            @update:model-value="value => updateProp('enabled', value)"
          />
        </Customize>

        <PropTable :data="propData" />
      </template>

      <template #code>
        <CodeExample :code-object="glowCursor" component-name="GlowCursor" />
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
import TabsLayout from '@/components/common/TabsLayout.vue';
import ComponentPropsProvider from '@/components/context/ComponentPropsProvider.vue';
import { useComponentProps } from '@/composables/useComponentProps';
import { useColorModeValue } from '@/composables/useTheme';
import { glowCursor } from '@/constants/code/Animations/glowCursorCode';
import GlowCursor from '@/content/Animations/GlowCursor/GlowCursor.vue';

type Quality = 'low' | 'medium' | 'high';

const COMET = {
  color: '#5f8bff',
  secondaryColor: '',
  intensity: 1.3,
  trailWidth: 3,
  linger: 1.4,
  glow: 1.2,
  hotspot: 0.8,
  followSpeed: 0.6,
  grain: 0
};

const DEFAULT_PROPS = {
  preset: 'comet',
  ...COMET,
  clickBurst: true,
  quality: 'high' as Quality,
  enabled: true
};

type DemoProps = typeof DEFAULT_PROPS;

const PRESETS: Record<string, Partial<DemoProps>> = {
  comet: COMET,
  ember: { ...COMET, color: '#ffb347', secondaryColor: '#ff3b1a', linger: 1.1 },
  aurora: { ...COMET, color: '#5effc4', secondaryColor: '#2a8cff', linger: 2.4, glow: 1.5 },
  smoke: {
    ...COMET,
    color: '#ffffff',
    secondaryColor: '#9b9b9b',
    linger: 2.6,
    intensity: 0.9,
    hotspot: 0.4,
    glow: 0.6
  },
  ion: { ...COMET, color: '#7ff3ff', secondaryColor: '#3a5bff', trailWidth: 2, linger: 1, intensity: 1.6 },
  silk: { ...COMET, trailWidth: 7, linger: 2, glow: 1.6, hotspot: 0.4 }
};

const PRESET_OPTIONS = [
  { value: 'comet', label: 'Comet' },
  { value: 'ember', label: 'Ember' },
  { value: 'aurora', label: 'Aurora' },
  { value: 'smoke', label: 'Smoke' },
  { value: 'ion', label: 'Ion' },
  { value: 'silk', label: 'Silk' }
];

const QUALITY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' }
];

const propData: PropRow[] = [
  { name: 'color', type: 'string', default: "'#5f8bff'", description: 'Color of the light where it is freshly drawn.' },
  {
    name: 'secondaryColor',
    type: 'string',
    default: '-',
    description: 'Color the light cools to as it drifts. Leave it out for a deeper shade of the main color.'
  },
  { name: 'intensity', type: 'number', default: '1.3', description: 'Brightness of the light.' },
  {
    name: 'trailWidth',
    type: 'number',
    default: '3',
    description: 'Thickness of the light where it is drawn, in pixels.'
  },
  { name: 'linger', type: 'number', default: '1.4', description: 'Seconds the light stays visible before it fades.' },
  { name: 'glow', type: 'number', default: '1.2', description: 'Strength of the soft glow around the light.' },
  { name: 'hotspot', type: 'number', default: '0.8', description: 'Strength of the white-hot core near the cursor.' },
  {
    name: 'followSpeed',
    type: 'number',
    default: '0.6',
    description: 'How tightly the light follows the cursor, from 0 to 1.'
  },
  { name: 'grain', type: 'number', default: '0', description: 'Amount of film grain in the light.' },
  { name: 'clickBurst', type: 'boolean', default: 'true', description: 'Releases a burst of light when you click.' },
  {
    name: 'quality',
    type: "'low' | 'medium' | 'high'",
    default: "'high'",
    description: 'Resolution of the simulation. Lower it for weaker devices.'
  },
  {
    name: 'theme',
    type: "'dark' | 'light'",
    default: "'dark'",
    description: 'Use light on light backgrounds for an ink-like look.'
  },
  {
    name: 'blendMode',
    type: 'string',
    default: 'auto',
    description: 'CSS blend mode of the canvas. Defaults to screen in dark and normal in light.'
  },
  { name: 'maxDevicePixelRatio', type: 'number', default: '2', description: 'Maximum pixel density of the canvas.' },
  {
    name: 'enabled',
    type: 'boolean',
    default: 'true',
    description: 'Stops drawing new light while keeping what is already there.'
  },
  { name: 'default slot', type: 'slot', default: '-', description: 'Content rendered above the light.' },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the container.' },
  { name: 'style', type: 'StyleValue', default: '-', description: 'Inline styles for the container.' }
];

const { props, defaultProps, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);
const theme = useColorModeValue<'light' | 'dark'>('light', 'dark');

const settings = computed(() => {
  const { preset: _preset, secondaryColor: _secondaryColor, ...rest } = props.value;
  return rest;
});

const computedProps = computed((): { secondaryColor?: string } =>
  props.value.secondaryColor ? { secondaryColor: props.value.secondaryColor } : {}
);

const applyPreset = (value: string | number) => {
  const key = String(value);
  const base = Object.fromEntries(
    Object.keys(DEFAULT_PROPS).map(key => [key, defaultProps.value[key as keyof DemoProps]])
  ) as Partial<DemoProps>;
  updateProps({ ...base, ...PRESETS[key], preset: key });
};
</script>

<style scoped>
.glow-cursor-demo-hint {
  position: absolute;
  bottom: 1.25rem;
  left: 50%;
  transform: translateX(-50%);
  margin: 0;
  font-size: 0.875rem;
  color: var(--text-dimmed);
  user-select: none;
  pointer-events: none;
}
</style>
