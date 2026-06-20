<template>
  <h1 class="sub-category">Profile Card</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="profileCard.usage"
    :source="profileCardSource"
    component-name="ProfileCard"
    :props-table="props"
  >
    <template #preview>
      <div class="demo-container" style="height: 700px; overflow: hidden; position: relative">
        <ProfileCard
          :key="rerenderKey"
          name="Javi A. Torres"
          title="Software Engineer"
          handle="javicodes"
          status="Online"
          contact-text="Contact Me"
          avatar-url="/assets/person.png"
          :icon-url="showIcon ? '/assets/iconpattern.png' : ''"
          :show-user-info="showUserInfo"
          grain-url="/assets/grain.webp"
          :behind-glow-enabled="showBehindGlow"
          :behind-glow-color="behindGlowColor"
          :inner-gradient="customInnerGradient"
          :enable-mobile-tilt="enableMobileTilt"
        />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSwitch title="Behind Glow" v-model="showBehindGlow" />
        <PreviewSwitch title="Show Icon Pattern" v-model="showIcon" />
        <PreviewSwitch title="Show User Info" v-model="showUserInfo" />
        <PreviewSwitch title="Enable Mobile Tilt" v-model="enableMobileTilt" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="profile-card" :usage="profileCard.usage!" :source="profileCardSource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { profileCard } from '@/constants/code/Components/profileCardCode';
import ProfileCard from '@/content/Components/ProfileCard/ProfileCard.vue';
import profileCardSource from '@/content/Components/ProfileCard/ProfileCard.vue?raw';
import { computed, ref } from 'vue';

const { rerenderKey, forceRerender } = useForceRerender();

const DEFAULTS = {
  showIcon: true,
  showUserInfo: false,
  enableMobileTilt: false,
  showBehindGlow: true,
  behindGlowColor: 'rgba(125, 200, 190, 0.67)',
  customInnerGradient: 'linear-gradient(145deg,#60496e8c 0%,#71C4FF44 100%)'
};

const showIcon = ref(DEFAULTS.showIcon);
const showUserInfo = ref(DEFAULTS.showUserInfo);
const enableMobileTilt = ref(DEFAULTS.enableMobileTilt);
const showBehindGlow = ref(DEFAULTS.showBehindGlow);
const behindGlowColor = ref(DEFAULTS.behindGlowColor);
const customInnerGradient = ref(DEFAULTS.customInnerGradient);

const hasChanges = computed(
  () =>
    showIcon.value !== DEFAULTS.showIcon ||
    showUserInfo.value !== DEFAULTS.showUserInfo ||
    enableMobileTilt.value !== DEFAULTS.enableMobileTilt ||
    showBehindGlow.value !== DEFAULTS.showBehindGlow ||
    behindGlowColor.value !== DEFAULTS.behindGlowColor ||
    customInnerGradient.value !== DEFAULTS.customInnerGradient
);

function reset() {
  showIcon.value = DEFAULTS.showIcon;
  showUserInfo.value = DEFAULTS.showUserInfo;
  enableMobileTilt.value = DEFAULTS.enableMobileTilt;
  showBehindGlow.value = DEFAULTS.showBehindGlow;
  behindGlowColor.value = DEFAULTS.behindGlowColor;
  customInnerGradient.value = DEFAULTS.customInnerGradient;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'avatarUrl',
    type: 'string',
    default: '"<Placeholder for avatar URL>"',
    description: 'URL for the main avatar image displayed on the card'
  },
  {
    name: 'iconUrl',
    type: 'string',
    default: '"<Placeholder for icon URL>"',
    description: 'Optional URL for an icon pattern overlay on the card background'
  },
  {
    name: 'grainUrl',
    type: 'string',
    default: '"<Placeholder for grain URL>"',
    description: 'Optional URL for a grain texture overlay effect'
  },
  {
    name: 'innerGradient',
    type: 'string',
    default: 'undefined',
    description: 'Custom CSS gradient string for the inner card gradient'
  },
  {
    name: 'behindGlowEnabled',
    type: 'boolean',
    default: 'true',
    description: 'Toggle the smooth radial glow that follows the cursor behind the card'
  },
  {
    name: 'behindGlowColor',
    type: 'string',
    default: '"rgba(125, 190, 255, 0.67)"',
    description: 'CSS color for the behind-the-card glow (e.g. rgba/hsla/hex)'
  },
  {
    name: 'behindGlowSize',
    type: 'string',
    default: '"50%"',
    description: 'Size of the glow as a length/percentage stop in the radial gradient'
  },
  {
    name: 'className',
    type: 'string',
    default: '""',
    description: 'Additional CSS classes to apply to the card wrapper'
  },
  {
    name: 'enableTilt',
    type: 'boolean',
    default: 'true',
    description: 'Enable or disable the 3D tilt effect on mouse hover'
  },
  {
    name: 'enableMobileTilt',
    type: 'boolean',
    default: 'false',
    description: 'Enable or disable the 3D tilt effect on mobile devices'
  },
  {
    name: 'mobileTiltSensitivity',
    type: 'number',
    default: '5',
    description: 'Sensitivity of the 3D tilt effect on mobile devices'
  },
  {
    name: 'miniAvatarUrl',
    type: 'string',
    default: 'undefined',
    description: 'Optional URL for a smaller avatar in the user info section'
  },
  {
    name: 'name',
    type: 'string',
    default: '"Javi A. Torres"',
    description: "User's display name"
  },
  {
    name: 'title',
    type: 'string',
    default: '"Software Engineer"',
    description: "User's job title or role"
  },
  {
    name: 'handle',
    type: 'string',
    default: '"javicodes"',
    description: "User's handle or username (displayed with @ prefix)"
  },
  {
    name: 'status',
    type: 'string',
    default: '"Online"',
    description: "User's current status"
  },
  {
    name: 'contactText',
    type: 'string',
    default: '"Contact"',
    description: 'Text displayed on the contact button'
  },
  {
    name: 'showUserInfo',
    type: 'boolean',
    default: 'true',
    description: 'Whether to display the user information section'
  },
  {
    name: 'onContactClick',
    type: 'function',
    default: 'undefined',
    description: 'Callback function called when the contact button is clicked'
  }
];
</script>
