<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch, type CSSProperties } from 'vue';

interface SloshGaugeProps {
  value?: number;
  defaultValue?: number;
  interactive?: boolean;
  showValue?: boolean;
  disabled?: boolean;
  liquidColor?: string;
  glassColor?: string;
  width?: number;
  height?: number;
  radius?: number;
  ticks?: number;
  viscosity?: number;
  tilt?: number;
  splash?: number;
  unit?: string;
  ariaLabel?: string;
  className?: string;
}

interface Sim {
  x: number;
  v: number;
  L: number;
  raf: number;
  last: number;
}

interface Grip {
  id: number;
  rect: DOMRect;
  scale: number;
  band: boolean;
  grab: number | null;
  at: number;
  sent: number;
}

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const H = 1 / 120;
const DT_MAX = 0.05;
const TILT_GAIN = 0.07;
const TILT_MAX = 30;
const REST_POS = 0.05;
const REST_VEL = 2;
const STEP = 2;
const BIG = 10;
const BAND = 10;

const onColor = (hex: string) => {
  const raw = hex.replace('#', '');
  const full = raw.length === 3 ? [...raw].map(c => c + c).join('') : raw;
  const n = parseInt(full, 16);
  if (Number.isNaN(n)) return '#ffffff';
  return (((n >> 16) & 255) * 299 + ((n >> 8) & 255) * 587 + (n & 255) * 114) / 1000 >= 150 ? '#111111' : '#ffffff';
};

const props = withDefaults(defineProps<SloshGaugeProps>(), {
  value: undefined,
  defaultValue: 60,
  interactive: false,
  showValue: true,
  disabled: false,
  liquidColor: '#f5f5f5',
  glassColor: '#27272a',
  width: 88,
  height: 180,
  radius: 20,
  ticks: 4,
  viscosity: 0.15,
  tilt: 0.45,
  splash: 0.42,
  unit: '%',
  ariaLabel: 'Level',
  className: ''
});

const emit = defineEmits<{ change: [value: number] }>();

const root = ref<HTMLDivElement | null>(null);
const liquid = ref<HTMLDivElement | null>(null);
const marker = ref<HTMLDivElement | null>(null);
const textA = ref<HTMLSpanElement | null>(null);
const textB = ref<HTMLSpanElement | null>(null);
const start = clamp(props.value ?? props.defaultValue, 0, 100);
const sim: Sim = { x: start, v: 0, L: start, raf: 0, last: 0 };
let grip: Grip | null = null;
let reduce = false;
let mq: MediaQueryList | null = null;
const held = ref(false);

const syncReduce = () => {
  reduce = !!mq?.matches;
};

// the surface and readout are written by hand every frame so the slosh never waits on a Vue render
const paint = () => {
  const { x, v, L } = sim;
  const th = reduce ? 0 : clamp(props.tilt * v * TILT_GAIN, -TILT_MAX, TILT_MAX);
  const lean = (Math.tan((th * Math.PI) / 180) * props.width) / 2;
  const top = 100 - x;
  if (liquid.value) {
    liquid.value.style.clipPath = `polygon(0 calc(${top}% + ${lean}px), 100% calc(${top}% - ${lean}px), 100% 100%, 0 100%)`;
  }
  if (marker.value) marker.value.style.transform = `translateY(${((100 - L) * props.height) / 100}px)`;
};

const say = () => {
  const n = Math.round(sim.L);
  const s = `${n}${props.unit}`;
  root.value?.setAttribute('aria-valuenow', String(n));
  if (textA.value) textA.value.textContent = s;
  if (textB.value) textB.value.textContent = s;
};

const tick = (now: number) => {
  const s = sim;
  const vis = props.viscosity;
  const give = props.splash;
  const dt = s.last ? Math.min((now - s.last) / 1000, DT_MAX) : H;
  s.last = now;
  if (vis <= 0) {
    s.x = s.L;
    s.v = 0;
  } else {
    const k = 1224 - 1044 * vis;
    const zeta = reduce ? 1 : 0.26 - 0.17 * vis;
    const c = 2 * zeta * Math.sqrt(k);
    const rest = reduce ? 0 : give;
    for (let n = Math.ceil(dt / H), h = dt / n; n > 0; n -= 1) {
      s.v = s.v * Math.exp(-c * h) + k * (s.L - s.x) * h;
      s.x += s.v * h;
      if (s.x > 100) {
        s.x = 100;
        s.v = -s.v * rest;
      } else if (s.x < 0) {
        s.x = 0;
        s.v = -s.v * rest;
      }
    }
    if (!grip && Math.abs(s.L - s.x) < REST_POS && Math.abs(s.v) < REST_VEL) {
      s.x = s.L;
      s.v = 0;
    }
  }
  paint();
  const parked = !grip && s.x === s.L && s.v === 0;
  if (parked) {
    s.raf = 0;
    s.last = 0;
  } else {
    s.raf = requestAnimationFrame(tick);
  }
};
const wake = () => {
  if (!sim.raf) sim.raf = requestAnimationFrame(tick);
};
const setLevel = (L: number, instant?: boolean) => {
  sim.L = clamp(L, 0, 100);
  if (instant) {
    sim.x = sim.L;
    sim.v = 0;
  }
  say();
  wake();
};

watch(
  () => props.value,
  v => {
    if (v === undefined) return;
    if (grip && Math.round(sim.L) === v) return;
    setLevel(v, false);
  },
  { flush: 'post' }
);

onMounted(() => {
  mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  syncReduce();
  mq.addEventListener('change', syncReduce);
  say();
  paint();
});
onUnmounted(() => {
  mq?.removeEventListener('change', syncReduce);
  cancelAnimationFrame(sim.raf);
});

watch(
  () => [props.width, props.height, props.tilt, props.showValue, props.interactive, props.disabled, props.unit],
  () => {
    say();
    paint();
  },
  { flush: 'post' }
);

const levelAt = (clientY: number, g: Grip) =>
  clamp(((g.rect.bottom - clientY) / g.scale / (root.value?.offsetHeight || g.rect.height)) * 100, 0, 100);
const report = () => {
  const g = grip;
  const n = Math.round(sim.L);
  if (g && n !== g.sent) {
    g.sent = n;
    emit('change', n);
  }
};

const down = (e: PointerEvent) => {
  if (!props.interactive || props.disabled || grip || e.button !== 0) return;
  const el = root.value;
  if (!el) return;
  const rect = el.getBoundingClientRect();
  const scale = rect.height / (el.offsetHeight || rect.height) || 1;
  const markerY = rect.top + ((100 - sim.L) / 100) * rect.height;
  const g: Grip = {
    id: e.pointerId,
    rect,
    scale,
    band: Math.abs(e.clientY - markerY) <= BAND * scale,
    grab: null,
    at: sim.L,
    sent: NaN
  };
  grip = g;
  try {
    el.setPointerCapture(e.pointerId);
  } catch {
    // capture unavailable
  }
  held.value = true;
  if (g.band) {
    wake();
  } else {
    setLevel(levelAt(e.clientY, g));
    report();
  }
};
const move = (e: PointerEvent) => {
  const g = grip;
  if (!g || g.id !== e.pointerId) return;
  const at = levelAt(e.clientY, g);
  if (g.band && g.grab === null) {
    g.grab = sim.L - at;
    return;
  }
  setLevel(at + (g.grab ?? 0));
  report();
};
const up = (e: { pointerId: number }, reason?: 'cancel' | 'escape') => {
  const g = grip;
  if (!g || g.id !== e.pointerId) return;
  grip = null;
  try {
    root.value?.releasePointerCapture(e.pointerId);
  } catch {
    // already released
  }
  held.value = false;
  if (reason === 'escape') {
    setLevel(g.at);
    emit('change', Math.round(g.at));
  } else if (props.value !== undefined && Math.round(sim.L) !== props.value) {
    setLevel(props.value);
  }
  wake();
};
const key = (e: KeyboardEvent) => {
  if (!props.interactive || props.disabled) return;
  if (e.key === 'Escape') {
    if (grip) up({ pointerId: grip.id }, 'escape');
    return;
  }
  const L = sim.L;
  const d = e.shiftKey ? BIG : STEP;
  const next: number | undefined = (
    {
      ArrowUp: L + d,
      ArrowRight: L + d,
      ArrowDown: L - d,
      ArrowLeft: L - d,
      PageUp: L + BIG,
      PageDown: L - BIG,
      Home: 0,
      End: 100
    } as Record<string, number>
  )[e.key];
  if (next === undefined) return;
  e.preventDefault();
  setLevel(next, true);
  emit('change', Math.round(sim.L));
};

const rootStyle = computed(
  () =>
    ({
      '--sg-w': `${props.width}px`,
      '--sg-h': `${props.height}px`,
      '--sg-r': `${Math.min(props.radius, props.width / 2, props.height / 2)}px`,
      '--sg-glass': props.glassColor,
      '--sg-liquid': props.liquidColor,
      '--sg-on-liquid': onColor(props.liquidColor),
      '--sg-ticks': props.ticks,
      '--sg-font': `${clamp(Math.round(props.width * 0.16), 12, 20)}px`
    }) as CSSProperties
);
</script>

<template>
  <div
    ref="root"
    class="group inline-block isolate box-border relative data-[disabled=true]:opacity-50 outline-none overflow-clip font-semibold tabular-nums leading-none data-[interactive=true]:[-webkit-touch-callout:none] data-[interactive=true]:touch-none data-[interactive=true]:cursor-ns-resize data-[disabled=true]:cursor-not-allowed select-none [width:var(--sg-w)] [height:var(--sg-h)] [border-radius:var(--sg-r)] [background:var(--sg-glass)] [font-size:var(--sg-font)] [-webkit-tap-highlight-color:transparent]"
    :class="className"
    :role="interactive ? 'slider' : 'meter'"
    :tabindex="interactive && !disabled ? 0 : undefined"
    :aria-label="ariaLabel"
    :aria-valuemin="0"
    :aria-valuemax="100"
    :aria-orientation="interactive ? 'vertical' : undefined"
    :aria-disabled="disabled || undefined"
    :data-interactive="interactive ? 'true' : 'false'"
    :data-held="held ? 'true' : 'false'"
    :data-disabled="disabled ? 'true' : 'false'"
    :style="rootStyle"
    @pointerdown="down"
    @pointermove="move"
    @pointerup="up($event)"
    @pointercancel="up($event, 'cancel')"
    @lostpointercapture="up($event, 'cancel')"
    @keydown="key"
  >
    <span
      v-if="showValue"
      ref="textA"
      class="absolute inset-0 place-items-center grid pointer-events-none [color:color-mix(in_srgb,currentColor_65%,transparent)]"
      aria-hidden="true"
    />
    <div
      ref="liquid"
      class="absolute inset-0 [background:var(--sg-liquid)] [clip-path:polygon(0_100%,100%_100%,100%_100%,0_100%)]"
      aria-hidden="true"
    >
      <span
        v-if="showValue"
        ref="textB"
        class="absolute inset-0 place-items-center grid pointer-events-none [color:var(--sg-on-liquid)]"
      />
    </div>
    <div
      v-if="ticks > 0"
      class="right-0 bottom-0 absolute bg-repeat-y bg-bottom w-[22%] h-full pointer-events-none [background-image:linear-gradient(to_top,color-mix(in_srgb,currentColor_22%,transparent)_0_1px,transparent_1px)] [background-size:100%_calc(100%/var(--sg-ticks))]"
      aria-hidden="true"
    />
    <div
      v-if="interactive && !disabled"
      ref="marker"
      class="top-0 absolute inset-x-[10%] bg-current opacity-0 group-data-[held=true]:opacity-100 -mt-px rounded-[1px] h-0.5 pointer-events-none [transition:opacity_150ms_ease]"
      aria-hidden="true"
    />
  </div>
</template>
