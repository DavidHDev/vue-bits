<template>
  <Teleport to="body">
    <div class="ln-navbar-mobile-backdrop" @click="emit('close')" />
    <div class="ln-navbar-mobile-menu ln-navbar-mobile-menu-docs">
      <div class="ln-navbar-mobile-scroll">
        <RouterLink
          class="sidebar-browse sidebar-browse--menu"
          to="/get-started/index"
          :aria-current="onIndexPage ? 'page' : undefined"
          :tabindex="onIndexPage ? -1 : undefined"
          @click="emit('close')"
        >
          <LuLayoutGrid :size="14" aria-hidden="true" class="sidebar-browse__icon" />
          <span class="sidebar-browse__label">
            {{ onIndexPage ? 'Viewing all components' : 'Browse all components' }}
          </span>
        </RouterLink>

        <label class="ln-navbar-mobile-filter">
          <LuSearch :size="14" aria-hidden="true" />
          <input
            v-model="filter"
            :placeholder="`Filter ${TOTAL_COMPONENTS} components...`"
            aria-label="Filter navigation"
          />
        </label>

        <template v-for="cat in categories" :key="cat.name">
          <div class="ln-navbar-mobile-section">
            <template v-if="cat.subcategories.length > 0 || (cat.index === 0 && showFavorites)">
              <span class="ln-navbar-mobile-label">{{ cat.name }}</span>
              <div class="ln-navbar-mobile-group">
                <RouterLink
                  v-for="sub in cat.subcategories"
                  :key="sub"
                  class="ln-navbar-mobile-link"
                  :class="{ 'ln-navbar-mobile-link-active': route.path === pathFor(cat.name, sub) }"
                  :to="pathFor(cat.name, sub)"
                  @click="emit('close')"
                >
                  {{ sub }}
                </RouterLink>
                <RouterLink
                  v-if="cat.index === 0 && showFavorites"
                  class="ln-navbar-mobile-link"
                  :class="{ 'ln-navbar-mobile-link-active': route.path === '/favorites' }"
                  to="/favorites"
                  @click="emit('close')"
                >
                  Favorites
                </RouterLink>
              </div>
            </template>
          </div>

          <div v-if="cat.index === 0 && !query" class="ln-navbar-mobile-section">
            <span class="ln-navbar-mobile-label">React Bits Pro</span>
            <div class="ln-navbar-mobile-group">
              <a
                v-for="section in PRO_LINKS"
                :key="section.slug"
                class="ln-navbar-mobile-link ln-navbar-mobile-pro-link"
                v-bind="section.link"
                @click="emit('close')"
              >
                <component :is="section.icon" :size="14" aria-hidden="true" class="ln-navbar-mobile-pro-icon" />
                <span>{{ section.label }}</span>
                <span v-if="section.free" class="ln-navbar-mobile-pro-tag">{{ section.free }} free</span>
              </a>
            </div>
          </div>
        </template>

        <p v-if="!hasResults" class="ln-navbar-mobile-empty">No matching pages</p>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { LuLayoutGrid, LuSearch } from 'vue-icons-plus/lu';
import { CATEGORIES, TOTAL_COMPONENTS } from '@/constants/Categories';
import { PRO_FREE_COUNTS, PRO_SECTIONS } from '@/constants/Pro';
import { proLinkProps } from '@/utils/pro';

const emit = defineEmits<{ close: [] }>();

const PRO_LINKS = PRO_SECTIONS.map(section => ({
  slug: section.slug,
  icon: section.icon,
  label: section.sidebarLabel || section.label,
  free: PRO_FREE_COUNTS[section.countKey] || 0,
  link: proLinkProps(section.proPath, 'sidebar-mobile')
}));

const route = useRoute();
const filter = ref('');

const slugify = (value: string) => value.replace(/\s+/g, '-').toLowerCase();
const pathFor = (category: string, sub: string) => `/${slugify(category)}/${slugify(sub)}`;

const query = computed(() => filter.value.trim().toLowerCase());
const onIndexPage = computed(() => route.path === '/get-started/index');

const categories = computed(() =>
  CATEGORIES.map((category, index) => ({
    ...category,
    index,
    subcategories:
      query.value && !category.name.toLowerCase().includes(query.value)
        ? category.subcategories.filter(item => item.toLowerCase().includes(query.value))
        : category.subcategories
  }))
);

const showFavorites = computed(() => !query.value || 'favorites saved'.includes(query.value));
const hasResults = computed(
  () => showFavorites.value || categories.value.some(category => category.subcategories.length > 0)
);

onMounted(() => {
  document.body.style.overflow = 'hidden';
});

onBeforeUnmount(() => {
  document.body.style.overflow = '';
});
</script>
