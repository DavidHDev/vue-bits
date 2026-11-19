<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
    :demo-only-props="['preset', 'textColor', 'crossInk']"
    :computed-props="computedProps"
  >
    <TabsLayout>
      <template #preview>
        <div
          class="demo-container relative flex items-center justify-center overflow-hidden"
          style="min-height: 430px; padding: 0"
        >
          <TextLoop
            v-bind="settings"
            :color="props.textColor || undefined"
            :cross-color="props.crossInk || undefined"
          />
        </div>

        <Customize>
          <PreviewSelect
            title="Preset"
            :options="PRESET_OPTIONS"
            :model-value="props.preset"
            @update:model-value="value => applyPreset(String(value))"
          />

          <PreviewInput
            title="Text"
            placeholder="Your phrase"
            :max-length="30"
            :model-value="settings.text"
            @update:model-value="value => updateProp('text', value)"
          />

          <PreviewInput
            title="Separator"
            placeholder="✦"
            :width="90"
            :max-length="3"
            :model-value="settings.separator"
            @update:model-value="value => updateProp('separator', value)"
          />

          <PreviewColorPickerCustom
            title="Text Color"
            :color="props.textColor || (settings.ribbon ? '#ffffff' : ink)"
            @change="value => updateProp('textColor', value)"
          />
          <PreviewColorPickerCustom
            title="Ribbon Color"
            :color="settings.ribbonColor"
            @change="value => updateProp('ribbonColor', value)"
          />
          <PreviewColorPickerCustom
            title="Cross Color"
            :color="props.crossInk || (settings.ribbon ? tint(settings.ribbonColor, 0.62) : props.textColor || ink)"
            @change="value => updateProp('crossInk', value)"
          />

          <PreviewSelect
            title="Shape"
            :options="SHAPE_OPTIONS"
            :model-value="settings.shape"
            @update:model-value="value => updateProp('shape', value as Shape)"
          />

          <PreviewSelect
            title="Direction"
            :options="DIRECTION_OPTIONS"
            :model-value="settings.direction"
            @update:model-value="value => updateProp('direction', value as Direction)"
          />

          <PreviewSlider
            title="Speed"
            :min="10"
            :max="260"
            :step="5"
            :model-value="settings.speed"
            @update:model-value="value => updateProp('speed', value)"
          />

          <PreviewSlider
            title="Scroll Boost"
            :min="0"
            :max="3"
            :step="0.1"
            :model-value="settings.scrollBoost"
            @update:model-value="value => updateProp('scrollBoost', value)"
          />

          <PreviewSwitch
            title="Draggable"
            :model-value="settings.draggable"
            @update:model-value="value => updateProp('draggable', value)"
          />
          <PreviewSwitch
            title="Pause On Hover"
            :model-value="settings.pauseOnHover"
            @update:model-value="value => updateProp('pauseOnHover', value)"
          />

          <PreviewSlider
            title="Curviness"
            :min="0"
            :max="160"
            :step="2"
            :model-value="settings.curviness"
            @update:model-value="value => updateProp('curviness', value)"
          />

          <PreviewSlider
            title="Tilt"
            :min="-20"
            :max="20"
            :step="1"
            value-unit="°"
            :model-value="settings.tilt"
            @update:model-value="value => updateProp('tilt', value)"
          />

          <PreviewSwitch
            title="Cross"
            :model-value="settings.cross"
            @update:model-value="value => updateProp('cross', value)"
          />

          <PreviewSlider
            title="Cross Angle"
            :min="0"
            :max="40"
            :step="1"
            value-unit="°"
            :is-disabled="!settings.cross"
            :model-value="settings.crossAngle"
            @update:model-value="value => updateProp('crossAngle', value)"
          />

          <PreviewSwitch
            title="Ribbon"
            :model-value="settings.ribbon"
            @update:model-value="value => updateProp('ribbon', value)"
          />

          <PreviewSlider
            title="Ribbon Width"
            :min="0"
            :max="160"
            :step="2"
            value-unit="px"
            :is-disabled="!settings.ribbon"
            :model-value="settings.ribbonWidth"
            @update:model-value="value => updateProp('ribbonWidth', value)"
          />

          <PreviewSlider
            title="Edge Fade"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.edgeFade"
            @update:model-value="value => updateProp('edgeFade', value)"
          />

          <PreviewSlider
            title="Font Size"
            :min="18"
            :max="90"
            :step="2"
            value-unit="px"
            :model-value="settings.fontSize"
            @update:model-value="value => updateProp('fontSize', value)"
          />

          <PreviewSlider
            title="Font Weight"
            :min="300"
            :max="900"
            :step="50"
            :model-value="settings.fontWeight"
            @update:model-value="value => updateProp('fontWeight', value)"
          />

          <PreviewSlider
            title="Letter Spacing"
            :min="-2"
            :max="14"
            :step="0.5"
            value-unit="px"
            :model-value="settings.letterSpacing"
            @update:model-value="value => updateProp('letterSpacing', value)"
          />

          <PreviewSwitch
            title="Uppercase"
            :model-value="settings.uppercase"
            @update:model-value="value => updateProp('uppercase', value)"
          />

          <PreviewSwitch
            title="Outline"
            :model-value="settings.outline"
            @update:model-value="value => updateProp('outline', value)"
          />

          <PreviewSlider
            title="Outline Width"
            :min="0.5"
            :max="4"
            :step="0.1"
            value-unit="px"
            :is-disabled="!settings.outline"
            :model-value="settings.outlineWidth"
            @update:model-value="value => updateProp('outlineWidth', value)"
          />
        </Customize>

        <PropTable :data="propData" />
        <Dependencies :dependency-list="['gsap']" />
      </template>

      <template #code>
        <CodeExample :code-object="textLoop" component-name="TextLoop" />
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
import PreviewInput from '@/components/common/PreviewInput.vue';
import PreviewSelect from '@/components/common/PreviewSelect.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import ComponentPropsProvider from '@/components/context/ComponentPropsProvider.vue';
import { useComponentProps } from '@/composables/useComponentProps';
import { useColorModeValue } from '@/composables/useTheme';
import { textLoop } from '@/constants/code/TextAnimations/textLoopCode';
import TextLoop from '@/content/TextAnimations/TextLoop/TextLoop.vue';

type Shape = 'wave' | 'circle' | 'infinity' | 'arch' | 'line';
type Direction = 'forward' | 'reverse';

type Look = {
  textColor: string;
  ribbonColor: string;
  crossInk: string;
  shape: Shape;
  speed: number;
  scrollBoost: number;
  draggable: boolean;
  curviness: number;
  tilt: number;
  cross: boolean;
  crossAngle: number;
  ribbon: boolean;
  ribbonWidth: number;
  edgeFade: number;
  fontSize: number;
  fontWeight: number;
  letterSpacing: number;
  uppercase: boolean;
  outline: boolean;
  outlineWidth: number;
};

const LOOK: Look = {
  textColor: '',
  ribbonColor: '#42b883',
  crossInk: '',
  shape: 'wave',
  speed: 90,
  scrollBoost: 0,
  draggable: false,
  curviness: 90,
  tilt: 0,
  cross: false,
  crossAngle: 16,
  ribbon: true,
  ribbonWidth: 86,
  edgeFade: 0,
  fontSize: 46,
  fontWeight: 800,
  letterSpacing: 2,
  uppercase: true,
  outline: false,
  outlineWidth: 1.5
};

const PRESETS: Record<string, Look> = {
  ribbon: { ...LOOK },
  tape: {
    ...LOOK,
    textColor: '#111111',
    ribbonColor: '#ff5a36',
    shape: 'line',
    speed: 120,
    draggable: true,
    cross: true,
    crossAngle: 14,
    ribbonWidth: 76,
    fontSize: 40,
    letterSpacing: 1
  },
  orbit: {
    ...LOOK,
    shape: 'circle',
    speed: 60,
    draggable: true,
    curviness: 120,
    cross: true,
    crossAngle: 30,
    ribbon: false,
    fontSize: 32,
    fontWeight: 600,
    letterSpacing: 1,
    uppercase: false
  },
  drift: {
    ...LOOK,
    speed: 70,
    scrollBoost: 1.5,
    curviness: 130,
    ribbon: false,
    edgeFade: 0.8,
    fontSize: 64,
    fontWeight: 700,
    letterSpacing: -1,
    uppercase: false,
    outline: true,
    outlineWidth: 1.5
  }
};

const PRESET_OPTIONS = [
  { value: 'ribbon', label: 'Ribbon' },
  { value: 'tape', label: 'Tape' },
  { value: 'orbit', label: 'Orbit' },
  { value: 'drift', label: 'Drift' }
];

const DEFAULT_PROPS = {
  preset: 'ribbon',
  text: 'Vue ✦ Bits',
  separator: '✦',
  direction: 'forward' as Direction,
  ...LOOK,
  pauseOnHover: true
};

const SHAPE_OPTIONS = [
  { value: 'wave', label: 'Wave' },
  { value: 'circle', label: 'Circle' },
  { value: 'infinity', label: 'Infinity' },
  { value: 'arch', label: 'Arch' },
  { value: 'line', label: 'Line' }
];

const DIRECTION_OPTIONS = [
  { value: 'forward', label: 'Forward' },
  { value: 'reverse', label: 'Reverse' }
];

const tint = (color: string, amount: number) => {
  const match = /^#?([\da-f]{3}|[\da-f]{6})$/i.exec(String(color || '').trim());
  if (!match) return color;
  const hex = match[1].length === 3 ? match[1].replace(/./g, ch => ch + ch) : match[1];
  return `#${[0, 2, 4]
    .map(i => parseInt(hex.slice(i, i + 2), 16))
    .map(v =>
      Math.round(v + (255 - v) * amount)
        .toString(16)
        .padStart(2, '0')
    )
    .join('')}`;
};

const propData: PropRow[] = [
  { name: 'text', type: 'string', default: '"Vue ✦ Bits"', description: 'The phrase repeated along the curve.' },
  {
    name: 'shape',
    type: '"wave" | "circle" | "infinity" | "arch" | "line"',
    default: '"wave"',
    description: 'Built-in curve the text flows along.'
  },
  {
    name: 'path',
    type: 'string',
    default: 'undefined',
    description: 'Custom SVG path data, drawn in a 1200x520 viewBox. Overrides shape when provided.'
  },
  {
    name: 'speed',
    type: 'number',
    default: '90',
    description: 'Travel speed along the path, in units per second.'
  },
  {
    name: 'direction',
    type: '"forward" | "reverse"',
    default: '"forward"',
    description: 'Direction the text scrolls around the curve.'
  },
  { name: 'separator', type: 'string', default: '"✦"', description: 'Glyph placed between each repetition.' },
  {
    name: 'curviness',
    type: 'number',
    default: '90',
    description: 'Amplitude of the wave, or the radius of the closed shapes.'
  },
  {
    name: 'tilt',
    type: 'number',
    default: '0',
    description: 'Rotates the whole loop, in degrees. A slight tilt on a line turns it into a slanted banner.'
  },
  {
    name: 'cross',
    type: 'boolean',
    default: 'false',
    description:
      'Adds a second band crossing the first in an X and running the other way, with a soft shadow where the top band passes over it. Waves weave into a braid, arches into a lens and circles gain a tilted orbit.'
  },
  {
    name: 'crossColor',
    type: 'string',
    default: '-',
    description:
      'Color of the crossing band. Defaults to a pale tint of ribbonColor, and its text picks black or white for contrast. Without a ribbon it colors the crossing text, which is dimmed by default.'
  },
  {
    name: 'crossAngle',
    type: 'number',
    default: '16',
    description: 'Angle between the two bands, in degrees. The pair stays centered on tilt.'
  },
  {
    name: 'draggable',
    type: 'boolean',
    default: 'false',
    description:
      'Drag the loop to scrub it, or spin it on a circle. A throw keeps its momentum, then eases back to the normal speed.'
  },
  {
    name: 'scrollBoost',
    type: 'number',
    default: '0',
    description:
      'How strongly page scrolling pushes the loop. Scrolling down speeds it up, scrolling up slows or reverses it, and it eases back once scrolling stops. 0 turns it off.'
  },
  { name: 'fontSize', type: 'number', default: '46', description: 'Font size of the looping text.' },
  { name: 'fontWeight', type: 'number', default: '800', description: 'Font weight of the looping text.' },
  { name: 'letterSpacing', type: 'number', default: '2', description: 'Extra tracking between letters.' },
  { name: 'uppercase', type: 'boolean', default: 'true', description: 'Renders the phrase in uppercase.' },
  {
    name: 'outline',
    type: 'boolean',
    default: 'false',
    description: 'Draws the letters as outlines instead of solid fills.'
  },
  { name: 'outlineWidth', type: 'number', default: '1.5', description: 'Stroke width of the outlined letters.' },
  {
    name: 'color',
    type: 'string',
    default: '-',
    description: 'Fill color of the text. Defaults to white on the ribbon and to the surrounding text color without it.'
  },
  {
    name: 'ribbon',
    type: 'boolean',
    default: 'true',
    description: 'Draws a solid band behind the text along the path.'
  },
  { name: 'ribbonColor', type: 'string', default: '"#42b883"', description: 'Color of the band behind the text.' },
  { name: 'ribbonWidth', type: 'number', default: '86', description: 'Thickness of the band behind the text.' },
  {
    name: 'edgeFade',
    type: 'number',
    default: '0',
    description: 'Fades the loop out toward the left and right edges, from 0 (hard edges) to 1 (wide, soft fade).'
  },
  {
    name: 'pauseOnHover',
    type: 'boolean',
    default: 'true',
    description: 'Eases the loop to a stop while the pointer is over it, and back up to speed when it leaves.'
  },
  { name: 'className', type: 'string', default: '""', description: 'Additional CSS classes for the wrapper.' },
  { name: 'style', type: 'object', default: '{}', description: 'Inline styles for the wrapper.' }
];

const { props, defaultProps, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);
const settings = computed(() => {
  const { preset: _preset, textColor: _textColor, crossInk: _crossInk, ...rest } = props.value;
  return rest;
});
const ink = useColorModeValue('#161816', '#ffffff');

const applyPreset = (value: string) => {
  const base = Object.fromEntries(
    (Object.keys(LOOK) as (keyof Look)[]).map(name => [name, defaultProps.value[name]])
  ) as Partial<Look>;
  updateProps({ ...base, ...PRESETS[value], preset: value });
};

const computedProps = computed(() => ({
  ...(props.value.textColor ? { color: props.value.textColor } : {}),
  ...(props.value.crossInk ? { crossColor: props.value.crossInk } : {})
}));
</script>
