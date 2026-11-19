<template>
  <button
    v-if="codeString"
    type="button"
    class="docs-copy-button"
    :class="{ 'docs-copy-button--done': copied }"
    :title="copied ? 'Copied!' : 'Copy to clipboard'"
    :aria-label="copied ? 'Code copied to clipboard' : 'Copy code to clipboard'"
    @click="handleCopy"
  >
    <TbCheck v-if="copied" />
    <TbCopy v-else />
  </button>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue';
import { TbCheck, TbCopy } from 'vue-icons-plus/tb';

const props = defineProps<{ codeString?: string | null }>();

const COPY_RESET_MS = 2000;
const copied = ref(false);
let timer: ReturnType<typeof setTimeout> | undefined;

async function handleCopy() {
  if (!props.codeString) return;
  try {
    await navigator.clipboard.writeText(props.codeString);
    copied.value = true;
    clearTimeout(timer);
    timer = setTimeout(() => (copied.value = false), COPY_RESET_MS);
  } catch (error) {
    console.error('Failed to copy text: ', error);
  }
}

onBeforeUnmount(() => clearTimeout(timer));
</script>
