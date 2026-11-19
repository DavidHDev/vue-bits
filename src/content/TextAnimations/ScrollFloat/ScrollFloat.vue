<template>
  <h2
    ref="containerRef"
    :class="`scroll-float ${effect === 'float' ? '' : 'scroll-float--open'} ${containerClassName}`"
  >
    <span v-if="text !== null" class="scroll-float-sr">{{ text }}</span>
    <span
      ref="textRef"
      :class="`scroll-float-text ${textClassName}`"
      :style="text === null ? shiftStyle : undefined"
      :aria-hidden="text !== null ? true : undefined"
    >
      <template v-if="words !== null">
        <template v-for="(word, wordIndex) in words" :key="wordIndex">
          <template v-if="word.trim() === ''">{{ word }}</template>
          <span v-else class="scroll-float-word">
            <span
              v-for="(char, charIndex) in Array.from(word)"
              :key="charIndex"
              class="scroll-float-char"
              :style="shiftStyle"
            >
              {{ char }}
            </span>
          </span>
        </template>
      </template>
      <slot v-else />
    </span>
  </h2>
</template>

<script setup lang="ts">
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Comment,
  Fragment,
  Text,
  computed,
  isRef,
  onBeforeUnmount,
  onMounted,
  useSlots,
  useTemplateRef,
  watch,
  type CSSProperties,
  type Ref,
  type VNode,
  type WatchStopHandle
} from 'vue';

gsap.registerPlugin(ScrollTrigger);

type ScrollFloatEffect = 'float' | 'flip' | 'scatter' | 'blur' | 'wave';
type ScrollFloatSplit = 'chars' | 'words';
type ScrollFloatDirection = 'up' | 'down';
type ScrollFloatOrder = 'start' | 'end' | 'center' | 'edges' | 'random';

interface ScrollFloatProps {
  scrollContainerRef?: Ref<HTMLElement | null> | HTMLElement | null;
  containerClassName?: string;
  textClassName?: string;
  effect?: ScrollFloatEffect;
  splitBy?: ScrollFloatSplit;
  direction?: ScrollFloatDirection;
  order?: ScrollFloatOrder;
  fromColor?: string;
  animationDuration?: number;
  ease?: string;
  scrollStart?: string;
  scrollEnd?: string;
  stagger?: number;
  distance?: number;
  stretch?: number;
  smoothing?: number;
}

const props = withDefaults(defineProps<ScrollFloatProps>(), {
  scrollContainerRef: null,
  containerClassName: '',
  textClassName: '',
  effect: 'float',
  splitBy: 'chars',
  direction: 'up',
  order: 'start',
  fromColor: 'currentColor',
  animationDuration: 1,
  ease: 'back.inOut(2)',
  scrollStart: 'center bottom+=50%',
  scrollEnd: 'bottom bottom-=40%',
  stagger: 0.03,
  distance: 120,
  stretch: 2.3,
  smoothing: 0
});

const clampToScroll = (position: string) =>
  typeof position === 'string' && !position.startsWith('clamp(') ? `clamp(${position})` : position;

const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1);

const smoothstep = (from: number, to: number, value: number) => {
  const k = clamp01((value - from) / (to - from));
  return k * k * (3 - 2 * k);
};

const random = (index: number, salt: number) => {
  const value = Math.sin((index + 1) * 12.9898 + salt * 78.233) * 43758.5453;
  return value - Math.floor(value);
};

const getDelays = (count: number, order: ScrollFloatOrder, stagger: number) => {
  const middle = (count - 1) / 2;
  const ranks = Array.from({ length: count }, (_, index) => {
    if (order === 'end') return count - 1 - index;
    if (order === 'center') return Math.abs(index - middle);
    if (order === 'edges') return middle - Math.abs(index - middle);
    return index;
  });
  if (order === 'random') {
    const shuffled = ranks.map((_, index) => index).sort((a, b) => random(a, 9) - random(b, 9));
    shuffled.forEach((target, rank) => {
      ranks[target] = rank;
    });
  }
  const first = Math.min(...ranks);
  return ranks.map(rank => (rank - first) * Math.max(0, stagger));
};

const flattenNodes = (nodes: VNode[]): VNode[] =>
  nodes.flatMap(node =>
    node.type === Fragment && Array.isArray(node.children) ? flattenNodes(node.children as VNode[]) : [node]
  );

const slots = useSlots();
const containerRef = useTemplateRef<HTMLHeadingElement>('containerRef');
const textRef = useTemplateRef<HTMLSpanElement>('textRef');

const text = computed<string | null>(() => {
  const parts = flattenNodes(slots.default?.() ?? []).filter(node => node.type !== Comment);
  return parts.every(node => node.type === Text)
    ? parts
        .map(node => String(node.children ?? ''))
        .join('')
        .trim()
    : null;
});

const words = computed(() => (text.value === null ? null : text.value.split(/(\s+)/)));

const shiftColor = computed(() => (props.fromColor && props.fromColor !== 'currentColor' ? props.fromColor : null));

const shiftStyle = computed<CSSProperties | undefined>(() =>
  shiftColor.value
    ? { color: `color-mix(in oklab, ${shiftColor.value} calc(var(--scroll-float-mix, 0) * 100%), currentColor)` }
    : undefined
);

const resolveScroller = () => {
  const source = props.scrollContainerRef;
  if (!source) return undefined;
  if (isRef(source)) return source.value;
  return source;
};

let mm: gsap.MatchMedia | null = null;
let stopWatch: WatchStopHandle | null = null;

const teardown = () => {
  mm?.revert();
  mm = null;
};

const build = () => {
  teardown();
  const el = containerRef.value;
  const textEl = textRef.value;
  if (!el || !textEl) return;
  const resolved = resolveScroller();
  if (props.scrollContainerRef && !resolved) return;

  const {
    effect,
    splitBy,
    direction,
    order,
    animationDuration,
    ease,
    scrollStart,
    scrollEnd,
    stagger,
    distance,
    stretch,
    smoothing
  } = props;
  const hasShift = shiftColor.value !== null;
  const scroller = resolved || window;
  const pieces = el.querySelectorAll<HTMLElement>(splitBy === 'words' ? '.scroll-float-word' : '.scroll-float-char');
  const targets: HTMLElement[] = pieces.length ? Array.from(pieces) : [textEl];
  const indexOf = new Map<Element, number>(targets.map((target, index) => [target, index]));
  const at = (fn: (index: number) => number) => (_: number, target: Element) => fn(indexOf.get(target) ?? 0);
  const middle = (targets.length - 1) / 2;
  const edge = (index: number) => (middle > 0 ? (index - middle) / middle : 0);
  const delays = getDelays(targets.length, order, stagger);
  const sign = direction === 'down' ? -1 : 1;
  const reach = Math.max(0, Number(distance) || 0) / 120;
  const squeeze = stretch > 0 ? stretch ** -0.43 : 1;
  const baseEase = gsap.parseEase(ease) || ((p: number) => p);
  const timing = (p: number) => clamp01(baseEase(p));
  const size = () => parseFloat(getComputedStyle(textEl).fontSize) || 16;
  const swell = (p: number) => {
    const t = timing(p);
    return 1 - Math.cos(t * Math.PI * 2.5) * Math.pow(1 - t, 2.6);
  };
  const sway = (p: number) => {
    const t = timing(p);
    return Math.sin(t * Math.PI * 2.5) * Math.pow(1 - t, 2.6);
  };
  const media = gsap.matchMedia();
  mm = media;

  media.add('(prefers-reduced-motion: no-preference)', () => {
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        scroller,
        start: scrollStart,
        end: clampToScroll(scrollEnd),
        scrub: smoothing > 0 ? smoothing : true,
        invalidateOnRefresh: true
      }
    });
    const add = (fromVars: gsap.TweenVars, toVars: gsap.TweenVars) => {
      gsap.set(targets, { willChange: 'opacity, transform', ...fromVars });
      return timeline.fromTo(
        targets,
        { willChange: 'opacity, transform', ...fromVars },
        { duration: animationDuration, stagger: (index: number) => delays[index] || 0, ...toVars },
        0
      );
    };

    if (effect === 'flip') {
      add(
        {
          rotationX: -90 * sign,
          transformPerspective: () => size() * 4,
          transformOrigin: () => `50% 50% ${(-size() * 0.55 * reach).toFixed(2)}`,
          backfaceVisibility: 'hidden'
        },
        { ease, rotationX: 0 }
      );
      add({ opacity: 0 }, { ease: (p: number) => smoothstep(0.05, 0.55, timing(p)), opacity: 1 });
    } else if (effect === 'scatter') {
      add(
        {
          x: at(index => ((random(index, 1) * 2 - 1) * 1.3 - edge(index) * 0.9) * size() * reach),
          y: at(index => sign * (0.35 + random(index, 2)) * size() * 1.1 * reach),
          rotation: at(index => (random(index, 3) < 0.5 ? -1 : 1) * (40 + random(index, 4) * 120)),
          scale: at(index => 0.35 + random(index, 5) * 0.9),
          transformOrigin: '50% 50%'
        },
        { ease, x: 0, y: 0, rotation: 0, scale: 1 }
      );
      add({ opacity: 0 }, { ease: (p: number) => smoothstep(0, 0.4, timing(p)), opacity: 1 });
    } else if (effect === 'blur') {
      add(
        {
          willChange: 'opacity, transform, filter',
          opacity: 0,
          y: () => sign * size() * 0.3 * reach,
          scale: 1.45,
          filter: () => `blur(${(size() * 0.2).toFixed(2)}px)`,
          transformOrigin: '50% 50%'
        },
        { ease, opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }
      );
    } else if (effect === 'wave') {
      add(
        {
          yPercent: 120 * reach * sign,
          scaleY: stretch,
          scaleX: squeeze,
          transformOrigin: sign > 0 ? '50% 100%' : '50% 0%'
        },
        { ease: swell, yPercent: 0, scaleY: 1, scaleX: 1 }
      );
      add({ rotation: 0 }, { ease: sway, rotation: -16 * sign });
      add({ opacity: 0 }, { ease: (p: number) => clamp01(timing(p) * 2.5), opacity: 1 });
    } else {
      add(
        {
          opacity: 0,
          yPercent: 120 * reach * sign,
          scaleY: stretch,
          scaleX: squeeze,
          transformOrigin: sign > 0 ? '50% 0%' : '50% 100%'
        },
        { ease, opacity: 1, yPercent: 0, scaleY: 1, scaleX: 1 }
      );
    }

    if (hasShift) {
      add({ '--scroll-float-mix': 1 }, { ease: (p: number) => smoothstep(0.5, 1, timing(p)), '--scroll-float-mix': 0 });
    }
  });
};

onMounted(() => {
  stopWatch = watch(
    () => [
      resolveScroller(),
      text.value,
      props.effect,
      props.splitBy,
      props.direction,
      props.order,
      shiftColor.value,
      props.animationDuration,
      props.ease,
      props.scrollStart,
      props.scrollEnd,
      props.stagger,
      props.distance,
      props.stretch,
      props.smoothing
    ],
    build,
    { flush: 'post', immediate: true }
  );
});

onBeforeUnmount(() => {
  stopWatch?.();
  stopWatch = null;
  teardown();
});
</script>

<style>
.scroll-float {
  margin: 20px 0;
  overflow: hidden;
}

.scroll-float--open {
  overflow: visible;
  overflow-x: clip;
}

.scroll-float-text {
  display: inline-block;
  font-size: clamp(1.6rem, 8vw, 10rem);
  font-weight: 900;
  text-align: center;
  line-height: 1.5;
}

.scroll-float-word {
  display: inline-block;
  white-space: nowrap;
}

.scroll-float-char {
  display: inline-block;
}

.scroll-float-sr {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
