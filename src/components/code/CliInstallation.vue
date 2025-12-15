<template>
  <div class="cli-installation">
    <h2 class="demo-title">One-Time Installation</h2>

    <VCodeBlock
      v-if="command"
      :code="command"
      :persistent-copy-button="true"
      highlightjs
      lang="bash"
      theme="nord"
      :copy-button="true"
      class="code-block"
    />

    <p class="jsrepo-info">
      Vue Bits uses <strong>jsrepo</strong> to help you install components via CLI commands. Learn more about it
      <a href="https://jsrepo.dev/" target="_blank" rel="noreferrer">here</a>.
    </p>
  </div>
</template>

<script setup lang="ts">
import { VCodeBlock } from '@wdns/vue-code-block';

const { command } = defineProps<{
  command?: string;
}>();
</script>

<style scoped>
.cli-installation {
  padding-bottom: 1.2rem;
  font-size: 16px;
}

.setup-content {
  padding: 1rem 0;
}

.setup-option {
  margin-bottom: 1.5rem;
}

.jsrepo-info {
  color: #a1a1aa;
  text-align: center;
  font-size: 14px;
  margin: 1rem 0;
}

.jsrepo-info a {
  color: #27ff64;
  text-decoration: underline;
}

.code-block {
  border-radius: 15px;
  overflow: hidden;
  border: 1px solid #333;
}

:deep(.v-code-block) {
  background: #0b0b0b;
  font-weight: 400;
  font-size: 14px;
}

:deep(.v-code-block pre) {
  background: #0b0b0b;
  margin: 0;
  font-size: 14px;
}

:deep(.v-code-block .hljs) {
  background: #0b0b0b;
  color: #fff;
  font-size: 14px;
}

:deep(.v-code-block--tab-highlightjs-github-dark-icon) {
  color: #999 !important;
  fill: #999 !important;
}

:deep(.v-code-block--me-1) {
  margin-right: 0 !important;
}
</style>
