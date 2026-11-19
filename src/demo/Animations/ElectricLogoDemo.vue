<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetAll"
    :has-changes="hasChanges"
  >
    <TabsLayout>
      <template #preview>
        <div class="demo-container relative overflow-hidden" style="height: 500px; padding: 0">
          <ElectricLogo
            :key="rerenderKey"
            :src="src"
            :color="renderedColor"
            :glow-color="renderedGlow"
            :scale="props.scale"
            :intensity="props.intensity"
            :glow="props.glow"
            :thickness="props.thickness"
            :strands="props.strands"
            :bend="renderedBend"
            :crackle="props.crackle"
            :arcs="props.arcs"
            :flicker="props.flicker"
            :fill="props.fill"
            :speed="props.speed"
            :interactive="props.interactive"
            :cursor-intensity="props.cursorIntensity"
            :cursor-radius="props.cursorRadius"
            :theme="theme"
          />
          <RefreshButton @click="forceRerender" />
        </div>

        <Customize>
          <PreviewSelect title="Image" :options="imageOptions" :model-value="image" @update:model-value="selectImage" />
          <div class="scrubber">
            <button type="button" class="scrubber-track scrubber-track--select" @click="inputRef?.click()">
              <span class="scrubber-label">Upload</span>
              <span class="scrubber-select-right">
                <span
                  class="scrubber-value"
                  style="max-width: 160px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap"
                >
                  {{ upload ? upload.name : 'SVG or PNG' }}
                </span>
              </span>
            </button>
            <input
              ref="inputRef"
              type="file"
              accept="image/svg+xml,image/png,image/webp,image/jpeg"
              hidden
              @change="handleFile"
            />
          </div>

          <PreviewColorPickerCustom
            title="Color"
            :color="renderedColor"
            @change="(value: string) => updateProp('color', value)"
          />
          <PreviewColorPickerCustom
            title="Glow Color"
            :color="renderedGlow"
            @change="(value: string) => updateProp('glowColor', value)"
          />

          <PreviewSlider
            title="Scale"
            :min="0.2"
            :max="1"
            :step="0.05"
            :model-value="props.scale"
            @update:model-value="value => updateProp('scale', value)"
          />
          <PreviewSlider
            title="Intensity"
            :min="0.2"
            :max="2"
            :step="0.05"
            :model-value="props.intensity"
            @update:model-value="value => updateProp('intensity', value)"
          />
          <PreviewSlider
            title="Glow"
            :min="0"
            :max="2"
            :step="0.05"
            :model-value="props.glow"
            @update:model-value="value => updateProp('glow', value)"
          />
          <PreviewSlider
            title="Fill"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.fill"
            @update:model-value="value => updateProp('fill', value)"
          />
          <PreviewSlider
            title="Thickness"
            :min="0.5"
            :max="3"
            :step="0.1"
            value-unit="px"
            :model-value="props.thickness"
            @update:model-value="value => updateProp('thickness', value)"
          />
          <PreviewSlider
            title="Strands"
            :min="1"
            :max="6"
            :step="1"
            :model-value="props.strands"
            @update:model-value="value => updateProp('strands', value)"
          />
          <PreviewSlider
            title="Bend"
            :min="0"
            :max="2"
            :step="0.05"
            :model-value="renderedBend"
            @update:model-value="value => updateProp('bend', value)"
          />
          <PreviewSlider
            title="Crackle"
            :min="0"
            :max="2"
            :step="0.05"
            :model-value="props.crackle"
            @update:model-value="value => updateProp('crackle', value)"
          />
          <PreviewSlider
            title="Arcs"
            :min="0"
            :max="2"
            :step="0.05"
            :model-value="props.arcs"
            @update:model-value="value => updateProp('arcs', value)"
          />
          <PreviewSlider
            title="Flicker"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.flicker"
            @update:model-value="value => updateProp('flicker', value)"
          />
          <PreviewSlider
            title="Speed"
            :min="0"
            :max="3"
            :step="0.05"
            :model-value="props.speed"
            @update:model-value="value => updateProp('speed', value)"
          />
          <PreviewSwitch
            title="Interactive"
            :model-value="props.interactive"
            @update:model-value="value => updateProp('interactive', value)"
          />
          <PreviewSlider
            title="Cursor Intensity"
            :min="0"
            :max="2"
            :step="0.05"
            :is-disabled="!props.interactive"
            :model-value="props.cursorIntensity"
            @update:model-value="value => updateProp('cursorIntensity', value)"
          />
          <PreviewSlider
            title="Cursor Radius"
            :min="40"
            :max="300"
            :step="5"
            value-unit="px"
            :is-disabled="!props.interactive"
            :model-value="props.cursorRadius"
            @update:model-value="value => updateProp('cursorRadius', value)"
          />
        </Customize>

        <PropTable :data="propData" />
        <Dependencies :dependency-list="['ogl']" />
      </template>

      <template #code>
        <CodeExample :code-object="electricLogo" component-name="ElectricLogo" />
      </template>
    </TabsLayout>
  </ComponentPropsProvider>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';
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
import { electricLogo } from '@/constants/code/Animations/electricLogoCode';
import ElectricLogo from '@/content/Animations/ElectricLogo/ElectricLogo.vue';
import logo from '@/assets/logos/vue-bits-logo-small.svg';
import apple from '@/assets/logos/apple.svg';
import tesla from '@/assets/logos/tesla.svg';
import openai from '@/assets/logos/openai.svg';

type PaletteName = 'logo' | 'apple' | 'tesla' | 'openai';
type Palette = { color: string; glowColor: string };

const LOGOS: Record<PaletteName, string> = { logo, apple, tesla, openai };

const PALETTES: Record<PaletteName, { dark: Palette; light: Palette }> = {
  logo: {
    dark: { color: '#dcffd5', glowColor: '#7cff67' },
    light: { color: '#1f9d45', glowColor: '#8fe08a' }
  },
  apple: {
    dark: { color: '#cadcff', glowColor: '#528aff' },
    light: { color: '#3377ff', glowColor: '#99b8ff' }
  },
  tesla: {
    dark: { color: '#ffcdd2', glowColor: '#ff5260' },
    light: { color: '#ef3848', glowColor: '#ffa3ab' }
  },
  openai: {
    dark: { color: '#c2fff1', glowColor: '#1fd8b6' },
    light: { color: '#0ea88f', glowColor: '#7fe6d5' }
  }
};

const LIGHT_BEND = 0.5;

const lightFor = (name: keyof Palette, value: string) =>
  Object.values(PALETTES).find(palette => palette.dark[name] === value)?.light[name] ?? value;

const DEFAULT_PROPS = {
  color: PALETTES.logo.dark.color,
  glowColor: PALETTES.logo.dark.glowColor,
  scale: 0.7,
  intensity: 1,
  glow: 1,
  thickness: 1.5,
  strands: 4,
  bend: 0.6,
  crackle: 1.5,
  arcs: 1,
  flicker: 0.6,
  fill: 0,
  speed: 2.5,
  interactive: true,
  cursorIntensity: 0.75,
  cursorRadius: 100
};

const { rerenderKey, forceRerender } = useForceRerender();
const { props, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);

const image = ref<string>(
  (Object.keys(PALETTES) as PaletteName[]).find(name => PALETTES[name].dark.color === props.value.color) || 'logo'
);
const upload = ref<{ url: string; name: string } | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);

watch(upload, (_next, previous) => {
  if (previous) URL.revokeObjectURL(previous.url);
});

onBeforeUnmount(() => {
  if (upload.value) URL.revokeObjectURL(upload.value.url);
});

const handleFile = (e: Event) => {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  input.value = '';
  if (!file) return;
  upload.value = { url: URL.createObjectURL(file), name: file.name };
  image.value = 'upload';
};

const imageOptions = computed(() => [
  { label: 'Vue Bits', value: 'logo' },
  { label: 'Apple', value: 'apple' },
  { label: 'Tesla', value: 'tesla' },
  { label: 'OpenAI', value: 'openai' },
  ...(upload.value ? [{ label: 'Your upload', value: 'upload' }] : [])
]);

const src = computed(() =>
  image.value === 'upload' && upload.value ? upload.value.url : LOGOS[image.value as PaletteName] || logo
);

const theme = useColorModeValue<'dark' | 'light'>('light', 'dark');
const renderedColor = useColorModeValue(
  () => lightFor('color', props.value.color),
  () => props.value.color
);
const renderedGlow = useColorModeValue(
  () => lightFor('glowColor', props.value.glowColor),
  () => props.value.glowColor
);
const renderedBend = useColorModeValue(
  () => (props.value.bend === DEFAULT_PROPS.bend ? LIGHT_BEND : props.value.bend),
  () => props.value.bend
);

const selectImage = (raw: string | number) => {
  const value = String(raw);
  image.value = value;
  const palette = PALETTES[value as PaletteName];
  if (palette) updateProps({ color: palette.dark.color, glowColor: palette.dark.glowColor });
};

const resetAll = () => {
  resetProps();
  image.value = 'logo';
};

const propData: PropRow[] = [
  {
    name: 'src',
    type: 'string',
    default: 'lightning bolt',
    description:
      'Any image URL. SVGs and transparent PNGs are traced by their alpha, opaque images by keying out their backdrop colour.'
  },
  { name: 'color', type: 'string', default: "'#dcffd5'", description: 'Colour of the hot core of every strand.' },
  {
    name: 'glowColor',
    type: 'string',
    default: "'#7cff67'",
    description: 'Colour of the glow around the strands, the bloom and the interior fill.'
  },
  {
    name: 'scale',
    type: 'number',
    default: '0.7',
    description: 'Size of the logo as a fraction of the container. The glow and arcs extend beyond it.'
  },
  { name: 'intensity', type: 'number', default: '1', description: 'Overall brightness of the effect.' },
  {
    name: 'glow',
    type: 'number',
    default: '1',
    description: 'Strength of the halo around strands and the soft bloom around the shape.'
  },
  {
    name: 'thickness',
    type: 'number',
    default: '1.5',
    description:
      'Width of the main strand, in px. Satellite strands are thinner, and every strand swells and thins as it flows.'
  },
  {
    name: 'strands',
    type: 'number',
    default: '4',
    description: 'Number of filaments tracing the outline, from 1 to 6. Extra strands come and go along the edge.'
  },
  {
    name: 'bend',
    type: 'number',
    default: '0.6',
    description: 'How far the strands sway and ripple away from the outline. The main strand stays closest.'
  },
  {
    name: 'crackle',
    type: 'number',
    default: '1.5',
    description: 'Size of the fine crinkle along every strand and arc.'
  },
  {
    name: 'arcs',
    type: 'number',
    default: '1',
    description: 'How often short arcs leap off the edge and land further along it. 0 turns them off.'
  },
  {
    name: 'flicker',
    type: 'number',
    default: '0.6',
    description: 'How much the whole effect pulses and each strand shimmers in brightness.'
  },
  {
    name: 'fill',
    type: 'number',
    default: '0',
    description: 'Translucent glow inside the shape, brightest near its edges.'
  },
  { name: 'speed', type: 'number', default: '2.5', description: 'Animation speed. 0 freezes the current frame.' },
  {
    name: 'interactive',
    type: 'boolean',
    default: 'true',
    description:
      'Turn on pointer interactions. Hovering charges the lightning around the cursor, and a click sends a ripple through it with a burst of arcs.'
  },
  {
    name: 'cursorIntensity',
    type: 'number',
    default: '0.75',
    description: 'How strongly the lightning charges up around the cursor. 0 turns the hover charge off.'
  },
  {
    name: 'cursorRadius',
    type: 'number',
    default: '100',
    description: 'Radius of the charged area around the cursor, in px.'
  },
  {
    name: 'theme',
    type: "'dark' | 'light'",
    default: "'dark'",
    description:
      'The background the logo sits on. Dark renders the lightning as emitted light. Light renders crisp electric ink with a white-hot core and a lighter fill.'
  },
  {
    name: 'onRender',
    type: '(canvas: HTMLCanvasElement) => void',
    default: 'undefined',
    description:
      'Called immediately after each rendered frame. Copy the canvas synchronously to capture the current frame for effects such as live reflections.'
  },
  { name: 'className', type: 'string', default: "''", description: 'Extra classes on the container.' },
  { name: 'style', type: 'CSSProperties', default: '-', description: 'Inline styles on the container.' }
];
</script>
