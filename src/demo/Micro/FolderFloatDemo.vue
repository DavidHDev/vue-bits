<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
  >
    <TabsLayout>
      <template #preview>
        <div
          class="demo-container relative overflow-hidden"
          style="height: 400px; align-items: flex-end; padding-bottom: 44px"
        >
          <FolderFloat
            :label="props.label"
            :sublabel="props.sublabel"
            :trigger="props.trigger"
            :close-on-select="props.closeOnSelect"
            :physics="props.physics"
            :drift="props.drift"
            :folder-color="renderedFolder"
            :front-color="renderedFront"
            :paper-color="renderedPaper"
            :item-color="renderedItem"
            :item-text-color="props.itemTextColor"
            :label-color="renderedLabel"
            :width="props.width"
            :height="props.height"
            :radius="props.radius"
            :spread="props.spread"
            :lift="props.lift"
            :tilt="props.tilt"
            :flap-angle="props.flapAngle"
            :rest-angle="props.restAngle"
            :open-duration="props.openDuration"
            :stagger="props.stagger"
            :bounce="props.bounce"
          />
        </div>

        <Customize>
          <PreviewSelect
            title="Trigger"
            :options="TRIGGER_OPTIONS"
            :width="110"
            :model-value="props.trigger"
            @update:model-value="(val: string | number) => updateProp('trigger', val as FolderFloatTrigger)"
          />
          <PreviewInput
            title="Label"
            :max-length="24"
            :model-value="props.label"
            @update:model-value="(val: string) => updateProp('label', val)"
          />
          <PreviewInput
            title="Sublabel"
            :max-length="24"
            :model-value="props.sublabel"
            @update:model-value="(val: string) => updateProp('sublabel', val)"
          />
          <PreviewColorPickerCustom
            title="Folder"
            :color="renderedFolder"
            @change="(val: string) => updateProp('folderColor', val)"
          />
          <PreviewColorPickerCustom
            title="Front"
            :color="renderedFront"
            @change="(val: string) => updateProp('frontColor', val)"
          />
          <PreviewColorPickerCustom
            title="Paper"
            :color="renderedPaper"
            @change="(val: string) => updateProp('paperColor', val)"
          />
          <PreviewColorPickerCustom
            title="Item"
            :color="renderedItem"
            @change="(val: string) => updateProp('itemColor', val)"
          />
          <PreviewColorPickerCustom
            title="Item Text"
            :color="props.itemTextColor"
            @change="(val: string) => updateProp('itemTextColor', val)"
          />
          <PreviewColorPickerCustom
            title="Label"
            :color="renderedLabel"
            @change="(val: string) => updateProp('labelColor', val)"
          />
          <PreviewSlider
            title="Width"
            :min="140"
            :max="320"
            :step="4"
            value-unit="px"
            :model-value="props.width"
            @update:model-value="(val: number) => updateProp('width', val)"
          />
          <PreviewSlider
            title="Height"
            :min="100"
            :max="240"
            :step="4"
            value-unit="px"
            :model-value="props.height"
            @update:model-value="(val: number) => updateProp('height', val)"
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
            title="Spread"
            :min="100"
            :max="280"
            :step="5"
            value-unit="px"
            :model-value="props.spread"
            @update:model-value="(val: number) => updateProp('spread', val)"
          />
          <PreviewSlider
            title="Lift"
            :min="0"
            :max="80"
            :step="2"
            value-unit="px"
            :model-value="props.lift"
            @update:model-value="(val: number) => updateProp('lift', val)"
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
            title="Flap Angle"
            :min="0"
            :max="50"
            :step="1"
            value-unit="°"
            :model-value="props.flapAngle"
            @update:model-value="(val: number) => updateProp('flapAngle', val)"
          />
          <PreviewSlider
            title="Rest Angle"
            :min="0"
            :max="30"
            :step="1"
            value-unit="°"
            :model-value="props.restAngle"
            @update:model-value="(val: number) => updateProp('restAngle', val)"
          />
          <PreviewSlider
            title="Open"
            :min="200"
            :max="1000"
            :step="20"
            value-unit="ms"
            :model-value="props.openDuration"
            @update:model-value="(val: number) => updateProp('openDuration', val)"
          />
          <PreviewSlider
            title="Stagger"
            :min="0"
            :max="120"
            :step="5"
            value-unit="ms"
            :model-value="props.stagger"
            @update:model-value="(val: number) => updateProp('stagger', val)"
          />
          <PreviewSlider
            title="Bounce"
            :min="0"
            :max="0.6"
            :step="0.05"
            :model-value="props.bounce"
            @update:model-value="(val: number) => updateProp('bounce', val)"
          />
          <PreviewSwitch
            title="Close On Select"
            :model-value="props.closeOnSelect"
            @update:model-value="(val: boolean) => updateProp('closeOnSelect', val)"
          />
          <PreviewSwitch
            title="Physics"
            :model-value="props.physics"
            @update:model-value="(val: boolean) => updateProp('physics', val)"
          />
          <PreviewSlider
            title="Drift"
            :min="0"
            :max="1"
            :step="0.05"
            :is-disabled="!props.physics"
            :model-value="props.drift"
            @update:model-value="(val: number) => updateProp('drift', val)"
          />
        </Customize>

        <PropTable :data="propData" />
        <Dependencies :dependency-list="['matter-js']" />
      </template>

      <template #code>
        <CodeExample :code-object="folderFloat" component-name="FolderFloat" />
      </template>
    </TabsLayout>
  </ComponentPropsProvider>
</template>

<script setup lang="ts">
import CodeExample from '@/components/common/CodeExample.vue';
import Customize from '@/components/common/Customize.vue';
import Dependencies from '@/components/common/Dependencies.vue';
import PreviewColorPickerCustom from '@/components/common/PreviewColorPickerCustom.vue';
import PreviewInput from '@/components/common/PreviewInput.vue';
import PreviewSelect from '@/components/common/PreviewSelect.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import ComponentPropsProvider from '@/components/context/ComponentPropsProvider.vue';
import { useComponentProps } from '@/composables/useComponentProps';
import { useColorModeValue } from '@/composables/useTheme';
import { folderFloat } from '@/constants/code/Micro/folderFloatCode';
import FolderFloat, { type FolderFloatTrigger } from '@/content/Micro/FolderFloat/FolderFloat.vue';

const DEFAULT_PROPS = {
  label: 'Design feedback',
  sublabel: '',
  trigger: 'hover' as FolderFloatTrigger,
  closeOnSelect: true,
  physics: true,
  drift: 0.5,
  folderColor: '#3d403d',
  frontColor: '#4f5550',
  paperColor: '#f5f5f5',
  itemColor: '#f5f5f5',
  itemTextColor: '#161816',
  labelColor: '#f5f5f5',
  width: 200,
  height: 148,
  radius: 14,
  spread: 180,
  lift: 26,
  tilt: 8,
  flapAngle: 34,
  restAngle: 16,
  openDuration: 520,
  stagger: 45,
  bounce: 0.3
};

const TRIGGER_OPTIONS = [
  { value: 'hover', label: 'Hover' },
  { value: 'click', label: 'Click' }
];

const { props, updateProp, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);

type ColorKey = 'folderColor' | 'frontColor' | 'paperColor' | 'itemColor' | 'labelColor';
const light = (key: ColorKey, value: string) => () =>
  props.value[key] === DEFAULT_PROPS[key] ? value : props.value[key];

const renderedFolder = useColorModeValue(light('folderColor', '#d3d7d3'), () => props.value.folderColor);
const renderedFront = useColorModeValue(light('frontColor', '#e3e6e3'), () => props.value.frontColor);
const renderedPaper = useColorModeValue(light('paperColor', '#ffffff'), () => props.value.paperColor);
const renderedItem = useColorModeValue(light('itemColor', '#ffffff'), () => props.value.itemColor);
const renderedLabel = useColorModeValue(light('labelColor', '#161816'), () => props.value.labelColor);

const propData: PropRow[] = [
  {
    name: 'items',
    type: 'Array<string | { label, value }>',
    default: 'DEFAULT_ITEMS',
    description: 'The pills that float out. A string is its own value.'
  },
  { name: 'label', type: 'string', default: '"Design feedback"', description: 'The line on the flap.' },
  {
    name: 'sublabel',
    type: 'string',
    default: '""',
    description: 'The dimmer line under it. Empty counts the notes.'
  },
  {
    name: 'trigger',
    type: "'hover' | 'click'",
    default: "'hover'",
    description: 'Open on hover, or toggle on press.'
  },
  { name: 'defaultOpen', type: 'boolean', default: 'false', description: 'Start open.' },
  { name: 'closeOnSelect', type: 'boolean', default: 'true', description: 'Picking a pill closes the folder.' },
  {
    name: 'physics',
    type: 'boolean',
    default: 'true',
    description:
      'Once the pills land, a zero-gravity world takes over: they float, collide, and can be dragged and thrown inside the cloud.'
  },
  {
    name: 'drift',
    type: 'number',
    default: '0.5',
    description: 'Strength of the floating currents in the world. 0 holds still.'
  },
  { name: '@select', type: '(value, index) => void', default: '-', description: 'A pill was picked.' },
  { name: '@openChange', type: '(open) => void', default: '-', description: 'The folder opened or closed.' },
  { name: 'folderColor', type: 'string', default: '"#3d403d"', description: 'The back panel and its tab.' },
  { name: 'frontColor', type: 'string', default: '"#4f5550"', description: 'The flap.' },
  {
    name: 'paperColor',
    type: 'string',
    default: '"#f5f5f5"',
    description: 'The paper edge that rises as it opens.'
  },
  { name: 'itemColor', type: 'string', default: '"#f5f5f5"', description: 'The pills.' },
  { name: 'itemTextColor', type: 'string', default: '"#161816"', description: 'The pill text.' },
  { name: 'labelColor', type: 'string', default: '"#f5f5f5"', description: 'The flap text.' },
  { name: 'width', type: 'number', default: '200', description: 'Folder width in px.' },
  { name: 'height', type: 'number', default: '148', description: 'Folder height in px, below the tab.' },
  { name: 'radius', type: 'number', default: '14', description: 'Corner radius in px.' },
  {
    name: 'spread',
    type: 'number',
    default: '180',
    description: 'Half the widest the cloud may be, in px. Pills pack into rows within it.'
  },
  { name: 'lift', type: 'number', default: '26', description: 'Gap between the folder and the lowest row, in px.' },
  { name: 'tilt', type: 'number', default: '8', description: 'Most a pill leans, in degrees.' },
  {
    name: 'flapAngle',
    type: 'number',
    default: '34',
    description: 'How far the flap tilts toward you when open, in degrees.'
  },
  { name: 'restAngle', type: 'number', default: '16', description: 'The flap tilt when closed, in degrees.' },
  {
    name: 'openDuration',
    type: 'number',
    default: '520',
    description: "A pill's rise, in ms. The close is 60% of it."
  },
  {
    name: 'stagger',
    type: 'number',
    default: '45',
    description: 'Delay between pills, in ms. The close reverses the order.'
  },
  { name: 'bounce', type: 'number', default: '0.3', description: 'Overshoot of the rise. 0 lands dead.' },
  { name: 'className', type: 'string', default: '""', description: 'Extra classes for the root.' }
];
</script>
