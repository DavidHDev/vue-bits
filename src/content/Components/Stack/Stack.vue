<template>
  <div
    class="relative w-full h-full"
    :style="{ perspective: '600px' }"
    @mouseenter="pauseOnHover && (isPaused = true)"
    @mouseleave="pauseOnHover && (isPaused = false)"
  >
    <template v-for="(card, index) in stack" :key="card.id">
      <Motion
        v-if="!shouldDisableDrag"
        as="div"
        class="absolute w-full h-full cursor-grab"
        :style="{
          x: getCardState(card.id).x,
          y: getCardState(card.id).y,
          rotateX: getCardState(card.id).rotateX,
          rotateY: getCardState(card.id).rotateY
        }"
        drag
        :drag-constraints="{ top: 0, right: 0, bottom: 0, left: 0 }"
        :drag-elastic="0.6"
        :while-tap="{ cursor: 'grabbing' }"
        :on-drag-end="(_: PointerEvent, info: PanInfo) => handleDragEnd(_, info, card.id)"
      >
        <Motion
          as="div"
          class="flex justify-center items-center rounded-2xl w-full h-full overflow-hidden"
          :animate="{
            rotateZ: (stack.length - index - 1) * 4 + cardRandomRotations[card.id],
            scale: 1 + index * 0.06 - stack.length * 0.06,
            transformOrigin: '90% 90%'
          }"
          :initial="false"
          :transition="{
            type: 'spring',
            stiffness: animationConfig.stiffness,
            damping: animationConfig.damping
          }"
          @click="shouldEnableClick && sendToBack(card.id)"
        >
          <slot :card="card" :index="index">
            <img
              :src="card.img"
              :alt="`card-${card.id}`"
              class="w-full h-full object-cover pointer-events-none select-none"
              draggable="false"
            />
          </slot>
        </Motion>
      </Motion>

      <Motion v-else as="div" class="absolute w-full h-full cursor-pointer" :style="{ x: 0, y: 0 }">
        <Motion
          as="div"
          class="flex justify-center items-center rounded-2xl w-full h-full overflow-hidden"
          :animate="{
            rotateZ: (stack.length - index - 1) * 4 + cardRandomRotations[card.id],
            scale: 1 + index * 0.06 - stack.length * 0.06,
            transformOrigin: '90% 90%'
          }"
          :initial="false"
          :transition="{
            type: 'spring',
            stiffness: animationConfig.stiffness,
            damping: animationConfig.damping
          }"
          @click="shouldEnableClick && sendToBack(card.id)"
        >
          <slot :card="card" :index="index">
            <img
              :src="card.img"
              :alt="`card-${card.id}`"
              class="w-full h-full object-cover pointer-events-none select-none"
              draggable="false"
            />
          </slot>
        </Motion>
      </Motion>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { PanInfo } from 'motion-v';
import { Motion, useMotionValue, useTransform } from 'motion-v';
import { computed, onBeforeMount, onUnmounted, ref, watch } from 'vue';

interface CardData {
  id: number;
  img: string;
}

interface StackItem {
  id: number;
  img: string;
}

interface AnimationConfig {
  stiffness: number;
  damping: number;
}

interface Props {
  randomRotation?: boolean;
  sensitivity?: number;
  cardsData?: CardData[];
  animationConfig?: AnimationConfig;
  sendToBackOnClick?: boolean;
  autoplay?: boolean;
  autoplayDelay?: number;
  pauseOnHover?: boolean;
  mobileClickOnly?: boolean;
  mobileBreakpoint?: number;
}

const props = withDefaults(defineProps<Props>(), {
  randomRotation: false,
  sensitivity: 200,
  cardsData: () => [],
  animationConfig: () => ({ stiffness: 260, damping: 20 }),
  sendToBackOnClick: false,
  autoplay: false,
  autoplayDelay: 3000,
  pauseOnHover: false,
  mobileClickOnly: false,
  mobileBreakpoint: 768
});

const DEFAULT_CARDS: CardData[] = [
  { id: 1, img: 'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?q=80&w=500&auto=format' },
  { id: 2, img: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=500&auto=format' },
  { id: 3, img: 'https://images.unsplash.com/photo-1452626212852-811d58933cae?q=80&w=500&auto=format' },
  { id: 4, img: 'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?q=80&w=500&auto=format' }
];

const isMobile = ref(false);
const isPaused = ref(false);

const shouldDisableDrag = computed(() => props.mobileClickOnly && isMobile.value);
const shouldEnableClick = computed(() => props.sendToBackOnClick || shouldDisableDrag.value);

function checkMobile() {
  isMobile.value = window.innerWidth < props.mobileBreakpoint;
}

const buildStack = (data: CardData[]): StackItem[] => data.map(card => ({ id: card.id, img: card.img }));

const stack = ref<StackItem[]>(buildStack(props.cardsData.length ? props.cardsData : DEFAULT_CARDS));

watch(
  () => props.cardsData,
  newCards => {
    if (newCards.length) {
      stack.value = buildStack(newCards);
    }
  }
);

const cardRandomRotations = ref<Record<number, number>>({});

function ensureRandomRotation(id: number) {
  if (!(id in cardRandomRotations.value)) {
    cardRandomRotations.value[id] = props.randomRotation ? Math.random() * 10 - 5 : 0;
  }
}

type MotionValue = ReturnType<typeof useMotionValue<number>>;
type TransformValue = ReturnType<typeof useTransform<number, number>>;

interface CardState {
  x: MotionValue;
  y: MotionValue;
  rotateX: TransformValue;
  rotateY: TransformValue;
  reset: () => void;
}

const cardStates = new Map<number, CardState>();

function createCardState(): CardState {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [60, -60]);
  const rotateY = useTransform(x, [-100, 100], [-60, 60]);
  return {
    x,
    y,
    rotateX,
    rotateY,
    reset() {
      x.set(0);
      y.set(0);
    }
  };
}

function getCardState(cardId: number): CardState {
  let state = cardStates.get(cardId);
  if (!state) {
    state = createCardState();
    cardStates.set(cardId, state);
  }
  return state;
}

onBeforeMount(() => {
  stack.value.forEach(card => {
    getCardState(card.id);
    ensureRandomRotation(card.id);
  });
  checkMobile();
  window.addEventListener('resize', checkMobile);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
  if (autoplayInterval) {
    clearInterval(autoplayInterval);
  }
});

function handleDragEnd(_: PointerEvent, info: PanInfo, cardId: number) {
  if (Math.abs(info.offset.x) > props.sensitivity || Math.abs(info.offset.y) > props.sensitivity) {
    sendToBack(cardId);
  } else {
    getCardState(cardId).reset();
  }
}

function sendToBack(id: number) {
  const newStack = [...stack.value];
  const index = newStack.findIndex(card => card.id === id);
  const [card] = newStack.splice(index, 1);
  newStack.unshift(card);
  ensureRandomRotation(card.id);
  stack.value = newStack;
}

let autoplayInterval: ReturnType<typeof setInterval> | null = null;

watch(
  [() => props.autoplay, () => props.autoplayDelay, stack, isPaused],
  () => {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
      autoplayInterval = null;
    }
    if (props.autoplay && stack.value.length > 1 && !isPaused.value) {
      autoplayInterval = setInterval(() => {
        const topCardId = stack.value[stack.value.length - 1].id;
        sendToBack(topCardId);
      }, props.autoplayDelay);
    }
  },
  { immediate: true }
);
</script>
