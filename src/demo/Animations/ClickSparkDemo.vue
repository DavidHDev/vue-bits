<template>
  <TabbedLayout>
    <template #preview>
      <div class="demo-container h-[500px]">
        <ClickSpark
          :key="rerenderKey"
          :spark-color="sparkColor"
          :spark-size="sparkSize"
          :spark-radius="sparkRadius"
          :spark-count="sparkCount"
          :duration="duration"
          :easing="easing"
          :extra-scale="extraScale"
          class="click-spark-demo-area"
        ></ClickSpark>

        <div
          class="absolute inset-0 flex items-center justify-center pointer-events-none text-[4rem] font-[900] text-[#222] select-none"
        >
          Click Around!
        </div>
      </div>

      <Customize>
        <PreviewColor title="Spark Color" v-model="sparkColor" />

        <PreviewSlider title="Spark Size" v-model="sparkSize" :min="5" :max="30" :step="1" />

        <PreviewSlider title="Spark Radius" v-model="sparkRadius" :min="10" :max="50" :step="5" />

        <PreviewSlider title="Spark Count" v-model="sparkCount" :min="4" :max="20" :step="1" />

        <PreviewSlider title="Duration (ms)" v-model="duration" :min="200" :max="1000" :step="50" />

        <PreviewSlider title="Extra Scale" v-model="extraScale" :min="0.5" :max="2" :step="0.1" />
      </Customize>

      <PropTable :data="propData" />
    </template>

    <template #code>
      <CodeExample :code-object="clickSpark" />
    </template>

    <template #cli>
      <CliInstallation :command="clickSpark.cli" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TabbedLayout from '../../components/common/TabbedLayout.vue';
import PropTable from '../../components/common/PropTable.vue';
import CliInstallation from '../../components/code/CliInstallation.vue';
import CodeExample from '../../components/code/CodeExample.vue';
import Customize from '../../components/common/Customize.vue';
import PreviewColor from '../../components/common/PreviewColor.vue';
import PreviewSlider from '../../components/common/PreviewSlider.vue';
import ClickSpark from '../../content/Animations/ClickSpark/ClickSpark.vue';
import { clickSpark } from '@/constants/code/Animations/clickSparkCode';
import { useForceRerender } from '@/composables/useForceRerender';

const sparkColor = ref('#ffffff');
const sparkSize = ref(10);
const sparkRadius = ref(15);
const sparkCount = ref(8);
const duration = ref(400);
const easing = ref<'linear' | 'ease-in' | 'ease-out' | 'ease-in-out'>('ease-out');
const extraScale = ref(1);
const { rerenderKey } = useForceRerender();

const propData = [
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
