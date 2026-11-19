<template>
  <div ref="rootRef" class="bgc" :data-mode="shape" :data-clip="clip" :data-hidden="hidden ? '' : undefined">
    <span class="bgc-veil" />

    <div class="bgc-window" aria-hidden="true" :data-active="shown === 'landing' ? '' : undefined">
      <div class="bgc-window-bar">
        <span class="bgc-window-dots">
          <i />
          <i />
          <i />
        </span>
        <span class="bgc-window-url">vue-bits.dev</span>
      </div>
      <div class="bgc-site">
        <div class="bgc-nav">
          <img class="bgc-logo" :src="logo" alt="" draggable="false" />
          <div class="bgc-links">
            <span v-for="link in LINKS" :key="link">{{ link }}</span>
          </div>
          <span class="bgc-button bgc-button--primary bgc-button--small">Get started</span>
        </div>
        <div class="bgc-copy">
          <p class="bgc-title">{{ headline }}</p>
          <p class="bgc-text">{{ DESCRIPTION }}</p>
          <div class="bgc-cta">
            <span class="bgc-button bgc-button--primary">
              Start building
              <HugeiconsIcon :icon="ArrowRight01Icon" :size="15" :stroke-width="1.8" />
            </span>
            <span class="bgc-button bgc-button--ghost">Browse components</span>
          </div>
        </div>
      </div>
    </div>

    <div class="bgc-phone" aria-hidden="true" :data-active="shown === 'mobile' ? '' : undefined">
      <div class="bgc-phone-screen">
        <div class="bgc-phone-status">
          <span>9:41</span>
          <span class="bgc-phone-island" />
          <span class="bgc-phone-battery">
            <i />
          </span>
        </div>
        <div class="bgc-nav">
          <img class="bgc-logo" :src="logo" alt="" draggable="false" />
          <span class="bgc-menu">
            <HugeiconsIcon :icon="Menu01Icon" :size="22" :stroke-width="1.6" />
          </span>
        </div>
        <div class="bgc-copy">
          <p class="bgc-title">{{ headline }}</p>
          <p class="bgc-text">{{ DESCRIPTION }}</p>
          <div class="bgc-cta">
            <span class="bgc-button bgc-button--primary">
              Start building
              <HugeiconsIcon :icon="ArrowRight01Icon" :size="15" :stroke-width="1.8" />
            </span>
            <span class="bgc-button bgc-button--ghost">Browse components</span>
          </div>
        </div>
        <span class="bgc-phone-home" />
      </div>
    </div>

    <div class="bgc-card" aria-hidden="true" :data-active="shown === 'card' ? '' : undefined">
      <div class="bgc-card-fade" />
      <span class="bgc-card-badge">
        <img :src="mark" alt="" draggable="false" />
      </span>
      <div class="bgc-card-body">
        <p class="bgc-card-title">{{ headline }}</p>
        <p class="bgc-card-text">{{ DESCRIPTION }}</p>
        <div class="bgc-card-actions">
          <span class="bgc-button bgc-button--primary bgc-button--small">Get started</span>
          <span class="bgc-card-link">
            Learn more
            <HugeiconsIcon :icon="ArrowRight01Icon" :size="14" :stroke-width="1.8" />
          </span>
        </div>
      </div>
    </div>

    <span class="bgc-shell" />

    <Teleport v-if="stage?.hasControls.value && stage.controls.value" :to="stage.controls.value">
      <BackgroundModeSwitch :modes="modes" :mode="view" @change="select" />
    </Teleport>
    <BackgroundModeSwitch v-else-if="!stage?.hasControls.value" :modes="modes" :mode="view" @change="select" />
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { HugeiconsIcon } from '@hugeicons/vue';
import { ArrowRight01Icon, Menu01Icon } from '@hugeicons/core-free-icons';
import logo from '@/assets/logos/vue-bits-logo.svg';
import mark from '@/assets/logos/vue-bits-logo-small.svg';
import BackgroundModeSwitch from './BackgroundModeSwitch.vue';
import { DEMO_NARROW_WIDTH, demoModesFor, demoView } from './demoModes';
import { usePreviewStage, type DemoMode } from './previewStage';

withDefaults(
  defineProps<{
    headline?: string;
    pillText?: string;
  }>(),
  { headline: 'Build interfaces that feel alive' }
);

const DESCRIPTION = 'Vue Bits brings motion and character to your interface, one copy-paste component at a time.';
const LINKS = ['Docs', 'Showcase', 'Pricing'];
const FADE_MS = 200;
const MORPH_MS = 440;

const stage = usePreviewStage();
const demo = stage?.demo ?? null;
const rootRef = ref<HTMLElement | null>(null);
const localMode = ref<DemoMode>(rememberedMode);
const target = computed<DemoMode>(() => (demo ? demo.mode.value : localMode.value));
const narrow = ref(false);
const view = computed(() => demoView(target.value, narrow.value));
const modes = computed(() => demoModesFor(narrow.value));
const shape = ref<DemoMode>(view.value);
const clip = ref<DemoMode>(view.value);
const shown = ref<DemoMode | null>(view.value);
const hidden = ref(false);
let current = view.value;
let animate = false;
let timers: ReturnType<typeof setTimeout>[] = [];
let frame = 0;
let observer: ResizeObserver | null = null;

const PHONE_HEIGHT = 844;
const PHONE_MARGIN = 36;

const fitPhone = () => {
  const host = rootRef.value?.parentElement;
  if (!host) return;
  host.style.removeProperty('--bgc-phone-scale');
  const base = parseFloat(getComputedStyle(host).getPropertyValue('--bgc-phone-scale')) || 0.6;
  const fit = (host.clientHeight - PHONE_MARGIN * 2) / PHONE_HEIGHT;
  if (fit > 0 && fit < base) host.style.setProperty('--bgc-phone-scale', fit.toFixed(4));
};

const measure = () => {
  if (!rootRef.value) return;
  narrow.value = rootRef.value.clientWidth < DEMO_NARROW_WIDTH;
  fitPhone();
};

onMounted(() => {
  measure();
  frame = requestAnimationFrame(() => {
    animate = true;
  });
  observer = new ResizeObserver(measure);
  if (rootRef.value) observer.observe(rootRef.value);
  demo?.setPresent(true);
});

onBeforeUnmount(() => {
  cancelAnimationFrame(frame);
  observer?.disconnect();
  rootRef.value?.parentElement?.style.removeProperty('--bgc-phone-scale');
  timers.forEach(clearTimeout);
  demo?.setPresent(false);
});

watch(narrow, value => demo?.setNarrow(value), { immediate: true });

watch(
  view,
  next => {
    if (next === current) return;
    current = next;
    timers.forEach(clearTimeout);
    shape.value = next;
    if (!animate || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      clip.value = next;
      shown.value = next;
      hidden.value = false;
      return;
    }
    hidden.value = true;
    shown.value = null;
    timers = [
      setTimeout(() => {
        clip.value = next;
      }, FADE_MS),
      setTimeout(() => {
        shown.value = next;
        hidden.value = false;
      }, MORPH_MS)
    ];
  },
  { flush: 'sync' }
);

function select(next: DemoMode) {
  if (demo) {
    demo.setMode(next);
    return;
  }
  rememberedMode = next;
  localMode.value = next;
}
</script>

<script lang="ts">
import type { DemoMode as RememberedDemoMode } from './previewStage';

let rememberedMode: RememberedDemoMode = 'none';
</script>
