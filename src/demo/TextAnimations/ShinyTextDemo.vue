<template>
  <h1 class="sub-category">Shiny Text</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="shinyText.usage"
    :source="shinyTextSource"
    component-name="ShinyText"
    :props-table="props"
  >
    <template #preview>
      <div class="h-[400px] text-3xl demo-container">
        <ShinyText
          text="✨ Shiny Text Effect"
          :delay="delay"
          :speed="speed"
          :color="color"
          :shine-color="shineColor"
          :spread="spread"
          :direction="direction"
          :yoyo="yoyo"
          :pause-on-hover="pauseOnHover"
          :disabled="disabled"
        />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSlider title="Speed" v-model="speed" :min="0.5" :max="5" :step="0.1" value-unit="s" />
        <PreviewSlider title="Delay" v-model="delay" :min="0" :max="3" :step="0.1" value-unit="s" />
        <PreviewSlider title="Spread" v-model="spread" :min="0" :max="180" :step="5" value-unit="deg" />
        <PreviewColorPicker title="Color" v-model="color" />
        <PreviewColorPicker title="Shine Color" v-model="shineColor" />
        <PreviewSelect title="Direction" v-model="direction" :options="['left', 'right']" />
        <PreviewSwitch title="Yoyo Mode" v-model="yoyo" />
        <PreviewSwitch title="Pause on Hover" v-model="pauseOnHover" />
        <PreviewSwitch title="Disabled" v-model="disabled" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="shiny-text" :usage="shinyText.usage!" :source="shinyTextSource" />
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
import { shinyText } from '@/constants/code/TextAnimations/shinyTextCode';
import ShinyText from '@/content/TextAnimations/ShinyText/ShinyText.vue';
import shinyTextSource from '@/content/TextAnimations/ShinyText/ShinyText.vue?raw';
import { computed, ref } from 'vue';

const { forceRerender } = useForceRerender();

const DEFAULTS = {
  speed: 2,
  delay: 0,
  color: '#b5b5b5',
  shineColor: '#ffffff',
  spread: 120,
  direction: 'left' as 'left' | 'right',
  yoyo: false,
  pauseOnHover: false,
  disabled: false
};

const speed = ref(DEFAULTS.speed);
const delay = ref(DEFAULTS.delay);
const color = ref(DEFAULTS.color);
const shineColor = ref(DEFAULTS.shineColor);
const spread = ref(DEFAULTS.spread);
const direction = ref<'left' | 'right'>(DEFAULTS.direction);
const yoyo = ref(DEFAULTS.yoyo);
const pauseOnHover = ref(DEFAULTS.pauseOnHover);
const disabled = ref(DEFAULTS.disabled);

const hasChanges = computed(
  () =>
    speed.value !== DEFAULTS.speed ||
    delay.value !== DEFAULTS.delay ||
    color.value !== DEFAULTS.color ||
    shineColor.value !== DEFAULTS.shineColor ||
    spread.value !== DEFAULTS.spread ||
    direction.value !== DEFAULTS.direction ||
    yoyo.value !== DEFAULTS.yoyo ||
    pauseOnHover.value !== DEFAULTS.pauseOnHover ||
    disabled.value !== DEFAULTS.disabled
);

function reset() {
  speed.value = DEFAULTS.speed;
  delay.value = DEFAULTS.delay;
  color.value = DEFAULTS.color;
  shineColor.value = DEFAULTS.shineColor;
  spread.value = DEFAULTS.spread;
  direction.value = DEFAULTS.direction;
  yoyo.value = DEFAULTS.yoyo;
  pauseOnHover.value = DEFAULTS.pauseOnHover;
  disabled.value = DEFAULTS.disabled;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'text',
    type: 'string',
    default: '-',
    description: 'The text to be displayed with the shiny effect.'
  },
  {
    name: 'color',
    type: 'string',
    default: '"#b5b5b5"',
    description: 'The base color of the text.'
  },
  {
    name: 'shineColor',
    type: 'string',
    default: '"#ffffff"',
    description: 'The color of the shine/highlight effect.'
  },
  {
    name: 'speed',
    type: 'number',
    default: '2',
    description: 'Duration of one animation cycle in seconds.'
  },
  {
    name: 'delay',
    type: 'number',
    default: '0',
    description: 'Pause duration (in seconds) between animation cycles.'
  },
  {
    name: 'spread',
    type: 'number',
    default: '120',
    description: 'The angle (in degrees) of the gradient spread.'
  },
  {
    name: 'yoyo',
    type: 'boolean',
    default: 'false',
    description: 'If true, the animation reverses direction instead of looping.'
  },
  {
    name: 'pauseOnHover',
    type: 'boolean',
    default: 'false',
    description: 'Pauses the animation when the user hovers over the text.'
  },
  {
    name: 'direction',
    type: "'left' | 'right'",
    default: '"left"',
    description: 'The direction the shine moves across the text.'
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Disables the shiny effect when set to true.'
  },
  {
    name: 'className',
    type: 'string',
    default: "''",
    description: 'Adds custom classes to the root element.'
  }
];
</script>

<style scoped>
.shiny-button {
  padding: 12px 24px;
  border-radius: 50px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.shiny-button:hover {
  transform: translateY(-2px);
}

.shiny-text-demo {
  font-weight: 600;
}
</style>
