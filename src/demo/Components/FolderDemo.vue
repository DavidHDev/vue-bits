<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
    :demo-only-props="['preset', 'content']"
    :computed-props="computedProps"
  >
    <TabsLayout>
      <template #preview>
        <div
          class="demo-container relative flex items-center justify-center overflow-hidden"
          :style="{
            height: wide ? '600px' : '460px',
            padding: 0,
            paddingTop: settings.mode === 'flap' ? (wide ? '96px' : '64px') : 0
          }"
        >
          <Folder
            :key="`${rerenderKey}-${settings.mode}`"
            v-bind="settings"
            :size="settings.size * fit"
            :items="items"
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
            title="Mode"
            :options="MODE_OPTIONS"
            :model-value="settings.mode"
            @update:model-value="value => updateProp('mode', value as FolderMode)"
          />
          <PreviewSelect
            title="Material"
            :options="VARIANT_OPTIONS"
            :model-value="settings.variant"
            @update:model-value="value => updateProp('variant', value as FolderVariant)"
          />
          <PreviewSelect
            title="Layout"
            :options="LAYOUT_OPTIONS"
            :model-value="settings.layout"
            @update:model-value="value => updateProp('layout', value as FolderLayout)"
          />
          <PreviewSelect
            title="Content"
            :options="CONTENT_OPTIONS"
            :model-value="props.content"
            @update:model-value="value => updateProp('content', value as FolderContent)"
          />
          <PreviewColorPickerCustom
            title="Color"
            :color="settings.color"
            @change="value => updateProp('color', value)"
          />
          <PreviewColorPickerCustom
            title="Paper"
            :color="settings.paperColor"
            @change="value => updateProp('paperColor', value)"
          />
          <PreviewInput
            title="Label"
            :model-value="settings.label"
            :max-length="18"
            @update:model-value="value => updateProp('label', value)"
          />
          <PreviewSelect
            title="Tab"
            :options="TAB_OPTIONS"
            :model-value="settings.tabPosition"
            @update:model-value="value => updateProp('tabPosition', value as FolderTab)"
          />
          <PreviewSelect
            title="Open On"
            :options="OPEN_OPTIONS"
            :model-value="settings.openOn"
            @update:model-value="value => updateProp('openOn', value as FolderOpenOn)"
          />
          <PreviewSlider
            title="Size"
            :min="0.6"
            :max="1.8"
            :step="0.05"
            :model-value="settings.size"
            @update:model-value="value => updateProp('size', value)"
          />
          <PreviewSlider
            title="Frost"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.frost"
            :is-disabled="settings.variant !== 'glass'"
            @update:model-value="value => updateProp('frost', value)"
          />
          <PreviewSlider
            title="Tilt"
            :min="0"
            :max="1.5"
            :step="0.05"
            :model-value="settings.tilt"
            @update:model-value="value => updateProp('tilt', value)"
          />
          <PreviewSlider
            title="Speed"
            :min="0.3"
            :max="2"
            :step="0.05"
            :model-value="settings.speed"
            @update:model-value="value => updateProp('speed', value)"
          />
          <PreviewSlider
            title="Bounce"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.bounce"
            @update:model-value="value => updateProp('bounce', value)"
          />
          <PreviewSwitch
            title="Peek"
            :model-value="settings.peek"
            @update:model-value="value => updateProp('peek', value)"
          />
          <PreviewSwitch
            title="Intro"
            :model-value="settings.intro"
            @update:model-value="
              value => {
                updateProp('intro', value);
                forceRerender();
              }
            "
          />
          <PreviewSwitch
            title="Draggable"
            :model-value="settings.draggable"
            @update:model-value="value => updateProp('draggable', value)"
          />
          <PreviewSwitch
            title="Zoom On Click"
            :model-value="settings.zoomOnClick"
            @update:model-value="value => updateProp('zoomOnClick', value)"
          />
        </Customize>

        <PropTable :data="propData" />
      </template>

      <template #code>
        <CodeExample :code-object="folder" component-name="Folder" />
      </template>
    </TabsLayout>
  </ComponentPropsProvider>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useMediaQuery } from '@vueuse/core';
import CodeExample from '@/components/common/CodeExample.vue';
import Customize from '@/components/common/Customize.vue';
import PreviewColorPickerCustom from '@/components/common/PreviewColorPickerCustom.vue';
import PreviewInput from '@/components/common/PreviewInput.vue';
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
import { folder } from '@/constants/code/Components/folderCode';
import Folder from '@/content/Components/Folder/Folder.vue';

type FolderMode = 'flap' | 'book';
type FolderVariant = 'solid' | 'glass' | 'matte';
type FolderLayout = 'spread' | 'stack' | 'row';
type FolderContent = 'documents' | 'photos';
type FolderTab = 'left' | 'center' | 'right';
type FolderOpenOn = 'click' | 'hover';
type PresetName = 'classic' | 'glass' | 'book' | 'portfolio' | 'manila';

const DOCUMENTS = [{ title: 'Brand guidelines' }, { title: 'Launch plan' }, { title: 'Moodboard' }];

const PHOTOS = {
  dark: [
    { title: 'Blue hour', image: '/assets/demo/night-sky.webp' },
    { title: 'Moonrise', image: '/assets/demo/night-landscape.webp' },
    { title: 'Dusk', image: '/assets/demo/night-portrait.webp' }
  ],
  light: [
    { title: 'Golden hour', image: '/assets/demo/day-sky.webp' },
    { title: 'Canola field', image: '/assets/demo/day-landscape.webp' },
    { title: 'The pier', image: '/assets/demo/day-portrait.webp' }
  ]
};

const LOOK = {
  mode: 'flap' as FolderMode,
  variant: 'solid' as FolderVariant,
  layout: 'spread' as FolderLayout,
  content: 'documents' as FolderContent,
  color: '#3d8bff',
  paperColor: '#ffffff',
  label: 'Projects',
  tabPosition: 'right' as FolderTab
};

const DEFAULT_PROPS = {
  preset: 'classic' as PresetName,
  ...LOOK,
  openOn: 'click' as FolderOpenOn,
  size: 1.3,
  frost: 0.25,
  tilt: 0.5,
  speed: 1,
  bounce: 0.4,
  peek: true,
  intro: true,
  draggable: true,
  zoomOnClick: true
};

const PRESETS: Record<PresetName, Partial<typeof LOOK>> = {
  classic: LOOK,
  glass: { ...LOOK, variant: 'glass', content: 'photos', color: '#7aa7ff', label: 'Photos' },
  book: { ...LOOK, mode: 'book', label: 'Projects' },
  portfolio: { ...LOOK, mode: 'book', variant: 'matte', content: 'photos', color: '#2a2c2a', label: 'Portfolio' },
  manila: { ...LOOK, mode: 'book', color: '#e6c78f', label: 'Archive', layout: 'stack' }
};

const PRESET_OPTIONS = [
  { value: 'classic', label: 'Classic' },
  { value: 'glass', label: 'Glass' },
  { value: 'book', label: 'Book' },
  { value: 'portfolio', label: 'Portfolio' },
  { value: 'manila', label: 'Manila' }
];

const MODE_OPTIONS = [
  { value: 'flap', label: 'Flap' },
  { value: 'book', label: 'Book' }
];

const VARIANT_OPTIONS = [
  { value: 'solid', label: 'Solid' },
  { value: 'glass', label: 'Glass' },
  { value: 'matte', label: 'Matte' }
];

const LAYOUT_OPTIONS = [
  { value: 'spread', label: 'Spread' },
  { value: 'stack', label: 'Stack' },
  { value: 'row', label: 'Row' }
];

const CONTENT_OPTIONS = [
  { value: 'documents', label: 'Documents' },
  { value: 'photos', label: 'Photos' }
];

const TAB_OPTIONS = [
  { value: 'left', label: 'Left' },
  { value: 'center', label: 'Center' },
  { value: 'right', label: 'Right' }
];

const OPEN_OPTIONS = [
  { value: 'click', label: 'Click' },
  { value: 'hover', label: 'Hover' }
];

const propData: PropRow[] = [
  {
    name: 'items',
    type: 'FolderItem[]',
    default: 'Three sample documents',
    description:
      'What the folder holds, up to 6. Each item can be a string, { title, description }, { image, title, alt }, { content } or a VNode.'
  },
  {
    name: 'default slot',
    type: 'VNode[]',
    default: 'undefined',
    description: 'Your own items as slot children. Each child becomes one page in the folder.'
  },
  {
    name: 'mode',
    type: "'flap' | 'book'",
    default: "'flap'",
    description:
      'flap stands the folder up and drops the front flap open. book lays it flat and swings the cover over like a book.'
  },
  {
    name: 'variant',
    type: "'solid' | 'glass' | 'matte'",
    default: "'solid'",
    description: 'Material of the folder. glass turns the front into refracting glass that shows the pages inside.'
  },
  {
    name: 'layout',
    type: "'spread' | 'stack' | 'row'",
    default: "'spread'",
    description: 'How the items are laid out once the folder is open.'
  },
  {
    name: 'color',
    type: 'string',
    default: "'#3d8bff'",
    description: 'Color of the folder. Shades are derived from it.'
  },
  { name: 'paperColor', type: 'string', default: "'#ffffff'", description: 'Color of the pages.' },
  { name: 'label', type: 'string', default: 'undefined', description: 'Text on the tab. The tab grows to fit it.' },
  {
    name: 'tabPosition',
    type: "'left' | 'center' | 'right'",
    default: "'right'",
    description: 'Where the tab sits along the top edge.'
  },
  {
    name: 'openOn',
    type: "'click' | 'hover'",
    default: "'click'",
    description: 'Opens the folder on click, or while the cursor is over it.'
  },
  {
    name: 'open',
    type: 'boolean',
    default: 'undefined',
    description:
      'Controls the folder from outside, also with v-model:open. Leave it out to let the folder manage itself.'
  },
  { name: 'defaultOpen', type: 'boolean', default: 'false', description: 'Starts the folder open.' },
  {
    name: 'onOpenChange',
    type: '(open: boolean) => void',
    default: 'undefined',
    description: 'Called when the folder opens or closes.'
  },
  {
    name: 'onItemClick',
    type: '(item, index: number) => void',
    default: 'undefined',
    description: 'Called when an item is clicked while the folder is open or after it was dragged out.'
  },
  {
    name: 'onItemDrop',
    type: '(item, index: number, inside: boolean) => void',
    default: 'undefined',
    description: 'Called when a dragged item is let go, with whether it landed back in the folder.'
  },
  {
    name: 'draggable',
    type: 'boolean',
    default: 'true',
    description: 'Lets people drag items out of the folder, leave them anywhere and drop them back in.'
  },
  {
    name: 'zoomOnClick',
    type: 'boolean',
    default: 'true',
    description: 'Clicking an item brings it up close. Click it again, press Escape or click away to put it back.'
  },
  {
    name: 'peek',
    type: 'boolean',
    default: 'true',
    description: 'Teases the items out on hover. In flap mode the page under the cursor rises highest.'
  },
  {
    name: 'intro',
    type: 'boolean',
    default: 'true',
    description:
      'Plays an entrance when the folder scrolls into view: the pages drop in and the folder closes over them.'
  },
  { name: 'size', type: 'number', default: '1', description: 'Scale of the whole folder.' },
  {
    name: 'frost',
    type: 'number',
    default: '0.25',
    description:
      'How much the glass front blurs what is behind it, from 0 for clear glass to 1. Used by the glass variant.'
  },
  {
    name: 'tilt',
    type: 'number',
    default: '0.5',
    description: 'How much the folder tilts toward the cursor, from 0 to 1.5.'
  },
  { name: 'speed', type: 'number', default: '1', description: 'Speed of every animation.' },
  {
    name: 'bounce',
    type: 'number',
    default: '0.4',
    description: 'How much the flap, cover and pages overshoot as they settle, from 0 to 1.'
  },
  {
    name: 'closeOnOutsideClick',
    type: 'boolean',
    default: 'true',
    description: 'Closes the folder on a click outside it or on Escape.'
  },
  {
    name: 'theme',
    type: "'dark' | 'light'",
    default: "'dark'",
    description: 'Tunes the shadows for dark or light pages.'
  },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the container.' },
  {
    name: 'style',
    type: 'CSSProperties | string',
    default: 'undefined',
    description: 'Inline styles for the container.'
  }
];

const { rerenderKey, forceRerender } = useForceRerender();
const { props, defaultProps, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);
const theme = useColorModeValue<'light' | 'dark'>('light', 'dark');
const wide = useMediaQuery('(min-width: 48em)');
const fit = computed(() => (wide.value ? 1 : 0.68));

const settings = computed(() => {
  const { preset: _preset, content: _content, ...rest } = props.value;
  return rest;
});

const items = computed(() => (props.value.content === 'photos' ? PHOTOS[theme.value] : DOCUMENTS));

const computedProps = computed(() => ({
  theme: theme.value,
  ...(props.value.content === 'photos' ? { items: items.value } : {})
}));

const applyPreset = (value: string | number) => {
  const name = value as PresetName;
  const defaults = defaultProps.value as Record<string, unknown>;
  const base = Object.fromEntries(Object.keys(DEFAULT_PROPS).map(key => [key, defaults[key]]));
  updateProps({ ...base, ...PRESETS[name], preset: name } as Partial<typeof DEFAULT_PROPS>);
  forceRerender();
};
</script>
