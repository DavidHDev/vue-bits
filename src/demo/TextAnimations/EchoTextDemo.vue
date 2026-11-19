<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
    :demo-only-props="['preset', 'textColor', 'palette', 'rampFront', 'rampBack']"
    :computed-props="computedProps"
  >
    <TabsLayout>
      <template #preview>
        <div
          class="demo-container echo-text-demo relative flex items-center justify-center overflow-hidden"
          style="min-height: 430px"
        >
          <RefreshButton @click="forceRerender" />
          <EchoText
            :key="rerenderKey"
            v-bind="settings"
            :tint="computedProps.tint"
            :echo-colors="computedProps.echoColors"
            :color="props.textColor || 'currentColor'"
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
            title="Text Color"
            :color="props.textColor || ink"
            @change="value => updateProp('textColor', value)"
          />
          <PreviewSelect
            title="Echo Colors"
            :options="PALETTE_OPTIONS"
            :model-value="props.palette"
            @update:model-value="value => updateProp('palette', value as Palette)"
          />
          <PreviewColorPickerCustom
            title="Echo Tint"
            :color="props.tint"
            @change="value => updateProps({ tint: value, palette: 'tint' })"
          />
          <PreviewColorPickerCustom
            title="Ramp Front"
            :color="props.rampFront || ink"
            @change="value => updateProps({ rampFront: value, palette: 'ramp' })"
          />
          <PreviewColorPickerCustom
            title="Ramp Back"
            :color="props.rampBack"
            @change="value => updateProps({ rampBack: value, palette: 'ramp' })"
          />

          <PreviewSelect
            title="Trail"
            :options="TRAIL_OPTIONS"
            :model-value="settings.trail"
            @update:model-value="value => updateProp('trail', value as Trail)"
          />
          <PreviewSelect
            title="Mode"
            :options="MODE_OPTIONS"
            :model-value="settings.mode"
            @update:model-value="value => updateAndReplay('mode', value as Mode)"
          />
          <PreviewSelect
            title="Direction"
            :options="DIRECTION_OPTIONS"
            :model-value="settings.direction"
            @update:model-value="value => updateAndReplay('direction', value as Direction)"
          />
          <PreviewSelect
            title="Ease"
            :options="EASE_OPTIONS"
            :model-value="settings.ease"
            @update:model-value="value => updateAndReplay('ease', value as Ease)"
          />
          <PreviewSwitch
            title="Click Burst"
            :model-value="settings.clickBurst"
            @update:model-value="value => updateProp('clickBurst', value)"
          />
          <PreviewSlider
            title="Echoes"
            :min="2"
            :max="18"
            :step="1"
            :model-value="settings.echoes"
            @update:model-value="value => updateProp('echoes', value)"
          />
          <PreviewSlider
            title="Lag"
            :min="0.05"
            :max="0.3"
            :step="0.01"
            :model-value="settings.lag"
            @update:model-value="value => updateProp('lag', value)"
          />
          <PreviewSlider
            title="Offset"
            :min="8"
            :max="56"
            :step="1"
            value-unit="px"
            :model-value="settings.offset"
            @update:model-value="value => updateProp('offset', value)"
          />
          <PreviewSlider
            title="Duration"
            :min="300"
            :max="1600"
            :step="50"
            value-unit="ms"
            :model-value="settings.duration"
            @update:model-value="value => updateAndReplay('duration', value)"
          />
          <PreviewSlider
            title="Cursor Radius"
            :min="80"
            :max="900"
            :step="10"
            value-unit="px"
            :is-disabled="settings.mode === 'entrance' || settings.trail === 'scroll'"
            :model-value="settings.cursorRadius"
            @update:model-value="value => updateProp('cursorRadius', value)"
          />

          <PreviewInput
            title="Text"
            :max-length="24"
            :model-value="settings.text"
            @update:model-value="value => updateProp('text', value)"
          />
          <PreviewSelect
            title="Echo Style"
            :options="STYLE_OPTIONS"
            :model-value="settings.echoStyle"
            @update:model-value="value => updateProp('echoStyle', value as EchoStyle)"
          />
          <PreviewSelect
            title="Size"
            :options="FONT_SIZE_OPTIONS"
            :model-value="settings.fontSize"
            @update:model-value="value => updateProp('fontSize', String(value))"
          />
          <PreviewSlider
            title="Fade"
            :min="0.35"
            :max="0.85"
            :step="0.01"
            :model-value="settings.fade"
            @update:model-value="value => updateProp('fade', value)"
          />
          <PreviewSlider
            title="Blur"
            :min="0"
            :max="7"
            :step="0.25"
            value-unit="px"
            :model-value="settings.blur"
            @update:model-value="value => updateProp('blur', value)"
          />
          <PreviewSlider
            title="Echo Scale"
            :min="0.5"
            :max="1.6"
            :step="0.05"
            :model-value="settings.echoScale"
            @update:model-value="value => updateProp('echoScale', value)"
          />
          <PreviewSlider
            title="Weight"
            :min="500"
            :max="950"
            :step="50"
            :model-value="settings.fontWeight"
            @update:model-value="value => updateProp('fontWeight', value)"
          />
        </Customize>

        <PropTable :data="propData" />
        <Dependencies :dependency-list="[]" />
      </template>

      <template #code>
        <CodeExample :code-object="echoText" component-name="EchoText" />
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
import { echoText } from '@/constants/code/TextAnimations/echoTextCode';
import EchoText, {
  type Direction,
  type Ease,
  type EchoStyle,
  type Mode,
  type Trail
} from '@/content/TextAnimations/EchoText/EchoText.vue';

type Palette = 'tint' | 'ramp' | 'plain';

type Look = {
  palette: Palette;
  tint: string;
  rampFront: string;
  rampBack: string;
  trail: Trail;
  clickBurst: boolean;
  echoes: number;
  lag: number;
  offset: number;
  direction: Direction;
  fade: number;
  blur: number;
  echoStyle: EchoStyle;
  echoScale: number;
  duration: number;
  ease: Ease;
};

const LOOK: Look = {
  palette: 'tint',
  tint: '#7dd3fc',
  rampFront: '',
  rampBack: '#ff7a45',
  trail: 'pointer',
  clickBurst: true,
  echoes: 12,
  lag: 0.24,
  offset: 36,
  direction: 'right',
  fade: 0.72,
  blur: 3,
  echoStyle: 'solid',
  echoScale: 1,
  duration: 900,
  ease: 'ease-out'
};

const PRESETS: Record<string, Look> = {
  ghost: { ...LOOK },
  orbit: {
    ...LOOK,
    palette: 'ramp',
    trail: 'auto',
    echoes: 10,
    lag: 0.2,
    offset: 44,
    direction: 'diagonal',
    fade: 0.84,
    blur: 0,
    echoStyle: 'outline',
    duration: 1100,
    ease: 'snappy'
  },
  wake: {
    ...LOOK,
    palette: 'ramp',
    rampBack: '#3ddc97',
    trail: 'scroll',
    echoes: 16,
    lag: 0.3,
    offset: 24,
    direction: 'down',
    fade: 0.82,
    blur: 5,
    duration: 1200,
    ease: 'ease-in-out'
  },
  zoom: {
    ...LOOK,
    palette: 'ramp',
    rampBack: '#5b8cff',
    trail: 'auto',
    echoes: 7,
    lag: 0.2,
    offset: 30,
    direction: 'up',
    fade: 0.75,
    blur: 0,
    echoScale: 1.4,
    duration: 1000
  }
};

const DEFAULT_PROPS = {
  preset: 'ghost',
  text: 'Motion Echo',
  ...LOOK,
  mode: 'both' as Mode,
  cursorRadius: 320,
  fontSize: 'clamp(3rem, 9vw, 7rem)',
  fontWeight: 800,
  textColor: ''
};

const PRESET_OPTIONS = [
  { value: 'ghost', label: 'Ghost' },
  { value: 'orbit', label: 'Orbit' },
  { value: 'wake', label: 'Wake' },
  { value: 'zoom', label: 'Zoom' }
];

const PALETTE_OPTIONS = [
  { value: 'tint', label: 'Tint' },
  { value: 'ramp', label: 'Ramp' },
  { value: 'plain', label: 'Plain' }
];

const TRAIL_OPTIONS = [
  { value: 'pointer', label: 'Pointer' },
  { value: 'auto', label: 'Auto' },
  { value: 'scroll', label: 'Scroll' }
];

const DIRECTION_OPTIONS = [
  { value: 'right', label: 'Right' },
  { value: 'left', label: 'Left' },
  { value: 'up', label: 'Up' },
  { value: 'down', label: 'Down' },
  { value: 'diagonal', label: 'Diagonal' }
];

const MODE_OPTIONS = [
  { value: 'both', label: 'Entrance + Trail' },
  { value: 'entrance', label: 'Entrance Only' },
  { value: 'pointer', label: 'Trail Only' }
];

const STYLE_OPTIONS = [
  { value: 'solid', label: 'Solid' },
  { value: 'outline', label: 'Outline' }
];

const EASE_OPTIONS = [
  { value: 'ease-out', label: 'Ease Out' },
  { value: 'ease-in-out', label: 'Ease In Out' },
  { value: 'snappy', label: 'Snappy' },
  { value: 'linear', label: 'Linear' }
];

const FONT_SIZE_OPTIONS = [
  { value: 'clamp(2.5rem, 7vw, 5.5rem)', label: 'Compact' },
  { value: 'clamp(3rem, 9vw, 7rem)', label: 'Hero' },
  { value: 'clamp(4rem, 12vw, 9rem)', label: 'Billboard' }
];

const propData: PropRow[] = [
  {
    name: 'text',
    type: 'string',
    default: '"Motion Echo"',
    description: 'Text rendered by the crisp front copy and every echo.'
  },
  {
    name: 'echoes',
    type: 'number',
    default: '12',
    description: 'Number of ghost copies behind the front text, up to 24.'
  },
  {
    name: 'lag',
    type: 'number',
    default: '0.24',
    description: 'How slowly deeper echoes catch up with the text, and how far apart they spread along the auto trail.'
  },
  {
    name: 'offset',
    type: 'number',
    default: '36',
    description:
      'How far the echoes spread on entrance, how far the text leans toward the cursor and how wide the drift and click burst reach, in px.'
  },
  {
    name: 'direction',
    type: '"right" | "left" | "up" | "down" | "diagonal"',
    default: '"right"',
    description: 'Direction the entrance trail settles in from.'
  },
  {
    name: 'fade',
    type: 'number',
    default: '0.72',
    description: 'How much of its opacity each echo keeps from the one in front of it.'
  },
  {
    name: 'blur',
    type: 'number',
    default: '3',
    description: 'Blur on the deepest echo, in px. Echoes in between blur less.'
  },
  {
    name: 'tint',
    type: 'string | false',
    default: '"#7dd3fc"',
    description: 'Color blended into the echoes, stronger toward the back. Pass false for plain echoes.'
  },
  {
    name: 'echoColors',
    type: '[string, string]',
    default: 'undefined',
    description:
      'Two colors the echoes fade between, from the echo nearest the text to the deepest one. Replaces the tint when set.'
  },
  {
    name: 'echoStyle',
    type: '"solid" | "outline"',
    default: '"solid"',
    description: 'Draws the echoes as filled text or as thin outlines.'
  },
  {
    name: 'echoScale',
    type: 'number',
    default: '1',
    description: 'Size of the deepest echo relative to the text. Below 1 the trail recedes, above 1 it looms.'
  },
  {
    name: 'mode',
    type: '"entrance" | "pointer" | "both"',
    default: '"both"',
    description:
      'Whether the echoes play on entrance, run the live trail, or both. "pointer" means trail only, whatever drives it.'
  },
  {
    name: 'trail',
    type: '"pointer" | "auto" | "scroll"',
    default: '"pointer"',
    description:
      'What drives the live trail. Pointer follows the cursor, auto drifts the echoes on a slow figure-eight whenever the cursor is away, scroll stretches them behind the text as the page scrolls.'
  },
  {
    name: 'clickBurst',
    type: 'boolean',
    default: 'true',
    description: 'Clicking the text releases a burst of echoes that expand from the click point and fade.'
  },
  {
    name: 'cursorRadius',
    type: 'number',
    default: '320',
    description:
      'Distance in px over which the cursor pulls the text to full offset. With the auto trail, the drift resumes once the cursor leaves this radius.'
  },
  {
    name: 'duration',
    type: 'number',
    default: '900',
    description: 'How long the entrance takes to settle, in ms.'
  },
  {
    name: 'ease',
    type: '"linear" | "ease-out" | "ease-in-out" | "snappy"',
    default: '"ease-out"',
    description: 'Timing curve of the entrance.'
  },
  {
    name: 'fontSize',
    type: 'string | number',
    default: '"clamp(3rem, 9vw, 7rem)"',
    description: 'Font size of the text.'
  },
  {
    name: 'fontWeight',
    type: 'string | number',
    default: '800',
    description: 'Font weight of the text.'
  },
  {
    name: 'color',
    type: 'string',
    default: '"currentColor"',
    description: 'Color of the front copy. Follows the surrounding text color by default.'
  },
  {
    name: 'className',
    type: 'string',
    default: '""',
    description: 'Extra class names for the root element.'
  },
  {
    name: 'style',
    type: 'CSSProperties',
    default: 'undefined',
    description: 'Inline styles for the root element.'
  }
];

const { rerenderKey, forceRerender } = useForceRerender();
const { props, defaultProps, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);
const ink = useColorModeValue('#161816', '#ffffff');

const DEMO_KEYS = ['preset', 'textColor', 'palette', 'tint', 'rampFront', 'rampBack'] as const;
type ComponentSettings = Omit<typeof DEFAULT_PROPS, (typeof DEMO_KEYS)[number]>;

const settings = computed(
  () =>
    Object.fromEntries(
      Object.entries(props.value).filter(([name]) => !(DEMO_KEYS as readonly string[]).includes(name))
    ) as ComponentSettings
);

const computedProps = computed<{ tint: string | false; echoColors?: [string, string]; color?: string }>(() => {
  const { palette, tint, rampFront, rampBack, textColor } = props.value;
  return {
    tint: palette === 'tint' ? tint : false,
    ...(palette === 'ramp' ? { echoColors: [rampFront || 'currentColor', rampBack] as [string, string] } : {}),
    ...(textColor ? { color: textColor } : {})
  };
});

const applyPreset = (value: string) => {
  const base = Object.fromEntries(
    (Object.keys(LOOK) as (keyof Look)[]).map(name => [name, defaultProps.value[name]])
  ) as Partial<Look>;
  updateProps({ ...base, ...PRESETS[value], preset: value });
  forceRerender();
};

const updateAndReplay = <K extends keyof typeof DEFAULT_PROPS>(name: K, value: (typeof DEFAULT_PROPS)[K]) => {
  updateProp(name, value);
  forceRerender();
};
</script>

<style scoped>
.echo-text-demo {
  padding-left: 24px;
  padding-right: 24px;
}

@media (min-width: 768px) {
  .echo-text-demo {
    padding-left: 56px;
    padding-right: 56px;
  }
}
</style>
