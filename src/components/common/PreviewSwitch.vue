<template>
  <div class="scrubber">
    <button
      type="button"
      class="scrubber-track scrubber-track--switch"
      role="switch"
      :aria-checked="checked"
      :aria-label="title"
      :aria-disabled="isDisabled"
      :data-disabled="isDisabled"
      :data-checked="checked"
      :tabindex="isDisabled ? -1 : 0"
      @click="toggle"
      @keydown="onKeyDown"
    >
      <span class="scrubber-label">{{ title }}</span>
      <span class="scrubber-switch-toggle">
        <span class="scrubber-switch-knob" />
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    title?: string;
    isDisabled?: boolean;
    isChecked?: boolean;
  }>(),
  { title: '', isDisabled: false, isChecked: undefined }
);

const emit = defineEmits<{ change: [value: boolean] }>();

const modelValue = defineModel<boolean>({ default: false });

const checked = computed(() => (props.isChecked !== undefined ? props.isChecked : modelValue.value));

function toggle() {
  if (props.isDisabled) return;
  const next = !checked.value;
  modelValue.value = next;
  emit('change', next);
}

function onKeyDown(e: KeyboardEvent) {
  if (e.key === ' ' || e.key === 'Enter') {
    e.preventDefault();
    toggle();
  }
}
</script>
