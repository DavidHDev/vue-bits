import code from '@/content/Animations/LaserFlow/LaserFlow.vue?raw';
import { createCodeObject } from '@/types/code';

export const laserFlow = createCodeObject(code, 'Animations/LaserFlow', {
  installation: `npm install three`,
  usage: `<template>
  <div
    style="height: 800px; position: relative; overflow: hidden; background-color: #060010;"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
  >
    <LaserFlow
      :horizontalBeamOffset="0.1"
      :verticalBeamOffset="0.0"
      color="#FF79C6"
    />

    <div
      style="
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translateX(-50%);
        width: 86%;
        height: 60%;
        background-color: #060010;
        border-radius: 20px;
        border: 2px solid #FF79C6;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 2rem;
        z-index: 6;
      "
    >
      <!-- Your content here -->
      Example Box Content
    </div>

    <img
      ref="revealImgRef"
      src="/path/to/image.jpg"
      alt="Reveal effect"
      style="
        position: absolute;
        width: 100%;
        top: -50%;
        z-index: 5;
        mix-blend-mode: lighten;
        opacity: 0.3;
        pointer-events: none;
        --mx: -9999px;
        --my: -9999px;
        -webkit-mask-image: radial-gradient(circle at var(--mx) var(--my),
          rgba(255,255,255,1) 0px,
          rgba(255,255,255,0.95) 60px,
          rgba(255,255,255,0.6) 120px,
          rgba(255,255,255,0.25) 180px,
          rgba(255,255,255,0) 240px);
        mask-image: radial-gradient(circle at var(--mx) var(--my),
          rgba(255,255,255,1) 0px,
          rgba(255,255,255,0.95) 60px,
          rgba(255,255,255,0.6) 120px,
          rgba(255,255,255,0.25) 180px,
          rgba(255,255,255,0) 240px);
        -webkit-mask-repeat: no-repeat;
        mask-repeat: no-repeat;
      "
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import LaserFlow from './LaserFlow.vue'

const revealImgRef = useTemplateRef('revealImgRef')

function handleMouseMove(e) {
  const rect = e.currentTarget.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  const el = revealImgRef.value
  if (el) {
    el.style.setProperty('--mx', '\${x}px')
    el.style.setProperty('--my', '\${y + rect.height * 0.5}px')
  }
}

function handleMouseLeave() {
  const el = revealImgRef.value
  if (el) {
    el.style.setProperty('--mx', '-9999px')
    el.style.setProperty('--my', '-9999px')
  }
}
</script>`
});
