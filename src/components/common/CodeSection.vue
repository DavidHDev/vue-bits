<script setup lang="ts">
import CodeCopyButton from './CodeCopyButton.vue';

defineProps<{ title: string; note?: string | null; copy?: string | null; className?: string }>();
</script>

<template>
  <section class="code-section-frame" :class="className">
    <header class="code-section-heading">
      <div class="code-section-title-group">
        <h2>{{ title }}</h2>
        <span v-if="note" class="code-section-note">{{ note }}</span>
      </div>
      <div v-if="$slots.actions || copy" class="code-section-actions">
        <slot name="actions" />
        <CodeCopyButton v-if="copy" :code-string="copy" />
      </div>
    </header>
    <div class="code-section-body">
      <slot />
    </div>
  </section>
</template>
