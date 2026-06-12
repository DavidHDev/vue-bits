<template>
  <div class="relative w-full h-full">
    <canvas
      ref="canvasRef"
      :style="{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%'
      }"
    />
    <svg
      ref="svgRef"
      :style="{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none'
      }"
    >
      <defs>
        <radialGradient :id="glowId">
          <stop offset="0%" :stop-color="glowColor" />
          <stop offset="100%" stop-color="transparent" />
        </radialGradient>
      </defs>
      <circle
        ref="glowRef"
        cx="-9999"
        cy="-9999"
        :r="glowRadius"
        :fill="`url(#${glowId})`"
        :style="{ opacity: 0, willChange: 'opacity' }"
      />
    </svg>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, useTemplateRef, watch } from 'vue';

interface Dot {
  ax: number;
  ay: number;
  sx: number;
  sy: number;
  vx: number;
  vy: number;
  x: number;
  y: number;
}

interface DotFieldProps {
  dotRadius?: number;
  dotSpacing?: number;
  cursorRadius?: number;
  cursorForce?: number;
  bulgeOnly?: boolean;
  bulgeStrength?: number;
  glowRadius?: number;
  sparkle?: boolean;
  waveAmplitude?: number;
  gradientFrom?: string;
  gradientTo?: string;
  glowColor?: string;
}

const props = withDefaults(defineProps<DotFieldProps>(), {
  dotRadius: 1.5,
  dotSpacing: 14,
  cursorRadius: 500,
  cursorForce: 0.1,
  bulgeOnly: true,
  bulgeStrength: 67,
  glowRadius: 160,
  sparkle: false,
  waveAmplitude: 0,
  gradientFrom: 'rgba(168, 85, 247, 0.35)',
  gradientTo: 'rgba(180, 151, 207, 0.25)',
  glowColor: '#120F17'
});

const TWO_PI = Math.PI * 2;

const canvasRef = useTemplateRef<HTMLCanvasElement>('canvasRef');
const svgRef = useTemplateRef<SVGSVGElement>('svgRef');
const glowRef = useTemplateRef<SVGCircleElement>('glowRef');
const glowId = `dot-field-glow-${Math.random().toString(36).slice(2, 9)}`;

let dots: Dot[] = [];
const mouse = { x: -9999, y: -9999, prevX: -9999, prevY: -9999, speed: 0 };
const size = { w: 0, h: 0, offsetX: 0, offsetY: 0 };
let glowOpacity = 0;
let engagement = 0;
let rafId: number | null = null;
let speedInterval: ReturnType<typeof setInterval> | null = null;
let resizeTimer: ReturnType<typeof setTimeout> | null = null;
let ctx: CanvasRenderingContext2D | null = null;

const buildDots = (w: number, h: number) => {
  const step = props.dotRadius + props.dotSpacing;
  const cols = Math.floor(w / step);
  const rows = Math.floor(h / step);
  const padX = (w % step) / 2;
  const padY = (h % step) / 2;
  const next: Dot[] = new Array(rows * cols);
  let idx = 0;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const ax = padX + col * step + step / 2;
      const ay = padY + row * step + step / 2;
      next[idx++] = { ax, ay, sx: ax, sy: ay, vx: 0, vy: 0, x: ax, y: ay };
    }
  }
  dots = next;
};

const doResize = () => {
  const canvas = canvasRef.value;
  if (!canvas || !ctx) return;
  const parent = canvas.parentElement;
  if (!parent) return;

  const rect = parent.getBoundingClientRect();
  const w = rect.width;
  const h = rect.height;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  canvas.width = w * dpr;
  canvas.height = h * dpr;
  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  size.w = w;
  size.h = h;
  size.offsetX = rect.left + window.scrollX;
  size.offsetY = rect.top + window.scrollY;

  buildDots(w, h);
};

const resize = () => {
  if (resizeTimer) clearTimeout(resizeTimer);
  resizeTimer = setTimeout(doResize, 100);
};

const onMouseMove = (e: MouseEvent) => {
  mouse.x = e.pageX - size.offsetX;
  mouse.y = e.pageY - size.offsetY;
};

const updateMouseSpeed = () => {
  const dx = mouse.prevX - mouse.x;
  const dy = mouse.prevY - mouse.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  mouse.speed += (dist - mouse.speed) * 0.5;
  if (mouse.speed < 0.001) mouse.speed = 0;
  mouse.prevX = mouse.x;
  mouse.prevY = mouse.y;
};

let frameCount = 0;

const tick = () => {
  if (!ctx) return;
  frameCount++;
  const len = dots.length;
  const t = frameCount * 0.02;

  const targetEngagement = Math.min(mouse.speed / 5, 1);
  engagement += (targetEngagement - engagement) * 0.06;
  if (engagement < 0.001) engagement = 0;
  const eng = engagement;

  glowOpacity += (eng - glowOpacity) * 0.08;

  if (glowRef.value) {
    glowRef.value.setAttribute('cx', String(mouse.x));
    glowRef.value.setAttribute('cy', String(mouse.y));
    glowRef.value.style.opacity = String(glowOpacity);
  }

  ctx.clearRect(0, 0, size.w, size.h);

  const grad = ctx.createLinearGradient(0, 0, size.w, size.h);
  grad.addColorStop(0, props.gradientFrom);
  grad.addColorStop(1, props.gradientTo);
  ctx.fillStyle = grad;

  const cr = props.cursorRadius;
  const crSq = cr * cr;
  const rad = props.dotRadius / 2;
  const isBulge = props.bulgeOnly;

  ctx.beginPath();

  for (let i = 0; i < len; i++) {
    const d = dots[i];
    const dx = mouse.x - d.ax;
    const dy = mouse.y - d.ay;
    const distSq = dx * dx + dy * dy;

    if (distSq < crSq && eng > 0.01) {
      const dist = Math.sqrt(distSq);
      if (isBulge) {
        const tt = 1 - dist / cr;
        const push = tt * tt * props.bulgeStrength * eng;
        const angle = Math.atan2(dy, dx);
        d.sx += (d.ax - Math.cos(angle) * push - d.sx) * 0.15;
        d.sy += (d.ay - Math.sin(angle) * push - d.sy) * 0.15;
      } else {
        const angle = Math.atan2(dy, dx);
        const move = (500 / dist) * (mouse.speed * props.cursorForce);
        d.vx += Math.cos(angle) * -move;
        d.vy += Math.sin(angle) * -move;
      }
    } else if (isBulge) {
      d.sx += (d.ax - d.sx) * 0.1;
      d.sy += (d.ay - d.sy) * 0.1;
    }

    if (!isBulge) {
      d.vx *= 0.9;
      d.vy *= 0.9;
      d.x = d.ax + d.vx;
      d.y = d.ay + d.vy;
      d.sx += (d.x - d.sx) * 0.1;
      d.sy += (d.y - d.sy) * 0.1;
    }

    let drawX = d.sx;
    let drawY = d.sy;
    if (props.waveAmplitude > 0) {
      drawY += Math.sin(d.ax * 0.03 + t) * props.waveAmplitude;
      drawX += Math.cos(d.ay * 0.03 + t * 0.7) * props.waveAmplitude * 0.5;
    }

    if (props.sparkle) {
      const hash = ((i * 2654435761) ^ (frameCount >> 3)) >>> 0;
      if (hash % 100 < 3) {
        ctx.moveTo(drawX + rad * 1.8, drawY);
        ctx.arc(drawX, drawY, rad * 1.8, 0, TWO_PI);
      } else {
        ctx.moveTo(drawX + rad, drawY);
        ctx.arc(drawX, drawY, rad, 0, TWO_PI);
      }
    } else {
      ctx.moveTo(drawX + rad, drawY);
      ctx.arc(drawX, drawY, rad, 0, TWO_PI);
    }
  }

  ctx.fill();

  rafId = requestAnimationFrame(tick);
};

onMounted(() => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  doResize();
  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', onMouseMove, { passive: true });
  speedInterval = setInterval(updateMouseSpeed, 20);
  rafId = requestAnimationFrame(tick);
});

onUnmounted(() => {
  if (rafId !== null) cancelAnimationFrame(rafId);
  if (speedInterval !== null) clearInterval(speedInterval);
  if (resizeTimer !== null) clearTimeout(resizeTimer);
  window.removeEventListener('resize', resize);
  window.removeEventListener('mousemove', onMouseMove);
});

watch([() => props.dotRadius, () => props.dotSpacing], () => {
  if (size.w > 0 && size.h > 0) buildDots(size.w, size.h);
});
</script>
