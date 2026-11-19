<template>
  <div ref="wellRef" class="browse-card-well">
    <template v-if="visible">
      <video
        v-if="videoBase"
        :key="videoBase"
        ref="videoRef"
        loop
        muted
        playsinline
        preload="metadata"
        :poster="`${videoBase}.webp`"
        class="browse-card-video"
        @loadedmetadata="onLoadedMetadata"
      >
        <source :src="`${videoBase}.webm`" type="video/webm" @error="onSourceError" />
        <source :src="`${videoBase}.mp4`" type="video/mp4" @error="onSourceError" />
      </video>
      <img
        v-else-if="posterBase"
        :key="posterBase"
        :src="`${posterBase}.webp`"
        alt=""
        class="browse-card-video"
        @error="posterIndex += 1"
      />
    </template>
    <div v-if="!videoBase && !posterBase" class="browse-card-empty" aria-hidden="true">
      <span>{{ `<${(title || '').replace(/\s+/g, '')} />` }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useColorMode } from '@/composables/useTheme';

const props = defineProps<{ videoUrl: string; playing: boolean; title?: string }>();

const { colorMode } = useColorMode();
const wellRef = ref<HTMLElement | null>(null);
const videoRef = ref<HTMLVideoElement | null>(null);
const visible = ref(false);
const videoIndex = ref(0);
const posterIndex = ref(0);
let sourceErrors = 0;
let observer: IntersectionObserver | null = null;

const plain = computed(() => (props.videoUrl ? props.videoUrl.replace(/\.(webm|mp4)$/i, '') : ''));
const bases = computed(() => {
  if (!plain.value) return [];
  return colorMode.value === 'light' ? [`${plain.value}-light`, plain.value] : [plain.value];
});
const videoBase = computed(() => bases.value[videoIndex.value] ?? '');
const posterBase = computed(() => (videoBase.value ? '' : (bases.value[posterIndex.value] ?? '')));

function onSourceError() {
  sourceErrors += 1;
  if (sourceErrors < 2) return;
  sourceErrors = 0;
  videoIndex.value += 1;
}

function onLoadedMetadata(event: Event) {
  const video = event.currentTarget as HTMLVideoElement;
  if (props.playing) {
    video.play().catch(() => {});
    return;
  }
  if (video.currentTime === 0) video.currentTime = 0.1;
}

watch(bases, () => {
  sourceErrors = 0;
  videoIndex.value = 0;
  posterIndex.value = 0;
});

watch(
  () => props.playing,
  playing => {
    const video = videoRef.value;
    if (!video) return;
    if (playing) video.play().catch(() => {});
    else video.pause();
  }
);

onMounted(() => {
  observer = new IntersectionObserver(
    entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        visible.value = true;
        observer?.disconnect();
        observer = null;
      }
    },
    { rootMargin: '200px' }
  );
  if (wellRef.value) observer.observe(wellRef.value);
});

onBeforeUnmount(() => {
  observer?.disconnect();
  videoRef.value?.pause();
});
</script>
