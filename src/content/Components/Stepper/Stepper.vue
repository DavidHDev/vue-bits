<script lang="ts">
import {
  cloneVNode,
  Comment,
  defineComponent,
  Fragment,
  h,
  isVNode,
  onMounted,
  ref,
  Text,
  type Component,
  type PropType,
  type VNode,
  type VNodeChild
} from 'vue';
import { HugeiconsIcon, type IconArray } from '@hugeicons/vue';
import { Tick02Icon } from '@hugeicons/core-free-icons';

export type StepperNode = string | number | boolean | null | undefined | VNode | Component | (() => VNodeChild);

export interface StepProps {
  title?: StepperNode;
  description?: StepperNode;
  icon?: StepperNode;
}

export interface StepIndicatorProps {
  step: number;
  currentStep: number;
  onStepClick: (step: number) => void;
}

export type StepperButtonProps = Record<string, unknown> & {
  class?: string;
  className?: string;
  onClick?: (event: MouseEvent) => void;
};

export const THEMES: Record<string, Record<string, string>> = {
  dark: {
    '--stepper-frame': 'rgba(36, 39, 36, 0.66)',
    '--stepper-frame-edge': 'rgba(255, 255, 255, 0.08)',
    '--stepper-frame-highlight': 'rgba(255, 255, 255, 0.07)',
    '--stepper-frame-shadow': '0 22px 44px -20px rgba(0, 0, 0, 0.8), 0 6px 16px -8px rgba(0, 0, 0, 0.5)',
    '--stepper-tile': 'linear-gradient(180deg, #383c38 0%, #262926 100%)',
    '--stepper-tile-edge': 'rgba(255, 255, 255, 0.07)',
    '--stepper-tile-highlight': 'rgba(255, 255, 255, 0.12)',
    '--stepper-tile-shadow': '0 4px 10px -4px rgba(0, 0, 0, 0.7)',
    '--stepper-well': 'rgba(255, 255, 255, 0.07)',
    '--stepper-track': 'rgba(255, 255, 255, 0.1)',
    '--stepper-ink': '#f4f5f4',
    '--stepper-muted': 'rgba(244, 245, 244, 0.55)',
    '--stepper-faint': 'rgba(255, 255, 255, 0.22)',
    '--stepper-ring': 'rgba(244, 245, 244, 0.3)',
    '--stepper-solid': '#f4f5f4',
    '--stepper-solid-ink': '#161816',
    '--stepper-hover': 'brightness(1.12)',
    '--stepper-hover-fill': 'rgba(255, 255, 255, 0.04)',
    '--stepper-solid-hover': 'brightness(0.9)',
    '--stepper-press': 'brightness(0.85)'
  },
  light: {
    '--stepper-frame': 'rgba(240, 242, 240, 0.8)',
    '--stepper-frame-edge': 'rgba(22, 24, 22, 0.07)',
    '--stepper-frame-highlight': 'rgba(255, 255, 255, 0.95)',
    '--stepper-frame-shadow': '0 22px 44px -22px rgba(22, 24, 22, 0.3), 0 6px 16px -10px rgba(22, 24, 22, 0.16)',
    '--stepper-tile': 'linear-gradient(180deg, #ffffff 0%, #f6f8f6 100%)',
    '--stepper-tile-edge': 'rgba(22, 24, 22, 0.08)',
    '--stepper-tile-highlight': 'rgba(255, 255, 255, 1)',
    '--stepper-tile-shadow': '0 4px 10px -5px rgba(22, 24, 22, 0.25)',
    '--stepper-well': 'rgba(22, 24, 22, 0.05)',
    '--stepper-track': 'rgba(22, 24, 22, 0.08)',
    '--stepper-ink': '#252825',
    '--stepper-muted': 'rgba(37, 40, 37, 0.55)',
    '--stepper-faint': 'rgba(22, 24, 22, 0.16)',
    '--stepper-ring': 'rgba(22, 24, 22, 0.28)',
    '--stepper-solid': '#252825',
    '--stepper-solid-ink': '#ffffff',
    '--stepper-hover': 'brightness(0.97)',
    '--stepper-hover-fill': 'rgba(22, 24, 22, 0.035)',
    '--stepper-solid-hover': 'brightness(1.3)',
    '--stepper-press': 'brightness(0.92)'
  }
};

export const SPRING =
  'linear(0, 0.0603, 0.2033, 0.3821, 0.5633, 0.7258, 0.8584, 0.9574, 1.0242, 1.0634, 1.0809, 1.0828, 1.0747, 1.0613, 1.046, 1.0313, 1.0186, 1.0085, 1.0012, 0.9965, 0.994, 0.9931, 0.9933, 0.9941, 0.9953, 0.9966, 0.9978, 0.9988, 1)';
const SETTLE = 'cubic-bezier(0.22, 1, 0.36, 1)';

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const size = (value: number | string) => (typeof value === 'number' ? `${value}px` : value);

const readableOn = (color: string) => {
  let hex = String(color || '')
    .trim()
    .replace('#', '');
  if (hex.length === 3) hex = hex.replace(/./g, c => c + c);
  if (!/^[0-9a-f]{6}$/i.test(hex)) return '#ffffff';
  const [r, g, b] = [0, 2, 4].map(index => {
    const c = parseInt(hex.slice(index, index + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.4 ? '#161816' : '#ffffff';
};

const ease = () =>
  typeof CSS !== 'undefined' && CSS.supports?.('transition-timing-function', 'linear(0, 1)')
    ? SPRING
    : 'cubic-bezier(0.34, 1.4, 0.64, 1)';

const renderNode = (node: unknown): VNodeChild => {
  if (node === undefined || node === null || node === false || node === true) return null;
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (isVNode(node)) return cloneVNode(node);
  return h(node as Component);
};

const collectSteps = (nodes: VNode[] | undefined): VNode[] =>
  (nodes ?? []).flatMap(node => {
    if (!isVNode(node)) return [];
    if (node.type === Fragment) return collectSteps(node.children as VNode[]);
    if (node.type === Comment || node.type === Text) return [];
    return [node];
  });

const stepProps = (node: VNode | undefined): StepProps => (node?.props ?? {}) as StepProps;

const StepperOutlet = (props: { node?: unknown }) => renderNode(props.node);
StepperOutlet.props = ['node'];

const StepperIndicator = (props: { render: (args: StepIndicatorProps) => VNodeChild; args: StepIndicatorProps }) =>
  props.render(props.args);
StepperIndicator.props = ['render', 'args'];

const StepperCheck = defineComponent({
  name: 'StepperCheck',
  setup() {
    const el = ref<HTMLSpanElement | null>(null);
    onMounted(() => {
      const path = el.value?.querySelector('path');
      if (!path || typeof path.animate !== 'function') return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      path.style.strokeDasharray = '24';
      path.animate([{ strokeDashoffset: 24 }, { strokeDashoffset: 0 }], {
        duration: 360,
        easing: SETTLE
      });
    });
    return () =>
      h('span', { ref: el, class: 'stepper__check' }, [
        h(HugeiconsIcon, { icon: Tick02Icon as unknown as IconArray, size: 16, strokeWidth: 2.4 })
      ]);
  }
});

export const Step = defineComponent({
  name: 'Step',
  props: {
    title: { type: null as unknown as PropType<StepperNode>, default: undefined },
    description: { type: null as unknown as PropType<StepperNode>, default: undefined },
    icon: { type: null as unknown as PropType<StepperNode>, default: undefined }
  },
  setup(_, { slots }) {
    return () => h('div', { class: 'stepper__step' }, slots.default?.());
  }
});
</script>

<script setup lang="ts">
import { computed, onBeforeUnmount, onBeforeUpdate, useSlots, watch, type CSSProperties } from 'vue';
import { ArrowLeft01Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons';

type Status = 'complete' | 'active' | 'upcoming';

interface View {
  step: number;
  previous: number | null;
  direction: number;
  id: number;
}

interface StepperProps {
  step?: number;
  initialStep?: number;
  onStepChange?: (step: number) => void;
  onFinalStepCompleted?: () => void;
  indicator?: 'numbers' | 'dots' | 'bars';
  orientation?: 'horizontal' | 'vertical';
  transition?: 'slide' | 'fade' | 'none';
  linear?: boolean;
  disableStepIndicators?: boolean;
  renderStepIndicator?: (props: StepIndicatorProps) => VNodeChild;
  showFooter?: boolean;
  backButtonText?: string;
  nextButtonText?: string;
  completeButtonText?: string;
  backButtonProps?: StepperButtonProps;
  nextButtonProps?: StepperButtonProps;
  completedContent?: StepperNode;
  theme?: 'dark' | 'light';
  accentColor?: string;
  frame?: boolean;
  radius?: number;
  width?: number | string;
  className?: string;
  stepCircleContainerClassName?: string;
  stepContainerClassName?: string;
  contentClassName?: string;
  footerClassName?: string;
  style?: CSSProperties | string;
}

const props = withDefaults(defineProps<StepperProps>(), {
  step: undefined,
  initialStep: 1,
  onStepChange: () => {},
  onFinalStepCompleted: () => {},
  indicator: 'numbers',
  orientation: 'horizontal',
  transition: 'slide',
  linear: false,
  disableStepIndicators: false,
  renderStepIndicator: undefined,
  showFooter: true,
  backButtonText: 'Back',
  nextButtonText: 'Continue',
  completeButtonText: 'Complete',
  backButtonProps: () => ({}),
  nextButtonProps: () => ({}),
  completedContent: undefined,
  theme: 'dark',
  accentColor: undefined,
  frame: true,
  radius: 24,
  width: 440,
  className: '',
  stepCircleContainerClassName: '',
  stepContainerClassName: '',
  contentClassName: '',
  footerClassName: '',
  style: undefined
});

const slots = useSlots();
const slotVersion = ref(0);
onBeforeUpdate(() => {
  slotVersion.value++;
});

const steps = computed(() => {
  void slotVersion.value;
  return collectSteps(slots.default?.());
});
const total = computed(() => steps.value.length);
const controlled = computed(() => typeof props.step === 'number');
const internal = ref(props.initialStep);
const current = computed(() =>
  clamp(Math.round(controlled.value ? (props.step as number) : internal.value), 1, total.value + 1)
);
const completed = computed(() => current.value > total.value);
const vertical = computed(() => props.orientation === 'vertical');
const kind = computed(() => (vertical.value ? 'numbers' : props.indicator));
const labelled = computed(() => steps.value.some(entry => stepProps(entry).title));

const compact = ref(false);
const tight = ref(false);
const rail = computed(() => vertical.value && !compact.value);
const reached = ref(current.value);
const view = ref<View>({ step: current.value, previous: null, direction: 1, id: 0 });

watch(
  current,
  value => {
    if (value > reached.value) reached.value = value;
    if (view.value.step !== value) {
      view.value = {
        step: value,
        previous: view.value.step,
        direction: value > view.value.step ? 1 : -1,
        id: view.value.id + 1
      };
    }
  },
  { flush: 'sync' }
);

const rootRef = ref<HTMLDivElement | null>(null);
const trackRef = ref<HTMLDivElement | null>(null);
const gliderRef = ref<HTMLSpanElement | null>(null);
const viewportRef = ref<HTMLDivElement | null>(null);
const markerRefs: (HTMLElement | null)[] = [];
const titleRefs: (HTMLElement | null)[] = [];
const labelWidths: number[] = [];
let heightValue = 0;
let placed = false;

const setMarker = (index: number) => (element: unknown) => {
  markerRefs[index] = (element as HTMLElement | null) ?? null;
};
const setTitle = (index: number) => (element: unknown) => {
  titleRefs[index] = (element as HTMLElement | null) ?? null;
};

const go = (target: number) => {
  const next = clamp(target, 1, total.value + 1);
  if (next === current.value) return;
  if (!controlled.value) internal.value = next;
  if (next > total.value) props.onFinalStepCompleted();
  else props.onStepChange(next);
};

const reachable = (number: number) =>
  !props.disableStepIndicators &&
  number !== current.value &&
  (!props.linear || number <= Math.min(reached.value, total.value));

const statusOf = (number: number): Status =>
  completed.value || number < current.value ? 'complete' : number === current.value ? 'active' : 'upcoming';

const stepLabel = (entry: VNode, number: number) => {
  const title = stepProps(entry).title;
  return title ? `Step ${number}: ${title}` : `Step ${number}`;
};

let measureObserver: ResizeObserver | null = null;
const setupMeasure = () => {
  measureObserver?.disconnect();
  measureObserver = null;
  const root = rootRef.value;
  if (!root) return;
  const measure = () => {
    const folded = vertical.value && root.clientWidth < 520;
    compact.value = folded;
    const track = trackRef.value;
    if (!track || !labelled.value || (vertical.value && !folded)) {
      tight.value = false;
      return;
    }
    const segments = markerRefs.slice(0, total.value);
    if (!tight.value) {
      segments.forEach((segment, index) => {
        const title = titleRefs[index];
        labelWidths[index] = title && segment?.contains(title) ? title.scrollWidth + 8 : 0;
      });
    }
    const badges = segments.reduce(
      (sum, segment) => sum + (segment?.firstElementChild?.getBoundingClientRect().width ?? 22) + 20,
      0
    );
    const labels = labelWidths.slice(0, total.value).reduce((sum, value) => sum + (value || 0), 0);
    const room = track.clientWidth - 8 - 4 * Math.max(0, total.value - 1);
    tight.value = badges + labels > room + 0.5;
  };
  measure();
  measureObserver = new ResizeObserver(measure);
  measureObserver.observe(root);
};

let heightObserver: ResizeObserver | null = null;
const setupHeight = () => {
  const viewport = viewportRef.value;
  if (!viewport) return;
  heightValue = viewport.offsetHeight;
  heightObserver = new ResizeObserver(() => {
    heightValue = viewport.offsetHeight;
  });
  heightObserver.observe(viewport);
};

let gliderObserver: ResizeObserver | null = null;
const setupGlider = () => {
  gliderObserver?.disconnect();
  gliderObserver = null;
  const track = trackRef.value;
  const glider = gliderRef.value;
  if (!track || !glider) return;
  const place = (animate: boolean) => {
    const segment = markerRefs[Math.min(current.value, total.value) - 1];
    if (!segment) return;
    const spring = ease();
    glider.style.transition = animate
      ? `transform 560ms ${spring}, width 560ms ${spring}, height 560ms ${spring}, opacity 200ms ease`
      : 'opacity 200ms ease';
    glider.style.transform = `translate3d(${segment.offsetLeft}px, ${segment.offsetTop}px, 0)`;
    glider.style.width = `${segment.offsetWidth}px`;
    glider.style.height = `${segment.offsetHeight}px`;
    glider.style.opacity = completed.value ? '0' : '1';
  };
  place(placed && !window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  placed = true;
  gliderObserver = new ResizeObserver(() => place(false));
  gliderObserver.observe(track);
};

const runTransition = (id: number) => {
  if (id === 0) return;
  const viewport = viewportRef.value;
  const pane = viewport?.querySelector<HTMLElement>(':scope > .stepper__pane:not(.stepper__pane--leaving)') ?? null;
  const leaving = viewport?.querySelector<HTMLElement>(':scope > .stepper__pane--leaving') ?? null;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mode = props.transition === 'none' ? 'none' : reduced ? 'fade' : props.transition;
  const finish = () => {
    if (view.value.id === id) view.value = { ...view.value, previous: null };
  };
  if (leaving && pane && leaving.contains(document.activeElement)) pane.focus({ preventScroll: true });
  if (!viewport || typeof viewport.animate !== 'function' || mode === 'none') {
    finish();
    return;
  }
  for (const element of [viewport, pane, leaving]) element?.getAnimations().forEach(animation => animation.cancel());
  const from = heightValue;
  const to = viewport.offsetHeight;
  const spring = ease();
  if (Math.abs(from - to) > 0.5) {
    viewport.animate([{ height: `${from}px` }, { height: `${to}px` }], {
      duration: reduced ? 200 : 560,
      easing: reduced ? SETTLE : spring
    });
  }
  const axis = vertical.value ? 'Y' : 'X';
  const shift = mode === 'slide' ? 36 : 0;
  const direction = view.value.direction;
  if (pane) {
    if (shift) {
      pane.animate([{ transform: `translate${axis}(${direction * shift}px)` }, { transform: 'none' }], {
        duration: 560,
        easing: spring
      });
    }
    pane.animate([{ opacity: 0 }, { opacity: 0, offset: 0.25 }, { opacity: 1 }], {
      duration: 420,
      easing: 'ease-out'
    });
  }
  if (leaving) {
    leaving.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: 140,
      easing: 'cubic-bezier(0.2, 0, 0.4, 1)',
      fill: 'forwards'
    });
    const exit = leaving.animate([{ transform: 'none' }, { transform: `translate${axis}(${-direction * shift}px)` }], {
      duration: 200,
      easing: 'cubic-bezier(0.4, 0, 1, 1)',
      fill: 'forwards'
    });
    exit.onfinish = finish;
  } else finish();
};

onMounted(() => {
  setupMeasure();
  setupHeight();
  setupGlider();
});

watch([vertical, labelled, () => props.frame, total, kind], setupMeasure, { flush: 'post' });
watch(() => view.value.id, runTransition, { flush: 'post' });
watch([current, total, completed, kind, labelled, vertical, compact, tight], setupGlider, { flush: 'post' });

onBeforeUnmount(() => {
  measureObserver?.disconnect();
  heightObserver?.disconnect();
  gliderObserver?.disconnect();
});

const panes = computed(() =>
  view.value.previous !== null
    ? [
        { key: view.value.id - 1, step: view.value.previous, leaving: true },
        { key: view.value.id, step: view.value.step, leaving: false }
      ]
    : [{ key: view.value.id, step: view.value.step, leaving: false }]
);

const accentVars = computed((): Record<string, string> => {
  const vars: Record<string, string> = {};
  if (!props.accentColor) return vars;
  vars['--stepper-solid'] = props.accentColor;
  vars['--stepper-solid-ink'] = readableOn(props.accentColor);
  return vars;
});

const rootClass = computed(() =>
  `stepper stepper--${rail.value ? 'vertical' : 'horizontal'}${props.frame ? ' stepper--framed' : ''} ${props.stepCircleContainerClassName} ${props.className}`
    .replace(/\s+/g, ' ')
    .trim()
);

const rootStyle = computed(() => [
  {
    ...(THEMES[props.theme] ?? THEMES.dark),
    '--stepper-radius': `${Math.max(0, props.radius)}px`,
    '--stepper-spring': SPRING,
    '--stepper-width': size(props.width),
    ...accentVars.value
  },
  props.style
]);

const isLast = computed(() => current.value === total.value);
const nextLabel = computed(() => (isLast.value ? props.completeButtonText : props.nextButtonText));

const splitButton = (source: StepperButtonProps) => {
  const { class: cls = '', className = '', onClick, tabIndex, tabindex, ...rest } = source;
  return {
    className: `${className} ${cls}`.trim(),
    onClick,
    tabIndex: (tabIndex ?? tabindex) as number | undefined,
    rest
  };
};

const back = computed(() => splitButton(props.backButtonProps));
const next = computed(() => splitButton(props.nextButtonProps));

const onBack = (event: MouseEvent) => {
  back.value.onClick?.(event);
  if (!event.defaultPrevented) go(current.value - 1);
};

const onNext = (event: MouseEvent) => {
  next.value.onClick?.(event);
  if (!event.defaultPrevented) go(current.value + 1);
};
</script>

<template>
  <div ref="rootRef" :class="rootClass" :data-completed="completed ? '' : undefined" :style="rootStyle">
    <div :class="`stepper__header stepper__header--${kind} ${stepContainerClassName}`.trim()">
      <div v-if="kind === 'dots'" class="stepper__dots">
        <button
          v-for="(entry, index) in steps"
          :key="index + 1"
          type="button"
          class="stepper__dot"
          :data-status="statusOf(index + 1)"
          :aria-label="stepLabel(entry, index + 1)"
          :aria-current="index + 1 === current ? 'step' : undefined"
          :disabled="!reachable(index + 1)"
          @click="go(index + 1)"
        >
          <span class="stepper__dot-mark" :data-status="statusOf(index + 1)" />
        </button>
      </div>

      <div v-else-if="kind === 'bars'" class="stepper__bars">
        <button
          v-for="(entry, index) in steps"
          :key="index + 1"
          type="button"
          class="stepper__bar"
          :data-status="statusOf(index + 1)"
          :aria-label="stepLabel(entry, index + 1)"
          :aria-current="index + 1 === current ? 'step' : undefined"
          :disabled="!reachable(index + 1)"
          @click="go(index + 1)"
        >
          <span class="stepper__bar-track">
            <span class="stepper__bar-fill" :data-filled="completed || index + 1 <= current ? '' : undefined" />
          </span>
        </button>
      </div>

      <div v-else ref="trackRef" class="stepper__track" :data-layout="rail ? 'rail' : 'row'">
        <span ref="gliderRef" class="stepper__glider" aria-hidden="true" />
        <template v-for="(entry, index) in steps" :key="index + 1">
          <div
            v-if="renderStepIndicator"
            :ref="setMarker(index)"
            class="stepper__segment"
            :data-status="statusOf(index + 1)"
          >
            <StepperIndicator
              :render="renderStepIndicator"
              :args="{ step: index + 1, currentStep: current, onStepClick: (clicked: number) => go(clicked) }"
            />
            <span v-if="stepProps(entry).title && !(tight && !rail)" class="stepper__text">
              <span :ref="setTitle(index)" class="stepper__title" :data-status="statusOf(index + 1)">
                <StepperOutlet :node="stepProps(entry).title" />
              </span>
              <span v-if="rail && stepProps(entry).description" class="stepper__description">
                <StepperOutlet :node="stepProps(entry).description" />
              </span>
            </span>
          </div>
          <button
            v-else
            :ref="setMarker(index)"
            type="button"
            class="stepper__segment"
            :data-status="statusOf(index + 1)"
            :aria-label="
              typeof stepProps(entry).title === 'string'
                ? `Step ${index + 1}: ${stepProps(entry).title}`
                : `Step ${index + 1}`
            "
            :aria-current="index + 1 === current ? 'step' : undefined"
            :disabled="!reachable(index + 1)"
            @click="go(index + 1)"
          >
            <span class="stepper__badge" :data-status="statusOf(index + 1)">
              <StepperCheck v-if="statusOf(index + 1) === 'complete'" />
              <span v-else-if="stepProps(entry).icon" class="stepper__glyph">
                <StepperOutlet :node="stepProps(entry).icon" />
              </span>
              <template v-else>{{ index + 1 }}</template>
            </span>
            <span v-if="stepProps(entry).title && !(tight && !rail)" class="stepper__text">
              <span :ref="setTitle(index)" class="stepper__title" :data-status="statusOf(index + 1)">
                <StepperOutlet :node="stepProps(entry).title" />
              </span>
              <span v-if="rail && stepProps(entry).description" class="stepper__description">
                <StepperOutlet :node="stepProps(entry).description" />
              </span>
            </span>
          </button>
        </template>
      </div>
    </div>

    <div class="stepper__body">
      <div ref="viewportRef" :class="`stepper__viewport ${contentClassName}`.trim()" aria-live="polite">
        <div
          v-for="pane in panes"
          :key="pane.key"
          :class="pane.leaving ? 'stepper__pane stepper__pane--leaving' : 'stepper__pane'"
          :aria-hidden="pane.leaving ? 'true' : undefined"
          :tabindex="pane.leaving ? undefined : -1"
        >
          <template v-if="pane.step > total">
            <slot name="completed">
              <StepperOutlet :node="completedContent" />
            </slot>
          </template>
          <StepperOutlet v-else :node="steps[pane.step - 1]" />
        </div>
      </div>

      <div
        v-if="showFooter"
        class="stepper__footer-wrap"
        :data-hidden="completed ? '' : undefined"
        :aria-hidden="completed ? 'true' : undefined"
      >
        <div class="stepper__footer-clip">
          <div :class="`stepper__footer ${footerClassName}`.trim()">
            <button
              type="button"
              v-bind="back.rest"
              :class="`stepper__button stepper__button--back ${back.className}`.trim()"
              :data-hidden="current <= 1 ? '' : undefined"
              :tabindex="completed ? -1 : back.tabIndex"
              @click="onBack"
            >
              <HugeiconsIcon :icon="ArrowLeft01Icon as unknown as IconArray" :size="16" :stroke-width="2" />
              <span>{{ backButtonText }}</span>
            </button>
            <button
              type="button"
              v-bind="next.rest"
              :class="`stepper__button stepper__button--next ${next.className}`.trim()"
              :tabindex="completed ? -1 : next.tabIndex"
              @click="onNext"
            >
              <span>{{ nextLabel }}</span>
              <HugeiconsIcon
                :icon="(isLast ? Tick02Icon : ArrowRight01Icon) as unknown as IconArray"
                :size="16"
                :stroke-width="2"
              />
            </button>
          </div>
        </div>
      </div>
    </div>

    <span v-if="frame" class="stepper__rim" aria-hidden="true" />
  </div>
</template>

<style>
.stepper {
  --stepper-pad: 0px;
  --stepper-inset: 0px;
  --stepper-bleed: 8px;
  --stepper-well-radius: max(6px, calc(var(--stepper-radius) - 8px));
  --stepper-tile-radius: max(4px, calc(var(--stepper-well-radius) - 4px));
  position: relative;
  display: flex;
  flex-direction: column;
  width: min(100%, var(--stepper-width));
  min-width: 0;
  max-width: 100%;
  box-sizing: border-box;
  border-radius: var(--stepper-radius);
  color: var(--stepper-ink);
  -webkit-tap-highlight-color: transparent;
}

.stepper--framed {
  --stepper-pad: 8px;
  --stepper-inset: 12px;
  --stepper-bleed: 20px;
  padding: var(--stepper-pad);
  background: var(--stepper-frame);
  box-shadow: var(--stepper-frame-shadow);
  -webkit-backdrop-filter: blur(20px) saturate(1.6);
  backdrop-filter: blur(20px) saturate(1.6);
}

.stepper__rim {
  position: absolute;
  inset: 0;
  z-index: 2;
  border-radius: inherit;
  box-shadow:
    inset 0 0 0 1px var(--stepper-frame-edge),
    inset 0 1px 0 var(--stepper-frame-highlight);
  pointer-events: none;
}

.stepper__header--dots,
.stepper__header--bars {
  padding: var(--stepper-inset) var(--stepper-inset) 0;
}

.stepper__track {
  position: relative;
  display: flex;
  gap: 4px;
  padding: 4px;
  border-radius: var(--stepper-well-radius);
  background: var(--stepper-well);
}

.stepper__glider {
  position: absolute;
  top: 0;
  left: 0;
  border-radius: var(--stepper-tile-radius);
  background: var(--stepper-tile);
  box-shadow:
    inset 0 0 0 1px var(--stepper-tile-edge),
    inset 0 1px 0 var(--stepper-tile-highlight),
    var(--stepper-tile-shadow);
  opacity: 0;
  pointer-events: none;
}

.stepper__segment {
  position: relative;
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 0;
  height: 40px;
  padding: 0 10px;
  box-sizing: border-box;
  border: none;
  border-radius: var(--stepper-tile-radius);
  background: none;
  color: var(--stepper-muted);
  font-family: inherit;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.stepper__segment:disabled {
  cursor: default;
}

.stepper__badge {
  display: grid;
  flex: none;
  place-items: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  box-shadow: inset 0 0 0 1px var(--stepper-faint);
  color: var(--stepper-muted);
  font-size: 11.5px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  line-height: 1;
  transition:
    background-color 0.15s ease,
    box-shadow 0.15s ease,
    color 0.15s ease;
}

.stepper__badge[data-status='active'] {
  box-shadow: inset 0 0 0 1.5px var(--stepper-ink);
  color: var(--stepper-ink);
}

.stepper__badge[data-status='complete'] {
  background: var(--stepper-solid);
  box-shadow: none;
  color: var(--stepper-solid-ink);
}

.stepper__glyph,
.stepper__check {
  display: grid;
  place-items: center;
}

.stepper__text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  text-align: left;
}

.stepper__title {
  overflow: hidden;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.2;
  color: var(--stepper-muted);
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 0.2s ease;
}

.stepper__title:not([data-status='upcoming']) {
  color: var(--stepper-ink);
}

.stepper__description {
  overflow: hidden;
  font-size: 12px;
  line-height: 1.35;
  color: var(--stepper-muted);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.stepper__track[data-layout='rail'] {
  flex: 1;
  flex-direction: column;
}

.stepper__track[data-layout='rail'] .stepper__segment {
  flex: none;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 10px;
  height: auto;
  padding: 10px;
}

.stepper__track[data-layout='rail'] .stepper__text {
  padding-top: 3px;
}

.stepper__dots {
  display: flex;
  justify-content: center;
  gap: 2px;
}

.stepper__dot {
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: none;
  cursor: pointer;
}

.stepper__dot-mark {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--stepper-faint);
  transition:
    background-color 0.25s ease,
    transform 0.45s var(--stepper-spring);
}

.stepper__dot-mark[data-status='complete'] {
  background: var(--stepper-muted);
}

.stepper__dot-mark[data-status='active'] {
  background: var(--stepper-solid);
  transform: scale(1.3);
}

.stepper__bars {
  display: flex;
  gap: 6px;
}

.stepper__bar {
  display: flex;
  flex: 1;
  align-items: center;
  height: 18px;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
}

.stepper__bar-track {
  position: relative;
  width: 100%;
  height: 4px;
  overflow: hidden;
  border-radius: 4px;
  background: var(--stepper-track);
}

.stepper__bar-fill {
  position: absolute;
  inset: 0;
  background: var(--stepper-solid);
  transform: scaleX(0);
  transform-origin: left center;
  transition: transform 560ms var(--stepper-spring);
}

.stepper__bar-fill[data-filled] {
  transform: none;
}

.stepper__dot:disabled,
.stepper__bar:disabled {
  cursor: default;
}

.stepper__body {
  display: flex;
  flex-direction: column;
  min-width: 0;
  padding: 20px var(--stepper-inset) var(--stepper-inset);
}

.stepper__viewport {
  position: relative;
  margin: -6px calc(var(--stepper-bleed) * -1);
  overflow: hidden;
}

.stepper__pane {
  box-sizing: border-box;
  padding: 6px var(--stepper-bleed);
  outline: none;
}

.stepper__pane--leaving {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  pointer-events: none;
}

.stepper__step {
  min-width: 0;
}

.stepper__footer-wrap {
  display: grid;
  grid-template-rows: 1fr;
  transition:
    grid-template-rows 480ms var(--stepper-spring),
    opacity 0.2s ease;
}

.stepper__footer-wrap[data-hidden] {
  grid-template-rows: 0fr;
  opacity: 0;
  pointer-events: none;
}

.stepper__footer-clip {
  min-height: 0;
}

.stepper__footer-wrap[data-hidden] .stepper__footer-clip {
  overflow: hidden;
}

.stepper__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-top: 20px;
}

.stepper__button {
  display: inline-flex;
  flex: none;
  align-items: center;
  gap: 6px;
  height: 38px;
  padding: 0 14px;
  border: none;
  border-radius: max(8px, calc(var(--stepper-radius) * 0.5));
  font-family: inherit;
  font-size: 13.5px;
  font-weight: 600;
  line-height: 1;
  cursor: pointer;
  transition:
    filter 0.2s ease,
    transform 0.2s ease,
    opacity 0.2s ease;
}

.stepper__button--back {
  padding-left: 10px;
  background: var(--stepper-tile);
  box-shadow:
    inset 0 0 0 1px var(--stepper-tile-edge),
    inset 0 1px 0 var(--stepper-tile-highlight),
    var(--stepper-tile-shadow);
  color: var(--stepper-ink);
}

.stepper__button--back[data-hidden] {
  visibility: hidden;
  opacity: 0;
  transition:
    opacity 0.2s ease,
    visibility 0s 0.2s;
}

.stepper__button--next {
  margin-left: auto;
  padding-right: 11px;
  background: var(--stepper-solid);
  box-shadow: 0 4px 12px -6px rgba(0, 0, 0, 0.5);
  color: var(--stepper-solid-ink);
}

.stepper__button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.stepper__button:focus-visible,
.stepper__segment:focus-visible,
.stepper__dot:focus-visible,
.stepper__bar:focus-visible {
  outline: 2px solid var(--stepper-ink);
  outline-offset: 2px;
}

.stepper--vertical {
  flex-direction: row;
  align-items: stretch;
}

.stepper--vertical .stepper__header {
  display: flex;
  flex: none;
  width: 212px;
  max-width: 42%;
}

.stepper--vertical .stepper__body {
  flex: 1;
  padding: var(--stepper-inset) var(--stepper-inset) var(--stepper-inset) 20px;
}

@media (hover: hover) {
  .stepper__segment:not(:disabled):hover {
    background: var(--stepper-hover-fill);
  }

  .stepper__button--back:not(:disabled):hover {
    filter: var(--stepper-hover);
  }

  .stepper__button--next:not(:disabled):hover {
    filter: var(--stepper-solid-hover);
  }

  .stepper__dot:not(:disabled):hover .stepper__dot-mark {
    transform: scale(1.3);
  }

  .stepper__bar:not(:disabled):hover .stepper__bar-track {
    background: var(--stepper-faint);
  }
}

.stepper__button:not(:disabled):active {
  filter: var(--stepper-press);
  transform: scale(0.96);
  transition-duration: 0s;
}

@media (prefers-reduced-motion: reduce) {
  .stepper__bar-fill,
  .stepper__dot-mark,
  .stepper__footer-wrap {
    transition-duration: 0.01ms;
  }
}
</style>
