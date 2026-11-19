<template>
  <button
    type="button"
    class="docs-row-copy"
    :aria-label="copied ? 'Copied' : label"
    :title="copied ? 'Copied!' : label"
    @click="copy"
  >
    <TbCheck v-if="copied" size="1em" />
    <TbCopy v-else size="1em" />
  </button>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue';
import { TbCheck, TbCopy } from 'vue-icons-plus/tb';

const props = withDefaults(defineProps<{ text: string; label?: string }>(), { label: 'Copy command' });

const COPY_RESET_MS = 2000;
const copied = ref(false);
let timer: ReturnType<typeof setTimeout> | undefined;

async function copy() {
  try {
    await navigator.clipboard.writeText(props.text);
  } catch {
    return;
  }
  copied.value = true;
  clearTimeout(timer);
  timer = setTimeout(() => (copied.value = false), COPY_RESET_MS);
}

onBeforeUnmount(() => clearTimeout(timer));
</script>
