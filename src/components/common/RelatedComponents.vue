<template>
  <section class="docs-related customize-frame" aria-labelledby="related-components-heading">
    <div class="customize-heading">
      <h2 id="related-components-heading">Related components</h2>
      <RouterLink
        :to="overview.category.path"
        class="customize-heading-action"
        :aria-label="`View all ${overview.category.name.toLowerCase()}`"
      >
        View all
        <ArrowRight :size="14" aria-hidden="true" />
      </RouterLink>
    </div>
    <div class="docs-related-grid">
      <RouterLink
        v-for="item in overview.related"
        :key="item.path"
        :to="item.path"
        class="docs-related-card component-pager-link"
        :title="item.name"
      >
        <span class="component-pager-name">{{ item.name }}</span>
        <ArrowRight :size="16" aria-hidden="true" />
      </RouterLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next';
import type { ComponentOverview } from '@/utils/catalog';

defineProps<{ overview: ComponentOverview }>();
</script>
