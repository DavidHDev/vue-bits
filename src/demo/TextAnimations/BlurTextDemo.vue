<template>
  <h1 class="sub-category">Blur Text</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="blurText.usage"
    :source="blurTextSource"
    component-name="BlurText"
    :props-table="props"
  >
    <template #preview>
      <div class="h-[400px] overflow-hidden demo-container">
        <RefreshButton @click="forceRerender" />
        <BlurText
          :key="rerenderKey"
          :text="text"
          :animate-by="animateBy"
          :direction="direction"
          :delay="delay"
          class-name="blur-text-demo"
          @animation-complete="showToast"
        />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSelect title="Animate By" v-model="animateBy" :options="['words', 'letters']" />
        <PreviewSelect title="Direction" v-model="direction" :options="['top', 'bottom']" />
        <PreviewSlider title="Delay" v-model="delay" :min="50" :max="500" :step="10" value-unit="ms" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="blur-text" :usage="blurText.usage!" :source="blurTextSource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewSelect from '@/components/common/PreviewSelect.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { blurText } from '@/constants/code/TextAnimations/blurTextCode';
import BlurText from '@/content/TextAnimations/BlurText/BlurText.vue';
import blurTextSource from '@/content/TextAnimations/BlurText/BlurText.vue?raw';
import { useToast } from 'primevue/usetoast';
import { computed, ref } from 'vue';

const { rerenderKey, forceRerender } = useForceRerender();
const toast = useToast();

const DEFAULTS = {
  text: "Isn't this so cool?!",
  animateBy: 'words' as 'words' | 'letters',
  direction: 'top' as 'top' | 'bottom',
  delay: 200
};

const text = ref(DEFAULTS.text);
const animateBy = ref<'words' | 'letters'>(DEFAULTS.animateBy);
const direction = ref<'top' | 'bottom'>(DEFAULTS.direction);
const delay = ref(DEFAULTS.delay);

const showToast = () => {
  toast.add({
    severity: 'secondary',
    summary: 'Animation Finished!',
    life: 3000
  });
};

const hasChanges = computed(
  () =>
    text.value !== DEFAULTS.text ||
    animateBy.value !== DEFAULTS.animateBy ||
    direction.value !== DEFAULTS.direction ||
    delay.value !== DEFAULTS.delay
);

function reset() {
  text.value = DEFAULTS.text;
  animateBy.value = DEFAULTS.animateBy;
  direction.value = DEFAULTS.direction;
  delay.value = DEFAULTS.delay;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'text',
    type: 'string',
    default: '""',
    description: 'The text content to animate.'
  },
  {
    name: 'animateBy',
    type: 'string',
    default: '"words"',
    description: "Determines whether to animate by 'words' or 'letters'."
  },
  {
    name: 'direction',
    type: 'string',
    default: '"top"',
    description: "Direction from which the words/letters appear ('top' or 'bottom')."
  },
  {
    name: 'delay',
    type: 'number',
    default: '200',
    description: 'Delay between animations for each word/letter (in ms).'
  },
  {
    name: 'stepDuration',
    type: 'number',
    default: '0.35',
    description: 'The time taken for each letter/word to animate (in seconds).'
  },
  {
    name: 'threshold',
    type: 'number',
    default: '0.1',
    description: 'Intersection threshold for triggering the animation.'
  },
  {
    name: 'rootMargin',
    type: 'string',
    default: '"0px"',
    description: 'Root margin for the intersection observer.'
  },
  {
    name: 'onAnimationComplete',
    type: 'function',
    default: 'undefined',
    description: 'Callback function triggered when all animations complete.'
  }
];
</script>

<style scoped>
.blur-text-demo {
  font-size: 5rem;
  font-weight: bolder;
}

@media only screen and (max-width: 967px) {
  .blur-text-demo {
    font-size: 2rem;
    font-weight: bolder;
  }
}
</style>
