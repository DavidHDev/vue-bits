<template>
  <div ref="containerRef" class="bg-black h-[200px] overflow-hidden" :style="{ borderRadius: innerRadius }">
    <video
      v-if="show"
      ref="videoRef"
      autoplay
      loop
      muted
      playsinline
      preload="metadata"
      :style="{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block',
        pointerEvents: 'none'
      }"
    >
      <!-- Let the browser choose the best supported source -->
      <source :src="webm" type="video/webm" />
      <source :src="mp4" type="video/mp4" />
    </video>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch, nextTick } from 'vue';

const props = defineProps({
  videoUrl: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    required: true
  },
  innerRadius: {
    type: String,
    required: false,
    default: '0px'
  }
});

const containerRef = ref<HTMLElement | null>(null);
const videoRef = ref<HTMLVideoElement | null>(null);
const isVisible = ref(false);
const show = computed(() => !!props.videoUrl && !!props.active && isVisible.value);

const base = computed(() => (props.videoUrl ? props.videoUrl.replace(/\.(webm|mp4)$/i, '') : ''));
const webm = computed(() => (base.value ? `${base.value}.webm` : ''));
const mp4 = computed(() => (base.value ? `${base.value}.mp4` : ''));

let mounted = true;
let cleanup: (() => void) | null = null;

const tryPlay = () => {
  const v = videoRef.value;
  if (!v || !mounted || !show.value) return;

  try {
    const p = v.play();
    if (p && typeof p.then === 'function') {
      p.catch(() => {
        // Autoplay was prevented, try again after user interaction
      });
    }
  } catch {
    // ignore autoplay errors
  }
};

const setupVideo = async () => {
  if (cleanup) {
    cleanup();
    cleanup = null;
  }

  await nextTick();

  const v = videoRef.value;
  if (!v || !show.value) return;

  if (v.readyState >= 3) {
    tryPlay();
    return;
  }

  const onLoadedMeta = () => tryPlay();
  const onCanPlay = () => tryPlay();
  const onLoadedData = () => tryPlay();
  const onCanPlayThrough = () => tryPlay();
  const onError = () => {
    console.error('Video failed to load:', props.videoUrl);
  };

  v.addEventListener('loadedmetadata', onLoadedMeta);
  v.addEventListener('canplay', onCanPlay);
  v.addEventListener('loadeddata', onLoadedData);
  v.addEventListener('canplaythrough', onCanPlayThrough);
  v.addEventListener('error', onError);

  try {
    v.load();
  } catch {
    // ignore load errors
  }

  const id = setTimeout(tryPlay, 1200);

  cleanup = () => {
    clearTimeout(id);
    v.removeEventListener('loadedmetadata', onLoadedMeta);
    v.removeEventListener('canplay', onCanPlay);
    v.removeEventListener('loadeddata', onLoadedData);
    v.removeEventListener('canplaythrough', onCanPlayThrough);
    v.removeEventListener('error', onError);
  };
};

const pauseVideo = () => {
  const v = videoRef.value;
  if (!v) return;

  try {
    v.pause();
  } catch {
    // ignore pause errors
  }
};

watch(
  show,
  async newVal => {
    if (newVal) {
      await setupVideo();
    } else {
      pauseVideo();
    }
  },
  { immediate: true }
);

onMounted(() => {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        isVisible.value = entry.isIntersecting;
      });
    },
    {
      threshold: 0.1,
      rootMargin: '50px'
    }
  );

  if (containerRef.value) {
    observer.observe(containerRef.value);
  }

  const observerCleanup = () => {
    if (containerRef.value) {
      observer.unobserve(containerRef.value);
    }
    observer.disconnect();
  };

  const originalCleanup = cleanup;
  cleanup = () => {
    if (originalCleanup) {
      originalCleanup();
    }
    observerCleanup();
  };

  if (show.value) {
    setupVideo();
  }
});

onBeforeUnmount(() => {
  mounted = false;
  if (cleanup) {
    cleanup();
    cleanup = null;
  }
  pauseVideo();
});
</script>
