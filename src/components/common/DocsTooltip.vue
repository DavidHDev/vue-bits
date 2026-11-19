<template>
  <span
    ref="anchorRef"
    class="docs-tooltip-anchor"
    @pointerover="onOver"
    @pointerout="onOut"
    @focusin="show(0)"
    @focusout="hide"
    @pointerdown="hide"
  >
    <slot />
  </span>
  <Teleport to="body">
    <div
      v-if="visible && position"
      class="docs-tooltip docs-tooltip--floating"
      role="tooltip"
      :data-placement="placement"
      :style="{ left: `${position.x}px`, top: `${position.y}px` }"
    >
      {{ label }}
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue';

const props = withDefaults(
  defineProps<{
    label: string;
    placement?: 'top' | 'bottom' | 'right' | 'left';
    gutter?: number;
    openDelay?: number;
    closeDelay?: number;
  }>(),
  { placement: 'top', gutter: 8, openDelay: 300, closeDelay: 80 }
);

const anchorRef = ref<HTMLElement | null>(null);
const visible = ref(false);
const position = ref<{ x: number; y: number } | null>(null);
let openTimer: ReturnType<typeof setTimeout> | undefined;
let closeTimer: ReturnType<typeof setTimeout> | undefined;

const target = () => (anchorRef.value?.firstElementChild as HTMLElement | null) ?? anchorRef.value;

function measure() {
  const el = target();
  if (!el) return;
  const rect = el.getBoundingClientRect();
  const g = props.gutter;
  if (props.placement === 'top') position.value = { x: rect.left + rect.width / 2, y: rect.top - g };
  else if (props.placement === 'bottom') position.value = { x: rect.left + rect.width / 2, y: rect.bottom + g };
  else if (props.placement === 'right') position.value = { x: rect.right + g, y: rect.top + rect.height / 2 };
  else position.value = { x: rect.left - g, y: rect.top + rect.height / 2 };
}

function show(delay = props.openDelay) {
  clearTimeout(closeTimer);
  clearTimeout(openTimer);
  openTimer = setTimeout(() => {
    measure();
    visible.value = true;
  }, delay);
}

function hide() {
  clearTimeout(openTimer);
  clearTimeout(closeTimer);
  closeTimer = setTimeout(() => (visible.value = false), props.closeDelay);
}

function onOver(event: PointerEvent) {
  if (event.pointerType === 'touch') return;
  const from = event.relatedTarget as Node | null;
  if (from && anchorRef.value?.contains(from)) return;
  show();
}

function onOut(event: PointerEvent) {
  const to = event.relatedTarget as Node | null;
  if (to && anchorRef.value?.contains(to)) return;
  hide();
}

onBeforeUnmount(() => {
  clearTimeout(openTimer);
  clearTimeout(closeTimer);
});
</script>

<style>
.docs-tooltip-anchor {
  display: contents;
}

.docs-tooltip--floating {
  position: fixed;
  z-index: 2000;
  animation: docs-tooltip-in var(--dur-tooltip) var(--ease-out);
}

.docs-tooltip--floating[data-placement='top'] {
  transform: translate(-50%, -100%);
}

.docs-tooltip--floating[data-placement='bottom'] {
  transform: translate(-50%, 0);
}

.docs-tooltip--floating[data-placement='right'] {
  transform: translate(0, -50%);
}

.docs-tooltip--floating[data-placement='left'] {
  transform: translate(-100%, -50%);
}

@keyframes docs-tooltip-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
