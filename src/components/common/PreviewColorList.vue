<template>
  <div class="scrubber-palette">
    <div class="scrubber-palette-head">
      <span class="scrubber-palette-label">{{ title }}</span>
      <div class="scrubber-palette-actions">
        <button
          type="button"
          class="scrubber-palette-button"
          :disabled="colors.length <= min"
          aria-label="Remove a color"
          @click="remove"
        >
          <Minus :size="14" aria-hidden="true" />
        </button>
        <button
          type="button"
          class="scrubber-palette-button"
          :disabled="colors.length >= max"
          aria-label="Add a color"
          @click="add"
        >
          <Plus :size="14" aria-hidden="true" />
        </button>
      </div>
    </div>
    <div class="scrubber-palette-strip">
      <PreviewColorPickerCustom
        v-for="(color, index) in colors"
        :key="index"
        variant="swatch"
        :title="`${title} ${index + 1}`"
        :color="color"
        @change="value => update(index, value)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Minus, Plus } from 'lucide-vue-next';
import PreviewColorPickerCustom from './PreviewColorPickerCustom.vue';

const FRESH = ['#40ffaa', '#4079ff', '#ffd93d', '#ff6b6b', '#06b6d4', '#f97316', '#ec4899', '#a3e635'];

const props = withDefaults(
  defineProps<{
    title?: string;
    min?: number;
    max?: number;
  }>(),
  { title: 'Colors', min: 2, max: 8 }
);

const modelValue = defineModel<string[]>({ required: true });

const colors = computed(() => modelValue.value ?? []);

function update(index: number, value: string) {
  const next = [...colors.value];
  next[index] = value;
  modelValue.value = next;
}

function add() {
  if (colors.value.length >= props.max) return;
  const used = colors.value.map(color => color.toLowerCase());
  modelValue.value = [
    ...colors.value,
    FRESH.find(color => !used.includes(color)) ?? colors.value[colors.value.length - 1]
  ];
}

function remove() {
  if (colors.value.length > props.min) modelValue.value = colors.value.slice(0, -1);
}
</script>
