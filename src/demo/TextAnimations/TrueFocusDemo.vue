<template>
  <h1 class="sub-category">True Focus</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="trueFocus.usage"
    :source="trueFocusSource"
    component-name="TrueFocus"
    :props-table="props"
  >
    <template #preview>
      <div class="h-[400px] demo-container">
        <div :key="key" class="flex flex-col justify-center items-center m-8 pl-6 w-full">
          <TrueFocus :key="key" v-bind="config" />
        </div>
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewColorPicker title="Corners Color" v-model="borderColor" />
        <PreviewSwitch title="Hover Mode" v-model="manualMode" />
        <PreviewSlider title="Blur Amount" v-model="blurAmount" :min="0" :max="15" :step="0.5" value-unit="px" />
        <PreviewSlider
          title="Animation Duration"
          v-model="animationDuration"
          :min="0.1"
          :max="3"
          :step="0.1"
          value-unit="s"
          :disabled="!manualMode"
        />
        <PreviewSlider
          title="Pause Between Animations"
          v-model="pauseBetweenAnimations"
          :min="0"
          :max="5"
          :step="0.5"
          value-unit="s"
          :disabled="manualMode"
        />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="true-focus" :usage="trueFocus.usage!" :source="trueFocusSource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewColorPicker from '@/components/common/PreviewColorPicker.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { trueFocus } from '@/constants/code/TextAnimations/trueFocusCode';
import TrueFocus from '@/content/TextAnimations/TrueFocus/TrueFocus.vue';
import trueFocusSource from '@/content/TextAnimations/TrueFocus/TrueFocus.vue?raw';
import { computed, ref } from 'vue';

const { rerenderKey: key, forceRerender } = useForceRerender();

const DEFAULTS = {
  manualMode: false,
  blurAmount: 5,
  animationDuration: 0.5,
  pauseBetweenAnimations: 1,
  borderColor: '#27FF64'
};

const manualMode = ref(DEFAULTS.manualMode);
const blurAmount = ref(DEFAULTS.blurAmount);
const animationDuration = ref(DEFAULTS.animationDuration);
const pauseBetweenAnimations = ref(DEFAULTS.pauseBetweenAnimations);
const borderColor = ref(DEFAULTS.borderColor);

const config = computed(() => ({
  sentence: 'True Focus',
  manualMode: manualMode.value,
  blurAmount: blurAmount.value,
  borderColor: borderColor.value,
  animationDuration: animationDuration.value,
  pauseBetweenAnimations: pauseBetweenAnimations.value
}));

const hasChanges = computed(
  () =>
    manualMode.value !== DEFAULTS.manualMode ||
    blurAmount.value !== DEFAULTS.blurAmount ||
    animationDuration.value !== DEFAULTS.animationDuration ||
    pauseBetweenAnimations.value !== DEFAULTS.pauseBetweenAnimations ||
    borderColor.value !== DEFAULTS.borderColor
);

function reset() {
  manualMode.value = DEFAULTS.manualMode;
  blurAmount.value = DEFAULTS.blurAmount;
  animationDuration.value = DEFAULTS.animationDuration;
  pauseBetweenAnimations.value = DEFAULTS.pauseBetweenAnimations;
  borderColor.value = DEFAULTS.borderColor;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'sentence',
    type: 'string',
    default: "'True Focus'",
    description: 'The text to display with the focus animation.'
  },
  {
    name: 'separator',
    type: 'string',
    default: "' '",
    description: 'Optional string used to separate words in the sentence.'
  },
  {
    name: 'manualMode',
    type: 'boolean',
    default: 'false',
    description: 'Disables automatic animation when set to true.'
  },
  {
    name: 'blurAmount',
    type: 'number',
    default: '5',
    description: 'The amount of blur applied to non-active words.'
  },
  {
    name: 'borderColor',
    type: 'string',
    default: "'green'",
    description: 'The color of the focus borders.'
  },
  {
    name: 'glowColor',
    type: 'string',
    default: "'rgba(0, 255, 0, 0.6)'",
    description: 'The color of the glowing effect on the borders.'
  },
  {
    name: 'animationDuration',
    type: 'number',
    default: '0.5',
    description: 'The duration of the animation for each word.'
  },
  {
    name: 'pauseBetweenAnimations',
    type: 'number',
    default: '1',
    description: 'Time to pause between focusing on each word (in auto mode).'
  }
];
</script>
