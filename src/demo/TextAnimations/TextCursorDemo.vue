<template>
  <h1 class="sub-category">Text Cursor</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="textCursor.usage"
    :source="textCursorSource"
    component-name="TextCursor"
    :props-table="props"
  >
    <template #preview>
      <div class="relative h-[400px] demo-container">
        <TextCursor
          :key="key"
          :text="text"
          :follow-mouse-direction="followMouseDirection"
          :random-float="randomFloat"
        />
        <div
          class="absolute inset-0 flex justify-center items-center font-[900] text-[#222] text-[4rem] pointer-events-none select-none"
        >
          Hover Around!
        </div>
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewInput title="Text" v-model="text" placeholder="Enter text..." />
        <PreviewSwitch title="Follow Mouse Direction" v-model="followMouseDirection" />
        <PreviewSwitch title="Enable Random Floating" v-model="randomFloat" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="text-cursor" :usage="textCursor.usage!" :source="textCursorSource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewInput from '@/components/common/PreviewInput.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { textCursor } from '@/constants/code/TextAnimations/textCursorCode';
import TextCursor from '@/content/TextAnimations/TextCursor/TextCursor.vue';
import textCursorSource from '@/content/TextAnimations/TextCursor/TextCursor.vue?raw';
import { computed, ref } from 'vue';

const { rerenderKey: key, forceRerender } = useForceRerender();

const DEFAULTS = {
  text: '💚',
  followMouseDirection: true,
  randomFloat: true
};

const text = ref(DEFAULTS.text);
const followMouseDirection = ref(DEFAULTS.followMouseDirection);
const randomFloat = ref(DEFAULTS.randomFloat);

const hasChanges = computed(
  () =>
    text.value !== DEFAULTS.text ||
    followMouseDirection.value !== DEFAULTS.followMouseDirection ||
    randomFloat.value !== DEFAULTS.randomFloat
);

function reset() {
  text.value = DEFAULTS.text;
  followMouseDirection.value = DEFAULTS.followMouseDirection;
  randomFloat.value = DEFAULTS.randomFloat;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'text',
    type: 'string',
    default: '💚',
    description: 'The text string to display as the trail.'
  },
  {
    name: 'spacing',
    type: 'number',
    default: '100',
    description: 'The spacing in pixels between each trail point.'
  },
  {
    name: 'followMouseDirection',
    type: 'boolean',
    default: 'true',
    description: 'If true, each text rotates to follow the mouse direction.'
  },
  {
    name: 'randomFloat',
    type: 'boolean',
    default: 'true',
    description: 'If true, enables random floating offsets in position and rotation for a dynamic effect.'
  },
  {
    name: 'exitDuration',
    type: 'number',
    default: '0.5',
    description: 'The duration in seconds for the exit animation of each trail item.'
  },
  {
    name: 'removalInterval',
    type: 'number',
    default: '30',
    description: 'The interval in milliseconds between removing trail items when the mouse stops moving.'
  },
  {
    name: 'maxPoints',
    type: 'number',
    default: '5',
    description: 'The maximum number of trail points to display.'
  }
];
</script>
