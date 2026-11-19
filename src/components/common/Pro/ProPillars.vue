<script setup lang="ts">
import { useColorModeValue } from '@/composables/useTheme';
import { PRO_COUNTS, PRO_SECTIONS, PRO_SHOWCASE_ITEMS } from '@/constants/Pro';
import { proLinkProps } from '@/utils/pro';
import { ArrowUpRight } from 'lucide-vue-next';

const { placement } = defineProps<{ placement: string }>();

const PILLAR_PICKS: Record<string, string[]> = {
  components: ['radial-liquid', 'orbit-reel', 'astral-shell'],
  'app-ui': ['app-ui-12', 'app-ui-10', 'app-ui-07']
};

const SHOT_SLOTS = ['front', 'left', 'right'];

const light = useColorModeValue(true, false);

const pillarShots = (slug: string) => {
  const items = PRO_SHOWCASE_ITEMS[slug] ?? [];
  const picks = PILLAR_PICKS[slug];
  if (!picks) return items.slice(0, 3);
  return picks.map(pick => items.find(item => item.slug === pick)).filter(item => item !== undefined);
};

const pillars = PRO_SECTIONS.map(section => ({
  ...section,
  shots: pillarShots(section.slug),
  link: proLinkProps(section.proPath, `${placement}-${section.slug}`)
}));
</script>

<template>
  <div class="prox-pillars">
    <a v-for="pillar in pillars" :key="pillar.slug" class="prox-pillar" v-bind="pillar.link">
      <span class="prox-pillar-media" aria-hidden="true">
        <img
          v-for="(shot, index) in pillar.shots"
          :key="shot.slug"
          :class="['prox-pillar-shot', `is-${SHOT_SLOTS[index]}`]"
          :src="light ? shot.imageLight || shot.image : shot.image"
          alt=""
          loading="lazy"
          decoding="async"
        />
      </span>

      <span class="prox-pillar-body">
        <span class="prox-pillar-title">
          {{ PRO_COUNTS[pillar.countKey] }} {{ pillar.countLabel }}
          <ArrowUpRight :size="16" aria-hidden="true" />
        </span>
        <span class="prox-pillar-desc">{{ pillar.tagline }}</span>
      </span>
    </a>
  </div>
</template>
