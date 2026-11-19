<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
    :demo-only-props="['preset', 'icons', 'palette', 'color']"
    :computed-props="computedProps"
  >
    <TabsLayout>
      <template #preview>
        <div
          class="demo-container relative overflow-hidden"
          style="height: 400px; padding: 16px; display: grid; place-items: center"
        >
          <GooeyNav
            :items="items"
            :theme="theme"
            :color="props.color || undefined"
            :colors="PALETTES[props.palette] ?? []"
            v-bind="settings"
          />
        </div>

        <Customize>
          <PreviewSelect
            title="Preset"
            :options="PRESET_OPTIONS"
            :model-value="props.preset"
            @update:model-value="value => applyPreset(String(value))"
          />

          <PreviewColorPickerCustom
            title="Pill Color"
            :color="props.color || pill"
            @change="value => updateProp('color', value)"
          />

          <PreviewSelect
            title="Size"
            :options="SIZE_OPTIONS"
            :model-value="props.size"
            @update:model-value="value => updateProp('size', value as GooeyNavSize)"
          />

          <PreviewSlider
            title="Particle Count"
            :min="1"
            :max="32"
            :step="1"
            :model-value="props.particleCount"
            @update:model-value="value => updateProp('particleCount', value)"
          />

          <PreviewSlider
            title="Spread"
            :min="0"
            :max="120"
            :step="2"
            value-unit="px"
            :model-value="props.spread"
            @update:model-value="value => updateProp('spread', value)"
          />

          <PreviewSlider
            title="Animation Time"
            :min="200"
            :max="1500"
            :step="50"
            value-unit="ms"
            :model-value="props.animationTime"
            @update:model-value="value => updateProp('animationTime', value)"
          />

          <PreviewSlider
            title="Time Variance"
            :min="0"
            :max="1000"
            :step="50"
            value-unit="ms"
            :model-value="props.timeVariance"
            @update:model-value="value => updateProp('timeVariance', value)"
          />

          <PreviewSlider
            title="Gooeyness"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.gooeyness"
            @update:model-value="value => updateProp('gooeyness', value)"
          />

          <PreviewSlider
            title="Wobble"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.wobble"
            @update:model-value="value => updateProp('wobble', value)"
          />

          <PreviewSwitch
            title="Frame"
            :model-value="props.frame"
            @update:model-value="value => updateProp('frame', value)"
          />

          <PreviewSwitch
            title="Icons"
            :model-value="props.icons"
            @update:model-value="value => updateProp('icons', value)"
          />

          <PreviewSwitch
            title="Hover Effect"
            :model-value="props.hoverEffect"
            @update:model-value="value => updateProp('hoverEffect', value)"
          />
        </Customize>

        <PropTable :data="propData" />
      </template>

      <template #code>
        <CodeExample :code-object="gooeyNav" component-name="GooeyNav" />
      </template>
    </TabsLayout>
  </ComponentPropsProvider>
</template>

<script setup lang="ts">
import { computed, h } from 'vue';
import { HugeiconsIcon, type IconArray } from '@hugeicons/vue';
import { Briefcase01Icon, Home01Icon, Mail01Icon, UserIcon } from '@hugeicons/core-free-icons';
import CodeExample from '@/components/common/CodeExample.vue';
import Customize from '@/components/common/Customize.vue';
import PreviewColorPickerCustom from '@/components/common/PreviewColorPickerCustom.vue';
import PreviewSelect from '@/components/common/PreviewSelect.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import ComponentPropsProvider from '@/components/context/ComponentPropsProvider.vue';
import { useComponentProps } from '@/composables/useComponentProps';
import { useColorModeValue } from '@/composables/useTheme';
import { gooeyNav } from '@/constants/code/Components/gooeyNavCode';
import GooeyNav, { type GooeyNavItem, type GooeyNavSize } from '@/content/Components/GooeyNav/GooeyNav.vue';

type PaletteName = 'none' | 'ember';
type PresetName = 'classic' | 'accent' | 'splash' | 'calm' | 'icons';

const LABELS = ['Home', 'Work', 'About', 'Contact'];
const ICONS = [Home01Icon, Briefcase01Icon, UserIcon, Mail01Icon];

const PALETTES: Record<string, string[]> = {
  none: [],
  ember: ['#ff5a1f', '#ff8a3a', '#ffb020']
};

const FEEL = {
  icons: false,
  palette: 'none' as PaletteName,
  particleCount: 15,
  spread: 56,
  timeVariance: 300,
  animationTime: 600,
  gooeyness: 0.5,
  wobble: 0.5
};

const DEFAULT_PROPS = {
  preset: 'classic' as PresetName,
  ...FEEL,
  color: '',
  size: 'md' as GooeyNavSize,
  frame: true,
  hoverEffect: true
};

const PRESETS: Record<PresetName, Partial<typeof DEFAULT_PROPS>> = {
  classic: { ...FEEL },
  accent: { ...FEEL, color: '#ff5a1f', palette: 'ember' },
  splash: { ...FEEL, particleCount: 24, spread: 84, gooeyness: 0.65, timeVariance: 450 },
  calm: { ...FEEL, particleCount: 8, spread: 28, wobble: 0.2, animationTime: 520 },
  icons: { ...FEEL, icons: true }
};

const PRESET_OPTIONS = [
  { value: 'classic', label: 'Classic' },
  { value: 'accent', label: 'Accent' },
  { value: 'splash', label: 'Splash' },
  { value: 'calm', label: 'Calm' },
  { value: 'icons', label: 'Icons' }
];

const SIZE_OPTIONS = [
  { value: 'sm', label: 'Small' },
  { value: 'md', label: 'Medium' },
  { value: 'lg', label: 'Large' }
];

const { props, defaultProps, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);
const theme = useColorModeValue<'light' | 'dark'>('light', 'dark');
const pill = useColorModeValue('#252825', '#f3f5f3');

const settings = computed(() => {
  const { preset: _preset, icons: _icons, palette: _palette, color: _color, ...rest } = props.value;
  return rest;
});

const items = computed<GooeyNavItem[]>(() =>
  LABELS.map((label, index) => ({
    label,
    href: '#',
    ...(props.value.icons
      ? { icon: h(HugeiconsIcon, { icon: ICONS[index] as IconArray, size: 16, strokeWidth: 1.8 }) }
      : {})
  }))
);

const applyPreset = (value: string) => {
  const base = Object.fromEntries(
    Object.keys(FEEL).map(name => [name, defaultProps.value[name as keyof typeof FEEL]])
  ) as Partial<typeof DEFAULT_PROPS>;
  updateProps({ ...base, color: '', ...PRESETS[value as PresetName], preset: value as PresetName });
};

const computedProps = computed(() => ({
  ...(props.value.color ? { color: props.value.color } : {}),
  ...(PALETTES[props.value.palette]?.length ? { colors: PALETTES[props.value.palette] } : {}),
  ...(theme.value === 'light' ? { theme: 'light' } : {})
}));

const propData: PropRow[] = [
  {
    name: 'items',
    type: '{ label: string; href?: string; icon?: VNode | Component }[]',
    default: '-',
    description: 'The navigation items. Items without an href render as buttons.'
  },
  { name: 'initialActiveIndex', type: 'number', default: '0', description: 'Which item starts selected.' },
  {
    name: 'activeIndex',
    type: 'number',
    default: '-',
    description: 'Controls the selected item yourself. Use it together with onChange.'
  },
  {
    name: 'onChange',
    type: '(index: number, item) => void',
    default: '-',
    description: 'Called when an item is selected.'
  },
  { name: 'theme', type: "'dark' | 'light'", default: "'dark'", description: 'Color theme of the frame and text.' },
  {
    name: 'color',
    type: 'string',
    default: '-',
    description: 'Color of the active pill. Uses a high-contrast color for the theme when not set.'
  },
  {
    name: 'activeTextColor',
    type: 'string',
    default: '-',
    description: 'Text color inside the pill. Picked automatically from the pill color when not set.'
  },
  {
    name: 'colors',
    type: 'string[]',
    default: '[]',
    description: 'Colors for the droplets. They blend as they merge. Uses the pill color when empty.'
  },
  { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Size of the items.' },
  { name: 'frame', type: 'boolean', default: 'true', description: 'Shows the frosted panel around the items.' },
  {
    name: 'animationTime',
    type: 'number',
    default: '600',
    description: 'Roughly how long the droplets take to travel to the new item, in ms.'
  },
  {
    name: 'particleCount',
    type: 'number',
    default: '15',
    description: 'How many droplets the pill breaks into when an item is selected.'
  },
  {
    name: 'spread',
    type: 'number',
    default: '56',
    description: 'How far the droplets scatter on their way to the new item, in px.'
  },
  {
    name: 'timeVariance',
    type: 'number',
    default: '300',
    description: 'Random variation in each droplet’s timing, in ms.'
  },
  {
    name: 'gooeyness',
    type: 'number',
    default: '0.5',
    description: 'How readily the droplets and pills melt together, from 0 to 1.'
  },
  {
    name: 'wobble',
    type: 'number',
    default: '0.5',
    description: 'How much the new pill wobbles as it forms, from 0 to 1.'
  },
  {
    name: 'hoverEffect',
    type: 'boolean',
    default: 'true',
    description: 'Shows a soft highlight behind the hovered item.'
  },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the nav.' },
  { name: 'style', type: 'CSSProperties', default: '-', description: 'Inline styles for the nav.' }
];
</script>
