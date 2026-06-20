```vue
<template>
  <div class="w-full h-full overflow-hidden" :style="{ backgroundColor: bgColor }">
    <nav class="flex flex-col m-0 p-0 h-full">
      <div
        v-for="(item, idx) in items"
        :key="idx"
        class="relative flex-1 overflow-hidden text-center"
        :ref="el => setItemRef(el as HTMLDivElement, idx)"
        :style="{
          borderTop: idx === 0 ? 'none' : `1px solid ${borderColor}`
        }"
      >
        <a
          class="relative flex justify-center items-center h-full font-semibold text-[4vh] no-underline uppercase cursor-pointer"
          :href="item.link"
          :style="{ color: textColor }"
          @mouseenter="ev => handleMouseEnter(ev, idx)"
          @mouseleave="ev => handleMouseLeave(ev, idx)"
        >
          {{ item.text }}
        </a>

        <div
          class="top-0 left-0 absolute w-full h-full overflow-hidden translate-y-[101%] pointer-events-none"
          :style="{ backgroundColor: marqueeBgColor }"
          :ref="el => (marqueeRefs[idx] = el as HTMLDivElement)"
        >
          <div class="flex w-fit h-full" :ref="el => (marqueeInnerRefs[idx] = el as HTMLDivElement)">
            <div
              v-for="i in repetitions[idx] || 4"
              :key="`${idx}-${i}`"
              class="flex items-center marquee-part shrink-0"
            >
              <span
                class="px-[1vw] font-normal text-[4vh] uppercase leading-[1] whitespace-nowrap"
                :style="{ color: marqueeTextColor }"
              >
                {{ item.text }}
              </span>

              <div
                class="bg-cover bg-center mx-[2vw] my-[2em] py-[1em] rounded-[50px] w-[200px] h-[7vh]"
                :style="{ backgroundImage: `url(${item.image})` }"
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { gsap } from 'gsap';
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';

interface MenuItemData {
  link: string;
  text: string;
  image: string;
}

interface Props {
  items?: MenuItemData[];
  speed?: number;
  textColor?: string;
  bgColor?: string;
  marqueeBgColor?: string;
  marqueeTextColor?: string;
  borderColor?: string;
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [],
  speed: 15,
  textColor: '#ffffff',
  bgColor: '#111111',
  marqueeBgColor: '#ffffff',
  marqueeTextColor: '#111111',
  borderColor: '#ffffff'
});

const itemRefs = ref<(HTMLDivElement | null)[]>([]);
const marqueeRefs = ref<(HTMLDivElement | null)[]>([]);
const marqueeInnerRefs = ref<(HTMLDivElement | null)[]>([]);
const repetitions = ref<number[]>([]);
const animations = ref<(gsap.core.Tween | null)[]>([]);

const animationDefaults = {
  duration: 0.6,
  ease: 'expo'
};

const setItemRef = (el: HTMLDivElement | null, idx: number) => {
  if (el) {
    itemRefs.value[idx] = el;
  }
};

const findClosestEdge = (mouseX: number, mouseY: number, width: number, height: number): 'top' | 'bottom' => {
  const topEdgeDist = Math.pow(mouseX - width / 2, 2) + Math.pow(mouseY, 2);

  const bottomEdgeDist = Math.pow(mouseX - width / 2, 2) + Math.pow(mouseY - height, 2);

  return topEdgeDist < bottomEdgeDist ? 'top' : 'bottom';
};

const calculateRepetitions = async () => {
  await nextTick();

  props.items.forEach((_, idx) => {
    const marqueeInner = marqueeInnerRefs.value[idx];

    if (!marqueeInner) return;

    const marqueeContent = marqueeInner.querySelector('.marquee-part') as HTMLElement;

    if (!marqueeContent) return;

    const contentWidth = marqueeContent.offsetWidth;

    const viewportWidth = window.innerWidth;

    const needed = Math.ceil(viewportWidth / contentWidth) + 2;

    repetitions.value[idx] = Math.max(4, needed);
  });

  await nextTick();

  setupMarquees();
};

const setupMarquees = () => {
  props.items.forEach((_, idx) => {
    const marqueeInner = marqueeInnerRefs.value[idx];

    if (!marqueeInner) return;

    const marqueeContent = marqueeInner.querySelector('.marquee-part') as HTMLElement;

    if (!marqueeContent) return;

    const contentWidth = marqueeContent.offsetWidth;

    if (contentWidth === 0) return;

    animations.value[idx]?.kill();

    gsap.set(marqueeInner, { x: 0 });

    animations.value[idx] = gsap.to(marqueeInner, {
      x: -contentWidth,
      duration: props.speed,
      ease: 'none',
      repeat: -1
    });
  });
};

const handleMouseEnter = (ev: MouseEvent, idx: number) => {
  const itemRef = itemRefs.value[idx];
  const marqueeRef = marqueeRefs.value[idx];
  const marqueeInnerRef = marqueeInnerRefs.value[idx];

  if (!itemRef || !marqueeRef || !marqueeInnerRef) return;

  const rect = itemRef.getBoundingClientRect();

  const edge = findClosestEdge(ev.clientX - rect.left, ev.clientY - rect.top, rect.width, rect.height);

  gsap
    .timeline({
      defaults: animationDefaults
    })
    .set(
      marqueeRef,
      {
        y: edge === 'top' ? '-101%' : '101%'
      },
      0
    )
    .set(
      marqueeInnerRef,
      {
        y: edge === 'top' ? '101%' : '-101%'
      },
      0
    )
    .to(
      [marqueeRef, marqueeInnerRef],
      {
        y: '0%'
      },
      0
    );
};

const handleMouseLeave = (ev: MouseEvent, idx: number) => {
  const itemRef = itemRefs.value[idx];
  const marqueeRef = marqueeRefs.value[idx];
  const marqueeInnerRef = marqueeInnerRefs.value[idx];

  if (!itemRef || !marqueeRef || !marqueeInnerRef) return;

  const rect = itemRef.getBoundingClientRect();

  const edge = findClosestEdge(ev.clientX - rect.left, ev.clientY - rect.top, rect.width, rect.height);

  gsap
    .timeline({
      defaults: animationDefaults
    })
    .to(
      marqueeRef,
      {
        y: edge === 'top' ? '-101%' : '101%'
      },
      0
    )
    .to(
      marqueeInnerRef,
      {
        y: edge === 'top' ? '101%' : '-101%'
      },
      0
    );
};

onMounted(() => {
  calculateRepetitions();
  window.addEventListener('resize', calculateRepetitions);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', calculateRepetitions);

  animations.value.forEach(animation => {
    animation?.kill();
  });
});

watch(
  () => props.items,
  async () => {
    await calculateRepetitions();
  },
  { deep: true }
);

watch(
  () => props.speed,
  () => {
    setupMarquees();
  }
);
</script>
