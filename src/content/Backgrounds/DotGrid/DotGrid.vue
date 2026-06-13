<template>
  <section :class="`flex items-center justify-center h-full w-full relative ${className}`" :style="style">
    <div ref="wrapperRef" class="relative w-full h-full">
      <canvas ref="canvasRef" class="absolute inset-0 w-full h-full pointer-events-none" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { gsap } from 'gsap';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
import { computed, nextTick, onMounted, onUnmounted, ref, useTemplateRef, watch, type CSSProperties } from 'vue';

gsap.registerPlugin(InertiaPlugin);

const throttle = <T extends unknown[]>(func: (...args: T) => void, limit: number) => {
  let lastCall = 0;
  return function (this: unknown, ...args: T) {
    const now = performance.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      func.apply(this, args);
    }
  };
};

interface Dot {
  cx: number;
  cy: number;
  xOffset: number;
  yOffset: number;
  _inertiaApplied: boolean;
}

export interface DotGridProps {
  dotSize?: number;
  gap?: number;
  baseColor?: string;
  activeColor?: string;
  proximity?: number;
  speedTrigger?: number;
  shockRadius?: number;
  shockStrength?: number;
  maxSpeed?: number;
  resistance?: number;
  returnDuration?: number;
  className?: string;
  style?: CSSProperties;
}

const props = withDefaults(defineProps<DotGridProps>(), {
  dotSize: 16,
  gap: 32,
  baseColor: '#27FF64',
  activeColor: '#27FF64',
  proximity: 150,
  speedTrigger: 100,
  shockRadius: 250,
  shockStrength: 5,
  maxSpeed: 5000,
  resistance: 750,
  returnDuration: 1.5,
  className: '',
  style: () => ({})
});

const wrapperRef = useTemplateRef<HTMLDivElement>('wrapperRef');
const canvasRef = useTemplateRef<HTMLCanvasElement>('canvasRef');
const dots = ref<Dot[]>([]);
const pointer = ref({
  x: 0,
  y: 0,
  vx: 0,
  vy: 0,
  speed: 0,
  lastTime: 0,
  lastX: 0,
  lastY: 0
});

function hexToRgb(hex: string) {
  const m = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (!m) return { r: 0, g: 0, b: 0 };
  return {
    r: parseInt(m[1], 16),
    g: parseInt(m[2], 16),
    b: parseInt(m[3], 16)
  };
}

const baseRgb = computed(() => hexToRgb(props.baseColor));
const activeRgb = computed(() => hexToRgb(props.activeColor));

const circlePath = computed(() => {
  if (typeof window === 'undefined' || !window.Path2D) return null;

  const p = new Path2D();
  p.arc(0, 0, props.dotSize / 2, 0, Math.PI * 2);
  return p;
});

const buildGrid = () => {
  const wrap = wrapperRef.value;
  const canvas = canvasRef.value;
  if (!wrap || !canvas) return;

  const { width, height } = wrap.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;

  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  const ctx = canvas.getContext('2d');
  if (ctx) ctx.scale(dpr, dpr);

  const cols = Math.floor((width + props.gap) / (props.dotSize + props.gap));
  const rows = Math.floor((height + props.gap) / (props.dotSize + props.gap));
  const cell = props.dotSize + props.gap;

  const gridW = cell * cols - props.gap;
  const gridH = cell * rows - props.gap;

  const extraX = width - gridW;
  const extraY = height - gridH;

  const startX = extraX / 2 + props.dotSize / 2;
  const startY = extraY / 2 + props.dotSize / 2;

  const newDots: Dot[] = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const cx = startX + x * cell;
      const cy = startY + y * cell;
      newDots.push({ cx, cy, xOffset: 0, yOffset: 0, _inertiaApplied: false });
    }
  }
  dots.value = newDots;
};

let rafId: number;
let resizeObserver: ResizeObserver | null = null;

const draw = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const { x: px, y: py } = pointer.value;
  const proxSq = props.proximity * props.proximity;

  for (const dot of dots.value) {
    const ox = dot.cx + dot.xOffset;
    const oy = dot.cy + dot.yOffset;
    const dx = dot.cx - px;
    const dy = dot.cy - py;
    const dsq = dx * dx + dy * dy;

    let style = props.baseColor;
    if (dsq <= proxSq) {
      const dist = Math.sqrt(dsq);
      const t = 1 - dist / props.proximity;
      const r = Math.round(baseRgb.value.r + (activeRgb.value.r - baseRgb.value.r) * t);
      const g = Math.round(baseRgb.value.g + (activeRgb.value.g - baseRgb.value.g) * t);
      const b = Math.round(baseRgb.value.b + (activeRgb.value.b - baseRgb.value.b) * t);
      style = `rgb(${r},${g},${b})`;
    }

    if (circlePath.value) {
      ctx.save();
      ctx.translate(ox, oy);
      ctx.fillStyle = style;
      ctx.fill(circlePath.value);
      ctx.restore();
    }
  }

  rafId = requestAnimationFrame(draw);
};

const onMove = (e: MouseEvent) => {
  const now = performance.now();
  const pr = pointer.value;
  const dt = pr.lastTime ? now - pr.lastTime : 16;
  const dx = e.clientX - pr.lastX;
  const dy = e.clientY - pr.lastY;
  let vx = (dx / dt) * 1000;
  let vy = (dy / dt) * 1000;
  let speed = Math.hypot(vx, vy);
  if (speed > props.maxSpeed) {
    const scale = props.maxSpeed / speed;
    vx *= scale;
    vy *= scale;
    speed = props.maxSpeed;
  }
  pr.lastTime = now;
  pr.lastX = e.clientX;
  pr.lastY = e.clientY;
  pr.vx = vx;
  pr.vy = vy;
  pr.speed = speed;

  const canvas = canvasRef.value;
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  pr.x = e.clientX - rect.left;
  pr.y = e.clientY - rect.top;

  for (const dot of dots.value) {
    const dist = Math.hypot(dot.cx - pr.x, dot.cy - pr.y);
    if (speed > props.speedTrigger && dist < props.proximity && !dot._inertiaApplied) {
      dot._inertiaApplied = true;
      gsap.killTweensOf(dot);
      const pushX = dot.cx - pr.x + vx * 0.005;
      const pushY = dot.cy - pr.y + vy * 0.005;
      gsap.to(dot, {
        inertia: { xOffset: pushX, yOffset: pushY, resistance: props.resistance },
        onComplete: () => {
          gsap.to(dot, {
            xOffset: 0,
            yOffset: 0,
            duration: props.returnDuration,
            ease: 'elastic.out(1,0.75)'
          });
          dot._inertiaApplied = false;
        }
      });
    }
  }
};

const onClick = (e: MouseEvent) => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  const cx = e.clientX - rect.left;
  const cy = e.clientY - rect.top;
  for (const dot of dots.value) {
    const dist = Math.hypot(dot.cx - cx, dot.cy - cy);
    if (dist < props.shockRadius && !dot._inertiaApplied) {
      dot._inertiaApplied = true;
      gsap.killTweensOf(dot);
      const falloff = Math.max(0, 1 - dist / props.shockRadius);
      const pushX = (dot.cx - cx) * props.shockStrength * falloff;
      const pushY = (dot.cy - cy) * props.shockStrength * falloff;
      gsap.to(dot, {
        inertia: { xOffset: pushX, yOffset: pushY, resistance: props.resistance },
        onComplete: () => {
          gsap.to(dot, {
            xOffset: 0,
            yOffset: 0,
            duration: props.returnDuration,
            ease: 'elastic.out(1,0.75)'
          });
          dot._inertiaApplied = false;
        }
      });
    }
  }
};

const throttledMove = throttle(onMove, 50);

onMounted(async () => {
  await nextTick();

  buildGrid();

  if (circlePath.value) {
    draw();
  }

  if ('ResizeObserver' in window) {
    resizeObserver = new ResizeObserver(buildGrid);
    if (wrapperRef.value) {
      resizeObserver.observe(wrapperRef.value);
    }
  } else {
    (window as Window).addEventListener('resize', buildGrid);
  }

  window.addEventListener('mousemove', throttledMove, { passive: true });
  window.addEventListener('click', onClick);
});

onUnmounted(() => {
  if (rafId) {
    cancelAnimationFrame(rafId);
  }

  if (resizeObserver) {
    resizeObserver.disconnect();
  } else {
    window.removeEventListener('resize', buildGrid);
  }

  window.removeEventListener('mousemove', throttledMove);
  window.removeEventListener('click', onClick);
});

watch([() => props.dotSize, () => props.gap], () => {
  buildGrid();
});

watch([() => props.proximity, () => props.baseColor, activeRgb, baseRgb, circlePath], () => {
  if (rafId) {
    cancelAnimationFrame(rafId);
  }
  if (circlePath.value) {
    draw();
  }
});
</script>
