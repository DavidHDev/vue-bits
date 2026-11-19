<template>
  <FadeContent :blur="true" class="preview-footer">
    <p class="footer-description" style="opacity: 0.8">
      Created with
      <AiFillHeart class="footer-heart" />
      by
      <a href="https://x.com/davidhaz" target="_blank" class="footer-creator-link cursor-target">David Haz</a>
    </p>
  </FadeContent>
</template>

<script setup lang="ts">
import { AiFillHeart } from 'vue-icons-plus/ai';
import FadeContent from '@/content/Animations/FadeContent/FadeContent.vue';
</script>
