<template>
  <h1 class="sub-category">Orb</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="orb.usage"
    :source="orbSource"
    component-name="Orb"
    :props-table="props"
  >
    <template #preview>
      <div class="relative p-0 h-[500px] overflow-hidden demo-container">
        <Orb
          :key="rerenderKey"
          :hue="debouncedHue"
          :hover-intensity="debouncedHoverIntensity"
          :rotate-on-hover="rotateOnHover"
          :force-hover-state="forceHoverState"
          :background-color="backgroundColor"
        />
        <BackgroundContent pill-text="New Background" headline="This orb is hiding something, try hovering!" />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSlider title="Hue Shift" :min="0" :max="360" :step="1" v-model="hue" />
        <PreviewSlider title="Hover Intensity" :min="0" :max="5" :step="0.01" v-model="hoverIntensity" />
        <PreviewSwitch title="Rotate on Hover" v-model="rotateOnHover" />
        <PreviewSwitch title="Force Hover State" v-model="forceHoverState" />
        <PreviewColorPicker title="Orb Background Color" v-model="backgroundColor" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="orb" :usage="orb.usage!" :source="orbSource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import BackgroundContent from '@/components/common/BackgroundContent.vue';
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewColorPicker from '@/components/common/PreviewColorPicker.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { orb } from '@/constants/code/Backgrounds/orbCode';
import Orb from '@/content/Backgrounds/Orb/Orb.vue';
import orbSource from '@/content/Backgrounds/Orb/Orb.vue?raw';
import { computed, ref, watch } from 'vue';

const { rerenderKey, forceRerender } = useForceRerender();

const DEFAULTS = {
  hue: 0,
  hoverIntensity: 2,
  rotateOnHover: true,
  forceHoverState: false,
  backgroundColor: '#000000'
};

const hue = ref(DEFAULTS.hue);
const hoverIntensity = ref(DEFAULTS.hoverIntensity);
const rotateOnHover = ref(DEFAULTS.rotateOnHover);
const forceHoverState = ref(DEFAULTS.forceHoverState);
const backgroundColor = ref(DEFAULTS.backgroundColor);

const debouncedHue = ref(DEFAULTS.hue);
const debouncedHoverIntensity = ref(DEFAULTS.hoverIntensity);

let hueTimeout: ReturnType<typeof setTimeout>;
let hoverIntensityTimeout: ReturnType<typeof setTimeout>;

watch(hue, newValue => {
  clearTimeout(hueTimeout);
  hueTimeout = setTimeout(() => {
    debouncedHue.value = newValue;
  }, 300);
});

watch(hoverIntensity, newValue => {
  clearTimeout(hoverIntensityTimeout);
  hoverIntensityTimeout = setTimeout(() => {
    debouncedHoverIntensity.value = newValue;
  }, 300);
});

const hasChanges = computed(
  () =>
    hue.value !== DEFAULTS.hue ||
    hoverIntensity.value !== DEFAULTS.hoverIntensity ||
    rotateOnHover.value !== DEFAULTS.rotateOnHover ||
    forceHoverState.value !== DEFAULTS.forceHoverState ||
    backgroundColor.value !== DEFAULTS.backgroundColor
);

function reset() {
  hue.value = DEFAULTS.hue;
  hoverIntensity.value = DEFAULTS.hoverIntensity;
  rotateOnHover.value = DEFAULTS.rotateOnHover;
  forceHoverState.value = DEFAULTS.forceHoverState;
  backgroundColor.value = DEFAULTS.backgroundColor;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'hue',
    type: 'number',
    default: '0',
    description: 'The base hue for the orb (in degrees).'
  },
  {
    name: 'hoverIntensity',
    type: 'number',
    default: '0.2',
    description: 'Controls the intensity of the hover distortion effect.'
  },
  {
    name: 'rotateOnHover',
    type: 'boolean',
    default: 'true',
    description: 'Toggle to enable or disable continuous rotation on hover.'
  },
  {
    name: 'forceHoverState',
    type: 'boolean',
    default: 'false',
    description: 'Force hover animations even when the orb is not actually hovered.'
  },
  {
    name: 'backgroundColor',
    type: 'string',
    default: '#000000',
    description: 'The background color of the container.'
  }
];
</script>
