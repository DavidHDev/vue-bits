<template>
  <span ref="anchorRef" class="docs-menu-anchor" @click="toggle" @keydown="onTriggerKey">
    <slot name="trigger" :open="open" />
  </span>
  <Teleport to="body">
    <div
      v-if="open"
      ref="contentRef"
      role="menu"
      tabindex="-1"
      :class="[contentClass, fluid ? 'docs-menu docs-menu--fluid' : '']"
      :style="contentStyle"
      @keydown="onContentKey"
      @pointermove="onPointerMove"
      @pointerleave="onPointerLeave"
    >
      <slot :close="close" />
      <motion.div
        v-if="fluid && box"
        aria-hidden="true"
        data-menu-highlight=""
        :initial="false"
        :animate="{ x: box.x, y: box.y, width: box.width, height: box.height, opacity: box.visible ? 1 : 0 }"
        :transition="
          reduceMotion
            ? { duration: 0 }
            : { type: 'spring', stiffness: 550, damping: 42, mass: 0.7, opacity: { duration: 0.12 } }
        "
        :style="{
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 0,
          borderRadius: '9px',
          background: 'var(--menu-highlight)',
          pointerEvents: 'none'
        }"
      />
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, provide, ref, watch } from 'vue';
import { motion, useReducedMotion } from 'motion-v';
import { DOCS_MENU } from './docsMenu';

const props = withDefaults(
  defineProps<{
    placement?: 'bottom-end' | 'bottom-start';
    gutter?: number;
    offset?: number;
    minWidth?: string;
    zIndex?: number;
    contentClass?: string;
    fluid?: boolean;
    transformOrigin?: string;
  }>(),
  {
    placement: 'bottom-end',
    gutter: 8,
    offset: 0,
    minWidth: undefined,
    zIndex: 1500,
    contentClass: '',
    fluid: true,
    transformOrigin: undefined
  }
);

const emit = defineEmits<{ openChange: [open: boolean] }>();

const reduceMotion = useReducedMotion();
const open = ref(false);
const anchorRef = ref<HTMLElement | null>(null);
const contentRef = ref<HTMLElement | null>(null);
const rect = ref<DOMRect | null>(null);
const highlighted = ref<HTMLElement | null>(null);
const box = ref<{ x: number; y: number; width: number; height: number; visible: boolean } | null>(null);
let observer: ResizeObserver | null = null;

const trigger = () => (anchorRef.value?.firstElementChild as HTMLElement | null) ?? anchorRef.value;

const contentStyle = computed(() => {
  const r = rect.value;
  const style: Record<string, string | number> = {
    position: 'fixed',
    zIndex: props.zIndex,
    isolation: 'isolate',
    transformOrigin: props.transformOrigin ?? (props.placement === 'bottom-end' ? 'top right' : 'top left')
  };
  if (props.minWidth) style.minWidth = props.minWidth;
  if (!r) return style;
  style.top = `${r.bottom + props.gutter + props.offset}px`;
  if (props.placement === 'bottom-end') style.right = `${Math.max(0, window.innerWidth - r.right)}px`;
  else style.left = `${r.left}px`;
  return style;
});

const items = () =>
  Array.from(contentRef.value?.querySelectorAll<HTMLElement>('[data-part="item"]:not([data-disabled])') ?? []);

const measureBox = (activate: boolean) => {
  const item = highlighted.value;
  if (!item || !props.fluid) return;
  const next = {
    x: item.offsetLeft,
    y: item.offsetTop,
    width: item.offsetWidth,
    height: item.offsetHeight,
    visible: activate || box.value?.visible || false
  };
  const prev = box.value;
  if (
    prev &&
    prev.x === next.x &&
    prev.y === next.y &&
    prev.width === next.width &&
    prev.height === next.height &&
    prev.visible === next.visible
  )
    return;
  box.value = next;
};

const highlight = (el: HTMLElement | null) => {
  if (highlighted.value === el) return;
  highlighted.value?.removeAttribute('data-highlighted');
  highlighted.value = el;
  if (el) {
    el.setAttribute('data-highlighted', '');
    measureBox(true);
  }
};

const updateRect = () => {
  const el = trigger();
  if (el) rect.value = el.getBoundingClientRect();
};

const onDocPointer = (event: PointerEvent) => {
  const target = event.target as Node;
  if (anchorRef.value?.contains(target) || contentRef.value?.contains(target)) return;
  close();
};

const onDocKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape') close(true);
};

const detach = () => {
  document.removeEventListener('pointerdown', onDocPointer, true);
  document.removeEventListener('keydown', onDocKey);
  window.removeEventListener('scroll', updateRect, true);
  window.removeEventListener('resize', updateRect);
  observer?.disconnect();
  observer = null;
};

function close(focusTrigger = false) {
  open.value = false;
  if (focusTrigger) trigger()?.focus({ preventScroll: true });
}

function toggle() {
  open.value = !open.value;
}

watch(open, async value => {
  emit('openChange', value);
  trigger()?.setAttribute('data-state', value ? 'open' : 'closed');
  if (!value) {
    detach();
    highlighted.value = null;
    box.value = null;
    return;
  }
  updateRect();
  document.addEventListener('pointerdown', onDocPointer, true);
  document.addEventListener('keydown', onDocKey);
  window.addEventListener('scroll', updateRect, true);
  window.addEventListener('resize', updateRect);
  await nextTick();
  contentRef.value?.focus({ preventScroll: true });
  if (contentRef.value) {
    observer = new ResizeObserver(() => measureBox(false));
    observer.observe(contentRef.value);
  }
});

function onTriggerKey(event: KeyboardEvent) {
  if (event.key === 'ArrowDown' && !open.value) {
    event.preventDefault();
    open.value = true;
    nextTick(() => highlight(items()[0] ?? null));
  }
}

function onContentKey(event: KeyboardEvent) {
  const list = items();
  if (!list.length) return;
  const index = highlighted.value ? list.indexOf(highlighted.value) : -1;
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault();
    const delta = event.key === 'ArrowDown' ? 1 : -1;
    highlight(list[(index + delta + list.length) % list.length]);
    if (box.value) box.value = { ...box.value, visible: true };
  } else if (event.key === 'Home' || event.key === 'End') {
    event.preventDefault();
    highlight(event.key === 'Home' ? list[0] : list[list.length - 1]);
  } else if ((event.key === 'Enter' || event.key === ' ') && highlighted.value) {
    event.preventDefault();
    highlighted.value.click();
  } else if (event.key === 'Tab') {
    close();
  }
}

function onPointerMove(event: PointerEvent) {
  if (event.pointerType !== 'mouse') return;
  const item = (event.target as HTMLElement).closest<HTMLElement>('[data-part="item"]:not([data-disabled])');
  if (item) {
    highlight(item);
    if (box.value && !box.value.visible) box.value = { ...box.value, visible: true };
  }
}

function onPointerLeave() {
  if (box.value) box.value = { ...box.value, visible: false };
  highlighted.value?.removeAttribute('data-highlighted');
  highlighted.value = null;
}

provide(DOCS_MENU, { highlighted, highlight, close });

onBeforeUnmount(detach);

defineExpose({ close, open });
</script>

<style>
.docs-menu-anchor {
  display: contents;
}

.docs-menu--fluid {
  position: relative;
}

.docs-menu--fluid [data-part='item'] {
  position: relative;
  z-index: 1;
  background: transparent;
}

.docs-menu--fluid [data-part='item']:hover,
.docs-menu--fluid [data-part='item'][data-highlighted] {
  background: transparent;
}

[role='menu'].docs-menu,
[role='menu'].install-options-menu {
  outline: none;
  animation: docs-menu-in var(--dur-menu) var(--ease-out);
}

@keyframes docs-menu-in {
  from {
    opacity: 0;
    transform: scale(0.96);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  [role='menu'].docs-menu,
  [role='menu'].install-options-menu {
    animation: none;
  }
}
</style>
