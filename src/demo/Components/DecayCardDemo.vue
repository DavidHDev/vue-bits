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
        <div class="demo-container relative overflow-hidden" style="height: 560px">
          <div class="flex items-center justify-center w-full h-full">
            <DecayCard v-bind="settings" :image="IMAGE">
              <p class="mb-1 text-[12px] text-[rgba(255,255,255,0.72)]">No. 01</p>
              <p class="text-[22px] font-semibold tracking-[-0.4px] leading-[1.15]">Afterglow</p>
            </DecayCard>
          </div>
        </div>

        <Customize>
          <PreviewSelect
            title="Preset"
            :options="PRESET_OPTIONS"
            :model-value="props.preset"
            @update:model-value="applyPreset"
          />
          <PreviewSlider
            title="Intensity"
            :min="0"
            :max="2"
            :step="0.05"
            :model-value="props.intensity"
            @update:model-value="value => updateProp('intensity', value)"
          />
          <PreviewSlider
            title="Sensitivity"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.sensitivity"
            @update:model-value="value => updateProp('sensitivity', value)"
          />
          <PreviewSlider
            title="Hover Decay"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.hoverDecay"
            @update:model-value="value => updateProp('hoverDecay', value)"
          />
          <PreviewSlider
            title="Recovery"
            :min="0.1"
            :max="3"
            :step="0.1"
            value-unit="s"
            :model-value="props.recovery"
            @update:model-value="value => updateProp('recovery', value)"
          />
          <PreviewSlider
            title="Idle"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.idle"
            @update:model-value="value => updateProp('idle', value)"
          />
          <PreviewSlider
            title="Grain"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="props.grain"
            @update:model-value="value => updateProp('grain', value)"
          />
          <PreviewSlider
            title="Detail"
            :min="1"
            :max="8"
            :step="1"
            :model-value="props.detail"
            @update:model-value="value => updateProp('detail', value)"
          />
          <PreviewSlider
            title="Pattern"
            :min="0"
            :max="50"
            :step="1"
            :model-value="props.pattern"
            @update:model-value="value => updateProp('pattern', value)"
          />
          <PreviewSlider
            title="Flow"
            :min="0"
            :max="2"
            :step="0.05"
            :model-value="props.flow"
            @update:model-value="value => updateProp('flow', value)"
          />
          <PreviewSlider
            title="Chroma"
            :min="0"
            :max="2"
            :step="0.05"
            :model-value="props.chroma"
            @update:model-value="value => updateProp('chroma', value)"
          />
          <PreviewSlider
            title="Travel"
            :min="0"
            :max="150"
            :step="5"
            value-unit="px"
            :model-value="props.travel"
            @update:model-value="value => updateProp('travel', value)"
          />
          <PreviewSlider
            title="Tilt"
            :min="0"
            :max="30"
            :step="1"
            value-unit="°"
            :model-value="props.tilt"
            @update:model-value="value => updateProp('tilt', value)"
          />
          <PreviewSelect
            title="Scope"
            :options="SCOPE_OPTIONS"
            :model-value="props.scope"
            @update:model-value="value => updateProp('scope', value as Scope)"
          />
          <PreviewSlider
            title="Radius"
            :min="0"
            :max="40"
            :step="1"
            value-unit="px"
            :model-value="props.radius"
            @update:model-value="value => updateProp('radius', value)"
          />
          <PreviewSlider
            title="Width"
            :min="200"
            :max="420"
            :step="10"
            value-unit="px"
            :model-value="props.width"
            @update:model-value="value => updateProp('width', value)"
          />
          <PreviewSlider
            title="Height"
            :min="260"
            :max="480"
            :step="10"
            value-unit="px"
            :model-value="props.height"
            @update:model-value="value => updateProp('height', value)"
          />
          <PreviewSwitch
            title="Grayscale"
            :model-value="props.grayscale"
            @update:model-value="value => updateProp('grayscale', value)"
          />
        </Customize>

        <PropTable :data="propData" />
      </template>

      <template #code>
        <CodeExample :code-object="decayCard" component-name="DecayCard" />
      </template>
    </TabsLayout>
  </ComponentPropsProvider>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import CodeExample from '@/components/common/CodeExample.vue';
import Customize from '@/components/common/Customize.vue';
import PreviewSelect from '@/components/common/PreviewSelect.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import ComponentPropsProvider from '@/components/context/ComponentPropsProvider.vue';
import { useComponentProps } from '@/composables/useComponentProps';
import { decayCard } from '@/constants/code/Components/decayCardCode';
import DecayCard from '@/content/Components/DecayCard/DecayCard.vue';

type Scope = 'window' | 'card';

const IMAGE = 'https://images.unsplash.com/photo-1778849097774-0ab2a873a858?w=900&q=80&auto=format&fit=crop';

const SCOPE_OPTIONS = [
  { value: 'window', label: 'Window' },
  { value: 'card', label: 'Card' }
];

const DEFAULT_PROPS = {
  preset: 'torn',
  width: 300,
  height: 400,
  intensity: 0.5,
  sensitivity: 0.5,
  hoverDecay: 0.05,
  recovery: 0.6,
  idle: 0.35,
  grain: 0.25,
  detail: 5,
  pattern: 4,
  flow: 0,
  chroma: 0,
  travel: 50,
  tilt: 10,
  scope: 'window' as Scope,
  radius: 0,
  grayscale: false
};

type DemoProps = typeof DEFAULT_PROPS;

const PRESETS: Record<string, Partial<DemoProps>> = {
  torn: {},
  shatter: { intensity: 0.7, grain: 0.5, detail: 6, sensitivity: 0.65, recovery: 0.45 },
  melt: { intensity: 0.45, grain: 0.1, detail: 2, recovery: 1, flow: 0.4 },
  prism: { intensity: 0.4, chroma: 0.6, flow: 0.3, radius: 16 },
  subtle: { intensity: 0.25, sensitivity: 0.35, hoverDecay: 0.1, idle: 0.2, travel: 20, tilt: 4, radius: 16 },
  still: { intensity: 0.4, scope: 'card', travel: 0, tilt: 0, hoverDecay: 0.15, radius: 16 }
};

const PRESET_OPTIONS = [
  { value: 'torn', label: 'Torn' },
  { value: 'shatter', label: 'Shatter' },
  { value: 'melt', label: 'Melt' },
  { value: 'prism', label: 'Prism' },
  { value: 'subtle', label: 'Subtle' },
  { value: 'still', label: 'Still' }
];

const { props, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);

const settings = computed(() => {
  const { preset: _preset, ...rest } = props.value;
  void _preset;
  return rest;
});

const applyPreset = (input: string | number) => {
  const value = String(input);
  updateProps({ ...DEFAULT_PROPS, ...PRESETS[value], preset: value });
};

const computedProps = { image: IMAGE };

const propData: PropRow[] = [
  { name: 'image', type: 'string', default: '-', description: 'Image URL. It fills the card like a cover.' },
  { name: 'default slot', type: 'slot', default: '-', description: 'Content shown over the bottom of the image.' },
  { name: 'width', type: 'number', default: '300', description: 'Card width in pixels.' },
  { name: 'height', type: 'number', default: '400', description: 'Card height in pixels.' },
  {
    name: 'intensity',
    type: 'number',
    default: '0.5',
    description:
      'How far the image tears apart at full decay, from 0 to 2. The edges tear the most so the photo stays readable.'
  },
  {
    name: 'sensitivity',
    type: 'number',
    default: '0.5',
    description: 'How little pointer movement it takes to reach full decay, from 0 to 1.'
  },
  {
    name: 'hoverDecay',
    type: 'number',
    default: '0.05',
    description: 'Decay that stays while the pointer rests on the card, from 0 to 1.'
  },
  {
    name: 'recovery',
    type: 'number',
    default: '0.6',
    description: 'Seconds the image takes to pull itself back together once the pointer slows down.'
  },
  {
    name: 'idle',
    type: 'number',
    default: '0.35',
    description: 'Keeps the edges slowly fraying and soft patches drifting while nobody interacts, from 0 to 1.'
  },
  {
    name: 'grain',
    type: 'number',
    default: '0.25',
    description: 'Size of the tears, from broad melting shapes at 0 to fine shards at 1.'
  },
  {
    name: 'detail',
    type: 'number',
    default: '5',
    description: 'Layers of noise in the tears, from 1 to 8. More layers give rougher edges.'
  },
  { name: 'pattern', type: 'number', default: '4', description: 'Picks a different tear pattern.' },
  {
    name: 'flow',
    type: 'number',
    default: '0',
    description: 'Lets the tears churn while the card is decaying. 0 keeps them still.'
  },
  { name: 'chroma', type: 'number', default: '0', description: 'Splits the color channels apart inside the tears.' },
  {
    name: 'travel',
    type: 'number',
    default: '50',
    description: 'How far in pixels the card drifts toward the pointer before it slows down.'
  },
  {
    name: 'tilt',
    type: 'number',
    default: '10',
    description: 'How far in degrees the card rotates as the pointer moves sideways.'
  },
  {
    name: 'scope',
    type: "'window' | 'card'",
    default: "'window'",
    description: 'Window follows the pointer anywhere on the page. Card only reacts while it is hovered.'
  },
  { name: 'radius', type: 'number', default: '0', description: 'Corner radius of the image in pixels.' },
  { name: 'grayscale', type: 'boolean', default: 'false', description: 'Shows the image in grayscale.' },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the root.' },
  { name: 'style', type: 'CSSProperties', default: '-', description: 'Inline styles for the root.' }
];
</script>
