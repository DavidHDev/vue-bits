<template>
  <router-view />
  <SearchDialog v-if="mounted" />
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
import { installSearchShortcut, useSearch } from '@/composables/useSearch';

const SearchDialog = defineAsyncComponent(() => import('@/components/common/SearchDialog.vue'));
const { mounted } = useSearch();

installSearchShortcut();
</script>
