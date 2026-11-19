<script setup lang="ts">
import logoMarkup from '@/assets/logos/vue-bits-logo-small.svg?raw';
import './LandingLoader.css';

const { hiding = false } = defineProps<{ hiding?: boolean }>();
</script>

<template>
  <div
    :class="['ln-loader', hiding ? 'ln-loader--hide' : '']"
    role="status"
    aria-label="Loading Vue Bits"
    :aria-hidden="hiding || undefined"
  >
    <span class="ln-loader-logo" aria-hidden="true" v-html="logoMarkup" />
  </div>
</template>
