<template>
  <TabbedLayout>
    <template #preview>
      <div class="demo-container h-[500px] overflow-hidden">
        <div class="flex flex-col items-center justify-center h-full">
          <FuzzyText
            :key="`main-${rerenderKey}`"
            text="404"
            :base-intensity="baseIntensity"
            :hover-intensity="hoverIntensity"
            :enable-hover="enableHover"
            :font-size="140"
          />

          <div class="my-1" />

          <FuzzyText
            :key="`sub-${rerenderKey}`"
            text="not found"
            :base-intensity="baseIntensity"
            :hover-intensity="hoverIntensity"
            :enable-hover="enableHover"
            :font-size="70"
            font-family="Gochi Hand"
          />
        </div>
      </div>

      <Customize>
        <PreviewSlider title="Base Intensity" v-model="baseIntensity" :min="0" :max="1" :step="0.01" />

        <PreviewSlider title="Hover Intensity" v-model="hoverIntensity" :min="0" :max="2" :step="0.01" />

        <PreviewSwitch title="Enable Hover" v-model="enableHover" />
      </Customize>

      <PropTable :data="propData" />
    </template>

    <template #code>
      <CodeExample :code-object="fuzzyText" />
    </template>

    <template #cli>
      <CliInstallation :command="fuzzyText.cli" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TabbedLayout from '../../components/common/TabbedLayout.vue';
import PropTable from '../../components/common/PropTable.vue';
import CliInstallation from '../../components/code/CliInstallation.vue';
import CodeExample from '../../components/code/CodeExample.vue';
import Customize from '../../components/common/Customize.vue';
import PreviewSlider from '../../components/common/PreviewSlider.vue';
import PreviewSwitch from '../../components/common/PreviewSwitch.vue';
import FuzzyText from '../../content/TextAnimations/FuzzyText/FuzzyText.vue';
import { fuzzyText } from '@/constants/code/TextAnimations/fuzzyTextCode';
import { useForceRerender } from '@/composables/useForceRerender';

const baseIntensity = ref(0.2);
const hoverIntensity = ref(0.5);
const enableHover = ref(true);

const { rerenderKey } = useForceRerender();

const propData = [
  {
    name: 'text',
    type: 'string',
    default: '""',
    description: 'The text content to display inside the fuzzy text component.'
  },
  {
    name: 'fontSize',
    type: 'number | string',
    default: '"clamp(2rem, 8vw, 8rem)"',
    description:
      'Specifies the font size of the text. Accepts any valid CSS font-size value or a number (interpreted as pixels).'
  },
  {
    name: 'fontWeight',
    type: 'string | number',
    default: '900',
    description: 'Specifies the font weight of the text.'
  },
  {
    name: 'fontFamily',
    type: 'string',
    default: '"inherit"',
    description: 'Specifies the font family of the text. "inherit" uses the computed style from the parent.'
  },
  {
    name: 'color',
    type: 'string',
    default: '#fff',
    description: 'Specifies the text color.'
  },
  {
    name: 'enableHover',
    type: 'boolean',
    default: 'true',
    description: 'Enables the hover effect for the fuzzy text.'
  },
  {
    name: 'baseIntensity',
    type: 'number',
    default: '0.18',
    description: 'The fuzz intensity when the text is not hovered.'
  },
  {
    name: 'hoverIntensity',
    type: 'number',
    default: '0.5',
    description: 'The fuzz intensity when the text is hovered.'
  }
];
</script>
