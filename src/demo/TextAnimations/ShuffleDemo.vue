<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
    :demo-only-props="['preset', 'color', 'accentColor', 'colorFrom', 'colorTo']"
    :computed-props="colors"
  >
    <TabsLayout>
      <template #preview>
        <div class="demo-container relative flex justify-center items-center overflow-hidden" style="height: 400px">
          <Shuffle :key="rerenderKey" text="VUE BITS" v-bind="{ ...settings, ...colors }" />
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
            title="Color"
            :color="props.color || ink"
            @change="value => change('color', value)"
          />

          <PreviewColorPickerCustom
            title="Accent"
            :color="props.accentColor || props.color || ink"
            @change="value => change('accentColor', value)"
          />

          <PreviewColorPickerCustom
            title="Start Color"
            :color="props.colorFrom || props.color || ink"
            @change="value => change('colorFrom', value)"
          />

          <PreviewColorPickerCustom
            title="End Color"
            :color="props.colorTo || props.color || ink"
            @change="value => change('colorTo', value)"
          />

          <PreviewSelect
            title="Effect"
            :options="EFFECT_OPTIONS"
            :model-value="settings.effect"
            @update:model-value="value => change('effect', value as Effect)"
          />

          <PreviewSelect
            title="Direction"
            :options="DIRECTION_OPTIONS"
            :model-value="settings.shuffleDirection"
            @update:model-value="value => change('shuffleDirection', value as Direction)"
          />

          <PreviewSelect
            title="Mode"
            :options="MODE_OPTIONS"
            :model-value="settings.animationMode"
            @update:model-value="value => change('animationMode', value as Mode)"
          />

          <PreviewSelect
            title="Ease"
            :options="EASE_OPTIONS"
            :model-value="settings.ease"
            @update:model-value="value => change('ease', String(value))"
          />

          <PreviewSlider
            title="Duration"
            :min="0.1"
            :max="2"
            :step="0.05"
            value-unit="s"
            :model-value="settings.duration"
            @update:model-value="value => change('duration', Number(value))"
          />

          <PreviewSlider
            title="Shuffle Times"
            :min="1"
            :max="16"
            :step="1"
            :model-value="settings.shuffleTimes"
            @update:model-value="value => change('shuffleTimes', Number(value))"
          />

          <PreviewSlider
            title="Stagger"
            :min="0"
            :max="0.2"
            :step="0.01"
            value-unit="s"
            :is-disabled="settings.animationMode === 'random'"
            :model-value="settings.stagger"
            @update:model-value="value => change('stagger', Number(value))"
          />

          <PreviewSlider
            title="Max Delay"
            :min="0"
            :max="1"
            :step="0.05"
            value-unit="s"
            :is-disabled="settings.animationMode !== 'random'"
            :model-value="settings.maxDelay"
            @update:model-value="value => change('maxDelay', Number(value))"
          />

          <PreviewSwitch
            title="Loop"
            :model-value="settings.loop"
            @update:model-value="value => change('loop', value)"
          />

          <PreviewSlider
            title="Loop Delay"
            :min="0"
            :max="2"
            :step="0.1"
            value-unit="s"
            :is-disabled="!settings.loop"
            :model-value="settings.loopDelay"
            @update:model-value="value => change('loopDelay', Number(value))"
          />

          <PreviewInput
            title="Scramble"
            placeholder="Repeats the letter"
            :max-length="40"
            :model-value="settings.scrambleCharset"
            @update:model-value="value => change('scrambleCharset', value)"
          />

          <PreviewSwitch
            title="Motion Blur"
            :is-disabled="settings.effect !== 'slide'"
            :model-value="settings.motionBlur"
            @update:model-value="value => change('motionBlur', value)"
          />

          <PreviewSwitch
            title="Hover Replay"
            :model-value="settings.triggerOnHover"
            @update:model-value="value => change('triggerOnHover', value)"
          />

          <PreviewSlider
            title="Hover Radius"
            :min="0"
            :max="300"
            :step="10"
            value-unit="px"
            :is-disabled="!settings.triggerOnHover"
            :model-value="settings.hoverRadius"
            @update:model-value="value => change('hoverRadius', Number(value))"
          />
        </Customize>

        <PropTable :data="propData" />
        <Dependencies :dependency-list="['gsap']" />
      </template>

      <template #code>
        <CodeExample :code-object="shuffle" component-name="Shuffle" />
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
import RefreshButton from '@/components/common/RefreshButton.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import ComponentPropsProvider from '@/components/context/ComponentPropsProvider.vue';
import { useComponentProps } from '@/composables/useComponentProps';
import { useForceRerender } from '@/composables/useForceRerender';
import { useColorModeValue } from '@/composables/useTheme';
import { shuffle } from '@/constants/code/TextAnimations/shuffleCode';
import Shuffle from '@/content/TextAnimations/Shuffle/Shuffle.vue';

type Effect = 'slide' | 'flip' | 'blur';
type Direction = 'left' | 'right' | 'up' | 'down';
type Mode = 'evenodd' | 'sequence' | 'center' | 'random';

type Look = {
  effect: Effect;
  shuffleDirection: Direction;
  animationMode: Mode;
  ease: string;
  duration: number;
  shuffleTimes: number;
  stagger: number;
  maxDelay: number;
  scrambleCharset: string;
  motionBlur: boolean;
  hoverRadius: number;
  accentColor: string;
};

const LOOK: Look = {
  effect: 'slide',
  shuffleDirection: 'right',
  animationMode: 'evenodd',
  ease: 'power3.out',
  duration: 0.35,
  shuffleTimes: 1,
  stagger: 0.03,
  maxDelay: 0,
  scrambleCharset: '',
  motionBlur: false,
  hoverRadius: 0,
  accentColor: ''
};

const PRESETS: Record<string, Look> = {
  classic: { ...LOOK },
  flip: {
    ...LOOK,
    effect: 'flip',
    shuffleDirection: 'down',
    animationMode: 'sequence',
    ease: 'power2.out',
    duration: 1.1,
    shuffleTimes: 7,
    stagger: 0.07,
    scrambleCharset: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  },
  blur: {
    ...LOOK,
    effect: 'blur',
    shuffleDirection: 'up',
    animationMode: 'center',
    ease: 'expo.out',
    duration: 1.5,
    shuffleTimes: 14,
    stagger: 0.06,
    scrambleCharset: '0123456789#%&*+=?'
  },
  hover: {
    ...LOOK,
    shuffleDirection: 'down',
    animationMode: 'random',
    ease: 'expo.out',
    duration: 0.9,
    shuffleTimes: 5,
    maxDelay: 0.45,
    scrambleCharset: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    motionBlur: true,
    hoverRadius: 120,
    accentColor: '#ff5a36'
  }
};

const DEFAULT_PROPS = {
  preset: 'classic',
  ...LOOK,
  color: '',
  colorFrom: '',
  colorTo: '',
  loop: false,
  loopDelay: 0,
  triggerOnHover: true
};

const PRESET_OPTIONS = [
  { value: 'classic', label: 'Classic' },
  { value: 'flip', label: 'Flip' },
  { value: 'blur', label: 'Blur' },
  { value: 'hover', label: 'Hover' }
];

const EFFECT_OPTIONS = [
  { label: 'Slide', value: 'slide' },
  { label: 'Flip', value: 'flip' },
  { label: 'Blur', value: 'blur' }
];

const DIRECTION_OPTIONS = [
  { label: 'Right', value: 'right' },
  { label: 'Left', value: 'left' },
  { label: 'Up', value: 'up' },
  { label: 'Down', value: 'down' }
];

const MODE_OPTIONS = [
  { label: 'Even / Odd', value: 'evenodd' },
  { label: 'Sequence', value: 'sequence' },
  { label: 'Center', value: 'center' },
  { label: 'Random', value: 'random' }
];

const EASE_OPTIONS = [
  { label: 'power2.out', value: 'power2.out' },
  { label: 'power3.out', value: 'power3.out' },
  { label: 'back.out(1.1)', value: 'back.out(1.1)' },
  { label: 'back.out(2)', value: 'back.out(2)' },
  { label: 'expo.out', value: 'expo.out' }
];

const propData: PropRow[] = [
  { name: 'text', type: 'string', default: '""', description: 'The text content to shuffle.' },
  { name: 'className', type: 'string', default: '""', description: 'Optional CSS class for the wrapper element.' },
  { name: 'style', type: 'CSSProperties', default: '{}', description: 'Inline styles applied to the wrapper element.' },
  {
    name: 'effect',
    type: '"slide" | "flip" | "blur"',
    default: '"slide"',
    description:
      'How each letter cycles: a reel that slides past, a card that flips in 3D through random glyphs, or glyphs that spin in place with motion blur and settle sharp.'
  },
  {
    name: 'shuffleDirection',
    type: '"left" | "right" | "up" | "down"',
    default: '"right"',
    description: 'Direction letters travel. Flip turns around the matching axis.'
  },
  { name: 'duration', type: 'number', default: '0.35', description: 'Duration (s) of each letter’s shuffle.' },
  {
    name: 'maxDelay',
    type: 'number',
    default: '0',
    description: 'Longest random delay (s) before a letter starts, when animationMode is "random".'
  },
  {
    name: 'ease',
    type: 'string | Function',
    default: '"power3.out"',
    description: 'GSAP ease for the motion and color shift. Back eases make letters overshoot as they land.'
  },
  {
    name: 'threshold',
    type: 'number',
    default: '0.1',
    description: 'Portion of the element that must enter view before starting.'
  },
  {
    name: 'rootMargin',
    type: 'string',
    default: '"-100px"',
    description: 'ScrollTrigger start offset (px, %, etc.).'
  },
  {
    name: 'tag',
    type: '"h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span"',
    default: '"p"',
    description: 'HTML tag to render for the text container.'
  },
  {
    name: 'textAlign',
    type: 'CSS text-align',
    default: '"center"',
    description: 'Text alignment applied via inline style.'
  },
  {
    name: 'onShuffleComplete',
    type: '() => void',
    default: 'undefined',
    description: 'Called after a full run completes (and on each loop repeat).'
  },
  {
    name: 'shuffleTimes',
    type: 'number',
    default: '1',
    description: 'How many interim glyphs each letter passes through before it lands.'
  },
  {
    name: 'animationMode',
    type: '"evenodd" | "sequence" | "center" | "random"',
    default: '"evenodd"',
    description:
      'Order the letters start in: odd letters then even ones, left to right, outward from the middle, or after random delays.'
  },
  { name: 'loop', type: 'boolean', default: 'false', description: 'Repeat the shuffle indefinitely.' },
  { name: 'loopDelay', type: 'number', default: '0', description: 'Delay (s) between loop repeats.' },
  {
    name: 'stagger',
    type: 'number',
    default: '0.03',
    description: 'Delay (s) between letters starting, in every mode except "random".'
  },
  {
    name: 'scrambleCharset',
    type: 'string',
    default: '""',
    description: 'Characters to use for interim scrambles; empty keeps original copies.'
  },
  {
    name: 'motionBlur',
    type: 'boolean',
    default: 'false',
    description: 'Smears the sliding reel along its direction while it moves fast, then lands sharp. Slide effect only.'
  },
  {
    name: 'color',
    type: 'string',
    default: 'undefined',
    description: 'Text color. Follows the surrounding text color when unset.'
  },
  {
    name: 'accentColor',
    type: 'string',
    default: 'undefined',
    description: 'Color of the interim glyphs while letters are in flight. Settled letters keep the text color.'
  },
  {
    name: 'colorFrom',
    type: 'string',
    default: 'undefined',
    description: 'Color each letter starts in, fading to its final color as it lands.'
  },
  {
    name: 'colorTo',
    type: 'string',
    default: 'undefined',
    description: 'Color each letter fades to as it lands, and keeps afterwards.'
  },
  {
    name: 'triggerOnce',
    type: 'boolean',
    default: 'true',
    description: 'Auto-run only on first scroll into view.'
  },
  {
    name: 'respectReducedMotion',
    type: 'boolean',
    default: 'true',
    description: 'Shows the text right away, without shuffling, if the user prefers reduced motion.'
  },
  {
    name: 'triggerOnHover',
    type: 'boolean',
    default: 'true',
    description: 'Allow re-playing the animation on hover after it completes.'
  },
  {
    name: 'hoverRadius',
    type: 'number',
    default: '0',
    description:
      'With hover replay on, only letters within this distance (px) of the cursor reshuffle, closer ones longer and through more glyphs. 0 replays the whole text.'
  }
];

const { rerenderKey, forceRerender } = useForceRerender();
const { props, defaultProps, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);
const settings = computed(() => {
  const {
    preset: _preset,
    color: _color,
    accentColor: _accentColor,
    colorFrom: _colorFrom,
    colorTo: _colorTo,
    ...rest
  } = props.value;
  return rest;
});
const colors = computed(
  () =>
    Object.fromEntries(
      Object.entries({
        color: props.value.color,
        accentColor: props.value.accentColor,
        colorFrom: props.value.colorFrom,
        colorTo: props.value.colorTo
      }).filter(([, value]) => value)
    ) as { color?: string; accentColor?: string; colorFrom?: string; colorTo?: string }
);
const ink = useColorModeValue('#161816', '#ffffff');

const change = <K extends keyof typeof DEFAULT_PROPS>(name: K, value: (typeof DEFAULT_PROPS)[K]) => {
  updateProp(name, value);
  forceRerender();
};

const applyPreset = (value: string) => {
  const base = Object.fromEntries(
    (Object.keys(LOOK) as (keyof Look)[]).map(name => [name, defaultProps.value[name]])
  ) as Partial<typeof DEFAULT_PROPS>;
  updateProps({ ...base, ...PRESETS[value], preset: value });
  forceRerender();
};
</script>
