<template>
  <h1 class="sub-category">Star Border</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="starBorder.usage"
    :source="starBorderSource"
    component-name="StarBorder"
    :props-table="props"
  >
    <template #preview>
      <div class="h-[400px] overflow-hidden demo-container">
        <StarBorder as="button" :color="color" :speed="`${speed}s`" :thickness="thickness">
          <span class="mx-0 text-[1em]">Star Border</span>
        </StarBorder>
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSelect title="Color" v-model="color" :options="['magenta', 'cyan', 'white']" />
        <PreviewSlider title="Thickness" v-model="thickness" :min="0.5" :max="8" :step="0.5" value-unit="px" />
        <PreviewSlider title="Speed" v-model="speed" :min="1" :max="10" :step="0.5" value-unit="s" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="star-border" :usage="starBorder.usage!" :source="starBorderSource" />
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
import { starBorder } from '@/constants/code/Animations/starBorderCode';
import StarBorder from '@/content/Animations/StarBorder/StarBorder.vue';
import starBorderSource from '@/content/Animations/StarBorder/StarBorder.vue?raw';
import { computed, ref } from 'vue';

const { forceRerender } = useForceRerender();

const DEFAULTS = {
  thickness: 1,
  speed: 5,
  color: 'magenta'
};

const thickness = ref<number>(DEFAULTS.thickness);
const speed = ref<number>(DEFAULTS.speed);
const color = ref<string>(DEFAULTS.color);

const hasChanges = computed(
  () => thickness.value !== DEFAULTS.thickness || speed.value !== DEFAULTS.speed || color.value !== DEFAULTS.color
);

function reset() {
  thickness.value = DEFAULTS.thickness;
  speed.value = DEFAULTS.speed;
  color.value = DEFAULTS.color;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'as',
    type: 'string',
    default: 'button',
    description: 'Allows specifying the type of the parent component to be rendered.'
  },
  {
    name: 'customClass',
    type: 'string',
    default: '',
    description: 'Allows adding custom classes to the component.'
  },
  {
    name: 'color',
    type: 'string',
    default: 'white',
    description: 'Changes the main color of the border (fades to transparent)'
  },
  {
    name: 'speed',
    type: 'string',
    default: '6s',
    description: 'Changes the speed of the animation.'
  },
  {
    name: 'thickness',
    type: 'number',
    default: '3',
    description: 'Controls the thickness of the star border effect.'
  }
];
</script>
