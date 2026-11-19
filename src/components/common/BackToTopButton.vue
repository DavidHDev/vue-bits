<template>
  <button
    type="button"
    class="back-to-top"
    :class="{ 'back-to-top--visible': visible }"
    :aria-hidden="!visible"
    aria-label="Back to top"
    @click="visible && scrollToTop()"
  >
    <FiArrowUp :size="16" color="var(--text-primary)" />
  </button>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast';
import { FiArrowUp } from 'vue-icons-plus/fi';
import { onMounted, onUnmounted, ref } from 'vue';

const toast = useToast();
const visible = ref(false);

const MESSAGES = [
  '🐴  Country roads, take me home!',
  '🚀  To infinity and beyond!',
  '🦾  Get to the choppa!',
  '🚕  Grove Street, home...',
  '🐉  Fus Ro Dah!',
  '🍄  The princess is in another castle!',
  '🦸‍♂️  Avengers, assemble!',
  '🗡️  It’s dangerous to go alone! Take this.',
  '📜  A wizard is never late.',
  '💍  Foul Tarnished, in search of the Elden Ring!',
  '🐊  See you later, alligator.',
  '🔥  Dracarys!'
];

const randomMessage = () => MESSAGES[Math.floor(Math.random() * MESSAGES.length)];

const scrollToTop = () => {
  window.scrollTo(0, 0);
  toast.add({
    severity: 'secondary',
    summary: randomMessage(),
    life: 3000
  });
};

const onScroll = () => {
  visible.value = window.scrollY > 500;
};

onMounted(() => {
  window.addEventListener('scroll', onScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll);
});
</script>

<style>
.back-to-top {
  position: fixed;
  right: 2em;
  bottom: 1em;
  z-index: 98;
  display: inline-flex;
  width: 44px;
  min-width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  padding: 0;
  border-radius: 12px;
  font-weight: 500;
  cursor: default;
  opacity: 0;
  transition:
    opacity var(--transition-slow),
    bottom var(--transition-slow),
    transform var(--dur-press) var(--ease-out);
}

.back-to-top--visible {
  bottom: 2.5em;
  cursor: pointer;
  opacity: 1;
}

.back-to-top--visible:active {
  transform: scale(0.94);
}

@media (max-width: 767px) {
  .back-to-top {
    right: 12px;
  }

  .back-to-top--visible {
    bottom: 6em;
  }
}

@media (prefers-reduced-motion: reduce) {
  .back-to-top--visible:active {
    transform: none;
  }
}
</style>
