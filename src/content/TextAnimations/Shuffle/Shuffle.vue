<script setup lang="ts">
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText as GSAPSplitText } from 'gsap/SplitText';
import { computed, onBeforeUnmount, onMounted, ref, watch, type CSSProperties } from 'vue';

gsap.registerPlugin(ScrollTrigger, GSAPSplitText);

type ShuffleDirection = 'left' | 'right' | 'up' | 'down';
type AnimationMode = 'random' | 'evenodd';
type TagName = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
type EaseFn = (t: number) => number;

interface Props {
  text: string;
  class?: string;
  style?: CSSProperties;
  shuffleDirection?: ShuffleDirection;
  duration?: number;
  maxDelay?: number;
  ease?: string | EaseFn;
  threshold?: number;
  rootMargin?: string;
  tag?: TagName;
  textAlign?: CSSProperties['textAlign'];
  onShuffleComplete?: () => void;
  shuffleTimes?: number;
  animationMode?: AnimationMode;
  loop?: boolean;
  loopDelay?: number;
  stagger?: number;
  scrambleCharset?: string;
  colorFrom?: string;
  colorTo?: string;
  triggerOnce?: boolean;
  respectReducedMotion?: boolean;
  triggerOnHover?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  class: '',
  style: () => ({}),
  shuffleDirection: 'right',
  duration: 0.35,
  maxDelay: 0,
  ease: 'power3.out',
  threshold: 0.1,
  rootMargin: '-100px',
  tag: 'p',
  textAlign: 'center',
  onShuffleComplete: undefined,
  shuffleTimes: 1,
  animationMode: 'evenodd',
  loop: false,
  loopDelay: 0,
  stagger: 0.03,
  scrambleCharset: '',
  colorFrom: undefined,
  colorTo: undefined,
  triggerOnce: true,
  respectReducedMotion: true,
  triggerOnHover: true
});

const elRef = ref<HTMLElement | null>(null);
const fontsLoaded = ref(false);
const ready = ref(false);

const splitRef = ref<GSAPSplitText | null>(null);
const wrappersRef = ref<HTMLElement[]>([]);
const tlRef = ref<gsap.core.Timeline | null>(null);
const playingRef = ref(false);
const hoverHandlerRef = ref<((e: Event) => void) | null>(null);
const stRef = ref<ScrollTrigger | null>(null);

const scrollTriggerStart = computed(() => {
  const startPct = (1 - props.threshold) * 100;
  const mm = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(props.rootMargin || '');
  const mv = mm ? parseFloat(mm[1]) : 0;
  const mu = mm ? mm[2] || 'px' : 'px';
  const sign = mv === 0 ? '' : mv < 0 ? `-=${Math.abs(mv)}${mu}` : `+=${mv}${mu}`;
  return `top ${startPct}%${sign}`;
});

const userHasFont = computed(() => (props.class ? /font[-[]/i.test(props.class) : false));

const fallbackFont = computed<CSSProperties>(() =>
  userHasFont.value ? {} : { fontFamily: `'Press Start 2P', sans-serif` }
);

const commonStyle = computed<CSSProperties>(() => ({
  textAlign: props.textAlign,
  ...fallbackFont.value,
  ...props.style
}));

const classes = computed(() => {
  const base = 'inline-block whitespace-normal break-words will-change-transform uppercase text-6xl leading-none';
  const visibility = ready.value ? 'visible' : 'invisible';
  return [base, visibility, props.class].filter(Boolean).join(' ');
});

function rand(set: string): string {
  return set.charAt(Math.floor(Math.random() * set.length)) || '';
}

function removeHover(): void {
  if (hoverHandlerRef.value && elRef.value) {
    elRef.value.removeEventListener('mouseenter', hoverHandlerRef.value);
    hoverHandlerRef.value = null;
  }
}

function teardown(): void {
  if (tlRef.value) {
    tlRef.value.kill();
    tlRef.value = null;
  }
  if (wrappersRef.value.length) {
    wrappersRef.value.forEach(wrap => {
      const inner = wrap.firstElementChild as HTMLElement | null;
      const orig = inner?.querySelector('[data-orig="1"]') as HTMLElement | null;
      if (orig && wrap.parentNode) wrap.parentNode.replaceChild(orig, wrap);
    });
    wrappersRef.value = [];
  }
  try {
    splitRef.value?.revert();
  } catch {
    // ignore
  }
  splitRef.value = null;
  playingRef.value = false;
}

function getInners(): HTMLElement[] {
  return wrappersRef.value.map(w => w.firstElementChild as HTMLElement);
}

function randomizeScrambles(): void {
  if (!props.scrambleCharset) return;
  wrappersRef.value.forEach(w => {
    const strip = w.firstElementChild as HTMLElement;
    if (!strip) return;
    const kids = Array.from(strip.children) as HTMLElement[];
    for (let i = 1; i < kids.length - 1; i++) {
      kids[i].textContent = props.scrambleCharset.charAt(Math.floor(Math.random() * props.scrambleCharset.length));
    }
  });
}

function cleanupToStill(): void {
  wrappersRef.value.forEach(w => {
    const strip = w.firstElementChild as HTMLElement;
    if (!strip) return;
    const real = strip.querySelector('[data-orig="1"]') as HTMLElement | null;
    if (!real) return;
    strip.replaceChildren(real);
    strip.style.transform = 'none';
    strip.style.willChange = 'auto';
  });
}

function build(): void {
  if (!elRef.value) return;
  teardown();

  const el = elRef.value;
  const computedFont = getComputedStyle(el).fontFamily;

  splitRef.value = new GSAPSplitText(el, {
    type: 'chars',
    charsClass: 'shuffle-char',
    wordsClass: 'shuffle-word',
    linesClass: 'shuffle-line',
    smartWrap: true,
    reduceWhiteSpace: false
  });

  const chars = (splitRef.value.chars || []) as HTMLElement[];
  wrappersRef.value = [];

  const rolls = Math.max(1, Math.floor(props.shuffleTimes));

  chars.forEach(ch => {
    const parent = ch.parentElement;
    if (!parent) return;

    const rect = ch.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    if (!w) return;

    const isVertical = props.shuffleDirection === 'up' || props.shuffleDirection === 'down';

    const wrap = document.createElement('span');
    wrap.className = 'inline-block overflow-hidden text-left';
    Object.assign(wrap.style, {
      width: `${w}px`,
      height: isVertical ? `${h}px` : 'auto',
      verticalAlign: 'bottom'
    });

    const inner = document.createElement('span');
    inner.className =
      'inline-block will-change-transform origin-left transform-gpu ' +
      (isVertical ? 'whitespace-normal' : 'whitespace-nowrap');

    parent.insertBefore(wrap, ch);
    wrap.appendChild(inner);

    const firstOrig = ch.cloneNode(true) as HTMLElement;
    firstOrig.className = `text-left ${isVertical ? 'block' : 'inline-block'}`;
    Object.assign(firstOrig.style, { width: `${w}px`, fontFamily: computedFont });

    ch.setAttribute('data-orig', '1');
    ch.className = `text-left ${isVertical ? 'block' : 'inline-block'}`;
    Object.assign(ch.style, { width: `${w}px`, fontFamily: computedFont });

    inner.appendChild(firstOrig);

    for (let k = 0; k < rolls; k++) {
      const c = ch.cloneNode(true) as HTMLElement;
      if (props.scrambleCharset) c.textContent = rand(props.scrambleCharset);
      c.className = `text-left ${isVertical ? 'block' : 'inline-block'}`;
      Object.assign(c.style, { width: `${w}px`, fontFamily: computedFont });
      inner.appendChild(c);
    }
    inner.appendChild(ch);

    const steps = rolls + 1;

    let startX = 0;
    let finalX = 0;
    let startY = 0;
    let finalY = 0;

    if (props.shuffleDirection === 'right') {
      startX = -steps * w;
      finalX = 0;
    } else if (props.shuffleDirection === 'left') {
      startX = 0;
      finalX = -steps * w;
    } else if (props.shuffleDirection === 'down') {
      startY = -steps * h;
      finalY = 0;
    } else if (props.shuffleDirection === 'up') {
      startY = 0;
      finalY = -steps * h;
    }

    if (props.shuffleDirection === 'right') {
      const firstCopy = inner.firstElementChild as HTMLElement | null;
      const real = inner.lastElementChild as HTMLElement | null;
      if (real) inner.insertBefore(real, inner.firstChild);
      if (firstCopy) inner.appendChild(firstCopy);
    } else if (props.shuffleDirection === 'down') {
      const firstCopy = inner.firstElementChild as HTMLElement | null;
      const real = inner.lastElementChild as HTMLElement | null;
      if (real) inner.insertBefore(real, inner.firstChild);
      if (firstCopy) inner.appendChild(firstCopy);
    }

    if (!isVertical) {
      gsap.set(inner, { x: startX, y: 0, force3D: true });
      inner.setAttribute('data-start-x', String(startX));
      inner.setAttribute('data-final-x', String(finalX));
    } else {
      gsap.set(inner, { x: 0, y: startY, force3D: true });
      inner.setAttribute('data-start-y', String(startY));
      inner.setAttribute('data-final-y', String(finalY));
    }

    if (props.colorFrom) inner.style.color = props.colorFrom;

    wrappersRef.value.push(wrap);
  });
}

function play(): void {
  const strips = getInners();
  if (!strips.length) return;

  playingRef.value = true;
  const isVertical = props.shuffleDirection === 'up' || props.shuffleDirection === 'down';

  const tl = gsap.timeline({
    smoothChildTiming: true,
    repeat: props.loop ? -1 : 0,
    repeatDelay: props.loop ? props.loopDelay : 0,
    onRepeat: () => {
      if (props.scrambleCharset) randomizeScrambles();
      if (isVertical) {
        gsap.set(strips, {
          y: (_i: number, t: HTMLElement) => parseFloat(t.getAttribute('data-start-y') || '0')
        });
      } else {
        gsap.set(strips, {
          x: (_i: number, t: HTMLElement) => parseFloat(t.getAttribute('data-start-x') || '0')
        });
      }
      props.onShuffleComplete?.();
    },
    onComplete: () => {
      playingRef.value = false;
      if (!props.loop) {
        cleanupToStill();
        if (props.colorTo) gsap.set(strips, { color: props.colorTo });
        props.onShuffleComplete?.();
        armHover();
      }
    }
  });

  const addTween = (targets: HTMLElement[], at: number): void => {
    const dur = props.duration;
    const ez = props.ease;
    const staggerVal = props.stagger;

    if (isVertical) {
      tl.to(
        targets,
        {
          y: (_i: number, t: HTMLElement) => parseFloat(t.getAttribute('data-final-y') || '0'),
          duration: dur,
          ease: ez,
          force3D: true,
          stagger: props.animationMode === 'evenodd' ? staggerVal : 0
        },
        at
      );
    } else {
      tl.to(
        targets,
        {
          x: (_i: number, t: HTMLElement) => parseFloat(t.getAttribute('data-final-x') || '0'),
          duration: dur,
          ease: ez,
          force3D: true,
          stagger: props.animationMode === 'evenodd' ? staggerVal : 0
        },
        at
      );
    }

    if (props.colorFrom && props.colorTo) {
      tl.to(targets, { color: props.colorTo, duration: dur, ease: ez }, at);
    }
  };

  if (props.animationMode === 'evenodd') {
    const odd = strips.filter((_el, i) => i % 2 === 1);
    const even = strips.filter((_el, i) => i % 2 === 0);
    const oddTotal = props.duration + Math.max(0, odd.length - 1) * props.stagger;
    const evenStart = odd.length ? oddTotal * 0.7 : 0;
    if (odd.length) addTween(odd, 0);
    if (even.length) addTween(even, evenStart);
  } else {
    strips.forEach(strip => {
      const d = Math.random() * props.maxDelay;
      if (isVertical) {
        tl.to(
          strip,
          {
            y: parseFloat(strip.getAttribute('data-final-y') || '0'),
            duration: props.duration,
            ease: props.ease,
            force3D: true
          },
          d
        );
      } else {
        tl.to(
          strip,
          {
            x: parseFloat(strip.getAttribute('data-final-x') || '0'),
            duration: props.duration,
            ease: props.ease,
            force3D: true
          },
          d
        );
      }
      if (props.colorFrom && props.colorTo) {
        tl.fromTo(
          strip,
          { color: props.colorFrom },
          { color: props.colorTo, duration: props.duration, ease: props.ease },
          d
        );
      }
    });
  }

  tlRef.value = tl;
}

function armHover(): void {
  if (!props.triggerOnHover || !elRef.value) return;
  removeHover();
  const handler = () => {
    if (playingRef.value) return;
    build();
    if (props.scrambleCharset) randomizeScrambles();
    play();
  };
  hoverHandlerRef.value = handler;
  elRef.value.addEventListener('mouseenter', handler);
}

function create(): void {
  build();
  if (props.scrambleCharset) randomizeScrambles();
  play();
  armHover();
  ready.value = true;
}

function initScrollTrigger(): void {
  if (!elRef.value) return;
  if (props.respectReducedMotion && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
    props.onShuffleComplete?.();
    return;
  }

  stRef.value = ScrollTrigger.create({
    trigger: elRef.value,
    start: scrollTriggerStart.value,
    once: props.triggerOnce,
    onEnter: create
  });
}

function destroyScrollTrigger(): void {
  stRef.value?.kill();
  stRef.value = null;
  removeHover();
  teardown();
  ready.value = false;
}

onMounted(() => {
  if ('fonts' in document) {
    if (document.fonts.status === 'loaded') {
      fontsLoaded.value = true;
    } else {
      document.fonts.ready.then(() => {
        fontsLoaded.value = true;
      });
    }
  } else {
    fontsLoaded.value = true;
  }
});

watch(fontsLoaded, loaded => {
  if (loaded) initScrollTrigger();
});

// Re-init when any key prop changes (mirrors useGSAP dependencies)
watch(
  () => [
    props.text,
    props.duration,
    props.maxDelay,
    props.ease,
    scrollTriggerStart.value,
    fontsLoaded.value,
    props.shuffleDirection,
    props.shuffleTimes,
    props.animationMode,
    props.loop,
    props.loopDelay,
    props.stagger,
    props.scrambleCharset,
    props.colorFrom,
    props.colorTo,
    props.triggerOnce,
    props.respectReducedMotion,
    props.triggerOnHover
  ],
  () => {
    if (!fontsLoaded.value) return;
    destroyScrollTrigger();
    initScrollTrigger();
  }
);

onBeforeUnmount(() => {
  destroyScrollTrigger();
});
</script>

<template>
  <component :is="tag" ref="elRef" :class="classes" :style="commonStyle">{{ text }}</component>
</template>
