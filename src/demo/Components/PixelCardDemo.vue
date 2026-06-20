<template>
  <h1 class="sub-category">Pixel Card</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="pixelCard.usage"
    :source="pixelCardSource"
    component-name="PixelCard"
    :props-table="props"
  >
    <template #preview>
      <div class="relative h-[500px] overflow-hidden demo-container">
        <PixelCard :key="rerenderKey" :variant="selectedVariant">
          <div class="z-10 absolute inset-0 flex justify-center items-center w-full h-full mix-blend-screen">
            <h2 class="font-black text-[#222] text-5xl select-none">Hover Me.</h2>
          </div>
        </PixelCard>
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSelect title="Variant" :options="['default', 'blue', 'yellow', 'pink']" v-model="selectedVariant" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="pixel-card" :usage="pixelCard.usage!" :source="pixelCardSource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewSelect from '@/components/common/PreviewSelect.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { pixelCard } from '@/constants/code/Components/pixelCardCode';
import PixelCard from '@/content/Components/PixelCard/PixelCard.vue';
import pixelCardSource from '@/content/Components/PixelCard/PixelCard.vue?raw';
import { computed, ref } from 'vue';

const { rerenderKey, forceRerender } = useForceRerender();

const DEFAULTS = {
  variant: 'default' as 'default' | 'blue' | 'yellow' | 'pink'
};

const selectedVariant = ref<'default' | 'blue' | 'yellow' | 'pink'>(DEFAULTS.variant);

const hasChanges = computed(() => selectedVariant.value !== DEFAULTS.variant);

function reset() {
  selectedVariant.value = DEFAULTS.variant;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'variant',
    type: 'default | yellow | blue | pink',
    default: '"default"',
    description: 'Defines the color scheme and animation style.'
  },
  {
    name: 'gap',
    type: 'number',
    default: 'varies by variant',
    description: 'Pixel grid gap size in pixels.'
  },
  {
    name: 'speed',
    type: 'number',
    default: 'varies by variant',
    description: 'Animation speed modifier (lower is slower).'
  },
  {
    name: 'colors',
    type: 'string',
    default: '"#f8fafc,#f1f5f9,#cbd5e1"',
    description: 'Comma-separated list of colors for the pixel effect.'
  },
  {
    name: 'noFocus',
    type: 'boolean',
    default: 'false',
    description: 'If true, prevents animation from triggering on focus.'
  },
  {
    name: 'className',
    type: 'string',
    default: '""',
    description: 'Additional CSS class for the wrapper.'
  }
];
</script>
