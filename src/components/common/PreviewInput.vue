<template>
  <div class="scrubber">
    <div class="scrubber-track scrubber-track--input" :data-disabled="isDisabled">
      <span class="scrubber-label">{{ title }}</span>
      <input
        class="scrubber-input"
        type="text"
        :value="modelValue"
        :placeholder="placeholder"
        :maxlength="maxlength"
        :disabled="isDisabled"
        :aria-label="title"
        @input="modelValue = ($event.target as HTMLInputElement).value"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const {
  title = '',
  placeholder = '',
  maxlength,
  isDisabled = false
} = defineProps<{
  title?: string;
  placeholder?: string;
  maxlength?: number;
  isDisabled?: boolean;
}>();

const modelValue = defineModel<string>({ default: '' });
</script>
