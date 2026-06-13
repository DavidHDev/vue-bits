<template>
  <button type="button" class="replay-button" :aria-label="label" :title="label" @click="$emit('click')">
    <i class="pi pi-refresh"></i>
  </button>
</template>

<script setup lang="ts">
const { label = 'Replay animation' } = defineProps<{ label?: string }>();
defineEmits<{ click: [] }>();
</script>

<style scoped>
.replay-button {
  position: absolute;
  top: 14px;
  right: 14px;
  z-index: 10;
  display: inline-flex;
  width: 34px;
  height: 34px;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  border: 1px solid var(--border-primary);
  background: color-mix(in srgb, var(--bg-elevated) 88%, transparent);
  color: var(--text-primary);
  cursor: pointer;
  backdrop-filter: blur(12px);
  transition:
    background var(--transition-fast),
    border-color var(--transition-fast),
    color var(--transition-fast);
}

.replay-button:hover {
  border-color: #333;
  background: #222;
  color: #fff;
}
</style>
