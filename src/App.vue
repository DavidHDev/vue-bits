<template>
  <div>
    <DisplayHeader v-if="!isSidebarPage" :activeItem="activeItem" />

    <router-view />
  </div>
</template>

<script setup lang="ts">
import DisplayHeader from '@/components/landing/DisplayHeader/DisplayHeader.vue';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const sidebarPages = ['/favorites'];
const isSidebarPage = computed(() => {
  const path = route.path;
  return sidebarPages.some(sidebarPath => path.includes(sidebarPath)) || /^\/[^/]+\/[^/]+$/.test(path);
});

const activeItem = computed(() => {
  if (route.path === '/') return 'home';
  return null;
});
</script>
