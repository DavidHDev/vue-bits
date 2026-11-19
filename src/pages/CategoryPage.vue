<script setup lang="ts">
import { computed, ref, watch, defineAsyncComponent, shallowRef } from 'vue';
import { useRoute } from 'vue-router';
import { decodeLabel } from '../utils/utils';
import { componentMap } from '../constants/Components';
import { getComponentOverviewByPath } from '../utils/catalog';
import DocsOverview from '../components/common/DocsOverview.vue';
import BackToTopButton from '../components/common/BackToTopButton.vue';
import IndexPage from './IndexPage.vue';

const route = useRoute();

const category = computed(() => (route.params.category as string) ?? '');
const sub = computed(() => (route.params.subcategory as string) ?? '');
const niceName = computed(() => decodeLabel(sub.value));
const isGetStarted = computed(() => category.value === 'get-started');
const isIndexPage = computed(() => sub.value === 'index');
const overview = computed(() => getComponentOverviewByPath(`/${category.value}/${sub.value}`));

const loadedSlug = ref('');
const PageComponent = shallowRef<ReturnType<typeof defineAsyncComponent> | null>(null);
const loading = ref(false);

watch(
  sub,
  slug => {
    const load = slug === 'index' ? undefined : componentMap[slug as keyof typeof componentMap];
    loadedSlug.value = slug;
    PageComponent.value = null;

    if (!load) {
      loading.value = false;
      return;
    }

    loading.value = true;
    load().then(module => {
      if (loadedSlug.value !== slug) return;
      PageComponent.value = defineAsyncComponent(() => Promise.resolve(module));
      loading.value = false;
    });
  },
  { immediate: true }
);

watch(
  [niceName, overview, isIndexPage],
  ([name, info, index]) => {
    if (index) return;
    const title = info?.heading ?? name;
    if (title) document.title = `${title} - Vue Bits`;
  },
  { immediate: true }
);
</script>

<template>
  <IndexPage v-if="isIndexPage" />
  <div v-else class="category-page" :class="[`category-${category}`, { loading }]">
    <DocsOverview v-if="overview" :overview="overview" />
    <component :is="PageComponent" v-if="PageComponent" />
    <h1 v-else-if="!overview && !isGetStarted" class="sub-category">{{ niceName }}</h1>
    <BackToTopButton />
  </div>
</template>

<style>
.category-page > .docs-overview ~ h1.sub-category {
  display: none;
}
</style>
