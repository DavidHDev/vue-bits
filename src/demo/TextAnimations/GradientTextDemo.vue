<template>
  <div class="gradient-text-demo">
    <TabbedLayout>
      <template #preview>
        <h2 class="demo-title-extra">Default</h2>

        <div class="demo-container h-[200px]">
          <div class="text-[2rem]">
            <GradientText
              text="Add a splash of color!"
              :colors="gradientPreview"
              :animation-speed="speed"
              :show-border="false"
            />
          </div>
        </div>

        <h2 class="demo-title-extra">Border Animation</h2>

        <div class="demo-container h-[200px]">
          <div class="text-[2rem]">
            <GradientText
              text="Now with a cool border!"
              :colors="gradientPreview"
              :animation-speed="speed"
              :show-border="true"
              class-name="custom-gradient-class"
            />
          </div>
        </div>

        <Customize>
          <PreviewSlider title="Loop Duration" v-model="speed" :min="1" :max="10" :step="0.5" value-unit="s" />

          <div class="flex flex-col gap-0">
            <div class="mb-4">
              <label class="block text-sm font-medium mb-2">Colors</label>

              <input
                v-model="colors"
                type="text"
                placeholder="Enter colors separated by commas"
                maxlength="100"
                class="w-[300px] px-3 py-2 bg-[#0b0b0b] border border-[#333] rounded-md text-white focus:outline-none focus:border-[#666]"
              />
            </div>

            <div
              class="w-[300px] h-3 rounded-md border border-[#333333]"
              :style="{
                background: `linear-gradient(to right, ${gradientPreview.join(', ')})`
              }"
            />
          </div>
        </Customize>

        <p class="demo-extra-info mt-4 flex items-center gap-2">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clip-rule="evenodd"
            />
          </svg>
          For a smoother animation, the gradient should start and end with the same color.
        </p>

        <PropTable :data="propData" />
      </template>

      <template #code>
        <CodeExample :code-object="gradientText" />
      </template>

      <template #cli>
        <CliInstallation :command="gradientText.cli" />
      </template>
    </TabbedLayout>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import TabbedLayout from '../../components/common/TabbedLayout.vue';
import PropTable from '../../components/common/PropTable.vue';
import CliInstallation from '../../components/code/CliInstallation.vue';
import CodeExample from '../../components/code/CodeExample.vue';
import Customize from '../../components/common/Customize.vue';
import PreviewSlider from '../../components/common/PreviewSlider.vue';
import GradientText from '../../content/TextAnimations/GradientText/GradientText.vue';
import { gradientText } from '@/constants/code/TextAnimations/gradientTextCode';

const colors = ref('#40ffaa, #4079ff, #40ffaa, #4079ff, #40ffaa');
const speed = ref(3);

const gradientPreview = computed(() => colors.value.split(',').map(color => color.trim()));

const propData = [
  {
    name: 'text',
    type: 'string',
    default: '""',
    description: 'The text content to be displayed with gradient effect.'
  },
  {
    name: 'className',
    type: 'string',
    default: "''",
    description: 'Adds custom classes to the root element for additional styling.'
  },
  {
    name: 'colors',
    type: 'string[]',
    default: '["#ffaa40", "#9c40ff", "#ffaa40"]',
    description: 'Defines the gradient colors for the text or border.'
  },
  {
    name: 'animationSpeed',
    type: 'number',
    default: '8',
    description: 'The duration of the gradient animation in seconds.'
  },
  {
    name: 'showBorder',
    type: 'boolean',
    default: 'false',
    description: 'Determines whether a border with the gradient effect is displayed.'
  }
];
</script>
