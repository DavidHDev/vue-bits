<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';

import {
  jsrepoAddSnippet,
  PKG_TO_RUNNER,
  RUNNER_TO_PKG,
  RUNNERS,
  shadcnAddSnippet,
  type PackageManager,
  type Runner
} from '@/constants/cli';

import './QuickStart.css';

const FEATURED_SLUG = 'aurora';

type Installer = 'jsrepo' | 'shadcn';

type TokenKind = 'kw' | 'comp' | 'attr' | 'str' | 'punc';
type Token = [string, TokenKind];

const IMPORT_TEXT = `import Aurora from './Aurora.vue';`;
const RENDER_TEXT = `<Aurora :color-stops="['#171D22', '#7cff67', '#171D22']" />`;

const IMPORT_TOKENS: Token[] = [
  ['import ', 'kw'],
  ['Aurora', 'comp'],
  [' from ', 'kw'],
  ["'./Aurora.vue'", 'str'],
  [';', 'punc']
];

const RENDER_TOKENS: Token[] = [
  ['<', 'punc'],
  ['Aurora', 'comp'],
  [' ', 'punc'],
  [':color-stops', 'attr'],
  ['="[', 'punc'],
  ["'#171D22'", 'str'],
  [', ', 'punc'],
  ["'#7cff67'", 'str'],
  [', ', 'punc'],
  ["'#171D22'", 'str'],
  [']"', 'punc'],
  [' />', 'punc']
];

const installer = ref<Installer>('jsrepo');
const pkg = ref<PackageManager>('npm');

const dropOpen = ref(false);

const dropdownEl = ref<HTMLDivElement | null>(null);

const headerEl = ref<HTMLDivElement | null>(null);

const terminalEl = ref<HTMLDivElement | null>(null);

const headerVisible = ref(false);
const terminalVisible = ref(false);

const copiedStep = ref<number | null>(null);

let copyTimeout: ReturnType<typeof setTimeout> | null = null;

const runner = computed<Runner>(() => PKG_TO_RUNNER[pkg.value]);

const command = computed(() =>
  installer.value === 'jsrepo' ? jsrepoAddSnippet(FEATURED_SLUG, pkg.value) : shadcnAddSnippet(FEATURED_SLUG, pkg.value)
);

function pickRunner(r: Runner) {
  pkg.value = RUNNER_TO_PKG[r];
  dropOpen.value = false;
}

async function copy(text: string, index: number) {
  try {
    await navigator.clipboard.writeText(text);

    copiedStep.value = index;

    if (copyTimeout) {
      clearTimeout(copyTimeout);
    }

    copyTimeout = setTimeout(() => {
      copiedStep.value = null;
    }, 2000);
  } catch (err) {
    console.error(err);
  }
}

function onDocClick(e: MouseEvent) {
  if (!dropOpen.value) return;

  if (dropdownEl.value && !dropdownEl.value.contains(e.target as Node)) {
    dropOpen.value = false;
  }
}

onMounted(() => {
  const observe = (el: HTMLElement | null, set: (v: boolean) => void) => {
    if (!el) return null;

    const io = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            set(true);
            io.disconnect();
          }
        }
      },
      {
        threshold: 0.1,
        rootMargin: '-60px'
      }
    );

    io.observe(el);

    return io;
  };

  const observers = [
    observe(headerEl.value, v => (headerVisible.value = v)),

    observe(terminalEl.value, v => (terminalVisible.value = v))
  ];

  document.addEventListener('click', onDocClick);

  onUnmounted(() => {
    observers.forEach(o => o?.disconnect());

    document.removeEventListener('click', onDocClick);

    if (copyTimeout) {
      clearTimeout(copyTimeout);
    }
  });
});
</script>

<template>
  <section class="ln-qs-section">
    <div class="ln-qs-inner">
      <div class="ln-qs-grid">
        <div
          ref="headerEl"
          :class="[
            'ln-qs-intro',
            {
              'is-visible': headerVisible
            }
          ]"
        >
          <h2 class="ln-qs-title">Get started in seconds</h2>

          <p class="ln-qs-subtitle">
            One command drops the component's source straight into your project. Choose jsrepo or shadcn, pick your
            package manager, and you're set.
          </p>

          <div class="ln-qs-footnote">
            <RouterLink to="/get-started/installation" class="ln-qs-guide-btn">
              Installation guide

              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </RouterLink>

            <p class="ln-qs-hint">Works with Vite, Nuxt, Astro and Vitesse.</p>
          </div>
        </div>

        <div
          ref="terminalEl"
          :class="[
            'ln-qs-terminal-wrap',
            {
              'is-visible': terminalVisible
            }
          ]"
        >
          <div class="ln-qs-glow"></div>

          <div class="ln-qs-terminal">
            <div class="ln-qs-tab-bar">
              <div class="ln-qs-tabs">
                <button
                  type="button"
                  :class="[
                    'ln-qs-tab',
                    {
                      'ln-qs-tab--active': installer === 'jsrepo'
                    }
                  ]"
                  @click="installer = 'jsrepo'"
                >
                  <img
                    class="ln-qs-tab-logo"
                    src="/vendor/install-brands/jsrepo-favicon.ico"
                    alt=""
                    width="16"
                    height="16"
                    loading="lazy"
                    decoding="async"
                  />

                  <span>jsrepo</span>
                </button>

                <button
                  type="button"
                  :class="[
                    'ln-qs-tab',
                    {
                      'ln-qs-tab--active': installer === 'shadcn'
                    }
                  ]"
                  @click="installer = 'shadcn'"
                >
                  <img
                    class="ln-qs-tab-logo"
                    src="/vendor/install-brands/shadcn-favicon.ico"
                    alt=""
                    width="16"
                    height="16"
                    loading="lazy"
                    decoding="async"
                  />

                  <span>shadcn</span>
                </button>
              </div>

              <div class="ln-qs-tab-bar-right">
                <div ref="dropdownEl" class="ln-qs-runner-dropdown">
                  <button type="button" class="ln-qs-runner-trigger" @click.stop="dropOpen = !dropOpen">
                    {{ runner }}

                    <svg
                      :class="[
                        'ln-qs-caret',
                        {
                          open: dropOpen
                        }
                      ]"
                      width="11"
                      height="11"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.4"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>

                  <div
                    :class="[
                      'ln-qs-runner-menu',
                      {
                        open: dropOpen
                      }
                    ]"
                  >
                    <button
                      v-for="r in RUNNERS"
                      :key="r"
                      type="button"
                      :class="[
                        'ln-qs-runner-item',
                        {
                          active: runner === r
                        }
                      ]"
                      @click="pickRunner(r)"
                    >
                      {{ r }}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <ol class="ln-qs-steps">
              <li class="ln-qs-step">
                <span class="ln-qs-step-num" aria-hidden="true">01</span>

                <div class="ln-qs-step-head">
                  <span class="ln-qs-step-label">Add the component</span>
                </div>

                <div class="ln-qs-step-code">
                  <span class="ln-qs-prompt">~</span>
                  <code class="ln-qs-cmd-text">{{ command }}</code>
                </div>

                <button
                  type="button"
                  :class="['ln-qs-copy', { 'ln-qs-copy--done': copiedStep === 0 }]"
                  aria-label="Copy: Add the component"
                  @click="copy(command, 0)"
                >
                  <svg
                    v-if="copiedStep === 0"
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <svg
                    v-else
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                </button>
              </li>

              <li class="ln-qs-step">
                <span class="ln-qs-step-num" aria-hidden="true">02</span>

                <div class="ln-qs-step-head">
                  <span class="ln-qs-step-label">Import it</span>
                </div>

                <div class="ln-qs-step-code">
                  <code class="ln-qs-cmd-text">
                    <span v-for="(token, i) in IMPORT_TOKENS" :key="i" :class="`ln-qs-t-${token[1]}`">
                      {{ token[0] }}
                    </span>
                  </code>
                </div>

                <button
                  type="button"
                  :class="['ln-qs-copy', { 'ln-qs-copy--done': copiedStep === 1 }]"
                  aria-label="Copy: Import it"
                  @click="copy(IMPORT_TEXT, 1)"
                >
                  <svg
                    v-if="copiedStep === 1"
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <svg
                    v-else
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                </button>
              </li>

              <li class="ln-qs-step">
                <span class="ln-qs-step-num" aria-hidden="true">03</span>

                <div class="ln-qs-step-head">
                  <span class="ln-qs-step-label">Render it</span>
                </div>

                <div class="ln-qs-step-code">
                  <code class="ln-qs-cmd-text">
                    <span v-for="(token, i) in RENDER_TOKENS" :key="i" :class="`ln-qs-t-${token[1]}`">
                      {{ token[0] }}
                    </span>
                  </code>
                </div>

                <button
                  type="button"
                  :class="['ln-qs-copy', { 'ln-qs-copy--done': copiedStep === 2 }]"
                  aria-label="Copy: Render it"
                  @click="copy(RENDER_TEXT, 2)"
                >
                  <svg
                    v-if="copiedStep === 2"
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <svg
                    v-else
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                </button>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
