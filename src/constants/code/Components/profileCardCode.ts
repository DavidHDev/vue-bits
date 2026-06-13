import code from '@/content/Components/ProfileCard/ProfileCard.vue?raw';
import { createCodeObject } from '@/types/code';

export const profileCard = createCodeObject(code, 'Components/ProfileCard', {
  usage: `<template>
  <ProfileCard
    name="Javi A. Torres"
    title="Software Engineer"
    handle="javicodes"
    status="Online"
    contact-text="Contact Me"
    avatar-url="/path/to/avatar.jpg"
    :show-user-info="true"
    :enable-tilt="true"
    :enable-mobile-tilt="false"
    @contact-click="handleContactClick"
  />
</template>

<script setup>
import ProfileCard from './ProfileCard.vue'

const handleContactClick = () => {
  console.log('Contact clicked')
}
</script>`
});
