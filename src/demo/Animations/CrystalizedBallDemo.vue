<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
  >
    <TabsLayout>
      <template #preview>
        <div class="demo-container relative overflow-hidden" style="height: 500px; padding: 0">
          <CrystalizedBall :key="rerenderKey" v-bind="props" :theme="theme" />
          <RefreshButton @click="forceRerender" />
        </div>

        <Customize>
          <PreviewSelect
            title="Preset"
            :options="PRESET_OPTIONS"
            :model-value="props.preset"
            @update:model-value="choosePreset"
          />
          <PreviewSelect
            title="Motion"
            :options="MOTION_OPTIONS"
            :model-value="props.motion"
            @update:model-value="value => updateProp('motion', value as Motion)"
          />
          <PreviewSelect
            title="Particle Shape"
            :options="SHAPE_OPTIONS"
            :model-value="props.particleShape"
            @update:model-value="value => updateProp('particleShape', value as ParticleShape)"
          />

          <PreviewColorPickerCustom
            title="Color"
            :color="props.color"
            @change="(value: string) => updateProp('color', value)"
          />

          <PreviewSlider
            title="Size"
            :min="0.25"
            :max="1"
            :step="0.01"
            :model-value="props.size"
            @update:model-value="value => updateProp('size', value)"
          />
          <PreviewSlider
            title="Glow"
            :min="0"
            :max="1.5"
            :step="0.05"
            :model-value="props.glow"
            @update:model-value="value => updateProp('glow', value)"
          />
          <PreviewSlider
            title="Haze"
            :min="0"
            :max="1.5"
            :step="0.05"
            :model-value="props.haze"
            @update:model-value="value => updateProp('haze', value)"
          />

          <PreviewSlider
            title="Strands"
            :min="1"
            :max="8"
            :step="1"
            :model-value="props.strands"
            @update:model-value="value => updateProp('strands', value)"
          />
          <PreviewSlider
            title="Crackle"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.crackle"
            @update:model-value="value => updateProp('crackle', value)"
          />
          <PreviewSlider
            title="Flares"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.flares"
            @update:model-value="value => updateProp('flares', value)"
          />
          <PreviewSlider
            title="Sparks"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.sparks"
            @update:model-value="value => updateProp('sparks', value)"
          />

          <PreviewSlider
            title="Particles"
            :min="0"
            :max="40000"
            :step="500"
            :model-value="props.particleCount"
            @update:model-value="value => updateProp('particleCount', value)"
          />
          <PreviewSlider
            title="Fill"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.fill"
            @update:model-value="value => updateProp('fill', value)"
          />
          <PreviewSlider
            title="Depth"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.depth"
            @update:model-value="value => updateProp('depth', value)"
          />
          <PreviewSlider
            title="Twinkle"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.twinkle"
            @update:model-value="value => updateProp('twinkle', value)"
          />

          <PreviewSlider
            title="Speed"
            :min="0"
            :max="2"
            :step="0.05"
            :model-value="props.speed"
            @update:model-value="value => updateProp('speed', value)"
          />
          <PreviewSlider
            title="Dust Speed"
            :min="0"
            :max="2"
            :step="0.05"
            :model-value="props.dustSpeed"
            @update:model-value="value => updateProp('dustSpeed', value)"
          />
          <PreviewSlider
            title="Sway"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.sway"
            @update:model-value="value => updateProp('sway', value)"
          />

          <PreviewSwitch
            title="Interactive"
            :model-value="props.interactive"
            @update:model-value="value => updateProp('interactive', value)"
          />
          <PreviewSlider
            title="Hover Strength"
            :min="0"
            :max="1"
            :step="0.05"
            :is-disabled="!props.interactive"
            :model-value="props.hoverStrength"
            @update:model-value="value => updateProp('hoverStrength', value)"
          />
          <PreviewSwitch
            title="Intro"
            :model-value="props.intro"
            @update:model-value="value => updateProp('intro', value)"
          />
          <PreviewSwitch
            title="Paused"
            :model-value="props.paused"
            @update:model-value="value => updateProp('paused', value)"
          />
        </Customize>

        <PropTable :data="propData" />
        <Dependencies :dependency-list="['ogl']" />
      </template>

      <template #code>
        <CodeExample :code-object="crystalizedBall" component-name="CrystalizedBall" />
      </template>
    </TabsLayout>
  </ComponentPropsProvider>
</template>

<script setup lang="ts">
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
import { crystalizedBall } from '@/constants/code/Animations/crystalizedBallCode';
import CrystalizedBall from '@/content/Animations/CrystalizedBall/CrystalizedBall.vue';

type Motion = 'rise' | 'fall' | 'drift' | 'orbit';
type ParticleShape = 'square' | 'round';
type Preset = 'plasma' | 'aurora' | 'nebula' | 'ember' | 'frost' | 'solar' | 'eclipse' | 'abyss';

interface PresetValues {
  color: string;
  strands: number;
  crackle: number;
  flares: number;
  glow: number;
  sparks: number;
  particleCount: number;
  fill: number;
  motion: Motion;
  particleShape: ParticleShape;
  depth: number;
  sway: number;
  twinkle: number;
  haze: number;
  dustSpeed: number;
}

const PRESETS: Record<string, PresetValues> = {
  plasma: {
    color: '#42B883',
    strands: 6,
    crackle: 0.85,
    flares: 0.65,
    glow: 0.9,
    sparks: 0.6,
    particleCount: 15000,
    fill: 0.5,
    motion: 'rise' as Motion,
    particleShape: 'square' as ParticleShape,
    depth: 0.6,
    sway: 0.5,
    twinkle: 0.5,
    haze: 0.7,
    dustSpeed: 1
  },
  aurora: {
    color: '#5CFFC8',
    strands: 5,
    crackle: 0.6,
    flares: 0.5,
    glow: 0.8,
    sparks: 0.45,
    particleCount: 15000,
    fill: 0.5,
    motion: 'rise' as Motion,
    particleShape: 'square' as ParticleShape,
    depth: 0.6,
    sway: 0.5,
    twinkle: 0.5,
    haze: 0.7,
    dustSpeed: 1
  },
  nebula: {
    color: '#7CFF67',
    strands: 6,
    crackle: 1,
    flares: 0.5,
    glow: 0.9,
    sparks: 0.6,
    particleCount: 18000,
    fill: 0.45,
    motion: 'rise' as Motion,
    particleShape: 'square' as ParticleShape,
    depth: 0.5,
    sway: 0.4,
    twinkle: 0.6,
    haze: 0.8,
    dustSpeed: 1.2
  },
  ember: {
    color: '#FF8A2A',
    strands: 5,
    crackle: 0.9,
    flares: 0.8,
    glow: 1,
    sparks: 0.8,
    particleCount: 12000,
    fill: 0.35,
    motion: 'rise' as Motion,
    particleShape: 'round' as ParticleShape,
    depth: 0.7,
    sway: 0.3,
    twinkle: 0.7,
    haze: 0.9,
    dustSpeed: 1.6
  },
  frost: {
    color: '#BFE6FF',
    strands: 3,
    crackle: 0.3,
    flares: 0.3,
    glow: 0.6,
    sparks: 0.2,
    particleCount: 16000,
    fill: 0.6,
    motion: 'fall' as Motion,
    particleShape: 'round' as ParticleShape,
    depth: 0.8,
    sway: 0.4,
    twinkle: 0.4,
    haze: 0.5,
    dustSpeed: 0.7
  },
  solar: {
    color: '#FFD36E',
    strands: 6,
    crackle: 0.7,
    flares: 1,
    glow: 1.1,
    sparks: 0.5,
    particleCount: 15000,
    fill: 0.55,
    motion: 'orbit' as Motion,
    particleShape: 'square' as ParticleShape,
    depth: 0.6,
    sway: 0.7,
    twinkle: 0.5,
    haze: 0.8,
    dustSpeed: 1
  },
  eclipse: {
    color: '#FFFFFF',
    strands: 4,
    crackle: 0.5,
    flares: 0.4,
    glow: 0.7,
    sparks: 0.35,
    particleCount: 14000,
    fill: 0.5,
    motion: 'drift' as Motion,
    particleShape: 'square' as ParticleShape,
    depth: 0.7,
    sway: 0.5,
    twinkle: 0.5,
    haze: 0.5,
    dustSpeed: 0.8
  },
  abyss: {
    color: '#3F7BFF',
    strands: 5,
    crackle: 0.55,
    flares: 0.6,
    glow: 0.9,
    sparks: 0.4,
    particleCount: 20000,
    fill: 0.8,
    motion: 'orbit' as Motion,
    particleShape: 'round' as ParticleShape,
    depth: 0.8,
    sway: 0.8,
    twinkle: 0.5,
    haze: 0.6,
    dustSpeed: 0.9
  }
};

const PRESET_OPTIONS = [
  { label: 'Plasma', value: 'plasma' },
  { label: 'Aurora', value: 'aurora' },
  { label: 'Nebula', value: 'nebula' },
  { label: 'Ember', value: 'ember' },
  { label: 'Frost', value: 'frost' },
  { label: 'Solar', value: 'solar' },
  { label: 'Eclipse', value: 'eclipse' },
  { label: 'Abyss', value: 'abyss' }
];

const MOTION_OPTIONS = [
  { label: 'Rise', value: 'rise' },
  { label: 'Fall', value: 'fall' },
  { label: 'Drift', value: 'drift' },
  { label: 'Orbit', value: 'orbit' }
];

const SHAPE_OPTIONS = [
  { label: 'Square', value: 'square' },
  { label: 'Round', value: 'round' }
];

const DEFAULT_PROPS = {
  preset: 'plasma' as Preset,
  ...PRESETS.plasma,
  size: 0.7,
  speed: 1,
  interactive: true,
  hoverStrength: 0.7,
  intro: true,
  paused: false
};

const { rerenderKey, forceRerender } = useForceRerender();
const { props, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);
const theme = useColorModeValue<'light' | 'dark'>('light', 'dark');

const choosePreset = (value: string | number) => {
  const key = String(value);
  updateProps({ preset: key as Preset, ...(PRESETS[key] || PRESETS.plasma) });
};

const propData: PropRow[] = [
  {
    name: 'preset',
    type: "'plasma' | 'aurora' | 'nebula' | 'ember' | 'frost' | 'solar' | 'eclipse' | 'abyss'",
    default: "'plasma'",
    description:
      'A complete starting look, color included. Any prop marked from preset overrides the preset value when you pass it.'
  },
  {
    name: 'color',
    type: 'string',
    default: 'from preset',
    description:
      'The one color of the ball. The white-hot rim, its glow and flares, the dust tones, sparks and haze are all derived from it.'
  },
  {
    name: 'theme',
    type: "'dark' | 'light'",
    default: "'dark'",
    description:
      'The background the ball sits on. Dark renders it as emitted light. Light draws it in crisp ink with a white-hot rim core.'
  },
  {
    name: 'size',
    type: 'number',
    default: '0.7',
    description: 'Diameter of the ball as a fraction of the smaller side of the container.'
  },
  {
    name: 'strands',
    type: 'number',
    default: 'from preset',
    description: 'Number of electric strands braided around the rim, from 1 to 8.'
  },
  {
    name: 'crackle',
    type: 'number',
    default: 'from preset',
    description: 'How far the strands bend and jitter. Low values hum quietly, high values crackle.'
  },
  {
    name: 'flares',
    type: 'number',
    default: 'from preset',
    description: 'How far the glow licks outward from the rim in slow, travelling flares.'
  },
  {
    name: 'glow',
    type: 'number',
    default: 'from preset',
    description: 'Strength of the halo around the rim.'
  },
  {
    name: 'sparks',
    type: 'number',
    default: 'from preset',
    description: 'How often small arcs discharge along the inside of the rim. 0 turns them off.'
  },
  {
    name: 'particleCount',
    type: 'number',
    default: 'from preset',
    description: 'Number of dust particles in the ball, up to 40000.'
  },
  {
    name: 'fill',
    type: 'number',
    default: 'from preset',
    description: 'How full the ball is. Low values pool the dust at the bottom, high values float it up to the top.'
  },
  {
    name: 'motion',
    type: "'rise' | 'fall' | 'drift' | 'orbit'",
    default: 'from preset',
    description:
      'How the dust moves. Rise floats like embers, fall drifts down like snow, drift wanders and orbit loops in small circles.'
  },
  {
    name: 'particleShape',
    type: "'square' | 'round'",
    default: 'from preset',
    description: 'Crisp square pixels or soft round dots.'
  },
  {
    name: 'depth',
    type: 'number',
    default: 'from preset',
    description: 'Strength of the depth cues. Dust at the back of the ball gets smaller and dimmer.'
  },
  {
    name: 'sway',
    type: 'number',
    default: 'from preset',
    description: 'How much the dust turns back and forth inside the glass, showing its depth.'
  },
  {
    name: 'twinkle',
    type: 'number',
    default: 'from preset',
    description: 'How much the dust sparkles on and off.'
  },
  {
    name: 'haze',
    type: 'number',
    default: 'from preset',
    description: 'Strength of the glow that pools under the dust and along the inside of the glass.'
  },
  {
    name: 'speed',
    type: 'number',
    default: '1',
    description: 'Animation speed of the rim, flares and sparks.'
  },
  {
    name: 'dustSpeed',
    type: 'number',
    default: 'from preset',
    description: 'Animation speed of the dust.'
  },
  {
    name: 'interactive',
    type: 'boolean',
    default: 'true',
    description:
      'Lets the cursor touch the ball. The rim heats up and flares toward it, the dust swirls in its wake and turns toward it, and a click shakes the ball.'
  },
  {
    name: 'hoverStrength',
    type: 'number',
    default: '0.7',
    description: 'How strongly the ball reacts to the cursor, from 0 to 1.'
  },
  {
    name: 'intro',
    type: 'boolean',
    default: 'true',
    description: 'On mount the rim powers up and the dust lights up from the bottom of the ball.'
  },
  {
    name: 'paused',
    type: 'boolean',
    default: 'false',
    description: 'Freezes the animation. The dust can still be stirred.'
  },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the root element.' },
  { name: 'style', type: 'StyleValue', default: '-', description: 'Inline styles for the root element.' }
];
</script>
