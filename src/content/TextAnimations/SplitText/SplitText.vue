<script setup lang="ts">
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText as GSAPSplitText } from 'gsap/SplitText';
import { computed, onBeforeUnmount, onMounted, ref, watch, type CSSProperties } from 'vue';

gsap.registerPlugin(ScrollTrigger, GSAPSplitText);

type SplitType = 'chars' | 'words' | 'lines' | 'words, chars';
type TagName = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
type EaseFn = (t: number) => number;

interface SplitTextElement extends HTMLElement {
  _rbsplitInstance?: GSAPSplitText;
}

interface Props {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string | EaseFn;
  splitType?: SplitType;
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  threshold?: number;
  rootMargin?: string;
  tag?: TagName;
  textAlign?: CSSProperties['textAlign'];
  onLetterAnimationComplete?: () => void;
}

const props = withDefaults(defineProps<Props>(), {
  className: '',
  delay: 50,
  duration: 1.25,
  ease: 'power3.out',
  splitType: 'chars',
  from: () => ({ opacity: 0, y: 40 }),
  to: () => ({ opacity: 1, y: 0 }),
  threshold: 0.1,
  rootMargin: '-100px',
  tag: 'p',
  textAlign: 'center',
  onLetterAnimationComplete: undefined
});

// Emit so the parent can use @animation-complete in template
const emit = defineEmits<{
  'animation-complete': [];
}>();

const elRef = ref<SplitTextElement | null>(null);
const fontsLoaded = ref(false);
const animationCompleted = ref(false);

// Stable callback ref so the animation closure never captures a stale prop value
const onCompleteRef = ref(props.onLetterAnimationComplete);
watch(
  () => props.onLetterAnimationComplete,
  cb => {
    onCompleteRef.value = cb;
  }
);

const scrollTriggerStart = computed(() => {
  const startPct = (1 - props.threshold) * 100;
  const mm = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(props.rootMargin || '');
  const mv = mm ? parseFloat(mm[1]) : 0;
  const mu = mm ? mm[2] || 'px' : 'px';
  const sign = mv === 0 ? '' : mv < 0 ? `-=${Math.abs(mv)}${mu}` : `+=${mv}${mu}`;
  return `top ${startPct}%${sign}`;
});

const elStyle = computed<CSSProperties>(() => ({
  textAlign: props.textAlign,
  wordWrap: 'break-word',
  willChange: 'transform, opacity'
}));

// className prop is placed last so user styles always win over base styles
const elClass = computed(() =>
  ['split-parent overflow-hidden inline-block whitespace-normal', props.className].filter(Boolean).join(' ')
);

function assignTargets(self: GSAPSplitText): Element[] {
  if (props.splitType.includes('chars') && self.chars?.length) return self.chars;
  if (props.splitType.includes('words') && self.words?.length) return self.words;
  if (props.splitType.includes('lines') && self.lines?.length) return self.lines;
  return self.chars ?? self.words ?? self.lines ?? [];
}

function destroyInstance(): void {
  const el = elRef.value;
  if (!el) return;
  ScrollTrigger.getAll().forEach(st => {
    if (st.trigger === el) st.kill();
  });
  try {
    el._rbsplitInstance?.revert();
  } catch {
    // ignore
  }
  el._rbsplitInstance = undefined;
}

function initAnimation(): void {
  const el = elRef.value;
  if (!el || !props.text || !fontsLoaded.value) return;
  if (animationCompleted.value) return;

  destroyInstance();

  const start = scrollTriggerStart.value;

  const splitInstance = new GSAPSplitText(el, {
    type: props.splitType,
    smartWrap: true,
    autoSplit: props.splitType === 'lines',
    linesClass: 'split-line',
    wordsClass: 'split-word',
    charsClass: 'split-char',
    reduceWhiteSpace: false,
    onSplit: (self: GSAPSplitText) => {
      const targets = assignTargets(self);
      return gsap.fromTo(
        targets,
        { ...props.from },
        {
          ...props.to,
          duration: props.duration,
          ease: props.ease,
          stagger: props.delay / 1000,
          scrollTrigger: {
            trigger: el,
            start,
            once: true,
            fastScrollEnd: true,
            anticipatePin: 0.4
          },
          onComplete: () => {
            animationCompleted.value = true;
            onCompleteRef.value?.();
            emit('animation-complete');
          },
          willChange: 'transform, opacity',
          force3D: true
        }
      );
    }
  });

  el._rbsplitInstance = splitInstance;
}

onMounted(() => {
  if (document.fonts.status === 'loaded') {
    fontsLoaded.value = true;
  } else {
    document.fonts.ready.then(() => {
      fontsLoaded.value = true;
    });
  }
});

watch(fontsLoaded, loaded => {
  if (loaded) initAnimation();
});

watch(
  () => [
    props.text,
    props.delay,
    props.duration,
    props.ease,
    props.splitType,
    JSON.stringify(props.from),
    JSON.stringify(props.to),
    props.threshold,
    props.rootMargin,
    fontsLoaded.value
  ],
  () => {
    if (!fontsLoaded.value) return;
    animationCompleted.value = false;
    initAnimation();
  }
);

onBeforeUnmount(() => {
  destroyInstance();
});
</script>

<template>
  <component :is="tag" ref="elRef" :class="elClass" :style="elStyle">{{ text }}</component>
</template>
