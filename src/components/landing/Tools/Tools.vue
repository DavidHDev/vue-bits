<script setup lang="ts">
import logo from '@/assets/logos/vue-bits-logo-small-dark.svg';
import { useNearOnce } from '@/composables/useNearOnce';
import { useColorModeValue } from '@/composables/useTheme';
import { REACT_BITS_ORIGIN, toolsLinkProps } from '@/utils/pro';
import { ArrowUpRight01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { computed, defineAsyncComponent, ref } from 'vue';
import './Tools.css';

const Topography = defineAsyncComponent(() => import('@/content/Backgrounds/Topography/Topography.vue'));
const MetallicPaint = defineAsyncComponent(() => import('@/content/Animations/MetallicPaint/MetallicPaint.vue'));

const PLACEMENT = 'landing-tools';

const TOOLS = [
  {
    id: 'background-studio',
    label: 'Background Studio',
    blurb:
      'Pick an animated background, start from a preset, tune it live, then export a 4K image, a looping video or React code.'
  },
  {
    id: 'center-stage',
    label: 'Center Stage',
    blurb: 'Turn screenshots and recordings into polished product shots. Perfect for launch videos or demos.'
  },
  {
    id: 'shape-magic',
    label: 'Shape Magic',
    blurb: 'Design a logo mark or style your own logo with 3D materials. Export SVG, PNG, favicons, video or React.'
  },
  {
    id: 'texture-lab',
    label: 'Texture Lab',
    blurb:
      'Stack animated effects on a photo, video or your camera, then export an image, a video, a GIF or a shareable style.'
  },
  {
    id: 'sound-lab',
    label: 'Sound Lab',
    blurb:
      'Interface and video sounds, tune them live, then install one with a single command or download WAV, MP3 or OGG.'
  }
].map(tool => ({ ...tool, link: toolsLinkProps(`/tools/${tool.id}`, PLACEMENT) }));

const POSTERS: Record<string, string> = { 'background-studio': 'topography', 'shape-magic': 'metallicpaint' };

const light = useColorModeValue(true, false);
const gridRef = ref<HTMLElement | null>(null);
const near = useNearOnce(gridRef, '400px 0px');
const lite = computed(() => near.value && document.documentElement.hasAttribute('data-lite'));
const suffix = computed(() => (light.value ? '-light' : ''));
const remote = (name: string) => `${REACT_BITS_ORIGIN}/assets/images/${name}${suffix.value}.webp`;
</script>

<template>
  <section class="ln-tools-section" aria-labelledby="ln-tools-title">
    <div class="ln-tools-inner">
      <header class="ln-tools-head">
        <h2 id="ln-tools-title" class="ln-tools-title">Five free tools, in your browser.</h2>
        <p class="ln-tools-sub">
          Made by React Bits and hosted on reactbits.dev. The images, videos and sounds they export work in any project.
        </p>
      </header>
      <div ref="gridRef" class="ln-tools-grid">
        <a v-for="tool in TOOLS" :key="tool.id" class="browse-card ln-tools-card" v-bind="tool.link">
          <div class="browse-card-well ln-tools-well" aria-hidden="true">
            <template v-if="near">
              <img
                v-if="tool.id === 'center-stage'"
                class="ln-tools-shot ln-tools-shot--fit"
                :src="remote('center-stage-shot')"
                alt=""
                loading="lazy"
                decoding="async"
              />
              <img
                v-else-if="tool.id === 'sound-lab'"
                class="ln-tools-shot"
                :src="remote('sound-lab-orb')"
                alt=""
                loading="lazy"
                decoding="async"
              />
              <img
                v-else-if="tool.id === 'texture-lab'"
                :src="`${REACT_BITS_ORIGIN}/assets/images/soft-type-daisy.webp`"
                alt=""
                loading="lazy"
                decoding="async"
              />
              <img
                v-else-if="lite && POSTERS[tool.id]"
                class="ln-tools-poster"
                :src="`/assets/videos/${POSTERS[tool.id]}${suffix}.webp`"
                alt=""
                loading="lazy"
                decoding="async"
              />
              <Topography
                v-else-if="tool.id === 'background-studio'"
                :color="light ? '#3c413d' : '#d6dad6'"
                :light-mode="light"
                :tilt="30"
                :line-count="22"
                :major-lines="false"
                :glow="0.15"
                :depth-of-field="0"
                :speed="0.18"
                :intro="false"
              />
              <MetallicPaint
                v-else-if="tool.id === 'shape-magic'"
                :image-src="logo"
                :scale="0.74"
                :dispersion="0.06"
                :light-mode="light"
                background-color="transparent"
                :intro="false"
              />
            </template>
          </div>
          <div class="ln-tools-caption">
            <div class="ln-tools-name">
              <h3 class="browse-card-title">{{ tool.label }}</h3>
              <HugeiconsIcon :icon="ArrowUpRight01Icon" :size="15" :stroke-width="1.8" />
            </div>
            <p class="ln-tools-desc">{{ tool.blurb }}</p>
          </div>
        </a>
      </div>
    </div>
  </section>
</template>
