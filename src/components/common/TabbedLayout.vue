<template>
  <div class="tabbed-layout">
    <Tabs value="0">
      <TabList>
        <Tab value="0">
          <div class="tab-header">
            <i class="pi pi-eye"></i>
            <span>Preview</span>
          </div>
        </Tab>

        <Tab value="1">
          <div class="tab-header">
            <i class="pi pi-code"></i>
            <span>Code</span>
          </div>
        </Tab>

        <Tab value="2">
          <div class="tab-header">
            <i class="pi pi-box"></i>
            <span>CLI</span>
          </div>
        </Tab>

        <Tab value="3">
          <div class="flex items-center gap-2 shrink-0">
            <div class="inline-block relative" v-if="favoriteKey && category !== 'get-started'">
              <button
                @click.stop="toggleFavorite"
                @mouseenter="showTooltip"
                @mouseleave="hideTooltip"
                :aria-label="isSaved ? 'Remove from Favorites' : 'Add to Favorites'"
                :aria-pressed="isSaved"
                class="flex justify-center items-center rounded-lg w-10 h-10 transition-all duration-200 cursor-pointer"
                :class="
                  isSaved
                    ? 'bg-linear-to-br from-[#1ea03f] to-[#182fff99] hover:brightness-90'
                    : 'border border-[#222] hover:bg-[#222]'
                "
              >
                <i :class="isSaved ? 'pi pi-heart-fill' : 'pi pi-heart'" :style="{ color: '#ffffff' }"></i>
              </button>

              <Transition
                enter-active-class="transition-opacity duration-200"
                leave-active-class="transition-opacity duration-100"
                enter-from-class="opacity-0"
                enter-to-class="opacity-100"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0"
              >
                <div
                  v-if="isTooltipVisible"
                  class="top-1/2 right-full absolute mr-2 -translate-y-1/2 pointer-events-none"
                >
                  <div
                    class="flex justify-center items-center bg-transparent px-4 border border-[#222] rounded-[15px] h-10 font-medium text-white text-xs whitespace-nowrap"
                  >
                    {{ isSaved ? 'Remove from Favorites' : 'Add to Favorites' }}
                  </div>
                </div>
              </Transition>
            </div>

            <div class="tab-header">
              <i class="pi pi-lightbulb"></i>
              <span>Contribute</span>
            </div>
          </div>
        </Tab>
      </TabList>

      <TabPanels>
        <TabPanel value="0">
          <slot name="preview" />
        </TabPanel>

        <TabPanel value="1">
          <slot name="code" />
        </TabPanel>

        <TabPanel value="2">
          <slot name="cli" />
        </TabPanel>

        <TabPanel value="3">
          <ContributionSection />
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
</template>

<script setup lang="ts">
import { getSavedComponents, isComponentSaved, toggleSavedComponent } from '@/utils/favorites';
import Tab from 'primevue/tab';
import TabList from 'primevue/tablist';
import TabPanel from 'primevue/tabpanel';
import TabPanels from 'primevue/tabpanels';
import Tabs from 'primevue/tabs';
import { useToast } from 'primevue/usetoast';
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import ContributionSection from './ContributionSection.vue';

const savedSet = ref(new Set(getSavedComponents()));
const isSaved = ref<boolean>(false);

const route = useRoute();
const category = computed(() => route.params.category);
const subcategory = computed(() => route.params.subcategory);
const toast = useToast();

const isTooltipVisible = ref(false);
const showTimeout = ref<ReturnType<typeof setTimeout> | null>(null);
const hideTimeout = ref<ReturnType<typeof setTimeout> | null>(null);

const toPascal = (str: string) =>
  str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');

const favoriteKey = computed<string | null>(() => {
  if (!category.value || !subcategory.value) return null;
  const categoryName = toPascal(category.value as string);
  const compName = toPascal(subcategory.value as string);
  return `${categoryName}/${compName}`;
});

const componentName = computed<string | null>(() => {
  if (!subcategory.value) return null;
  return toPascal(subcategory.value as string);
});

const updateSaved = () => (savedSet.value = new Set(getSavedComponents()));
const onStorage = (e?: StorageEvent | null) => {
  if (!e || e.key === 'savedComponents') updateSaved();
};
const toggleFavorite = () => {
  if (!favoriteKey.value) return;

  try {
    const { saved } = toggleSavedComponent(favoriteKey.value);
    isSaved.value = saved;

    toast.add({
      severity: saved ? 'success' : 'error',
      summary: saved
        ? `Added <${componentName.value} /> to Favorites`
        : `Removed <${componentName.value} /> from Favorites`,
      life: 3000
    });
  } catch (err) {
    console.error('Error toggling favorite:', err);
  }
};

const showTooltip = () => {
  clearTimeout(hideTimeout.value ?? 0);
  showTimeout.value = setTimeout(() => {
    isTooltipVisible.value = true;
  }, 250);
};

const hideTooltip = () => {
  clearTimeout(showTimeout.value ?? 0);
  hideTimeout.value = setTimeout(() => {
    isTooltipVisible.value = false;
  }, 100);
};

onMounted(() => {
  window.addEventListener('favorites:updated', updateSaved);
  window.addEventListener('storage', onStorage);
  updateSaved();
});

onBeforeUnmount(() => {
  window.removeEventListener('favorites:updated', updateSaved);
  window.removeEventListener('storage', onStorage);
});

watch(
  () => favoriteKey.value,
  () => {
    if (!favoriteKey.value) return;
    isSaved.value = isComponentSaved(favoriteKey.value);
  },
  {
    immediate: true
  }
);
</script>

<style scoped>
:deep(.p-tablist),
:deep(.p-tablist-tab-list) {
  display: flex;
  gap: 0.5rem;
  padding-bottom: 0.1em;
  align-items: flex-start;
  flex-wrap: wrap;
  border: none !important;
  background: transparent !important;
}

:deep(.p-tablist) {
  justify-content: flex-start;
}

:deep(.p-tablist .p-tab:nth-child(1)),
:deep(.p-tablist .p-tab:nth-child(2)),
:deep(.p-tablist .p-tab:nth-child(3)) {
  margin-right: 0;
}

:deep(.p-tablist .p-tab:nth-child(4)) {
  margin-left: auto;
}

:deep(.p-tab) {
  border: none !important;
  background: transparent !important;
  padding: 0;
}

:deep(.p-tab:not(.p-disabled):focus) {
  box-shadow: none !important;
}

:deep(.p-tab:hover) {
  background: transparent !important;
  border-bottom: none !important;
}

:deep(.p-tablist-active-bar),
:deep(.p-tab-indicator),
:deep(.p-tab::before),
:deep(.p-tab::after),
:deep(.p-tab[aria-selected='true']::before),
:deep(.p-tab[aria-selected='true']::after),
:deep(.p-tablist::after),
:deep(.p-tablist-tab-list::before),
:deep(.p-tablist-tab-list::after),
:deep(.p-tab .p-tab-header-action::before),
:deep(.p-tab .p-tab-header-action::after) {
  display: none !important;
}

:deep(.p-tab[aria-selected='true']) {
  background: transparent !important;
  border-bottom: none !important;
}

:deep(.p-tab[aria-selected='true'] .tab-header) {
  background: #222;
  color: #27ff64;
}

:deep(.p-tabpanels) {
  padding: 0;
  background: transparent;
}

:deep(.p-tabpanel) {
  background: transparent;
  border: none;
  padding: 0;
}

@media (max-width: 768px) {
  :deep(.p-tablist) {
    flex-direction: row;
    align-items: stretch;
    justify-content: flex-start;
  }

  :deep(.p-tablist .p-tab:nth-child(4)) {
    margin-left: 0;
  }
}
</style>
