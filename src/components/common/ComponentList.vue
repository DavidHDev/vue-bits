<template>
  <div class="category-page docs-catalog">
    <header class="docs-catalog-header page-transition-fade">
      <div v-if="title" class="docs-catalog-heading">
        <h1 class="docs-catalog-title">{{ title }}</h1>
        <div class="docs-catalog-status" aria-live="polite">
          <button
            v-if="showNewStatus"
            type="button"
            :aria-pressed="newOnly"
            :title="newOnly ? 'Show all components' : 'Show new components'"
            @click="newOnly = !newOnly"
          >
            {{ newOnly ? filtered.length : newSinceLastVisitCount }} new since your last visit
          </button>
          <span v-else-if="hasActiveFilters">
            {{ filtered.length }} {{ filtered.length === 1 ? 'component' : 'components' }} found
          </span>
        </div>
      </div>

      <div class="docs-catalog-toolbar" :data-disabled="controlsDisabled ? '' : undefined">
        <label class="docs-search" :data-disabled="controlsDisabled ? '' : undefined">
          <HugeiconsIcon :icon="Search01Icon" :size="16" :stroke-width="1.6" aria-hidden="true" />
          <input
            v-model="search"
            type="search"
            placeholder="Search..."
            aria-label="Search components"
            :disabled="controlsDisabled"
            :tabindex="controlsDisabled ? -1 : 0"
          />
        </label>

        <ToolbarSelect
          v-if="showCategoryFilter"
          v-model="selectedCategory"
          :options="categoriesList"
          name="component-list-category-filter"
          width="180px"
          :disabled="controlsDisabled"
        />

        <ToolbarSelect
          v-if="showSortControl && sortMode"
          v-model="sortMode"
          :options="SORT_OPTIONS"
          name="component-list-sort"
          width="130px"
          :disabled="controlsDisabled"
        />

        <div ref="clearSlotRef" class="docs-clear-slot">
          <button
            ref="clearBtnRef"
            type="button"
            aria-label="Clear filters"
            class="docs-tool docs-tool--icon docs-clear"
            :tabindex="showClear ? 0 : -1"
            :style="{ pointerEvents: showClear ? 'auto' : 'none' }"
            @click="clearFilters"
          >
            <HugeiconsIcon :icon="Cancel01Icon" :size="16" :stroke-width="1.6" aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>

    <div v-if="filtered.length === 0" class="docs-catalog-empty" role="status">
      <h2>{{ items.length > 0 ? 'No results...' : 'Nothing here yet...' }}</h2>
      <p>{{ items.length > 0 ? 'Try adjusting your filters' : 'Tap the heart on any component to save it' }}</p>
      <div class="docs-catalog-empty-actions">
        <button v-if="items.length > 0" type="button" class="docs-pill-button" @click="clearFilters">
          Clear Filters
        </button>
        <RouterLink v-else to="/get-started/index" class="docs-pill-button">Browse Components</RouterLink>
      </div>
    </div>

    <div v-else class="docs-catalog-grid">
      <RouterLink
        v-for="item in filtered"
        :key="item.key"
        :to="pathFor(item)"
        :data-item-key="item.key"
        role="group"
        class="browse-card"
        @mouseenter="hoveredKey = item.key"
        @mouseleave="hoveredKey === item.key && (hoveredKey = null)"
      >
        <div class="browse-card-media">
          <LazyCardMedia
            :key="item.videoUrl || item.key"
            :video-url="item.videoUrl"
            :title="item.title"
            :playing="previewMediaAllowed && hoveredKey === item.key"
          />

          <span v-if="item.isNew || item.isNewSinceLastVisit" class="browse-card-badge">
            {{ item.isNewSinceLastVisit ? 'Since last visit' : 'New' }}
          </span>

          <button
            v-if="hasDeleteButton"
            type="button"
            aria-label="Remove from favorites"
            class="browse-card-fav browse-card-fav--delete"
            :data-visible="hoveredKey === item.key ? '' : undefined"
            :data-interactive="hoveredKey === item.key ? '' : undefined"
            @click.prevent.stop="event => removeFavorite(event, item.key)"
          >
            <FiTrash2 :size="13" />
          </button>

          <button
            v-else-if="hasFavoriteButton"
            type="button"
            :aria-label="savedSet.has(item.key) ? 'Remove from favorites' : 'Add to favorites'"
            class="browse-card-fav"
            :data-saved="savedSet.has(item.key) ? '' : undefined"
            :data-visible="savedSet.has(item.key) || hoveredKey === item.key ? '' : undefined"
            :data-interactive="hoveredKey === item.key ? '' : undefined"
            @click.prevent.stop="event => toggleFavorite(event, item)"
          >
            <RiHeartFill v-if="savedSet.has(item.key)" :size="13" />
            <RiHeartLine v-else :size="13" />
          </button>
        </div>
        <div class="browse-card-text">
          <p class="browse-card-title">{{ item.title }}</p>
          <p class="browse-card-category">{{ item.categoryLabel }}</p>
        </div>
      </RouterLink>
    </div>

    <details v-if="showDirectory && filtered.length > 0" class="docs-directory">
      <summary>Browse by name</summary>
      <nav aria-label="Component directory">
        <ul>
          <li v-for="item in directory" :key="item.key">
            <RouterLink :to="pathFor(item)">{{ item.title }}</RouterLink>
          </li>
        </ul>
      </nav>
    </details>
  </div>
</template>

<script setup lang="ts">
import { Cancel01Icon, Search01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import gsap from 'gsap';
import { useToast } from 'primevue/usetoast';
import { FiTrash2 } from 'vue-icons-plus/fi';
import { RiHeartFill, RiHeartLine } from 'vue-icons-plus/ri';
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { usePreviewMediaAllowed } from '@/composables/usePreviewMediaAllowed';
import { NEW_KEYS } from '@/constants/Badges';
import { CATEGORIES } from '@/constants/Categories';
import type { ComponentMetadata } from '@/constants/Information';
import { rankComponentSearch } from '@/utils/componentSearch';
import { getSavedComponents, removeSavedComponent, toggleSavedComponent } from '@/utils/favorites';
import LazyCardMedia from './LazyCardMedia.vue';
import ToolbarSelect from './ToolbarSelect.vue';

const SORT_NAME = 'A to Z';
const SORT_NEWEST = 'Newest';
const SORT_OPTIONS = [SORT_NAME, SORT_NEWEST];
const ALL = 'All Components';
const CLEAR_APPEAR_DEBOUNCE_MS = 300;

type Item = {
  key: string;
  categoryKey: string;
  componentKey: string;
  categoryLabel: string;
  title: string;
  description: string;
  videoUrl: string;
  tags: string[];
  isNew: boolean;
  added: string;
  hidden: boolean;
  isNewSinceLastVisit: boolean;
};

const props = withDefaults(
  defineProps<{
    list: ComponentMetadata;
    hasDeleteButton?: boolean;
    hasFavoriteButton?: boolean;
    sorting?: 'none' | 'newest' | 'alphabetical';
    title?: string;
    newSinceLastVisit?: Set<string>;
    basePath?: string;
    showCategoryFilter?: boolean;
    showSortControl?: boolean;
    showDirectory?: boolean;
  }>(),
  {
    hasDeleteButton: false,
    hasFavoriteButton: false,
    sorting: 'none',
    title: undefined,
    newSinceLastVisit: () => new Set<string>(),
    basePath: '',
    showCategoryFilter: true,
    showSortControl: false,
    showDirectory: false
  }
);

const toast = useToast();

const slug = (value: string) => (value || '').replace(/\s+/g, '-').toLowerCase();
const fromPascal = (value: string) =>
  (value || '')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .replace(/_/g, ' ')
    .trim();
const squash = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, '');
const revealsHidden = (item: Item, term: string) => {
  const query = squash(term);
  return query.length >= 4 && squash(item.title).startsWith(query);
};

const pathFor = (item: Item) =>
  `${props.basePath}/${slug(fromPascal(item.categoryKey))}/${slug(fromPascal(item.componentKey))}`;

const hoveredKey = ref<string | null>(null);
const sortMode = ref<string | null>(
  props.sorting === 'newest' ? SORT_NEWEST : props.sorting === 'alphabetical' ? SORT_NAME : null
);
const selectedCategory = ref(ALL);
const search = ref('');
const newOnly = ref(false);
const clearSlotRef = ref<HTMLElement | null>(null);
const clearBtnRef = ref<HTMLElement | null>(null);
const previewMediaAllowed = usePreviewMediaAllowed();

const items = computed<Item[]>(() => {
  if (!props.list) return [];
  let arr = Object.entries(props.list)
    .filter(([key]) => key.includes('/'))
    .map(([key, meta]) => {
      const [cat, comp] = key.split('/');
      const extra = meta as typeof meta & { hidden?: boolean };
      return {
        key,
        categoryKey: cat,
        componentKey: comp,
        categoryLabel: fromPascal(meta?.category ?? cat),
        title: fromPascal(meta?.name ?? comp),
        description: meta?.description ?? '',
        videoUrl: meta?.videoUrl ?? '',
        tags: Array.isArray(meta?.tags) ? meta.tags : [],
        isNew: NEW_KEYS.has(key),
        added: meta?.added ?? '',
        hidden: Boolean(extra?.hidden),
        isNewSinceLastVisit: props.newSinceLastVisit.has(key)
      };
    });

  if (sortMode.value === SORT_NEWEST) {
    arr = arr.sort((a, b) => b.added.localeCompare(a.added) || a.title.localeCompare(b.title));
  } else if (sortMode.value === SORT_NAME) {
    arr = arr.sort((a, b) => {
      if (a.isNewSinceLastVisit !== b.isNewSinceLastVisit) return a.isNewSinceLastVisit ? -1 : 1;
      if (a.isNew !== b.isNew) return a.isNew ? -1 : 1;
      return a.title.localeCompare(b.title);
    });
  }
  return arr;
});

const categoriesList = [
  ALL,
  ...CATEGORIES.filter(category => category.name !== 'Get Started')
    .map(category => category.name)
    .sort((a, b) => a.localeCompare(b))
];

const savedSet = ref(new Set(getSavedComponents()));
const updateSaved = () => {
  savedSet.value = new Set(getSavedComponents());
};
const onStorage = (event: StorageEvent) => {
  if (!event || event.key === 'savedComponents') updateSaved();
};

const filtered = computed(() => {
  const term = search.value.trim();
  const all = !props.showCategoryFilter || selectedCategory.value === ALL;
  return items.value
    .filter(item => !item.hidden || revealsHidden(item, term))
    .filter(
      item => (all || item.categoryLabel === selectedCategory.value) && (!newOnly.value || item.isNewSinceLastVisit)
    )
    .map(item => ({ item, match: term ? rankComponentSearch(item, term) : { score: 1 } }))
    .filter(({ match }) => Boolean(match))
    .sort((a, b) => (term ? (b.match?.score ?? 0) - (a.match?.score ?? 0) : 0))
    .map(({ item }) => item);
});

const directory = computed(() => [...filtered.value].sort((a, b) => a.title.localeCompare(b.title)));

const controlsDisabled = computed(() => items.value.length === 0);
const hasCategoryFilter = computed(() => props.showCategoryFilter && selectedCategory.value !== ALL);
const newSinceLastVisitCount = computed(
  () => items.value.filter(item => !item.hidden && item.isNewSinceLastVisit).length
);
const hasActiveFilters = computed(() => hasCategoryFilter.value || newOnly.value || search.value.trim().length > 0);
const showNewStatus = computed(() => newSinceLastVisitCount.value > 0 && (!hasActiveFilters.value || newOnly.value));

const debouncedSearch = ref(search.value);
let debounceTimer: ReturnType<typeof setTimeout> | undefined;
watch(search, value => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    debouncedSearch.value = value;
  }, CLEAR_APPEAR_DEBOUNCE_MS);
});

const showClear = computed(
  () =>
    !controlsDisabled.value &&
    (hasCategoryFilter.value || newOnly.value || (debouncedSearch.value?.trim()?.length ?? 0) > 0)
);

watch(showClear, visible => {
  const slot = clearSlotRef.value;
  const btn = clearBtnRef.value;
  if (!slot || !btn) return;
  gsap.killTweensOf([slot, btn]);

  if (visible) {
    gsap
      .timeline()
      .to(slot, { width: 44, duration: 0.3, ease: 'power2.out' })
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

function clearFilters() {
  search.value = '';
  selectedCategory.value = ALL;
  newOnly.value = false;
}

function setHoverToItemAtPoint(x: number, y: number) {
  let node = document.elementFromPoint(x, y) as HTMLElement | null;
  while (node && node !== document.body) {
    if (node.dataset?.itemKey) {
      hoveredKey.value = node.dataset.itemKey;
      return;
    }
    node = node.parentElement;
  }
  hoveredKey.value = null;
}

function removeFavorite(event: MouseEvent, key: string) {
  const { clientX, clientY } = event;
  savedSet.value = new Set(removeSavedComponent(key));
  (event.currentTarget as HTMLElement | null)?.blur();
  requestAnimationFrame(() => setHoverToItemAtPoint(clientX, clientY));
}

function toggleFavorite(event: MouseEvent, item: Item) {
  const { saved, list } = toggleSavedComponent(item.key);
  savedSet.value = new Set(list);
  toast.add({
    severity: saved ? 'success' : 'error',
    summary: `${saved ? 'Added' : 'Removed'} <${item.title.replace(/\s+/g, '')} /> ${saved ? 'to favorites' : 'from favorites'}`,
    life: 3000
  });
  (event.currentTarget as HTMLElement | null)?.blur();
}

onMounted(() => {
  window.addEventListener('favorites:updated', updateSaved);
  window.addEventListener('storage', onStorage);
});

onBeforeUnmount(() => {
  window.removeEventListener('favorites:updated', updateSaved);
  window.removeEventListener('storage', onStorage);
  clearTimeout(debounceTimer);
});
</script>
