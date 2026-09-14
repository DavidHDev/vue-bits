<script setup lang="ts">
import { computed, ref, type Component } from 'vue';

export interface Method {
  key: string;
  label: string;
  icon?: Component | string;
}

const props = withDefaults(
  defineProps<{
    methods: Method[];
    selected: string;
    ariaLabel?: string;
  }>(),
  { ariaLabel: 'Options' }
);

const emit = defineEmits<{ select: [key: string] }>();

const buttonRefs = ref<(HTMLButtonElement | null)[]>([]);

const activeIndex = computed(() =>
  Math.max(
    0,
    props.methods.findIndex(m => m.key === props.selected)
  )
);

function focusAt(index: number) {
  const count = props.methods.length;
  const next = (index + count) % count;
  emit('select', props.methods[next].key);
  buttonRefs.value[next]?.focus();
}

function handleKeydown(event: KeyboardEvent) {
  switch (event.key) {
    case 'ArrowRight':
    case 'ArrowDown':
      event.preventDefault();
      focusAt(activeIndex.value + 1);
      break;
    case 'ArrowLeft':
    case 'ArrowUp':
      event.preventDefault();
      focusAt(activeIndex.value - 1);
      break;
    case 'Home':
      event.preventDefault();
      focusAt(0);
      break;
    case 'End':
      event.preventDefault();
      focusAt(props.methods.length - 1);
      break;
    default:
      break;
  }
}
</script>

<template>
  <div
    class="docs-segmented"
    role="radiogroup"
    :aria-label="ariaLabel"
    :style="{ '--seg-count': methods.length, '--seg-index': activeIndex }"
    @keydown="handleKeydown"
  >
    <span class="docs-segmented-indicator" aria-hidden="true" />
    <button
      v-for="(method, index) in methods"
      :key="method.key"
      :ref="el => (buttonRefs[index] = el as HTMLButtonElement | null)"
      type="button"
      role="radio"
      :aria-checked="method.key === selected"
      :tabindex="method.key === selected ? 0 : -1"
      class="docs-segment"
      :class="{ 'is-active': method.key === selected }"
      @click="emit('select', method.key)"
    >
      <span v-if="method.icon" class="docs-segment-icon" aria-hidden="true">
        <img v-if="typeof method.icon === 'string'" :src="method.icon" alt="" width="18" height="18" />
        <component :is="method.icon" v-else :size="18" />
      </span>
      <span class="docs-segment-label">{{ method.label }}</span>
    </button>
  </div>
</template>

<style scoped>
.docs-segmented {
  position: relative;
  display: grid;
  grid-template-columns: repeat(var(--seg-count, 2), 1fr);
  gap: 4px;
  padding: 4px;
  background-color: rgba(255, 255, 255, 0.04);
  border: 1px solid transparent;
  border-radius: var(--radius-md);
}

.docs-segmented-indicator {
  position: absolute;
  top: 4px;
  bottom: 4px;
  left: 4px;
  width: calc((100% - 8px - (var(--seg-count, 2) - 1) * 4px) / var(--seg-count, 2));
  border: 1px solid transparent;
  border-radius: calc(var(--radius-md) - 5px);
  background-color: rgba(255, 255, 255, 0.07);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.07);
  transform: translateX(calc(var(--seg-index, 0) * (100% + 4px)));
  transition: transform 200ms cubic-bezier(0.23, 1, 0.32, 1);
  pointer-events: none;
}

.docs-segment {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.65rem 0.75rem;
  background: transparent;
  border: none;
  border-radius: calc(var(--radius-md) - 5px);
  color: var(--text-muted);
  font-size: 0.9375rem;
  font-weight: 500;
  letter-spacing: -0.01em;
  cursor: pointer;
  transition: color var(--transition-base);
}

.docs-segment:hover {
  color: var(--text-primary);
}

.docs-segment.is-active {
  color: var(--color-accent);
}

.docs-segment:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.docs-segment-icon {
  display: inline-flex;
  align-items: center;
}

.docs-segment-icon img {
  width: 18px;
  height: 18px;
}

@media (prefers-reduced-motion: reduce) {
  .docs-segmented-indicator {
    transition: none;
  }
}
</style>
