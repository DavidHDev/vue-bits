import code from '@/content/Animations/GradualBlur/GradualBlur.vue?raw';
import { createCodeObject } from '@/types/code';

export const gradualBlur = createCodeObject(code, 'Animations/GradualBlur', {
  installation: `npm install mathjs`,
  usage: `

<script setup lang="ts">
  import GradualBlur from "./GradualBlur.vue";
</script>`
});
