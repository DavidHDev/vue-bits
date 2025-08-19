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
          <button
            class="search-button"
            @click="openSearch"
          >
            <i class="pi pi-search search-icon"></i>
            <span class="search-text">Search Docs</span>
            <kbd class="search-kbd">/</kbd>
          </button>
        </FadeContent>

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

            <a href="https://github.com/DavidHDev/vue-bits" target="_blank" @click="closeDrawer" class="drawer-link">
              GitHub
              <i class="pi pi-arrow-up-right arrow-icon"></i>
            </a>
          </div>

          <div class="drawer-separator"></div>

          <div class="drawer-section">
            <p class="section-title">Other</p>

            <a href="https://davidhaz.com/" target="_blank" @click="closeDrawer" class="drawer-link">
              Who made this?
              <i class="pi pi-arrow-up-right arrow-icon"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
    <SearchDialog
      :is-open="isSearchOpen"
      @close="closeSearch"
      @open="openSearch"
    />
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
import SearchDialog from '../common/SearchDialog.vue'

const isDrawerOpen = ref(false);
const isTransitioning = ref(false);
const isSearchOpen = ref(false)
const stars = useStars();
const route = useRoute();
const router = useRouter();

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
    e.preventDefault()
    openSearch()
  }
  if (e.key === 'Escape' && isSearchOpen.value) {
    closeSearch()
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
  isSearchOpen.value = true
}

const closeSearch = () => {
  isSearchOpen.value = false
}

onMounted(() => {
  document.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown);
});
</script>
