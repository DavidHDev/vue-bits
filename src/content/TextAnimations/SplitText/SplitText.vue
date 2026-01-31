<template>
  <component :is="tag" ref="elRef" :style="styles" :class="classes">
    {{ text }}
  </component>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, type CSSProperties, onBeforeUnmount, computed } from 'vue';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText as GSAPSplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, GSAPSplitText);

export interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string | ((t: number) => number);
  splitType?: 'chars' | 'words' | 'lines';
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  threshold?: number;
  rootMargin?: string;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  textAlign?: CSSProperties['textAlign'];
  onLetterAnimationComplete?: () => void;
}

const props = withDefaults(defineProps<SplitTextProps>(), {
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
  textAlign: 'center'
});

const emit = defineEmits<{
  'animation-complete': [];
}>();

const elRef = ref<HTMLElement | null>(null);
const fontsLoaded = ref(false);
const animationCompleted = ref(false);

let splitInstance: GSAPSplitText | null = null;

onMounted(() => {
  if (document.fonts.status === 'loaded') {
    fontsLoaded.value = true;
  } else {
    document.fonts.ready.then(() => {
      fontsLoaded.value = true;
    });
  }
});

const runAnimation = () => {
  if (!elRef.value || !props.text || !fontsLoaded.value) return;
  if (animationCompleted.value) return;

  const el = elRef.value as HTMLElement & {
    _rbsplitInstance?: GSAPSplitText;
  };

  // cleanup previous
  if (el._rbsplitInstance) {
    try {
      el._rbsplitInstance.revert();
    } catch {}
    el._rbsplitInstance = undefined;
  }

  const startPct = (1 - props.threshold) * 100;
  const marginMatch = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(props.rootMargin);
  const marginValue = marginMatch ? parseFloat(marginMatch[1]) : 0;
  const marginUnit = marginMatch?.[2] || 'px';

  const sign =
    marginValue === 0
      ? ''
      : marginValue < 0
        ? `-=${Math.abs(marginValue)}${marginUnit}`
        : `+=${marginValue}${marginUnit}`;

  const start = `top ${startPct}%${sign}`;

  let targets: Element[] = [];

  const assignTargets = (self: GSAPSplitText) => {
    if (props.splitType.includes('chars') && self.chars?.length) targets = self.chars;
    if (!targets.length && props.splitType.includes('words') && self.words?.length) targets = self.words;
    if (!targets.length && props.splitType.includes('lines') && self.lines?.length) targets = self.lines;
    if (!targets.length) targets = self.chars || self.words || self.lines;
  };

  splitInstance = new GSAPSplitText(el, {
    type: props.splitType,
    smartWrap: true,
    autoSplit: props.splitType === 'lines',
    linesClass: 'split-line',
    wordsClass: 'split-word',
    charsClass: 'split-char',
    reduceWhiteSpace: false,
    onSplit(self) {
      assignTargets(self);

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
          onComplete() {
            animationCompleted.value = true;
            props.onLetterAnimationComplete?.();
            emit('animation-complete');
          },
          willChange: 'transform, opacity',
          force3D: true
        }
      );
    }
  });

  el._rbsplitInstance = splitInstance;
};

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
  runAnimation,
  { deep: true }
);

onBeforeUnmount(() => {
  ScrollTrigger.getAll().forEach(st => {
    if (st.trigger === elRef.value) st.kill();
  });

  try {
    splitInstance?.revert();
  } catch {}
});

const styles = computed(() => ({
  textAlign: props.textAlign,
  wordWrap: 'break-word',
  willChange: 'transform, opacity'
}));

const classes = computed(() => `split-parent overflow-hidden inline-block whitespace-normal ${props.className}`);
</script>
