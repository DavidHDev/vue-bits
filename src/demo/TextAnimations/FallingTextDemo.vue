<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
    :demo-only-props="['preset', 'size']"
    :computed-props="computedProps"
  >
    <TabsLayout>
      <template #preview>
        <div class="demo-container relative overflow-hidden" style="height: 460px; padding: 0">
          <FallingText
            :key="`${props.preset}-${rerenderKey}`"
            v-bind="settings"
            :text="text"
            :highlight-words="props.preset === 'letters' ? [] : HIGHLIGHTS"
            :font-size="`${props.size}rem`"
            :theme="theme"
            :style="{ color: ink }"
          />
          <RefreshButton @click="forceRerender" />
        </div>

        <Customize>
          <PreviewSelect
            title="Preset"
            :options="PRESET_OPTIONS"
            :model-value="props.preset"
            @update:model-value="value => applyPreset(String(value))"
          />
          <PreviewSelect
            title="Trigger"
            :options="TRIGGER_OPTIONS"
            :model-value="settings.trigger"
            @update:model-value="value => updateProp('trigger', value as Trigger)"
          />
          <PreviewSelect
            title="Variant"
            :options="VARIANT_OPTIONS"
            :model-value="settings.variant"
            @update:model-value="value => updateProp('variant', value as Variant)"
          />
          <PreviewSelect
            title="Split"
            :options="SPLIT_OPTIONS"
            :model-value="settings.split"
            @update:model-value="value => updateProp('split', value as Split)"
          />
          <PreviewSelect
            title="Order"
            :options="ORDER_OPTIONS"
            :model-value="settings.order"
            @update:model-value="value => updateProp('order', value as Order)"
          />
          <PreviewColorPickerCustom
            title="Accent Color"
            :color="settings.accentColor"
            @change="value => updateProp('accentColor', value)"
          />
          <PreviewSlider
            title="Font Size"
            :min="1"
            :max="4"
            :step="0.25"
            value-unit="rem"
            :model-value="props.size"
            @update:model-value="value => updateProp('size', value)"
          />
          <PreviewSlider
            title="Gravity"
            :min="0.2"
            :max="2.5"
            :step="0.05"
            :model-value="settings.gravity"
            @update:model-value="value => updateProp('gravity', value)"
          />
          <PreviewSlider
            title="Bounciness"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.bounciness"
            @update:model-value="value => updateProp('bounciness', value)"
          />
          <PreviewSlider
            title="Scatter"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.scatter"
            @update:model-value="value => updateProp('scatter', value)"
          />
          <PreviewSlider
            title="Stagger"
            :min="0"
            :max="0.2"
            :step="0.01"
            value-unit="s"
            :is-disabled="settings.order === 'together'"
            :model-value="settings.stagger"
            @update:model-value="value => updateProp('stagger', value)"
          />
          <PreviewSlider
            title="Cursor Push"
            :min="0"
            :max="1.5"
            :step="0.05"
            :model-value="settings.cursorPush"
            @update:model-value="value => updateProp('cursorPush', value)"
          />
          <PreviewSlider
            title="Drag Stiffness"
            :min="0.05"
            :max="1"
            :step="0.05"
            :is-disabled="!settings.draggable"
            :model-value="settings.mouseConstraintStiffness"
            @update:model-value="value => updateProp('mouseConstraintStiffness', value)"
          />
          <PreviewSlider
            title="Restore Delay"
            :min="0"
            :max="6"
            :step="0.5"
            value-unit="s"
            :model-value="settings.restoreDelay"
            @update:model-value="value => updateProp('restoreDelay', value)"
          />
          <PreviewSwitch
            title="Draggable"
            :model-value="settings.draggable"
            @update:model-value="value => updateProp('draggable', value)"
          />
          <PreviewSwitch
            title="Wireframes"
            :model-value="settings.wireframes"
            @update:model-value="value => updateProp('wireframes', value)"
          />
        </Customize>

        <PropTable :data="propData" />
        <Dependencies :dependency-list="['matter-js']" />
      </template>

      <template #code>
        <CodeExample :code-object="fallingText" component-name="FallingText" />
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
import { fallingText } from '@/constants/code/TextAnimations/fallingTextCode';
import FallingText from '@/content/TextAnimations/FallingText/FallingText.vue';

type Trigger = 'auto' | 'hover' | 'click' | 'scroll';
type Variant = 'text' | 'tiles';
type Split = 'words' | 'letters';
type Order = 'random' | 'sequence' | 'center' | 'together';

const SENTENCE = 'Some sentences are built to last. This one falls apart on contact.';
const HIGHLIGHTS = ['falls', 'apart'];

const FEEL = {
  trigger: 'hover' as Trigger,
  variant: 'text' as Variant,
  split: 'words' as Split,
  order: 'random' as Order,
  gravity: 1,
  bounciness: 0.2,
  scatter: 0.5,
  stagger: 0.03,
  cursorPush: 0.5,
  mouseConstraintStiffness: 0.2,
  restoreDelay: 2,
  size: 2
};

const DEFAULT_PROPS = {
  preset: 'classic',
  ...FEEL,
  accentColor: '#5b8cff',
  draggable: true,
  wireframes: false
};

type DemoProps = typeof DEFAULT_PROPS;

const PRESETS: Record<string, Partial<DemoProps>> = {
  classic: {},
  tiles: { variant: 'tiles', size: 1.5, bounciness: 0.15 },
  letters: { split: 'letters', size: 3.25, order: 'sequence', stagger: 0.035, scatter: 0.8 },
  domino: { order: 'sequence', stagger: 0.12, scatter: 0.2, bounciness: 0.1 },
  bouncy: { bounciness: 0.7, scatter: 1, gravity: 1.3, cursorPush: 1 }
};

const PRESET_TEXT: Record<string, string> = { letters: 'Gravity always wins' };

const PRESET_OPTIONS = [
  { value: 'classic', label: 'Classic' },
  { value: 'tiles', label: 'Tiles' },
  { value: 'letters', label: 'Letters' },
  { value: 'domino', label: 'Domino' },
  { value: 'bouncy', label: 'Bouncy' }
];

const TRIGGER_OPTIONS = [
  { value: 'hover', label: 'Hover' },
  { value: 'click', label: 'Click' },
  { value: 'auto', label: 'Auto' },
  { value: 'scroll', label: 'Scroll' }
];

const VARIANT_OPTIONS = [
  { value: 'text', label: 'Text' },
  { value: 'tiles', label: 'Tiles' }
];

const SPLIT_OPTIONS = [
  { value: 'words', label: 'Words' },
  { value: 'letters', label: 'Letters' }
];

const ORDER_OPTIONS = [
  { value: 'random', label: 'Random' },
  { value: 'sequence', label: 'Sequence' },
  { value: 'center', label: 'Center' },
  { value: 'together', label: 'Together' }
];

const propData: PropRow[] = [
  { name: 'text', type: 'string', default: "''", description: 'The text that falls apart.' },
  {
    name: 'highlightWords',
    type: 'string[]',
    default: '[]',
    description:
      'Words that start with any of these strings get the accent color, or the accent tile in the tiles variant.'
  },
  {
    name: 'highlightClass',
    type: 'string',
    default: "'highlighted'",
    description: 'Extra class added to highlighted words.'
  },
  {
    name: 'trigger',
    type: "'auto' | 'hover' | 'click' | 'scroll'",
    default: "'auto'",
    description: 'What starts the fall. Scroll starts it when the text scrolls into view.'
  },
  {
    name: 'variant',
    type: "'text' | 'tiles'",
    default: "'text'",
    description: 'Plain falling text, or words on tiles that stack like blocks.'
  },
  {
    name: 'split',
    type: "'words' | 'letters'",
    default: "'words'",
    description: 'Whether whole words or single letters fall.'
  },
  {
    name: 'order',
    type: "'random' | 'sequence' | 'center' | 'together'",
    default: "'random'",
    description: 'Which pieces drop first. Falling pieces knock loose the ones they land on.'
  },
  {
    name: 'stagger',
    type: 'number',
    default: '0.03',
    description: 'Delay between pieces dropping, in seconds.'
  },
  { name: 'gravity', type: 'number', default: '1', description: 'Strength of gravity. Negative values fall upward.' },
  {
    name: 'bounciness',
    type: 'number',
    default: '0.2',
    description: 'How much pieces bounce when they land, from 0 to 1.'
  },
  {
    name: 'scatter',
    type: 'number',
    default: '0.5',
    description: 'How much spin and sideways push each piece gets as it drops, from 0 to 1.'
  },
  { name: 'draggable', type: 'boolean', default: 'true', description: 'Lets people pick up, drag and throw pieces.' },
  {
    name: 'mouseConstraintStiffness',
    type: 'number',
    default: '0.2',
    description: 'How tightly a dragged piece follows the pointer, from 0 to 1.'
  },
  {
    name: 'cursorPush',
    type: 'number',
    default: '0.5',
    description: 'How hard a quick swipe knocks the fallen pieces around. 0 turns it off.'
  },
  {
    name: 'restoreDelay',
    type: 'number',
    default: '0',
    description:
      'Seconds after the pile settles, with the pointer away, before the text flies back into place and can fall again. 0 keeps it fallen.'
  },
  { name: 'fontSize', type: 'string', default: "'1rem'", description: 'Font size of the text.' },
  {
    name: 'accentColor',
    type: 'string',
    default: "'#5b8cff'",
    description: 'Color of highlighted words, or of their tiles in the tiles variant.'
  },
  { name: 'theme', type: "'dark' | 'light'", default: "'dark'", description: 'Color theme of the tiles.' },
  {
    name: 'backgroundColor',
    type: 'string',
    default: "'transparent'",
    description: 'Background of the area the text falls into.'
  },
  {
    name: 'wireframes',
    type: 'boolean',
    default: 'false',
    description: 'Outlines each piece to show its physics shape.'
  },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the container.' },
  { name: 'style', type: 'CSSProperties', default: '-', description: 'Inline styles for the container.' }
];

const { rerenderKey, forceRerender } = useForceRerender();
const { props, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);
const settings = computed(() => {
  const { preset: _preset, size: _size, ...rest } = props.value;
  void _preset;
  void _size;
  return rest;
});
const theme = useColorModeValue<'light' | 'dark'>('light', 'dark');
const ink = useColorModeValue('#161816', '#f4f5f4');
const text = computed(() => PRESET_TEXT[props.value.preset] ?? SENTENCE);

const computedProps = computed(() => ({
  fontSize: `${props.value.size}rem`,
  ...(theme.value === 'light' ? { theme: 'light' } : {})
}));

const applyPreset = (value: string) => {
  updateProps({ ...DEFAULT_PROPS, ...PRESETS[value], accentColor: settings.value.accentColor, preset: value });
};
</script>
