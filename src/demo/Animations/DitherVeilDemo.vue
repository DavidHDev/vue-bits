<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
  >
    <TabsLayout>
      <template #preview>
        <div class="demo-container relative overflow-hidden" style="height: 600px; padding: 0">
          <DitherVeil
            :key="rerenderKey"
            :fit="props.fit"
            :ink-color="renderedInk"
            :paper-color="renderedPaper"
            :rim-color="renderedRim"
            :pattern="props.pattern"
            :palette="props.palette"
            :pixel-size="props.pixelSize"
            :levels="props.levels"
            :contrast="props.contrast"
            :brightness="props.brightness"
            :reveal-radius="props.revealRadius"
            :softness="props.softness"
            :linger="props.linger"
            :rim="props.rim"
            :reverse="props.reverse"
            :wander="props.wander"
            :click-burst="props.clickBurst"
          />
          <RefreshButton @click="forceRerender" />
        </div>

        <Customize>
          <PreviewColorPickerCustom
            title="Ink"
            :color="renderedInk"
            @change="(value: string) => updateProp('inkColor', value)"
          />
          <PreviewColorPickerCustom
            title="Paper"
            :color="renderedPaper"
            @change="(value: string) => updateProp('paperColor', value)"
          />
          <PreviewColorPickerCustom
            title="Rim Color"
            :color="renderedRim"
            @change="(value: string) => updateProp('rimColor', value)"
          />

          <PreviewSelect
            title="Fit"
            :options="FIT_OPTIONS"
            :model-value="props.fit"
            @update:model-value="value => updateProp('fit', value as Fit)"
          />
          <PreviewSelect
            title="Pattern"
            :options="PATTERN_OPTIONS"
            :model-value="props.pattern"
            @update:model-value="value => updateProp('pattern', value as Pattern)"
          />
          <PreviewSelect
            title="Palette"
            :options="PALETTE_OPTIONS"
            :model-value="props.palette"
            @update:model-value="value => updateProp('palette', value as Palette)"
          />
          <PreviewSlider
            title="Pixel Size"
            :min="1"
            :max="10"
            :step="1"
            value-unit="px"
            :model-value="props.pixelSize"
            @update:model-value="value => updateProp('pixelSize', value)"
          />
          <PreviewSlider
            title="Levels"
            :min="2"
            :max="6"
            :step="1"
            :model-value="props.levels"
            @update:model-value="value => updateProp('levels', value)"
          />
          <PreviewSlider
            title="Contrast"
            :min="0.5"
            :max="2"
            :step="0.05"
            :model-value="props.contrast"
            @update:model-value="value => updateProp('contrast', value)"
          />
          <PreviewSlider
            title="Brightness"
            :min="-0.4"
            :max="0.4"
            :step="0.02"
            :model-value="props.brightness"
            @update:model-value="value => updateProp('brightness', value)"
          />

          <PreviewSlider
            title="Reveal Radius"
            :min="40"
            :max="300"
            :step="5"
            value-unit="px"
            :model-value="props.revealRadius"
            @update:model-value="value => updateProp('revealRadius', value)"
          />
          <PreviewSlider
            title="Softness"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.softness"
            @update:model-value="value => updateProp('softness', value)"
          />
          <PreviewSlider
            title="Linger"
            :min="0"
            :max="4"
            :step="0.1"
            value-unit="s"
            :model-value="props.linger"
            @update:model-value="value => updateProp('linger', value)"
          />
          <PreviewSlider
            title="Rim"
            :min="0"
            :max="0.6"
            :step="0.02"
            :model-value="props.rim"
            @update:model-value="value => updateProp('rim', value)"
          />

          <PreviewSwitch
            title="Reverse"
            :model-value="props.reverse"
            @update:model-value="value => updateProp('reverse', value)"
          />
          <PreviewSwitch
            title="Wander"
            :model-value="props.wander"
            @update:model-value="value => updateProp('wander', value)"
          />
          <PreviewSwitch
            title="Click Burst"
            :model-value="props.clickBurst"
            @update:model-value="value => updateProp('clickBurst', value)"
          />
        </Customize>

        <PropTable :data="propData" />
        <Dependencies :dependency-list="['ogl']" />
      </template>

      <template #code>
        <CodeExample :code-object="ditherVeil" component-name="DitherVeil" />
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
import { useColorMode } from '@/composables/useTheme';
import { ditherVeil } from '@/constants/code/Animations/ditherVeilCode';
import DitherVeil from '@/content/Animations/DitherVeil/DitherVeil.vue';

type Fit = 'contain' | 'cover';
type Pattern = 'bayer' | 'noise' | 'atkinson' | 'floyd' | 'lines';
type Palette = 'duotone' | 'rgb';

const DEFAULT_PROPS = {
  fit: 'contain' as Fit,
  inkColor: '#111111',
  paperColor: '#f4f1ea',
  rimColor: '#a0ffbc',
  pattern: 'floyd' as Pattern,
  palette: 'duotone' as Palette,
  pixelSize: 2,
  levels: 2,
  contrast: 1.15,
  brightness: 0,
  revealRadius: 200,
  softness: 0.6,
  linger: 1,
  rim: 0,
  reverse: false,
  wander: false,
  clickBurst: true
};

const PATTERN_OPTIONS = [
  { label: 'Bayer', value: 'bayer' },
  { label: 'Blue Noise', value: 'noise' },
  { label: 'Atkinson', value: 'atkinson' },
  { label: 'Floyd-Steinberg', value: 'floyd' },
  { label: 'Lines', value: 'lines' }
];

const FIT_OPTIONS = [
  { label: 'Contain', value: 'contain' },
  { label: 'Cover', value: 'cover' }
];

const PALETTE_OPTIONS = [
  { label: 'Duotone', value: 'duotone' },
  { label: 'RGB', value: 'rgb' }
];

const { rerenderKey, forceRerender } = useForceRerender();
const { props, updateProp, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);
const { isLight } = useColorMode();

const renderedInk = computed(() =>
  isLight.value && props.value.inkColor === DEFAULT_PROPS.inkColor ? '#ffffff' : props.value.inkColor
);
const renderedPaper = computed(() =>
  isLight.value && props.value.paperColor === DEFAULT_PROPS.paperColor ? '#161816' : props.value.paperColor
);
const renderedRim = computed(() =>
  isLight.value && props.value.rimColor === DEFAULT_PROPS.rimColor ? '#1f9d45' : props.value.rimColor
);

const propData: PropRow[] = [
  {
    name: 'src',
    type: 'string',
    default: "'https://images.unsplash.com/...'",
    description: 'Image to veil. Must be served with CORS headers.'
  },
  {
    name: 'fit',
    type: "'contain' | 'cover'",
    default: "'contain'",
    description: 'Show the whole image on the ink, or crop it to fill the container.'
  },
  {
    name: 'pattern',
    type: "'bayer' | 'noise' | 'atkinson' | 'floyd' | 'lines'",
    default: "'floyd'",
    description:
      'How the image is broken into dots: an ordered Bayer grid, blue noise stipple, Atkinson or Floyd-Steinberg error diffusion, or diagonal engraving lines.'
  },
  {
    name: 'palette',
    type: "'duotone' | 'rgb'",
    default: "'duotone'",
    description:
      'Duotone maps brightness between the ink and paper colours. RGB dithers each channel for a retro colour look.'
  },
  { name: 'pixelSize', type: 'number', default: '2', description: 'Size of each dither cell, in px.' },
  {
    name: 'levels',
    type: 'number',
    default: '2',
    description: 'Tones per channel. 2 is pure 1-bit, higher values add in-between shades.'
  },
  { name: 'inkColor', type: 'string', default: "'#111111'", description: 'Colour of the darkest tone.' },
  { name: 'paperColor', type: 'string', default: "'#f4f1ea'", description: 'Colour of the lightest tone.' },
  {
    name: 'contrast',
    type: 'number',
    default: '1.15',
    description: 'Tonal contrast applied before dithering.'
  },
  {
    name: 'brightness',
    type: 'number',
    default: '0',
    description: 'Shifts the image lighter or darker before dithering.'
  },
  {
    name: 'revealRadius',
    type: 'number',
    default: '200',
    description: 'Radius of the full-colour window around the cursor, in px.'
  },
  {
    name: 'softness',
    type: 'number',
    default: '0.6',
    description: 'How much of the reveal edge dissolves through the dither. 0 is a hard cut.'
  },
  {
    name: 'linger',
    type: 'number',
    default: '1',
    description: 'Seconds the revealed trail takes to knit back into dither. 0 turns the trail off.'
  },
  {
    name: 'rimColor',
    type: 'string',
    default: "'#a0ffbc'",
    description: 'Colour of the cells along the dissolving edge.'
  },
  {
    name: 'rim',
    type: 'number',
    default: '0',
    description: 'Thickness of the coloured rim on the dissolving edge. 0 hides it.'
  },
  {
    name: 'reverse',
    type: 'boolean',
    default: 'false',
    description: 'Start in full colour and dither wherever the cursor goes.'
  },
  {
    name: 'wander',
    type: 'boolean',
    default: 'false',
    description: 'Let the reveal drift around on its own while the pointer is away.'
  },
  {
    name: 'clickBurst',
    type: 'boolean',
    default: 'true',
    description: 'Clicking sends a ring of colour rippling out across the image.'
  },
  { name: 'className', type: 'string', default: "''", description: 'Extra classes on the container.' },
  { name: 'style', type: 'StyleValue', default: '-', description: 'Inline styles on the container.' }
];
</script>
