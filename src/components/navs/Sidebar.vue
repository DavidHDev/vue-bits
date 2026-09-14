<script setup lang="ts">
import { getSavedComponents } from '@/utils/favorites';
import { Search } from 'lucide-vue-next';
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { CATEGORIES, NEW, TOTAL_COMPONENTS, UPDATED, slug } from '../../constants/Categories';
import { componentMap } from '../../constants/Components';
import { componentMetadata } from '../../constants/Information';

withDefaults(defineProps<{ variant?: 'desktop' | 'drawer' }>(), { variant: 'desktop' });

const emit = defineEmits<{ navigate: [] }>();

const route = useRoute();
const router = useRouter();

const activeCategory = computed(() => (route.params.category as string) ?? '');
const activeSub = computed(() => (route.params.subcategory as string) ?? '');

function isActive(cat: string, sub: string) {
  return slug(cat) === activeCategory.value && slug(sub) === activeSub.value;
}

// ── saved set ─────────────────────────────────────────────────────────────────
const savedSet = ref(new Set(getSavedComponents()));

function loadSaved() {
  savedSet.value = new Set(getSavedComponents());
}
const onStorage = (e: StorageEvent) => {
  if (!e.key || e.key === 'savedComponents') loadSaved();
};

// ── filter ────────────────────────────────────────────────────────────────────
const filterQuery = ref('');
const normalizedQuery = computed(() => filterQuery.value.trim().toLowerCase());

const filteredCategories = computed(() => {
  const q = normalizedQuery.value;
  if (!q) return CATEGORIES;
  return CATEGORIES.map(cat => ({
    ...cat,
    subcategories: cat.name.toLowerCase().includes(q)
      ? cat.subcategories
      : cat.subcategories.filter(s => s.toLowerCase().includes(q))
  }));
});

const showFavorites = computed(() => !normalizedQuery.value || 'favorites saved'.includes(normalizedQuery.value));

const hasResults = computed(
  () => showFavorites.value || filteredCategories.value.some(cat => cat.subcategories.length > 0)
);

// ── item refs (scroll-into-view + active line) ──────────────────────────────────
const itemRefs = new Map<string, HTMLElement>();
function setItemRef(el: Element | null, path: string) {
  if (el) itemRefs.set(path, el as HTMLElement);
  else itemRefs.delete(path);
}

// ── scroll shell (edge fades) ────────────────────────────────────────────────
const scrollRef = ref<HTMLElement | null>(null);
const isAtTop = ref(true);
const isAtBottom = ref(false);

function updateScrollEdges() {
  const el = scrollRef.value;
  if (!el) return;
  const remaining = el.scrollHeight - el.scrollTop - el.clientHeight;
  isAtTop.value = el.scrollTop <= 2;
  isAtBottom.value = remaining <= 8;
}

// ── active indicator line ────────────────────────────────────────────────────
const activeLineTop = ref(0);
const activeLineVisible = ref(false);
const activeCategoryEntry = computed(() =>
  CATEGORIES.find(cat => cat.subcategories.some(sub => isActive(cat.name, sub)))
);

function updateActiveLine() {
  nextTick(() => {
    const path = `/${activeCategory.value}/${activeSub.value}`;
    const el = itemRefs.get(path);
    const stack = el?.closest('.sidebar-stack') as HTMLElement | null;
    if (!el || !stack) {
      activeLineVisible.value = false;
      return;
    }
    const stackRect = stack.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    activeLineTop.value = elRect.top - stackRect.top + (elRect.height - 18) / 2;
    activeLineVisible.value = true;
  });
}

function scrollActiveIntoView() {
  nextTick(() => {
    const path = `/${activeCategory.value}/${activeSub.value}`;
    const el = itemRefs.get(path);
    const container = scrollRef.value;
    if (!el || !container) return;

    const containerRect = container.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    const OFFSET = 32;
    const outOfView = elRect.top < containerRect.top + OFFSET || elRect.bottom > containerRect.bottom - OFFSET;

    if (outOfView) {
      container.scrollTo({
        top: container.scrollTop + (elRect.top - containerRect.top) - OFFSET,
        behavior: 'smooth'
      });
    }
  });
}

// ── hover preview ─────────────────────────────────────────────────────────────
const previewMediaAllowed = ref(false);
function computePreviewAllowed() {
  if (typeof window === 'undefined') return;
  const precisePointer = window.matchMedia('(min-width: 968px) and (hover: hover) and (pointer: fine)').matches;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  previewMediaAllowed.value = precisePointer && !reducedMotion;
}

interface PreviewState {
  key: string;
  title: string;
  videoBase: string;
}

const preview = ref<PreviewState | null>(null);
const previewX = ref(0);
const previewY = ref(0);
const PREVIEW_WIDTH = 280;
const PREVIEW_HEIGHT = 190;
let showTimer: ReturnType<typeof setTimeout> | undefined;
let hideTimer: ReturnType<typeof setTimeout> | undefined;

function updatePreviewPosition(event: MouseEvent) {
  const target = event.currentTarget as HTMLElement | null;
  const sidebarRect = target?.closest('.sidebar')?.getBoundingClientRect();
  const itemRect = target?.getBoundingClientRect();
  const pointerY = event.clientY ?? (itemRect ? itemRect.top + itemRect.height / 2 : 100);
  const sidebarRight = sidebarRect?.right ?? (itemRect ? itemRect.right + 20 : 260);

  previewX.value = Math.min(window.innerWidth - PREVIEW_WIDTH - 16, sidebarRight + 16);
  const minY = sidebarRect?.top ?? 76;
  const maxY = Math.max(minY, window.innerHeight - PREVIEW_HEIGHT - 16);
  previewY.value = Math.max(minY, Math.min(maxY, pointerY - PREVIEW_HEIGHT / 2));
}

function handlePreviewEnter(categoryName: string, subName: string, event: MouseEvent) {
  if (!previewMediaAllowed.value || categoryName === 'Get Started') return;

  const key = `${categoryName.replace(/\s+/g, '')}/${subName.replace(/\s+/g, '')}`;
  const meta = componentMetadata[key];
  if (!meta?.videoUrl) return;

  clearTimeout(showTimer);
  clearTimeout(hideTimer);
  updatePreviewPosition(event);

  const videoBase = meta.videoUrl.replace(/\.(webm|mp4)$/i, '');
  const delay = preview.value ? 70 : 260;
  showTimer = setTimeout(() => {
    preview.value = { key, title: subName, videoBase };
  }, delay);
}

function handlePreviewMove(event: MouseEvent) {
  if (previewMediaAllowed.value) updatePreviewPosition(event);
}

function handlePreviewLeave() {
  clearTimeout(showTimer);
  clearTimeout(hideTimer);
  hideTimer = setTimeout(() => (preview.value = null), 90);
}

// ── navigation (with prefetch + view-transition when available) ─────────────
async function navigate(path: string, subName?: string) {
  emit('navigate');
  if (route.path === path) return;

  if (subName) {
    const loader = componentMap[slug(subName) as keyof typeof componentMap];
    loader?.();
  }

  const doNav = async () => {
    await router.push(path);
    window.scrollTo(0, 0);
  };

  const supportsViewTransition = typeof document !== 'undefined' && 'startViewTransition' in document;
  const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (supportsViewTransition && !reducedMotion) {
    (document as Document & { startViewTransition: (cb: () => void | Promise<void>) => void }).startViewTransition(
      doNav
    );
  } else {
    await doNav();
  }
}

watch([activeCategory, activeSub], () => {
  scrollActiveIntoView();
  updateActiveLine();
});

onMounted(() => {
  loadSaved();
  window.addEventListener('favorites:updated', loadSaved);
  window.addEventListener('storage', onStorage);

  computePreviewAllowed();
  const pointerQuery = window.matchMedia('(min-width: 968px) and (hover: hover) and (pointer: fine)');
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  pointerQuery.addEventListener?.('change', computePreviewAllowed);
  motionQuery.addEventListener?.('change', computePreviewAllowed);

  scrollRef.value?.addEventListener('scroll', updateScrollEdges, { passive: true });
  updateScrollEdges();
  window.addEventListener('resize', updateActiveLine);

  nextTick(() => {
    scrollActiveIntoView();
    updateActiveLine();
  });

  onBeforeUnmount(() => {
    window.removeEventListener('favorites:updated', loadSaved);
    window.removeEventListener('storage', onStorage);
    pointerQuery.removeEventListener?.('change', computePreviewAllowed);
    motionQuery.removeEventListener?.('change', computePreviewAllowed);
    scrollRef.value?.removeEventListener('scroll', updateScrollEdges);
    window.removeEventListener('resize', updateActiveLine);
    clearTimeout(showTimer);
    clearTimeout(hideTimer);
  });
});
</script>

<template>
  <aside class="sidebar" :class="{ 'sidebar--drawer': variant === 'drawer' }" aria-label="Docs navigation">
    <label class="sidebar-filter">
      <Search :size="13" aria-hidden="true" />
      <input
        v-model="filterQuery"
        type="text"
        :placeholder="`Filter ${TOTAL_COMPONENTS} components...`"
        aria-label="Filter sidebar navigation"
      />
    </label>

    <div class="sidebar-scroll-shell" :class="{ 'is-at-top': isAtTop, 'is-at-bottom': isAtBottom }">
      <div ref="scrollRef" class="sidebar-scroll">
        <div class="sidebar-inner">
          <div class="sidebar-cat-list">
            <div v-for="cat in filteredCategories" :key="cat.name">
              <template v-if="cat.subcategories.length > 0 || (cat.name === 'Get Started' && showFavorites)">
                <p :id="`sidebar-${slug(cat.name)}`" class="category-name">{{ cat.name }}</p>
                <div class="sidebar-stack" role="list" :aria-labelledby="`sidebar-${slug(cat.name)}`">
                  <span
                    v-if="activeLineVisible && activeCategoryEntry?.name === cat.name"
                    class="sidebar-active-line"
                    :style="{ transform: `translateY(${activeLineTop}px)`, opacity: 1 }"
                  />

                  <a
                    v-for="sub in cat.subcategories"
                    :key="sub"
                    :ref="el => setItemRef(el as Element | null, `/${slug(cat.name)}/${slug(sub)}`)"
                    class="sidebar-item"
                    :class="{ active: isActive(cat.name, sub) }"
                    :href="`/${slug(cat.name)}/${slug(sub)}`"
                    :aria-current="isActive(cat.name, sub) ? 'page' : undefined"
                    role="listitem"
                    @click.prevent="navigate(`/${slug(cat.name)}/${slug(sub)}`, sub)"
                    @mouseenter="event => handlePreviewEnter(cat.name, sub, event)"
                    @mousemove="handlePreviewMove"
                    @mouseleave="handlePreviewLeave"
                    @focus="event => handlePreviewEnter(cat.name, sub, event as unknown as MouseEvent)"
                    @blur="handlePreviewLeave"
                  >
                    <span>{{ sub }}</span>
                    <svg
                      v-if="savedSet.has(`${cat.name}/${sub}`)"
                      class="favorite-sidebar-icon"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="currentColor"
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
                    <span v-if="(NEW as string[]).includes(sub)" class="new-tag">New</span>
                    <span v-else-if="(UPDATED as string[]).includes(sub)" class="updated-tag">Updated</span>
                  </a>

                  <a
                    v-if="cat.name === 'Get Started' && showFavorites"
                    :ref="el => setItemRef(el as Element | null, '/favorites')"
                    class="sidebar-item"
                    :class="{ active: route.path === '/favorites' }"
                    href="/favorites"
                    :aria-current="route.path === '/favorites' ? 'page' : undefined"
                    role="listitem"
                    @click.prevent="navigate('/favorites')"
                  >
                    <span>Favorites</span>
                  </a>
                </div>
              </template>
            </div>

            <p v-if="!hasResults" class="sidebar-filter-empty">No matching pages</p>
          </div>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <div
        v-if="preview && previewMediaAllowed"
        class="sidebar-hover-preview"
        :style="{ transform: `translate(${previewX}px, ${previewY}px)` }"
        aria-hidden="true"
      >
        <div class="sidebar-hover-preview-media">
          <video :key="preview.key" autoplay loop muted playsinline preload="metadata">
            <source :src="`${preview.videoBase}.webm`" type="video/webm" />
            <source :src="`${preview.videoBase}.mp4`" type="video/mp4" />
          </video>
        </div>
        <div class="sidebar-hover-preview-caption">{{ preview.title }}</div>
      </div>
    </Teleport>
  </aside>
</template>

<style scoped>
.sidebar {
  position: fixed;
  top: 76px;
  left: 16px;
  height: calc(100vh - 92px);
  width: 200px;
  margin: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 14px 0 0;
  gap: 10px;
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 16px;
  background: rgba(17, 20, 14, 0.78);
  box-shadow: 0 14px 40px rgba(0, 0, 0, 0.14);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  isolation: isolate;
}

.sidebar-filter {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 7px;
  height: 34px;
  margin: 0 14px;
  padding: 0 10px;
  border: 1px solid var(--border-primary);
  border-radius: 9px;
  background: var(--bg-body);
  color: var(--text-muted);
  transition:
    border-color var(--transition-fast),
    color var(--transition-fast);
}

.sidebar-filter:focus-within {
  border-color: color-mix(in srgb, var(--color-accent-muted) 45%, transparent);
  color: var(--text-primary);
}

.sidebar-filter input {
  width: 100%;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--text-primary);
  font: inherit;
  font-size: 12px;
}

.sidebar-filter input::placeholder {
  color: var(--text-muted);
}

.sidebar-scroll-shell {
  position: relative;
  flex: 1;
  min-height: 0;
}

.sidebar-scroll-shell::before,
.sidebar-scroll-shell::after {
  content: '';
  position: absolute;
  right: 0;
  left: 0;
  z-index: 3;
  height: 24px;
  pointer-events: none;
  opacity: 1;
  transition: opacity 180ms ease;
}

.sidebar-scroll-shell::before {
  top: 0;
  background: linear-gradient(to bottom, var(--bg-body), transparent);
}

.sidebar-scroll-shell::after {
  bottom: 0;
  background: linear-gradient(to top, var(--bg-body), transparent);
}

.sidebar-scroll-shell.is-at-top::before,
.sidebar-scroll-shell.is-at-bottom::after {
  opacity: 0;
}

.sidebar-scroll {
  height: 100%;
  overflow-y: auto;
  padding: 0 14px 6em;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.sidebar-scroll::-webkit-scrollbar {
  display: none;
}

.sidebar-stack {
  position: relative;
}

.sidebar-filter-empty {
  padding: 20px 0;
  color: var(--text-muted);
  font-size: 12px;
  text-align: center;
}

/* ── Hover preview panel ─────────────────────────────────────────────────── */
.sidebar-hover-preview {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 40;
  width: 280px;
  padding: 5px;
  overflow: hidden;
  border: 1px solid var(--border-secondary);
  border-radius: var(--radius-lg);
  background: var(--bg-elevated);
  box-shadow: var(--shadow-dropdown);
  pointer-events: none;
  transition: transform 0.16s cubic-bezier(0.22, 1, 0.36, 1);
}

.sidebar-hover-preview-media {
  position: relative;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  border-radius: calc(var(--radius-lg) - 4px);
  background: var(--bg-body);
  filter: grayscale(100%);
}

.sidebar-hover-preview-media video {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.sidebar-hover-preview-caption {
  padding: 9px 6px 5px;
  color: var(--text-primary);
  font-size: 12px;
  font-weight: 550;
}

@media only screen and (max-width: 967px) {
  .sidebar-hover-preview {
    display: none;
  }
}

/* ── Drawer variant ───────────────────────────────────────────────────────── */
.sidebar--drawer {
  position: static;
  left: auto;
  top: auto;
  padding: 0;
  margin: 0;
  max-width: none;
  width: 100%;
  height: auto;
  overflow: visible;
  border: 0;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
}

.sidebar--drawer .sidebar-scroll-shell {
  flex: none;
  overflow: visible;
}

.sidebar--drawer .sidebar-scroll {
  height: auto;
  overflow: visible;
  padding-bottom: 0;
}

.sidebar--drawer .sidebar-scroll-shell::before,
.sidebar--drawer .sidebar-scroll-shell::after {
  display: none;
}
</style>
