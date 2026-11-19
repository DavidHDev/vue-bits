<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
    :demo-only-props="['demo', 'preset', 'glowColor']"
    :computed-props="computedProps"
  >
    <TabsLayout>
      <template #preview>
        <div class="demo-container magic-bento-demo relative overflow-hidden">
          <RefreshButton @click="forceRerender" />
          <div class="magic-bento-demo__frame">
            <MagicBento
              :key="`${rerenderKey}-${props.demo}`"
              :theme="theme"
              :items="items"
              :glow-color="color || undefined"
              v-bind="settings"
            />
          </div>
        </div>

        <Customize>
          <PreviewSelect
            title="Demo"
            :options="DEMO_OPTIONS"
            :model-value="props.demo"
            @update:model-value="value => updateProp('demo', value as DemoMode)"
          />

          <PreviewSelect
            title="Preset"
            :options="PRESET_OPTIONS"
            :model-value="props.preset"
            @update:model-value="value => applyPreset(String(value))"
          />

          <PreviewColorPickerCustom
            title="Glow Color"
            :color="color || (theme === 'light' ? '#161816' : '#f4f4f5')"
            @change="value => updateProp('glowColor', value)"
          />

          <PreviewSlider
            title="Spotlight Radius"
            :min="120"
            :max="600"
            :step="10"
            value-unit="px"
            :model-value="settings.spotlightRadius"
            @update:model-value="value => updateProp('spotlightRadius', value)"
          />

          <PreviewSlider
            title="Star Count"
            :min="6"
            :max="60"
            :step="1"
            :is-disabled="!settings.enableStars"
            :model-value="settings.particleCount"
            @update:model-value="value => updateProp('particleCount', value)"
          />

          <PreviewSlider
            title="Row Height"
            :min="170"
            :max="280"
            :step="5"
            value-unit="px"
            :model-value="settings.rowHeight"
            @update:model-value="value => updateProp('rowHeight', value)"
          />

          <PreviewSlider
            title="Gap"
            :min="4"
            :max="24"
            :step="1"
            value-unit="px"
            :model-value="settings.gap"
            @update:model-value="value => updateProp('gap', value)"
          />

          <PreviewSlider
            title="Radius"
            :min="0"
            :max="32"
            :step="1"
            value-unit="px"
            :model-value="settings.radius"
            @update:model-value="value => updateProp('radius', value)"
          />

          <PreviewSwitch
            title="Border Glow"
            :model-value="settings.enableBorderGlow"
            @update:model-value="value => updateProp('enableBorderGlow', value)"
          />

          <PreviewSwitch
            title="Spotlight"
            :model-value="settings.enableSpotlight"
            @update:model-value="value => updateProp('enableSpotlight', value)"
          />

          <PreviewSwitch
            title="Stars"
            :model-value="settings.enableStars"
            @update:model-value="value => updateProp('enableStars', value)"
          />

          <PreviewSwitch
            title="Tilt"
            :model-value="settings.enableTilt"
            @update:model-value="value => updateProp('enableTilt', value)"
          />

          <PreviewSwitch
            title="Magnetism"
            :model-value="settings.enableMagnetism"
            @update:model-value="value => updateProp('enableMagnetism', value)"
          />

          <PreviewSwitch
            title="Click Effect"
            :model-value="settings.clickEffect"
            @update:model-value="value => updateProp('clickEffect', value)"
          />

          <PreviewSwitch
            title="Text Auto Hide"
            :model-value="settings.textAutoHide"
            @update:model-value="value => updateProp('textAutoHide', value)"
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
        <CodeExample :code-object="magicBento" component-name="MagicBento" />
      </template>
    </TabsLayout>
  </ComponentPropsProvider>
</template>

<script setup lang="ts">
import { computed, h } from 'vue';
import { HugeiconsIcon, type IconArray } from '@hugeicons/vue';
import {
  AnalyticsUpIcon,
  DashboardSquare01Icon,
  PlugSocketIcon,
  SecurityCheckIcon,
  UserGroupIcon,
  WorkflowSquare03Icon
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
import { magicBento } from '@/constants/code/Components/magicBentoCode';
import MagicBento, { type MagicBentoItem } from '@/content/Components/MagicBento/MagicBento.vue';

type DemoMode = 'features' | 'gallery' | 'basic';
type PresetName = 'classic' | 'ember' | 'ocean' | 'mint' | 'tilt' | 'quiet';

const glyph = (icon: unknown) => h(HugeiconsIcon, { icon: icon as IconArray, size: 16, strokeWidth: 1.8 });

const BASIC: MagicBentoItem[] = [
  { label: 'Insights', title: 'Analytics', description: 'Track user behavior', icon: glyph(AnalyticsUpIcon) },
  { label: 'Overview', title: 'Dashboard', description: 'Centralized data view', icon: glyph(DashboardSquare01Icon) },
  {
    label: 'Teamwork',
    title: 'Collaboration',
    description: 'Work together seamlessly',
    icon: glyph(UserGroupIcon),
    colSpan: 2,
    rowSpan: 2
  },
  {
    label: 'Efficiency',
    title: 'Automation',
    description: 'Streamline workflows',
    icon: glyph(WorkflowSquare03Icon),
    colSpan: 2,
    rowSpan: 2
  },
  { label: 'Connectivity', title: 'Integration', description: 'Connect favorite tools', icon: glyph(PlugSocketIcon) },
  { label: 'Protection', title: 'Security', description: 'Enterprise-grade protection', icon: glyph(SecurityCheckIcon) }
];

const GALLERY: Record<'light' | 'dark', MagicBentoItem[]> = {
  light: [
    {
      image: '/assets/demo/day-portrait.webp',
      title: 'The Pier',
      description: 'Clear sky',
      colSpan: 2,
      rowSpan: 2
    },
    { image: '/assets/demo/day-sky.webp', title: 'Open Sky', description: 'Golden hour', colSpan: 2 },
    { image: '/assets/demo/day-landscape.webp', title: 'Canola Field', description: 'Midday' },
    { image: '/assets/demo/night-sky.webp', title: 'Open Sky', description: 'Blue hour' },
    { image: '/assets/demo/night-landscape.webp', title: 'Canola Field', description: 'Moonrise', colSpan: 2 },
    { image: '/assets/demo/night-portrait.webp', title: 'The Pier', description: 'Dusk', colSpan: 2 }
  ],
  dark: [
    {
      image: '/assets/demo/night-portrait.webp',
      title: 'The Pier',
      description: 'Dusk',
      colSpan: 2,
      rowSpan: 2
    },
    { image: '/assets/demo/night-sky.webp', title: 'Open Sky', description: 'Blue hour', colSpan: 2 },
    { image: '/assets/demo/night-landscape.webp', title: 'Canola Field', description: 'Moonrise' },
    { image: '/assets/demo/day-sky.webp', title: 'Open Sky', description: 'Golden hour' },
    { image: '/assets/demo/day-landscape.webp', title: 'Canola Field', description: 'Midday', colSpan: 2 },
    { image: '/assets/demo/day-portrait.webp', title: 'The Pier', description: 'Clear sky', colSpan: 2 }
  ]
};

const LOOK = {
  glowColor: '',
  spotlightRadius: 300,
  enableBorderGlow: true,
  enableSpotlight: true,
  enableStars: false,
  particleCount: 24,
  enableTilt: false,
  enableMagnetism: false
};

const DEFAULT_PROPS = {
  demo: 'features' as DemoMode,
  preset: 'classic' as PresetName,
  ...LOOK,
  rowHeight: 200,
  gap: 12,
  radius: 20,
  clickEffect: true,
  textAutoHide: true,
  intro: true
};

const PRESETS: Record<PresetName, Partial<typeof LOOK>> = {
  classic: {},
  ember: { glowColor: '#f97316', enableStars: true, particleCount: 28 },
  ocean: { glowColor: '#38bdf8', spotlightRadius: 420 },
  mint: { glowColor: '#34d399', enableStars: true, particleCount: 18, spotlightRadius: 260 },
  tilt: { enableTilt: true, enableMagnetism: true },
  quiet: { enableSpotlight: false, spotlightRadius: 220 }
};

const LIGHT_SWAP: Record<string, string> = {
  '#f97316': '#ea580c',
  '#38bdf8': '#0284c7',
  '#34d399': '#059669'
};

const PRESET_OPTIONS = [
  { value: 'classic', label: 'Classic' },
  { value: 'ember', label: 'Ember' },
  { value: 'ocean', label: 'Ocean' },
  { value: 'mint', label: 'Mint' },
  { value: 'tilt', label: 'Tilt' },
  { value: 'quiet', label: 'Quiet' }
];

const DEMO_OPTIONS = [
  { value: 'features', label: 'Features' },
  { value: 'gallery', label: 'Gallery' },
  { value: 'basic', label: 'Basic' }
];

const propData: PropRow[] = [
  {
    name: 'items',
    type: 'MagicBentoItem[]',
    default: 'Six feature cards',
    description:
      'Cards to show. Each takes label, title, description, icon, image, visual, content, href, onClick, colSpan and rowSpan.'
  },
  {
    name: 'items[].visual',
    type: 'VNode | Component | string',
    default: '-',
    description:
      'Artwork between the header and the text. Use your own node, or a built-in one: analytics, dashboard, collaboration, automation, integration or security.'
  },
  {
    name: 'items[].content',
    type: 'VNode | Component',
    default: '-',
    description: 'Replaces the whole inside of the card. The lights, border and click wave still apply.'
  },
  {
    name: 'items[].image',
    type: 'string',
    default: '-',
    description: 'Photo that fills the card, with a soft shade under the text.'
  },
  {
    name: 'columns',
    type: 'number',
    default: '4',
    description: 'Columns on wide screens. Drops to 2, then 1, as the grid gets narrower.'
  },
  { name: 'rowHeight', type: 'number', default: '200', description: 'Height of one row, in px.' },
  { name: 'gap', type: 'number', default: '12', description: 'Space between cards, in px.' },
  { name: 'radius', type: 'number', default: '20', description: 'Corner radius of the cards, in px.' },
  { name: 'theme', type: "'dark' | 'light'", default: "'dark'", description: 'Color theme of the cards.' },
  {
    name: 'glowColor',
    type: 'string',
    default: 'Text color',
    description: 'Color of the lights and the accents in the artwork. Takes hex or "r, g, b".'
  },
  {
    name: 'enableBorderGlow',
    type: 'boolean',
    default: 'true',
    description: 'Lights up the card edges near the cursor, across neighboring cards too.'
  },
  {
    name: 'enableSpotlight',
    type: 'boolean',
    default: 'true',
    description: 'A soft light follows the cursor inside the hovered card.'
  },
  { name: 'spotlightRadius', type: 'number', default: '300', description: 'Size of the cursor light, in px.' },
  {
    name: 'enableStars',
    type: 'boolean',
    default: 'false',
    description: 'Fine specks of light drift up around the cursor in the hovered card.'
  },
  { name: 'particleCount', type: 'number', default: '24', description: 'Number of specks in each card.' },
  { name: 'enableTilt', type: 'boolean', default: 'false', description: 'Tilts the hovered card toward the cursor.' },
  {
    name: 'enableMagnetism',
    type: 'boolean',
    default: 'false',
    description: 'The hovered card leans a few pixels toward the cursor.'
  },
  {
    name: 'clickEffect',
    type: 'boolean',
    default: 'true',
    description: 'Clicking sends a ring of light across the grid and replays the card artwork.'
  },
  {
    name: 'textAutoHide',
    type: 'boolean',
    default: 'true',
    description: 'Keeps titles to one line and descriptions to two.'
  },
  {
    name: 'intro',
    type: 'boolean',
    default: 'true',
    description: 'Cards rise in one by one and their artwork plays when the grid scrolls into view.'
  },
  {
    name: 'disableAnimations',
    type: 'boolean',
    default: 'false',
    description: 'Turns off all motion. Reduced motion settings do the same.'
  },
  {
    name: 'onItemClick',
    type: '(item, index) => void',
    default: '-',
    description: 'Called when a card is clicked. Cards become focusable buttons.'
  },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the grid.' },
  { name: 'style', type: 'CSSProperties', default: '-', description: 'Inline styles for the grid.' }
];

const { rerenderKey, forceRerender } = useForceRerender();
const { props, defaultProps, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);
const theme = useColorModeValue<'light' | 'dark'>('light', 'dark');

const settings = computed(() => {
  const { demo: _demo, preset: _preset, glowColor: _glowColor, ...rest } = props.value;
  return rest;
});

const picked = computed(() => {
  const value = props.value.glowColor;
  return value ? `#${String(value).replace(/^#/, '').toLowerCase()}` : '';
});

const color = computed(() =>
  picked.value && theme.value === 'light' ? (LIGHT_SWAP[picked.value] ?? picked.value) : picked.value
);

const items = computed(() =>
  props.value.demo === 'gallery' ? GALLERY[theme.value] : props.value.demo === 'basic' ? BASIC : undefined
);

const applyPreset = (value: string) => {
  const name = (value in PRESETS ? value : 'classic') as PresetName;
  const base = Object.fromEntries(
    Object.keys(LOOK).map(key => [key, defaultProps.value[key as keyof typeof LOOK]])
  ) as typeof LOOK;
  updateProps({ ...base, ...PRESETS[name], preset: name });
};

const computedProps = computed(() => ({
  ...(color.value ? { glowColor: color.value } : {}),
  ...(theme.value === 'light' ? { theme: 'light' } : {})
}));
</script>

<style scoped>
.magic-bento-demo {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  place-items: center;
  height: auto;
  min-height: 480px;
  padding: 56px 16px;
}

.magic-bento-demo__frame {
  width: 100%;
  max-width: 760px;
}

@media (min-width: 768px) {
  .magic-bento-demo {
    min-height: 600px;
    padding: 48px 32px;
  }
}
</style>
