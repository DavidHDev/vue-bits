import code from '@/content/Micro/PromptBar/PromptBar.vue?raw';
import { createCodeObject } from '@/types/code';

export const promptBar = createCodeObject(code, 'Micro/PromptBar', {
  installation: `npm install motion-v @hugeicons/vue @hugeicons/core-free-icons`,
  usage: `<template>
  <PromptBar
    placeholder="Ask anything"
    :sources="sources"
    :commands="[{ key: 'summarize', name: '/summarize', description: 'Digest the thread so far' }]"
    :models="[
      { key: 'nova-3', name: 'Nova 3', tag: 'Flagship' },
      { key: 'nova-mini', name: 'Nova Mini', tag: 'Fast' }
    ]"
    :efforts="['Low', 'Medium', 'High', 'Extra', 'Max']"
    :busy="busy"
    :on-attach="() => pickFiles()"
    :on-dictate="() => transcribe()"
    background="#272a27"
    color="#f5f5f5"
    menu-background="#313531"
    spark-color="#a0ffbc"
    :spark-boost="1"
    :width="400"
    :radius="16"
    :max-rows="5"
    :morph-duration="240"
    :squash="0.12"
    :tilt="8"
    :press-scale="0.96"
    @send="send"
    @stop="controller?.abort()"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Attachment01Icon, Globe02Icon } from '@hugeicons/core-free-icons';
import PromptBar, { type PromptBarSendDetail } from './PromptBar.vue';

const busy = ref(false);
let controller: AbortController | null = null;

const sources = [
  { key: 'files', name: 'Photos & files', description: 'Upload from this device', icon: Attachment01Icon, attach: true },
  { key: 'web', name: 'Web search', description: 'Live results', icon: Globe02Icon }
];

const send = async (text: string, { attachments, model, effort }: PromptBarSendDetail) => {
  busy.value = true;
  controller = new AbortController();
  await ask({ text, attachments, model: model?.key, effort, signal: controller.signal }).catch(() => {});
  busy.value = false;
};
</script>`
});
