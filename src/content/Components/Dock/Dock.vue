<template>
  <div :style="outerStyle">
    <div
      :style="panelStyle"
      :class="className"
      role="toolbar"
      aria-label="Application dock"
      @mousemove="handleMouseMove"
      @mouseleave="handleMouseLeave"
    >
      <DockItem
        v-for="(item, index) in items"
        :key="index"
        :onClick="item.onClick"
        :className="item.className"
        :mouseX="mouseX"
        :spring="spring"
        :distance="distance"
        :magnification="magnification"
        :baseItemSize="baseItemSize"
        :item="item"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { AnimatePresence, Motion, useMotionValue, useSpring, useTransform } from 'motion-v';
import type { ConcreteComponent, CSSProperties, PropType } from 'vue';
import { computed, defineComponent, h, onMounted, onUnmounted, ref, watch } from 'vue';

const MotionComponent = Motion as unknown as ConcreteComponent;
const AnimatePresenceComponent = AnimatePresence as unknown as ConcreteComponent;

export type SpringOptions = NonNullable<Parameters<typeof useSpring>[1]>;

export type DockItemData = {
  icon: unknown;
  label: unknown;
  onClick: () => void;
  className?: string;
};

export type DockProps = {
  items: DockItemData[];
  className?: string;
  distance?: number;
  panelHeight?: number;
  baseItemSize?: number;
  dockHeight?: number;
  magnification?: number;
  spring?: SpringOptions;
};

const DockIcon = defineComponent({
  name: 'DockIcon',
  props: {
    className: { type: String, default: '' }
  },
  render() {
    return h(
      'div',
      {
        style: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        } satisfies CSSProperties,
        class: this.className
      },
      this.$slots.default?.()
    );
  }
});

const DockLabel = defineComponent({
  name: 'DockLabel',
  props: {
    className: { type: String, default: '' },
    isHovered: {
      type: Object as PropType<ReturnType<typeof useMotionValue<number>>>,
      required: true
    }
  },
  setup(props) {
    const isVisible = ref(false);
    let unsubscribe: (() => void) | null = null;

    onMounted(() => {
      unsubscribe = props.isHovered.on('change', (latest: number) => {
        isVisible.value = latest === 1;
      });
    });

    onUnmounted(() => {
      unsubscribe?.();
    });

    return { isVisible };
  },
  render() {
    const labelStyle: CSSProperties = {
      position: 'absolute',
      bottom: '100%',
      transform: 'translateX(-50%)',
      marginBottom: '0.5rem',
      width: 'fit-content',
      whiteSpace: 'pre',
      borderRadius: '0.375rem',
      border: '1px solid #222',
      backgroundColor: '#222',
      padding: '0.125rem 0.5rem',
      fontSize: '0.75rem',
      color: '#fff'
    };

    return h(AnimatePresenceComponent, {}, () =>
      this.isVisible
        ? [
            h(
              MotionComponent,
              {
                key: 'label',
                as: 'div',
                class: this.className,
                role: 'tooltip',
                style: labelStyle,
                initial: { opacity: 0, y: 0 },
                animate: { opacity: 1, y: -10 },
                exit: { opacity: 0, y: 0 },
                transition: { duration: 0.2 }
              },
              () => this.$slots.default?.()
            )
          ]
        : []
    );
  }
});

const DockItem = defineComponent({
  name: 'DockItem',
  props: {
    className: { type: String, default: '' },
    onClick: { type: Function as PropType<() => void>, default: () => {} },
    mouseX: {
      type: Object as PropType<ReturnType<typeof useMotionValue<number>>>,
      required: true
    },
    spring: { type: Object as PropType<SpringOptions>, required: true },
    distance: { type: Number, required: true },
    baseItemSize: { type: Number, required: true },
    magnification: { type: Number, required: true },
    item: { type: Object as PropType<DockItemData>, required: true }
  },
  setup(props) {
    const itemRef = ref<HTMLDivElement>();
    const isHovered = useMotionValue(0);
    const currentSize = ref(props.baseItemSize);

    const mouseDistance = useTransform(props.mouseX, (val: number) => {
      const rect = itemRef.value?.getBoundingClientRect() ?? { x: 0, width: props.baseItemSize };
      return val - rect.x - props.baseItemSize / 2;
    });

    const targetSize = useTransform(mouseDistance, (dist: number) => {
      const { baseItemSize, magnification, distance } = props;
      const clamped = Math.max(-distance, Math.min(distance, dist));
      const t = 1 - Math.abs(clamped) / distance;
      return baseItemSize + (magnification - baseItemSize) * t;
    });

    const size = useSpring(targetSize, props.spring);

    watch(
      () => props.baseItemSize,
      newSize => {
        currentSize.value = newSize;
        size.set(newSize);
      }
    );

    let unsubscribeSize: (() => void) | null = null;

    onMounted(() => {
      unsubscribeSize = size.on('change', (latest: number) => {
        currentSize.value = latest;
      });
    });

    onUnmounted(() => {
      unsubscribeSize?.();
    });

    const handleHoverStart = () => isHovered.set(1);
    const handleHoverEnd = () => isHovered.set(0);
    const handleFocus = () => isHovered.set(1);
    const handleBlur = () => isHovered.set(0);

    return {
      itemRef,
      currentSize,
      isHovered,
      handleHoverStart,
      handleHoverEnd,
      handleFocus,
      handleBlur
    };
  },
  render() {
    const icon = typeof this.item.icon === 'function' ? (this.item.icon as () => unknown)() : this.item.icon;
    const label = typeof this.item.label === 'function' ? (this.item.label as () => unknown)() : this.item.label;

    const itemStyle: CSSProperties = {
      width: `${this.currentSize}px`,
      height: `${this.currentSize}px`,
      position: 'relative',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '10px',
      backgroundColor: '#120F17',
      border: '1px solid #222',
      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
      cursor: 'pointer',
      outline: 'none'
    };

    return h(
      'div',
      {
        ref: 'itemRef',
        style: itemStyle,
        class: this.className,
        tabindex: 0,
        role: 'button',
        'aria-haspopup': 'true',
        onMouseenter: this.handleHoverStart,
        onMouseleave: this.handleHoverEnd,
        onFocus: this.handleFocus,
        onBlur: this.handleBlur,
        onClick: this.onClick
      },
      [
        h(DockIcon, {}, () => [icon]),
        h(DockLabel, { isHovered: this.isHovered }, () => [typeof label === 'string' ? label : label])
      ]
    );
  }
});

export default defineComponent({
  name: 'Dock',
  components: { DockItem },
  props: {
    items: { type: Array as PropType<DockItemData[]>, required: true },
    className: { type: String, default: '' },
    distance: { type: Number, default: 200 },
    panelHeight: { type: Number, default: 68 },
    baseItemSize: { type: Number, default: 50 },
    dockHeight: { type: Number, default: 256 },
    magnification: { type: Number, default: 70 },
    spring: {
      type: Object as PropType<SpringOptions>,
      default: () => ({ mass: 0.1, stiffness: 150, damping: 12 })
    }
  },
  setup(props) {
    const mouseX = useMotionValue(Infinity);
    const isHovered = useMotionValue(0);
    const currentHeight = ref(props.panelHeight);

    const maxHeight = computed(() => Math.max(props.dockHeight, props.magnification + props.magnification / 2 + 4));

    const heightRow = useTransform(isHovered, (hovered: number) =>
      hovered === 1 ? maxHeight.value : props.panelHeight
    );
    const height = useSpring(heightRow, props.spring);

    watch([() => props.panelHeight, maxHeight], () => {
      height.set(isHovered.get() === 1 ? maxHeight.value : props.panelHeight);
    });

    let unsubscribeHeight: (() => void) | null = null;

    onMounted(() => {
      unsubscribeHeight = height.on('change', (latest: number) => {
        currentHeight.value = latest;
      });
    });

    onUnmounted(() => {
      unsubscribeHeight?.();
    });

    const handleMouseMove = (event: MouseEvent) => {
      isHovered.set(1);
      mouseX.set(event.pageX);
    };

    const handleMouseLeave = () => {
      isHovered.set(0);
      mouseX.set(Infinity);
    };

    const outerStyle = computed<CSSProperties>(() => ({
      height: `${currentHeight.value}px`,
      scrollbarWidth: 'none',
      margin: '0 0.5rem',
      display: 'flex',
      maxWidth: '100%',
      alignItems: 'center'
    }));

    const panelStyle = computed<CSSProperties>(() => ({
      height: `${props.panelHeight}px`,
      position: 'absolute',
      bottom: '0.5rem',
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      alignItems: 'flex-end',
      width: 'fit-content',
      gap: '1rem',
      borderRadius: '1rem',
      backgroundColor: '#120F17',
      border: '1px solid #222',
      padding: '0 0.5rem 0.5rem'
    }));

    return {
      mouseX,
      outerStyle,
      panelStyle,
      handleMouseMove,
      handleMouseLeave
    };
  }
});
</script>
