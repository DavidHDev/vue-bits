<template>
  <TabbedLayout>
    <template #preview>
      <div class="demo-container h-[400px] overflow-hidden">
        <FallingText
          :key="key"
          text="Vue Bits is a library of animated and interactive Vue components designed to streamline UI development and simplify your workflow."
          :highlight-words="['Vue', 'Bits', 'animated', 'components', 'simplify']"
          :trigger="trigger"
          :gravity="gravity"
          font-size="2rem"
          :mouse-constraint-stiffness="mouseConstraintStiffness"
        />

        <div class="absolute z-0 text-[4rem] font-[900] text-[#222] select-none" v-if="!effectStarted">
          {{ trigger === 'hover' ? 'Hover Me' : trigger === 'click' ? 'Click Me' : 'Auto Start' }}
        </div>
      </div>

      <Customize>
        <PreviewSelect title="Animation Trigger" v-model="trigger" :options="triggerOptions" />

        <PreviewSlider title="Gravity" v-model="gravity" :min="0.1" :max="2" :step="0.01" />

        <PreviewSlider
          title="Mouse Constraint Stiffness"
          v-model="mouseConstraintStiffness"
          :min="0.1"
          :max="2"
          :step="0.1"
        />
      </Customize>

      <PropTable :data="propData" />

      <Dependencies :dependency-list="['matter-js']" />
    </template>

    <template #code>
      <CodeExample :code-object="fallingText" />
    </template>

    <template #cli>
      <CliInstallation :command="fallingText.cli" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import TabbedLayout from '../../components/common/TabbedLayout.vue';
import PropTable from '../../components/common/PropTable.vue';
import Dependencies from '../../components/code/Dependencies.vue';
import CliInstallation from '../../components/code/CliInstallation.vue';
import CodeExample from '../../components/code/CodeExample.vue';
import Customize from '../../components/common/Customize.vue';
import PreviewSlider from '../../components/common/PreviewSlider.vue';
import PreviewSelect from '../../components/common/PreviewSelect.vue';
import FallingText from '../../content/TextAnimations/FallingText/FallingText.vue';
import { fallingText } from '@/constants/code/TextAnimations/fallingTextCode';
import { useForceRerender } from '@/composables/useForceRerender';

const { rerenderKey: key } = useForceRerender();

const gravity = ref(0.56);
const mouseConstraintStiffness = ref(0.9);
const trigger = ref<'hover' | 'click' | 'auto' | 'scroll'>('hover');

const effectStarted = computed(() => trigger.value === 'auto');

const triggerOptions = [
  { value: 'hover', label: 'Hover' },
  { value: 'click', label: 'Click' },
  { value: 'auto', label: 'Auto' },
  { value: 'scroll', label: 'Scroll' }
];

const propData = [
  {
    name: 'text',
    type: 'string',
    default: '""',
    description: 'The text content to display and eventually animate.'
  },
  {
    name: 'highlightWords',
    type: 'string[]',
    default: '[]',
    description: 'List of words or substrings to apply a highlight style.'
  },
  {
    name: 'trigger',
    type: "'click' | 'hover' | 'auto' | 'scroll'",
    default: '"auto"',
    description: 'Defines how the falling effect is activated.'
  },
  {
    name: 'backgroundColor',
    type: 'string',
    default: '"transparent"',
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
    default: '"1rem"',
    description: 'Font size applied to the text before it falls.'
  }
];
</script>
