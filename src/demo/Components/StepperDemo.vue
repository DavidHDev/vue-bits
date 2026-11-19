<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
    :demo-only-props="['preset', 'accentColor']"
    :computed-props="computedProps"
  >
    <TabsLayout>
      <template #preview>
        <div class="demo-container relative overflow-hidden" style="height: 560px; padding: 16px">
          <Stepper
            :key="`${props.preset}-${rerenderKey}`"
            v-bind="settings"
            :theme="theme"
            :accent-color="props.accentColor || undefined"
            :on-step-change="setStep"
            :on-final-step-completed="() => setStep(5)"
            :next-button-props="{ disabled: needsName }"
          >
            <template v-if="checkout">
              <Step title="Cart" description="2 items" :icon="ICONS.cart">
                <h3 :style="heading">Your cart</h3>
                <div style="display: grid; gap: 8px; margin-top: 14px">
                  <StepperOption title="Desk lamp" detail="Matte black" aside="$89" />
                  <StepperOption title="Linen notebook" detail="A5, dotted" aside="$24" />
                </div>
              </Step>
              <Step title="Shipping" description="Delivery speed" :icon="ICONS.shipping">
                <h3 :style="heading">How fast?</h3>
                <div style="display: grid; gap: 8px; margin-top: 14px">
                  <StepperOption
                    title="Standard"
                    detail="3 to 5 days"
                    aside="Free"
                    :selected="shipping === 'standard'"
                    :on-select="() => (shipping = 'standard')"
                  />
                  <StepperOption
                    title="Express"
                    detail="Next day"
                    aside="$12"
                    :selected="shipping === 'express'"
                    :on-select="() => (shipping = 'express')"
                  />
                </div>
              </Step>
              <Step title="Payment" description="Card on file" :icon="ICONS.payment">
                <h3 :style="heading">Pay with</h3>
                <div style="display: grid; gap: 8px; margin-top: 14px">
                  <StepperOption title="Visa ending in 4242" detail="Expires 08/28" selected />
                </div>
              </Step>
              <Step title="Review" description="Confirm order" :icon="ICONS.review">
                <h3 :style="heading">Order total</h3>
                <p :style="copy">
                  2 items with {{ shipping === 'express' ? 'express' : 'standard' }} delivery come to
                  <StepperPrice :value="orderTotal" />
                </p>
              </Step>
            </template>
            <template v-else>
              <Step title="Welcome">
                <h3 :style="heading">Welcome aboard</h3>
                <p :style="copy">Set up your workspace in a few quick steps. It only takes a minute.</p>
              </Step>
              <Step title="Plan">
                <h3 :style="heading">Choose a plan</h3>
                <p :style="copy">You can change this at any time.</p>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 14px">
                  <StepperOption
                    title="Starter"
                    detail="Free forever"
                    :selected="plan === 'starter'"
                    :on-select="() => (plan = 'starter')"
                  />
                  <StepperOption
                    title="Pro"
                    detail="$12 per month"
                    :selected="plan === 'pro'"
                    :on-select="() => (plan = 'pro')"
                  />
                </div>
              </Step>
              <Step title="Profile">
                <h3 :style="heading">What should we call you?</h3>
                <StepperField v-model="name" placeholder="Your name" />
              </Step>
              <Step title="Review">
                <h3 :style="heading">Looking good{{ name.trim() ? `, ${name.trim()}` : '' }}</h3>
                <p :style="copy">
                  You picked the {{ plan === 'pro' ? 'Pro' : 'Starter' }} plan. Complete setup to open your workspace.
                </p>
              </Step>
            </template>

            <template #completed>
              <StepperDone v-if="checkout" title="Order placed" text="A receipt is on its way to your inbox." />
              <StepperDone
                v-else
                title="Workspace ready"
                :text="`Welcome in${name.trim() ? `, ${name.trim()}` : ''}.`"
              />
            </template>
          </Stepper>
          <RefreshButton @click="refresh" />
        </div>

        <Customize>
          <PreviewSelect
            title="Preset"
            :options="PRESET_OPTIONS"
            :model-value="props.preset"
            @update:model-value="value => applyPreset(value as Preset)"
          />
          <PreviewSelect
            title="Indicator"
            :options="INDICATOR_OPTIONS"
            :model-value="props.indicator"
            :is-disabled="props.orientation === 'vertical'"
            @update:model-value="value => updateProp('indicator', value as Indicator)"
          />
          <PreviewSelect
            title="Orientation"
            :options="ORIENTATION_OPTIONS"
            :model-value="props.orientation"
            @update:model-value="value => setOrientation(value as Orientation)"
          />
          <PreviewSelect
            title="Transition"
            :options="TRANSITION_OPTIONS"
            :model-value="props.transition"
            @update:model-value="value => updateProp('transition', value as Transition)"
          />
          <PreviewColorPickerCustom
            title="Accent Color"
            :color="props.accentColor || ink"
            @change="value => updateProp('accentColor', value)"
          />
          <PreviewSlider
            title="Width"
            :min="320"
            :max="760"
            :step="10"
            value-unit="px"
            :model-value="props.width"
            @update:model-value="value => updateProp('width', value)"
          />
          <PreviewSlider
            title="Radius"
            :min="0"
            :max="32"
            :step="1"
            value-unit="px"
            :model-value="props.radius"
            @update:model-value="value => updateProp('radius', value)"
          />
          <PreviewInput
            title="Back Text"
            placeholder="Back"
            :model-value="props.backButtonText"
            @update:model-value="value => updateProp('backButtonText', value)"
          />
          <PreviewInput
            title="Continue Text"
            placeholder="Continue"
            :model-value="props.nextButtonText"
            @update:model-value="value => updateProp('nextButtonText', value)"
          />
          <PreviewInput
            title="Complete Text"
            placeholder="Complete"
            :model-value="props.completeButtonText"
            @update:model-value="value => updateProp('completeButtonText', value)"
          />
          <PreviewSwitch
            title="Frame"
            :model-value="props.frame"
            @update:model-value="value => updateProp('frame', value)"
          />
          <PreviewSwitch
            title="Linear"
            :model-value="props.linear"
            @update:model-value="value => updateProp('linear', value)"
          />
          <PreviewSwitch
            title="Disable Step Indicators"
            :model-value="props.disableStepIndicators"
            @update:model-value="value => updateProp('disableStepIndicators', value)"
          />
          <PreviewSwitch
            title="Show Footer"
            :model-value="props.showFooter"
            @update:model-value="value => updateProp('showFooter', value)"
          />
        </Customize>

        <PropTable :data="propData" />
        <Dependencies :dependency-list="['@hugeicons/vue', '@hugeicons/core-free-icons']" />
      </template>

      <template #code>
        <CodeExample :code-object="stepper" component-name="Stepper" />
      </template>
    </TabsLayout>
  </ComponentPropsProvider>
</template>

<script lang="ts">
import { defineComponent, h, ref, type CSSProperties, type PropType } from 'vue';
import { HugeiconsIcon, type IconArray } from '@hugeicons/vue';
import {
  CheckListIcon,
  CheckmarkCircle02Icon,
  CreditCardIcon,
  DeliveryTruck01Icon,
  ShoppingCart01Icon
} from '@hugeicons/core-free-icons';

const heading: CSSProperties = {
  margin: 0,
  fontSize: '17px',
  fontWeight: 600,
  lineHeight: 1.3,
  letterSpacing: '-0.01em',
  color: 'var(--stepper-ink)'
};
const copy: CSSProperties = {
  margin: '6px 0 0',
  fontSize: '13.5px',
  lineHeight: 1.55,
  color: 'var(--stepper-muted)'
};

const glyph = (icon: unknown, size: number, strokeWidth: number) =>
  h(HugeiconsIcon, { icon: icon as IconArray, size, strokeWidth });

const StepperOption = defineComponent({
  name: 'StepperOption',
  props: {
    title: { type: String, default: '' },
    detail: { type: String, default: '' },
    aside: { type: String, default: '' },
    selected: { type: Boolean, default: false },
    onSelect: { type: Function as PropType<() => void>, default: undefined }
  },
  setup(props) {
    return () =>
      h(
        props.onSelect ? 'button' : 'div',
        {
          type: props.onSelect ? 'button' : undefined,
          onClick: props.onSelect,
          style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            width: '100%',
            padding: '11px 14px',
            border: 'none',
            borderRadius: '12px',
            background: props.selected ? 'var(--stepper-tile)' : 'var(--stepper-well)',
            boxShadow: props.selected
              ? 'inset 0 0 0 1px var(--stepper-ring), var(--stepper-tile-shadow)'
              : 'inset 0 0 0 1px var(--stepper-tile-edge)',
            color: 'var(--stepper-ink)',
            font: 'inherit',
            textAlign: 'left',
            boxSizing: 'border-box',
            cursor: props.onSelect ? 'pointer' : 'default',
            transition: 'background 0.2s ease, box-shadow 0.2s ease'
          }
        },
        [
          h('span', { style: { display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 } }, [
            h('span', { style: { fontSize: '14px', fontWeight: 600 } }, props.title),
            props.detail
              ? h('span', { style: { fontSize: '12.5px', color: 'var(--stepper-muted)' } }, props.detail)
              : null
          ]),
          props.aside
            ? h(
                'span',
                { style: { fontSize: '13px', color: 'var(--stepper-muted)', fontVariantNumeric: 'tabular-nums' } },
                props.aside
              )
            : null
        ]
      );
  }
});

const StepperField = defineComponent({
  name: 'StepperField',
  props: {
    modelValue: { type: String, default: '' },
    placeholder: { type: String, default: '' }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const focused = ref(false);
    return () =>
      h('input', {
        value: props.modelValue,
        placeholder: props.placeholder,
        onInput: (event: Event) => emit('update:modelValue', (event.target as HTMLInputElement).value),
        onFocus: () => (focused.value = true),
        onBlur: () => (focused.value = false),
        style: {
          width: '100%',
          height: '42px',
          marginTop: '14px',
          padding: '0 14px',
          boxSizing: 'border-box',
          border: 'none',
          borderRadius: '12px',
          outline: 'none',
          background: 'var(--stepper-well)',
          boxShadow: focused.value ? 'inset 0 0 0 1px var(--stepper-ring)' : 'inset 0 0 0 1px var(--stepper-tile-edge)',
          color: 'var(--stepper-ink)',
          font: 'inherit',
          fontSize: '14px',
          transition: 'box-shadow 0.2s ease'
        }
      });
  }
});

const StepperDone = defineComponent({
  name: 'StepperDone',
  props: {
    title: { type: String, default: '' },
    text: { type: String, default: '' }
  },
  setup(props) {
    return () =>
      h('div', { style: { display: 'flex', alignItems: 'center', gap: '14px', padding: '4px 0' } }, [
        h(
          'span',
          {
            style: {
              display: 'grid',
              placeItems: 'center',
              flex: 'none',
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'var(--stepper-well)',
              color: 'var(--stepper-ink)'
            }
          },
          [glyph(CheckmarkCircle02Icon, 20, 1.8)]
        ),
        h('span', [
          h('h3', { style: heading }, props.title),
          h('p', { style: { ...copy, marginTop: '2px' } }, props.text)
        ])
      ]);
  }
});

const StepperPrice = (props: { value: string }) => [
  h('span', { style: { color: 'var(--stepper-ink)', fontWeight: 600 } }, props.value),
  '.'
];
StepperPrice.props = ['value'];

const ICONS = {
  cart: glyph(ShoppingCart01Icon, 16, 1.8),
  shipping: glyph(DeliveryTruck01Icon, 16, 1.8),
  payment: glyph(CreditCardIcon, 16, 1.8),
  review: glyph(CheckListIcon, 16, 1.8)
};
</script>

<script setup lang="ts">
import { computed } from 'vue';
import CodeExample from '@/components/common/CodeExample.vue';
import Customize from '@/components/common/Customize.vue';
import Dependencies from '@/components/common/Dependencies.vue';
import PreviewColorPickerCustom from '@/components/common/PreviewColorPickerCustom.vue';
import PreviewInput from '@/components/common/PreviewInput.vue';
import PreviewSelect from '@/components/common/PreviewSelect.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import RefreshButton from '@/components/common/RefreshButton.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import ComponentPropsProvider from '@/components/context/ComponentPropsProvider.vue';
import { useComponentProps } from '@/composables/useComponentProps';
import { useForceRerender } from '@/composables/useForceRerender';
import { useColorModeValue } from '@/composables/useTheme';
import { stepper } from '@/constants/code/Components/stepperCode';
import Stepper, { Step } from '@/content/Components/Stepper/Stepper.vue';

type Preset = 'onboarding' | 'checkout' | 'minimal' | 'progress';
type Indicator = 'numbers' | 'dots' | 'bars';
type Orientation = 'horizontal' | 'vertical';
type Transition = 'slide' | 'fade' | 'none';

const DEFAULT_PROPS = {
  preset: 'onboarding' as Preset,
  indicator: 'numbers' as Indicator,
  orientation: 'horizontal' as Orientation,
  transition: 'slide' as Transition,
  accentColor: '',
  width: 440,
  radius: 24,
  frame: true,
  linear: false,
  disableStepIndicators: false,
  showFooter: true,
  backButtonText: 'Back',
  nextButtonText: 'Continue',
  completeButtonText: 'Complete'
};

const PRESETS: Record<Preset, Partial<typeof DEFAULT_PROPS>> = {
  onboarding: {},
  checkout: { orientation: 'vertical', width: 640, completeButtonText: 'Place order' },
  minimal: { indicator: 'dots', transition: 'fade', width: 400 },
  progress: { indicator: 'bars', linear: true }
};

const PRESET_OPTIONS = [
  { value: 'onboarding', label: 'Onboarding' },
  { value: 'checkout', label: 'Checkout' },
  { value: 'minimal', label: 'Minimal' },
  { value: 'progress', label: 'Progress' }
];

const INDICATOR_OPTIONS = [
  { value: 'numbers', label: 'Numbers' },
  { value: 'dots', label: 'Dots' },
  { value: 'bars', label: 'Bars' }
];

const ORIENTATION_OPTIONS = [
  { value: 'horizontal', label: 'Horizontal' },
  { value: 'vertical', label: 'Vertical' }
];

const TRANSITION_OPTIONS = [
  { value: 'slide', label: 'Slide' },
  { value: 'fade', label: 'Fade' },
  { value: 'none', label: 'None' }
];

const { rerenderKey, forceRerender } = useForceRerender();
const { props, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);
const theme = useColorModeValue<'light' | 'dark'>('light', 'dark');
const ink = useColorModeValue('#252825', '#f4f5f4');
const name = ref('');
const plan = ref('pro');
const shipping = ref('standard');
const step = ref(1);

const settings = computed(() => {
  const { preset: _preset, accentColor: _accentColor, ...rest } = props.value;
  return rest;
});

const computedProps = computed(() => ({
  ...(props.value.accentColor ? { accentColor: props.value.accentColor } : {}),
  ...(theme.value === 'light' ? { theme: 'light' } : {})
}));

const setStep = (value: number) => {
  step.value = value;
};

const applyPreset = (value: Preset) => {
  step.value = 1;
  updateProps({ ...DEFAULT_PROPS, ...PRESETS[value], accentColor: props.value.accentColor, preset: value });
};

const setOrientation = (value: Orientation) =>
  updateProps({ orientation: value, width: value === 'vertical' ? Math.max(props.value.width, 600) : 440 });

const refresh = () => {
  step.value = 1;
  forceRerender();
};

const checkout = computed(() => props.value.preset === 'checkout');
const orderTotal = computed(() => (shipping.value === 'express' ? '$125' : '$113'));
const needsName = computed(() => !checkout.value && step.value === 3 && !name.value.trim());

const propData: PropRow[] = [
  {
    name: 'default slot',
    type: 'Step[]',
    default: '-',
    description: 'The steps. Wrap each one in Step, which can also take a title, description and icon.'
  },
  {
    name: 'Step title',
    type: 'string | VNode',
    default: '-',
    description: 'Label shown under the indicator, or beside it in the vertical layout.'
  },
  {
    name: 'Step description',
    type: 'string | VNode',
    default: '-',
    description: 'Second line shown beside the indicator in the vertical layout.'
  },
  {
    name: 'Step icon',
    type: 'VNode | Component',
    default: '-',
    description: 'Icon shown inside the indicator instead of the number.'
  },
  {
    name: 'step',
    type: 'number',
    default: '-',
    description: 'Controls the current step yourself. Use it with onStepChange.'
  },
  { name: 'initialStep', type: 'number', default: '1', description: 'The step shown first.' },
  {
    name: 'onStepChange',
    type: '(step: number) => void',
    default: '() => {}',
    description: 'Called when the step changes.'
  },
  {
    name: 'onFinalStepCompleted',
    type: '() => void',
    default: '() => {}',
    description: 'Called when the last step is completed.'
  },
  {
    name: 'indicator',
    type: "'numbers' | 'dots' | 'bars'",
    default: "'numbers'",
    description: 'Style of the step indicators in the horizontal layout.'
  },
  {
    name: 'orientation',
    type: "'horizontal' | 'vertical'",
    default: "'horizontal'",
    description: 'Indicators across the top, or a rail of numbered steps beside the content.'
  },
  {
    name: 'transition',
    type: "'slide' | 'fade' | 'none'",
    default: "'slide'",
    description: 'How the content changes between steps. The height always animates.'
  },
  {
    name: 'linear',
    type: 'boolean',
    default: 'false',
    description: 'Only lets the indicators jump back to steps that have been reached.'
  },
  {
    name: 'disableStepIndicators',
    type: 'boolean',
    default: 'false',
    description: 'Stops the indicators from changing the step when clicked.'
  },
  {
    name: 'renderStepIndicator',
    type: '({ step, currentStep, onStepClick }) => VNodeChild',
    default: '-',
    description: 'Renders your own numbered indicator.'
  },
  { name: 'showFooter', type: 'boolean', default: 'true', description: 'Shows the Back and Continue buttons.' },
  { name: 'backButtonText', type: 'string', default: "'Back'", description: 'Text of the Back button.' },
  { name: 'nextButtonText', type: 'string', default: "'Continue'", description: 'Text of the Continue button.' },
  {
    name: 'completeButtonText',
    type: 'string',
    default: "'Complete'",
    description: 'Text of the Continue button on the last step.'
  },
  {
    name: 'backButtonProps',
    type: 'ButtonHTMLAttributes',
    default: '{}',
    description: 'Extra props for the Back button.'
  },
  {
    name: 'nextButtonProps',
    type: 'ButtonHTMLAttributes',
    default: '{}',
    description: 'Extra props for the Continue button, such as disabled while a step is incomplete.'
  },
  {
    name: 'completedContent',
    type: 'string | VNode | Component',
    default: '-',
    description: 'Shown in place of the steps once the last one is completed. The completed slot does the same.'
  },
  { name: 'theme', type: "'dark' | 'light'", default: "'dark'", description: 'Color theme of the panel and controls.' },
  {
    name: 'accentColor',
    type: 'string',
    default: '-',
    description: 'Color of completed steps, the progress lines and the Continue button.'
  },
  { name: 'frame', type: 'boolean', default: 'true', description: 'Shows the frosted panel around the stepper.' },
  { name: 'radius', type: 'number', default: '24', description: 'Corner radius of the panel, in px.' },
  { name: 'width', type: 'number | string', default: '440', description: 'Maximum width of the stepper.' },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the stepper.' },
  {
    name: 'stepContainerClassName',
    type: 'string',
    default: "''",
    description: 'Extra class names for the indicator row.'
  },
  { name: 'contentClassName', type: 'string', default: "''", description: 'Extra class names for the content area.' },
  { name: 'footerClassName', type: 'string', default: "''", description: 'Extra class names for the footer.' },
  { name: 'style', type: 'CSSProperties', default: '-', description: 'Inline styles for the stepper.' }
];
</script>
