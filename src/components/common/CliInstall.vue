<script setup lang="ts">
import { jsrepoAddSnippet, PKG_MANAGERS, shadcnAddSnippet, type PackageManager } from '@/constants/cli';
import { dependenciesForSlug } from '@/constants/componentDependencies';
import { Check, ChevronDown, Copy } from 'lucide-vue-next';
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

const { slug } = defineProps<{ slug: string }>();

const COPY_RESET_MS = 2000;
const REGISTRIES = ['shadcn', 'jsrepo'] as const;

type Registry = (typeof REGISTRIES)[number];

const pkg = ref<PackageManager>('npm');
const registry = ref<Registry>('shadcn');
const mode = ref<'cli' | 'manual'>('cli');
const copied = ref(false);
const menuOpen = ref(false);
const rootEl = ref<HTMLElement | null>(null);

const dependencies = computed(() => dependenciesForSlug(slug));
const hasManual = computed(() => dependencies.value.length > 0);

const command = computed(() => {
  if (mode.value === 'manual') return `${pkg.value} install ${dependencies.value.join(' ')}`;
  return registry.value === 'jsrepo' ? jsrepoAddSnippet(slug, pkg.value) : shadcnAddSnippet(slug, pkg.value);
});

const selectLabel = computed(() => (mode.value === 'manual' ? pkg.value : `${pkg.value} · ${registry.value}`));

watch(hasManual, val => {
  if (!val && mode.value === 'manual') mode.value = 'cli';
});

async function copyCommand() {
  try {
    await navigator.clipboard.writeText(command.value);
  } catch {
    return;
  }
  copied.value = true;
  setTimeout(() => (copied.value = false), COPY_RESET_MS);
}

function onOutside(e: MouseEvent) {
  if (rootEl.value && !rootEl.value.contains(e.target as Node)) menuOpen.value = false;
}

onMounted(() => document.addEventListener('mousedown', onOutside));
onBeforeUnmount(() => document.removeEventListener('mousedown', onOutside));
</script>

<template>
  <section ref="rootEl" class="code-section-frame cli-install">
    <header class="code-section-heading">
      <div class="code-section-title-group">
        <h2>Install</h2>
      </div>
      <div class="code-section-actions">
        <button type="button" class="cli-toggle-button" :data-active="mode === 'cli'" @click="mode = 'cli'">CLI</button>
        <button
          type="button"
          class="cli-toggle-button"
          :data-active="mode === 'manual'"
          :disabled="!hasManual"
          :title="hasManual ? 'Install dependencies manually' : 'No external dependencies'"
          @click="mode = 'manual'"
        >
          Manual
        </button>

        <div class="cli-select-root">
          <button
            type="button"
            class="cli-toggle-button cli-select"
            aria-haspopup="menu"
            :aria-expanded="menuOpen"
            @click="menuOpen = !menuOpen"
          >
            {{ selectLabel }}
            <ChevronDown :size="14" />
          </button>
          <div v-if="menuOpen" class="cli-menu" role="menu">
            <p class="cli-menu-label">Package manager</p>
            <button
              v-for="m in PKG_MANAGERS"
              :key="m"
              type="button"
              role="menuitemradio"
              class="cli-menu-item"
              @click="((pkg = m), (menuOpen = false))"
            >
              {{ m }}
              <Check v-if="pkg === m" :size="16" />
            </button>
            <template v-if="mode === 'cli'">
              <div class="cli-menu-divider" />
              <p class="cli-menu-label">Registry</p>
              <button
                v-for="r in REGISTRIES"
                :key="r"
                type="button"
                role="menuitemradio"
                class="cli-menu-item"
                @click="((registry = r), (menuOpen = false))"
              >
                {{ r }}
                <Check v-if="registry === r" :size="16" />
              </button>
            </template>
          </div>
        </div>

        <button
          type="button"
          class="docs-copy-button"
          :aria-label="copied ? 'Installation command copied' : 'Copy installation command'"
          @click="copyCommand"
        >
          <Check v-if="copied" :size="16" />
          <Copy v-else :size="16" />
        </button>
      </div>
    </header>
    <div class="code-section-body">
      <code class="cli-code">{{ command }}</code>
    </div>
  </section>
</template>

<style scoped>
.cli-install {
  margin-top: 0;
}

.cli-toggle-button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 36px;
  padding: 0 12px;
  border: 1px solid transparent;
  border-radius: 10px;
  background: var(--surface-ghost-track);
  color: var(--text-muted);
  font-family: inherit;
  font-size: 13px;
  cursor: pointer;
  white-space: nowrap;
  transition:
    background-color var(--transition-base),
    color var(--transition-base);
}

.cli-toggle-button[data-active='true'] {
  background: var(--surface-ghost);
  box-shadow: var(--surface-ghost-highlight);
  color: var(--color-accent);
}

.cli-toggle-button:hover:not(:disabled):not([data-active='true']) {
  color: var(--text-primary);
}

.cli-toggle-button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.cli-select {
  color: var(--text-primary);
}

.cli-select-root {
  position: relative;
}

.cli-menu {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  z-index: 50;
  min-width: 190px;
  padding: 6px;
  border: 1px solid var(--border-primary);
  border-radius: 12px;
  background: var(--bg-body);
  box-shadow: var(--shadow-dropdown);
}

.cli-menu-label {
  margin: 0;
  padding: 8px 10px 4px;
  color: var(--text-muted);
  font-size: 12px;
  font-weight: 600;
}

.cli-menu-item {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: var(--text-primary);
  font-family: inherit;
  font-size: 14px;
  cursor: pointer;
}

.cli-menu-item:hover {
  background: var(--surface-ghost);
}

.cli-menu-divider {
  height: 1px;
  margin: 6px 4px;
  background: var(--border-primary);
}

.cli-code {
  display: block;
  box-sizing: border-box;
  min-height: 60px;
  padding: 1.1rem 1.4em;
  overflow-x: auto;
  color: var(--text-primary);
  font-family: 'Geist Mono', ui-monospace, monospace;
  font-size: 14px;
  line-height: 1.55;
  white-space: pre;
  scrollbar-width: none;
}

.cli-code::-webkit-scrollbar {
  display: none;
}
</style>
