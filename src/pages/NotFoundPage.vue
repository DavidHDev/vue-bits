<template>
  <div
    ref="pageRef"
    class="nf"
    :data-entering="entering ? '' : undefined"
    :data-preview="previewActive ? '' : undefined"
    :style="{ '--nf-power': power }"
  >
    <Navbar :show-docs="true" />

    <main class="nf-main">
      <div class="nf-default" :inert="previewActive || undefined" :aria-hidden="previewActive || undefined">
        <div ref="stageRef" class="nf-stage" :style="{ '--nf-scale': STAGE_SCALE }" aria-hidden="true">
          <div class="nf-sign">
            <svg class="nf-tubes" :viewBox="MARK_VIEWBOX" preserveAspectRatio="xMidYMid meet">
              <path :d="MARK_PATH" />
            </svg>
            <component
              :is="ElectricLogo"
              v-if="ElectricLogo"
              :src="MARK_SRC"
              :theme="theme"
              :color="palette.color"
              :glow-color="palette.glowColor"
              :bend="palette.bend"
              :glow="palette.glow"
              :intensity="power"
              :interactive="!reducedMotion"
              :speed="reducedMotion ? 0 : 1.8"
              :arcs="reducedMotion ? 0 : 0.55"
              :flicker="reducedMotion ? 0 : 0.3"
              :scale="STAGE_SCALE"
              :thickness="1.6"
              :cursor-radius="90"
            />
          </div>
        </div>

        <h1 ref="titleRef" class="nf-title">
          <span class="nf-sr-only">404.</span>
          This page doesn’t exist
        </h1>
        <p class="nf-lede">The link may be broken, or the page may have moved.</p>

        <nav v-if="suggestions.length > 0" class="nf-suggest" aria-label="Suggested components">
          <span class="nf-suggest-label">Did you mean</span>
          <RouterLink v-for="item in suggestions" :key="item.path" :to="item.path" class="nf-suggest-link">
            <span class="nf-suggest-name">{{ item.name }}</span>
            <span class="nf-suggest-category">{{ item.category }}</span>
            <HugeiconsIcon
              :icon="ArrowRight01Icon"
              :size="14"
              :stroke-width="1.8"
              class="nf-suggest-arrow"
              aria-hidden="true"
            />
          </RouterLink>
        </nav>

        <RouterLink to="/get-started/index" class="nf-btn">Browse components</RouterLink>
      </div>
    </main>

    <nav class="nf-categories" aria-label="Categories">
      <RouterLink v-for="(link, index) in CATEGORY_LINKS" :key="link.to" :to="link.to" :style="{ '--nf-order': index }">
        {{ link.label }}
      </RouterLink>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ArrowRight01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { computed, defineAsyncComponent, onBeforeUnmount, onMounted, ref, watch, type Component } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Navbar from '@/components/landing/Navbar/Navbar.vue';
import { useColorModeValue } from '@/composables/useTheme';
import { findComponentBySlug, suggestComponents } from '@/utils/routeMatch';
import markup from '@/assets/svg/404.svg?raw';

const MARK_SRC = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(markup)}`;
const MARK_VIEWBOX = markup.match(/viewBox="([^"]+)"/)?.[1] ?? '0 0 1897 742';
const MARK_PATH = markup.match(/ d="([^"]+)"/)?.[1] ?? '';
const STAGE_SCALE = 0.56;

const PALETTES = {
  dark: { color: '#d6ffe1', glowColor: '#42b883', bend: 0.5, glow: 0.2 },
  light: { color: '#1f9d45', glowColor: '#7fd69b', bend: 0.45, glow: 0.42 }
};

const CATEGORY_LINKS = [
  { label: 'Text Animations', to: '/c/text-animations' },
  { label: 'Animations', to: '/c/animations' },
  { label: 'Components', to: '/c/components' },
  { label: 'Backgrounds', to: '/c/backgrounds' },
  { label: 'Micro', to: '/c/micro' }
];

const BOOT: [number, number][] = [
  [420, 0.55],
  [500, 0.04],
  [760, 0.38],
  [820, 0],
  [1080, 1]
];
const BROWNOUT: [number, number][] = [
  [0, 0.62],
  [80, 1],
  [170, 0.8],
  [240, 1]
];

const electricModules = import.meta.glob<{ default: Component }>('../content/Animations/ElectricLogo/ElectricLogo.vue');
const electricLoader = Object.values(electricModules)[0];
const ElectricLogo = electricLoader ? defineAsyncComponent(electricLoader) : null;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);

const route = useRoute();
const router = useRouter();
const theme = useColorModeValue<'light' | 'dark'>('light', 'dark');
const palette = computed(() => PALETTES[theme.value]);
const reducedMotion = ref(prefersReducedMotion());
const entering = ref(!prefersReducedMotion());
const power = ref(0);
const previewActive = false;
const pageRef = ref<HTMLElement | null>(null);
const stageRef = ref<HTMLElement | null>(null);
const titleRef = ref<HTMLElement | null>(null);
let timers: ReturnType<typeof setTimeout>[] = [];
let brownoutTimer: ReturnType<typeof setTimeout> | undefined;
let enteringTimer: ReturnType<typeof setTimeout> | undefined;
let resizeObserver: ResizeObserver | null = null;
let motionQuery: MediaQueryList | null = null;

const segments = computed(() => route.path.split('/').filter(Boolean));
const lastSegment = computed(() => segments.value[segments.value.length - 1] || '');
const suggestions = computed(() => suggestComponents(lastSegment.value));

const clearTimers = () => {
  timers.forEach(clearTimeout);
  timers = [];
};

function play(sequence: [number, number][]) {
  clearTimers();
  if (prefersReducedMotion()) {
    power.value = sequence[sequence.length - 1][1];
    return;
  }
  sequence.forEach(([at, level]) => {
    timers.push(setTimeout(() => (power.value = level), at));
  });
}

const lit = computed(() => power.value === 1);

function scheduleBrownout() {
  clearTimeout(brownoutTimer);
  if (!lit.value || reducedMotion.value) return;
  brownoutTimer = setTimeout(
    () => {
      play(BROWNOUT);
      scheduleBrownout();
    },
    10000 + Math.random() * 9000
  );
}

watch([lit, reducedMotion], ([isLit]) => {
  if (isLit) scheduleBrownout();
});

function syncMotion() {
  if (!motionQuery) return;
  reducedMotion.value = motionQuery.matches;
  if (motionQuery.matches) entering.value = false;
  clearTimers();
  power.value = 1;
}

watch(
  () => route.fullPath,
  () => {
    if (segments.value.length !== 1) return;
    const direct = findComponentBySlug(lastSegment.value);
    if (direct) router.replace({ path: direct.path, query: route.query, hash: route.hash });
  },
  { immediate: true }
);

onMounted(() => {
  document.title = 'Page not found - Vue Bits';
  motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  motionQuery.addEventListener('change', syncMotion);
  enteringTimer = setTimeout(() => (entering.value = false), 1900);
  play(BOOT);

  const stage = stageRef.value;
  const title = titleRef.value;
  if (stage && title) {
    const sync = () => stage.style.setProperty('--nf-glyph-w', `${title.offsetWidth}px`);
    sync();
    resizeObserver = new ResizeObserver(sync);
    resizeObserver.observe(title);
  }
});

onBeforeUnmount(() => {
  clearTimers();
  clearTimeout(brownoutTimer);
  clearTimeout(enteringTimer);
  resizeObserver?.disconnect();
  motionQuery?.removeEventListener('change', syncMotion);
});
</script>

<style>
.nf {
  --nf-preview: 0;
  --nf-background: #111111;
  --nf-title-size: clamp(22px, 2.6vw, 28px);
  --nf-tube: rgb(220 255 230 / 0.12);
  --nf-spill: rgb(124 255 103 / 0.05);
  position: relative;
  display: flex;
  min-height: 100svh;
  flex-direction: column;
  overflow: hidden;
  isolation: isolate;
  background: var(--nf-background);
  color: var(--text-primary);
}

:root[data-theme='light'] .nf {
  --nf-background: #ffffff;
  --nf-tube: rgb(22 24 22 / 0.12);
  --nf-spill: rgb(31 157 69 / 0.035);
}

.nf::before {
  position: absolute;
  inset: 0;
  background: radial-gradient(17% 15% at 50% 42%, var(--nf-spill), transparent);
  content: '';
  opacity: var(--nf-power, 0);
  pointer-events: none;
}

.nf-main {
  position: relative;
  z-index: 1;
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 88px 16px 28px;
  text-align: center;
}

.nf-default {
  position: relative;
  z-index: 2;
  display: flex;
  width: 100%;
  flex: none;
  flex-direction: column;
  align-items: center;
  opacity: calc(1 - var(--nf-preview));
  translate: 0 calc(var(--nf-preview) * -18px);
  scale: calc(1 - var(--nf-preview) * 0.12);
  filter: blur(calc(var(--nf-preview) * 8px));
}

.nf-stage {
  --nf-glyph-w: calc(var(--nf-title-size) * 10.5);
  --nf-fade-x: linear-gradient(to right, transparent, #000 12%, #000 88%, transparent);
  --nf-fade-y: linear-gradient(to bottom, transparent, #000 14%, #000 86%, transparent);
  position: relative;
  z-index: 0;
  flex: none;
  width: calc(var(--nf-glyph-w) / var(--nf-scale));
  min-height: 0;
  aspect-ratio: 2.556 / 1;
  margin: calc(var(--nf-glyph-w) * -0.154) 0 calc(var(--nf-glyph-w) * -0.154 + 52px);
  -webkit-mask-image: var(--nf-fade-x), var(--nf-fade-y);
  -webkit-mask-composite: source-in;
  mask-image: var(--nf-fade-x), var(--nf-fade-y);
  mask-composite: intersect;
  -webkit-box-reflect: below var(--nf-reflect, 0px) linear-gradient(transparent 64%, rgb(0 0 0 / 0.16));
}

.nf-sign,
.nf-stage .electric-logo {
  position: absolute;
  inset: 0;
}

.nf[data-entering] > .ln-navbar {
  animation: nf-nav-enter 550ms cubic-bezier(0.22, 1, 0.36, 1) 80ms both;
}

.nf[data-entering] .nf-sign {
  animation: nf-sign-enter 1100ms cubic-bezier(0.22, 1, 0.36, 1) 160ms both;
}

.nf[data-entering] .nf-title,
.nf[data-entering] .nf-lede,
.nf[data-entering] .nf-suggest,
.nf[data-entering] .nf-btn,
.nf[data-entering] .nf-categories a {
  animation: nf-content-enter 720ms cubic-bezier(0.22, 1, 0.36, 1) both;
}

.nf[data-entering] .nf-title {
  animation-delay: 480ms;
}
.nf[data-entering] .nf-lede {
  animation-delay: 530ms;
}
.nf[data-entering] .nf-suggest {
  animation-delay: 580ms;
}
.nf[data-entering] .nf-btn {
  animation-delay: 640ms;
}
.nf[data-entering] .nf-categories a {
  animation-delay: calc(780ms + var(--nf-order) * 35ms);
}

.nf[data-entering] .ln-navbar:focus-within,
.nf[data-entering] .nf-btn:focus-visible,
.nf[data-entering] .nf-suggest:focus-within,
.nf[data-entering] .nf-categories a:focus-visible {
  animation: none;
}

@keyframes nf-nav-enter {
  from {
    opacity: 0;
    translate: 0 -6px;
  }
  to {
    opacity: 1;
    translate: 0 0;
  }
}

@keyframes nf-sign-enter {
  from {
    opacity: 0;
    translate: 0 10px;
    scale: 0.97;
    filter: blur(3px);
  }
  to {
    opacity: 1;
    translate: 0 0;
    scale: 1;
    filter: blur(0);
  }
}

@keyframes nf-content-enter {
  from {
    opacity: 0;
    translate: 0 12px;
    filter: blur(3px);
  }
  to {
    opacity: 1;
    translate: 0 0;
    filter: blur(0);
  }
}

.nf-tubes {
  position: absolute;
  top: calc((1 - var(--nf-scale)) * 50%);
  left: calc((1 - var(--nf-scale)) * 50%);
  width: calc(var(--nf-scale) * 100%);
  height: calc(var(--nf-scale) * 100%);
  overflow: visible;
  fill: none;
  stroke: var(--nf-tube);
  stroke-width: 1.25;
  stroke-linejoin: round;
  pointer-events: none;
}

.nf-tubes path {
  vector-effect: non-scaling-stroke;
}

.nf-title {
  position: relative;
  z-index: 4;
  margin: 0;
  font-size: var(--nf-title-size);
  font-weight: 600;
  letter-spacing: -0.025em;
  line-height: 1.2;
  text-wrap: balance;
}

.nf-lede {
  position: relative;
  z-index: 4;
  max-width: 48ch;
  margin: 10px 0 0;
  color: var(--tool-muted);
  font-size: 15px;
  line-height: 1.5;
  text-wrap: balance;
}

.nf-suggest {
  position: relative;
  z-index: 4;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 24px;
}

.nf-suggest-label {
  margin-right: 4px;
  color: var(--tool-muted);
  font-size: 13.5px;
}

.nf-suggest-link {
  display: inline-flex;
  height: 34px;
  align-items: center;
  gap: 8px;
  padding: 0 10px 0 13px;
  border-radius: 10px;
  background: var(--tool-track);
  color: var(--text-primary);
  font-size: 13.5px;
  font-weight: 500;
  letter-spacing: -0.01em;
  text-decoration: none;
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
  transition:
    background-color var(--dur-menu) var(--ease-out),
    transform var(--dur-press) var(--ease-out);
}

.nf-suggest-link:hover {
  background: var(--tool-track-hover);
}

.nf-suggest-link:active {
  transform: scale(0.97);
}

.nf-suggest-category {
  color: var(--tool-muted);
  font-weight: 450;
}

.nf-suggest-arrow {
  color: var(--tool-muted);
  transition:
    color var(--dur-menu) var(--ease-out),
    transform var(--dur-menu) var(--ease-out);
}

.nf-suggest-link:hover .nf-suggest-arrow {
  color: var(--text-primary);
  transform: translateX(2px);
}

.nf-btn {
  position: relative;
  z-index: 4;
  display: inline-flex;
  height: 40px;
  align-items: center;
  margin-top: 24px;
  padding: 0 18px;
  border-radius: 11px;
  background: #f3f5f3;
  color: #111111;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: -0.01em;
  text-decoration: none;
  transition:
    background-color var(--transition-base),
    transform var(--dur-press) var(--ease-out);
}

.nf-suggest + .nf-btn {
  margin-top: 16px;
}

.nf-btn:hover {
  background: #ffffff;
}

.nf-btn:active {
  transform: scale(0.97);
}

.nf-btn:focus-visible,
.nf-suggest-link:focus-visible,
.nf-categories a:focus-visible {
  outline: 2px solid var(--text-primary);
  outline-offset: 3px;
}

.nf-categories {
  position: relative;
  z-index: 4;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0;
  padding: 0 12px 28px;
  font-size: 13px;
}

.nf-categories a {
  padding: 4px 12px;
  color: var(--text-muted);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.nf-categories a:hover {
  color: var(--text-primary);
}

.nf-sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

@media (max-width: 640px) {
  .nf-suggest-label {
    flex-basis: 100%;
    margin: 0 0 2px;
  }

  .nf-main {
    padding-top: 84px;
  }
}

:root[data-theme='light'] .nf-btn {
  background: #161816;
  color: #ffffff;
}

:root[data-theme='light'] .nf-btn:hover {
  background: #2b2e2b;
}

@media (prefers-reduced-motion: reduce) {
  .nf-default {
    translate: none;
    scale: none;
    filter: none;
  }

  .nf[data-entering] > .ln-navbar,
  .nf[data-entering] .nf-sign,
  .nf[data-entering] .nf-title,
  .nf[data-entering] .nf-lede,
  .nf[data-entering] .nf-suggest,
  .nf[data-entering] .nf-btn,
  .nf[data-entering] .nf-categories a {
    animation: none;
  }

  .nf-btn,
  .nf-suggest-link,
  .nf-suggest-arrow,
  .nf-categories a {
    transition: none;
  }
}
</style>
