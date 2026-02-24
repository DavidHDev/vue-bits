<template>
  <TabbedLayout>
    <template #preview>
      <div class="h-[400px] overflow-hidden demo-container">
        <RefreshButton @refresh="forceRerender" />

        <BlurText
          :key="rerenderKey"
          text="Isn't this so cool?!"
          :animate-by="animateBy"
          :direction="direction"
          :delay="delay"
          class-name="blur-text-demo"
          @animation-complete="showToast"
        />
      </div>

      <Customize>
        <div class="flex flex-wrap gap-4">
          <button
            class="bg-[#0b0b0b] hover:bg-[#222] px-3 border border-[#333] rounded-[10px] h-8 text-white text-xs transition-colors cursor-pointer"
            @click="toggleAnimateBy"
          >
            Animate By:
            <span class="text-[#a1a1aa]">&nbsp;{{ animateBy }}</span>
          </button>

          <button
            class="bg-[#0b0b0b] hover:bg-[#222] px-3 border border-[#333] rounded-[10px] h-8 text-white text-xs transition-colors cursor-pointer"
            @click="toggleDirection"
          >
            Direction:
            <span class="text-[#a1a1aa]">&nbsp;{{ direction }}</span>
          </button>
        </div>

        <PreviewSlider
          title="Delay"
          v-model="delay"
          :min="50"
          :max="500"
          :step="10"
          value-unit="ms"
          @update:model-value="forceRerender"
        />
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
import CliInstallation from '@/components/code/CliInstallation.vue';
import CodeExample from '@/components/code/CodeExample.vue';
import Dependencies from '@/components/code/Dependencies.vue';
import Customize from '@/components/common/Customize.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PropTable from '@/components/common/PropTable.vue';
import RefreshButton from '@/components/common/RefreshButton.vue';
import TabbedLayout from '@/components/common/TabbedLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { blurText } from '@/constants/code/TextAnimations/blurTextCode';
import BlurText from '@/content/TextAnimations/BlurText/BlurText.vue';
import { useToast } from 'primevue/usetoast';
import { ref } from 'vue';

const { rerenderKey, forceRerender } = useForceRerender();
const toast = useToast();

const animateBy = ref<'words' | 'letters'>('words');
const direction = ref<'top' | 'bottom'>('top');
const delay = ref(200);

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
