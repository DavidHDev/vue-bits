<template>
  <TabbedLayout>
    <template #preview>
      <div class="p-0 h-[600px] overflow-hidden demo-container">
        <RefreshButton @click="forceRerender" />

        <!-- Card example -->
        <template v-if="example === 'card'">
          <div class="mr-demo-card">
            <div class="mr-demo-card-visual">
              <MagicRings
                :key="key"
                :color="color"
                :color-two="colorTwo"
                :ring-count="ringCount"
                :speed="speed"
                :attenuation="attenuation"
                :line-thickness="lineThickness"
                :base-radius="baseRadius"
                :radius-step="radiusStep"
                :scale-rate="scaleRate"
                :opacity="opacity"
                :blur="blur"
                :noise-amount="noiseAmount"
                :rotation="rotation"
                :ring-gap="ringGap"
                :fade-in="fadeIn"
                :fade-out="fadeOut"
                :follow-mouse="followMouse"
                :mouse-influence="mouseInfluence"
                :hover-scale="hoverScale"
                :parallax="parallax"
                :click-burst="clickBurst"
              />

              <svg
                class="mr-demo-card-icon"
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#aeffc5"
                stroke-width="1"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <!-- Sparkles icon -->
                <path
                  d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"
                />
                <path d="M20 3v4" />
                <path d="M22 5h-4" />
                <path d="M4 17v2" />
                <path d="M5 18H3" />
              </svg>
            </div>
            <div class="mr-demo-card-body">
              <h3 class="mr-demo-card-title">Magic Rings</h3>
              <p class="mr-demo-card-subtitle">Interactive WebGL effect</p>
              <div class="mr-demo-card-meta">
                <span>
                  <i class="pi pi-github" style="font-size: 12px"></i>
                  Free & open source
                </span>
                <span>
                  <i class="pi pi-google" style="font-size: 12px"></i>
                  Google
                </span>
              </div>
              <div class="mr-demo-card-actions">
                <button class="mr-demo-card-cta">Copy to clipboard</button>
                <div class="mr-demo-card-heart">
                  <i class="pi pi-heart" style="font-size: 16px"></i>
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- Basic example -->
        <template v-else>
          <MagicRings
            :key="key"
            :color="color"
            :color-two="colorTwo"
            :ring-count="ringCount"
            :speed="speed"
            :attenuation="attenuation"
            :line-thickness="lineThickness"
            :base-radius="baseRadius"
            :radius-step="radiusStep"
            :scale-rate="scaleRate"
            :opacity="opacity"
            :blur="blur"
            :noise-amount="noiseAmount"
            :rotation="rotation"
            :ring-gap="ringGap"
            :fade-in="fadeIn"
            :fade-out="fadeOut"
            :follow-mouse="followMouse"
            :mouse-influence="mouseInfluence"
            :hover-scale="hoverScale"
            :parallax="parallax"
            :click-burst="clickBurst"
          />
        </template>
      </div>

      <Customize>
        <PreviewSelect title="Example" v-model="example" :options="exampleOptions" />

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-3">
          <PreviewColor title="Color" v-model="color" />
          <PreviewColor title="Color Two" v-model="colorTwo" />

          <PreviewSlider title="Ring Count" :min="1" :max="10" :step="1" v-model="ringCount" />
          <PreviewSlider title="Speed" :min="0" :max="3" :step="0.1" v-model="speed" />
          <PreviewSlider title="Attenuation" :min="1" :max="30" :step="0.5" v-model="attenuation" />
          <PreviewSlider title="Line Thickness" :min="1" :max="10" :step="0.5" v-model="lineThickness" />
          <PreviewSlider title="Base Radius" :min="0.1" :max="0.5" :step="0.01" v-model="baseRadius" />
          <PreviewSlider title="Radius Step" :min="0.05" :max="0.3" :step="0.01" v-model="radiusStep" />
          <PreviewSlider title="Scale Rate" :min="0" :max="0.2" :step="0.01" v-model="scaleRate" />
          <PreviewSlider title="Opacity" :min="0" :max="1" :step="0.05" v-model="opacity" />
          <PreviewSlider title="Blur" :min="0" :max="10" :step="0.5" v-model="blur" />
          <PreviewSlider title="Noise Amount" :min="0" :max="0.5" :step="0.01" v-model="noiseAmount" />
          <PreviewSlider title="Rotation" :min="0" :max="360" :step="1" v-model="rotation" />
          <PreviewSlider title="Ring Gap" :min="1" :max="3" :step="0.1" v-model="ringGap" />
          <PreviewSlider title="Fade In" :min="0.1" :max="1.5" :step="0.05" v-model="fadeIn" />
          <PreviewSlider title="Fade Out" :min="0.5" :max="3" :step="0.05" v-model="fadeOut" />
          <PreviewSlider title="Mouse Influence" :min="0" :max="1" :step="0.05" v-model="mouseInfluence" />
          <PreviewSlider title="Hover Scale" :min="1" :max="2" :step="0.05" v-model="hoverScale" />
          <PreviewSlider title="Parallax" :min="0" :max="0.1" :step="0.005" v-model="parallax" />

          <PreviewSwitch title="Follow Mouse" v-model="followMouse" />
          <PreviewSwitch title="Click Burst" v-model="clickBurst" />
        </div>
      </Customize>

      <PropTable :data="propData" />
    </template>

    <template #code>
      <CodeExample :code-object="magicRings" />
    </template>

    <template #cli>
      <CliInstallation :command="magicRings.cli" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import CliInstallation from '@/components/code/CliInstallation.vue';
import CodeExample from '@/components/code/CodeExample.vue';
import Customize from '@/components/common/Customize.vue';
import PreviewColor from '@/components/common/PreviewColor.vue';
import PreviewSelect from '@/components/common/PreviewSelect.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable from '@/components/common/PropTable.vue';
import RefreshButton from '@/components/common/RefreshButton.vue';
import TabbedLayout from '@/components/common/TabbedLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { magicRings } from '@/constants/code/Animations/magicRingsCode';
import MagicRings from '@/content/Animations/MagicRings/MagicRings.vue';
import { ref } from 'vue';

const { rerenderKey: key, forceRerender } = useForceRerender();

const example = ref<'basic' | 'card'>('basic');
const color = ref('#7cff67');
const colorTwo = ref('#42fcff');
const ringCount = ref(6);
const speed = ref(1);
const attenuation = ref(10);
const lineThickness = ref(2);
const baseRadius = ref(0.35);
const radiusStep = ref(0.1);
const scaleRate = ref(0.1);
const opacity = ref(1);
const blur = ref(0);
const noiseAmount = ref(0.1);
const rotation = ref(0);
const ringGap = ref(1.5);
const fadeIn = ref(0.7);
const fadeOut = ref(0.5);
const followMouse = ref(false);
const mouseInfluence = ref(0.2);
const hoverScale = ref(1.2);
const parallax = ref(0.05);
const clickBurst = ref(false);

const exampleOptions = [
  { label: 'Basic', value: 'basic' },
  { label: 'Card', value: 'card' }
];

const propData = [
  { name: 'color', type: 'string', default: '"#7cff67"', description: 'Hex color for the rings.' },
  {
    name: 'colorTwo',
    type: 'string',
    default: '"#42fcff"',
    description: 'Second color — rings interpolate from color to colorTwo.'
  },
  { name: 'ringCount', type: 'number', default: '6', description: 'Number of concentric rings to draw (1-10).' },
  { name: 'speed', type: 'number', default: '1', description: 'Animation speed multiplier.' },
  {
    name: 'attenuation',
    type: 'number',
    default: '10',
    description: 'Glow falloff — higher values produce tighter glow.'
  },
  { name: 'lineThickness', type: 'number', default: '2', description: 'Thickness of each ring line.' },
  { name: 'baseRadius', type: 'number', default: '0.35', description: 'Radius of the innermost ring (normalized).' },
  { name: 'radiusStep', type: 'number', default: '0.1', description: 'Spacing between successive rings.' },
  { name: 'scaleRate', type: 'number', default: '0.1', description: 'How much rings expand over time.' },
  { name: 'opacity', type: 'number', default: '1', description: 'Overall opacity of the effect (0-1).' },
  { name: 'blur', type: 'number', default: '0', description: 'CSS blur in px — creates a bloom/glow effect.' },
  { name: 'noiseAmount', type: 'number', default: '0.1', description: 'Film-grain noise intensity.' },
  { name: 'rotation', type: 'number', default: '0', description: 'Static rotation of the pattern in degrees.' },
  { name: 'ringGap', type: 'number', default: '1.5', description: 'Exponential base for angular cutaway per ring.' },
  { name: 'fadeIn', type: 'number', default: '0.7', description: 'Duration of ring fade-in within cycle.' },
  { name: 'fadeOut', type: 'number', default: '0.5', description: 'Start time of ring fade-out within cycle.' },
  { name: 'followMouse', type: 'boolean', default: 'false', description: 'Rings shift toward the mouse cursor.' },
  {
    name: 'mouseInfluence',
    type: 'number',
    default: '0.2',
    description: 'Strength of mouse follow (when followMouse is true).'
  },
  { name: 'hoverScale', type: 'number', default: '1.2', description: 'Scale multiplier on hover.' },
  { name: 'parallax', type: 'number', default: '0.05', description: 'Per-ring depth offset based on mouse position.' },
  {
    name: 'clickBurst',
    type: 'boolean',
    default: 'false',
    description: 'Click triggers a brightness flash and scale pulse.'
  }
];
</script>
