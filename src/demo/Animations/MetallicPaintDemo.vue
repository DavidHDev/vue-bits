<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetAll"
    :has-changes="hasChanges || Boolean(upload)"
    :demo-only-props="['preset', 'content', 'text']"
    :computed-props="computedProps"
  >
    <TabsLayout>
      <template #preview>
        <div class="demo-container relative h-[380px] overflow-hidden md:h-[500px]" style="padding: 0">
          <MetallicPaint :key="rerenderKey" v-bind="settings" :light-mode="isLight" />
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
            title="Content"
            :options="CONTENT_OPTIONS"
            :model-value="props.content"
            @update:model-value="value => updateProp('content', String(value))"
          />
          <div v-if="props.content === 'logo'" class="scrubber">
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
            <input ref="inputRef" type="file" accept="image/svg+xml,image/png,image/webp" hidden @change="onFile" />
          </div>
          <PreviewInput
            title="Text"
            :model-value="props.text"
            :max-length="24"
            :is-disabled="props.content !== 'text'"
            @update:model-value="value => updateProp('text', value)"
          />
          <PreviewColorPickerCustom
            title="Color"
            :color="props.color"
            @change="(value: string) => updateProp('color', value)"
          />
          <PreviewSlider
            title="Density"
            :min="0.5"
            :max="8"
            :step="0.1"
            :model-value="props.density"
            @update:model-value="value => updateProp('density', value)"
          />
          <PreviewSlider
            title="Softness"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="props.softness"
            @update:model-value="value => updateProp('softness', value)"
          />
          <PreviewSlider
            title="Dispersion"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="props.dispersion"
            @update:model-value="value => updateProp('dispersion', value)"
          />
          <PreviewSlider
            title="Distortion"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="props.distortion"
            @update:model-value="value => updateProp('distortion', value)"
          />
          <PreviewSlider
            title="Edge Bend"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="props.edgeBend"
            @update:model-value="value => updateProp('edgeBend', value)"
          />
          <PreviewSlider
            title="Angle"
            :min="0"
            :max="360"
            :step="1"
            value-unit="°"
            :model-value="props.angle"
            @update:model-value="value => updateProp('angle', value)"
          />
          <PreviewSlider
            title="Speed"
            :min="0"
            :max="3"
            :step="0.05"
            :model-value="props.speed"
            @update:model-value="value => updateProp('speed', value)"
          />
          <PreviewSlider
            title="Scale"
            :min="0.2"
            :max="1.2"
            :step="0.01"
            :model-value="props.scale"
            @update:model-value="value => updateProp('scale', value)"
          />
          <PreviewSlider
            title="Rotation"
            :min="-180"
            :max="180"
            :step="1"
            value-unit="°"
            :model-value="props.rotation"
            @update:model-value="value => updateProp('rotation', value)"
          />
          <PreviewSlider
            title="Mouse Tilt"
            :min="0"
            :max="1.5"
            :step="0.05"
            :model-value="props.mouseTilt"
            @update:model-value="value => updateProp('mouseTilt', value)"
          />
          <PreviewSwitch title="Intro" :model-value="props.intro" @update:model-value="setIntro" />
        </Customize>

        <PropTable :data="propData" />
      </template>

      <template #code>
        <CodeExample :code-object="metallicPaint" component-name="MetallicPaint" />
      </template>
    </TabsLayout>
  </ComponentPropsProvider>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';
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
import { useColorMode } from '@/composables/useTheme';
import logo from '@/assets/logos/vue-bits-logo-small-dark.svg';
import { metallicPaint } from '@/constants/code/Animations/metallicPaintCode';
import MetallicPaint from '@/content/Animations/MetallicPaint/MetallicPaint.vue';

const LOOK = {
  content: 'logo',
  text: 'Vue Bits',
  color: '#ffffff',
  density: 2,
  softness: 0.1,
  dispersion: 0.3,
  distortion: 0.07,
  edgeBend: 0.6,
  angle: 70,
  scale: 0.6
};

const DEFAULT_PROPS = {
  preset: 'chrome',
  ...LOOK,
  speed: 1,
  rotation: 0,
  mouseTilt: 0.5,
  intro: true
};

type DemoProps = typeof DEFAULT_PROPS;

const PRESETS: Record<string, Partial<DemoProps>> = {
  chrome: LOOK,
  liquid: { ...LOOK, edgeBend: 0.92, distortion: 0.22, density: 2.6, dispersion: 0.45 },
  noir: {
    ...LOOK,
    color: '#b4b4ba',
    softness: 0.6,
    density: 1.6,
    dispersion: 0,
    distortion: 0.05,
    edgeBend: 0.5,
    angle: 90
  },
  gold: { ...LOOK, content: 'text', text: 'Gold', color: '#f2c46b', dispersion: 0.15, scale: 0.7 },
  prism: {
    ...LOOK,
    color: '#9cc4ff',
    softness: 0.8,
    density: 6,
    dispersion: 1,
    distortion: 0.4,
    edgeBend: 0.4,
    angle: 0
  },
  brushed: { ...LOOK, softness: 1, density: 2.5, dispersion: 0, distortion: 0, edgeBend: 0.5, angle: 100 }
};

const PRESET_OPTIONS = [
  { value: 'chrome', label: 'Chrome' },
  { value: 'liquid', label: 'Liquid' },
  { value: 'noir', label: 'Noir' },
  { value: 'gold', label: 'Gold' },
  { value: 'prism', label: 'Prism' },
  { value: 'brushed', label: 'Brushed' }
];

const CONTENT_OPTIONS = [
  { value: 'logo', label: 'Logo' },
  { value: 'text', label: 'Text' }
];

const { rerenderKey, forceRerender } = useForceRerender();
const { props, defaultProps, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);
const { isLight } = useColorMode();

const upload = ref<{ url: string; name: string } | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);

watch(upload, (_next, previous) => {
  if (previous) URL.revokeObjectURL(previous.url);
});

onBeforeUnmount(() => {
  if (upload.value) URL.revokeObjectURL(upload.value.url);
});

const onFile = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  input.value = '';
  if (!file) return;
  upload.value = { url: URL.createObjectURL(file), name: file.name };
};

const resetAll = () => {
  resetProps();
  upload.value = null;
};

const source = computed(() =>
  props.value.content === 'text'
    ? { text: props.value.text || 'Vue Bits', fontFamily: 'Geist, system-ui, sans-serif' }
    : { imageSrc: upload.value?.url || logo }
);

const settings = computed(() => {
  const { preset: _preset, content: _content, text: _text, ...rest } = props.value;
  return { ...rest, ...source.value };
});

const computedProps = computed(() => ({ ...source.value, ...(isLight.value ? { lightMode: true } : {}) }));

const applyPreset = (value: string | number) => {
  const name = String(value);
  const base = Object.fromEntries(
    Object.keys(DEFAULT_PROPS).map(key => [key, defaultProps.value[key as keyof DemoProps]])
  ) as Partial<DemoProps>;
  updateProps({ ...base, ...PRESETS[name], preset: name });
  forceRerender();
};

const setIntro = (value: boolean) => {
  updateProp('intro', value);
  forceRerender();
};

const propData: PropRow[] = [
  {
    name: 'imageSrc',
    type: 'string',
    default: 'undefined',
    description: 'URL of the logo or image to paint. SVGs work best. Transparent pixels are left empty.'
  },
  {
    name: 'text',
    type: 'string',
    default: 'undefined',
    description: 'Text to paint instead of an image. Takes priority over imageSrc.'
  },
  { name: 'fontFamily', type: 'string', default: "'system-ui, sans-serif'", description: 'Font used for text.' },
  { name: 'fontWeight', type: 'number', default: '800', description: 'Font weight used for text.' },
  {
    name: 'color',
    type: 'string',
    default: "'#ffffff'",
    description: 'Tint of the metal. White keeps it chrome, warm tones turn it gold or copper.'
  },
  {
    name: 'backgroundColor',
    type: 'string',
    default: "'transparent'",
    description: 'Color behind the shape. By default the canvas is transparent.'
  },
  { name: 'density', type: 'number', default: '2', description: 'How many reflection bands run across the shape.' },
  {
    name: 'softness',
    type: 'number',
    default: '0.1',
    description: 'Softness of the reflection edges, from 0 for crisp chrome to 1 for brushed metal.'
  },
  {
    name: 'dispersion',
    type: 'number',
    default: '0.3',
    description: 'Rainbow fringes where the reflections bend, from 0 to 1.'
  },
  {
    name: 'distortion',
    type: 'number',
    default: '0.07',
    description: 'How much the reflections ripple as they flow, from 0 to 1.'
  },
  {
    name: 'edgeBend',
    type: 'number',
    default: '0.6',
    description: 'How strongly the reflections bend around the edges of the shape, from 0 to 1.'
  },
  { name: 'angle', type: 'number', default: '70', description: 'Direction the reflections flow in, in degrees.' },
  { name: 'speed', type: 'number', default: '1', description: 'Speed of the flow. 0 freezes it.' },
  { name: 'scale', type: 'number', default: '0.6', description: 'Size of the shape inside the canvas.' },
  { name: 'rotation', type: 'number', default: '0', description: 'Rotation of the shape, in degrees.' },
  {
    name: 'mouseTilt',
    type: 'number',
    default: '0.5',
    description: 'How much the reflections shift as the cursor moves, as if tilting the metal.'
  },
  {
    name: 'lightMode',
    type: 'boolean',
    default: 'false',
    description: 'Adds a soft dark rim and dims the brightest highlights so the shape reads on light pages.'
  },
  { name: 'intro', type: 'boolean', default: 'true', description: 'Pours the metal in from the outline on mount.' },
  { name: 'paused', type: 'boolean', default: 'false', description: 'Freezes the animation.' },
  {
    name: 'dpr',
    type: 'number',
    default: 'auto',
    description: 'Device pixel ratio cap. Renders at 2× or more for clean edges.'
  },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the container.' },
  { name: 'style', type: 'StyleValue', default: 'undefined', description: 'Inline styles for the container.' }
];
</script>
