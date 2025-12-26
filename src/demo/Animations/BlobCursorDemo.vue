<template>
  <TabbedLayout>
    <template #preview>
      <div class="demo-container h-[400px]">
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

      <Customize>
        <button
          @click="
            () => {
              blobType = blobType === 'circle' ? 'square' : 'circle';
            }
          "
          class="bg-[#0b0b0b] hover:bg-[#222] px-3 border border-[#333] rounded-[10px] h-8 text-white text-xs transition mb-[1.5rem]"
        >
          Blob Type:
          <span class="ml-1 text-gray-400">{{ blobType }}</span>
        </button>

        <PreviewColor title="Fill Color" v-model="fillColor" class="mb-4" />
        <PreviewColor title="Inner Color" v-model="innerColor" class="mb-4" />
        <PreviewColor title="Shadow Color" v-model="shadowColor" />

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

      <PropTable :data="propData" />
      <Dependencies :dependency-list="['gsap']" />
    </template>

    <template #code>
      <CodeExample :code-object="blobCursor" />
    </template>

    <template #cli>
      <CliInstallation :command="blobCursor.cli" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import CliInstallation from '../../components/code/CliInstallation.vue';
import CodeExample from '../../components/code/CodeExample.vue';
import Dependencies from '../../components/code/Dependencies.vue';
import PropTable from '../../components/common/PropTable.vue';
import TabbedLayout from '../../components/common/TabbedLayout.vue';
import { blobCursor } from '../../constants/code/Animations/blobCursorCode';
import Customize from '../../components/common/Customize.vue';
import PreviewSlider from '../../components/common/PreviewSlider.vue';
import PreviewColor from '../../components/common/PreviewColor.vue';
import BlobCursor from '../../content/Animations/BlobCursor/BlobCursor.vue';

const blobType = ref<'circle' | 'square'>('circle');
const fillColor = ref<string>('#27FF64');
const trailCount = ref<number>(3);
const sizes = ref<number[]>([60, 125, 75]);
const innerSizes = ref<number[]>([20, 35, 25]);
const innerColor = ref<string>('rgba(255,255,255,0.8)');
const opacities = ref<number[]>([0.6, 0.6, 0.6]);
const shadowColor = ref<string>('rgba(0,0,0,0.75)');
const shadowBlur = ref<number>(5);
const shadowOffsetX = ref<number>(10);
const shadowOffsetY = ref<number>(10);
const fastDuration = ref<number>(0.1);
const slowDuration = ref<number>(0.5);
const zIndex = ref<number>(100);

const propData = [
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
