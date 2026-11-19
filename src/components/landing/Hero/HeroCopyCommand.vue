<script setup lang="ts">
import { Copy01Icon, Tick02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { onBeforeUnmount, ref } from 'vue';

const props = defineProps<{ command: string; buttonClass: string }>();

const copied = ref(false);
let timer = 0;

const copy = () => {
  navigator.clipboard?.writeText(props.command);
  copied.value = true;
  window.clearTimeout(timer);
  timer = window.setTimeout(() => {
    copied.value = false;
  }, 1400);
};

onBeforeUnmount(() => window.clearTimeout(timer));
</script>

<template>
  <button type="button" :class="buttonClass" aria-label="Copy install command" @click="copy">
    <HugeiconsIcon :icon="copied ? Tick02Icon : Copy01Icon" :size="13" :stroke-width="1.8" />
  </button>
</template>
