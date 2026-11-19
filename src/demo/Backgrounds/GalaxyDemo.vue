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
          <Galaxy :key="rerenderKey" v-bind="settings" :star-colors="paletteActive ? settings.starColors : undefined" />
          <BackgroundContent headline="Components you shall have, young padawan." />
          <RefreshButton @click="forceRerender" />
        </div>

        <Customize>
          <PreviewSelect
            title="Preset"
            :options="PRESET_OPTIONS"
            :model-value="props.preset"
            @update:model-value="(value: string | number) => applyPreset(String(value))"
          />
          <PreviewSelect
            title="Star Colors"
            :options="PALETTE_OPTIONS"
            :model-value="paletteName(settings.starColors)"
            @update:model-value="(value: string | number) => updateProp('starColors', PALETTES[String(value)])"
          />
          <PreviewSlider
            title="Hue Shift"
            :min="0"
            :max="360"
            :step="1"
            value-unit="°"
            :model-value="settings.hueShift"
            :is-disabled="paletteActive"
            @update:model-value="(value: number) => updateProp('hueShift', value)"
          />
          <PreviewSlider
            title="Saturation"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.saturation"
            :is-disabled="paletteActive"
            @update:model-value="(value: number) => updateProp('saturation', value)"
          />
          <PreviewSlider
            title="Density"
            :min="0.3"
            :max="3"
            :step="0.05"
            :model-value="settings.density"
            @update:model-value="(value: number) => updateProp('density', value)"
          />
          <PreviewSlider
            title="Glow"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.glowIntensity"
            @update:model-value="(value: number) => updateProp('glowIntensity', value)"
          />
          <PreviewSlider
            title="Star Size"
            :min="0.3"
            :max="3"
            :step="0.05"
            :model-value="settings.starSize"
            @update:model-value="(value: number) => updateProp('starSize', value)"
          />
          <PreviewSlider
            title="Flares"
            :min="0"
            :max="4"
            :step="0.05"
            :model-value="settings.flareIntensity"
            @update:model-value="(value: number) => updateProp('flareIntensity', value)"
          />
          <PreviewSlider
            title="Twinkle"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.twinkleIntensity"
            @update:model-value="(value: number) => updateProp('twinkleIntensity', value)"
          />
          <PreviewSlider
            title="Star Speed"
            :min="0"
            :max="4"
            :step="0.05"
            :model-value="settings.starSpeed"
            @update:model-value="(value: number) => updateProp('starSpeed', value)"
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
            title="Rotation Speed"
            :min="0"
            :max="0.5"
            :step="0.01"
            :model-value="settings.rotationSpeed"
            @update:model-value="(value: number) => updateProp('rotationSpeed', value)"
          />
          <PreviewSlider
            title="Layers"
            :min="2"
            :max="8"
            :step="1"
            :model-value="settings.layers"
            @update:model-value="(value: number) => updateProp('layers', value)"
          />
          <PreviewSelect
            title="Direction"
            :options="DIRECTION_OPTIONS"
            :model-value="settings.direction"
            @update:model-value="(value: string | number) => updateProp('direction', value as 'forward' | 'backward')"
          />
          <PreviewSlider
            title="Repulsion Strength"
            :min="0"
            :max="5"
            :step="0.1"
            :model-value="settings.repulsionStrength"
            :is-disabled="!settings.mouseInteraction || !settings.mouseRepulsion"
            @update:model-value="(value: number) => updateProp('repulsionStrength', value)"
          />
          <PreviewSwitch
            title="Mouse Interaction"
            :model-value="settings.mouseInteraction"
            @update:model-value="(value: boolean) => updateProp('mouseInteraction', value)"
          />
          <PreviewSwitch
            title="Mouse Repulsion"
            :model-value="settings.mouseRepulsion"
            @update:model-value="(value: boolean) => updateProp('mouseRepulsion', value)"
          />
          <PreviewSwitch
            title="Click Warp"
            :model-value="settings.clickWarp"
            @update:model-value="(value: boolean) => updateProp('clickWarp', value)"
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
        <CodeExample :code-object="galaxy" component-name="Galaxy" />
      </template>
    </TabsLayout>
  </ComponentPropsProvider>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import BackgroundContent from '@/components/common/BackgroundContent.vue';
import CodeExample from '@/components/common/CodeExample.vue';
import Customize from '@/components/common/Customize.vue';
import PreviewSelect from '@/components/common/PreviewSelect.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import RefreshButton from '@/components/common/RefreshButton.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import ComponentPropsProvider from '@/components/context/ComponentPropsProvider.vue';
import { useComponentProps } from '@/composables/useComponentProps';
import { useForceRerender } from '@/composables/useForceRerender';
import { galaxy } from '@/constants/code/Backgrounds/galaxyCode';
import Galaxy from '@/content/Backgrounds/Galaxy/Galaxy.vue';
import { DEFAULT_PROPS, PALETTES, PRESET_OPTIONS, presetProps } from './presets/Galaxy';

const PALETTE_OPTIONS = [
  { value: 'none', label: 'Hue Shift' },
  { value: 'stardust', label: 'Stardust' },
  { value: 'ice', label: 'Ice' },
  { value: 'gold', label: 'Gold' },
  { value: 'rose', label: 'Rose' }
];

const DIRECTION_OPTIONS = [
  { value: 'forward', label: 'Forward' },
  { value: 'backward', label: 'Backward' }
];

const propData: PropRow[] = [
  {
    name: 'starColors',
    type: 'string[]',
    default: '-',
    description: 'Up to four colors the stars are picked from. Replaces the hue shift and saturation coloring.'
  },
  { name: 'hueShift', type: 'number', default: '140', description: 'Shifts the hue of the stars, in degrees.' },
  { name: 'saturation', type: 'number', default: '0', description: 'Color saturation of the stars, from 0 to 1.' },
  { name: 'density', type: 'number', default: '1', description: 'How densely the stars are packed.' },
  { name: 'glowIntensity', type: 'number', default: '0.3', description: 'Brightness of the glow around each star.' },
  { name: 'starSize', type: 'number', default: '1', description: 'Size of each star glow.' },
  {
    name: 'flareIntensity',
    type: 'number',
    default: '1',
    description: 'Strength of the cross flares on the brightest stars.'
  },
  { name: 'twinkleIntensity', type: 'number', default: '0.3', description: 'How much the stars twinkle, from 0 to 1.' },
  { name: 'starSpeed', type: 'number', default: '0.5', description: 'How fast you travel through the stars.' },
  { name: 'speed', type: 'number', default: '1', description: 'Overall speed of the animation.' },
  { name: 'rotationSpeed', type: 'number', default: '0.1', description: 'How fast the starfield rotates.' },
  { name: 'layers', type: 'number', default: '4', description: 'Number of star layers, from 2 to 8.' },
  {
    name: 'direction',
    type: "'forward' | 'backward'",
    default: "'forward'",
    description: 'Whether you fly into the stars or drift back out of them.'
  },
  {
    name: 'mouseInteraction',
    type: 'boolean',
    default: 'true',
    description: 'Lets the cursor interact with the stars.'
  },
  {
    name: 'mouseRepulsion',
    type: 'boolean',
    default: 'true',
    description: 'Pushes the stars away from the cursor. When off, the field shifts with the cursor instead.'
  },
  {
    name: 'repulsionStrength',
    type: 'number',
    default: '2',
    description: 'Strength of the push away from the cursor.'
  },
  {
    name: 'autoCenterRepulsion',
    type: 'number',
    default: '0',
    description: 'Pushes the stars away from the center without the cursor. 0 turns it off.'
  },
  { name: 'clickWarp', type: 'boolean', default: 'true', description: 'Clicking jumps forward at warp speed.' },
  { name: 'intro', type: 'boolean', default: 'true', description: 'Drops out of warp speed on mount.' },
  {
    name: 'focal',
    type: '[number, number]',
    default: '[0.5, 0.5]',
    description: 'Center of the starfield, from 0 to 1.'
  },
  {
    name: 'rotation',
    type: '[number, number]',
    default: '[1, 0]',
    description: 'Fixed rotation of the starfield as a [cos, sin] pair.'
  },
  {
    name: 'transparent',
    type: 'boolean',
    default: 'true',
    description: 'Shows the page behind the stars. When off, the stars sit on the background color.'
  },
  {
    name: 'backgroundColor',
    type: 'string',
    default: "'#000000'",
    description: 'Background behind the stars when transparent is off, or the paper color in light mode.'
  },
  {
    name: 'lightMode',
    type: 'boolean',
    default: 'false',
    description: 'Draws the stars as ink for light backgrounds.'
  },
  { name: 'opacity', type: 'number', default: '1', description: 'Opacity of the whole effect.' },
  { name: 'disableAnimation', type: 'boolean', default: 'false', description: 'Freezes the animation.' },
  { name: 'dpr', type: 'number', default: 'auto', description: 'Maximum device pixel ratio, capped at 2.' },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the container.' },
  { name: 'style', type: 'CSSProperties', default: '-', description: 'Inline styles for the container.' }
];

const paletteName = (colors?: string[]) =>
  Object.keys(PALETTES).find(name => PALETTES[name].join(',') === (colors ?? []).join(',')) ?? 'none';

const { rerenderKey, forceRerender } = useForceRerender();
const { props, defaultProps, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);

const settings = computed(() => {
  const { preset: _preset, ...rest } = props.value;
  void _preset;
  return rest;
});

const paletteActive = computed(() => (settings.value.starColors?.length ?? 0) > 0);

const applyPreset = (value: string) => {
  updateProps({ ...presetProps(value, { defaults: defaultProps.value }), preset: value });
};
</script>
