import { inject, type InjectionKey, type Ref } from 'vue';

export type DocsMenuContext = {
  highlighted: Ref<HTMLElement | null>;
  highlight: (el: HTMLElement | null, fromPointer?: boolean) => void;
  close: (focusTrigger?: boolean) => void;
};

export const DOCS_MENU: InjectionKey<DocsMenuContext> = Symbol('docs-menu');

export const useDocsMenu = () => inject(DOCS_MENU, null);
