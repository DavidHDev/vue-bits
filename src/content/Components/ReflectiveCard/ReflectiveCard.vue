<template>
  <div
    class="relative w-[320px] h-[500px] rounded-[20px] overflow-hidden bg-[#1a1a1a] isolate font-sans"
    :class="className"
    :style="[cardStyle, style]"
  >
    <svg class="absolute w-0 h-0 pointer-events-none opacity-0" aria-hidden="true">
      <defs>
        <filter id="metallic-displacement" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="turbulence" :baseFrequency="baseFrequency" numOctaves="2" result="noise" />
          <feColorMatrix in="noise" type="luminanceToAlpha" result="noiseAlpha" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            :scale="displacementStrength"
            xChannelSelector="R"
            yChannelSelector="G"
            result="rippled"
          />
          <feSpecularLighting
            in="noiseAlpha"
            :surfaceScale="displacementStrength"
            :specularConstant="specularConstant"
            specularExponent="20"
            lightingColor="#ffffff"
            result="light"
          >
            <fePointLight x="0" y="0" z="300" />
          </feSpecularLighting>
          <feComposite in="light" in2="rippled" operator="in" result="light-effect" />
          <feBlend in="light-effect" in2="rippled" mode="screen" result="metallic-result" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
            result="solidAlpha"
          />
          <feMorphology in="solidAlpha" operator="erode" radius="45" result="erodedAlpha" />
          <feGaussianBlur in="erodedAlpha" stdDeviation="10" result="blurredMap" />
          <feComponentTransfer in="blurredMap" result="glassMap">
            <feFuncA type="linear" slope="0.5" intercept="0" />
          </feComponentTransfer>
          <feDisplacementMap
            in="metallic-result"
            in2="glassMap"
            :scale="glassDistortion"
            xChannelSelector="A"
            yChannelSelector="A"
            result="final"
          />
        </filter>
      </defs>
    </svg>

    <video
      ref="videoRef"
      autoplay
      playsinline
      muted
      class="absolute inset-0 w-full h-full object-cover z-0 opacity-90 transition-[filter] duration-300"
      :style="videoStyle"
    />

    <div class="absolute inset-0 z-[1] pointer-events-none mix-blend-overlay" :style="noiseStyle" />
    <div class="absolute inset-0 z-[2] pointer-events-none mix-blend-overlay" :style="sheenStyle" />
    <div class="absolute inset-0 z-20 rounded-[20px] p-px pointer-events-none" :style="borderStyle" />

    <div class="relative z-10 h-full flex flex-col justify-between p-8" :style="contentStyle">
      <div class="flex justify-between items-center border-b border-white/20 pb-4">
        <div
          class="flex items-center gap-1.5 px-2 py-1 text-[10px] font-bold tracking-[0.1em] bg-white/10 rounded border border-white/20"
        >
          <Lock :size="14" class="opacity-80" />
          <span>SECURE ACCESS</span>
        </div>
        <Activity :size="20" class="opacity-80" />
      </div>

      <div class="flex-1 flex flex-col justify-end items-center text-center gap-6 mb-8">
        <div>
          <h2 class="m-0 mb-2 text-2xl font-bold tracking-[0.05em] drop-shadow-md">ALEXANDER DOE</h2>
          <p class="m-0 text-xs tracking-[0.2em] uppercase opacity-70">SENIOR DEVELOPER</p>
        </div>
      </div>

      <div class="flex justify-between items-end border-t border-white/20 pt-6">
        <div class="flex flex-col gap-1">
          <span class="text-[9px] tracking-[0.1em] opacity-60">ID NUMBER</span>
          <span class="font-mono text-sm tracking-[0.05em]">8901-2345-6789</span>
        </div>
        <Fingerprint :size="32" class="opacity-40" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, useTemplateRef } from 'vue';
import type { CSSProperties } from 'vue';
import { Lock, Activity, Fingerprint } from 'lucide-vue-next';

interface ReflectiveCardProps {
  blurStrength?: number;
  color?: string;
  metalness?: number;
  roughness?: number;
  overlayColor?: string;
  displacementStrength?: number;
  noiseScale?: number;
  specularConstant?: number;
  grayscale?: number;
  glassDistortion?: number;
  className?: string;
  style?: CSSProperties;
}

const {
  blurStrength = 12,
  color = 'white',
  metalness = 1,
  roughness = 0.4,
  overlayColor = 'rgba(255, 255, 255, 0.1)',
  displacementStrength = 20,
  noiseScale = 1,
  specularConstant = 1.2,
  grayscale = 1,
  glassDistortion = 0,
  className = '',
  style = {}
} = defineProps<ReflectiveCardProps>();

const videoRef = useTemplateRef<HTMLVideoElement>('videoRef');

const baseFrequency = computed(() => 0.03 / Math.max(0.1, noiseScale));
const saturation = computed(() => 1 - Math.max(0, Math.min(1, grayscale)));

const cardStyle = {
  boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1) inset'
};

const videoStyle = computed(() => ({
  transform: 'scale(1.2) scaleX(-1)',
  filter: `saturate(${saturation.value}) contrast(120%) brightness(110%) blur(${blurStrength}px) url(#metallic-displacement)`
}));

const noiseStyle = computed(() => ({
  opacity: roughness,
  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
}));

const sheenStyle = computed(() => ({
  opacity: metalness,
  background:
    'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 40%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.1) 60%, rgba(255,255,255,0.3) 100%)'
}));

const borderStyle = {
  background:
    'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.6) 100%)',
  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
  WebkitMaskComposite: 'xor',
  mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
  maskComposite: 'exclude'
};

const contentStyle = computed(() => ({
  color,
  background: overlayColor
}));

let stream: MediaStream | null = null;

const startWebcam = async () => {
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 640 },
        height: { ideal: 480 },
        facingMode: 'user'
      }
    });

    if (videoRef.value) {
      videoRef.value.muted = true;
      videoRef.value.srcObject = stream;
    }
  } catch (err) {
    console.error('Error accessing webcam:', err);
  }
};

onMounted(() => {
  startWebcam();
});

onUnmounted(() => {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }
});
</script>
