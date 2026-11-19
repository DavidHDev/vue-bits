<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
    :demo-only-props="['preset']"
  >
    <TabsLayout>
      <template #preview>
        <div class="demo-container relative overflow-hidden" style="height: 600px; padding: 0">
          <Cubes :key="rerenderKey" v-bind="shown" />
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
            title="Face Color"
            :color="shown.faceColor"
            @change="(value: string) => updateProp('faceColor', value)"
          />
          <PreviewColorPickerCustom
            title="Edge Color"
            :color="shown.edgeColor"
            @change="(value: string) => updateProp('edgeColor', value)"
          />
          <PreviewColorPickerCustom
            title="Ripple Color"
            :color="shown.rippleColor"
            @change="(value: string) => updateProp('rippleColor', value)"
          />
          <PreviewSelect
            title="Edge Style"
            :options="EDGE_OPTIONS"
            :model-value="settings.edgeStyle"
            @update:model-value="value => updateProp('edgeStyle', value as CubesEdgeStyle)"
          />
          <PreviewSlider
            title="Grid Size"
            :min="3"
            :max="24"
            :step="1"
            :model-value="settings.gridSize"
            @update:model-value="value => updateProp('gridSize', value)"
          />
          <PreviewSlider
            title="Gap"
            :min="0"
            :max="0.6"
            :step="0.01"
            :model-value="settings.gap"
            @update:model-value="value => updateProp('gap', value)"
          />
          <PreviewSlider
            title="Edge Width"
            :min="0"
            :max="4"
            :step="0.25"
            value-unit="px"
            :model-value="settings.edgeWidth"
            @update:model-value="value => updateProp('edgeWidth', value)"
          />
          <PreviewSlider
            title="Face Opacity"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.faceOpacity"
            @update:model-value="value => updateProp('faceOpacity', value)"
          />
          <PreviewSlider
            title="Shading"
            :min="0"
            :max="1.5"
            :step="0.05"
            :model-value="settings.shading"
            @update:model-value="value => updateProp('shading', value)"
          />
          <PreviewSlider
            title="Max Angle"
            :min="0"
            :max="90"
            :step="1"
            value-unit="°"
            :model-value="settings.maxAngle"
            @update:model-value="value => updateProp('maxAngle', value)"
          />
          <PreviewSlider
            title="Radius"
            :min="1"
            :max="8"
            :step="0.5"
            :model-value="settings.radius"
            @update:model-value="value => updateProp('radius', value)"
          />
          <PreviewSlider
            title="Speed"
            :min="0.3"
            :max="2.5"
            :step="0.05"
            :model-value="settings.speed"
            @update:model-value="value => updateProp('speed', value)"
          />
          <PreviewSlider
            title="Bounce"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.bounce"
            @update:model-value="value => updateProp('bounce', value)"
          />
          <PreviewSlider
            title="Brush"
            :min="0"
            :max="3"
            :step="0.1"
            :model-value="settings.brush"
            @update:model-value="value => updateProp('brush', value)"
          />
          <PreviewSlider
            title="Perspective"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.perspective"
            @update:model-value="value => updateProp('perspective', value)"
          />
          <PreviewSlider
            title="Ripple Speed"
            :min="0.3"
            :max="3"
            :step="0.1"
            :model-value="settings.rippleSpeed"
            @update:model-value="value => updateProp('rippleSpeed', value)"
          />
          <PreviewSwitch
            title="Auto Animate"
            :model-value="settings.autoAnimate"
            @update:model-value="value => updateProp('autoAnimate', value)"
          />
          <PreviewSwitch
            title="Ripple On Click"
            :model-value="settings.rippleOnClick"
            @update:model-value="value => updateProp('rippleOnClick', value)"
          />
          <PreviewSwitch
            title="Intro"
            :model-value="settings.intro"
            @update:model-value="value => updateProp('intro', value)"
          />
        </Customize>

        <PropTable :data="propData" />
      </template>

      <template #code>
        <CodeExample :code-object="cubes" component-name="Cubes" />
      </template>
    </TabsLayout>
  </ComponentPropsProvider>
</template>

<script setup lang="ts">
import { computed } from 'vue';
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
import { cubes } from '@/constants/code/Animations/cubesCode';
import Cubes, { type CubesEdgeStyle } from '@/content/Animations/Cubes/Cubes.vue';

const LOOK = {
  gridSize: 10,
  gap: 0.18,
  edgeStyle: 'solid' as CubesEdgeStyle,
  edgeWidth: 1,
  faceOpacity: 1,
  shading: 0.6,
  maxAngle: 45,
  radius: 3,
  perspective: 0
};

const DEFAULT_PROPS = {
  preset: 'grid',
  faceColor: '#111111',
  edgeColor: '#ffffff',
  rippleColor: '#ffffff',
  ...LOOK,
  speed: 1,
  bounce: 0.4,
  brush: 1,
  rippleSpeed: 1,
  autoAnimate: true,
  rippleOnClick: true,
  intro: true
};

type DemoProps = typeof DEFAULT_PROPS;

const LIGHT = {
  faceColor: '#ffffff',
  edgeColor: '#161816',
  rippleColor: '#161816'
};

const PRESETS: Record<string, Partial<DemoProps>> = {
  grid: LOOK,
  dashed: { ...LOOK, edgeStyle: 'dashed', gap: 0.3 },
  wire: { ...LOOK, faceOpacity: 0, gap: 0.24, maxAngle: 60 },
  dense: { ...LOOK, gridSize: 16, gap: 0.12, radius: 4.5 },
  depth: { ...LOOK, perspective: 0.7, maxAngle: 55, shading: 1, gap: 0.24 }
};

const PRESET_OPTIONS = [
  { value: 'grid', label: 'Grid' },
  { value: 'dashed', label: 'Dashed' },
  { value: 'wire', label: 'Wire' },
  { value: 'dense', label: 'Dense' },
  { value: 'depth', label: 'Depth' }
];

const EDGE_OPTIONS = [
  { value: 'solid', label: 'Solid' },
  { value: 'dashed', label: 'Dashed' },
  { value: 'dotted', label: 'Dotted' },
  { value: 'none', label: 'None' }
];

const propData: PropRow[] = [
  { name: 'gridSize', type: 'number', default: '10', description: 'Number of cubes on each side of the grid.' },
  { name: 'gap', type: 'number', default: '0.18', description: 'Space between cubes, as a fraction of a cell.' },
  {
    name: 'faceColor',
    type: 'string',
    default: "'#111111'",
    description: 'Color of the cube faces. Match it to your page background for a clean cut-out look.'
  },
  { name: 'edgeColor', type: 'string', default: "'#ffffff'", description: 'Color of the cube outlines.' },
  { name: 'edgeWidth', type: 'number', default: '1', description: 'Width of the outlines in px.' },
  {
    name: 'edgeStyle',
    type: "'solid' | 'dashed' | 'dotted' | 'none'",
    default: "'solid'",
    description: 'How the cube outlines are drawn.'
  },
  {
    name: 'faceOpacity',
    type: 'number',
    default: '1',
    description: 'Opacity of the faces, from 0 for see-through wireframes to 1 for solid cubes.'
  },
  {
    name: 'shading',
    type: 'number',
    default: '0.6',
    description: 'How much the sides of turned cubes pick up light, so they read as solid 3D shapes.'
  },
  {
    name: 'maxAngle',
    type: 'number',
    default: '45',
    description: 'How far cubes turn to face the cursor, in degrees.'
  },
  { name: 'radius', type: 'number', default: '3', description: 'How far the cursor reaches, in cubes.' },
  { name: 'speed', type: 'number', default: '1', description: 'How quickly cubes respond.' },
  {
    name: 'bounce',
    type: 'number',
    default: '0.4',
    description: 'How much cubes overshoot and wobble as they settle, from 0 to 1.'
  },
  {
    name: 'brush',
    type: 'number',
    default: '1',
    description: 'How strongly fast cursor sweeps spin the cubes they pass over.'
  },
  {
    name: 'perspective',
    type: 'number',
    default: '0',
    description: 'Camera perspective, from 0 for a flat front view to 1 for strong depth.'
  },
  {
    name: 'autoAnimate',
    type: 'boolean',
    default: 'true',
    description: 'Drifts a gentle wave across the grid while the cursor is away.'
  },
  {
    name: 'rippleOnClick',
    type: 'boolean',
    default: 'true',
    description: 'Clicking sends a ripple through the cubes that lights up their edges.'
  },
  { name: 'rippleColor', type: 'string', default: "'#ffffff'", description: 'Color the ripple lights the cubes with.' },
  { name: 'rippleSpeed', type: 'number', default: '1', description: 'Speed of the ripple.' },
  { name: 'intro', type: 'boolean', default: 'true', description: 'Cubes tumble into place from the center on mount.' },
  { name: 'paused', type: 'boolean', default: 'false', description: 'Freezes the animation.' },
  { name: 'dpr', type: 'number', default: 'auto', description: 'Maximum device pixel ratio, capped at 2.' },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the container.' }
];

const { rerenderKey, forceRerender } = useForceRerender();
const { props, defaultProps, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);
const light = useColorModeValue(true, false);

const settings = computed(() => {
  const { preset: _preset, ...rest } = props.value;
  return rest;
});

const shown = computed(() => {
  const next = { ...settings.value };
  if (light.value) {
    (Object.keys(LIGHT) as (keyof typeof LIGHT)[]).forEach(name => {
      if (settings.value[name] === DEFAULT_PROPS[name]) next[name] = LIGHT[name];
    });
  }
  return next;
});

const applyPreset = (value: string) => {
  const base = Object.fromEntries(
    Object.keys(DEFAULT_PROPS).map(name => [name, defaultProps.value[name as keyof DemoProps]])
  ) as Partial<DemoProps>;
  updateProps({
    ...base,
    ...PRESETS[value],
    faceColor: settings.value.faceColor,
    edgeColor: settings.value.edgeColor,
    rippleColor: settings.value.rippleColor,
    preset: value
  });
};
</script>
