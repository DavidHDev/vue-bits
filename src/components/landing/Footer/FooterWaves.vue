<script setup lang="ts">
import { useColorModeValue } from '@/composables/useTheme';
import { computed, markRaw, onBeforeUnmount, onMounted, ref, shallowRef, useId, watch, type Component } from 'vue';

const FONT = 'Geist, "Geist Sans", system-ui, sans-serif';
const WORD = 'Vue Bits';
const SHOWN = 0.6;
const CAP = 0.9;
const FADE = 0.4;

type Layout = {
  font: number;
  above: number;
  fade: number;
  boxWidth: number;
  boxHeight: number;
  left: number;
  height: number;
  x: number;
  y: number;
};

const measureWord = () => {
  const context = document.createElement('canvas').getContext('2d')!;
  context.font = `600 100px ${FONT}`;
  const metrics = context.measureText(WORD);
  return {
    advance: metrics.width / 100,
    left: metrics.actualBoundingBoxLeft / 100,
    right: metrics.actualBoundingBoxRight / 100,
    ascent: metrics.actualBoundingBoxAscent / 100,
    descent: metrics.actualBoundingBoxDescent / 100
  };
};

const root = ref<HTMLElement | null>(null);
const id = useId().replace(/[:]/g, '');
const layout = ref<Layout | null>(null);
const near = ref(false);
const visible = ref(false);
const pageVisible = ref(true);
const LiveWaves = shallowRef<Component | null>(null);
const setLiveWaves = (component: Component) => {
  LiveWaves.value = markRaw(component);
};
const failed = ref(false);
const cellSize = ref(9);
const capabilities = ref({ gpu: false, fine: false, reduced: true });
const color = useColorModeValue('#868d87', '#5c635d');
const hoverColor = useColorModeValue('#17843a', '#a0ffbc');
const backgroundColor = useColorModeValue('#f5f7f5', '#171917');
const eligible = computed(() => capabilities.value.gpu && !capabilities.value.reduced && !failed.value);

const handleError = () => {
  failed.value = true;
};

const shapes = Array.from({ length: 16 }, (_, index) => {
  const x = (index % 4) * 9 + 4.5;
  const y = Math.floor(index / 4) * 9 + 4.5;
  return {
    index,
    x,
    y,
    shape: (index + Math.floor(index / 4)) % 3,
    opacity: 0.48 + ((index * 7) % 5) * 0.11
  };
});

const box = computed(() =>
  layout.value
    ? {
        left: `${layout.value.left}px`,
        top: '0px',
        right: 'auto',
        bottom: 'auto',
        width: `${layout.value.boxWidth}px`,
        height: `${layout.value.boxHeight}px`
      }
    : undefined
);

let cleanups: (() => void)[] = [];

onMounted(() => {
  const el = root.value;
  if (!el) return;
  let cancelled = false;
  const update = () => {
    const width = el.clientWidth;
    if (cancelled || !width) return;
    const top = el.parentElement?.querySelector('.ln-footer-top');
    const inset = top ? parseFloat(getComputedStyle(top).paddingLeft) || 0 : 0;
    const word = measureWord();
    const font = Math.max(24, (width - inset * 2) / (word.left + word.right));
    const glyph = font * (word.ascent + word.descent);
    const above = Math.max(36, glyph * 0.46);
    const boxWidth = (font * word.advance) / CAP;
    const boxHeight = above * 2 + glyph;
    cellSize.value = Math.min(9, Math.max(3, Math.round(width / 135)));
    layout.value = {
      font,
      above,
      fade: above + glyph * FADE,
      boxWidth,
      boxHeight,
      left: (width - boxWidth) / 2,
      height: above + glyph * SHOWN,
      x: boxWidth / 2 + ((word.left - word.right) * font) / 2,
      y: boxHeight / 2 + ((word.ascent - word.descent) * font) / 2
    };
  };
  const resize = new ResizeObserver(update);
  resize.observe(el);
  document.fonts.ready.then(update);
  cleanups.push(() => {
    cancelled = true;
    resize.disconnect();
  });

  const pointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const updateCaps = () => {
    capabilities.value = {
      gpu: Boolean(window.isSecureContext && (navigator as Navigator & { gpu?: unknown }).gpu),
      fine: pointer.matches,
      reduced: motion.matches
    };
  };
  const updateVisibility = () => {
    pageVisible.value = !document.hidden;
  };
  updateCaps();
  updateVisibility();
  pointer.addEventListener('change', updateCaps);
  motion.addEventListener('change', updateCaps);
  document.addEventListener('visibilitychange', updateVisibility);
  cleanups.push(() => {
    pointer.removeEventListener('change', updateCaps);
    motion.removeEventListener('change', updateCaps);
    document.removeEventListener('visibilitychange', updateVisibility);
  });

  if (typeof IntersectionObserver !== 'undefined') {
    const preload = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        near.value = true;
        preload.disconnect();
      },
      { rootMargin: '120px' }
    );
    const visibility = new IntersectionObserver(([entry]) => {
      visible.value = entry.isIntersecting;
    });
    preload.observe(el);
    visibility.observe(el);
    cleanups.push(() => {
      preload.disconnect();
      visibility.disconnect();
    });
  }
});

let loadCancelled = false;
watch([near, eligible], () => {
  if (!near.value || !eligible.value || LiveWaves.value) return;
  loadCancelled = false;
  import('@/content/Backgrounds/ShapeWaves/ShapeWaves.vue')
    .then(module => {
      if (!loadCancelled) setLiveWaves(module.default as Component);
    })
    .catch(() => {
      if (!loadCancelled) failed.value = true;
    });
});

onBeforeUnmount(() => {
  loadCancelled = true;
  cleanups.forEach(fn => fn());
  cleanups = [];
});
</script>

<template>
  <div
    ref="root"
    class="ln-footer-art"
    aria-hidden="true"
    :style="layout ? { height: `${layout.height}px`, '--art-fade': `${layout.fade}px` } : undefined"
  >
    <svg class="ln-footer-art-fallback" width="100%" height="100%" focusable="false" :style="box">
      <defs>
        <pattern
          :id="`${id}-shapes`"
          width="36"
          height="36"
          patternUnits="userSpaceOnUse"
          :patternTransform="`scale(${cellSize / 9})`"
        >
          <g fill="currentColor">
            <template v-for="item in shapes" :key="item.index">
              <circle v-if="item.shape === 0" :cx="item.x" :cy="item.y" r="2.8" :opacity="item.opacity" />
              <rect
                v-else-if="item.shape === 1"
                :x="item.x - 2.5"
                :y="item.y - 2.5"
                width="5"
                height="5"
                :opacity="item.opacity"
              />
              <path v-else :d="`M${item.x} ${item.y - 3}l3 5.5h-6z`" :opacity="item.opacity" />
            </template>
          </g>
        </pattern>
        <mask :id="`${id}-mask`">
          <rect width="100%" height="100%" fill="white" />
          <text
            v-if="layout"
            :x="layout.x"
            :y="layout.y"
            text-anchor="middle"
            fill="black"
            :font-family="FONT"
            font-weight="600"
            :font-size="layout.font"
          >
            {{ WORD }}
          </text>
        </mask>
      </defs>
      <g fill="currentColor">
        <rect width="100%" height="100%" :fill="`url(#${id}-shapes)`" :mask="`url(#${id}-mask)`" />
      </g>
    </svg>
    <div v-if="eligible && visible && LiveWaves && layout" class="ln-footer-art-live" :style="box">
      <component
        :is="LiveWaves"
        :text="WORD"
        :font-family="FONT"
        :font-weight="600"
        :text-size="2"
        shapes="mixed"
        :cell-size="cellSize"
        :dot-size="0.72"
        :scale="1.2"
        :fade="0"
        :color="color"
        :hover-color="hoverColor"
        :background-color="backgroundColor"
        :speed="0"
        :flow="0"
        :glow="0"
        :intro="false"
        :paused="!visible || !pageVisible"
        :interactive="visible && pageVisible && capabilities.fine && !capabilities.reduced"
        @error="handleError"
      />
    </div>
  </div>
</template>
