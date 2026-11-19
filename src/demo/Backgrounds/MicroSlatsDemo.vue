<template>
  <ComponentPropsProvider
    :props="themedProps"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
  >
    <TabsLayout>
      <template #preview>
        <div class="demo-container relative overflow-hidden" style="height: 500px; padding: 0">
          <MicroSlats :key="rerenderKey" v-bind="themedProps" />
          <BackgroundContent headline="A quiet pattern, drawn one slat at a time." />
          <RefreshButton @click="forceRerender" />
        </div>

        <Customize>
          <PreviewSelect
            title="Preset"
            :options="PRESET_OPTIONS"
            :model-value="props.preset"
            @update:model-value="choosePreset"
          />

          <PreviewColorPickerCustom
            title="Color"
            :color="themedProps.color"
            @change="(value: string) => updateProp('color', value)"
          />
          <PreviewColorPickerCustom
            title="Glint Color"
            :color="themedProps.glintColor"
            @change="(value: string) => updateProp('glintColor', value)"
          />
          <PreviewColorPickerCustom
            title="Background"
            :color="themedProps.backgroundColor"
            @change="(value: string) => updateProp('backgroundColor', value)"
          />

          <PreviewSlider
            title="Slat Width"
            :min="2"
            :max="16"
            :step="1"
            value-unit="px"
            :model-value="props.slatWidth"
            @update:model-value="value => updateProp('slatWidth', value)"
          />
          <PreviewSlider
            title="Slat Height"
            :min="6"
            :max="64"
            :step="1"
            value-unit="px"
            :model-value="props.slatHeight"
            @update:model-value="value => updateProp('slatHeight', value)"
          />
          <PreviewSlider
            title="Gap"
            :min="1"
            :max="12"
            :step="1"
            value-unit="px"
            :model-value="props.gap"
            @update:model-value="value => updateProp('gap', value)"
          />
          <PreviewSlider
            title="Roundness"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.roundness"
            @update:model-value="value => updateProp('roundness', value)"
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
            :min="0.3"
            :max="2.5"
            :step="0.05"
            :model-value="props.scale"
            @update:model-value="value => updateProp('scale', value)"
          />
          <PreviewSlider
            title="Direction"
            :min="0"
            :max="360"
            :step="1"
            value-unit="°"
            :model-value="props.direction"
            @update:model-value="value => updateProp('direction', value)"
          />
          <PreviewSlider
            title="Chop"
            :min="0"
            :max="1.5"
            :step="0.05"
            :model-value="props.chop"
            @update:model-value="value => updateProp('chop', value)"
          />
          <PreviewSlider
            title="Stretch"
            :min="0"
            :max="0.95"
            :step="0.05"
            :model-value="props.stretch"
            @update:model-value="value => updateProp('stretch', value)"
          />
          <PreviewSlider
            title="Glint"
            :min="0"
            :max="2"
            :step="0.05"
            :model-value="props.glint"
            @update:model-value="value => updateProp('glint', value)"
          />
          <PreviewSlider
            title="Contrast"
            :min="0.5"
            :max="3"
            :step="0.05"
            :model-value="props.contrast"
            @update:model-value="value => updateProp('contrast', value)"
          />
          <PreviewSlider
            title="Perspective"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.perspective"
            @update:model-value="value => updateProp('perspective', value)"
          />
          <PreviewSlider
            title="Fog"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.fog"
            @update:model-value="value => updateProp('fog', value)"
          />

          <PreviewSwitch
            title="Interactive"
            :model-value="props.interactive"
            @update:model-value="value => updateProp('interactive', value)"
          />
          <PreviewSlider
            title="Cursor Strength"
            :min="0"
            :max="2"
            :step="0.05"
            :is-disabled="!props.interactive"
            :model-value="props.cursorStrength"
            @update:model-value="value => updateProp('cursorStrength', value)"
          />
          <PreviewSlider
            title="Cursor Size"
            :min="20"
            :max="240"
            :step="5"
            value-unit="px"
            :is-disabled="!props.interactive"
            :model-value="props.cursorSize"
            @update:model-value="value => updateProp('cursorSize', value)"
          />
          <PreviewSlider
            title="Swirl"
            :min="0"
            :max="1.5"
            :step="0.05"
            :is-disabled="!props.interactive"
            :model-value="props.swirl"
            @update:model-value="value => updateProp('swirl', value)"
          />
          <PreviewSlider
            title="Trail"
            :min="0.3"
            :max="4"
            :step="0.1"
            value-unit="s"
            :is-disabled="!props.interactive"
            :model-value="props.trail"
            @update:model-value="value => updateProp('trail', value)"
          />
          <PreviewSlider
            title="Lean"
            :min="0"
            :max="1"
            :step="0.05"
            :is-disabled="!props.interactive"
            :model-value="props.lean"
            @update:model-value="value => updateProp('lean', value)"
          />

          <PreviewSwitch
            title="Intro"
            :model-value="props.intro"
            @update:model-value="value => updateProp('intro', value)"
          />
          <PreviewSlider
            title="Intro Duration"
            :min="0.6"
            :max="5"
            :step="0.1"
            value-unit="s"
            :is-disabled="!props.intro"
            :model-value="props.introDuration"
            @update:model-value="value => updateProp('introDuration', value)"
          />
          <PreviewSwitch
            title="Paused"
            :model-value="props.paused"
            @update:model-value="value => updateProp('paused', value)"
          />
        </Customize>

        <PropTable :data="propData" />
        <Dependencies :dependency-list="['ogl']" />
      </template>

      <template #code>
        <CodeExample :code-object="microSlats" component-name="MicroSlats" />
      </template>
    </TabsLayout>
  </ComponentPropsProvider>
</template>

<script setup lang="ts">
import BackgroundContent from '@/components/common/BackgroundContent.vue';
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
import { useThemedProps } from '@/composables/useThemedProps';
import { microSlats } from '@/constants/code/Backgrounds/microSlatsCode';
import MicroSlats from '@/content/Backgrounds/MicroSlats/MicroSlats.vue';
import { DEFAULT_PROPS, LIGHT_PROPS, PRESET_OPTIONS, presetProps, type MicroSlatsPreset } from './presets/MicroSlats';

const { rerenderKey, forceRerender } = useForceRerender();
const { props, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);
const themedProps = useThemedProps(props, DEFAULT_PROPS, LIGHT_PROPS);

const choosePreset = (value: string | number) => {
  updateProps({ preset: value as MicroSlatsPreset, ...presetProps(String(value)) });
};

const propData: PropRow[] = [
  {
    name: 'preset',
    type: "'swell' | 'tide' | 'storm' | 'signal'",
    default: "'swell'",
    description:
      'A starting look for the sea. Every wave prop below overrides the preset value when you pass it. Signal turns the field into a flat, equalizer style wall.'
  },
  { name: 'color', type: 'string', default: "'#7cff67'", description: 'Color of the slats.' },
  {
    name: 'glintColor',
    type: 'string',
    default: "'#ffffff'",
    description: 'Color the slats shift towards on wave crests and in the light the cursor leaves.'
  },
  {
    name: 'backgroundColor',
    type: 'string',
    default: "'#000000'",
    description: 'Color behind the slats. Pass transparent to show the page through.'
  },
  { name: 'slatWidth', type: 'number', default: '10', description: 'Width of one slat in CSS pixels.' },
  { name: 'slatHeight', type: 'number', default: '25', description: 'Full height of one slat in CSS pixels.' },
  { name: 'gap', type: 'number', default: '3', description: 'Space between slats in CSS pixels.' },
  {
    name: 'roundness',
    type: 'number',
    default: '0.75',
    description: 'Corner rounding of each slat, from square at 0 to a full pill at 1.'
  },
  {
    name: 'scale',
    type: 'number',
    default: 'from preset',
    description: 'Size of the swell. Larger values give longer, calmer waves.'
  },
  {
    name: 'speed',
    type: 'number',
    default: 'from preset',
    description: 'How fast the waves roll. 0 freezes the sea while the cursor can still stir it.'
  },
  {
    name: 'direction',
    type: 'number',
    default: 'from preset',
    description: 'Heading of the swell in degrees. 270 rolls straight towards the viewer.'
  },
  {
    name: 'chop',
    type: 'number',
    default: 'from preset',
    description: 'Sharpens the crests and flattens the troughs, like wind on the water.'
  },
  {
    name: 'stretch',
    type: 'number',
    default: 'from preset',
    description: 'How much each slat grows and shrinks with the wave under it. 0 keeps every slat full length.'
  },
  {
    name: 'glint',
    type: 'number',
    default: 'from preset',
    description: 'Strength of the light caught on the crests.'
  },
  {
    name: 'contrast',
    type: 'number',
    default: 'from preset',
    description: 'Spread between dark troughs and bright crests.'
  },
  {
    name: 'perspective',
    type: 'number',
    default: 'from preset',
    description: 'How far the sea recedes towards a horizon above the top edge. 0 is a flat wall.'
  },
  {
    name: 'fog',
    type: 'number',
    default: 'from preset',
    description: 'Haze that fades the far rows into the background.'
  },
  {
    name: 'interactive',
    type: 'boolean',
    default: 'true',
    description:
      'Lets the cursor stir the water. Moving it pushes a real fluid that bends the swell and carries a swirling trail of light, and a click spins out a splash.'
  },
  {
    name: 'cursorStrength',
    type: 'number',
    default: '1',
    description: 'Brightness of the light the cursor leaves in the water.'
  },
  {
    name: 'cursorSize',
    type: 'number',
    default: '40',
    description: 'Radius of the patch of water the cursor pushes, in CSS pixels.'
  },
  {
    name: 'swirl',
    type: 'number',
    default: '0',
    description: 'How strongly the stirred water curls into eddies.'
  },
  {
    name: 'trail',
    type: 'number',
    default: '1.4',
    description: 'How long the stirred water and its light linger, in seconds.'
  },
  {
    name: 'lean',
    type: 'number',
    default: '0',
    description: 'How far the slats tilt with the current. 0 keeps them upright.'
  },
  {
    name: 'intro',
    type: 'boolean',
    default: 'true',
    description: 'Rolls the sea in from the horizon on mount, unfolding the slats row by row.'
  },
  { name: 'introDuration', type: 'number', default: '1.5', description: 'Length of the intro in seconds.' },
  {
    name: 'paused',
    type: 'boolean',
    default: 'false',
    description: 'Freezes the waves. The cursor can still stir the water.'
  },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the root element.' },
  { name: 'style', type: 'CSSProperties', default: '-', description: 'Inline styles for the root element.' }
];
</script>
