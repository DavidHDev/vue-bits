<template>
  <div
    v-if="isOpen"
    class="search-dialog fixed inset-0 bg-black/90 z-[9999] flex items-start justify-center pt-[64px] animate-fade-in"
    @click="closeDialog"
  >
    <div
      class="bg-[#0b0b0b] border border-[#2e4e3e] p-4 mx-4 pb-2 rounded-xl w-full max-w-[720px] overflow-hidden animate-slide-in"
      @click.stop
    >
      <div class="relative flex items-center pb-2">
        <i class="pi pi-search text-[#9eefb0] py-2.5 px-3"></i>
        <input
          ref="searchInputRef"
          v-model="inputValue"
          type="text"
          placeholder="Search the docs"
          class="flex-1 bg-transparent border-none outline-none text-white text-lg placeholder:text-[#182916] focus:outline-none"
          @keydown="handleKeyDown"
        />
      </div>

      <AnimatePresence>
        <Motion
          v-if="searchValue"
          key="results"
          :initial="{ height: 0, opacity: 0 }"
          :animate="{ height: 'auto', opacity: 1 }"
          :exit="{ height: 0, opacity: 0 }"
          :transition="{ duration: 0.3 }"
          class="overflow-hidden"
        >
          <div
            v-if="searchResults.length > 0"
            class="relative max-h-[400px] overflow-hidden border-t border-[#2e4e3e] pb-4"
          >
            <div
              class="max-h-[400px] overflow-y-auto"
              :style="{
                scrollbarWidth: 'thin',
                scrollbarColor: '#1e3725 #0b0b0b'
              }"
              ref="listRef"
              @scroll="handleScroll"
            >
              <Motion
                v-for="(result, index) in searchResults"
                :key="`${result.categoryName}-${result.componentName}-${index}`"
                :data-index="index"
                class="cursor-pointer mr-2"
                :initial="{ scale: 0.7, opacity: 0 }"
                :animate="getItemInView(index) ? { scale: 1, opacity: 1 } : { scale: 0.7, opacity: 0 }"
                :transition="{ duration: 0.2, delay: 0.05 }"
                @mouseenter="() => setSelectedIndex(index)"
                @click="
                  () => {
                    handleSelect(searchResults[index]);
                  }
                "
              >
                <div
                  class="flex items-center p-[14px] rounded-xl transition-all duration-200"
                  :class="[
                    selectedIndex === index ? 'bg-[#2e4e31]' : 'hover:bg-[#2e4e31] bg-[#222]',
                    index === 0 ? 'mt-4' : 'mt-2'
                  ]"
                >
                  <i
                    class="text-[#9eefb0] mr-4"
                    :class="
                      categoryIconMapping[result.categoryName as keyof typeof categoryIconMapping] || 'pi pi-search'
                    "
                  ></i>
                  <div class="flex flex-col flex-1">
                    <div class="text-white text-base font-bold">{{ result.componentName }}</div>
                    <div class="text-[#9eefb0] text-sm">in {{ result.categoryName }}</div>
                  </div>
                  <i class="pi pi-reply rotate-180 text-[#9eefb0]"></i>
                </div>
              </Motion>
            </div>

            <div
              class="absolute top-0 left-0 right-0 h-[50px] bg-gradient-to-b from-[#0b0b0b] to-transparent pointer-events-none transition-opacity duration-300 ease"
              :style="{ opacity: topGradientOpacity }"
            ></div>
            <div
              class="absolute bottom-0 left-0 right-0 h-[100px] bg-gradient-to-t from-[#0b0b0b] to-transparent pointer-events-none transition-opacity duration-300 ease"
              :style="{ opacity: bottomGradientOpacity }"
            ></div>
          </div>

          <div
            v-else-if="searchValue && searchResults.length === 0"
            class="p-4 pb-2 text-center border-t border-[#2e4e3e]"
          >
            <div class="text-[#9eefac] text-sm">
              No results found for "
              <span class="font-black">{{ searchValue }}</span>
              "
            </div>
          </div>
        </Motion>
      </AnimatePresence>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onUnmounted, useTemplateRef } from 'vue';
import { useRouter } from 'vue-router';
import { CATEGORIES } from '../../constants/Categories';
import { Motion, AnimatePresence } from 'motion-v';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close', 'open']);

const router = useRouter();

const searchInputRef = ref<HTMLInputElement | null>(null);
const inputValue = ref('');
const selectedIndex = ref(0);
const listRef = useTemplateRef<HTMLDivElement>('listRef');
const itemsInView = ref<boolean[]>([]);
const keyboardNav = ref(false);
const topGradientOpacity = ref(0);
const bottomGradientOpacity = ref(1);
const searchValue = ref('');
let debounceTimer: ReturnType<typeof setTimeout> | null = null;

interface SearchResult {
  categoryName: string;
  componentName: string;
}

const categoryIconMapping = {
  'Get Started': 'pi pi-file',
  'Text Animations': 'pi pi-hashtag',
  Animations: 'pi pi-circle',
  Components: 'pi pi-box',
  Backgrounds: 'pi pi-image'
};

const searchResults = computed(() => {
  return searchComponents(searchValue.value);
});

watch(inputValue, newValue => {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    searchValue.value = newValue;
    selectedIndex.value = -1;
  }, 500);
});

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
      container.scrollTo({
        top: itemBottom - containerHeight + extraMargin,
        behavior: 'smooth'
      });
    }
  }
  keyboardNav.value = false;
});

const levenshtein = (a: string, b: string): number => {
  const m = a.length,
    n = b.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] : Math.min(dp[i - 1][j - 1] + 1, dp[i][j - 1] + 1, dp[i - 1][j] + 1);
    }
  }
  return dp[m][n];
};

const fuzzyMatch = (candidate: string, query: string): boolean => {
  const lowerCandidate = candidate.toLowerCase();
  const lowerQuery = query.toLowerCase();
  if (lowerCandidate.includes(lowerQuery)) return true;
  const candidateWords = lowerCandidate.split(/\s+/);
  const queryWords = lowerQuery.split(/\s+/);
  return queryWords.every((qw: string) =>
    candidateWords.some((cw: string) => {
      const distance = levenshtein(cw, qw);
      const threshold = Math.max(1, Math.floor(qw.length / 3));
      return distance <= threshold;
    })
  );
};

const searchComponents = (query: string): SearchResult[] => {
  if (!query || query.trim() === '') return [];
  const results: SearchResult[] = [];
  CATEGORIES.forEach(category => {
    const { name: categoryName, subcategories } = category;
    if (fuzzyMatch(categoryName, query)) {
      subcategories.forEach(component => results.push({ categoryName, componentName: component }));
    } else {
      subcategories.forEach(component => {
        if (fuzzyMatch(component, query)) results.push({ categoryName, componentName: component });
      });
    }
  });
  return results;
};

watch(searchResults, () => {
  nextTick(() => {
    updateItemsInView();
    if (!listRef.value) return;
    const { scrollTop, scrollHeight, clientHeight } = listRef.value;
    const bottomDistance = scrollHeight - (scrollTop + clientHeight);
    bottomGradientOpacity.value = scrollHeight <= clientHeight ? 0 : Math.min(bottomDistance / 50, 1);
  });
});

const handleKeyDown = (event: KeyboardEvent) => {
  if (!searchValue.value) return;
  if (event.key === 'ArrowDown' || (event.key === 'Tab' && !event.shiftKey)) {
    event.preventDefault();
    keyboardNav.value = true;
    selectedIndex.value = Math.min(selectedIndex.value + 1, searchResults.value.length - 1);
  } else if (event.key === 'ArrowUp' || (event.key === 'Tab' && event.shiftKey)) {
    event.preventDefault();
    keyboardNav.value = true;
    selectedIndex.value = Math.max(selectedIndex.value - 1, 0);
  } else if (event.key === 'Enter' && selectedIndex.value >= 0) {
    event.preventDefault();
    handleSelect(searchResults.value[selectedIndex.value]);
  }
};

const handleScroll = (e: Event) => {
  const target = e.target as HTMLDivElement;
  const { scrollTop, scrollHeight, clientHeight } = target;
  topGradientOpacity.value = Math.min(scrollTop / 50, 1);
  const bottomDistance = scrollHeight - (scrollTop + clientHeight);
  bottomGradientOpacity.value = scrollHeight <= clientHeight ? 0 : Math.min(bottomDistance / 50, 1);
  updateItemsInView();
};

const handleSelect = (result: SearchResult) => {
  const slug = (result: string) => result.replace(/\s+/g, '-').toLowerCase();
  router.push(`/${slug(result.categoryName)}/${slug(result.componentName)}`);
  closeDialog();
};

const setSelectedIndex = (index: number) => {
  selectedIndex.value = index;
};

const getItemInView = (index: number) => {
  return itemsInView.value[index] ?? false;
};

const updateItemsInView = () => {
  if (!listRef.value) return;

  const container = listRef.value;
  const containerRect = container.getBoundingClientRect();

  itemsInView.value = searchResults.value.map((_, index) => {
    const item = container.querySelector(`[data-index="${index}"]`) as HTMLElement;
    if (!item) return false;

    const itemRect = item.getBoundingClientRect();
    const viewHeight = containerRect.height;
    const itemTop = itemRect.top - containerRect.top;
    const itemBottom = itemTop + itemRect.height;

    return itemTop < viewHeight && itemBottom > 0;
  });
};

const closeDialog = () => {
  document.body.classList.remove('overflow-hidden');
  emit('close');
  inputValue.value = '';
  selectedIndex.value = 0;
};

const handleGlobalKeyDown = (event: KeyboardEvent) => {
  if (event.key === '/' && !props.isOpen) {
    event.preventDefault();
    emit('open');
  }
};

watch(
  () => props.isOpen,
  isOpen => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden');
      nextTick(() => {
        searchInputRef.value?.focus();
      });
    }
  }
);

onUnmounted(() => {
  document.removeEventListener('keydown', handleGlobalKeyDown);
  if (debounceTimer) clearTimeout(debounceTimer);
});
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.animate-fade-in {
  animation: fade-in 0.2s ease-out;
}

.animate-slide-in {
  animation: slide-in 0.3s ease-out;
}

@media (prefers-reduced-motion: reduce) {
  .animate-fade-in,
  .animate-slide-in {
    animation: none;
  }

  .transition-all {
    transition: none;
  }
}
</style>
