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
  shuffleDirection?: 'left' | 'right';
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
    if (!w) return;

    const wrap = document.createElement('span');
    wrap.className = 'inline-block overflow-hidden align-baseline text-left';
    Object.assign(wrap.style, { width: w + 'px' });

    const inner = document.createElement('span');
    inner.className = 'inline-block whitespace-nowrap will-change-transform origin-left transform-gpu';

    parent.insertBefore(wrap, ch);
    wrap.appendChild(inner);

    const firstOrig = ch.cloneNode(true) as HTMLElement;
    firstOrig.className = 'inline-block text-left';
    Object.assign(firstOrig.style, { width: w + 'px', fontFamily: computedFont });

    ch.setAttribute('data-orig', '1');
    ch.className = 'inline-block text-left';
    Object.assign(ch.style, { width: w + 'px', fontFamily: computedFont });

    inner.appendChild(firstOrig);
    for (let k = 0; k < rolls; k++) {
      const c = ch.cloneNode(true) as HTMLElement;
      if (props.scrambleCharset) c.textContent = rand(props.scrambleCharset);
      c.className = 'inline-block text-left';
      Object.assign(c.style, { width: w + 'px', fontFamily: computedFont });
      inner.appendChild(c);
    }
    inner.appendChild(ch);

    const steps = rolls + 1;
    let startX = 0;
    let finalX = -steps * w;
    if (props.shuffleDirection === 'right') {
      const firstCopy = inner.firstElementChild as HTMLElement | null;
      const real = inner.lastElementChild as HTMLElement | null;
      if (real) inner.insertBefore(real, inner.firstChild);
      if (firstCopy) inner.appendChild(firstCopy);
      startX = -steps * w;
      finalX = 0;
    }

    gsap.set(inner, { x: startX, force3D: true });
    if (props.colorFrom) (inner.style as any).color = props.colorFrom;

    inner.setAttribute('data-final-x', String(finalX));
    inner.setAttribute('data-start-x', String(startX));

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

  const tl = gsap.timeline({
    smoothChildTiming: true,
    repeat: props.loop ? -1 : 0,
    repeatDelay: props.loop ? props.loopDelay : 0,
    onRepeat: () => {
      if (props.scrambleCharset) randomizeScrambles();
      gsap.set(strips, { x: (i, t: HTMLElement) => parseFloat(t.getAttribute('data-start-x') || '0') });
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
    tl.to(
      targets,
      {
        x: (i, t: HTMLElement) => parseFloat(t.getAttribute('data-final-x') || '0'),
        duration: props.duration,
        ease: props.ease,
        force3D: true,
        stagger: props.animationMode === 'evenodd' ? props.stagger : 0
      },
      at
    );
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
