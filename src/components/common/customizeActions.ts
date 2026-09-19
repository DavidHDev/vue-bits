import type { ComputedRef, InjectionKey } from 'vue';

export type CustomizeActions = { reset: () => void; canReset: ComputedRef<boolean> };

export const CUSTOMIZE_ACTIONS: InjectionKey<CustomizeActions> = Symbol('customize-actions');
