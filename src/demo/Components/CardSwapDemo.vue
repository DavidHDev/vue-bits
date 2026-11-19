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
        <div class="demo-container relative h-[460px] overflow-hidden md:h-[600px]" style="padding: 0">
          <CardSwap :key="rerenderKey" :items="ITEMS[theme]" v-bind="settings" :theme="theme" />
          <RefreshButton @click="forceRerender" />
        </div>

        <Customize>
          <PreviewSelect
            title="Preset"
            :options="PRESET_OPTIONS"
            :model-value="props.preset"
            @update:model-value="applyPreset"
          />
          <PreviewSlider
            title="Card Distance"
            :min="0"
            :max="120"
            :step="2"
            value-unit="px"
            :model-value="settings.cardDistance"
            @update:model-value="value => updateProp('cardDistance', value)"
          />
          <PreviewSlider
            title="Vertical Distance"
            :min="0"
            :max="120"
            :step="2"
            value-unit="px"
            :model-value="settings.verticalDistance"
            @update:model-value="value => updateProp('verticalDistance', value)"
          />
          <PreviewSlider
            title="Depth"
            :min="0"
            :max="200"
            :step="5"
            value-unit="px"
            :model-value="settings.depth"
            @update:model-value="value => updateProp('depth', value)"
          />
          <PreviewSlider
            title="Skew"
            :min="-12"
            :max="12"
            :step="1"
            value-unit="°"
            :model-value="settings.skewAmount"
            @update:model-value="value => updateProp('skewAmount', value)"
          />
          <PreviewSlider
            title="Visible Cards"
            :min="1"
            :max="4"
            :step="1"
            :model-value="settings.visibleCards"
            @update:model-value="value => updateProp('visibleCards', value)"
          />
          <PreviewSlider
            title="Card Radius"
            :min="0"
            :max="32"
            :step="1"
            value-unit="px"
            :model-value="settings.cardRadius"
            @update:model-value="value => updateProp('cardRadius', value)"
          />
          <PreviewSlider
            title="Delay"
            :min="1500"
            :max="8000"
            :step="250"
            value-unit="ms"
            :model-value="settings.delay"
            @update:model-value="value => updateProp('delay', value)"
          />
          <PreviewSlider
            title="Speed"
            :min="0.3"
            :max="2"
            :step="0.05"
            :model-value="settings.speed"
            @update:model-value="value => updateProp('speed', value)"
          />
          <PreviewSlider
            title="Bounce"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.bounce"
            @update:model-value="value => updateProp('bounce', value)"
          />
          <PreviewSlider
            title="Parallax"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.parallax"
            @update:model-value="value => updateProp('parallax', value)"
          />
          <PreviewSlider
            title="Hover Spread"
            :min="0"
            :max="0.4"
            :step="0.01"
            :model-value="settings.hoverSpread"
            @update:model-value="value => updateProp('hoverSpread', value)"
          />
          <PreviewSlider
            title="Dim"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.dim"
            @update:model-value="value => updateProp('dim', value)"
          />
          <PreviewSwitch
            title="Autoplay"
            :model-value="settings.autoplay"
            @update:model-value="value => updateProp('autoplay', value)"
          />
          <PreviewSwitch
            title="Pause On Hover"
            :model-value="settings.pauseOnHover"
            @update:model-value="value => updateProp('pauseOnHover', value)"
          />
          <PreviewSwitch
            title="Draggable"
            :model-value="settings.draggable"
            @update:model-value="value => updateProp('draggable', value)"
          />
        </Customize>

        <PropTable :data="propData" />
        <Dependencies :dependency-list="['@hugeicons/vue', '@hugeicons/core-free-icons']" />
      </template>

      <template #code>
        <CodeExample :code-object="cardSwap" component-name="CardSwap" />
      </template>
    </TabsLayout>
  </ComponentPropsProvider>
</template>

<script setup lang="ts">
import { computed, h } from 'vue';
import { HugeiconsIcon } from '@hugeicons/vue';
import { BridgeIcon, CloudIcon, Moon02Icon, PlantIcon, StarsIcon, SunsetIcon } from '@hugeicons/core-free-icons';
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
import { useColorModeValue } from '@/composables/useTheme';
import { cardSwap } from '@/constants/code/Components/cardSwapCode';
import CardSwap, { type CardSwapItem } from '@/content/Components/CardSwap/CardSwap.vue';

type Preset = 'stack' | 'flat' | 'tower' | 'fan' | 'calm';

const icon = (glyph: typeof StarsIcon) => () => h(HugeiconsIcon, { icon: glyph, size: 14, strokeWidth: 1.8 });
const CLOUDS = 'https://images.unsplash.com/photo-1778849097774-0ab2a873a858?w=900&q=80&auto=format&fit=crop';

const ITEMS: Record<'dark' | 'light', CardSwapItem[]> = {
  dark: [
    { title: 'Blue hour', image: '/assets/demo/night-sky.webp', icon: icon(StarsIcon) },
    { title: 'Moonrise', image: '/assets/demo/night-landscape.webp', icon: icon(Moon02Icon) },
    { title: 'Dusk', image: '/assets/demo/night-portrait.webp', icon: icon(BridgeIcon) },
    { title: 'Pink drift', image: CLOUDS, icon: icon(CloudIcon) }
  ],
  light: [
    { title: 'Golden hour', image: '/assets/demo/day-sky.webp', icon: icon(SunsetIcon) },
    { title: 'Canola field', image: '/assets/demo/day-landscape.webp', icon: icon(PlantIcon) },
    { title: 'The pier', image: '/assets/demo/day-portrait.webp', icon: icon(BridgeIcon) },
    { title: 'Pink drift', image: CLOUDS, icon: icon(CloudIcon) }
  ]
};

const LOOK = {
  cardDistance: 60,
  verticalDistance: 70,
  depth: 90,
  skewAmount: 6,
  visibleCards: 4,
  cardRadius: 18
};

const DEFAULT_PROPS = {
  preset: 'stack' as Preset,
  ...LOOK,
  delay: 4000,
  speed: 1,
  bounce: 0.35,
  parallax: 0.5,
  hoverSpread: 0.12,
  dim: 0.5,
  autoplay: true,
  pauseOnHover: true,
  draggable: true
};

const PRESETS: Record<Preset, Partial<typeof DEFAULT_PROPS>> = {
  stack: LOOK,
  flat: { ...LOOK, skewAmount: 0, cardDistance: 50, verticalDistance: 46, depth: 80 },
  tower: { ...LOOK, skewAmount: 0, cardDistance: 0, verticalDistance: 56, depth: 100 },
  fan: { ...LOOK, cardDistance: 96, verticalDistance: 26, depth: 70, skewAmount: 10 },
  calm: { ...LOOK, speed: 0.6, bounce: 0, delay: 6000, hoverSpread: 0 }
};

const PRESET_OPTIONS = [
  { value: 'stack', label: 'Stack' },
  { value: 'flat', label: 'Flat' },
  { value: 'tower', label: 'Tower' },
  { value: 'fan', label: 'Fan' },
  { value: 'calm', label: 'Calm' }
];

const propData: PropRow[] = [
  {
    name: 'items',
    type: 'CardSwapItem[]',
    default: 'Sample cards',
    description: 'Cards to show when no slot content is passed. Each item takes title, image, icon and alt.'
  },
  {
    name: 'default slot',
    type: 'VNode[]',
    default: 'undefined',
    description: 'Your own cards. Wrap each one in the exported Card to get the matching tile style.'
  },
  { name: 'width', type: 'number', default: '460', description: 'Width of each card, in px.' },
  { name: 'height', type: 'number', default: '340', description: 'Height of each card, in px.' },
  { name: 'cardDistance', type: 'number', default: '60', description: 'Horizontal step between stacked cards, in px.' },
  {
    name: 'verticalDistance',
    type: 'number',
    default: '70',
    description: 'Vertical step between stacked cards, in px.'
  },
  {
    name: 'depth',
    type: 'number',
    default: '90',
    description: 'How far back each card sits, in px. More depth makes the cards behind smaller.'
  },
  { name: 'skewAmount', type: 'number', default: '6', description: 'Slant of the cards, in degrees.' },
  {
    name: 'visibleCards',
    type: 'number',
    default: '4',
    description: 'How many cards show in the stack. Extra cards wait hidden at the back.'
  },
  { name: 'delay', type: 'number', default: '4000', description: 'Time between swaps, in ms.' },
  { name: 'autoplay', type: 'boolean', default: 'true', description: 'Sends the front card to the back on a timer.' },
  {
    name: 'pauseOnHover',
    type: 'boolean',
    default: 'true',
    description: 'Pauses the timer while the cursor is over a card.'
  },
  {
    name: 'draggable',
    type: 'boolean',
    default: 'true',
    description: 'Lets people drag or fling the front card to send it to the back.'
  },
  { name: 'speed', type: 'number', default: '1', description: 'Speed of the swap animation.' },
  {
    name: 'bounce',
    type: 'number',
    default: '0.35',
    description: 'How much the cards overshoot as they settle, from 0 to 1.'
  },
  {
    name: 'parallax',
    type: 'number',
    default: '0.5',
    description: 'How much the stack shifts in depth as the cursor moves, from 0 to 1.'
  },
  { name: 'hoverSpread', type: 'number', default: '0.12', description: 'How much the stack fans out while hovered.' },
  { name: 'dim', type: 'number', default: '0.5', description: 'How much the cards behind fade back, from 0 to 1.' },
  { name: 'cardRadius', type: 'number', default: '18', description: 'Corner radius of the cards, in px.' },
  { name: 'intro', type: 'boolean', default: 'true', description: 'Fans the cards out from the front one on mount.' },
  { name: 'theme', type: "'dark' | 'light'", default: "'dark'", description: 'Color theme of the cards.' },
  {
    name: 'onCardClick',
    type: '(index: number) => void',
    default: 'undefined',
    description: 'Called when a card is clicked. Clicking a card behind also brings it to the front.'
  },
  {
    name: 'onChange',
    type: '(index: number) => void',
    default: 'undefined',
    description: 'Called with the index of the new front card after each swap.'
  },
  {
    name: 'ref',
    type: '{ next, prev }',
    default: 'undefined',
    description: 'Call next() or prev() to swap from your own controls.'
  },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the container.' }
];

const { rerenderKey, forceRerender } = useForceRerender();
const { props, defaultProps, updateProps, updateProp, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);
const theme = useColorModeValue<'light' | 'dark'>('light', 'dark');

const settings = computed(() => {
  const { preset: _preset, ...rest } = props.value;
  void _preset;
  return rest;
});

const computedProps = computed(() => (theme.value === 'light' ? { theme: 'light' } : {}));

const applyPreset = (value: string | number) => {
  const preset = value as Preset;
  const base = Object.fromEntries(
    Object.keys(DEFAULT_PROPS).map(name => [name, defaultProps.value[name as keyof typeof DEFAULT_PROPS]])
  ) as typeof DEFAULT_PROPS;
  updateProps({ ...base, ...PRESETS[preset], preset });
};
</script>
