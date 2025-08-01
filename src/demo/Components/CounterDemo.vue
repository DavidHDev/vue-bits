<template>
  <TabbedLayout>
    <template #preview>
      <div class="demo-container h-[400px] overflow-hidden relative">
        <Counter
          :value="value"
          :places="[100, 10, 1]"
          gradientFrom="#0b0b0b"
          :fontSize="fontSize"
          :padding="5"
          :gap="gap"
          :borderRadius="10"
          :horizontalPadding="15"
          textColor="white"
          :fontWeight="900"
        />

        <div class="flex gap-4 bottom-4 justify-center mt-4 absolute left-1/2 transform -translate-x-1/2">
          <button
            class="cursor-pointer bg-[#0b0b0b] rounded-[10px] border border-[#333] hover:bg-[#222] text-white h-10 w-10 transition-colors"
            @click="value > 0 && value--"
          >
            -
          </button>
          <button
            class="cursor-pointer bg-[#0b0b0b] rounded-[10px] border border-[#333] hover:bg-[#222] text-white h-10 w-10 transition-colors"
            @click="value < 999 && value++"
          >
            +
          </button>
        </div>
      </div>

      <Customize>
        <PreviewSlider title="Value" v-model="value" :min="0" :max="999" :step="1" />

        <PreviewSlider title="Gap" v-model="gap" :min="0" :max="50" :step="5" />

        <PreviewSlider title="Font Size" v-model="fontSize" :min="40" :max="200" :step="10" />
      </Customize>

      <PropTable :data="propData" />
      <Dependencies :dependency-list="['motion-v']" />
    </template>

    <template #code>
      <CodeExample :code-object="counter" />
    </template>

    <template #cli>
      <CliInstallation :command="counter.cli" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TabbedLayout from '../../components/common/TabbedLayout.vue';
import Customize from '../../components/common/Customize.vue';
import PreviewSlider from '../../components/common/PreviewSlider.vue';
import PropTable from '../../components/common/PropTable.vue';
import CodeExample from '../../components/code/CodeExample.vue';
import CliInstallation from '../../components/code/CliInstallation.vue';
import Dependencies from '../../components/code/Dependencies.vue';

import Counter from '../../content/Components/Counter/Counter.vue';
import { counter } from '../../constants/code/Components/counterCode';

const value = ref(123);
const fontSize = ref(80);
const gap = ref(10);

const propData = [
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
    default: '[100, 10, 1]',
    description: 'An array of place values to determine which digits to display.'
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
