<template>
  <div class="main-nav">
    <div class="nav-items">
      <router-link to="/" class="logo">
        <img :src="Logo" alt="Logo" />
      </router-link>

      <div class="flex gap-2">
        <button class="mobile-menu-button" aria-label="Open Search" @click="openSearch">
          <i class="pi pi-search"></i>
        </button>

        <button class="mobile-menu-button" aria-label="Open Menu" @click="toggleDrawer">
          <i class="pi pi-bars"></i>
        </button>
      </div>

      <div class="desktop-nav">
        <FadeContent blur>
          <button class="search-button" @click="openSearch">
            <i class="pi pi-search search-icon"></i>
            <span class="search-text">Search Docs</span>
            <kbd class="search-kbd">/</kbd>
          </button>
        </FadeContent>

        <div class="inline-block relative">
          <router-link
            to="/favorites"
            @mouseenter="showTooltip"
            @mouseleave="hideTooltip"
            aria-label="Favorites"
            class="flex justify-center items-center bg-linear-to-br from-[#1ea03f] to-[#182fff99] hover:brightness-110 active:brightness-95 rounded-full w-10 h-10 transition-all duration-200 cursor-pointer"
          >
            <i class="pi pi-heart-fill" :style="{ color: '#ffffff' }"></i>
          </router-link>

          <Transition
            enter-active-class="transition-opacity duration-200"
            leave-active-class="transition-opacity duration-100"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
          >
            <div v-if="isTooltipVisible" class="top-full left-1/2 absolute mt-2 -translate-x-1/2 pointer-events-none">
              <div
                class="flex justify-center items-center bg-[#0b0b0b] px-4 py-2 border border-[#333] rounded-[50px] font-semibold text-white text-xs whitespace-nowrap"
              >
                Favorites
              </div>
            </div>
          </Transition>
        </div>

        <FadeContent blur>
          <button class="cta-button-docs" @click="openGitHub">
            Star On GitHub
            <span class="star-count">
              <img :src="Star" alt="Star Icon" />
              {{ stars }}
            </span>
          </button>
        </FadeContent>
      </div>
    </div>

    <div v-if="isDrawerOpen" class="drawer-overlay" @click="closeDrawer">
      <div class="drawer-content" @click.stop>
        <div class="drawer-header">
          <img :src="Logo" alt="Logo" class="drawer-logo" />

          <button class="close-button" aria-label="Close Menu" @click="closeDrawer">
            <i class="pi pi-times"></i>
          </button>
        </div>

        <div class="drawer-body">
          <div class="drawer-navigation">
            <div class="categories-container">
              <Category
                v-for="cat in CATEGORIES"
                :key="cat.name"
                :category="cat"
                :location="route"
                :handle-click="onNavClick"
                :handle-transition-navigation="handleMobileTransitionNavigation"
                :on-item-mouse-enter="() => {}"
                :on-item-mouse-leave="() => {}"
                :is-transitioning="isTransitioning"
              />
            </div>
          </div>

          <div class="drawer-separator"></div>

          <div class="drawer-section">
            <p class="section-title">Useful Links</p>

            <router-link to="/text-animations/split-text" @click="closeDrawer" class="drawer-link">Docs</router-link>
            <router-link to="/favorites" @click="closeDrawer" class="drawer-link">Favorites</router-link>

            <a href="https://github.com/DavidHDev/vue-bits" target="_blank" @click="closeDrawer" class="drawer-link">
              GitHub
              <i class="pi-arrow-up-right pi arrow-icon"></i>
            </a>
          </div>

          <div class="drawer-separator"></div>

          <div class="drawer-section">
            <p class="section-title">Other</p>

            <a href="https://davidhaz.com/" target="_blank" @click="closeDrawer" class="drawer-link">
              Who made this?
              <i class="pi-arrow-up-right pi arrow-icon"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
    <SearchDialog :is-open="isSearchOpen" @close="closeSearch" @open="openSearch" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, defineComponent, h } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStars } from '../../composables/useStars';
import { CATEGORIES, NEW, UPDATED } from '../../constants/Categories';
import FadeContent from '../../content/Animations/FadeContent/FadeContent.vue';
import Logo from '../../assets/logos/vue-bits-logo.svg';
import Star from '../../assets/common/star.svg';
import SearchDialog from '../common/SearchDialog.vue';

const isDrawerOpen = ref(false);
const isTransitioning = ref(false);
const isSearchOpen = ref(false);
const stars = useStars();
const route = useRoute();
const router = useRouter();

const isTooltipVisible = ref(false);
const showTimeout = ref<ReturnType<typeof setTimeout> | null>(null);
const hideTimeout = ref<ReturnType<typeof setTimeout> | null>(null);

const slug = (str: string) => str.replace(/\s+/g, '-').toLowerCase();

const toggleDrawer = () => {
  isDrawerOpen.value = !isDrawerOpen.value;
};

const closeDrawer = () => {
  isDrawerOpen.value = false;
};

const openGitHub = () => {
  window.open('https://github.com/DavidHDev/vue-bits', '_blank');
};

const onNavClick = () => {
  closeDrawer();
  window.scrollTo(0, 0);
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

const handleMobileTransitionNavigation = async (path: string) => {
  if (isTransitioning.value || route.path === path) return;

  closeDrawer();
  isTransitioning.value = true;

  try {
    await router.push(path);
    window.scrollTo(0, 0);
  } finally {
    isTransitioning.value = false;
  }
};

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && isDrawerOpen.value) {
    closeDrawer();
  }
  if (e.key === '/' && !isSearchOpen.value) {
    e.preventDefault();
    openSearch();
  }
  if (e.key === 'Escape' && isSearchOpen.value) {
    closeSearch();
  }
};

const Category = defineComponent({
  name: 'Category',
  props: {
    category: {
      type: Object,
      required: true
    },
    location: {
      type: Object,
      required: true
    },
    handleClick: {
      type: Function,
      required: true
    },
    handleTransitionNavigation: {
      type: Function,
      required: true
    },
    onItemMouseEnter: {
      type: Function,
      required: true
    },
    onItemMouseLeave: {
      type: Function,
      required: true
    },
    isTransitioning: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    interface ItemType {
      sub: string;
      path: string;
      isActive: boolean;
      isNew: boolean;
      isUpdated: boolean;
    }

    const items = computed(() =>
      props.category.subcategories.map((sub: string): ItemType => {
        const path = `/${slug(props.category.name)}/${slug(sub)}`;
        const activePath = props.location.path;
        return {
          sub,
          path,
          isActive: activePath === path,
          isNew: (NEW as string[]).includes(sub),
          isUpdated: (UPDATED as string[]).includes(sub)
        };
      })
    );

    return () =>
      h('div', { class: 'category' }, [
        h('p', { class: 'category-name' }, props.category.name),
        h(
          'div',
          { class: 'category-items' },
          items.value.map(({ sub, path, isActive, isNew, isUpdated }: ItemType) => {
            return h(
              'router-link',
              {
                key: path,
                to: path,
                class: ['sidebar-item', { 'active-sidebar-item': isActive }, { transitioning: props.isTransitioning }],
                onClick: (e: Event) => {
                  e.preventDefault();
                  props.handleTransitionNavigation(path);
                },
                onMouseenter: (e: Event) => props.onItemMouseEnter(path, e),
                onMouseleave: props.onItemMouseLeave
              },
              {
                default: () =>
                  [
                    sub,
                    isNew ? h('span', { class: 'new-tag' }, 'New') : null,
                    isUpdated ? h('span', { class: 'updated-tag' }, 'Updated') : null
                  ].filter(Boolean)
              }
            );
          })
        )
      ]);
  }
});

const openSearch = () => {
  isSearchOpen.value = true;
};

const closeSearch = () => {
  isSearchOpen.value = false;
};

onMounted(() => {
  document.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown);
});
</script>
