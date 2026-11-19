<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
    :demo-only-props="['preset', 'accentColor']"
    :computed-props="computedProps"
  >
    <TabsLayout>
      <template #preview>
        <div class="demo-container relative overflow-hidden" style="height: 540px; padding: 16px">
          <AnimatedList
            :key="`${props.preset}-${settings.animation}-${rerenderKey}`"
            v-bind="settings"
            :items="items"
            :accent-color="props.accentColor || undefined"
            :theme="theme"
          />
          <RefreshButton @click="forceRerender" />
        </div>

        <Customize>
          <PreviewSelect
            title="Preset"
            :options="PRESET_OPTIONS"
            :model-value="props.preset"
            @update:model-value="applyPreset"
          />
          <PreviewSelect
            title="Animation"
            :options="ANIMATION_OPTIONS"
            :model-value="settings.animation"
            @update:model-value="value => updateProp('animation', value as Animation)"
          />
          <PreviewColorPickerCustom
            title="Accent Color"
            :color="props.accentColor || ink"
            @change="value => updateProp('accentColor', value)"
          />
          <PreviewSlider
            title="Width"
            :min="260"
            :max="560"
            :step="10"
            value-unit="px"
            :model-value="settings.width"
            @update:model-value="value => updateProp('width', value)"
          />
          <PreviewSlider
            title="Max Height"
            :min="200"
            :max="480"
            :step="10"
            value-unit="px"
            :model-value="settings.maxHeight"
            @update:model-value="value => updateProp('maxHeight', value)"
          />
          <PreviewSlider
            title="Radius"
            :min="0"
            :max="24"
            :step="1"
            value-unit="px"
            :model-value="settings.radius"
            @update:model-value="value => updateProp('radius', value)"
          />
          <PreviewSlider
            title="Gap"
            :min="0"
            :max="20"
            :step="1"
            value-unit="px"
            :model-value="settings.gap"
            @update:model-value="value => updateProp('gap', value)"
          />
          <PreviewSlider
            title="Stagger"
            :min="0"
            :max="0.15"
            :step="0.01"
            value-unit="s"
            :model-value="settings.stagger"
            @update:model-value="value => updateProp('stagger', value)"
          />
          <PreviewSlider
            title="Fade Size"
            :min="16"
            :max="120"
            :step="4"
            value-unit="px"
            :is-disabled="!settings.showGradients"
            :model-value="settings.fadeSize"
            @update:model-value="value => updateProp('fadeSize', value)"
          />
          <PreviewSwitch
            title="Frame"
            :model-value="settings.frame"
            @update:model-value="value => updateProp('frame', value)"
          />
          <PreviewSwitch
            title="Edge Fades"
            :model-value="settings.showGradients"
            @update:model-value="value => updateProp('showGradients', value)"
          />
          <PreviewSwitch
            title="Scrollbar"
            :model-value="settings.displayScrollbar"
            @update:model-value="value => updateProp('displayScrollbar', value)"
          />
          <PreviewSwitch
            title="Select On Hover"
            :model-value="settings.selectOnHover"
            @update:model-value="value => updateProp('selectOnHover', value)"
          />
          <PreviewSwitch
            title="Arrow Keys"
            :model-value="settings.enableArrowNavigation"
            @update:model-value="value => updateProp('enableArrowNavigation', value)"
          />
          <PreviewSwitch
            title="Loop"
            :model-value="settings.loop"
            @update:model-value="value => updateProp('loop', value)"
          />
          <PreviewSwitch
            title="Animate Once"
            :model-value="settings.animateOnce"
            @update:model-value="value => updateProp('animateOnce', value)"
          />
        </Customize>

        <PropTable :data="propData" />
        <Dependencies :dependency-list="['@hugeicons/vue', '@hugeicons/core-free-icons']" />
      </template>

      <template #code>
        <CodeExample :code-object="animatedList" component-name="AnimatedList" />
      </template>
    </TabsLayout>
  </ComponentPropsProvider>
</template>

<script setup lang="ts">
import { computed, h } from 'vue';
import { HugeiconsIcon } from '@hugeicons/vue';
import {
  Copy01Icon,
  Delete02Icon,
  Download04Icon,
  Edit02Icon,
  FileAddIcon,
  FolderOpenIcon,
  HelpCircleIcon,
  KeyboardIcon,
  Link01Icon,
  Search01Icon,
  Settings02Icon,
  Share08Icon,
  Sun03Icon
} from '@hugeicons/core-free-icons';
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
import { useColorModeValue } from '@/composables/useTheme';
import { animatedList } from '@/constants/code/Components/animatedListCode';
import AnimatedList, { type AnimatedListItem } from '@/content/Components/AnimatedList/AnimatedList.vue';

type Animation = 'pop' | 'slide' | 'fade' | 'none';
type Preset = 'files' | 'playlist' | 'commands' | 'simple';

const glyph = (icon: typeof Search01Icon) => () => h(HugeiconsIcon, { icon, size: 18, strokeWidth: 1.8 });

const PHOTOS = {
  fields: '/assets/demo/day-landscape.webp',
  moon: '/assets/demo/night-landscape.webp',
  pier: '/assets/demo/day-portrait.webp',
  dusk: '/assets/demo/night-portrait.webp',
  clouds: '/assets/demo/day-sky.webp',
  night: '/assets/demo/night-sky.webp'
};

const PLAYLIST: AnimatedListItem[] = [
  { image: PHOTOS.fields, title: 'Rapeseed', description: 'Open Fields', meta: '3:42' },
  { image: PHOTOS.moon, title: 'Moonrise', description: 'After Dark', meta: '4:05' },
  { image: PHOTOS.pier, title: 'Long Walk Out', description: 'The Pier', meta: '3:18' },
  { image: PHOTOS.dusk, title: 'Lamps On', description: 'Last Light', meta: '5:01' },
  { image: PHOTOS.clouds, title: 'Window Seat', description: 'Cruising', meta: '2:57' },
  { image: PHOTOS.night, title: 'Starfield', description: 'Night Sky', meta: '4:20' },
  { image: PHOTOS.fields, title: 'Pylons', description: 'Open Fields', meta: '3:36' },
  { image: PHOTOS.moon, title: 'Full Moon', description: 'After Dark', meta: '3:12' },
  { image: PHOTOS.pier, title: 'Low Tide', description: 'The Pier', meta: '4:44' },
  { image: PHOTOS.dusk, title: 'Pink Skies', description: 'Last Light', meta: '3:58' },
  { image: PHOTOS.clouds, title: 'Above the Clouds', description: 'Cruising', meta: '4:12' },
  { image: PHOTOS.night, title: 'Ridge Line', description: 'Night Sky', meta: '5:24' }
];

const COMMANDS: AnimatedListItem[] = [
  { icon: glyph(Search01Icon), title: 'Search', meta: '⌘K' },
  { icon: glyph(FileAddIcon), title: 'New file', meta: '⌘N' },
  { icon: glyph(FolderOpenIcon), title: 'Open folder', meta: '⌘O' },
  { icon: glyph(Copy01Icon), title: 'Duplicate', meta: '⌘D' },
  { icon: glyph(Edit02Icon), title: 'Rename', meta: 'F2' },
  { icon: glyph(Share08Icon), title: 'Share', meta: '⇧⌘S' },
  { icon: glyph(Link01Icon), title: 'Copy link', meta: '⌘L' },
  { icon: glyph(Download04Icon), title: 'Download', meta: '⌘S' },
  { icon: glyph(Delete02Icon), title: 'Move to trash', meta: '⌘⌫' },
  { icon: glyph(Sun03Icon), title: 'Toggle theme', meta: '⌘T' },
  { icon: glyph(KeyboardIcon), title: 'Keyboard shortcuts', meta: '⌘/' },
  { icon: glyph(Settings02Icon), title: 'Settings', meta: '⌘,' },
  { icon: glyph(HelpCircleIcon), title: 'Help', meta: '?' }
];

const CITIES = [
  'Amsterdam',
  'Barcelona',
  'Copenhagen',
  'Dublin',
  'Edinburgh',
  'Florence',
  'Geneva',
  'Helsinki',
  'Istanbul',
  'Kyoto',
  'Lisbon',
  'Marrakesh',
  'Oslo',
  'Prague',
  'Reykjavik',
  'Seoul',
  'Tallinn',
  'Vienna'
];

const ITEMS: Partial<Record<Preset, AnimatedListItem[]>> = { playlist: PLAYLIST, commands: COMMANDS, simple: CITIES };

const DEFAULT_PROPS = {
  preset: 'files' as Preset,
  animation: 'pop' as Animation,
  accentColor: '',
  width: 420,
  maxHeight: 440,
  radius: 14,
  gap: 8,
  stagger: 0.05,
  fadeSize: 56,
  frame: true,
  showGradients: true,
  displayScrollbar: true,
  selectOnHover: true,
  enableArrowNavigation: true,
  loop: false,
  animateOnce: false,
  initialSelectedIndex: -1
};

const PRESETS: Record<Preset, Partial<typeof DEFAULT_PROPS>> = {
  files: {},
  playlist: { animation: 'slide', radius: 18, gap: 6, stagger: 0.04 },
  commands: { width: 380, maxHeight: 400, radius: 12, gap: 4, stagger: 0.03, loop: true, initialSelectedIndex: 0 },
  simple: { animation: 'fade', width: 300, radius: 10, gap: 6, frame: false, displayScrollbar: false }
};

const PRESET_OPTIONS = [
  { value: 'files', label: 'Files' },
  { value: 'playlist', label: 'Playlist' },
  { value: 'commands', label: 'Commands' },
  { value: 'simple', label: 'Simple' }
];

const ANIMATION_OPTIONS = [
  { value: 'pop', label: 'Pop' },
  { value: 'slide', label: 'Slide' },
  { value: 'fade', label: 'Fade' },
  { value: 'none', label: 'None' }
];

const { rerenderKey, forceRerender } = useForceRerender();
const { props, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);
const theme = useColorModeValue<'light' | 'dark'>('light', 'dark');
const ink = useColorModeValue('#252825', '#f4f5f4');

const settings = computed(() => {
  const { preset: _preset, accentColor: _accentColor, ...rest } = props.value;
  return rest;
});

const items = computed(() => ITEMS[props.value.preset]);

const computedProps = computed(() => ({
  ...(props.value.accentColor ? { accentColor: props.value.accentColor } : {}),
  ...(theme.value === 'light' ? { theme: 'light' } : {})
}));

const applyPreset = (value: string | number) => {
  const preset = value as Preset;
  updateProps({ ...DEFAULT_PROPS, ...PRESETS[preset], accentColor: props.value.accentColor, preset });
};

const propData: PropRow[] = [
  {
    name: 'items',
    type: '(string | { id?, icon?, image?, title, description?, meta? })[]',
    default: 'sample files',
    description:
      'The rows to show. Strings become plain rows. Objects can add an icon or image, a description and a label on the right.'
  },
  {
    name: 'onItemSelect',
    type: '(item, index) => void',
    default: '-',
    description: 'Called when a row is clicked, or when Enter is pressed on the selected row.'
  },
  {
    name: 'renderItem',
    type: '(item, index, selected) => VNodeChild',
    default: '-',
    description:
      'Renders your own content inside each row instead of the built-in layout. The item slot (item, index, selected) does the same.'
  },
  {
    name: 'initialSelectedIndex',
    type: 'number',
    default: '-1',
    description: 'Which row starts selected. Use -1 for none.'
  },
  {
    name: 'selectOnHover',
    type: 'boolean',
    default: 'true',
    description: 'Moves the selection to the row under the cursor.'
  },
  {
    name: 'enableArrowNavigation',
    type: 'boolean',
    default: 'true',
    description: 'Arrow keys, Home and End move the selection while the list is hovered or focused.'
  },
  {
    name: 'loop',
    type: 'boolean',
    default: 'false',
    description: 'Wraps keyboard navigation from the last row back to the first.'
  },
  {
    name: 'animation',
    type: "'pop' | 'slide' | 'fade' | 'none'",
    default: "'pop'",
    description: 'How rows animate in as they scroll into view.'
  },
  {
    name: 'animateOnce',
    type: 'boolean',
    default: 'false',
    description: 'Animates each row only the first time it appears.'
  },
  {
    name: 'stagger',
    type: 'number',
    default: '0.05',
    description: 'Delay between rows when the list first appears, in seconds.'
  },
  {
    name: 'showGradients',
    type: 'boolean',
    default: 'true',
    description: 'Fades rows out at the top and bottom edges while there is more to scroll.'
  },
  { name: 'fadeSize', type: 'number', default: '56', description: 'Height of the edge fades, in px.' },
  {
    name: 'displayScrollbar',
    type: 'boolean',
    default: 'true',
    description: 'Shows a thin scrollbar when the list overflows.'
  },
  { name: 'frame', type: 'boolean', default: 'true', description: 'Shows the frosted panel around the list.' },
  { name: 'theme', type: "'dark' | 'light'", default: "'dark'", description: 'Color theme of the panel and rows.' },
  {
    name: 'accentColor',
    type: 'string',
    default: '-',
    description: 'Color of the selection outline. Uses a soft tint of the text color when not set.'
  },
  { name: 'radius', type: 'number', default: '14', description: 'Corner radius of the rows, in px.' },
  { name: 'gap', type: 'number', default: '8', description: 'Space between rows, in px.' },
  { name: 'width', type: 'number | string', default: '420', description: 'Maximum width of the list.' },
  {
    name: 'maxHeight',
    type: 'number | string',
    default: '440',
    description: 'Height at which the list starts to scroll.'
  },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the list.' },
  { name: 'itemClassName', type: 'string', default: "''", description: 'Extra class names for each row.' },
  { name: 'style', type: 'CSSProperties', default: '-', description: 'Inline styles for the list.' }
];
</script>
