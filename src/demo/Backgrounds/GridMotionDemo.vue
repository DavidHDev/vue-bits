<template>
  <TabbedLayout>
    <template #preview>
      <div class="h-[600px] overflow-hidden demo-container">
        <GridMotion :items="images" />
      </div>

      <PropTable :data="propData" />

      <Dependencies :dependency-list="['gsap']" />
    </template>

    <template #code>
      <CodeExample :code-object="gridMotion" />
    </template>

    <template #cli>
      <CliInstallation :command="gridMotion.cli" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import CliInstallation from '../../components/code/CliInstallation.vue';
import CodeExample from '../../components/code/CodeExample.vue';
import Dependencies from '../../components/code/Dependencies.vue';
import PropTable from '../../components/common/PropTable.vue';
import TabbedLayout from '../../components/common/TabbedLayout.vue';
import GridMotion from '../../content/Backgrounds/GridMotion/GridMotion.vue';
import { gridMotion } from '../../constants/code/Backgrounds/gridMotionCode';

const propData = [
  {
    name: 'items',
    type: 'array',
    default: '[]',
    description: 'An array of items to display in the grid. Each item can be a string, JSX element, or an image URL.'
  },
  {
    name: 'gradientColor',
    type: 'string',
    default: 'black',
    description: 'Controls the color of the radial gradient used as the background.'
  }
];

const imageUrl =
  'https://images.unsplash.com/photo-1748370987492-eb390a61dcda?q=80&w=1364&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
const numberOfImages = 30;
const images = Array.from({ length: numberOfImages }, () => imageUrl);
</script>
