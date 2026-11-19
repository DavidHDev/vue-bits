<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
    :demo-only-props="['preset']"
    :computed-props="computedProps"
  >
    <TabsLayout>
      <template #preview>
        <div class="demo-container relative overflow-hidden" style="height: 560px; padding: 0">
          <Carousel :key="props.preset" v-bind="settings" :items="items" :theme="theme" />
        </div>

        <Customize>
          <PreviewSelect
            title="Preset"
            :options="PRESET_OPTIONS"
            :model-value="props.preset"
            @update:model-value="value => applyPreset(String(value))"
          />
          <PreviewSelect
            title="Effect"
            :options="EFFECT_OPTIONS"
            :model-value="props.effect"
            @update:model-value="value => updateProp('effect', value as Effect)"
          />
          <PreviewSelect
            title="Indicator"
            :options="INDICATOR_OPTIONS"
            :model-value="props.indicator"
            @update:model-value="value => updateProp('indicator', value as Indicator)"
          />
          <PreviewSlider
            title="Width"
            :min="240"
            :max="720"
            :step="10"
            value-unit="px"
            :model-value="props.baseWidth"
            @update:model-value="value => updateProp('baseWidth', value)"
          />
          <PreviewSlider
            title="Aspect Ratio"
            :min="0.5"
            :max="2"
            :step="0.05"
            :model-value="props.aspectRatio"
            @update:model-value="value => updateProp('aspectRatio', value)"
          />
          <PreviewSlider
            title="Peek"
            :min="0"
            :max="120"
            :step="4"
            value-unit="px"
            :model-value="props.peek"
            @update:model-value="value => updateProp('peek', value)"
          />
          <PreviewSlider
            title="Gap"
            :min="0"
            :max="48"
            :step="2"
            value-unit="px"
            :model-value="props.gap"
            @update:model-value="value => updateProp('gap', value)"
          />
          <PreviewSlider
            title="Radius"
            :min="0"
            :max="32"
            :step="1"
            value-unit="px"
            :model-value="props.radius"
            @update:model-value="value => updateProp('radius', value)"
          />
          <PreviewSlider
            title="Delay"
            :min="1000"
            :max="8000"
            :step="250"
            value-unit="ms"
            :is-disabled="!props.autoplay"
            :model-value="props.autoplayDelay"
            @update:model-value="value => updateProp('autoplayDelay', value)"
          />
          <PreviewSwitch
            title="Frame"
            :model-value="props.frame"
            @update:model-value="value => updateProp('frame', value)"
          />
          <PreviewSwitch
            title="Arrows"
            :model-value="props.arrows"
            @update:model-value="value => updateProp('arrows', value)"
          />
          <PreviewSwitch
            title="Loop"
            :model-value="props.loop"
            @update:model-value="value => updateProp('loop', value)"
          />
          <PreviewSwitch
            title="Autoplay"
            :model-value="props.autoplay"
            @update:model-value="value => updateProp('autoplay', value)"
          />
          <PreviewSwitch
            title="Pause On Hover"
            :is-disabled="!props.autoplay"
            :model-value="props.pauseOnHover"
            @update:model-value="value => updateProp('pauseOnHover', value)"
          />
          <PreviewSwitch
            title="Draggable"
            :model-value="props.draggable"
            @update:model-value="value => updateProp('draggable', value)"
          />
          <PreviewSwitch
            title="Round"
            :model-value="props.round"
            @update:model-value="value => updateProp('round', value)"
          />
        </Customize>

        <PropTable :data="propData" />
        <Dependencies :dependency-list="['@hugeicons/vue', '@hugeicons/core-free-icons']" />
      </template>

      <template #code>
        <CodeExample :code-object="carousel" component-name="Carousel" />
      </template>
    </TabsLayout>
  </ComponentPropsProvider>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import CodeExample from '@/components/common/CodeExample.vue';
import Customize from '@/components/common/Customize.vue';
import Dependencies from '@/components/common/Dependencies.vue';
import PreviewSelect from '@/components/common/PreviewSelect.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import ComponentPropsProvider from '@/components/context/ComponentPropsProvider.vue';
import { useComponentProps } from '@/composables/useComponentProps';
import { useColorModeValue } from '@/composables/useTheme';
import { carousel } from '@/constants/code/Components/carouselCode';
import Carousel, { DEFAULT_ITEMS, type CarouselItem } from '@/content/Components/Carousel/Carousel.vue';

type Preset = 'features' | 'highlights' | 'stories';
type Effect = 'tilt' | 'slide' | 'scale' | 'fade' | 'cube';
type Indicator = 'dots' | 'bars' | 'counter' | 'none';

const CLOUDS = 'https://images.unsplash.com/photo-1778849097774-0ab2a873a858?w=1200&q=80&auto=format&fit=crop';

const PHOTOS: CarouselItem[] = [
  {
    id: 1,
    image: '/assets/demo/day-landscape.webp',
    title: 'Open fields',
    description: 'Bright skies over rapeseed in full bloom.'
  },
  {
    id: 2,
    image: '/assets/demo/night-landscape.webp',
    title: 'Moonrise',
    description: 'The same field, quiet under a full moon.'
  },
  { id: 3, image: CLOUDS, title: 'Above the clouds', description: 'Soft light from the window seat.' },
  {
    id: 4,
    image: '/assets/demo/day-portrait.webp',
    title: 'The pier',
    description: 'Clear water and a long walk out.'
  },
  {
    id: 5,
    image: '/assets/demo/night-portrait.webp',
    title: 'Last light',
    description: 'Pink skies as the lamps come on.'
  }
];

const STORIES = [PHOTOS[3], PHOTOS[4], PHOTOS[0], PHOTOS[1], PHOTOS[2]];

const DEFAULT_PROPS = {
  preset: 'features' as Preset,
  baseWidth: 300,
  aspectRatio: 1.25,
  peek: 0,
  gap: 16,
  radius: 12,
  frame: true,
  effect: 'tilt' as Effect,
  indicator: 'dots' as Indicator,
  arrows: false,
  autoplay: false,
  autoplayDelay: 3000,
  pauseOnHover: false,
  loop: false,
  draggable: true,
  round: false
};

const PRESETS: Record<Preset, Partial<typeof DEFAULT_PROPS>> = {
  features: {},
  highlights: {
    baseWidth: 640,
    aspectRatio: 1.6,
    peek: 64,
    radius: 20,
    frame: false,
    effect: 'scale',
    indicator: 'bars',
    arrows: true,
    autoplay: true,
    autoplayDelay: 4000,
    pauseOnHover: true,
    loop: true
  },
  stories: {
    baseWidth: 270,
    aspectRatio: 0.62,
    radius: 18,
    frame: false,
    effect: 'cube',
    indicator: 'bars',
    autoplay: true,
    autoplayDelay: 5000,
    loop: true
  }
};

const PRESET_OPTIONS = [
  { value: 'features', label: 'Features' },
  { value: 'highlights', label: 'Highlights' },
  { value: 'stories', label: 'Stories' }
];

const EFFECT_OPTIONS = [
  { value: 'tilt', label: 'Tilt' },
  { value: 'slide', label: 'Slide' },
  { value: 'scale', label: 'Scale' },
  { value: 'fade', label: 'Fade' },
  { value: 'cube', label: 'Cube' }
];

const INDICATOR_OPTIONS = [
  { value: 'dots', label: 'Dots' },
  { value: 'bars', label: 'Bars' },
  { value: 'counter', label: 'Counter' },
  { value: 'none', label: 'None' }
];

const propData: PropRow[] = [
  {
    name: 'items',
    type: 'Array<CarouselItem | string | VNode | Component>',
    default: 'DEFAULT_ITEMS',
    description:
      'Cards to show. Objects with image, icon, title, description and alt get the built-in card, strings are used as image URLs and Vue components or VNodes are rendered as they are.'
  },
  {
    name: 'baseWidth',
    type: 'number | string',
    default: '300',
    description: 'Width of the carousel in px, or any CSS width. It never grows past its container.'
  },
  { name: 'aspectRatio', type: 'number', default: '1.25', description: 'Width of a card divided by its height.' },
  {
    name: 'peek',
    type: 'number',
    default: '0',
    description: 'Space on each side of the active card where the neighbours show, in px. Works with slide and scale.'
  },
  { name: 'gap', type: 'number', default: '16', description: 'Space between the cards in px.' },
  { name: 'radius', type: 'number', default: '12', description: 'Corner radius of the cards in px.' },
  {
    name: 'frame',
    type: 'boolean',
    default: 'true',
    description:
      'Holds the cards and controls in a panel that masks the cards as they slide out. Without it the cards fade out at the edges.'
  },
  {
    name: 'effect',
    type: "'tilt' | 'slide' | 'scale' | 'fade' | 'cube'",
    default: "'tilt'",
    description: 'How the cards move from one to the next.'
  },
  {
    name: 'indicator',
    type: "'dots' | 'bars' | 'counter' | 'none'",
    default: "'dots'",
    description: 'Navigation under the cards. Bars fill up with the autoplay timer.'
  },
  { name: 'arrows', type: 'boolean', default: 'false', description: 'Shows previous and next buttons.' },
  { name: 'autoplay', type: 'boolean', default: 'false', description: 'Moves to the next card on a timer.' },
  {
    name: 'autoplayDelay',
    type: 'number',
    default: '3000',
    description: 'Time on each card in ms while autoplay is on.'
  },
  {
    name: 'pauseOnHover',
    type: 'boolean',
    default: 'false',
    description: 'Pauses autoplay while the pointer is over the carousel.'
  },
  {
    name: 'loop',
    type: 'boolean',
    default: 'false',
    description: 'Wraps around from the last card to the first and back.'
  },
  {
    name: 'draggable',
    type: 'boolean',
    default: 'true',
    description: 'Lets people drag, swipe or scroll sideways through the cards.'
  },
  { name: 'round', type: 'boolean', default: 'false', description: 'Turns the cards into circles.' },
  { name: 'initialIndex', type: 'number', default: '0', description: 'Card shown first.' },
  {
    name: 'theme',
    type: "'dark' | 'light'",
    default: "'dark'",
    description: 'Color scheme of the cards, frame and controls.'
  },
  {
    name: '@change',
    type: '(index: number) => void',
    default: '-',
    description: 'Emitted with the index of the new card whenever it changes.'
  },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the carousel.' },
  { name: 'style', type: 'CSSProperties', default: '-', description: 'Inline styles for the carousel.' }
];

const { props, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);
const theme = useColorModeValue<'light' | 'dark'>('light', 'dark');

const settings = computed(() => {
  const { preset, ...rest } = props.value;
  void preset;
  return rest;
});

const items = computed(() =>
  props.value.preset === 'highlights' ? PHOTOS : props.value.preset === 'stories' ? STORIES : DEFAULT_ITEMS
);

const computedProps = computed(() => (theme.value === 'light' ? { theme: 'light' } : {}));

const applyPreset = (value: string) => {
  updateProps({ ...DEFAULT_PROPS, ...PRESETS[value as Preset], preset: value as Preset });
};
</script>
