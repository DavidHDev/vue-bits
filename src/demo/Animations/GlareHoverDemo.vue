<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
    :demo-only-props="['preset']"
    :computed-props="computedProps"
  >
    <TabsLayout>
      <template #preview>
        <div class="demo-container relative overflow-hidden" style="height: 460px">
          <GlareHover :key="rerenderKey" width="min(360px, 82vw)" border-radius="20px" v-bind="settings">
            <img
              :src="photo"
              alt=""
              draggable="false"
              style="width: 100%; aspect-ratio: 3 / 2; object-fit: cover; display: block"
            />
          </GlareHover>
          <RefreshButton @click="forceRerender" />
        </div>

        <Customize>
          <PreviewSelect
            title="Preset"
            :options="PRESET_OPTIONS"
            :model-value="props.preset"
            @update:model-value="value => applyPreset(String(value))"
          />
          <PreviewColorPickerCustom
            title="Glare Color"
            :color="settings.glareColor"
            @change="(value: string) => updateProp('glareColor', value)"
          />
          <PreviewSelect
            title="Mode"
            :options="MODE_OPTIONS"
            :model-value="settings.mode"
            @update:model-value="value => updateProp('mode', value as Mode)"
          />
          <PreviewSelect
            title="Variant"
            :options="VARIANT_OPTIONS"
            :model-value="settings.variant"
            @update:model-value="value => updateProp('variant', value as Variant)"
          />
          <PreviewSelect
            title="Blend"
            :options="BLEND_OPTIONS"
            :model-value="settings.blendMode"
            @update:model-value="value => updateProp('blendMode', String(value))"
          />
          <PreviewSlider
            title="Opacity"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.glareOpacity"
            @update:model-value="value => updateProp('glareOpacity', value)"
          />
          <PreviewSlider
            title="Size"
            :min="5"
            :max="80"
            :step="1"
            value-unit="%"
            :model-value="settings.glareSize"
            @update:model-value="value => updateProp('glareSize', value)"
          />
          <PreviewSlider
            title="Softness"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.softness"
            @update:model-value="value => updateProp('softness', value)"
          />
          <PreviewSlider
            title="Angle"
            :min="-90"
            :max="90"
            :step="1"
            value-unit="°"
            :model-value="settings.glareAngle"
            @update:model-value="value => updateProp('glareAngle', value)"
          />
          <PreviewSlider
            title="Duration"
            :min="200"
            :max="2000"
            :step="50"
            value-unit="ms"
            :model-value="settings.transitionDuration"
            @update:model-value="value => updateProp('transitionDuration', value)"
          />
          <PreviewSlider
            v-if="settings.mode === 'loop'"
            title="Interval"
            :min="1"
            :max="8"
            :step="0.5"
            value-unit="s"
            :model-value="settings.interval"
            @update:model-value="value => updateProp('interval', value)"
          />
          <PreviewSwitch
            title="Rim Glint"
            :model-value="settings.rimGlint"
            @update:model-value="value => updateProp('rimGlint', value)"
          />
          <PreviewSwitch
            v-if="settings.mode === 'hover'"
            title="Play Once"
            :model-value="settings.playOnce"
            @update:model-value="value => updateProp('playOnce', value)"
          />
          <PreviewSwitch title="Intro" :model-value="settings.intro" @update:model-value="setIntro" />
        </Customize>

        <PropTable :data="propData" />
      </template>

      <template #code>
        <CodeExample :code-object="glareHover" component-name="GlareHover" />
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
import { glareHover } from '@/constants/code/Animations/glareHoverCode';
import GlareHover from '@/content/Animations/GlareHover/GlareHover.vue';

type Mode = 'hover' | 'follow' | 'loop' | 'click';
type Variant = 'streak' | 'twin' | 'sheen';

const LOOK = {
  mode: 'hover' as Mode,
  variant: 'streak' as Variant,
  glareOpacity: 0.5,
  glareSize: 30,
  softness: 0.6,
  glareAngle: -45,
  transitionDuration: 650,
  interval: 3
};

type Look = typeof LOOK;

const PRESETS: Record<string, Look> = {
  sweep: { ...LOOK },
  twin: {
    ...LOOK,
    variant: 'twin',
    glareOpacity: 0.6,
    glareSize: 40,
    softness: 0.4,
    glareAngle: -60,
    transitionDuration: 800
  },
  follow: {
    ...LOOK,
    mode: 'follow',
    variant: 'sheen',
    glareOpacity: 0.45,
    glareSize: 55,
    softness: 0.8,
    glareAngle: -30
  },
  shine: {
    ...LOOK,
    mode: 'loop',
    glareOpacity: 0.7,
    glareSize: 16,
    softness: 0.3,
    glareAngle: -60,
    transitionDuration: 900,
    interval: 2.5
  }
};

const DEFAULT_PROPS = {
  preset: 'sweep',
  ...LOOK,
  glareColor: '#ffffff',
  blendMode: 'screen',
  rimGlint: true,
  playOnce: false,
  intro: false
};

const PRESET_OPTIONS = [
  { value: 'sweep', label: 'Sweep' },
  { value: 'twin', label: 'Twin' },
  { value: 'follow', label: 'Follow' },
  { value: 'shine', label: 'Shine' }
];

const MODE_OPTIONS = [
  { value: 'hover', label: 'Hover' },
  { value: 'follow', label: 'Follow' },
  { value: 'loop', label: 'Loop' },
  { value: 'click', label: 'Click' }
];

const VARIANT_OPTIONS = [
  { value: 'streak', label: 'Streak' },
  { value: 'twin', label: 'Twin' },
  { value: 'sheen', label: 'Sheen' }
];

const BLEND_OPTIONS = [
  { value: 'screen', label: 'Screen' },
  { value: 'normal', label: 'Normal' },
  { value: 'overlay', label: 'Overlay' },
  { value: 'soft-light', label: 'Soft Light' }
];

const propData: PropRow[] = [
  { name: 'children', type: 'slot', default: '-', description: 'The content the glare passes over.' },
  {
    name: 'mode',
    type: "'hover' | 'follow' | 'loop' | 'click'",
    default: "'hover'",
    description: 'Sweep on hover, follow the cursor, shine on a timer, or sweep on click.'
  },
  {
    name: 'variant',
    type: "'streak' | 'twin' | 'sheen'",
    default: "'streak'",
    description: 'Shape of the glare: one bright streak, a double streak like glass, or a soft wide sheen.'
  },
  { name: 'glareColor', type: 'string', default: "'#ffffff'", description: 'Color of the glare. Any CSS color.' },
  { name: 'glareOpacity', type: 'number', default: '0.5', description: 'Brightness of the glare, from 0 to 1.' },
  {
    name: 'glareSize',
    type: 'number',
    default: '30',
    description: "Width of the glare as a percentage of the element's diagonal."
  },
  { name: 'softness', type: 'number', default: '0.6', description: 'How soft the core of the glare is, from 0 to 1.' },
  { name: 'glareAngle', type: 'number', default: '-45', description: 'Direction the glare travels, in degrees.' },
  {
    name: 'blendMode',
    type: 'string',
    default: "'screen'",
    description: 'How the glare mixes with the content: screen, normal, overlay or soft-light.'
  },
  {
    name: 'rimGlint',
    type: 'boolean',
    default: 'true',
    description: 'Lets the edge catch the light where the glare crosses it.'
  },
  {
    name: 'transitionDuration',
    type: 'number',
    default: '650',
    description: 'How long one sweep takes, in milliseconds.'
  },
  { name: 'interval', type: 'number', default: '3', description: 'Seconds between shines in loop mode.' },
  {
    name: 'playOnce',
    type: 'boolean',
    default: 'false',
    description: 'In hover mode, sweeps only on the way in instead of again on the way out.'
  },
  {
    name: 'intro',
    type: 'boolean',
    default: 'false',
    description: 'Sweeps once when the element first scrolls into view.'
  },
  { name: 'width', type: 'string', default: "'auto'", description: 'Width of the element.' },
  { name: 'height', type: 'string', default: "'auto'", description: 'Height of the element.' },
  { name: 'background', type: 'string', default: "'transparent'", description: 'Background of the element.' },
  { name: 'borderRadius', type: 'string', default: "'10px'", description: 'Corner radius of the element.' },
  { name: 'borderColor', type: 'string', default: "'transparent'", description: 'Border color of the element.' },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the element.' },
  { name: 'style', type: 'StyleValue', default: '{}', description: 'Inline styles for the element.' }
];

const { rerenderKey, forceRerender } = useForceRerender();
const { props, defaultProps, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);

const settings = computed(() => {
  const { preset: _preset, ...rest } = props.value;
  return rest;
});

const theme = useColorModeValue('light', 'dark');
const photo = computed(() => `/assets/demo/${theme.value === 'light' ? 'day' : 'night'}-sky.webp`);

const computedProps = { width: '360px', height: '240px', borderRadius: '20px' };

const applyPreset = (value: string) => {
  const base = Object.fromEntries(
    Object.keys(LOOK).map(name => [name, defaultProps.value[name as keyof Look]])
  ) as Partial<Look>;
  updateProps({ ...base, ...PRESETS[value], preset: value });
};

const setIntro = (value: boolean) => {
  updateProp('intro', value);
  forceRerender();
};
</script>
