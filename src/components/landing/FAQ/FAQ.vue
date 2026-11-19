<script setup lang="ts">
import { CATEGORIES, TOTAL_COMPONENTS } from '@/constants/Categories';
import { Plus } from 'lucide-vue-next';
import { ref } from 'vue';
import './FAQ.css';

type Part = { text: string; href?: string };

const NAMES = CATEGORIES.filter(category => category.name !== 'Get Started').map(category => category.name);
const CATEGORY_LIST = `${NAMES.slice(0, -1).join(', ')} and ${NAMES[NAMES.length - 1]}`;
const COUNT_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
const CATEGORY_COUNT = COUNT_WORDS[NAMES.length] ?? String(NAMES.length);

const QUESTIONS: { q: string; a: Part[] }[] = [
  {
    q: 'What is included in the free library?',
    a: [
      {
        text: `All ${TOTAL_COMPONENTS} components and backgrounds on this site, across ${CATEGORY_COUNT} categories: ${CATEGORY_LIST}. You can use all of it in personal and commercial projects, and it stays free.`
      }
    ]
  },
  {
    q: 'Is Vue Bits only for Vue?',
    a: [
      {
        text: 'The components on this site are built for Vue 3, so they work in Vite, Nuxt or Astro. Working in another framework? Vue Bits is a port of '
      },
      { text: 'React Bits', href: 'https://reactbits.dev/' },
      { text: ', and there is an official port for Svelte too: ' },
      { text: 'Svelte Bits', href: 'https://sveltebits.xyz/' },
      { text: '.' }
    ]
  },
  {
    q: 'Can I use Vue Bits in commercial projects?',
    a: [
      {
        text: "Yes. The library is licensed MIT + Commons Clause: use the components in any app, website or product, client work included, but don't sell, sublicense or redistribute the components themselves."
      }
    ]
  },
  {
    q: 'Do I need to install a package?',
    a: [
      {
        text: 'No. The jsrepo or shadcn CLI copies the source into your project, or you can paste it in by hand. There is no vue-bits dependency to keep updated, and it works in any Vue 3 setup, including Vite, Nuxt and Astro.'
      }
    ]
  },
  {
    q: 'Does it work with AI coding tools?',
    a: [
      {
        text: 'Yes. Every component has a Copy for AI menu, and the shadcn MCP server lets your agent browse, search and install components for you.'
      }
    ]
  }
];

const open = ref<number | null>(null);
</script>

<template>
  <section class="ln-faq-section">
    <div class="ln-faq-inner prox-faq-layout">
      <div class="prox-faq-aside">
        <h2 class="ln-faq-title">Questions, answered</h2>
        <p class="ln-faq-sub">What's included and how the pieces fit together.</p>
      </div>

      <div class="prox-faq">
        <div v-for="(item, index) in QUESTIONS" :key="item.q" :class="['prox-faq-item', { open: open === index }]">
          <button
            :id="`ln-faq-q-${index}`"
            type="button"
            class="prox-faq-q"
            :aria-expanded="open === index"
            :aria-controls="`ln-faq-panel-${index}`"
            @click="open = open === index ? null : index"
          >
            <span>{{ item.q }}</span>
            <Plus class="prox-faq-icon" :size="17" />
          </button>

          <div
            :id="`ln-faq-panel-${index}`"
            class="prox-faq-panel"
            role="region"
            :aria-labelledby="`ln-faq-q-${index}`"
            :aria-hidden="open !== index"
            :inert="open !== index || undefined"
          >
            <div class="prox-faq-panel-inner">
              <p class="prox-faq-a">
                <template v-for="(part, pi) in item.a" :key="pi">
                  <a v-if="part.href" class="ln-faq-link" :href="part.href" target="_blank" rel="noopener noreferrer">
                    {{ part.text }}
                  </a>
                  <template v-else>{{ part.text }}</template>
                </template>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
