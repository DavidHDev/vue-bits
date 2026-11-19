<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, onUpdated, ref, shallowRef, useTemplateRef, watch } from 'vue';
import { gsap } from 'gsap';

interface TextTypeProps {
  className?: string;
  showCursor?: boolean;
  hideCursorWhileTyping?: boolean;
  cursorStyle?: 'character' | 'bar' | 'block' | 'underscore';
  cursorCharacter?: string;
  cursorColor?: string;
  cursorBlinkDuration?: number;
  cursorClassName?: string;
  cursorGlide?: boolean;
  text: string | string[];
  as?: string;
  typingSpeed?: number;
  initialDelay?: number;
  pauseDuration?: number;
  deletingSpeed?: number;
  deleteMode?: 'backspace' | 'select';
  typeEffect?: 'none' | 'fade' | 'blur' | 'rise';
  mistakes?: number;
  prefix?: string;
  prefixColor?: string;
  loop?: boolean;
  textColors?: string[];
  variableSpeed?: { min: number; max: number };
  onSentenceComplete?: (sentence: string, index: number) => void;
  startOnVisible?: boolean;
  reverseMode?: boolean;
}

type Effect = { keyframes: Keyframe[]; options: KeyframeAnimationOptions };
type Typo = { plan: string[]; tail: string[]; fixing: boolean };
type Piece = { key: number | string; char: string; className: string };

const NEIGHBORS: Record<string, string> = {
  a: 'qwsz',
  b: 'vghn',
  c: 'xdfv',
  d: 'serfcx',
  e: 'wsdr',
  f: 'drtgvc',
  g: 'ftyhbv',
  h: 'gyujnb',
  i: 'ujko',
  j: 'huikmn',
  k: 'jiolm',
  l: 'kop',
  m: 'njk',
  n: 'bhjm',
  o: 'iklp',
  p: 'ol',
  q: 'wa',
  r: 'edft',
  s: 'awedxz',
  t: 'rfgy',
  u: 'yhji',
  v: 'cfgb',
  w: 'qase',
  x: 'zsdc',
  y: 'tghu',
  z: 'asx',
  0: '9p',
  1: '2q',
  2: '13w',
  3: '24e',
  4: '35r',
  5: '46t',
  6: '57y',
  7: '68u',
  8: '79i',
  9: '80o'
};

const EFFECTS: Record<'fade' | 'blur' | 'rise', Effect> = {
  fade: {
    keyframes: [{ opacity: 0 }, { opacity: 1 }],
    options: { duration: 360, easing: 'cubic-bezier(0.25, 1, 0.5, 1)' }
  },
  blur: {
    keyframes: [
      { opacity: 0, filter: 'blur(0.3em)' },
      { opacity: 1, filter: 'blur(0em)' }
    ],
    options: { duration: 520, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }
  },
  rise: {
    keyframes: [
      { opacity: 0, top: '0.6em' },
      { opacity: 1, top: '0em' }
    ],
    options: { duration: 480, easing: 'cubic-bezier(0.34, 1.4, 0.64, 1)' }
  }
};

const graphemes = (value: string): string[] => {
  if (typeof Intl !== 'undefined' && Intl.Segmenter) {
    return Array.from(new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(value), part => part.segment);
  }
  return Array.from(value);
};

const typoFor = (char: string): string | null => {
  const keys = NEIGHBORS[char.toLowerCase()];
  if (!keys) return null;
  const pick = keys[Math.floor(Math.random() * keys.length)];
  return char === char.toLowerCase() ? pick : pick.toUpperCase();
};

const props = withDefaults(defineProps<TextTypeProps>(), {
  as: 'div',
  typingSpeed: 50,
  initialDelay: 0,
  pauseDuration: 2000,
  deletingSpeed: 30,
  deleteMode: 'backspace',
  loop: true,
  className: '',
  showCursor: true,
  hideCursorWhileTyping: false,
  cursorStyle: 'character',
  cursorCharacter: '|',
  cursorColor: 'currentColor',
  cursorClassName: '',
  cursorBlinkDuration: 0.5,
  cursorGlide: true,
  typeEffect: 'none',
  mistakes: 0,
  prefix: '',
  prefixColor: 'currentColor',
  textColors: () => [],
  variableSpeed: undefined,
  onSentenceComplete: undefined,
  startOnVisible: false,
  reverseMode: false
});

const textIndex = ref(0);
const count = ref(0);
const selected = ref(0);
const typo = shallowRef<Typo | null>(null);
const isDeleting = ref(false);
const isVisible = ref(!props.startOnVisible);
const reduceMotion = ref(false);
const containerRef = useTemplateRef<HTMLElement>('containerRef');
const caretRef = useTemplateRef<HTMLSpanElement>('caretRef');
const cursorRef = useTemplateRef<HTMLSpanElement>('cursorRef');
const blinkRef = useTemplateRef<HTMLSpanElement>('blinkRef');
let blinkTimeline: gsap.core.Timeline | null = null;
let blinkResume: gsap.core.Tween | null = null;
let caretPosition: { x: number; y: number } | null = null;
let lastTypo = -1;

const textKey = computed(() => (Array.isArray(props.text) ? props.text.join('\u0000') : String(props.text ?? '')));
const textArray = computed(() => textKey.value.split('\u0000'));
const index = computed(() => textIndex.value % textArray.value.length);
const chars = computed(() => graphemes(textArray.value[index.value]));
const total = computed(() => chars.value.length);
const shown = computed(() => Math.min(count.value, total.value));
const minSpeed = computed(() => props.variableSpeed?.min ?? props.typingSpeed);
const maxSpeed = computed(() => props.variableSpeed?.max ?? props.typingSpeed);
const glideTime = computed(() => {
  const pace = (minSpeed.value + maxSpeed.value) / 2;
  return Math.min(0.18, Math.max(0.06, pace * 0.0016));
});

let motionQuery: MediaQueryList | null = null;
const updateMotion = () => {
  reduceMotion.value = !!motionQuery?.matches;
};

onMounted(() => {
  motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  updateMotion();
  motionQuery.addEventListener('change', updateMotion);
});

watch(
  [() => props.startOnVisible, containerRef],
  ([startOnVisible, node], _, onCleanup) => {
    if (!startOnVisible || !node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        isVisible.value = true;
        observer.disconnect();
      },
      { threshold: 0.1 }
    );
    observer.observe(node);
    onCleanup(() => observer.disconnect());
  },
  { immediate: true, flush: 'post' }
);

let stopBlink: (() => void) | null = null;
const setupBlink = () => {
  stopBlink?.();
  stopBlink = null;
  const blink = blinkRef.value;
  if (!props.showCursor || !blink) return;
  gsap.set(blink, { opacity: 1 });
  if (reduceMotion.value || props.cursorBlinkDuration <= 0) return;

  const duration = props.cursorBlinkDuration;
  const hold = duration * 0.7;
  const fade = duration * 0.45;
  const timeline = gsap.timeline({ repeat: -1 });
  timeline
    .to(blink, { opacity: 0, duration: fade, ease: 'sine.inOut' }, hold)
    .to(blink, { opacity: 1, duration: fade, ease: 'sine.inOut' }, hold + fade + duration * 0.4);
  blinkTimeline = timeline;

  stopBlink = () => {
    timeline.kill();
    blinkResume?.kill();
    gsap.killTweensOf(blink);
    blinkTimeline = null;
  };
};

onMounted(setupBlink);
watch([() => props.showCursor, () => props.cursorBlinkDuration, reduceMotion], setupBlink, { flush: 'post' });

watch(
  () => props.showCursor,
  () => {
    caretPosition = null;
  },
  { flush: 'pre' }
);

const placeCursor = (instant: boolean) => {
  const caret = caretRef.value;
  const cursor = cursorRef.value;
  if (!caret || !cursor) return;

  const x = caret.offsetLeft;
  const y = caret.offsetTop;
  const last = caretPosition;
  if (last && Math.abs(last.x - x) < 0.5 && Math.abs(last.y - y) < 0.5) return;
  caretPosition = { x, y };

  if (instant || !last || !props.cursorGlide || reduceMotion.value || Math.abs(last.y - y) > 1) {
    gsap.killTweensOf(cursor);
    gsap.set(cursor, { x, y });
  } else {
    gsap.to(cursor, { x, y, duration: glideTime.value, ease: 'power3.out', overwrite: true });
  }

  const timeline = blinkTimeline;
  const blink = blinkRef.value;
  if (instant || !timeline || !blink) return;
  timeline.pause();
  blinkResume?.kill();
  gsap.to(blink, { opacity: 1, duration: 0.12, ease: 'power1.out' });
  blinkResume = gsap.delayedCall(0.12, () => timeline.restart());
};

onMounted(() => placeCursor(false));
onUpdated(() => placeCursor(false));

watch(
  containerRef,
  (node, _, onCleanup) => {
    if (!node || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(() => placeCursor(true));
    observer.observe(node);
    onCleanup(() => observer.disconnect());
  },
  { immediate: true, flush: 'post' }
);

let timeout: ReturnType<typeof setTimeout> | undefined;

const tick = () => {
  clearTimeout(timeout);
  timeout = undefined;
  if (!isVisible.value) return;

  const wait = (ms: number, next: () => void) => {
    timeout = setTimeout(next, ms);
  };
  const min = minSpeed.value;
  const max = maxSpeed.value;
  const speed = () => min + Math.random() * (max - min);
  const current = typo.value;
  const shownNow = shown.value;
  const totalNow = total.value;
  const charsNow = chars.value;
  const indexNow = index.value;

  if (!isDeleting.value) {
    if (current) {
      if (reduceMotion.value) {
        wait(0, () => (typo.value = null));
      } else if (!current.fixing) {
        if (current.tail.length < current.plan.length) {
          wait(speed(), () => (typo.value = { ...current, tail: current.plan.slice(0, current.tail.length + 1) }));
        } else {
          wait(260 + Math.random() * 320, () => (typo.value = { ...current, fixing: true }));
        }
      } else if (current.tail.length) {
        wait(Math.max(45, props.deletingSpeed), () => (typo.value = { ...current, tail: current.tail.slice(0, -1) }));
      } else {
        wait(90 + Math.random() * 140, () => (typo.value = null));
      }
    } else if (shownNow < totalNow) {
      const lead = shownNow === 0 ? props.initialDelay : 0;
      const next = props.reverseMode ? totalNow - shownNow - 1 : shownNow;
      const wrong = props.mistakes > 0 && shownNow > 0 && lastTypo !== next ? typoFor(charsNow[next]) : null;

      if (reduceMotion.value) {
        wait(lead, () => (count.value = totalNow));
      } else if (wrong && Math.random() < Math.min(1, props.mistakes) * 0.16) {
        lastTypo = next;
        const plan = [wrong];
        const follow = charsNow[props.reverseMode ? next - 1 : next + 1];
        if (follow && follow.trim() && Math.random() < 0.4) plan.push(follow);
        wait(lead + speed(), () => (typo.value = { plan, tail: [wrong], fixing: false }));
      } else {
        wait(lead + speed(), () => (count.value = shownNow + 1));
      }
    } else if (props.loop || indexNow < textArray.value.length - 1) {
      wait(props.pauseDuration, () => (isDeleting.value = true));
    }
  } else if (shownNow > 0) {
    if (reduceMotion.value) {
      wait(0, () => (count.value = 0));
    } else if (props.deleteMode === 'select') {
      if (selected.value < shownNow) {
        const nextSelected = selected.value + 1;
        wait(props.deletingSpeed, () => (selected.value = nextSelected));
      } else {
        wait(Math.max(160, props.deletingSpeed * 8), () => {
          selected.value = 0;
          count.value = 0;
        });
      }
    } else {
      wait(props.deletingSpeed, () => (count.value = shownNow - 1));
    }
  } else {
    props.onSentenceComplete?.(textArray.value[indexNow], indexNow);
    lastTypo = -1;
    selected.value = 0;
    isDeleting.value = false;
    textIndex.value = (indexNow + 1) % textArray.value.length;
  }
};

onMounted(tick);
watch(
  [
    isVisible,
    isDeleting,
    shown,
    total,
    chars,
    selected,
    typo,
    index,
    textArray,
    () => props.loop,
    () => props.deletingSpeed,
    () => props.deleteMode,
    () => props.pauseDuration,
    () => props.initialDelay,
    minSpeed,
    maxSpeed,
    () => props.mistakes,
    () => props.reverseMode,
    reduceMotion
  ],
  tick,
  { flush: 'post' }
);

const animateChar = (node: HTMLElement | null) => {
  const effect = props.typeEffect === 'none' ? undefined : EFFECTS[props.typeEffect];
  if (!node || !effect || reduceMotion.value || typeof node.animate !== 'function') return;
  node.animate(effect.keyframes, effect.options);
};

const vAnimate = {
  mounted: (el: HTMLElement) => animateChar(el)
};

watch(
  [() => props.typeEffect, reduceMotion],
  () => {
    containerRef.value?.querySelectorAll<HTMLElement>('.text-type__char').forEach(animateChar);
  },
  { flush: 'post' }
);

onBeforeUnmount(() => {
  clearTimeout(timeout);
  stopBlink?.();
  motionQuery?.removeEventListener('change', updateMotion);
  if (cursorRef.value) gsap.killTweensOf(cursorRef.value);
});

const pieces = computed<Piece[]>(() => {
  const start = props.reverseMode ? total.value - shown.value : 0;
  const marked = Math.min(selected.value, shown.value);
  const correct: Piece[] = chars.value.slice(start, start + shown.value).map((char, i) => {
    const isMarked = props.reverseMode ? i < marked : i >= shown.value - marked;
    return {
      key: start + i,
      char,
      className: isMarked ? 'text-type__char text-type__char--selected' : 'text-type__char'
    };
  });
  const mistyped: Piece[] = (typo.value?.tail ?? []).map((char, i) => ({
    key: `typo-${i}`,
    char,
    className: 'text-type__char'
  }));
  if (props.reverseMode) mistyped.reverse();
  return props.reverseMode ? [...mistyped, ...correct] : [...correct, ...mistyped];
});

const color = computed(() =>
  props.textColors.length ? props.textColors[index.value % props.textColors.length] : 'inherit'
);
const hideCursor = computed(() => {
  const typing = shown.value < total.value || isDeleting.value || typo.value !== null;
  return props.hideCursorWhileTyping && typing;
});
const customCursorColor = computed(() =>
  props.cursorColor && props.cursorColor !== 'currentColor' ? { color: props.cursorColor } : undefined
);
</script>

<template>
  <component :is="as" ref="containerRef" :class="`text-type ${className}`">
    <span class="text-type__sr">{{ prefix + textArray.join(' ') }}</span>
    <span class="text-type__content" aria-hidden="true">
      <span v-if="prefix" class="text-type__prefix" :style="{ color: prefixColor }">{{ prefix }}</span>
      <span v-if="reverseMode" ref="caretRef" class="text-type__caret">&#8203;</span>
      <span :style="{ color }">
        <span v-for="piece in pieces" :key="piece.key" v-animate :class="piece.className">{{ piece.char }}</span>
      </span>
      <span v-if="!reverseMode" ref="caretRef" class="text-type__caret">&#8203;</span>
    </span>
    <span
      v-if="showCursor"
      ref="cursorRef"
      aria-hidden="true"
      :class="`text-type__cursor text-type__cursor--${cursorStyle} ${hideCursor ? 'text-type__cursor--hidden' : ''} ${cursorClassName}`"
      :style="customCursorColor"
    >
      <span ref="blinkRef" class="text-type__blink">
        <template v-if="cursorStyle === 'character'">{{ cursorCharacter }}</template>
        <span v-else class="text-type__shape" />
      </span>
    </span>
  </component>
</template>

<style>
.text-type {
  position: relative;
  display: inline-block;
  white-space: pre-wrap;
}

.text-type__sr {
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

.text-type__char {
  position: relative;
}

.text-type__char--selected {
  background-color: color-mix(in srgb, currentColor 25%, transparent);
}

.text-type__caret {
  display: inline-block;
  width: 0;
}

.text-type__cursor {
  position: absolute;
  top: 0;
  left: 0;
  white-space: pre;
  pointer-events: none;
  transition: opacity 0.2s ease;
  will-change: transform;
}

.text-type__cursor--hidden {
  opacity: 0;
}

.text-type__blink {
  display: inline-block;
}

.text-type__cursor--character .text-type__blink {
  margin-left: 0.25rem;
}

.text-type__shape {
  display: inline-block;
  margin-left: 0.06em;
  background-color: currentColor;
}

.text-type__cursor--bar .text-type__shape {
  width: max(2px, 0.07em);
  height: 1.1em;
  vertical-align: -0.2em;
  border-radius: 1px;
}

.text-type__cursor--block .text-type__shape {
  width: 0.56em;
  height: 1.1em;
  vertical-align: -0.2em;
  border-radius: 0.06em;
}

.text-type__cursor--underscore .text-type__shape {
  width: 0.56em;
  height: max(2px, 0.075em);
  vertical-align: -0.12em;
  border-radius: 1px;
}
</style>
