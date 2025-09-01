<template>
  <TabbedLayout>
    <template #preview>
      <div class="demo-container h-[700px]">
        <Cubes
          :borderStyle="borderStyle"
          :gridSize="gridSize"
          :maxAngle="maxAngle"
          :radius="radius"
          :autoAnimate="autoAnimate"
          :rippleOnClick="rippleOnClick"
        />
      </div>

      <Customize>
        <PreviewSelect title="Border Preference" :options="borderOptions" v-model="borderStyle" :width="150" />

        <PreviewSlider title="Grid Size" :min="6" :max="12" :step="1" v-model="gridSize" :width="150" />

        <PreviewSlider title="Max Angle" :min="15" :max="180" :step="5" v-model="maxAngle" valueUnit="°" :width="150" />

        <PreviewSlider title="Radius" :min="1" :max="5" :step="1" v-model="radius" :width="150" />

        <PreviewSwitch title="Auto Animate" v-model="autoAnimate" />

        <PreviewSwitch title="Ripple On Click" v-model="rippleOnClick" />
      </Customize>

      <PropTable :data="propData" />

      <Dependencies :dependencyList="['gsap']" />
    </template>

    <template #code>
      <CodeExample :codeObject="cubes" />
    </template>

    <template #cli>
      <CliInstallation v-bind="cubes" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TabbedLayout from '../../components/common/TabbedLayout.vue';
import Customize from '../../components/common/Customize.vue';
import PreviewSelect from '../../components/common/PreviewSelect.vue';
import PreviewSlider from '../../components/common/PreviewSlider.vue';
import PreviewSwitch from '../../components/common/PreviewSwitch.vue';
import CodeExample from '../../components/code/CodeExample.vue';
import CliInstallation from '../../components/code/CliInstallation.vue';
import PropTable from '../../components/common/PropTable.vue';
import Dependencies from '../../components/code/Dependencies.vue';

import { cubes } from '../../constants/code/Animations/cubesCode';
import Cubes from '../../content/Animations/Cubes/Cubes.vue';

const borderStyle = ref('2px dashed #A7EF9E');
const gridSize = ref(10);
const maxAngle = ref(45);
const radius = ref(3);
const autoAnimate = ref(true);
const rippleOnClick = ref(true);

const borderOptions = [
  { value: '2px dotted #fff', label: 'Dotted White' },
  { value: '2px dashed #A7EF9E', label: 'Dashed Green' },
  { value: '3px solid #fff', label: 'Solid White' }
];

const propData = [
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
