<template>
  <h1 class="sub-category">Electric Border</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="electricBorder.usage"
    :source="electricBorderSource"
    component-name="ElectricBorder"
    :props-table="props"
  >
    <template #preview>
      <div class="h-[500px] overflow-hidden demo-container">
        <ElectricBorder
          v-if="example === 'card'"
          :color="cardProps.color"
          :speed="cardProps.speed"
          :chaos="cardProps.chaos"
          :style="{
            borderRadius: `${cardProps.radius}px`
          }"
        >
          <div :style="{ width: '300px', height: '360px' }" class="eb-demo-card">
            <div class="eb-demo-badge">Featured</div>
            <h3 class="eb-demo-title">Electric Card</h3>
            <p class="eb-demo-desc">An electric border for shocking your users, the right way.</p>
            <div class="eb-demo-row">
              <span class="eb-demo-chip">Live</span>
              <span class="eb-demo-chip">v1.0</span>
            </div>
            <button class="eb-demo-cta">Get Started</button>
          </div>
        </ElectricBorder>
        <ElectricBorder
          v-if="example === 'button'"
          :color="buttonProps.color"
          :speed="buttonProps.speed"
          :chaos="buttonProps.chaos"
          :style="{
            borderRadius: `${buttonProps.radius}px`
          }"
          class-name="eb-button-container"
        >
          <div class="eb-demo-button-wrap">
            <button
              class="eb-demo-button"
              :style="{
                borderRadius: `${buttonProps.radius}px`
              }"
            >
              Learn More
            </button>
          </div>
        </ElectricBorder>
        <ElectricBorder
          v-if="example === 'circle'"
          :color="circleProps.color"
          :speed="circleProps.speed"
          :chaos="circleProps.chaos"
          :style="{
            borderRadius: `${circleProps.radius}px`
          }"
        >
          <div style="width: 200px; height: 200px; border-radius: 50%" />
        </ElectricBorder>
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSelect title="Example" v-model="example" :options="exampleOptions" />
        <PreviewColorPicker title="Color" v-model="activeProps.color" />
        <PreviewSlider title="Speed" :min="0.1" :max="3" :step="0.1" v-model="activeProps.speed" />
        <PreviewSlider title="Chaos" :min="0.01" :max="0.3" :step="0.01" v-model="activeProps.chaos" />
        <PreviewSlider
          title="Border Radius"
          :min="0"
          :max="100"
          :step="1"
          v-model="activeProps.radius"
          value-unit="px"
        />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="electric-border" :usage="electricBorder.usage!" :source="electricBorderSource" />
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
import { electricBorder } from '@/constants/code/Animations/electricBorderCode';
import ElectricBorder from '@/content/Animations/ElectricBorder/ElectricBorder.vue';
import electricBorderSource from '@/content/Animations/ElectricBorder/ElectricBorder.vue?raw';
import { computed, reactive, ref } from 'vue';

const { forceRerender } = useForceRerender();

const DEFAULTS = {
  example: 'card',
  cardProps: {
    color: '#85FF80',
    speed: 1,
    chaos: 0.12,
    borderRadius: 16
  },
  buttonProps: {
    color: '#9EF1CC',
    speed: 1,
    chaos: 0.12,
    borderRadius: 999
  },
  circleProps: {
    color: '#85FF80',
    speed: 1,
    chaos: 0.12,
    borderRadius: 999
  }
};

const example = ref(DEFAULTS.example);
const exampleOptions = [
  { label: 'Card', value: 'card' },
  { label: 'Button', value: 'button' },
  { label: 'Circle', value: 'circle' }
];

const cardProps = reactive({
  color: DEFAULTS.cardProps.color,
  speed: DEFAULTS.cardProps.speed,
  chaos: DEFAULTS.cardProps.chaos,
  radius: DEFAULTS.cardProps.borderRadius
});
const buttonProps = reactive({
  color: DEFAULTS.buttonProps.color,
  speed: DEFAULTS.buttonProps.speed,
  chaos: DEFAULTS.buttonProps.chaos,
  radius: DEFAULTS.buttonProps.borderRadius
});
const circleProps = reactive({
  color: DEFAULTS.circleProps.color,
  speed: DEFAULTS.circleProps.speed,
  chaos: DEFAULTS.circleProps.chaos,
  radius: DEFAULTS.circleProps.borderRadius
});

const activeProps = computed(() => {
  if (example.value === 'card') return cardProps;
  if (example.value === 'button') return buttonProps;
  return circleProps;
});

const hasChanges = computed(
  () =>
    example.value !== DEFAULTS.example ||
    cardProps.color !== DEFAULTS.cardProps.color ||
    buttonProps.color !== DEFAULTS.buttonProps.color ||
    circleProps.color !== DEFAULTS.circleProps.color ||
    cardProps.speed !== DEFAULTS.cardProps.speed ||
    buttonProps.speed !== DEFAULTS.buttonProps.speed ||
    circleProps.speed !== DEFAULTS.circleProps.speed ||
    cardProps.chaos !== DEFAULTS.cardProps.chaos ||
    buttonProps.chaos !== DEFAULTS.buttonProps.chaos ||
    circleProps.chaos !== DEFAULTS.circleProps.chaos ||
    cardProps.radius !== DEFAULTS.cardProps.borderRadius ||
    buttonProps.radius !== DEFAULTS.buttonProps.borderRadius ||
    circleProps.radius !== DEFAULTS.circleProps.borderRadius
);

function reset() {
  example.value = DEFAULTS.example;
  cardProps.color = DEFAULTS.cardProps.color;
  buttonProps.color = DEFAULTS.buttonProps.color;
  circleProps.color = DEFAULTS.circleProps.color;
  cardProps.speed = DEFAULTS.cardProps.speed;
  buttonProps.speed = DEFAULTS.buttonProps.speed;
  circleProps.speed = DEFAULTS.circleProps.speed;
  cardProps.chaos = DEFAULTS.cardProps.chaos;
  buttonProps.chaos = DEFAULTS.buttonProps.chaos;
  circleProps.chaos = DEFAULTS.circleProps.chaos;
  cardProps.radius = DEFAULTS.cardProps.borderRadius;
  buttonProps.radius = DEFAULTS.buttonProps.borderRadius;
  circleProps.radius = DEFAULTS.circleProps.borderRadius;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'color',
    type: 'string',
    default: '"#28FF85"',
    description: 'Stroke/glow color. Any CSS color (hex, rgb, hsl).'
  },
  {
    name: 'speed',
    type: 'number',
    default: '1',
    description: 'Animation speed multiplier (higher = faster).'
  },
  {
    name: 'chaos',
    type: 'number',
    default: '0.12',
    description: 'Distortion intensity (0 = no distortion, higher = more chaotic).'
  },
  {
    name: 'borderRadius',
    type: 'number',
    default: '24',
    description: 'Border radius in pixels for the electric border path.'
  },
  {
    name: 'className',
    type: 'string',
    default: '—',
    description: 'Optional className applied to the root wrapper.'
  },
  {
    name: 'style',
    type: 'CSSProperties',
    default: '—',
    description: 'Inline styles for the wrapper.'
  },
  {
    name: 'children',
    type: 'slot',
    default: '—',
    description: 'Content rendered inside the bordered container.'
  }
];
</script>
