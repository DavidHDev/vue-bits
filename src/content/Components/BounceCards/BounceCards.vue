<template>
  <div ref="rootRef" :class="['bounce-cards', className]" :style="rootStyle">
    <div
      v-for="(card, i) in cards"
      :key="i"
      :ref="el => setCardRef(el as HTMLDivElement | null, i)"
      :class="['bounce-cards__card', { 'bounce-cards__card--clickable': settings.clickable }]"
      v-bind="settings.clickable ? { role: 'button', tabindex: 0, 'aria-label': card.alt || `Card ${i + 1}` } : {}"
    >
      <img v-if="card.src" :src="card.src" :alt="card.alt" draggable="false" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch, type CSSProperties } from 'vue';

export type BounceCardImage = string | { src: string; alt?: string };

interface BounceCardsProps {
  images?: BounceCardImage[];
  className?: string;
  style?: CSSProperties;
  containerWidth?: number;
  containerHeight?: number;
  cardSize?: number;
  spread?: number;
  rotation?: number;
  arc?: number;
  animationDelay?: number;
  animationStagger?: number;
  bounciness?: number;
  enableHover?: boolean;
  pushDistance?: number;
  hoverScale?: number;
  borderWidth?: number;
  borderColor?: string;
  radius?: number;
  shadow?: boolean;
  transformStyles?: string[];
  onCardClick?: (index: number) => void;
}

type Slot = { x: number; y: number; rotate: number };

type Body = {
  x: number;
  y: number;
  rotate: number;
  scale: number;
  vx: number;
  vy: number;
  vr: number;
  vs: number;
  born: number;
};

const props = withDefaults(defineProps<BounceCardsProps>(), {
  images: () => [],
  className: '',
  style: undefined,
  containerWidth: 400,
  containerHeight: 400,
  cardSize: 200,
  spread: 85,
  rotation: 10,
  arc: 0,
  animationDelay: 0.5,
  animationStagger: 0.06,
  bounciness: 0.6,
  enableHover: true,
  pushDistance: 160,
  hoverScale: 1.06,
  borderWidth: 5,
  borderColor: '#ffffff',
  radius: 25,
  shadow: true,
  transformStyles: undefined,
  onCardClick: undefined
});

const PATTERN = [1, 0.5, -0.3, -1, 0.2, 0.75, -0.6, 0.35, -0.85, 0.1];

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const parseTransform = (value: string | undefined): Slot | null => {
  if (typeof value !== 'string') return null;
  const rotate = value.match(/rotate\(\s*(-?[\d.]+)deg\s*\)/);
  const translate = value.match(/translate\(\s*(-?[\d.]+)px(?:\s*,\s*(-?[\d.]+)px)?\s*\)/);
  return {
    x: translate ? Number(translate[1]) : 0,
    y: translate && translate[2] ? Number(translate[2]) : 0,
    rotate: rotate ? Number(rotate[1]) : 0
  };
};

const toCard = (item: BounceCardImage) =>
  typeof item === 'string' ? { src: item, alt: '' } : { src: item?.src, alt: item?.alt ?? '' };

const rootRef = ref<HTMLDivElement | null>(null);
const cardRefs: (HTMLDivElement | null)[] = [];
let wake: (() => void) | null = null;

const setCardRef = (el: HTMLDivElement | null, i: number) => {
  cardRefs[i] = el;
  if (el && !el.style.zIndex) el.style.zIndex = String(i + 1);
};

const cards = computed(() => props.images.map(toCard));

const settings = computed(() => {
  const count = cards.value.length;
  const middle = (count - 1) / 2;
  const reach = Math.max(1, middle);
  const slots = cards.value.map((_, i): Slot => {
    const custom = props.transformStyles ? parseTransform(props.transformStyles[i]) : null;
    if (custom) return custom;
    const offset = i - middle;
    return {
      x: offset * props.spread,
      y: props.arc * (offset / reach) ** 2,
      rotate: props.rotation * PATTERN[i % PATTERN.length]
    };
  });
  return {
    slots,
    cardSize: Math.max(10, props.cardSize),
    delay: Math.max(0, props.animationDelay),
    stagger: Math.max(0, props.animationStagger),
    bounciness: clamp(props.bounciness, 0, 1),
    enableHover: props.enableHover,
    pushDistance: props.pushDistance,
    hoverScale: clamp(props.hoverScale, 0.5, 2),
    clickable: typeof props.onCardClick === 'function'
  };
});

const rootStyle = computed(
  () =>
    ({
      width: `${props.containerWidth}px`,
      height: `${props.containerHeight}px`,
      '--bounce-cards-size': `${settings.value.cardSize}px`,
      '--bounce-cards-border': `${Math.max(0, props.borderWidth)}px`,
      '--bounce-cards-border-color': props.borderColor,
      '--bounce-cards-radius': `${Math.max(0, props.radius)}px`,
      '--bounce-cards-shadow': props.shadow
        ? '0 1px 2px rgba(0, 0, 0, 0.12), 0 10px 28px -6px rgba(0, 0, 0, 0.32)'
        : 'none',
      '--bounce-cards-shadow-active': props.shadow
        ? '0 2px 4px rgba(0, 0, 0, 0.14), 0 22px 44px -10px rgba(0, 0, 0, 0.42)'
        : 'none',
      ...props.style
    }) as CSSProperties
);

let cleanup: (() => void) | null = null;

onMounted(() => {
  const root = rootRef.value;
  if (!root) return;

  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  const bodies: Body[] = [];
  const state = { hovered: -1, time: 0, layer: -1 };
  let raf = 0;
  let last = performance.now();
  let alive = true;

  const body = (i: number): Body => {
    if (!bodies[i]) {
      const slot = settings.value.slots[i] ?? { x: 0, y: 0, rotate: 0 };
      bodies[i] = {
        x: slot.x,
        y: slot.y,
        rotate: slot.rotate,
        scale: reduce ? 1 : 0,
        vx: 0,
        vy: 0,
        vr: 0,
        vs: 0,
        born: state.time
      };
    }
    return bodies[i];
  };

  const step = (
    value: number,
    velocity: number,
    target: number,
    stiffness: number,
    damping: number,
    dt: number
  ): [number, number] => {
    const next = velocity + ((target - value) * stiffness - velocity * damping) * dt;
    return [value + next * dt, next];
  };

  const frame = (now: number) => {
    raf = 0;
    if (!alive) return;
    const s = settings.value;
    const dt = Math.min(1 / 30, Math.max(1 / 240, (now - last) / 1000));
    last = now;
    state.time += dt;

    const hovered = s.enableHover ? state.hovered : -1;
    const popStiffness = 170;
    const popDamping = 2 * (1 - 0.85 * s.bounciness) * Math.sqrt(popStiffness);
    const moveStiffness = 210;
    const moveDamping = 2 * (reduce ? 1 : 0.72) * Math.sqrt(moveStiffness);
    const substeps = Math.ceil(dt / (1 / 240));
    const h = dt / substeps;
    let moving = 0;

    for (let i = 0; i < s.slots.length; i++) {
      const el = cardRefs[i];
      if (!el) continue;
      const card = body(i);
      const slot = s.slots[i];
      const appeared = reduce || state.time - card.born >= s.delay + i * s.stagger;
      let targetX = slot.x;
      let targetY = slot.y;
      let targetRotate = slot.rotate;
      let targetScale = appeared ? 1 : 0;
      if (hovered >= 0 && appeared) {
        if (i === hovered) {
          targetY = slot.y - s.cardSize * 0.04;
          targetRotate = 0;
          targetScale = s.hoverScale;
        } else {
          targetX = slot.x + Math.sign(i - hovered) * s.pushDistance;
        }
      }
      for (let k = 0; k < substeps; k++) {
        [card.x, card.vx] = step(card.x, card.vx, targetX, moveStiffness, moveDamping, h);
        [card.y, card.vy] = step(card.y, card.vy, targetY, moveStiffness, moveDamping, h);
        [card.rotate, card.vr] = step(card.rotate, card.vr, targetRotate, moveStiffness, moveDamping, h);
        if (reduce) {
          card.scale = targetScale;
          card.vs = 0;
        } else {
          [card.scale, card.vs] = step(card.scale, card.vs, targetScale, popStiffness, popDamping, h);
        }
      }
      moving +=
        Math.abs(card.vx) +
        Math.abs(card.vy) +
        Math.abs(card.vr) +
        Math.abs(card.vs) * 100 +
        Math.abs(targetX - card.x) +
        Math.abs(targetY - card.y) +
        Math.abs(targetRotate - card.rotate) +
        Math.abs(targetScale - card.scale) * 100 +
        (appeared ? 0 : 1);
      el.style.transform = `translate(-50%, -50%) translate3d(${card.x.toFixed(2)}px, ${card.y.toFixed(2)}px, 0) rotate(${card.rotate.toFixed(3)}deg) scale(${Math.max(0, card.scale).toFixed(4)})`;
    }

    if (state.layer !== hovered) {
      state.layer = hovered;
      cardRefs.forEach((el, i) => {
        if (!el) return;
        el.style.zIndex = i === hovered ? String(s.slots.length + 1) : String(i + 1);
        el.toggleAttribute('data-active', i === hovered);
      });
    }

    if (moving > 0.02) raf = requestAnimationFrame(frame);
  };

  const wakeUp = () => {
    if (raf || !alive) return;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  };
  wake = wakeUp;

  const pick = (event: MouseEvent): number => {
    const s = settings.value;
    const rect = root.getBoundingClientRect();
    const px = event.clientX - rect.left - rect.width / 2;
    const py = event.clientY - rect.top - rect.height / 2;
    let best = -1;
    let distance = Infinity;
    s.slots.forEach((slot, i) => {
      const gap = Math.abs(px - slot.x);
      if (gap < distance) {
        distance = gap;
        best = i;
      }
    });
    if (best < 0) return -1;
    const slot = s.slots[best];
    const half = s.cardSize / 2;
    if (Math.abs(py - slot.y) > half + 12 || distance > half + 12) return -1;
    if (state.hovered >= 0 && state.hovered !== best) {
      const current = s.slots[state.hovered];
      if (current && Math.abs(px - current.x) - distance < 6) return state.hovered;
    }
    return best;
  };

  const onMove = (event: PointerEvent) => {
    const next = pick(event);
    if (next !== state.hovered) {
      state.hovered = next;
      wakeUp();
    }
  };
  const onLeave = () => {
    if (state.hovered !== -1) {
      state.hovered = -1;
      wakeUp();
    }
  };
  const onClick = (event: MouseEvent) => {
    const index = pick(event);
    if (index < 0) return;
    const card = bodies[index];
    if (card && !reduce) card.vs -= 2.2;
    wakeUp();
    props.onCardClick?.(index);
  };
  const onFocus = (event: FocusEvent) => {
    const index = cardRefs.indexOf(event.target as HTMLDivElement);
    if (index >= 0) {
      state.hovered = index;
      wakeUp();
    }
  };
  const onKey = (event: KeyboardEvent) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    const index = cardRefs.indexOf(event.target as HTMLDivElement);
    if (index < 0 || !settings.value.clickable) return;
    event.preventDefault();
    if (bodies[index] && !reduce) bodies[index].vs -= 2.2;
    wakeUp();
    props.onCardClick?.(index);
  };

  root.addEventListener('pointermove', onMove);
  root.addEventListener('pointerdown', onMove);
  root.addEventListener('pointerleave', onLeave);
  root.addEventListener('click', onClick);
  root.addEventListener('focusin', onFocus);
  root.addEventListener('focusout', onLeave);
  root.addEventListener('keydown', onKey);
  wakeUp();

  cleanup = () => {
    alive = false;
    cancelAnimationFrame(raf);
    wake = null;
    root.removeEventListener('pointermove', onMove);
    root.removeEventListener('pointerdown', onMove);
    root.removeEventListener('pointerleave', onLeave);
    root.removeEventListener('click', onClick);
    root.removeEventListener('focusin', onFocus);
    root.removeEventListener('focusout', onLeave);
    root.removeEventListener('keydown', onKey);
  };
});

watch(settings, () => wake?.(), { flush: 'post' });

onBeforeUnmount(() => {
  cleanup?.();
  cleanup = null;
});
</script>

<style>
.bounce-cards {
  position: relative;
  touch-action: pan-y;
  -webkit-tap-highlight-color: transparent;
}

.bounce-cards__card {
  position: absolute;
  top: 50%;
  left: 50%;
  width: var(--bounce-cards-size);
  aspect-ratio: 1;
  overflow: hidden;
  border: var(--bounce-cards-border) solid var(--bounce-cards-border-color);
  border-radius: var(--bounce-cards-radius);
  background: var(--bounce-cards-border-color);
  box-shadow: var(--bounce-cards-shadow);
  transform: translate(-50%, -50%) scale(0);
  transition: box-shadow 0.3s ease;
  will-change: transform;
}

.bounce-cards__card[data-active] {
  box-shadow: var(--bounce-cards-shadow-active);
}

.bounce-cards__card--clickable {
  cursor: pointer;
}

.bounce-cards__card--clickable:focus-visible {
  outline: 2px solid var(--bounce-cards-border-color);
  outline-offset: 3px;
}

.bounce-cards__card img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
  user-select: none;
}
</style>
