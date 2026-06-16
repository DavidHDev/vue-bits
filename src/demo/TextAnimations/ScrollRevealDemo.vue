<template>
  <h1 class="sub-category">Scroll Reveal</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="scrollRevealCode.usage"
    :source="scrollRevealSource"
    component-name="ScrollReveal"
    :props-table="props"
  >
    <template #preview>
      <div ref="containerRef" class="relative h-[400px] overflow-y-auto demo-container" @wheel="smoothScroll">
        <div class="scroll-instruction">Scroll Down</div>

        <div class="scroll-content">
          <ScrollReveal
            :key="key"
            :scroll-container-ref="containerRef"
            :base-opacity="baseOpacity"
            :enable-blur="enableBlur"
            :base-rotation="baseRotation"
            :blur-strength="blurStrength"
          >
            When does a man die? When he is hit by a bullet? No! When he suffers a disease? No! When he ate a soup made
            out of a poisonous mushroom? No! A man dies when he is forgotten!
          </ScrollReveal>
        </div>
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSwitch title="Enable Blur" v-model="enableBlur" />
        <PreviewSlider title="Base Opacity" v-model="baseOpacity" :min="0" :max="1" :step="0.1" value-unit="" />
        <PreviewSlider title="Base Rotation" v-model="baseRotation" :min="0" :max="10" :step="0.5" value-unit="deg" />
        <PreviewSlider title="Blur Strength" v-model="blurStrength" :min="0" :max="10" :step="0.5" value-unit="px" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="scroll-reveal" :usage="scrollRevealCode.usage!" :source="scrollRevealSource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { scrollRevealCode } from '@/constants/code/TextAnimations/scrollRevealCode';
import ScrollReveal from '@/content/TextAnimations/ScrollReveal/ScrollReveal.vue';
import scrollRevealSource from '@/content/TextAnimations/ScrollReveal/ScrollReveal.vue?raw';
import { gsap } from 'gsap';
import { computed, onMounted, onUnmounted, ref, useTemplateRef, watch } from 'vue';

const { rerenderKey: key, forceRerender } = useForceRerender();

const DEFAULTS = {
  enableBlur: true,
  baseOpacity: 0.1,
  baseRotation: 3,
  blurStrength: 4
};

const containerRef = useTemplateRef<HTMLElement>('containerRef');
const enableBlur = ref(DEFAULTS.enableBlur);
const baseOpacity = ref(DEFAULTS.baseOpacity);
const baseRotation = ref(DEFAULTS.baseRotation);
const blurStrength = ref(DEFAULTS.blurStrength);

const hasChanges = computed(
  () =>
    enableBlur.value !== DEFAULTS.enableBlur ||
    baseOpacity.value !== DEFAULTS.baseOpacity ||
    baseRotation.value !== DEFAULTS.baseRotation ||
    blurStrength.value !== DEFAULTS.blurStrength
);

function reset() {
  enableBlur.value = DEFAULTS.enableBlur;
  baseOpacity.value = DEFAULTS.baseOpacity;
  baseRotation.value = DEFAULTS.baseRotation;
  blurStrength.value = DEFAULTS.blurStrength;
  forceRerender();
}

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

watch([enableBlur, baseOpacity, baseRotation, blurStrength], () => {
  containerRef.value?.scrollTo({ top: 0, behavior: 'smooth' });
  forceRerender();
});

const props: PropRow[] = [
  {
    name: 'children',
    type: 'slot',
    default: '—',
    description: 'The content to animate. If a string, it will be split into individual characters.'
  },
  {
    name: 'scrollContainerRef',
    type: 'Ref<HTMLElement | null> | HTMLElement | null',
    default: 'null',
    description: 'Optional ref to the scroll container. Defaults to window if not provided.'
  },
  {
    name: 'enableBlur',
    type: 'boolean',
    default: 'true',
    description: 'Enables the blur animation effect on the words.'
  },
  {
    name: 'baseOpacity',
    type: 'number',
    default: '0.1',
    description: 'The initial opacity value for the words before the animation.'
  },
  {
    name: 'baseRotation',
    type: 'number',
    default: '3',
    description: 'The starting rotation (in degrees) for the container before it animates to 0.'
  },
  {
    name: 'blurStrength',
    type: 'number',
    default: '4',
    description: 'The strength of the blur effect (in pixels) applied at the start of the animation.'
  },
  {
    name: 'containerClassName',
    type: 'string',
    default: '""',
    description: 'Additional CSS class(es) to apply to the container element.'
  },
  {
    name: 'textClassName',
    type: 'string',
    default: '""',
    description: 'Additional CSS class(es) to apply to the text element.'
  },
  {
    name: 'rotationEnd',
    type: 'string',
    default: '"bottom bottom"',
    description: 'The scroll trigger end point for the container rotation animation.'
  },
  {
    name: 'wordAnimationEnd',
    type: 'string',
    default: '"bottom bottom"',
    description:
      'The scroll trigger end point for the word opacity and blur animations. The animation will complete when the bottom of the text reaches the bottom of the container.'
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
