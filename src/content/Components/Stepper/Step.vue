<template>
  <div class="step-default">
    <slot />
  </div>
</template>

<script setup lang="ts">
// This component serves as a wrapper for step content
// It's used to identify stepchildren in the parent Stepper component
</script>

<script lang="ts">
export default {
  name: 'Step'
}
</script>

<style scoped>
.step-default {
  padding-left: 2rem;
  padding-right: 2rem;
}
</style>
