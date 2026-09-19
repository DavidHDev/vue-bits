<script setup lang="ts">
import { RotateCcw } from 'lucide-vue-next';
import { inject } from 'vue';
import { CUSTOMIZE_ACTIONS } from './customizeActions';

const actions = inject(CUSTOMIZE_ACTIONS, null);
</script>

<template>
  <div class="customize-frame">
    <div class="customize-heading">
      <h2 class="demo-title-extra">Customize</h2>
      <button
        v-if="actions"
        type="button"
        class="customize-reset"
        :class="{ 'is-visible': actions.canReset.value }"
        :disabled="!actions.canReset.value"
        :aria-hidden="!actions.canReset.value"
        :tabindex="actions.canReset.value ? 0 : -1"
        @click="actions.reset"
      >
        <RotateCcw :size="14" aria-hidden="true" />
        <span>Reset</span>
      </button>
    </div>
    <div class="preview-options">
      <slot />
    </div>
  </div>
</template>

<style>
.customize-frame {
  margin-top: 2rem;
  padding: 4px;
  border: 1px solid transparent;
  border-radius: 14px;
  background: var(--surface-ghost-track);
  box-shadow: var(--surface-ghost-highlight);
}

.customize-heading {
  justify-content: space-between;
  gap: 1rem;
  display: flex;
  min-height: 46px;
  align-items: center;
  padding: 0.5rem 0.75rem 0.65rem 0.9rem;
}

.customize-heading .demo-title-extra {
  margin: 0;
  font-size: 0.9375rem;
}

.customize-reset {
  display: inline-flex;
  height: 30px;
  align-items: center;
  gap: 6px;
  padding: 0 9px;
  border: 1px solid transparent;
  border-radius: 7px;
  background: transparent;
  color: var(--text-muted);
  font: inherit;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  visibility: hidden;
  transition:
    background var(--transition-fast),
    color var(--transition-fast);
}

.customize-reset.is-visible {
  visibility: visible;
}

.customize-reset:hover {
  background: var(--surface-ghost);
  color: var(--text-primary);
}
</style>
