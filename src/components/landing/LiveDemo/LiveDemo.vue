<script setup lang="ts">
import logo from '@/assets/logos/vue-bits-logo-small.svg';
import { useNearOnce } from '@/composables/useNearOnce';
import { useColorMode } from '@/composables/useTheme';
import { ArrowUpRight } from 'lucide-vue-next';
import { computed, defineAsyncComponent, ref, type Component } from 'vue';
import { vReveal } from '../reveal';
import './LiveDemo.css';

const MODULES = import.meta.glob([
  '/src/content/Backgrounds/MicroSlats/MicroSlats.vue',
  '/src/content/Animations/ElectricLogo/ElectricLogo.vue',
  '/src/content/TextAnimations/TechText/TechText.vue',
  '/src/content/Components/CircularCarousel/CircularCarousel.vue',
  '/src/content/Micro/HoldButton/HoldButton.vue'
]);

const load = (path: string): Component | null => {
  const loader = MODULES[path] as (() => Promise<{ default: Component }>) | undefined;
  return loader ? defineAsyncComponent(loader) : null;
};

const MicroSlats = load('/src/content/Backgrounds/MicroSlats/MicroSlats.vue');
const ElectricLogo = load('/src/content/Animations/ElectricLogo/ElectricLogo.vue');
const TechText = load('/src/content/TextAnimations/TechText/TechText.vue');
const CircularCarousel = load('/src/content/Components/CircularCarousel/CircularCarousel.vue');
const HoldButton = load('/src/content/Micro/HoldButton/HoldButton.vue');

const WELL = { dark: '#0c0e0c', light: '#ffffff' };

type Card = {
  key: string;
  category: string;
  component: string;
  poster: string | null;
  href: string;
  span: number;
  tall?: boolean;
  live: Component | null;
};

const CARDS: Card[] = [
  {
    key: 'slats',
    category: 'Backgrounds',
    component: 'Micro Slats',
    poster: 'microslats',
    href: '/backgrounds/micro-slats',
    span: 7,
    tall: true,
    live: MicroSlats
  },
  {
    key: 'electric',
    category: 'Animations',
    component: 'Electric Logo',
    poster: null,
    href: '/animations/electric-logo',
    span: 5,
    tall: true,
    live: ElectricLogo
  },
  {
    key: 'tech',
    category: 'Text Animations',
    component: 'Tech Text',
    poster: 'techtext',
    href: '/text-animations/tech-text',
    span: 4,
    live: TechText
  },
  {
    key: 'carousel',
    category: 'Components',
    component: 'Circular Carousel',
    poster: 'circularcarousel',
    href: '/components/circular-carousel',
    span: 5,
    live: CircularCarousel
  },
  {
    key: 'hold',
    category: 'Micro',
    component: 'Hold Button',
    poster: 'holdbutton',
    href: '/micro/hold-button',
    span: 3,
    live: HoldButton
  }
];

const { isLight } = useColorMode();
const light = computed(() => isLight.value);
const sectionRef = ref<HTMLElement | null>(null);
const near = useNearOnce(sectionRef);
const lite = computed(() => near.value && document.documentElement.hasAttribute('data-lite'));

const posterFor = (card: Card) =>
  card.poster ? `/assets/videos/${card.poster}${light.value ? '-light' : ''}.webp` : null;
</script>

<template>
  <section ref="sectionRef" class="ln-demo-section">
    <div class="ln-demo-inner">
      <h2 class="ln-demo-title">See them in action</h2>

      <div class="ln-demo-grid">
        <article
          v-for="(card, i) in CARDS"
          :key="card.component"
          v-reveal="i * 0.07"
          :class="['ln-demo-card', `ln-demo-card--span-${card.span}`, { 'ln-demo-card--tall': card.tall }]"
        >
          <div class="ln-demo-well">
            <template v-if="lite || !card.live">
              <img
                v-if="posterFor(card)"
                class="ln-demo-poster"
                :src="posterFor(card) ?? undefined"
                alt=""
                loading="lazy"
                decoding="async"
              />
              <div v-else class="ln-demo-center">
                <img class="ln-demo-mark" :src="logo" alt="" />
              </div>
            </template>
            <template v-else-if="near">
              <component
                :is="card.live"
                v-if="card.key === 'slats'"
                preset="swell"
                :color="light ? '#4f5550' : '#9ea59f'"
                :glint-color="light ? '#161816' : '#ffffff'"
                :background-color="light ? WELL.light : WELL.dark"
              />
              <component
                :is="card.live"
                v-else-if="card.key === 'electric'"
                :src="logo"
                :theme="light ? 'light' : 'dark'"
                :color="light ? '#252825' : '#f2f4f2'"
                glow-color="#9ea59f"
                :scale="0.5"
              />
              <component
                :is="card.live"
                v-else-if="card.key === 'tech'"
                text="Bits"
                :font-size="120"
                :color="light ? '#161816' : '#ffffff'"
                :accent-color="light ? '#161816' : '#ffffff'"
              />
              <component
                :is="card.live"
                v-else-if="card.key === 'carousel'"
                :card-width="132"
                :fade-color="light ? WELL.light : WELL.dark"
              />
              <div v-else class="ln-demo-center">
                <component
                  :is="card.live"
                  done-label="Confirmed"
                  :background-color="light ? '#e3e6e3' : '#252825'"
                  :fill-color="light ? '#161816' : '#f2f4f2'"
                  :text-color="light ? '#3a3f3b' : '#f5f5f5'"
                  :fill-text-color="light ? '#ffffff' : '#111111'"
                >
                  Hold to confirm
                </component>
              </div>
            </template>
          </div>
          <RouterLink :to="card.href" class="ln-demo-caption">
            <span class="ln-demo-caption-name">{{ card.component }}</span>
            <span class="ln-demo-caption-meta">
              {{ card.category }}
              <ArrowUpRight :size="14" aria-hidden="true" />
            </span>
          </RouterLink>
        </article>
      </div>
    </div>
  </section>
</template>
