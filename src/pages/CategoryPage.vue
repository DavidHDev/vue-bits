<script setup lang="ts">
import { computed, ref, watch, defineAsyncComponent, shallowRef } from 'vue';
import { useRoute } from 'vue-router';
import { decodeLabel } from '../utils/utils';
import { componentMap } from '../constants/Components';

const route = useRoute();

const sub = computed(() => (route.params.subcategory as string) ?? '');
const niceName = computed(() => decodeLabel(sub.value));

const loadedSlug = ref('');
const PageComponent = shallowRef<ReturnType<typeof defineAsyncComponent> | null>(null);
const loading = ref(false);

watch(
  sub,
  slug => {
    const load = componentMap[slug as keyof typeof componentMap];
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
  niceName,
  name => {
    if (name) document.title = `${name} - Vue Bits`;
  },
  { immediate: true }
);
</script>

<template>
  <div class="category-page">
    <component :is="PageComponent" v-if="PageComponent" />
    <h1 v-else class="sub-category">{{ niceName }}</h1>
  </div>
</template>
