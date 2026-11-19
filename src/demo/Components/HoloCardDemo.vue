<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
    :demo-only-props="['card']"
  >
    <TabsLayout>
      <template #preview>
        <div
          class="demo-container relative overflow-hidden"
          style="height: 620px; display: flex; align-items: center; justify-content: center"
        >
          <HoloCard :image="chosen.image" :alt="chosen.alt" v-bind="cardProps" />
        </div>

        <Customize>
          <PreviewSelect
            title="Card"
            :options="CARD_OPTIONS"
            :model-value="props.card"
            @update:model-value="selectCard"
          />
          <PreviewSelect
            title="Preset"
            :options="PRESET_OPTIONS"
            :model-value="props.preset"
            @update:model-value="value => updateProp('preset', value as HoloPreset)"
          />
          <PreviewColorPickerCustom
            title="Foil Color"
            :color="props.foilColor"
            @change="value => updateProp('foilColor', value)"
          />
          <PreviewSlider
            title="Intensity"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.intensity"
            @update:model-value="value => updateProp('intensity', value)"
          />
          <PreviewSlider
            title="Scale"
            :min="0.5"
            :max="2"
            :step="0.05"
            :model-value="props.scale"
            @update:model-value="value => updateProp('scale', value)"
          />
          <PreviewSlider
            title="Edge Sparkle"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.edgeSparkle"
            @update:model-value="value => updateProp('edgeSparkle', value)"
          />
          <PreviewSlider
            title="Frame"
            :min="0"
            :max="10"
            :step="0.5"
            :display-value="value => `${value}%`"
            :model-value="props.frame"
            @update:model-value="value => updateProp('frame', value)"
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
            title="Tilt"
            :min="0"
            :max="30"
            :step="1"
            :display-value="value => `${value}°`"
            :model-value="props.tiltMax"
            @update:model-value="value => updateProp('tiltMax', value)"
          />
          <PreviewSlider
            title="Hover Scale"
            :min="1"
            :max="1.1"
            :step="0.01"
            :model-value="props.hoverScale"
            @update:model-value="value => updateProp('hoverScale', value)"
          />
          <PreviewSlider
            title="Radius"
            :min="0"
            :max="30"
            :step="1"
            :display-value="value => `${value}px`"
            :model-value="props.radius"
            @update:model-value="value => updateProp('radius', value)"
          />
          <PreviewSlider
            title="Width"
            :min="220"
            :max="420"
            :step="10"
            :display-value="value => `${value}px`"
            :model-value="props.width"
            @update:model-value="value => updateProp('width', value)"
          />
          <PreviewSwitch
            title="Idle Shimmer"
            :model-value="props.idle"
            @update:model-value="value => updateProp('idle', value)"
          />
          <PreviewSwitch
            title="Shadow"
            :model-value="props.shadow"
            @update:model-value="value => updateProp('shadow', value)"
          />
        </Customize>

        <PropTable :data="propData" />
        <Dependencies :dependency-list="[]" />
      </template>

      <template #code>
        <CodeExample :code-object="holoCard" component-name="HoloCard" />
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
import TabsLayout from '@/components/common/TabsLayout.vue';
import ComponentPropsProvider from '@/components/context/ComponentPropsProvider.vue';
import { useComponentProps } from '@/composables/useComponentProps';
import { holoCard } from '@/constants/code/Components/holoCardCode';
import HoloCard from '@/content/Components/HoloCard/HoloCard.vue';
import pikachu from '@/assets/holo-card/pikachu.webp';
import mew from '@/assets/holo-card/mew.webp';
import maushold from '@/assets/holo-card/maushold.webp';

type HoloPreset = 'bursts' | 'stars' | 'shards' | 'cosmos' | 'rainbow' | 'swirl' | 'glitter' | 'gold';
type CardId = 'pikachu' | 'mew' | 'maushold';

const CARDS: Record<CardId, { image: string; alt: string; preset: HoloPreset }> = {
  pikachu: { image: pikachu, alt: 'Pikachu trading card', preset: 'bursts' },
  mew: { image: mew, alt: 'Mew trading card', preset: 'glitter' },
  maushold: { image: maushold, alt: 'Maushold trading card', preset: 'rainbow' }
};

const CARD_OPTIONS = [
  { label: 'Pikachu', value: 'pikachu' },
  { label: 'Mew', value: 'mew' },
  { label: 'Maushold', value: 'maushold' }
];

const PRESET_OPTIONS = [
  { label: 'Bursts', value: 'bursts' },
  { label: 'Stars', value: 'stars' },
  { label: 'Shards', value: 'shards' },
  { label: 'Cosmos', value: 'cosmos' },
  { label: 'Rainbow', value: 'rainbow' },
  { label: 'Swirl', value: 'swirl' },
  { label: 'Glitter', value: 'glitter' },
  { label: 'Gold', value: 'gold' }
];

const DEFAULT_PROPS = {
  card: 'pikachu' as CardId,
  preset: 'bursts' as HoloPreset,
  foilColor: '#e2e6ec',
  intensity: 0.85,
  scale: 1,
  edgeSparkle: 0.8,
  frame: 4,
  glare: 0.5,
  tiltMax: 14,
  hoverScale: 1.04,
  radius: 14,
  width: 320,
  idle: true,
  shadow: true
};

const { props, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);

const chosen = computed(() => CARDS[props.value.card] ?? CARDS.pikachu);

const cardProps = computed(() => {
  const { card: _card, ...rest } = props.value;
  return rest;
});

const selectCard = (value: string | number) => {
  const id = value as CardId;
  updateProps({ card: id, preset: CARDS[id]?.preset ?? 'bursts' });
};

const propData: PropRow[] = [
  {
    name: 'image',
    type: 'string',
    default: '-',
    description: 'Front of the card. Same-origin or CORS-enabled URL.'
  },
  {
    name: 'backImage',
    type: 'string',
    default: '-',
    description: 'Back of the card. When set, a click or Enter flips the card over.'
  },
  { name: 'alt', type: 'string', default: "''", description: 'Accessible description of the card.' },
  {
    name: 'preset',
    type: "'bursts' | 'stars' | 'shards' | 'cosmos' | 'rainbow' | 'swirl' | 'glitter' | 'gold'",
    default: "'bursts'",
    description:
      'The holo pattern on the card face. Bursts are rings of foil dashes, shards are cracked ice, swirl is one big round rainbow and gold is a warm etched foil.'
  },
  {
    name: 'foilColor',
    type: 'string',
    default: "'#e2e6ec'",
    description: 'Colour of the metal under the print, silver by default.'
  },
  {
    name: 'intensity',
    type: 'number',
    default: '0.85',
    description: 'How strongly the foil shows through the print, from 0 for plain card to 1.'
  },
  {
    name: 'scale',
    type: 'number',
    default: '1',
    description: 'Size of the holo pattern. Higher values pack in more, smaller elements.'
  },
  {
    name: 'edgeSparkle',
    type: 'number',
    default: '0.8',
    description: 'Brightness of the glitter on the silver border as it catches the light.'
  },
  {
    name: 'frame',
    type: 'number',
    default: '4',
    description: 'Width of the sparkling border as a percentage of the card width. Match it to your card art.'
  },
  {
    name: 'glare',
    type: 'number',
    default: '0.5',
    description: 'Strength of the glossy highlight under the light.'
  },
  { name: 'tiltMax', type: 'number', default: '14', description: 'Largest tilt in degrees as the pointer moves.' },
  { name: 'hoverScale', type: 'number', default: '1.04', description: 'How much the card lifts while hovered.' },
  { name: 'radius', type: 'number', default: '14', description: 'Corner radius in px.' },
  { name: 'width', type: 'number', default: '320', description: 'Card width in px. The height follows the image.' },
  {
    name: 'idle',
    type: 'boolean',
    default: 'true',
    description: 'Drifts the light and tilt slowly when nobody is hovering, so the foil keeps shimmering.'
  },
  {
    name: 'shadow',
    type: 'boolean',
    default: 'true',
    description: 'Soft shadow under the card that follows the tilt.'
  },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the root element.' },
  { name: 'style', type: 'CSSProperties', default: '-', description: 'Inline styles for the root element.' }
];
</script>
