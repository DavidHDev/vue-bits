<template>
  <TabbedLayout>
    <template #preview>
      <div class="demo-container h-[500px]">
        <MetaBalls
          :color="color"
          :cursorBallColor="color"
          :cursorBallSize="cursorBallSize"
          :ballCount="ballCount"
          :animationSize="animationSize"
          :enableMouseInteraction="enableMouseInteraction"
          :hoverSmoothness="hoverSmoothness"
          :clumpFactor="clumpFactor"
          :speed="speed"
          mix-blend-mode="screen"
        />
      </div>

      <Customize>
        <PreviewColor title="Color" v-model="color" />

        <PreviewSlider title="Ball Count" :min="2" :max="30" :step="1" v-model="ballCount" />

        <PreviewSlider title="Speed" :min="0.1" :max="1" :step="0.1" v-model="speed" />

        <PreviewSlider title="Size" :min="10" :max="50" :step="1" v-model="animationSize" />

        <PreviewSlider title="Clump Factor" :min="0.1" :max="2" :step="0.1" v-model="clumpFactor" />

        <PreviewSwitch title="Follow Cursor" v-model="enableMouseInteraction" />

        <PreviewSlider title="Cursor Smoothing" :min="0.001" :max="0.25" :step="0.001" v-model="hoverSmoothness" />

        <PreviewSlider title="Cursor Size" :min="1" :max="5" :step="1" v-model="cursorBallSize" />
      </Customize>

      <PropTable :data="propData" />
      <Dependencies :dependency-list="['ogl']" />
    </template>

    <template #code>
      <CodeExample :code-object="metaBalls" />
    </template>

    <template #cli>
      <CliInstallation :command="metaBalls.cli" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import CliInstallation from '../../components/code/CliInstallation.vue';
import CodeExample from '../../components/code/CodeExample.vue';
import Dependencies from '../../components/code/Dependencies.vue';
import Customize from '../../components/common/Customize.vue';
import PreviewColor from '../../components/common/PreviewColor.vue';
import PreviewSlider from '../../components/common/PreviewSlider.vue';
import PreviewSwitch from '../../components/common/PreviewSwitch.vue';
import PropTable from '../../components/common/PropTable.vue';
import TabbedLayout from '../../components/common/TabbedLayout.vue';
import { metaBalls } from '../../constants/code/Animations/metaBallsCode';
import MetaBalls from '../../content/Animations/MetaBalls/MetaBalls.vue';

const color = ref('#27FF64');
const speed = ref(0.3);
const animationSize = ref(30);
const ballCount = ref(15);
const clumpFactor = ref(1);
const enableMouseInteraction = ref(true);
const hoverSmoothness = ref(0.15);
const cursorBallSize = ref(2);

const propData = [
  {
    name: 'color',
    type: 'string',
    default: '#27FF64',
    description: 'The base color of the metaballs.'
  },
  {
    name: 'speed',
    type: 'number',
    default: '0.3',
    description: 'Speed multiplier for the animation.'
  },
  {
    name: 'enableMouseInteraction',
    type: 'boolean',
    default: 'true',
    description: 'Enables or disables the ball following the mouse.'
  },
  {
    name: 'enableTransparency',
    type: 'boolean',
    default: 'false',
    description: 'Enables or disables transparency for the container of the animation.'
  },
  {
    name: 'hoverSmoothness',
    type: 'number',
    default: '0.05',
    description: 'Smoothness factor for the cursor ball when following the mouse.'
  },
  {
    name: 'animationSize',
    type: 'number',
    default: '30',
    description: 'The size of the world for the animation.'
  },
  {
    name: 'ballCount',
    type: 'number',
    default: '15',
    description: 'Number of metaballs rendered.'
  },
  {
    name: 'clumpFactor',
    type: 'number',
    default: '1',
    description: 'Determines how close together the balls are rendered.'
  },
  {
    name: 'cursorBallSize',
    type: 'number',
    default: '3',
    description: 'Size of the cursor-controlled ball.'
  },
  {
    name: 'cursorBallColor',
    type: 'string',
    default: '#27FF64',
    description: 'Color of the cursor ball.'
  },
  {
    name: 'mixBlendMode',
    type: 'string',
    default: 'normal',
    description: 'CSS mix-blend-mode value for how the metaballs blend with content behind them.'
  }
];
</script>
