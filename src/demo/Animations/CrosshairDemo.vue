<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
    :demo-only-props="['scope']"
    :computed-props="computedProps"
  >
    <TabsLayout>
      <template #preview>
        <div ref="containerRef" class="demo-container relative overflow-hidden" style="min-height: 440px">
          <Crosshair
            v-bind="crosshairProps"
            :color="color"
            :container-ref="props.scope === 'viewport' ? null : containerRef"
          />

          <div class="crosshair-demo-content">
            <p data-crosshair-target class="crosshair-demo-title">Built to the pixel</p>
            <p class="crosshair-demo-text">Move around, then hover the buttons and the heading.</p>
            <div class="crosshair-demo-actions">
              <button type="button" class="crosshair-demo-button crosshair-demo-button--primary">Get started</button>
              <a
                href="https://github.com/DavidHDev/vue-bits"
                target="_blank"
                rel="noreferrer"
                class="crosshair-demo-button crosshair-demo-button--ghost"
              >
                View on GitHub
              </a>
            </div>
          </div>
        </div>

        <Customize>
          <PreviewColorPickerCustom
            title="Color"
            :color="color"
            @change="(value: string) => updateProp('color', value)"
          />

          <PreviewSelect
            title="Scope"
            :options="SCOPE_OPTIONS"
            :model-value="props.scope"
            @update:model-value="value => updateProp('scope', String(value))"
          />

          <PreviewSelect
            title="Target Effect"
            :options="EFFECT_OPTIONS"
            :model-value="props.targetEffect"
            @update:model-value="value => updateProp('targetEffect', value as TargetEffect)"
          />

          <PreviewSelect
            title="Line Style"
            :options="LINE_OPTIONS"
            :model-value="props.lineStyle"
            @update:model-value="value => updateProp('lineStyle', value as LineStyle)"
          />

          <PreviewSelect
            title="Blend Mode"
            :options="BLEND_OPTIONS"
            :model-value="props.blendMode"
            @update:model-value="value => updateProp('blendMode', value as BlendMode)"
          />

          <PreviewSlider
            title="Thickness"
            :min="0.5"
            :max="4"
            :step="0.5"
            value-unit="px"
            :model-value="props.thickness"
            @update:model-value="value => updateProp('thickness', value)"
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
            title="Gap"
            :min="0"
            :max="40"
            :step="1"
            value-unit="px"
            :model-value="props.gap"
            @update:model-value="value => updateProp('gap', value)"
          />

          <PreviewSlider
            title="Fade"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.fade"
            @update:model-value="value => updateProp('fade', value)"
          />

          <PreviewSlider
            title="Smoothing"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.smoothing"
            @update:model-value="value => updateProp('smoothing', value)"
          />

          <PreviewSwitch
            title="Coordinates"
            :model-value="props.showCoordinates"
            @update:model-value="value => updateProp('showCoordinates', value)"
          />

          <PreviewSwitch
            title="Click Pulse"
            :model-value="props.clickPulse"
            @update:model-value="value => updateProp('clickPulse', value)"
          />

          <PreviewSwitch
            title="Hide Cursor"
            :model-value="props.hideCursor"
            @update:model-value="value => updateProp('hideCursor', value)"
          />
        </Customize>

        <PropTable :data="propData" />
        <Dependencies :dependency-list="[]" />
      </template>

      <template #code>
        <CodeExample :code-object="crosshair" component-name="Crosshair" />
      </template>
    </TabsLayout>
  </ComponentPropsProvider>
</template>

<script setup lang="ts">
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
import { useColorMode } from '@/composables/useTheme';
import { crosshair } from '@/constants/code/Animations/crosshairCode';
import Crosshair from '@/content/Animations/Crosshair/Crosshair.vue';

type TargetEffect = 'lock' | 'glitch' | 'none';
type LineStyle = 'solid' | 'dashed' | 'dotted';
type BlendMode = 'normal' | 'difference';

const LIGHT_INK = '#161816';

const DEFAULT_PROPS = {
  color: '#ffffff',
  scope: 'container',
  targetEffect: 'lock' as TargetEffect,
  lineStyle: 'solid' as LineStyle,
  blendMode: 'normal' as BlendMode,
  thickness: 1,
  opacity: 0.85,
  gap: 0,
  fade: 0,
  smoothing: 0.35,
  showCoordinates: true,
  clickPulse: true,
  hideCursor: false
};

const SCOPE_OPTIONS = [
  { value: 'container', label: 'Container' },
  { value: 'viewport', label: 'Viewport' }
];

const EFFECT_OPTIONS = [
  { value: 'lock', label: 'Lock' },
  { value: 'glitch', label: 'Glitch' },
  { value: 'none', label: 'None' }
];

const LINE_OPTIONS = [
  { value: 'solid', label: 'Solid' },
  { value: 'dashed', label: 'Dashed' },
  { value: 'dotted', label: 'Dotted' }
];

const BLEND_OPTIONS = [
  { value: 'normal', label: 'Normal' },
  { value: 'difference', label: 'Difference' }
];

const propData: PropRow[] = [
  { name: 'color', type: 'string', default: "'#ffffff'", description: 'Color of the lines, labels and brackets.' },
  {
    name: 'containerRef',
    type: 'HTMLElement | null',
    default: 'null',
    description:
      'Keeps the crosshair inside this element, which needs a position other than static. Without it the crosshair covers the whole viewport.'
  },
  { name: 'thickness', type: 'number', default: '1', description: 'Line thickness in px.' },
  { name: 'opacity', type: 'number', default: '0.85', description: 'Opacity of everything the crosshair draws.' },
  {
    name: 'lineStyle',
    type: "'solid' | 'dashed' | 'dotted'",
    default: "'solid'",
    description: 'Stroke style of the two lines.'
  },
  {
    name: 'gap',
    type: 'number',
    default: '0',
    description: 'Empty space in px left around the pointer where the lines would cross.'
  },
  {
    name: 'fade',
    type: 'number',
    default: '0',
    description: 'How much the lines fade out toward the edges, from 0 to 1.'
  },
  {
    name: 'smoothing',
    type: 'number',
    default: '0.35',
    description: 'How far the lines trail behind the pointer. 0 sticks to it.'
  },
  {
    name: 'showCoordinates',
    type: 'boolean',
    default: 'true',
    description: 'Shows the pointer position where the lines meet the edges, and the size of a locked target.'
  },
  {
    name: 'targetEffect',
    type: "'lock' | 'glitch' | 'none'",
    default: "'lock'",
    description:
      'What happens over a target. Lock frames it with corner brackets and measures it, glitch shakes the lines like a bad signal.'
  },
  {
    name: 'targetSelector',
    type: 'string',
    default: "'a, button, [data-crosshair-target]'",
    description: 'CSS selector for the elements the crosshair reacts to.'
  },
  {
    name: 'clickPulse',
    type: 'boolean',
    default: 'true',
    description: 'Sends a ring out from the pointer on every click or tap.'
  },
  {
    name: 'hideCursor',
    type: 'boolean',
    default: 'false',
    description: 'Hides the system cursor inside the crosshair area and marks the pointer with a dot instead.'
  },
  {
    name: 'blendMode',
    type: "'normal' | 'difference'",
    default: "'normal'",
    description: 'Difference inverts whatever is under the lines, so they stay visible on any background.'
  },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the canvas.' },
  { name: 'style', type: 'StyleValue', default: '-', description: 'Inline styles for the canvas.' }
];

const { props, updateProp, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);
const { isLight } = useColorMode();
const containerRef = useTemplateRef<HTMLElement>('containerRef');

const crosshairProps = computed(() => {
  const { scope: _scope, color: _color, ...rest } = props.value;
  return rest;
});

const inkDefault = computed(() => isLight.value && props.value.color === DEFAULT_PROPS.color);
const color = computed(() => (inkDefault.value ? LIGHT_INK : props.value.color));
const computedProps = computed(() => (inkDefault.value ? { color: LIGHT_INK } : {}));
</script>

<style scoped>
.crosshair-demo-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 0 24px;
  user-select: none;
}

.crosshair-demo-title {
  margin: 0;
  font-size: 2.1rem;
  font-weight: 600;
  letter-spacing: -1.5px;
  line-height: 1.05;
}

.crosshair-demo-text {
  margin: 16px 0 0;
  max-width: 380px;
  color: var(--text-muted);
  font-size: 15px;
}

.crosshair-demo-actions {
  margin-top: 32px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
}

.crosshair-demo-button {
  display: inline-flex;
  align-items: center;
  height: 44px;
  padding: 0 20px;
  border: 0;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 500;
  color: var(--text-primary);
  text-decoration: none;
  cursor: pointer;
}

.crosshair-demo-button--primary {
  background: var(--text-primary);
  color: var(--bg-body);
}

.crosshair-demo-button--ghost {
  background: var(--surface-ghost);
}

.crosshair-demo-button--ghost:hover {
  background: var(--surface-ghost-hover);
}

@media (min-width: 48em) {
  .crosshair-demo-title {
    font-size: 3.4rem;
  }
}
</style>
