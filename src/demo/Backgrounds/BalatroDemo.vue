<template>
  <h1 class="sub-category">Balatro</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="balatro.usage"
    :source="balatroSource"
    component-name="Balatro"
    :props-table="props"
  >
    <template #preview>
      <div class="relative h-[500px] overflow-hidden demo-container">
        <Balatro
          :is-rotate="isRotate"
          :mouse-interaction="mouseInteractionEnabled"
          :pixel-filter="pixelFilter"
          :color1="color1"
          :color2="color2"
          :color3="color3"
        />
        <BackgroundContent pillText="New Background" headline="Spin the world however you like" />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewColorPicker title="Color 1" v-model="color1" />
        <PreviewColorPicker title="Color 2" v-model="color2" />
        <PreviewColorPicker title="Color 3" v-model="color3" />
        <PreviewSlider title="Pixelation" v-model="pixelFilter" :min="0" :max="2000" :step="10" />
        <PreviewSwitch title="Enable Mouse Interaction" v-model="mouseInteractionEnabled" />
        <PreviewSwitch title="Rotate" v-model="isRotate" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="balatro" :usage="balatro.usage!" :source="balatroSource" />
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
import { balatro } from '@/constants/code/Backgrounds/balatroCode';
import Balatro from '@/content/Backgrounds/Balatro/Balatro.vue';
import balatroSource from '@/content/Backgrounds/Balatro/Balatro.vue?raw';
import { computed, ref } from 'vue';

const { forceRerender } = useForceRerender();

const DEFAULTS = {
  color1: '#DE443B',
  color2: '#006BB4',
  color3: '#162325',
  isRotate: false,
  mouseInteraction: true,
  pixelFilter: 745.0
};

const color1 = ref(DEFAULTS.color1);
const color2 = ref(DEFAULTS.color2);
const color3 = ref(DEFAULTS.color3);
const isRotate = ref(DEFAULTS.isRotate);
const mouseInteractionEnabled = ref(DEFAULTS.mouseInteraction);
const pixelFilter = ref(DEFAULTS.pixelFilter);

const hasChanges = computed(
  () =>
    color1.value !== DEFAULTS.color1 ||
    color2.value !== DEFAULTS.color2 ||
    color3.value !== DEFAULTS.color3 ||
    isRotate.value !== DEFAULTS.isRotate ||
    mouseInteractionEnabled.value !== DEFAULTS.mouseInteraction ||
    pixelFilter.value !== DEFAULTS.pixelFilter
);

function reset() {
  color1.value = DEFAULTS.color1;
  color2.value = DEFAULTS.color2;
  color3.value = DEFAULTS.color3;
  isRotate.value = DEFAULTS.isRotate;
  mouseInteractionEnabled.value = DEFAULTS.mouseInteraction;
  pixelFilter.value = DEFAULTS.pixelFilter;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'spinRotation',
    type: 'number',
    default: '-2.0',
    description: 'Base rotation amount affecting the shader effect.'
  },
  {
    name: 'spinSpeed',
    type: 'number',
    default: '7.0',
    description: 'Speed of the spin animation.'
  },
  {
    name: 'offset',
    type: '[number, number]',
    default: '[0.0, 0.0]',
    description: 'Offset for the shader effect.'
  },
  {
    name: 'color1',
    type: 'string',
    default: '"#DE443B"',
    description: 'Primary color in HEX format.'
  },
  {
    name: 'color2',
    type: 'string',
    default: '"#006BB4"',
    description: 'Secondary color in HEX format.'
  },
  {
    name: 'color3',
    type: 'string',
    default: '"#162325"',
    description: 'Tertiary color in HEX format.'
  },
  {
    name: 'contrast',
    type: 'number',
    default: '3.5',
    description: 'Contrast value affecting color blending.'
  },
  {
    name: 'lighting',
    type: 'number',
    default: '0.4',
    description: 'Lighting factor affecting brightness.'
  },
  {
    name: 'spinAmount',
    type: 'number',
    default: '0.25',
    description: 'Amount of spin influence based on UV length.'
  },
  {
    name: 'pixelFilter',
    type: 'number',
    default: '745.0',
    description: 'Pixel filter factor determining pixelation.'
  },
  {
    name: 'spinEase',
    type: 'number',
    default: '1.0',
    description: 'Ease factor for spin.'
  },
  {
    name: 'isRotate',
    type: 'boolean',
    default: 'false',
    description: 'Determines if the shader rotates continuously.'
  },
  {
    name: 'mouseInteraction',
    type: 'boolean',
    default: 'true',
    description: 'Enables or disables mouse interaction for rotation.'
  }
];
</script>
