<template>
  <div class="bg-content-root" aria-hidden="true">
    <!-- Toggle -->
    <div class="bg-content-toggle-wrap">
      <PreviewSwitch title="Demo Content" v-model="showContent" />
    </div>

    <template v-if="showContent">
      <!-- Nav -->
      <div class="bg-content-nav-wrap">
        <div class="bg-content-glass bg-content-nav">
          <div class="bg-content-logo-wrap">
            <img :src="logo" alt="" />
          </div>
          <div class="bg-content-menu-icon">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            >
              <line x1="4" y1="7" x2="20" y2="7" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="17" x2="20" y2="17" />
            </svg>
          </div>
          <div class="bg-content-nav-links">
            <span>Features</span>
            <span>About</span>
            <span class="bg-content-signup">Sign up</span>
          </div>
        </div>
      </div>

      <!-- Hero -->
      <div class="bg-content-hero">
        <div class="bg-content-glass bg-content-tag">
          <span class="bg-content-tag-new">New</span>
          <span>Just shipped v2.0</span>
        </div>

        <h2>{{ headline }}</h2>

        <div class="bg-content-actions">
          <span class="bg-content-primary">Get started</span>
          <span class="bg-content-glass bg-content-secondary">Learn more</span>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import logo from '@/assets/logos/vue-bits-logo-small.svg';
import { ref } from 'vue';
import PreviewSwitch from './PreviewSwitch.vue';

const { headline = 'Build interfaces that feel alive' } = defineProps<{
  headline?: string;
}>();

const showContent = ref(true);
</script>

<style scoped>
.bg-content-root {
  position: absolute;
  inset: 0;
  user-select: none;
  pointer-events: none;
  z-index: 10;
}

.bg-content-glass {
  backdrop-filter: blur(32px) saturate(1.35);
  -webkit-backdrop-filter: blur(32px) saturate(1.35);
  box-shadow:
    0 4px 24px rgba(0, 0, 0, 0.22),
    inset 0 0.5px 0 rgba(255, 255, 255, 0.08);
}

.bg-content-toggle-wrap {
  position: absolute;
  right: 12px;
  bottom: 12px;
  z-index: 10;
  width: 180px;
  opacity: 0.5;
  transition: opacity 0.3s ease;
  pointer-events: auto;
}

.bg-content-toggle-wrap:hover {
  opacity: 1;
}

.bg-content-nav-wrap {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  width: 100%;
  pointer-events: none;
}

.bg-content-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 70%;
  height: 48px;
  margin: 20px auto 0;
  padding: 0 8px 0 14px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
  box-sizing: border-box;
}

.bg-content-logo-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}

.bg-content-logo-wrap img {
  height: 20px;
  width: 20px;
}

.bg-content-menu-icon {
  display: none;
  align-items: center;
  color: rgba(255, 255, 255, 0.5);
}

.bg-content-nav-links {
  display: flex;
  align-items: center;
  gap: 20px;
}

.bg-content-nav-links span {
  color: rgba(255, 255, 255, 0.4);
  font-size: 13px;
  font-weight: 500;
}

.bg-content-nav-links .bg-content-signup {
  display: flex;
  align-items: center;
  height: 30px;
  padding: 0 16px;
  border-radius: 8px;
  background: #fff;
  color: #000;
  font-size: 12px;
  font-weight: 600;
}

.bg-content-hero {
  position: absolute;
  inset: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 24px;
  pointer-events: none;
}

.bg-content-tag {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 14px 5px 5px;
  border-radius: 50px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(18, 15, 23, 0.5);
}

.bg-content-tag-new {
  padding: 3px 10px;
  border-radius: 50px;
  background: #fff;
  color: #000;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

.bg-content-tag span:last-child {
  font-size: 12px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.5);
}

.bg-content-hero h2 {
  max-width: 20ch;
  margin: 24px 0 0;
  color: #fff;
  font-size: clamp(1.6rem, 4vw, 2.4rem);
  line-height: 1.1;
  text-align: center;
  letter-spacing: -0.03em;
  font-weight: 600;
  text-shadow: 0 4px 24px rgba(0, 0, 0, 0.5);
}

.bg-content-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 28px;
}

.bg-content-primary,
.bg-content-secondary {
  display: flex;
  align-items: center;
  height: 40px;
  padding: 0 20px;
  border-radius: 10px;
  font-size: 13px;
}

.bg-content-primary {
  background: #fff;
  color: #000;
  font-weight: 600;
}

.bg-content-secondary {
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
  color: rgba(255, 255, 255, 0.6);
  font-weight: 500;
}

@media (max-width: 768px) {
  .bg-content-nav {
    width: 92%;
  }

  .bg-content-menu-icon {
    display: flex;
  }

  .bg-content-nav-links {
    display: none;
  }
}
</style>
