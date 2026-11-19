<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
    :demo-only-props="['preset', 'textColor', 'fontSize']"
    :computed-props="computedProps"
  >
    <TabsLayout>
      <template #preview>
        <div ref="stageRef" class="demo-container relative overflow-hidden" style="height: 400px">
          <GlitchText
            :key="rerenderKey"
            v-bind="settings"
            :color="props.textColor || undefined"
            :font-size="props.fontSize || undefined"
            :children="LABELS[settings.trigger] || LABELS.always"
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
            title="Text Color"
            :color="props.textColor || ink"
            @change="value => updateProp('textColor', value)"
          />
          <PreviewColorPickerCustom
            title="Shadow Color 1"
            :color="settings.shadowColors[0]"
            @change="value => updateProp('shadowColors', [value, settings.shadowColors[1]])"
          />
          <PreviewColorPickerCustom
            title="Shadow Color 2"
            :color="settings.shadowColors[1]"
            @change="value => updateProp('shadowColors', [settings.shadowColors[0], value])"
          />
          <PreviewSelect
            title="Mode"
            :options="MODE_OPTIONS"
            :model-value="settings.mode"
            @update:model-value="value => updateProp('mode', value as GlitchMode)"
          />
          <PreviewSelect
            title="Trigger"
            :options="TRIGGER_OPTIONS"
            :model-value="settings.trigger"
            @update:model-value="
              value => {
                updateProp('trigger', value as GlitchTrigger);
                forceRerender();
              }
            "
          />
          <PreviewSlider
            title="Refresh Delay"
            :min="0.1"
            :max="5"
            :step="0.1"
            :model-value="settings.speed"
            @update:model-value="value => updateProp('speed', value)"
          />
          <PreviewSlider
            title="Intensity"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.intensity"
            @update:model-value="value => updateProp('intensity', value)"
          />
          <PreviewSlider
            title="Burst Duration"
            :min="0.2"
            :max="3"
            :step="0.1"
            value-unit="s"
            :is-disabled="settings.trigger !== 'click'"
            :model-value="settings.burstDuration"
            @update:model-value="value => updateProp('burstDuration', value)"
          />
          <PreviewSwitch
            title="Flicker"
            :model-value="settings.flicker"
            @update:model-value="value => updateProp('flicker', value)"
          />
          <PreviewSlider
            title="Offset"
            :min="0"
            :max="40"
            :step="1"
            value-unit="px"
            :model-value="settings.offset"
            @update:model-value="value => updateProp('offset', value)"
          />
          <PreviewSlider
            title="Skew"
            :min="0"
            :max="30"
            :step="1"
            value-unit="°"
            :model-value="settings.skew"
            @update:model-value="value => updateProp('skew', value)"
          />
          <PreviewSlider
            title="Font Size"
            :min="0"
            :max="160"
            :step="4"
            :display-value="value => (value ? `${value}px` : 'Auto')"
            :model-value="props.fontSize"
            @update:model-value="value => updateProp('fontSize', value)"
          />
          <PreviewSlider
            title="Font Weight"
            :min="100"
            :max="900"
            :step="100"
            :model-value="settings.fontWeight"
            @update:model-value="value => updateProp('fontWeight', value)"
          />
          <PreviewSwitch
            title="Glitch Colors"
            :model-value="settings.enableShadows"
            @update:model-value="value => updateProp('enableShadows', value)"
          />
        </Customize>

        <PropTable :data="propData" />
      </template>

      <template #code>
        <CodeExample :code-object="glitchText" component-name="GlitchText" />
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
import { useForceRerender } from '@/composables/useForceRerender';
import { useColorModeValue } from '@/composables/useTheme';
import { glitchText } from '@/constants/code/TextAnimations/glitchTextCode';
import GlitchText, { type GlitchMode, type GlitchTrigger } from '@/content/TextAnimations/GlitchText/GlitchText.vue';

type Look = {
  textColor: string;
  shadowColors: [string, string];
  mode: GlitchMode;
  trigger: GlitchTrigger;
  speed: number;
  intensity: number;
  burstDuration: number;
  flicker: boolean;
  offset: number;
  skew: number;
  fontSize: number;
  fontWeight: number;
  enableShadows: boolean;
};

const LOOK: Look = {
  textColor: '',
  shadowColors: ['#ff0000', '#00ffff'],
  mode: 'slices',
  trigger: 'always',
  speed: 1,
  intensity: 0.5,
  burstDuration: 0.6,
  flicker: false,
  offset: 10,
  skew: 0,
  fontSize: 0,
  fontWeight: 900,
  enableShadows: true
};

const PRESETS: Record<string, Look> = {
  classic: { ...LOOK },
  rgb: {
    ...LOOK,
    shadowColors: ['#ff4d2e', '#8c928d'],
    mode: 'rgb',
    intensity: 0.6,
    flicker: true,
    offset: 12,
    skew: 6,
    fontWeight: 800
  },
  scan: {
    ...LOOK,
    mode: 'scan',
    speed: 1.2,
    intensity: 0.7,
    offset: 26,
    fontWeight: 300,
    enableShadows: false
  },
  burst: {
    ...LOOK,
    shadowColors: ['#ff4d2e', '#ff4d2e'],
    mode: 'noise',
    trigger: 'click',
    intensity: 0.3,
    burstDuration: 0.9,
    flicker: true,
    offset: 14,
    skew: 10
  }
};

const PRESET_OPTIONS = [
  { value: 'classic', label: 'Classic' },
  { value: 'rgb', label: 'RGB' },
  { value: 'scan', label: 'Scan' },
  { value: 'burst', label: 'Burst' }
];

const MODE_OPTIONS = [
  { value: 'slices', label: 'Slices' },
  { value: 'rgb', label: 'RGB' },
  { value: 'scan', label: 'Scan' },
  { value: 'noise', label: 'Noise' }
];

const TRIGGER_OPTIONS = [
  { value: 'always', label: 'Always' },
  { value: 'hover', label: 'Hover' },
  { value: 'click', label: 'Click' }
];

const LABELS: Record<string, string> = { always: 'Vue Bits', hover: 'Hover Me', click: 'Click Me' };

const DEFAULT_PROPS = {
  preset: 'classic',
  ...LOOK
};

const propData: PropRow[] = [
  {
    name: 'children',
    type: 'string',
    default: '',
    description: 'The text content that will display the glitch effect.'
  },
  {
    name: 'mode',
    type: '"slices" | "rgb" | "scan" | "noise"',
    default: '"slices"',
    description:
      'Style of glitch. Slices shifts bands of the text sideways, rgb splits it into jittering color channels, scan sweeps a displaced band down through it and noise briefly swaps letters for glyphs.'
  },
  {
    name: 'trigger',
    type: '"always" | "hover" | "click"',
    default: '"always"',
    description: 'When it glitches: all the time, while hovered, or in a short burst on each click.'
  },
  {
    name: 'speed',
    type: 'number',
    default: '0.5',
    description: 'Multiplier for the animation speed. Higher values slow down the glitch effect.'
  },
  {
    name: 'intensity',
    type: 'number',
    default: '0.5',
    description: 'How often and how far it glitches, from 0 (calm) to 1 (constant, wide jolts).'
  },
  {
    name: 'burstDuration',
    type: 'number',
    default: '0.6',
    description: 'Length of the burst played on each click with the click trigger, in seconds.'
  },
  {
    name: 'flicker',
    type: 'boolean',
    default: 'false',
    description: 'Adds quick, subtle dips in opacity while it glitches.'
  },
  {
    name: 'offset',
    type: 'number',
    default: '10',
    description: 'How far the glitched slices shift sideways, in px. The colored shadows grow with it.'
  },
  {
    name: 'skew',
    type: 'number',
    default: '0',
    description: 'How far the text shears sideways during a jolt, in degrees.'
  },
  {
    name: 'enableShadows',
    type: 'boolean',
    default: 'true',
    description: 'Toggle the glitch colors. Without them every mode stays in the text color.'
  },
  {
    name: 'shadowColors',
    type: '[string, string]',
    default: "['#ff0000', '#00ffff']",
    description: 'The two glitch colors: the shadows on the shifted slices, the split channels and the swapped glyphs.'
  },
  {
    name: 'color',
    type: 'string',
    default: '"currentColor"',
    description: 'Color of the text. Follows the surrounding text color by default.'
  },
  {
    name: 'fontSize',
    type: 'number | string',
    default: '"clamp(2rem, 10vw, 8rem)"',
    description: 'Font size of the text. Numbers are in px.'
  },
  {
    name: 'fontWeight',
    type: 'number | string',
    default: '900',
    description: 'Font weight of the text.'
  },
  {
    name: 'enableOnHover',
    type: 'boolean',
    default: 'false',
    description: 'Same as trigger="hover": the glitch only runs while the text is hovered.'
  },
  {
    name: 'className',
    type: 'string',
    default: '',
    description: 'Additional custom classes to apply to the component.'
  }
];

const { rerenderKey, forceRerender } = useForceRerender();
const { props, defaultProps, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);
const settings = computed(() => {
  const { preset: _preset, textColor: _textColor, fontSize: _fontSize, ...rest } = props.value;
  return rest;
});
const ink = useColorModeValue('#161816', '#ffffff');
const stageRef = ref<HTMLDivElement | null>(null);

const applyPreset = (value: string) => {
  const base = Object.fromEntries(
    (Object.keys(LOOK) as (keyof Look)[]).map(name => [name, defaultProps.value[name]])
  ) as Partial<typeof DEFAULT_PROPS>;
  updateProps({ ...base, ...PRESETS[value], preset: value });
  forceRerender();
  if (PRESETS[value].trigger === 'click') {
    window.setTimeout(() => stageRef.value?.querySelector<HTMLElement>('.glitch')?.click(), 450);
  }
};

const computedProps = computed(() => ({
  ...(props.value.textColor ? { color: props.value.textColor } : {}),
  ...(props.value.fontSize ? { fontSize: props.value.fontSize } : {})
}));
</script>
