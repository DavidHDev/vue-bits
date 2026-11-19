<script setup lang="ts">
import { useNearOnce } from '@/composables/useNearOnce';
import { useColorModeValue } from '@/composables/useTheme';
import { TOTAL_COMPONENTS } from '@/constants/Categories';
import { LOOK, presetProps } from '../Hero/gradientLook';
import { ArrowRight } from 'lucide-vue-next';
import { computed, defineAsyncComponent, ref } from 'vue';
import './CTA.css';

const GradientWaves = defineAsyncComponent(() => import('@/content/Backgrounds/GradientWaves/GradientWaves.vue'));

const prefersReducedMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const light = useColorModeValue(true, false);
const cardRef = ref<HTMLElement | null>(null);
const near = useNearOnce(cardRef);
const lite = computed(() => near.value && document.documentElement.hasAttribute('data-lite'));
const look = computed(() => presetProps('dusk', { light: light.value, defaults: LOOK }) as Record<string, unknown>);
</script>

<template>
  <div ref="cardRef" class="ln-cta-card">
    <div v-if="near && !prefersReducedMotion" class="ln-cta-bg" aria-hidden="true">
      <GradientWaves
        v-bind="look"
        :tilt="58"
        :dpr="lite ? 0.75 : 1.25"
        :quality="lite ? 'low' : 'medium'"
        :intro="true"
      />
    </div>
    <h2 class="ln-cta-headline">Build something people remember.</h2>

    <p class="ln-cta-sub">
      Start with the free library: {{ TOTAL_COMPONENTS }} animated components for Vue, ready to copy into your project
      and make your own.
    </p>

    <div class="ln-cta-buttons">
      <RouterLink to="/get-started/index" class="ln-cta-btn ln-cta-btn--primary">
        Browse components
        <ArrowRight :size="15" />
      </RouterLink>
      <a
        href="https://github.com/DavidHDev/vue-bits"
        target="_blank"
        rel="noopener noreferrer"
        class="ln-cta-btn ln-cta-btn--secondary"
      >
        Star on GitHub
      </a>
    </div>
  </div>
</template>
