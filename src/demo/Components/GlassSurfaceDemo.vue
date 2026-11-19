<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetAll"
    :has-changes="hasChanges"
    :demo-only-props="['preset']"
  >
    <TabsLayout>
      <template #preview>
        <div
          ref="stageRef"
          class="demo-container relative overflow-hidden"
          style="height: 500px; padding: 0; display: flex; align-items: center; justify-content: center"
          @pointermove="onStageMove"
          @pointerleave="onStageLeave"
        >
          <img
            ref="backdropRef"
            :src="`/assets/demo/${theme === 'light' ? 'day' : 'night'}-sky.webp`"
            alt=""
            draggable="false"
            style="
              position: absolute;
              inset: 0;
              width: 100%;
              height: 100%;
              object-fit: cover;
              pointer-events: none;
              user-select: none;
            "
          />
          <div
            ref="glassRef"
            style="cursor: grab; user-select: none; touch-action: none"
            @pointerdown="onPointerDown"
            @pointerup="onPointerUp"
            @pointercancel="onPointerUp"
          >
            <GlassSurface
              v-bind="settings"
              :backdrop="backdropRef"
              :shape="shape"
              :width="stageWidth ? Math.min(settings.width, stageWidth - 32) : settings.width"
            >
              <div
                v-if="icons.length > 0"
                :style="{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-around',
                  width: '100%',
                  paddingLeft: '12px',
                  paddingRight: '12px',
                  color: theme === 'light' ? '#18181b' : '#ffffff'
                }"
              >
                <HugeiconsIcon
                  v-for="(icon, index) in icons"
                  :key="index"
                  :icon="icon"
                  :size="props.preset === 'player' ? 28 : 24"
                  :stroke-width="1.8"
                />
              </div>
            </GlassSurface>
          </div>
        </div>

        <Customize>
          <PreviewSelect
            title="Preset"
            :options="PRESET_OPTIONS"
            :model-value="props.preset"
            @update:model-value="value => applyPreset(value as Preset)"
          />
          <div v-if="props.preset === 'logo'" class="scrubber">
            <button type="button" class="scrubber-track scrubber-track--select" @click="inputRef?.click()">
              <span class="scrubber-label">Upload</span>
              <span class="scrubber-select-right">
                <span
                  class="scrubber-value"
                  style="max-width: 160px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap"
                >
                  {{ upload ? upload.name : 'SVG or PNG' }}
                </span>
              </span>
            </button>
            <input ref="inputRef" type="file" accept="image/svg+xml,image/png,image/webp" hidden @change="onFile" />
          </div>
          <PreviewSelect
            title="Renderer"
            :options="RENDERER_OPTIONS"
            :model-value="settings.refraction ? settings.renderer : 'frosted'"
            @update:model-value="value => onRenderer(String(value))"
          />
          <PreviewSlider
            title="Width"
            :min="120"
            :max="600"
            :step="2"
            value-unit="px"
            :model-value="settings.width"
            @update:model-value="value => updateProp('width', value)"
          />
          <PreviewSlider
            title="Height"
            :min="48"
            :max="320"
            :step="2"
            value-unit="px"
            :model-value="settings.height"
            @update:model-value="value => updateProp('height', value)"
          />
          <PreviewSlider
            v-if="props.preset !== 'logo'"
            title="Border Radius"
            :min="0"
            :max="160"
            :step="1"
            value-unit="px"
            :model-value="settings.borderRadius"
            @update:model-value="value => updateProp('borderRadius', value)"
          />
          <PreviewSlider
            title="Distortion Scale"
            :min="-300"
            :max="300"
            :step="10"
            :model-value="settings.distortionScale"
            @update:model-value="value => updateProp('distortionScale', value)"
          />
          <PreviewSlider
            title="Border Width"
            :min="0"
            :max="0.3"
            :step="0.01"
            :model-value="settings.borderWidth"
            @update:model-value="value => updateProp('borderWidth', value)"
          />
          <PreviewSlider
            title="Blur"
            :min="0"
            :max="30"
            :step="1"
            value-unit="px"
            :model-value="settings.blur"
            @update:model-value="value => updateProp('blur', value)"
          />
          <PreviewSlider
            title="Brightness"
            :min="0"
            :max="100"
            :step="1"
            value-unit="%"
            :model-value="settings.brightness"
            @update:model-value="value => updateProp('brightness', value)"
          />
          <PreviewSlider
            title="Opacity"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.opacity"
            @update:model-value="value => updateProp('opacity', value)"
          />
          <PreviewSlider
            title="Displace"
            :min="0"
            :max="5"
            :step="0.1"
            :model-value="settings.displace"
            @update:model-value="value => updateProp('displace', value)"
          />
          <PreviewSlider
            title="Red Offset"
            :min="-50"
            :max="50"
            :step="1"
            :model-value="settings.redOffset"
            @update:model-value="value => updateProp('redOffset', value)"
          />
          <PreviewSlider
            title="Green Offset"
            :min="-50"
            :max="50"
            :step="1"
            :model-value="settings.greenOffset"
            @update:model-value="value => updateProp('greenOffset', value)"
          />
          <PreviewSlider
            title="Blue Offset"
            :min="-50"
            :max="50"
            :step="1"
            :model-value="settings.blueOffset"
            @update:model-value="value => updateProp('blueOffset', value)"
          />
          <PreviewSlider
            title="Background Opacity"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.backgroundOpacity"
            @update:model-value="value => updateProp('backgroundOpacity', value)"
          />
          <PreviewSlider
            title="Saturation"
            :min="0"
            :max="3"
            :step="0.1"
            :model-value="settings.saturation"
            @update:model-value="value => updateProp('saturation', value)"
          />
        </Customize>

        <PropTable :data="propData" />
      </template>

      <template #code>
        <CodeExample :code-object="glassSurface" component-name="GlassSurface" />
      </template>
    </TabsLayout>
  </ComponentPropsProvider>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, onUpdated, ref, shallowRef, watch } from 'vue';
import { HugeiconsIcon } from '@hugeicons/vue';
import {
  FavouriteIcon,
  Home01Icon,
  NextIcon,
  PauseIcon,
  PreviousIcon,
  Search01Icon,
  UserIcon
} from '@hugeicons/core-free-icons';
import CodeExample from '@/components/common/CodeExample.vue';
import Customize from '@/components/common/Customize.vue';
import PreviewSelect from '@/components/common/PreviewSelect.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import ComponentPropsProvider from '@/components/context/ComponentPropsProvider.vue';
import { useComponentProps } from '@/composables/useComponentProps';
import { useColorModeValue } from '@/composables/useTheme';
import { glassSurface } from '@/constants/code/Components/glassSurfaceCode';
import GlassSurface, { type GlassSurfaceRenderer } from '@/content/Components/GlassSurface/GlassSurface.vue';
import logo from '@/assets/logos/vue-bits-logo-small.svg';

type Preset = 'tabs' | 'lens' | 'player' | 'prism' | 'frost' | 'logo';

const DRIFT = [24, 16];

const LOOK = {
  borderWidth: 0.07,
  brightness: 50,
  opacity: 0.93,
  blur: 11,
  displace: 0.5,
  backgroundOpacity: 0.1,
  saturation: 1,
  distortionScale: -180,
  redOffset: 0,
  greenOffset: 10,
  blueOffset: 20
};

const DEFAULT_PROPS = {
  preset: 'tabs' as Preset,
  width: 320,
  height: 76,
  borderRadius: 38,
  ...LOOK,
  refraction: true,
  renderer: 'auto' as GlassSurfaceRenderer
};

type DemoProps = typeof DEFAULT_PROPS;

const PRESETS: Record<Preset, Partial<DemoProps>> = {
  tabs: { ...LOOK, width: 320, height: 76, borderRadius: 38 },
  lens: { ...LOOK, width: 200, height: 200, borderRadius: 100, borderWidth: 0.12, distortionScale: -240 },
  player: { ...LOOK, width: 260, height: 96, borderRadius: 30 },
  prism: {
    ...LOOK,
    width: 320,
    height: 76,
    borderRadius: 38,
    distortionScale: -220,
    redOffset: 0,
    greenOffset: 28,
    blueOffset: 56
  },
  frost: { ...LOOK, width: 320, height: 76, borderRadius: 38, displace: 3, backgroundOpacity: 0.28 },
  logo: { ...LOOK, width: 280, height: 280, borderRadius: 38 }
};

const RENDERER_OPTIONS = [
  { value: 'auto', label: 'Auto' },
  { value: 'svg', label: 'SVG' },
  { value: 'webgl', label: 'WebGL' },
  { value: 'frosted', label: 'Frosted' }
];

const PRESET_OPTIONS = [
  { value: 'tabs', label: 'Tab Bar' },
  { value: 'lens', label: 'Lens' },
  { value: 'player', label: 'Player' },
  { value: 'prism', label: 'Prism' },
  { value: 'frost', label: 'Frost' },
  { value: 'logo', label: 'Logo' }
];

const CONTENT: Record<Preset, (typeof Home01Icon)[]> = {
  tabs: [Home01Icon, Search01Icon, FavouriteIcon, UserIcon],
  prism: [Home01Icon, Search01Icon, FavouriteIcon, UserIcon],
  frost: [Home01Icon, Search01Icon, FavouriteIcon, UserIcon],
  player: [PreviousIcon, PauseIcon, NextIcon],
  lens: [],
  logo: []
};

const propData: PropRow[] = [
  { name: 'children', type: 'slot', default: '-', description: 'Content shown on the glass.' },
  {
    name: 'width',
    type: 'number | string',
    default: '200',
    description: "Width in px, or any CSS value like '100%'."
  },
  {
    name: 'height',
    type: 'number | string',
    default: '80',
    description: "Height in px, or any CSS value like '100vh'."
  },
  { name: 'borderRadius', type: 'number', default: '20', description: 'Corner radius in px. Not used with a shape.' },
  {
    name: 'shape',
    type: 'string',
    default: '-',
    description:
      'URL of an SVG or transparent PNG that gives the glass its outline, fitted inside the width and height. Files from another origin need CORS headers.'
  },
  {
    name: 'refraction',
    type: 'boolean',
    default: 'true',
    description:
      'Bends what is behind the glass at its edges. Set it to false to use the frosted glass look everywhere.'
  },
  {
    name: 'renderer',
    type: "'auto' | 'svg' | 'webgl'",
    default: "'auto'",
    description:
      'How the glass bends light. Auto uses SVG filters in Chromium, which bend anything behind the glass, and WebGL in Safari and Firefox when a backdrop is given. Without a backdrop, those browsers get a frosted glass look. WebGL forces the WebGL glass whenever a backdrop is given.'
  },
  {
    name: 'backdrop',
    type: 'Ref<HTMLImageElement | HTMLVideoElement | HTMLCanvasElement>',
    default: '-',
    description:
      'The image, video or canvas behind the glass. WebGL can only bend what it is given, so pass this to get real refraction outside Chromium. Images from another origin need CORS headers.'
  },
  {
    name: 'distortionScale',
    type: 'number',
    default: '-180',
    description: 'How strongly the edge bends what is behind it. Negative values pull the view inward.'
  },
  {
    name: 'borderWidth',
    type: 'number',
    default: '0.07',
    description: 'Width of the bending edge, as a fraction of the shorter side.'
  },
  {
    name: 'blur',
    type: 'number',
    default: '11',
    description: 'Softness of the transition from the bending edge to the calm center, in px.'
  },
  {
    name: 'brightness',
    type: 'number',
    default: '50',
    description: 'Brightness of the calm center, in %. 50 leaves it undistorted.'
  },
  {
    name: 'opacity',
    type: 'number',
    default: '0.93',
    description: 'How strongly the calm center holds the view still, from 0 to 1.'
  },
  {
    name: 'displace',
    type: 'number',
    default: '0',
    description: 'Blurs the light coming through the glass, for a frosted look.'
  },
  {
    name: 'redOffset',
    type: 'number',
    default: '0',
    description: 'Extra bending for the red channel. Different offsets split light into colored fringes.'
  },
  { name: 'greenOffset', type: 'number', default: '10', description: 'Extra bending for the green channel.' },
  { name: 'blueOffset', type: 'number', default: '20', description: 'Extra bending for the blue channel.' },
  {
    name: 'backgroundOpacity',
    type: 'number',
    default: '0',
    description: 'Opacity of a soft frosted tint over the glass, from 0 to 1.'
  },
  { name: 'saturation', type: 'number', default: '1', description: 'Saturation of what is seen through the glass.' },
  {
    name: 'xChannel',
    type: "'R' | 'G' | 'B'",
    default: "'R'",
    description: 'Channel of the displacement map that moves pixels sideways.'
  },
  {
    name: 'yChannel',
    type: "'R' | 'G' | 'B'",
    default: "'G'",
    description: 'Channel of the displacement map that moves pixels up and down.'
  },
  {
    name: 'mixBlendMode',
    type: 'BlendMode',
    default: "'difference'",
    description: 'How the two edge gradients of the displacement map are combined.'
  },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the glass.' },
  { name: 'style', type: 'CSSProperties', default: '{}', description: 'Inline styles for the glass.' }
];

const { props, defaultProps, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);
const settings = computed(() => {
  const { preset: _preset, ...rest } = props.value;
  return rest;
});
const theme = useColorModeValue('light', 'dark');

const stageRef = ref<HTMLDivElement | null>(null);
const backdropRef = ref<HTMLImageElement | null>(null);
const glassRef = ref<HTMLDivElement | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);
const stageWidth = ref(0);
const upload = shallowRef<{ url: string; name: string } | null>(null);

let offset = { x: 0, y: 0 };
let shown = { x: 0, y: 0 };
let drag: { x: number; y: number; pointerX: number; pointerY: number } | null = null;
const drift = { x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0, time: 0, frame: 0 };
let observer: ResizeObserver | null = null;

const place = () => {
  const stage = stageRef.value;
  const glass = glassRef.value;
  if (!stage || !glass) return;
  const { x: driftX, y: driftY } = drift;
  const ratio = window.devicePixelRatio || 1;
  const limitX = Math.max(0, (stage.clientWidth - glass.offsetWidth) / 2 - 16);
  const limitY = Math.max(0, (stage.clientHeight - glass.offsetHeight) / 2 - 16);
  const leanX = driftX * DRIFT[0];
  const leanY = driftY * DRIFT[1];
  const grab = drag;
  const x = Math.min(limitX, Math.max(-limitX, grab ? grab.pointerX - grab.x : offset.x + leanX));
  const y = Math.min(limitY, Math.max(-limitY, grab ? grab.pointerY - grab.y : offset.y + leanY));
  if (grab) offset = { x: x - leanX, y: y - leanY };
  shown = { x, y };
  glass.style.transform = `translate(${Math.round(x * ratio) / ratio}px, ${Math.round(y * ratio) / ratio}px)`;
};

const step = (now: number) => {
  const state = drift;
  const dt = Math.min(0.05, (now - state.time) / 1000);
  state.time = now;
  state.vx += (50 * (state.tx - state.x) - 14 * state.vx) * dt;
  state.vy += (50 * (state.ty - state.y) - 14 * state.vy) * dt;
  state.x += state.vx * dt;
  state.y += state.vy * dt;
  const resting =
    Math.abs(state.tx - state.x) + Math.abs(state.ty - state.y) + Math.abs(state.vx) + Math.abs(state.vy) < 0.0005;
  if (resting) {
    state.x = state.tx;
    state.y = state.ty;
    state.vx = 0;
    state.vy = 0;
  }
  place();
  state.frame = resting ? 0 : requestAnimationFrame(step);
};

const wake = () => {
  if (drift.frame) return;
  drift.time = performance.now();
  drift.frame = requestAnimationFrame(step);
};

onMounted(() => {
  place();
  const stage = stageRef.value;
  if (!stage) return;
  observer = new ResizeObserver(() => {
    stageWidth.value = stage.clientWidth;
    place();
  });
  observer.observe(stage);
});

onUpdated(place);

onBeforeUnmount(() => {
  observer?.disconnect();
  observer = null;
  cancelAnimationFrame(drift.frame);
  drift.frame = 0;
  if (upload.value) URL.revokeObjectURL(upload.value.url);
});

watch(upload, (_next, previous) => {
  if (previous) URL.revokeObjectURL(previous.url);
});

const onStageMove = (event: PointerEvent) => {
  const stage = stageRef.value;
  const grab = drag;
  if (grab) {
    grab.pointerX = event.clientX;
    grab.pointerY = event.clientY;
    place();
  }
  if (stage && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const rect = stage.getBoundingClientRect();
    drift.tx = Math.min(1, Math.max(-1, ((event.clientX - rect.left) / rect.width) * 2 - 1));
    drift.ty = Math.min(1, Math.max(-1, ((event.clientY - rect.top) / rect.height) * 2 - 1));
    wake();
  }
};

const onStageLeave = () => {
  drift.tx = 0;
  drift.ty = 0;
  wake();
};

const onPointerDown = (event: PointerEvent) => {
  (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
  drag = {
    x: event.clientX - shown.x,
    y: event.clientY - shown.y,
    pointerX: event.clientX,
    pointerY: event.clientY
  };
  if (glassRef.value) glassRef.value.style.cursor = 'grabbing';
};

const onPointerUp = () => {
  drag = null;
  if (glassRef.value) glassRef.value.style.cursor = 'grab';
};

const onFile = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  target.value = '';
  if (!file) return;
  upload.value = { url: URL.createObjectURL(file), name: file.name };
};

const onRenderer = (value: string) =>
  updateProps(
    value === 'frosted'
      ? { refraction: false, renderer: 'auto' }
      : { refraction: true, renderer: value as GlassSurfaceRenderer }
  );

const applyPreset = (value: Preset) => {
  const defaults = defaultProps.value as DemoProps;
  const base = Object.fromEntries(
    Object.keys(DEFAULT_PROPS).map(name => [name, defaults[name as keyof DemoProps]])
  ) as DemoProps;
  updateProps({
    ...base,
    ...PRESETS[value],
    refraction: settings.value.refraction,
    renderer: settings.value.renderer,
    preset: value
  });
};

const resetAll = () => {
  resetProps();
  upload.value = null;
};

const icons = computed(() => CONTENT[props.value.preset] ?? CONTENT.tabs);
const shape = computed(() => (props.value.preset === 'logo' ? upload.value?.url || logo : undefined));
</script>
