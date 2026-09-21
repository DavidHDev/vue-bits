<template>
  <h1 class="sub-category">Swipe Row</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="swipeRow.usage"
    :source="swipeRowSource"
    component-name="SwipeRow"
    :props-table="props"
  >
    <template #preview>
      <div class="relative flex justify-center items-center p-0 h-100 overflow-hidden demo-container">
        <div class="w-[min(360px,calc(100%-48px))]">
          <Entrance v-for="row in rows" :key="row.id" :animate="row.returning" :row-height="height">
            <SwipeRow
              :label="row.title"
              :actions="actionSet"
              :open="openId === row.id"
              :action-color="actionColor"
              :drawer-color="drawerColor"
              :row-color="rowColor"
              :text-color="textColor"
              :height="height"
              :radius="radius"
              :action-width="actionWidth"
              :direction="direction"
              :snap-bounce="snapBounce"
              :resistance="resistance"
              :collapse-ms="collapseMs"
              :commit-at="commitAt"
              :full-swipe="fullSwipe"
              :disabled="disabled"
              :style="{ marginBottom: `${GAP}px` }"
              @open-change="onOpenChange(row.id, $event)"
              @commit="remove(row.id)"
            >
              <span class="inline-flex opacity-60 shrink-0">
                <HugeiconsIcon :icon="row.icon" :size="20" :stroke-width="1.8" />
              </span>
              <span class="flex-auto gap-0.5 grid min-w-0">
                <span class="overflow-hidden font-medium text-[14px] text-ellipsis leading-[1.2] whitespace-nowrap">
                  {{ row.title }}
                </span>
                <span class="opacity-60 overflow-hidden text-[12px] text-ellipsis leading-[1.2] whitespace-nowrap">
                  {{ row.subtitle }}
                </span>
              </span>
              <span class="opacity-50 text-[12px] shrink-0">{{ row.meta }}</span>
            </SwipeRow>
          </Entrance>
        </div>
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSelect title="Drawer" :options="DRAWER_OPTIONS" :width="190" v-model="drawer" />
        <PreviewColorPicker title="Action" v-model="actionColor" />
        <PreviewColorPicker title="Drawer Color" v-model="drawerColor" />
        <PreviewColorPicker title="Row" v-model="rowColor" />
        <PreviewColorPicker title="Text" v-model="textColor" />
        <PreviewSlider title="Height" :min="48" :max="88" :step="2" valueUnit="px" v-model="height" />
        <PreviewSlider title="Radius" :min="0" :max="32" :step="1" valueUnit="px" v-model="radius" />
        <PreviewSlider title="Action Width" :min="56" :max="120" :step="4" valueUnit="px" v-model="actionWidth" />
        <PreviewSelect title="Swipe" :options="DIRECTION_OPTIONS" :width="110" v-model="direction" />
        <PreviewSlider title="Flick Bounce" :min="0" :max="0.3" :step="0.02" v-model="snapBounce" />
        <PreviewSlider title="Resistance" :min="0.4" :max="1" :step="0.05" v-model="resistance" />
        <PreviewSlider title="Collapse" :min="100" :max="400" :step="20" valueUnit="ms" v-model="collapseMs" />
        <PreviewSlider title="Commit At" :min="0.4" :max="0.9" :step="0.05" v-model="commitAt" />
        <PreviewSwitch title="Full Swipe" v-model="fullSwipe" />
        <PreviewSwitch title="Disabled" v-model="disabled" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="swipe-row" :usage="swipeRow.usage!" :source="swipeRowSource" />
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
import { swipeRow } from '@/constants/code/Micro/swipeRowCode';
import SwipeRow, { type SwipeAction } from '@/content/Micro/SwipeRow/SwipeRow.vue';
import swipeRowSource from '@/content/Micro/SwipeRow/SwipeRow.vue?raw';
import {
  AirplaneTakeOff01Icon,
  Archive02Icon,
  Delete02Icon,
  Flag02Icon,
  Invoice01Icon,
  Note01Icon
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon, type IconArray } from '@hugeicons/vue';
import { computed, defineComponent, h, onMounted, onUnmounted, ref } from 'vue';

const GAP = 8;
const RETURN_MS = 1200;

const Entrance = defineComponent({
  props: { animate: Boolean, rowHeight: { type: Number, required: true } },
  setup(p, { slots }) {
    const stage = ref<'enter' | 'grow' | 'done'>(p.animate ? 'enter' : 'done');
    let frame = 0;
    onMounted(() => {
      if (p.animate) frame = requestAnimationFrame(() => (stage.value = 'grow'));
    });
    onUnmounted(() => cancelAnimationFrame(frame));
    return () => {
      const growing = stage.value !== 'done';
      return h(
        'div',
        {
          style: {
            height: stage.value === 'enter' ? '0px' : stage.value === 'grow' ? `${p.rowHeight + GAP}px` : 'auto',
            opacity: stage.value === 'enter' ? 0 : 1,
            overflow: growing ? 'hidden' : 'visible',
            transition: growing ? 'height 200ms cubic-bezier(0.23, 1, 0.32, 1), opacity 200ms ease' : 'none'
          },
          onTransitionend: (e: TransitionEvent) => {
            if (e.propertyName === 'height') stage.value = 'done';
          }
        },
        slots.default?.()
      );
    };
  }
});

const DEFAULTS = {
  drawer: 'two',
  actionColor: '#e5484d',
  drawerColor: '#3f3f46',
  rowColor: '#27272a',
  textColor: '#f5f5f5',
  height: 64,
  radius: 16,
  actionWidth: 80,
  direction: 'left' as 'left' | 'right',
  snapBounce: 0.2,
  resistance: 0.55,
  collapseMs: 200,
  commitAt: 0.6,
  fullSwipe: true,
  disabled: false
};

const DRAWER_OPTIONS = [
  { value: 'one', label: 'Delete' },
  { value: 'two', label: 'Archive, Delete' },
  { value: 'three', label: 'Flag, Archive, Delete' }
];
const DIRECTION_OPTIONS = [
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' }
];

const glyph = (icon: unknown) => () => h(HugeiconsIcon, { icon: icon as IconArray, size: 20, strokeWidth: 2 });
const ACTION_SETS: Record<string, SwipeAction[]> = {
  one: [{ id: 'delete', label: 'Delete', icon: glyph(Delete02Icon) }],
  two: [
    { id: 'delete', label: 'Delete', icon: glyph(Delete02Icon) },
    { id: 'archive', label: 'Archive', icon: glyph(Archive02Icon), dismiss: true }
  ],
  three: [
    { id: 'delete', label: 'Delete', icon: glyph(Delete02Icon) },
    { id: 'archive', label: 'Archive', icon: glyph(Archive02Icon), dismiss: true },
    { id: 'flag', label: 'Flag', icon: glyph(Flag02Icon) }
  ]
};

const ROWS = [
  {
    id: 'notes',
    icon: Note01Icon as unknown as IconArray,
    title: 'Design review notes',
    subtitle: 'Edited 2 min ago',
    meta: '9:41'
  },
  {
    id: 'flight',
    icon: AirplaneTakeOff01Icon as unknown as IconArray,
    title: 'Flight to Lisbon',
    subtitle: 'Gate changes to B12',
    meta: 'Tue'
  },
  {
    id: 'invoice',
    icon: Invoice01Icon as unknown as IconArray,
    title: 'Invoice #1042',
    subtitle: 'Due in 3 days',
    meta: '$1,280'
  }
];

const drawer = ref(DEFAULTS.drawer);
const actionColor = ref(DEFAULTS.actionColor);
const drawerColor = ref(DEFAULTS.drawerColor);
const rowColor = ref(DEFAULTS.rowColor);
const textColor = ref(DEFAULTS.textColor);
const height = ref(DEFAULTS.height);
const radius = ref(DEFAULTS.radius);
const actionWidth = ref(DEFAULTS.actionWidth);
const direction = ref(DEFAULTS.direction);
const snapBounce = ref(DEFAULTS.snapBounce);
const resistance = ref(DEFAULTS.resistance);
const collapseMs = ref(DEFAULTS.collapseMs);
const commitAt = ref(DEFAULTS.commitAt);
const fullSwipe = ref(DEFAULTS.fullSwipe);
const disabled = ref(DEFAULTS.disabled);

const actionSet = computed(() => ACTION_SETS[drawer.value] ?? ACTION_SETS.two);

const rows = ref(ROWS.map(r => ({ ...r, returning: false })));
const openId = ref<string | null>(null);
const timers: ReturnType<typeof setTimeout>[] = [];
onUnmounted(() => timers.forEach(clearTimeout));

const onOpenChange = (id: string, isOpen: boolean) => {
  openId.value = isOpen ? id : openId.value === id ? null : openId.value;
};
const remove = (id: string) => {
  const index = rows.value.findIndex(r => r.id === id);
  rows.value = rows.value.filter(r => r.id !== id);
  if (openId.value === id) openId.value = null;
  timers.push(
    setTimeout(() => {
      const next = rows.value.filter(r => r.id !== id);
      const at = Math.min(Math.max(0, index), next.length);
      next.splice(at, 0, { ...ROWS.find(r => r.id === id)!, returning: true });
      rows.value = next;
    }, RETURN_MS)
  );
};

const hasChanges = computed(
  () =>
    drawer.value !== DEFAULTS.drawer ||
    actionColor.value !== DEFAULTS.actionColor ||
    drawerColor.value !== DEFAULTS.drawerColor ||
    rowColor.value !== DEFAULTS.rowColor ||
    textColor.value !== DEFAULTS.textColor ||
    height.value !== DEFAULTS.height ||
    radius.value !== DEFAULTS.radius ||
    actionWidth.value !== DEFAULTS.actionWidth ||
    direction.value !== DEFAULTS.direction ||
    snapBounce.value !== DEFAULTS.snapBounce ||
    resistance.value !== DEFAULTS.resistance ||
    collapseMs.value !== DEFAULTS.collapseMs ||
    commitAt.value !== DEFAULTS.commitAt ||
    fullSwipe.value !== DEFAULTS.fullSwipe ||
    disabled.value !== DEFAULTS.disabled
);

function reset() {
  drawer.value = DEFAULTS.drawer;
  actionColor.value = DEFAULTS.actionColor;
  drawerColor.value = DEFAULTS.drawerColor;
  rowColor.value = DEFAULTS.rowColor;
  textColor.value = DEFAULTS.textColor;
  height.value = DEFAULTS.height;
  radius.value = DEFAULTS.radius;
  actionWidth.value = DEFAULTS.actionWidth;
  direction.value = DEFAULTS.direction;
  snapBounce.value = DEFAULTS.snapBounce;
  resistance.value = DEFAULTS.resistance;
  collapseMs.value = DEFAULTS.collapseMs;
  commitAt.value = DEFAULTS.commitAt;
  fullSwipe.value = DEFAULTS.fullSwipe;
  disabled.value = DEFAULTS.disabled;
}

const props: PropRow[] = [
  {
    name: 'default slot',
    type: 'VNode',
    default: '-',
    description: 'The row content you drag.'
  },
  {
    name: 'actions',
    type: 'SwipeAction[]',
    default: '[{ id: "delete", label: "Delete" }]',
    description:
      'The drawer, outermost first. Each has id, label, an optional icon (a component), an optional color for secondary actions, dismiss to fold the row when pressed, and onSelect. The first is the full-swipe action and always folds the row.'
  },
  {
    name: 'actionColor',
    type: 'string',
    default: '"#e5484d"',
    description: 'The full-swipe block that leaps and fills the row.'
  },
  {
    name: 'drawerColor',
    type: 'string',
    default: '"#3f3f46"',
    description: 'The drawer base and the secondary actions.'
  },
  { name: 'rowColor', type: 'string', default: '"#27272a"', description: 'The surface.' },
  { name: 'textColor', type: 'string', default: '"#f5f5f5"', description: 'Row text and the keyboard toggle.' },
  { name: 'height', type: 'number', default: '64', description: 'Row height in pixels. The fold closes from it.' },
  { name: 'radius', type: 'number', default: '16', description: 'Corner radius of the row and the clipped drawer.' },
  {
    name: 'actionWidth',
    type: 'number',
    default: '80',
    description: 'Width of each action in pixels, so the drawer width too.'
  },
  {
    name: 'direction',
    type: '"left" | "right"',
    default: '"left"',
    description: 'Which way you swipe. Everything mirrors.'
  },
  {
    name: 'snapBounce',
    type: 'number',
    default: '0.2',
    description: 'Overshoot of the open or close settle after a flick. Slow releases never bounce.'
  },
  {
    name: 'resistance',
    type: 'number',
    default: '0.55',
    description: 'How much of the finger the row keeps past the drawer, and the rubber-band beyond the commit point.'
  },
  { name: 'collapseMs', type: 'number', default: '200', description: 'How long a deleted row takes to fold shut.' },
  {
    name: 'commitAt',
    type: 'number',
    default: '0.6',
    description: 'Fraction of the row width the surface must uncover for the block to leap and a release to delete.'
  },
  {
    name: 'fullSwipe',
    type: 'boolean',
    default: 'true',
    description: 'Off, the drawer is the end: no leap, no delete.'
  },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Dims the row and ignores input.' },
  {
    name: 'open',
    type: 'boolean',
    default: 'undefined',
    description: 'Controlled open state. Outside changes settle the row.'
  },
  {
    name: '@openChange',
    type: '(open: boolean) => void',
    default: '-',
    description: 'Called when a gesture or key opens or closes the drawer.'
  },
  {
    name: '@action',
    type: '(action: SwipeAction) => void',
    default: '-',
    description: 'Called when any action button is pressed.'
  },
  {
    name: '@commit',
    type: '(action: SwipeAction) => void',
    default: '-',
    description: 'Called after a full swipe or a press on a folding action, once the row has shut. Remove the row here.'
  },
  {
    name: 'closeOnAction',
    type: 'boolean',
    default: 'true',
    description: 'Closes the drawer after an action is pressed.'
  },
  { name: 'haptic', type: 'boolean', default: 'true', description: 'A short vibration on touch when the block leaps.' },
  { name: 'label', type: 'string', default: '"List item"', description: 'Accessible name of the row.' },
  { name: 'className', type: 'string', default: '""', description: 'Extra classes for the root.' }
];
</script>
