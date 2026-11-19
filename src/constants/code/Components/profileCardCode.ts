import code from '@/content/Components/ProfileCard/ProfileCard.vue?raw';
import { createCodeObject } from '@/types/code';

export const profileCard = createCodeObject(code, 'Components/ProfileCard', {
  installation: `npm install @hugeicons/vue @hugeicons/core-free-icons`,
  usage: `<template>
  <ProfileCard
    name="Javi A. Torres"
    title="Software Engineer"
    handle="javicodes"
    status="Online"
    contact-text="Contact"
    avatar-url="/path/to/portrait.png"
    icon-url="/path/to/pattern.png"
    :holo="0.8"
    :glare="0.5"
    :tilt-strength="12"
    :parallax="8"
    :radius="16"
    :enable-tilt="true"
    :intro="true"
    :show-user-info="true"
    :enable-mobile-tilt="false"
    theme="dark"
    @contact-click="handleContactClick"
  />
</template>

<script setup lang="ts">
import ProfileCard from './ProfileCard.vue'

const handleContactClick = () => {
  console.log('Contact clicked')
}
</script>`
});
