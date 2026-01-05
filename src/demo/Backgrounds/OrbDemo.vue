<template>
  <TabbedLayout>
    <template #preview>
      <div class="relative p-0 h-[600px] overflow-hidden demo-container">
        <Orb
          :hue="debouncedHue"
          :hoverIntensity="debouncedHoverIntensity"
          :rotateOnHover="rotateOnHover"
          :forceHoverState="forceHoverState"
        />
        <BackgroundContent pill-text="New Background" headline="This orb is hiding something, try hovering!" />
      </div>

      <Customize>
        <PreviewSlider title="Hue Shift" :min="0" :max="360" :step="1" v-model="hue" />

        <PreviewSlider title="Hover Intensity" :min="0" :max="5" :step="0.01" v-model="hoverIntensity" />

        <PreviewSwitch title="Rotate on Hover" v-model="rotateOnHover" />

        <PreviewSwitch title="Force Hover State" v-model="forceHoverState" />
      </Customize>

      <PropTable :data="propData" />
      <Dependencies :dependency-list="['ogl']" />
    </template>

    <template #code>
      <CodeExample :code-object="orb" />
    </template>

    <template #cli>
      <CliInstallation :command="orb.cli" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import CliInstallation from '../../components/code/CliInstallation.vue';
import CodeExample from '../../components/code/CodeExample.vue';
import Dependencies from '../../components/code/Dependencies.vue';
import BackgroundContent from '../../components/common/BackgroundContent.vue';
import Customize from '../../components/common/Customize.vue';
import PreviewSlider from '../../components/common/PreviewSlider.vue';
import PreviewSwitch from '../../components/common/PreviewSwitch.vue';
import PropTable from '../../components/common/PropTable.vue';
import TabbedLayout from '../../components/common/TabbedLayout.vue';
import { orb } from '../../constants/code/Backgrounds/orbCode';
import Orb from '../../content/Backgrounds/Orb/Orb.vue';

const hue = ref(100);
const hoverIntensity = ref(2);
const rotateOnHover = ref(true);
const forceHoverState = ref(false);

const debouncedHue = ref(100);
const debouncedHoverIntensity = ref(0.5);

let hueTimeout: ReturnType<typeof setTimeout>;
let hoverIntensityTimeout: ReturnType<typeof setTimeout>;

watch(hue, newValue => {
  clearTimeout(hueTimeout);
  hueTimeout = setTimeout(() => {
    debouncedHue.value = newValue;
  }, 300);
});
watch(hoverIntensity, newValue => {
  clearTimeout(hoverIntensityTimeout);
  hoverIntensityTimeout = setTimeout(() => {
    debouncedHoverIntensity.value = newValue;
  }, 300);
});

const propData = [
  {
    name: 'hue',
    type: 'number',
    default: '100',
    description: 'The base hue for the orb (in degrees).'
  },
  {
    name: 'hoverIntensity',
    type: 'number',
    default: '0.2',
    description: 'Controls the intensity of the hover distortion effect.'
  },
  {
    name: 'rotateOnHover',
    type: 'boolean',
    default: 'true',
    description: 'Toggle to enable or disable continuous rotation on hover.'
  },
  {
    name: 'forceHoverState',
    type: 'boolean',
    default: 'false',
    description: 'Force hover animations even when the orb is not actually hovered.'
  }
];
</script>
