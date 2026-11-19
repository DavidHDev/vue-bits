<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
    :demo-only-props="['feel']"
    :computed-props="computedProps"
  >
    <TabsLayout>
      <template #preview>
        <div class="demo-container relative overflow-hidden" style="min-height: 460px">
          <Dock v-bind="dockProps" :items="items" :spring="SPRINGS[props.feel] ?? SPRINGS.smooth" :theme="theme" />
        </div>

        <Customize>
          <PreviewColorPickerCustom
            title="Accent Color"
            :color="props.accentColor"
            @change="value => updateProp('accentColor', value)"
          />

          <PreviewColorPickerCustom
            title="Badge Color"
            :color="props.badgeColor"
            @change="value => updateProp('badgeColor', value)"
          />

          <PreviewSelect
            title="Position"
            :options="POSITION_OPTIONS"
            :model-value="props.position"
            @update:model-value="value => updateProp('position', value as DockSide)"
          />

          <PreviewSlider
            title="Item Size"
            :min="30"
            :max="80"
            :step="2"
            value-unit="px"
            :model-value="props.baseItemSize"
            @update:model-value="value => updateProp('baseItemSize', value)"
          />

          <PreviewSlider
            title="Magnification"
            :min="30"
            :max="140"
            :step="2"
            value-unit="px"
            :model-value="props.magnification"
            @update:model-value="value => updateProp('magnification', value)"
          />

          <PreviewSlider
            title="Distance"
            :min="60"
            :max="400"
            :step="10"
            value-unit="px"
            :model-value="props.distance"
            @update:model-value="value => updateProp('distance', value)"
          />

          <PreviewSlider
            title="Bar Height"
            :min="30"
            :max="120"
            :step="2"
            value-unit="px"
            :model-value="props.panelHeight"
            @update:model-value="value => updateProp('panelHeight', value)"
          />

          <PreviewSlider
            title="Gap"
            :min="0"
            :max="30"
            :step="1"
            value-unit="px"
            :model-value="props.gap"
            @update:model-value="value => updateProp('gap', value)"
          />

          <PreviewSlider
            title="Roundness"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.roundness"
            @update:model-value="value => updateProp('roundness', value)"
          />

          <PreviewSelect
            title="Spring"
            :options="FEEL_OPTIONS"
            :model-value="props.feel"
            @update:model-value="value => updateProp('feel', value as Feel)"
          />

          <PreviewSwitch
            title="Bounce"
            :model-value="props.bounce"
            @update:model-value="value => updateProp('bounce', value)"
          />

          <PreviewSwitch
            title="Auto Hide"
            :model-value="props.autoHide"
            @update:model-value="value => updateProp('autoHide', value)"
          />

          <PreviewSwitch
            title="Tiles"
            :model-value="props.tiles"
            @update:model-value="value => updateProp('tiles', value)"
          />

          <PreviewSwitch
            title="Labels"
            :model-value="props.showLabels"
            @update:model-value="value => updateProp('showLabels', value)"
          />

          <PreviewSwitch
            title="Indicators"
            :model-value="props.showIndicators"
            @update:model-value="value => updateProp('showIndicators', value)"
          />

          <PreviewSwitch
            title="Badges"
            :model-value="props.showBadges"
            @update:model-value="value => updateProp('showBadges', value)"
          />
        </Customize>

        <PropTable :data="propData" />
        <Dependencies :dependency-list="[]" />
      </template>

      <template #code>
        <CodeExample :code-object="dock" component-name="Dock" />
      </template>
    </TabsLayout>
  </ComponentPropsProvider>
</template>

<script setup lang="ts">
import { computed, h, ref } from 'vue';
import { HugeiconsIcon, type IconArray } from '@hugeicons/vue';
import {
  AppWindowMacIcon,
  Delete02Icon,
  Home01Icon,
  Image01Icon,
  Mail01Icon,
  Message01Icon,
  MusicNote03Icon,
  Search01Icon,
  Settings01Icon
} from '@hugeicons/core-free-icons';
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
import { useColorModeValue } from '@/composables/useTheme';
import { dock } from '@/constants/code/Components/dockCode';
import Dock, {
  type DockItemData,
  type DockMenuItem,
  type DockSide,
  type DockSpring
} from '@/content/Components/Dock/Dock.vue';

type Feel = 'smooth' | 'snappy' | 'bouncy' | 'gentle';

const DEFAULT_PROPS = {
  accentColor: '#0a84ff',
  badgeColor: '#ff453a',
  position: 'bottom' as DockSide,
  baseItemSize: 50,
  magnification: 70,
  distance: 200,
  panelHeight: 68,
  gap: 10,
  roundness: 0.5,
  feel: 'smooth' as Feel,
  bounce: true,
  autoHide: false,
  tiles: true,
  showLabels: true,
  showIndicators: true,
  showBadges: true
};

const SPRINGS: Record<Feel, DockSpring> = {
  smooth: { mass: 0.1, stiffness: 150, damping: 12 },
  snappy: { mass: 0.1, stiffness: 420, damping: 20 },
  bouncy: { mass: 0.1, stiffness: 220, damping: 4 },
  gentle: { mass: 0.2, stiffness: 120, damping: 14 }
};

const POSITION_OPTIONS = [
  { value: 'bottom', label: 'Bottom' },
  { value: 'top', label: 'Top' },
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' }
];

const FEEL_OPTIONS = [
  { value: 'smooth', label: 'Smooth' },
  { value: 'snappy', label: 'Snappy' },
  { value: 'bouncy', label: 'Bouncy' },
  { value: 'gentle', label: 'Gentle' }
];

const glyph = (icon: unknown) =>
  h(HugeiconsIcon, { icon: icon as IconArray, strokeWidth: 1.8, width: '1em', height: '1em' });

type App = { id: string; icon: unknown; label: string; windows: string[]; actions: string[] };

const APPS: (App | { separator: true })[] = [
  { id: 'home', icon: Home01Icon, label: 'Home', windows: ['Design Work', 'Downloads'], actions: ['New Window'] },
  { id: 'search', icon: Search01Icon, label: 'Search', windows: [], actions: ['New Search'] },
  { id: 'mail', icon: Mail01Icon, label: 'Mail', windows: ['Inbox'], actions: ['Get New Mail', 'New Message'] },
  { id: 'messages', icon: Message01Icon, label: 'Messages', windows: [], actions: ['New Message'] },
  { id: 'music', icon: MusicNote03Icon, label: 'Music', windows: [], actions: ['Play', 'Next', 'Previous'] },
  { id: 'photos', icon: Image01Icon, label: 'Photos', windows: [], actions: ['New Album'] },
  { id: 'settings', icon: Settings01Icon, label: 'Settings', windows: [], actions: ['General', 'Appearance'] },
  { separator: true },
  { id: 'trash', icon: Delete02Icon, label: 'Trash', windows: [], actions: [] }
];

const GLYPHS = new Map(APPS.map(app => ('id' in app ? [app.id, glyph(app.icon)] : ['', null])));
const WINDOW_GLYPH = glyph(AppWindowMacIcon);

const { props, updateProp, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);
const theme = useColorModeValue<'light' | 'dark'>('light', 'dark');

const dockProps = computed(() => {
  const { feel, ...rest } = props.value;
  void feel;
  return rest;
});

const open = ref(new Set(['home', 'mail', 'music']));
const badges = ref<Record<string, number | boolean | undefined>>({ mail: 3, messages: true });
const focused = ref<Record<string, string>>({ home: 'Design Work', mail: 'Inbox' });
const login = ref<Record<string, boolean>>({ mail: true });

const launch = (id: string) => {
  open.value = new Set(open.value).add(id);
  badges.value = { ...badges.value, [id]: undefined };
};

const quit = (id: string) => {
  const next = new Set(open.value);
  next.delete(id);
  open.value = next;
};

const menuFor = (app: App): DockMenuItem[] => {
  const running = open.value.has(app.id);
  if (app.id === 'trash') {
    return [
      { label: 'Open', onClick: () => launch(app.id) },
      { separator: true },
      { label: 'Empty Trash', disabled: true }
    ];
  }
  const windows: DockMenuItem[] = running
    ? app.windows.map(name => ({
        label: name,
        icon: WINDOW_GLYPH,
        checked: focused.value[app.id] === name,
        onClick: () => {
          focused.value = { ...focused.value, [app.id]: name };
        }
      }))
    : [];
  return [
    ...windows,
    ...(windows.length ? [{ separator: true }] : []),
    ...app.actions.map(action => ({ label: action, onClick: () => launch(app.id) })),
    ...(app.actions.length ? [{ separator: true }] : []),
    {
      label: 'Options',
      items: [
        { label: 'Keep in Dock', checked: true, disabled: true },
        {
          label: 'Open at Login',
          checked: Boolean(login.value[app.id]),
          onClick: () => {
            login.value = { ...login.value, [app.id]: !login.value[app.id] };
          }
        },
        { separator: true },
        { label: 'Show in Finder' }
      ]
    },
    { separator: true },
    { label: 'Show All Windows', disabled: !running },
    { label: 'Hide', disabled: !running },
    running ? { label: 'Quit', onClick: () => quit(app.id) } : { label: 'Open', onClick: () => launch(app.id) }
  ];
};

const items = computed<DockItemData[]>(() =>
  APPS.map(app =>
    'separator' in app
      ? app
      : {
          icon: GLYPHS.get(app.id),
          label: app.label,
          active: open.value.has(app.id),
          badge: badges.value[app.id],
          menu: menuFor(app),
          onClick: () => launch(app.id)
        }
  )
);

const computedProps = computed(() => ({
  ...(props.value.feel === 'smooth' ? {} : { spring: SPRINGS[props.value.feel] }),
  ...(theme.value === 'light' ? { theme: 'light' } : {})
}));

const propData: PropRow[] = [
  {
    name: 'items',
    type: 'DockItemData[]',
    default: '[]',
    description:
      'The apps in the dock. Each item takes an icon, label and onClick, plus optional className, active (an open app, shown with a dot), badge (a number, text, or true for a plain dot) and menu. Add { separator: true } to divide groups.'
  },
  {
    name: 'items[].menu',
    type: 'DockMenuItem[]',
    default: '-',
    description:
      'Rows of the context menu that opens on right click, long press or the menu key. Rows take label, onClick, icon, checked, disabled, shortcut and items for a submenu. Add { separator: true } for a divider.'
  },
  {
    name: 'position',
    type: "'bottom' | 'top' | 'left' | 'right'",
    default: "'bottom'",
    description:
      'The edge of the nearest positioned parent the dock sits on. Icons grow away from that edge and the dock stands vertically on the left and right.'
  },
  {
    name: 'theme',
    type: "'dark' | 'light'",
    default: "'dark'",
    description: 'Colors of the panel, tiles, labels and menus, made for dark or light pages.'
  },
  {
    name: 'baseItemSize',
    type: 'number',
    default: '50',
    description:
      'Size of each icon at rest, in px. The dock shrinks everything evenly when its parent is too small to fit it.'
  },
  {
    name: 'magnification',
    type: 'number',
    default: '70',
    description: 'Size of the icon right under the pointer, in px. Set it to baseItemSize to turn magnifying off.'
  },
  {
    name: 'distance',
    type: 'number',
    default: '200',
    description: 'How far from the pointer icons still grow, in px. Larger values spread the swell over more icons.'
  },
  {
    name: 'panelHeight',
    type: 'number',
    default: '68',
    description: 'Thickness of the dock bar, in px. Icons rise out of it as they grow.'
  },
  {
    name: 'gap',
    type: 'number',
    default: '10',
    description: 'Space between icons, in px.'
  },
  {
    name: 'roundness',
    type: 'number',
    default: '0.5',
    description: 'Corner rounding of the tiles and the bar, from square at 0 to circles at 1.'
  },
  {
    name: 'spring',
    type: '{ mass?: number; stiffness?: number; damping?: number }',
    default: '{ mass: 0.1, stiffness: 150, damping: 12 }',
    description:
      'The spring icons grow and shrink with. Higher stiffness is faster, and low damping lets icons overshoot and wobble.'
  },
  {
    name: 'bounce',
    type: 'boolean',
    default: 'true',
    description: 'Icons hop when clicked, like apps launching on macOS.'
  },
  {
    name: 'autoHide',
    type: 'boolean',
    default: 'false',
    description:
      'Slides the dock off its edge until the pointer comes near that edge of the parent. It stays out while hovered, focused or showing a menu.'
  },
  {
    name: 'tiles',
    type: 'boolean',
    default: 'true',
    description:
      'Draws a rounded tile behind each icon. Turn it off for bare glyphs, or when your icons are full app artwork.'
  },
  {
    name: 'showLabels',
    type: 'boolean',
    default: 'true',
    description: 'Shows the label of the hovered or focused icon in a tooltip.'
  },
  {
    name: 'showIndicators',
    type: 'boolean',
    default: 'true',
    description: 'Shows a dot next to items marked active, like open apps on macOS.'
  },
  {
    name: 'showBadges',
    type: 'boolean',
    default: 'true',
    description: 'Shows the notification badges set on items.'
  },
  {
    name: 'badgeColor',
    type: 'string',
    default: "'#ff453a'",
    description: 'Fill color of the notification badges.'
  },
  {
    name: 'accentColor',
    type: 'string',
    default: "'#0a84ff'",
    description: 'Color of the highlighted row in menus and of the keyboard focus ring.'
  },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the dock panel.' },
  { name: 'style', type: 'CSSProperties', default: '-', description: 'Inline styles for the dock panel.' }
];
</script>
