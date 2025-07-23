<template>
  <Motion
    tag="div"
    :class="className"
    :style="{ position: 'relative', overflow: 'hidden' }"
    :animate="{ height: isCompleted ? 0 : parentHeight }"
    :transition="{ type: 'spring', duration: 0.4 }"
  >
    <div v-if="!isCompleted">
      <SlideTransition
        :key="currentStep"
        :direction="direction"
        @height-ready="setParentHeight"
      >
        <slot />
      </SlideTransition>
    </div>
  </Motion>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Motion } from 'motion-v'
import SlideTransition from './SlideTransition.vue'

interface StepContentWrapperProps {
  isCompleted: boolean
  currentStep: number
  direction: number
  className?: string
}

defineProps<StepContentWrapperProps>()

const parentHeight = ref(0)

const setParentHeight = (height: number) => {
  parentHeight.value = height
}
</script>
