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
        <div class="demo-container relative overflow-hidden" style="height: 500px; padding: 0">
          <FaultyTerminal :key="rerenderKey" v-bind="settings" />
          <BackgroundContent headline="It works on my machine, please check again" />
          <RefreshButton @click="forceRerender" />
        </div>

        <Customize>
          <PreviewSelect
            title="Preset"
            :options="PRESET_OPTIONS"
            :model-value="props.preset"
            @update:model-value="(value: string | number) => applyPreset(String(value))"
          />
          <PreviewColorPickerCustom
            title="Tint"
            :color="settings.tint"
            @change="(value: string) => updateProp('tint', value)"
          />
          <PreviewSelect
            title="Glyphs"
            :options="GLYPH_OPTIONS"
            :model-value="settings.glyphs"
            @update:model-value="(value: string | number) => updateProp('glyphs', value as FaultyTerminalGlyphs)"
          />
          <PreviewSelect
            title="Click Effect"
            :options="CLICK_OPTIONS"
            :model-value="settings.clickEffect"
            @update:model-value="
              (value: string | number) => updateProp('clickEffect', value as FaultyTerminalClickEffect)
            "
          />
          <PreviewSlider
            title="Scale"
            :min="0.8"
            :max="4"
            :step="0.1"
            :model-value="settings.scale"
            @update:model-value="(value: number) => updateProp('scale', value)"
          />
          <PreviewSlider
            title="Digit Size"
            :min="0.9"
            :max="2.5"
            :step="0.05"
            :model-value="settings.digitSize"
            @update:model-value="(value: number) => updateProp('digitSize', value)"
          />
          <PreviewSlider
            title="Speed"
            :min="0"
            :max="2"
            :step="0.05"
            :model-value="settings.timeScale"
            @update:model-value="(value: number) => updateProp('timeScale', value)"
          />
          <PreviewSlider
            title="Brightness"
            :min="0.2"
            :max="1.5"
            :step="0.05"
            :model-value="settings.brightness"
            @update:model-value="(value: number) => updateProp('brightness', value)"
          />
          <PreviewSlider
            title="Glow"
            :min="0"
            :max="1.5"
            :step="0.05"
            :model-value="settings.glow"
            @update:model-value="(value: number) => updateProp('glow', value)"
          />
          <PreviewSlider
            title="Persistence"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.persistence"
            @update:model-value="(value: number) => updateProp('persistence', value)"
          />
          <PreviewSlider
            title="Mouse Strength"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.mouseStrength"
            :is-disabled="!settings.mouseReact"
            @update:model-value="(value: number) => updateProp('mouseStrength', value)"
          />
          <PreviewSlider
            title="Mouse Glow"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.mouseGlow"
            :is-disabled="!settings.mouseReact"
            @update:model-value="(value: number) => updateProp('mouseGlow', value)"
          />
          <PreviewSlider
            title="Scramble"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.scramble"
            :is-disabled="settings.glyphs !== 'characters'"
            @update:model-value="(value: number) => updateProp('scramble', value)"
          />
          <PreviewSlider
            title="Scanline Intensity"
            :min="0"
            :max="1.5"
            :step="0.05"
            :model-value="settings.scanlineIntensity"
            @update:model-value="(value: number) => updateProp('scanlineIntensity', value)"
          />
          <PreviewSlider
            title="Glitch Amount"
            :min="0"
            :max="4"
            :step="0.1"
            :model-value="settings.glitchAmount"
            @update:model-value="(value: number) => updateProp('glitchAmount', value)"
          />
          <PreviewSlider
            title="Flicker Amount"
            :min="0"
            :max="3"
            :step="0.1"
            :model-value="settings.flickerAmount"
            @update:model-value="(value: number) => updateProp('flickerAmount', value)"
          />
          <PreviewSlider
            title="Noise Amplitude"
            :min="0.5"
            :max="1.5"
            :step="0.05"
            :model-value="settings.noiseAmp"
            @update:model-value="(value: number) => updateProp('noiseAmp', value)"
          />
          <PreviewSlider
            title="Chromatic Aberration"
            :min="0"
            :max="4"
            :step="0.1"
            value-unit="px"
            :model-value="settings.chromaticAberration"
            @update:model-value="(value: number) => updateProp('chromaticAberration', value)"
          />
          <PreviewSlider
            title="Curvature"
            :min="0"
            :max="0.5"
            :step="0.01"
            :model-value="settings.curvature"
            @update:model-value="(value: number) => updateProp('curvature', value)"
          />
          <PreviewSlider
            title="Vignette"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.vignette"
            @update:model-value="(value: number) => updateProp('vignette', value)"
          />
          <PreviewSwitch
            title="Mouse React"
            :model-value="settings.mouseReact"
            @update:model-value="(value: boolean) => updateProp('mouseReact', value)"
          />
          <PreviewSwitch
            title="Page Load Animation"
            :model-value="settings.pageLoadAnimation"
            @update:model-value="(value: boolean) => onPageLoadAnimation(value)"
          />
          <PreviewSwitch
            title="Pause"
            :model-value="settings.pause"
            @update:model-value="(value: boolean) => updateProp('pause', value)"
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
        <CodeExample :code-object="faultyTerminal" component-name="FaultyTerminal" />
      </template>
    </TabsLayout>
  </ComponentPropsProvider>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import BackgroundContent from '@/components/common/BackgroundContent.vue';
import CodeExample from '@/components/common/CodeExample.vue';
import Customize from '@/components/common/Customize.vue';
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
import { faultyTerminal } from '@/constants/code/Backgrounds/faultyTerminalCode';
import FaultyTerminal from '@/content/Backgrounds/FaultyTerminal/FaultyTerminal.vue';
import {
  DEFAULT_PROPS,
  PRESET_OPTIONS,
  presetProps,
  type FaultyTerminalClickEffect,
  type FaultyTerminalGlyphs
} from './presets/FaultyTerminal';

const GLYPH_OPTIONS = [
  { value: 'blocks', label: 'Blocks' },
  { value: 'dots', label: 'Dots' },
  { value: 'characters', label: 'Characters' }
];

const CLICK_OPTIONS = [
  { value: 'glitch', label: 'Glitch' },
  { value: 'degauss', label: 'Degauss' },
  { value: 'none', label: 'None' }
];

const propData: PropRow[] = [
  {
    name: 'tint',
    type: 'string',
    default: "'#ffffff'",
    description: 'Phosphor color of the glyphs. In light mode, light colors are deepened so they print clearly.'
  },
  {
    name: 'glyphs',
    type: "'blocks' | 'dots' | 'characters'",
    default: "'blocks'",
    description:
      'What each cell draws: squares of lit pixels, round LED dots, or terminal characters that keep changing.'
  },
  {
    name: 'scale',
    type: 'number',
    default: '1',
    description: 'Zoom of the pattern. Higher values show more, smaller glyphs.'
  },
  {
    name: 'gridMul',
    type: '[number, number]',
    default: '[2, 1]',
    description: 'Glyph density across and down, multiplied with scale.'
  },
  {
    name: 'digitSize',
    type: 'number',
    default: '1.5',
    description: 'Space around each glyph. 1 packs them edge to edge, higher values leave wider gaps.'
  },
  {
    name: 'timeScale',
    type: 'number',
    default: '0.3',
    description: 'Speed of the animation.'
  },
  {
    name: 'brightness',
    type: 'number',
    default: '1',
    description: 'Overall brightness of the screen, or ink strength in light mode.'
  },
  {
    name: 'glow',
    type: 'number',
    default: '0.5',
    description: 'Phosphor bloom around the glyphs, with richer color in the halo and paler bright cores.'
  },
  {
    name: 'persistence',
    type: 'number',
    default: '0.5',
    description:
      'How long glyphs keep glowing after they switch off, like real phosphor. Leaves trails behind the cursor.'
  },
  {
    name: 'mouseReact',
    type: 'boolean',
    default: 'true',
    description: 'Lights up the glyphs around the cursor. The light rests in the middle while the cursor is away.'
  },
  {
    name: 'mouseStrength',
    type: 'number',
    default: '0.2',
    description: 'How many glyphs the cursor lights up around it.'
  },
  {
    name: 'mouseGlow',
    type: 'number',
    default: '0.6',
    description: 'How much the glyphs under the cursor heat up toward white while you move.'
  },
  {
    name: 'scramble',
    type: 'number',
    default: '0.5',
    description: 'How fast characters change near the cursor. Only used with characters.'
  },
  {
    name: 'clickEffect',
    type: "'glitch' | 'degauss' | 'none'",
    default: "'glitch'",
    description:
      'What a click does: tear the screen into shifting bands, or send a wobbling degauss wave from the click.'
  },
  {
    name: 'scanlineIntensity',
    type: 'number',
    default: '0.3',
    description: 'Strength of the soft halo and the bright band that rolls down the screen.'
  },
  {
    name: 'glitchAmount',
    type: 'number',
    default: '1',
    description: 'How far the faulty bands of the screen shift sideways.'
  },
  {
    name: 'flickerAmount',
    type: 'number',
    default: '1',
    description: 'How often the faulty bands appear.'
  },
  {
    name: 'noiseAmp',
    type: 'number',
    default: '1',
    description: 'Strength of the swirling pattern that decides which glyphs light up.'
  },
  {
    name: 'chromaticAberration',
    type: 'number',
    default: '0',
    description: 'Splits the red and blue channels apart, in pixels.'
  },
  {
    name: 'curvature',
    type: 'number',
    default: '0.2',
    description: 'Bulge of the screen, like the glass of an old tube.'
  },
  {
    name: 'vignette',
    type: 'number',
    default: '0.25',
    description: 'Darkens the edges of the screen so it fades into the page.'
  },
  {
    name: 'dither',
    type: 'number | boolean',
    default: '0',
    description: 'Fine noise that smooths color banding.'
  },
  {
    name: 'pageLoadAnimation',
    type: 'boolean',
    default: 'true',
    description: 'Switches the glyphs on one by one, each with a short phosphor flash, on mount.'
  },
  {
    name: 'pause',
    type: 'boolean',
    default: 'false',
    description: 'Freezes the animation. The cursor still lights up glyphs.'
  },
  {
    name: 'variation',
    type: 'number',
    default: 'random',
    description: 'Picks a fixed pattern. Leave it out for a different one on every mount.'
  },
  {
    name: 'lightMode',
    type: 'boolean',
    default: 'false',
    description: 'Prints the glyphs as crisp ink on a light page.'
  },
  { name: 'dpr', type: 'number', default: 'auto', description: 'Maximum device pixel ratio, capped at 2.' },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the container.' },
  { name: 'style', type: 'CSSProperties', default: '-', description: 'Inline styles for the container.' }
];

const { rerenderKey, forceRerender } = useForceRerender();
const { props, defaultProps, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);
const light = useColorModeValue(true, false);

const settings = computed(() => {
  const { preset: _preset, ...rest } = props.value;
  void _preset;
  return rest;
});

const applyPreset = (value: string) => {
  updateProps({ ...presetProps(value, { light: light.value, defaults: defaultProps.value }), preset: value });
};

const onPageLoadAnimation = (value: boolean) => {
  updateProp('pageLoadAnimation', value);
  forceRerender();
};
</script>
