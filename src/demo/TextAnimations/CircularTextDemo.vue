<template>
  <TabbedLayout>
    <template #preview>
      <div class="demo-container h-[400px] overflow-hidden">
        <CircularText
          :key="rerenderKey"
          text="VUE * BITS * IS * AWESOME * "
          :spin-duration="spinDuration"
          :on-hover="onHover"
          class-name="text-blue-500"
        />
      </div>

      <Customize>
        <div class="flex gap-4 flex-wrap">
          <button
            class="text-xs bg-[#0b0b0b] rounded-[10px] border border-[#1e3721] hover:bg-[#1e3721] text-white h-8 px-3 transition-colors"
            @click="toggleOnHover"
          >
            On Hover:
            <span class="text-[#a1a1aa]">&nbsp;{{ onHover }}</span>
          </button>
        </div>

        <PreviewSlider title="Spin Duration (s)" v-model="spinDuration" :min="1" :max="50" :step="1" />
      </Customize>

      <PropTable :data="propData" />

      <Dependencies :dependency-list="['motion-v']" />
    </template>

    <template #code>
      <CodeExample :code-object="circularText" />
    </template>

    <template #cli>
      <CliInstallation :command="circularText.cli" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TabbedLayout from '../../components/common/TabbedLayout.vue';
import PropTable from '../../components/common/PropTable.vue';
import Dependencies from '../../components/code/Dependencies.vue';
import CliInstallation from '../../components/code/CliInstallation.vue';
import CodeExample from '../../components/code/CodeExample.vue';
import Customize from '../../components/common/Customize.vue';
import PreviewSlider from '../../components/common/PreviewSlider.vue';
import CircularText from '../../content/TextAnimations/CircularText/CircularText.vue';
import { circularText } from '@/constants/code/TextAnimations/circularTextCode';
import { useForceRerender } from '@/composables/useForceRerender';

const onHover = ref<'slowDown' | 'speedUp' | 'pause' | 'goBonkers'>('speedUp');
const spinDuration = ref(20);
const { rerenderKey, forceRerender } = useForceRerender();

const hoverOptions: Array<'slowDown' | 'speedUp' | 'pause' | 'goBonkers'> = [
  'slowDown',
  'speedUp',
  'pause',
  'goBonkers'
];

const toggleOnHover = () => {
  const currentIndex = hoverOptions.indexOf(onHover.value);
  const nextIndex = (currentIndex + 1) % hoverOptions.length;
  onHover.value = hoverOptions[nextIndex];
  forceRerender();
};

const propData = [
  { name: 'text', type: 'string', default: '""', description: 'The text content to display in a circular pattern.' },
  { name: 'spinDuration', type: 'number', default: '20', description: 'Duration of one full rotation in seconds.' },
  {
    name: 'onHover',
    type: 'string',
    default: '"speedUp"',
    description: 'Hover behavior: "slowDown", "speedUp", "pause", or "goBonkers".'
  },
  { name: 'className', type: 'string', default: '""', description: 'Additional class names to style the component.' }
];
</script>
