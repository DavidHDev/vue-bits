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
          <Silk :key="rerenderKey" v-bind="settings" />
          <BackgroundContent headline="Silk touch is a good enhancement, Steve!" />
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
            title="Sheen Color"
            :color="settings.sheenColor"
            @change="(value: string) => updateProp('sheenColor', value)"
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
            title="Depth"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.depth"
            @update:model-value="(value: number) => updateProp('depth', value)"
          />
          <PreviewSlider
            title="Glow"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.glow"
            @update:model-value="(value: number) => updateProp('glow', value)"
          />
          <PreviewSlider
            title="Grain"
            :min="0"
            :max="5"
            :step="0.1"
            :model-value="settings.noiseIntensity"
            @update:model-value="(value: number) => updateProp('noiseIntensity', value)"
          />
          <PreviewSlider
            title="Speed"
            :min="0"
            :max="20"
            :step="0.1"
            :model-value="settings.speed"
            @update:model-value="(value: number) => updateProp('speed', value)"
          />
          <PreviewSlider
            title="Scale"
            :min="0.3"
            :max="3"
            :step="0.05"
            :model-value="settings.scale"
            @update:model-value="(value: number) => updateProp('scale', value)"
          />
          <PreviewSlider
            title="Rotation"
            :min="0"
            :max="6.28"
            :step="0.01"
            :model-value="settings.rotation"
            @update:model-value="(value: number) => updateProp('rotation', value)"
          />
          <PreviewSlider
            title="Ripple"
            :min="0"
            :max="3"
            :step="0.05"
            :model-value="settings.ripple"
            @update:model-value="(value: number) => updateProp('ripple', value)"
          />
          <PreviewSlider
            title="Wave"
            :min="0"
            :max="4"
            :step="0.05"
            :model-value="settings.wave"
            @update:model-value="(value: number) => updateProp('wave', value)"
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
            title="Interaction Strength"
            :min="0"
            :max="2"
            :step="0.05"
            :model-value="settings.interactionStrength"
            @update:model-value="(value: number) => updateProp('interactionStrength', value)"
          />
          <PreviewSlider
            title="Fade"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.fade"
            @update:model-value="(value: number) => updateProp('fade', value)"
          />
          <PreviewSwitch
            title="Mouse Interaction"
            :model-value="settings.mouseInteraction"
            @update:model-value="(value: boolean) => updateProp('mouseInteraction', value)"
          />
          <PreviewSwitch
            title="Click Ripple"
            :model-value="settings.clickRipple"
            @update:model-value="(value: boolean) => updateProp('clickRipple', value)"
          />
          <PreviewSwitch
            title="Intro"
            :model-value="settings.intro"
            @update:model-value="
              (value: boolean) => {
                updateProp('intro', value);
                forceRerender();
              }
            "
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
        <CodeExample :code-object="silk" component-name="Silk" />
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
import { silk } from '@/constants/code/Backgrounds/silkCode';
import Silk from '@/content/Backgrounds/Silk/Silk.vue';
import { DEFAULT_PROPS, PRESET_OPTIONS, presetProps } from './presets/Silk';

const propData: PropRow[] = [
  { name: 'color', type: 'string', default: "'#737b74'", description: 'Color of the silk.' },
  {
    name: 'sheenColor',
    type: 'string',
    default: "'#ffffff'",
    description: 'Tint of the glossy highlights, blended with the silk color.'
  },
  { name: 'speed', type: 'number', default: '5', description: 'How fast the folds flow.' },
  { name: 'scale', type: 'number', default: '1', description: 'Size of the folds. Higher values pack more in.' },
  { name: 'rotation', type: 'number', default: '0', description: 'Turns the folds, in radians.' },
  {
    name: 'noiseIntensity',
    type: 'number',
    default: '1.5',
    description: 'Strength of the fine grain over the fabric.'
  },
  {
    name: 'sheen',
    type: 'number',
    default: '0.5',
    description: 'Strength of the glossy highlights that run along the folds.'
  },
  {
    name: 'depth',
    type: 'number',
    default: '0.5',
    description: 'How deep the folds look, from flat at 0 to deep, shaded creases at 1.'
  },
  { name: 'glow', type: 'number', default: '0.3', description: 'Soft glow around the brightest folds.' },
  {
    name: 'ripple',
    type: 'number',
    default: '1',
    description: 'Strength of the fine ripples running through the folds. 0 smooths them out.'
  },
  { name: 'wave', type: 'number', default: '1', description: 'How much the folds sway as they flow.' },
  {
    name: 'variation',
    type: 'number',
    default: '0',
    description: 'Picks a different arrangement of folds. Any number works.'
  },
  {
    name: 'mouseInteraction',
    type: 'boolean',
    default: 'true',
    description: 'The light turns to follow the cursor and the fabric drags along with it.'
  },
  {
    name: 'interactionStrength',
    type: 'number',
    default: '1',
    description: 'How strongly the cursor moves the fabric and its light.'
  },
  {
    name: 'clickRipple',
    type: 'boolean',
    default: 'true',
    description: 'Clicking sends a ripple rolling through the fabric.'
  },
  {
    name: 'intro',
    type: 'boolean',
    default: 'true',
    description: 'The folds rise out of the dark and settle when the silk first appears.'
  },
  { name: 'fade', type: 'number', default: '0', description: 'Fades the edges into the page, from 0 to 1.' },
  {
    name: 'lightMode',
    type: 'boolean',
    default: 'false',
    description: 'Draws pale silk with white highlights for light backgrounds.'
  },
  { name: 'paused', type: 'boolean', default: 'false', description: 'Freezes the animation.' },
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
