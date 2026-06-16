<template>
  <div class="docs-app">
    <Navbar :show-docs="true" @hamburger="toggle" />

    <!-- Mobile drawer backdrop -->
    <div class="docs-drawer-backdrop" :data-open="drawerOpen" role="presentation" @click="close" />

    <!-- Mobile drawer -->
    <div
      ref="drawerEl"
      class="docs-drawer"
      :data-open="drawerOpen"
      tabindex="-1"
      role="dialog"
      aria-modal="true"
      aria-label="Docs navigation"
      :aria-hidden="!drawerOpen"
      :inert="!drawerOpen || undefined"
    >
      <Sidebar @navigate="close" />
    </div>

    <!-- Main content -->
    <div class="docs-wrapper">
      <Sidebar />
      <div class="docs-content">
        <router-view />

        <div class="category-page">
          <ComponentList
            title="Favorites"
            :list="savedList"
            :has-delete-button="true"
            emptyTitle="Nothing here yet..."
            emptyDescription="Tap the heart on any component to save it"
          />
        </div>

        <Toast
          position="bottom-right"
          :close-button-props="customToastStyles.customToastCloseButton"
          :pt="customToastStyles"
        />
      </div>
    </div>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import ComponentList from '@/components/common/ComponentList.vue';
import Footer from '@/components/landing/Footer/Footer.vue';
import Navbar from '@/components/landing/Navbar/Navbar.vue';
import Sidebar from '@/components/navs/Sidebar.vue';
import { componentMetadata } from '@/constants/Information';
import { getSavedComponents } from '@/utils/favorites';
import { customToastStyles } from '@/utils/utils';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

const drawerOpen = ref(false);
const drawerEl = ref<HTMLElement | null>(null);

const savedKeys = ref<string[]>([]);
const savedList = computed(() => {
  const entries = (savedKeys.value || [])
    .filter(k => typeof k === 'string' && k.includes('/') && componentMetadata?.[k])
    .map(k => [k, componentMetadata[k]]);
  return Object.fromEntries(entries);
});

function update() {
  savedKeys.value = getSavedComponents();
}
const onStorage = (e: StorageEvent) => {
  if (!e.key || e.key === 'savedComponents') update();
};

function toggle() {
  drawerOpen.value = !drawerOpen.value;
}
function close() {
  drawerOpen.value = false;
}

function getFocusable(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  ).filter(el => !el.hasAttribute('disabled') && el.tabIndex !== -1);
}

function onKey(e: KeyboardEvent) {
  if (!drawerOpen.value || !drawerEl.value) return;
  if (e.key === 'Escape') {
    e.preventDefault();
    close();
    return;
  }
  if (e.key !== 'Tab') return;
  const focusable = getFocusable(drawerEl.value);
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}

onMounted(() => {
  update();
  window.addEventListener('favorites:updated', update);
  window.addEventListener('storage', onStorage);
  document.addEventListener('keydown', onKey);
});

onBeforeUnmount(() => {
  window.removeEventListener('favorites:updated', update);
  window.removeEventListener('storage', onStorage);
  document.removeEventListener('keydown', onKey);
});
</script>

<style scoped>
/* ─── Docs drawer sidebar override ────────────────────────────────────────── */
.docs-drawer .sidebar {
  position: static;
  padding: 0;
  margin-left: 0;
  max-width: none;
  width: 100%;
  height: auto;
  display: block;
}

.docs-content {
  min-width: 0;
  flex: 1;
}

@media only screen and (max-width: 967px) {
  .docs-content {
    padding: 6em 1.25em 5.5em;
  }
}
</style>
