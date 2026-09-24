<script setup lang="ts" generic="T extends ShredderItem">
import { computed, nextTick, onBeforeUnmount, onMounted, onUpdated, ref, watch, type CSSProperties } from 'vue';

export interface ShredderItem {
  id: string | number;
}

interface ShredderProps<T extends ShredderItem> {
  items?: T[];
  width?: number;
  height?: number;
  inset?: number;
  gap?: number;
  slitHeight?: number;
  fallHeight?: number;
  feedSpeed?: number;
  bite?: number;
  autoFeed?: boolean;
  stripWidth?: number;
  curl?: number;
  autoAnimate?: boolean;
  loop?: boolean;
  loopAfterDelete?: boolean;
  dragTilt?: number;
  lift?: number;
  slitColor?: string;
  color?: string;
  disabled?: boolean;
  className?: string;
}

interface Metrics {
  left: number;
  top: number;
  k: number;
  rw: number;
  lip: number;
  exit: number;
}

interface Texture {
  tex: HTMLCanvasElement;
  scale: number;
}

interface Drag<T> {
  key: string | number;
  item: T;
  el: HTMLDivElement;
  slot: HTMLLIElement;
  W: number;
  H: number;
  rx: number;
  ry: number;
  tx: number;
  ty: number;
  vx: number;
  vy: number;
  tilt: number;
  lift: number;
  gx: number;
  gy: number;
  px: number;
  py: number;
  ox: number;
  oy: number;
  moved: boolean;
  from: number;
  j: number;
  phase: 'drag' | 'carry' | 'return';
  id: number | null;
  snap: Promise<Texture>;
  fill: string;
}

interface Feed<T> {
  key: string | number;
  item: T;
  el: HTMLDivElement;
  slot: HTMLLIElement;
  W: number;
  H: number;
  rx: number;
  ry: number;
  tx: number;
  tilt: number;
  lift: number;
  v: number;
  age: number;
  tex: HTMLCanvasElement | null;
  ts: number;
  consumed: boolean;
  strips: number;
}

interface Strip<T> {
  feed: Feed<T>;
  x: number;
  w: number;
  H: number;
  phase: 'attached' | 'free';
  curl: number;
  amp: number;
  freq: number;
  wave: number;
  rA: number;
  rB: number;
  speed: number;
  splay: number;
  core: number;
  rest: number;
  alpha: number;
  th: number;
  ax: number;
  ay: number;
  vx: number;
  vy: number;
  hang: number;
  pts: number[];
}

interface Shift {
  el: HTMLLIElement;
  y: number;
  v: number;
  target: number;
  delay: number;
  item: HTMLDivElement | null;
}

interface Sim<T> {
  raf: number;
  last: number;
  t: number;
  drag: Drag<T> | null;
  feeds: Feed<T>[];
  strips: Strip<T>[];
  shifts: Map<HTMLLIElement, Shift>;
  tops: Map<HTMLLIElement, number>;
  timers: Set<ReturnType<typeof setTimeout>>;
  dpr: number;
  cw: number;
  ch: number;
}

const FOLLOW = 30;
const SETTLE = 16;
const TUG = 2.4;
const TUG_DECAY = 0.14;
const SLIT = 6;
const OVER = 40;
const SLIVER = 2;
const STACK_K = 320;
const STACK_C = 22;
const STAGGER = 0.035;
const ENTER = 22;
const HYSTERESIS = 8;
const DEG = Math.PI / 180;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const ease = (from: number, to: number, dt: number, tau: number) => from + (to - from) * (1 - Math.exp(-dt / tau));
const smooth = (t: number) => {
  const u = clamp(t, 0, 1);
  return u * u * (3 - 2 * u);
};
const pick = (lo: number, hi: number) => lo + Math.random() * (hi - lo);
const side = () => (Math.random() < 0.5 ? -1 : 1);
const reduced = () =>
  typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

const spring = (p: number, v: number, target: number, dt: number, omega: number): [number, number] => {
  const offset = p - target;
  const term = v + omega * offset;
  const decay = Math.exp(-omega * dt);
  return [target + (offset + term * dt) * decay, (v - omega * term * dt) * decay];
};

const urls = new Map<string, Promise<string>>();

const dataUrl = (src: string): Promise<string> => {
  if (!src || src.startsWith('data:')) return Promise.resolve(src);
  const hit = urls.get(src);
  if (hit) return hit;
  const job = fetch(src, { mode: 'cors' })
    .then(res => res.blob())
    .then(
      blob =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        })
    );
  urls.set(src, job);
  job.catch(() => urls.delete(src));
  return job;
};

const snapshot = (node: HTMLElement, W: number, H: number): Promise<Texture> => {
  const clone = node.cloneNode(true) as HTMLElement;
  const src = [node, ...node.querySelectorAll<HTMLElement>('*')];
  const dst = [clone, ...clone.querySelectorAll<HTMLElement>('*')];
  const images: [HTMLImageElement, string][] = [];
  for (let i = 0; i < src.length; i += 1) {
    const cs = getComputedStyle(src[i]);
    const style = dst[i].style;
    for (let j = 0; j < cs.length; j += 1) style.setProperty(cs[j], cs.getPropertyValue(cs[j]));
    const from = src[i];
    const to = dst[i];
    if (to instanceof HTMLImageElement && from instanceof HTMLImageElement)
      images.push([to, from.currentSrc || from.src]);
  }
  Object.assign(clone.style, {
    position: 'relative',
    inset: 'auto',
    margin: '0',
    transform: 'none',
    filter: 'none',
    transition: 'none',
    width: `${W}px`,
    height: `${H}px`
  });
  clone.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
  const scale = Math.min(3, window.devicePixelRatio || 1);
  return Promise.all(
    images.map(async ([img, from]) => {
      img.removeAttribute('srcset');
      img.removeAttribute('loading');
      try {
        img.setAttribute('src', await dataUrl(from));
      } catch {
        img.removeAttribute('src');
        img.style.background = 'rgba(127, 127, 127, 0.25)';
      }
    })
  ).then(
    () =>
      new Promise<Texture>((resolve, reject) => {
        const markup = new XMLSerializer().serializeToString(clone);
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><foreignObject width="${W}" height="${H}">${markup}</foreignObject></svg>`;
        const img = new Image();
        img.onload = () => {
          const tex = document.createElement('canvas');
          tex.width = Math.ceil(W * scale);
          tex.height = Math.ceil(H * scale);
          tex.getContext('2d')!.drawImage(img, 0, 0, tex.width, tex.height);
          resolve({ tex, scale });
        };
        img.onerror = () => reject(new Error('snapshot'));
        img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
      })
  );
};

const flat = (W: number, H: number, fill: string): Texture => {
  const tex = document.createElement('canvas');
  tex.width = W;
  tex.height = H;
  const ctx = tex.getContext('2d')!;
  ctx.fillStyle = fill;
  ctx.fillRect(0, 0, W, H);
  return { tex, scale: 1 };
};

const shape = <T,>(st: Strip<T>, len: number, time: number, tear: number) => {
  const pts = st.pts;
  pts.length = 0;
  let x = st.ax;
  let y = st.ay;
  const steps = Math.ceil(len / SLIVER);
  const swing = (3 + 9 * st.rA) * tear;
  const pace = time * (1.6 + st.rA * 2.2) + st.rA * 6.2832;
  for (let j = 0; j <= steps; j += 1) {
    const d = Math.min(j * SLIVER, len);
    const a = st.th + st.curl * d + st.amp * Math.sin(d * st.freq + st.wave);
    const flutter = swing * Math.sin(d * 0.045 + pace);
    pts.push(x + flutter * Math.cos(a), y - flutter * Math.sin(a), a);
    const h = Math.min(SLIVER, len - d);
    x += Math.sin(a) * h;
    y += Math.cos(a) * h;
  }
};

const middle = (pts: number[]) => {
  let y = 0;
  for (let j = 1; j < pts.length; j += 3) y += pts[j];
  return (y * 3) / pts.length;
};

const paintStrip = <T,>(ctx: CanvasRenderingContext2D, st: Strip<T>, len: number, dpr: number) => {
  const { tex, ts } = st.feed;
  if (!tex) return;
  const pts = st.pts;
  const wc = st.w * st.core;
  const half = wc / 2;
  const sx = (st.x + (st.w - wc) / 2) * ts;
  const v0 = st.H - len;
  ctx.globalAlpha = st.alpha;
  for (let j = 0; j + 3 < pts.length; j += 3) {
    const d = (j / 3) * SLIVER;
    const h = Math.min(SLIVER, len - d);
    if (h <= 0) break;
    const ca = Math.cos(pts[j + 2]);
    const sa = Math.sin(pts[j + 2]);
    ctx.setTransform(dpr * ca, -dpr * sa, dpr * sa, dpr * ca, dpr * (pts[j] + OVER), dpr * pts[j + 1]);
    ctx.drawImage(tex, sx, (v0 + d) * ts, wc * ts, h * ts, -half, 0, wc, h + 0.4);
  }
  ctx.globalAlpha = 1;
};

const props = withDefaults(defineProps<ShredderProps<T>>(), {
  items: () => [],
  width: 340,
  height: 460,
  inset: 14,
  gap: 10,
  slitHeight: 4,
  fallHeight: 140,
  feedSpeed: 180,
  bite: 18,
  autoFeed: true,
  stripWidth: 10,
  curl: 1,
  autoAnimate: false,
  loop: false,
  loopAfterDelete: false,
  dragTilt: 6,
  lift: 1.02,
  slitColor: '#3f3f46',
  color: '#f5f5f5',
  disabled: false,
  className: ''
});

const emit = defineEmits<{ shred: [item: T]; reorder: [items: T[]] }>();
defineSlots<{ default(props: { item: T; index: number }): unknown }>();

const order = ref<(string | number)[]>(props.items.map(item => item.id));
const sorted = computed<T[]>(() => {
  const rank = new Map<string | number, number>(order.value.map((id, i) => [id, i]));
  const weight = (item: T) => rank.get(item.id) ?? order.value.length + props.items.indexOf(item);
  return [...props.items].sort((a, b) => weight(a) - weight(b));
});

const rootRef = ref<HTMLDivElement | null>(null);
const slitRef = ref<HTMLDivElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);
const slotEls = new Map<string | number, HTMLLIElement>();
const itemEls = new Map<string | number, HTMLDivElement>();

const cfg = {
  get current() {
    return {
      items: sorted.value,
      height: props.height,
      inset: props.inset,
      gap: props.gap,
      slitHeight: props.slitHeight,
      fallHeight: props.fallHeight,
      feedSpeed: props.feedSpeed,
      bite: props.bite,
      autoFeed: props.autoFeed,
      stripWidth: props.stripWidth,
      curl: props.curl,
      loop: props.loop,
      loopAfterDelete: props.loopAfterDelete,
      dragTilt: props.dragTilt,
      lift: props.lift,
      disabled: props.disabled,
      onShred: (item: T) => emit('shred', item),
      onReorder: (items: T[]) => emit('reorder', items)
    };
  }
};

const sim: Sim<T> = {
  raf: 0,
  last: 0,
  t: 0,
  drag: null,
  feeds: [],
  strips: [],
  shifts: new Map(),
  tops: new Map(),
  timers: new Set(),
  dpr: 1,
  cw: 0,
  ch: 0
};

const metrics = (): Metrics => {
  const c = cfg.current;
  const root = rootRef.value!;
  const r = root.getBoundingClientRect();
  const k = r.width / root.offsetWidth || 1;
  const lip = c.height - c.fallHeight - c.slitHeight;
  return { left: r.left, top: r.top, k, rw: root.offsetWidth, lip, exit: lip + c.slitHeight };
};
const at = (el: Element, m: Metrics) => {
  const r = el.getBoundingClientRect();
  return { x: (r.left - m.left) / m.k, y: (r.top - m.top) / m.k };
};
const local = (e: { clientX: number; clientY: number }, m: Metrics) => ({
  x: (e.clientX - m.left) / m.k,
  y: (e.clientY - m.top) / m.k
});

const run = () => {
  if (sim.raf) return;
  sim.last = performance.now();
  sim.raf = requestAnimationFrame(step);
};

const later = (ms: number, fn: () => void) => {
  const id = setTimeout(() => {
    sim.timers.delete(id);
    fn();
  }, ms);
  sim.timers.add(id);
};

const slotOf = (key: string | number) => slotEls.get(key);
const isLive = (key: string | number) => {
  const slot = slotOf(key);
  return !!slot && slot.dataset.gone === undefined;
};
const liveKeys = () => cfg.current.items.map(item => item.id).filter(isLive);
const goneKeys = () =>
  cfg.current.items
    .map(item => item.id)
    .filter(key => {
      const slot = slotOf(key);
      return !!slot && slot.dataset.gone !== undefined;
    });

const shiftOf = (slot: HTMLLIElement): Shift => {
  let sh = sim.shifts.get(slot);
  if (!sh) {
    sh = { el: slot, y: 0, v: 0, target: 0, delay: 0, item: null };
    sim.shifts.set(slot, sh);
  }
  return sh;
};

const settle = (origin: HTMLLIElement | null, entering: Set<HTMLLIElement> | null) => {
  if (!rootRef.value) return;
  const m = metrics();
  const next = new Map<HTMLLIElement, number>();
  const still = reduced();
  const active = sim.drag ? sim.drag.slot : null;
  const slots = cfg.current.items.map(item => slotOf(item.id));
  const from = origin ? slots.indexOf(origin) : -1;
  let born = 0;
  cfg.current.items.forEach((item, idx) => {
    const slot = slots[idx];
    if (!slot) return;
    const sh = sim.shifts.get(slot);
    const top = at(slot, m).y - (sh ? sh.y : 0);
    const prev = sim.tops.get(slot);
    next.set(slot, top);
    if (slot === active || still) return;
    const fresh = (entering && entering.has(slot)) || (prev === undefined && sim.tops.size > 0);
    if (fresh) {
      const rec = shiftOf(slot);
      const el = itemEls.get(item.id) || null;
      rec.y = -ENTER;
      rec.v = 0;
      rec.target = 0;
      rec.delay = born * 0.05;
      rec.item = el;
      born += 1;
      if (el) el.style.opacity = '0';
      slot.style.transform = `translateY(${rec.y}px)`;
      return;
    }
    if (prev === undefined) return;
    const delta = prev - top;
    if (Math.abs(delta) < 0.5) return;
    const rec = shiftOf(slot);
    rec.y += delta;
    if (from >= 0) rec.delay = Math.max(0, from - 1 - idx) * STAGGER;
    slot.style.transform = `translateY(${rec.y}px)`;
  });
  sim.tops = next;
  run();
};

const reflow = (mutate: () => void, origin?: HTMLLIElement | null, entering?: Set<HTMLLIElement> | null) => {
  mutate();
  nextTick(() => settle(origin || null, entering || null));
};

const arrange = (key: string | number, index: number) => {
  const ids = cfg.current.items.map(item => item.id).filter(id => id !== key);
  const live = ids.filter(isLive);
  let anchor = 0;
  if (index < live.length) anchor = ids.indexOf(live[index]);
  else if (live.length) anchor = ids.indexOf(live[live.length - 1]) + 1;
  ids.splice(anchor, 0, key);
  return ids;
};

const commit = (ids: (string | number)[]) => {
  const same = ids.every((id, i) => id === cfg.current.items[i]?.id);
  if (same) return false;
  order.value = ids;
  return true;
};

const revive = (keys: (string | number)[], index?: number) => {
  if (sim.drag) {
    later(300, () => revive(keys, index));
    return;
  }
  const entering = new Set<HTMLLIElement>();
  reflow(
    () => {
      if (index !== undefined && keys.length === 1) commit(arrange(keys[0], index));
      keys.forEach(key => {
        const slot = slotOf(key);
        const el = itemEls.get(key);
        if (!slot || slot.dataset.gone === undefined) return;
        delete slot.dataset.gone;
        slot.style.height = '';
        slot.style.marginBottom = '';
        if (el) {
          el.style.visibility = '';
          el.style.transform = '';
          delete el.dataset.state;
        }
        entering.add(slot);
      });
    },
    null,
    entering
  );
};

const afterShred = (key: string | number) => {
  const c = cfg.current;
  if (c.loopAfterDelete) {
    later(700, () => revive([key], Math.floor(Math.random() * (liveKeys().length + 1))));
  } else if (c.loop && liveKeys().length === 0) {
    later(900, () => revive(goneKeys()));
  }
};

const collapse = (f: Feed<T>) => {
  f.consumed = true;
  f.el.style.visibility = 'hidden';
  delete f.slot.dataset.active;
  sim.shifts.forEach(sh => {
    sh.target = 0;
  });
  reflow(() => {
    f.slot.dataset.gone = '';
    f.slot.style.height = '0px';
    f.slot.style.marginBottom = '0px';
  }, f.slot);
  cfg.current.onShred(f.item);
  afterShred(f.key);
};

const consumeNow = (key: string | number, item: T, el: HTMLDivElement, slot: HTMLLIElement) => {
  const f: Feed<T> = {
    key,
    item,
    el,
    slot,
    W: 0,
    H: 0,
    rx: 0,
    ry: 0,
    tx: 0,
    tilt: 0,
    lift: 1,
    v: 0,
    age: 0,
    tex: null,
    ts: 1,
    consumed: false,
    strips: 0
  };
  collapse(f);
  run();
};

const grab = (d: Drag<T>, m: Metrics) => {
  const c = cfg.current;
  sim.drag = null;
  sim.shifts.forEach(sh => {
    sh.target = 0;
  });
  if (reduced()) {
    consumeNow(d.key, d.item, d.el, d.slot);
    return;
  }
  const over = d.ry + d.H - m.lip;
  const ry = over > c.bite * 1.5 ? m.lip + c.bite * 1.5 - d.H : d.ry;
  const lo = c.inset - SLIT;
  const hi = m.rw - c.inset + SLIT - d.W;
  const n = Math.max(1, Math.round(d.W / Math.max(4, c.stripWidth)));
  const sw = Math.floor(d.W / n);
  const f: Feed<T> = {
    key: d.key,
    item: d.item,
    el: d.el,
    slot: d.slot,
    W: d.W,
    H: d.H,
    rx: d.rx,
    ry,
    tx: clamp(d.rx, Math.min(lo, hi), Math.max(lo, hi)),
    tilt: d.tilt,
    lift: d.lift,
    v: c.feedSpeed * TUG,
    age: 0,
    tex: null,
    ts: 1,
    consumed: false,
    strips: n
  };
  let settled = false;
  const use = ({ tex, scale }: Texture) => {
    if (settled) return;
    settled = true;
    f.tex = tex;
    f.ts = scale;
    run();
  };
  d.snap.then(use, () => use(flat(d.W, d.H, d.fill)));
  setTimeout(() => use(flat(d.W, d.H, d.fill)), 400);
  d.el.dataset.state = 'feed';
  sim.feeds.push(f);
  for (let i = 0; i < n; i += 1) {
    sim.strips.push({
      feed: f,
      x: i * sw,
      w: i === n - 1 ? d.W - sw * (n - 1) : sw,
      H: d.H,
      phase: 'attached',
      curl: side() * pick(0.35, 0.9) * DEG * c.curl,
      amp: pick(1.5, 4) * DEG * c.curl,
      freq: (Math.PI * 2) / pick(34, 60),
      wave: pick(0, Math.PI * 2),
      rA: Math.random(),
      rB: Math.random(),
      speed: 0,
      splay: 0,
      core: 1,
      rest: 0,
      alpha: 1,
      th: 0,
      ax: 0,
      ay: 0,
      vx: 0,
      vy: 0,
      hang: 0,
      pts: []
    });
  }
};

const place = (d: Drag<T>, sp: { x: number; y: number }) => {
  d.el.style.transform = `translate(${d.rx - sp.x}px, ${d.ry - sp.y}px) rotate(${d.tilt}deg) scale(${d.lift})`;
};

const aim = (d: Drag<T>, m: Metrics) => {
  const c = cfg.current;
  const rows: { slot: HTMLLIElement; mid: number }[] = [];
  c.items.forEach(item => {
    if (item.id === d.key) return;
    const slot = slotOf(item.id);
    if (!slot || slot.dataset.gone !== undefined) return;
    const top = sim.tops.get(slot);
    if (top === undefined) return;
    rows.push({ slot, mid: top + slot.offsetHeight / 2 });
  });
  let j = -1;
  if (d.moved && d.ry + d.H < m.lip - 8) {
    const cy = d.ry + d.H / 2;
    let n = 0;
    rows.forEach(row => {
      if (row.mid < cy) n += 1;
    });
    if (d.j >= 0 && n !== d.j) {
      const edge = rows[n > d.j ? n - 1 : n];
      if (edge && Math.abs(edge.mid - cy) < HYSTERESIS) n = d.j;
    }
    j = n;
  }
  if (j === d.j) return;
  d.j = j;
  rows.forEach((row, k) => {
    shiftOf(row.slot).target = j >= 0 && k < j ? -(d.H + c.gap) : 0;
  });
};

const drop = (d: Drag<T>) => {
  const c = cfg.current;
  const live = liveKeys().filter(key => key !== d.key);
  const index = clamp(d.j >= 0 ? d.j : d.from, 0, live.length);
  sim.shifts.forEach(sh => {
    sh.target = 0;
  });
  let changed = false;
  reflow(() => {
    changed = commit(arrange(d.key, index));
    d.slot.style.height = `${d.H}px`;
    d.slot.style.marginBottom = '';
  });
  d.phase = 'return';
  if (changed) c.onReorder(cfg.current.items);
};

const tick = (now: number) => {
  const c = cfg.current;
  const root = rootRef.value;
  const canvas = canvasRef.value;
  if (!root || !canvas) {
    sim.raf = 0;
    return;
  }
  const dt = clamp((now - sim.last) / 1000, 0, 0.05);
  sim.last = now;
  sim.t += dt;
  const m = metrics();
  const d = sim.drag;
  if (d) {
    if (!d.el.isConnected) {
      sim.drag = null;
    } else {
      const sp = at(d.slot, m);
      const ceiling = m.lip + c.bite - d.H;
      if (d.phase === 'drag') {
        d.tx = d.px - d.gx;
        d.ty = Math.min(d.py - d.gy, ceiling);
        if (!d.moved && Math.hypot(d.px - d.ox, d.py - d.oy) > 6) d.moved = true;
        aim(d, m);
      } else if (d.phase === 'carry') {
        d.tx = (m.rw - d.W) / 2;
        d.ty = ceiling;
      } else {
        d.tx = sp.x;
        d.ty = sp.y;
      }
      const omega = d.phase === 'drag' ? FOLLOW : SETTLE;
      [d.rx, d.vx] = spring(d.rx, d.vx, d.tx, dt, omega);
      [d.ry, d.vy] = spring(d.ry, d.vy, d.ty, dt, omega);
      const lean = d.phase === 'drag' ? clamp(d.vx * 0.012, -c.dragTilt, c.dragTilt) : 0;
      d.tilt = ease(d.tilt, lean, dt, 0.09);
      d.lift = ease(d.lift, d.phase === 'return' ? 1 : c.lift, dt, 0.12);
      const over = d.ry + d.H - m.lip;
      const bites = d.phase === 'carry' || (d.phase === 'drag' && c.autoFeed);
      if (bites && over >= c.bite - 0.5) {
        grab(d, m);
      } else {
        place(d, sp);
        const still =
          Math.abs(d.rx - d.tx) < 0.2 && Math.abs(d.ry - d.ty) < 0.2 && Math.abs(d.vy) < 2 && Math.abs(d.vx) < 2;
        if (d.phase === 'return' && still && Math.abs(d.lift - 1) < 0.002 && Math.abs(d.tilt) < 0.05) {
          d.el.style.transform = '';
          delete d.el.dataset.state;
          delete d.slot.dataset.active;
          d.slot.style.height = '';
          sim.drag = null;
        }
      }
    }
  }
  let pulling = false;
  for (let i = sim.feeds.length - 1; i >= 0; i -= 1) {
    const f = sim.feeds[i];
    if (!f.consumed) {
      if (!f.el.isConnected) {
        sim.feeds.splice(i, 1);
        continue;
      }
      pulling = true;
      const sp = at(f.slot, m);
      if (f.tex) {
        f.age += dt;
        f.v = c.feedSpeed * (1 + (TUG - 1) * Math.exp(-f.age / TUG_DECAY));
        f.ry += f.v * dt;
      }
      f.rx = ease(f.rx, f.tx, dt, 0.1);
      f.tilt = ease(f.tilt, 0, dt, 0.08);
      f.lift = ease(f.lift, 1, dt, 0.1);
      if (f.ry >= m.lip) {
        collapse(f);
      } else {
        const jitter = Math.sin(sim.t * 150) * 0.5;
        f.el.style.transform = `translate(${f.rx - sp.x + jitter}px, ${f.ry - sp.y}px) rotate(${f.tilt}deg) scale(${f.lift})`;
      }
    } else {
      f.ry += f.v * dt;
      if (f.strips === 0) sim.feeds.splice(i, 1);
    }
  }
  let moving = false;
  sim.shifts.forEach((sh, el) => {
    if (!el.isConnected) {
      sim.shifts.delete(el);
      return;
    }
    if (sh.delay > 0) {
      sh.delay -= dt;
      moving = true;
      return;
    }
    if (sh.item) {
      const item = sh.item;
      item.style.transition = 'opacity 280ms ease';
      item.style.opacity = '';
      setTimeout(() => {
        item.style.transition = '';
      }, 320);
      sh.item = null;
    }
    const n = Math.ceil(dt * 240);
    const h = dt / n;
    for (let k = 0; k < n; k += 1) {
      sh.v += (-STACK_K * (sh.y - sh.target) - STACK_C * sh.v) * h;
      sh.y += sh.v * h;
    }
    if (Math.abs(sh.y - sh.target) < 0.15 && Math.abs(sh.v) < 4) {
      sh.y = sh.target;
      sh.v = 0;
      if (sh.target === 0) {
        el.style.transform = '';
        sim.shifts.delete(el);
      } else {
        el.style.transform = `translateY(${sh.y}px)`;
      }
    } else {
      el.style.transform = `translateY(${sh.y}px)`;
      moving = true;
    }
  });
  const ctx = canvas.getContext('2d')!;
  const dpr = sim.dpr;
  if (sim.strips.length) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  for (let i = sim.strips.length - 1; i >= 0; i -= 1) {
    const st = sim.strips[i];
    const f = st.feed;
    let len = st.H;
    if (st.phase === 'attached') {
      const top = f.ry - m.exit;
      st.hang = top + st.H;
      if (st.hang <= 0) {
        moving = true;
        continue;
      }
      st.ax = f.rx + st.x + st.w / 2;
      st.th = Math.sin(sim.t * 6 + st.wave) * 0.03 * smooth(st.hang / 40);
      if (top >= 0) {
        st.phase = 'free';
        st.ay = top;
        st.vy = f.v;
        st.vx = pick(-20, 20);
        st.speed = 150 + st.rA * 230;
        st.splay = (st.rA - 0.5) * 320;
        st.rest = side() * pick(0.15, 0.6);
        f.strips -= 1;
      } else {
        st.ay = 0;
        len = st.hang;
      }
    }
    if (st.phase === 'free') {
      const tear = Math.pow(clamp(middle(st.pts) / c.fallHeight, 0, 1), 1.2);
      const breath = 0.85 + 0.15 * Math.sin(sim.t * (1 + st.rB * 2) + st.rA * 6.2832);
      st.vy = ease(st.vy, st.speed * breath, dt, 0.25);
      st.vx = ease(st.vx, st.splay * tear + (st.ax - m.rw / 2) * 0.25, dt, 0.4);
      st.ax += st.vx * dt;
      st.ay += st.vy * dt;
      st.th = ease(st.th, st.rest, dt, 0.5);
      st.core = 1 - smooth(tear / 0.85) * (0.8 - st.rA * 0.16);
      shape(st, st.H, sim.t, tear);
      st.alpha = 1 - smooth((tear - 0.6) / 0.4);
      if (st.alpha <= 0.01 || st.pts[1] > c.fallHeight) {
        sim.strips.splice(i, 1);
        continue;
      }
    } else {
      st.core = 1;
      shape(st, len, sim.t, 0);
      st.alpha = 1;
    }
    paintStrip(ctx, st, len, dpr);
    moving = true;
  }
  const slit = slitRef.value;
  if (slit) {
    slit.style.transform = pulling
      ? `translate(${Math.sin(sim.t * 140) * 0.5}px, ${Math.cos(sim.t * 97) * 0.35}px)`
      : '';
  }
  if (sim.drag || sim.feeds.length || moving) {
    sim.raf = requestAnimationFrame(step);
  } else {
    sim.raf = 0;
  }
};

const step = (now: number) => {
  try {
    tick(now);
  } catch (err) {
    sim.raf = 0;
    throw err;
  }
};

const begin = (item: T, phase: Drag<T>['phase'], e: PointerEvent | null) => {
  const c = cfg.current;
  const key = item.id;
  const el = itemEls.get(key);
  const slot = slotOf(key);
  if (c.disabled || sim.drag || !el || !slot || slot.dataset.gone !== undefined) return;
  if (sim.feeds.some(f => f.key === key)) return;
  const m = metrics();
  const sp = at(slot, m);
  const W = slot.offsetWidth;
  const H = slot.offsetHeight;
  const p = e ? local(e, m) : { x: sp.x, y: sp.y };
  const face = (el.firstElementChild as HTMLElement | null) || el;
  const fill = getComputedStyle(face).backgroundColor;
  let snap: Promise<Texture>;
  try {
    snap = snapshot(el, W, H);
  } catch {
    snap = Promise.reject(new Error('snapshot'));
  }
  snap.catch(() => {});
  const d: Drag<T> = {
    key,
    item,
    el,
    slot,
    W,
    H,
    rx: sp.x,
    ry: sp.y,
    tx: sp.x,
    ty: sp.y,
    vx: 0,
    vy: 0,
    tilt: 0,
    lift: 1,
    gx: p.x - sp.x,
    gy: p.y - sp.y,
    px: p.x,
    py: p.y,
    ox: p.x,
    oy: p.y,
    moved: false,
    from: liveKeys().indexOf(key),
    j: -1,
    phase,
    id: e ? e.pointerId : null,
    snap,
    fill: fill === 'rgba(0, 0, 0, 0)' || fill === 'transparent' ? 'rgba(127, 127, 127, 0.35)' : fill
  };
  sim.drag = d;
  sim.shifts.delete(slot);
  slot.style.transform = '';
  reflow(() => {
    slot.dataset.active = '';
    el.dataset.state = 'drag';
    slot.style.height = '0px';
    slot.style.marginBottom = '0px';
  }, slot);
  place(d, at(slot, m));
  run();
};

const onDown = (e: PointerEvent, item: T) => {
  if (e.button !== 0) return;
  try {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  } catch {
    // capture unavailable
  }
  begin(item, 'drag', e);
};
const onMove = (e: PointerEvent) => {
  const d = sim.drag;
  if (!d || d.id !== e.pointerId) return;
  const p = local(e, metrics());
  d.px = p.x;
  d.py = p.y;
};
const onUp = (e: PointerEvent) => {
  const d = sim.drag;
  if (!d || d.id !== e.pointerId) return;
  d.id = null;
  const el = e.currentTarget as HTMLElement;
  try {
    if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
  } catch {
    // already released
  }
  const m = metrics();
  if (d.ry + d.H > m.lip + 0.5) {
    grab(d, m);
  } else {
    drop(d);
  }
  run();
};
const onKey = (e: KeyboardEvent, item: T) => {
  if (e.key !== 'Delete' && e.key !== 'Backspace') return;
  e.preventDefault();
  if (e.repeat) return;
  const key = item.id;
  if (reduced()) {
    const el = itemEls.get(key);
    const slot = slotOf(key);
    if (cfg.current.disabled || !el || !slot || slot.dataset.gone !== undefined || sim.feeds.some(f => f.key === key))
      return;
    consumeNow(key, item, el, slot);
    return;
  }
  begin(item, 'carry', null);
};

const keepSlot = (key: string | number) => (el: unknown) => {
  if (el) slotEls.set(key, el as HTMLLIElement);
  else slotEls.delete(key);
};
const keepItem = (key: string | number) => (el: unknown) => {
  if (el) itemEls.set(key, el as HTMLDivElement);
  else itemEls.delete(key);
};

onMounted(() => settle(null, null));
onUpdated(() => settle(null, null));

let ro: ResizeObserver | null = null;
const fit = () => {
  const root = rootRef.value;
  const canvas = canvasRef.value;
  if (!root || !canvas) return;
  const dpr = Math.min(3, window.devicePixelRatio || 1);
  const cw = root.offsetWidth + OVER * 2;
  const ch = props.fallHeight;
  if (cw === sim.cw && ch === sim.ch && dpr === sim.dpr) return;
  if (sim.cw) sim.tops = new Map();
  sim.cw = cw;
  sim.ch = ch;
  sim.dpr = dpr;
  canvas.width = Math.ceil(cw * dpr);
  canvas.height = Math.ceil(ch * dpr);
};
onMounted(() => {
  const root = rootRef.value;
  if (!root) return;
  ro = new ResizeObserver(fit);
  ro.observe(root);
  fit();
});
watch(() => props.fallHeight, fit);

let prefetchTimer: ReturnType<typeof setTimeout> | undefined;
watch(
  () => props.items,
  () => {
    clearTimeout(prefetchTimer);
    prefetchTimer = setTimeout(() => {
      itemEls.forEach(el => {
        el.querySelectorAll('img').forEach(img => {
          dataUrl(img.currentSrc || img.src).catch(() => {});
        });
      });
    }, 300);
  },
  { immediate: true, deep: true }
);
onBeforeUnmount(() => clearTimeout(prefetchTimer));

watch(
  () => props.autoAnimate,
  (on, _o, onCleanup) => {
    if (!on) return;
    let alive = true;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const wait = (ms: number) =>
      new Promise(resolve => {
        timer = setTimeout(resolve, ms);
      });
    const idle = () => !sim.drag && sim.feeds.length === 0 && sim.strips.length === 0 && sim.shifts.size === 0;
    const pickNext = () => {
      const list = cfg.current.items;
      for (let i = list.length - 1; i >= 0; i -= 1) {
        if (isLive(list[i].id)) return list[i];
      }
      return null;
    };
    const play = async () => {
      await wait(900);
      while (alive) {
        while (alive && !idle()) await wait(120);
        if (!alive) break;
        const item = pickNext();
        if (!item) {
          await wait(1100);
          if (!alive) break;
          revive(goneKeys());
          await wait(1200);
          continue;
        }
        if (!cfg.current.disabled) begin(item, 'carry', null);
        await wait(700);
      }
    };
    play();
    onCleanup(() => {
      alive = false;
      clearTimeout(timer);
    });
  },
  { immediate: true }
);

onBeforeUnmount(() => {
  cancelAnimationFrame(sim.raf);
  sim.raf = 0;
  ro?.disconnect();
  sim.timers.forEach(id => clearTimeout(id));
  sim.timers.clear();
});

const rootStyle = computed(
  () =>
    ({
      '--sh-w': `${props.width}px`,
      '--sh-h': `${props.height}px`,
      '--sh-inset': `${props.inset}px`,
      '--sh-gap': `${props.gap}px`,
      '--sh-slit-h': `${props.slitHeight}px`,
      '--sh-fall': `${props.fallHeight}px`,
      '--sh-slit-inset': `${Math.max(0, props.inset - SLIT)}px`,
      '--sh-over': `${OVER}px`,
      '--sh-slit': props.slitColor,
      '--sh-ink': props.color
    }) as CSSProperties
);
</script>

<template>
  <div
    ref="rootRef"
    class="group relative data-[disabled]:opacity-60 [-webkit-touch-callout:none] [width:min(var(--sh-w),100%)] [height:var(--sh-h)] [color:var(--sh-ink)] [-webkit-tap-highlight-color:transparent]"
    :class="className"
    :data-disabled="disabled ? '' : undefined"
    :style="rootStyle"
  >
    <ul
      class="right-0 left-0 z-[1] absolute m-0 list-none [bottom:calc(var(--sh-fall)+var(--sh-slit-h))] [padding:0_var(--sh-inset)] [clip-path:inset(-9999px_-9999px_0_-9999px)]"
    >
      <li
        v-for="(item, index) in sorted"
        :key="item.id"
        :ref="keepSlot(item.id)"
        class="group/slot data-[active]:z-[2] relative data-[gone]:pointer-events-none [margin-bottom:var(--sh-gap)]"
      >
        <div
          :ref="keepItem(item.id)"
          class="group-data-[active]/slot:top-0 group-data-[active]/slot:right-0 group-data-[active]/slot:left-0 group-data-[active]/slot:absolute relative outline-none origin-center touch-none cursor-grab data-[state=drag]:cursor-grabbing data-[state=feed]:cursor-default group-data-[disabled]:cursor-default data-[state=feed]:pointer-events-none select-none [-webkit-user-select:none] group-data-[active]/slot:[will-change:transform,filter] group-data-[active]/slot:[filter:drop-shadow(0_0_0_rgba(0,0,0,0))] group-data-[active]/slot:[transition:filter_240ms_ease] data-[state=drag]:[filter:drop-shadow(0_14px_22px_rgba(0,0,0,0.22))]! motion-reduce:group-data-[active]/slot:[transition:none]"
          :tabindex="disabled ? -1 : 0"
          :aria-disabled="disabled || undefined"
          @pointerdown="onDown($event, item)"
          @pointermove="onMove"
          @pointerup="onUp"
          @pointercancel="onUp"
          @lostpointercapture="onUp"
          @keydown="onKey($event, item)"
          @dragstart.prevent
        >
          <slot :item="item" :index="index" />
        </div>
      </li>
    </ul>
    <div
      ref="slitRef"
      class="z-[3] absolute rounded-full will-change-transform [right:var(--sh-slit-inset)] [bottom:var(--sh-fall)] [left:var(--sh-slit-inset)] [height:var(--sh-slit-h)] [background:var(--sh-slit)]"
      aria-hidden="true"
    />
    <div class="right-0 bottom-0 left-0 z-[2] absolute pointer-events-none [height:var(--sh-fall)]" aria-hidden="true">
      <canvas
        ref="canvasRef"
        class="block top-0 absolute h-full [left:calc(-1*var(--sh-over))] [width:calc(100%+var(--sh-over)*2)]"
      />
    </div>
  </div>
</template>
