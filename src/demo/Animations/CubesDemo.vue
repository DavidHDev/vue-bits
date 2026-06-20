<template>
  <h1 class="sub-category">Cubes</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="cubes.usage"
    :source="cubesSource"
    component-name="Cubes"
    :props-table="props"
  >
    <template #preview>
      <div class="h-[700px] demo-container">
        <Cubes
          :borderStyle="borderStyle"
          :gridSize="gridSize"
          :maxAngle="maxAngle"
          :radius="radius"
          :autoAnimate="autoAnimate"
          :rippleOnClick="rippleOnClick"
        />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSelect title="Border Preference" :options="borderOptions" v-model="borderStyle" :width="150" />
        <PreviewSlider title="Grid Size" :min="6" :max="12" :step="1" v-model="gridSize" :width="150" />
        <PreviewSlider title="Max Angle" :min="15" :max="180" :step="5" v-model="maxAngle" valueUnit="°" :width="150" />
        <PreviewSlider title="Radius" :min="1" :max="5" :step="1" v-model="radius" :width="150" />
        <PreviewSwitch title="Auto Animate" v-model="autoAnimate" />
        <PreviewSwitch title="Ripple On Click" v-model="rippleOnClick" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="cubes" :usage="cubes.usage!" :source="cubesSource" />
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
import { useForceRerender } from '@/composables/useForceRerender.ts';
import { cubes } from '@/constants/code/Animations/cubesCode';
import Cubes from '@/content/Animations/Cubes/Cubes.vue';
import cubesSource from '@/content/Animations/Cubes/Cubes.vue?raw';
import { computed, ref } from 'vue';

const { forceRerender } = useForceRerender();

const DEFAULTS = {
  borderStyle: '2px dashed #A7EF9E',
  gridSize: 10,
  maxAngle: 45,
  radius: 3,
  autoAnimate: true,
  rippleOnClick: true
};

const borderStyle = ref(DEFAULTS.borderStyle);
const gridSize = ref(DEFAULTS.gridSize);
const maxAngle = ref(DEFAULTS.maxAngle);
const radius = ref(DEFAULTS.radius);
const autoAnimate = ref(DEFAULTS.autoAnimate);
const rippleOnClick = ref(DEFAULTS.rippleOnClick);

const hasChanges = computed(
  () =>
    borderStyle.value !== DEFAULTS.borderStyle ||
    gridSize.value !== DEFAULTS.gridSize ||
    maxAngle.value !== DEFAULTS.maxAngle ||
    radius.value !== DEFAULTS.radius ||
    autoAnimate.value !== DEFAULTS.autoAnimate ||
    rippleOnClick.value !== DEFAULTS.rippleOnClick
);

function reset() {
  borderStyle.value = DEFAULTS.borderStyle;
  gridSize.value = DEFAULTS.gridSize;
  maxAngle.value = DEFAULTS.maxAngle;
  radius.value = DEFAULTS.radius;
  autoAnimate.value = DEFAULTS.autoAnimate;
  rippleOnClick.value = DEFAULTS.rippleOnClick;
  forceRerender();
}

const borderOptions = [
  { value: '2px dotted #fff', label: 'Dotted White' },
  { value: '2px dashed #A7EF9E', label: 'Dashed Green' },
  { value: '3px solid #fff', label: 'Solid White' }
];

const props: PropRow[] = [
  {
    name: 'gridSize',
    type: 'number',
    default: '10',
    description: 'The size of the grid (number of cubes per row/column)'
  },
  {
    name: 'cubeSize',
    type: 'number',
    default: 'undefined',
    description: 'Fixed size of each cube in pixels. If not provided, cubes will be responsive'
  },
  {
    name: 'maxAngle',
    type: 'number',
    default: '45',
    description: 'Maximum rotation angle for the tilt effect in degrees'
  },
  {
    name: 'radius',
    type: 'number',
    default: '3',
    description: 'Radius of the tilt effect (how many cubes around the cursor are affected)'
  },
  {
    name: 'easing',
    type: 'string',
    default: "'power3.out'",
    description: 'GSAP easing function for the tilt animation'
  },
  {
    name: 'duration',
    type: 'object',
    default: '{ enter: 0.3, leave: 0.6 }',
    description: 'Animation duration for enter and leave effects'
  },
  {
    name: 'cellGap',
    type: 'number | object',
    default: 'undefined',
    description: 'Gap between cubes. Can be a number or object with row/col properties'
  },
  {
    name: 'borderStyle',
    type: 'string',
    default: "'1px solid #fff'",
    description: 'CSS border style for cube faces'
  },
  {
    name: 'faceColor',
    type: 'string',
    default: "'#0b0b0b'",
    description: 'Background color for cube faces'
  },
  {
    name: 'shadow',
    type: 'boolean | string',
    default: 'false',
    description: 'Shadow effect for cubes. Can be boolean or custom CSS shadow'
  },
  {
    name: 'autoAnimate',
    type: 'boolean',
    default: 'true',
    description: 'Whether to automatically animate when user is idle'
  },
  {
    name: 'rippleOnClick',
    type: 'boolean',
    default: 'true',
    description: 'Whether to show ripple effect on click'
  },
  {
    name: 'rippleColor',
    type: 'string',
    default: "'#fff'",
    description: 'Color of the ripple effect'
  },
  {
    name: 'rippleSpeed',
    type: 'number',
    default: '2',
    description: 'Speed multiplier for the ripple animation'
  }
];
</script>
