import { computed, onBeforeUnmount, shallowRef, watch, type ComputedRef } from 'vue';
import { useRoute, useRouter, type LocationQueryRaw } from 'vue-router';
import { getBackgroundLightProps } from '@/constants/backgroundThemeProps';
import { useColorMode } from './useTheme';

type Parser = {
  parse: (value: string | null) => unknown;
  serialize: (value: unknown) => string;
};

const isHexColor = (value: unknown): value is string => typeof value === 'string' && /^#?[0-9a-fA-F]{3,8}$/.test(value);

const sameValue = (a: unknown, b: unknown) =>
  Array.isArray(a) || Array.isArray(b) ? JSON.stringify(a) === JSON.stringify(b) : a === b;

const createParser = (defaultValue: unknown): Parser => {
  if (Array.isArray(defaultValue)) {
    return {
      parse: v =>
        v === null || v === ''
          ? null
          : v.split(',').map(item => (isHexColor(item) && !item.startsWith('#') ? `#${item}` : item)),
      serialize: v =>
        Array.isArray(v) ? v.map(item => (isHexColor(item) ? item.replace(/^#/, '') : item)).join(',') : String(v)
    };
  }
  if (typeof defaultValue === 'number') {
    return {
      parse: v => (v === null || v === '' ? null : Number(v)),
      serialize: v => String(v)
    };
  }
  if (typeof defaultValue === 'boolean') {
    return {
      parse: v =>
        v === null || v === ''
          ? null
          : v === 'true' || v === 'false'
            ? v === 'true'
            : Number.isFinite(Number(v))
              ? Number(v)
              : null,
      serialize: v => String(v)
    };
  }
  if (typeof defaultValue === 'string' && defaultValue.startsWith('#') && isHexColor(defaultValue)) {
    return {
      parse: v => (v === null || v === '' ? null : isHexColor(v) ? `#${v.replace(/^#/, '')}` : v),
      serialize: v => (isHexColor(v) ? v.replace(/^#/, '') : String(v))
    };
  }
  return {
    parse: v => (v === null || v === '' ? null : v),
    serialize: v => String(v)
  };
};

const firstValue = (value: unknown): string | null => {
  if (Array.isArray(value)) return value.length ? String(value[0] ?? '') : null;
  return value === undefined || value === null ? null : String(value);
};

const URL_THROTTLE_MS = 50;

export type ComponentPropsApi<T extends Record<string, unknown>> = {
  props: ComputedRef<T>;
  defaultProps: ComputedRef<T>;
  updateProp: <K extends keyof T>(name: K, value: T[K]) => void;
  updateProps: (updates: Partial<T>) => void;
  resetProps: () => void;
  hasChanges: ComputedRef<boolean>;
  getShareUrl: () => string;
};

export function useComponentProps<T extends Record<string, unknown>>(defaultProps: T): ComponentPropsApi<T> {
  const route = useRoute();
  const router = useRouter();
  const { colorMode } = useColorMode();
  const baseDefaults = { ...defaultProps };
  const keys = Object.keys(baseDefaults);
  const lightProps = getBackgroundLightProps(route.path);

  const parsers: Record<string, Parser> = {};
  for (const key of keys) parsers[key] = createParser(baseDefaults[key]);

  const readQuery = () => {
    const state: Record<string, unknown> = {};
    for (const key of keys) {
      const parsed = parsers[key].parse(firstValue(route.query[key]));
      if (parsed !== null) state[key] = parsed;
    }
    return state;
  };

  const overrides = shallowRef<Record<string, unknown>>(readQuery());

  const effectiveDefaultProps = computed<T>(() =>
    colorMode.value === 'light' && lightProps ? ({ ...baseDefaults, ...lightProps } as T) : baseDefaults
  );

  const props = computed<T>(() => ({ ...effectiveDefaultProps.value, ...overrides.value }) as T);

  const hasChanges = computed(() => Object.keys(overrides.value).length > 0);

  let lastWritten = '';
  let timer: ReturnType<typeof setTimeout> | undefined;

  const serializeState = (state: Record<string, unknown>) => {
    const out: Record<string, string> = {};
    for (const key of keys) {
      if (key in state) out[key] = parsers[key].serialize(state[key]);
    }
    return out;
  };

  const flushUrl = () => {
    timer = undefined;
    const serialized = serializeState(overrides.value);
    const query: LocationQueryRaw = {};
    for (const [key, value] of Object.entries(route.query)) {
      if (!keys.includes(key)) query[key] = value as LocationQueryRaw[string];
    }
    Object.assign(query, serialized);
    lastWritten = JSON.stringify(serialized);
    router.replace({ path: route.path, query, hash: route.hash }).catch(() => {});
  };

  const scheduleUrl = () => {
    if (timer) return;
    timer = setTimeout(flushUrl, URL_THROTTLE_MS);
  };

  const setOverrides = (patch: Record<string, unknown>) => {
    const next = { ...overrides.value };
    for (const [name, value] of Object.entries(patch)) {
      if (!keys.includes(name)) continue;
      if (value === null || value === undefined || sameValue(value, effectiveDefaultProps.value[name]))
        delete next[name];
      else next[name] = value;
    }
    overrides.value = next;
    scheduleUrl();
  };

  const updateProp = <K extends keyof T>(name: K, value: T[K]) => {
    setOverrides({ [name as string]: value });
  };

  const updateProps = (updates: Partial<T>) => {
    setOverrides(updates as Record<string, unknown>);
  };

  const resetProps = () => {
    overrides.value = {};
    scheduleUrl();
  };

  const getShareUrl = () => window.location.href;

  watch(
    () => route.query,
    () => {
      if (timer) return;
      const current = readQuery();
      const serialized = JSON.stringify(serializeState(current));
      if (serialized === lastWritten) return;
      lastWritten = serialized;
      overrides.value = current;
    }
  );

  onBeforeUnmount(() => {
    if (timer) {
      clearTimeout(timer);
      timer = undefined;
    }
  });

  return {
    props,
    defaultProps: effectiveDefaultProps,
    updateProp,
    updateProps,
    resetProps,
    hasChanges,
    getShareUrl
  };
}

export default useComponentProps;
