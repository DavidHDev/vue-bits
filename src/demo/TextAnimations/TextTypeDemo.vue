<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
    :demo-only-props="['preset', 'variableSpeedEnabled', 'variableSpeedMin', 'variableSpeedMax']"
    :computed-props="computedProps"
  >
    <TabsLayout>
      <template #preview>
        <div
          class="demo-container relative overflow-hidden"
          style="height: 350px; padding: 4rem; align-items: flex-start; justify-content: flex-start"
        >
          <TextType
            :key="rerenderKey"
            :text="settings.prefix ? WORDS : SENTENCES"
            v-bind="settings"
            :variable-speed="variableSpeed"
            class-name="custom-text-type"
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
            title="Cursor Color"
            :color="shown(settings.cursorColor)"
            @change="value => updateProp('cursorColor', value)"
          />

          <PreviewColorPickerCustom
            title="Prefix Color"
            :color="shown(settings.prefixColor)"
            @change="value => updateProp('prefixColor', value)"
          />

          <PreviewSlider
            title="Typing Speed"
            :min="10"
            :max="200"
            :step="5"
            value-unit="ms"
            :is-disabled="props.variableSpeedEnabled"
            :model-value="settings.typingSpeed"
            @update:model-value="value => updateProp('typingSpeed', value)"
          />

          <PreviewSlider
            title="Deleting Speed"
            :min="10"
            :max="100"
            :step="5"
            value-unit="ms"
            :model-value="settings.deletingSpeed"
            @update:model-value="value => updateProp('deletingSpeed', value)"
          />

          <PreviewSlider
            title="Pause Duration"
            :min="500"
            :max="5000"
            :step="100"
            value-unit="ms"
            :model-value="settings.pauseDuration"
            @update:model-value="value => updateProp('pauseDuration', value)"
          />

          <PreviewSlider
            title="Mistakes"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.mistakes"
            @update:model-value="value => updateProp('mistakes', value)"
          />

          <PreviewSelect
            title="Type Effect"
            :options="EFFECT_OPTIONS"
            :model-value="settings.typeEffect"
            @update:model-value="value => updateProp('typeEffect', value as TypeEffect)"
          />

          <PreviewSlider
            title="Cursor Blink"
            :min="0.1"
            :max="2"
            :step="0.05"
            value-unit="s"
            :is-disabled="!settings.showCursor"
            :model-value="settings.cursorBlinkDuration"
            @update:model-value="value => updateProp('cursorBlinkDuration', value)"
          />

          <PreviewSwitch
            title="Variable Speed"
            :model-value="props.variableSpeedEnabled"
            @update:model-value="value => updateProp('variableSpeedEnabled', value)"
          />

          <PreviewSlider
            title="Variable Speed Min"
            :is-disabled="!props.variableSpeedEnabled"
            :min="10"
            :max="150"
            :step="5"
            value-unit="ms"
            :model-value="props.variableSpeedMin"
            @update:model-value="value => updateProp('variableSpeedMin', value)"
          />

          <PreviewSlider
            title="Variable Speed Max"
            :is-disabled="!props.variableSpeedEnabled"
            :min="50"
            :max="300"
            :step="5"
            value-unit="ms"
            :model-value="props.variableSpeedMax"
            @update:model-value="value => updateProp('variableSpeedMax', value)"
          />

          <PreviewSwitch
            title="Cursor Glide"
            :is-disabled="!settings.showCursor"
            :model-value="settings.cursorGlide"
            @update:model-value="value => updateProp('cursorGlide', value)"
          />

          <PreviewSelect
            title="Cursor Style"
            :options="CURSOR_STYLE_OPTIONS"
            :is-disabled="!settings.showCursor"
            :model-value="settings.cursorStyle"
            @update:model-value="value => updateProp('cursorStyle', value as CursorStyle)"
          />

          <PreviewSelect
            title="Cursor Character"
            :options="CURSOR_OPTIONS"
            :is-disabled="!settings.showCursor || settings.cursorStyle !== 'character'"
            :model-value="settings.cursorCharacter"
            @update:model-value="value => updateProp('cursorCharacter', String(value))"
          />

          <PreviewSelect
            title="Delete Mode"
            :options="DELETE_MODE_OPTIONS"
            :model-value="settings.deleteMode"
            @update:model-value="value => updateProp('deleteMode', value as DeleteMode)"
          />

          <PreviewSwitch
            title="Show Cursor"
            :model-value="settings.showCursor"
            @update:model-value="value => updateProp('showCursor', value)"
          />

          <PreviewInput
            title="Prefix"
            placeholder="We build "
            :max-length="24"
            :model-value="settings.prefix"
            @update:model-value="value => restart('prefix', value)"
          />
        </Customize>

        <PropTable :data="propData" />
        <Dependencies :dependency-list="['gsap']" />
      </template>

      <template #code>
        <CodeExample :code-object="textType" component-name="TextType" />
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
import { textType } from '@/constants/code/TextAnimations/textTypeCode';
import TextType from '@/content/TextAnimations/TextType/TextType.vue';

type CursorStyle = 'character' | 'bar' | 'block' | 'underscore';
type TypeEffect = 'none' | 'fade' | 'blur' | 'rise';
type DeleteMode = 'backspace' | 'select';

type Look = {
  cursorColor: string;
  prefixColor: string;
  typingSpeed: number;
  deletingSpeed: number;
  pauseDuration: number;
  mistakes: number;
  typeEffect: TypeEffect;
  cursorBlinkDuration: number;
  variableSpeedEnabled: boolean;
  variableSpeedMin: number;
  variableSpeedMax: number;
  cursorGlide: boolean;
  cursorStyle: CursorStyle;
  cursorCharacter: string;
  deleteMode: DeleteMode;
  showCursor: boolean;
  prefix: string;
};

const SENTENCES = ['Welcome to Vue Bits! Good to see you!', 'Build some amazing experiences!'];
const WORDS = ['interfaces', 'products', 'experiences'];

const LOOK: Look = {
  cursorColor: 'currentColor',
  prefixColor: 'currentColor',
  typingSpeed: 75,
  deletingSpeed: 50,
  pauseDuration: 1500,
  mistakes: 0,
  typeEffect: 'none',
  cursorBlinkDuration: 0.5,
  variableSpeedEnabled: false,
  variableSpeedMin: 60,
  variableSpeedMax: 120,
  cursorGlide: true,
  cursorStyle: 'underscore',
  cursorCharacter: '_',
  deleteMode: 'backspace',
  showCursor: true,
  prefix: ''
};

const PRESETS: Record<string, Look> = {
  classic: { ...LOOK },
  human: {
    ...LOOK,
    cursorStyle: 'bar',
    typeEffect: 'fade',
    mistakes: 0.55,
    deletingSpeed: 35,
    pauseDuration: 2200,
    cursorBlinkDuration: 0.55,
    variableSpeedEnabled: true,
    variableSpeedMin: 40,
    variableSpeedMax: 170
  },
  editor: {
    ...LOOK,
    cursorStyle: 'block',
    typeEffect: 'blur',
    deleteMode: 'select',
    typingSpeed: 55,
    deletingSpeed: 22,
    pauseDuration: 2000,
    cursorBlinkDuration: 0.6
  },
  hero: {
    ...LOOK,
    prefix: 'We build ',
    prefixColor: '#868a87',
    cursorColor: '#ff5a36',
    cursorStyle: 'bar',
    typeEffect: 'rise',
    typingSpeed: 90,
    deletingSpeed: 40,
    pauseDuration: 1800
  }
};

const DEFAULT_PROPS = {
  preset: 'classic',
  ...LOOK
};

const PRESET_OPTIONS = [
  { value: 'classic', label: 'Classic' },
  { value: 'human', label: 'Human' },
  { value: 'editor', label: 'Editor' },
  { value: 'hero', label: 'Hero' }
];

const CURSOR_STYLE_OPTIONS = [
  { value: 'bar', label: 'Bar' },
  { value: 'block', label: 'Block' },
  { value: 'underscore', label: 'Underscore' },
  { value: 'character', label: 'Character' }
];

const CURSOR_OPTIONS = [
  { value: '_', label: 'Underscore (_)' },
  { value: '|', label: 'Pipe (|)' },
  { value: '▎', label: 'Block (▎)' },
  { value: '●', label: 'Dot (●)' },
  { value: '█', label: 'Full Block (█)' }
];

const EFFECT_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'fade', label: 'Fade' },
  { value: 'blur', label: 'Blur' },
  { value: 'rise', label: 'Rise' }
];

const DELETE_MODE_OPTIONS = [
  { value: 'backspace', label: 'Backspace' },
  { value: 'select', label: 'Select' }
];

const propData: PropRow[] = [
  {
    name: 'text',
    type: 'string | string[]',
    default: '-',
    description: 'A sentence, or a list of sentences typed one after another.'
  },
  {
    name: 'as',
    type: 'string',
    default: 'div',
    description: 'The element to render, such as h1 or span.'
  },
  {
    name: 'prefix',
    type: 'string',
    default: "''",
    description: 'Static text shown before the typed part, such as "We build " in front of rotating words.'
  },
  {
    name: 'prefixColor',
    type: 'string',
    default: "'currentColor'",
    description: 'Color of the prefix. Follows the surrounding text color by default.'
  },
  {
    name: 'typingSpeed',
    type: 'number',
    default: '50',
    description: 'Delay between typed characters, in ms.'
  },
  {
    name: 'initialDelay',
    type: 'number',
    default: '0',
    description: 'Wait before a sentence starts typing, in ms.'
  },
  {
    name: 'pauseDuration',
    type: 'number',
    default: '2000',
    description: 'How long a finished sentence stays before it is cleared, in ms.'
  },
  {
    name: 'deletingSpeed',
    type: 'number',
    default: '30',
    description: 'Delay between deleted characters, in ms. In select mode, how fast the highlight grows.'
  },
  {
    name: 'deleteMode',
    type: "'backspace' | 'select'",
    default: "'backspace'",
    description:
      'How a sentence is cleared: erased one character at a time, or highlighted like selected text and then removed at once.'
  },
  {
    name: 'typeEffect',
    type: "'none' | 'fade' | 'blur' | 'rise'",
    default: "'none'",
    description:
      'How each character appears as it is typed: instantly, fading in, sharpening from a blur, or rising into place.'
  },
  {
    name: 'mistakes',
    type: 'number',
    default: '0',
    description:
      'From 0 to 1. How often a wrong key is hit. The typo is noticed after a beat, erased, and corrected, like a person typing.'
  },
  {
    name: 'variableSpeed',
    type: '{min: number, max: number}',
    default: 'undefined',
    description: 'Types each character after a random delay between min and max ms, for a human feel.'
  },
  {
    name: 'loop',
    type: 'boolean',
    default: 'true',
    description: 'Starts over after the last sentence. When off, the last sentence stays.'
  },
  {
    name: 'showCursor',
    type: 'boolean',
    default: 'true',
    description: 'Shows a blinking cursor at the typing position.'
  },
  {
    name: 'cursorStyle',
    type: "'character' | 'bar' | 'block' | 'underscore'",
    default: "'character'",
    description:
      'Shape of the cursor. Bar, block and underscore are drawn to fit the font. Character uses cursorCharacter.'
  },
  {
    name: 'cursorCharacter',
    type: 'string',
    default: '|',
    description: 'Character used as the cursor when cursorStyle is character.'
  },
  {
    name: 'cursorColor',
    type: 'string',
    default: "'currentColor'",
    description: 'Color of the cursor. Follows the surrounding text color by default.'
  },
  {
    name: 'cursorBlinkDuration',
    type: 'number',
    default: '0.5',
    description: 'Half the length of one blink, in seconds. The cursor fades softly and stays solid while typing.'
  },
  {
    name: 'cursorGlide',
    type: 'boolean',
    default: 'true',
    description: 'Glides the cursor smoothly to each new position instead of jumping.'
  },
  {
    name: 'hideCursorWhileTyping',
    type: 'boolean',
    default: 'false',
    description: 'Fades the cursor out while characters are being typed or cleared.'
  },
  {
    name: 'cursorClassName',
    type: 'string',
    default: "''",
    description: 'Extra class names for the cursor.'
  },
  {
    name: 'className',
    type: 'string',
    default: "''",
    description: 'Extra class names for the root element.'
  },
  {
    name: 'textColors',
    type: 'string[]',
    default: '[]',
    description: 'Colors for the sentences, used in turn.'
  },
  {
    name: 'onSentenceComplete',
    type: '(sentence: string, index: number) => void',
    default: 'undefined',
    description: 'Called with the sentence and its index each time a sentence is cleared.'
  },
  {
    name: 'startOnVisible',
    type: 'boolean',
    default: 'false',
    description: 'Waits until the text scrolls into view before typing.'
  },
  {
    name: 'reverseMode',
    type: 'boolean',
    default: 'false',
    description: 'Reveals each sentence from its last character back to its first.'
  }
];

const { rerenderKey, forceRerender } = useForceRerender();
const { props, defaultProps, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);

const settings = computed(() => {
  const {
    preset: _preset,
    variableSpeedEnabled: _enabled,
    variableSpeedMin: _min,
    variableSpeedMax: _max,
    ...rest
  } = props.value;
  return rest;
});

const ink = useColorModeValue('#161816', '#ffffff');
const shown = (value: string) => (value === 'currentColor' ? ink.value : value);

const variableSpeed = computed(() =>
  props.value.variableSpeedEnabled
    ? { min: props.value.variableSpeedMin, max: props.value.variableSpeedMax }
    : undefined
);

const computedProps = computed(() => (variableSpeed.value ? { variableSpeed: variableSpeed.value } : {}));

const restart = <K extends keyof typeof DEFAULT_PROPS>(name: K, value: (typeof DEFAULT_PROPS)[K]) => {
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

<style>
.custom-text-type {
  font-size: clamp(1.5rem, 4vw, 4rem);
  font-weight: 700;
}
</style>
