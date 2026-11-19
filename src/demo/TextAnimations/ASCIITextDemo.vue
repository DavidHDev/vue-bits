<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
    :demo-only-props="['preset']"
    :computed-props="computedProps"
  >
    <TabsLayout>
      <template #preview>
        <div class="demo-container relative overflow-hidden" style="height: 440px">
          <ASCIIText v-bind="settings" :theme="theme" />
        </div>

        <Customize>
          <PreviewColorList
            title="Colors"
            :min="1"
            :max="3"
            :model-value="props.colors"
            @update:model-value="value => updateProp('colors', value)"
          />
          <PreviewSelect
            title="Preset"
            :options="PRESET_OPTIONS"
            :model-value="props.preset"
            @update:model-value="value => applyPreset(String(value))"
          />
          <PreviewInput
            title="Text"
            placeholder="Enter text..."
            :width="200"
            :max-length="12"
            :model-value="props.text"
            @update:model-value="value => updateProp('text', value)"
          />
          <PreviewInput
            title="Characters"
            placeholder=" .:-=+*#%@"
            :width="200"
            :max-length="80"
            :model-value="props.charset"
            @update:model-value="value => updateProp('charset', value)"
          />
          <PreviewSlider
            title="Cell Size"
            :min="4"
            :max="24"
            :step="1"
            value-unit="px"
            :model-value="props.asciiFontSize"
            @update:model-value="value => updateProp('asciiFontSize', value)"
          />
          <PreviewSlider
            title="Text Scale"
            :min="0.4"
            :max="2"
            :step="0.05"
            :model-value="props.textScale"
            @update:model-value="value => updateProp('textScale', value)"
          />
          <PreviewSlider
            title="Blocks"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.blocks"
            @update:model-value="value => updateProp('blocks', value)"
          />
          <PreviewSlider
            title="Waves"
            :min="0"
            :max="2"
            :step="0.05"
            :model-value="props.waves"
            @update:model-value="value => updateProp('waves', value)"
          />
          <PreviewSlider
            title="Wave Speed"
            :min="0"
            :max="3"
            :step="0.05"
            :model-value="props.waveSpeed"
            @update:model-value="value => updateProp('waveSpeed', value)"
          />
          <PreviewSlider
            title="Chroma"
            :min="0"
            :max="3"
            :step="0.05"
            :model-value="props.chroma"
            @update:model-value="value => updateProp('chroma', value)"
          />
          <PreviewSlider
            title="Tilt"
            :min="0"
            :max="2"
            :step="0.05"
            :model-value="props.tilt"
            @update:model-value="value => updateProp('tilt', value)"
          />
          <PreviewSlider
            title="Hue Shift"
            :min="0"
            :max="2"
            :step="0.05"
            :model-value="props.hueShift"
            @update:model-value="value => updateProp('hueShift', value)"
          />
          <PreviewSlider
            title="Scramble"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.scramble"
            @update:model-value="value => updateProp('scramble', value)"
          />
          <PreviewSwitch
            title="Click Ripple"
            :model-value="props.clickRipple"
            @update:model-value="value => updateProp('clickRipple', value)"
          />
          <PreviewSwitch
            title="Idle Sway"
            :model-value="props.idle"
            @update:model-value="value => updateProp('idle', value)"
          />
          <PreviewSwitch
            title="Interactive"
            :model-value="props.interactive"
            @update:model-value="value => updateProp('interactive', value)"
          />
        </Customize>

        <PropTable :data="propData" />
      </template>

      <template #code>
        <CodeExample :code-object="asciiText" component-name="ASCIIText" />
      </template>
    </TabsLayout>
  </ComponentPropsProvider>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import CodeExample from '@/components/common/CodeExample.vue';
import Customize from '@/components/common/Customize.vue';
import PreviewColorList from '@/components/common/PreviewColorList.vue';
import PreviewInput from '@/components/common/PreviewInput.vue';
import PreviewSelect from '@/components/common/PreviewSelect.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import ComponentPropsProvider from '@/components/context/ComponentPropsProvider.vue';
import { useComponentProps } from '@/composables/useComponentProps';
import { useColorModeValue } from '@/composables/useTheme';
import { asciiText } from '@/constants/code/TextAnimations/asciiTextCode';
import ASCIIText from '@/content/TextAnimations/ASCIIText/ASCIIText.vue';

const CLASSIC = ' .\'`^",:;Il!i~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$';

const DEFAULT_PROPS = {
  preset: 'classic',
  text: 'Hey!',
  charset: CLASSIC,
  colors: ['#ff6188', '#fc9867', '#ffd866'],
  asciiFontSize: 8,
  textScale: 1,
  blocks: 0.9,
  waves: 1,
  waveSpeed: 1,
  chroma: 1,
  tilt: 1,
  hueShift: 1,
  scramble: 0.6,
  clickRipple: true,
  idle: true,
  interactive: true
};

type DemoProps = typeof DEFAULT_PROPS;

const PRESETS: Record<string, Partial<DemoProps>> = {
  classic: {},
  terminal: {
    charset: ' .:-=+*#%@',
    colors: ['#b8f5c8', '#5ee08a', '#1f9d55'],
    blocks: 0,
    chroma: 0.3,
    hueShift: 0,
    asciiFontSize: 10
  },
  blocks: { charset: ' ░▒▓█', colors: ['#ffffff', '#d4d4d8', '#a1a1aa'], blocks: 0.2, hueShift: 0, chroma: 0.6 },
  binary: { charset: ' 01', colors: ['#ffffff', '#bae6fd', '#38bdf8'], blocks: 0.35, hueShift: 0.4, asciiFontSize: 9 },
  mono: { colors: ['#ffffff', '#e4e4e7', '#a1a1aa'], blocks: 0.15, chroma: 0, hueShift: 0, waves: 0.6 }
};

const PRESET_OPTIONS = [
  { value: 'classic', label: 'Classic' },
  { value: 'terminal', label: 'Terminal' },
  { value: 'blocks', label: 'Blocks' },
  { value: 'binary', label: 'Binary' },
  { value: 'mono', label: 'Mono' }
];

const propData: PropRow[] = [
  { name: 'text', type: 'string', default: "'Hey!'", description: 'Text rendered in ASCII.' },
  {
    name: 'asciiFontSize',
    type: 'number',
    default: '8',
    description: 'Height of each character cell in pixels. Smaller cells give finer detail.'
  },
  {
    name: 'charset',
    type: 'string',
    default: "' .'`^\",:;Il!i~+_-?][}{1)(|/...'",
    description: 'Characters from darkest to brightest. Any string works, including Unicode blocks.'
  },
  {
    name: 'colors',
    type: 'string[]',
    default: "['#ff6188', '#fc9867', '#ffd866']",
    description: 'Gradient for the characters, from the center outward. Up to three colors.'
  },
  { name: 'textColor', type: 'string', default: "'#fdf9f3'", description: 'Color of the text behind the characters.' },
  {
    name: 'fontFamily',
    type: 'string',
    default: "'IBM Plex Mono', ui-monospace, ...",
    description: 'Font for the text and the characters.'
  },
  { name: 'fontWeight', type: 'number', default: '600', description: 'Weight of the rendered text.' },
  { name: 'textScale', type: 'number', default: '1', description: 'Size of the text relative to the container.' },
  {
    name: 'blocks',
    type: 'number',
    default: '0.9',
    description: 'Opacity of the colored pixel blocks under the characters, from 0 to 1.'
  },
  { name: 'waves', type: 'number', default: '1', description: 'Strength of the wavy motion. 0 keeps the text flat.' },
  { name: 'waveSpeed', type: 'number', default: '1', description: 'Speed of the wavy motion.' },
  { name: 'chroma', type: 'number', default: '1', description: 'Amount of color fringing around the letters.' },
  { name: 'tilt', type: 'number', default: '1', description: 'How far the text turns toward the pointer.' },
  {
    name: 'hueShift',
    type: 'number',
    default: '1',
    description: 'Rotates the hue as the pointer circles the text. 0 keeps the colors fixed.'
  },
  {
    name: 'scramble',
    type: 'number',
    default: '0.6',
    description: 'Size and strength of the glitchy scramble under the pointer, from 0 to 1.'
  },
  {
    name: 'clickRipple',
    type: 'boolean',
    default: 'true',
    description: 'Sends a ring of characters across the canvas from where you click.'
  },
  {
    name: 'intro',
    type: 'boolean',
    default: 'true',
    description: 'Decodes the text out of random characters on load.'
  },
  { name: 'idle', type: 'boolean', default: 'true', description: 'Sways the text gently when nobody interacts.' },
  {
    name: 'interactive',
    type: 'boolean',
    default: 'true',
    description: 'Reacts to the pointer with tilt, hue, scramble and ripples.'
  },
  {
    name: 'theme',
    type: "'dark' | 'light'",
    default: "'dark'",
    description: 'Light inverts the colors so the effect works on white pages.'
  },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the container.' },
  { name: 'style', type: 'CSSProperties', default: '-', description: 'Inline styles for the container.' }
];

const { props, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);
const themeValue = useColorModeValue('light', 'dark');
const theme = computed(() => themeValue.value as 'light' | 'dark');

const settings = computed(() => {
  const { preset: _preset, ...rest } = props.value;
  return rest;
});

const applyPreset = (value: string) => {
  updateProps({ ...DEFAULT_PROPS, ...PRESETS[value], text: props.value.text, preset: value });
};

const computedProps = computed(() => (theme.value === 'light' ? { theme: 'light' } : {}));
</script>
