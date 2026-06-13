<template>
  <h1 class="sub-category">Pixel Transition</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="pixelTransition.usage"
    :source="pixelTransitionSource"
    component-name="PixelTransition"
    :props-table="props"
  >
    <template #preview>
      <div class="h-[400px] demo-container">
        <PixelTransition
          :key="key"
          :grid-size="gridSize"
          :pixel-color="pixelColor"
          :animation-step-duration="animationStepDuration"
          :once="once"
          class-name="custom-pixel-card"
        >
          <template #first>
            <img
              src="https://i.kym-cdn.com/entries/icons/original/000/054/270/rigrig.jpg"
              alt="Default"
              style="width: 100%; height: 100%; object-fit: cover"
            />
          </template>

          <template #second>
            <div style="width: 100%; height: 100%; display: grid; place-items: center; background-color: #111">
              <p style="font-weight: 900; font-size: 3rem; color: #fff">Meow!</p>
            </div>
          </template>
        </PixelTransition>

        <div class="bottom-[1em] absolute mt-2 text-[#a6a6a6]">Psst, hover the image!</div>
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSlider title="Grid Size" v-model="gridSize" :min="2" :max="50" :step="1" width="200" />
        <PreviewSlider
          title="Animation Duration"
          v-model="animationStepDuration"
          :min="0.1"
          :max="2"
          :step="0.1"
          value-unit="s"
          width="200"
        />
        <PreviewColorPicker title="Pixel Color" v-model="pixelColor" />
        <PreviewSwitch title="Once" v-model="once" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="pixel-transition" :usage="pixelTransition.usage!" :source="pixelTransitionSource" />
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
import { useForceRerender } from '@/composables/useForceRerender';
import { pixelTransition } from '@/constants/code/Animations/pixelTransitionCode';
import PixelTransition from '@/content/Animations/PixelTransition/PixelTransition.vue';
import pixelTransitionSource from '@/content/Animations/PixelTransition/PixelTransition.vue?raw';
import { computed, ref } from 'vue';

const { rerenderKey: key, forceRerender } = useForceRerender();

const DEFAULTS = {
  gridSize: 8,
  pixelColor: '#ffffff',
  animationStepDuration: 0.4,
  once: false
};

const gridSize = ref(DEFAULTS.gridSize);
const pixelColor = ref(DEFAULTS.pixelColor);
const animationStepDuration = ref(DEFAULTS.animationStepDuration);
const once = ref(DEFAULTS.once);

const hasChanges = computed(
  () =>
    gridSize.value !== DEFAULTS.gridSize ||
    pixelColor.value !== DEFAULTS.pixelColor ||
    animationStepDuration.value !== DEFAULTS.animationStepDuration ||
    once.value !== DEFAULTS.once
);

function reset() {
  gridSize.value = DEFAULTS.gridSize;
  pixelColor.value = DEFAULTS.pixelColor;
  animationStepDuration.value = DEFAULTS.animationStepDuration;
  once.value = DEFAULTS.once;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'firstContent',
    type: 'slot #first',
    default: '—',
    description: 'Content to show by default (e.g., an <img> or text).'
  },
  {
    name: 'secondContent',
    type: 'slot #second',
    default: '—',
    description: 'Content revealed upon hover or click.'
  },
  {
    name: 'gridSize',
    type: 'number',
    default: '7',
    description: 'Number of rows/columns in the pixel grid.'
  },
  {
    name: 'pixelColor',
    type: 'string',
    default: 'currentColor',
    description: 'Background color used for each pixel block.'
  },
  {
    name: 'animationStepDuration',
    type: 'number',
    default: '0.3',
    description: 'Length of the pixel reveal/hide in seconds.'
  },
  {
    name: 'aspectRatio',
    type: 'string',
    default: `"100%"`,
    description: "Sets the 'padding-top' (or aspect-ratio) for the container."
  },
  {
    name: 'once',
    type: 'boolean',
    default: 'false',
    description: 'If true, the transition will not revert on mouse leave or subsequent clicks.'
  },
  {
    name: 'className',
    type: 'string',
    default: '—',
    description: 'Optional additional class names for styling.'
  },
  {
    name: 'style',
    type: 'object',
    default: '{}',
    description: 'Optional inline styles for the container.'
  }
];
</script>

<style scoped>
.custom-pixel-card {
  box-shadow: 0 2px 16px 0 #00000033;
}
</style>
