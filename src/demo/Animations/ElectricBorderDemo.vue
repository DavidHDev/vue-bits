<template>
  <TabbedLayout>
    <template #preview>
      <div class="demo-container h-[500px] overflow-hidden">
        <ElectricBorder
          v-if="example === 'card'"
          :color="cardProps.color"
          :speed="cardProps.speed"
          :chaos="cardProps.chaos"
          :thickness="cardProps.thickness"
          :style="{
            borderRadius: cardProps.radius
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
          :thickness="buttonProps.thickness"
          :style="{
            borderRadius: buttonProps.radius
          }"
          class-name="eb-button-container"
        >
          <div class="eb-demo-button-wrap">
            <button class="eb-demo-button">Learn More</button>
          </div>
        </ElectricBorder>
        <ElectricBorder
          v-if="example === 'circle'"
          :color="circleProps.color"
          :speed="circleProps.speed"
          :chaos="circleProps.chaos"
          :thickness="circleProps.thickness"
          :style="{
            borderRadius: circleProps.radius
          }"
        >
          <div style="width: 200px; height: 200px; border-radius: 50%" />
        </ElectricBorder>
      </div>

      <Customize>
        <PreviewSelect title="Example" v-model="example" :options="exampleOptions" />
        <PreviewColor title="Color" v-model="activeProps.color" />
        <PreviewSlider title="Speed" :min="0.1" :max="3" :step="0.1" v-model="activeProps.speed" />
        <PreviewSlider title="Chaos" :min="0.1" :max="1" :step="0.1" v-model="activeProps.chaos" />
        <PreviewSlider title="Thickness" :min="1" :max="5" :step="1" v-model="activeProps.thickness" value-unit="px" />
      </Customize>

      <PropTable :data="propData" />
    </template>

    <template #code>
      <CodeExample :code-object="electricBorder" />
    </template>

    <template #cli>
      <CliInstallation :command="electricBorder.cli" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import CliInstallation from '../../components/code/CliInstallation.vue';
import CodeExample from '../../components/code/CodeExample.vue';
import Customize from '../../components/common/Customize.vue';
import PreviewColor from '../../components/common/PreviewColor.vue';
import PreviewSelect from '../../components/common/PreviewSelect.vue';
import PreviewSlider from '../../components/common/PreviewSlider.vue';
import PropTable from '../../components/common/PropTable.vue';
import TabbedLayout from '../../components/common/TabbedLayout.vue';
import { electricBorder } from '../../constants/code/Animations/electricBorderCode';
import ElectricBorder from '../../content/Animations/ElectricBorder/ElectricBorder.vue';

const example = ref('card');
const exampleOptions = [
  { label: 'Card', value: 'card' },
  { label: 'Button', value: 'button' },
  { label: 'Circle', value: 'circle' }
];

const cardProps = reactive({
  color: '#85FF80',
  speed: 1,
  chaos: 0.5,
  thickness: 2,
  radius: 16
});
const buttonProps = reactive({
  color: '#9EF1CC',
  speed: 1,
  chaos: 0.5,
  thickness: 2,
  radius: 999
});
const circleProps = reactive({ color: '#85FF80', speed: 1, chaos: 0.5, thickness: 2, radius: '50%' });

const activeProps = computed(() => {
  if (example.value === 'card') return cardProps;
  if (example.value === 'button') return buttonProps;
  return circleProps;
});

const propData = [
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
    default: '1',
    description: 'Distortion intensity from the SVG displacement (0 disables warp).'
  },
  {
    name: 'thickness',
    type: 'number',
    default: '2',
    description: 'Border width in pixels.'
  },
  {
    name: 'className',
    type: 'string',
    default: '—',
    description: 'Optional className applied to the root wrapper.'
  },
  {
    name: 'style',
    type: 'React.CSSProperties',
    default: '—',
    description: 'Inline styles for the wrapper. Set borderRadius here to round corners.'
  },
  {
    name: 'children',
    type: 'ReactNode',
    default: '—',
    description: 'Content rendered inside the bordered container.'
  }
];
</script>
