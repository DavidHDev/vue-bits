<template>
  <h1 class="sub-category">Gradient Text</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="gradientText.usage"
    :source="gradientTextSource"
    component-name="GradientText"
    :props-table="props"
  >
    <template #preview>
      <div class="relative h-[400px] text-5xl demo-container">
        <GradientText
          :colors="colors"
          :animation-speed="animationSpeed"
          :direction="direction"
          :pause-on-hover="pauseOnHover"
          :yoyo="yoyo"
          :show-border="showBorder"
        >
          Gradient Magic
        </GradientText>
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewColorPicker
          v-for="(_, index) in colors"
          :key="index"
          :title="`Color ${index + 1}`"
          v-model="colors[index]"
        />
        <PreviewSlider title="Ribbon Count" :min="2" :max="8" :step="1" v-model="colorsCount" />
        <PreviewSlider title="Animation Speed" v-model="animationSpeed" :min="1" :max="20" :step="0.5" value-unit="s" />
        <PreviewSelect title="Direction" v-model="direction" :options="['horizontal', 'vertical', 'diagonal']" />
        <PreviewSwitch title="Yoyo Mode" v-model="yoyo" />
        <PreviewSwitch title="Pause on Hover" v-model="pauseOnHover" />
        <PreviewSwitch title="Show Border" v-model="showBorder" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="gradient-text" :usage="gradientText.usage!" :source="gradientTextSource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewColorPicker from '@/components/common/PreviewColorPicker.vue';
import PreviewSelect from '@/components/common/PreviewSelect.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { gradientText } from '@/constants/code/TextAnimations/gradientTextCode';
import GradientText from '@/content/TextAnimations/GradientText/GradientText.vue';
import gradientTextSource from '@/content/TextAnimations/GradientText/GradientText.vue?raw';
import { computed, ref } from 'vue';

const { forceRerender } = useForceRerender();

const DEFAULTS = {
  colors: ['#27FF64', '#27FF64', '#A0FFBC'],
  animationSpeed: 8,
  direction: 'horizontal' as 'horizontal' | 'vertical' | 'diagonal',
  pauseOnHover: false,
  yoyo: true,
  showBorder: false
};

const colors = ref([...DEFAULTS.colors]);
const animationSpeed = ref(DEFAULTS.animationSpeed);
const direction = ref(DEFAULTS.direction);
const pauseOnHover = ref(DEFAULTS.pauseOnHover);
const yoyo = ref(DEFAULTS.yoyo);
const showBorder = ref(DEFAULTS.showBorder);

const updateColors = (val: number) => {
  if (val > colors.value.length) {
    const newColors = [...colors.value];
    while (newColors.length < val) {
      newColors.push('#ffffff');
    }
    colors.value = newColors;
  } else if (val < colors.value.length) {
    colors.value = colors.value.slice(0, val);
  }
};

const colorsCount = computed({
  get: () => colors.value.length,
  set: updateColors
});

const hasChanges = computed(
  () =>
    JSON.stringify(colors.value) !== JSON.stringify(DEFAULTS.colors) ||
    animationSpeed.value !== DEFAULTS.animationSpeed ||
    direction.value !== DEFAULTS.direction ||
    pauseOnHover.value !== DEFAULTS.pauseOnHover ||
    yoyo.value !== DEFAULTS.yoyo ||
    showBorder.value !== DEFAULTS.showBorder
);

function reset() {
  colors.value = [...DEFAULTS.colors];
  animationSpeed.value = DEFAULTS.animationSpeed;
  direction.value = DEFAULTS.direction;
  pauseOnHover.value = DEFAULTS.pauseOnHover;
  yoyo.value = DEFAULTS.yoyo;
  showBorder.value = DEFAULTS.showBorder;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'slot',
    type: 'string',
    default: '-',
    description: 'The content to be displayed inside the gradient text.'
  },
  {
    name: 'className',
    type: 'string',
    default: "''",
    description: 'Adds custom classes to the root element for additional styling.'
  },
  {
    name: 'colors',
    type: 'string[]',
    default: `["#5227FF", "#FF9FFC", "#B19EEF"]`,
    description: 'Array of colors for the gradient effect.'
  },
  {
    name: 'animationSpeed',
    type: 'number',
    default: '8',
    description: 'Duration of one animation cycle in seconds.'
  },
  {
    name: 'direction',
    type: `'horizontal' | 'vertical' | 'diagonal'`,
    default: `'horizontal'`,
    description: 'Direction of the gradient animation.'
  },
  {
    name: 'pauseOnHover',
    type: 'boolean',
    default: 'false',
    description: 'Pauses the animation when hovering over the text.'
  },
  {
    name: 'yoyo',
    type: 'boolean',
    default: 'true',
    description: 'Reverses animation direction at the end instead of looping.'
  },
  {
    name: 'showBorder',
    type: 'boolean',
    default: 'false',
    description: 'Displays a gradient border around the text.'
  }
];
</script>
