<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
    :demo-only-props="['iconPattern', 'backdropColor']"
    :computed-props="computedProps"
  >
    <TabsLayout>
      <template #preview>
        <div class="demo-container relative overflow-hidden" style="height: 640px">
          <ProfileCard
            :key="rerenderKey"
            name="Javi A. Torres"
            title="Software Engineer"
            handle="javicodes"
            status="Online"
            contact-text="Contact"
            avatar-url="/assets/demo/person.webp"
            :icon-url="iconUrl"
            :backdrop-color="props.backdropColor || undefined"
            :theme="theme"
            v-bind="settings"
          />
          <RefreshButton @click="forceRerender" />
        </div>

        <Customize>
          <PreviewColorPickerCustom
            title="Backdrop Color"
            :color="props.backdropColor || (theme === 'light' ? '#f6f8f6' : '#2e312e')"
            @change="value => updateProp('backdropColor', value)"
          />

          <PreviewSlider
            title="Holo"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.holo"
            @update:model-value="value => updateProp('holo', value)"
          />

          <PreviewSlider
            title="Glare"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.glare"
            @update:model-value="value => updateProp('glare', value)"
          />

          <PreviewSlider
            title="Tilt Strength"
            :min="0"
            :max="25"
            :step="1"
            value-unit="°"
            :model-value="settings.tiltStrength"
            @update:model-value="value => updateProp('tiltStrength', value)"
          />

          <PreviewSlider
            title="Parallax"
            :min="0"
            :max="20"
            :step="1"
            value-unit="px"
            :model-value="settings.parallax"
            @update:model-value="value => updateProp('parallax', value)"
          />

          <PreviewSlider
            title="Radius"
            :min="0"
            :max="28"
            :step="1"
            value-unit="px"
            :model-value="settings.radius"
            @update:model-value="value => updateProp('radius', value)"
          />

          <PreviewSwitch
            title="Icon Pattern"
            :model-value="props.iconPattern"
            @update:model-value="value => updateProp('iconPattern', value)"
          />

          <PreviewSwitch
            title="Tilt"
            :model-value="settings.enableTilt"
            @update:model-value="value => updateProp('enableTilt', value)"
          />

          <PreviewSwitch
            title="Intro"
            :model-value="settings.intro"
            @update:model-value="
              value => {
                updateProp('intro', value);
                forceRerender();
              }
            "
          />

          <PreviewSwitch
            title="User Info"
            :model-value="settings.showUserInfo"
            @update:model-value="value => updateProp('showUserInfo', value)"
          />

          <PreviewSwitch
            title="Mobile Tilt"
            :model-value="settings.enableMobileTilt"
            @update:model-value="value => updateProp('enableMobileTilt', value)"
          />
        </Customize>

        <PropTable :data="propData" />
        <Dependencies :dependency-list="['@hugeicons/vue', '@hugeicons/core-free-icons']" />
      </template>

      <template #code>
        <CodeExample :code-object="profileCard" component-name="ProfileCard" />
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
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import RefreshButton from '@/components/common/RefreshButton.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import ComponentPropsProvider from '@/components/context/ComponentPropsProvider.vue';
import { useComponentProps } from '@/composables/useComponentProps';
import { useForceRerender } from '@/composables/useForceRerender';
import { useColorModeValue } from '@/composables/useTheme';
import { profileCard } from '@/constants/code/Components/profileCardCode';
import ProfileCard from '@/content/Components/ProfileCard/ProfileCard.vue';

const DEFAULT_PROPS = {
  iconPattern: true,
  backdropColor: '',
  holo: 0.8,
  glare: 0.5,
  tiltStrength: 12,
  parallax: 8,
  radius: 16,
  enableTilt: true,
  intro: true,
  showUserInfo: true,
  enableMobileTilt: false
};

const { rerenderKey, forceRerender } = useForceRerender();
const { props, updateProp, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);
const theme = useColorModeValue<'light' | 'dark'>('light', 'dark');

const settings = computed(() => {
  const { iconPattern: _iconPattern, backdropColor: _backdropColor, ...rest } = props.value;
  return rest;
});

const iconUrl = computed(() => (props.value.iconPattern ? '/assets/demo/iconpattern.png' : undefined));

const computedProps = computed(() => ({
  ...(iconUrl.value ? { iconUrl: iconUrl.value } : {}),
  ...(props.value.backdropColor ? { backdropColor: props.value.backdropColor } : {}),
  ...(theme.value === 'light' ? { theme: 'light' } : {})
}));

const propData: PropRow[] = [
  { name: 'avatarUrl', type: 'string', default: "''", description: 'Portrait shown on the card.' },
  {
    name: 'iconUrl',
    type: 'string',
    default: '-',
    description: 'Tileable pattern, like a logo pattern. The holo foil shows only through it.'
  },
  {
    name: 'miniAvatarUrl',
    type: 'string',
    default: '-',
    description: 'Small round image next to the handle. Hidden when not set.'
  },
  { name: 'name', type: 'string', default: "'Javi A. Torres'", description: 'Name shown over the portrait.' },
  { name: 'title', type: 'string', default: "'Software Engineer'", description: 'Role shown under the name.' },
  { name: 'handle', type: 'string', default: "'javicodes'", description: 'Handle shown in the footer, without the @.' },
  { name: 'status', type: 'string', default: "'Online'", description: 'Status text shown under the handle.' },
  { name: 'statusColor', type: 'string', default: "'#22c55e'", description: 'Color of the status dot.' },
  { name: 'contactText', type: 'string', default: "'Contact'", description: 'Label of the contact button.' },
  {
    name: 'showUserInfo',
    type: 'boolean',
    default: 'true',
    description: 'Shows the footer with the handle, status and contact button.'
  },
  {
    name: 'onContactClick',
    type: '() => void',
    default: '-',
    description: 'Called when the contact button is clicked.'
  },
  { name: 'theme', type: "'dark' | 'light'", default: "'dark'", description: 'Color theme of the frame and footer.' },
  {
    name: 'backdropColor',
    type: 'string',
    default: '-',
    description: 'Color behind the portrait. Shows around cut-out photos. Uses the theme color when not set.'
  },
  { name: 'radius', type: 'number', default: '16', description: 'Corner radius of the photo, in px.' },
  {
    name: 'holo',
    type: 'number',
    default: '0.8',
    description: 'Strength of the holographic foil, from 0 to 1. It lights up where the cursor catches it.'
  },
  {
    name: 'glare',
    type: 'number',
    default: '0.5',
    description: 'Strength of the light that follows the cursor, from 0 to 1.'
  },
  { name: 'enableTilt', type: 'boolean', default: 'true', description: 'Tilts the card toward the cursor.' },
  { name: 'tiltStrength', type: 'number', default: '12', description: 'Largest tilt angle, in degrees.' },
  {
    name: 'parallax',
    type: 'number',
    default: '8',
    description: 'How far the portrait shifts as the card tilts, in px.'
  },
  {
    name: 'enableMobileTilt',
    type: 'boolean',
    default: 'false',
    description: 'Tilts the card with the motion of the phone after a tap. Needs HTTPS.'
  },
  {
    name: 'mobileTiltSensitivity',
    type: 'number',
    default: '5',
    description: 'How strongly phone motion tilts the card.'
  },
  {
    name: 'intro',
    type: 'boolean',
    default: 'true',
    description: 'Catches the light once as the card appears, then settles.'
  },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the card.' }
];
</script>
