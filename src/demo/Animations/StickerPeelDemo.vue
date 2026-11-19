<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
    :demo-only-props="['preset', 'sticker']"
  >
    <TabsLayout>
      <template #preview>
        <div class="demo-container relative overflow-hidden" style="height: 500px; padding: 0">
          <StickerPeel :key="rerenderKey" :image-src="imageSrc" v-bind="settings" />
          <RefreshButton @click="forceRerender" />
        </div>

        <Customize>
          <PreviewSelect
            title="Preset"
            :options="PRESET_OPTIONS"
            :model-value="props.preset"
            @update:model-value="applyPreset"
          />
          <PreviewSelect
            title="Sticker"
            :options="STICKER_OPTIONS"
            :model-value="props.sticker"
            @update:model-value="value => updateProp('sticker', value as StickerKey)"
          />
          <PreviewSelect
            title="Finish"
            :options="FINISH_OPTIONS"
            :model-value="props.finish"
            @update:model-value="value => updateProp('finish', value as StickerFinish)"
          />
          <PreviewColorPickerCustom
            title="Back Color"
            :color="props.backColor"
            @change="(value: string) => updateProp('backColor', value)"
          />
          <PreviewSlider
            title="Width"
            :min="100"
            :max="320"
            :step="5"
            value-unit="px"
            :model-value="props.width"
            @update:model-value="value => updateProp('width', value)"
          />
          <PreviewSlider
            title="Rotate"
            :min="-45"
            :max="45"
            :step="1"
            value-unit="°"
            :model-value="props.rotate"
            @update:model-value="value => updateProp('rotate', value)"
          />
          <PreviewSlider
            title="Peel Direction"
            :min="0"
            :max="360"
            :step="1"
            value-unit="°"
            :model-value="props.peelDirection"
            @update:model-value="value => updateProp('peelDirection', value)"
          />
          <PreviewSlider
            title="Hover Peel"
            :min="0"
            :max="60"
            :step="1"
            value-unit="%"
            :model-value="props.peelBackHoverPct"
            @update:model-value="value => updateProp('peelBackHoverPct', value)"
          />
          <PreviewSlider
            title="Press Peel"
            :min="0"
            :max="80"
            :step="1"
            value-unit="%"
            :model-value="props.peelBackActivePct"
            @update:model-value="value => updateProp('peelBackActivePct', value)"
          />
          <PreviewSlider
            title="Curl Radius"
            :min="4"
            :max="32"
            :step="1"
            value-unit="px"
            :model-value="props.curlRadius"
            @update:model-value="value => updateProp('curlRadius', value)"
          />
          <PreviewSlider
            title="Lighting"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="props.lightingIntensity"
            @update:model-value="value => updateProp('lightingIntensity', value)"
          />
          <PreviewSlider
            title="Shadow"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="props.shadowIntensity"
            @update:model-value="value => updateProp('shadowIntensity', value)"
          />
          <PreviewSlider
            title="Swing"
            :min="0"
            :max="3"
            :step="0.05"
            :is-disabled="!props.draggable"
            :model-value="props.swing"
            @update:model-value="value => updateProp('swing', value)"
          />
          <PreviewSlider
            title="Friction"
            :min="0"
            :max="1"
            :step="0.01"
            :is-disabled="!props.draggable"
            :model-value="props.friction"
            @update:model-value="value => updateProp('friction', value)"
          />
          <PreviewSlider
            title="Bounce"
            :min="0"
            :max="1"
            :step="0.01"
            :is-disabled="!props.draggable"
            :model-value="props.bounce"
            @update:model-value="value => updateProp('bounce', value)"
          />
          <PreviewSwitch
            title="Follow Pointer"
            :model-value="props.followPointer"
            @update:model-value="value => updateProp('followPointer', value)"
          />
          <PreviewSwitch
            title="Draggable"
            :model-value="props.draggable"
            @update:model-value="value => updateProp('draggable', value)"
          />
          <PreviewSwitch
            title="Intro"
            :model-value="props.intro"
            @update:model-value="value => updateProp('intro', value)"
          />
        </Customize>

        <PropTable :data="propData" />
      </template>

      <template #code>
        <CodeExample :code-object="stickerPeel" component-name="StickerPeel" />
      </template>
    </TabsLayout>
  </ComponentPropsProvider>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import vueBits from '@/assets/logos/vue-bits-sticker.png';
import apple from '@/assets/stickers/apple.webp';
import github from '@/assets/stickers/github.webp';
import openai from '@/assets/stickers/openai.webp';
import tailwind from '@/assets/stickers/tailwind.webp';
import vite from '@/assets/stickers/vite.webp';
import CodeExample from '@/components/common/CodeExample.vue';
import Customize from '@/components/common/Customize.vue';
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
import { stickerPeel } from '@/constants/code/Animations/stickerPeelCode';
import StickerPeel, { type StickerFinish } from '@/content/Animations/StickerPeel/StickerPeel.vue';

const STICKERS = { vueBits, github, tailwind, openai, apple, vite };

type StickerKey = keyof typeof STICKERS;

const STICKER_OPTIONS = [
  { value: 'vueBits', label: 'Vue Bits' },
  { value: 'github', label: 'GitHub' },
  { value: 'tailwind', label: 'Tailwind' },
  { value: 'openai', label: 'OpenAI' },
  { value: 'apple', label: 'Apple' },
  { value: 'vite', label: 'Vite' }
];

const LOOK = {
  finish: 'gloss' as StickerFinish,
  width: 200,
  rotate: 0,
  peelDirection: 0,
  peelBackHoverPct: 25,
  peelBackActivePct: 40,
  curlRadius: 12,
  backColor: '#d4d4d8',
  lightingIntensity: 0.5,
  shadowIntensity: 0.6,
  followPointer: true,
  swing: 1,
  friction: 0.5,
  bounce: 0.35
};

const DEFAULT_PROPS = {
  preset: 'signature',
  sticker: 'vueBits' as StickerKey,
  ...LOOK,
  draggable: true,
  intro: true
};

type DemoProps = typeof DEFAULT_PROPS;

const PRESETS: Record<string, Partial<DemoProps>> = {
  signature: { ...LOOK, sticker: 'vueBits' },
  classic: { ...LOOK, sticker: 'vueBits', followPointer: false, peelBackHoverPct: 30 },
  holo: { ...LOOK, sticker: 'apple', finish: 'holo', lightingIntensity: 0.8, width: 180 },
  matte: {
    ...LOOK,
    sticker: 'github',
    finish: 'matte',
    backColor: '#f4f4f5',
    lightingIntensity: 0.3,
    shadowIntensity: 0.45
  },
  vinyl: {
    ...LOOK,
    sticker: 'tailwind',
    width: 240,
    curlRadius: 24,
    peelBackActivePct: 50,
    swing: 0.6,
    friction: 0.75,
    shadowIntensity: 0.75
  },
  paper: {
    ...LOOK,
    sticker: 'openai',
    finish: 'matte',
    curlRadius: 6,
    backColor: '#fafafa',
    swing: 1.6,
    friction: 0.35
  },
  bouncy: { ...LOOK, sticker: 'vite', rotate: -8, friction: 0.12, bounce: 0.85, swing: 1.4 }
};

const PRESET_OPTIONS = [
  { value: 'signature', label: 'Signature' },
  { value: 'classic', label: 'Classic' },
  { value: 'holo', label: 'Holo' },
  { value: 'matte', label: 'Matte' },
  { value: 'vinyl', label: 'Thick Vinyl' },
  { value: 'paper', label: 'Paper' },
  { value: 'bouncy', label: 'Bouncy' }
];

const FINISH_OPTIONS = [
  { value: 'gloss', label: 'Gloss' },
  { value: 'matte', label: 'Matte' },
  { value: 'holo', label: 'Holo' }
];

const propData: PropRow[] = [
  {
    name: 'imageSrc',
    type: 'string',
    default: 'required',
    description: 'Sticker image. Use a PNG with a transparent background so the die-cut outline shows.'
  },
  { name: 'width', type: 'number', default: '200', description: 'Width of the sticker in pixels.' },
  { name: 'rotate', type: 'number', default: '0', description: 'Resting rotation of the sticker in degrees.' },
  {
    name: 'finish',
    type: "'gloss' | 'matte' | 'holo'",
    default: "'gloss'",
    description: 'Surface of the sticker. Holo turns light areas into foil with rainbow bands and glitter.'
  },
  {
    name: 'peelBackHoverPct',
    type: 'number',
    default: '25',
    description: 'How far the sticker peels back on hover, as a percentage of its size.'
  },
  {
    name: 'peelBackActivePct',
    type: 'number',
    default: '40',
    description: 'How far the sticker peels back while pressed or dragged.'
  },
  {
    name: 'peelDirection',
    type: 'number',
    default: '0',
    description:
      'Edge that peels, in degrees clockwise from the top. With followPointer it is used when the cursor is near the middle.'
  },
  {
    name: 'followPointer',
    type: 'boolean',
    default: 'true',
    description: 'Peels the edge or corner nearest the cursor, and the edge you grab while dragging.'
  },
  {
    name: 'curlRadius',
    type: 'number',
    default: '12',
    description: 'Radius of the curl where the sticker bends, in pixels. Larger values feel like thicker vinyl.'
  },
  {
    name: 'backColor',
    type: 'string',
    default: "'#d4d4d8'",
    description: 'Color of the back of the sticker, seen on the peeled part.'
  },
  {
    name: 'lightingIntensity',
    type: 'number',
    default: '0.5',
    description: 'Strength of the highlights that follow the cursor, from 0 to 1.'
  },
  {
    name: 'shadowIntensity',
    type: 'number',
    default: '0.6',
    description: 'Strength of the shadows under the sticker and the peeled part, from 0 to 1.'
  },
  {
    name: 'draggable',
    type: 'boolean',
    default: 'true',
    description: 'Lets the sticker be picked up, dragged and thrown around its parent.'
  },
  {
    name: 'swing',
    type: 'number',
    default: '1',
    description: 'How much the sticker swings around the point you hold while dragging, from 0 to 3.'
  },
  {
    name: 'friction',
    type: 'number',
    default: '0.5',
    description: 'How quickly a thrown sticker slides to a stop, from 0 (ice) to 1 (felt).'
  },
  {
    name: 'bounce',
    type: 'number',
    default: '0.35',
    description: 'How much of its speed a thrown sticker keeps when it hits the edge of its parent.'
  },
  {
    name: 'intro',
    type: 'boolean',
    default: 'true',
    description: 'Drops the sticker onto the surface on mount and smooths its corner down.'
  },
  {
    name: 'initialPosition',
    type: "'center' | { x: number; y: number }",
    default: "'center'",
    description: 'Starting position. An object offsets the sticker from the center of its parent, in pixels.'
  },
  {
    name: 'onDragStart',
    type: '() => void',
    default: '-',
    description: 'Called when the sticker starts being dragged.'
  },
  { name: 'onDragEnd', type: '() => void', default: '-', description: 'Called when the sticker is released.' },
  { name: 'dpr', type: 'number', default: 'auto', description: 'Maximum device pixel ratio, capped at 2.' },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the root element.' },
  { name: 'style', type: 'StyleValue', default: '-', description: 'Inline styles for the root element.' }
];

const { rerenderKey, forceRerender } = useForceRerender();
const { props, defaultProps, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);

const settings = computed(() => {
  const { preset: _preset, sticker: _sticker, ...rest } = props.value;
  return rest;
});

const imageSrc = computed(() => STICKERS[props.value.sticker] || vueBits);

const applyPreset = (value: string | number) => {
  const key = String(value);
  const base = Object.fromEntries(
    (Object.keys(DEFAULT_PROPS) as (keyof DemoProps)[]).map(name => [name, defaultProps.value[name]])
  ) as DemoProps;
  updateProps({ ...base, ...PRESETS[key], preset: key });
};
</script>
