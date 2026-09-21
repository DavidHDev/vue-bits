<script setup lang="ts">
import { animate, motionValue, useReducedMotion } from 'motion-v';
import { computed, onMounted, onUnmounted, ref, useSlots, watch, type CSSProperties } from 'vue';

export type StatusMarkStatus = 'pending' | 'running' | 'done' | 'failed' | 'cancelled';

interface StatusMarkProps {
  status?: StatusMarkStatus;
  progress?: number;
  label?: string;
  color?: string;
  doneColor?: string;
  errorColor?: string;
  size?: number;
  strokeWidth?: number;
  dashes?: number;
  fontSize?: number;
  spinDuration?: number;
  arcLength?: number;
  drawDuration?: number;
  fillOpacity?: number;
  strike?: boolean;
  strikeDelay?: number;
  className?: string;
}

const UI = { type: 'spring' as const, duration: 0.3, bounce: 0 };
const MORPH = { duration: 0.3, ease: [0.77, 0, 0.175, 1] as [number, number, number, number] };
const CHECK = 'M7.5 12.25 10.5 15.25 16.75 8.75';
const CROSS = 'M8.5 8.5 15.5 15.5M15.5 8.5 8.5 15.5';
const TEXT: Record<StatusMarkStatus, string> = {
  pending: 'Pending',
  running: 'In progress',
  done: 'Completed',
  failed: 'Failed',
  cancelled: 'Cancelled'
};
const IDLE_DASH = 0.3;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

const props = withDefaults(defineProps<StatusMarkProps>(), {
  status: 'pending',
  progress: undefined,
  label: undefined,
  color: 'currentColor',
  doneColor: '#22c55e',
  errorColor: '#ef4444',
  size: 20,
  strokeWidth: 2,
  dashes: 8,
  fontSize: 14,
  spinDuration: 1100,
  arcLength: 0.68,
  drawDuration: 240,
  fillOpacity: 0.06,
  strike: true,
  strikeDelay: 60,
  className: ''
});

const slots = useSlots();
const reduce = useReducedMotion();
const r = computed(() => 10 - props.strokeWidth / 2);
const C = computed(() => 2 * Math.PI * r.value);
const P = computed(() => C.value / Math.max(1, props.dashes));
const determinate = computed(
  () => props.status === 'running' && typeof props.progress === 'number' && Number.isFinite(props.progress)
);
const indeterminate = computed(() => props.status === 'running' && !determinate.value);
const solid = computed(() => props.status === 'running' || props.status === 'done' || props.status === 'failed');
const targetArc = computed(() =>
  indeterminate.value ? props.arcLength : determinate.value ? clamp01(props.progress as number) : 1
);

const mode = motionValue(solid.value ? 1 : 0);
const arc = motionValue(targetArc.value);
const travel = motionValue(0);
const ringRef = ref<SVGCircleElement | null>(null);
let gen = 0;
const offs: (() => void)[] = [];

// the ring's dashes are written by hand so the arc fuses and spins without a Vue render per frame
const writeDash = () => {
  const m = mode.get();
  const a = arc.get();
  const dash = IDLE_DASH * P.value + (a * C.value - IDLE_DASH * P.value) * m;
  const gap = (1 - IDLE_DASH) * P.value + ((1 - a) * C.value - (1 - IDLE_DASH) * P.value) * m;
  ringRef.value?.setAttribute('stroke-dasharray', `${Math.max(0, dash)} ${Math.max(0, gap)}`);
};

const sync = () => {
  const g = ++gen;
  if (reduce.value) {
    mode.jump(solid.value ? 1 : 0);
    arc.jump(targetArc.value);
    travel.jump(0);
    return;
  }
  if (mode.get() === 0) arc.jump(targetArc.value);
  animate(mode, solid.value ? 1 : 0, MORPH);
  animate(arc, targetArc.value, UI);
  if (indeterminate.value) {
    const t0 = travel.get();
    animate(travel, [t0, t0 - C.value], { duration: props.spinDuration / 1000, ease: 'linear', repeat: Infinity });
    return;
  }
  const unit = determinate.value ? C.value : P.value;
  const to = Math.floor(travel.get() / unit) * unit;
  animate(travel, to, UI).then(() => {
    if (gen === g) travel.jump(0);
  });
};

onMounted(() => {
  writeDash();
  ringRef.value?.setAttribute('stroke-dashoffset', String(travel.get()));
  offs.push(
    mode.on('change', writeDash),
    arc.on('change', writeDash),
    travel.on('change', (v: number) => ringRef.value?.setAttribute('stroke-dashoffset', String(v)))
  );
  sync();
});
watch([C, P], writeDash, { flush: 'post' });
watch([() => props.status, determinate, targetArc, reduce, C, P, () => props.spinDuration], sync, { flush: 'post' });
onUnmounted(() => {
  gen += 1;
  offs.forEach(off => off());
  mode.stop();
  arc.stop();
  travel.stop();
});

const hasLabel = computed(() => (props.label !== undefined && props.label !== null) || !!slots.default);
const spoken = computed(
  () => TEXT[props.status] + (determinate.value ? `, ${Math.round(clamp01(props.progress as number) * 100)}%` : '')
);

const rootStyle = computed(
  () =>
    ({
      '--sm-size': `${props.size}px`,
      '--sm-stroke': props.strokeWidth,
      '--sm-color': props.color,
      '--sm-done': props.doneColor,
      '--sm-error': props.errorColor,
      '--sm-fill': props.fillOpacity,
      '--sm-font': `${props.fontSize}px`,
      '--sm-draw': `${props.drawDuration}ms`,
      '--sm-strike-delay': `${120 + props.strikeDelay}ms`,
      '--sm-check-delay': '120ms'
    }) as CSSProperties
);
</script>

<template>
  <span
    class="group inline-flex relative items-center align-middle leading-none [gap:calc(var(--sm-size)*0.5)]"
    :class="className"
    :data-status="status"
    :data-indeterminate="indeterminate ? '' : undefined"
    :data-strike="strike ? '' : undefined"
    :style="rootStyle"
  >
    <svg
      class="overflow-visible shrink-0 group-data-[status=done]:[color:var(--sm-done)] group-data-[status=failed]:[color:var(--sm-error)] [color:var(--sm-color)] [transition:color_200ms_ease]"
      viewBox="0 0 24 24"
      :width="size"
      :height="size"
      :role="hasLabel ? undefined : 'img'"
      :aria-label="hasLabel ? undefined : spoken"
      :aria-hidden="hasLabel || undefined"
    >
      <circle
        class="group-data-[status=done]:[fill-opacity:var(--sm-fill)] group-data-[status=failed]:[fill-opacity:var(--sm-fill)] group-data-[status=running]:[stroke-opacity:0.2] [fill-opacity:0] [fill:currentColor] [stroke-opacity:0] [stroke-width:var(--sm-stroke)] [stroke:currentColor] [transition:fill-opacity_180ms_ease,stroke-opacity_200ms_ease]"
        cx="12"
        cy="12"
        :r="r"
        transform="rotate(-90 12 12)"
      />
      <circle
        ref="ringRef"
        class="opacity-[0.55] group-data-[status=done]:opacity-100 group-data-[status=failed]:opacity-100 group-data-[status=running]:opacity-100 fill-none motion-reduce:group-data-[indeterminate]:animate-[sm-breathe_1400ms_cubic-bezier(0.77,0,0.175,1)_infinite] [stroke-linecap:round] [stroke-width:var(--sm-stroke)] [stroke:currentColor] [transition:opacity_200ms_ease]"
        cx="12"
        cy="12"
        :r="r"
        transform="rotate(-90 12 12)"
      />
      <path
        class="opacity-0 group-data-[status=done]:opacity-100 fill-none motion-reduce:group-data-[status=done]:[transition:opacity_200ms_ease] [stroke-dasharray:1_2] [stroke-dashoffset:1.05] [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:var(--sm-stroke)] [stroke:currentColor] [transition:stroke-dashoffset_160ms_cubic-bezier(0.23,1,0.32,1),opacity_0ms_linear_160ms] group-data-[status=done]:[stroke-dashoffset:0] group-data-[status=done]:[transition:stroke-dashoffset_var(--sm-draw)_cubic-bezier(0.23,1,0.32,1)_var(--sm-check-delay),opacity_0ms_linear_var(--sm-check-delay)] motion-reduce:[stroke-dashoffset:0] motion-reduce:[transition:opacity_200ms_ease]"
        :d="CHECK"
        pathLength="1"
      />
      <path
        class="opacity-0 group-data-[status=cancelled]:opacity-100 group-data-[status=failed]:opacity-100 fill-none [stroke-dasharray:1_2] [stroke-dashoffset:1.05] [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:var(--sm-stroke)] [stroke:currentColor] [transition:stroke-dashoffset_160ms_cubic-bezier(0.23,1,0.32,1),opacity_0ms_linear_160ms] group-data-[status=failed]:[stroke-dashoffset:0] group-data-[status=failed]:[transition:stroke-dashoffset_var(--sm-draw)_cubic-bezier(0.23,1,0.32,1)_var(--sm-check-delay),opacity_0ms_linear_var(--sm-check-delay)] group-data-[status=cancelled]:[stroke-dashoffset:0] group-data-[status=cancelled]:[transition:stroke-dashoffset_var(--sm-draw)_cubic-bezier(0.23,1,0.32,1)_var(--sm-check-delay),opacity_0ms_linear_var(--sm-check-delay)] motion-reduce:[stroke-dashoffset:0] motion-reduce:[transition:opacity_200ms_ease]"
        :d="CROSS"
        pathLength="1"
      />
    </svg>
    <span v-if="hasLabel" class="sr-only">{{ spoken }}:&nbsp;</span>
    <span
      v-if="hasLabel"
      class="relative opacity-[0.65] group-data-[status=cancelled]:opacity-[0.55] group-data-[status=done]:opacity-60 group-data-[status=failed]:opacity-100 group-data-[status=running]:opacity-100 leading-[1.25] [color:var(--sm-color)] [font-size:var(--sm-font)] [transition:opacity_200ms_ease]"
    >
      <slot>{{ label }}</slot>
      <span
        class="top-1/2 absolute inset-x-0 bg-current motion-reduce:group-data-[status=done]:group-data-[strike]:opacity-100 motion-reduce:opacity-0 origin-left pointer-events-none [transform:scaleX(0)] group-data-[status=done]:group-data-[strike]:[transform:scaleX(1)] motion-reduce:[transform:scaleX(1)]! [translate:0_-50%] [height:max(1px,calc(var(--sm-font)/14))] [transition:transform_160ms_cubic-bezier(0.23,1,0.32,1)] group-data-[status=done]:group-data-[strike]:[transition:transform_280ms_cubic-bezier(0.23,1,0.32,1)_var(--sm-strike-delay)] motion-reduce:[transition:opacity_200ms_ease] motion-reduce:group-data-[status=done]:group-data-[strike]:[transition:opacity_200ms_ease]"
        aria-hidden="true"
      />
    </span>
  </span>
</template>

<style>
@keyframes sm-breathe {
  50% {
    opacity: 0.45;
  }
}
</style>
