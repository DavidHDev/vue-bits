<template>
  <h1 class="sub-category">Spotlight Card</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="spotlightCard.usage"
    :source="spotlightCardSource"
    component-name="SpotlightCard"
    :props-table="props"
  >
    <template #preview>
      <div class="relative py-10 demo-container">
        <SpotlightCard class-name="custom-spotlight-card" :spotlight-color="spotlightColor">
          <div class="flex flex-col justify-center items-start h-full">
            <i class="mb-3 text-white text-3xl pi pi-lock"></i>
            <h3 class="mb-1 font-semibold text-white text-2xl tracking-tight">Boost Your Experience</h3>
            <p class="text-zinc-400 text-sm">
              Get exclusive benefits, features & 24/7 support as a permanent club member.
            </p>
          </div>
        </SpotlightCard>
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewColorPicker title="Spotlight Color" v-model="spotlightColor" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="spotlight-card" :usage="spotlightCard.usage!" :source="spotlightCardSource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewColorPicker from '@/components/common/PreviewColorPicker.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { spotlightCard } from '@/constants/code/Components/spotlightCardCode';
import SpotlightCard from '@/content/Components/SpotlightCard/SpotlightCard.vue';
import spotlightCardSource from '@/content/Components/SpotlightCard/SpotlightCard.vue?raw';
import { computed, ref } from 'vue';

const { forceRerender } = useForceRerender();

const DEFAULTS = {
  spotlightColor: '#ffffff40'
};

const spotlightColor = ref<string>(DEFAULTS.spotlightColor);

const hasChanges = computed(() => spotlightColor.value !== DEFAULTS.spotlightColor);

function reset() {
  spotlightColor.value = DEFAULTS.spotlightColor;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'spotlightColor',
    type: 'string',
    default: 'rgba(255, 255, 255, 0.25)',
    description: 'Controls the color of the radial gradient used for the spotlight effect.'
  },
  {
    name: 'className',
    type: 'string',
    default: '',
    description: 'Allows adding custom classes to the component.'
  }
];
</script>

<style>
.custom-spotlight-card {
  user-select: none;
  background-color: var(--bg-elevated) !important;
  border: 1px solid var(--border-secondary) !important;
  width: 350px;
  height: 300px;
}
</style>
