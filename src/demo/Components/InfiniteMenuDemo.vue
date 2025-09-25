<template>
  <TabbedLayout>
    <template #preview>
      <div class="demo-container h-[500px] overflow-hidden">
        <InfiniteMenu :items="demoItems" />
      </div>

      <PropTable :data="propData" />
      <Dependencies :dependency-list="['gl-matrix']" />
    </template>

    <template #code>
      <CodeExample :code-object="infiniteMenu" />
    </template>

    <template #cli>
      <CliInstallation :command="infiniteMenu.cli" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import CliInstallation from '../../components/code/CliInstallation.vue';
import CodeExample from '../../components/code/CodeExample.vue';
import Dependencies from '../../components/code/Dependencies.vue';
import PropTable from '../../components/common/PropTable.vue';
import TabbedLayout from '../../components/common/TabbedLayout.vue';
import { infiniteMenu } from '../../constants/code/Components/infiniteMenuCode';
import InfiniteMenu from '../../content/Components/InfiniteMenu/InfiniteMenu.vue';

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

const propData = [
  {
    name: 'items',
    type: 'InfiniteMenuItem[]',
    default: '[{...}]',
    description: 'Array of menu items with image, title, description, and link properties.'
  }
];
</script>
