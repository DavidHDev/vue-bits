<template>
  <ComponentPropsProvider
    :props="themedProps"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
  >
    <TabsLayout>
      <template #preview>
        <div class="demo-container relative overflow-hidden" style="height: 500px; padding: 0">
          <PatternWaves :key="rerenderKey" v-bind="themedProps" />
          <BackgroundContent headline="Soft light on a moving surface." />
          <RefreshButton @click="forceRerender" />
        </div>

        <Customize>
          <PreviewSelect
            title="Preset"
            :options="PRESET_OPTIONS"
            :model-value="props.preset"
            @update:model-value="choosePreset"
          />
          <PreviewSelect
            title="Pattern"
            :options="PATTERN_OPTIONS"
            :model-value="props.pattern"
            @update:model-value="value => updateProp('pattern', value as PatternWavesPattern)"
          />
          <PreviewSelect
            title="Wave"
            :options="WAVE_OPTIONS"
            :model-value="props.wave"
            @update:model-value="value => updateProp('wave', value as PatternWavesWave)"
          />
          <PreviewInput
            title="Characters"
            placeholder="Lightest to densest"
            :max-length="24"
            :is-disabled="props.pattern !== 'glyph'"
            :model-value="props.characters"
            @update:model-value="value => updateProp('characters', value)"
          />

          <PreviewColorPickerCustom
            title="Color"
            :color="themedProps.color"
            @change="(value: string) => updateProp('color', value)"
          />
          <PreviewColorPickerCustom
            title="Background"
            :color="themedProps.backgroundColor"
            @change="(value: string) => updateProp('backgroundColor', value)"
          />

          <PreviewSlider
            title="Spacing"
            :min="5"
            :max="30"
            :step="1"
            value-unit="px"
            :model-value="props.spacing"
            @update:model-value="value => updateProp('spacing', value)"
          />
          <PreviewSlider
            title="Mark Size"
            :min="0.3"
            :max="1"
            :step="0.05"
            :model-value="props.markSize"
            @update:model-value="value => updateProp('markSize', value)"
          />

          <PreviewSlider
            title="Depth"
            :min="0"
            :max="1.5"
            :step="0.05"
            :model-value="props.depth"
            @update:model-value="value => updateProp('depth', value)"
          />
          <PreviewSlider
            title="Light"
            :min="-90"
            :max="90"
            :step="1"
            value-unit="°"
            :model-value="props.light"
            @update:model-value="value => updateProp('light', value)"
          />
          <PreviewSlider
            title="Shine"
            :min="0"
            :max="2"
            :step="0.05"
            :model-value="props.shine"
            @update:model-value="value => updateProp('shine', value)"
          />
          <PreviewSlider
            title="Contrast"
            :min="0.5"
            :max="2.5"
            :step="0.05"
            :model-value="props.contrast"
            @update:model-value="value => updateProp('contrast', value)"
          />

          <PreviewSlider
            title="Speed"
            :min="0"
            :max="2"
            :step="0.05"
            :model-value="props.speed"
            @update:model-value="value => updateProp('speed', value)"
          />
          <PreviewSlider
            title="Scale"
            :min="0.3"
            :max="3"
            :step="0.05"
            :model-value="props.scale"
            @update:model-value="value => updateProp('scale', value)"
          />
          <PreviewSlider
            title="Direction"
            :min="0"
            :max="360"
            :step="1"
            value-unit="°"
            :model-value="props.direction"
            @update:model-value="value => updateProp('direction', value)"
          />

          <PreviewSelect
            title="Fade"
            :options="FADE_OPTIONS"
            :model-value="props.fade"
            @update:model-value="value => updateProp('fade', value as PatternWavesFade)"
          />
          <PreviewSlider
            title="Fade Size"
            :min="0.1"
            :max="1"
            :step="0.05"
            :is-disabled="props.fade === 'none'"
            :model-value="props.fadeSize"
            @update:model-value="value => updateProp('fadeSize', value)"
          />
          <PreviewSlider
            title="Opacity"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.opacity"
            @update:model-value="value => updateProp('opacity', value)"
          />

          <PreviewSwitch
            title="Interactive"
            :model-value="props.interactive"
            @update:model-value="value => updateProp('interactive', value)"
          />
          <PreviewSlider
            title="Cursor Size"
            :min="10"
            :max="200"
            :step="5"
            value-unit="px"
            :is-disabled="!props.interactive"
            :model-value="props.cursorSize"
            @update:model-value="value => updateProp('cursorSize', value)"
          />
          <PreviewSlider
            title="Cursor Strength"
            :min="0"
            :max="1"
            :step="0.05"
            :is-disabled="!props.interactive"
            :model-value="props.cursorStrength"
            @update:model-value="value => updateProp('cursorStrength', value)"
          />

          <PreviewSwitch
            title="Intro"
            :model-value="props.intro"
            @update:model-value="value => updateProp('intro', value)"
          />
          <PreviewSwitch
            title="Paused"
            :model-value="props.paused"
            @update:model-value="value => updateProp('paused', value)"
          />
        </Customize>

        <PropTable :data="propData" />
        <Dependencies :dependency-list="['ogl']" />
      </template>

      <template #code>
        <CodeExample :code-object="patternWaves" component-name="PatternWaves" />
      </template>
    </TabsLayout>
  </ComponentPropsProvider>
</template>

<script setup lang="ts">
import BackgroundContent from '@/components/common/BackgroundContent.vue';
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
import { useThemedProps } from '@/composables/useThemedProps';
import { patternWaves } from '@/constants/code/Backgrounds/patternWavesCode';
import PatternWaves from '@/content/Backgrounds/PatternWaves/PatternWaves.vue';
import {
  DEFAULT_PROPS,
  LIGHT_PROPS,
  PRESET_OPTIONS,
  presetProps,
  type PatternWavesFade,
  type PatternWavesPattern,
  type PatternWavesPreset,
  type PatternWavesWave
} from './presets/PatternWaves';

const PATTERN_OPTIONS = [
  { label: 'Dot', value: 'dot' },
  { label: 'Square', value: 'square' },
  { label: 'Plus', value: 'plus' },
  { label: 'Line', value: 'line' },
  { label: 'Glyph', value: 'glyph' }
];

const WAVE_OPTIONS = [
  { label: 'Silk', value: 'silk' },
  { label: 'Swell', value: 'swell' },
  { label: 'Ripple', value: 'ripple' }
];

const FADE_OPTIONS = [
  { label: 'Edges', value: 'edges' },
  { label: 'Center', value: 'center' },
  { label: 'Bottom', value: 'bottom' },
  { label: 'Top', value: 'top' },
  { label: 'None', value: 'none' }
];

const { rerenderKey, forceRerender } = useForceRerender();
const { props, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);
const themedProps = useThemedProps(props, DEFAULT_PROPS, LIGHT_PROPS);

const choosePreset = (value: string | number) => {
  updateProps({ preset: value as PatternWavesPreset, ...presetProps(String(value)) });
};

const propData: PropRow[] = [
  {
    name: 'preset',
    type: "'silk' | 'ocean' | 'pond' | 'lines' | 'terminal' | 'mesh'",
    default: "'silk'",
    description:
      'A complete starting look. Every pattern, wave and light prop below overrides the preset value when you pass it.'
  },
  {
    name: 'pattern',
    type: "'dot' | 'square' | 'plus' | 'line' | 'glyph'",
    default: 'from preset',
    description:
      'The mark that draws the surface. Line traces it as flowing contour lines, glyph uses characters picked by brightness.'
  },
  {
    name: 'wave',
    type: "'silk' | 'swell' | 'ripple'",
    default: 'from preset',
    description:
      'The shape of the moving surface. Silk is draped fabric folds, swell is rolling parallel waves, ripple is rings travelling in from off screen.'
  },
  {
    name: 'color',
    type: 'string',
    default: "'#ffffff'",
    description:
      'The one color of the pattern. Shadows, midtones and highlights are all derived from it. A color darker than the background prints like ink.'
  },
  {
    name: 'backgroundColor',
    type: 'string',
    default: "'#000000'",
    description: 'Color behind the pattern. Pass transparent to show the page through.'
  },
  {
    name: 'spacing',
    type: 'number',
    default: 'from preset',
    description: 'Distance between marks in CSS pixels. Smaller values give a finer print.'
  },
  {
    name: 'markSize',
    type: 'number',
    default: 'from preset',
    description: 'Largest mark as a fraction of the spacing.'
  },
  {
    name: 'depth',
    type: 'number',
    default: 'from preset',
    description: 'How tall the surface is. Deeper surfaces cast stronger shading and lift the marks along the crests.'
  },
  {
    name: 'light',
    type: 'number',
    default: 'from preset',
    description:
      'Angle of the light across the waves in degrees, from -90 to 90. 0 lights the folds head on, larger values graze them.'
  },
  {
    name: 'shine',
    type: 'number',
    default: 'from preset',
    description: 'Strength of the glints where the surface catches the light.'
  },
  {
    name: 'contrast',
    type: 'number',
    default: 'from preset',
    description: 'Spread between the quiet shadows and the lit areas.'
  },
  {
    name: 'speed',
    type: 'number',
    default: 'from preset',
    description: 'How fast the surface moves. 0 freezes it while the cursor keeps working.'
  },
  {
    name: 'scale',
    type: 'number',
    default: 'from preset',
    description: 'Size of the waves. Larger values give broader, calmer forms.'
  },
  {
    name: 'direction',
    type: 'number',
    default: 'from preset',
    description: 'Direction the waves travel in degrees. The light turns with it.'
  },
  {
    name: 'opacity',
    type: 'number',
    default: '1',
    description: 'Overall opacity of the pattern, from 0 to 1.'
  },
  {
    name: 'fade',
    type: "'edges' | 'center' | 'bottom' | 'top' | 'none'",
    default: "'edges'",
    description:
      'Where the pattern fades into the background. Center keeps the middle calm for a headline, bottom and top fade towards that edge.'
  },
  {
    name: 'fadeSize',
    type: 'number',
    default: '0.5',
    description: 'How far the fade reaches, from 0.05 to 1.'
  },
  {
    name: 'characters',
    type: 'string',
    default: "'.:-=+*#%@'",
    description: 'Characters for the glyph pattern, ordered from the lightest to the densest.'
  },
  {
    name: 'interactive',
    type: 'boolean',
    default: 'true',
    description:
      'Lets the cursor disturb the surface. Moving it leaves a wake of ripples that catch the light, a click drops a splash.'
  },
  {
    name: 'cursorSize',
    type: 'number',
    default: '50',
    description: 'Radius of the patch of surface the cursor pushes, in CSS pixels.'
  },
  {
    name: 'cursorStrength',
    type: 'number',
    default: '0.6',
    description: 'How hard the cursor pushes the surface, from 0 to 1.'
  },
  {
    name: 'intro',
    type: 'boolean',
    default: 'true',
    description: 'On mount the marks fade in from the center, then the surface rises and the light sweeps across it.'
  },
  {
    name: 'paused',
    type: 'boolean',
    default: 'false',
    description: 'Freezes the surface. The cursor ripples keep working.'
  },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the root element.' },
  { name: 'style', type: 'StyleValue', default: '-', description: 'Inline styles for the root element.' }
];
</script>
