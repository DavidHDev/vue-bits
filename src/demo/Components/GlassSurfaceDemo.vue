<template>
  <h1 class="sub-category">Glass Surface</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="glassSurface.usage"
    :source="glassSurfaceSource"
    component-name="GlassSurface"
    :props-table="props"
  >
    <template #preview>
      <div class="relative h-[500px] overflow-y-auto no-scrollbar demo-container" ref="scrollContainerRef">
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

        <div class="top-0 right-0 left-0 absolute flex flex-col items-center gap-6">
          <div class="top-12 z-0 absolute font-bold text-[#333] text-4xl text-center whitespace-nowrap translate-y-1/2">
            Try scrolling.
          </div>

          <div class="w-full h-60" />

          <div v-for="(item, index) in imageBlocks" :key="index" class="relative py-4">
            <img :src="item.src" class="grayscale-100 rounded-2xl w-128 object-cover" />
            <div
              class="top-1/2 left-1/2 absolute min-w-72 font-extrabold text-[3rem] text-white text-center leading-[100%] -translate-x-1/2 -translate-y-1/2 mix-blend-overlay"
            >
              {{ item.text }}
            </div>
          </div>

          <div class="w-full h-60" />
        </div>
      </div>
    </template>

    <template #customize>
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
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="glass-surface" :usage="glassSurface.usage!" :source="glassSurfaceSource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { glassSurface } from '@/constants/code/Components/glassSurfaceCode';
import GlassSurface from '@/content/Components/GlassSurface/GlassSurface.vue';
import glassSurfaceSource from '@/content/Components/GlassSurface/GlassSurface.vue?raw';
import Lenis from 'lenis';
import { computed, onMounted, onUnmounted, ref, useTemplateRef } from 'vue';

const { rerenderKey: key, forceRerender } = useForceRerender();

const scrollContainerRef = useTemplateRef<HTMLElement>('scrollContainerRef');
let lenis: Lenis | null = null;
let rafId: number | null = null;

const DEFAULTS = {
  borderRadius: 50,
  borderWidth: 0.07,
  brightness: 50,
  opacity: 0.93,
  blur: 11,
  displace: 0.5,
  backgroundOpacity: 0.1,
  saturation: 1,
  distortionScale: -180,
  redOffset: 0,
  greenOffset: 10,
  blueOffset: 20
};

const borderRadius = ref(DEFAULTS.borderRadius);
const backgroundOpacity = ref(DEFAULTS.backgroundOpacity);
const saturation = ref(DEFAULTS.saturation);
const borderWidth = ref(DEFAULTS.borderWidth);
const brightness = ref(DEFAULTS.brightness);
const opacity = ref(DEFAULTS.opacity);
const blur = ref(DEFAULTS.blur);
const displace = ref(DEFAULTS.displace);
const distortionScale = ref(DEFAULTS.distortionScale);
const redOffset = ref(DEFAULTS.redOffset);
const greenOffset = ref(DEFAULTS.greenOffset);
const blueOffset = ref(DEFAULTS.blueOffset);

const hasChanges = computed(
  () =>
    borderRadius.value !== DEFAULTS.borderRadius ||
    backgroundOpacity.value !== DEFAULTS.backgroundOpacity ||
    saturation.value !== DEFAULTS.saturation ||
    borderWidth.value !== DEFAULTS.borderWidth ||
    brightness.value !== DEFAULTS.brightness ||
    opacity.value !== DEFAULTS.opacity ||
    blur.value !== DEFAULTS.blur ||
    displace.value !== DEFAULTS.displace ||
    distortionScale.value !== DEFAULTS.distortionScale ||
    redOffset.value !== DEFAULTS.redOffset ||
    greenOffset.value !== DEFAULTS.greenOffset ||
    blueOffset.value !== DEFAULTS.blueOffset
);

function reset() {
  borderRadius.value = DEFAULTS.borderRadius;
  backgroundOpacity.value = DEFAULTS.backgroundOpacity;
  saturation.value = DEFAULTS.saturation;
  borderWidth.value = DEFAULTS.borderWidth;
  brightness.value = DEFAULTS.brightness;
  opacity.value = DEFAULTS.opacity;
  blur.value = DEFAULTS.blur;
  displace.value = DEFAULTS.displace;
  distortionScale.value = DEFAULTS.distortionScale;
  redOffset.value = DEFAULTS.redOffset;
  greenOffset.value = DEFAULTS.greenOffset;
  blueOffset.value = DEFAULTS.blueOffset;
  forceRerender();
}

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

const props: PropRow[] = [
  {
    name: 'children',
    type: 'slot',
    default: 'undefined',
    description: 'Content to display inside the glass surface'
  },
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
