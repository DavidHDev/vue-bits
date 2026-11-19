<template>
  <button
    type="button"
    class="ln-navbar-icon-btn ln-navbar-theme-btn"
    :aria-label="isLight ? 'Switch to dark mode' : 'Switch to light mode'"
    :title="isLight ? 'Dark mode' : 'Light mode'"
    @click="toggleColorMode"
  >
    <LuMoon v-if="isLight" :size="16" />
    <LuSun v-else :size="16" />
  </button>
</template>

<script setup lang="ts">
import { LuMoon, LuSun } from 'vue-icons-plus/lu';
import { useColorMode } from '@/composables/useTheme';

const { isLight, toggleColorMode } = useColorMode();
</script>

<style>
.ln-navbar-icon-btn.ln-navbar-theme-btn {
  display: flex;
  width: 36px;
  min-width: 36px;
  height: 36px;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 1px solid var(--action-control-border);
  border-radius: 10px;
  background: var(--action-control-bg);
  box-shadow: var(--action-control-shadow);
  color: var(--text-muted);
  cursor: pointer;
  transition:
    background var(--transition-fast),
    color var(--transition-fast),
    transform var(--dur-press) var(--ease-out);
}

.ln-navbar-icon-btn.ln-navbar-theme-btn:hover {
  border-color: var(--action-control-border);
  background: var(--action-control-hover);
  color: var(--text-primary);
}

.ln-navbar-icon-btn.ln-navbar-theme-btn:active {
  transform: scale(0.97);
}
</style>
