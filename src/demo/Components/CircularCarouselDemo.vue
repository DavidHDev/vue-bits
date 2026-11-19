<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
  >
    <TabsLayout>
      <template #preview>
        <div class="demo-container relative overflow-hidden" style="height: 560px; padding: 0">
          <CircularCarousel
            :key="rerenderKey"
            :preset="props.preset"
            :intro="props.intro"
            :aspect-ratio="props.aspectRatio"
            :card-width="props.cardWidth"
            :gap="props.gap"
            :tilt="props.tilt"
            :curve="props.curve"
            :perspective="props.perspective"
            :autoplay="props.autoplay"
            :speed="props.speed"
            :interval="props.interval"
            :direction="props.direction"
            :momentum="props.momentum"
            :snap="props.snap"
            :pause-on-hover="props.pauseOnHover"
            :focus-on-click="props.focusOnClick"
            :draggable="props.draggable"
            :parallax="props.parallax"
            :stretch="props.stretch"
            :fade-color="renderedFade"
            :depth-fade="props.depthFade"
            :inner-shade="props.innerShade"
            :corner-radius="props.cornerRadius"
            :captions="props.captions"
          />
          <RefreshButton @click="forceRerender" />
        </div>

        <Customize>
          <PreviewSelect
            title="Preset"
            :options="PRESET_OPTIONS"
            :model-value="props.preset"
            @update:model-value="value => choosePreset(value as CircularCarouselPreset)"
          />
          <PreviewSelect
            title="Intro"
            :options="INTRO_OPTIONS"
            :model-value="props.intro"
            @update:model-value="value => chooseIntro(value as CircularCarouselIntro)"
          />
          <PreviewSelect
            title="Aspect"
            :options="ASPECT_OPTIONS"
            :model-value="props.aspectRatio"
            @update:model-value="value => updateProp('aspectRatio', Number(value))"
          />
          <PreviewSlider
            title="Card Width"
            :min="140"
            :max="320"
            :step="2"
            value-unit="px"
            :model-value="props.cardWidth"
            @update:model-value="value => updateProp('cardWidth', value)"
          />
          <PreviewSlider
            title="Gap"
            :min="0"
            :max="96"
            :step="1"
            value-unit="px"
            :model-value="props.gap"
            @update:model-value="value => updateProp('gap', value)"
          />
          <PreviewSlider
            title="Curve"
            :min="0"
            :max="1"
            :step="0.01"
            :is-disabled="props.preset === 'orbit'"
            :model-value="props.curve"
            @update:model-value="value => updateProp('curve', value)"
          />
          <PreviewSlider
            title="Tilt"
            :min="-40"
            :max="40"
            :step="1"
            value-unit="°"
            :model-value="props.tilt"
            @update:model-value="value => updateProp('tilt', value)"
          />
          <PreviewSlider
            title="Perspective"
            :min="600"
            :max="3200"
            :step="20"
            value-unit="px"
            :is-disabled="props.preset === 'panorama'"
            :model-value="props.perspective"
            @update:model-value="value => updateProp('perspective', value)"
          />

          <PreviewSelect
            title="Autoplay"
            :options="AUTOPLAY_OPTIONS"
            :model-value="props.autoplay"
            @update:model-value="value => updateProp('autoplay', value as CircularCarouselAutoplay)"
          />
          <PreviewSlider
            title="Speed"
            :min="0"
            :max="60"
            :step="1"
            value-unit="°/s"
            :is-disabled="props.autoplay !== 'drift'"
            :model-value="props.speed"
            @update:model-value="value => updateProp('speed', value)"
          />
          <PreviewSlider
            title="Interval"
            :min="1"
            :max="8"
            :step="0.5"
            value-unit="s"
            :is-disabled="props.autoplay !== 'step'"
            :model-value="props.interval"
            @update:model-value="value => updateProp('interval', value)"
          />
          <PreviewSelect
            title="Direction"
            :options="DIRECTION_OPTIONS"
            :model-value="props.direction"
            @update:model-value="value => updateProp('direction', value as 'left' | 'right')"
          />
          <PreviewSlider
            title="Momentum"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="props.momentum"
            @update:model-value="value => updateProp('momentum', value)"
          />
          <PreviewSlider
            title="Parallax"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="props.parallax"
            @update:model-value="value => updateProp('parallax', value)"
          />
          <PreviewSlider
            title="Stretch"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="props.stretch"
            @update:model-value="value => updateProp('stretch', value)"
          />
          <PreviewSwitch
            title="Snap"
            :model-value="props.snap"
            @update:model-value="value => updateProp('snap', value)"
          />
          <PreviewSwitch
            title="Pause On Hover"
            :model-value="props.pauseOnHover"
            @update:model-value="value => updateProp('pauseOnHover', value)"
          />
          <PreviewSwitch
            title="Focus On Click"
            :model-value="props.focusOnClick"
            @update:model-value="value => updateProp('focusOnClick', value)"
          />
          <PreviewSwitch
            title="Draggable"
            :model-value="props.draggable"
            @update:model-value="value => updateProp('draggable', value)"
          />

          <PreviewColorPickerCustom
            title="Fade Color"
            :color="renderedFade"
            @change="value => updateProp('fadeColor', value)"
          />
          <PreviewSlider
            title="Depth Fade"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="props.depthFade"
            @update:model-value="value => updateProp('depthFade', value)"
          />
          <PreviewSlider
            title="Inner Shade"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="props.innerShade"
            @update:model-value="value => updateProp('innerShade', value)"
          />
          <PreviewSlider
            title="Corner Radius"
            :min="0"
            :max="40"
            :step="1"
            value-unit="px"
            :model-value="props.cornerRadius"
            @update:model-value="value => updateProp('cornerRadius', value)"
          />
          <PreviewSwitch
            title="Captions"
            :model-value="props.captions"
            @update:model-value="value => updateProp('captions', value)"
          />
        </Customize>

        <PropTable :data="propData" />
        <Dependencies :dependency-list="[]" />
      </template>

      <template #code>
        <CodeExample :code-object="circularCarousel" component-name="CircularCarousel" />
      </template>
    </TabsLayout>
  </ComponentPropsProvider>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import CodeExample from '@/components/common/CodeExample.vue';
import Customize from '@/components/common/Customize.vue';
import Dependencies from '@/components/common/Dependencies.vue';
import PreviewColorPickerCustom from '@/components/common/PreviewColorPickerCustom.vue';
import PreviewSelect from '@/components/common/PreviewSelect.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import RefreshButton from '@/components/common/RefreshButton.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import ComponentPropsProvider from '@/components/context/ComponentPropsProvider.vue';
import { useComponentProps } from '@/composables/useComponentProps';
import { useForceRerender } from '@/composables/useForceRerender';
import { useColorMode } from '@/composables/useTheme';
import { circularCarousel } from '@/constants/code/Components/circularCarouselCode';
import CircularCarousel, {
  type CircularCarouselAutoplay,
  type CircularCarouselIntro,
  type CircularCarouselPreset
} from '@/content/Components/CircularCarousel/CircularCarousel.vue';

const PRESETS: Record<
  CircularCarouselPreset,
  { tilt: number; curve: number; perspective: number; aspectRatio: number }
> = {
  cylinder: { tilt: -5, curve: 1, perspective: 2500, aspectRatio: 1 },
  orbit: { tilt: -16, curve: 0, perspective: 1500, aspectRatio: 0.75 },
  wheel: { tilt: 0, curve: 0, perspective: 1800, aspectRatio: 1.333 },
  panorama: { tilt: 0, curve: 1, perspective: 1800, aspectRatio: 0.75 }
};

const PRESET_OPTIONS = [
  { label: 'Cylinder', value: 'cylinder' },
  { label: 'Orbit', value: 'orbit' },
  { label: 'Wheel', value: 'wheel' },
  { label: 'Panorama', value: 'panorama' }
];

const INTRO_OPTIONS = [
  { label: 'Assemble', value: 'assemble' },
  { label: 'Rise', value: 'rise' },
  { label: 'Spin', value: 'spin' },
  { label: 'None', value: 'none' }
];

const ASPECT_OPTIONS = [
  { label: 'Portrait', value: 0.75 },
  { label: 'Square', value: 1 },
  { label: 'Landscape', value: 1.333 },
  { label: 'Tall', value: 0.5625 }
];

const AUTOPLAY_OPTIONS = [
  { label: 'Drift', value: 'drift' },
  { label: 'Step', value: 'step' },
  { label: 'Off', value: 'off' }
];

const DIRECTION_OPTIONS = [
  { label: 'Left', value: 'left' },
  { label: 'Right', value: 'right' }
];

const DEFAULT_FADE = '#000000';

const DEFAULT_PROPS = {
  preset: 'cylinder' as CircularCarouselPreset,
  intro: 'rise' as CircularCarouselIntro,
  cardWidth: 220,
  gap: 25,
  ...PRESETS.cylinder,
  autoplay: 'drift' as CircularCarouselAutoplay,
  speed: 14,
  interval: 3,
  direction: 'left' as 'left' | 'right',
  momentum: 0.6,
  snap: true,
  pauseOnHover: true,
  focusOnClick: true,
  draggable: true,
  parallax: 0.3,
  stretch: 0.5,
  fadeColor: DEFAULT_FADE,
  depthFade: 0.55,
  innerShade: 0.6,
  cornerRadius: 12,
  captions: false
};

const { rerenderKey, forceRerender } = useForceRerender();
const { props, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);
const { isLight } = useColorMode();

const renderedFade = computed(() => {
  const fade = props.value.fadeColor;
  if (fade !== DEFAULT_FADE) return fade;
  return isLight.value ? '#ffffff' : '#111111';
});

const choosePreset = (value: CircularCarouselPreset) => {
  updateProps({ preset: value, ...(PRESETS[value] || PRESETS.cylinder) });
  forceRerender();
};

const chooseIntro = (value: CircularCarouselIntro) => {
  updateProp('intro', value);
  forceRerender();
};

const propData: PropRow[] = [
  {
    name: 'items',
    type: 'Array<{ src: string; alt?: string; title?: string; subtitle?: string }>',
    default: '10 sample photos',
    description:
      'Images placed around the ring. The alt text is announced to screen readers, the title and optional subtitle are shown by captions. Passing a new list of the same length crossfades each card to its new image.'
  },
  {
    name: 'preset',
    type: "'cylinder' | 'orbit' | 'wheel' | 'panorama'",
    default: "'cylinder'",
    description:
      'Shape of the ring. Cylinder faces the cards outward, orbit keeps every card turned toward you, wheel spins top to bottom, and panorama puts the camera inside the ring.'
  },
  {
    name: 'intro',
    type: "'assemble' | 'rise' | 'spin' | 'none'",
    default: "'rise'",
    description:
      'Entrance once the images load. Assemble glides the cards in from a wider ring, rise slides them in one by one from the edge of the frame, and spin lands a fast turn.'
  },
  {
    name: 'cardWidth',
    type: 'number',
    default: '220',
    description: 'Card width in px. The whole ring scales down to fit its container when it needs to.'
  },
  {
    name: 'aspectRatio',
    type: 'number',
    default: '1',
    description: 'Card width divided by its height. Images are cropped to fill the card.'
  },
  { name: 'gap', type: 'number', default: '25', description: 'Space between neighbouring cards, in px.' },
  {
    name: 'curve',
    type: 'number',
    default: 'from preset',
    description: 'How far the cards bend to follow the ring, from flat at 0 to fully wrapped at 1. Ignored by orbit.'
  },
  {
    name: 'tilt',
    type: 'number',
    default: 'from preset',
    description: 'Camera angle in degrees. Negative values look down onto the ring.'
  },
  {
    name: 'perspective',
    type: 'number',
    default: 'from preset',
    description:
      'Camera distance in px. Lower values exaggerate depth. Panorama sets its own, since the camera sits at the centre.'
  },
  {
    name: 'autoplay',
    type: "'drift' | 'step' | 'off'",
    default: "'drift'",
    description:
      'Drift turns the ring continuously, step moves one card at a time and settles on it, off only moves when you do.'
  },
  { name: 'speed', type: 'number', default: '14', description: 'Drift speed in degrees per second.' },
  { name: 'interval', type: 'number', default: '3', description: 'Seconds between moves in step mode.' },
  {
    name: 'direction',
    type: "'left' | 'right'",
    default: "'left'",
    description:
      'Which way the front cards travel. A flick changes it to the way you threw the ring. On the wheel, left means up.'
  },
  {
    name: 'draggable',
    type: 'boolean',
    default: 'true',
    description: 'Lets you grab and throw the ring with a mouse, finger or horizontal trackpad scroll.'
  },
  {
    name: 'momentum',
    type: 'number',
    default: '0.6',
    description: 'How long a throw keeps gliding before it blends back into the autoplay speed, from 0 to 1.'
  },
  {
    name: 'snap',
    type: 'boolean',
    default: 'true',
    description: 'Settles on a card whenever the ring comes to rest.'
  },
  {
    name: 'pauseOnHover',
    type: 'boolean',
    default: 'true',
    description: 'Eases the ring to a stop while the pointer is over it.'
  },
  {
    name: 'focusOnClick',
    type: 'boolean',
    default: 'true',
    description: 'Clicking a card turns it to the front.'
  },
  {
    name: 'parallax',
    type: 'number',
    default: '0.3',
    description: 'How much the camera leans toward the pointer, from 0 to 1.'
  },
  {
    name: 'stretch',
    type: 'number',
    default: '0.5',
    description: 'How much the ring swells outward when it spins fast, from 0 to 1.'
  },
  {
    name: 'depthFade',
    type: 'number',
    default: '0.55',
    description: 'How strongly cards fade into fadeColor as they turn away, from 0 to 1.'
  },
  {
    name: 'fadeColor',
    type: 'string',
    default: "'#000000'",
    description: 'Color distant cards fade toward. Match it to the background behind the carousel.'
  },
  {
    name: 'innerShade',
    type: 'number',
    default: '0.6',
    description: 'Brightness of the inside faces seen through the back of the ring, from 0 to 1.'
  },
  { name: 'cornerRadius', type: 'number', default: '12', description: 'Corner radius of the cards, in px.' },
  {
    name: 'captions',
    type: 'boolean',
    default: 'false',
    description: 'Shows the front card title, subtitle and position under the ring.'
  },
  {
    name: 'onChange',
    type: '(index: number) => void',
    default: '-',
    description: 'Called when a different card reaches the front.'
  },
  {
    name: 'onItemClick',
    type: '(item, index: number) => void',
    default: '-',
    description: 'Called when a card is clicked, or when Enter is pressed on the carousel.'
  },
  { name: 'className', type: 'string', default: "''", description: 'Extra classes on the container.' },
  { name: 'style', type: 'CSSProperties', default: '-', description: 'Inline styles on the container.' }
];
</script>
