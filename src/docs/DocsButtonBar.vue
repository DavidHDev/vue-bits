<template>
  <div class="docs-button-bar">
    <RouterLink v-if="previous" :to="previous.route" class="docs-button docs-button-primary">
      <FaArrowLeft size="1em" />
      <span>{{ previous.label }}</span>
    </RouterLink>

    <RouterLink v-if="next" :to="next.route" class="docs-button docs-button-secondary">
      <span>{{ next.label }}</span>
      <FaArrowRight size="1em" />
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
import { Fa6ArrowLeft as FaArrowLeft, Fa6ArrowRight as FaArrowRight } from 'vue-icons-plus/fa6';

interface DocsLink {
  label: string;
  route: string;
}

defineProps<{
  next?: DocsLink | null;
  previous?: DocsLink | null;
}>();
</script>
