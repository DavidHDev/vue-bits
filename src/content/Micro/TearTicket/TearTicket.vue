<script setup lang="ts">
import { useReducedMotion, useSpring } from 'motion-v';
import { computed, onBeforeUnmount, onMounted, ref, watch, type CSSProperties } from 'vue';

export type TearTicketOrientation = 'horizontal' | 'vertical';

interface TearTicketProps {
  image?: string;
  imageAlt?: string;
  scrim?: boolean;
  imageRadius?: number;
  orientation?: TearTicketOrientation;
  torn?: boolean;
  defaultTorn?: boolean;
  width?: number;
  height?: number;
  stubSize?: number;
  radius?: number;
  holes?: number;
  holeSize?: number;
  notch?: number;
  roughness?: number;
  tearAngle?: number;
  stretch?: number;
  resistance?: number;
  rotate?: number;
  tilt?: boolean;
  tiltMax?: number;
  tiltReach?: number;
  parallax?: number;
  perspective?: number;
  background?: string;
  color?: string;
  border?: boolean;
  borderColor?: string;
  borderWidth?: number;
  stubBackground?: string;
  recenter?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
  className?: string;
}

interface Point {
  x: number;
  y: number;
}

interface Bridge extends Point {
  y0: number;
  y1: number;
  mid: number;
  pts: number[][];
}

interface End extends Point {
  v: number;
}

interface Geometry {
  vertical: boolean;
  cross: number;
  body: string;
  stub: string;
  bridges: Bridge[];
  ends: End[];
  bodyOutline: string;
  stubOutline: string;
}

type Phase = 'idle' | 'held' | 'free' | 'drop' | 'return';

interface Sim {
  raf: number;
  last: number;
  phase: Phase;
  id: number | null;
  sign: number;
  hinge: Point;
  hingeV: number;
  grab: Point;
  start: Point;
  point: Point;
  a0: number;
  theta: number;
  thetaV: number;
  sx: number;
  sy: number;
  vx: number;
  vy: number;
  spin: number;
  pvx: number;
  pvy: number;
  pt: number;
  fade: number;
  age: number;
  bx: number;
  bv: number;
  snapped: boolean[];
  snapAt: number[];
  span: number[];
}

const TILT_SPRING = { stiffness: 220, damping: 24, mass: 0.6 };
const GRAVITY = 2400;
const ART_INSET = 8;
const ART_SPAN = 0.78;
const RETRACT = 0.17;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const rad = (deg: number) => (deg * Math.PI) / 180;
const wrap = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));
const noise = (seed: number) => {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};
const f = (n: number) => n.toFixed(2);

const buildGeometry = (
  W: number,
  H: number,
  S: number,
  R: number,
  holes: number,
  hole: number,
  notch: number,
  rough: number,
  vertical: boolean
): Geometry => {
  const main = vertical ? H : W;
  const cross = vertical ? W : H;
  const x = main - S;
  const hr = hole / 2;
  const n = Math.max(1, Math.round(holes));
  const span = cross - 2 * notch;
  const bridge = Math.max(2, (span - n * hole) / (n + 1));
  const random = noise(n * 7919 + Math.round(cross));
  const at = (u: number, v: number): Point => (vertical ? { x: v, y: u } : { x: u, y: v });
  const pt = (u: number, v: number) => (vertical ? `${f(v)},${f(u)}` : `${f(u)},${f(v)}`);
  const arc = (r: number, sweep: number, u: number, v: number) =>
    `A${f(r)},${f(r)} 0 0 ${vertical ? 1 - sweep : sweep} ${pt(u, v)}`;
  const bridges: Bridge[] = [];
  for (let i = 0; i <= n; i += 1) {
    const y0 = notch + i * (bridge + hole);
    const y1 = y0 + bridge;
    const steps = Math.max(2, Math.round(bridge / 2.2));
    const pts: number[][] = [];
    for (let k = 1; k < steps; k += 1) pts.push([x + (random() - 0.5) * 2 * rough, y0 + (bridge * k) / steps]);
    bridges.push({ y0, y1, mid: (y0 + y1) / 2, pts, ...at(x, (y0 + y1) / 2) });
  }
  let body = `M${pt(R, 0)}L${pt(x - notch, 0)}${arc(notch, 0, x, notch)}`;
  bridges.forEach((b, i) => {
    b.pts.forEach(p => {
      body += `L${pt(p[0], p[1])}`;
    });
    body += `L${pt(x, b.y1)}`;
    if (i < n) body += arc(hr, 0, x, b.y1 + hole);
  });
  body += `${arc(notch, 0, x - notch, cross)}L${pt(R, cross)}${arc(R, 1, 0, cross - R)}L${pt(0, R)}${arc(R, 1, R, 0)}Z`;
  let stub = `M${pt(x + notch, 0)}L${pt(main - R, 0)}${arc(R, 1, main, R)}L${pt(main, cross - R)}${arc(R, 1, main - R, cross)}L${pt(x + notch, cross)}${arc(notch, 0, x, cross - notch)}`;
  for (let i = n; i >= 0; i -= 1) {
    const b = bridges[i];
    for (let k = b.pts.length - 1; k >= 0; k -= 1) stub += `L${pt(b.pts[k][0], b.pts[k][1])}`;
    stub += `L${pt(x, b.y0)}`;
    if (i > 0) stub += arc(hr, 0, x, b.y0 - hole);
  }
  stub += `${arc(notch, 0, x + notch, 0)}Z`;
  const ends = [
    { ...at(x, notch), v: notch },
    { ...at(x, cross - notch), v: cross - notch }
  ];
  const bodyOutline = `M${pt(x, cross - notch)}${arc(notch, 0, x - notch, cross)}L${pt(R, cross)}${arc(R, 1, 0, cross - R)}L${pt(0, R)}${arc(R, 1, R, 0)}L${pt(x - notch, 0)}${arc(notch, 0, x, notch)}`;
  const stubOutline = `M${pt(x, notch)}${arc(notch, 0, x + notch, 0)}L${pt(main - R, 0)}${arc(R, 1, main, R)}L${pt(main, cross - R)}${arc(R, 1, main - R, cross)}L${pt(x + notch, cross)}${arc(notch, 0, x, cross - notch)}`;
  return { vertical, cross, body, stub, bridges, ends, bodyOutline, stubOutline };
};

const props = withDefaults(defineProps<TearTicketProps>(), {
  image: '',
  imageAlt: '',
  scrim: true,
  imageRadius: 8,
  orientation: 'horizontal',
  torn: undefined,
  defaultTorn: false,
  width: 460,
  height: 250,
  stubSize: 150,
  radius: 16,
  holes: 12,
  holeSize: 6,
  notch: 3,
  roughness: 0,
  tearAngle: 30,
  stretch: 30,
  resistance: 0.45,
  rotate: 4,
  tilt: true,
  tiltMax: 9,
  tiltReach: 260,
  parallax: 6,
  perspective: 1000,
  background: '#27272a',
  color: '#f5f5f5',
  border: true,
  borderColor: '',
  borderWidth: 1,
  stubBackground: '',
  recenter: true,
  disabled: false,
  ariaLabel: 'Tear off the stub',
  className: ''
});

const emit = defineEmits<{ tear: [] }>();

const reduce = useReducedMotion();
const controlled = computed(() => props.torn !== undefined);
const inner = ref(props.defaultTorn);
const used = computed(() => (controlled.value ? !!props.torn : inner.value));
// post watchers need the refs, so they wait for this flag instead of running immediately
const mounted = ref(false);
const grabbing = ref(false);
const instant = ref(used.value);
const fit = ref(1);
const rootRef = ref<HTMLDivElement | null>(null);
const stageRef = ref<HTMLDivElement | null>(null);
const planeRef = ref<HTMLDivElement | null>(null);
const bodyRef = ref<HTMLDivElement | null>(null);
const stubRef = ref<HTMLDivElement | null>(null);
const artRef = ref<HTMLImageElement | null>(null);
const inkRef = ref<HTMLDivElement | null>(null);
const fibres: (SVGPathElement | null)[] = [];
const setFibre = (i: number, el: unknown) => {
  fibres[i] = el as SVGPathElement | null;
};
const vertical = computed(() => props.orientation === 'vertical');
const geo = computed(() =>
  buildGeometry(
    props.width,
    props.height,
    props.stubSize,
    props.radius,
    props.holes,
    props.holeSize,
    props.notch,
    props.roughness,
    vertical.value
  )
);
const s: Sim = {
  raf: 0,
  last: 0,
  phase: 'idle',
  id: null,
  sign: 1,
  hinge: { x: 0, y: 0 },
  hingeV: 0,
  grab: { x: 0, y: 0 },
  start: { x: 0, y: 0 },
  point: { x: 0, y: 0 },
  a0: 0,
  theta: 0,
  thetaV: 0,
  sx: 0,
  sy: 0,
  vx: 0,
  vy: 0,
  spin: 0,
  pvx: 0,
  pvy: 0,
  pt: 0,
  fade: 1,
  age: 0,
  bx: 0,
  bv: 0,
  snapped: [],
  snapAt: [],
  span: []
};

const tiltX = useSpring(0, TILT_SPRING);
const tiltY = useSpring(0, TILT_SPRING);

// the tilt plane, artwork parallax and ink shift are written by hand so the cursor never triggers a Vue render
const paintTilt = () => {
  const x = tiltX.get();
  const y = tiltY.get();
  const depth = props.tiltMax > 0 ? props.parallax / props.tiltMax : 0;
  if (planeRef.value) {
    planeRef.value.style.transform = `perspective(${props.perspective}px) rotate(${props.rotate}deg) rotateX(${x}deg) rotateY(${y}deg)`;
  }
  if (artRef.value) artRef.value.style.transform = reduce.value ? '' : `translate(${-y * depth}px, ${x * depth}px)`;
  if (inkRef.value) {
    inkRef.value.style.transform = reduce.value ? '' : `translate(${y * depth * 0.22}px, ${-x * depth * 0.22}px)`;
  }
};

let ro: ResizeObserver | null = null;
const offs: (() => void)[] = [];
const measure = () => {
  const el = rootRef.value;
  if (el) fit.value = Math.min(1, el.clientWidth / props.width) || 1;
};

const paint = (now: number): boolean => {
  const stubEl = stubRef.value;
  const bodyEl = bodyRef.value;
  const g = geo.value;
  if (stubEl) {
    stubEl.style.transform = `translate(${s.sx.toFixed(2)}px, ${s.sy.toFixed(2)}px) rotate(${((s.theta * s.sign * 180) / Math.PI).toFixed(3)}deg)`;
    stubEl.style.opacity = s.fade.toFixed(3);
  }
  const up = g.vertical;
  if (bodyEl) bodyEl.style.transform = `translate${up ? 'Y' : 'X'}(${s.bx.toFixed(2)}px)`;
  const cos = Math.cos(s.theta * s.sign);
  const sin = Math.sin(s.theta * s.sign);
  const lx = up ? 1.6 : 0;
  const ly = up ? 0 : 1.6;
  let busy = false;
  g.bridges.forEach((b, i) => {
    const dx = b.x - s.hinge.x;
    const dy = b.y - s.hinge.y;
    const tx = s.hinge.x + dx * cos - dy * sin + s.sx;
    const ty = s.hinge.y + dx * sin + dy * cos + s.sy;
    const ox = b.x + (up ? 0 : s.bx);
    const oy = b.y + (up ? s.bx : 0);
    const gx = tx - ox;
    const gy = ty - oy;
    const gap = Math.hypot(gx, gy);
    const near = fibres[i * 2];
    const far = fibres[i * 2 + 1];
    if (!near || !far) return;
    const live = s.phase !== 'idle' && !reduce.value;
    if (!s.snapped[i]) {
      if (!live || gap < 0.35) {
        near.style.opacity = '0';
        far.style.opacity = '0';
        return;
      }
      const k = clamp(gap / props.stretch, 0, 1);
      const sag = gap * 0.18;
      const w = (1.7 - 1.15 * k).toFixed(2);
      const sx = (up ? sag : 0) + gx / 2;
      const sy = (up ? 0 : sag) + gy / 2;
      near.setAttribute(
        'd',
        `M${f(ox - lx)},${f(oy - ly)}Q${f(ox - lx + sx)},${f(oy - ly + sy)} ${f(tx - lx)},${f(ty - ly)}`
      );
      far.setAttribute(
        'd',
        `M${f(ox + lx)},${f(oy + ly)}Q${f(ox + lx + gx - sx)},${f(oy + ly + gy - sy)} ${f(tx + lx)},${f(ty + ly)}`
      );
      near.style.strokeWidth = w;
      far.style.strokeWidth = w;
      near.style.opacity = '1';
      far.style.opacity = '1';
      s.span[i] = gap;
      return;
    }
    const t = (now - s.snapAt[i]) / 1000 / RETRACT;
    if (!live || t >= 1 || !s.snapAt[i]) {
      near.style.opacity = '0';
      far.style.opacity = '0';
      return;
    }
    busy = true;
    const left = (1 - t) * (1 - t);
    const len = (s.span[i] || props.stretch) * 0.5 * left;
    const ux = gap > 0.01 ? gx / gap : 1;
    const uy = gap > 0.01 ? gy / gap : 0;
    near.setAttribute('d', `M${f(ox)},${f(oy)}L${f(ox + ux * len)},${f(oy + uy * len)}`);
    far.setAttribute('d', `M${f(tx)},${f(ty)}L${f(tx - ux * len)},${f(ty - uy * len)}`);
    near.style.strokeWidth = '0.9';
    far.style.strokeWidth = '0.9';
    near.style.opacity = left.toFixed(2);
    far.style.opacity = left.toFixed(2);
  });
  return busy;
};

const finish = () => {
  if (stubRef.value) stubRef.value.style.visibility = 'hidden';
  if (!controlled.value) inner.value = true;
  emit('tear');
};

const step = (now: number) => {
  const g = geo.value;
  const dt = clamp((now - s.last) / 1000, 0.001, 0.034);
  s.last = now;
  const limit = rad(props.tearAngle);
  if (s.phase === 'held') {
    const count = g.bridges.length;
    let intact = 0;
    for (let i = 0; i < count; i += 1) if (!s.snapped[i]) intact += 1;
    const hold = count ? intact / count : 0;
    const follow = 0.92 * (1 - clamp(props.resistance, 0, 0.95) * hold);
    const a = Math.atan2(s.point.y - s.hinge.y, s.point.x - s.hinge.x);
    const want = clamp(wrap(a - s.a0) * s.sign * follow, 0, limit + 0.1);
    s.theta += (want - s.theta) * (1 - Math.exp(-dt / 0.035));
    const up = g.vertical;
    const away = clamp(((up ? s.point.y - s.start.y : s.point.x - s.start.x) || 0) * 0.05, -2, 4);
    const side = clamp(((up ? s.point.x - s.start.x : s.point.y - s.start.y) || 0) * 0.05, -3, 3);
    const px = up ? side : away;
    const py = up ? away : side;
    s.sx += (px - s.sx) * (1 - Math.exp(-dt / 0.05));
    s.sy += (py - s.sy) * (1 - Math.exp(-dt / 0.05));
    const slack = Math.hypot(s.sx, s.sy);
    let left = 0;
    g.bridges.forEach((b, i) => {
      if (s.snapped[i]) return;
      const d = Math.abs(b.mid - s.hingeV);
      if (2 * d * Math.sin(s.theta / 2) + slack > props.stretch || s.theta >= limit) {
        s.snapped[i] = true;
        s.snapAt[i] = now;
        s.bv -= 560 / g.bridges.length;
      } else left += 1;
    });
    if (left === 0) {
      s.phase = 'free';
      s.bv -= 150;
    }
  } else if (s.phase === 'free') {
    const cos = Math.cos(s.theta * s.sign);
    const sin = Math.sin(s.theta * s.sign);
    const gx = s.grab.x - s.hinge.x;
    const gy = s.grab.y - s.hinge.y;
    const wx = s.point.x - s.hinge.x - (gx * cos - gy * sin);
    const wy = s.point.y - s.hinge.y - (gx * sin + gy * cos);
    s.sx += (wx - s.sx) * (1 - Math.exp(-dt / 0.045));
    s.sy += (wy - s.sy) * (1 - Math.exp(-dt / 0.045));
    const hang = limit * 0.55 + clamp(s.pvx * 0.0009 * s.sign, -0.3, 0.3);
    s.theta += (hang - s.theta) * (1 - Math.exp(-dt / 0.12));
  } else if (s.phase === 'drop') {
    s.age += dt;
    s.vy += GRAVITY * dt;
    s.sx += s.vx * dt;
    s.sy += s.vy * dt;
    s.theta += s.spin * dt;
    if (s.age > 0.16) s.fade = clamp(1 - (s.age - 0.16) / 0.42, 0, 1);
    if (s.fade <= 0) {
      s.phase = 'idle';
      finish();
    }
  } else if (s.phase === 'return') {
    s.thetaV += (-300 * s.theta - 24 * s.thetaV) * dt;
    s.theta += s.thetaV * dt;
    s.sx += (0 - s.sx) * (1 - Math.exp(-dt / 0.07));
    s.sy += (0 - s.sy) * (1 - Math.exp(-dt / 0.07));
    if (Math.abs(s.theta) < 0.0008 && Math.abs(s.thetaV) < 0.01 && Math.hypot(s.sx, s.sy) < 0.05) {
      s.theta = 0;
      s.thetaV = 0;
      s.sx = 0;
      s.sy = 0;
      s.phase = 'idle';
    }
  }
  s.bv += (-520 * s.bx - 30 * s.bv) * dt;
  s.bx += s.bv * dt;
  const busy = paint(now);
  const moving = Math.abs(s.bx) > 0.02 || Math.abs(s.bv) > 0.5;
  if (s.phase !== 'idle' || moving || busy) s.raf = requestAnimationFrame(step);
  else {
    s.bx = 0;
    s.bv = 0;
    paint(now);
    s.raf = 0;
  }
};
const run = () => {
  if (s.raf) return;
  s.last = performance.now();
  s.raf = requestAnimationFrame(step);
};

const reset = () => {
  cancelAnimationFrame(s.raf);
  Object.assign(s, {
    raf: 0,
    phase: 'idle',
    id: null,
    theta: 0,
    thetaV: 0,
    sx: 0,
    sy: 0,
    fade: 1,
    age: 0,
    bx: 0,
    bv: 0
  });
  s.snapped = [];
  s.snapAt = [];
  s.span = [];
  if (stubRef.value) stubRef.value.style.visibility = '';
  paint(performance.now());
};

watch(
  [mounted, used],
  ([, u]) => {
    if (u) {
      if (s.phase === 'idle' && stubRef.value) stubRef.value.style.visibility = 'hidden';
      return;
    }
    instant.value = false;
    reset();
  },
  { flush: 'post' }
);
watch([mounted, geo], () => reset(), { flush: 'post' });
watch([() => props.perspective, () => props.rotate, () => props.parallax, () => props.tiltMax, reduce], paintTilt, {
  flush: 'post'
});
watch(() => props.width, measure);

onMounted(() => {
  mounted.value = true;
  const el = rootRef.value;
  if (el) {
    measure();
    ro = new ResizeObserver(measure);
    ro.observe(el);
  }
  offs.push(tiltX.on('change', paintTilt), tiltY.on('change', paintTilt));
  paintTilt();
});
onBeforeUnmount(() => {
  cancelAnimationFrame(s.raf);
  ro?.disconnect();
  offs.forEach(off => off());
  tiltX.stop();
  tiltY.stop();
});

const local = (e: PointerEvent): Point => {
  const r = stageRef.value!.getBoundingClientRect();
  const k = r.width / props.width || 1;
  return { x: (e.clientX - r.left) / k, y: (e.clientY - r.top) / k };
};
const tearNow = () => {
  cancelAnimationFrame(s.raf);
  s.raf = 0;
  s.phase = 'idle';
  instant.value = true;
  finish();
};
const onStubDown = (e: PointerEvent) => {
  if (props.disabled || used.value || e.button !== 0 || s.id !== null || s.phase === 'drop') return;
  const g = geo.value;
  try {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  } catch {
    // capture unavailable
  }
  const p = local(e);
  s.id = e.pointerId;
  s.start = p;
  s.point = p;
  s.pt = performance.now();
  s.pvx = 0;
  s.pvy = 0;
  if (s.theta < 0.01) {
    const far = (g.vertical ? p.x : p.y) < g.cross / 2;
    const end = g.ends[far ? 1 : 0];
    s.sign = (far ? 1 : -1) * (g.vertical ? -1 : 1);
    s.hinge = { x: end.x, y: end.y };
    s.hingeV = end.v;
    if (stubRef.value) stubRef.value.style.transformOrigin = `${s.hinge.x}px ${s.hinge.y}px`;
  }
  const cos = Math.cos(-s.theta * s.sign);
  const sin = Math.sin(-s.theta * s.sign);
  const ux = p.x - s.sx - s.hinge.x;
  const uy = p.y - s.sy - s.hinge.y;
  s.grab = { x: s.hinge.x + ux * cos - uy * sin, y: s.hinge.y + ux * sin + uy * cos };
  s.a0 = Math.atan2(s.grab.y - s.hinge.y, s.grab.x - s.hinge.x) - (s.theta * s.sign) / 0.92;
  s.phase = 'held';
  s.thetaV = 0;
  tiltX.set(0);
  tiltY.set(0);
  grabbing.value = true;
  run();
};
const onStubMove = (e: PointerEvent) => {
  if (s.id !== e.pointerId) return;
  const p = local(e);
  const now = performance.now();
  const dt = Math.max(0.004, (now - s.pt) / 1000);
  s.pvx += ((p.x - s.point.x) / dt - s.pvx) * 0.35;
  s.pvy += ((p.y - s.point.y) / dt - s.pvy) * 0.35;
  s.pt = now;
  s.point = p;
  if (reduce.value && Math.hypot(p.x - s.start.x, p.y - s.start.y) > 28) {
    s.id = null;
    grabbing.value = false;
    tearNow();
  }
};
const onStubUp = (e: PointerEvent) => {
  if (s.id !== e.pointerId) return;
  s.id = null;
  const el = e.currentTarget as HTMLElement;
  try {
    if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
  } catch {
    // already released
  }
  grabbing.value = false;
  if (s.phase === 'free') {
    const still = performance.now() - s.pt > 80;
    s.vx = still ? 0 : clamp(s.pvx, -1600, 1600);
    s.vy = still ? 0 : clamp(s.pvy, -1600, 1200);
    s.spin = clamp(s.vx * 0.004, -6, 6) + 1.2 * s.sign;
    s.age = 0;
    s.phase = 'drop';
  } else if (s.phase === 'held') {
    s.phase = 'return';
  }
  run();
};
const onStubKey = (e: KeyboardEvent) => {
  if (props.disabled || used.value || (e.key !== 'Enter' && e.key !== ' ')) return;
  e.preventDefault();
  if (!e.repeat) tearNow();
};

watch(
  [() => props.tilt, reduce, () => props.disabled, () => props.tiltMax, () => props.tiltReach],
  (_v, _o, onCleanup) => {
    if (!props.tilt || reduce.value || props.disabled) return;
    const move = (e: PointerEvent) => {
      const el = rootRef.value;
      if (!el || e.pointerType === 'touch' || s.id !== null) return;
      const r = el.getBoundingClientRect();
      const nx = clamp((e.clientX - (r.left + r.width / 2)) / (r.width / 2 + props.tiltReach), -1, 1);
      const ny = clamp((e.clientY - (r.top + r.height / 2)) / (r.height / 2 + props.tiltReach), -1, 1);
      tiltY.set(nx * props.tiltMax);
      tiltX.set(-ny * props.tiltMax);
    };
    window.addEventListener('pointermove', move);
    onCleanup(() => window.removeEventListener('pointermove', move));
  },
  { immediate: true }
);

const rootStyle = computed(
  () =>
    ({
      '--tt-w': `${props.width}px`,
      '--tt-h': `${props.height}px`,
      '--tt-stub': `${props.stubSize}px`,
      '--tt-bg': props.background,
      '--tt-stub-bg': props.stubBackground || props.background,
      '--tt-ink': props.color,
      '--tt-edge': props.borderColor || `color-mix(in srgb, ${props.color} 16%, transparent)`,
      '--tt-edge-w': props.borderWidth,
      '--tt-parallax': `${props.parallax}px`,
      '--tt-body-w': `${vertical.value ? props.width : props.width - props.stubSize}px`,
      '--tt-body-h': `${vertical.value ? props.height - props.stubSize : props.height}px`,
      '--tt-inset': `${ART_INSET}px`,
      '--tt-span': ART_SPAN,
      '--tt-art-radius': `${props.imageRadius}px`,
      '--tt-fit': fit.value,
      height: `${props.height * fit.value}px`
    }) as CSSProperties
);
</script>

<template>
  <div
    ref="rootRef"
    class="group relative data-[disabled]:opacity-60 [-webkit-touch-callout:none] select-none [width:min(var(--tt-w),100%)] [color:var(--tt-ink)] [-webkit-tap-highlight-color:transparent]"
    :class="className"
    :data-used="used ? '' : undefined"
    :data-orientation="orientation"
    :data-shift="used && recenter ? (vertical ? 'y' : 'x') : undefined"
    :data-instant="instant ? '' : undefined"
    :data-grabbing="grabbing ? '' : undefined"
    :data-disabled="disabled ? '' : undefined"
    :style="rootStyle"
  >
    <div
      ref="stageRef"
      class="top-0 left-0 absolute origin-top-left [width:var(--tt-w)] [height:var(--tt-h)] [transform:scale(var(--tt-fit))] [transition:transform_650ms_cubic-bezier(0.22,1,0.36,1)] group-data-[shift=x]:[transform:translateX(calc(var(--tt-stub)*var(--tt-fit)/2))_scale(var(--tt-fit))] group-data-[shift=y]:[transform:translateY(calc(var(--tt-stub)*var(--tt-fit)/2))_scale(var(--tt-fit))] group-data-[instant]:[transition-duration:0ms] motion-reduce:[transition:none]"
    >
      <div ref="planeRef" class="absolute inset-0">
        <div ref="bodyRef" class="absolute inset-0 pointer-events-none">
          <svg
            v-if="border"
            class="absolute inset-0 [&>path]:fill-none w-full h-full overflow-visible pointer-events-none [&>path]:[stroke:var(--tt-edge)] [&>path]:[stroke-width:var(--tt-edge-w)]"
            :viewBox="`0 0 ${width} ${height}`"
            aria-hidden="true"
          >
            <path :d="geo.bodyOutline" />
          </svg>
          <div
            class="absolute inset-0 pointer-events-auto [background:var(--tt-bg)]"
            :style="{ clipPath: `path('${geo.body}')` }"
          >
            <div
              v-if="image"
              class="absolute overflow-hidden [top:var(--tt-inset)] [left:var(--tt-inset)] [width:calc(var(--tt-body-w)_-_var(--tt-inset)*2)] [height:calc(var(--tt-body-h)*var(--tt-span)_-_var(--tt-inset)*2)] [border-radius:var(--tt-art-radius)]"
            >
              <img
                ref="artRef"
                class="absolute max-w-none object-cover [top:calc(var(--tt-parallax)*-1)] [left:calc(var(--tt-parallax)*-1)] [width:calc(100%_+_var(--tt-parallax)*2)] [height:calc(100%_+_var(--tt-parallax)*2)] [-webkit-user-drag:none] [transition:filter_700ms_ease] group-data-[used]:[filter:grayscale(1)_brightness(0.75)] group-data-[instant]:[transition-duration:0ms]"
                :src="image"
                :alt="imageAlt"
                draggable="false"
              />
              <div
                v-if="scrim"
                class="absolute inset-0 [background:linear-gradient(to_top,var(--tt-bg)_0%,color-mix(in_srgb,var(--tt-bg)_72%,transparent)_30%,color-mix(in_srgb,var(--tt-bg)_18%,transparent)_58%,transparent_80%)]"
              />
            </div>
            <div
              ref="inkRef"
              class="group-data-[orientation=vertical]:bottom-auto left-0 absolute inset-y-0 group-data-[used]:opacity-55 group-data-[orientation=vertical]:w-full [width:calc(var(--tt-w)_-_var(--tt-stub))] [transition:opacity_500ms_ease] group-data-[instant]:[transition-duration:0ms] group-data-[orientation=vertical]:[height:calc(var(--tt-h)_-_var(--tt-stub))]"
            >
              <slot />
            </div>
          </div>
        </div>
        <svg
          class="absolute inset-0 [&_path]:opacity-0 [&_path]:fill-none w-full h-full overflow-visible pointer-events-none [&_path]:[stroke:var(--tt-bg)] [&_path]:[stroke-linecap:round]"
          aria-hidden="true"
        >
          <g v-for="(b, i) in geo.bridges" :key="i">
            <path :ref="el => setFibre(i * 2, el)" />
            <path :ref="el => setFibre(i * 2 + 1, el)" />
          </g>
        </svg>
        <div
          ref="stubRef"
          class="absolute inset-0 outline-none pointer-events-none will-change-transform"
          role="button"
          :tabindex="disabled || used ? -1 : 0"
          :aria-label="ariaLabel"
          :aria-hidden="used || undefined"
          :aria-disabled="disabled || undefined"
          @pointerdown="onStubDown"
          @pointermove="onStubMove"
          @pointerup="onStubUp"
          @pointercancel="onStubUp"
          @lostpointercapture="onStubUp"
          @keydown="onStubKey"
          @dragstart.prevent
        >
          <svg
            v-if="border"
            class="absolute inset-0 [&>path]:fill-none w-full h-full overflow-visible pointer-events-none [&>path]:[stroke:var(--tt-edge)] [&>path]:[stroke-width:var(--tt-edge-w)]"
            :viewBox="`0 0 ${width} ${height}`"
            aria-hidden="true"
          >
            <path :d="geo.stubOutline" />
          </svg>
          <div
            class="absolute inset-0 touch-none cursor-grab group-data-[disabled]:cursor-default group-data-[grabbing]:cursor-grabbing pointer-events-auto [background:var(--tt-stub-bg)]"
            :style="{ clipPath: `path('${geo.stub}')` }"
          >
            <div
              class="group-data-[orientation=vertical]:top-auto right-0 group-data-[orientation=vertical]:left-0 absolute inset-y-0 group-data-[orientation=vertical]:w-auto [width:var(--tt-stub)] group-data-[orientation=vertical]:[height:var(--tt-stub)]"
            >
              <slot name="stub" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <span class="absolute w-px h-px overflow-hidden whitespace-nowrap [clip-path:inset(50%)]" role="status">
      {{ used ? 'Used' : '' }}
    </span>
  </div>
</template>
