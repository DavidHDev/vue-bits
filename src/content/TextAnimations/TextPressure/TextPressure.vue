<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch, type CSSProperties } from 'vue';

type IdleMode = 'none' | 'wave' | 'pulse';

interface TextPressureProps {
  text?: string;
  fontFamily?: string;
  fontUrl?: string;
  width?: boolean;
  weight?: boolean;
  italic?: boolean;
  alpha?: boolean;
  flex?: boolean;
  stroke?: boolean;
  scale?: boolean;
  radius?: number;
  smoothing?: number;
  idle?: IdleMode;
  idleSpeed?: number;
  clickRipple?: boolean;
  textColor?: string;
  pressureColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  className?: string;
  minFontSize?: number;
}

interface Point {
  x: number;
  y: number;
}

interface Ripple extends Point {
  start: number;
}

interface AppliedStyle {
  span: HTMLSpanElement;
  settings: string;
  alphaVal: string;
  color: string;
}

const props = withDefaults(defineProps<TextPressureProps>(), {
  text: 'Compressa',
  fontFamily: 'Roboto Flex',
  fontUrl: 'https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wdth,wght@8..144,25..151,100..1000&display=swap',
  width: true,
  weight: true,
  italic: true,
  alpha: false,
  flex: true,
  stroke: false,
  scale: false,
  radius: 0.5,
  smoothing: 0.5,
  idle: 'none',
  idleSpeed: 1,
  clickRipple: true,
  textColor: 'currentColor',
  pressureColor: '',
  strokeColor: '#FF0000',
  strokeWidth: 3,
  className: '',
  minFontSize: 24
});

const RIPPLE_LIFE = 1.3;
const MAX_RIPPLES = 6;
const WAVE_PERIOD = 3.2;
const PULSE_PERIOD = 2.8;
const PULSE_DEPTH = 0.42;

const dist = (a: Point, b: Point) => {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
};

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const getIdlePressure = (mode: IdleMode, position: number, clock: number, spread: number) => {
  if (mode === 'wave') {
    const crest = 0.5 + 0.5 * Math.cos(Math.PI * 2 * (position / spread - clock / WAVE_PERIOD));
    return crest * crest;
  }
  if (mode === 'pulse') {
    const lag = Math.abs(position - 0.5) * 0.4;
    const breath = 0.5 - 0.5 * Math.cos(Math.PI * 2 * (clock / PULSE_PERIOD - lag));
    return PULSE_DEPTH * breath * breath * (3 - 2 * breath);
  }
  return 0;
};

const getRipplePressure = (ripples: Ripple[], point: Point, now: number, span: number) => {
  const band = Math.max(span * 0.14, 32);
  let total = 0;
  for (const ripple of ripples) {
    const age = (now - ripple.start) / 1000;
    if (age <= 0 || age >= RIPPLE_LIFE) continue;
    const offset = (dist(ripple, point) - age * span * 1.25) / band;
    if (offset <= -1 || offset >= 1) continue;
    const fade = 1 - age / RIPPLE_LIFE;
    const swell = (1 - offset * offset) ** 2 * fade * fade * Math.min(1, age / 0.06);
    total = 1 - (1 - total) * (1 - swell);
  }
  return total;
};

const containerRef = ref<HTMLDivElement | null>(null);
const titleRef = ref<HTMLHeadingElement | null>(null);
const spans: (HTMLSpanElement | null)[] = [];
const ripples: Ripple[] = [];
const mouse: Point = { x: 0, y: 0 };
const cursor: Point & { seen: boolean } = { x: 0, y: 0, seen: false };
let wakeFn: (() => void) | null = null;
let visible = true;

const fontSize = ref(props.minFontSize);
const scaleY = ref(1);

const chars = computed(() => Array.from(props.text));

const setSpan = (el: unknown, i: number) => {
  spans[i] = (el as HTMLSpanElement | null) ?? null;
};

const wake = () => wakeFn?.();

watch(
  () => [
    props.width,
    props.weight,
    props.italic,
    props.alpha,
    props.radius,
    props.smoothing,
    props.idle,
    props.idleSpeed,
    props.clickRipple,
    props.textColor,
    props.pressureColor
  ],
  wake
);

watch(() => [fontSize.value, scaleY.value, props.text, props.flex, props.fontFamily], wake, { flush: 'post' });

let cleanupEvents: (() => void) | null = null;
let resizeObserver: ResizeObserver | null = null;
let rafId = 0;

const resize = () => {
  const container = containerRef.value;
  if (!container) return;
  const { width: containerW, height: containerH } = container.getBoundingClientRect();
  const count = chars.value.length;
  const nextFontSize = Math.max(count ? containerW / (count / 2) : props.minFontSize, props.minFontSize);
  fontSize.value = nextFontSize;
  scaleY.value = props.scale && containerH > 0 ? containerH / nextFontSize : 1;
};

watch(() => [chars.value.length, props.minFontSize, props.scale], resize);

onMounted(() => {
  const container = containerRef.value;
  const title = titleRef.value;

  const track = (x: number, y: number) => {
    cursor.x = x;
    cursor.y = y;
    cursor.seen = true;
    wake();
  };
  const handleMouseMove = (e: MouseEvent) => track(e.clientX, e.clientY);
  const handleTouch = (e: TouchEvent) => {
    const t = e.touches[0];
    if (t) track(t.clientX, t.clientY);
  };
  const handleLeave = () => {
    cursor.seen = false;
    wake();
  };
  const handlePress = (e: PointerEvent) => {
    if (!props.clickRipple) return;
    ripples.push({ x: e.clientX, y: e.clientY, start: performance.now() });
    if (ripples.length > MAX_RIPPLES) ripples.shift();
    wake();
  };

  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('touchstart', handleTouch, { passive: true });
  window.addEventListener('touchmove', handleTouch, { passive: true });
  window.addEventListener('touchend', handleLeave);
  window.addEventListener('touchcancel', handleLeave);
  window.addEventListener('scroll', wake, { passive: true, capture: true });
  document.documentElement.addEventListener('mouseleave', handleLeave);
  document.fonts?.addEventListener?.('loadingdone', wake);
  container?.addEventListener('pointerdown', handlePress);

  if (container) {
    const { left, top, width, height } = container.getBoundingClientRect();
    mouse.x = left + width / 2;
    mouse.y = top + height / 2;
    cursor.x = mouse.x;
    cursor.y = mouse.y;
  }

  const intersection = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (entry.isIntersecting) wake();
  });
  if (container) intersection.observe(container);

  cleanupEvents = () => {
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('touchstart', handleTouch);
    window.removeEventListener('touchmove', handleTouch);
    window.removeEventListener('touchend', handleLeave);
    window.removeEventListener('touchcancel', handleLeave);
    window.removeEventListener('scroll', wake, { capture: true });
    document.documentElement.removeEventListener('mouseleave', handleLeave);
    document.fonts?.removeEventListener?.('loadingdone', wake);
    container?.removeEventListener('pointerdown', handlePress);
    intersection.disconnect();
  };

  if (container) {
    resize();
    resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
  }

  if (!title || !container) return;

  const motionQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)');
  const applied: AppliedStyle[] = [];
  let last = 0;
  let idleFrames = 0;
  let clock = 0;
  let engage = props.idle === 'wave' || props.idle === 'pulse' ? 0 : 1;

  const tick = (now: number) => {
    rafId = 0;
    const elapsed = last ? Math.min(now - last, 64) : 1000 / 60;
    last = now;

    const idleMode: IdleMode =
      (props.idle === 'wave' || props.idle === 'pulse') && !motionQuery?.matches ? props.idle : 'none';
    const lag = 1000 * props.smoothing * props.smoothing;
    const follow = lag > 1 ? 1 - Math.exp(-elapsed / lag) : 1;
    mouse.x += (cursor.x - mouse.x) * follow;
    mouse.y += (cursor.y - mouse.y) * follow;

    let present = 1;
    if (idleMode !== 'none') {
      const box = container.getBoundingClientRect();
      const inside = cursor.x >= box.left && cursor.x <= box.right && cursor.y >= box.top && cursor.y <= box.bottom;
      present = cursor.seen && inside ? 1 : 0;
    }
    engage += (present - engage) * (1 - Math.exp(-elapsed / 320));
    if (Math.abs(present - engage) < 0.002) engage = present;
    const idling = idleMode !== 'none' && engage < 1;
    if (idling) clock += (elapsed / 1000) * props.idleSpeed;

    while (ripples.length && now - ripples[0].start > RIPPLE_LIFE * 1000) ripples.shift();

    const titleRect = title.getBoundingClientRect();
    const maxDist = Math.max(titleRect.width * props.radius, 1);
    const spread = Math.max(props.radius * 2, 0.2);
    const centers = spans.map(span => {
      if (!span) return null;
      const rect = span.getBoundingClientRect();
      return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
    });

    let changed = false;
    spans.forEach((span, i) => {
      const center = centers[i];
      if (!span || !center) return;

      let pressure = clamp01(1 - dist(mouse, center) / maxDist);
      if (idling) {
        const position = (center.x - titleRect.left) / Math.max(titleRect.width, 1);
        const resting = getIdlePressure(idleMode, position, clock, spread);
        pressure = resting + (pressure - resting) * engage;
      }
      if (ripples.length) {
        const swell = getRipplePressure(ripples, center, now, titleRect.width);
        pressure = 1 - (1 - pressure) * (1 - swell);
      }

      const wdth = props.width ? Math.floor(5 + 200 * pressure) : 100;
      const wght = props.weight ? Math.floor(100 + 900 * pressure) : 400;
      const italVal = props.italic ? pressure.toFixed(2) : '0';
      const alphaVal = props.alpha ? pressure.toFixed(2) : '';
      const tint = Math.round((1 - (1 - pressure) * (1 - pressure)) * 100);
      const color = props.pressureColor
        ? `color-mix(in oklab, ${props.pressureColor} ${tint}%, ${props.textColor})`
        : '';
      const settings = `'wght' ${wght}, 'wdth' ${wdth}, 'ital' ${italVal}`;
      const previous = applied[i];

      if (
        !previous ||
        previous.span !== span ||
        previous.settings !== settings ||
        previous.alphaVal !== alphaVal ||
        previous.color !== color
      ) {
        span.style.fontVariationSettings = settings;
        span.style.opacity = alphaVal;
        span.style.color = color;
        applied[i] = { span, settings, alphaVal, color };
        changed = true;
      }
    });

    const moving = Math.abs(cursor.x - mouse.x) > 0.1 || Math.abs(cursor.y - mouse.y) > 0.1;
    const animating = moving || idling || engage !== present || ripples.length > 0;
    idleFrames = animating ? 0 : idleFrames + 1;

    if (animating || (changed && idleFrames < 60)) rafId = requestAnimationFrame(tick);
    else last = 0;
  };

  wakeFn = () => {
    if (!rafId && visible) rafId = requestAnimationFrame(tick);
  };

  nextTick(wake);
});

onBeforeUnmount(() => {
  cleanupEvents?.();
  resizeObserver?.disconnect();
  cancelAnimationFrame(rafId);
  rafId = 0;
  wakeFn = null;
});

const styleText = computed(
  () => `
  @import url('${props.fontUrl}');

  .text-pressure-title.is-stroke span {
    position: relative;
  }

  .text-pressure-title.is-stroke span::after {
    content: attr(data-char);
    position: absolute;
    left: 0;
    top: 0;
    color: transparent;
    z-index: -1;
    -webkit-text-stroke-width: var(--text-pressure-stroke-width);
    -webkit-text-stroke-color: var(--text-pressure-stroke-color);
  }
`
);

const titleStyle = computed(
  () =>
    ({
      fontFamily: props.fontFamily,
      textTransform: 'uppercase',
      fontSize: `${fontSize.value}px`,
      lineHeight: 1,
      transform: `scale(1, ${scaleY.value})`,
      transformOrigin: 'center top',
      margin: 0,
      textAlign: 'center',
      userSelect: 'none',
      whiteSpace: 'nowrap',
      fontWeight: 100,
      width: '100%',
      color: props.textColor,
      display: props.flex ? 'flex' : undefined,
      justifyContent: props.flex ? 'space-between' : undefined,
      '--text-pressure-stroke-width': `${props.strokeWidth}px`,
      '--text-pressure-stroke-color': props.strokeColor
    }) as CSSProperties
);
</script>

<template>
  <div ref="containerRef" style="position: relative; width: 100%; height: 100%; background: transparent">
    <component :is="'style'">{{ styleText }}</component>
    <h1
      ref="titleRef"
      :aria-label="text"
      :class="`text-pressure-title ${stroke ? 'is-stroke' : ''} ${className}`"
      :style="titleStyle"
    >
      <span
        v-for="(char, i) in chars"
        :key="i"
        :ref="el => setSpan(el, i)"
        :data-char="char"
        aria-hidden="true"
        style="display: inline-block"
      >
        {{ char }}
      </span>
    </h1>
  </div>
</template>
