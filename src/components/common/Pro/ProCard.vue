<script setup lang="ts">
import { PRO_COUNTS } from '@/constants/Pro';
import { REACT_BITS_ORIGIN, proLinkProps } from '@/utils/pro';
import ProCardDither from './ProCardDither.vue';

const PLACEMENT = 'right-panel-card';

const link = proLinkProps('/', PLACEMENT);
const ogDark = `${REACT_BITS_ORIGIN}/assets/pro-card/og-dark.webp`;
const ogLight = `${REACT_BITS_ORIGIN}/assets/pro-card/og-light.webp`;
</script>

<template>
  <a class="pro-card-link" v-bind="link">
    <article class="pro-card">
      <div class="pro-card-preview" aria-hidden="true">
        <ProCardDither class="pro-card-dither" />
        <img
          class="pro-card-og pro-card-og-dark"
          :src="ogDark"
          alt=""
          width="800"
          height="420"
          loading="lazy"
          decoding="async"
        />
        <img
          class="pro-card-og pro-card-og-light"
          :src="ogLight"
          alt=""
          width="800"
          height="420"
          loading="lazy"
          decoding="async"
        />
      </div>

      <div class="pro-card-content">
        <h3 class="pro-card-title">Building with React too? Try React Bits Pro.</h3>
        <p class="pro-card-desc">
          Components, page blocks, app UI, templates, the Agent Kit and page builders, ready to launch.
        </p>
        <div class="pro-card-counts">
          <span>{{ PRO_COUNTS.components }} Components · {{ PRO_COUNTS.blocks }} Blocks</span>
          <span>
            {{ PRO_COUNTS.appUi }} App UI · {{ PRO_COUNTS.templates }} Templates · {{ PRO_COUNTS.agentKit }} Agent
            Skills
          </span>
        </div>

        <div class="pro-card-cta">Explore React Bits Pro</div>
      </div>
    </article>
  </a>
</template>
