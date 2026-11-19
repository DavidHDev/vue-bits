<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
    :demo-only-props="['demo', 'preset', 'smoothScroll', 'tintColor', 'tintAmount', 'depth']"
    :computed-props="computedProps"
  >
    <TabsLayout>
      <template #preview>
        <div
          class="demo-container relative overflow-hidden"
          :style="{ height: '500px', padding: 0, color: ink.text, containerType: 'inline-size' }"
        >
          <div v-if="props.demo === 'photo'" key="photo" class="gb-demo-center">
            <div class="gb-demo-frame gb-demo-frame--photo" :style="{ boxShadow: ink.rim }">
              <img
                :src="ink.landscape"
                alt=""
                draggable="false"
                class="gb-demo-fill"
                style="object-position: 50% 60%"
              />
              <GradualBlur v-bind="blur" position="bottom" target="parent" :z-index="2" />
              <div class="gb-demo-caption">
                <div class="gb-demo-caption-text">
                  <p class="gb-demo-caption-title">Canola field</p>
                  <p class="gb-demo-caption-sub">Gippsland, 35mm</p>
                </div>
                <div class="gb-demo-caption-icons">
                  <HugeiconsIcon :icon="FavouriteIcon" :size="20" color="currentColor" :stroke-width="1.7" />
                  <HugeiconsIcon :icon="MoreHorizontalIcon" :size="20" color="currentColor" :stroke-width="1.7" />
                </div>
              </div>
            </div>
          </div>

          <div v-else-if="props.demo === 'carousel'" key="carousel" class="gb-demo-carousel">
            <div class="gb-demo-strip-wrap">
              <div ref="stripRef" class="gb-demo-strip">
                <div class="gb-demo-strip-row">
                  <div
                    v-for="(shot, i) in SHOTS"
                    :key="i"
                    class="gb-demo-strip-item"
                    :style="{ boxShadow: ink.rim, borderRadius: '18px' }"
                  >
                    <div class="gb-demo-shot" style="aspect-ratio: 4 / 5; border-radius: 18px">
                      <img
                        :src="ink[shot.photo]"
                        alt=""
                        draggable="false"
                        class="gb-demo-fill"
                        :style="shotStyle(shot)"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <GradualBlur v-bind="blur" position="left" target="parent" :z-index="2" />
              <GradualBlur v-bind="blur" position="right" target="parent" :z-index="2" />
            </div>
            <div class="gb-demo-buttons">
              <button
                v-for="button in BUTTONS"
                :key="button.label"
                type="button"
                class="gb-demo-round"
                :aria-label="button.label"
                :style="{ background: ink.tile, boxShadow: ink.tileRim }"
                @click="move(button.direction)"
              >
                <HugeiconsIcon :icon="button.icon" :size="18" :color="ink.text" :stroke-width="1.8" />
              </button>
            </div>
          </div>

          <div v-else-if="props.demo === 'basic'" key="basic" class="gb-demo-center">
            <div class="gb-demo-frame gb-demo-frame--basic" :style="{ boxShadow: ink.rim }">
              <img :src="ink.sky" alt="" draggable="false" class="gb-demo-fill" />
              <GradualBlur
                v-bind="blur"
                :position="props.position"
                :target="props.target"
                :z-index="props.target === 'page' ? 1000 : 2"
              />
            </div>
          </div>

          <div v-else key="feed" class="gb-demo-fill-box">
            <div ref="scrollerRef" class="gb-demo-feed-scroller">
              <div class="gb-demo-feed">
                <div
                  v-for="(section, index) in SECTIONS"
                  :key="section.title"
                  :style="{ marginTop: index ? '28px' : '0' }"
                >
                  <div class="gb-demo-section-head">
                    <p class="gb-demo-section-title">{{ section.title }}</p>
                    <p class="gb-demo-section-count" :style="{ color: ink.muted }">{{ section.shots.length }} photos</p>
                  </div>
                  <div class="gb-demo-grid">
                    <div
                      v-for="(shot, i) in section.shots"
                      :key="i"
                      class="gb-demo-shot"
                      style="aspect-ratio: 1; border-radius: 6px"
                    >
                      <img
                        :src="ink[SHOTS[shot].photo]"
                        alt=""
                        draggable="false"
                        class="gb-demo-fill"
                        :style="shotStyle(SHOTS[shot])"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <GradualBlur v-bind="blur" position="top" target="parent" :z-index="2" />
            <GradualBlur v-bind="blur" position="bottom" target="parent" :z-index="2" />

            <div class="gb-demo-topbar">
              <p class="gb-demo-topbar-title">Library</p>
              <div class="gb-demo-topbar-icons">
                <HugeiconsIcon :icon="Search01Icon" :size="20" :color="ink.text" :stroke-width="1.7" />
                <HugeiconsIcon :icon="MoreHorizontalIcon" :size="20" :color="ink.text" :stroke-width="1.7" />
              </div>
            </div>

            <div class="gb-demo-tabs">
              <div
                v-for="(tab, index) in TABS"
                :key="tab.label"
                class="gb-demo-tab"
                :style="{ color: index ? ink.muted : ink.text }"
              >
                <HugeiconsIcon :icon="tab.icon" :size="21" color="currentColor" :stroke-width="1.7" />
                <p class="gb-demo-tab-label">{{ tab.label }}</p>
              </div>
            </div>
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
            @update:model-value="applyPreset"
          />
          <PreviewSelect
            title="Position"
            :options="POSITION_OPTIONS"
            :model-value="props.position"
            :is-disabled="!basic"
            @update:model-value="value => updateProp('position', value as GradualBlurPosition)"
          />
          <PreviewSelect
            title="Target"
            :options="TARGET_OPTIONS"
            :model-value="props.target"
            :is-disabled="!basic"
            @update:model-value="value => updateProp('target', value as 'parent' | 'page')"
          />
          <PreviewSelect
            title="Curve"
            :options="CURVE_OPTIONS"
            :model-value="props.curve"
            @update:model-value="value => updateProp('curve', value as GradualBlurCurve)"
          />
          <PreviewColorPickerCustom
            title="Tint"
            :color="tintHex"
            @change="(value: string) => updateProp('tintColor', value)"
          />
          <PreviewSlider
            title="Tint Amount"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.tintAmount"
            @update:model-value="value => updateProp('tintAmount', value)"
          />
          <PreviewSlider
            title="Strength"
            :min="0.5"
            :max="6"
            :step="0.25"
            :model-value="props.strength"
            @update:model-value="value => updateProp('strength', value)"
          />
          <PreviewSlider
            title="Height"
            :min="2"
            :max="14"
            :step="0.5"
            value-unit="rem"
            :model-value="props.depth"
            @update:model-value="value => updateProp('depth', value)"
          />
          <PreviewSlider
            title="Layers"
            :min="1"
            :max="16"
            :step="1"
            :model-value="props.layers"
            @update:model-value="value => updateProp('layers', value)"
          />
          <PreviewSlider
            title="Saturation"
            :min="0"
            :max="2.5"
            :step="0.05"
            :model-value="props.saturation"
            @update:model-value="value => updateProp('saturation', value)"
          />
          <PreviewSlider
            title="Opacity"
            :min="0.1"
            :max="1"
            :step="0.05"
            :model-value="props.opacity"
            @update:model-value="value => updateProp('opacity', value)"
          />
          <PreviewSlider
            title="Hover Intensity"
            :min="0"
            :max="3"
            :step="0.1"
            :model-value="props.hoverIntensity"
            @update:model-value="value => updateProp('hoverIntensity', value)"
          />
          <PreviewSwitch
            title="Exponential"
            :model-value="props.exponential"
            @update:model-value="value => updateProp('exponential', value)"
          />
          <PreviewSwitch
            title="Auto Hide"
            :model-value="props.autoHide"
            :is-disabled="props.demo !== 'feed' && props.demo !== 'carousel'"
            @update:model-value="value => updateProp('autoHide', value)"
          />
          <PreviewSwitch
            title="Smooth Scroll"
            :model-value="props.smoothScroll"
            :is-disabled="props.demo !== 'feed'"
            @update:model-value="value => updateProp('smoothScroll', value)"
          />
        </Customize>

        <PropTable :data="propData" />
        <Dependencies :dependency-list="[]" />
      </template>

      <template #code>
        <CodeExample :code-object="gradualBlur" component-name="GradualBlur" />
      </template>
    </TabsLayout>
  </ComponentPropsProvider>
</template>

<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue';
import { HugeiconsIcon } from '@hugeicons/vue';
import {
  Album02Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  FavouriteIcon,
  Image01Icon,
  MoreHorizontalIcon,
  Search01Icon
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
import { useSmoothScroll } from '@/composables/useSmoothScroll';
import { useColorModeValue } from '@/composables/useTheme';
import { gradualBlur } from '@/constants/code/Animations/gradualBlurCode';
import GradualBlur, {
  type GradualBlurCurve,
  type GradualBlurPosition
} from '@/content/Animations/GradualBlur/GradualBlur.vue';

type Photo = 'sky' | 'portrait' | 'landscape';
type Shot = { photo: Photo; position: string; zoom: number };

const INK = {
  dark: {
    page: '#111111',
    text: '#f4f4f5',
    muted: 'rgba(244, 244, 245, 0.6)',
    rim: 'inset 0 0 0 1px rgba(255, 255, 255, 0.07)',
    tile: 'linear-gradient(180deg, #363a36 0%, #242724 100%)',
    tileRim:
      'inset 0 0 0 1px rgba(255, 255, 255, 0.07), inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 4px 10px -4px rgba(0, 0, 0, 0.7)',
    sky: '/assets/demo/night-sky.webp',
    portrait: '/assets/demo/night-portrait.webp',
    landscape: '/assets/demo/night-landscape.webp'
  },
  light: {
    page: '#ffffff',
    text: '#161816',
    muted: 'rgba(22, 24, 22, 0.6)',
    rim: 'inset 0 0 0 1px rgba(22, 24, 22, 0.08)',
    tile: 'linear-gradient(180deg, #ffffff 0%, #f6f8f6 100%)',
    tileRim:
      'inset 0 0 0 1px rgba(22, 24, 22, 0.08), inset 0 1px 0 rgba(255, 255, 255, 1), 0 4px 10px -5px rgba(22, 24, 22, 0.25)',
    sky: '/assets/demo/day-sky.webp',
    portrait: '/assets/demo/day-portrait.webp',
    landscape: '/assets/demo/day-landscape.webp'
  }
};

const SHOTS: Shot[] = [
  { photo: 'sky', position: '20% 40%', zoom: 1 },
  { photo: 'portrait', position: '50% 35%', zoom: 1.15 },
  { photo: 'landscape', position: '30% 60%', zoom: 1 },
  { photo: 'landscape', position: '82% 40%', zoom: 1.7 },
  { photo: 'sky', position: '85% 60%', zoom: 1.5 },
  { photo: 'portrait', position: '45% 85%', zoom: 1 },
  { photo: 'portrait', position: '70% 55%', zoom: 1.9 },
  { photo: 'sky', position: '50% 80%', zoom: 1.2 },
  { photo: 'landscape', position: '55% 25%', zoom: 1.4 }
];

const SECTIONS = [
  { title: 'Today', shots: [0, 1, 2, 3, 4, 5] },
  { title: 'Yesterday', shots: [6, 7, 8, 2, 0, 1] },
  { title: 'Last week', shots: [3, 4, 5, 6, 7, 8, 1, 2, 0] }
];

const TABS = [
  { icon: Image01Icon, label: 'Library' },
  { icon: Album02Icon, label: 'Albums' },
  { icon: FavouriteIcon, label: 'Favorites' },
  { icon: Search01Icon, label: 'Search' }
];

const BUTTONS = [
  { icon: ArrowLeft01Icon, label: 'Previous', direction: -1 },
  { icon: ArrowRight01Icon, label: 'Next', direction: 1 }
];

const LOOK = {
  strength: 2,
  depth: 6,
  layers: 8,
  curve: 'linear' as GradualBlurCurve,
  exponential: true,
  opacity: 1,
  saturation: 1,
  hoverIntensity: 1,
  tintAmount: 0.6
};

const DEFAULT_PROPS = {
  demo: 'feed',
  preset: 'soft',
  smoothScroll: true,
  tintColor: null as string | null,
  position: 'bottom' as GradualBlurPosition,
  target: 'parent' as 'parent' | 'page',
  autoHide: true,
  ...LOOK
};

const PRESETS: Record<string, Partial<typeof LOOK>> = {
  soft: {},
  clear: { tintAmount: 0 },
  deep: { strength: 4, depth: 10, tintAmount: 0.45 },
  subtle: { strength: 1, depth: 4, tintAmount: 0.3 },
  vibrant: { strength: 3, saturation: 1.8, tintAmount: 0 },
  fog: { strength: 2.5, exponential: false, curve: 'ease-out', tintAmount: 0.92 },
  peek: { strength: 3, hoverIntensity: 0, tintAmount: 0.3 },
  steps: { layers: 3, exponential: false, curve: 'linear', tintAmount: 0 }
};

const DEMO_OPTIONS = [
  { value: 'feed', label: 'Feed' },
  { value: 'photo', label: 'Photo' },
  { value: 'carousel', label: 'Carousel' },
  { value: 'basic', label: 'Basic' }
];

const PRESET_OPTIONS = [
  { value: 'soft', label: 'Soft' },
  { value: 'clear', label: 'Clear' },
  { value: 'deep', label: 'Deep' },
  { value: 'subtle', label: 'Subtle' },
  { value: 'vibrant', label: 'Vibrant' },
  { value: 'fog', label: 'Fog' },
  { value: 'peek', label: 'Peek' },
  { value: 'steps', label: 'Steps' }
];

const POSITION_OPTIONS = [
  { value: 'bottom', label: 'Bottom' },
  { value: 'top', label: 'Top' },
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' }
];

const TARGET_OPTIONS = [
  { value: 'parent', label: 'Parent' },
  { value: 'page', label: 'Page' }
];

const CURVE_OPTIONS = [
  { value: 'linear', label: 'Linear' },
  { value: 'bezier', label: 'Smooth' },
  { value: 'ease-in', label: 'Ease In' },
  { value: 'ease-out', label: 'Ease Out' },
  { value: 'ease-in-out', label: 'Ease In Out' }
];

const propData: PropRow[] = [
  {
    name: 'position',
    type: "'top' | 'bottom' | 'left' | 'right'",
    default: "'bottom'",
    description: 'Edge the blur grows toward.'
  },
  {
    name: 'target',
    type: "'parent' | 'page'",
    default: "'parent'",
    description: 'Sit inside the nearest positioned parent, or stay fixed to the edge of the viewport.'
  },
  {
    name: 'height',
    type: 'string | number',
    default: "'6rem'",
    description: 'How far the blur reaches in from the edge. For left and right this is its width. Numbers are px.'
  },
  {
    name: 'width',
    type: 'string | number',
    default: '-',
    description: 'For top and bottom, a narrower centered band. For left and right, overrides height.'
  },
  {
    name: 'strength',
    type: 'number',
    default: '2',
    description: 'How blurry the very edge gets. Each step adds about 12px of blur.'
  },
  {
    name: 'layers',
    type: 'number',
    default: '8',
    description: 'Blur layers stacked across the ramp. More layers give a smoother falloff, fewer show visible steps.'
  },
  {
    name: 'curve',
    type: "'linear' | 'bezier' | 'ease-in' | 'ease-out' | 'ease-in-out'",
    default: "'linear'",
    description: 'How the blur builds across the ramp. bezier is a smooth S-curve.'
  },
  {
    name: 'exponential',
    type: 'boolean',
    default: 'true',
    description: 'Doubles the blur toward the edge so it starts gently. Turn off for an even ramp.'
  },
  {
    name: 'opacity',
    type: 'number',
    default: '1',
    description: 'Opacity of the blur layers. Lower values let the sharp content show through.'
  },
  {
    name: 'saturation',
    type: 'number',
    default: '1',
    description: 'Color boost of the blurred content, building toward the edge, for a glassy look.'
  },
  {
    name: 'tint',
    type: 'string',
    default: "'transparent'",
    description: 'Color the content fades into at the edge, such as your page background. Use rgba for a lighter wash.'
  },
  {
    name: 'autoHide',
    type: 'boolean',
    default: 'false',
    description:
      'Fades the blur out when the scroll container reaches this edge, so it only shows while there is more to scroll.'
  },
  {
    name: 'container',
    type: 'string | HTMLElement | Ref',
    default: '-',
    description:
      'Scroll container watched by autoHide. Defaults to a scrollable sibling or the parent, or the page when target is page.'
  },
  {
    name: 'hoverIntensity',
    type: 'number',
    default: '1',
    description: 'Multiplies the blur while the cursor is over it. 0 clears it on hover, 2 doubles it.'
  },
  {
    name: 'duration',
    type: 'number | string',
    default: '0.3',
    description: 'Length of the hover and autoHide transitions, in seconds or as a CSS time.'
  },
  { name: 'easing', type: 'string', default: "'ease-out'", description: 'CSS easing of those transitions.' },
  { name: 'zIndex', type: 'number', default: '1000', description: 'Stacking order of the overlay.' },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the overlay.' },
  { name: 'style', type: 'StyleValue', default: '-', description: 'Inline styles for the overlay.' }
];

const toRgba = (hex: string, alpha: number) => {
  const value = hex.replace('#', '');
  const full =
    value.length === 3
      ? value
          .split('')
          .map(c => c + c)
          .join('')
      : value;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const shotStyle = (shot: Shot) => ({
  objectPosition: shot.position,
  transform: `scale(${shot.zoom})`,
  transformOrigin: shot.position
});

const { props, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);
const theme = useColorModeValue('light', 'dark');
const ink = computed(() => INK[theme.value as 'light' | 'dark']);
const basic = computed(() => props.value.demo === 'basic');
const scrim = computed(() => props.value.demo === 'photo' || (basic.value && props.value.target !== 'page'));
const tintHex = computed(() => props.value.tintColor ?? (scrim.value ? '#000000' : ink.value.page));
const tint = computed(() =>
  props.value.tintAmount > 0 ? toRgba(tintHex.value, props.value.tintAmount) : 'transparent'
);
const height = computed(() => `${props.value.depth}rem`);

const blur = computed(() => {
  const {
    demo: _demo,
    preset: _preset,
    smoothScroll: _smoothScroll,
    tintColor: _tintColor,
    tintAmount: _tintAmount,
    depth: _depth,
    position: _position,
    target: _target,
    ...look
  } = props.value;
  return { ...look, height: height.value, tint: tint.value };
});

const computedProps = computed(() => ({ height: height.value, tint: tint.value }));

const applyPreset = (value: string | number) =>
  updateProps({ ...LOOK, ...PRESETS[String(value)], preset: String(value) });

const scrollerRef = ref<HTMLElement | null>(null);
useSmoothScroll(scrollerRef, () => props.value.smoothScroll);

const stripRef = ref<HTMLElement | null>(null);
const move = (direction: number) => stripRef.value?.scrollBy({ left: direction * 212, behavior: 'smooth' });

watchEffect(onCleanup => {
  const el = stripRef.value;
  if (!el) return;
  const onWheel = (event: WheelEvent) => {
    if (Math.abs(event.deltaX) >= Math.abs(event.deltaY)) return;
    const max = el.scrollWidth - el.clientWidth;
    if ((event.deltaY < 0 && el.scrollLeft <= 1) || (event.deltaY > 0 && el.scrollLeft >= max - 1)) return;
    event.preventDefault();
    el.scrollLeft += event.deltaY;
  };
  el.addEventListener('wheel', onWheel, { passive: false });
  onCleanup(() => el.removeEventListener('wheel', onWheel));
});
</script>

<style scoped>
.gb-demo-fill-box {
  position: absolute;
  inset: 0;
}

.gb-demo-center {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 24px;
}

.gb-demo-fill {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.gb-demo-shot {
  position: relative;
  overflow: hidden;
}

.gb-demo-frame {
  position: relative;
  aspect-ratio: 3 / 2;
  overflow: hidden;
}

.gb-demo-frame--photo {
  width: min(100%, 560px);
  border-radius: 22px;
}

.gb-demo-frame--basic {
  width: min(100%, 480px);
  border-radius: 20px;
}

.gb-demo-caption {
  position: absolute;
  left: 22px;
  right: 22px;
  bottom: 20px;
  z-index: 3;
  display: flex;
  align-items: flex-end;
  gap: 12px;
}

.gb-demo-caption-text {
  flex: 1;
  min-width: 0;
  color: #ffffff;
}

.gb-demo-caption-title {
  margin: 0;
  font-size: clamp(16px, 3.6cqi, 20px);
  font-weight: 600;
  letter-spacing: -0.01em;
}

.gb-demo-caption-sub {
  margin: 2px 0 0;
  font-size: 13px;
  opacity: 0.78;
}

.gb-demo-caption-icons {
  display: flex;
  gap: 14px;
  color: #ffffff;
  padding-bottom: 2px;
}

.gb-demo-feed-scroller {
  position: absolute;
  inset: 0;
  overflow-y: auto;
  scrollbar-width: none;
}

.gb-demo-feed {
  max-width: 720px;
  margin: 0 auto;
  padding: 76px 16px 104px;
}

.gb-demo-section-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 0 4px;
  margin-bottom: 10px;
}

.gb-demo-section-title {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
}

.gb-demo-section-count {
  margin: 0;
  font-size: 13px;
}

.gb-demo-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 4px;
}

.gb-demo-topbar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 3;
  height: 64px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  pointer-events: none;
}

.gb-demo-topbar-title {
  margin: 0;
  font-size: 22px;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.gb-demo-topbar-icons {
  display: flex;
  gap: 18px;
  align-items: center;
}

.gb-demo-tabs {
  position: absolute;
  bottom: 14px;
  left: 0;
  right: 0;
  z-index: 3;
  display: flex;
  justify-content: center;
  gap: clamp(20px, 7cqi, 44px);
  pointer-events: none;
}

.gb-demo-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.gb-demo-tab-label {
  margin: 0;
  font-size: 11px;
  font-weight: 500;
}

.gb-demo-carousel {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 22px;
}

.gb-demo-strip-wrap {
  position: relative;
  width: 100%;
}

.gb-demo-strip {
  overflow-x: auto;
  scrollbar-width: none;
}

.gb-demo-strip-row {
  display: flex;
  gap: 12px;
  width: max-content;
  padding: 2px 24px;
}

.gb-demo-strip-item {
  width: 200px;
  flex-shrink: 0;
}

.gb-demo-buttons {
  display: flex;
  gap: 10px;
}

.gb-demo-round {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  cursor: pointer;
  border: 0;
  padding: 0;
}
</style>
