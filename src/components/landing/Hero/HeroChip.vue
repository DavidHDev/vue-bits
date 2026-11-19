<script setup lang="ts">
import { ArrowRight02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { CATEGORIES } from '@/constants/Categories';
import { categoryIndexPath, getComponentCatalog } from '@/utils/catalog';
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

const MICRO_COUNT = CATEGORIES.find(category => category.name === 'Micro')?.subcategories.length ?? 0;
const FEATURED = ['Holo Mosaic', 'Gradient Waves', 'Molten Metal', 'Web Threads'];

const catalog = getComponentCatalog();
const ITEMS = [
  ...FEATURED.flatMap(name => {
    const found = catalog.find(item => item.name === name);
    return found ? [{ label: found.name, to: found.path }] : [];
  }).slice(0, 3),
  ...(MICRO_COUNT ? [{ label: `${MICRO_COUNT} Micro components`, to: categoryIndexPath('Micro') }] : [])
];

const INTERVAL = 3200;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

const index = ref(0);
const previous = ref(-1);
const held = ref(false);
const widths = ref<number[]>([]);
const labelEls = ref<HTMLElement[]>([]);
let timer = 0;

const item = computed(() => ITEMS[index.value] ?? ITEMS[0]);

const measure = () => {
  widths.value = labelEls.value.map(el => (el ? Math.ceil(el.scrollWidth) : 0));
};

const schedule = () => {
  window.clearInterval(timer);
  if (held.value || prefersReducedMotion() || ITEMS.length < 2) return;
  timer = window.setInterval(() => {
    previous.value = index.value;
    index.value = (index.value + 1) % ITEMS.length;
  }, INTERVAL);
};

watch(held, schedule);

onMounted(() => {
  measure();
  document.fonts?.ready.then(measure);
  schedule();
});

onBeforeUnmount(() => window.clearInterval(timer));
</script>

<template>
  <RouterLink
    v-if="item"
    :to="item.to"
    class="lh-chip"
    @mouseenter="held = true"
    @mouseleave="held = false"
    @focus="held = true"
    @blur="held = false"
  >
    <span class="lh-chip-tag">New</span>
    <span class="lh-chip-roll" :style="widths[index] ? { width: `${widths[index]}px` } : undefined">
      <span
        v-for="(entry, i) in ITEMS"
        :key="entry.label"
        ref="labelEls"
        :aria-hidden="i !== index"
        :class="['lh-chip-label', i === index ? 'is-in' : i === previous ? 'is-out' : '']"
      >
        {{ entry.label }}
      </span>
    </span>
    <HugeiconsIcon :icon="ArrowRight02Icon" :size="14" :stroke-width="1.8" />
  </RouterLink>
</template>
