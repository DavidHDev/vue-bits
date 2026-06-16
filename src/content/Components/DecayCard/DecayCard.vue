<template>
  <div ref="svgRef" class="relative" :style="{ width: `${width}px`, height: `${height}px` }">
    <svg
      viewBox="-60 -75 720 900"
      preserveAspectRatio="xMidYMid slice"
      class="block relative w-full h-full [will-change:transform]"
    >
      <filter id="imgFilter">
        <feTurbulence
          type="turbulence"
          :baseFrequency="baseFrequency"
          :numOctaves="numOctaves"
          :seed="seed"
          stitchTiles="stitch"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          result="turbulence1"
        />
        <feDisplacementMap
          ref="displacementMapRef"
          in="SourceGraphic"
          in2="turbulence1"
          scale="0"
          xChannelSelector="R"
          yChannelSelector="B"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          result="displacementMap3"
        />
      </filter>
      <g>
        <image
          :href="image"
          x="0"
          y="0"
          width="600"
          height="750"
          filter="url(#imgFilter)"
          preserveAspectRatio="xMidYMid slice"
        />
      </g>
    </svg>
    <div
      class="bottom-[1.2em] left-[1em] absolute font-black text-[2.5rem] first-line:text-[4rem] leading-[1.5em] tracking-[-0.5px]"
    >
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { gsap } from 'gsap';
import { onMounted, onUnmounted, useTemplateRef } from 'vue';

interface Props {
  width?: number;
  height?: number;
  image?: string;
  baseFrequency?: number;
  numOctaves?: number;
  seed?: number;
  maxDisplacement?: number;
  movementBound?: number;
}

const props = withDefaults(defineProps<Props>(), {
  width: 300,
  height: 400,
  image: 'https://picsum.photos/300/400?grayscale',
  baseFrequency: 0.015,
  numOctaves: 5,
  seed: 4,
  maxDisplacement: 400,
  movementBound: 50
});

const svgRef = useTemplateRef<HTMLDivElement>('svgRef');
const displacementMapRef = useTemplateRef<SVGFEDisplacementMapElement>('displacementMapRef');

const cursor = {
  x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0,
  y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0
};
const cachedCursor = { ...cursor };
const winsize = {
  width: typeof window !== 'undefined' ? window.innerWidth : 0,
  height: typeof window !== 'undefined' ? window.innerHeight : 0
};

let animationFrameId: number | null = null;

const lerp = (a: number, b: number, n: number): number => (1 - n) * a + n * b;
const map = (x: number, a: number, b: number, c: number, d: number): number => ((x - a) * (d - c)) / (b - a) + c;
const distance = (x1: number, x2: number, y1: number, y2: number): number => Math.hypot(x1 - x2, y1 - y2);

const handleResize = (): void => {
  winsize.width = window.innerWidth;
  winsize.height = window.innerHeight;
};

const handleMouseMove = (ev: MouseEvent): void => {
  cursor.x = ev.clientX;
  cursor.y = ev.clientY;
};

const imgValues = {
  imgTransforms: { x: 0, y: 0, rz: 0 },
  displacementScale: 0
};

const render = () => {
  let targetX = lerp(imgValues.imgTransforms.x, map(cursor.x, 0, winsize.width, -120, 120), 0.1);
  let targetY = lerp(imgValues.imgTransforms.y, map(cursor.y, 0, winsize.height, -120, 120), 0.1);
  const targetRz = lerp(imgValues.imgTransforms.rz, map(cursor.x, 0, winsize.width, -10, 10), 0.1);

  if (targetX > props.movementBound) targetX = props.movementBound + (targetX - props.movementBound) * 0.2;
  if (targetX < -props.movementBound) targetX = -props.movementBound + (targetX + props.movementBound) * 0.2;
  if (targetY > props.movementBound) targetY = props.movementBound + (targetY - props.movementBound) * 0.2;
  if (targetY < -props.movementBound) targetY = -props.movementBound + (targetY + props.movementBound) * 0.2;

  imgValues.imgTransforms.x = targetX;
  imgValues.imgTransforms.y = targetY;
  imgValues.imgTransforms.rz = targetRz;

  if (svgRef.value) {
    gsap.set(svgRef.value, {
      x: imgValues.imgTransforms.x,
      y: imgValues.imgTransforms.y,
      rotateZ: imgValues.imgTransforms.rz
    });
  }

  const cursorTravelledDistance = distance(cachedCursor.x, cursor.x, cachedCursor.y, cursor.y);
  imgValues.displacementScale = lerp(
    imgValues.displacementScale,
    map(cursorTravelledDistance, 0, 200, 0, props.maxDisplacement),
    0.06
  );

  if (displacementMapRef.value) {
    gsap.set(displacementMapRef.value, {
      attr: { scale: imgValues.displacementScale }
    });
  }

  cachedCursor.x = cursor.x;
  cachedCursor.y = cursor.y;

  animationFrameId = requestAnimationFrame(render);
};

onMounted(() => {
  window.addEventListener('resize', handleResize);
  window.addEventListener('mousemove', handleMouseMove);
  animationFrameId = requestAnimationFrame(render);
});

onUnmounted(() => {
  if (animationFrameId !== null) cancelAnimationFrame(animationFrameId);
  window.removeEventListener('resize', handleResize);
  window.removeEventListener('mousemove', handleMouseMove);
});
</script>
