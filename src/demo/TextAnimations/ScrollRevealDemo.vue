<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
    :demo-only-props="['preset', 'highlight']"
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
          <RefreshButton v-if="settings.mode === 'enter'" @click="forceRerender" />
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
          <div style="position: relative; padding: 640px 3rem 480px">
            <ScrollReveal
              :key="rerenderKey"
              v-bind="settings"
              :highlight-color="props.highlight ? props.highlightColor : ''"
              :scroll-container-ref="containerRef"
            >
              When does a man die? When he is hit by a bullet? No! When he suffers a disease? No! When he ate a soup
              made out of a poisonous mushroom? No! A man dies when he is forgotten!
            </ScrollReveal>
          </div>
        </div>

        <Customize>
          <PreviewSelect
            title="Preset"
            :options="PRESET_OPTIONS"
            :model-value="props.preset"
            @update:model-value="value => applyPreset(String(value))"
          />
          <PreviewSwitch
            title="Highlight"
            :model-value="props.highlight"
            @update:model-value="value => updateProp('highlight', value)"
          />
          <PreviewColorPickerCustom
            title="Highlight Color"
            :color="props.highlightColor"
            @change="value => updateProps({ highlightColor: value, highlight: true })"
          />
          <PreviewSelect
            title="Mode"
            :options="MODE_OPTIONS"
            :model-value="settings.mode"
            @update:model-value="value => updateProp('mode', value as Mode)"
          />
          <PreviewSelect
            title="Split By"
            :options="SPLIT_OPTIONS"
            :model-value="settings.splitBy"
            @update:model-value="value => updateProp('splitBy', value as Split)"
          />
          <PreviewSelect
            title="Effect"
            :options="EFFECT_OPTIONS"
            :model-value="settings.effect"
            @update:model-value="value => updateProp('effect', value as Effect)"
          />
          <PreviewSlider
            title="Stagger"
            :min="0"
            :max="0.5"
            :step="0.005"
            :model-value="settings.stagger"
            @update:model-value="value => updateProp('stagger', value)"
          />
          <PreviewSlider
            title="Duration"
            :min="0.2"
            :max="2"
            :step="0.05"
            value-unit="s"
            :is-disabled="settings.mode !== 'enter'"
            :model-value="settings.duration"
            @update:model-value="value => updateProp('duration', value)"
          />
          <PreviewSlider
            title="Smoothing"
            :min="0"
            :max="2"
            :step="0.1"
            value-unit="s"
            :is-disabled="settings.mode !== 'scrub'"
            :model-value="settings.smoothing"
            @update:model-value="value => updateProp('smoothing', value)"
          />
          <PreviewSlider
            title="Starting Opacity"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.baseOpacity"
            @update:model-value="value => updateProp('baseOpacity', value)"
          />
          <PreviewSlider
            title="Starting Rotation"
            :min="0"
            :max="10"
            :step="1"
            value-unit="°"
            :model-value="settings.baseRotation"
            @update:model-value="value => updateProp('baseRotation', value)"
          />
          <PreviewSlider
            title="Starting Offset"
            :min="0"
            :max="60"
            :step="1"
            value-unit="px"
            :model-value="settings.baseOffset"
            @update:model-value="value => updateProp('baseOffset', value)"
          />
          <PreviewSlider
            title="Blur Strength"
            :min="0"
            :max="20"
            :step="1"
            value-unit="px"
            :is-disabled="!settings.enableBlur"
            :model-value="settings.blurStrength"
            @update:model-value="value => updateProp('blurStrength', value)"
          />
          <PreviewSwitch
            title="Enable Blur"
            :model-value="settings.enableBlur"
            @update:model-value="value => updateProp('enableBlur', value)"
          />
        </Customize>

        <PropTable :data="propData" />
        <Dependencies :dependency-list="['gsap']" />
      </template>

      <template #code>
        <CodeExample :code-object="scrollReveal" component-name="ScrollReveal" />
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
import RefreshButton from '@/components/common/RefreshButton.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import ComponentPropsProvider from '@/components/context/ComponentPropsProvider.vue';
import { useComponentProps } from '@/composables/useComponentProps';
import { useForceRerender } from '@/composables/useForceRerender';
import { useSmoothScroll } from '@/composables/useSmoothScroll';
import { scrollReveal } from '@/constants/code/TextAnimations/scrollRevealCode';
import ScrollReveal from '@/content/TextAnimations/ScrollReveal/ScrollReveal.vue';

type Mode = 'scrub' | 'enter';
type Split = 'words' | 'chars' | 'lines';
type Effect = 'fade' | 'rise' | 'flip' | 'scale';

type Look = {
  highlight: boolean;
  highlightColor: string;
  mode: Mode;
  splitBy: Split;
  effect: Effect;
  stagger: number;
  duration: number;
  smoothing: number;
  baseOpacity: number;
  baseRotation: number;
  baseOffset: number;
  enableBlur: boolean;
  blurStrength: number;
};

const LOOK: Look = {
  highlight: false,
  highlightColor: '#ff5a1f',
  mode: 'scrub',
  splitBy: 'words',
  effect: 'fade',
  stagger: 0.05,
  duration: 0.8,
  smoothing: 0,
  baseOpacity: 0.1,
  baseRotation: 3,
  baseOffset: 0,
  enableBlur: true,
  blurStrength: 4
};

const PRESETS: Record<string, Look> = {
  reveal: { ...LOOK },
  highlight: { ...LOOK, highlight: true, stagger: 0.2, baseOpacity: 0.15, baseRotation: 0, enableBlur: false },
  rise: {
    ...LOOK,
    mode: 'enter',
    splitBy: 'lines',
    effect: 'rise',
    stagger: 0.12,
    duration: 0.9,
    baseOpacity: 0,
    baseRotation: 0,
    enableBlur: false
  },
  flip: {
    ...LOOK,
    splitBy: 'chars',
    effect: 'flip',
    stagger: 0.012,
    smoothing: 0.3,
    baseOpacity: 0,
    baseRotation: 0,
    enableBlur: false
  }
};

const DEFAULT_PROPS = {
  preset: 'reveal',
  ...LOOK
};

const PRESET_OPTIONS = [
  { value: 'reveal', label: 'Reveal' },
  { value: 'highlight', label: 'Highlight' },
  { value: 'rise', label: 'Rise' },
  { value: 'flip', label: 'Flip' }
];

const MODE_OPTIONS = [
  { value: 'scrub', label: 'Scrub' },
  { value: 'enter', label: 'Enter' }
];

const SPLIT_OPTIONS = [
  { value: 'words', label: 'Words' },
  { value: 'chars', label: 'Chars' },
  { value: 'lines', label: 'Lines' }
];

const EFFECT_OPTIONS = [
  { value: 'fade', label: 'Fade' },
  { value: 'rise', label: 'Rise' },
  { value: 'flip', label: 'Flip' },
  { value: 'scale', label: 'Scale' }
];

const propData: PropRow[] = [
  {
    name: 'children',
    type: 'slot',
    default: '-',
    description:
      'The text to reveal. Plain text is split into words, characters or lines, anything else is revealed as one piece.'
  },
  {
    name: 'scrollContainerRef',
    type: 'Ref<HTMLElement | null> | HTMLElement',
    default: 'window',
    description: 'Ref to the element that scrolls. Leave it out to use the page.'
  },
  {
    name: 'highlightColor',
    type: 'string',
    default: "''",
    description:
      'Accent each word lights up to while it is being revealed, before it settles to the text color. Leave empty for no highlight.'
  },
  {
    name: 'mode',
    type: "'scrub' | 'enter'",
    default: "'scrub'",
    description:
      "'scrub' ties the reveal to the scroll position, 'enter' plays it once when the text scrolls into view."
  },
  {
    name: 'splitBy',
    type: "'words' | 'chars' | 'lines'",
    default: "'words'",
    description:
      "What each step of the reveal is. 'lines' groups the words of each rendered line and regroups on resize."
  },
  {
    name: 'effect',
    type: "'fade' | 'rise' | 'flip' | 'scale'",
    default: "'fade'",
    description:
      "How each piece appears. 'fade' brightens in place, 'rise' slides up from behind its own baseline, 'flip' stands up from flat and 'scale' pops up from small."
  },
  {
    name: 'stagger',
    type: 'number',
    default: '0.05',
    description:
      'Spacing between pieces. Higher values reveal them one at a time instead of in a soft wave. In enter mode it is in seconds.'
  },
  {
    name: 'duration',
    type: 'number',
    default: '0.8',
    description: "Seconds each piece takes to appear when mode is 'enter'."
  },
  {
    name: 'smoothing',
    type: 'number',
    default: '0',
    description: 'Seconds the reveal takes to catch up with the scroll. 0 ties it to the scroll directly.'
  },
  {
    name: 'enableBlur',
    type: 'boolean',
    default: 'true',
    description: 'Starts each piece out of focus and sharpens it as it appears.'
  },
  {
    name: 'blurStrength',
    type: 'number',
    default: '4',
    description: 'How blurred the pieces start, in px.'
  },
  {
    name: 'baseOpacity',
    type: 'number',
    default: '0.1',
    description: 'Opacity of the pieces before they are revealed, from 0 to 1.'
  },
  {
    name: 'baseRotation',
    type: 'number',
    default: '3',
    description: 'Tilt of the whole block before it levels out, in degrees. 0 keeps it level.'
  },
  {
    name: 'baseOffset',
    type: 'number',
    default: '0',
    description: 'How far below its place each piece starts, in px. Pieces rise into place as they appear.'
  },
  {
    name: 'rotationEnd',
    type: 'string',
    default: "'bottom bottom'",
    description: 'Scroll position where the block finishes leveling out in scrub mode, in ScrollTrigger syntax.'
  },
  {
    name: 'wordAnimationEnd',
    type: 'string',
    default: "'bottom bottom'",
    description:
      'Scroll position where every piece is fully revealed in scrub mode. Text near the end of the page still finishes.'
  },
  {
    name: 'containerClassName',
    type: 'string',
    default: "''",
    description: 'Extra class names for the heading.'
  },
  {
    name: 'textClassName',
    type: 'string',
    default: "''",
    description: 'Extra class names for the text.'
  }
];

const containerRef = useTemplateRef<HTMLDivElement>('containerRef');
const hintRef = useTemplateRef<HTMLDivElement>('hintRef');
const { rerenderKey, forceRerender } = useForceRerender();
const { props, defaultProps, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);

const settings = computed(() => {
  const { preset: _preset, highlight: _highlight, highlightColor: _highlightColor, ...rest } = props.value;
  return rest;
});

const computedProps = computed(() => ({
  highlightColor: props.value.highlight ? props.value.highlightColor : undefined
}));

useSmoothScroll(containerRef, true);

const fadeHint = (event: Event) => {
  const hint = hintRef.value;
  if (!hint) return;
  const t = Math.min(1, (event.currentTarget as HTMLElement).scrollTop / 160);
  hint.style.opacity = String(1 - t * t * (3 - 2 * t));
};

const applyPreset = (value: string) => {
  const base = Object.fromEntries(
    (Object.keys(LOOK) as (keyof Look)[]).map(name => [name, defaultProps.value[name]])
  ) as Partial<Look>;
  updateProps({ ...base, ...PRESETS[value], preset: value });
  forceRerender();
};
</script>
