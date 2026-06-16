<template>
  <h1 class="sub-category">Ballpit</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="ballpit.usage"
    :source="ballpitSource"
    component-name="Ballpit"
    :props-table="props"
  >
    <template #preview>
      <div class="relative p-0 h-[500px] overflow-hidden demo-container">
        <RefreshButton @click="forceRerender" />
        <Ballpit
          className="relative"
          :key="key"
          :count="count"
          :gravity="gravity"
          :friction="friction"
          :wallBounce="wallBounce"
          :followCursor="followCursor"
          :colors="colors"
        />
        <BackgroundContent pillText="New Background" headline="Balls! What's not to like about them?" />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSwitch title="Display Cursor" v-model="followCursor" />
        <PreviewSlider title="Ball Count" :min="50" :max="500" :step="10" v-model="count" />
        <PreviewSlider title="Gravity" :min="0" :max="1" :step="0.1" v-model="gravity" />
        <PreviewSlider title="Friction" :min="0.9" :max="1" :step="0.001" v-model="friction" />
        <PreviewSlider title="Wall Bounce" :min="0.5" :max="1" :step="0.05" v-model="wallBounce" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="ballpit" :usage="ballpit.usage!" :source="ballpitSource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import BackgroundContent from '@/components/common/BackgroundContent.vue';
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import RefreshButton from '@/components/common/RefreshButton.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { ballpit } from '@/constants/code/Backgrounds/ballpitCode';
import Ballpit from '@/content/Backgrounds/Ballpit/Ballpit.vue';
import ballpitSource from '@/content/Backgrounds/Ballpit/Ballpit.vue?raw';
import { computed, ref } from 'vue';

const { rerenderKey: key, forceRerender } = useForceRerender();

const DEFAULTS = {
  count: 100,
  gravity: 0.01,
  friction: 0.9975,
  wallBounce: 0.95,
  followCursor: false
};

const count = ref(DEFAULTS.count);
const gravity = ref(DEFAULTS.gravity);
const friction = ref(DEFAULTS.friction);
const wallBounce = ref(DEFAULTS.wallBounce);
const followCursor = ref(DEFAULTS.followCursor);

const colors = [0xffffff, 0x000000, 0x27ff64];

const hasChanges = computed(
  () =>
    count.value !== DEFAULTS.count ||
    gravity.value !== DEFAULTS.gravity ||
    friction.value !== DEFAULTS.friction ||
    wallBounce.value !== DEFAULTS.wallBounce ||
    followCursor.value !== DEFAULTS.followCursor
);

function reset() {
  count.value = DEFAULTS.count;
  gravity.value = DEFAULTS.gravity;
  friction.value = DEFAULTS.friction;
  wallBounce.value = DEFAULTS.wallBounce;
  followCursor.value = DEFAULTS.followCursor;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'count',
    type: 'number',
    default: '200',
    description: 'Sets the number of balls in the ballpit.'
  },
  {
    name: 'gravity',
    type: 'number',
    default: '0.5',
    description: 'Controls the gravity affecting the balls.'
  },
  {
    name: 'friction',
    type: 'number',
    default: '0.9975',
    description: 'Sets the friction applied to the ball movement.'
  },
  {
    name: 'wallBounce',
    type: 'number',
    default: '0.95',
    description: 'Determines how much balls bounce off walls.'
  },
  {
    name: 'followCursor',
    type: 'boolean',
    default: 'true',
    description: 'Enables or disables the sphere following the cursor.'
  },
  {
    name: 'colors',
    type: 'array',
    default: '[0, 0, 0]',
    description: 'Defines the colors of the balls.'
  },
  {
    name: 'ambientColor',
    type: 'number',
    default: '16777215',
    description: 'Sets the ambient light color.'
  },
  {
    name: 'ambientIntensity',
    type: 'number',
    default: '1',
    description: 'Controls the intensity of ambient light.'
  },
  {
    name: 'lightIntensity',
    type: 'number',
    default: '200',
    description: 'Sets the intensity of the main light source.'
  },
  {
    name: 'minSize',
    type: 'number',
    default: '0.5',
    description: 'Specifies the minimum size of the balls.'
  },
  {
    name: 'maxSize',
    type: 'number',
    default: '1',
    description: 'Specifies the maximum size of the balls.'
  },
  {
    name: 'size0',
    type: 'number',
    default: '1',
    description: 'Initial size value for the cursor ball.'
  },
  {
    name: 'maxVelocity',
    type: 'number',
    default: '0.15',
    description: 'Limits the maximum velocity of the balls.'
  },
  {
    name: 'maxX',
    type: 'number',
    default: '5',
    description: 'Defines the maximum X-coordinate boundary.'
  },
  {
    name: 'maxY',
    type: 'number',
    default: '5',
    description: 'Defines the maximum Y-coordinate boundary.'
  },
  {
    name: 'maxZ',
    type: 'number',
    default: '2',
    description: 'Defines the maximum Z-coordinate boundary.'
  }
];
</script>
