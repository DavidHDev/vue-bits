<template>
  <main>
    <LandingLoader v-if="!loaded" :hiding="hiding" />

    <section v-else :class="['landing-wrapper no-side-fades', loaded ? 'ln-loaded' : 'ln-loading']">
      <Hero />
      <Navbar />
      <Features />
      <LiveDemo />
      <QuickStart />
      <CTA />
      <Footer />
    </section>
  </main>
</template>

<script setup lang="ts">
import CTA from '@/components/landing/CTA/CTA.vue';
import Features from '@/components/landing/Features/Features.vue';
import Footer from '@/components/landing/Footer/Footer.vue';
import Hero from '@/components/landing/Hero/Hero.vue';
import LandingLoader from '@/components/landing/LandingLoader/LandingLoader.vue';
import LiveDemo from '@/components/landing/LiveDemo/LiveDemo.vue';
import Navbar from '@/components/landing/Navbar/Navbar.vue';
import QuickStart from '@/components/landing/QuickStart/QuickStart.vue';
import { onMounted, onUnmounted, ref, watch } from 'vue';

const MIN_LOADER_MS = 800;

const loaded = ref(false);
const hiding = ref(false);

function reveal() {
  hiding.value = true;
  setTimeout(() => {
    loaded.value = true;
  }, 600);
}

watch(
  loaded,
  value => {
    if (value) {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    } else {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    }
  },
  { immediate: true }
);

onMounted(() => {
  const start = Date.now();

  const fontsReady = 'fonts' in document ? document.fonts.ready : Promise.resolve();

  fontsReady.then(() => {
    const elapsed = Date.now() - start;
    const remaining = Math.max(0, MIN_LOADER_MS - elapsed);

    setTimeout(reveal, remaining);
  });
});

onUnmounted(() => {
  document.documentElement.style.overflow = '';
  document.body.style.overflow = '';
});
</script>
