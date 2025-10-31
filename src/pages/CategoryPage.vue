<template>
  <IndexPage v-if="isIndexPage" />

  <div class="page-transition-fade" v-else>
    <h2 class="sub-category">{{ decodedLabel }}</h2>

    <Suspense v-if="SubcategoryComponent">
      <template #default>
        <component :is="SubcategoryComponent" v-if="SubcategoryComponent" />
      </template>

      <template #fallback>
        <div class="loading-placeholder"></div>
      </template>
    </Suspense>
    <div v-else class="p-6">
      <h3 class="font-semibold text-white text-lg">Not Found</h3>
      <p class="text-[#a6a6a6] text-sm">This section is unavailable.</p>
    </div>
  </div>

  <BackToTopButton />
</template>

<script setup lang="ts">
import BackToTopButton from '@/components/common/BackToTopButton.vue';
import { computed, defineAsyncComponent, watch } from 'vue';
import { useRoute } from 'vue-router';
import { componentMap } from '../constants/Components';
import { decodeLabel } from '../utils/utils';
import IndexPage from './IndexPage.vue';

const route = useRoute();

const subcategory = computed(() => route.params.subcategory as string);
const decodedLabel = computed(() => decodeLabel(subcategory.value));
const isIndexPage = computed(() => subcategory.value === 'index');

const SubcategoryComponent = computed(() => {
  const key = subcategory.value as keyof typeof componentMap;
  const loader = componentMap[key];
  return loader ? defineAsyncComponent(loader) : null;
});

watch(
  decodedLabel,
  label => {
    if (label) document.title = `Vue Bits - ${label}`;
  },
  { immediate: true }
);
</script>
