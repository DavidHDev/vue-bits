import code from '@/content/Micro/SlideCommit/SlideCommit.vue?raw';
import { createCodeObject } from '@/types/code';

export const slideCommit = createCodeObject(code, 'Micro/SlideCommit', {
  usage: `<script setup>
import SlideCommit from './SlideCommit.vue'

// return a promise to show the spinner: resolve unfurls the done pill, reject springs the handle home
const pay = () => api.charge(order.id)
</script>

<template>
<SlideCommit
  label="Slide to pay"
  doneLabel="Paid"
  errorLabel="Payment failed"
  :onConfirm="pay"
  trackColor="#262626"
  handleColor="#f5f5f5"
  successColor="#22c55e"
  dangerColor="#e5484d"
  :width="280"
  :height="56"
  :radius="28"
  :speed="50"
  :returnBounce="0.38"
  :landingDip="0.026"
  :holdMs="1500"
  @done="() => console.log('paid')"
  @error="reason => console.error(reason)"
/>
</template>`
});
