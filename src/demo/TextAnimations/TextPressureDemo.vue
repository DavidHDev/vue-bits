<template>
  <h1 class="sub-category">Text Pressure</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="textPressure.usage"
    :source="textPressureSource"
    component-name="TextPressure"
    :props-table="props"
  >
    <template #preview>
      <div class="relative h-[400px] demo-container">
        <RefreshButton @click="forceRerender" />
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
    </template>

    <template #customize>
      <Customize>
        <PreviewColorPicker title="Text Color" v-model="textColor" />
        <PreviewColorPicker title="Stroke Color" v-model="strokeColor" />
        <PreviewInput title="Text" v-model="text" placeholder="Enter text..." :maxlength="10" />
        <PreviewSwitch title="Flex" v-model="flex" />
        <PreviewSwitch title="Alpha" v-model="alpha" />
        <PreviewSwitch title="Stroke" v-model="stroke" />
        <PreviewSwitch title="Width" v-model="width" />
        <PreviewSwitch title="Weight" v-model="weight" />
        <PreviewSwitch title="Italic" v-model="italic" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="text-pressure" :usage="textPressure.usage!" :source="textPressureSource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewColorPicker from '@/components/common/PreviewColorPicker.vue';
import PreviewInput from '@/components/common/PreviewInput.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import RefreshButton from '@/components/common/RefreshButton.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { textPressure } from '@/constants/code/TextAnimations/textPressureCode';
import TextPressure from '@/content/TextAnimations/TextPressure/TextPressure.vue';
import textPressureSource from '@/content/TextAnimations/TextPressure/TextPressure.vue?raw';
import { computed, ref } from 'vue';

const { rerenderKey, forceRerender } = useForceRerender();

const DEFAULTS = {
  text: 'Hello!',
  flex: true,
  alpha: false,
  stroke: false,
  width: true,
  weight: true,
  italic: true,
  textColor: '#ffffff',
  strokeColor: '#27FF64'
};

const text = ref(DEFAULTS.text);
const flex = ref(DEFAULTS.flex);
const alpha = ref(DEFAULTS.alpha);
const stroke = ref(DEFAULTS.stroke);
const width = ref(DEFAULTS.width);
const weight = ref(DEFAULTS.weight);
const italic = ref(DEFAULTS.italic);
const textColor = ref(DEFAULTS.textColor);
const strokeColor = ref(DEFAULTS.strokeColor);

const hasChanges = computed(
  () =>
    text.value !== DEFAULTS.text ||
    flex.value !== DEFAULTS.flex ||
    alpha.value !== DEFAULTS.alpha ||
    stroke.value !== DEFAULTS.stroke ||
    width.value !== DEFAULTS.width ||
    weight.value !== DEFAULTS.weight ||
    italic.value !== DEFAULTS.italic ||
    textColor.value !== DEFAULTS.textColor ||
    strokeColor.value !== DEFAULTS.strokeColor
);

function reset() {
  text.value = DEFAULTS.text;
  flex.value = DEFAULTS.flex;
  alpha.value = DEFAULTS.alpha;
  stroke.value = DEFAULTS.stroke;
  width.value = DEFAULTS.width;
  weight.value = DEFAULTS.weight;
  italic.value = DEFAULTS.italic;
  textColor.value = DEFAULTS.textColor;
  strokeColor.value = DEFAULTS.strokeColor;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'text',
    type: 'string',
    default: '"Hello!"',
    description: 'Text content that will be displayed and animated.'
  },
  {
    name: 'fontFamily',
    type: 'string',
    default: '',
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
    default: 'true',
    description: 'The fill color of the text'
  },
  {
    name: 'strokeColor',
    type: 'string',
    default: '#FFFFFF',
    description: 'The stroke color that will be applied to the text when "stroke" is set to true'
  },
  {
    name: 'className',
    type: 'string',
    default: '#00FF00',
    description: 'Additional class for styling the <h1> wrapper.'
  },
  {
    name: 'minFontSize',
    type: 'number',
    default: '24',
    description: 'Sets a minimum font-size to avoid overly tiny text on smaller screens.'
  }
];
</script>

<style scoped>
.color-controls {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}
</style>
