<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
    :demo-only-props="['preset', 'tinted', 'tintColor', 'outlineColor']"
    :computed-props="computedProps"
  >
    <TabsLayout>
      <template #preview>
        <div
          class="demo-container flex items-center justify-center overflow-hidden px-5 md:px-10"
          style="height: 420px"
        >
          <MaskedHeading
            :key="replayKey"
            v-bind="settings"
            :tint="props.tinted ? props.tintColor : ''"
            :outline-color="props.outlineColor"
            :src="settings.mediaType === 'video' ? DEMO_VIDEO : DEMO_IMAGE"
          />
        </div>

        <Customize>
          <PreviewSelect
            title="Preset"
            :options="PRESET_OPTIONS"
            :model-value="props.preset"
            @update:model-value="value => applyPreset(String(value))"
          />
          <PreviewColorPickerCustom
            title="Tint Color"
            :color="props.tintColor"
            @change="value => updateProps({ tintColor: value, tinted: true })"
          />
          <PreviewColorPickerCustom
            title="Outline Color"
            :color="props.outlineColor || ink"
            @change="value => updateProps({ outlineColor: value, outline: true })"
          />
          <PreviewSelect
            title="Reveal"
            :options="REVEAL_OPTIONS"
            :model-value="settings.reveal"
            @update:model-value="value => updateProp('reveal', value as Reveal)"
          />
          <PreviewSelect
            title="Trigger"
            :options="TRIGGER_OPTIONS"
            :model-value="settings.trigger"
            @update:model-value="value => updateProp('trigger', value as Trigger)"
          />
          <PreviewSlider
            title="Duration"
            :min="0.3"
            :max="2.4"
            :step="0.05"
            value-unit="s"
            :is-disabled="settings.reveal === 'none'"
            :model-value="settings.duration"
            @update:model-value="value => updateProp('duration', value)"
          />
          <PreviewSlider
            title="Stagger"
            :min="0"
            :max="0.3"
            :step="0.01"
            value-unit="s"
            :is-disabled="!['rise', 'scale'].includes(settings.reveal)"
            :model-value="settings.stagger"
            @update:model-value="value => updateProp('stagger', value)"
          />
          <PreviewSlider
            title="Parallax"
            :min="0"
            :max="80"
            :step="1"
            value-unit="px"
            :model-value="settings.parallax"
            @update:model-value="value => updateProp('parallax', value)"
          />
          <PreviewSlider
            title="Drift"
            :min="0"
            :max="60"
            :step="1"
            value-unit="px"
            :model-value="settings.drift"
            @update:model-value="value => updateProp('drift', value)"
          />
          <PreviewSlider
            title="Hover Zoom"
            :min="0"
            :max="0.3"
            :step="0.01"
            :model-value="settings.hoverZoom"
            @update:model-value="value => updateProp('hoverZoom', value)"
          />
          <PreviewSwitch
            title="Spotlight"
            :model-value="settings.spotlight"
            @update:model-value="value => updateProp('spotlight', value)"
          />
          <PreviewSlider
            title="Spotlight Radius"
            :min="60"
            :max="400"
            :step="10"
            value-unit="px"
            :is-disabled="!settings.spotlight"
            :model-value="settings.spotlightRadius"
            @update:model-value="value => updateProp('spotlightRadius', value)"
          />
          <PreviewSelect
            title="Text"
            :options="TEXT_OPTIONS"
            :model-value="settings.text"
            @update:model-value="value => updateProp('text', String(value))"
          />
          <PreviewSelect
            title="Media"
            :options="MEDIA_OPTIONS"
            :model-value="settings.mediaType"
            @update:model-value="value => updateProp('mediaType', value as MediaType)"
          />
          <PreviewSelect
            title="Align"
            :options="ALIGN_OPTIONS"
            :model-value="settings.align"
            @update:model-value="value => updateProp('align', value as Align)"
          />
          <PreviewSlider
            title="Fill Scale"
            :min="1"
            :max="2"
            :step="0.05"
            :model-value="settings.fillScale"
            @update:model-value="value => updateProp('fillScale', value)"
          />
          <PreviewSlider
            title="Brightness"
            :min="0.4"
            :max="2"
            :step="0.05"
            :model-value="settings.brightness"
            @update:model-value="value => updateProp('brightness', value)"
          />
          <PreviewSlider
            title="Saturation"
            :min="0"
            :max="2"
            :step="0.05"
            :model-value="settings.saturation"
            @update:model-value="value => updateProp('saturation', value)"
          />
          <PreviewSlider
            title="Text Size"
            :min="0.05"
            :max="0.15"
            :step="0.005"
            :model-value="settings.textScale"
            @update:model-value="value => updateProp('textScale', value)"
          />
          <PreviewSlider
            title="Weight"
            :min="300"
            :max="900"
            :step="100"
            :model-value="settings.weight"
            @update:model-value="value => updateProp('weight', value)"
          />
          <PreviewSlider
            title="Tracking"
            :min="-0.08"
            :max="0.06"
            :step="0.005"
            value-unit="em"
            :model-value="settings.tracking"
            @update:model-value="value => updateProp('tracking', value)"
          />
          <PreviewSlider
            title="Line Height"
            :min="0.85"
            :max="1.6"
            :step="0.02"
            :model-value="settings.lineHeight"
            @update:model-value="value => updateProp('lineHeight', value)"
          />
          <PreviewSlider
            title="Outline Width"
            :min="0.5"
            :max="4"
            :step="0.25"
            value-unit="px"
            :is-disabled="!settings.outline"
            :model-value="settings.outlineWidth"
            @update:model-value="value => updateProp('outlineWidth', value)"
          />
          <PreviewSwitch
            title="Tint"
            :model-value="props.tinted"
            @update:model-value="value => updateProp('tinted', value)"
          />
          <PreviewSwitch
            title="Grayscale"
            :model-value="settings.grayscale"
            @update:model-value="value => updateProp('grayscale', value)"
          />
          <PreviewSwitch
            title="Outline"
            :model-value="settings.outline"
            @update:model-value="value => updateProp('outline', value)"
          />
        </Customize>

        <PropTable :data="propData" />
        <Dependencies :dependency-list="['gsap']" />
      </template>

      <template #code>
        <CodeExample :code-object="maskedHeading" component-name="MaskedHeading" />
      </template>
    </TabsLayout>
  </ComponentPropsProvider>
</template>

<script setup lang="ts">
import { computed } from 'vue';
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
import { useColorModeValue } from '@/composables/useTheme';
import { maskedHeading } from '@/constants/code/TextAnimations/maskedHeadingCode';
import MaskedHeading, { type Reveal, type Trigger } from '@/content/TextAnimations/MaskedHeading/MaskedHeading.vue';

type Align = 'left' | 'center' | 'right';
type MediaType = 'image' | 'video';

const DEMO_IMAGE = 'https://images.unsplash.com/photo-1500673587002-1d2548cfba1b?q=80&w=1600&auto=format&fit=crop';
const DEMO_VIDEO = '/assets/videos/masked-heading.mp4';

const LOOK = {
  tinted: false,
  tintColor: '#ff5a36',
  outlineColor: '',
  text: 'Designed in the details',
  mediaType: 'video' as MediaType,
  reveal: 'scale' as Reveal,
  duration: 1.1,
  stagger: 0.09,
  parallax: 26,
  drift: 18,
  hoverZoom: 0,
  spotlight: false,
  spotlightRadius: 180,
  align: 'center' as Align,
  fillScale: 1.25,
  brightness: 1,
  saturation: 1,
  grayscale: false,
  outline: false,
  outlineWidth: 1,
  weight: 700,
  tracking: -0.03,
  lineHeight: 1.06,
  textScale: 0.115
};

type Look = typeof LOOK;

const PRESETS: Record<string, Look> = {
  cinema: { ...LOOK },
  spotlight: {
    ...LOOK,
    text: 'Shot on location',
    mediaType: 'image',
    reveal: 'rise',
    drift: 10,
    hoverZoom: 0.06,
    spotlight: true,
    spotlightRadius: 200,
    saturation: 1.15,
    weight: 800,
    tracking: -0.04
  },
  stencil: {
    ...LOOK,
    text: 'Made for the web',
    mediaType: 'image',
    reveal: 'wipe',
    duration: 1.6,
    parallax: 60,
    align: 'left',
    fillScale: 1.5,
    brightness: 1.1,
    grayscale: true,
    outline: true,
    outlineWidth: 1.5,
    weight: 900,
    tracking: -0.05,
    lineHeight: 0.92,
    textScale: 0.14
  },
  duotone: {
    ...LOOK,
    tinted: true,
    reveal: 'blur',
    duration: 1.4,
    drift: 30,
    brightness: 1.1,
    tracking: -0.02
  }
};

const PRESET_OPTIONS = [
  { value: 'cinema', label: 'Cinema' },
  { value: 'spotlight', label: 'Spotlight' },
  { value: 'stencil', label: 'Stencil' },
  { value: 'duotone', label: 'Duotone' }
];

const DEFAULT_PROPS = {
  preset: 'cinema',
  trigger: 'view' as Trigger,
  ...LOOK
};

const REVEAL_OPTIONS = [
  { label: 'Rise', value: 'rise' },
  { label: 'Scale', value: 'scale' },
  { label: 'Blur', value: 'blur' },
  { label: 'Wipe', value: 'wipe' },
  { label: 'Fade', value: 'fade' },
  { label: 'None', value: 'none' }
];

const TRIGGER_OPTIONS = [
  { label: 'In View', value: 'view' },
  { label: 'On Mount', value: 'mount' },
  { label: 'On Hover', value: 'hover' }
];

const TEXT_OPTIONS = [
  { label: 'Details', value: 'Designed in the details' },
  { label: 'Web', value: 'Made for the web' },
  { label: 'Location', value: 'Shot on location' }
];

const MEDIA_OPTIONS = [
  { label: 'Video', value: 'video' },
  { label: 'Image', value: 'image' }
];

const ALIGN_OPTIONS = [
  { label: 'Center', value: 'center' },
  { label: 'Left', value: 'left' },
  { label: 'Right', value: 'right' }
];

const propData: PropRow[] = [
  { name: 'text', type: 'string', default: "'Designed in the details'", description: 'Heading copy.' },
  {
    name: 'tag',
    type: 'string',
    default: "'h2'",
    description: 'Element the heading renders as, so it can carry the right semantics.'
  },
  {
    name: 'mediaType',
    type: '"image" | "video"',
    default: '"image"',
    description:
      'Whether the source showing through the letters is an image or a looping muted video. Videos stay paused for people who prefer reduced motion.'
  },
  { name: 'src', type: 'string', default: "''", description: 'Image or video URL.' },
  { name: 'poster', type: 'string', default: "''", description: 'Poster frame used while a video loads.' },
  {
    name: 'reveal',
    type: '"rise" | "scale" | "blur" | "wipe" | "fade" | "none"',
    default: '"rise"',
    description:
      'Entrance style: words rise into place, letters grow in one after another, the letters draw together while the heading pulls into focus, a wipe sweeps across, or the whole block fades up.'
  },
  {
    name: 'trigger',
    type: '"view" | "mount" | "hover"',
    default: '"view"',
    description: 'When the entrance runs.'
  },
  { name: 'duration', type: 'number', default: '1.1', description: 'Entrance duration, in seconds.' },
  {
    name: 'stagger',
    type: 'number',
    default: '0.09',
    description:
      'Delay between words, in seconds, for the rise reveal. The scale reveal steps letter by letter at about a third of it.'
  },
  {
    name: 'spotlight',
    type: 'boolean',
    default: 'false',
    description:
      'Dims and desaturates the media except for a soft pool of light that eases after the pointer. Without a pointer, the light wanders slowly across the letters.'
  },
  {
    name: 'spotlightRadius',
    type: 'number',
    default: '160',
    description: 'Radius of the spotlight, in px.'
  },
  {
    name: 'outline',
    type: 'boolean',
    default: 'false',
    description:
      'Draws a thin stroke around every letter. It is visible before the entrance, so the media fills the outlines as it arrives.'
  },
  {
    name: 'outlineColor',
    type: 'string',
    default: "''",
    description: 'Color of the outline. Leave empty to follow the surrounding text color.'
  },
  { name: 'outlineWidth', type: 'number', default: '1', description: 'Thickness of the outline, in px.' },
  {
    name: 'fillScale',
    type: 'number',
    default: '1.25',
    description: 'How far the media is zoomed past the heading. The overscan is what parallax travels into.'
  },
  {
    name: 'parallax',
    type: 'number',
    default: '26',
    description: 'How far the media slides under the letters as the pointer moves, in px.'
  },
  {
    name: 'drift',
    type: 'number',
    default: '18',
    description: 'Amplitude of the slow idle motion, in px. 0 holds the media still.'
  },
  {
    name: 'hoverZoom',
    type: 'number',
    default: '0',
    description: 'Extra zoom the media eases into while the pointer is over the heading. 0.1 is 10% closer.'
  },
  { name: 'brightness', type: 'number', default: '1', description: 'Brightness of the media.' },
  { name: 'saturation', type: 'number', default: '1', description: 'Saturation of the media.' },
  { name: 'grayscale', type: 'boolean', default: 'false', description: 'Render the media in black and white.' },
  {
    name: 'tint',
    type: 'string',
    default: "''",
    description:
      'Colorizes the media in one color while keeping its light and shadow, like a duotone print. Leave empty for the original colors.'
  },
  { name: 'align', type: '"left" | "center" | "right"', default: '"center"', description: 'Text alignment.' },
  { name: 'weight', type: 'number', default: '700', description: 'Font weight.' },
  { name: 'tracking', type: 'number', default: '-0.03', description: 'Letter spacing, in em.' },
  { name: 'lineHeight', type: 'number', default: '1.06', description: 'Line height.' },
  {
    name: 'textScale',
    type: 'number',
    default: '0.115',
    description: 'Type size as a fraction of the container width, so the heading stays responsive.'
  },
  { name: 'className', type: 'string', default: "''", description: 'Additional class names.' },
  { name: 'style', type: 'CSSProperties', default: '-', description: 'Inline styles for the heading.' }
];

const { props, defaultProps, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);
const ink = useColorModeValue('#161816', '#ffffff');

const settings = computed(() => {
  const { preset: _preset, tinted: _tinted, tintColor: _tintColor, outlineColor: _outlineColor, ...rest } = props.value;
  return rest;
});

const computedProps = computed(() => ({
  ...(props.value.tinted ? { tint: props.value.tintColor } : {}),
  ...(props.value.outlineColor ? { outlineColor: props.value.outlineColor } : {})
}));

const replayKey = computed(() =>
  [
    props.value.preset,
    settings.value.text,
    settings.value.mediaType,
    settings.value.reveal,
    settings.value.trigger,
    settings.value.duration,
    settings.value.stagger
  ].join('-')
);

const applyPreset = (value: string) => {
  const base = Object.fromEntries(
    (Object.keys(LOOK) as (keyof Look)[]).map(name => [name, defaultProps.value[name]])
  ) as Partial<typeof DEFAULT_PROPS>;
  updateProps({ ...base, ...PRESETS[value], preset: value });
};
</script>
