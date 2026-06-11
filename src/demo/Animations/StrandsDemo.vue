<template>
  <TabbedLayout>
    <template #preview>
      <div class="h-[500px] overflow-hidden demo-container relative p-0">
        <Strands
          :colors="colors"
          :count="count"
          :speed="speed"
          :amplitude="amplitude"
          :waviness="waviness"
          :thickness="thickness"
          :glow="glow"
          :taper="taper"
          :spread="spread"
          :hue-shift="hueShift"
          :intensity="intensity"
          :saturation="saturation"
          :opacity="opacity"
          :scale="scale"
          :glass="glass"
          :refraction="refraction"
          :dispersion="dispersion"
          :glass-size="glassSize"
          class="w-full h-full"
        />
      </div>

      <Customize>
        <div class="flex gap-2">
          <PreviewColor
            v-for="(_, index) in colors"
            :key="index"
            :title="`Color ${index + 1}`"
            v-model="colors[index]"
          />
        </div>

        <PreviewSlider title="Count" v-model="count" :min="1" :max="10" :step="1" />

        <PreviewSlider title="Speed" v-model="speed" :min="0" :max="3" :step="0.1" />

        <PreviewSlider title="Amplitude" v-model="amplitude" :min="0" :max="3" :step="0.1" />

        <PreviewSlider title="Waviness" v-model="waviness" :min="0.2" :max="3" :step="0.1" />

        <PreviewSlider title="Thickness" v-model="thickness" :min="0.2" :max="4" :step="0.1" />

        <PreviewSlider title="Glow" v-model="glow" :min="0.3" :max="3" :step="0.05" />

        <PreviewSlider title="Taper" v-model="taper" :min="0.5" :max="6" :step="0.1" />

        <PreviewSlider title="Spread" v-model="spread" :min="0" :max="3" :step="0.1" />

        <PreviewSlider title="Hue Shift" v-model="hueShift" :min="0" :max="1" :step="0.01" />

        <PreviewSlider title="Intensity" v-model="intensity" :min="0" :max="1" :step="0.05" />

        <PreviewSlider title="Saturation" v-model="saturation" :min="0" :max="2" :step="0.05" />

        <PreviewSlider title="Opacity" v-model="opacity" :min="0" :max="1" :step="0.05" />

        <PreviewSlider title="Scale" v-model="scale" :min="0.3" :max="3" :step="0.1" />

        <PreviewSwitch title="Glass Ball" v-model="glass" />

        <PreviewSlider title="Refraction" v-model="refraction" :min="0" :max="3" :step="0.05" :disabled="!glass" />

        <PreviewSlider title="Dispersion" v-model="dispersion" :min="0" :max="4" :step="0.05" :disabled="!glass" />

        <PreviewSlider title="Glass Size" v-model="glassSize" :min="0.3" :max="1" :step="0.01" :disabled="!glass" />
      </Customize>

      <PropTable :data="propData" />
      <Dependencies :dependency-list="['ogl']" />
    </template>

    <template #code>
      <CodeExample :code-object="strands" />
    </template>

    <template #cli>
      <CliInstallation :command="strands.cli" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TabbedLayout from '@/components/common/TabbedLayout.vue';
import PropTable from '@/components/common/PropTable.vue';
import Dependencies from '@/components/code/Dependencies.vue';
import CliInstallation from '@/components/code/CliInstallation.vue';
import CodeExample from '@/components/code/CodeExample.vue';
import Customize from '@/components/common/Customize.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewColor from '@/components/common/PreviewColor.vue';
import Strands from '@/content/Animations/Strands/Strands.vue';
import { strands } from '@/constants/code/Animations/strandsCode';

const colors = ref(['#F97316', '#7C3AED', '#06B6D4']);
const count = ref(3);
const speed = ref(0.5);
const amplitude = ref(1);
const waviness = ref(1);
const thickness = ref(0.7);
const glow = ref(2.6);
const taper = ref(3);
const spread = ref(1);
const hueShift = ref(0);
const intensity = ref(0.6);
const saturation = ref(2);
const opacity = ref(1);
const scale = ref(1.5);
const glass = ref(false);
const refraction = ref(1);
const dispersion = ref(1);
const glassSize = ref(1);

const propData = [
  {
    name: 'colors',
    type: 'string[]',
    default: '["#FF4242", "#7C3AED", "#06B6D4", "#EAB308"]',
    description:
      'Palette of hex colors cycled across the strands. Pass an empty array to use the built-in rainbow spectrum.'
  },
  {
    name: 'count',
    type: 'number',
    default: '3',
    description: 'Number of strands woven through the animation.'
  },
  {
    name: 'speed',
    type: 'number',
    default: '0.5',
    description: 'How quickly the strands ripple and flow.'
  },
  {
    name: 'amplitude',
    type: 'number',
    default: '1',
    description: 'Vertical reach of each strand as it waves up and down.'
  },
  {
    name: 'waviness',
    type: 'number',
    default: '1',
    description: 'Density of the curves along each strand.'
  },
  {
    name: 'thickness',
    type: 'number',
    default: '0.7',
    description: 'Width of each glowing strand.'
  },
  {
    name: 'glow',
    type: 'number',
    default: '2.6',
    description: 'Strength of the luminous bloom around the strands.'
  },
  {
    name: 'taper',
    type: 'number',
    default: '3',
    description: 'How sharply the strands fade out toward the edges.'
  },
  {
    name: 'spread',
    type: 'number',
    default: '1',
    description: 'Separation between strands so they fan out instead of overlapping.'
  },
  {
    name: 'hueShift',
    type: 'number',
    default: '0',
    description: 'Rotates the colors around the strands for variation.'
  },
  {
    name: 'intensity',
    type: 'number',
    default: '0.6',
    description: 'Overall brightness and energy of the effect.'
  },
  {
    name: 'saturation',
    type: 'number',
    default: '1.5',
    description: 'Vibrance of the colors. Above 1 makes them more intense, below 1 fades to grayscale.'
  },
  {
    name: 'opacity',
    type: 'number',
    default: '1',
    description: 'Overall transparency of the rendered strands.'
  },
  {
    name: 'scale',
    type: 'number',
    default: '1.5',
    description: 'Zooms the whole effect in or out to make the strands bigger or smaller.'
  },
  {
    name: 'glass',
    type: 'boolean',
    default: 'false',
    description: 'Renders the strands inside a refractive glass ball.'
  },
  {
    name: 'refraction',
    type: 'number',
    default: '1',
    description: 'How strongly the glass ball bends the light passing through it.'
  },
  {
    name: 'dispersion',
    type: 'number',
    default: '1',
    description: 'Amount of rainbow color separation along the edges of the glass ball.'
  },
  {
    name: 'glassSize',
    type: 'number',
    default: '1',
    description: 'Size of the glass ball relative to the canvas.'
  },
  {
    name: 'className',
    type: 'string',
    default: '""',
    description: 'Additional CSS classes to apply to the container.'
  }
];
</script>
