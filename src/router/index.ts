import { createRouter, createWebHistory, type RouteLocationNormalized } from 'vue-router';
import LandingPage from '@/pages/LandingPage.vue';
import CategoryLayout from '@/components/layouts/CategoryLayout.vue';
import { CATEGORIES } from '@/constants/Categories';
import { componentMap } from '@/constants/Components';
import { toSlug } from '@/utils/catalog';
import { findComponentBySlug } from '@/utils/routeMatch';

const DOCS_CATEGORIES = new Set(CATEGORIES.map(category => toSlug(category.name)));

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: LandingPage
    },
    {
      path: '/changelog',
      redirect: '/get-started/changelog'
    },
    {
      path: '/c/:category',
      component: CategoryLayout,
      children: [
        {
          path: '',
          name: 'category-index',
          component: () => import('@/pages/CategoryIndexPage.vue')
        }
      ]
    },
    {
      path: '/c/:category/:subcategory',
      component: CategoryLayout,
      children: [
        {
          path: '',
          name: 'category-focus',
          component: () => import('@/pages/CategoryPage.vue')
        }
      ]
    },
    {
      path: '/favorites',
      component: CategoryLayout,
      children: [
        {
          path: '',
          name: 'favorites',
          component: () => import('@/pages/FavoritesPage.vue')
        }
      ]
    },
    {
      path: '/:category/:subcategory',
      component: CategoryLayout,
      children: [
        {
          path: '',
          name: 'category',
          component: () => import('@/pages/CategoryPage.vue')
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/pages/NotFoundPage.vue')
    }
  ]
});

const notFound = (to: RouteLocationNormalized) => ({
  name: 'not-found',
  params: { pathMatch: to.path.substring(1).split('/') },
  query: to.query,
  hash: to.hash
});

router.beforeEach(to => {
  const category = String(to.params.category ?? '');
  const subcategory = String(to.params.subcategory ?? '');

  if (to.name === 'category-index') {
    if (category === 'get-started' || !DOCS_CATEGORIES.has(category)) return notFound(to);
    return true;
  }

  if (to.name !== 'category' && to.name !== 'category-focus') return true;

  const prefix = to.name === 'category-focus' ? '/c' : '';
  const match = findComponentBySlug(subcategory);

  if (match && match.path !== `/${category}/${subcategory}`) {
    return { path: `${prefix}${match.path}`, query: to.query, hash: to.hash, replace: true };
  }

  const legacyCategory = typeof to.query.category === 'string' ? toSlug(to.query.category) : '';
  if (category === 'get-started' && subcategory === 'index' && legacyCategory && DOCS_CATEGORIES.has(legacyCategory)) {
    return { path: `/c/${legacyCategory}`, hash: to.hash, replace: true };
  }

  if (subcategory === 'index' && category !== 'get-started' && DOCS_CATEGORIES.has(category)) {
    return { path: `/c/${category}`, query: to.query, hash: to.hash, replace: true };
  }

  if (!DOCS_CATEGORIES.has(category) || (subcategory !== 'index' && !(subcategory in componentMap))) {
    return notFound(to);
  }

  return true;
});

export default router;
