<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
    :demo-only-props="['preset', 'color', 'cursorBallColor']"
    :computed-props="computedProps"
  >
    <TabsLayout>
      <template #preview>
        <div class="demo-container relative overflow-hidden" style="height: 480px; padding: 0">
          <MetaBalls
            :key="`${props.preset}-${props.intro}-${rerenderKey}`"
            v-bind="settings"
            :color="blobColor"
            :cursor-ball-color="cursorColor"
            :intro="props.intro"
            enable-transparency
          />
          <RefreshButton @click="forceRerender" />
        </div>

        <Customize>
          <PreviewSelect
            title="Preset"
            :options="PRESET_OPTIONS"
            :model-value="props.preset"
            @update:model-value="value => applyPreset(String(value))"
          />
          <PreviewSelect
            title="Variant"
            :options="VARIANT_OPTIONS"
            :model-value="props.variant"
            @update:model-value="value => updateProp('variant', value as Variant)"
          />
          <PreviewSelect
            title="Motion"
            :options="MOTION_OPTIONS"
            :model-value="props.motion"
            @update:model-value="value => updateProp('motion', value as Motion)"
          />
          <PreviewColorPickerCustom
            title="Color"
            :color="blobColor"
            @change="(value: string) => updateProp('color', value)"
          />
          <PreviewColorPickerCustom
            title="Cursor Color"
            :color="cursorColor"
            @change="(value: string) => updateProp('cursorBallColor', value)"
          />
          <PreviewSlider
            title="Ball Count"
            :min="2"
            :max="50"
            :step="1"
            :model-value="props.ballCount"
            @update:model-value="value => updateProp('ballCount', value)"
          />
          <PreviewSlider
            title="Speed"
            :min="0"
            :max="1.5"
            :step="0.05"
            :model-value="props.speed"
            @update:model-value="value => updateProp('speed', value)"
          />
          <PreviewSlider
            title="World Size"
            :min="10"
            :max="50"
            :step="1"
            :model-value="props.animationSize"
            @update:model-value="value => updateProp('animationSize', value)"
          />
          <PreviewSlider
            title="Clump Factor"
            :min="0.2"
            :max="2"
            :step="0.05"
            :model-value="props.clumpFactor"
            @update:model-value="value => updateProp('clumpFactor', value)"
          />
          <PreviewSlider
            title="Gooeyness"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.gooeyness"
            @update:model-value="value => updateProp('gooeyness', value)"
          />
          <PreviewSlider
            title="Stickiness"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.stickiness"
            @update:model-value="value => updateProp('stickiness', value)"
          />
          <PreviewSlider
            title="Stretch"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.stretch"
            @update:model-value="value => updateProp('stretch', value)"
          />
          <PreviewSlider
            title="Wobble"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.wobble"
            @update:model-value="value => updateProp('wobble', value)"
          />
          <PreviewSlider
            title="Cursor Size"
            :min="0"
            :max="6"
            :step="0.25"
            :model-value="props.cursorBallSize"
            @update:model-value="value => updateProp('cursorBallSize', value)"
          />
          <PreviewSlider
            title="Cursor Smoothing"
            :min="0.01"
            :max="0.3"
            :step="0.01"
            :is-disabled="!props.enableMouseInteraction"
            :model-value="props.hoverSmoothness"
            @update:model-value="value => updateProp('hoverSmoothness', value)"
          />
          <PreviewSlider
            title="Line Width"
            :min="0.5"
            :max="4"
            :step="0.25"
            value-unit="px"
            :is-disabled="props.variant === 'solid'"
            :model-value="props.lineWidth"
            @update:model-value="value => updateProp('lineWidth', value)"
          />
          <PreviewSlider
            title="Rings"
            :min="1"
            :max="8"
            :step="1"
            :is-disabled="props.variant !== 'contour'"
            :model-value="props.rings"
            @update:model-value="value => updateProp('rings', value)"
          />
          <PreviewSwitch
            title="Follow Cursor"
            :model-value="props.enableMouseInteraction"
            @update:model-value="value => updateProp('enableMouseInteraction', value)"
          />
          <PreviewSwitch
            title="Click Burst"
            :is-disabled="!props.enableMouseInteraction"
            :model-value="props.clickBurst"
            @update:model-value="value => updateProp('clickBurst', value)"
          />
          <PreviewSwitch
            title="Intro"
            :model-value="props.intro"
            @update:model-value="value => updateProp('intro', value)"
          />
        </Customize>

        <PropTable :data="propData" />
        <Dependencies :dependency-list="[]" />
      </template>

      <template #code>
        <CodeExample :code-object="metaBalls" component-name="MetaBalls" />
      </template>
    </TabsLayout>
  </ComponentPropsProvider>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import CodeExample from '@/components/common/CodeExample.vue';
import Customize from '@/components/common/Customize.vue';
import Dependencies from '@/components/common/Dependencies.vue';
import PreviewColorPickerCustom from '@/components/common/PreviewColorPickerCustom.vue';
import PreviewSelect from '@/components/common/PreviewSelect.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import RefreshButton from '@/components/common/RefreshButton.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import ComponentPropsProvider from '@/components/context/ComponentPropsProvider.vue';
import { useComponentProps } from '@/composables/useComponentProps';
import { useForceRerender } from '@/composables/useForceRerender';
import { useColorModeValue } from '@/composables/useTheme';
import { metaBalls } from '@/constants/code/Animations/metaBallsCode';
import MetaBalls from '@/content/Animations/MetaBalls/MetaBalls.vue';

type Variant = 'solid' | 'outline' | 'contour';
type Motion = 'orbit' | 'drift' | 'lava';

const SHAPE = {
  variant: 'solid' as Variant,
  motion: 'orbit' as Motion,
  speed: 0.3,
  animationSize: 30,
  ballCount: 15,
  clumpFactor: 1,
  cursorBallSize: 3,
  hoverSmoothness: 0.1,
  gooeyness: 0.5,
  stickiness: 0.5,
  stretch: 0.5,
  wobble: 0.5,
  lineWidth: 1.5,
  rings: 4
};

const DEFAULT_PROPS = {
  preset: 'classic',
  color: '',
  cursorBallColor: '',
  ...SHAPE,
  enableMouseInteraction: true,
  clickBurst: true,
  intro: true
};

type DemoProps = typeof DEFAULT_PROPS;

const PRESETS: Record<string, Partial<DemoProps>> = {
  classic: {},
  jelly: { ballCount: 12, stickiness: 0.85, stretch: 0.9, wobble: 0.9, gooeyness: 0.6, cursorBallSize: 3.5 },
  contour: { variant: 'contour', motion: 'drift', animationSize: 18, ballCount: 10, lineWidth: 1, rings: 5 },
  lava: {
    motion: 'lava',
    animationSize: 16,
    ballCount: 9,
    speed: 0.6,
    gooeyness: 0.6,
    stickiness: 0.8,
    color: '#ff5a1f',
    cursorBallColor: '#ff5a1f'
  },
  outline: { variant: 'outline', gooeyness: 0.65, lineWidth: 1.5 },
  duo: { ballCount: 18, gooeyness: 0.6, cursorBallSize: 4, cursorBallColor: '#3b82f6' }
};

const PRESET_OPTIONS = [
  { value: 'classic', label: 'Classic' },
  { value: 'jelly', label: 'Jelly' },
  { value: 'contour', label: 'Contour' },
  { value: 'lava', label: 'Lava' },
  { value: 'outline', label: 'Outline' },
  { value: 'duo', label: 'Duo' }
];

const VARIANT_OPTIONS = [
  { value: 'solid', label: 'Solid' },
  { value: 'outline', label: 'Outline' },
  { value: 'contour', label: 'Contour' }
];

const MOTION_OPTIONS = [
  { value: 'orbit', label: 'Orbit' },
  { value: 'drift', label: 'Drift' },
  { value: 'lava', label: 'Lava' }
];

const propData: PropRow[] = [
  { name: 'color', type: 'string', default: "'#ffffff'", description: 'Color of the blobs.' },
  {
    name: 'cursorBallColor',
    type: 'string',
    default: "'#ffffff'",
    description: 'Color of the cursor blob. It blends smoothly into any blob it merges with.'
  },
  {
    name: 'variant',
    type: "'solid' | 'outline' | 'contour'",
    default: "'solid'",
    description: 'Filled blobs, a single outline, or an outline with contour rings around it.'
  },
  {
    name: 'motion',
    type: "'orbit' | 'drift' | 'lava'",
    default: "'orbit'",
    description:
      'How the blobs move: orbiting a cluster, drifting across the area, or rising and sinking like a lava lamp.'
  },
  { name: 'speed', type: 'number', default: '0.3', description: 'Speed of the motion.' },
  {
    name: 'animationSize',
    type: 'number',
    default: '30',
    description: 'Size of the world shown in the view. Higher values zoom out and make the blobs smaller.'
  },
  { name: 'ballCount', type: 'number', default: '15', description: 'Number of blobs, up to 50.' },
  {
    name: 'clumpFactor',
    type: 'number',
    default: '1',
    description: 'How far the blobs travel from the center. Lower values pack them together.'
  },
  {
    name: 'gooeyness',
    type: 'number',
    default: '0.5',
    description: 'How far blobs reach toward each other before merging, from 0 to 1. 0.5 is the classic look.'
  },
  {
    name: 'stickiness',
    type: 'number',
    default: '0.5',
    description: 'How strongly merged blobs cling together before the neck between them snaps, from 0 to 1.'
  },
  {
    name: 'stretch',
    type: 'number',
    default: '0.5',
    description: 'How much blobs stretch in the direction they move, from 0 to 1.'
  },
  {
    name: 'wobble',
    type: 'number',
    default: '0.5',
    description: 'How much blobs jiggle after stretching or being pushed, from 0 to 1.'
  },
  {
    name: 'enableMouseInteraction',
    type: 'boolean',
    default: 'true',
    description: 'The cursor blob follows the pointer and pushes the others aside. It orbits on its own otherwise.'
  },
  { name: 'cursorBallSize', type: 'number', default: '3', description: 'Size of the cursor blob.' },
  {
    name: 'hoverSmoothness',
    type: 'number',
    default: '0.1',
    description: 'How quickly the cursor blob catches up with the pointer. Lower is smoother.'
  },
  {
    name: 'clickBurst',
    type: 'boolean',
    default: 'true',
    description: 'Clicking makes the cursor blob pulse and splash the others outward before they flow back.'
  },
  {
    name: 'lineWidth',
    type: 'number',
    default: '1.5',
    description: 'Width of the lines in the outline and contour variants, in px.'
  },
  { name: 'rings', type: 'number', default: '4', description: 'Number of contour rings around the outline.' },
  {
    name: 'intro',
    type: 'boolean',
    default: 'true',
    description: 'Starts as a single drop that buds into the blobs the first time it comes into view.'
  },
  {
    name: 'enableTransparency',
    type: 'boolean',
    default: 'false',
    description: 'Renders on a transparent background instead of black.'
  },
  { name: 'paused', type: 'boolean', default: 'false', description: 'Freezes the animation.' },
  { name: 'dpr', type: 'number', default: 'auto', description: 'Maximum device pixel ratio, capped at 2.' },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the container.' },
  { name: 'style', type: 'StyleValue', default: '-', description: 'Inline styles for the container.' }
];

const { rerenderKey, forceRerender } = useForceRerender();
const { props, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);

const settings = computed(() => {
  const { preset: _preset, color: _color, cursorBallColor: _cursorBallColor, intro: _intro, ...rest } = props.value;
  return rest;
});

const ink = useColorModeValue('#161816', '#ffffff');
const blobColor = computed(() => props.value.color || ink.value);
const cursorColor = computed(() => props.value.cursorBallColor || ink.value);

const computedProps = computed(() => ({
  color: blobColor.value,
  cursorBallColor: cursorColor.value,
  enableTransparency: true
}));

const applyPreset = (value: string) => {
  updateProps({ ...DEFAULT_PROPS, ...PRESETS[value], preset: value });
};
</script>
