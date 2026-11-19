<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
  >
    <TabsLayout>
      <template #preview>
        <div class="demo-container relative overflow-hidden" style="height: 520px">
          <RefreshButton @click="restart" />
          <Shredder
            :key="run"
            :items="items"
            :width="props.width"
            :height="props.height"
            :inset="props.inset"
            :gap="props.gap"
            :slit-height="props.slitHeight"
            :fall-height="props.fallHeight"
            :feed-speed="props.feedSpeed"
            :bite="props.bite"
            :auto-feed="props.autoFeed"
            :strip-width="props.stripWidth"
            :curl="props.curl"
            :auto-animate="props.autoAnimate"
            :loop="props.loop"
            :loop-after-delete="props.loopAfterDelete"
            :drag-tilt="props.dragTilt"
            :lift="props.lift"
            :slit-color="renderedSlit"
            :color="renderedColor"
            :disabled="props.disabled"
            @shred="onShred"
            @reorder="onReorder"
          >
            <template #renderItem="{ item }">
              <div
                :style="{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: `${ROW_PAD}px 14px ${ROW_PAD}px ${ROW_PAD}px`,
                  borderRadius: `${ROW_RADIUS}px`,
                  background: surface,
                  boxSizing: 'border-box'
                }"
              >
                <img
                  :src="item.image"
                  alt=""
                  :draggable="false"
                  :style="{
                    width: '48px',
                    height: '48px',
                    borderRadius: `${ROW_RADIUS - ROW_PAD}px`,
                    objectFit: 'cover',
                    flex: 'none',
                    display: 'block',
                    filter: 'grayscale(1)'
                  }"
                />
                <div style="display: flex; flex-direction: column; gap: 4px; min-width: 0; flex: 1; text-align: left">
                  <span
                    style="
                      font-size: 14px;
                      font-weight: 500;
                      line-height: 1.2;
                      letter-spacing: -0.01em;
                      white-space: nowrap;
                      overflow: hidden;
                      text-overflow: ellipsis;
                    "
                  >
                    {{ item.title }}
                  </span>
                  <span style="font-size: 12px; line-height: 1.2; opacity: 0.5; white-space: nowrap">
                    {{ item.meta }}
                  </span>
                </div>
                <span
                  style="font-size: 12px; line-height: 1; opacity: 0.45; font-variant-numeric: tabular-nums; flex: none"
                >
                  {{ item.size }}
                </span>
              </div>
            </template>
          </Shredder>
        </div>

        <Customize>
          <PreviewSlider
            title="Feed speed"
            :min="60"
            :max="600"
            :step="10"
            value-unit="px/s"
            :model-value="props.feedSpeed"
            @update:model-value="(val: number) => updateProp('feedSpeed', val)"
          />
          <PreviewSlider
            title="Bite"
            :min="4"
            :max="40"
            :step="1"
            value-unit="px"
            :model-value="props.bite"
            @update:model-value="(val: number) => updateProp('bite', val)"
          />
          <PreviewSwitch
            title="Auto feed"
            :model-value="props.autoFeed"
            @update:model-value="(val: boolean) => updateProp('autoFeed', val)"
          />
          <PreviewSlider
            title="Strip width"
            :min="4"
            :max="40"
            :step="1"
            value-unit="px"
            :model-value="props.stripWidth"
            @update:model-value="(val: number) => updateProp('stripWidth', val)"
          />
          <PreviewSlider
            title="Curl"
            :min="0"
            :max="2"
            :step="0.1"
            :model-value="props.curl"
            @update:model-value="(val: number) => updateProp('curl', val)"
          />
          <PreviewSwitch
            title="Auto animate"
            :model-value="props.autoAnimate"
            @update:model-value="
              (val: boolean) => {
                updateProp('autoAnimate', val);
                restart();
              }
            "
          />
          <PreviewSwitch
            title="Loop"
            :model-value="props.loop"
            @update:model-value="(val: boolean) => updateProp('loop', val)"
          />
          <PreviewSwitch
            title="Loop after delete"
            :model-value="props.loopAfterDelete"
            @update:model-value="(val: boolean) => updateProp('loopAfterDelete', val)"
          />
          <PreviewSlider
            title="Drag tilt"
            :min="0"
            :max="16"
            :step="1"
            value-unit="°"
            :model-value="props.dragTilt"
            @update:model-value="(val: number) => updateProp('dragTilt', val)"
          />
          <PreviewSlider
            title="Lift"
            :min="1"
            :max="1.1"
            :step="0.01"
            :model-value="props.lift"
            @update:model-value="(val: number) => updateProp('lift', val)"
          />
          <PreviewSlider
            title="Width"
            :min="260"
            :max="460"
            :step="10"
            value-unit="px"
            :model-value="props.width"
            @update:model-value="(val: number) => updateProp('width', val)"
          />
          <PreviewSlider
            title="Height"
            :min="300"
            :max="500"
            :step="10"
            value-unit="px"
            :model-value="props.height"
            @update:model-value="(val: number) => updateProp('height', val)"
          />
          <PreviewSlider
            title="Inset"
            :min="6"
            :max="30"
            :step="1"
            value-unit="px"
            :model-value="props.inset"
            @update:model-value="(val: number) => updateProp('inset', val)"
          />
          <PreviewSlider
            title="Gap"
            :min="0"
            :max="24"
            :step="1"
            value-unit="px"
            :model-value="props.gap"
            @update:model-value="(val: number) => updateProp('gap', val)"
          />
          <PreviewSlider
            title="Slit thickness"
            :min="1"
            :max="14"
            :step="1"
            value-unit="px"
            :model-value="props.slitHeight"
            @update:model-value="(val: number) => updateProp('slitHeight', val)"
          />
          <PreviewSlider
            title="Fall height"
            :min="60"
            :max="240"
            :step="5"
            value-unit="px"
            :model-value="props.fallHeight"
            @update:model-value="(val: number) => updateProp('fallHeight', val)"
          />
          <PreviewColorPickerCustom
            title="Slit"
            :color="renderedSlit"
            @change="(val: string) => updateProp('slitColor', val)"
          />
          <PreviewColorPickerCustom
            title="Text"
            :color="renderedColor"
            @change="(val: string) => updateProp('color', val)"
          />
          <PreviewSwitch
            title="Disabled"
            :model-value="props.disabled"
            @update:model-value="(val: boolean) => updateProp('disabled', val)"
          />
        </Customize>

        <PropTable :data="propData" />
        <Dependencies :dependency-list="[]" />
      </template>

      <template #code>
        <CodeExample :code-object="shredder" component-name="Shredder" />
      </template>
    </TabsLayout>
  </ComponentPropsProvider>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import CodeExample from '@/components/common/CodeExample.vue';
import Customize from '@/components/common/Customize.vue';
import Dependencies from '@/components/common/Dependencies.vue';
import PreviewColorPickerCustom from '@/components/common/PreviewColorPickerCustom.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import RefreshButton from '@/components/common/RefreshButton.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import ComponentPropsProvider from '@/components/context/ComponentPropsProvider.vue';
import { useComponentProps } from '@/composables/useComponentProps';
import { useColorModeValue } from '@/composables/useTheme';
import { shredder } from '@/constants/code/Micro/shredderCode';
import Shredder from '@/content/Micro/Shredder/Shredder.vue';

interface FileRow {
  id: string;
  title: string;
  meta: string;
  size: string;
  image: string;
}

const photo = (id: string) => `https://images.unsplash.com/${id}?q=80&w=160&h=160&auto=format&fit=crop`;

const FILES = [
  {
    title: 'Harbour at dusk',
    meta: 'Edited yesterday',
    size: '4.1 MB',
    image: photo('photo-1782977389500-dd7adad33ebe')
  },
  {
    title: 'Studio, take two',
    meta: 'Edited 2 days ago',
    size: '2.8 MB',
    image: photo('photo-1776394254711-4a0d7345269a')
  },
  {
    title: 'Fog over the bay',
    meta: 'Edited last week',
    size: '6.3 MB',
    image: photo('photo-1781499455083-6ccc3beb20cd')
  },
  { title: 'Sunday market', meta: 'Edited 12 Mar', size: '3.5 MB', image: photo('photo-1781242629922-6f39cc3671cd') }
];

const build = (run: number): FileRow[] => FILES.map((file, i) => ({ ...file, id: `${run}-${i}` }));

const ROW_RADIUS = 12;
const ROW_PAD = 6;

const DEFAULT_PROPS = {
  width: 340,
  height: 460,
  inset: 14,
  gap: 10,
  slitHeight: 4,
  fallHeight: 140,
  feedSpeed: 180,
  bite: 18,
  autoFeed: true,
  stripWidth: 10,
  curl: 1,
  autoAnimate: false,
  loop: false,
  loopAfterDelete: false,
  dragTilt: 6,
  lift: 1.02,
  slitColor: '#3d403d',
  color: '#f5f5f5',
  disabled: false
};

const { props, updateProp, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);

const run = ref(0);
const items = ref<FileRow[]>(build(0));

const lightSlit = computed(() =>
  props.value.slitColor === DEFAULT_PROPS.slitColor ? '#161816' : props.value.slitColor
);
const lightColor = computed(() => (props.value.color === DEFAULT_PROPS.color ? '#161816' : props.value.color));
const renderedSlit = useColorModeValue(lightSlit, () => props.value.slitColor);
const renderedColor = useColorModeValue(lightColor, () => props.value.color);
const surface = useColorModeValue('#f4f6f4', '#262926');

const restart = () => {
  run.value += 1;
  items.value = build(run.value);
};

const onShred = (item: FileRow) => {
  const { autoAnimate, loop, loopAfterDelete } = props.value;
  if (!autoAnimate && !loop && !loopAfterDelete) items.value = items.value.filter(row => row.id !== item.id);
};

const onReorder = (next: FileRow[]) => {
  items.value = next;
};

const propData: PropRow[] = [
  {
    name: 'items',
    type: 'T[]',
    default: '[]',
    description: 'Rows to render, top to bottom. Each item needs a unique id.'
  },
  {
    name: '#renderItem',
    type: 'slot { item: T, index: number }',
    default: '-',
    description:
      'Renders one row. A snapshot of the rendered row is what gets cut into strips, so plain markup, inline images and inline SVG all work.'
  },
  {
    name: '@shred',
    type: '(item: T) => void',
    default: '-',
    description:
      'Emitted the moment a row has gone through the rollers. Remove the item from your list here, unless loop, loopAfterDelete or autoAnimate is on.'
  },
  {
    name: '@reorder',
    type: '(items: T[]) => void',
    default: '-',
    description: 'Emitted with the items in their new order after a row is dropped somewhere else in the list.'
  },
  { name: 'width', type: 'number', default: '340', description: 'Width of the whole machine in pixels.' },
  {
    name: 'height',
    type: 'number',
    default: '460',
    description: 'Total height. The rows stack up from the slit, which sits above the fall zone at the bottom.'
  },
  {
    name: 'inset',
    type: 'number',
    default: '14',
    description: 'Horizontal inset of the rows from the edges. The slit is 6px wider than the rows on each side.'
  },
  { name: 'gap', type: 'number', default: '10', description: 'Space between rows in pixels.' },
  {
    name: 'slitHeight',
    type: 'number',
    default: '4',
    description: 'Thickness of the slit. It is always a full pill.'
  },
  {
    name: 'fallHeight',
    type: 'number',
    default: '140',
    description: 'Height of the zone under the slit where the strips fall and fade out.'
  },
  {
    name: 'feedSpeed',
    type: 'number',
    default: '180',
    description: 'Roller speed in pixels per second. The first pull is faster and eases into it.'
  },
  {
    name: 'bite',
    type: 'number',
    default: '18',
    description: 'How far a row has to be pushed into the slit before the rollers grab it, in pixels.'
  },
  {
    name: 'autoFeed',
    type: 'boolean',
    default: 'true',
    description:
      'Grab the row as soon as it is pushed in far enough, even while it is still held. Off, it feeds only on release over the slit.'
  },
  {
    name: 'stripWidth',
    type: 'number',
    default: '10',
    description: 'Target width of each strip in pixels. The row is cut into equal columns.'
  },
  {
    name: 'curl',
    type: 'number',
    default: '1',
    description: 'How much the strips curl and wave as they come out. 0 keeps them straight.'
  },
  {
    name: 'autoAnimate',
    type: 'boolean',
    default: 'false',
    description:
      'Plays through the rows on its own, bottom to top, then brings them back and starts over. Keep the rows in your list while it runs; shred is still emitted.'
  },
  {
    name: 'loop',
    type: 'boolean',
    default: 'false',
    description: 'Once the last row has been shredded, bring them all back. Keep the rows in your list while it is on.'
  },
  {
    name: 'loopAfterDelete',
    type: 'boolean',
    default: 'false',
    description:
      'After a row is shredded it comes back a moment later at a random spot, so the list never runs dry. Keep the rows in your list while it is on.'
  },
  {
    name: 'dragTilt',
    type: 'number',
    default: '6',
    description: 'Maximum lean in degrees while a row is dragged sideways.'
  },
  { name: 'lift', type: 'number', default: '1.02', description: 'Scale of a row while it is held.' },
  { name: 'slitColor', type: 'string', default: '"#3d403d"', description: 'Colour of the slit.' },
  { name: 'color', type: 'string', default: '"#f5f5f5"', description: 'Text colour inherited by the rows.' },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Rows cannot be dragged or shredded.'
  },
  { name: 'className', type: 'string', default: '""', description: 'Extra classes for the root.' }
];
</script>
