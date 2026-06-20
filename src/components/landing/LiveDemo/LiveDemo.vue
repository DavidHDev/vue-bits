<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue';
import { onMounted, ref } from 'vue';

import DemoPlaceholder from './DemoPlaceholder.vue';

import './LiveDemo.css';

type Variant = 'shapegrid' | 'magicrings' | 'shinytext' | 'dock';

type Card = {
  variant: Variant;
  category: string;
  component: string;
  href: string;
  span: 7 | 5 | 4 | 8;
  tall?: boolean;
};

const CARDS: Card[] = [
  {
    variant: 'shapegrid',
    category: 'Backgrounds',
    component: 'ShapeGrid',
    href: '/backgrounds/shape-grid',
    span: 7,
    tall: true
  },
  {
    variant: 'magicrings',
    category: 'Animations',
    component: 'MagicRings',
    href: '/animations/magic-rings',
    span: 5,
    tall: true
  },
  {
    variant: 'shinytext',
    category: 'Text Animations',
    component: 'ShinyText',
    href: '/text-animations/shiny-text',
    span: 4
  },
  {
    variant: 'dock',
    category: 'Components',
    component: 'Dock',
    href: '/components/dock',
    span: 8
  }
];

const visible = ref<boolean[]>(Array(CARDS.length).fill(false));

const cardEls = ref<(HTMLElement | null)[]>(Array(CARDS.length).fill(null));

function setCardRef(el: Element | ComponentPublicInstance | null, index: number) {
  cardEls.value[index] = el as HTMLElement | null;
}

onMounted(() => {
  if (typeof IntersectionObserver === 'undefined') {
    visible.value = visible.value.map(() => true);
    return;
  }

  const io = new IntersectionObserver(
    entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;

        const i = cardEls.value.indexOf(entry.target as HTMLElement);

        if (i === -1) continue;

        visible.value[i] = true;

        io.unobserve(entry.target);
      }
    },
    {
      rootMargin: '-60px 0px'
    }
  );

  for (const el of cardEls.value) {
    if (el) {
      io.observe(el);
    }
  }
});
</script>

<template>
  <section class="ln-demo-section">
    <div class="ln-demo-inner">
      <h2 class="ln-demo-title">See them in action</h2>

      <div class="ln-demo-grid">
        <div
          v-for="(card, i) in CARDS"
          :key="card.variant"
          :ref="el => setCardRef(el, i)"
          :class="[
            'ln-demo-card',
            `ln-demo-card--span-${card.span}`,
            {
              'ln-demo-card--tall': card.tall,
              'is-visible': visible[i]
            }
          ]"
          :style="{
            transitionDelay: `${i * 70}ms`
          }"
        >
          <a :href="card.href" class="ln-demo-card-link">
            <div class="ln-demo-card-visual">
              <DemoPlaceholder :variant="card.variant" :active="visible[i]" />
            </div>

            <div class="ln-demo-card-overlay">
              <span class="ln-demo-card-category">
                {{ card.category }}
              </span>

              <span class="ln-demo-card-name">
                {{ card.component }}
              </span>
            </div>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>
