<script setup lang="ts">
import { cancelFrame, frame, motion, useMotionValue, useReducedMotion, useSpring, type FrameData } from 'motion-v';
import { computed, nextTick, onBeforeUnmount, onMounted, ref, shallowRef, useSlots, watch } from 'vue';

type HoverMode = 'slowDown' | 'speedUp' | 'pause' | 'goBonkers';

interface CircularTextProps {
  text: string;
  spinDuration?: number;
  onHover?: HoverMode;
  direction?: 'clockwise' | 'counterclockwise';
  size?: number;
  fontSize?: number;
  fontWeight?: number;
  letterSpacing?: number;
  color?: string;
  startAngle?: number;
  fill?: boolean;
  repeat?: number;
  ring?: boolean;
  ringColor?: string;
  tilt?: number;
  hoverTilt?: number;
  draggable?: boolean;
  className?: string;
}

interface SpinState {
  dragging: boolean;
  hovering: boolean;
  fling: number;
  cruise: number;
  angle: number | null;
  travel: number;
  samples: [number, number][];
}

const HOVER_SPEED: Record<HoverMode, number> = { slowDown: 0.5, speedUp: 4, pause: 0, goBonkers: 20 };
const MAX_FLING = 1440;

const clamp = (v: number, a: number, b: number): number => (v < a ? a : v > b ? b : v);

const props = withDefaults(defineProps<CircularTextProps>(), {
  spinDuration: 20,
  onHover: 'speedUp',
  direction: 'clockwise',
  size: 200,
  fontSize: 24,
  fontWeight: 900,
  letterSpacing: 0,
  color: '',
  startAngle: 0,
  fill: true,
  repeat: 1,
  ring: false,
  ringColor: '',
  tilt: 0,
  hoverTilt: 0,
  draggable: false,
  className: ''
});

const slots = useSlots();

const rootRef = ref<HTMLDivElement | null>(null);
const glyphRefs: (HTMLSpanElement | null)[] = [];
const state: SpinState = {
  dragging: false,
  hovering: false,
  fling: 0,
  cruise: 0,
  angle: null,
  travel: 0,
  samples: []
};
const advances = shallowRef<number[] | null>(null);
const settled = ref(false);
const dragging = ref(false);
const reduceMotion = useReducedMotion();
const rotation = useMotionValue(0);
const speed = useSpring(1, { stiffness: 60, damping: 18 });
const scale = useSpring(1, { stiffness: 300, damping: 20 });
const tiltX = useSpring(0, { stiffness: 150, damping: 18 });
const tiltY = useSpring(0, { stiffness: 150, damping: 18 });

const glyphs = computed(() => Array.from(props.text ?? ''));
const copies = computed(() => Math.max(1, Math.round(props.repeat) || 1));
const letters = computed(() => Array.from({ length: copies.value }, () => glyphs.value).flat());

const angles = computed(() => {
  const count = glyphs.value.length;
  if (!count) return [];
  const { fill, startAngle, size, fontSize, letterSpacing } = props;
  if (fill) return letters.value.map((_, i) => startAngle + (360 / letters.value.length) * i);
  const known = advances.value && advances.value.length === count ? advances.value : null;
  const toDegrees = 180 / (Math.PI * Math.max(size / 2 - fontSize * 0.6, 1));
  const arcs = glyphs.value.map((glyph, i) => {
    const width = known ? known[i] : fontSize * (glyph === ' ' ? 0.3 : 0.6);
    return Math.max(0, width + letterSpacing * fontSize) * toDegrees;
  });
  const span = arcs.reduce((sum, arc) => sum + arc, 0);
  const fit = span > 0 ? Math.min(1, 360 / (span * copies.value)) : 1;
  const result: number[] = [];
  for (let copy = 0; copy < copies.value; copy += 1) {
    let cursor = startAngle + (360 / copies.value) * copy - (arcs[0] * fit) / 2;
    for (let i = 0; i < count; i += 1) {
      const arc = arcs[i] * fit;
      result.push(cursor + arc / 2);
      cursor += arc;
    }
  }
  return result;
});

const setGlyphRef = (i: number, el: unknown) => {
  glyphRefs[i] = (el as HTMLSpanElement | null) ?? null;
};

let measureAlive = { value: false };
const runMeasure = () => {
  measureAlive.value = false;
  if (props.fill) return;
  const alive = { value: true };
  measureAlive = alive;
  const measure = () => {
    if (!alive.value) return;
    const widths = glyphs.value.map((_, i) => glyphRefs[i]?.offsetWidth ?? 0);
    const prev = advances.value;
    if (!(prev && prev.length === widths.length && prev.every((width, i) => width === widths[i]))) {
      advances.value = widths;
    }
  };
  measure();
  document.fonts?.ready.then(measure).catch(() => {});
};

let settleId = 0;
let stopSpin: (() => void) | null = null;

const setupSpin = () => {
  stopSpin?.();
  stopSpin = null;
  const root = rootRef.value;
  const turn = props.direction === 'counterclockwise' ? -1 : 1;
  state.cruise = props.spinDuration > 0 && !reduceMotion.value ? (360 / props.spinDuration) * turn : 0;
  if (!root || reduceMotion.value) return;

  const spin = ({ delta }: FrameData) => {
    if (state.dragging) return;
    const dt = Math.min(delta, 100) / 1000;
    state.fling *= Math.exp(-dt / 0.7);
    if (Math.abs(state.fling) < 1) state.fling = 0;
    const velocity = state.cruise * speed.get() + state.fling;
    if (velocity) rotation.set((rotation.get() + velocity * dt) % 360);
  };

  let running = false;
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting === running) return;
    running = entry.isIntersecting;
    if (running) frame.update(spin, true);
    else cancelFrame(spin);
  });
  observer.observe(root);

  stopSpin = () => {
    observer.disconnect();
    cancelFrame(spin);
  };
};

onMounted(() => {
  runMeasure();
  settleId = requestAnimationFrame(() => {
    settled.value = true;
  });
  setupSpin();
});

watch(
  () => [props.fill, glyphs.value, props.fontSize, props.fontWeight, props.className, copies.value],
  () => nextTick(runMeasure),
  { flush: 'post' }
);

watch(
  () => [props.spinDuration, props.direction, reduceMotion.value],
  () => setupSpin()
);

watch(
  () => [props.hoverTilt, reduceMotion.value],
  () => {
    if (props.hoverTilt && !reduceMotion.value) return;
    tiltX.set(0);
    tiltY.set(0);
  }
);

onBeforeUnmount(() => {
  measureAlive.value = false;
  cancelAnimationFrame(settleId);
  stopSpin?.();
  stopSpin = null;
});

const applyScale = () => {
  const bonkers = state.hovering && props.onHover === 'goBonkers' && !reduceMotion.value;
  scale.set((bonkers ? 0.8 : 1) * (state.dragging ? 0.96 : 1));
};

const pointerAngle = (e: PointerEvent): number | null => {
  const root = rootRef.value;
  if (!root) return null;
  const rect = root.getBoundingClientRect();
  const dx = e.clientX - (rect.left + rect.width / 2);
  const dy = e.clientY - (rect.top + rect.height / 2);
  if (Math.hypot(dx, dy) < rect.width * 0.06) return null;
  return (Math.atan2(dy, dx) * 180) / Math.PI;
};

const handleEnter = () => {
  state.hovering = true;
  if (props.onHover && !reduceMotion.value) speed.set(HOVER_SPEED[props.onHover] ?? 1);
  applyScale();
};

const handleLeave = () => {
  state.hovering = false;
  speed.set(1);
  tiltX.set(0);
  tiltY.set(0);
  applyScale();
};

const handleMove = (e: PointerEvent) => {
  const root = rootRef.value;
  if (!root) return;

  if (state.dragging) {
    const angle = pointerAngle(e);
    if (angle !== null) {
      if (state.angle !== null) {
        let delta = angle - state.angle;
        if (delta > 180) delta -= 360;
        if (delta < -180) delta += 360;
        state.travel += delta;
        rotation.set((rotation.get() + delta) % 360);
        state.samples.push([e.timeStamp, state.travel]);
        while (state.samples.length > 2 && e.timeStamp - state.samples[0][0] > 100) state.samples.shift();
      }
      state.angle = angle;
    }
  }

  if (!props.hoverTilt || reduceMotion.value || e.pointerType === 'touch') return;
  const rect = root.getBoundingClientRect();
  const nx = clamp(((e.clientX - rect.left) / rect.width) * 2 - 1, -1, 1);
  const ny = clamp(((e.clientY - rect.top) / rect.height) * 2 - 1, -1, 1);
  tiltX.set(-ny * props.hoverTilt);
  tiltY.set(nx * props.hoverTilt);
};

const handleDown = (e: PointerEvent) => {
  if (!props.draggable || (e.pointerType === 'mouse' && e.button !== 0)) return;
  state.dragging = true;
  state.fling = 0;
  state.angle = pointerAngle(e);
  state.travel = 0;
  state.samples = [[e.timeStamp, 0]];
  (e.currentTarget as HTMLElement | null)?.setPointerCapture?.(e.pointerId);
  dragging.value = true;
  applyScale();
};

const handleUp = (e: PointerEvent) => {
  if (!state.dragging) return;
  state.dragging = false;
  dragging.value = false;
  applyScale();
  const [startTime, startTravel] = state.samples[0];
  const lastTime = state.samples[state.samples.length - 1][0];
  const elapsed = e.timeStamp - startTime;
  const velocity = elapsed > 0 && e.timeStamp - lastTime < 80 ? ((state.travel - startTravel) / elapsed) * 1000 : 0;
  state.fling = reduceMotion.value ? 0 : clamp(velocity, -MAX_FLING, MAX_FLING) - state.cruise * speed.get();
};

const rootStyle = computed(() => ({
  width: `${props.size}px`,
  height: `${props.size}px`,
  fontSize: `${props.fontSize}px`,
  fontWeight: props.fontWeight,
  color: props.color || undefined,
  perspective: `${props.size * 2.5}px`,
  cursor: props.draggable ? (dragging.value ? 'grabbing' : 'grab') : undefined,
  touchAction: props.draggable ? 'none' : undefined,
  userSelect: props.draggable ? ('none' as const) : undefined,
  WebkitUserSelect: props.draggable ? ('none' as const) : undefined
}));

const lineStyle = computed(() => ({
  borderWidth: `${Math.max(1, props.fontSize / 16)}px`,
  borderColor: props.ringColor || undefined,
  opacity: props.ring ? 1 : 0
}));
</script>

<template>
  <div
    ref="rootRef"
    :class="`circular-text ${className}`"
    :data-settled="settled ? '' : undefined"
    :style="rootStyle"
    @pointerenter="handleEnter"
    @pointerleave="handleLeave"
    @pointermove="handleMove"
    @pointerdown="handleDown"
    @pointerup="handleUp"
    @pointercancel="handleUp"
  >
    <motion.div class="circular-text__tilt" :style="{ rotateX: tiltX, rotateY: tiltY, scale }">
      <div class="circular-text__plane" :style="{ transform: tilt ? `rotateX(${tilt}deg)` : undefined }">
        <span class="circular-text__line" :style="lineStyle" />
        <motion.div class="circular-text__ring" role="img" :aria-label="text" :style="{ rotate: rotation }">
          <span
            v-for="(letter, i) in letters"
            :key="i"
            class="circular-text__letter"
            :style="{ transform: `rotate(${angles[i] ?? 0}deg)` }"
          >
            <span v-if="i < glyphs.length" :ref="el => setGlyphRef(i, el)">{{ letter }}</span>
            <span v-else>{{ letter }}</span>
          </span>
        </motion.div>
      </div>
      <div v-if="slots.default" class="circular-text__center">
        <slot />
      </div>
    </motion.div>
  </div>
</template>

<style>
.circular-text {
  position: relative;
  margin: 0 auto;
  border-radius: 50%;
  text-align: center;
  cursor: pointer;
}

.circular-text__tilt,
.circular-text__plane,
.circular-text__ring {
  position: absolute;
  inset: 0;
}

.circular-text__tilt {
  transform-style: preserve-3d;
}

.circular-text__plane {
  transition: transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
}

.circular-text__letter {
  position: absolute;
  inset: 0;
  display: inline-block;
  white-space: pre;
}

.circular-text[data-settled] .circular-text__letter {
  transition: transform 0.5s cubic-bezier(0, 0, 0, 1);
}

.circular-text__line {
  position: absolute;
  inset: 1.3em;
  border: 0 solid currentColor;
  border-radius: 50%;
  pointer-events: none;
  transition: opacity 0.4s ease;
}

.circular-text__center {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
