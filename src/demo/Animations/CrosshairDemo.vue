<template>
  <h1 class="sub-category">Crosshair</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="crosshair.usage"
    :source="crosshairSource"
    component-name="Crosshair"
    :props-table="props"
  >
    <template #preview>
      <div ref="containerRef" class="min-h-[300px] overflow-hidden demo-container">
        <Crosshair :container-ref="targeted ? null : containerRef" :color="color" />

        <div class="flex flex-col justify-center items-center">
          <a
            ref="linkRef"
            href="https://github.com/DavidHDev/vue-bits"
            class="font-black text-[2rem] md:text-[4rem] hover:text-[#27FF64] text-center transition-all duration-300 ease-in-out"
            :style="{ minWidth: minWidth + 'px' }"
            @mouseenter="() => (linkText = 'Locked')"
            @mouseleave="() => (linkText = DEFAULT_TEXT)"
          >
            {{ linkText }}
          </a>
          <p class="-top-[10px] relative text-[#444] text-sm">(hover the text)</p>
        </div>

        <span
          ref="hiddenRef"
          class="invisible absolute overflow-hidden font-black text-[2rem] md:text-[4rem] text-center whitespace-nowrap pointer-events-none"
          aria-hidden="true"
        >
          {{ linkText }}
        </span>
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSelect
          title="Target"
          :options="[
            { label: 'Container', value: 'targeted' },
            { label: 'Viewport', value: 'viewport' }
          ]"
          :model-value="targeted ? 'viewport' : 'targeted'"
          @update:model-value="(val: string | number) => (targeted = val === 'viewport')"
        />
        <PreviewColorPicker title="Crosshair Color" v-model="color" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="crosshair" :usage="crosshair.usage!" :source="crosshairSource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewColorPicker from '@/components/common/PreviewColorPicker.vue';
import PreviewSelect from '@/components/common/PreviewSelect.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { crosshair } from '@/constants/code/Animations/crosshairCode';
import Crosshair from '@/content/Animations/Crosshair/Crosshair.vue';
import crosshairSource from '@/content/Animations/Crosshair/Crosshair.vue?raw';
import { computed, nextTick, ref, useTemplateRef, watch } from 'vue';

const { forceRerender } = useForceRerender();

const DEFAULT_TEXT = 'Target';

const DEFAULTS = {
  color: '#ffffff',
  targeted: true
};

const linkText = ref(DEFAULT_TEXT);
const color = ref(DEFAULTS.color);
const targeted = ref(DEFAULTS.targeted);

const linkRef = useTemplateRef('linkRef');
const containerRef = useTemplateRef('containerRef');
const hiddenRef = useTemplateRef('hiddenRef');

const minWidth = ref(0);

const hasChanges = computed(() => color.value !== DEFAULTS.color || targeted.value !== DEFAULTS.targeted);

function reset() {
  color.value = DEFAULTS.color;
  targeted.value = DEFAULTS.targeted;
  forceRerender();
}

const props: PropRow[] = [
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

watch(
  () => [linkText.value, color.value, targeted.value],
  () => {
    nextTick(() => {
      if (hiddenRef.value) {
        if (minWidth.value < hiddenRef.value.getBoundingClientRect().width) {
          minWidth.value = hiddenRef.value.getBoundingClientRect().width;
        }
      }
    });
  },
  { immediate: true }
);
</script>
