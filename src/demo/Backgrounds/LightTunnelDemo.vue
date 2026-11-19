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
          <LightTunnel :key="rerenderKey" v-bind="settings" />
          <BackgroundContent headline="A fibre-optic tunnel of travelling light." />
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
            title="Fibre Color"
            :color="settings.cableColor"
            @change="(value: string) => updateProp('cableColor', value)"
          />
          <PreviewColorPickerCustom
            title="Pulse Color"
            :color="settings.pulseColor"
            @change="(value: string) => updateProp('pulseColor', value)"
          />
          <PreviewColorPickerCustom
            title="Tunnel Color"
            :color="settings.tunnelColor"
            @change="(value: string) => updateProp('tunnelColor', value)"
          />
          <PreviewSlider
            title="Tunnel Opacity"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.tunnelOpacity"
            @update:model-value="(value: number) => updateProp('tunnelOpacity', value)"
          />
          <PreviewSlider
            title="Brightness"
            :min="0.2"
            :max="2.5"
            :step="0.05"
            :model-value="settings.brightness"
            @update:model-value="(value: number) => updateProp('brightness', value)"
          />
          <PreviewSlider
            title="Speed"
            :min="0"
            :max="0.5"
            :step="0.01"
            :model-value="settings.speed"
            @update:model-value="(value: number) => updateProp('speed', value)"
          />
          <PreviewSelect
            title="Flow Direction"
            :options="FLOW_OPTIONS"
            :model-value="settings.flowDirection"
            @update:model-value="(value: string | number) => updateProp('flowDirection', value as 'inward' | 'outward')"
          />
          <PreviewSlider
            title="Pulse Speed"
            :min="0"
            :max="5"
            :step="0.05"
            :model-value="settings.pulseSpeed"
            @update:model-value="(value: number) => updateProp('pulseSpeed', value)"
          />
          <PreviewSlider
            title="Pulse Length"
            :min="0.05"
            :max="0.8"
            :step="0.01"
            :model-value="settings.pulseLength"
            @update:model-value="(value: number) => updateProp('pulseLength', value)"
          />
          <PreviewSlider
            title="Pulse Blend"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.pulseBlend"
            @update:model-value="(value: number) => updateProp('pulseBlend', value)"
          />
          <PreviewSlider
            title="Pulse Width"
            :min="0.2"
            :max="2.5"
            :step="0.05"
            :model-value="settings.pulseWidth"
            @update:model-value="(value: number) => updateProp('pulseWidth', value)"
          />
          <PreviewSlider
            title="Pulse Density"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.pulseDensity"
            @update:model-value="(value: number) => updateProp('pulseDensity', value)"
          />
          <PreviewSlider
            title="Fibres"
            :min="12"
            :max="140"
            :step="1"
            :model-value="settings.cableCount"
            @update:model-value="(value: number) => updateProp('cableCount', value)"
          />
          <PreviewSlider
            title="Thickness"
            :min="0.05"
            :max="1.2"
            :step="0.01"
            :model-value="settings.thickness"
            @update:model-value="(value: number) => updateProp('thickness', value)"
          />
          <PreviewSlider
            title="Glow"
            :min="0"
            :max="3"
            :step="0.05"
            :model-value="settings.glow"
            @update:model-value="(value: number) => updateProp('glow', value)"
          />
          <PreviewSlider
            title="Rim Width"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.rimWidth"
            @update:model-value="(value: number) => updateProp('rimWidth', value)"
          />
          <PreviewSlider
            title="Waviness"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.waviness"
            @update:model-value="(value: number) => updateProp('waviness', value)"
          />
          <PreviewSlider
            title="Sway"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.sway"
            @update:model-value="(value: number) => updateProp('sway', value)"
          />
          <PreviewSlider
            title="Bend"
            :min="0"
            :max="1.5"
            :step="0.01"
            :model-value="settings.bend"
            @update:model-value="(value: number) => updateProp('bend', value)"
          />
          <PreviewSlider
            title="Size"
            :min="0.3"
            :max="3"
            :step="0.05"
            :model-value="settings.size"
            @update:model-value="(value: number) => updateProp('size', value)"
          />
          <PreviewSlider
            title="Fade Near"
            :min="0.01"
            :max="0.8"
            :step="0.01"
            :model-value="settings.fadeNear"
            @update:model-value="(value: number) => updateProp('fadeNear', value)"
          />
          <PreviewSlider
            title="Fade Far"
            :min="0.6"
            :max="3"
            :step="0.05"
            :model-value="settings.fadeFar"
            @update:model-value="(value: number) => updateProp('fadeFar', value)"
          />
          <PreviewSlider
            title="Cursor Strength"
            :min="0"
            :max="0.4"
            :step="0.01"
            :model-value="settings.mouseStrength"
            :is-disabled="!settings.mouseInteraction"
            @update:model-value="(value: number) => updateProp('mouseStrength', value)"
          />
          <PreviewSwitch
            title="Cursor Steer"
            :model-value="settings.mouseInteraction"
            @update:model-value="(value: boolean) => updateProp('mouseInteraction', value)"
          />
          <PreviewSwitch
            title="Click Surge"
            :model-value="settings.clickSurge"
            @update:model-value="(value: boolean) => updateProp('clickSurge', value)"
          />
          <PreviewSwitch
            title="Color Variance"
            :model-value="settings.colorVariance"
            @update:model-value="(value: boolean) => updateProp('colorVariance', value)"
          />
          <PreviewSwitch
            title="Grain"
            :model-value="settings.grain"
            @update:model-value="(value: boolean) => updateProp('grain', value)"
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
        <CodeExample :code-object="lightTunnel" component-name="LightTunnel" />
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
import { lightTunnel } from '@/constants/code/Backgrounds/lightTunnelCode';
import LightTunnel from '@/content/Backgrounds/LightTunnel/LightTunnel.vue';
import { DEFAULT_PROPS, PRESET_OPTIONS, presetProps } from './presets/LightTunnel';

const FLOW_OPTIONS = [
  { value: 'inward', label: 'Inward' },
  { value: 'outward', label: 'Outward' }
];

const propData: PropRow[] = [
  { name: 'cableColor', type: 'string', default: "'#ffffff'", description: 'Color of the fibres.' },
  { name: 'pulseColor', type: 'string', default: "'#ffffff'", description: 'Color of the light pulses.' },
  {
    name: 'tunnelColor',
    type: 'string',
    default: "'#ffffff'",
    description: 'Color of the soft glow around the fibres, shown when tunnelOpacity is above 0.'
  },
  {
    name: 'tunnelOpacity',
    type: 'number',
    default: '0',
    description: 'Strength of the soft glow around the fibres that tints the tunnel walls.'
  },
  { name: 'speed', type: 'number', default: '0.1', description: 'Overall speed of the tunnel.' },
  {
    name: 'flowDirection',
    type: "'inward' | 'outward'",
    default: "'inward'",
    description: 'Whether the pulses race into the tunnel or rush out toward you.'
  },
  { name: 'pulseSpeed', type: 'number', default: '2', description: 'How fast the pulses travel.' },
  { name: 'pulseLength', type: 'number', default: '0.28', description: 'Length of each pulse and its tail.' },
  {
    name: 'pulseBlend',
    type: 'number',
    default: '0.6',
    description: 'Softness of the pulses, from crisp sparks (0) to long soft streaks (1).'
  },
  { name: 'pulseWidth', type: 'number', default: '1', description: 'Width of the pulses relative to the fibres.' },
  {
    name: 'pulseDensity',
    type: 'number',
    default: '0.5',
    description: 'How many pulses are travelling at once, from 0 to 1.'
  },
  { name: 'cableCount', type: 'number', default: '56', description: 'Number of fibres around the tunnel.' },
  { name: 'thickness', type: 'number', default: '0.35', description: 'Thickness of the fibres.' },
  { name: 'rimWidth', type: 'number', default: '0.15', description: 'How far the glow spreads around each pulse.' },
  { name: 'waviness', type: 'number', default: '0.3', description: 'How much the fibres swirl along the tunnel.' },
  { name: 'sway', type: 'number', default: '0.5', description: 'How much the tunnel slowly rocks back and forth.' },
  {
    name: 'bend',
    type: 'number',
    default: '0.4',
    description: 'How much the far end of the tunnel drifts and curves.'
  },
  { name: 'size', type: 'number', default: '1', description: 'Scale of the tunnel.' },
  { name: 'centerX', type: 'number', default: '0', description: 'Horizontal offset of the tunnel center.' },
  { name: 'centerY', type: 'number', default: '0', description: 'Vertical offset of the tunnel center.' },
  { name: 'glow', type: 'number', default: '1', description: 'Strength of the glow around the pulses.' },
  {
    name: 'fadeNear',
    type: 'number',
    default: '0.5',
    description: 'How far from the center the tunnel fades in. Higher values keep the middle clear.'
  },
  {
    name: 'fadeFar',
    type: 'number',
    default: '2',
    description: 'Distance at which the tunnel fades out at the edges.'
  },
  { name: 'brightness', type: 'number', default: '1', description: 'Overall brightness.' },
  {
    name: 'colorVariance',
    type: 'boolean',
    default: 'true',
    description: 'Gives every fibre a slightly different brightness.'
  },
  { name: 'grain', type: 'boolean', default: 'false', description: 'Adds a fine film grain to the light.' },
  { name: 'grainIntensity', type: 'number', default: '0.05', description: 'Strength of the grain.' },
  { name: 'opacity', type: 'number', default: '1', description: 'Opacity of the whole effect.' },
  {
    name: 'mouseInteraction',
    type: 'boolean',
    default: 'true',
    description: 'Steers the far end of the tunnel toward the cursor.'
  },
  { name: 'mouseStrength', type: 'number', default: '0.1', description: 'How far the cursor steers the tunnel.' },
  {
    name: 'clickSurge',
    type: 'boolean',
    default: 'true',
    description: 'Clicking sends a ring of light down the tunnel.'
  },
  { name: 'intro', type: 'boolean', default: 'true', description: 'Grows the tunnel out from the center on mount.' },
  {
    name: 'variation',
    type: 'number',
    default: '0',
    description: 'Picks a different arrangement of fibres and pulses.'
  },
  {
    name: 'lightMode',
    type: 'boolean',
    default: 'false',
    description: 'Draws the tunnel as ink for light backgrounds.'
  },
  { name: 'dpr', type: 'number', default: 'auto', description: 'Maximum device pixel ratio, capped at 2.' },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the container.' },
  { name: 'style', type: 'CSSProperties', default: '-', description: 'Inline styles for the container.' }
];

const { rerenderKey, forceRerender } = useForceRerender();
const { props, defaultProps, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);

const settings = computed(() => {
  const { preset: _preset, ...rest } = props.value;
  void _preset;
  return rest;
});

const applyPreset = (value: string) => {
  updateProps({ ...presetProps(value, { defaults: defaultProps.value }), preset: value });
};
</script>
