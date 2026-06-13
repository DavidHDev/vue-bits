<template>
  <h1 class="sub-category">Bounce Cards</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="bounceCards.usage"
    :source="bounceCardsSource"
    component-name="BounceCards"
    :props-table="props"
  >
    <template #preview>
      <div class="h-[500px] demo-container bounce-cards-demo">
        <RefreshButton @click="forceRerender" />
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
    </template>

    <template #customize>
      <Customize>
        <PreviewSwitch title="Enable Hover Effect" v-model="enableHover" />
        <PreviewSlider title="Animation Delay" v-model="animationDelay" :min="0.1" :max="2" :step="0.1" />
        <PreviewSlider title="Animation Stagger" v-model="animationStagger" :min="0" :max="0.3" :step="0.01" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="bounce-cards" :usage="bounceCards.usage!" :source="bounceCardsSource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import RefreshButton from '@/components/common/RefreshButton.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { bounceCards } from '@/constants/code/Components/bounceCardsCode';
import BounceCards from '@/content/Components/BounceCards/BounceCards.vue';
import bounceCardsSource from '@/content/Components/BounceCards/BounceCards.vue?raw';
import { computed, ref } from 'vue';

const { rerenderKey, forceRerender } = useForceRerender();

const DEFAULTS = {
  enableHover: false,
  animationDelay: 1,
  animationStagger: 0.08
};

const enableHover = ref(DEFAULTS.enableHover);
const animationDelay = ref(DEFAULTS.animationDelay);
const animationStagger = ref(DEFAULTS.animationStagger);

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

const hasChanges = computed(
  () =>
    enableHover.value !== DEFAULTS.enableHover ||
    animationDelay.value !== DEFAULTS.animationDelay ||
    animationStagger.value !== DEFAULTS.animationStagger
);

function reset() {
  enableHover.value = DEFAULTS.enableHover;
  animationDelay.value = DEFAULTS.animationDelay;
  animationStagger.value = DEFAULTS.animationStagger;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'className',
    type: 'string',
    default: '',
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
    default: '0.5',
    description: 'Delay (in seconds) before the animation starts.'
  },
  {
    name: 'animationStagger',
    type: 'number',
    default: '0.06',
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

.custom-bounceCards {
  position: relative;
  top: 2em;
}
</style>
