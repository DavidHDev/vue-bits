import code from '@content/Backgrounds/Prism/Prism.vue?raw';
import { createCodeObject } from '../../../types/code';

export const prism = createCodeObject(code, 'Backgrounds/Prism', {
  installation: `npm install ogl`,
  usage: `
<script setup lang="ts">
  import Prism from "./Prism.vue";
</script>`
});
