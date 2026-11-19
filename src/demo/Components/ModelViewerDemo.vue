<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
    :demo-only-props="['model']"
    :computed-props="computedProps"
  >
    <TabsLayout>
      <template #preview>
        <div class="demo-container relative overflow-hidden" style="height: 500px; padding: 0">
          <ModelViewer :key="`${rerenderKey}-${props.model}`" :url="url" width="100%" height="100%" v-bind="settings" />
          <RefreshButton @click="forceRerender" />
        </div>

        <div class="flex justify-end" style="margin-top: 8px; margin-bottom: -8px">
          <p style="font-size: 12px; color: var(--text-dimmed)">
            Models by Shopify and Eric Chadwick, CC BY 4.0, from the Khronos glTF Sample Assets.
          </p>
        </div>

        <Customize>
          <PreviewSelect
            title="Model"
            :options="MODEL_OPTIONS"
            :model-value="props.model"
            @update:model-value="selectModel"
          />
          <PreviewSelect
            title="Environment"
            :options="ENVIRONMENT_OPTIONS"
            :model-value="props.environment"
            @update:model-value="value => updateProp('environment', value as ModelViewerEnvironment)"
          />
          <PreviewSelect
            title="Intro"
            :options="INTRO_OPTIONS"
            :model-value="props.intro"
            @update:model-value="value => updateProp('intro', value as ModelViewerIntro)"
          />
          <PreviewSlider
            title="Environment Intensity"
            :min="0"
            :max="2.5"
            :step="0.05"
            :model-value="props.environmentIntensity"
            @update:model-value="value => updateProp('environmentIntensity', value)"
          />
          <PreviewSlider
            title="Exposure"
            :min="0.3"
            :max="2"
            :step="0.05"
            :model-value="props.exposure"
            @update:model-value="value => updateProp('exposure', value)"
          />
          <PreviewSlider
            title="Auto Rotate Speed"
            :min="-2"
            :max="2"
            :step="0.05"
            :model-value="props.autoRotateSpeed"
            @update:model-value="value => updateProp('autoRotateSpeed', value)"
          />
          <PreviewSlider
            title="Auto Rotate Delay"
            :min="0"
            :max="6"
            :step="0.1"
            value-unit="s"
            :model-value="props.autoRotateDelay"
            @update:model-value="value => updateProp('autoRotateDelay', value)"
          />
          <PreviewSlider
            title="Hover Tilt"
            :min="0"
            :max="0.6"
            :step="0.01"
            :model-value="props.hoverTilt"
            @update:model-value="value => updateProp('hoverTilt', value)"
          />
          <PreviewSlider
            title="Float"
            :min="0"
            :max="1.5"
            :step="0.05"
            :model-value="props.float"
            @update:model-value="value => updateProp('float', value)"
          />
          <PreviewSlider
            title="Shadow Opacity"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.shadowOpacity"
            @update:model-value="value => updateProp('shadowOpacity', value)"
          />
          <PreviewSlider
            title="Fit"
            :min="0.3"
            :max="1.2"
            :step="0.01"
            :model-value="props.fit"
            @update:model-value="value => updateProp('fit', value)"
          />
          <PreviewSlider
            title="Offset X"
            :min="-1"
            :max="1"
            :step="0.01"
            :model-value="props.offsetX"
            @update:model-value="value => updateProp('offsetX', value)"
          />
          <PreviewSlider
            title="Offset Y"
            :min="-1"
            :max="1"
            :step="0.01"
            :model-value="props.offsetY"
            @update:model-value="value => updateProp('offsetY', value)"
          />
          <PreviewSlider
            title="Start Angle"
            :min="-180"
            :max="180"
            :step="1"
            value-unit="°"
            :model-value="props.startAngle"
            @update:model-value="value => updateProp('startAngle', value)"
          />
          <PreviewSlider
            title="Tilt"
            :min="-45"
            :max="45"
            :step="1"
            value-unit="°"
            :model-value="props.tilt"
            @update:model-value="value => updateProp('tilt', value)"
          />
          <PreviewSwitch
            title="Auto Rotate"
            :model-value="props.autoRotate"
            @update:model-value="value => updateProp('autoRotate', value)"
          />
          <PreviewSwitch
            title="Drag Rotate"
            :model-value="props.dragRotate"
            @update:model-value="value => updateProp('dragRotate', value)"
          />
          <PreviewSwitch
            title="Turntable"
            :model-value="props.turntable"
            @update:model-value="value => updateProp('turntable', value)"
          />
          <PreviewSwitch
            title="Zoom"
            :model-value="props.zoom"
            @update:model-value="value => updateProp('zoom', value)"
          />
          <PreviewSwitch
            title="Shadow"
            :model-value="props.shadow"
            @update:model-value="value => updateProp('shadow', value)"
          />
          <PreviewSwitch
            title="Reset On Double Click"
            :model-value="props.resetOnDoubleClick"
            @update:model-value="value => updateProp('resetOnDoubleClick', value)"
          />
        </Customize>

        <PropTable :data="propData" />
        <Dependencies :dependency-list="['three']" />
      </template>

      <template #code>
        <CodeExample :code-object="modelViewer" component-name="ModelViewer" />
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
import RefreshButton from '@/components/common/RefreshButton.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import ComponentPropsProvider from '@/components/context/ComponentPropsProvider.vue';
import { useComponentProps } from '@/composables/useComponentProps';
import { useForceRerender } from '@/composables/useForceRerender';
import { modelViewer } from '@/constants/code/Components/modelViewerCode';
import ModelViewer, {
  type ModelViewerEnvironment,
  type ModelViewerIntro
} from '@/content/Components/ModelViewer/ModelViewer.vue';

type ModelKey = 'sneaker' | 'watch' | 'sofa' | 'sunglasses';

const MODELS: Record<ModelKey, { url: string; startAngle: number; tilt: number }> = {
  sneaker: { url: '/assets/3d/sneaker.glb', startAngle: -35, tilt: 12 },
  watch: { url: '/assets/3d/watch.glb', startAngle: -20, tilt: 8 },
  sofa: { url: '/assets/3d/sofa.glb', startAngle: -30, tilt: 14 },
  sunglasses: { url: '/assets/3d/sunglasses.glb', startAngle: -25, tilt: 10 }
};

const MODEL_OPTIONS = [
  { value: 'sneaker', label: 'Sneaker' },
  { value: 'watch', label: 'Watch' },
  { value: 'sofa', label: 'Sofa' },
  { value: 'sunglasses', label: 'Sunglasses' }
];

const ENVIRONMENT_OPTIONS = [
  { value: 'studio', label: 'Studio' },
  { value: 'city', label: 'City' },
  { value: 'sunset', label: 'Sunset' },
  { value: 'dawn', label: 'Dawn' },
  { value: 'warehouse', label: 'Warehouse' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'lobby', label: 'Lobby' },
  { value: 'night', label: 'Night' },
  { value: 'park', label: 'Park' },
  { value: 'forest', label: 'Forest' },
  { value: 'none', label: 'None' }
];

const INTRO_OPTIONS = [
  { value: 'rise', label: 'Rise' },
  { value: 'spin', label: 'Spin' },
  { value: 'fade', label: 'Fade' },
  { value: 'none', label: 'None' }
];

const DEFAULT_PROPS = {
  model: 'sneaker' as ModelKey,
  environment: 'studio' as ModelViewerEnvironment,
  environmentIntensity: 1,
  exposure: 1,
  intro: 'rise' as ModelViewerIntro,
  autoRotate: true,
  autoRotateSpeed: 0.4,
  autoRotateDelay: 2,
  dragRotate: true,
  turntable: false,
  zoom: true,
  hoverTilt: 0.15,
  float: 0.3,
  shadow: true,
  shadowOpacity: 0.45,
  fit: 0.8,
  offsetX: 0,
  offsetY: 0,
  startAngle: -35,
  tilt: 12,
  resetOnDoubleClick: true
};

const propData: PropRow[] = [
  { name: 'url', type: 'string', default: '-', description: 'URL of the model. Supports glb, gltf, fbx and obj.' },
  { name: 'width', type: 'number | string', default: '400', description: 'Width of the viewer.' },
  { name: 'height', type: 'number | string', default: '400', description: 'Height of the viewer.' },
  {
    name: 'environment',
    type: 'string',
    default: "'studio'",
    description:
      "Lighting environment: studio, city, sunset, dawn, warehouse, apartment, lobby, night, park, forest or 'none'."
  },
  {
    name: 'environmentIntensity',
    type: 'number',
    default: '1',
    description: 'Strength of the environment lighting and reflections.'
  },
  { name: 'exposure', type: 'number', default: '1', description: 'Overall brightness of the render.' },
  {
    name: 'intro',
    type: "'rise' | 'spin' | 'fade' | 'none'",
    default: "'rise'",
    description: 'How the model appears once it has loaded.'
  },
  { name: 'autoRotate', type: 'boolean', default: 'true', description: 'Slowly turns the model while idle.' },
  { name: 'autoRotateSpeed', type: 'number', default: '0.4', description: 'Speed of the idle rotation.' },
  {
    name: 'autoRotateDelay',
    type: 'number',
    default: '2',
    description: 'Seconds after you let go before the idle rotation eases back in.'
  },
  {
    name: 'dragRotate',
    type: 'boolean',
    default: 'true',
    description: 'Drag to turn the model, with momentum when you let go.'
  },
  {
    name: 'turntable',
    type: 'boolean',
    default: 'false',
    description: 'Limits dragging to left and right, like a product turntable.'
  },
  {
    name: 'zoom',
    type: 'boolean',
    default: 'true',
    description: 'Pinch or hold Ctrl or Cmd and scroll to zoom. Plain scrolling still scrolls the page.'
  },
  { name: 'minZoom', type: 'number', default: '0.7', description: 'How far out you can zoom.' },
  { name: 'maxZoom', type: 'number', default: '2', description: 'How far in you can zoom.' },
  {
    name: 'hoverTilt',
    type: 'number',
    default: '0.15',
    description: 'How much the model leans toward the cursor. 0 turns it off.'
  },
  { name: 'float', type: 'number', default: '0.3', description: 'Gentle floating above the shadow. 0 turns it off.' },
  { name: 'shadow', type: 'boolean', default: 'true', description: 'Soft contact shadow under the model.' },
  { name: 'shadowOpacity', type: 'number', default: '0.45', description: 'Darkness of the shadow.' },
  {
    name: 'fit',
    type: 'number',
    default: '0.8',
    description: 'How much of the viewer the model fills. It is framed automatically.'
  },
  { name: 'offsetX', type: 'number', default: '0', description: 'Moves the model sideways, from -1 to 1.' },
  { name: 'offsetY', type: 'number', default: '0', description: 'Moves the model up or down, from -1 to 1.' },
  { name: 'startAngle', type: 'number', default: '-30', description: 'Starting angle around the model, in degrees.' },
  { name: 'tilt', type: 'number', default: '10', description: 'Starting tilt toward the viewer, in degrees.' },
  {
    name: 'resetOnDoubleClick',
    type: 'boolean',
    default: 'true',
    description: 'Double click to return to the starting view.'
  },
  {
    name: 'onModelLoaded',
    type: '() => void',
    default: '-',
    description: 'Called once the model has loaded. Also available as @model-loaded.'
  },
  {
    name: 'ref',
    type: 'Ref',
    default: '-',
    description: 'Template ref that exposes capture(type?), which returns the current frame as an image data URL.'
  },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the container.' },
  { name: 'style', type: 'CSSProperties', default: '-', description: 'Inline styles for the container.' }
];

const { rerenderKey, forceRerender } = useForceRerender();
const { props, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);

const settings = computed(() => {
  const { model: _model, ...rest } = props.value;
  void _model;
  return rest;
});

const url = computed(() => (MODELS[props.value.model] ?? MODELS.sneaker).url);
const computedProps = computed(() => ({ url: url.value }));

const selectModel = (value: string | number) => {
  const preset = MODELS[value as ModelKey] ?? MODELS.sneaker;
  updateProps({ model: value as ModelKey, startAngle: preset.startAngle, tilt: preset.tilt });
};
</script>
