<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
  >
    <TabsLayout>
      <template #preview>
        <div class="demo-container relative overflow-hidden" style="height: 480px">
          <div style="width: 230px; height: 230px">
            <Stack :key="rerenderKey" :cards="cards" v-bind="props" />
          </div>
          <RefreshButton @click="forceRerender" />
        </div>

        <Customize>
          <PreviewSelect
            title="Layout"
            :options="LAYOUT_OPTIONS"
            :model-value="props.layout"
            @update:model-value="value => updateProp('layout', value as StackLayout)"
          />
          <PreviewSlider
            title="Visible Cards"
            :min="1"
            :max="6"
            :step="1"
            :model-value="props.visible"
            @update:model-value="value => updateProp('visible', value)"
          />
          <PreviewSlider
            title="Spread"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.spread"
            @update:model-value="value => updateProp('spread', value)"
          />
          <PreviewSlider
            title="Depth"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.depth"
            @update:model-value="value => updateProp('depth', value)"
          />

          <PreviewSlider
            title="Corner Radius"
            :min="0"
            :max="40"
            :step="1"
            :model-value="props.radius"
            :display-value="value => `${value}px`"
            @update:model-value="value => updateProp('radius', value)"
          />
          <PreviewSlider
            title="Frame"
            :min="0"
            :max="16"
            :step="1"
            :model-value="props.frame"
            :display-value="value => `${value}px`"
            @update:model-value="value => updateProp('frame', value)"
          />
          <PreviewColorPickerCustom
            title="Frame Color"
            :color="props.frameColor"
            @change="value => updateProp('frameColor', value)"
          />
          <PreviewSwitch
            title="Shadow"
            :model-value="props.shadow"
            @update:model-value="value => updateProp('shadow', value)"
          />

          <PreviewSlider
            title="Tilt"
            :min="0"
            :max="60"
            :step="1"
            :model-value="props.tilt"
            :display-value="value => `${value}°`"
            @update:model-value="value => updateProp('tilt', value)"
          />
          <PreviewSlider
            title="Swipe Threshold"
            :min="30"
            :max="200"
            :step="10"
            :model-value="props.threshold"
            :display-value="value => `${value}px`"
            @update:model-value="value => updateProp('threshold', value)"
          />
          <PreviewSlider
            title="Speed"
            :min="0.5"
            :max="2"
            :step="0.1"
            :model-value="props.speed"
            @update:model-value="value => updateProp('speed', value)"
          />
          <PreviewSwitch
            title="Send To Back On Click"
            :model-value="props.sendToBackOnClick"
            @update:model-value="value => updateProp('sendToBackOnClick', value)"
          />

          <PreviewSwitch
            title="Autoplay"
            :model-value="props.autoplay"
            @update:model-value="value => updateProp('autoplay', value)"
          />
          <PreviewSlider
            title="Autoplay Delay"
            :min="1000"
            :max="6000"
            :step="250"
            :model-value="props.autoplayDelay"
            :display-value="value => `${value}ms`"
            @update:model-value="value => updateProp('autoplayDelay', value)"
          />
          <PreviewSwitch
            title="Pause On Hover"
            :model-value="props.pauseOnHover"
            @update:model-value="value => updateProp('pauseOnHover', value)"
          />
        </Customize>

        <PropTable :data="propData" />
        <Dependencies :dependency-list="['motion-v']" />
      </template>

      <template #code>
        <CodeExample :code-object="stack" component-name="Stack" />
      </template>
    </TabsLayout>
  </ComponentPropsProvider>
</template>

<script setup lang="ts">
import { h } from 'vue';
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
import { stack } from '@/constants/code/Components/stackCode';
import Stack, { type StackLayout } from '@/content/Components/Stack/Stack.vue';

const IMAGES = [
  'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?q=80&w=500&auto=format',
  'https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=500&auto=format',
  'https://images.unsplash.com/photo-1452626212852-811d58933cae?q=80&w=500&auto=format',
  'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?q=80&w=500&auto=format',
  'https://images.unsplash.com/photo-1782977389500-dd7adad33ebe?q=80&w=500&auto=format',
  'https://images.unsplash.com/photo-1781242629922-6f39cc3671cd?q=80&w=500&auto=format'
];

const LAYOUT_OPTIONS = [
  { label: 'Fan', value: 'fan' },
  { label: 'Cascade', value: 'cascade' },
  { label: 'Deck', value: 'deck' },
  { label: 'Pile', value: 'pile' }
];

const DEFAULT_PROPS = {
  layout: 'fan' as StackLayout,
  visible: 4,
  spread: 0.5,
  depth: 0.5,
  radius: 16,
  frame: 0,
  frameColor: '#ffffff',
  shadow: true,
  tilt: 30,
  threshold: 90,
  speed: 1,
  sendToBackOnClick: false,
  autoplay: false,
  autoplayDelay: 3000,
  pauseOnHover: false
};

const { rerenderKey, forceRerender } = useForceRerender();
const { props, updateProp, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);

const cards = IMAGES.map((src, index) => h('img', { src, alt: `Card ${index + 1}`, draggable: false }));

const propData: PropRow[] = [
  {
    name: 'cards',
    type: 'StackNode[]',
    default: 'four sample photos',
    description:
      'The cards in the stack, top first. Pass VNodes, components or strings. Images fill the card automatically, any other content works too.'
  },
  {
    name: 'layout',
    type: "'fan' | 'cascade' | 'deck' | 'pile'",
    default: "'fan'",
    description:
      'How the cards behind sit. Fan tilts them out from a corner, cascade offsets them diagonally, deck stacks them upward and pile scatters them like loose photos.'
  },
  {
    name: 'visible',
    type: 'number',
    default: '4',
    description: 'How many cards show, counting the top one. The rest wait hidden at the back.'
  },
  {
    name: 'spread',
    type: 'number',
    default: '0.5',
    description: 'How far the cards behind fan, offset or scatter, from 0 for a neat stack to 1 for a wide one.'
  },
  {
    name: 'depth',
    type: 'number',
    default: '0.5',
    description: 'How much smaller and darker each card behind gets, from 0 for none to 1 for a strong recede.'
  },
  {
    name: 'radius',
    type: 'number',
    default: '16',
    description: 'Corner radius of the cards in pixels.'
  },
  {
    name: 'frame',
    type: 'number',
    default: '0',
    description: 'Width of a border around each card in pixels, like the edge of a printed photo.'
  },
  {
    name: 'frameColor',
    type: 'string',
    default: "'#ffffff'",
    description: 'Color of the frame around each card.'
  },
  {
    name: 'shadow',
    type: 'boolean',
    default: 'true',
    description: 'Gives every card a soft drop shadow.'
  },
  {
    name: 'tilt',
    type: 'number',
    default: '30',
    description:
      'How far the top card leans in 3D while it is dragged, in degrees. It tilts around the point you hold and leans into fast moves. Use 0 to keep it flat.'
  },
  {
    name: 'threshold',
    type: 'number',
    default: '90',
    description: 'How far in pixels the top card has to be dragged before it goes to the back. A quick flick works too.'
  },
  {
    name: 'speed',
    type: 'number',
    default: '1',
    description: 'Speed of every animation, from 0.5 for slow and soft to 2 for fast and snappy.'
  },
  {
    name: 'sendToBackOnClick',
    type: 'boolean',
    default: 'false',
    description: 'Clicking the top card also sends it to the back.'
  },
  {
    name: 'autoplay',
    type: 'boolean',
    default: 'false',
    description: 'Cycles through the cards on its own.'
  },
  {
    name: 'autoplayDelay',
    type: 'number',
    default: '3000',
    description: 'Time in milliseconds between automatic cycles.'
  },
  {
    name: 'pauseOnHover',
    type: 'boolean',
    default: 'false',
    description: 'Pauses autoplay while the pointer is over the stack.'
  },
  {
    name: 'onChange',
    type: '(index: number) => void',
    default: '-',
    description: 'Called with the index of the new top card whenever the stack moves. Listen with @change.'
  },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the root element.' },
  {
    name: 'style',
    type: 'Record<string, string | number>',
    default: '-',
    description: 'Inline styles for the root element.'
  }
];
</script>
