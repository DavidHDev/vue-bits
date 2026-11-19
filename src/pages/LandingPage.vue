<template>
  <LandingLoader v-if="!ready" :hiding="hidingLoader" />
  <section
    :class="['landing-wrapper no-side-fades', phase === 'loading' ? 'ln-loading' : 'ln-loaded']"
    :inert="!ready || undefined"
  >
    <Navbar />
    <Hero />
    <Features />
    <LiveDemo />
    <HowItWorks />
    <ProSpotlight />
    <Tools />
    <FAQ />
    <Footer>
      <template #lead>
        <CTA />
      </template>
    </Footer>
  </section>
</template>

<script setup lang="ts">
import CTA from '@/components/landing/CTA/CTA.vue';
import FAQ from '@/components/landing/FAQ/FAQ.vue';
import Features from '@/components/landing/Features/Features.vue';
import Footer from '@/components/landing/Footer/Footer.vue';
import Hero from '@/components/landing/Hero/Hero.vue';
import HowItWorks from '@/components/landing/HowItWorks/HowItWorks.vue';
import LandingLoader from '@/components/landing/LandingLoader/LandingLoader.vue';
import LiveDemo from '@/components/landing/LiveDemo/LiveDemo.vue';
import Navbar from '@/components/landing/Navbar/Navbar.vue';
import ProSpotlight from '@/components/landing/ProSpotlight/ProSpotlight.vue';
import Tools from '@/components/landing/Tools/Tools.vue';
import { usePauseOffscreenAnimations } from '@/composables/usePauseOffscreenAnimations';
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

const MIN_LOADER_MS = 800;
const MAX_FONT_WAIT_MS = 2500;
const LOADER_FADE_MS = 600;

const phase = ref<'loading' | 'revealing' | 'ready'>('loading');
const hidingLoader = ref(false);
const ready = computed(() => phase.value === 'ready');

usePauseOffscreenAnimations(() => phase.value !== 'loading');

let cancelled = false;
let minimumTimer = 0;
let fontTimer = 0;
let firstFrame = 0;
let secondFrame = 0;
let fadeTimer = 0;

watch(
  ready,
  isReady => {
    if (typeof document === 'undefined') return;
    if (isReady) document.documentElement.removeAttribute('data-vb-landing-loading');
    else document.documentElement.setAttribute('data-vb-landing-loading', '');
  },
  { immediate: true }
);

watch(phase, value => {
  if (value !== 'revealing') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    phase.value = 'ready';
    return;
  }
  firstFrame = requestAnimationFrame(() => {
    secondFrame = requestAnimationFrame(() => {
      hidingLoader.value = true;
      fadeTimer = window.setTimeout(() => {
        phase.value = 'ready';
      }, LOADER_FADE_MS);
    });
  });
});

onMounted(() => {
  window.scrollTo(0, 0);
  const started = performance.now();
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fontDeadline = new Promise<void>(resolve => {
    fontTimer = window.setTimeout(resolve, MAX_FONT_WAIT_MS);
  });
  const reveal = () => {
    phase.value = reducedMotion ? 'ready' : 'revealing';
  };

  Promise.race([document.fonts?.ready ?? Promise.resolve(), fontDeadline])
    .catch(() => {})
    .then(() => {
      window.clearTimeout(fontTimer);
      if (cancelled) return;
      const remaining = reducedMotion ? 0 : Math.max(0, MIN_LOADER_MS - (performance.now() - started));
      if (remaining > 0) minimumTimer = window.setTimeout(reveal, remaining);
      else reveal();
    });
});

onBeforeUnmount(() => {
  cancelled = true;
  window.clearTimeout(minimumTimer);
  window.clearTimeout(fontTimer);
  window.clearTimeout(fadeTimer);
  cancelAnimationFrame(firstFrame);
  cancelAnimationFrame(secondFrame);
  document.documentElement.removeAttribute('data-vb-landing-loading');
});
</script>
