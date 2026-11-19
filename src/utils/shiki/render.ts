import { createHighlighterCore, type HighlighterCore } from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';
import css from '@shikijs/langs/css';
import html from '@shikijs/langs/html';
import json from '@shikijs/langs/json';
import jsx from '@shikijs/langs/jsx';
import shellscript from '@shikijs/langs/shellscript';
import tsx from '@shikijs/langs/tsx';
import typescript from '@shikijs/langs/typescript';
import vue from '@shikijs/langs/vue';
import { vueBitsDarkTheme, vueBitsLightTheme } from './themes';

const LANGUAGE_ALIASES: Record<string, string> = {
  js: 'jsx',
  javascript: 'jsx',
  ts: 'typescript',
  bash: 'shellscript',
  sh: 'shellscript',
  shell: 'shellscript',
  zsh: 'shellscript'
};

let highlighterPromise: Promise<HighlighterCore> | null = null;

export const renderCode = async (code: string, language = 'vue') => {
  highlighterPromise ||= createHighlighterCore({
    themes: [vueBitsLightTheme, vueBitsDarkTheme],
    langs: [vue, html, jsx, tsx, typescript, css, shellscript, json],
    engine: createJavaScriptRegexEngine()
  });
  const highlighter = await highlighterPromise;
  const requested = LANGUAGE_ALIASES[language] || language || 'vue';
  const lang = highlighter.getLoadedLanguages().includes(requested) ? requested : 'text';

  return highlighter.codeToHtml(String(code), {
    lang,
    themes: {
      light: 'vue-bits-light',
      dark: 'vue-bits-dark'
    },
    defaultColor: false
  });
};
