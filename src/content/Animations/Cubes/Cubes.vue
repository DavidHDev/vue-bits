<template>
  <div class="relative w-1/2 max-md:w-11/12 aspect-square" :style="wrapperStyle">
    <div ref="sceneRef" class="grid w-full h-full" :style="sceneStyle">
      <template v-for="(_, r) in cells" :key="`row-${r}`">
        <div
          v-for="(__, c) in cells"
          :key="`${r}-${c}`"
          class="relative w-full h-full aspect-square transform-3d cube"
          :data-row="r"
          :data-col="c"
        >
          <span class="absolute -inset-9 pointer-events-none" />

          <div
            class="absolute inset-0 flex justify-center items-center cube-face"
            :style="{
              background: 'var(--cube-face-bg)',
              border: 'var(--cube-face-border)',
              boxShadow: 'var(--cube-face-shadow)',
              transform: 'translateY(-50%) rotateX(90deg)'
            }"
          />

          <div
            class="absolute inset-0 flex justify-center items-center cube-face"
            :style="{
              background: 'var(--cube-face-bg)',
              border: 'var(--cube-face-border)',
              boxShadow: 'var(--cube-face-shadow)',
              transform: 'translateY(50%) rotateX(-90deg)'
            }"
          />

          <div
            class="absolute inset-0 flex justify-center items-center cube-face"
            :style="{
              background: 'var(--cube-face-bg)',
              border: 'var(--cube-face-border)',
              boxShadow: 'var(--cube-face-shadow)',
              transform: 'translateX(-50%) rotateY(-90deg)'
            }"
          />

          <div
            class="absolute inset-0 flex justify-center items-center cube-face"
            :style="{
              background: 'var(--cube-face-bg)',
              border: 'var(--cube-face-border)',
              boxShadow: 'var(--cube-face-shadow)',
              transform: 'translateX(50%) rotateY(90deg)'
            }"
          />

          <div
            class="absolute inset-0 flex justify-center items-center cube-face"
            :style="{
              background: 'var(--cube-face-bg)',
              border: 'var(--cube-face-border)',
              boxShadow: 'var(--cube-face-shadow)',
              transform: 'rotateY(-90deg) translateX(50%) rotateY(90deg)'
            }"
          />

          <div
            class="absolute inset-0 flex justify-center items-center cube-face"
            :style="{
              background: 'var(--cube-face-bg)',
              border: 'var(--cube-face-border)',
              boxShadow: 'var(--cube-face-shadow)',
              transform: 'rotateY(90deg) translateX(-50%) rotateY(-90deg)'
            }"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, useTemplateRef } from 'vue';
import gsap from 'gsap';

interface Gap {
  row: number;
  col: number;
}

interface Duration {
  enter: number;
  leave: number;
}

interface Props {
  gridSize?: number;
  cubeSize?: number;
  maxAngle?: number;
  radius?: number;
  easing?: gsap.EaseString;
  duration?: Duration;
  cellGap?: number | Gap;
  borderStyle?: string;
  faceColor?: string;
  shadow?: boolean | string;
  autoAnimate?: boolean;
  rippleOnClick?: boolean;
  rippleColor?: string;
  rippleSpeed?: number;
}

const props = withDefaults(defineProps<Props>(), {
  gridSize: 10,
  maxAngle: 45,
  radius: 3,
  easing: 'power3.out',
  duration: () => ({ enter: 0.3, leave: 0.6 }),
  borderStyle: '1px solid #fff',
  faceColor: '#0b0b0b',
  shadow: false,
  autoAnimate: true,
  rippleOnClick: true,
  rippleColor: '#fff',
  rippleSpeed: 2
});

const sceneRef = useTemplateRef<HTMLDivElement>('sceneRef');
const rafRef = ref<number | null>(null);
const idleTimerRef = ref<ReturnType<typeof setTimeout> | null>(null);
const userActiveRef = ref(false);
const simPosRef = ref<{ x: number; y: number }>({ x: 0, y: 0 });
const simTargetRef = ref<{ x: number; y: number }>({ x: 0, y: 0 });
const simRAFRef = ref<number | null>(null);

const colGap = computed(() => {
  return typeof props.cellGap === 'number'
    ? `${props.cellGap}px`
    : (props.cellGap as Gap)?.col !== undefined
      ? `${(props.cellGap as Gap).col}px`
      : '5%';
});

const rowGap = computed(() => {
  return typeof props.cellGap === 'number'
    ? `${props.cellGap}px`
    : (props.cellGap as Gap)?.row !== undefined
      ? `${(props.cellGap as Gap).row}px`
      : '5%';
});

const enterDur = computed(() => props.duration.enter);
const leaveDur = computed(() => props.duration.leave);

const cells = computed(() => Array.from({ length: props.gridSize }));

const sceneStyle = computed(() => ({
  gridTemplateColumns: props.cubeSize
    ? `repeat(${props.gridSize}, ${props.cubeSize}px)`
    : `repeat(${props.gridSize}, 1fr)`,
  gridTemplateRows: props.cubeSize
    ? `repeat(${props.gridSize}, ${props.cubeSize}px)`
    : `repeat(${props.gridSize}, 1fr)`,
  columnGap: colGap.value,
  rowGap: rowGap.value,
  perspective: '99999999px',
  gridAutoRows: '1fr'
}));

const wrapperStyle = computed(() => ({
  '--cube-face-border': props.borderStyle,
  '--cube-face-bg': props.faceColor,
  '--cube-face-shadow': props.shadow === true ? '0 0 6px rgba(0,0,0,.5)' : props.shadow || 'none',
  ...(props.cubeSize
    ? {
        width: `${props.gridSize * props.cubeSize}px`,
        height: `${props.gridSize * props.cubeSize}px`
      }
    : {})
}));

const tiltAt = (rowCenter: number, colCenter: number) => {
  if (!sceneRef.value) return;

  sceneRef.value.querySelectorAll<HTMLDivElement>('.cube').forEach(cube => {
    const r = +cube.dataset.row!;
    const c = +cube.dataset.col!;
    const dist = Math.hypot(r - rowCenter, c - colCenter);

    if (dist <= props.radius) {
      const pct = 1 - dist / props.radius;
      const angle = pct * props.maxAngle;
      gsap.to(cube, {
        duration: enterDur.value,
        ease: props.easing,
        overwrite: true,
        rotateX: -angle,
        rotateY: angle
      });
    } else {
      gsap.to(cube, {
        duration: leaveDur.value,
        ease: 'power3.out',
        overwrite: true,
        rotateX: 0,
        rotateY: 0
      });
    }
  });
};

const onPointerMove = (e: PointerEvent) => {
  userActiveRef.value = true;
  if (idleTimerRef.value) clearTimeout(idleTimerRef.value);

  const rect = sceneRef.value!.getBoundingClientRect();
  const cellW = rect.width / props.gridSize;
  const cellH = rect.height / props.gridSize;
  const colCenter = (e.clientX - rect.left) / cellW;
  const rowCenter = (e.clientY - rect.top) / cellH;

  if (rafRef.value) cancelAnimationFrame(rafRef.value);
  rafRef.value = requestAnimationFrame(() => tiltAt(rowCenter, colCenter));

  idleTimerRef.value = setTimeout(() => {
    userActiveRef.value = false;
  }, 3000);
};

const resetAll = () => {
  if (!sceneRef.value) return;
  sceneRef.value.querySelectorAll<HTMLDivElement>('.cube').forEach(cube =>
    gsap.to(cube, {
      duration: leaveDur.value,
      rotateX: 0,
      rotateY: 0,
      ease: 'power3.out'
    })
  );
};

const onClick = (e: MouseEvent) => {
  if (!props.rippleOnClick || !sceneRef.value) return;

  const rect = sceneRef.value.getBoundingClientRect();
  const cellW = rect.width / props.gridSize;
  const cellH = rect.height / props.gridSize;
  const colHit = Math.floor((e.clientX - rect.left) / cellW);
  const rowHit = Math.floor((e.clientY - rect.top) / cellH);

  const baseRingDelay = 0.15;
  const baseAnimDur = 0.3;
  const baseHold = 0.6;

  const spreadDelay = baseRingDelay / props.rippleSpeed;
  const animDuration = baseAnimDur / props.rippleSpeed;
  const holdTime = baseHold / props.rippleSpeed;

  const rings: Record<number, HTMLDivElement[]> = {};
  sceneRef.value.querySelectorAll<HTMLDivElement>('.cube').forEach(cube => {
    const r = +cube.dataset.row!;
    const c = +cube.dataset.col!;
    const dist = Math.hypot(r - rowHit, c - colHit);
    const ring = Math.round(dist);
    if (!rings[ring]) rings[ring] = [];
    rings[ring].push(cube);
  });

  Object.keys(rings)
    .map(Number)
    .sort((a, b) => a - b)
    .forEach(ring => {
      const delay = ring * spreadDelay;
      const faces = rings[ring].flatMap(cube => Array.from(cube.querySelectorAll<HTMLElement>('.cube-face')));

      gsap.to(faces, {
        backgroundColor: props.rippleColor,
        duration: animDuration,
        delay,
        ease: 'power3.out'
      });
      gsap.to(faces, {
        backgroundColor: props.faceColor,
        duration: animDuration,
        delay: delay + animDuration + holdTime,
        ease: 'power3.out'
      });
    });
};

const startAutoAnimation = () => {
  if (!props.autoAnimate || !sceneRef.value) return;

  simPosRef.value = {
    x: Math.random() * props.gridSize,
    y: Math.random() * props.gridSize
  };
  simTargetRef.value = {
    x: Math.random() * props.gridSize,
    y: Math.random() * props.gridSize
  };

  const speed = 0.02;
  const loop = () => {
    if (!userActiveRef.value) {
      const pos = simPosRef.value;
      const tgt = simTargetRef.value;
      pos.x += (tgt.x - pos.x) * speed;
      pos.y += (tgt.y - pos.y) * speed;
      tiltAt(pos.y, pos.x);

      if (Math.hypot(pos.x - tgt.x, pos.y - tgt.y) < 0.1) {
        simTargetRef.value = {
          x: Math.random() * props.gridSize,
          y: Math.random() * props.gridSize
        };
      }
    }
    simRAFRef.value = requestAnimationFrame(loop);
  };
  simRAFRef.value = requestAnimationFrame(loop);
};

onMounted(() => {
  const el = sceneRef.value;
  if (!el) return;

  el.addEventListener('pointermove', onPointerMove);
  el.addEventListener('pointerleave', resetAll);
  el.addEventListener('click', onClick);

  startAutoAnimation();
});

onUnmounted(() => {
  const el = sceneRef.value;
  if (el) {
    el.removeEventListener('pointermove', onPointerMove);
    el.removeEventListener('pointerleave', resetAll);
    el.removeEventListener('click', onClick);
  }

  if (rafRef.value !== null) cancelAnimationFrame(rafRef.value);
  if (idleTimerRef.value !== null) clearTimeout(idleTimerRef.value);
  if (simRAFRef.value !== null) cancelAnimationFrame(simRAFRef.value);
});
</script>
