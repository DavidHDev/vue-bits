<template>
  <h1 class="sub-category">Counter</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="counter.usage"
    :source="counterSource"
    component-name="Counter"
    :props-table="props"
  >
    <template #preview>
      <div class="relative h-[500px] overflow-hidden demo-container">
        <Counter
          :value="value"
          gradient-from="#0b0b0b"
          :font-size="fontSize"
          :padding="5"
          :gap="gap"
          :border-radius="10"
          :horizontal-padding="15"
          text-color="white"
          :font-weight="900"
          v-bind="digitPlaceHolders ? { places: [100, 10, 1, '.', 0.1] } : {}"
        />

        <div class="bottom-[1em] absolute flex justify-center gap-4 mt-4">
          <button
            class="bg-[#0b0b0b] hover:bg-[#222] border border-[#333] rounded-[10px] w-16 h-10 text-white transition-colors cursor-pointer"
            @click="() => (value = roundToTenth(value - 0.4))"
          >
            - 0.4
          </button>
          <button
            class="bg-[#0b0b0b] hover:bg-[#222] border border-[#333] rounded-[10px] w-16 h-10 text-white transition-colors cursor-pointer"
            @click="() => (value = roundToTenth(value - 1))"
          >
            -
          </button>
          <button
            class="bg-[#0b0b0b] hover:bg-[#222] border border-[#333] rounded-[10px] w-16 h-10 text-white transition-colors cursor-pointer"
            @click="() => (value = roundToTenth(value + 1))"
          >
            +
          </button>
          <button
            class="bg-[#0b0b0b] hover:bg-[#222] border border-[#333] rounded-[10px] w-16 h-10 text-white transition-colors cursor-pointer"
            @click="() => (value = roundToTenth(value + 0.4))"
          >
            + 0.4
          </button>
        </div>
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSwitch title="Digit Place Holders" v-model="digitPlaceHolders" />
        <PreviewSlider title="Value" v-model="value" :min="0" :max="999" :step="1" />
        <PreviewSlider title="Gap" v-model="gap" :min="0" :max="50" :step="10" />
        <PreviewSlider title="Font Size" v-model="fontSize" :min="40" :max="200" :step="10" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="counter" :usage="counter.usage!" :source="counterSource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { counter } from '@/constants/code/Components/counterCode';
import Counter from '@/content/Components/Counter/Counter.vue';
import counterSource from '@/content/Components/Counter/Counter.vue?raw';
import { computed, ref } from 'vue';

const { forceRerender } = useForceRerender();
const roundToTenth = (num: number) => Math.round(num * 10) / 10;

const DEFAULTS = {
  digitPlaceHolders: true,
  value: 1,
  fontSize: 80,
  gap: 10
};

const digitPlaceHolders = ref(DEFAULTS.digitPlaceHolders);
const value = ref(DEFAULTS.value);
const fontSize = ref(DEFAULTS.fontSize);
const gap = ref(DEFAULTS.gap);

const hasChanges = computed(
  () =>
    digitPlaceHolders.value !== DEFAULTS.digitPlaceHolders ||
    value.value !== DEFAULTS.value ||
    fontSize.value !== DEFAULTS.fontSize ||
    gap.value !== DEFAULTS.gap
);

function reset() {
  digitPlaceHolders.value = DEFAULTS.digitPlaceHolders;
  value.value = DEFAULTS.value;
  fontSize.value = DEFAULTS.fontSize;
  gap.value = DEFAULTS.gap;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'value',
    type: 'number',
    default: 'N/A (required)',
    description: 'The numeric value to display in the counter.'
  },
  {
    name: 'fontSize',
    type: 'number',
    default: '100',
    description: 'The base font size used for the counter digits.'
  },
  {
    name: 'padding',
    type: 'number',
    default: '0',
    description: 'Additional padding added to the digit height.'
  },
  {
    name: 'places',
    type: 'number[]',
    default: '[100, 10, 1 , "." , 0.1]',
    description:
      'Defines which digit positions to display. Include whole number and decimal place values (use "." for the decimal point). If omitted, place values will be detected automatically.'
  },
  {
    name: 'gap',
    type: 'number',
    default: '8',
    description: 'The gap (in pixels) between each digit.'
  },
  {
    name: 'borderRadius',
    type: 'number',
    default: '4',
    description: 'The border radius (in pixels) for the counter container.'
  },
  {
    name: 'horizontalPadding',
    type: 'number',
    default: '8',
    description: 'The horizontal padding (in pixels) for the counter container.'
  },
  {
    name: 'textColor',
    type: 'string',
    default: "'white'",
    description: 'The text color for the counter digits.'
  },
  {
    name: 'fontWeight',
    type: 'string | number',
    default: "'bold'",
    description: 'The font weight of the counter digits.'
  },
  {
    name: 'containerStyle',
    type: 'CSSProperties',
    default: '{}',
    description: 'Custom inline styles for the outer container.'
  },
  {
    name: 'counterStyle',
    type: 'CSSProperties',
    default: '{}',
    description: 'Custom inline styles for the counter element.'
  },
  {
    name: 'digitStyle',
    type: 'CSSProperties',
    default: '{}',
    description: 'Custom inline styles for each digit container.'
  },
  {
    name: 'gradientHeight',
    type: 'number',
    default: '16',
    description: 'The height (in pixels) of the gradient overlays.'
  },
  {
    name: 'gradientFrom',
    type: 'string',
    default: "'black'",
    description: 'The starting color for the gradient overlays.'
  },
  {
    name: 'gradientTo',
    type: 'string',
    default: "'transparent'",
    description: 'The ending color for the gradient overlays.'
  },
  {
    name: 'topGradientStyle',
    type: 'CSSProperties',
    default: 'undefined',
    description: 'Custom inline styles for the top gradient overlay.'
  },
  {
    name: 'bottomGradientStyle',
    type: 'CSSProperties',
    default: 'undefined',
    description: 'Custom inline styles for the bottom gradient overlay.'
  }
];
</script>
