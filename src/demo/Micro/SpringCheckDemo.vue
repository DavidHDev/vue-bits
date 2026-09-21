<template>
  <h1 class="sub-category">Spring Check</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="springCheck.usage"
    :source="springCheckSource"
    component-name="SpringCheck"
    :props-table="props"
  >
    <template #preview>
      <div class="relative p-0 h-100 overflow-hidden demo-container">
        <div :key="key" class="flex flex-col items-start gap-1 min-w-65">
          <SpringCheck
            v-for="row in ROWS"
            :key="row.label"
            :label="row.label"
            :default-checked="row.defaultChecked"
            :disabled="disabled"
            :color="color"
            :fill-color="fillColor"
            :check-color="checkColor"
            :box-size="boxSize"
            :box-radius="boxRadius"
            :font-size="fontSize"
            :bounce="bounce"
            :strike-lag="strikeLag"
            :done-opacity="doneOpacity"
            :strike="strike"
          />
        </div>
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewColorPicker title="Ink" v-model="color" />
        <PreviewColorPicker title="Fill" v-model="fillColor" />
        <PreviewColorPicker title="Check" v-model="checkColor" />
        <PreviewSlider title="Box Size" :min="16" :max="40" :step="1" valueUnit="px" v-model="boxSize" />
        <PreviewSlider title="Box Radius" :min="0" :max="20" :step="1" valueUnit="px" v-model="boxRadius" />
        <PreviewSlider title="Font Size" :min="12" :max="28" :step="1" valueUnit="px" v-model="fontSize" />
        <PreviewSlider title="Bounce" :min="0" :max="0.5" :step="0.05" v-model="bounce" />
        <PreviewSlider title="Strike Lag" :min="0" :max="0.5" :step="0.02" v-model="strikeLag" />
        <PreviewSlider title="Done Opacity" :min="0.2" :max="0.8" :step="0.02" v-model="doneOpacity" />
        <PreviewSelect title="Strike" :options="STRIKE_OPTIONS" :width="120" v-model="strike" />
        <PreviewSwitch title="Disabled" v-model="disabled" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="spring-check" :usage="springCheck.usage!" :source="springCheckSource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewColorPicker from '@/components/common/PreviewColorPicker.vue';
import PreviewSelect from '@/components/common/PreviewSelect.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { springCheck } from '@/constants/code/Micro/springCheckCode';
import SpringCheck, { type StrikeSide } from '@/content/Micro/SpringCheck/SpringCheck.vue';
import springCheckSource from '@/content/Micro/SpringCheck/SpringCheck.vue?raw';
import { computed, ref } from 'vue';

const { rerenderKey: key, forceRerender } = useForceRerender();

const DEFAULTS = {
  color: '#ffffff',
  fillColor: '#ffffff',
  checkColor: '#0b0b0f',
  boxSize: 28,
  boxRadius: 9,
  fontSize: 18,
  bounce: 0.2,
  strikeLag: 0.12,
  doneOpacity: 0.42,
  strike: 'left' as StrikeSide,
  disabled: false
};

const STRIKE_OPTIONS = [
  { value: 'left', label: 'Left' },
  { value: 'center', label: 'Center' },
  { value: 'right', label: 'Right' },
  { value: 'none', label: 'None' }
];

const ROWS = [
  { label: 'Ship the build', defaultChecked: false },
  { label: 'Update the changelog', defaultChecked: false },
  { label: 'Book the launch call', defaultChecked: true }
];

const color = ref(DEFAULTS.color);
const fillColor = ref(DEFAULTS.fillColor);
const checkColor = ref(DEFAULTS.checkColor);
const boxSize = ref(DEFAULTS.boxSize);
const boxRadius = ref(DEFAULTS.boxRadius);
const fontSize = ref(DEFAULTS.fontSize);
const bounce = ref(DEFAULTS.bounce);
const strikeLag = ref(DEFAULTS.strikeLag);
const doneOpacity = ref(DEFAULTS.doneOpacity);
const strike = ref(DEFAULTS.strike);
const disabled = ref(DEFAULTS.disabled);

const hasChanges = computed(
  () =>
    color.value !== DEFAULTS.color ||
    fillColor.value !== DEFAULTS.fillColor ||
    checkColor.value !== DEFAULTS.checkColor ||
    boxSize.value !== DEFAULTS.boxSize ||
    boxRadius.value !== DEFAULTS.boxRadius ||
    fontSize.value !== DEFAULTS.fontSize ||
    bounce.value !== DEFAULTS.bounce ||
    strikeLag.value !== DEFAULTS.strikeLag ||
    doneOpacity.value !== DEFAULTS.doneOpacity ||
    strike.value !== DEFAULTS.strike ||
    disabled.value !== DEFAULTS.disabled
);

function reset() {
  color.value = DEFAULTS.color;
  fillColor.value = DEFAULTS.fillColor;
  checkColor.value = DEFAULTS.checkColor;
  boxSize.value = DEFAULTS.boxSize;
  boxRadius.value = DEFAULTS.boxRadius;
  fontSize.value = DEFAULTS.fontSize;
  bounce.value = DEFAULTS.bounce;
  strikeLag.value = DEFAULTS.strikeLag;
  doneOpacity.value = DEFAULTS.doneOpacity;
  strike.value = DEFAULTS.strike;
  disabled.value = DEFAULTS.disabled;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'label',
    type: 'string',
    default: '"Ship the build"',
    description: 'The words beside the box; the strike-through is exactly their width. Or use the default slot.'
  },
  {
    name: 'checked',
    type: 'boolean',
    default: 'undefined',
    description: 'Controlled state. A change from outside animates on the spring.'
  },
  { name: 'defaultChecked', type: 'boolean', default: 'false', description: 'Initial state when uncontrolled.' },
  { name: '@change', type: '(checked: boolean) => void', default: '-', description: 'Emitted on every toggle.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Dims the row and ignores input.' },
  {
    name: 'color',
    type: 'string',
    default: '"#ffffff"',
    description: 'Ink: the label, the ring, the rule and the focus outline.'
  },
  {
    name: 'fillColor',
    type: 'string',
    default: '"#ffffff"',
    description: 'The fill that swells out of the box centre.'
  },
  {
    name: 'checkColor',
    type: 'string',
    default: '"#0b0b0f"',
    description: 'Stroke of the tick drawn over the fill.'
  },
  {
    name: 'boxSize',
    type: 'number',
    default: '28',
    description: 'Box side in pixels; ring, gap and row height derive from it.'
  },
  {
    name: 'boxRadius',
    type: 'number',
    default: '9',
    description: 'Box corner radius in pixels; half the size makes a circle.'
  },
  {
    name: 'fontSize',
    type: 'number',
    default: '18',
    description: 'Label size in pixels; the rule thickness derives from it.'
  },
  {
    name: 'bounce',
    type: 'number',
    default: '0.2',
    description: 'How far the fill swells past full. 0 arrives dead, 0.5 rebounds twice.'
  },
  {
    name: 'strikeLag',
    type: 'number',
    default: '0.12',
    description: 'Where on the spring the rule starts: 0 wipes with the fill, 0.4 waits for the tick.'
  },
  {
    name: 'doneOpacity',
    type: 'number',
    default: '0.42',
    description: 'How much ink the words keep once checked.'
  },
  {
    name: 'strike',
    type: '"left" | "center" | "right" | "none"',
    default: '"left"',
    description: 'Where the strike-through wipes from, or no rule at all.'
  },
  { name: 'ariaLabel', type: 'string', default: '-', description: 'Accessible name when the label is not text.' },
  { name: 'className', type: 'string', default: '""', description: 'Extra classes for the row.' }
];
</script>
