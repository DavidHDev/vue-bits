<script setup lang="ts">
import { customToastStyles } from '@/utils/utils';
import { onMounted, onUnmounted, ref } from 'vue';
import Footer from '../landing/Footer/Footer.vue';
import Navbar from '../landing/Navbar/Navbar.vue';
import Sidebar from '../navs/Sidebar.vue';

const drawerOpen = ref(false);
const drawerEl = ref<HTMLElement | null>(null);

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

onMounted(() => document.addEventListener('keydown', onKey));
onUnmounted(() => document.removeEventListener('keydown', onKey));
</script>

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
