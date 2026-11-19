<template>
  <div v-if="!key" class="category-page">
    <div class="docs-not-found">
      <p class="docs-not-found-title">Not found</p>
      <p class="docs-not-found-text">There is no such category.</p>
    </div>
  </div>
  <div v-else :key="key">
    <ComponentList
      :title="heading"
      :list="list"
      has-favorite-button
      sorting="alphabetical"
      show-sort-control
      :new-since-last-visit="newSinceLastVisit"
      base-path="/c"
      :show-category-filter="false"
      show-directory
    />
    <BackToTopButton />
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import BackToTopButton from '@/components/common/BackToTopButton.vue';
import ComponentList from '@/components/common/ComponentList.vue';
import { useNewSinceLastVisit } from '@/composables/useNewSinceLastVisit';
import { componentMetadata, type ComponentMetadata } from '@/constants/Information';

const CATEGORY_KEYS: Record<string, { key: string; heading: string; title: string }> = {
  components: { key: 'Components', heading: 'Components', title: 'Interactive Vue UI Components' },
  animations: { key: 'Animations', heading: 'Animations', title: 'Vue Animation Effects' },
  backgrounds: { key: 'Backgrounds', heading: 'Backgrounds', title: 'Animated Vue Backgrounds' },
  'text-animations': { key: 'TextAnimations', heading: 'Text Animations', title: 'Vue Text Animations' },
  micro: { key: 'Micro', heading: 'Micro Interactions', title: 'Vue Micro Interactions' }
};

const route = useRoute();
const entry = computed(() => CATEGORY_KEYS[String(route.params.category ?? '')]);
const key = computed(() => entry.value?.key ?? '');
const heading = computed(() => entry.value?.heading ?? '');

const list = computed<ComponentMetadata>(() =>
  Object.fromEntries(
    Object.entries(componentMetadata).filter(([, meta]) => meta.category === key.value && !meta.hidden)
  )
);

const newSinceLastVisit = useNewSinceLastVisit(
  Object.keys(componentMetadata).filter(name => !componentMetadata[name].hidden)
);

watch(
  entry,
  value => {
    document.title = value ? `${value.title} | Vue Bits` : 'Category not found | Vue Bits';
  },
  { immediate: true }
);
</script>
