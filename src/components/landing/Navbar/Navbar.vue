<script setup lang="ts">
import SearchDialog from '@/components/common/SearchDialog.vue';
import { useStars } from '@/composables/useStars';
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import Logo from '../../../assets/logos/vue-bits-logo.svg';
import './Navbar.css';

const { showDocs = false } = defineProps<{ showDocs?: boolean }>();
const emit = defineEmits<{ hamburger: [] }>();

const GITHUB_URL = 'https://github.com/DavidHDev/vue-bits';

const NAV_LINKS = [{ label: 'Docs', to: '/get-started/index', match: '/get-started' }] as const;

const route = useRoute();
const stars = useStars();

const scrolled = ref(false);
const menuOpen = ref(false);
const searchOpen = ref(false);
const prefsOpen = ref(false);

const navbarInnerEl = ref<HTMLElement | null>(null);
const linksEl = ref<HTMLElement | null>(null);
const highlightEl = ref<HTMLElement | null>(null);

let prefsCloseTimer: ReturnType<typeof setTimeout> | null = null;

// ── stars ─────────────────────────────────────────────────────────────────────
const formattedStars = computed(() => {
  const v = stars.value;
  return v ?? '0';
});

// ── active ────────────────────────────────────────────────────────────────────
const isActive = (match: string) => route.path.startsWith(match);

// ── highlight ─────────────────────────────────────────────────────────────────
function positionHighlight(el: HTMLElement | null) {
  if (!el || !highlightEl.value || !linksEl.value) return;
  const linkRect = el.getBoundingClientRect();
  const containerRect = linksEl.value.getBoundingClientRect();
  highlightEl.value.style.width = `${linkRect.width}px`;
  highlightEl.value.style.height = `${linkRect.height}px`;
  highlightEl.value.style.transform = `translateX(${linkRect.left - containerRect.left}px)`;
  highlightEl.value.style.opacity = '1';
}

function getActiveEl(): HTMLElement | null {
  return linksEl.value?.querySelector('.ln-navbar-link-active') ?? null;
}

function handleLinkHover(e: MouseEvent) {
  positionHighlight(e.currentTarget as HTMLElement);
}

function handleLinksLeave() {
  const active = getActiveEl();
  if (active) positionHighlight(active);
  else if (highlightEl.value) highlightEl.value.style.opacity = '0';
}

watch(
  () => route.path,
  () => {
    nextTick(() =>
      requestAnimationFrame(() => {
        const active = getActiveEl();
        if (active) positionHighlight(active);
      })
    );
  }
);

// ── scroll ────────────────────────────────────────────────────────────────────
function onScroll() {
  scrolled.value = window.scrollY > 50;
}

// ── search ────────────────────────────────────────────────────────────────────
function closeSearch() {
  searchOpen.value = false;
}
function toggleSearch() {
  searchOpen.value = !searchOpen.value;
}

// ── prefs ─────────────────────────────────────────────────────────────────────
function handlePrefsEnter() {
  if (prefsCloseTimer) clearTimeout(prefsCloseTimer);
  prefsOpen.value = true;
}
function handlePrefsLeave() {
  prefsCloseTimer = setTimeout(() => {
    prefsOpen.value = false;
  }, 150);
}

// ── hamburger ─────────────────────────────────────────────────────────────────
function handleHamburger() {
  if (showDocs) emit('hamburger');
  else menuOpen.value = !menuOpen.value;
}

// ── body scroll lock ──────────────────────────────────────────────────────────
watch(menuOpen, open => {
  document.body.style.overflow = open ? 'hidden' : '';
});

// ── outside click closes landing mobile menu ──────────────────────────────────
function onPointerDown(e: PointerEvent) {
  if (showDocs || !menuOpen.value) return;
  const target = e.target;
  if (target instanceof Node && navbarInnerEl.value?.contains(target)) return;
  menuOpen.value = false;
}

// ── keyboard ──────────────────────────────────────────────────────────────────
function handleKeyDown(e: KeyboardEvent) {
  if (e.key !== 'Escape') return;
  if (menuOpen.value) menuOpen.value = false;
  if (prefsOpen.value) prefsOpen.value = false;
}

onMounted(() => {
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('pointerdown', onPointerDown);
  nextTick(() =>
    requestAnimationFrame(() => {
      const active = getActiveEl();
      if (active) positionHighlight(active);
    })
  );
});

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll);
  document.removeEventListener('keydown', handleKeyDown);
  document.removeEventListener('pointerdown', onPointerDown);
  document.body.style.overflow = '';
});
</script>

<template>
  <header class="ln-navbar" :class="{ 'ln-navbar-scrolled': scrolled, 'ln-navbar-docs': showDocs }">
    <div ref="navbarInnerEl" class="ln-navbar-inner">
      <!-- Left -->
      <div class="ln-navbar-left">
        <RouterLink to="/" class="ln-navbar-logo" aria-label="Vue Bits home">
          <img :src="Logo" alt="Vue Bits" />
        </RouterLink>

        <span class="ln-navbar-divider">/</span>

        <nav ref="linksEl" class="ln-navbar-links" @mouseleave="handleLinksLeave">
          <div ref="highlightEl" class="ln-navbar-link-highlight" />
          <RouterLink
            v-for="{ label, to, match } in NAV_LINKS"
            :key="to"
            class="ln-navbar-link"
            :class="{ 'ln-navbar-link-active': isActive(match) }"
            :to="to"
            @mouseenter="handleLinkHover"
          >
            {{ label }}
          </RouterLink>
        </nav>
      </div>

      <!-- Right -->
      <div class="ln-navbar-right">
        <!-- Search -->
        <button type="button" class="ln-navbar-search" aria-label="Search" @click="toggleSearch">
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
          <span>Search</span>
          <kbd>/</kbd>
        </button>

        <!-- Prefs (docs only) -->
        <div
          v-if="showDocs"
          class="ln-navbar-prefs-wrapper"
          role="presentation"
          @mouseenter="handlePrefsEnter"
          @mouseleave="handlePrefsLeave"
        >
          <button type="button" class="ln-navbar-icon-btn ln-navbar-prefs-trigger" aria-label="Preferences">
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
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>

          <Transition name="prefs">
            <div v-if="prefsOpen" class="ln-navbar-prefs-menu">
              <RouterLink to="/favorites" class="ln-navbar-prefs-fav" @click="prefsOpen = false">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
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
                Favorites
              </RouterLink>
            </div>
          </Transition>
        </div>

        <!-- GitHub -->
        <a
          class="ln-navbar-github"
          :href="GITHUB_URL"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub repository"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="#fff"
            aria-hidden="true"
          >
            <path
              d="M8 0C3.58 0 0 3.58 0 8a8 8 0 0 0 5.47 7.59c.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z"
            />
          </svg>
          <span>{{ formattedStars }}</span>
        </a>

        <!-- Hamburger -->
        <button
          type="button"
          class="ln-navbar-hamburger"
          :class="{ open: menuOpen }"
          :aria-expanded="menuOpen"
          aria-label="Menu"
          @click="handleHamburger"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <!-- Mobile menu (landing only) -->
      <div v-if="menuOpen && !showDocs" class="ln-navbar-mobile-menu">
        <RouterLink
          v-for="{ label, to } in NAV_LINKS"
          :key="to"
          class="ln-navbar-mobile-link"
          :to="to"
          @click="menuOpen = false"
        >
          {{ label }}
        </RouterLink>
        <a
          :href="GITHUB_URL"
          target="_blank"
          rel="noopener noreferrer"
          class="ln-navbar-mobile-link"
          @click="menuOpen = false"
        >
          <span style="display: inline-flex; align-items: center; gap: 8px">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                d="M8 0C3.58 0 0 3.58 0 8a8 8 0 0 0 5.47 7.59c.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z"
              />
            </svg>
            GitHub
          </span>
          <span style="opacity: 0.6">{{ formattedStars }}</span>
        </a>
      </div>
    </div>
  </header>

  <SearchDialog :is-open="searchOpen" @close="closeSearch" @toggle="toggleSearch" />
</template>
