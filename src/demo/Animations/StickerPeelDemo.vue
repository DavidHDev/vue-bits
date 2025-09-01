<template>
  <TabbedLayout>
    <template #preview>
      <div
        class="bg-[linear-gradient(to_bottom,_#060010,_#0D0716,_#0D0716,_#060010)] h-[500px] overflow-hidden demo-container"
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

      <Customize>
        <PreviewSlider title="Peel Direction" :min="0" :max="360" :step="1" value-unit="°" v-model="peelDirection" />
        <PreviewSlider title="Rotate" :min="0" :max="60" :step="1" value-unit="°" v-model="rotate" />
        <PreviewSlider title="Width" :min="100" :max="300" :step="10" value-unit="px" v-model="width" />
        <PreviewSlider title="Peel Hover %" :min="0" :max="50" :step="1" value-unit="%" v-model="peelBackHoverPct" />
        <PreviewSlider title="Peel Active %" :min="0" :max="70" :step="1" value-unit="%" v-model="peelBackActivePct" />
        <PreviewSlider title="Lighting Intensity" :min="0" :max="0.5" :step="0.01" v-model="lightingIntensity" />
        <PreviewSlider title="Shadow Intensity" :min="0" :max="1" :step="0.01" v-model="shadowIntensity" />
      </Customize>

      <PropTable :data="propData" />
      <Dependencies :dependency-list="['gsap']" />
    </template>

    <template #code>
      <CodeExample :code-object="stickerPeel" />
    </template>

    <template #cli>
      <CliInstallation :command="stickerPeel.cli" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import CliInstallation from '../../components/code/CliInstallation.vue';
import CodeExample from '../../components/code/CodeExample.vue';
import Dependencies from '../../components/code/Dependencies.vue';
import Customize from '../../components/common/Customize.vue';
import PreviewSlider from '../../components/common/PreviewSlider.vue';
import PropTable from '../../components/common/PropTable.vue';
import TabbedLayout from '../../components/common/TabbedLayout.vue';
import { stickerPeel } from '../../constants/code/Animations/stickerPeelCode';
import StickerPeel from '../../content/Animations/StickerPeel/StickerPeel.vue';
import logo from '../../assets/logos/vue-bits-sticker.png';

const rotate = ref(0);
const width = ref(200);
const peelBackHoverPct = ref(30);
const peelBackActivePct = ref(40);
const lightingIntensity = ref(0.1);
const shadowIntensity = ref(0.5);
const peelDirection = ref(0);

const propData = [
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
