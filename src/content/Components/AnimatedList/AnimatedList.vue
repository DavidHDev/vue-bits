<template>
  <div :class="`scroll-list-container relative w-[500px] ${className}`.trim()">
    <div
      ref="listRef"
      :class="[
        'max-h-[400px] overflow-y-auto p-4',
        '[&::-webkit-scrollbar]:w-[8px]',
        '[&::-webkit-scrollbar-track]:bg-[#111]',
        '[&::-webkit-scrollbar-thumb]:bg-[#222]',
        '[&::-webkit-scrollbar-thumb]:rounded-[4px]',
        !displayScrollbar && '[&::-webkit-scrollbar]:hidden scrollbar-none'
      ]"
      :style="{
        scrollbarWidth: displayScrollbar ? 'thin' : 'none'
      }"
      @scroll="handleScroll"
    >
      <AnimatedItem
        v-for="(item, index) in items"
        :key="index"
        :index="index"
        :delay="0.1"
        @mouseenter="handleItemMouseEnter(index)"
        @click="handleItemClick(item, index)"
      >
        <div :class="['p-4 bg-[#222] rounded-lg mb-4', selectedIndex === index ? 'bg-[#222]' : '', itemClassName]">
          <p class="m-0 text-white">{{ item }}</p>
        </div>
      </AnimatedItem>
    </div>
    <template v-if="showGradients">
      <div
        class="top-0 right-0 left-0 absolute bg-gradient-to-b from-[#120F17] to-transparent h-[50px] transition-opacity duration-300 pointer-events-none ease"
        :style="{ opacity: topGradientOpacity }"
      />
      <div
        class="right-0 bottom-0 left-0 absolute bg-gradient-to-t from-[#120F17] to-transparent h-[100px] transition-opacity duration-300 pointer-events-none ease"
        :style="{ opacity: bottomGradientOpacity }"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { motion, useInView } from 'motion-v';
import { defineComponent, h, onMounted, onUnmounted, ref, watch } from 'vue';

const AnimatedItem = defineComponent({
  name: 'AnimatedItem',
  props: {
    index: { type: Number, required: true },
    delay: { type: Number, default: 0 }
  },
  emits: ['mouseenter', 'click'],
  setup(props, { slots, emit }) {
    const itemRef = ref<HTMLElement | null>(null);
    const inView = useInView(itemRef, { amount: 0.5, once: false });

    return () =>
      h(
        motion.div,
        {
          ref: itemRef,
          'data-index': props.index,
          style: { marginBottom: '1rem', cursor: 'pointer' },
          initial: { scale: 0.7, opacity: 0 },
          animate: inView.value ? { scale: 1, opacity: 1 } : { scale: 0.7, opacity: 0 },
          transition: { duration: 0.2, delay: props.delay },
          onMouseenter: (e: MouseEvent) => emit('mouseenter', e),
          onClick: (e: MouseEvent) => emit('click', e)
        },
        slots.default?.()
      );
  }
});

interface AnimatedListProps {
  items?: string[];
  showGradients?: boolean;
  enableArrowNavigation?: boolean;
  className?: string;
  itemClassName?: string;
  displayScrollbar?: boolean;
  initialSelectedIndex?: number;
}

const props = withDefaults(defineProps<AnimatedListProps>(), {
  items: () => [
    'Item 1',
    'Item 2',
    'Item 3',
    'Item 4',
    'Item 5',
    'Item 6',
    'Item 7',
    'Item 8',
    'Item 9',
    'Item 10',
    'Item 11',
    'Item 12',
    'Item 13',
    'Item 14',
    'Item 15'
  ],
  showGradients: true,
  enableArrowNavigation: true,
  className: '',
  itemClassName: '',
  displayScrollbar: true,
  initialSelectedIndex: -1
});

const emit = defineEmits<{
  itemSelected: [item: string, index: number];
}>();

const listRef = ref<HTMLDivElement | null>(null);
const selectedIndex = ref(props.initialSelectedIndex);
const keyboardNav = ref(false);
const topGradientOpacity = ref(0);
const bottomGradientOpacity = ref(1);

const handleItemMouseEnter = (index: number) => {
  selectedIndex.value = index;
};

const handleItemClick = (item: string, index: number) => {
  selectedIndex.value = index;
  emit('itemSelected', item, index);
};

const handleScroll = (e: Event) => {
  const target = e.target as HTMLDivElement;
  const { scrollTop, scrollHeight, clientHeight } = target;
  topGradientOpacity.value = Math.min(scrollTop / 50, 1);
  const bottomDistance = scrollHeight - (scrollTop + clientHeight);
  bottomGradientOpacity.value = scrollHeight <= clientHeight ? 0 : Math.min(bottomDistance / 50, 1);
};

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'ArrowDown' || (e.key === 'Tab' && !e.shiftKey)) {
    e.preventDefault();
    keyboardNav.value = true;
    selectedIndex.value = Math.min(selectedIndex.value + 1, props.items.length - 1);
  } else if (e.key === 'ArrowUp' || (e.key === 'Tab' && e.shiftKey)) {
    e.preventDefault();
    keyboardNav.value = true;
    selectedIndex.value = Math.max(selectedIndex.value - 1, 0);
  } else if (e.key === 'Enter') {
    if (selectedIndex.value >= 0 && selectedIndex.value < props.items.length) {
      e.preventDefault();
      emit('itemSelected', props.items[selectedIndex.value], selectedIndex.value);
    }
  }
};

watch([selectedIndex, keyboardNav], () => {
  if (!keyboardNav.value || selectedIndex.value < 0 || !listRef.value) return;
  const container = listRef.value;
  const selectedItem = container.querySelector(`[data-index="${selectedIndex.value}"]`) as HTMLElement | null;
  if (selectedItem) {
    const extraMargin = 50;
    const containerScrollTop = container.scrollTop;
    const containerHeight = container.clientHeight;
    const itemTop = selectedItem.offsetTop;
    const itemBottom = itemTop + selectedItem.offsetHeight;
    if (itemTop < containerScrollTop + extraMargin) {
      container.scrollTo({ top: itemTop - extraMargin, behavior: 'smooth' });
    } else if (itemBottom > containerScrollTop + containerHeight - extraMargin) {
      container.scrollTo({ top: itemBottom - containerHeight + extraMargin, behavior: 'smooth' });
    }
  }
  keyboardNav.value = false;
});

onMounted(() => {
  if (props.enableArrowNavigation) {
    window.addEventListener('keydown', handleKeyDown);
  }
});

onUnmounted(() => {
  if (props.enableArrowNavigation) {
    window.removeEventListener('keydown', handleKeyDown);
  }
});
</script>
