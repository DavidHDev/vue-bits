<template>
  <h1 class="sub-category">Falling Text</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="fallingText.usage"
    :source="fallingTextSource"
    component-name="FallingText"
    :props-table="props"
  >
    <template #preview>
      <div class="h-[400px] overflow-hidden demo-container">
        <FallingText
          :key="key"
          text="Vue Bits is a library of animated and interactive Vue components designed to streamline UI development and simplify your workflow."
          :highlight-words="['Vue', 'Bits', 'animated', 'components', 'simplify']"
          :trigger="trigger"
          :gravity="gravity"
          font-size="2rem"
          :mouse-constraint-stiffness="mouseConstraintStiffness"
        />

        <div class="z-0 absolute font-[900] text-[#222] text-[4rem] select-none">
          {{ trigger === 'hover' ? 'Hover Me' : trigger === 'click' ? 'Click Me' : 'Auto Start' }}
        </div>
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSelect title="Trigger" v-model="trigger" :options="['hover', 'click', 'auto', 'scroll']" />
        <PreviewSlider title="Gravity" v-model="gravity" :min="0.1" :max="2" :step="0.01" />
        <PreviewSlider
          title="Mouse Constraint Stiffness"
          v-model="mouseConstraintStiffness"
          :min="0.1"
          :max="2"
          :step="0.1"
        />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="falling-text" :usage="fallingText.usage!" :source="fallingTextSource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewSelect from '@/components/common/PreviewSelect.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { fallingText } from '@/constants/code/TextAnimations/fallingTextCode';
import FallingText from '@/content/TextAnimations/FallingText/FallingText.vue';
import fallingTextSource from '@/content/TextAnimations/FallingText/FallingText.vue?raw';
import { computed, ref } from 'vue';

const { rerenderKey: key, forceRerender } = useForceRerender();

const DEFAULTS = {
  gravity: 0.56,
  mouseConstraintStiffness: 0.9,
  trigger: 'hover' as 'hover' | 'click' | 'auto' | 'scroll'
};

const gravity = ref(DEFAULTS.gravity);
const mouseConstraintStiffness = ref(DEFAULTS.mouseConstraintStiffness);
const trigger = ref<'hover' | 'click' | 'auto' | 'scroll'>(DEFAULTS.trigger);

// const effectStarted = computed(() => trigger.value === 'auto');

const hasChanges = computed(
  () =>
    gravity.value !== DEFAULTS.gravity ||
    mouseConstraintStiffness.value !== DEFAULTS.mouseConstraintStiffness ||
    trigger.value !== DEFAULTS.trigger
);

function reset() {
  gravity.value = DEFAULTS.gravity;
  mouseConstraintStiffness.value = DEFAULTS.mouseConstraintStiffness;
  trigger.value = DEFAULTS.trigger;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'text',
    type: 'string',
    default: '',
    description: 'The text content to display and eventually animate.'
  },
  {
    name: 'highlightWords',
    type: 'string[]',
    default: '[]',
    description: 'List of words or substrings to apply a highlight style.'
  },
  {
    name: 'highlightClass',
    type: 'string',
    default: `"highlighted"`,
    description: 'CSS class name for highlighted words.'
  },
  {
    name: 'trigger',
    type: "'click' | 'hover' | 'auto' | 'scroll'",
    default: `"click"`,
    description: 'Defines how the falling effect is activated.'
  },
  {
    name: 'backgroundColor',
    type: 'string',
    default: `"transparent"`,
    description: 'Canvas background color for the physics world.'
  },
  {
    name: 'wireframes',
    type: 'boolean',
    default: 'false',
    description: 'Whether to render the physics bodies in wireframe mode.'
  },
  {
    name: 'gravity',
    type: 'number',
    default: '1',
    description: 'Vertical gravity factor for the physics engine.'
  },
  {
    name: 'mouseConstraintStiffness',
    type: 'number',
    default: '0.2',
    description: 'Stiffness for the mouse drag constraint.'
  },
  {
    name: 'fontSize',
    type: 'string',
    default: `"1rem"`,
    description: 'Font size applied to the text before it falls.'
  },
  {
    name: 'wordSpacing',
    type: 'string',
    default: `"2px"`,
    description: 'Horizontal spacing between each word.'
  }
];
</script>
