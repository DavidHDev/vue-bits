<template>
  <div>
    <title>Vue Bits - Component Index</title>
    <ComponentList :list="componentMetadata" title="Index" sorting="alphabetical" has-favorite-button />
  </div>
</template>

<script setup lang="ts">
import ComponentList from '@/components/common/ComponentList.vue';
import { componentMetadata } from '@/constants/Information';
</script>
