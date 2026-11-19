<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
    :computed-props="computedProps"
  >
    <TabsLayout>
      <template #preview>
        <div class="demo-container relative" style="min-height: 480px; padding-top: 40px; padding-bottom: 40px">
          <SpotlightCard
            v-bind="props"
            :spotlight-color="spotlightColor"
            :theme="theme"
            :style="{ width: '100%', maxWidth: '330px', padding: '24px', borderRadius: '28px' }"
          >
            <div class="spotlight-demo-profile" :style="glassVars">
              <div class="spotlight-demo-profile__top">
                <div
                  class="spotlight-demo-profile__avatar"
                  :style="{ backgroundImage: `url(${AVATAR})` }"
                  role="img"
                  aria-label="Ethan Harrison"
                />
                <button type="button" aria-label="Share profile" class="spotlight-demo-profile__share">
                  <HugeiconsIcon :icon="Share03Icon" :size="20" :stroke-width="1.6" />
                </button>
              </div>

              <p class="spotlight-demo-profile__name">Ethan Harrison</p>
              <p class="spotlight-demo-profile__role">Product designer</p>

              <div class="spotlight-demo-profile__skills">
                <span v-for="skill in SKILLS" :key="skill" class="spotlight-demo-profile__skill">{{ skill }}</span>
              </div>

              <div class="spotlight-demo-profile__stats">
                <div v-for="stat in STATS" :key="stat.label" class="spotlight-demo-profile__stat">
                  <div class="spotlight-demo-profile__stat-value">
                    <svg
                      v-if="stat.star"
                      viewBox="0 0 24 24"
                      width="15"
                      height="15"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        d="M12 2.8l2.83 5.73 6.33.92-4.58 4.46 1.08 6.3L12 17.24l-5.66 2.97 1.08-6.3-4.58-4.46 6.33-.92z"
                      />
                    </svg>
                    {{ stat.value }}
                  </div>
                  <p class="spotlight-demo-profile__stat-label">{{ stat.label }}</p>
                </div>
              </div>

              <div class="spotlight-demo-profile__actions">
                <button type="button" class="spotlight-demo-glass spotlight-demo-profile__cta">Get in touch</button>
                <button
                  type="button"
                  :aria-label="saved ? 'Remove bookmark' : 'Bookmark profile'"
                  :aria-pressed="saved"
                  :class="['spotlight-demo-glass', 'spotlight-demo-profile__save', { 'is-saved': saved }]"
                  @click="saved = !saved"
                >
                  <HugeiconsIcon :icon="Bookmark02Icon" :size="20" :stroke-width="1.7" />
                </button>
              </div>
            </div>
          </SpotlightCard>
        </div>

        <Customize>
          <PreviewColorPickerCustom
            title="Spotlight Color"
            :color="inkDefault ? '#18181b' : props.spotlightColor"
            @change="value => updateProp('spotlightColor', value)"
          />

          <PreviewSelect
            title="Shape"
            :options="SHAPE_OPTIONS"
            :model-value="props.shape"
            @update:model-value="value => updateProp('shape', value as SpotlightShape)"
          />

          <PreviewSlider
            title="Intensity"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.intensity"
            @update:model-value="value => updateProp('intensity', value)"
          />

          <PreviewSlider
            title="Size"
            :min="80"
            :max="600"
            :step="10"
            value-unit="px"
            :model-value="props.spotlightSize"
            @update:model-value="value => updateProp('spotlightSize', value)"
          />

          <PreviewSlider
            title="Softness"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.softness"
            @update:model-value="value => updateProp('softness', value)"
          />

          <PreviewSlider
            title="Border Glow"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.borderGlow"
            @update:model-value="value => updateProp('borderGlow', value)"
          />

          <PreviewSlider
            title="Proximity"
            :min="0"
            :max="240"
            :step="10"
            value-unit="px"
            :model-value="props.proximity"
            @update:model-value="value => updateProp('proximity', value)"
          />

          <PreviewSlider
            title="Smoothing"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.smoothing"
            @update:model-value="value => updateProp('smoothing', value)"
          />

          <PreviewSlider
            title="Grain"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.grain"
            @update:model-value="value => updateProp('grain', value)"
          />

          <PreviewSwitch
            title="Ambient"
            :model-value="props.ambient"
            @update:model-value="value => updateProp('ambient', value)"
          />

          <PreviewSwitch
            title="Flare"
            :model-value="props.flare"
            @update:model-value="value => updateProp('flare', value)"
          />
        </Customize>

        <PropTable :data="propData" />
        <Dependencies :dependency-list="[]" />
      </template>

      <template #code>
        <CodeExample :code-object="spotlightCard" component-name="SpotlightCard" />
      </template>
    </TabsLayout>
  </ComponentPropsProvider>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { HugeiconsIcon } from '@hugeicons/vue';
import { Bookmark02Icon, Share03Icon } from '@hugeicons/core-free-icons';
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
import { spotlightCard } from '@/constants/code/Components/spotlightCardCode';
import SpotlightCard, { type SpotlightShape } from '@/content/Components/SpotlightCard/SpotlightCard.vue';

const DEFAULT_PROPS = {
  spotlightColor: '#ffffff',
  intensity: 0.15,
  spotlightSize: 240,
  softness: 0.7,
  shape: 'circle' as SpotlightShape,
  borderGlow: 0.6,
  proximity: 80,
  smoothing: 0.3,
  grain: 0,
  ambient: false,
  flare: true
};

const SHAPE_OPTIONS = [
  { value: 'circle', label: 'Circle' },
  { value: 'beam', label: 'Beam' }
];

const AVATAR =
  'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=240&h=240&fit=crop&crop=focalpoint&fp-x=0.64&fp-y=0.355&fp-z=1.45&sat=-100&q=80';

const SKILLS = ['Figma', 'UX Design'];

const STATS = [
  { value: '4.5', label: 'Rating', star: true },
  { value: '$15K+', label: 'Earned' },
  { value: '$80/hr', label: 'Rate' }
];

const GLASS = {
  dark: {
    bg: 'rgba(255, 255, 255, 0.08)',
    hover: 'rgba(255, 255, 255, 0.13)',
    shadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 10px 24px -12px rgba(0, 0, 0, 0.7)'
  },
  light: {
    bg: 'rgba(24, 24, 27, 0.05)',
    hover: 'rgba(24, 24, 27, 0.08)',
    shadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.9), 0 10px 24px -14px rgba(24, 24, 27, 0.3)'
  }
};

const { props, updateProp, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);
const theme = useColorModeValue<'light' | 'dark'>('light', 'dark');
const saved = ref(false);

const inkDefault = computed(
  () => theme.value === 'light' && props.value.spotlightColor === DEFAULT_PROPS.spotlightColor
);
const spotlightColor = computed(() => (inkDefault.value ? undefined : props.value.spotlightColor));

const computedProps = computed(() => ({
  ...(inkDefault.value ? { spotlightColor: '#18181b' } : {}),
  ...(theme.value === 'light' ? { theme: 'light' } : {})
}));

const glassVars = computed(() => {
  const glass = GLASS[theme.value] ?? GLASS.dark;
  return {
    '--spotlight-demo-glass-bg': glass.bg,
    '--spotlight-demo-glass-hover': glass.hover,
    '--spotlight-demo-glass-shadow': glass.shadow
  };
});

const propData: PropRow[] = [
  { name: 'children', type: 'slot', default: '-', description: 'Content of the card.' },
  {
    name: 'spotlightColor',
    type: 'string',
    default: 'undefined',
    description:
      'Color of the light. Any CSS color works and its alpha is respected. Defaults to white on dark cards and near black on light ones.'
  },
  {
    name: 'intensity',
    type: 'number',
    default: '0.15',
    description: 'Brightness of the light on the card surface, from 0 to 1.'
  },
  {
    name: 'spotlightSize',
    type: 'number',
    default: '240',
    description: 'Radius of the light in px.'
  },
  {
    name: 'softness',
    type: 'number',
    default: '0.7',
    description: 'How gradually the light fades out. 0 gives a crisp disc, 1 a soft glow that fades from the center.'
  },
  {
    name: 'shape',
    type: "'circle' | 'beam'",
    default: "'circle'",
    description:
      'Circle is a round spotlight around the pointer. Beam pours light down from the top edge toward it, like a stage light.'
  },
  {
    name: 'borderGlow',
    type: 'number',
    default: '0.6',
    description: 'How much the card edge catches the light near the pointer, from 0 to 1.'
  },
  {
    name: 'proximity',
    type: 'number',
    default: '80',
    description:
      'Distance in px outside the card at which the light starts to reach it. Cards placed together share one light this way. 0 lights a card only while hovered.'
  },
  {
    name: 'smoothing',
    type: 'number',
    default: '0.3',
    description: 'How far the light floats behind the pointer. 0 sticks to it.'
  },
  {
    name: 'ambient',
    type: 'boolean',
    default: 'false',
    description:
      'Lets the light drift slowly across the card while nothing points at it, which keeps cards alive on touch screens.'
  },
  {
    name: 'flare',
    type: 'boolean',
    default: 'true',
    description: 'The light swells and brightens while the card is pressed.'
  },
  {
    name: 'grain',
    type: 'number',
    default: '0',
    description: 'Film grain inside the light, from 0 to 1. A little removes banding from large soft gradients.'
  },
  {
    name: 'theme',
    type: "'dark' | 'light'",
    default: "'dark'",
    description:
      'Surface, border and light treatment for dark or light pages. Override the colors with the --spotlight-card-surface and --spotlight-card-border CSS variables.'
  },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the card.' },
  { name: 'style', type: 'StyleValue', default: '-', description: 'Inline styles for the card.' },
  {
    name: '...attrs',
    type: 'HTMLAttributes',
    default: '-',
    description: 'Any other attributes and listeners, such as @click, id or aria attributes, are passed to the card.'
  }
];
</script>

<style>
.spotlight-demo-profile {
  display: flex;
  flex-direction: column;
  user-select: none;
}

.spotlight-demo-profile__top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.spotlight-demo-profile__avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #9a9a9a;
  background-size: cover;
  background-position: 50% 50%;
  background-repeat: no-repeat;
}

.spotlight-demo-profile__share {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  margin-right: -6px;
  margin-top: -4px;
  border: none;
  border-radius: 50%;
  color: inherit;
  background: transparent;
  cursor: pointer;
}

.spotlight-demo-profile__share:hover {
  background: var(--surface-ghost);
}

.spotlight-demo-profile__name {
  margin: 1rem 0 0;
  font-size: 1.45rem;
  font-weight: 500;
  letter-spacing: -0.4px;
  line-height: 1.2;
}

.spotlight-demo-profile__role {
  margin: 0.25rem 0 0;
  font-size: 15px;
  color: var(--text-muted);
}

.spotlight-demo-profile__skills {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.875rem;
}

.spotlight-demo-profile__skill {
  padding: 5px 10px;
  border-radius: 8px;
  background: var(--surface-ghost);
  font-size: 12px;
  font-weight: 500;
  line-height: 1;
}

.spotlight-demo-profile__stats {
  display: flex;
  align-items: stretch;
  margin-top: 1.5rem;
}

.spotlight-demo-profile__stat {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.spotlight-demo-profile__stat-value {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 15px;
  font-weight: 500;
}

.spotlight-demo-profile__stat-label {
  margin: 0;
  font-size: 12px;
  color: var(--text-muted);
}

.spotlight-demo-profile__actions {
  display: flex;
  gap: 0.625rem;
  margin-top: 1.5rem;
}

.spotlight-demo-glass {
  border: none;
  background: var(--spotlight-demo-glass-bg);
  box-shadow: var(--spotlight-demo-glass-shadow);
  backdrop-filter: blur(14px) saturate(1.6);
  -webkit-backdrop-filter: blur(14px) saturate(1.6);
  color: inherit;
  font: inherit;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.spotlight-demo-glass:hover {
  background: var(--spotlight-demo-glass-hover);
}

.spotlight-demo-profile__cta {
  flex: 1;
  height: 48px;
  border-radius: 999px;
  font-size: 15px;
  font-weight: 500;
}

.spotlight-demo-profile__save {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
}

.spotlight-demo-profile__save.is-saved,
.spotlight-demo-profile__save.is-saved:hover {
  background: var(--text-primary);
  color: var(--bg-body);
}
</style>
