<template>
  <TabbedLayout>
    <template #preview>
      <div class="demo-container h-[400px]">
        <PixelTransition
          :key="key"
          :grid-size="gridSize"
          :pixel-color="pixelColor"
          :animation-step-duration="animationStepDuration"
          class-name="custom-pixel-card"
        >
          <template #firstContent>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/1200px-Cat03.jpg"
              alt="Default"
              style="width: 100%; height: 100%; object-fit: cover"
            />
          </template>

          <template #secondContent>
            <div style="width: 100%; height: 100%; display: grid; place-items: center; background-color: #111">
              <p style="font-weight: 900; font-size: 3rem; color: #fff">Meow!</p>
            </div>
          </template>
        </PixelTransition>

        <div class="mt-2 absolute bottom-[1em] text-[#a6a6a6]">Psst, hover the image!</div>
      </div>

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

        <PreviewColor title="Pixel Color" v-model="pixelColor" />
      </Customize>

      <PropTable :data="propData" />

      <Dependencies :dependency-list="['gsap']" />
    </template>

    <template #code>
      <CodeExample :code-object="pixelTransition" />
    </template>

    <template #cli>
      <CliInstallation :command="pixelTransition.cli" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TabbedLayout from '../../components/common/TabbedLayout.vue';
import PropTable from '../../components/common/PropTable.vue';
import Dependencies from '../../components/code/Dependencies.vue';
import CliInstallation from '../../components/code/CliInstallation.vue';
import CodeExample from '../../components/code/CodeExample.vue';
import Customize from '../../components/common/Customize.vue';
import PreviewSlider from '../../components/common/PreviewSlider.vue';
import PixelTransition from '../../content/Animations/PixelTransition/PixelTransition.vue';
import { pixelTransition } from '@/constants/code/Animations/pixelTransitionCode';
import { useForceRerender } from '@/composables/useForceRerender';
import PreviewColor from '../../components/common/PreviewColor.vue';

const { rerenderKey: key } = useForceRerender();
const gridSize = ref(8);
const pixelColor = ref('#ffffff');
const animationStepDuration = ref(0.4);

const propData = [
  {
    name: 'firstContent',
    type: 'VNode | string',
    default: '—',
    description: 'Content to show by default (e.g., an <img> or text).'
  },
  {
    name: 'secondContent',
    type: 'VNode | string',
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
    default: '"100%"',
    description: "Sets the 'padding-top' (or aspect-ratio) for the container."
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
