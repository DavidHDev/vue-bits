<script setup lang="ts">
import { RotateCcw } from 'lucide-vue-next';
import { inject } from 'vue';
import { CUSTOMIZE_ACTIONS } from './customizeActions';

const actions = inject(CUSTOMIZE_ACTIONS, null);
</script>

<template>
  <div class="customize-frame">
    <div class="customize-heading">
      <h2>Customize</h2>
      <div class="customize-heading-actions">
        <button
          v-if="actions?.reset"
          type="button"
          class="customize-heading-action customize-reset-action"
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
    </div>

    <div class="preview-options">
      <slot />
    </div>
  </div>
</template>
