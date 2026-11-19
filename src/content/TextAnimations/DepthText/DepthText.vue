<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch, type CSSProperties } from 'vue';

interface DepthTextProps {
  text?: string;
  layers?: number;
  depth?: number;
  faceColor?: string;
  depthColor?: string;
  gradientDepth?: boolean;
  tilt?: number;
  pointerTracking?: boolean;
  smoothing?: number;
  perspective?: number;
  autoOrbit?: boolean;
  orbitSpeed?: number;
  hoverPush?: number;
  float?: boolean;
  fontSize?: string;
  fontWeight?: number | string;
  shadow?: boolean;
  outline?: boolean;
  intro?: boolean;
  className?: string;
  style?: CSSProperties;
}

interface DepthLayer {
  index: number;
  color: string;
  transform: string;
}

interface Rotation {
  x: number;
  y: number;
}

interface Motion {
  push: number;
  velocity: number;
  float: number;
}

const MAX_LAYERS = 64;
const INTRO_MS = 1200;
const PUSH_STIFFNESS = 260;
const PUSH_DAMPING = 17;
const PRESS_EXTRA = 0.25;
const FLOAT_EASE = 0.7;

const clamp = (value: number, min: number, max: number): number => Math.min(Math.max(value, min), max);

const getLayerColor = (faceColor: string, depthColor: string, index: number, total: number): string => {
  const progress = total <= 1 ? 1 : index / total;
  const eased = progress * progress;
  const faceMix = Math.round((1 - eased) * 72 + 4);
  return `color-mix(in srgb, color-mix(in srgb, ${faceColor} ${faceMix}%, ${depthColor}) 92%, black)`;
};

const getFadeColor = (depthColor: string, index: number, total: number, outline: boolean): string => {
  const reach = (layer: number) => Math.pow(clamp(1 - (layer - 0.5) / total, 0, 1), 1.6);
  const here = reach(index);
  const behind = index >= total ? 0 : reach(index + 1);
  const alpha = outline ? here : behind >= 1 ? 1 : 1 - (1 - here) / (1 - behind);
  return `color-mix(in srgb, ${depthColor} ${(clamp(alpha, 0, 1) * 100).toFixed(2)}%, transparent)`;
};

const getTransform = (rotateX: number, rotateY: number, lift = 0, roll = 0, sink = 0): string =>
  [
    lift ? `translateY(${lift.toFixed(2)}px)` : '',
    roll ? `rotateZ(${roll.toFixed(3)}deg)` : '',
    `rotateX(${rotateX.toFixed(3)}deg) rotateY(${rotateY.toFixed(3)}deg)`,
    sink ? `translateZ(${(-sink).toFixed(2)}px)` : ''
  ]
    .filter(Boolean)
    .join(' ');

const props = withDefaults(defineProps<DepthTextProps>(), {
  text: 'Elevate',
  layers: 34,
  depth: 2.4,
  faceColor: 'currentColor',
  depthColor: '#42b883',
  gradientDepth: false,
  tilt: 7.5,
  pointerTracking: true,
  smoothing: 0.14,
  perspective: 900,
  autoOrbit: true,
  orbitSpeed: 0.35,
  hoverPush: 0,
  float: false,
  fontSize: 'clamp(3rem, 12vw, 7rem)',
  fontWeight: 900,
  shadow: true,
  outline: false,
  intro: true,
  className: '',
  style: () => ({})
});

const rootRef = ref<HTMLSpanElement | null>(null);
const stageRef = ref<HTMLSpanElement | null>(null);
let rotation: Rotation | null = null;
const motionState: Motion = { push: 0, velocity: 0, float: 0 };
let introProgress = props.intro ? 0 : 1;

const safeLayers = computed(() => clamp(Math.round(Number(props.layers) || 1), 2, MAX_LAYERS));
const safeDepth = computed(() => clamp(Number(props.depth) || 0, 0, 12));
const safeTilt = computed(() => clamp(Number(props.tilt) || 0, 0, 12));
const safeSmoothing = computed(() => clamp(Number(props.smoothing) || 0.14, 0.02, 0.35));
const safePerspective = computed(() => clamp(Number(props.perspective) || 900, 300, 2000));
const safeOrbitSpeed = computed(() => clamp(Number(props.orbitSpeed) || 0, 0, 2));
const safePush = computed(() => clamp(Number(props.hoverPush) || 0, 0, 1));
const extent = computed(() => safeLayers.value * safeDepth.value);

const initialTilt = clamp(Number(props.tilt) || 0, 0, 12);
const stageStyle = `transform: ${getTransform(-initialTilt * 0.32, initialTilt * 0.42)}; --depth-text-grow: ${props.intro ? 0 : 1}`;

const depthLayers = computed<DepthLayer[]>(() =>
  Array.from({ length: safeLayers.value }, (_, layerIndex) => {
    const index = safeLayers.value - layerIndex;
    return {
      index,
      color: props.gradientDepth
        ? getFadeColor(props.depthColor, index, safeLayers.value, props.outline)
        : getLayerColor(props.faceColor, props.depthColor, index, safeLayers.value),
      transform: `translateZ(calc(var(--depth-text-grow, 1) * ${(-index * safeDepth.value).toFixed(2)}px))`
    };
  })
);

const rootStyle = computed(() => ({
  ...props.style,
  '--depth-text-perspective': `${safePerspective.value}px`,
  '--depth-text-font-size': props.fontSize,
  '--depth-text-font-weight': String(props.fontWeight),
  '--depth-text-face-color': props.faceColor,
  '--depth-text-shadow':
    props.shadow && !props.gradientDepth
      ? `0 0.18em 0.32em color-mix(in srgb, ${props.depthColor} 24%, rgba(0, 0, 0, 0.42))`
      : 'none',
  '--depth-text-face-shadow': props.shadow ? '0 0.035em 0.07em rgba(0, 0, 0, 0.28)' : 'none'
}));

let teardown: (() => void) | null = null;

const setup = (): (() => void) | null => {
  const root = rootRef.value;
  const stage = stageRef.value;
  if (!root || !stage || typeof window === 'undefined') return null;

  const tilt = safeTilt.value;
  const smoothing = safeSmoothing.value;
  const orbitSpeed = safeOrbitSpeed.value;
  const push = safePush.value;
  const depthExtent = extent.value;
  const autoOrbit = props.autoOrbit;
  const float = props.float;
  const baseRotation = { x: -tilt * 0.32, y: tilt * 0.42 };

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const canTrackPointer = props.pointerTracking && finePointer && !reducedMotion;
  const listensToHover = (push > 0 || float) && !reducedMotion;

  let frameId = 0;
  let visible = true;
  let activePointer = false;
  let hovered = false;
  let pressed = false;
  let lastTime = 0;
  let size = root.offsetHeight;
  const startTime = performance.now();
  const motion = motionState;
  const current = rotation || { ...baseRotation };
  const target = { ...baseRotation };
  rotation = current;

  const sinkAmount = () => clamp(motion.push, -0.25, 1);

  const applyTransform = (now = performance.now()) => {
    const time = (now - startTime) / 1000;
    const drift = motion.float;
    stage.style.transform = getTransform(
      current.x + (drift ? Math.cos(time * 1.19) * 2 * drift : 0),
      current.y + (drift ? Math.sin(time * 0.86 + 2.1) * 4 * drift : 0),
      drift ? Math.sin(time * 1.43) * size * 0.045 * drift : 0,
      drift ? Math.sin(time * 1.03 + 0.8) * 1.6 * drift : 0,
      sinkAmount() * depthExtent
    );
  };

  const applyGrow = () => {
    const progress = introProgress;
    const grow = progress >= 1 ? 1 : 1 - Math.pow(1 - progress, 3);
    const value = grow * (1 - sinkAmount());
    stage.style.setProperty('--depth-text-grow', value === 1 ? '1' : value.toFixed(4));
  };

  if (reducedMotion) {
    introProgress = 1;
    motion.push = 0;
    motion.velocity = 0;
    motion.float = 0;
    applyGrow();
    current.x = baseRotation.x;
    current.y = baseRotation.y;
    applyTransform();
    return null;
  }

  const stop = () => {
    if (frameId) cancelAnimationFrame(frameId);
    frameId = 0;
  };

  const tick = (now: number) => {
    const delta = lastTime ? Math.min(now - lastTime, 50) : 16;
    lastTime = now;

    if (introProgress < 1) {
      introProgress = Math.min(1, introProgress + delta / INTRO_MS);
    }

    if ((!canTrackPointer || !activePointer) && autoOrbit) {
      const elapsed = (now - startTime) / 1000;
      const orbit = elapsed * orbitSpeed * Math.PI * 2;
      const fallbackAmount = canTrackPointer ? 0.18 : 0.55;
      target.x = baseRotation.x + Math.sin(orbit) * tilt * fallbackAmount;
      target.y = baseRotation.y + Math.cos(orbit * 0.85) * tilt * fallbackAmount;
    }

    current.x += (target.x - current.x) * smoothing;
    current.y += (target.y - current.y) * smoothing;

    const pushGoal = push > 0 && (hovered || pressed) ? Math.min(1, push + (pressed ? PRESS_EXTRA : 0)) : 0;
    let remaining = delta / 1000;
    while (remaining > 0) {
      const step = Math.min(remaining, 1 / 120);
      motion.velocity += (PUSH_STIFFNESS * (pushGoal - motion.push) - PUSH_DAMPING * motion.velocity) * step;
      motion.push += motion.velocity * step;
      remaining -= step;
    }
    const springIdle = Math.abs(pushGoal - motion.push) < 0.0005 && Math.abs(motion.velocity) < 0.002;
    if (springIdle) {
      motion.push = pushGoal;
      motion.velocity = 0;
    }

    const floatGoal = float && !hovered && !pressed ? 1 : 0;
    motion.float += (floatGoal - motion.float) * (1 - Math.exp(-delta / 1000 / FLOAT_EASE));
    if (Math.abs(floatGoal - motion.float) < 0.001) motion.float = floatGoal;

    applyGrow();
    applyTransform(now);

    const settled = Math.abs(target.x - current.x) < 0.001 && Math.abs(target.y - current.y) < 0.001;
    if (!autoOrbit && !motion.float && settled && springIdle && introProgress >= 1) {
      frameId = 0;
      return;
    }

    frameId = requestAnimationFrame(tick);
  };

  const start = () => {
    if (frameId || !visible) return;
    lastTime = 0;
    frameId = requestAnimationFrame(tick);
  };

  const handlePointerMove = (event: PointerEvent) => {
    const rect = root.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    activePointer = true;
    const x = clamp((event.clientX - (rect.left + rect.width / 2)) / (rect.width * 0.8), -1, 1);
    const y = clamp((event.clientY - (rect.top + rect.height / 2)) / (rect.height * 0.8), -1, 1);

    target.x = baseRotation.x - y * tilt;
    target.y = baseRotation.y + x * tilt;
    start();
  };

  const handlePointerLeave = () => {
    activePointer = false;
    target.x = baseRotation.x;
    target.y = baseRotation.y;
    start();
  };

  const handlePointerOut = (event: PointerEvent) => {
    if (!event.relatedTarget) handlePointerLeave();
  };

  const isHoverPointer = (event: PointerEvent) => event.pointerType === 'mouse' || event.pointerType === 'pen';

  const handleEnter = (event: PointerEvent) => {
    if (!isHoverPointer(event)) return;
    hovered = true;
    start();
  };

  const handleLeave = () => {
    hovered = false;
    pressed = false;
    start();
  };

  const handleDown = () => {
    pressed = true;
    start();
  };

  const handleUp = (event: PointerEvent) => {
    pressed = false;
    if (!isHoverPointer(event)) hovered = false;
    start();
  };

  if (canTrackPointer) {
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerout', handlePointerOut);
    window.addEventListener('blur', handlePointerLeave);
  }

  if (listensToHover) {
    root.addEventListener('pointerenter', handleEnter);
    root.addEventListener('pointerleave', handleLeave);
    root.addEventListener('pointerdown', handleDown);
    root.addEventListener('pointerup', handleUp);
    root.addEventListener('pointercancel', handleLeave);
  }

  const observer =
    typeof IntersectionObserver === 'undefined'
      ? null
      : new IntersectionObserver(([entry]) => {
          visible = entry.isIntersecting;
          if (visible) start();
          else stop();
        });
  observer?.observe(root);

  const resizeObserver =
    typeof ResizeObserver === 'undefined'
      ? null
      : new ResizeObserver(() => {
          size = root.offsetHeight;
        });
  resizeObserver?.observe(root);

  applyGrow();
  applyTransform();
  start();

  return () => {
    if (canTrackPointer) {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerout', handlePointerOut);
      window.removeEventListener('blur', handlePointerLeave);
    }
    if (listensToHover) {
      root.removeEventListener('pointerenter', handleEnter);
      root.removeEventListener('pointerleave', handleLeave);
      root.removeEventListener('pointerdown', handleDown);
      root.removeEventListener('pointerup', handleUp);
      root.removeEventListener('pointercancel', handleLeave);
    }
    observer?.disconnect();
    resizeObserver?.disconnect();
    stop();
  };
};

const restart = () => {
  teardown?.();
  teardown = setup();
};

onMounted(restart);

watch(
  [
    () => props.autoOrbit,
    () => props.pointerTracking,
    () => props.float,
    safeOrbitSpeed,
    safeSmoothing,
    safeTilt,
    safePush,
    extent
  ],
  restart
);

onBeforeUnmount(() => {
  teardown?.();
  teardown = null;
});
</script>

<template>
  <span
    ref="rootRef"
    :class="`depth-text ${outline ? 'depth-text--outline' : ''} ${className}`.trim()"
    :style="rootStyle"
  >
    <span ref="stageRef" class="depth-text__stage" :style="stageStyle">
      <span
        v-for="layer in depthLayers"
        :key="layer.index"
        aria-hidden="true"
        :class="`depth-text__layer ${layer.index === safeLayers ? 'depth-text__layer--back' : ''}`.trim()"
        :style="{ color: layer.color, transform: layer.transform }"
      >
        {{ text }}
      </span>
      <span class="depth-text__face">{{ text }}</span>
    </span>
  </span>
</template>

<style>
.depth-text {
  display: inline-block;
  perspective: var(--depth-text-perspective);
  perspective-origin: 50% 48%;
  isolation: isolate;
}

.depth-text__stage {
  position: relative;
  display: inline-grid;
  place-items: center;
  transform-style: preserve-3d;
  transform-origin: 50% 50%;
  will-change: transform;
}

.depth-text__layer,
.depth-text__face {
  grid-area: 1 / 1;
  display: inline-block;
  font-size: var(--depth-text-font-size);
  font-weight: var(--depth-text-font-weight);
  line-height: 0.86;
  letter-spacing: -0.065em;
  white-space: nowrap;
  user-select: none;
  transform-style: preserve-3d;
  backface-visibility: hidden;
  font-kerning: normal;
  text-rendering: geometricPrecision;
}

.depth-text__layer {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.depth-text__layer--back {
  text-shadow: var(--depth-text-shadow);
}

.depth-text--outline .depth-text__layer {
  -webkit-text-fill-color: transparent;
  -webkit-text-stroke: max(1px, 0.012em) currentColor;
}

.depth-text__face {
  position: relative;
  z-index: 1;
  color: var(--depth-text-face-color);
  text-shadow: var(--depth-text-face-shadow);
  transform: translateZ(0.6px);
}

@media (hover: hover) and (pointer: fine) {
  .depth-text {
    cursor: default;
  }
}

@media (prefers-reduced-motion: reduce) {
  .depth-text__stage {
    will-change: auto;
  }
}
</style>
