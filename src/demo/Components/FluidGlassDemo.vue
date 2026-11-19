<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
    :demo-only-props="['demo', 'preset']"
  >
    <TabsLayout>
      <template #preview>
        <div class="demo-container relative overflow-hidden" style="height: 500px; padding: 0">
          <RefreshButton @click="forceRerender" />
          <FluidGlass :key="`${rerenderKey}-${props.demo}`" v-bind="settings" :src="media" />
        </div>

        <Customize>
          <PreviewSelect
            title="Demo"
            :options="DEMO_OPTIONS"
            :model-value="props.demo"
            @update:model-value="value => updateProp('demo', value as DemoMode)"
          />
          <PreviewSelect
            title="Preset"
            :options="PRESET_OPTIONS"
            :model-value="props.preset"
            @update:model-value="value => applyPreset(String(value))"
          />
          <PreviewSelect
            title="Shape"
            :options="SHAPE_OPTIONS"
            :model-value="settings.shape"
            @update:model-value="value => updateProp('shape', value as Shape)"
          />
          <PreviewSelect
            title="Interaction"
            :options="INTERACTION_OPTIONS"
            :model-value="settings.interaction"
            @update:model-value="value => updateProp('interaction', value as Interaction)"
          />
          <PreviewInput
            title="Text"
            :max-length="24"
            :model-value="settings.text"
            @update:model-value="value => updateProp('text', value)"
          />
          <PreviewColorPickerCustom
            title="Color"
            :color="settings.color"
            @change="value => updateProp('color', value)"
          />
          <PreviewSlider
            title="Size"
            :min="120"
            :max="420"
            :step="10"
            value-unit="px"
            :model-value="settings.size"
            @update:model-value="value => updateProp('size', value)"
          />
          <PreviewSlider
            title="Refraction"
            :min="0"
            :max="2"
            :step="0.05"
            :model-value="settings.refraction"
            @update:model-value="value => updateProp('refraction', value)"
          />
          <PreviewSlider
            title="Dispersion"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.dispersion"
            @update:model-value="value => updateProp('dispersion', value)"
          />
          <PreviewSlider
            title="Frost"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.frost"
            @update:model-value="value => updateProp('frost', value)"
          />
          <PreviewSlider
            title="Tint"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.tint"
            @update:model-value="value => updateProp('tint', value)"
          />
          <PreviewSlider
            title="Reflection"
            :min="0"
            :max="2"
            :step="0.05"
            :model-value="settings.reflection"
            @update:model-value="value => updateProp('reflection', value)"
          />
          <PreviewSlider
            title="Shadow"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.shadow"
            @update:model-value="value => updateProp('shadow', value)"
          />
          <PreviewSlider
            title="Elevation"
            :min="0"
            :max="2"
            :step="0.05"
            :model-value="settings.elevation"
            @update:model-value="value => updateProp('elevation', value)"
          />
          <PreviewSlider
            title="Smoothness"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.smoothness"
            @update:model-value="value => updateProp('smoothness', value)"
          />
          <PreviewSlider
            title="Wobble"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.wobble"
            @update:model-value="value => updateProp('wobble', value)"
          />
          <PreviewSlider
            title="Spin"
            :min="-2"
            :max="2"
            :step="0.05"
            :model-value="settings.spin"
            @update:model-value="value => updateProp('spin', value)"
          />
          <PreviewSwitch
            title="Idle"
            :model-value="settings.idle"
            @update:model-value="value => updateProp('idle', value)"
          />
          <PreviewSwitch
            title="Morph on Click"
            :model-value="settings.morphOnClick"
            @update:model-value="value => updateProp('morphOnClick', value)"
          />
          <PreviewSwitch title="Intro" :model-value="settings.intro" @update:model-value="setIntro" />
        </Customize>

        <PropTable :data="propData" />
        <Dependencies :dependency-list="[]" />
      </template>

      <template #code>
        <CodeExample :code-object="fluidGlass" component-name="FluidGlass" />
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
import { fluidGlass } from '@/constants/code/Components/fluidGlassCode';
import FluidGlass from '@/content/Components/FluidGlass/FluidGlass.vue';

type Shape = 'lens' | 'blob' | 'cube' | 'pill' | 'torus' | 'prism' | 'diamond';
type Interaction = 'follow' | 'drag' | 'static';
type DemoMode = 'headline' | 'photo';

type Look = {
  refraction: number;
  dispersion: number;
  frost: number;
  color: string;
  tint: number;
  reflection: number;
  shadow: number;
  elevation: number;
  smoothness: number;
  wobble: number;
};

const PHOTO = { dark: '/assets/demo/night-sky.webp', light: '/assets/demo/day-sky.webp' };

const LOOK: Look = {
  refraction: 1,
  dispersion: 0.35,
  frost: 0,
  color: '#ffffff',
  tint: 0,
  reflection: 1,
  shadow: 0.5,
  elevation: 0.4,
  smoothness: 0.5,
  wobble: 0.5
};

const DEFAULT_PROPS = {
  demo: 'headline' as DemoMode,
  preset: 'clear',
  text: 'Look closer.',
  shape: 'torus' as Shape,
  interaction: 'follow' as Interaction,
  size: 260,
  ...LOOK,
  spin: 0.3,
  idle: true,
  morphOnClick: true,
  intro: true
};

const PRESETS: Record<string, Partial<Look>> = {
  clear: {},
  frosted: { frost: 0.55, dispersion: 0.15, refraction: 0.9 },
  amber: { color: '#ffb547', tint: 0.55, dispersion: 0.25 },
  ice: { color: '#9fd3ff', tint: 0.35, frost: 0.15, refraction: 0.62, dispersion: 0.2 },
  rainbow: { dispersion: 1, refraction: 1.4 },
  water: { refraction: 0.66, dispersion: 0.1, wobble: 1, smoothness: 0.75, shadow: 0.3 },
  heavy: { refraction: 1.7, elevation: 1.1, dispersion: 0.5 }
};

const DEMO_OPTIONS = [
  { value: 'headline', label: 'Headline' },
  { value: 'photo', label: 'Photo' }
];

const PRESET_OPTIONS = [
  { value: 'clear', label: 'Clear' },
  { value: 'frosted', label: 'Frosted' },
  { value: 'amber', label: 'Amber' },
  { value: 'ice', label: 'Ice' },
  { value: 'rainbow', label: 'Rainbow' },
  { value: 'water', label: 'Water' },
  { value: 'heavy', label: 'Heavy' }
];

const SHAPE_OPTIONS = [
  { value: 'lens', label: 'Lens' },
  { value: 'blob', label: 'Blob' },
  { value: 'pill', label: 'Pill' },
  { value: 'cube', label: 'Cube' },
  { value: 'torus', label: 'Torus' },
  { value: 'prism', label: 'Prism' },
  { value: 'diamond', label: 'Diamond' }
];

const INTERACTION_OPTIONS = [
  { value: 'follow', label: 'Follow' },
  { value: 'drag', label: 'Drag' },
  { value: 'static', label: 'Static' }
];

const propData: PropRow[] = [
  {
    name: 'text',
    type: 'string',
    default: "'Look closer.'",
    description:
      'Headline drawn behind the glass, so the glass can bend it. Use \\n for line breaks. It takes the font and color of the container unless you set them.'
  },
  {
    name: 'src',
    type: 'string',
    default: '-',
    description:
      'Image or video behind the glass. Videos (.mp4, .webm, .mov) play muted on a loop. Files from another site need CORS headers.'
  },
  {
    name: 'fit',
    type: "'cover' | 'contain'",
    default: "'cover'",
    description: 'How the image or video fills the area.'
  },
  {
    name: 'background',
    type: 'string',
    default: "'transparent'",
    description: 'Color behind the text and media. Transparent lets your page show through.'
  },
  {
    name: 'textColor',
    type: 'string',
    default: 'Inherited',
    description: 'Color of the text. Defaults to the CSS color.'
  },
  {
    name: 'fontFamily',
    type: 'string',
    default: 'Inherited',
    description: 'Font of the text. Defaults to the font of the container.'
  },
  { name: 'fontWeight', type: 'number | string', default: '600', description: 'Weight of the text.' },
  {
    name: 'fontSize',
    type: 'number',
    default: 'Auto',
    description: 'Size of the text in px. By default it scales to fill the width.'
  },
  {
    name: 'shape',
    type: "'torus' | 'lens' | 'blob' | 'pill' | 'cube' | 'prism' | 'diamond'",
    default: "'torus'",
    description:
      'Shape of the glass. The blob is a drop of liquid glass that keeps rippling. Changing the shape melts the glass smoothly into the new one.'
  },
  {
    name: 'shapes',
    type: 'string[]',
    default: 'All shapes',
    description: 'Shapes the glass cycles through when clicked.'
  },
  {
    name: 'morphOnClick',
    type: 'boolean',
    default: 'true',
    description: 'Clicking the glass melts it into the next shape.'
  },
  {
    name: 'size',
    type: 'number',
    default: '260',
    description: 'Diameter of the glass in px. It shrinks to fit small areas.'
  },
  {
    name: 'interaction',
    type: "'follow' | 'drag' | 'static'",
    default: "'follow'",
    description:
      'How the glass responds: it glides after the cursor, it can be picked up and thrown around, or it stays in place.'
  },
  {
    name: 'position',
    type: '[number, number]',
    default: '[0.5, 0.5]',
    description: 'Where the glass rests, as fractions of the width and height.'
  },
  {
    name: 'refraction',
    type: 'number',
    default: '1',
    description: 'How strongly the glass bends light, from 0 to 2. Around 0.66 behaves like water.'
  },
  {
    name: 'dispersion',
    type: 'number',
    default: '0.35',
    description: 'How much light splits into rainbow fringes at the edges, from 0 to 1.'
  },
  {
    name: 'frost',
    type: 'number',
    default: '0',
    description: 'Frosts the glass so what is behind it blurs, from 0 to 1.'
  },
  { name: 'color', type: 'string', default: "'#ffffff'", description: 'Color of the glass.' },
  {
    name: 'tint',
    type: 'number',
    default: '0',
    description: 'How strongly the glass takes on its color. Thicker parts look deeper, like real colored glass.'
  },
  {
    name: 'reflection',
    type: 'number',
    default: '1',
    description: 'Strength of the highlights and reflections on the surface, from 0 to 2.'
  },
  {
    name: 'shadow',
    type: 'number',
    default: '0.5',
    description: 'Strength of the shadow and the focused light the glass casts below it, from 0 to 1.'
  },
  {
    name: 'elevation',
    type: 'number',
    default: '0.4',
    description: 'How high the glass floats above the content. Higher magnifies more, until the image flips.'
  },
  {
    name: 'smoothness',
    type: 'number',
    default: '0.5',
    description: 'How lazily the glass follows, from 0 (snappy) to 1 (floaty).'
  },
  {
    name: 'wobble',
    type: 'number',
    default: '0.5',
    description:
      'How much the glass stretches when it moves and wobbles when it stops, like a liquid. 0 keeps it rigid.'
  },
  {
    name: 'spin',
    type: 'number',
    default: '0.3',
    description: 'Idle rotation speed for shapes like the cube and the torus. Negative values spin the other way.'
  },
  {
    name: 'idle',
    type: 'boolean',
    default: 'true',
    description: 'The glass drifts gently around its resting place while nobody interacts.'
  },
  { name: 'intro', type: 'boolean', default: 'true', description: 'The glass pops into place on mount.' },
  {
    name: 'maxDevicePixelRatio',
    type: 'number',
    default: '2',
    description: 'Highest pixel ratio the canvas renders at.'
  },
  {
    name: 'default (slot)',
    type: 'slot',
    default: '-',
    description: 'Content layered on top, such as buttons. It sits above the glass and is not bent by it.'
  },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the container.' },
  { name: 'style', type: 'CSSProperties', default: '-', description: 'Inline styles for the container.' }
];

const { rerenderKey, forceRerender } = useForceRerender();
const { props, defaultProps, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);
const theme = useColorModeValue('light', 'dark');

const settings = computed(() => {
  const rest: Partial<typeof props.value> = { ...props.value };
  delete rest.demo;
  delete rest.preset;
  return rest as Omit<typeof props.value, 'demo' | 'preset'>;
});

const media = computed(() => (props.value.demo === 'photo' ? PHOTO[theme.value as keyof typeof PHOTO] : undefined));

const applyPreset = (value: string) => {
  const base = Object.fromEntries(
    (Object.keys(LOOK) as (keyof Look)[]).map(name => [name, defaultProps.value[name]])
  ) as Partial<Look>;
  updateProps({ ...base, ...PRESETS[value], preset: value });
};

const setIntro = (value: boolean) => {
  updateProp('intro', value);
  forceRerender();
};
</script>
