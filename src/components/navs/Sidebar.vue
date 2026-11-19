<template>
  <nav class="sidebar" aria-label="Docs navigation">
    <RouterLink
      to="/get-started/index"
      class="sidebar-browse"
      :aria-current="onIndexPage ? 'page' : undefined"
      :tabindex="onIndexPage ? -1 : undefined"
      @click="scrollToTop"
    >
      <LayoutGrid :size="13" :stroke-width="2" aria-hidden="true" class="sidebar-browse__icon" />
      <AnimatePresence mode="popLayout" :initial="false">
        <motion.span
          :key="onIndexPage ? 'current' : 'browse'"
          class="sidebar-browse__label"
          :initial="reduceMotion ? { opacity: 0 } : { opacity: 0, y: 6, filter: 'blur(2px)' }"
          :animate="{ opacity: 1, y: 0, filter: 'blur(0px)' }"
          :exit="reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6, filter: 'blur(2px)' }"
          :transition="{ duration: reduceMotion ? 0 : 0.22, ease: [0.23, 1, 0.32, 1] }"
        >
          {{ onIndexPage ? 'Viewing all components' : 'Browse all components' }}
        </motion.span>
      </AnimatePresence>
    </RouterLink>

    <div
      class="sidebar-picker"
      role="tablist"
      aria-label="Category"
      :style="{ '--sp-i': pickerIndex, '--sp-n': PICKER.length }"
      @mouseleave="pickerTip = null"
    >
      <span class="sidebar-picker__pill" aria-hidden="true" />
      <button
        v-for="(option, i) in PICKER"
        :key="option.key"
        type="button"
        role="tab"
        :aria-selected="i === pickerIndex"
        :aria-label="option.label"
        class="sidebar-picker__item"
        :data-active="i === pickerIndex ? '' : undefined"
        @click="pickCategory(option.key)"
        @mouseenter="event => showTip(event, option.label)"
        @focus="event => showTip(event, option.label)"
        @blur="pickerTip = null"
      >
        <HugeiconsIcon :icon="option.icon" :size="18" :stroke-width="1.8" />
      </button>
    </div>

    <label class="sidebar-filter">
      <SearchIcon :size="13" aria-hidden="true" />
      <input
        v-model="sidebarFilter"
        :placeholder="`Filter ${filterCount} components...`"
        aria-label="Filter sidebar navigation"
      />
    </label>

    <div class="sidebar-scroll-shell" :class="{ 'is-at-top': isAtTop, 'is-at-bottom': isAtBottom }">
      <div ref="scrollRef" class="sidebar-scroll">
        <div class="sidebar-sections">
          <template v-for="cat in sidebarCategories" :key="cat.name">
            <div v-if="cat.subcategories.length > 0 || (cat.index === 0 && showFavorites)" class="sidebar-section">
              <p class="category-name">{{ cat.name }}</p>
              <div class="sidebar-link-stack">
                <a
                  v-for="item in itemsFor(cat)"
                  :key="item.path"
                  :ref="el => setItemRef(el as Element | null, item.path)"
                  :href="item.path"
                  class="sidebar-item"
                  :class="{ 'active-sidebar-item': item.isActive }"
                  :aria-current="item.isActive ? 'page' : undefined"
                  @click.prevent="navigateTo(item.path, item.sub)"
                  @mouseenter="event => handlePreviewEnter(cat.name, item.sub, event)"
                  @mousemove="handlePreviewMove"
                  @mouseleave="handlePreviewLeave"
                  @focus="event => handlePreviewEnter(cat.name, item.sub, event as unknown as MouseEvent)"
                  @blur="handlePreviewLeave"
                >
                  {{ item.sub }}
                  <span v-if="item.isNew" class="new-tag">New</span>
                  <span v-if="item.isUpdated" class="updated-tag">Updated</span>
                </a>
                <RouterLink
                  v-if="cat.index === 0 && showFavorites"
                  :ref="el => setItemRef(linkEl(el), '/favorites')"
                  to="/favorites"
                  class="sidebar-item"
                  :class="{ 'active-sidebar-item': route.path === '/favorites' }"
                  @click="scrollToTop"
                >
                  Favorites
                </RouterLink>
              </div>
            </div>
          </template>
          <p v-if="!hasResults" class="sidebar-filter-empty">No matching pages</p>
        </div>
      </div>
    </div>
  </nav>

  <Teleport to="body">
    <AnimatePresence>
      <motion.div
        v-if="pickerTip"
        key="picker-tip"
        class="sidebar-picker-tip"
        role="tooltip"
        :initial="reduceMotion ? { opacity: 0, x: 0, y: '-50%' } : { opacity: 0, x: -6, y: '-50%' }"
        :animate="{ opacity: 1, x: 0, y: '-50%' }"
        :exit="reduceMotion ? { opacity: 0, x: 0, y: '-50%' } : { opacity: 0, x: -6, y: '-50%' }"
        :transition="{ duration: reduceMotion ? 0 : 0.16, ease: [0.23, 1, 0.32, 1] }"
        :style="{ left: `${pickerTip.x}px`, top: `${pickerTip.y}px` }"
      >
        <AnimatePresence mode="popLayout" :initial="false">
          <motion.span
            :key="pickerTip.label"
            :initial="reduceMotion ? { opacity: 0 } : { opacity: 0, y: 4 }"
            :animate="{ opacity: 1, y: 0 }"
            :exit="reduceMotion ? { opacity: 0 } : { opacity: 0, y: -4 }"
            :transition="{ duration: reduceMotion ? 0 : 0.14, ease: [0.23, 1, 0.32, 1] }"
            :style="{ display: 'block' }"
          >
            {{ pickerTip.label }}
          </motion.span>
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>

    <AnimatePresence>
      <motion.aside
        v-if="previewMediaAllowed && preview"
        class="sidebar-hover-preview"
        :style="{ x: previewSpringX, y: previewSpringY }"
        :initial="{ opacity: 0, scale: 0.97 }"
        :animate="{ opacity: 1, scale: 1 }"
        :exit="{ opacity: 0, scale: 0.98 }"
        :transition="reduceMotion ? { duration: 0 } : { duration: 0.18, ease: [0.22, 1, 0.36, 1] }"
        aria-hidden="true"
      >
        <div class="sidebar-hover-preview-media">
          <AnimatePresence mode="sync" :initial="false">
            <motion.div
              :key="preview.key"
              class="sidebar-hover-preview-frame"
              :initial="{ opacity: 0, filter: 'blur(9px)', scale: 1.025 }"
              :animate="{ opacity: 1, filter: 'blur(0px)', scale: 1 }"
              :exit="{ opacity: 0, filter: 'blur(7px)', scale: 0.985 }"
              :transition="reduceMotion ? { duration: 0 } : { duration: 0.48, ease: [0.22, 1, 0.36, 1] }"
            >
              <video
                :key="`${preview.key}-${videoSuffix}`"
                autoplay
                loop
                muted
                playsinline
                preload="metadata"
                @error="onPreviewError"
              >
                <source :src="`${previewBase}.webm`" type="video/webm" @error="onPreviewError" />
                <source :src="`${previewBase}.mp4`" type="video/mp4" @error="onPreviewError" />
              </video>
            </motion.div>
          </AnimatePresence>
        </div>
        <div class="sidebar-hover-preview-caption">
          <span class="sidebar-hover-preview-title">{{ preview.title }}</span>
          <span class="sidebar-hover-preview-item">{{ preview.label }}</span>
        </div>
      </motion.aside>
    </AnimatePresence>
  </Teleport>
</template>

<script setup lang="ts">
import {
  DashboardSquare01Icon,
  Image01Icon,
  Motion01Icon,
  MousePointerClickIcon,
  PuzzleIcon,
  TextFontIcon
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { LayoutGrid, Search as SearchIcon } from 'lucide-vue-next';
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from 'motion-v';
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch, type ComponentPublicInstance } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePreviewMediaAllowed } from '@/composables/usePreviewMediaAllowed';
import { useColorMode } from '@/composables/useTheme';
import { NEW, UPDATED } from '@/constants/Badges';
import { CATEGORIES, TOTAL_COMPONENTS } from '@/constants/Categories';
import { componentMap } from '@/constants/Components';
import { componentMetadata } from '@/constants/Information';

type Category = (typeof CATEGORIES)[number] & { index: number; subcategories: string[] };
type Preview = { key: string; title: string; label: string; videoBase: string };

const SCROLL_OFFSET = 100;
const BOTTOM_ENTER_PX = 8;
const BOTTOM_EXIT_PX = 48;
const PREVIEW_WIDTH = 304;
const PREVIEW_HEIGHT = 226;
const PREVIEW_DELAY = 260;

const PICKER = [
  { key: 'all', label: 'All', icon: DashboardSquare01Icon },
  { key: 'text-animations', label: 'Text Animations', icon: TextFontIcon },
  { key: 'components', label: 'Components', icon: PuzzleIcon },
  { key: 'micro', label: 'Micro', icon: MousePointerClickIcon },
  { key: 'animations', label: 'Animations', icon: Motion01Icon },
  { key: 'backgrounds', label: 'Backgrounds', icon: Image01Icon }
];

const slug = (value: string) => value.replace(/\s+/g, '-').toLowerCase();
const scrollToTop = () => window.scrollTo(0, 0);
const pathOf = (url: string) => {
  try {
    return new URL(url).pathname;
  } catch {
    return url;
  }
};

const METADATA_BY_PATH = new Map(Object.values(componentMetadata).map(meta => [pathOf(meta.docsUrl), meta]));

const route = useRoute();
const router = useRouter();
const reduceMotion = useReducedMotion();
const { colorMode } = useColorMode();

const sidebarFilter = ref('');
const pendingActivePath = ref<string | null>(null);
const pickerTip = ref<{ label: string; x: number; y: number } | null>(null);
const scrollRef = ref<HTMLElement | null>(null);
const isAtTop = ref(true);
const isAtBottom = ref(false);
const itemRefs = new Map<string, HTMLElement>();

const sidebarFilterQuery = computed(() => sidebarFilter.value.trim().toLowerCase());
const focusSlug = computed(() => route.path.match(/^\/c\/([^/]+)/)?.[1] ?? null);
const basePath = computed(() => (focusSlug.value ? '/c' : ''));
const onIndexPage = computed(() => route.path === '/get-started/index');
const pickerIndex = computed(() =>
  Math.max(
    0,
    PICKER.findIndex(option => option.key === (focusSlug.value ?? 'all'))
  )
);

const filterCount = computed(() =>
  focusSlug.value
    ? (CATEGORIES.find(category => slug(category.name) === focusSlug.value)?.subcategories.length ?? TOTAL_COMPONENTS)
    : TOTAL_COMPONENTS
);

const sidebarCategories = computed<Category[]>(() =>
  CATEGORIES.map((category, index) => ({
    ...category,
    index,
    subcategories:
      sidebarFilterQuery.value && !category.name.toLowerCase().includes(sidebarFilterQuery.value)
        ? category.subcategories.filter(item => item.toLowerCase().includes(sidebarFilterQuery.value))
        : [...category.subcategories]
  })).filter(category => !focusSlug.value || category.index === 0 || slug(category.name) === focusSlug.value)
);

const showFavorites = computed(() => !sidebarFilterQuery.value || 'favorites saved'.includes(sidebarFilterQuery.value));
const hasResults = computed(
  () => showFavorites.value || sidebarCategories.value.some(category => category.subcategories.length > 0)
);

const itemsFor = (category: Category) => {
  const prefix = category.name === 'Get Started' ? '' : basePath.value;
  const activePath = pendingActivePath.value || route.path;
  return category.subcategories.map(sub => {
    const path = `${prefix}/${slug(category.name)}/${slug(sub)}`;
    return {
      sub,
      path,
      isActive: activePath === path,
      isNew: NEW.includes(sub),
      isUpdated: UPDATED.includes(sub)
    };
  });
};

const linkEl = (el: Element | ComponentPublicInstance | null) =>
  el && '$el' in el ? (el.$el as Element) : (el as Element | null);

function setItemRef(el: Element | null, path: string) {
  if (el) itemRefs.set(path, el as HTMLElement);
  else itemRefs.delete(path);
}

function pickCategory(key: string) {
  pickerTip.value = null;
  if (key === 'all') {
    if (!focusSlug.value) return;
    const rest = route.path.replace(/^\/c/, '');
    router.push(rest.split('/').filter(Boolean).length >= 2 ? rest : '/get-started/index');
    return;
  }
  if (key !== focusSlug.value) router.push(`/c/${key}`);
}

function showTip(event: Event, label: string) {
  const target = event.currentTarget as HTMLElement;
  const item = target.getBoundingClientRect();
  const nav = target.closest('nav')?.getBoundingClientRect();
  pickerTip.value = { label, x: (nav?.right ?? item.right) + 10, y: item.top + item.height / 2 };
}

async function navigateTo(path: string, subcategory: string) {
  if (route.path === path) return;
  pendingActivePath.value = path;
  componentMap[slug(subcategory) as keyof typeof componentMap]?.();
  await router.push(path);
  scrollToTop();
  pendingActivePath.value = null;
}

function updateScrollEdges() {
  const el = scrollRef.value;
  if (!el) return;
  const remaining = el.scrollHeight - el.scrollTop - el.clientHeight;
  isAtTop.value = el.scrollTop <= 2;
  isAtBottom.value = isAtBottom.value ? remaining <= BOTTOM_EXIT_PX : remaining <= BOTTOM_ENTER_PX;
}

function findActiveElement() {
  const activePath = pendingActivePath.value || route.path;
  return itemRefs.get(activePath) ?? null;
}

function scrollActiveItemIntoView() {
  const activeEl = findActiveElement();
  const container = scrollRef.value;
  if (!activeEl || !container) return;
  const containerRect = container.getBoundingClientRect();
  const elementRect = activeEl.getBoundingClientRect();
  const isOutOfView =
    elementRect.top < containerRect.top + SCROLL_OFFSET || elementRect.bottom > containerRect.bottom - SCROLL_OFFSET;
  if (isOutOfView) {
    container.scrollTo({
      top: container.scrollTop + (elementRect.top - containerRect.top) - SCROLL_OFFSET,
      behavior: 'smooth'
    });
  }
}

const previewMediaAllowed = usePreviewMediaAllowed();
const preview = ref<Preview | null>(null);
const failedPreview = ref<string | null>(null);
const previewX = useMotionValue(260);
const previewY = useMotionValue(100);
const smoothPreviewX = useSpring(previewX, { stiffness: 420, damping: 38, mass: 0.72 });
const smoothPreviewY = useSpring(previewY, { stiffness: 360, damping: 34, mass: 0.78 });
const previewSpringX = computed(() => (reduceMotion.value ? previewX : smoothPreviewX));
const previewSpringY = computed(() => (reduceMotion.value ? previewY : smoothPreviewY));
const videoSuffix = computed(() =>
  colorMode.value === 'light' && failedPreview.value !== preview.value?.key ? '-light' : ''
);
const previewBase = computed(() => (preview.value ? `${preview.value.videoBase}${videoSuffix.value}` : ''));
let showTimer: ReturnType<typeof setTimeout> | undefined;
let hideTimer: ReturnType<typeof setTimeout> | undefined;

function onPreviewError() {
  if (preview.value && videoSuffix.value) failedPreview.value = preview.value.key;
}

function updatePreviewPosition(event: MouseEvent) {
  const target = event.currentTarget as HTMLElement;
  const itemRect = target.getBoundingClientRect();
  const sidebarRect = target.closest('nav')?.getBoundingClientRect();
  const pointerX = event.clientX || itemRect.left + itemRect.width / 2;
  const pointerY = event.clientY || itemRect.top + itemRect.height / 2;
  const sidebarLeft = sidebarRect?.left ?? 16;
  const sidebarWidth = sidebarRect?.width ?? 256;
  const sidebarRight = sidebarRect?.right ?? sidebarLeft + sidebarWidth;
  const pointerProgress = Math.max(0, Math.min(1, (pointerX - sidebarLeft) / sidebarWidth));
  const horizontalDrift = (pointerProgress - 0.5) * 12;
  const nextX = Math.min(window.innerWidth - PREVIEW_WIDTH - 16, sidebarRight + 16 + horizontalDrift);
  const minY = sidebarRect?.top ?? 76;
  const maxY = Math.max(minY, window.innerHeight - PREVIEW_HEIGHT - 16);
  const nextY = Math.max(minY, Math.min(maxY, pointerY - PREVIEW_HEIGHT / 2));
  previewX.set(nextX);
  previewY.set(nextY);
}

function handlePreviewEnter(categoryName: string, componentName: string, event: MouseEvent) {
  if (!previewMediaAllowed.value || categoryName === 'Get Started') return;
  const key = `/${slug(categoryName)}/${slug(componentName)}`;
  const metadata = METADATA_BY_PATH.get(key);
  if (!metadata?.videoUrl) return;

  clearTimeout(showTimer);
  clearTimeout(hideTimer);
  updatePreviewPosition(event);

  const videoBase = metadata.videoUrl.replace(/\.(webm|mp4)$/i, '');
  const delay = preview.value ? 70 : PREVIEW_DELAY;
  showTimer = setTimeout(() => {
    preview.value = { key, title: componentName, label: categoryName, videoBase };
  }, delay);
}

function handlePreviewMove(event: MouseEvent) {
  if (previewMediaAllowed.value && !reduceMotion.value) updatePreviewPosition(event);
}

function handlePreviewLeave() {
  clearTimeout(showTimer);
  clearTimeout(hideTimer);
  hideTimer = setTimeout(() => (preview.value = null), 90);
}

watch(
  () => route.path,
  path => {
    if (pendingActivePath.value && path === pendingActivePath.value) pendingActivePath.value = null;
    setTimeout(scrollActiveItemIntoView, 100);
  }
);

watch([() => route.path, sidebarFilter], () => {
  preview.value = null;
  clearTimeout(showTimer);
  clearTimeout(hideTimer);
});

watch(sidebarCategories, () => nextTick(updateScrollEdges));

watch(previewMediaAllowed, allowed => {
  if (!allowed) preview.value = null;
});

onMounted(() => {
  scrollRef.value?.addEventListener('scroll', updateScrollEdges, { passive: true });
  updateScrollEdges();
  setTimeout(scrollActiveItemIntoView, 100);
});

onBeforeUnmount(() => {
  scrollRef.value?.removeEventListener('scroll', updateScrollEdges);
  clearTimeout(showTimer);
  clearTimeout(hideTimer);
});
</script>
