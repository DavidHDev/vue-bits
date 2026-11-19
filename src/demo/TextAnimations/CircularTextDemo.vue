<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
    :demo-only-props="['preset', 'center', 'color', 'ringColor']"
    :computed-props="computedProps"
  >
    <TabsLayout>
      <template #preview>
        <div class="demo-container relative overflow-hidden" style="height: 400px">
          <CircularText v-bind="settings" :color="props.color" :ring-color="props.ringColor">
            <HugeiconsIcon
              v-if="props.center === 'arrow'"
              :icon="ArrowUpRight01Icon"
              :size="settings.size * 0.3"
              :stroke-width="1.6"
            />
            <svg
              v-else-if="props.center === 'star'"
              :width="settings.size * 0.22"
              :height="settings.size * 0.22"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 2.6l2.83 5.95 6.53.8-4.8 4.5 1.24 6.47L12 17.13l-5.8 3.19 1.24-6.47-4.8-4.5 6.53-.8z" />
            </svg>
            <HugeiconsIcon
              v-else-if="props.center === 'globe'"
              :icon="Globe02Icon"
              :size="settings.size * 0.22"
              :stroke-width="1.4"
            />
          </CircularText>
        </div>

        <Customize>
          <PreviewSelect
            title="Preset"
            :options="PRESET_OPTIONS"
            :model-value="props.preset"
            @update:model-value="value => applyPreset(String(value))"
          />
          <PreviewColorPickerCustom
            title="Color"
            :color="props.color || ink"
            @change="value => updateProp('color', value)"
          />
          <PreviewColorPickerCustom
            title="Ring Color"
            :color="props.ringColor || props.color || ink"
            @change="value => updateProps({ ringColor: value, ring: true })"
          />
          <PreviewSelect
            title="On Hover"
            :options="HOVER_OPTIONS"
            :model-value="settings.onHover"
            @update:model-value="value => updateProp('onHover', value as HoverMode)"
          />
          <PreviewSelect
            title="Direction"
            :options="DIRECTION_OPTIONS"
            :model-value="settings.direction"
            @update:model-value="value => updateProp('direction', value as Direction)"
          />
          <PreviewSlider
            title="Spin Duration"
            :min="0"
            :max="60"
            :step="1"
            value-unit="s"
            :model-value="settings.spinDuration"
            @update:model-value="value => updateProp('spinDuration', value)"
          />
          <PreviewSwitch
            title="Draggable"
            :model-value="settings.draggable"
            @update:model-value="value => updateProp('draggable', value)"
          />
          <PreviewSlider
            title="Hover Tilt"
            :min="0"
            :max="40"
            :step="1"
            value-unit="°"
            :model-value="settings.hoverTilt"
            @update:model-value="value => updateProp('hoverTilt', value)"
          />
          <PreviewSlider
            title="Tilt"
            :min="0"
            :max="75"
            :step="1"
            value-unit="°"
            :model-value="settings.tilt"
            @update:model-value="value => updateProp('tilt', value)"
          />
          <PreviewInput
            title="Text"
            placeholder="Enter text..."
            :max-length="64"
            :model-value="settings.text"
            @update:model-value="value => updateProp('text', value)"
          />
          <PreviewSelect
            title="Center"
            :options="CENTER_OPTIONS"
            :model-value="props.center"
            @update:model-value="value => updateProp('center', value as Center)"
          />
          <PreviewSlider
            title="Size"
            :min="120"
            :max="360"
            :step="10"
            value-unit="px"
            :model-value="settings.size"
            @update:model-value="value => updateProp('size', value)"
          />
          <PreviewSlider
            title="Font Size"
            :min="10"
            :max="40"
            :step="1"
            value-unit="px"
            :model-value="settings.fontSize"
            @update:model-value="value => updateProp('fontSize', value)"
          />
          <PreviewSlider
            title="Font Weight"
            :min="300"
            :max="900"
            :step="100"
            :model-value="settings.fontWeight"
            @update:model-value="value => updateProp('fontWeight', value)"
          />
          <PreviewSlider
            title="Letter Spacing"
            :min="-0.05"
            :max="0.3"
            :step="0.01"
            value-unit="em"
            :is-disabled="settings.fill"
            :model-value="settings.letterSpacing"
            @update:model-value="value => updateProp('letterSpacing', value)"
          />
          <PreviewSlider
            title="Start Angle"
            :min="-180"
            :max="180"
            :step="5"
            value-unit="°"
            :model-value="settings.startAngle"
            @update:model-value="value => updateProp('startAngle', value)"
          />
          <PreviewSlider
            title="Repeat"
            :min="1"
            :max="5"
            :step="1"
            :model-value="settings.repeat"
            @update:model-value="value => updateProp('repeat', value)"
          />
          <PreviewSwitch
            title="Fill"
            :model-value="settings.fill"
            @update:model-value="value => updateProp('fill', value)"
          />
          <PreviewSwitch
            title="Ring"
            :model-value="settings.ring"
            @update:model-value="value => updateProp('ring', value)"
          />
        </Customize>

        <PropTable :data="propData" />
        <Dependencies :dependency-list="['motion-v']" />
      </template>

      <template #code>
        <CodeExample :code-object="circularText" component-name="CircularText" />
      </template>
    </TabsLayout>
  </ComponentPropsProvider>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ArrowUpRight01Icon, Globe02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
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
import { circularText } from '@/constants/code/TextAnimations/circularTextCode';
import CircularText from '@/content/TextAnimations/CircularText/CircularText.vue';

type HoverMode = 'slowDown' | 'speedUp' | 'pause' | 'goBonkers';
type Direction = 'clockwise' | 'counterclockwise';
type Center = 'none' | 'arrow' | 'star' | 'globe';

type Look = {
  text: string;
  color: string;
  ringColor: string;
  onHover: HoverMode;
  direction: Direction;
  spinDuration: number;
  draggable: boolean;
  hoverTilt: number;
  tilt: number;
  center: Center;
  size: number;
  fontSize: number;
  fontWeight: number;
  letterSpacing: number;
  startAngle: number;
  repeat: number;
  fill: boolean;
  ring: boolean;
};

const LOOK: Look = {
  text: 'VUE*BITS*COMPONENTS*',
  color: '',
  ringColor: '',
  onHover: 'speedUp',
  direction: 'clockwise',
  spinDuration: 20,
  draggable: true,
  hoverTilt: 20,
  tilt: 0,
  center: 'arrow',
  size: 200,
  fontSize: 24,
  fontWeight: 900,
  letterSpacing: 0,
  startAngle: 0,
  repeat: 1,
  fill: true,
  ring: false
};

const PRESETS: Record<string, Look> = {
  badge: { ...LOOK },
  stamp: {
    ...LOOK,
    text: 'made with care • since 2026 • ',
    color: '#e5484d',
    onHover: 'slowDown',
    direction: 'counterclockwise',
    spinDuration: 30,
    hoverTilt: 12,
    center: 'star',
    size: 220,
    fontSize: 17,
    fontWeight: 700,
    letterSpacing: 0.02,
    repeat: 2,
    fill: false,
    ring: true
  },
  orbit: {
    ...LOOK,
    text: 'around the world • ',
    onHover: 'slowDown',
    spinDuration: 40,
    hoverTilt: 10,
    tilt: 58,
    center: 'globe',
    size: 300,
    fontSize: 19,
    fontWeight: 700,
    letterSpacing: 0.02,
    repeat: 3,
    fill: false
  },
  bonkers: {
    ...LOOK,
    text: 'spin me ',
    onHover: 'goBonkers',
    spinDuration: 8,
    hoverTilt: 30,
    center: 'none',
    size: 240,
    fontSize: 26,
    fontWeight: 900,
    letterSpacing: 0.02,
    repeat: 4,
    fill: false
  }
};

const DEFAULT_PROPS = {
  preset: 'badge',
  ...LOOK
};

const PRESET_OPTIONS = [
  { value: 'badge', label: 'Badge' },
  { value: 'stamp', label: 'Stamp' },
  { value: 'orbit', label: 'Orbit' },
  { value: 'bonkers', label: 'Bonkers' }
];

const HOVER_OPTIONS = [
  { value: 'slowDown', label: 'Slow Down' },
  { value: 'speedUp', label: 'Speed Up' },
  { value: 'pause', label: 'Pause' },
  { value: 'goBonkers', label: 'Go Bonkers' }
];

const DIRECTION_OPTIONS = [
  { value: 'clockwise', label: 'Clockwise' },
  { value: 'counterclockwise', label: 'Counterclockwise' }
];

const CENTER_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'arrow', label: 'Arrow' },
  { value: 'star', label: 'Star' },
  { value: 'globe', label: 'Globe' }
];

const propData: PropRow[] = [
  {
    name: 'text',
    type: 'string',
    default: "''",
    description: 'The text laid out around the ring. End it with a separator for a seamless loop.'
  },
  {
    name: 'spinDuration',
    type: 'number',
    default: '20',
    description: 'Seconds for one full turn. 0 keeps the ring still until it is dragged.'
  },
  {
    name: 'onHover',
    type: "'slowDown' | 'speedUp' | 'pause' | 'goBonkers'",
    default: "'speedUp'",
    description:
      'What happens while the pointer is over the ring. It eases into the new speed and back out, and goBonkers also shrinks it a little.'
  },
  {
    name: 'direction',
    type: "'clockwise' | 'counterclockwise'",
    default: "'clockwise'",
    description: 'Which way the ring turns.'
  },
  {
    name: 'draggable',
    type: 'boolean',
    default: 'false',
    description: 'Lets people grab the ring and fling it. It coasts with inertia, then eases back to its cruise speed.'
  },
  {
    name: 'hoverTilt',
    type: 'number',
    default: '0',
    description: 'How far the ring tilts in 3D toward the pointer, in degrees. 0 turns the tilt off.'
  },
  {
    name: 'tilt',
    type: 'number',
    default: '0',
    description:
      'Leans the ring back in perspective, in degrees, so it orbits around the center content like a planet ring.'
  },
  { name: 'size', type: 'number', default: '200', description: 'Diameter of the ring, in px.' },
  { name: 'fontSize', type: 'number', default: '24', description: 'Size of the letters, in px.' },
  { name: 'fontWeight', type: 'number', default: '900', description: 'Weight of the letters.' },
  {
    name: 'letterSpacing',
    type: 'number',
    default: '0',
    description: 'Extra space between letters, in em. Applies when fill is off.'
  },
  {
    name: 'color',
    type: 'string',
    default: "''",
    description: 'Color of the letters and center content. Leave empty to follow the surrounding text color.'
  },
  {
    name: 'startAngle',
    type: 'number',
    default: '0',
    description: 'Where the first letter sits, in degrees clockwise from the top.'
  },
  {
    name: 'fill',
    type: 'boolean',
    default: 'true',
    description:
      'Spreads the letters evenly around the whole ring. Turn it off to keep natural letter spacing and leave a gap.'
  },
  {
    name: 'repeat',
    type: 'number',
    default: '1',
    description: 'How many times the text repeats around the ring. With fill off, each copy gets its own gap.'
  },
  { name: 'ring', type: 'boolean', default: 'false', description: 'Draws a thin circle just inside the letters.' },
  {
    name: 'ringColor',
    type: 'string',
    default: "''",
    description: 'Color of the inner circle. Leave empty to match the letters.'
  },
  {
    name: 'default (slot)',
    type: 'slot',
    default: '-',
    description: 'Content shown in the middle of the ring, such as an icon or a short label. It tilts with the ring.'
  },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the ring.' }
];

const { props, defaultProps, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);

const settings = computed(() => {
  const { preset: _preset, center: _center, color: _color, ringColor: _ringColor, ...rest } = props.value;
  return rest;
});

const ink = useColorModeValue('#161816', '#ffffff');

const applyPreset = (value: string) => {
  const base = Object.fromEntries(
    (Object.keys(LOOK) as (keyof Look)[]).map(name => [name, defaultProps.value[name]])
  ) as Partial<typeof DEFAULT_PROPS>;
  updateProps({ ...base, ...PRESETS[value], preset: value });
};

const computedProps = computed(() => ({
  ...(props.value.color ? { color: props.value.color } : {}),
  ...(props.value.ringColor ? { ringColor: props.value.ringColor } : {})
}));
</script>
