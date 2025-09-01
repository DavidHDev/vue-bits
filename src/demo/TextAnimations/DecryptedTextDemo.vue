<template>
  <TabbedLayout>
    <template #preview>
      <div class="demo-container py-6 overflow-hidden">
        <RefreshButton @click="forceRerender" />

        <div :key="key" class="pl-6 m-8 w-full flex flex-col justify-start items-start">
          <DecryptedText
            :speed="speed"
            text="Ahoy, matey!"
            :max-iterations="maxIterations"
            :sequential="sequential"
            :reveal-direction="revealDirection"
            parent-class-name="decrypted-text"
            :use-original-chars-only="useOriginalCharsOnly"
            :animate-on="animateOn"
          />

          <DecryptedText
            :speed="speed"
            text="Set yer eyes on this"
            :max-iterations="maxIterations"
            :sequential="sequential"
            :reveal-direction="revealDirection"
            parent-class-name="decrypted-text"
            :use-original-chars-only="useOriginalCharsOnly"
            :animate-on="animateOn"
          />

          <DecryptedText
            :speed="speed"
            text="And try tinkerin' round'"
            :max-iterations="maxIterations"
            :sequential="sequential"
            :reveal-direction="revealDirection"
            parent-class-name="decrypted-text"
            :use-original-chars-only="useOriginalCharsOnly"
            :animate-on="animateOn"
          />

          <DecryptedText
            :speed="speed"
            text="with these here props, arr!"
            :max-iterations="maxIterations"
            :sequential="sequential"
            :reveal-direction="revealDirection"
            parent-class-name="decrypted-text"
            :use-original-chars-only="useOriginalCharsOnly"
            :animate-on="animateOn"
            @animation-complete="() => console.log('✅ Animation Finished!')"
          />
        </div>
      </div>

      <Customize>
        <PreviewSwitch title="Sequential" v-model="sequential" />

        <PreviewSwitch title="Original Chars" v-model="useOriginalCharsOnly" />

        <PreviewSlider title="Speed" v-model="speed" :min="10" :max="200" :step="10" value-unit="ms" />

        <PreviewSlider title="Iterations" v-model="maxIterations" :min="1" :max="50" :step="1" />

        <PreviewSelect title="Animation Trigger" v-model="animateOn" :options="animateOptions" />

        <PreviewSelect title="Animation Direction" v-model="revealDirection" :options="directionOptions" />
      </Customize>

      <PropTable :data="propData" />
    </template>

    <template #code>
      <CodeExample :code-object="decryptedText" />
    </template>

    <template #cli>
      <CliInstallation :command="decryptedText.cli" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import TabbedLayout from '../../components/common/TabbedLayout.vue';
import PropTable from '../../components/common/PropTable.vue';
import CliInstallation from '../../components/code/CliInstallation.vue';
import CodeExample from '../../components/code/CodeExample.vue';
import Customize from '../../components/common/Customize.vue';
import PreviewSlider from '../../components/common/PreviewSlider.vue';
import PreviewSwitch from '../../components/common/PreviewSwitch.vue';
import PreviewSelect from '../../components/common/PreviewSelect.vue';
import RefreshButton from '../../components/common/RefreshButton.vue';
import DecryptedText from '../../content/TextAnimations/DecryptedText/DecryptedText.vue';
import { decryptedText } from '@/constants/code/TextAnimations/decryptedTextCode';
import { useForceRerender } from '@/composables/useForceRerender';

const { rerenderKey: key, forceRerender } = useForceRerender();

const speed = ref(60);
const maxIterations = ref(10);
const sequential = ref(true);
const useOriginalCharsOnly = ref(false);
const revealDirection = ref<'start' | 'end' | 'center'>('start');
const animateOn = ref<'view' | 'hover'>('view');

const animateOptions = [
  { label: 'View', value: 'view' },
  { label: 'Hover', value: 'hover' }
];

const directionOptions = [
  { label: 'Start', value: 'start' },
  { label: 'End', value: 'end' },
  { label: 'Center', value: 'center' }
];

const propData = [
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
    type: '"start" | "end" | "center"',
    default: '"start"',
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
    type: '"view" | "hover"',
    default: '"hover"',
    description: 'Trigger scrambling on hover or scroll-into-view.'
  }
];

watch(
  () => [sequential.value, useOriginalCharsOnly.value],
  () => {
    forceRerender();
  }
);
</script>

<style scoped>
.decrypted-text {
  font-size: 2rem;
  line-height: 1.6;
}
</style>
