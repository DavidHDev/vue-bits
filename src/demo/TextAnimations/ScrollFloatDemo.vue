<template>
  <h1 class="sub-category">Scroll Float</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="scrollFloatCode.usage"
    :source="scrollFloatSource"
    component-name="ScrollFloat"
    :props-table="props"
  >
    <template #preview>
      <div ref="containerRef" class="relative h-[400px] overflow-y-auto demo-container" @wheel="smoothScroll">
        <div class="scroll-instruction">Scroll Down</div>
        <div class="scroll-content">
          <ScrollFloat
            :stagger="stagger"
            :animation-duration="duration"
            :key="key"
            :scroll-container-ref="containerRef"
          >
            Vue Bits
          </ScrollFloat>
        </div>
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSlider title="Stagger" v-model="stagger" :min="0.01" :max="0.1" :step="0.01" value-unit="s" />
        <PreviewSlider title="Duration" v-model="duration" :min="1" :max="10" :step="0.1" value-unit="s" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="scroll-float" :usage="scrollFloatCode.usage!" :source="scrollFloatSource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { scrollFloatCode } from '@/constants/code/TextAnimations/scrollFloatCode';
import ScrollFloat from '@/content/TextAnimations/ScrollFloat/ScrollFloat.vue';
import scrollFloatSource from '@/content/TextAnimations/ScrollFloat/ScrollFloat.vue?raw';
import { gsap } from 'gsap';
import { computed, onMounted, onUnmounted, ref, useTemplateRef, watch } from 'vue';

const { rerenderKey: key, forceRerender } = useForceRerender();

const DEFAULTS = {
  stagger: 0.03,
  duration: 1
};

const containerRef = useTemplateRef<HTMLHeadingElement>('containerRef');
const duration = ref(DEFAULTS.duration);
const stagger = ref(DEFAULTS.stagger);

const hasChanges = computed(() => duration.value !== DEFAULTS.duration || stagger.value !== DEFAULTS.stagger);

function reset() {
  duration.value = DEFAULTS.duration;
  stagger.value = DEFAULTS.stagger;
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

watch([duration, stagger], () => {
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
    name: 'containerClassName',
    type: 'string',
    default: '""',
    description: 'Additional Tailwind classes for the container element.'
  },
  {
    name: 'textClassName',
    type: 'string',
    default: '""',
    description: 'Additional Tailwind classes for the text element.'
  },
  {
    name: 'animationDuration',
    type: 'number',
    default: '1',
    description: 'Duration (in seconds) of the animation.'
  },
  {
    name: 'ease',
    type: 'string',
    default: '"back.inOut(2)"',
    description: 'Easing function used for the animation.'
  },
  {
    name: 'scrollStart',
    type: 'string',
    default: '"center bottom+=50%"',
    description: 'The scroll trigger start position.'
  },
  {
    name: 'scrollEnd',
    type: 'string',
    default: '"bottom bottom-=40%"',
    description: 'The scroll trigger end position.'
  },
  {
    name: 'stagger',
    type: 'number',
    default: '0.03',
    description: 'Delay between the animation start of each character.'
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
  position: relative;
  padding-top: 1600px;
  padding-bottom: 600px;
  padding-inline: 3rem;
}
</style>
