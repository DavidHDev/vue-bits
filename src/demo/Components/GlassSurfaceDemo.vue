<template>
  <TabbedLayout>
    <template #preview>
      <div class="overflow-y-auto no-scrollbar demo-container h-[500px]" ref="scrollContainerRef">
        <GlassSurface
          :key="key"
          :width="360"
          :height="100"
          :border-radius="borderRadius"
          :background-opacity="backgroundOpacity"
          :saturation="saturation"
          :border-width="borderWidth"
          :brightness="brightness"
          :opacity="opacity"
          :blur="blur"
          :displace="displace"
          :distortion-scale="distortionScale"
          :red-offset="redOffset"
          :green-offset="greenOffset"
          :blue-offset="blueOffset"
          style="position: sticky; top: 50%; transform: translateY(-50%); z-index: 10"
        />

        <div class="absolute flex flex-col items-center gap-6 top-0 left-0 right-0">
          <div class="absolute translate-y-1/2 top-12 text-4xl font-bold text-[#333] z-0 whitespace-nowrap text-center">
            Try scrolling.
          </div>

          <div class="h-60 w-full" />

          <div v-for="(item, index) in imageBlocks" :key="index" class="relative py-4">
            <img :src="item.src" class="w-128 rounded-2xl object-cover grayscale-100" />
            <div
              class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-extrabold text-center leading-[100%] text-[3rem] min-w-72 mix-blend-overlay text-white"
            >
              {{ item.text }}
            </div>
          </div>

          <div class="h-60 w-full" />
        </div>
      </div>

      <Customize>
        <PreviewSlider title="Border Radius" v-model="borderRadius" :min="0" :max="50" :step="1" />
        <PreviewSlider title="Background Opacity" v-model="backgroundOpacity" :min="0" :max="1" :step="0.01" />
        <PreviewSlider title="Saturation" v-model="saturation" :min="0" :max="3" :step="1" />
        <PreviewSlider title="Border Width" v-model="borderWidth" :min="0" :max="0.2" :step="0.01" />
        <PreviewSlider title="Brightness" v-model="brightness" :min="0" :max="100" :step="1" />
        <PreviewSlider title="Opacity" v-model="opacity" :min="0" :max="1" :step="0.01" />
        <PreviewSlider title="Blur" v-model="blur" :min="0" :max="30" :step="1" />
        <PreviewSlider title="Displace" v-model="displace" :min="0" :max="5" :step="0.1" />
        <PreviewSlider title="Distortion Scale" v-model="distortionScale" :min="-300" :max="300" :step="1" />
        <PreviewSlider title="Red Offset" v-model="redOffset" :min="-50" :max="50" :step="1" />
        <PreviewSlider title="Green Offset" v-model="greenOffset" :min="-50" :max="50" :step="1" />
        <PreviewSlider title="Blue Offset" v-model="blueOffset" :min="-50" :max="50" :step="1" />
      </Customize>

      <PropTable :data="propData" />
    </template>

    <template #code>
      <CodeExample :code-object="glassSurface" />
    </template>

    <template #cli>
      <CliInstallation :command="glassSurface.cli" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, useTemplateRef } from 'vue';
import Lenis from 'lenis';
import TabbedLayout from '../../components/common/TabbedLayout.vue';
import PropTable from '../../components/common/PropTable.vue';
import CliInstallation from '../../components/code/CliInstallation.vue';
import CodeExample from '../../components/code/CodeExample.vue';
import Customize from '../../components/common/Customize.vue';
import PreviewSlider from '../../components/common/PreviewSlider.vue';
import GlassSurface from '../../content/Components/GlassSurface/GlassSurface.vue';
import { glassSurface } from '@/constants/code/Components/glassSurfaceCode';
import { useForceRerender } from '@/composables/useForceRerender';

const { rerenderKey: key, forceRerender } = useForceRerender();

const scrollContainerRef = useTemplateRef<HTMLElement>('scrollContainerRef');
let lenis: Lenis | null = null;
let rafId: number | null = null;

const borderRadius = ref(50);
const backgroundOpacity = ref(0.1);
const saturation = ref(1);
const borderWidth = ref(0.07);
const brightness = ref(50);
const opacity = ref(0.93);
const blur = ref(11);
const displace = ref(0.5);
const distortionScale = ref(-180);
const redOffset = ref(0);
const greenOffset = ref(10);
const blueOffset = ref(20);

watch(
  () => [
    borderWidth.value,
    brightness.value,
    opacity.value,
    blur.value,
    displace.value,
    distortionScale.value,
    redOffset.value,
    greenOffset.value,
    blueOffset.value
  ],
  () => {
    forceRerender();
  }
);

const initLenis = () => {
  if (!scrollContainerRef.value) return;

  lenis = new Lenis({
    wrapper: scrollContainerRef.value,
    content: scrollContainerRef.value.firstElementChild as HTMLElement,
    duration: 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
    infinite: false
  });

  const raf = (time: number) => {
    lenis?.raf(time);
    rafId = requestAnimationFrame(raf);
  };

  rafId = requestAnimationFrame(raf);
};

const destroyLenis = () => {
  if (rafId) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
  if (lenis) {
    lenis.destroy();
    lenis = null;
  }
};

onMounted(() => {
  initLenis();
});

onUnmounted(() => {
  destroyLenis();
});

const imageBlocks = [
  {
    src: 'https://images.unsplash.com/photo-1500673587002-1d2548cfba1b?q=80&w=1740&auto=format&fit=crop',
    text: 'The Summer Of Glass'
  },
  {
    src: 'https://images.unsplash.com/photo-1594576547505-1be67997401e?q=80&w=1932&auto=format&fit=crop',
    text: 'Can Hold Any Content'
  },
  {
    src: 'https://images.unsplash.com/photo-1543127172-4b33cb699e35?q=80&w=1674&auto=format&fit=crop',
    text: 'Has Built-In Fallback'
  }
];

const propData = [
  {
    name: 'width',
    type: 'number | string',
    default: '200',
    description: "Width of the glass surface (pixels or CSS value like '100%')"
  },
  {
    name: 'height',
    type: 'number | string',
    default: '80',
    description: "Height of the glass surface (pixels or CSS value like '100vh')"
  },
  {
    name: 'borderRadius',
    type: 'number',
    default: '20',
    description: 'Border radius in pixels'
  },
  {
    name: 'borderWidth',
    type: 'number',
    default: '0.07',
    description: 'Border width factor for displacement map'
  },
  {
    name: 'brightness',
    type: 'number',
    default: '50',
    description: 'Brightness percentage for displacement map'
  },
  {
    name: 'opacity',
    type: 'number',
    default: '0.93',
    description: 'Opacity of displacement map elements'
  },
  {
    name: 'blur',
    type: 'number',
    default: '11',
    description: 'Input blur amount in pixels'
  },
  {
    name: 'displace',
    type: 'number',
    default: '0',
    description: 'Output blur (stdDeviation)'
  },
  {
    name: 'backgroundOpacity',
    type: 'number',
    default: '0',
    description: 'Background frost opacity (0-1)'
  },
  {
    name: 'saturation',
    type: 'number',
    default: '1',
    description: 'Backdrop filter saturation factor'
  },
  {
    name: 'distortionScale',
    type: 'number',
    default: '-180',
    description: 'Main displacement scale'
  },
  {
    name: 'redOffset',
    type: 'number',
    default: '0',
    description: 'Red channel extra displacement offset'
  },
  {
    name: 'greenOffset',
    type: 'number',
    default: '10',
    description: 'Green channel extra displacement offset'
  },
  {
    name: 'blueOffset',
    type: 'number',
    default: '20',
    description: 'Blue channel extra displacement offset'
  },
  {
    name: 'xChannel',
    type: "'R' | 'G' | 'B'",
    default: "'R'",
    description: 'X displacement channel selector'
  },
  {
    name: 'yChannel',
    type: "'R' | 'G' | 'B'",
    default: "'G'",
    description: 'Y displacement channel selector'
  },
  {
    name: 'mixBlendMode',
    type: 'BlendMode',
    default: "'difference'",
    description: 'Mix blend mode for displacement map'
  },
  {
    name: 'className',
    type: 'string',
    default: "''",
    description: 'Additional CSS class names'
  },
  {
    name: 'style',
    type: 'CSSProperties',
    default: '{}',
    description: 'Inline styles object'
  }
];
</script>
