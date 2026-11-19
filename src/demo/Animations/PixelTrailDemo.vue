<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
    :demo-only-props="['preset', 'colorShift', 'shiftColor', 'gooeyEnabled', 'gooStrength', 'reveal']"
    :computed-props="computedProps"
  >
    <TabsLayout>
      <template #preview>
        <div class="demo-container relative overflow-hidden" style="height: 400px; padding: 0">
          <RefreshButton @click="forceRerender" />
          <PixelTrail
            :key="rerenderKey"
            v-bind="settings"
            :color="color"
            :trail-color="trailColor"
            :gooey-filter="gooeyFilter"
            :image-src="imageSrc"
          />
          <p class="pixel-trail-demo-hint">{{ settings.clickBurst ? 'Move and click' : 'Move around' }}</p>
        </div>

        <Customize>
          <PreviewSelect
            title="Preset"
            :options="PRESET_OPTIONS"
            :model-value="props.preset"
            @update:model-value="applyPreset"
          />
          <PreviewColorPickerCustom
            title="Color"
            :color="color"
            @change="(value: string) => updateProp('color', value)"
          />
          <PreviewColorPickerCustom
            title="Trail Color"
            :color="props.shiftColor"
            @change="(value: string) => updateProps({ shiftColor: value, colorShift: true })"
          />
          <PreviewSwitch
            title="Color Shift"
            :model-value="props.colorShift"
            @update:model-value="value => updateProp('colorShift', value)"
          />
          <PreviewSlider
            title="Grid Size"
            :min="10"
            :max="120"
            :step="1"
            :model-value="settings.gridSize"
            @update:model-value="value => updateProp('gridSize', value)"
          />
          <PreviewSlider
            title="Trail Size"
            :min="0.05"
            :max="0.5"
            :step="0.01"
            :model-value="settings.trailSize"
            @update:model-value="value => updateProp('trailSize', value)"
          />
          <PreviewSlider
            title="Max Age"
            :min="100"
            :max="3000"
            :step="50"
            value-unit="ms"
            :model-value="settings.maxAge"
            @update:model-value="value => updateProp('maxAge', value)"
          />
          <PreviewSlider
            title="Interpolate"
            :min="0"
            :max="10"
            :step="0.1"
            :model-value="settings.interpolate"
            @update:model-value="value => updateProp('interpolate', value)"
          />
          <PreviewSwitch
            title="Gooey Filter"
            :model-value="props.gooeyEnabled"
            @update:model-value="value => updateProp('gooeyEnabled', value)"
          />
          <PreviewSlider
            title="Gooey Strength"
            :min="1"
            :max="20"
            :step="1"
            :model-value="props.gooStrength"
            :is-disabled="!props.gooeyEnabled"
            @update:model-value="value => updateProp('gooStrength', value)"
          />
          <PreviewSelect
            title="Shape"
            :options="SHAPE_OPTIONS"
            :model-value="settings.shape"
            :is-disabled="props.gooeyEnabled"
            @update:model-value="value => updateProp('shape', value as Shape)"
          />
          <PreviewSlider
            title="Gap"
            :min="0"
            :max="0.6"
            :step="0.01"
            :model-value="settings.gap"
            @update:model-value="value => updateProp('gap', value)"
          />
          <PreviewSelect
            title="Decay"
            :options="DECAY_OPTIONS"
            :model-value="settings.decay"
            @update:model-value="value => updateProp('decay', value as Decay)"
          />
          <PreviewSlider
            title="Flow"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.flow"
            @update:model-value="value => updateProp('flow', value)"
          />
          <PreviewSlider
            title="Gravity"
            :min="-1"
            :max="1"
            :step="0.05"
            :model-value="settings.gravity"
            @update:model-value="value => updateProp('gravity', value)"
          />
          <PreviewSlider
            title="Sparkle"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.sparkle"
            @update:model-value="value => updateProp('sparkle', value)"
          />
          <PreviewSlider
            title="Shine"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.shine"
            @update:model-value="value => updateProp('shine', value)"
          />
          <PreviewSlider
            title="Glow"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.glow"
            @update:model-value="value => updateProp('glow', value)"
          />
          <PreviewSwitch
            title="Click Burst"
            :model-value="settings.clickBurst"
            @update:model-value="value => updateProp('clickBurst', value)"
          />
          <PreviewSwitch
            title="Reveal Image"
            :model-value="props.reveal"
            @update:model-value="value => updateProp('reveal', value)"
          />
        </Customize>

        <PropTable :data="propData" />
      </template>

      <template #code>
        <CodeExample :code-object="pixelTrail" component-name="PixelTrail" />
      </template>
    </TabsLayout>
  </ComponentPropsProvider>
</template>

<script setup lang="ts">
import { computed } from 'vue';
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
import { pixelTrail } from '@/constants/code/Animations/pixelTrailCode';
import PixelTrail from '@/content/Animations/PixelTrail/PixelTrail.vue';

type Shape = 'square' | 'circle' | 'diamond';
type Decay = 'fade' | 'shrink' | 'dither';

const WHITE = '#ffffff';
const INK = '#161816';
const ACCENT = '#7cff67';
const ACCENT_LIGHT = '#1f9d45';
const DAY_SKY = '/assets/demo/day-sky.webp';
const NIGHT_SKY = '/assets/demo/night-sky.webp';

const LOOK = {
  gridSize: 50,
  trailSize: 0.1,
  maxAge: 500,
  interpolate: 5,
  color: ACCENT,
  colorShift: true,
  shiftColor: ACCENT,
  gooeyEnabled: true,
  gooStrength: 2,
  shape: 'square' as Shape,
  gap: 0.08,
  decay: 'fade' as Decay,
  flow: 0,
  gravity: 0,
  sparkle: 0,
  shine: 0.6,
  glow: 0.4,
  clickBurst: false,
  reveal: false
};

type Look = typeof LOOK;

const DEFAULT_PROPS = { preset: 'classic', ...LOOK };

const PRESETS: Record<string, Look> = {
  classic: LOOK,
  comet: {
    ...LOOK,
    color: WHITE,
    colorShift: true,
    trailSize: 0.12,
    maxAge: 700,
    flow: 0.4,
    clickBurst: true
  },
  gel: { ...LOOK, gap: 0, maxAge: 600, trailSize: 0.12, gooStrength: 5, shine: 1, glow: 0.5 },
  drip: { ...LOOK, maxAge: 1100, gooStrength: 3, gravity: 0.6, clickBurst: true },
  led: {
    ...LOOK,
    color: WHITE,
    colorShift: true,
    gridSize: 60,
    maxAge: 700,
    gooeyEnabled: false,
    shape: 'circle',
    gap: 0.25
  },
  halftone: { ...LOOK, gridSize: 70, maxAge: 800, gooeyEnabled: false, shape: 'circle', decay: 'shrink' },
  dither: { ...LOOK, gridSize: 100, trailSize: 0.14, maxAge: 700, gooeyEnabled: false, decay: 'dither' },
  sparkle: {
    ...LOOK,
    color: WHITE,
    colorShift: true,
    maxAge: 900,
    gooeyEnabled: false,
    sparkle: 0.8,
    clickBurst: true
  },
  reveal: { ...LOOK, gridSize: 60, trailSize: 0.15, maxAge: 1600, gooStrength: 3, reveal: true, clickBurst: true }
};

const PRESET_OPTIONS = [
  { value: 'classic', label: 'Classic' },
  { value: 'comet', label: 'Comet' },
  { value: 'gel', label: 'Gel' },
  { value: 'drip', label: 'Drip' },
  { value: 'led', label: 'LED' },
  { value: 'halftone', label: 'Halftone' },
  { value: 'dither', label: 'Dither' },
  { value: 'sparkle', label: 'Sparkle' },
  { value: 'reveal', label: 'Reveal' }
];

const SHAPE_OPTIONS = [
  { value: 'square', label: 'Square' },
  { value: 'circle', label: 'Circle' },
  { value: 'diamond', label: 'Diamond' }
];

const DECAY_OPTIONS = [
  { value: 'fade', label: 'Fade' },
  { value: 'shrink', label: 'Shrink' },
  { value: 'dither', label: 'Dither' }
];

const propData: PropRow[] = [
  { name: 'gridSize', type: 'number', default: '40', description: 'Number of pixels across the longer side.' },
  {
    name: 'trailSize',
    type: 'number',
    default: '0.1',
    description: 'Radius of the trail brush, as a fraction of the longer side.'
  },
  { name: 'maxAge', type: 'number', default: '250', description: 'How long each part of the trail lasts, in ms.' },
  {
    name: 'interpolate',
    type: 'number',
    default: '5',
    description: 'How many in-between points fill gaps on fast moves. Higher is smoother.'
  },
  {
    name: 'easingFunction',
    type: '(x: number) => number',
    default: 'x => x',
    description: 'Easing curve for how the trail swells in and fades out.'
  },
  { name: 'color', type: 'string', default: "'#ffffff'", description: 'Pixel color.' },
  {
    name: 'trailColor',
    type: 'string',
    default: 'undefined',
    description: 'A second color the trail shifts to as it ages. Leave it out for a single color.'
  },
  {
    name: 'gooeyFilter',
    type: '{ strength: number } | false',
    default: '{ strength: 2 }',
    description:
      'Melts neighbouring pixels into liquid blobs. Higher strength rounds them more. Pass false for separate pixels.'
  },
  {
    name: 'shape',
    type: "'square' | 'circle' | 'diamond'",
    default: "'square'",
    description: 'Shape of each pixel when goo is off.'
  },
  {
    name: 'gap',
    type: 'number',
    default: '0.08',
    description: 'Space between pixels, as a fraction of a pixel. With goo on it draws fine seams between them.'
  },
  {
    name: 'decay',
    type: "'fade' | 'shrink' | 'dither'",
    default: "'fade'",
    description: 'How pixels disappear: fading out, shrinking away or dropping out in a dither pattern.'
  },
  {
    name: 'flow',
    type: 'number',
    default: '0',
    description: 'How much the trail keeps drifting in the direction the cursor moved, from 0 to 1.'
  },
  {
    name: 'gravity',
    type: 'number',
    default: '0',
    description: 'Makes the trail sag down as it fades. Negative values make it rise, from -1 to 1.'
  },
  { name: 'sparkle', type: 'number', default: '0', description: 'Makes fading pixels flicker, from 0 to 1.' },
  {
    name: 'shine',
    type: 'number',
    default: '0.6',
    description: 'Glossy light on the pixels: bevels on every step, a brighter core and highlights, from 0 to 1.'
  },
  { name: 'glow', type: 'number', default: '0.4', description: 'A soft glow around the trail, from 0 to 1.' },
  {
    name: 'clickBurst',
    type: 'boolean',
    default: 'false',
    description: 'Clicking splashes a ring of trail out from the cursor.'
  },
  {
    name: 'imageSrc',
    type: 'string',
    default: 'undefined',
    description: 'An image the trail reveals. Each pixel takes the color of the image beneath it.'
  },
  { name: 'dpr', type: 'number', default: 'auto', description: 'Maximum device pixel ratio, capped at 2.' },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the container.' },
  { name: 'style', type: 'StyleValue', default: '-', description: 'Inline styles for the container.' }
];

const { rerenderKey, forceRerender } = useForceRerender();
const { props, defaultProps, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);
const theme = useColorModeValue<'light' | 'dark'>('light', 'dark');

const settings = computed(() => {
  const {
    preset: _preset,
    colorShift: _colorShift,
    shiftColor: _shiftColor,
    gooeyEnabled: _gooeyEnabled,
    gooStrength: _gooStrength,
    reveal: _reveal,
    ...rest
  } = props.value;
  return rest;
});

const color = computed(() => {
  const value = settings.value.color.toLowerCase();
  if (theme.value !== 'light') return settings.value.color;
  if (value === WHITE) return INK;
  if (value === ACCENT) return ACCENT_LIGHT;
  return settings.value.color;
});
const gooeyFilter = computed(() => (props.value.gooeyEnabled ? { strength: props.value.gooStrength } : false));
const trailColor = computed(() => (props.value.colorShift ? props.value.shiftColor : undefined));
const imageSrc = computed(() => (props.value.reveal ? (theme.value === 'light' ? NIGHT_SKY : DAY_SKY) : undefined));

const computedProps = computed(() => ({
  color: color.value,
  ...(trailColor.value ? { trailColor: trailColor.value } : {}),
  gooeyFilter: gooeyFilter.value,
  ...(imageSrc.value ? { imageSrc: imageSrc.value } : {})
}));

const applyPreset = (value: string | number) => {
  const key = String(value);
  const base = Object.fromEntries(
    (Object.keys(LOOK) as (keyof Look)[]).map(name => [name, defaultProps.value[name]])
  ) as Partial<Look>;
  updateProps({ ...base, ...PRESETS[key], preset: key });
  forceRerender();
};
</script>

<style scoped>
.pixel-trail-demo-hint {
  position: absolute;
  bottom: 1.25rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 0;
  margin: 0;
  font-size: 0.875rem;
  color: var(--text-dimmed);
  user-select: none;
  pointer-events: none;
}
</style>
