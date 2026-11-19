<template>
  <CodeSection v-if="slug" title="Install" class-name="cli-install">
    <template #actions>
      <div class="cli-install-actions">
        <div class="mode-switch" data-mode-switch style="display: flex; align-items: center">
          <div style="display: flex; align-items: center; gap: 4px">
            <button
              type="button"
              :data-active="mode === 'cli'"
              class="cli-toggle-button"
              @click="setInstallMode('cli')"
            >
              CLI
            </button>
            <button
              v-if="hasManual"
              type="button"
              :data-active="mode === 'manual'"
              class="cli-toggle-button"
              @click="setInstallMode('manual')"
            >
              Manual
            </button>
            <DocsTooltip v-else label='No dependencies, head to the "Code" section' placement="right" :open-delay="200">
              <span style="display: inline-block">
                <button
                  :data-active="false"
                  class="cli-toggle-button disabled"
                  disabled
                  aria-disabled="true"
                  type="button"
                >
                  Manual
                </button>
              </span>
            </DocsTooltip>
          </div>
        </div>

        <DocsMenu placement="bottom-start" :gutter="8" :fluid="false" content-class="install-options-menu">
          <template #trigger>
            <button type="button" class="install-options-trigger" aria-label="Choose installation options">
              <span>{{ packageManager }}</span>
              <template v-if="mode === 'cli'">
                <span class="install-options-dot" aria-hidden="true">·</span>
                <span>{{ cliTool }}</span>
              </template>
              <TbChevronDown aria-hidden="true" />
            </button>
          </template>
          <div class="install-options-label">Package manager</div>
          <DocsMenuItem
            v-for="manager in PKG_MANAGERS"
            :key="manager"
            item-class="install-options-item"
            @select="setPackageManager(manager)"
          >
            <span>{{ manager }}</span>
            <TbCheck v-if="packageManager === manager" aria-hidden="true" />
          </DocsMenuItem>
          <template v-if="mode === 'cli'">
            <div class="install-options-separator" role="separator" />
            <div class="install-options-label">Registry</div>
            <DocsMenuItem
              v-for="tool in CLI_TOOLS"
              :key="tool"
              item-class="install-options-item"
              @select="setCliTool(tool)"
            >
              <span>{{ tool }}</span>
              <TbCheck v-if="cliTool === tool" aria-hidden="true" />
            </DocsMenuItem>
          </template>
        </DocsMenu>

        <CodeCopyButton :code-string="currentCommand" />
      </div>
    </template>

    <div class="code-wrapper" style="position: relative">
      <code ref="codeRef" class="cli-code" style="white-space: pre; width: 100%" @scroll="updateScrollMeta">
        {{ currentCommand }}
      </code>
      <div
        v-if="scrollMeta.show"
        ref="trackRef"
        class="cli-custom-scrollbar"
        :class="{ dragging }"
        aria-hidden="true"
        @mousedown="onScrollbarMouseDown"
      >
        <div
          class="cli-custom-scrollbar-thumb"
          :style="{ width: `${scrollMeta.w}px`, transform: `translateX(${scrollMeta.l}px)` }"
        />
      </div>
    </div>
  </CodeSection>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { TbCheck, TbChevronDown } from 'vue-icons-plus/tb';
import { jsrepoAddSnippet, shadcnAddSnippet } from '@/constants/cli';
import { useInstallation, type CliTool, type PackageManager } from '@/composables/useInstallation';
import { generateDependencyCommands } from '@/utils/dependencies';
import CodeCopyButton from './CodeCopyButton.vue';
import CodeSection from './CodeSection.vue';
import DocsMenu from './DocsMenu.vue';
import DocsMenuItem from './DocsMenuItem.vue';
import DocsTooltip from './DocsTooltip.vue';

const PKG_MANAGERS: PackageManager[] = ['pnpm', 'npm', 'yarn', 'bun'];
const CLI_TOOLS: CliTool[] = ['shadcn', 'jsrepo'];

const props = withDefaults(defineProps<{ deps?: string | string[]; slug?: string }>(), {
  deps: '',
  slug: undefined
});

const route = useRoute();
const slug = computed(() => props.slug || (route.params.subcategory as string) || '');

const { installMode, cliTool, packageManager, setInstallMode, setCliTool, setPackageManager } = useInstallation();

const manual = computed(() => generateDependencyCommands(props.deps));
const hasManual = computed(() => Boolean(manual.value));
const mode = computed(() => (installMode.value === 'manual' && hasManual.value ? 'manual' : 'cli'));

watch(
  hasManual,
  value => {
    if (!value && installMode.value === 'manual') setInstallMode('cli');
  },
  { immediate: true }
);

const currentCommand = computed(() => {
  if (!slug.value) return '';
  if (mode.value === 'manual') return manual.value?.[packageManager.value] || '';
  return cliTool.value === 'jsrepo'
    ? jsrepoAddSnippet(slug.value, packageManager.value)
    : shadcnAddSnippet(slug.value, packageManager.value);
});

const codeRef = ref<HTMLElement | null>(null);
const trackRef = ref<HTMLElement | null>(null);
const scrollMeta = ref({ w: 0, l: 0, show: false });
const dragging = ref(false);
let dragOffset = 0;
let trackWidth = 0;
let thumbWidth = 0;

function updateScrollMeta() {
  const el = codeRef.value;
  if (!el) return;
  const { scrollWidth, clientWidth, scrollLeft } = el;
  if (scrollWidth <= clientWidth) {
    if (scrollMeta.value.show) scrollMeta.value = { w: 0, l: 0, show: false };
    return;
  }
  const ratio = clientWidth / scrollWidth;
  const width = Math.max(24, clientWidth * ratio);
  const maxTrack = clientWidth - width;
  const left = (scrollLeft / (scrollWidth - clientWidth)) * maxTrack;
  scrollMeta.value = { w: width, l: left, show: true };
  trackWidth = clientWidth;
  thumbWidth = width;
}

watch(currentCommand, () => nextTick(updateScrollMeta));

const onMove = (e: MouseEvent) => {
  const el = codeRef.value;
  const track = trackRef.value;
  if (!el || !track) return;
  const rect = track.getBoundingClientRect();
  const maxThumbLeft = trackWidth - thumbWidth;
  const newLeft = Math.max(0, Math.min(maxThumbLeft, e.clientX - rect.left - dragOffset));
  el.scrollLeft = (newLeft / maxThumbLeft) * (el.scrollWidth - el.clientWidth);
  scrollMeta.value = { ...scrollMeta.value, l: newLeft };
};

const onUp = () => {
  dragging.value = false;
};

watch(dragging, value => {
  if (value) {
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp, { once: true });
  } else {
    window.removeEventListener('mousemove', onMove);
    window.removeEventListener('mouseup', onUp);
  }
});

function onScrollbarMouseDown(e: MouseEvent) {
  const el = codeRef.value;
  const track = trackRef.value;
  if (!el || !track) return;
  const rect = track.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const { l: left, w: width } = scrollMeta.value;
  if (clickX >= left && clickX <= left + width) {
    dragOffset = clickX - left;
  } else {
    const maxLeft = trackWidth - width;
    const newLeft = Math.max(0, Math.min(maxLeft, clickX - width / 2));
    el.scrollLeft = (newLeft / maxLeft) * (el.scrollWidth - el.clientWidth);
    dragOffset = clickX - newLeft;
    scrollMeta.value = { ...scrollMeta.value, l: newLeft };
  }
  dragging.value = true;
}

onMounted(() => {
  updateScrollMeta();
  window.addEventListener('resize', updateScrollMeta);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateScrollMeta);
  window.removeEventListener('mousemove', onMove);
  window.removeEventListener('mouseup', onUp);
});
</script>
