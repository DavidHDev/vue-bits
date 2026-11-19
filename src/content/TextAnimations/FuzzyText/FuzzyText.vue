<template>
  <canvas
    ref="canvasRef"
    :class="className"
    :style="{ cursor: trigger === 'click' ? 'pointer' : '' }"
    role="img"
    :aria-label="text"
  />
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, useSlots, useTemplateRef, watch, type VNode } from 'vue';

type FuzzDirection = 'horizontal' | 'vertical' | 'both';
type FuzzTrigger = 'hover' | 'always' | 'click';
type Rgb = [number, number, number];

interface FuzzyTextProps {
  fontSize?: number | string;
  fontWeight?: string | number;
  fontFamily?: string;
  color?: string;
  enableHover?: boolean;
  baseIntensity?: number;
  hoverIntensity?: number;
  fuzzRange?: number;
  fps?: number;
  direction?: FuzzDirection;
  transitionDuration?: number;
  clickEffect?: boolean;
  glitchMode?: boolean;
  glitchInterval?: number;
  glitchDuration?: number;
  gradient?: string[] | null;
  letterSpacing?: number;
  sliceSize?: number;
  trigger?: FuzzTrigger;
  intro?: boolean;
  introDuration?: number;
  colorSplit?: number;
  className?: string;
}

interface ChannelLayer {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D | null;
}

const props = withDefaults(defineProps<FuzzyTextProps>(), {
  fontSize: 'clamp(2rem, 8vw, 8rem)',
  fontWeight: 900,
  fontFamily: 'inherit',
  color: 'currentColor',
  enableHover: true,
  baseIntensity: 0.18,
  hoverIntensity: 0.5,
  fuzzRange: 30,
  fps: 60,
  direction: 'horizontal',
  transitionDuration: 0,
  clickEffect: false,
  glitchMode: false,
  glitchInterval: 2000,
  glitchDuration: 200,
  gradient: null,
  letterSpacing: 0,
  sliceSize: 1,
  trigger: 'hover',
  intro: false,
  introDuration: 1400,
  colorSplit: 0,
  className: ''
});

const INTRO_PEAK = 2;
const BURST_ATTACK = 70;
const BURST_DECAY = 240;

const followsText = (value?: string) => !value || /^(currentcolor|inherit)$/i.test(value);

let colorProbe: CanvasRenderingContext2D | null = null;

const toRgb = (value: string): Rgb => {
  if (!colorProbe) {
    const probe = document.createElement('canvas');
    probe.width = 1;
    probe.height = 1;
    colorProbe = probe.getContext('2d', { willReadFrequently: true });
  }
  if (!colorProbe) return [255, 255, 255];
  colorProbe.clearRect(0, 0, 1, 1);
  colorProbe.fillStyle = '#000';
  colorProbe.fillStyle = value;
  colorProbe.fillRect(0, 0, 1, 1);
  const [r, g, b] = colorProbe.getImageData(0, 0, 1, 1).data;
  return [r, g, b];
};

const channelColor = (rgb: Rgb, channel: number, additive: boolean) =>
  `rgb(${rgb.map((value, index) => (index === channel ? value : additive ? 0 : 255)).join(',')})`;

const canvasRef = useTemplateRef<HTMLCanvasElement>('canvasRef');
const slots = useSlots();

const extractText = (nodes: VNode[]): string =>
  nodes
    .map(node => {
      if (typeof node.children === 'string') return node.children;
      if (Array.isArray(node.children)) return extractText(node.children as VNode[]);
      return '';
    })
    .join('');

const text = computed(() => extractText(slots.default?.() ?? []).trim());
const gradientKey = computed(() =>
  Array.isArray(props.gradient) && props.gradient.length >= 2 ? props.gradient.join('|') : ''
);
const splitOn = computed(() => props.colorSplit > 0);

let glitching = false;
const introState = { start: 0, done: !props.intro };
let stopGlitch: (() => void) | null = null;
let stopRender: (() => void) | null = null;

const startGlitch = () => {
  stopGlitch?.();
  stopGlitch = null;
  if (!props.glitchMode || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
  const glitchInterval = props.glitchInterval;
  const glitchDuration = props.glitchDuration;
  let startTimer: ReturnType<typeof setTimeout>;
  let endTimer: ReturnType<typeof setTimeout>;
  const schedule = () => {
    startTimer = setTimeout(() => {
      glitching = true;
      endTimer = setTimeout(() => {
        glitching = false;
        schedule();
      }, glitchDuration);
    }, glitchInterval);
  };
  schedule();
  stopGlitch = () => {
    clearTimeout(startTimer);
    clearTimeout(endTimer);
    glitching = false;
  };
};

const startRender = () => {
  stopRender?.();
  stopRender = null;
  const canvas = canvasRef.value;
  const ctx = canvas?.getContext('2d');
  const source = document.createElement('canvas');
  const sourceCtx = source.getContext('2d');
  const scratch = document.createElement('canvas');
  const scratchCtx = scratch.getContext('2d');
  const textValue = text.value;
  const fontSize = props.fontSize;
  const fontWeight = props.fontWeight;
  const fontFamily = props.fontFamily;
  const color = props.color;
  const gradient = gradientKey.value;
  const letterSpacing = props.letterSpacing;
  const fuzzRange = props.fuzzRange;
  const direction = props.direction;
  const split = splitOn.value;
  const channels: ChannelLayer[] = split
    ? [0, 1, 2].map(() => {
        const layer = document.createElement('canvas');
        return { canvas: layer, ctx: layer.getContext('2d') };
      })
    : [];
  if (!canvas || !ctx || !sourceCtx || !scratchCtx || channels.some(channel => !channel.ctx)) return;
  const layers = channels as { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D }[];

  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  const usesInk = followsText(color) && !gradient;
  const splitPad = split ? Math.ceil(fuzzRange * 0.5) + 4 : 0;
  const padX = fuzzRange + 20 + (direction === 'vertical' ? 0 : splitPad);
  const padY = direction === 'horizontal' ? 0 : fuzzRange + 10 + (direction === 'vertical' ? splitPad : 0);
  const inset = 5;
  let cancelled = false;
  let built = false;
  let visible = true;
  let frame = 0;
  let resizeFrame = 0;
  let lastFrame = 0;
  let lastInkCheck = 0;
  let clickTimer: ReturnType<typeof setTimeout> | undefined;
  let hovering = false;
  let clicking = false;
  let burstAt = 0;
  let eased = reduceMotion ? 0 : props.baseIntensity;
  let intensity = eased;
  let coarse = 1;
  let drawn = -1;
  let ink = '';
  let blend: GlobalCompositeOperation = 'lighter';
  let dpr = 1;
  let fontPx = 16;
  let rows = new Int32Array(1);
  let cols = new Int32Array(1);
  let box = { left: 0, ascent: 0, width: 0, height: 0, cssWidth: 0, cssHeight: 0 };

  const family = () => (fontFamily === 'inherit' ? getComputedStyle(canvas).fontFamily || 'sans-serif' : fontFamily);
  const font = () => `${fontWeight} ${fontPx}px ${family()}`;
  const resolveInk = () => (usesInk ? getComputedStyle(canvas).color || '#000' : color);
  const pixelRatio = () => Math.min(window.devicePixelRatio || 1, 2);
  const introPending = () => !introState.done && props.intro && !reduceMotion;

  const measureFontSize = () => {
    if (typeof fontSize === 'number') return fontSize;
    const probe = document.createElement('span');
    probe.style.fontSize = fontSize;
    (canvas.parentElement || document.body).appendChild(probe);
    const size = parseFloat(getComputedStyle(probe).fontSize);
    probe.remove();
    return Number.isFinite(size) && size > 0 ? size : 16;
  };

  const paintText = (
    target: HTMLCanvasElement,
    targetCtx: CanvasRenderingContext2D,
    tone: (value: string) => string
  ) => {
    target.width = source.width;
    target.height = source.height;
    targetCtx.setTransform(1, 0, 0, 1, 0, 0);
    targetCtx.clearRect(0, 0, target.width, target.height);
    targetCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    targetCtx.font = font();
    targetCtx.textBaseline = 'alphabetic';
    if (gradient) {
      const stops = gradient.split('|');
      const fill = targetCtx.createLinearGradient(0, 0, box.width + inset * 2, 0);
      stops.forEach((stop, index) => fill.addColorStop(index / (stops.length - 1), tone(stop)));
      targetCtx.fillStyle = fill;
    } else {
      targetCtx.fillStyle = tone(ink);
    }
    if (letterSpacing !== 0) {
      let x = inset;
      for (const char of textValue) {
        targetCtx.fillText(char, x, box.ascent);
        x += targetCtx.measureText(char).width + letterSpacing;
      }
    } else {
      targetCtx.fillText(textValue, inset + box.left, box.ascent);
    }
  };

  const paintSource = () => {
    paintText(source, sourceCtx, value => value);
    if (!split) return;
    const tones = (gradient ? gradient.split('|') : [ink]).map(toRgb);
    const light =
      tones.reduce((sum, [r, g, b]) => sum + (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255, 0) / tones.length >= 0.5;
    blend = light ? 'lighter' : 'multiply';
    layers.forEach((channel, index) =>
      paintText(channel.canvas, channel.ctx, value => channelColor(toRgb(value), index, light))
    );
  };

  const fuzz = (image: HTMLCanvasElement, shift: number, jitter: number, step: number, amp: number) => {
    const sw = image.width;
    const sh = image.height;
    const ox = Math.round(padX * dpr);
    const oy = Math.round(padY * dpr);
    const sx = direction === 'vertical' ? 0 : shift;
    const sy = direction === 'vertical' ? shift : 0;
    const wobble = () => (jitter ? Math.round((Math.random() - 0.5) * jitter) : 0);
    if (amp < 0.5) {
      ctx.drawImage(image, ox + sx, oy + sy);
      return;
    }
    if (direction === 'vertical') {
      for (let x = 0, index = 0; x < sw; x += step, index++) {
        const w = Math.min(step, sw - x);
        ctx.drawImage(image, x, 0, w, sh, ox + x, oy + cols[index] + wobble() + sy, w, sh);
      }
      return;
    }
    const both = direction === 'both';
    const target = both ? scratchCtx : ctx;
    if (both) scratchCtx.clearRect(0, 0, scratch.width, scratch.height);
    for (let y = 0, index = 0; y < sh; y += step, index++) {
      const h = Math.min(step, sh - y);
      target.drawImage(image, 0, y, sw, h, ox + rows[index] + wobble() + sx, both ? y : oy + y, sw, h);
    }
    if (!both) return;
    const reach = Math.ceil(amp / 2 + Math.abs(sx) + jitter / 2) + 1;
    const from = Math.max(0, Math.floor((ox - reach) / step) * step);
    const to = Math.min(scratch.width, ox + sw + reach);
    for (let x = from; x < to; x += step) {
      const w = Math.min(step, to - x);
      ctx.drawImage(scratch, x, 0, w, sh, x, oy + cols[x / step], w, sh);
    }
  };

  const draw = () => {
    const step = Math.max(1, Math.round(Math.max(1, props.sliceSize) * coarse * dpr));
    const amp = intensity * fuzzRange * dpr;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawn = intensity;
    if (amp >= 0.5) {
      if (direction === 'vertical') {
        for (let index = 0; index * step < source.width; index++) {
          cols[index] = Math.round((Math.random() - 0.5) * amp);
        }
      } else {
        for (let index = 0; index * step < source.height; index++) {
          rows[index] = Math.round((Math.random() - 0.5) * amp);
        }
        if (direction === 'both') {
          for (let index = 0; index * step < canvas.width; index++) {
            cols[index] = Math.round((Math.random() - 0.5) * amp * 0.5);
          }
        }
      }
    }
    const offset = split ? Math.round(props.colorSplit * (2 + intensity * fuzzRange * 0.18) * dpr) : 0;
    if (offset < 1) {
      fuzz(source, 0, 0, step, amp);
      return;
    }
    const jitter = props.colorSplit * amp * 0.2;
    ctx.globalCompositeOperation = blend;
    fuzz(layers[0].canvas, -offset, jitter, step, amp);
    fuzz(layers[1].canvas, 0, 0, step, amp);
    fuzz(layers[2].canvas, offset, jitter, step, amp);
    ctx.globalCompositeOperation = 'source-over';
  };

  const build = () => {
    dpr = pixelRatio();
    fontPx = measureFontSize();
    sourceCtx.setTransform(1, 0, 0, 1, 0, 0);
    sourceCtx.font = font();
    const metrics = sourceCtx.measureText(textValue);
    const left = metrics.actualBoundingBoxLeft ?? 0;
    let width = left + (metrics.actualBoundingBoxRight ?? metrics.width);
    if (letterSpacing !== 0) {
      width = -letterSpacing;
      for (const char of textValue) width += sourceCtx.measureText(char).width + letterSpacing;
    }
    const ascent = metrics.actualBoundingBoxAscent ?? fontPx;
    const descent = metrics.actualBoundingBoxDescent ?? fontPx * 0.2;
    const textWidth = Math.max(1, Math.ceil(width));
    const textHeight = Math.max(1, Math.ceil(ascent + descent));
    box = {
      left,
      ascent,
      width: textWidth,
      height: textHeight,
      cssWidth: textWidth + inset * 2 + padX * 2,
      cssHeight: textHeight + padY * 2
    };
    source.width = Math.ceil((textWidth + inset * 2) * dpr);
    source.height = Math.ceil(textHeight * dpr);
    canvas.width = Math.ceil(box.cssWidth * dpr);
    canvas.height = Math.ceil(box.cssHeight * dpr);
    scratch.width = canvas.width;
    scratch.height = source.height;
    rows = new Int32Array(source.height + 1);
    cols = new Int32Array(canvas.width + 1);
    canvas.style.width = `${box.cssWidth}px`;
    canvas.style.height = `${box.cssHeight}px`;
    if (introPending() && !introState.start) canvas.style.opacity = '0';
    ink = resolveInk();
    paintSource();
    built = true;
    draw();
  };

  const tick = (now: number) => {
    frame = 0;
    if (cancelled || !visible) return;
    frame = requestAnimationFrame(tick);
    const interval = 1000 / Math.max(1, props.fps);
    if (now - lastFrame < interval - 1) return;
    lastFrame = Math.max(lastFrame + interval, now - interval);
    if (usesInk && now - lastInkCheck > 250) {
      lastInkCheck = now;
      const next = resolveInk();
      if (next !== ink) {
        ink = next;
        paintSource();
        drawn = -1;
      }
    }
    const base = reduceMotion ? 0 : props.baseIntensity;
    const active =
      props.trigger === 'always'
        ? reduceMotion
          ? base
          : props.hoverIntensity
        : props.trigger !== 'click' && hovering && props.enableHover
          ? props.hoverIntensity
          : base;
    const goal = clicking || glitching ? 1 : active;
    if (props.transitionDuration > 0) {
      eased += (goal - eased) * (1 - Math.pow(0.05, 1 / props.transitionDuration));
      if (Math.abs(goal - eased) < 0.002) eased = goal;
    } else {
      eased = goal;
    }
    let level = eased;
    let energy = 0;
    if (burstAt) {
      const age = now - burstAt;
      const envelope =
        age < BURST_ATTACK ? 1 - Math.pow(1 - age / BURST_ATTACK, 2) : Math.exp(-(age - BURST_ATTACK) / BURST_DECAY);
      if (age >= BURST_ATTACK && envelope < 0.004) {
        burstAt = 0;
      } else {
        const peak = Math.min(2, 0.6 + props.hoverIntensity * 1.4);
        level += (Math.max(peak, level) - level) * envelope;
        energy = envelope;
      }
    }
    if (!introState.done) {
      if (!props.intro || reduceMotion) {
        introState.done = true;
        canvas.style.opacity = '';
      } else {
        if (!introState.start) introState.start = now;
        const progress = Math.min(1, (now - introState.start) / Math.max(1, props.introDuration));
        const envelope = Math.pow(1 - progress, 2.5);
        level += (INTRO_PEAK - level) * envelope;
        energy = Math.max(energy, envelope);
        canvas.style.opacity = progress < 0.3 ? (1 - Math.pow(1 - progress / 0.3, 2)).toFixed(3) : '';
        if (progress >= 1) introState.done = true;
      }
    }
    intensity = level;
    coarse = 1 + 3 * energy * energy;
    if (intensity === 0 && drawn === 0) return;
    draw();
  };

  const observer =
    typeof IntersectionObserver !== 'undefined'
      ? new IntersectionObserver(([entry]) => {
          visible = entry.isIntersecting;
          if (visible && built && !frame && !cancelled) frame = requestAnimationFrame(tick);
        })
      : null;
  observer?.observe(canvas);

  const isOverText = (event: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    if (!built || !rect.width || !rect.height) return false;
    const x = ((event.clientX - rect.left) * box.cssWidth) / rect.width;
    const y = ((event.clientY - rect.top) * box.cssHeight) / rect.height;
    const left = padX + inset;
    return x >= left && x <= left + box.width && y >= padY && y <= padY + box.height;
  };

  const handlePointerMove = (event: PointerEvent) => {
    hovering = isOverText(event);
  };

  const handlePointerUp = (event: PointerEvent) => {
    if (event.pointerType !== 'mouse') hovering = false;
  };

  const handlePointerLeave = () => {
    hovering = false;
  };

  const handleClick = () => {
    if (props.trigger === 'click') {
      burstAt = performance.now();
      return;
    }
    if (!props.clickEffect) return;
    clicking = true;
    clearTimeout(clickTimer);
    clickTimer = setTimeout(() => {
      clicking = false;
    }, 150);
  };

  const handleResize = () => {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(() => {
      if (built && (measureFontSize() !== fontPx || pixelRatio() !== dpr)) build();
    });
  };

  canvas.addEventListener('pointermove', handlePointerMove);
  canvas.addEventListener('pointerdown', handlePointerMove);
  canvas.addEventListener('pointerup', handlePointerUp);
  canvas.addEventListener('pointerleave', handlePointerLeave);
  canvas.addEventListener('pointercancel', handlePointerLeave);
  canvas.addEventListener('click', handleClick);
  window.addEventListener('resize', handleResize);

  const start = async () => {
    fontPx = measureFontSize();
    try {
      await document.fonts?.load(font());
    } catch {
      await document.fonts?.ready;
    }
    if (cancelled) return;
    build();
    if (visible && !frame) frame = requestAnimationFrame(tick);
  };

  start();

  stopRender = () => {
    cancelled = true;
    cancelAnimationFrame(frame);
    cancelAnimationFrame(resizeFrame);
    clearTimeout(clickTimer);
    observer?.disconnect();
    canvas.removeEventListener('pointermove', handlePointerMove);
    canvas.removeEventListener('pointerdown', handlePointerMove);
    canvas.removeEventListener('pointerup', handlePointerUp);
    canvas.removeEventListener('pointerleave', handlePointerLeave);
    canvas.removeEventListener('pointercancel', handlePointerLeave);
    canvas.removeEventListener('click', handleClick);
    window.removeEventListener('resize', handleResize);
  };
};

onMounted(() => {
  startGlitch();
  startRender();
});

watch([() => props.glitchMode, () => props.glitchInterval, () => props.glitchDuration], startGlitch);

watch(
  [
    text,
    () => props.fontSize,
    () => props.fontWeight,
    () => props.fontFamily,
    () => props.color,
    gradientKey,
    () => props.letterSpacing,
    () => props.fuzzRange,
    () => props.direction,
    splitOn
  ],
  startRender
);

onBeforeUnmount(() => {
  stopGlitch?.();
  stopGlitch = null;
  stopRender?.();
  stopRender = null;
});
</script>
