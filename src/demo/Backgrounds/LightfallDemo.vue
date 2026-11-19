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
          <Lightfall :key="rerenderKey" v-bind="settings" />
          <BackgroundContent headline="Let the light rain down" />
          <RefreshButton @click="forceRerender" />
        </div>

        <Customize>
          <PreviewColorList
            title="Colors"
            :min="1"
            :model-value="settings.colors"
            @update:model-value="(value: string[]) => updateProp('colors', value)"
          />
          <PreviewSelect
            title="Preset"
            :options="PRESET_OPTIONS"
            :model-value="props.preset"
            @update:model-value="value => applyPreset(String(value))"
          />
          <PreviewColorPickerCustom
            title="Background"
            :color="settings.backgroundColor"
            @change="(value: string) => updateProp('backgroundColor', value)"
          />
          <PreviewSlider
            title="Speed"
            :min="0"
            :max="3"
            :step="0.05"
            :model-value="settings.speed"
            @update:model-value="value => updateProp('speed', value)"
          />
          <PreviewSlider
            title="Streak Count"
            :min="1"
            :max="16"
            :step="1"
            :model-value="settings.streakCount"
            @update:model-value="value => updateProp('streakCount', value)"
          />
          <PreviewSlider
            title="Streak Width"
            :min="0.2"
            :max="4"
            :step="0.1"
            :model-value="settings.streakWidth"
            @update:model-value="value => updateProp('streakWidth', value)"
          />
          <PreviewSlider
            title="Streak Length"
            :min="0.3"
            :max="3"
            :step="0.1"
            :model-value="settings.streakLength"
            @update:model-value="value => updateProp('streakLength', value)"
          />
          <PreviewSlider
            title="Density"
            :min="0.3"
            :max="3"
            :step="0.1"
            :model-value="settings.density"
            @update:model-value="value => updateProp('density', value)"
          />
          <PreviewSlider
            title="Twinkle"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.twinkle"
            @update:model-value="value => updateProp('twinkle', value)"
          />
          <PreviewSlider
            title="Glow"
            :min="0.2"
            :max="3"
            :step="0.05"
            :model-value="settings.glow"
            @update:model-value="value => updateProp('glow', value)"
          />
          <PreviewSlider
            title="Background Glow"
            :min="0"
            :max="1.5"
            :step="0.02"
            :model-value="settings.backgroundGlow"
            @update:model-value="value => updateProp('backgroundGlow', value)"
          />
          <PreviewSlider
            title="Head Glow"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.headGlow"
            @update:model-value="value => updateProp('headGlow', value)"
          />
          <PreviewSlider
            title="Depth"
            :min="0"
            :max="2"
            :step="0.05"
            :model-value="settings.depth"
            @update:model-value="value => updateProp('depth', value)"
          />
          <PreviewSlider
            title="Bloom"
            :min="0"
            :max="1.5"
            :step="0.05"
            :model-value="settings.bloom"
            @update:model-value="value => updateProp('bloom', value)"
          />
          <PreviewSlider
            title="Zoom"
            :min="1"
            :max="5"
            :step="0.1"
            :model-value="settings.zoom"
            @update:model-value="value => updateProp('zoom', value)"
          />
          <PreviewSlider
            title="Cursor Strength"
            :min="0"
            :max="2"
            :step="0.05"
            :model-value="settings.mouseStrength"
            @update:model-value="value => updateProp('mouseStrength', value)"
          />
          <PreviewSlider
            title="Cursor Radius"
            :min="0.1"
            :max="1.5"
            :step="0.05"
            :model-value="settings.mouseRadius"
            @update:model-value="value => updateProp('mouseRadius', value)"
          />
          <PreviewSlider
            title="Lens"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.lens"
            @update:model-value="value => updateProp('lens', value)"
          />
          <PreviewSlider
            title="Fade"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.fade"
            @update:model-value="value => updateProp('fade', value)"
          />
          <PreviewSwitch
            title="Cursor"
            :model-value="settings.mouseInteraction"
            @update:model-value="value => updateProp('mouseInteraction', value)"
          />
          <PreviewSwitch
            title="Hold To Warp"
            :model-value="settings.holdToWarp"
            @update:model-value="value => updateProp('holdToWarp', value)"
          />
          <PreviewSwitch title="Intro" :model-value="settings.intro" @update:model-value="setIntro" />
          <PreviewSwitch
            title="Light Mode"
            :model-value="settings.lightMode"
            @update:model-value="value => updateProp('lightMode', value)"
          />
        </Customize>

        <PropTable :data="propData" />
      </template>

      <template #code>
        <CodeExample :code-object="lightfall" component-name="Lightfall" />
      </template>
    </TabsLayout>
  </ComponentPropsProvider>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import BackgroundContent from '@/components/common/BackgroundContent.vue';
import CodeExample from '@/components/common/CodeExample.vue';
import Customize from '@/components/common/Customize.vue';
import PreviewColorList from '@/components/common/PreviewColorList.vue';
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
import { lightfall } from '@/constants/code/Backgrounds/lightfallCode';
import Lightfall from '@/content/Backgrounds/Lightfall/Lightfall.vue';
import { DEFAULT_PROPS, PRESET_OPTIONS, presetProps } from './presets/Lightfall';

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

const propData: PropRow[] = [
  {
    name: 'colors',
    type: 'string[]',
    default: "['#ffffff']",
    description: 'Colors of the falling streaks, up to 8. Each streak picks one.'
  },
  {
    name: 'backgroundColor',
    type: 'string',
    default: "'#94a3b8'",
    description: 'Color of the soft light glowing at the top, where the streaks come from.'
  },
  {
    name: 'speed',
    type: 'number',
    default: '0.3',
    description: 'How fast the streaks fall.'
  },
  {
    name: 'streakCount',
    type: 'number',
    default: '2',
    description: 'Layers of streaks, from 1 to 16. More layers fill the tunnel.'
  },
  {
    name: 'streakWidth',
    type: 'number',
    default: '0.8',
    description: 'Thickness of the streaks.'
  },
  {
    name: 'streakLength',
    type: 'number',
    default: '1',
    description: 'Length of the glowing tails.'
  },
  {
    name: 'density',
    type: 'number',
    default: '0.6',
    description: 'How closely the streaks follow each other down the tunnel.'
  },
  {
    name: 'twinkle',
    type: 'number',
    default: '0.3',
    description: 'How much the streaks flicker, from 0 to 1.'
  },
  {
    name: 'glow',
    type: 'number',
    default: '1',
    description: 'Overall brightness.'
  },
  {
    name: 'backgroundGlow',
    type: 'number',
    default: '0.1',
    description: 'Brightness of the soft light at the top. 0 turns it off.'
  },
  {
    name: 'headGlow',
    type: 'number',
    default: '0.6',
    description: 'How white-hot the leading tips burn, from 0 to 1.'
  },
  {
    name: 'depth',
    type: 'number',
    default: '0.5',
    description: 'Dims streaks deep in the tunnel so the near ones stand out.'
  },
  {
    name: 'bloom',
    type: 'number',
    default: '0.35',
    description: 'Soft glow around the brightest tips.'
  },
  {
    name: 'zoom',
    type: 'number',
    default: '3',
    description: 'Field of view into the tunnel. Higher values zoom further in.'
  },
  {
    name: 'opacity',
    type: 'number',
    default: '1',
    description: 'Opacity of the whole effect.'
  },
  {
    name: 'mouseInteraction',
    type: 'boolean',
    default: 'true',
    description: 'The cursor bends the falling light like a lens and brightens the streaks near it.'
  },
  {
    name: 'mouseStrength',
    type: 'number',
    default: '0.4',
    description: 'How much the cursor brightens nearby streaks.'
  },
  {
    name: 'mouseRadius',
    type: 'number',
    default: '0.45',
    description: 'Reach of the cursor light.'
  },
  {
    name: 'mouseDampening',
    type: 'number',
    default: '0.15',
    description: 'How long the cursor light takes to catch up, in seconds. 0 follows instantly.'
  },
  {
    name: 'lens',
    type: 'number',
    default: '0.5',
    description: 'How strongly the cursor bends the streaks.'
  },
  {
    name: 'holdToWarp',
    type: 'boolean',
    default: 'true',
    description: 'Holding the pointer down speeds the streaks up into warp trails.'
  },
  {
    name: 'intro',
    type: 'boolean',
    default: 'true',
    description: 'The light arrives at warp speed and slows to a steady fall.'
  },
  {
    name: 'fade',
    type: 'number',
    default: '0',
    description: 'Fades the edges into the page, from 0 to 1.'
  },
  {
    name: 'lightMode',
    type: 'boolean',
    default: 'false',
    description: 'Draws the streaks as colored light on a white background.'
  },
  {
    name: 'mixBlendMode',
    type: 'string',
    default: 'undefined',
    description: 'CSS blend mode for the canvas, such as screen or lighten.'
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
  },
  {
    name: 'style',
    type: 'CSSProperties',
    default: '-',
    description: 'Inline styles for the container.'
  }
];
</script>
