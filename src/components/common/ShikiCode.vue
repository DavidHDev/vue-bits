<template>
  <div v-if="!html" :class="className">
    <pre class="shiki-fallback"><code>{{ source }}</code></pre>
  </div>
  <div v-else :class="className" v-html="html" />
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { highlightCode, peekHighlight } from '@/utils/shiki';

const props = withDefaults(defineProps<{ code: string; language?: string; showLineNumbers?: boolean }>(), {
  language: 'vue',
  showLineNumbers: true
});

const source = computed(() => String(props.code ?? ''));
const html = ref(peekHighlight(source.value, props.language));

const className = computed(
  () => `shiki-code${props.showLineNumbers ? ' has-line-numbers' : ''}${html.value ? '' : ' is-loading'}`
);

watch(
  [source, () => props.language],
  ([code, language], _, onCleanup) => {
    let active = true;
    onCleanup(() => {
      active = false;
    });
    html.value = peekHighlight(code, language);
    highlightCode(code, language)
      .then(result => {
        if (active) html.value = result;
      })
      .catch(error => {
        console.error('Failed to highlight code with Shiki:', error);
      });
  },
  { immediate: true }
);
</script>
