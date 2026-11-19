<script setup lang="ts">
import {
  computed,
  isVNode,
  onBeforeUnmount,
  onMounted,
  ref,
  shallowRef,
  watch,
  type CSSProperties,
  type VNode
} from 'vue';

export type GridMotionItem = string | number | boolean | null | undefined | VNode | { src: string; alt?: string };

export type GridMotionDirection = 'alternate' | 'left' | 'right';

export interface GridMotionProps {
  items?: GridMotionItem[];
  rows?: number;
  aspectRatio?: number;
  gap?: number;
  radius?: number;
  angle?: number;
  tilt?: number;
  speed?: number;
  direction?: GridMotionDirection;
  parallax?: number;
  spotlight?: number;
  dim?: number;
  grayscale?: boolean;
  fade?: number;
  tileColor?: string;
  textColor?: string;
  theme?: 'dark' | 'light';
  className?: string;
  style?: CSSProperties;
}

type TileData =
  | { kind: 'empty' }
  | { kind: 'node'; node: VNode }
  | { kind: 'image'; src: string; alt: string }
  | { kind: 'text'; text: string };

type Motion = {
  offsets: number[];
  shifts: number[];
  intro: number;
  pointer: { x: number; y: number; active: boolean };
};

const THEMES = {
  dark: {
    tile: '#1a1c1a',
    text: 'rgba(255, 255, 255, 0.78)',
    border: 'rgba(255, 255, 255, 0.07)'
  },
  light: {
    tile: '#f3f5f3',
    text: '#3d423e',
    border: 'rgba(22, 24, 22, 0.08)'
  }
};

const DIRECTIONS: GridMotionDirection[] = ['alternate', 'left', 'right'];
const IMAGE = /^(https?:\/\/|\/\/|\/|\.\.?\/|data:image\/|blob:)|\.(avif|gif|jpe?g|png|svg|webp)(\?.*)?$/i;
const INERTIA = [0.42, 0.32, 0.26, 0.22];
const PACE = [1, 0.86, 1.12, 0.94];

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const wrap = (value: number, total: number) => ((value % total) + total) % total;
const smoothstep = (edge0: number, edge1: number, value: number) => {
  const t = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
};

const feather = (side: string, zone: number) => {
  const stops: string[] = [];
  for (let i = 0; i <= 12; i++) {
    const t = i / 12;
    const alpha = t * t * t * (t * (t * 6 - 15) + 10);
    stops.push(`rgba(0, 0, 0, ${alpha.toFixed(4)}) ${(t * zone).toFixed(2)}%`);
  }
  const mirrored = stops.map((_, i) => {
    const t = (12 - i) / 12;
    const alpha = t * t * t * (t * (t * 6 - 15) + 10);
    return `rgba(0, 0, 0, ${alpha.toFixed(4)}) ${(100 - t * zone).toFixed(2)}%`;
  });
  return `linear-gradient(${side}, ${stops.join(', ')}, ${mirrored.join(', ')})`;
};

const toTile = (item: GridMotionItem): TileData => {
  if (item === null || item === undefined || item === false) return { kind: 'empty' };
  if (isVNode(item)) return { kind: 'node', node: item };
  if (typeof item === 'object' && 'src' in item && typeof item.src === 'string') {
    return { kind: 'image', src: item.src, alt: item.alt ?? '' };
  }
  const text = String(item).trim();
  return IMAGE.test(text) ? { kind: 'image', src: text, alt: '' } : { kind: 'text', text };
};

const EMPTY: TileData = { kind: 'empty' };

const props = withDefaults(defineProps<GridMotionProps>(), {
  items: () => [],
  rows: 4,
  aspectRatio: 1.33,
  gap: 16,
  radius: 14,
  angle: -12,
  tilt: 0,
  speed: 24,
  direction: 'alternate',
  parallax: 0.5,
  spotlight: 0.6,
  dim: 0.35,
  grayscale: false,
  fade: 0.5,
  tileColor: undefined,
  textColor: undefined,
  theme: 'dark',
  className: '',
  style: undefined
});

const rootRef = ref<HTMLDivElement | null>(null);
const planeRef = ref<HTMLDivElement | null>(null);
const motion: Motion = { offsets: [], shifts: [], intro: 0, pointer: { x: 0, y: 0, active: false } };
const size = shallowRef({ width: 0, height: 0 });

const palette = computed(() => THEMES[props.theme] ?? THEMES.dark);
const rowCount = computed(() => clamp(Math.round(props.rows), 1, 12));
const aspect = computed(() => clamp(props.aspectRatio, 0.3, 4));
const gapSize = computed(() => Math.max(0, props.gap));
const tiltAngle = computed(() => clamp(props.tilt, 0, 75));

const settings = computed(() => ({
  rows: rowCount.value,
  aspect: aspect.value,
  gap: gapSize.value,
  angle: props.angle,
  tilt: tiltAngle.value,
  speed: props.speed,
  direction: DIRECTIONS.includes(props.direction) ? props.direction : 'alternate',
  parallax: clamp(props.parallax, 0, 1),
  spotlight: clamp(props.spotlight, 0, 1),
  dim: clamp(props.dim, 0, 1),
  fade: clamp(props.fade, 0, 1)
}));

const layout = computed(() => {
  const { width, height } = size.value;
  if (!width || !height) return null;
  const rows = rowCount.value;
  const gap = gapSize.value;
  const turn = (props.angle * Math.PI) / 180;
  const lean = (tiltAngle.value * Math.PI) / 180;
  const cos = Math.abs(Math.cos(turn));
  const sin = Math.abs(Math.sin(turn));
  const planeHeight = ((width * sin + height * cos) / Math.max(0.3, Math.cos(lean))) * 1.12;
  const planeWidth = (width * cos + height * sin) * (1 + Math.sin(lean) * 0.9) * 1.12;
  const tileHeight = Math.max(16, (planeHeight - gap * (rows - 1)) / rows);
  const tileWidth = tileHeight * aspect.value;
  const step = tileWidth + gap;
  const perRow = Math.ceil(planeWidth / step) + 1;
  const period = perRow * step;
  return {
    planeWidth,
    planeHeight,
    tileWidth,
    tileHeight,
    step,
    perRow,
    period,
    copies: Math.ceil(planeWidth / period) + 2,
    top: (planeHeight - rows * tileHeight - (rows - 1) * gap) / 2,
    perspective: Math.max(width, height) * 1.5
  };
});

const tiles = computed(() => props.items.map(toTile));

const rowTiles = computed(() => {
  const current = layout.value;
  if (!current) return [];
  const list = tiles.value;
  return Array.from({ length: settings.value.rows }, (_, r) =>
    Array.from({ length: current.perRow }, (_, j) =>
      list.length ? list[(r * current.perRow + j) % list.length] : EMPTY
    )
  ).map(sequence => Array.from({ length: current.copies * current.perRow }, (_, k) => sequence[k % current.perRow]));
});

const mask = computed(() =>
  settings.value.fade > 0
    ? `${feather('to right', settings.value.fade * 34)}, ${feather('to bottom', settings.value.fade * 44)}`
    : undefined
);

const rootClass = computed(
  () => `grid-motion${props.grayscale ? ' grid-motion--gray' : ''}${props.className ? ` ${props.className}` : ''}`
);

const rootStyle = computed(() => {
  const current = layout.value;
  const m = mask.value;
  return {
    '--gm-tile': props.tileColor ?? palette.value.tile,
    '--gm-text': props.textColor ?? palette.value.text,
    '--gm-border': palette.value.border,
    '--gm-radius': `${Math.max(0, props.radius)}px`,
    '--gm-dim': settings.value.dim,
    perspective: current && settings.value.tilt > 0 ? `${current.perspective}px` : undefined,
    maskImage: m,
    WebkitMaskImage: m,
    maskComposite: m ? 'intersect' : undefined,
    WebkitMaskComposite: m ? 'source-in' : undefined,
    ...props.style
  } as CSSProperties;
});

const planeStyle = computed(() => {
  const current = layout.value;
  if (!current) return {};
  return {
    width: `${current.planeWidth}px`,
    height: `${current.planeHeight}px`,
    transform: `translate(-50%, -50%) rotateX(${settings.value.tilt}deg) rotateZ(${settings.value.angle}deg)`,
    '--gm-gap': `${settings.value.gap}px`,
    '--gm-tile-w': `${current.tileWidth}px`,
    '--gm-tile-h': `${current.tileHeight}px`,
    '--gm-font': `${clamp(current.tileHeight * 0.12, 12, 32)}px`
  } as CSSProperties;
});

let observer: ResizeObserver | null = null;

const onMove = (event: PointerEvent) => {
  motion.pointer.x = event.clientX;
  motion.pointer.y = event.clientY;
  motion.pointer.active = true;
};
const onUp = (event: PointerEvent) => {
  if (event.pointerType === 'touch') motion.pointer.active = false;
};
const onLeave = () => {
  motion.pointer.active = false;
};

onMounted(() => {
  const root = rootRef.value;
  if (!root) return;
  observer = new ResizeObserver(() => {
    const width = Math.round(root.clientWidth);
    const height = Math.round(root.clientHeight);
    if (size.value.width !== width || size.value.height !== height) size.value = { width, height };
  });
  observer.observe(root);
  window.addEventListener('pointermove', onMove, { passive: true });
  window.addEventListener('pointerdown', onMove, { passive: true });
  window.addEventListener('pointerup', onUp);
  window.addEventListener('blur', onLeave);
  document.documentElement.addEventListener('pointerleave', onLeave);
});

onBeforeUnmount(() => {
  observer?.disconnect();
  observer = null;
  window.removeEventListener('pointermove', onMove);
  window.removeEventListener('pointerdown', onMove);
  window.removeEventListener('pointerup', onUp);
  window.removeEventListener('blur', onLeave);
  document.documentElement.removeEventListener('pointerleave', onLeave);
});

watch(
  [layout, tiles, planeRef],
  ([current], _previous, onCleanup) => {
    const root = rootRef.value;
    const plane = planeRef.value;
    if (!root || !plane || !current) return;

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const rowEls = Array.from(plane.children) as HTMLElement[];
    const tileEls = rowEls.map(row => Array.from(row.children) as HTMLElement[]);
    const spots = tileEls.map(list => new Float32Array(list.length));
    const written = tileEls.map(list => new Float32Array(list.length));
    let raf = 0;
    let last = performance.now();
    let visible = true;
    let alive = true;
    if (motion.intro >= 1) plane.style.opacity = '1';

    const frame = (now: number) => {
      raf = 0;
      if (!alive) return;
      const s = settings.value;
      const dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000));
      last = now;

      if (motion.intro < 1) {
        motion.intro = Math.min(1, motion.intro + dt / 0.9);
        plane.style.opacity = String(1 - (1 - motion.intro) ** 3);
      }

      const rect = root.getBoundingClientRect();
      const scale = rect.width ? root.clientWidth / rect.width : 1;
      const halfWidth = root.clientWidth / 2 || 1;
      const halfHeight = root.clientHeight / 2 || 1;
      const px = (motion.pointer.x - rect.left) * scale - halfWidth;
      const py = (motion.pointer.y - rect.top) * scale - halfHeight;
      const inside = motion.pointer.active && Math.abs(px) <= halfWidth && Math.abs(py) <= halfHeight;
      const lean = (s.tilt * Math.PI) / 180;
      const turn = (s.angle * Math.PI) / 180;
      const depth = current.perspective;
      let flatY = py;
      let flatX = px;
      if (lean > 0.0001) {
        flatY = (py * depth) / (depth * Math.cos(lean) + py * Math.sin(lean));
        flatX = (px * (depth - flatY * Math.sin(lean))) / depth;
      }
      const planeX = flatX * Math.cos(turn) + flatY * Math.sin(turn);
      const planeY = -flatX * Math.sin(turn) + flatY * Math.cos(turn);
      const nudge = motion.pointer.active ? clamp(px / halfWidth, -1, 1) : 0;
      const reach = (0.6 + 2.2 * s.spotlight) * Math.max(current.tileWidth, current.tileHeight);
      const settle = 1 - Math.exp(-dt / 0.22);

      rowEls.forEach((row, r) => {
        const drift = s.direction === 'left' ? -1 : s.direction === 'right' ? 1 : r % 2 ? 1 : -1;
        if (motion.offsets[r] === undefined) {
          motion.offsets[r] = r * current.step * 0.37;
          motion.shifts[r] = 0;
        }
        if (!reduce) motion.offsets[r] += s.speed * drift * PACE[r % PACE.length] * dt;
        const target = reduce ? 0 : s.parallax * current.tileWidth * 1.2 * nudge * (r % 2 ? -1 : 1);
        motion.shifts[r] += (target - motion.shifts[r]) * (1 - Math.exp(-dt / INERTIA[r % INERTIA.length]));
        const x = -current.period + wrap(motion.offsets[r] + motion.shifts[r], current.period);
        row.style.transform = `translate3d(${x.toFixed(2)}px, 0, 0)`;

        const rowY = current.top + r * (current.tileHeight + s.gap) + current.tileHeight / 2 - current.planeHeight / 2;
        const left = x - current.planeWidth / 2 + current.tileWidth / 2;
        const list = tileEls[r];
        const values = spots[r];
        const marks = written[r];
        for (let k = 0; k < list.length; k++) {
          let wanted = 0;
          if (inside && s.spotlight > 0) {
            const distance = Math.hypot(left + k * current.step - planeX, rowY - planeY) / reach;
            wanted = 1 - smoothstep(0.25, 1, distance);
          }
          values[k] += (wanted - values[k]) * settle;
          if (Math.abs(values[k] - marks[k]) > 0.004 || (wanted === 0 && values[k] < 0.004 && marks[k] !== 0)) {
            marks[k] = values[k] < 0.004 ? 0 : values[k];
            list[k].style.setProperty('--spot', marks[k].toFixed(3));
          }
        }
      });

      if (visible) raf = requestAnimationFrame(frame);
    };

    const visibility = new IntersectionObserver(entries => {
      visible = entries.some(entry => entry.isIntersecting);
      if (visible && !raf) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    });
    visibility.observe(root);
    raf = requestAnimationFrame(frame);

    onCleanup(() => {
      alive = false;
      cancelAnimationFrame(raf);
      visibility.disconnect();
    });
  },
  { flush: 'post' }
);
</script>

<template>
  <div ref="rootRef" :class="rootClass" :style="rootStyle">
    <div v-if="layout" ref="planeRef" class="grid-motion__plane" aria-hidden="true" :style="planeStyle">
      <div
        v-for="(sequence, r) in rowTiles"
        :key="r"
        class="grid-motion__row"
        :style="{ top: `${layout.top + r * (layout.tileHeight + settings.gap)}px` }"
      >
        <div v-for="(tile, k) in sequence" :key="k" class="grid-motion__tile">
          <img v-if="tile.kind === 'image'" :src="tile.src" :alt="tile.alt" draggable="false" decoding="async" />
          <span v-else-if="tile.kind === 'text'" class="grid-motion__text">{{ tile.text }}</span>
          <component :is="tile.node" v-else-if="tile.kind === 'node'" />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.grid-motion {
  position: relative;
  isolation: isolate;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.grid-motion__plane {
  position: absolute;
  top: 50%;
  left: 50%;
  opacity: 0;
}

.grid-motion__row {
  position: absolute;
  left: 0;
  display: flex;
  gap: var(--gm-gap);
  will-change: transform;
}

.grid-motion__tile {
  position: relative;
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: var(--gm-tile-w);
  height: var(--gm-tile-h);
  overflow: hidden;
  border-radius: var(--gm-radius);
  background: var(--gm-tile);
  color: var(--gm-text);
  font-size: var(--gm-font);
  line-height: 1.2;
  text-align: center;
  opacity: calc(1 - var(--gm-dim) * (1 - var(--spot, 0)));
}

.grid-motion__tile::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  box-shadow: inset 0 0 0 1px var(--gm-border);
  pointer-events: none;
}

.grid-motion--gray .grid-motion__tile {
  filter: grayscale(calc(1 - var(--spot, 0)));
}

.grid-motion__tile img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
  user-select: none;
}

.grid-motion__text {
  padding: 0 1em;
}
</style>
