<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

const props = defineProps<{ command: string; output: string[] }>();

const typed = ref(0);
const shown = ref(0);
let timer = 0;

const later = (fn: () => void, ms: number) => {
  timer = window.setTimeout(fn, ms);
};

const reveal = (count: number) => {
  shown.value = count;
  if (count < props.output.length) later(() => reveal(count + 1), 560);
};

const type = (count: number) => {
  typed.value = count;
  if (count < props.command.length) later(() => type(count + 1), 18 + ((count * 37) % 29));
  else later(() => reveal(1), 480);
};

const begin = () => {
  if (document.querySelector('.landing-wrapper.ln-loading')) later(begin, 200);
  else later(() => type(1), 1500);
};

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    typed.value = props.command.length;
    shown.value = props.output.length;
    return;
  }
  begin();
});

onBeforeUnmount(() => window.clearTimeout(timer));

const typing = computed(() => typed.value < props.command.length);
const done = computed(() => shown.value >= props.output.length);
</script>

<template>
  <div class="lh-term">
    <div class="lh-term-line">
      <span class="lh-term-prompt">$</span>
      {{ command.slice(0, typed) }}
      <span v-if="typing && typed > 0" class="lh-caret" />
      <span class="lh-term-rest">{{ command.slice(typed) }}</span>
    </div>
    <div
      v-for="(line, index) in output"
      :key="line"
      class="lh-term-line lh-term-out"
      :data-shown="index < shown ? '' : undefined"
    >
      <span class="lh-term-ok">{{ line.slice(0, 1) }}</span>
      {{ line.slice(1) }}
      <span v-if="done && index === output.length - 1" class="lh-caret lh-caret--idle" />
    </div>
  </div>
</template>
