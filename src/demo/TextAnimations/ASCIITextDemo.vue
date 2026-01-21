<template>
  <TabbedLayout>
    <template #preview>
      <div class="demo-container h-[400px] overflow-hidden">
        <ASCIIText
          :key="rerenderKey"
          :text="text"
          :ascii-font-size="asciiFontSize"
          :text-font-size="textFontSize"
          :text-color="textColor"
          :plane-base-height="planeBaseHeight"
          :enable-waves="enableWaves"
        />
      </div>

      <Customize>
        <PreviewText title="Text" v-model="text" />

        <PreviewSlider title="ASCII Font Size" v-model="asciiFontSize" :min="2" :max="20" :step="1" />

        <PreviewSlider title="Text Font Size" v-model="textFontSize" :min="100" :max="400" :step="25" />

        <PreviewSlider title="Base Height" v-model="planeBaseHeight" :min="4" :max="16" :step="1" />

        <PreviewSwitch title="Enable Waves" v-model="enableWaves" />

        <div class="flex gap-2 flex-wrap">
          <button
            v-for="color in colorOptions"
            :key="color.name"
            class="text-xs cursor-pointer bg-[#0b0b0b] rounded-[10px] border border-[#333] hover:bg-[#333] text-white h-8 px-3 transition-colors"
            :class="{ 'bg-[#333]': textColor === color.value }"
            @click="changeColor(color.value)"
          >
            {{ color.name }}
          </button>
        </div>
      </Customize>

      <PropTable :data="propData" />
      <Dependencies :dependency-list="['three', '@types/three']" />
    </template>

    <template #code>
      <CodeExample :code-object="asciiText" />
    </template>

    <template #cli>
      <CliInstallation :command="asciiText.cli" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TabbedLayout from '@/components/common/TabbedLayout.vue';
import PropTable from '@/components/common/PropTable.vue';
import Dependencies from '@/components/code/Dependencies.vue';
import CliInstallation from '@/components/code/CliInstallation.vue';
import CodeExample from '@/components/code/CodeExample.vue';
import Customize from '@/components/common/Customize.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PreviewText from '@/components/common/PreviewText.vue';
import ASCIIText from '@/content/TextAnimations/ASCIIText/ASCIIText.vue';
import { asciiText } from '@/constants/code/TextAnimations/asciiTextCode';
import { useForceRerender } from '@/composables/useForceRerender';

const text = ref('Hey!');
const asciiFontSize = ref(8);
const textFontSize = ref(200);
const textColor = ref('#fdf9f3');
const planeBaseHeight = ref(8);
const enableWaves = ref(true);

const { rerenderKey, forceRerender } = useForceRerender();

const colorOptions = [
  { name: 'White', value: '#ffffff' },
  { name: 'Red', value: '#ff6b6b' },
  { name: 'Blue', value: '#4ecdc4' },
  { name: 'Green', value: '#45b7d1' },
  { name: 'Purple', value: '#9b59b6' },
  { name: 'Orange', value: '#f39c12' },
  { name: 'Pink', value: '#e91e63' }
];

const changeColor = (color: string) => {
  textColor.value = color;
  forceRerender();
};

const propData = [
  {
    name: 'text',
    type: 'string',
    default: '"David!"',
    description: 'The text content to display as ASCII art.'
  },
  {
    name: 'asciiFontSize',
    type: 'number',
    default: '8',
    description: 'Font size for the ASCII characters (in pixels).'
  },
  {
    name: 'textFontSize',
    type: 'number',
    default: '200',
    description: 'Font size for the original text before ASCII conversion.'
  },
  {
    name: 'textColor',
    type: 'string',
    default: '"#fdf9f3"',
    description: 'Color of the text used in the ASCII conversion.'
  },
  {
    name: 'planeBaseHeight',
    type: 'number',
    default: '8',
    description: 'Base height of the 3D plane geometry for the text.'
  },
  {
    name: 'enableWaves',
    type: 'boolean',
    default: 'true',
    description: 'Whether to enable wave animation effects on the text.'
  },
  {
    name: 'className',
    type: 'string',
    default: '""',
    description: 'Additional CSS classes to apply to the component.'
  }
];
</script>
