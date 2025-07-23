<template>
  <div class="step-connector">
    <Motion
      tag="div"
      class="step-connector-inner"
      :variants="lineVariants"
      :initial="false"
      :animate="isComplete ? 'complete' : 'incomplete'"
      :transition="{ duration: 0.4 }"
    />
  </div>
</template>

<script setup lang="ts">
import { Motion } from 'motion-v'

interface StepConnectorProps {
  isComplete: boolean
}

defineProps<StepConnectorProps>()

const lineVariants = {
  incomplete: { width: 0, backgroundColor: "transparent" },
  complete: { width: "100%", backgroundColor: "#27FF64" },
}
</script>

<style scoped>
.step-connector {
  position: relative;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
  height: 0.125rem;
  flex: 1;
  overflow: hidden;
  border-radius: 0.25rem;
  background-color: #52525b;
}

.step-connector-inner {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
}
</style>
