<template>
  <Motion
    tag="div"
    @click="handleClick"
    class="step-indicator"
    :animate="status"
    :initial="false"
  >
    <Motion
      tag="div"
      :variants="indicatorVariants"
      :transition="{ duration: 0.3 }"
      class="step-indicator-inner"
    >
      <CheckIcon v-if="status === 'complete'" class="check-icon" />
      <div v-else-if="status === 'active'" class="active-dot" />
      <span v-else class="step-number">{{ step }}</span>
    </Motion>
  </Motion>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Motion } from 'motion-v'
import CheckIcon from './CheckIcon.vue'

interface StepIndicatorProps {
  step: number
  currentStep: number
  disableStepIndicators?: boolean
  onStepClick?: (step: number) => void
}

const props = defineProps<StepIndicatorProps>()

const indicatorVariants = {
  inactive: { scale: 1, backgroundColor: '#222', color: '#a3a3a3' },
  active: { scale: 1, backgroundColor: '#27FF64', color: '#27FF64' },
  complete: { scale: 1, backgroundColor: '#27FF64', color: '#3b82f6' },
}

const status = computed(() => {
  if (props.currentStep > props.step) return 'complete'
  if (props.currentStep === props.step) return 'active'
  return 'inactive'
})

const handleClick = () => {
  if (!props.disableStepIndicators && props.onStepClick) {
    props.onStepClick(props.step)
  }
}
</script>

<style scoped>
.step-indicator {
  position: relative;
  cursor: pointer;
  outline: none;
}

.step-indicator-inner {
  display: flex;
  height: 2rem;
  width: 2rem;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  font-weight: 600;
}

.active-dot {
  height: 0.75rem;
  width: 0.75rem;
  border-radius: 9999px;
  background-color: #fff;
}

.step-number {
  font-size: 0.875rem;
}

.check-icon {
  height: 1rem;
  width: 1rem;
  color: #fff;
  stroke: #fff !important;
  fill: none !important;
}
</style>
