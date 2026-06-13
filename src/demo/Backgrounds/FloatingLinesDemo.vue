<template>
  <h1 class="sub-category">Floating Lines</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="floatingLines.usage"
    :source="floatingLinesSource"
    component-name="FloatingLines"
    :props-table="props"
  >
    <template #preview>
      <div class="relative p-0 h-[500px] overflow-hidden demo-container">
        <FloatingLines
          :enabled-waves="enabledWaves"
          :line-count="lineCount"
          :line-distance="lineDistance"
          :animation-speed="animationSpeed"
          :interactive="interactive"
          :bend-radius="bendRadius"
          :bend-strength="bendStrength"
          :lines-gradient="[gradientStart, gradientMid, gradientEnd]"
        />
        <BackgroundContent pill-text="New Background" headline="Waves are cool! Even cooler with lines!" />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSwitch title="Top Wave" v-model="enableTop" />
        <PreviewSwitch title="Middle Wave" v-model="enableMiddle" />
        <PreviewSwitch title="Bottom Wave" v-model="enableBottom" />
        <PreviewSlider :min="1" :max="20" :step="1" v-model="lineCount" title="Line Count" />
        <PreviewSlider :min="1" :max="100" :step="0.5" v-model="lineDistance" title="Line Distance" />
        <PreviewSlider :min="0.1" :max="5" :step="0.1" v-model="animationSpeed" title="Animation Speed" />
        <PreviewSwitch v-model="interactive" title="Interactive" />
        <PreviewSlider :min="1" :max="30" :step="0.5" v-model="bendRadius" title="Bend Radius" />
        <PreviewSlider :min="-15" :max="15" :step="0.5" v-model="bendStrength" title="Bend Strength" />
        <PreviewColorPicker title="Gradient Start" v-model="gradientStart" />
        <PreviewColorPicker title="Gradient Mid" v-model="gradientMid" />
        <PreviewColorPicker title="Gradient End" v-model="gradientEnd" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="floating-lines" :usage="floatingLines.usage!" :source="floatingLinesSource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import BackgroundContent from '@/components/common/BackgroundContent.vue';
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewColorPicker from '@/components/common/PreviewColorPicker.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { floatingLines } from '@/constants/code/Backgrounds/floatingLinesCode';
import FloatingLines from '@/content/Backgrounds/FloatingLines/FloatingLines.vue';
import floatingLinesSource from '@/content/Backgrounds/FloatingLines/FloatingLines.vue?raw';
import { computed, ref } from 'vue';

const { forceRerender } = useForceRerender();

const DEFAULTS = {
  enableTop: true,
  enableMiddle: true,
  enableBottom: true,
  lineCount: 8,
  lineDistance: 8,
  animationSpeed: 1,
  interactive: true,
  bendRadius: 8,
  bendStrength: -2,
  gradientStart: '#A7EF9E',
  gradientMid: '#747d67',
  gradientEnd: '#6a6a6a'
};

const animationSpeed = ref(DEFAULTS.animationSpeed);
const interactive = ref(DEFAULTS.interactive);
const bendRadius = ref(DEFAULTS.bendRadius);
const bendStrength = ref(DEFAULTS.bendStrength);
const lineCount = ref(DEFAULTS.lineCount);
const lineDistance = ref(DEFAULTS.lineDistance);
const enableTop = ref(DEFAULTS.enableTop);
const enableMiddle = ref(DEFAULTS.enableMiddle);
const enableBottom = ref(DEFAULTS.enableBottom);
const gradientStart = ref(DEFAULTS.gradientStart);
const gradientMid = ref(DEFAULTS.gradientMid);
const gradientEnd = ref(DEFAULTS.gradientEnd);

const enabledWaves = computed(() =>
  [
    enableTop.value ? ('top' as const) : null,
    enableMiddle.value ? ('middle' as const) : null,
    enableBottom.value ? ('bottom' as const) : null
  ].filter((v): v is 'top' | 'middle' | 'bottom' => v !== null)
);

const hasChanges = computed(
  () =>
    animationSpeed.value !== DEFAULTS.animationSpeed ||
    interactive.value !== DEFAULTS.interactive ||
    bendRadius.value !== DEFAULTS.bendRadius ||
    bendStrength.value !== DEFAULTS.bendStrength ||
    lineCount.value !== DEFAULTS.lineCount ||
    lineDistance.value !== DEFAULTS.lineDistance ||
    enableTop.value !== DEFAULTS.enableTop ||
    enableMiddle.value !== DEFAULTS.enableMiddle ||
    enableBottom.value !== DEFAULTS.enableBottom ||
    gradientStart.value !== DEFAULTS.gradientStart ||
    gradientMid.value !== DEFAULTS.gradientMid ||
    gradientEnd.value !== DEFAULTS.gradientEnd
);

function reset() {
  animationSpeed.value = DEFAULTS.animationSpeed;
  interactive.value = DEFAULTS.interactive;
  bendRadius.value = DEFAULTS.bendRadius;
  bendStrength.value = DEFAULTS.bendStrength;
  lineCount.value = DEFAULTS.lineCount;
  lineDistance.value = DEFAULTS.lineDistance;
  enableTop.value = DEFAULTS.enableTop;
  enableMiddle.value = DEFAULTS.enableMiddle;
  enableBottom.value = DEFAULTS.enableBottom;
  gradientStart.value = DEFAULTS.gradientStart;
  gradientMid.value = DEFAULTS.gradientMid;
  gradientEnd.value = DEFAULTS.gradientEnd;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'linesGradient',
    type: 'string[]',
    default: 'undefined',
    description: 'Array of hex color strings for gradient coloring of lines (max 8 colors).'
  },
  {
    name: 'enabledWaves',
    type: "Array<'top' | 'middle' | 'bottom'>",
    default: "['top', 'middle', 'bottom']",
    description: 'Which wave layers to display. Can toggle individual waves on/off.'
  },
  {
    name: 'lineCount',
    type: 'number | number[]',
    default: '[6]',
    description: 'Number of lines per wave. Single number applies to all waves, or array for per-wave control.'
  },
  {
    name: 'lineDistance',
    type: 'number | number[]',
    default: '[5]',
    description: 'Spacing between lines. Single number applies to all waves, or array for per-wave control.'
  },
  {
    name: 'topWavePosition',
    type: '{ x: number; y: number; rotate: number }',
    default: 'undefined',
    description: 'Position and rotation settings for the top wave layer.'
  },
  {
    name: 'middleWavePosition',
    type: '{ x: number; y: number; rotate: number }',
    default: 'undefined',
    description: 'Position and rotation settings for the middle wave layer.'
  },
  {
    name: 'bottomWavePosition',
    type: '{ x: number; y: number; rotate: number }',
    default: '{ x: 2.0, y: -0.7, rotate: -1 }',
    description: 'Position and rotation settings for the bottom wave layer.'
  },
  {
    name: 'animationSpeed',
    type: 'number',
    default: '1',
    description: 'Speed multiplier for the wave animation.'
  },
  {
    name: 'interactive',
    type: 'boolean',
    default: 'true',
    description: 'Whether the lines react to mouse/pointer movement.'
  },
  {
    name: 'bendRadius',
    type: 'number',
    default: '10.0',
    description: 'Radius of the area affected by mouse interaction.'
  },
  {
    name: 'bendStrength',
    type: 'number',
    default: '-5.0',
    description: 'Intensity of the bend effect when interacting with mouse.'
  },
  {
    name: 'mouseDamping',
    type: 'number',
    default: '0.05',
    description: 'Smoothing factor for mouse movement tracking (0-1).'
  },
  {
    name: 'parallax',
    type: 'boolean',
    default: 'true',
    description: 'Enable parallax effect with mouse movement.'
  },
  {
    name: 'parallaxStrength',
    type: 'number',
    default: '0.2',
    description: 'Strength of the parallax effect.'
  },
  {
    name: 'mixBlendMode',
    type: "CSSProperties['mixBlendMode']",
    default: "'screen'",
    description: 'CSS mix-blend-mode applied to the canvas element.'
  }
];
</script>
