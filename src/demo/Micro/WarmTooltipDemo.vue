<template>
  <h1 class="sub-category">Warm Tooltip</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="warmTooltip.usage"
    :source="warmTooltipSource"
    component-name="WarmTooltip"
    :props-table="props"
  >
    <template #preview>
      <div class="relative p-0 h-100 overflow-hidden demo-container">
        <WarmTooltipGroup
          :key="`${delay}-${warmWindow}-${travel}-${lean}`"
          :delay="delay"
          :warm-window="warmWindow"
          :travel="travel"
          :lean="lean ? 10 : 0"
        >
          <div class="flex gap-0.5 p-1.5 rounded-[14px] bg-[#232326]" :class="vertical ? 'flex-col' : 'flex-row'">
            <WarmTooltip
              v-for="tool in TOOLS"
              :key="tool.name"
              :content="tool.label"
              :shortcut="tool.shortcut"
              :side="side"
              :surface-color="surfaceColor"
              :ink-color="inkColor"
              :size="size"
              :radius="radius"
              :gap="gap"
              :arrow="arrow"
              :pop-duration="popDuration"
              :pop-scale="popScale"
              :pop-blur="popBlur"
              :show-fuse="showFuse"
              v-slot="{ describedby }"
            >
              <button
                type="button"
                :aria-label="tool.name"
                :aria-describedby="describedby"
                class="place-items-center grid bg-transparent hover:bg-white/10 border-0 rounded-[10px] outline-none focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 w-11 h-11 text-white transition-colors cursor-pointer"
              >
                <HugeiconsIcon :icon="tool.icon" :size="20" :stroke-width="1.8" />
              </button>
            </WarmTooltip>
          </div>
        </WarmTooltipGroup>
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewColorPicker title="Surface" v-model="surfaceColor" />
        <PreviewColorPicker title="Ink" v-model="inkColor" />
        <PreviewSelect title="Side" :options="SIDE_OPTIONS" :width="120" v-model="side" />
        <PreviewSelect title="Size" :options="SIZE_OPTIONS" :width="120" v-model="size" />
        <PreviewSlider title="Radius" :min="0" :max="16" :step="1" valueUnit="px" v-model="radius" />
        <PreviewSlider title="Gap" :min="2" :max="20" :step="1" valueUnit="px" v-model="gap" />
        <PreviewSwitch title="Arrow" v-model="arrow" />
        <PreviewSlider title="Delay" :min="0" :max="1000" :step="50" valueUnit="ms" v-model="delay" />
        <PreviewSlider title="Warm Window" :min="0" :max="2000" :step="50" valueUnit="ms" v-model="warmWindow" />
        <PreviewSlider title="Travel" :min="0" :max="800" :step="20" valueUnit="ms" v-model="travel" />
        <PreviewSlider title="Pop Duration" :min="0" :max="300" :step="5" valueUnit="ms" v-model="popDuration" />
        <PreviewSlider title="Pop Scale" :min="0.8" :max="1" :step="0.01" v-model="popScale" />
        <PreviewSlider title="Pop Blur" :min="0" :max="12" :step="1" valueUnit="px" v-model="popBlur" />
        <PreviewSwitch title="Lean" v-model="lean" />
        <PreviewSwitch title="Show Fuse" v-model="showFuse" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="warm-tooltip" :usage="warmTooltip.usage!" :source="warmTooltipSource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewColorPicker from '@/components/common/PreviewColorPicker.vue';
import PreviewSelect from '@/components/common/PreviewSelect.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { warmTooltip } from '@/constants/code/Micro/warmTooltipCode';
import WarmTooltip, {
  WarmTooltipGroup,
  type WarmTooltipSide,
  type WarmTooltipSize
} from '@/content/Micro/WarmTooltip/WarmTooltip.vue';
import warmTooltipSource from '@/content/Micro/WarmTooltip/WarmTooltip.vue?raw';
import {
  Image01Icon,
  Link01Icon,
  MoreHorizontalIcon,
  TextBoldIcon,
  TextItalicIcon,
  TextUnderlineIcon
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon, type IconArray } from '@hugeicons/vue';
import { computed, ref } from 'vue';

const icon = (i: unknown) => i as IconArray;
const TOOLS = [
  { name: 'Bold', label: 'Bold', shortcut: '⌘B', icon: icon(TextBoldIcon) },
  { name: 'Italic', label: 'Italic', shortcut: '⌘I', icon: icon(TextItalicIcon) },
  { name: 'Underline', label: 'Underline', shortcut: '⌘U', icon: icon(TextUnderlineIcon) },
  { name: 'Link', label: 'Add link', shortcut: '⌘K', icon: icon(Link01Icon) },
  { name: 'Insert image', label: 'Insert image', shortcut: undefined, icon: icon(Image01Icon) },
  { name: 'More', label: 'More options', shortcut: undefined, icon: icon(MoreHorizontalIcon) }
];

const DEFAULTS = {
  side: 'top' as WarmTooltipSide,
  surfaceColor: '#f5f5f5',
  inkColor: '#18181b',
  size: 'md' as WarmTooltipSize,
  radius: 8,
  gap: 8,
  arrow: true,
  delay: 400,
  warmWindow: 300,
  travel: 320,
  popDuration: 160,
  popScale: 0.94,
  popBlur: 4,
  lean: false,
  showFuse: false
};

const SIDE_OPTIONS = [
  { value: 'top', label: 'Top' },
  { value: 'bottom', label: 'Bottom' },
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' }
];
const SIZE_OPTIONS = [
  { value: 'sm', label: 'Small' },
  { value: 'md', label: 'Medium' },
  { value: 'lg', label: 'Large' }
];

const side = ref(DEFAULTS.side);
const surfaceColor = ref(DEFAULTS.surfaceColor);
const inkColor = ref(DEFAULTS.inkColor);
const size = ref(DEFAULTS.size);
const radius = ref(DEFAULTS.radius);
const gap = ref(DEFAULTS.gap);
const arrow = ref(DEFAULTS.arrow);
const delay = ref(DEFAULTS.delay);
const warmWindow = ref(DEFAULTS.warmWindow);
const travel = ref(DEFAULTS.travel);
const popDuration = ref(DEFAULTS.popDuration);
const popScale = ref(DEFAULTS.popScale);
const popBlur = ref(DEFAULTS.popBlur);
const lean = ref(DEFAULTS.lean);
const showFuse = ref(DEFAULTS.showFuse);

const vertical = computed(() => side.value === 'left' || side.value === 'right');

const state = {
  side,
  surfaceColor,
  inkColor,
  size,
  radius,
  gap,
  arrow,
  delay,
  warmWindow,
  travel,
  popDuration,
  popScale,
  popBlur,
  lean,
  showFuse
};
const keys = Object.keys(DEFAULTS) as (keyof typeof DEFAULTS)[];
const hasChanges = computed(() => keys.some(k => state[k].value !== DEFAULTS[k]));
function reset() {
  keys.forEach(k => ((state[k] as { value: unknown }).value = DEFAULTS[k]));
}

const props: PropRow[] = [
  { name: 'content', type: 'string', default: '-', description: 'The label. Keep it to a few words.' },
  {
    name: 'shortcut',
    type: 'string',
    default: 'undefined',
    description: 'Optional keyboard shortcut, drawn as a keycap beside the label.'
  },
  {
    name: 'default slot',
    type: '({ describedby }) => VNode',
    default: '-',
    description:
      'The trigger. Bind the slot prop describedby to its aria-describedby; its own handlers and focus ring stay untouched.'
  },
  {
    name: 'side',
    type: '"top" | "bottom" | "left" | "right"',
    default: '"top"',
    description: 'The edge the label hangs from; also where the fuse runs and the pop originates.'
  },
  {
    name: 'delay',
    type: 'number',
    default: '400',
    description: 'How long a cold open waits, in milliseconds. Inherits the group value when omitted.'
  },
  {
    name: 'warmWindow',
    type: 'number',
    default: '300',
    description: 'How long after this label closes the group stays warm. Inherits the group value when omitted.'
  },
  { name: 'surfaceColor', type: 'string', default: '"#f5f5f5"', description: 'Label background, arrow and fuse.' },
  { name: 'inkColor', type: 'string', default: '"#18181b"', description: 'Label text; the keycap is tinted from it.' },
  { name: 'size', type: '"sm" | "md" | "lg"', default: '"md"', description: 'Font size and padding of the label.' },
  { name: 'radius', type: 'number', default: '8', description: 'Corner radius of the label in pixels.' },
  { name: 'gap', type: 'number', default: '8', description: 'Distance between the trigger edge and the label.' },
  { name: 'arrow', type: 'boolean', default: 'true', description: 'Shows the pointer on the anchored edge.' },
  {
    name: 'popDuration',
    type: 'number',
    default: '160',
    description: 'Cold pop-in time in milliseconds; the exit takes 0.8 of it.'
  },
  { name: 'popScale', type: 'number', default: '0.94', description: 'Scale the label pops from. 1 makes it a fade.' },
  { name: 'popBlur', type: 'number', default: '4', description: 'Blur in pixels the label arrives through.' },
  {
    name: 'showFuse',
    type: 'boolean',
    default: 'false',
    description: 'Draws a thin line along the trigger edge that fills over the delay, or over the long press on touch.'
  },
  {
    name: 'longPress',
    type: 'number',
    default: '500',
    description: 'Hold time in milliseconds that opens the label on touch; the click that follows is swallowed.'
  },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'No open path; an open label closes.' },
  { name: 'className', type: 'string', default: '""', description: 'Extra classes for the trigger wrapper.' },
  {
    name: 'WarmTooltipGroup',
    type: 'component',
    default: '-',
    description:
      'Wraps a toolbar so its tooltips share one label. Props: delay (400), warmWindow (300), travel (320, how long the label takes to glide to the next trigger; 0 hops), lean (0, degrees of tilt while gliding), @warmChange. Exposes reset().'
  }
];
</script>
