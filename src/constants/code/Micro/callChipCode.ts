import code from '@/content/Micro/CallChip/CallChip.vue?raw';
import { createCodeObject } from '@/types/code';

export const callChip = createCodeObject(code, 'Micro/CallChip', {
  usage: `<script setup>
import CallChip from './CallChip.vue'
</script>

<template>
<div :style="{ position: 'relative', width: '100%', height: '500px', background: '#050610' }">
  <CallChip
    icon="terminal"
    name="bash"
    argument="npm test"
    :status="call.status"
    :expectedMs="2500"
    :size="34"
    :radius="10"
    color="currentColor"
    surfaceColor="#27272a"
    progressColor="currentColor"
    :progressOpacity="0.08"
    doneColor="#22c55e"
    errorColor="#ef4444"
    :washOpacity="0.14"
    :shake="6"
    showTimer
    @retry="rerun(call.id)"
  />
</div>
</template>`
});
