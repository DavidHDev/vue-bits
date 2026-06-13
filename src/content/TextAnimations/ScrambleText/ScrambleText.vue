<script setup lang="ts">
import { gsap } from 'gsap';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { SplitText } from 'gsap/SplitText';
import { onMounted, onUnmounted, useTemplateRef, watch, type CSSProperties } from 'vue';

gsap.registerPlugin(SplitText, ScrambleTextPlugin);

interface ScrambleTextProps {
  radius?: number;
  duration?: number;
  speed?: number;
  scrambleChars?: string;
  className?: string;
  style?: CSSProperties;
}

const props = withDefaults(defineProps<ScrambleTextProps>(), {
  radius: 100,
  duration: 1.2,
  speed: 0.5,
  scrambleChars: '.:',
  className: '',
  style: () => ({})
});

const rootRef = useTemplateRef<HTMLDivElement>('rootRef');

let splitText: SplitText | null = null;
let handleMove: ((e: PointerEvent) => void) | null = null;

const initializeScrambleText = () => {
  if (!rootRef.value) return;

  const pElement = rootRef.value.querySelector('p');
  if (!pElement) return;

  splitText = new SplitText(pElement, {
    type: 'chars',
    charsClass: 'inline-block will-change-transform'
  });

  splitText.chars.forEach(el => {
    const c = el as HTMLElement;
    gsap.set(c, { attr: { 'data-content': c.innerHTML } });
  });

  handleMove = (e: PointerEvent) => {
    if (!splitText) return;

    splitText.chars.forEach(el => {
      const c = el as HTMLElement;
      const { left, top, width, height } = c.getBoundingClientRect();
      const dx = e.clientX - (left + width / 2);
      const dy = e.clientY - (top + height / 2);
      const dist = Math.hypot(dx, dy);

      if (dist < props.radius) {
        gsap.to(c, {
          overwrite: true,
          duration: props.duration * (1 - dist / props.radius),
          scrambleText: {
            text: c.dataset.content || '',
            chars: props.scrambleChars,
            speed: props.speed
          },
          ease: 'none'
        });
      }
    });
  };

  rootRef.value.addEventListener('pointermove', handleMove);
};

const cleanup = () => {
  if (rootRef.value && handleMove) {
    rootRef.value.removeEventListener('pointermove', handleMove);
  }
  if (splitText) {
    splitText.revert();
    splitText = null;
  }
  handleMove = null;
};

onMounted(() => {
  initializeScrambleText();
});

onUnmounted(() => {
  cleanup();
});

watch(
  () => props,
  () => {
    cleanup();
    initializeScrambleText();
  }
);
</script>

<template>
  <div
    ref="rootRef"
    :class="`m-[7vw] max-w-[800px] font-mono text-[clamp(14px,4vw,32px)] text-white ${className}`"
    :style="style"
  >
    <p>
      <slot></slot>
    </p>
  </div>
</template>
