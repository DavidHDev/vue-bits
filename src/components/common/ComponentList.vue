<script setup lang="ts">
import { componentMetadata, type ComponentMetadata } from '@/constants/Information';
import { getSavedComponents, isComponentSaved, removeSavedComponent, toggleSavedComponent } from '@/utils/favorites';
import { fuzzyMatch } from '@/utils/fuzzy';
import { useVirtualList } from '@vueuse/core';
import gsap from 'gsap';
import { Trash, X } from 'lucide-vue-next';
import Select from 'primevue/select';
import { useToast } from 'primevue/usetoast';
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import LazyCardMedia from './LazyCardMedia.vue';

const GAP_PX = 16;
const CARD_RADIUS = 30;
const CARD_PADDING = 6;
const CARD_HEIGHT = 284;
const INNER_RADIUS = `${CARD_RADIUS - CARD_PADDING}px`;

const slug = (str: string) => (str || '').replace(/\s+/g, '-').toLowerCase();
const fromPascal = (str: string) =>
  (str || '')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/_/g, ' ')
    .trim();

const supportsType = (type: string) => {
  try {
    const v = document.createElement('video');
    if (!('canPlayType' in v)) return false;
    const res = v.canPlayType(type);
    return res === 'probably' || res === 'maybe';
  } catch {
    return false;
  }
};

const prefersWebM = () => supportsType('video/webm; codecs="vp9,vorbis"') || supportsType('video/webm');

const pickBestSource = (url: string) => {
  if (!url) return '';
  if (url.endsWith('.webm')) {
    if (prefersWebM()) return url;
    const mp4 = url.replace(/\.webm$/, '.mp4');
    return mp4;
  }
  if (url.endsWith('.mp4')) {
    return url;
  }
  return url;
};

interface NavigatorWithConnection extends Navigator {
  connection?: {
    saveData?: boolean;
    effectiveType?: string;
  };
  mozConnection?: {
    saveData?: boolean;
    effectiveType?: string;
  };
  webkitConnection?: {
    saveData?: boolean;
    effectiveType?: string;
  };
}

const shouldPreload = () => {
  try {
    const nav = navigator as NavigatorWithConnection;
    const c = nav.connection || nav.mozConnection || nav.webkitConnection;
    if (c?.saveData) return false;
    const slowTypes = new Set(['slow-2g', '2g']);
    if (c?.effectiveType && slowTypes.has(c.effectiveType)) return false;
  } catch {
    // noop
  }
  return true;
};

type ComponentInfoProps = {
  list: ComponentMetadata;
  hasDeleteButton?: boolean;
  hasFavoriteButton?: boolean;
  sorting?: string;
  title: string;
};

const props = withDefaults(defineProps<ComponentInfoProps>(), {
  hasDeleteButton: false,
  hasFavoriteButton: false,
  sorting: 'none'
});

const toast = useToast();
const scrollRef = ref<HTMLElement | null>(null);
const preloadedSrcsRef = ref(new Set());
const hoveredKey = ref<string | null>(null);
const clearSlotRef = ref(null);
const clearBtnRef = ref(null);
const CLEAR_APPEAR_DEBOUNCE_MS = 300;

const setHoverToItemAtPoint = (x: number, y: number): void => {
  try {
    const el = document.elementFromPoint(x, y) as HTMLElement | null;
    let node: HTMLElement | null = el;
    while (node && node !== document.body) {
      if (node.dataset && node.dataset.itemKey) {
        hoveredKey.value = node.dataset.itemKey;
        return;
      }
      node = node.parentElement as HTMLElement | null;
    }
    hoveredKey.value = null;
  } catch {
    // noop
  }
};

const items = computed(() => {
  if (!props.list) return [];
  const entries = Array.isArray(props.list)
    ? props.list
    : Object.entries(props.list).map(([key, meta]) => ({ key, ...meta }));

  const mapToItem = (entry: ComponentMetadata[keyof ComponentMetadata] | string | { key: string }) => {
    const key = typeof entry === 'object' && 'key' in entry ? entry.key : typeof entry === 'string' ? entry : null;
    const meta =
      typeof entry === 'object' && 'key' in entry
        ? entry
        : typeof entry === 'string' && componentMetadata?.[entry]
          ? componentMetadata[entry]
          : {};
    const fullKey = key || (typeof entry === 'string' ? entry : '');
    const [cat, comp] = (fullKey || '').split('/');
    return {
      key: fullKey,
      categoryKey: cat,
      componentKey: comp,
      categoryLabel: fromPascal(
        (typeof meta === 'object' && meta && 'category' in meta ? (meta.category as string) : undefined) ?? cat
      ),
      title: fromPascal(
        (typeof meta === 'object' && meta && 'name' in meta ? (meta.name as string) : undefined) ?? comp
      ),
      description:
        (typeof meta === 'object' && meta && 'description' in meta ? (meta.description as string) : undefined) ?? '',
      videoUrl: (typeof meta === 'object' && meta && 'videoUrl' in meta ? (meta.videoUrl as string) : undefined) ?? '',
      tags: typeof meta === 'object' && meta && 'tags' in meta && Array.isArray(meta.tags) ? meta.tags : [],
      docsUrl: typeof meta === 'object' && meta && 'docsUrl' in meta ? (meta.docsUrl as string | undefined) : undefined
    };
  };

  let arr = entries
    .filter(e => {
      const key = (e.key ?? e)?.toString?.() ?? '';
      return key.includes('/') && (e.key ? true : !!componentMetadata[key]);
    })
    .map(mapToItem);

  if (props.sorting === 'alphabetical') {
    arr = arr.sort((a, b) => a.title.localeCompare(b.title));
  }
  return arr;
});

const categories = computed(() => {
  const set = new Set<string>();
  items.value.forEach(i => i.categoryLabel && set.add(i.categoryLabel));
  return ['All Components', ...Array.from(set).sort((a, b) => a.localeCompare(b))];
});

const selectedCategory = ref(categories.value[0]);
const search = ref('');
const savedSet = ref(new Set(getSavedComponents()));

const update = () => (savedSet.value = new Set(getSavedComponents()));
const onStorage = (e?: StorageEvent | null) => {
  if (!e || e.key === 'savedComponents') update();
};

onMounted(() => {
  window.addEventListener('favorites:updated', update);
  window.addEventListener('storage', onStorage);
});

onBeforeUnmount(() => {
  window.removeEventListener('favorites:updated', update);
  window.removeEventListener('storage', onStorage);
});

watch(
  () => categories.value,
  newCategories => {
    if (!newCategories.includes(selectedCategory.value)) {
      selectedCategory.value = newCategories[0];
    }
  }
);

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
const hasCategoryFilter = computed(() => selectedCategory.value !== categories.value[0]);

const debounceSearch = ref(search.value);

watch(search, () => {
  const timeout = setTimeout(() => {
    debounceSearch.value = search.value;
  }, CLEAR_APPEAR_DEBOUNCE_MS);
  return () => clearTimeout(timeout);
});

const showClear = computed(
  () => !controlsDisabled.value && (hasCategoryFilter.value || (debounceSearch.value?.trim()?.length ?? 0) > 0)
);

watch(showClear, newVal => {
  const slot = clearSlotRef.value;
  const btn = clearBtnRef.value;
  if (!slot || !btn) return;
  gsap.killTweensOf([slot, btn]);

  if (newVal) {
    const tl = gsap.timeline();
    tl.to(slot, { width: 40, duration: 0.3, ease: 'power2.out' }).fromTo(
      btn,
      { scale: 0.6, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.25, ease: 'power2.out', force3D: true },
      '<0.05'
    );
  } else {
    const tl = gsap.timeline();
    tl.to(btn, { scale: 0, opacity: 0, duration: 0.15, ease: 'power2.in' }).to(
      slot,
      { width: 0, duration: 0.25, ease: 'power2.inOut' },
      '+=0'
    );
  }
});

const getColumnsForWidth = (w: number) => (w >= 1024 ? 3 : w >= 768 ? 2 : 1);

const preloadRange = (startIdx: number, endIdx: number) => {
  if (!shouldPreload()) return;
  const urls = [];
  for (let i = startIdx; i <= Math.min(endIdx, filtered.value.length - 1); i++) {
    const url = filtered.value[i]?.videoUrl;
    if (!url) continue;
    const chosen = pickBestSource(url);
    if (chosen && !preloadedSrcsRef.value.has(chosen)) {
      urls.push(chosen);
    }
  }
  if (urls.length === 0) return;
  urls.forEach(src => {
    try {
      const v = document.createElement('video');
      v.preload = 'metadata';
      v.src = src;
      const mark = () => {
        preloadedSrcsRef.value.add(src);
      };
      v.addEventListener('loadedmetadata', mark, { once: true });
      v.addEventListener('loadeddata', mark, { once: true });
      v.addEventListener('canplaythrough', mark, { once: true });
      v.load();
      setTimeout(() => {
        v.src = '';
      }, 8000);
    } catch {
      // no-op
    }
  });
};

const clearFilters = () => {
  selectedCategory.value = categories.value[0];
  search.value = '';
};

const handleDeletion = (e: MouseEvent, item: { key: string }): void => {
  e.preventDefault();
  e.stopPropagation();

  const { clientX, clientY } = e as MouseEvent & { clientX: number; clientY: number };
  const next = removeSavedComponent(item.key);
  savedSet.value = new Set(next);
  setHoverToItemAtPoint(clientX, clientY);

  const target = e.currentTarget as HTMLElement | null;
  if (target && typeof target.blur === 'function') {
    target.blur();
  }

  if (typeof window !== 'undefined') {
    const schedule: (cb: (ts?: number) => void) => number = window.requestAnimationFrame
      ? (cb: (ts?: number) => void) => window.requestAnimationFrame(cb as FrameRequestCallback)
      : (cb: (ts?: number) => void) => window.setTimeout(() => cb(Date.now()), 0);
    schedule(() => setHoverToItemAtPoint(clientX, clientY));
  }
};

const isSaved = (key: string): boolean => savedSet.value.has(key) || isComponentSaved(key);

const handleFavoriteToggle = (e: MouseEvent, item: { key: string; componentKey: string }): void => {
  e.preventDefault();
  e.stopPropagation();
  const { saved, list: next } = toggleSavedComponent(item.key);
  savedSet.value = new Set(next);

  toast.add({
    severity: saved ? 'success' : 'error',
    summary: saved ? `Added <${item.componentKey} /> to Favorites` : `Removed <${item.componentKey} /> from Favorites`,
    life: 3000
  });

  const target = e.currentTarget as HTMLElement | null;
  if (target && typeof target.blur === 'function') {
    target.blur();
  }
};

// ---------- VIRTUALIZATION ----------
const containerWidth = ref(window.innerWidth);

const updateContainerWidth = () => {
  if (scrollRef.value) {
    containerWidth.value = scrollRef.value.offsetWidth;
  }
};

onMounted(() => {
  updateContainerWidth();
  window.addEventListener('resize', updateContainerWidth);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateContainerWidth);
});

const columnCount = computed(() => getColumnsForWidth(containerWidth.value));
const rowHeight = computed(() => CARD_HEIGHT + GAP_PX);

const gridRows = computed(() => {
  const rows = [];
  const cols = columnCount.value;
  for (let i = 0; i < filtered.value.length; i += cols) {
    rows.push(filtered.value.slice(i, i + cols));
  }
  return rows;
});

const {
  list: virtualedRows,
  containerProps,
  wrapperProps
} = useVirtualList(gridRows, {
  itemHeight: rowHeight.value
});

watch(virtualedRows, newRows => {
  if (newRows.length > 0) {
    const lastRow = newRows[newRows.length - 1];
    const lastVisibleIndex = (lastRow.index + 1) * columnCount.value - 1;
    preloadRange(lastVisibleIndex + 1, lastVisibleIndex + 3);
  }
});
</script>

<template>
  <div ref="scrollRef">
    <div class="flex md:flex-row flex-col justify-start md:justify-between items-start md:items-center gap-4 mb-3">
      <h2 v-if="title" class="sub-category" style="margin: 0">
        {{ title }}
      </h2>

      <div
        class="flex md:flex-row flex-col items-center gap-2 w-full md:w-auto"
        :style="{ opacity: controlsDisabled ? 0.6 : 1 }"
      >
        <div
          class="relative flex items-center gap-2 bg-[#0b0b0b] px-4 pr-8 border border-[#333] rounded-full w-full md:w-[180px] h-10 font-semibold text-[12px] cursor-text select-none"
          :class="{ 'opacity-60 pointer-events-none': controlsDisabled }"
        >
          <i class="pi pi-search search-icon"></i>
          <input
            v-model="search"
            type="text"
            placeholder="Search..."
            class="flex-1 bg-transparent border-none outline-none placeholder:font-medium text-[#a6a6a6] placeholder-[#a6a6a6]"
            :disabled="controlsDisabled"
            :tabindex="controlsDisabled ? -1 : 0"
            @focus="
              (e: FocusEvent) => {
                if (controlsDisabled) (e.target as HTMLInputElement).blur();
              }
            "
          />
        </div>

        <Select
          v-model="selectedCategory"
          :options="categories"
          class="w-full md:w-auto"
          :disabled="controlsDisabled"
        />

        <div ref="clearSlotRef" class="hidden md:flex justify-center items-center w-0 overflow-hidden">
          <button
            ref="clearBtnRef"
            aria-label="Clear filters"
            @click="clearFilters"
            class="flex justify-center items-center bg-transparent hover:bg-[#0d2717] opacity-0 focus-visible:shadow-none focus:shadow-none border border-[#333] focus-visible:border-[#333] rounded-full focus-visible:outline-none focus:outline-none focus:ring-0 w-10 h-10 text-[#a6a6a6] origin-[50%_50%] transition-all duration-300"
            :class="{
              'pointer-events-none': !showClear,
              'pointer-events-auto': showClear
            }"
            :tabindex="showClear ? 0 : -1"
          >
            <X class="size-4" />
          </button>
        </div>
      </div>
    </div>

    <div class="mt-4">
      <div v-if="filtered.length === 0" class="relative mt-[6em] p-6 text-center" role="status">
        <div class="relative">
          <h3 class="mb-1 font-medium text-white text-2xl">
            {{ items.length > 0 ? 'No results...' : 'Nothing here yet...' }}
          </h3>
          <h4 class="mb-8 text-[#a6a6a6] text-base">
            {{ items.length > 0 ? 'Try adjusting your filters' : 'Tap the heart on any component to save it' }}
          </h4>

          <div class="flex flex-wrap justify-center gap-2">
            <button
              v-if="items.length > 0"
              class="bg-transparent hover:bg-[#0d2717] px-4 border border-[#333] rounded-full h-10 font-medium text-white transition-colors duration-300 cursor-pointer"
            >
              Clear Filters
            </button>
            <component
              :is="'router-link'"
              to="/get-started/index"
              v-else
              class="flex justify-center items-center bg-transparent hover:bg-[#0d2717] px-4 border border-[#333] rounded-full h-10 font-medium text-white transition-colors duration-300 cursor-pointer"
            >
              Browse Components
            </component>
          </div>
        </div>
      </div>

      <div v-else v-bind="containerProps">
        <div v-bind="wrapperProps">
          <div
            v-for="row in virtualedRows"
            :key="row.index"
            :style="{
              display: 'grid',
              gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
              gap: `${GAP_PX}px`,
              marginBottom: `${GAP_PX}px`
            }"
          >
            <component
              v-for="item in row.data"
              :key="item.key"
              :is="'router-link'"
              :to="`/${slug(fromPascal(item.categoryKey))}/${slug(fromPascal(item.componentKey))}` || '#'"
              :data-item-key="item.key"
              :style="{
                backgroundColor: '#222',
                borderRadius: `${CARD_RADIUS}px`,
                padding: `${CARD_PADDING}px`
              }"
              @mouseenter="hoveredKey = item.key"
              @mouseleave="hoveredKey = null"
            >
              <div class="relative px-4 py-3">
                <h3 class="font-medium text-white text-base leading-[1.4]">{{ item.title }}</h3>
                <p class="font-normal text-[#27ff64] text-xs">{{ item.categoryLabel }}</p>

                <button
                  aria-label="Remove from favorites"
                  v-if="hasDeleteButton"
                  class="top-2 right-2 absolute flex justify-center items-center bg-transparent hover:bg-[#0d2717] focus:opacity-100 border border-[#333] rounded-full w-10 h-10 text-[#a6a6a6] transition-opacity duration-150 ease-in-out cursor-pointer focus:pointer-events-auto"
                  :class="{
                    'opacity-0 pointer-events-none': hoveredKey !== item.key,
                    'opacity-100 pointer-events-auto': hoveredKey === item.key
                  }"
                  @click="handleDeletion($event, item)"
                >
                  <Trash class="size-4" />
                </button>

                <button
                  :aria-label="isSaved(item.key) ? 'Remove from favorites' : 'Add to favorites'"
                  v-if="!hasDeleteButton && hasFavoriteButton"
                  class="top-2 right-2 absolute flex justify-center items-center bg-transparent hover:bg-[#0d2717] focus:opacity-100 border border-[#333] rounded-full w-10 h-10 text-[#a6a6a6] transition-opacity duration-150 ease-in-out cursor-pointer focus:pointer-events-auto"
                  :class="{
                    'opacity-0 pointer-events-none': hoveredKey !== item.key,
                    'opacity-100 pointer-events-auto': hoveredKey === item.key
                  }"
                  @click="handleFavoriteToggle($event, item)"
                >
                  <i :class="isSaved(item.key) ? 'pi pi-heart-fill' : 'pi pi-heart'" :style="{ color: '#ffffff' }"></i>
                </button>
              </div>

              <LazyCardMedia
                :key="item.videoUrl || item.key"
                :video-url="item.videoUrl"
                :active="true"
                :inner-radius="INNER_RADIUS"
              />
            </component>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
::-webkit-scrollbar {
  width: 0;
}
</style>
