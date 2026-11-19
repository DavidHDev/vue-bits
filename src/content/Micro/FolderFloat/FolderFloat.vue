<script setup lang="ts">
import Matter from 'matter-js';
import { computed, onBeforeUnmount, onMounted, ref, watch, type CSSProperties } from 'vue';

const { Bodies, Body, Composite, Engine } = Matter;

export type FolderFloatItem = string | { label: string; value: string };
export type FolderFloatTrigger = 'hover' | 'click';

export interface FolderFloatProps {
  items?: FolderFloatItem[];
  label?: string;
  sublabel?: string;
  trigger?: FolderFloatTrigger;
  defaultOpen?: boolean;
  closeOnSelect?: boolean;
  physics?: boolean;
  drift?: number;
  folderColor?: string;
  frontColor?: string;
  paperColor?: string;
  itemColor?: string;
  itemTextColor?: string;
  labelColor?: string;
  width?: number;
  height?: number;
  radius?: number;
  spread?: number;
  lift?: number;
  tilt?: number;
  flapAngle?: number;
  restAngle?: number;
  openDuration?: number;
  stagger?: number;
  bounce?: number;
  className?: string;
}

type Entry = { label: string; value: string };
type Size = { w: number; h: number };
type Zone = { left: number; right: number; top: number; bottom: number };
type Drag = { i: number; id: number; dx: number; dy: number; sx: number; sy: number; moved: boolean };
type PhasedBody = Matter.Body & { plugin: { phase: number } };
interface World {
  engine: Matter.Engine | null;
  bodies: Matter.Body[];
  sizes: Size[];
  raf: number;
  last: number;
  t0: number;
  drag: Drag | null;
  zone: Zone | null;
  live: boolean;
}

const PAD = 28;
const CHAR = 6.8;
const GAP = 12;
const ROW = 52;
const DRAG_MIN = 4;
const ZONE_PAD = 8;

const jitter = (i: number) => {
  const x = Math.sin(i * 12.9898 + 4.1414) * 43758.5453;
  return x - Math.floor(x);
};

const layout = (list: Entry[], spread: number, lift: number, tilt: number, sizes: (Size | null)[]) => {
  const rows: { items: { i: number; pw: number }[]; width: number }[] = [];
  let row: { i: number; pw: number }[] = [];
  let width = 0;
  list.forEach((item, i) => {
    const pw = sizes[i]?.w ?? PAD + item.label.length * CHAR;
    if (row.length && width + GAP + pw > spread * 2) {
      rows.push({ items: row, width });
      row = [];
      width = 0;
    }
    row.push({ i, pw });
    width += (row.length > 1 ? GAP : 0) + pw;
  });
  if (row.length) rows.push({ items: row, width });
  const pos: { x: number; y: number; r: number }[] = [];
  rows.forEach((r, ri) => {
    let x = -r.width / 2;
    const shift = (ri % 2 ? 1 : -1) * Math.min(16, spread * 0.1);
    r.items.forEach(({ i, pw }) => {
      const j = jitter(i);
      pos[i] = { x: x + pw / 2 + shift + (j - 0.5) * 6, y: -lift - ri * ROW - j * 6, r: tilt * (j * 2 - 1) };
      x += pw + GAP;
    });
  });
  return pos;
};

const props = withDefaults(defineProps<FolderFloatProps>(), {
  items: () => ['Try a warmer palette', 'Tighten the spacing', 'Logo feels small', 'Love the new hero'],
  label: 'Design feedback',
  sublabel: '',
  trigger: 'hover',
  defaultOpen: false,
  closeOnSelect: true,
  physics: true,
  drift: 0.5,
  folderColor: '#3d403d',
  frontColor: '#4f5550',
  paperColor: '#f5f5f5',
  itemColor: '#f5f5f5',
  itemTextColor: '#161816',
  labelColor: '#f5f5f5',
  width: 200,
  height: 148,
  radius: 14,
  spread: 180,
  lift: 26,
  tilt: 8,
  flapAngle: 34,
  restAngle: 16,
  openDuration: 520,
  stagger: 45,
  bounce: 0.3,
  className: ''
});

const emit = defineEmits<{ select: [value: string, index: number]; openChange: [open: boolean] }>();

const open = ref(props.defaultOpen);
const popped = ref(-1);
const live = ref(false);
const sizes = ref<Size[]>([]);
const anchorRef = ref<HTMLDivElement | null>(null);
const pills: (HTMLButtonElement | null)[] = [];
const world: World = {
  engine: null,
  bodies: [],
  sizes: [],
  raf: 0,
  last: 0,
  t0: 0,
  drag: null,
  zone: null,
  live: false
};
let reduce = false;
let popTimer: ReturnType<typeof setTimeout> | undefined;
let liveTimer: ReturnType<typeof setTimeout> | undefined;
let mq: MediaQueryList | null = null;

const list = computed<Entry[]>(() =>
  props.items.map(item => (typeof item === 'string' ? { label: item, value: item } : item))
);
const n = computed(() => list.value.length);
const sub = computed(() => props.sublabel || `${n.value} ${n.value === 1 ? 'note' : 'notes'}`);
const pos = computed(() => layout(list.value, props.spread, props.lift, props.tilt, sizes.value));
const labelsKey = computed(() => list.value.map(item => item.label).join('|'));
const posKey = computed(() => pos.value.map(p => `${p.x},${p.y}`).join('|'));

const setPill = (el: unknown, i: number) => {
  pills[i] = (el as HTMLButtonElement | null) ?? null;
};

const measure = () => {
  const next = pills.slice(0, n.value).map(el => (el ? { w: el.offsetWidth, h: el.offsetHeight } : null));
  if (next.length < n.value || next.some(s => !s)) return;
  const sized = next as Size[];
  const prev = sizes.value;
  if (prev.length === sized.length && prev.every((s, i) => s.w === sized[i].w && s.h === sized[i].h)) return;
  sizes.value = sized;
};

const writeLayout = () => {
  pos.value.forEach((p, i) => {
    const el = pills[i];
    if (!el) return;
    el.style.setProperty('--x', `${p.x.toFixed(1)}px`);
    el.style.setProperty('--y', `${p.y.toFixed(1)}px`);
  });
};

const stopPhysics = () => {
  clearTimeout(liveTimer);
  cancelAnimationFrame(world.raf);
  world.raf = 0;
  if (world.engine) {
    world.bodies.forEach((b, i) => {
      const el = pills[i];
      if (!el) return;
      el.style.setProperty('--x', `${b.position.x.toFixed(1)}px`);
      el.style.setProperty('--y', `${(b.position.y - world.sizes[i].h / 2).toFixed(1)}px`);
    });
    Composite.clear(world.engine.world, false, true);
    Engine.clear(world.engine);
    world.engine = null;
  }
  world.bodies = [];
  world.drag = null;
  world.live = false;
  live.value = false;
};

const startPhysics = () => {
  const w = world;
  if (w.engine) return;
  const els = pills.slice(0, n.value);
  if (els.length < n.value || els.some(el => !el)) return;
  const engine = Engine.create({ gravity: { x: 0, y: 0 } });
  engine.enableSleeping = false;
  w.engine = engine;
  w.sizes = (els as HTMLButtonElement[]).map(el => ({ w: el.offsetWidth, h: el.offsetHeight }));
  const laid = pos.value;
  const ys = laid.map(p => p.y);
  const zone = {
    left: -props.spread - ZONE_PAD,
    right: props.spread + ZONE_PAD,
    top: Math.min(...ys) - ZONE_PAD,
    bottom: -props.lift + Math.max(...w.sizes.map(s => s.h))
  };
  w.zone = zone;
  w.bodies = els.map((_, i) => {
    const { w: bw, h: bh } = w.sizes[i];
    const b = Bodies.rectangle(laid[i].x, laid[i].y + bh / 2, bw, bh, {
      chamfer: { radius: Math.min(bh / 2 - 1, 16) },
      restitution: 0.55,
      friction: 0,
      frictionAir: 0.08,
      inertia: Infinity
    });
    (b as PhasedBody).plugin = { phase: jitter(i) * Math.PI * 2 };
    return b;
  });
  const T = 80;
  const walls = [
    Bodies.rectangle((zone.left + zone.right) / 2, zone.top - T / 2, zone.right - zone.left + 2 * T, T, {
      isStatic: true
    }),
    Bodies.rectangle((zone.left + zone.right) / 2, zone.bottom + T / 2, zone.right - zone.left + 2 * T, T, {
      isStatic: true
    }),
    Bodies.rectangle(zone.left - T / 2, (zone.top + zone.bottom) / 2, T, zone.bottom - zone.top + 2 * T, {
      isStatic: true
    }),
    Bodies.rectangle(zone.right + T / 2, (zone.top + zone.bottom) / 2, T, zone.bottom - zone.top + 2 * T, {
      isStatic: true
    })
  ];
  Composite.add(engine.world, [...w.bodies, ...walls]);
  w.live = true;
  w.last = 0;
  w.t0 = performance.now();
  live.value = true;
  const tick = (now: number) => {
    const s = world;
    if (!s.engine) return;
    const dt = s.last ? Math.min(32, now - s.last) : 16;
    s.last = now;
    const t = (now - s.t0) / 1000;
    const k = props.drift * 0.00005 * Math.min(1, t / 2);
    s.bodies.forEach((b, i) => {
      if (s.drag && s.drag.i === i) return;
      const ph = (b as PhasedBody).plugin.phase;
      Body.applyForce(b, b.position, {
        x: Math.sin(t * 0.9 + ph) * k * b.mass,
        y: Math.cos(t * 1.3 + ph * 1.7) * k * b.mass
      });
    });
    Engine.update(s.engine, dt);
    s.bodies.forEach((b, i) => {
      const el = pills[i];
      if (!el) return;
      el.style.setProperty('--x', `${b.position.x.toFixed(1)}px`);
      el.style.setProperty('--y', `${(b.position.y - s.sizes[i].h / 2).toFixed(1)}px`);
    });
    s.raf = requestAnimationFrame(tick);
  };
  w.raf = requestAnimationFrame(tick);
};

const set = (next: boolean) => {
  if (!next) stopPhysics();
  if (open.value === next) return;
  open.value = next;
  emit('openChange', next);
};

const syncReduce = () => {
  reduce = !!mq?.matches;
};

onMounted(() => {
  mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  syncReduce();
  mq.addEventListener('change', syncReduce);
  writeLayout();
  measure();
  document.fonts?.ready.then(measure);
});

watch([n, labelsKey], measure, { flush: 'post' });
watch(posKey, writeLayout, { flush: 'post' });

watch(
  () =>
    [
      open.value,
      props.physics,
      props.openDuration,
      props.stagger,
      n.value,
      props.spread,
      props.lift,
      posKey.value
    ] as const,
  (_value, _old, onCleanup) => {
    clearTimeout(liveTimer);
    if (!open.value || !props.physics || reduce) {
      if (!open.value) stopPhysics();
      else if (!props.physics) stopPhysics();
      return;
    }
    liveTimer = setTimeout(startPhysics, props.openDuration + (n.value - 1) * props.stagger + 80);
    onCleanup(() => clearTimeout(liveTimer));
  },
  { immediate: true }
);

onBeforeUnmount(() => {
  mq?.removeEventListener('change', syncReduce);
  clearTimeout(popTimer);
  stopPhysics();
});

const pick = (item: Entry, i: number) => {
  emit('select', item.value, i);
  clearTimeout(popTimer);
  popped.value = i;
  popTimer = setTimeout(() => (popped.value = -1), 320);
  if (props.closeOnSelect) set(false);
};

const pointerAt = (e: PointerEvent) => {
  const r = anchorRef.value?.getBoundingClientRect();
  return r ? { x: e.clientX - r.left, y: e.clientY - r.top } : { x: 0, y: 0 };
};

const down = (e: PointerEvent, i: number) => {
  const w = world;
  if (!w.live || e.button !== 0) return;
  const b = w.bodies[i];
  if (!b) return;
  const p = pointerAt(e);
  w.drag = {
    i,
    id: e.pointerId,
    dx: b.position.x - p.x,
    dy: b.position.y - p.y,
    sx: e.clientX,
    sy: e.clientY,
    moved: false
  };
  try {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  } catch {
    return;
  }
};

const move = (e: PointerEvent, i: number) => {
  const w = world;
  const d = w.drag;
  if (!d || d.i !== i || d.id !== e.pointerId) return;
  if (!d.moved && Math.hypot(e.clientX - d.sx, e.clientY - d.sy) >= DRAG_MIN) {
    d.moved = true;
    (e.currentTarget as HTMLElement).setAttribute('data-drag', '');
  }
  if (!d.moved) return;
  const b = w.bodies[i];
  const { w: bw, h: bh } = w.sizes[i];
  const z = w.zone as Zone;
  const p = pointerAt(e);
  const x = Math.min(z.right - bw / 2, Math.max(z.left + bw / 2, p.x + d.dx));
  const y = Math.min(z.bottom - bh / 2, Math.max(z.top + bh / 2, p.y + d.dy));
  Body.setVelocity(b, { x: (x - b.position.x) * 0.6, y: (y - b.position.y) * 0.6 });
  Body.setPosition(b, { x, y });
};

const up = (e: PointerEvent, i: number, item: Entry) => {
  const w = world;
  const d = w.drag;
  if (!d || d.i !== i || d.id !== e.pointerId) return;
  w.drag = null;
  const el = e.currentTarget as HTMLElement;
  el.removeAttribute('data-drag');
  if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
  if (!d.moved && e.type === 'pointerup') pick(item, i);
};

const onItemClick = (e: MouseEvent, item: Entry, i: number) => {
  if (!world.live || e.detail === 0) pick(item, i);
};

const hover = computed(() => props.trigger === 'hover');

const onEnter = () => {
  if (hover.value) set(true);
};

const onLeave = () => {
  if (hover.value && !world.drag) set(false);
};

const onKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && open.value) {
    e.stopPropagation();
    set(false);
  }
};

const rootStyle = computed(
  () =>
    ({
      '--ff-w': `${props.width}px`,
      '--ff-h': `${props.height}px`,
      '--ff-r': `${props.radius}px`,
      '--ff-back': props.folderColor,
      '--ff-front': props.frontColor,
      '--ff-paper': props.paperColor,
      '--ff-item': props.itemColor,
      '--ff-item-ink': props.itemTextColor,
      '--ff-label': props.labelColor,
      '--ff-spread': `${props.spread}px`,
      '--ff-lift': `${props.lift}px`,
      '--ff-angle': `${props.flapAngle}deg`,
      '--ff-rest': `${props.restAngle}deg`,
      '--ff-open': `${props.openDuration}ms`,
      '--ff-close': `${Math.round(props.openDuration * 0.6)}ms`,
      '--ff-stagger': `${props.stagger}ms`,
      '--ff-n': n.value,
      '--ff-spring': `cubic-bezier(0.34, ${(1 + props.bounce * 1.9).toFixed(2)}, 0.64, 1)`
    }) as CSSProperties
);
</script>

<template>
  <div
    :class="`folder-float${className ? ` ${className}` : ''}`"
    :data-open="open ? '' : undefined"
    :data-live="live ? '' : undefined"
    :data-physics="physics ? '' : undefined"
    :data-trigger="trigger"
    :style="rootStyle"
    @pointerenter="onEnter"
    @pointerleave="onLeave"
    @keydown="onKeyDown"
  >
    <div ref="anchorRef" class="folder-float__items">
      <button
        v-for="(item, i) in list"
        :key="`${item.value}-${i}`"
        :ref="el => setPill(el, i)"
        type="button"
        class="folder-float__item"
        :tabindex="open ? 0 : -1"
        :aria-hidden="!open"
        :data-pop="popped === i ? '' : undefined"
        :style="{ '--i': i, '--r': `${(pos[i]?.r ?? 0).toFixed(2)}deg` }"
        @pointerdown="down($event, i)"
        @pointermove="move($event, i)"
        @pointerup="up($event, i, item)"
        @pointercancel="up($event, i, item)"
        @click="onItemClick($event, item, i)"
      >
        <span class="folder-float__drift">{{ item.label }}</span>
      </button>
    </div>
    <div class="folder-float__folder">
      <span class="folder-float__back" aria-hidden="true" />
      <span class="folder-float__paper" aria-hidden="true" />
      <span class="folder-float__front" aria-hidden="true">
        <span class="folder-float__label">{{ label }}</span>
        <span class="folder-float__sub">{{ sub }}</span>
      </span>
      <button
        type="button"
        class="folder-float__trigger"
        :aria-expanded="open"
        :aria-label="`${label}, ${sub}`"
        @click="set(!open)"
      />
    </div>
  </div>
</template>

<style>
.folder-float {
  --ff-w: 200px;
  --ff-h: 148px;
  --ff-r: 14px;
  --ff-tab: 14px;
  --ff-back: #3d403d;
  --ff-front: #4f5550;
  --ff-paper: #f5f5f5;
  --ff-item: #f5f5f5;
  --ff-item-ink: #161816;
  --ff-label: #f5f5f5;
  --ff-spread: 180px;
  --ff-lift: 26px;
  --ff-angle: 34deg;
  --ff-rest: 16deg;
  --ff-open: 520ms;
  --ff-close: 312ms;
  --ff-stagger: 45ms;
  --ff-n: 6;
  --ff-spring: cubic-bezier(0.34, 1.57, 0.64, 1);
  --ff-ease-out: cubic-bezier(0.23, 1, 0.32, 1);

  position: relative;
  display: inline-block;
  width: var(--ff-w);
  padding-top: var(--ff-tab);
  font-family: inherit;
  font-size: 13px;
  font-weight: 500;
  line-height: 1;
}

.folder-float__folder {
  position: relative;
  width: var(--ff-w);
  height: var(--ff-h);
}

.folder-float__back {
  position: absolute;
  inset: 0;
  z-index: 0;
  border-radius: var(--ff-r);
  background: var(--ff-back);
  transform: perspective(600px) rotateX(8deg);
  transform-origin: 50% 100%;
}

.folder-float__back::before {
  content: '';
  position: absolute;
  top: calc(-1 * var(--ff-tab));
  left: 0;
  width: 42%;
  height: calc(var(--ff-tab) + var(--ff-r));
  border-radius: var(--ff-r) var(--ff-r) 0 0;
  background: inherit;
}

.folder-float__paper {
  position: absolute;
  top: 10%;
  z-index: 1;
  right: 8%;
  left: 8%;
  height: 50%;
  border-radius: 6px;
  background: var(--ff-paper);
  opacity: 0;
  transform: translateY(10px);
  transition:
    transform var(--ff-close) var(--ff-ease-out),
    opacity var(--ff-close) ease;
}

.folder-float__front {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 5px;
  height: 76%;
  padding: 14px 16px;
  box-sizing: border-box;
  border-radius: var(--ff-r);
  background: linear-gradient(180deg, color-mix(in srgb, var(--ff-front) 92%, #fff), var(--ff-front) 60%);
  color: var(--ff-label);
  box-shadow: 0 -10px 24px rgba(0, 0, 0, 0.28);
  transform: perspective(600px) rotateX(calc(-1 * var(--ff-rest)));
  transform-origin: 50% 100%;
  transition: transform var(--ff-open) var(--ff-ease-out);
}

.folder-float__label {
  font-size: 13px;
  font-weight: 500;
}

.folder-float__sub {
  font-size: 11px;
  opacity: 0.55;
}

.folder-float__trigger {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 3;
  height: 76%;
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: var(--ff-r);
  background: transparent;
  cursor: pointer;
  outline: none;
  -webkit-tap-highlight-color: transparent;
}

.folder-float[data-open] .folder-float__front {
  transform: perspective(600px) rotateX(calc(-1 * var(--ff-angle)));
}

.folder-float[data-open] .folder-float__paper {
  opacity: 1;
  transform: translateY(0);
  transition:
    transform var(--ff-open) var(--ff-ease-out),
    opacity 200ms ease;
}

.folder-float__items {
  position: absolute;
  top: var(--ff-tab);
  left: 50%;
  z-index: 1;
  width: 0;
  height: 0;
}

.folder-float[data-open] .folder-float__items::before {
  content: '';
  position: absolute;
  top: calc(-1 * (var(--ff-lift) + 120px));
  left: calc(-1 * (var(--ff-spread) + 100px));
  width: calc(2 * var(--ff-spread) + 200px);
  height: calc(var(--ff-lift) + 120px);
}

.folder-float__item {
  position: absolute;
  top: 0;
  left: 50%;
  margin: 0;
  padding: 0 14px;
  height: 34px;
  border: 0;
  border-radius: 17px;
  background: var(--ff-item);
  color: var(--ff-item-ink);
  font: inherit;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.14);
  cursor: pointer;
  outline: none;
  opacity: 0;
  transform: translate(-50%, 44px) scale(0.6);
  transform-origin: 50% 50%;
  pointer-events: none;
  -webkit-tap-highlight-color: transparent;
  transition:
    transform var(--ff-close) var(--ff-ease-out) calc((var(--ff-n) - 1 - var(--i)) * var(--ff-stagger) * 0.5),
    opacity 160ms ease calc((var(--ff-n) - 1 - var(--i)) * var(--ff-stagger) * 0.5 + var(--ff-close) * 0.45),
    scale 160ms var(--ff-ease-out);
}

.folder-float[data-open] .folder-float__item {
  opacity: 1;
  transform: translate(calc(-50% + var(--x)), var(--y)) rotate(var(--r)) scale(1);
  pointer-events: auto;
  transition:
    transform var(--ff-open) var(--ff-spring) calc(var(--i) * var(--ff-stagger)),
    opacity 160ms ease calc(var(--i) * var(--ff-stagger)),
    scale 160ms var(--ff-ease-out);
}

.folder-float[data-live] .folder-float__item {
  cursor: grab;
  transition: scale 160ms var(--ff-ease-out);
}

.folder-float__item[data-drag] {
  cursor: grabbing;
}

@media (hover: hover) and (pointer: fine) {
  .folder-float[data-open] .folder-float__item:hover {
    scale: 1.05;
  }
}

.folder-float[data-open] .folder-float__item:active {
  scale: 0.97;
}

.folder-float__item[data-pop] {
  animation: folder-float-pop 320ms var(--ff-ease-out);
}

.folder-float__drift {
  display: block;
  animation: folder-float-drift 3.2s ease-in-out infinite;
  animation-delay: calc(var(--i) * -0.7s);
  animation-play-state: paused;
}

.folder-float[data-open] .folder-float__drift {
  animation-play-state: running;
}

.folder-float[data-physics] .folder-float__drift,
.folder-float[data-live] .folder-float__drift {
  animation: none;
}

@keyframes folder-float-drift {
  0%,
  100% {
    translate: 0 0;
  }

  50% {
    translate: 0 -3px;
  }
}

@keyframes folder-float-pop {
  30% {
    scale: 1.1;
  }

  100% {
    scale: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .folder-float__front,
  .folder-float__paper {
    transition: opacity 200ms ease;
  }

  .folder-float[data-open] .folder-float__front {
    transform: perspective(600px) rotateX(calc(-1 * var(--ff-rest)));
  }

  .folder-float__paper {
    transform: none !important;
  }

  .folder-float__item {
    transition: opacity 200ms ease;
  }

  .folder-float[data-open] .folder-float__item {
    transition: opacity 200ms ease calc(var(--i) * var(--ff-stagger));
  }

  .folder-float__drift {
    animation: none;
  }
}
</style>
