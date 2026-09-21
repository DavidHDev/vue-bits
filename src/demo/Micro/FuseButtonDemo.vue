<template>
  <h1 class="sub-category">Fuse Button</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="fuseButton.usage"
    :source="fuseButtonSource"
    component-name="FuseButton"
    :props-table="props"
  >
    <template #preview>
      <div class="relative p-0 h-100 overflow-hidden demo-container">
        <RefreshButton @click="forceRerender" />
        <FuseButton
          :key="`${preset}-${key}`"
          :label="content.label"
          :undo-label="content.undoLabel"
          :done-label="content.doneLabel"
          :color="color"
          :background="background"
          :fuse-color="renderedFuse"
          :size="size"
          :radius="radius"
          :undo-window="undoWindow"
          :fuse="fuse"
          :fuse-thickness="fuseThickness"
          :crossfade-ms="crossfadeMs"
          :commit-on="commitOn"
          :pause-on-hover="pauseOnHover"
          :settle="settle"
          :disabled="disabled"
        >
          <template #icon>
            <HugeiconsIcon :icon="content.icon" :size="iconSize" :stroke-width="1.8" />
          </template>
        </FuseButton>
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSelect title="Preset" :options="PRESET_OPTIONS" :width="120" v-model="preset" />
        <PreviewColorPicker title="Text" v-model="color" />
        <PreviewColorPicker title="Background" v-model="background" />
        <PreviewColorPicker title="Fuse" :model-value="renderedFuse" @update:model-value="fuseColor = $event" />
        <PreviewSelect title="Size" :options="SIZE_OPTIONS" :width="120" v-model="size" />
        <PreviewSlider title="Radius" :min="0" :max="26" :step="1" valueUnit="px" v-model="radius" />
        <PreviewSlider title="Undo Window" :min="1000" :max="10000" :step="500" valueUnit="ms" v-model="undoWindow" />
        <PreviewSelect title="Fuse" :options="FUSE_OPTIONS" :width="120" v-model="fuse" />
        <PreviewSlider title="Fuse Thickness" :min="1" :max="4" :step="0.5" valueUnit="px" v-model="fuseThickness" />
        <PreviewSlider title="Crossfade" :min="100" :max="300" :step="10" valueUnit="ms" v-model="crossfadeMs" />
        <PreviewSelect title="Commit On" :options="COMMIT_OPTIONS" :width="160" v-model="commitOn" />
        <PreviewSelect title="After Fuse" :options="SETTLE_OPTIONS" :width="130" v-model="settle" />
        <PreviewSwitch title="Pause On Hover" v-model="pauseOnHover" />
        <PreviewSwitch title="Disabled" v-model="disabled" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="fuse-button" :usage="fuseButton.usage!" :source="fuseButtonSource" />
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
import RefreshButton from '@/components/common/RefreshButton.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { fuseButton } from '@/constants/code/Micro/fuseButtonCode';
import FuseButton, {
  type FuseCommitOn,
  type FusePosition,
  type FuseSettle,
  type FuseSize
} from '@/content/Micro/FuseButton/FuseButton.vue';
import fuseButtonSource from '@/content/Micro/FuseButton/FuseButton.vue?raw';
import { Archive02Icon, Delete02Icon, SentIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon, type IconArray } from '@hugeicons/vue';
import { computed, ref } from 'vue';

const { rerenderKey: key, forceRerender } = useForceRerender();

type PresetKey = 'archive' | 'send' | 'delete';

const DEFAULTS = {
  preset: 'archive' as PresetKey,
  color: '#f5f5f5',
  background: '#27272a',
  fuseColor: '#f5a524',
  size: 'md' as FuseSize,
  radius: 22,
  undoWindow: 4000,
  fuse: 'outline' as FusePosition,
  fuseThickness: 1.5,
  crossfadeMs: 200,
  commitOn: 'press' as FuseCommitOn,
  pauseOnHover: true,
  settle: 'reset' as FuseSettle,
  disabled: false
};

const PRESETS: Record<
  PresetKey,
  { label: string; undoLabel: string; doneLabel: string; icon: IconArray; fuse: string }
> = {
  archive: {
    label: 'Archive',
    undoLabel: 'Undo',
    doneLabel: 'Archived',
    icon: Archive02Icon as IconArray,
    fuse: '#f5a524'
  },
  send: { label: 'Send', undoLabel: 'Undo', doneLabel: 'Sent', icon: SentIcon as IconArray, fuse: '#5b8def' },
  delete: {
    label: 'Delete',
    undoLabel: 'Undo',
    doneLabel: 'Deleted',
    icon: Delete02Icon as IconArray,
    fuse: '#e5484d'
  }
};

const PRESET_OPTIONS = [
  { value: 'archive', label: 'Archive' },
  { value: 'send', label: 'Send' },
  { value: 'delete', label: 'Delete' }
];

const SIZE_OPTIONS = [
  { value: 'sm', label: 'Small' },
  { value: 'md', label: 'Medium' },
  { value: 'lg', label: 'Large' }
];

const FUSE_OPTIONS = [
  { value: 'outline', label: 'Outline' },
  { value: 'bottom', label: 'Bottom' },
  { value: 'top', label: 'Top' }
];

const COMMIT_OPTIONS = [
  { value: 'press', label: 'On press' },
  { value: 'fuseEnd', label: 'When fuse ends' }
];

const SETTLE_OPTIONS = [
  { value: 'reset', label: 'Reset' },
  { value: 'stay', label: 'Stay done' }
];

const preset = ref(DEFAULTS.preset);
const color = ref(DEFAULTS.color);
const background = ref(DEFAULTS.background);
const fuseColor = ref(DEFAULTS.fuseColor);
const size = ref(DEFAULTS.size);
const radius = ref(DEFAULTS.radius);
const undoWindow = ref(DEFAULTS.undoWindow);
const fuse = ref(DEFAULTS.fuse);
const fuseThickness = ref(DEFAULTS.fuseThickness);
const crossfadeMs = ref(DEFAULTS.crossfadeMs);
const commitOn = ref(DEFAULTS.commitOn);
const pauseOnHover = ref(DEFAULTS.pauseOnHover);
const settle = ref(DEFAULTS.settle);
const disabled = ref(DEFAULTS.disabled);

const content = computed(() => PRESETS[preset.value] || PRESETS.archive);
const renderedFuse = computed(() => (fuseColor.value === DEFAULTS.fuseColor ? content.value.fuse : fuseColor.value));
const iconSize = computed(() => (size.value === 'sm' ? 14 : size.value === 'lg' ? 17 : 15));

const hasChanges = computed(
  () =>
    preset.value !== DEFAULTS.preset ||
    color.value !== DEFAULTS.color ||
    background.value !== DEFAULTS.background ||
    fuseColor.value !== DEFAULTS.fuseColor ||
    size.value !== DEFAULTS.size ||
    radius.value !== DEFAULTS.radius ||
    undoWindow.value !== DEFAULTS.undoWindow ||
    fuse.value !== DEFAULTS.fuse ||
    fuseThickness.value !== DEFAULTS.fuseThickness ||
    crossfadeMs.value !== DEFAULTS.crossfadeMs ||
    commitOn.value !== DEFAULTS.commitOn ||
    pauseOnHover.value !== DEFAULTS.pauseOnHover ||
    settle.value !== DEFAULTS.settle ||
    disabled.value !== DEFAULTS.disabled
);

function reset() {
  preset.value = DEFAULTS.preset;
  color.value = DEFAULTS.color;
  background.value = DEFAULTS.background;
  fuseColor.value = DEFAULTS.fuseColor;
  size.value = DEFAULTS.size;
  radius.value = DEFAULTS.radius;
  undoWindow.value = DEFAULTS.undoWindow;
  fuse.value = DEFAULTS.fuse;
  fuseThickness.value = DEFAULTS.fuseThickness;
  crossfadeMs.value = DEFAULTS.crossfadeMs;
  commitOn.value = DEFAULTS.commitOn;
  pauseOnHover.value = DEFAULTS.pauseOnHover;
  settle.value = DEFAULTS.settle;
  disabled.value = DEFAULTS.disabled;
  forceRerender();
}

const props: PropRow[] = [
  { name: 'label', type: 'string', default: '"Archive"', description: 'The idle action.' },
  {
    name: 'undoLabel',
    type: 'string',
    default: '"Undo"',
    description: 'The label while the fuse burns; the whole pill is the Undo button.'
  },
  {
    name: 'doneLabel',
    type: 'string',
    default: '"Archived"',
    description: 'Shown with a check once the fuse burns out and settle is stay; announced to screen readers on arm.'
  },
  {
    name: 'icon (slot)',
    type: 'slot',
    default: 'Archive icon',
    description: 'The idle glyph; an archive icon when omitted.'
  },
  {
    name: 'color',
    type: 'string',
    default: '"#f5f5f5"',
    description: 'Ink for labels and icons; the seam and tints derive from it.'
  },
  { name: 'background', type: 'string', default: '"#27272a"', description: 'The pill surface.' },
  { name: 'fuseColor', type: 'string', default: '"#f5a524"', description: 'The lit line or ring.' },
  {
    name: 'size',
    type: '"sm" | "md" | "lg"',
    default: '"md"',
    description: 'Height 36, 44 or 52 pixels with matching type and icons.'
  },
  {
    name: 'radius',
    type: 'number',
    default: '22',
    description: 'Corner radius in pixels; 22 is a full pill at the medium size.'
  },
  {
    name: 'undoWindow',
    type: 'number',
    default: '4000',
    description: 'How long the fuse burns and Undo stays on offer, in milliseconds.'
  },
  {
    name: 'fuse',
    type: '"outline" | "bottom" | "top"',
    default: '"outline"',
    description: 'The pill rim burning down clockwise, or a line along the bottom or top edge.'
  },
  { name: 'fuseThickness', type: 'number', default: '1.5', description: 'Line height or rim stroke in pixels.' },
  {
    name: 'crossfadeMs',
    type: 'number',
    default: '200',
    description: 'Blur crossfade between faces after a pointer press. Keyboard commits swap instantly.'
  },
  {
    name: 'commitOn',
    type: '"press" | "fuseEnd"',
    default: '"press"',
    description: 'When @commit fires: at the press, with Undo as the revert, or only once the fuse burns out.'
  },
  {
    name: 'pauseOnHover',
    type: 'boolean',
    default: 'true',
    description: 'Leaving and coming back with a mouse freezes the fuse until the pointer leaves again.'
  },
  {
    name: 'settle',
    type: '"reset" | "stay"',
    default: '"reset"',
    description: 'After the fuse ends: return to the idle face, or stay on a terminal done face until remounted.'
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Dims the idle face and ignores presses. Undo stays available while armed.'
  },
  { name: '@commit', type: '(reason: "press" | "fuseEnd") => void', default: '-', description: 'The action.' },
  {
    name: '@undo',
    type: '() => void',
    default: '-',
    description: 'Emitted when Undo or Escape runs the action back.'
  },
  {
    name: '@fuseEnd',
    type: '() => void',
    default: '-',
    description: 'Emitted when the window closes without an undo.'
  },
  {
    name: '@phaseChange',
    type: '(phase: "idle" | "armed" | "settled") => void',
    default: '-',
    description: 'Emitted on every phase change.'
  },
  {
    name: 'type',
    type: '"button" | "submit" | "reset"',
    default: '"button"',
    description: 'Type of the idle button.'
  },
  { name: 'className', type: 'string', default: '""', description: 'Extra classes for the pill.' }
];
</script>
