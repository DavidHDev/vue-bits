<script setup lang="ts">
import { onMounted, ref, type ComponentPublicInstance } from 'vue';

import AITerminal from './AITerminal.vue';
import CategorySelector from './CategorySelector.vue';
import ComponentMarquee from './ComponentMarquee.vue';
import StarCard from './StarCard.vue';
import VariantTabs from './VariantTabs.vue';

import './Features.css';

type CardKey = 'marquee' | 'orbit' | 'variants' | 'ai' | 'stars';

interface Card {
  key: CardKey;
  title: string;
  desc: string;
  span: 7 | 5 | 4 | 3;
}

const CARDS: Card[] = [
  {
    key: 'marquee',
    title: '130+ Components',
    desc: "Backgrounds, text effects, animations, UI patterns. The stuff you'd build from scratch, already done.",
    span: 7
  },
  {
    key: 'orbit',
    title: 'Well Organized',
    desc: "Four clear categories so you're not scrolling through a wall of unrelated stuff.",
    span: 5
  },
  {
    key: 'variants',
    title: 'TypeScript + Tailwind',
    desc: 'Every component ships as a typed Svelte 5 component styled with Tailwind. One stack, done right.',
    span: 4
  },
  {
    key: 'ai',
    title: 'AI-Ready',
    desc: 'Works great with Cursor, Copilot, and v0. Describe what you need, drop it in, ship.',
    span: 5
  },
  {
    key: 'stars',
    title: 'Growing Fast',
    desc: "Svelte's newest creative component library. Star us on GitHub to follow along.",
    span: 3
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
  <section class="ln-features-section">
    <div class="ln-features-inner">
      <h2 class="ln-features-title">What's inside</h2>

      <div class="ln-features-grid">
        <div
          v-for="(card, i) in CARDS"
          :key="card.key"
          :ref="el => setCardRef(el, i)"
          :class="[
            'ln-features-card',
            `ln-features-card--span-${card.span}`,
            {
              'is-visible': visible[i]
            }
          ]"
          :style="{
            transitionDelay: `${i * 70}ms`
          }"
        >
          <div class="ln-features-card-visual">
            <ComponentMarquee v-if="card.key === 'marquee'" />

            <CategorySelector v-else-if="card.key === 'orbit'" />

            <VariantTabs v-else-if="card.key === 'variants'" />

            <AITerminal v-else-if="card.key === 'ai'" />

            <StarCard v-else-if="card.key === 'stars'" />
          </div>

          <div class="ln-features-card-body">
            <h3>
              {{ card.title }}
            </h3>

            <p>
              {{ card.desc }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
