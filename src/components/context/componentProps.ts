import { computed, inject, type ComputedRef, type InjectionKey } from 'vue';

export type ComponentPropsContextValue = {
  props: ComputedRef<Record<string, unknown>>;
  defaultProps: ComputedRef<Record<string, unknown>>;
  hasChanges: ComputedRef<boolean>;
  resetProps: () => void;
  demoOnlyProps: ComputedRef<string[]>;
  computedProps: ComputedRef<Record<string, unknown>>;
};

export const COMPONENT_PROPS_CONTEXT: InjectionKey<ComponentPropsContextValue> = Symbol('component-props');

const EMPTY: ComponentPropsContextValue = {
  props: computed(() => ({})),
  defaultProps: computed(() => ({})),
  hasChanges: computed(() => false),
  resetProps: () => {},
  demoOnlyProps: computed(() => []),
  computedProps: computed(() => ({}))
};

export function useComponentPropsContext(): ComponentPropsContextValue {
  return inject(COMPONENT_PROPS_CONTEXT, EMPTY);
}

export function hasComponentPropsContext(): boolean {
  return inject(COMPONENT_PROPS_CONTEXT, null) !== null;
}
