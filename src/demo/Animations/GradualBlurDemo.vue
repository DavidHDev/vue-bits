<template>
  <TabbedLayout>
    <template #preview>
      <div class="demo-container demo-container-dots h-[500px] overflow-hidden">
        <div
          ref="scrollRef"
          class="relative flex flex-col items-center px-6 py-[100px] w-full h-full overflow-x-hidden overflow-y-auto scrollContainer"
        >
          <p class="z-0 font-bold text-[#9EF2AC] text-[clamp(2rem,4vw,5rem)]">Scroll Down.</p>
          <img
            src="https://images.unsplash.com/photo-1708778002586-37c4f23b7f3f?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            class="brightness-200 grayscale-0 my-[100px] border border-[#1E3921] rounded-[50px] w-full max-w-[600px] filter"
            alt="Lighthouse in the distance with green colors."
          />
          <p class="z-0 font-bold text-[#9EF2AC] text-[clamp(2rem,4vw,5rem)]">Gradual Blur</p>
        </div>

        <GradualBlur
          v-bind="blurProps"
          :style="{
            zIndex: 10,
            width: blurProps.position === 'left' || blurProps.position === 'right' ? '8rem' : '100%',
            height: blurProps.position === 'top' || blurProps.position === 'bottom' ? blurProps.height : '100%'
          }"
        />
      </div>

      <Customize>
        <PreviewSelect title="Position" v-model="blurProps.position" :options="positionOptions" />
        <PreviewSwitch title="Exponential" v-model="blurProps.exponential" />
        <PreviewSlider title="Strength" :min="1" :max="5" :step="0.5" v-model="blurProps.strength" />
        <PreviewSlider title="Div Count" :min="1" :max="10" :step="1" v-model="blurProps.divCount" />
        <PreviewSlider title="Opacity" :min="0.1" :max="1" :step="0.1" v-model="blurProps.opacity" />
      </Customize>

      <PropTable :data="propData" />
      <Dependencies :dependency-list="['mathjs']" />
    </template>

    <template #code>
      <CodeExample :code-object="gradualBlur" />
    </template>

    <template #cli>
      <CliInstallation :command="gradualBlur.cli" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import { gradualBlur } from '@/constants/code/Animations/gradualBlurCode';
import Lenis from 'lenis';
import { onBeforeMount, onMounted, reactive, useTemplateRef } from 'vue';
import CliInstallation from '../../components/code/CliInstallation.vue';
import CodeExample from '../../components/code/CodeExample.vue';
import Dependencies from '../../components/code/Dependencies.vue';
import Customize from '../../components/common/Customize.vue';
import PreviewSelect from '../../components/common/PreviewSelect.vue';
import PreviewSlider from '../../components/common/PreviewSlider.vue';
import PreviewSwitch from '../../components/common/PreviewSwitch.vue';
import PropTable from '../../components/common/PropTable.vue';
import TabbedLayout from '../../components/common/TabbedLayout.vue';
import GradualBlur, { type GradualBlurProps } from '../../content/Animations/GradualBlur/GradualBlur.vue';

const positionOptions = [
  { label: 'Top', value: 'top' },
  { label: 'Bottom', value: 'bottom' }
];

const blurProps = reactive<GradualBlurProps>({
  position: 'bottom',
  strength: 2,
  height: '7rem',
  divCount: 5,
  curve: 'bezier',
  target: 'parent',
  exponential: true,
  opacity: 1
});

const scrollRef = useTemplateRef('scrollRef');

let cleanup: (() => void) | null = null;

onMounted(() => {
  const el = scrollRef.value;
  if (!el) return;

  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (isTouch || isReducedMotion) return;

  const lenis = new Lenis({
    wrapper: el,
    content: el.firstElementChild ?? el,
    duration: 2,
    smoothWheel: true,
    touchMultiplier: 1.2,
    wheelMultiplier: 1,
    lerp: 0.1
  });

  let rafId: number | undefined;
  const raf = (time: number) => {
    lenis.raf(time);
    rafId = requestAnimationFrame(raf);
  };
  rafId = requestAnimationFrame(raf);

  cleanup = () => {
    if (rafId) cancelAnimationFrame(rafId);
    lenis.destroy();
  };
});

onBeforeMount(() => {
  cleanup?.();
});

const propData = [
  {
    name: 'position',
    type: `"top" | "bottom" | "left" | "right"`,
    default: `"bottom"`,
    description: 'Edge to attach the blur overlay.'
  },
  {
    name: 'strength',
    type: 'number',
    default: '2',
    description: 'Base blur strength multiplier (affects each layer).'
  },
  {
    name: 'height',
    type: 'string',
    default: `"6rem"`,
    description: 'Overlay height (for top / bottom positions).'
  },
  {
    name: 'width',
    type: 'string',
    default: '—',
    description:
      'Custom width (optional). Defaults to 100% for vertical positions or matches height for horizontal positions.'
  },
  {
    name: 'divCount',
    type: 'number',
    default: '5',
    description: 'Number of stacked blur layers (higher = smoother gradient).'
  },
  {
    name: 'exponential',
    type: 'boolean',
    default: 'false',
    description: 'Use exponential progression for stronger end blur.'
  },
  {
    name: 'curve',
    type: `"linear" | "bezier" | "ease-in"`,
    default: `"linear"`,
    description: 'Distribution curve applied to layer progression.'
  },
  {
    name: 'opacity',
    type: 'number',
    default: '1',
    description: 'Opacity applied to each blur layer.'
  },
  {
    name: 'animated',
    type: `"boolean" | "scroll"`,
    default: 'false',
    description: 'Fade in (true) or reveal on scroll ("scroll").'
  },
  {
    name: 'duration',
    type: 'string',
    default: `"0.3s"`,
    description: 'Animation duration (when animated).'
  },
  {
    name: 'easing',
    type: 'string',
    default: `"ease-out"`,
    description: 'Animation easing (opacity / backdrop-filter).'
  },
  {
    name: 'hoverIntensity',
    type: 'number',
    default: '—',
    description: 'Multiplier applied to strength while hovered.'
  },
  {
    name: 'target',
    type: `"parent" | "page"`,
    default: `"parent"`,
    description: 'Position relative to parent container or the entire page (fixed).'
  },
  {
    name: 'preset',
    type: `"top" | "bottom" | "left" | "right"`,
    default: '—',
    description: 'Apply a predefined configuration bundle.'
  },
  {
    name: 'responsive',
    type: 'boolean',
    default: 'false',
    description: 'Enable internal responsive recalculation (experimental).'
  },
  {
    name: 'zIndex',
    type: 'number',
    default: '1000',
    description: 'Base z-index (page target adds +100).'
  },
  {
    name: 'onAnimationComplete',
    type: '() => void',
    default: '—',
    description: 'Callback fired after animated reveal completes.'
  },
  {
    name: 'className',
    type: 'string',
    default: '—',
    description: 'Additional class names appended to root element.'
  },
  {
    name: 'style',
    type: 'CSSProperties',
    default: '—',
    description: 'Inline style overrides merged into container style.'
  }
];
</script>

<style scoped>
.scrollContainer {
  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
  -ms-overflow-style: none;
}
</style>
