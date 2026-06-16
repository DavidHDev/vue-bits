import code from '@/content/Animations/LaserFlow/LaserFlow.vue?raw';
import { createCodeObject } from '@/types/code';

export const laserFlow = createCodeObject(code, 'Animations/LaserFlow', {
  installation: `npm install three`,
  usage: `<template>
  <div
    :style="{
      height: '800px',
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: '#120F17'
    }"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
  >
    <LaserFlow
      :horizontal-beam-offset="0.1"
      :vertical-beam-offset="0.0"
      color="#FF79C6"
    />

    <div
      :style="{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '86%',
        height: '60%',
        backgroundColor: '#120F17',
        borderRadius: '20px',
        border: '2px solid #FF79C6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '2rem',
        zIndex: 6
      }"
    >
      <!-- Your content here -->
    </div>

    <img
      ref="revealImgRef"
      src="/path/to/image.jpg"
      alt="Reveal effect"
      :style="{
        position: 'absolute',
        width: '100%',
        top: '-50%',
        zIndex: 5,
        mixBlendMode: 'lighten',
        opacity: 0.3,
        pointerEvents: 'none',
        '--mx': '-9999px',
        '--my': '-9999px',
        WebkitMaskImage:
          'radial-gradient(circle at var(--mx) var(--my), rgba(255,255,255,1) 0px, rgba(255,255,255,0.95) 60px, rgba(255,255,255,0.6) 120px, rgba(255,255,255,0.25) 180px, rgba(255,255,255,0) 240px)',
        maskImage:
          'radial-gradient(circle at var(--mx) var(--my), rgba(255,255,255,1) 0px, rgba(255,255,255,0.95) 60px, rgba(255,255,255,0.6) 120px, rgba(255,255,255,0.25) 180px, rgba(255,255,255,0) 240px)',
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat'
      }"
    />
  </div>
</template>

<script setup lang="ts">
import { useTemplateRef } from 'vue'
import LaserFlow from './LaserFlow.vue'

const revealImgRef = useTemplateRef<HTMLImageElement>('revealImgRef')

const handleMouseMove = (e: MouseEvent) => {
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()

  const x = e.clientX - rect.left
  const y = e.clientY - rect.top

  const el = revealImgRef.value

  if (el) {
    el.style.setProperty('--mx', x + 'px')
    el.style.setProperty('--my', y + rect.height * 0.5 + 'px')
  }
}

const handleMouseLeave = () => {
  const el = revealImgRef.value

  if (el) {
    el.style.setProperty('--mx', '-9999px')
    el.style.setProperty('--my', '-9999px')
  }
}
</script>`
});
