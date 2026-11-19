<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
    :demo-only-props="['preset', 'typeface']"
    :computed-props="computedProps"
  >
    <TabsLayout>
      <template #preview>
        <div class="demo-container relative overflow-hidden" style="height: 500px; padding: 0">
          <CircularGallery
            :key="rerenderKey"
            :items="ITEMS"
            v-bind="galleryProps"
            :text-color="textColor"
            :font-url="fontUrl"
          />
          <RefreshButton @click="forceRerender" />
        </div>

        <Customize>
          <PreviewSelect
            title="Preset"
            :options="PRESET_OPTIONS"
            :model-value="props.preset"
            @update:model-value="value => applyPreset(String(value))"
          />
          <PreviewSelect
            title="Font"
            :options="FONT_OPTIONS"
            :model-value="props.typeface"
            @update:model-value="value => updateProp('typeface', String(value))"
          />
          <PreviewColorPickerCustom
            title="Text Color"
            :color="textColor"
            @change="value => updateProp('textColor', value)"
          />
          <PreviewSlider
            title="Bend"
            :min="-10"
            :max="10"
            :step="0.5"
            :model-value="props.bend"
            @update:model-value="value => updateProp('bend', value)"
          />
          <PreviewSlider
            title="Item Size"
            :min="0.4"
            :max="1.4"
            :step="0.02"
            :model-value="props.itemSize"
            @update:model-value="value => updateProp('itemSize', value)"
          />
          <PreviewSlider
            title="Item Aspect"
            :min="0.5"
            :max="2"
            :step="0.02"
            :model-value="props.itemAspect"
            @update:model-value="value => updateProp('itemAspect', value)"
          />
          <PreviewSlider
            title="Gap"
            :min="0"
            :max="1"
            :step="0.02"
            :model-value="props.gap"
            @update:model-value="value => updateProp('gap', value)"
          />
          <PreviewSlider
            title="Border Radius"
            :min="0"
            :max="0.5"
            :step="0.01"
            :model-value="props.borderRadius"
            @update:model-value="value => updateProp('borderRadius', value)"
          />
          <PreviewSlider
            title="Wave"
            :min="0"
            :max="3"
            :step="0.05"
            :model-value="props.wave"
            @update:model-value="value => updateProp('wave', value)"
          />
          <PreviewSlider
            title="Edge Fade"
            :min="0"
            :max="0.5"
            :step="0.01"
            :model-value="props.fadeEdges"
            @update:model-value="value => updateProp('fadeEdges', value)"
          />
          <PreviewSlider
            title="Shadow"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="props.shadow"
            @update:model-value="value => updateProp('shadow', value)"
          />
          <PreviewSlider
            title="Scroll Speed"
            :min="0.5"
            :max="5"
            :step="0.1"
            :model-value="props.scrollSpeed"
            @update:model-value="value => updateProp('scrollSpeed', value)"
          />
          <PreviewSlider
            title="Scroll Ease"
            :min="0.01"
            :max="0.3"
            :step="0.01"
            :model-value="props.scrollEase"
            @update:model-value="value => updateProp('scrollEase', value)"
          />
          <PreviewSlider
            title="Auto Scroll"
            :min="-3"
            :max="3"
            :step="0.1"
            :model-value="props.autoScroll"
            @update:model-value="value => updateProp('autoScroll', value)"
          />
          <PreviewSwitch
            title="Snap"
            :model-value="props.snap"
            @update:model-value="value => updateProp('snap', value)"
          />
          <PreviewSwitch
            title="Grayscale"
            :model-value="props.grayscale"
            @update:model-value="value => updateProp('grayscale', value)"
          />
          <PreviewSwitch
            title="Show Titles"
            :model-value="props.showTitles"
            @update:model-value="value => updateProp('showTitles', value)"
          />
          <PreviewSwitch
            title="Open On Click"
            :model-value="props.openOnClick"
            @update:model-value="value => updateProp('openOnClick', value)"
          />
          <PreviewSwitch
            title="Intro"
            :model-value="props.intro"
            @update:model-value="value => updateProp('intro', value)"
          />
        </Customize>

        <PropTable :data="propData" />
      </template>

      <template #code>
        <CodeExample :code-object="circularGallery" component-name="CircularGallery" />
      </template>
    </TabsLayout>
  </ComponentPropsProvider>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import CodeExample from '@/components/common/CodeExample.vue';
import Customize from '@/components/common/Customize.vue';
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
import { circularGallery } from '@/constants/code/Components/circularGalleryCode';
import CircularGallery, { type GalleryItem } from '@/content/Components/CircularGallery/CircularGallery.vue';

const ITEMS: GalleryItem[] = [
  { image: '/assets/demo/day-portrait.webp', text: 'Pier' },
  { image: '/assets/demo/night-landscape.webp', text: 'Night Field' },
  { image: '/assets/demo/day-sky.webp', text: 'Daybreak' },
  {
    image: 'https://images.unsplash.com/photo-1778849097774-0ab2a873a858?w=1200&q=80&auto=format&fit=crop',
    text: 'Clouds'
  },
  { image: '/assets/demo/night-portrait.webp', text: 'Night Pier' },
  { image: '/assets/demo/day-landscape.webp', text: 'Meadow' },
  { image: '/assets/demo/night-sky.webp', text: 'Afterglow' }
];

const FONT_OPTIONS = [
  { label: 'Figtree', value: '' },
  {
    label: 'Playfair Display',
    value: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap'
  },
  { label: 'Orbitron', value: 'https://fonts.googleapis.com/css2?family=Orbitron:wght@700&display=swap' },
  { label: 'Pacifico', value: 'https://fonts.googleapis.com/css2?family=Pacifico&display=swap' },
  { label: 'Bungee', value: 'https://fonts.googleapis.com/css2?family=Bungee&display=swap' },
  { label: 'Roboto Mono', value: 'https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@500&display=swap' }
];

const LOOK = {
  bend: 3,
  itemSize: 1,
  itemAspect: 0.78,
  gap: 0.26,
  borderRadius: 0.05,
  wave: 1,
  fadeEdges: 0.12,
  shadow: 0.25,
  scrollSpeed: 2,
  scrollEase: 0.05,
  autoScroll: 0,
  snap: true,
  grayscale: false,
  typeface: ''
};

const DEFAULT_PROPS = {
  preset: 'classic',
  ...LOOK,
  textColor: '',
  showTitles: true,
  openOnClick: true,
  intro: true
};

type DemoProps = typeof DEFAULT_PROPS;

const PRESETS: Record<string, Partial<DemoProps>> = {
  classic: { ...LOOK },
  film: { ...LOOK, bend: 1, itemSize: 0.8, itemAspect: 1.5, gap: 0.08, borderRadius: 0.02 },
  bowl: { ...LOOK, bend: -3, itemSize: 0.85, gap: 0.2 },
  flat: { ...LOOK, bend: 0, wave: 0, gap: 0.16, fadeEdges: 0.2 },
  editorial: {
    ...LOOK,
    grayscale: true,
    borderRadius: 0,
    shadow: 0,
    gap: 0.4,
    typeface: FONT_OPTIONS[1].value
  },
  drift: { ...LOOK, autoScroll: 1, snap: false, fadeEdges: 0.3, bend: 2 },
  circles: { ...LOOK, itemSize: 0.62, itemAspect: 1, borderRadius: 0.5, gap: 0.3, bend: 2 }
};

const PRESET_OPTIONS = [
  { value: 'classic', label: 'Classic' },
  { value: 'film', label: 'Film' },
  { value: 'bowl', label: 'Bowl' },
  { value: 'flat', label: 'Flat' },
  { value: 'editorial', label: 'Editorial' },
  { value: 'drift', label: 'Drift' },
  { value: 'circles', label: 'Circles' }
];

const propData: PropRow[] = [
  {
    name: 'items',
    type: 'Array<{ image: string; text?: string; description?: string; alt?: string }>',
    default: '12 sample photos',
    description:
      'Images to show. `text` is the title under each card, `description` appears under the title when a card is open and `alt` names the image for screen readers.'
  },
  {
    name: 'bend',
    type: 'number',
    default: '3',
    description:
      'Curvature of the arc. Positive values arch the cards down at the edges, negative values lift them, 0 lays them flat.'
  },
  {
    name: 'itemSize',
    type: 'number',
    default: '1',
    description: 'Card height relative to the container, from 0.2 to 2.'
  },
  {
    name: 'itemAspect',
    type: 'number',
    default: '0.78',
    description: 'Card width divided by height. Images are cropped to fill the card.'
  },
  { name: 'gap', type: 'number', default: '0.26', description: 'Space between cards as a fraction of the card width.' },
  {
    name: 'borderRadius',
    type: 'number',
    default: '0.05',
    description: 'Corner radius as a fraction of the card size, from 0 (square) to 0.5 (fully round).'
  },
  {
    name: 'wave',
    type: 'number',
    default: '1',
    description: 'How much the cards ripple while the gallery moves. 0 keeps them flat.'
  },
  {
    name: 'fadeEdges',
    type: 'number',
    default: '0.12',
    description: 'Fades the cards out toward the left and right edges, from 0 to 0.5 of the width.'
  },
  { name: 'shadow', type: 'number', default: '0.25', description: 'Strength of the soft shadow under each card.' },
  {
    name: 'textColor',
    type: 'string',
    default: "'#ffffff'",
    description: 'Color of the titles, the keyboard focus ring and the placeholder shown while images load.'
  },
  {
    name: 'font',
    type: 'string',
    default: "'bold 30px Figtree'",
    description:
      'CSS font shorthand for the titles. The size scales with the cards, so 30px means the default size and larger values make the titles bigger.'
  },
  {
    name: 'fontUrl',
    type: 'string',
    default: 'undefined',
    description:
      'Font to load for the titles. Accepts a stylesheet URL (e.g. a Google Fonts link) or a font file (.woff2, .woff, .ttf, .otf). The loaded family replaces the family in `font`.'
  },
  { name: 'showTitles', type: 'boolean', default: 'true', description: 'Shows the title of each card underneath it.' },
  {
    name: 'scrollSpeed',
    type: 'number',
    default: '2',
    description: 'How far the gallery travels per drag or wheel movement.'
  },
  {
    name: 'scrollEase',
    type: 'number',
    default: '0.05',
    description: 'How quickly the gallery catches up with the input, from 0.001 (floaty) to 1 (instant).'
  },
  {
    name: 'snap',
    type: 'boolean',
    default: 'true',
    description: 'Settles on the nearest card after dragging or scrolling.'
  },
  {
    name: 'autoScroll',
    type: 'number',
    default: '0',
    description:
      'Speed of an automatic drift, where 1 moves about one card every four seconds and negative values drift the other way. It pauses on hover, while dragging, while a card is open and briefly after any input.'
  },
  {
    name: 'grayscale',
    type: 'boolean',
    default: 'false',
    description: 'Shows the images in grayscale and brings the color back on hover, focus or when opened.'
  },
  {
    name: 'openOnClick',
    type: 'boolean',
    default: 'true',
    description:
      'Clicking a card opens it to its full image. Click it again, click outside it, press Escape or use the close button to return. When off, clicking a card centers it.'
  },
  { name: 'intro', type: 'boolean', default: 'true', description: 'Glides the cards in when the gallery mounts.' },
  { name: 'onItemClick', type: '(item, index) => void', default: '-', description: 'Called when a card is clicked.' },
  {
    name: 'onActiveChange',
    type: '(index) => void',
    default: '-',
    description: 'Called when a different card becomes the centered one.'
  },
  { name: 'dpr', type: 'number', default: 'auto', description: 'Maximum device pixel ratio, capped at 2.' },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the container.' },
  { name: 'style', type: 'StyleValue', default: '-', description: 'Inline styles for the container.' }
];

const { rerenderKey, forceRerender } = useForceRerender();
const { props, defaultProps, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);
const themeText = useColorModeValue('#6c736d', '#ffffff');
const textColor = computed(() => props.value.textColor || themeText.value);
const fontUrl = computed(() => props.value.typeface || undefined);
const galleryProps = computed(() => {
  const { preset: _preset, typeface: _typeface, textColor: _textColor, ...rest } = props.value;
  return rest;
});
const computedProps = computed(() => ({
  textColor: textColor.value,
  ...(fontUrl.value ? { fontUrl: fontUrl.value } : {})
}));

const applyPreset = (value: string) => {
  const base = Object.fromEntries(
    Object.keys(DEFAULT_PROPS).map(name => [name, defaultProps.value[name as keyof DemoProps]])
  ) as DemoProps;
  updateProps({ ...base, ...PRESETS[value], preset: value });
};
</script>
