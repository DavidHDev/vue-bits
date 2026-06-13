<template>
  <h1 class="sub-category">Blob Cursor</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="blobCursor.usage"
    :source="blobCursorSource"
    component-name="BlobCursor"
    :props-table="props"
  >
    <template #preview>
      <div class="h-[400px] demo-container">
        <BlobCursor
          :blobType="blobType"
          :fillColor="fillColor"
          :trailCount="trailCount"
          :sizes="sizes"
          :innerSizes="innerSizes"
          :innerColor="innerColor"
          :opacities="opacities"
          :shadowColor="shadowColor"
          :shadowBlur="shadowBlur"
          :shadowOffsetX="shadowOffsetX"
          :shadowOffsetY="shadowOffsetY"
          :fastDuration="fastDuration"
          :slowDuration="slowDuration"
          :zIndex="zIndex"
        />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSelect title="Blob Type" v-model="blobType" :options="['circle', 'square']" />
        <PreviewColorPicker title="Fill Color" v-model="fillColor" />
        <PreviewColorPicker title="Inner Color" v-model="innerColor" />
        <PreviewColorPicker title="Shadow Color" v-model="shadowColor" />
        <PreviewSlider
          title="Trail Count"
          :min="1"
          :max="5"
          :step="1"
          v-model="trailCount"
          @onChange="
            (val: number) => {
              trailCount = val;
              const newSizes = Array(val)
                .fill(0)
                .map((_, i) => sizes[i] || sizes[sizes.length - 1] || 60);
              const newInnerSizes = Array(val)
                .fill(0)
                .map((_, i) => innerSizes[i] || innerSizes[innerSizes.length - 1] || 20);
              const newOpacities = Array(val)
                .fill(0)
                .map((_, i) => opacities[i] || opacities[opacities.length - 1] || 0.6);
              sizes = newSizes;
              innerSizes = newInnerSizes;
              opacities = newOpacities;
            }
          "
        />
        <PreviewSlider
          title="Lead Blob Size"
          :min="10"
          :max="200"
          :step="1"
          v-model="sizes[0]"
          :isDisabled="trailCount < 1"
        />
        <PreviewSlider
          title="Lead Inner Dot Size"
          :min="1"
          :max="100"
          :step="1"
          v-model="innerSizes[0]"
          :isDisabled="trailCount < 1"
        />
        <PreviewSlider
          title="Lead Blob Opacity"
          :min="0.1"
          :max="1"
          :step="0.05"
          v-model="opacities[0]"
          :isDisabled="trailCount < 1"
        />
        <PreviewSlider title="Shadow Blur" :min="0" :max="50" :step="1" v-model="shadowBlur" />
        <PreviewSlider title="Shadow Offset X" :min="-50" :max="50" :step="1" v-model="shadowOffsetX" />
        <PreviewSlider title="Shadow Offset Y" :min="-50" :max="50" :step="1" v-model="shadowOffsetY" />
        <PreviewSlider title="Fast Duration (Lead)" :min="0.01" :max="2" :step="0.01" v-model="fastDuration" />
        <PreviewSlider title="Slow Duration (Trail)" :min="0.01" :max="3" :step="0.01" v-model="slowDuration" />
        <PreviewSlider title="Z-Index" :min="0" :max="1000" :step="10" v-model="zIndex" />
      </Customize>

      <p class="flex items-center gap-[0.5em] mx-0 my-[1em] text-[#a1a1aa]">
        <i class="pi pi-exclamation-triangle"></i>
        SVG filters are not fully supported on Safari.
      </p>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="blob-cursor" :usage="blobCursor.usage!" :source="blobCursorSource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewColorPicker from '@/components/common/PreviewColorPicker.vue';
import PreviewSelect from '@/components/common/PreviewSelect.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { blobCursor } from '@/constants/code/Animations/blobCursorCode';
import BlobCursor from '@/content/Animations/BlobCursor/BlobCursor.vue';
import blobCursorSource from '@/content/Animations/BlobCursor/BlobCursor.vue?raw';
import { computed, ref } from 'vue';

const { forceRerender } = useForceRerender();

const DEFAULTS = {
  blobType: 'circle' as 'circle' | 'square',
  fillColor: '#27FF64',
  trailCount: 3,
  sizes: [60, 125, 75],
  innerSizes: [20, 35, 25],
  innerColor: 'rgba(255,255,255,0.8)',
  opacities: [0.6, 0.6, 0.6],
  shadowColor: 'rgba(0,0,0,0.75)',
  shadowBlur: 5,
  shadowOffsetX: 10,
  shadowOffsetY: 10,
  fastDuration: 0.1,
  slowDuration: 0.5,
  zIndex: 100
};

const blobType = ref<'circle' | 'square'>(DEFAULTS.blobType);
const fillColor = ref<string>(DEFAULTS.fillColor);
const trailCount = ref<number>(DEFAULTS.trailCount);
const sizes = ref<number[]>(DEFAULTS.sizes);
const innerSizes = ref<number[]>(DEFAULTS.innerSizes);
const innerColor = ref<string>(DEFAULTS.innerColor);
const opacities = ref<number[]>(DEFAULTS.opacities);
const shadowColor = ref<string>(DEFAULTS.shadowColor);
const shadowBlur = ref<number>(DEFAULTS.shadowBlur);
const shadowOffsetX = ref<number>(DEFAULTS.shadowOffsetX);
const shadowOffsetY = ref<number>(DEFAULTS.shadowOffsetY);
const fastDuration = ref<number>(DEFAULTS.fastDuration);
const slowDuration = ref<number>(DEFAULTS.slowDuration);
const zIndex = ref<number>(DEFAULTS.zIndex);

const hasChanges = computed(
  () =>
    blobType.value !== DEFAULTS.blobType ||
    fillColor.value !== DEFAULTS.fillColor ||
    trailCount.value !== DEFAULTS.trailCount ||
    sizes.value !== DEFAULTS.sizes ||
    innerSizes.value !== DEFAULTS.innerSizes ||
    innerColor.value !== DEFAULTS.innerColor ||
    opacities.value !== DEFAULTS.opacities ||
    shadowColor.value !== DEFAULTS.shadowColor ||
    shadowBlur.value !== DEFAULTS.shadowBlur ||
    shadowOffsetX.value !== DEFAULTS.shadowOffsetX ||
    shadowOffsetY.value !== DEFAULTS.shadowOffsetY ||
    fastDuration.value !== DEFAULTS.fastDuration ||
    slowDuration.value !== DEFAULTS.slowDuration ||
    zIndex.value !== DEFAULTS.zIndex
);

function reset() {
  blobType.value = DEFAULTS.blobType;
  fillColor.value = DEFAULTS.fillColor;
  trailCount.value = DEFAULTS.trailCount;
  sizes.value = DEFAULTS.sizes;
  innerSizes.value = DEFAULTS.innerSizes;
  innerColor.value = DEFAULTS.innerColor;
  opacities.value = DEFAULTS.opacities;
  shadowColor.value = DEFAULTS.shadowColor;
  shadowBlur.value = DEFAULTS.shadowBlur;
  shadowOffsetX.value = DEFAULTS.shadowOffsetX;
  shadowOffsetY.value = DEFAULTS.shadowOffsetY;
  fastDuration.value = DEFAULTS.fastDuration;
  slowDuration.value = DEFAULTS.slowDuration;
  zIndex.value = DEFAULTS.zIndex;
  forceRerender();
}

const props: PropRow[] = [
  { name: 'blobType', type: "'circle' | 'square'", default: "'circle'", description: 'Shape of the blobs.' },
  { name: 'fillColor', type: 'string', default: "'#27FF64'", description: 'Background color of each blob.' },
  { name: 'trailCount', type: 'number', default: '3', description: 'How many trailing blobs.' },
  {
    name: 'sizes',
    type: 'number[]',
    default: '[60, 125, 75]',
    description: 'Sizes (px) of each blob. Length must be ≥ trailCount.'
  },
  {
    name: 'innerSizes',
    type: 'number[]',
    default: '[20, 35, 25]',
    description: 'Sizes (px) of inner dots. Length must be ≥ trailCount.'
  },
  {
    name: 'innerColor',
    type: 'string',
    default: "'rgba(255,255,255,0.8)'",
    description: 'Background color of the inner dot.'
  },
  {
    name: 'opacities',
    type: 'number[]',
    default: '[0.6, 0.6, 0.6]',
    description: 'Opacity of each blob. Length ≥ trailCount.'
  },
  { name: 'shadowColor', type: 'string', default: "'rgba(0,0,0,0.75)'", description: 'Box-shadow color.' },
  { name: 'shadowBlur', type: 'number', default: '5', description: 'Box-shadow blur radius (px).' },
  { name: 'shadowOffsetX', type: 'number', default: '10', description: 'Box-shadow X offset (px).' },
  { name: 'shadowOffsetY', type: 'number', default: '10', description: 'Box-shadow Y offset (px).' },
  {
    name: 'filterId',
    type: 'string',
    default: "'blob'",
    description: 'Optional custom filter ID (for multiple instances).'
  },
  {
    name: 'filterStdDeviation',
    type: 'number',
    default: '30',
    description: 'feGaussianBlur stdDeviation for SVG filter.'
  },
  {
    name: 'filterColorMatrixValues',
    type: 'string',
    default: "'1 0 0 ...'",
    description: 'feColorMatrix values for SVG filter.'
  },
  { name: 'useFilter', type: 'boolean', default: 'true', description: 'Enable the SVG filter.' },
  { name: 'fastDuration', type: 'number', default: '0.1', description: 'GSAP duration for the lead blob.' },
  { name: 'slowDuration', type: 'number', default: '0.5', description: 'GSAP duration for the following blobs.' },
  { name: 'fastEase', type: 'string', default: "'power3.out'", description: 'GSAP ease for the lead blob.' },
  { name: 'slowEase', type: 'string', default: "'power1.out'", description: 'GSAP ease for the following blobs.' },
  { name: 'zIndex', type: 'number', default: '100', description: 'CSS z-index of the whole component.' }
];
</script>
