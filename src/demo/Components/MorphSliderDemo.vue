<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
  >
    <TabsLayout>
      <template #preview>
        <div class="demo-container relative overflow-hidden" style="height: 500px; padding: 0">
          <MorphSlider v-bind="props" :items="DEMO_ITEMS" />
        </div>

        <Customize>
          <PreviewSelect
            title="Transition"
            :options="TRANSITION_OPTIONS"
            :model-value="props.transition"
            :width="140"
            @update:model-value="v => updateProp('transition', v as MorphTransition)"
          />
          <PreviewColorPickerCustom
            title="Overlay"
            :color="props.overlayColor"
            @change="v => updateProp('overlayColor', v)"
          />
          <PreviewSelect
            title="Ease"
            :options="EASE_OPTIONS"
            :model-value="props.ease"
            :width="200"
            @update:model-value="v => updateProp('ease', v as string)"
          />
          <PreviewSlider
            title="Duration"
            :min="0.4"
            :max="2.5"
            :step="0.1"
            value-unit="s"
            :model-value="props.duration"
            @update:model-value="v => updateProp('duration', v)"
          />
          <PreviewSlider
            title="Intensity"
            :min="0"
            :max="1.2"
            :step="0.05"
            :model-value="props.intensity"
            @update:model-value="v => updateProp('intensity', v)"
          />
          <PreviewSlider
            title="Noise Scale"
            :min="0.5"
            :max="6"
            :step="0.1"
            :model-value="props.scale"
            @update:model-value="v => updateProp('scale', v)"
          />
          <PreviewSlider
            title="Aberration"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.aberration"
            @update:model-value="v => updateProp('aberration', v)"
          />
          <PreviewSlider
            title="Drift"
            :min="0"
            :max="1.5"
            :step="0.05"
            :model-value="props.drift"
            @update:model-value="v => updateProp('drift', v)"
          />
          <PreviewSlider
            title="Autoplay Delay"
            :min="1.5"
            :max="8"
            :step="0.5"
            value-unit="s"
            :model-value="props.autoplayDelay"
            @update:model-value="v => updateProp('autoplayDelay', v)"
          />
          <PreviewSlider
            title="Radius"
            :min="0"
            :max="40"
            :step="1"
            value-unit="px"
            :model-value="props.radius"
            @update:model-value="v => updateProp('radius', v)"
          />
          <PreviewSwitch
            title="Autoplay"
            :model-value="props.autoplay"
            @update:model-value="v => updateProp('autoplay', v)"
          />
          <PreviewSwitch title="Loop" :model-value="props.loop" @update:model-value="v => updateProp('loop', v)" />
          <PreviewSwitch
            title="Captions"
            :model-value="props.showCaptions"
            @update:model-value="v => updateProp('showCaptions', v)"
          />
          <PreviewSwitch
            title="Controls"
            :model-value="props.showControls"
            @update:model-value="v => updateProp('showControls', v)"
          />
          <PreviewSwitch
            title="Indicators"
            :model-value="props.showIndicators"
            @update:model-value="v => updateProp('showIndicators', v)"
          />
        </Customize>

        <PropTable :data="propData" />
        <Dependencies :dependency-list="['ogl', 'gsap']" />
      </template>

      <template #code>
        <CodeExample :code-object="morphSlider" component-name="MorphSlider" />
      </template>
    </TabsLayout>
  </ComponentPropsProvider>
</template>

<script setup lang="ts">
import CodeExample from '@/components/common/CodeExample.vue';
import Customize from '@/components/common/Customize.vue';
import Dependencies from '@/components/common/Dependencies.vue';
import PreviewColorPickerCustom from '@/components/common/PreviewColorPickerCustom.vue';
import PreviewSelect from '@/components/common/PreviewSelect.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import ComponentPropsProvider from '@/components/context/ComponentPropsProvider.vue';
import { useComponentProps } from '@/composables/useComponentProps';
import { morphSlider } from '@/constants/code/Components/morphSliderCode';
import MorphSlider, { type MorphTransition } from '@/content/Components/MorphSlider/MorphSlider.vue';

const DEMO_ITEMS = [
  {
    image: 'https://images.unsplash.com/photo-1782977389500-dd7adad33ebe?q=80&w=1600&auto=format&fit=crop',
    caption: 'One'
  },
  {
    image: 'https://images.unsplash.com/photo-1781499455083-6ccc3beb20cd?q=80&w=1600&auto=format&fit=crop',
    caption: 'Two'
  },
  {
    image: 'https://images.unsplash.com/photo-1776394254711-4a0d7345269a?q=80&w=1600&auto=format&fit=crop',
    caption: 'Three'
  },
  {
    image: 'https://images.unsplash.com/photo-1781242629922-6f39cc3671cd?q=80&w=1600&auto=format&fit=crop',
    caption: 'Four'
  }
];

const TRANSITION_OPTIONS = [
  { value: 'melt', label: 'Melt' },
  { value: 'ripple', label: 'Ripple' },
  { value: 'shear', label: 'Shear' },
  { value: 'swirl', label: 'Swirl' }
];

const EASE_OPTIONS = [
  { value: 'power2.inOut', label: 'Smooth (power2.inOut)' },
  { value: 'power3.out', label: 'Expo Out (power3.out)' },
  { value: 'expo.inOut', label: 'Expo InOut' },
  { value: 'none', label: 'Linear' }
];

const DEFAULT_PROPS = {
  transition: 'melt' as MorphTransition,
  overlayColor: '#05060a',
  duration: 1.1,
  ease: 'power2.inOut',
  intensity: 0.55,
  scale: 2.4,
  aberration: 0.35,
  drift: 0.4,
  autoplay: false,
  autoplayDelay: 4,
  loop: true,
  radius: 16,
  showCaptions: true,
  showControls: true,
  showIndicators: true
};

const { props, updateProp, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);

const propData: PropRow[] = [
  {
    name: 'items',
    type: 'Array<{ image: string; caption?: string }>',
    default: '[...]',
    description: 'Slides to morph between. Each item is an image URL with an optional caption.'
  },
  { name: 'startIndex', type: 'number', default: '0', description: 'Index of the slide shown on mount.' },
  {
    name: 'transition',
    type: '"melt" | "ripple" | "shear" | "swirl"',
    default: '"melt"',
    description: 'Character of the GPU displacement morph between slides.'
  },
  { name: 'duration', type: 'number', default: '1.1', description: 'Length of a full transition in seconds.' },
  {
    name: 'ease',
    type: 'string',
    default: '"power2.inOut"',
    description: 'GSAP easing curve used to drive the transition progress.'
  },
  {
    name: 'intensity',
    type: 'number',
    default: '0.55',
    description: 'Strength of the displacement — how far the images warp during the morph.'
  },
  {
    name: 'scale',
    type: 'number',
    default: '2.4',
    description: 'Frequency of the procedural noise field (affects the Melt transition most).'
  },
  {
    name: 'aberration',
    type: 'number',
    default: '0.35',
    description: 'Amount of RGB split that peaks mid-transition and resolves to zero.'
  },
  {
    name: 'drift',
    type: 'number',
    default: '0.4',
    description: 'Idle drift / breathing applied to the current image so it is never fully static.'
  },
  {
    name: 'autoplay',
    type: 'boolean',
    default: 'false',
    description: 'Advance slides automatically; pauses on hover.'
  },
  {
    name: 'autoplayDelay',
    type: 'number',
    default: '4',
    description: 'Seconds each slide holds before autoplay advances.'
  },
  {
    name: 'loop',
    type: 'boolean',
    default: 'true',
    description: 'Wrap around from the last slide back to the first.'
  },
  { name: 'radius', type: 'number', default: '16', description: 'Corner radius of the slider in pixels.' },
  {
    name: 'overlayColor',
    type: 'string',
    default: '"#000000"',
    description: 'Tint used for the subtle edge vignette over the images.'
  },
  {
    name: 'showCaptions',
    type: 'boolean',
    default: 'true',
    description: 'Show slide captions that animate in with each transition.'
  },
  {
    name: 'showControls',
    type: 'boolean',
    default: 'true',
    description: 'Show the previous / next arrow buttons.'
  },
  { name: 'showIndicators', type: 'boolean', default: 'true', description: 'Show the slide indicator dots.' },
  { name: 'className', type: 'string', default: '""', description: 'Additional CSS classes for the outer wrapper.' }
];
</script>
