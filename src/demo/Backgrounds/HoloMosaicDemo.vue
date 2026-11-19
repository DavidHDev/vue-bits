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
          <HoloMosaic :key="rerenderKey" v-bind="settings" />
          <BackgroundContent headline="Holographic tiles that change color as the light moves." />
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
            title="Color"
            :color="settings.color"
            @change="(value: string) => updateProp('color', value)"
          />
          <PreviewColorPickerCustom
            title="Metal Color"
            :color="settings.metalColor"
            @change="(value: string) => updateProp('metalColor', value)"
          />
          <PreviewSelect
            title="Spectrum"
            :options="SPECTRUM_OPTIONS"
            :model-value="settings.spectrum"
            @update:model-value="(value: string | number) => updateProp('spectrum', value as HoloMosaicSpectrum)"
          />
          <PreviewSelect
            title="Filter"
            :options="FILTER_OPTIONS"
            :model-value="settings.filter"
            @update:model-value="(value: string | number) => updateProp('filter', value as HoloMosaicFilter)"
          />
          <PreviewSlider
            title="Filter Size"
            :min="0.5"
            :max="3"
            :step="0.05"
            :model-value="settings.filterSize"
            @update:model-value="(value: number) => updateProp('filterSize', value)"
          />
          <PreviewSlider
            title="Tile Size"
            :min="0.4"
            :max="3"
            :step="0.05"
            :model-value="settings.tileSize"
            @update:model-value="(value: number) => updateProp('tileSize', value)"
          />
          <PreviewSlider
            title="Gap"
            :min="0"
            :max="0.3"
            :step="0.01"
            :model-value="settings.gap"
            @update:model-value="(value: number) => updateProp('gap', value)"
          />
          <PreviewSlider
            title="Roundness"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.roundness"
            @update:model-value="(value: number) => updateProp('roundness', value)"
          />
          <PreviewSlider
            title="Bevel"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.bevel"
            @update:model-value="(value: number) => updateProp('bevel', value)"
          />
          <PreviewSlider
            title="Rotation"
            :min="-90"
            :max="90"
            :step="1"
            :model-value="settings.rotation"
            @update:model-value="(value: number) => updateProp('rotation', value)"
          />
          <PreviewSlider
            title="Scatter"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.scatter"
            @update:model-value="(value: number) => updateProp('scatter', value)"
          />
          <PreviewSlider
            title="Tilt"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.tilt"
            @update:model-value="(value: number) => updateProp('tilt', value)"
          />
          <PreviewSlider
            title="Swirl"
            :min="0.2"
            :max="3"
            :step="0.05"
            :model-value="settings.swirl"
            @update:model-value="(value: number) => updateProp('swirl', value)"
          />
          <PreviewSlider
            title="Ripple"
            :min="0"
            :max="2"
            :step="0.05"
            :model-value="settings.ripple"
            @update:model-value="(value: number) => updateProp('ripple', value)"
          />
          <PreviewSlider
            title="Bands"
            :min="0.5"
            :max="2.5"
            :step="0.05"
            :model-value="settings.bands"
            @update:model-value="(value: number) => updateProp('bands', value)"
          />
          <PreviewSlider
            title="Softness"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.softness"
            @update:model-value="(value: number) => updateProp('softness', value)"
          />
          <PreviewSlider
            title="Intensity"
            :min="0"
            :max="2"
            :step="0.05"
            :model-value="settings.intensity"
            @update:model-value="(value: number) => updateProp('intensity', value)"
          />
          <PreviewSlider
            title="Saturation"
            :min="0"
            :max="1.3"
            :step="0.01"
            :model-value="settings.saturation"
            @update:model-value="(value: number) => updateProp('saturation', value)"
          />
          <PreviewSlider
            title="Glitter"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.glitter"
            @update:model-value="(value: number) => updateProp('glitter', value)"
          />
          <PreviewSlider
            title="Sheen"
            :min="0"
            :max="1.5"
            :step="0.05"
            :model-value="settings.sheen"
            @update:model-value="(value: number) => updateProp('sheen', value)"
          />
          <PreviewSlider
            title="Grain"
            :min="0"
            :max="0.4"
            :step="0.01"
            :model-value="settings.grain"
            @update:model-value="(value: number) => updateProp('grain', value)"
          />
          <PreviewSlider
            title="Speed"
            :min="0"
            :max="2"
            :step="0.05"
            :model-value="settings.speed"
            @update:model-value="(value: number) => updateProp('speed', value)"
          />
          <PreviewSlider
            title="Variation"
            :min="0"
            :max="20"
            :step="1"
            :model-value="settings.variation"
            @update:model-value="(value: number) => updateProp('variation', value)"
          />
          <PreviewSlider
            title="Fade"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.fade"
            @update:model-value="(value: number) => updateProp('fade', value)"
          />
          <PreviewSlider
            title="Opacity"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.opacity"
            @update:model-value="(value: number) => updateProp('opacity', value)"
          />
          <PreviewSlider
            title="Mouse Strength"
            :min="0"
            :max="2"
            :step="0.05"
            :model-value="settings.mouseStrength"
            @update:model-value="(value: number) => updateProp('mouseStrength', value)"
          />
          <PreviewSlider
            title="Mouse Radius"
            :min="0.1"
            :max="0.6"
            :step="0.01"
            :model-value="settings.mouseRadius"
            @update:model-value="(value: number) => updateProp('mouseRadius', value)"
          />
          <PreviewSwitch
            title="Mouse Interaction"
            :model-value="settings.mouseInteraction"
            @update:model-value="(value: boolean) => updateProp('mouseInteraction', value)"
          />
          <PreviewSwitch
            title="Flip On Click"
            :model-value="settings.flipOnClick"
            @update:model-value="(value: boolean) => updateProp('flipOnClick', value)"
          />
          <PreviewSwitch
            title="Intro"
            :model-value="settings.intro"
            @update:model-value="(value: boolean) => setIntro(value)"
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
        <CodeExample :code-object="holoMosaic" component-name="HoloMosaic" />
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
import { holoMosaic } from '@/constants/code/Backgrounds/holoMosaicCode';
import HoloMosaic from '@/content/Backgrounds/HoloMosaic/HoloMosaic.vue';
import {
  DEFAULT_PROPS,
  PRESET_OPTIONS,
  presetProps,
  type HoloMosaicFilter,
  type HoloMosaicSpectrum
} from './presets/HoloMosaic';

const FILTER_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'ascii', label: 'ASCII' },
  { value: 'dither', label: 'Dither' }
];

const SPECTRUM_OPTIONS = [
  { value: 'full', label: 'Full' },
  { value: 'warm', label: 'Warm' },
  { value: 'cool', label: 'Cool' },
  { value: 'pearl', label: 'Pearl' }
];

const propData: PropRow[] = [
  {
    name: 'color',
    type: 'string',
    default: "'#111111'",
    description: 'Base color of the tiles. Set it to your page background, the seams show the page through.'
  },
  {
    name: 'metalColor',
    type: 'string',
    default: "'#e8ebf1'",
    description: 'Tint of the metal where no color diffracts, and of the glints and sheen.'
  },
  {
    name: 'spectrum',
    type: "'full' | 'warm' | 'cool' | 'pearl'",
    default: "'full'",
    description:
      'Range of colors the tiles split light into: the full rainbow, golds and reds, blues and greens, or soft pearl.'
  },
  {
    name: 'tileSize',
    type: 'number',
    default: '1',
    description: 'Size of the tiles.'
  },
  {
    name: 'gap',
    type: 'number',
    default: '0.08',
    description: 'Width of the seams between tiles.'
  },
  {
    name: 'roundness',
    type: 'number',
    default: '0.15',
    description: 'Corner radius of the tiles.'
  },
  {
    name: 'bevel',
    type: 'number',
    default: '0.35',
    description: 'How much the tile edges round off and catch the light.'
  },
  {
    name: 'rotation',
    type: 'number',
    default: '0',
    description: 'Rotation of the tile grid, in degrees.'
  },
  {
    name: 'scatter',
    type: 'number',
    default: '0.3',
    description:
      'How differently each tile is etched. 0 keeps the color flowing across tiles, 1 gives every tile its own.'
  },
  {
    name: 'tilt',
    type: 'number',
    default: '0.35',
    description: 'How much the tiles lean in random directions, so they catch the light one by one.'
  },
  {
    name: 'swirl',
    type: 'number',
    default: '1',
    description: 'Size of the swirling color pattern. Higher makes it finer.'
  },
  {
    name: 'ripple',
    type: 'number',
    default: '0.6',
    description: 'Strength of the slow rings that roll through the color.'
  },
  {
    name: 'bands',
    type: 'number',
    default: '1.3',
    description: 'How many color bands fit across the tiles.'
  },
  {
    name: 'softness',
    type: 'number',
    default: '0.5',
    description: 'Size of the light. Higher blends the color bands more softly.'
  },
  {
    name: 'intensity',
    type: 'number',
    default: '1.25',
    description: 'Strength of the colors.'
  },
  {
    name: 'saturation',
    type: 'number',
    default: '0.1',
    description: 'Color saturation. 0 gives plain silver.'
  },
  {
    name: 'glitter',
    type: 'number',
    default: '0.85',
    description: 'Amount of tiny glints that sparkle as the light moves.'
  },
  {
    name: 'sheen',
    type: 'number',
    default: '0.8',
    description: 'Soft reflection of the light on the tiles.'
  },
  {
    name: 'grain',
    type: 'number',
    default: '0.08',
    description: 'Strength of the film grain.'
  },
  {
    name: 'speed',
    type: 'number',
    default: '0.5',
    description: 'Speed of the drifting light and the moving color.'
  },
  {
    name: 'variation',
    type: 'number',
    default: '0',
    description: 'Picks a different pattern of tiles and color.'
  },
  {
    name: 'filter',
    type: "'none' | 'ascii' | 'dither'",
    default: "'none'",
    description: 'Redraws the effect as colored ASCII characters or as an ordered dither.'
  },
  {
    name: 'filterSize',
    type: 'number',
    default: '1',
    description: 'Size of the characters or dither dots.'
  },
  {
    name: 'fade',
    type: 'number',
    default: '0',
    description: 'Fades the edges into the page, from 0 to 1.'
  },
  {
    name: 'opacity',
    type: 'number',
    default: '1',
    description: 'Opacity of the whole effect.'
  },
  {
    name: 'intro',
    type: 'boolean',
    default: 'true',
    description: 'Flips the tiles in from the center when the effect first appears.'
  },
  {
    name: 'mouseInteraction',
    type: 'boolean',
    default: 'true',
    description: 'Lets the light follow the cursor and the tiles around it tilt toward it.'
  },
  {
    name: 'mouseStrength',
    type: 'number',
    default: '1',
    description: 'How far the tiles around the cursor tilt.'
  },
  {
    name: 'mouseRadius',
    type: 'number',
    default: '0.25',
    description: 'Size of the area around the cursor that tilts.'
  },
  {
    name: 'flipOnClick',
    type: 'boolean',
    default: 'true',
    description: 'Sends a wave of flipping tiles out from wherever you click.'
  },
  {
    name: 'lightMode',
    type: 'boolean',
    default: 'false',
    description: 'Prints the colors like ink on pale tiles, for light backgrounds.'
  },
  {
    name: 'paused',
    type: 'boolean',
    default: 'false',
    description: 'Freezes the animation.'
  },
  {
    name: 'dpr',
    type: 'number',
    default: 'auto',
    description: 'Maximum device pixel ratio, capped at 2.'
  },
  {
    name: 'className',
    type: 'string',
    default: "''",
    description: 'Extra class names for the container.'
  }
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

const setIntro = (value: boolean) => {
  updateProp('intro', value);
  forceRerender();
};
</script>
