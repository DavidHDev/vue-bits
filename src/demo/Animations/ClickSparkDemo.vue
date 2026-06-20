<template>
  <h1 class="sub-category">Click Spark</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="clickSpark.usage"
    :source="clickSparkSource"
    component-name="ClickSpark"
    :props-table="props"
  >
    <template #preview>
      <div class="relative h-[500px] demo-container">
        <ClickSpark
          :key="rerenderKey"
          :spark-color="sparkColor"
          :spark-size="sparkSize"
          :spark-radius="sparkRadius"
          :spark-count="sparkCount"
          :duration="duration"
          :extra-scale="extraScale"
          class="click-spark-demo-area"
        ></ClickSpark>

        <div
          class="absolute inset-0 flex justify-center items-center font-[900] text-[#222] text-[4rem] pointer-events-none select-none"
        >
          Click Around!
        </div>
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewColorPicker title="Spark Color" v-model="sparkColor" />
        <PreviewSlider title="Spark Size" v-model="sparkSize" :min="5" :max="30" :step="1" />
        <PreviewSlider title="Spark Radius" v-model="sparkRadius" :min="10" :max="50" :step="5" />
        <PreviewSlider title="Spark Count" v-model="sparkCount" :min="4" :max="20" :step="1" />
        <PreviewSlider title="Duration (ms)" v-model="duration" :min="200" :max="1000" :step="50" />
        <PreviewSlider title="Extra Scale" v-model="extraScale" :min="0.5" :max="2" :step="0.1" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="click-spark" :usage="clickSpark.usage!" :source="clickSparkSource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewColorPicker from '@/components/common/PreviewColorPicker.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { clickSpark } from '@/constants/code/Animations/clickSparkCode';
import ClickSpark from '@/content/Animations/ClickSpark/ClickSpark.vue';
import clickSparkSource from '@/content/Animations/ClickSpark/ClickSpark.vue?raw';
import { computed, ref } from 'vue';

const { rerenderKey, forceRerender } = useForceRerender();

const DEFAULTS = {
  sparkColor: '#ffffff',
  sparkSize: 10,
  sparkRadius: 15,
  sparkCount: 8,
  duration: 400,
  extraScale: 1.0
};

const sparkColor = ref(DEFAULTS.sparkColor);
const sparkSize = ref(DEFAULTS.sparkSize);
const sparkRadius = ref(DEFAULTS.sparkRadius);
const sparkCount = ref(DEFAULTS.sparkCount);
const duration = ref(DEFAULTS.duration);
const extraScale = ref(DEFAULTS.extraScale);

const hasChanges = computed(
  () =>
    sparkColor.value !== DEFAULTS.sparkColor ||
    sparkSize.value !== DEFAULTS.sparkSize ||
    sparkRadius.value !== DEFAULTS.sparkRadius ||
    sparkCount.value !== DEFAULTS.sparkCount ||
    duration.value !== DEFAULTS.duration ||
    extraScale.value !== DEFAULTS.extraScale
);

function reset() {
  sparkColor.value = DEFAULTS.sparkColor;
  sparkSize.value = DEFAULTS.sparkSize;
  sparkRadius.value = DEFAULTS.sparkRadius;
  sparkCount.value = DEFAULTS.sparkCount;
  duration.value = DEFAULTS.duration;
  extraScale.value = DEFAULTS.extraScale;
  forceRerender();
}

const props: PropRow[] = [
  { name: 'sparkColor', type: 'string', default: "'#fff'", description: 'Color of the spark lines.' },
  { name: 'sparkSize', type: 'number', default: '10', description: 'Length of each spark line.' },
  { name: 'sparkRadius', type: 'number', default: '15', description: 'Distance sparks travel from the click center.' },
  { name: 'sparkCount', type: 'number', default: '8', description: 'Number of spark lines per click.' },
  { name: 'duration', type: 'number', default: '400', description: 'Animation duration in milliseconds.' },
  {
    name: 'easing',
    type: 'string',
    default: "'ease-out'",
    description: 'Easing function: "linear", "ease-in", "ease-out", or "ease-in-out".'
  },
  { name: 'extraScale', type: 'number', default: '1.0', description: 'Scale multiplier for spark distance and size.' }
];
</script>

<style scoped>
.click-spark-demo-area {
  position: absolute;
  width: 100%;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  cursor: pointer;
}
</style>
