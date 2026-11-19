import { readonly, ref } from 'vue';

const isSearchOpen = ref(false);
const mounted = ref(false);

const openSearch = () => {
  mounted.value = true;
  isSearchOpen.value = true;
};
const closeSearch = () => {
  isSearchOpen.value = false;
};
const toggleSearch = () => {
  if (isSearchOpen.value) closeSearch();
  else openSearch();
};

const isTypingTarget = (target: EventTarget | null) => {
  const el = target as HTMLElement | null;
  if (!el) return false;
  const tag = el.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable;
};

let installed = false;

export function installSearchShortcut() {
  if (installed || typeof window === 'undefined') return;
  installed = true;
  window.addEventListener('keydown', event => {
    const commandK = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k';
    if (commandK) {
      event.preventDefault();
      toggleSearch();
      return;
    }
    if (event.key === '/' && !event.metaKey && !event.ctrlKey && !event.altKey) {
      if (isTypingTarget(event.target) && !isSearchOpen.value) return;
      event.preventDefault();
      toggleSearch();
      return;
    }
    if (event.key === 'Escape' && isSearchOpen.value) closeSearch();
  });
}

export function useSearch() {
  return {
    isSearchOpen: readonly(isSearchOpen),
    mounted: readonly(mounted),
    openSearch,
    closeSearch,
    toggleSearch
  };
}
