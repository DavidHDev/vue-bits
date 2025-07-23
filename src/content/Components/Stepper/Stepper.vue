
<template>
  <div class="outer-container" v-bind="$attrs">
    <div
      :class="`step-circle-container ${stepCircleContainerClassName}`"
      style="border: 1px solid #222"
    >
      <div :class="`step-indicator-row ${stepContainerClassName}`">
        <template v-for="(_, index) in stepsArray" :key="index + 1">
          <StepIndicator
            v-if="!renderStepIndicator"
            :step="index + 1"
            :disable-step-indicators="disableStepIndicators"
            :current-step="currentStep"
            :on-step-click="(clickedStep) => {
              direction = clickedStep > currentStep ? 1 : -1
              updateStep(clickedStep)
            }"
          />
          <component
            v-else
            :is="renderStepIndicator"
            :step="index + 1"
            :current-step="currentStep"
            :on-step-click="(clicked) => {
              if (clicked !== currentStep && !props.disableStepIndicators) {
                direction = clicked > currentStep ? 1 : -1
                updateStep(clicked)
              }
            }"
          />

          <StepConnector
            v-if="index < totalSteps - 1"
            :is-complete="currentStep > index + 1"
          />
        </template>
      </div>

      <StepContentWrapper
        v-show="!isCompleted"
        :is-completed="isCompleted"
        :current-step="currentStep"
        :direction="direction"
        :class="`step-content-default ${contentClassName}`"
      >
        <div v-if="slots.default">
          <div v-for="(vnode, index) in slots.default()" :key="index">
            <div v-if="index === currentStep - 1">
              <component :is="vnode" />
            </div>
          </div>
        </div>
      </StepContentWrapper>

      <div v-if="!isCompleted" :class="`footer-container ${footerClassName}`">
        <div :class="`footer-nav ${currentStep !== 1 ? 'spread' : 'end'}`">
          <button
            v-if="currentStep !== 1"
            @click="() => {
              if (!backButtonProps?.disabled) {
                handleBack()
              }
            }"
            :class="`back-button ${currentStep === 1 ? 'inactive' : ''}`"
            v-bind="backButtonProps"
          >
            {{ backButtonText }}
          </button>
          <button
            @click="() => {
              if (!nextButtonProps?.disabled) {
                isLastStep ? handleComplete() : handleNext()
              }
            }"
            class="next-button"
            :disabled="nextButtonProps?.disabled"
          >
            {{ isLastStep ? 'Complete' : nextButtonText }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, useSlots, watch, onMounted, type VNode, type HTMLAttributes, type ButtonHTMLAttributes } from 'vue'
import StepIndicator from './StepIndicator.vue'
import StepConnector from './StepConnector.vue'
import StepContentWrapper from './StepContentWrapper.vue'

interface RenderStepIndicatorProps {
  step: number
  currentStep: number
  onStepClick: (clicked: number) => void
}

interface StepperProps extends /* @vue-ignore */ HTMLAttributes {
  children?: VNode[]
  initialStep?: number
  onStepChange?: (step: number) => void
  onFinalStepCompleted?: () => void
  stepCircleContainerClassName?: string
  stepContainerClassName?: string
  contentClassName?: string
  footerClassName?: string
  backButtonProps?: ButtonHTMLAttributes
  nextButtonProps?: ButtonHTMLAttributes
  backButtonText?: string
  nextButtonText?: string
  disableStepIndicators?: boolean
  renderStepIndicator?: (props: RenderStepIndicatorProps) => VNode
}

const props = withDefaults(defineProps<StepperProps>(), {
  initialStep: 1,
  onStepChange: () => {},
  onFinalStepCompleted: () => {},
  stepCircleContainerClassName: '',
  stepContainerClassName: '',
  contentClassName: '',
  footerClassName: '',
  backButtonProps: () => ({}),
  nextButtonProps: () => ({}),
  backButtonText: 'Back',
  nextButtonText: 'Continue',
  disableStepIndicators: false,
  renderStepIndicator: undefined
})

const currentStep = defineModel<number>({ default: 1 })

const slots = useSlots()
const direction = ref(0)

onMounted(() => {
  if (props.initialStep !== 1) {
    currentStep.value = props.initialStep
  }
})

watch(() => props.initialStep, (newInitialStep) => {
  if (newInitialStep !== currentStep.value) {
    currentStep.value = newInitialStep
  }
})

const stepsArray = computed(() => {
  const defaultSlot = slots.default?.()
  if (!defaultSlot) return []

  const filtered = defaultSlot.filter((vnode: VNode) => {
    return vnode.type && vnode.type !== Symbol.for('v-cmt') && vnode.type !== Symbol.for('v-txt')
  })

  return filtered
})

const totalSteps = computed(() => {
  return stepsArray.value.length
})

const isCompleted = computed(() => {
  return currentStep.value > totalSteps.value
})

const isLastStep = computed(() => {
  return currentStep.value === totalSteps.value
})

const updateStep = (newStep: number) => {
  currentStep.value = newStep

  if (newStep > totalSteps.value) {
    props.onFinalStepCompleted()
  } else {
    props.onStepChange(newStep)
  }
}

const handleBack = () => {
  if (currentStep.value > 1) {
    direction.value = -1
    updateStep(currentStep.value - 1)
  }
}

const handleNext = () => {
  if (!isLastStep.value) {
    direction.value = 1
    updateStep(currentStep.value + 1)
  }
}

const handleComplete = () => {
  direction.value = 1
  updateStep(totalSteps.value + 1)
}
</script>

<style scoped>
.outer-container {
  display: flex;
  min-height: 100%;
  flex: 1 1 0%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

@media (min-width: 640px) {
  .outer-container {
    aspect-ratio: 4 / 3;
  }
}

@media (min-width: 768px) {
  .outer-container {
    aspect-ratio: 2 / 1;
  }
}

.step-circle-container {
  margin-left: auto;
  margin-right: auto;
  width: 100%;
  max-width: 28rem;
  border-radius: 2rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.step-indicator-row {
  display: flex;
  width: 100%;
  align-items: center;
  padding: 2rem;
}

.step-content-default {
  padding: 2rem;
}

.footer-container {
  padding-left: 2rem;
  padding-right: 2rem;
  padding-bottom: 2rem;
}

.footer-nav {
  margin-top: 2.5rem;
  display: flex;
}

.footer-nav.spread {
  justify-content: space-between;
}

.footer-nav.end {
  justify-content: flex-end;
}

.back-button {
  transition: all 350ms;
  border-radius: 0.25rem;
  padding: 0.25rem 0.5rem;
  color: #a3a3a3;
  cursor: pointer;
  background: none;
  border: none;
}

.back-button:hover {
  color: #52525b;
}

.back-button.inactive {
  pointer-events: none;
  opacity: 0.5;
  color: #a3a3a3;
}

.next-button {
  transition: all 350ms;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  background-color: #27FF64;
  color: #fff;
  font-weight: 500;
  letter-spacing: -0.025em;
  padding: 0.375rem 0.875rem;
  cursor: pointer;
  border: none;
}

.next-button:hover:not(:disabled) {
  background-color: #27FF64;
}

.next-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.next-button:disabled:hover {
  background-color: #27FF64;
}
</style>
