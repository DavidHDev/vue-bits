<template>
  <div
    ref="rootRef"
    :class="['noise', fixed ? 'noise--fixed' : '', className].filter(Boolean)"
    :style="[{ zIndex }, style ?? {}]"
    aria-hidden="true"
  >
    <div
      ref="grainRef"
      class="noise__grain"
      :style="{
        opacity: settings.opacity,
        mixBlendMode: blend,
        backgroundSize: `${TILE * settings.size}px ${TILE * settings.size}px`
      }"
    />
    <canvas ref="dustRef" class="noise__dust" />
    <div
      v-if="scanlines > 0"
      ref="linesRef"
      class="noise__lines"
      :style="{ opacity: clamp(scanlines, 0, 1), mixBlendMode: blend }"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch, type CSSProperties } from 'vue';

export type NoiseBlendMode = 'normal' | 'overlay' | 'soft-light' | 'multiply' | 'screen' | 'difference';

interface NoiseProps {
  opacity?: number;
  size?: number;
  fps?: number;
  blendMode?: NoiseBlendMode;
  contrast?: number;
  colored?: boolean;
  dust?: number;
  scratches?: number;
  scanlines?: number;
  flicker?: number;
  fixed?: boolean;
  zIndex?: number;
  className?: string;
  style?: CSSProperties;
}

type Scratch = {
  x: number;
  age: number;
  life: number;
  weight: number;
  light: boolean;
  phase: number;
};

type Settings = {
  opacity: number;
  size: number;
  fps: number;
  flicker: number;
  dust: number;
  scratches: number;
};

const props = withDefaults(defineProps<NoiseProps>(), {
  opacity: 0.2,
  size: 1,
  fps: 24,
  blendMode: 'overlay',
  contrast: 0.6,
  colored: false,
  dust: 0,
  scratches: 0,
  scanlines: 0,
  flicker: 0,
  fixed: false,
  zIndex: undefined,
  className: '',
  style: undefined
});

const TILE = 256;
const TAU = Math.PI * 2;
const BLENDS: NoiseBlendMode[] = ['normal', 'overlay', 'soft-light', 'multiply', 'screen', 'difference'];

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const generator = (seed: number) => {
  let state = seed >>> 0 || 1;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const paintTile = (contrast: number, colored: boolean) => {
  const canvas = document.createElement('canvas');
  canvas.width = TILE;
  canvas.height = TILE;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  const image = ctx.createImageData(TILE, TILE);
  const data = image.data;
  const random = generator(1013904223);
  const range = 0.5 + contrast * 1.1;
  const sample = () => clamp(0.5 + (random() + random() - 1) * range, 0, 1) * 255;
  for (let i = 0; i < data.length; i += 4) {
    const value = sample();
    data[i] = value;
    data[i + 1] = colored ? sample() : value;
    data[i + 2] = colored ? sample() : value;
    data[i + 3] = 255;
  }
  ctx.putImageData(image, 0, 0);
  return canvas;
};

const drawSpeck = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  tone: string,
  alpha: number
) => {
  const lobes = 1 + Math.floor(Math.random() * 3);
  for (let k = 0; k < lobes; k++) {
    const ox = x + (Math.random() - 0.5) * radius * 1.4;
    const oy = y + (Math.random() - 0.5) * radius * 1.4;
    const size = radius * (0.55 + Math.random() * 0.5);
    const fill = ctx.createRadialGradient(ox, oy, 0, ox, oy, size);
    fill.addColorStop(0, `rgba(${tone}, ${alpha})`);
    fill.addColorStop(0.55, `rgba(${tone}, ${alpha * 0.85})`);
    fill.addColorStop(1, `rgba(${tone}, 0)`);
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.arc(ox, oy, size, 0, TAU);
    ctx.fill();
  }
};

const drawHair = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  const x = Math.random() * width;
  const y = Math.random() * height;
  const length = 14 + Math.random() * 46;
  const angle = Math.random() * TAU;
  const bend = (Math.random() - 0.5) * length * 0.9;
  const ex = x + Math.cos(angle) * length;
  const ey = y + Math.sin(angle) * length;
  const cx = (x + ex) / 2 - Math.sin(angle) * bend;
  const cy = (y + ey) / 2 + Math.cos(angle) * bend;
  ctx.strokeStyle = `rgba(16, 12, 9, ${0.4 + Math.random() * 0.35})`;
  ctx.lineWidth = 0.6 + Math.random() * 0.7;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.quadraticCurveTo(cx, cy, ex, ey);
  ctx.stroke();
};

const rootRef = ref<HTMLDivElement | null>(null);
const grainRef = ref<HTMLDivElement | null>(null);
const dustRef = ref<HTMLCanvasElement | null>(null);
const linesRef = ref<HTMLDivElement | null>(null);

const settings = computed<Settings>(() => ({
  opacity: clamp(props.opacity, 0, 1),
  size: Math.max(0.5, props.size),
  fps: clamp(props.fps, 0, 60),
  flicker: clamp(props.flicker, 0, 1),
  dust: clamp(props.dust, 0, 1),
  scratches: clamp(props.scratches, 0, 1)
}));
const blend = computed(() => (BLENDS.includes(props.blendMode) ? props.blendMode : 'normal'));

let url = '';
let tileToken = 0;
let wake: (() => void) | null = null;
let teardown: (() => void) | null = null;

const updateTile = () => {
  const grain = grainRef.value;
  if (!grain) return;
  const token = ++tileToken;
  const canvas = paintTile(clamp(props.contrast, 0, 1), props.colored);
  canvas?.toBlob(blob => {
    if (token !== tileToken || !blob) return;
    const previous = url;
    url = URL.createObjectURL(blob);
    grain.style.backgroundImage = `url("${url}")`;
    if (previous) URL.revokeObjectURL(previous);
  });
};

watch(() => [props.contrast, props.colored], updateTile);

watch(
  () => [
    props.opacity,
    props.size,
    props.fps,
    props.blendMode,
    props.contrast,
    props.colored,
    props.dust,
    props.scratches,
    props.scanlines,
    props.flicker,
    props.fixed
  ],
  () => wake?.(),
  { flush: 'post' }
);

onMounted(() => {
  updateTile();

  const root = rootRef.value;
  const grain = grainRef.value;
  const canvas = dustRef.value;
  const ctx = canvas?.getContext('2d');
  if (!root || !grain || !canvas || !ctx) return;
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  const scratchList: Scratch[] = [];
  let raf = 0;
  let last = 0;
  let roll = 0;
  let visible = true;
  let alive = true;
  let width = 1;
  let height = 1;

  const paintDust = (s: Settings, step: number) => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (s.dust <= 0 && s.scratches <= 0 && scratchList.length === 0) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const area = (width * height) / 400000;

    if (s.dust > 0) {
      const specks = Math.round(s.dust * 42 * area * (0.6 + Math.random() * 0.8));
      for (let i = 0; i < specks; i++) {
        const light = Math.random() < 0.3;
        drawSpeck(
          ctx,
          Math.random() * width,
          Math.random() * height,
          0.6 + Math.random() ** 2.5 * 3.4,
          light ? '255, 250, 240' : '18, 14, 10',
          0.6 + Math.random() * 0.35
        );
      }
      const hairs = Math.random() < s.dust * 0.7 ? 1 + Math.floor(Math.random() * s.dust * 2.4) : 0;
      for (let i = 0; i < hairs; i++) drawHair(ctx, width, height);
    }

    if (step) {
      if (scratchList.length < 3 && Math.random() < s.scratches * 0.06) {
        scratchList.push({
          x: Math.random() * width,
          age: 0,
          life: 0.6 + Math.random() * 2.6,
          weight: 0.6 + Math.random() * 0.8,
          light: Math.random() < 0.7,
          phase: Math.random() * TAU
        });
      }
      for (let i = scratchList.length - 1; i >= 0; i--) {
        const scratch = scratchList[i];
        scratch.age += step;
        scratch.x += (Math.random() - 0.5) * 1.2;
        if (scratch.age >= scratch.life) scratchList.splice(i, 1);
      }
    }
    scratchList.forEach(scratch => {
      const fade = Math.min(1, scratch.age / 0.15, (scratch.life - scratch.age) / 0.3);
      const alpha = (0.25 + Math.random() * 0.35) * fade;
      ctx.strokeStyle = scratch.light ? `rgba(255, 252, 245, ${alpha})` : `rgba(14, 11, 8, ${alpha})`;
      ctx.lineWidth = scratch.weight;
      ctx.beginPath();
      for (let y = 0; y <= height; y += 24) {
        const x = scratch.x + Math.sin(y * 0.012 + scratch.phase) * 1.4;
        if (y === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    });
  };

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = Math.max(1, root.clientWidth);
    height = Math.max(1, root.clientHeight);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    paintDust(settings.value, 0);
  };

  const tick = (now: number) => {
    raf = 0;
    if (!alive) return;
    const s = settings.value;
    const rate = reduce ? 0 : s.fps;
    if (rate > 0 && now - last >= 1000 / rate) {
      const step = last ? Math.min(0.2, (now - last) / 1000) : 1 / rate;
      last = now;
      const span = TILE * s.size;
      grain.style.backgroundPosition = `${(Math.random() * span).toFixed(1)}px ${(Math.random() * span).toFixed(1)}px`;
      grain.style.opacity = String(s.opacity * (1 - s.flicker * Math.random() * 0.7));
      roll = (roll + 1) % 3;
      linesRef.value?.style.setProperty('background-position', `0 ${roll}px`);
      paintDust(s, step);
    }
    if (visible && rate > 0) raf = requestAnimationFrame(tick);
  };

  wake = () => {
    paintDust(settings.value, 0);
    if (raf || !alive || !visible) return;
    raf = requestAnimationFrame(tick);
  };

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(root);
  const visibility = new IntersectionObserver(entries => {
    visible = entries.some(entry => entry.isIntersecting);
    if (visible) wake?.();
  });
  visibility.observe(root);
  resize();
  wake();

  teardown = () => {
    alive = false;
    cancelAnimationFrame(raf);
    wake = null;
    resizeObserver.disconnect();
    visibility.disconnect();
  };
});

onBeforeUnmount(() => {
  tileToken++;
  teardown?.();
  teardown = null;
  if (url) URL.revokeObjectURL(url);
  url = '';
});
</script>

<style>
.noise {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.noise--fixed {
  position: fixed;
}

.noise__grain {
  position: absolute;
  inset: 0;
  background-repeat: repeat;
  image-rendering: pixelated;
}

.noise__dust {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.noise__lines {
  position: absolute;
  inset: 0;
  background-image: repeating-linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.55) 0,
    rgba(0, 0, 0, 0.55) 1px,
    transparent 1px,
    transparent 3px
  );
}
</style>
