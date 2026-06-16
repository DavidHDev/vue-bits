<template>
  <h1 class="sub-category">Text Type</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="textType.usage"
    :source="textTypeSource"
    component-name="TextType"
    :props-table="props"
  >
    <template #preview>
      <div class="relative flex justify-start items-start py-[64px] h-[350px] demo-container">
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
    </template>

    <template #customize>
      <Customize>
        <PreviewSelect v-model="cursorCharacter" :options="cursorOptions" title="Cursor Character" />
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
          :disabled="!variableSpeedEnabled"
        />
        <PreviewSlider
          v-model="variableSpeedMax"
          title="Variable Speed Max"
          :min="50"
          :max="300"
          :step="5"
          value-unit="ms"
          :disabled="!variableSpeedEnabled"
        />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="text-type" :usage="textType.usage!" :source="textTypeSource" />
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
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { textType } from '@/constants/code/TextAnimations/textTypeCode';
import TextType from '@/content/TextAnimations/TextType/TextType.vue';
import textTypeSource from '@/content/TextAnimations/TextType/TextType.vue?raw';
import { computed, ref } from 'vue';

const { rerenderKey: key, forceRerender } = useForceRerender();

const DEFAULTS = {
  texts: ['Welcome to Vue Bits! Good to see you!', 'Build some amazing experiences!'],
  typingSpeed: 75,
  pauseDuration: 1500,
  deletingSpeed: 50,
  showCursor: true,
  cursorCharacter: '_',
  variableSpeedEnabled: false,
  variableSpeedMin: 60,
  variableSpeedMax: 120,
  cursorBlinkDuration: 0.5
};

const texts = ref([...DEFAULTS.texts]);
const typingSpeed = ref(DEFAULTS.typingSpeed);
const pauseDuration = ref(DEFAULTS.pauseDuration);
const deletingSpeed = ref(DEFAULTS.deletingSpeed);
const showCursor = ref(DEFAULTS.showCursor);
const cursorCharacter = ref(DEFAULTS.cursorCharacter);
const variableSpeedEnabled = ref(DEFAULTS.variableSpeedEnabled);
const variableSpeedMin = ref(DEFAULTS.variableSpeedMin);
const variableSpeedMax = ref(DEFAULTS.variableSpeedMax);
const cursorBlinkDuration = ref(DEFAULTS.cursorBlinkDuration);

const cursorOptions = [
  { value: '_', label: 'Underscore (_)' },
  { value: '|', label: 'Pipe (|)' },
  { value: '▎', label: 'Block (▎)' },
  { value: '●', label: 'Dot (●)' },
  { value: '█', label: 'Full Block (█)' }
];

const hasChanges = computed(
  () =>
    JSON.stringify(texts.value) !== JSON.stringify(DEFAULTS.texts) ||
    typingSpeed.value !== DEFAULTS.typingSpeed ||
    pauseDuration.value !== DEFAULTS.pauseDuration ||
    deletingSpeed.value !== DEFAULTS.deletingSpeed ||
    showCursor.value !== DEFAULTS.showCursor ||
    cursorCharacter.value !== DEFAULTS.cursorCharacter ||
    variableSpeedEnabled.value !== DEFAULTS.variableSpeedEnabled ||
    variableSpeedMin.value !== DEFAULTS.variableSpeedMin ||
    variableSpeedMax.value !== DEFAULTS.variableSpeedMax ||
    cursorBlinkDuration.value !== DEFAULTS.cursorBlinkDuration
);

function reset() {
  texts.value = [...DEFAULTS.texts];
  typingSpeed.value = DEFAULTS.typingSpeed;
  pauseDuration.value = DEFAULTS.pauseDuration;
  deletingSpeed.value = DEFAULTS.deletingSpeed;
  showCursor.value = DEFAULTS.showCursor;
  cursorCharacter.value = DEFAULTS.cursorCharacter;
  variableSpeedEnabled.value = DEFAULTS.variableSpeedEnabled;
  variableSpeedMin.value = DEFAULTS.variableSpeedMin;
  variableSpeedMax.value = DEFAULTS.variableSpeedMax;
  cursorBlinkDuration.value = DEFAULTS.cursorBlinkDuration;
  forceRerender();
}

const props: PropRow[] = [
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
