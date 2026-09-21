<template>
  <h1 class="sub-category">Swipe Toast</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="swipeToast.usage"
    :source="swipeToastSource"
    component-name="SwipeToast"
    :props-table="props"
  >
    <template #preview>
      <div class="relative p-0 h-100 overflow-hidden demo-container">
        <RefreshButton @click="reset" />
        <button
          type="button"
          class="inline-flex top-6 left-1/2 absolute justify-center items-center gap-2 bg-transparent hover:bg-white/8 active:bg-white/12 px-3 border-0 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-white/40 min-w-8 h-8 font-medium text-[13px] text-white/25 hover:text-white whitespace-nowrap transition-colors -translate-x-1/2 cursor-pointer"
          @click="show"
        >
          Show toast
        </button>
        <div class="right-6 bottom-8 left-6 absolute flex flex-col items-end">
          <SwipeToast
            v-for="toast in toasts"
            :key="toast.id"
            :open="toast.open"
            :title="title"
            :description="description"
            :action-label="actionLabel"
            :background="background"
            :color="color"
            :fuse-color="fuseColor"
            :width="width"
            :radius="radius"
            :slide-ms="slideMs"
            :settle-bounce="settleBounce"
            :swipe-distance="swipeDistance"
            :duration="duration"
            :fuse="fuse"
            :pause-on-hover="pauseOnHover"
            :close-button="closeButton"
            :inline="inline"
            @close="remove(toast.id)"
          >
            <template #icon>
              <HugeiconsIcon :icon="checkIcon" :size="18" :stroke-width="2" />
            </template>
          </SwipeToast>
        </div>
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewInput title="Title" :maxlength="32" v-model="title" />
        <PreviewInput title="Description" :maxlength="48" v-model="description" />
        <PreviewInput title="Action Label" :maxlength="12" v-model="actionLabel" />
        <PreviewColorPicker title="Background" v-model="background" />
        <PreviewColorPicker title="Text" v-model="color" />
        <PreviewColorPicker title="Fuse" v-model="fuseColor" />
        <PreviewSlider title="Width" :min="280" :max="420" :step="4" valueUnit="px" v-model="width" />
        <PreviewSlider title="Radius" :min="0" :max="24" :step="1" valueUnit="px" v-model="radius" />
        <PreviewSlider title="Slide" :min="200" :max="700" :step="20" valueUnit="ms" v-model="slideMs" />
        <PreviewSlider title="Settle Bounce" :min="0" :max="0.4" :step="0.02" v-model="settleBounce" />
        <PreviewSlider title="Swipe Distance" :min="12" :max="96" :step="2" valueUnit="px" v-model="swipeDistance" />
        <PreviewSlider title="Duration" :min="0" :max="10000" :step="250" valueUnit="ms" v-model="duration" />
        <PreviewSelect title="Fuse" :options="FUSE_OPTIONS" :width="120" v-model="fuse" />
        <PreviewSwitch title="Pause On Hover" v-model="pauseOnHover" />
        <PreviewSwitch title="Close Button" v-model="closeButton" />
        <PreviewSwitch title="Inline" v-model="inline" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="swipe-toast" :usage="swipeToast.usage!" :source="swipeToastSource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewColorPicker from '@/components/common/PreviewColorPicker.vue';
import PreviewInput from '@/components/common/PreviewInput.vue';
import PreviewSelect from '@/components/common/PreviewSelect.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import RefreshButton from '@/components/common/RefreshButton.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { swipeToast } from '@/constants/code/Micro/swipeToastCode';
import SwipeToast, { type SwipeToastFuse } from '@/content/Micro/SwipeToast/SwipeToast.vue';
import swipeToastSource from '@/content/Micro/SwipeToast/SwipeToast.vue?raw';
import { CheckmarkCircle02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon, type IconArray } from '@hugeicons/vue';
import { computed, onMounted, ref } from 'vue';

const checkIcon = CheckmarkCircle02Icon as unknown as IconArray;

const DEFAULTS = {
  title: 'File archived',
  description: 'Moved to Archive',
  actionLabel: 'Undo',
  background: '#27272a',
  color: '#f5f5f5',
  fuseColor: '#f5a524',
  width: 356,
  radius: 12,
  slideMs: 400,
  settleBounce: 0.2,
  swipeDistance: 40,
  duration: 4000,
  fuse: 'bottom' as SwipeToastFuse,
  pauseOnHover: true,
  closeButton: false,
  inline: true
};

const FUSE_OPTIONS = [
  { value: 'bottom', label: 'Bottom' },
  { value: 'top', label: 'Top' },
  { value: 'none', label: 'None' }
];
const MAX_TOASTS = 3;

const title = ref(DEFAULTS.title);
const description = ref(DEFAULTS.description);
const actionLabel = ref(DEFAULTS.actionLabel);
const background = ref(DEFAULTS.background);
const color = ref(DEFAULTS.color);
const fuseColor = ref(DEFAULTS.fuseColor);
const width = ref(DEFAULTS.width);
const radius = ref(DEFAULTS.radius);
const slideMs = ref(DEFAULTS.slideMs);
const settleBounce = ref(DEFAULTS.settleBounce);
const swipeDistance = ref(DEFAULTS.swipeDistance);
const duration = ref(DEFAULTS.duration);
const fuse = ref(DEFAULTS.fuse);
const pauseOnHover = ref(DEFAULTS.pauseOnHover);
const closeButton = ref(DEFAULTS.closeButton);
const inline = ref(DEFAULTS.inline);

const toasts = ref<{ id: number; open: boolean }[]>([]);
let nextId = 0;
const show = () => {
  const next = [...toasts.value, { id: nextId++, open: true }];
  const live = next.filter(t => t.open);
  toasts.value = live.length > MAX_TOASTS ? next.map(t => (t.id === live[0].id ? { ...t, open: false } : t)) : next;
};
const remove = (id: number) => {
  toasts.value = toasts.value.filter(t => t.id !== id);
};
onMounted(show);

const hasChanges = computed(
  () =>
    title.value !== DEFAULTS.title ||
    description.value !== DEFAULTS.description ||
    actionLabel.value !== DEFAULTS.actionLabel ||
    background.value !== DEFAULTS.background ||
    color.value !== DEFAULTS.color ||
    fuseColor.value !== DEFAULTS.fuseColor ||
    width.value !== DEFAULTS.width ||
    radius.value !== DEFAULTS.radius ||
    slideMs.value !== DEFAULTS.slideMs ||
    settleBounce.value !== DEFAULTS.settleBounce ||
    swipeDistance.value !== DEFAULTS.swipeDistance ||
    duration.value !== DEFAULTS.duration ||
    fuse.value !== DEFAULTS.fuse ||
    pauseOnHover.value !== DEFAULTS.pauseOnHover ||
    closeButton.value !== DEFAULTS.closeButton ||
    inline.value !== DEFAULTS.inline
);

function reset() {
  title.value = DEFAULTS.title;
  description.value = DEFAULTS.description;
  actionLabel.value = DEFAULTS.actionLabel;
  background.value = DEFAULTS.background;
  color.value = DEFAULTS.color;
  fuseColor.value = DEFAULTS.fuseColor;
  width.value = DEFAULTS.width;
  radius.value = DEFAULTS.radius;
  slideMs.value = DEFAULTS.slideMs;
  settleBounce.value = DEFAULTS.settleBounce;
  swipeDistance.value = DEFAULTS.swipeDistance;
  duration.value = DEFAULTS.duration;
  fuse.value = DEFAULTS.fuse;
  pauseOnHover.value = DEFAULTS.pauseOnHover;
  closeButton.value = DEFAULTS.closeButton;
  inline.value = DEFAULTS.inline;
  toasts.value = [];
  show();
}

const props: PropRow[] = [
  { name: 'title', type: 'string', default: '"File archived"', description: 'The first line.' },
  { name: 'description', type: 'string', default: '""', description: 'The dimmer second line. Empty hides it.' },
  { name: '#icon', type: 'slot', default: '-', description: 'An 18px icon before the text.' },
  { name: 'actionLabel', type: 'string', default: '""', description: 'The inverted button. Empty hides it.' },
  {
    name: '@action',
    type: '() => void',
    default: '-',
    description: 'Called when the action is pressed, before the close.'
  },
  {
    name: 'open',
    type: 'boolean',
    default: 'true',
    description: 'Flip to false to close from outside. True again re-enters.'
  },
  {
    name: '@close',
    type: '(reason) => void',
    default: '-',
    description:
      'Called after the exit, and after the inline slot has collapsed. Reason is timeout, swipe, action, close, escape or programmatic.'
  },
  { name: 'background', type: 'string', default: '"#27272a"', description: 'The card surface, and the action text.' },
  {
    name: 'color',
    type: 'string',
    default: '"#f5f5f5"',
    description: 'Ink: title, description at 62% and the action fill.'
  },
  { name: 'fuseColor', type: 'string', default: '"#f5a524"', description: 'The burning line.' },
  {
    name: 'width',
    type: 'number',
    default: '356',
    description: 'Card width in pixels, capped at the parent when inline.'
  },
  { name: 'radius', type: 'number', default: '12', description: 'Corner radius in pixels.' },
  { name: 'slideMs', type: 'number', default: '400', description: 'How long the rise and the drop take.' },
  {
    name: 'settleBounce',
    type: 'number',
    default: '0.2',
    description: 'Overshoot of the return after an abandoned swipe. 0 stops dead.'
  },
  {
    name: 'swipeDistance',
    type: 'number',
    default: '40',
    description: 'How far a slow drag must go before release dismisses. A flick always does.'
  },
  {
    name: 'duration',
    type: 'number',
    default: '4000',
    description: 'Milliseconds until it closes itself. Changing it re-arms the fuse. 0 keeps it until dismissed.'
  },
  {
    name: 'fuse',
    type: '"bottom" | "top" | "none"',
    default: '"bottom"',
    description: 'Which edge the line burns along. None keeps the timer but shows nothing.'
  },
  { name: 'pauseOnHover', type: 'boolean', default: 'true', description: 'Hovering freezes the line and the timer.' },
  { name: 'closeButton', type: 'boolean', default: 'false', description: 'Adds a cross at the end of the row.' },
  {
    name: 'inline',
    type: 'boolean',
    default: 'false',
    description: 'In flow inside the parent instead of fixed to the bottom-right of the viewport.'
  },
  { name: 'dismissible', type: 'boolean', default: 'true', description: 'Off removes the swipe and Escape.' },
  { name: 'className', type: 'string', default: '""', description: 'Extra classes for the root.' }
];
</script>
