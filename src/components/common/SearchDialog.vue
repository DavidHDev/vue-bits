<script setup lang="ts">
import { CATEGORIES, slug } from '@/constants/Categories';
import { fuzzyMatch } from '@/utils/fuzzy';
import { computed, nextTick, onUnmounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

type Result = { categoryName: string; componentName: string };

const { isOpen = false } = defineProps<{
  isOpen?: boolean;
}>();

const emit = defineEmits<{
  close: [];
  toggle: [];
}>();

const router = useRouter();

const inputValue = ref('');
const searchValue = ref('');
const topGradientOpacity = ref(0);
const bottomGradientOpacity = ref(1);
const selectedIndex = ref(-1);
const keyboardNav = ref(false);

const resultsRef = ref<HTMLDivElement | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);
const dialogRef = ref<HTMLDivElement | null>(null);
let previouslyFocused: HTMLElement | null = null;

const listboxId = 'component-search-results';

// ── search ────────────────────────────────────────────────────────────────────
function searchComponents(query: string): Result[] {
  if (!query || query.trim() === '') return [];
  const results: Result[] = [];
  CATEGORIES.forEach(({ name: categoryName, subcategories }) => {
    if (fuzzyMatch(categoryName, query)) {
      subcategories.forEach(componentName => results.push({ categoryName, componentName }));
    } else {
      subcategories.forEach(componentName => {
        if (fuzzyMatch(componentName, query)) results.push({ categoryName, componentName });
      });
    }
  });
  return results;
}

const results = computed(() => searchComponents(searchValue.value));

// ── sync input → search immediately (no debounce, matches Svelte) ─────────────
function handleInput(e: Event) {
  inputValue.value = (e.currentTarget as HTMLInputElement).value;
  searchValue.value = inputValue.value;
  selectedIndex.value = -1;
}

// ── update bottom gradient when results change ────────────────────────────────
watch(results, () => {
  nextTick(() => {
    if (!resultsRef.value) return;
    const { scrollTop, scrollHeight, clientHeight } = resultsRef.value;
    bottomGradientOpacity.value =
      scrollHeight <= clientHeight ? 0 : Math.min((scrollHeight - (scrollTop + clientHeight)) / 50, 1);
  });
});

// ── open/close ────────────────────────────────────────────────────────────────
watch(
  () => isOpen,
  open => {
    if (open) {
      previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      nextTick(() => setTimeout(() => inputRef.value?.focus(), 50));
    } else {
      inputValue.value = '';
      searchValue.value = '';
      selectedIndex.value = -1;
      topGradientOpacity.value = 0;
      bottomGradientOpacity.value = 1;
      previouslyFocused?.focus();
      previouslyFocused = null;
    }
  }
);

// ── global keyboard: / to open, Escape to close ───────────────────────────────
function onGlobalKey(e: KeyboardEvent) {
  const target = e.target as HTMLElement | null;
  const isEditable =
    target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target?.isContentEditable;

  if (e.key === '/' && !isOpen && !isEditable) {
    e.preventDefault();
    emit('toggle');
  } else if (e.key === 'Escape' && isOpen) {
    emit('close');
  }
}

// ── dialog keyboard: arrows, enter, focus trap ────────────────────────────────
function onDialogKey(e: KeyboardEvent) {
  if (!isOpen) return;

  // Focus trap
  if (e.key === 'Tab') {
    if (!dialogRef.value) return;
    const focusable = getFocusable(dialogRef.value);
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
    return;
  }

  if (!searchValue.value) return;

  if (e.key === 'ArrowDown') {
    e.preventDefault();
    keyboardNav.value = true;
    selectedIndex.value = Math.min(selectedIndex.value + 1, results.value.length - 1);
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    keyboardNav.value = true;
    selectedIndex.value = Math.max(selectedIndex.value - 1, 0);
  } else if (e.key === 'Enter' && selectedIndex.value >= 0) {
    e.preventDefault();
    selectResult(results.value[selectedIndex.value]);
  }
}

function handleInputKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowDown' && results.value.length > 0) {
    e.preventDefault();
    keyboardNav.value = true;
    selectedIndex.value = Math.max(selectedIndex.value, 0);
  }
}

// ── scroll selected item into view ────────────────────────────────────────────
watch([selectedIndex, keyboardNav], () => {
  if (!keyboardNav.value || selectedIndex.value < 0 || !resultsRef.value) return;
  const item = resultsRef.value.querySelector(`[data-index="${selectedIndex.value}"]`) as HTMLElement | null;
  if (!item) return;

  const margin = 50;
  const itemTop = item.offsetTop;
  const itemBottom = itemTop + item.offsetHeight;
  if (itemTop < resultsRef.value.scrollTop + margin) {
    resultsRef.value.scrollTo({ top: itemTop - margin, behavior: 'smooth' });
  } else if (itemBottom > resultsRef.value.scrollTop + resultsRef.value.clientHeight - margin) {
    resultsRef.value.scrollTo({ top: itemBottom - resultsRef.value.clientHeight + margin, behavior: 'smooth' });
  }
  keyboardNav.value = false;
});

// ── scroll gradients ──────────────────────────────────────────────────────────
function handleScroll(e: Event) {
  const target = e.currentTarget as HTMLDivElement;
  const { scrollTop, scrollHeight, clientHeight } = target;
  topGradientOpacity.value = Math.min(scrollTop / 50, 1);
  const bottomDist = scrollHeight - (scrollTop + clientHeight);
  bottomGradientOpacity.value = scrollHeight <= clientHeight ? 0 : Math.min(bottomDist / 50, 1);
}

// ── actions ───────────────────────────────────────────────────────────────────
function selectResult(result: Result | undefined) {
  if (!result) return;
  router.push(`/${slug(result.categoryName)}/${slug(result.componentName)}`);
  inputValue.value = '';
  searchValue.value = '';
  selectedIndex.value = -1;
  emit('close');
}

function closeFromBackdrop(e: MouseEvent) {
  if (e.target === e.currentTarget) emit('close');
}

function getFocusable(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  ).filter(el => !el.hasAttribute('disabled') && el.tabIndex !== -1);
}

// ── category icons ────────────────────────────────────────────────────────────
function getCategoryIcon(categoryName: string): string {
  const map: Record<string, string> = {
    'Text Animations': `<path d="M4 7V4h16v3"/><path d="M9 20h6"/><path d="M12 4v16"/>`,
    Components: `<path d="M12 2 2 7l10 5 10-5-10-5Z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/>`,
    Backgrounds: `<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21"/>`,
    Animations: `<circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="m12 8 4 4-4 4"/>`
  };
  return (
    map[categoryName] ?? `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/>`
  );
}

window.addEventListener('keydown', onGlobalKey);
window.addEventListener('keydown', onDialogKey);
onUnmounted(() => {
  window.removeEventListener('keydown', onGlobalKey);
  window.removeEventListener('keydown', onDialogKey);
});
</script>

<template>
  <div v-if="isOpen" class="search-backdrop" @click="closeFromBackdrop" role="presentation">
    <div ref="dialogRef" class="search-dialog" role="dialog" aria-modal="true" aria-label="Search" tabindex="-1">
      <!-- Input row -->
      <div class="search-input-row">
        <svg
          class="search-input-icon"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          ref="inputRef"
          class="search-input"
          :value="inputValue"
          @input="handleInput"
          @keydown="handleInputKeydown"
          placeholder="Search components, categories, or keywords..."
          role="combobox"
          :aria-expanded="Boolean(searchValue)"
          :aria-controls="listboxId"
          aria-autocomplete="list"
          :aria-activedescendant="selectedIndex >= 0 ? `search-result-${selectedIndex}` : undefined"
        />
        <button type="button" class="search-kbd" @click="$emit('close')">esc</button>
      </div>

      <!-- Results -->
      <div v-if="searchValue" class="search-results-motion">
        <div class="search-results-wrapper">
          <div
            :id="listboxId"
            ref="resultsRef"
            class="search-results"
            @scroll="handleScroll"
            role="listbox"
            aria-label="Search results"
          >
            <template v-if="results.length > 0">
              <div
                v-for="(r, i) in results"
                :key="`${r.categoryName}-${r.componentName}-${i}`"
                :id="`search-result-${i}`"
                class="search-result-anim"
                :data-index="i"
                @mouseenter="selectedIndex = i"
                @click="selectResult(r)"
                @keydown="
                  e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      selectResult(r);
                    }
                  }
                "
                role="option"
                :aria-selected="selectedIndex === i"
                tabindex="-1"
              >
                <div :class="['search-result-item', { selected: selectedIndex === i }]">
                  <div class="search-result-icon">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      aria-hidden="true"
                      v-html="getCategoryIcon(r.categoryName)"
                    />
                  </div>
                  <div class="search-result-text">
                    <span class="search-result-name">{{ r.componentName }}</span>
                    <span class="search-result-category">in {{ r.categoryName }}</span>
                  </div>
                  <div class="search-result-enter">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M20 4v7a4 4 0 0 1-4 4H5" />
                      <path d="m9 11-4 4 4 4" />
                    </svg>
                  </div>
                </div>
              </div>
            </template>
            <p v-else class="search-no-results">
              No results found for
              <strong>{{ searchValue }}</strong>
            </p>
          </div>

          <div class="search-gradient-top search-gradient" :style="{ opacity: topGradientOpacity }" />
          <div class="search-gradient-bottom search-gradient" :style="{ opacity: bottomGradientOpacity }" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.search-backdrop {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  justify-content: center;
  padding-top: 12vh;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  animation: search-fade-in 0.15s ease;
}

@keyframes search-fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.search-dialog {
  width: 100%;
  max-width: 560px;
  margin: 0 16px;
  height: fit-content;
  border-radius: 16px;
  border: 1px solid #2e4e3e;
  background: rgba(11, 11, 11, 0.9);
  backdrop-filter: blur(32px) saturate(1.3);
  -webkit-backdrop-filter: blur(32px) saturate(1.3);
  box-shadow:
    0 8px 40px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(158, 239, 176, 0.04);
  overflow: hidden;
  animation: search-slide-in 0.2s ease;
}

@keyframes search-slide-in {
  from {
    opacity: 0;
    transform: translateY(-8px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.search-input-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
}

.search-input-icon {
  flex-shrink: 0;
  color: rgba(255, 255, 255, 0.35);
}

.search-input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  font-size: 14px;
  font-weight: 400;
  color: #fff;
  caret-color: #9eefb0;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.25);
}

.search-kbd {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px 6px;
  font-size: 10px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.05);
  cursor: pointer;
  transition: border-color 0.15s ease;
}

.search-kbd:hover {
  border-color: rgba(255, 255, 255, 0.2);
}

.search-results-motion {
  overflow: hidden;
  animation: search-results-in 0.3s ease;
}

@keyframes search-results-in {
  from {
    opacity: 0;
    max-height: 0;
  }
  to {
    opacity: 1;
    max-height: 460px;
  }
}

.search-results-wrapper {
  position: relative;
  border-top: 1px solid #2e4e3e;
}

.search-results {
  max-height: 400px;
  overflow-y: auto;
  padding: 6px 10px 10px;
}

.search-results::-webkit-scrollbar {
  width: 4px;
}
.search-results::-webkit-scrollbar-track {
  background: transparent;
}
.search-results::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 4px;
}

.search-result-anim {
  cursor: pointer;
  animation: search-result-pop 0.2s ease both;
}

@keyframes search-result-pop {
  from {
    opacity: 0;
    transform: scale(0.7);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.search-result-item {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  margin-top: 4px;
  border-radius: 10px;
  border: 1px solid transparent;
  background: rgba(255, 255, 255, 0.03);
  transition:
    background 0.15s ease,
    border-color 0.15s ease;
}

.search-result-item.selected {
  background: rgba(255, 255, 255, 0.07);
  border-color: rgba(158, 239, 176, 0.18);
}

.search-result-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  margin-right: 12px;
  border-radius: 8px;
  background: rgba(158, 239, 176, 0.1);
  color: rgba(158, 239, 176, 0.76);
}

.search-result-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}

.search-result-name {
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.search-result-category {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.35);
}

.search-result-enter {
  flex-shrink: 0;
  color: rgba(255, 255, 255, 0.2);
  margin-left: 8px;
}

.search-result-item.selected .search-result-enter {
  color: rgba(255, 255, 255, 0.4);
}

.search-no-results {
  text-align: center;
  padding: 20px 16px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.35);
}

.search-no-results strong {
  color: rgba(255, 255, 255, 0.6);
}

.search-gradient {
  position: absolute;
  left: 0;
  right: 0;
  pointer-events: none;
  transition: opacity 0.3s;
}

.search-gradient-top {
  top: 0;
  height: 50px;
  background: linear-gradient(to bottom, rgba(11, 11, 11, 0.9), transparent);
}

.search-gradient-bottom {
  bottom: 0;
  height: 80px;
  background: linear-gradient(to top, rgba(11, 11, 11, 0.9), transparent);
}

@media (max-width: 768px) {
  .search-backdrop {
    padding-top: 8vh;
  }
  .search-dialog {
    max-width: none;
    margin: 0 12px;
  }
}
</style>
