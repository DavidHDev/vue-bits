<template>
  <canvas
    ref="grainRef"
    class="top-0 left-0 absolute w-screen h-screen pointer-events-none"
    :style="{ imageRendering: 'pixelated' }"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';

interface NoiseProps {
  patternSize?: number;
  patternScaleX?: number;
  patternScaleY?: number;
  patternRefreshInterval?: number;
  patternAlpha?: number;
}

const props = withDefaults(defineProps<NoiseProps>(), {
  patternSize: 250,
  patternScaleX: 1,
  patternScaleY: 1,
  patternRefreshInterval: 2,
  patternAlpha: 15
});

const grainRef = ref<HTMLCanvasElement | null>(null);

let frame = 0;
let animationId: number;

const canvasSize = 1024;

const resize = () => {
  const canvas = grainRef.value;
  if (!canvas) return;

  canvas.width = canvasSize;
  canvas.height = canvasSize;

  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
};

const drawGrain = (ctx: CanvasRenderingContext2D) => {
  const imageData = ctx.createImageData(canvasSize, canvasSize);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const value = Math.random() * 255;
    data[i] = value;
    data[i + 1] = value;
    data[i + 2] = value;
    data[i + 3] = props.patternAlpha;
  }

  ctx.putImageData(imageData, 0, 0);
};

const startLoop = () => {
  const canvas = grainRef.value;
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  frame = 0;

  const loop = () => {
    if (frame % props.patternRefreshInterval === 0) {
      drawGrain(ctx);
    }
    frame++;
    animationId = window.requestAnimationFrame(loop);
  };

  resize();
  loop();
};

const stopLoop = () => {
  window.cancelAnimationFrame(animationId);
};

onMounted(() => {
  window.addEventListener('resize', resize);
  startLoop();
});

onUnmounted(() => {
  window.removeEventListener('resize', resize);
  stopLoop();
});

watch(
  () => [props.patternSize, props.patternScaleX, props.patternScaleY, props.patternRefreshInterval, props.patternAlpha],
  () => {
    stopLoop();
    startLoop();
  }
);
</script>
