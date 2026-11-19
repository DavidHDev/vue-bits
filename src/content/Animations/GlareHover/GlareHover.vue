<template>
  <div ref="rootRef" :class="rootClass" :style="[rootVars, style]">
    <slot />
    <span ref="glareRef" class="glare-hover__glare" aria-hidden="true">
      <span ref="bandRef" class="glare-hover__band" />
      <span v-if="rimGlint" class="glare-hover__rim">
        <span ref="rimRef" class="glare-hover__band glare-hover__band--rim" />
      </span>
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, useTemplateRef, watch, type StyleValue } from 'vue';

type Variant = 'streak' | 'twin' | 'sheen';
type Mode = 'hover' | 'follow' | 'loop' | 'click';

interface GlareHoverProps {
  width?: string;
  height?: string;
  background?: string;
  borderRadius?: string;
  borderColor?: string;
  glareColor?: string;
  glareOpacity?: number;
  glareAngle?: number;
  glareSize?: number;
  softness?: number;
  variant?: Variant;
  blendMode?: string;
  rimGlint?: boolean;
  mode?: Mode;
  transitionDuration?: number;
  interval?: number;
  playOnce?: boolean;
  intro?: boolean;
  className?: string;
  style?: StyleValue;
}

interface Sweep {
  from: number;
  to: number;
  start: number;
  duration: number;
}

const props = withDefaults(defineProps<GlareHoverProps>(), {
  width: 'auto',
  height: 'auto',
  background: 'transparent',
  borderRadius: '10px',
  borderColor: 'transparent',
  glareColor: '#ffffff',
  glareOpacity: 0.5,
  glareAngle: -45,
  glareSize: 30,
  softness: 0.6,
  variant: 'streak',
  blendMode: 'screen',
  rimGlint: true,
  mode: 'hover',
  transitionDuration: 650,
  interval: 3,
  playOnce: false,
  intro: false,
  className: '',
  style: () => ({})
});

const smootherstep = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);

const bump = (t: number, center: number, half: number) => {
  const distance = Math.abs(t - center);
  return distance >= half ? 0 : smootherstep(1 - distance / half);
};

const PROFILES: Record<Variant, (t: number, softness: number) => number> = {
  streak: (t: number, softness: number) => bump(t, 0.5, 0.06 + 0.16 * softness) + 0.32 * bump(t, 0.5, 0.5),
  twin: (t: number, softness: number) =>
    bump(t, 0.36, 0.08 + 0.18 * softness) + 0.85 * bump(t, 0.7, 0.03 + 0.06 * softness) + 0.26 * bump(t, 0.5, 0.5),
  sheen: (t: number, softness: number) => 0.55 * bump(t, 0.5, 0.25 + 0.25 * softness) + 0.3 * bump(t, 0.5, 0.5)
};

const gradient = (color: string, opacity: number, variant: Variant, softness: number) => {
  const profile = PROFILES[variant] ?? PROFILES.streak;
  const stops = Array.from({ length: 33 }, (_, index) => {
    const t = index / 32;
    const alpha = Math.round(Math.min(1, profile(t, softness) * opacity) * 1000) / 10;
    return `color-mix(in srgb, ${color} ${alpha}%, transparent) ${(t * 100).toFixed(1)}%`;
  });
  return `linear-gradient(90deg, ${stops.join(', ')})`;
};

const ease = (t: number) => (1 - Math.cos(Math.PI * t)) / 2;

const rootRef = useTemplateRef<HTMLDivElement>('rootRef');
const glareRef = useTemplateRef<HTMLSpanElement>('glareRef');
const bandRef = useTemplateRef<HTMLSpanElement>('bandRef');
const rimRef = useTemplateRef<HTMLSpanElement>('rimRef');

const rootClass = computed(() => `glare-hover ${props.className}`.trim());

const rootVars = computed(() => ({
  '--gh-width': props.width,
  '--gh-height': props.height,
  '--gh-bg': props.background,
  '--gh-br': props.borderRadius,
  '--gh-border': props.borderColor,
  '--gh-glare': gradient(props.glareColor, props.glareOpacity, props.variant, props.softness),
  '--gh-rim': gradient(props.glareColor, Math.min(1, props.glareOpacity * 1.8), props.variant, props.softness),
  '--gh-blend': props.blendMode
}));

let engine: { measure: () => void; destroy: () => void } | null = null;
let introPlayed = false;

const start = () => {
  const root = rootRef.value;
  const glare = glareRef.value;
  if (!root || !glare) return null;

  const mode = props.mode;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const geometry = { band: 0, reach: 0, ux: 0, uy: -1, angle: 0 };
  const state = {
    pos: 0,
    velocity: 0,
    target: 0,
    presence: 0,
    presenceTarget: 0,
    sweep: null as Sweep | null,
    visible: true
  };
  let raf = 0;
  let last = 0;
  let timer = 0;

  const bands = () => [bandRef.value, rimRef.value].filter((band): band is HTMLSpanElement => Boolean(band));

  const write = () => {
    const transform = `translate(-50%, -50%) rotate(${geometry.angle - 90}deg) translateX(${state.pos.toFixed(2)}px)`;
    for (const band of bands()) band.style.transform = transform;
    glare.style.opacity = state.presence.toFixed(3);
  };

  const measure = () => {
    const angle = props.glareAngle;
    const size = props.glareSize;
    const width = root.clientWidth;
    const height = root.clientHeight;
    const radians = (angle * Math.PI) / 180;
    const ux = Math.sin(radians);
    const uy = -Math.cos(radians);
    const diagonal = Math.hypot(width, height);
    const band = Math.max(8, (diagonal * size) / 100);
    const reach = (Math.abs(width * ux) + Math.abs(height * uy)) / 2 + band / 2 + 2;
    const resting = !state.sweep && mode !== 'follow';
    Object.assign(geometry, { band, reach, ux, uy, angle });
    for (const element of bands()) {
      element.style.width = `${band}px`;
      element.style.height = `${diagonal + band}px`;
    }
    if (resting) state.pos = state.pos > 0 ? reach : -reach;
    write();
  };

  const frame = (now: number) => {
    const dt = Math.min(0.05, (now - last) / 1000 || 0);
    last = now;
    let moving = false;
    if (state.sweep) {
      const sweep = state.sweep;
      const t = Math.min(1, (now - sweep.start) / sweep.duration);
      state.pos = sweep.from + (sweep.to - sweep.from) * ease(t);
      if (t < 1) moving = true;
      else state.sweep = null;
    } else if (mode === 'follow') {
      const steps = Math.max(1, Math.ceil(dt / (1 / 120)));
      const h = dt / steps;
      for (let i = 0; i < steps; i++) {
        state.velocity += (170 * (state.target - state.pos) - 24 * state.velocity) * h;
        state.pos += state.velocity * h;
      }
      const tau = state.presenceTarget > state.presence ? 0.18 : 0.4;
      state.presence += (state.presenceTarget - state.presence) * (1 - Math.exp(-dt / tau));
      moving =
        Math.abs(state.target - state.pos) > 0.05 ||
        Math.abs(state.velocity) > 0.05 ||
        Math.abs(state.presenceTarget - state.presence) > 0.002;
      if (!moving) state.presence = state.presenceTarget;
    }
    write();
    raf = moving ? requestAnimationFrame(frame) : 0;
  };

  const wake = () => {
    if (raf) return;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  };

  const sweep = (sign: number) => {
    if (reduced || !geometry.reach) return;
    const end = sign * geometry.reach;
    const from = state.sweep || Math.abs(state.pos) < geometry.reach ? state.pos : -end;
    if (from === end) return;
    const share = Math.abs(end - from) / (2 * geometry.reach);
    state.sweep = {
      from,
      to: end,
      start: performance.now(),
      duration: Math.max(120, props.transitionDuration * share)
    };
    wake();
  };

  const along = (event: PointerEvent) => {
    const rect = root.getBoundingClientRect();
    const dx = event.clientX - (rect.left + rect.width / 2);
    const dy = event.clientY - (rect.top + rect.height / 2);
    return dx * geometry.ux + dy * geometry.uy;
  };

  const follow = (event: PointerEvent) => {
    state.target = Math.max(-geometry.reach, Math.min(geometry.reach, along(event)));
    wake();
  };

  const onEnter = (event: PointerEvent) => {
    if (mode === 'hover') sweep(along(event) > 0 ? -1 : 1);
    if (mode === 'follow') {
      if (state.presence < 0.02) {
        state.pos = Math.max(-geometry.reach, Math.min(geometry.reach, along(event)));
        state.velocity = 0;
      }
      state.presenceTarget = reduced ? 0 : 1;
      follow(event);
    }
  };

  const onMove = (event: PointerEvent) => {
    if (mode === 'follow') follow(event);
  };

  const onLeave = (event: PointerEvent) => {
    if (mode === 'hover' && !props.playOnce) sweep(along(event) > 0 ? 1 : -1);
    if (mode === 'follow') {
      state.presenceTarget = 0;
      wake();
    }
  };

  const onDown = (event: PointerEvent) => {
    if (mode === 'click') sweep(along(event) > 0 ? -1 : 1);
  };

  const onFocus = (event: FocusEvent) => {
    if (mode !== 'follow' && (event.target as Element | null)?.matches?.(':focus-visible')) sweep(1);
  };

  const schedule = () => {
    window.clearTimeout(timer);
    if (mode !== 'loop' || reduced) return;
    timer = window.setTimeout(
      () => {
        if (state.visible && !document.hidden) sweep(1);
        schedule();
      },
      Math.max(0.5, props.interval) * 1000
    );
  };

  root.addEventListener('pointerenter', onEnter);
  root.addEventListener('pointermove', onMove);
  root.addEventListener('pointerleave', onLeave);
  root.addEventListener('pointerdown', onDown);
  root.addEventListener('focusin', onFocus);

  const resizeObserver = new ResizeObserver(measure);
  resizeObserver.observe(root);

  const visibilityObserver = new IntersectionObserver(
    ([entry]) => {
      state.visible = entry.isIntersecting;
      if (entry.isIntersecting && props.intro && !introPlayed) {
        introPlayed = true;
        sweep(1);
      }
    },
    { threshold: 0.4 }
  );
  visibilityObserver.observe(root);

  state.presence = mode === 'follow' ? 0 : 1;
  state.presenceTarget = state.presence;
  state.pos = -1e4;
  measure();
  schedule();

  const destroy = () => {
    cancelAnimationFrame(raf);
    window.clearTimeout(timer);
    resizeObserver.disconnect();
    visibilityObserver.disconnect();
    root.removeEventListener('pointerenter', onEnter);
    root.removeEventListener('pointermove', onMove);
    root.removeEventListener('pointerleave', onLeave);
    root.removeEventListener('pointerdown', onDown);
    root.removeEventListener('focusin', onFocus);
  };

  return { measure, destroy };
};

onMounted(() => {
  engine = start();
});

watch(
  () => props.mode,
  () => {
    engine?.destroy();
    engine = start();
  }
);

watch(
  () => [props.glareAngle, props.glareSize, props.rimGlint],
  () => engine?.measure(),
  { flush: 'post' }
);

onBeforeUnmount(() => {
  engine?.destroy();
  engine = null;
});
</script>

<style>
.glare-hover {
  position: relative;
  display: inline-grid;
  vertical-align: top;
  place-items: center;
  width: var(--gh-width);
  height: var(--gh-height);
  background: var(--gh-bg);
  border: 1px solid var(--gh-border);
  border-radius: var(--gh-br);
  overflow: hidden;
  isolation: isolate;
}

.glare-hover__glare {
  position: absolute;
  inset: 0;
  z-index: 2;
  border-radius: inherit;
  opacity: 0;
  mix-blend-mode: var(--gh-blend);
  pointer-events: none;
}

.glare-hover__band {
  position: absolute;
  top: 50%;
  left: 50%;
  background: var(--gh-glare);
  will-change: transform;
}

.glare-hover__rim {
  position: absolute;
  inset: 0;
  padding: 1px;
  border-radius: inherit;
  -webkit-mask-image: linear-gradient(#000 0 0), linear-gradient(#000 0 0);
  -webkit-mask-clip: content-box, border-box;
  -webkit-mask-composite: xor;
  mask-image: linear-gradient(#000 0 0), linear-gradient(#000 0 0);
  mask-clip: content-box, border-box;
  mask-composite: exclude;
}

.glare-hover__band--rim {
  background: var(--gh-rim);
}
</style>
