<template>
  <span :style="{ position: 'relative', display: 'inline-block', ...props.containerStyle }">
    <span :style="computedCounterStyle">
      <template v-for="place in places" :key="place">
        <span
          v-if="place === '.'"
          :style="{
            height: `${height}px`,
            width: 'fit-content',
            position: 'relative',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            ...props.digitStyle
          }"
        >
          .
        </span>
        <DigitColumn v-else :place="place as number" :value="value" :height="height" :digit-style="props.digitStyle" />
      </template>
    </span>
    <span :style="gradientContainerStyle">
      <span :style="props.topGradientStyle ?? computedTopGradientStyle" />
      <span :style="props.bottomGradientStyle ?? computedBottomGradientStyle" />
    </span>
  </span>
</template>

<script setup lang="ts">
import { motion, useSpring, useTransform } from 'motion-v';
import type { CSSProperties } from 'vue';
import { computed, defineComponent, h, watchEffect } from 'vue';

type PlaceValue = number | '.';

interface CounterProps {
  value: number;
  fontSize?: number;
  padding?: number;
  places?: PlaceValue[];
  gap?: number;
  borderRadius?: number;
  horizontalPadding?: number;
  textColor?: string;
  fontWeight?: CSSProperties['fontWeight'];
  containerStyle?: CSSProperties;
  counterStyle?: CSSProperties;
  digitStyle?: CSSProperties;
  gradientHeight?: number;
  gradientFrom?: string;
  gradientTo?: string;
  topGradientStyle?: CSSProperties;
  bottomGradientStyle?: CSSProperties;
}

const props = withDefaults(defineProps<CounterProps>(), {
  fontSize: 100,
  padding: 0,
  places: undefined,
  gap: 8,
  borderRadius: 4,
  horizontalPadding: 8,
  textColor: 'inherit',
  fontWeight: 'inherit',
  gradientHeight: 16,
  gradientFrom: 'black',
  gradientTo: 'transparent'
});

function normalizeNearInteger(num: number): number {
  const nearest = Math.round(num);
  const tolerance = 1e-9 * Math.max(1, Math.abs(num));
  return Math.abs(num - nearest) < tolerance ? nearest : num;
}

function getValueRoundedToPlace(value: number, place: number): number {
  return Math.floor(normalizeNearInteger(value / place));
}

function derivePlaces(value: number): PlaceValue[] {
  return [...value.toString()].map((ch, i, a) => {
    if (ch === '.') return '.';
    const dotIndex = a.indexOf('.');
    const isInteger = dotIndex === -1;
    const exponent = isInteger ? a.length - i - 1 : i < dotIndex ? dotIndex - i - 1 : -(i - dotIndex);
    return 10 ** exponent;
  });
}

const height = computed(() => props.fontSize + props.padding);

const places = computed<PlaceValue[]>(() => props.places ?? derivePlaces(props.value));

const computedCounterStyle = computed<CSSProperties>(() => ({
  fontSize: `${props.fontSize}px`,
  display: 'flex',
  gap: props.gap,
  overflow: 'hidden',
  borderRadius: props.borderRadius,
  paddingLeft: props.horizontalPadding,
  paddingRight: props.horizontalPadding,
  lineHeight: 1,
  color: props.textColor,
  fontWeight: props.fontWeight,
  direction: 'ltr',
  ...props.counterStyle
}));

const gradientContainerStyle: CSSProperties = {
  pointerEvents: 'none',
  position: 'absolute',
  inset: 0,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between'
};

const computedTopGradientStyle = computed<CSSProperties>(() => ({
  height: props.gradientHeight,
  background: `linear-gradient(to bottom, ${props.gradientFrom}, ${props.gradientTo})`
}));

const computedBottomGradientStyle = computed<CSSProperties>(() => ({
  height: props.gradientHeight,
  background: `linear-gradient(to top, ${props.gradientFrom}, ${props.gradientTo})`
}));

const DigitColumn = defineComponent({
  name: 'DigitColumn',
  props: {
    place: { type: Number, required: true },
    value: { type: Number, required: true },
    height: { type: Number, required: true },
    digitStyle: { type: Object as () => CSSProperties | undefined, default: undefined }
  },
  setup(columnProps) {
    const valueRoundedToPlace = computed(() => getValueRoundedToPlace(columnProps.value, columnProps.place));

    const animatedValue = useSpring(valueRoundedToPlace.value, { stiffness: 300, damping: 30 });

    watchEffect(() => {
      animatedValue.set(valueRoundedToPlace.value);
    });

    const digitNodes = Array.from({ length: 10 }, (_, i) => {
      const y = useTransform(animatedValue, (latest: number) => {
        const placeValue = latest % 10;
        const offset = (10 + i - placeValue) % 10;
        let memo = offset * columnProps.height;
        if (offset > 5) memo -= 10 * columnProps.height;
        return memo;
      });
      return { i, y };
    });

    const baseStyle: CSSProperties = {
      position: 'absolute',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    };

    return () => {
      const wrapperStyle: CSSProperties = {
        height: columnProps.height,
        position: 'relative',
        width: '1ch',
        fontVariantNumeric: 'tabular-nums',
        display: 'inline-flex',
        overflow: 'hidden',
        ...columnProps.digitStyle
      };

      return h(
        'span',
        { style: wrapperStyle },
        digitNodes.map(({ i, y }) => h(motion.span, { key: i, style: { ...baseStyle, y } }, () => String(i)))
      );
    };
  }
});
</script>
