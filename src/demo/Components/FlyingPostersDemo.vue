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
          <FlyingPosters v-bind="settings" :items="ITEMS" />
        </div>

        <Customize>
          <PreviewSelect
            title="Preset"
            :options="PRESET_OPTIONS"
            :model-value="props.preset"
            @update:model-value="applyPreset"
          />
          <PreviewSlider
            title="Plane Width"
            :min="120"
            :max="480"
            :step="10"
            value-unit="px"
            :model-value="props.planeWidth"
            @update:model-value="value => updateProp('planeWidth', value)"
          />
          <PreviewSlider
            title="Plane Height"
            :min="120"
            :max="480"
            :step="10"
            value-unit="px"
            :model-value="props.planeHeight"
            @update:model-value="value => updateProp('planeHeight', value)"
          />
          <PreviewSlider
            title="Distortion"
            :min="0"
            :max="10"
            :step="0.1"
            :model-value="props.distortion"
            @update:model-value="value => updateProp('distortion', value)"
          />
          <PreviewSlider
            title="Scroll Ease"
            :min="0.002"
            :max="0.1"
            :step="0.002"
            :model-value="props.scrollEase"
            @update:model-value="value => updateProp('scrollEase', value)"
          />
          <PreviewSlider
            title="Camera FOV"
            :min="20"
            :max="90"
            :step="1"
            value-unit="°"
            :model-value="props.cameraFov"
            @update:model-value="value => updateProp('cameraFov', value)"
          />
          <PreviewSlider
            title="Camera Z"
            :min="5"
            :max="50"
            :step="1"
            :model-value="props.cameraZ"
            @update:model-value="value => updateProp('cameraZ', value)"
          />
          <PreviewSlider
            title="Rotation"
            :min="0"
            :max="720"
            :step="15"
            value-unit="°"
            :model-value="props.rotation"
            @update:model-value="value => updateProp('rotation', value)"
          />
          <PreviewSelect
            title="Axis"
            :options="AXIS_OPTIONS"
            :model-value="props.axis"
            @update:model-value="value => updateProp('axis', value as Axis)"
          />
          <PreviewSlider
            title="Columns"
            :min="1"
            :max="5"
            :step="1"
            :model-value="props.columns"
            @update:model-value="value => updateProp('columns', value)"
          />
          <PreviewSlider
            title="Column Gap"
            :min="0"
            :max="120"
            :step="4"
            value-unit="px"
            :model-value="props.columnGap"
            @update:model-value="value => updateProp('columnGap', value)"
          />
          <PreviewSlider
            title="Radius"
            :min="0"
            :max="60"
            :step="1"
            value-unit="px"
            :model-value="props.radius"
            @update:model-value="value => updateProp('radius', value)"
          />
          <PreviewSlider
            title="Speed"
            :min="-120"
            :max="120"
            :step="2"
            :model-value="props.speed"
            @update:model-value="value => updateProp('speed', value)"
          />
          <PreviewSlider
            title="Lean"
            :min="0"
            :max="1.5"
            :step="0.05"
            :model-value="props.lean"
            @update:model-value="value => updateProp('lean', value)"
          />
          <PreviewSlider
            title="Fade"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.fade"
            @update:model-value="value => updateProp('fade', value)"
          />
          <PreviewSlider
            title="Shading"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.shading"
            @update:model-value="value => updateProp('shading', value)"
          />
          <PreviewSwitch
            title="Alternate"
            :model-value="props.alternate"
            @update:model-value="value => updateProp('alternate', value)"
          />
          <PreviewSwitch
            title="Wheel"
            :model-value="props.wheel"
            @update:model-value="value => updateProp('wheel', value)"
          />
          <PreviewSwitch
            title="Drag"
            :model-value="props.drag"
            @update:model-value="value => updateProp('drag', value)"
          />
        </Customize>

        <PropTable :data="propData" />
      </template>

      <template #code>
        <CodeExample :code-object="flyingPosters" component-name="FlyingPosters" />
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
import { flyingPosters } from '@/constants/code/Components/flyingPostersCode';
import FlyingPosters from '@/content/Components/FlyingPosters/FlyingPosters.vue';

type Axis = 'vertical' | 'horizontal' | 'diagonal';
type Preset = 'classic' | 'columns';

const ITEMS = [
  '/assets/demo/day-portrait.webp',
  '/assets/demo/night-landscape.webp',
  'https://images.unsplash.com/photo-1778849097774-0ab2a873a858?w=800&q=80&auto=format&fit=crop',
  '/assets/demo/day-landscape.webp',
  '/assets/demo/night-portrait.webp'
];

const DEFAULT_PROPS = {
  preset: 'classic' as Preset,
  planeWidth: 320,
  planeHeight: 320,
  distortion: 3,
  scrollEase: 0.01,
  cameraFov: 45,
  cameraZ: 20,
  rotation: 180,
  axis: 'vertical' as Axis,
  columns: 1,
  columnGap: 40,
  alternate: true,
  radius: 0,
  speed: 0,
  lean: 0,
  fade: 0,
  shading: 0,
  wheel: true,
  drag: true
};

const PRESETS: Record<Preset, Partial<typeof DEFAULT_PROPS>> = {
  classic: {},
  columns: { planeWidth: 200, planeHeight: 260, columns: 3, columnGap: 32, radius: 12, speed: 30 }
};

const PRESET_OPTIONS = [
  { value: 'classic', label: 'Classic' },
  { value: 'columns', label: 'Columns' }
];

const AXIS_OPTIONS = [
  { value: 'vertical', label: 'Vertical' },
  { value: 'horizontal', label: 'Horizontal' },
  { value: 'diagonal', label: 'Diagonal' }
];

const propData: PropRow[] = [
  {
    name: 'items',
    type: 'Array<string | { image: string; link?: string; alt?: string }>',
    default: '[]',
    description: 'Images for the posters. Each one is cropped to fill its poster, and they repeat to fill the view.'
  },
  {
    name: 'planeWidth',
    type: 'number',
    default: '320',
    description: 'Width of each poster in pixels at the default camera.'
  },
  {
    name: 'planeHeight',
    type: 'number',
    default: '320',
    description: 'Height of each poster in pixels at the default camera.'
  },
  {
    name: 'distortion',
    type: 'number',
    default: '3',
    description: 'How far one corner of a poster turns ahead of the other, which gives the twist.'
  },
  {
    name: 'scrollEase',
    type: 'number',
    default: '0.01',
    description: 'How quickly the posters catch up with the wheel and drag. Lower values glide longer.'
  },
  {
    name: 'cameraFov',
    type: 'number',
    default: '45',
    description: 'Field of view of the camera in degrees. Wider angles zoom out.'
  },
  {
    name: 'cameraZ',
    type: 'number',
    default: '20',
    description:
      'Distance of the camera from the posters. Higher values show them smaller and flatter, lower values bring them close with stronger perspective.'
  },
  {
    name: 'gap',
    type: 'number',
    default: '-',
    description: 'Space between posters in pixels. Defaults to the original spacing, which follows the camera.'
  },
  {
    name: 'rotation',
    type: 'number',
    default: '180',
    description: 'How far each poster turns while it crosses the view, in degrees.'
  },
  {
    name: 'axis',
    type: "'vertical' | 'horizontal' | 'diagonal'",
    default: "'vertical'",
    description: 'Axis the posters turn around.'
  },
  { name: 'columns', type: 'number', default: '1', description: 'Number of poster columns.' },
  { name: 'columnGap', type: 'number', default: '40', description: 'Space between columns in pixels.' },
  {
    name: 'alternate',
    type: 'boolean',
    default: 'true',
    description: 'Moves every other column in the opposite direction.'
  },
  { name: 'radius', type: 'number', default: '0', description: 'Corner radius of the posters in pixels.' },
  {
    name: 'speed',
    type: 'number',
    default: '0',
    description: 'Drift in pixels per second while nobody scrolls. Negative values drift down.'
  },
  { name: 'lean', type: 'number', default: '0', description: 'How far the posters lean back with fast scrolling.' },
  {
    name: 'fade',
    type: 'number',
    default: '0',
    description: 'Fades the posters out toward the top and bottom edges, from 0 to 1.'
  },
  { name: 'shading', type: 'number', default: '0', description: 'Darkens the posters as they turn away, from 0 to 1.' },
  {
    name: 'wheel',
    type: 'boolean',
    default: 'true',
    description: 'Scrolls the posters with the mouse wheel while hovered.'
  },
  { name: 'drag', type: 'boolean', default: 'true', description: 'Scrolls the posters by dragging them.' },
  {
    name: 'pageScroll',
    type: 'number',
    default: '0',
    description: 'Moves the posters along with the page scroll, as a multiplier. 0 turns it off.'
  },
  {
    name: 'onItemClick',
    type: '(item, index) => void',
    default: '-',
    description: 'Called when a poster is clicked or tapped.'
  },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the container.' },
  { name: 'style', type: 'CSSProperties', default: '-', description: 'Inline styles for the container.' }
];

const { props, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);

const settings = computed(() => {
  const { preset: _preset, ...rest } = props.value;
  return rest;
});

const applyPreset = (value: string | number) => {
  updateProps({ ...DEFAULT_PROPS, ...PRESETS[value as Preset], preset: value as Preset });
};
</script>
