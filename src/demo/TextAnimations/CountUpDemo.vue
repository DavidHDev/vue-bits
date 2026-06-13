<template>
  <h1 class="sub-category">Count Up</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="countUp.usage"
    :source="countUpSource"
    component-name="CountUp"
    :props-table="props"
  >
    <template #preview>
      <div class="relative h-[200px] overflow-hidden demo-container">
        <CountUp
          :key="rerenderKey"
          :from="from"
          :to="to"
          :direction="direction"
          :delay="delay"
          :duration="duration"
          :separator="separator"
          class-name="count-up-text"
        />
        <RefreshButton @click="forceRerender" />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSlider title="From" v-model="from" :min="0" :max="100" :step="10" />
        <PreviewSlider title="To" v-model="to" :min="0" :max="10000" :step="100" />
        <PreviewSlider title="Duration" v-model="duration" :min="0.5" :max="10" :step="0.5" value-unit="s" />
        <PreviewSlider title="Delay" v-model="delay" :min="0" :max="5" :step="0.5" value-unit="s" />
        <PreviewSelect title="Direction" v-model="direction" :options="['up', 'down']" />
        <PreviewInput title="Separator" v-model="separator" placeholder="," :maxlength="1" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="count-up" :usage="countUp.usage!" :source="countUpSource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewInput from '@/components/common/PreviewInput.vue';
import PreviewSelect from '@/components/common/PreviewSelect.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import RefreshButton from '@/components/common/RefreshButton.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { countUp } from '@/constants/code/TextAnimations/countUpCode';
import CountUp from '@/content/TextAnimations/CountUp/CountUp.vue';
import countUpSource from '@/content/TextAnimations/CountUp/CountUp.vue?raw';
import { computed, ref } from 'vue';

const { rerenderKey, forceRerender } = useForceRerender();

// const startCounting = ref(false);

// const { rerenderKey: keyDefault, forceRerender: forceRerenderDefault } = useForceRerender();
// const { rerenderKey: keyProgrammatically, forceRerender: forceRerenderProgrammatically } = useForceRerender();

// const setStartCounting = (value: boolean) => {
//   startCounting.value = value;
//   if (value) {
//     forceRerenderProgrammatically();
//   }
// };

const DEFAULTS = {
  from: 0,
  to: 100,
  duration: 1,
  delay: 0,
  direction: 'up' as 'up' | 'down',
  separator: ','
};

const from = ref(DEFAULTS.from);
const to = ref(DEFAULTS.to);
const duration = ref(DEFAULTS.duration);
const delay = ref(DEFAULTS.delay);
const direction = ref<'up' | 'down'>(DEFAULTS.direction);
const separator = ref(DEFAULTS.separator);

const hasChanges = computed(
  () =>
    from.value !== DEFAULTS.from ||
    to.value !== DEFAULTS.to ||
    duration.value !== DEFAULTS.duration ||
    delay.value !== DEFAULTS.delay ||
    direction.value !== DEFAULTS.direction ||
    separator.value !== DEFAULTS.separator
);

function reset() {
  from.value = DEFAULTS.from;
  to.value = DEFAULTS.to;
  duration.value = DEFAULTS.duration;
  delay.value = DEFAULTS.delay;
  direction.value = DEFAULTS.direction;
  separator.value = DEFAULTS.separator;
  forceRerender();
}

const props: PropRow[] = [
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
.count-up-text {
  font-size: 4rem;
  font-weight: bold;
}
</style>
