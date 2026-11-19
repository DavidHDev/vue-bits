<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
    :demo-only-props="['preset', 'font', 'charset']"
    :computed-props="computedProps"
  >
    <TabsLayout>
      <template #preview>
        <div class="demo-container relative overflow-hidden" style="height: 500px; padding: 0">
          <LetterGlitch :key="rerenderKey" v-bind="settings" :font-family="fontFamily" :characters="characters" />
          <BackgroundContent headline="Am I finally a real hacker now, mom?" />
          <RefreshButton @click="forceRerender" />
        </div>

        <Customize>
          <PreviewColorList
            title="Glitch Colors"
            :min="1"
            :max="8"
            :model-value="settings.glitchColors"
            @update:model-value="(value: string[]) => updateProp('glitchColors', value)"
          />
          <PreviewSelect
            title="Preset"
            :options="PRESET_OPTIONS"
            :model-value="props.preset"
            @update:model-value="(value: string | number) => applyPreset(String(value))"
          />
          <PreviewSelect
            title="Font"
            :options="FONT_OPTIONS"
            :model-value="props.font"
            @update:model-value="(value: string | number) => updateProp('font', String(value))"
          />
          <PreviewSelect
            title="Characters"
            :options="CHARACTER_OPTIONS"
            :model-value="props.charset"
            @update:model-value="(value: string | number) => updateProp('charset', String(value))"
          />
          <PreviewColorPickerCustom
            title="Base Color"
            :color="settings.baseColor"
            @change="(value: string) => updateProp('baseColor', value)"
          />
          <PreviewSelect
            title="Click Effect"
            :options="CLICK_OPTIONS"
            :model-value="settings.clickEffect"
            @update:model-value="(value: string | number) => updateProp('clickEffect', value as ClickEffect)"
          />
          <PreviewSlider
            title="Font Size"
            :min="8"
            :max="32"
            :step="1"
            value-unit="px"
            :model-value="settings.fontSize"
            @update:model-value="(value: number) => updateProp('fontSize', value)"
          />
          <PreviewSlider
            title="Spacing"
            :min="0"
            :max="2"
            :step="0.05"
            :model-value="settings.spacing"
            @update:model-value="(value: number) => updateProp('spacing', value)"
          />
          <PreviewSlider
            title="Density"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.density"
            @update:model-value="(value: number) => updateProp('density', value)"
          />
          <PreviewSlider
            title="Base Opacity"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.baseOpacity"
            @update:model-value="(value: number) => updateProp('baseOpacity', value)"
          />
          <PreviewSlider
            title="Glitch Amount"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.glitchAmount"
            @update:model-value="(value: number) => updateProp('glitchAmount', value)"
          />
          <PreviewSlider
            title="Speed"
            :min="0"
            :max="3"
            :step="0.05"
            :model-value="settings.speed"
            @update:model-value="(value: number) => updateProp('speed', value)"
          />
          <PreviewSlider
            title="Flow"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.flow"
            @update:model-value="(value: number) => updateProp('flow', value)"
          />
          <PreviewSlider
            title="Cursor Radius"
            :min="40"
            :max="400"
            :step="5"
            value-unit="px"
            :is-disabled="!settings.interactive"
            :model-value="settings.cursorRadius"
            @update:model-value="(value: number) => updateProp('cursorRadius', value)"
          />
          <PreviewSlider
            title="Edge Fade"
            :min="0"
            :max="0.5"
            :step="0.01"
            :model-value="settings.edgeFade"
            @update:model-value="(value: number) => updateProp('edgeFade', value)"
          />
          <PreviewSlider
            title="Center Fade"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.centerFade"
            @update:model-value="(value: number) => updateProp('centerFade', value)"
          />
          <PreviewSwitch
            title="Smooth"
            :model-value="settings.smooth"
            @update:model-value="(value: boolean) => updateProp('smooth', value)"
          />
          <PreviewSwitch
            title="Interactive"
            :model-value="settings.interactive"
            @update:model-value="(value: boolean) => updateProp('interactive', value)"
          />
          <PreviewSwitch
            title="Intro"
            :model-value="settings.intro"
            @update:model-value="(value: boolean) => updateProp('intro', value)"
          />
          <PreviewSwitch
            title="Light Mode"
            :model-value="settings.lightMode"
            @update:model-value="(value: boolean) => updateProp('lightMode', value)"
          />
        </Customize>

        <PropTable :data="propData" />
      </template>

      <template #code>
        <CodeExample :code-object="letterGlitch" component-name="LetterGlitch" />
      </template>
    </TabsLayout>
  </ComponentPropsProvider>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import BackgroundContent from '@/components/common/BackgroundContent.vue';
import CodeExample from '@/components/common/CodeExample.vue';
import Customize from '@/components/common/Customize.vue';
import PreviewColorList from '@/components/common/PreviewColorList.vue';
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
import { letterGlitch } from '@/constants/code/Backgrounds/letterGlitchCode';
import LetterGlitch from '@/content/Backgrounds/LetterGlitch/LetterGlitch.vue';
import { DEFAULT_PROPS, PRESET_OPTIONS, presetProps } from './presets/LetterGlitch';

type ClickEffect = 'tear' | 'burst' | 'none';

const FONTS: Record<string, string> = {
  system: '',
  geist: "'Geist Mono', ui-monospace, monospace",
  code: "'Google Sans Code', ui-monospace, monospace",
  pixel: "'Press Start 2P', ui-monospace, monospace"
};

const FONT_OPTIONS = [
  { value: 'system', label: 'System Mono' },
  { value: 'geist', label: 'Geist Mono' },
  { value: 'code', label: 'Google Sans Code' },
  { value: 'pixel', label: 'Press Start 2P' }
];

const CHARACTER_SETS: Record<string, string> = {
  classic: '',
  letters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  binary: '01',
  hex: '0123456789ABCDEF',
  symbols: '!@#$%&*+-=/|<>[]{}()~^:;.,?',
  braille: '⠁⠃⠉⠙⠑⠋⠛⠓⠊⠚⠅⠇⠍⠝⠕⠏⠟⠗⠎⠞⠥⠧⠺⠭⠽⠵'
};

const CHARACTER_OPTIONS = [
  { value: 'classic', label: 'Classic' },
  { value: 'letters', label: 'Letters' },
  { value: 'binary', label: 'Binary' },
  { value: 'hex', label: 'Hex' },
  { value: 'symbols', label: 'Symbols' },
  { value: 'braille', label: 'Braille' }
];

const CLICK_OPTIONS = [
  { value: 'tear', label: 'Tear' },
  { value: 'burst', label: 'Burst' },
  { value: 'none', label: 'None' }
];

const { rerenderKey, forceRerender } = useForceRerender();
const { props, defaultProps, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);
const light = useColorModeValue(true, false);

const settings = computed(() => {
  const { preset: _preset, font: _font, charset: _charset, ...rest } = props.value;
  void _preset;
  void _font;
  void _charset;
  return rest;
});

const fontFamily = computed(() => FONTS[props.value.font] || undefined);
const characters = computed(() => CHARACTER_SETS[props.value.charset] || undefined);

const computedProps = computed(() => ({
  ...(fontFamily.value ? { fontFamily: fontFamily.value } : {}),
  ...(characters.value ? { characters: characters.value } : {})
}));

const applyPreset = (value: string) => {
  updateProps({ ...presetProps(value, { light: light.value, defaults: defaultProps.value }), preset: value });
};

const propData: PropRow[] = [
  {
    name: 'glitchColors',
    type: 'string[]',
    default: "['#ffffff', '#61dca3']",
    description: 'Up to 8 colors that glitching letters light up in. Light mode defaults to dark ink tones.'
  },
  {
    name: 'baseColor',
    type: 'string',
    default: "'#ffffff'",
    description: 'Color of the letters at rest. Light mode defaults to near black.'
  },
  {
    name: 'characters',
    type: 'string',
    default: "'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$&*()-_+=/[]{};:<>.,0123456789'",
    description: 'Characters to draw. Repeat a character to make it appear more often.'
  },
  {
    name: 'fontFamily',
    type: 'string',
    default: "'ui-monospace, ...'",
    description: 'CSS font family for the letters. Web fonts are drawn once they have loaded.'
  },
  { name: 'fontSize', type: 'number', default: '14', description: 'Size of the letters in pixels.' },
  {
    name: 'spacing',
    type: 'number',
    default: '0.6',
    description: 'Room around each letter relative to the font size. 0 packs them like lines of text.'
  },
  {
    name: 'density',
    type: 'number',
    default: '0.9',
    description:
      'Share of the grid that shows a letter at rest, from 0 to 1. Empty cells still flicker when they glitch.'
  },
  {
    name: 'baseOpacity',
    type: 'number',
    default: '0.16',
    description: 'Opacity of the letters at rest, from 0 to 1.'
  },
  {
    name: 'glitchAmount',
    type: 'number',
    default: '0.5',
    description: 'How often letters glitch, from 0 (never) to 1 (constantly).'
  },
  {
    name: 'speed',
    type: 'number',
    default: '1',
    description: 'Tempo of the scrambling and glitches. 0 freezes the letters.'
  },
  {
    name: 'flow',
    type: 'number',
    default: '0.5',
    description: 'Strength of the soft waves of light that drift across the letters, from 0 to 1.'
  },
  {
    name: 'smooth',
    type: 'boolean',
    default: 'true',
    description: 'Fades glitching letters in and out. When off, they flicker on and off instantly.'
  },
  {
    name: 'interactive',
    type: 'boolean',
    default: 'true',
    description: 'Lights up and scrambles the letters near the cursor, leaving a trail of glitches when it moves.'
  },
  {
    name: 'cursorRadius',
    type: 'number',
    default: '140',
    description: 'Radius of the area around the cursor that reacts, in pixels.'
  },
  {
    name: 'clickEffect',
    type: "'tear' | 'burst' | 'none'",
    default: "'tear'",
    description: 'What a click does. Tear rips a horizontal glitch through the rows, burst sends glitches outward.'
  },
  {
    name: 'edgeFade',
    type: 'number',
    default: '0',
    description: 'Fades the letters out toward the edges, from 0 to 0.5.'
  },
  {
    name: 'centerFade',
    type: 'number',
    default: '0',
    description: 'Clears the letters behind the middle of the container to keep content readable, from 0 to 1.'
  },
  { name: 'intro', type: 'boolean', default: 'true', description: 'Boots the letters in with a flicker on mount.' },
  {
    name: 'lightMode',
    type: 'boolean',
    default: 'false',
    description: 'Switches the default colors to dark ink for light backgrounds.'
  },
  {
    name: 'backgroundColor',
    type: 'string',
    default: '-',
    description: 'Paints an opaque background behind the letters. Leave it unset for a transparent canvas.'
  },
  { name: 'dpr', type: 'number', default: 'auto', description: 'Maximum device pixel ratio, capped at 2.' },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the container.' },
  { name: 'style', type: 'CSSProperties', default: '-', description: 'Inline styles for the container.' }
];
</script>
