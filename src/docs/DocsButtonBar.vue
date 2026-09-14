<script setup lang="ts">
import { ArrowLeft, ArrowRight } from 'lucide-vue-next';

interface DocsLink {
  label: string;
  route: string;
}

defineProps<{
  next?: DocsLink | null;
  previous?: DocsLink | null;
}>();
</script>

<template>
  <div class="flex gap-4 justify-between mt-12 pt-8 border-t border-(--border-primary)">
    <RouterLink
      v-if="previous"
      :to="previous.route"
      class="inline-flex items-center gap-2 px-4 h-10 rounded-sm text-sm font-medium text-(--text-primary) bg-(--bg-elevated) border border-(--border-primary) no-underline transition-colors duration-200 hover:bg-(--bg-hover)"
    >
      <ArrowLeft :size="14" aria-hidden="true" />
      <span>{{ previous.label }}</span>
    </RouterLink>

    <RouterLink
      v-if="next"
      :to="next.route"
      class="inline-flex items-center gap-2 px-4 h-10 rounded-sm text-sm font-medium text-(--text-primary) bg-(--bg-elevated) border border-(--border-primary) no-underline transition-colors duration-200 hover:bg-(--bg-hover)"
    >
      <span>{{ next.label }}</span>
      <ArrowRight :size="14" aria-hidden="true" />
    </RouterLink>
  </div>
</template>
