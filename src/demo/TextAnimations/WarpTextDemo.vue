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
        <div class="demo-container relative overflow-hidden" style="min-height: 430px; max-height: 460px; padding: 0">
          <WarpText
            :key="`${props.preset}-${rerenderKey}`"
            v-bind="settings"
            :text="props.text"
            :color="props.color || 'currentColor'"
            :letter-spacing="`${props.letterSpacing}em`"
            :style="{ height: '100%', minHeight: '430px', borderRadius: '28px' }"
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
            placeholder="Your headline"
            :max-length="36"
            :model-value="props.text"
            @update:model-value="value => updateProp('text', value)"
          />
          <PreviewColorPickerCustom
            title="Text Color"
            :color="props.color || ink"
            @change="value => updateProp('color', value)"
          />
          <PreviewSelect
            title="Lens"
            :options="LENS_OPTIONS"
            :model-value="settings.lens"
            @update:model-value="value => updateProp('lens', value as Lens)"
          />
          <PreviewSlider
            title="Lens Strength"
            :min="0"
            :max="0.8"
            :step="0.01"
            :model-value="settings.pointerStrength"
            @update:model-value="value => updateProp('pointerStrength', value)"
          />
          <PreviewSlider
            title="Lens Radius"
            :min="0.18"
            :max="0.75"
            :step="0.01"
            :model-value="settings.pointerInfluence"
            @update:model-value="value => updateProp('pointerInfluence', value)"
          />
          <PreviewSlider
            title="Idle Drift"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.idleDrift"
            @update:model-value="value => updateProp('idleDrift', value)"
          />
          <PreviewSlider
            title="Chromatic"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.chromatic"
            @update:model-value="value => updateProp('chromatic', value)"
          />
          <PreviewSlider
            title="Refraction"
            :min="0"
            :max="0.05"
            :step="0.001"
            :model-value="settings.refraction"
            @update:model-value="value => updateProp('refraction', value)"
          />
          <PreviewSlider
            title="Warp Strength"
            :min="0"
            :max="0.2"
            :step="0.01"
            :model-value="settings.warpStrength"
            @update:model-value="value => updateProp('warpStrength', value)"
          />
          <PreviewSlider
            title="Warp Scale"
            :min="0.8"
            :max="3"
            :step="0.1"
            :model-value="settings.warpScale"
            @update:model-value="value => updateProp('warpScale', value)"
          />
          <PreviewSlider
            title="Speed"
            :min="0"
            :max="1.5"
            :step="0.05"
            :model-value="settings.speed"
            @update:model-value="value => updateProp('speed', value)"
          />
          <PreviewSwitch
            title="Click Ripple"
            :model-value="settings.clickRipple"
            @update:model-value="value => updateProp('clickRipple', value)"
          />
          <PreviewSwitch
            title="Ripple"
            :model-value="settings.ripple"
            @update:model-value="value => updateProp('ripple', value)"
          />
          <PreviewSwitch
            title="Intro"
            :model-value="settings.intro"
            @update:model-value="
              value => {
                updateProp('intro', value);
                forceRerender();
              }
            "
          />
          <PreviewSelect
            title="Font"
            :options="FONT_OPTIONS"
            :model-value="settings.fontFamily"
            @update:model-value="value => updateProp('fontFamily', String(value))"
          />
          <PreviewSelect
            title="Weight"
            :options="WEIGHT_OPTIONS"
            :model-value="settings.fontWeight"
            @update:model-value="value => updateProp('fontWeight', Number(value))"
          />
          <PreviewSlider
            title="Font Size"
            :min="56"
            :max="160"
            :step="1"
            value-unit="px"
            :model-value="settings.fontSize"
            @update:model-value="value => updateProp('fontSize', value)"
          />
          <PreviewSlider
            title="Letter Spacing"
            :min="-0.12"
            :max="0.04"
            :step="0.01"
            value-unit="em"
            :model-value="props.letterSpacing"
            @update:model-value="value => updateProp('letterSpacing', value)"
          />
          <PreviewSlider
            title="Line Height"
            :min="0.78"
            :max="1.2"
            :step="0.01"
            :model-value="settings.lineHeight"
            @update:model-value="value => updateProp('lineHeight', value)"
          />
        </Customize>

        <PropTable :data="propData" />
        <Dependencies :dependency-list="['ogl']" />
      </template>

      <template #code>
        <CodeExample :code-object="warpText" component-name="WarpText" />
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
import { useForceRerender } from '@/composables/useForceRerender';
import { useColorModeValue } from '@/composables/useTheme';
import { warpText } from '@/constants/code/TextAnimations/warpTextCode';
import WarpText from '@/content/TextAnimations/WarpText/WarpText.vue';

type Lens = 'bulge' | 'pinch' | 'swirl';

type Look = {
  lens: Lens;
  fontFamily: string;
  fontWeight: number;
  fontSize: number;
  letterSpacing: number;
  lineHeight: number;
  warpStrength: number;
  warpScale: number;
  speed: number;
  pointerInfluence: number;
  pointerStrength: number;
  refraction: number;
  chromatic: number;
  idleDrift: number;
  ripple: boolean;
  clickRipple: boolean;
};

const SERIF = 'Georgia, serif';
const MONO = 'ui-monospace, SFMono-Regular, Menlo, monospace';

const LOOK: Look = {
  lens: 'bulge',
  fontFamily: 'inherit',
  fontWeight: 800,
  fontSize: 116,
  letterSpacing: -0.06,
  lineHeight: 0.9,
  warpStrength: 0.08,
  warpScale: 1.7,
  speed: 0.55,
  pointerInfluence: 0.42,
  pointerStrength: 0.38,
  refraction: 0.018,
  chromatic: 0.35,
  idleDrift: 0.2,
  ripple: true,
  clickRipple: true
};

const PRESETS: Record<string, Look> = {
  glass: { ...LOOK },
  liquid: {
    ...LOOK,
    fontFamily: SERIF,
    fontWeight: 700,
    letterSpacing: -0.03,
    lineHeight: 1,
    warpStrength: 0.17,
    warpScale: 1.1,
    speed: 0.9,
    pointerInfluence: 0.52,
    pointerStrength: 0.5,
    refraction: 0.026,
    chromatic: 0,
    idleDrift: 0.65
  },
  vortex: {
    ...LOOK,
    lens: 'swirl',
    fontWeight: 900,
    letterSpacing: -0.08,
    warpStrength: 0.04,
    warpScale: 2.2,
    speed: 0.4,
    pointerInfluence: 0.38,
    pointerStrength: 0.62,
    refraction: 0.012,
    chromatic: 0.2,
    idleDrift: 0.85,
    ripple: false
  },
  prism: {
    ...LOOK,
    lens: 'pinch',
    fontFamily: MONO,
    fontWeight: 700,
    fontSize: 104,
    letterSpacing: -0.02,
    warpStrength: 0.1,
    warpScale: 2.8,
    speed: 0.7,
    pointerStrength: 0.56,
    refraction: 0.03,
    chromatic: 0.8,
    idleDrift: 0.45
  }
};

const DEFAULT_PROPS = {
  preset: 'glass',
  text: 'Bend the moment',
  color: '',
  ...LOOK,
  intro: true
};

const PRESET_OPTIONS = [
  { value: 'glass', label: 'Glass' },
  { value: 'liquid', label: 'Liquid' },
  { value: 'vortex', label: 'Vortex' },
  { value: 'prism', label: 'Prism' }
];

const LENS_OPTIONS = [
  { value: 'bulge', label: 'Bulge' },
  { value: 'pinch', label: 'Pinch' },
  { value: 'swirl', label: 'Swirl' }
];

const FONT_OPTIONS = [
  { value: 'inherit', label: 'System' },
  { value: SERIF, label: 'Serif' },
  { value: MONO, label: 'Mono' }
];

const WEIGHT_OPTIONS = [
  { value: 600, label: '600' },
  { value: 700, label: '700' },
  { value: 800, label: '800' },
  { value: 900, label: '900' }
];

const propData: PropRow[] = [
  {
    name: 'text',
    type: 'string',
    default: '"Bend the moment"',
    description: 'The headline text rendered into the WebGL texture. Use \\n for line breaks.'
  },
  {
    name: 'color',
    type: 'string',
    default: '"currentColor"',
    description: 'Text fill color before the glass refraction pass. Follows the surrounding text color by default.'
  },
  {
    name: 'warpStrength',
    type: 'number',
    default: '0.08',
    description: 'Amount of ambient glass distortion at rest.'
  },
  { name: 'warpScale', type: 'number', default: '1.7', description: 'Size of the moving distortion cells.' },
  { name: 'speed', type: 'number', default: '0.55', description: 'Speed of the ambient undulation.' },
  {
    name: 'lens',
    type: '"bulge" | "pinch" | "swirl"',
    default: '"bulge"',
    description: 'How the cursor bends the text: magnify it, pull it inward or twist it around the pointer.'
  },
  { name: 'pointerInfluence', type: 'number', default: '0.42', description: 'Radius of the cursor lensing area.' },
  {
    name: 'pointerStrength',
    type: 'number',
    default: '0.38',
    description: 'Strength of cursor-driven bending and magnification.'
  },
  {
    name: 'idleDrift',
    type: 'number',
    default: '0.2',
    description:
      'How strongly the lens keeps wandering over the text while the cursor is away, from 0 (it fades out) to 1 (a full-strength lens roaming across the words).'
  },
  {
    name: 'chromatic',
    type: 'number',
    default: '0',
    description:
      'Color fringing inside the lens and click ripples, like light splitting through real glass. 0 is off, 1 is strong.'
  },
  {
    name: 'refraction',
    type: 'number',
    default: '0.018',
    description: 'Subtle RGB channel split for the glass edge.'
  },
  { name: 'ripple', type: 'boolean', default: 'true', description: 'Adds a soft ripple to the pointer lens.' },
  {
    name: 'clickRipple',
    type: 'boolean',
    default: 'true',
    description: 'Clicking sends a shockwave ring through the text that bends the letters as it passes and fades out.'
  },
  {
    name: 'intro',
    type: 'boolean',
    default: 'true',
    description: 'Fades the text in from a strong warp that settles once it first comes into view.'
  },
  {
    name: 'fontSize',
    type: 'string | number',
    default: '"clamp(3rem, 10vw, 9rem)"',
    description: 'Canvas raster font size. Numbers are pixels. The text shrinks to fit the container.'
  },
  {
    name: 'fontWeight',
    type: 'string | number',
    default: '800',
    description: 'Font weight used when rasterising the text texture.'
  },
  {
    name: 'fontFamily',
    type: 'string',
    default: '"inherit"',
    description: 'Font family used when rasterising the text texture.'
  },
  {
    name: 'letterSpacing',
    type: 'string | number',
    default: '"-0.06em"',
    description: 'Tracking applied while drawing the text into the texture.'
  },
  { name: 'lineHeight', type: 'string | number', default: '0.9', description: 'Line height for multi-line text.' },
  { name: 'className', type: 'string', default: '""', description: 'Optional class name for the root element.' },
  {
    name: 'style',
    type: 'CSSProperties',
    default: 'undefined',
    description: 'Optional inline styles for sizing or layout.'
  }
];

const { rerenderKey, forceRerender } = useForceRerender();
const { props, defaultProps, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);
const ink = useColorModeValue('#161816', '#ffffff');

const settings = computed(() => {
  const { preset: _preset, text: _text, color: _color, letterSpacing: _letterSpacing, ...rest } = props.value;
  return rest;
});

const applyPreset = (value: string) => {
  const base = Object.fromEntries(
    (Object.keys(LOOK) as (keyof Look)[]).map(name => [name, defaultProps.value[name]])
  ) as Partial<typeof DEFAULT_PROPS>;
  updateProps({ ...base, ...PRESETS[value], preset: value });
};

const computedProps = computed(() => ({
  color: props.value.color || undefined,
  letterSpacing: `${props.value.letterSpacing}em`
}));
</script>
