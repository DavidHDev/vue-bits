<template>
  <span
    ref="rootRef"
    :class="[props.className]"
    :style="{
      display: 'inline',
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
        v-for="(letter, letterIndex) in word.split('')"
        :key="getLetterKey(wordIndex, letterIndex)"
        :style="{
          display: 'inline-block',
          fontVariationSettings: props.fromFontVariationSettings
        }"
        class="letter"
        :data-index="getGlobalLetterIndex(wordIndex, letterIndex)"
        aria-hidden="true"
      >
        {{ letter }}
      </span>
      <span v-if="wordIndex < words.length - 1" class="inline-block">&nbsp;</span>
    </span>
    <span class="absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap clip-rect-0 border-0">
      {{ props.label }}
    </span>
  </span>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, type CSSProperties } from 'vue';

export type FalloffType = 'linear' | 'exponential' | 'gaussian';

interface VariableProximityProps {
  label: string;
  fromFontVariationSettings: string;
  toFontVariationSettings: string;
  containerRef?: HTMLElement | null | undefined;
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
const letterElements = ref<HTMLElement[]>([]);
const mousePosition = ref({ x: 0, y: 0 });
const lastPosition = ref<{ x: number | null; y: number | null }>({ x: null, y: null });
const interpolatedSettings = ref<string[]>([]);

let animationFrameId: number | null = null;

const words = computed(() => props.label.split(' '));

const parsedSettings = computed(() => {
  const parseSettings = (settingsStr: string) => {
    const result = new Map();
    settingsStr.split(',').forEach(s => {
      const parts = s.trim().split(' ');
      if (parts.length === 2) {
        const name = parts[0].replace(/['"]/g, '');
        const value = parseFloat(parts[1]);
        result.set(name, value);
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

const initializeLetterElements = () => {
  if (!rootRef.value) return;

  const elements = rootRef.value.querySelectorAll('.letter');
  letterElements.value = Array.from(elements) as HTMLElement[];

  console.log(`Found ${letterElements.value.length} letter elements`);
};

const handleMouseMove = (ev: MouseEvent) => {
  const container = props.containerRef || rootRef.value;
  if (!container) return;

  const rect = container.getBoundingClientRect();
  mousePosition.value = {
    x: ev.clientX - rect.left,
    y: ev.clientY - rect.top
  };
};

const handleTouchMove = (ev: TouchEvent) => {
  const container = props.containerRef || rootRef.value;
  if (!container) return;

  const touch = ev.touches[0];
  const rect = container.getBoundingClientRect();
  mousePosition.value = {
    x: touch.clientX - rect.left,
    y: touch.clientY - rect.top
  };
};

const animationLoop = () => {
  const container = props.containerRef || rootRef.value;
  if (!container || letterElements.value.length === 0) {
    animationFrameId = requestAnimationFrame(animationLoop);
    return;
  }

  const containerRect = container.getBoundingClientRect();

  if (lastPosition.value.x === mousePosition.value.x && lastPosition.value.y === mousePosition.value.y) {
    animationFrameId = requestAnimationFrame(animationLoop);
    return;
  }

  lastPosition.value = { x: mousePosition.value.x, y: mousePosition.value.y };

  const newSettings = Array(letterElements.value.length).fill(props.fromFontVariationSettings);

  letterElements.value.forEach((letterEl, index) => {
    if (!letterEl) return;

    const rect = letterEl.getBoundingClientRect();
    const letterCenterX = rect.left + rect.width / 2 - containerRect.left;
    const letterCenterY = rect.top + rect.height / 2 - containerRect.top;

    const distance = calculateDistance(mousePosition.value.x, mousePosition.value.y, letterCenterX, letterCenterY);

    if (distance >= props.radius) {
      return;
    }

    const falloffValue = calculateFalloff(distance);
    const setting = parsedSettings.value
      .map(({ axis, fromValue, toValue }) => {
        const interpolatedValue = fromValue + (toValue - fromValue) * falloffValue;
        return `'${axis}' ${interpolatedValue}`;
      })
      .join(', ');

    newSettings[index] = setting;
  });

  interpolatedSettings.value = newSettings;

  letterElements.value.forEach((letterEl, index) => {
    letterEl.style.fontVariationSettings = interpolatedSettings.value[index];
  });

  animationFrameId = requestAnimationFrame(animationLoop);
};

onMounted(() => {
  nextTick(() => {
    initializeLetterElements();

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    animationFrameId = requestAnimationFrame(animationLoop);
  });
});

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove);
  window.removeEventListener('touchmove', handleTouchMove);

  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
});
</script>
