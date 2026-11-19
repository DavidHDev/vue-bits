<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
    :demo-only-props="['preset']"
    :computed-props="computedProps"
  >
    <TabsLayout>
      <template #preview>
        <div class="demo-container relative overflow-hidden" style="height: 400px; padding: 0">
          <CurvedLoop
            v-bind="settings"
            :color="props.color || 'currentColor'"
            :separator-color="props.separatorColor || undefined"
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
            title="Marquee Text"
            placeholder="Enter text..."
            :max-length="80"
            :model-value="settings.marqueeText"
            @update:model-value="value => updateProp('marqueeText', value)"
          />
          <PreviewColorPickerCustom
            title="Color"
            :color="props.color || ink"
            @change="value => updateProp('color', value)"
          />
          <PreviewColorPickerCustom
            title="Separator Color"
            :color="props.separatorColor || props.color || ink"
            @change="value => updateProp('separatorColor', value)"
          />
          <PreviewSelect
            title="Direction"
            :options="DIRECTION_OPTIONS"
            :model-value="settings.direction"
            @update:model-value="value => updateProp('direction', value as Direction)"
          />
          <PreviewSlider
            title="Speed"
            :min="0"
            :max="10"
            :step="0.1"
            :model-value="settings.speed"
            @update:model-value="value => updateProp('speed', value)"
          />
          <PreviewSlider
            title="Scroll Boost"
            :min="0"
            :max="4"
            :step="0.1"
            :model-value="settings.scrollBoost"
            @update:model-value="value => updateProp('scrollBoost', value)"
          />
          <PreviewSwitch
            title="Draggable"
            :model-value="settings.interactive"
            @update:model-value="value => updateProp('interactive', value)"
          />
          <PreviewSwitch
            title="Pause On Hover"
            :model-value="settings.pauseOnHover"
            @update:model-value="value => updateProp('pauseOnHover', value)"
          />
          <PreviewSelect
            title="Shape"
            :options="SHAPE_OPTIONS"
            :model-value="settings.shape"
            @update:model-value="value => updateProp('shape', value as Shape)"
          />
          <PreviewSelect
            title="Separator"
            :options="SEPARATOR_OPTIONS"
            :model-value="settings.separator"
            @update:model-value="value => updateProp('separator', String(value))"
          />
          <PreviewSlider
            title="Curve Amount"
            :min="-400"
            :max="400"
            :step="10"
            value-unit="px"
            :is-disabled="!bends"
            :model-value="settings.curveAmount"
            @update:model-value="value => updateProp('curveAmount', value)"
          />
          <PreviewSlider
            title="Font Size"
            :min="48"
            :max="160"
            :step="2"
            value-unit="px"
            :model-value="settings.fontSize"
            @update:model-value="value => updateProp('fontSize', value)"
          />
          <PreviewSlider
            title="Font Weight"
            :min="200"
            :max="800"
            :step="100"
            :model-value="settings.fontWeight"
            @update:model-value="value => updateProp('fontWeight', value)"
          />
          <PreviewSlider
            title="Letter Spacing"
            :min="-6"
            :max="16"
            :step="1"
            value-unit="px"
            :model-value="settings.letterSpacing"
            @update:model-value="value => updateProp('letterSpacing', value)"
          />
          <PreviewSlider
            title="Edge Fade"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.edgeFade"
            @update:model-value="value => updateProp('edgeFade', value)"
          />
          <PreviewSwitch
            title="Outline"
            :model-value="settings.outline"
            @update:model-value="value => updateProp('outline', value)"
          />
        </Customize>

        <PropTable :data="propData" />
      </template>

      <template #code>
        <CodeExample :code-object="curvedLoop" component-name="CurvedLoop" />
      </template>
    </TabsLayout>
  </ComponentPropsProvider>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import CodeExample from '@/components/common/CodeExample.vue';
import Customize from '@/components/common/Customize.vue';
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
import { curvedLoop } from '@/constants/code/TextAnimations/curvedLoopCode';
import CurvedLoop from '@/content/TextAnimations/CurvedLoop/CurvedLoop.vue';

type Shape = 'arc' | 'wave' | 'circle' | 'line';
type Direction = 'left' | 'right';
type Look = {
  marqueeText: string;
  shape: Shape;
  separator: string;
  separatorColor: string;
  direction: Direction;
  speed: number;
  scrollBoost: number;
  curveAmount: number;
  fontSize: number;
  fontWeight: number;
  letterSpacing: number;
  edgeFade: number;
  outline: boolean;
};

const LOOK: Look = {
  marqueeText: 'Be ✦ Creative ✦ With ✦ Vue ✦ Bits ✦',
  shape: 'arc',
  separator: '',
  separatorColor: '',
  direction: 'left',
  speed: 2,
  scrollBoost: 0,
  curveAmount: 400,
  fontSize: 96,
  fontWeight: 700,
  letterSpacing: 0,
  edgeFade: 0,
  outline: false
};

const PRESETS: Record<string, Look> = {
  arc: { ...LOOK },
  wave: {
    ...LOOK,
    marqueeText: 'Ride the wave',
    shape: 'wave',
    separator: '—',
    direction: 'right',
    speed: 1.5,
    curveAmount: 360,
    fontSize: 84,
    fontWeight: 500,
    edgeFade: 0.3
  },
  circle: {
    ...LOOK,
    marqueeText: 'Around and around',
    shape: 'circle',
    separator: '•',
    direction: 'right',
    speed: 1.2,
    fontSize: 80,
    fontWeight: 800
  },
  outline: {
    ...LOOK,
    marqueeText: 'Scroll faster',
    shape: 'line',
    separator: '/',
    separatorColor: '#ff5a1f',
    speed: 1,
    scrollBoost: 2,
    fontSize: 136,
    fontWeight: 800,
    letterSpacing: -2,
    edgeFade: 0.4,
    outline: true
  }
};

const DEFAULT_PROPS = {
  preset: 'arc',
  ...LOOK,
  color: '',
  interactive: true,
  pauseOnHover: false
};

const PRESET_OPTIONS = [
  { value: 'arc', label: 'Arc' },
  { value: 'wave', label: 'Wave' },
  { value: 'circle', label: 'Circle' },
  { value: 'outline', label: 'Outline' }
];

const SHAPE_OPTIONS = [
  { value: 'arc', label: 'Arc' },
  { value: 'wave', label: 'Wave' },
  { value: 'circle', label: 'Circle' },
  { value: 'line', label: 'Line' }
];

const SEPARATOR_OPTIONS = [
  { value: '', label: 'None' },
  { value: '✦', label: 'Star' },
  { value: '•', label: 'Dot' },
  { value: '/', label: 'Slash' },
  { value: '—', label: 'Dash' }
];

const DIRECTION_OPTIONS = [
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' }
];

const propData: PropRow[] = [
  {
    name: 'marqueeText',
    type: 'string',
    default: "''",
    description: 'The text that loops along the path. Repeats are joined with a space.'
  },
  {
    name: 'shape',
    type: "'arc' | 'wave' | 'circle' | 'line'",
    default: "'arc'",
    description:
      'The path the text travels on. Circle closes the loop into a ring that always fits a whole number of repeats.'
  },
  {
    name: 'color',
    type: 'string',
    default: "'currentColor'",
    description:
      'Color of the text, or of its outline when outline is on. Follows the surrounding text color by default.'
  },
  {
    name: 'separator',
    type: 'string',
    default: "''",
    description: 'A mark placed between repeats, such as ✦ or /. Leave empty to join repeats with a space.'
  },
  {
    name: 'separatorColor',
    type: 'string',
    default: '-',
    description: 'Paints the separator in its own solid color. Matches the text when left unset.'
  },
  {
    name: 'direction',
    type: "'left' | 'right'",
    default: "'left'",
    description:
      'Which way the text travels. On a circle, right turns clockwise. A drag flips it to the way it was thrown.'
  },
  {
    name: 'speed',
    type: 'number',
    default: '2',
    description: 'How fast the text travels along the path. 0 keeps it still until dragged or scrolled.'
  },
  {
    name: 'scrollBoost',
    type: 'number',
    default: '0',
    description: 'How much page scrolling speeds the loop up for a moment before it eases back. 0 turns it off.'
  },
  {
    name: 'curveAmount',
    type: 'number',
    default: '400',
    description:
      'How far the path bends. On the arc it is the dip at the middle (negative arches up), on the wave it sets the wave height.'
  },
  {
    name: 'fontSize',
    type: 'number',
    default: '96',
    description: 'Letter size in px for a 1440px wide loop. The whole loop scales with its container.'
  },
  {
    name: 'fontWeight',
    type: 'number | string',
    default: '700',
    description: 'Weight of the letters.'
  },
  {
    name: 'letterSpacing',
    type: 'number',
    default: '0',
    description: 'Extra space between letters in px, measured like fontSize.'
  },
  {
    name: 'edgeFade',
    type: 'number',
    default: '0',
    description: 'How much of each side fades out, from 0 to 1. At 1 only the middle stays fully visible.'
  },
  {
    name: 'outline',
    type: 'boolean',
    default: 'false',
    description: 'Draws the letters as outlines instead of solid text.'
  },
  {
    name: 'interactive',
    type: 'boolean',
    default: 'true',
    description:
      'Lets people drag the text and fling it. Rings follow the pointer around. It glides back to its normal speed afterwards.'
  },
  {
    name: 'pauseOnHover',
    type: 'boolean',
    default: 'false',
    description: 'Eases the text to a stop while the pointer is over it.'
  },
  {
    name: 'className',
    type: 'string',
    default: '-',
    description: 'Extra class names for the text, for example to change its font.'
  }
];

const { props, defaultProps, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);
const settings = computed(() => {
  const { preset: _preset, color: _color, separatorColor: _separatorColor, ...rest } = props.value;
  return rest;
});
const ink = useColorModeValue('#161816', '#ffffff');
const bends = computed(() => settings.value.shape === 'arc' || settings.value.shape === 'wave');

const applyPreset = (value: string) => {
  const base = Object.fromEntries(
    (Object.keys(LOOK) as (keyof Look)[]).map(name => [name, defaultProps.value[name]])
  ) as Partial<Look>;
  updateProps({ ...base, ...PRESETS[value], preset: value });
};

const computedProps = computed(() => ({
  color: props.value.color || undefined,
  separatorColor: props.value.separatorColor || undefined
}));
</script>
