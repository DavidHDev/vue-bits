<template>
  <TabbedLayout>
    <template #preview>
      <div class="demo-container h-[600px] overflow-hidden py-[100px]">
        <FlowingMenu :items="demoItems" />
      </div>

      <PropTable :data="propData" />

      <Dependencies :dependency-list="['gsap']" />
    </template>

    <template #code>
      <CodeExample :code-object="flowingMenu" />
    </template>

    <template #cli>
      <CliInstallation :command="flowingMenu.cli" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import TabbedLayout from '../../components/common/TabbedLayout.vue';
import PropTable from '../../components/common/PropTable.vue';
import Dependencies from '../../components/code/Dependencies.vue';
import CliInstallation from '../../components/code/CliInstallation.vue';
import CodeExample from '../../components/code/CodeExample.vue';
import FlowingMenu from '../../content/Components/FlowingMenu/FlowingMenu.vue';
import { flowingMenu } from '@/constants/code/Components/flowingMenuCode';

const propData = [
  {
    name: 'items',
    type: 'object[]',
    default: '[]',
    description: 'An array of objects containing: link, text, image.'
  }
];

const demoItems = [
  { link: '#', text: 'Mojave', image: 'https://picsum.photos/600/400?random=1' },
  { link: '#', text: 'Sonoma', image: 'https://picsum.photos/600/400?random=2' },
  { link: '#', text: 'Monterey', image: 'https://picsum.photos/600/400?random=3' },
  { link: '#', text: 'Sequoia', image: 'https://picsum.photos/600/400?random=4' }
];
</script>
