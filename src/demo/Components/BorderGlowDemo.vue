<template>
  <h1 class="sub-category">Border Glow</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="borderGlow.usage"
    :source="borderGlowSource"
    component-name="BorderGlow"
    :props-table="props"
  >
    <template #preview>
      <div class="h-[500px] overflow-hidden demo-container">
        <BorderGlow
          v-bind="{
            edgeSensitivity,
            glowColor,
            backgroundColor,
            borderRadius,
            glowRadius,
            glowIntensity,
            coneSpread,
            animated
          }"
          :colors="colors"
        >
          <div class="flex flex-col justify-center items-start p-[2em] min-h-[200px]">
            <i class="pi pi-sparkles" style="font-size: 34px; margin-bottom: 12px"></i>
            <p class="font-semibold text-[1.4rem] tracking-[-0.5px]">Hover Near the Edges</p>
            <p class="mt-1 max-w-[40ch] text-[#a1a1aa] text-[14px]">
              Move your cursor close to the card border to see the colored glow effect follow your pointer direction.
            </p>
          </div>
        </BorderGlow>
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSlider title="Edge Sensitivity" :min="0" :max="80" :step="1" v-model="edgeSensitivity" />
        <PreviewSlider title="Border Radius" :min="0" :max="50" :step="1" v-model="borderRadius" />
        <PreviewSlider title="Glow Radius" :min="10" :max="80" :step="1" v-model="glowRadius" />
        <PreviewSlider title="Glow Intensity" :min="0.1" :max="3" :step="0.1" v-model="glowIntensity" />
        <PreviewSlider title="Cone Spread" :min="5" :max="45" :step="1" v-model="coneSpread" />
        <PreviewSwitch title="Animated Intro" v-model="animated" />
        <PreviewColorPicker title="Background" v-model="backgroundColor" />
        <p class="mt-4 text-sm">Gradient Colors</p>
        <PreviewColorPicker
          v-for="(color, index) in colors"
          :key="index"
          :title="`Color ${index + 1}`"
          :model-value="color"
          @update:model-value="updateColors(index, $event)"
        />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="border-glow" :usage="borderGlow.usage!" :source="borderGlowSource" />
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
import { borderGlow } from '@/constants/code/Components/borderGlowCode';
import BorderGlow from '@/content/Components/BorderGlow/BorderGlow.vue';
import borderGlowSource from '@/content/Components/BorderGlow/BorderGlow.vue?raw';
import { computed, ref } from 'vue';

const { forceRerender } = useForceRerender();

const DEFAULTS = {
  edgeSensitivity: 30,
  glowColor: '40 80 80',
  backgroundColor: '#070F07',
  borderRadius: 28,
  glowRadius: 40,
  glowIntensity: 1.0,
  coneSpread: 25,
  animated: false
};

const colors = ref(['#c084fc', '#f472b6', '#38bdf8']);
const edgeSensitivity = ref(DEFAULTS.edgeSensitivity);
const glowColor = ref(DEFAULTS.glowColor);
const backgroundColor = ref(DEFAULTS.backgroundColor);
const borderRadius = ref(DEFAULTS.borderRadius);
const glowRadius = ref(DEFAULTS.glowRadius);
const glowIntensity = ref(DEFAULTS.glowIntensity);
const coneSpread = ref(DEFAULTS.coneSpread);
const animated = ref(DEFAULTS.animated);

const updateColors = (index: number, value: string) => {
  const next = [...colors.value];
  next[index] = value;
  colors.value = next;
};

const hasChanges = computed(
  () =>
    edgeSensitivity.value !== DEFAULTS.edgeSensitivity ||
    glowColor.value !== DEFAULTS.glowColor ||
    backgroundColor.value !== DEFAULTS.backgroundColor ||
    borderRadius.value !== DEFAULTS.borderRadius ||
    glowRadius.value !== DEFAULTS.glowRadius ||
    glowIntensity.value !== DEFAULTS.glowIntensity ||
    coneSpread.value !== DEFAULTS.coneSpread ||
    animated.value !== DEFAULTS.animated
);

function reset() {
  edgeSensitivity.value = DEFAULTS.edgeSensitivity;
  glowColor.value = DEFAULTS.glowColor;
  backgroundColor.value = DEFAULTS.backgroundColor;
  borderRadius.value = DEFAULTS.borderRadius;
  glowRadius.value = DEFAULTS.glowRadius;
  glowIntensity.value = DEFAULTS.glowIntensity;
  coneSpread.value = DEFAULTS.coneSpread;
  animated.value = DEFAULTS.animated;
  forceRerender();
}

const props: PropRow[] = [
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
