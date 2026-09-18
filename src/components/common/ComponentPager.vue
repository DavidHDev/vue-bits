<script setup lang="ts">
import { computed } from 'vue';
import { ArrowLeft, ArrowRight } from 'lucide-vue-next';
import { CATEGORIES, slug } from '@/constants/Categories';

const props = defineProps<{ category: string; subcategory: string }>();

type PagerItem = { category: string; component: string; path: string };

const routes: PagerItem[] = CATEGORIES.filter(category => category.name !== 'Get Started').flatMap(category =>
  category.subcategories.map(component => ({
    category: category.name,
    component,
    path: `/${slug(category.name)}/${slug(component)}`
  }))
);

const index = computed(() => routes.findIndex(item => item.path === `/${props.category}/${props.subcategory}`));
const previous = computed(() => (index.value >= 0 ? routes[index.value - 1] : undefined));
const next = computed(() => (index.value >= 0 ? routes[index.value + 1] : undefined));
</script>

<template>
  <nav v-if="index >= 0" class="component-pager" aria-label="Component navigation">
    <RouterLink v-if="previous" class="component-pager-link component-pager-previous" :to="previous.path">
      <ArrowLeft :size="16" aria-hidden="true" />
      <span>
        <span class="component-pager-label">Previous</span>
        <span class="component-pager-name">{{ previous.component }}</span>
      </span>
    </RouterLink>
    <span v-else class="component-pager-empty component-pager-previous">
      <span>
        <span class="component-pager-label">Collection</span>
        <span class="component-pager-name">Start of library</span>
      </span>
    </span>

    <RouterLink v-if="next" class="component-pager-link component-pager-next" :to="next.path">
      <span>
        <span class="component-pager-label">Next</span>
        <span class="component-pager-name">{{ next.component }}</span>
      </span>
      <ArrowRight :size="16" aria-hidden="true" />
    </RouterLink>
    <span v-else class="component-pager-empty component-pager-next">
      <span>
        <span class="component-pager-label">Collection</span>
        <span class="component-pager-name">End of library</span>
      </span>
    </span>
  </nav>
</template>
