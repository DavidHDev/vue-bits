<template>
  <section class="landing-wrapper">
    <div v-if="isMobile" class="mobile-hero-background-container" style="z-index: 0">
      <img
        :src="heroImage"
        alt="Hero background"
        class="mobile-hero-background-image"
        style="transform: translateY(-200px)"
      />
    </div>

    <PlasmaWaveV2 :yOffset="0" :xOffset="40" :rotationDeg="-45" />
    <Hero />
    <FeatureCards />
    <StartBuilding />
    <Footer />
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import Hero from '../components/landing/Hero/Hero.vue';
import PlasmaWaveV2 from '@/components/landing/PlasmaWave/PlasmaWaveV2.vue';
import Footer from '@/components/landing/Footer/Footer.vue';
import FeatureCards from '@/components/landing/FeatureCards/FeatureCards.vue';
import StartBuilding from '@/components/landing/StartBuilding/StartBuilding.vue';
import heroImage from '@/assets/common/hero.webp';
const isMobile = ref(false);

const checkIsMobile = () => {
  isMobile.value = window.innerWidth <= 768;
};

onMounted(() => {
  document.title = 'Vue Bits - Animated UI Components For Vue';
  window.scrollTo(0, 0);
  checkIsMobile();
  window.addEventListener('resize', checkIsMobile);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkIsMobile);
});
</script>
