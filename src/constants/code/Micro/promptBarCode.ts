import code from '@/content/Micro/PromptBar/PromptBar.vue?raw';
import { createCodeObject } from '@/types/code';

export const promptBar = createCodeObject(code, 'Micro/PromptBar', {
  usage: `<script setup>
import { ref } from 'vue'
import PromptBar from './PromptBar.vue'

const busy = ref(false)

const send = async (text, { attachments, model, effort }) => {
  busy.value = true
  await api.ask(text, { attachments, model: model?.key, effort })
  busy.value = false
}

// return file names (or a promise of them) and they show up as chips
const attach = () => openFilePicker()

// return the transcript (or a promise of it) and it lands in the draft
const dictate = () => listen()
</script>

<template>
<PromptBar
  placeholder="Ask anything"
  :busy="busy"
  :onAttach="attach"
  :onDictate="dictate"
  background="#27272a"
  color="#f5f5f5"
  menuBackground="#323236"
  sparkColor="#b39dff"
  :sparkBoost="1"
  :width="400"
  :radius="16"
  :maxRows="5"
  :morphDuration="240"
  :squash="0.12"
  :tilt="8"
  :pressScale="0.96"
  @send="send"
  @stop="() => api.cancel()"
  @effortChange="effort => console.log(effort)"
/>

<!-- your own rows -->
<PromptBar
  :sources="[{ key: 'docs', name: 'Docs', description: 'Search the wiki', icon: MyDocsIcon }]"
  :commands="[{ key: 'fix', name: '/fix', description: 'Fix the selection' }]"
  :models="[{ key: 'fast', name: 'Fast', tag: 'Cheap' }, { key: 'deep', name: 'Deep', tag: 'Slow' }]"
  :efforts="['Low', 'Medium', 'High']"
/>
</template>`
});
