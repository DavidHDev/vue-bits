<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
    :demo-only-props="['preset']"
  >
    <TabsLayout>
      <template #preview>
        <div class="demo-container relative overflow-hidden" style="height: 500px; padding: 0">
          <LaserFlow
            :key="rerenderKey"
            v-bind="settings"
            :color="componentColor"
            :reveal-image="REVEAL_IMAGE"
            :theme="theme"
            :surface-ref="surface ? surfaceEl : null"
          />

          <div
            v-if="surface"
            ref="surfaceEl"
            class="laser-window"
            :style="{
              position: 'absolute',
              left: surface.left,
              right: surface.right,
              top: surface.top,
              bottom: '-24px',
              borderRadius: '14px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-primary)',
              overflow: 'hidden',
              color: 'var(--text-primary)',
              pointerEvents: 'none',
              userSelect: 'none'
            }"
          >
            <div
              style="
                height: 34px;
                display: flex;
                align-items: center;
                padding: 0 12px;
                gap: 7px;
                border-bottom: 1px solid var(--border-primary);
                position: relative;
              "
            >
              <div
                v-for="dot in 3"
                :key="dot"
                style="
                  width: 11px;
                  height: 11px;
                  border-radius: 9999px;
                  background: var(--surface-ghost-hover);
                  border: 1px solid var(--border-primary);
                "
              />
              <p
                class="laser-window-title"
                style="
                  position: absolute;
                  left: 0;
                  right: 0;
                  margin: 0;
                  text-align: center;
                  font-size: 12px;
                  font-weight: 500;
                  color: var(--text-dimmed);
                "
              >
                Tracker
              </p>
            </div>
            <div style="display: flex; height: 100%">
              <div
                class="laser-window-sidebar"
                style="
                  display: flex;
                  flex-direction: column;
                  gap: 2px;
                  width: 150px;
                  flex-shrink: 0;
                  padding: 10px;
                  border-right: 1px solid var(--border-primary);
                "
              >
                <div
                  v-for="item in NAV"
                  :key="item.label"
                  :style="{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '0 8px',
                    height: '28px',
                    borderRadius: '8px',
                    background: item.active ? 'var(--surface-ghost)' : 'transparent',
                    color: item.active ? 'var(--text-primary)' : 'var(--text-dimmed)'
                  }"
                >
                  <HugeiconsIcon :icon="item.icon" :size="15" :stroke-width="1.6" />
                  <p style="margin: 0; font-size: 12px; font-weight: 500; white-space: nowrap">{{ item.label }}</p>
                </div>
              </div>
              <div style="flex: 1; min-width: 0; padding: 12px 16px 0">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px">
                  <div style="display: flex; align-items: baseline; gap: 8px; min-width: 0">
                    <p style="margin: 0; font-size: 13px; font-weight: 600; white-space: nowrap">My issues</p>
                    <p style="margin: 0; font-size: 12px; color: var(--text-dimmed)">{{ ISSUES.length }}</p>
                  </div>
                  <div class="laser-window-tools" style="display: flex; gap: 6px; color: var(--text-dimmed)">
                    <HugeiconsIcon :icon="Search01Icon" :size="15" :stroke-width="1.6" />
                    <HugeiconsIcon :icon="FilterHorizontalIcon" :size="15" :stroke-width="1.6" />
                  </div>
                </div>
                <div
                  v-for="issue in ISSUES"
                  :key="issue.id"
                  style="
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    height: 34px;
                    border-top: 1px solid var(--border-primary);
                    min-width: 0;
                  "
                >
                  <div style="color: var(--text-dimmed); flex-shrink: 0; display: flex">
                    <HugeiconsIcon :icon="issue.icon" :size="14" :stroke-width="1.8" />
                  </div>
                  <p
                    style="
                      margin: 0;
                      font-size: 12px;
                      flex: 1;
                      min-width: 0;
                      white-space: nowrap;
                      overflow: hidden;
                      text-overflow: ellipsis;
                    "
                  >
                    {{ issue.title }}
                  </p>
                  <p
                    class="laser-window-meta"
                    style="margin: 0; font-size: 11px; color: var(--text-dimmed); white-space: nowrap"
                  >
                    {{ issue.id }}
                  </p>
                  <div
                    class="laser-window-meta"
                    style="
                      width: 20px;
                      height: 20px;
                      flex-shrink: 0;
                      border-radius: 9999px;
                      background: var(--surface-ghost);
                      border: 1px solid var(--border-primary);
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      font-size: 9px;
                      font-weight: 600;
                      color: var(--text-muted);
                    "
                  >
                    {{ issue.who }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <RefreshButton @click="forceRerender" />
        </div>

        <Customize>
          <PreviewSelect
            title="Preset"
            :options="PRESET_OPTIONS"
            :model-value="props.preset"
            @update:model-value="value => applyPreset(String(value))"
          />
          <PreviewColorPickerCustom
            title="Color"
            :color="settings.color"
            @change="(value: string) => updateProp('color', value)"
          />
          <PreviewSlider
            title="Beam Position"
            :min="0.2"
            :max="0.8"
            :step="0.01"
            :model-value="settings.beamPosition"
            @update:model-value="value => updateProp('beamPosition', value)"
          />
          <PreviewSlider
            title="Intensity"
            :min="0.3"
            :max="2"
            :step="0.05"
            :model-value="settings.intensity"
            @update:model-value="value => updateProp('intensity', value)"
          />
          <PreviewSlider
            title="Beam Width"
            :min="0.4"
            :max="3"
            :step="0.05"
            :model-value="settings.beamWidth"
            @update:model-value="value => updateProp('beamWidth', value)"
          />
          <PreviewSlider
            title="Flare"
            :min="0.5"
            :max="2"
            :step="0.05"
            :model-value="settings.flare"
            @update:model-value="value => updateProp('flare', value)"
          />
          <PreviewSlider
            title="Spread"
            :min="0.4"
            :max="2"
            :step="0.05"
            :model-value="settings.spread"
            @update:model-value="value => updateProp('spread', value)"
          />
          <PreviewSlider
            title="Spill"
            :min="0"
            :max="2"
            :step="0.05"
            :model-value="settings.spill"
            @update:model-value="value => updateProp('spill', value)"
          />
          <PreviewSlider
            title="Fog"
            :min="0"
            :max="2"
            :step="0.05"
            :model-value="settings.fog"
            @update:model-value="value => updateProp('fog', value)"
          />
          <PreviewSlider
            title="Dust"
            :min="0"
            :max="2"
            :step="0.05"
            :model-value="settings.dust"
            @update:model-value="value => updateProp('dust', value)"
          />
          <PreviewSlider
            title="Streaks"
            :min="0"
            :max="2"
            :step="0.05"
            :model-value="settings.streaks"
            @update:model-value="value => updateProp('streaks', value)"
          />
          <PreviewSlider
            title="Dots"
            :min="0"
            :max="2"
            :step="0.05"
            :model-value="settings.dots"
            @update:model-value="value => updateProp('dots', value)"
          />
          <PreviewSlider
            title="Pulse"
            :min="0"
            :max="2"
            :step="0.05"
            :model-value="settings.pulse"
            @update:model-value="value => updateProp('pulse', value)"
          />
          <PreviewSlider
            title="Speed"
            :min="0"
            :max="3"
            :step="0.05"
            :model-value="settings.speed"
            @update:model-value="value => updateProp('speed', value)"
          />
          <PreviewSlider
            title="Seed"
            :min="0"
            :max="20"
            :step="1"
            :model-value="settings.seed"
            @update:model-value="value => updateProp('seed', value)"
          />
          <PreviewSlider
            title="Reveal Radius"
            :min="80"
            :max="400"
            :step="10"
            value-unit="px"
            :model-value="settings.revealRadius"
            @update:model-value="value => updateProp('revealRadius', value)"
          />
          <PreviewSlider
            title="Reveal Opacity"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.revealOpacity"
            @update:model-value="value => updateProp('revealOpacity', value)"
          />
          <PreviewSwitch
            title="Mouse Interaction"
            :model-value="settings.mouseInteraction"
            @update:model-value="value => updateProp('mouseInteraction', value)"
          />
          <PreviewSwitch
            title="Intro"
            :model-value="settings.intro"
            @update:model-value="value => updateProp('intro', value)"
          />
        </Customize>

        <PropTable :data="propData" />
      </template>

      <template #code>
        <CodeExample :code-object="laserFlow" component-name="LaserFlow" />
      </template>
    </TabsLayout>
  </ComponentPropsProvider>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  CheckmarkCircle02Icon,
  CircleIcon,
  DashedLineCircleIcon,
  FilterHorizontalIcon,
  Folder01Icon,
  InboxIcon,
  Layers01Icon,
  Loading03Icon,
  Search01Icon,
  Task01Icon
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import CodeExample from '@/components/common/CodeExample.vue';
import Customize from '@/components/common/Customize.vue';
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
import { useColorModeValue } from '@/composables/useTheme';
import { laserFlow } from '@/constants/code/Animations/laserFlowCode';
import LaserFlow from '@/content/Animations/LaserFlow/LaserFlow.vue';
import { DEFAULT_PROPS, LIGHT_SWAP, PRESET_OPTIONS, presetProps } from './presets/LaserFlow';

type Surface = { left: string; right: string; top: string } | null;

const REVEAL_IMAGE = '/assets/demo/laser-ui.svg';

const SURFACES: Record<string, Surface> = {
  waterfall: { left: '4%', right: '24%', top: '55%' },
  twin: { left: '27%', right: '27%', top: '55%' },
  floor: null,
  ember: { left: '24%', right: '22%', top: '54%' },
  glacier: { left: '20%', right: '42%', top: '52%' },
  quiet: { left: '4%', right: '24%', top: '55%' }
};

const NAV = [
  { icon: InboxIcon, label: 'Inbox', active: false },
  { icon: Task01Icon, label: 'My issues', active: true },
  { icon: Folder01Icon, label: 'Projects', active: false },
  { icon: Layers01Icon, label: 'Views', active: false }
];

const ISSUES = [
  { icon: Loading03Icon, title: 'Polish the onboarding flow', id: 'APP-142', who: 'MK' },
  { icon: CircleIcon, title: 'Sync drafts across devices', id: 'APP-139', who: 'JL' },
  { icon: DashedLineCircleIcon, title: 'Audit color tokens', id: 'APP-131', who: 'AR' },
  { icon: CheckmarkCircle02Icon, title: 'Ship keyboard shortcuts', id: 'APP-127', who: 'DS' },
  { icon: CircleIcon, title: 'Faster search on large projects', id: 'APP-120', who: 'MK' }
];

const surfaceEl = ref<HTMLElement | null>(null);
const { rerenderKey, forceRerender } = useForceRerender();
const { props, defaultProps, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);
const theme = useColorModeValue<'light' | 'dark'>('light', 'dark');

const settings = computed(() => {
  const { preset: _preset, ...rest } = props.value;
  void _preset;
  return rest;
});

const componentColor = computed(() =>
  theme.value === 'light'
    ? (LIGHT_SWAP[settings.value.color.toLowerCase()] ?? settings.value.color)
    : settings.value.color
);

const surface = computed<Surface>(() =>
  props.value.preset in SURFACES ? SURFACES[props.value.preset] : SURFACES.waterfall
);

const applyPreset = (value: string) => {
  updateProps({ ...presetProps(value, { defaults: defaultProps.value }), preset: value });
  forceRerender();
};

const propData: PropRow[] = [
  {
    name: 'surfaceRef',
    type: 'HTMLElement | null',
    default: '-',
    description: 'Element the beam lands on. The light spreads along its top edge and spills over its corners.'
  },
  {
    name: 'beamPosition',
    type: 'number',
    default: '0.6',
    description: 'Horizontal position of the beam, from 0 at the left edge to 1 at the right edge.'
  },
  {
    name: 'surfaceLevel',
    type: 'number',
    default: '1',
    description: 'Where the beam lands when no surfaceRef is given, from 0 at the top to 1 at the bottom.'
  },
  {
    name: 'color',
    type: 'string',
    default: "'#7cff67'",
    description: 'Color of the light. Every other tone is derived from it.'
  },
  { name: 'intensity', type: 'number', default: '1.8', description: 'Overall brightness of the light.' },
  { name: 'beamWidth', type: 'number', default: '1.5', description: 'Thickness of the beam and its glow.' },
  {
    name: 'flare',
    type: 'number',
    default: '1.5',
    description: 'Size of the splash where the beam meets the surface.'
  },
  { name: 'spread', type: 'number', default: '1.5', description: 'How far the light travels along the surface.' },
  { name: 'spill', type: 'number', default: '1', description: 'How much light pours over the corners of the surface.' },
  { name: 'fog', type: 'number', default: '0.2', description: 'Amount of smoke lit up by the beam. 0 turns it off.' },
  { name: 'dust', type: 'number', default: '1.6', description: 'Amount of glittering dust flowing with the light.' },
  {
    name: 'streaks',
    type: 'number',
    default: '1.5',
    description: 'Brightness of the fine lines flowing along the splash.'
  },
  { name: 'dots', type: 'number', default: '1', description: 'Strength of the fine dot texture in the glow.' },
  { name: 'pulse', type: 'number', default: '1.5', description: 'How much the splash breathes over time.' },
  { name: 'speed', type: 'number', default: '1.5', description: 'Animation speed. 0 holds the light still.' },
  { name: 'seed', type: 'number', default: '3', description: 'Changes the shape of the smoke.' },
  {
    name: 'mouseInteraction',
    type: 'boolean',
    default: 'true',
    description: 'Brightens the light, smoke and dust softly around the cursor.'
  },
  {
    name: 'revealImage',
    type: 'string',
    default: '-',
    description: 'Image revealed through the light around the cursor, such as a screenshot of your UI.'
  },
  {
    name: 'revealRadius',
    type: 'number',
    default: '220',
    description: 'Radius of the reveal around the cursor, in pixels.'
  },
  {
    name: 'revealOpacity',
    type: 'number',
    default: '0.6',
    description: 'Strength of the revealed image. 0 hides it.'
  },
  {
    name: 'intro',
    type: 'boolean',
    default: 'true',
    description: 'Drops the beam in and lets the light run along the surface on mount.'
  },
  { name: 'theme', type: "'dark' | 'light'", default: "'dark'", description: 'Use light for light page backgrounds.' },
  { name: 'paused', type: 'boolean', default: 'false', description: 'Freezes the animation.' },
  { name: 'dpr', type: 'number', default: 'auto', description: 'Maximum device pixel ratio, capped at 2.' },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the container.' }
];
</script>
