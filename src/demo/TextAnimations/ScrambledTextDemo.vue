<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
    :demo-only-props="['preset', 'color', 'scrambleColor', 'fontFamily']"
    :computed-props="computedProps"
  >
    <TabsLayout>
      <template #preview>
        <div class="demo-container relative overflow-hidden" style="height: 400px">
          <ScrambledText
            :key="rerenderKey"
            class-name="scrambled-text-demo"
            :style="{ color: ink }"
            v-bind="settings"
            :color="props.color"
            :scramble-color="props.scrambleColor"
            :font-family="props.fontFamily"
          >
            Once you hover over me, you will see the effect in action! You can customize the radius, duration, and speed
            of the scramble effect.
          </ScrambledText>
        </div>

        <Customize>
          <PreviewSelect
            title="Preset"
            :options="PRESET_OPTIONS"
            :model-value="props.preset"
            @update:model-value="value => applyPreset(String(value))"
          />
          <PreviewColorPickerCustom
            title="Color"
            :color="props.color || ink"
            @change="value => updateProp('color', value)"
          />
          <PreviewColorPickerCustom
            title="Scramble Color"
            :color="props.scrambleColor || props.color || ink"
            @change="value => updateProp('scrambleColor', value)"
          />
          <PreviewSelect
            title="Effect"
            :options="EFFECT_OPTIONS"
            :model-value="settings.effect"
            @update:model-value="value => updateProp('effect', value as ScrambleEffect)"
          />
          <PreviewSlider
            title="Radius"
            :min="20"
            :max="300"
            :step="10"
            value-unit="px"
            :model-value="settings.radius"
            @update:model-value="value => updateProp('radius', value)"
          />
          <PreviewSlider
            title="Strength"
            :min="0.2"
            :max="2"
            :step="0.1"
            :is-disabled="!physical"
            :model-value="settings.strength"
            @update:model-value="value => updateProp('strength', value)"
          />
          <PreviewSlider
            title="Trail"
            :min="0.1"
            :max="3"
            :step="0.05"
            value-unit="s"
            :is-disabled="!physical"
            :model-value="settings.trail"
            @update:model-value="value => updateProp('trail', value)"
          />
          <PreviewSlider
            title="Duration"
            :min="0.1"
            :max="5"
            :step="0.1"
            value-unit="s"
            :model-value="settings.duration"
            @update:model-value="value => updateProp('duration', value)"
          />
          <PreviewSlider
            title="Speed"
            :min="0.1"
            :max="2"
            :step="0.1"
            :model-value="settings.speed"
            @update:model-value="value => updateProp('speed', value)"
          />
          <PreviewSwitch
            title="Click Burst"
            :model-value="settings.clickBurst"
            @update:model-value="value => updateProp('clickBurst', value)"
          />
          <PreviewSwitch
            title="Intro"
            :model-value="settings.intro"
            @update:model-value="value => updateProp('intro', value)"
          />
          <PreviewSelect
            title="Font"
            :options="FONT_OPTIONS"
            :model-value="props.fontFamily"
            @update:model-value="value => updateProp('fontFamily', String(value))"
          />
          <PreviewInput
            title="Scramble Characters"
            placeholder="Enter characters..."
            :max-length="16"
            :model-value="settings.scrambleChars"
            @update:model-value="value => updateProp('scrambleChars', value)"
          />
        </Customize>

        <PropTable :data="propData" />
        <Dependencies :dependency-list="['gsap']" />
      </template>

      <template #code>
        <CodeExample :code-object="scrambledText" component-name="ScrambledText" />
      </template>
    </TabsLayout>
  </ComponentPropsProvider>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import CodeExample from '@/components/common/CodeExample.vue';
import Customize from '@/components/common/Customize.vue';
import Dependencies from '@/components/common/Dependencies.vue';
import PreviewColorPickerCustom from '@/components/common/PreviewColorPickerCustom.vue';
import PreviewInput from '@/components/common/PreviewInput.vue';
import PreviewSelect from '@/components/common/PreviewSelect.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import ComponentPropsProvider from '@/components/context/ComponentPropsProvider.vue';
import { useComponentProps } from '@/composables/useComponentProps';
import { useForceRerender } from '@/composables/useForceRerender';
import { useColorModeValue } from '@/composables/useTheme';
import { scrambledText } from '@/constants/code/TextAnimations/scrambledTextCode';
import ScrambledText from '@/content/TextAnimations/ScrambledText/ScrambledText.vue';

type ScrambleEffect = 'scramble' | 'lift' | 'blur' | 'magnify';

type Look = {
  color: string;
  scrambleColor: string;
  effect: ScrambleEffect;
  radius: number;
  strength: number;
  trail: number;
  duration: number;
  speed: number;
  clickBurst: boolean;
  fontFamily: string;
  scrambleChars: string;
};

const LOOK: Look = {
  color: '',
  scrambleColor: '',
  effect: 'scramble',
  radius: 100,
  strength: 1,
  trail: 0.6,
  duration: 1.2,
  speed: 0.5,
  clickBurst: true,
  fontFamily: '',
  scrambleChars: '.:'
};

const PRESETS: Record<string, Look> = {
  decode: { ...LOOK },
  float: {
    ...LOOK,
    effect: 'lift',
    radius: 130,
    strength: 1,
    trail: 0.9,
    duration: 0.9,
    speed: 0.8,
    fontFamily: 'Geist, sans-serif',
    scrambleChars: '·•'
  },
  haze: {
    ...LOOK,
    effect: 'blur',
    radius: 120,
    strength: 1.1,
    trail: 1.4,
    duration: 1.4,
    speed: 0.4,
    fontFamily: 'Georgia, serif',
    scrambleChars: '░▒'
  },
  lens: {
    ...LOOK,
    scrambleColor: '#ff5a1f',
    effect: 'magnify',
    radius: 90,
    strength: 1,
    trail: 0.35,
    duration: 0.8,
    speed: 1,
    fontFamily: '"Geist Mono", monospace',
    scrambleChars: '<>/*'
  }
};

const DEFAULT_PROPS = {
  preset: 'decode',
  ...LOOK,
  intro: true
};

const PRESET_OPTIONS = [
  { value: 'decode', label: 'Decode' },
  { value: 'float', label: 'Float' },
  { value: 'haze', label: 'Haze' },
  { value: 'lens', label: 'Lens' }
];

const EFFECT_OPTIONS = [
  { value: 'scramble', label: 'Scramble' },
  { value: 'lift', label: 'Lift' },
  { value: 'blur', label: 'Blur' },
  { value: 'magnify', label: 'Magnify' }
];

const FONT_OPTIONS = [
  { value: '', label: 'Mono' },
  { value: 'Geist, sans-serif', label: 'Sans' },
  { value: 'Georgia, serif', label: 'Serif' },
  { value: '"Geist Mono", monospace', label: 'Geist Mono' }
];

const propData: PropRow[] = [
  {
    name: 'children',
    type: 'slot',
    default: '-',
    description: 'The text to scramble.'
  },
  {
    name: 'effect',
    type: "'scramble' | 'lift' | 'blur' | 'magnify'",
    default: "'scramble'",
    description:
      'What happens to letters near the pointer: they scramble, rise, blur, or swell like a lens. Each one eases in and out with a soft falloff.'
  },
  {
    name: 'radius',
    type: 'number',
    default: '100',
    description: 'Distance from the pointer, in px, within which letters react.'
  },
  {
    name: 'strength',
    type: 'number',
    default: '1',
    description: 'How far letters lift, how much they blur, or how much they magnify.'
  },
  {
    name: 'trail',
    type: 'number',
    default: '0.6',
    description:
      'How long lifted, blurred or magnified letters take to settle after the pointer moves on, in seconds. Scrambling uses duration instead.'
  },
  {
    name: 'duration',
    type: 'number',
    default: '1.2',
    description:
      'How long a letter right under the pointer keeps scrambling, in seconds. Also sets the pace of the intro and the click burst.'
  },
  {
    name: 'speed',
    type: 'number',
    default: '0.5',
    description: 'How often a scrambling letter swaps to a new character. Higher values flicker faster.'
  },
  {
    name: 'clickBurst',
    type: 'boolean',
    default: 'true',
    description: 'Clicking sends a scramble wave outward from the click point, carrying the current effect with it.'
  },
  {
    name: 'scrambleChars',
    type: 'string',
    default: "'.:'",
    description: 'The characters shown while a letter is scrambled.'
  },
  {
    name: 'scrambleColor',
    type: 'string',
    default: "''",
    description: 'Color of letters while they are scrambled. Leave empty to keep the text color.'
  },
  {
    name: 'color',
    type: 'string',
    default: "''",
    description: 'Color of the text. Leave empty to follow the surrounding text color.'
  },
  {
    name: 'fontFamily',
    type: 'string',
    default: "''",
    description: 'Font of the text. Leave empty to keep the default monospace.'
  },
  {
    name: 'intro',
    type: 'boolean',
    default: 'true',
    description: 'Decodes the whole text from scrambled characters the first time it scrolls into view.'
  },
  {
    name: 'className',
    type: 'string',
    default: "''",
    description: 'Extra class names for the wrapper.'
  },
  {
    name: 'style',
    type: 'CSSProperties',
    default: '{}',
    description: 'Inline styles for the wrapper.'
  }
];

const { rerenderKey, forceRerender } = useForceRerender();
const { props, defaultProps, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);
const settings = computed(() => {
  const {
    preset: _preset,
    color: _color,
    scrambleColor: _scrambleColor,
    fontFamily: _fontFamily,
    ...rest
  } = props.value;
  return rest;
});
const ink = useColorModeValue('#161816', '#ffffff');
const physical = computed(() => settings.value.effect !== 'scramble');

const applyPreset = (value: string) => {
  const base = Object.fromEntries(
    (Object.keys(LOOK) as (keyof Look)[]).map(name => [name, defaultProps.value[name]])
  ) as Partial<typeof DEFAULT_PROPS>;
  updateProps({ ...base, ...PRESETS[value], preset: value });
  forceRerender();
};

const computedProps = computed(() => ({
  ...(props.value.color ? { color: props.value.color } : {}),
  ...(props.value.scrambleColor ? { scrambleColor: props.value.scrambleColor } : {}),
  ...(props.value.fontFamily ? { fontFamily: props.value.fontFamily } : {})
}));
</script>
