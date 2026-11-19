<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
    :demo-only-props="['demo', 'preset']"
  >
    <TabsLayout>
      <template #preview>
        <div class="demo-container relative overflow-hidden" style="height: 500px; padding: 0">
          <RefreshButton @click="forceRerender" />
          <div :key="`${rerenderKey}-${props.demo}`" class="tcd-scene" :data-theme="theme">
            <div v-if="props.demo === 'album'" class="tcd-album">
              <TiltedCard
                :image-src="PHOTOS[theme].sky"
                alt-text="Open Sky album cover"
                caption-text="Open Sky — Blue Hour"
                container-width="100%"
                container-height="100%"
                image-width="100%"
                image-height="100%"
                v-bind="card"
              >
                <span class="tcd-scrim" />
                <TiltedCardLayer :depth="28">
                  <div class="tcd-album__meta">
                    <strong>Open Sky</strong>
                    <span>Blue Hour</span>
                  </div>
                </TiltedCardLayer>
                <TiltedCardLayer :depth="52">
                  <span class="tcd-album__play">
                    <HugeiconsIcon :icon="PlayIcon" :size="18" :stroke-width="2" />
                  </span>
                </TiltedCardLayer>
                <template #back>
                  <div class="tcd-tracks">
                    <div class="tcd-tracks__head">
                      <img class="tcd-tracks__cover" :src="PHOTOS[theme].sky" alt="" draggable="false" />
                      <div class="tcd-tracks__title">
                        <strong>Open Sky</strong>
                        <span>Blue Hour · 5 tracks</span>
                      </div>
                    </div>
                    <ol class="tcd-tracks__list">
                      <li
                        v-for="([name, length], index) in TRACKS"
                        :key="name"
                        :data-current="index === 0 ? '' : undefined"
                      >
                        <span class="tcd-tracks__number">{{ index + 1 }}</span>
                        <span class="tcd-tracks__name">{{ name }}</span>
                        <span class="tcd-tracks__length">{{ length }}</span>
                      </li>
                    </ol>
                  </div>
                </template>
              </TiltedCard>
            </div>

            <div v-else-if="props.demo === 'gallery'" class="tcd-gallery">
              <div v-for="(item, index) in GALLERY" :key="item.key" class="tcd-gallery__cell">
                <TiltedCard
                  :image-src="PHOTOS[theme][item.key]"
                  :alt-text="item.title"
                  :caption-text="item.title"
                  container-width="100%"
                  container-height="100%"
                  image-width="100%"
                  image-height="100%"
                  :intro-delay="index * 110"
                  v-bind="card"
                >
                  <span class="tcd-scrim" />
                  <TiltedCardLayer :depth="30">
                    <div class="tcd-gallery__meta">
                      <strong>{{ item.title }}</strong>
                      <span>{{ item.note[theme] }}</span>
                    </div>
                  </TiltedCardLayer>
                </TiltedCard>
              </div>
            </div>

            <div v-else-if="props.demo === 'ticket'" class="tcd-ticket-stage">
              <TiltedCard
                alt-text="Night Sky Live ticket"
                caption-text="Admit one"
                container-width="100%"
                container-height="100%"
                image-width="100%"
                image-height="100%"
                class-name="tcd-ticket-card"
                v-bind="card"
              >
                <div class="tcd-ticket">
                  <TiltedCardLayer :depth="22" class-name="tcd-ticket__main">
                    <span class="tcd-ticket__label">
                      <span class="tcd-ticket__icon">
                        <HugeiconsIcon :icon="Ticket01Icon" :size="14" :stroke-width="1.8" />
                      </span>
                      Admit one
                    </span>
                    <div class="tcd-ticket__title">
                      <strong>Night Sky Live</strong>
                      <span>Pier Amphitheater</span>
                    </div>
                    <dl class="tcd-ticket__info">
                      <div>
                        <dt>Date</dt>
                        <dd>Oct 24</dd>
                      </div>
                      <div>
                        <dt>Doors</dt>
                        <dd>20:30</dd>
                      </div>
                      <div>
                        <dt>Seat</dt>
                        <dd>B 12</dd>
                      </div>
                    </dl>
                  </TiltedCardLayer>
                  <TiltedCardLayer :depth="12" class-name="tcd-ticket__stub">
                    <svg class="tcd-barcode" viewBox="0 0 24 96" preserveAspectRatio="none" aria-hidden="true">
                      <rect v-for="[y, height] in BARS" :key="y" x="0" :y="y" width="24" :height="height" />
                    </svg>
                    <span class="tcd-ticket__gate">Gate 4</span>
                  </TiltedCardLayer>
                </div>
                <template #back>
                  <div class="tcd-ticket tcd-ticket--back">
                    <svg
                      class="tcd-qr"
                      :viewBox="`0 0 ${QR_SIZE} ${QR_SIZE}`"
                      shape-rendering="crispEdges"
                      aria-hidden="true"
                    >
                      <rect v-for="[x, y] in QR" :key="`${x}-${y}`" :x="x" :y="y" width="1" height="1" />
                    </svg>
                    <div class="tcd-ticket__scan">
                      <strong>Scan at the gate</strong>
                      <span>Ticket 0042 · Seat B 12</span>
                    </div>
                  </div>
                </template>
              </TiltedCard>
            </div>

            <TiltedCard
              v-else
              :image-src="PHOTOS[theme].sky"
              alt-text="Open Sky"
              caption-text="Open Sky"
              container-width="300px"
              container-height="300px"
              image-width="300px"
              image-height="300px"
              :display-overlay-content="props.displayOverlayContent"
              v-bind="card"
            >
              <template #overlay>
                <p class="tcd-overlay">Open Sky</p>
              </template>
            </TiltedCard>
          </div>
        </div>

        <Customize>
          <PreviewSelect
            title="Demo"
            :options="DEMO_OPTIONS"
            :model-value="props.demo"
            @update:model-value="value => updateProp('demo', value as DemoKind)"
          />
          <PreviewSelect
            title="Preset"
            :options="PRESET_OPTIONS"
            :model-value="props.preset"
            @update:model-value="value => applyPreset(String(value))"
          />
          <PreviewSelect
            title="Axis"
            :options="AXIS_OPTIONS"
            :model-value="props.axis"
            @update:model-value="value => updateProp('axis', value as TiltedCardAxis)"
          />
          <PreviewColorPickerCustom
            title="Glare Color"
            :color="props.glareColor"
            @change="value => updateProp('glareColor', value)"
          />
          <PreviewSlider
            title="Tilt"
            :min="0"
            :max="30"
            :step="1"
            value-unit="°"
            :model-value="props.rotateAmplitude"
            @update:model-value="value => updateProp('rotateAmplitude', value)"
          />
          <PreviewSlider
            title="Scale on Hover"
            :min="1"
            :max="1.3"
            :step="0.01"
            :model-value="props.scaleOnHover"
            @update:model-value="value => updateProp('scaleOnHover', value)"
          />
          <PreviewSlider
            title="Perspective"
            :min="300"
            :max="2000"
            :step="50"
            value-unit="px"
            :model-value="props.perspective"
            @update:model-value="value => updateProp('perspective', value)"
          />
          <PreviewSlider
            title="Smoothness"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.smoothness"
            @update:model-value="value => updateProp('smoothness', value)"
          />
          <PreviewSlider
            title="Glare"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.glare"
            @update:model-value="value => updateProp('glare', value)"
          />
          <PreviewSlider
            title="Shadow"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.shadow"
            @update:model-value="value => updateProp('shadow', value)"
          />
          <PreviewSlider
            title="Parallax"
            :min="0"
            :max="2.5"
            :step="0.1"
            :model-value="props.parallax"
            @update:model-value="value => updateProp('parallax', value)"
          />
          <PreviewSlider
            title="Radius"
            :min="0"
            :max="40"
            :step="1"
            value-unit="px"
            :model-value="props.radius"
            @update:model-value="value => updateProp('radius', value)"
          />
          <PreviewSwitch
            title="Tooltip"
            :model-value="props.showTooltip"
            @update:model-value="value => updateProp('showTooltip', value)"
          />
          <PreviewSwitch
            title="Overlay"
            :model-value="props.displayOverlayContent"
            :is-disabled="props.demo !== 'basic'"
            @update:model-value="value => updateProp('displayOverlayContent', value)"
          />
          <PreviewSwitch
            title="Flip on Click"
            :model-value="props.flipOnClick"
            :is-disabled="!flips"
            @update:model-value="value => updateProp('flipOnClick', value)"
          />
          <PreviewSwitch
            title="Reverse"
            :model-value="props.reverse"
            @update:model-value="value => updateProp('reverse', value)"
          />
          <PreviewSwitch
            title="Track Window"
            :model-value="props.trackWindow"
            @update:model-value="value => updateProp('trackWindow', value)"
          />
          <PreviewSwitch
            title="Floating"
            :model-value="props.floating"
            @update:model-value="value => updateProp('floating', value)"
          />
          <PreviewSwitch
            title="Intro"
            :model-value="props.intro"
            @update:model-value="
              value => {
                updateProp('intro', value);
                forceRerender();
              }
            "
          />
        </Customize>

        <PropTable :data="propData" />
        <Dependencies :dependency-list="[]" />
      </template>

      <template #code>
        <CodeExample :code-object="tiltedCard" component-name="TiltedCard" />
      </template>
    </TabsLayout>
  </ComponentPropsProvider>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { HugeiconsIcon } from '@hugeicons/vue';
import { PlayIcon, Ticket01Icon } from '@hugeicons/core-free-icons';
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
import { useColorModeValue } from '@/composables/useTheme';
import { tiltedCard } from '@/constants/code/Components/tiltedCardCode';
import TiltedCard, { TiltedCardLayer, type TiltedCardAxis } from '@/content/Components/TiltedCard/TiltedCard.vue';

type DemoKind = 'album' | 'gallery' | 'ticket' | 'basic';
type PhotoKey = 'sky' | 'field' | 'pier';
type Theme = 'light' | 'dark';

const PHOTOS: Record<Theme, Record<PhotoKey, string>> = {
  dark: {
    sky: '/assets/demo/night-sky.webp',
    field: '/assets/demo/night-landscape.webp',
    pier: '/assets/demo/night-portrait.webp'
  },
  light: {
    sky: '/assets/demo/day-sky.webp',
    field: '/assets/demo/day-landscape.webp',
    pier: '/assets/demo/day-portrait.webp'
  }
};

const TRACKS: [string, string][] = [
  ['Open Sky', '3:41'],
  ['Pier Lights', '4:05'],
  ['Canola', '2:58'],
  ['Low Tide', '3:22'],
  ['Last Light', '4:47']
];

const random = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const QR_SIZE = 21;
const QR = (() => {
  const next = random(42);
  const cells: [number, number][] = [];
  const finder = (x: number, y: number) => {
    const corners = [
      [0, 0],
      [QR_SIZE - 7, 0],
      [0, QR_SIZE - 7]
    ];
    for (const [cx, cy] of corners) {
      const dx = x - cx;
      const dy = y - cy;
      if (dx >= -1 && dx <= 7 && dy >= -1 && dy <= 7) {
        if (dx < 0 || dy < 0 || dx > 6 || dy > 6) return 0;
        const ring = Math.max(Math.abs(dx - 3), Math.abs(dy - 3));
        return ring === 3 || ring <= 1 ? 1 : 0;
      }
    }
    return -1;
  };
  for (let y = 0; y < QR_SIZE; y++) {
    for (let x = 0; x < QR_SIZE; x++) {
      const fixed = finder(x, y);
      const on = fixed >= 0 ? fixed : y === 6 || x === 6 ? (x + y) % 2 === 0 : next() > 0.52;
      if (on) cells.push([x, y]);
    }
  }
  return cells;
})();

const BARS = (() => {
  const next = random(7);
  const bars: [number, number][] = [];
  let y = 0;
  while (y < 96) {
    const height = next() > 0.6 ? 2.4 : 1.2;
    if (next() > 0.25) bars.push([y, height]);
    y += height + (next() > 0.5 ? 1.6 : 1.1);
  }
  return bars;
})();

const GALLERY: { key: PhotoKey; title: string; note: Record<Theme, string> }[] = [
  { key: 'pier', title: 'The Pier', note: { dark: 'Dusk', light: 'Clear sky' } },
  { key: 'field', title: 'Canola Field', note: { dark: 'Moonrise', light: 'Midday' } },
  { key: 'sky', title: 'Open Sky', note: { dark: 'Blue hour', light: 'Golden hour' } }
];

const LOOK = {
  rotateAmplitude: 12,
  scaleOnHover: 1.05,
  perspective: 800,
  smoothness: 0.6,
  glare: 0.5,
  glareColor: '#ffffff',
  shadow: 0.5,
  parallax: 1,
  radius: 15,
  axis: 'both' as TiltedCardAxis,
  reverse: false,
  trackWindow: false,
  floating: false
};

const DEFAULT_PROPS = {
  demo: 'album' as DemoKind,
  preset: 'classic',
  ...LOOK,
  showTooltip: true,
  displayOverlayContent: true,
  flipOnClick: true,
  intro: true
};

const PRESETS: Record<string, Partial<typeof LOOK>> = {
  classic: {},
  gentle: { rotateAmplitude: 6, scaleOnHover: 1.02, smoothness: 0.85, glare: 0.3, parallax: 0.6 },
  bold: { rotateAmplitude: 22, scaleOnHover: 1.08, smoothness: 0.4, glare: 0.85, shadow: 0.85, parallax: 1.6 },
  floating: { floating: true, smoothness: 0.75 },
  follow: { trackWindow: true, rotateAmplitude: 16 },
  reverse: { reverse: true },
  swing: { axis: 'horizontal', rotateAmplitude: 22, smoothness: 0.8 }
};

const DEMO_OPTIONS = [
  { value: 'album', label: 'Album' },
  { value: 'gallery', label: 'Gallery' },
  { value: 'ticket', label: 'Ticket' },
  { value: 'basic', label: 'Basic' }
];

const PRESET_OPTIONS = [
  { value: 'classic', label: 'Classic' },
  { value: 'gentle', label: 'Gentle' },
  { value: 'bold', label: 'Bold' },
  { value: 'floating', label: 'Floating' },
  { value: 'follow', label: 'Follow' },
  { value: 'reverse', label: 'Reverse' },
  { value: 'swing', label: 'Swing' }
];

const AXIS_OPTIONS = [
  { value: 'both', label: 'Both' },
  { value: 'horizontal', label: 'Horizontal' },
  { value: 'vertical', label: 'Vertical' }
];

const propData: PropRow[] = [
  { name: 'imageSrc', type: 'string', default: '-', description: 'Photo that fills the card.' },
  { name: 'altText', type: 'string', default: "'Tilted card image'", description: 'Alternative text for the photo.' },
  {
    name: 'default slot',
    type: 'slot',
    default: '-',
    description: 'Content on the face of the card, over the photo or instead of it.'
  },
  {
    name: 'captionText',
    type: 'string',
    default: "''",
    description: 'Text in the small tag that follows the cursor and swings as it moves.'
  },
  { name: 'showTooltip', type: 'boolean', default: 'true', description: 'Shows the caption tag on hover.' },
  {
    name: 'overlay (slot)',
    type: 'slot',
    default: '-',
    description: 'Content that floats in front of the card, lifted off its surface.'
  },
  {
    name: 'displayOverlayContent',
    type: 'boolean',
    default: 'false',
    description: 'Shows the overlay content.'
  },
  { name: 'overlayDepth', type: 'number', default: '30', description: 'How far the overlay floats in front, in px.' },
  {
    name: 'back (slot)',
    type: 'slot',
    default: '-',
    description: 'Content for the back of the card. Clicking, tapping or pressing Enter flips the card over.'
  },
  {
    name: 'flipOnClick',
    type: 'boolean',
    default: 'true',
    description: 'Flips the card when it is clicked. Needs the back slot.'
  },
  {
    name: 'flipped',
    type: 'boolean',
    default: '-',
    description: 'Controls which side shows. Leave it unset to let clicks flip the card.'
  },
  {
    name: 'onFlip',
    type: '(flipped: boolean) => void',
    default: '-',
    description: 'Called with the new side whenever the card is flipped. Pass it as @flip.'
  },
  {
    name: 'onClick',
    type: '(event) => void',
    default: '-',
    description: 'Called when the card is clicked or activated with the keyboard. Pass it as @click.'
  },
  {
    name: 'containerWidth',
    type: 'number | string',
    default: "'100%'",
    description: 'Width of the area that reacts to the cursor.'
  },
  {
    name: 'containerHeight',
    type: 'number | string',
    default: "'300px'",
    description: 'Height of the area that reacts to the cursor.'
  },
  { name: 'imageWidth', type: 'number | string', default: "'300px'", description: 'Width of the card.' },
  { name: 'imageHeight', type: 'number | string', default: "'300px'", description: 'Height of the card.' },
  {
    name: 'rotateAmplitude',
    type: 'number',
    default: '12',
    description: 'How far the card tilts toward the cursor, in degrees.'
  },
  { name: 'scaleOnHover', type: 'number', default: '1.05', description: 'How much the card grows when hovered.' },
  {
    name: 'perspective',
    type: 'number | string',
    default: '800',
    description: 'Viewing distance in px. Lower values give a stronger 3D effect.'
  },
  { name: 'radius', type: 'number | string', default: '15', description: 'Corner radius of the card.' },
  {
    name: 'smoothness',
    type: 'number',
    default: '0.6',
    description: 'From 0 to 1. Low values snap to the cursor, high values glide and settle with a soft bounce.'
  },
  {
    name: 'glare',
    type: 'number',
    default: '0.5',
    description: 'Strength of the light that catches the surface and edges as the card tilts, from 0 to 1.'
  },
  { name: 'glareColor', type: 'string', default: "'#ffffff'", description: 'Color of the glare.' },
  {
    name: 'shadow',
    type: 'number',
    default: '0.5',
    description: 'Strength of the soft shadow under the card, which shifts and grows as the card lifts, from 0 to 1.'
  },
  {
    name: 'parallax',
    type: 'number',
    default: '1',
    description: 'How far layers and the photo shift with the tilt. 0 keeps everything flat.'
  },
  {
    name: 'axis',
    type: "'both' | 'horizontal' | 'vertical'",
    default: "'both'",
    description: 'Limits the tilt to following the cursor left and right, or up and down.'
  },
  {
    name: 'reverse',
    type: 'boolean',
    default: 'false',
    description: 'Tilts away from the cursor instead of toward it.'
  },
  {
    name: 'trackWindow',
    type: 'boolean',
    default: 'false',
    description: 'The card follows the cursor anywhere on the page, not only while hovered.'
  },
  { name: 'floating', type: 'boolean', default: 'false', description: 'The card drifts and sways gently while idle.' },
  {
    name: 'gyroscope',
    type: 'boolean',
    default: 'true',
    description: 'Tilts the card as a phone or tablet is moved. Asks for permission on iOS on the first tap.'
  },
  {
    name: 'intro',
    type: 'boolean',
    default: 'true',
    description: 'The card rises and settles into place when it first scrolls into view.'
  },
  {
    name: 'introDelay',
    type: 'number',
    default: '0',
    description: 'Wait before the intro, in ms. Stagger it across a row of cards.'
  },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the card.' },
  { name: 'style', type: 'CSSProperties', default: '-', description: 'Inline styles for the card.' },
  {
    name: 'TiltedCardLayer',
    type: 'component',
    default: '-',
    description:
      'Wrap content in <TiltedCardLayer :depth="30"> to float it above the card face. Higher depth floats further, negative depth sinks behind.'
  }
];

const { rerenderKey, forceRerender } = useForceRerender();
const { props, defaultProps, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);
const theme = useColorModeValue<Theme>('light', 'dark');

const card = computed(() => {
  const { demo: _demo, preset: _preset, displayOverlayContent: _overlay, ...rest } = props.value;
  void _demo;
  void _preset;
  void _overlay;
  return rest;
});

const flips = computed(() => props.value.demo === 'album' || props.value.demo === 'ticket');

const applyPreset = (value: string) => {
  const base = Object.fromEntries(
    Object.keys(LOOK).map(name => [name, defaultProps.value[name as keyof typeof LOOK]])
  ) as Partial<typeof LOOK>;
  updateProps({ ...base, ...PRESETS[value], preset: value });
};
</script>

<style>
.tcd-scene {
  --tcd-surface: linear-gradient(180deg, #1b1d1b 0%, #121412 100%);
  --tcd-tile: linear-gradient(180deg, #373a37 0%, #262926 100%);
  --tcd-tile-rim: inset 0 0 0 1px rgba(255, 255, 255, 0.07), inset 0 1px 0 rgba(255, 255, 255, 0.12);
  --tcd-ink: #f4f5f4;
  --tcd-muted: rgba(244, 245, 244, 0.6);
  --tcd-faint: rgba(244, 245, 244, 0.34);
  --tcd-line: rgba(244, 245, 244, 0.16);
  --tcd-solid: #f4f5f4;
  --tcd-solid-ink: #111311;
  container: tcd / inline-size;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 28px;
  place-items: center;
  font-feature-settings: 'tnum' 0;
}

.tcd-scene[data-theme='light'] {
  --tcd-surface: linear-gradient(180deg, #ffffff 0%, #f7f9f7 100%);
  --tcd-tile: linear-gradient(180deg, #ffffff 0%, #f2f4f2 100%);
  --tcd-tile-rim: inset 0 0 0 1px rgba(22, 24, 22, 0.08), inset 0 1px 0 rgba(255, 255, 255, 1);
  --tcd-ink: #161816;
  --tcd-muted: rgba(22, 24, 22, 0.6);
  --tcd-faint: rgba(22, 24, 22, 0.36);
  --tcd-line: rgba(22, 24, 22, 0.14);
  --tcd-solid: #161816;
  --tcd-solid-ink: #ffffff;
}

.tcd-scene[data-theme='light'] .tilted-card {
  --tc-rim-color: rgba(22, 24, 22, 0.08);
  --tc-rim-light: rgba(255, 255, 255, 0.9);
}

.tcd-scrim {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(9, 10, 9, 0.78) 0%,
    rgba(9, 10, 9, 0.66) 14%,
    rgba(9, 10, 9, 0.42) 30%,
    rgba(9, 10, 9, 0.18) 46%,
    rgba(9, 10, 9, 0.04) 60%,
    rgba(9, 10, 9, 0) 72%
  );
  pointer-events: none;
}

.tcd-album {
  width: min(300px, 100%);
  aspect-ratio: 1;
}

.tcd-album__meta,
.tcd-gallery__meta {
  position: absolute;
  left: 18px;
  bottom: 17px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  color: #ffffff;
}

.tcd-album__meta strong {
  font-size: 17px;
  font-weight: 600;
  line-height: 22px;
  letter-spacing: -0.01em;
}

.tcd-album__meta span,
.tcd-gallery__meta span {
  color: rgba(255, 255, 255, 0.72);
  font-size: 13px;
  line-height: 18px;
}

.tcd-album__play {
  position: absolute;
  right: 16px;
  bottom: 16px;
  display: grid;
  width: 40px;
  height: 40px;
  place-items: center;
  border-radius: 50%;
  background: #f4f5f4;
  color: #111311;
  box-shadow: 0 10px 22px -10px rgba(0, 0, 0, 0.7);
}

.tcd-album__play svg {
  transform: translateX(1px);
}

.tcd-tracks {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 18px;
  background: var(--tcd-surface);
  color: var(--tcd-ink);
}

.tcd-tracks__head {
  display: flex;
  align-items: center;
  gap: 12px;
}

.tcd-tracks__cover {
  width: 44px;
  height: 44px;
  flex: none;
  border-radius: 10px;
  object-fit: cover;
}

.tcd-tracks__title {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 2px;
}

.tcd-tracks__title strong {
  font-size: 15px;
  font-weight: 600;
  line-height: 20px;
}

.tcd-tracks__title span {
  color: var(--tcd-muted);
  font-size: 12.5px;
  line-height: 16px;
}

.tcd-tracks__list {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  margin: 0;
  padding: 4px 0 0;
  list-style: none;
}

.tcd-tracks__list li {
  display: grid;
  grid-template-columns: 18px minmax(0, 1fr) auto;
  align-items: center;
  gap: 10px;
  color: var(--tcd-muted);
  font-size: 13px;
  line-height: 18px;
}

.tcd-tracks__list li[data-current] {
  color: var(--tcd-ink);
  font-weight: 500;
}

.tcd-tracks__number {
  color: var(--tcd-faint);
  font-variant-numeric: tabular-nums;
}

.tcd-tracks__list li[data-current] .tcd-tracks__number {
  color: var(--tcd-ink);
}

.tcd-tracks__name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tcd-tracks__length {
  font-variant-numeric: tabular-nums;
}

.tcd-gallery {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 22px;
  width: min(660px, 100%);
}

.tcd-gallery__cell {
  aspect-ratio: 4 / 5;
}

.tcd-gallery__meta {
  left: 16px;
  bottom: 15px;
}

.tcd-gallery__meta strong {
  font-size: 15px;
  font-weight: 600;
  line-height: 20px;
}

@container tcd (max-width: 600px) {
  .tcd-gallery {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    width: min(440px, 100%);
  }

  .tcd-gallery__cell:nth-child(3) {
    display: none;
  }
}

@container tcd (max-width: 400px) {
  .tcd-gallery {
    grid-template-columns: minmax(0, 1fr);
    width: min(250px, 100%);
  }

  .tcd-gallery__cell:nth-child(2) {
    display: none;
  }
}

.tcd-ticket-stage {
  --tcd-stub: 96px;
  width: min(400px, 100%);
  aspect-ratio: 400 / 190;
  min-height: 168px;
}

.tcd-ticket-card .tilted-card__front {
  -webkit-mask:
    radial-gradient(circle 9px at calc(100% - var(--tcd-stub)) 0, #0000 8.5px, #000 9.5px),
    radial-gradient(circle 9px at calc(100% - var(--tcd-stub)) 100%, #0000 8.5px, #000 9.5px);
  -webkit-mask-composite: source-in;
  mask:
    radial-gradient(circle 9px at calc(100% - var(--tcd-stub)) 0, #0000 8.5px, #000 9.5px),
    radial-gradient(circle 9px at calc(100% - var(--tcd-stub)) 100%, #0000 8.5px, #000 9.5px);
  mask-composite: intersect;
}

.tcd-ticket-card .tilted-card__back {
  -webkit-mask:
    radial-gradient(circle 9px at var(--tcd-stub) 0, #0000 8.5px, #000 9.5px),
    radial-gradient(circle 9px at var(--tcd-stub) 100%, #0000 8.5px, #000 9.5px);
  -webkit-mask-composite: source-in;
  mask:
    radial-gradient(circle 9px at var(--tcd-stub) 0, #0000 8.5px, #000 9.5px),
    radial-gradient(circle 9px at var(--tcd-stub) 100%, #0000 8.5px, #000 9.5px);
  mask-composite: intersect;
}

.tcd-ticket {
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-columns: minmax(0, 1fr) var(--tcd-stub);
  background: var(--tcd-surface);
  color: var(--tcd-ink);
}

.tcd-ticket .tcd-ticket__main {
  position: relative;
  inset: auto;
  display: flex;
  min-width: 0;
  flex-direction: column;
  justify-content: space-between;
  padding: 18px 20px;
}

.tcd-ticket__label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--tcd-muted);
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
}

.tcd-ticket__icon {
  display: grid;
  width: 22px;
  height: 22px;
  place-items: center;
  border-radius: 7px;
  background: var(--tcd-tile);
  box-shadow: var(--tcd-tile-rim);
  color: var(--tcd-ink);
}

.tcd-ticket__title {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.tcd-ticket__title strong {
  font-size: 19px;
  font-weight: 600;
  line-height: 24px;
  letter-spacing: -0.015em;
}

.tcd-ticket__title span {
  color: var(--tcd-muted);
  font-size: 12.5px;
  line-height: 16px;
}

.tcd-ticket__info {
  display: flex;
  gap: 22px;
  margin: 0;
}

.tcd-ticket__info div {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.tcd-ticket__info dt {
  color: var(--tcd-faint);
  font-size: 11px;
  line-height: 14px;
}

.tcd-ticket__info dd {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  line-height: 18px;
  font-variant-numeric: tabular-nums;
}

.tcd-ticket .tcd-ticket__stub {
  position: relative;
  inset: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background-image: linear-gradient(var(--tcd-line) 55%, transparent 55%);
  background-position: left top;
  background-repeat: repeat-y;
  background-size: 1px 7px;
}

.tcd-barcode {
  width: 34px;
  height: 92px;
  fill: var(--tcd-ink);
  opacity: 0.88;
}

.tcd-ticket__gate {
  color: var(--tcd-muted);
  font-size: 12px;
  line-height: 16px;
}

.tcd-ticket--back {
  grid-template-columns: var(--tcd-stub) minmax(0, 1fr);
  align-items: center;
}

.tcd-qr {
  width: 62px;
  height: 62px;
  justify-self: center;
  fill: var(--tcd-ink);
}

.tcd-ticket__scan {
  display: flex;
  flex-direction: column;
  gap: 3px;
  height: 100%;
  justify-content: center;
  padding: 0 20px;
  background-image: linear-gradient(var(--tcd-line) 55%, transparent 55%);
  background-position: left top;
  background-repeat: repeat-y;
  background-size: 1px 7px;
}

.tcd-ticket__scan strong {
  font-size: 15px;
  font-weight: 600;
  line-height: 20px;
}

.tcd-ticket__scan span {
  color: var(--tcd-muted);
  font-size: 12.5px;
  line-height: 16px;
}

@container tcd (max-width: 380px) {
  .tcd-ticket-stage {
    --tcd-stub: 78px;
  }

  .tcd-ticket .tcd-ticket__main {
    padding: 15px 16px;
  }

  .tcd-ticket__title strong {
    font-size: 17px;
  }

  .tcd-ticket__info {
    gap: 14px;
  }

  .tcd-barcode {
    width: 28px;
    height: 80px;
  }
}

.tcd-overlay {
  margin: 0;
  padding: 18px 20px;
  color: #ffffff;
  font-size: 17px;
  font-weight: 600;
  line-height: 22px;
  text-shadow: 0 2px 14px rgba(0, 0, 0, 0.45);
}
</style>
