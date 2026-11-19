<script setup lang="ts">
import ProPillars from '@/components/common/Pro/ProPillars.vue';
import { proLinkProps } from '@/utils/pro';
import { ArrowRight02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { vReveal } from '../reveal';
import './ProSpotlight.css';

const PLACEMENT = 'landing-pro-spotlight';

const cta = proLinkProps('/', PLACEMENT);
</script>

<template>
  <section class="ln-prospot-section" aria-labelledby="ln-prospot-title">
    <div v-reveal class="ln-prospot-inner">
      <header class="ln-prospot-header">
        <div class="ln-prospot-copy">
          <h2 id="ln-prospot-title">Also building with React?</h2>
          <p>
            React Bits Pro has page sections, app UI, full Next.js templates and agent skills for React, all as source
            you own. It is from the maker of Vue Bits, and there is no Vue version.
          </p>
        </div>

        <a class="ln-prospot-btn ln-prospot-btn--primary" v-bind="cta">
          Explore React Bits Pro
          <HugeiconsIcon :icon="ArrowRight02Icon" :size="17" :stroke-width="1.8" />
        </a>
      </header>

      <ProPillars placement="landing-pro" />
    </div>
  </section>
</template>
