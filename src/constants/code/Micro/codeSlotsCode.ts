import code from '@/content/Micro/CodeSlots/CodeSlots.vue?raw';
import { createCodeObject } from '@/types/code';

export const codeSlots = createCodeObject(code, 'Micro/CodeSlots', {
  usage: `<script setup>
import { ref } from 'vue';
import CodeSlots from './CodeSlots.vue';

const status = ref('idle');

const handleComplete = async (code) => {
  const ok = await verify(code);
  status.value = ok ? 'success' : 'error';
};
</script>

<template>
  <CodeSlots
    :length="6"
    :status="status"
    accentColor="#f5f5f5"
    inkColor="#f5f5f5"
    slotColor="#27272a"
    digitColor="#18181b"
    dangerColor="#ff3b30"
    :slotSize="44"
    :gap="8"
    :radius="12"
    :bounce="0.2"
    :settle="0.3"
    :rise="8"
    :cascade="20"
    @change="status = 'idle'"
    @complete="handleComplete"
  />
</template>`
});
