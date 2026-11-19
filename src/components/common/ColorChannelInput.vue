<template>
  <label class="cp-channel">
    <input
      class="cp-input cp-input--number"
      inputmode="decimal"
      :value="draft"
      :aria-label="label"
      @focus="onFocus"
      @input="draft = ($event.target as HTMLInputElement).value"
      @blur="onBlur"
      @keydown="onKeyDown"
    />
    <span class="cp-channel-label">{{ label }}{{ suffix }}</span>
  </label>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = withDefaults(
  defineProps<{
    label: string;
    value: number;
    min: number;
    max: number;
    suffix?: string;
  }>(),
  { suffix: '' }
);

const emit = defineEmits<{ commit: [value: number] }>();

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const draft = ref(String(props.value));
const focused = ref(false);

watch(
  () => [props.value, focused.value] as const,
  ([value, isFocused]) => {
    if (!isFocused) draft.value = String(value);
  }
);

function commitText(text: string) {
  const parsed = parseFloat(text);
  if (Number.isFinite(parsed)) emit('commit', clamp(parsed, props.min, props.max));
  else draft.value = String(props.value);
}

function onFocus(event: FocusEvent) {
  focused.value = true;
  (event.target as HTMLInputElement).select();
}

function onBlur() {
  focused.value = false;
  commitText(draft.value);
}

function onKeyDown(event: KeyboardEvent) {
  const input = event.currentTarget as HTMLInputElement;
  if (event.key === 'Enter') {
    commitText(draft.value);
    input.select();
  } else if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
    event.preventDefault();
    const delta = (event.key === 'ArrowUp' ? 1 : -1) * (event.shiftKey ? 10 : 1);
    const next = clamp((parseFloat(draft.value) || 0) + delta, props.min, props.max);
    draft.value = String(next);
    emit('commit', next);
  }
}
</script>
