<template>
  <div class="shape-blur-demo">
    <TabbedLayout>
      <template #preview>
        <div class="demo-container h-[500px] overflow-hidden">
          <ShapeBlur
            :variation="0"
            :pixel-ratio-prop="pixelRatioProp"
            :shape-size="shapeSize"
            :roundness="roundness"
            :border-size="borderSize"
            :circle-size="circleSize"
            :circle-edge="circleEdge"
            class="shapeblur-demo"
          />
          <div class="hover-text">Hover Me.</div>
        </div>

        <Customize>
          <PreviewSlider title="Shape Size" v-model="shapeSize" :min="0.1" :max="2" :step="0.1" />

          <PreviewSlider title="Roundness" v-model="roundness" :min="0" :max="1" :step="0.05" />

          <PreviewSlider title="Border Size" v-model="borderSize" :min="0.01" :max="0.2" :step="0.005" />

          <PreviewSlider title="Circle Size" v-model="circleSize" :min="0.1" :max="0.5" :step="0.01" />

          <PreviewSlider title="Circle Edge" v-model="circleEdge" :min="0.1" :max="2" :step="0.1" />
        </Customize>

        <PropTable :data="propData" />

        <Dependencies :dependency-list="['three']" />
      </template>

      <template #code>
        <CodeExample :code-object="shapeBlur" />
      </template>

      <template #cli>
        <CliInstallation :command="shapeBlur.cli" />
      </template>
    </TabbedLayout>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TabbedLayout from '../../components/common/TabbedLayout.vue';
import PropTable from '../../components/common/PropTable.vue';
import Dependencies from '../../components/code/Dependencies.vue';
import CliInstallation from '../../components/code/CliInstallation.vue';
import CodeExample from '../../components/code/CodeExample.vue';
import Customize from '../../components/common/Customize.vue';
import PreviewSlider from '../../components/common/PreviewSlider.vue';
import ShapeBlur from '../../content/Animations/ShapeBlur/ShapeBlur.vue';
import { shapeBlur } from '@/constants/code/Animations/shapeBlurCode';

const pixelRatioProp = ref(window.devicePixelRatio || 1);
const shapeSize = ref(1.0);
const roundness = ref(0.5);
const borderSize = ref(0.05);
const circleSize = ref(0.25);
const circleEdge = ref(1);

const propData = [
  {
    name: 'variation',
    type: 'number',
    default: '0',
    description: 'Selects the shape variation (0-3) used by the shader.'
  },
  {
    name: 'pixelRatioProp',
    type: 'number',
    default: '2',
    description: 'Overrides the pixel ratio, typically set to the device pixel ratio.'
  },
  {
    name: 'shapeSize',
    type: 'number',
    default: '1.2',
    description: 'Controls the size of the shape.'
  },
  {
    name: 'roundness',
    type: 'number',
    default: '0.4',
    description: "Determines the roundness of the shape's corners."
  },
  {
    name: 'borderSize',
    type: 'number',
    default: '0.05',
    description: 'Sets the thickness of the border.'
  },
  {
    name: 'circleSize',
    type: 'number',
    default: '0.3',
    description: 'Determines the size of the hover circle effect.'
  },
  {
    name: 'circleEdge',
    type: 'number',
    default: '0.5',
    description: 'Controls the edge softness of the hover circle.'
  }
];
</script>

<style scoped>
.hover-text {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-size: 6rem;
  font-weight: 900;
  z-index: 0;
  color: #222;
  pointer-events: none;
}
</style>
