<template>
  <h1 class="sub-category">Curved Loop</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="curvedLoop.usage"
    :source="curvedLoopSource"
    component-name="CurvedLoop"
    :props-table="props"
  >
    <template #preview>
      <div class="h-[500px] overflow-hidden demo-container">
        <CurvedLoop
          :key="rerenderKey"
          :marquee-text="marqueeText"
          :speed="speed"
          :curve-amount="curveAmount"
          :interactive="interactive"
        />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewInput title="Marquee Text" v-model="marqueeText" placeholder="Enter text..." />
        <PreviewSlider title="Speed" v-model="speed" :min="0" :max="10" :step="0.1" />
        <PreviewSlider title="Curve Amount" v-model="curveAmount" :min="-400" :max="400" :step="10" value-unit="px" />
        <PreviewSwitch title="Draggable" v-model="interactive" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="curved-loop" :usage="curvedLoop.usage!" :source="curvedLoopSource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewInput from '@/components/common/PreviewInput.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { curvedLoop } from '@/constants/code/TextAnimations/curvedLoopCode';
import CurvedLoop from '@/content/TextAnimations/CurvedLoop/CurvedLoop.vue';
import curvedLoopSource from '@/content/TextAnimations/CurvedLoop/CurvedLoop.vue?raw';
import { computed, ref } from 'vue';

const { rerenderKey, forceRerender } = useForceRerender();

const DEFAULTS = {
  marqueeText: 'Be ✦ Creative ✦ With ✦ Vue ✦ Bits ✦',
  speed: 2,
  curveAmount: 400,
  interactive: true
};

const marqueeText = ref(DEFAULTS.marqueeText);
const speed = ref(DEFAULTS.speed);
const curveAmount = ref(DEFAULTS.curveAmount);
const interactive = ref(DEFAULTS.interactive);

const hasChanges = computed(
  () =>
    marqueeText.value !== DEFAULTS.marqueeText ||
    speed.value !== DEFAULTS.speed ||
    curveAmount.value !== DEFAULTS.curveAmount ||
    interactive.value !== DEFAULTS.interactive
);

function reset() {
  marqueeText.value = DEFAULTS.marqueeText;
  speed.value = DEFAULTS.speed;
  curveAmount.value = DEFAULTS.curveAmount;
  interactive.value = DEFAULTS.interactive;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'marqueeText',
    type: 'string',
    default: '""',
    description: 'The text to display in the curved marquee'
  },
  {
    name: 'speed',
    type: 'number',
    default: '2',
    description: 'Animation speed of the marquee text'
  },
  {
    name: 'className',
    type: 'string',
    default: 'undefined',
    description: 'CSS class name for styling the text'
  },
  {
    name: 'curveAmount',
    type: 'number',
    default: '400',
    description: 'Amount of curve in the text path'
  },
  {
    name: 'direction',
    type: '"left" | "right"',
    default: '"left"',
    description: 'Initial direction of the marquee animation'
  },
  {
    name: 'interactive',
    type: 'boolean',
    default: 'true',
    description: 'Whether the marquee can be dragged by the user'
  }
];
</script>
