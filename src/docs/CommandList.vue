<template>
  <ul class="docs-cmds">
    <li v-for="item in items" :key="item.key" class="docs-cmd">
      <span class="docs-cmd-head">
        <slot name="icon" :item="item" />
        {{ item.label }}
      </span>
      <span class="docs-cmd-line" :class="{ 'is-block': item.command.includes('\n') }">
        <code class="docs-cmd-code">{{ item.command }}</code>
        <DocsCopyButton :text="item.command" />
      </span>
      <span v-if="$slots.note" class="docs-cmd-note"><slot name="note" :item="item" /></span>
    </li>
  </ul>
</template>

<script setup lang="ts">
import DocsCopyButton from './DocsCopyButton.vue';

export type CommandItem = { key: string; label: string; command: string };

defineProps<{ items: CommandItem[] }>();
</script>
