<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
    :demo-only-props="['preset', 'decimals', 'from', 'to', 'size', 'weight']"
    :computed-props="computedProps"
  >
    <TabsLayout>
      <template #preview>
        <div class="demo-container relative" style="min-height: 260px; container-type: inline-size">
          <CountUp
            :key="rerenderKey"
            v-bind="settings"
            :from="computedProps.from"
            :to="computedProps.to"
            :decimals="computedProps.decimals"
            class-name="count-up-text"
            :style="{
              fontSize: `min(${props.size}rem, ${Math.round(props.size * 3.4)}cqi)`,
              fontWeight: props.weight
            }"
          />
          <RefreshButton @click="forceRerender" />
        </div>

        <Customize>
          <PreviewSelect
            title="Preset"
            :options="PRESET_OPTIONS"
            :model-value="props.preset"
            @update:model-value="value => applyPreset(String(value))"
          />
          <PreviewSelect
            title="Mode"
            :options="MODE_OPTIONS"
            :model-value="settings.mode"
            @update:model-value="value => change('mode', value as Look['mode'])"
          />
          <PreviewSelect
            title="Easing"
            :options="EASING_OPTIONS"
            :model-value="settings.easing"
            @update:model-value="value => change('easing', value as Look['easing'])"
          />
          <PreviewSelect
            title="Trigger"
            :options="TRIGGER_OPTIONS"
            :model-value="settings.trigger"
            @update:model-value="value => change('trigger', value as Trigger)"
          />
          <PreviewSelect
            title="Direction"
            :model-value="settings.direction"
            :options="DIRECTION_OPTIONS"
            @update:model-value="value => change('direction', value as Look['direction'])"
          />
          <PreviewSlider
            title="Duration"
            :min="0.5"
            :max="10"
            :step="0.1"
            value-unit="s"
            :model-value="settings.duration"
            @update:model-value="value => change('duration', value)"
          />
          <PreviewSlider
            title="Delay"
            :min="0"
            :max="5"
            :step="0.5"
            value-unit="s"
            :model-value="settings.delay"
            @update:model-value="value => change('delay', value)"
          />
          <PreviewSwitch
            title="Replay on Hover"
            :model-value="settings.replayOnHover"
            @update:model-value="value => change('replayOnHover', value)"
          />
          <PreviewInput
            title="To"
            :model-value="props.to"
            placeholder="100"
            :max-length="14"
            @update:model-value="value => change('to', value)"
          />
          <PreviewInput
            title="From"
            :model-value="props.from"
            placeholder="0"
            :max-length="14"
            @update:model-value="value => change('from', value)"
          />
          <PreviewSelect
            title="Format"
            :options="FORMAT_OPTIONS"
            :model-value="settings.format"
            @update:model-value="value => change('format', value as Look['format'])"
          />
          <PreviewSelect
            title="Decimals"
            :options="DECIMAL_OPTIONS"
            :model-value="props.decimals"
            @update:model-value="value => change('decimals', String(value))"
          />
          <PreviewInput
            title="Separator"
            :model-value="settings.separator"
            placeholder=","
            :max-length="1"
            @update:model-value="value => change('separator', value)"
          />
          <PreviewInput
            title="Prefix"
            :model-value="settings.prefix"
            placeholder="$"
            :max-length="4"
            @update:model-value="value => change('prefix', value)"
          />
          <PreviewInput
            title="Suffix"
            :model-value="settings.suffix"
            placeholder="%"
            :max-length="4"
            @update:model-value="value => change('suffix', value)"
          />
          <PreviewSlider
            title="Font Size"
            :min="2"
            :max="8"
            :step="0.5"
            value-unit="rem"
            :model-value="props.size"
            @update:model-value="value => updateProp('size', value)"
          />
          <PreviewSlider
            title="Font Weight"
            :min="300"
            :max="900"
            :step="100"
            :model-value="props.weight"
            @update:model-value="value => updateProp('weight', value)"
          />
        </Customize>

        <PropTable :data="propData" />
        <Dependencies :dependency-list="['motion-v']" />
      </template>

      <template #code>
        <CodeExample :code-object="countUp" component-name="CountUp" />
      </template>
    </TabsLayout>
  </ComponentPropsProvider>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import CodeExample from '@/components/common/CodeExample.vue';
import Customize from '@/components/common/Customize.vue';
import Dependencies from '@/components/common/Dependencies.vue';
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
import { countUp } from '@/constants/code/TextAnimations/countUpCode';
import CountUp from '@/content/TextAnimations/CountUp/CountUp.vue';

type Trigger = 'view' | 'load';

type Look = {
  mode: 'count' | 'roll';
  easing: 'easeOut' | 'linear' | 'expo' | 'spring';
  format: 'standard' | 'compact';
  decimals: string;
  from: string;
  to: string;
  duration: number;
  direction: 'up' | 'down';
  separator: string;
  prefix: string;
  suffix: string;
  replayOnHover: boolean;
  size: number;
  weight: number;
};

const LOOK: Look = {
  mode: 'count',
  easing: 'easeOut',
  format: 'standard',
  decimals: 'auto',
  from: '0',
  to: '100',
  duration: 1,
  direction: 'up',
  separator: ',',
  prefix: '',
  suffix: '',
  replayOnHover: true,
  size: 4,
  weight: 700
};

const PRESETS: Record<string, Look> = {
  classic: { ...LOOK },
  odometer: { ...LOOK, mode: 'roll', easing: 'spring', to: '86420', duration: 2.4, size: 6, weight: 600 },
  revenue: {
    ...LOOK,
    easing: 'expo',
    decimals: '2',
    to: '48250.75',
    duration: 2.2,
    prefix: '$',
    size: 4.5,
    weight: 500
  },
  compact: {
    ...LOOK,
    mode: 'roll',
    format: 'compact',
    to: '3400000',
    duration: 1.8,
    suffix: '+',
    size: 7,
    weight: 800
  }
};

const PRESET_OPTIONS = [
  { value: 'classic', label: 'Classic' },
  { value: 'odometer', label: 'Odometer' },
  { value: 'revenue', label: 'Revenue' },
  { value: 'compact', label: 'Compact' }
];

const MODE_OPTIONS = [
  { value: 'count', label: 'Count' },
  { value: 'roll', label: 'Roll' }
];

const EASING_OPTIONS = [
  { value: 'easeOut', label: 'Ease out' },
  { value: 'linear', label: 'Linear' },
  { value: 'expo', label: 'Expo' },
  { value: 'spring', label: 'Spring' }
];

const FORMAT_OPTIONS = [
  { value: 'standard', label: 'Standard' },
  { value: 'compact', label: 'Compact' }
];

const DECIMAL_OPTIONS = [
  { value: 'auto', label: 'Auto' },
  { value: '0', label: '0' },
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' }
];

const TRIGGER_OPTIONS = [
  { value: 'view', label: 'In view' },
  { value: 'load', label: 'Load' }
];

const DIRECTION_OPTIONS = [
  { value: 'up', label: 'Up' },
  { value: 'down', label: 'Down' }
];

const DEFAULT_PROPS = {
  preset: 'classic',
  ...LOOK,
  trigger: 'view' as Trigger,
  delay: 0
};

type DemoProps = typeof DEFAULT_PROPS;

const propData: PropRow[] = [
  {
    name: 'to',
    type: 'number',
    default: '—',
    description: 'The target number to count up to.'
  },
  {
    name: 'from',
    type: 'number',
    default: '0',
    description: 'The initial number from which the count starts.'
  },
  {
    name: 'mode',
    type: '"count" | "roll"',
    default: '"count"',
    description:
      'Count swaps the digits as the value climbs. Roll turns every digit into a column that spins to its place like an odometer, staggered per column with a soft motion blur while it moves.'
  },
  {
    name: 'easing',
    type: '"easeOut" | "linear" | "expo" | "spring"',
    default: '"easeOut"',
    description: 'Pace of the count. Spring overshoots slightly and settles on the final number.'
  },
  {
    name: 'format',
    type: '"standard" | "compact"',
    default: '"standard"',
    description: 'Compact shortens large numbers to 1.2K, 3.4M or 5.6B.'
  },
  {
    name: 'decimals',
    type: 'number',
    default: 'undefined',
    description: 'Fixed number of decimals. When not set, it follows the decimals in from and to.'
  },
  {
    name: 'direction',
    type: 'string',
    default: '"up"',
    description:
      'Direction of the count; can be "up" or "down". When this is set to "down", "from" and "to" become reversed, in order to count down.'
  },
  {
    name: 'trigger',
    type: '"view" | "load"',
    default: '"view"',
    description: 'View starts the count when the number scrolls into view, load starts it right away.'
  },
  {
    name: 'replayOnHover',
    type: 'boolean',
    default: 'false',
    description: 'Replays the count on hover. In roll mode every column spins once more and lands on the same number.'
  },
  {
    name: 'delay',
    type: 'number',
    default: '0',
    description: 'Delay in seconds before the counting starts.'
  },
  {
    name: 'duration',
    type: 'number',
    default: '2',
    description: 'How long the count takes, in seconds. It lands on the final number right on time.'
  },
  {
    name: 'className',
    type: 'string',
    default: '""',
    description: 'CSS class to apply to the component for additional styling.'
  },
  {
    name: 'style',
    type: 'CSSProperties',
    default: 'undefined',
    description: 'Inline styles for the number, like its font size or weight.'
  },
  {
    name: 'startWhen',
    type: 'boolean',
    default: 'true',
    description:
      'A boolean to control whether the animation should start when the component is in view. It basically works like an if statement, if this is true, the count will start.'
  },
  {
    name: 'separator',
    type: 'string',
    default: '""',
    description: 'Character to use as a thousands separator in the displayed number.'
  },
  {
    name: 'prefix',
    type: 'string',
    default: '""',
    description: 'Text shown before the number, like a currency sign.'
  },
  {
    name: 'suffix',
    type: 'string',
    default: '""',
    description: 'Text shown after the number, like a percent sign or a unit.'
  },
  {
    name: 'onStart',
    type: 'function',
    default: '—',
    description: 'Callback function that is called when the count animation starts.'
  },
  {
    name: 'onEnd',
    type: 'function',
    default: '—',
    description: 'Callback function that is called when the count animation ends.'
  }
];

const toNumber = (value: unknown, fallback: number) => {
  const number = Number(value);
  return value !== '' && Number.isFinite(number) ? number : fallback;
};

const { rerenderKey, forceRerender } = useForceRerender();
const { props, defaultProps, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);

const settings = computed(() => {
  const {
    preset: _preset,
    decimals: _decimals,
    from: _from,
    to: _to,
    size: _size,
    weight: _weight,
    ...rest
  } = props.value;
  return rest;
});

const change = <K extends keyof DemoProps>(name: K, value: DemoProps[K]) => {
  updateProp(name, value);
  forceRerender();
};

const applyPreset = (value: string) => {
  const base = Object.fromEntries(
    (Object.keys(LOOK) as (keyof Look)[]).map(name => [name, defaultProps.value[name]])
  ) as Partial<DemoProps>;
  updateProps({ ...base, ...PRESETS[value], preset: value });
  forceRerender();
};

type ComputedProps = {
  from: number;
  to: number;
  decimals?: number;
  style: { fontSize: string; fontWeight: number };
};

const computedProps = computed<ComputedProps>(() => ({
  from: toNumber(props.value.from, 0),
  to: toNumber(props.value.to, 0),
  ...(props.value.decimals === 'auto' ? {} : { decimals: Number(props.value.decimals) }),
  style: { fontSize: `${props.value.size}rem`, fontWeight: props.value.weight }
}));
</script>
