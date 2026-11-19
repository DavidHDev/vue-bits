<template>
  <div class="docs-menu-group" role="group">
    <div class="docs-menu-label">{{ label }}</div>
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{ label: string }>();
</script>
