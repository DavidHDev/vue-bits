<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
    :demo-only-props="['demo', 'preset', 'fillColor', 'icons']"
    :computed-props="computedProps"
  >
    <TabsLayout>
      <template #preview>
        <div class="demo-container relative overflow-hidden" style="height: 500px; padding: 0">
          <div class="esd-scene" :data-theme="theme">
            <div v-if="props.demo === 'player'" class="esd-card esd-player">
              <img class="esd-player__art" :src="PHOTOS[theme]" alt="" draggable="false" />
              <div class="esd-player__meta">
                <strong>Cirrus</strong>
                <span>Open Skies</span>
              </div>

              <div class="esd-player__seek">
                <ElasticSlider
                  v-bind="line"
                  :value="position"
                  :max-value="SONG"
                  :on-change="onSeek"
                  :on-change-end="onSeekEnd"
                  :left-icon="null"
                  :right-icon="null"
                  :format-value="clock"
                  aria-label="Seek"
                />
                <div class="esd-player__times">
                  <span>{{ clock(position) }}</span>
                  <span>−{{ clock(SONG - position) }}</span>
                </div>
              </div>

              <div class="esd-player__transport">
                <button type="button" class="esd-icon-button" aria-label="Previous" @click="position = 0">
                  <HugeiconsIcon :icon="PreviousIcon" :size="22" :stroke-width="1.75" />
                </button>
                <button
                  type="button"
                  class="esd-icon-button esd-icon-button--raised"
                  :aria-label="playing ? 'Pause' : 'Play'"
                  @click="togglePlay"
                >
                  <HugeiconsIcon :icon="playing ? PauseIcon : PlayIcon" :size="24" :stroke-width="1.75" />
                </button>
                <button type="button" class="esd-icon-button" aria-label="Next" @click="position = 0">
                  <HugeiconsIcon :icon="NextIcon" :size="22" :stroke-width="1.75" />
                </button>
              </div>

              <div class="esd-player__volume">
                <ElasticSlider
                  v-bind="line"
                  :value="playerVolume"
                  :on-change="(value: number) => (playerVolume = value)"
                  :left-icon="glyph(VolumeLowIcon, 18)"
                  :right-icon="glyph(VolumeHighIcon, 18)"
                  aria-label="Volume"
                />
              </div>
            </div>

            <div v-else-if="props.demo === 'control'" class="esd-cc">
              <div class="esd-cc__module">
                <button
                  v-for="toggle in TOGGLES"
                  :key="toggle.id"
                  type="button"
                  class="esd-cc__toggle"
                  :aria-label="toggle.label"
                  :aria-pressed="toggles[toggle.id]"
                  :data-on="toggles[toggle.id] ? '' : undefined"
                  @click="toggles[toggle.id] = !toggles[toggle.id]"
                >
                  <HugeiconsIcon :icon="toggle.icon" :size="24" :stroke-width="1.75" />
                </button>
              </div>
              <ElasticSlider
                v-bind="pill"
                :value="brightness"
                :on-change="(value: number) => (brightness = value)"
                :left-icon="glyph(Sun03Icon, 26)"
                aria-label="Brightness"
              />
              <ElasticSlider
                v-bind="pill"
                :value="ccVolume"
                :on-change="(value: number) => (ccVolume = value)"
                :left-icon="glyph(volumeIcon, 26)"
                aria-label="Volume"
              />
            </div>

            <div v-else-if="props.demo === 'editor'" class="esd-card esd-editor">
              <div class="esd-editor__head">
                <strong>Adjust</strong>
                <button type="button" class="esd-editor__reset" :disabled="!editorChanged" @click="resetEditor">
                  Reset
                </button>
              </div>
              <div class="esd-editor__photo">
                <img
                  :src="PHOTOS[theme]"
                  alt=""
                  draggable="false"
                  :style="{
                    filter: `brightness(${(1 + exposure / 220).toFixed(3)}) saturate(${(1 + warmth / 500).toFixed(3)})`,
                    transform: `rotate(${angle}deg) scale(${cover.toFixed(4)})`
                  }"
                />
                <span
                  class="esd-editor__tint"
                  :style="{
                    background: warmth >= 0 ? '#ff8a2a' : '#2a7dff',
                    opacity: ((Math.abs(warmth) / 100) * 0.7).toFixed(3)
                  }"
                />
              </div>
              <div class="esd-editor__rows">
                <div>
                  <div class="esd-editor__row-head">
                    <span style="color: inherit">Exposure</span>
                    <span>{{ signed(exposure) }}</span>
                  </div>
                  <ElasticSlider
                    v-bind="adjust"
                    :value="exposure"
                    :on-change="(value: number) => (exposure = value)"
                    :format-value="signed"
                    aria-label="Exposure"
                  />
                </div>
                <div>
                  <div class="esd-editor__row-head">
                    <span style="color: inherit">Warmth</span>
                    <span>{{ signed(warmth) }}</span>
                  </div>
                  <ElasticSlider
                    v-bind="adjust"
                    :value="warmth"
                    :on-change="(value: number) => (warmth = value)"
                    :format-value="signed"
                    aria-label="Warmth"
                  />
                </div>
                <div>
                  <div class="esd-editor__row-head">
                    <span style="color: inherit">Straighten</span>
                    <span>{{ `${signed(angle)}°` }}</span>
                  </div>
                  <ElasticSlider
                    v-bind="adjust"
                    :value="angle"
                    :on-change="(value: number) => (angle = value)"
                    :starting-value="-10"
                    :max-value="10"
                    is-stepped
                    :step-size="1"
                    ticks
                    :format-value="(value: number) => `${signed(value)}°`"
                    aria-label="Straighten"
                  />
                </div>
              </div>
            </div>

            <ElasticSlider
              v-else-if="basic"
              v-bind="settings"
              :style="settings.orientation === 'vertical' ? { height: '240px' } : { width: 'min(100%, 300px)' }"
              :left-icon="basicSet ? glyph(basicSet[0], basicIconSize) : null"
              :right-icon="basicSet ? glyph(basicSet[1], basicIconSize) : null"
              :range-color="props.fillColor || undefined"
              aria-label="Slider"
            />
          </div>
        </div>

        <Customize>
          <PreviewSelect
            title="Demo"
            :options="DEMO_OPTIONS"
            :model-value="props.demo"
            @update:model-value="value => updateProp('demo', value as string)"
          />
          <PreviewSelect
            title="Preset"
            :options="PRESET_OPTIONS"
            :model-value="props.preset"
            :is-disabled="!basic"
            @update:model-value="value => applyPreset(value as PresetName)"
          />
          <PreviewColorPickerCustom
            title="Fill Color"
            :color="props.fillColor || ink"
            @change="value => updateProp('fillColor', value)"
          />
          <PreviewSlider
            title="Max Stretch"
            :min="0"
            :max="120"
            :step="1"
            value-unit="px"
            :model-value="props.maxStretch"
            @update:model-value="value => updateProp('maxStretch', value)"
          />
          <PreviewSlider
            title="Bounce"
            :min="0"
            :max="0.95"
            :step="0.05"
            :model-value="props.bounce"
            @update:model-value="value => updateProp('bounce', value)"
          />
          <PreviewSelect
            title="Orientation"
            :options="ORIENTATION_OPTIONS"
            :model-value="props.orientation"
            :is-disabled="!basic"
            @update:model-value="value => updateProp('orientation', value as Orientation)"
          />
          <PreviewSelect
            title="Icons"
            :options="ICON_OPTIONS"
            :model-value="props.icons"
            :is-disabled="!basic"
            @update:model-value="value => updateProp('icons', value as string)"
          />
          <PreviewSelect
            title="Icon Placement"
            :options="PLACEMENT_OPTIONS"
            :model-value="props.iconPlacement"
            :is-disabled="!basic || props.icons === 'none'"
            @update:model-value="value => fitInside('iconPlacement', value as string)"
          />
          <PreviewSelect
            title="Value"
            :options="VALUE_OPTIONS"
            :model-value="props.valuePosition"
            :is-disabled="!basic"
            @update:model-value="value => fitInside('valuePosition', value as string)"
          />
          <PreviewSlider
            title="Thickness"
            :min="2"
            :max="80"
            :step="1"
            value-unit="px"
            :is-disabled="!basic"
            :model-value="props.thickness"
            @update:model-value="value => updateProp('thickness', value)"
          />
          <PreviewSlider
            title="Active Thickness"
            :min="2"
            :max="84"
            :step="1"
            value-unit="px"
            :is-disabled="!basic"
            :model-value="props.activeThickness"
            @update:model-value="value => updateProp('activeThickness', value)"
          />
          <PreviewSlider
            title="Radius"
            :min="0"
            :max="40"
            :step="1"
            :display-value="(value: number) => (value >= 40 ? 'Full' : `${value}px`)"
            :is-disabled="!basic"
            :model-value="props.radius"
            @update:model-value="value => updateProp('radius', value)"
          />
          <PreviewSlider
            title="Rest Opacity"
            :min="0.2"
            :max="1"
            :step="0.05"
            :is-disabled="!basic"
            :model-value="props.restOpacity"
            @update:model-value="value => updateProp('restOpacity', value)"
          />
          <PreviewSlider
            title="Fill From"
            :min="0"
            :max="100"
            :step="1"
            :is-disabled="!basic"
            :model-value="props.fillFrom"
            @update:model-value="value => updateProp('fillFrom', value)"
          />
          <PreviewSlider
            title="Step Size"
            :min="1"
            :max="25"
            :step="1"
            :is-disabled="!basic || !props.isStepped"
            :model-value="props.stepSize"
            @update:model-value="value => updateProp('stepSize', value)"
          />
          <PreviewSwitch
            title="Stepped"
            :is-disabled="!basic"
            :model-value="props.isStepped"
            @update:model-value="value => updateProp('isStepped', value)"
          />
          <PreviewSwitch
            title="Ticks"
            :is-disabled="!basic"
            :model-value="props.ticks"
            @update:model-value="value => updateProp('ticks', value)"
          />
          <PreviewSwitch
            title="Thumb"
            :is-disabled="!basic"
            :model-value="props.thumb"
            @update:model-value="value => updateProp('thumb', value)"
          />
          <PreviewSwitch
            title="Grow on Hover"
            :model-value="props.growOnHover"
            @update:model-value="value => updateProp('growOnHover', value)"
          />
          <PreviewSwitch
            title="Jump to Click"
            :is-disabled="!basic"
            :model-value="props.jumpToClick"
            @update:model-value="value => updateProp('jumpToClick', value)"
          />
          <PreviewSwitch
            title="Wheel"
            :model-value="props.wheel"
            @update:model-value="value => updateProp('wheel', value)"
          />
        </Customize>

        <PropTable :data="propData" />
        <Dependencies :dependency-list="['@hugeicons/vue', '@hugeicons/core-free-icons']" />
      </template>

      <template #code>
        <CodeExample :code-object="elasticSlider" component-name="ElasticSlider" />
      </template>
    </TabsLayout>
  </ComponentPropsProvider>
</template>

<script setup lang="ts">
import { computed, h, onBeforeUnmount, reactive, ref, watch, type CSSProperties } from 'vue';
import { HugeiconsIcon, type IconArray } from '@hugeicons/vue';
import {
  AirplaneModeIcon,
  BluetoothIcon,
  Moon02Icon,
  NextIcon,
  PauseIcon,
  PlayIcon,
  PreviousIcon,
  Sun03Icon,
  SunDimIcon,
  VolumeHighIcon,
  VolumeLowIcon,
  VolumeMute02Icon,
  Wifi01Icon
} from '@hugeicons/core-free-icons';
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
import { elasticSlider } from '@/constants/code/Components/elasticSliderCode';
import ElasticSlider from '@/content/Components/ElasticSlider/ElasticSlider.vue';

type Orientation = 'horizontal' | 'vertical';
type PresetName = 'line' | 'pill' | 'vertical' | 'stepped';
type ToggleId = 'wifi' | 'bluetooth' | 'airplane' | 'focus';

const SONG = 217;

const PHOTOS = {
  light: '/assets/demo/day-sky.webp',
  dark: '/assets/demo/night-sky.webp'
};

const TOGGLES: { id: ToggleId; label: string; icon: unknown }[] = [
  { id: 'wifi', label: 'Wi-Fi', icon: Wifi01Icon },
  { id: 'bluetooth', label: 'Bluetooth', icon: BluetoothIcon },
  { id: 'airplane', label: 'Airplane Mode', icon: AirplaneModeIcon },
  { id: 'focus', label: 'Do Not Disturb', icon: Moon02Icon }
];

const ICON_SETS: Record<string, unknown[]> = {
  volume: [VolumeLowIcon, VolumeHighIcon],
  brightness: [SunDimIcon, Sun03Icon]
};

const clock = (seconds: number) => {
  const whole = Math.max(0, Math.floor(seconds));
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, '0')}`;
};

const signed = (value: number) => {
  const rounded = Math.round(value);
  return rounded > 0 ? `+${rounded}` : rounded < 0 ? `−${-rounded}` : '0';
};

const glyph = (icon: unknown, size: number) => h(HugeiconsIcon, { icon: icon as IconArray, size, strokeWidth: 1.75 });

const LOOK = {
  orientation: 'horizontal' as Orientation,
  icons: 'volume',
  iconPlacement: 'outside',
  valuePosition: 'top',
  thickness: 6,
  activeThickness: 12,
  radius: 40,
  restOpacity: 0.7,
  fillFrom: 0,
  isStepped: false,
  stepSize: 10,
  ticks: false,
  thumb: false,
  jumpToClick: true
};

type Look = typeof LOOK;

const PRESETS: Record<PresetName, Partial<Look>> = {
  line: {},
  pill: {
    icons: 'brightness',
    iconPlacement: 'inside',
    valuePosition: 'inside',
    thickness: 44,
    activeThickness: 48,
    radius: 14,
    restOpacity: 1
  },
  vertical: {
    orientation: 'vertical',
    iconPlacement: 'inside',
    valuePosition: 'none',
    thickness: 64,
    activeThickness: 68,
    radius: 22,
    restOpacity: 1,
    jumpToClick: false
  },
  stepped: {
    icons: 'none',
    valuePosition: 'bubble',
    thickness: 6,
    activeThickness: 10,
    restOpacity: 1,
    isStepped: true,
    stepSize: 10,
    ticks: true,
    thumb: true
  }
};

const DEFAULT_PROPS = {
  demo: 'player',
  preset: 'line',
  fillColor: '',
  maxStretch: 50,
  bounce: 0.5,
  growOnHover: true,
  wheel: false,
  ...LOOK
};

const DEMO_OPTIONS = [
  { value: 'player', label: 'Player' },
  { value: 'control', label: 'Control Center' },
  { value: 'editor', label: 'Editor' },
  { value: 'basic', label: 'Basic' }
];

const PRESET_OPTIONS = [
  { value: 'line', label: 'Line' },
  { value: 'pill', label: 'Pill' },
  { value: 'vertical', label: 'Vertical' },
  { value: 'stepped', label: 'Stepped' }
];

const ORIENTATION_OPTIONS = [
  { value: 'horizontal', label: 'Horizontal' },
  { value: 'vertical', label: 'Vertical' }
];

const ICON_OPTIONS = [
  { value: 'volume', label: 'Volume' },
  { value: 'brightness', label: 'Brightness' },
  { value: 'none', label: 'None' }
];

const PLACEMENT_OPTIONS = [
  { value: 'outside', label: 'Outside' },
  { value: 'inside', label: 'Inside' }
];

const VALUE_OPTIONS = [
  { value: 'top', label: 'Top' },
  { value: 'bubble', label: 'Bubble' },
  { value: 'inside', label: 'Inside' },
  { value: 'none', label: 'None' }
];

const propData: PropRow[] = [
  { name: 'value', type: 'number', default: '-', description: 'Controlled value. Pair it with onChange.' },
  { name: 'defaultValue', type: 'number', default: '50', description: 'Starting value when uncontrolled.' },
  { name: 'startingValue', type: 'number', default: '0', description: 'Lowest value of the range.' },
  { name: 'maxValue', type: 'number', default: '100', description: 'Highest value of the range.' },
  { name: 'isStepped', type: 'boolean', default: 'false', description: 'Snaps the value to stepSize increments.' },
  { name: 'stepSize', type: 'number', default: '1', description: 'Size of each step when isStepped is on.' },
  { name: 'onChange', type: '(value: number) => void', default: '-', description: 'Called as the value changes.' },
  {
    name: 'onChangeEnd',
    type: '(value: number) => void',
    default: '-',
    description: 'Called when a drag, key press or scroll finishes.'
  },
  {
    name: 'orientation',
    type: "'horizontal' | 'vertical'",
    default: "'horizontal'",
    description: 'Direction of the track. Vertical sliders fill from the bottom.'
  },
  {
    name: 'leftIcon',
    type: 'VNode | Component | null',
    default: 'volume low icon',
    description: 'Icon at the start of the track. Pass null to hide it.'
  },
  {
    name: 'rightIcon',
    type: 'VNode | Component | null',
    default: 'volume high icon',
    description: 'Icon at the end of the track. Pass null to hide it.'
  },
  {
    name: 'iconPlacement',
    type: "'outside' | 'inside'",
    default: "'outside'",
    description: 'Puts the icons beside the track, or inside it once the track is thick enough to hold them.'
  },
  {
    name: 'valuePosition',
    type: "'top' | 'bubble' | 'inside' | 'none'",
    default: "'top'",
    description: 'Where the value shows. Bubble rides above the fill while the slider is active.'
  },
  {
    name: 'formatValue',
    type: '(value: number) => string',
    default: '-',
    description: 'Formats the shown value and the value read by screen readers.'
  },
  {
    name: 'ticks',
    type: 'boolean | number[]',
    default: 'false',
    description:
      'Marks along the track. True marks every step, or every tenth when not stepped. An array marks those values.'
  },
  { name: 'thumb', type: 'boolean', default: 'false', description: 'Shows a round handle at the end of the fill.' },
  {
    name: 'fillFrom',
    type: 'number',
    default: 'startingValue',
    description: 'Value the fill grows from. Set it to the middle of the range for a centered, two-way fill.'
  },
  { name: 'thickness', type: 'number', default: '6', description: 'Track thickness in px at rest.' },
  {
    name: 'activeThickness',
    type: 'number',
    default: '12',
    description: 'Track thickness in px while hovered, focused or dragged.'
  },
  {
    name: 'radius',
    type: 'number',
    default: '-',
    description: 'Corner radius of the track in px. Fully round when left out.'
  },
  {
    name: 'restOpacity',
    type: 'number',
    default: '0.7',
    description: 'Opacity while idle. The slider brightens to full when active.'
  },
  {
    name: 'growOnHover',
    type: 'boolean',
    default: 'true',
    description: 'Hovering activates the slider. When off it only grows while pressed or focused.'
  },
  {
    name: 'maxStretch',
    type: 'number',
    default: '50',
    description: 'Furthest the track stretches in px when pulled past an end. 0 turns the stretch off.'
  },
  {
    name: 'bounce',
    type: 'number',
    default: '0.5',
    description: 'How much the track wobbles as it springs back, from 0 to 0.95.'
  },
  {
    name: 'jumpToClick',
    type: 'boolean',
    default: 'true',
    description: 'Pressing the track jumps to the pointer. When off, dragging moves the value from where it was.'
  },
  { name: 'wheel', type: 'boolean', default: 'false', description: 'Lets the scroll wheel change the value.' },
  {
    name: 'trackColor',
    type: 'string',
    default: "'color-mix(in srgb, currentColor 18%, transparent)'",
    description: 'Color of the empty track.'
  },
  { name: 'rangeColor', type: 'string', default: "'currentColor'", description: 'Color of the fill.' },
  { name: 'iconColor', type: 'string', default: "'currentColor'", description: 'Color of the outside icons.' },
  {
    name: 'contentColor',
    type: 'string',
    default: "'currentColor'",
    description: 'Color of icons, values and ticks over the empty track.'
  },
  {
    name: 'fillContentColor',
    type: 'string',
    default: "'auto'",
    description: 'Color of icons, values and ticks over the fill. Auto picks light or dark from the fill color.'
  },
  { name: 'thumbColor', type: 'string', default: "'#ffffff'", description: 'Color of the handle.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Turns off interaction and dims the slider.' },
  { name: 'ariaLabel', type: 'string', default: "'Slider'", description: 'Accessible name of the slider.' },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the root.' },
  { name: 'style', type: 'CSSProperties', default: '-', description: 'Inline styles for the root.' }
];

const { props, defaultProps, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);

const theme = useColorModeValue<'light' | 'dark'>('light', 'dark');
const ink = useColorModeValue('#161816', '#f4f5f4');

const basic = computed(() => props.value.demo === 'basic');

const settings = computed(() => {
  const { demo: _demo, preset: _preset, fillColor: _fillColor, icons: _icons, ...rest } = props.value;
  return rest as Omit<typeof DEFAULT_PROPS, 'demo' | 'preset' | 'fillColor' | 'icons'> & {
    iconPlacement: 'outside' | 'inside';
    valuePosition: 'top' | 'bubble' | 'inside' | 'none';
  };
});

const physics = computed(() => ({
  maxStretch: props.value.maxStretch,
  bounce: props.value.bounce,
  growOnHover: props.value.growOnHover,
  wheel: props.value.wheel
}));

const applyPreset = (value: PresetName) => {
  const base = Object.fromEntries(
    Object.keys(LOOK).map(name => [name, (defaultProps.value as Record<string, unknown>)[name]])
  );
  updateProps({ ...base, ...PRESETS[value], preset: value });
};

const fitInside = (name: 'iconPlacement' | 'valuePosition', value: string) => {
  const roomy = props.value.thickness >= 28;
  updateProps({
    [name]: value,
    ...(value === 'inside' && !roomy ? { thickness: 44, activeThickness: 48, radius: 14, restOpacity: 1 } : {})
  });
};

const computedProps = computed(() => (props.value.fillColor ? { rangeColor: props.value.fillColor } : {}));

const basicSet = computed(() => ICON_SETS[props.value.icons]);
const basicIconSize = computed(() => (props.value.iconPlacement === 'inside' ? 20 : 18));

const position = ref(84);
const playerVolume = ref(64);
const playing = ref(true);
let seeking = false;
let timer: ReturnType<typeof setInterval> | undefined;

const line = computed(() => ({
  style: { width: '100%' } as CSSProperties,
  valuePosition: 'none' as const,
  thickness: 5,
  activeThickness: 9,
  trackColor: 'var(--esd-track)',
  rangeColor: props.value.fillColor || 'var(--esd-fill)',
  iconColor: 'var(--esd-muted)',
  ...physics.value
}));

const onSeek = (value: number) => {
  seeking = true;
  position.value = value;
};

const onSeekEnd = () => {
  seeking = false;
};

const togglePlay = () => {
  if (!playing.value && position.value >= SONG) position.value = 0;
  playing.value = !playing.value;
};

watch(
  () => props.value.demo === 'player' && playing.value,
  active => {
    clearInterval(timer);
    timer = undefined;
    if (!active) return;
    timer = setInterval(() => {
      if (seeking) return;
      const next = position.value + 0.25;
      position.value = Math.min(next, SONG);
      if (next >= SONG) playing.value = false;
    }, 250);
  },
  { immediate: true }
);

onBeforeUnmount(() => clearInterval(timer));

const brightness = ref(72);
const ccVolume = ref(40);
const toggles = reactive<Record<ToggleId, boolean>>({ wifi: true, bluetooth: true, airplane: false, focus: false });

const pill = computed(() => ({
  orientation: 'vertical' as const,
  style: { height: '182px' } as CSSProperties,
  thickness: 84,
  activeThickness: 88,
  radius: 28,
  iconPlacement: 'inside' as const,
  valuePosition: 'none' as const,
  rightIcon: null,
  restOpacity: 1,
  jumpToClick: false,
  trackColor: 'var(--esd-well)',
  rangeColor: props.value.fillColor || 'var(--esd-pill-fill)',
  contentColor: 'var(--esd-pill-ink)',
  ...physics.value
}));

const volumeIcon = computed(() =>
  ccVolume.value <= 0 ? VolumeMute02Icon : ccVolume.value < 50 ? VolumeLowIcon : VolumeHighIcon
);

const exposure = ref(24);
const warmth = ref(-30);
const angle = ref(-3);

const cover = computed(() => {
  const radians = (Math.abs(angle.value) * Math.PI) / 180;
  return Math.cos(radians) + 2 * Math.sin(radians);
});
const editorChanged = computed(() => exposure.value !== 0 || warmth.value !== 0 || angle.value !== 0);

const resetEditor = () => {
  exposure.value = 0;
  warmth.value = 0;
  angle.value = 0;
};

const adjust = computed(() => ({
  style: { width: '100%' } as CSSProperties,
  startingValue: -100,
  maxValue: 100,
  fillFrom: 0,
  ticks: [0],
  thumb: true,
  valuePosition: 'none' as const,
  leftIcon: null,
  rightIcon: null,
  thickness: 4,
  activeThickness: 8,
  restOpacity: 1,
  trackColor: 'var(--esd-track)',
  rangeColor: props.value.fillColor || 'var(--esd-fill)',
  ...physics.value
}));

watch(
  () => props.value.demo,
  demo => {
    if (demo !== 'player') {
      position.value = 84;
      playerVolume.value = 64;
      playing.value = true;
      seeking = false;
    }
    if (demo !== 'control') {
      brightness.value = 72;
      ccVolume.value = 40;
      Object.assign(toggles, { wifi: true, bluetooth: true, airplane: false, focus: false });
    }
    if (demo !== 'editor') {
      exposure.value = 24;
      warmth.value = -30;
      angle.value = -3;
    }
  }
);
</script>

<style>
.esd-scene {
  --esd-surface: linear-gradient(180deg, #1a1c1a 0%, #121412 100%);
  --esd-surface-edge: inset 0 0 0 1px rgba(255, 255, 255, 0.07), inset 0 1px 0 rgba(255, 255, 255, 0.08);
  --esd-surface-drop: 0 30px 60px -36px rgba(0, 0, 0, 0.9);
  --esd-tile: linear-gradient(180deg, #363a36 0%, #252825 100%);
  --esd-tile-edge: inset 0 0 0 1px rgba(255, 255, 255, 0.07), inset 0 1px 0 rgba(255, 255, 255, 0.12);
  --esd-ink: #f4f5f4;
  --esd-muted: rgba(244, 245, 244, 0.58);
  --esd-faint: rgba(244, 245, 244, 0.36);
  --esd-track: rgba(244, 245, 244, 0.16);
  --esd-fill: #f4f5f4;
  --esd-hover: rgba(255, 255, 255, 0.06);
  --esd-panel: linear-gradient(180deg, #1a1c1a 0%, #121412 100%);
  --esd-well: rgba(255, 255, 255, 0.08);
  --esd-pill-fill: #f4f5f4;
  --esd-pill-ink: rgba(244, 245, 244, 0.74);
  --esd-on: #f4f5f4;
  --esd-on-ink: #151715;
  --esd-cc-unit: 84px;
  container: esd / inline-size;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  place-items: center;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 24px 16px;
  color: var(--esd-ink);
}

.esd-scene[data-theme='light'] {
  --esd-surface: linear-gradient(180deg, #ffffff 0%, #f8f9f8 100%);
  --esd-surface-edge: inset 0 0 0 1px rgba(22, 24, 22, 0.08), inset 0 1px 0 #ffffff;
  --esd-surface-drop: 0 30px 60px -38px rgba(22, 24, 22, 0.4);
  --esd-tile: linear-gradient(180deg, #ffffff 0%, #f0f2f0 100%);
  --esd-tile-edge: inset 0 0 0 1px rgba(22, 24, 22, 0.08), inset 0 1px 0 #ffffff, 0 1px 2px rgba(22, 24, 22, 0.06);
  --esd-ink: #161816;
  --esd-muted: rgba(22, 24, 22, 0.56);
  --esd-faint: rgba(22, 24, 22, 0.34);
  --esd-track: rgba(22, 24, 22, 0.12);
  --esd-fill: #161816;
  --esd-hover: rgba(22, 24, 22, 0.05);
  --esd-panel: linear-gradient(180deg, #eceeec 0%, #e3e6e3 100%);
  --esd-well: rgba(22, 24, 22, 0.08);
  --esd-pill-fill: #ffffff;
  --esd-pill-ink: rgba(22, 24, 22, 0.62);
  --esd-on: #161816;
  --esd-on-ink: #ffffff;
}

.esd-card {
  box-sizing: border-box;
  width: min(340px, 100%);
  border-radius: 24px;
  background: var(--esd-surface);
  box-shadow: var(--esd-surface-edge), var(--esd-surface-drop);
}

.esd-icon-button {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  padding: 0;
  border: 0;
  border-radius: 12px;
  background: transparent;
  color: inherit;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    transform 0.2s ease;
  -webkit-tap-highlight-color: transparent;
}

.esd-icon-button:hover {
  background: var(--esd-hover);
}

.esd-icon-button:active {
  transform: scale(0.94);
}

.esd-icon-button:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}

.esd-icon-button--raised {
  width: 52px;
  height: 52px;
  border-radius: 16px;
  background: var(--esd-tile);
  box-shadow: var(--esd-tile-edge);
}

.esd-icon-button--raised:hover {
  background: var(--esd-tile);
  filter: brightness(1.06);
}

.esd-player {
  display: grid;
  grid-template-columns: 64px minmax(0, 1fr);
  grid-template-areas:
    'art meta'
    'seek seek'
    'transport transport'
    'volume volume';
  column-gap: 14px;
  padding: 20px;
}

.esd-player__art {
  display: block;
  grid-area: art;
  width: 64px;
  height: 64px;
  border-radius: 14px;
  object-fit: cover;
  box-shadow: var(--esd-tile-edge);
}

.esd-player__meta {
  display: flex;
  grid-area: meta;
  flex-direction: column;
  align-self: center;
  gap: 2px;
  min-width: 0;
}

.esd-player__meta strong {
  font-size: 16px;
  font-weight: 600;
  line-height: 22px;
  letter-spacing: -0.01em;
}

.esd-player__meta span {
  color: var(--esd-muted);
  font-size: 14px;
  line-height: 20px;
}

.esd-player__seek {
  grid-area: seek;
  margin-top: 12px;
}

.esd-player__times {
  display: flex;
  justify-content: space-between;
  margin-top: -7px;
  color: var(--esd-muted);
  font-size: 12px;
  font-variant-numeric: tabular-nums;
  line-height: 16px;
}

.esd-player__transport {
  display: flex;
  grid-area: transport;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin: 12px 0 10px;
}

.esd-player__volume {
  grid-area: volume;
  min-width: 0;
}

.esd-cc {
  display: flex;
  gap: 14px;
  padding: 16px;
  border-radius: 34px;
  background: var(--esd-panel);
  box-shadow: var(--esd-surface-edge), var(--esd-surface-drop);
}

.esd-cc__module {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  place-items: center;
  box-sizing: border-box;
  width: calc(var(--esd-cc-unit) * 2 + 14px);
  height: calc(var(--esd-cc-unit) * 2 + 14px);
  padding: 14px;
  border-radius: 26px;
  background: var(--esd-well);
}

.esd-cc__toggle {
  display: grid;
  place-items: center;
  width: 58px;
  height: 58px;
  padding: 0;
  border: 0;
  border-radius: 999px;
  background: var(--esd-tile);
  box-shadow: var(--esd-tile-edge);
  color: var(--esd-ink);
  cursor: pointer;
  transition:
    background-color 0.25s ease,
    color 0.25s ease,
    transform 0.2s ease;
  -webkit-tap-highlight-color: transparent;
}

.esd-cc__toggle:active {
  transform: scale(0.94);
}

.esd-cc__toggle:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}

.esd-cc__toggle[data-on] {
  background: var(--esd-on);
  box-shadow: none;
  color: var(--esd-on-ink);
}

.esd-editor {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 16px 18px 12px;
}

.esd-editor__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 28px;
}

.esd-editor__head strong {
  font-size: 16px;
  font-weight: 600;
  letter-spacing: -0.01em;
}

.esd-editor__reset {
  height: 28px;
  padding: 0 10px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: var(--esd-muted);
  font: inherit;
  font-size: 14px;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.esd-editor__reset:hover {
  background: var(--esd-hover);
  color: var(--esd-ink);
}

.esd-editor__reset:disabled {
  color: var(--esd-faint);
  background: transparent;
  cursor: default;
}

.esd-editor__photo {
  position: relative;
  overflow: hidden;
  aspect-ratio: 2 / 1;
  border-radius: 14px;
  box-shadow: var(--esd-tile-edge);
}

.esd-editor__photo img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  will-change: transform, filter;
}

.esd-editor__tint {
  position: absolute;
  inset: 0;
  mix-blend-mode: soft-light;
  pointer-events: none;
}

.esd-editor__rows {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.esd-editor__row-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: -6px;
  font-size: 14px;
  line-height: 20px;
}

.esd-editor__row-head span {
  color: var(--esd-muted);
  font-variant-numeric: tabular-nums;
}

@container esd (min-width: 640px) {
  .esd-player {
    width: min(600px, 100%);
    grid-template-columns: 184px minmax(0, 1fr) 168px;
    grid-template-rows: 1fr auto auto;
    grid-template-areas:
      'art meta meta'
      'art seek seek'
      'art transport volume';
    column-gap: 24px;
    padding: 18px 24px 18px 18px;
  }

  .esd-player__art {
    width: 184px;
    height: 184px;
    border-radius: 16px;
  }

  .esd-player__meta {
    align-self: start;
    padding-top: 8px;
  }

  .esd-player__meta strong {
    font-size: 18px;
    line-height: 24px;
  }

  .esd-player__seek {
    margin-top: 0;
  }

  .esd-player__transport {
    justify-content: flex-start;
    gap: 10px;
    margin: 0 0 0 -10px;
  }

  .esd-player__volume {
    align-self: center;
  }

  .esd-editor {
    display: grid;
    width: min(640px, 100%);
    grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
    grid-template-areas:
      'head head'
      'photo rows';
    gap: 14px 24px;
    padding: 16px 22px 16px 16px;
  }

  .esd-editor__head {
    grid-area: head;
    padding-left: 2px;
  }

  .esd-editor__photo {
    grid-area: photo;
    aspect-ratio: auto;
    min-height: 200px;
  }

  .esd-editor__rows {
    grid-area: rows;
    align-self: center;
  }
}

@container esd (max-width: 440px) {
  .esd-cc__module {
    display: none;
  }
}

@container esd (max-width: 360px) {
  .esd-player,
  .esd-editor {
    padding-right: 16px;
    padding-left: 16px;
  }
}
</style>
