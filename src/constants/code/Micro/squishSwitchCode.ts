import code from '@/content/Micro/SquishSwitch/SquishSwitch.vue?raw';
import { createCodeObject } from '@/types/code';

export const squishSwitch = createCodeObject(code, 'Micro/SquishSwitch', {
  usage: `<script setup>
import { ref } from 'vue'
import SquishSwitch from './SquishSwitch.vue'

const airplane = ref(false)
</script>

<template>
<SquishSwitch
  :checked="airplane"
  label="Airplane mode"
  trackColor="#27272a"
  trackOnColor="#f5f5f5"
  thumbColor="#4e4e51"
  thumbOnColor="#27272a"
  :width="76"
  :height="38"
  :radius="19"
  :speed="50"
  :stretch="36"
  :hoverScale="1.035"
  :colorDuration="320"
  @change="checked => (airplane = checked)"
/>

<!-- uncontrolled, with no visible label -->
<SquishSwitch defaultChecked ariaLabel="Notifications" />
</template>`
});
