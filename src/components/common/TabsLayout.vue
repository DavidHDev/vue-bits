<script setup lang="ts">
import {
  Fragment,
  computed,
  h,
  isVNode,
  nextTick,
  onBeforeUnmount,
  provide,
  ref,
  useSlots,
  watch,
  type Component,
  type FunctionalComponent,
  type VNode
} from 'vue';
import { useRoute } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { HugeiconsIcon } from '@hugeicons/vue';
import {
  ComputerIcon,
  FavouriteIcon,
  FullScreenIcon,
  MoreHorizontalIcon,
  Share08Icon,
  SmartPhone01Icon,
  SourceCodeIcon,
  Tablet01Icon,
  ViewIcon
} from '@hugeicons/core-free-icons';
import { dependenciesForSlug } from '@/constants/componentDependencies';
import { useAIExportActions } from '@/composables/useAIExportActions';
import { usePreviewFrame } from '@/composables/usePreviewFrame';
import { hasComponentPropsContext, useComponentPropsContext } from '@/components/context/componentProps';
import type { CodeObject } from '@/types/code';
import { buildPrompt, stripSourceHeader } from '@/utils/aiPrompt';
import { copyText } from '@/utils/aiExport';
import { getComponentOverviewByPath } from '@/utils/catalog';
import { injectPropsIntoVueUsage } from '@/utils/codeGeneration';
import { isComponentSaved, toggleSavedComponent } from '@/utils/favorites';
import AIMenuSections from './AIMenuSections.vue';
import CodeExample from './CodeExample.vue';
import ComponentPager from './ComponentPager.vue';
import CopyForAIMenu from './CopyForAIMenu.vue';
import Customize from './Customize.vue';
import Dependencies from './Dependencies.vue';
import DocsMenu from './DocsMenu.vue';
import DocsMenuGroup from './DocsMenuGroup.vue';
import DocsMenuItem from './DocsMenuItem.vue';
import DocsTooltip from './DocsTooltip.vue';
import CategoryProFooter from './Pro/CategoryProFooter.vue';
import PreviewResizer from './PreviewResizer.vue';
import PropTable, { type PropRow } from './PropTable.vue';
import RelatedComponents from './RelatedComponents.vue';
import TabsFooter from './TabsFooter.vue';
import { CUSTOMIZE_ACTIONS } from './customizeActions';
import { demoModesFor, demoView } from './demoModes';
import { PREVIEW_STAGE, type DemoMode } from './previewStage';

const props = withDefaults(
  defineProps<{
    className?: string;
    componentName?: string;
    usage?: string;
    source?: string;
    propsTable?: PropRow[];
    hasChanges?: boolean;
    onreset?: () => void;
  }>(),
  {
    className: undefined,
    componentName: undefined,
    usage: '',
    source: '',
    propsTable: () => [],
    hasChanges: false,
    onreset: undefined
  }
);

const TABLET_WIDTH = 768;
const MOBILE_WIDTH = 375;

const WIDTH_PRESETS = [
  { label: 'Desktop', icon: ComputerIcon, width: null as number | null },
  { label: `Tablet · ${TABLET_WIDTH}px`, icon: Tablet01Icon, width: TABLET_WIDTH as number | null },
  { label: `Mobile · ${MOBILE_WIDTH}px`, icon: SmartPhone01Icon, width: MOBILE_WIDTH as number | null }
];

const slots = useSlots();
const route = useRoute();
const toast = useToast();
const usesContext = hasComponentPropsContext();
const context = useComponentPropsContext();

const category = computed(() => (route.params.category as string) ?? '');
const subcategory = computed(() => (route.params.subcategory as string) ?? '');
const overview = computed(() => getComponentOverviewByPath(`/${category.value}/${subcategory.value}`));

const toPascal = (str: string) =>
  (str || '')
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');

const resetProps = () => {
  if (usesContext) context.resetProps();
  else props.onreset?.();
};

provide(CUSTOMIZE_ACTIONS, {
  reset: resetProps,
  canReset: computed(() => (usesContext ? context.hasChanges.value : Boolean(props.onreset) && props.hasChanges))
});

const isComponent = (vnode: VNode, target: Component) => vnode.type === target;

const findVNodeProps = (nodes: unknown, target: Component): Record<string, unknown> | null => {
  if (!nodes) return null;
  const list = Array.isArray(nodes) ? nodes : [nodes];
  for (const node of list) {
    if (!node || typeof node !== 'object') continue;
    const vnode = node as VNode;
    if (isComponent(vnode, target)) return (vnode.props as Record<string, unknown>) ?? {};
    const children = vnode.children as unknown;
    if (Array.isArray(children)) {
      const found = findVNodeProps(children, target);
      if (found) return found;
    } else if (
      children &&
      typeof children === 'object' &&
      typeof (children as { default?: unknown }).default === 'function'
    ) {
      const found = findVNodeProps((children as { default: () => unknown }).default(), target);
      if (found) return found;
    }
  }
  return null;
};

const insertCategoryPro = (nodes: VNode[], category: string) => {
  const hasTarget = (list: VNode[], target: Component): boolean =>
    list.some(
      node =>
        isVNode(node) &&
        (node.type === target ||
          (node.type === Fragment && Array.isArray(node.children) && hasTarget(node.children as VNode[], target)))
    );
  const target = hasTarget(nodes, Customize) ? Customize : hasTarget(nodes, PropTable) ? PropTable : null;
  if (!target) return nodes;
  let inserted = false;
  const visit = (list: VNode[]): VNode[] =>
    list.flatMap(node => {
      if (inserted || !isVNode(node)) return [node];
      if (node.type === target) {
        inserted = true;
        const strip = h(CategoryProFooter, { key: 'related-pro', category });
        return target === Customize ? [node, strip] : [strip, node];
      }
      if (node.type === Fragment && Array.isArray(node.children)) {
        const children = visit(node.children as VNode[]);
        return inserted ? [h(Fragment, { key: node.key ?? undefined }, children)] : [node];
      }
      return [node];
    });
  return visit(nodes);
};

const readProp = (record: Record<string, unknown> | null, camel: string) => {
  if (!record) return undefined;
  const kebab = camel.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
  return record[camel] ?? record[kebab];
};

const codeExampleProps = computed(() => {
  const found = findVNodeProps(slots.code?.(), CodeExample);
  if (!found) return null;
  const codeObject = readProp(found, 'codeObject') as CodeObject | undefined;
  if (!codeObject) return null;
  return { codeObject, componentName: (readProp(found, 'componentName') as string | undefined) ?? '' };
});

const namedProSlot = Boolean(slots.customize || slots.propTable);

const PreviewContent: FunctionalComponent = () => {
  const nodes = slots.preview?.() ?? [];
  return namedProSlot ? nodes : insertCategoryPro(nodes, category.value);
};

const propData = computed<PropRow[]>(() => {
  if (props.propsTable.length) return props.propsTable;
  const found = findVNodeProps(slots.preview?.(), PropTable) ?? findVNodeProps(slots.propTable?.(), PropTable);
  return (readProp(found, 'data') as PropRow[] | undefined) ?? [];
});

const isLegacy = computed(() => Boolean(props.source) && !codeExampleProps.value);

const legacyDependencies = computed(() => (isLegacy.value ? dependenciesForSlug(subcategory.value) : []));

const promptComponentName = computed(
  () => codeExampleProps.value?.componentName || props.componentName || toPascal(subcategory.value)
);

const aiExport = computed(() => {
  const name = promptComponentName.value;
  const codeObject: CodeObject | null = codeExampleProps.value
    ? codeExampleProps.value.codeObject
    : props.source
      ? {
          usage: props.usage,
          code: props.source,
          dependencies: dependenciesForSlug(subcategory.value).join(' ')
        }
      : null;
  if (!codeObject || !name) return null;

  const mergedProps = { ...context.props.value, ...context.computedProps.value };
  const configuredUsage =
    codeObject.usage && usesContext
      ? injectPropsIntoVueUsage(
          codeObject.usage,
          mergedProps,
          context.defaultProps.value,
          name,
          context.demoOnlyProps.value
        )
      : codeObject.usage || '';

  return {
    componentName: name,
    category: category.value,
    subcategory: subcategory.value,
    fullPrompt: buildPrompt(name, { ...codeObject, usage: configuredUsage }, propData.value),
    configuredUsage,
    componentSource: stripSourceHeader(codeObject.code || '')
  };
});

const aiActions = useAIExportActions(aiExport);

const favoriteKey = computed(() =>
  category.value && subcategory.value ? `${toPascal(category.value)}/${toPascal(subcategory.value)}` : null
);
const isSaved = ref(false);

watch(
  favoriteKey,
  key => {
    isSaved.value = key ? isComponentSaved(key) : false;
  },
  { immediate: true }
);

function toggleFavorite() {
  if (!favoriteKey.value) return;
  const { saved } = toggleSavedComponent(favoriteKey.value);
  isSaved.value = saved;
  const name = promptComponentName.value;
  toast.add({
    severity: saved ? 'success' : 'error',
    summary: saved ? `Added <${name} /> to favorites` : `Removed <${name} /> from favorites`,
    life: 3000
  });
}

async function copyShareLink() {
  if (await copyText(window.location.href)) {
    toast.add({ severity: 'success', summary: 'Share link copied', life: 2500 });
  } else {
    toast.add({ severity: 'error', summary: 'Could not copy the link', life: 2500 });
  }
}

const activeTab = ref<'preview' | 'code'>('preview');
const codeMounted = ref(false);
watch(activeTab, tab => {
  if (tab === 'code') codeMounted.value = true;
});

const previewWidth = ref<number | null>(null);
const resizing = ref(false);
const previewRef = ref<HTMLElement | null>(null);
const controlsSlot = ref<HTMLElement | null>(null);
const isPreview = computed(() => activeTab.value === 'preview');
const canResize = computed(() => category.value !== 'get-started' && isPreview.value);
const frame = usePreviewFrame(previewRef, canResize);
const isBackgrounds = computed(() => category.value === 'backgrounds');
const hasStageControls = computed(() => isBackgrounds.value && canResize.value);
const demoMode = ref<DemoMode>(rememberedDemoMode);
const demoNarrow = ref(false);
const demoPresent = ref(false);

const setDemoMode = (value: DemoMode) => {
  rememberedDemoMode = value;
  demoMode.value = value;
};

provide(PREVIEW_STAGE, {
  controls: computed(() => (hasStageControls.value ? controlsSlot.value : null)),
  hasControls: hasStageControls,
  demo: {
    mode: demoMode,
    setMode: setDemoMode,
    setNarrow: (value: boolean) => (demoNarrow.value = value),
    setPresent: (value: boolean) => (demoPresent.value = value)
  }
});

watch([frame, previewWidth], ([currentFrame, width]) => {
  if (currentFrame && width !== null && width >= currentFrame.fullWidth) previewWidth.value = null;
});

const canFullscreen = () =>
  typeof document !== 'undefined' &&
  Boolean(
    document.fullscreenEnabled || (document as unknown as { webkitFullscreenEnabled?: boolean }).webkitFullscreenEnabled
  );

function openFullscreen() {
  const demo = previewRef.value?.querySelector('.demo-container') as
    | (HTMLElement & { webkitRequestFullscreen?: () => Promise<void> | void })
    | null;
  const request = demo?.requestFullscreen || demo?.webkitRequestFullscreen;
  if (!demo || !request) return;
  Promise.resolve(request.call(demo)).catch(() =>
    toast.add({ severity: 'error', summary: 'Fullscreen is not available here', life: 2500 })
  );
}

const showFavorite = computed(() => Boolean(favoriteKey.value) && category.value !== 'get-started');
const showFullscreen = computed(() => isBackgrounds.value && isPreview.value && canFullscreen());
const hasOverflowActions = computed(() => showFavorite.value || Boolean(aiExport.value) || showFullscreen.value);
const widthPresets = computed(() =>
  canResize.value && frame.value
    ? WIDTH_PRESETS.filter(preset => preset.width === null || preset.width < (frame.value?.fullWidth ?? 0))
    : []
);
const showDemoModes = computed(() => isBackgrounds.value && isPreview.value && demoPresent.value);
const demoOptions = computed(() => demoModesFor(demoNarrow.value));
const demoSelected = computed(() => demoView(demoMode.value, demoNarrow.value));
const showWidthPresets = computed(() => !showDemoModes.value && widthPresets.value.length > 1);
const favoriteLabel = computed(() => (isSaved.value ? 'Remove from favorites' : 'Add to favorites'));

type Pill = { x: number; width: number; hidden: boolean; ready: boolean } | null;

const tabsTrackRef = ref<HTMLElement | null>(null);
const sizeTrackRef = ref<HTMLElement | null>(null);
const tabsPill = ref<Pill>(null);
const sizePill = ref<Pill>(null);

const measurePill = (track: HTMLElement | null, pill: typeof tabsPill) => {
  if (!track) return;
  const active = track.querySelector<HTMLElement>('[aria-selected="true"], [aria-pressed="true"]');
  const previous = pill.value;
  if (!active) {
    pill.value = previous ? { ...previous, hidden: true } : null;
    return;
  }
  const next = { x: active.offsetLeft, width: active.offsetWidth, hidden: false, ready: Boolean(previous) };
  if (previous && previous.x === next.x && previous.width === next.width && !previous.hidden) return;
  pill.value = next;
};

const pillStyle = (pill: Pill) =>
  pill
    ? { width: `${pill.width}px`, transform: `translateX(${pill.x}px)`, opacity: pill.hidden ? 0 : 1 }
    : { opacity: 0 };

let tabsObserver: ResizeObserver | null = null;
let sizeObserver: ResizeObserver | null = null;

watch(
  tabsTrackRef,
  track => {
    tabsObserver?.disconnect();
    if (!track) return;
    tabsObserver = new ResizeObserver(() => measurePill(track, tabsPill));
    tabsObserver.observe(track);
    measurePill(track, tabsPill);
  },
  { flush: 'post' }
);

watch(
  sizeTrackRef,
  track => {
    sizeObserver?.disconnect();
    sizePill.value = null;
    if (!track) return;
    sizeObserver = new ResizeObserver(() => measurePill(track, sizePill));
    sizeObserver.observe(track);
    measurePill(track, sizePill);
  },
  { flush: 'post' }
);

watch(activeTab, () => nextTick(() => measurePill(tabsTrackRef.value, tabsPill)), { flush: 'post' });

watch(
  () =>
    `${previewWidth.value}-${widthPresets.value.length}-${showFullscreen.value}-${
      showDemoModes.value ? `${demoSelected.value}-${demoOptions.value.length}` : ''
    }`,
  () => nextTick(() => measurePill(sizeTrackRef.value, sizePill)),
  { flush: 'post' }
);

onBeforeUnmount(() => {
  tabsObserver?.disconnect();
  sizeObserver?.disconnect();
});

function selectTab(tab: 'preview' | 'code') {
  activeTab.value = tab;
}

function onTabKey(event: KeyboardEvent) {
  if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
    event.preventDefault();
    const next = activeTab.value === 'preview' ? 'code' : 'preview';
    selectTab(next);
    nextTick(() => tabsTrackRef.value?.querySelector<HTMLElement>(`[data-value="${next}"]`)?.focus());
  } else if (event.key === 'Home' || event.key === 'End') {
    event.preventDefault();
    selectTab(event.key === 'Home' ? 'preview' : 'code');
  }
}

const panelId = computed(() => `${subcategory.value || 'component'}`);
</script>

<script lang="ts">
import type { DemoMode as RememberedDemoMode } from './previewStage';

let rememberedDemoMode: RememberedDemoMode = 'none';
</script>

<template>
  <div class="docs-tabs-root" :class="className" style="width: 100%">
    <div class="docs-toolbar">
      <div
        ref="tabsTrackRef"
        class="docs-track docs-tabs"
        role="tablist"
        aria-orientation="horizontal"
        data-pill=""
        @keydown="onTabKey"
      >
        <span
          class="docs-pill"
          aria-hidden="true"
          :data-ready="tabsPill?.ready ? '' : undefined"
          :style="pillStyle(tabsPill)"
        />
        <button
          :id="`${panelId}-tab-preview`"
          type="button"
          role="tab"
          class="docs-segment"
          data-value="preview"
          :aria-selected="activeTab === 'preview'"
          :aria-controls="`${panelId}-panel-preview`"
          :tabindex="activeTab === 'preview' ? 0 : -1"
          :data-selected="activeTab === 'preview' ? '' : undefined"
          @click="selectTab('preview')"
        >
          <HugeiconsIcon :icon="ViewIcon" :size="16" :stroke-width="1.6" aria-hidden="true" />
          Preview
        </button>
        <button
          :id="`${panelId}-tab-code`"
          type="button"
          role="tab"
          class="docs-segment"
          data-value="code"
          :aria-selected="activeTab === 'code'"
          :aria-controls="`${panelId}-panel-code`"
          :tabindex="activeTab === 'code' ? 0 : -1"
          :data-selected="activeTab === 'code' ? '' : undefined"
          @click="selectTab('code')"
        >
          <HugeiconsIcon :icon="SourceCodeIcon" :size="16" :stroke-width="1.6" aria-hidden="true" />
          Code
        </button>
      </div>

      <div class="docs-toolbar-actions">
        <div
          v-if="showDemoModes || showWidthPresets || showFullscreen"
          ref="sizeTrackRef"
          class="docs-track"
          role="group"
          :aria-label="showDemoModes ? 'Demo content' : 'Preview size'"
          data-pill=""
        >
          <span
            class="docs-pill"
            aria-hidden="true"
            :data-ready="sizePill?.ready ? '' : undefined"
            :style="pillStyle(sizePill)"
          />
          <template v-if="showDemoModes">
            <DocsTooltip v-for="item in demoOptions" :key="item.value" :label="item.label">
              <button
                type="button"
                class="docs-segment docs-segment--icon"
                :aria-label="item.label"
                :aria-pressed="demoSelected === item.value"
                @click="setDemoMode(item.value)"
              >
                <HugeiconsIcon :icon="item.icon" :size="16" :stroke-width="1.6" aria-hidden="true" />
              </button>
            </DocsTooltip>
          </template>
          <template v-if="showWidthPresets">
            <DocsTooltip v-for="preset in widthPresets" :key="preset.label" :label="preset.label">
              <button
                type="button"
                class="docs-segment docs-segment--icon"
                :aria-label="preset.label"
                :aria-pressed="previewWidth === preset.width"
                @click="previewWidth = preset.width"
              >
                <HugeiconsIcon :icon="preset.icon" :size="16" :stroke-width="1.6" aria-hidden="true" />
              </button>
            </DocsTooltip>
          </template>
          <DocsTooltip v-if="showFullscreen" label="Fullscreen">
            <button
              type="button"
              class="docs-segment docs-segment--icon"
              aria-label="Fullscreen"
              @click="openFullscreen"
            >
              <HugeiconsIcon :icon="FullScreenIcon" :size="16" :stroke-width="1.6" aria-hidden="true" />
            </button>
          </DocsTooltip>
        </div>

        <div v-if="showFavorite" class="docs-track" role="group" aria-label="Page actions">
          <DocsTooltip :label="favoriteLabel">
            <button
              type="button"
              class="docs-segment docs-segment--icon docs-favorite"
              :aria-label="favoriteLabel"
              :aria-pressed="isSaved"
              :data-saved="isSaved ? '' : undefined"
              @click="toggleFavorite"
            >
              <HugeiconsIcon :icon="FavouriteIcon" :size="16" :stroke-width="1.6" aria-hidden="true" />
            </button>
          </DocsTooltip>
          <DocsTooltip label="Copy share link">
            <button
              type="button"
              class="docs-segment docs-segment--icon"
              aria-label="Copy share link"
              @click="copyShareLink"
            >
              <HugeiconsIcon :icon="Share08Icon" :size="16" :stroke-width="1.6" aria-hidden="true" />
            </button>
          </DocsTooltip>
        </div>

        <CopyForAIMenu
          v-if="aiExport"
          :copy-items="aiActions.copyItems.value"
          :open-items="aiActions.openItems.value"
          :done="aiActions.done.value"
        />
      </div>

      <DocsMenu v-if="hasOverflowActions" placement="bottom-end" :gutter="12" :offset="6" min-width="220px">
        <template #trigger>
          <button type="button" class="docs-tool docs-tool--icon docs-toolbar-more" aria-label="More actions">
            <HugeiconsIcon :icon="MoreHorizontalIcon" :size="16" :stroke-width="1.6" aria-hidden="true" />
            <span v-if="isSaved" class="docs-tool-dot" />
          </button>
        </template>
        <DocsMenuGroup v-if="showFavorite" label="Page">
          <DocsMenuItem @select="toggleFavorite">
            <span class="docs-menu-icon" :data-saved="isSaved ? '' : undefined">
              <HugeiconsIcon :icon="FavouriteIcon" :size="16" :stroke-width="1.6" aria-hidden="true" />
            </span>
            {{ favoriteLabel }}
          </DocsMenuItem>
          <DocsMenuItem @select="copyShareLink">
            <span class="docs-menu-icon">
              <HugeiconsIcon :icon="Share08Icon" :size="16" :stroke-width="1.6" aria-hidden="true" />
            </span>
            Copy share link
          </DocsMenuItem>
        </DocsMenuGroup>
        <AIMenuSections
          v-if="aiExport"
          :copy-items="aiActions.copyItems.value"
          :open-items="aiActions.openItems.value"
          :done="aiActions.done.value"
        />
        <DocsMenuGroup v-if="showFullscreen" label="View">
          <DocsMenuItem @select="openFullscreen">
            <span class="docs-menu-icon">
              <HugeiconsIcon :icon="FullScreenIcon" :size="16" :stroke-width="1.6" aria-hidden="true" />
            </span>
            Fullscreen
          </DocsMenuItem>
        </DocsMenuGroup>
      </DocsMenu>
    </div>

    <div
      v-show="activeTab === 'preview'"
      :id="`${panelId}-panel-preview`"
      ref="previewRef"
      role="tabpanel"
      :aria-labelledby="`${panelId}-tab-preview`"
      class="preview-panel"
      :data-legacy="isLegacy ? '' : undefined"
      :data-resizing="resizing ? '' : undefined"
      :style="previewWidth === null ? undefined : { '--preview-width': `${previewWidth}px` }"
    >
      <div
        v-if="canResize && frame"
        class="preview-stage"
        aria-hidden="true"
        :data-visible="previewWidth !== null || resizing ? '' : undefined"
        :style="{
          top: `${frame.top}px`,
          left: `${frame.left}px`,
          width: `${frame.fullWidth}px`,
          height: `${frame.height}px`
        }"
      />
      <PreviewContent />
      <slot name="customize" />
      <CategoryProFooter v-if="namedProSlot" :category="category" />
      <slot name="propTable" />
      <Dependencies v-if="isLegacy" :dependency-list="legacyDependencies" />
      <div
        v-if="hasStageControls && frame"
        ref="controlsSlot"
        class="preview-controls"
        :style="{ top: `${frame.top}px`, left: `${frame.left}px`, width: `${frame.fullWidth}px` }"
      />
      <PreviewResizer
        v-if="canResize"
        :frame="frame"
        :width="previewWidth"
        @width-change="previewWidth = $event"
        @resizing-change="resizing = $event"
      />
    </div>

    <div
      v-if="codeMounted"
      v-show="activeTab === 'code'"
      :id="`${panelId}-panel-code`"
      role="tabpanel"
      :aria-labelledby="`${panelId}-tab-code`"
    >
      <slot name="code" />
    </div>

    <RelatedComponents v-if="overview && overview.related.length" :overview="overview" />
    <ComponentPager v-if="category !== 'get-started'" :category="category" :subcategory="subcategory" />

    <TabsFooter />
  </div>
</template>
