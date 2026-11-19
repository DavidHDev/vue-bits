<script setup lang="ts">
import { PRO_ASSET_BASE, PRO_CATEGORIES } from '@/constants/Pro';
import { proLinkProps } from '@/utils/pro';
import { ArrowUpRight } from 'lucide-vue-next';
import { computed } from 'vue';
import ProMedia from './ProMedia.vue';

const PLACEMENT = 'docs-related-pro';

const { category } = defineProps<{ category: string }>();

const collection = computed(() => PRO_CATEGORIES[category]);
const items = computed(() =>
  (collection.value?.items ?? []).slice(0, 4).map(item => ({ item, link: proLinkProps(item.href, PLACEMENT) }))
);
const allLink = computed(() => (collection.value ? proLinkProps(collection.value.path, PLACEMENT) : null));
</script>

<template>
  <section
    v-if="collection && items.length && allLink"
    class="cat-pro"
    aria-label="Related React components from React Bits Pro"
  >
    <div class="cat-pro-heading">
      <div>
        <h2>
          More {{ collection.noun }} in React Bits Pro
          <span class="cat-pro-tag">React</span>
        </h2>
        <p v-if="collection.pitch">{{ collection.pitch }}</p>
      </div>
      <a class="cat-pro-all" v-bind="allLink">
        View all {{ collection.count }}
        <ArrowUpRight :size="14" aria-hidden="true" />
      </a>
    </div>
    <div class="cat-pro-grid">
      <a v-for="{ item, link } in items" :key="item.slug" class="cat-pro-item" v-bind="link">
        <ProMedia :item="item" :base-url="PRO_ASSET_BASE" />
        <span class="cat-pro-item-name">
          {{ item.name }}
          <ArrowUpRight :size="14" aria-hidden="true" />
        </span>
      </a>
    </div>
  </section>
</template>
