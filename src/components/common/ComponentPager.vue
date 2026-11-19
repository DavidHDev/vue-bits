<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ArrowLeft, ArrowRight } from 'lucide-vue-next';
import { CATEGORIES, slug } from '@/constants/Categories';

const props = defineProps<{ category: string; subcategory: string }>();

type PagerItem = { category: string; component: string; path: string };

const SHORTCUTS = { previous: '[', next: ']' } as const;

const routes: PagerItem[] = CATEGORIES.filter(category => category.name !== 'Get Started').flatMap(category =>
  category.subcategories.map(component => ({
    category: category.name,
    component,
    path: `/${slug(category.name)}/${slug(component)}`
  }))
);

const router = useRouter();
const index = computed(() => routes.findIndex(item => item.path === `/${props.category}/${props.subcategory}`));
const previous = computed(() => (index.value > 0 ? routes[index.value - 1] : null));
const next = computed(() => (index.value >= 0 ? (routes[index.value + 1] ?? null) : null));

const isEditable = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.isContentEditable ||
    ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) ||
    Boolean(target.closest('[role="textbox"], [role="combobox"], [contenteditable="true"]')));

const onKeyDown = (event: KeyboardEvent) => {
  if (index.value < 0) return;
  if (event.defaultPrevented || event.repeat || event.isComposing) return;
  if (event.metaKey || event.ctrlKey || event.altKey || isEditable(event.target)) return;
  const target = event.key === SHORTCUTS.previous ? previous.value : event.key === SHORTCUTS.next ? next.value : null;
  if (!target) return;
  event.preventDefault();
  router.push(target.path);
};

onMounted(() => window.addEventListener('keydown', onKeyDown));
onBeforeUnmount(() => window.removeEventListener('keydown', onKeyDown));
</script>

<template>
  <nav v-if="index >= 0" class="component-pager" aria-label="Component navigation">
    <RouterLink
      v-if="previous"
      class="component-pager-link component-pager-previous"
      :to="previous.path"
      :aria-keyshortcuts="SHORTCUTS.previous"
    >
      <ArrowLeft :size="16" aria-hidden="true" />
      <span>
        <span class="component-pager-label">
          Previous
          <kbd class="component-pager-key" aria-hidden="true">{{ SHORTCUTS.previous }}</kbd>
        </span>
        <span class="component-pager-name">{{ previous.component }}</span>
      </span>
    </RouterLink>
    <span v-else class="component-pager-empty component-pager-previous">
      <span>
        <span class="component-pager-label">Collection</span>
        <span class="component-pager-name">Start of library</span>
      </span>
    </span>

    <RouterLink
      v-if="next"
      class="component-pager-link component-pager-next"
      :to="next.path"
      :aria-keyshortcuts="SHORTCUTS.next"
    >
      <span>
        <span class="component-pager-label">
          Next
          <kbd class="component-pager-key" aria-hidden="true">{{ SHORTCUTS.next }}</kbd>
        </span>
        <span class="component-pager-name">{{ next.component }}</span>
      </span>
      <ArrowRight :size="16" aria-hidden="true" />
    </RouterLink>
    <span v-else class="component-pager-empty component-pager-next">
      <span>
        <span class="component-pager-label">Collection</span>
        <span class="component-pager-name">End of library</span>
      </span>
    </span>
  </nav>
</template>
