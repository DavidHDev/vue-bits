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
        <div class="demo-container relative" style="min-height: 400px">
          <TrueFocus :key="rerenderKey" v-bind="settings" :border-color="borderColor" />
        </div>

        <Customize>
          <PreviewSelect
            title="Preset"
            :options="PRESET_OPTIONS"
            :model-value="props.preset"
            @update:model-value="value => applyPreset(String(value))"
          />
          <PreviewColorPickerCustom
            title="Border Color"
            :color="borderColor"
            @change="value => updateProp('borderColor', value)"
          />
          <PreviewColorPickerCustom
            title="Highlight Color"
            :color="settings.highlightColor"
            @change="value => updateProp('highlightColor', value)"
          />
          <PreviewSelect
            title="Easing"
            :options="EASING_OPTIONS"
            :model-value="settings.easing"
            @update:model-value="value => updateProp('easing', value as Easing)"
          />
          <PreviewSelect
            title="Order"
            :options="ORDER_OPTIONS"
            :model-value="settings.order"
            :is-disabled="settings.manualMode"
            @update:model-value="value => updateProp('order', value as Order)"
          />
          <PreviewSlider
            title="Animation Duration"
            :min="0.1"
            :max="3"
            :step="0.05"
            value-unit="s"
            :model-value="settings.animationDuration"
            @update:model-value="value => updateProp('animationDuration', value)"
          />
          <PreviewSlider
            title="Pause Between Animations"
            :min="0"
            :max="5"
            :step="0.1"
            value-unit="s"
            :is-disabled="settings.manualMode"
            :model-value="settings.pauseBetweenAnimations"
            @update:model-value="value => updateProp('pauseBetweenAnimations', value)"
          />
          <PreviewSwitch
            title="Hover Mode"
            :model-value="settings.manualMode"
            @update:model-value="value => updateProp('manualMode', value)"
          />
          <PreviewSelect
            title="Focus Style"
            :options="STYLE_OPTIONS"
            :model-value="settings.focusStyle"
            @update:model-value="value => updateProp('focusStyle', value as FocusStyle)"
          />
          <PreviewSlider
            title="Focus Scale"
            :min="1"
            :max="1.3"
            :step="0.01"
            :model-value="settings.focusScale"
            @update:model-value="value => updateProp('focusScale', value)"
          />
          <PreviewSlider
            title="Blur Amount"
            :min="0"
            :max="15"
            :step="0.5"
            value-unit="px"
            :model-value="settings.blurAmount"
            @update:model-value="value => updateProp('blurAmount', value)"
          />
          <PreviewSlider
            title="Unfocused Opacity"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.unfocusedOpacity"
            @update:model-value="value => updateProp('unfocusedOpacity', value)"
          />
          <PreviewSlider
            title="Corner Size"
            :min="6"
            :max="40"
            :step="1"
            value-unit="px"
            :is-disabled="settings.focusStyle !== 'brackets'"
            :model-value="settings.cornerSize"
            @update:model-value="value => updateProp('cornerSize', value)"
          />
          <PreviewSlider
            title="Border Width"
            :min="1"
            :max="8"
            :step="0.5"
            value-unit="px"
            :is-disabled="settings.focusStyle === 'highlight'"
            :model-value="settings.borderWidth"
            @update:model-value="value => updateProp('borderWidth', value)"
          />
          <PreviewInput
            title="Sentence"
            placeholder="True Focus"
            :max-length="40"
            :model-value="settings.sentence"
            @update:model-value="value => updateProp('sentence', value)"
          />
        </Customize>

        <PropTable :data="propData" />
        <Dependencies :dependency-list="['motion-v']" />
      </template>

      <template #code>
        <CodeExample :code-object="trueFocus" component-name="TrueFocus" />
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
import { trueFocus } from '@/constants/code/TextAnimations/trueFocusCode';
import TrueFocus from '@/content/TextAnimations/TrueFocus/TrueFocus.vue';

type FocusStyle = 'brackets' | 'box' | 'underline' | 'highlight';
type Easing = 'smooth' | 'spring';
type Order = 'sequential' | 'random';

type Look = {
  sentence: string;
  borderColor: string;
  highlightColor: string;
  easing: Easing;
  order: Order;
  animationDuration: number;
  pauseBetweenAnimations: number;
  focusStyle: FocusStyle;
  focusScale: number;
  blurAmount: number;
  unfocusedOpacity: number;
  cornerSize: number;
  borderWidth: number;
};

const LOOK: Look = {
  sentence: 'True Focus',
  borderColor: '#7cff67',
  highlightColor: '#7cff67',
  easing: 'smooth',
  order: 'sequential',
  animationDuration: 0.5,
  pauseBetweenAnimations: 1,
  focusStyle: 'brackets',
  focusScale: 1,
  blurAmount: 5,
  unfocusedOpacity: 1,
  cornerSize: 16,
  borderWidth: 3
};

const PRESETS: Record<string, Look> = {
  classic: { ...LOOK },
  box: {
    ...LOOK,
    sentence: 'Less noise, more focus',
    borderColor: '#ffffff',
    easing: 'spring',
    animationDuration: 0.55,
    pauseBetweenAnimations: 0.9,
    focusStyle: 'box',
    focusScale: 1.06,
    blurAmount: 3,
    unfocusedOpacity: 0.4,
    borderWidth: 1.5
  },
  underline: {
    ...LOOK,
    sentence: 'Make every word count',
    borderColor: '#ff5a36',
    easing: 'spring',
    order: 'random',
    pauseBetweenAnimations: 0.8,
    focusStyle: 'underline',
    blurAmount: 0,
    unfocusedOpacity: 0.28,
    borderWidth: 4
  },
  marker: {
    ...LOOK,
    sentence: 'Mark what matters most',
    highlightColor: '#4f8dff',
    animationDuration: 0.6,
    focusStyle: 'highlight',
    focusScale: 1.04,
    blurAmount: 1.5,
    unfocusedOpacity: 0.5
  }
};

const DEFAULT_PROPS = {
  preset: 'classic',
  ...LOOK,
  manualMode: false
};

const LIGHT_BORDER: Record<string, string> = {
  '#ffffff': '#161816',
  '#7cff67': '#1f9d45'
};

const PRESET_OPTIONS = [
  { value: 'classic', label: 'Classic' },
  { value: 'box', label: 'Box' },
  { value: 'underline', label: 'Underline' },
  { value: 'marker', label: 'Marker' }
];

const STYLE_OPTIONS = [
  { value: 'brackets', label: 'Brackets' },
  { value: 'box', label: 'Box' },
  { value: 'underline', label: 'Underline' },
  { value: 'highlight', label: 'Highlight' }
];

const EASING_OPTIONS = [
  { value: 'smooth', label: 'Smooth' },
  { value: 'spring', label: 'Spring' }
];

const ORDER_OPTIONS = [
  { value: 'sequential', label: 'Sequential' },
  { value: 'random', label: 'Random' }
];

const propData: PropRow[] = [
  {
    name: 'sentence',
    type: 'string',
    default: "'True Focus'",
    description: 'The text to display with the focus animation.'
  },
  {
    name: 'separator',
    type: 'string',
    default: "' '",
    description: 'String used to split the sentence into words.'
  },
  {
    name: 'focusStyle',
    type: "'brackets' | 'box' | 'underline' | 'highlight'",
    default: "'brackets'",
    description:
      'How the focused word is marked: corner brackets, a full outline, a bar underneath, or a soft filled block behind the word.'
  },
  {
    name: 'borderColor',
    type: 'string',
    default: "'green'",
    description: 'Color of the brackets, box or underline.'
  },
  {
    name: 'highlightColor',
    type: 'string',
    default: 'undefined',
    description:
      'Color of the block in the highlight style, drawn softly so the text stays readable. Uses the border color when not set.'
  },
  {
    name: 'glowColor',
    type: 'string',
    default: "'transparent'",
    description: 'Color of a soft glow around the brackets, box or underline. No glow by default.'
  },
  {
    name: 'focusScale',
    type: 'number',
    default: '1',
    description: 'Scales up the focused word, for example 1.06. The frame grows with it.'
  },
  {
    name: 'blurAmount',
    type: 'number',
    default: '5',
    description: 'Blur on the words that are out of focus, in px.'
  },
  {
    name: 'unfocusedOpacity',
    type: 'number',
    default: '1',
    description: 'Opacity of the words that are out of focus, from 0 to 1.'
  },
  {
    name: 'easing',
    type: "'smooth' | 'spring'",
    default: "'smooth'",
    description: 'How the frame moves between words: a smooth glide, or a spring that slightly overshoots and settles.'
  },
  {
    name: 'order',
    type: "'sequential' | 'random'",
    default: "'sequential'",
    description: 'Moves the focus to the next word in reading order, or to a random other word.'
  },
  {
    name: 'manualMode',
    type: 'boolean',
    default: 'false',
    description: 'Moves the focus to the hovered word instead of cycling on its own.'
  },
  {
    name: 'animationDuration',
    type: 'number',
    default: '0.5',
    description: 'How long the frame takes to move to the next word, in seconds.'
  },
  {
    name: 'pauseBetweenAnimations',
    type: 'number',
    default: '1',
    description: 'How long the focus rests on each word before moving on, in seconds.'
  },
  {
    name: 'cornerSize',
    type: 'number',
    default: '16',
    description: 'Length of each corner bracket, in px.'
  },
  {
    name: 'borderWidth',
    type: 'number',
    default: '3',
    description: 'Thickness of the brackets, box or underline, in px.'
  }
];

const { rerenderKey, forceRerender } = useForceRerender();
const { props, defaultProps, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);
const settings = computed(() => {
  const { preset: _preset, ...rest } = props.value;
  return rest;
});
const borderColor = useColorModeValue(
  () => LIGHT_BORDER[settings.value.borderColor.toLowerCase()] ?? settings.value.borderColor,
  () => settings.value.borderColor
);

const applyPreset = (value: string) => {
  const base = Object.fromEntries(
    (Object.keys(LOOK) as (keyof Look)[]).map(name => [name, defaultProps.value[name]])
  ) as Partial<typeof DEFAULT_PROPS>;
  updateProps({ ...base, ...PRESETS[value], preset: value });
  forceRerender();
};
</script>
