<script setup lang="ts">
import { ref, onMounted, onUnmounted, useTemplateRef } from 'vue';
import { Motion } from 'motion-v';

interface TextCursorProps {
  text?: string;
  delay?: number;
  spacing?: number;
  followMouseDirection?: boolean;
  randomFloat?: boolean;
  exitDuration?: number;
  removalInterval?: number;
  maxPoints?: number;
}

interface TrailItem {
  id: number;
  x: number;
  y: number;
  angle: number;
  randomX?: number;
  randomY?: number;
  randomRotate?: number;
}

const props = withDefaults(defineProps<TextCursorProps>(), {
  text: '⚛️',
  delay: 0.01,
  spacing: 100,
  followMouseDirection: true,
  randomFloat: true,
  exitDuration: 0.5,
  removalInterval: 30,
  maxPoints: 5
});

const containerRef = useTemplateRef<HTMLDivElement>('containerRef');
const trail = ref<TrailItem[]>([]);
const lastMoveTime = ref(Date.now());
const idCounter = ref(0);

let removalIntervalId: ReturnType<typeof setInterval> | null = null;

const handleMouseMove = (e: MouseEvent) => {
  if (!containerRef.value) return;

  const rect = containerRef.value.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  let newTrail = [...trail.value];

  if (newTrail.length === 0) {
    newTrail.push({
      id: idCounter.value++,
      x: mouseX,
      y: mouseY,
      angle: 0,
      ...(props.randomFloat && {
        randomX: Math.random() * 10 - 5,
        randomY: Math.random() * 10 - 5,
        randomRotate: Math.random() * 10 - 5
      })
    });
  } else {
    const last = newTrail[newTrail.length - 1];
    const dx = mouseX - last.x;
    const dy = mouseY - last.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance >= props.spacing) {
      let rawAngle = (Math.atan2(dy, dx) * 180) / Math.PI;
      if (rawAngle > 90) rawAngle -= 180;
      else if (rawAngle < -90) rawAngle += 180;
      const computedAngle = props.followMouseDirection ? rawAngle : 0;
      const steps = Math.floor(distance / props.spacing);

      for (let i = 1; i <= steps; i++) {
        const t = (props.spacing * i) / distance;
        const newX = last.x + dx * t;
        const newY = last.y + dy * t;
        newTrail.push({
          id: idCounter.value++,
          x: newX,
          y: newY,
          angle: computedAngle,
          ...(props.randomFloat && {
            randomX: Math.random() * 10 - 5,
            randomY: Math.random() * 10 - 5,
            randomRotate: Math.random() * 10 - 5
          })
        });
      }
    }
  }

  if (newTrail.length > props.maxPoints) {
    newTrail = newTrail.slice(newTrail.length - props.maxPoints);
  }

  trail.value = newTrail;
  lastMoveTime.value = Date.now();
};

const startRemovalInterval = () => {
  if (removalIntervalId) {
    clearInterval(removalIntervalId);
  }

  removalIntervalId = setInterval(() => {
    if (Date.now() - lastMoveTime.value > 100) {
      if (trail.value.length > 0) {
        trail.value = trail.value.slice(1);
      }
    }
  }, props.removalInterval);
};

onMounted(() => {
  if (containerRef.value) {
    containerRef.value.addEventListener('mousemove', handleMouseMove);
    startRemovalInterval();
  }
});

onUnmounted(() => {
  if (containerRef.value) {
    containerRef.value.removeEventListener('mousemove', handleMouseMove);
  }
  if (removalIntervalId) {
    clearInterval(removalIntervalId);
  }
});
</script>

<template>
  <div ref="containerRef" class="relative w-full h-full">
    <div class="absolute inset-0 pointer-events-none">
      <Motion
        v-for="item in trail"
        :key="item.id"
        :initial="{ opacity: 0, scale: 1, rotate: item.angle }"
        :animate="{
          opacity: 1,
          scale: 1,
          x: props.randomFloat ? [0, item.randomX || 0, 0] : 0,
          y: props.randomFloat ? [0, item.randomY || 0, 0] : 0,
          rotate: props.randomFloat ? [item.angle, item.angle + (item.randomRotate || 0), item.angle] : item.angle
        }"
        :transition="{
          duration: props.randomFloat ? 2 : props.exitDuration,
          repeat: props.randomFloat ? Infinity : 0,
          repeatType: props.randomFloat ? 'mirror' : 'loop'
        }"
        class="absolute text-3xl whitespace-nowrap select-none"
        :style="{ left: `${item.x}px`, top: `${item.y}px` }"
      >
        {{ props.text }}
      </Motion>
    </div>
  </div>
</template>

<style scoped>
.trail-enter-active,
.trail-leave-active {
  transition: all 0.5s ease;
}

.trail-enter-from {
  opacity: 0;
  transform: scale(0);
}

.trail-leave-to {
  opacity: 0;
  transform: scale(0);
}
</style>
