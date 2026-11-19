<script setup lang="ts">
import { CATEGORIES } from '@/constants/Categories';
import { vReveal } from '../reveal';
import AITerminal from './AITerminal.vue';
import CategorySelector from './CategorySelector.vue';
import ComponentMarquee from './ComponentMarquee.vue';
import StarCard from './StarCard.vue';
import VariantTabs from './VariantTabs.vue';
import './Features.css';

const COMPONENT_COUNT =
  Math.floor(
    CATEGORIES.filter(category => category.name !== 'Get Started').reduce(
      (sum, category) => sum + category.subcategories.length,
      0
    ) / 5
  ) * 5;

const CARDS = [
  {
    key: 'marquee',
    title: `${COMPONENT_COUNT}+ Components`,
    desc: "Backgrounds, text effects, animations, creative UI components. The stuff you'd build from scratch, already done and battle-tested.",
    span: 5,
    visual: ComponentMarquee
  },
  {
    key: 'orbit',
    title: 'Well Organized',
    desc: "Five clear categories so you're not scrolling through a wall of unrelated stuff.",
    span: 4,
    visual: CategorySelector
  },
  {
    key: 'stars',
    title: 'Growing Fast',
    desc: "Vue's creative component library, growing every release. Star it on GitHub to follow along.",
    span: 3,
    visual: StarCard
  },
  {
    key: 'variants',
    title: 'Vue 3 + TypeScript',
    desc: 'Every component is a typed Vue 3 single-file component built on the Composition API. Copy it in and make it yours.',
    span: 5,
    visual: VariantTabs
  },
  {
    key: 'ai',
    title: 'AI-Ready',
    desc: 'The docs give you ready-to-use prompts. Works great with Cursor, Copilot, and v0. Describe what you need, drop it in, ship.',
    span: 7,
    visual: AITerminal
  }
];
</script>

<template>
  <section class="ln-features-section">
    <div class="ln-features-inner">
      <h2 class="ln-features-title">What's inside</h2>

      <div class="ln-features-grid">
        <div
          v-for="(card, i) in CARDS"
          :key="card.key"
          v-reveal="i * 0.07"
          :class="['ln-features-card', `ln-features-card--span-${card.span}`]"
        >
          <div class="ln-features-card-visual">
            <component :is="card.visual" />
          </div>
          <div class="ln-features-card-body">
            <h3>{{ card.title }}</h3>
            <p>{{ card.desc }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
