<template>
  <div class="scrubber" ref="rootEl" style="position: relative">
    <button
      type="button"
      class="scrubber-track scrubber-track--select"
      aria-haspopup="listbox"
      :aria-expanded="open"
      :aria-label="title"
      :aria-disabled="isDisabled"
      :data-disabled="isDisabled"
      :data-active="open"
      :tabindex="isDisabled ? -1 : 0"
      @click="!isDisabled && (open = !open)"
    >
      <span class="scrubber-label">{{ title }}</span>
      <span class="scrubber-select-right">
        <span class="scrubber-value">{{ current?.label ?? modelValue }}</span>
        <svg
          :class="['scrubber-caret', { 'scrubber-caret--open': open }]"
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M4 6l4 4 4-4"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </span>
    </button>

    <div v-if="open" class="scrubber-dropdown" role="listbox">
      <button
        v-for="opt in normalized"
        :key="opt.value"
        type="button"
        :class="['scrubber-dropdown-item', { 'scrubber-dropdown-item--active': opt.value === modelValue }]"
        role="option"
        :aria-selected="opt.value === modelValue"
        @click="pick(opt.value)"
      >
        {{ opt.label }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue';

type Option = { label: string; value: string };

const {
  title = '',
  isDisabled = false,
  options = []
} = defineProps<{
  title?: string;
  isDisabled?: boolean;
  options?: Option[] | string[];
}>();

const modelValue = defineModel<string | number>({ default: '' });

const open = ref(false);
const rootEl = ref<HTMLDivElement | null>(null);

const normalized = computed<Option[]>(() => options.map(o => (typeof o === 'string' ? { label: o, value: o } : o)));

const current = computed(() => normalized.value.find(o => o.value === modelValue.value));

function pick(v: string) {
  modelValue.value = v;
  open.value = false;
}

function onOutsideClick(e: MouseEvent) {
  if (rootEl.value && !rootEl.value.contains(e.target as Node)) open.value = false;
}

watch(open, v => {
  if (v) document.addEventListener('mousedown', onOutsideClick);
  else document.removeEventListener('mousedown', onOutsideClick);
});

onUnmounted(() => document.removeEventListener('mousedown', onOutsideClick));
</script>
