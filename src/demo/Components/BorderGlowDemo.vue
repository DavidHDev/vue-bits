<template>
  <TabbedLayout>
    <template #preview>
      <div class="h-[500px] overflow-hidden demo-container">
        <BorderGlow v-bind="props">
          <div class="flex flex-col justify-center items-start p-[2em] min-h-[200px]">
            <i class="pi pi-sparkles" style="font-size: 34px; margin-bottom: 12px"></i>
            <p class="font-semibold text-[1.4rem] tracking-[-0.5px]">Hover Near the Edges</p>
            <p class="mt-1 max-w-[40ch] text-[#a1a1aa] text-[14px]">
              Move your cursor close to the card border to see the colored glow effect follow your pointer direction.
            </p>
          </div>
        </BorderGlow>
      </div>

      <Customize>
        <PreviewSlider title="Edge Sensitivity" :min="0" :max="80" :step="1" v-model="edgeSensitivity" />
        <PreviewSlider title="Border Radius" :min="0" :max="50" :step="1" v-model="borderRadius" />
        <PreviewSlider title="Glow Radius" :min="10" :max="80" :step="1" v-model="glowRadius" />
        <PreviewSlider title="Glow Intensity" :min="0.1" :max="3" :step="0.1" v-model="glowIntensity" />
        <PreviewSlider title="Cone Spread" :min="5" :max="45" :step="1" v-model="coneSpread" />
        <PreviewSwitch title="Animated Intro" v-model="animated" />
        <PreviewColor title="Background" v-model="backgroundColor" class="mb-2" />

        <div class="flex flex-col gap-0">
          <span class="block font-medium text-sm">Gradient Colors</span>

          <div class="flex flex-wrap gap-2 px-1 pt-1">
            <label
              v-for="(color, index) in colors"
              :key="index"
              class="border-[#222] border-2 rounded-md w-12 h-12 overflow-hidden cursor-pointer"
              :style="{ backgroundColor: color }"
            >
              <input
                type="color"
                :value="color"
                @input="updateColor(index, ($event.target as HTMLInputElement).value)"
                class="opacity-0 w-full h-full cursor-pointer"
              />
            </label>
          </div>
        </div>
      </Customize>

      <PropTable :data="propData" />
    </template>

    <template #code>
      <CodeExample :code-object="borderGlow" />
    </template>

    <template #cli>
      <CliInstallation :command="borderGlow.cli" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import CliInstallation from '@/components/code/CliInstallation.vue';
import CodeExample from '@/components/code/CodeExample.vue';
import Customize from '@/components/common/Customize.vue';
import PreviewColor from '@/components/common/PreviewColor.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable from '@/components/common/PropTable.vue';
import TabbedLayout from '@/components/common/TabbedLayout.vue';
import { borderGlow } from '@/constants/code/Components/borderGlowCode';
import BorderGlow from '@/content/Components/BorderGlow/BorderGlow.vue';
import { computed, ref } from 'vue';

const colors = ref(['#c084fc', '#f472b6', '#38bdf8']);
const edgeSensitivity = ref(30);
const glowColor = ref('40 80 80');
const backgroundColor = ref('#070F07');
const borderRadius = ref(28);
const glowRadius = ref(40);
const glowIntensity = ref(1.0);
const coneSpread = ref(25);
const animated = ref(false);

const props = computed(() => ({
  edgeSensitivity: edgeSensitivity.value,
  glowColor: glowColor.value,
  backgroundColor: backgroundColor.value,
  borderRadius: borderRadius.value,
  glowRadius: glowRadius.value,
  glowIntensity: glowIntensity.value,
  coneSpread: coneSpread.value,
  animated: animated.value,
  colors: colors.value
}));

const updateColor = (index: number, newColor: string) => {
  const newColors = [...colors.value];
  newColors[index] = newColor;
  colors.value = newColors;
};

const propData = [
  { name: 'children', type: 'slot', default: '-', description: 'Content rendered inside the card.' },
  { name: 'className', type: 'string', default: '""', description: 'Additional CSS classes for the outer wrapper.' },
  {
    name: 'edgeSensitivity',
    type: 'number',
    default: '30',
    description: 'How close the pointer must be to the edge for the glow to appear (0-100).'
  },
  {
    name: 'glowColor',
    type: 'string',
    default: '"40 80 80"',
    description: 'HSL values for the glow color, as "H S L" (e.g. "40 80 80").'
  },
  { name: 'backgroundColor', type: 'string', default: '"#070F07"', description: 'Background color of the card.' },
  { name: 'borderRadius', type: 'number', default: '28', description: 'Corner radius of the card in pixels.' },
  {
    name: 'glowRadius',
    type: 'number',
    default: '40',
    description: 'How far the outer glow extends beyond the card in pixels.'
  },
  { name: 'glowIntensity', type: 'number', default: '1.0', description: 'Multiplier for glow opacity (0.1-3.0).' },
  {
    name: 'coneSpread',
    type: 'number',
    default: '25',
    description: 'Width of the directional cone mask as a percentage (5-45).'
  },
  { name: 'animated', type: 'boolean', default: 'false', description: 'Play an intro sweep animation on mount.' },
  {
    name: 'colors',
    type: 'string[]',
    default: '[...]',
    description: 'Array of 3 hex colors for the mesh gradient border, distributed across positions.'
  }
];
</script>
