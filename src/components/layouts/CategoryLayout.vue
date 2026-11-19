<template>
  <main class="app-container docs-app">
    <Navbar :show-docs="true" />
    <section class="category-wrapper">
      <Sidebar />
      <router-view />
      <aside class="right-panel" aria-label="React Bits Pro">
        <div class="right-panel-inner">
          <ProCard />
        </div>
      </aside>
    </section>
    <Toast
      position="bottom-right"
      :close-button-props="customToastStyles.customToastCloseButton"
      :pt="customToastStyles"
    />
  </main>
</template>

<script setup lang="ts">
import Toast from 'primevue/toast';
import { customToastStyles } from '@/utils/utils';
import ProCard from '../common/Pro/ProCard.vue';
import Navbar from '../landing/Navbar/Navbar.vue';
import Sidebar from '../navs/Sidebar.vue';
</script>
