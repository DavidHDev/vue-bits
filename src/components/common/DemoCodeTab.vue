<script setup lang="ts">
import CliInstall from './CliInstall.vue';
import CodeBlock from './CodeBlock.vue';
import CodeSection from './CodeSection.vue';

type Props = {
  slug: string;
  usage: string;
  source: string;
  utility?: string;
};

defineProps<Props>();
</script>

<template>
  <CliInstall :slug="slug" />
  <CodeSection title="Usage" :copy="usage">
    <CodeBlock :code="usage" language="html" :show-copy="false" :max-lines="25" />
  </CodeSection>
  <CodeSection title="Code" :copy="source">
    <CodeBlock :code="source" language="html" :show-copy="false" :max-lines="25" />
  </CodeSection>
  <CodeSection v-if="utility" title="Utility source" :copy="utility">
    <CodeBlock :code="utility" language="ts" :show-copy="false" :max-lines="25" />
  </CodeSection>
</template>
