<template>
  <div>
    <ComponentList title="Favorites" :list="savedList" has-delete-button sorting="none" />
    <BackToTopButton />
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import BackToTopButton from '@/components/common/BackToTopButton.vue';
import ComponentList from '@/components/common/ComponentList.vue';
import { componentMetadata, type ComponentMetadata } from '@/constants/Information';
import { getSavedComponents } from '@/utils/favorites';

const savedKeys = ref<string[]>(getSavedComponents());

const update = () => {
  savedKeys.value = getSavedComponents();
};
const onStorage = (event: StorageEvent) => {
  if (!event || event.key === 'savedComponents') update();
};

const savedList = computed<ComponentMetadata>(() =>
  Object.fromEntries(
    (savedKeys.value || [])
      .filter(key => typeof key === 'string' && key.includes('/') && componentMetadata[key])
      .map(key => [key, componentMetadata[key]])
  )
);

onMounted(() => {
  document.title = 'Favorites - Vue Bits';
  window.addEventListener('favorites:updated', update);
  window.addEventListener('storage', onStorage);
});

onBeforeUnmount(() => {
  window.removeEventListener('favorites:updated', update);
  window.removeEventListener('storage', onStorage);
});
</script>
