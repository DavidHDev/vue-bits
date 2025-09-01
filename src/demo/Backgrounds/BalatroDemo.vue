<template>
  <TabbedLayout>
    <template #preview>
      <div class="h-[600px] overflow-hidden demo-container">
        <Balatro
          :is-rotate="rotate"
          :mouse-interaction="mouseInteractionEnabled"
          :pixel-filter="pixelation"
          :color1="colorStops[0]"
          :color2="colorStops[1]"
          :color3="colorStops[2]"
          class="w-full h-full"
        />
      </div>

      <Customize>
        <div class="flex gap-2">
          <PreviewColor
            v-for="(_, index) in colorStops"
            :key="index"
            :title="`Color ${index + 1}`"
            v-model="colorStops[index]"
          />
        </div>

        <PreviewSlider title="Pixelation" v-model="pixelation" :min="100" :max="2000" :step="10" />

        <PreviewSwitch title="Enable Mouse Interaction" v-model="mouseInteractionEnabled" />

        <PreviewSwitch title="Rotate" v-model="rotate" />
      </Customize>

      <PropTable :data="propData" />
      <Dependencies :dependency-list="['ogl']" />
    </template>

    <template #code>
      <CodeExample :code-object="balatro" />
    </template>

    <template #cli>
      <CliInstallation :command="balatro.cli" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TabbedLayout from '../../components/common/TabbedLayout.vue';
import PropTable from '../../components/common/PropTable.vue';
import Dependencies from '../../components/code/Dependencies.vue';
import CliInstallation from '../../components/code/CliInstallation.vue';
import CodeExample from '../../components/code/CodeExample.vue';
import Customize from '../../components/common/Customize.vue';
import PreviewSwitch from '../../components/common/PreviewSwitch.vue';
import PreviewSlider from '../../components/common/PreviewSlider.vue';
import PreviewColor from '@/components/common/PreviewColor.vue';
import Balatro from '../../content/Backgrounds/Balatro/Balatro.vue';
import { balatro } from '@/constants/code/Backgrounds/balatroCode';

const colorStops = ref(['#DE443B', '#006BB4', '#162325']);
const pixelation = ref(745);
const mouseInteractionEnabled = ref(true);
const rotate = ref(false);

const propData = [
  {
    name: 'spinRotation',
    type: 'number',
    default: '-2.0',
    description: 'Base rotation amount affecting the shader effect.'
  },
  {
    name: 'spinSpeed',
    type: 'number',
    default: '7.0',
    description: 'Speed of the spin animation.'
  },
  {
    name: 'offset',
    type: '[number, number]',
    default: '[0.0, 0.0]',
    description: 'Offset for the shader effect.'
  },
  {
    name: 'color1',
    type: 'string',
    default: '"#DE443B"',
    description: 'Primary color in HEX format.'
  },
  {
    name: 'color2',
    type: 'string',
    default: '"#006BB4"',
    description: 'Secondary color in HEX format.'
  },
  {
    name: 'color3',
    type: 'string',
    default: '"#162325"',
    description: 'Tertiary color in HEX format.'
  },
  {
    name: 'contrast',
    type: 'number',
    default: '3.5',
    description: 'Contrast value affecting color blending.'
  },
  {
    name: 'lighting',
    type: 'number',
    default: '0.4',
    description: 'Lighting factor affecting brightness.'
  },
  {
    name: 'spinAmount',
    type: 'number',
    default: '0.25',
    description: 'Amount of spin influence based on UV length.'
  },
  {
    name: 'pixelFilter',
    type: 'number',
    default: '745.0',
    description: 'Pixel filter factor determining pixelation.'
  },
  {
    name: 'spinEase',
    type: 'number',
    default: '1.0',
    description: 'Ease factor for spin.'
  },
  {
    name: 'isRotate',
    type: 'boolean',
    default: 'false',
    description: 'Determines if the shader rotates continuously.'
  },
  {
    name: 'mouseInteraction',
    type: 'boolean',
    default: 'true',
    description: 'Enables or disables mouse interaction for rotation.'
  }
];
</script>
