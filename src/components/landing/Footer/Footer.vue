<script setup lang="ts">
import vueBitsLogo from '@/assets/logos/vue-bits-logo.svg';
import { proLinkProps, toolsLinkProps } from '@/utils/pro';
import FooterWaves from './FooterWaves.vue';
import './Footer.css';

const { wide = false } = defineProps<{ wide?: boolean }>();
const year = new Date().getFullYear();
const proLink = proLinkProps('/', 'footer');
const toolsLink = toolsLinkProps('/tools', 'footer');
</script>

<template>
  <footer :class="['ln-footer', { 'ln-footer--wide': wide, 'ln-footer--lead': $slots.lead }]">
    <div class="ln-footer-inner">
      <div class="ln-footer-card">
        <slot name="lead" />
        <div class="ln-footer-top">
          <div class="ln-footer-brand">
            <RouterLink to="/" aria-label="Vue Bits home">
              <img class="ln-footer-logo" :src="vueBitsLogo" alt="Vue Bits" width="180" height="38" />
            </RouterLink>
            <p>
              Animated Vue components.
              <br />
              Open source. Fully customizable.
            </p>
          </div>

          <nav class="ln-footer-nav" aria-label="Footer">
            <div class="ln-footer-col">
              <span class="ln-footer-col-title">Community</span>
              <a href="https://github.com/DavidHDev/vue-bits" target="_blank" rel="noopener noreferrer">GitHub</a>
              <a href="https://reactbits.dev/" target="_blank" rel="noopener noreferrer">React Bits</a>
              <a href="https://sveltebits.xyz/" target="_blank" rel="noopener noreferrer">Svelte Bits</a>
            </div>
            <div class="ln-footer-col">
              <span class="ln-footer-col-title">Product</span>
              <RouterLink to="/get-started/introduction">Docs</RouterLink>
              <RouterLink to="/get-started/index">Components</RouterLink>
              <RouterLink to="/favorites">Favorites</RouterLink>
            </div>
            <div class="ln-footer-col">
              <span class="ln-footer-col-title">React Bits</span>
              <a v-bind="proLink">React Bits Pro</a>
              <a v-bind="toolsLink">Tools</a>
            </div>
          </nav>

          <div class="ln-footer-legal">
            <span>© {{ year }} Vue Bits</span>
            <span>
              Built with love by
              <a href="https://x.com/davidhaz" target="_blank" rel="noopener noreferrer">@davidhaz</a>
            </span>
            <a
              href="https://github.com/DavidHDev/vue-bits/blob/main/LICENSE.md"
              target="_blank"
              rel="noopener noreferrer"
            >
              License
            </a>
          </div>
        </div>

        <FooterWaves />
      </div>
    </div>
  </footer>
</template>
