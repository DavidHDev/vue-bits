<script setup lang="ts">
import { useStars } from '@/composables/useStars';
import { computed } from 'vue';

const stars = useStars();
const formatted = computed(() =>
  stars.value >= 1000 ? `${(stars.value / 1000).toFixed(1).replace(/\.0$/, '')}k` : String(stars.value)
);
</script>

<template>
  <div class="ln-feat-stars">
    <span class="ln-feat-stars-label">GitHub Stars</span>
    <span class="ln-feat-stars-count">{{ formatted }}</span>
    <div class="ln-feat-stars-chart">
      <svg viewBox="0 0 200 50" fill="none" preserveAspectRatio="none">
        <defs>
          <linearGradient id="starFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#fff" stop-opacity="0.08" />
            <stop offset="100%" stop-color="#fff" stop-opacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M0 45 C15 43,30 40,45 36 C60 32,75 30,90 26 C105 22,115 24,125 20 C140 15,155 12,170 10 C180 8,190 5,200 3 L200 50 L0 50Z"
          fill="url(#starFill)"
        />
        <path
          class="ln-feat-stars-line"
          d="M0 45 C15 43,30 40,45 36 C60 32,75 30,90 26 C105 22,115 24,125 20 C140 15,155 12,170 10 C180 8,190 5,200 3"
          stroke="rgba(255,255,255,0.5)"
          stroke-width="1.5"
          stroke-linecap="round"
          pathLength="1"
        />
      </svg>
    </div>
  </div>
</template>

<style>
.ln-feat-stars-line {
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  animation: ln-feat-stars-draw 2s ease-out forwards;
}

@keyframes ln-feat-stars-draw {
  to {
    stroke-dashoffset: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .ln-feat-stars-line {
    animation: none;
    stroke-dashoffset: 0;
  }
}
</style>
