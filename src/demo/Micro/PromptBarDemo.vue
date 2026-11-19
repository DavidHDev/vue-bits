<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
    :demo-only-props="['dictation']"
    :computed-props="codeProps"
  >
    <TabsLayout>
      <template #preview>
        <div
          class="demo-container relative overflow-hidden"
          style="height: 400px; align-items: flex-end; padding: 0 16px 32px"
        >
          <PromptBar
            :placeholder="props.placeholder"
            :models="props.models ? undefined : []"
            :efforts="props.efforts ? undefined : []"
            :busy="props.busy || flowBusy"
            :on-attach="attach"
            :on-dictate="props.dictation ? dictate : undefined"
            :background="renderedBackground"
            :color="renderedColor"
            :menu-background="renderedMenu"
            :spark-color="renderedSpark"
            :spark-boost="props.sparkBoost"
            :width="props.width"
            :radius="props.radius"
            :max-rows="props.maxRows"
            :morph-duration="props.morphDuration"
            :squash="props.squash"
            :tilt="props.tilt"
            :press-scale="props.pressScale"
            @send="send"
            @stop="stop"
          />
        </div>

        <Customize>
          <PreviewInput
            title="Placeholder"
            :max-length="32"
            :model-value="props.placeholder"
            @update:model-value="(val: string) => updateProp('placeholder', val)"
          />
          <PreviewColorPickerCustom
            title="Background"
            :color="renderedBackground"
            @change="(val: string) => updateProp('background', val)"
          />
          <PreviewColorPickerCustom
            title="Ink"
            :color="renderedColor"
            @change="(val: string) => updateProp('color', val)"
          />
          <PreviewColorPickerCustom
            title="Menu"
            :color="renderedMenu"
            @change="(val: string) => updateProp('menuBackground', val)"
          />
          <PreviewColorPickerCustom
            title="Spark"
            :color="renderedSpark"
            @change="(val: string) => updateProp('sparkColor', val)"
          />
          <PreviewSlider
            title="Spark Boost"
            :min="0"
            :max="2"
            :step="0.1"
            :model-value="props.sparkBoost"
            @update:model-value="(val: number) => updateProp('sparkBoost', val)"
          />
          <PreviewSlider
            title="Width"
            :min="300"
            :max="520"
            :step="4"
            value-unit="px"
            :model-value="props.width"
            @update:model-value="(val: number) => updateProp('width', val)"
          />
          <PreviewSlider
            title="Radius"
            :min="0"
            :max="28"
            :step="1"
            value-unit="px"
            :model-value="props.radius"
            @update:model-value="(val: number) => updateProp('radius', val)"
          />
          <PreviewSlider
            title="Max Rows"
            :min="1"
            :max="10"
            :step="1"
            :model-value="props.maxRows"
            @update:model-value="(val: number) => updateProp('maxRows', val)"
          />
          <PreviewSlider
            title="Morph"
            :min="120"
            :max="400"
            :step="20"
            value-unit="ms"
            :model-value="props.morphDuration"
            @update:model-value="(val: number) => updateProp('morphDuration', val)"
          />
          <PreviewSlider
            title="Squash"
            :min="0"
            :max="0.3"
            :step="0.01"
            :model-value="props.squash"
            @update:model-value="(val: number) => updateProp('squash', val)"
          />
          <PreviewSlider
            title="Tilt"
            :min="0"
            :max="20"
            :step="1"
            value-unit="°"
            :model-value="props.tilt"
            @update:model-value="(val: number) => updateProp('tilt', val)"
          />
          <PreviewSlider
            title="Press Scale"
            :min="0.85"
            :max="1"
            :step="0.01"
            :model-value="props.pressScale"
            @update:model-value="(val: number) => updateProp('pressScale', val)"
          />
          <PreviewSwitch
            title="Busy"
            :model-value="props.busy"
            @update:model-value="(val: boolean) => updateProp('busy', val)"
          />
          <PreviewSwitch
            title="Model Picker"
            :model-value="props.models"
            @update:model-value="(val: boolean) => updateProp('models', val)"
          />
          <PreviewSwitch
            title="Effort Picker"
            :model-value="props.efforts"
            @update:model-value="(val: boolean) => updateProp('efforts', val)"
          />
          <PreviewSwitch
            title="Dictation"
            :model-value="props.dictation"
            @update:model-value="(val: boolean) => updateProp('dictation', val)"
          />
        </Customize>

        <PropTable :data="propData" />
        <Dependencies :dependency-list="['motion-v', '@hugeicons/vue', '@hugeicons/core-free-icons']" />
      </template>

      <template #code>
        <CodeExample :code-object="promptBar" component-name="PromptBar" />
      </template>
    </TabsLayout>
  </ComponentPropsProvider>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue';
import CodeExample from '@/components/common/CodeExample.vue';
import Customize from '@/components/common/Customize.vue';
import Dependencies from '@/components/common/Dependencies.vue';
import PreviewColorPickerCustom from '@/components/common/PreviewColorPickerCustom.vue';
import PreviewInput from '@/components/common/PreviewInput.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import ComponentPropsProvider from '@/components/context/ComponentPropsProvider.vue';
import { useComponentProps } from '@/composables/useComponentProps';
import { useColorModeValue } from '@/composables/useTheme';
import { promptBar } from '@/constants/code/Micro/promptBarCode';
import PromptBar from '@/content/Micro/PromptBar/PromptBar.vue';

const DEFAULT_PROPS = {
  placeholder: 'Ask anything',
  background: '#272a27',
  color: '#f5f5f5',
  menuBackground: '#313531',
  sparkColor: '#a0ffbc',
  sparkBoost: 1,
  width: 400,
  radius: 16,
  maxRows: 5,
  morphDuration: 240,
  squash: 0.12,
  tilt: 8,
  pressScale: 0.96,
  busy: false,
  models: true,
  efforts: true,
  dictation: true
};

const FILES = ['brief.pdf', 'screenshot.png', 'metrics.csv'];
const TRANSCRIPT = 'Compare the last two quarters of sales';
const RESPONSE_MS = 2400;
const DICTATION_MS = 2200;

const { props, updateProp, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);

const renderedBackground = useColorModeValue(
  () => (props.value.background === DEFAULT_PROPS.background ? '#f5f7f5' : props.value.background),
  () => props.value.background
);
const renderedColor = useColorModeValue(
  () => (props.value.color === DEFAULT_PROPS.color ? '#161816' : props.value.color),
  () => props.value.color
);
const renderedMenu = useColorModeValue(
  () => (props.value.menuBackground === DEFAULT_PROPS.menuBackground ? '#ffffff' : props.value.menuBackground),
  () => props.value.menuBackground
);
const renderedSpark = useColorModeValue(
  () => (props.value.sparkColor === DEFAULT_PROPS.sparkColor ? '#1f9d45' : props.value.sparkColor),
  () => props.value.sparkColor
);

const codeProps = computed(() => ({
  models: props.value.models ? undefined : [],
  efforts: props.value.efforts ? undefined : []
}));

const flowBusy = ref(false);
let timer: ReturnType<typeof setTimeout> | undefined;
let fileIndex = 0;

const send = () => {
  flowBusy.value = true;
  clearTimeout(timer);
  timer = setTimeout(() => {
    flowBusy.value = false;
  }, RESPONSE_MS);
};
const stop = () => {
  clearTimeout(timer);
  flowBusy.value = false;
  if (props.value.busy) updateProp('busy', false);
};
const attach = () => FILES[fileIndex++ % FILES.length];
const dictate = () => new Promise<string>(resolve => setTimeout(() => resolve(TRANSCRIPT), DICTATION_MS));
onBeforeUnmount(() => clearTimeout(timer));

const propData: PropRow[] = [
  {
    name: 'placeholder',
    type: 'string',
    default: '"Ask anything"',
    description: 'Shown while the field is empty.'
  },
  {
    name: 'sources',
    type: 'PromptBarSource[]',
    default: 'DEFAULT_SOURCES',
    description:
      'Rows of the @ menu and the plus button: key, name, description, icon (a Hugeicons icon or any component), and attach: true for the row that adds files.'
  },
  {
    name: 'commands',
    type: 'PromptBarCommand[]',
    default: 'DEFAULT_COMMANDS',
    description: 'Rows of the / menu: key, name (with the slash), description.'
  },
  {
    name: 'models',
    type: 'PromptBarModel[]',
    default: 'DEFAULT_MODELS',
    description: 'Rows of the model picker: key, name, tag. An empty list hides the picker.'
  },
  {
    name: 'efforts',
    type: 'string[]',
    default: 'DEFAULT_EFFORTS',
    description:
      'Steps of the effort slider, low to high. The last step turns the field to the spark colour with drifting sparks. An empty list hides the control.'
  },
  {
    name: 'defaultEffort',
    type: 'string',
    default: '""',
    description: 'The step selected at first. Empty picks the middle.'
  },
  { name: '@effortChange', type: '(effort) => void', default: '-', description: 'The slider moved.' },
  {
    name: 'defaultModel',
    type: 'string',
    default: '""',
    description: 'Key of the model selected at first. Empty picks the first.'
  },
  {
    name: 'busy',
    type: 'boolean',
    default: 'false',
    description: 'A response is in flight. The send tile stays ink and its arrow morphs into a stop square.'
  },
  {
    name: '@send',
    type: '(text, { attachments, model, effort }) => void',
    default: '-',
    description: 'Enter or the tile, with a non-empty draft or an attachment. The draft and attachments clear.'
  },
  { name: '@stop', type: '() => void', default: '-', description: 'The tile while busy.' },
  {
    name: 'onAttach',
    type: '() => string | string[] | Promise<string | string[]>',
    default: '-',
    description: 'Picked the attach row. Return file names, or a promise of them, and they appear as chips.'
  },
  {
    name: 'onDictate',
    type: '() => string | Promise<string>',
    default: '-',
    description: 'The mic. Return the transcript, or a promise of it, and it lands in the draft. Omit to hide the mic.'
  },
  {
    name: 'background',
    type: 'string',
    default: '"#272a27"',
    description: 'The field surface, and the glyph on an armed tile.'
  },
  { name: 'color', type: 'string', default: '"#f5f5f5"', description: 'The ink: text, icons, and the armed tile.' },
  {
    name: 'menuBackground',
    type: 'string',
    default: '"#313531"',
    description: 'The surface of the menus and the effort popover.'
  },
  {
    name: 'sparkColor',
    type: 'string',
    default: '"#a0ffbc"',
    description: 'The wash, the sparks and the slider at the top effort.'
  },
  {
    name: 'sparkBoost',
    type: 'number',
    default: '1',
    description:
      'How strongly typing drives the sparks at the top effort: they rise faster, grow and glow brighter with typing speed, and flash on each keystroke. No sparks are added. 0 keeps them calm.'
  },
  { name: 'width', type: 'number', default: '400', description: 'Field width in px, capped at the parent.' },
  { name: 'radius', type: 'number', default: '16', description: 'Field corner radius in px.' },
  { name: 'maxRows', type: 'number', default: '5', description: 'Rows the field grows to before it scrolls.' },
  { name: 'morphDuration', type: 'number', default: '240', description: 'Arrow to square and back, in ms.' },
  {
    name: 'squash',
    type: 'number',
    default: '0.12',
    description: 'Mid-morph pinch. The glyph narrows by this and grows taller to keep its area.'
  },
  {
    name: 'tilt',
    type: 'number',
    default: '8',
    description: 'Mid-morph lean in degrees, mirrored on the way back.'
  },
  {
    name: 'pressScale',
    type: 'number',
    default: '0.96',
    description: 'Scale of the send tile while a pointer is down.'
  },
  { name: 'className', type: 'string', default: '""', description: 'Extra classes for the root.' }
];
</script>
