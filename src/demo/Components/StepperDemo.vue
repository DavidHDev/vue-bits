<template>
  <Toaster
    position="bottom-right"
    :visibleToasts="1"
    :toastOptions="{
      style: {
        fontSize: '12px',
        borderRadius: '0.75rem',
        border: '1px solid #333',
        color: '#fff',
        backgroundColor: '#0b0b0b'
      }
    }"
  />
  <TabbedLayout>
    <template #preview>
      <div class="relative demo-container h-[500px] overflow-hidden">
        <Stepper
          v-model="step"
          :on-step-change="handleStepChange"
          :on-final-step-completed="handleFinalStepCompleted"
          :next-button-props="{ disabled: step === 3 && !name }"
          :disable-step-indicators="step === 3 && !name"
          back-button-text="Previous"
          next-button-text="Next"
        >
          <Step>
            <h2 class="stepper-header">Welcome to the Vue Bits stepper!</h2>
            <p>Check out the next step!</p>
          </Step>

          <Step>
            <h2 class="stepper-subheader">Step 2</h2>
            <img
              class="stepper-image"
              src="https://www.purrfectcatgifts.co.uk/cdn/shop/collections/Funny_Cat_Cards_640x640.png?v=1663150894"
              alt="Cat cards"
            />
            <p class="stepper-paragraph">Custom step content!</p>
          </Step>

          <Step>
            <h2 class="stepper-subheader">How about an input?</h2>
            <input v-model="name" class="stepper-input" placeholder="Your name?" />
          </Step>

          <Step>
            <h2 class="stepper-header">Final Step</h2>
            <p>You made it!</p>
          </Step>
        </Stepper>
      </div>

      <PropTable :data="propData" />
      <Dependencies :dependency-list="['motion-v']" />
    </template>

    <template #code>
      <CodeExample :code-object="stepper" />
    </template>

    <template #cli>
      <CliInstallation :command="stepper.cli" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { toast, Toaster } from 'vue-sonner';
import 'vue-sonner/style.css'

import TabbedLayout from '@/components/common/TabbedLayout.vue';
import PropTable from '@/components/common/PropTable.vue';
import CodeExample from '@/components/code/CodeExample.vue';
import CliInstallation from '@/components/code/CliInstallation.vue';
import Dependencies from '@/components/code/Dependencies.vue';

import Stepper from '@/content/Components/Stepper/Stepper.vue';
import Step from '@/content/Components/Stepper/Step.vue';
import { stepper } from '@/constants/code/Components/stepperCode.ts';

const name = ref('');
const step = ref(1);

const propData = [
  {
    name: 'children',
    type: 'VNode[]',
    default: '-',
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
    default: "''",
    description: 'Custom class name for the container holding the step indicators.'
  },
  {
    name: 'stepContainerClassName',
    type: 'string',
    default: "''",
    description: 'Custom class name for the row holding the step circles/connectors.'
  },
  {
    name: 'contentClassName',
    type: 'string',
    default: "''",
    description: "Custom class name for the step's main content container."
  },
  {
    name: 'footerClassName',
    type: 'string',
    default: "''",
    description: 'Custom class name for the footer area containing navigation buttons.'
  },
  {
    name: 'backButtonProps',
    type: 'ButtonHTMLAttributes',
    default: '{}',
    description: 'Extra props passed to the Back button.'
  },
  {
    name: 'nextButtonProps',
    type: 'ButtonHTMLAttributes',
    default: '{}',
    description: 'Extra props passed to the Next/Complete button.'
  },
  {
    name: 'backButtonText',
    type: 'string',
    default: "'Back'",
    description: 'Text for the Back button.'
  },
  {
    name: 'nextButtonText',
    type: 'string',
    default: "'Continue'",
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
    type: '(props: RenderStepIndicatorProps) => VNode',
    default: 'undefined',
    description: 'Renders a custom step indicator component.'
  }
];

const handleFinalStepCompleted = () => {
  toast('✅ All steps completed!');
};

const handleStepChange = (newStep: number) => {
  if (newStep === 4) {
    if (name.value) {
      toast(`👋🏻 Hello ${name.value}!`)
    } else {
      toast(`You didn't provide your name :(`)
    }
  } else {
    toast(`✅ Step ${newStep}!`)
  }
};
</script>

<style>
.stepper-header {
  color: #27FF64;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.stepper-subheader {
  margin-bottom: 1rem;
}

.stepper-image {
  height: 100px;
  width: 100%;
  object-fit: cover;
  object-position: center -70px;
  border-radius: 15px;
  margin-top: 1em;
}

.stepper-paragraph {
  margin-top: 1em;
}

.stepper-input {
  padding: 0.75rem 1rem;
  border: 1px solid #333;
  border-radius: 0.75rem;
  width: 100%;
  background-color: #0b0b0b;
  color: #fff;
  font-size: 14px;
  transition: all 0.2s ease;
}

.stepper-input:focus {
  outline: none;
  border-color: #27FF64;
  background-color: #0a0015;
  box-shadow: 0 0 0 2px rgba(39, 255, 100, 0.1);
}

.stepper-input::placeholder {
  color: #888;
}
</style>
