<script setup lang="ts">
import { useInView } from '@/composables/useInView';
import { onBeforeUnmount, ref, watch } from 'vue';

const VARIANTS = [
  { label: 'Vue 3', accent: 'rgba(255,255,255,0.5)' },
  { label: 'TypeScript', accent: 'rgba(255,255,255,0.5)' },
  { label: 'Composition API', accent: 'rgba(255,255,255,0.5)' },
  { label: 'Single-file', accent: 'rgba(255,255,255,0.5)' }
];

const root = ref<HTMLElement | null>(null);
const visible = useInView(root);
const active = ref(0);
let timer = 0;

watch(
  visible,
  isVisible => {
    window.clearInterval(timer);
    if (!isVisible) return;
    timer = window.setInterval(() => {
      active.value = (active.value + 1) % VARIANTS.length;
    }, 2200);
  },
  { immediate: true }
);

onBeforeUnmount(() => window.clearInterval(timer));
</script>

<template>
  <div ref="root" class="ln-feat-vrows">
    <div
      v-for="(v, i) in VARIANTS"
      :key="v.label"
      class="ln-feat-vrow"
      :style="{ opacity: i === active ? 1 : 0.3, transition: 'opacity 0.4s ease' }"
    >
      <div class="ln-feat-vrow-dot" :style="{ background: v.accent }" />
      <span class="ln-feat-vrow-label">{{ v.label }}</span>
      <div class="ln-feat-vrow-bars">
        <div class="ln-feat-vrow-bar" :style="{ width: `${35 + i * 8}%` }" />
        <div class="ln-feat-vrow-bar" :style="{ width: `${20 + ((i + 2) % 4) * 7}%` }" />
        <div class="ln-feat-vrow-bar" :style="{ width: `${45 + ((i + 1) % 3) * 10}%` }" />
      </div>
    </div>
  </div>
</template>
