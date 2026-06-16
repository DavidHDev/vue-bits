<template>
  <h1 class="sub-category">Variable Proximity</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="variableProximity.usage"
    :source="variableProximitySource"
    component-name="VariableProximity"
    :props-table="props"
  >
    <template #preview>
      <div ref="containerRef" class="h-[400px] overflow-hidden font-['Roboto_Flex',sans-serif] demo-container">
        <VariableProximity
          label="Hover me! And then star Vue Bits on GitHub, or else..."
          class-name="variable-proximity-demo"
          from-font-variation-settings="'wght' 400, 'opsz' 9"
          to-font-variation-settings="'wght' 1000, 'opsz' 40"
          :container-ref="containerRef"
          :radius="radius"
          :falloff="falloff"
        />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSlider title="Radius" v-model="radius" :min="50" :max="300" :step="10" />
        <PreviewSelect title="Falloff" v-model="falloff" :options="['linear', 'exponential', 'gaussian']" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="variable-proximity" :usage="variableProximity.usage!" :source="variableProximitySource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewSelect from '@/components/common/PreviewSelect.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { variableProximity } from '@/constants/code/TextAnimations/variableProximityCode';
import VariableProximity, { type FalloffType } from '@/content/TextAnimations/VariableProximity/VariableProximity.vue';
import variableProximitySource from '@/content/TextAnimations/VariableProximity/VariableProximity.vue?raw';
import { computed, ref } from 'vue';

const { forceRerender } = useForceRerender();

const DEFAULTS = {
  radius: 100,
  falloff: 'linear' as FalloffType
};

const containerRef = ref<HTMLElement | null>(null);
const radius = ref(DEFAULTS.radius);
const falloff = ref<FalloffType>(DEFAULTS.falloff);

const hasChanges = computed(() => radius.value !== DEFAULTS.radius || falloff.value !== DEFAULTS.falloff);

function reset() {
  radius.value = DEFAULTS.radius;
  falloff.value = DEFAULTS.falloff;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'label',
    type: 'string',
    default: '""',
    description: 'The text content to display.'
  },
  {
    name: 'fromFontVariationSettings',
    type: 'string',
    default: "'wght' 400, 'opsz' 9",
    description: 'The starting variation settings.'
  },
  {
    name: 'toFontVariationSettings',
    type: 'string',
    default: "'wght' 800, 'opsz' 40",
    description: 'The variation settings to reach at cursor proximity.'
  },
  {
    name: 'containerRef',
    type: 'HTMLElement',
    default: 'undefined',
    description: 'Reference to container for relative calculations.'
  },
  {
    name: 'radius',
    type: 'number',
    default: '50',
    description: 'Proximity radius to influence the effect.'
  },
  {
    name: 'falloff',
    type: "'linear' | 'exponential' | 'gaussian'",
    default: '"linear"',
    description: 'Type of falloff for the effect.'
  }
];
</script>

<style scoped>
.variable-proximity-demo {
  max-width: 20ch;
  line-height: 100%;
  font-size: 4rem !important;
  cursor: pointer;
  text-align: center;
}

@media only screen and (max-width: 967px) {
  .variable-proximity-demo {
    font-size: 1.6rem !important;
  }
}
</style>
