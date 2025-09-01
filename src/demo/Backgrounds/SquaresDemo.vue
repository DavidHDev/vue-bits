<template>
  <TabbedLayout>
    <template #preview>
      <div class="relative p-0 min-h-[200px] overflow-hidden demo-container">
        <div class="w-full h-[600px] overflow-hidden">
          <Squares
            :squareSize="size"
            :speed="speed"
            :direction="direction"
            :borderColor="borderColor"
            :hoverFillColor="hoverColor"
          />
          <BackgroundContent pillText="New Background" headline="Customizable squares moving around smoothly" />
        </div>
      </div>

      <Customize>
        <div class="flex items-center mb-6">
          <span class="mr-2 text-sm">Direction</span>

          <div class="flex">
            <button
              v-for="dir in directions"
              :key="dir.value"
              @click="direction = dir.value"
              :class="[
                'px-3 py-2 text-xs h-8 text-white border-r border-[#333] cursor-pointer last:border-r-0',
                direction === dir.value ? 'bg-[#222] hover:bg-[#222]' : 'bg-[#111] hover:bg-[#111]'
              ]"
              class="first:rounded-l last:rounded-r"
            >
              {{ dir.label }}
            </button>
          </div>
        </div>

        <PreviewSlider :min="10" :max="100" :step="1" v-model="size" title="Square Size" />

        <PreviewSlider :min="0.1" :max="2" :step="0.01" v-model="speed" title="Animation Speed" />

        <div class="flex gap-4">
          <PreviewColor v-model="borderColor" title="Border Color" />

          <PreviewColor v-model="hoverColor" title="Hover Color" />
        </div>
      </Customize>

      <PropTable :data="propData" />
    </template>

    <template #code>
      <CodeExample :codeObject="squares" />
    </template>

    <template #cli>
      <CliInstallation v-bind="squares" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import CliInstallation from '../../components/code/CliInstallation.vue';
import CodeExample from '../../components/code/CodeExample.vue';
import BackgroundContent from '../../components/common/BackgroundContent.vue';
import Customize from '../../components/common/Customize.vue';
import PreviewColor from '../../components/common/PreviewColor.vue';
import PreviewSlider from '../../components/common/PreviewSlider.vue';
import PropTable from '../../components/common/PropTable.vue';
import TabbedLayout from '../../components/common/TabbedLayout.vue';
import { squares } from '../../constants/code/Backgrounds/squaresCode';
import Squares from '../../content/Backgrounds/Squares/Squares.vue';

const direction = ref<'diagonal' | 'up' | 'right' | 'down' | 'left'>('diagonal');
const borderColor = ref('#333');
const hoverColor = ref('#27FF64');
const size = ref(40);
const speed = ref(0.5);

const directions = [
  { value: 'diagonal', label: 'Diagonal' },
  { value: 'up', label: 'Up' },
  { value: 'right', label: 'Right' },
  { value: 'down', label: 'Down' },
  { value: 'left', label: 'Left' }
] as const;

const propData = [
  {
    name: 'direction',
    type: 'string',
    default: "'right'",
    description: "Direction of square animation. Options: 'diagonal', 'up', 'right', 'down', 'left'."
  },
  {
    name: 'speed',
    type: 'number',
    default: '1',
    description: 'Animation speed multiplier.'
  },
  {
    name: 'borderColor',
    type: 'string',
    default: "'#999'",
    description: 'Color of the square borders.'
  },
  {
    name: 'squareSize',
    type: 'number',
    default: '40',
    description: 'Size of individual squares in pixels.'
  },
  {
    name: 'hoverFillColor',
    type: 'string',
    default: "'#222'",
    description: 'Fill color when hovering over squares.'
  }
];
</script>
