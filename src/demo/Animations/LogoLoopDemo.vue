<template>
  <TabbedLayout>
    <template #preview>
      <div class="relative h-[500px] overflow-hidden demo-container">
        <LogoLoop
          :key="key"
          :logos="items"
          width="100%"
          :gap="gap"
          :speed="speed"
          :direction="direction"
          :scale-on-hover="scaleOnHover"
          :pause-on-hover="pauseOnHover"
          :fade-out="fadeOut"
          fade-out-color="#0b0b0b"
          aria-label="Our icons"
        />
      </div>

      <Customize>
        <PreviewSelect title="Direction" v-model="direction" :options="directionOptions" />
        <PreviewSlider title="Speed" :min="0" :max="300" :step="10" value-unit="px/s" v-model="speed" />
        <PreviewSlider title="Gap" :min="10" :max="120" :step="5" value-unit="px" v-model="gap" />
        <PreviewSwitch title="Pause on Hover" v-model="pauseOnHover" />
        <PreviewSwitch title="Fade Out" v-model="fadeOut" />
        <PreviewSwitch title="Scale on Hover" v-model="scaleOnHover" />
      </Customize>

      <PropTable :data="propData" />
    </template>

    <template #code>
      <CodeExample :code-object="logoLoop" />
    </template>

    <template #cli>
      <CliInstallation :command="logoLoop.cli" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import { useForceRerender } from '@/composables/useForceRerender';
import { logoLoop } from '@/constants/code/Animations/logoLoopCode';
import { ref } from 'vue';
import CliInstallation from '../../components/code/CliInstallation.vue';
import CodeExample from '../../components/code/CodeExample.vue';
import Customize from '../../components/common/Customize.vue';
import PreviewSelect from '../../components/common/PreviewSelect.vue';
import PreviewSlider from '../../components/common/PreviewSlider.vue';
import PreviewSwitch from '../../components/common/PreviewSwitch.vue';
import PropTable from '../../components/common/PropTable.vue';
import TabbedLayout from '../../components/common/TabbedLayout.vue';
import LogoLoop from '../../content/Animations/LogoLoop/LogoLoop.vue';

const { rerenderKey: key } = useForceRerender();

const speed = ref(100);
const gap = ref(60);
const pauseOnHover = ref(true);
const fadeOut = ref(true);
const scaleOnHover = ref(true);
const direction = ref<'left' | 'right'>('left');

const directionOptions = [
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' }
];

const items = [
  { node: `<i class="pi pi-reddit" style="font-size: 4rem;"></i>`, title: 'Settings', href: 'https://vue-bits.dev/' },
  { node: `<i class="pi pi-paypal" style="font-size: 4rem;"></i>`, title: 'Web', href: 'https://vue-bits.dev/' },
  { node: `<i class="pi pi-linkedin" style="font-size: 4rem;"></i>`, title: 'Code', href: 'https://vue-bits.dev/' },
  { node: `<i class="pi pi-facebook" style="font-size: 4rem;"></i>`, title: 'Design', href: 'https://vue-bits.dev/' },
  { node: `<i class="pi pi-tiktok" style="font-size: 4rem;"></i>`, title: 'Cloud', href: 'https://vue-bits.dev/' },
  { node: `<i class="pi pi-github" style="font-size: 4rem;"></i>`, title: 'GitHub', href: 'https://vue-bits.dev/' },
  { node: `<i class="pi pi-google" style="font-size: 4rem;"></i>`, title: 'Container', href: 'https://vue-bits.dev/' },
  { node: `<i class="pi pi-youtube" style="font-size: 4rem;"></i>`, title: 'Database', href: 'https://vue-bits.dev/' },
  { node: `<i class="pi pi-twitch" style="font-size: 4rem;"></i>`, title: 'Server', href: 'https://vue-bits.dev/' }
];

const propData = [
  {
    name: 'logos',
    type: 'LogoItem[]',
    default: 'required',
    description: 'Array of logo items to display. Each item can be either a React node or an image src.'
  },
  {
    name: 'speed',
    type: 'number',
    default: '120',
    description:
      'Animation speed in pixels per second. Positive values move based on direction, negative values reverse direction.'
  },
  {
    name: 'direction',
    type: "'left' | 'right'",
    default: "'left'",
    description: 'Direction of the logo animation loop.'
  },
  {
    name: 'width',
    type: 'number | string',
    default: "'100%'",
    description: 'Width of the logo loop container.'
  },
  {
    name: 'logoHeight',
    type: 'number',
    default: '28',
    description: 'Height of the logos in pixels.'
  },
  {
    name: 'gap',
    type: 'number',
    default: '32',
    description: 'Gap between logos in pixels.'
  },
  {
    name: 'pauseOnHover',
    type: 'boolean',
    default: 'true',
    description: 'Whether to pause the animation when hovering over the component.'
  },
  {
    name: 'fadeOut',
    type: 'boolean',
    default: 'false',
    description: 'Whether to apply fade-out effect at the edges of the container.'
  },
  {
    name: 'fadeOutColor',
    type: 'string',
    default: 'undefined',
    description: 'Color used for the fade-out effect. Only applies when fadeOut is true.'
  },
  {
    name: 'scaleOnHover',
    type: 'boolean',
    default: 'false',
    description: 'Whether to scale logos on hover.'
  },
  {
    name: 'ariaLabel',
    type: 'string',
    default: "'Partner logos'",
    description: 'Accessibility label for the logo loop component.'
  },
  {
    name: 'className',
    type: 'string',
    default: 'undefined',
    description: 'Additional CSS class names to apply to the root element.'
  },
  {
    name: 'style',
    type: 'object',
    default: '{}',
    description: 'Inline styles to apply to the root element.'
  }
];
</script>

<style scoped>
.demo-container {
  padding: 0;
}
</style>
