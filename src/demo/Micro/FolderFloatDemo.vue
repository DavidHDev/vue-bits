<template>
  <h1 class="sub-category">Folder Float</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="folderFloat.usage"
    :source="folderFloatSource"
    component-name="FolderFloat"
    :props-table="props"
  >
    <template #preview>
      <div class="relative items-end! p-0 pb-11 h-100 overflow-hidden demo-container">
        <FolderFloat :key="key" v-bind="folderFloatProps" />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSelect title="Trigger" :options="TRIGGER_OPTIONS" :width="110" v-model="trigger" />
        <PreviewInput title="Label" :maxlength="24" v-model="label" />
        <PreviewInput title="Sublabel" :maxlength="24" v-model="sublabel" />
        <PreviewColorPicker title="Folder" v-model="folderColor" />
        <PreviewColorPicker title="Front" v-model="frontColor" />
        <PreviewColorPicker title="Paper" v-model="paperColor" />
        <PreviewColorPicker title="Item" v-model="itemColor" />
        <PreviewColorPicker title="Item Text" v-model="itemTextColor" />
        <PreviewColorPicker title="Label" v-model="labelColor" />
        <PreviewSlider title="Width" :min="140" :max="320" :step="4" valueUnit="px" v-model="width" />
        <PreviewSlider title="Height" :min="100" :max="240" :step="4" valueUnit="px" v-model="height" />
        <PreviewSlider title="Radius" :min="0" :max="28" :step="1" valueUnit="px" v-model="radius" />
        <PreviewSlider title="Spread" :min="100" :max="280" :step="5" valueUnit="px" v-model="spread" />
        <PreviewSlider title="Lift" :min="0" :max="80" :step="2" valueUnit="px" v-model="lift" />
        <PreviewSlider title="Tilt" :min="0" :max="20" :step="1" valueUnit="°" v-model="tilt" />
        <PreviewSlider title="Flap Angle" :min="0" :max="50" :step="1" valueUnit="°" v-model="flapAngle" />
        <PreviewSlider title="Rest Angle" :min="0" :max="30" :step="1" valueUnit="°" v-model="restAngle" />
        <PreviewSlider title="Open" :min="200" :max="1000" :step="20" valueUnit="ms" v-model="openDuration" />
        <PreviewSlider title="Stagger" :min="0" :max="120" :step="5" valueUnit="ms" v-model="stagger" />
        <PreviewSlider title="Bounce" :min="0" :max="0.6" :step="0.05" v-model="bounce" />
        <PreviewSwitch title="Close On Select" v-model="closeOnSelect" />
        <PreviewSwitch title="Physics" v-model="physics" />
        <PreviewSlider title="Drift" :min="0" :max="1" :step="0.05" :isDisabled="!physics" v-model="drift" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="folder-float" :usage="folderFloat.usage!" :source="folderFloatSource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewColorPicker from '@/components/common/PreviewColorPicker.vue';
import PreviewInput from '@/components/common/PreviewInput.vue';
import PreviewSelect from '@/components/common/PreviewSelect.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { folderFloat } from '@/constants/code/Micro/folderFloatCode';
import FolderFloat, { type FolderFloatTrigger } from '@/content/Micro/FolderFloat/FolderFloat.vue';
import folderFloatSource from '@/content/Micro/FolderFloat/FolderFloat.vue?raw';
import { computed, ref } from 'vue';

const { rerenderKey: key, forceRerender } = useForceRerender();

const DEFAULTS = {
  label: 'Design feedback',
  sublabel: '',
  trigger: 'hover' as FolderFloatTrigger,
  closeOnSelect: true,
  physics: true,
  drift: 0.5,
  folderColor: '#3f3f46',
  frontColor: '#52525b',
  paperColor: '#f5f5f5',
  itemColor: '#f5f5f5',
  itemTextColor: '#18181b',
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

const label = ref(DEFAULTS.label);
const sublabel = ref(DEFAULTS.sublabel);
const trigger = ref(DEFAULTS.trigger);
const closeOnSelect = ref(DEFAULTS.closeOnSelect);
const physics = ref(DEFAULTS.physics);
const drift = ref(DEFAULTS.drift);
const folderColor = ref(DEFAULTS.folderColor);
const frontColor = ref(DEFAULTS.frontColor);
const paperColor = ref(DEFAULTS.paperColor);
const itemColor = ref(DEFAULTS.itemColor);
const itemTextColor = ref(DEFAULTS.itemTextColor);
const labelColor = ref(DEFAULTS.labelColor);
const width = ref(DEFAULTS.width);
const height = ref(DEFAULTS.height);
const radius = ref(DEFAULTS.radius);
const spread = ref(DEFAULTS.spread);
const lift = ref(DEFAULTS.lift);
const tilt = ref(DEFAULTS.tilt);
const flapAngle = ref(DEFAULTS.flapAngle);
const restAngle = ref(DEFAULTS.restAngle);
const openDuration = ref(DEFAULTS.openDuration);
const stagger = ref(DEFAULTS.stagger);
const bounce = ref(DEFAULTS.bounce);

const folderFloatProps = computed(() => ({
  label: label.value,
  sublabel: sublabel.value,
  trigger: trigger.value,
  closeOnSelect: closeOnSelect.value,
  physics: physics.value,
  drift: drift.value,
  folderColor: folderColor.value,
  frontColor: frontColor.value,
  paperColor: paperColor.value,
  itemColor: itemColor.value,
  itemTextColor: itemTextColor.value,
  labelColor: labelColor.value,
  width: width.value,
  height: height.value,
  radius: radius.value,
  spread: spread.value,
  lift: lift.value,
  tilt: tilt.value,
  flapAngle: flapAngle.value,
  restAngle: restAngle.value,
  openDuration: openDuration.value,
  stagger: stagger.value,
  bounce: bounce.value
}));

const hasChanges = computed(
  () =>
    label.value !== DEFAULTS.label ||
    sublabel.value !== DEFAULTS.sublabel ||
    trigger.value !== DEFAULTS.trigger ||
    closeOnSelect.value !== DEFAULTS.closeOnSelect ||
    physics.value !== DEFAULTS.physics ||
    drift.value !== DEFAULTS.drift ||
    folderColor.value !== DEFAULTS.folderColor ||
    frontColor.value !== DEFAULTS.frontColor ||
    paperColor.value !== DEFAULTS.paperColor ||
    itemColor.value !== DEFAULTS.itemColor ||
    itemTextColor.value !== DEFAULTS.itemTextColor ||
    labelColor.value !== DEFAULTS.labelColor ||
    width.value !== DEFAULTS.width ||
    height.value !== DEFAULTS.height ||
    radius.value !== DEFAULTS.radius ||
    spread.value !== DEFAULTS.spread ||
    lift.value !== DEFAULTS.lift ||
    tilt.value !== DEFAULTS.tilt ||
    flapAngle.value !== DEFAULTS.flapAngle ||
    restAngle.value !== DEFAULTS.restAngle ||
    openDuration.value !== DEFAULTS.openDuration ||
    stagger.value !== DEFAULTS.stagger ||
    bounce.value !== DEFAULTS.bounce
);

function reset() {
  label.value = DEFAULTS.label;
  sublabel.value = DEFAULTS.sublabel;
  trigger.value = DEFAULTS.trigger;
  closeOnSelect.value = DEFAULTS.closeOnSelect;
  physics.value = DEFAULTS.physics;
  drift.value = DEFAULTS.drift;
  folderColor.value = DEFAULTS.folderColor;
  frontColor.value = DEFAULTS.frontColor;
  paperColor.value = DEFAULTS.paperColor;
  itemColor.value = DEFAULTS.itemColor;
  itemTextColor.value = DEFAULTS.itemTextColor;
  labelColor.value = DEFAULTS.labelColor;
  width.value = DEFAULTS.width;
  height.value = DEFAULTS.height;
  radius.value = DEFAULTS.radius;
  spread.value = DEFAULTS.spread;
  lift.value = DEFAULTS.lift;
  tilt.value = DEFAULTS.tilt;
  flapAngle.value = DEFAULTS.flapAngle;
  restAngle.value = DEFAULTS.restAngle;
  openDuration.value = DEFAULTS.openDuration;
  stagger.value = DEFAULTS.stagger;
  bounce.value = DEFAULTS.bounce;
  forceRerender();
}

const props: PropRow[] = [
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
  { name: 'folderColor', type: 'string', default: '"#3f3f46"', description: 'The back panel and its tab.' },
  { name: 'frontColor', type: 'string', default: '"#52525b"', description: 'The flap.' },
  {
    name: 'paperColor',
    type: 'string',
    default: '"#f5f5f5"',
    description: 'The paper edge that rises as it opens.'
  },
  { name: 'itemColor', type: 'string', default: '"#f5f5f5"', description: 'The pills.' },
  { name: 'itemTextColor', type: 'string', default: '"#18181b"', description: 'The pill text.' },
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
