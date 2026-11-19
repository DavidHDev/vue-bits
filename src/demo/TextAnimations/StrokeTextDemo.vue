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
        <div class="demo-container relative overflow-hidden p-8 md:p-14" style="min-height: 430px">
          <RefreshButton @click="forceRerender" />
          <div class="relative w-full text-center">
            <StrokeText
              :key="`${props.preset}-${rerenderKey}`"
              v-bind="settings"
              :stroke-color="renderedStrokeColor"
              :fill-color="props.fillColor || 'currentColor'"
              :shadow-color="props.shadowColor || undefined"
            />
          </div>
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
            placeholder="Your headline"
            :max-length="22"
            :model-value="settings.text"
            @update:model-value="value => updateAndReplay('text', value)"
          />
          <PreviewColorPickerCustom
            title="Stroke"
            :color="renderedStrokeColor"
            @change="value => updateAndReplay('strokeColor', value)"
          />
          <PreviewColorPickerCustom
            title="Fill"
            :color="props.fillColor || ink"
            @change="value => updateAndReplay('fillColor', value)"
          />
          <PreviewColorPickerCustom
            title="Shadow"
            :color="props.shadowColor || renderedStrokeColor"
            @change="value => updateAndReplay('shadowColor', value)"
          />
          <PreviewSelect
            title="Trigger"
            :options="TRIGGER_OPTIONS"
            :model-value="settings.trigger"
            @update:model-value="value => updateAndReplay('trigger', value as Trigger)"
          />
          <PreviewSelect
            title="Fill Mode"
            :options="FILL_MODE_OPTIONS"
            :model-value="settings.fillMode"
            @update:model-value="value => updateAndReplay('fillMode', value as FillMode)"
          />
          <PreviewSelect
            title="Wipe From"
            :options="WIPE_FROM_OPTIONS"
            :model-value="settings.wipeFrom"
            :is-disabled="settings.fillMode !== 'wipe'"
            @update:model-value="value => updateAndReplay('wipeFrom', value as WipeFrom)"
          />
          <PreviewSelect
            title="Ease"
            :options="EASE_OPTIONS"
            :model-value="settings.ease"
            @update:model-value="value => updateAndReplay('ease', String(value))"
          />
          <PreviewSlider
            title="Draw Duration"
            :min="0.6"
            :max="3"
            :step="0.1"
            value-unit="s"
            :model-value="settings.drawDuration"
            @update:model-value="value => updateAndReplay('drawDuration', value)"
          />
          <PreviewSlider
            title="Fill Delay"
            :min="0"
            :max="1"
            :step="0.05"
            value-unit="s"
            :model-value="settings.fillDelay"
            @update:model-value="value => updateAndReplay('fillDelay', value)"
          />
          <PreviewSlider
            title="Stagger"
            :min="0"
            :max="0.12"
            :step="0.005"
            value-unit="s"
            :model-value="settings.stagger"
            @update:model-value="value => updateAndReplay('stagger', value)"
          />
          <PreviewSwitch
            title="Reverse Stagger"
            :model-value="settings.reverse"
            @update:model-value="value => updateAndReplay('reverse', value)"
          />
          <PreviewSwitch
            title="Hover Redraw"
            :model-value="settings.hoverRedraw"
            :is-disabled="settings.trigger === 'hover' || settings.trigger === 'loop'"
            @update:model-value="value => updateAndReplay('hoverRedraw', value)"
          />
          <PreviewSwitch
            title="Marching"
            :model-value="settings.marching"
            :is-disabled="settings.strokeStyle === 'solid'"
            @update:model-value="value => updateAndReplay('marching', value)"
          />
          <PreviewSelect
            title="Stroke Style"
            :options="STROKE_STYLE_OPTIONS"
            :model-value="settings.strokeStyle"
            @update:model-value="value => updateAndReplay('strokeStyle', value as StrokeStyle)"
          />
          <PreviewSlider
            title="Stroke Width"
            :min="0.5"
            :max="6"
            :step="0.1"
            :model-value="settings.strokeWidth"
            @update:model-value="value => updateAndReplay('strokeWidth', value)"
          />
          <PreviewSlider
            title="Dash Length"
            :min="2"
            :max="40"
            :step="1"
            value-unit="px"
            :is-disabled="settings.strokeStyle === 'solid'"
            :model-value="settings.dashLength"
            @update:model-value="value => updateAndReplay('dashLength', value)"
          />
          <PreviewSelect
            title="Font"
            :options="FONT_OPTIONS"
            :model-value="settings.fontFamily"
            @update:model-value="value => updateAndReplay('fontFamily', String(value))"
          />
          <PreviewSlider
            title="Font Size"
            :min="72"
            :max="170"
            :step="2"
            value-unit="px"
            :model-value="settings.fontSize"
            @update:model-value="value => updateAndReplay('fontSize', value)"
          />
          <PreviewSlider
            title="Font Weight"
            :min="300"
            :max="900"
            :step="50"
            :model-value="settings.fontWeight"
            @update:model-value="value => updateAndReplay('fontWeight', value)"
          />
          <PreviewSlider
            title="Letter Spacing"
            :min="-10"
            :max="8"
            :step="0.5"
            value-unit="px"
            :model-value="settings.letterSpacing"
            @update:model-value="value => updateAndReplay('letterSpacing', value)"
          />
          <PreviewSwitch
            title="Shadow"
            :model-value="settings.shadow"
            :is-disabled="settings.fillMode === 'none'"
            @update:model-value="value => updateAndReplay('shadow', value)"
          />
        </Customize>

        <PropTable :data="propData" />
        <Dependencies :dependency-list="['gsap']" />
      </template>

      <template #code>
        <CodeExample :code-object="strokeText" component-name="StrokeText" />
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
import RefreshButton from '@/components/common/RefreshButton.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import ComponentPropsProvider from '@/components/context/ComponentPropsProvider.vue';
import { useComponentProps } from '@/composables/useComponentProps';
import { useForceRerender } from '@/composables/useForceRerender';
import { useColorModeValue } from '@/composables/useTheme';
import { strokeText } from '@/constants/code/TextAnimations/strokeTextCode';
import StrokeText from '@/content/TextAnimations/StrokeText/StrokeText.vue';

type Trigger = 'mount' | 'hover' | 'scroll' | 'loop';
type FillMode = 'wipe' | 'fade' | 'none';
type WipeFrom = 'left' | 'right' | 'top' | 'bottom';
type StrokeStyle = 'solid' | 'dashed' | 'dotted';

type Look = {
  strokeColor: string;
  shadowColor: string;
  fillMode: FillMode;
  wipeFrom: WipeFrom;
  ease: string;
  fontFamily: string;
  strokeStyle: StrokeStyle;
  strokeWidth: number;
  dashLength: number;
  drawDuration: number;
  fillDelay: number;
  stagger: number;
  fontSize: number;
  fontWeight: number;
  letterSpacing: number;
  reverse: boolean;
  hoverRedraw: boolean;
  marching: boolean;
  shadow: boolean;
};

const SERIF = 'Georgia, serif';
const MONO = 'ui-monospace, SFMono-Regular, Menlo, monospace';
const ACCENT = '#7cff67';

const LOOK: Look = {
  strokeColor: ACCENT,
  shadowColor: '',
  fillMode: 'wipe',
  wipeFrom: 'left',
  ease: 'power2.out',
  fontFamily: 'inherit',
  strokeStyle: 'solid',
  strokeWidth: 1.4,
  dashLength: 10,
  drawDuration: 1.6,
  fillDelay: 0.2,
  stagger: 0.05,
  fontSize: 128,
  fontWeight: 800,
  letterSpacing: -4,
  reverse: false,
  hoverRedraw: true,
  marching: false,
  shadow: false
};

const PRESETS: Record<string, Look> = {
  draw: { ...LOOK },
  dashed: {
    ...LOOK,
    strokeColor: '#ffffff',
    fillMode: 'none',
    ease: 'sine.inOut',
    strokeStyle: 'dashed',
    strokeWidth: 2.5,
    dashLength: 16,
    drawDuration: 2.2,
    stagger: 0.06,
    letterSpacing: -2,
    hoverRedraw: false,
    marching: true
  },
  dotted: {
    ...LOOK,
    strokeColor: '#f59e0b',
    fillMode: 'fade',
    ease: 'power3.out',
    fontFamily: SERIF,
    strokeStyle: 'dotted',
    strokeWidth: 5,
    dashLength: 11,
    drawDuration: 2.4,
    fillDelay: 0.1,
    stagger: 0.08,
    fontSize: 136,
    fontWeight: 700,
    letterSpacing: 0,
    marching: true
  },
  shadow: {
    ...LOOK,
    strokeColor: '#38bdf8',
    wipeFrom: 'bottom',
    ease: 'expo.out',
    strokeWidth: 2,
    drawDuration: 1.2,
    fillDelay: 0.05,
    stagger: 0.03,
    letterSpacing: -3,
    shadow: true
  }
};

const DEFAULT_PROPS = {
  preset: 'draw',
  text: 'Draw Attention',
  fillColor: '',
  ...LOOK,
  trigger: 'mount' as Trigger
};

const PRESET_OPTIONS = [
  { value: 'draw', label: 'Draw' },
  { value: 'dashed', label: 'Dashed' },
  { value: 'dotted', label: 'Dotted' },
  { value: 'shadow', label: 'Shadow' }
];

const STROKE_STYLE_OPTIONS = [
  { value: 'solid', label: 'Solid' },
  { value: 'dashed', label: 'Dashed' },
  { value: 'dotted', label: 'Dotted' }
];

const TRIGGER_OPTIONS = [
  { value: 'mount', label: 'Mount' },
  { value: 'hover', label: 'Hover' },
  { value: 'scroll', label: 'Scroll' },
  { value: 'loop', label: 'Loop' }
];

const FILL_MODE_OPTIONS = [
  { value: 'wipe', label: 'Wipe' },
  { value: 'fade', label: 'Fade' },
  { value: 'none', label: 'None' }
];

const WIPE_FROM_OPTIONS = [
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' },
  { value: 'top', label: 'Top' },
  { value: 'bottom', label: 'Bottom' }
];

const EASE_OPTIONS = [
  { value: 'power2.out', label: 'Power Out' },
  { value: 'power3.out', label: 'Crisp Out' },
  { value: 'expo.out', label: 'Expo Out' },
  { value: 'sine.inOut', label: 'Sine In Out' }
];

const FONT_OPTIONS = [
  { value: 'inherit', label: 'System' },
  { value: SERIF, label: 'Serif' },
  { value: MONO, label: 'Mono' }
];

const propData: PropRow[] = [
  {
    name: 'text',
    type: 'string',
    default: '"Draw Attention"',
    description: 'The heading copy rendered as measured SVG glyphs.'
  },
  {
    name: 'strokeColor',
    type: 'string',
    default: '"#7cff67"',
    description: 'Color used for the drawing outline.'
  },
  {
    name: 'fillColor',
    type: 'string',
    default: '"currentColor"',
    description:
      'Color that floods into the glyphs after the outline draw. Follows the surrounding text color by default.'
  },
  {
    name: 'strokeWidth',
    type: 'number',
    default: '1.4',
    description: 'Width of the SVG text outline.'
  },
  {
    name: 'drawDuration',
    type: 'number',
    default: '1.6',
    description: 'Seconds each character outline spends drawing on.'
  },
  {
    name: 'fillDelay',
    type: 'number',
    default: '0.2',
    description: 'Seconds to wait after the outline draw before the fill begins.'
  },
  {
    name: 'stagger',
    type: 'number',
    default: '0.05',
    description: 'Delay in seconds between each character animation.'
  },
  {
    name: 'ease',
    type: 'string',
    default: '"power2.out"',
    description: 'GSAP easing used for the outline draw.'
  },
  {
    name: 'trigger',
    type: '"mount" | "hover" | "scroll" | "loop"',
    default: '"mount"',
    description: 'Chooses when the draw timeline starts. Loop draws on, then plays back out before drawing again.'
  },
  {
    name: 'fillMode',
    type: '"fade" | "wipe" | "none"',
    default: '"wipe"',
    description: 'Controls whether fill appears with a fade, a directional wipe, or not at all.'
  },
  {
    name: 'wipeFrom',
    type: '"left" | "right" | "top" | "bottom"',
    default: '"left"',
    description: 'Side the wipe fill sweeps in from. Bottom fills the letters like liquid rising.'
  },
  {
    name: 'fontSize',
    type: 'number',
    default: '128',
    description: 'Largest font size in px. The wordmark scales down to fit narrower containers.'
  },
  {
    name: 'fontWeight',
    type: 'number | string',
    default: '800',
    description: 'Weight of the rendered letterforms.'
  },
  {
    name: 'fontFamily',
    type: 'string',
    default: '"inherit"',
    description: 'Font family of the letterforms. Inherits the surrounding font by default.'
  },
  {
    name: 'letterSpacing',
    type: 'number',
    default: '-4',
    description: 'Tracking in px applied during measurement and rendering.'
  },
  {
    name: 'reverse',
    type: 'boolean',
    default: 'false',
    description: 'Draws the stagger from the final character back to the first.'
  },
  {
    name: 'strokeStyle',
    type: '"solid" | "dashed" | "dotted"',
    default: '"solid"',
    description: 'Line style of the outline. Dashed and dotted outlines still draw on along each letter.'
  },
  {
    name: 'dashLength',
    type: 'number',
    default: '10',
    description: 'Length of each dash in px, or the distance between dots for a dotted outline.'
  },
  {
    name: 'marching',
    type: 'boolean',
    default: 'false',
    description: 'Keeps dashes or dots flowing around the letters once they are drawn.'
  },
  {
    name: 'hoverRedraw',
    type: 'boolean',
    default: 'false',
    description: 'Fades the outline out and draws it again whenever the pointer enters, after the first draw.'
  },
  {
    name: 'shadow',
    type: 'boolean',
    default: 'false',
    description: 'Adds a soft offset shadow under the filled letters that lifts into place as the fill lands.'
  },
  {
    name: 'shadowColor',
    type: 'string',
    default: '-',
    description: 'Color of the shadow. Uses the stroke color when left unset.'
  },
  {
    name: 'className',
    type: 'string',
    default: '""',
    description: 'Optional class applied to the root wrapper.'
  },
  {
    name: 'style',
    type: 'CSSProperties',
    default: '{}',
    description: 'Inline styles passed to the root wrapper.'
  }
];

const { rerenderKey, forceRerender } = useForceRerender();
const { props, defaultProps, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);
const settings = computed(() => {
  const { preset: _preset, fillColor: _fillColor, shadowColor: _shadowColor, ...rest } = props.value;
  return rest;
});
const ink = useColorModeValue('#161816', '#ffffff');
const LIGHT_STROKE: Record<string, string> = { '#ffffff': '#161816', [ACCENT]: '#1f9d45' };
const lightStroke = computed(
  () => LIGHT_STROKE[settings.value.strokeColor.toLowerCase()] ?? settings.value.strokeColor
);
const renderedStrokeColor = useColorModeValue(
  lightStroke,
  computed(() => settings.value.strokeColor)
);

const updateAndReplay = <K extends keyof typeof DEFAULT_PROPS>(name: K, value: (typeof DEFAULT_PROPS)[K]) => {
  updateProp(name, value);
  forceRerender();
};

const applyPreset = (value: string) => {
  const base = Object.fromEntries(
    (Object.keys(LOOK) as (keyof Look)[]).map(name => [name, defaultProps.value[name]])
  ) as Partial<typeof DEFAULT_PROPS>;
  updateProps({ ...base, ...PRESETS[value], preset: value });
  forceRerender();
};

const computedProps = computed(() => ({
  strokeColor: renderedStrokeColor.value,
  fillColor: props.value.fillColor || undefined,
  shadowColor: props.value.shadowColor || undefined
}));
</script>
