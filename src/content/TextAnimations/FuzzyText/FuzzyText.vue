<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, useSlots, useTemplateRef, watch } from 'vue';

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
  direction?: 'horizontal' | 'vertical' | 'both';
  transitionDuration?: number;
  clickEffect?: boolean;
  glitchMode?: boolean;
  glitchInterval?: number;
  glitchDuration?: number;
  gradient?: string[] | null;
  letterSpacing?: number;
  className?: string;
}

const props = withDefaults(defineProps<FuzzyTextProps>(), {
  fontSize: 'clamp(2rem, 8vw, 8rem)',
  fontWeight: 900,
  fontFamily: 'inherit',
  color: '#fff',
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
  className: ''
});

const canvasRef = useTemplateRef<HTMLCanvasElement & { cleanupFuzzyText?: () => void }>('canvasRef');
const slots = useSlots();

let animationFrameId: number;
let glitchTimeoutId: ReturnType<typeof setTimeout>;
let glitchEndTimeoutId: ReturnType<typeof setTimeout>;
let clickTimeoutId: ReturnType<typeof setTimeout>;
let cancelled = false;

const text = computed(() => (slots.default?.() ?? []).map(v => v.children).join(''));

const init = async () => {
  const canvas = canvasRef.value;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const computedFontFamily =
    props.fontFamily === 'inherit' ? window.getComputedStyle(canvas).fontFamily || 'sans-serif' : props.fontFamily;

  const fontSizeStr = typeof props.fontSize === 'number' ? `${props.fontSize}px` : props.fontSize;

  const fontString = `${props.fontWeight} ${fontSizeStr} ${computedFontFamily}`;

  try {
    await document.fonts.load(fontString);
  } catch {
    await document.fonts.ready;
  }

  if (cancelled) return;

  let numericFontSize: number;
  if (typeof props.fontSize === 'number') {
    numericFontSize = props.fontSize;
  } else {
    const temp = document.createElement('span');
    temp.style.fontSize = props.fontSize;
    document.body.appendChild(temp);
    numericFontSize = parseFloat(getComputedStyle(temp).fontSize);
    document.body.removeChild(temp);
  }

  const offscreen = document.createElement('canvas');
  const offCtx = offscreen.getContext('2d')!;
  offCtx.font = fontString;
  offCtx.textBaseline = 'alphabetic';

  let totalWidth = 0;
  if (props.letterSpacing !== 0) {
    for (const char of text.value) {
      totalWidth += offCtx.measureText(char).width + props.letterSpacing;
    }
    totalWidth -= props.letterSpacing;
  } else {
    totalWidth = offCtx.measureText(text.value).width;
  }

  const metrics = offCtx.measureText(text.value);
  const ascent = metrics.actualBoundingBoxAscent ?? numericFontSize;
  const descent = metrics.actualBoundingBoxDescent ?? numericFontSize * 0.2;
  const height = Math.ceil(ascent + descent);

  offscreen.width = Math.ceil(totalWidth) + 20;
  offscreen.height = height;

  offCtx.font = fontString;
  offCtx.textBaseline = 'alphabetic';

  if (props.gradient && props.gradient.length >= 2) {
    const grad = offCtx.createLinearGradient(0, 0, offscreen.width, 0);
    props.gradient.forEach((c, i) => grad.addColorStop(i / (props.gradient!.length - 1), c));
    offCtx.fillStyle = grad;
  } else {
    offCtx.fillStyle = props.color;
  }

  let x = 10;
  for (const char of text.value) {
    offCtx.fillText(char, x, ascent);
    x += offCtx.measureText(char).width + props.letterSpacing;
  }

  const marginX = props.fuzzRange + 20;
  const marginY = props.direction === 'vertical' || props.direction === 'both' ? props.fuzzRange + 10 : 0;

  canvas.width = offscreen.width + marginX * 2;
  canvas.height = offscreen.height + marginY * 2;
  ctx.translate(marginX, marginY);

  let isHovering = false;
  let isClicking = false;
  let isGlitching = false;
  let currentIntensity = props.baseIntensity;
  let targetIntensity = props.baseIntensity;
  let lastFrameTime = 0;
  const frameDuration = 1000 / props.fps;

  const startGlitch = () => {
    if (!props.glitchMode || cancelled) return;
    glitchTimeoutId = setTimeout(() => {
      isGlitching = true;
      glitchEndTimeoutId = setTimeout(() => {
        isGlitching = false;
        startGlitch();
      }, props.glitchDuration);
    }, props.glitchInterval);
  };

  if (props.glitchMode) startGlitch();

  const run = (ts: number) => {
    if (cancelled) return;

    if (ts - lastFrameTime < frameDuration) {
      animationFrameId = requestAnimationFrame(run);
      return;
    }

    lastFrameTime = ts;
    ctx.clearRect(-marginX, -marginY, offscreen.width + marginX * 2, offscreen.height + marginY * 2);

    targetIntensity = isClicking || isGlitching ? 1 : isHovering ? props.hoverIntensity : props.baseIntensity;

    if (props.transitionDuration > 0) {
      const step = 1 / (props.transitionDuration / frameDuration);
      currentIntensity += Math.sign(targetIntensity - currentIntensity) * step;
      currentIntensity = Math.min(
        Math.max(currentIntensity, Math.min(targetIntensity, currentIntensity)),
        Math.max(targetIntensity, currentIntensity)
      );
    } else {
      currentIntensity = targetIntensity;
    }

    for (let y = 0; y < offscreen.height; y++) {
      const dx = props.direction !== 'vertical' ? (Math.random() - 0.5) * currentIntensity * props.fuzzRange : 0;
      const dy =
        props.direction !== 'horizontal' ? (Math.random() - 0.5) * currentIntensity * props.fuzzRange * 0.5 : 0;

      ctx.drawImage(offscreen, 0, y, offscreen.width, 1, dx, y + dy, offscreen.width, 1);
    }

    animationFrameId = requestAnimationFrame(run);
  };

  animationFrameId = requestAnimationFrame(run);

  const rectCheck = (x: number, y: number) =>
    x >= marginX && x <= marginX + offscreen.width && y >= marginY && y <= marginY + offscreen.height;

  const mouseMove = (e: MouseEvent) => {
    if (!props.enableHover) return;
    const rect = canvas.getBoundingClientRect();
    isHovering = rectCheck(e.clientX - rect.left, e.clientY - rect.top);
  };

  const mouseLeave = () => (isHovering = false);

  const click = () => {
    if (!props.clickEffect) return;
    isClicking = true;
    clearTimeout(clickTimeoutId);
    clickTimeoutId = setTimeout(() => (isClicking = false), 150);
  };

  if (props.enableHover) {
    canvas.addEventListener('mousemove', mouseMove);
    canvas.addEventListener('mouseleave', mouseLeave);
  }

  if (props.clickEffect) {
    canvas.addEventListener('click', click);
  }

  onBeforeUnmount(() => {
    cancelled = true;
    cancelAnimationFrame(animationFrameId);
    clearTimeout(glitchTimeoutId);
    clearTimeout(glitchEndTimeoutId);
    clearTimeout(clickTimeoutId);
    canvas.removeEventListener('mousemove', mouseMove);
    canvas.removeEventListener('mouseleave', mouseLeave);
    canvas.removeEventListener('click', click);
  });
};

onMounted(init);

watch(
  () => ({ ...props, text: text.value }),
  () => {
    cancelled = true;
    cancelAnimationFrame(animationFrameId);
    cancelled = false;
    init();
  }
);
</script>

<template>
  <canvas ref="canvasRef" :class="className" />
</template>
