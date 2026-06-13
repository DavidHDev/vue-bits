<template>
  <button
    :class="[
      'font-medium rounded-md px-3 py-2 fixed right-[12px] md:right-[2em] z-98 shadow-[10px_0_25px_rgba(0,0,6,1)] transition-all duration-300 ease back-to-top',
      visible ? 'opacity-100 cursor-pointer bottom-24 md:bottom-10' : 'opacity-0 cursor-default bottom-4'
    ]"
    @click="visible && scrollToTop()"
  >
    <i class="pi pi-arrow-up" style="color: #fff; font-size: 1rem"></i>
  </button>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast';
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
