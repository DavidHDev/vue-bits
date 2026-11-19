<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
    :demo-only-props="['preset', 'form']"
    :computed-props="computedProps"
  >
    <TabsLayout>
      <template #preview>
        <div class="demo-container relative overflow-hidden" style="height: 500px; padding: 0">
          <ShapeBlur v-bind="{ ...settings, ...shapeProps }" :color="color" />
        </div>

        <Customize>
          <PreviewSelect
            title="Preset"
            :options="PRESET_OPTIONS"
            :model-value="props.preset"
            @update:model-value="applyPreset"
          />
          <PreviewSelect
            title="Shape"
            :options="SHAPE_OPTIONS"
            :model-value="props.form"
            @update:model-value="value => updateProp('form', String(value))"
          />
          <PreviewSlider
            v-if="polygonal"
            title="Sides"
            :min="3"
            :max="12"
            :step="1"
            :model-value="props.sides"
            @update:model-value="value => updateProp('sides', value)"
          />
          <PreviewColorPickerCustom
            title="Color"
            :color="color"
            @change="(value: string) => updateProp('color', value)"
          />
          <PreviewSlider
            title="Size"
            :min="0.2"
            :max="1"
            :step="0.01"
            :model-value="props.size"
            @update:model-value="value => updateProp('size', value)"
          />
          <PreviewSlider
            title="Roundness"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.roundness"
            @update:model-value="value => updateProp('roundness', value)"
          />
          <PreviewSlider
            title="Thickness"
            :min="0.5"
            :max="12"
            :step="0.5"
            value-unit="px"
            :model-value="props.thickness"
            @update:model-value="value => updateProp('thickness', value)"
          />
          <PreviewSlider
            title="Echoes"
            :min="1"
            :max="20"
            :step="1"
            :model-value="props.echoes"
            @update:model-value="value => updateProp('echoes', value)"
          />
          <PreviewSlider
            title="Spacing"
            :min="4"
            :max="60"
            :step="1"
            value-unit="px"
            :model-value="props.spacing"
            @update:model-value="value => updateProp('spacing', value)"
          />
          <PreviewSlider
            title="Blur"
            :min="0"
            :max="80"
            :step="1"
            value-unit="px"
            :model-value="props.blur"
            @update:model-value="value => updateProp('blur', value)"
          />
          <PreviewSlider
            title="Lens Size"
            :min="0.05"
            :max="1"
            :step="0.01"
            :model-value="props.lensSize"
            @update:model-value="value => updateProp('lensSize', value)"
          />
          <PreviewSlider
            title="Lens Softness"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.lensSoftness"
            @update:model-value="value => updateProp('lensSoftness', value)"
          />
          <PreviewSlider
            title="Chroma"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.chroma"
            @update:model-value="value => updateProp('chroma', value)"
          />
          <PreviewSlider
            title="Rotation"
            :min="-180"
            :max="180"
            :step="1"
            value-unit="°"
            :model-value="props.rotation"
            @update:model-value="value => updateProp('rotation', value)"
          />
          <PreviewSlider
            title="Spin"
            :min="-90"
            :max="90"
            :step="1"
            value-unit="°/s"
            :model-value="props.spin"
            @update:model-value="value => updateProp('spin', value)"
          />
          <PreviewSwitch
            title="Fill"
            :model-value="props.fill"
            @update:model-value="value => updateProp('fill', value)"
          />
          <PreviewSwitch
            title="Focus"
            :model-value="props.focus"
            @update:model-value="value => updateProp('focus', value)"
          />
          <PreviewSwitch
            title="Idle Drift"
            :model-value="props.idle"
            @update:model-value="value => updateProp('idle', value)"
          />
        </Customize>

        <PropTable :data="propData" />
      </template>

      <template #code>
        <CodeExample :code-object="shapeBlur" component-name="ShapeBlur" />
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
import TabsLayout from '@/components/common/TabsLayout.vue';
import ComponentPropsProvider from '@/components/context/ComponentPropsProvider.vue';
import { useComponentProps } from '@/composables/useComponentProps';
import { useColorModeValue } from '@/composables/useTheme';
import logo from '@/assets/logos/vue-bits-logo-small.svg';
import { shapeBlur } from '@/constants/code/Animations/shapeBlurCode';
import ShapeBlur, { type ShapeBlurShape } from '@/content/Animations/ShapeBlur/ShapeBlur.vue';

const DEFAULT_PROPS = {
  preset: 'lens',
  form: 'logo',
  sides: 6,
  size: 0.6,
  roundness: 0.2,
  thickness: 2,
  fill: true,
  echoes: 1,
  spacing: 14,
  color: '',
  blur: 16,
  lensSize: 0.3,
  lensSoftness: 0.7,
  focus: false,
  chroma: 0.3,
  rotation: 0,
  spin: 0,
  idle: true
};

type DemoProps = typeof DEFAULT_PROPS;

const PRESETS: Record<string, Partial<DemoProps>> = {
  lens: {},
  focus: { focus: true, blur: 18, lensSize: 0.34 }
};

const PRESET_OPTIONS = [
  { value: 'lens', label: 'Lens' },
  { value: 'focus', label: 'Focus' }
];

const SHAPE_OPTIONS = [
  { value: 'logo', label: 'Logo' },
  { value: 'rect', label: 'Rectangle' },
  { value: 'circle', label: 'Circle' },
  { value: 'polygon', label: 'Polygon' },
  { value: 'star', label: 'Star' }
];

const propData: PropRow[] = [
  {
    name: 'shape',
    type: "'rect' | 'circle' | 'polygon' | 'star'",
    default: "'rect'",
    description: 'Shape to draw. A rectangle follows the container so it works as a frame.'
  },
  {
    name: 'src',
    type: 'string',
    default: '-',
    description:
      'URL of an SVG or transparent PNG to use as the shape instead. Its silhouette is traced, so outline, echoes and blur all work on it.'
  },
  { name: 'sides', type: 'number', default: '6', description: 'Sides of the polygon or points of the star.' },
  {
    name: 'size',
    type: 'number',
    default: '0.8',
    description: 'How much of the container the shape fills, from 0 to 1. 1 reaches the edges.'
  },
  { name: 'roundness', type: 'number', default: '0.2', description: 'Rounds the corners, from 0 to 1.' },
  { name: 'thickness', type: 'number', default: '2', description: 'Line width in pixels.' },
  { name: 'fill', type: 'boolean', default: 'false', description: 'Fills the shape instead of drawing its outline.' },
  {
    name: 'echoes',
    type: 'number',
    default: '1',
    description: 'Number of lines. Outlines nest inward and filled shapes ripple outward.'
  },
  { name: 'spacing', type: 'number', default: '12', description: 'Distance between echoes in pixels.' },
  {
    name: 'color',
    type: 'string',
    default: "'#ffffff'",
    description: 'Line color. Dark colors are drawn for light backgrounds.'
  },
  {
    name: 'blur',
    type: 'number',
    default: '16',
    description: 'How far out of focus the lens pushes the shape, in pixels.'
  },
  {
    name: 'lensSize',
    type: 'number',
    default: '0.3',
    description: 'Radius of the lens around the pointer, relative to the shorter side of the container.'
  },
  {
    name: 'lensSoftness',
    type: 'number',
    default: '0.7',
    description: 'How gradually the blur fades out toward the edge of the lens, from 0 to 1.'
  },
  {
    name: 'focus',
    type: 'boolean',
    default: 'false',
    description: 'Inverts the lens: the shape stays blurred and the pointer brings it into focus.'
  },
  {
    name: 'chroma',
    type: 'number',
    default: '0.3',
    description: 'Color fringing in the blurred parts, like a real lens, from 0 to 1.'
  },
  { name: 'rotation', type: 'number', default: '0', description: 'Rotation of the shape in degrees.' },
  { name: 'spin', type: 'number', default: '0', description: 'Rotation speed in degrees per second.' },
  {
    name: 'idle',
    type: 'boolean',
    default: 'true',
    description: 'Lets the lens drift on its own while the pointer is away.'
  },
  {
    name: 'default slot',
    type: 'slot',
    default: '-',
    description: 'Content centered on top of the shape, for example a headline inside a frame.'
  },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the container.' },
  { name: 'style', type: 'StyleValue', default: '-', description: 'Inline styles for the container.' }
];

const { props, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);
const ink = useColorModeValue('#111111', '#ffffff');
const color = computed(() => props.value.color || ink.value);

const settings = computed(() => {
  const { preset: _preset, form: _form, color: _color, ...rest } = props.value;
  return rest;
});

const shapeProps = computed((): { src?: string; shape?: ShapeBlurShape } =>
  props.value.form === 'logo' ? { src: logo } : { shape: props.value.form as ShapeBlurShape }
);

const computedProps = computed(() =>
  props.value.form === 'logo'
    ? { color: color.value, src: '/logo.svg' }
    : { color: color.value, shape: props.value.form }
);

const polygonal = computed(() => props.value.form === 'polygon' || props.value.form === 'star');

const applyPreset = (value: string | number) => {
  const key = String(value);
  updateProps({ ...DEFAULT_PROPS, ...PRESETS[key], preset: key });
};
</script>
