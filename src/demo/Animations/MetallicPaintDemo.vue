<template>
  <TabbedLayout>
    <template #preview>
      <div class="demo-container h-[500px] overflow-hidden">
        <MetallicPaint
          v-if="imageData"
          :key="rerenderKey"
          :image-data="imageData"
          :params="{
            edge,
            patternBlur,
            patternScale,
            refraction,
            speed,
            liquid
          }"
        />
      </div>

      <Customize>
        <PreviewSlider title="Edge" v-model="edge" :min="0" :max="1" :step="0.1" />

        <PreviewSlider title="Pattern Scale" v-model="patternScale" :min="1" :max="5" :step="0.1" />

        <PreviewSlider title="Pattern Blur" v-model="patternBlur" :min="0" :max="0.1" :step="0.001" />

        <PreviewSlider title="Refraction" v-model="refraction" :min="0" :max="0.1" :step="0.01" />

        <PreviewSlider title="Liquid" v-model="liquid" :min="0" :max="1" :step="0.01" />

        <PreviewSlider title="Speed" v-model="speed" :min="0" :max="1" :step="0.01" />
      </Customize>

      <PropTable :data="propData" />
    </template>

    <template #code>
      <CodeExample :code-object="metallicPaint" />
    </template>

    <template #cli>
      <CliInstallation :command="metallicPaint.cli" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import TabbedLayout from '../../components/common/TabbedLayout.vue';
import PropTable from '../../components/common/PropTable.vue';
import CliInstallation from '../../components/code/CliInstallation.vue';
import CodeExample from '../../components/code/CodeExample.vue';
import Customize from '../../components/common/Customize.vue';
import PreviewSlider from '../../components/common/PreviewSlider.vue';
import MetallicPaint from '../../content/Animations/MetallicPaint/MetallicPaint.vue';
import { metallicPaint } from '@/constants/code/Animations/metallicPaintCode';
import { parseImage } from '../../content/Animations/MetallicPaint/parseImage';
import { useForceRerender } from '@/composables/useForceRerender';
import logo from '@/assets/logos/vue-bits-logo-small-dark.svg';

const imageData = ref<ImageData | null>(null);
const edge = ref(0);
const patternScale = ref(2);
const refraction = ref(0.015);
const patternBlur = ref(0.005);
const liquid = ref(0.07);
const speed = ref(0.3);

const { rerenderKey } = useForceRerender();

const propData = [
  {
    name: 'imageData',
    type: 'ImageData',
    default: 'none (required)',
    description:
      'The processed image data generated from the parseImage utility. This image data is used by the shader to create the liquid paper effect.'
  },
  {
    name: 'params',
    type: 'ShaderParams',
    default: '',
    description:
      'An object to configure the shader effect. Properties include: patternScale, refraction, edge, patternBlur, liquid, speed'
  }
];

onMounted(async () => {
  try {
    const response = await fetch(logo);
    const blob = await response.blob();
    const file = new File([blob], 'default.png', { type: blob.type });
    const { imageData: processedImageData } = await parseImage(file);
    imageData.value = processedImageData;
  } catch (err) {
    console.error('Error loading default image:', err);
  }
});
</script>
