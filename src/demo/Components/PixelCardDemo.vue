<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
    :demo-only-props="['preset', 'demo', 'palette']"
    :computed-props="computedProps"
  >
    <TabsLayout>
      <template #preview>
        <div
          class="demo-container relative grid h-auto min-h-[480px] grid-cols-[minmax(0,1fr)] place-items-center overflow-hidden px-4 py-14 md:min-h-[540px] md:px-8 md:py-12"
        >
          <RefreshButton @click="forceRerender" />
          <div :key="rerenderKey" class="grid w-full grid-cols-[minmax(0,1fr)] justify-items-center">
            <div
              v-if="props.demo === 'pricing'"
              class="grid w-full max-w-[760px] grid-cols-1 gap-[14px] md:grid-cols-3"
            >
              <div v-for="(plan, index) in PLANS" :key="plan.name" class="h-[330px] md:h-[372px]">
                <PixelCard
                  v-bind="card"
                  :trigger="plan.featured ? 'always' : card.trigger"
                  :intro-delay="index * 140"
                  :style="{ width: '100%', height: '100%' }"
                >
                  <div class="flex h-full w-full flex-col p-[22px] text-left" :style="{ textShadow: ink.halo }">
                    <div class="flex items-center gap-[10px]">
                      <div class="pixel-card-demo-tile" :style="tileStyle(32)">
                        <HugeiconsIcon :icon="plan.icon" :size="16" :color="ink.text" :stroke-width="1.6" />
                      </div>
                      <p class="text-[15px] font-semibold" :style="{ color: ink.text }">{{ plan.name }}</p>
                      <p v-if="plan.featured" class="ml-auto text-[12px] font-medium" :style="{ color: accent }">
                        Popular
                      </p>
                    </div>
                    <div class="mt-[22px] flex items-baseline gap-[4px]">
                      <p class="text-[34px] leading-none font-semibold tracking-[-0.03em]" :style="{ color: ink.text }">
                        {{ plan.price }}
                      </p>
                      <p class="text-[13px]" :style="{ color: ink.muted }">/month</p>
                    </div>
                    <p class="mt-[8px] text-[13px]" :style="{ color: ink.muted }">{{ plan.note }}</p>
                    <ul class="m-0 mt-[22px] flex list-none flex-col gap-[10px] p-0">
                      <li
                        v-for="feature in plan.features"
                        :key="feature"
                        class="flex items-center gap-[8px] text-[13px]"
                        :style="{ color: ink.text }"
                      >
                        <HugeiconsIcon :icon="Tick02Icon" :size="15" :color="ink.faint" :stroke-width="2" />
                        {{ feature }}
                      </li>
                    </ul>
                    <div class="mt-auto pt-[20px]">
                      <button
                        type="button"
                        class="pixel-card-demo-button"
                        :style="
                          plan.featured
                            ? { background: ink.solid, color: ink.solidText, '--demo-hover': ink.hover }
                            : { background: ink.tile, color: ink.text, boxShadow: ink.rim, '--demo-hover': ink.hover }
                        "
                      >
                        {{ plan.cta }}
                      </button>
                    </div>
                  </div>
                </PixelCard>
              </div>
            </div>

            <div
              v-if="props.demo === 'bento'"
              class="grid w-full max-w-[760px] auto-rows-[180px] grid-cols-1 gap-[14px] md:auto-rows-[178px] md:grid-cols-3"
            >
              <div class="md:col-span-2">
                <PixelCard v-bind="card" :intro-delay="0" :style="{ width: '100%', height: '100%' }">
                  <div
                    class="flex h-full w-full flex-col justify-between p-[20px] text-left"
                    :style="{ textShadow: ink.halo }"
                  >
                    <div class="flex items-center">
                      <div
                        v-for="(initials, index) in PEOPLE"
                        :key="initials"
                        class="grid h-[32px] w-[32px] place-items-center rounded-full text-[11px] font-semibold"
                        :style="{
                          marginLeft: index ? '-8px' : '0',
                          color: ink.text,
                          background: ink.tile,
                          boxShadow: ink.rim
                        }"
                      >
                        {{ initials }}
                      </div>
                      <p class="ml-[10px] text-[12px]" :style="{ color: ink.muted }">4 editing now</p>
                    </div>
                    <div>
                      <p class="text-[15px] font-semibold" :style="{ color: ink.text }">Realtime collaboration</p>
                      <p class="mt-[4px] text-[13px] leading-[1.5]" :style="{ color: ink.muted }">
                        Edit together and see every cursor as it moves.
                      </p>
                    </div>
                  </div>
                </PixelCard>
              </div>
              <div class="md:row-span-2">
                <PixelCard v-bind="card" :intro-delay="160" :style="{ width: '100%', height: '100%' }">
                  <div
                    class="flex h-full w-full flex-col justify-between p-[20px] text-left"
                    :style="{ textShadow: ink.halo }"
                  >
                    <div class="pixel-card-demo-tile" :style="tileStyle(34)">
                      <HugeiconsIcon :icon="WorkflowSquare03Icon" :size="17" :color="ink.text" :stroke-width="1.6" />
                    </div>
                    <div class="my-[16px] flex flex-col gap-[8px]">
                      <div
                        v-for="step in STEPS"
                        :key="step.label"
                        class="flex h-[34px] items-center gap-[8px] rounded-[10px] px-[10px] text-[13px]"
                        :style="{ color: ink.text, background: ink.tile, boxShadow: ink.rim, textShadow: 'none' }"
                      >
                        <HugeiconsIcon :icon="Tick02Icon" :size="15" :color="ink.faint" :stroke-width="2" />
                        {{ step.label }}
                        <span class="ml-auto text-[12px]" :style="{ color: ink.muted }">{{ step.time }}</span>
                      </div>
                    </div>
                    <div>
                      <p class="text-[15px] font-semibold" :style="{ color: ink.text }">Automated workflows</p>
                      <p class="mt-[4px] text-[13px] leading-[1.5]" :style="{ color: ink.muted }">
                        Every push is built, tested and shipped.
                      </p>
                    </div>
                  </div>
                </PixelCard>
              </div>
              <div v-for="(feature, index) in FEATURES" :key="feature.title">
                <PixelCard v-bind="card" :intro-delay="320 + index * 160" :style="{ width: '100%', height: '100%' }">
                  <div
                    class="flex h-full w-full flex-col justify-between gap-[16px] p-[20px] text-left"
                    :style="{ textShadow: ink.halo }"
                  >
                    <div class="pixel-card-demo-tile" :style="tileStyle(34)">
                      <HugeiconsIcon :icon="feature.icon" :size="17" :color="ink.text" :stroke-width="1.6" />
                    </div>
                    <div>
                      <p class="text-[15px] font-semibold" :style="{ color: ink.text }">{{ feature.title }}</p>
                      <p class="mt-[4px] text-[13px] leading-[1.5]" :style="{ color: ink.muted }">
                        {{ feature.text }}
                      </p>
                    </div>
                  </div>
                </PixelCard>
              </div>
            </div>

            <PixelCard v-if="props.demo === 'basic'" v-bind="card">
              <div class="pixel-card-demo-icon" :style="{ color: ink.text, '--demo-glow': glowColor }">
                <HugeiconsIcon :icon="ICONS[props.preset] ?? SparklesIcon" :size="48" :stroke-width="1.5" />
              </div>
            </PixelCard>
          </div>
        </div>

        <Customize>
          <PreviewColorList
            title="Colors"
            :min="1"
            :max="6"
            :model-value="colors"
            @update:model-value="value => updateProps({ colors: value, palette: 'custom' })"
          />
          <PreviewSelect
            title="Demo"
            :options="DEMO_OPTIONS"
            :model-value="props.demo"
            @update:model-value="onDemoChange"
          />
          <PreviewSelect
            title="Preset"
            :options="PRESET_OPTIONS"
            :model-value="props.preset"
            @update:model-value="applyPreset"
          />
          <PreviewColorPickerCustom
            title="Glow Color"
            :color="glowColor"
            @change="value => updateProps({ glowColor: value, palette: 'custom' })"
          />
          <PreviewSelect
            title="Trigger"
            :options="TRIGGER_OPTIONS"
            :model-value="props.trigger"
            @update:model-value="value => updateProp('trigger', value as Trigger)"
          />
          <PreviewSelect
            title="Shape"
            :options="SHAPE_OPTIONS"
            :model-value="props.shape"
            @update:model-value="value => updateProp('shape', value as Shape)"
          />
          <PreviewSelect
            title="Origin"
            :options="ORIGIN_OPTIONS"
            :model-value="props.origin"
            @update:model-value="value => updateProp('origin', value as Origin)"
          />
          <PreviewSlider
            title="Gap"
            :min="3"
            :max="20"
            :step="1"
            value-unit="px"
            :model-value="props.gap"
            @update:model-value="value => updateProp('gap', value)"
          />
          <PreviewSlider
            title="Pixel Size"
            :min="1"
            :max="10"
            :step="0.1"
            value-unit="px"
            :model-value="props.pixelSize"
            @update:model-value="value => updateProp('pixelSize', value)"
          />
          <PreviewSlider
            title="Speed"
            :min="0"
            :max="100"
            :step="1"
            :model-value="props.speed"
            @update:model-value="value => updateProp('speed', value)"
          />
          <PreviewSlider
            title="Reveal Duration"
            :min="200"
            :max="1600"
            :step="50"
            value-unit="ms"
            :model-value="props.revealDuration"
            @update:model-value="value => updateProp('revealDuration', value)"
          />
          <PreviewSlider
            title="Spotlight"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.spotlight"
            @update:model-value="value => updateProp('spotlight', value)"
          />
          <PreviewSlider
            title="Glow"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.glow"
            @update:model-value="value => updateProp('glow', value)"
          />
          <PreviewSlider
            title="Opacity"
            :min="0.1"
            :max="1"
            :step="0.05"
            :model-value="props.opacity"
            @update:model-value="value => updateProp('opacity', value)"
          />
          <PreviewSlider
            title="Fade"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.fade"
            @update:model-value="value => updateProp('fade', value)"
          />
          <PreviewSlider
            title="Radius"
            :min="0"
            :max="48"
            :step="1"
            value-unit="px"
            :model-value="props.radius"
            @update:model-value="value => updateProp('radius', value)"
          />
          <PreviewSwitch
            title="Click Pulse"
            :model-value="props.clickPulse"
            @update:model-value="value => updateProp('clickPulse', value)"
          />
          <PreviewSwitch title="Intro" :model-value="props.intro" @update:model-value="onIntroChange" />
        </Customize>

        <PropTable :data="propData" />
      </template>

      <template #code>
        <CodeExample :code-object="pixelCard" component-name="PixelCard" />
      </template>
    </TabsLayout>
  </ComponentPropsProvider>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { HugeiconsIcon } from '@hugeicons/vue';
import {
  DropletIcon,
  Fire03Icon,
  FlowerIcon,
  Globe02Icon,
  GridIcon,
  Moon02Icon,
  Rocket01Icon,
  SecurityCheckIcon,
  SparklesIcon,
  Sun02Icon,
  Tick02Icon,
  UserGroupIcon,
  WorkflowSquare03Icon
} from '@hugeicons/core-free-icons';
import CodeExample from '@/components/common/CodeExample.vue';
import Customize from '@/components/common/Customize.vue';
import PreviewColorList from '@/components/common/PreviewColorList.vue';
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
import { pixelCard } from '@/constants/code/Components/pixelCardCode';
import PixelCard from '@/content/Components/PixelCard/PixelCard.vue';

type Tone = 'dark' | 'light';
type Shape = 'square' | 'circle' | 'diamond';
type Origin = 'center' | 'pointer';
type Trigger = 'hover' | 'click' | 'always';

const PALETTES: Record<string, { dark: string[]; light: string[]; glow: string[] }> = {
  classic: {
    dark: ['#f8fafc', '#f1f5f9', '#cbd5e1'],
    light: ['#161816', '#4f5550', '#9ca39d'],
    glow: ['#cbd5e1', '#6c736d']
  },
  ocean: {
    dark: ['#e0f2fe', '#7dd3fc', '#0ea5e9'],
    light: ['#0c4a6e', '#0369a1', '#0284c7'],
    glow: ['#0ea5e9', '#0284c7']
  },
  sunbeam: {
    dark: ['#fef08a', '#fde047', '#eab308'],
    light: ['#713f12', '#a16207', '#ca8a04'],
    glow: ['#eab308', '#ca8a04']
  },
  bloom: {
    dark: ['#fecdd3', '#fda4af', '#e11d48'],
    light: ['#831843', '#be123c', '#e11d48'],
    glow: ['#e11d48', '#be123c']
  },
  halo: {
    dark: ['#ccfbf1', '#5eead4', '#14b8a6'],
    light: ['#134e4a', '#0f766e', '#0d9488'],
    glow: ['#14b8a6', '#0d9488']
  },
  ember: {
    dark: ['#ffedd5', '#fdba74', '#f97316'],
    light: ['#7c2d12', '#c2410c', '#ea580c'],
    glow: ['#f97316', '#ea580c']
  }
};

const ICONS: Record<string, unknown> = {
  classic: SparklesIcon,
  ocean: DropletIcon,
  sunbeam: Sun02Icon,
  bloom: FlowerIcon,
  mosaic: GridIcon,
  halo: Moon02Icon,
  ember: Fire03Icon
};

const INK: Record<Tone, Record<string, string>> = {
  dark: {
    text: '#f3f5f3',
    muted: 'rgba(243, 245, 243, 0.62)',
    faint: 'rgba(243, 245, 243, 0.36)',
    tile: 'linear-gradient(180deg, #343834 0%, #232623 100%)',
    rim: 'inset 0 0 0 1px rgba(255, 255, 255, 0.07), inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 4px 10px -4px rgba(0, 0, 0, 0.7)',
    solid: '#f3f5f3',
    solidText: '#111311',
    hover: 'brightness(1.12)',
    halo: '0 1px 2px rgba(13, 14, 13, 0.95), 0 0 10px rgba(13, 14, 13, 0.9), 0 0 22px rgba(13, 14, 13, 0.75)'
  },
  light: {
    text: '#161816',
    muted: 'rgba(22, 24, 22, 0.62)',
    faint: 'rgba(22, 24, 22, 0.38)',
    tile: 'linear-gradient(180deg, #ffffff 0%, #f6f8f6 100%)',
    rim: 'inset 0 0 0 1px rgba(22, 24, 22, 0.08), inset 0 1px 0 rgba(255, 255, 255, 1), 0 4px 10px -5px rgba(22, 24, 22, 0.25)',
    solid: '#161816',
    solidText: '#ffffff',
    hover: 'brightness(0.97)',
    halo: '0 0 2px rgba(255, 255, 255, 0.95), 0 0 10px rgba(255, 255, 255, 0.92), 0 0 22px rgba(255, 255, 255, 0.8)'
  }
};

const PLANS = [
  {
    name: 'Starter',
    price: '$0',
    note: 'For side projects',
    features: ['3 projects', 'Community support', 'Basic analytics'],
    cta: 'Get started',
    icon: SparklesIcon,
    featured: false
  },
  {
    name: 'Pro',
    price: '$24',
    note: 'For growing teams',
    features: ['Unlimited projects', 'Priority support', 'Advanced analytics'],
    cta: 'Upgrade to Pro',
    icon: Rocket01Icon,
    featured: true
  },
  {
    name: 'Team',
    price: '$59',
    note: 'For organizations',
    features: ['Shared workspaces', 'SSO and audit logs', 'Dedicated manager'],
    cta: 'Contact sales',
    icon: UserGroupIcon,
    featured: false
  }
];

const PEOPLE = ['AK', 'JM', 'SR', 'LT'];
const STEPS = [
  { label: 'Build', time: '12s' },
  { label: 'Test', time: '48s' },
  { label: 'Deploy', time: '9s' }
];

const FEATURES = [
  { icon: SecurityCheckIcon, title: 'SSO and audit logs', text: 'Every sign-in on record.' },
  { icon: Globe02Icon, title: 'Global edge', text: 'Served close to every visitor.' }
];

const LOOK = {
  palette: 'classic',
  colors: PALETTES.classic.dark,
  glowColor: PALETTES.classic.glow[0],
  shape: 'square' as Shape,
  origin: 'center' as Origin,
  gap: 5,
  pixelSize: 2,
  speed: 35,
  revealDuration: 600,
  spotlight: 0.5,
  glow: 0.5,
  opacity: 0.35,
  fade: 0.7,
  trigger: 'hover' as Trigger,
  radius: 24,
  clickPulse: true,
  intro: true
};

type Look = typeof LOOK;

const DEFAULT_PROPS = { preset: 'classic', demo: 'pricing', ...LOOK };

const withPalette = (name: string, rest: Partial<Look>): Look => ({
  ...LOOK,
  palette: name,
  colors: PALETTES[name].dark,
  glowColor: PALETTES[name].glow[0],
  ...rest
});

const PRESETS: Record<string, Look> = {
  classic: LOOK,
  ocean: withPalette('ocean', { gap: 10, pixelSize: 3, speed: 25, origin: 'pointer', spotlight: 0.7 }),
  sunbeam: withPalette('sunbeam', { gap: 4, pixelSize: 1.8, speed: 20, glow: 0.6 }),
  bloom: withPalette('bloom', { gap: 7, pixelSize: 3, speed: 80, shape: 'circle' }),
  mosaic: { ...LOOK, gap: 12, pixelSize: 7, speed: 14, spotlight: 0.8, radius: 18 },
  halo: withPalette('halo', {
    gap: 9,
    pixelSize: 4,
    shape: 'circle',
    origin: 'pointer',
    spotlight: 1,
    glow: 0.7,
    radius: 32
  }),
  ember: withPalette('ember', { gap: 8, pixelSize: 3.4, speed: 50, shape: 'diamond', revealDuration: 800 })
};

const modeOpacity = (demo: string) => (demo === 'basic' ? 0.7 : 0.35);

const DEMO_OPTIONS = [
  { value: 'pricing', label: 'Pricing' },
  { value: 'bento', label: 'Bento' },
  { value: 'basic', label: 'Basic' }
];

const PRESET_OPTIONS = [
  { value: 'classic', label: 'Classic' },
  { value: 'ocean', label: 'Ocean' },
  { value: 'sunbeam', label: 'Sunbeam' },
  { value: 'bloom', label: 'Bloom' },
  { value: 'mosaic', label: 'Mosaic' },
  { value: 'halo', label: 'Halo' },
  { value: 'ember', label: 'Ember' }
];

const SHAPE_OPTIONS = [
  { value: 'square', label: 'Square' },
  { value: 'circle', label: 'Circle' },
  { value: 'diamond', label: 'Diamond' }
];

const TRIGGER_OPTIONS = [
  { value: 'hover', label: 'Hover' },
  { value: 'click', label: 'Click' },
  { value: 'always', label: 'Always' }
];

const ORIGIN_OPTIONS = [
  { value: 'center', label: 'Center' },
  { value: 'pointer', label: 'Pointer' }
];

const same = (a: string[], b: string[]) =>
  a.length === b.length && a.every((value, index) => value.toLowerCase() === b[index].toLowerCase());

const { rerenderKey, forceRerender } = useForceRerender();
const { props, defaultProps, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);
const theme = useColorModeValue<Tone>('light', 'dark');
const ink = computed(() => INK[theme.value]);

const settings = computed(() => {
  const { preset: _preset, demo: _demo, palette: _palette, ...rest } = props.value;
  return rest;
});

const tones = computed(() => PALETTES[props.value.palette] ?? PALETTES.classic);
const colors = computed(() =>
  theme.value === 'light' && same(settings.value.colors, tones.value.dark) ? tones.value.light : settings.value.colors
);
const glowColor = computed(() =>
  theme.value === 'light' && settings.value.glowColor.toLowerCase() === tones.value.glow[0].toLowerCase()
    ? tones.value.glow[1]
    : settings.value.glowColor
);
const accent = computed(() =>
  props.value.palette === 'classic' && settings.value.glowColor === PALETTES.classic.glow[0]
    ? ink.value.text
    : glowColor.value
);

const card = computed(() => ({
  ...settings.value,
  colors: colors.value,
  glowColor: glowColor.value,
  theme: theme.value
}));
const computedProps = computed(() => ({ colors: colors.value, glowColor: glowColor.value, theme: theme.value }));

const tileStyle = (size: number) => ({
  width: `${size}px`,
  height: `${size}px`,
  background: ink.value.tile,
  boxShadow: ink.value.rim
});

const applyPreset = (option: unknown) => {
  const value = String(option);
  const base = Object.fromEntries(
    Object.keys(LOOK).map(name => [name, defaultProps.value[name as keyof typeof DEFAULT_PROPS]])
  );
  updateProps({ ...base, ...PRESETS[value], opacity: modeOpacity(props.value.demo), preset: value });
  forceRerender();
};

const onDemoChange = (option: unknown) => {
  const value = String(option);
  updateProps({ demo: value, opacity: modeOpacity(value) });
  forceRerender();
};

const onIntroChange = (value: boolean) => {
  updateProp('intro', value);
  forceRerender();
};

const propData: PropRow[] = [
  {
    name: 'variant',
    type: "'default' | 'blue' | 'yellow' | 'pink'",
    default: "'default'",
    description: 'A ready-made palette with its own gap and speed. Any prop you pass overrides it.'
  },
  {
    name: 'colors',
    type: 'string | string[]',
    default: 'From variant',
    description: 'Pixel colors, as an array or a comma-separated string. Each pixel picks one at random.'
  },
  {
    name: 'glowColor',
    type: 'string',
    default: 'From variant',
    description: 'Color of the soft light that follows the cursor across the card.'
  },
  { name: 'gap', type: 'number', default: 'From variant', description: 'Distance between pixels, in px.' },
  { name: 'pixelSize', type: 'number', default: '2', description: 'Largest size a pixel grows to, in px.' },
  {
    name: 'speed',
    type: 'number',
    default: 'From variant',
    description: 'How fast the pixels twinkle, from 0 to 100. 0 holds them still.'
  },
  {
    name: 'shape',
    type: "'square' | 'circle' | 'diamond'",
    default: "'square'",
    description: 'Shape of each pixel.'
  },
  {
    name: 'origin',
    type: "'center' | 'pointer'",
    default: "'center'",
    description: 'Where the reveal wave starts: the middle of the card, or wherever the pointer enters.'
  },
  {
    name: 'revealDuration',
    type: 'number',
    default: '600',
    description: 'How long the wave takes to sweep across the card, in ms.'
  },
  {
    name: 'spotlight',
    type: 'number',
    default: '0.5',
    description: 'How much pixels near the cursor swell and brighten, from 0 to 1.'
  },
  { name: 'glow', type: 'number', default: '0.5', description: 'Strength of the soft light under the pixels.' },
  {
    name: 'opacity',
    type: 'number',
    default: '1',
    description: 'Opacity of the pixels and glow. Lower it to keep text on the card easy to read.'
  },
  {
    name: 'fade',
    type: 'number',
    default: '0',
    description: 'Fades the pixels out toward the middle so they frame your content, from 0 to 1.'
  },
  {
    name: 'trigger',
    type: "'hover' | 'click' | 'always'",
    default: "'hover'",
    description: 'What turns the effect on: hovering or focusing the card, clicking it on and off, or always on.'
  },
  {
    name: 'clickPulse',
    type: 'boolean',
    default: 'true',
    description: 'Clicking sends a ripple of brighter pixels out from the click.'
  },
  {
    name: 'intro',
    type: 'boolean',
    default: 'true',
    description: 'Plays the reveal once when the card first scrolls into view.'
  },
  {
    name: 'introDelay',
    type: 'number',
    default: '0',
    description: 'Wait before the intro, in ms. Stagger it across a row of cards.'
  },
  {
    name: 'noFocus',
    type: 'boolean',
    default: 'From variant',
    description: 'Stops keyboard focus from triggering the effect.'
  },
  { name: 'theme', type: "'dark' | 'light'", default: "'dark'", description: 'Color theme of the card.' },
  { name: 'radius', type: 'number', default: '24', description: 'Corner radius of the card, in px.' },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the card.' },
  { name: 'style', type: 'CSSProperties', default: '-', description: 'Inline styles for the card.' },
  {
    name: 'default slot',
    type: 'slot',
    default: '-',
    description: 'Card content. It is centered and sits above the pixels.'
  }
];
</script>

<style>
.pixel-card-demo-tile {
  display: grid;
  flex-shrink: 0;
  place-items: center;
  border-radius: 10px;
}

.pixel-card-demo-button {
  width: 100%;
  height: 38px;
  border: 0;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: filter 200ms ease;
}

.pixel-card-demo-button:hover {
  filter: var(--demo-hover);
}

.pixel-card-demo-icon {
  transition:
    color 320ms ease,
    transform 420ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

.pixel-card[data-active] .pixel-card-demo-icon {
  color: var(--demo-glow) !important;
  transform: scale(1.08);
}
</style>
