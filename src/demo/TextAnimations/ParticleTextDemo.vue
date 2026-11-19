<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
    :demo-only-props="['preset']"
  >
    <TabsLayout>
      <template #preview>
        <div class="demo-container relative overflow-hidden" style="height: 430px">
          <RefreshButton @click="forceRerender" />
          <ParticleText :key="`${props.preset}-${rerenderKey}`" v-bind="settings" />
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
            :color="shown(settings.color)"
            @change="value => updateProp('color', value)"
          />
          <PreviewColorPickerCustom
            title="Highlight Color"
            :color="shown(settings.highlightColor)"
            @change="value => updateProp('highlightColor', value)"
          />

          <PreviewSelect
            title="Intro"
            :options="INTRO_OPTIONS"
            :model-value="settings.intro"
            @update:model-value="value => replay('intro', value as Intro)"
          />

          <PreviewSelect
            title="Trigger"
            :options="TRIGGER_OPTIONS"
            :model-value="settings.trigger"
            @update:model-value="value => updateProp('trigger', value as Trigger)"
          />

          <PreviewSlider
            title="Gather"
            :min="500"
            :max="3000"
            :step="100"
            value-unit="ms"
            :model-value="settings.gatherDuration"
            @update:model-value="value => updateProp('gatherDuration', value)"
          />

          <PreviewSlider
            title="Stagger"
            :min="0"
            :max="900"
            :step="30"
            value-unit="ms"
            :model-value="settings.stagger"
            @update:model-value="value => updateProp('stagger', value)"
          />

          <PreviewSlider
            title="Scatter"
            :min="40"
            :max="320"
            :step="10"
            value-unit="px"
            :model-value="settings.scatter"
            @update:model-value="value => updateProp('scatter', value)"
          />

          <PreviewSwitch
            title="Click Burst"
            :is-disabled="settings.trigger === 'click'"
            :model-value="settings.clickBurst"
            @update:model-value="value => updateProp('clickBurst', value)"
          />

          <PreviewSlider
            title="Burst Strength"
            :min="0.2"
            :max="2.5"
            :step="0.1"
            :is-disabled="!settings.clickBurst || settings.trigger === 'click'"
            :model-value="settings.burstStrength"
            @update:model-value="value => updateProp('burstStrength', value)"
          />

          <PreviewSlider
            title="Repel Strength"
            :min="0"
            :max="90"
            :step="2"
            :model-value="settings.pointerRepel"
            @update:model-value="value => updateProp('pointerRepel', value)"
          />

          <PreviewSlider
            title="Repel Radius"
            :min="40"
            :max="220"
            :step="5"
            value-unit="px"
            :model-value="settings.repelRadius"
            @update:model-value="value => updateProp('repelRadius', value)"
          />

          <PreviewSlider
            title="Idle Drift"
            :min="0"
            :max="2"
            :step="0.1"
            value-unit="px"
            :model-value="settings.idleDrift"
            @update:model-value="value => updateProp('idleDrift', value)"
          />

          <PreviewSelect
            title="Shape"
            :options="SHAPE_OPTIONS"
            :model-value="settings.shape"
            @update:model-value="value => updateProp('shape', value as Shape)"
          />

          <PreviewSelect
            title="Highlight"
            :options="HIGHLIGHT_OPTIONS"
            :model-value="settings.highlightMode"
            @update:model-value="value => updateProp('highlightMode', value as HighlightMode)"
          />

          <PreviewSelect
            title="Weight"
            :options="WEIGHT_OPTIONS"
            :model-value="settings.fontWeight"
            @update:model-value="value => updateProp('fontWeight', Number(value))"
          />

          <PreviewSlider
            title="Particle Size"
            :min="1"
            :max="4"
            :step="0.1"
            value-unit="px"
            :model-value="settings.particleSize"
            @update:model-value="value => updateProp('particleSize', value)"
          />

          <PreviewSlider
            title="Density"
            :min="2"
            :max="8"
            :step="1"
            :model-value="settings.density"
            @update:model-value="value => updateProp('density', value)"
          />

          <PreviewSwitch
            title="Glow"
            :model-value="settings.glow"
            @update:model-value="value => updateProp('glow', value)"
          />

          <PreviewInput
            title="Text"
            placeholder="Your heading"
            :max-length="24"
            :model-value="settings.text"
            @update:model-value="value => updateProp('text', value)"
          />
        </Customize>

        <PropTable :data="propData" />
        <Dependencies :dependency-list="[]" />
      </template>

      <template #code>
        <CodeExample :code-object="particleText" component-name="ParticleText" />
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
import { particleText } from '@/constants/code/TextAnimations/particleTextCode';
import ParticleText from '@/content/TextAnimations/ParticleText/ParticleText.vue';

type Intro = 'gather' | 'rain' | 'spiral' | 'scan';
type Shape = 'circle' | 'square' | 'line';
type Trigger = 'mount' | 'hover' | 'click';
type HighlightMode = 'motion' | 'gradient';

type Look = {
  highlightColor: string;
  intro: Intro;
  gatherDuration: number;
  stagger: number;
  scatter: number;
  clickBurst: boolean;
  burstStrength: number;
  pointerRepel: number;
  repelRadius: number;
  idleDrift: number;
  shape: Shape;
  highlightMode: HighlightMode;
  particleSize: number;
  density: number;
  glow: boolean;
};

const LOOK: Look = {
  highlightColor: '#ff5a36',
  intro: 'gather',
  gatherDuration: 1600,
  stagger: 420,
  scatter: 190,
  clickBurst: true,
  burstStrength: 1,
  pointerRepel: 42,
  repelRadius: 120,
  idleDrift: 0.8,
  shape: 'circle',
  highlightMode: 'motion',
  particleSize: 2.2,
  density: 4,
  glow: true
};

const PRESETS: Record<string, Look> = {
  ember: { ...LOOK },
  rain: {
    ...LOOK,
    highlightColor: '#4f8dff',
    intro: 'rain',
    gatherDuration: 1900,
    stagger: 760,
    scatter: 120,
    burstStrength: 1.3,
    pointerRepel: 34,
    repelRadius: 110,
    idleDrift: 0,
    shape: 'line',
    particleSize: 1.7,
    density: 4,
    glow: false
  },
  vortex: {
    ...LOOK,
    highlightColor: '#8e958f',
    intro: 'spiral',
    gatherDuration: 2600,
    stagger: 650,
    scatter: 240,
    burstStrength: 1.7,
    pointerRepel: 30,
    repelRadius: 150,
    idleDrift: 1.3,
    particleSize: 1.5,
    density: 2,
    glow: false
  },
  scan: {
    ...LOOK,
    highlightColor: '#22c55e',
    intro: 'scan',
    gatherDuration: 1800,
    stagger: 240,
    scatter: 120,
    burstStrength: 0.8,
    pointerRepel: 24,
    repelRadius: 90,
    idleDrift: 0,
    shape: 'square',
    particleSize: 3,
    density: 5,
    glow: false
  }
};

const PRESET_OPTIONS = [
  { value: 'ember', label: 'Ember' },
  { value: 'rain', label: 'Rain' },
  { value: 'vortex', label: 'Vortex' },
  { value: 'scan', label: 'Scan' }
];

const DEFAULT_PROPS = {
  preset: 'ember',
  text: 'Future Interfaces',
  color: 'currentColor',
  ...LOOK,
  trigger: 'mount' as Trigger,
  fontSize: 'clamp(3.5rem, 13vw, 9rem)',
  fontWeight: 800,
  fontFamily: 'inherit'
};

const INTRO_OPTIONS = [
  { value: 'gather', label: 'Gather' },
  { value: 'rain', label: 'Rain' },
  { value: 'spiral', label: 'Spiral' },
  { value: 'scan', label: 'Scan' }
];

const SHAPE_OPTIONS = [
  { value: 'circle', label: 'Circle' },
  { value: 'square', label: 'Square' },
  { value: 'line', label: 'Line' }
];

const TRIGGER_OPTIONS = [
  { value: 'mount', label: 'Mount' },
  { value: 'hover', label: 'Hover' },
  { value: 'click', label: 'Click' }
];

const HIGHLIGHT_OPTIONS = [
  { value: 'motion', label: 'Motion' },
  { value: 'gradient', label: 'Gradient' }
];

const WEIGHT_OPTIONS = [
  { value: 500, label: '500' },
  { value: 650, label: '650' },
  { value: 800, label: '800' },
  { value: 900, label: '900' }
];

const propData: PropRow[] = [
  {
    name: 'text',
    type: 'string',
    default: '"Vue Bits"',
    description: 'The words sampled into particle targets.'
  },
  {
    name: 'color',
    type: 'string',
    default: '"currentColor"',
    description: 'Particle color at rest. Follows the surrounding text color by default.'
  },
  {
    name: 'highlightColor',
    type: 'string',
    default: '"#ff5a36"',
    description:
      'Color particles take on while they fly in or get pushed around. Also colors the glow and the scan line.'
  },
  {
    name: 'intro',
    type: '"gather" | "rain" | "spiral" | "scan"',
    default: '"gather"',
    description:
      'How the text forms. Gather pulls scattered particles together, rain drops them in from above, spiral swirls them into place, and scan assembles the text behind a sweeping line.'
  },
  {
    name: 'gatherDuration',
    type: 'number',
    default: '1600',
    description: 'Milliseconds for the intro to form the text.'
  },
  {
    name: 'stagger',
    type: 'number',
    default: '420',
    description: 'Maximum per-particle delay in milliseconds before it starts moving.'
  },
  {
    name: 'scatter',
    type: 'number',
    default: '180',
    description: 'How far particles begin from their final spots in the gather and spiral intros.'
  },
  {
    name: 'trigger',
    type: '"mount" | "hover" | "click"',
    default: '"mount"',
    description: 'When the intro plays again after the first formation: never, on hover, or on click.'
  },
  {
    name: 'clickBurst',
    type: 'boolean',
    default: 'true',
    description:
      'Clicking blows the particles away from the click point, then they spring back into the text. Off while trigger is click.'
  },
  {
    name: 'burstStrength',
    type: 'number',
    default: '1',
    description: 'How hard and how wide a click burst pushes.'
  },
  {
    name: 'pointerRepel',
    type: 'number',
    default: '40',
    description: 'Strength of the cursor pushback.'
  },
  {
    name: 'repelRadius',
    type: 'number',
    default: '120',
    description: 'Cursor influence radius in pixels.'
  },
  {
    name: 'idleDrift',
    type: 'number',
    default: '0.7',
    description: 'Subtle resting motion after the text has formed.'
  },
  {
    name: 'shape',
    type: '"circle" | "square" | "line"',
    default: '"circle"',
    description:
      'How each particle is drawn. Line draws short strokes that stretch along their motion and settle into an even hatch.'
  },
  {
    name: 'highlightMode',
    type: '"motion" | "gradient"',
    default: '"motion"',
    description:
      'Motion lights up particles while they are away from their spot and cools them as they land. Gradient blends the highlight across the text from left to right.'
  },
  {
    name: 'particleSize',
    type: 'number',
    default: '2',
    description: 'Rendered size of each particle in CSS pixels.'
  },
  {
    name: 'density',
    type: 'number',
    default: '4',
    description: 'Pixel sampling step for the offscreen glyph canvas. Lower values create more particles.'
  },
  {
    name: 'glow',
    type: 'boolean',
    default: 'true',
    description: 'Adds a soft bloom in the highlight color around highlighted particles.'
  },
  {
    name: 'fontSize',
    type: 'number | string',
    default: '"clamp(3rem, 12vw, 8rem)"',
    description: 'Canvas text size used for glyph sampling.'
  },
  {
    name: 'fontWeight',
    type: 'number | string',
    default: '800',
    description: 'Font weight used for sampling.'
  },
  {
    name: 'fontFamily',
    type: 'string',
    default: '"inherit"',
    description: 'Font family used for sampling. Inherit waits for the surrounding font before sampling.'
  },
  {
    name: 'className',
    type: 'string',
    default: '""',
    description: 'Optional wrapper class name.'
  },
  {
    name: 'style',
    type: 'CSSProperties',
    default: 'undefined',
    description: 'Optional inline styles for the wrapper.'
  }
];

const { rerenderKey, forceRerender } = useForceRerender();
const { props, defaultProps, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);
const settings = computed(() => {
  const { preset: _preset, ...rest } = props.value;
  return rest;
});
const ink = useColorModeValue('#161816', '#ffffff');
const shown = (value: string) => (value === 'currentColor' ? ink.value : value);

const replay = <K extends keyof typeof DEFAULT_PROPS>(name: K, value: (typeof DEFAULT_PROPS)[K]) => {
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
</script>
