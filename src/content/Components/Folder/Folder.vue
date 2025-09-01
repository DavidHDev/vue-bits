<template>
  <div :style="{ transform: `scale(${props.size})` }" :class="props.class">
    <div :class="folderClass" :style="folderStyle" @click="handleClick">
      <div
        class="relative w-[100px] h-[80px] rounded-tl-0 rounded-tr-[10px] rounded-br-[10px] rounded-bl-[10px]"
        :style="{ backgroundColor: folderBackColor }"
      >
        <span
          class="absolute z-0 bottom-[98%] left-0 w-[30px] h-[10px] rounded-tl-[5px] rounded-tr-[5px] rounded-bl-0 rounded-br-0"
          :style="{ backgroundColor: folderBackColor }"
        ></span>
        <div v-for="(item, i) in papers" :key="i" :class="getPaperClasses(i)" :style="getPaperStyle(i)">
          <slot :name="`item-${i + 1}`" :item="item" :index="i" :isOpen="open">
            {{ item }}
          </slot>
        </div>
        <div :class="frontClass" :style="{ backgroundColor: props.color }"></div>
        <div :class="rightClass" :style="{ backgroundColor: props.color }"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface Props {
  color?: string;
  size?: number;
  items?: (string | null)[];
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  color: '#27FF64',
  size: 1,
  items: () => [],
  class: ''
});

const darkenColor = (hex: string, percent: number): string => {
  let color = hex.startsWith('#') ? hex.slice(1) : hex;
  if (color.length === 3) {
    color = color
      .split('')
      .map(c => c + c)
      .join('');
  }
  const num = parseInt(color, 16);
  let r = (num >> 16) & 0xff;
  let g = (num >> 8) & 0xff;
  let b = num & 0xff;
  r = Math.max(0, Math.min(255, Math.floor(r * (1 - percent))));
  g = Math.max(0, Math.min(255, Math.floor(g * (1 - percent))));
  b = Math.max(0, Math.min(255, Math.floor(b * (1 - percent))));
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
};

const open = ref(false);
const maxItems = 3;

const papers = computed(() => {
  const result = props.items.slice(0, maxItems);
  while (result.length < maxItems) {
    result.push(null);
  }
  return result;
});

const folderBackColor = computed(() => darkenColor(props.color, 0.08));
const paper1 = computed(() => darkenColor('#ffffff', 0.1));
const paper2 = computed(() => darkenColor('#ffffff', 0.05));
const paper3 = computed(() => '#ffffff');

const folderStyle = computed(() => ({
  transform: open.value ? 'translateY(-8px)' : undefined
}));

const folderClass = computed(() =>
  `group relative transition-all duration-200 ease-in cursor-pointer ${
    !open.value ? 'hover:-translate-y-2' : ''
  }`.trim()
);

const getPaperClasses = (index: number) => {
  let sizeClasses = '';
  if (index === 0) sizeClasses = 'w-[70%] h-[80%]';
  if (index === 1) sizeClasses = open.value ? 'w-[80%] h-[80%]' : 'w-[80%] h-[70%]';
  if (index === 2) sizeClasses = open.value ? 'w-[90%] h-[80%]' : 'w-[90%] h-[60%]';

  return `absolute z-20 bottom-[10%] left-1/2 transition-all duration-300 ease-in-out overflow-hidden ${
    !open.value ? 'transform -translate-x-1/2 translate-y-[10%] group-hover:translate-y-0' : 'hover:scale-110'
  } ${sizeClasses}`.trim();
};

const getOpenTransform = (index: number) => {
  if (index === 0) return 'translate(-120%, -70%) rotate(-15deg)';
  if (index === 1) return 'translate(10%, -70%) rotate(15deg)';
  if (index === 2) return 'translate(-50%, -100%) rotate(5deg)';
  return '';
};

const getPaperStyle = (index: number) => {
  const backgroundColor = index === 0 ? paper1.value : index === 1 ? paper2.value : paper3.value;
  const baseStyle = {
    backgroundColor,
    borderRadius: '10px',
    transition: 'all 0.3s ease-in-out'
  };

  if (open.value) {
    const transformStyle = getOpenTransform(index);
    return {
      ...baseStyle,
      transform: transformStyle
    };
  }

  return baseStyle;
};

const frontClass = computed(() => {
  const baseClasses = 'absolute z-30 w-full h-full origin-bottom transition-all duration-300 ease-in-out';
  const borderRadius = 'rounded-tl-[5px] rounded-tr-[10px] rounded-br-[10px] rounded-bl-[10px]';

  if (open.value) {
    return `${baseClasses} ${borderRadius} [transform:skew(15deg)_scaleY(0.6)]`;
  } else {
    return `${baseClasses} ${borderRadius} group-hover:[transform:skew(15deg)_scaleY(0.6)]`;
  }
});

const rightClass = computed(() => {
  const baseClasses = 'absolute z-30 w-full h-full origin-bottom transition-all duration-300 ease-in-out';
  const borderRadius = 'rounded-tl-[5px] rounded-tr-[10px] rounded-br-[10px] rounded-bl-[10px]';

  if (open.value) {
    return `${baseClasses} ${borderRadius} [transform:skew(-15deg)_scaleY(0.6)]`;
  } else {
    return `${baseClasses} ${borderRadius} group-hover:[transform:skew(-15deg)_scaleY(0.6)]`;
  }
});

const handleClick = () => {
  open.value = !open.value;
};
</script>
