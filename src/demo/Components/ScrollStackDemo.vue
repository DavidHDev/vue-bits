<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
    :demo-only-props="['preset']"
    :computed-props="{ stackPosition: `${props.stackPosition}%` }"
  >
    <TabsLayout>
      <template #preview>
        <div class="demo-container relative overflow-hidden" style="height: 500px; padding: 0">
          <ScrollStack v-bind="settings" :stack-position="`${props.stackPosition}%`">
            <ScrollStackItem
              v-for="name in PHOTOS"
              :key="name"
              :style="{ height: '300px', padding: 0, background: 'none' }"
            >
              <img
                :src="`/assets/demo/${name}.webp`"
                alt=""
                draggable="false"
                style="
                  position: absolute;
                  inset: 0;
                  width: 100%;
                  height: 100%;
                  object-fit: cover;
                  border-radius: inherit;
                "
              />
            </ScrollStackItem>
          </ScrollStack>
        </div>

        <Customize>
          <PreviewSelect
            title="Preset"
            :options="PRESET_OPTIONS"
            :model-value="props.preset"
            @update:model-value="value => applyPreset(String(value))"
          />
          <PreviewSlider
            title="Item Distance"
            :min="0"
            :max="200"
            :step="5"
            value-unit="px"
            :model-value="props.itemDistance"
            @update:model-value="value => updateProp('itemDistance', value)"
          />
          <PreviewSlider
            title="Stack Distance"
            :min="0"
            :max="60"
            :step="1"
            value-unit="px"
            :model-value="props.itemStackDistance"
            @update:model-value="value => updateProp('itemStackDistance', value)"
          />
          <PreviewSlider
            title="Stack Position"
            :min="0"
            :max="40"
            :step="1"
            value-unit="%"
            :model-value="props.stackPosition"
            @update:model-value="value => updateProp('stackPosition', value)"
          />
          <PreviewSlider
            title="Item Scale"
            :min="0"
            :max="0.15"
            :step="0.005"
            :model-value="props.itemScale"
            @update:model-value="value => updateProp('itemScale', value)"
          />
          <PreviewSlider
            title="Base Scale"
            :min="0.5"
            :max="1"
            :step="0.01"
            :model-value="props.baseScale"
            @update:model-value="value => updateProp('baseScale', value)"
          />
          <PreviewSlider
            title="Dim"
            :min="0"
            :max="0.6"
            :step="0.01"
            :model-value="props.dimAmount"
            @update:model-value="value => updateProp('dimAmount', value)"
          />
          <PreviewSlider
            title="Blur"
            :min="0"
            :max="8"
            :step="0.1"
            value-unit="px"
            :model-value="props.blurAmount"
            @update:model-value="value => updateProp('blurAmount', value)"
          />
          <PreviewSlider
            title="Tilt"
            :min="0"
            :max="45"
            :step="1"
            value-unit="°"
            :model-value="props.tiltAmount"
            @update:model-value="value => updateProp('tiltAmount', value)"
          />
          <PreviewSlider
            title="Rotation"
            :min="0"
            :max="10"
            :step="0.5"
            value-unit="°"
            :model-value="props.rotationAmount"
            @update:model-value="value => updateProp('rotationAmount', value)"
          />
          <PreviewSwitch
            title="Smooth Scroll"
            :model-value="props.smoothScroll"
            @update:model-value="value => updateProp('smoothScroll', value)"
          />
          <PreviewSwitch
            title="Snap"
            :model-value="props.snap"
            @update:model-value="value => updateProp('snap', value)"
          />
        </Customize>

        <PropTable :data="propData" />
      </template>

      <template #code>
        <CodeExample :code-object="scrollStack" component-name="ScrollStack" />
      </template>
    </TabsLayout>
  </ComponentPropsProvider>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import CodeExample from '@/components/common/CodeExample.vue';
import Customize from '@/components/common/Customize.vue';
import PreviewSelect from '@/components/common/PreviewSelect.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import ComponentPropsProvider from '@/components/context/ComponentPropsProvider.vue';
import { useComponentProps } from '@/composables/useComponentProps';
import { scrollStack } from '@/constants/code/Components/scrollStackCode';
import ScrollStack, { ScrollStackItem } from '@/content/Components/ScrollStack/ScrollStack.vue';

const PHOTOS = ['night-landscape', 'day-portrait', 'night-sky', 'day-landscape', 'night-portrait'];

const LOOK = {
  itemStackDistance: 22,
  itemScale: 0.05,
  baseScale: 0.8,
  dimAmount: 0.25,
  blurAmount: 0,
  tiltAmount: 0,
  rotationAmount: 0
};

const DEFAULT_PROPS = {
  preset: 'stack',
  itemDistance: 40,
  stackPosition: 12,
  ...LOOK,
  smoothScroll: true,
  snap: false
};

type DemoProps = typeof DEFAULT_PROPS;

const PRESETS: Record<string, Partial<DemoProps>> = {
  stack: { ...LOOK },
  deck: { ...LOOK, itemStackDistance: 30, itemScale: 0.03, tiltAmount: 24, dimAmount: 0.3 },
  pile: { ...LOOK, itemStackDistance: 0, itemScale: 0.015, baseScale: 0.9, dimAmount: 0.12, rotationAmount: 3 },
  focus: { ...LOOK, itemScale: 0.06, dimAmount: 0.35, blurAmount: 3 },
  flat: { ...LOOK, itemStackDistance: 40, itemScale: 0, dimAmount: 0.15 }
};

const PRESET_OPTIONS = [
  { value: 'stack', label: 'Stack' },
  { value: 'deck', label: 'Deck' },
  { value: 'pile', label: 'Pile' },
  { value: 'focus', label: 'Focus' },
  { value: 'flat', label: 'Flat' }
];

const { props, defaultProps, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);

const settings = computed(() => {
  const { preset: _preset, stackPosition: _stackPosition, ...rest } = props.value;
  return rest;
});

const applyPreset = (value: string) => {
  const base = Object.fromEntries(
    (Object.keys(DEFAULT_PROPS) as (keyof DemoProps)[]).map(name => [name, defaultProps.value[name]])
  ) as DemoProps;
  updateProps({
    ...base,
    ...PRESETS[value],
    smoothScroll: props.value.smoothScroll,
    snap: props.value.snap,
    preset: value
  });
};

const propData: PropRow[] = [
  {
    name: 'default slot',
    type: 'VNode[]',
    default: '-',
    description: 'The cards to stack, usually ScrollStackItem elements.'
  },
  {
    name: 'itemDistance',
    type: 'number',
    default: '100',
    description: 'Gap between cards before they stack, in px. Larger gaps mean more scrolling between cards.'
  },
  {
    name: 'itemStackDistance',
    type: 'number',
    default: '24',
    description: 'How far each card rests below the one before it in the stack, in px. 0 piles them exactly.'
  },
  {
    name: 'stackPosition',
    type: 'number | string',
    default: "'15%'",
    description: 'Where the stack pins, from the top of the viewport or container. A number is px, or use a % string.'
  },
  {
    name: 'itemScale',
    type: 'number',
    default: '0.05',
    description: 'How much a card shrinks for each card stacked on top of it.'
  },
  {
    name: 'baseScale',
    type: 'number',
    default: '0.8',
    description: 'The smallest a buried card can shrink to.'
  },
  {
    name: 'dimAmount',
    type: 'number',
    default: '0.2',
    description: 'How much a card darkens for each card stacked on top of it, from 0 to 1.'
  },
  {
    name: 'blurAmount',
    type: 'number',
    default: '0',
    description: 'Blur added for each card stacked on top, in px.'
  },
  {
    name: 'tiltAmount',
    type: 'number',
    default: '0',
    description: 'How far buried cards lean back in 3D, in degrees.'
  },
  {
    name: 'rotationAmount',
    type: 'number',
    default: '0',
    description: 'How far buried cards turn, alternating left and right like a loose pile, in degrees.'
  },
  {
    name: 'holdDistance',
    type: 'number',
    default: '200',
    description: 'How long the finished stack stays pinned before it scrolls away, in px of scrolling.'
  },
  {
    name: 'smoothScroll',
    type: 'boolean',
    default: 'true',
    description:
      'Glides mouse wheel scrolling smoothly. Touch, keyboard and scrollbar scrolling stay native. With useWindowScroll it smooths the whole page while the stack is mounted.'
  },
  {
    name: 'snap',
    type: 'boolean',
    default: 'false',
    description: 'When scrolling stops near a card, glides it the rest of the way onto the stack.'
  },
  {
    name: 'useWindowScroll',
    type: 'boolean',
    default: 'false',
    description:
      'Stacks the cards as the page scrolls instead of scrolling inside its own container. Avoid overflow: hidden on parent elements, which stops cards from pinning.'
  },
  {
    name: 'onStackComplete',
    type: '() => void',
    default: '-',
    description: 'Called when the last card lands on the stack.'
  },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the stack container.' },
  {
    name: 'itemClassName',
    type: 'string',
    default: "''",
    description: 'ScrollStackItem only. Extra class names for the card, for its size, colors and content.'
  },
  {
    name: 'style',
    type: 'StyleValue',
    default: '-',
    description: 'ScrollStackItem only. Inline styles for the card.'
  }
];
</script>
