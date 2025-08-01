<template>
  <TabbedLayout>
    <template #preview>
      <div
        ref="containerRef"
        class="demo-container relative min-h-[400px] overflow-hidden p-4 font-['Roboto_Flex',sans-serif]"
      >
        <VariableProximity
          label="Hover me! And then star Vue Bits on GitHub, or else..."
          class-name="variable-proximity-demo"
          from-font-variation-settings="'wght' 400, 'opsz' 9"
          to-font-variation-settings="'wght' 1000, 'opsz' 40"
          :container-ref="containerRef"
          :radius="radius"
          :falloff="falloff"
        />
      </div>

      <Customize>
        <PreviewSlider title="Radius" v-model="radius" :min="50" :max="300" :step="10" />

        <div class="flex gap-2 flex-wrap">
          <button
            v-for="type in falloffTypes"
            :key="type"
            class="text-xs cursor-pointer bg-[#0b0b0b] rounded-[10px] border border-[#333] hover:bg-[#222] text-white h-8 px-3 transition-colors"
            :class="{ 'bg-[#333]': falloff === type }"
            @click="falloff = type"
          >
            {{ type }}
          </button>
        </div>
      </Customize>

      <PropTable :data="propData" />
      <Dependencies :dependency-list="['motion-v']" />
    </template>

    <template #code>
      <CodeExample :code-object="variableProximity" />
    </template>

    <template #cli>
      <CliInstallation :command="variableProximity.cli" />
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
import VariableProximity, { type FalloffType } from '@/content/TextAnimations/VariableProximity/VariableProximity.vue';
import { variableProximity } from '@/constants/code/TextAnimations/variableProximityCode';

const containerRef = ref<HTMLElement | null>(null);
const radius = ref(100);
const falloff = ref<FalloffType>('linear');

const falloffTypes: FalloffType[] = ['linear', 'exponential', 'gaussian'];

const propData = [
  {
    name: 'label',
    type: 'string',
    default: '""',
    description: 'The text content to display.'
  },
  {
    name: 'fromFontVariationSettings',
    type: 'string',
    default: "\"'wght' 400, 'opsz' 9\"",
    description: 'The starting variation settings.'
  },
  {
    name: 'toFontVariationSettings',
    type: 'string',
    default: "\"'wght' 800, 'opsz' 40\"",
    description: 'The variation settings to reach at cursor proximity.'
  },
  {
    name: 'containerRef',
    type: 'HTMLElement',
    default: 'undefined',
    description: 'Reference to container for relative calculations.'
  },
  {
    name: 'radius',
    type: 'number',
    default: '50',
    description: 'Proximity radius to influence the effect.'
  },
  {
    name: 'falloff',
    type: '"linear" | "exponential" | "gaussian"',
    default: '"linear"',
    description: 'Type of falloff for the effect.'
  },
  {
    name: 'className',
    type: 'string',
    default: '""',
    description: 'Additional CSS classes to apply.'
  },
  {
    name: 'style',
    type: 'CSSProperties',
    default: '{}',
    description: 'Inline styles to apply.'
  },
  {
    name: 'onClick',
    type: '() => void',
    default: 'undefined',
    description: 'Click event handler.'
  }
];
</script>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wght@8..144,100..1000&display=swap');
</style>
