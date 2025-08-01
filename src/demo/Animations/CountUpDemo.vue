<template>
  <TabbedLayout>
    <template #preview>
      <h2 class="demo-title-extra">Default</h2>

      <div class="demo-container relative">
        <CountUp
          :key="keyDefault"
          :from="from"
          :to="to"
          :direction="direction"
          :delay="delay"
          :duration="duration"
          class-name="count-up-text"
        />

        <RefreshButton @click="forceRerenderDefault" />
      </div>

      <h2 class="demo-title-extra">Start Programmatically</h2>

      <div class="demo-container flex flex-col justify-center items-center relative min-h-[200px]">
        <button
          class="bg-[#0b0b0b] cursor-pointer rounded-[10px] border border-[#222] text-white px-4 py-2 mb-4"
          @click="setStartCounting(true)"
        >
          Count to 500!
        </button>

        <CountUp
          :key="keyProgrammatically"
          :from="100"
          :to="500"
          :start-when="startCounting"
          :duration="5"
          class-name="count-up-text"
        />

        <RefreshButton v-if="startCounting" @click="forceRerenderProgrammatically" />
      </div>

      <Customize>
        <PreviewSlider title="From" v-model="from" :min="0" :max="100" :step="10" />

        <PreviewSlider title="To" v-model="to" :min="100" :max="500" :step="100" />

        <PreviewSelect title="Direction" v-model="direction" :options="directionOptions" />

        <PreviewSlider title="Duration" v-model="duration" :min="0.5" :max="10" :step="0.5" value-unit="s" />

        <PreviewSlider title="Delay" v-model="delay" :min="0" :max="5" :step="0.5" value-unit="s" />
      </Customize>

      <PropTable :data="propData" />
    </template>

    <template #code>
      <CodeExample :code-object="countup" />
    </template>

    <template #cli>
      <CliInstallation :command="countup.cli" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TabbedLayout from '../../components/common/TabbedLayout.vue';
import PropTable from '../../components/common/PropTable.vue';
import CliInstallation from '../../components/code/CliInstallation.vue';
import CodeExample from '../../components/code/CodeExample.vue';
import RefreshButton from '../../components/common/RefreshButton.vue';
import CountUp from '../../content/Animations/CountUp/CountUp.vue';
import { countup } from '@/constants/code/Animations/countUpCode';
import { useForceRerender } from '@/composables/useForceRerender';
import Customize from '../../components/common/Customize.vue';
import PreviewSlider from '../../components/common/PreviewSlider.vue';
import PreviewSelect from '../../components/common/PreviewSelect.vue';

const startCounting = ref(false);

const { rerenderKey: keyDefault, forceRerender: forceRerenderDefault } = useForceRerender();
const { rerenderKey: keyProgrammatically, forceRerender: forceRerenderProgrammatically } = useForceRerender();

const setStartCounting = (value: boolean) => {
  startCounting.value = value;
  if (value) {
    forceRerenderProgrammatically();
  }
};

const from = ref(50);
const to = ref(100);
const direction = ref<'up' | 'down'>('up');
const duration = ref(2);
const delay = ref(0);

const directionOptions = [
  { label: 'Up', value: 'up' },
  { label: 'Down', value: 'down' }
];

const propData = [
  {
    name: 'to',
    type: 'number',
    default: '—',
    description: 'The target number to count up to.'
  },
  {
    name: 'from',
    type: 'number',
    default: '0',
    description: 'The initial number from which the count starts.'
  },
  {
    name: 'direction',
    type: 'string',
    default: '"up"',
    description:
      'Direction of the count; can be "up" or "down". When this is set to "down", "from" and "to" become reversed, in order to count down.'
  },
  {
    name: 'delay',
    type: 'number',
    default: '0',
    description: 'Delay in seconds before the counting starts.'
  },
  {
    name: 'duration',
    type: 'number',
    default: '2',
    description: 'Duration of the count animation - based on the damping and stiffness configured inside the component.'
  },
  {
    name: 'className',
    type: 'string',
    default: '""',
    description: 'CSS class to apply to the component for additional styling.'
  },
  {
    name: 'startWhen',
    type: 'boolean',
    default: 'true',
    description:
      'A boolean to control whether the animation should start when the component is in view. It basically works like an if statement, if this is true, the count will start.'
  },
  {
    name: 'separator',
    type: 'string',
    default: '""',
    description: 'Character to use as a thousands separator in the displayed number.'
  },
  {
    name: 'onStart',
    type: 'function',
    default: '—',
    description: 'Callback function that is called when the count animation starts.'
  },
  {
    name: 'onEnd',
    type: 'function',
    default: '—',
    description: 'Callback function that is called when the count animation ends.'
  }
];
</script>

<style scoped>
.demo-container {
  min-height: 200px;
  height: 200px;
}
</style>
