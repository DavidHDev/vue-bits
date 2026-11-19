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
            v-if="props.demo === 'journal'"
            :key="sceneKey"
            :ref="setScroller"
            style="position: absolute; inset: 0; overflow-y: auto; scrollbar-width: none"
          >
            <div
              v-if="scroller"
              style="
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 64px;
                padding: 92px 24px 140px;
                max-width: 680px;
                margin: 0 auto;
              "
            >
              <FadeContent v-bind="journalFade" :style="{ textAlign: 'center' }">
                <p :style="{ margin: 0, fontSize: '13px', color: ink.faint }">Field notes, October</p>
                <p
                  style="
                    margin: 10px 0 0;
                    font-size: clamp(28px, 7.4cqi, 44px);
                    font-weight: 600;
                    letter-spacing: -0.035em;
                    line-height: 1.08;
                  "
                >
                  Slow light over the bay
                </p>
                <p
                  :style="{
                    margin: '14px auto 0',
                    fontSize: '15px',
                    color: ink.muted,
                    maxWidth: '400px',
                    lineHeight: 1.6
                  }"
                >
                  Shot in the last minutes of daylight, when the clouds turn and the water goes still.
                </p>
              </FadeContent>

              <FadeContent v-bind="journalFade" :style="{ width: '100%' }">
                <div :style="frameStyle({ h: 'clamp(220px, 50cqi, 340px)' })">
                  <img :src="ink.sky" alt="" :draggable="false" :style="imgStyle()" />
                </div>
              </FadeContent>

              <FadeContent
                v-bind="journalFade"
                :style="{ display: 'flex', flexWrap: 'wrap', gap: '28px', width: '100%', alignItems: 'center' }"
              >
                <div style="flex: 1 1 240px; min-width: 0">
                  <p style="margin: 0; font-size: 20px; font-weight: 600; letter-spacing: -0.02em">The walk out</p>
                  <p :style="{ margin: '10px 0 0', fontSize: '15px', lineHeight: 1.65, color: ink.muted }">
                    The pier is a twenty minute walk from the station. Most evenings it is empty by the time the sky
                    starts to change, so you get the whole thing to yourself.
                  </p>
                </div>
                <div style="flex: 1 1 240px; min-width: 0">
                  <div :style="frameStyle({ ratio: '4 / 5', radius: '18px' })">
                    <img :src="ink.portrait" alt="" :draggable="false" :style="imgStyle()" />
                  </div>
                </div>
              </FadeContent>

              <FadeContent v-bind="journalFade" :style="{ textAlign: 'center', maxWidth: '460px' }">
                <p
                  style="
                    margin: 0;
                    font-size: clamp(20px, 5cqi, 28px);
                    font-weight: 500;
                    letter-spacing: -0.02em;
                    line-height: 1.3;
                  "
                >
                  The good light lasts about four minutes. You learn to wait for it.
                </p>
              </FadeContent>

              <FadeContent v-bind="journalFade" :style="{ width: '100%' }">
                <div :style="frameStyle({ h: 'clamp(200px, 44cqi, 300px)' })">
                  <img :src="ink.landscape" alt="" :draggable="false" :style="imgStyle('50% 60%')" />
                </div>
              </FadeContent>

              <FadeContent v-bind="journalFade" :style="{ textAlign: 'center' }">
                <p :style="{ margin: 0, fontSize: '15px', color: ink.muted }">More from the coast next spring.</p>
              </FadeContent>
            </div>
          </div>

          <div
            v-else-if="props.demo === 'gallery'"
            :key="sceneKey"
            style="
              position: absolute;
              inset: 0;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 0 24px;
            "
          >
            <FadeContent
              v-bind="fade"
              :stagger="fade.stagger > 0 ? fade.stagger : 0.1"
              :style="{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                gap: '12px',
                width: 'min(100%, 520px)'
              }"
            >
              <div v-for="(tile, index) in TILES" :key="index" :style="frameStyle({ ratio: '1', radius: '16px' })">
                <img :src="ink[tile.photo]" alt="" :draggable="false" :style="imgStyle(tile.position)" />
              </div>
            </FadeContent>
          </div>

          <div
            v-else
            :key="sceneKey"
            style="
              position: absolute;
              inset: 0;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 0 24px;
            "
          >
            <FadeContent v-bind="fade" :style="{ width: 'min(100%, 320px)' }">
              <div :style="frameStyle({ ratio: '3 / 2', radius: '20px' })">
                <img :src="ink.sky" alt="" :draggable="false" :style="imgStyle()" />
              </div>
            </FadeContent>
          </div>

          <RefreshButton @click="forceRerender" />
        </div>

        <Customize>
          <PreviewSelect
            title="Demo"
            :options="DEMO_OPTIONS"
            :model-value="props.demo"
            @update:model-value="value => updateProp('demo', value as string)"
          />
          <PreviewSelect
            title="Preset"
            :options="PRESET_OPTIONS"
            :model-value="props.preset"
            @update:model-value="value => applyPreset(String(value))"
          />
          <PreviewSelect
            title="Effect"
            :options="EFFECT_OPTIONS"
            :model-value="settings.effect"
            @update:model-value="value => updateProp('effect', value as FadeContentEffect)"
          />
          <PreviewSelect
            title="Ease"
            :options="EASE_OPTIONS"
            :model-value="settings.ease"
            @update:model-value="value => updateProp('ease', value as string)"
          />
          <PreviewSelect
            title="Stagger From"
            :options="STAGGER_FROM_OPTIONS"
            :model-value="settings.staggerFrom"
            @update:model-value="value => updateProp('staggerFrom', value as FadeContentStaggerFrom)"
          />
          <PreviewSelect
            title="Disappear Ease"
            :options="DISAPPEAR_EASE_OPTIONS"
            :model-value="settings.disappearEase"
            @update:model-value="value => updateProp('disappearEase', value as string)"
          />
          <PreviewSlider
            title="Duration"
            :min="0.2"
            :max="4"
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
            :max="0.5"
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
            title="Initial Opacity"
            :min="0"
            :max="0.9"
            :step="0.05"
            :model-value="settings.initialOpacity"
            @update:model-value="value => updateProp('initialOpacity', value)"
          />
          <PreviewSlider
            title="Threshold"
            :min="0"
            :max="0.45"
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
            :is-disabled="!settings.once || settings.exit || (scrolling && Boolean(settings.scrub))"
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
          <PreviewSwitch
            title="Once"
            :model-value="settings.once"
            @update:model-value="value => updateProp('once', value)"
          />
          <PreviewSwitch
            title="Exit"
            :is-disabled="!scrolling"
            :model-value="settings.exit"
            @update:model-value="value => updateProp('exit', value)"
          />
          <PreviewSwitch
            title="Scrub"
            :is-disabled="!scrolling"
            :model-value="Boolean(settings.scrub)"
            @update:model-value="value => updateProp('scrub', value)"
          />
          <PreviewSwitch
            title="Smooth Scroll"
            :is-disabled="!scrolling"
            :model-value="props.smoothScroll"
            @update:model-value="value => updateProp('smoothScroll', value)"
          />
        </Customize>

        <PropTable :data="propData" />
        <Dependencies :dependency-list="['gsap']" />
      </template>

      <template #code>
        <CodeExample :code-object="fadeContent" component-name="FadeContent" />
      </template>
    </TabsLayout>
  </ComponentPropsProvider>
</template>

<script setup lang="ts">
import { computed, shallowRef, watch, type CSSProperties } from 'vue';
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
import { fadeContent } from '@/constants/code/Animations/fadeContentCode';
import FadeContent, {
  type FadeContentEffect,
  type FadeContentStaggerFrom
} from '@/content/Animations/FadeContent/FadeContent.vue';

type Photo = 'sky' | 'portrait' | 'landscape';

const INK = {
  dark: {
    text: '#f4f4f5',
    muted: 'rgba(244, 244, 245, 0.62)',
    faint: 'rgba(244, 244, 245, 0.4)',
    rim: 'inset 0 0 0 1px rgba(255, 255, 255, 0.07)',
    sky: '/assets/demo/night-sky.webp',
    portrait: '/assets/demo/night-portrait.webp',
    landscape: '/assets/demo/night-landscape.webp'
  },
  light: {
    text: '#161816',
    muted: 'rgba(22, 24, 22, 0.62)',
    faint: 'rgba(22, 24, 22, 0.4)',
    rim: 'inset 0 0 0 1px rgba(22, 24, 22, 0.08)',
    sky: '/assets/demo/day-sky.webp',
    portrait: '/assets/demo/day-portrait.webp',
    landscape: '/assets/demo/day-landscape.webp'
  }
};

const TILES: { photo: Photo; position: string }[] = [
  { photo: 'sky', position: '18% 40%' },
  { photo: 'portrait', position: '50% 30%' },
  { photo: 'landscape', position: '20% 60%' },
  { photo: 'landscape', position: '82% 45%' },
  { photo: 'sky', position: '85% 55%' },
  { photo: 'portrait', position: '50% 88%' }
];

const LOOK = {
  effect: 'fade' as FadeContentEffect,
  blur: 0,
  duration: 1,
  ease: 'power2.out',
  initialOpacity: 0,
  stagger: 0.1,
  staggerFrom: 'start' as FadeContentStaggerFrom,
  exit: false,
  scrub: false as boolean | number
};

const DEFAULT_PROPS = {
  demo: 'journal',
  preset: 'mist',
  smoothScroll: true,
  ...LOOK,
  effect: 'mist' as FadeContentEffect,
  duration: 1.8,
  delay: 0,
  threshold: 0.1,
  once: true,
  disappearAfter: 0,
  disappearDuration: 0.5,
  disappearEase: 'power2.in'
};

const PRESETS: Record<string, Partial<typeof LOOK>> = {
  fade: {},
  soft: { blur: 10, duration: 1.2 },
  focus: { effect: 'focus', duration: 1.2, ease: 'power3.out' },
  develop: { effect: 'develop', duration: 2 },
  dissolve: { effect: 'dissolve', duration: 1.4, ease: 'power1.inOut' },
  mist: { effect: 'mist', duration: 1.8 },
  pixel: { effect: 'pixel', duration: 1.2, ease: 'power1.inOut' },
  spotlight: { effect: 'focus', exit: true, scrub: 0.5 }
};

const DEMO_OPTIONS = [
  { value: 'journal', label: 'Journal' },
  { value: 'gallery', label: 'Gallery' },
  { value: 'basic', label: 'Basic' }
];

const PRESET_OPTIONS = [
  { value: 'fade', label: 'Fade' },
  { value: 'soft', label: 'Soft' },
  { value: 'focus', label: 'Focus' },
  { value: 'develop', label: 'Develop' },
  { value: 'dissolve', label: 'Dissolve' },
  { value: 'mist', label: 'Mist' },
  { value: 'pixel', label: 'Pixel' },
  { value: 'spotlight', label: 'Spotlight' }
];

const EFFECT_OPTIONS = [
  { value: 'fade', label: 'Fade' },
  { value: 'focus', label: 'Focus' },
  { value: 'develop', label: 'Develop' },
  { value: 'dissolve', label: 'Dissolve' },
  { value: 'mist', label: 'Mist' },
  { value: 'pixel', label: 'Pixel' }
];

const EASE_OPTIONS = [
  { value: 'power2.out', label: 'Soft' },
  { value: 'power3.out', label: 'Power' },
  { value: 'expo.out', label: 'Expo' },
  { value: 'power1.inOut', label: 'Even' },
  { value: 'sine.in', label: 'Slow Start' },
  { value: 'none', label: 'Linear' }
];

const DISAPPEAR_EASE_OPTIONS = [
  { value: 'power2.in', label: 'Soft' },
  { value: 'power3.in', label: 'Power' },
  { value: 'expo.in', label: 'Expo' }
];

const STAGGER_FROM_OPTIONS = [
  { value: 'start', label: 'Start' },
  { value: 'end', label: 'End' },
  { value: 'center', label: 'Center' },
  { value: 'edges', label: 'Edges' },
  { value: 'random', label: 'Random' }
];

const propData: PropRow[] = [
  { name: 'default slot', type: 'slot', default: '-', description: 'The content to fade in.' },
  {
    name: 'container',
    type: 'string | HTMLElement',
    default: 'window',
    description: 'Scroll container that drives the fade, as a selector or an element. Defaults to the page.'
  },
  {
    name: 'effect',
    type: "'fade' | 'focus' | 'develop' | 'dissolve' | 'mist' | 'pixel'",
    default: "'fade'",
    description:
      'How the content appears: a plain fade, out of focus, from washed-out gray, through fine grain, through drifting mist, or block by block.'
  },
  {
    name: 'blur',
    type: 'boolean | number',
    default: 'false',
    description: 'Extra blur the content starts from, in px. true adds 10px.'
  },
  {
    name: 'duration',
    type: 'number',
    default: '1',
    description: 'Length of the fade, in seconds. Values above 10 are read as milliseconds.'
  },
  {
    name: 'ease',
    type: 'string',
    default: "'power2.out'",
    description: "Any GSAP ease, such as 'power3.out', 'expo.out' or 'none'."
  },
  {
    name: 'delay',
    type: 'number',
    default: '0',
    description: 'Wait before the fade starts, in seconds. Values above 10 are read as milliseconds.'
  },
  {
    name: 'threshold',
    type: 'number',
    default: '0.1',
    description: 'How far into the viewport the top of the content must be before it fades in, from 0 to 1.'
  },
  { name: 'initialOpacity', type: 'number', default: '0', description: 'Opacity the content starts from.' },
  {
    name: 'stagger',
    type: 'number',
    default: '0',
    description: 'Fades each direct child in turn, this many seconds apart. Great for lists and grids.'
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
    description: 'Fade in when the content scrolls into view, or right away.'
  },
  {
    name: 'once',
    type: 'boolean',
    default: 'true',
    description: 'Fades in once. Turn off to fade back out whenever the content scrolls back below the view.'
  },
  {
    name: 'exit',
    type: 'boolean',
    default: 'false',
    description: 'Fades the content back out as it scrolls off the top, and in again when it comes back.'
  },
  {
    name: 'scrub',
    type: 'boolean | number',
    default: 'false',
    description: 'Ties the fade to the scroll position instead of playing it. A number smooths it, in seconds.'
  },
  {
    name: 'disappearAfter',
    type: 'number',
    default: '0',
    description: 'Fades the content out again this many seconds after it appears. 0 keeps it shown.'
  },
  {
    name: 'disappearDuration',
    type: 'number',
    default: '0.5',
    description: 'Length of the fade out, in seconds.'
  },
  { name: 'disappearEase', type: 'string', default: "'power2.in'", description: 'GSAP ease of the fade out.' },
  { name: '@start', type: '() => void', default: '-', description: 'Emitted when the fade starts.' },
  { name: '@complete', type: '() => void', default: '-', description: 'Emitted when the fade finishes.' },
  {
    name: '@disappearance-complete',
    type: '() => void',
    default: '-',
    description: 'Emitted when the fade out finishes.'
  },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the wrapper.' },
  { name: 'style', type: 'StyleValue', default: '-', description: 'Inline styles for the wrapper.' }
];

const { rerenderKey, forceRerender } = useForceRerender();
const { props, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);

const settings = computed(() => {
  const { demo: _demo, preset: _preset, smoothScroll: _smoothScroll, ...rest } = props.value;
  return rest;
});

const theme = useColorModeValue('light', 'dark');
const ink = computed(() => INK[theme.value as 'light' | 'dark']);
const scrolling = computed(() => props.value.demo === 'journal');
const fade = computed(() =>
  scrolling.value ? settings.value : { ...settings.value, exit: false, scrub: false as boolean | number }
);

const sceneKey = computed(() => `${props.value.demo}-${rerenderKey.value}`);
const scroller = shallowRef<HTMLElement | null>(null);
const setScroller = (el: unknown) => {
  scroller.value = (el as HTMLElement | null) ?? null;
};
watch(
  sceneKey,
  () => {
    scroller.value = null;
  },
  { flush: 'sync' }
);
const journalFade = computed(() => ({ ...fade.value, container: scroller.value }));

useSmoothScroll(scroller, () => props.value.smoothScroll && scrolling.value);

const frameStyle = ({ h, ratio, radius = '22px' }: { h?: string; ratio?: string; radius?: string }): CSSProperties => ({
  position: 'relative',
  width: '100%',
  height: h,
  aspectRatio: ratio,
  borderRadius: radius,
  overflow: 'hidden',
  boxShadow: ink.value.rim
});

const imgStyle = (position = '50% 50%'): CSSProperties => ({
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  objectPosition: position
});

const applyPreset = (value: string) => {
  updateProps({ ...LOOK, ...PRESETS[value], preset: value });
  forceRerender();
};
</script>
