<template>
  <div class="features-section">
    <div class="features-container">
      <div class="bento-grid" ref="gridRef">
        <ParticleCard class="feature-card card1" :disable-animations="isMobile">
          <div class="messages-gif-wrapper">
            <img src="/assets/messages.gif" alt="Messages animation" class="messages-gif" />
          </div>
          <h2>
            <template v-if="isMobile">100</template>
            <CountUp v-else :to="100" />
            %
          </h2>
          <h3>Free &amp; Open Source</h3>
          <p>Loved by developers around the world</p>
        </ParticleCard>

        <ParticleCard class="feature-card card2" :disable-animations="isMobile">
          <div class="components-gif-wrapper">
            <img src="/assets/components.gif" alt="Components animation" class="components-gif" />
          </div>
          <h2>
            <template v-if="isMobile">80</template>
            <CountUp v-else :to="80" />
            +
          </h2>
          <h3>Creative Components</h3>
          <p>Growing weekly &amp; only getting better</p>
        </ParticleCard>

        <ParticleCard class="feature-card card4" :disable-animations="isMobile">
          <h2>Modern</h2>
          <h3>Technologies</h3>
          <p>TypeScript + Tailwind, ready to ship</p>
        </ParticleCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, defineComponent, h, useTemplateRef } from 'vue';
import { gsap } from 'gsap';
import CountUp from '../../../content/Animations/CountUp/CountUp.vue';
import './FeatureCards.css';

const isMobile = ref(false);
const gridRef = useTemplateRef<HTMLDivElement>('gridRef');

const checkIsMobile = () => {
  isMobile.value = window.innerWidth <= 768;
};

onMounted(() => {
  checkIsMobile();
  window.addEventListener('resize', checkIsMobile);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkIsMobile);
});

const ParticleCard = defineComponent({
  name: 'ParticleCard',
  props: {
    disableAnimations: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { slots }) {
    const cardRef = ref<HTMLDivElement | null>(null);
    const particlesRef = ref<HTMLDivElement[]>([]);
    const timeoutsRef = ref<number[]>([]);
    const isHoveredRef = ref(false);
    const memoizedParticles = ref<HTMLDivElement[]>([]);
    const particlesInit = ref(false);

    const createParticle = (x: number, y: number): HTMLDivElement => {
      const el = document.createElement('div');
      el.className = 'particle';
      el.style.cssText = `
        position:absolute;width:4px;height:4px;border-radius:50%;
        background:#A7EF9E;box-shadow:0 0 6px rgba(132,0,255,.6);
        pointer-events:none;z-index:100;left:${x}px;top:${y}px;
      `;
      return el;
    };

    const memoizeParticles = () => {
      if (particlesInit.value || !cardRef.value) return;
      const { width, height } = cardRef.value.getBoundingClientRect();
      Array.from({ length: 12 }).forEach(() => {
        memoizedParticles.value.push(createParticle(Math.random() * width, Math.random() * height));
      });
      particlesInit.value = true;
    };

    const clearParticles = () => {
      timeoutsRef.value.forEach(clearTimeout);
      timeoutsRef.value = [];
      particlesRef.value.forEach(p =>
        gsap.to(p, {
          scale: 0,
          opacity: 0,
          duration: 0.3,
          ease: 'back.in(1.7)',
          onComplete: () => {
            if (p.parentNode) {
              p.parentNode.removeChild(p);
            }
          }
        })
      );
      particlesRef.value = [];
    };

    const animateParticles = () => {
      if (!cardRef.value || !isHoveredRef.value) return;
      if (!particlesInit.value) memoizeParticles();

      memoizedParticles.value.forEach((particle, i) => {
        const id = setTimeout(() => {
          if (!isHoveredRef.value || !cardRef.value) return;
          const clone = particle.cloneNode(true) as HTMLDivElement;
          cardRef.value.appendChild(clone);
          particlesRef.value.push(clone);

          gsap.set(clone, { scale: 0, opacity: 0 });
          gsap.to(clone, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' });
          gsap.to(clone, {
            x: (Math.random() - 0.5) * 100,
            y: (Math.random() - 0.5) * 100,
            rotation: Math.random() * 360,
            duration: 2 + Math.random() * 2,
            ease: 'none',
            repeat: -1,
            yoyo: true
          });
          gsap.to(clone, { opacity: 0.3, duration: 1.5, ease: 'power2.inOut', repeat: -1, yoyo: true });
        }, i * 100);
        timeoutsRef.value.push(id);
      });
    };

    const handleMouseEnter = () => {
      isHoveredRef.value = true;
      animateParticles();
    };

    const handleMouseLeave = () => {
      isHoveredRef.value = false;
      clearParticles();
    };

    onMounted(() => {
      if (props.disableAnimations || !cardRef.value) return;

      const node = cardRef.value;
      node.addEventListener('mouseenter', handleMouseEnter);
      node.addEventListener('mouseleave', handleMouseLeave);
    });

    onUnmounted(() => {
      if (cardRef.value) {
        cardRef.value.removeEventListener('mouseenter', handleMouseEnter);
        cardRef.value.removeEventListener('mouseleave', handleMouseLeave);
      }
      isHoveredRef.value = false;
      clearParticles();
    });

    return () =>
      h(
        'div',
        {
          ref: cardRef,
          class: 'particle-container',
          style: { position: 'relative', overflow: 'hidden' }
        },
        slots.default?.()
      );
  }
});
</script>
