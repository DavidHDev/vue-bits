<template>
  <h1 class="sub-category">Decrypted Text</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="decryptedText.usage"
    :source="decryptedTextSource"
    component-name="DecryptedText"
    :props-table="props"
  >
    <template #preview>
      <div class="relative py-6 h-[400px] overflow-hidden demo-container">
        <DecryptedText
          :key="key"
          :speed="speed"
          text="Hacking into the mainframe..."
          :max-iterations="maxIterations"
          :sequential="sequential"
          :reveal-direction="revealDirection"
          parent-class-name="decrypted-text"
          :use-original-chars-only="useOriginalCharsOnly"
          :animate-on="animateOn"
          :click-mode="clickMode"
        />
        <RefreshButton @click="forceRerender" />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSelect title="Animation On" v-model="animateOn" :options="animateOptions" />
        <PreviewSelect
          :is-disabled="animateOn !== 'click'"
          title="Click Mode"
          v-model="clickMode"
          :options="['once', 'toggle']"
        />
        <PreviewSelect title="Direction" v-model="revealDirection" :options="['start', 'end', 'center']" />
        <PreviewSlider title="Speed" v-model="speed" :min="10" :max="200" :step="10" value-unit="ms" />
        <PreviewSlider title="Iterations" v-model="maxIterations" :min="1" :max="50" :step="1" />
        <PreviewSwitch title="Sequential" v-model="sequential" />
        <PreviewSwitch title="Original Chars" v-model="useOriginalCharsOnly" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="decrypted-text" :usage="decryptedText.usage!" :source="decryptedTextSource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewSelect from '@/components/common/PreviewSelect.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import RefreshButton from '@/components/common/RefreshButton.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { decryptedText } from '@/constants/code/TextAnimations/decryptedTextCode';
import DecryptedText from '@/content/TextAnimations/DecryptedText/DecryptedText.vue';
import decryptedTextSource from '@/content/TextAnimations/DecryptedText/DecryptedText.vue?raw';
import { computed, ref } from 'vue';

const { rerenderKey: key, forceRerender } = useForceRerender();

const DEFAULTS = {
  speed: 60,
  maxIterations: 10,
  sequential: true,
  useOriginalCharsOnly: false,
  revealDirection: 'start' as 'start' | 'end' | 'center',
  animateOn: 'view' as 'view' | 'hover' | 'inViewHover' | 'click',
  clickMode: 'once' as 'once' | 'toggle'
};

const speed = ref(DEFAULTS.speed);
const maxIterations = ref(DEFAULTS.maxIterations);
const sequential = ref(DEFAULTS.sequential);
const useOriginalCharsOnly = ref(DEFAULTS.useOriginalCharsOnly);
const revealDirection = ref<'start' | 'end' | 'center'>(DEFAULTS.revealDirection);
const animateOn = ref<'view' | 'hover' | 'inViewHover' | 'click'>(DEFAULTS.animateOn);
const clickMode = ref<'once' | 'toggle'>(DEFAULTS.clickMode);

const animateOptions = [
  { label: 'View', value: 'view' },
  { label: 'Hover', value: 'hover' },
  { label: 'View & Hover', value: 'inViewHover' },
  { label: 'Click', value: 'click' }
];

const hasChanges = computed(
  () =>
    speed.value !== DEFAULTS.speed ||
    maxIterations.value !== DEFAULTS.maxIterations ||
    sequential.value !== DEFAULTS.sequential ||
    useOriginalCharsOnly.value !== DEFAULTS.useOriginalCharsOnly ||
    revealDirection.value !== DEFAULTS.revealDirection ||
    animateOn.value !== DEFAULTS.animateOn ||
    clickMode.value !== DEFAULTS.clickMode
);

function reset() {
  speed.value = DEFAULTS.speed;
  maxIterations.value = DEFAULTS.maxIterations;
  sequential.value = DEFAULTS.sequential;
  useOriginalCharsOnly.value = DEFAULTS.useOriginalCharsOnly;
  revealDirection.value = DEFAULTS.revealDirection;
  animateOn.value = DEFAULTS.animateOn;
  clickMode.value = DEFAULTS.clickMode;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'text',
    type: 'string',
    default: '""',
    description: 'The text content to decrypt.'
  },
  {
    name: 'speed',
    type: 'number',
    default: '50',
    description: 'Time in ms between each iteration.'
  },
  {
    name: 'maxIterations',
    type: 'number',
    default: '10',
    description: 'Max # of random iterations (non-sequential mode).'
  },
  {
    name: 'sequential',
    type: 'boolean',
    default: 'false',
    description: 'Whether to reveal one character at a time in sequence.'
  },
  {
    name: 'revealDirection',
    type: `"start" | "end" | "center"`,
    default: `"start"`,
    description: 'From which position characters begin to reveal in sequential mode.'
  },
  {
    name: 'useOriginalCharsOnly',
    type: 'boolean',
    default: 'false',
    description: 'Restrict scrambling to only the characters already in the text.'
  },
  {
    name: 'className',
    type: 'string',
    default: '""',
    description: 'CSS class for revealed characters.'
  },
  {
    name: 'parentClassName',
    type: 'string',
    default: '""',
    description: 'CSS class for the main characters container.'
  },
  {
    name: 'encryptedClassName',
    type: 'string',
    default: '""',
    description: 'CSS class for encrypted characters.'
  },
  {
    name: 'animateOn',
    type: `"view" | "hover" | "inViewHover" | "click"`,
    default: `"hover"`,
    description: 'Trigger scrambling on hover or scroll-into-view.'
  },
  {
    name: 'clickMode',
    type: `"once" | "toggle"`,
    default: `"once"`,
    description: 'Controls click behavior; only applies when animateOn is "click".'
  }
];
</script>

<style scoped>
.decrypted-text {
  font-size: 2rem;
  max-width: 30ch;
  display: inline-block;
  font-weight: 400;
  color: var(--text-primary);
  cursor: pointer;
}

@media only screen and (max-width: 967px) {
  .decrypted-text {
    font-size: 1rem;
  }
}
</style>
