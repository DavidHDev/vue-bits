<template>
  <TabbedLayout>
    <template #preview>
      <div ref="containerRef" class="demo-container overflow-y-auto h-[600px]" @wheel="smoothScroll">
        <div class="scroll-instruction">Scroll Down</div>

        <div class="scroll-content">
          <ScrollFloat
            :children="scrollText"
            :animation-duration="animationDuration"
            :ease="ease"
            :scroll-start="scrollStart"
            :scroll-end="scrollEnd"
            :stagger="stagger"
            :container-class-name="containerClassName"
            :text-class-name="textClassName"
            :scroll-container-ref="{ current: containerRef }"
            :key="rerenderKey"
          />
        </div>
      </div>

      <Customize>
        <PreviewSlider title="Stagger:" v-model="stagger" :min="0.01" :max="0.1" :step="0.01" value-unit="s" />

        <PreviewSlider
          title="Animation Duration:"
          v-model="animationDuration"
          :min="1"
          :max="10"
          :step="0.1"
          value-unit="s"
        />
      </Customize>

      <PropTable :data="propData" />
    </template>

    <template #code>
      <CodeExample :code-object="scrollFloatCode" />
    </template>

    <template #cli>
      <CliInstallation :command="scrollFloatCode.cli" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, useTemplateRef } from 'vue';
import { gsap } from 'gsap';
import TabbedLayout from '../../components/common/TabbedLayout.vue';
import PropTable from '../../components/common/PropTable.vue';
import CliInstallation from '../../components/code/CliInstallation.vue';
import CodeExample from '../../components/code/CodeExample.vue';
import Customize from '../../components/common/Customize.vue';
import ScrollFloat from '../../content/TextAnimations/ScrollFloat/ScrollFloat.vue';
import PreviewSlider from '../../components/common/PreviewSlider.vue';
import { scrollFloatCode } from '@/constants/code/TextAnimations/scrollFloatCode';

const containerRef = useTemplateRef<HTMLElement>('containerRef');
const scrollText = ref('Vue Bits!');
const animationDuration = ref(1);
const ease = ref('back.inOut(2)');
const scrollStart = ref('center bottom+=50%');
const scrollEnd = ref('bottom bottom-=40%');
const stagger = ref(0.03);
const containerClassName = ref('');
const textClassName = ref('');
const rerenderKey = ref(0);

const smoothScroll = (e: WheelEvent) => {
  e.preventDefault();
  const container = containerRef.value;
  if (!container) return;

  const delta = e.deltaY || e.detail;
  const scrollAmount = delta * 2;

  gsap.to(container, {
    scrollTop: container.scrollTop + scrollAmount,
    duration: 1,
    ease: 'power3.out',
    overwrite: 'auto'
  });
};

onMounted(() => {
  const container = containerRef.value;
  if (container) {
    container.addEventListener('wheel', smoothScroll, { passive: false });
  }
});

onUnmounted(() => {
  const container = containerRef.value;
  if (container) {
    container.removeEventListener('wheel', smoothScroll);
  }
});

const propData = [
  {
    name: 'children',
    type: 'string',
    default: '""',
    description: 'The text content to be animated character by character'
  },
  {
    name: 'scrollContainerRef',
    type: 'object',
    default: 'undefined',
    description: 'Ref to a custom scroll container (defaults to window)'
  },
  {
    name: 'containerClassName',
    type: 'string',
    default: '""',
    description: 'Additional CSS classes for the container element'
  },
  {
    name: 'textClassName',
    type: 'string',
    default: '""',
    description: 'Additional CSS classes for the text element'
  },
  {
    name: 'animationDuration',
    type: 'number',
    default: '1',
    description: 'Duration of the animation in seconds'
  },
  {
    name: 'ease',
    type: 'string',
    default: '"back.inOut(2)"',
    description: 'GSAP easing function for the animation'
  },
  {
    name: 'scrollStart',
    type: 'string',
    default: '"center bottom+=50%"',
    description: 'ScrollTrigger start position'
  },
  {
    name: 'scrollEnd',
    type: 'string',
    default: '"bottom bottom-=40%"',
    description: 'ScrollTrigger end position'
  },
  {
    name: 'stagger',
    type: 'number',
    default: '0.03',
    description: 'Delay between each character animation'
  }
];
</script>

<style scoped>
.scroll-content {
  padding-top: 150vh !important;
  padding-bottom: 50vh;
}

.scroll-instruction {
  text-align: center;
  color: #222;
  font-size: clamp(4rem, 6vw, 4rem);
  font-weight: 900;
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  transform: translateY(-50%);
}

.scroll-content {
  color: aliceblue;
}
</style>
