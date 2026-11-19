<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
    :demo-only-props="['preset', 'scene']"
  >
    <TabsLayout>
      <template #preview>
        <div
          class="demo-container relative overflow-hidden"
          :style="{ height: '500px', padding: 0, background: look.background }"
        >
          <Noise v-bind="settings" />
        </div>

        <Customize>
          <PreviewSelect
            title="Preset"
            :options="PRESET_OPTIONS"
            :model-value="props.preset"
            @update:model-value="applyPreset"
          />
          <PreviewSlider
            title="Opacity"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="props.opacity"
            @update:model-value="value => updateProp('opacity', value)"
          />
          <PreviewSlider
            title="Size"
            :min="0.5"
            :max="4"
            :step="0.5"
            value-unit="px"
            :model-value="props.size"
            @update:model-value="value => updateProp('size', value)"
          />
          <PreviewSlider
            title="FPS"
            :min="0"
            :max="60"
            :step="1"
            :model-value="props.fps"
            @update:model-value="value => updateProp('fps', value)"
          />
          <PreviewSelect
            title="Blend"
            :options="BLEND_OPTIONS"
            :model-value="props.blendMode"
            @update:model-value="value => updateProp('blendMode', value as NoiseBlendMode)"
          />
          <PreviewSlider
            title="Contrast"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.contrast"
            @update:model-value="value => updateProp('contrast', value)"
          />
          <PreviewSlider
            title="Dust"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.dust"
            @update:model-value="value => updateProp('dust', value)"
          />
          <PreviewSlider
            title="Scratches"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.scratches"
            @update:model-value="value => updateProp('scratches', value)"
          />
          <PreviewSlider
            title="Scanlines"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.scanlines"
            @update:model-value="value => updateProp('scanlines', value)"
          />
          <PreviewSlider
            title="Flicker"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.flicker"
            @update:model-value="value => updateProp('flicker', value)"
          />
          <PreviewSwitch
            title="Colored"
            :model-value="props.colored"
            @update:model-value="value => updateProp('colored', value)"
          />
        </Customize>

        <PropTable :data="propData" />
      </template>

      <template #code>
        <CodeExample :code-object="noise" component-name="Noise" />
      </template>
    </TabsLayout>
  </ComponentPropsProvider>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import CodeExample from '@/components/common/CodeExample.vue';
import Customize from '@/components/common/Customize.vue';
import PreviewSelect from '@/components/common/PreviewSelect.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import ComponentPropsProvider from '@/components/context/ComponentPropsProvider.vue';
import { useComponentProps } from '@/composables/useComponentProps';
import { noise } from '@/constants/code/Animations/noiseCode';
import Noise, { type NoiseBlendMode } from '@/content/Animations/Noise/Noise.vue';
import { DEFAULT_PROPS, PRESET_OPTIONS, presetProps, type NoiseScene } from './presets/Noise';

const PHOTO = 'https://images.unsplash.com/photo-1762846818262-33c197852fa8?w=1600&q=80&auto=format&fit=crop';

const SCENES: Record<NoiseScene, { background: string }> = {
  photo: { background: `center / cover no-repeat url("${PHOTO}")` },
  studio: {
    background: 'radial-gradient(70% 90% at 50% 34%, #a29b92 0%, #7a746d 30%, #4b4743 62%, #262422 88%, #1c1b1a 100%)'
  },
  dark: { background: '#0b0b0d' },
  paper: { background: '#f3efe6' }
};

const BLEND_OPTIONS = [
  { value: 'normal', label: 'Normal' },
  { value: 'overlay', label: 'Overlay' },
  { value: 'soft-light', label: 'Soft Light' },
  { value: 'multiply', label: 'Multiply' },
  { value: 'screen', label: 'Screen' },
  { value: 'difference', label: 'Difference' }
];

const { props, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);

const settings = computed(() => {
  const { preset: _preset, scene: _scene, ...rest } = props.value;
  return rest;
});

const look = computed(() => SCENES[props.value.scene] ?? SCENES.photo);

const applyPreset = (value: string | number) => {
  updateProps({ ...presetProps(String(value)), preset: String(value) });
};

const propData: PropRow[] = [
  { name: 'opacity', type: 'number', default: '0.2', description: 'Strength of the grain, from 0 to 1.' },
  {
    name: 'size',
    type: 'number',
    default: '1',
    description: 'Size of each grain in CSS pixels. 0.5 is one device pixel on retina screens.'
  },
  {
    name: 'fps',
    type: 'number',
    default: '24',
    description: 'How many times per second the grain changes. 0 keeps it still, like a paper texture.'
  },
  {
    name: 'blendMode',
    type: "'normal' | 'overlay' | 'soft-light' | 'multiply' | 'screen' | 'difference'",
    default: "'overlay'",
    description:
      'How the grain mixes with what is underneath. Overlay and soft light add texture without graying the image.'
  },
  {
    name: 'contrast',
    type: 'number',
    default: '0.6',
    description: 'From soft, fine grain at 0 to harsh, punchy grain at 1.'
  },
  {
    name: 'dust',
    type: 'number',
    default: '0',
    description: 'Specks, hairs and fibers that flicker over the frame like dust on a film print, from 0 to 1.'
  },
  {
    name: 'scratches',
    type: 'number',
    default: '0',
    description: 'How often thin vertical scratches run down the frame for a few seconds, from 0 to 1.'
  },
  { name: 'colored', type: 'boolean', default: 'false', description: 'Uses colored grain instead of gray.' },
  {
    name: 'scanlines',
    type: 'number',
    default: '0',
    description: 'Adds rolling horizontal lines, like an old screen, from 0 to 1.'
  },
  {
    name: 'flicker',
    type: 'number',
    default: '0',
    description: 'Makes the grain strength jump a little every frame, like a film projector.'
  },
  {
    name: 'fixed',
    type: 'boolean',
    default: 'false',
    description: 'Covers the whole viewport instead of the nearest positioned parent.'
  },
  { name: 'zIndex', type: 'number', default: '-', description: 'Stacking order of the overlay.' },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the overlay.' },
  { name: 'style', type: 'CSSProperties', default: '-', description: 'Inline styles for the overlay.' }
];
</script>
