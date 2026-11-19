<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
    :demo-only-props="['preset']"
    :computed-props="computedProps"
  >
    <TabsLayout>
      <template #preview>
        <div class="demo-container relative" style="height: 400px">
          <div class="flex items-center justify-center w-full h-full">
            <StarBorder
              v-bind="shared"
              background-color="var(--bg-elevated)"
              border-color="var(--border-primary)"
              :style="{ height: '48px', padding: '0 22px', fontSize: '15px' }"
            >
              Get started
              <HugeiconsIcon :icon="ArrowRight02Icon" :size="17" :stroke-width="1.8" />
            </StarBorder>
          </div>
        </div>

        <Customize>
          <PreviewSelect
            title="Preset"
            :options="PRESET_OPTIONS"
            :model-value="props.preset"
            @update:model-value="applyPreset"
          />

          <PreviewColorPickerCustom
            title="Color"
            :color="shownColor"
            @change="(value: string) => updateProp('color', value)"
          />

          <PreviewColorPickerCustom
            title="Trail Color"
            :color="shownTrail"
            @change="(value: string) => updateProp('trailColor', value)"
          />

          <PreviewSlider
            title="Duration"
            :min="1"
            :max="12"
            :step="0.5"
            value-unit="s"
            :model-value="props.duration"
            @update:model-value="value => updateProp('duration', value)"
          />

          <PreviewSelect
            title="Direction"
            :options="DIRECTION_OPTIONS"
            :model-value="props.direction"
            @update:model-value="value => updateProp('direction', value as Direction)"
          />

          <PreviewSlider
            title="Stars"
            :min="1"
            :max="6"
            :step="1"
            :model-value="props.stars"
            @update:model-value="value => updateProp('stars', value)"
          />

          <PreviewSlider
            title="Trail Length"
            :min="0.05"
            :max="0.8"
            :step="0.05"
            :model-value="props.trailLength"
            @update:model-value="value => updateProp('trailLength', value)"
          />

          <PreviewSlider
            title="Thickness"
            :min="0.5"
            :max="4"
            :step="0.5"
            value-unit="px"
            :model-value="props.thickness"
            @update:model-value="value => updateProp('thickness', value)"
          />

          <PreviewSlider
            title="Radius"
            :min="0"
            :max="30"
            :step="1"
            value-unit="px"
            :model-value="props.radius"
            @update:model-value="value => updateProp('radius', value)"
          />

          <PreviewSlider
            title="Glow"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.glow"
            @update:model-value="value => updateProp('glow', value)"
          />

          <PreviewSelect
            title="Hover"
            :options="HOVER_OPTIONS"
            :model-value="props.hover"
            @update:model-value="value => updateProp('hover', value as StarBorderHover)"
          />

          <PreviewSwitch
            title="Sparkle"
            :model-value="props.sparkle"
            @update:model-value="value => updateProp('sparkle', value)"
          />

          <PreviewSwitch
            title="Click Pulse"
            :model-value="props.clickPulse"
            @update:model-value="value => updateProp('clickPulse', value)"
          />
        </Customize>

        <PropTable :data="propData" />
      </template>

      <template #code>
        <CodeExample :code-object="starBorder" component-name="StarBorder" />
      </template>
    </TabsLayout>
  </ComponentPropsProvider>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { HugeiconsIcon } from '@hugeicons/vue';
import { ArrowRight02Icon } from '@hugeicons/core-free-icons';
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
import { starBorder } from '@/constants/code/Animations/starBorderCode';
import StarBorder, { type StarBorderHover } from '@/content/Animations/StarBorder/StarBorder.vue';

type Direction = 'clockwise' | 'counterclockwise';

const DEFAULT_PROPS = {
  preset: 'comet',
  color: '#ffffff',
  trailColor: '#ffffff',
  duration: 4,
  direction: 'clockwise' as Direction,
  stars: 1,
  trailLength: 0.3,
  thickness: 1,
  radius: 12,
  glow: 0.6,
  sparkle: false,
  hover: 'lap' as StarBorderHover,
  clickPulse: true
};

type DemoProps = typeof DEFAULT_PROPS;

const PRESETS: Record<string, Partial<DemoProps>> = {
  comet: {},
  twin: { stars: 2, duration: 5, trailLength: 0.25 },
  ember: { color: '#ffcf8a', trailColor: '#ff4d2e', trailLength: 0.45, glow: 0.8 },
  frost: { color: '#e0f7ff', trailColor: '#38bdf8', thickness: 1.5, radius: 24 },
  stardust: { sparkle: true, duration: 6, glow: 0.7 },
  quiet: { hover: 'brighten', duration: 7, trailLength: 0.2, glow: 0.35 },
  reveal: { hover: 'reveal', duration: 3, trailLength: 0.4 }
};

const PRESET_OPTIONS = [
  { value: 'comet', label: 'Comet' },
  { value: 'twin', label: 'Twin' },
  { value: 'ember', label: 'Ember' },
  { value: 'frost', label: 'Frost' },
  { value: 'stardust', label: 'Stardust' },
  { value: 'quiet', label: 'Quiet' },
  { value: 'reveal', label: 'Reveal' }
];

const LIGHT_SWAP: Record<string, string> = {
  '#ffffff': '#18181b',
  '#ffcf8a': '#c2410c',
  '#ff4d2e': '#fb923c',
  '#e0f7ff': '#0369a1'
};

const DIRECTION_OPTIONS = [
  { value: 'clockwise', label: 'Clockwise' },
  { value: 'counterclockwise', label: 'Counterclockwise' }
];

const HOVER_OPTIONS = [
  { value: 'lap', label: 'Lap' },
  { value: 'brighten', label: 'Brighten' },
  { value: 'reveal', label: 'Reveal' },
  { value: 'none', label: 'None' }
];

const { props, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);
const theme = useColorModeValue<'light' | 'dark'>('light', 'dark');
const light = computed(() => theme.value === 'light');
const swap = (value: string) => (light.value ? (LIGHT_SWAP[value] ?? value) : value);
const shownColor = computed(() => swap(props.value.color));
const shownTrail = computed(() =>
  props.value.trailColor === DEFAULT_PROPS.trailColor ? shownColor.value : swap(props.value.trailColor)
);

const applyPreset = (value: string | number) => {
  const key = String(value);
  updateProps({ ...DEFAULT_PROPS, ...PRESETS[key], preset: key });
};

const computedProps = computed(() => ({
  color: shownColor.value,
  trailColor: shownTrail.value,
  ...(light.value ? { theme: 'light' } : {})
}));

const shared = computed(() => {
  const { preset: _preset, color: _color, trailColor: _trailColor, ...settings } = props.value;
  return { ...settings, color: shownColor.value, trailColor: shownTrail.value, theme: theme.value };
});

const propData: PropRow[] = [
  {
    name: 'as',
    type: 'string | Component',
    default: "'button'",
    description: 'Element or component to render, for example a, div or a router link.'
  },
  {
    name: 'color',
    type: 'string',
    default: '-',
    description: 'Color of the star and its glow. Defaults to white on dark and ink on light.'
  },
  {
    name: 'trailColor',
    type: 'string',
    default: '-',
    description: 'Color the trail fades into behind the star. Defaults to color.'
  },
  {
    name: 'duration',
    type: 'number',
    default: '4',
    description: 'Seconds for one lap around the border. The star keeps the same pace on any shape.'
  },
  {
    name: 'direction',
    type: "'clockwise' | 'counterclockwise'",
    default: "'clockwise'",
    description: 'Which way the star travels.'
  },
  {
    name: 'stars',
    type: 'number',
    default: '1',
    description: 'Stars spaced evenly around the border, up to 6.'
  },
  {
    name: 'trailLength',
    type: 'number',
    default: '0.3',
    description: 'Length of the trail as a share of the border. Trails stretch when the star speeds up.'
  },
  { name: 'thickness', type: 'number', default: '1', description: 'Border width in pixels.' },
  {
    name: 'radius',
    type: 'number',
    default: '12',
    description: 'Corner radius in pixels. Values past half the height give a pill.'
  },
  {
    name: 'glow',
    type: 'number',
    default: '0.6',
    description: 'Bloom around the star and its trail, from 0 to 1. Light spills onto the surface and the page.'
  },
  {
    name: 'sparkle',
    type: 'boolean',
    default: 'false',
    description: 'Puts a small twinkling glint at the front of each trail and lets it shed fine stardust.'
  },
  {
    name: 'hover',
    type: "'lap' | 'brighten' | 'reveal' | 'none'",
    default: "'lap'",
    description:
      'What happens on hover and keyboard focus. Lap sends the star once around the border, brighten makes the light shine stronger, and reveal keeps it hidden until then.'
  },
  {
    name: 'clickPulse',
    type: 'boolean',
    default: 'true',
    description: 'Sends light racing around the border from the point you press.'
  },
  {
    name: 'theme',
    type: "'dark' | 'light'",
    default: "'dark'",
    description: 'Picks the default surface, text, border and star colors.'
  },
  {
    name: 'backgroundColor',
    type: 'string',
    default: '-',
    description: 'Surface color. Follows the theme when not set.'
  },
  { name: 'textColor', type: 'string', default: '-', description: 'Text color. Follows the theme when not set.' },
  {
    name: 'borderColor',
    type: 'string',
    default: '-',
    description: 'Color of the resting border the star travels on. Follows the theme when not set.'
  },
  {
    name: 'className',
    type: 'string',
    default: "''",
    description: 'Extra classes for the root, for example to change padding or font.'
  },
  { name: 'style', type: 'CSSProperties', default: '-', description: 'Inline styles for the root.' }
];
</script>
