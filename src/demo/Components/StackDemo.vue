<template>
  <TabbedLayout>
    <template #preview>
      <div class="demo-container h-[500px]">
        <Stack
          :key="rerenderKey"
          :randomRotation="randomRotation"
          :sensitivity="sensitivity"
          :sendToBackOnClick="false"
          :cardDimensions="cardDimensions"
          :cardsData="images"
        ></Stack>
      </div>

      <Customize>
        <PreviewSwitch title="Random Rotation" v-model="randomRotation" />
        <PreviewSlider title="Sensitivity" v-model="sensitivity" :min="10" :max="300" :step="10" />
        <PreviewSlider title="Card Width" v-model="cardDimensions.width" :min="10" :max="300" :step="10" />
        <PreviewSlider title="Card Height" v-model="cardDimensions.height" :min="10" :max="300" :step="10" />
      </Customize>
      <PropTable :data="propData" />
    </template>

    <template #code>
      <CodeExample :code-object="stack" />
    </template>

    <template #cli>
      <CliInstallation :command="stack.cli" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import TabbedLayout from '../../components/common/TabbedLayout.vue';
import PropTable from '../../components/common/PropTable.vue';
import CliInstallation from '../../components/code/CliInstallation.vue';
import CodeExample from '../../components/code/CodeExample.vue';
import Customize from '../../components/common/Customize.vue';
import PreviewSwitch from '../../components/common/PreviewSwitch.vue';
import Stack from '../../content/Components/Stack/Stack.vue';
import { stack } from '@/constants/code/Components/stackCode';
import { useForceRerender } from '@/composables/useForceRerender';
import { ref } from 'vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';

const images = [
  { id: 1, img: 'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?q=80&w=500&auto=format' },
  { id: 2, img: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=500&auto=format' },
  { id: 3, img: 'https://images.unsplash.com/photo-1452626212852-811d58933cae?q=80&w=500&auto=format' },
  { id: 4, img: 'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?q=80&w=500&auto=format' }
];

const { rerenderKey } = useForceRerender();
const randomRotation = ref<boolean>(false);
const sensitivity = ref<number>(200);
const cardDimensions = ref({
  width: 208,
  height: 208
});

const propData = [
  {
    name: 'randomRotation',
    type: 'boolean',
    default: '-',
    description: `Applies a random rotation to each card for a 'messy' look.`
  },
  {
    name: 'sensitivity',
    type: 'number',
    default: '-',
    description: `Drag sensitivity for sending a card to the back.`
  },
  {
    name: 'cardDimensions',
    type: 'object',
    default: '{ width: 208, height: 208 }',
    description: `Defines the width and height of the cards.`
  },
  {
    name: 'sendToBackOnClick',
    type: 'boolean',
    default: 'false',
    description: `When enabled, the also stack shifts to the next card on click.`
  },
  {
    name: 'cardsData',
    type: 'array',
    default: '[]',
    description: 'The array of card data, including `id` and `img` properties.'
  },
  {
    name: 'animationConfig',
    type: 'object',
    default: '{ stiffness: 260, damping: 20 }',
    description: `Applies a random rotation to each card for a 'messy' look.`
  }
];
</script>
