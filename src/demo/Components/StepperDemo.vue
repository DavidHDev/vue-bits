<template>
  <h1 class="sub-category">Stepper</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="stepper.usage"
    :source="stepperSource"
    component-name="Stepper"
    :props-table="props"
  >
    <template #preview>
      <div class="relative h-[500px] overflow-hidden demo-container">
        <Stepper
          :initial-step="step"
          :on-step-change="handleStepChange"
          :on-final-step-completed="handleFinalStepCompleted"
          :next-button-props="{ disabled: step === 3 && !name }"
          :disable-step-indicators="step === 3 && !name"
          :back-button-text="backButtonText"
          :next-button-text="nextButtonText"
        >
          <div>
            <h2 class="font-semibold text-[#27FF64] text-xl">Welcome to the Vue Bits stepper!</h2>
            <p>Check out the next step!</p>
          </div>

          <div>
            <h2 class="mb-4">Step 2</h2>
            <img
              class="mt-4 rounded-[15px] w-full h-[100px] object-[center_-70px] object-cover"
              src="https://www.purrfectcatgifts.co.uk/cdn/shop/collections/Funny_Cat_Cards_640x640.png?v=1663150894"
              alt="Cat cards"
            />
            <p class="mt-4">Custom step content!</p>
          </div>

          <div>
            <h2 class="mb-4">How about an input?</h2>
            <input
              v-model="name"
              class="bg-[#0b0b0b] focus:shadow-[0_0_0_2px_rgba(39,255,100,0.1)] px-4 py-3 border border-[#333] focus:border-[#27FF64] rounded-xl focus:outline-none w-full text-white text-sm transition-all duration-200 ease-in-out placeholder-[#888]"
              placeholder="Your name?"
            />
          </div>

          <div>
            <h2 class="font-semibold text-[#27FF64] text-xl">Final Step</h2>
            <p>You made it!</p>
          </div>
        </Stepper>
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewInput title="Back Button Text" v-model="backButtonText" />
        <PreviewInput title="Next Button Text" v-model="nextButtonText" />
        <PreviewSwitch title="Disable Step Indicators" v-model="disableStepIndicators" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="stepper" :usage="stepper.usage!" :source="stepperSource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewInput from '@/components/common/PreviewInput.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { stepper } from '@/constants/code/Components/stepperCode.ts';
import Stepper from '@/content/Components/Stepper/Stepper.vue';
import stepperSource from '@/content/Components/Stepper/Stepper.vue?raw';
import { useToast } from 'primevue/usetoast';
import { computed, ref } from 'vue';

const toast = useToast();
const { forceRerender } = useForceRerender();

const DEFAULTS = {
  name: '',
  step: 1,
  backButtonText: 'Previous',
  nextButtonText: 'Next',
  disableStepIndicators: false
};

const name = ref(DEFAULTS.name);
const step = ref(DEFAULTS.step);
const backButtonText = ref(DEFAULTS.backButtonText);
const nextButtonText = ref(DEFAULTS.nextButtonText);
const disableStepIndicators = ref(DEFAULTS.disableStepIndicators);

const hasChanges = computed(
  () =>
    name.value !== DEFAULTS.name ||
    step.value !== DEFAULTS.step ||
    backButtonText.value !== DEFAULTS.backButtonText ||
    nextButtonText.value !== DEFAULTS.nextButtonText ||
    disableStepIndicators.value !== DEFAULTS.disableStepIndicators
);

function reset() {
  name.value = DEFAULTS.name;
  step.value = DEFAULTS.step;
  backButtonText.value = DEFAULTS.backButtonText;
  nextButtonText.value = DEFAULTS.nextButtonText;
  disableStepIndicators.value = DEFAULTS.disableStepIndicators;
  forceRerender();
}

const handleFinalStepCompleted = () => {
  toast.add({ severity: 'success', summary: '✅ All steps completed!' });
};

const handleStepChange = (newStep: number) => {
  step.value = newStep;
  if (newStep === 4) {
    if (name.value) {
      toast.add({ severity: 'info', summary: `👋🏻 Hello ${name.value}!` });
    } else {
      toast.add({ severity: 'warn', summary: "You didn't provide your name :(" });
    }
  } else {
    toast.add({ severity: 'success', summary: `✅ Step ${newStep}!` });
  }
};

const props: PropRow[] = [
  {
    name: 'children',
    type: 'VNode[]',
    default: '—',
    description: 'The Step components (or any custom content) rendered inside the stepper.'
  },
  {
    name: 'initialStep',
    type: 'number',
    default: '1',
    description: 'The first step to display when the stepper is initialized.'
  },
  {
    name: 'onStepChange',
    type: '(step: number) => void',
    default: '() => {}',
    description: 'Callback fired whenever the step changes.'
  },
  {
    name: 'onFinalStepCompleted',
    type: '() => void',
    default: '() => {}',
    description: 'Callback fired when the stepper completes its final step.'
  },
  {
    name: 'stepCircleContainerClassName',
    type: 'string',
    default: '',
    description: 'Custom class name for the container holding the step indicators.'
  },
  {
    name: 'stepContainerClassName',
    type: 'string',
    default: '',
    description: 'Custom class name for the row holding the step circles/connectors.'
  },
  {
    name: 'contentClassName',
    type: 'string',
    default: '',
    description: 'Custom class name for the step’s main content container.'
  },
  {
    name: 'footerClassName',
    type: 'string',
    default: '',
    description: 'Custom class name for the footer area containing navigation buttons.'
  },
  {
    name: 'backButtonProps',
    type: 'object',
    default: '{}',
    description: 'Extra props passed to the Back button.'
  },
  {
    name: 'nextButtonProps',
    type: 'object',
    default: '{}',
    description: 'Extra props passed to the Next/Complete button.'
  },
  {
    name: 'backButtonText',
    type: 'string',
    default: '"Back"',
    description: 'Text for the Back button.'
  },
  {
    name: 'nextButtonText',
    type: 'string',
    default: '"Continue"',
    description: 'Text for the Next button when not on the last step.'
  },
  {
    name: 'disableStepIndicators',
    type: 'boolean',
    default: 'false',
    description: 'Disables click interaction on step indicators.'
  },
  {
    name: 'renderStepIndicator',
    type: '{}',
    default: 'undefined',
    description: 'Renders a custom step indicator.'
  }
];
</script>
