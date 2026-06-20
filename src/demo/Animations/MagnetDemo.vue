<template>
  <h1 class="sub-category">Magnet</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="magnet.usage"
    :source="magnetSource"
    component-name="Magnet"
    :props-table="props"
  >
    <template #preview>
      <div class="h-[400px] demo-container">
        <Magnet
          :key="rerenderKey"
          :padding="Math.floor(padding / 2)"
          :disabled="disabled"
          :magnetStrength="magnetStrength"
        >
          <a href="https://github.com/DavidHDev/vue-bits" target="_blank" rel="noreferrer" class="magnet-link">
            Star
            <span class="accent">Vue Bits</span>
            on GitHub!
          </a>
        </Magnet>
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSwitch title="Disabled" v-model="disabled" />
        <PreviewSlider title="Padding" v-model="padding" :min="0" :max="300" :step="10" value-unit="px" />
        <PreviewSlider title="Strength" v-model="magnetStrength" :min="1" :max="10" :step="1" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="magnet" :usage="magnet.usage!" :source="magnetSource" />
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
import { magnet } from '@/constants/code/Animations/magnetCode';
import Magnet from '@/content/Animations/Magnet/Magnet.vue';
import magnetSource from '@/content/Animations/Magnet/Magnet.vue?raw';
import { computed, ref } from 'vue';

const { rerenderKey, forceRerender } = useForceRerender();

const DEFAULTS = {
  disabled: false,
  padding: 100,
  magnetStrength: 2
};

const disabled = ref(DEFAULTS.disabled);
const padding = ref(DEFAULTS.padding);
const magnetStrength = ref(DEFAULTS.magnetStrength);

const hasChanges = computed(
  () =>
    disabled.value !== DEFAULTS.disabled ||
    padding.value !== DEFAULTS.padding ||
    magnetStrength.value !== DEFAULTS.magnetStrength
);

function reset() {
  disabled.value = DEFAULTS.disabled;
  padding.value = DEFAULTS.padding;
  magnetStrength.value = DEFAULTS.magnetStrength;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'padding',
    type: 'number',
    default: '100',
    description: 'Specifies the distance (in pixels) around the element that activates the magnet pull.'
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Disables the magnet effect when set to true.'
  },
  {
    name: 'magnetStrength',
    type: 'number',
    default: '2',
    description: 'Controls the strength of the pull; higher values reduce movement, lower values increase it.'
  },
  {
    name: 'activeTransition',
    type: 'string',
    default: '"transform 0.3s ease-out"',
    description: 'CSS transition applied to the element when the magnet is active.'
  },
  {
    name: 'inactiveTransition',
    type: 'string',
    default: '"transform 0.5s ease-in-out"',
    description: 'CSS transition applied when the magnet is inactive (mouse out of range).'
  },
  {
    name: 'wrapperClassName',
    type: 'string',
    default: '""',
    description: 'Optional CSS class name for the outermost wrapper element.'
  },
  {
    name: 'innerClassName',
    type: 'string',
    default: '""',
    description: 'Optional CSS class name for the moving (inner) element.'
  }
];
</script>

<style scoped>
.demo-title-extra {
  font-size: 1.1rem;
  color: #fff;
  margin: 2rem 0 1rem 0;
  font-weight: 600;
}

.magnet-container {
  width: 200px;
  height: 100px;
  font-size: 1.25rem;
  font-weight: bold;
  color: #fff;
  background: #111;
  border: 1px solid #222;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.magnet-link {
  font-size: 1.125rem;
  color: #fff;
  text-decoration: none;
  transition: color 0.3s ease;
}

.magnet-link:hover {
  color: #f0f0f0;
}

.accent {
  color: #27ff56;
}
</style>
