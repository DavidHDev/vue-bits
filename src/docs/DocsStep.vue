<template>
  <li class="docs-step">
    <h3 class="docs-step-title">
      <span class="docs-step-marker" aria-hidden="true">{{ index }}</span>
      {{ title }}
    </h3>
    <slot />
  </li>
</template>

<script setup lang="ts">
defineProps<{ index: number; title: string }>();
</script>
