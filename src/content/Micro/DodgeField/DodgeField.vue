<script setup lang="ts">
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from 'motion-v';
import { computed, onMounted, onUnmounted, ref, watch, type CSSProperties, type ComponentPublicInstance } from 'vue';

export type DodgeAxis = 'both' | 'x' | 'y';
export type DodgeWall = 'clamp' | 'bounce';
export type DodgeFieldState = { dodges: number; gave: boolean; caught: boolean; fleeing: boolean };

interface DodgeFieldProps {
  taunts?: string[];
  notice?: string;
  inkColor?: string;
  contrastColor?: string;
  fieldHeight?: number;
  reach?: number;
  radius?: number;
  falloff?: number;
  fleeDuration?: number;
  returnDuration?: number;
  returnBounce?: number;
  axis?: DodgeAxis;
  wall?: DodgeWall;
  patience?: number;
  disabled?: boolean;
  className?: string;
}

const COUNT_LINE = 0.55;
const DEAD_ZONE = 6;
const CAUGHT_HOLD_MS = 760;
const INSET = 12;

const wallIt = (t: number, room: number, wall: DodgeWall) => {
  if (wall === 'bounce') {
    if (t > room) return Math.max(-room, 2 * room - t);
    if (t < -room) return Math.min(room, -2 * room - t);
    return t;
  }
  return Math.min(room, Math.max(-room, t));
};
const bearingOf = (dx: number, dy: number, d: number, axis: DodgeAxis) => {
  if (axis === 'x') return { x: Math.sign(dx) || 1, y: 0 };
  if (axis === 'y') return { x: 0, y: Math.sign(dy) || 1 };
  return { x: dx / d, y: dy / d };
};

const props = withDefaults(defineProps<DodgeFieldProps>(), {
  taunts: () => ['Catch me', 'Nope', 'Too slow', 'Almost', 'Okay, okay'],
  notice: '',
  inkColor: '#f5f5f5',
  contrastColor: '#18181b',
  fieldHeight: 240,
  reach: 72,
  radius: 120,
  falloff: 2,
  fleeDuration: 130,
  returnDuration: 620,
  returnBounce: 0.1,
  axis: 'both',
  wall: 'clamp',
  patience: 4,
  disabled: false,
  className: ''
});

const emit = defineEmits<{ dodge: [count: number]; relent: []; catch: [] }>();

const fieldRef = ref<HTMLDivElement | null>(null);
const moverRef = ref<ComponentPublicInstance | HTMLDivElement | null>(null);
const x = useMotionValue(0);
const y = useMotionValue(0);
const transform = useTransform([x, y], ([tx, ty]: number[]) => `translate(${tx}px, ${ty}px)`);
const reduce = useReducedMotion();
const fine = ref(true);
const inside = ref(false);
const dodges = ref(0);
const caught = ref(false);
const gave = computed(() => dodges.value >= Math.max(1, props.patience));
const still = computed(() => gave.value || caught.value || props.disabled || !!reduce.value);

let pointer: { x: number; y: number } | null = null;
let bearing = { x: 1, y: 0 };
let armed = true;
const room = { x: 0, y: 0 };
let raf = 0;
let hold: ReturnType<typeof setTimeout> | undefined;
let observer: ResizeObserver | null = null;
let cleanupPointer: (() => void) | null = null;

const moverEl = () => {
  const m = moverRef.value as (ComponentPublicInstance & { $el?: HTMLElement }) | HTMLElement | null;
  return (m && '$el' in m ? m.$el : m) as HTMLElement | null;
};

const measure = () => {
  const field = fieldRef.value;
  const mover = moverEl();
  if (!field || !mover) return;
  room.x = Math.max(0, (field.clientWidth - mover.offsetWidth) / 2 - INSET);
  room.y = Math.max(0, (field.clientHeight - mover.offsetHeight) / 2 - INSET);
};

const frame = () => {
  raf = 0;
  const field = fieldRef.value;
  const p = pointer;
  if (!field) return;
  const rect = field.getBoundingClientRect();
  const zoom = rect.width / (field.offsetWidth || rect.width) || 1;
  const dx = p ? (p.x - (rect.left + rect.width / 2)) / zoom : Infinity;
  const dy = p ? (p.y - (rect.top + rect.height / 2)) / zoom : Infinity;
  const d = Math.hypot(dx, dy);
  const isInside = d <= props.radius;
  if (!isInside && !inside.value) return;
  if (!still.value) {
    if (d < props.radius * COUNT_LINE) {
      if (armed) {
        armed = false;
        dodges.value += 1;
      }
    } else if (d > props.radius) {
      armed = true;
    }
  }
  if (Number.isFinite(d) && d > DEAD_ZONE) bearing = bearingOf(dx, dy, d, props.axis);
  const flee = isInside && !still.value ? (1 - d / props.radius) ** props.falloff : 0;
  const tx = wallIt(-bearing.x * flee * props.reach, room.x, props.wall);
  const ty = wallIt(-bearing.y * flee * props.reach, room.y, props.wall);
  if (reduce.value) {
    x.jump(0);
    y.jump(0);
  } else {
    const cfg =
      flee > 0
        ? { type: 'spring' as const, duration: props.fleeDuration / 1000, bounce: 0 }
        : { type: 'spring' as const, duration: props.returnDuration / 1000, bounce: props.returnBounce };
    animate(x, tx, cfg);
    animate(y, ty, cfg);
  }
  if (isInside !== inside.value) inside.value = isInside;
};
const schedule = () => {
  if (!raf) raf = requestAnimationFrame(frame);
};

const bindPointer = () => {
  cleanupPointer?.();
  const query = window.matchMedia('(hover: hover) and (pointer: fine)');
  const sync = () => (fine.value = query.matches);
  sync();
  query.addEventListener('change', sync);
  const onMove = (e: PointerEvent) => {
    if (e.pointerType === 'touch') return;
    pointer = { x: e.clientX, y: e.clientY };
    schedule();
  };
  const onLeave = () => {
    pointer = null;
    schedule();
  };
  const listening = query.matches && !props.disabled;
  if (listening) {
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('scroll', schedule, { passive: true, capture: true });
    document.addEventListener('pointerleave', onLeave);
    window.addEventListener('blur', onLeave);
  }
  cleanupPointer = () => {
    query.removeEventListener('change', sync);
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('scroll', schedule, { capture: true });
    document.removeEventListener('pointerleave', onLeave);
    window.removeEventListener('blur', onLeave);
    cancelAnimationFrame(raf);
    raf = 0;
  };
};

onMounted(() => {
  measure();
  observer = new ResizeObserver(measure);
  if (fieldRef.value) observer.observe(fieldRef.value);
  const mover = moverEl();
  if (mover) observer.observe(mover);
  bindPointer();
  schedule();
});
watch(() => props.disabled, bindPointer, { flush: 'post' });
watch(still, schedule, { flush: 'post' });
watch(dodges, n => {
  if (n) emit('dodge', n);
});
watch(gave, g => {
  if (g) emit('relent');
});
onUnmounted(() => {
  observer?.disconnect();
  cleanupPointer?.();
  clearTimeout(hold);
});

const handleClick = () => {
  caught.value = true;
  emit('catch');
  clearTimeout(hold);
  hold = setTimeout(() => {
    caught.value = false;
    dodges.value = 0;
    armed = false;
  }, CAUGHT_HOLD_MS);
};

const state = computed<DodgeFieldState>(() => ({
  dodges: dodges.value,
  gave: gave.value,
  caught: caught.value,
  fleeing: inside.value && !still.value
}));
const activeTaunt = computed(() =>
  gave.value || caught.value ? props.taunts.length - 1 : Math.min(dodges.value, Math.max(0, props.taunts.length - 2))
);

const fieldStyle = computed(
  () =>
    ({
      '--df-ink': props.inkColor,
      '--df-contrast': props.contrastColor,
      '--df-height': `${props.fieldHeight}px`,
      '--df-ease-out': 'cubic-bezier(0.23, 1, 0.32, 1)'
    }) as CSSProperties
);
</script>

<template>
  <div
    ref="fieldRef"
    class="relative place-items-center grid w-full [height:var(--df-height)]"
    :class="className"
    :data-coarse="fine ? undefined : ''"
    :data-flat="reduce ? '' : undefined"
    :style="fieldStyle"
  >
    <motion.div
      ref="moverRef"
      class="group inline-grid [will-change:transform]"
      :style="{ transform }"
      :data-fled="state.fleeing ? 'true' : 'false'"
      :data-relented="gave ? 'true' : 'false'"
      :data-caught="caught ? 'true' : 'false'"
      @click="handleClick"
    >
      <slot v-bind="state">
        <button
          type="button"
          class="inline-flex justify-center items-center m-0 px-7 border-0 rounded-full h-[52px] font-medium text-[18px] leading-none tracking-[-0.012em] cursor-pointer select-none touch-manipulation [font-family:inherit] [-webkit-tap-highlight-color:transparent] [background:color-mix(in_srgb,var(--df-ink)_8%,transparent)] [color:color-mix(in_srgb,var(--df-ink)_72%,transparent)] [transition:transform_160ms_var(--df-ease-out),background-color_220ms_ease,color_220ms_ease] active:[transform:scale(0.97)] motion-reduce:active:[transform:none] motion-reduce:[transition:background-color_220ms_ease,color_220ms_ease] [@media(hover:hover)_and_(pointer:fine)]:hover:[color:color-mix(in_srgb,var(--df-ink)_90%,transparent)] group-data-[relented=true]:[color:var(--df-ink)] group-data-[relented=true]:hover:[color:var(--df-ink)] group-data-[caught=true]:[background:var(--df-ink)] group-data-[caught=true]:[color:var(--df-contrast)] group-data-[caught=true]:hover:[color:var(--df-contrast)] focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-[3px] focus-visible:[outline-color:color-mix(in_srgb,var(--df-ink)_60%,transparent)]"
          :aria-label="taunts[0]"
        >
          <span class="grid">
            <span
              v-for="(taunt, i) in taunts"
              :key="`${taunt}-${i}`"
              class="data-[active=false]:opacity-0 whitespace-nowrap [grid-area:1/1] [transition:opacity_200ms_ease,filter_200ms_ease] data-[active=false]:[filter:blur(2px)] motion-reduce:data-[active=false]:[filter:none]"
              :data-active="i === activeTaunt ? 'true' : 'false'"
              aria-hidden="true"
            >
              {{ taunt }}
            </span>
          </span>
        </button>
      </slot>
    </motion.div>
    <p
      v-if="!fine && notice"
      class="inset-x-0 bottom-3 absolute m-0 text-[12px] text-center pointer-events-none [color:color-mix(in_srgb,var(--df-ink)_55%,transparent)]"
    >
      {{ notice }}
    </p>
  </div>
</template>
