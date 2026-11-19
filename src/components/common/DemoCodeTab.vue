<script setup lang="ts">
import { computed } from 'vue';
import { dependenciesForSlug } from '@/constants/componentDependencies';
import CodeExample from './CodeExample.vue';

const props = defineProps<{
  slug: string;
  usage: string;
  source: string;
  utility?: string;
  componentName?: string;
  dependencies?: string;
}>();

const codeObject = computed(() => ({
  usage: props.usage,
  code: props.source,
  ...(props.utility ? { utility: props.utility } : {}),
  dependencies: props.dependencies ?? dependenciesForSlug(props.slug).join(' ')
}));
</script>

<template>
  <CodeExample :code-object="codeObject" :component-name="componentName" />
</template>
