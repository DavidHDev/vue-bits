import code from '@content/Components/Stepper/Stepper.vue?raw';
import { createCodeObject } from '../../../types/code';

export const stepper = createCodeObject(code, 'Components/Stepper', {
  installation: `npm install motion-v`,
  usage: `<template>
  <Stepper
    :initial-step="1"
    :on-step-change="handleStepChange"
    :on-final-step-completed="handleFinalStepCompleted"
    back-button-text="Previous"
    next-button-text="Next"
  >
    <Step>
      <h2>Welcome to the Vue Bits stepper!</h2>
      <p>Check out the next step!</p>
    </Step>
    
    <Step>
      <h2>Step 2</h2>
      <img 
        style="height: 100px; width: 100%; object-fit: cover; border-radius: 15px; margin-top: 1em;" 
        src="https://example.com/image.jpg" 
        alt="Example"
      />
      <p>Custom step content!</p>
    </Step>
    
    <Step>
      <h2>How about an input?</h2>
      <input 
        v-model="name" 
        class="mt-2 px-3 py-2 border border-gray-300 rounded-md w-full" 
        placeholder="Your name?" 
      />
    </Step>
    
    <Step>
      <h2>Final Step</h2>
      <p>You made it!</p>
    </Step>
  </Stepper>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import Stepper from "./Stepper.vue"
  import Step from "./Step.vue"
  
  const name = ref('')
  
  const handleStepChange = (step: number) => {
    console.log('Step changed to:', step)
  }
  
  const handleFinalStepCompleted = () => {
    console.log('All steps completed!')
  }
</script>`
});