<template>
  <TabbedLayout>
    <template #preview>
      <div class="demo-container h-[400px] overflow-hidden">
        <RefreshButton @refresh="forceRerender" />

        <BlurText
          :key="rerenderKey"
          text="Isn't this so cool?!"
          :delay="delay"
          class-name="blur-text-demo"
          :animate-by="animateBy"
          :direction="direction"
          :threshold="threshold"
          :root-margin="rootMargin"
          :step-duration="stepDuration"
          @animation-complete="
            () => {
              showCallback && showToast();
            }
          "
        />
      </div>

      <Customize>
        <PreviewSwitch title="Show Completion Toast" v-model="showCallback" />

        <div class="flex gap-4 flex-wrap">
          <button
            class="text-xs bg-[#0b0b0b] rounded-[10px] border border-[#333] hover:bg-[#222] text-white h-8 px-3 transition-colors cursor-pointer"
            @click="toggleAnimateBy"
          >
            Animate By:
            <span class="text-[#a1a1aa]">&nbsp;{{ animateBy }}</span>
          </button>

          <button
            class="text-xs bg-[#0b0b0b] rounded-[10px] border border-[#333] hover:bg-[#222] text-white h-8 px-3 transition-colors cursor-pointer"
            @click="toggleDirection"
          >
            Direction:
            <span class="text-[#a1a1aa]">&nbsp;{{ direction }}</span>
          </button>
        </div>

        <PreviewSlider title="Delay (ms)" v-model="delay" :min="50" :max="500" :step="10" />

        <PreviewSlider title="Step Duration (s)" v-model="stepDuration" :min="0.1" :max="1" :step="0.05" />

        <PreviewSlider title="Threshold" v-model="threshold" :min="0.1" :max="1" :step="0.1" />
      </Customize>

      <PropTable :data="propData" />

      <Dependencies :dependency-list="['motion-v']" />
    </template>

    <template #code>
      <CodeExample :code-object="blurText" />
    </template>

    <template #cli>
      <CliInstallation :command="blurText.cli" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TabbedLayout from '../../components/common/TabbedLayout.vue';
import RefreshButton from '../../components/common/RefreshButton.vue';
import PropTable from '../../components/common/PropTable.vue';
import Dependencies from '../../components/code/Dependencies.vue';
import CliInstallation from '../../components/code/CliInstallation.vue';
import CodeExample from '../../components/code/CodeExample.vue';
import Customize from '../../components/common/Customize.vue';
import PreviewSwitch from '../../components/common/PreviewSwitch.vue';
import PreviewSlider from '../../components/common/PreviewSlider.vue';
import BlurText from '../../content/TextAnimations/BlurText/BlurText.vue';
import { blurText } from '@/constants/code/TextAnimations/blurTextCode';
import { useToast } from 'primevue/usetoast';
import { useForceRerender } from '@/composables/useForceRerender';

const animateBy = ref<'words' | 'letters'>('words');
const direction = ref<'top' | 'bottom'>('top');
const delay = ref(200);
const stepDuration = ref(0.35);
const threshold = ref(0.1);
const rootMargin = ref('0px');
const showCallback = ref(true);
const toast = useToast();
const { rerenderKey, forceRerender } = useForceRerender();

const toggleAnimateBy = () => {
  animateBy.value = animateBy.value === 'words' ? 'letters' : 'words';
  forceRerender();
};

const toggleDirection = () => {
  direction.value = direction.value === 'top' ? 'bottom' : 'top';
  forceRerender();
};

const showToast = () => {
  toast.add({
    severity: 'secondary',
    summary: 'Animation Finished!',
    life: 3000
  });
};

const propData = [
  { name: 'text', type: 'string', default: '""', description: 'The text content to animate.' },
  {
    name: 'animateBy',
    type: 'string',
    default: '"words"',
    description: 'Determines whether to animate by "words" or "letters".'
  },
  {
    name: 'direction',
    type: 'string',
    default: '"top"',
    description: 'Direction from which the words/letters appear ("top" or "bottom").'
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
  { name: 'rootMargin', type: 'string', default: '"0px"', description: 'Root margin for the intersection observer.' },
  { name: 'className', type: 'string', default: '""', description: 'Additional class names to style the component.' },
  { name: 'animationFrom', type: 'object', default: 'undefined', description: 'Custom initial animation properties.' },
  {
    name: 'animationTo',
    type: 'array',
    default: 'undefined',
    description: 'Custom target animation properties array.'
  },
  { name: 'easing', type: 'function', default: '(t) => t', description: 'Custom easing function for the animation.' },
  {
    name: 'onAnimationComplete',
    type: 'function',
    default: 'undefined',
    description: 'Callback function triggered when all animations complete.'
  }
];
</script>
