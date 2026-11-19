<template>
  <div class="bgc-switch" role="group" aria-label="Demo content" :style="{ '--bgc-index': index }">
    <span class="bgc-switch-pill" aria-hidden="true" />
    <DocsTooltip v-for="item in modes" :key="item.value" :label="item.label" placement="bottom">
      <button
        type="button"
        class="bgc-switch-button"
        :aria-label="item.label"
        :aria-pressed="mode === item.value"
        @click="emit('change', item.value)"
      >
        <HugeiconsIcon :icon="item.icon" :size="16" :stroke-width="1.6" aria-hidden="true" />
      </button>
    </DocsTooltip>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { HugeiconsIcon } from '@hugeicons/vue';
import DocsTooltip from './DocsTooltip.vue';
import type { DEMO_MODES } from './demoModes';
import type { DemoMode } from './previewStage';

const props = defineProps<{ modes: typeof DEMO_MODES; mode: DemoMode }>();

const emit = defineEmits<{ change: [mode: DemoMode] }>();

const index = computed(() =>
  Math.max(
    0,
    props.modes.findIndex(item => item.value === props.mode)
  )
);
</script>
