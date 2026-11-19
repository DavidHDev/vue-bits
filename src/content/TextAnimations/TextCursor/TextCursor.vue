<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch, type CSSProperties } from 'vue';

type Mode = 'stamp' | 'chain' | 'ribbon';

interface TextCursorProps {
  text?: string;
  mode?: Mode;
  spacing?: number;
  maxPoints?: number;
  followMouseDirection?: boolean;
  randomFloat?: boolean;
  exitDuration?: number;
  removalInterval?: number;
  shrink?: number;
  fade?: number;
  smoothing?: number;
  popIn?: boolean;
  keepUpright?: boolean;
  hideCursor?: boolean;
  color?: string;
  fontSize?: number;
  fontWeight?: number | string;
  fontFamily?: string;
  className?: string;
  style?: CSSProperties;
}

interface PathPoint {
  x: number;
  y: number;
  s: number;
}

interface Stamp {
  element: HTMLSpanElement;
  x: number;
  y: number;
  s: number;
  angle: number;
  born: number;
  died: number;
  seed: number;
}

const props = withDefaults(defineProps<TextCursorProps>(), {
  text: 'Hello',
  mode: 'stamp',
  spacing: 88,
  maxPoints: 7,
  followMouseDirection: true,
  randomFloat: true,
  exitDuration: 0.5,
  removalInterval: 30,
  shrink: 0.5,
  fade: 0.6,
  smoothing: 0.3,
  popIn: true,
  keepUpright: true,
  hideCursor: false,
  color: 'currentColor',
  fontSize: 28,
  fontWeight: 600,
  fontFamily: 'inherit',
  className: ''
});

const smootherstep = (t: number) => {
  const x = Math.min(1, Math.max(0, t));
  return x * x * x * (x * (x * 6 - 15) + 10);
};

const backOut = (t: number) => {
  const x = Math.min(1, Math.max(0, t)) - 1;
  return 1 + x * x * (2.6 * x + 1.6);
};

type SegmenterIntl = typeof Intl & {
  Segmenter?: new (
    locales?: string | string[],
    options?: { granularity: 'grapheme' | 'word' | 'sentence' }
  ) => { segment: (value: string) => Iterable<{ segment: string }> };
};

const graphemes = (value: string): string[] => {
  const intl = typeof Intl !== 'undefined' ? (Intl as SegmenterIntl) : undefined;
  if (intl?.Segmenter) {
    return Array.from(new intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(value), part => part.segment);
  }
  return Array.from(value);
};

const rootRef = ref<HTMLDivElement | null>(null);
const layerRef = ref<HTMLDivElement | null>(null);

const layout = computed(() =>
  props.mode === 'ribbon'
    ? `${props.spacing}|${props.fontSize}|${props.fontWeight}|${props.fontFamily}`
    : props.mode === 'chain'
      ? props.maxPoints
      : 0
);

const rootStyle = computed<CSSProperties>(() => ({
  cursor: props.hideCursor ? 'none' : undefined,
  ...(props.style || {})
}));

const layerStyle = computed<CSSProperties>(() => ({
  color: props.color,
  fontSize: typeof props.fontSize === 'number' ? `${props.fontSize}px` : props.fontSize,
  fontWeight: props.fontWeight,
  fontFamily: props.fontFamily
}));

let cleanup: (() => void) | null = null;

const start = () => {
  const root = rootRef.value;
  const layer = layerRef.value;
  if (!root || !layer) return;

  const s = props;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ribbon = props.mode === 'ribbon';
  const chain = props.mode === 'chain';
  const text = props.text;
  const glyphs = ribbon ? graphemes(text) : [];
  const pool: HTMLSpanElement[] = [];
  const stamps: Stamp[] = [];
  const path: PathPoint[] = [];
  const head = { x: 0, y: 0, tx: 0, ty: 0, s: 0, live: false, inside: false };
  let advances: number[] = [];
  let ribbonLength = 0;
  let ribbonSpan = 0;
  let cut = 0;
  let nextStamp = 0;
  let lastMove = 0;
  let raf = 0;
  let last = 0;
  let clock = 0;
  let disposed = false;

  const take = (content: string) => {
    const element = pool.pop() || document.createElement('span');
    element.className = 'text-cursor__item';
    element.textContent = content;
    element.style.opacity = '0';
    layer.appendChild(element);
    return element;
  };

  const release = (element: HTMLSpanElement) => {
    element.remove();
    pool.push(element);
  };

  const links: HTMLSpanElement[] = [];
  if (ribbon) {
    for (const glyph of glyphs) links.push(take(glyph));
  } else if (chain) {
    for (let i = 0; i < Math.max(1, s.maxPoints); i++) links.push(take(text));
  }

  const measure = () => {
    if (!ribbon) return;
    const gap = Math.max(0, s.spacing);
    advances = links.map(element => element.offsetWidth + gap);
    ribbonLength = advances.reduce((sum, width) => sum + width, 0);
  };

  const reach = () => {
    if (ribbon) return ribbonSpan + (advances.length ? ribbonLength / advances.length : 0);
    return Math.max(1, s.maxPoints) * Math.max(4, s.spacing);
  };

  const point = (target: number) => {
    if (!path.length) return { x: head.x, y: head.y };
    if (target >= head.s) return { x: head.x, y: head.y };
    if (target <= path[0].s) return { x: path[0].x, y: path[0].y };
    let low = 0;
    let high = path.length - 1;
    while (high - low > 1) {
      const mid = (low + high) >> 1;
      if (path[mid].s <= target) low = mid;
      else high = mid;
    }
    const a = path[low];
    const b = path[high];
    const t = b.s > a.s ? (target - a.s) / (b.s - a.s) : 0;
    return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
  };

  const heading = (target: number): number => {
    const window = Math.max(6, s.spacing * 0.5);
    const ahead = point(Math.min(head.s, target + window));
    const behind = point(target - window);
    const dx = ahead.x - behind.x;
    const dy = ahead.y - behind.y;
    return dx * dx + dy * dy > 0.01 ? Math.atan2(dy, dx) : 0;
  };

  const sample = (distance: number) => {
    const target = head.s - distance;
    if (path.length < 2 || target >= head.s) return { x: head.x, y: head.y, angle: heading(head.s) };
    let low = 0;
    let high = path.length - 1;
    while (high - low > 1) {
      const mid = (low + high) >> 1;
      if (path[mid].s <= target) low = mid;
      else high = mid;
    }
    const a = path[low];
    const b = path[high];
    const t = b.s > a.s ? Math.min(1, Math.max(0, (target - a.s) / (b.s - a.s))) : 0;
    return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, angle: heading(target) };
  };

  const record = () => {
    const tail = path[path.length - 1];
    const dx = head.x - (tail ? tail.x : head.x);
    const dy = head.y - (tail ? tail.y : head.y);
    const step = Math.hypot(dx, dy);
    if (!tail) {
      path.push({ x: head.x, y: head.y, s: head.s });
      return;
    }
    if (step < 0.5) return;
    head.s += step;
    path.push({ x: head.x, y: head.y, s: head.s });
    const keep = head.s - reach() - Math.max(40, s.spacing * 2);
    let drop = 0;
    while (drop < path.length - 2 && path[drop + 1].s < keep) drop += 1;
    if (drop) path.splice(0, drop);
  };

  const place = (element: HTMLSpanElement, x: number, y: number, angle: number, scale: number, opacity: number) => {
    element.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) translate(-50%, -50%) rotate(${angle.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
    element.style.opacity = opacity.toFixed(3);
  };

  const frame = (now: number) => {
    raf = 0;
    const dt = Math.min(0.05, (now - last) / 1000 || 0);
    last = now;
    clock += dt;
    const spacingNow = Math.max(4, s.spacing);
    const tau = Math.max(0, s.smoothing) * 0.12;
    if (head.live) {
      const k = tau > 0 ? 1 - Math.exp(-dt / tau) : 1;
      head.x += (head.tx - head.x) * k;
      head.y += (head.ty - head.y) * k;
      record();
    }
    const idle = !head.inside || now - lastMove > 100;
    if (ribbon) {
      let span = 0;
      for (let order = 0; order < links.length; order++) {
        span += (advances[links.length - 1 - order] || 0) * (1 - s.shrink * (span / Math.max(1, ribbonLength)));
      }
      ribbonSpan = span;
    }
    const extent = reach();
    cut = Math.max(cut, head.s - extent);
    if (idle && head.live) {
      const unit = ribbon && advances.length ? ribbonLength / advances.length : spacingNow;
      cut += (unit / Math.max(0.005, s.removalInterval / 1000)) * dt;
    }
    if (cut >= head.s && !head.inside) head.live = false;
    cut = Math.min(cut, head.s);
    const float = s.randomFloat && !reduced;
    const enter = s.popIn && !reduced;
    let busy = head.live && (!idle || cut < head.s);

    if (!ribbon && !chain) {
      while (head.live && nextStamp <= head.s) {
        if (nextStamp >= cut) {
          const spot = point(nextStamp);
          let angle = s.followMouseDirection ? (heading(nextStamp) * 180) / Math.PI : 0;
          if (s.keepUpright && Math.abs(angle) > 90) angle -= Math.sign(angle) * 180;
          stamps.push({
            element: take(text),
            x: spot.x,
            y: spot.y,
            s: nextStamp,
            angle,
            born: now,
            died: 0,
            seed: Math.random() * Math.PI * 2
          });
        }
        nextStamp += spacingNow;
      }
      const count = Math.max(1, s.maxPoints);
      let alive = 0;
      for (let i = stamps.length - 1; i >= 0; i--) {
        const stamp = stamps[i];
        if (!stamp.died && (stamp.s < cut || alive >= count)) stamp.died = now;
        if (!stamp.died) alive += 1;
      }
      let order = 0;
      for (let i = stamps.length - 1; i >= 0; i--) {
        const stamp = stamps[i];
        const age = (now - stamp.born) / 1000;
        const rank = Math.min(1, order / Math.max(1, count - 1));
        if (!stamp.died) order += 1;
        let scale = (1 - s.shrink * rank) * (enter ? backOut(age / 0.42) : 1);
        let opacity = (1 - s.fade * rank) * (enter ? smootherstep(age / 0.12) : 1);
        if (stamp.died) {
          const gone = (now - stamp.died) / 1000 / Math.max(0.05, s.exitDuration);
          if (gone >= 1) {
            release(stamp.element);
            stamps.splice(i, 1);
            continue;
          }
          const ease = smootherstep(gone);
          scale *= 1 - 0.55 * ease;
          opacity *= 1 - ease;
        }
        let x = stamp.x;
        let y = stamp.y;
        let angle = stamp.angle;
        if (float) {
          const sway = smootherstep(age / 0.6) * s.fontSize * 0.14;
          x += Math.sin(clock * 1.3 + stamp.seed) * sway;
          y += Math.cos(clock * 1.1 + stamp.seed * 1.7) * sway;
          angle += Math.sin(clock * 0.9 + stamp.seed * 2.3) * 6 * smootherstep(age / 0.6);
        }
        place(stamp.element, x, y, angle, Math.max(0, scale), Math.max(0, opacity));
      }
      if (stamps.length) busy = true;
    } else {
      let distance = 0;
      for (let order = 0; order < links.length; order++) {
        const index = ribbon ? links.length - 1 - order : order;
        const element = links[index];
        const rank = ribbon ? distance / Math.max(1, ribbonLength) : order / Math.max(1, links.length - 1);
        const width = ribbon ? (advances[index] || 0) * (1 - s.shrink * rank) : spacingNow;
        const offset = ribbon ? distance + width / 2 : order * spacingNow;
        distance += width;
        const along = head.s - offset;
        const shown = head.live ? smootherstep((along - cut) / Math.max(4, ribbon ? width : spacingNow)) : 0;
        if (shown <= 0.001) {
          element.style.opacity = '0';
          continue;
        }
        const spot = sample(offset);
        let x = spot.x;
        let y = spot.y;
        if (float) {
          const wave = Math.sin(along / Math.max(30, s.fontSize * 2.2) - clock * 3.2) * s.fontSize * 0.12;
          x += -Math.sin(spot.angle) * wave;
          y += Math.cos(spot.angle) * wave;
        }
        const angle = s.followMouseDirection ? (spot.angle * 180) / Math.PI : 0;
        const scale = (1 - s.shrink * rank) * (enter ? backOut(shown) : shown);
        const opacity = (1 - s.fade * rank) * Math.min(1, shown * 1.6);
        place(element, x, y, angle, Math.max(0, scale), Math.max(0, opacity));
      }
      if (head.live) busy = true;
    }

    if (!head.live && !stamps.length) {
      path.length = 0;
      head.s = 0;
      cut = 0;
      nextStamp = 0;
    }
    if (busy || (float && stamps.length)) raf = requestAnimationFrame(frame);
  };

  const wake = () => {
    if (raf) return;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  };

  measure();
  document.fonts?.ready.then(() => {
    if (disposed) return;
    measure();
    wake();
  });

  const onMove = (event: PointerEvent) => {
    const rect = root.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    if (!head.live) {
      head.s = 0;
      path.length = 0;
      cut = 0;
      nextStamp = 0;
    } else if (!head.inside) {
      path.push({ x, y, s: head.s });
      cut = head.s;
      nextStamp = head.s;
    }
    if (!head.live || !head.inside) {
      head.x = x;
      head.y = y;
      head.live = true;
    }
    head.tx = x;
    head.ty = y;
    head.inside = true;
    lastMove = performance.now();
    wake();
  };

  const onLeave = () => {
    head.inside = false;
    wake();
  };

  root.addEventListener('pointermove', onMove);
  root.addEventListener('pointerdown', onMove);
  root.addEventListener('pointerleave', onLeave);

  cleanup = () => {
    disposed = true;
    cancelAnimationFrame(raf);
    root.removeEventListener('pointermove', onMove);
    root.removeEventListener('pointerdown', onMove);
    root.removeEventListener('pointerleave', onLeave);
    layer.replaceChildren();
  };
};

const stop = () => {
  cleanup?.();
  cleanup = null;
};

onMounted(start);

watch(
  () => [props.mode, props.text, layout.value],
  () => {
    stop();
    start();
  },
  { flush: 'post' }
);

onBeforeUnmount(stop);
</script>

<template>
  <div ref="rootRef" :class="`text-cursor ${className}`.trim()" :style="rootStyle">
    <div ref="layerRef" class="text-cursor__layer" aria-hidden="true" :style="layerStyle" />
  </div>
</template>

<style>
.text-cursor {
  position: relative;
  width: 100%;
  height: 100%;
}

.text-cursor__layer {
  position: absolute;
  inset: 0;
  overflow: hidden;
  line-height: 1;
  pointer-events: none;
  user-select: none;
  -webkit-user-select: none;
}

.text-cursor__item {
  position: absolute;
  top: 0;
  left: 0;
  white-space: pre;
  will-change: transform, opacity;
}
</style>
