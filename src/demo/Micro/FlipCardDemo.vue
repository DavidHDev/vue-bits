<template>
  <h1 class="sub-category">Flip Card</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="flipCard.usage"
    :source="flipCardSource"
    component-name="FlipCard"
    :props-table="props"
  >
    <template #preview>
      <div class="relative p-0 h-140 overflow-hidden demo-container">
        <FlipCard :key="key" v-bind="flipCardProps">
          <template #front>
            <img
              :src="IMAGE"
              alt="Wooded Landscape, 17th century"
              draggable="false"
              style="display: block; width: 100%; height: 100%; object-fit: cover"
            />
          </template>
          <template #back>
            <div style="position: relative; height: 100%; text-align: left">
              <img
                :src="IMAGE"
                alt=""
                draggable="false"
                style="
                  position: absolute;
                  inset: 0;
                  width: 100%;
                  height: 100%;
                  object-fit: cover;
                  transform: scaleX(-1);
                  filter: grayscale(1) contrast(1.1);
                  opacity: 0.34;
                "
              />
              <div
                style="
                  position: absolute;
                  inset: 0;
                  background: linear-gradient(
                    to bottom,
                    var(--fc-bg) 0%,
                    color-mix(in srgb, var(--fc-bg) 55%, transparent) 26%,
                    transparent 46%,
                    transparent 58%,
                    color-mix(in srgb, var(--fc-bg) 60%, transparent) 80%,
                    var(--fc-bg) 100%
                  );
                "
              />
              <div
                style="
                  position: relative;
                  display: flex;
                  flex-direction: column;
                  justify-content: space-between;
                  height: 100%;
                  padding: 26px 28px;
                  box-sizing: border-box;
                "
              >
                <span
                  style="
                    font-size: 27px;
                    font-weight: 500;
                    line-height: 1.1;
                    letter-spacing: -0.03em;
                    white-space: nowrap;
                  "
                >
                  Wooded Landscape
                </span>
                <div
                  style="
                    display: flex;
                    align-items: baseline;
                    justify-content: space-between;
                    gap: 16px;
                    font-size: 14px;
                    line-height: 1.2;
                    letter-spacing: 0.01em;
                    opacity: 0.7;
                  "
                >
                  <span>17th century</span>
                  <span>Rijksmuseum</span>
                </div>
              </div>
            </div>
          </template>
        </FlipCard>
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSelect title="Axis" :options="AXIS_OPTIONS" :width="140" v-model="axis" />
        <PreviewSwitch title="Flip On Click" v-model="flipOnClick" />
        <PreviewSwitch title="Draggable" v-model="draggable" />
        <PreviewSlider
          title="Drag Distance"
          :min="0"
          :max="600"
          :step="10"
          valueUnit="px"
          :isDisabled="!draggable"
          v-model="dragDistance"
        />
        <PreviewSwitch title="Tilt" v-model="tilt" />
        <PreviewSlider
          title="Tilt Max"
          :min="0"
          :max="30"
          :step="1"
          valueUnit="°"
          :isDisabled="!tilt"
          v-model="tiltMax"
        />
        <PreviewSwitch title="Glare" v-model="glare" />
        <PreviewSlider
          title="Glare Opacity"
          :min="0"
          :max="0.6"
          :step="0.02"
          :isDisabled="!glare"
          v-model="glareOpacity"
        />
        <PreviewSlider title="Hover Scale" :min="1" :max="1.1" :step="0.01" v-model="hoverScale" />
        <PreviewSlider title="Perspective" :min="400" :max="2400" :step="50" valueUnit="px" v-model="perspective" />
        <PreviewSlider title="Stiffness" :min="60" :max="500" :step="10" v-model="stiffness" />
        <PreviewSlider title="Damping" :min="6" :max="50" :step="1" v-model="damping" />
        <PreviewSlider title="Width" :min="180" :max="380" :step="10" valueUnit="px" v-model="width" />
        <PreviewSlider title="Height" :min="220" :max="460" :step="10" valueUnit="px" v-model="height" />
        <PreviewSlider title="Radius" :min="0" :max="48" :step="1" valueUnit="px" v-model="radius" />
        <PreviewColorPicker title="Background" v-model="background" />
        <PreviewColorPicker title="Color" v-model="color" />
        <PreviewSwitch title="Shadow" v-model="shadow" />
        <PreviewColorPicker title="Shadow Color" v-model="shadowColor" />
        <PreviewSlider
          title="Shadow Opacity"
          :min="0"
          :max="1"
          :step="0.05"
          :isDisabled="!shadow"
          v-model="shadowOpacity"
        />
        <PreviewSwitch title="Disabled" v-model="disabled" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="flip-card" :usage="flipCard.usage!" :source="flipCardSource" />
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
import { flipCard } from '@/constants/code/Micro/flipCardCode';
import FlipCard, { type FlipCardAxis } from '@/content/Micro/FlipCard/FlipCard.vue';
import flipCardSource from '@/content/Micro/FlipCard/FlipCard.vue?raw';
import { computed, ref } from 'vue';

const { rerenderKey: key, forceRerender } = useForceRerender();

const IMAGE =
  'https://images.unsplash.com/photo-1632231484562-3d2bed7e808d?q=80&w=1318&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

const DEFAULTS = {
  axis: 'y' as FlipCardAxis,
  flipOnClick: true,
  draggable: true,
  dragDistance: 0,
  tilt: true,
  tiltMax: 12,
  glare: true,
  glareOpacity: 0.22,
  hoverScale: 1.03,
  perspective: 1100,
  stiffness: 170,
  damping: 20,
  width: 300,
  height: 400,
  radius: 22,
  background: '#27272a',
  color: '#f5f5f5',
  shadow: true,
  shadowColor: '#000000',
  shadowOpacity: 0.45,
  disabled: false
};

const AXIS_OPTIONS = [
  { value: 'y', label: 'Horizontal' },
  { value: 'x', label: 'Vertical' }
];

const axis = ref(DEFAULTS.axis);
const flipOnClick = ref(DEFAULTS.flipOnClick);
const draggable = ref(DEFAULTS.draggable);
const dragDistance = ref(DEFAULTS.dragDistance);
const tilt = ref(DEFAULTS.tilt);
const tiltMax = ref(DEFAULTS.tiltMax);
const glare = ref(DEFAULTS.glare);
const glareOpacity = ref(DEFAULTS.glareOpacity);
const hoverScale = ref(DEFAULTS.hoverScale);
const perspective = ref(DEFAULTS.perspective);
const stiffness = ref(DEFAULTS.stiffness);
const damping = ref(DEFAULTS.damping);
const width = ref(DEFAULTS.width);
const height = ref(DEFAULTS.height);
const radius = ref(DEFAULTS.radius);
const background = ref(DEFAULTS.background);
const color = ref(DEFAULTS.color);
const shadow = ref(DEFAULTS.shadow);
const shadowColor = ref(DEFAULTS.shadowColor);
const shadowOpacity = ref(DEFAULTS.shadowOpacity);
const disabled = ref(DEFAULTS.disabled);

const flipCardProps = computed(() => ({
  axis: axis.value,
  flipOnClick: flipOnClick.value,
  draggable: draggable.value,
  dragDistance: dragDistance.value,
  tilt: tilt.value,
  tiltMax: tiltMax.value,
  glare: glare.value,
  glareOpacity: glareOpacity.value,
  hoverScale: hoverScale.value,
  perspective: perspective.value,
  stiffness: stiffness.value,
  damping: damping.value,
  width: width.value,
  height: height.value,
  radius: radius.value,
  background: background.value,
  color: color.value,
  shadow: shadow.value,
  shadowColor: shadowColor.value,
  shadowOpacity: shadowOpacity.value,
  disabled: disabled.value
}));

const hasChanges = computed(
  () =>
    axis.value !== DEFAULTS.axis ||
    flipOnClick.value !== DEFAULTS.flipOnClick ||
    draggable.value !== DEFAULTS.draggable ||
    dragDistance.value !== DEFAULTS.dragDistance ||
    tilt.value !== DEFAULTS.tilt ||
    tiltMax.value !== DEFAULTS.tiltMax ||
    glare.value !== DEFAULTS.glare ||
    glareOpacity.value !== DEFAULTS.glareOpacity ||
    hoverScale.value !== DEFAULTS.hoverScale ||
    perspective.value !== DEFAULTS.perspective ||
    stiffness.value !== DEFAULTS.stiffness ||
    damping.value !== DEFAULTS.damping ||
    width.value !== DEFAULTS.width ||
    height.value !== DEFAULTS.height ||
    radius.value !== DEFAULTS.radius ||
    background.value !== DEFAULTS.background ||
    color.value !== DEFAULTS.color ||
    shadow.value !== DEFAULTS.shadow ||
    shadowColor.value !== DEFAULTS.shadowColor ||
    shadowOpacity.value !== DEFAULTS.shadowOpacity ||
    disabled.value !== DEFAULTS.disabled
);

function reset() {
  axis.value = DEFAULTS.axis;
  flipOnClick.value = DEFAULTS.flipOnClick;
  draggable.value = DEFAULTS.draggable;
  dragDistance.value = DEFAULTS.dragDistance;
  tilt.value = DEFAULTS.tilt;
  tiltMax.value = DEFAULTS.tiltMax;
  glare.value = DEFAULTS.glare;
  glareOpacity.value = DEFAULTS.glareOpacity;
  hoverScale.value = DEFAULTS.hoverScale;
  perspective.value = DEFAULTS.perspective;
  stiffness.value = DEFAULTS.stiffness;
  damping.value = DEFAULTS.damping;
  width.value = DEFAULTS.width;
  height.value = DEFAULTS.height;
  radius.value = DEFAULTS.radius;
  background.value = DEFAULTS.background;
  color.value = DEFAULTS.color;
  shadow.value = DEFAULTS.shadow;
  shadowColor.value = DEFAULTS.shadowColor;
  shadowOpacity.value = DEFAULTS.shadowOpacity;
  disabled.value = DEFAULTS.disabled;
  forceRerender();
}

const props: PropRow[] = [
  { name: 'front (slot)', type: 'slot', default: 'empty', description: 'Content of the front face.' },
  { name: 'back (slot)', type: 'slot', default: 'empty', description: 'Content of the back face.' },
  {
    name: 'flipped',
    type: 'boolean',
    default: '-',
    description: 'Controlled state: true shows the back. Omit it to let the card manage itself.'
  },
  { name: 'defaultFlipped', type: 'boolean', default: 'false', description: 'Start on the back face.' },
  {
    name: '@flipChange',
    type: '(flipped: boolean) => void',
    default: '-',
    description: 'Emitted when a click, drag, flick or key lands on the other face.'
  },
  {
    name: 'axis',
    type: "'y' | 'x'",
    default: "'y'",
    description: 'y turns the card sideways and drags horizontally. x turns it over the top and drags vertically.'
  },
  {
    name: 'flipOnClick',
    type: 'boolean',
    default: 'true',
    description: 'A press without movement flips the card.'
  },
  {
    name: 'draggable',
    type: 'boolean',
    default: 'true',
    description:
      'Drag to turn the card by hand. On release it springs to the nearest face, carrying the flick velocity.'
  },
  {
    name: 'dragDistance',
    type: 'number',
    default: '0',
    description: 'Pixels of drag for a half turn. 0 uses the card width, or its height on the x axis.'
  },
  { name: 'tilt', type: 'boolean', default: 'true', description: 'The card leans toward the cursor on hover.' },
  { name: 'tiltMax', type: 'number', default: '12', description: 'Largest tilt angle in degrees.' },
  { name: 'glare', type: 'boolean', default: 'true', description: 'A soft sheen that follows the cursor.' },
  { name: 'glareOpacity', type: 'number', default: '0.22', description: 'Strength of the sheen at its centre.' },
  { name: 'hoverScale', type: 'number', default: '1.03', description: 'Lift while hovered or held.' },
  {
    name: 'perspective',
    type: 'number',
    default: '1100',
    description: 'Viewing distance in px. Smaller is more dramatic.'
  },
  { name: 'stiffness', type: 'number', default: '170', description: 'Stiffness of the flip spring.' },
  {
    name: 'damping',
    type: 'number',
    default: '20',
    description: 'Damping of the flip spring. Lower overshoots more.'
  },
  { name: 'width', type: 'number', default: '300', description: 'Card width in px, capped at the parent.' },
  { name: 'height', type: 'number', default: '400', description: 'Card height in px.' },
  { name: 'radius', type: 'number', default: '22', description: 'Corner radius in px.' },
  { name: 'background', type: 'string', default: '"#27272a"', description: 'Surface of both faces.' },
  { name: 'color', type: 'string', default: '"#f5f5f5"', description: 'Text colour of both faces.' },
  {
    name: 'shadow',
    type: 'boolean',
    default: 'true',
    description: 'A soft shadow beneath the card that narrows as it turns edge on.'
  },
  { name: 'shadowColor', type: 'string', default: '"#000000"', description: 'Shadow colour.' },
  { name: 'shadowOpacity', type: 'number', default: '0.45', description: 'Shadow strength.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Dimmed, flat and inert.' },
  {
    name: 'ariaLabel',
    type: 'string',
    default: '"Flip card"',
    description: 'Accessible name. The face is carried by aria-pressed.'
  },
  { name: 'className', type: 'string', default: '""', description: 'Extra classes for the root.' }
];
</script>
