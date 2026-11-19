<template>
  <div ref="wrapRef" class="scrubber" style="position: relative">
    <button
      type="button"
      class="scrubber-track scrubber-track--select"
      :aria-label="title"
      :aria-disabled="isDisabled"
      :data-disabled="isDisabled"
      :tabindex="isDisabled ? -1 : 0"
      @click="toggle"
    >
      <span class="scrubber-label">{{ title }}</span>
      <span class="scrubber-select-right">
        <span class="scrubber-value">{{ currentLabel }}</span>
        <svg
          class="scrubber-caret"
          :class="{ 'scrubber-caret--open': open }"
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

    <Teleport to="body">
      <div v-if="open && rect" ref="dropdownRef" class="scrubber-dropdown" :style="dropdownStyle">
        <button
          v-for="opt in formattedOptions"
          :key="String(opt.value)"
          type="button"
          class="scrubber-dropdown-item"
          :class="{ 'scrubber-dropdown-item--active': opt.value === modelValue }"
          @click="pick(opt.value)"
        >
          {{ opt.label }}
        </button>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';

type OptionValue = string | number;
type Option = { label?: string; value: OptionValue; [key: string]: unknown };

const LABEL_OVERRIDES: Record<string, string> = { pingpong: 'Ping Pong', rotate3d: 'Rotate 3D' };
const formatOptionLabel = (str: string) =>
  LABEL_OVERRIDES[str] ?? str.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

const props = withDefaults(
  defineProps<{
    title?: string;
    options?: (Option | string | number)[];
    isDisabled?: boolean;
    width?: number | string;
  }>(),
  { title: '', options: () => [], isDisabled: false }
);

const modelValue = defineModel<OptionValue>({ default: '' });

const open = ref(false);
const rect = ref<DOMRect | null>(null);
const wrapRef = ref<HTMLDivElement | null>(null);
const dropdownRef = ref<HTMLDivElement | null>(null);

const formattedOptions = computed(() =>
  props.options.map(opt =>
    typeof opt === 'string'
      ? { value: opt as OptionValue, label: formatOptionLabel(opt) }
      : typeof opt === 'object' && opt !== null
        ? { ...opt, label: opt.label != null ? opt.label : formatOptionLabel(String(opt.value)) }
        : { value: opt as OptionValue, label: String(opt) }
  )
);

const currentLabel = computed(() => {
  const found = formattedOptions.value.find(opt => opt.value === modelValue.value);
  return found ? found.label : String(modelValue.value ?? '');
});

function toggle() {
  if (props.isDisabled) return;
  open.value = !open.value;
}

function pick(value: OptionValue) {
  modelValue.value = value;
  open.value = false;
}

const onPointerDown = (e: PointerEvent) => {
  const target = e.target as Node;
  const inTrigger = wrapRef.value?.contains(target);
  const inDropdown = dropdownRef.value?.contains(target);
  if (!inTrigger && !inDropdown) open.value = false;
};

const updatePosition = () => {
  if (wrapRef.value) rect.value = wrapRef.value.getBoundingClientRect();
};

const dropdownStyle = computed(() => {
  const box = rect.value;
  if (!box) return {};
  const viewport = typeof window === 'undefined' ? 800 : window.innerHeight;
  const estimate = formattedOptions.value.length * 35 + 10;
  const below = viewport - box.bottom - 12;
  const above = box.top - 12;
  const flip = below < Math.min(estimate, 240) && above > below;
  const room = Math.max(120, flip ? above : below);
  return {
    position: 'fixed' as const,
    ...(flip
      ? { bottom: `${viewport - box.top + 4}px`, transformOrigin: 'bottom center' }
      : { top: `${box.bottom + 4}px` }),
    left: `${box.left}px`,
    right: 'auto',
    width: `${box.width}px`,
    maxHeight: `${room}px`,
    overflowY: 'auto' as const,
    zIndex: 9999
  };
});

const detach = () => {
  document.removeEventListener('pointerdown', onPointerDown);
  window.removeEventListener('scroll', updatePosition, true);
  window.removeEventListener('resize', updatePosition);
};

watch(open, value => {
  if (value) {
    updatePosition();
    document.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
  } else {
    detach();
  }
});

onBeforeUnmount(detach);
</script>
