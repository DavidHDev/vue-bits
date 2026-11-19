<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch, type CSSProperties } from 'vue';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export type SplitBy = 'char' | 'word' | 'line';
export type Hinge = 'top' | 'bottom' | 'left' | 'right';
export type Trigger = 'mount' | 'hover' | 'scroll' | 'loop';
export type StaggerFrom = 'start' | 'center' | 'end' | 'edges' | 'random';
export type FoldStyle = 'paper' | 'blinds' | 'flip';
type Axis = 'rotateX' | 'rotateY';

interface FoldTextProps {
  text?: string;
  splitBy?: SplitBy;
  hinge?: Hinge;
  foldStyle?: FoldStyle;
  duration?: number;
  stagger?: number;
  staggerFrom?: StaggerFrom;
  foldAngle?: number;
  ease?: string;
  perspective?: number;
  creaseShading?: number;
  trigger?: Trigger;
  loopDelay?: number;
  hoverRefold?: boolean;
  refoldRadius?: number;
  refoldAngle?: number;
  fontSize?: string | number;
  fontWeight?: string | number;
  color?: string;
  className?: string;
  style?: CSSProperties;
}

type Piece = {
  element: HTMLElement;
  parts: HTMLElement[];
  t: number;
  f: number;
  r: number;
  aim: number;
};

type Point = { x: number; y: number };

type PieceItem = { type: 'piece'; key: string; content: string; isLine: boolean };
type Item =
  | PieceItem
  | { type: 'br'; key: string }
  | { type: 'space'; key: string; text: string }
  | { type: 'word'; key: string; pieces: PieceItem[] };

const HINGES: Record<Hinge, { origin: string; axis: Axis; sign: number }> = {
  top: { origin: '50% 0%', axis: 'rotateX', sign: -1 },
  bottom: { origin: '50% 100%', axis: 'rotateX', sign: 1 },
  left: { origin: '0% 50%', axis: 'rotateY', sign: 1 },
  right: { origin: '100% 50%', axis: 'rotateY', sign: -1 }
};

const SLATS: Record<Axis, { origins: string[]; clips: string[] }> = {
  rotateX: {
    origins: ['50% 25%', '50% 75%'],
    clips: ['inset(-40% -20% 50% -20%)', 'inset(50% -20% -40% -20%)']
  },
  rotateY: {
    origins: ['25% 50%', '75% 50%'],
    clips: ['inset(-40% 50% -40% -20%)', 'inset(-40% -20% -40% 50%)']
  }
};

const FOLD_STYLES: FoldStyle[] = ['paper', 'blinds', 'flip'];
const SLAT_DELAY = 0.24;
const FOLDED: CSSProperties = { opacity: 0 };

const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));

const props = withDefaults(defineProps<FoldTextProps>(), {
  text: 'Design unfolds',
  splitBy: 'char',
  hinge: 'top',
  foldStyle: 'paper',
  duration: 0.65,
  stagger: 0.045,
  staggerFrom: 'start',
  foldAngle: 92,
  ease: 'power3.out',
  perspective: 700,
  creaseShading: 0.55,
  trigger: 'mount',
  loopDelay: 1.4,
  hoverRefold: false,
  refoldRadius: 140,
  refoldAngle: 45,
  fontSize: 80,
  fontWeight: 800,
  color: 'currentColor',
  className: '',
  style: () => ({})
});

const rootRef = ref<HTMLSpanElement | null>(null);

const safeHinge = computed<Hinge>(() => (HINGES[props.hinge] ? props.hinge : 'top'));
const hingeConfig = computed(() => HINGES[safeHinge.value]);
const safeStyle = computed<FoldStyle>(() => (FOLD_STYLES.includes(props.foldStyle) ? props.foldStyle : 'paper'));
const safeCrease = computed(() => clamp(props.creaseShading, 0, 1));
const safeAngle = computed(() => clamp(props.foldAngle, 0, 180));
const safeStagger = computed(() => Math.max(0, props.stagger));
const safeDelay = computed(() => Math.max(0, props.loopDelay));
const safeRadius = computed(() => Math.max(1, props.refoldRadius));
const safeRefold = computed(() => clamp(props.refoldAngle, 0, 180));
const startsFolded = computed(() => props.trigger !== 'hover');

const items = computed<Item[]>(() => {
  const piece = (content: string, key: string, isLine = false): PieceItem => ({
    type: 'piece',
    key,
    content,
    isLine
  });

  if (props.splitBy === 'line') {
    return props.text.split('\n').map((line, index) => piece(line || ' ', `line-${index}`, true));
  }

  return props.text.split(/(\s+)/).flatMap((part, partIndex): Item[] => {
    if (!part) return [];

    if (/^\s+$/.test(part)) {
      return part
        .split('\n')
        .flatMap((spaces, lineIndex): (Item | null)[] => [
          lineIndex > 0 ? { type: 'br', key: `br-${partIndex}-${lineIndex}` } : null,
          spaces ? { type: 'space', key: `space-${partIndex}-${lineIndex}`, text: spaces } : null
        ])
        .filter((item): item is Item => item !== null);
    }

    if (props.splitBy === 'word') return [piece(part, `word-${partIndex}`)];

    return [
      {
        type: 'word',
        key: `word-${partIndex}`,
        pieces: Array.from(part).map((char, charIndex) => piece(char, `char-${partIndex}-${charIndex}`))
      }
    ];
  });
});

const pieceStyle = computed(() => (startsFolded.value ? FOLDED : undefined));

const rootStyle = computed<CSSProperties>(
  () =>
    ({
      '--fold-text-font-size': typeof props.fontSize === 'number' ? `${props.fontSize}px` : props.fontSize,
      '--fold-text-font-weight': props.fontWeight,
      '--fold-text-color': props.color,
      '--fold-perspective': `${Math.max(120, props.perspective)}px`,
      ...props.style
    }) as CSSProperties
);

let cleanup: (() => void) | null = null;

const setup = () => {
  cleanup?.();
  cleanup = null;

  const root = rootRef.value;
  if (!root) return;

  const elements = Array.from(root.querySelectorAll<HTMLElement>('.fold-text-piece'));
  if (!elements.length) return;

  const style = safeStyle.value;
  const fromFolded = startsFolded.value;
  const trigger = props.trigger;
  const radius = safeRadius.value;
  const loopDelay = safeDelay.value;
  const duration = props.duration;
  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const { axis, sign, origin } = hingeConfig.value;
  const slats = SLATS[axis];
  const unfoldEase = gsap.parseEase(reduceMotion ? 'power1.out' : props.ease) || gsap.parseEase('power3.out');
  const foldEase = gsap.parseEase(reduceMotion ? 'power1.in' : 'power2.in');
  const angle = reduceMotion ? 0 : style === 'flip' ? 180 : safeAngle.value;
  const crease = reduceMotion ? 0 : safeCrease.value;
  const refold = props.hoverRefold && !reduceMotion ? safeRefold.value : 0;
  const lift = style === 'flip' && !reduceMotion ? 0.45 : 0;
  const unfoldDuration = reduceMotion ? Math.min(duration, 0.22) : duration;
  const staggerVars: gsap.StaggerVars = {
    each: reduceMotion ? Math.min(safeStagger.value, 0.02) : safeStagger.value,
    from: props.staggerFrom
  };

  const pieces = elements.map((element): Piece => {
    const parts = style === 'blinds' ? (Array.from(element.children) as HTMLElement[]) : [element];
    if (style === 'blinds') {
      element.style.opacity = '1';
      parts.forEach((part, index) => {
        part.style.transformOrigin = slats.origins[index];
        if (index > 0) part.style.clipPath = slats.clips[index];
      });
    } else {
      element.style.transformOrigin = style === 'flip' ? '50% 50%' : origin;
      element.style.backfaceVisibility = style === 'flip' ? 'visible' : '';
    }
    return { element, parts, t: fromFolded ? 0 : 1, f: 0, r: 0, aim: 0 };
  });

  const shade = (progress: number, tilt: number) => String(crease * clamp(1 - progress + tilt / 90, 0, 1));

  const render = () => {
    pieces.forEach(piece => {
      const tilt = piece.r * refold;

      if (style === 'blinds') {
        let resting = tilt < 0.05;
        piece.parts.forEach((part, index) => {
          const offset = index * SLAT_DELAY;
          const open = unfoldEase(clamp((piece.t - offset) / (1 - SLAT_DELAY), 0, 1));
          const close = foldEase(clamp((piece.f - offset) / (1 - SLAT_DELAY), 0, 1));
          const progress = open * (1 - close);
          if (Math.abs(1 - progress) > 0.002) resting = false;
          part.style.transform = `${axis}(${sign * ((1 - progress) * angle + tilt)}deg)`;
          part.style.opacity = String(clamp(progress, 0, 1));
          part.style.setProperty('--fold-crease', shade(progress, tilt));
        });
        piece.parts[0].style.clipPath = resting ? 'none' : slats.clips[0];
        piece.parts[1].style.visibility = resting ? 'hidden' : 'visible';
        return;
      }

      const progress = unfoldEase(piece.t) * (1 - foldEase(piece.f));
      const rise = lift * Math.sin(Math.PI * clamp(progress, 0, 1));
      const turn = `${axis}(${sign * ((1 - progress) * angle + tilt)}deg)`;
      piece.element.style.transform = rise > 0.001 ? `translateZ(${rise}em) ${turn}` : turn;
      piece.element.style.opacity = String(clamp(progress, 0, 1));
      piece.element.style.setProperty('--fold-crease', shade(progress, tilt));
    });
  };

  let timeline: gsap.core.Timeline | null = null;
  let scrollTrigger: ScrollTrigger | null = null;

  const play = (loop: boolean) => {
    timeline?.kill();
    timeline = gsap.timeline({ onUpdate: render, ...(loop ? { repeat: -1, repeatDelay: 0.35 } : {}) });
    timeline.fromTo(pieces, { t: 0, f: 0 }, { t: 1, duration: unfoldDuration, ease: 'none', stagger: staggerVars });
    if (loop) {
      timeline.to(
        pieces,
        { f: 1, duration: unfoldDuration * 0.75, ease: 'none', stagger: staggerVars },
        `+=${loopDelay}`
      );
    }
    render();
  };

  const handleEnter = () => play(false);

  if (trigger === 'hover') {
    render();
    root.addEventListener('mouseenter', handleEnter);
  } else if (trigger === 'scroll') {
    render();
    scrollTrigger = ScrollTrigger.create({
      trigger: root,
      start: 'top 82%',
      once: true,
      onEnter: handleEnter
    });
  } else {
    play(trigger === 'loop');
  }

  let pointer: Point | null = null;
  let centers: Point[] | null = null;
  let measured: { width: number; height: number } | null = null;
  let relaxing = false;

  const measure = (box: DOMRect) => {
    centers = pieces.map(piece => {
      const rect = (piece.element.parentElement ?? piece.element).getBoundingClientRect();
      return { x: rect.left - box.left + rect.width / 2, y: rect.top - box.top + rect.height / 2 };
    });
    measured = { width: box.width, height: box.height };
  };

  const relax = (_time: number, deltaTime: number) => {
    const step = Math.min(deltaTime, 64) / 1000;
    let moving = false;
    pieces.forEach(piece => {
      const rate = piece.aim > piece.r ? 14 : 6;
      piece.r += (piece.aim - piece.r) * (1 - Math.exp(-rate * step));
      if (Math.abs(piece.aim - piece.r) > 0.001) moving = true;
      else piece.r = piece.aim;
    });
    render();
    if (!moving) {
      gsap.ticker.remove(relax);
      relaxing = false;
    }
  };

  const aim = () => {
    const box = root.getBoundingClientRect();
    const near =
      pointer &&
      pointer.x > box.left - radius &&
      pointer.x < box.right + radius &&
      pointer.y > box.top - radius &&
      pointer.y < box.bottom + radius;
    if (
      near &&
      (!centers || !measured || Math.abs(box.width - measured.width) + Math.abs(box.height - measured.height) > 1)
    ) {
      measure(box);
    }
    let changed = false;
    pieces.forEach((piece, index) => {
      let value = 0;
      if (near && pointer && centers) {
        const center = centers[index];
        const distance = Math.hypot(box.left + center.x - pointer.x, box.top + center.y - pointer.y) / radius;
        if (distance < 1) value = 1 - distance * distance * (3 - 2 * distance);
      }
      if (value !== piece.aim) changed = true;
      piece.aim = value;
    });
    if (changed && !relaxing) {
      relaxing = true;
      gsap.ticker.add(relax);
    }
  };

  const handleMove = (event: PointerEvent) => {
    pointer = { x: event.clientX, y: event.clientY };
    aim();
  };

  const handleLeave = () => {
    pointer = null;
    aim();
  };

  const handleScroll = () => {
    if (pointer) aim();
  };

  if (refold) {
    window.addEventListener('pointermove', handleMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true, capture: true });
    document.documentElement.addEventListener('pointerleave', handleLeave);
  }

  cleanup = () => {
    root.removeEventListener('mouseenter', handleEnter);
    window.removeEventListener('pointermove', handleMove);
    window.removeEventListener('scroll', handleScroll, { capture: true });
    document.documentElement.removeEventListener('pointerleave', handleLeave);
    gsap.ticker.remove(relax);
    scrollTrigger?.kill();
    timeline?.kill();
    gsap.killTweensOf(pieces);
  };
};

onMounted(setup);

watch(
  () => [
    items.value,
    hingeConfig.value,
    safeStyle.value,
    props.duration,
    safeStagger.value,
    props.staggerFrom,
    safeAngle.value,
    props.ease,
    safeCrease.value,
    props.trigger,
    safeDelay.value,
    props.hoverRefold,
    safeRadius.value,
    safeRefold.value,
    startsFolded.value
  ],
  setup,
  { flush: 'post' }
);

onBeforeUnmount(() => {
  cleanup?.();
  cleanup = null;
});
</script>

<template>
  <span ref="rootRef" :class="`fold-text ${className}`.trim()" :style="rootStyle">
    <span class="fold-text-sr-only">{{ text }}</span>
    <span class="fold-text-visual" aria-hidden="true">
      <template v-for="item in items" :key="item.key">
        <br v-if="item.type === 'br'" />
        <template v-else-if="item.type === 'space'">{{ item.text }}</template>
        <span v-else-if="item.type === 'word'" class="fold-text-word">
          <span v-for="piece in item.pieces" :key="piece.key" class="fold-text-segment">
            <span
              v-if="safeStyle === 'blinds'"
              class="fold-text-piece"
              :data-fold-hinge="safeHinge"
              data-fold-style="blinds"
              :style="pieceStyle"
            >
              <span class="fold-text-slat" :data-fold-text="piece.content">{{ piece.content }}</span>
              <span class="fold-text-slat" data-fold-slat="b" :data-fold-text="piece.content">{{ piece.content }}</span>
            </span>
            <span
              v-else
              class="fold-text-piece"
              :data-fold-hinge="safeHinge"
              :data-fold-style="safeStyle"
              :data-fold-text="piece.content"
              :style="pieceStyle"
            >
              {{ piece.content }}
            </span>
          </span>
        </span>
        <span v-else class="fold-text-segment" :data-fold-split="item.isLine ? 'line' : undefined">
          <span
            v-if="safeStyle === 'blinds'"
            class="fold-text-piece"
            :data-fold-hinge="safeHinge"
            data-fold-style="blinds"
            :style="pieceStyle"
          >
            <span class="fold-text-slat" :data-fold-text="item.content">{{ item.content }}</span>
            <span class="fold-text-slat" data-fold-slat="b" :data-fold-text="item.content">{{ item.content }}</span>
          </span>
          <span
            v-else
            class="fold-text-piece"
            :data-fold-hinge="safeHinge"
            :data-fold-style="safeStyle"
            :data-fold-text="item.content"
            :style="pieceStyle"
          >
            {{ item.content }}
          </span>
        </span>
      </template>
    </span>
  </span>
</template>

<style>
.fold-text {
  display: inline-block;
  color: var(--fold-text-color, currentColor);
  font-size: var(--fold-text-font-size, inherit);
  font-weight: var(--fold-text-font-weight, inherit);
  line-height: 0.95;
  letter-spacing: -0.04em;
  white-space: pre-wrap;
  user-select: text;
}

.fold-text-sr-only {
  position: absolute;
  user-select: none;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.fold-text-visual {
  display: inline;
}

.fold-text-word {
  display: inline-block;
  white-space: nowrap;
}

.fold-text-segment {
  display: inline-block;
  perspective: var(--fold-perspective, 700px);
  vertical-align: baseline;
}

.fold-text-segment[data-fold-split='line'] {
  display: block;
}

.fold-text-piece {
  --fold-shade: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.58) 0%,
    rgba(0, 0, 0, 0.22) 42%,
    rgba(255, 255, 255, 0.26) 100%
  );
  position: relative;
  display: inline-block;
  backface-visibility: hidden;
  transform-origin: 50% 0%;
}

.fold-text-piece[data-fold-hinge='bottom'] {
  --fold-shade: linear-gradient(0deg, rgba(0, 0, 0, 0.58) 0%, rgba(0, 0, 0, 0.22) 42%, rgba(255, 255, 255, 0.26) 100%);
  transform-origin: 50% 100%;
}

.fold-text-piece[data-fold-hinge='left'] {
  --fold-shade: linear-gradient(90deg, rgba(0, 0, 0, 0.58) 0%, rgba(0, 0, 0, 0.22) 42%, rgba(255, 255, 255, 0.26) 100%);
  transform-origin: 0% 50%;
}

.fold-text-piece[data-fold-hinge='right'] {
  --fold-shade: linear-gradient(
    270deg,
    rgba(0, 0, 0, 0.58) 0%,
    rgba(0, 0, 0, 0.22) 42%,
    rgba(255, 255, 255, 0.26) 100%
  );
  transform-origin: 100% 50%;
}

.fold-text-piece[data-fold-style='blinds'] {
  perspective: var(--fold-perspective, 700px);
}

.fold-text-slat {
  position: relative;
  display: inline-block;
  backface-visibility: hidden;
}

.fold-text-slat[data-fold-slat='b'] {
  position: absolute;
  inset: 0;
  visibility: hidden;
}

.fold-text-piece::after,
.fold-text-slat::after {
  content: attr(data-fold-text);
  position: absolute;
  inset: 0;
  pointer-events: none;
  color: transparent;
  -webkit-text-fill-color: transparent;
  background-image: var(--fold-shade);
  -webkit-background-clip: text;
  background-clip: text;
  opacity: var(--fold-crease, 0);
}

@media (prefers-reduced-motion: reduce) {
  .fold-text-piece,
  .fold-text-slat {
    transform: none !important;
  }

  .fold-text-piece::after,
  .fold-text-slat::after {
    opacity: 0 !important;
  }
}
</style>
