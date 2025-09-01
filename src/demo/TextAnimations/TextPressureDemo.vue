<template>
  <TabbedLayout>
    <template #preview>
      <div class="demo-container h-[400px]">
        <TextPressure
          :key="rerenderKey"
          :text="text"
          :flex="flex"
          :alpha="alpha"
          :stroke="stroke"
          :width="width"
          :weight="weight"
          :italic="italic"
          :text-color="textColor"
          :stroke-color="strokeColor"
          :min-font-size="36"
        />
      </div>

      <Customize>
        <div class="mb-4">
          <label class="block text-sm font-medium mb-2">Text</label>

          <input
            v-model="text"
            type="text"
            placeholder="Your text here..."
            maxlength="10"
            class="w-[200px] px-3 py-2 bg-[#0b0b0b] border border-[#333] rounded-md text-white focus:outline-none focus:border-[#666]"
          />
        </div>

        <div class="color-controls">
          <PreviewColor title="Text Color" v-model="textColor" />

          <PreviewColor title="Stroke Color" v-model="strokeColor" />
        </div>

        <p class="mt-6 text-[#999] text-sm">Animation Settings</p>

        <div class="flex gap-4 flex-wrap">
          <PreviewSwitch title="Flex" v-model="flex" />

          <PreviewSwitch title="Alpha" v-model="alpha" />

          <PreviewSwitch title="Stroke" v-model="stroke" />

          <PreviewSwitch title="Width" v-model="width" />

          <PreviewSwitch title="Weight" v-model="weight" />

          <PreviewSwitch title="Italic" v-model="italic" />
        </div>
      </Customize>

      <PropTable :data="propData" />
    </template>

    <template #code>
      <CodeExample :code-object="textPressure" />
    </template>

    <template #cli>
      <CliInstallation :command="textPressure.cli" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import TabbedLayout from '../../components/common/TabbedLayout.vue';
import PropTable from '../../components/common/PropTable.vue';
import CliInstallation from '../../components/code/CliInstallation.vue';
import CodeExample from '../../components/code/CodeExample.vue';
import Customize from '../../components/common/Customize.vue';
import PreviewSwitch from '../../components/common/PreviewSwitch.vue';
import PreviewColor from '../../components/common/PreviewColor.vue';
import TextPressure from '../../content/TextAnimations/TextPressure/TextPressure.vue';
import { textPressure } from '@/constants/code/TextAnimations/textPressureCode';
import { useForceRerender } from '@/composables/useForceRerender';

const text = ref('Hello!');
const flex = ref(true);
const alpha = ref(false);
const stroke = ref(false);
const width = ref(true);
const weight = ref(true);
const italic = ref(true);
const textColor = ref('#ffffff');
const strokeColor = ref('#27FF64');

const { rerenderKey, forceRerender } = useForceRerender();

const propData = [
  {
    name: 'text',
    type: 'string',
    default: '"Hello!"',
    description: 'Text content that will be displayed and animated.'
  },
  {
    name: 'fontFamily',
    type: 'string',
    default: 'Compressa VF',
    description: 'Name of the variable font family.'
  },
  {
    name: 'fontUrl',
    type: 'string',
    default: 'URL to a .woff2 or .ttf file',
    description: 'URL for the variable font file (needed)'
  },
  {
    name: 'flex',
    type: 'boolean',
    default: 'true',
    description: 'Whether the characters are spaced using flex layout.'
  },
  {
    name: 'scale',
    type: 'boolean',
    default: 'false',
    description: 'If true, vertically scales the text to fill its container height.'
  },
  {
    name: 'alpha',
    type: 'boolean',
    default: 'false',
    description: 'If true, applies an opacity effect based on cursor distance.'
  },
  {
    name: 'stroke',
    type: 'boolean',
    default: 'false',
    description: 'If true, adds a stroke effect around characters.'
  },
  {
    name: 'width',
    type: 'boolean',
    default: 'true',
    description: 'If true, varies the variable-font "width" axis.'
  },
  {
    name: 'weight',
    type: 'boolean',
    default: 'true',
    description: 'If true, varies the variable-font "weight" axis.'
  },
  {
    name: 'italic',
    type: 'boolean',
    default: 'true',
    description: 'If true, varies the variable-font "italics" axis.'
  },
  {
    name: 'textColor',
    type: 'string',
    default: '#FFFFFF',
    description: 'The fill color of the text'
  },
  {
    name: 'strokeColor',
    type: 'string',
    default: '#FF0000',
    description: 'The stroke color that will be applied to the text when "stroke" is set to true'
  },
  {
    name: 'className',
    type: 'string',
    default: "''",
    description: 'Additional class for styling the <h1> wrapper.'
  },
  {
    name: 'minFontSize',
    type: 'number',
    default: '24',
    description: 'Sets a minimum font-size to avoid overly tiny text on smaller screens.'
  }
];

watch(
  () => [flex.value, alpha.value, stroke.value, width.value, weight.value, italic.value],
  () => {
    forceRerender();
  }
);
</script>

<style scoped>
.color-controls {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}
</style>
