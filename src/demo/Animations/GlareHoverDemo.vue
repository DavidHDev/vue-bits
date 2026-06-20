<template>
  <h1 class="sub-category">Glare Hover</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="glareHover.usage"
    :source="glareHoverSource"
    component-name="GlareHover"
    :props-table="props"
  >
    <template #preview>
      <div class="h-[400px] demo-container">
        <GlareHover
          background="#111"
          border-color="#222"
          border-radius="20px"
          width="400px"
          height="300px"
          :glare-color="glareColor"
          :glare-opacity="glareOpacity"
          :glare-size="glareSize"
          :transition-duration="transitionDuration"
          :play-once="playOnce"
        >
          <div class="m-0 font-black text-[#222] text-5xl text-center">Hover Me</div>
        </GlareHover>
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewColorPicker title="Glare Color" v-model="glareColor" />
        <PreviewSlider title="Glare Opacity" v-model="glareOpacity" :min="0" :max="1" :step="0.1" />
        <PreviewSlider title="Glare Size" v-model="glareSize" :min="100" :max="500" :step="25" value-unit="%" />
        <PreviewSlider
          title="Transition Duration"
          v-model="transitionDuration"
          :min="200"
          :max="2000"
          :step="50"
          value-unit="ms"
        />
        <PreviewSwitch title="Play Once" v-model="playOnce" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="glare-hover" :usage="glareHover.usage!" :source="glareHoverSource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewColorPicker from '@/components/common/PreviewColorPicker.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender.ts';
import { glareHover } from '@/constants/code/Animations/glareHoverCode';
import GlareHover from '@/content/Animations/GlareHover/GlareHover.vue';
import glareHoverSource from '@/content/Animations/GlareHover/GlareHover.vue?raw';
import { computed, ref } from 'vue';

const { forceRerender } = useForceRerender();

const DEFAULTS = { glareColor: '#ffffff', glareOpacity: 0.5, glareSize: 300, transitionDuration: 800, playOnce: false };

const glareColor = ref(DEFAULTS.glareColor);
const glareOpacity = ref(DEFAULTS.glareOpacity);
const glareSize = ref(DEFAULTS.glareSize);
const transitionDuration = ref(DEFAULTS.transitionDuration);
const playOnce = ref(DEFAULTS.playOnce);

const hasChanges = computed(
  () =>
    glareColor.value !== DEFAULTS.glareColor ||
    glareOpacity.value !== DEFAULTS.glareOpacity ||
    glareSize.value !== DEFAULTS.glareSize ||
    transitionDuration.value !== DEFAULTS.transitionDuration ||
    playOnce.value !== DEFAULTS.playOnce
);

function reset() {
  glareColor.value = DEFAULTS.glareColor;
  glareOpacity.value = DEFAULTS.glareOpacity;
  glareSize.value = DEFAULTS.glareSize;
  transitionDuration.value = DEFAULTS.transitionDuration;
  playOnce.value = DEFAULTS.playOnce;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'width',
    type: 'string',
    default: '500px',
    description: 'The width of the hover element.'
  },
  {
    name: 'height',
    type: 'string',
    default: '500px',
    description: 'The height of the hover element.'
  },
  {
    name: 'background',
    type: 'string',
    default: '#000',
    description: 'The background color of the element.'
  },
  {
    name: 'borderRadius',
    type: 'string',
    default: '10px',
    description: 'The border radius of the element.'
  },
  {
    name: 'borderColor',
    type: 'string',
    default: '#333',
    description: 'The border color of the element.'
  },
  {
    name: 'glareColor',
    type: 'string',
    default: '#ffffff',
    description: 'The color of the glare effect (hex format).'
  },
  {
    name: 'glareOpacity',
    type: 'number',
    default: '0.5',
    description: 'The opacity of the glare effect (0-1).'
  },
  {
    name: 'glareAngle',
    type: 'number',
    default: '-45',
    description: 'The angle of the glare effect in degrees.'
  },
  {
    name: 'glareSize',
    type: 'number',
    default: '250',
    description: 'The size of the glare effect as a percentage (e.g. 250 = 250%).'
  },
  {
    name: 'transitionDuration',
    type: 'number',
    default: '650',
    description: 'The duration of the transition in milliseconds.'
  },
  {
    name: 'playOnce',
    type: 'boolean',
    default: 'false',
    description: "If true, the glare only animates on hover and doesn't return on mouse leave."
  },
  {
    name: 'className',
    type: 'string',
    default: '""',
    description: 'Additional CSS class names.'
  },
  {
    name: 'style',
    type: 'object',
    default: '{}',
    description: 'Additional inline styles.'
  }
];
</script>
