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
          <Lightning :key="rerenderKey" v-bind="settings" />
          <BackgroundContent headline="Click anywhere to call down a strike" />
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
          <PreviewSlider
            title="Bolts"
            :min="1"
            :max="4"
            :step="1"
            :model-value="settings.bolts"
            @update:model-value="(value: number) => updateProp('bolts', value)"
          />
          <PreviewSlider
            title="Spread"
            :min="0.2"
            :max="1.5"
            :step="0.05"
            :model-value="settings.spread"
            @update:model-value="(value: number) => updateProp('spread', value)"
          />
          <PreviewSlider
            title="Branches"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.branches"
            @update:model-value="(value: number) => updateProp('branches', value)"
          />
          <PreviewSlider
            title="X Offset"
            :min="-1.5"
            :max="1.5"
            :step="0.05"
            :model-value="settings.xOffset"
            @update:model-value="(value: number) => updateProp('xOffset', value)"
          />
          <PreviewSlider
            title="Angle"
            :min="-90"
            :max="90"
            :step="1"
            value-unit="°"
            :model-value="settings.angle"
            @update:model-value="(value: number) => updateProp('angle', value)"
          />
          <PreviewSlider
            title="Size"
            :min="0.4"
            :max="3"
            :step="0.05"
            :model-value="settings.size"
            @update:model-value="(value: number) => updateProp('size', value)"
          />
          <PreviewSlider
            title="Thickness"
            :min="0"
            :max="3"
            :step="0.05"
            :model-value="settings.thickness"
            @update:model-value="(value: number) => updateProp('thickness', value)"
          />
          <PreviewSlider
            title="Glow"
            :min="0.2"
            :max="2.5"
            :step="0.05"
            :model-value="settings.glow"
            @update:model-value="(value: number) => updateProp('glow', value)"
          />
          <PreviewSlider
            title="Intensity"
            :min="0.2"
            :max="2.5"
            :step="0.05"
            :model-value="settings.intensity"
            @update:model-value="(value: number) => updateProp('intensity', value)"
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
            title="Flicker"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.flicker"
            @update:model-value="(value: number) => updateProp('flicker', value)"
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
            title="Fade"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.fade"
            @update:model-value="(value: number) => updateProp('fade', value)"
          />
          <PreviewSlider
            title="Opacity"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.opacity"
            @update:model-value="(value: number) => updateProp('opacity', value)"
          />
          <PreviewSwitch
            title="Mouse Interaction"
            :model-value="settings.mouseInteraction"
            @update:model-value="(value: boolean) => updateProp('mouseInteraction', value)"
          />
          <PreviewSwitch
            title="Click Strike"
            :model-value="settings.clickStrike"
            @update:model-value="(value: boolean) => updateProp('clickStrike', value)"
          />
          <PreviewSwitch title="Intro" :model-value="settings.intro" @update:model-value="setIntro" />
          <PreviewSwitch
            title="Light Mode"
            :model-value="settings.lightMode"
            @update:model-value="(value: boolean) => updateProp('lightMode', value)"
          />
        </Customize>

        <PropTable :data="propData" />
      </template>

      <template #code>
        <CodeExample :code-object="lightning" component-name="Lightning" />
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
import { lightning } from '@/constants/code/Backgrounds/lightningCode';
import Lightning from '@/content/Backgrounds/Lightning/Lightning.vue';
import { DEFAULT_PROPS, PRESET_OPTIONS, presetProps } from './presets/Lightning';

const propData: PropRow[] = [
  {
    name: 'color',
    type: 'string',
    default: "'#4d6bff'",
    description: 'Color of the lightning. The hottest parts glow white.'
  },
  { name: 'bolts', type: 'number', default: '1', description: 'How many bolts to draw, from 1 to 4.' },
  { name: 'spread', type: 'number', default: '0.6', description: 'Space between bolts when there is more than one.' },
  {
    name: 'branches',
    type: 'number',
    default: '0.5',
    description: 'How many side branches split off and flash along the bolts, from 0 to 1.'
  },
  { name: 'xOffset', type: 'number', default: '0', description: 'Moves the bolts sideways.' },
  { name: 'angle', type: 'number', default: '0', description: 'Tilts the bolts, in degrees. 90 runs them across.' },
  { name: 'size', type: 'number', default: '1', description: 'Scale of the jagged path. Higher is more crooked.' },
  { name: 'thickness', type: 'number', default: '1', description: 'Thickness of the bright core.' },
  { name: 'glow', type: 'number', default: '1', description: 'How far the glow spreads around the bolts.' },
  { name: 'intensity', type: 'number', default: '1', description: 'Overall brightness.' },
  {
    name: 'speed',
    type: 'number',
    default: '1',
    description: 'How fast the bolts crawl. The motion loops seamlessly every 10 seconds at 1.'
  },
  {
    name: 'flicker',
    type: 'number',
    default: '0.6',
    description: 'Strength of the flicker and sudden flashes, from 0 to 1.'
  },
  {
    name: 'mouseInteraction',
    type: 'boolean',
    default: 'true',
    description: 'Bolts bend toward the cursor, crackle and grow extra branches near it.'
  },
  {
    name: 'mouseStrength',
    type: 'number',
    default: '1',
    description: 'How strongly the bolts bend toward the cursor.'
  },
  {
    name: 'clickStrike',
    type: 'boolean',
    default: 'true',
    description: 'Clicking calls down a bolt that strikes the spot and briefly flashes the others.'
  },
  {
    name: 'intro',
    type: 'boolean',
    default: 'true',
    description: 'Lets the bolts descend from the top on first load.'
  },
  { name: 'fade', type: 'number', default: '0', description: 'Fades the edges into the page, from 0 to 1.' },
  { name: 'opacity', type: 'number', default: '1', description: 'Opacity of the whole effect.' },
  {
    name: 'lightMode',
    type: 'boolean',
    default: 'false',
    description: 'Draws the lightning as crisp ink strokes for light backgrounds.'
  },
  { name: 'paused', type: 'boolean', default: 'false', description: 'Freezes the animation.' },
  { name: 'dpr', type: 'number', default: 'auto', description: 'Maximum device pixel ratio, capped at 2.' },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the canvas.' },
  { name: 'style', type: 'CSSProperties', default: '-', description: 'Inline styles for the canvas.' }
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

const setIntro = (value: boolean) => {
  updateProp('intro', value);
  forceRerender();
};
</script>
