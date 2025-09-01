<template>
  <TabbedLayout>
    <template #preview>
      <div class="demo-container py-[64px] h-[350px]">
        <TextType
          :key="key"
          :text="texts"
          :typingSpeed="typingSpeed"
          :pauseDuration="pauseDuration"
          :deletingSpeed="deletingSpeed"
          :showCursor="showCursor"
          :cursorCharacter="cursorCharacter"
          :cursorBlinkDuration="cursorBlinkDuration"
          :variableSpeed="variableSpeedEnabled ? { min: variableSpeedMin, max: variableSpeedMax } : undefined"
          className="custom-text-type"
        />
      </div>

      <Customize>
        <PreviewSelect v-model="cursorCharacter" :options="['|', '_', '█', '▌', '▐']" title="Cursor Character" />
        <PreviewSlider v-model="typingSpeed" title="Typing Speed" :min="10" :max="200" :step="5" value-unit="ms" />
        <PreviewSlider
          v-model="pauseDuration"
          title="Pause Duration"
          :min="500"
          :max="5000"
          :step="100"
          value-unit="ms"
        />
        <PreviewSlider v-model="deletingSpeed" title="Deleting Speed" :min="10" :max="100" :step="5" value-unit="ms" />
        <PreviewSlider
          v-model="cursorBlinkDuration"
          title="Cursor Blink Duration"
          :min="0.1"
          :max="2"
          :step="0.1"
          value-unit="s"
        />
        <PreviewSwitch v-model="showCursor" title="Show Cursor" />
        <PreviewSwitch v-model="variableSpeedEnabled" title="Variable Speed" />
        <PreviewSlider
          v-model="variableSpeedMin"
          title="Variable Speed Min"
          :min="10"
          :max="150"
          :step="5"
          value-unit="ms"
        />
        <PreviewSlider
          v-model="variableSpeedMax"
          title="Variable Speed Max"
          :min="50"
          :max="300"
          :step="5"
          value-unit="ms"
        />
      </Customize>

      <PropTable :data="propData" />

      <Dependencies :dependency-list="['gsap']" />
    </template>

    <template #code>
      <CodeExample :code-object="textType" />
    </template>

    <template #cli>
      <CliInstallation :command="textType.cli" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import PreviewSelect from '@/components/common/PreviewSelect.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { ref } from 'vue';
import CliInstallation from '../../components/code/CliInstallation.vue';
import CodeExample from '../../components/code/CodeExample.vue';
import Dependencies from '../../components/code/Dependencies.vue';
import Customize from '../../components/common/Customize.vue';
import PreviewSlider from '../../components/common/PreviewSlider.vue';
import PreviewSwitch from '../../components/common/PreviewSwitch.vue';
import PropTable from '../../components/common/PropTable.vue';
import TabbedLayout from '../../components/common/TabbedLayout.vue';
import { textType } from '../../constants/code/TextAnimations/textTypeCode';
import TextType from '../../content/TextAnimations/TextType/TextType.vue';

const texts = ref(["Welcome to Vue Bits! It's great to have you here!", 'Build some amazing experiences!']);
const typingSpeed = ref(75);
const pauseDuration = ref(1500);
const deletingSpeed = ref(50);
const showCursor = ref(true);
const cursorCharacter = ref('_');
const variableSpeedEnabled = ref(false);
const variableSpeedMin = ref(60);
const variableSpeedMax = ref(120);
const cursorBlinkDuration = ref(0.5);

const { rerenderKey: key } = useForceRerender();

const propData = [
  {
    name: 'text',
    type: 'string | string[]',
    default: '-',
    description: 'Text or array of texts to type out'
  },
  {
    name: 'as',
    type: 'string',
    default: 'div',
    description: 'HTML tag to render the component as'
  },
  {
    name: 'typingSpeed',
    type: 'number',
    default: '50',
    description: 'Speed of typing in milliseconds'
  },
  {
    name: 'initialDelay',
    type: 'number',
    default: '0',
    description: 'Initial delay before typing starts'
  },
  {
    name: 'pauseDuration',
    type: 'number',
    default: '2000',
    description: 'Time to wait between typing and deleting'
  },
  {
    name: 'deletingSpeed',
    type: 'number',
    default: '30',
    description: 'Speed of deleting characters'
  },
  {
    name: 'loop',
    type: 'boolean',
    default: 'true',
    description: 'Whether to loop through texts array'
  },
  {
    name: 'className',
    type: 'string',
    default: "''",
    description: 'Optional class name for styling'
  },
  {
    name: 'showCursor',
    type: 'boolean',
    default: 'true',
    description: 'Whether to show the cursor'
  },
  {
    name: 'hideCursorWhileTyping',
    type: 'boolean',
    default: 'false',
    description: 'Hide cursor while typing'
  },
  {
    name: 'cursorCharacter',
    type: 'string',
    default: '|',
    description: 'Character to use as cursor'
  },
  {
    name: 'cursorBlinkDuration',
    type: 'number',
    default: '0.5',
    description: 'Animation duration for cursor blinking'
  },
  {
    name: 'cursorClassName',
    type: 'string',
    default: "''",
    description: 'Optional class name for cursor styling'
  },
  {
    name: 'textColors',
    type: 'string[]',
    default: '[]',
    description: 'Array of colors for each sentence'
  },
  {
    name: 'variableSpeed',
    type: '{min: number, max: number}',
    default: 'undefined',
    description: 'Random typing speed within range for human-like feel'
  },
  {
    name: 'onSentenceComplete',
    type: '(sentence: string, index: number) => void',
    default: 'undefined',
    description: 'Callback fired after each sentence is finished'
  },
  {
    name: 'startOnVisible',
    type: 'boolean',
    default: 'false',
    description: 'Start typing when component is visible in viewport'
  },
  {
    name: 'reverseMode',
    type: 'boolean',
    default: 'false',
    description: 'Type backwards (right to left)'
  }
];
</script>

<style scoped>
.custom-text-type {
  font-size: clamp(1.5rem, 4vw, 4rem);
  font-weight: 700;
}
</style>
