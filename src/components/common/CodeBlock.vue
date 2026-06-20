<script setup lang="ts">
import { VCodeBlock } from '@wdns/vue-code-block';

const { code, language = 'html' } = defineProps<{
  code: string;
  language?: string;
}>();
</script>

<template>
  <div class="code-highlighter" :data-language="language">
    <VCodeBlock
      :code="code"
      :lang="language"
      theme="nord"
      highlightjs
      :copy-button="true"
      :persistent-copy-button="true"
      class="code-block"
    />
  </div>
</template>

<style scoped>
:deep(.v-code-block) {
  background: transparent;
  margin: 0;
}

:deep(.v-code-block pre) {
  background: transparent !important;
  margin: 0;
  font-size: 13px;
  font-family: 'Geist Mono', ui-monospace, monospace;
  line-height: 1.6;
  overflow-x: auto;
}

:deep(.v-code-block .hljs) {
  background: transparent;
  font-size: 13px;
}
</style>
