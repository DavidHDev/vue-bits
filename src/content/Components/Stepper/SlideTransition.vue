<template>
  <Motion
    ref="containerRef"
    tag="div"
    :custom="props.direction"
    :variants="stepVariants"
    initial="enter"
    animate="center"
    exit="exit"
    :transition="{ duration: 0.4 }"
    :style="{ position: 'absolute', left: 0, right: 0, top: 0 }"
  >
    <slot />
  </Motion>
</template>

<script setup lang="ts">
import { nextTick, watchEffect, useTemplateRef } from 'vue';
import { Motion } from 'motion-v'

interface SlideTransitionProps {
  direction: number
}

const props = defineProps<SlideTransitionProps>()
const emit = defineEmits<{
  heightReady: [height: number]
}>()

const containerRef = useTemplateRef<HTMLDivElement>('containerRef');

interface MotionInstance {
  $el?: HTMLElement
}

const stepVariants = {
  enter: (dir: number) => ({
    x: dir >= 0 ? "-100%" : "100%",
    opacity: 0,
  }),
  center: {
    x: "0%",
    opacity: 1,
  },
  exit: (dir: number) => ({
    x: dir >= 0 ? "50%" : "-50%",
    opacity: 0,
  }),
}

const reportHeight = () => {
  if (containerRef.value) {
    const motionInstance = containerRef.value as MotionInstance
    const element = motionInstance.$el || (containerRef.value as HTMLElement)
    const height = element.offsetHeight
    if (height && height > 0) {
      emit('heightReady', height)
    }
  }
}

watchEffect(() => {
  const container = containerRef.value

  nextTick(() => {
    if (container) {
      reportHeight()
    }
  })
})
</script>
