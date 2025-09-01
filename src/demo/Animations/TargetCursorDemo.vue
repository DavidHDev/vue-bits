<template>
  <TabbedLayout>
    <template #preview>
      <div class="flex-col h-[500px] overflow-hidden demo-container">
        <p class="mb-6 font-black text-[#aeffc5]/20 text-[clamp(2rem,6vw,3rem)]">Hover Below.</p>

        <div class="gap-4 grid grid-cols-3 mb-2">
          <div>
            <p
              class="px-6 py-2 border border-[#aeffc5] border-dashed rounded-[15px] font-black text-[#aeffc5] text-[2rem] text-center cursor-target"
            >
              THIS
            </p>
          </div>
          <div>
            <p
              class="px-6 py-2 border border-[#aeffc5] border-dashed rounded-[15px] font-black text-[#aeffc5] text-[2rem] text-center cursor-target"
            >
              FEELS
            </p>
          </div>
          <div>
            <p
              class="px-6 py-2 border border-[#aeffc5] border-dashed rounded-[15px] font-black text-[#aeffc5] text-[2rem] text-center cursor-target"
            >
              QUITE
            </p>
          </div>
          <div class="col-span-3">
            <p
              class="px-6 py-2 border border-[#aeffc5] border-dashed rounded-[15px] font-black text-[#aeffc5] text-[2rem] text-center cursor-target"
            >
              SNAPPY!
            </p>
          </div>
        </div>
      </div>

      <Customize>
        <PreviewSlider title="Spin Duration" :min="0.5" :max="5" :step="0.1" value-unit="s" v-model="spinDuration" />

        <PreviewSwitch title="Hide Default Cursor" v-model="hideDefaultCursor" />
      </Customize>

      <PropTable :data="propData" />
      <Dependencies :dependency-list="['gsap']" />
    </template>

    <template #code>
      <CodeExample :code-object="targetCursor" />
    </template>

    <template #cli>
      <CliInstallation :command="targetCursor.cli" />
    </template>
  </TabbedLayout>

  <TargetCursor :spin-duration="spinDuration" :hide-default-cursor="hideDefaultCursor" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import CliInstallation from '../../components/code/CliInstallation.vue';
import CodeExample from '../../components/code/CodeExample.vue';
import Dependencies from '../../components/code/Dependencies.vue';
import Customize from '../../components/common/Customize.vue';
import PreviewSlider from '../../components/common/PreviewSlider.vue';
import PreviewSwitch from '../../components/common/PreviewSwitch.vue';
import PropTable from '../../components/common/PropTable.vue';
import TabbedLayout from '../../components/common/TabbedLayout.vue';
import { targetCursor } from '../../constants/code/Animations/targetCursorCode';
import TargetCursor from '../../content/Animations/TargetCursor/TargetCursor.vue';

const spinDuration = ref(2);
const hideDefaultCursor = ref(true);

const propData = [
  {
    name: 'targetSelector',
    type: 'string',
    default: '".cursor-target"',
    description: 'CSS selector for elements that should trigger the cursor targeting effect'
  },
  {
    name: 'spinDuration',
    type: 'number',
    default: '2',
    description: "Duration in seconds for the cursor's spinning animation when not targeting"
  },
  {
    name: 'hideDefaultCursor',
    type: 'boolean',
    default: 'true',
    description: 'Whether to hide the default browser cursor when the component is active'
  }
];
</script>
