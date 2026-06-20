<script setup lang="ts">
import { NEW } from '@/constants/Categories.ts';
import { componentMetadata, type ComponentMetadata } from '@/constants/Information';
import { getSavedComponents, removeSavedComponent, toggleSavedComponent } from '@/utils/favorites';
import { fuzzyMatch } from '@/utils/fuzzy';
import gsap from 'gsap';
import { useToast } from 'primevue/usetoast';
import { computed, onBeforeUnmount, onMounted, ref, watch, watchEffect } from 'vue';
import LazyCardMedia from './LazyCardMedia.vue';
import PreviewSelect from './PreviewSelect.vue';

const CARD_RADIUS = 16;
const CLEAR_APPEAR_DEBOUNCE_MS = 300;

const slug = (str: string) => (str || '').replace(/\s+/g, '-').toLowerCase();
const fromPascal = (str: string) =>
  (str || '')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/_/g, ' ')
    .trim();

interface RawEntry {
  key?: string;
  id?: string;
  category?: string;
  name?: string;
  description?: string;
  videoUrl?: string;
  tags?: string[];
}

type ComponentInfoProps = {
  list: ComponentMetadata;
  hasDeleteButton?: boolean;
  sorting?: string;
  title: string;
  emptyTitle?: string;
  emptyDescription?: string;
};

const props = withDefaults(defineProps<ComponentInfoProps>(), {
  hasDeleteButton: false,
  sorting: 'none'
});

const toast = useToast();
const hoveredKey = ref<string | null>(null);
const clearSlotRef = ref<HTMLElement | null>(null);
const clearBtnRef = ref<HTMLElement | null>(null);

// ── items ─────────────────────────────────────────────────────────────────────
const mapToItem = (entry: RawEntry | string) => {
  const isObj = typeof entry !== 'string';
  const key = isObj ? (entry.key ?? entry.id ?? null) : entry;
  const meta: RawEntry = isObj ? entry : (componentMetadata?.[entry] ?? {});
  const fullKey = key ?? (typeof entry === 'string' ? entry : '');
  const [cat, comp] = (fullKey || '').split('/');
  const title = fromPascal(meta.name ?? comp);
  return {
    key: fullKey,
    categoryKey: cat,
    componentKey: comp,
    categoryLabel: fromPascal(meta.category ?? cat),
    title: fromPascal(meta.name ?? comp),
    description: meta.description ?? '',
    videoUrl: meta.videoUrl ?? '',
    tags: Array.isArray(meta.tags) ? meta.tags : [],
    isNew: NEW.includes(title)
  };
};

const items = computed(() => {
  if (!props.list) return [];
  const entries: (RawEntry | string)[] = Array.isArray(props.list)
    ? props.list
    : Object.entries(props.list).map(([key, meta]) => ({ key, ...(meta as RawEntry) }));

  let arr = entries
    .filter(e => {
      const key = (typeof e === 'string' ? e : (e.key ?? ''))?.toString() ?? '';
      return (
        key.includes('/') &&
        (typeof e !== 'string' && e.key ? true : !!componentMetadata[typeof e === 'string' ? e : ''])
      );
    })
    .map(mapToItem);

  if (props.sorting === 'alphabetical') {
    arr = arr.sort((a, b) => {
      const aNew = NEW.indexOf(a.title);
      const bNew = NEW.indexOf(b.title);
      // If both are new, sort by their order in the NEW array
      if (aNew !== -1 && bNew !== -1) return aNew - bNew;
      // If only one is new, put it first
      if (aNew !== -1) return -1;
      if (bNew !== -1) return 1;
      // Otherwise, sort alphabetically
      return a.title.localeCompare(b.title);
    });
  }
  return arr;
});

// ── categories ────────────────────────────────────────────────────────────────
const categoryOptions = computed(() => [
  'All Components',
  ...Array.from(new Set(items.value.map(i => i.categoryLabel))).sort((a, b) => a.localeCompare(b))
]);

const search = ref('');
const selectedCategory = ref('All Components');

watch(categoryOptions, opts => {
  if (!opts.includes(selectedCategory.value)) selectedCategory.value = 'All Components';
});

// ── saved set ─────────────────────────────────────────────────────────────────
const savedSet = ref(new Set(getSavedComponents()));
const updateSaved = () => {
  savedSet.value = new Set(getSavedComponents());
};
const onStorage = (e?: StorageEvent | null) => {
  if (!e || e.key === 'savedComponents') updateSaved();
};

onMounted(() => {
  window.addEventListener('favorites:updated', updateSaved);
  window.addEventListener('storage', onStorage);
});
onBeforeUnmount(() => {
  window.removeEventListener('favorites:updated', updateSaved);
  window.removeEventListener('storage', onStorage);
});

// ── filtering ─────────────────────────────────────────────────────────────────
const filtered = computed(() => {
  const term = search.value.trim();
  const all = selectedCategory.value === 'All Components';
  return items.value.filter(({ title, categoryLabel }) => {
    const categoryOk = all || categoryLabel === selectedCategory.value;
    if (!term) return categoryOk;
    return categoryOk && fuzzyMatch(title, term);
  });
});

const controlsDisabled = computed(() => items.value.length === 0);

// ── debounced search for clear button ─────────────────────────────────────────
const debouncedSearch = ref(search.value);

watchEffect(onCleanup => {
  const id = setTimeout(() => {
    debouncedSearch.value = search.value;
  }, CLEAR_APPEAR_DEBOUNCE_MS);
  onCleanup(() => clearTimeout(id));
});

const showClear = computed(
  () =>
    !controlsDisabled.value && (selectedCategory.value !== 'All Components' || debouncedSearch.value.trim().length > 0)
);

// ── GSAP clear button ─────────────────────────────────────────────────────────
watch(showClear, newVal => {
  const slot = clearSlotRef.value;
  const btn = clearBtnRef.value;
  if (!slot || !btn) return;
  gsap.killTweensOf([slot, btn]);

  if (newVal) {
    gsap
      .timeline()
      .to(slot, { width: 40, duration: 0.3, ease: 'power2.out' })
      .fromTo(
        btn,
        { scale: 0.6, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.25, ease: 'power2.out', force3D: true },
        '<0.05'
      );
  } else {
    gsap
      .timeline()
      .to(btn, { scale: 0, opacity: 0, duration: 0.15, ease: 'power2.in' })
      .to(slot, { width: 0, duration: 0.25, ease: 'power2.inOut' }, '+=0');
  }
});

// ── actions ───────────────────────────────────────────────────────────────────
function clearFilters() {
  search.value = '';
  selectedCategory.value = 'All Components';
}

function removeFavorite(key: string) {
  savedSet.value = new Set(removeSavedComponent(key));
}

function toggleFavorite(key: string, componentKey: string) {
  const { saved, list: next } = toggleSavedComponent(key);
  savedSet.value = new Set(next);
  toast.add({
    severity: saved ? 'success' : 'error',
    summary: saved ? `Added <${componentKey} /> to favorites` : `Removed <${componentKey} /> from favorites`,
    life: 3000
  });
}
</script>

<template>
  <div class="component-list-page">
    <!-- Header -->
    <div class="page-transition-fade component-list-header">
      <h1 class="sub-category">{{ title }}</h1>

      <div class="component-list-controls" :class="{ disabled: controlsDisabled }">
        <!-- Search -->
        <label class="component-list-search">
          <svg
            width="14"
            height="14"
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
          <input v-model="search" placeholder="Search..." :disabled="controlsDisabled" />
        </label>

        <!-- Category select -->
        <PreviewSelect
          v-model="selectedCategory"
          title="Category"
          :options="categoryOptions"
          :is-disabled="controlsDisabled"
          class="category-scrubber"
        />

        <!-- Clear button -->
        <div ref="clearSlotRef" class="clear-slot" :class="{ show: showClear }">
          <button
            ref="clearBtnRef"
            type="button"
            class="clear-button"
            aria-label="Clear filters"
            :tabindex="showClear ? 0 : -1"
            @click="clearFilters"
          >
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
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="filtered.length === 0" class="component-list-empty" role="status">
      <h2>{{ items.length > 0 ? 'No results...' : (emptyTitle ?? 'Nothing here yet...') }}</h2>
      <p>
        {{
          items.length > 0
            ? 'Try adjusting your filters'
            : (emptyDescription ?? 'Tap the heart on any component to save it')
        }}
      </p>
      <button v-if="items.length > 0" type="button" class="pill-button" @click="clearFilters">Clear Filters</button>
      <RouterLink v-else class="pill-button" to="/get-started/index">Browse Components</RouterLink>
    </div>

    <!-- Grid -->
    <div v-else class="component-list-grid" :style="{ '--card-radius': `${CARD_RADIUS}px` }">
      <div v-for="item in filtered" :key="item.key" class="component-list-card-wrap">
        <RouterLink
          class="component-list-card"
          :to="`/${slug(fromPascal(item.categoryKey))}/${slug(fromPascal(item.componentKey))}`"
          :data-item-key="item.key"
          @mouseenter="hoveredKey = item.key"
          @mouseleave="hoveredKey === item.key && (hoveredKey = null)"
        >
          <div v-if="item.isNew" class="new-badge">New</div>

          <LazyCardMedia :video-url="item.videoUrl" :playing="hoveredKey === item.key" />

          <div class="component-list-card-copy">
            <h2>{{ item.title }}</h2>
            <p>{{ item.categoryLabel }}</p>
          </div>
        </RouterLink>

        <!-- Favorite / delete button -->
        <button
          type="button"
          class="favorite-button"
          :class="{
            visible: savedSet.has(item.key) || hoveredKey === item.key,
            saved: savedSet.has(item.key)
          }"
          :aria-label="
            hasDeleteButton
              ? 'Remove from favorites'
              : savedSet.has(item.key)
                ? 'Remove from favorites'
                : 'Add to favorites'
          "
          @click.prevent.stop="hasDeleteButton ? removeFavorite(item.key) : toggleFavorite(item.key, item.componentKey)"
        >
          <svg
            v-if="hasDeleteButton"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M3 6h18" />
            <path d="M8 6V4h8v2" />
            <path d="M19 6l-1 14H6L5 6" />
            <path d="M10 11v6" />
            <path d="M14 11v6" />
          </svg>
          <svg
            v-else
            width="14"
            height="14"
            viewBox="0 0 24 24"
            :fill="savedSet.has(item.key) ? 'currentColor' : 'none'"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path
              d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.component-list-page {
  width: 100%;
}
.component-list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 3rem;
}
.component-list-header .sub-category {
  margin: 0;
}
.component-list-controls {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
}
.component-list-controls.disabled {
  opacity: 0.5;
  pointer-events: none;
}

.component-list-search,
.clear-button,
.pill-button {
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(20, 17, 14, 0.45);
  backdrop-filter: blur(32px) saturate(1.3);
  -webkit-backdrop-filter: blur(32px) saturate(1.3);
  color: #fff;
  font-size: 13px;
  font-weight: 500;
  transition:
    border-color 0.2s ease,
    background 0.2s ease,
    transform 0.2s ease,
    opacity 0.2s ease;
}
.component-list-search:hover,
.clear-button:hover,
.pill-button:hover {
  border-color: rgba(255, 255, 255, 0.15);
  background: rgba(20, 17, 14, 0.55);
}

.component-list-search {
  width: 180px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  color: rgba(255, 255, 255, 0.4);
}
.component-list-search:focus-within {
  border-color: rgba(255, 255, 255, 0.15);
}
.component-list-search input {
  min-width: 0;
  width: 100%;
  border: 0;
  outline: 0;
  background: transparent;
  color: #fff;
  font: inherit;
}
.component-list-search input::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

.component-list-select {
  position: relative;
  display: flex;
  align-items: center;
  width: 180px;
  height: 36px;
  border-radius: 10px;
}
.component-list-select select {
  appearance: none;
  -webkit-appearance: none;
  width: 100%;
  height: 100%;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  padding: 0 46px 0 12px;
  outline: 0;
  cursor: pointer;
}
.component-list-select svg {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  color: #fff;
  pointer-events: none;
}

.clear-slot {
  width: 0;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: width 0.3s ease;
}
.clear-slot.show {
  width: 40px;
}
.clear-button {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  opacity: 0;
  transform: scale(0.6);
  pointer-events: none;
}
.clear-slot.show .clear-button {
  opacity: 1;
  transform: scale(1);
  pointer-events: auto;
}

.component-list-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}
.component-list-card-wrap {
  position: relative;
}
.component-list-card {
  display: block;
  position: relative;
  background: var(--bg-elevated);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: var(--card-radius);
  padding: 6px;
  text-decoration: none;
  overflow: hidden;
  transition: border-color 0.2s ease;
}
.component-list-card:hover {
  border-color: rgba(255, 255, 255, 0.1);
  text-decoration: none;
}

.favorite-button {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 2;
  width: 28px;
  height: 28px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  color: rgba(255, 255, 255, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  cursor: pointer;
  opacity: 0;
  pointer-events: none;
  transition: all 0.2s ease;
}
.component-list-card-wrap:hover .favorite-button,
.favorite-button.visible {
  opacity: 1;
  pointer-events: auto;
}
.favorite-button.saved {
  color: var(--color-primary);
}
.favorite-button:hover {
  background: rgba(0, 0, 0, 0.55);
  transform: scale(1.1);
  color: #72ef44;
}

.component-list-card-copy {
  padding: 12px 8px 6px;
}
.component-list-card-copy h2 {
  margin: 0;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.3;
  letter-spacing: -0.2px;
}
.component-list-card-copy p {
  margin: 2px 0 0;
  color: var(--text-muted);
  font-size: 12px;
  font-weight: 400;
}

.component-list-empty {
  position: relative;
  margin-top: 6em;
  padding: 24px;
  text-align: center;
}
.component-list-empty h2 {
  margin: 0 0 4px;
  color: #fff;
  font-size: 24px;
  font-weight: 500;
}
.component-list-empty p {
  margin: 0 0 32px;
  color: var(--text-muted);
  font-size: 16px;
}

.pill-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 36px;
  border-radius: 10px;
  padding: 0 16px;
  cursor: pointer;
  text-decoration: none;
}

.new-badge {
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 2;
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 600;
  line-height: 1;
  text-transform: uppercase;
  font-family: 'Geist Mono', monospace;
  color: #fff;
  border: 1px solid var(--color-primary);
  background: rgba(88, 247, 85, 0.4);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  pointer-events: none;
}

@media (max-width: 700px) {
  .component-list-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 520px) {
  .component-list-header {
    align-items: flex-start;
    flex-direction: column;
    margin-bottom: 2rem;
  }
  .component-list-controls {
    width: 100%;
    align-items: stretch;
    flex-direction: column;
  }
  .component-list-search,
  .component-list-select {
    width: 100%;
  }
  .clear-slot {
    display: none;
  }
  .component-list-grid {
    grid-template-columns: 1fr;
  }
}

.category-scrubber {
  width: 220px;
}

@media (max-width: 520px) {
  .category-scrubber {
    width: 100%;
  }
}
</style>
