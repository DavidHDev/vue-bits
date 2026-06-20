<template>
  <h1 class="sub-category">Logo Loop</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="logoLoop.usage"
    :source="logoLoopSource"
    component-name="LogoLoop"
    :props-table="props"
  >
    <template #preview>
      <div class="h-[400px] overflow-hidden demo-container">
        <LogoLoop
          :key="key"
          :logos="items"
          width="100%"
          :speed="speed"
          :logo-height="logoHeight"
          :gap="gap"
          :hover-speed="hoverSpeed"
          :fade-out="fadeOut"
          fade-out-color="#0b0b0b"
          :scale-on-hover="scaleOnHover"
          :direction="direction"
          aria-label="Our tech stack"
        >
          <!-- Only provide this slot when useCustomRender is true -->
          <template v-if="useCustomRender" #renderItem="{ item }">
            <div
              style="padding: 8px; border: 2px solid #a0ffbc; border-radius: 8px; background: rgba(139, 92, 246, 0.1)"
            >
              <span v-if="'node' in item" v-html="item.node" />
              <img v-else :src="item.src" :alt="item.alt" :style="{ height: `${logoHeight}px` }" />
            </div>
          </template>
        </LogoLoop>
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSelect title="Direction" v-model="direction" :options="['left', 'right', 'up', 'down']" />
        <PreviewSlider title="Speed" :min="10" :max="400" :step="10" :value="speed" :value-unit="'px/s'" />
        <PreviewSlider title="Logo Height" :min="20" :max="140" :step="2" :value="logoHeight" :value-unit="'px'" />
        <PreviewSlider title="Gap" :min="0" :max="160" :step="4" :value="gap" :value-unit="'px'" />
        <PreviewSlider title="Hover Speed" :min="0" :max="400" :step="10" :value="hoverSpeed" :value-unit="'px/s'" />
        <PreviewSwitch title="Fade Out Edges" v-model="fadeOut" />
        <PreviewSwitch title="Scale On Hover" v-model="scaleOnHover" />
        <PreviewSwitch title="Use Custom Render" v-model="useCustomRender" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="logo-loop" :usage="logoLoop.usage!" :source="logoLoopSource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewSelect from '@/components/common/PreviewSelect.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { logoLoop } from '@/constants/code/Animations/logoLoopCode';
import LogoLoop from '@/content/Animations/LogoLoop/LogoLoop.vue';
import logoLoopSource from '@/content/Animations/LogoLoop/LogoLoop.vue?raw';
import { computed, ref } from 'vue';

const { rerenderKey: key, forceRerender } = useForceRerender();

const DEFAULTS = {
  speed: 100,
  logoHeight: 60,
  gap: 60,
  hoverSpeed: 0,
  fadeOut: true,
  scaleOnHover: true,
  direction: 'left' as 'left' | 'right' | 'up' | 'down',
  useCustomRender: false
};

const speed = ref(DEFAULTS.speed);
const logoHeight = ref(DEFAULTS.logoHeight);
const gap = ref(DEFAULTS.gap);
const hoverSpeed = ref(DEFAULTS.hoverSpeed);
const fadeOut = ref(DEFAULTS.fadeOut);
const scaleOnHover = ref(DEFAULTS.scaleOnHover);
const direction = ref<'left' | 'right' | 'up' | 'down'>(DEFAULTS.direction);
const useCustomRender = ref(DEFAULTS.useCustomRender);

const items = [
  { node: `<i class="pi pi-reddit" style="font-size: 4rem;"></i>`, title: 'Settings', href: 'https://vue-bits.dev/' },
  { node: `<i class="pi pi-paypal" style="font-size: 4rem;"></i>`, title: 'Web', href: 'https://vue-bits.dev/' },
  { node: `<i class="pi pi-linkedin" style="font-size: 4rem;"></i>`, title: 'Code', href: 'https://vue-bits.dev/' }
];

const hasChanges = computed(
  () =>
    speed.value !== DEFAULTS.speed ||
    logoHeight.value !== DEFAULTS.logoHeight ||
    gap.value !== DEFAULTS.gap ||
    hoverSpeed.value !== DEFAULTS.hoverSpeed ||
    fadeOut.value !== DEFAULTS.fadeOut ||
    scaleOnHover.value !== DEFAULTS.scaleOnHover ||
    direction.value !== DEFAULTS.direction ||
    useCustomRender.value !== DEFAULTS.useCustomRender
);

function reset() {
  speed.value = DEFAULTS.speed;
  logoHeight.value = DEFAULTS.logoHeight;
  gap.value = DEFAULTS.gap;
  hoverSpeed.value = DEFAULTS.hoverSpeed;
  fadeOut.value = DEFAULTS.fadeOut;
  scaleOnHover.value = DEFAULTS.scaleOnHover;
  direction.value = DEFAULTS.direction;
  useCustomRender.value = DEFAULTS.useCustomRender;
  forceRerender();
}

const props: PropRow[] = [
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
    type: "'left' | 'right' | 'up' | 'down'",
    default: "'left'",
    description:
      'Direction of the logo animation loop. Supports horizontal (left/right) and vertical (up/down) scrolling.'
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
    name: 'hoverSpeed',
    type: 'number | undefined',
    default: '0',
    description: 'Speed when hovering over the component. Set to 0 to pause, or a lower value for deceleration effect.'
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
    name: 'renderItem',
    type: '(item: LogoItem, key: React.Key) => React.ReactNode',
    default: 'undefined',
    description:
      'Custom render function for each logo item. Allows full control over item rendering for animations, tooltips, etc.'
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
    type: 'CSSProperties',
    default: 'undefined',
    description: 'Inline styles to apply to the root element.'
  }
];
</script>
