<template>
  <h1 class="sub-category">Aero Shards</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="aeroShards.usage"
    :source="aeroShardsSource"
    componentName="AeroShards"
    :props-table="props"
  >
    <template #preview>
      <div class="relative bg-[#14110e] rounded-2xl w-full h-125 overflow-hidden demo-container">
        <AeroShards :key="key" v-bind="aeroShardsProps" />
        <BackgroundContent pillText="New Background" headline="Don't touch them, they are pretty sharp!" />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewColorPicker title="Background" v-model="backgroundColor" />
        <PreviewColorPicker title="Shards" v-model="shardColor" />
        <PreviewColorPicker title="Accent" v-model="accentColor" />
        <PreviewSelect title="Placement" :options="['right', 'left', 'center', 'full']" v-model="placement" />
        <PreviewSelect title="Material" :options="['pearl', 'chrome', 'satin']" v-model="material" />
        <PreviewSelect title="Detail" :options="['bold', 'balanced', 'fine']" v-model="detail" />
        <PreviewSelect title="Flow" :options="['stream', 'vortex', 'ribbon']" v-model="flow" />
        <PreviewSelect
          title="Effect"
          :options="['none', 'dither', { value: 'ascii', label: 'ASCII' }]"
          v-model="effect"
        />
        <PreviewSelect title="Interaction" :options="['none', 'repel', 'attract']" v-model="interaction" />
        <PreviewSlider title="Scale" :min="0.5" :max="2.5" :step="0.05" v-model="scale" />
        <PreviewSlider title="Spread" :min="0.15" :max="1.1" :step="0.05" v-model="spread" />
        <PreviewSlider title="Depth" :min="0" :max="1.25" :step="0.05" v-model="depth" />
        <PreviewSlider title="Speed" :min="0" :max="2" :step="0.05" v-model="speed" />
        <PreviewSlider title="Spin" :min="0" :max="2" :step="0.05" v-model="spin" />
        <PreviewSlider title="Density" :min="0.5" :max="1.5" :step="0.05" v-model="density" />
        <PreviewSlider title="Shard Size" :min="0.5" :max="1.5" :step="0.05" v-model="shardSize" />
        <PreviewSlider title="Stretch" :min="0.6" :max="1.8" :step="0.05" v-model="stretch" />
        <PreviewSlider title="Turbulence" :min="0" :max="2" :step="0.05" v-model="turbulence" />
        <PreviewSlider title="Glow" :min="0" :max="2" :step="0.05" v-model="glow" />
        <PreviewSlider title="Edge Softness" :min="0" :max="2" :step="0.05" v-model="edgeSoftness" />
        <PreviewSlider title="Bloom" :min="0" :max="3" :step="0.05" v-model="bloom" />
        <PreviewSlider title="Grain" :min="0" :max="0.12" :step="0.0025" v-model="grain" />
        <PreviewSlider title="Chromatic Aberration" :min="0" :max="0.01" :step="0.0005" v-model="chromaticAberration" />
        <PreviewSlider title="Transition Duration" :min="0.2" :max="2" :step="0.05" v-model="transitionDuration" />
        <PreviewSlider title="Interaction Radius" :min="0.5" :max="2" :step="0.05" v-model="interactionRadius" />
        <PreviewSlider title="Interaction Strength" :min="0" :max="2" :step="0.05" v-model="interactionStrength" />
        <PreviewSlider title="Ripple Intensity" :min="0" :max="2" :step="0.05" v-model="rippleIntensity" />
        <PreviewSwitch title="Hold to Gather" v-model="holdToGather" />
        <PreviewSwitch title="Paused" v-model="paused" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="aeroShards" :usage="aeroShards.usage!" :source="aeroShardsSource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import BackgroundContent from '@/components/common/BackgroundContent.vue';
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewColorPicker from '@/components/common/PreviewColorPicker.vue';
import PreviewSelect from '@/components/common/PreviewSelect.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { aeroShards } from '@/constants/code/Backgrounds/aeroShardsCode';
import AeroShards, {
  EFFECTS,
  FLOWS,
  type Detail,
  type Interaction,
  type Material,
  type Placement
} from '@/content/Backgrounds/AeroShards/AeroShards.vue';
import aeroShardsSource from '@/content/Backgrounds/AeroShards/AeroShards.vue?raw';
import { computed, ref } from 'vue';

const { rerenderKey: key, forceRerender } = useForceRerender();

const DEFAULTS = {
  backgroundColor: '#120F17',
  shardColor: '#6abd71',
  accentColor: '#84CC16',
  placement: 'full' as Placement,
  flow: 'stream' as keyof typeof FLOWS,
  material: 'pearl' as Material,
  detail: 'balanced' as Detail,
  effect: 'none' as keyof typeof EFFECTS,
  scale: 1,
  spread: 1,
  depth: 1,
  speed: 1,
  spin: 1,
  interaction: 'repel' as Interaction,
  density: 1.5,
  shardSize: 1.1,
  stretch: 1,
  turbulence: 1,
  glow: 1,
  edgeSoftness: 2,
  bloom: 0.5,
  grain: 0.05,
  chromaticAberration: 0.0075,
  transitionDuration: 1,
  interactionRadius: 1.5,
  interactionStrength: 0.5,
  rippleIntensity: 1,
  holdToGather: true,
  paused: false
};

const backgroundColor = ref(DEFAULTS.backgroundColor);
const shardColor = ref(DEFAULTS.shardColor);
const accentColor = ref(DEFAULTS.accentColor);
const placement = ref(DEFAULTS.placement);
const flow = ref(DEFAULTS.flow);
const material = ref(DEFAULTS.material);
const detail = ref(DEFAULTS.detail);
const effect = ref(DEFAULTS.effect);
const scale = ref(DEFAULTS.scale);
const spread = ref(DEFAULTS.spread);
const depth = ref(DEFAULTS.depth);
const speed = ref(DEFAULTS.speed);
const spin = ref(DEFAULTS.spin);
const interaction = ref(DEFAULTS.interaction);
const density = ref(DEFAULTS.density);
const shardSize = ref(DEFAULTS.shardSize);
const stretch = ref(DEFAULTS.stretch);
const turbulence = ref(DEFAULTS.turbulence);
const glow = ref(DEFAULTS.glow);
const edgeSoftness = ref(DEFAULTS.edgeSoftness);
const bloom = ref(DEFAULTS.bloom);
const grain = ref(DEFAULTS.grain);
const chromaticAberration = ref(DEFAULTS.chromaticAberration);
const transitionDuration = ref(DEFAULTS.transitionDuration);
const interactionRadius = ref(DEFAULTS.interactionRadius);
const interactionStrength = ref(DEFAULTS.interactionStrength);
const rippleIntensity = ref(DEFAULTS.rippleIntensity);
const holdToGather = ref(DEFAULTS.holdToGather);
const paused = ref(DEFAULTS.paused);

const aeroShardsProps = computed(() => ({
  backgroundColor: backgroundColor.value,
  shardColor: shardColor.value,
  accentColor: accentColor.value,
  placement: placement.value,
  flow: flow.value,
  material: material.value,
  detail: detail.value,
  effect: effect.value,
  scale: scale.value,
  spread: spread.value,
  depth: depth.value,
  speed: speed.value,
  spin: spin.value,
  interaction: interaction.value,
  density: density.value,
  shardSize: shardSize.value,
  stretch: stretch.value,
  turbulence: turbulence.value,
  glow: glow.value,
  edgeSoftness: edgeSoftness.value,
  bloom: bloom.value,
  grain: grain.value,
  chromaticAberration: chromaticAberration.value,
  transitionDuration: transitionDuration.value,
  interactionRadius: interactionRadius.value,
  interactionStrength: interactionStrength.value,
  rippleIntensity: rippleIntensity.value,
  holdToGather: holdToGather.value,
  paused: paused.value
}));

const hasChanges = computed(
  () =>
    backgroundColor.value !== DEFAULTS.backgroundColor ||
    shardColor.value !== DEFAULTS.shardColor ||
    accentColor.value !== DEFAULTS.accentColor ||
    placement.value !== DEFAULTS.placement ||
    flow.value !== DEFAULTS.flow ||
    material.value !== DEFAULTS.material ||
    detail.value !== DEFAULTS.detail ||
    effect.value !== DEFAULTS.effect ||
    scale.value !== DEFAULTS.scale ||
    spread.value !== DEFAULTS.spread ||
    depth.value !== DEFAULTS.depth ||
    speed.value !== DEFAULTS.speed ||
    spin.value !== DEFAULTS.spin ||
    interaction.value !== DEFAULTS.interaction ||
    density.value !== DEFAULTS.density ||
    shardSize.value !== DEFAULTS.shardSize ||
    stretch.value !== DEFAULTS.stretch ||
    turbulence.value !== DEFAULTS.turbulence ||
    glow.value !== DEFAULTS.glow ||
    edgeSoftness.value !== DEFAULTS.edgeSoftness ||
    bloom.value !== DEFAULTS.bloom ||
    grain.value !== DEFAULTS.grain ||
    chromaticAberration.value !== DEFAULTS.chromaticAberration ||
    transitionDuration.value !== DEFAULTS.transitionDuration ||
    interactionRadius.value !== DEFAULTS.interactionRadius ||
    interactionStrength.value !== DEFAULTS.interactionStrength ||
    rippleIntensity.value !== DEFAULTS.rippleIntensity ||
    holdToGather.value !== DEFAULTS.holdToGather ||
    paused.value !== DEFAULTS.paused
);

function reset() {
  backgroundColor.value = DEFAULTS.backgroundColor;
  shardColor.value = DEFAULTS.shardColor;
  accentColor.value = DEFAULTS.accentColor;
  placement.value = DEFAULTS.placement;
  flow.value = DEFAULTS.flow;
  material.value = DEFAULTS.material;
  detail.value = DEFAULTS.detail;
  effect.value = DEFAULTS.effect;
  scale.value = DEFAULTS.scale;
  spread.value = DEFAULTS.spread;
  depth.value = DEFAULTS.depth;
  speed.value = DEFAULTS.speed;
  spin.value = DEFAULTS.spin;
  interaction.value = DEFAULTS.interaction;
  density.value = DEFAULTS.density;
  shardSize.value = DEFAULTS.shardSize;
  stretch.value = DEFAULTS.stretch;
  turbulence.value = DEFAULTS.turbulence;
  glow.value = DEFAULTS.glow;
  edgeSoftness.value = DEFAULTS.edgeSoftness;
  bloom.value = DEFAULTS.bloom;
  grain.value = DEFAULTS.grain;
  chromaticAberration.value = DEFAULTS.chromaticAberration;
  transitionDuration.value = DEFAULTS.transitionDuration;
  interactionRadius.value = DEFAULTS.interactionRadius;
  interactionStrength.value = DEFAULTS.interactionStrength;
  rippleIntensity.value = DEFAULTS.rippleIntensity;
  holdToGather.value = DEFAULTS.holdToGather;
  paused.value = DEFAULTS.paused;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'backgroundColor',
    type: 'string',
    default: "'#120F17'",
    description: 'Background behind the wind sculpture. Lighting and bloom adapt automatically to light surfaces.'
  },
  {
    name: 'shardColor',
    type: 'string',
    default: "'#6abd71'",
    description: 'Primary body color for the shards.'
  },
  {
    name: 'accentColor',
    type: 'string',
    default: "'#84CC16'",
    description: 'Accent color used to derive reflections, depth, and highlights.'
  },
  {
    name: 'placement',
    type: "'right' | 'left' | 'center' | 'full'",
    default: "'full'",
    description: 'Places the sculpture while preserving a content-safe region.'
  },
  {
    name: 'material',
    type: "'pearl' | 'chrome' | 'satin'",
    default: "'pearl'",
    description: 'Applies a complete lighting and surface finish.'
  },
  {
    name: 'detail',
    type: "'bold' | 'balanced' | 'fine'",
    default: "'balanced'",
    description: 'Balances shard count and size into a finished visual texture.'
  },
  {
    name: 'flow',
    type: "'stream' | 'vortex' | 'ribbon'",
    default: "'stream'",
    description:
      'Morphs the same shards between a flowing stream, circulating vortex, and twisted ribbon without restarting the animation.'
  },
  {
    name: 'rippleIntensity',
    type: 'number',
    default: '1',
    description: 'Strength of the click/release wave and its accent-colored illumination. Set to 0 to disable ripples.'
  },
  {
    name: 'holdToGather',
    type: 'boolean',
    default: 'true',
    description:
      'Press and hold to gather a softly circulating cloud around the cursor; release to unfurl. Respects interaction="none", pause, and reduced motion.'
  },
  {
    name: 'effect',
    type: "'none' | 'dither' | 'ascii'",
    default: "'none'",
    description:
      'Applies ordered color dithering or compact, shape-matched ASCII before postprocessing. Stylized modes use fewer, larger shards for readability; none preserves the original render.'
  },
  {
    name: 'scale',
    type: 'number',
    default: '1',
    description: 'Zooms the complete shard field without changing its shard count or individual shard size.'
  },
  {
    name: 'spread',
    type: 'number',
    default: '1',
    description: 'Controls how tightly the shards gather around the flow path.'
  },
  {
    name: 'depth',
    type: 'number',
    default: '1',
    description: 'Controls front-to-back volume and perspective variation.'
  },
  {
    name: 'speed',
    type: 'number',
    default: '1',
    description: 'Controls the shared travel speed of every shard.'
  },
  {
    name: 'spin',
    type: 'number',
    default: '1',
    description: 'Controls how quickly shards roll around their direction of travel.'
  },
  {
    name: 'interaction',
    type: "'none' | 'repel' | 'attract'",
    default: "'repel'",
    description:
      'Disables interaction or enables damped cursor repulsion/attraction and click ripples across the field.'
  },
  {
    name: 'density',
    type: 'number',
    default: '1.5',
    description: 'Fine-tuning multiplier for the shard count selected by detail.'
  },
  {
    name: 'shardSize',
    type: 'number',
    default: '1.1',
    description: 'Fine-tuning multiplier for the shard size selected by detail.'
  },
  {
    name: 'stretch',
    type: 'number',
    default: '1',
    description: 'Controls shard length without changing their overall count.'
  },
  {
    name: 'turbulence',
    type: 'number',
    default: '1',
    description: 'Fine-tuning multiplier for the turbulence produced by motion.'
  },
  {
    name: 'glow',
    type: 'number',
    default: '1',
    description: 'Fine-tuning multiplier for emissive edges and reflected highlights.'
  },
  {
    name: 'edgeSoftness',
    type: 'number',
    default: '2',
    description: 'Controls analytic antialiasing without blurring the whole image.'
  },
  {
    name: 'bloom',
    type: 'number',
    default: '0.5',
    description:
      'Adds a soft halo without blurring the shards; on light backgrounds the halo uses the shard and accent colors.'
  },
  {
    name: 'grain',
    type: 'number',
    default: '0.05',
    description: 'Adds screen-space film grain; set to 0 for a completely clean render.'
  },
  {
    name: 'chromaticAberration',
    type: 'number',
    default: '0.0075',
    description:
      'Adds RGB edge separation; set to 0 for a color-neutral finish. Dither and ASCII use subtler separation to preserve their fine patterns.'
  },
  {
    name: 'transitionDuration',
    type: 'number',
    default: '1',
    description: 'Controls the transition time for placement and flow formation changes.'
  },
  {
    name: 'interactionRadius',
    type: 'number',
    default: '1.5',
    description: 'Scales the soft, flow-aligned reach of the cursor interaction.'
  },
  {
    name: 'interactionStrength',
    type: 'number',
    default: '0.5',
    description: 'Fine-tuning multiplier for the selected interaction force.'
  },
  { name: 'paused', type: 'boolean', default: 'false', description: 'Freezes the shard field.' },
  { name: 'className', type: 'string', default: "''", description: 'Additional classes for the root element.' },
  {
    name: 'onError',
    type: '(error: Error) => void',
    default: 'undefined',
    description: 'Called when WebGPU setup or rendering fails.'
  }
];
</script>
