<template>
  <TabbedLayout>
    <template #preview>
      <div class="py-[100px] overflow-hidden demo-container">
        <MagicBento
          :enable-stars="enableStars"
          :enable-spotlight="enableSpotlight"
          :disable-animations="disableAnimations"
          :spotlight-radius="spotlightRadius"
          :enable-tilt="enableTilt"
          :click-effect="clickEffect"
          :enable-magnetism="enableMagnetism"
        />
      </div>

      <Customize>
        <PreviewSlider title="Spotlight Radius" v-model="spotlightRadius" :min="50" :max="800" :step="10" />

        <PreviewSwitch title="Stars Effect" v-model="enableStars" />

        <PreviewSwitch title="Spotlight Effect" v-model="enableSpotlight" />

        <PreviewSwitch title="Tilt Effect" v-model="enableTilt" />

        <PreviewSwitch title="Click Effect" v-model="clickEffect" />

        <PreviewSwitch title="Magnetism" v-model="enableMagnetism" />

        <PreviewSwitch title="Disable All Animations" v-model="disableAnimations" />
      </Customize>

      <PropTable :data="propData" />
      <Dependencies :dependency-list="['gsap']" />
    </template>

    <template #code>
      <CodeExample :code-object="magicBento" />
    </template>

    <template #cli>
      <CliInstallation :command="magicBento.cli" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import CliInstallation from '../../components/code/CliInstallation.vue';
import CodeExample from '../../components/code/CodeExample.vue';
import Dependencies from '../../components/code/Dependencies.vue';
import Customize from '../../components/common/Customize.vue';
import PreviewSlider from '../../components/common/PreviewSlider.vue';
import PreviewSwitch from '../../components/common/PreviewSwitch.vue';
import PropTable from '../../components/common/PropTable.vue';
import TabbedLayout from '../../components/common/TabbedLayout.vue';
import { magicBento } from '../../constants/code/Components/magicBentoCode';
import MagicBento from '../../content/Components/MagicBento/MagicBento.vue';

const enableStars = ref(true);
const enableSpotlight = ref(true);
const disableAnimations = ref(false);
const spotlightRadius = ref(400);
const enableTilt = ref(false);
const clickEffect = ref(true);
const enableMagnetism = ref(false);

const propData = [
  {
    name: 'textAutoHide',
    type: 'boolean',
    default: 'true',
    description: 'Whether text content should auto-hide on hover'
  },
  {
    name: 'enableStars',
    type: 'boolean',
    default: 'true',
    description: 'Enable particle star animation effect'
  },
  {
    name: 'enableSpotlight',
    type: 'boolean',
    default: 'true',
    description: 'Enable spotlight cursor following effect'
  },
  {
    name: 'enableBorderGlow',
    type: 'boolean',
    default: 'true',
    description: 'Enable border glow effect that follows cursor'
  },
  {
    name: 'disableAnimations',
    type: 'boolean',
    default: 'false',
    description: 'Disable all animations (automatically enabled on mobile)'
  },
  {
    name: 'spotlightRadius',
    type: 'number',
    default: '300',
    description: 'Radius of the spotlight effect in pixels'
  },
  {
    name: 'particleCount',
    type: 'number',
    default: '12',
    description: 'Number of particles in the star animation'
  },
  {
    name: 'enableTilt',
    type: 'boolean',
    default: 'false',
    description: 'Enable 3D tilt effect on card hover'
  },
  {
    name: 'glowColor',
    type: 'string',
    default: '"77, 254, 6"',
    description: 'RGB color values for glow effects (without rgba wrapper)'
  },
  {
    name: 'clickEffect',
    type: 'boolean',
    default: 'true',
    description: 'Enable ripple effect on card click'
  },
  {
    name: 'enableMagnetism',
    type: 'boolean',
    default: 'true',
    description: 'Enable subtle card attraction to cursor'
  }
];
</script>
