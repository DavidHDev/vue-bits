<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
    :demo-only-props="['preset', 'accentColor', 'accentCard', 'descriptions', 'showCta']"
    :computed-props="computedProps"
  >
    <TabsLayout>
      <template #preview>
        <div class="demo-container relative overflow-hidden" style="height: 480px; padding: 0">
          <div class="absolute" style="top: 64px; left: 20px; right: 20px">
            <CardNav
              :key="rerenderKey"
              :logo="theme === 'light' ? logoBlack : logoWhite"
              logo-alt="Vue Bits"
              :items="items"
              :cta="props.showCta ? { label: 'Get started' } : undefined"
              :theme="theme"
              :accent-color="props.accentColor || undefined"
              :on-link-click="preventNavigation"
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
            @update:model-value="value => applyPreset(String(value))"
          />
          <PreviewColorPickerCustom
            title="Accent"
            :color="accent"
            @change="value => updateProp('accentColor', value)"
          />
          <PreviewSelect
            title="Card Effect"
            :options="EFFECT_OPTIONS"
            :model-value="settings.cardEffect"
            @update:model-value="value => updateProp('cardEffect', value as CardEffect)"
          />
          <PreviewSelect
            title="Open On"
            :options="OPEN_OPTIONS"
            :model-value="settings.openOn"
            @update:model-value="value => updateProp('openOn', value as OpenOn)"
          />
          <PreviewSelect
            title="Surface"
            :options="SURFACE_OPTIONS"
            :model-value="settings.surface"
            @update:model-value="value => updateProp('surface', value as Surface)"
          />
          <PreviewSlider
            title="Stagger"
            :min="0"
            :max="0.3"
            :step="0.01"
            :model-value="settings.stagger"
            @update:model-value="value => updateProp('stagger', value)"
          />
          <PreviewSlider
            title="Bounce"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.bounce"
            @update:model-value="value => updateProp('bounce', value)"
          />
          <PreviewSlider
            title="Speed"
            :min="0.4"
            :max="2"
            :step="0.05"
            :model-value="settings.speed"
            @update:model-value="value => updateProp('speed', value)"
          />
          <PreviewSlider
            title="Card Height"
            :min="120"
            :max="260"
            :step="2"
            value-unit="px"
            :model-value="settings.cardHeight"
            @update:model-value="value => updateProp('cardHeight', value)"
          />
          <PreviewSlider
            title="Max Width"
            :min="480"
            :max="1000"
            :step="10"
            value-unit="px"
            :model-value="settings.maxWidth"
            @update:model-value="value => updateProp('maxWidth', value)"
          />
          <PreviewSwitch
            title="Menu Label"
            :model-value="settings.menuLabel"
            @update:model-value="value => updateProp('menuLabel', value)"
          />
          <PreviewSwitch
            title="Button"
            :model-value="props.showCta"
            @update:model-value="value => updateProp('showCta', value)"
          />
          <PreviewSwitch
            title="Descriptions"
            :model-value="props.descriptions"
            @update:model-value="value => updateProp('descriptions', value)"
          />
          <PreviewSwitch
            title="Accent Card"
            :model-value="props.accentCard"
            @update:model-value="value => updateProp('accentCard', value)"
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
        </Customize>

        <PropTable :data="propData" />
        <Dependencies :dependency-list="['@hugeicons/vue', '@hugeicons/core-free-icons']" />
      </template>

      <template #code>
        <CodeExample :code-object="cardNav" component-name="CardNav" />
      </template>
    </TabsLayout>
  </ComponentPropsProvider>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import logoBlack from '@/assets/logos/vuebits-gh-black.svg';
import logoWhite from '@/assets/logos/vuebits-gh-white.svg';
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
import { cardNav } from '@/constants/code/Components/cardNavCode';
import CardNav, { type CardNavItem, type CardNavLink } from '@/content/Components/CardNav/CardNav.vue';

type CardEffect = 'rise' | 'unfold' | 'fade';
type OpenOn = 'click' | 'hover';
type Surface = 'glass' | 'solid';

const BASE_ITEMS: CardNavItem[] = [
  {
    label: 'About',
    description: 'The people and the story behind the studio.',
    links: [
      { label: 'Company', href: '#company' },
      { label: 'Careers', href: '#careers' }
    ]
  },
  {
    label: 'Projects',
    description: 'Selected work from the last few years.',
    links: [
      { label: 'Featured', href: '#featured' },
      { label: 'Case studies', href: '#case-studies' }
    ]
  },
  {
    label: 'Contact',
    description: 'Say hello, we read everything.',
    links: [
      { label: 'Email', href: '#email' },
      { label: 'X', href: '#x' },
      { label: 'LinkedIn', href: '#linkedin' }
    ]
  }
];

const LOOK = {
  cardEffect: 'rise' as CardEffect,
  openOn: 'click' as OpenOn,
  surface: 'glass' as Surface,
  stagger: 0.12,
  bounce: 0.2,
  accentColor: '',
  accentCard: false,
  menuLabel: true
};

const DEFAULT_PROPS = {
  preset: 'classic',
  ...LOOK,
  speed: 1,
  cardHeight: 176,
  maxWidth: 800,
  descriptions: true,
  showCta: true,
  intro: true
};

type Look = typeof LOOK;

const PRESETS: Record<string, Partial<Look>> = {
  classic: {},
  accent: { accentColor: '#ff5a1f', accentCard: true },
  unfold: { cardEffect: 'unfold', stagger: 0.16, bounce: 0.1 },
  hover: { openOn: 'hover' },
  solid: { surface: 'solid', cardEffect: 'fade', menuLabel: false, bounce: 0 }
};

const PRESET_OPTIONS = [
  { value: 'classic', label: 'Classic' },
  { value: 'accent', label: 'Accent' },
  { value: 'unfold', label: 'Unfold' },
  { value: 'hover', label: 'Hover' },
  { value: 'solid', label: 'Solid' }
];

const EFFECT_OPTIONS = [
  { value: 'rise', label: 'Rise' },
  { value: 'unfold', label: 'Unfold' },
  { value: 'fade', label: 'Fade' }
];

const OPEN_OPTIONS = [
  { value: 'click', label: 'Click' },
  { value: 'hover', label: 'Hover' }
];

const SURFACE_OPTIONS = [
  { value: 'glass', label: 'Glass' },
  { value: 'solid', label: 'Solid' }
];

const contrastInk = (color: string) => {
  const hex = String(color || '').replace('#', '');
  if (!/^([0-9a-f]{6})$/i.test(hex)) return '#ffffff';
  const [r, g, b] = [0, 2, 4].map(i => parseInt(hex.slice(i, i + 2), 16) / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.6 ? '#111311' : '#ffffff';
};

const { rerenderKey, forceRerender } = useForceRerender();
const { props, defaultProps, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);
const theme = useColorModeValue<'light' | 'dark'>('light', 'dark');
const ctaDefault = useColorModeValue('#161816', '#f4f5f4');

const settings = computed(() => {
  const { preset, accentColor, accentCard, descriptions, showCta, ...rest } = props.value;
  void preset;
  void accentColor;
  void accentCard;
  void descriptions;
  void showCta;
  return rest;
});

const accent = computed(() => props.value.accentColor || ctaDefault.value);

const items = computed<CardNavItem[]>(() =>
  BASE_ITEMS.map((item, index) => ({
    ...item,
    ...(props.value.descriptions ? {} : { description: undefined }),
    ...(props.value.accentCard && index === 0 ? { bgColor: accent.value, textColor: contrastInk(accent.value) } : {})
  }))
);

const preventNavigation = (_link: CardNavLink, _item: CardNavItem, event: MouseEvent) => event.preventDefault();

const applyPreset = (value: string) => {
  const base = Object.fromEntries(
    (Object.keys(LOOK) as (keyof Look)[]).map(name => [name, defaultProps.value[name]])
  ) as Partial<Look>;
  updateProps({ ...base, ...PRESETS[value], preset: value });
};

const computedProps = computed(() => ({
  ...(props.value.accentColor ? { accentColor: props.value.accentColor } : {}),
  ...(theme.value === 'light' ? { theme: 'light' } : {})
}));

const propData: PropRow[] = [
  {
    name: 'items',
    type: '{ label: string; description?: string; bgColor?: string; textColor?: string; links: { label: string; href?: string; ariaLabel?: string }[] }[]',
    default: '-',
    description: 'The cards in the menu. Give a card a bgColor to tint it, and links without an href render as buttons.'
  },
  {
    name: 'logo',
    type: 'string | VNode | Component',
    default: '-',
    description: 'Image URL or element shown in the middle of the bar.'
  },
  { name: 'logoAlt', type: 'string', default: "'Logo'", description: 'Accessible label for the logo link.' },
  { name: 'logoHref', type: 'string', default: "'#'", description: 'Where the logo links to.' },
  {
    name: 'cta',
    type: '{ label: string; href?: string; onClick?: (event) => void }',
    default: '-',
    description: 'Button on the right of the bar. On narrow screens it moves to the bottom of the menu.'
  },
  {
    name: 'theme',
    type: "'dark' | 'light'",
    default: "'dark'",
    description: 'Color scheme of the bar, cards and button.'
  },
  {
    name: 'surface',
    type: "'glass' | 'solid'",
    default: "'glass'",
    description: 'Frosted glass that blurs what is behind the bar, or an opaque fill.'
  },
  {
    name: 'openOn',
    type: "'click' | 'hover'",
    default: "'click'",
    description: 'Opens the menu from the button, or as soon as the pointer moves over the bar.'
  },
  {
    name: 'cardEffect',
    type: "'rise' | 'unfold' | 'fade'",
    default: "'rise'",
    description: 'How the cards arrive: rising into place, folding down from the bar, or fading in from a soft blur.'
  },
  {
    name: 'stagger',
    type: 'number',
    default: '0.12',
    description: 'How far each card trails the one before it, from 0 to 0.3.'
  },
  {
    name: 'bounce',
    type: 'number',
    default: '0.2',
    description: 'How much the menu overshoots as it opens, from 0 to 1.'
  },
  { name: 'speed', type: 'number', default: '1', description: 'Speed of the open and close animation.' },
  { name: 'cardHeight', type: 'number', default: '176', description: 'Minimum height of the cards in px.' },
  { name: 'maxWidth', type: 'number', default: '800', description: 'Maximum width of the bar in px.' },
  {
    name: 'accentColor',
    type: 'string',
    default: '-',
    description: 'Color of the button. Its label picks black or white for contrast.'
  },
  {
    name: 'menuLabel',
    type: 'boolean',
    default: 'true',
    description: 'Shows Menu and Close next to the menu icon, rolling between them.'
  },
  { name: 'intro', type: 'boolean', default: 'true', description: 'Unrolls the bar from its center on mount.' },
  { name: 'defaultOpen', type: 'boolean', default: 'false', description: 'Starts with the menu open.' },
  {
    name: 'open',
    type: 'boolean',
    default: '-',
    description: 'Controls the menu from outside. Pair it with onOpenChange.'
  },
  {
    name: 'onOpenChange',
    type: '(open: boolean) => void',
    default: '-',
    description: 'Called when the menu opens or closes.'
  },
  {
    name: 'linkComponent',
    type: 'string | Component',
    default: "'a'",
    description: "Renders the links, so you can pass your router's link. It receives href, class and its content."
  },
  {
    name: 'onLinkClick',
    type: '(link, item, event) => void',
    default: '-',
    description: 'Called when a link is clicked. The menu closes afterwards.'
  },
  { name: 'ariaLabel', type: 'string', default: "'Main'", description: 'Accessible name of the nav landmark.' },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the root.' },
  { name: 'style', type: 'CSSProperties', default: '-', description: 'Inline styles for the root.' }
];
</script>
