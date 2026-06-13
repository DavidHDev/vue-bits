import code from '@/content/Animations/ClickSpark/ClickSpark.vue?raw';
import { createCodeObject } from '@/types/code';

export const clickSpark = createCodeObject(code, 'Animations/ClickSpark', {
  usage: `<template>
  <ClickSpark
    spark-color="#ff6b6b"
    :spark-size="10"
    :spark-radius="15"
    :spark-count="8"
    :duration="400"
  >
    <!-- Your content here -->
    <div>
      Your content here
    </div>
  </ClickSpark>
</template>

<script setup lang="ts">
import ClickSpark from './ClickSpark.vue'
</script>`
});
