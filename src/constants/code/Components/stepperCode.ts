import code from '@/content/Components/Stepper/Stepper.vue?raw';
import { createCodeObject } from '@/types/code';

export const stepper = createCodeObject(code, 'Components/Stepper', {
  installation: `npm install @hugeicons/vue @hugeicons/core-free-icons`,
  usage: `<template>
  <Stepper
    :initial-step="1"
    back-button-text="Back"
    next-button-text="Continue"
    @step-change="handleStepChange"
    @final-step-completed="handleFinalStepCompleted"
  >
    <Step title="Welcome">
      <h3>Welcome aboard</h3>
      <p>Set up your workspace in a few quick steps.</p>
    </Step>
    <Step title="Plan">
      <h3>Choose a plan</h3>
      <p>You can change this at any time.</p>
    </Step>
    <Step title="Profile">
      <h3>What should we call you?</h3>
      <input placeholder="Your name" />
    </Step>
    <Step title="Review">
      <h3>Looking good</h3>
      <p>Complete setup to open your workspace.</p>
    </Step>
  </Stepper>
</template>

<script setup lang="ts">
import Stepper, { Step } from './Stepper.vue';

const handleStepChange = (step: number) => console.log(step);
const handleFinalStepCompleted = () => console.log('All steps completed!');
</script>`
});
