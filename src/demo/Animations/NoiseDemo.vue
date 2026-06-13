<template>
  <h1 class="sub-category">Noise</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="noise.usage"
    :source="noiseSource"
    component-name="Noise"
    :props-table="props"
  >
    <template #preview>
      <div class="relative h-[400px] overflow-hidden demo-container">
        <div class="opacity-50 font-extrabold text-[#27FF64] text-[6rem] text-center">Ooh, edgy!</div>
        <Noise
          :key="key"
          :pattern-size="patternSize"
          :pattern-scale-x="patternScaleX"
          :pattern-scale-y="patternScaleY"
          :pattern-alpha="patternAlpha"
        />
        <RefreshButton @click="forceRerender" />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSlider title="Pattern Size" :min="50" :max="500" :step="10" v-model="patternSize" valueUnit="px" />
        <PreviewSlider title="Scale X" :min="0.1" :max="5" :step="0.1" v-model="patternScaleX" />
        <PreviewSlider title="Scale Y" :min="0.1" :max="5" :step="0.1" v-model="patternScaleY" />
        <PreviewSlider title="Pattern Alpha" :min="0" :max="25" :step="5" v-model="patternAlpha" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="noise" :usage="noise.usage!" :source="noiseSource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import RefreshButton from '@/components/common/RefreshButton.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { noise } from '@/constants/code/Animations/noiseCode';
import Noise from '@/content/Animations/Noise/Noise.vue';
import noiseSource from '@/content/Animations/Noise/Noise.vue?raw';
import { computed, ref } from 'vue';

const { rerenderKey: key, forceRerender } = useForceRerender();

const DEFAULTS = {
  patternSize: 250,
  patternScaleX: 2,
  patternScaleY: 2,
  patternAlpha: 15
};

const patternSize = ref(DEFAULTS.patternSize);
const patternScaleX = ref(DEFAULTS.patternScaleX);
const patternScaleY = ref(DEFAULTS.patternScaleY);
const patternAlpha = ref(DEFAULTS.patternAlpha);

const hasChanges = computed(() => {
  return (
    patternSize.value !== DEFAULTS.patternSize ||
    patternScaleX.value !== DEFAULTS.patternScaleX ||
    patternScaleY.value !== DEFAULTS.patternScaleY ||
    patternAlpha.value !== DEFAULTS.patternAlpha
  );
});

function reset() {
  patternSize.value = DEFAULTS.patternSize;
  patternScaleX.value = DEFAULTS.patternScaleX;
  patternScaleY.value = DEFAULTS.patternScaleY;
  patternAlpha.value = DEFAULTS.patternAlpha;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'patternSize',
    type: 'number',
    default: '250',
    description: 'Defines the size of the grain pattern.'
  },
  {
    name: 'patternScaleX',
    type: 'number',
    default: '1',
    description: 'Scaling factor for the X-axis of the grain pattern.'
  },
  {
    name: 'patternScaleY',
    type: 'number',
    default: '1',
    description: 'Scaling factor for the Y-axis of the grain pattern.'
  },
  {
    name: 'patternRefreshInterval',
    type: 'number',
    default: '2',
    description: 'Number of frames before the grain pattern refreshes.'
  },
  {
    name: 'patternAlpha',
    type: 'number',
    default: '15',
    description: 'Opacity of the grain pattern (0-255).'
  }
];
</script>
