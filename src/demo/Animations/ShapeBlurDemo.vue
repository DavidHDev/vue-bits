<template>
  <!-- <div class="shape-blur-demo"> -->
  <h1 class="sub-category">Shape Blur</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="shapeBlur.usage"
    :source="shapeBlurSource"
    component-name="ShapeBlur"
    :props-table="props"
  >
    <template #preview>
      <div class="relative h-[500px] overflow-hidden demo-container">
        <ShapeBlur
          :variation="0"
          :pixel-ratio-prop="pixelRatioProp"
          :shape-size="shapeSize"
          :roundness="roundness"
          :border-size="borderSize"
          :circle-size="circleSize"
          :circle-edge="circleEdge"
          class="z-2 relative mix-blend-difference"
        />
        <div class="hover-text">Hover Me.</div>
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSlider title="Shape Size" v-model="shapeSize" :min="0.1" :max="2" :step="0.1" />
        <PreviewSlider title="Roundness" v-model="roundness" :min="0" :max="1" :step="0.05" />
        <PreviewSlider title="Border Size" v-model="borderSize" :min="0.01" :max="0.2" :step="0.005" />
        <PreviewSlider title="Circle Size" v-model="circleSize" :min="0.1" :max="0.5" :step="0.01" />
        <PreviewSlider title="Circle Edge" v-model="circleEdge" :min="0.1" :max="2" :step="0.1" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="shape-blur" :usage="shapeBlur.usage!" :source="shapeBlurSource" />
    </template>
  </TabsLayout>
  <!-- </div> -->
</template>

<script setup lang="ts">
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { shapeBlur } from '@/constants/code/Animations/shapeBlurCode';
import ShapeBlur from '@/content/Animations/ShapeBlur/ShapeBlur.vue';
import shapeBlurSource from '@/content/Animations/ShapeBlur/ShapeBlur.vue?raw';
import { computed, ref } from 'vue';

const { forceRerender } = useForceRerender();

const DEFAULTS = {
  shapeSize: 1.0,
  roundness: 0.5,
  borderSize: 0.05,
  circleSize: 0.25,
  circleEdge: 1
};

const pixelRatioProp = window.devicePixelRatio || 1;
const shapeSize = ref(DEFAULTS.shapeSize);
const roundness = ref(DEFAULTS.roundness);
const borderSize = ref(DEFAULTS.borderSize);
const circleSize = ref(DEFAULTS.circleSize);
const circleEdge = ref(DEFAULTS.circleEdge);

const hasChanges = computed(
  () =>
    shapeSize.value !== DEFAULTS.shapeSize ||
    roundness.value !== DEFAULTS.roundness ||
    borderSize.value !== DEFAULTS.borderSize ||
    circleSize.value !== DEFAULTS.circleSize ||
    circleEdge.value !== DEFAULTS.circleEdge
);

function reset() {
  shapeSize.value = DEFAULTS.shapeSize;
  roundness.value = DEFAULTS.roundness;
  borderSize.value = DEFAULTS.borderSize;
  circleSize.value = DEFAULTS.circleSize;
  circleEdge.value = DEFAULTS.circleEdge;
  forceRerender();
}

const props: PropRow[] = [
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
