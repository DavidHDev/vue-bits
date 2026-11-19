<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
    :demo-only-props="['demo', 'preset', 'smoothScroll']"
  >
    <TabsLayout>
      <template #preview>
        <div
          class="demo-container relative overflow-hidden"
          :style="{ height: '500px', padding: 0, color: ink.text, containerType: 'inline-size' }"
        >
          <div
            v-if="props.demo === 'stagger'"
            :key="`stagger-${rerenderKey}`"
            class="absolute inset-0 flex items-center justify-center"
            style="padding: 0 24px"
          >
            <AnimatedContent
              v-bind="settings"
              :stagger="settings.stagger > 0 ? settings.stagger : 0.08"
              :style="{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
                gap: '14px',
                width: 'min(100%, 460px)'
              }"
            >
              <div
                v-for="(icon, index) in TILES"
                :key="index"
                class="ac-demo-grid-tile"
                :style="{ background: ink.card, boxShadow: ink.rim }"
              >
                <HugeiconsIcon :icon="icon" :size="24" :color="ink.text" :stroke-width="1.6" />
              </div>
            </AnimatedContent>
          </div>

          <div
            v-else-if="props.demo === 'basic'"
            :key="`basic-${rerenderKey}`"
            class="absolute inset-0 flex items-center justify-center"
          >
            <AnimatedContent v-bind="settings">
              <div class="ac-demo-basic-card" :style="{ background: ink.card, boxShadow: ink.rim }">
                <div class="ac-demo-icon-tile" :style="tileStyle(40)">
                  <HugeiconsIcon :icon="FlashIcon" :size="20" :color="ink.text" :stroke-width="1.6" />
                </div>
                <p class="ac-demo-basic-title">Animated content</p>
              </div>
            </AnimatedContent>
          </div>

          <div
            v-else
            :key="`scroll-${rerenderKey}`"
            ref="scrollerRef"
            class="ac-demo-scroller absolute inset-0 overflow-y-auto"
          >
            <div v-if="scroller" class="ac-demo-scroll-column">
              <AnimatedContent v-bind="motion" :style="{ textAlign: 'center' }">
                <p class="ac-demo-heading">Ship it before lunch</p>
                <p class="ac-demo-lede" :style="{ color: ink.muted }">
                  Every push becomes a live preview, every merge a release, with nothing to configure.
                </p>
              </AnimatedContent>

              <AnimatedContent
                v-bind="motion"
                :style="{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
                  gap: '14px',
                  width: '100%'
                }"
              >
                <div
                  v-for="item in FEATURES"
                  :key="item.title"
                  class="ac-demo-feature"
                  :style="{ background: ink.card, boxShadow: ink.rim }"
                >
                  <div class="ac-demo-icon-tile" :style="tileStyle(36)">
                    <HugeiconsIcon :icon="item.icon" :size="18" :color="ink.text" :stroke-width="1.6" />
                  </div>
                  <p class="ac-demo-feature-title">{{ item.title }}</p>
                  <p class="ac-demo-feature-text" :style="{ color: ink.muted }">{{ item.text }}</p>
                </div>
              </AnimatedContent>

              <AnimatedContent v-bind="motion" :style="{ width: '100%' }">
                <div class="ac-demo-photo" :style="{ boxShadow: ink.rim }">
                  <img :src="ink.photo" alt="" draggable="false" />
                </div>
              </AnimatedContent>

              <AnimatedContent
                v-bind="motion"
                :style="{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                  gap: '14px',
                  width: '100%'
                }"
              >
                <div v-for="item in STATS" :key="item.label" class="ac-demo-stat">
                  <p class="ac-demo-stat-value">{{ item.value }}</p>
                  <p class="ac-demo-stat-label" :style="{ color: ink.muted }">{{ item.label }}</p>
                </div>
              </AnimatedContent>

              <AnimatedContent v-bind="motion" :style="{ width: '100%' }">
                <div class="ac-demo-cta" :style="{ background: ink.card, boxShadow: ink.rim }">
                  <div class="ac-demo-cta-copy">
                    <div class="ac-demo-icon-tile" :style="tileStyle(40)">
                      <HugeiconsIcon :icon="ChartLineData01Icon" :size="20" :color="ink.text" :stroke-width="1.6" />
                    </div>
                    <div>
                      <p class="ac-demo-cta-title">Start shipping today</p>
                      <p class="ac-demo-cta-text" :style="{ color: ink.muted }">Free for personal projects.</p>
                    </div>
                  </div>
                  <span class="ac-demo-cta-button" :style="{ background: ink.solid, color: ink.solidText }">
                    Get started
                    <HugeiconsIcon :icon="ArrowRight01Icon" :size="15" :stroke-width="1.8" />
                  </span>
                </div>
              </AnimatedContent>
            </div>
          </div>

          <RefreshButton @click="forceRerender" />
        </div>

        <Customize>
          <PreviewSelect
            title="Demo"
            :options="DEMO_OPTIONS"
            :model-value="props.demo"
            @update:model-value="value => updateProp('demo', String(value))"
          />
          <PreviewSelect
            title="Preset"
            :options="PRESET_OPTIONS"
            :model-value="props.preset"
            @update:model-value="applyPreset"
          />
          <PreviewSelect
            title="Direction"
            :options="DIRECTION_OPTIONS"
            :model-value="settings.direction"
            @update:model-value="value => updateProp('direction', value as Direction)"
          />
          <PreviewSelect
            title="Ease"
            :options="EASE_OPTIONS"
            :model-value="settings.ease"
            @update:model-value="value => updateProp('ease', String(value))"
          />
          <PreviewSelect
            title="Wipe"
            :options="WIPE_OPTIONS"
            :model-value="settings.wipe"
            @update:model-value="value => updateProp('wipe', value as AnimatedContentWipe)"
          />
          <PreviewSelect
            title="Stagger From"
            :options="STAGGER_FROM_OPTIONS"
            :model-value="settings.staggerFrom"
            @update:model-value="value => updateProp('staggerFrom', value as AnimatedContentStaggerFrom)"
          />
          <PreviewSlider
            title="Distance"
            :min="0"
            :max="300"
            :step="10"
            value-unit="px"
            :model-value="settings.distance"
            @update:model-value="value => updateProp('distance', value)"
          />
          <PreviewSlider
            title="Duration"
            :min="0.1"
            :max="3"
            :step="0.1"
            value-unit="s"
            :model-value="settings.duration"
            @update:model-value="value => updateProp('duration', value)"
          />
          <PreviewSlider
            title="Delay"
            :min="0"
            :max="2"
            :step="0.1"
            value-unit="s"
            :model-value="settings.delay"
            @update:model-value="value => updateProp('delay', value)"
          />
          <PreviewSlider
            title="Stagger"
            :min="0"
            :max="0.4"
            :step="0.01"
            value-unit="s"
            :model-value="settings.stagger"
            @update:model-value="value => updateProp('stagger', value)"
          />
          <PreviewSlider
            title="Blur"
            :min="0"
            :max="30"
            :step="1"
            value-unit="px"
            :model-value="settings.blur"
            @update:model-value="value => updateProp('blur', value)"
          />
          <PreviewSlider
            title="Initial Scale"
            :min="0.5"
            :max="1.5"
            :step="0.01"
            :model-value="settings.scale"
            @update:model-value="value => updateProp('scale', value)"
          />
          <PreviewSlider
            title="Rotate"
            :min="-45"
            :max="45"
            :step="1"
            value-unit="°"
            :model-value="settings.rotate"
            @update:model-value="value => updateProp('rotate', value)"
          />
          <PreviewSlider
            title="Tilt"
            :min="0"
            :max="90"
            :step="1"
            value-unit="°"
            :model-value="settings.tilt"
            @update:model-value="value => updateProp('tilt', value)"
          />
          <PreviewSlider
            title="Initial Opacity"
            :min="0"
            :max="1"
            :step="0.05"
            :is-disabled="!settings.animateOpacity"
            :model-value="settings.initialOpacity"
            @update:model-value="value => updateProp('initialOpacity', value)"
          />
          <PreviewSlider
            title="Threshold"
            :min="0"
            :max="0.9"
            :step="0.05"
            :model-value="settings.threshold"
            @update:model-value="value => updateProp('threshold', value)"
          />
          <PreviewSlider
            title="Disappear After"
            :min="0"
            :max="5"
            :step="0.1"
            value-unit="s"
            :is-disabled="!settings.once || settings.scrub"
            :model-value="settings.disappearAfter"
            @update:model-value="value => updateProp('disappearAfter', value)"
          />
          <PreviewSlider
            title="Disappear Duration"
            :min="0.1"
            :max="3"
            :step="0.1"
            value-unit="s"
            :is-disabled="!settings.disappearAfter"
            :model-value="settings.disappearDuration"
            @update:model-value="value => updateProp('disappearDuration', value)"
          />
          <PreviewSelect
            title="Disappear Ease"
            :options="DISAPPEAR_EASE_OPTIONS"
            :model-value="settings.disappearEase"
            @update:model-value="value => updateProp('disappearEase', String(value))"
          />
          <PreviewSwitch
            title="Reverse"
            :model-value="settings.reverse"
            @update:model-value="value => updateProp('reverse', value)"
          />
          <PreviewSwitch
            title="Animate Opacity"
            :model-value="settings.animateOpacity"
            @update:model-value="value => updateProp('animateOpacity', value)"
          />
          <PreviewSwitch
            title="Smooth Scroll"
            :is-disabled="props.demo !== 'scroll'"
            :model-value="props.smoothScroll"
            @update:model-value="value => updateProp('smoothScroll', value)"
          />
          <PreviewSwitch
            title="Once"
            :model-value="settings.once"
            @update:model-value="value => updateProp('once', value)"
          />
          <PreviewSwitch
            title="Scrub"
            :model-value="settings.scrub"
            @update:model-value="value => updateProp('scrub', value)"
          />
        </Customize>

        <PropTable :data="propData" />
        <Dependencies :dependency-list="['gsap']" />
      </template>

      <template #code>
        <CodeExample :code-object="animatedContent" component-name="AnimatedContent" />
      </template>
    </TabsLayout>
  </ComponentPropsProvider>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  ArrowRight01Icon as ArrowRight01IconRaw,
  ChartLineData01Icon as ChartLineData01IconRaw,
  CloudIcon,
  CommandIcon,
  Database01Icon,
  FingerPrintIcon,
  FlashIcon as FlashIconRaw,
  Globe02Icon,
  Layers01Icon,
  Notification01Icon,
  SecurityCheckIcon,
  Settings01Icon,
  UserGroupIcon
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon, type IconArray } from '@hugeicons/vue';
import CodeExample from '@/components/common/CodeExample.vue';
import Customize from '@/components/common/Customize.vue';
import Dependencies from '@/components/common/Dependencies.vue';
import PreviewSelect from '@/components/common/PreviewSelect.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import RefreshButton from '@/components/common/RefreshButton.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import ComponentPropsProvider from '@/components/context/ComponentPropsProvider.vue';
import { useComponentProps } from '@/composables/useComponentProps';
import { useForceRerender } from '@/composables/useForceRerender';
import { useSmoothScroll } from '@/composables/useSmoothScroll';
import { useColorModeValue } from '@/composables/useTheme';
import { animatedContent } from '@/constants/code/Animations/animatedContentCode';
import AnimatedContent, {
  type AnimatedContentStaggerFrom,
  type AnimatedContentWipe
} from '@/content/Animations/AnimatedContent/AnimatedContent.vue';

type Direction = 'vertical' | 'horizontal';

const ArrowRight01Icon = ArrowRight01IconRaw as IconArray;
const ChartLineData01Icon = ChartLineData01IconRaw as IconArray;
const FlashIcon = FlashIconRaw as IconArray;

const INK = {
  dark: {
    text: '#f4f4f5',
    muted: 'rgba(244, 244, 245, 0.62)',
    faint: 'rgba(244, 244, 245, 0.4)',
    tile: 'linear-gradient(180deg, #363a36 0%, #252825 100%)',
    rim: 'inset 0 0 0 1px rgba(255, 255, 255, 0.07), inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 4px 10px -4px rgba(0, 0, 0, 0.7)',
    card: 'linear-gradient(180deg, #222522 0%, #1a1c1a 100%)',
    solid: '#f4f4f5',
    solidText: '#111111',
    photo: '/assets/demo/night-landscape.webp'
  },
  light: {
    text: '#161816',
    muted: 'rgba(22, 24, 22, 0.62)',
    faint: 'rgba(22, 24, 22, 0.4)',
    tile: 'linear-gradient(180deg, #ffffff 0%, #f5f7f5 100%)',
    rim: 'inset 0 0 0 1px rgba(22, 24, 22, 0.08), inset 0 1px 0 rgba(255, 255, 255, 1), 0 4px 10px -5px rgba(22, 24, 22, 0.25)',
    card: 'linear-gradient(180deg, #ffffff 0%, #f8f9f8 100%)',
    solid: '#161816',
    solidText: '#ffffff',
    photo: '/assets/demo/day-landscape.webp'
  }
};

const FEATURES = [
  { icon: FlashIcon, title: 'Instant deploys', text: 'Push to main and it is live in seconds.' },
  { icon: Layers01Icon as IconArray, title: 'Preview builds', text: 'Every branch gets its own shareable URL.' },
  { icon: SecurityCheckIcon as IconArray, title: 'Built-in safety', text: 'Roll back any release with one click.' }
];

const STATS = [
  { value: '99.99%', label: 'Uptime' },
  { value: '42ms', label: 'Median latency' },
  { value: '180+', label: 'Edge regions' }
];

const TILES = [
  CommandIcon,
  CloudIcon,
  Database01Icon,
  FingerPrintIcon,
  Globe02Icon,
  Notification01Icon,
  Settings01Icon,
  UserGroupIcon
] as IconArray[];

const LOOK = {
  direction: 'vertical' as Direction,
  distance: 100,
  reverse: false,
  duration: 0.8,
  ease: 'power3.out',
  initialOpacity: 0,
  animateOpacity: true,
  scale: 1,
  blur: 0,
  rotate: 0,
  tilt: 0,
  wipe: 'none' as AnimatedContentWipe,
  stagger: 0.08,
  staggerFrom: 'start' as AnimatedContentStaggerFrom,
  scrub: false
};

const DEFAULT_PROPS = {
  demo: 'scroll',
  preset: 'rise',
  smoothScroll: true,
  ...LOOK,
  delay: 0,
  threshold: 0.1,
  once: true,
  disappearAfter: 0,
  disappearDuration: 0.5,
  disappearEase: 'power3.in'
};

type Look = typeof LOOK;

const PRESETS: Record<string, Partial<Look>> = {
  rise: {},
  blur: { distance: 40, blur: 12, duration: 1 },
  flip: { distance: 40, tilt: 60, duration: 1.1 },
  wipe: { distance: 0, wipe: 'up', duration: 1.2, ease: 'power2.out' },
  slide: { direction: 'horizontal', distance: 140, duration: 1.1, ease: 'expo.out', blur: 4 },
  spring: { distance: 120, duration: 1.6, ease: 'elastic.out(1, 0.55)' },
  zoom: { distance: 0, scale: 0.85, blur: 6, duration: 0.9 },
  scrub: { distance: 80, blur: 10, scrub: true }
};

const DEMO_OPTIONS = [
  { value: 'scroll', label: 'Scroll' },
  { value: 'stagger', label: 'Stagger' },
  { value: 'basic', label: 'Basic' }
];

const PRESET_OPTIONS = [
  { value: 'rise', label: 'Rise' },
  { value: 'blur', label: 'Blur' },
  { value: 'flip', label: 'Flip' },
  { value: 'wipe', label: 'Wipe' },
  { value: 'slide', label: 'Slide' },
  { value: 'spring', label: 'Spring' },
  { value: 'zoom', label: 'Zoom' },
  { value: 'scrub', label: 'Scrub' }
];

const DIRECTION_OPTIONS = [
  { value: 'vertical', label: 'Vertical' },
  { value: 'horizontal', label: 'Horizontal' }
];

const EASE_OPTIONS = [
  { value: 'power3.out', label: 'Power' },
  { value: 'expo.out', label: 'Expo' },
  { value: 'power2.out', label: 'Soft' },
  { value: 'back.out(1.6)', label: 'Back' },
  { value: 'elastic.out(1, 0.55)', label: 'Elastic' },
  { value: 'bounce.out', label: 'Bounce' },
  { value: 'none', label: 'Linear' }
];

const DISAPPEAR_EASE_OPTIONS = [
  { value: 'power3.in', label: 'Power' },
  { value: 'expo.in', label: 'Expo' },
  { value: 'back.in(1.6)', label: 'Back' }
];

const WIPE_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'up', label: 'Up' },
  { value: 'down', label: 'Down' },
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' },
  { value: 'center', label: 'Center' }
];

const STAGGER_FROM_OPTIONS = [
  { value: 'start', label: 'Start' },
  { value: 'end', label: 'End' },
  { value: 'center', label: 'Center' },
  { value: 'edges', label: 'Edges' },
  { value: 'random', label: 'Random' }
];

const propData: PropRow[] = [
  { name: 'default slot', type: 'slot', default: '-', description: 'The content to animate.' },
  {
    name: 'container',
    type: 'string | HTMLElement',
    default: 'window',
    description: 'Scroll container that drives the animation, as a selector or an element. Defaults to the page.'
  },
  {
    name: 'distance',
    type: 'number',
    default: '100',
    description: 'How far the content travels into place, in px.'
  },
  {
    name: 'direction',
    type: "'vertical' | 'horizontal'",
    default: "'vertical'",
    description: 'Axis the content travels along.'
  },
  {
    name: 'reverse',
    type: 'boolean',
    default: 'false',
    description: 'Comes in from the opposite side: from above, or from the left.'
  },
  { name: 'duration', type: 'number', default: '0.8', description: 'Length of the animation, in seconds.' },
  {
    name: 'ease',
    type: 'string',
    default: "'power3.out'",
    description: "Any GSAP ease, such as 'expo.out', 'back.out(1.6)' or 'elastic.out(1, 0.5)'."
  },
  { name: 'initialOpacity', type: 'number', default: '0', description: 'Opacity the content starts from.' },
  {
    name: 'animateOpacity',
    type: 'boolean',
    default: 'true',
    description: 'Fades the content in. Turn off to keep it fully opaque while it moves.'
  },
  { name: 'scale', type: 'number', default: '1', description: 'Scale the content starts from.' },
  {
    name: 'blur',
    type: 'number',
    default: '0',
    description: 'Blur the content starts from, in px. It comes into focus as it lands.'
  },
  { name: 'rotate', type: 'number', default: '0', description: 'Rotation the content starts from, in degrees.' },
  {
    name: 'tilt',
    type: 'number',
    default: '0',
    description: 'Tips the content back in 3D, in degrees, so it flips up into place.'
  },
  {
    name: 'wipe',
    type: "'none' | 'up' | 'down' | 'left' | 'right' | 'center'",
    default: "'none'",
    description: 'Reveals the content behind a soft moving edge instead of all at once.'
  },
  {
    name: 'threshold',
    type: 'number',
    default: '0.1',
    description: 'How far into the viewport the top of the content must be before it animates, from 0 to 1.'
  },
  { name: 'delay', type: 'number', default: '0', description: 'Wait before the animation starts, in seconds.' },
  {
    name: 'stagger',
    type: 'number',
    default: '0',
    description: 'Animates each direct child in turn, this many seconds apart. Great for lists and grids.'
  },
  {
    name: 'staggerFrom',
    type: "'start' | 'end' | 'center' | 'edges' | 'random'",
    default: "'start'",
    description: 'Which child goes first when staggering.'
  },
  {
    name: 'trigger',
    type: "'scroll' | 'mount'",
    default: "'scroll'",
    description: 'Animate when the content scrolls into view, or right away.'
  },
  {
    name: 'once',
    type: 'boolean',
    default: 'true',
    description:
      'Plays once. Turn off to replay every time the content scrolls in, and reverse when it scrolls back out.'
  },
  {
    name: 'scrub',
    type: 'boolean | number',
    default: 'false',
    description: 'Ties the animation to the scroll position. A number smooths it, in seconds.'
  },
  {
    name: 'disappearAfter',
    type: 'number',
    default: '0',
    description: 'Hides the content again this many seconds after it appears. 0 keeps it shown.'
  },
  {
    name: 'disappearDuration',
    type: 'number',
    default: '0.5',
    description: 'Length of the hide animation, in seconds.'
  },
  { name: 'disappearEase', type: 'string', default: "'power3.in'", description: 'GSAP ease of the hide animation.' },
  { name: '@start', type: '() => void', default: '-', description: 'Emitted when the animation starts.' },
  { name: '@complete', type: '() => void', default: '-', description: 'Emitted when the animation finishes.' },
  {
    name: '@disappearance-complete',
    type: '() => void',
    default: '-',
    description: 'Emitted when the hide animation finishes.'
  },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the wrapper.' },
  { name: 'style', type: 'StyleValue', default: '-', description: 'Inline styles for the wrapper.' }
];

const { rerenderKey, forceRerender } = useForceRerender();
const { props, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);
const theme = useColorModeValue<'light' | 'dark'>('light', 'dark');
const ink = computed(() => INK[theme.value]);

const settings = computed(() => {
  const { demo: _demo, preset: _preset, smoothScroll: _smoothScroll, ...rest } = props.value;
  return rest;
});

const scrollerRef = ref<HTMLElement | null>(null);
const scroller = computed(() => scrollerRef.value);
const motion = computed(() => ({ ...settings.value, container: scroller.value }));

useSmoothScroll(scroller, () => props.value.smoothScroll);

const tileStyle = (size: number) => ({
  width: `${size}px`,
  height: `${size}px`,
  background: ink.value.tile,
  boxShadow: ink.value.rim
});

const applyPreset = (value: string | number) => {
  const key = String(value);
  updateProps({ ...LOOK, ...PRESETS[key], preset: key });
  forceRerender();
};
</script>

<style scoped>
.ac-demo-scroller {
  scrollbar-width: none;
}

.ac-demo-scroll-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 72px;
  padding: 96px 24px 140px;
  max-width: 720px;
  margin: 0 auto;
}

.ac-demo-scroll-column p,
.ac-demo-basic-card p,
.ac-demo-cta p {
  margin: 0;
}

.ac-demo-heading {
  font-size: clamp(26px, 7cqi, 40px);
  font-weight: 600;
  letter-spacing: -0.035em;
  line-height: 1.1;
}

.ac-demo-lede {
  margin: 14px auto 0 !important;
  font-size: 15px;
  max-width: 420px;
  line-height: 1.6;
}

.ac-demo-icon-tile {
  border-radius: 10px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.ac-demo-feature {
  padding: 20px;
  border-radius: 18px;
}

.ac-demo-feature-title {
  margin-top: 18px !important;
  font-size: 15px;
  font-weight: 600;
}

.ac-demo-feature-text {
  margin-top: 6px !important;
  font-size: 13px;
  line-height: 1.5;
}

.ac-demo-photo {
  height: 200px;
  border-radius: 22px;
  overflow: hidden;
  position: relative;
}

.ac-demo-photo img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

@media (min-width: 768px) {
  .ac-demo-photo {
    height: 260px;
  }
}

.ac-demo-stat {
  text-align: center;
  padding: 6px 0;
}

.ac-demo-stat-value {
  font-size: clamp(18px, 5.4cqi, 32px);
  font-weight: 600;
  letter-spacing: -0.03em;
  white-space: nowrap;
}

.ac-demo-stat-label {
  margin-top: 4px !important;
  font-size: 13px;
}

.ac-demo-cta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  padding: 24px;
  border-radius: 20px;
}

.ac-demo-cta-copy {
  display: flex;
  align-items: center;
  gap: 14px;
}

.ac-demo-cta-title {
  font-size: 16px;
  font-weight: 600;
}

.ac-demo-cta-text {
  margin-top: 2px !important;
  font-size: 13px;
}

.ac-demo-cta-button {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 40px;
  padding: 0 16px;
  border-radius: 11px;
  font-size: 14px;
  font-weight: 500;
}

.ac-demo-grid-tile {
  aspect-ratio: 1;
  border-radius: 18px;
  display: grid;
  place-items: center;
}

.ac-demo-basic-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  width: 220px;
  height: 150px;
  border-radius: 22px;
}

.ac-demo-basic-title {
  font-size: 15px;
  font-weight: 600;
}
</style>
