import code from '@/content/Micro/DodgeField/DodgeField.vue?raw';
import { createCodeObject } from '@/types/code';

export const dodgeField = createCodeObject(code, 'Micro/DodgeField', {
  usage: `<script setup>
import DodgeField from './DodgeField.vue'
</script>

<template>
<DodgeField />

<DodgeField
  inkColor="#f5f5f5"
  contrastColor="#18181b"
  :fieldHeight="240"
  :reach="72"
  :radius="120"
  :falloff="2"
  :fleeDuration="130"
  :returnDuration="620"
  :returnBounce="0.1"
  axis="both"
  wall="clamp"
  :patience="4"
  @catch="console.log('caught')"
>
  <img class="avatar" src="/me.png" alt="" />
</DodgeField>

<DodgeField :patience="3" v-slot="{ dodges, gave }">
  <button type="button">
    {{ gave ? 'Okay, okay' : dodges ? 'Nope ' + dodges : 'Catch me' }}
  </button>
</DodgeField>
</template>`
});
