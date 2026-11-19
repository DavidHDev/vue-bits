<template>
  <div class="docs-code">
    <div class="docs-code-header">
      <CodeCopyButton :code-string="code.trim()" />
    </div>
    <ShikiCode :code="code" :language="language" :show-line-numbers="showLineNumbers" />
  </div>
</template>

<script setup lang="ts">
import CodeCopyButton from '@/components/common/CodeCopyButton.vue';
import ShikiCode from '@/components/common/ShikiCode.vue';

withDefaults(defineProps<{ code: string; language?: string; showLineNumbers?: boolean }>(), {
  language: 'bash',
  showLineNumbers: false
});
</script>
