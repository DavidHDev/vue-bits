import code from '@/content/Micro/SwipeRow/SwipeRow.vue?raw';
import { createCodeObject } from '@/types/code';

export const swipeRow = createCodeObject(code, 'Micro/SwipeRow', {
  usage: `<script setup>
import { h } from 'vue'
import { HugeiconsIcon } from '@hugeicons/vue'
import { Archive02Icon, Delete02Icon } from '@hugeicons/core-free-icons'
import SwipeRow from './SwipeRow.vue'

const icon = glyph => () => h(HugeiconsIcon, { icon: glyph, size: 20, strokeWidth: 2 })
const actions = [
  { id: 'delete', label: 'Delete', icon: icon(Delete02Icon) },
  { id: 'archive', label: 'Archive', icon: icon(Archive02Icon), dismiss: true }
]
</script>

<template>
<!-- the first action is the full-swipe one; every action that folds the row calls @commit -->
<SwipeRow label="Invoice #1042" :actions="actions" @commit="remove(item)">
  Invoice #1042
</SwipeRow>

<SwipeRow
  :actions="actions"
  :open="isOpen"
  actionColor="#e5484d"
  drawerColor="#3f3f46"
  rowColor="#27272a"
  textColor="#f5f5f5"
  :height="64"
  :radius="16"
  :actionWidth="80"
  direction="left"
  :snapBounce="0.2"
  :resistance="0.55"
  :collapseMs="200"
  :commitAt="0.6"
  fullSwipe
  @openChange="isOpen = $event"
  @action="onAction"
  @commit="onCommit"
>
  Row content
</SwipeRow>
</template>`
});
