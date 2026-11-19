<template>
  <div>
    <ComponentList
      title="Components"
      :list="componentMetadata"
      has-favorite-button
      sorting="newest"
      show-sort-control
      :new-since-last-visit="newSinceLastVisit"
      show-directory
    />
    <BackToTopButton />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import BackToTopButton from '@/components/common/BackToTopButton.vue';
import ComponentList from '@/components/common/ComponentList.vue';
import { useNewSinceLastVisit } from '@/composables/useNewSinceLastVisit';
import { componentMetadata } from '@/constants/Information';

const newSinceLastVisit = useNewSinceLastVisit(
  Object.keys(componentMetadata).filter(key => !componentMetadata[key].hidden)
);

onMounted(() => {
  document.title = 'Browse Free Vue Components | Vue Bits';
});
</script>
