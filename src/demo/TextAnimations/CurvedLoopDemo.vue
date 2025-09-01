<template>
  <TabbedLayout>
    <template #preview>
      <div class="demo-container h-[500px] overflow-hidden">
        <CurvedLoop
          :key="rerenderKey"
          :marquee-text="marqueeText"
          :speed="speed"
          :curve-amount="curveAmount"
          :interactive="interactive"
        />
      </div>

      <Customize>
        <div class="mb-4">
          <label class="block text-sm font-medium mb-2">Marquee Text</label>

          <input
            v-model="marqueeText"
            type="text"
            placeholder="Enter text..."
            class="w-[300px] px-3 py-2 bg-[#0b0b0b] border border-[#333] rounded-md text-white focus:outline-none focus:border-[#666]"
            @input="forceRerender"
          />
        </div>

        <PreviewSlider title="Speed" v-model="speed" :min="0" :max="10" :step="0.1" />

        <PreviewSlider title="Curve Amount" v-model="curveAmount" :min="-400" :max="400" :step="10" value-unit="px" />

        <PreviewSwitch title="Draggable" v-model="interactive" />
      </Customize>

      <PropTable :data="propData" />
    </template>

    <template #code>
      <CodeExample :code-object="curvedLoop" />
    </template>

    <template #cli>
      <CliInstallation :command="curvedLoop.cli" />
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
import CurvedLoop from '../../content/TextAnimations/CurvedLoop/CurvedLoop.vue';
import { curvedLoop } from '@/constants/code/TextAnimations/curvedLoopCode';
import { useForceRerender } from '@/composables/useForceRerender';

const marqueeText = ref('Be ✦ Creative ✦ With ✦ Vue ✦ Bits ✦');
const speed = ref(2);
const curveAmount = ref(400);
const interactive = ref(true);

const { rerenderKey, forceRerender } = useForceRerender();

const propData = [
  {
    name: 'marqueeText',
    type: 'string',
    default: '""',
    description: 'The text to display in the curved marquee'
  },
  {
    name: 'speed',
    type: 'number',
    default: '2',
    description: 'Animation speed of the marquee text'
  },
  {
    name: 'className',
    type: 'string',
    default: 'undefined',
    description: 'CSS class name for styling the text'
  },
  {
    name: 'curveAmount',
    type: 'number',
    default: '400',
    description: 'Amount of curve in the text path'
  },
  {
    name: 'direction',
    type: '"left" | "right"',
    default: '"left"',
    description: 'Initial direction of the marquee animation'
  },
  {
    name: 'interactive',
    type: 'boolean',
    default: 'true',
    description: 'Whether the marquee can be dragged by the user'
  }
];
</script>
