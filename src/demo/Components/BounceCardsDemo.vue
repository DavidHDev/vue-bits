<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
    :demo-only-props="['preset']"
  >
    <TabsLayout>
      <template #preview>
        <div
          class="demo-container relative overflow-hidden"
          style="display: flex; justify-content: center; align-items: center; min-height: 500px"
        >
          <BounceCards
            :key="rerenderKey"
            :images="IMAGES"
            :container-width="500"
            :container-height="320"
            v-bind="settings"
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
          <PreviewSlider
            title="Card Size"
            :min="100"
            :max="260"
            :step="5"
            value-unit="px"
            :model-value="props.cardSize"
            @update:model-value="value => updateProp('cardSize', value)"
          />
          <PreviewSlider
            title="Spread"
            :min="0"
            :max="150"
            :step="1"
            value-unit="px"
            :model-value="props.spread"
            @update:model-value="value => updateProp('spread', value)"
          />
          <PreviewSlider
            title="Rotation"
            :min="0"
            :max="25"
            :step="1"
            value-unit="°"
            :model-value="props.rotation"
            @update:model-value="value => updateProp('rotation', value)"
          />
          <PreviewSlider
            title="Arc"
            :min="-60"
            :max="60"
            :step="1"
            value-unit="px"
            :model-value="props.arc"
            @update:model-value="value => updateProp('arc', value)"
          />
          <PreviewSlider
            title="Push Distance"
            :min="0"
            :max="240"
            :step="5"
            value-unit="px"
            :model-value="props.pushDistance"
            @update:model-value="value => updateProp('pushDistance', value)"
          />
          <PreviewSlider
            title="Hover Scale"
            :min="1"
            :max="1.25"
            :step="0.01"
            :model-value="props.hoverScale"
            @update:model-value="value => updateProp('hoverScale', value)"
          />
          <PreviewSlider
            title="Bounciness"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.bounciness"
            @update:model-value="value => updateAndReplay('bounciness', value)"
          />
          <PreviewSlider
            title="Delay"
            :min="0"
            :max="2"
            :step="0.1"
            value-unit="s"
            :model-value="props.animationDelay"
            @update:model-value="value => updateAndReplay('animationDelay', value)"
          />
          <PreviewSlider
            title="Stagger"
            :min="0"
            :max="0.3"
            :step="0.01"
            value-unit="s"
            :model-value="props.animationStagger"
            @update:model-value="value => updateAndReplay('animationStagger', value)"
          />
          <PreviewSlider
            title="Border Width"
            :min="0"
            :max="14"
            :step="1"
            value-unit="px"
            :model-value="props.borderWidth"
            @update:model-value="value => updateProp('borderWidth', value)"
          />
          <PreviewColorPickerCustom
            title="Border Color"
            :color="props.borderColor"
            @change="value => updateProp('borderColor', value)"
          />
          <PreviewSlider
            title="Radius"
            :min="0"
            :max="60"
            :step="1"
            value-unit="px"
            :model-value="props.radius"
            @update:model-value="value => updateProp('radius', value)"
          />
          <PreviewSwitch
            title="Shadow"
            :model-value="props.shadow"
            @update:model-value="value => updateProp('shadow', value)"
          />
          <PreviewSwitch
            title="Hover"
            :model-value="props.enableHover"
            @update:model-value="value => updateProp('enableHover', value)"
          />
        </Customize>

        <PropTable :data="propData" />
      </template>

      <template #code>
        <CodeExample :code-object="bounceCards" component-name="BounceCards" />
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
import { bounceCards } from '@/constants/code/Components/bounceCardsCode';
import BounceCards from '@/content/Components/BounceCards/BounceCards.vue';

const IMAGES = [
  '1724152312974-d4d48b8b36fd',
  '1762846818262-33c197852fa8',
  '1721407964262-f9864b562453',
  '1776394254711-4a0d7345269a',
  '1763440519433-5467759054fc'
].map(id => `https://images.unsplash.com/photo-${id}?w=480&h=480&q=80&auto=format&fit=crop`);

const DEFAULT_PROPS = {
  preset: 'fan',
  cardSize: 200,
  spread: 85,
  rotation: 10,
  arc: 0,
  pushDistance: 160,
  hoverScale: 1.06,
  bounciness: 0.6,
  animationDelay: 0.5,
  animationStagger: 0.06,
  borderWidth: 5,
  borderColor: '#ffffff',
  radius: 25,
  shadow: true,
  enableHover: true
};

type DemoProps = typeof DEFAULT_PROPS;

const PRESETS: Record<string, Partial<DemoProps>> = {
  fan: {},
  pile: { spread: 26, rotation: 14, pushDistance: 130 },
  row: { spread: 118, rotation: 0, pushDistance: 70, cardSize: 150, radius: 16, borderWidth: 0 },
  arc: { arc: 38, rotation: 12, spread: 92 },
  polaroid: { radius: 4, borderWidth: 10, rotation: 8, cardSize: 180 }
};

const PRESET_OPTIONS = [
  { value: 'fan', label: 'Fan' },
  { value: 'pile', label: 'Pile' },
  { value: 'row', label: 'Row' },
  { value: 'arc', label: 'Arc' },
  { value: 'polaroid', label: 'Polaroid' }
];

const { rerenderKey, forceRerender } = useForceRerender();
const { props, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);

const settings = computed(() => {
  const { preset: _preset, ...rest } = props.value;
  return rest;
});

const applyPreset = (value: string) => {
  updateProps({ ...DEFAULT_PROPS, ...PRESETS[value], preset: value });
  forceRerender();
};

const updateAndReplay = <K extends keyof DemoProps>(key: K, value: DemoProps[K]) => {
  updateProp(key, value);
  forceRerender();
};

const propData: PropRow[] = [
  {
    name: 'images',
    type: 'Array<string | { src: string; alt?: string }>',
    default: '[]',
    description: 'Images for the cards, from left to right.'
  },
  { name: 'containerWidth', type: 'number', default: '400', description: 'Width of the container in pixels.' },
  { name: 'containerHeight', type: 'number', default: '400', description: 'Height of the container in pixels.' },
  { name: 'cardSize', type: 'number', default: '200', description: 'Width and height of each card in pixels.' },
  { name: 'spread', type: 'number', default: '85', description: 'Horizontal distance between cards in pixels.' },
  {
    name: 'rotation',
    type: 'number',
    default: '10',
    description: 'Largest tilt in degrees. Each card leans by a different share of it, like a loose pile.'
  },
  {
    name: 'arc',
    type: 'number',
    default: '0',
    description: 'Drops the outer cards by this many pixels so the fan curves. Negative values curve it up.'
  },
  {
    name: 'pushDistance',
    type: 'number',
    default: '160',
    description: 'How far the other cards slide away from the hovered one, in pixels.'
  },
  {
    name: 'hoverScale',
    type: 'number',
    default: '1.06',
    description: 'Scale of the hovered card as it straightens and comes to the front.'
  },
  {
    name: 'bounciness',
    type: 'number',
    default: '0.6',
    description: 'How much the cards overshoot as they pop in, from 0 to 1.'
  },
  { name: 'animationDelay', type: 'number', default: '0.5', description: 'Seconds before the first card pops in.' },
  { name: 'animationStagger', type: 'number', default: '0.06', description: 'Seconds between cards popping in.' },
  { name: 'enableHover', type: 'boolean', default: 'true', description: 'Spreads the cards apart on hover.' },
  { name: 'borderWidth', type: 'number', default: '5', description: 'Width of the card border in pixels.' },
  { name: 'borderColor', type: 'string', default: "'#ffffff'", description: 'Color of the card border.' },
  { name: 'radius', type: 'number', default: '25', description: 'Corner radius of the cards in pixels.' },
  { name: 'shadow', type: 'boolean', default: 'true', description: 'Soft drop shadow that deepens on hover.' },
  {
    name: 'onCardClick',
    type: '(index: number) => void',
    default: '-',
    description: 'Called with the card index on click or Enter. Cards become focusable buttons when it is set.'
  },
  {
    name: 'transformStyles',
    type: 'string[]',
    default: '-',
    description:
      'Optional custom positions such as "rotate(5deg) translate(-150px)". Overrides spread, rotation and arc.'
  },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the container.' },
  { name: 'style', type: 'CSSProperties', default: '-', description: 'Inline styles for the container.' }
];
</script>
