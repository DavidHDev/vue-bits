<template>
  <h1 class="sub-category">Shredder</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="shredder.usage"
    :source="shredderSource"
    component-name="Shredder"
    :props-table="props"
  >
    <template #preview>
      <div class="relative p-0 h-130 overflow-hidden demo-container">
        <RefreshButton @click="restart" />
        <Shredder
          :key="run"
          :items="items"
          :width="width"
          :height="height"
          :inset="inset"
          :gap="gap"
          :slit-height="slitHeight"
          :fall-height="fallHeight"
          :feed-speed="feedSpeed"
          :bite="bite"
          :auto-feed="autoFeed"
          :strip-width="stripWidth"
          :curl="curl"
          :auto-animate="autoAnimate"
          :loop="loop"
          :loop-after-delete="loopAfterDelete"
          :drag-tilt="dragTilt"
          :lift="lift"
          :slit-color="slitColor"
          :color="color"
          :disabled="disabled"
          @shred="onShred"
          @reorder="items = $event"
        >
          <template #default="{ item }">
            <div
              class="box-border flex items-center gap-3 p-1.5"
              style="padding-right: 14px; border-radius: 12px"
              :style="{ background: surface }"
            >
              <img
                :src="item.image"
                alt=""
                draggable="false"
                class="block flex-none rounded-[6px] w-12 h-12 object-cover"
                style="filter: grayscale(1)"
              />
              <div class="flex-1 gap-1 grid min-w-0 text-left">
                <span
                  class="overflow-hidden font-medium text-[14px] text-ellipsis leading-[1.2] tracking-[-0.01em] whitespace-nowrap"
                >
                  {{ item.title }}
                </span>
                <span class="opacity-50 text-[12px] leading-[1.2] whitespace-nowrap">{{ item.meta }}</span>
              </div>
              <span class="flex-none opacity-45 tabular-nums text-[12px] leading-none">{{ item.size }}</span>
            </div>
          </template>
        </Shredder>
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSlider title="Feed speed" :min="60" :max="600" :step="10" valueUnit="px/s" v-model="feedSpeed" />
        <PreviewSlider title="Bite" :min="4" :max="40" :step="1" valueUnit="px" v-model="bite" />
        <PreviewSwitch title="Auto feed" v-model="autoFeed" />
        <PreviewSlider title="Strip width" :min="4" :max="40" :step="1" valueUnit="px" v-model="stripWidth" />
        <PreviewSlider title="Curl" :min="0" :max="2" :step="0.1" v-model="curl" />
        <PreviewSwitch
          title="Auto animate"
          :model-value="autoAnimate"
          @update:model-value="setAutoAnimate($event as boolean)"
        />
        <PreviewSwitch title="Loop" v-model="loop" />
        <PreviewSwitch title="Loop after delete" v-model="loopAfterDelete" />
        <PreviewSlider title="Drag tilt" :min="0" :max="16" :step="1" valueUnit="°" v-model="dragTilt" />
        <PreviewSlider title="Lift" :min="1" :max="1.1" :step="0.01" v-model="lift" />
        <PreviewSlider title="Width" :min="260" :max="460" :step="10" valueUnit="px" v-model="width" />
        <PreviewSlider title="Height" :min="300" :max="500" :step="10" valueUnit="px" v-model="height" />
        <PreviewSlider title="Inset" :min="6" :max="30" :step="1" valueUnit="px" v-model="inset" />
        <PreviewSlider title="Gap" :min="0" :max="24" :step="1" valueUnit="px" v-model="gap" />
        <PreviewSlider title="Slit thickness" :min="1" :max="14" :step="1" valueUnit="px" v-model="slitHeight" />
        <PreviewSlider title="Fall height" :min="60" :max="240" :step="5" valueUnit="px" v-model="fallHeight" />
        <PreviewColorPicker title="Slit" v-model="slitColor" />
        <PreviewColorPicker title="Text" v-model="color" />
        <PreviewSwitch title="Disabled" v-model="disabled" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="shredder" :usage="shredder.usage!" :source="shredderSource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewColorPicker from '@/components/common/PreviewColorPicker.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import RefreshButton from '@/components/common/RefreshButton.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { shredder } from '@/constants/code/Micro/shredderCode';
import Shredder from '@/content/Micro/Shredder/Shredder.vue';
import shredderSource from '@/content/Micro/Shredder/Shredder.vue?raw';
import { computed, ref } from 'vue';

interface FileItem {
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
const build = (run: number): FileItem[] => FILES.map((file, i) => ({ ...file, id: `${run}-${i}` }));

const DEFAULTS = {
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
  slitColor: '#3f3f46',
  color: '#f5f5f5',
  disabled: false
};

const surface = '#27272a';

const width = ref(DEFAULTS.width);
const height = ref(DEFAULTS.height);
const inset = ref(DEFAULTS.inset);
const gap = ref(DEFAULTS.gap);
const slitHeight = ref(DEFAULTS.slitHeight);
const fallHeight = ref(DEFAULTS.fallHeight);
const feedSpeed = ref(DEFAULTS.feedSpeed);
const bite = ref(DEFAULTS.bite);
const autoFeed = ref(DEFAULTS.autoFeed);
const stripWidth = ref(DEFAULTS.stripWidth);
const curl = ref(DEFAULTS.curl);
const autoAnimate = ref(DEFAULTS.autoAnimate);
const loop = ref(DEFAULTS.loop);
const loopAfterDelete = ref(DEFAULTS.loopAfterDelete);
const dragTilt = ref(DEFAULTS.dragTilt);
const lift = ref(DEFAULTS.lift);
const slitColor = ref(DEFAULTS.slitColor);
const color = ref(DEFAULTS.color);
const disabled = ref(DEFAULTS.disabled);

const run = ref(0);
const items = ref<FileItem[]>(build(0));

const restart = () => {
  run.value++;
  items.value = build(run.value);
};
const setAutoAnimate = (val: boolean) => {
  autoAnimate.value = val;
  restart();
};
const onShred = (item: FileItem) => {
  if (!autoAnimate.value && !loop.value && !loopAfterDelete.value) {
    items.value = items.value.filter(row => row.id !== item.id);
  }
};

const state = {
  width,
  height,
  inset,
  gap,
  slitHeight,
  fallHeight,
  feedSpeed,
  bite,
  autoFeed,
  stripWidth,
  curl,
  autoAnimate,
  loop,
  loopAfterDelete,
  dragTilt,
  lift,
  slitColor,
  color,
  disabled
};
const keys = Object.keys(DEFAULTS) as (keyof typeof DEFAULTS)[];
const hasChanges = computed(() => keys.some(k => state[k].value !== DEFAULTS[k]));
function reset() {
  keys.forEach(k => ((state[k] as { value: unknown }).value = DEFAULTS[k]));
  restart();
}

const props: PropRow[] = [
  {
    name: 'items',
    type: 'T[]',
    default: '[]',
    description: 'Rows to render, top to bottom. Each item needs a unique id.'
  },
  {
    name: 'default slot',
    type: '({ item, index }) => VNode',
    default: '-',
    description:
      'Renders one row. A snapshot of the rendered row is what gets cut into strips, so plain markup, inline images and inline SVG all work.'
  },
  {
    name: '@shred',
    type: '(item: T) => void',
    default: '-',
    description:
      'Called the moment a row has gone through the rollers. Remove the item from your list here, unless loop, loopAfterDelete or autoAnimate is on.'
  },
  {
    name: '@reorder',
    type: '(items: T[]) => void',
    default: '-',
    description: 'Called with the items in their new order after a row is dropped somewhere else in the list.'
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
  { name: 'slitHeight', type: 'number', default: '4', description: 'Thickness of the slit. It is always a full pill.' },
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
      'Plays through the rows on its own, bottom to top, then brings them back and starts over. Keep the rows in your list while it runs; @shred still fires.'
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
  { name: 'slitColor', type: 'string', default: '"#3f3f46"', description: 'Colour of the slit.' },
  { name: 'color', type: 'string', default: '"#f5f5f5"', description: 'Text colour inherited by the rows.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Rows cannot be dragged or shredded.' },
  { name: 'className', type: 'string', default: '""', description: 'Extra classes for the root.' }
];
</script>
