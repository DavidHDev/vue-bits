<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick, useTemplateRef } from 'vue';

interface DecryptedTextProps {
  text: string;
  speed?: number;
  maxIterations?: number;
  sequential?: boolean;
  revealDirection?: 'start' | 'end' | 'center';
  useOriginalCharsOnly?: boolean;
  characters?: string;
  className?: string;
  encryptedClassName?: string;
  parentClassName?: string;
  animateOn?: 'view' | 'hover';
}

const props = withDefaults(defineProps<DecryptedTextProps>(), {
  text: '',
  speed: 50,
  maxIterations: 10,
  sequential: false,
  revealDirection: 'start',
  useOriginalCharsOnly: false,
  characters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+',
  className: '',
  parentClassName: '',
  encryptedClassName: '',
  animateOn: 'hover'
});

const emit = defineEmits<{
  animationComplete: [];
}>();

const containerRef = useTemplateRef<HTMLSpanElement>('containerRef');
const displayText = ref(props.text);
const isHovering = ref(false);
const isScrambling = ref(false);
const revealedIndices = ref(new Set<number>());
const hasAnimated = ref(false);

let interval: ReturnType<typeof setInterval> | null = null;
let intersectionObserver: IntersectionObserver | null = null;

watch(
  [
    () => isHovering.value,
    () => props.text,
    () => props.speed,
    () => props.maxIterations,
    () => props.sequential,
    () => props.revealDirection,
    () => props.characters,
    () => props.useOriginalCharsOnly
  ],
  () => {
    let currentIteration = 0;

    const getNextIndex = (revealedSet: Set<number>): number => {
      const textLength = props.text.length;
      switch (props.revealDirection) {
        case 'start':
          return revealedSet.size;
        case 'end':
          return textLength - 1 - revealedSet.size;
        case 'center': {
          const middle = Math.floor(textLength / 2);
          const offset = Math.floor(revealedSet.size / 2);
          const nextIndex = revealedSet.size % 2 === 0 ? middle + offset : middle - offset - 1;

          if (nextIndex >= 0 && nextIndex < textLength && !revealedSet.has(nextIndex)) {
            return nextIndex;
          }
          for (let i = 0; i < textLength; i++) {
            if (!revealedSet.has(i)) return i;
          }
          return 0;
        }
        default:
          return revealedSet.size;
      }
    };

    const availableChars = props.useOriginalCharsOnly
      ? Array.from(new Set(props.text.split(''))).filter(char => char !== ' ')
      : props.characters.split('');

    const shuffleText = (originalText: string, currentRevealed: Set<number>): string => {
      if (props.useOriginalCharsOnly) {
        const positions = originalText.split('').map((char, i) => ({
          char,
          isSpace: char === ' ',
          index: i,
          isRevealed: currentRevealed.has(i)
        }));

        const nonSpaceChars = positions.filter(p => !p.isSpace && !p.isRevealed).map(p => p.char);

        for (let i = nonSpaceChars.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [nonSpaceChars[i], nonSpaceChars[j]] = [nonSpaceChars[j], nonSpaceChars[i]];
        }

        let charIndex = 0;
        return positions
          .map(p => {
            if (p.isSpace) return ' ';
            if (p.isRevealed) return originalText[p.index];
            return nonSpaceChars[charIndex++];
          })
          .join('');
      } else {
        return originalText
          .split('')
          .map((char, i) => {
            if (char === ' ') return ' ';
            if (currentRevealed.has(i)) return originalText[i];
            return availableChars[Math.floor(Math.random() * availableChars.length)];
          })
          .join('');
      }
    };

    if (interval) {
      clearInterval(interval);
      interval = null;
    }

    if (isHovering.value) {
      isScrambling.value = true;
      interval = setInterval(() => {
        if (props.sequential) {
          if (revealedIndices.value.size < props.text.length) {
            const nextIndex = getNextIndex(revealedIndices.value);
            const newRevealed = new Set(revealedIndices.value);
            newRevealed.add(nextIndex);
            revealedIndices.value = newRevealed;
            displayText.value = shuffleText(props.text, newRevealed);
          } else {
            clearInterval(interval!);
            interval = null;
            isScrambling.value = false;
            emit('animationComplete');
          }
        } else {
          displayText.value = shuffleText(props.text, revealedIndices.value);
          currentIteration++;
          if (currentIteration >= props.maxIterations) {
            clearInterval(interval!);
            interval = null;
            isScrambling.value = false;
            displayText.value = props.text;
            emit('animationComplete');
          }
        }
      }, props.speed);
    } else {
      displayText.value = props.text;
      revealedIndices.value = new Set();
      isScrambling.value = false;
    }
  }
);

const handleMouseEnter = () => {
  if (props.animateOn === 'hover') {
    isHovering.value = true;
  }
};

const handleMouseLeave = () => {
  if (props.animateOn === 'hover') {
    isHovering.value = false;
  }
};

onMounted(async () => {
  if (props.animateOn === 'view') {
    await nextTick();

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimated.value) {
          isHovering.value = true;
          hasAnimated.value = true;
        }
      });
    };

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    intersectionObserver = new IntersectionObserver(observerCallback, observerOptions);
    if (containerRef.value) {
      intersectionObserver.observe(containerRef.value);
    }
  }
});

onUnmounted(() => {
  if (interval) {
    clearInterval(interval);
  }
  if (intersectionObserver && containerRef.value) {
    intersectionObserver.unobserve(containerRef.value);
  }
});
</script>

<template>
  <span
    ref="containerRef"
    :class="`inline-block whitespace-pre-wrap ${props.parentClassName}`"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <span class="sr-only">{{ displayText }}</span>

    <span aria-hidden="true">
      <span
        v-for="(char, index) in displayText.split('')"
        :key="index"
        :class="revealedIndices.has(index) || !isScrambling || !isHovering ? props.className : props.encryptedClassName"
      >
        {{ char }}
      </span>
    </span>
  </span>
</template>
