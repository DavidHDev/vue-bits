<script setup lang="ts">
import { Check, ChevronDown, Copy } from 'lucide-vue-next';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { copyText, openInAI, type AiProvider } from './aiExport';

const RESET_MS = 2000;

const rootRef = ref<HTMLElement | null>(null);
const copied = ref(false);
const menuOpen = ref(false);

function elementToMarkdown(section: HTMLElement): string {
  const lines: string[] = [];

  const walk = (node: Element) => {
    const tag = node.tagName.toLowerCase();

    if (tag === 'h1') lines.push(`# ${node.textContent?.trim()}\n`);
    else if (tag === 'h2') lines.push(`## ${node.textContent?.trim()}\n`);
    else if (tag === 'h3') lines.push(`### ${node.textContent?.trim()}\n`);
    else if (tag === 'p') lines.push(`${node.textContent?.trim()}\n`);
    else if (tag === 'ul' || tag === 'ol') {
      node.querySelectorAll(':scope > li').forEach(li => lines.push(`- ${li.textContent?.trim()}`));
      lines.push('');
    } else if (tag === 'pre' || tag === 'code') {
      lines.push('```\n' + node.textContent?.trim() + '\n```\n');
    } else {
      Array.from(node.children).forEach(walk);
    }
  };

  Array.from(section.children).forEach(walk);
  return lines
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function getMarkdown(): string {
  const section = rootRef.value?.closest('.docs-page') as HTMLElement | null;
  return section ? elementToMarkdown(section) : '';
}

async function handleCopy() {
  const markdown = getMarkdown();
  if (!markdown) return;

  if (await copyText(markdown)) {
    copied.value = true;
    setTimeout(() => (copied.value = false), RESET_MS);
  }
}

function handleOpen(provider: AiProvider) {
  const markdown = getMarkdown();
  if (!markdown) return;
  menuOpen.value = false;
  openInAI(provider, `Read the Vue Bits documentation below, then help me apply it.\n\n${markdown}`);
}

function toggleMenu() {
  menuOpen.value = !menuOpen.value;
}

function handleOutsideClick(event: MouseEvent) {
  if (!rootRef.value?.contains(event.target as Node)) menuOpen.value = false;
}

function handleEscape(event: KeyboardEvent) {
  if (event.key === 'Escape') menuOpen.value = false;
}

onMounted(() => {
  document.addEventListener('click', handleOutsideClick);
  document.addEventListener('keydown', handleEscape);
});
onBeforeUnmount(() => {
  document.removeEventListener('click', handleOutsideClick);
  document.removeEventListener('keydown', handleEscape);
});
</script>

<template>
  <div ref="rootRef" class="inline-flex relative items-stretch">
    <button
      type="button"
      class="inline-flex items-center gap-2 pl-3.5 pr-3 h-9 rounded-l-[10px] text-sm font-medium text-(--text-primary) bg-(--bg-elevated) border border-(--border-primary) border-r-0 cursor-pointer transition-colors duration-200 hover:bg-white/7"
      aria-label="Copy this page as Markdown"
      @click="handleCopy"
    >
      <Check v-if="copied" :size="15" aria-hidden="true" />
      <Copy v-else :size="15" aria-hidden="true" />
      <span>{{ copied ? 'Copied' : 'Copy as Markdown' }}</span>
    </button>

    <button
      type="button"
      class="inline-flex items-center justify-center w-8 h-9 rounded-r-[10px] text-(--text-muted) bg-(--bg-elevated) border border-(--border-primary) cursor-pointer transition-colors duration-200 hover:bg-white/7 hover:text-(--text-primary)"
      aria-haspopup="menu"
      :aria-expanded="menuOpen"
      aria-label="More AI actions"
      @click="toggleMenu"
    >
      <ChevronDown :size="14" aria-hidden="true" />
    </button>

    <div
      v-if="menuOpen"
      role="menu"
      class="absolute right-0 top-[calc(100%+6px)] z-20 w-52 py-1.5 rounded-xl border border-(--border-primary) bg-(--bg-elevated) shadow-(--shadow-dropdown)"
    >
      <button
        type="button"
        role="menuitem"
        class="flex items-center gap-2.5 w-full px-3.5 py-2 text-sm text-left text-(--text-primary) bg-transparent border-0 cursor-pointer transition-colors duration-150 hover:bg-(--bg-hover)"
        @click="handleOpen('chatgpt')"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path
            d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.4069-.6813zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.4592a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z"
          />
        </svg>
        <span>Open in ChatGPT</span>
      </button>

      <button
        type="button"
        role="menuitem"
        class="flex items-center gap-2.5 w-full px-3.5 py-2 text-sm text-left text-(--text-primary) bg-transparent border-0 cursor-pointer transition-colors duration-150 hover:bg-(--bg-hover)"
        @click="handleOpen('claude')"
      >
        <svg width="15" height="15" viewBox="0 0 25 26" fill="currentColor" aria-hidden="true">
          <path
            d="M4.88965 17.0667L9.79192 14.2352L9.87394 13.9884L9.79192 13.8521H9.55217L8.73197 13.8001L5.93067 13.7222L3.50162 13.6183L1.14828 13.4884L0.555212 13.3585L0 12.6052L0.056783 12.2285L0.555212 11.8843L1.26815 11.9493L2.84546 12.0597L5.21142 12.2285L6.92753 12.3324L9.47015 12.6052H9.87394L9.93072 12.4363L9.79192 12.3324L9.68466 12.2285L7.23668 10.5205L4.58681 8.71517L3.19878 7.6761L2.44798 7.15008L2.06943 6.65652L1.90539 5.57849L2.58678 4.80568L3.50162 4.87062L3.73506 4.93557L4.66252 5.66941L6.64361 7.24749L9.2304 9.20873L9.60895 9.53344L9.76037 9.42303L9.7793 9.3451L9.60895 9.05287L8.20199 6.43572L6.7004 3.77311L6.03162 2.6691L5.85496 2.0067C5.79187 1.73394 5.7477 1.50665 5.7477 1.2274L6.52374 0.142872L6.95277 0L7.98748 0.142872L8.42282 0.532522L9.06636 2.04566L10.1074 4.42902L11.7225 7.66961L12.1957 8.63075L12.4481 9.52045L12.5427 9.7932H12.7068V9.63734L12.8393 7.81248L13.0853 5.57199L13.3251 2.68858L13.4071 1.87681L13.7983 0.902689L14.5743 0.376662L15.18 0.675393L15.6784 1.40923L15.609 1.88331L15.3125 3.86403L14.732 6.96824L14.3535 9.04637H14.5743L14.8267 8.78661L15.8488 7.39036L17.5649 5.18234L18.322 4.30563L19.2053 3.338L19.7731 2.87692H20.8457L21.6343 4.08483L21.281 5.33171L20.1769 6.77341L19.2621 7.99432L17.9497 9.81268L17.1295 11.2674L17.2053 11.3843L17.4008 11.3648L20.3662 10.7154L21.9687 10.4166L23.8804 10.0789L24.7448 10.4946L24.8394 10.9167L24.4987 11.7804L22.4545 12.3L20.057 12.7935L16.486 13.6637L16.4418 13.6962L16.4923 13.7611L18.1012 13.917L18.7889 13.956H20.4734L23.6091 14.1962L24.4293 14.7547L24.9214 15.4366L24.8394 15.9562L23.5776 16.6186L21.8741 16.2029L17.8993 15.2288L16.5365 14.8781H16.3472V14.995L17.4829 16.138L19.5649 18.0733L22.1706 20.567L22.3031 21.184L21.9687 21.671L21.6154 21.6191L19.3252 19.8462L18.4419 19.0474L16.4418 17.3134H16.3093V17.4953L16.7699 18.1902L19.2053 21.9568L19.3315 23.1127L19.1548 23.4894L18.5239 23.7167L17.8299 23.5868L16.404 21.5282L14.9339 19.2097L13.7478 17.1316L13.6027 17.216L12.9024 24.9766L12.5743 25.3727L11.8172 25.6714L11.1863 25.1779L10.8519 24.3791L11.1863 22.801L11.59 20.7424L11.9181 19.1058L12.2147 17.0732L12.3913 16.3978L12.3787 16.3523L12.2336 16.3718L10.7446 18.4759L8.4796 21.6256L6.68778 23.5998L6.25875 23.7751L5.51426 23.379L5.58366 22.6711L6.00007 22.0412L8.4796 18.7941L9.97489 16.7809L10.9402 15.6185L10.9339 15.4496H10.8771L4.29027 19.8527L3.11676 20.0085L2.61202 19.5215L2.67511 18.7227L2.91486 18.4629L4.89596 17.0602L4.88965 17.0667Z"
          />
        </svg>
        <span>Open in Claude</span>
      </button>
    </div>
  </div>
</template>
