const sharedScopes = {
  comments: ['comment', 'punctuation.definition.comment'],
  accent: [
    'keyword',
    'storage',
    'entity.name.tag',
    'entity.name.function',
    'support.function',
    'support.type',
    'constant.language'
  ],
  soft: [
    'entity.other.attribute-name',
    'variable.other.property',
    'meta.object-literal.key',
    'support.variable.property'
  ],
  strings: ['string', 'string.quoted', 'string.template', 'constant.character.escape'],
  numbers: ['constant.numeric', 'constant.character', 'constant.other'],
  punctuation: ['punctuation', 'meta.brace', 'meta.delimiter']
};

type ThemeInput = {
  name: string;
  type: 'dark' | 'light';
  background: string;
  foreground: string;
  muted: string;
  accent: string;
  soft: string;
  string: string;
  number: string;
};

const createTheme = ({ name, type, background, foreground, muted, accent, soft, string, number }: ThemeInput) => ({
  name,
  type,
  colors: {
    'editor.background': background,
    'editor.foreground': foreground
  },
  settings: [
    { settings: { background, foreground } },
    { scope: sharedScopes.comments, settings: { foreground: muted, fontStyle: 'italic' } },
    { scope: sharedScopes.accent, settings: { foreground: accent } },
    { scope: sharedScopes.soft, settings: { foreground: soft, fontStyle: 'italic' } },
    { scope: sharedScopes.strings, settings: { foreground: string } },
    { scope: sharedScopes.numbers, settings: { foreground: number } },
    { scope: sharedScopes.punctuation, settings: { foreground: muted } }
  ]
});

export const vueBitsDarkTheme = createTheme({
  name: 'vue-bits-dark',
  type: 'dark',
  background: '#111111',
  foreground: '#d2e2d6',
  muted: '#6f8a78',
  accent: '#6ee7a0',
  soft: '#a0ffbc',
  string: '#afd5bc',
  number: '#bcfacd'
});

export const vueBitsLightTheme = createTheme({
  name: 'vue-bits-light',
  type: 'light',
  background: '#ffffff',
  foreground: '#38473e',
  muted: '#798d81',
  accent: '#15803d',
  soft: '#2f8a55',
  string: '#4f6b5a',
  number: '#2f8f55'
});
