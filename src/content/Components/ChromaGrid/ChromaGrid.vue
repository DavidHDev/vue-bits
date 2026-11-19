<script lang="ts">
export interface ChromaItem {
  image: string;
  title?: string;
  subtitle?: string;
  accent?: string;
  url?: string;
  alt?: string;
  borderColor?: string;
}

export interface ChromaGridProps {
  items?: ChromaItem[];
  columns?: number;
  minCardWidth?: number;
  gap?: number;
  radius?: number;
  softness?: number;
  damping?: number;
  fadeOut?: number;
  grayscale?: number;
  dim?: number;
  glow?: number;
  borderGlow?: number;
  reveal?: 'spotlight' | 'card';
  aspectRatio?: string;
  cardRadius?: number;
  showInfo?: boolean;
  frame?: boolean;
  theme?: 'dark' | 'light';
  className?: string;
}

const THEMES: Record<'dark' | 'light', Record<string, string>> = {
  dark: {
    '--chroma-frame': 'rgba(34, 38, 35, 0.66)',
    '--chroma-frame-edge': 'rgba(255, 255, 255, 0.08)',
    '--chroma-frame-highlight': 'rgba(255, 255, 255, 0.07)',
    '--chroma-frame-shadow': '0 22px 44px -20px rgba(0, 0, 0, 0.8), 0 6px 16px -8px rgba(0, 0, 0, 0.5)',
    '--chroma-tile': 'linear-gradient(180deg, #363a37 0%, #242725 100%)',
    '--chroma-tile-edge': 'rgba(255, 255, 255, 0.07)',
    '--chroma-tile-highlight': 'rgba(255, 255, 255, 0.12)',
    '--chroma-tile-shadow': '0 4px 10px -4px rgba(0, 0, 0, 0.7)',
    '--chroma-media-edge': 'rgba(255, 255, 255, 0.06)',
    '--chroma-well': 'rgba(255, 255, 255, 0.08)',
    '--chroma-ink': '#f4f5f4',
    '--chroma-muted': 'rgba(244, 245, 244, 0.55)',
    '--chroma-hover': 'brightness(1.12)',
    '--chroma-press': 'brightness(0.85)'
  },
  light: {
    '--chroma-frame': 'rgba(240, 242, 240, 0.8)',
    '--chroma-frame-edge': 'rgba(22, 24, 22, 0.07)',
    '--chroma-frame-highlight': 'rgba(255, 255, 255, 0.95)',
    '--chroma-frame-shadow': '0 22px 44px -22px rgba(22, 24, 22, 0.3), 0 6px 16px -10px rgba(22, 24, 22, 0.16)',
    '--chroma-tile': 'linear-gradient(180deg, #ffffff 0%, #f5f7f5 100%)',
    '--chroma-tile-edge': 'rgba(22, 24, 22, 0.08)',
    '--chroma-tile-highlight': 'rgba(255, 255, 255, 1)',
    '--chroma-tile-shadow': '0 4px 10px -5px rgba(22, 24, 22, 0.25)',
    '--chroma-media-edge': 'rgba(22, 24, 22, 0.06)',
    '--chroma-well': 'rgba(22, 24, 22, 0.05)',
    '--chroma-ink': '#252825',
    '--chroma-muted': 'rgba(37, 40, 37, 0.55)',
    '--chroma-hover': 'brightness(0.97)',
    '--chroma-press': 'brightness(0.92)'
  }
};

const DEFAULT_ITEMS: ChromaItem[] = [
  {
    image: 'https://images.unsplash.com/photo-1514519334989-3d5c8b1a9f91?w=800&q=80&auto=format&fit=crop',
    title: 'Golden Hour',
    subtitle: 'Sky study',
    accent: '#ff8a4c'
  },
  {
    image: 'https://images.unsplash.com/photo-1520930528075-4ea5ead759f5?w=800&q=80&auto=format&fit=crop',
    title: 'Steel Arches',
    subtitle: 'Sculpture',
    accent: '#ff5a36'
  },
  {
    image: 'https://images.unsplash.com/photo-1511300636408-a63a89df3482?w=800&q=80&auto=format&fit=crop',
    title: 'Black Beach',
    subtitle: 'Landscape',
    accent: '#a0ffbc'
  },
  {
    image: 'https://images.unsplash.com/photo-1524400968894-6e997a66e03f?w=800&q=80&auto=format&fit=crop',
    title: 'Cloud Front',
    subtitle: 'Weather',
    accent: '#ffb27a'
  },
  {
    image: 'https://images.unsplash.com/photo-1778849097774-0ab2a873a858?w=800&q=80&auto=format&fit=crop',
    title: 'Pink Drift',
    subtitle: 'Sky study',
    accent: '#ff7eb6'
  },
  {
    image: 'https://images.unsplash.com/photo-1501630834273-4b5604d2ee31?w=800&q=80&auto=format&fit=crop',
    title: 'Cumulus',
    subtitle: 'Weather',
    accent: '#7cc4ff'
  }
];

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const falloffStops = (softness: number) => {
  const core = clamp(1 - softness, 0, 0.95);
  const stops: string[] = [];
  for (let i = 0; i <= 12; i++) {
    const t = i / 12;
    const u = clamp((t - core) / Math.max(0.0001, 1 - core), 0, 1);
    const alpha = 1 - u * u * u * (u * (u * 6 - 15) + 10);
    stops.push(`rgba(0, 0, 0, ${alpha.toFixed(3)}) ${(t * 100).toFixed(1)}%`);
  }
  return stops.join(', ');
};
</script>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, onUpdated, ref, type CSSProperties } from 'vue';

const props = withDefaults(defineProps<ChromaGridProps>(), {
  items: undefined,
  columns: 3,
  minCardWidth: 180,
  gap: 12,
  radius: 260,
  softness: 0.6,
  damping: 0.45,
  fadeOut: 0.6,
  grayscale: 1,
  dim: 0.12,
  glow: 0.5,
  borderGlow: 1,
  reveal: 'spotlight',
  aspectRatio: '3 / 2',
  cardRadius: 22,
  showInfo: true,
  frame: false,
  theme: 'dark',
  className: ''
});

const rootRef = ref<HTMLDivElement | null>(null);
const data = computed(() => (props.items?.length ? props.items : DEFAULT_ITEMS));

let place: (() => void) | null = null;
let cleanup: (() => void) | null = null;

onMounted(() => {
  const root = rootRef.value;
  if (!root) return;
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  const state = { x: 0, y: 0, tx: 0, ty: 0, power: 0, target: 0, primed: false };
  let raf = 0;
  let last = 0;

  const placeAreas = () => {
    const box = root.getBoundingClientRect();
    root.querySelectorAll<HTMLElement>('[data-chroma-area]').forEach(node => {
      const rect = node.getBoundingClientRect();
      node.style.setProperty('--chroma-ox', `${rect.left - box.left}px`);
      node.style.setProperty('--chroma-oy', `${rect.top - box.top}px`);
    });
  };
  place = placeAreas;

  const tick = (now: number) => {
    raf = 0;
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
    last = now;
    const follow = reduce ? 1 : 1 - Math.exp(-dt / Math.max(0.01, props.damping * 0.32));
    state.x += (state.tx - state.x) * follow;
    state.y += (state.ty - state.y) * follow;
    const span = state.target > state.power ? 0.1 : Math.max(0.02, props.fadeOut * 0.35);
    state.power += (state.target - state.power) * (reduce ? 1 : 1 - Math.exp(-dt / span));
    root.style.setProperty('--chroma-x', `${state.x.toFixed(2)}px`);
    root.style.setProperty('--chroma-y', `${state.y.toFixed(2)}px`);
    root.style.setProperty('--chroma-power', state.power.toFixed(4));
    const settled =
      Math.abs(state.tx - state.x) < 0.1 &&
      Math.abs(state.ty - state.y) < 0.1 &&
      Math.abs(state.target - state.power) < 0.002;
    if (settled) {
      state.power = state.target;
      root.style.setProperty('--chroma-power', state.power.toFixed(4));
      last = 0;
    } else {
      raf = requestAnimationFrame(tick);
    }
  };

  const wake = () => {
    if (!raf) raf = requestAnimationFrame(tick);
  };

  const onMove = (event: PointerEvent) => {
    if (props.reveal === 'card') return;
    const box = root.getBoundingClientRect();
    state.tx = event.clientX - box.left;
    state.ty = event.clientY - box.top;
    if (!state.primed || state.power < 0.02) {
      state.x = state.tx;
      state.y = state.ty;
      state.primed = true;
    }
    state.target = 1;
    wake();
  };

  const onLeave = () => {
    state.target = 0;
    wake();
  };

  const resizeObserver = new ResizeObserver(placeAreas);
  resizeObserver.observe(root);
  root.addEventListener('pointermove', onMove);
  root.addEventListener('pointerdown', onMove);
  root.addEventListener('pointerleave', onLeave);
  root.addEventListener('pointercancel', onLeave);
  placeAreas();

  cleanup = () => {
    cancelAnimationFrame(raf);
    resizeObserver.disconnect();
    root.removeEventListener('pointermove', onMove);
    root.removeEventListener('pointerdown', onMove);
    root.removeEventListener('pointerleave', onLeave);
    root.removeEventListener('pointercancel', onLeave);
    place = null;
  };
});

onUpdated(() => {
  place?.();
});

onBeforeUnmount(() => {
  cleanup?.();
  cleanup = null;
});

const rootClass = computed(
  () => `chroma-grid${props.frame ? ' has-frame' : ''}${props.className ? ` ${props.className}` : ''}`
);

const rootStyle = computed(
  () =>
    ({
      ...(THEMES[props.theme] ?? THEMES.dark),
      '--chroma-cols': Math.max(1, Math.round(props.columns)),
      '--chroma-min': `${Math.max(80, props.minCardWidth)}px`,
      '--chroma-gap': `${Math.max(0, props.gap)}px`,
      '--chroma-r': `${Math.max(20, props.radius)}px`,
      '--chroma-stops': falloffStops(clamp(props.softness, 0, 1)),
      '--chroma-gray': clamp(props.grayscale, 0, 1),
      '--chroma-dim': clamp(props.dim, 0, 0.9),
      '--chroma-glow': clamp(props.glow, 0, 1),
      '--chroma-border': clamp(props.borderGlow, 0, 1),
      '--chroma-fade': `${Math.max(0, props.fadeOut)}s`,
      '--chroma-ratio': props.aspectRatio,
      '--chroma-radius': `${Math.max(0, props.cardRadius)}px`
    }) as CSSProperties
);

const cardStyle = (item: ChromaItem) =>
  ({ '--chroma-accent': item.accent ?? item.borderColor ?? '#ffffff' }) as CSSProperties;
</script>

<template>
  <div
    ref="rootRef"
    :class="rootClass"
    :data-reveal="props.reveal === 'card' ? 'card' : 'spotlight'"
    :style="rootStyle"
  >
    <div class="chroma-grid-inner">
      <component
        :is="item.url ? 'a' : 'article'"
        v-for="(item, index) in data"
        :key="`${item.title}-${index}`"
        class="chroma-card"
        data-chroma-area=""
        :style="cardStyle(item)"
        :href="item.url || undefined"
        :target="item.url ? '_blank' : undefined"
        :rel="item.url ? 'noopener noreferrer' : undefined"
      >
        <span class="chroma-wash" aria-hidden="true" />
        <div class="chroma-media" data-chroma-area="">
          <img class="chroma-mono" :src="item.image" :alt="item.alt ?? item.title ?? ''" loading="lazy" />
          <img class="chroma-color" :src="item.image" alt="" aria-hidden="true" loading="lazy" />
          <span class="chroma-media-rim" aria-hidden="true" />
        </div>
        <div v-if="props.showInfo && (item.title || item.subtitle)" class="chroma-info">
          <span v-if="item.title" class="chroma-title">{{ item.title }}</span>
          <span v-if="item.subtitle" class="chroma-subtitle">{{ item.subtitle }}</span>
        </div>
        <span class="chroma-card-rim" aria-hidden="true" />
        <span class="chroma-card-glow" aria-hidden="true" />
      </component>
    </div>
    <span v-if="props.frame" class="chroma-frame-rim" aria-hidden="true" />
  </div>
</template>

<style>
.chroma-grid {
  --chroma-x: -9999px;
  --chroma-y: -9999px;
  --chroma-power: 0;
  position: relative;
  width: 100%;
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
}

.chroma-grid.has-frame {
  padding: 10px;
  border-radius: calc(var(--chroma-radius) + 10px);
  background: var(--chroma-frame);
  box-shadow: var(--chroma-frame-shadow);
  -webkit-backdrop-filter: blur(20px) saturate(1.6);
  backdrop-filter: blur(20px) saturate(1.6);
}

.chroma-frame-rim {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  box-shadow:
    inset 0 0 0 1px var(--chroma-frame-edge),
    inset 0 1px 0 var(--chroma-frame-highlight);
  pointer-events: none;
}

.chroma-grid-inner {
  display: grid;
  gap: var(--chroma-gap);
  grid-template-columns: repeat(
    auto-fill,
    minmax(
      min(
        100%,
        max(var(--chroma-min), calc((100% - (var(--chroma-cols) - 1) * var(--chroma-gap)) / var(--chroma-cols)))
      ),
      1fr
    )
  );
}

.chroma-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
  padding: 8px;
  box-sizing: border-box;
  border-radius: var(--chroma-radius);
  background: var(--chroma-tile);
  box-shadow: var(--chroma-tile-shadow);
  color: var(--chroma-ink);
  text-decoration: none;
  overflow: hidden;
  isolation: isolate;
  transition: filter 0.25s ease;
}

.chroma-card:hover {
  filter: var(--chroma-hover);
}

a.chroma-card:active {
  filter: var(--chroma-press);
}

a.chroma-card:focus-visible {
  outline: 2px solid var(--chroma-ink);
  outline-offset: 2px;
}

.chroma-wash,
.chroma-color,
.chroma-card-glow {
  -webkit-mask-image: radial-gradient(
    circle var(--chroma-r) at calc(var(--chroma-x) - var(--chroma-ox, 0px))
      calc(var(--chroma-y) - var(--chroma-oy, 0px)),
    var(--chroma-stops)
  );
  mask-image: radial-gradient(
    circle var(--chroma-r) at calc(var(--chroma-x) - var(--chroma-ox, 0px))
      calc(var(--chroma-y) - var(--chroma-oy, 0px)),
    var(--chroma-stops)
  );
}

.chroma-wash {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background: radial-gradient(130% 70% at 50% 100%, var(--chroma-accent), transparent 72%);
  opacity: calc(var(--chroma-glow) * var(--chroma-power) * 0.45);
}

.chroma-media {
  position: relative;
  z-index: 1;
  aspect-ratio: var(--chroma-ratio);
  border-radius: max(0px, calc(var(--chroma-radius) - 8px));
  overflow: hidden;
  background: var(--chroma-well);
}

.chroma-media img {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  user-select: none;
  -webkit-user-drag: none;
}

.chroma-mono {
  filter: grayscale(var(--chroma-gray)) brightness(calc(1 - var(--chroma-dim)));
}

.chroma-color {
  opacity: var(--chroma-power);
}

.chroma-media-rim {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  box-shadow: inset 0 0 0 1px var(--chroma-media-edge);
  pointer-events: none;
}

.chroma-info {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  padding: 2px 6px 4px;
}

.chroma-title {
  overflow: hidden;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: -0.01em;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chroma-subtitle {
  overflow: hidden;
  font-size: 13px;
  line-height: 1.35;
  color: var(--chroma-muted);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chroma-card-rim,
.chroma-card-glow {
  position: absolute;
  inset: 0;
  z-index: 2;
  border-radius: inherit;
  pointer-events: none;
}

.chroma-card-rim {
  box-shadow:
    inset 0 0 0 1px var(--chroma-tile-edge),
    inset 0 1px 0 var(--chroma-tile-highlight);
}

.chroma-card-glow {
  box-shadow:
    inset 0 0 0 1px var(--chroma-accent),
    inset 0 0 16px -8px var(--chroma-accent);
  opacity: calc(var(--chroma-border) * var(--chroma-power));
}

.chroma-grid[data-reveal='card'] .chroma-wash,
.chroma-grid[data-reveal='card'] .chroma-color,
.chroma-grid[data-reveal='card'] .chroma-card-glow {
  -webkit-mask-image: none;
  mask-image: none;
  opacity: 0;
  transition: opacity var(--chroma-fade) ease;
}

.chroma-grid[data-reveal='card'] .chroma-card:hover .chroma-wash {
  opacity: calc(var(--chroma-glow) * 0.45);
  transition-duration: 0.3s;
}

.chroma-grid[data-reveal='card'] .chroma-card:hover .chroma-color {
  opacity: 1;
  transition-duration: 0.3s;
}

.chroma-grid[data-reveal='card'] .chroma-card:hover .chroma-card-glow {
  opacity: var(--chroma-border);
  transition-duration: 0.3s;
}
</style>
