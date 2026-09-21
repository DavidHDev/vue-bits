import code from '@/content/Micro/SpringCheck/SpringCheck.vue?raw';
import { createCodeObject } from '@/types/code';

export const springCheck = createCodeObject(code, 'Micro/SpringCheck', {
  usage: `<script setup>
import { ref } from 'vue'
import SpringCheck from './SpringCheck.vue'

const done = ref(false)
</script>

<template>
<SpringCheck
  label="Ship the build"
  :checked="done"
  color="#ffffff"
  fillColor="#ffffff"
  checkColor="#0b0b0f"
  :boxSize="28"
  :boxRadius="9"
  :fontSize="18"
  :bounce="0.2"
  :strikeLag="0.12"
  :doneOpacity="0.42"
  strike="left"
  @change="checked => (done = checked)"
/>

<!-- rich label: use the slot and give it an accessible name -->
<SpringCheck ariaLabel="Accept the terms">
  I agree to the <a href="/terms">terms</a>
</SpringCheck>
</template>`
});
