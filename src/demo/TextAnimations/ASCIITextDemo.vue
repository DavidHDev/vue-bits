<template>
  <h1 class="sub-category">ASCII Text</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="asciiText.usage"
    :source="asciiTextSource"
    component-name="ASCIIText"
    :props-table="props"
  >
    <template #preview>
      <div class="relative h-[400px] overflow-hidden demo-container">
        <ASCIIText
          :key="rerenderKey"
          :text="text"
          :ascii-font-size="asciiFontSize"
          :enable-waves="enableWaves"
          :text-font-size="250"
          :plane-base-height="12"
        />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewInput title="Text" v-model="text" placeholder="Enter text..." />
        <PreviewSlider title="Size" v-model="asciiFontSize" :min="1" :max="64" :step="1" />
        <PreviewSwitch title="Enable Waves" v-model="enableWaves" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="ascii-text" :usage="asciiText.usage!" :source="asciiTextSource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewInput from '@/components/common/PreviewInput.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { asciiText } from '@/constants/code/TextAnimations/asciiTextCode';
import ASCIIText from '@/content/TextAnimations/ASCIIText/ASCIIText.vue';
import asciiTextSource from '@/content/TextAnimations/ASCIIText/ASCIIText.vue?raw';
import { computed, ref } from 'vue';

const { rerenderKey, forceRerender } = useForceRerender();

const DEFAULTS = {
  text: 'Hey!',
  enableWaves: true,
  asciiFontSize: 8
};

const text = ref(DEFAULTS.text);
const asciiFontSize = ref(DEFAULTS.asciiFontSize);
const enableWaves = ref(DEFAULTS.enableWaves);

const hasChanges = computed(
  () =>
    text.value !== DEFAULTS.text ||
    asciiFontSize.value !== DEFAULTS.asciiFontSize ||
    enableWaves.value !== DEFAULTS.enableWaves
);

function reset() {
  text.value = DEFAULTS.text;
  asciiFontSize.value = DEFAULTS.asciiFontSize;
  enableWaves.value = DEFAULTS.enableWaves;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'text',
    type: 'string',
    default: '"Hello World!"',
    description: 'The text displayed on the plane in the ASCII scene.'
  },
  {
    name: 'enableWaves',
    type: 'boolean',
    default: 'true',
    description: 'If false, disables the wavy text animation.'
  },
  {
    name: 'asciiFontSize',
    type: 'number',
    default: '12',
    description: 'Size of the ASCII glyphs in the overlay.'
  },
  {
    name: 'textFontSize',
    type: 'number',
    default: '200',
    description: "Pixel size for the text that's drawn onto the plane texture."
  },
  {
    name: 'planeBaseHeight',
    type: 'number',
    default: '8',
    description: 'How tall the plane is in 3D. The plane width is auto-based on text aspect.'
  },
  {
    name: 'textColor',
    type: 'string',
    default: '#fdf9f3',
    description: 'The color of the text drawn onto the plane texture.'
  },
  {
    name: 'strokeColor',
    type: 'string',
    default: 'N/A',
    description: 'Not used here, but you could add it if you want an outline effect.'
  }
];
</script>
