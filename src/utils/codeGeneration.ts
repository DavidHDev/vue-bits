const toKebab = (name: string) =>
  name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const quoteString = (value: string) => `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;

export function formatJsLiteral(value: unknown): string {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (typeof value === 'string') return quoteString(value);
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (typeof value === 'function') return value.name && value.name !== 'anonymous' ? value.name : 'handler';
  if (Array.isArray(value)) return `[${value.map(formatJsLiteral).join(', ')}]`;
  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>).map(([key, entry]) => {
      const safeKey = /^[A-Za-z_$][\w$]*$/.test(key) ? key : quoteString(key);
      return `${safeKey}: ${formatJsLiteral(entry)}`;
    });
    return entries.length ? `{ ${entries.join(', ')} }` : '{}';
  }
  return String(value);
}

export function formatVueProp(propName: string, value: unknown, attrName = toKebab(propName)): string | null {
  if (value === undefined || value === null) return null;
  if (typeof value === 'string') {
    return value.includes('"') ? `:${attrName}="${formatJsLiteral(value)}"` : `${attrName}="${value}"`;
  }
  return `:${attrName}="${formatJsLiteral(value)}"`;
}

export function injectPropsIntoVueUsage(
  usageCode: string,
  props: Record<string, unknown>,
  defaultProps: Record<string, unknown>,
  componentName: string,
  demoOnlyProps: string[] = []
): string {
  if (!usageCode || !props || !componentName) return usageCode;

  const demoOnly = new Set(demoOnlyProps);
  const changed: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(props)) {
    if (demoOnly.has(key)) continue;
    if (JSON.stringify(value) !== JSON.stringify(defaultProps[key])) changed[key] = value;
  }
  if (Object.keys(changed).length === 0) return usageCode;

  const tagStart = usageCode.search(new RegExp(`<${escapeRegex(componentName)}(?=[\\s/>])`));
  if (tagStart === -1) return usageCode;

  let tagEnd = -1;
  let quote: string | null = null;
  for (let i = tagStart + componentName.length + 1; i < usageCode.length; i++) {
    const char = usageCode[i];
    if (quote) {
      if (char === quote) quote = null;
      continue;
    }
    if (char === '"' || char === "'") quote = char;
    else if (char === '>') {
      tagEnd = i;
      break;
    }
  }
  if (tagEnd === -1) return usageCode;

  const selfClosing = usageCode[tagEnd - 1] === '/';
  const before = usageCode.slice(0, tagStart);
  const after = usageCode.slice(tagEnd + 1);
  let tag = usageCode.slice(tagStart, tagEnd + 1);
  const additions: string[] = [];

  for (const [propName, value] of Object.entries(changed)) {
    const kebab = toKebab(propName);
    const names = [...new Set([kebab, propName])].map(escapeRegex).join('|');
    const attrRegex = new RegExp(`(^|\\s)((?::|v-bind:)?(?:${names}))(?:=(?:"[^"]*"|'[^']*'))?(?=[\\s/>])`, 'm');
    const match = tag.match(attrRegex);
    if (match) {
      const usedName = match[2].replace(/^(?::|v-bind:)/, '');
      const line = formatVueProp(propName, value, usedName);
      if (line === null) continue;
      tag = tag.replace(attrRegex, (_, lead) => `${lead}${line}`);
    } else {
      const line = formatVueProp(propName, value, kebab);
      if (line !== null) additions.push(line);
    }
  }

  if (additions.length > 0) {
    const indentMatch = tag.match(/\n([ \t]+)\S/);
    const baseIndent = (before.match(/(^|\n)([ \t]*)$/)?.[2] ?? '') + '  ';
    const indent = indentMatch ? indentMatch[1] : baseIndent;
    const closing = selfClosing ? '/>' : '>';
    const body = tag.slice(0, tag.length - closing.length).trimEnd();
    const closingIndent = before.match(/(^|\n)([ \t]*)$/)?.[2] ?? '';
    tag = `${body}\n${additions.map(line => `${indent}${line}`).join('\n')}\n${closingIndent}${closing}`;
  }

  return before + tag + after;
}
