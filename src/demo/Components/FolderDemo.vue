<template>
  <h1 class="sub-category">Folder</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="folder.usage"
    :source="folderSource"
    component-name="Folder"
    :props-table="props"
  >
    <template #preview>
      <div class="h-[400px] demo-container">
        <Folder :size="size" :color="color" />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewColorPicker title="Folder Color" v-model="color" />
        <PreviewSlider title="Folder Size" v-model="size" :min="0.1" :max="3" :step="0.1" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="folder" :usage="folder.usage!" :source="folderSource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewColorPicker from '@/components/common/PreviewColorPicker.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { folder } from '@/constants/code/Components/folderCode';
import Folder from '@/content/Components/Folder/Folder.vue';
import folderSource from '@/content/Components/Folder/Folder.vue?raw';
import { computed, ref } from 'vue';

const { forceRerender } = useForceRerender();

const DEFAULTS = {
  color: '#27FF64',
  size: 2
};

const color = ref(DEFAULTS.color);
const size = ref(DEFAULTS.size);

const hasChanges = computed(() => color.value !== DEFAULTS.color || size.value !== DEFAULTS.size);

function reset() {
  color.value = DEFAULTS.color;
  size.value = DEFAULTS.size;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'color',
    type: 'string',
    default: '#27FF64',
    description: 'The color of the folder.'
  },
  {
    name: 'class',
    type: 'string',
    default: '',
    description: 'Additional CSS classes for the folder container.'
  },
  {
    name: 'items',
    type: '(string | null)[]',
    default: '[]',
    description: 'An array of up to 3 items to display in the folder.'
  },
  {
    name: 'size',
    type: 'number',
    default: '1',
    description: 'Size multiplier for the folder.'
  }
];
</script>
