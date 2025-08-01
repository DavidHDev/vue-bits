<template>
  <TabbedLayout>
    <template #preview>
      <div class="demo-container bounce-cards-demo">
        <RefreshButton @refresh="forceRerender" />

        <BounceCards
          :key="rerenderKey"
          class="custom-bounceCards"
          :images="images"
          :animation-delay="animationDelay"
          :animation-stagger="animationStagger"
          ease-type="elastic.out(1, 0.5)"
          :transform-styles="transformStyles"
          :enable-hover="enableHover"
        />
      </div>

      <Customize>
        <PreviewSwitch title="Enable Hover Effect" v-model="enableHover" />

        <PreviewSlider title="Animation Delay" v-model="animationDelay" :min="0.1" :max="2" :step="0.1" />

        <PreviewSlider title="Animation Stagger" v-model="animationStagger" :min="0" :max="0.3" :step="0.01" />
      </Customize>

      <PropTable :data="propData" />

      <Dependencies :dependency-list="['gsap']" />
    </template>

    <template #code>
      <CodeExample :code-object="bounceCards" />
    </template>

    <template #cli>
      <CliInstallation :command="bounceCards.cli" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TabbedLayout from '@/components/common/TabbedLayout.vue';
import RefreshButton from '@/components/common/RefreshButton.vue';
import PropTable from '@/components/common/PropTable.vue';
import Dependencies from '@/components/code/Dependencies.vue';
import CliInstallation from '@/components/code/CliInstallation.vue';
import CodeExample from '@/components/code/CodeExample.vue';
import Customize from '@/components/common/Customize.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import BounceCards from '@/content/Components/BounceCards/BounceCards.vue';
import { bounceCards } from '@/constants/code/Components/bounceCardsCode';
import { useForceRerender } from '@/composables/useForceRerender';

const enableHover = ref(false);
const animationDelay = ref(1);
const animationStagger = ref(0.08);
const { rerenderKey, forceRerender } = useForceRerender();

const images = ref([
  'https://picsum.photos/id/287/300/300?grayscale',
  'https://picsum.photos/id/1001/300/300?grayscale',
  'https://picsum.photos/id/1027/300/300?grayscale',
  'https://picsum.photos/id/1025/300/300?grayscale',
  'https://picsum.photos/id/1026/300/300?grayscale'
]);

const transformStyles = ref([
  'rotate(5deg) translate(-150px)',
  'rotate(0deg) translate(-70px)',
  'rotate(-5deg)',
  'rotate(5deg) translate(70px)',
  'rotate(-5deg) translate(150px)'
]);

const propData = [
  {
    name: 'className',
    type: 'string',
    default: '-',
    description: 'Additional CSS classes for the container.'
  },
  {
    name: 'images',
    type: 'string[]',
    default: '[]',
    description: 'Array of image URLs to display.'
  },
  {
    name: 'containerWidth',
    type: 'number',
    default: '400',
    description: 'Width of the container (px).'
  },
  {
    name: 'containerHeight',
    type: 'number',
    default: '400',
    description: 'Height of the container (px).'
  },
  {
    name: 'animationDelay',
    type: 'number',
    default: '-',
    description: 'Delay (in seconds) before the animation starts.'
  },
  {
    name: 'animationStagger',
    type: 'number',
    default: '-',
    description: "Time (in seconds) between each card's animation."
  },
  {
    name: 'easeType',
    type: 'string',
    default: 'elastic.out(1, 0.8)',
    description: 'Easing function for the bounce.'
  },
  {
    name: 'transformStyles',
    type: 'string[]',
    default: 'various rotations/translations',
    description: 'Custom transforms for each card position.'
  },
  {
    name: 'enableHover',
    type: 'boolean',
    default: 'false',
    description: "If true, hovering pushes siblings aside and flattens the hovered card's rotation."
  }
];
</script>

<style scoped>
.bounce-cards-demo {
  min-height: 400px;
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1em;
}
</style>
