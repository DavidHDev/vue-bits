<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import Logo from '../../assets/logos/vue-bits-logo.svg';
import { useStars } from '../../composables/useStars';
import SearchDialog from '../common/SearchDialog.vue';

const { showDocs = false } = defineProps<{ showDocs?: boolean }>();

const GITHUB_URL = 'https://github.com/DavidHDev/vue-bits';

const NAV_LINKS = [{ label: 'Docs', to: '/get-started/index', match: '/get-started' }] as const;

const route = useRoute();
const stars = useStars();

const scrolled = ref(false);
const menuOpen = ref(false);
const searchOpen = ref(false);
const prefsOpen = ref(false);

const linksEl = ref<HTMLElement | null>(null);
const highlightEl = ref<HTMLElement | null>(null);
let prefsCloseTimer: ReturnType<typeof setTimeout> | null = null;

// ── stars ─────────────────────────────────────────────────────────────────────
const formattedStars = computed(() => {
  const n = Number(stars.value);
  if (!n) return '0';
  return n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k` : String(n);
});

// ── active link ───────────────────────────────────────────────────────────────
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

// ── body scroll lock ──────────────────────────────────────────────────────────
watch(menuOpen, open => {
  document.body.style.overflow = open ? 'hidden' : '';
});

// ── keyboard ──────────────────────────────────────────────────────────────────
function handleKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    menuOpen.value = false;
    prefsOpen.value = false;
  }
}

// ── search ────────────────────────────────────────────────────────────────────
function toggleSearch() {
  searchOpen.value = !searchOpen.value;
}
function closeSearch() {
  searchOpen.value = false;
}

onMounted(() => {
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  document.addEventListener('keydown', handleKeyDown);
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
  document.body.style.overflow = '';
});
</script>

<template>
  <header class="ln-navbar" :class="{ 'ln-navbar-scrolled': scrolled, 'ln-navbar-docs': showDocs }">
    <div class="ln-navbar-inner">
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
        <!-- Search + Prefs (docs only) -->
        <template v-if="showDocs">
          <button
            type="button"
            class="ln-navbar-icon-btn ln-navbar-search-btn"
            aria-label="Search"
            @click="toggleSearch"
          >
            <svg
              width="15"
              height="15"
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
            <span class="ln-navbar-search-text">Search...</span>
            <kbd class="ln-navbar-kbd">/</kbd>
          </button>

          <div class="ln-navbar-prefs-wrapper" @mouseenter="handlePrefsEnter" @mouseleave="handlePrefsLeave">
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
                <div class="ln-navbar-prefs-divider" />
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
        </template>

        <!-- GitHub -->
        <a class="ln-navbar-github" :href="GITHUB_URL" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
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
          @click="menuOpen = !menuOpen"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <!-- Mobile menu -->
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
          class="ln-navbar-github"
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

<style scoped>
.ln-navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  height: 56px;
  border-bottom: 1px solid transparent;
  transition:
    border-color 0.2s ease,
    background 0.2s ease,
    backdrop-filter 0.2s ease;
}

.ln-navbar-scrolled {
  background: rgba(11, 11, 11, 0.85);
  backdrop-filter: blur(16px) saturate(1.3);
  -webkit-backdrop-filter: blur(16px) saturate(1.3);
  border-color: rgba(255, 255, 255, 0.06);
}

.ln-navbar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  padding: 0 1.25rem;
  position: relative;
  flex-wrap: wrap;
}

/* ── Left ──────────────────────────────────────────────────────────────────── */
.ln-navbar-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.ln-navbar-logo img {
  height: 22px;
  display: block;
}

.ln-navbar-divider {
  color: rgba(255, 255, 255, 0.2);
  font-size: 18px;
  font-weight: 300;
  user-select: none;
}

.ln-navbar-links {
  display: flex;
  align-items: center;
  gap: 4px;
  position: relative;
}

.ln-navbar-link-highlight {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  opacity: 0;
  pointer-events: none;
  transition:
    transform 0.2s cubic-bezier(0.4, 0, 0.2, 1),
    width 0.2s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.15s ease;
}

.ln-navbar-link {
  position: relative;
  font-size: 13px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.5);
  text-decoration: none;
  padding: 5px 10px;
  border-radius: 8px;
  transition: color 0.15s ease;
  white-space: nowrap;
}
.ln-navbar-link:hover {
  color: #fff;
}
.ln-navbar-link-active {
  color: #fff;
}

/* ── Right ─────────────────────────────────────────────────────────────────── */
.ln-navbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ln-navbar-icon-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 36px;
  padding: 0 12px;
  border-radius: 50px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(11, 11, 11, 0.6);
  color: rgba(255, 255, 255, 0.5);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition:
    border-color 0.15s ease,
    background 0.15s ease,
    color 0.15s ease;
  white-space: nowrap;
}
.ln-navbar-icon-btn:hover {
  border-color: rgba(255, 255, 255, 0.15);
  color: #fff;
}

.ln-navbar-search-text {
  color: rgba(255, 255, 255, 0.35);
}

.ln-navbar-kbd {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.06);
  color: #27ff64;
  font-size: 10px;
  font-weight: 800;
  margin-left: 4px;
}

/* ── Prefs ─────────────────────────────────────────────────────────────────── */
.ln-navbar-prefs-wrapper {
  position: relative;
}

.ln-navbar-prefs-trigger {
  width: 36px;
  padding: 0;
  justify-content: center;
}

.ln-navbar-prefs-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 180px;
  background: rgba(11, 11, 11, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(16px);
  z-index: 200;
}

.ln-navbar-prefs-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.06);
  margin: 6px 0;
}

.ln-navbar-prefs-fav {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 13px;
  font-weight: 500;
  text-decoration: none;
  transition:
    background 0.15s ease,
    color 0.15s ease;
}
.ln-navbar-prefs-fav:hover {
  background: rgba(255, 255, 255, 0.06);
  color: #fff;
}

.prefs-enter-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.prefs-leave-active {
  transition:
    opacity 0.1s ease,
    transform 0.1s ease;
}
.prefs-enter-from,
.prefs-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* ── GitHub ────────────────────────────────────────────────────────────────── */
.ln-navbar-github {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 36px;
  padding: 0 12px;
  border-radius: 50px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(11, 11, 11, 0.6);
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
  font-weight: 600;
  text-decoration: none;
  transition:
    border-color 0.15s ease,
    color 0.15s ease;
  white-space: nowrap;
}
.ln-navbar-github:hover {
  border-color: rgba(255, 255, 255, 0.15);
  color: #fff;
}

/* ── Hamburger ─────────────────────────────────────────────────────────────── */
.ln-navbar-hamburger {
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(11, 11, 11, 0.6);
  cursor: pointer;
  padding: 0;
}
.ln-navbar-hamburger span {
  display: block;
  width: 16px;
  height: 1.5px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 2px;
  transition:
    transform 0.25s ease,
    opacity 0.25s ease;
  transform-origin: center;
}
.ln-navbar-hamburger.open span:nth-child(1) {
  transform: translateY(6.5px) rotate(45deg);
}
.ln-navbar-hamburger.open span:nth-child(2) {
  opacity: 0;
  transform: scaleX(0);
}
.ln-navbar-hamburger.open span:nth-child(3) {
  transform: translateY(-6.5px) rotate(-45deg);
}

/* ── Mobile menu ───────────────────────────────────────────────────────────── */
.ln-navbar-mobile-menu {
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 12px 0 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  gap: 4px;
  animation: mobile-menu-in 0.2s ease;
}

@keyframes mobile-menu-in {
  from {
    opacity: 0;
    transform: translateY(-6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.ln-navbar-mobile-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 4px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.15s ease;
}
.ln-navbar-mobile-link:hover {
  color: #fff;
}

/* ── Responsive ────────────────────────────────────────────────────────────── */
@media (max-width: 768px) {
  .ln-navbar-search-text {
    display: none;
  }
  .ln-navbar-github span {
    display: none;
  }
  .ln-navbar-hamburger {
    display: flex;
  }
  .ln-navbar-links {
    display: none;
  }
  .ln-navbar-divider {
    display: none;
  }
}
</style>
