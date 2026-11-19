<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
    :demo-only-props="['color']"
    :computed-props="{ colors }"
  >
    <TabsLayout>
      <template #preview>
        <div class="demo-container relative overflow-hidden" style="height: 500px; padding: 0">
          <ColorBends
            :rotation="props.rotation"
            :auto-rotate="props.autoRotate"
            :speed="props.speed"
            :scale="props.scale"
            :frequency="props.frequency"
            :warp-strength="props.warpStrength"
            :mouse-influence="props.mouseInfluence"
            :parallax="props.parallax"
            :noise="props.noise"
            :iterations="props.iterations"
            :intensity="props.intensity"
            :band-width="props.bandWidth"
            :colors="colors"
          />

          <BackgroundContent pill-text="New Background" headline="You have the power to reshape your own destiny" />
        </div>

        <Customize>
          <PreviewColorPickerCustom
            title="Color"
            :color="props.color"
            @change="(value: string) => updateProp('color', value)"
          />
          <PreviewSlider
            title="Rotation (deg)"
            :min="-180"
            :max="180"
            :step="1"
            :model-value="props.rotation"
            @update:model-value="(value: number) => updateProp('rotation', value)"
          />
          <PreviewSlider
            title="Auto Rotate (deg/s)"
            :min="-5"
            :max="5"
            :step="1"
            :model-value="props.autoRotate"
            @update:model-value="(value: number) => updateProp('autoRotate', value)"
          />
          <PreviewSlider
            title="Speed"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="props.speed"
            @update:model-value="(value: number) => updateProp('speed', value)"
          />
          <PreviewSlider
            title="Scale"
            :min="0.2"
            :max="5"
            :step="0.1"
            :model-value="props.scale"
            @update:model-value="(value: number) => updateProp('scale', value)"
          />
          <PreviewSlider
            title="Frequency"
            :min="0.0"
            :max="5"
            :step="0.1"
            :model-value="props.frequency"
            @update:model-value="(value: number) => updateProp('frequency', value)"
          />
          <PreviewSlider
            title="Warp Strength"
            :min="0.9"
            :max="1"
            :step="0.005"
            :model-value="props.warpStrength"
            @update:model-value="(value: number) => updateProp('warpStrength', value)"
          />
          <PreviewSlider
            title="Mouse Influence"
            :min="0"
            :max="2"
            :step="0.05"
            :model-value="props.mouseInfluence"
            @update:model-value="(value: number) => updateProp('mouseInfluence', value)"
          />
          <PreviewSlider
            title="Parallax"
            :min="0"
            :max="2"
            :step="0.05"
            :model-value="props.parallax"
            @update:model-value="(value: number) => updateProp('parallax', value)"
          />
          <PreviewSlider
            title="Noise"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="props.noise"
            @update:model-value="(value: number) => updateProp('noise', value)"
          />
          <PreviewSlider
            title="Iterations"
            :min="1"
            :max="5"
            :step="1"
            :model-value="props.iterations"
            @update:model-value="(value: number) => updateProp('iterations', value)"
          />
          <PreviewSlider
            title="Intensity"
            :min="0.1"
            :max="2"
            :step="0.1"
            :model-value="props.intensity"
            @update:model-value="(value: number) => updateProp('intensity', value)"
          />
          <PreviewSlider
            title="Band Width"
            :min="1"
            :max="20"
            :step="0.5"
            :model-value="props.bandWidth"
            @update:model-value="(value: number) => updateProp('bandWidth', value)"
          />
        </Customize>

        <PropTable :data="propData" />
        <Dependencies :dependency-list="['three']" />
      </template>

      <template #code>
        <CodeExample :code-object="colorBends" component-name="ColorBends" />
      </template>
    </TabsLayout>
  </ComponentPropsProvider>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import BackgroundContent from '@/components/common/BackgroundContent.vue';
import CodeExample from '@/components/common/CodeExample.vue';
import Customize from '@/components/common/Customize.vue';
import Dependencies from '@/components/common/Dependencies.vue';
import PreviewColorPickerCustom from '@/components/common/PreviewColorPickerCustom.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import ComponentPropsProvider from '@/components/context/ComponentPropsProvider.vue';
import { useComponentProps } from '@/composables/useComponentProps';
import { colorBends } from '@/constants/code/Backgrounds/colorBendsCode';
import ColorBends from '@/content/Backgrounds/ColorBends/ColorBends.vue';

const DEFAULT_PROPS = {
  rotation: 90,
  autoRotate: 0,
  speed: 0.2,
  scale: 1,
  frequency: 1,
  warpStrength: 1,
  mouseInfluence: 1,
  parallax: 0.5,
  noise: 0.15,
  iterations: 1,
  intensity: 1.5,
  bandWidth: 6,
  color: '#7cff67'
};

const { props, updateProp, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);

const colors = computed(() => [props.value.color]);

const propData: PropRow[] = [
  { name: 'rotation', type: 'number', default: '90', description: 'Base rotation angle in degrees.' },
  { name: 'autoRotate', type: 'number', default: '0', description: 'Automatic rotation speed in degrees/sec.' },
  { name: 'speed', type: 'number', default: '0.2', description: 'Animation time scale of the shader.' },
  {
    name: 'colors',
    type: 'string[]',
    default: '[]',
    description: 'Palette of up to 8 hex colors used to blend the bends.'
  },
  {
    name: 'transparent',
    type: 'boolean',
    default: 'true',
    description: 'Whether the background is transparent (uses alpha).'
  },
  { name: 'scale', type: 'number', default: '1', description: 'Zoom factor of the pattern.' },
  { name: 'frequency', type: 'number', default: '1', description: 'Wave frequency used in the pattern.' },
  {
    name: 'warpStrength',
    type: 'number',
    default: '1',
    description: 'Amount of warping/distortion applied to waves.'
  },
  {
    name: 'mouseInfluence',
    type: 'number',
    default: '1',
    description: 'How strongly the waves react to pointer movement.'
  },
  {
    name: 'parallax',
    type: 'number',
    default: '0.5',
    description: 'Parallax factor shifting content with pointer.'
  },
  { name: 'noise', type: 'number', default: '0.15', description: 'Adds subtle grain. 0 disables noise.' },
  {
    name: 'iterations',
    type: 'number',
    default: '1',
    description: 'Number of extra warp passes (1-5). Higher values create more complex patterns.'
  },
  {
    name: 'intensity',
    type: 'number',
    default: '1.5',
    description: 'Brightness multiplier for the final color output.'
  },
  { name: 'bandWidth', type: 'number', default: '6', description: 'Controls the width/falloff of each color band.' },
  { name: 'className', type: 'string', default: "''", description: 'Additional CSS classes for the container.' },
  { name: 'style', type: 'CSSProperties', default: '{}', description: 'Inline styles for the container.' }
];
</script>
