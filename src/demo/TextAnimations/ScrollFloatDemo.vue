<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
    :demo-only-props="['preset', 'colorShift', 'shiftColor']"
    :computed-props="computedProps"
  >
    <TabsLayout>
      <template #preview>
        <div
          ref="containerRef"
          class="demo-container"
          style="
            height: 400px;
            max-height: 400px;
            overflow-y: scroll;
            overflow-x: hidden;
            position: relative;
            display: block;
          "
          @scroll="fadeHint"
        >
          <div
            ref="hintRef"
            class="demo-scroll-hint"
            style="
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              height: 400px;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              gap: 6px;
              pointer-events: none;
            "
          >
            <p style="font-size: 13px; font-weight: 500; margin: 0">Scroll down in this box</p>
            <HugeiconsIcon :icon="ArrowDown01Icon" :size="16" :stroke-width="1.8" />
          </div>
          <div style="position: relative; padding: 760px 3rem 520px">
            <ScrollFloat v-bind="settings" :from-color="fromColor" :scroll-container-ref="containerRef">
              Vue Bits
            </ScrollFloat>
          </div>
        </div>

        <Customize>
          <PreviewSelect
            title="Preset"
            :options="PRESET_OPTIONS"
            :model-value="props.preset"
            @update:model-value="value => applyPreset(String(value))"
          />

          <PreviewColorPickerCustom
            title="Start Color"
            :color="props.shiftColor"
            @change="value => updateProps({ shiftColor: value, colorShift: true })"
          />
          <PreviewSwitch
            title="Color Shift"
            :model-value="props.colorShift"
            @update:model-value="value => updateProp('colorShift', value)"
          />

          <PreviewSelect
            title="Effect"
            :options="EFFECT_OPTIONS"
            :model-value="settings.effect"
            @update:model-value="value => updateProp('effect', value as Effect)"
          />
          <PreviewSelect
            title="Split"
            :options="SPLIT_OPTIONS"
            :model-value="settings.splitBy"
            @update:model-value="value => updateProp('splitBy', value as Split)"
          />
          <PreviewSelect
            title="Direction"
            :options="DIRECTION_OPTIONS"
            :model-value="settings.direction"
            @update:model-value="value => updateProp('direction', value as Direction)"
          />
          <PreviewSelect
            title="Order"
            :options="ORDER_OPTIONS"
            :model-value="settings.order"
            @update:model-value="value => updateProp('order', value as Order)"
          />
          <PreviewSelect
            title="Ease"
            :options="EASE_OPTIONS"
            :model-value="settings.ease"
            @update:model-value="value => updateProp('ease', String(value))"
          />
          <PreviewSlider
            title="Stagger"
            :min="0.01"
            :max="0.2"
            :step="0.01"
            value-unit="s"
            :model-value="settings.stagger"
            @update:model-value="value => updateProp('stagger', value)"
          />
          <PreviewSlider
            title="Duration"
            :min="0.2"
            :max="3"
            :step="0.1"
            value-unit="s"
            :model-value="settings.animationDuration"
            @update:model-value="value => updateProp('animationDuration', value)"
          />
          <PreviewSlider
            title="Smoothing"
            :min="0"
            :max="2"
            :step="0.1"
            value-unit="s"
            :model-value="settings.smoothing"
            @update:model-value="value => updateProp('smoothing', value)"
          />

          <PreviewSlider
            title="Distance"
            :min="0"
            :max="300"
            :step="10"
            value-unit="%"
            :model-value="settings.distance"
            @update:model-value="value => updateProp('distance', value)"
          />
          <PreviewSlider
            title="Stretch"
            :min="1"
            :max="4"
            :step="0.1"
            :is-disabled="settings.effect !== 'float' && settings.effect !== 'wave'"
            :model-value="settings.stretch"
            @update:model-value="value => updateProp('stretch', value)"
          />
        </Customize>

        <PropTable :data="propData" />
        <Dependencies :dependency-list="['gsap']" />
      </template>

      <template #code>
        <CodeExample :code-object="scrollFloat" component-name="ScrollFloat" />
      </template>
    </TabsLayout>
  </ComponentPropsProvider>
</template>

<script setup lang="ts">
import { ArrowDown01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { computed, useTemplateRef } from 'vue';
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
import { useSmoothScroll } from '@/composables/useSmoothScroll';
import { scrollFloat } from '@/constants/code/TextAnimations/scrollFloatCode';
import ScrollFloat from '@/content/TextAnimations/ScrollFloat/ScrollFloat.vue';

type Effect = 'float' | 'flip' | 'scatter' | 'blur' | 'wave';
type Split = 'chars' | 'words';
type Direction = 'up' | 'down';
type Order = 'start' | 'end' | 'center' | 'edges' | 'random';

type Look = {
  colorShift: boolean;
  shiftColor: string;
  effect: Effect;
  splitBy: Split;
  direction: Direction;
  order: Order;
  ease: string;
  animationDuration: number;
  stagger: number;
  smoothing: number;
  distance: number;
  stretch: number;
};

const LOOK: Look = {
  colorShift: false,
  shiftColor: '#ff6b3d',
  effect: 'float',
  splitBy: 'chars',
  direction: 'up',
  order: 'start',
  ease: 'back.inOut(2)',
  animationDuration: 1,
  stagger: 0.03,
  smoothing: 0,
  distance: 120,
  stretch: 2.3
};

const PRESETS: Record<string, Look> = {
  float: { ...LOOK },
  flip: {
    ...LOOK,
    effect: 'flip',
    direction: 'down',
    order: 'center',
    stagger: 0.12,
    smoothing: 0.4,
    distance: 140
  },
  scatter: {
    ...LOOK,
    colorShift: true,
    effect: 'scatter',
    order: 'random',
    ease: 'sine.inOut',
    stagger: 0.09,
    smoothing: 0.5,
    distance: 170
  },
  wave: {
    ...LOOK,
    colorShift: true,
    shiftColor: '#3d8bff',
    effect: 'wave',
    ease: 'none',
    animationDuration: 1.6,
    stagger: 0.11,
    smoothing: 0.3,
    distance: 130,
    stretch: 1.4
  }
};

const DEFAULT_PROPS = {
  preset: 'float',
  ...LOOK
};

const PRESET_OPTIONS = [
  { value: 'float', label: 'Float' },
  { value: 'flip', label: 'Flip' },
  { value: 'scatter', label: 'Scatter' },
  { value: 'wave', label: 'Wave' }
];

const EFFECT_OPTIONS = [
  { value: 'float', label: 'Float' },
  { value: 'flip', label: 'Flip' },
  { value: 'scatter', label: 'Scatter' },
  { value: 'blur', label: 'Blur' },
  { value: 'wave', label: 'Wave' }
];

const SPLIT_OPTIONS = [
  { value: 'chars', label: 'Letters' },
  { value: 'words', label: 'Words' }
];

const DIRECTION_OPTIONS = [
  { value: 'up', label: 'Up' },
  { value: 'down', label: 'Down' }
];

const ORDER_OPTIONS = [
  { value: 'start', label: 'Start' },
  { value: 'end', label: 'End' },
  { value: 'center', label: 'Center' },
  { value: 'edges', label: 'Edges' },
  { value: 'random', label: 'Random' }
];

const EASE_OPTIONS = [
  { value: 'back.inOut(2)', label: 'Overshoot' },
  { value: 'elastic.out(1, 0.45)', label: 'Elastic' },
  { value: 'power3.out', label: 'Glide' },
  { value: 'sine.inOut', label: 'Smooth' },
  { value: 'expo.out', label: 'Expo' },
  { value: 'none', label: 'Linear' }
];

const propData: PropRow[] = [
  {
    name: 'children',
    type: 'slot',
    default: '-',
    description: 'The text to animate. Plain text is split into letters or words, anything else moves in as one piece.'
  },
  {
    name: 'scrollContainerRef',
    type: 'Ref<HTMLElement | null> | HTMLElement | null',
    default: 'window',
    description: 'Ref to the element that scrolls. Leave it out to use the page.'
  },
  {
    name: 'effect',
    type: "'float' | 'flip' | 'scatter' | 'blur' | 'wave'",
    default: "'float'",
    description:
      'How the pieces arrive. Float stretches them up out of a slot, flip rolls them in on a drum, scatter assembles them from random spots, blur pulls them into focus and wave makes them swell in on a rolling wave.'
  },
  {
    name: 'splitBy',
    type: "'chars' | 'words'",
    default: "'chars'",
    description: 'Animate each letter on its own or each word as one piece.'
  },
  {
    name: 'direction',
    type: "'up' | 'down'",
    default: "'up'",
    description: 'Whether the pieces come in from below or from above.'
  },
  {
    name: 'order',
    type: "'start' | 'end' | 'center' | 'edges' | 'random'",
    default: "'start'",
    description: 'Which pieces go first. The order is fixed, so random looks the same on every visit.'
  },
  {
    name: 'fromColor',
    type: 'string',
    default: "'currentColor'",
    description:
      'Color the pieces start in before they settle into the text color. Keep currentColor for no color change.'
  },
  {
    name: 'animationDuration',
    type: 'number',
    default: '1',
    description: "Length of each piece's move compared to the stagger. Higher values move the pieces more together."
  },
  {
    name: 'ease',
    type: 'string',
    default: "'back.inOut(2)'",
    description: "Any GSAP ease, such as 'power3.out', 'elastic.out(1, 0.45)' or 'none'."
  },
  {
    name: 'stagger',
    type: 'number',
    default: '0.03',
    description: 'Delay between pieces. Higher values make the text form one piece at a time.'
  },
  {
    name: 'distance',
    type: 'number',
    default: '120',
    description:
      'How far the pieces travel, as a percentage of their height. For flip it sets the size of the drum they roll around, for scatter how widely they start apart.'
  },
  {
    name: 'stretch',
    type: 'number',
    default: '2.3',
    description: 'How tall the pieces are stretched while they rise in the float and wave effects. 1 keeps their shape.'
  },
  {
    name: 'smoothing',
    type: 'number',
    default: '0',
    description: 'Seconds the pieces take to catch up with the scroll. 0 ties them to it directly.'
  },
  {
    name: 'scrollStart',
    type: 'string',
    default: "'center bottom+=50%'",
    description: 'Scroll position where the animation starts, in ScrollTrigger syntax.'
  },
  {
    name: 'scrollEnd',
    type: 'string',
    default: "'bottom bottom-=40%'",
    description: 'Scroll position where the pieces settle. Text near the end of the page still settles fully.'
  },
  { name: 'containerClassName', type: 'string', default: "''", description: 'Extra class names for the heading.' },
  { name: 'textClassName', type: 'string', default: "''", description: 'Extra class names for the text.' }
];

const containerRef = useTemplateRef<HTMLDivElement>('containerRef');
const hintRef = useTemplateRef<HTMLDivElement>('hintRef');
const { props, defaultProps, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);

const settings = computed(() => {
  const { preset: _preset, colorShift: _colorShift, shiftColor: _shiftColor, ...rest } = props.value;
  return rest;
});
const fromColor = computed(() => (props.value.colorShift ? props.value.shiftColor : 'currentColor'));
const computedProps = computed(() => ({ fromColor: fromColor.value }));

useSmoothScroll(containerRef, true);

const fadeHint = (event: Event) => {
  const hint = hintRef.value;
  if (!hint) return;
  const t = Math.min(1, (event.currentTarget as HTMLElement).scrollTop / 160);
  hint.style.opacity = String(1 - t * t * (3 - 2 * t));
};

const replay = () => containerRef.value?.scrollTo({ top: 0, behavior: 'smooth' });

const applyPreset = (value: string) => {
  const base = Object.fromEntries(
    (Object.keys(LOOK) as (keyof Look)[]).map(name => [name, defaultProps.value[name]])
  ) as Partial<Look>;
  updateProps({ ...base, ...PRESETS[value], preset: value });
  replay();
};
</script>
