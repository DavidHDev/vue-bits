<template>
  <component :is="tag" ref="textRef" :class="computedClasses" :style="computedStyle">
    {{ text }}
  </component>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick, useTemplateRef } from 'vue';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText as GSAPSplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, GSAPSplitText);

export interface ShuffleProps {
  text: string;
  className?: string;
  style?: Record<string, any>;
  shuffleDirection?: 'left' | 'right' | 'up' | 'down';
  duration?: number;
  maxDelay?: number;
  ease?: string | ((t: number) => number);
  threshold?: number;
  rootMargin?: string;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  onShuffleComplete?: () => void;
  shuffleTimes?: number;
  animationMode?: 'random' | 'evenodd';
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

const props = withDefaults(defineProps<ShuffleProps>(), {
  className: '',
  shuffleDirection: 'right',
  duration: 0.35,
  maxDelay: 0,
  ease: 'power3.out',
  threshold: 0.1,
  rootMargin: '-100px',
  tag: 'p',
  textAlign: 'center',
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

const emit = defineEmits<{
  'shuffle-complete': [];
}>();

const textRef = useTemplateRef<HTMLElement>('textRef');
const fontsLoaded = ref(false);
const ready = ref(false);

const splitRef = ref<GSAPSplitText | null>(null);
const wrappersRef = ref<HTMLElement[]>([]);
const tlRef = ref<gsap.core.Timeline | null>(null);
const playingRef = ref(false);
const scrollTriggerRef = ref<ScrollTrigger | null>(null);
let hoverHandler: ((e: Event) => void) | null = null;

const scrollTriggerStart = computed(() => {
  const startPct = (1 - props.threshold) * 100;
  const mm = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(props.rootMargin || '');
  const mv = mm ? parseFloat(mm[1]) : 0;
  const mu = mm ? mm[2] || 'px' : 'px';
  const sign = mv === 0 ? '' : mv < 0 ? `-=${Math.abs(mv)}${mu}` : `+=${mv}${mu}`;
  return `top ${startPct}%${sign}`;
});

const baseTw = 'inline-block whitespace-normal break-words will-change-transform uppercase text-6xl leading-none';

const userHasFont = computed(() => props.className && /font[-[]/i.test(props.className));

const fallbackFont = computed(() => (userHasFont.value ? {} : { fontFamily: `'Press Start 2P', sans-serif` }));

const computedStyle = computed(() => ({
  textAlign: props.textAlign,
  ...fallbackFont.value,
  ...props.style
}));

const computedClasses = computed(() => `${baseTw} ${ready.value ? 'visible' : 'invisible'} ${props.className}`.trim());

const removeHover = () => {
  if (hoverHandler && textRef.value) {
    textRef.value.removeEventListener('mouseenter', hoverHandler);
    hoverHandler = null;
  }
};

const teardown = () => {
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
  } catch {}
  splitRef.value = null;
  playingRef.value = false;
};

const build = () => {
  if (!textRef.value) return;
  teardown();

  const el = textRef.value;
  const computedFont = getComputedStyle(el).fontFamily;

  splitRef.value = new GSAPSplitText(el, {
    type: 'chars',
    charsClass: 'shuffle-char',
    wordsClass: 'shuffle-word',
    linesClass: 'shuffle-line',
    reduceWhiteSpace: false
  });

  const chars = (splitRef.value.chars || []) as HTMLElement[];
  wrappersRef.value = [];

  const rolls = Math.max(1, Math.floor(props.shuffleTimes));
  const rand = (set: string) => set.charAt(Math.floor(Math.random() * set.length)) || '';

  chars.forEach(ch => {
    const parent = ch.parentElement;
    if (!parent) return;

    const w = ch.getBoundingClientRect().width;
    const h = ch.getBoundingClientRect().height;
    if (!w) return;

    const wrap = document.createElement('span');
    wrap.className = 'inline-block overflow-hidden text-left';
    Object.assign(wrap.style, {
      width: w + 'px',
      height: props.shuffleDirection === 'up' || props.shuffleDirection === 'down' ? h + 'px' : 'auto',
      verticalAlign: 'bottom'
    });

    const inner = document.createElement('span');
    inner.className =
      'inline-block will-change-transform origin-left transform-gpu ' +
      (props.shuffleDirection === 'up' || props.shuffleDirection === 'down'
        ? 'whitespace-normal'
        : 'whitespace-nowrap');

    parent.insertBefore(wrap, ch);
    wrap.appendChild(inner);

    const firstOrig = ch.cloneNode(true) as HTMLElement;
    firstOrig.className =
      'text-left ' + (props.shuffleDirection === 'up' || props.shuffleDirection === 'down' ? 'block' : 'inline-block');
    Object.assign(firstOrig.style, { width: w + 'px', fontFamily: computedFont });

    ch.setAttribute('data-orig', '1');
    ch.className =
      'text-left ' + (props.shuffleDirection === 'up' || props.shuffleDirection === 'down' ? 'block' : 'inline-block');
    Object.assign(ch.style, { width: w + 'px', fontFamily: computedFont });

    inner.appendChild(firstOrig);
    for (let k = 0; k < rolls; k++) {
      const c = ch.cloneNode(true) as HTMLElement;
      if (props.scrambleCharset) c.textContent = rand(props.scrambleCharset);
      c.className =
        'text-left ' +
        (props.shuffleDirection === 'up' || props.shuffleDirection === 'down' ? 'block' : 'inline-block');
      Object.assign(c.style, { width: w + 'px', fontFamily: computedFont });
      inner.appendChild(c);
    }
    inner.appendChild(ch);

    const steps = rolls + 1;
    if (props.shuffleDirection === 'right' || props.shuffleDirection === 'down') {
      const firstCopy = inner.firstElementChild as HTMLElement | null;
      const real = inner.lastElementChild as HTMLElement | null;
      if (real) inner.insertBefore(real, inner.firstChild);
      if (firstCopy) inner.appendChild(firstCopy);
    }

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

    if (props.shuffleDirection === 'left' || props.shuffleDirection === 'right') {
      gsap.set(inner, { x: startX, y: 0, force3D: true });
      inner.setAttribute('data-start-x', String(startX));
      inner.setAttribute('data-final-x', String(finalX));
    } else {
      gsap.set(inner, { x: 0, y: startY, force3D: true });
      inner.setAttribute('data-start-y', String(startY));
      inner.setAttribute('data-final-y', String(finalY));
    }

    if (props.colorFrom) (inner.style as any).color = props.colorFrom;
    wrappersRef.value.push(wrap);
  });
};

const getInners = () => wrappersRef.value.map(w => w.firstElementChild as HTMLElement);

const randomizeScrambles = () => {
  if (!props.scrambleCharset) return;
  wrappersRef.value.forEach(w => {
    const strip = w.firstElementChild as HTMLElement;
    if (!strip) return;
    const kids = Array.from(strip.children) as HTMLElement[];
    for (let i = 1; i < kids.length - 1; i++) {
      kids[i].textContent = props.scrambleCharset.charAt(Math.floor(Math.random() * props.scrambleCharset.length));
    }
  });
};

const cleanupToStill = () => {
  wrappersRef.value.forEach(w => {
    const strip = w.firstElementChild as HTMLElement;
    if (!strip) return;
    const real = strip.querySelector('[data-orig="1"]') as HTMLElement | null;
    if (!real) return;
    strip.replaceChildren(real);
    strip.style.transform = 'none';
    strip.style.willChange = 'auto';
  });
};

const armHover = () => {
  if (!props.triggerOnHover || !textRef.value) return;
  removeHover();
  const handler = () => {
    if (playingRef.value) return;
    build();
    if (props.scrambleCharset) randomizeScrambles();
    play();
  };
  hoverHandler = handler;
  textRef.value.addEventListener('mouseenter', handler);
};

const play = () => {
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
        gsap.set(strips, { y: (i, t: HTMLElement) => parseFloat(t.getAttribute('data-start-y') || '0') });
      } else {
        gsap.set(strips, { x: (i, t: HTMLElement) => parseFloat(t.getAttribute('data-start-x') || '0') });
      }
      emit('shuffle-complete');
      props.onShuffleComplete?.();
    },
    onComplete: () => {
      playingRef.value = false;
      if (!props.loop) {
        cleanupToStill();
        if (props.colorTo) gsap.set(strips, { color: props.colorTo });
        emit('shuffle-complete');
        props.onShuffleComplete?.();
        armHover();
      }
    }
  });

  const addTween = (targets: HTMLElement[], at: number) => {
    const vars: any = {
      duration: props.duration,
      ease: props.ease,
      force3D: true,
      stagger: props.animationMode === 'evenodd' ? props.stagger : 0
    };
    if (isVertical) {
      vars.y = (i: number, t: HTMLElement) => parseFloat(t.getAttribute('data-final-y') || '0');
    } else {
      vars.x = (i: number, t: HTMLElement) => parseFloat(t.getAttribute('data-final-x') || '0');
    }

    tl.to(targets, vars, at);
    if (props.colorFrom && props.colorTo)
      tl.to(targets, { color: props.colorTo, duration: props.duration, ease: props.ease }, at);
  };

  if (props.animationMode === 'evenodd') {
    const odd = strips.filter((_, i) => i % 2 === 1);
    const even = strips.filter((_, i) => i % 2 === 0);
    const oddTotal = props.duration + Math.max(0, odd.length - 1) * props.stagger;
    const evenStart = odd.length ? oddTotal * 0.7 : 0;
    if (odd.length) addTween(odd, 0);
    if (even.length) addTween(even, evenStart);
  } else {
    strips.forEach(strip => {
      const d = Math.random() * props.maxDelay;
      const vars: any = {
        duration: props.duration,
        ease: props.ease,
        force3D: true
      };
      if (isVertical) {
        vars.y = parseFloat(strip.getAttribute('data-final-y') || '0');
      } else {
        vars.x = parseFloat(strip.getAttribute('data-final-x') || '0');
      }
      tl.to(strip, vars, d);
      if (props.colorFrom && props.colorTo)
        tl.fromTo(
          strip,
          { color: props.colorFrom },
          { color: props.colorTo, duration: props.duration, ease: props.ease },
          d
        );
    });
  }

  tlRef.value = tl;
};

const create = () => {
  build();
  if (props.scrambleCharset) randomizeScrambles();
  play();
  armHover();
  ready.value = true;
};

const initializeAnimation = async () => {
  if (typeof window === 'undefined' || !textRef.value || !props.text || !fontsLoaded.value) return;

  if (
    props.respectReducedMotion &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    ready.value = true;
    emit('shuffle-complete');
    props.onShuffleComplete?.();
    return;
  }

  await nextTick();

  const el = textRef.value;
  const start = scrollTriggerStart.value;

  const st = ScrollTrigger.create({
    trigger: el,
    start,
    once: props.triggerOnce,
    onEnter: create
  });

  scrollTriggerRef.value = st;
};

const cleanup = () => {
  if (scrollTriggerRef.value) {
    scrollTriggerRef.value.kill();
    scrollTriggerRef.value = null;
  }
  removeHover();
  teardown();
  ready.value = false;
};

onMounted(async () => {
  if ('fonts' in document) {
    if (document.fonts.status === 'loaded') {
      fontsLoaded.value = true;
    } else {
      await document.fonts.ready;
      fontsLoaded.value = true;
    }
  } else {
    fontsLoaded.value = true;
  }

  initializeAnimation();
});

onUnmounted(() => {
  cleanup();
});

watch(
  [
    () => props.text,
    () => props.duration,
    () => props.maxDelay,
    () => props.ease,
    () => props.shuffleDirection,
    () => props.shuffleTimes,
    () => props.animationMode,
    () => props.loop,
    () => props.loopDelay,
    () => props.stagger,
    () => props.scrambleCharset,
    () => props.colorFrom,
    () => props.colorTo,
    () => props.triggerOnce,
    () => props.respectReducedMotion,
    () => props.triggerOnHover,
    () => fontsLoaded.value
  ],
  () => {
    cleanup();
    initializeAnimation();
  }
);
</script>
