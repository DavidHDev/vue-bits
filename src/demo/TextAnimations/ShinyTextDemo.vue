<template>
  <TabbedLayout>
    <template #preview>
      <div class="h-[400px] text-3xl demo-container">
        <ShinyText
          text="✨ Shiny Text Effect"
          :delay="delay"
          :speed="speed"
          :color="color"
          :shine-color="shineColor"
          :spread="spread"
          :direction="direction"
          :yoyo="yoyo"
          :pause-on-hover="pauseOnHover"
          :disabled="disabled"
        />
      </div>

      <Customize>
        <PreviewSlider title="Speed" v-model="speed" :min="0.5" :max="5" :step="0.1" value-unit="s" />
        <PreviewSlider title="Delay" v-model="delay" :min="0" :max="3" :step="0.1" value-unit="s" />
        <PreviewSlider title="Spread" v-model="spread" :min="0" :max="180" :step="5" value-unit="deg" />
        <PreviewColor title="Color" v-model="color" class="mb-2" />
        <PreviewColor title="Shine Color" v-model="shineColor" class="mb-2" />
        <PreviewSelect title="Direction" v-model="direction" :options="directionOptions" />
        <PreviewSwitch title="Yoyo Mode" v-model="yoyo" />
        <PreviewSwitch title="Pause on Hover" v-model="pauseOnHover" />
        <PreviewSwitch title="Disabled" v-model="disabled" />
      </Customize>

      <PropTable :data="propData" />
    </template>

    <template #code>
      <CodeExample :code-object="shinyText" />
    </template>

    <template #cli>
      <CliInstallation :command="shinyText.cli" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import CliInstallation from '@/components/code/CliInstallation.vue';
import CodeExample from '@/components/code/CodeExample.vue';
import Customize from '@/components/common/Customize.vue';
import PreviewColor from '@/components/common/PreviewColor.vue';
import PreviewSelect from '@/components/common/PreviewSelect.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable from '@/components/common/PropTable.vue';
import TabbedLayout from '@/components/common/TabbedLayout.vue';
import { shinyText } from '@/constants/code/TextAnimations/shinyTextCode';
import ShinyText from '@/content/TextAnimations/ShinyText/ShinyText.vue';
import { ref } from 'vue';

const speed = ref(2);
const delay = ref(0);
const color = ref('#b5b5b5');
const shineColor = ref('#ffffff');
const spread = ref(120);
const direction = ref<'left' | 'right'>('left');
const yoyo = ref(false);
const pauseOnHover = ref(false);
const disabled = ref(false);

const directionOptions = [
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' }
];

const propData = [
  {
    name: 'text',
    type: 'string',
    default: '-',
    description: 'The text to be displayed with the shiny effect.'
  },
  {
    name: 'color',
    type: 'string',
    default: '"#b5b5b5"',
    description: 'The base color of the text.'
  },
  {
    name: 'shineColor',
    type: 'string',
    default: '"#ffffff"',
    description: 'The color of the shine/highlight effect.'
  },
  {
    name: 'speed',
    type: 'number',
    default: '2',
    description: 'Duration of one animation cycle in seconds.'
  },
  {
    name: 'delay',
    type: 'number',
    default: '0',
    description: 'Pause duration (in seconds) between animation cycles.'
  },
  {
    name: 'spread',
    type: 'number',
    default: '120',
    description: 'The angle (in degrees) of the gradient spread.'
  },
  {
    name: 'yoyo',
    type: 'boolean',
    default: 'false',
    description: 'If true, the animation reverses direction instead of looping.'
  },
  {
    name: 'pauseOnHover',
    type: 'boolean',
    default: 'false',
    description: 'Pauses the animation when the user hovers over the text.'
  },
  {
    name: 'direction',
    type: "'left' | 'right'",
    default: '"left"',
    description: 'The direction the shine moves across the text.'
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Disables the shiny effect when set to true.'
  },
  {
    name: 'className',
    type: 'string',
    default: "''",
    description: 'Adds custom classes to the root element.'
  }
];
</script>

<style scoped>
.shiny-button {
  padding: 12px 24px;
  border-radius: 50px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.shiny-button:hover {
  transform: translateY(-2px);
}

.shiny-text-demo {
  font-weight: 600;
}
</style>
