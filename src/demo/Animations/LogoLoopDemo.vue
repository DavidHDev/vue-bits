<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
    :demo-only-props="['preset', 'useCustomRender']"
  >
    <TabsLayout>
      <template #preview>
        <div class="demo-container relative overflow-hidden" style="height: 400px; padding: 0">
          <RefreshButton @click="forceRerender" />
          <LogoLoop :key="rerenderKey" :logos="items" v-bind="settings" aria-label="Our tech stack">
            <template v-if="props.useCustomRender" #renderItem="{ item }">
              <div class="logoloop-demo-tile">
                <component :is="item.node" v-if="'node' in item" />
                <img v-else :src="item.src" :alt="item.alt" />
              </div>
            </template>
          </LogoLoop>
        </div>

        <Customize>
          <PreviewSelect
            title="Preset"
            :options="PRESET_OPTIONS"
            :model-value="props.preset"
            @update:model-value="(value: string | number) => applyPreset(String(value))"
          />
          <PreviewSelect
            title="Layout"
            :options="LAYOUT_OPTIONS"
            :model-value="settings.layout"
            @update:model-value="value => updateProp('layout', value as Layout)"
          />
          <PreviewSelect
            title="Direction"
            :options="DIRECTION_OPTIONS"
            :model-value="settings.direction"
            @update:model-value="value => updateProp('direction', value as Direction)"
          />
          <PreviewSelect
            title="Labels"
            :options="LABEL_OPTIONS"
            :model-value="settings.labels"
            @update:model-value="value => updateProp('labels', value as Labels)"
          />
          <PreviewSlider
            title="Speed"
            :min="0"
            :max="300"
            :step="10"
            value-unit="px/s"
            :model-value="settings.speed"
            @update:model-value="value => updateProp('speed', value)"
          />
          <PreviewSlider
            title="Hover Speed"
            :min="0"
            :max="200"
            :step="10"
            value-unit="px/s"
            :model-value="settings.hoverSpeed"
            @update:model-value="value => updateProp('hoverSpeed', value)"
          />
          <PreviewSlider
            title="Logo Height"
            :min="20"
            :max="100"
            :step="2"
            value-unit="px"
            :model-value="settings.logoHeight"
            @update:model-value="value => updateProp('logoHeight', value)"
          />
          <PreviewSlider
            title="Gap"
            :min="10"
            :max="120"
            :step="2"
            value-unit="px"
            :model-value="settings.gap"
            @update:model-value="value => updateProp('gap', value)"
          />
          <PreviewSlider
            title="Bend"
            :min="-1"
            :max="1"
            :step="0.05"
            :is-disabled="!bends"
            :model-value="settings.bend"
            @update:model-value="value => updateProp('bend', value)"
          />
          <PreviewSlider
            title="Focus"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.focus"
            @update:model-value="value => updateProp('focus', value)"
          />
          <PreviewSlider
            title="Magnify"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.magnify"
            @update:model-value="value => updateProp('magnify', value)"
          />
          <PreviewSlider
            title="Muted"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.muted"
            @update:model-value="value => updateProp('muted', value)"
          />
          <PreviewSlider
            title="Tilt X"
            :min="-60"
            :max="60"
            :step="1"
            value-unit="°"
            :model-value="settings.tiltX"
            @update:model-value="value => updateProp('tiltX', value)"
          />
          <PreviewSlider
            title="Tilt Y"
            :min="-60"
            :max="60"
            :step="1"
            value-unit="°"
            :model-value="settings.tiltY"
            @update:model-value="value => updateProp('tiltY', value)"
          />
          <PreviewSlider
            title="Fade Width"
            :min="0"
            :max="0.5"
            :step="0.01"
            :is-disabled="!settings.fadeOut"
            :model-value="settings.fadeOutWidth"
            @update:model-value="value => updateProp('fadeOutWidth', value)"
          />
          <PreviewSlider
            title="Scroll Boost"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.scrollBoost"
            @update:model-value="value => updateProp('scrollBoost', value)"
          />
          <PreviewSwitch
            title="Fade Out"
            :model-value="settings.fadeOut"
            @update:model-value="value => updateProp('fadeOut', value)"
          />
          <PreviewSwitch
            title="Step"
            :model-value="settings.step"
            @update:model-value="value => updateProp('step', value)"
          />
          <PreviewSwitch
            title="Draggable"
            :model-value="settings.draggable"
            @update:model-value="value => updateProp('draggable', value)"
          />
          <PreviewSwitch
            title="Scale on Hover"
            :model-value="settings.scaleOnHover"
            @update:model-value="value => updateProp('scaleOnHover', value)"
          />
          <PreviewSwitch title="Intro" :model-value="settings.intro" @update:model-value="setIntro" />
          <PreviewSwitch
            title="Custom Render"
            :model-value="props.useCustomRender"
            @update:model-value="value => updateProp('useCustomRender', value)"
          />
        </Customize>

        <PropTable :data="propData" />
      </template>

      <template #code>
        <CodeExample :code-object="logoLoop" component-name="LogoLoop" />
      </template>
    </TabsLayout>
  </ComponentPropsProvider>
</template>

<script setup lang="ts">
import { computed, h } from 'vue';
import {
  SiDocker,
  SiGithub,
  SiNuxtdotjs,
  SiPrisma,
  SiStripe,
  SiSupabase,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
  SiVuedotjs
} from 'vue-icons-plus/si';
import CodeExample from '@/components/common/CodeExample.vue';
import Customize from '@/components/common/Customize.vue';
import PreviewSelect from '@/components/common/PreviewSelect.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import RefreshButton from '@/components/common/RefreshButton.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import ComponentPropsProvider from '@/components/context/ComponentPropsProvider.vue';
import { useComponentProps } from '@/composables/useComponentProps';
import { useForceRerender } from '@/composables/useForceRerender';
import { logoLoop } from '@/constants/code/Animations/logoLoopCode';
import LogoLoop, { type LogoItem } from '@/content/Animations/LogoLoop/LogoLoop.vue';

type Layout = 'line' | 'wave' | 'arc' | 'orbit';
type Direction = 'left' | 'right' | 'up' | 'down';
type Labels = 'none' | 'inline' | 'below' | 'hover';

const icon = (component: typeof SiVuedotjs) => h(component, { size: '1em' });

const items: LogoItem[] = [
  { node: icon(SiVuedotjs), title: 'Vue', href: 'https://vuejs.org', hoverColor: '#42b883' },
  { node: icon(SiNuxtdotjs), title: 'Nuxt', href: 'https://nuxt.com' },
  { node: icon(SiTypescript), title: 'TypeScript', href: 'https://www.typescriptlang.org', hoverColor: '#3178c6' },
  { node: icon(SiTailwindcss), title: 'Tailwind CSS', href: 'https://tailwindcss.com', hoverColor: '#38bdf8' },
  { node: icon(SiVercel), title: 'Vercel', href: 'https://vercel.com' },
  { node: icon(SiGithub), title: 'GitHub', href: 'https://github.com' },
  { node: icon(SiDocker), title: 'Docker', href: 'https://www.docker.com', hoverColor: '#2496ed' },
  { node: icon(SiPrisma), title: 'Prisma', href: 'https://www.prisma.io' },
  { node: icon(SiSupabase), title: 'Supabase', href: 'https://supabase.com', hoverColor: '#3ecf8e' },
  { node: icon(SiStripe), title: 'Stripe', href: 'https://stripe.com' }
];

const LOOK = {
  layout: 'line' as Layout,
  direction: 'left' as Direction,
  labels: 'none' as Labels,
  speed: 100,
  hoverSpeed: 0,
  logoHeight: 48,
  gap: 56,
  bend: 0.5,
  focus: 0,
  magnify: 0,
  muted: 0,
  tiltX: 0,
  tiltY: 0,
  fadeOut: true,
  fadeOutWidth: 0.12,
  scrollBoost: 0,
  step: false,
  scaleOnHover: true
};

type Look = typeof LOOK;

const DEFAULT_PROPS = {
  preset: 'classic',
  ...LOOK,
  draggable: true,
  intro: true,
  useCustomRender: false
};

const PRESETS: Record<string, Partial<Look>> = {
  classic: {},
  minimal: { logoHeight: 36, gap: 72, speed: 60, muted: 0.6, scaleOnHover: false },
  stack: { labels: 'inline', logoHeight: 32, gap: 56, speed: 80, scaleOnHover: false },
  dock: { magnify: 0.8, labels: 'hover', muted: 0.5, logoHeight: 44, gap: 44, scaleOnHover: false },
  spotlight: { focus: 0.7, step: true, labels: 'hover', muted: 0.4, logoHeight: 44, scaleOnHover: false },
  wave: { layout: 'wave', bend: 0.6, scaleOnHover: false },
  arc: { layout: 'arc', bend: 0.6, scaleOnHover: false },
  orbit: { layout: 'orbit', bend: 0.6, scaleOnHover: false },
  perspective: { tiltX: 6, tiltY: -32, speed: 120, scaleOnHover: false },
  vertical: { direction: 'up', focus: 0.5, logoHeight: 40, gap: 40, scaleOnHover: false }
};

const PRESET_OPTIONS = [
  { value: 'classic', label: 'Classic' },
  { value: 'minimal', label: 'Minimal' },
  { value: 'stack', label: 'Stack' },
  { value: 'dock', label: 'Dock' },
  { value: 'spotlight', label: 'Spotlight' },
  { value: 'wave', label: 'Wave' },
  { value: 'arc', label: 'Arc' },
  { value: 'orbit', label: 'Orbit' },
  { value: 'perspective', label: 'Perspective' },
  { value: 'vertical', label: 'Vertical' }
];

const LAYOUT_OPTIONS = [
  { value: 'line', label: 'Line' },
  { value: 'wave', label: 'Wave' },
  { value: 'arc', label: 'Arc' },
  { value: 'orbit', label: 'Orbit' }
];

const DIRECTION_OPTIONS = [
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' },
  { value: 'up', label: 'Up' },
  { value: 'down', label: 'Down' }
];

const LABEL_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'inline', label: 'Inline' },
  { value: 'below', label: 'Below' },
  { value: 'hover', label: 'On Hover' }
];

const { rerenderKey, forceRerender } = useForceRerender();
const { props, defaultProps, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);

const settings = computed(() => {
  const { preset: _preset, useCustomRender: _useCustomRender, ...rest } = props.value;
  return rest;
});

const bends = computed(() => settings.value.layout !== 'line');

const applyPreset = (value: string) => {
  const base = Object.fromEntries(
    Object.keys(LOOK).map(name => [name, defaultProps.value[name as keyof Look]])
  ) as Partial<Look>;
  updateProps({ ...base, ...PRESETS[value], preset: value });
  forceRerender();
};

const setIntro = (value: boolean) => {
  updateProp('intro', value);
  forceRerender();
};

const propData: PropRow[] = [
  {
    name: 'logos',
    type: 'LogoItem[]',
    default: 'required',
    description:
      'Logos to show. Each item is either { node } for a Vue component, VNode or HTML string, like an icon, or { src, alt } for an image. Both accept an optional title, href and hoverColor, the brand color a logo takes on when hovered.'
  },
  {
    name: 'speed',
    type: 'number',
    default: '120',
    description: 'Speed in pixels per second. Negative values reverse the direction.'
  },
  {
    name: 'direction',
    type: "'left' | 'right' | 'up' | 'down'",
    default: "'left'",
    description: 'Which way the logos travel.'
  },
  { name: 'width', type: 'number | string', default: "'100%'", description: 'Width of the loop.' },
  { name: 'logoHeight', type: 'number', default: '28', description: 'Height of each logo in pixels.' },
  { name: 'gap', type: 'number', default: '32', description: 'Space between logos in pixels.' },
  {
    name: 'hoverSpeed',
    type: 'number',
    default: 'undefined',
    description:
      'Speed while the loop is hovered or a logo has keyboard focus. 0 pauses it and a small value slows it down. By default it pauses.'
  },
  {
    name: 'pauseOnHover',
    type: 'boolean',
    default: 'undefined',
    description: 'Set to false to keep full speed on hover. Ignored when hoverSpeed is set.'
  },
  {
    name: 'fadeOut',
    type: 'boolean',
    default: 'true',
    description: 'Fades the logos out softly at both ends. It is a transparent mask, so it works on any background.'
  },
  {
    name: 'fadeOutWidth',
    type: 'number',
    default: '0.12',
    description: 'Size of each fade as a fraction of the length, from 0 to 0.5.'
  },
  { name: 'scaleOnHover', type: 'boolean', default: 'false', description: 'Grows the hovered logo slightly.' },
  {
    name: 'layout',
    type: "'line' | 'wave' | 'arc' | 'orbit'",
    default: "'line'",
    description: 'Path the logos travel along: a straight line, a wave, an arc, or a ring that turns in 3D.'
  },
  {
    name: 'bend',
    type: 'number',
    default: '0.5',
    description:
      'How strongly the path bends, from -1 to 1. It sets the height of the wave, the curve of the arc or the tilt of the orbit. Negative values flip it.'
  },
  {
    name: 'focus',
    type: 'number',
    default: '0',
    description:
      'A lens in the middle, from 0 to 1. Logos grow and make room as they pass the center while the outer ones dim.'
  },
  {
    name: 'magnify',
    type: 'number',
    default: '0',
    description: 'Dock-style magnification under the cursor, from 0 to 1. Nearby logos move aside to make room.'
  },
  { name: 'tiltX', type: 'number', default: '0', description: 'Tilts the loop back or forward in 3D, in degrees.' },
  { name: 'tiltY', type: 'number', default: '0', description: 'Turns the loop to the side in 3D, in degrees.' },
  {
    name: 'step',
    type: 'boolean',
    default: 'false',
    description: 'Moves one logo at a time and pauses, centering each logo in turn. Speed sets the pace.'
  },
  {
    name: 'muted',
    type: 'number',
    default: '0',
    description: 'Greys out and dims the logos until one is hovered or centered, from 0 to 1.'
  },
  {
    name: 'labels',
    type: "'none' | 'inline' | 'below' | 'hover'",
    default: "'none'",
    description: "Shows each logo's title beside it, below it, or as a small caption when it is hovered or centered."
  },
  {
    name: 'draggable',
    type: 'boolean',
    default: 'true',
    description: 'Lets people drag or swipe the loop and fling it. Links still open with a normal click.'
  },
  {
    name: 'scrollBoost',
    type: 'number',
    default: '0',
    description: 'Speeds the loop up while the page scrolls and reverses it when scrolling up, from 0 to 1.'
  },
  {
    name: 'intro',
    type: 'boolean',
    default: 'true',
    description: 'Logos fade and rise in from left to right the first time the loop comes into view.'
  },
  {
    name: '#renderItem',
    type: 'slot { item: LogoItem, index: string }',
    default: 'undefined',
    description: 'Custom render slot for each logo, for full control over how it looks.'
  },
  { name: 'ariaLabel', type: 'string', default: "'Partner logos'", description: 'Accessible name for the loop.' },
  { name: 'className', type: 'string', default: 'undefined', description: 'Extra class names for the container.' },
  { name: 'style', type: 'CSSProperties', default: 'undefined', description: 'Inline styles for the container.' }
];
</script>

<style scoped>
.logoloop-demo-tile {
  padding: 0.18em;
  border-radius: 0.22em;
  border: 1px solid var(--border-primary);
  background: var(--surface-ghost);
  line-height: 0;
}
</style>
