<script setup lang="ts">
import logo from '@/assets/logos/vue-bits-logo.svg';
import './LandingLoader.css';

type Props = {
  hiding?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  hiding: false
});
</script>

<template>
  <div :class="['ln-loader', props.hiding ? 'ln-loader--hide' : '']">
    <span class="ln-loader-logo" aria-hidden="true"><img :src="logo" alt="" /></span>
  </div>
</template>
