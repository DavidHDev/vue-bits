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
          <Waves :key="rerenderKey" v-bind="settings" />
          <BackgroundContent headline="Make waves with every move." />
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
            title="Line Color"
            :color="settings.lineColor"
            @change="(value: string) => updateProp('lineColor', value)"
          />
          <PreviewColorPickerCustom
            title="Accent Color"
            :color="settings.accentColor"
            @change="(value: string) => updateProp('accentColor', value)"
          />
          <PreviewSelect
            title="Line Style"
            :options="STYLE_OPTIONS"
            :model-value="settings.lineStyle"
            @update:model-value="value => updateProp('lineStyle', String(value))"
          />
          <PreviewSlider
            title="Spacing"
            :min="4"
            :max="28"
            :step="1"
            value-unit="px"
            :model-value="settings.spacing"
            @update:model-value="value => updateProp('spacing', value)"
          />
          <PreviewSlider
            title="Line Width"
            :min="0.5"
            :max="3"
            :step="0.25"
            value-unit="px"
            :model-value="settings.lineWidth"
            @update:model-value="value => updateProp('lineWidth', value)"
          />
          <PreviewSlider
            title="Rotation"
            :min="0"
            :max="180"
            :step="1"
            value-unit="°"
            :model-value="settings.rotation"
            @update:model-value="value => updateProp('rotation', value)"
          />
          <PreviewSlider
            title="Amplitude"
            :min="0"
            :max="80"
            :step="1"
            value-unit="px"
            :model-value="settings.amplitude"
            @update:model-value="value => updateProp('amplitude', value)"
          />
          <PreviewSlider
            title="Scale"
            :min="0.4"
            :max="3"
            :step="0.05"
            :model-value="settings.scale"
            @update:model-value="value => updateProp('scale', value)"
          />
          <PreviewSlider
            title="Twist"
            :min="0"
            :max="2.5"
            :step="0.05"
            :model-value="settings.twist"
            @update:model-value="value => updateProp('twist', value)"
          />
          <PreviewSlider
            title="Speed"
            :min="0"
            :max="4"
            :step="0.05"
            :model-value="settings.speed"
            @update:model-value="value => updateProp('speed', value)"
          />
          <PreviewSlider
            title="Variation"
            :min="0"
            :max="20"
            :step="1"
            :model-value="settings.variation"
            @update:model-value="value => updateProp('variation', value)"
          />
          <PreviewSlider
            title="Mouse Radius"
            :min="60"
            :max="400"
            :step="5"
            value-unit="px"
            :is-disabled="!settings.mouseInteraction"
            :model-value="settings.mouseRadius"
            @update:model-value="value => updateProp('mouseRadius', value)"
          />
          <PreviewSlider
            title="Mouse Strength"
            :min="0"
            :max="2.5"
            :step="0.05"
            :is-disabled="!settings.mouseInteraction"
            :model-value="settings.mouseStrength"
            @update:model-value="value => updateProp('mouseStrength', value)"
          />
          <PreviewSlider
            title="Bounce"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.bounce"
            @update:model-value="value => updateProp('bounce', value)"
          />
          <PreviewSlider
            title="Return Duration"
            :min="0.3"
            :max="4"
            :step="0.1"
            value-unit="s"
            :model-value="settings.returnDuration"
            @update:model-value="value => updateProp('returnDuration', value)"
          />
          <PreviewSlider
            title="Fade"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.fade"
            @update:model-value="value => updateProp('fade', value)"
          />
          <PreviewSlider
            title="Opacity"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.opacity"
            @update:model-value="value => updateProp('opacity', value)"
          />
          <PreviewSwitch
            title="Mouse Interaction"
            :model-value="settings.mouseInteraction"
            @update:model-value="value => updateProp('mouseInteraction', value)"
          />
          <PreviewSwitch
            title="Click Ripple"
            :model-value="settings.clickRipple"
            @update:model-value="value => updateProp('clickRipple', value)"
          />
          <PreviewSwitch
            title="Intro"
            :model-value="settings.intro"
            @update:model-value="value => updateProp('intro', value)"
          />
          <PreviewSwitch
            title="Light Mode"
            :model-value="settings.lightMode"
            @update:model-value="value => updateProp('lightMode', value)"
          />
        </Customize>

        <PropTable :data="propData" />
      </template>

      <template #code>
        <CodeExample :code-object="waves" component-name="Waves" />
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
import { waves } from '@/constants/code/Backgrounds/wavesCode';
import Waves from '@/content/Backgrounds/Waves/Waves.vue';
import { DEFAULT_PROPS, PRESET_OPTIONS, presetProps } from './presets/Waves';

type LineStyle = 'solid' | 'dashed';

const STYLE_OPTIONS = [
  { value: 'solid', label: 'Solid' },
  { value: 'dashed', label: 'Dashed' }
];

const { rerenderKey, forceRerender } = useForceRerender();
const { props, defaultProps, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);

const settings = computed(() => {
  const { preset: _preset, ...rest } = props.value;
  void _preset;
  return { ...rest, lineStyle: rest.lineStyle as LineStyle };
});

const applyPreset = (value: string) => {
  updateProps({ ...presetProps(value, { defaults: defaultProps.value, props: settings.value }), preset: value });
};

const propData: PropRow[] = [
  { name: 'lineColor', type: 'string', default: "'#ffffff'", description: 'Color of the lines.' },
  {
    name: 'accentColor',
    type: 'string',
    default: 'lineColor',
    description: 'Color the lines take on where the cursor or a click pushes them.'
  },
  {
    name: 'backgroundColor',
    type: 'string',
    default: "'transparent'",
    description: 'Background behind the lines.'
  },
  {
    name: 'lineStyle',
    type: "'solid' | 'dashed'",
    default: "'solid'",
    description: 'Draws solid lines, or dashes that stream along them.'
  },
  { name: 'spacing', type: 'number', default: '10', description: 'Space between the lines, in px.' },
  { name: 'lineWidth', type: 'number', default: '1', description: 'Width of the lines, in px.' },
  { name: 'rotation', type: 'number', default: '0', description: 'Turns the lines, in degrees. 90 lays them flat.' },
  { name: 'amplitude', type: 'number', default: '32', description: 'How far the lines sway, in px.' },
  {
    name: 'scale',
    type: 'number',
    default: '1',
    description: 'Size of the wave pattern. Higher values make broader, calmer waves.'
  },
  {
    name: 'twist',
    type: 'number',
    default: '1',
    description: 'How much the waves twist the lines, gathering them into bright folds.'
  },
  { name: 'speed', type: 'number', default: '1', description: 'How fast the waves flow. 0 holds them still.' },
  { name: 'variation', type: 'number', default: '0', description: 'Picks a different wave pattern.' },
  {
    name: 'mouseInteraction',
    type: 'boolean',
    default: 'true',
    description: 'Moving the cursor drags the lines along with it.'
  },
  {
    name: 'mouseRadius',
    type: 'number',
    default: '175',
    description: 'Radius around the cursor that drags the lines, in px.'
  },
  { name: 'mouseStrength', type: 'number', default: '1', description: 'How hard a moving cursor drags the lines.' },
  {
    name: 'bounce',
    type: 'number',
    default: '0.5',
    description: 'How much the lines overshoot and wobble as they settle, from 0 to 1.'
  },
  {
    name: 'returnDuration',
    type: 'number',
    default: '1.4',
    description: 'Roughly how long the lines take to settle back, in seconds.'
  },
  { name: 'clickRipple', type: 'boolean', default: 'true', description: 'Clicking parts the lines in a soft ripple.' },
  {
    name: 'intro',
    type: 'boolean',
    default: 'true',
    description: 'Opens the lines from the center and swells the waves in on mount.'
  },
  { name: 'fade', type: 'number', default: '0', description: 'Fades the edges into the page, from 0 to 1.' },
  { name: 'opacity', type: 'number', default: '1', description: 'Opacity of the whole effect.' },
  {
    name: 'lightMode',
    type: 'boolean',
    default: 'false',
    description: 'Draws the lines as ink for light backgrounds.'
  },
  { name: 'paused', type: 'boolean', default: 'false', description: 'Freezes the waves.' },
  { name: 'dpr', type: 'number', default: 'auto', description: 'Maximum device pixel ratio, capped at 2.' },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the container.' },
  { name: 'style', type: 'CSSProperties', default: '-', description: 'Inline styles for the container.' }
];
</script>
