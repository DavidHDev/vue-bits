<template>
  <TabbedLayout>
    <template #preview>
      <div class="h-[400px] overflow-hidden demo-container">
        <CircularText :key="rerenderKey" :text="text" :spin-duration="spinDuration" :on-hover="onHover" />
      </div>

      <Customize>
        <PreviewText title="Text" v-model="text" />
        <PreviewSelect title="On Hover" v-model="onHover" :options="hoverOptions" />
        <PreviewSlider title="Spin Duration (s)" v-model="spinDuration" :min="1" :max="60" :step="1" />
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
import CliInstallation from '@/components/code/CliInstallation.vue';
import CodeExample from '@/components/code/CodeExample.vue';
import Dependencies from '@/components/code/Dependencies.vue';
import Customize from '@/components/common/Customize.vue';
import PreviewSelect from '@/components/common/PreviewSelect.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewText from '@/components/common/PreviewText.vue';
import PropTable from '@/components/common/PropTable.vue';
import TabbedLayout from '@/components/common/TabbedLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { circularText } from '@/constants/code/TextAnimations/circularTextCode';
import CircularText from '@/content/TextAnimations/CircularText/CircularText.vue';
import { ref } from 'vue';

const { rerenderKey } = useForceRerender();

const text = ref('VUE*BITS*COMPONENTS*');
const onHover = ref<'slowDown' | 'speedUp' | 'pause' | 'goBonkers'>('speedUp');
const spinDuration = ref(20);

const hoverOptions = [
  { label: 'Slow Down', value: 'slowDown' },
  { label: 'Speed Up', value: 'speedUp' },
  { label: 'Pause', value: 'pause' },
  { label: 'Go Bonkers', value: 'goBonkers' }
];

const propData = [
  {
    name: 'text',
    type: 'string',
    default: "''",
    description: 'The text to display in a circular layout.'
  },
  {
    name: 'spinDuration',
    type: 'number',
    default: '20',
    description: 'The duration (in seconds) for one full rotation.'
  },
  {
    name: 'onHover',
    type: "'slowDown' | 'speedUp' | 'pause' | 'goBonkers'",
    default: 'undefined',
    description:
      "Specifies the hover behavior variant. Options include 'slowDown', 'speedUp', 'pause', and 'goBonkers'."
  },
  {
    name: 'className',
    type: 'string',
    default: "''",
    description: 'Optional additional CSS classes to apply to the component.'
  }
];
</script>
