<script setup lang="ts">
import Matter from 'matter-js';
import { computed, nextTick, onMounted, onUnmounted, ref, watch, type CSSProperties } from 'vue';

const { Bodies, Body, Composite, Engine } = Matter;

export type FolderFloatItem = string | { label: string; value: string };
export type FolderFloatTrigger = 'hover' | 'click';

interface FolderFloatProps {
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
  folderColor: '#3f3f46',
  frontColor: '#52525b',
  paperColor: '#f5f5f5',
  itemColor: '#f5f5f5',
  itemTextColor: '#18181b',
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
let popTimer: ReturnType<typeof setTimeout> | undefined;
let liveTimer: ReturnType<typeof setTimeout> | undefined;
const reduce = typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

const list = computed<Entry[]>(() =>
  props.items.map(item => (typeof item === 'string' ? { label: item, value: item } : item))
);
const n = computed(() => list.value.length);
const sub = computed(() => props.sublabel || `${n.value} ${n.value === 1 ? 'note' : 'notes'}`);
const pos = computed(() => layout(list.value, props.spread, props.lift, props.tilt, sizes.value));
const labelsKey = computed(() => list.value.map(item => item.label).join('|'));

const measure = () => {
  const next = pills.slice(0, n.value).map(el => (el ? { w: el.offsetWidth, h: el.offsetHeight } : null));
  if (next.some(s => !s)) return;
  const sized = next as Size[];
  const prev = sizes.value;
  if (prev.length === sized.length && prev.every((s, i) => s.w === sized[i].w && s.h === sized[i].h)) return;
  sizes.value = sized;
};

// --x / --y are written by hand so the physics loop and Vue never fight over them
const applyLayout = () => {
  if (world.live) return;
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
    if (!world.engine) return;
    const dt = world.last ? Math.min(32, now - world.last) : 16;
    world.last = now;
    const t = (now - world.t0) / 1000;
    const k = props.drift * 0.00005 * Math.min(1, t / 2);
    world.bodies.forEach((b, i) => {
      if (world.drag && world.drag.i === i) return;
      const ph = (b as PhasedBody).plugin.phase;
      Body.applyForce(b, b.position, {
        x: Math.sin(t * 0.9 + ph) * k * b.mass,
        y: Math.cos(t * 1.3 + ph * 1.7) * k * b.mass
      });
    });
    Engine.update(world.engine, dt);
    world.bodies.forEach((b, i) => {
      const el = pills[i];
      if (!el) return;
      el.style.setProperty('--x', `${b.position.x.toFixed(1)}px`);
      el.style.setProperty('--y', `${(b.position.y - world.sizes[i].h / 2).toFixed(1)}px`);
    });
    world.raf = requestAnimationFrame(tick);
  };
  w.raf = requestAnimationFrame(tick);
};

const set = (next: boolean) => {
  if (!next) stopPhysics();
  if (open.value === next) return;
  open.value = next;
  emit('openChange', next);
};

onMounted(() => {
  measure();
  applyLayout();
  document.fonts?.ready.then(measure);
});
watch([n, labelsKey], () => nextTick(measure));
watch(pos, () => nextTick(applyLayout), { flush: 'post' });

watch(
  () => [open.value, props.physics, props.openDuration, props.stagger, n.value],
  () => {
    clearTimeout(liveTimer);
    if (!open.value || !props.physics || reduce) {
      if (!open.value || !props.physics) stopPhysics();
      return;
    }
    liveTimer = setTimeout(startPhysics, props.openDuration + (n.value - 1) * props.stagger + 80);
  },
  { immediate: true }
);

onUnmounted(() => {
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
  if (!world.live || e.button !== 0) return;
  const b = world.bodies[i];
  if (!b) return;
  const p = pointerAt(e);
  world.drag = {
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
    // capture unavailable
  }
};
const move = (e: PointerEvent, i: number) => {
  const d = world.drag;
  if (!d || d.i !== i || d.id !== e.pointerId) return;
  if (!d.moved && Math.hypot(e.clientX - d.sx, e.clientY - d.sy) >= DRAG_MIN) {
    d.moved = true;
    (e.currentTarget as HTMLElement).setAttribute('data-drag', '');
  }
  if (!d.moved) return;
  const b = world.bodies[i];
  const { w: bw, h: bh } = world.sizes[i];
  const z = world.zone as Zone;
  const p = pointerAt(e);
  const x = Math.min(z.right - bw / 2, Math.max(z.left + bw / 2, p.x + d.dx));
  const y = Math.min(z.bottom - bh / 2, Math.max(z.top + bh / 2, p.y + d.dy));
  Body.setVelocity(b, { x: (x - b.position.x) * 0.6, y: (y - b.position.y) * 0.6 });
  Body.setPosition(b, { x, y });
};
const up = (e: PointerEvent, i: number, item: Entry) => {
  const d = world.drag;
  if (!d || d.i !== i || d.id !== e.pointerId) return;
  world.drag = null;
  const el = e.currentTarget as HTMLElement;
  el.removeAttribute('data-drag');
  try {
    el.releasePointerCapture(e.pointerId);
  } catch {
    // already released
  }
  if (!d.moved && e.type === 'pointerup') pick(item, i);
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
      '--ff-tab': '14px',
      '--ff-ease-out': 'cubic-bezier(0.23, 1, 0.32, 1)',
      '--ff-spring': `cubic-bezier(0.34, ${(1 + props.bounce * 1.9).toFixed(2)}, 0.64, 1)`
    }) as CSSProperties
);
</script>

<template>
  <div
    class="group relative inline-block font-medium text-[13px] leading-none [width:var(--ff-w)] [padding-top:var(--ff-tab)] [font-family:inherit]"
    :class="className"
    :data-open="open ? '' : undefined"
    :data-live="live ? '' : undefined"
    :data-physics="physics ? '' : undefined"
    :data-trigger="trigger"
    :style="rootStyle"
    @pointerenter="onEnter"
    @pointerleave="onLeave"
    @keydown="onKeyDown"
  >
    <div
      ref="anchorRef"
      class="top-[var(--ff-tab)] left-1/2 z-[1] absolute w-0 h-0 group-data-[open]:before:absolute group-data-[open]:before:top-[calc(-1*(var(--ff-lift)+120px))] group-data-[open]:before:left-[calc(-1*(var(--ff-spread)+100px))] group-data-[open]:before:h-[calc(var(--ff-lift)+120px)] group-data-[open]:before:w-[calc(2*var(--ff-spread)+200px)] group-data-[open]:before:content-['']"
    >
      <button
        v-for="(item, i) in list"
        :key="`${item.value}-${i}`"
        :ref="el => (pills[i] = el as HTMLButtonElement | null)"
        type="button"
        class="top-0 left-1/2 absolute group-data-[open]:hover:[scale:1.05] group-data-[open]:active:[scale:0.97] data-[drag]:cursor-grabbing! m-0 px-3.5 border-0 rounded-[17px] h-[34px] whitespace-nowrap opacity-0 group-data-[open]:opacity-100 shadow-[0_4px_12px_rgba(0,0,0,0.14)] outline-none cursor-pointer pointer-events-none group-data-[open]:pointer-events-auto group-data-[live]:cursor-grab [background:var(--ff-item)] [color:var(--ff-item-ink)] [font:inherit] [transform:translate(-50%,44px)_scale(0.6)] [transform-origin:50%_50%] [-webkit-tap-highlight-color:transparent] [transition:transform_var(--ff-close)_var(--ff-ease-out)_calc((var(--ff-n)-1-var(--i))*var(--ff-stagger)*0.5),opacity_160ms_ease_calc((var(--ff-n)-1-var(--i))*var(--ff-stagger)*0.5+var(--ff-close)*0.45),scale_160ms_var(--ff-ease-out)] group-data-[open]:[transform:translate(calc(-50%+var(--x)),var(--y))_rotate(var(--r))_scale(1)] group-data-[open]:[transition:transform_var(--ff-open)_var(--ff-spring)_calc(var(--i)*var(--ff-stagger)),opacity_160ms_ease_calc(var(--i)*var(--ff-stagger)),scale_160ms_var(--ff-ease-out)] group-data-[live]:[transition:scale_160ms_var(--ff-ease-out)] data-[pop]:[animation:folder-float-pop_320ms_var(--ff-ease-out)] motion-reduce:[transition:opacity_200ms_ease] motion-reduce:group-data-[open]:[transition:opacity_200ms_ease_calc(var(--i)*var(--ff-stagger))]"
        :tabindex="open ? 0 : -1"
        :aria-hidden="!open"
        :data-pop="popped === i ? '' : undefined"
        :style="{ '--i': i, '--r': `${pos[i]?.r.toFixed(2) ?? 0}deg` }"
        @pointerdown="down($event, i)"
        @pointermove="move($event, i)"
        @pointerup="up($event, i, item)"
        @pointercancel="up($event, i, item)"
        @click="!world.live || $event.detail === 0 ? pick(item, i) : undefined"
      >
        <span
          class="block [animation-delay:calc(var(--i)*-0.7s)] [animation-play-state:paused] group-data-[open]:[animation-play-state:running] group-data-[physics]:[animation:none] group-data-[live]:[animation:none] motion-reduce:[animation:none] [animation:folder-float-drift_3.2s_ease-in-out_infinite]"
        >
          {{ item.label }}
        </span>
      </button>
    </div>
    <div class="relative [width:var(--ff-w)] [height:var(--ff-h)]">
      <span
        class="absolute inset-0 z-0 [border-radius:var(--ff-r)] [background:var(--ff-back)] [transform:perspective(600px)_rotateX(8deg)] [transform-origin:50%_100%] before:absolute before:top-[calc(-1*var(--ff-tab))] before:left-0 before:h-[calc(var(--ff-tab)+var(--ff-r))] before:w-[42%] before:[border-radius:var(--ff-r)_var(--ff-r)_0_0] before:[background:inherit] before:content-['']"
        aria-hidden="true"
      />
      <span
        class="top-[10%] right-[8%] left-[8%] z-[1] absolute opacity-0 group-data-[open]:opacity-100 rounded-md h-1/2 [background:var(--ff-paper)] [transform:translateY(10px)] [transition:transform_var(--ff-close)_var(--ff-ease-out),opacity_var(--ff-close)_ease] group-data-[open]:[transform:translateY(0)] group-data-[open]:[transition:transform_var(--ff-open)_var(--ff-ease-out),opacity_200ms_ease] motion-reduce:[transform:none]! motion-reduce:[transition:opacity_200ms_ease]"
        aria-hidden="true"
      />
      <span
        class="right-0 bottom-0 left-0 z-[2] absolute flex flex-col justify-end gap-[5px] px-4 py-3.5 h-[76%] box-border shadow-[0_-10px_24px_rgba(0,0,0,0.28)] [border-radius:var(--ff-r)] [background:linear-gradient(180deg,color-mix(in_srgb,var(--ff-front)_92%,#fff),var(--ff-front)_60%)] [color:var(--ff-label)] [transform:perspective(600px)_rotateX(calc(-1*var(--ff-rest)))] [transform-origin:50%_100%] [transition:transform_var(--ff-open)_var(--ff-ease-out)] group-data-[open]:[transform:perspective(600px)_rotateX(calc(-1*var(--ff-angle)))] motion-reduce:group-data-[open]:[transform:perspective(600px)_rotateX(calc(-1*var(--ff-rest)))] motion-reduce:[transition:opacity_200ms_ease]"
        aria-hidden="true"
      >
        <span class="font-medium text-[13px]">{{ label }}</span>
        <span class="opacity-55 text-[11px]">{{ sub }}</span>
      </span>
      <button
        type="button"
        class="right-0 bottom-0 left-0 z-[3] absolute bg-transparent m-0 p-0 border-0 outline-none h-[76%] cursor-pointer [border-radius:var(--ff-r)] [-webkit-tap-highlight-color:transparent]"
        :aria-expanded="open"
        :aria-label="`${label}, ${sub}`"
        @click="set(!open)"
      />
    </div>
  </div>
</template>

<style>
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
</style>
