<template>
  <h2 ref="containerRef" :class="`scroll-reveal ${containerClassName}`" :aria-label="text ?? undefined">
    <span ref="textRef" :class="`scroll-reveal-text ${textClassName}`" :aria-hidden="text === null ? undefined : true">
      <template v-if="words !== null">
        <template v-for="(word, index) in words" :key="index">
          <template v-if="word.trim() === ''">{{ word }}</template>
          <span v-else class="scroll-reveal-word">
            <template v-if="splitBy === 'chars'">
              <span v-for="(char, charIndex) in Array.from(word)" :key="charIndex" class="scroll-reveal-piece">
                {{ char }}
              </span>
            </template>
            <span v-else class="scroll-reveal-piece">{{ word }}</span>
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
  type Ref,
  type VNode,
  type WatchStopHandle
} from 'vue';

gsap.registerPlugin(ScrollTrigger);

type RevealSplit = 'words' | 'chars' | 'lines';
type RevealEffect = 'fade' | 'rise' | 'flip' | 'scale';
type RevealMode = 'scrub' | 'enter';

interface ScrollRevealProps {
  scrollContainerRef?: Ref<HTMLElement | null> | HTMLElement | null;
  enableBlur?: boolean;
  baseOpacity?: number;
  baseRotation?: number;
  blurStrength?: number;
  baseOffset?: number;
  stagger?: number;
  smoothing?: number;
  splitBy?: RevealSplit;
  effect?: RevealEffect;
  mode?: RevealMode;
  duration?: number;
  highlightColor?: string;
  containerClassName?: string;
  textClassName?: string;
  rotationEnd?: string;
  wordAnimationEnd?: string;
}

interface RevealLook {
  effect: RevealEffect;
  masked: boolean;
  baseOpacity: number;
  blur: number;
  offset: number;
  highlightColor: string;
}

const props = withDefaults(defineProps<ScrollRevealProps>(), {
  scrollContainerRef: null,
  enableBlur: true,
  baseOpacity: 0.1,
  baseRotation: 3,
  blurStrength: 4,
  baseOffset: 0,
  stagger: 0.05,
  smoothing: 0,
  splitBy: 'words',
  effect: 'fade',
  mode: 'scrub',
  duration: 0.8,
  highlightColor: '',
  containerClassName: '',
  textClassName: '',
  rotationEnd: 'bottom bottom',
  wordAnimationEnd: 'bottom bottom'
});

const SCRUB_SPAN = 0.5;
const RISE_MASK = 'inset(-1em -1em -0.15em -1em)';

const clampToScroll = (position: string) =>
  typeof position === 'string' && !position.startsWith('clamp(') ? `clamp(${position})` : position;

const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1);
const smooth = (value: number) => value * value * (3 - 2 * value);
const easeOut = (value: number) => 1 - Math.pow(1 - value, 3);
const easeBack = (value: number, overshoot: number) => {
  const shifted = value - 1;
  return 1 + (overshoot + 1) * shifted * shifted * shifted + overshoot * shifted * shifted;
};
const glowAt = (t: number) => (t <= 0 || t >= 1 ? 0 : t < 0.35 ? smooth(t / 0.35) : 1 - smooth((t - 0.35) / 0.65));

const paintPiece = (piece: HTMLElement, t: number, look: RevealLook) => {
  let reveal = t;
  let fadeIn = t;
  let motion = '';
  if (look.effect === 'rise') {
    reveal = easeOut(t);
    fadeIn = clamp01(reveal * 1.25);
    if (reveal < 1) {
      motion = look.masked
        ? `translateY(${((1 - reveal) * 100).toFixed(2)}%) translateY(${((1 - reveal) * 0.2).toFixed(3)}em)`
        : `translateY(${((1 - reveal) * 0.8).toFixed(3)}em)`;
    }
  } else if (look.effect === 'flip') {
    reveal = easeBack(t, 1.2);
    fadeIn = clamp01(t * 2);
    if (t < 1) motion = `perspective(6em) rotateX(${((1 - reveal) * 90).toFixed(2)}deg)`;
  } else if (look.effect === 'scale') {
    reveal = easeBack(t, 1.6);
    fadeIn = clamp01(t * 1.6);
    if (t < 1) motion = `scale(${(0.35 + 0.65 * reveal).toFixed(4)})`;
  }
  if (look.highlightColor) fadeIn = Math.max(fadeIn, clamp01(t / 0.35));
  const settle = clamp01(reveal);
  const lift = look.offset * (1 - settle);
  piece.style.opacity = t >= 1 ? '' : (look.baseOpacity + (1 - look.baseOpacity) * fadeIn).toFixed(3);
  piece.style.transform = [lift ? `translateY(${lift.toFixed(2)}px)` : '', motion].filter(Boolean).join(' ');
  piece.style.filter = look.blur && settle < 1 ? `blur(${(look.blur * (1 - settle)).toFixed(2)}px)` : '';
  if (look.highlightColor) {
    const glow = glowAt(t);
    piece.style.color =
      glow > 0.002 ? `color-mix(in srgb, ${look.highlightColor} ${(glow * 100).toFixed(1)}%, currentColor)` : '';
  }
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
    splitBy,
    effect,
    mode,
    duration,
    highlightColor,
    enableBlur,
    baseOpacity,
    baseRotation,
    blurStrength,
    baseOffset,
    stagger,
    smoothing,
    rotationEnd,
    wordAnimationEnd
  } = props;

  const scroller: HTMLElement | Window = resolved || window;
  const wrappers = Array.from(el.querySelectorAll<HTMLElement>('.scroll-reveal-word'));
  const pieces = wrappers.length ? Array.from(el.querySelectorAll<HTMLElement>('.scroll-reveal-piece')) : [textEl];
  const viewportHeight = () => (scroller instanceof HTMLElement ? scroller.clientHeight : window.innerHeight);
  const scrub = smoothing > 0 ? smoothing : true;
  const span = mode === 'enter' ? Math.max(0.05, duration) : SCRUB_SPAN;
  const gap = Math.max(0, stagger);
  const look: RevealLook = {
    effect,
    masked: effect === 'rise' && wrappers.length > 0,
    baseOpacity,
    blur: enableBlur ? blurStrength : 0,
    offset: baseOffset,
    highlightColor
  };
  mm = gsap.matchMedia();

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    const order = pieces.map((_, index) => index);
    const last = pieces.map(() => -1);
    const state = { p: 0 };
    let count = pieces.length;

    const measure = () => {
      if (splitBy !== 'lines' || !wrappers.length) return;
      let line = -1;
      let top = -Infinity;
      wrappers.forEach((wrapper, index) => {
        const next = wrapper.offsetTop;
        if (Math.abs(next - top) > 2) {
          line += 1;
          top = next;
        }
        order[index] = line;
      });
      count = line + 1;
    };

    const total = () => span + Math.max(0, count - 1) * gap;

    const render = () => {
      const at = state.p * total();
      pieces.forEach((piece, index) => {
        const t = clamp01((at - order[index] * gap) / span);
        if (t === last[index]) return;
        last[index] = t;
        paintPiece(piece, t, look);
      });
    };

    measure();
    pieces.forEach(piece => {
      piece.style.willChange =
        pieces.length > 80 ? '' : effect === 'fade' && !baseOffset ? 'opacity' : 'opacity, transform';
      piece.style.transformOrigin = effect === 'flip' ? '50% 100%' : '';
    });
    if (look.masked) {
      wrappers.forEach(wrapper => {
        wrapper.style.clipPath = RISE_MASK;
      });
    }
    render();

    if (mode === 'enter') {
      let played = false;
      const play = () => {
        if (played) return;
        played = true;
        gsap.to(state, { p: 1, duration: total(), ease: 'none', onUpdate: render });
        if (baseRotation) gsap.to(el, { rotate: 0, duration: Math.min(total(), 1.4), ease: 'power3.out' });
      };
      const startAt = () => {
        const view = viewportHeight();
        const top =
          el.getBoundingClientRect().top -
          (scroller instanceof HTMLElement
            ? scroller.getBoundingClientRect().top + scroller.clientTop - scroller.scrollTop
            : -window.scrollY);
        const raw = top - view + 0.2 * Math.min(el.offsetHeight, view);
        return Math.min(raw, ScrollTrigger.maxScroll(scroller) - 1);
      };
      if (baseRotation) gsap.set(el, { transformOrigin: '0% 50%', rotate: baseRotation });
      ScrollTrigger.create({
        trigger: el,
        scroller,
        start: startAt,
        onEnter: play,
        onLeave: play,
        onRefresh: (self: ScrollTrigger) => {
          if (self.progress > 0) play();
        }
      });
    } else {
      if (baseRotation) {
        gsap.fromTo(
          el,
          { transformOrigin: '0% 50%', rotate: baseRotation },
          {
            ease: 'none',
            rotate: 0,
            scrollTrigger: {
              trigger: el,
              scroller,
              start: 'top bottom',
              end: clampToScroll(rotationEnd),
              scrub
            }
          }
        );
      }
      gsap.to(state, {
        p: 1,
        ease: 'none',
        onUpdate: render,
        scrollTrigger: {
          trigger: el,
          scroller,
          start: () => `top bottom-=${0.2 * Math.min(el.offsetHeight, viewportHeight())}`,
          end: clampToScroll(wordAnimationEnd),
          scrub
        }
      });
    }

    const resizeObserver =
      splitBy === 'lines' && typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => {
            measure();
            last.fill(-1);
            render();
          })
        : null;
    resizeObserver?.observe(textEl);

    return () => {
      resizeObserver?.disconnect();
      pieces.forEach(piece => {
        piece.style.opacity = '';
        piece.style.transform = '';
        piece.style.transformOrigin = '';
        piece.style.filter = '';
        piece.style.color = '';
        piece.style.willChange = '';
      });
      wrappers.forEach(wrapper => {
        wrapper.style.clipPath = '';
      });
    };
  });
};

onMounted(() => {
  stopWatch = watch(
    () => [
      resolveScroller(),
      text.value,
      props.splitBy,
      props.effect,
      props.mode,
      props.duration,
      props.highlightColor,
      props.enableBlur,
      props.baseOpacity,
      props.baseRotation,
      props.blurStrength,
      props.baseOffset,
      props.stagger,
      props.smoothing,
      props.rotationEnd,
      props.wordAnimationEnd
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
.scroll-reveal {
  margin: 20px 0;
}

.scroll-reveal-text {
  display: block;
  font-size: clamp(1.6rem, 4vw, 3rem);
  line-height: 1.5;
  font-weight: 600;
}

.scroll-reveal-word,
.scroll-reveal-piece {
  display: inline-block;
}
</style>
