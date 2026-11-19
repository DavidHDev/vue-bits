<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
    :demo-only-props="['preset', 'icons', 'highlightColor']"
    :computed-props="computedProps"
  >
    <TabsLayout>
      <template #preview>
        <div class="demo-container relative overflow-hidden" style="height: 360px; padding: 0">
          <div class="flex h-full w-full items-center justify-center" style="padding: 0 56px">
            <PillNav
              :key="rerenderKey"
              :logo="theme === 'light' ? markBlack : markWhite"
              logo-alt="Vue Bits"
              :items="items"
              :theme="theme"
              :highlight-color="props.highlightColor || undefined"
              :on-item-click="preventNavigation"
              v-bind="settings"
            />
          </div>
          <RefreshButton @click="forceRerender" />
        </div>

        <Customize>
          <PreviewSelect
            title="Preset"
            :options="PRESET_OPTIONS"
            :model-value="props.preset"
            @update:model-value="applyPreset"
          />
          <PreviewColorPickerCustom
            title="Highlight"
            :color="props.highlightColor || highlight"
            @change="value => updateProp('highlightColor', value)"
          />
          <PreviewSelect
            title="Layout"
            :options="LAYOUT_OPTIONS"
            :model-value="settings.layout"
            @update:model-value="value => updateProp('layout', value as Layout)"
          />
          <PreviewSelect
            title="Items"
            :options="ITEM_OPTIONS"
            :model-value="settings.itemStyle"
            @update:model-value="value => updateProp('itemStyle', value as ItemStyle)"
          />
          <PreviewSelect
            title="Hover Effect"
            :options="HOVER_OPTIONS"
            :model-value="settings.hoverEffect"
            @update:model-value="value => updateProp('hoverEffect', value as HoverEffect)"
          />
          <PreviewSelect
            title="Indicator"
            :options="INDICATOR_OPTIONS"
            :model-value="settings.indicator"
            @update:model-value="value => updateProp('indicator', value as Indicator)"
          />
          <PreviewSelect
            title="Surface"
            :options="SURFACE_OPTIONS"
            :model-value="settings.surface"
            @update:model-value="value => updateProp('surface', value as Surface)"
          />
          <PreviewSelect
            title="Size"
            :options="SIZE_OPTIONS"
            :model-value="settings.size"
            @update:model-value="value => updateProp('size', value as Size)"
          />
          <PreviewSelect
            title="Collapse"
            :options="COLLAPSE_OPTIONS"
            :model-value="settings.collapse"
            @update:model-value="value => updateProp('collapse', value as Collapse)"
          />
          <PreviewSlider
            title="Bounce"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.bounce"
            :is-disabled="settings.hoverEffect !== 'glide' && settings.indicator === 'none'"
            @update:model-value="value => updateProp('bounce', value)"
          />
          <PreviewSlider
            title="Stretch"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.stretch"
            :is-disabled="settings.hoverEffect !== 'glide' && settings.indicator !== 'pill'"
            @update:model-value="value => updateProp('stretch', value)"
          />
          <PreviewSwitch
            title="Icons"
            :model-value="props.icons"
            @update:model-value="value => updateProp('icons', value)"
          />
          <PreviewSwitch title="Intro" :model-value="settings.intro" @update:model-value="setIntro" />
        </Customize>

        <PropTable :data="propData" />
      </template>

      <template #code>
        <CodeExample :code-object="pillNav" component-name="PillNav" />
      </template>
    </TabsLayout>
  </ComponentPropsProvider>
</template>

<script setup lang="ts">
import { computed, h } from 'vue';
import { HugeiconsIcon, type IconArray } from '@hugeicons/vue';
import { BookOpen01Icon, Camera01Icon, Home01Icon, UserIcon } from '@hugeicons/core-free-icons';
import markBlack from '@/assets/logos/vue-bits-logo-small-dark.svg';
import markWhite from '@/assets/logos/vue-bits-logo-small.svg';
import CodeExample from '@/components/common/CodeExample.vue';
import Customize from '@/components/common/Customize.vue';
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
import { pillNav } from '@/constants/code/Components/pillNavCode';
import PillNav, { type PillNavItem } from '@/content/Components/PillNav/PillNav.vue';

type Layout = 'split' | 'joined';
type ItemStyle = 'pill' | 'plain';
type HoverEffect = 'fill' | 'glide' | 'none';
type Indicator = 'dot' | 'pill' | 'none';
type Surface = 'glass' | 'solid' | 'none';
type Size = 'sm' | 'md' | 'lg';
type Collapse = 'auto' | 'always' | 'never';

const LABELS = ['Home', 'Journal', 'Photos', 'About'];
const ICONS = [Home01Icon, BookOpen01Icon, Camera01Icon, UserIcon];

const LOOK = {
  layout: 'split' as Layout,
  itemStyle: 'pill' as ItemStyle,
  hoverEffect: 'fill' as HoverEffect,
  indicator: 'dot' as Indicator,
  surface: 'glass' as Surface,
  highlightColor: '',
  icons: false
};

const DEFAULT_PROPS = {
  preset: 'classic',
  ...LOOK,
  size: 'md' as Size,
  bounce: 0.3,
  stretch: 0.5,
  collapse: 'auto' as Collapse,
  intro: true
};

type DemoProps = typeof DEFAULT_PROPS;

const PRESETS: Record<string, Partial<DemoProps>> = {
  classic: {},
  glide: { itemStyle: 'plain', hoverEffect: 'glide', indicator: 'pill' },
  capsule: { layout: 'joined', itemStyle: 'plain', hoverEffect: 'glide', indicator: 'pill' },
  ember: { highlightColor: '#ff5a1f' },
  icons: { icons: true },
  minimal: { surface: 'none', itemStyle: 'plain', hoverEffect: 'glide', indicator: 'dot' }
};

const PRESET_OPTIONS = [
  { value: 'classic', label: 'Classic' },
  { value: 'glide', label: 'Glide' },
  { value: 'capsule', label: 'Capsule' },
  { value: 'ember', label: 'Ember' },
  { value: 'icons', label: 'Icons' },
  { value: 'minimal', label: 'Minimal' }
];

const LAYOUT_OPTIONS = [
  { value: 'split', label: 'Split' },
  { value: 'joined', label: 'Joined' }
];

const ITEM_OPTIONS = [
  { value: 'pill', label: 'Pill' },
  { value: 'plain', label: 'Plain' }
];

const HOVER_OPTIONS = [
  { value: 'fill', label: 'Fill' },
  { value: 'glide', label: 'Glide' },
  { value: 'none', label: 'None' }
];

const INDICATOR_OPTIONS = [
  { value: 'dot', label: 'Dot' },
  { value: 'pill', label: 'Pill' },
  { value: 'none', label: 'None' }
];

const SURFACE_OPTIONS = [
  { value: 'glass', label: 'Glass' },
  { value: 'solid', label: 'Solid' },
  { value: 'none', label: 'None' }
];

const SIZE_OPTIONS = [
  { value: 'sm', label: 'Small' },
  { value: 'md', label: 'Medium' },
  { value: 'lg', label: 'Large' }
];

const COLLAPSE_OPTIONS = [
  { value: 'auto', label: 'Auto' },
  { value: 'always', label: 'Always' },
  { value: 'never', label: 'Never' }
];

const propData: PropRow[] = [
  {
    name: 'items',
    type: '{ label: string; href?: string; icon?: VNode | Component; ariaLabel?: string }[]',
    default: '-',
    description: 'The navigation links. Items without an href render as buttons.'
  },
  {
    name: 'logo',
    type: 'string | VNode | Component',
    default: '-',
    description: 'Image URL or element shown in the round logo button. It spins on hover.'
  },
  { name: 'logoAlt', type: 'string', default: "'Logo'", description: 'Accessible label for the logo link.' },
  { name: 'logoHref', type: 'string', default: "'#'", description: 'Where the logo links to.' },
  {
    name: 'activeHref',
    type: 'string',
    default: '-',
    description: 'Marks the item with this href as the current page. Leave it out to let the nav track clicks itself.'
  },
  {
    name: 'defaultActiveIndex',
    type: 'number',
    default: '0',
    description: 'Which item starts active when activeHref is not set.'
  },
  {
    name: 'onItemClick',
    type: '(item, index, event) => void',
    default: '-',
    description: 'Called when an item is clicked.'
  },
  {
    name: 'linkComponent',
    type: 'string | Component',
    default: "'a'",
    description: "Renders the links, so you can pass your router's link. It receives href, class and its content."
  },
  {
    name: 'theme',
    type: "'dark' | 'light'",
    default: "'dark'",
    description: 'Color scheme of the surfaces, labels and highlight.'
  },
  {
    name: 'layout',
    type: "'split' | 'joined'",
    default: "'split'",
    description: 'Split puts the logo in its own bubble beside the bar. Joined holds everything in one capsule.'
  },
  {
    name: 'itemStyle',
    type: "'pill' | 'plain'",
    default: "'pill'",
    description: 'Pill gives every item its own raised pill. Plain shows the labels straight on the bar.'
  },
  {
    name: 'hoverEffect',
    type: "'fill' | 'glide' | 'none'",
    default: "'fill'",
    description:
      'Fill rises a circle through the hovered pill as its label rolls over. Glide slides one pill to the item under the cursor.'
  },
  {
    name: 'indicator',
    type: "'dot' | 'pill' | 'none'",
    default: "'dot'",
    description: 'How the current page is marked: a small dot that slides between items, or a filled pill.'
  },
  {
    name: 'surface',
    type: "'glass' | 'solid' | 'none'",
    default: "'glass'",
    description: 'Background of the bar and logo: frosted glass, an opaque fill, or nothing.'
  },
  { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Height, padding and text size.' },
  {
    name: 'highlightColor',
    type: 'string',
    default: '-',
    description: 'Color of the fill, the gliding pill and the dot. Labels on it pick black or white for contrast.'
  },
  {
    name: 'highlightTextColor',
    type: 'string',
    default: '-',
    description: 'Overrides the label color on the highlight.'
  },
  { name: 'barColor', type: 'string', default: '-', description: 'Overrides the background of the bar and logo.' },
  { name: 'textColor', type: 'string', default: '-', description: 'Overrides the label color.' },
  {
    name: 'bounce',
    type: 'number',
    default: '0.3',
    description: 'How much the gliding pill and the dot overshoot as they settle, from 0 to 1.'
  },
  {
    name: 'stretch',
    type: 'number',
    default: '0.5',
    description: 'How far the gliding pill stretches toward its target before the back edge catches up, from 0 to 1.'
  },
  {
    name: 'collapse',
    type: "'auto' | 'always' | 'never'",
    default: "'auto'",
    description: 'When the links fold into a menu button. Auto folds them only when they no longer fit.'
  },
  {
    name: 'onMenuToggle',
    type: '(open: boolean) => void',
    default: '-',
    description: 'Called when the folded menu opens or closes.'
  },
  {
    name: 'intro',
    type: 'boolean',
    default: 'true',
    description: 'Pops the logo in and unrolls the bar on mount.'
  },
  { name: 'ariaLabel', type: 'string', default: "'Main'", description: 'Accessible name of the nav landmark.' },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the nav.' },
  { name: 'style', type: 'CSSProperties', default: '-', description: 'Inline styles for the nav.' }
];

const { rerenderKey, forceRerender } = useForceRerender();
const { props, defaultProps, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);
const theme = useColorModeValue<'light' | 'dark'>('light', 'dark');
const highlight = useColorModeValue('#161816', '#f4f5f4');

const settings = computed(() => {
  const { preset: _preset, icons: _icons, highlightColor: _highlightColor, ...rest } = props.value;
  return rest;
});

const items = computed<PillNavItem[]>(() =>
  LABELS.map((label, index) => ({
    label,
    href: `#${label.toLowerCase()}`,
    ...(props.value.icons
      ? { icon: h(HugeiconsIcon, { icon: ICONS[index] as IconArray, size: 16, strokeWidth: 1.8 }) }
      : {})
  }))
);

const preventNavigation = (_item: PillNavItem, _index: number, event: MouseEvent) => event.preventDefault();

const applyPreset = (value: string | number) => {
  const name = String(value);
  const base = Object.fromEntries(
    Object.keys(LOOK).map(name => [name, defaultProps.value[name as keyof DemoProps]])
  ) as Partial<DemoProps>;
  updateProps({ ...base, ...PRESETS[name], preset: name });
};

const setIntro = (value: boolean) => {
  updateProp('intro', value);
  forceRerender();
};

const computedProps = computed(() => ({
  ...(props.value.highlightColor ? { highlightColor: props.value.highlightColor } : {}),
  ...(theme.value === 'light' ? { theme: 'light' } : {})
}));
</script>
