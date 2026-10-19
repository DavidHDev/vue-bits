<template>
  <h1 class="sub-category">Electric Logo</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="electricLogo.usage"
    :source="electricLogoSource"
    component-name="ElectricLogo"
    :props-table="props"
  >
    <template #preview>
      <div class="relative p-0 h-125 overflow-hidden demo-container">
        <ElectricLogo
          :key="run"
          :src="src"
          :color="color"
          :glow-color="glowColor"
          :scale="scale"
          :intensity="intensity"
          :glow="glow"
          :thickness="thickness"
          :strands="strands"
          :bend="bend"
          :crackle="crackle"
          :arcs="arcs"
          :flicker="flicker"
          :fill="fill"
          :speed="speed"
          :interactive="interactive"
          :cursor-intensity="cursorIntensity"
          :cursor-radius="cursorRadius"
        />
        <RefreshButton @click="run++" />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSelect
          title="Image"
          :options="imageOptions"
          :model-value="image"
          @update:model-value="selectImage($event as string)"
        />
        <div class="scrubber">
          <button type="button" class="scrubber-track scrubber-track--select" @click="inputRef?.click()">
            <span class="scrubber-label">Upload</span>
            <span class="scrubber-select-right">
              <span class="max-w-40 overflow-hidden text-ellipsis whitespace-nowrap scrubber-value">
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

        <PreviewColorPicker title="Color" v-model="color" />
        <PreviewColorPicker title="Glow Color" v-model="glowColor" />
        <PreviewSlider title="Scale" :min="0.2" :max="1" :step="0.05" v-model="scale" />
        <PreviewSlider title="Intensity" :min="0.2" :max="2" :step="0.05" v-model="intensity" />
        <PreviewSlider title="Glow" :min="0" :max="2" :step="0.05" v-model="glow" />
        <PreviewSlider title="Fill" :min="0" :max="1" :step="0.05" v-model="fill" />
        <PreviewSlider title="Thickness" :min="0.5" :max="3" :step="0.1" valueUnit="px" v-model="thickness" />
        <PreviewSlider title="Strands" :min="1" :max="6" :step="1" v-model="strands" />
        <PreviewSlider title="Bend" :min="0" :max="2" :step="0.05" v-model="bend" />
        <PreviewSlider title="Crackle" :min="0" :max="2" :step="0.05" v-model="crackle" />
        <PreviewSlider title="Arcs" :min="0" :max="2" :step="0.05" v-model="arcs" />
        <PreviewSlider title="Flicker" :min="0" :max="1" :step="0.05" v-model="flicker" />
        <PreviewSlider title="Speed" :min="0" :max="3" :step="0.05" v-model="speed" />
        <PreviewSwitch title="Interactive" v-model="interactive" />
        <PreviewSlider
          title="Cursor Intensity"
          :min="0"
          :max="2"
          :step="0.05"
          :isDisabled="!interactive"
          v-model="cursorIntensity"
        />
        <PreviewSlider
          title="Cursor Radius"
          :min="40"
          :max="300"
          :step="5"
          valueUnit="px"
          :isDisabled="!interactive"
          v-model="cursorRadius"
        />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="electric-logo" :usage="electricLogo.usage!" :source="electricLogoSource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import apple from '@/assets/logos/apple.svg';
import openai from '@/assets/logos/openai.svg';
import tesla from '@/assets/logos/tesla.svg';
import logo from '@/assets/logos/vue-bits-logo-small.svg';
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewColorPicker from '@/components/common/PreviewColorPicker.vue';
import PreviewSelect from '@/components/common/PreviewSelect.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import RefreshButton from '@/components/common/RefreshButton.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { electricLogo } from '@/constants/code/Animations/electricLogoCode';
import ElectricLogo from '@/content/Animations/ElectricLogo/ElectricLogo.vue';
import electricLogoSource from '@/content/Animations/ElectricLogo/ElectricLogo.vue?raw';
import { computed, onBeforeUnmount, ref } from 'vue';

const LOGOS: Record<string, string> = { logo, apple, tesla, openai };

const PALETTES: Record<string, { color: string; glowColor: string }> = {
  logo: { color: '#c7ffe4', glowColor: '#27b574' },
  apple: { color: '#cadcff', glowColor: '#528aff' },
  tesla: { color: '#ffcdd2', glowColor: '#ff5260' },
  openai: { color: '#c2fff1', glowColor: '#1fd8b6' }
};

const DEFAULTS = {
  color: PALETTES.logo.color,
  glowColor: PALETTES.logo.glowColor,
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

const color = ref(DEFAULTS.color);
const glowColor = ref(DEFAULTS.glowColor);
const scale = ref(DEFAULTS.scale);
const intensity = ref(DEFAULTS.intensity);
const glow = ref(DEFAULTS.glow);
const thickness = ref(DEFAULTS.thickness);
const strands = ref(DEFAULTS.strands);
const bend = ref(DEFAULTS.bend);
const crackle = ref(DEFAULTS.crackle);
const arcs = ref(DEFAULTS.arcs);
const flicker = ref(DEFAULTS.flicker);
const fill = ref(DEFAULTS.fill);
const speed = ref(DEFAULTS.speed);
const interactive = ref(DEFAULTS.interactive);
const cursorIntensity = ref(DEFAULTS.cursorIntensity);
const cursorRadius = ref(DEFAULTS.cursorRadius);
const run = ref(0);

const image = ref('logo');
const upload = ref<{ url: string; name: string } | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);

const imageOptions = computed(() => [
  { label: 'Vue Bits', value: 'logo' },
  { label: 'Apple', value: 'apple' },
  { label: 'Tesla', value: 'tesla' },
  { label: 'OpenAI', value: 'openai' },
  ...(upload.value ? [{ label: 'Your upload', value: 'upload' }] : [])
]);

const src = computed(() => (image.value === 'upload' && upload.value ? upload.value.url : LOGOS[image.value] || logo));

const handleFile = (e: Event) => {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  input.value = '';
  if (!file) return;
  if (upload.value) URL.revokeObjectURL(upload.value.url);
  upload.value = { url: URL.createObjectURL(file), name: file.name };
  image.value = 'upload';
};
onBeforeUnmount(() => {
  if (upload.value) URL.revokeObjectURL(upload.value.url);
});

const selectImage = (value: string) => {
  image.value = value;
  const palette = PALETTES[value];
  if (palette) {
    color.value = palette.color;
    glowColor.value = palette.glowColor;
  }
};

const state = {
  color,
  glowColor,
  scale,
  intensity,
  glow,
  thickness,
  strands,
  bend,
  crackle,
  arcs,
  flicker,
  fill,
  speed,
  interactive,
  cursorIntensity,
  cursorRadius
};
const keys = Object.keys(DEFAULTS) as (keyof typeof DEFAULTS)[];
const hasChanges = computed(
  () => image.value !== 'logo' || !!upload.value || keys.some(k => state[k].value !== DEFAULTS[k])
);
function reset() {
  keys.forEach(k => ((state[k] as { value: unknown }).value = DEFAULTS[k]));
  image.value = 'logo';
  if (upload.value) URL.revokeObjectURL(upload.value.url);
  upload.value = null;
}

const props: PropRow[] = [
  {
    name: 'src',
    type: 'string',
    default: 'lightning bolt',
    description:
      'Any image URL. SVGs and transparent PNGs are traced by their alpha, opaque images by keying out their backdrop colour.'
  },
  { name: 'color', type: 'string', default: '"#ecc7ff"', description: 'Colour of the hot core of every strand.' },
  {
    name: 'glowColor',
    type: 'string',
    default: '"#ad6dff"',
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
    type: '"dark" | "light"',
    default: '"dark"',
    description:
      'The background the logo sits on. Dark renders the lightning as emitted light. Light renders crisp electric ink with a white-hot core and a lighter fill.'
  },
  { name: 'className', type: 'string', default: '""', description: 'Extra classes on the container.' }
];
</script>
