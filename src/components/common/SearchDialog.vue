<template>
  <Teleport to="body">
    <div v-if="isSearchOpen" class="search-backdrop" @click="closeSearch">
      <div class="search-dialog" role="dialog" aria-label="Search" @click.stop>
        <div class="search-input-row">
          <span class="search-input-icon">
            <HugeiconsIcon :icon="Search01Icon" :size="18" :stroke-width="1.6" aria-hidden="true" />
          </span>
          <input
            ref="inputRef"
            v-model="inputValue"
            class="search-input"
            placeholder="Search components, categories, or keywords..."
            aria-label="Search"
          />
          <kbd class="search-kbd" @click="closeSearch">esc</kbd>
        </div>

        <div v-if="searchValue" class="search-results-wrapper">
          <div ref="resultsRef" class="search-results" role="listbox" @scroll="handleScroll">
            <template v-if="results.length > 0">
              <span
                class="search-highlight"
                aria-hidden="true"
                :data-ready="highlight?.ready ? '' : undefined"
                :style="
                  highlight
                    ? {
                        height: `${highlight.height}px`,
                        transform: `translateY(${highlight.y}px)`,
                        opacity: highlight.visible ? 1 : 0
                      }
                    : { opacity: 0 }
                "
              />

              <div class="search-group-label">Vue Bits</div>

              <div
                v-for="(result, index) in results"
                :key="`${result.categoryName}-${result.componentName}`"
                class="search-row"
                :data-index="index"
                :data-selected="index === selectedIndex ? '' : undefined"
                role="option"
                :aria-selected="index === selectedIndex"
                @mousemove="index !== selectedIndex && (selectedIndex = index)"
                @click="handleSelect(result)"
              >
                <span class="search-row-icon">
                  <HugeiconsIcon
                    :icon="CATEGORY_ICONS[result.categoryName] ?? Search01Icon"
                    :size="16"
                    :stroke-width="1.6"
                    aria-hidden="true"
                  />
                </span>
                <span class="search-row-text">
                  <span class="search-row-title">{{ result.componentName }}</span>
                  <span class="search-row-meta">{{ result.matchLabel }}</span>
                </span>
                <span class="search-row-trail">
                  <HugeiconsIcon :icon="ArrowTurnBackwardIcon" :size="16" :stroke-width="1.6" aria-hidden="true" />
                </span>
              </div>
            </template>

            <p v-else class="search-no-results">
              No results for
              <strong>{{ searchValue }}</strong>
            </p>
          </div>

          <div class="search-gradient search-gradient-top" :style="{ opacity: topGradientOpacity }" />
          <div class="search-gradient search-gradient-bottom" :style="{ opacity: bottomGradientOpacity }" />
        </div>

        <div class="search-footer">
          <div class="search-hints" aria-hidden="true">
            <span>
              <kbd>↑</kbd>
              <kbd>↓</kbd>
              Navigate
            </span>
            <span>
              <kbd>↵</kbd>
              Open
            </span>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import {
  ArrowTurnBackwardIcon,
  File01Icon,
  Image01Icon,
  Motion01Icon,
  MousePointerClickIcon,
  PuzzleIcon,
  Search01Icon,
  TextFontIcon
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useSearch } from '@/composables/useSearch';
import { CATEGORIES } from '@/constants/Categories';
import { componentMetadata } from '@/constants/Information';
import { getComponentMatchLabel, rankComponentSearch } from '@/utils/componentSearch';

type Result = { categoryName: string; componentName: string; matchLabel: string; score: number };

const CATEGORY_ICONS: Record<string, typeof Search01Icon> = {
  'Get Started': File01Icon,
  'Text Animations': TextFontIcon,
  Animations: Motion01Icon,
  Components: PuzzleIcon,
  Micro: MousePointerClickIcon,
  Backgrounds: Image01Icon
};

const slug = (value: string) => value.replace(/\s+/g, '-').toLowerCase();

const pathOf = (url: string) => {
  try {
    return new URL(url).pathname;
  } catch {
    return url;
  }
};

const metadataByPath = new Map(Object.values(componentMetadata).map(meta => [pathOf(meta.docsUrl), meta]));

function searchComponents(query: string): Result[] {
  if (!query || query.trim() === '') return [];
  const results: Result[] = [];
  CATEGORIES.forEach(category => {
    const { name: categoryName, subcategories } = category;
    if (categoryName === 'Get Started') return;

    subcategories.forEach(componentName => {
      const metadata = metadataByPath.get(`/${slug(categoryName)}/${slug(componentName)}`);
      const match = rankComponentSearch(
        {
          title: componentName,
          categoryLabel: categoryName,
          description: metadata?.description,
          tags: metadata?.tags
        },
        query
      );

      if (match) {
        results.push({
          categoryName,
          componentName,
          matchLabel: getComponentMatchLabel(categoryName, match.type),
          score: match.score
        });
      }
    });
  });
  return results.sort((a, b) => b.score - a.score || a.componentName.localeCompare(b.componentName)).slice(0, 8);
}

const { isSearchOpen, closeSearch } = useSearch();
const router = useRouter();

const inputValue = ref('');
const searchValue = ref('');
const topGradientOpacity = ref(0);
const bottomGradientOpacity = ref(1);
const selectedIndex = ref(-1);
const keyboardNav = ref(false);
const resultsRef = ref<HTMLDivElement | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);
const highlight = ref<{ y: number; height: number; visible: boolean; ready: boolean } | null>(null);

const results = computed(() => searchComponents(searchValue.value));

let debounce: ReturnType<typeof setTimeout> | undefined;
watch(inputValue, value => {
  clearTimeout(debounce);
  debounce = setTimeout(() => {
    searchValue.value = value;
    selectedIndex.value = -1;
  }, 180);
});

function handleScroll(event: Event) {
  const { scrollTop, scrollHeight, clientHeight } = event.target as HTMLElement;
  topGradientOpacity.value = Math.min(scrollTop / 50, 1);
  const bottomDist = scrollHeight - (scrollTop + clientHeight);
  bottomGradientOpacity.value = scrollHeight <= clientHeight ? 0 : Math.min(bottomDist / 50, 1);
}

watch(results, () =>
  nextTick(() => {
    if (!resultsRef.value) return;
    const { scrollTop, scrollHeight, clientHeight } = resultsRef.value;
    bottomGradientOpacity.value =
      scrollHeight <= clientHeight ? 0 : Math.min((scrollHeight - (scrollTop + clientHeight)) / 50, 1);
  })
);

function reset() {
  clearTimeout(debounce);
  inputValue.value = '';
  searchValue.value = '';
  selectedIndex.value = -1;
}

function handleSelect(result: Result | undefined) {
  if (!result) return;
  router.push(`/${slug(result.categoryName)}/${slug(result.componentName)}`);
  reset();
  closeSearch();
}

function onKey(event: KeyboardEvent) {
  if (!isSearchOpen.value || !searchValue.value) return;
  if (event.key === 'ArrowDown' || (event.key === 'Tab' && !event.shiftKey)) {
    event.preventDefault();
    keyboardNav.value = true;
    selectedIndex.value = Math.min(selectedIndex.value + 1, results.value.length - 1);
  } else if (event.key === 'ArrowUp' || (event.key === 'Tab' && event.shiftKey)) {
    event.preventDefault();
    keyboardNav.value = true;
    selectedIndex.value = Math.max(selectedIndex.value - 1, 0);
  } else if (event.key === 'Enter' && selectedIndex.value >= 0) {
    event.preventDefault();
    handleSelect(results.value[selectedIndex.value]);
  }
}

watch(
  [selectedIndex, results],
  () =>
    nextTick(() => {
      const row =
        selectedIndex.value >= 0
          ? resultsRef.value?.querySelector<HTMLElement>(`[data-index="${selectedIndex.value}"]`)
          : null;
      const previous = highlight.value;
      if (!row) {
        highlight.value = previous ? { ...previous, visible: false } : null;
      } else {
        highlight.value = { y: row.offsetTop, height: row.offsetHeight, visible: true, ready: Boolean(previous) };
      }

      if (!keyboardNav.value || !row || !resultsRef.value) return;
      const container = resultsRef.value;
      const margin = 50;
      const itemTop = row.offsetTop;
      const itemBottom = itemTop + row.offsetHeight;
      if (itemTop < container.scrollTop + margin) {
        container.scrollTo({ top: itemTop - margin, behavior: 'smooth' });
      } else if (itemBottom > container.scrollTop + container.clientHeight - margin) {
        container.scrollTo({ top: itemBottom - container.clientHeight + margin, behavior: 'smooth' });
      }
      keyboardNav.value = false;
    }),
  { flush: 'post' }
);

watch(
  isSearchOpen,
  open => {
    if (open) {
      setTimeout(() => inputRef.value?.focus(), 50);
    } else {
      reset();
      highlight.value = null;
      topGradientOpacity.value = 0;
      bottomGradientOpacity.value = 1;
    }
  },
  { immediate: true }
);

onMounted(() => window.addEventListener('keydown', onKey));
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey);
  clearTimeout(debounce);
});
</script>

<style>
.search-backdrop {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  justify-content: center;
  padding-top: 12vh;
  background: rgba(6, 8, 6, 0.56);
  -webkit-backdrop-filter: blur(6px);
  backdrop-filter: blur(6px);
  animation: search-fade-in 140ms var(--ease-out);
}

.search-dialog {
  width: 100%;
  max-width: 600px;
  height: fit-content;
  margin: 0 16px;
  overflow: hidden;
  border-radius: 16px;
  background: var(--menu-bg);
  box-shadow: var(--menu-shadow);
  font-family: 'Geist', sans-serif;
  transform-origin: 50% 0;
  animation: search-rise 180ms var(--ease-out);
}

.search-input-row {
  display: flex;
  height: 56px;
  align-items: center;
  gap: 12px;
  padding: 0 14px 0 18px;
}

.search-input-icon {
  display: inline-flex;
  flex: none;
  color: var(--tool-muted);
}

.search-input {
  flex: 1;
  min-width: 0;
  border: 0;
  background: none;
  color: var(--text-primary);
  caret-color: var(--color-primary);
  font-family: 'Geist', sans-serif;
  font-size: 15px;
  font-weight: 450;
  letter-spacing: -0.01em;
  outline: none;
}

.search-input::placeholder {
  color: var(--tool-muted);
}

.search-kbd,
.search-hints kbd {
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  background: var(--tool-track);
  color: var(--tool-muted);
  font-family: 'Geist', sans-serif;
  font-weight: 500;
}

.search-kbd {
  height: 24px;
  padding: 0 8px;
  font-size: 11.5px;
  cursor: pointer;
  transition:
    background-color var(--dur-menu) var(--ease-out),
    color var(--dur-menu) var(--ease-out);
}

.search-kbd:hover {
  background: var(--tool-track-hover);
  color: var(--text-primary);
}

.search-results-wrapper {
  position: relative;
  border-top: 1px solid var(--inset-divider);
}

.search-results {
  position: relative;
  max-height: min(420px, 56vh);
  overflow-y: auto;
  padding: 4px 8px 8px;
  overscroll-behavior: contain;
  scrollbar-width: thin;
  scrollbar-color: var(--tool-track-hover) transparent;
}

.search-highlight {
  position: absolute;
  top: 0;
  right: 8px;
  left: 8px;
  border-radius: 10px;
  background: var(--menu-highlight);
  pointer-events: none;
}

.search-highlight[data-ready] {
  transition:
    transform 220ms var(--ease-out),
    height 220ms var(--ease-out),
    opacity 140ms var(--ease-out);
}

.search-group-label {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 10px 6px;
  color: var(--menu-label);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: -0.005em;
}

.search-row {
  position: relative;
  z-index: 1;
  display: flex;
  min-height: 52px;
  align-items: center;
  gap: 12px;
  padding: 8px 10px;
  border-radius: 10px;
  cursor: pointer;
}

.search-row-icon {
  display: grid;
  width: 32px;
  height: 32px;
  flex: none;
  place-items: center;
  border-radius: 9px;
  background: var(--tool-track);
  color: var(--tool-muted);
  transition:
    background-color var(--dur-menu) var(--ease-out),
    color var(--dur-menu) var(--ease-out);
}

.search-row[data-selected] .search-row-icon {
  background: var(--tool-raised);
  box-shadow: var(--tool-raised-shadow);
  color: var(--text-primary);
}

.search-row-text {
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  gap: 2px;
}

.search-row-title {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 8px;
  overflow: hidden;
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 500;
  letter-spacing: -0.01em;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.search-row-meta {
  overflow: hidden;
  color: var(--tool-muted);
  font-size: 12.5px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.search-row-trail {
  display: inline-flex;
  flex: none;
  color: var(--tool-muted);
  opacity: 0;
  transform: translateX(-3px);
  transition:
    opacity var(--dur-menu) var(--ease-out),
    transform var(--dur-menu) var(--ease-out);
}

.search-row[data-selected] .search-row-trail {
  opacity: 1;
  transform: none;
}

.search-no-results {
  margin: 0;
  padding: 28px 16px 30px;
  color: var(--tool-muted);
  font-size: 13.5px;
  text-align: center;
}

.search-no-results strong {
  color: var(--text-primary);
  font-weight: 500;
}

.search-footer {
  display: flex;
  height: 44px;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 0 14px 0 16px;
  border-top: 1px solid var(--inset-divider);
}

.search-hints {
  display: flex;
  align-items: center;
  gap: 16px;
  color: var(--tool-muted);
  font-size: 12px;
}

.search-hints span {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.search-hints kbd {
  min-width: 20px;
  height: 20px;
  padding: 0 4px;
  font-size: 11px;
}

.search-hints kbd:last-of-type {
  margin-right: 3px;
}

.search-gradient {
  position: absolute;
  right: 0;
  left: 0;
  z-index: 2;
  pointer-events: none;
  transition: opacity 0.3s;
}

.search-gradient-top {
  top: 0;
  height: 40px;
  background: linear-gradient(to bottom, rgb(var(--menu-bg-rgb)), rgba(var(--menu-bg-rgb), 0));
}

.search-gradient-bottom {
  bottom: 0;
  height: 56px;
  background: linear-gradient(to top, rgb(var(--menu-bg-rgb)), rgba(var(--menu-bg-rgb), 0));
}

:root[data-theme='light'] .search-backdrop {
  background: rgba(22, 24, 22, 0.18);
}

@keyframes search-fade-in {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes search-rise {
  from {
    opacity: 0;
    transform: translateY(-6px) scale(0.985);
  }

  to {
    opacity: 1;
    transform: none;
  }
}

@media (max-width: 768px) {
  .search-backdrop {
    padding-top: 8vh;
  }

  .search-dialog {
    max-width: none;
    margin: 0 12px;
  }

  .search-hints {
    display: none;
  }

  .search-footer {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .search-backdrop,
  .search-dialog {
    animation: none;
  }

  .search-highlight[data-ready],
  .search-row-trail,
  .search-row-icon,
  .search-gradient,
  .search-kbd {
    transition: none;
  }
}
</style>
