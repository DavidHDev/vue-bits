<template>
  <h1 class="sub-category">Chroma Grid</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="chromaGrid.usage"
    :source="chromaGridSource"
    component-name="ChromaGrid"
    :props-table="props"
  >
    <template #preview>
      <div class="py-[64px] overflow-hidden demo-container">
        <ChromaGrid :radius="radius" :damping="damping" :fadeOut="fadeOut" />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSlider title="Radius" v-model="radius" :min="50" :max="600" :step="10" />
        <PreviewSlider title="Damping" v-model="damping" :min="0.1" :max="5" :step="0.5" />
        <PreviewSlider title="Fade Out" v-model="fadeOut" :min="0" :max="2" :step="0.1" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="chroma-grid" :usage="chromaGrid.usage!" :source="chromaGridSource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { chromaGrid } from '@/constants/code/Components/chromaGridCode';
import ChromaGrid from '@/content/Components/ChromaGrid/ChromaGrid.vue';
import chromaGridSource from '@/content/Components/ChromaGrid/ChromaGrid.vue?raw';
import { computed, ref } from 'vue';

const { forceRerender } = useForceRerender();

const DEFAULTS = {
  radius: 300,
  damping: 0.45,
  fadeOut: 0.6
};

const radius = ref(DEFAULTS.radius);
const damping = ref(DEFAULTS.damping);
const fadeOut = ref(DEFAULTS.fadeOut);

const hasChanges = computed(
  () => radius.value !== DEFAULTS.radius || damping.value !== DEFAULTS.damping || fadeOut.value !== DEFAULTS.fadeOut
);

function reset() {
  radius.value = DEFAULTS.radius;
  damping.value = DEFAULTS.damping;
  fadeOut.value = DEFAULTS.fadeOut;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'items',
    type: 'Array',
    default: 'Demo []',
    description: 'Array of ChromaItem objects to display in the grid'
  },
  {
    name: 'className',
    type: 'string',
    default: "''",
    description: 'Additional CSS classes to apply to the grid container'
  },
  {
    name: 'radius',
    type: 'number',
    default: '300',
    description: 'Size of the spotlight effect in pixels'
  },
  {
    name: 'damping',
    type: 'number',
    default: '0.45',
    description: 'Cursor follow animation duration in seconds'
  },
  {
    name: 'fadeOut',
    type: 'number',
    default: '0.6',
    description: 'Fade-out animation duration in seconds when mouse leaves'
  },
  {
    name: 'ease',
    type: 'string',
    default: "'power3.out'",
    description: 'GSAP easing function for animations'
  }
];
</script>
