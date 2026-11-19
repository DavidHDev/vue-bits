<template>
  <template v-if="frame">
    <div
      class="preview-resize-handle"
      role="separator"
      tabindex="0"
      aria-orientation="vertical"
      aria-label="Drag to resize preview"
      :aria-valuemin="MIN_PREVIEW_WIDTH"
      :aria-valuemax="frame.fullWidth"
      :aria-valuenow="Math.round(current)"
      :data-dragging="dragging ? '' : undefined"
      :style="{
        top: `${frame.top + HANDLE_INSET}px`,
        left: `${frame.left + current}px`,
        height: `${Math.max(0, frame.height - HANDLE_INSET * 2)}px`
      }"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="finishDrag"
      @pointercancel="finishDrag"
      @lostpointercapture="finishDrag"
      @dblclick="emit('widthChange', null)"
      @keydown="onKeyDown"
    >
      <span class="preview-resize-bar" />
      <GripVertical class="preview-resize-grip" aria-hidden="true" />
    </div>
    <div
      class="preview-width-indicator"
      aria-hidden="true"
      :data-visible="dragging || (showIndicator && width !== null) ? '' : undefined"
      :style="{ top: `${frame.top + frame.height}px`, left: `${frame.left + frame.fullWidth / 2}px` }"
    >
      {{ Math.round(current) }}px
    </div>
  </template>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import { GripVertical } from 'lucide-vue-next';
import { MIN_PREVIEW_WIDTH, type PreviewFrame } from '@/composables/usePreviewFrame';

const INDICATOR_MS = 2000;
const KEY_STEP = 10;
const KEY_STEP_LARGE = 50;
const HANDLE_INSET = 32;

const props = defineProps<{ frame: PreviewFrame | null; width: number | null }>();

const emit = defineEmits<{ widthChange: [width: number | null]; resizingChange: [resizing: boolean] }>();

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const dragging = ref(false);
const showIndicator = ref(false);
let drag: { id: number; startX: number; startWidth: number } | null = null;
let hideTimer: ReturnType<typeof setTimeout> | undefined;
let pendingWidth: number | null = null;
let resizeRaf = 0;

const current = computed(() => props.width ?? props.frame?.fullWidth ?? 0);

watch(
  () => props.width,
  width => {
    if (width === null) {
      showIndicator.value = false;
      return;
    }
    showIndicator.value = true;
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => (showIndicator.value = false), INDICATOR_MS);
  }
);

onBeforeUnmount(() => {
  clearTimeout(hideTimer);
  cancelAnimationFrame(resizeRaf);
  delete document.documentElement.dataset.previewResizing;
});

function commit(next: number) {
  if (!props.frame) return;
  const rounded = Math.round(clamp(next, MIN_PREVIEW_WIDTH, props.frame.fullWidth));
  emit('widthChange', rounded >= props.frame.fullWidth ? null : rounded);
}

function flushWidth() {
  cancelAnimationFrame(resizeRaf);
  resizeRaf = 0;
  if (pendingWidth === null) return;
  const next = pendingWidth;
  pendingWidth = null;
  commit(next);
}

function finishDrag(event: PointerEvent) {
  if (drag?.id !== event.pointerId) return;
  flushWidth();
  drag = null;
  dragging.value = false;
  emit('resizingChange', false);
  delete document.documentElement.dataset.previewResizing;
}

function onPointerDown(event: PointerEvent) {
  if (event.button !== 0) return;
  event.preventDefault();
  (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
  drag = { id: event.pointerId, startX: event.clientX, startWidth: current.value };
  dragging.value = true;
  emit('resizingChange', true);
  document.documentElement.dataset.previewResizing = '';
}

function onPointerMove(event: PointerEvent) {
  if (drag?.id !== event.pointerId) return;
  pendingWidth = drag.startWidth + event.clientX - drag.startX;
  if (!resizeRaf) resizeRaf = requestAnimationFrame(flushWidth);
}

function onKeyDown(event: KeyboardEvent) {
  if (!props.frame) return;
  const step = event.shiftKey ? KEY_STEP_LARGE : KEY_STEP;
  const targets: Record<string, number> = {
    ArrowLeft: current.value - step,
    ArrowRight: current.value + step,
    Home: MIN_PREVIEW_WIDTH,
    End: props.frame.fullWidth
  };
  if (!(event.key in targets)) return;
  event.preventDefault();
  commit(targets[event.key]);
}
</script>
