import code from '@/content/Micro/StatusMark/StatusMark.vue?raw';
import { createCodeObject } from '@/types/code';

export const statusMark = createCodeObject(code, 'Micro/StatusMark', {
  usage: `<script setup>
import StatusMark from './StatusMark.vue'
</script>

<template>
<!-- status: 'pending' | 'running' | 'done' | 'failed' | 'cancelled' -->
<StatusMark status="running" label="Draft supplier emails" />

<!-- determinate: pass progress from 0 to 1 while running -->
<StatusMark status="running" :progress="0.62" label="Uploading" />

<StatusMark
  :status="task.status"
  :progress="task.progress"
  label="Draft supplier emails"
  color="currentColor"
  doneColor="#22c55e"
  errorColor="#ef4444"
  :size="20"
  :strokeWidth="2"
  :dashes="8"
  :fontSize="14"
  :spinDuration="1100"
  :arcLength="0.68"
  :drawDuration="240"
  :fillOpacity="0.06"
  strike
  :strikeDelay="60"
/>
</template>`
});
