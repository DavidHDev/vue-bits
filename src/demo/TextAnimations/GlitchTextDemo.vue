<template>
  <h1 class="sub-category">Glitch Text</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="glitchText.usage"
    :source="glitchTextSource"
    component-name="GlitchText"
    :props-table="props"
  >
    <template #preview>
      <div class="h-[400px] overflow-hidden demo-container">
        <GlitchText :children="text" :speed="speed" :enable-shadows="enableShadows" :enable-on-hover="enableOnHover" />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSlider title="Refresh Delay" v-model="speed" :min="0.1" :max="5" :step="0.1" />
        <PreviewSwitch title="Glitch Colors" v-model="enableShadows" />
        <PreviewSwitch title="Glitch On Hover" v-model="enableOnHover" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="glitch-text" :usage="glitchText.usage!" :source="glitchTextSource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { glitchText } from '@/constants/code/TextAnimations/glitchTextCode';
import GlitchText from '@/content/TextAnimations/GlitchText/GlitchText.vue';
import glitchTextSource from '@/content/TextAnimations/GlitchText/GlitchText.vue?raw';
import { computed, ref, watch } from 'vue';

const { forceRerender } = useForceRerender();

const DEFAULTS = {
  speed: 1,
  enableShadows: true,
  enableOnHover: false
};

const text = ref('Vue Bits');
const speed = ref(DEFAULTS.speed);
const enableShadows = ref(DEFAULTS.enableShadows);
const enableOnHover = ref(DEFAULTS.enableOnHover);

const hasChanges = computed(
  () =>
    speed.value !== DEFAULTS.speed ||
    enableShadows.value !== DEFAULTS.enableShadows ||
    enableOnHover.value !== DEFAULTS.enableOnHover
);

function reset() {
  speed.value = DEFAULTS.speed;
  enableShadows.value = DEFAULTS.enableShadows;
  enableOnHover.value = DEFAULTS.enableOnHover;
  forceRerender();
}

watch(enableOnHover, newValue => {
  text.value = newValue ? 'Hover Me' : 'Vue Bits';
});

const props: PropRow[] = [
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
