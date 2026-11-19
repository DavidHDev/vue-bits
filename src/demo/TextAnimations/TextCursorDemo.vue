<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
    :demo-only-props="['preset', 'textColor']"
    :computed-props="computedProps"
  >
    <TabsLayout>
      <template #preview>
        <div class="demo-container relative overflow-hidden" style="height: 460px; padding: 0">
          <p
            class="absolute bottom-5 left-1/2 m-0 -translate-x-1/2 text-sm select-none pointer-events-none"
            style="color: var(--text-dimmed)"
          >
            Move around
          </p>
          <TextCursor v-bind="settings" :color="props.textColor || 'currentColor'" />
        </div>

        <Customize>
          <PreviewSelect
            title="Preset"
            :options="PRESET_OPTIONS"
            :model-value="props.preset"
            @update:model-value="value => applyPreset(String(value))"
          />
          <PreviewInput
            title="Text"
            placeholder="Enter text..."
            :width="180"
            :max-length="40"
            :model-value="settings.text"
            @update:model-value="value => updateProp('text', value)"
          />
          <PreviewColorPickerCustom
            title="Color"
            :color="props.textColor || ink"
            @change="value => updateProp('textColor', value)"
          />
          <PreviewSelect
            title="Mode"
            :options="MODE_OPTIONS"
            :model-value="settings.mode"
            @update:model-value="value => updateProp('mode', value as Mode)"
          />
          <PreviewSlider
            title="Font Size"
            :min="12"
            :max="72"
            :step="1"
            value-unit="px"
            :model-value="settings.fontSize"
            @update:model-value="value => updateProp('fontSize', value)"
          />
          <PreviewSlider
            title="Spacing"
            :min="0"
            :max="200"
            :step="1"
            value-unit="px"
            :model-value="settings.spacing"
            @update:model-value="value => updateProp('spacing', value)"
          />
          <PreviewSlider
            title="Max Points"
            :min="1"
            :max="30"
            :step="1"
            :model-value="settings.maxPoints"
            @update:model-value="value => updateProp('maxPoints', value)"
          />
          <PreviewSlider
            title="Shrink"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.shrink"
            @update:model-value="value => updateProp('shrink', value)"
          />
          <PreviewSlider
            title="Fade"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.fade"
            @update:model-value="value => updateProp('fade', value)"
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
            title="Exit Duration"
            :min="0.1"
            :max="2"
            :step="0.05"
            value-unit="s"
            :model-value="settings.exitDuration"
            @update:model-value="value => updateProp('exitDuration', value)"
          />
          <PreviewSlider
            title="Removal Interval"
            :min="5"
            :max="200"
            :step="5"
            value-unit="ms"
            :model-value="settings.removalInterval"
            @update:model-value="value => updateProp('removalInterval', value)"
          />
          <PreviewSwitch
            title="Follow Mouse Direction"
            :model-value="settings.followMouseDirection"
            @update:model-value="value => updateProp('followMouseDirection', value)"
          />
          <PreviewSwitch
            title="Keep Upright"
            :model-value="settings.keepUpright"
            @update:model-value="value => updateProp('keepUpright', value)"
          />
          <PreviewSwitch
            title="Random Float"
            :model-value="settings.randomFloat"
            @update:model-value="value => updateProp('randomFloat', value)"
          />
          <PreviewSwitch
            title="Pop In"
            :model-value="settings.popIn"
            @update:model-value="value => updateProp('popIn', value)"
          />
          <PreviewSwitch
            title="Hide Cursor"
            :model-value="settings.hideCursor"
            @update:model-value="value => updateProp('hideCursor', value)"
          />
        </Customize>

        <PropTable :data="propData" />
      </template>

      <template #code>
        <CodeExample :code-object="textCursor" component-name="TextCursor" />
      </template>
    </TabsLayout>
  </ComponentPropsProvider>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import CodeExample from '@/components/common/CodeExample.vue';
import Customize from '@/components/common/Customize.vue';
import PreviewColorPickerCustom from '@/components/common/PreviewColorPickerCustom.vue';
import PreviewInput from '@/components/common/PreviewInput.vue';
import PreviewSelect from '@/components/common/PreviewSelect.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import ComponentPropsProvider from '@/components/context/ComponentPropsProvider.vue';
import { useComponentProps } from '@/composables/useComponentProps';
import { useColorModeValue } from '@/composables/useTheme';
import { textCursor } from '@/constants/code/TextAnimations/textCursorCode';
import TextCursor from '@/content/TextAnimations/TextCursor/TextCursor.vue';

type Mode = 'stamp' | 'chain' | 'ribbon';

type Look = {
  text: string;
  mode: Mode;
  fontSize: number;
  spacing: number;
  maxPoints: number;
  shrink: number;
  fade: number;
  smoothing: number;
  exitDuration: number;
  removalInterval: number;
  followMouseDirection: boolean;
  keepUpright: boolean;
  randomFloat: boolean;
  popIn: boolean;
};

const LOOK: Look = {
  text: 'Hello',
  mode: 'stamp',
  fontSize: 28,
  spacing: 88,
  maxPoints: 7,
  shrink: 0.5,
  fade: 0.6,
  smoothing: 0.3,
  exitDuration: 0.5,
  removalInterval: 30,
  followMouseDirection: true,
  keepUpright: true,
  randomFloat: true,
  popIn: true
};

const PRESETS: Record<string, Look> = {
  words: { ...LOOK },
  emoji: { ...LOOK, text: '✨', fontSize: 30, spacing: 46, maxPoints: 10, shrink: 0.6, fade: 0.5 },
  chain: {
    ...LOOK,
    text: '→',
    mode: 'chain',
    fontSize: 24,
    spacing: 22,
    maxPoints: 18,
    shrink: 0.55,
    fade: 0.75,
    randomFloat: false
  },
  ribbon: {
    ...LOOK,
    text: 'Vue Bits follows your cursor ✦ ',
    mode: 'ribbon',
    fontSize: 26,
    spacing: 1,
    shrink: 0.35,
    fade: 0.7,
    smoothing: 0.4
  }
};

const DEFAULT_PROPS = {
  preset: 'words',
  ...LOOK,
  textColor: '',
  hideCursor: false
};

const PRESET_OPTIONS = [
  { value: 'words', label: 'Words' },
  { value: 'emoji', label: 'Emoji' },
  { value: 'chain', label: 'Chain' },
  { value: 'ribbon', label: 'Ribbon' }
];

const MODE_OPTIONS = [
  { value: 'stamp', label: 'Stamp' },
  { value: 'chain', label: 'Chain' },
  { value: 'ribbon', label: 'Ribbon' }
];

const propData: PropRow[] = [
  { name: 'text', type: 'string', default: "'Hello'", description: 'The text or emoji the trail is made of.' },
  {
    name: 'mode',
    type: "'stamp' | 'chain' | 'ribbon'",
    default: "'stamp'",
    description:
      'Stamp leaves copies along the path, chain makes copies follow each other like a snake, and ribbon lays the letters along the path.'
  },
  {
    name: 'spacing',
    type: 'number',
    default: '88',
    description: 'Distance between copies, in px. In ribbon mode, extra space between letters.'
  },
  {
    name: 'maxPoints',
    type: 'number',
    default: '7',
    description: 'Most copies shown at once in stamp and chain modes.'
  },
  { name: 'color', type: 'string', default: "'currentColor'", description: 'Color of the text.' },
  { name: 'fontSize', type: 'number', default: '28', description: 'Font size of the text, in px.' },
  { name: 'fontWeight', type: 'number | string', default: '600', description: 'Font weight of the text.' },
  { name: 'fontFamily', type: 'string', default: "'inherit'", description: 'Font family of the text.' },
  {
    name: 'shrink',
    type: 'number',
    default: '0.5',
    description: 'How much smaller the trail gets toward its end, from 0 to 1.'
  },
  {
    name: 'fade',
    type: 'number',
    default: '0.6',
    description: 'How much the trail fades toward its end, from 0 to 1.'
  },
  {
    name: 'smoothing',
    type: 'number',
    default: '0.3',
    description: 'Softens the path the trail follows, from 0 to 1. Higher values lag a little behind the cursor.'
  },
  {
    name: 'followMouseDirection',
    type: 'boolean',
    default: 'true',
    description: 'Turns the text to face the direction the cursor moves.'
  },
  {
    name: 'randomFloat',
    type: 'boolean',
    default: 'true',
    description: 'Lets stamped copies sway gently, and makes chains and ribbons ripple.'
  },
  { name: 'popIn', type: 'boolean', default: 'true', description: 'Makes new copies pop in with a little overshoot.' },
  {
    name: 'keepUpright',
    type: 'boolean',
    default: 'true',
    description: 'In stamp mode, keeps copies from turning upside down when the cursor moves left.'
  },
  {
    name: 'exitDuration',
    type: 'number',
    default: '0.5',
    description: 'How long a stamped copy takes to shrink away, in seconds.'
  },
  {
    name: 'removalInterval',
    type: 'number',
    default: '30',
    description: 'How quickly the trail pulls back into the cursor once it stops, in ms per copy.'
  },
  { name: 'hideCursor', type: 'boolean', default: 'false', description: 'Hides the system cursor over the element.' },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the container.' },
  { name: 'style', type: 'CSSProperties', default: '-', description: 'Inline styles for the container.' }
];

const { props, defaultProps, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);
const settings = computed(() => {
  const { preset: _preset, textColor: _textColor, ...rest } = props.value;
  return rest;
});
const ink = useColorModeValue('#161816', '#ffffff');

const applyPreset = (value: string) => {
  const base = Object.fromEntries(
    (Object.keys(LOOK) as (keyof Look)[]).map(name => [name, defaultProps.value[name]])
  ) as Partial<typeof DEFAULT_PROPS>;
  updateProps({ ...base, ...PRESETS[value], preset: value });
};

const computedProps = computed(() => (props.value.textColor ? { color: props.value.textColor } : {}));
</script>
