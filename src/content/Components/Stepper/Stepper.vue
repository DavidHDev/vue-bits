<template>
  <div class="flex flex-col flex-1 justify-center items-center p-4 min-h-full" v-bind="$attrs">
    <div
      :class="`mx-auto w-full max-w-md rounded-[2rem] shadow-2xl ${stepCircleContainerClassName}`"
      style="border: 1px solid #222"
    >
      <div :class="`flex w-full items-center p-8 ${stepContainerClassName}`">
        <template v-for="(_, index) in stepsArray" :key="index + 1">
          <component
            :is="renderStepIndicator"
            v-if="renderStepIndicator"
            :step="index + 1"
            :current-step="currentStep"
            :on-step-click="handleCustomStepClick"
          />

          <div
            v-else
            @click="() => handleStepIndicatorClick(index + 1)"
            class="relative outline-none cursor-pointer"
            :style="disableStepIndicators ? { pointerEvents: 'none', opacity: 0.5 } : {}"
          >
            <Motion
              as="div"
              class="flex justify-center items-center rounded-full w-8 h-8 font-semibold"
              :animate="getStepStatus(index + 1)"
              :variants="indicatorVariants"
              :initial="false"
              :transition="{ duration: 0.3 }"
            >
              <svg
                v-if="getStepStatus(index + 1) === 'complete'"
                class="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <Motion
                  as="path"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M5 13l4 4L19 7"
                  :initial="{ pathLength: 0 }"
                  :animate="{ pathLength: 1 }"
                  :transition="{ delay: 0.1, type: 'tween', ease: 'easeOut', duration: 0.3 }"
                />
              </svg>
              <div v-else-if="getStepStatus(index + 1) === 'active'" class="bg-white rounded-full w-3 h-3" />
              <span v-else class="text-sm">{{ index + 1 }}</span>
            </Motion>
          </div>

          <div v-if="index < totalSteps - 1" class="relative flex-1 bg-zinc-600 mx-2 rounded h-0.5 overflow-hidden">
            <Motion
              as="div"
              class="top-0 left-0 absolute h-full"
              :variants="lineVariants"
              :initial="false"
              :animate="currentStep > index + 1 ? 'complete' : 'incomplete'"
              :transition="{ duration: 0.4 }"
            />
          </div>
        </template>
      </div>

      <Motion
        as="div"
        :class="contentClassName"
        style="position: relative; overflow: hidden"
        :animate="{ height: isCompleted ? 0 : parentHeight }"
        :transition="{ type: 'spring', duration: 0.4 }"
      >
        <AnimatePresence :initial="false" mode="sync" :custom="direction">
          <Motion
            v-if="!isCompleted"
            v-layout-height="measureHeight"
            as="div"
            :key="currentStep"
            :custom="direction"
            :variants="stepVariants"
            initial="enter"
            animate="center"
            exit="exit"
            :transition="{ duration: 0.4 }"
            style="position: absolute; left: 0; right: 0; top: 0"
          >
            <div class="px-8">
              <component :is="stepsArray[currentStep - 1]" />
            </div>
          </Motion>
        </AnimatePresence>
      </Motion>

      <div v-if="!isCompleted" :class="`px-8 pb-8 ${footerClassName}`">
        <div :class="`mt-10 flex ${currentStep !== 1 ? 'justify-between' : 'justify-end'}`">
          <button
            v-if="currentStep !== 1"
            @click="handleBack"
            :class="[
              'cursor-pointer rounded px-2 py-1 text-zinc-400 transition-all duration-350 hover:text-zinc-600',
              currentStep === 1 ? 'pointer-events-none opacity-50 text-zinc-400' : ''
            ]"
            v-bind="backButtonProps"
          >
            {{ backButtonText }}
          </button>
          <button
            @click="isLastStep ? handleComplete() : handleNext()"
            class="flex justify-center items-center bg-[#27ff64] hover:bg-[#1bbf4a] px-3.5 py-1.5 rounded-full font-medium text-black tracking-tight transition-all duration-350 cursor-pointer"
            v-bind="nextButtonProps"
          >
            {{ isLastStep ? 'Complete' : nextButtonText }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AnimatePresence, Motion } from 'motion-v';
import {
  computed,
  ref,
  useSlots,
  type ButtonHTMLAttributes,
  type Component,
  type DirectiveBinding,
  type VNode
} from 'vue';

interface StepperProps {
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
});

const slots = useSlots();
const currentStep = ref<number>(props.initialStep);
const direction = ref<number>(0);
const parentHeight = ref<number>(0);

const stepsArray = computed<VNode[]>(() => {
  const defaultSlot = slots.default?.() || [];
  return defaultSlot.flatMap(node => (node.type === Symbol.for('v-fgt') ? (node.children as VNode[]) : node));
});

const totalSteps = computed<number>(() => stepsArray.value.length);
const isCompleted = computed<boolean>(() => currentStep.value > totalSteps.value);
const isLastStep = computed<boolean>(() => currentStep.value === totalSteps.value);

type LayoutHeightHook = (el: HTMLElement, binding: DirectiveBinding<(height: number) => void>) => void;

const vLayoutHeight = {
  mounted(el, binding) {
    binding.value(el.offsetHeight);
  },
  updated(el, binding) {
    binding.value(el.offsetHeight);
  }
} as { mounted: LayoutHeightHook; updated: LayoutHeightHook };

const measureHeight = (height: number): void => {
  parentHeight.value = height;
};

const getStepStatus = (step: number): 'active' | 'inactive' | 'complete' => {
  if (currentStep.value === step) return 'active';
  if (currentStep.value < step) return 'inactive';
  return 'complete';
};

const updateStep = (newStep: number): void => {
  currentStep.value = newStep;
  if (newStep > totalSteps.value) {
    props.onFinalStepCompleted();
  } else {
    props.onStepChange(newStep);
  }
};

const handleBack = (): void => {
  if (currentStep.value > 1) {
    direction.value = -1;
    updateStep(currentStep.value - 1);
  }
};

const handleNext = (): void => {
  if (!isLastStep.value) {
    direction.value = 1;
    updateStep(currentStep.value + 1);
  }
};

const handleComplete = (): void => {
  direction.value = 1;
  updateStep(totalSteps.value + 1);
};

const handleStepIndicatorClick = (step: number): void => {
  if (step !== currentStep.value && !props.disableStepIndicators) {
    direction.value = step > currentStep.value ? 1 : -1;
    updateStep(step);
  }
};

const handleCustomStepClick = (clicked: number): void => {
  direction.value = clicked > currentStep.value ? 1 : -1;
  updateStep(clicked);
};

const stepVariants = {
  enter: (dir: number) => ({
    x: dir >= 0 ? '-100%' : '100%',
    opacity: 0
  }),
  center: {
    x: '0%',
    opacity: 1
  },
  exit: (dir: number) => ({
    x: dir >= 0 ? '50%' : '-50%',
    opacity: 0
  })
};

const indicatorVariants = {
  inactive: { scale: 1, backgroundColor: '#222', color: '#a3a3a3' },
  active: { scale: 1, backgroundColor: '#27ff64', color: '#27ff64' },
  complete: { scale: 1, backgroundColor: '#27ff64', color: '#1bbf4a' }
};

const lineVariants = {
  incomplete: { width: 0, backgroundColor: 'transparent' },
  complete: { width: '100%', backgroundColor: '#27ff64' }
};
</script>
