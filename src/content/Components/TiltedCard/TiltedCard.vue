<script lang="ts">
import { defineComponent, h, type CSSProperties, type PropType } from 'vue';

export type TiltedCardAxis = 'both' | 'horizontal' | 'vertical';

const FLIP_THRESHOLD = 6;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const parseColor = (value: string): number[] | null => {
  const text = String(value || '').trim();
  const hex = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(text);
  if (hex) {
    const full = hex[1].length === 3 ? hex[1].replace(/./g, digit => digit + digit) : hex[1];
    return [0, 2, 4].map(index => parseInt(full.slice(index, index + 2), 16));
  }
  const rgb = /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/i.exec(text);
  if (rgb) return [rgb[1], rgb[2], rgb[3]].map(channel => clamp(Math.round(parseFloat(channel)), 0, 255));
  return null;
};

const toLength = (value: number | string | undefined) => (typeof value === 'number' ? `${value}px` : value);

const smoother = (t: number) => {
  const x = clamp(t, 0, 1);
  return x * x * x * (x * (x * 6 - 15) + 10);
};

const step = (state: Record<string, number>, key: string, target: number, omega: number, zeta: number, dt: number) => {
  const velocity = `v${key}`;
  const steps = Math.max(1, Math.ceil(dt / (1 / 240)));
  const h = dt / steps;
  for (let index = 0; index < steps; index++) {
    state[velocity] += (omega * omega * (target - state[key]) - 2 * zeta * omega * state[velocity]) * h;
    state[key] += state[velocity] * h;
  }
  const settled = Math.abs(target - state[key]) < 0.001 && Math.abs(state[velocity]) < 0.01;
  if (settled) {
    state[key] = target;
    state[velocity] = 0;
  }
  return !settled;
};

export const TiltedCardLayer = defineComponent({
  name: 'TiltedCardLayer',
  props: {
    depth: { type: Number, default: 20 },
    className: { type: String, default: '' },
    style: { type: Object as PropType<CSSProperties>, default: undefined }
  },
  setup(props, { slots }) {
    return () =>
      h(
        'div',
        {
          class: `tilted-card__layer ${props.className}`.trim(),
          style: { '--tc-depth': props.depth, ...props.style }
        },
        slots.default?.()
      );
  }
});

type OrientationRequest = { requestPermission?: () => Promise<string> };
</script>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, onUpdated, ref, useSlots, watch } from 'vue';

interface TiltedCardProps {
  imageSrc?: string;
  altText?: string;
  captionText?: string;
  containerHeight?: number | string;
  containerWidth?: number | string;
  imageHeight?: number | string;
  imageWidth?: number | string;
  scaleOnHover?: number;
  rotateAmplitude?: number;
  showTooltip?: boolean;
  displayOverlayContent?: boolean;
  overlayDepth?: number;
  flipOnClick?: boolean;
  flipped?: boolean;
  onFlip?: (flipped: boolean) => void;
  radius?: number | string;
  perspective?: number | string;
  smoothness?: number;
  glare?: number;
  glareColor?: string;
  shadow?: number;
  parallax?: number;
  axis?: TiltedCardAxis;
  reverse?: boolean;
  trackWindow?: boolean;
  floating?: boolean;
  gyroscope?: boolean;
  intro?: boolean;
  introDelay?: number;
  onClick?: (event: MouseEvent | KeyboardEvent) => void;
  className?: string;
  style?: CSSProperties;
}

const props = withDefaults(defineProps<TiltedCardProps>(), {
  imageSrc: undefined,
  altText: 'Tilted card image',
  captionText: '',
  containerHeight: '300px',
  containerWidth: '100%',
  imageHeight: '300px',
  imageWidth: '300px',
  scaleOnHover: 1.05,
  rotateAmplitude: 12,
  showTooltip: true,
  displayOverlayContent: false,
  overlayDepth: 30,
  flipOnClick: true,
  flipped: undefined,
  onFlip: undefined,
  radius: 15,
  perspective: 800,
  smoothness: 0.6,
  glare: 0.5,
  glareColor: '#ffffff',
  shadow: 0.5,
  parallax: 1,
  axis: 'both',
  reverse: false,
  trackWindow: false,
  floating: false,
  gyroscope: true,
  intro: true,
  introDelay: 0,
  onClick: undefined,
  className: '',
  style: undefined
});

const slots = useSlots();

const figureRef = ref<HTMLElement | null>(null);
const bodyRef = ref<HTMLDivElement | null>(null);
const shadowRef = ref<HTMLDivElement | null>(null);
const captionRef = ref<HTMLElement | null>(null);
const innerFlipped = ref(false);

const hasBack = () => Boolean(slots.back);
const controlled = computed(() => typeof props.flipped === 'boolean');
const isFlipped = () => hasBack() && (controlled.value ? Boolean(props.flipped) : innerFlipped.value);
const flippable = () => hasBack() && props.flipOnClick;
const interactive = () => flippable() || Boolean(props.onClick);

const readSettings = () => ({
  amplitude: clamp(props.rotateAmplitude, 0, 60),
  scale: Math.max(0.5, props.scaleOnHover),
  smoothness: clamp(props.smoothness, 0, 1),
  glare: clamp(props.glare, 0, 1),
  shadow: clamp(props.shadow, 0, 1),
  parallax: Math.max(0, props.parallax),
  axis: props.axis,
  reverse: props.reverse,
  trackWindow: props.trackWindow,
  floating: props.floating,
  gyroscope: props.gyroscope,
  intro: props.intro,
  introDelay: Math.max(0, props.introDelay),
  flippable: flippable(),
  interactive: interactive(),
  flipped: isFlipped(),
  tooltip: props.showTooltip && Boolean(props.captionText)
});

let wakeFn: (() => void) | null = null;
let flipFn: (() => boolean) | null = null;
let cleanup: (() => void) | null = null;

watch(
  () => [readSettings(), innerFlipped.value],
  () => wakeFn?.(),
  { deep: true }
);
onUpdated(() => wakeFn?.());

onMounted(() => {
  const figure = figureRef.value;
  const body = bodyRef.value;
  if (!figure || !body) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
  const state: Record<string, number> = {
    rx: 0,
    vrx: 0,
    ry: 0,
    vry: 0,
    lift: 0,
    vlift: 0,
    ty: 0,
    vty: 0,
    flip: 0,
    vflip: 0,
    press: 0,
    vpress: 0,
    tip: 0,
    vtip: 0,
    shown: 0,
    vshown: 0,
    tx: 0,
    tyy: 0
  };
  const pointer = { nx: 0, ny: 0, x: 0, y: 0, inside: false, mouse: false, seen: false, vx: 0, last: 0 };
  const press = { active: false, x: 0, y: 0, moved: false };
  const tilt = { gamma: 0, beta: 0, baseGamma: 0, baseBeta: 0, calibrated: false, live: false, asked: false };
  let opacity = 1;
  let entered = true;
  let introAt = -1;
  let time = Math.random() * 10;
  let focused = false;
  let raf = 0;
  let last = 0;
  let visible = true;

  if (readSettings().intro && !reduced) {
    entered = false;
    opacity = 0;
    state.rx = 16;
    state.ty = 22;
    body.style.opacity = '0';
  }

  const frame = (now: number) => {
    raf = 0;
    const s = readSettings();
    const dt = clamp((now - last) / 1000 || 0, 0, 0.05);
    last = Math.max(last, now);
    time += dt;
    let busy = false;

    const amplitude = s.amplitude * (reduced ? 0.3 : 1);
    const hovering = pointer.inside && pointer.mouse;
    const touching = press.active && !pointer.mouse;
    const following = hovering || touching || (s.trackWindow && pointer.seen && !coarse);
    let inputX = 0;
    let inputY = 0;
    if (following) {
      inputX = pointer.nx;
      inputY = pointer.ny;
    } else if (tilt.live && s.gyroscope) {
      inputX = clamp((tilt.gamma - tilt.baseGamma) / 22, -1, 1);
      inputY = clamp((tilt.beta - tilt.baseBeta) / 22, -1, 1);
      tilt.baseGamma += (tilt.gamma - tilt.baseGamma) * (1 - Math.exp(-dt / 4));
      tilt.baseBeta += (tilt.beta - tilt.baseBeta) * (1 - Math.exp(-dt / 4));
      busy = true;
    } else if (s.floating && !reduced && visible) {
      inputX = 0.32 * Math.sin(time * 0.62) + 0.12 * Math.sin(time * 1.31 + 0.7);
      inputY = 0.26 * Math.sin(time * 0.83 + 1.9) + 0.1 * Math.sin(time * 1.57);
      busy = true;
    }
    if (s.axis === 'horizontal') inputY = 0;
    if (s.axis === 'vertical') inputX = 0;
    const sign = s.reverse ? -1 : 1;

    const omega = 20 * Math.pow(0.2, s.smoothness);
    const zeta = 1 - 0.3 * s.smoothness;
    const lifted = hovering || touching || focused ? 1 : 0;

    if (!entered && introAt >= 0 && now >= introAt) entered = true;
    const settle = entered || !s.intro || reduced;
    busy = step(state, 'rx', settle ? -inputY * amplitude * sign : state.rx, omega, zeta, dt) || busy;
    busy = step(state, 'ry', settle ? inputX * amplitude * sign : state.ry, omega, zeta, dt) || busy;
    busy =
      step(
        state,
        'ty',
        settle ? (s.floating && !following && !reduced ? -4 * Math.sin(time * 0.9) : 0) : state.ty,
        omega * 0.8,
        0.9,
        dt
      ) || busy;
    busy = step(state, 'lift', lifted, omega, Math.max(zeta, 0.85), dt) || busy;
    busy = step(state, 'flip', s.flipped ? 180 : 0, reduced ? 18 : 9.5, 0.72, dt) || busy;
    busy = step(state, 'press', press.active && !press.moved && s.interactive ? 1 : 0, 26, 0.8, dt) || busy;
    if (settle && opacity < 1) {
      opacity = Math.min(1, opacity + dt / 0.45);
      busy = true;
    }

    const active = lifted > 0 || state.lift > 0.01;
    if (active !== figure.hasAttribute('data-active')) figure.toggleAttribute('data-active', active);
    const scale = 1 + (s.scale - 1) * state.lift - 0.02 * state.press;
    const rx = state.rx;
    const ry = state.ry;
    const radiansX = (rx * Math.PI) / 180;
    const radiansY = (ry * Math.PI) / 180;
    body.style.transform = `translate3d(0, ${state.ty.toFixed(2)}px, 0) rotateX(${rx.toFixed(3)}deg) rotateY(${(ry + state.flip).toFixed(3)}deg) scale(${scale.toFixed(4)})`;
    body.style.opacity = opacity < 1 ? smoother(opacity).toFixed(3) : '';
    body.style.setProperty('--tc-px', (Math.sin(radiansY) * s.parallax).toFixed(4));
    body.style.setProperty('--tc-py', (-Math.sin(radiansX) * s.parallax).toFixed(4));
    const reach = Math.max(amplitude, 1);
    body.style.setProperty('--tc-gx', `${(50 + (ry / reach) * 46).toFixed(2)}%`);
    body.style.setProperty('--tc-gy', `${(50 - (rx / reach) * 46).toFixed(2)}%`);
    const energy = Math.min(1, Math.hypot(rx, ry) / reach);
    body.style.setProperty(
      '--tc-glare',
      (s.glare * Math.max(state.lift, energy) * (opacity < 1 ? smoother(opacity) : 1)).toFixed(3)
    );

    const shade = shadowRef.value;
    if (shade) {
      const strength = s.shadow * (opacity < 1 ? smoother(opacity) : 1);
      const offsetX = -Math.sin(radiansY) * 22;
      const offsetY = 12 + 16 * state.lift + Math.sin(radiansX) * 18 - state.ty * 0.6;
      const turn = Math.abs(Math.cos((state.flip * Math.PI) / 180));
      const spread = scale * (0.86 + 0.04 * state.lift);
      shade.style.transform = `translate3d(${offsetX.toFixed(2)}px, ${offsetY.toFixed(2)}px, 0) scale(${(spread * (0.2 + 0.8 * turn)).toFixed(4)}, ${spread.toFixed(4)})`;
      shade.style.opacity = (strength * (0.6 + 0.4 * state.lift)).toFixed(3);
    }

    const caption = captionRef.value;
    if (caption) {
      const show = s.tooltip && hovering ? 1 : 0;
      busy = step(state, 'shown', show, 16, 1, dt) || busy;
      const follow = 1 - Math.exp(-dt / 0.035);
      state.tx += (pointer.x - state.tx) * follow;
      state.tyy += (pointer.y - state.tyy) * follow;
      if (Math.abs(pointer.x - state.tx) + Math.abs(pointer.y - state.tyy) > 0.2) busy = true;
      pointer.vx *= Math.exp(-dt / 0.08);
      busy = step(state, 'tip', reduced ? 0 : clamp(-pointer.vx * 0.012, -14, 14), 18, 0.62, dt) || busy;
      caption.style.transform = `translate3d(${state.tx.toFixed(1)}px, ${state.tyy.toFixed(1)}px, 0) rotate(${state.tip.toFixed(2)}deg)`;
      caption.style.opacity = Math.max(0, state.shown).toFixed(3);
    }

    if ((busy || (!settle && s.intro)) && visible) raf = requestAnimationFrame(frame);
  };

  const wake = () => {
    if (raf || !visible) return;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  };
  wakeFn = wake;

  const locate = (event: PointerEvent, area: HTMLElement) => {
    const rect = area.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      width: Math.max(1, rect.width),
      height: Math.max(1, rect.height)
    };
  };

  const track = (event: PointerEvent) => {
    const spot = locate(event, figure);
    const now = performance.now();
    const elapsed = Math.max(8, now - (pointer.last || now - 16)) / 1000;
    const dx = spot.x - pointer.x;
    pointer.vx += (dx / elapsed - pointer.vx) * 0.5;
    pointer.last = now;
    pointer.x = spot.x;
    pointer.y = spot.y;
    pointer.nx = clamp((spot.x - spot.width / 2) / (spot.width / 2), -1, 1);
    pointer.ny = clamp((spot.y - spot.height / 2) / (spot.height / 2), -1, 1);
  };

  const onEnter = (event: PointerEvent) => {
    pointer.inside = true;
    pointer.mouse = event.pointerType === 'mouse' || event.pointerType === 'pen';
    const spot = locate(event, figure);
    pointer.x = spot.x;
    pointer.y = spot.y;
    state.tx = spot.x;
    state.tyy = spot.y;
    pointer.vx = 0;
    track(event);
    wake();
  };
  const onMove = (event: PointerEvent) => {
    pointer.mouse = event.pointerType === 'mouse' || event.pointerType === 'pen';
    if (!pointer.inside && pointer.mouse) {
      pointer.inside = true;
      const spot = locate(event, figure);
      pointer.x = spot.x;
      pointer.y = spot.y;
      state.tx = spot.x;
      state.tyy = spot.y;
      pointer.vx = 0;
    }
    track(event);
    if (press.active && Math.hypot(event.clientX - press.x, event.clientY - press.y) > FLIP_THRESHOLD)
      press.moved = true;
    wake();
  };
  const onLeave = () => {
    pointer.inside = false;
    pointer.vx = 0;
    wake();
  };
  const onWindowMove = (event: PointerEvent) => {
    if (pointer.inside && pointer.mouse && !figure.contains(event.target as Node)) onLeave();
    if (!readSettings().trackWindow || pointer.inside) return;
    const rect = figure.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    pointer.seen = true;
    pointer.nx = clamp((event.clientX - cx) / Math.max(1, window.innerWidth / 2), -1, 1);
    pointer.ny = clamp((event.clientY - cy) / Math.max(1, window.innerHeight / 2), -1, 1);
    wake();
  };
  const onWindowLeave = () => {
    pointer.seen = false;
    wake();
  };

  const askMotion = () => {
    const s = readSettings();
    if (!s.gyroscope || !coarse || tilt.asked) return;
    tilt.asked = true;
    const request = (window.DeviceOrientationEvent as unknown as OrientationRequest | undefined)?.requestPermission;
    if (typeof request === 'function') request.call(window.DeviceOrientationEvent).catch(() => {});
  };

  const onDown = (event: PointerEvent) => {
    press.active = true;
    press.moved = false;
    press.x = event.clientX;
    press.y = event.clientY;
    pointer.mouse = event.pointerType === 'mouse' || event.pointerType === 'pen';
    if (!pointer.mouse) {
      pointer.inside = true;
      track(event);
    }
    askMotion();
    wake();
  };
  const onUp = (event: PointerEvent) => {
    if (!press.active) return;
    press.active = false;
    if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') pointer.inside = false;
    wake();
  };
  const onCancel = () => {
    press.active = false;
    press.moved = true;
    pointer.inside = false;
    wake();
  };

  const onOrientation = (event: DeviceOrientationEvent) => {
    if (event.gamma == null || event.beta == null) return;
    tilt.gamma = event.gamma;
    tilt.beta = event.beta;
    if (!tilt.calibrated) {
      tilt.baseGamma = event.gamma;
      tilt.baseBeta = event.beta;
      tilt.calibrated = true;
    }
    tilt.live = coarse;
    wake();
  };

  flipFn = () => {
    if (press.moved) return false;
    return true;
  };

  const onFocus = () => {
    focused = figure.matches(':focus-visible');
    wake();
  };
  const onBlur = () => {
    focused = false;
    wake();
  };

  figure.addEventListener('pointerenter', onEnter);
  figure.addEventListener('pointermove', onMove);
  figure.addEventListener('pointerleave', onLeave);
  figure.addEventListener('pointerdown', onDown);
  figure.addEventListener('focus', onFocus);
  figure.addEventListener('blur', onBlur);
  window.addEventListener('pointerup', onUp, { passive: true });
  window.addEventListener('pointercancel', onCancel, { passive: true });
  window.addEventListener('pointermove', onWindowMove, { passive: true });
  document.documentElement.addEventListener('pointerleave', onWindowLeave);
  window.addEventListener('deviceorientation', onOrientation);

  const observer = new IntersectionObserver(entries => {
    visible = entries.some(entry => entry.isIntersecting);
    if (visible && !entered && introAt < 0) introAt = performance.now() + readSettings().introDelay;
    wake();
  });
  observer.observe(figure);

  wake();

  cleanup = () => {
    cancelAnimationFrame(raf);
    wakeFn = null;
    flipFn = null;
    observer.disconnect();
    figure.removeEventListener('pointerenter', onEnter);
    figure.removeEventListener('pointermove', onMove);
    figure.removeEventListener('pointerleave', onLeave);
    figure.removeEventListener('pointerdown', onDown);
    figure.removeEventListener('focus', onFocus);
    figure.removeEventListener('blur', onBlur);
    window.removeEventListener('pointerup', onUp);
    window.removeEventListener('pointercancel', onCancel);
    window.removeEventListener('pointermove', onWindowMove);
    document.documentElement.removeEventListener('pointerleave', onWindowLeave);
    window.removeEventListener('deviceorientation', onOrientation);
  };
});

onBeforeUnmount(() => {
  cleanup?.();
  cleanup = null;
});

const toggle = () => {
  const next = !isFlipped();
  if (!controlled.value) innerFlipped.value = next;
  props.onFlip?.(next);
};

const activate = (event: MouseEvent) => {
  if (!interactive()) return;
  if (flipFn && !flipFn()) return;
  if (flippable()) toggle();
  props.onClick?.(event);
};

const onKeyDown = (event: KeyboardEvent) => {
  if (!interactive() || event.target !== event.currentTarget || (event.key !== 'Enter' && event.key !== ' ')) return;
  event.preventDefault();
  if (event.repeat) return;
  if (flippable()) toggle();
  props.onClick?.(event);
};

const corner = computed(() => toLength(props.radius));
const glareRgb = computed(() => (parseColor(props.glareColor) || [255, 255, 255]).join(', '));
const bleed = computed(
  () =>
    Math.ceil(Math.sin((clamp(props.rotateAmplitude, 0, 60) * Math.PI) / 180) * 24 * Math.max(0, props.parallax)) + 1
);
</script>

<template>
  <figure
    ref="figureRef"
    :class="`tilted-card ${className}`.trim()"
    :style="{
      width: toLength(containerWidth),
      height: toLength(containerHeight),
      perspective: toLength(perspective),
      ...style
    }"
    :data-interactive="interactive() ? '' : undefined"
    :data-flipped="isFlipped() ? '' : undefined"
    :tabindex="interactive() ? 0 : undefined"
    :role="interactive() ? 'button' : undefined"
    :aria-pressed="flippable() ? isFlipped() : undefined"
    :aria-label="interactive() ? captionText || altText : undefined"
    @click="activate"
    @keydown="onKeyDown"
  >
    <div
      ref="shadowRef"
      class="tilted-card__shadow"
      aria-hidden="true"
      :style="{ width: toLength(imageWidth), height: toLength(imageHeight), borderRadius: corner }"
    />
    <div
      ref="bodyRef"
      class="tilted-card__body"
      :style="{
        width: toLength(imageWidth),
        height: toLength(imageHeight),
        '--tc-radius': corner,
        '--tc-glare-rgb': glareRgb
      }"
    >
      <div class="tilted-card__face tilted-card__front">
        <img
          v-if="imageSrc"
          class="tilted-card__img"
          :src="imageSrc"
          :alt="altText"
          draggable="false"
          :style="{
            '--tc-depth': -24,
            top: `-${bleed}px`,
            left: `-${bleed}px`,
            width: `calc(100% + ${bleed * 2}px)`,
            height: `calc(100% + ${bleed * 2}px)`
          }"
        />
        <slot />
        <span class="tilted-card__glare" aria-hidden="true" />
        <span class="tilted-card__rim" aria-hidden="true" />
        <span class="tilted-card__edge" aria-hidden="true" />
      </div>
      <div v-if="$slots.back" class="tilted-card__face tilted-card__back" :aria-hidden="!isFlipped()">
        <slot name="back" />
        <span class="tilted-card__glare" aria-hidden="true" />
        <span class="tilted-card__rim" aria-hidden="true" />
        <span class="tilted-card__edge" aria-hidden="true" />
      </div>
      <div
        v-if="displayOverlayContent && $slots.overlay"
        class="tilted-card__overlay"
        :style="{ '--tc-lift': `${overlayDepth}px` }"
      >
        <slot name="overlay" />
      </div>
    </div>
    <figcaption v-if="showTooltip && captionText" ref="captionRef" class="tilted-card__caption">
      {{ captionText }}
    </figcaption>
  </figure>
</template>

<style>
.tilted-card {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  outline: none;
  touch-action: pan-y pinch-zoom;
  user-select: none;
  -webkit-user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.tilted-card[data-interactive] {
  cursor: pointer;
}

.tilted-card[data-active] {
  z-index: 2;
}

.tilted-card__shadow {
  position: absolute;
  inset: 0;
  margin: auto;
  max-width: 100%;
  max-height: 100%;
  background: var(--tc-shadow-color, rgba(0, 0, 0, 0.55));
  filter: blur(20px);
  opacity: 0;
  pointer-events: none;
  will-change: transform, opacity;
}

.tilted-card__body {
  position: relative;
  max-width: 100%;
  max-height: 100%;
  transform-style: preserve-3d;
}

.tilted-card__face {
  position: absolute;
  inset: 0;
  overflow: hidden;
  border-radius: var(--tc-radius);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  isolation: isolate;
}

.tilted-card__back {
  transform: rotateY(180deg);
}

.tilted-card__img {
  position: absolute;
  display: block;
  max-width: none;
  object-fit: cover;
  pointer-events: none;
}

.tilted-card__layer {
  position: absolute;
  inset: 0;
}

.tilted-card__img,
.tilted-card__layer {
  transform: translate3d(
    calc(var(--tc-px, 0) * var(--tc-depth, 0) * 1px),
    calc(var(--tc-py, 0) * var(--tc-depth, 0) * 1px),
    0
  );
}

.tilted-card__glare {
  position: absolute;
  inset: 0;
  z-index: 5;
  background: radial-gradient(
    farthest-corner circle at var(--tc-gx, 50%) var(--tc-gy, 50%),
    rgba(var(--tc-glare-rgb, 255, 255, 255), calc(var(--tc-glare, 0) * 0.34)) 0%,
    rgba(var(--tc-glare-rgb, 255, 255, 255), calc(var(--tc-glare, 0) * 0.331)) 9%,
    rgba(var(--tc-glare-rgb, 255, 255, 255), calc(var(--tc-glare, 0) * 0.285)) 18%,
    rgba(var(--tc-glare-rgb, 255, 255, 255), calc(var(--tc-glare, 0) * 0.202)) 27%,
    rgba(var(--tc-glare-rgb, 255, 255, 255), calc(var(--tc-glare, 0) * 0.108)) 36%,
    rgba(var(--tc-glare-rgb, 255, 255, 255), calc(var(--tc-glare, 0) * 0.035)) 45%,
    rgba(var(--tc-glare-rgb, 255, 255, 255), calc(var(--tc-glare, 0) * 0.003)) 54%,
    rgba(var(--tc-glare-rgb, 255, 255, 255), 0) 60%
  );
  mix-blend-mode: screen;
  pointer-events: none;
}

.tilted-card__rim {
  position: absolute;
  inset: 0;
  z-index: 6;
  border-radius: inherit;
  box-shadow:
    inset 0 0 0 1px var(--tc-rim-color, rgba(255, 255, 255, 0.08)),
    inset 0 1px 0 var(--tc-rim-light, rgba(255, 255, 255, 0.12));
  pointer-events: none;
}

.tilted-card__edge {
  position: absolute;
  inset: 0;
  z-index: 7;
  box-sizing: border-box;
  padding: 1px;
  border-radius: inherit;
  background: radial-gradient(
    farthest-side circle at var(--tc-gx, 50%) var(--tc-gy, 50%),
    rgba(var(--tc-glare-rgb, 255, 255, 255), calc(var(--tc-glare, 0) * 0.85)) 0%,
    rgba(var(--tc-glare-rgb, 255, 255, 255), calc(var(--tc-glare, 0) * 0.71)) 18%,
    rgba(var(--tc-glare-rgb, 255, 255, 255), calc(var(--tc-glare, 0) * 0.43)) 36%,
    rgba(var(--tc-glare-rgb, 255, 255, 255), calc(var(--tc-glare, 0) * 0.16)) 54%,
    rgba(var(--tc-glare-rgb, 255, 255, 255), calc(var(--tc-glare, 0) * 0.02)) 72%,
    rgba(var(--tc-glare-rgb, 255, 255, 255), 0) 85%
  );
  -webkit-mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask:
    linear-gradient(#000 0 0) content-box exclude,
    linear-gradient(#000 0 0);
  pointer-events: none;
}

.tilted-card:focus-visible .tilted-card__rim {
  box-shadow:
    inset 0 0 0 2px rgba(255, 255, 255, 0.7),
    inset 0 0 0 3px rgba(0, 0, 0, 0.35);
}

.tilted-card__overlay {
  position: absolute;
  inset: 0;
  z-index: 2;
  transform: translateZ(var(--tc-lift, 30px));
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.tilted-card__caption {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 3;
  margin: 16px 0 0 14px;
  padding: 5px 9px;
  border-radius: 7px;
  background: #ffffff;
  box-shadow:
    0 0 0 1px rgba(22, 24, 22, 0.08),
    0 8px 18px -8px rgba(0, 0, 0, 0.45);
  color: #161816;
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transform-origin: 0 0;
  will-change: transform, opacity;
}
</style>
