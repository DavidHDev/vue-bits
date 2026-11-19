<template>
  <header class="docs-overview">
    <h1 class="sub-category">{{ overview.heading }}</h1>
    <p class="docs-overview-description" :title="overview.intro">{{ overview.intro }}</p>
  </header>
</template>

<script setup lang="ts">
import type { ComponentOverview } from '@/utils/catalog';

defineProps<{ overview: ComponentOverview }>();
</script>
