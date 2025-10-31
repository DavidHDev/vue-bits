<template>
  <main class="app-container">
    <Header />

    <section class="category-wrapper">
      <Sidebar />

      <div class="category-page">
        <ComponentList :list="savedList" title="Favorites" sorting="none" has-delete-button />
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import ComponentList from '@/components/common/ComponentList.vue';
import Header from '@/components/navs/Header.vue';
import Sidebar from '@/components/navs/Sidebar.vue';
import { componentMetadata } from '@/constants/Information';
import { getSavedComponents } from '@/utils/favorites';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

const savedKeys = ref<string[]>(getSavedComponents());

const update = () => (savedKeys.value = getSavedComponents());
const onStorage = (e?: StorageEvent | null) => {
  if (!e || e.key === 'savedComponents') update();
};

onMounted(() => {
  window.addEventListener('favorites:updated', update);
  window.addEventListener('storage', onStorage);
});

onBeforeUnmount(() => {
  window.removeEventListener('favorites:updated', update);
  window.removeEventListener('storage', onStorage);
});

const savedList = computed(() => {
  const entries = (savedKeys.value || [])
    .filter(k => typeof k === 'string' && k.includes('/') && componentMetadata?.[k])
    .map(k => [k, componentMetadata[k]]);
  return Object.fromEntries(entries);
});
</script>
