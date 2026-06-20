<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import vueBitsLogo from '../../../assets/logos/vue-bits-logo.svg';
import './Footer.css';

const GITHUB_URL = 'https://github.com/DavidHDev/vue-bits';
const year = new Date().getFullYear();

const innerEl = ref<HTMLDivElement | null>(null);
const visible = ref(false);

let io: IntersectionObserver | null = null;

onMounted(() => {
  if (!innerEl.value) return;
  io = new IntersectionObserver(
    entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          visible.value = true;
          io?.disconnect();
        }
      }
    },
    { threshold: 0.1, rootMargin: '-60px' }
  );
  io.observe(innerEl.value);
});

onBeforeUnmount(() => io?.disconnect());
</script>

<template>
  <footer class="ln-footer">
    <div class="ln-footer-glow" />
    <div class="ln-footer-separator" />

    <div ref="innerEl" class="ln-footer-inner" :class="{ 'is-visible': visible }">
      <div class="ln-footer-top">
        <div class="ln-footer-brand">
          <img :src="vueBitsLogo" alt="Vue Bits" class="ln-footer-logo" />
          <p class="ln-footer-tagline">Animated UI components for Vue.</p>
        </div>

        <nav class="ln-footer-nav">
          <div class="ln-footer-col">
            <span class="ln-footer-col-title">Product</span>
            <RouterLink to="/get-started/index" class="ln-footer-link">Docs</RouterLink>
            <a href="https://www.jsrepo.com/" target="_blank" rel="noopener noreferrer" class="ln-footer-link">CLI</a>
          </div>

          <div class="ln-footer-col">
            <span class="ln-footer-col-title">Community</span>
            <a :href="GITHUB_URL" target="_blank" rel="noopener noreferrer" class="ln-footer-link">GitHub</a>
            <a href="https://reactbits.dev/" target="_blank" rel="noopener noreferrer" class="ln-footer-link">
              React Bits
            </a>
            <a href="https://sveltebits.xyz/" target="_blank" rel="noopener noreferrer" class="ln-footer-link">
              Svelte Bits
            </a>
          </div>
        </nav>
      </div>

      <div class="ln-footer-bottom">
        <p class="ln-footer-attribution">
          A Vue port of
          <a href="https://reactbits.dev/" target="_blank" rel="noopener noreferrer" class="ln-footer-creator">
            React Bits
          </a>
          by
          <a href="https://x.com/davidhdev" target="_blank" rel="noopener noreferrer" class="ln-footer-creator">
            davidhdev
          </a>
        </p>
        <p class="ln-footer-copy">© {{ year }} Vue Bits</p>
      </div>
    </div>
  </footer>
</template>
