import code from '@/content/Components/BounceCards/BounceCards.vue?raw';
import { createCodeObject } from '@/types/code';

export const bounceCards = createCodeObject(code, 'Components/BounceCards', {
  dependencies: '',
  usage: `<template>
  <BounceCards
    :images="images"
    :container-width="500"
    :container-height="320"
    :card-size="200"
    :spread="85"
    :rotation="10"
    :arc="0"
    :push-distance="160"
    :hover-scale="1.06"
    :bounciness="0.6"
    :animation-delay="0.5"
    :animation-stagger="0.06"
    :border-width="5"
    border-color="#ffffff"
    :radius="25"
    :shadow="true"
    :enable-hover="true"
  />
</template>

<script setup lang="ts">
import BounceCards from './BounceCards.vue'

const images = [
  'https://images.unsplash.com/photo-1724152312974-d4d48b8b36fd?w=480&h=480&fit=crop',
  'https://images.unsplash.com/photo-1762846818262-33c197852fa8?w=480&h=480&fit=crop',
  'https://images.unsplash.com/photo-1721407964262-f9864b562453?w=480&h=480&fit=crop',
  'https://images.unsplash.com/photo-1776394254711-4a0d7345269a?w=480&h=480&fit=crop',
  'https://images.unsplash.com/photo-1763440519433-5467759054fc?w=480&h=480&fit=crop'
]
</script>`
});
