<template>
  <h1 class="sub-category">Hyperspeed</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="hyperspeed.usage"
    :source="hyperspeedSource"
    component-name="Hyperspeed"
    :props-table="props"
  >
    <template #preview>
      <div class="relative h-[500px] overflow-hidden cursor-pointer demo-container">
        <Hyperspeed :effect-options="currentPreset" />
        <BackgroundContent pillText="New Background" headline="Click & hold to see the real magic of hyperspeed!" />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSelect title="Animation Preset" :options="options" v-model="activePreset" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab
        slug="hyperspeed"
        :usage="hyperspeed.usage!"
        :source="hyperspeedSource"
        :utility="hyperspeed.utility"
      />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import BackgroundContent from '@/components/common/BackgroundContent.vue';
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewSelect from '@/components/common/PreviewSelect.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { hyperspeed } from '@/constants/code/Backgrounds/hyperspeedCode';
import Hyperspeed from '@/content/Backgrounds/Hyperspeed/Hyperspeed.vue';
import hyperspeedSource from '@/content/Backgrounds/Hyperspeed/Hyperspeed.vue?raw';
import { hyperspeedPresets } from '@/content/Backgrounds/Hyperspeed/HyperspeedPresets';
import { computed, ref } from 'vue';

const { forceRerender } = useForceRerender();

const DEFAULTS = {
  activePreset: 'one'
};

const activePreset = ref<string>('one');

const currentPreset = computed(() => {
  return hyperspeedPresets[activePreset.value as keyof typeof hyperspeedPresets];
});

const options = [
  { value: 'one', label: 'Cyberpunk' },
  { value: 'two', label: 'Akira' },
  { value: 'three', label: 'Golden' },
  { value: 'four', label: 'Split' },
  { value: 'five', label: 'Highway' },
  { value: 'six', label: 'Deep' }
];

const hasChanges = computed(() => activePreset.value !== DEFAULTS.activePreset);

function reset() {
  activePreset.value = DEFAULTS.activePreset;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'effectOptions',
    type: 'object',
    default: 'See the "code" tab for default values and presets.',
    description:
      'The highly customizable configuration object for the effect, controls things like colors, distortion, line properties, etc.'
  }
];
</script>
