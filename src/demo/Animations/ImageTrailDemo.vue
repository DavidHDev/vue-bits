<template>
  <h1 class="sub-category">Image Trail</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="imageTrail.usage"
    :source="imageTrailSource"
    component-name="ImageTrail"
    :props-table="props"
  >
    <template #preview>
      <div class="h-[500px] overflow-hidden demo-container">
        <ImageTrail :key="variant" :items="items" :variant="+variant" />

        <div class="absolute flex flex-col justify-center items-center">
          <p class="mb-0 font-black text-[#333] text-[clamp(2rem,6vw,6rem)]">Hover Me.</p>
          <p class="mt-0 font-black text-[#a6a6a6] text-[18px]">Variant {{ variant }}</p>
        </div>
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSelect title="Variant" v-model="variant" :options="['1', '2', '3', '4', '5', '6', '7', '8']" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="image-trail" :usage="imageTrail.usage!" :source="imageTrailSource" />
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
import { imageTrail } from '@/constants/code/Animations/imageTrailCode';
import ImageTrail from '@/content/Animations/ImageTrail/ImageTrail.vue';
import imageTrailSource from '@/content/Animations/ImageTrail/ImageTrail.vue?raw';
import { computed, ref } from 'vue';

const { forceRerender } = useForceRerender();

const DEFAULTS = {
  variant: '1'
};

const variant = ref(DEFAULTS.variant);

const hasChanges = computed(() => variant.value !== DEFAULTS.variant);

function reset() {
  variant.value = DEFAULTS.variant;
  forceRerender();
}

const items = [
  'https://picsum.photos/id/287/300/300',
  'https://picsum.photos/id/1001/300/300',
  'https://picsum.photos/id/1025/300/300',
  'https://picsum.photos/id/1026/300/300',
  'https://picsum.photos/id/1027/300/300',
  'https://picsum.photos/id/1028/300/300',
  'https://picsum.photos/id/1029/300/300',
  'https://picsum.photos/id/1030/300/300'
];

const props: PropRow[] = [
  {
    name: 'items',
    type: 'string[]',
    default: '[]',
    description: 'An array of image URLs which will be animated in the trail.'
  },
  {
    name: 'variant',
    type: 'number',
    default: '1',
    description: 'A number from 1 to 8 - all different animation styles.'
  }
];
</script>
