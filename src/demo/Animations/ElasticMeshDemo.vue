<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
    :demo-only-props="['preset', 'content', 'text']"
    :computed-props="computedProps"
  >
    <TabsLayout>
      <template #preview>
        <div class="demo-container relative overflow-hidden" style="height: 500px; padding: 0">
          <RefreshButton @click="forceRerender" />
          <ElasticMesh :key="rerenderKey" v-bind="{ ...settings, ...computedProps }" :theme="theme" />
          <p
            class="pointer-events-none absolute bottom-5 left-1/2 m-0 -translate-x-1/2 text-sm whitespace-nowrap select-none"
            style="color: var(--text-dimmed)"
          >
            Press, poke and pull
          </p>
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
          <PreviewInput
            title="Text"
            :model-value="props.text"
            :max-length="24"
            :is-disabled="props.content !== 'text'"
            @update:model-value="value => updateProp('text', value)"
          />
          <PreviewSelect
            title="Material"
            :options="MATERIAL_OPTIONS"
            :model-value="props.material"
            @update:model-value="value => updateProp('material', value as ElasticMeshMaterial)"
          />
          <PreviewColorPickerCustom
            title="Color"
            :color="props.color"
            @change="(value: string) => updateProp('color', value)"
          />
          <PreviewSlider
            title="Inflate"
            :min="0.4"
            :max="1.6"
            :step="0.05"
            :model-value="props.inflate"
            @update:model-value="value => updateProp('inflate', value)"
          />
          <PreviewSlider
            title="Stiffness"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.stiffness"
            @update:model-value="value => updateProp('stiffness', value)"
          />
          <PreviewSlider
            title="Wobble"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.wobble"
            @update:model-value="value => updateProp('wobble', value)"
          />
          <PreviewSlider
            title="Grab Radius"
            :min="30"
            :max="160"
            :step="5"
            value-unit="px"
            :model-value="props.grabRadius"
            @update:model-value="value => updateProp('grabRadius', value)"
          />
          <PreviewSlider
            title="Stretch"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.stretch"
            @update:model-value="value => updateProp('stretch', value)"
          />
          <PreviewSlider
            title="Press"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.press"
            @update:model-value="value => updateProp('press', value)"
          />
          <PreviewSlider
            title="Shadow"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.shadow"
            @update:model-value="value => updateProp('shadow', value)"
          />
          <PreviewSwitch
            title="Intro"
            :model-value="props.intro"
            @update:model-value="value => updateProp('intro', value)"
          />
        </Customize>

        <PropTable :data="propData" />
      </template>

      <template #code>
        <CodeExample :code-object="elasticMesh" component-name="ElasticMesh" />
      </template>
    </TabsLayout>
  </ComponentPropsProvider>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import logo from '@/assets/logos/vue-bits-logo-small.svg';
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
import { elasticMesh } from '@/constants/code/Animations/elasticMeshCode';
import ElasticMesh, { type ElasticMeshMaterial } from '@/content/Animations/ElasticMesh/ElasticMesh.vue';

const BALLOON = {
  material: 'balloon' as ElasticMeshMaterial,
  color: '#3b5bff',
  inflate: 1,
  stiffness: 0.5,
  wobble: 0.6
};

const DEFAULT_PROPS = {
  preset: 'balloon',
  content: 'text',
  text: 'Squish',
  ...BALLOON,
  grabRadius: 70,
  stretch: 0.5,
  press: 0.5,
  shadow: 0.5,
  intro: true
};

type DemoProps = typeof DEFAULT_PROPS;

const PRESETS: Record<string, Partial<DemoProps>> = {
  balloon: BALLOON,
  chrome: { ...BALLOON, material: 'chrome', color: '#ffffff', stiffness: 0.65, wobble: 0.5 },
  jelly: { ...BALLOON, material: 'jelly', color: '#ff5a1f', stiffness: 0.35, wobble: 0.85 },
  clay: { ...BALLOON, material: 'clay', color: '#ece6dc', inflate: 0.85, stiffness: 0.6, wobble: 0.35 }
};

const PRESET_OPTIONS = [
  { value: 'balloon', label: 'Balloon' },
  { value: 'chrome', label: 'Chrome' },
  { value: 'jelly', label: 'Jelly' },
  { value: 'clay', label: 'Clay' }
];

const CONTENT_OPTIONS = [
  { value: 'text', label: 'Text' },
  { value: 'logo', label: 'Logo' }
];

const MATERIAL_OPTIONS = [
  { value: 'balloon', label: 'Balloon' },
  { value: 'chrome', label: 'Chrome' },
  { value: 'jelly', label: 'Jelly' },
  { value: 'clay', label: 'Clay' }
];

const propData: PropRow[] = [
  { name: 'text', type: 'string', default: "'Squish'", description: 'Text to inflate. Use \\n for more lines.' },
  {
    name: 'src',
    type: 'string',
    default: "''",
    description: 'URL of an SVG or PNG to inflate instead of text. Its transparent pixels define the shape.'
  },
  {
    name: 'fontFamily',
    type: 'string',
    default: "'system-ui, sans-serif'",
    description: 'Font used for the text. Heavy, rounded faces inflate best.'
  },
  { name: 'fontWeight', type: 'number', default: '900', description: 'Weight of the text.' },
  { name: 'color', type: 'string', default: "'#3b5bff'", description: 'Base color of the material.' },
  {
    name: 'imageColors',
    type: 'boolean',
    default: 'true',
    description: 'Keeps the colors of the image passed to src instead of using color.'
  },
  {
    name: 'material',
    type: "'balloon' | 'chrome' | 'jelly' | 'clay'",
    default: "'balloon'",
    description: 'Surface finish: glossy balloon, mirror chrome, glowing jelly or soft matte clay.'
  },
  { name: 'inflate', type: 'number', default: '1', description: 'How puffy the shape is. 1 gives round tubes.' },
  {
    name: 'stiffness',
    type: 'number',
    default: '0.5',
    description: 'How firm the material feels, from 0 for soft and stretchy to 1 for firm and quick.'
  },
  {
    name: 'wobble',
    type: 'number',
    default: '0.6',
    description: 'How long it jiggles after a poke or a pull, from 0 to 1.'
  },
  {
    name: 'grabRadius',
    type: 'number',
    default: '70',
    description: 'Size of the area the cursor grabs and presses, in pixels.'
  },
  { name: 'stretch', type: 'number', default: '0.5', description: 'How far the material can be pulled, from 0 to 1.' },
  { name: 'press', type: 'number', default: '0.5', description: 'Depth of the dent under the cursor and of a poke.' },
  { name: 'shadow', type: 'number', default: '0.5', description: 'Strength of the soft drop shadow.' },
  { name: 'intro', type: 'boolean', default: 'true', description: 'Inflates the shape letter by letter on mount.' },
  {
    name: 'theme',
    type: "'dark' | 'light'",
    default: "'dark'",
    description: 'Lighting setup for dark or light pages.'
  },
  { name: 'dpr', type: 'number', default: 'auto', description: 'Maximum device pixel ratio, capped at 2.' },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the container.' },
  { name: 'style', type: 'CSSProperties', default: '-', description: 'Inline styles for the container.' }
];

const { rerenderKey, forceRerender } = useForceRerender();
const { props, defaultProps, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);
const theme = useColorModeValue<'light' | 'dark'>('light', 'dark');

const settings = computed(() => {
  const { preset: _preset, content: _content, text: _text, ...rest } = props.value;
  return rest;
});

const typed = ref(props.value.text);
let typedTimer = 0;
watch(
  () => props.value.text,
  text => {
    window.clearTimeout(typedTimer);
    typedTimer = window.setTimeout(() => {
      typed.value = text;
    }, 350);
  }
);
onBeforeUnmount(() => window.clearTimeout(typedTimer));

const computedProps = computed<Record<string, unknown>>(() =>
  props.value.content === 'logo' ? { src: logo, imageColors: false } : { text: typed.value }
);

const applyPreset = (input: string | number) => {
  const value = String(input);
  const base = Object.fromEntries(
    Object.keys(DEFAULT_PROPS).map(name => [name, defaultProps.value[name as keyof DemoProps]])
  ) as Partial<DemoProps>;
  updateProps({ ...base, ...PRESETS[value], content: props.value.content, text: props.value.text, preset: value });
};
</script>
