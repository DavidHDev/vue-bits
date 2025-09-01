<template>
  <TabbedLayout>
    <template #preview>
      <div class="demo-container h-[500px] overflow-hidden">
        <GlitchText
          :children="text"
          :speed="speed"
          :enable-shadows="enableShadows"
          :enable-on-hover="enableOnHover"
          class-name="demo-glitch-text"
        />
      </div>

      <Customize>
        <div class="mb-4">
          <PreviewText title="Text" v-model="text" />

          <PreviewSlider title="Refresh Delay" v-model="speed" :min="0.1" :max="5" :step="0.1" />

          <PreviewSwitch title="Glitch Colors" v-model="enableShadows" />

          <PreviewSwitch title="Glitch On Hover" v-model="enableOnHover" />
        </div>
      </Customize>

      <PropTable :data="propData" />
    </template>

    <template #code>
      <CodeExample :code-object="glitchText" />
    </template>

    <template #cli>
      <CliInstallation :command="glitchText.cli" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import TabbedLayout from '../../components/common/TabbedLayout.vue';
import CodeExample from '../../components/code/CodeExample.vue';
import CliInstallation from '../../components/code/CliInstallation.vue';
import GlitchText from '../../content/TextAnimations/GlitchText/GlitchText.vue';
import PropTable from '../../components/common/PropTable.vue';
import PreviewText from '../../components/common/PreviewText.vue';
import PreviewSlider from '../../components/common/PreviewSlider.vue';
import PreviewSwitch from '../../components/common/PreviewSwitch.vue';
import Customize from '@/components/common/Customize.vue';
import { glitchText } from '@/constants/code/TextAnimations/glitchTextCode';

const text = ref('Vue Bits');
const speed = ref(0.5);
const enableShadows = ref(true);
const enableOnHover = ref(false);

watch(enableOnHover, newValue => {
  text.value = newValue ? 'Hover Me' : 'Vue Bits';
});

const propData = [
  {
    name: 'children',
    type: 'string',
    default: '',
    description: 'The text content that will display the glitch effect.'
  },
  {
    name: 'speed',
    type: 'number',
    default: '0.5',
    description: 'Multiplier for the animation speed. Higher values slow down the glitch effect.'
  },
  {
    name: 'enableShadows',
    type: 'boolean',
    default: 'true',
    description: 'Toggle the colored text shadows on the glitch pseudo-elements.'
  },
  {
    name: 'enableOnHover',
    type: 'boolean',
    default: 'false',
    description: 'If true, the glitch animation is only activated on hover.'
  },
  {
    name: 'className',
    type: 'string',
    default: '',
    description: 'Additional custom classes to apply to the component.'
  }
];
</script>
