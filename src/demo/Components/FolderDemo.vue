<template>
  <TabbedLayout>
    <template #preview>
      <div class="demo-container h-[500px]">
        <Folder :size="size" :color="color"></Folder>
      </div>

      <Customize>
        <PreviewColor title="Folder Color" v-model="color" />
        <PreviewSlider title="Folder Size" v-model="size" :min="1" :max="3" :step="0.1" />
      </Customize>

      <PropTable :data="propData" />
    </template>

    <template #code>
      <CodeExample :code-object="folder" />
    </template>

    <template #cli>
      <CliInstallation :command="folder.cli" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { folder } from '@/constants/code/Components/folderCode';

import Folder from '@/content/Components/Folder/Folder.vue';
import CliInstallation from '@/components/code/CliInstallation.vue';
import CodeExample from '@/components/code/CodeExample.vue';
import Customize from '@/components/common/Customize.vue';
import PreviewColor from '@/components/common/PreviewColor.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PropTable from '@/components/common/PropTable.vue';
import TabbedLayout from '@/components/common/TabbedLayout.vue';

const color = ref('#27FF64');
const size = ref(2);

const propData = [
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
