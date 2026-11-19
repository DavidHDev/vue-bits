<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
    :demo-only-props="['demo', 'textColor', 'formatName']"
    :computed-props="computedProps"
  >
    <TabsLayout>
      <template #preview>
        <div class="demo-container relative overflow-hidden" style="height: 500px; padding: 0">
          <div :key="sceneKey" class="cd-scene" :data-theme="theme">
            <div v-if="props.demo === 'countdown'" class="cd-card cd-countdown">
              <span class="cd-countdown__title">Public beta opens in</span>
              <div class="cd-countdown__units">
                <div v-for="([unit, name], index) in UNITS" :key="unit" style="display: contents">
                  <span v-if="index > 0" class="cd-countdown__colon" aria-hidden="true">:</span>
                  <div class="cd-countdown__unit">
                    <Counter
                      v-bind="motion"
                      :direction="motion.direction === 'auto' ? 'down' : motion.direction"
                      :value="time[unit]"
                      :min-digits="2"
                      font-size="var(--cd-count-size)"
                      :font-weight="600"
                      :gap="6"
                      :fade="0"
                      :text-color="props.textColor || undefined"
                      :digit-style="TILE"
                    />
                    <span class="cd-countdown__label">{{ name }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div v-else-if="props.demo === 'pricing'" class="cd-card cd-pricing">
              <div class="cd-pricing__head">
                <span class="cd-pricing__plan">Team</span>
                <div class="cd-segment" role="group" aria-label="Billing period">
                  <button type="button" :aria-pressed="!yearly" @click="yearly = false">Monthly</button>
                  <button type="button" :aria-pressed="yearly" @click="yearly = true">Yearly</button>
                </div>
              </div>
              <div class="cd-pricing__price">
                <Counter
                  v-bind="motion"
                  :value="total"
                  :format="USD"
                  :decimals="0"
                  :font-size="52"
                  :font-weight="600"
                  :text-color="props.textColor || undefined"
                />
                <span class="cd-pricing__period">{{ yearly ? '/ year' : '/ month' }}</span>
              </div>
              <div class="cd-pricing__note">
                <Counter v-bind="motion" :value="perSeat" :format="USD" :decimals="0" :font-size="14" :intro="false" />
                <span>&nbsp;per seat, billed {{ yearly ? 'yearly' : 'monthly' }}</span>
              </div>
              <div class="cd-pricing__seats">
                <span>Seats</span>
                <div class="cd-stepper">
                  <button
                    type="button"
                    class="cd-button"
                    aria-label="Remove a seat"
                    :disabled="seats <= 1"
                    @click="seats = Math.max(1, seats - 1)"
                  >
                    <HugeiconsIcon :icon="MinusSignIcon" :size="16" :stroke-width="2" />
                  </button>
                  <span class="cd-stepper__value">
                    <Counter v-bind="motion" :value="seats" :font-size="17" :font-weight="600" :intro="false" />
                  </span>
                  <button
                    type="button"
                    class="cd-button"
                    aria-label="Add a seat"
                    :disabled="seats >= 99"
                    @click="seats = Math.min(99, seats + 1)"
                  >
                    <HugeiconsIcon :icon="PlusSignIcon" :size="16" :stroke-width="2" />
                  </button>
                </div>
              </div>
            </div>

            <div v-else-if="props.demo === 'dashboard'" class="cd-card cd-dashboard">
              <div class="cd-dashboard__head">
                <span>Revenue this month</span>
                <span class="cd-dashboard__live">Live</span>
              </div>
              <div class="cd-dashboard__total">
                <Counter
                  v-bind="motion"
                  :value="stats.revenue"
                  :format="USD"
                  :decimals="2"
                  font-size="var(--cd-total-size)"
                  :font-weight="600"
                  :text-color="props.textColor || undefined"
                />
              </div>
              <span class="cd-dashboard__trend">12.4% more than last month</span>
              <div class="cd-dashboard__stats">
                <div class="cd-dashboard__stat">
                  <span>Active now</span>
                  <Counter v-bind="motion" :value="stats.active" :font-size="24" :font-weight="600" />
                </div>
                <div class="cd-dashboard__stat">
                  <span>Orders</span>
                  <Counter v-bind="motion" :value="stats.orders" :font-size="24" :font-weight="600" />
                </div>
                <div class="cd-dashboard__stat">
                  <span>Conversion</span>
                  <Counter
                    v-bind="motion"
                    :value="stats.conversion"
                    :format="PERCENT"
                    :decimals="2"
                    :font-size="24"
                    :font-weight="600"
                  />
                </div>
              </div>
            </div>

            <div v-else class="cd-basic">
              <Counter
                v-bind="settings"
                class-name="cd-basic__number"
                :format="FORMATS[props.formatName]"
                :font-size="`min(${settings.fontSize}px, 15cqw)`"
                :text-color="props.textColor || undefined"
              />
              <div class="cd-basic__actions">
                <button
                  type="button"
                  class="cd-button"
                  aria-label="Decrease"
                  @click="updateProp('value', Math.max(0, settings.value - 1))"
                >
                  <HugeiconsIcon :icon="MinusSignIcon" :size="18" :stroke-width="2" />
                </button>
                <button
                  type="button"
                  class="cd-button"
                  aria-label="Increase"
                  @click="updateProp('value', settings.value + 1)"
                >
                  <HugeiconsIcon :icon="PlusSignIcon" :size="18" :stroke-width="2" />
                </button>
                <button type="button" class="cd-button" aria-label="Random value" @click="randomValue">
                  <HugeiconsIcon :icon="ShuffleIcon" :size="18" :stroke-width="1.75" />
                </button>
              </div>
            </div>
          </div>
          <RefreshButton @click="forceRerender" />
        </div>

        <Customize>
          <PreviewSelect
            title="Demo"
            :options="DEMO_OPTIONS"
            :model-value="props.demo"
            @update:model-value="value => updateProp('demo', value as DemoName)"
          />
          <PreviewColorPickerCustom
            title="Text Color"
            :color="props.textColor || ink"
            @change="value => updateProp('textColor', value)"
          />
          <PreviewSelect
            title="Format"
            :options="FORMAT_OPTIONS"
            :model-value="props.formatName"
            :is-disabled="!basic"
            @update:model-value="value => updateProp('formatName', value as FormatName)"
          />
          <PreviewSelect
            title="Direction"
            :options="DIRECTION_OPTIONS"
            :model-value="settings.direction"
            @update:model-value="value => updateProp('direction', value as Direction)"
          />
          <PreviewSlider
            title="Duration"
            :min="0.2"
            :max="2"
            :step="0.05"
            value-unit="s"
            :model-value="settings.duration"
            @update:model-value="value => updateProp('duration', value)"
          />
          <PreviewSlider
            title="Bounce"
            :min="0"
            :max="0.6"
            :step="0.05"
            :model-value="settings.bounce"
            @update:model-value="value => updateProp('bounce', value)"
          />
          <PreviewSlider
            title="Stagger"
            :min="0"
            :max="0.15"
            :step="0.01"
            value-unit="s"
            :model-value="settings.stagger"
            @update:model-value="value => updateProp('stagger', value)"
          />
          <PreviewSlider
            title="Fade"
            :min="0"
            :max="0.6"
            :step="0.05"
            value-unit="em"
            :is-disabled="props.demo === 'countdown'"
            :model-value="settings.fade"
            @update:model-value="value => updateProp('fade', value)"
          />
          <PreviewSlider
            title="Value"
            :min="0"
            :max="99999"
            :step="1"
            :is-disabled="!basic"
            :model-value="settings.value"
            @update:model-value="value => updateProp('value', value)"
          />
          <PreviewSlider
            title="Font Size"
            :min="24"
            :max="160"
            :step="1"
            value-unit="px"
            :is-disabled="!basic"
            :model-value="settings.fontSize"
            @update:model-value="value => updateProp('fontSize', value)"
          />
          <PreviewSlider
            title="Font Weight"
            :min="300"
            :max="900"
            :step="100"
            :is-disabled="!basic"
            :model-value="settings.fontWeight"
            @update:model-value="value => updateProp('fontWeight', value)"
          />
          <PreviewSlider
            title="Gap"
            :min="0"
            :max="24"
            :step="1"
            value-unit="px"
            :is-disabled="!basic"
            :model-value="settings.gap"
            @update:model-value="value => updateProp('gap', value)"
          />
          <PreviewSlider
            title="Decimals"
            :min="0"
            :max="3"
            :step="1"
            :is-disabled="!basic"
            :model-value="settings.decimals"
            @update:model-value="value => updateProp('decimals', value)"
          />
          <PreviewSlider
            title="Min Digits"
            :min="1"
            :max="8"
            :step="1"
            :is-disabled="!basic"
            :model-value="settings.minDigits"
            @update:model-value="value => updateProp('minDigits', value)"
          />
          <PreviewSwitch
            title="Motion Blur"
            :model-value="settings.motionBlur"
            @update:model-value="value => updateProp('motionBlur', value)"
          />
          <PreviewSwitch
            title="Intro"
            :model-value="settings.intro"
            @update:model-value="value => updateProp('intro', value)"
          />
          <PreviewSwitch
            title="Tabular"
            :is-disabled="!basic"
            :model-value="settings.tabular"
            @update:model-value="value => updateProp('tabular', value)"
          />
        </Customize>

        <PropTable :data="propData" />
      </template>

      <template #code>
        <CodeExample :code-object="counter" component-name="Counter" />
      </template>
    </TabsLayout>
  </ComponentPropsProvider>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import { HugeiconsIcon } from '@hugeicons/vue';
import { MinusSignIcon, PlusSignIcon, ShuffleIcon } from '@hugeicons/core-free-icons';
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
import { counter } from '@/constants/code/Components/counterCode';
import Counter from '@/content/Components/Counter/Counter.vue';

type DemoName = 'countdown' | 'pricing' | 'dashboard' | 'basic';
type FormatName = 'number' | 'currency' | 'compact' | 'unit';
type Direction = 'auto' | 'up' | 'down' | 'shortest';
type Unit = 'days' | 'hours' | 'minutes' | 'seconds';

const USD: Intl.NumberFormatOptions = { style: 'currency', currency: 'USD' };
const PERCENT: Intl.NumberFormatOptions = { style: 'percent' };
const LAUNCH = ((2 * 24 + 14) * 60 + 37) * 60 + 9;

const FORMATS: Record<FormatName, Intl.NumberFormatOptions | undefined> = {
  number: undefined,
  currency: USD,
  compact: { notation: 'compact' },
  unit: { style: 'unit', unit: 'kilometer-per-hour' }
};

const TILE = {
  padding: '0.18em 0.14em',
  borderRadius: '0.18em',
  background: 'var(--cd-tile)',
  boxShadow: 'var(--cd-tile-edge)'
};

const UNITS: [Unit, string][] = [
  ['days', 'Days'],
  ['hours', 'Hours'],
  ['minutes', 'Minutes'],
  ['seconds', 'Seconds']
];

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const DEFAULT_PROPS = {
  demo: 'countdown' as DemoName,
  textColor: '',
  formatName: 'number' as FormatName,
  direction: 'auto' as Direction,
  duration: 0.7,
  bounce: 0.2,
  stagger: 0.04,
  fade: 0.3,
  value: 1284,
  fontSize: 120,
  fontWeight: 600,
  gap: 0,
  decimals: 0,
  minDigits: 1,
  motionBlur: true,
  intro: true,
  tabular: true
};

const DEMO_OPTIONS = [
  { value: 'countdown', label: 'Countdown' },
  { value: 'pricing', label: 'Pricing' },
  { value: 'dashboard', label: 'Dashboard' },
  { value: 'basic', label: 'Basic' }
];

const FORMAT_OPTIONS = [
  { value: 'number', label: 'Number' },
  { value: 'currency', label: 'Currency' },
  { value: 'compact', label: 'Compact' },
  { value: 'unit', label: 'Unit' }
];

const DIRECTION_OPTIONS = [
  { value: 'auto', label: 'Auto' },
  { value: 'up', label: 'Up' },
  { value: 'down', label: 'Down' },
  { value: 'shortest', label: 'Shortest' }
];

const propData: PropRow[] = [
  { name: 'value', type: 'number', default: '0', description: 'The number to show. Digits roll to every new value.' },
  {
    name: 'locale',
    type: 'string',
    default: "'en-US'",
    description: 'Locale used for separators, symbols and numerals.'
  },
  {
    name: 'format',
    type: 'Intl.NumberFormatOptions',
    default: '-',
    description: 'Formatting options such as currency, percent, units or compact notation.'
  },
  {
    name: 'decimals',
    type: 'number',
    default: '-',
    description: 'Fixed number of decimal places. Leave it out to use the format defaults.'
  },
  { name: 'minDigits', type: 'number', default: '1', description: 'Pads the whole part with leading zeros.' },
  {
    name: 'prefix',
    type: 'string | slot',
    default: '-',
    description: 'Content shown before the number. Use the prefix slot for markup.'
  },
  {
    name: 'suffix',
    type: 'string | slot',
    default: '-',
    description: 'Content shown after the number. Use the suffix slot for markup.'
  },
  {
    name: 'direction',
    type: "'auto' | 'up' | 'down' | 'shortest'",
    default: "'auto'",
    description: 'Which way digits roll. Auto rolls up as the number grows and down as it shrinks.'
  },
  { name: 'duration', type: 'number', default: '0.7', description: 'Roughly how long a roll takes, in seconds.' },
  {
    name: 'bounce',
    type: 'number',
    default: '0.2',
    description: 'How much digits overshoot before settling, from 0 to 0.9.'
  },
  {
    name: 'stagger',
    type: 'number',
    default: '0.04',
    description: 'Delay in seconds between neighbouring digits, so changes ripple from the right.'
  },
  {
    name: 'motionBlur',
    type: 'boolean',
    default: 'true',
    description: 'Blurs digits along their path while they spin fast.'
  },
  {
    name: 'intro',
    type: 'boolean',
    default: 'true',
    description: 'Spins every digit once and lands it when the counter first scrolls into view.'
  },
  {
    name: 'fade',
    type: 'number',
    default: '0.3',
    description: 'How far in em digits roll beyond the text before fading out. 0 clips them at the edge.'
  },
  {
    name: 'fontSize',
    type: 'number | string',
    default: '100',
    description: 'Font size in px, or any CSS size such as inherit.'
  },
  { name: 'fontWeight', type: 'number | string', default: "'inherit'", description: 'Font weight of the number.' },
  { name: 'textColor', type: 'string', default: "'inherit'", description: 'Color of the number.' },
  { name: 'gap', type: 'number', default: '0', description: 'Space between digits and symbols in px.' },
  {
    name: 'padding',
    type: 'number',
    default: '0',
    description: 'Extra height in px added to each digit, which also spaces out rolling digits.'
  },
  {
    name: 'tabular',
    type: 'boolean',
    default: 'true',
    description: 'Keeps every digit the same width. When off, widths ease between digits as they roll.'
  },
  {
    name: 'digitStyle',
    type: 'CSSProperties',
    default: '-',
    description: 'Styles for each digit box, for example a tile background with padding and radius.'
  },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the root.' },
  { name: 'style', type: 'CSSProperties', default: '-', description: 'Inline styles for the root.' }
];

const { rerenderKey, forceRerender } = useForceRerender();
const { props, updateProp, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);
const theme = useColorModeValue('light', 'dark');
const ink = useColorModeValue('#161816', '#f4f5f4');

const settings = computed(() => {
  const { demo: _demo, textColor: _textColor, formatName: _formatName, ...rest } = props.value;
  return rest;
});
const basic = computed(() => props.value.demo === 'basic');
const motion = computed(() => ({
  direction: settings.value.direction,
  duration: settings.value.duration,
  bounce: settings.value.bounce,
  stagger: settings.value.stagger,
  fade: settings.value.fade,
  motionBlur: settings.value.motionBlur,
  intro: settings.value.intro
}));

const computedProps = computed(() => ({
  ...(FORMATS[props.value.formatName] ? { format: FORMATS[props.value.formatName] } : {}),
  ...(props.value.textColor ? { textColor: props.value.textColor } : {})
}));

const sceneKey = computed(() => `${rerenderKey.value}-${props.value.demo}`);

const left = ref(LAUNCH);
const yearly = ref(false);
const seats = ref(5);
const stats = ref({ revenue: 48203.17, active: 1284, orders: 932, conversion: 0.0342 });

const perSeat = computed(() => (yearly.value ? 19 : 24));
const total = computed(() => seats.value * perSeat.value * (yearly.value ? 12 : 1));

const time = computed<Record<Unit, number>>(() => ({
  days: Math.floor(left.value / 86400),
  hours: Math.floor(left.value / 3600) % 24,
  minutes: Math.floor(left.value / 60) % 60,
  seconds: left.value % 60
}));

let timer: ReturnType<typeof setInterval> | null = null;

const stopTimer = () => {
  if (timer) clearInterval(timer);
  timer = null;
};

watch(
  sceneKey,
  () => {
    stopTimer();
    const demo = props.value.demo;
    if (demo === 'countdown') {
      left.value = LAUNCH;
      const end = Date.now() + LAUNCH * 1000;
      timer = setInterval(() => {
        left.value = Math.max(0, Math.round((end - Date.now()) / 1000));
      }, 1000);
    } else if (demo === 'pricing') {
      yearly.value = false;
      seats.value = 5;
    } else if (demo === 'dashboard') {
      stats.value = { revenue: 48203.17, active: 1284, orders: 932, conversion: 0.0342 };
      timer = setInterval(() => {
        const current = stats.value;
        stats.value = {
          revenue: Math.round((current.revenue + 4 + Math.random() * 260) * 100) / 100,
          active: clamp(current.active + Math.round((Math.random() - 0.45) * 46), 960, 1980),
          orders: current.orders + (Math.random() < 0.65 ? 1 + Math.floor(Math.random() * 3) : 0),
          conversion: clamp(current.conversion + (Math.random() - 0.48) * 0.0016, 0.028, 0.046)
        };
      }, 1800);
    }
  },
  { immediate: true }
);

onBeforeUnmount(stopTimer);

const randomValue = () => {
  const scale = 10 ** settings.value.decimals;
  updateProp('value', Math.round(Math.random() * 99999 * scale) / scale);
};
</script>

<style>
.cd-scene {
  --cd-surface: linear-gradient(180deg, #1b1d1b 0%, #131513 100%);
  --cd-surface-edge: inset 0 0 0 1px rgba(255, 255, 255, 0.07), inset 0 1px 0 rgba(255, 255, 255, 0.08);
  --cd-surface-drop: 0 30px 60px -36px rgba(0, 0, 0, 0.9);
  --cd-tile: linear-gradient(180deg, #363a36 0%, #252825 100%);
  --cd-tile-edge: inset 0 0 0 1px rgba(255, 255, 255, 0.07), inset 0 1px 0 rgba(255, 255, 255, 0.12);
  --cd-well: rgba(255, 255, 255, 0.05);
  --cd-ink: #f4f5f4;
  --cd-muted: rgba(244, 245, 244, 0.58);
  --cd-faint: rgba(244, 245, 244, 0.34);
  --cd-hover: rgba(255, 255, 255, 0.06);
  container: cd / inline-size;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  place-items: center;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 24px 16px;
  color: var(--cd-ink);
}

.cd-scene[data-theme='light'] {
  --cd-surface: linear-gradient(180deg, #ffffff 0%, #f8f9f8 100%);
  --cd-surface-edge: inset 0 0 0 1px rgba(22, 24, 22, 0.08), inset 0 1px 0 #ffffff;
  --cd-surface-drop: 0 30px 60px -38px rgba(22, 24, 22, 0.4);
  --cd-tile: linear-gradient(180deg, #ffffff 0%, #f0f2f0 100%);
  --cd-tile-edge: inset 0 0 0 1px rgba(22, 24, 22, 0.08), inset 0 1px 0 #ffffff, 0 1px 2px rgba(22, 24, 22, 0.06);
  --cd-well: rgba(22, 24, 22, 0.045);
  --cd-ink: #161816;
  --cd-muted: rgba(22, 24, 22, 0.56);
  --cd-faint: rgba(22, 24, 22, 0.34);
  --cd-hover: rgba(22, 24, 22, 0.05);
}

.cd-card {
  box-sizing: border-box;
  border-radius: 24px;
  background: var(--cd-surface);
  box-shadow: var(--cd-surface-edge), var(--cd-surface-drop);
}

.cd-button {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  padding: 0;
  border: 0;
  border-radius: 12px;
  background: var(--cd-tile);
  box-shadow: var(--cd-tile-edge);
  color: var(--cd-ink);
  cursor: pointer;
  transition:
    filter 0.2s ease,
    transform 0.2s ease;
  -webkit-tap-highlight-color: transparent;
}

.cd-button:hover {
  filter: brightness(1.06);
}

.cd-button:active {
  transform: scale(0.94);
}

.cd-button:disabled {
  opacity: 0.4;
  cursor: default;
  filter: none;
  transform: none;
}

.cd-button:focus-visible,
.cd-segment button:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}

.cd-countdown {
  --cd-count-size: 56px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 22px;
  padding: 28px 32px 26px;
}

.cd-countdown__title {
  color: var(--cd-muted);
  font-size: 15px;
  line-height: 20px;
}

.cd-countdown__units {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.cd-countdown__unit {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.cd-countdown__label {
  color: var(--cd-muted);
  font-size: 13px;
  line-height: 16px;
}

.cd-countdown__colon {
  display: grid;
  place-items: center;
  height: calc(var(--cd-count-size) * 1.36);
  color: var(--cd-faint);
  font-size: calc(var(--cd-count-size) * 0.6);
  font-weight: 500;
  line-height: 1;
}

.cd-pricing {
  display: flex;
  flex-direction: column;
  width: min(380px, 100%);
  padding: 22px;
}

.cd-pricing__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.cd-pricing__plan {
  font-size: 17px;
  font-weight: 600;
  letter-spacing: -0.01em;
}

.cd-segment {
  display: flex;
  padding: 3px;
  border-radius: 12px;
  background: var(--cd-well);
}

.cd-segment button {
  height: 30px;
  padding: 0 12px;
  border: 0;
  border-radius: 9px;
  background: transparent;
  color: var(--cd-muted);
  font: inherit;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition:
    color 0.2s ease,
    background-color 0.2s ease,
    box-shadow 0.2s ease;
}

.cd-segment button[aria-pressed='true'] {
  background: var(--cd-tile);
  box-shadow: var(--cd-tile-edge);
  color: var(--cd-ink);
}

.cd-pricing__price {
  display: flex;
  align-items: baseline;
  margin-top: 26px;
}

.cd-pricing__period {
  margin-left: 6px;
  color: var(--cd-muted);
  font-size: 15px;
}

.cd-pricing__note {
  display: flex;
  align-items: baseline;
  margin-top: 6px;
  color: var(--cd-muted);
  font-size: 14px;
  line-height: 20px;
}

.cd-pricing__seats {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 26px;
  font-size: 15px;
}

.cd-stepper {
  display: flex;
  align-items: center;
  gap: 4px;
}

.cd-stepper .cd-button {
  width: 34px;
  height: 34px;
  border-radius: 10px;
}

.cd-stepper__value {
  display: grid;
  place-items: center;
  min-width: 44px;
  font-size: 17px;
  font-weight: 600;
}

.cd-dashboard {
  --cd-total-size: 52px;
  display: flex;
  flex-direction: column;
  width: min(560px, 100%);
  padding: 22px 24px;
}

.cd-dashboard__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--cd-muted);
  font-size: 14px;
  line-height: 20px;
}

.cd-dashboard__live {
  display: flex;
  align-items: center;
  gap: 8px;
}

.cd-dashboard__live::before {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: currentColor;
  content: '';
  animation: cd-pulse 2s ease-in-out infinite;
}

.cd-dashboard__total {
  margin-top: 10px;
}

.cd-dashboard__trend {
  margin-top: 6px;
  color: var(--cd-muted);
  font-size: 14px;
  line-height: 20px;
}

.cd-dashboard__stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-top: 26px;
}

.cd-dashboard__stat {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.cd-dashboard__stat > span:first-child {
  color: var(--cd-muted);
  font-size: 13px;
  line-height: 16px;
}

.cd-basic {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 36px;
  max-width: 100%;
}

.cd-basic__number {
  max-width: 100%;
}

.cd-basic__actions {
  display: flex;
  gap: 10px;
}

@keyframes cd-pulse {
  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.35;
  }
}

@media (prefers-reduced-motion: reduce) {
  .cd-dashboard__live::before {
    animation: none;
  }
}

@container cd (max-width: 520px) {
  .cd-countdown {
    --cd-count-size: 34px;
    padding: 22px 18px 20px;
  }

  .cd-countdown__units {
    gap: 4px;
  }

  .cd-dashboard {
    --cd-total-size: 40px;
  }

  .cd-dashboard__stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    row-gap: 16px;
  }

  .cd-dashboard__stat:last-child {
    grid-column: span 2;
  }
}

@container cd (max-width: 400px) {
  .cd-countdown {
    --cd-count-size: 28px;
    gap: 18px;
    padding: 20px 14px 18px;
  }

  .cd-countdown__units {
    gap: 2px;
  }
}
</style>
