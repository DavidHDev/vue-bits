<template>
  <TabbedLayout>
    <template #preview>
      <div ref="containerRef" class="demo-container min-h-[300px] overflow-hidden">
        <Crosshair :container-ref="targeted ? containerElement : null" :color="color" />

        <div class="flex flex-col justify-center items-center">
          <a
            ref="linkRef"
            href="https://github.com/DavidHDev/vue-bits"
            class="text-center font-black text-[2rem] md:text-[4rem] transition-all duration-300 ease-in-out hover:text-[#27FF64]"
            :style="{ minWidth: minWidth + 'px' }"
            @mouseenter="handleMouseEnter"
            @mouseleave="handleMouseLeave"
          >
            {{ linkText }}
          </a>
          <p class="relative -top-[10px] text-[#444] text-sm">(hover the text)</p>
        </div>

        <span
          ref="hiddenRef"
          class="absolute invisible whitespace-nowrap pointer-events-none overflow-hidden text-center font-black text-[2rem] md:text-[4rem]"
          aria-hidden="true"
        >
          {{ linkText }}
        </span>
      </div>

      <Customize>
        <PreviewSelect
          title="Target"
          :options="[
            { label: 'Container', value: 'targeted' },
            { label: 'Viewport', value: 'viewport' }
          ]"
          v-model="targetedMode"
        />

        <PreviewColor title="Crosshair Color" v-model="color" />
      </Customize>

      <PropTable :data="propData" />
      <Dependencies :dependency-list="['gsap']" />
    </template>

    <template #code>
      <CodeExample :code-object="crosshair" />
    </template>

    <template #cli>
      <CliInstallation :command="crosshair.cli" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, useTemplateRef, nextTick, computed } from 'vue';
import TabbedLayout from '@/components/common/TabbedLayout.vue';
import PropTable from '@/components/common/PropTable.vue';
import Dependencies from '@/components/code/Dependencies.vue';
import CliInstallation from '@/components/code/CliInstallation.vue';
import CodeExample from '@/components/code/CodeExample.vue';
import Customize from '@/components/common/Customize.vue';
import PreviewColor from '@/components/common/PreviewColor.vue';
import PreviewSelect from '@/components/common/PreviewSelect.vue';

import Crosshair from '@/content/Animations/Crosshair/Crosshair.vue';
import { crosshair } from '@/constants/code/Animations/crosshairCode';

const DEFAULT_TEXT = 'Aim... aand...';

const linkText = ref(DEFAULT_TEXT);
const color = ref('#ffffff');
const targetedMode = ref('targeted');
const minWidth = ref(0);

const containerRef = useTemplateRef<HTMLDivElement>('containerRef');
const linkRef = useTemplateRef<HTMLAnchorElement>('linkRef');
const hiddenRef = useTemplateRef<HTMLSpanElement>('hiddenRef');

const containerElement = computed(() => containerRef.value);
const targeted = computed(() => targetedMode.value === 'targeted');

const propData = [
  {
    name: 'color',
    type: 'string',
    default: "'white'",
    description: 'Color of the crosshair lines.'
  },
  {
    name: 'containerRef',
    type: 'Ref<HTMLElement | null>',
    default: 'null',
    description:
      'Optional container ref to limit crosshair to specific element. If null, crosshair will be active on entire viewport.'
  }
];

const handleMouseEnter = () => {
  linkText.value = 'Shoot!!!';
};

const handleMouseLeave = () => {
  linkText.value = DEFAULT_TEXT;
};

const updateMinWidth = async () => {
  await nextTick();
  if (hiddenRef.value) {
    const width = hiddenRef.value.getBoundingClientRect().width;
    if (minWidth.value < width) {
      minWidth.value = width;
    }
  }
};

onMounted(() => {
  updateMinWidth();
});

let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
  if (hiddenRef.value) {
    resizeObserver = new ResizeObserver(() => {
      updateMinWidth();
    });
    resizeObserver.observe(hiddenRef.value);
  }
});

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
});
</script>
