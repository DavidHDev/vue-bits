import code from '@/content/Animations/ClickSpark/ClickSpark.vue?raw';
import { createCodeObject } from '@/types/code';

export const clickSpark = createCodeObject(code, 'Animations/ClickSpark', {
  dependencies: '',
  usage: `<template>
  <ClickSpark
    spark-color="#fff"
    shape="line"
    :spark-count="8"
    :spark-size="14"
    :spark-radius="30"
    :duration="500"
  >
    <!-- Your content here -->
  </ClickSpark>
</template>

<script setup lang="ts">
import ClickSpark from './ClickSpark.vue'
</script>`
});
