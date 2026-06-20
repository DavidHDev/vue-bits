<template>
  <h1 class="sub-category">Sticker Peel</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="stickerPeel.usage"
    :source="stickerPeelSource"
    component-name="StickerPeel"
    :props-table="props"
  >
    <template #preview>
      <div
        class="relative bg-[linear-gradient(to_bottom,_var(--border-primary),_var(--bg-elevated),_var(--bg-elevated),_var(--border-primary))]! h-[400px] overflow-hidden demo-container"
      >
        <StickerPeel
          :image-src="logo"
          :rotate="rotate"
          :width="width"
          :peel-back-hover-pct="peelBackHoverPct"
          :peel-back-active-pct="peelBackActivePct"
          :lighting-intensity="lightingIntensity"
          :shadow-intensity="shadowIntensity"
          :peel-direction="peelDirection"
          class-name="z-2 absolute"
        />

        <p
          class="top-[1em] left-1/2 z-0 absolute font-black text-[#222] text-[clamp(1.5rem,4vw,3rem)] -translate-x-1/2 transform"
        >
          Try dragging it!
        </p>
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSlider title="Peel Direction" :min="0" :max="360" :step="1" value-unit="°" v-model="peelDirection" />
        <PreviewSlider title="Rotate" :min="0" :max="60" :step="1" value-unit="°" v-model="rotate" />
        <PreviewSlider title="Width" :min="100" :max="300" :step="10" value-unit="px" v-model="width" />
        <PreviewSlider title="Peel Hover %" :min="0" :max="50" :step="1" value-unit="%" v-model="peelBackHoverPct" />
        <PreviewSlider title="Peel Active %" :min="0" :max="70" :step="1" value-unit="%" v-model="peelBackActivePct" />
        <PreviewSlider title="Lighting Intensity" :min="0" :max="0.5" :step="0.01" v-model="lightingIntensity" />
        <PreviewSlider title="Shadow Intensity" :min="0" :max="1" :step="0.01" v-model="shadowIntensity" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="animated-content" :usage="stickerPeel.usage!" :source="stickerPeelSource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import logo from '@/assets/logos/vue-bits-sticker.png';
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { stickerPeel } from '@/constants/code/Animations/stickerPeelCode';
import StickerPeel from '@/content/Animations/StickerPeel/StickerPeel.vue';
import stickerPeelSource from '@/content/Animations/StickerPeel/StickerPeel.vue?raw';
import { computed, ref } from 'vue';

const { forceRerender } = useForceRerender();

const DEFAULTS = {
  rotate: 0,
  width: 200,
  peelBackHoverPct: 30,
  peelBackActivePct: 40,
  lightingIntensity: 0.1,
  shadowIntensity: 0.5,
  peelDirection: 0
};

const rotate = ref(DEFAULTS.rotate);
const width = ref(DEFAULTS.width);
const peelBackHoverPct = ref(DEFAULTS.peelBackHoverPct);
const peelBackActivePct = ref(DEFAULTS.peelBackActivePct);
const lightingIntensity = ref(DEFAULTS.lightingIntensity);
const shadowIntensity = ref(DEFAULTS.shadowIntensity);
const peelDirection = ref(DEFAULTS.peelDirection);

const hasChanges = computed(
  () =>
    rotate.value !== DEFAULTS.rotate ||
    width.value !== DEFAULTS.width ||
    peelBackHoverPct.value !== DEFAULTS.peelBackHoverPct ||
    peelBackActivePct.value !== DEFAULTS.peelBackActivePct ||
    lightingIntensity.value !== DEFAULTS.lightingIntensity ||
    shadowIntensity.value !== DEFAULTS.shadowIntensity ||
    peelDirection.value !== DEFAULTS.peelDirection
);

function reset() {
  rotate.value = DEFAULTS.rotate;
  width.value = DEFAULTS.width;
  peelBackHoverPct.value = DEFAULTS.peelBackHoverPct;
  peelBackActivePct.value = DEFAULTS.peelBackActivePct;
  lightingIntensity.value = DEFAULTS.lightingIntensity;
  shadowIntensity.value = DEFAULTS.shadowIntensity;
  peelDirection.value = DEFAULTS.peelDirection;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'imageSrc',
    type: 'string',
    default: 'required',
    description: 'The source URL for the sticker image'
  },
  {
    name: 'rotate',
    type: 'number',
    default: '30',
    description: 'The rotation angle in degrees when dragging'
  },
  {
    name: 'peelBackHoverPct',
    type: 'number',
    default: '30',
    description: 'Percentage of peel effect on hover (0-100)'
  },
  {
    name: 'peelBackActivePct',
    type: 'number',
    default: '40',
    description: 'Percentage of peel effect when active/clicked (0-100)'
  },
  {
    name: 'peelDirection',
    type: 'number',
    default: '0',
    description: 'Direction of the peel effect in degrees (0-360)'
  },
  {
    name: 'peelEasing',
    type: 'string',
    default: 'power3.out',
    description: 'GSAP easing function for peel animations'
  },
  {
    name: 'peelHoverEasing',
    type: 'string',
    default: 'power2.out',
    description: 'GSAP easing function for hover transitions'
  },
  {
    name: 'width',
    type: 'number',
    default: '200',
    description: 'Width of the sticker in pixels'
  },
  {
    name: 'shadowIntensity',
    type: 'number',
    default: '0.6',
    description: 'Intensity of the shadow effect (0-1)'
  },
  {
    name: 'lightingIntensity',
    type: 'number',
    default: '0.1',
    description: 'Intensity of the lighting effect (0-1)'
  },
  {
    name: 'initialPosition',
    type: 'string',
    default: 'center',
    description: "Initial position of the sticker ('center', 'top-left', 'top-right', 'bottom-left', 'bottom-right')"
  },
  {
    name: 'className',
    type: 'string',
    default: '',
    description: 'Custom class name for additional styling'
  }
];
</script>
