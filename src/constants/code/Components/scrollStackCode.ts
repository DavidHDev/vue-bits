import code from '@content/Components/ScrollStack/ScrollStack.vue?raw';
import { createCodeObject } from '../../../types/code';

export const scrollStack = createCodeObject(code, 'Components/ScrollStack', {
  installation: `npm install lenis`,
  usage: `<template>
    <ScrollStack>
        <ScrollStackItem>
            <h2>Card 1</h2>
            <p>This is the first card in the stack</p>
        </ScrollStackItem>
        <ScrollStackItem>
            <h2>Card 2</h2>
            <p>This is the second card in the stack</p>
        </ScrollStackItem>
        <ScrollStackItem>
            <h2>Card 3</h2>
            <p>This is the third card in the stack</p>
        </ScrollStackItem>
    </ScrollStack>
</template>

<script setup lang="ts">
  import ScrollStack, { ScrollStackItem } from "./ScrollStack.vue";
</script>`
});
