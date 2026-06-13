<template>
  <h1 class="sub-category">Infinite Menu</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="infiniteMenu.usage"
    :source="infiniteMenuSource"
    component-name="InfiniteMenu"
    :props-table="props"
  >
    <template #preview>
      <div class="h-[500px] overflow-hidden demo-container">
        <InfiniteMenu :items="demoItems" :scale="scaleFactor" />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSlider title="Scale" v-model="scaleFactor" :min="0.1" :max="3" :step="0.1" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="infinite-menu" :usage="infiniteMenu.usage!" :source="infiniteMenuSource" />
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
import { infiniteMenu } from '@/constants/code/Components/infiniteMenuCode';
import InfiniteMenu from '@/content/Components/InfiniteMenu/InfiniteMenu.vue';
import infiniteMenuSource from '@/content/Components/InfiniteMenu/InfiniteMenu.vue?raw';
import { computed, ref } from 'vue';

const { forceRerender } = useForceRerender();

const demoItems = [
  {
    image: 'https://picsum.photos/300/300?grayscale',
    link: 'https://google.com/',
    title: 'Item 1',
    description: 'This is pretty cool, right?'
  },
  {
    image: 'https://picsum.photos/400/400?grayscale',
    link: 'https://google.com/',
    title: 'Item 2',
    description: 'This is pretty cool, right?'
  },
  {
    image: 'https://picsum.photos/500/500?grayscale',
    link: 'https://google.com/',
    title: 'Item 3',
    description: 'This is pretty cool, right?'
  },
  {
    image: 'https://picsum.photos/600/600?grayscale',
    link: 'https://google.com/',
    title: 'Item 4',
    description: 'This is pretty cool, right?'
  }
];

const DEFAULTS = {
  scale: 1.0
};

const scaleFactor = ref<number>(DEFAULTS.scale);

const hasChanges = computed(() => scaleFactor.value !== DEFAULTS.scale);

function reset() {
  scaleFactor.value = DEFAULTS.scale;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'items',
    type: 'InfiniteMenuItem[]',
    default: '[{...}]',
    description: 'Array of menu items with image, title, description, and link properties.'
  },
  {
    name: 'scale',
    type: 'number',
    default: '1.0',
    description: 'scale camera position'
  }
];
</script>
