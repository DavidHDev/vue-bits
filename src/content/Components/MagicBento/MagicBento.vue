<script setup lang="ts">
import { gsap } from 'gsap';
import { computed, defineComponent, nextTick, onMounted, onUnmounted, ref, watch, type PropType } from 'vue';

interface BentoCardProps {
  color?: string;
  title?: string;
  description?: string;
  label?: string;
  textAutoHide?: boolean;
  disableAnimations?: boolean;
}

interface BentoProps {
  textAutoHide?: boolean;
  enableStars?: boolean;
  enableSpotlight?: boolean;
  enableBorderGlow?: boolean;
  disableAnimations?: boolean;
  spotlightRadius?: number;
  particleCount?: number;
  enableTilt?: boolean;
  glowColor?: string;
  clickEffect?: boolean;
  enableMagnetism?: boolean;
}

const DEFAULT_PARTICLE_COUNT = 12;
const DEFAULT_SPOTLIGHT_RADIUS = 300;
const DEFAULT_GLOW_COLOR = '0, 200, 83';
const MOBILE_BREAKPOINT = 768;

const cardData: BentoCardProps[] = [
  {
    color: '#000C00',
    title: 'Analytics',
    description: 'Track user behavior',
    label: 'Insights'
  },
  {
    color: '#000C00',
    title: 'Dashboard',
    description: 'Centralized data view',
    label: 'Overview'
  },
  {
    color: '#000C00',
    title: 'Collaboration',
    description: 'Work together seamlessly',
    label: 'Teamwork'
  },
  {
    color: '#000C00',
    title: 'Automation',
    description: 'Streamline workflows',
    label: 'Efficiency'
  },
  {
    color: '#000C00',
    title: 'Integration',
    description: 'Connect favorite tools',
    label: 'Connectivity'
  },
  {
    color: '#000C00',
    title: 'Security',
    description: 'Enterprise-grade protection',
    label: 'Protection'
  }
];

const createParticleElement = (x: number, y: number, color: string = DEFAULT_GLOW_COLOR): HTMLDivElement => {
  const el = document.createElement('div');
  el.className = 'particle';
  el.style.cssText = `
    position: absolute;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: rgba(${color}, 1);
    box-shadow: 0 0 6px rgba(${color}, 0.6);
    pointer-events: none;
    z-index: 100;
    left: ${x}px;
    top: ${y}px;
  `;
  return el;
};

const calculateSpotlightValues = (radius: number) => ({
  proximity: radius * 0.5,
  fadeDistance: radius * 0.75
});

const updateCardGlowProperties = (card: HTMLElement, mouseX: number, mouseY: number, glow: number, radius: number) => {
  const rect = card.getBoundingClientRect();
  const relativeX = ((mouseX - rect.left) / rect.width) * 100;
  const relativeY = ((mouseY - rect.top) / rect.height) * 100;

  card.style.setProperty('--glow-x', `${relativeX}%`);
  card.style.setProperty('--glow-y', `${relativeY}%`);
  card.style.setProperty('--glow-intensity', glow.toString());
  card.style.setProperty('--glow-radius', `${radius}px`);
};

const ParticleCard = defineComponent({
  name: 'ParticleCard',
  props: {
    disableAnimations: { type: Boolean, default: false },
    particleCount: { type: Number, default: DEFAULT_PARTICLE_COUNT },
    glowColor: { type: String, default: DEFAULT_GLOW_COLOR },
    enableTilt: { type: Boolean, default: true },
    clickEffect: { type: Boolean, default: false },
    enableMagnetism: { type: Boolean, default: false }
  },
  setup(props) {
    const cardRef = ref<HTMLDivElement | null>(null);
    const particlesRef = ref<HTMLDivElement[]>([]);
    const timeoutsRef = ref<number[]>([]);
    const isHoveredRef = ref(false);
    const memoizedParticles = ref<HTMLDivElement[]>([]);
    const particlesInitialized = ref(false);
    const magnetismAnimationRef = ref<gsap.core.Tween | null>(null);

    const initializeParticles = () => {
      if (particlesInitialized.value || !cardRef.value) return;

      const { width, height } = cardRef.value.getBoundingClientRect();
      memoizedParticles.value = Array.from({ length: props.particleCount }, () =>
        createParticleElement(Math.random() * width, Math.random() * height, props.glowColor)
      );
      particlesInitialized.value = true;
    };

    const clearAllParticles = () => {
      timeoutsRef.value.forEach(clearTimeout);
      timeoutsRef.value = [];
      magnetismAnimationRef.value?.kill();

      particlesRef.value.forEach(particle => {
        gsap.to(particle, {
          scale: 0,
          opacity: 0,
          duration: 0.3,
          ease: 'back.in(1.7)',
          onComplete: () => {
            particle.parentNode?.removeChild(particle);
          }
        });
      });
      particlesRef.value = [];
    };

    const animateParticles = () => {
      if (!cardRef.value || !isHoveredRef.value) return;

      if (!particlesInitialized.value) {
        initializeParticles();
      }

      memoizedParticles.value.forEach((particle, index) => {
        const timeoutId = setTimeout(() => {
          if (!isHoveredRef.value || !cardRef.value) return;

          const clone = particle.cloneNode(true) as HTMLDivElement;
          cardRef.value.appendChild(clone);
          particlesRef.value.push(clone);

          gsap.fromTo(clone, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' });

          gsap.to(clone, {
            x: (Math.random() - 0.5) * 100,
            y: (Math.random() - 0.5) * 100,
            rotation: Math.random() * 360,
            duration: 2 + Math.random() * 2,
            ease: 'none',
            repeat: -1,
            yoyo: true
          });

          gsap.to(clone, {
            opacity: 0.3,
            duration: 1.5,
            ease: 'power2.inOut',
            repeat: -1,
            yoyo: true
          });
        }, index * 100);

        timeoutsRef.value.push(timeoutId);
      });
    };

    let cleanupEventListeners: (() => void) | null = null;
    const setupEventListeners = () => {
      if (props.disableAnimations || !cardRef.value) return;

      const element = cardRef.value;

      const handleMouseEnter = () => {
        isHoveredRef.value = true;
        animateParticles();

        gsap.to(element, { y: -2, duration: 0.3, ease: 'power2.out' });

        if (props.enableTilt) {
          gsap.to(element, {
            rotateX: 5,
            rotateY: 5,
            duration: 0.3,
            ease: 'power2.out',
            transformPerspective: 1000
          });
        }
      };

      const handleMouseLeave = () => {
        isHoveredRef.value = false;
        clearAllParticles();

        if (props.enableTilt) {
          gsap.to(element, {
            rotateX: 0,
            rotateY: 0,
            y: 0,
            duration: 0.3,
            ease: 'power2.out'
          });
        }

        if (props.enableMagnetism) {
          gsap.to(element, {
            x: 0,
            y: 0,
            duration: 0.3,
            ease: 'power2.out'
          });
        }
      };

      const handleMouseMove = (e: MouseEvent) => {
        if (!props.enableTilt && !props.enableMagnetism) return;

        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        if (props.enableTilt) {
          const rotateX = ((y - centerY) / centerY) * -10;
          const rotateY = ((x - centerX) / centerX) * 10;

          gsap.to(element, {
            rotateX,
            rotateY,
            duration: 0.1,
            ease: 'power2.out',
            transformPerspective: 1000
          });
        }

        if (props.enableMagnetism) {
          const magnetX = (x - centerX) * 0.05;
          const magnetY = (y - centerY) * 0.05;

          magnetismAnimationRef.value = gsap.to(element, {
            x: magnetX,
            y: magnetY,
            duration: 0.3,
            ease: 'power2.out'
          });
        }
      };

      const handleClick = (e: MouseEvent) => {
        if (!props.clickEffect) return;

        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const maxDistance = Math.max(
          Math.hypot(x, y),
          Math.hypot(x - rect.width, y),
          Math.hypot(x, y - rect.height),
          Math.hypot(x - rect.width, y - rect.height)
        );

        const ripple = document.createElement('div');
        ripple.style.cssText = `
          position: absolute;
          width: ${maxDistance * 2}px;
          height: ${maxDistance * 2}px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(${props.glowColor}, 0.4) 0%, rgba(${props.glowColor}, 0.2) 30%, transparent 70%);
          left: ${x - maxDistance}px;
          top: ${y - maxDistance}px;
          pointer-events: none;
          z-index: 1000;
        `;

        element.appendChild(ripple);

        gsap.fromTo(
          ripple,
          {
            scale: 0,
            opacity: 1
          },
          {
            scale: 1,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out',
            onComplete: () => ripple.remove()
          }
        );
      };

      element.addEventListener('mouseenter', handleMouseEnter);
      element.addEventListener('mouseleave', handleMouseLeave);
      element.addEventListener('mousemove', handleMouseMove);
      element.addEventListener('click', handleClick);

      cleanupEventListeners = () => {
        isHoveredRef.value = false;
        element.removeEventListener('mouseenter', handleMouseEnter);
        element.removeEventListener('mouseleave', handleMouseLeave);
        element.removeEventListener('mousemove', handleMouseMove);
        element.removeEventListener('click', handleClick);
        clearAllParticles();
      };
    };

    onMounted(() => {
      nextTick(() => {
        setupEventListeners();
      });
    });

    onUnmounted(() => {
      cleanupEventListeners?.();
    });

    watch(
      () => [
        animateParticles,
        clearAllParticles,
        props.disableAnimations,
        props.enableTilt,
        props.enableMagnetism,
        props.clickEffect,
        props.glowColor
      ],
      () => {
        cleanupEventListeners?.();
        setupEventListeners();
      },
      { deep: true }
    );

    return {
      cardRef
    };
  },
  template: `
    <div
      ref="cardRef"
      class="relative overflow-hidden"
      :style="{ position: 'relative', overflow: 'hidden' }"
    >
      <slot />
    </div>
  `
});

const GlobalSpotlight = defineComponent({
  name: 'GlobalSpotlight',
  props: {
    gridRef: { type: [Object, null] as PropType<HTMLDivElement | null>, required: true },
    disableAnimations: { type: Boolean, default: false },
    enabled: { type: Boolean, default: true },
    spotlightRadius: { type: Number, default: DEFAULT_SPOTLIGHT_RADIUS },
    glowColor: { type: String, default: DEFAULT_GLOW_COLOR }
  },
  setup(props) {
    const spotlightRef = ref<HTMLDivElement | null>(null);
    const isInsideSection = ref(false);

    let cleanupEventListeners: (() => void) | null = null;
    const setupEventListeners = () => {
      if (props.disableAnimations || !props.gridRef || !props.enabled) return;

      const spotlight = document.createElement('div');
      spotlight.className = 'global-spotlight';
      spotlight.style.cssText = `
        position: fixed;
        width: 800px;
        height: 800px;
        border-radius: 50%;
        pointer-events: none;
        background: radial-gradient(circle,
          rgba(${props.glowColor}, 0.15) 0%,
          rgba(${props.glowColor}, 0.08) 15%,
          rgba(${props.glowColor}, 0.04) 25%,
          rgba(${props.glowColor}, 0.02) 40%,
          rgba(${props.glowColor}, 0.01) 65%,
          transparent 70%
        );
        z-index: 200;
        opacity: 0;
        transform: translate(-50%, -50%);
        mix-blend-mode: screen;
      `;
      document.body.appendChild(spotlight);
      spotlightRef.value = spotlight;

      const handleMouseMove = (e: MouseEvent) => {
        if (!spotlightRef.value || !props.gridRef) return;

        const section = props.gridRef.closest('.bento-section');
        const rect = section?.getBoundingClientRect();
        const mouseInside =
          rect &&
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom;

        isInsideSection.value = mouseInside || false;
        const cards = props.gridRef.querySelectorAll('.card') as NodeListOf<HTMLDivElement>;

        if (!mouseInside) {
          gsap.to(spotlightRef.value, {
            opacity: 0,
            duration: 0.3,
            ease: 'power2.out'
          });
          cards.forEach(card => {
            card.style.setProperty('--glow-intensity', '0');
          });
          return;
        }

        const { proximity, fadeDistance } = calculateSpotlightValues(props.spotlightRadius);
        let minDistance = Infinity;

        cards.forEach(card => {
          const cardRect = card.getBoundingClientRect();
          const centerX = cardRect.left + cardRect.width / 2;
          const centerY = cardRect.top + cardRect.height / 2;
          const distance =
            Math.hypot(e.clientX - centerX, e.clientY - centerY) - Math.max(cardRect.width, cardRect.height) / 2;
          const effectiveDistance = Math.max(0, distance);

          minDistance = Math.min(minDistance, effectiveDistance);

          let glowIntensity = 0;
          if (effectiveDistance <= proximity) {
            glowIntensity = 1;
          } else if (effectiveDistance <= fadeDistance) {
            glowIntensity = (fadeDistance - effectiveDistance) / (fadeDistance - proximity);
          }

          updateCardGlowProperties(card, e.clientX, e.clientY, glowIntensity, props.spotlightRadius);
        });

        gsap.to(spotlightRef.value, {
          left: e.clientX,
          top: e.clientY,
          duration: 0.1,
          ease: 'power2.out'
        });

        const targetOpacity =
          minDistance <= proximity
            ? 0.8
            : minDistance <= fadeDistance
              ? ((fadeDistance - minDistance) / (fadeDistance - proximity)) * 0.8
              : 0;

        gsap.to(spotlightRef.value, {
          opacity: targetOpacity,
          duration: targetOpacity > 0 ? 0.2 : 0.5,
          ease: 'power2.out'
        });
      };

      const handleMouseLeave = () => {
        isInsideSection.value = false;
        (props.gridRef?.querySelectorAll('.card') as NodeListOf<HTMLDivElement>).forEach(card => {
          card.style.setProperty('--glow-intensity', '0');
        });
        if (spotlightRef.value) {
          gsap.to(spotlightRef.value, {
            opacity: 0,
            duration: 0.3,
            ease: 'power2.out'
          });
        }
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseleave', handleMouseLeave);

      cleanupEventListeners = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseleave', handleMouseLeave);
        spotlightRef.value?.parentNode?.removeChild(spotlightRef.value);
      };
    };

    onMounted(() => {
      nextTick(() => {
        setupEventListeners();
      });
    });

    onUnmounted(() => {
      cleanupEventListeners?.();
      cleanupEventListeners = null;
    });

    watch(
      () => props,
      () => {
        if (props.gridRef) {
          cleanupEventListeners?.();
          setupEventListeners();
        }
      },
      { deep: true }
    );
  },
  template: `<div></div>`
});

const BentoCardGrid = defineComponent({
  name: 'BentoCardGrid',
  props: {
    gridRef: {
      type: Function as PropType<(el: HTMLDivElement | null) => void>,
      required: true
    }
  },
  template: `
    <div
      class="relative gap-2 grid p-3 select-none bento-section"
      :style="{ fontSize: 'clamp(1rem, 0.9rem + 0.5vw, 1.5rem)' }"
      :ref="gridRef"
    >
      <slot />
    </div>
  `
});

const useMobileDetection = () => {
  const isMobile = ref(false);

  const checkMobile = () => {
    isMobile.value = window.innerWidth <= MOBILE_BREAKPOINT;
  };

  onMounted(() => {
    checkMobile();
    window.addEventListener('resize', checkMobile);

    onUnmounted(() => {
      window.removeEventListener('resize', checkMobile);
    });
  });

  return isMobile;
};

const props = withDefaults(defineProps<BentoProps>(), {
  textAutoHide: true,
  enableStars: true,
  enableSpotlight: true,
  enableBorderGlow: true,
  disableAnimations: false,
  spotlightRadius: DEFAULT_SPOTLIGHT_RADIUS,
  particleCount: DEFAULT_PARTICLE_COUNT,
  enableTilt: false,
  glowColor: DEFAULT_GLOW_COLOR,
  clickEffect: true,
  enableMagnetism: true
});

const gridRef = ref<HTMLDivElement | null>(null);
const isMobile = useMobileDetection();
const cardElements = ref<HTMLDivElement[]>([]);

const shouldDisableAnimations = computed(() => props.disableAnimations || isMobile.value);
const baseClassName = computed(() => {
  return `card flex flex-col justify-between relative aspect-[4/3] min-h-[200px] w-full max-w-full p-5 rounded-[20px] border border-solid font-light overflow-hidden transition-[box-shadow] duration-300 ease-in-out hover:shadow-[0_8px_25px_rgba(0,0,0,0.15)] ${
    props.enableBorderGlow ? 'card--border-glow' : ''
  }`;
});
const getCardStyle = (card: BentoCardProps) => ({
  backgroundColor: card.color || 'var(--background-dark)',
  borderColor: 'var(--border-color)',
  color: 'var(--white)',
  '--glow-x': '50%',
  '--glow-y': '50%',
  '--glow-intensity': '0',
  '--glow-radius': '200px'
});

const setupCardRef = (el: HTMLDivElement | null, index: number) => {
  if (!el) return;
  cardElements.value[index] = el;

  const handleMouseEnter = () => {
    if (shouldDisableAnimations.value) return;
    gsap.to(el, { y: -2, duration: 0.3, ease: 'power2.out' });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (shouldDisableAnimations.value) return;

    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    if (props.enableTilt) {
      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;

      gsap.to(el, {
        rotateX,
        rotateY,
        duration: 0.1,
        ease: 'power2.out',
        transformPerspective: 1000
      });
    }

    if (props.enableMagnetism) {
      const magnetX = (x - centerX) * 0.05;
      const magnetY = (y - centerY) * 0.05;

      gsap.to(el, {
        x: magnetX,
        y: magnetY,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  };

  const handleMouseLeave = () => {
    if (shouldDisableAnimations.value) return;

    if (props.enableTilt) {
      gsap.to(el, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.3,
        ease: 'power2.out'
      });
    }

    if (props.enableMagnetism) {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.3,
        ease: 'power2.out'
      });
    } else {
      gsap.to(el, { y: 0, duration: 0.3, ease: 'power2.out' });
    }
  };

  const handleClick = (e: MouseEvent) => {
    if (!props.clickEffect || shouldDisableAnimations.value) return;

    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const maxDistance = Math.max(
      Math.hypot(x, y),
      Math.hypot(x - rect.width, y),
      Math.hypot(x, y - rect.height),
      Math.hypot(x - rect.width, y - rect.height)
    );

    const ripple = document.createElement('div');
    ripple.style.cssText = `
          position: absolute;
          width: ${maxDistance * 2}px;
          height: ${maxDistance * 2}px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(${props.glowColor}, 0.4) 0%, rgba(${props.glowColor}, 0.2) 30%, transparent 70%);
          left: ${x - maxDistance}px;
          top: ${y - maxDistance}px;
          pointer-events: none;
          z-index: 1000;
        `;

    el.appendChild(ripple);

    gsap.fromTo(
      ripple,
      {
        scale: 0,
        opacity: 1
      },
      {
        scale: 1,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        onComplete: () => ripple.remove()
      }
    );
  };

  el.addEventListener('mouseenter', handleMouseEnter);
  el.addEventListener('mousemove', handleMouseMove);
  el.addEventListener('mouseleave', handleMouseLeave);
  el.addEventListener('click', handleClick);
};
</script>

<template>
  <GlobalSpotlight
    v-if="enableSpotlight"
    :grid-ref="gridRef"
    :disable-animations="shouldDisableAnimations"
    :enabled="enableSpotlight"
    :spotlight-radius="spotlightRadius"
    :glow-color="glowColor"
  />

  <BentoCardGrid :grid-ref="(el: HTMLDivElement | null) => { gridRef = el; }">
    <div class="gap-2 grid card-responsive">
      <template v-for="(card, index) in cardData" :key="index">
        <ParticleCard
          v-if="enableStars"
          :class="baseClassName"
          :style="getCardStyle(card)"
          :disable-animations="shouldDisableAnimations"
          :particle-count="particleCount"
          :glow-color="glowColor"
          :enable-tilt="enableTilt"
          :click-effect="clickEffect"
          :enable-magnetism="enableMagnetism"
        >
          <div class="relative flex justify-between gap-3 text-white card__header">
            <span class="text-base card__label">{{ card.label }}</span>
          </div>
          <div class="relative flex flex-col text-white card__content">
            <h3 :class="`card__title font-normal text-base m-0 mb-1 ${textAutoHide ? 'text-clamp-1' : ''}`">
              {{ card.title }}
            </h3>
            <p :class="`card__description text-xs leading-5 opacity-90 ${textAutoHide ? 'text-clamp-2' : ''}`">
              {{ card.description }}
            </p>
          </div>
        </ParticleCard>

        <div
          v-else
          :class="baseClassName"
          :style="getCardStyle(card)"
          :ref="el => setupCardRef(el as HTMLDivElement, index)"
        >
          <div class="relative flex justify-between gap-3 text-white card__header">
            <span class="text-base card__label">{{ card.label }}</span>
          </div>
          <div class="relative flex flex-col text-white card__content">
            <h3 :class="`card__title font-normal text-base m-0 mb-1 ${textAutoHide ? 'text-clamp-1' : ''}`">
              {{ card.title }}
            </h3>
            <p :class="`card__description text-xs leading-5 opacity-90 ${textAutoHide ? 'text-clamp-2' : ''}`">
              {{ card.description }}
            </p>
          </div>
        </div>
      </template>
    </div>
  </BentoCardGrid>
</template>

<style>
.bento-section {
  --glow-x: 50%;
  --glow-y: 50%;
  --glow-intensity: 0;
  --glow-radius: 200px;
  --glow-color: v-bind(glowColor);
  --border-color: #333;
  --background-dark: #060010;
  --white: hsl(0, 0%, 100%);
}

.card-responsive {
  grid-template-columns: 1fr;
  width: 90%;
  margin: 0 auto;
  padding: 0.5rem;
}

@media (min-width: 600px) {
  .card-responsive {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .card-responsive {
    grid-template-columns: repeat(4, 1fr);
  }

  .card-responsive .card:nth-child(3) {
    grid-column: span 2;
    grid-row: span 2;
  }

  .card-responsive .card:nth-child(4) {
    grid-column: 1 / span 2;
    grid-row: 2 / span 2;
  }

  .card-responsive .card:nth-child(6) {
    grid-column: 4;
    grid-row: 3;
  }
}

.card--border-glow::after {
  content: '';
  position: absolute;
  inset: 0;
  padding: 6px;
  background: radial-gradient(
    var(--glow-radius) circle at var(--glow-x) var(--glow-y),
    rgba(v-bind(glowColor), calc(var(--glow-intensity) * 0.8)) 0%,
    rgba(v-bind(glowColor), calc(var(--glow-intensity) * 0.4)) 30%,
    transparent 60%
  );
  border-radius: inherit;
  mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  mask-composite: subtract;
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  pointer-events: none;
  transition: opacity 0.3s ease;
  z-index: 1;
}

.card--border-glow:hover::after {
  opacity: 1;
}

.card--border-glow:hover {
  box-shadow:
    0 4px 20px rgba(46, 24, 78, 0.4),
    0 0 30px rgba(v-bind(glowColor), 0.2);
}

.particle::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: rgba(v-bind(glowColor), 0.2);
  border-radius: 50%;
  z-index: -1;
}

.particle-container:hover {
  box-shadow:
    0 4px 20px rgba(46, 24, 78, 0.2),
    0 0 30px rgba(v-bind(glowColor), 0.2);
}

.text-clamp-1 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  overflow: hidden;
  text-overflow: ellipsis;
}

.text-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (max-width: 599px) {
  .card-responsive {
    grid-template-columns: 1fr;
    width: 90%;
    margin: 0 auto;
    padding: 0.5rem;
  }

  .card-responsive .card {
    width: 100%;
    min-height: 180px;
  }
}
</style>
