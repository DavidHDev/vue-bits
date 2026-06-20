<template>
  <h1 class="sub-category">Model Viewer</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="modelViewer.usage"
    :source="modelViewerSource"
    component-name="ModelViewer"
    :props-table="propData"
  >
    <template #preview>
      <div class="demo-container model-viewer-demo h-[400px] overflow-hidden p-0">
        <span v-if="isTextVisible" class="model-viewer-demo-text">{{ textMap[selectedModel] }}</span>

        <ModelViewer
          :key="`${selectedModel}-${environmentPreset}-${rerenderKey}`"
          :url="urlMap[selectedModel]"
          width="100%"
          height="100%"
          :max-zoom-distance="0.7"
          :model-x-offset="modelXOffset"
          :model-y-offset="modelYOffset"
          :enable-mouse-parallax="enableMouseParallax"
          :enable-hover-rotation="enableHoverRotation"
          :environment-preset="environmentPreset"
          :fade-in="fadeIn"
          :auto-rotate="autoRotate"
          :auto-rotate-speed="autoRotateSpeed"
          :show-screenshot-button="showScreenshotButton"
          @model-loaded="isTextVisible = true"
        />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSelect title="Model" v-model="selectedModel" :options="modelOptions" />

        <PreviewSelect title="Environment" v-model="environmentPreset" :options="environmentOptions" />

        <PreviewSlider title="Horizontal Offset" v-model="modelXOffset" :min="-1" :max="1" :step="0.1" />

        <PreviewSlider title="Vertical Offset" v-model="modelYOffset" :min="-1" :max="1" :step="0.1" />

        <PreviewSwitch title="Mouse Parallax" v-model="enableMouseParallax" />

        <PreviewSwitch title="Hover Rotation" v-model="enableHoverRotation" />

        <PreviewSwitch title="Screenshot Button" v-model="showScreenshotButton" />

        <PreviewSwitch title="Fade In On Load" v-model="fadeIn" />

        <PreviewSwitch title="Auto Rotate" v-model="autoRotate" />

        <PreviewSlider
          title="Rotate Speed"
          v-model="autoRotateSpeed"
          :min="0.1"
          :max="2"
          :step="0.1"
          :disabled="!autoRotate"
        />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="propData" />
    </template>

    <template #code>
      <DemoCodeTab slug="model-viewer" :usage="modelViewer.usage!" :source="modelViewerSource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewSelect from '@/components/common/PreviewSelect.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { modelViewer } from '@/constants/code/Components/modelViewerCode';
import ModelViewer from '@/content/Components/ModelViewer/ModelViewer.vue';
import modelViewerSource from '@/content/Components/ModelViewer/ModelViewer.vue?raw';
import { computed, ref, watch } from 'vue';

type ModelKey = 'toyCar' | 'sheenChair';
type EnvironmentPreset = 'city' | 'sunset' | 'night' | 'dawn' | 'studio' | 'hangar' | 'urban' | 'modern' | 'none';

const { rerenderKey, forceRerender } = useForceRerender();

const DEFAULTS = {
  selectedModel: 'toyCar' as ModelKey,
  environmentPreset: 'city' as EnvironmentPreset,
  modelXOffset: 0.5,
  modelYOffset: 0,
  enableMouseParallax: true,
  enableHoverRotation: true,
  showScreenshotButton: true,
  fadeIn: false,
  autoRotate: false,
  autoRotateSpeed: 0.35
};

const selectedModel = ref<ModelKey>(DEFAULTS.selectedModel);
const environmentPreset = ref<EnvironmentPreset>(DEFAULTS.environmentPreset);
const modelXOffset = ref(DEFAULTS.modelXOffset);
const modelYOffset = ref(DEFAULTS.modelYOffset);
const enableMouseParallax = ref(DEFAULTS.enableMouseParallax);
const enableHoverRotation = ref(DEFAULTS.enableHoverRotation);
const showScreenshotButton = ref(DEFAULTS.showScreenshotButton);
const fadeIn = ref(DEFAULTS.fadeIn);
const autoRotate = ref(DEFAULTS.autoRotate);
const autoRotateSpeed = ref(DEFAULTS.autoRotateSpeed);
const isTextVisible = ref(false);

const urlMap: Record<ModelKey, string> = {
  toyCar: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/main/2.0/ToyCar/glTF-Binary/ToyCar.glb',
  sheenChair:
    'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/main/2.0/SheenChair/glTF-Binary/SheenChair.glb'
};

const textMap: Record<ModelKey, string> = {
  toyCar: 'Fast as lightning.',
  sheenChair: 'Ultra comfortable.'
};

const modelOptions = [
  { label: 'Car', value: 'toyCar' },
  { label: 'Chair', value: 'sheenChair' }
];

const environmentOptions = [
  { label: 'City', value: 'city' },
  { label: 'Sunset', value: 'sunset' },
  { label: 'Night', value: 'night' },
  { label: 'Dawn', value: 'dawn' },
  { label: 'Studio', value: 'studio' },
  { label: 'Hangar', value: 'hangar' },
  { label: 'Urban', value: 'urban' },
  { label: 'Modern', value: 'modern' },
  { label: 'None', value: 'none' }
];

// Hide the model caption until the newly selected model has finished loading.
watch(selectedModel, () => {
  isTextVisible.value = false;
});

const hasChanges = computed(
  () =>
    selectedModel.value !== DEFAULTS.selectedModel ||
    environmentPreset.value !== DEFAULTS.environmentPreset ||
    modelXOffset.value !== DEFAULTS.modelXOffset ||
    modelYOffset.value !== DEFAULTS.modelYOffset ||
    enableMouseParallax.value !== DEFAULTS.enableMouseParallax ||
    enableHoverRotation.value !== DEFAULTS.enableHoverRotation ||
    showScreenshotButton.value !== DEFAULTS.showScreenshotButton ||
    fadeIn.value !== DEFAULTS.fadeIn ||
    autoRotate.value !== DEFAULTS.autoRotate ||
    autoRotateSpeed.value !== DEFAULTS.autoRotateSpeed
);

function reset() {
  selectedModel.value = DEFAULTS.selectedModel;
  environmentPreset.value = DEFAULTS.environmentPreset;
  modelXOffset.value = DEFAULTS.modelXOffset;
  modelYOffset.value = DEFAULTS.modelYOffset;
  enableMouseParallax.value = DEFAULTS.enableMouseParallax;
  enableHoverRotation.value = DEFAULTS.enableHoverRotation;
  showScreenshotButton.value = DEFAULTS.showScreenshotButton;
  fadeIn.value = DEFAULTS.fadeIn;
  autoRotate.value = DEFAULTS.autoRotate;
  autoRotateSpeed.value = DEFAULTS.autoRotateSpeed;
  isTextVisible.value = false;
  forceRerender();
}

const propData: PropRow[] = [
  { name: 'url', type: 'string', default: '-', description: 'URL of the 3D model file (glb/gltf/fbx/obj).' },
  { name: 'width', type: 'number | string', default: '400', description: 'Width of the canvas container.' },
  { name: 'height', type: 'number | string', default: '400', description: 'Height of the canvas container.' },
  { name: 'modelXOffset', type: 'number', default: '0', description: 'Horizontal offset of the model.' },
  { name: 'modelYOffset', type: 'number', default: '0', description: 'Vertical offset of the model.' },
  {
    name: 'defaultRotationX',
    type: 'number',
    default: '-50',
    description: 'Initial rotation on the X axis in degrees.'
  },
  {
    name: 'defaultRotationY',
    type: 'number',
    default: '20',
    description: 'Initial rotation on the Y axis in degrees.'
  },
  { name: 'defaultZoom', type: 'number', default: '0.5', description: 'Initial zoom distance factor.' },
  { name: 'minZoomDistance', type: 'number', default: '0.5', description: 'Minimum zoom distance.' },
  { name: 'maxZoomDistance', type: 'number', default: '10', description: 'Maximum zoom distance.' },
  { name: 'enableMouseParallax', type: 'boolean', default: 'true', description: 'Enable mouse-based parallax effect.' },
  { name: 'enableManualRotation', type: 'boolean', default: 'true', description: 'Enable manual rotation via drag.' },
  {
    name: 'enableHoverRotation',
    type: 'boolean',
    default: 'true',
    description: 'Enable rotation on hover based on cursor.'
  },
  {
    name: 'enableManualZoom',
    type: 'boolean',
    default: 'true',
    description: 'Enable manual zoom via mouse wheel or gestures.'
  },
  { name: 'ambientIntensity', type: 'number', default: '0.3', description: 'Intensity of ambient light.' },
  { name: 'keyLightIntensity', type: 'number', default: '1', description: 'Intensity of key light.' },
  { name: 'fillLightIntensity', type: 'number', default: '0.5', description: 'Intensity of fill light.' },
  { name: 'rimLightIntensity', type: 'number', default: '0.8', description: 'Intensity of rim light.' },
  {
    name: 'environmentPreset',
    type: 'string',
    default: "'city'",
    description:
      'Environment preset for scene lighting (city, sunset, night, dawn, studio, hangar, urban, modern, none).'
  },
  { name: 'autoFrame', type: 'boolean', default: 'false', description: 'Automatically frame the model in view.' },
  {
    name: 'placeholderSrc',
    type: 'string',
    default: '-',
    description: 'Placeholder image source shown while loading.'
  },
  {
    name: 'showScreenshotButton',
    type: 'boolean',
    default: 'true',
    description: 'Show the screenshot button overlay.'
  },
  { name: 'fadeIn', type: 'boolean', default: 'false', description: 'Enable fade-in transition on load.' },
  { name: 'autoRotate', type: 'boolean', default: 'false', description: 'Enable automatic rotation animation.' },
  { name: 'autoRotateSpeed', type: 'number', default: '0.35', description: 'Speed of automatic rotation.' },
  { name: 'modelLoaded', type: 'event', default: '-', description: 'Emitted when the model finishes loading.' }
];
</script>

<style scoped>
.model-viewer-demo {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.model-viewer-demo-text {
  position: absolute;
  top: 50%;
  left: 6em;
  transform: translate(-50%, -50%);
  z-index: 1;
  font-size: 3rem;
  font-weight: 900;
  white-space: nowrap;
  text-align: center;
  color: #fff;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
  user-select: none;
  pointer-events: none;
}

@media (max-width: 768px) {
  .model-viewer-demo-text {
    display: none;
  }
}
</style>
