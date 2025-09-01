<template>
  <TabbedLayout>
    <template #preview>
      <div class="demo-container h-[400px]">
        <GlareHover
          background="#111"
          border-color="#222"
          border-radius="20px"
          width="400px"
          height="300px"
          :glare-color="glareColor"
          :glare-opacity="glareOpacity"
          :glare-size="glareSize"
          :transition-duration="transitionDuration"
          :play-once="playOnce"
        >
          <div class="text-center text-5xl font-black text-[#222] m-0">Hover Me</div>
        </GlareHover>
      </div>

      <Customize>
        <PreviewColor title="Glare Color" v-model="glareColor" />

        <PreviewSlider title="Glare Opacity" v-model="glareOpacity" :min="0" :max="1" :step="0.1" />

        <PreviewSlider title="Glare Size" v-model="glareSize" :min="100" :max="500" :step="25" value-unit="%" />

        <PreviewSlider
          title="Transition Duration"
          v-model="transitionDuration"
          :min="200"
          :max="2000"
          :step="50"
          value-unit="ms"
        />

        <PreviewSwitch title="Play Once" v-model="playOnce" />
      </Customize>

      <PropTable :data="propData" />
    </template>

    <template #code>
      <CodeExample :code-object="glareHover" />
    </template>

    <template #cli>
      <CliInstallation :command="glareHover.cli" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TabbedLayout from '../../components/common/TabbedLayout.vue';
import PropTable from '../../components/common/PropTable.vue';
import CliInstallation from '../../components/code/CliInstallation.vue';
import CodeExample from '../../components/code/CodeExample.vue';
import Customize from '../../components/common/Customize.vue';
import PreviewSlider from '../../components/common/PreviewSlider.vue';
import PreviewSwitch from '../../components/common/PreviewSwitch.vue';
import PreviewColor from '../../components/common/PreviewColor.vue';
import GlareHover from '../../content/Animations/GlareHover/GlareHover.vue';
import { glareHover } from '@/constants/code/Animations/glareHoverCode';

const glareColor = ref('#ffffff');
const glareOpacity = ref(0.3);
const glareSize = ref(300);
const transitionDuration = ref(800);
const playOnce = ref(false);

const propData = [
  {
    name: 'width',
    type: 'string',
    default: '500px',
    description: 'The width of the hover element.'
  },
  {
    name: 'height',
    type: 'string',
    default: '500px',
    description: 'The height of the hover element.'
  },
  {
    name: 'background',
    type: 'string',
    default: '#000',
    description: 'The background color of the element.'
  },
  {
    name: 'borderRadius',
    type: 'string',
    default: '10px',
    description: 'The border radius of the element.'
  },
  {
    name: 'borderColor',
    type: 'string',
    default: '#333',
    description: 'The border color of the element.'
  },
  {
    name: 'glareColor',
    type: 'string',
    default: '#ffffff',
    description: 'The color of the glare effect (hex format).'
  },
  {
    name: 'glareOpacity',
    type: 'number',
    default: '0.5',
    description: 'The opacity of the glare effect (0-1).'
  },
  {
    name: 'glareAngle',
    type: 'number',
    default: '-45',
    description: 'The angle of the glare effect in degrees.'
  },
  {
    name: 'glareSize',
    type: 'number',
    default: '250',
    description: 'The size of the glare effect as a percentage (e.g. 250 = 250%).'
  },
  {
    name: 'transitionDuration',
    type: 'number',
    default: '650',
    description: 'The duration of the transition in milliseconds.'
  },
  {
    name: 'playOnce',
    type: 'boolean',
    default: 'false',
    description: "If true, the glare only animates on hover and doesn't return on mouse leave."
  },
  {
    name: 'className',
    type: 'string',
    default: '""',
    description: 'Additional CSS class names.'
  },
  {
    name: 'style',
    type: 'object',
    default: '{}',
    description: 'Additional inline styles.'
  }
];
</script>
