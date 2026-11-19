<template>
  <Teleport v-if="stage?.hasControls.value && stage.controls.value" :to="stage.controls.value">
    <button type="button" class="docs-refresh" :aria-label="label" @click="emit('click')">
      <HugeiconsIcon :icon="ReloadIcon" :size="16" :stroke-width="1.6" aria-hidden="true" />
    </button>
  </Teleport>
  <button
    v-else-if="!stage?.hasControls.value"
    type="button"
    class="docs-refresh"
    :aria-label="label"
    @click="emit('click')"
  >
    <HugeiconsIcon :icon="ReloadIcon" :size="16" :stroke-width="1.6" aria-hidden="true" />
  </button>
</template>

<script setup lang="ts">
import { HugeiconsIcon } from '@hugeicons/vue';
import { ReloadIcon } from '@hugeicons/core-free-icons';
import { usePreviewStage } from './previewStage';

withDefaults(defineProps<{ label?: string }>(), { label: 'Refresh animation' });

const emit = defineEmits<{ click: [] }>();

const stage = usePreviewStage();
</script>
