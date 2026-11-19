import { computed, toValue, type ComputedRef, type MaybeRefOrGetter } from 'vue';
import { useColorMode } from './useTheme';

const valuesMatch = (value: unknown, defaultValue: unknown) => {
  if (Object.is(value, defaultValue)) return true;
  if (Array.isArray(value) || (value && typeof value === 'object')) {
    return JSON.stringify(value) === JSON.stringify(defaultValue);
  }
  return false;
};

export function useThemedProps<T extends Record<string, unknown>>(
  props: MaybeRefOrGetter<T>,
  defaultProps: MaybeRefOrGetter<Partial<T>>,
  lightProps: MaybeRefOrGetter<Partial<T>> = {},
  darkProps: MaybeRefOrGetter<Partial<T>> = {}
): ComputedRef<T> {
  const { colorMode } = useColorMode();

  return computed(() => {
    const themeProps = (colorMode.value === 'light' ? toValue(lightProps) : toValue(darkProps)) as Record<
      string,
      unknown
    >;
    const defaults = toValue(defaultProps) as Record<string, unknown>;

    return Object.fromEntries(
      Object.entries(toValue(props)).map(([name, value]) => [
        name,
        Object.prototype.hasOwnProperty.call(themeProps, name) && valuesMatch(value, defaults[name])
          ? themeProps[name]
          : value
      ])
    ) as T;
  });
}

export default useThemedProps;
