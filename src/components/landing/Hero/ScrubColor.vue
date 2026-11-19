<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue';

const props = defineProps<{ value: string; swatches: string[]; label: string }>();
const emit = defineEmits<{ change: [value: string] }>();

const open = ref(false);
const root = ref<HTMLElement | null>(null);

const onDown = (event: PointerEvent) => {
  if (!root.value?.contains(event.target as Node)) open.value = false;
};
const onKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape') open.value = false;
};

const detach = () => {
  document.removeEventListener('pointerdown', onDown);
  document.removeEventListener('keydown', onKey);
};

watch(open, isOpen => {
  detach();
  if (!isOpen) return;
  document.addEventListener('pointerdown', onDown);
  document.addEventListener('keydown', onKey);
});

onBeforeUnmount(detach);

const isPressed = (color: string) => color.toLowerCase() === String(props.value).toLowerCase();
</script>

<template>
  <span ref="root" class="lh-color">
    <button type="button" class="lh-scrub lh-value" :aria-label="label" :aria-expanded="open" @click="open = !open">
      <i :style="{ background: value }" />
      {{ `"${value}"` }}
    </button>
    <span v-if="open" class="lh-swatches">
      <button
        v-for="color in swatches"
        :key="color"
        type="button"
        :aria-label="color"
        :aria-pressed="isPressed(color)"
        :style="{ '--swatch': color }"
        @click="emit('change', color)"
      />
    </span>
  </span>
</template>
