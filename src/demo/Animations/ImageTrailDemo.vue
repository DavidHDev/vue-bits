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
        <div class="demo-container relative overflow-hidden" style="height: 400px">
          <ImageTrail :key="rerenderKey" :items="ITEMS" v-bind="settings" />

          <div class="absolute flex flex-col items-center justify-center">
            <p class="demo-instruction" style="font-size: clamp(2rem, 6vw, 6rem); font-weight: 600; margin-bottom: 0">
              Hover Me.
            </p>
          </div>
        </div>

        <Customize>
          <PreviewSelect
            title="Preset"
            :options="PRESET_OPTIONS"
            :model-value="props.preset"
            @update:model-value="value => applyPreset(String(value))"
          />
          <PreviewSlider
            title="Size"
            :min="80"
            :max="320"
            :step="10"
            value-unit="px"
            :model-value="settings.size"
            @update:model-value="value => updateProp('size', value)"
          />
          <PreviewSlider
            title="Radius"
            :min="0"
            :max="60"
            :step="1"
            value-unit="px"
            :model-value="settings.radius"
            @update:model-value="value => updateProp('radius', value)"
          />
          <PreviewSlider
            title="Threshold"
            :min="20"
            :max="200"
            :step="5"
            value-unit="px"
            :model-value="settings.threshold"
            @update:model-value="value => updateProp('threshold', value)"
          />
          <PreviewSlider
            title="Lifetime"
            :min="0.1"
            :max="2"
            :step="0.05"
            value-unit="s"
            :model-value="settings.lifetime"
            @update:model-value="value => updateProp('lifetime', value)"
          />
          <PreviewSlider
            title="Appear Scale"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.appearScale"
            @update:model-value="value => updateProp('appearScale', value)"
          />
          <PreviewSlider
            title="Exit Scale"
            :min="0"
            :max="1.5"
            :step="0.05"
            :model-value="settings.exitScale"
            @update:model-value="value => updateProp('exitScale', value)"
          />
          <PreviewSlider
            title="Zoom"
            :min="1"
            :max="3"
            :step="0.1"
            :model-value="settings.zoom"
            @update:model-value="value => updateProp('zoom', value)"
          />
          <PreviewSlider
            title="Flash"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.flash"
            @update:model-value="value => updateProp('flash', value)"
          />
          <PreviewSlider
            title="Drift"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.drift"
            @update:model-value="value => updateProp('drift', value)"
          />
          <PreviewSlider
            title="Rotation"
            :min="0"
            :max="30"
            :step="1"
            value-unit="°"
            :model-value="settings.rotation"
            @update:model-value="value => updateProp('rotation', value)"
          />
          <PreviewSlider
            title="Size Variance"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.sizeVariance"
            @update:model-value="value => updateProp('sizeVariance', value)"
          />
          <PreviewSlider
            title="Stack"
            :min="0"
            :max="7"
            :step="1"
            :model-value="settings.stack"
            @update:model-value="value => updateProp('stack', value)"
          />
          <PreviewSlider
            title="Tilt"
            :min="0"
            :max="40"
            :step="1"
            value-unit="°"
            :model-value="settings.tilt"
            @update:model-value="value => updateProp('tilt', value)"
          />
          <PreviewSwitch
            title="Align to Motion"
            :model-value="settings.alignToMotion"
            @update:model-value="value => updateProp('alignToMotion', value)"
          />
        </Customize>

        <PropTable :data="propData" />
        <Dependencies :dependency-list="['gsap']" />
      </template>

      <template #code>
        <CodeExample :code-object="imageTrail" component-name="ImageTrail" />
      </template>
    </TabsLayout>
  </ComponentPropsProvider>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import CodeExample from '@/components/common/CodeExample.vue';
import Customize from '@/components/common/Customize.vue';
import Dependencies from '@/components/common/Dependencies.vue';
import PreviewSelect from '@/components/common/PreviewSelect.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import ComponentPropsProvider from '@/components/context/ComponentPropsProvider.vue';
import { useComponentProps } from '@/composables/useComponentProps';
import { useForceRerender } from '@/composables/useForceRerender';
import { imageTrail } from '@/constants/code/Animations/imageTrailCode';
import ImageTrail from '@/content/Animations/ImageTrail/ImageTrail.vue';
import { LOOK, PRESET_OPTIONS, presetProps } from './presets/ImageTrail';

const ITEMS = [
  'https://picsum.photos/id/287/300/300',
  'https://picsum.photos/id/1001/300/300',
  'https://picsum.photos/id/1025/300/300',
  'https://picsum.photos/id/1026/300/300',
  'https://picsum.photos/id/1027/300/300',
  'https://picsum.photos/id/1028/300/300',
  'https://picsum.photos/id/1029/300/300',
  'https://picsum.photos/id/1030/300/300'
];

const DEFAULT_PROPS = { preset: 'classic', ...LOOK };

const propData: PropRow[] = [
  { name: 'items', type: 'string[]', default: '[]', description: 'Image URLs shown in the trail, in order.' },
  {
    name: 'size',
    type: 'number | string',
    default: '190',
    description: 'Width of each image in pixels, or any CSS length.'
  },
  { name: 'aspectRatio', type: 'number', default: '1.1', description: 'Width divided by height for each image.' },
  { name: 'radius', type: 'number | string', default: '15', description: 'Corner radius of the images.' },
  {
    name: 'threshold',
    type: 'number',
    default: '80',
    description: 'How far the cursor travels, in pixels, before the next image appears.'
  },
  { name: 'lifetime', type: 'number', default: '0.4', description: 'Seconds an image stays before it fades out.' },
  {
    name: 'appearScale',
    type: 'number',
    default: '1',
    description:
      'Size an image starts at as it appears. 0 grows it from nothing and 1 shows it at full size right away.'
  },
  {
    name: 'zoom',
    type: 'number',
    default: '1',
    description: 'How far each photo starts zoomed in before settling inside its frame. 1 turns it off.'
  },
  { name: 'flash', type: 'number', default: '0', description: 'Brightness flash as an image appears, from 0 to 1.' },
  {
    name: 'exitScale',
    type: 'number',
    default: '0.2',
    description: 'Size an image shrinks or grows to while it fades out. 1 keeps its size.'
  },
  {
    name: 'drift',
    type: 'number',
    default: '0',
    description: 'How far images keep flying in the direction of the cursor as they fade, from 0 to 1.'
  },
  { name: 'rotation', type: 'number', default: '0', description: 'Random tilt of each image, in degrees.' },
  {
    name: 'sizeVariance',
    type: 'number',
    default: '0',
    description: 'Random size variation between images, from 0 to 1.'
  },
  {
    name: 'alignToMotion',
    type: 'boolean',
    default: 'false',
    description: 'Turns each image to face the direction the cursor is moving.'
  },
  {
    name: 'stack',
    type: 'number',
    default: '0',
    description:
      'Keeps this many of the newest images on screen in a pile, instead of fading each one on its own. 0 turns it off.'
  },
  {
    name: 'tilt',
    type: 'number',
    default: '0',
    description: 'Tilts images in 3D toward the edge where they appear, in degrees.'
  },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the container.' }
];

const { rerenderKey, forceRerender } = useForceRerender();
const { props, defaultProps, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);

const settings = computed(() => {
  const { preset: _preset, ...rest } = props.value;
  return rest;
});

const applyPreset = (value: string) => {
  updateProps({ ...presetProps(value, { defaults: defaultProps.value }), preset: value });
  forceRerender();
};
</script>
