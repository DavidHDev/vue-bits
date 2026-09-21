<script setup lang="ts">
import { ArrowDown01Icon, SparklesIcon, Tick02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon, type IconArray } from '@hugeicons/vue';
import { animate, useReducedMotion, type AnimationPlaybackControls } from 'motion-v';
import {
  computed,
  defineComponent,
  h,
  ref,
  useSlots,
  watch,
  type CSSProperties,
  type FunctionalComponent,
  type VNodeChild
} from 'vue';

export type ThoughtLineGlyph = 'sparkle' | 'dot' | 'none';

interface ThoughtLineProps {
  label?: string;
  doneLabel?: string;
  renderLabel?: (text: string, working: boolean) => VNodeChild;
  glyph?: ThoughtLineGlyph;
  steps?: string[];
  collapsible?: boolean;
  collapseOnSettle?: boolean;
  color?: string;
  glyphColor?: string;
  fontSize?: number;
  breathPeriod?: number;
  breathDepth?: number;
  shimmer?: boolean;
  shimmerDuration?: number;
  settleDuration?: number;
  settleBlur?: number;
  working?: boolean;
  settleAfter?: number;
  elapsed?: number;
  showTimer?: boolean;
  className?: string;
}

const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1];
const EASE_IN_OUT: [number, number, number, number] = [0.77, 0, 0.175, 1];
const GLYPH_DONE = 0.55;

const fmt = (ds: number) =>
  ds < 600 ? `${(ds / 10).toFixed(1)}s` : `${Math.floor(ds / 600)}m ${((ds % 600) / 10).toFixed(1)}s`;
const spoken = (ds: number) =>
  ds < 600
    ? `${(ds / 10).toFixed(1)} seconds`
    : `${Math.floor(ds / 600)} minutes ${((ds % 600) / 10).toFixed(1)} seconds`;

const props = withDefaults(defineProps<ThoughtLineProps>(), {
  label: 'Thinking…',
  doneLabel: '',
  renderLabel: undefined,
  glyph: 'sparkle',
  steps: () => [],
  collapsible: true,
  collapseOnSettle: true,
  color: 'currentColor',
  glyphColor: '',
  fontSize: 16,
  breathPeriod: 1.6,
  breathDepth: 0.45,
  shimmer: true,
  shimmerDuration: 1.8,
  settleDuration: 350,
  settleBlur: 2,
  working: true,
  settleAfter: 0,
  elapsed: undefined,
  showTimer: true,
  className: ''
});

const emit = defineEmits<{ settle: [seconds: number] }>();

// 'button' would resolve to the globally registered PrimeVue Button, so the tag is created by hand
const HeadTag = defineComponent({
  props: { tag: { type: String, required: true } },
  setup(p, { attrs, slots }) {
    return () => h(p.tag, attrs, slots.default?.());
  }
});
const Rendered: FunctionalComponent<{
  fn: NonNullable<ThoughtLineProps['renderLabel']>;
  text: string;
  working: boolean;
}> = p => p.fn(p.text, p.working) as VNodeChild as never;

const slots = useSlots();
const reduce = useReducedMotion();
const autoSettled = ref(false);
const open = ref(true);
const isWorking = computed(() => props.working && !autoSettled.value);
const doneText = computed(() => props.doneLabel || (props.showTimer ? 'Thought for' : 'Done thinking'));
const hasTrace = computed(() => props.steps.length > 0);
const depth = computed(() => (reduce.value ? Math.min(props.breathDepth, 0.2) : props.breathDepth));
const period = computed(() => (reduce.value ? props.breathPeriod * 1.5 : props.breathPeriod));
const trough = computed(() => 1 - depth.value);
const sheen = computed(() => props.shimmer && !reduce.value);
const toggle = computed(() => hasTrace.value && props.collapsible);
const hasGlyph = computed(() => props.glyph !== 'none' || !!slots.glyph);

const glyphRef = ref<HTMLSpanElement | null>(null);
const breathRef = ref<HTMLSpanElement | null>(null);
const timerRef = ref<HTMLSpanElement | null>(null);
const stackRef = ref<HTMLSpanElement | null>(null);
const workRef = ref<HTMLSpanElement | null>(null);
const doneRef = ref<HTMLSpanElement | null>(null);
let ds = 0;
let prevWorking = isWorking.value;
const announce = ref(props.label);

const sparkleIcon = SparklesIcon as unknown as IconArray;
const chevronIcon = ArrowDown01Icon as unknown as IconArray;
const tickIcon = Tick02Icon as unknown as IconArray;

watch(
  () => props.working,
  on => {
    if (on) autoSettled.value = false;
  }
);
watch(
  [isWorking, () => props.collapseOnSettle],
  () => {
    if (isWorking.value) open.value = true;
    else if (props.collapseOnSettle) open.value = false;
  },
  { immediate: true }
);

watch(
  [isWorking, period, depth, trough, () => props.settleDuration, () => props.glyph, sheen, hasGlyph],
  (_v, _o, onCleanup) => {
    const glyphEl = glyphRef.value;
    const breathEl = breathRef.value;
    if (!breathEl) return;
    const s = props.settleDuration / 1000;
    const tr = trough.value;
    const loop = (el: HTMLElement, delay: number) =>
      animate(el, { opacity: [tr, 1, tr] }, { duration: period.value, ease: EASE_IN_OUT, repeat: Infinity, delay });
    let cancelled = false;
    const running: AnimationPlaybackControls[] = [];
    if (isWorking.value) {
      if (depth.value > 0) {
        if (sheen.value) running.push(animate(breathEl, { opacity: 1 }, { duration: 0.2, ease: EASE_OUT }));
        if (glyphEl) {
          const lead = animate(glyphEl, { opacity: tr }, { duration: 0.2, ease: EASE_OUT });
          running.push(lead);
          lead.then(() => {
            if (cancelled) return;
            running.push(loop(glyphEl, 0));
            if (!sheen.value) running.push(loop(breathEl, 0.14));
          });
        } else if (!sheen.value) {
          running.push(loop(breathEl, 0.14));
        }
      } else {
        if (glyphEl) running.push(animate(glyphEl, { opacity: 1 }, { duration: 0.2, ease: EASE_OUT }));
        running.push(animate(breathEl, { opacity: 1 }, { duration: 0.2, ease: EASE_OUT }));
      }
    } else {
      if (glyphEl) running.push(animate(glyphEl, { opacity: GLYPH_DONE }, { duration: s, ease: EASE_OUT }));
      running.push(animate(breathEl, { opacity: 1 }, { duration: s, ease: EASE_OUT }));
    }
    onCleanup(() => {
      cancelled = true;
      running.forEach(a => a.stop());
    });
  },
  { flush: 'post', immediate: true }
);

// the clock is written by hand so ten ticks a second never render the component
const paint = (next: number) => {
  ds = next;
  if (timerRef.value) timerRef.value.textContent = fmt(next);
};
watch(
  [isWorking, () => props.elapsed, () => props.settleAfter, () => props.showTimer],
  (_v, _o, onCleanup) => {
    if (props.elapsed != null) {
      paint(Math.round(props.elapsed * 10));
      return;
    }
    if (!isWorking.value) {
      paint(ds);
      return;
    }
    const startedAt = performance.now();
    paint(0);
    const id = setInterval(() => {
      const now = Math.floor((performance.now() - startedAt) / 100);
      paint(now);
      if (props.settleAfter > 0 && now >= Math.round(props.settleAfter * 10)) autoSettled.value = true;
    }, 100);
    onCleanup(() => clearInterval(id));
  },
  { flush: 'post', immediate: true }
);

watch(
  [isWorking, () => props.label, doneText, () => props.fontSize, () => props.showTimer],
  (_v, _o, onCleanup) => {
    const t = timerRef.value;
    const stack = stackRef.value;
    if (!t || !stack) return;
    const place = (glide: boolean) => {
      const active = isWorking.value ? workRef.value : doneRef.value;
      if (!active) return;
      const shift = active.offsetWidth - stack.offsetWidth;
      if (!glide) t.style.transition = 'none';
      t.style.transform = `translateX(${shift}px)`;
      if (!glide) {
        void t.offsetWidth;
        t.style.transition = '';
      }
    };
    place(prevWorking !== isWorking.value);
    prevWorking = isWorking.value;
    const ro = new ResizeObserver(() => place(false));
    if (workRef.value) ro.observe(workRef.value);
    if (doneRef.value) ro.observe(doneRef.value);
    onCleanup(() => ro.disconnect());
  },
  { flush: 'post', immediate: true }
);

watch(
  isWorking,
  working => {
    if (working) {
      announce.value = props.label;
      return;
    }
    announce.value = props.showTimer ? `${doneText.value} ${spoken(ds)}` : doneText.value;
    emit('settle', ds / 10);
  },
  { flush: 'post', immediate: true }
);

const headAttrs = computed(() => {
  const cls =
    'relative m-0 inline-flex cursor-default items-center gap-[0.3em] border-0 bg-transparent p-0 text-left whitespace-nowrap text-inherit outline-none [font:inherit] data-[toggle]:cursor-pointer data-[toggle]:[-webkit-tap-highlight-color:transparent]';
  if (!props.collapsible) return { class: cls };
  return {
    class: cls,
    type: 'button',
    'data-toggle': toggle.value ? '' : undefined,
    'aria-expanded': toggle.value ? open.value : undefined,
    tabindex: toggle.value ? 0 : -1,
    onClick: () => {
      if (toggle.value) open.value = !open.value;
    }
  };
});

const rootStyle = computed(
  () =>
    ({
      '--tl-font': `${props.fontSize}px`,
      '--tl-color': props.color,
      '--tl-glyph': props.glyphColor || props.color,
      '--tl-settle': `${props.settleDuration}ms`,
      '--tl-blur': `${props.settleBlur}px`,
      '--tl-shimmer': `${props.shimmerDuration}s`
    }) as CSSProperties
);
</script>

<template>
  <div
    class="group inline-flex flex-col items-start font-medium leading-[1.2] [color:var(--tl-color)] [font-family:inherit] [font-size:var(--tl-font)]"
    :class="className"
    :data-working="isWorking ? '' : undefined"
    :data-open="open && hasTrace ? '' : undefined"
    :style="rootStyle"
  >
    <HeadTag :tag="collapsible ? 'button' : 'div'" v-bind="headAttrs">
      <span
        v-if="hasGlyph"
        ref="glyphRef"
        class="[&>svg]:block inline-flex flex-none mr-[0.2em] w-[1.1em] [&>svg]:w-full h-[1.1em] [&>svg]:h-full [color:var(--tl-glyph)]"
        aria-hidden="true"
      >
        <slot name="glyph">
          <HugeiconsIcon v-if="glyph === 'sparkle'" :icon="sparkleIcon" size="100%" :stroke-width="2" />
          <span v-else class="bg-current m-auto rounded-full w-[0.5em] h-[0.5em]" />
        </slot>
      </span>
      <span ref="stackRef" class="inline-grid" aria-hidden="true">
        <span
          ref="workRef"
          class="opacity-0 data-[active]:opacity-100 w-max [grid-area:1/1] [filter:blur(var(--tl-blur))] [transition:opacity_var(--tl-settle)_cubic-bezier(0.23,1,0.32,1),filter_var(--tl-settle)_cubic-bezier(0.23,1,0.32,1)] data-[active]:[filter:blur(0)] motion-reduce:[filter:none]! motion-reduce:[transition:opacity_var(--tl-settle)_ease]"
          :data-active="isWorking ? '' : undefined"
        >
          <span
            ref="breathRef"
            class="inline-block group-data-[working]:data-[shimmer]:bg-clip-text group-data-[working]:data-[shimmer]:[-webkit-text-fill-color:transparent] group-data-[working]:data-[shimmer]:text-transparent group-data-[working]:data-[shimmer]:[background-image:linear-gradient(100deg,color-mix(in_srgb,var(--tl-color)_50%,transparent)_30%,var(--tl-color)_50%,color-mix(in_srgb,var(--tl-color)_50%,transparent)_70%)] group-data-[working]:data-[shimmer]:[background-size:250%_100%] group-data-[working]:data-[shimmer]:[background-position:125%_0] group-data-[working]:data-[shimmer]:[animation:thought-line-shimmer_var(--tl-shimmer)_linear_infinite]"
            :data-shimmer="sheen ? '' : undefined"
          >
            <Rendered v-if="renderLabel" :fn="renderLabel" :text="label" :working="true" />
            <template v-else>{{ label }}</template>
          </span>
        </span>
        <span
          ref="doneRef"
          class="opacity-0 w-max [grid-area:1/1] [filter:blur(var(--tl-blur))] [transition:opacity_var(--tl-settle)_cubic-bezier(0.23,1,0.32,1),filter_var(--tl-settle)_cubic-bezier(0.23,1,0.32,1)] data-[active]:[opacity:var(--tl-done)] data-[active]:[filter:blur(0)] motion-reduce:[filter:none]! motion-reduce:[transition:opacity_var(--tl-settle)_ease]"
          :data-active="isWorking ? undefined : ''"
        >
          <Rendered v-if="renderLabel" :fn="renderLabel" :text="doneText" :working="false" />
          <template v-else>{{ doneText }}</template>
        </span>
      </span>
      <span
        v-if="showTimer"
        ref="timerRef"
        class="tabular-nums [opacity:var(--tl-timer)] [transition:opacity_var(--tl-settle)_ease,transform_var(--tl-settle)_cubic-bezier(0.77,0,0.175,1)] data-[done]:[opacity:var(--tl-done)] motion-reduce:[transition:opacity_var(--tl-settle)_ease]"
        :data-done="isWorking ? undefined : ''"
        aria-hidden="true"
      >
        0.0s
      </span>
      <span
        v-if="collapsible"
        class="inline-flex opacity-0 data-[on]:opacity-55 ml-[0.1em] group-data-[open]:rotate-180 [transition:opacity_200ms_ease,transform_200ms_cubic-bezier(0.23,1,0.32,1)]"
        :data-on="hasTrace ? '' : undefined"
        aria-hidden="true"
      >
        <HugeiconsIcon :icon="chevronIcon" size="1em" :stroke-width="2.2" />
      </span>
      <span class="sr-only" role="status">{{ announce }}</span>
    </HeadTag>
    <div
      v-if="hasTrace"
      class="grid w-0 min-w-full [grid-template-rows:0fr] [transition:grid-template-rows_var(--tl-settle)_cubic-bezier(0.23,1,0.32,1)] data-[open]:[grid-template-rows:1fr]"
      :data-open="open ? '' : undefined"
      :aria-hidden="!open"
    >
      <div class="min-h-0 overflow-x-visible overflow-y-clip">
        <div
          class="flex flex-col gap-[0.45em] pt-[0.6em] pb-[0.2em] pl-[1.6em] w-max font-normal text-[0.875em] whitespace-nowrap"
        >
          <div
            v-for="(text, i) in steps"
            :key="`${i}-${text}`"
            class="group/step flex items-center gap-[0.5em] opacity-100 starting:opacity-0 translate-y-0 starting:-translate-y-1 [transition:opacity_200ms_cubic-bezier(0.23,1,0.32,1),transform_200ms_cubic-bezier(0.23,1,0.32,1)] motion-reduce:[transform:none]! motion-reduce:[transition:opacity_200ms_ease]"
            :data-done="!isWorking || i < steps.length - 1 ? '' : undefined"
          >
            <span class="inline-grid flex-none place-items-center opacity-55 w-[1em] h-[1em]" aria-hidden="true">
              <HugeiconsIcon
                v-if="!isWorking || i < steps.length - 1"
                :icon="tickIcon"
                size="1em"
                :stroke-width="2.5"
              />
              <i
                v-else
                class="block bg-current rounded-full w-[0.4em] h-[0.4em] [animation:thought-line-pulse_1.6s_cubic-bezier(0.77,0,0.175,1)_infinite] motion-reduce:[animation-duration:2.4s]"
              />
            </span>
            <span class="group-data-[done]/step:opacity-55 [transition:opacity_var(--tl-settle)_ease]">
              {{ text }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@keyframes thought-line-pulse {
  0%,
  100% {
    opacity: 0.55;
  }
  50% {
    opacity: 1;
  }
}
@keyframes thought-line-shimmer {
  to {
    background-position: -125% 0;
  }
}
</style>
