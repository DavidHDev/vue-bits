<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
    :demo-only-props="['preset', 'restWeight', 'peakWeight', 'fromColor', 'toColor']"
    :computed-props="computedProps"
  >
    <TabsLayout>
      <template #preview>
        <div
          ref="containerRef"
          class="demo-container relative overflow-hidden"
          style="min-height: 400px; padding: 16px; container-type: inline-size"
        >
          <VariableProximity
            label="Hover me! And then star Vue Bits on GitHub, or else..."
            :from-font-variation-settings="computedProps.fromFontVariationSettings"
            :to-font-variation-settings="computedProps.toFontVariationSettings"
            :container-ref="containerRef"
            :radius="settings.radius"
            :falloff="settings.falloff"
            :smoothing="settings.smoothing"
            :from-color="settings.fromColor || undefined"
            :to-color="settings.toColor || undefined"
            :scale="settings.scale"
            :lift="settings.lift"
            :idle-wave="settings.idleWave"
            :font-size="`min(${settings.fontSize}px, 8.5cqi)`"
            :style="{ display: 'block', maxWidth: '20ch', lineHeight: 1.05, textAlign: 'center', cursor: 'pointer' }"
          />
        </div>

        <Customize>
          <PreviewSelect
            title="Preset"
            :options="PRESET_OPTIONS"
            :model-value="props.preset"
            @update:model-value="value => applyPreset(String(value))"
          />
          <PreviewColorPickerCustom
            title="From Color"
            :color="settings.fromColor || ink"
            @change="value => updateProp('fromColor', value)"
          />
          <PreviewColorPickerCustom
            title="To Color"
            :color="settings.toColor || settings.fromColor || ink"
            @change="value => updateProp('toColor', value)"
          />
          <PreviewSelect
            title="Falloff"
            :options="FALLOFF_OPTIONS"
            :model-value="settings.falloff"
            @update:model-value="value => updateProp('falloff', value as Falloff)"
          />
          <PreviewSlider
            title="Radius"
            :min="50"
            :max="300"
            :step="10"
            value-unit="px"
            :model-value="settings.radius"
            @update:model-value="value => updateProp('radius', value)"
          />
          <PreviewSlider
            title="Smoothing"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.smoothing"
            @update:model-value="value => updateProp('smoothing', value)"
          />
          <PreviewSlider
            title="Scale"
            :min="0.8"
            :max="1.6"
            :step="0.02"
            :model-value="settings.scale"
            @update:model-value="value => updateProp('scale', value)"
          />
          <PreviewSlider
            title="Lift"
            :min="0"
            :max="0.4"
            :step="0.01"
            value-unit="em"
            :model-value="settings.lift"
            @update:model-value="value => updateProp('lift', value)"
          />
          <PreviewSwitch
            title="Idle Wave"
            :model-value="settings.idleWave"
            @update:model-value="value => updateProp('idleWave', value)"
          />
          <PreviewSlider
            title="Rest Weight"
            :min="100"
            :max="1000"
            :step="50"
            :model-value="settings.restWeight"
            @update:model-value="value => updateProp('restWeight', value)"
          />
          <PreviewSlider
            title="Peak Weight"
            :min="100"
            :max="1000"
            :step="50"
            :model-value="settings.peakWeight"
            @update:model-value="value => updateProp('peakWeight', value)"
          />
          <PreviewSlider
            title="Font Size"
            :min="32"
            :max="96"
            :step="2"
            value-unit="px"
            :model-value="settings.fontSize"
            @update:model-value="value => updateProp('fontSize', value)"
          />
        </Customize>

        <PropTable :data="propData" />
      </template>

      <template #code>
        <CodeExample :code-object="variableProximity" component-name="VariableProximity" />
      </template>
    </TabsLayout>
  </ComponentPropsProvider>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
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
import { variableProximity } from '@/constants/code/TextAnimations/variableProximityCode';
import VariableProximity, { type Falloff } from '@/content/TextAnimations/VariableProximity/VariableProximity.vue';

type Look = {
  restWeight: number;
  peakWeight: number;
  radius: number;
  falloff: Falloff;
  smoothing: number;
  fromColor: string;
  toColor: string;
  scale: number;
  lift: number;
  idleWave: boolean;
  fontSize: number;
};

const LOOK: Look = {
  restWeight: 400,
  peakWeight: 1000,
  radius: 100,
  falloff: 'linear',
  smoothing: 0.2,
  fromColor: '',
  toColor: '',
  scale: 1,
  lift: 0,
  idleWave: false,
  fontSize: 64
};

const PRESETS: Record<string, Look> = {
  classic: { ...LOOK },
  inverse: {
    ...LOOK,
    restWeight: 1000,
    peakWeight: 100,
    radius: 120,
    falloff: 'exponential',
    smoothing: 0.1,
    idleWave: true
  },
  hairline: {
    ...LOOK,
    restWeight: 100,
    peakWeight: 900,
    radius: 180,
    falloff: 'gaussian',
    smoothing: 0.5,
    scale: 1.12,
    fontSize: 72
  },
  lift: {
    ...LOOK,
    restWeight: 300,
    peakWeight: 800,
    radius: 150,
    falloff: 'gaussian',
    smoothing: 0.3,
    toColor: '#ff5a36',
    scale: 1.22,
    lift: 0.16
  }
};

const PRESET_OPTIONS = [
  { value: 'classic', label: 'Classic' },
  { value: 'inverse', label: 'Inverse' },
  { value: 'hairline', label: 'Hairline' },
  { value: 'lift', label: 'Lift' }
];

const FALLOFF_OPTIONS = [
  { value: 'linear', label: 'Linear' },
  { value: 'exponential', label: 'Exponential' },
  { value: 'gaussian', label: 'Gaussian' }
];

const DEFAULT_PROPS = {
  preset: 'classic',
  ...LOOK
};

const containerRef = ref<HTMLElement | null>(null);
const ink = useColorModeValue('#161816', '#ffffff');

const { props, defaultProps, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);
const settings = computed(() => props.value);

const applyPreset = (value: string) => {
  const base = Object.fromEntries((Object.keys(LOOK) as (keyof Look)[]).map(name => [name, defaultProps.value[name]]));
  updateProps({ ...base, ...PRESETS[value], preset: value });
};

const computedProps = computed(() => ({
  fromFontVariationSettings: `'wght' ${settings.value.restWeight}, 'opsz' 9`,
  toFontVariationSettings: `'wght' ${settings.value.peakWeight}, 'opsz' 40`,
  ...(settings.value.fromColor ? { fromColor: settings.value.fromColor } : {}),
  ...(settings.value.toColor ? { toColor: settings.value.toColor } : {})
}));

const propData: PropRow[] = [
  {
    name: 'label',
    type: 'string',
    default: '""',
    description: 'The text content to display.'
  },
  {
    name: 'fromFontVariationSettings',
    type: 'string',
    default: "'wght' 400, 'opsz' 9",
    description: 'The variation settings letters rest at, away from the cursor.'
  },
  {
    name: 'toFontVariationSettings',
    type: 'string',
    default: "'wght' 1000, 'opsz' 40",
    description: 'The variation settings to reach at cursor proximity.'
  },
  {
    name: 'containerRef',
    type: 'HTMLElement | null',
    default: 'null',
    description:
      'Optional element around the text. Letters skip their distance checks while the cursor is farther than the radius from it.'
  },
  {
    name: 'radius',
    type: 'number',
    default: '50',
    description: 'Proximity radius to influence the effect.'
  },
  {
    name: 'falloff',
    type: "'linear' | 'exponential' | 'gaussian'",
    default: '"linear"',
    description: 'Type of falloff for the effect.'
  },
  {
    name: 'smoothing',
    type: 'number',
    default: '0.2',
    description: 'How gently letters ease toward their new settings, from 0 (instant) to 1 (a slow, trailing wake).'
  },
  {
    name: 'fromColor',
    type: 'string',
    default: 'undefined',
    description: 'Color letters rest at. Leave unset to keep the text color.'
  },
  {
    name: 'toColor',
    type: 'string',
    default: 'undefined',
    description: 'Color letters shift toward as the cursor gets close. Leave unset to keep the text color.'
  },
  {
    name: 'scale',
    type: 'number',
    default: '1',
    description: 'Size a letter grows to right under the cursor. 1 keeps letters at their normal size.'
  },
  {
    name: 'lift',
    type: 'number',
    default: '0',
    description: 'How far, in em, a letter right under the cursor rises.'
  },
  {
    name: 'idleWave',
    type: 'boolean',
    default: 'false',
    description:
      'While the cursor is away, a gentle wave of weight travels across the text. It fades out as the cursor comes near.'
  },
  {
    name: 'fontSize',
    type: 'number | string',
    default: 'undefined',
    description: 'Font size of the text. Numbers are pixels. Inherits the surrounding size when unset.'
  }
];
</script>
