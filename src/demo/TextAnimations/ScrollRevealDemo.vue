<template>
  <TabbedLayout>
    <template #preview>
      <div ref="containerRef" class="demo-container overflow-y-auto h-[600px]" @wheel="smoothScroll">
        <div class="scroll-instruction">Scroll Down</div>

        <div class="scroll-content">
          <ScrollReveal
            :children="scrollText"
            :enable-blur="enableBlur"
            :base-opacity="baseOpacity"
            :base-rotation="baseRotation"
            :blur-strength="blurStrength"
            :container-class-name="containerClassName"
            :text-class-name="textClassName"
            :rotation-end="rotationEnd"
            :word-animation-end="wordAnimationEnd"
            :scroll-container-ref="{ current: containerRef }"
            :key="rerenderKey"
          />
        </div>
      </div>

      <Customize>
        <PreviewSwitch title="Enable Blur" v-model="enableBlur" />
        <PreviewSlider title="Base Opacity:" v-model="baseOpacity" :min="0" :max="1" :step="0.1" value-unit="" />
        <PreviewSlider title="Base Rotation:" v-model="baseRotation" :min="0" :max="10" :step="0.5" value-unit="deg" />
        <PreviewSlider title="Blur Strength:" v-model="blurStrength" :min="0" :max="10" :step="0.5" value-unit="px" />
      </Customize>

      <PropTable :data="propData" />
    </template>

    <template #code>
      <CodeExample :code-object="scrollRevealCode" />
    </template>

    <template #cli>
      <CliInstallation :command="scrollRevealCode.cli" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, useTemplateRef } from 'vue';
import { gsap } from 'gsap';
import TabbedLayout from '../../components/common/TabbedLayout.vue';
import PropTable from '../../components/common/PropTable.vue';
import CliInstallation from '../../components/code/CliInstallation.vue';
import CodeExample from '../../components/code/CodeExample.vue';
import Customize from '../../components/common/Customize.vue';
import ScrollReveal from '../../content/TextAnimations/ScrollReveal/ScrollReveal.vue';
import PreviewSlider from '../../components/common/PreviewSlider.vue';
import PreviewSwitch from '../../components/common/PreviewSwitch.vue';
import { scrollRevealCode } from '@/constants/code/TextAnimations/scrollRevealCode';
import { useForceRerender } from '@/composables/useForceRerender';

const containerRef = useTemplateRef<HTMLElement>('containerRef');
const scrollText = ref(
  'When does a man die? When he is hit by a bullet? No! When he suffers a disease? No! When he ate a soup made out of a poisonous mushroom? No! A man dies when he is forgotten!'
);
const enableBlur = ref(true);
const baseOpacity = ref(0.1);
const baseRotation = ref(3);
const blurStrength = ref(4);
const containerClassName = ref('');
const textClassName = ref('');
const rotationEnd = ref('bottom bottom');
const wordAnimationEnd = ref('bottom bottom');

const { rerenderKey, forceRerender } = useForceRerender();

const smoothScroll = (e: WheelEvent) => {
  e.preventDefault();
  const container = containerRef.value;
  if (!container) return;
  const delta = e.deltaY || e.detail;
  const scrollAmount = delta * 2;

  gsap.to(container, {
    scrollTop: container.scrollTop + scrollAmount,
    duration: 2,
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

watch(
  () => enableBlur.value,
  () => {
    forceRerender();
  }
);

const propData = [
  {
    name: 'children',
    type: 'string',
    default: '""',
    description: 'The text content to be animated word by word'
  },
  {
    name: 'scrollContainerRef',
    type: 'object',
    default: 'undefined',
    description: 'Ref to a custom scroll container (defaults to window)'
  },
  {
    name: 'enableBlur',
    type: 'boolean',
    default: 'true',
    description: 'Whether to enable blur animation'
  },
  {
    name: 'baseOpacity',
    type: 'number',
    default: '0.1',
    description: 'Starting opacity value for words'
  },
  {
    name: 'baseRotation',
    type: 'number',
    default: '3',
    description: 'Starting rotation value in degrees'
  },
  {
    name: 'blurStrength',
    type: 'number',
    default: '4',
    description: 'Blur strength in pixels'
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
    name: 'rotationEnd',
    type: 'string',
    default: '"bottom bottom"',
    description: 'ScrollTrigger end position for rotation animation'
  },
  {
    name: 'wordAnimationEnd',
    type: 'string',
    default: '"bottom bottom"',
    description: 'ScrollTrigger end position for word animations'
  }
];
</script>

<style scoped>
.scroll-content {
  padding: 150vh 2em 50vh 2em;
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
