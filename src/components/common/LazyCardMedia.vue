<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

const {
  videoUrl,
  playing,
  innerRadius = '12px'
} = defineProps<{
  videoUrl: string;
  playing: boolean;
  innerRadius?: string;
}>();

const containerRef = ref<HTMLElement | null>(null);
const videoRef = ref<HTMLVideoElement | null>(null);
const isVisible = ref(false);

const show = computed(() => !!videoUrl && isVisible.value);
const base = computed(() => videoUrl.replace(/\.(webm|mp4)$/i, ''));
const webm = computed(() => `${base.value}.webm`);
const mp4 = computed(() => `${base.value}.mp4`);

// ── intersection observer (lazy load) ─────────────────────────────────────────
let observer: IntersectionObserver | null = null;

onMounted(() => {
  observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        isVisible.value = entry.isIntersecting;
      });
    },
    { threshold: 0.1, rootMargin: '50px' }
  );
  if (containerRef.value) observer.observe(containerRef.value);
});

onBeforeUnmount(() => {
  observer?.disconnect();
  observer = null;
  videoRef.value?.pause();
});

// ── play / pause driven by parent ─────────────────────────────────────────────
watch(
  () => playing,
  shouldPlay => {
    const v = videoRef.value;
    if (!v) return;
    if (shouldPlay) {
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }
);

// ── also react when the video element mounts/unmounts (show toggles) ──────────
watch(videoRef, v => {
  if (!v) return;
  if (playing) v.play().catch(() => {});
});

function handleLoadedMetadata(e: Event) {
  (e.currentTarget as HTMLVideoElement).currentTime = 0.1;
}
</script>

<template>
  <div ref="containerRef" class="lazy-card-media" :style="{ borderRadius: innerRadius }">
    <video v-if="show" ref="videoRef" loop muted playsinline preload="metadata" @loadedmetadata="handleLoadedMetadata">
      <source :src="webm" type="video/webm" />
      <source :src="mp4" type="video/mp4" />
    </video>
  </div>
</template>

<style scoped>
.lazy-card-media {
  height: 190px;
  background: var(--bg-body);
  overflow: hidden;
}

.lazy-card-media video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  pointer-events: none;
  filter: grayscale(100%);
  mix-blend-mode: screen;
}
</style>
