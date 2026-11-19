<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
    :demo-only-props="['preset', 'showCenter']"
  >
    <TabsLayout>
      <template #preview>
        <div class="demo-container relative overflow-hidden" style="height: 460px; padding: 24px">
          <RefreshButton @click="forceRerender" />
          <OrbitImages :key="rerenderKey" :images="IMAGES" width="100%" height="100%" v-bind="settings">
            <template v-if="props.showCenter" #centerContent>
              <span style="font-size: clamp(22px, 4vw, 40px); font-weight: 600; letter-spacing: -0.02em">Moments</span>
            </template>
          </OrbitImages>
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
            :model-value="props.shape"
            @update:model-value="value => updateProp('shape', value as OrbitShape)"
          />
          <PreviewSelect
            title="Direction"
            :options="DIRECTION_OPTIONS"
            :model-value="props.direction"
            @update:model-value="value => updateProp('direction', value as Direction)"
          />
          <PreviewSelect
            title="Easing"
            :options="EASING_OPTIONS"
            :model-value="props.easing"
            @update:model-value="value => updateProp('easing', value as Easing)"
          />
          <PreviewSlider
            title="Duration"
            :min="4"
            :max="60"
            :step="1"
            value-unit="s"
            :model-value="props.duration"
            @update:model-value="value => updateProp('duration', value)"
          />
          <PreviewSlider
            title="Depth"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.depth"
            @update:model-value="value => updateProp('depth', value)"
          />
          <PreviewSlider
            title="Item Size"
            :min="30"
            :max="160"
            :step="2"
            :model-value="props.itemSize"
            @update:model-value="value => updateProp('itemSize', value)"
          />
          <PreviewSlider
            title="Rotation"
            :min="-45"
            :max="45"
            :step="1"
            value-unit="°"
            :model-value="props.rotation"
            @update:model-value="value => updateProp('rotation', value)"
          />
          <PreviewSlider
            title="Radius X"
            :min="100"
            :max="600"
            :step="10"
            :is-disabled="!wide"
            :model-value="props.radiusX"
            @update:model-value="value => updateProp('radiusX', value)"
          />
          <PreviewSlider
            title="Radius Y"
            :min="20"
            :max="400"
            :step="10"
            :is-disabled="!wide"
            :model-value="props.radiusY"
            @update:model-value="value => updateProp('radiusY', value)"
          />
          <PreviewSlider
            title="Radius"
            :min="60"
            :max="400"
            :step="10"
            :is-disabled="wide"
            :model-value="props.radius"
            @update:model-value="value => updateProp('radius', value)"
          />
          <PreviewSlider
            title="Item Radius"
            :min="0"
            :max="80"
            :step="1"
            :model-value="props.itemRadius"
            @update:model-value="value => updateProp('itemRadius', value)"
          />
          <PreviewSlider
            title="Shadow"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.shadow"
            @update:model-value="value => updateProp('shadow', value)"
          />
          <PreviewSlider
            title="Hover Scale"
            :min="1"
            :max="1.5"
            :step="0.01"
            :model-value="props.hoverScale"
            @update:model-value="value => updateProp('hoverScale', value)"
          />
          <PreviewSlider
            title="Hover Speed"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.hoverSpeed"
            @update:model-value="value => updateProp('hoverSpeed', value)"
          />
          <PreviewSlider
            title="Path Dash"
            :min="0"
            :max="20"
            :step="1"
            value-unit="px"
            :is-disabled="!props.showPath"
            :model-value="props.pathDash"
            @update:model-value="value => updateProp('pathDash', value)"
          />
          <PreviewSwitch
            title="Show Path"
            :model-value="props.showPath"
            @update:model-value="value => updateProp('showPath', value)"
          />
          <PreviewSwitch
            title="Center Content"
            :model-value="props.showCenter"
            @update:model-value="value => updateProp('showCenter', value)"
          />
          <PreviewSwitch
            title="Fill"
            :model-value="props.fill"
            @update:model-value="value => updateProp('fill', value)"
          />
          <PreviewSwitch
            title="Align to Path"
            :model-value="props.alignToPath"
            @update:model-value="value => updateProp('alignToPath', value)"
          />
          <PreviewSwitch
            title="Draggable"
            :model-value="props.draggable"
            @update:model-value="value => updateProp('draggable', value)"
          />
          <PreviewSwitch
            title="Click to Front"
            :model-value="props.clickToFront"
            @update:model-value="value => updateProp('clickToFront', value)"
          />
          <PreviewSwitch
            title="Paused"
            :model-value="props.paused"
            @update:model-value="value => updateProp('paused', value)"
          />
          <PreviewSwitch title="Intro" :model-value="props.intro" @update:model-value="setIntro" />
        </Customize>

        <PropTable :data="propData" />
      </template>

      <template #code>
        <CodeExample :code-object="orbitImages" component-name="OrbitImages" />
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
import RefreshButton from '@/components/common/RefreshButton.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import ComponentPropsProvider from '@/components/context/ComponentPropsProvider.vue';
import { useComponentProps } from '@/composables/useComponentProps';
import { useForceRerender } from '@/composables/useForceRerender';
import { orbitImages } from '@/constants/code/Animations/orbitImagesCode';
import OrbitImages, { type OrbitShape } from '@/content/Animations/OrbitImages/OrbitImages.vue';

type Direction = 'normal' | 'reverse';
type Easing = 'linear' | 'easeIn' | 'easeOut' | 'easeInOut';

const IMAGES = [
  'https://picsum.photos/300/300?grayscale&random=1',
  'https://picsum.photos/300/300?grayscale&random=2',
  'https://picsum.photos/300/300?grayscale&random=3',
  'https://picsum.photos/300/300?grayscale&random=4',
  'https://picsum.photos/300/300?grayscale&random=5',
  'https://picsum.photos/300/300?grayscale&random=6'
];

const LOOK = {
  shape: 'ellipse' as OrbitShape,
  radiusX: 340,
  radiusY: 80,
  radius: 160,
  rotation: -8,
  duration: 30,
  itemSize: 90,
  depth: 0.6,
  itemRadius: 14,
  shadow: 0.3,
  hoverScale: 1.08,
  hoverSpeed: 0.3,
  pathDash: 0,
  direction: 'normal' as Direction,
  easing: 'linear' as Easing,
  fill: true,
  showPath: true,
  alignToPath: false,
  showCenter: false
};

const DEFAULT_PROPS = {
  preset: 'orbit',
  ...LOOK,
  draggable: true,
  clickToFront: true,
  paused: false,
  intro: true
};

type DemoProps = typeof DEFAULT_PROPS;

const PRESETS: Record<string, Partial<DemoProps>> = {
  orbit: {},
  carousel: {
    radiusX: 420,
    radiusY: 60,
    rotation: 0,
    depth: 0.85,
    itemSize: 120,
    duration: 24,
    showPath: false
  },
  halo: { shape: 'circle', radius: 170, rotation: 0, depth: 0, itemSize: 64, itemRadius: 32, pathDash: 5 },
  ribbon: {
    shape: 'infinity',
    radiusX: 360,
    radiusY: 120,
    rotation: 0,
    depth: 0.3,
    itemSize: 70,
    duration: 16,
    fill: false,
    alignToPath: true
  },
  star: { shape: 'star', radius: 180, rotation: 0, depth: 0, itemSize: 56 },
  heart: { shape: 'heart', radius: 200, rotation: 0, depth: 0, itemSize: 56 },
  wave: {
    shape: 'wave',
    radiusX: 400,
    radiusY: 60,
    rotation: 0,
    depth: 0.2,
    itemSize: 64,
    duration: 14,
    fill: false,
    alignToPath: true
  }
};

const PRESET_OPTIONS = [
  { value: 'orbit', label: 'Orbit' },
  { value: 'carousel', label: 'Carousel' },
  { value: 'halo', label: 'Halo' },
  { value: 'ribbon', label: 'Ribbon' },
  { value: 'star', label: 'Star' },
  { value: 'heart', label: 'Heart' },
  { value: 'wave', label: 'Wave' }
];

const SHAPE_OPTIONS = [
  { value: 'ellipse', label: 'Ellipse' },
  { value: 'circle', label: 'Circle' },
  { value: 'square', label: 'Square' },
  { value: 'rectangle', label: 'Rectangle' },
  { value: 'triangle', label: 'Triangle' },
  { value: 'star', label: 'Star' },
  { value: 'heart', label: 'Heart' },
  { value: 'infinity', label: 'Infinity' },
  { value: 'wave', label: 'Wave' }
];

const DIRECTION_OPTIONS = [
  { value: 'normal', label: 'Normal' },
  { value: 'reverse', label: 'Reverse' }
];

const EASING_OPTIONS = [
  { value: 'linear', label: 'Linear' },
  { value: 'easeIn', label: 'Ease In' },
  { value: 'easeOut', label: 'Ease Out' },
  { value: 'easeInOut', label: 'Ease In Out' }
];

const WIDE_SHAPES = ['ellipse', 'rectangle', 'infinity', 'wave'];

const propData: PropRow[] = [
  {
    name: 'images',
    type: 'Array<string | { src: string; alt?: string }>',
    default: '[]',
    description: 'Images that travel along the path, as URLs or objects with their own alt text.'
  },
  {
    name: 'altPrefix',
    type: 'string',
    default: "'Orbiting image'",
    description: 'Prefix for the alt text of images given as plain URLs.'
  },
  {
    name: 'shape',
    type: "'ellipse' | 'circle' | 'square' | 'rectangle' | 'triangle' | 'star' | 'heart' | 'infinity' | 'wave' | 'custom'",
    default: "'ellipse'",
    description: 'Shape of the path the images follow.'
  },
  {
    name: 'customPath',
    type: 'string',
    default: 'undefined',
    description: 'Your own SVG path, drawn in a baseWidth by baseWidth space. Used when shape is custom.'
  },
  {
    name: 'baseWidth',
    type: 'number',
    default: '1400',
    description: 'Size of the coordinate space for the radii, the item size and custom paths.'
  },
  {
    name: 'radiusX',
    type: 'number',
    default: '700',
    description: 'Horizontal radius for the ellipse, rectangle, infinity and wave.'
  },
  {
    name: 'radiusY',
    type: 'number',
    default: '170',
    description: 'Vertical radius for the ellipse, rectangle, infinity and wave.'
  },
  {
    name: 'radius',
    type: 'number',
    default: '300',
    description: 'Radius for the circle, square, triangle, star and heart.'
  },
  { name: 'starPoints', type: 'number', default: '5', description: 'Number of points on the star.' },
  {
    name: 'starInnerRatio',
    type: 'number',
    default: '0.5',
    description: 'Inner radius of the star as a fraction of the outer one.'
  },
  {
    name: 'rotation',
    type: 'number',
    default: '-8',
    description: 'Rotation of the whole path in degrees. Images stay upright.'
  },
  { name: 'duration', type: 'number', default: '40', description: 'Seconds for one full lap.' },
  {
    name: 'itemSize',
    type: 'number',
    default: '64',
    description: 'Size of each image, in the same units as the radii.'
  },
  { name: 'direction', type: "'normal' | 'reverse'", default: "'normal'", description: 'Which way the images travel.' },
  {
    name: 'fill',
    type: 'boolean',
    default: 'true',
    description:
      'Spreads the images evenly around the whole path. Turn it off to make them follow each other in a train.'
  },
  {
    name: 'depth',
    type: 'number',
    default: '0.5',
    description:
      'Sense of depth, from 0 to 1. Images at the back get smaller, dimmer and pass behind the center content, and images at the front grow and pass in front of it.'
  },
  {
    name: 'alignToPath',
    type: 'boolean',
    default: 'false',
    description: 'Turns each image to follow the curve instead of staying upright.'
  },
  {
    name: 'itemRadius',
    type: 'number | string',
    default: '12',
    description:
      'Corner radius of the images, in the same units as itemSize, or any CSS length. Half of itemSize makes circles.'
  },
  {
    name: 'shadow',
    type: 'number',
    default: '0.3',
    description: 'Strength of the soft shadow under each image, from 0 to 1.'
  },
  { name: 'hoverScale', type: 'number', default: '1.08', description: 'How much an image grows when hovered.' },
  {
    name: 'hoverSpeed',
    type: 'number',
    default: '0.3',
    description:
      'Speed while the orbit is hovered, as a fraction of the normal speed. 0 pauses it and 1 keeps full speed.'
  },
  {
    name: 'draggable',
    type: 'boolean',
    default: 'true',
    description: 'Lets people drag or swipe sideways to spin the orbit, and fling it.'
  },
  {
    name: 'clickToFront',
    type: 'boolean',
    default: 'true',
    description: 'Clicking an image glides it around to the front.'
  },
  {
    name: 'onItemClick',
    type: '(index: number, src: string) => void',
    default: 'undefined',
    description: 'Called when an image is clicked. When set, the images become keyboard-focusable buttons.'
  },
  { name: 'showPath', type: 'boolean', default: 'false', description: 'Draws the path the images follow.' },
  { name: 'pathColor', type: 'string', default: "'rgba(128,128,128,0.35)'", description: 'Color of the path line.' },
  { name: 'pathWidth', type: 'number', default: '2', description: 'Width of the path line in pixels.' },
  {
    name: 'pathDash',
    type: 'number',
    default: '0',
    description: 'Dash length of the path line in pixels. 0 draws a solid line.'
  },
  {
    name: 'easing',
    type: "'linear' | 'easeIn' | 'easeOut' | 'easeInOut'",
    default: "'linear'",
    description: 'Easing applied to each lap.'
  },
  { name: 'paused', type: 'boolean', default: 'false', description: 'Stops the orbit. Dragging still works.' },
  {
    name: 'intro',
    type: 'boolean',
    default: 'true',
    description:
      'Images fan out from the front around the path, and the line draws in, when the orbit first comes into view.'
  },
  {
    name: 'centerContent',
    type: 'slot',
    default: '-',
    description: 'Content in the middle of the orbit. With depth, images pass behind and in front of it.'
  },
  {
    name: 'width',
    type: 'number | string',
    default: "'100%'",
    description: 'Width of the container. The orbit scales to fit.'
  },
  {
    name: 'height',
    type: 'number | string',
    default: "'auto'",
    description: 'Height of the container. Auto matches the shape of the orbit, any other value fits the orbit inside.'
  },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the container.' }
];

const { rerenderKey, forceRerender } = useForceRerender();
const { props, defaultProps, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);

const settings = computed(() => {
  const { preset: _preset, showCenter: _showCenter, ...rest } = props.value;
  return rest;
});

const wide = computed(() => WIDE_SHAPES.includes(props.value.shape));

const applyPreset = (value: string | number) => {
  const key = String(value);
  const base = Object.fromEntries(
    Object.keys(LOOK).map(name => [name, defaultProps.value[name as keyof DemoProps]])
  ) as Partial<DemoProps>;
  updateProps({ ...base, ...PRESETS[key], preset: key });
  forceRerender();
};

const setIntro = (value: boolean) => {
  updateProp('intro', value);
  forceRerender();
};
</script>
