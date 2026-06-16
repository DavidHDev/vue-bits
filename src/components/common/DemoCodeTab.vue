<script setup lang="ts">
import CliInstall from './CliInstall.vue';
import CodeBlock from './CodeBlock.vue';

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
  <h3 class="demo-title-extra">Usage</h3>
  <CodeBlock :code="usage" language="html" />
  <h3 class="demo-title-extra">Component source</h3>
  <CodeBlock :code="source" language="html" />
  <template v-if="utility">
    <h3 class="demo-title-extra">Utility source</h3>
    <CodeBlock :code="utility" language="ts" />
  </template>
</template>
