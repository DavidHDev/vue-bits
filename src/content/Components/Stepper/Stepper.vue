<template>
  <div class="flex justify-center items-center w-full h-full" v-bind="$attrs">
    <div
      :class="`w-full max-w-md p-8 rounded-[2rem] shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] ${stepCircleContainerClassName}`"
      style="border: 1px solid #222"
    >
      <div
        :class="`flex items-center justify-center w-full ${stepContainerClassName}`"
        :style="{ marginBottom: isCompleted ? '0' : '2rem' }"
      >
        <template v-for="(_, index) in stepsArray" :key="index + 1">
          <div
            v-if="!renderStepIndicator"
            @click="() => handleStepClick(index + 1)"
            :class="[
              'relative outline-none flex h-8 w-8 items-center justify-center rounded-full font-semibold',
              isCompleted && lockOnComplete ? 'cursor-default' : 'cursor-pointer'
            ]"
            :style="getStepIndicatorStyle(index + 1)"
          >
            <svg
              v-if="getStepStatus(index + 1) === 'complete'"
              class="h-4 w-4 text-black stroke-black"
              fill="none"
              stroke="currentColor"
              :stroke-width="2"
              viewBox="0 0 24 24"
            >
              <Motion
                as="path"
                d="M5 13l4 4L19 7"
                stroke-linecap="round"
                stroke-linejoin="round"
                :initial="{ pathLength: 0, opacity: 0 }"
                :animate="
                  getStepStatus(index + 1) === 'complete'
                    ? { pathLength: 1, opacity: 1 }
                    : { pathLength: 0, opacity: 0 }
                "
              />
            </svg>
            <div v-else-if="getStepStatus(index + 1) === 'active'" class="h-3 w-3 rounded-full bg-black" />
            <span v-else class="text-sm">{{ index + 1 }}</span>
          </div>

          <component
            v-else
            :is="renderStepIndicator"
            :step="index + 1"
            :current-step="currentStep"
            :on-step-click="handleCustomStepClick"
          />

          <div
            v-if="index < totalSteps - 1"
            class="relative ml-2 mr-2 h-0.5 flex-1 overflow-hidden rounded bg-zinc-600"
          >
            <Motion
              as="div"
              class="absolute left-0 top-0 h-full"
              :initial="{ width: 0, backgroundColor: '#52525b' }"
              :animate="
                currentStep > index + 1
                  ? { width: '100%', backgroundColor: '#27ff64' }
                  : { width: 0, backgroundColor: '#52525b' }
              "
              :transition="{ type: 'spring', stiffness: 100, damping: 15, duration: 0.4 }"
            />
          </div>
        </template>
      </div>

      <Motion
        as="div"
        :class="`w-full ${contentClassName}`"
        :style="{
          position: 'relative',
          overflow: 'hidden',
          marginBottom: isCompleted ? '0' : '2rem'
        }"
        :animate="{ height: isCompleted ? 0 : `${parentHeight + 1}px` }"
        :transition="{ type: 'spring', stiffness: 200, damping: 25, duration: 0.4 }"
      >
        <AnimatePresence :initial="false" mode="sync" :custom="direction">
          <Motion
            v-if="!isCompleted"
            ref="containerRef"
            as="div"
            :key="currentStep"
            :initial="getStepContentInitial()"
            :animate="{ x: '0%', opacity: 1 }"
            :exit="getStepContentExit()"
            :transition="{ type: 'tween', stiffness: 300, damping: 30, duration: 0.4 }"
            :style="{ position: 'absolute', left: 0, right: 0, top: 0 }"
          >
            <div ref="contentRef" v-if="slots.default && slots.default()[currentStep - 1]">
              <component :is="slots.default()[currentStep - 1]" />
            </div>
          </Motion>
        </AnimatePresence>
      </Motion>

      <div v-if="!isCompleted" :class="`w-full ${footerClassName}`">
        <div :class="`flex w-full ${currentStep !== 1 ? 'justify-between' : 'justify-end'}`">
          <button
            v-if="currentStep !== 1"
            @click="handleBack"
            :disabled="backButtonProps?.disabled"
            :class="`text-zinc-400 bg-transparent cursor-pointer transition-all duration-[350ms] rounded px-2 py-1 border-none hover:text-white ${currentStep === 1 ? 'opacity-50 cursor-not-allowed' : ''}`"
            v-bind="backButtonProps"
          >
            {{ backButtonText }}
          </button>
          <button
            @click="isLastStep ? handleComplete() : handleNext()"
            :disabled="nextButtonProps?.disabled"
            :class="`border-none bg-[#27ff64] transition-all duration-[350ms] flex items-center justify-center rounded-full text-black font-medium tracking-tight px-3.5 py-1.5 cursor-pointer hover:bg-[#22e55c] disabled:opacity-50 disabled:cursor-not-allowed`"
          >
            {{ isLastStep ? 'Complete' : nextButtonText }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  useSlots,
  watch,
  onMounted,
  nextTick,
  useTemplateRef,
  type VNode,
  type ButtonHTMLAttributes,
  type Component
} from 'vue';
import { Motion, AnimatePresence } from 'motion-v';

interface StepperProps {
  children?: VNode[];
  initialStep?: number;
  onStepChange?: (step: number) => void;
  onFinalStepCompleted?: () => void;
  stepCircleContainerClassName?: string;
  stepContainerClassName?: string;
  contentClassName?: string;
  footerClassName?: string;
  backButtonProps?: ButtonHTMLAttributes;
  nextButtonProps?: ButtonHTMLAttributes;
  backButtonText?: string;
  nextButtonText?: string;
  disableStepIndicators?: boolean;
  renderStepIndicator?: Component;
  lockOnComplete?: boolean;
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
  renderStepIndicator: undefined,
  lockOnComplete: true
});

const slots = useSlots();
const currentStep = ref(props.initialStep);
const direction = ref(1);
const isCompleted = ref(false);
const parentHeight = ref(0);
const containerRef = useTemplateRef<HTMLDivElement>('containerRef');
const contentRef = useTemplateRef<HTMLDivElement>('contentRef');

const stepsArray = computed(() => slots.default?.() || []);
const totalSteps = computed(() => stepsArray.value.length);
const isLastStep = computed(() => currentStep.value === totalSteps.value);

const getStepStatus = (step: number) => {
  if (isCompleted.value || currentStep.value > step) return 'complete';
  if (currentStep.value === step) return 'active';
  return 'inactive';
};

const getStepIndicatorStyle = (step: number) => {
  const status = getStepStatus(step);
  switch (status) {
    case 'active':
    case 'complete':
      return { backgroundColor: '#27FF64', color: '#fff' };
    default:
      return { backgroundColor: '#222', color: '#a3a3a3' };
  }
};

const getStepContentInitial = () => ({
  x: direction.value >= 0 ? '-100%' : '100%',
  opacity: 0
});

const getStepContentExit = () => ({
  x: direction.value >= 0 ? '50%' : '-50%',
  opacity: 0
});

const handleStepClick = (step: number) => {
  if (isCompleted.value && props.lockOnComplete) return;
  if (!props.disableStepIndicators) {
    direction.value = step > currentStep.value ? 1 : -1;
    updateStep(step);
  }
};

const handleCustomStepClick = (clicked: number) => {
  if (isCompleted.value && props.lockOnComplete) return;
  if (clicked !== currentStep.value && !props.disableStepIndicators) {
    direction.value = clicked > currentStep.value ? 1 : -1;
    updateStep(clicked);
  }
};

const measureHeight = () => {
  nextTick(() => {
    if (contentRef.value) {
      const height = contentRef.value.offsetHeight;
      if (height > 0 && height !== parentHeight.value) {
        parentHeight.value = height;
      }
    }
  });
};

const updateStep = (newStep: number) => {
  if (newStep >= 1 && newStep <= totalSteps.value) {
    currentStep.value = newStep;
  }
};

const handleBack = () => {
  direction.value = -1;
  updateStep(currentStep.value - 1);
};

const handleNext = () => {
  direction.value = 1;
  updateStep(currentStep.value + 1);
};

const handleComplete = () => {
  isCompleted.value = true;
  props.onFinalStepCompleted?.();
};

watch(currentStep, (newStep, oldStep) => {
  props.onStepChange?.(newStep);
  if (newStep !== oldStep && !isCompleted.value) {
    nextTick(measureHeight);
  } else if (!props.lockOnComplete && isCompleted.value) {
    isCompleted.value = false;
    nextTick(measureHeight);
  }
});

onMounted(() => {
  if (props.initialStep !== 1) {
    currentStep.value = props.initialStep;
  }
  measureHeight();
});
</script>
