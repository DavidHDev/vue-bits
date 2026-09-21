<template>
  <h1 class="sub-category">Tear Ticket</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="tearTicket.usage"
    :source="tearTicketSource"
    component-name="TearTicket"
    :props-table="props"
  >
    <template #preview>
      <div class="relative p-0 h-140 overflow-hidden demo-container">
        <RefreshButton @click="run++" />
        <TearTicket
          :key="run"
          :image="IMAGE"
          image-alt="Visitors in a walkway of coloured glass"
          :orientation="orientation"
          :scrim="scrim"
          :image-radius="innerRadius"
          :width="width"
          :height="height"
          :stub-size="stubSize"
          :radius="radius"
          :holes="holes"
          :hole-size="holeSize"
          :notch="notch"
          :roughness="roughness"
          :tear-angle="tearAngle"
          :stretch="stretch"
          :resistance="resistance"
          :rotate="rotate"
          :tilt="tilt"
          :tilt-max="tiltMax"
          :tilt-reach="tiltReach"
          :parallax="parallax"
          :perspective="perspective"
          :background="background"
          :color="color"
          :border="border"
          :border-color="borderColor"
          :border-width="borderWidth"
          :recenter="recenter"
          :disabled="disabled"
        >
          <div
            class="box-border flex justify-between items-center gap-3.5 px-6 h-full"
            style="padding-top: calc(var(--tt-body-h) * var(--tt-span) - var(--tt-inset))"
          >
            <span class="font-medium text-[15px] leading-none tracking-[-0.01em]">Spectrum</span>
            <span class="opacity-45 text-[13px] leading-none">14 Nov</span>
          </div>
          <template #stub>
            <div
              v-if="orientation === 'vertical'"
              class="box-border flex flex-col justify-between px-6 pt-8 pb-7.5 h-full text-left"
            >
              <span class="font-medium text-[17px] leading-none tracking-[-0.01em]">Admit one</span>
              <div class="flex justify-between items-end gap-3.5">
                <span class="opacity-50 text-[12px] leading-none">Rooftop gallery · Until 30 Nov</span>
                <span class="opacity-45 tabular-nums text-[13px] leading-none">No. 284619</span>
              </div>
            </div>
            <div v-else class="relative h-full text-left">
              <div class="pt-7.5 pr-5 pl-6.5">
                <div class="flex flex-col">
                  <span class="font-medium text-[17px] leading-[1.2] tracking-[-0.01em]">Admit one</span>
                  <span class="opacity-50 mt-2 text-[12px] leading-[1.55]">
                    Rooftop gallery
                    <br />
                    Until 30 Nov
                  </span>
                </div>
              </div>
              <span class="bottom-7.5 left-6.5 absolute opacity-45 tabular-nums text-[13px] leading-none">
                No. 284619
              </span>
            </div>
          </template>
        </TearTicket>
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSelect
          title="Orientation"
          :options="ORIENTATION_OPTIONS"
          :width="150"
          :model-value="orientation"
          @update:model-value="setOrientation($event as TearTicketOrientation)"
        />
        <PreviewSwitch title="Scrim" v-model="scrim" />
        <PreviewSlider title="Width" :min="220" :max="560" :step="10" valueUnit="px" v-model="width" />
        <PreviewSlider title="Height" :min="140" :max="460" :step="10" valueUnit="px" v-model="height" />
        <PreviewSlider title="Stub Size" :min="70" :max="180" :step="2" valueUnit="px" v-model="stubSize" />
        <PreviewSlider title="Radius" :min="0" :max="32" :step="1" valueUnit="px" v-model="radius" />
        <PreviewSlider title="Holes" :min="6" :max="44" :step="1" v-model="holes" />
        <PreviewSlider title="Hole Size" :min="1" :max="8" :step="0.2" valueUnit="px" v-model="holeSize" />
        <PreviewSlider title="Notch" :min="0" :max="16" :step="1" valueUnit="px" v-model="notch" />
        <PreviewSlider title="Roughness" :min="0" :max="3" :step="0.1" valueUnit="px" v-model="roughness" />
        <PreviewSlider title="Tear Angle" :min="12" :max="60" :step="1" valueUnit="°" v-model="tearAngle" />
        <PreviewSlider title="Stretch" :min="2" :max="60" :step="1" valueUnit="px" v-model="stretch" />
        <PreviewSlider title="Resistance" :min="0" :max="0.9" :step="0.05" v-model="resistance" />
        <PreviewSlider title="Rotate" :min="-20" :max="20" :step="1" valueUnit="°" v-model="rotate" />
        <PreviewSwitch title="Tilt" v-model="tilt" />
        <PreviewSlider
          title="Tilt Max"
          :min="0"
          :max="24"
          :step="1"
          valueUnit="°"
          :isDisabled="!tilt"
          v-model="tiltMax"
        />
        <PreviewSlider
          title="Tilt Reach"
          :min="0"
          :max="700"
          :step="20"
          valueUnit="px"
          :isDisabled="!tilt"
          v-model="tiltReach"
        />
        <PreviewSlider
          title="Parallax"
          :min="0"
          :max="32"
          :step="1"
          valueUnit="px"
          :isDisabled="!tilt"
          v-model="parallax"
        />
        <PreviewSlider title="Perspective" :min="400" :max="2400" :step="50" valueUnit="px" v-model="perspective" />
        <PreviewColorPicker title="Background" v-model="background" />
        <PreviewColorPicker title="Color" v-model="color" />
        <PreviewSwitch title="Border" v-model="border" />
        <PreviewSlider
          title="Border Width"
          :min="0.5"
          :max="4"
          :step="0.5"
          valueUnit="px"
          :isDisabled="!border"
          v-model="borderWidth"
        />
        <PreviewSwitch title="Recenter" v-model="recenter" />
        <PreviewSwitch title="Disabled" v-model="disabled" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="tear-ticket" :usage="tearTicket.usage!" :source="tearTicketSource" />
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
import RefreshButton from '@/components/common/RefreshButton.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { tearTicket } from '@/constants/code/Micro/tearTicketCode';
import TearTicket, { type TearTicketOrientation } from '@/content/Micro/TearTicket/TearTicket.vue';
import tearTicketSource from '@/content/Micro/TearTicket/TearTicket.vue?raw';
import { computed, ref } from 'vue';

const IMAGE =
  'https://images.unsplash.com/photo-1604852961945-155837ffebe2?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

const DEFAULTS = {
  orientation: 'horizontal' as TearTicketOrientation,
  scrim: false,
  width: 460,
  height: 250,
  stubSize: 150,
  radius: 16,
  holes: 12,
  holeSize: 6,
  notch: 3,
  roughness: 0,
  tearAngle: 30,
  stretch: 30,
  resistance: 0.45,
  rotate: 4,
  tilt: true,
  tiltMax: 9,
  tiltReach: 260,
  parallax: 6,
  perspective: 1000,
  background: '#27272a',
  color: '#f5f5f5',
  border: true,
  borderColor: '',
  borderWidth: 1,
  recenter: true,
  disabled: false
};

const ORIENTATION_OPTIONS = [
  { value: 'horizontal', label: 'Horizontal' },
  { value: 'vertical', label: 'Vertical' }
];
const SIZES = {
  horizontal: { width: 460, height: 250, stubSize: 150 },
  vertical: { width: 300, height: 440, stubSize: 130 }
};

const orientation = ref(DEFAULTS.orientation);
const scrim = ref(DEFAULTS.scrim);
const width = ref(DEFAULTS.width);
const height = ref(DEFAULTS.height);
const stubSize = ref(DEFAULTS.stubSize);
const radius = ref(DEFAULTS.radius);
const holes = ref(DEFAULTS.holes);
const holeSize = ref(DEFAULTS.holeSize);
const notch = ref(DEFAULTS.notch);
const roughness = ref(DEFAULTS.roughness);
const tearAngle = ref(DEFAULTS.tearAngle);
const stretch = ref(DEFAULTS.stretch);
const resistance = ref(DEFAULTS.resistance);
const rotate = ref(DEFAULTS.rotate);
const tilt = ref(DEFAULTS.tilt);
const tiltMax = ref(DEFAULTS.tiltMax);
const tiltReach = ref(DEFAULTS.tiltReach);
const parallax = ref(DEFAULTS.parallax);
const perspective = ref(DEFAULTS.perspective);
const background = ref(DEFAULTS.background);
const color = ref(DEFAULTS.color);
const border = ref(DEFAULTS.border);
const borderColor = ref(DEFAULTS.borderColor);
const borderWidth = ref(DEFAULTS.borderWidth);
const recenter = ref(DEFAULTS.recenter);
const disabled = ref(DEFAULTS.disabled);
const run = ref(0);

const innerRadius = computed(() => Math.max(0, radius.value - 8));

const setOrientation = (val: TearTicketOrientation) => {
  orientation.value = val;
  const size = SIZES[val] ?? SIZES.horizontal;
  width.value = size.width;
  height.value = size.height;
  stubSize.value = size.stubSize;
  run.value++;
};

const state = {
  orientation,
  scrim,
  width,
  height,
  stubSize,
  radius,
  holes,
  holeSize,
  notch,
  roughness,
  tearAngle,
  stretch,
  resistance,
  rotate,
  tilt,
  tiltMax,
  tiltReach,
  parallax,
  perspective,
  background,
  color,
  border,
  borderColor,
  borderWidth,
  recenter,
  disabled
};
const keys = Object.keys(DEFAULTS) as (keyof typeof DEFAULTS)[];
const hasChanges = computed(() => keys.some(k => state[k].value !== DEFAULTS[k]));
function reset() {
  keys.forEach(k => ((state[k] as { value: unknown }).value = DEFAULTS[k]));
  run.value++;
}

const props: PropRow[] = [
  { name: 'default slot', type: 'VNode', default: '-', description: 'Content of the ticket body.' },
  { name: '#stub', type: 'VNode', default: '-', description: 'Content of the tear-off stub.' },
  {
    name: 'image',
    type: 'string',
    default: '""',
    description: 'Artwork behind the body. It shifts against the tilt for parallax and turns grey once used.'
  },
  { name: 'imageAlt', type: 'string', default: '""', description: 'Alt text for the artwork.' },
  {
    name: 'scrim',
    type: 'boolean',
    default: 'true',
    description: 'A fade from the paper colour up over the artwork, so text stays readable on busy images.'
  },
  {
    name: 'imageRadius',
    type: 'number',
    default: '8',
    description: 'Corner radius of the artwork panel, in px. Set it to the ticket radius minus 8 to stay concentric.'
  },
  {
    name: 'orientation',
    type: '"horizontal" | "vertical"',
    default: '"horizontal"',
    description: 'Horizontal puts the stub on the right. Vertical puts the artwork on top and the stub at the bottom.'
  },
  {
    name: 'torn',
    type: 'boolean',
    default: '-',
    description: 'Controlled state. Set it back to false to restore the stub.'
  },
  { name: 'defaultTorn', type: 'boolean', default: 'false', description: 'Start already used.' },
  { name: '@tear', type: '() => void', default: '-', description: 'Fires once the stub has come free and gone.' },
  {
    name: 'width',
    type: 'number',
    default: '460',
    description: 'Ticket width in px. It scales down to fit a narrower parent.'
  },
  { name: 'height', type: 'number', default: '250', description: 'Ticket height in px.' },
  {
    name: 'stubSize',
    type: 'number',
    default: '150',
    description: 'Size of the stub along the ticket, in px: its width when horizontal, its height when vertical.'
  },
  { name: 'radius', type: 'number', default: '16', description: 'Outer corner radius in px.' },
  { name: 'holes', type: 'number', default: '12', description: 'Perforation holes along the tear line.' },
  { name: 'holeSize', type: 'number', default: '6', description: 'Hole diameter in px.' },
  {
    name: 'notch',
    type: 'number',
    default: '3',
    description: 'Radius of the notches at both ends of the tear line.'
  },
  {
    name: 'roughness',
    type: 'number',
    default: '0',
    description:
      'Optional jitter of the torn line between holes, in px. 0 keeps the edge perfectly straight and symmetrical.'
  },
  {
    name: 'tearAngle',
    type: 'number',
    default: '30',
    description: 'Degrees of pull at which the last bridge gives way and the stub comes free.'
  },
  {
    name: 'stretch',
    type: 'number',
    default: '30',
    description: 'How far a paper bridge stretches before it snaps, in px. Bridges far from the hinge reach it first.'
  },
  {
    name: 'resistance',
    type: 'number',
    default: '0.45',
    description:
      'How much the intact fibres hold the stub back, 0 to 1. The pull eases as bridges give way, so the paper fights hardest at the start.'
  },
  {
    name: 'rotate',
    type: 'number',
    default: '4',
    description: 'A resting tilt of the whole ticket in the page plane, in degrees.'
  },
  { name: 'tilt', type: 'boolean', default: 'true', description: 'The ticket leans toward the cursor in 3D.' },
  { name: 'tiltMax', type: 'number', default: '9', description: 'Largest tilt angle in degrees.' },
  {
    name: 'tiltReach',
    type: 'number',
    default: '260',
    description: 'How far beyond the ticket the pointer still steers the tilt, in px. The tilt tracks the whole page.'
  },
  {
    name: 'parallax',
    type: 'number',
    default: '6',
    description: 'How far the artwork travels against the tilt, in px.'
  },
  { name: 'perspective', type: 'number', default: '1000', description: 'Viewing distance in px.' },
  { name: 'background', type: 'string', default: '"#27272a"', description: 'Paper colour, also used by the fibres.' },
  { name: 'color', type: 'string', default: '"#f5f5f5"', description: 'Text colour.' },
  {
    name: 'border',
    type: 'boolean',
    default: 'true',
    description: 'A hairline drawn along the cut edge of each piece, following every hole and notch.'
  },
  {
    name: 'borderColor',
    type: 'string',
    default: '""',
    description: 'Colour of that hairline. Empty derives a faint tint of the text colour.'
  },
  { name: 'borderWidth', type: 'number', default: '1', description: 'Thickness of the hairline in px.' },
  {
    name: 'stubBackground',
    type: 'string',
    default: '""',
    description: 'Stub paper colour. Empty follows background.'
  },
  {
    name: 'recenter',
    type: 'boolean',
    default: 'true',
    description: 'Once the stub is gone, the remaining ticket glides over to sit centred in its original box.'
  },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Dimmed and inert.' },
  {
    name: 'ariaLabel',
    type: 'string',
    default: '"Tear off the stub"',
    description: 'Accessible name of the stub. Enter or Space tears it.'
  },
  { name: 'className', type: 'string', default: '""', description: 'Extra classes for the root.' }
];
</script>
