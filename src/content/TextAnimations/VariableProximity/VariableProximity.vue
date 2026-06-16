<template>
  <span
    ref="rootRef"
    :class="[props.className]"
    :style="{
      display: 'inline',
      fontFamily: '\'Roboto Flex\', sans-serif',
      ...props.style
    }"
    @click="props.onClick"
  >
    <span
      v-for="(word, wordIndex) in words"
      :key="wordIndex"
      :style="{ display: 'inline-block', whiteSpace: 'nowrap' }"
    >
      <span
        v-for="(letter, lIdx) in word.split('')"
        :key="getLetterKey(wordIndex, lIdx)"
        :ref="el => setLetterRef(el as HTMLElement | null, wordIndex, lIdx)"
        :style="{
          display: 'inline-block',
          fontVariationSettings: fromFontVariationSettings
        }"
        aria-hidden="true"
      >
        {{ letter }}
      </span>
      <span v-if="wordIndex < words.length - 1" style="display: inline-block">&nbsp;</span>
    </span>
    <span class="sr-only">{{ props.label }}</span>
  </span>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, type CSSProperties } from 'vue';

export type FalloffType = 'linear' | 'exponential' | 'gaussian';

interface VariableProximityProps {
  label: string;
  fromFontVariationSettings: string;
  toFontVariationSettings: string;
  containerRef?: HTMLElement | null;
  radius?: number;
  falloff?: FalloffType;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
}

const props = withDefaults(defineProps<VariableProximityProps>(), {
  radius: 50,
  falloff: 'linear',
  className: '',
  style: () => ({}),
  onClick: undefined
});

const rootRef = ref<HTMLElement | null>(null);
const letterRefs = ref<(HTMLElement | null)[]>([]);
const mousePositionRef = { x: 0, y: 0 };
const lastPositionRef = { x: null as number | null, y: null as number | null };

let animationFrameId: number | null = null;

const words = computed(() => props.label.split(' '));

const parsedSettings = computed(() => {
  const parseSettings = (settingsStr: string) => {
    const result = new Map<string, number>();
    settingsStr.split(',').forEach(s => {
      const parts = s.trim().split(' ');
      if (parts.length === 2) {
        result.set(parts[0].replace(/['"]/g, ''), parseFloat(parts[1]));
      }
    });
    return result;
  };

  const fromSettings = parseSettings(props.fromFontVariationSettings);
  const toSettings = parseSettings(props.toFontVariationSettings);

  return Array.from(fromSettings.entries()).map(([axis, fromValue]) => ({
    axis,
    fromValue,
    toValue: toSettings.get(axis) ?? fromValue
  }));
});

const calculateDistance = (x1: number, y1: number, x2: number, y2: number) =>
  Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

const calculateFalloff = (distance: number) => {
  const norm = Math.min(Math.max(1 - distance / props.radius, 0), 1);
  switch (props.falloff) {
    case 'exponential':
      return norm ** 2;
    case 'gaussian':
      return Math.exp(-((distance / (props.radius / 2)) ** 2) / 2);
    case 'linear':
    default:
      return norm;
  }
};

const getLetterKey = (wordIndex: number, letterIndex: number) => `${wordIndex}-${letterIndex}`;

const getGlobalLetterIndex = (wordIndex: number, letterIndex: number) => {
  let globalIndex = 0;
  for (let i = 0; i < wordIndex; i++) {
    globalIndex += words.value[i].length;
  }
  return globalIndex + letterIndex;
};

const setLetterRef = (el: HTMLElement | null, wordIndex: number, lIdx: number) => {
  const globalIndex = getGlobalLetterIndex(wordIndex, lIdx);
  letterRefs.value[globalIndex] = el;
};

const updatePosition = (x: number, y: number) => {
  if (props.containerRef) {
    const rect = props.containerRef.getBoundingClientRect();
    mousePositionRef.x = x - rect.left;
    mousePositionRef.y = y - rect.top;
  } else {
    mousePositionRef.x = x;
    mousePositionRef.y = y;
  }
};

const handleMouseMove = (ev: MouseEvent) => updatePosition(ev.clientX, ev.clientY);

const handleTouchMove = (ev: TouchEvent) => {
  const touch = ev.touches[0];
  updatePosition(touch.clientX, touch.clientY);
};

const animationLoop = () => {
  if (!props.containerRef) {
    animationFrameId = requestAnimationFrame(animationLoop);
    return;
  }

  const { x, y } = mousePositionRef;
  if (lastPositionRef.x === x && lastPositionRef.y === y) {
    animationFrameId = requestAnimationFrame(animationLoop);
    return;
  }

  lastPositionRef.x = x;
  lastPositionRef.y = y;

  const containerRect = props.containerRef.getBoundingClientRect();

  letterRefs.value.forEach(letterEl => {
    if (!letterEl) return;

    const rect = letterEl.getBoundingClientRect();
    const letterCenterX = rect.left + rect.width / 2 - containerRect.left;
    const letterCenterY = rect.top + rect.height / 2 - containerRect.top;

    const distance = calculateDistance(mousePositionRef.x, mousePositionRef.y, letterCenterX, letterCenterY);

    if (distance >= props.radius) {
      letterEl.style.fontVariationSettings = props.fromFontVariationSettings;
      return;
    }

    const falloffValue = calculateFalloff(distance);
    const newSettings = parsedSettings.value
      .map(({ axis, fromValue, toValue }) => {
        const interpolatedValue = fromValue + (toValue - fromValue) * falloffValue;
        return `'${axis}' ${interpolatedValue}`;
      })
      .join(', ');

    letterEl.style.fontVariationSettings = newSettings;
  });

  animationFrameId = requestAnimationFrame(animationLoop);
};

onMounted(() => {
  nextTick(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    animationFrameId = requestAnimationFrame(animationLoop);
  });
});

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove);
  window.removeEventListener('touchmove', handleTouchMove);
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
  }
});
</script>
