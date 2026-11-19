<script lang="ts">
import { cloneVNode, h, isVNode, type Component, type VNode, type VNodeChild } from 'vue';

export type StackLayout = 'fan' | 'cascade' | 'deck' | 'pile';

export type StackNode = string | number | boolean | null | undefined | VNode | Component | (() => VNodeChild);

export interface StackProps {
  cards?: StackNode[];
  layout?: StackLayout;
  visible?: number;
  spread?: number;
  depth?: number;
  radius?: number;
  frame?: number;
  frameColor?: string;
  shadow?: boolean;
  tilt?: number;
  threshold?: number;
  speed?: number;
  sendToBackOnClick?: boolean;
  autoplay?: boolean;
  autoplayDelay?: number;
  pauseOnHover?: boolean;
  onChange?: (index: number) => void;
  className?: string;
  style?: Record<string, string | number>;
}

const renderNode = (node: unknown): VNodeChild => {
  if (node === undefined || node === null || node === false || node === true) return null;
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (isVNode(node)) return cloneVNode(node);
  return h(node as Component);
};

export const StackNodeView = (props: { node?: unknown }) => renderNode(props.node);
StackNodeView.props = ['node'];
</script>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue';
import {
  animate,
  cancelFrame,
  frame as frameloop,
  motionValue,
  type MotionValue,
  type ValueAnimationTransition
} from 'motion-v';

type Vector = [number, number];
type Sample = [number, number, number];
type SpringKind = 'place' | 'settle' | 'tuck' | 'face' | 'lean' | 'press' | 'fling';

interface PlaceOptions {
  delay?: number;
  lift?: number;
  kind?: SpringKind;
  velocity?: Vector | null;
  keepZ?: boolean;
}

interface PlaceAllOptions {
  stagger?: number;
  lift?: number;
  released?: number;
  velocity?: Vector | null;
  kind?: SpringKind;
}

interface Placement {
  x: number;
  y: number;
  rotate: number;
  scale: number;
}

interface CardValues {
  x: MotionValue<number>;
  y: MotionValue<number>;
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  tiltX: MotionValue<number>;
  tiltY: MotionValue<number>;
  spin: MotionValue<number>;
  lift: MotionValue<number>;
  grabX: MotionValue<number>;
  grabY: MotionValue<number>;
  z: MotionValue<number>;
  opacity: MotionValue<number>;
  shade: MotionValue<number>;
}

interface Settings {
  layout: StackLayout;
  visible: number;
  spread: number;
  depth: number;
  tilt: number;
  threshold: number;
  speed: number;
  sendToBackOnClick: boolean;
  count: number;
  reduceMotion: boolean;
}

interface DragState {
  card: number;
  id: number;
  element: HTMLDivElement;
  startX: number;
  startY: number;
  originX: number;
  originY: number;
  homeX: number;
  homeY: number;
  vx: number;
  vy: number;
  idle: ReturnType<typeof setTimeout> | 0;
  moved: boolean;
  progress: number;
  capture?: boolean;
  samples: Sample[];
}

interface CardElements {
  card?: HTMLDivElement;
  face?: HTMLDivElement;
  shade?: HTMLDivElement;
  render?: () => void;
}

const DEFAULT_IMAGES = [
  'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?q=80&w=500&auto=format',
  'https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=500&auto=format',
  'https://images.unsplash.com/photo-1452626212852-811d58933cae?q=80&w=500&auto=format',
  'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?q=80&w=500&auto=format'
];

const ORIGINS: Record<StackLayout, Vector> = {
  fan: [0.9, 0.9],
  cascade: [0.5, 0.5],
  deck: [0.5, 0],
  pile: [0.5, 0.5]
};
const EXITS: Partial<Record<StackLayout, Vector>> = { fan: [1, -0.3], cascade: [0.8, 0.6], deck: [0, 1] };
const SHADOW = '0 14px 34px -10px rgba(0, 0, 0, 0.45), 0 3px 8px -2px rgba(0, 0, 0, 0.18)';
const CLICK_SLOP = 6;
const FLICK_SPEED = 650;
const LEAN_SPEED = 1300;
const LEAN_REACH = 260;
const PRESS_SCALE = 1.035;
const SPRINGS: Record<SpringKind, Vector> = {
  place: [260, 24],
  settle: [320, 34],
  tuck: [240, 28],
  face: [240, 30],
  lean: [240, 28],
  press: [420, 34],
  fling: [650, 42]
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

const noise = (seed: number) => {
  const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return value - Math.floor(value);
};

const placement = (layout: StackLayout, position: number, card: number, spread: number, depth: number): Placement => {
  if (layout === 'cascade') {
    return { x: -position * spread * 28, y: -position * spread * 28, rotate: 0, scale: 1 - position * depth * 0.07 };
  }
  if (layout === 'deck') {
    return { x: 0, y: -position * spread * 32, rotate: 0, scale: 1 - position * depth * 0.1 };
  }
  if (layout === 'pile') {
    return {
      x: (noise(card + 1) - 0.5) * spread * 56,
      y: (noise(card + 2) - 0.5) * spread * 44,
      rotate: (noise(card + 3) - 0.5) * spread * 40,
      scale: 1 - position * depth * 0.03
    };
  }
  return { x: 0, y: 0, rotate: position * spread * 8, scale: 1 - position * depth * 0.12 };
};

const releaseVelocity = (samples: Sample[], time: number): Vector => {
  const recent = samples.filter(sample => time - sample[2] <= 100);
  if (recent.length < 2) return [0, 0];
  const first = recent[0];
  const last = recent[recent.length - 1];
  const elapsed = Math.max((last[2] - first[2]) / 1000, 0.008);
  return [(last[0] - first[0]) / elapsed, (last[1] - first[1]) / elapsed];
};

const props = withDefaults(defineProps<StackProps>(), {
  cards: undefined,
  layout: 'fan',
  visible: 4,
  spread: 0.5,
  depth: 0.5,
  radius: 16,
  frame: 0,
  frameColor: '#ffffff',
  shadow: true,
  tilt: 30,
  threshold: 90,
  speed: 1,
  sendToBackOnClick: false,
  autoplay: false,
  autoplayDelay: 3000,
  pauseOnHover: false,
  onChange: undefined,
  className: '',
  style: undefined
});

const items = computed<StackNode[]>(() =>
  props.cards && props.cards.length
    ? props.cards
    : DEFAULT_IMAGES.map((src, index) => h('img', { src, alt: `Card ${index + 1}`, draggable: false }))
);
const count = computed(() => items.value.length);
const shape = computed<StackLayout>(() => (props.layout in ORIGINS ? props.layout : 'fan'));

const reduceMotion = ref(false);
const rootRef = ref<HTMLDivElement | null>(null);
const order = shallowRef<number[]>(Array.from({ length: count.value }, (_, index) => index));
const dragging = ref(false);
const hovered = ref(false);
let orderRef = order.value;
const valuesMap = new Map<number, CardValues>();
const elementsMap = new Map<number, CardElements>();
const flyingMap = new Map<number, { turned: boolean }>();
let dragRef: DragState | null = null;
let alive = true;
let mounted = false;
let motionQuery: MediaQueryList | null = null;
const unsubscribers: (() => void)[] = [];

const settings = (): Settings => ({
  layout: shape.value,
  visible: clamp(Math.round(props.visible), 1, Math.max(count.value, 1)),
  spread: clamp(props.spread, 0, 2),
  depth: clamp(props.depth, 0, 1),
  tilt: clamp(props.tilt, 0, 89),
  threshold: Math.max(props.threshold, 0),
  speed: clamp(props.speed, 0.2, 4),
  sendToBackOnClick: props.sendToBackOnClick,
  count: count.value,
  reduceMotion: reduceMotion.value
});

const elementsFor = (index: number): CardElements => {
  let entry = elementsMap.get(index);
  if (!entry) {
    entry = {};
    elementsMap.set(index, entry);
  }
  return entry;
};

const renderCard = (index: number) => {
  const values = valuesMap.get(index);
  const entry = elementsMap.get(index);
  if (!values || !entry) return;
  const [originX, originY] = ORIGINS[shape.value];
  if (entry.card) {
    const style = entry.card.style;
    style.transform = `translateX(${values.x.get()}px) translateY(${values.y.get()}px) scale(${values.scale.get()}) rotate(${values.rotate.get()}deg)`;
    style.transformOrigin = `${originX * 100}% ${originY * 100}% 0`;
    style.zIndex = String(Math.round(values.z.get()));
    style.opacity = String(values.opacity.get());
  }
  if (entry.face) {
    const style = entry.face.style;
    style.transform = `perspective(800px) scale(${values.lift.get()}) rotate(${values.spin.get()}deg) rotateX(${values.tiltX.get()}deg) rotateY(${values.tiltY.get()}deg)`;
    style.transformOrigin = `${values.grabX.get() * 100}% ${values.grabY.get() * 100}% 0`;
  }
  if (entry.shade) entry.shade.style.opacity = String(values.shade.get());
};

const valuesFor = (index: number): CardValues => {
  let values = valuesMap.get(index);
  if (!values) {
    const s = settings();
    const position = Math.max(0, orderRef.indexOf(index));
    const start = placement(s.layout, s.reduceMotion ? Math.min(position, s.visible - 1) : 0, index, s.spread, s.depth);
    values = {
      x: motionValue(start.x),
      y: motionValue(start.y),
      rotate: motionValue(start.rotate),
      scale: motionValue(start.scale),
      tiltX: motionValue(0),
      tiltY: motionValue(0),
      spin: motionValue(0),
      lift: motionValue(1),
      grabX: motionValue(0.5),
      grabY: motionValue(0.5),
      z: motionValue(s.count - position),
      opacity: motionValue(position < s.visible ? 1 : 0),
      shade: motionValue(0)
    };
    valuesMap.set(index, values);
    const entry = elementsFor(index);
    entry.render = () => renderCard(index);
    const schedule = () => {
      if (entry.render) frameloop.render(entry.render);
    };
    Object.values(values).forEach(value => unsubscribers.push(value.on('change', schedule)));
  }
  return values;
};

const bindElement = (index: number, part: 'card' | 'face' | 'shade', element: unknown) => {
  const entry = elementsFor(index);
  if (element instanceof HTMLDivElement) {
    if (entry[part] === element) return;
    entry[part] = element;
    valuesFor(index);
    renderCard(index);
  } else {
    delete entry[part];
  }
};

const springFor = (
  s: Settings,
  kind: SpringKind,
  extra: ValueAnimationTransition<number> = {}
): ValueAnimationTransition<number> => {
  if (s.reduceMotion) return { duration: 0.2, ease: 'easeOut', delay: extra.delay || 0 };
  const [stiffness, damping] = SPRINGS[kind];
  return {
    type: 'spring',
    stiffness: stiffness * s.speed * s.speed,
    damping: damping * s.speed,
    restDelta: 0.01,
    restSpeed: 0.5,
    ...extra
  };
};

const settleFace = (values: CardValues, s: Settings, delay = 0) => {
  const transition = springFor(s, 'face', { delay });
  animate(values.tiltX, 0, transition);
  animate(values.tiltY, 0, transition);
  animate(values.spin, 0, transition);
  animate(values.lift, 1, transition);
};

const placeCard = (
  index: number,
  position: number,
  { delay = 0, lift = 0, kind = 'place', velocity = null, keepZ = false }: PlaceOptions = {}
) => {
  const s = settings();
  const values = valuesFor(index);
  const shown = Math.min(position, s.visible - 1);
  const target = placement(s.layout, shown, index, s.spread, s.depth);
  if (lift > 0 && shown > 0) {
    const ahead = placement(s.layout, shown - 1, index, s.spread, s.depth);
    target.x = mix(target.x, ahead.x, lift);
    target.y = mix(target.y, ahead.y, lift);
    target.rotate = mix(target.rotate, ahead.rotate, lift);
    target.scale = mix(target.scale, ahead.scale, lift);
  }
  const motionSpring = springFor(s, kind, { delay });
  const fade: ValueAnimationTransition<number> = {
    duration: s.reduceMotion ? 0.2 : 0.35 / s.speed,
    ease: 'easeOut',
    delay
  };
  if (!keepZ) values.z.set(s.count - position);
  animate(values.x, target.x, velocity ? { ...motionSpring, velocity: velocity[0] } : motionSpring);
  animate(values.y, target.y, velocity ? { ...motionSpring, velocity: velocity[1] } : motionSpring);
  animate(values.rotate, target.rotate, motionSpring);
  animate(values.scale, target.scale, motionSpring);
  settleFace(values, s, delay);
  animate(values.opacity, position < s.visible ? 1 : 0, fade);
  animate(values.shade, Math.min(0.6, shown * s.depth * 0.14 * (1 - lift)), fade);
};

const placeAll = ({ stagger = 0, lift = 0, released = -1, velocity = null, kind = 'place' }: PlaceAllOptions = {}) => {
  const drag = dragRef;
  orderRef.forEach((index, position) => {
    const flight = flyingMap.get(index);
    if (flight && !flight.turned) return;
    if (drag && drag.moved && drag.card === index) return;
    const isReleased = index === released;
    placeCard(index, position, {
      delay: position * stagger,
      lift: position > 0 ? lift : 0,
      kind: flight ? 'tuck' : isReleased ? 'settle' : kind,
      velocity: isReleased ? velocity : null,
      keepZ: !!flight
    });
  });
};

const commit = (next: number[]) => {
  orderRef = next;
  order.value = next;
};

const sendToBack = (direction: Vector | null, velocity: Vector | null = null) => {
  const s = settings();
  const current = orderRef;
  if (current.length < 2) return;
  const top = current[0];
  if (flyingMap.has(top)) return;
  const next = [...current.slice(1), top];
  if (s.reduceMotion) {
    commit(next);
    return;
  }
  let [dx, dy] = direction || EXITS[s.layout] || [Math.cos(noise(top + 9) * 6.283), Math.sin(noise(top + 9) * 6.283)];
  const length = Math.hypot(dx, dy) || 1;
  dx /= length;
  dy /= length;
  const bounds = rootRef.value?.getBoundingClientRect();
  const width = bounds?.width || 240;
  const height = bounds?.height || 240;
  const clearance = Math.min(width / Math.max(Math.abs(dx), 0.01), height / Math.max(Math.abs(dy), 0.01));
  const home = placement(s.layout, 0, top, s.spread, s.depth);
  const travel = clearance * 1.12 + 40;
  const out: Vector = [home.x + dx * travel, home.y + dy * travel];
  const values = valuesFor(top);
  const launch = springFor(s, 'fling');
  const flight = { turned: false };
  flyingMap.set(top, flight);
  values.z.set(s.count + 1);
  animate(values.x, out[0], velocity ? { ...launch, velocity: velocity[0] } : launch);
  animate(values.y, out[1], velocity ? { ...launch, velocity: velocity[1] } : launch);
  settleFace(values, s);
  commit(next);
  const span = Math.max(Math.hypot(out[0] - values.x.get(), out[1] - values.y.get()), 1);
  let landed = false;
  const turn = () => {
    flight.turned = true;
    const position = orderRef.indexOf(top);
    if (position >= 0) placeCard(top, position, { kind: 'tuck', keepZ: !landed });
  };
  const land = () => {
    landed = true;
    if (flyingMap.get(top) === flight) flyingMap.delete(top);
    const position = orderRef.indexOf(top);
    if (position >= 0) values.z.set(settings().count - position);
  };
  const fallback = setTimeout(() => {
    if (!flight.turned) turn();
    if (!landed) land();
  }, 1500 / s.speed);
  const clearOfPile = () => {
    const element = elementsMap.get(top)?.card;
    if (!element) return true;
    const mine = element.getBoundingClientRect();
    for (const [index, entry] of elementsMap) {
      const other = entry.card;
      if (!other || index === top || flyingMap.has(index) || valuesFor(index).opacity.get() < 0.5) continue;
      const box = other.getBoundingClientRect();
      if (mine.left < box.right && mine.right > box.left && mine.top < box.bottom && mine.bottom > box.top) {
        return false;
      }
    }
    return true;
  };
  const watchFlight = () => {
    if (!alive || (flight.turned && landed)) {
      clearTimeout(fallback);
      return;
    }
    const x = values.x.get();
    const y = values.y.get();
    const outward = values.x.getVelocity() * dx + values.y.getVelocity() * dy;
    if (!flight.turned && (Math.hypot(out[0] - x, out[1] - y) <= span * 0.06 || outward < 0)) turn();
    if (!landed && (clearOfPile() || (flight.turned && outward < 0))) land();
    requestAnimationFrame(watchFlight);
  };
  requestAnimationFrame(watchFlight);
};

const lean = (drag: DragState) => {
  const s = settings();
  if (s.reduceMotion) return;
  const values = valuesFor(drag.card);
  const offsetX = values.x.get() - drag.homeX;
  const offsetY = values.y.get() - drag.homeY;
  const sideways = clamp(drag.vx / LEAN_SPEED, -1, 1) * 0.7 + clamp(offsetX / LEAN_REACH, -1, 1) * 0.3;
  const upward = clamp(-drag.vy / LEAN_SPEED, -1, 1) * 0.7 + clamp(-offsetY / LEAN_REACH, -1, 1) * 0.3;
  const follow = springFor(s, 'lean');
  animate(values.tiltY, sideways * s.tilt, follow);
  animate(values.tiltX, upward * s.tilt, follow);
  animate(values.spin, clamp(offsetX / LEAN_REACH, -1, 1) * 6, follow);
};

const onMove = (event: PointerEvent) => {
  const drag = dragRef;
  if (!drag || event.pointerId !== drag.id) return;
  const s = settings();
  const dx = event.clientX - drag.startX;
  const dy = event.clientY - drag.startY;
  const values = valuesFor(drag.card);
  if (!drag.moved) {
    if (Math.hypot(dx, dy) < CLICK_SLOP) return;
    drag.moved = true;
    values.x.stop();
    values.y.stop();
    drag.originX = values.x.get() - dx;
    drag.originY = values.y.get() - dy;
    try {
      drag.element.setPointerCapture(drag.id);
    } catch {
      drag.capture = false;
    }
    dragging.value = true;
  }
  values.x.set(drag.originX + dx);
  values.y.set(drag.originY + dy);
  drag.samples.push([event.clientX, event.clientY, event.timeStamp]);
  if (drag.samples.length > 12) drag.samples.shift();
  [drag.vx, drag.vy] = releaseVelocity(drag.samples, event.timeStamp);
  lean(drag);
  clearTimeout(drag.idle);
  drag.idle = setTimeout(() => {
    if (dragRef !== drag) return;
    drag.vx = 0;
    drag.vy = 0;
    lean(drag);
  }, 70);
  const progress = clamp(Math.hypot(dx, dy) / Math.max(s.threshold, 1), 0, 1);
  if (Math.abs(progress - drag.progress) > 0.02) {
    drag.progress = progress;
    placeAll({ lift: progress * 0.4, kind: 'settle' });
  }
};

const onUp = (event: PointerEvent) => {
  const drag = dragRef;
  if (!drag || event.pointerId !== drag.id) return;
  dragRef = null;
  clearTimeout(drag.idle);
  window.removeEventListener('pointermove', onMove);
  window.removeEventListener('pointerup', onUp);
  window.removeEventListener('pointercancel', onUp);
  try {
    drag.element.releasePointerCapture(drag.id);
  } catch {
    drag.capture = false;
  }
  const s = settings();
  if (!drag.moved) {
    if (event.type === 'pointerup' && s.sendToBackOnClick) sendToBack(null);
    else settleFace(valuesFor(drag.card), s);
    return;
  }
  dragging.value = false;
  const dx = event.clientX - drag.startX;
  const dy = event.clientY - drag.startY;
  const [vx, vy] = releaseVelocity(drag.samples, event.timeStamp);
  const distance = Math.hypot(dx, dy);
  const pace = Math.hypot(vx, vy);
  const flick = pace > FLICK_SPEED && distance > 16 && vx * dx + vy * dy > 0;
  if (event.type === 'pointerup' && s.count > 1 && (distance > s.threshold || flick)) {
    sendToBack(pace > 300 ? [vx, vy] : [dx, dy], [vx, vy]);
  } else {
    placeAll({ released: drag.card, velocity: [clamp(vx, -3000, 3000), clamp(vy, -3000, 3000)] });
  }
};

const onDown = (event: PointerEvent, index: number) => {
  if (event.button !== 0 || dragRef) return;
  if (orderRef[0] !== index || flyingMap.has(index)) return;
  const element = event.currentTarget as HTMLDivElement;
  const s = settings();
  const values = valuesFor(index);
  const home = placement(s.layout, 0, index, s.spread, s.depth);
  const bounds = element.getBoundingClientRect();
  values.grabX.set(clamp((event.clientX - bounds.left) / Math.max(bounds.width, 1), 0, 1));
  values.grabY.set(clamp((event.clientY - bounds.top) / Math.max(bounds.height, 1), 0, 1));
  if (!s.reduceMotion) animate(values.lift, PRESS_SCALE, springFor(s, 'press'));
  dragRef = {
    card: index,
    id: event.pointerId,
    element,
    startX: event.clientX,
    startY: event.clientY,
    originX: 0,
    originY: 0,
    homeX: home.x,
    homeY: home.y,
    vx: 0,
    vy: 0,
    idle: 0,
    moved: false,
    progress: 0,
    samples: [[event.clientX, event.clientY, event.timeStamp]]
  };
  if (event.pointerType === 'mouse') event.preventDefault();
  window.addEventListener('pointermove', onMove);
  window.addEventListener('pointerup', onUp);
  window.addEventListener('pointercancel', onUp);
};

const onKeyDown = (event: KeyboardEvent) => {
  if (event.target !== event.currentTarget) return;
  if (['ArrowRight', 'ArrowDown', 'Enter', ' '].includes(event.key)) {
    event.preventDefault();
    sendToBack(null);
  }
};

const onMotionPreference = (event: MediaQueryListEvent) => {
  reduceMotion.value = event.matches;
};

watch(
  count,
  value => {
    const current = order.value;
    if (current.length !== value || current.some(index => index >= value)) {
      const next = current.filter(index => index < value);
      for (let index = 0; index < value; index++) if (!next.includes(index)) next.push(index);
      commit(next);
    }
  },
  { flush: 'sync' }
);

watch(
  [order, shape, () => props.visible, () => props.spread, () => props.depth, () => props.speed, count],
  () => {
    if (!mounted) return;
    orderRef = order.value;
    placeAll({ stagger: 0 });
  },
  { flush: 'post' }
);

watch(shape, () => {
  elementsMap.forEach(entry => entry.render?.());
});

watch(
  () => order.value[0],
  top => {
    if (top !== undefined) props.onChange?.(top);
  }
);

watch(
  [() => props.autoplay, () => props.autoplayDelay, () => props.pauseOnHover, hovered, dragging, order, count],
  (_value, _old, onCleanup) => {
    if (!props.autoplay || count.value < 2 || dragging.value || (props.pauseOnHover && hovered.value)) return;
    const timer = setTimeout(() => sendToBack(null), Math.max(300, props.autoplayDelay));
    onCleanup(() => clearTimeout(timer));
  },
  { immediate: true }
);

if (typeof window !== 'undefined' && window.matchMedia) {
  motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  reduceMotion.value = motionQuery.matches;
}

onMounted(() => {
  alive = true;
  motionQuery?.addEventListener('change', onMotionPreference);
  orderRef = order.value;
  placeAll({ stagger: 0.06 });
  mounted = true;
});

onBeforeUnmount(() => {
  alive = false;
  motionQuery?.removeEventListener('change', onMotionPreference);
  if (dragRef) clearTimeout(dragRef.idle);
  window.removeEventListener('pointermove', onMove);
  window.removeEventListener('pointerup', onUp);
  window.removeEventListener('pointercancel', onUp);
  elementsMap.forEach(entry => {
    if (entry.render) cancelFrame(entry.render);
    entry.render = undefined;
  });
  unsubscribers.forEach(unsubscribe => unsubscribe());
  valuesMap.forEach(group => Object.values(group).forEach(value => value.stop()));
});

const innerRadius = computed(() => Math.max(0, props.radius - props.frame));
const faceStyle = computed(() => ({
  borderRadius: `${props.radius}px`,
  padding: `${props.frame}px`,
  backgroundColor: props.frame > 0 ? props.frameColor : 'transparent',
  boxShadow: props.shadow ? SHADOW : 'none'
}));
</script>

<template>
  <div
    ref="rootRef"
    :class="`stack ${className}`.trim()"
    :style="style"
    tabindex="0"
    role="group"
    aria-label="Card stack"
    @keydown="onKeyDown"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
  >
    <div
      v-for="(card, index) in items"
      :key="index"
      :ref="element => bindElement(index, 'card', element)"
      class="stack-card"
      :data-top="order[0] === index ? '' : undefined"
      :aria-hidden="order[0] === index ? undefined : true"
      :style="{
        cursor: order[0] === index ? (dragging ? 'grabbing' : 'grab') : 'default',
        touchAction: order[0] === index ? 'pan-y' : 'auto'
      }"
      @pointerdown="event => onDown(event, index)"
    >
      <div :ref="element => bindElement(index, 'face', element)" class="stack-card-face" :style="faceStyle">
        <div class="stack-card-content" :style="{ borderRadius: `${innerRadius}px` }">
          <StackNodeView :node="card" />
        </div>
        <div
          :ref="element => bindElement(index, 'shade', element)"
          class="stack-card-shade"
          :style="{ borderRadius: `${radius}px` }"
        />
      </div>
    </div>
  </div>
</template>

<style>
.stack {
  position: relative;
  width: 100%;
  height: 100%;
  outline: none;
}

.stack:focus-visible .stack-card[data-top] .stack-card-face {
  outline: 2px solid currentColor;
  outline-offset: 4px;
}

.stack-card {
  position: absolute;
  inset: 0;
  will-change: transform;
  user-select: none;
  -webkit-user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.stack-card-face {
  position: absolute;
  inset: 0;
  overflow: hidden;
  will-change: transform;
}

.stack-card-content {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.stack-card-content img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
  -webkit-user-drag: none;
}

.stack-card-shade {
  position: absolute;
  inset: 0;
  background: #000;
  pointer-events: none;
}
</style>
