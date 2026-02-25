<script setup lang="ts">
import { motion } from 'motion-v';
import { computed, nextTick, onMounted, onUnmounted, ref, watch, useTemplateRef, type Ref } from 'vue';

interface TrueFocusProps {
  sentence?: string;
  manualMode?: boolean;
  blurAmount?: number;
  borderColor?: string;
  glowColor?: string;
  animationDuration?: number;
  pauseBetweenAnimations?: number;
  index?: Array<number>;
  syncGroup?: string;
}

const props = withDefaults(defineProps<TrueFocusProps>(), {
  sentence: 'True Focus',
  manualMode: false,
  blurAmount: 5,
  borderColor: 'green',
  glowColor: 'rgba(0, 255, 0, 0.6)',
  animationDuration: 0.5,
  pauseBetweenAnimations: 1
});

const words = computed(() => props.sentence.split(' '));

const currentIndex = props.syncGroup ? getSyncGroupIndex(props.syncGroup) : ref(-1);
const lastActiveIndex = ref<number | null>(null);
const containerRef = useTemplateRef<HTMLDivElement>('containerRef');
const wordRefs = ref<HTMLSpanElement[]>([]);
const focusRect = ref({ x: 0, y: 0, width: 0, height: 0 });

let interval: ReturnType<typeof setInterval> | null = null;

watch(
  [currentIndex, () => words.value.length],
  async () => {
    if (currentIndex.value === null || currentIndex.value === -1) return;

    let actualWordIndex = currentIndex.value;
    if (props.index) {
      actualWordIndex = props.index.findIndex(val => val === currentIndex.value);
      if (actualWordIndex === -1) return;
    }

    if (!wordRefs.value[actualWordIndex] || !containerRef.value) return;

    await nextTick();

    const parentRect = containerRef.value.getBoundingClientRect();
    const activeRect = wordRefs.value[actualWordIndex].getBoundingClientRect();

    focusRect.value = {
      x: activeRect.left - parentRect.left,
      y: activeRect.top - parentRect.top,
      width: activeRect.width,
      height: activeRect.height
    };
  },
  { immediate: true }
);

const handleMouseEnter = (index: number) => {
  if (props.manualMode) {
    const mappedIndex = props.index ? props.index[index] : index;
    lastActiveIndex.value = mappedIndex;
    currentIndex.value = mappedIndex;
  }
};

const handleMouseLeave = () => {
  if (props.manualMode) {
    currentIndex.value = lastActiveIndex.value || 0;
  }
};

const setWordRef = (el: HTMLSpanElement | null, index: number) => {
  if (el) wordRefs.value[index] = el;
};

const startInterval = () => {
  if (interval) clearInterval(interval);
  if (!props.manualMode) {
    interval = setInterval(
      () => {
        currentIndex.value = (currentIndex.value + 1) % words.value.length;
      },
      (props.animationDuration + props.pauseBetweenAnimations) * 1000
    );
  }
};

onMounted(async () => {
  await nextTick();

  const isOwner = props.syncGroup ? registerSyncGroup(props.syncGroup) : true;

  let initialWordIndex = 0;
  if (props.index && currentIndex.value !== null && currentIndex.value !== undefined) {
    const foundIndex = props.index.findIndex(val => val === currentIndex.value);
    if (foundIndex !== -1) initialWordIndex = foundIndex;
  }

  if (wordRefs.value[initialWordIndex] && containerRef.value) {
    const parentRect = containerRef.value.getBoundingClientRect();
    const activeRect = wordRefs.value[initialWordIndex].getBoundingClientRect();
    focusRect.value = {
      x: activeRect.left - parentRect.left,
      y: activeRect.top - parentRect.top,
      width: activeRect.width,
      height: activeRect.height
    };
  }

  if (isOwner) {
    watch(
      [() => props.manualMode, () => props.animationDuration, () => props.pauseBetweenAnimations, () => words.value],
      () => startInterval(),
      { immediate: true }
    );
  }
});

onUnmounted(() => {
  if (interval) clearInterval(interval);
  if (props.syncGroup) unregisterSyncGroup(props.syncGroup);
});
</script>
<script lang="ts">
interface SyncGroupState {
  index: Ref<number>;
  count: number;
}

export const syncGroupMap = new Map<string, SyncGroupState>();

export function getSyncGroupIndex(group: string): Ref<number> {
  if (!syncGroupMap.has(group)) {
    syncGroupMap.set(group, { index: ref(-1), count: 0 });
  }
  return syncGroupMap.get(group)!.index;
}

export function registerSyncGroup(group: string): boolean {
  const state = syncGroupMap.get(group)!;
  state.count += 1;
  return state.count === 1;
}

export function unregisterSyncGroup(group: string): void {
  if (!syncGroupMap.has(group)) return;
  const state = syncGroupMap.get(group)!;
  state.count -= 1;
  if (state.count <= 0) {
    syncGroupMap.delete(group);
  }
}
</script>

<template>
  <div class="relative flex flex-wrap justify-center items-center gap-[1em]" ref="containerRef">
    <span
      v-for="(word, index) in words"
      :key="props.index ? props.index[index] : index"
      :ref="el => setWordRef(el as HTMLSpanElement, index)"
      class="relative font-black text-7xl transition-[filter,color] duration-300 ease-in-out cursor-pointer"
      :style="{
        filter:
          currentIndex === -1 || (props.index ? props.index[index] : index) === currentIndex
            ? 'blur(0px)'
            : `blur(${blurAmount}px)`,
        '--border-color': borderColor,
        '--glow-color': glowColor,
        transition: `filter ${animationDuration}s ease`
      }"
      @mouseenter="handleMouseEnter(index)"
      @mouseleave="handleMouseLeave"
    >
      {{ word }}
    </span>

    <motion.div
      class="top-0 left-0 box-content absolute border-none pointer-events-none"
      :animate="{
        x: focusRect.x,
        y: focusRect.y,
        width: focusRect.width,
        height: focusRect.height,
        opacity: currentIndex >= 0 ? 1 : 0
      }"
      :transition="{
        duration: animationDuration
      }"
      :style="{
        '--border-color': borderColor,
        '--glow-color': glowColor
      }"
    >
      <span
        class="top-[-10px] left-[-10px] absolute filter-[drop-shadow(0_0_4px_var(--border-color,#fff))] border-[3px] border-(--border-color,#fff) border-r-0 border-b-0 rounded-[3px] w-4 h-4 transition-none"
      ></span>

      <span
        class="top-[-10px] right-[-10px] absolute filter-[drop-shadow(0_0_4px_var(--border-color,#fff))] border-[3px] border-(--border-color,#fff) border-b-0 border-l-0 rounded-[3px] w-4 h-4 transition-none"
      ></span>

      <span
        class="bottom-[-10px] left-[-10px] absolute filter-[drop-shadow(0_0_4px_var(--border-color,#fff))] border-[3px] border-(--border-color,#fff) border-t-0 border-r-0 rounded-[3px] w-4 h-4 transition-none"
      ></span>

      <span
        class="right-[-10px] bottom-[-10px] absolute filter-[drop-shadow(0_0_4px_var(--border-color,#fff))] border-[3px] border-(--border-color,#fff) border-t-0 border-l-0 rounded-[3px] w-4 h-4 transition-none"
      ></span>
    </motion.div>
  </div>
</template>
