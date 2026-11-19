<script setup lang="ts">
import { useColorModeValue } from '@/composables/useTheme';
import { PRO_ASSET_BASE, type ProMediaItem } from '@/constants/Pro';
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

const { item, baseUrl = PRO_ASSET_BASE } = defineProps<{ item: ProMediaItem; baseUrl?: string }>();

const root = ref<HTMLElement | null>(null);
const light = useColorModeValue(true, false);
const playing = ref(false);
const failed = ref<string[]>([]);

const resolve = (path?: string) => {
  if (!path) return '';
  if (/^https?:\/\//.test(path)) return path;
  return new URL(path.replace(/^\//, ''), `${baseUrl.replace(/\/$/, '')}/`).href;
};

const still = computed(() => resolve(light.value ? item.media?.light : item.media?.dark));
const poster = computed(() => resolve(item.media?.poster));
const animated = computed(() => resolve(item.media?.animated));
const source = computed(() => {
  if (still.value && !failed.value.includes(still.value)) return still.value;
  return playing.value && animated.value && !failed.value.includes(animated.value) ? animated.value : poster.value;
});
const showImage = computed(() => Boolean(source.value) && !failed.value.includes(source.value));

const onError = () => {
  if (!failed.value.includes(source.value)) failed.value = [...failed.value, source.value];
};

let observer: IntersectionObserver | null = null;
let motion: MediaQueryList | null = null;
let visible = false;

const update = () => {
  playing.value = visible && !motion?.matches && !document.hidden;
};

const stop = () => {
  observer?.disconnect();
  observer = null;
  motion?.removeEventListener('change', update);
  document.removeEventListener('visibilitychange', update);
};

const start = () => {
  stop();
  if (!root.value || still.value || typeof IntersectionObserver === 'undefined') return;
  motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  observer = new IntersectionObserver(
    entries => {
      visible = entries.some(entry => entry.isIntersecting);
      update();
    },
    { rootMargin: '80px' }
  );
  observer.observe(root.value);
  motion.addEventListener('change', update);
  document.addEventListener('visibilitychange', update);
};

onMounted(start);
watch(still, start);
onBeforeUnmount(stop);
</script>

<template>
  <span ref="root" class="pro-media" aria-hidden="true">
    <img v-if="showImage" :src="source" alt="" loading="lazy" decoding="async" @error="onError" />
    <span v-else class="pro-media-fallback">{{ item.name }}</span>
  </span>
</template>
